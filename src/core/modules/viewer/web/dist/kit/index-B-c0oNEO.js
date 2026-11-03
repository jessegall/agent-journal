/* @code-commandments-generated */
import { openBlock as i, createElementBlock as u, renderSlot as pe, createElementVNode as p, normalizeClass as J, Fragment as Y, renderList as ae, normalizeStyle as $e, defineComponent as Xo, Comment as Qo, h as ps, cloneVNode as er, createBlock as K, withCtx as z, unref as U, createVNode as F, toDisplayString as v, createCommentVNode as $, inject as _e, computed as T, resolveDynamicComponent as it, Transition as yt, watch as ke, ref as B, shallowRef as fn, createTextVNode as ce, TransitionGroup as ya, mergeProps as Qe, reactive as ms, onMounted as Le, onUnmounted as Ee, nextTick as Nt, useId as wa, Teleport as gs, withModifiers as be, isRef as Bs, onBeforeUnmount as wt, resolveDirective as tr, withDirectives as et, useAttrs as vs, useModel as Vn, getCurrentInstance as nr, mergeModels as Kn, getCurrentScope as ka, onScopeDispose as ba, provide as sr, onErrorCaptured as ar, toHandlers as or, createSlots as rr, vShow as lr, useSlots as ir, withKeys as Tt, vModelText as Gn, defineAsyncComponent as cr } from "vue";
const G = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [s, a] of t)
    n[s] = a;
  return n;
}, ur = { class: "skeleton-line" }, dr = {
  __name: "SkeletonLine",
  props: { filled: Boolean, still: Boolean, bars: { type: Array, default: () => [] } },
  setup(e) {
    return (t, n) => (i(), u("span", ur, [
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
}, nt = /* @__PURE__ */ G(dr, [["__scopeId", "data-v-0ebb6933"]]), ys = Xo({
  props: { value: { type: [String, Number], default: "" } },
  setup(e, { slots: t }) {
    return () => {
      const n = t[String(e.value)] ? String(e.value) : "default", s = (t[n] ? t[n]() : []).filter((a) => a.type !== Qo);
      return s.length !== 1 ? ps(Y, { key: n }, s) : s[0].key == null ? er(s[0], { key: n }) : s[0];
    };
  }
}), hr = ["aria-label"], fr = ["aria-label"], pr = ["aria-label"], mr = ["aria-label"], gr = ["aria-label"], vr = ["aria-label"], yr = ["aria-label"], wr = {
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
    return (c, d) => (i(), K(ys, { value: e.shape }, {
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
        ], 8, hr)
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
        ], 8, fr)
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
        ], 8, pr)
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
        ], 8, mr)
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
          (i(!0), u(Y, null, ae(e.count, (h) => (i(), K(nt, {
            key: h,
            bars: U(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, gr)
      ]),
      text: z(() => [
        p("div", {
          class: "skeleton-text",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (i(!0), u(Y, null, ae(e.count, (h) => (i(), K(nt, {
            key: h,
            bars: U(l)
          }, null, 8, ["bars"]))), 128))
        ], 8, vr)
      ]),
      default: z(() => [
        p("div", {
          class: "skeleton-rows",
          "aria-busy": "true",
          "aria-label": e.label
        }, [
          (i(!0), u(Y, null, ae(e.count, (h) => (i(), K(nt, {
            key: h,
            class: "skeleton-row",
            bars: o
          }))), 128))
        ], 8, yr)
      ]),
      _: 1
    }, 8, ["value"]));
  }
}, kt = /* @__PURE__ */ G(wr, [["__scopeId", "data-v-c687fb85"]]), kr = {
  key: 1,
  class: "empty-state titled"
}, br = { class: "empty-state-title" }, $r = { class: "empty-state-text" }, xr = {
  key: 2,
  class: "empty-state"
}, Mr = {
  __name: "EmptyState",
  props: { title: { type: String, default: "" }, loading: Boolean, shape: { type: String, default: "rows" } },
  setup(e) {
    return (t, n) => e.loading ? (i(), K(kt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.title ? (i(), u("div", kr, [
      p("p", br, v(e.title), 1),
      p("p", $r, [
        pe(t.$slots, "default", {}, void 0, !0)
      ])
    ])) : (i(), u("p", xr, [
      pe(t.$slots, "default", {}, void 0, !0)
    ]));
  }
}, nn = /* @__PURE__ */ G(Mr, [["__scopeId", "data-v-b27e89b0"]]), _r = { class: "fold-group" }, Sr = ["aria-expanded"], Er = { class: "fold-label" }, Cr = {
  key: 0,
  class: "fold-count"
}, Ar = {
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
    return (s, a) => (i(), u("div", _r, [
      p("button", {
        type: "button",
        class: J(["fold-head", { flush: e.flush, bar: e.bar }]),
        "aria-expanded": e.open,
        onClick: a[0] || (a[0] = (o) => n("toggle"))
      }, [
        p("span", Er, v(e.label), 1),
        e.count !== "" ? (i(), u("span", Cr, v(e.count), 1)) : $("", !0),
        p("span", {
          class: J(["fold-mark", { shut: !e.open }])
        }, null, 2)
      ], 10, Sr),
      e.open ? pe(s.$slots, "default", {}, void 0, !0, 0) : $("", !0)
    ]));
  }
}, Ay = /* @__PURE__ */ G(Ar, [["__scopeId", "data-v-9ef1865c"]]), Or = Symbol("open-view"), Ce = Symbol.for("journal.window-context");
function pn() {
  const e = _e(Ce, null);
  if (!e) throw new Error("useWindow is called only inside a window the viewer hosts");
  return e;
}
const Tr = {
  __name: "Spinner",
  props: { size: { type: Number, default: 9 } },
  setup(e) {
    return (t, n) => (i(), u("span", {
      class: "spinner",
      style: $e({ width: `${e.size}px`, height: `${e.size}px`, borderWidth: e.size > 14 ? "2px" : "1px" })
    }, null, 4));
  }
}, Rr = /* @__PURE__ */ G(Tr, [["__scopeId", "data-v-eb453d6f"]]), Ir = {
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
    return (s, a) => (i(), K(it(e.href ? "a" : "button"), {
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
        e.busy ? (i(), K(Rr, {
          key: 0,
          class: "btn-spinner"
        })) : $("", !0)
      ]),
      _: 3
    }, 8, ["type", "href", "class", "aria-busy", "disabled"]));
  }
}, we = /* @__PURE__ */ G(Ir, [["__scopeId", "data-v-a2dc4bda"]]), Br = {
  class: "running",
  "data-running-command": ""
}, Lr = ["title"], Dr = {
  key: "idle",
  class: "running-idle"
}, Nr = {
  __name: "RunningCommand",
  props: { text: { type: String, default: "" }, idle: { type: String, default: "waiting" } },
  setup(e) {
    return (t, n) => (i(), u("span", Br, [
      F(yt, {
        name: "roll",
        mode: "out-in"
      }, {
        default: z(() => [
          e.text ? (i(), u("span", {
            key: e.text,
            class: "running-line",
            title: e.text
          }, v(e.text), 9, Lr)) : (i(), u("span", Dr, v(e.idle), 1))
        ]),
        _: 1
      })
    ]));
  }
}, Oy = /* @__PURE__ */ G(Nr, [["__scopeId", "data-v-d3240219"]]), jr = ["aria-checked", "aria-label", "title"], Pr = {
  key: 0,
  class: "switch-inner"
}, qr = {
  key: 0,
  class: "switch-word"
}, Wr = {
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
        e.labelled ? (i(), u("span", Pr, v(e.word), 1)) : $("", !0),
        a[1] || (a[1] = p("span", { class: "knob" }, null, -1))
      ], 2),
      e.word && !e.labelled ? (i(), u("span", qr, v(e.word), 1)) : $("", !0)
    ], 10, jr));
  }
}, Ty = /* @__PURE__ */ G(Wr, [["__scopeId", "data-v-1bfb90f3"]]);
function $a(e, t, n) {
  try {
    const s = e().getItem(t);
    return s === null ? n : JSON.parse(s);
  } catch {
    return n;
  }
}
function Rt(e, t) {
  return $a(() => localStorage, e, t);
}
function xa(e, t, n) {
  try {
    return e().setItem(t, JSON.stringify(n)), !0;
  } catch {
    return !1;
  }
}
function mn(e, t) {
  return xa(() => localStorage, e, t);
}
function Ma(e, t) {
  ke(t, (n) => mn(e, n), { deep: !0 });
}
function Fr(e, t) {
  return $a(() => sessionStorage, e, t);
}
function Hr(e, t) {
  return xa(() => sessionStorage, e, t);
}
const sn = "journal.environment", _a = B(Fr(sn, Rt(sn, "")));
function Ur(e) {
  _a.value = e, Hr(sn, e), mn(sn, e);
}
const an = B(location.hash), Ls = fn(null), Ds = { integrations: "mcp", library: "team" };
function zr() {
  if (!Ls.value) return;
  const [e, t] = location.hash.replace(/^#\/?/, "").split("?"), [n = "", ...s] = e.split("/");
  if (Ds[n]) {
    location.replace(`#/${[Ds[n], ...s].join("/")}${t ? `?${t}` : ""}`), an.value = location.hash;
    return;
  }
  !n || Ls.value(n) || (Ur(n), location.replace(`#/${s.join("/")}${t ? `?${t}` : ""}`), an.value = location.hash);
}
window.addEventListener("hashchange", () => {
  an.value = location.hash, zr();
});
const Fe = T(() => {
  const [e, t = ""] = an.value.replace(/^#\/?/, "").split("?"), [n = "", s = ""] = e.split("/"), a = new URLSearchParams(t), o = (a.get("open") || "").split(",").filter(Boolean).map((l) => {
    const [r, c = ""] = l.split("@"), [d = "", h = "", m = ""] = r.split(":");
    return { table: d, id: Number(h), comment: Number(m) || 0, env: c };
  });
  return {
    env: _a.value,
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
function Vr(e = "", t = 0, n = "") {
  location.hash = gn.page(e, t, n);
}
const Kr = (e) => `${e.table}:${e.id}${e.comment ? `:${e.comment}` : ""}${e.env ? `@${e.env}` : ""}`;
function Sa(e, t = "") {
  const [n, s = ""] = location.hash.replace(/^#/, "").split("?"), o = [...[...new URLSearchParams(s)].filter(([l]) => l !== "open" && l !== "sub").map(([l, r]) => `${l}=${encodeURIComponent(r)}`), ...e.length ? [`open=${e.map(Kr).join(",")}`] : [], ...t ? [`sub=${t}`] : []].join("&");
  location.hash = `#${n}${o ? `?${o}` : ""}`;
}
const gt = {};
function Ry(e, t) {
  return gt[e] = t, () => gt[e] === t && delete gt[e];
}
function Ea(e, t, n = 0, s = "") {
  var l;
  if (e === "plugins") return location.hash = `#/plugins?plugin=${t}`;
  if (!n && !s && ((l = gt[e]) != null && l.call(gt, t))) return;
  const a = Fe.value.stack, o = a.findIndex((r) => r.table === e && r.id === t);
  Sa([...o < 0 ? a : a.slice(0, o), { table: e, id: t, comment: n }], s);
}
function Gr(e, t, n, s = 0, a = "") {
  if (e === Fe.value.env) return Ea(t, n, s, a);
  const o = Fe.value.stack, l = o.findIndex((r) => r.table === t && r.id === n && r.env === e);
  Sa([...l < 0 ? o : o.slice(0, l), { table: t, id: n, comment: s, env: e }], a);
}
function He(e, t = "") {
  const [n, s] = e.split("@"), [a, o] = n.split(":");
  return s ? Gr(s, a, Number(o), 0, t) : Ea(a, Number(o), 0, t);
}
function Yr(e) {
  const t = e.target.closest("[data-peek]");
  return t ? (e.preventDefault(), e.stopPropagation(), t.dataset.peek) : "";
}
function pt(e) {
  const t = Yr(e);
  t && He(t, e.target.closest("[data-peek]").dataset.sub || "");
}
const vn = typeof document < "u" && document.documentElement.classList.contains("phone"), Jr = "Files are attached on the computer; the phone sends text.", xn = [
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
}), jt = {
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
}, Zr = ["secrets", "plugins"], Ca = Object.keys(jt).filter((e) => !(vn && Zr.includes(e)));
T(() => Ca.map((e) => ({ name: e, ...jt[e] })));
const Pt = (e) => jt[e], Aa = new Map(Ca.flatMap((e) => [e, e.replace(/s$/, ""), jt[e].title.toLowerCase()].map((t) => [t, e]))), lt = (e) => Aa.get(String(e).toLowerCase()) || "", Oa = [...Aa.keys()].sort((e, t) => t.length - e.length).join("|"), Xr = ["stroke-width", "innerHTML"], ve = {
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
    }, null, 12, Xr));
  }
}, yn = {
  __name: "CloseButton",
  props: { title: { type: String, default: "Close" } },
  setup(e) {
    return (t, n) => (i(), K(we, {
      kind: "icon",
      "aria-label": e.title
    }, {
      default: z(() => [
        F(ve, { name: "x" })
      ]),
      _: 1
    }, 8, ["aria-label"]));
  }
}, Qr = {
  key: 1,
  class: "row-list-failure"
}, el = ["data-row"], tl = {
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
    const t = e, n = T(() => t.arrival ? { tag: "ul", css: !1, onEnter: t.arrival.enter, onLeave: t.arrival.leave } : {}), s = B(!1);
    async function a(o) {
      s.value = !await o();
    }
    return (o, l) => !e.loaded && !e.failure ? (i(), K(kt, {
      key: 0,
      shape: e.shape
    }, null, 8, ["shape"])) : e.failure ? (i(), u("p", Qr, v(e.failure), 1)) : !e.rows.length && e.loaded ? (i(), K(nn, {
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
      (i(), K(it(e.arrival ? ya : "ul"), Qe(n.value, { class: "row-list" }), {
        default: z(() => [
          (i(!0), u(Y, null, ae(e.rows, (r) => (i(), u("li", {
            key: r.id,
            class: "row-list-row",
            "data-row": r.id
          }, [
            pe(o.$slots, "default", { row: r }, void 0, !0)
          ], 8, el))), 128))
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
}, nl = /* @__PURE__ */ G(tl, [["__scopeId", "data-v-aa6ad7ff"]]), sl = {
  class: "agent-rows",
  "data-agent-rows": ""
}, al = {
  key: 1,
  class: "agent-rows-note"
}, ol = {
  key: 2,
  class: "agent-rows-note"
}, rl = {
  class: "agent-rows-note",
  "data-agent-rows-count": ""
}, ll = ["data-agent-row", "onClick"], il = { class: "agent-row-name" }, cl = { class: "agent-row-state" }, ul = {
  __name: "AgentRowList",
  props: { rows: { type: Array, required: !0 }, loaded: Boolean, failure: { type: String, default: "" }, none: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = T(() => [...t.rows].sort((a, o) => !!a.ended_at - !!o.ended_at || o.id - a.id)), s = T(() => t.rows.filter((a) => !a.ended_at).length);
    return (a, o) => (i(), u("div", sl, [
      e.loaded ? e.failure ? (i(), u("p", al, v(e.failure), 1)) : e.rows.length ? (i(), u(Y, { key: 3 }, [
        p("p", rl, v(s.value) + " running", 1),
        (i(!0), u(Y, null, ae(n.value, (l) => (i(), u("button", {
          key: l.id,
          type: "button",
          class: "agent-row",
          "data-agent-row": l.id,
          onClick: (r) => U(He)(`agents:${l.id}`)
        }, [
          p("span", il, "#" + v(l.id) + " " + v(l.session), 1),
          p("span", cl, v(l.ended_at ? "Closed" : "Running"), 1)
        ], 8, ll))), 128))
      ], 64)) : (i(), u("p", ol, v(e.none), 1)) : (i(), K(kt, {
        key: 0,
        shape: "text"
      }))
    ]));
  }
}, Iy = /* @__PURE__ */ G(ul, [["__scopeId", "data-v-a01e5a17"]]), dl = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (i(), u("span", {
      class: J(["badge", e.tone])
    }, v(e.text), 3));
  }
}, Ta = /* @__PURE__ */ G(dl, [["__scopeId", "data-v-9e7e1157"]]), hl = ["aria-valuenow", "aria-valuemax"], fl = {
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
    ], 10, hl));
  }
}, pl = /* @__PURE__ */ G(fl, [["__scopeId", "data-v-9eba6a85"]]), ml = { class: "bars" }, gl = { class: "bar-name" }, vl = { class: "bar-value" }, yl = {
  __name: "BarList",
  props: { items: { type: Array, required: !0 }, unit: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = T(() => Math.max(1, ...n.items.map((l) => Number(l.value) || 0))), o = T(() => /^[a-z]/i.test(n.unit) ? ` ${n.unit}` : n.unit);
    return (l, r) => (i(), u("div", ml, [
      (i(!0), u(Y, null, ae(e.items, (c, d) => (i(), K(it(c.open ? "button" : "div"), {
        key: `${d}-${c.label}`,
        type: c.open ? "button" : void 0,
        class: J(["bar-row", c.tone, { opens: c.open }]),
        onClick: (h) => c.open && s("open", c.open)
      }, {
        default: z(() => [
          p("span", gl, v(c.label), 1),
          F(pl, {
            value: Number(c.value) || 0,
            max: a.value,
            tone: c.tone,
            least: 2
          }, null, 8, ["value", "max", "tone"]),
          p("span", vl, v(c.value) + v(o.value), 1)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, wl = /* @__PURE__ */ G(yl, [["__scopeId", "data-v-663427f4"]]), kl = { class: "bars" }, bl = {
  key: 0,
  class: "bars-title"
}, $l = {
  __name: "DashboardBars",
  props: { node: { type: Object, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (i(), u("div", kl, [
      e.node.title ? (i(), u("span", bl, v(e.node.title), 1)) : $("", !0),
      F(wl, {
        items: e.node.items,
        unit: e.node.unit || "",
        onOpen: a[0] || (a[0] = (o) => n("open", o))
      }, null, 8, ["items", "unit"])
    ]));
  }
}, xl = /* @__PURE__ */ G($l, [["__scopeId", "data-v-7135bb11"]]), Ml = {
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
      (i(!0), u(Y, null, ae(e.node.children || [], (c, d) => (i(), K(oo, {
        key: d,
        node: c,
        onOpen: r[0] || (r[0] = (h) => a("open", h)),
        onFile: r[1] || (r[1] = (h) => a("file", h))
      }, null, 8, ["node"]))), 128))
    ], 6));
  }
}, Qt = /* @__PURE__ */ G(Ml, [["__scopeId", "data-v-d142a3f4"]]), _l = {
  key: 0,
  class: "card-head"
}, Sl = { class: "card-title" }, El = {
  key: 0,
  class: "card-note"
}, Cl = {
  __name: "DashboardCard",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (i(), u("section", {
      class: J(["card", { opens: e.node.open }]),
      onClick: a[2] || (a[2] = (o) => e.node.open && n("open", e.node.open))
    }, [
      e.node.title ? (i(), u("header", _l, [
        p("span", Sl, v(e.node.title), 1),
        e.node.note ? (i(), u("span", El, v(e.node.note), 1)) : $("", !0)
      ])) : $("", !0),
      F(Qt, {
        node: { type: "stack", gap: 10, children: e.node.children },
        onOpen: a[0] || (a[0] = (o) => n("open", o)),
        onFile: a[1] || (a[1] = (o) => n("file", o))
      }, null, 8, ["node"])
    ], 2));
  }
}, Al = /* @__PURE__ */ G(Cl, [["__scopeId", "data-v-67b72d40"]]), Ol = (e) => "task_ids" in e, Ra = 1024, Tl = Ra * 1024 * 1024, Rl = (e) => `"${e.name}" is ${Math.ceil(e.size / (1024 * 1024))} MB, over the ${Ra} MB limit for one file.`;
function Il() {
  return () => {
  };
}
const mt = ms({
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
}), Bl = () => !!(mt.version || mt.external) && !mt.failure && !mt.late, Ia = () => !!mt.countdown || Bl() || mt.starting, Ns = 2e4, Ll = 3e5, qe = 6e5, zt = 6, Dl = 500, Nl = "/journal/summary", js = vn ? { "X-Phone": "1" } : { "X-Journal-Viewer": "1" }, jl = (e) => e.split("?")[0].endsWith(Nl), Ba = (e, t) => Object.assign(new Error(t), { status: e });
async function Pl(e, t, n = Ba) {
  const s = await e.json().catch(() => ({}));
  if (!e.ok) throw Object.assign(n(e.status, s.error || t), { blocked: !!s.blocked, details: s });
  return s;
}
const ql = (e) => e === void 0 || e instanceof FormData ? e : JSON.stringify(e);
class Wl {
  constructor() {
    this.flying = /* @__PURE__ */ new Map(), this.written = () => {
    }, this.refused = () => {
    }, this.watcher = () => {
    }, this.tries = zt;
  }
  attemptOnce(t) {
    this.tries = 1;
    try {
      return t();
    } finally {
      this.tries = zt;
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
        headers: { ...js, ...l, ...s === void 0 || r ? {} : { "Content-Type": "application/json" } },
        body: ql(s),
        signal: AbortSignal.timeout(a || (r ? Ll : Ns))
      });
    } catch (c) {
      if (t !== "GET" || !(c instanceof TypeError) || o <= 1) throw c;
      return await new Promise((d) => setTimeout(d, Dl)), this.reach(t, n, s, a, o - 1, l);
    }
  }
  async send(t, n, s, a = 0, o = zt, l = {}) {
    this.watcher("sent", t, n, s);
    const r = t === "GET" ? () => {
    } : Il(), c = await this.reach(t, n, s, a, o, l).finally(() => {
      r(), this.watcher("answered", t, n, s);
    });
    return Pl(c, `${c.status} ${c.statusText}`).catch((d) => {
      throw d.blocked && t !== "GET" && this.refused(d.message), d;
    });
  }
  // a file's bytes, which are not JSON, at an address that names its environment itself
  async bytes(t) {
    const n = await fetch(t, { headers: js, signal: AbortSignal.timeout(Ns) });
    if (!n.ok) throw Ba(n.status, `The file could not be read: ${n.status} ${n.statusText}`);
    return n.arrayBuffer();
  }
  // a read is keyed by what it reads, never by its query: while a read of a key is in flight, a read of the same key is not
  // sent, and its caller takes the answer of the one in flight
  request(t, n, s, a = 0, o = {}, l = n.split("?")[0]) {
    if (t !== "GET") return this.send(t, n, s, a, zt, o).then((c) => (this.written(n), c));
    if (Ia() && !jl(n))
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
const De = new Wl(), Se = (e) => encodeURIComponent(e);
function fe(e) {
  const t = new URLSearchParams(
    Object.entries(e).filter(([, n]) => n != null && n !== !1 && n !== "")
  );
  return t.toString() ? `?${t}` : "";
}
const xt = ({ before: e, after: t, since: n, ids: s = [], tasks: a = [], closed: o = !1, docked: l = !1 }) => [l ? "docked" : "", o ? "closed" : "", a.length ? `tasks:${a.join(",")}` : s.length ? `ids:${s.join(",")}` : e ? "older" : t ? "newer" : n ? "changes" : "page"].filter(Boolean).join("."), Mt = "the page does not know its environment yet", Fl = "X-Journal-Env", Hl = "X-Journal-Request-At", Mn = "/viewer/voices/figures/";
class ws {
  constructor({ env: t = () => Fe.value.env, base: n = "" } = {}) {
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
    return { [Hl]: String(Date.now()), ...this.env() ? { [Fl]: this.env() } : {} };
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
    if (vn) return Promise.reject(Object.assign(new Error(Jr), { status: 403 }));
    if (s.size > Tl) return Promise.reject(new Error(Rl(s)));
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
    return De.request("GET", Mn + "figures.json");
  }
  voiceFigureUrl(t) {
    return Mn + t;
  }
  figureDecoderUrl() {
    return Mn + "draco/";
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
const je = new ws({ base: vn ? "/p" : "" }), Ul = (e) => De.onWrite((t) => {
  const n = new URL(t, location.origin);
  n.origin === location.origin && e(n.pathname.slice(je.base.length).split("/")[2]);
}), Ps = Object.freeze({
  "outbox.retry": { read: ({ retry: e }) => e(), every: 5e3 }
}), zl = 6e4, Vl = 4, Kl = 300, Gl = 5e3, La = /* @__PURE__ */ new Map();
function wn(e) {
  if (!(e in Ps)) throw new Error(`no poller ${e} is declared in sync/pollers.js`);
  return Ps[e];
}
function Yl(e) {
  const t = wn(e.key).every;
  if (typeof t != "function") return t;
  try {
    return t();
  } catch {
    return Gl;
  }
}
const Jl = (e) => e / 2 + Math.random() * e / 2, Da = (e) => [...e.users.values()].pop(), ks = (e) => La.get(e.place) === e, Zl = () => Math.random() * Kl, bs = () => document.hidden;
function Xl(e) {
  const t = Yl(e);
  return e.failures ? Jl(Math.min(zl, t * 2 ** e.failures)) : Math.max(t, Vl * e.took);
}
function Na(e, t) {
  clearTimeout(e.timer), !(!ks(e) || bs()) && (e.timer = setTimeout(() => Ql(e), t));
}
function Ql(e) {
  return ks(e) ? e.running ? (e.again = !0, e.running) : (e.running = si(e).finally(() => e.running = null), e.running) : Promise.resolve();
}
const ei = (e) => {
  var t, n;
  return !bs() && (((n = (t = wn(e.key)).active) == null ? void 0 : n.call(t)) ?? !0) && Da(e).active() && !Ia();
};
async function ti(e) {
  const t = performance.now();
  e.started = t;
  try {
    const n = await De.attemptOnce(() => wn(e.key).read(Da(e).params()));
    return e.took = performance.now() - t, e.failures = 0, n;
  } catch (n) {
    throw e.failures += 1, n;
  }
}
function ni(e, t) {
  var n, s;
  e.last = { got: t }, (s = (n = wn(e.key)).take) == null || s.call(n, t), e.users.forEach((a) => a.take(t));
}
async function si(e) {
  do {
    e.again = !1, clearTimeout(e.timer);
    try {
      ei(e) && ni(e, await ti(e));
    } catch (t) {
      e.users.forEach((n) => n.failed(t));
    }
  } while (e.again && ks(e));
  Na(e, Xl(e));
}
const ai = () => bs() || La.forEach((e) => Na(e, Zl()));
document.addEventListener("visibilitychange", ai);
const Me = (e) => typeof e == "number" ? e : e ? Date.parse(e) / 1e3 : 0, qs = (e) => (e || "").split(`
`).find((t) => t.trim()) || "", _n = 80;
function Ws(e) {
  return e.length <= _n ? e : `${e.slice(0, _n + 1).replace(/\s+\S*$/, "") || e.slice(0, _n)}…`;
}
const Fs = {
  messages: (e) => Ws(qs(e.text)),
  comments: (e) => Ws(qs(e.text)),
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
}, oi = (e) => (Fs[e.table] ? Fs[e.table](e) : e.title || "") || "", ri = ["done", "cancelled"], Yn = {
  tasks: (e) => Me(e.completed_at) || (e.state === "cancelled" ? Me(e.updated_at) : 0),
  questions: (e) => e.answer ? Me(e.updated_at) : 0,
  plans: (e) => ri.includes(e.state) ? Me(e.updated_at) : 0,
  pins: (e) => Me(e.closed_at),
  secrets: (e) => Me(e.deleted_at),
  workers: (e) => e.state === "stopped" ? Me(e.updated_at) : 0,
  shares: (e) => Me(e.stopped_at),
  dumps: (e) => Me(e.completed_at),
  agents: (e) => e.state === "ended" ? Me(e.updated_at) : 0,
  // a check a wait made for itself is listed apart from the project's own, under Waits
  checks: (e) => e.wait_target ? Me(e.created_at) : 0
}, li = (e) => Yn[e.table] ? Yn[e.table](e) : 0, ja = (e) => li(e) > 0, ii = (e) => !!Yn[e], Pa = (e) => Me(e.created_at), Jn = (e) => Me(e.updated_at) || Pa(e), ci = 60, ui = (e, t) => Me(e.created_at) >= Me(t.created_at) - ci, di = (e, t) => e.id > 0 && e.table === t.table && ui(e, t) && Object.entries(t.same || {}).every(([n, s]) => JSON.stringify(e[n]) === JSON.stringify(s)), $s = (e, t) => e.filter((n) => n.id !== 0 || !t.some((s) => di(s, n))), hi = { me: 1, people: [] }, ue = ms({
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
  people: hi,
  offline: !1,
  agentWrites: {},
  bar: null,
  streamOpen: !1,
  booted: !1,
  activity: Rt("journal.activity", !0),
  wide: !1,
  sideMini: Rt("journal.side.mini", !1),
  focus: "",
  sideOpen: !1,
  activityOpen: !1
});
Ma("journal.activity", () => ue.activity);
Ma("journal.side.mini", () => ue.sideMini);
const fi = 50, qa = 100, pi = { messages: 25 }, Ne = (e) => pi[e] || fi;
function mi(e, t) {
  if (e !== "messages") return Math.max(t.length - Ne(e), 0);
  let n = 0;
  for (let s = t.length - 1; s >= 0; s--)
    if (t[s].author !== "system" && (n += 1), n === Ne(e)) return s;
  return 0;
}
const tt = /* @__PURE__ */ new Set(), xs = B(0), qt = /* @__PURE__ */ new Set(), Wt = /* @__PURE__ */ new Set(), Ge = /* @__PURE__ */ new Set(), Zn = /* @__PURE__ */ new Set(), gi = /* @__PURE__ */ new Map(), vi = /* @__PURE__ */ new Map();
let _t = !1, St = null;
const yi = (e, t) => e.id - t.id, wi = (e, t) => String(e.created_at).localeCompare(String(t.created_at)) || e.id - t.id, ki = { messages: wi }, Wa = (e) => ki[e] || yi;
function Fa(e) {
  return xs.value, tt.has(e) || (tt.add(e), ue.booted && (!qt.has(e) || Wt.has(e)) && queueMicrotask(() => Ms([e], !1))), ue.rows[e] || [];
}
function bi(e) {
  const t = ue.rows[e] || [], n = mi(e, t);
  if (n === 0) return;
  const s = new Set(t.slice(n));
  ue.rows[e] = t.filter((a) => s.has(a) || ii(e) && !ja(a)), ue.paging.size[e] = Ne(e), ue.paging.more[e] = !0;
}
const $i = /* @__PURE__ */ new Set();
function xi() {
  tt.forEach(bi), tt.clear(), gi.clear(), vi.clear(), xs.value += 1;
}
ke(() => `${Fe.value.env}/${Fe.value.page}/${Fe.value.open ? Fe.value.open.table : ""}`, xi);
ke(
  () => ue.booted,
  (e) => e && Ms(
    [...tt].filter((t) => !qt.has(t)),
    !1
  )
);
const Xn = (e) => (e.table === "docs" || e.table === "reports") && !("body" in e) || e.table === "workers" && !("report" in e) || e.table === "plans" && !Ol(e) || e.table === "reactions" && !("message_id" in e) || e.table === "tasks" && !("plan_id" in e);
function Ha(e, t) {
  const n = new Map(e.filter((s) => s.id > 0).map((s) => [s.id, s]));
  return t.map((s) => {
    const a = n.get(s.id);
    return a && (Xn(s) && !Xn(a) && a.updated_at === s.updated_at && s.table !== "plans" || JSON.stringify(a) === JSON.stringify(s)) ? a : s;
  });
}
function Ua(e, t) {
  qt.add(e), xs.value += 1;
  const n = ue.rows[e] || [];
  ue.rows[e] = [...Ha(n, t.rows), ...$s(n.filter((s) => s.id === 0), t.rows)], ue.paging.size[e] = ue.paging.size[e] || Ne(e), ue.paging.more[e] = !t.is_last_page;
}
async function Mi(e) {
  const t = new Set((ue.rows[e] || []).map((o) => o.id)), n = await je.list(e, { limit: Ne(e) });
  kn(e, n.counts);
  const s = new Set(n.rows.map((o) => o.id)), a = $s((ue.rows[e] || []).filter((o) => !t.has(o.id) && !s.has(o.id)), n.rows);
  return Ua(e, { ...n, rows: [...n.rows, ...a].sort(Wa(e)) }), ue.paging.size[e] = Ne(e), za.has(e) && await Va(e), ue.rows[e];
}
const kn = (e, t) => ue.counts = { ...ue.counts, [e]: t };
async function _i(e) {
  const t = ue.rows[e] || [], n = Math.max(0, ...t.map(Jn)), s = t.length ? Math.min(...t.map((r) => r.id)) - 1 : 0, a = await je.list(e, { limit: Ne(e), since: n, after: s });
  if (kn(e, a.counts), !a.is_last_page) return Mi(e);
  const o = new Map(a.rows.map((r) => [r.id, r])), l = $s(t.filter((r) => !o.has(r.id)), a.rows).concat(Ha(t, a.rows));
  return ue.rows[e] = l.sort(Wa(e)), ue.paging.size[e] = ue.rows[e].length, ue.rows[e];
}
const Sn = /* @__PURE__ */ new Set();
async function Si(e, t = !1) {
  e.forEach((n) => Wt.delete(n)), e.forEach((n) => Zn.add(n));
  try {
    await Ii(e, t);
  } finally {
    e.forEach((n) => Zn.delete(n));
  }
}
async function Ei(e) {
  const t = await je.list(e, { limit: Ne(e) });
  kn(e, t.counts), Ua(e, t);
}
async function Ci(e) {
  kn(e, (await je.list(e, { limit: 1, closed: !0 })).counts);
}
const za = /* @__PURE__ */ new Set(["plans", "reactions"]);
async function Va(e) {
  const t = (ue.rows[e] || []).filter((a) => Xn(a) && (e !== "plans" || !ja(a))).map((a) => a.id);
  if (!t.length) return;
  const n = await je.list(e, { ids: t }), s = new Map(n.rows.map((a) => [a.id, a]));
  ue.rows[e] = (ue.rows[e] || []).map((a) => s.get(a.id) || a);
}
const Ai = (e, t) => !qt.has(e) || t && (ue.paging.size[e] || Ne(e)) === Ne(e) && !$i.has(e);
async function Oi(e, t) {
  if (!tt.has(e)) return Ci(e);
  const n = await (Ai(e, t) ? Ei(e) : _i(e));
  return za.has(e) && await Va(e), n;
}
async function Ka() {
  const e = await je.settings();
  JSON.stringify(e) !== JSON.stringify(ue.settings) && (ue.settings = e);
}
async function Ti() {
  const [e] = await Promise.all([je.entries(0, qa), Ka()]);
  Di([...Rt(Ya(), []), ...e]);
}
const Ri = (e, t) => Oi(e, t).then(
  () => null,
  () => e
);
async function Ii(e, t) {
  const n = (await Promise.all(e.map((s) => Ri(s, t)))).filter(Boolean);
  if (n.forEach((s) => (Ge.add(s), Wt.add(s))), t && await Ti(), n.length) throw new Error(`could not read ${n.join(", ")}`);
}
const Ga = 1e3, Bi = 15e3;
let Vt = Ga;
async function Li() {
  return St || (St = (async () => {
    for (await new Promise((e) => setTimeout(e, 30)); [...Ge].some((e) => !Sn.has(e)) || _t; ) {
      const e = _t, t = [...e ? Object.keys(ue.rows) : Ge].filter((s) => jt[s] && (tt.has(s) || s in ue.rows)).filter((s) => e || !tt.has(s) || Wt.has(s) || !qt.has(s)).filter((s) => !Sn.has(s)), n = [...Ge].filter((s) => Sn.has(s));
      Ge.clear(), n.forEach((s) => Ge.add(s)), _t = !1;
      try {
        await Si(t, e), Vt = Ga;
      } catch {
        _t = _t || e, await new Promise((a) => setTimeout(a, Vt)), Vt = Math.min(Vt * 2, Bi);
      }
    }
  })().finally(() => St = null), St);
}
function Ms(e, t = !0) {
  return e.filter(Boolean).filter((n) => t || !Zn.has(n)).forEach((n) => {
    Ge.add(n), t && Wt.add(n);
  }), Ge.delete("settings") && Ka(), Li();
}
const Ya = () => {
  var e;
  return `typed-entries:${((e = ue.identity) == null ? void 0 : e.root) || location.host}:${je.env()}`;
};
function Di(e) {
  const t = new Map(e.map((n) => [n.id, n]));
  ue.entries = [...t.values()].sort((n, s) => n.id - s.id).slice(-qa), mn(Ya(), ue.entries.slice(-50));
}
Ul((e) => ue.streamOpen || Ms([e]));
const Qn = [], Ni = 2e3, Ke = /* @__PURE__ */ new Map(), ji = /(^|[^"'>=\w/])(https?:\/\/[^\s<]*[^\s<.,;:!?)\]'"])/g, Pi = /(<code>[\s\S]*?<\/code>|<a [\s\S]*?<\/a>)/;
function ct(e, { first: t = !1 } = {}) {
  t ? Qn.unshift(e) : Qn.push(e), Ke.clear();
}
function Ja(e, t, n) {
  var a;
  const s = Fa(t).find((o) => o.id === n);
  return (a = e.reads) == null || a.push({ table: t, id: n, row: s }), s;
}
const qi = (e) => Fa(e.table).find((t) => t.id === e.id) === e.row, Wi = (e, t) => [t.env ?? "", t.inline ? "inline" : "block", t.rowNames === !1 ? "plain" : "names", e].join("\0");
function Ue(e) {
  return String(e ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Fi(e, t) {
  const n = [{ kind: "text", text: Ue(e).replace(/\r\n/g, `
`) }];
  for (const s of Qn)
    for (let a = n.length - 1; a >= 0; a--) {
      const o = n[a];
      if (o.kind !== "text") continue;
      const l = s(o.text, t);
      typeof l == "string" ? o.text = l : l && n.splice(a, 1, ...l);
    }
  return n;
}
function It(e) {
  const t = [], s = e.replace(/`([^`\n]+)`/g, (a, o) => `\0${t.push(`<code>${o}</code>`) - 1}\0`).replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>").replace(/(^|[\s(])\*(?!\s)([^*\n]*[^*\s])\*/g, "$1<em>$2</em>").replace(/(^|[\s(])_(?!\s)([^_\n]*[^_\s])_(?!\w)/g, "$1<em>$2</em>").replace(/\[([^\]\n]+)\]\((https?:\/\/[^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
  return Hi(s).replace(/\u0000(\d+)\u0000/g, (a, o) => t[Number(o)]);
}
function Hi(e) {
  return e.split(Pi).map((t, n) => n % 2 ? t : t.replace(ji, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')).join("");
}
function Hs(e) {
  return e.trim().replace(/^\||\|$/g, "").split(new RegExp("(?<!\\\\)\\|")).map((t) => t.replace(/\\\|/g, "|").trim());
}
function Ui(e) {
  const [t, , ...n] = e, s = Hs(t).map((o) => `<th>${It(o)}</th>`).join(""), a = n.map(
    (o) => `<tr>${Hs(o).map((l) => `<td>${It(l)}</td>`).join("")}</tr>`
  ).join("");
  return `<table><thead><tr>${s}</tr></thead><tbody>${a}</tbody></table>`;
}
function zi(e) {
  const t = /^\s*\d+[.)]\s/.test(e[0]), n = [];
  for (const a of e) {
    const o = a.match(/^(\s*)(?:[-*+]|\d+[.)])\s+(.*)$/);
    o ? n.push(o[2]) : n.length && (n[n.length - 1] += ` ${a.trim()}`);
  }
  const s = t ? "ol" : "ul";
  return `<${s}>${n.map((a) => `<li>${It(a)}</li>`).join("")}</${s}>`;
}
const Us = (e, t) => e[t].includes("|") && /^\s*\|?\s*:?-{3,}/.test(e[t + 1] || "");
function Za(e) {
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
      n.push(`<h${r}>${It(o[2])}</h${r}>`), s += 1;
      continue;
    }
    if (/^(-{3,}|\*{3,}|_{3,})\s*$/.test(a)) {
      n.push("<hr>"), s += 1;
      continue;
    }
    if (Us(t, s)) {
      let r = s + 2;
      for (; r < t.length && t[r].includes("|"); ) r += 1;
      n.push(Ui(t.slice(s, r))), s = r;
      continue;
    }
    if (/^\s*(?:[-*+]|\d+[.)])\s+/.test(a)) {
      let r = s + 1;
      for (; r < t.length && (/^\s*(?:[-*+]|\d+[.)])\s+/.test(t[r]) || /^\s{2,}\S/.test(t[r])); ) r += 1;
      n.push(zi(t.slice(s, r))), s = r;
      continue;
    }
    if (/^(?:>|&gt;)\s?/.test(a)) {
      let r = s;
      for (; r < t.length && /^(?:>|&gt;)\s?/.test(t[r]); ) r += 1;
      n.push(
        `<blockquote>${Za(
          t.slice(s, r).map((c) => c.replace(/^(?:>|&gt;)\s?/, "")).join(`
`)
        )}</blockquote>`
      ), s = r;
      continue;
    }
    let l = s;
    for (; l < t.length && t[l].trim() && !Us(t, l) && !/^(#{1,6}\s|```|~~~|(?:>|&gt;)\s?|\s*(?:[-*+]|\d+[.)])\s+)/.test(t[l]); )
      l += 1;
    n.push(`<p>${It(t.slice(s, l).join(`
`)).replace(/\n/g, "<br>")}</p>`), s = l;
  }
  return n.join("");
}
const Vi = /^\s*<(div|pre|table|figure|section|details|ul|ol|blockquote|hr|p)\b/i, Ki = (e) => e.kind !== "text" && !Vi.test(e.html);
function Gi(e) {
  const t = [], n = [];
  let s = "";
  const a = () => {
    s && n.push(Za(s).replace(/\u0001(\d+)\u0001/g, (o, l) => t[Number(l)])), s = "";
  };
  for (const o of e)
    o.kind === "text" ? s += o.text : Ki(o) ? s += `${t.push(o.html) - 1}` : (a(), n.push(o.html));
  return a(), n.filter(Boolean).join("");
}
function es(e, t = { env: "" }) {
  const n = Wi(e, t), s = Ke.get(n);
  if (Ke.delete(n), s && s.reads.every(qi))
    return Ke.set(n, s), s.html;
  const a = [], o = Gi(Fi(e, { ...t, reads: a }));
  return Ke.set(n, { html: o, reads: a }), Ke.size > Ni && Ke.delete(Ke.keys().next().value), o;
}
const Xa = /\[\[([a-z]+) ([^|\]]+)\|([^\]]*)\]\]/g, Bt = (e) => String(e || "").replace(Xa, (t, n, s, a) => a), Yi = new RegExp("(?:(?<![\\w/])[\\w.\\/-]+\\.[a-z]{1,4}:\\d+\\s+)?(?:Uncaught(?: \\(in promise\\))?\\s+)?\\b(?:[A-Z][\\w$]*)?(?:Error|Exception|Warning)\\b:?\\s|(?<!\\S)\\S*:\\d+\\s+Failed to load resource:", "g"), Kt = /\s+at\s+(?:(?:async\s+)?[\w.$&;<>\[\] ]+?\s+)?\(?(?:[\w.\/-]+|https?:\/\/\S+?):\d+(?::\d+)?\)?(?=\s|$)|\s*[\w.$]+\s+@\s+[\w.\/-]+:\d+(?::\d+)?(?=\s|$)/g, Ji = /^Traceback \(most recent call last\):/m, Zi = 8;
function Qa(e) {
  const t = e.map(
    (a) => `<div class="console-entry"><div class="console-head">${a.head}</div>${a.frames.map((o) => `<div class="console-frame">${o}</div>`).join("")}</div>`
  ).join(""), n = e.length > 1 ? `<details class="console-more"><summary><span class="console-more-collapsed">Show all ${e.length} errors</span><span class="console-more-expanded">Show fewer errors</span></summary>${t}</details>` : t, s = e.length > 1 ? `<div class="console-entry"><div class="console-head">${e[0].head}</div>${e[0].frames.slice(0, Zi).map((a) => `<div class="console-frame">${a}</div>`).join("")}</div>` : "";
  return `<div class="console-card"><span class="console-label">console</span>${e.length > 1 ? s + n : t}</div>`;
}
function Xi(e) {
  const t = [...e.matchAll(Yi)].map((s) => s.index);
  if (Kt.lastIndex = 0, !t.length || !Kt.test(e)) return null;
  Kt.lastIndex = 0;
  const n = t.map((s, a) => {
    const o = e.slice(s, a + 1 < t.length ? t[a + 1] : e.length).trim(), l = [...o.matchAll(Kt)];
    return { head: l.length ? o.slice(0, l[0].index).trim() : o, frames: l.map((r) => r[0].trim()) };
  });
  return n.some((s) => s.frames.length) ? { lead: e.slice(0, t[0]), html: Qa(n), tail: "" } : null;
}
function Qi(e) {
  const t = Ji.exec(e);
  if (!t) return null;
  const n = e.slice(t.index).split(`
`), s = [n[0]];
  let a = 1;
  for (; a < n.length && n[a].trim() && (s.push(n[a]), a++, !/^[A-Z][\w.]*(?:Error|Exception|Warning|Exit)\b/.test(s[s.length - 1])); )
    ;
  const o = { head: s[s.length - 1], frames: s.slice(0, -1) };
  return { lead: e.slice(0, t.index), html: Qa([o]), tail: n.slice(a).join(`
`) };
}
ct((e) => {
  const t = Bt(e), n = Qi(t) || Xi(t);
  return n ? [
    { kind: "text", text: n.lead },
    { kind: "html", html: n.html },
    { kind: "text", text: n.tail }
  ] : null;
});
const ec = /^(\}|\)|\]|end|fi|done|esac)[;,)\]}]*$/, tc = /(=>|->|::|===?|!==?|&&|\|\||\+=|-=|\+\+|<<|>>|\?\?|:=)/, nc = /[\w\]]\(/, sc = /^[\w$.[\]'"]+\s*=\s*[^=]/, ac = /^(import|from|use|using|package|include|require|export|const|let|var|func|fn|def|class|struct|enum|impl|pub|public|private|protected|static|namespace|interface|type|async|if|else|elif|elseif|for|foreach|while|try|except|catch|finally|with|switch|case|return|raise|throw|yield|local|do|then|final|abstract|template|module)\b.*([:{(;=,<>'"]|\b\w+)$/, oc = /^(@\w+|<\?php|\$\w+|%\w+|<\/?[A-Za-z][^>]*>)/, rc = /^#\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b/, lc = /[[({,]$/, ic = /^("[^"]*"|[a-z_][\w-]*)\s*:(\s+\S.{0,60})?$/, cc = /^(\t|\s{2,})\S/, uc = /^(\/\/|#(?!\s*(include|define|if|ifdef|ifndef|else|elif|endif|pragma|undef)\b)|--|\/\*|\*\/?|<!--)/, dc = /^[A-Za-z][A-Za-z'’-]*[,.;:!?)]?$/, hc = /[{}()[\];=<>$&|*\\@+^~%]/g, eo = /^\s*(?:[-*+]|\d+[.)])\s/, fc = /^\s*>/, pc = /^\s*\|/, mc = 0.6, gc = 0.4, vc = 5, yc = 0.03, to = (e) => {
  const t = e.trim().split(/\s+/);
  return t.length >= vc && t.every((n) => dc.test(n) || /^[\w'’-]+$/.test(n)) && (e.match(hc) ?? []).length / e.length < yc;
}, En = (e) => {
  const t = e.trim();
  return [ec, tc, nc, sc, ac, oc, rc, lc, ic].some((n) => n.test(t)) || /[;{}]$/.test(t) || cc.test(e) && !eo.test(e) && !to(e);
};
function wc(e) {
  const t = e.filter((o) => o.trim());
  if (!t.length || eo.test(t[0]) || t.every((o) => fc.test(o) || pc.test(o))) return "text";
  const n = t.filter((o) => !uc.test(o.trim()));
  if (t.length === 1) return !n.length || En(t[0]) ? "line" : "text";
  if (!n.length) return "line";
  const s = n.filter(En).length, a = n.filter((o) => !En(o) && to(o)).length;
  return s >= n.length * mc && a <= n.length * gc ? "code" : "text";
}
const ts = "if else for while do switch case default break continue return function class new this super extends import export from as const let var static public private protected readonly interface enum type namespace try catch finally throw await async yield typeof instanceof in of void delete null undefined true false abstract final implements package struct union int float double char bool string long short unsigned signed var fn pub use mod impl trait match where mut ref self crate func go defer chan map range nil select", kc = "if elif else for while def class return import from as with try except finally raise lambda yield pass break continue and or not in is None True False global nonlocal assert del async await match case", bc = `${ts} echo print isset unset empty array list foreach endforeach endif endwhile elseif require require_once include include_once namespace use trait clone instanceof insteadof declare enddeclare goto fn match yield`, $c = "if then else elif fi for while until do done case esac in function return exit export local readonly set unset shift source true false", xc = "select from where insert into values update set delete create table drop alter index join left right inner outer on as and or not null primary key group by order limit offset having union distinct case when then else end exists between like is in", zs = {
  js: { keywords: ts, line: "//", block: ["/*", "*/"], quotes: ['"', "'", "`"] },
  py: { keywords: kc, line: "#", triple: ['"""', "'''"], quotes: ['"', "'"] },
  php: { keywords: bc, line: "//", hash: !0, block: ["/*", "*/"], quotes: ['"', "'"] },
  c: { keywords: ts, line: "//", block: ["/*", "*/"], quotes: ['"', "'"] },
  sh: { keywords: $c, line: "#", quotes: ['"', "'"] },
  css: { keywords: "", block: ["/*", "*/"], quotes: ['"', "'"], property: !0 },
  html: { keywords: "", block: ["<!--", "-->"], quotes: ['"', "'"], tags: !0 },
  json: { keywords: "true false null", quotes: ['"'] },
  yaml: { keywords: "true false null yes no", line: "#", quotes: ['"', "'"] },
  sql: { keywords: xc, line: "--", block: ["/*", "*/"], quotes: ["'"], lower: !0 },
  md: { keywords: "", quotes: [], markdown: !0 },
  text: { keywords: "", quotes: [] }
};
function Vs(e, t, n) {
  return n && e.startsWith(n, t);
}
function Mc(e, t) {
  const n = zs[t] || zs.text, s = new Set(n.keywords.split(" ").filter(Boolean)), a = [];
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
    if (Vs(e, o, n.line) || n.hash && r === "#") {
      const d = e.indexOf(`
`, o);
      l("comment", e.slice(o, d < 0 ? e.length : d)), o = d < 0 ? e.length : d;
      continue;
    }
    if (n.block && Vs(e, o, n.block[0])) {
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
function _c(e, t) {
  const n = [""];
  for (const { kind: s, value: a } of Mc(e, t))
    a.split(`
`).forEach((l, r) => {
      r && n.push(""), l && (n[n.length - 1] += s === "plain" ? Ue(l) : `<span class="tok-${s}">${Ue(l)}</span>`);
    });
  return e.endsWith(`
`) && n.pop(), n;
}
async function Sc(e) {
  try {
    return await navigator.clipboard.writeText(e), !0;
  } catch {
    return !1;
  }
}
const Ec = 1500, Ks = /* @__PURE__ */ new WeakMap();
async function Cc(e) {
  var n;
  const t = e.target instanceof Element ? e.target.closest(".chat-code-copy") : null;
  t && (e.stopPropagation(), await Sc(((n = t.nextElementSibling) == null ? void 0 : n.textContent) || "") && (t.textContent = "Copied", t.classList.add("copied"), clearTimeout(Ks.get(t)), Ks.set(
    t,
    setTimeout(() => {
      t.textContent = "Copy", t.classList.remove("copied");
    }, Ec)
  )));
}
typeof document < "u" && document.addEventListener("click", Cc, !0);
const Ac = /\n\s*\n/, Oc = /^(```|~~~)\s*(\w+)?\s*$/, Tc = /^\s{4,}\S/, Rc = /^\s{2,}(?![-*+]\s|\d+[.)]\s)\S/, ns = /^\s*(?:[-*+]|\d+[.)])\s/, no = /^(@\w|(async\s+)?def |class |if |elif |else\b|for |while |try\b|except\b|finally\b|with |switch |function\b|[\w$.]+\s*\([^)]*\)\s*(:|\{)?\s*$)|[:{]\s*$|=>\s*\{?\s*$/, Ic = [
  ["py", /\b(def |elif |None\b|self\b|lambda |print\(|import \w+$)|:\s*$/m],
  ["php", /<\?php|\$\w+->|\bforeach\b|\becho\b/],
  ["sh", /^\$ |^(cd|ls|git|npm|npx|python3?|pip|curl|grep|rg|cat|echo|export) /m],
  ["css", /^\s*[\w.#:-]+\s*\{|;\s*$.*\}|^\s*[\w-]+:\s*[^;]+;/m],
  ["sql", /\b(SELECT|INSERT|UPDATE|DELETE|FROM|WHERE)\b/],
  ["json", /^\s*[{[]/],
  ["js", /\b(const |let |=>|function |console\.|=== )/]
];
function _s(e) {
  return e.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
}
function Bc(e) {
  const t = _s(e.join(`
`));
  return (Ic.find(([, n]) => n.test(t)) || ["text"])[0];
}
const Lc = (e) => {
  const t = (e[e.length - 1] || "").trim();
  return !!t && no.test(t) && !ns.test(t);
}, Dc = (e, t) => ns.test(t) || ns.test([...e].reverse().find((n) => n.trim()) || "");
function ss(e, t) {
  return { kind: "html", html: `<div class="chat-code-block"><button type="button" class="chat-code-copy">Copy</button><pre class="chat-code"><code>${_c(_s(e.join(`
`)), t || Bc(e)).join(`
`)}</code></pre></div>` };
}
function Nc(e) {
  const t = e.split(Ac).map((l) => ({ paragraph: l, kind: wc(_s(l).split(`
`)) })), n = [];
  let s = [];
  const a = () => {
    s.length && n.push({ kind: "text", text: s.join(`

`) }), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    let l = o;
    for (; l < t.length && t[l].kind !== "text"; ) l += 1;
    const r = t.slice(o, l);
    if (r.some(({ kind: c }) => c === "code") || r.length > 1) {
      a(), n.push(ss(r.map(({ paragraph: c }) => c).join(`

`).split(`
`).map(Bt), "")), o = l;
      continue;
    }
    s.push(t[o].paragraph), o += 1;
  }
  return a(), n.length === 1 && n[0].kind === "text" ? [{ kind: "text", text: e }] : n;
}
function jc(e) {
  const t = e.split(`
`), n = [];
  let s = [];
  const a = () => {
    s.length && n.push(...Nc(s.join(`
`))), s = [];
  };
  let o = 0;
  for (; o < t.length; ) {
    const l = t[o].match(Oc);
    if (l) {
      const c = t.findIndex((h, m) => m > o && h.trim().startsWith(l[1])), d = c < 0 ? t.length : c;
      a(), n.push(ss(t.slice(o + 1, d).map(Bt), l[2] ? l[2].toLowerCase() : "")), o = d + 1;
      continue;
    }
    const r = Lc(s) ? Rc : Tc;
    if (r.test(t[o]) && !Dc(s, t[o])) {
      let c = o;
      for (; c < t.length && (r.test(t[c]) || !t[c].trim()); ) c += 1;
      for (; c > o && !t[c - 1].trim(); ) c -= 1;
      const d = [];
      for (; s.length && s[s.length - 1].trim() && no.test(s[s.length - 1].trim()); ) d.unshift(s.pop());
      if (c - o + d.length >= 2) {
        a(), n.push(ss([...d, ...t.slice(o, c)].map(Bt), "")), o = c;
        continue;
      }
      s.push(...d);
    }
    s.push(t[o]), o += 1;
  }
  return a(), n.length > 1 || n[0] && n[0].kind === "html" ? n : null;
}
ct((e) => jc(e));
const Pc = /^\[\[chip ([a-z]+):(\d+)\|([^\]]*)\]\][.:]?$/m, qc = /^([A-Za-z][\w-]*) #?(\d+)[.:]?$/m;
function Wc(e) {
  const t = Pc.exec(e);
  if (t && lt(t[1])) return { at: t.index, length: t[0].length, table: lt(t[1]), id: Number(t[2]), label: t[3] };
  const n = qc.exec(e), s = n && lt(n[1]);
  return s ? { at: n.index, length: n[0].length, table: s, id: Number(n[2]), label: n[0] } : null;
}
function Fc(e, t, n, s) {
  const a = Ja(s, e, t), o = Bt(a ? oi(a) : n);
  return `<a class="row-card" href="#" data-peek="${e}:${t}"><span class="row-card-kind">${Ue(Pt(e).title)} ${t}</span><span class="row-card-title">${Ue(o)}</span></a>`;
}
ct(
  (e, t) => {
    const n = Wc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: Fc(n.table, n.id, n.label, t) },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Hc = /\.(png|jpe?g|gif|webp|svg)$/i, Uc = (e) => Hc.test(e), zc = /^(?:\[\[chip ([a-z]+):(\d+)\|[^\]]*\]\]|([A-Za-z][\w-]*) #?(\d+)) ([\w .()-]+\.[A-Za-z0-9]{1,8})$/m, Vc = /^(?:\[\[file ([^|\]#]+)(?:#L\d+)?\|[^\]]*\]\]|(\/[\w .()/-]+\.[A-Za-z0-9]{1,8}))$/m;
function Kc(e, t) {
  const n = zc.exec(e), [, s, a, o, l, r] = n || [], c = n && lt(s || o), d = c && Ja(t, c, Number(a || l));
  if (!d || !(d.files || []).includes(r)) return null;
  const h = je.in(t.env).fileUrl(c, d.id, r), m = `${Pt(c).title} ${d.id} · ${Ue(r)}`, b = Uc(r) ? `<img class="file-card-image" src="${h}" alt="${Ue(r)}">` : "";
  return { at: n.index, length: n[0].length, html: `<a class="file-card" href="${h}" data-attached="${Ue(r)}">${b}<span class="file-card-name">${m}</span></a>` };
}
function Gc(e) {
  const t = Vc.exec(e);
  if (!t) return null;
  const n = t[1] || t[2];
  return { at: t.index, length: t[0].length, html: `<a class="file-card" href="#" data-file="${n}"><span class="file-card-name">${Ue(n.split("/").pop())}</span><span class="file-card-line">${n}</span></a>` };
}
ct(
  (e, t) => {
    if (t.inline) return null;
    const n = Kc(e, t) || Gc(e);
    return n ? [
      { kind: "text", text: e.slice(0, n.at) },
      { kind: "html", html: n.html },
      { kind: "text", text: e.slice(n.at + n.length) }
    ] : null;
  },
  { first: !0 }
);
const Yc = /`([^`\n]+)`/g;
ct((e) => e.replace(Yc, (t, n) => `<code>${n}</code>`));
const Gs = {
  chip: (e, t) => `<a class="row-pill" href="#" data-peek="${e}">${t.replace(/(\d+)$/, '<span class="row-pill-num">$1</span>')}</a>`,
  file: (e, t) => {
    const [n, s] = e.split("#L");
    return `<a class="row-pill file-pill" href="${gn.file(n, s)}">${t}</a>`;
  },
  url: (e, t) => `<a href="${e}" target="_blank" rel="noopener">${t}</a>`
};
ct(
  (e, t) => e.replace(Xa, (n, s, a, o) => Gs[s] ? Gs[s](a, o, t) : o)
);
const Jc = /(<code>.*?<\/code>|<a\s.*?<\/a>|\[[^\]\n]*\]\([^)\s]*\))/gs, so = new RegExp(`\\b(${Oa}) (?:#?(\\d+)(?::(\\d+(?:-\\d+)?|section \\d+))?\\b|\\((\\d+)\\))`, "gi"), ao = new RegExp(`\\b(${Oa}) (\\d+(?:(?:,? (?:and|or) |, )\\d+)+)\\b`, "gi"), Zc = new RegExp(`<code>((?:${so.source}|${ao.source}))</code>`, "gi"), Xc = (e) => e.replace(Zc, "$1"), Qc = (e, t) => `<a class="row-pill" href="#" data-peek="${lt(e)}:${t}">${e} <span class="row-pill-num">${t}</span></a>`, eu = (e) => e.replace(ao, (t, n, s) => s.replace(/\d+/g, (a) => Qc(n.replace(/s$/i, ""), a))), tu = (e) => eu(e).replace(
  so,
  (t, n, s, a = "", o) => {
    const l = s || o;
    return `<a class="row-pill" href="#" data-peek="${lt(n)}:${l}"${a ? ` data-sub="${a}"` : ""}>${n} <span class="row-pill-num">${l}${a ? `:${a}` : ""}</span></a>`;
  }
);
ct(
  (e, t) => t.rowNames === !1 ? e : Xc(e).split(Jc).map((n, s) => s % 2 ? n : tu(n)).join("")
);
const nu = ["innerHTML"], su = ["innerHTML"], au = {
  __name: "TextDisplay",
  props: {
    text: { type: String, default: "" },
    inline: { type: Boolean, default: !1 },
    rowNames: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = T(() => {
      const s = t.inline ? String(t.text || "").split(`
`).find((o) => o.trim()) || "" : t.text, a = es(s, { env: Fe.value.env, rowNames: t.rowNames, inline: t.inline });
      return t.inline ? a.replace(/^<p>|<\/p>\s*$/g, "") : a;
    });
    return (s, a) => e.inline ? (i(), u("span", {
      key: 0,
      class: "md inline",
      onClick: a[0] || (a[0] = (...o) => U(pt) && U(pt)(...o)),
      innerHTML: n.value
    }, null, 8, nu)) : (i(), u("div", {
      key: 1,
      class: "md",
      onClick: a[1] || (a[1] = (...o) => U(pt) && U(pt)(...o)),
      innerHTML: n.value
    }, null, 8, su));
  }
}, Ye = /* @__PURE__ */ G(au, [["__scopeId", "data-v-1a43d211"]]), ou = { class: "fact" }, ru = { class: "fact-label" }, lu = {
  __name: "DashboardFact",
  props: { label: { type: String, required: !0 }, body: { type: String, required: !0 } },
  setup(e) {
    return (t, n) => (i(), u("div", ou, [
      p("span", ru, v(e.label), 1),
      F(Ye, {
        class: "fact-body",
        text: e.body
      }, null, 8, ["text"])
    ]));
  }
}, iu = /* @__PURE__ */ G(lu, [["__scopeId", "data-v-3a88ecf8"]]), cu = { class: "list" }, uu = { class: "list-label" }, du = {
  key: 1,
  class: "list-note"
}, hu = {
  __name: "DashboardList",
  props: { items: { type: Array, required: !0 } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (i(), u("div", cu, [
      (i(!0), u(Y, null, ae(e.items, (o, l) => (i(), K(it(o.open ? "button" : "div"), {
        key: l,
        type: o.open ? "button" : void 0,
        class: J(["list-item", { opens: o.open }]),
        onClick: (r) => o.open && n("open", o.open)
      }, {
        default: z(() => [
          p("span", uu, v(o.label), 1),
          o.badge ? (i(), K(Ta, {
            key: 0,
            text: o.badge,
            tone: o.tone || ""
          }, null, 8, ["text", "tone"])) : $("", !0),
          o.note ? (i(), u("span", du, v(o.note), 1)) : $("", !0)
        ]),
        _: 2
      }, 1032, ["type", "class", "onClick"]))), 128))
    ]));
  }
}, fu = /* @__PURE__ */ G(hu, [["__scopeId", "data-v-ebe2ae0a"]]), pu = { class: "table" }, mu = {
  key: 0,
  class: "table-row empty"
}, gu = {
  __name: "DataTable",
  props: { columns: { type: Array, required: !0 }, rows: { type: Array, required: !0 }, empty: { type: String, default: "" } },
  emits: ["open"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = T(() => ({ gridTemplateColumns: `2fr repeat(${Math.max(0, n.columns.length - 1)}, 1fr)` }));
    return (o, l) => (i(), u("div", pu, [
      p("div", {
        class: "table-row head",
        style: $e(a.value)
      }, [
        (i(!0), u(Y, null, ae(e.columns, (r) => (i(), u("span", {
          key: r,
          class: "cell"
        }, v(r), 1))), 128))
      ], 4),
      (i(!0), u(Y, null, ae(e.rows, (r, c) => (i(), K(it(r.open ? "button" : "div"), {
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
      !e.rows.length && e.empty ? (i(), u("div", mu, v(e.empty), 1)) : $("", !0)
    ]));
  }
}, vu = /* @__PURE__ */ G(gu, [["__scopeId", "data-v-9326a52e"]]), yu = { class: "stat-value" }, wu = { class: "stat-label" }, ku = {
  key: 0,
  class: "stat-note"
}, bu = {
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
    return (s, a) => (i(), K(it(e.opens ? "button" : "div"), {
      type: e.opens ? "button" : void 0,
      class: J(["stat", e.tone, { opens: e.opens }]),
      onClick: a[0] || (a[0] = (o) => e.opens && n("open"))
    }, {
      default: z(() => [
        p("span", yu, v(e.value), 1),
        p("span", wu, v(e.label), 1),
        e.note ? (i(), u("span", ku, v(e.note), 1)) : $("", !0)
      ]),
      _: 1
    }, 8, ["type", "class"]));
  }
}, $u = /* @__PURE__ */ G(bu, [["__scopeId", "data-v-ad0db6d6"]]), xu = { class: "code" }, Mu = /* @__PURE__ */ Object.assign({ name: "DashboardNode" }, {
  __name: "DashboardNode",
  props: { node: { type: Object, required: !0 } },
  emits: ["open", "file"],
  setup(e, { emit: t }) {
    const n = t, s = (o) => n("open", o), a = (o) => n("file", o);
    return (o, l) => (i(), K(ys, {
      value: e.node.type
    }, {
      stack: z(() => [
        F(Qt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      row: z(() => [
        F(Qt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      grid: z(() => [
        F(Qt, {
          node: e.node,
          onOpen: s,
          onFile: a
        }, null, 8, ["node"])
      ]),
      card: z(() => [
        F(Al, {
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
        F($u, {
          label: e.node.label,
          value: e.node.value,
          note: e.node.note || "",
          tone: e.node.tone || "",
          opens: !!e.node.open,
          onOpen: l[0] || (l[0] = (r) => s(e.node.open))
        }, null, 8, ["label", "value", "note", "tone", "opens"])
      ]),
      bars: z(() => [
        F(xl, {
          node: e.node,
          onOpen: s
        }, null, 8, ["node"])
      ]),
      table: z(() => [
        F(vu, {
          columns: e.node.columns,
          rows: e.node.rows,
          onOpen: s
        }, null, 8, ["columns", "rows"])
      ]),
      list: z(() => [
        F(fu, {
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
        F(iu, {
          label: e.node.label,
          body: e.node.body
        }, null, 8, ["label", "body"])
      ]),
      badge: z(() => [
        F(Ta, {
          text: e.node.text,
          tone: e.node.tone || ""
        }, null, 8, ["text", "tone"])
      ]),
      code: z(() => [
        p("pre", xu, [
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
}), oo = /* @__PURE__ */ G(Mu, [["__scopeId", "data-v-cbdcf540"]]), _u = { class: "dashboard" }, Su = { class: "trail" }, Eu = ["onClick"], Cu = {
  key: 0,
  class: "gone",
  role: "status"
}, Au = {
  __name: "Dashboard",
  props: { document: { type: Object, required: !0 }, page: { type: String, default: "" } },
  emits: ["file"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = (b) => b in (n.document.pages || {}), o = B(!!n.page && !a(n.page)), l = B(n.page && !o.value ? [n.page] : []), r = T(() => l.value.at(-1) || n.document.start), c = T(() => (n.document.pages || {})[r.value] || null), d = (b) => ((n.document.pages || {})[b] || {}).title || b, h = (b) => {
      o.value = !1, l.value = [...l.value, b];
    }, m = (b) => {
      o.value = !1, l.value = l.value.slice(0, b);
    };
    return ke(
      () => n.document.start,
      () => l.value = []
    ), (b, _) => (i(), u("div", _u, [
      e.document.broken ? (i(), K(nn, {
        key: 0,
        title: "This dashboard does not fit the format"
      }, {
        default: z(() => [
          ce(v(e.document.broken), 1)
        ]),
        _: 1
      })) : e.document.missing ? (i(), K(nn, {
        key: 1,
        title: "Nothing to show yet"
      }, {
        default: z(() => [
          ce(v(e.document.missing), 1)
        ]),
        _: 1
      })) : c.value ? (i(), u(Y, { key: 2 }, [
        p("nav", Su, [
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
            }, v(d(j)), 11, Eu)
          ], 64))), 128))
        ]),
        o.value ? (i(), u("p", Cu, "What you opened is no longer in this dashboard. Here is its start page.")) : $("", !0),
        F(yt, {
          name: "page",
          mode: "out-in"
        }, {
          default: z(() => [
            (i(), u("div", {
              key: r.value,
              class: "page"
            }, [
              F(oo, {
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
}, By = /* @__PURE__ */ G(Au, [["__scopeId", "data-v-fbe83734"]]);
function Ou(e, t, n, s = () => window) {
  Le(() => {
    var a;
    return (a = s()) == null ? void 0 : a.addEventListener(e, t, n);
  }), Ee(() => {
    var a;
    return (a = s()) == null ? void 0 : a.removeEventListener(e, t, n);
  });
}
const Tu = (e, t = () => !0) => Ou("keydown", (n) => n.key === "Escape" && t() && e());
function ro(e, t = {}) {
  const n = () => t.open !== void 0 && t.open !== null, s = B(!1), a = T(() => n() ? t.open : !s.value), o = () => {
    n() || (s.value = !0), e("dismiss");
  };
  return Tu(o, () => !n() && t.closable !== !1), { visible: a, close: o, closed: () => e("close") };
}
const Ru = 80, ht = ms([]);
function lo(e) {
  const t = Symbol("layer"), n = () => ht.includes(t) && ht.splice(ht.indexOf(t), 1);
  return ke(
    e,
    (s) => {
      s && !ht.includes(t) && ht.push(t), s || n();
    },
    { immediate: !0 }
  ), Ee(n), T(() => Ru + Math.max(0, ht.indexOf(t)));
}
let io = null;
document.addEventListener("pointerdown", (e) => {
  var t, n;
  return io = ((n = (t = e.target).closest) == null ? void 0 : n.call(t, "button, a[href], [tabindex]")) || null;
}, {
  capture: !0,
  passive: !0
});
const Iu = "button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex='-1'])";
function Bu(e, t, n = e) {
  let s = null;
  function a(o) {
    if (o.key === "Escape") return t();
    if (o.key !== "Tab" || !e.value) return;
    const l = [...e.value.querySelectorAll(Iu)];
    if (!l.length) return o.preventDefault();
    const [r, c] = [l[0], l.at(-1)];
    o.shiftKey && document.activeElement === r ? (o.preventDefault(), c.focus({ preventScroll: !0 })) : !o.shiftKey && document.activeElement === c && (o.preventDefault(), r.focus({ preventScroll: !0 }));
  }
  Le(() => {
    s = document.activeElement && document.activeElement !== document.body ? document.activeElement : io, document.addEventListener("keydown", a), Nt(() => {
      var o;
      return (o = n.value) == null ? void 0 : o.focus({ preventScroll: !0 });
    });
  }), Ee(() => {
    var o;
    document.removeEventListener("keydown", a), (o = s == null ? void 0 : s.focus) == null || o.call(s, { preventScroll: !0 });
  });
}
const Lu = ["aria-modal", "aria-label", "aria-labelledby"], Du = {
  key: 0,
  class: "dialog-head"
}, Nu = ["id", "tabindex"], ju = {
  key: 1,
  class: "dialog-foot"
}, Pu = 500, qu = 400, Wu = {
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
    const n = e, s = t, { visible: a, close: o, closed: l } = ro(s, n), r = lo(a), c = B(null), d = B(null), h = B(null), m = wa(), b = B(!1), _ = Date.now();
    n.modal && Bu(d, () => s("escape"), h);
    function j() {
      if (!n.modal) return n.closable && o();
      b.value = !0, setTimeout(() => b.value = !1, qu);
    }
    function D(E) {
      !n.modal || Date.now() - _ >= Pu || ![" ", "Enter"].includes(E.key) || (E.preventDefault(), E.stopPropagation());
    }
    const k = () => c.value && (c.value.scrollTop = c.value.scrollHeight), A = new MutationObserver(k);
    return ke(c, (E) => {
      A.disconnect(), E && n.follow && (A.observe(E, { childList: !0, subtree: !0, characterData: !0 }), k());
    }), Ee(() => A.disconnect()), (E, V) => (i(), K(gs, { to: "body" }, [
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
              e.bare ? $("", !0) : (i(), u("header", Du, [
                p("h3", {
                  id: U(m),
                  ref_key: "heading",
                  ref: h,
                  tabindex: e.modal ? -1 : void 0
                }, v(e.title), 9, Nu),
                e.closable ? (i(), K(yn, {
                  key: 0,
                  onClick: U(o)
                }, null, 8, ["onClick"])) : $("", !0)
              ])),
              p("div", {
                ref_key: "body",
                ref: c,
                class: J(["dialog-body", { bare: e.bare }])
              }, [
                pe(E.$slots, "default", {}, void 0, !0)
              ], 2),
              E.$slots.foot ? (i(), u("footer", ju, [
                pe(E.$slots, "foot", {}, void 0, !0)
              ])) : $("", !0)
            ], 42, Lu)
          ], 6)) : $("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Fu = /* @__PURE__ */ G(Wu, [["__scopeId", "data-v-6d1ecd98"]]), Ve = { padX: 14, padY: 10, line: 17, lineChars: 24, charWidth: 7.4, minWidth: 120 }, Be = { lineChars: 28, charWidth: 6.4, line: 14, pad: 4 }, Ie = { across: 48, down: 110, margin: 32, labelSpace: 14 }, Hu = 6;
function Ss(e, t) {
  const n = [];
  for (const s of String(e).split(/\s+/).filter(Boolean)) {
    const a = n.at(-1);
    a !== void 0 && a.length + 1 + s.length <= t ? n[n.length - 1] = `${a} ${s}` : n.push(s);
  }
  return n.length ? n : [""];
}
const Uu = (e) => {
  const t = Ss(e, Ve.lineChars), n = Math.max(Ve.minWidth, Math.max(...t.map((s) => s.length)) * Ve.charWidth + Ve.padX * 2);
  return { name: e, lines: t, line: Ve.line, padY: Ve.padY, width: n, height: t.length * Ve.line + Ve.padY * 2 };
};
function zu(e, t, n) {
  const s = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Map(), o = (l) => {
    a.set(l, "open"), t.forEach((r, c) => {
      if (r[0] !== l) return;
      const d = a.get(r[1]);
      d === "open" ? s.add(c) : d || o(r[1]);
    }), a.set(l, "done");
  };
  return [...n, ...e].forEach((l) => a.has(l) || o(l)), s;
}
function Vu(e, t) {
  const n = new Map(e.map((s) => [s, 0]));
  for (let s = 0; s < e.length; s++) {
    let a = !1;
    if (t.forEach(([o, l]) => {
      n.get(l) < n.get(o) + 1 && (n.set(l, n.get(o) + 1), a = !0);
    }), !a) break;
  }
  return n;
}
function Ku(e, t, n) {
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
  for (let l = 0; l < Hu; l++) {
    const r = l % 2 === 0, c = s.map((d, h) => h);
    (r ? c.slice(1) : c.slice(0, -1).reverse()).forEach((d) => {
      const h = (m) => t.filter((b) => b[r ? 1 : 0] === m).map((b) => b[r ? 0 : 1]);
      s[d] = o(s[d], h);
    });
  }
  return s;
}
function Gu(e, t) {
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
function Yu(e) {
  const t = [...new Set(e.flatMap(([y, g]) => [y, g]))], n = new Set(e.map(([, y]) => y)), s = t.filter((y) => !n.has(y)), a = zu(t, e, s.length ? s : t.slice(0, 1)), o = e.filter((y, g) => !a.has(g)), l = Vu(t, o), r = Ku(t, o, l), c = new Map(t.map((y) => [y, Uu(y)])), d = r.map((y) => y.reduce((g, R) => g + c.get(R).width, 0) + Ie.across * (y.length - 1)), h = Math.max(...d) + Ie.margin * 2, m = Zu(e, l, r.length), b = /* @__PURE__ */ new Map();
  let _ = Ie.margin;
  r.forEach((y, g) => {
    let R = (h - d[g]) / 2;
    const S = Math.max(...y.map((P) => c.get(P).height));
    y.forEach((P) => {
      const x = c.get(P);
      b.set(P, { ...x, x: R, y: _ + (S - x.height) / 2 }), R += x.width + Ie.across;
    }), _ += S + (m[g] ?? Ie.down);
  });
  const j = e.map(([y, g, R], S) => ({ from: y, to: g, label: R || "", back: a.has(S) || l.get(g) <= l.get(y) }));
  Gu(j, b);
  const D = j.map((y) => Xu(y, b.get(y.from), b.get(y.to))), k = [...b.values()], A = nd(D, k), E = Math.max(_ - Ie.down, ...A.filter((y) => y.label).map((y) => y.label.y + y.label.height));
  return { width: Math.max(h - Ie.margin, ...A.filter((y) => y.label).map((y) => y.label.x + y.label.width)) + Ie.margin, height: E + Ie.margin, nodes: k, arrows: A };
}
const Ju = (e) => e ? Ss(e, Be.lineChars).length * Be.line + Be.pad * 2 : 0;
function Zu(e, t, n) {
  const s = Array.from({ length: Math.max(n - 1, 0) }, () => Ie.labelSpace);
  return e.forEach(([a, o, l]) => {
    const [r, c] = [t.get(a), t.get(o)].sort((d, h) => d - h);
    c > r && (s[r + Math.floor((c - r - 1) / 2)] += Ju(l) + Ie.labelSpace);
  }), s.map((a) => Math.max(Ie.down, a));
}
function Xu(e, t, n) {
  const s = e.label ? Ss(e.label, Be.lineChars) : [], a = s.length ? Math.max(...s.map((b) => b.length)) * Be.charWidth + Be.pad * 2 : 0, o = s.length * Be.line + (s.length ? Be.pad * 2 : 0), l = t.x + t.width * e.fromShare, r = e.back ? t.y : t.y + t.height, c = n.x + n.width * e.toShare, d = e.back ? n.y + n.height : n.y, h = (d - r) / 2, m = [{ x: l, y: r }, { x: l, y: r + h }, { x: c, y: d - h }, { x: c, y: d }];
  return { ...e, lines: s, labelWidth: a, labelHeight: o, curve: m, path: `M${l} ${r} C${l} ${r + h} ${c} ${d - h} ${c} ${d}` };
}
const Qu = ([e, t, n, s], a) => {
  const o = 1 - a, l = (r) => o * o * o * e[r] + 3 * o * o * a * t[r] + 3 * o * a * a * n[r] + a * a * a * s[r];
  return { x: l("x"), y: l("y") };
}, ed = [0.5, 0.4, 0.6, 0.3, 0.7, 0.2, 0.8], td = [0, -1, 1, -2, 2, -3, 3].map((e) => e * Be.line);
function nd(e, t) {
  const n = t.map(({ x: s, y: a, width: o, height: l }) => ({ x: s, y: a, width: o, height: l }));
  return e.map((s) => {
    if (!s.lines.length) return { ...s, label: null };
    const a = (c, d) => {
      const h = Qu(s.curve, c);
      return { x: h.x - s.labelWidth / 2, y: h.y - s.labelHeight / 2 + d, width: s.labelWidth, height: s.labelHeight };
    }, r = td.flatMap((c) => ed.map((d) => a(d, c))).find((c) => !n.some((d) => Ys(c, d))) ?? a(0.5, 0);
    for (; n.some((c) => Ys(r, c)); ) r.y += Be.line;
    return n.push(r), { ...s, label: { ...r, lines: s.lines, line: Be.line, pad: Be.pad } };
  });
}
const Ys = (e, t) => e.x < t.x + t.width && t.x < e.x + e.width && e.y < t.y + t.height && t.y < e.y + e.height, sd = { class: "flowchart-tools" }, ad = ["width", "height", "viewBox", "aria-label"], od = ["d"], rd = ["x", "y", "width", "height"], ld = ["x", "y"], id = ["x", "dy"], cd = {
  key: 0,
  class: "flowchart-label"
}, ud = ["x", "y", "width", "height"], dd = ["x", "y"], hd = ["x", "dy"], fd = {
  __name: "FlowchartDialog",
  props: { title: { type: String, required: !0 }, edges: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = T(() => Yu(n.edges)), o = { least: 0.2, most: 4, step: 1.2 }, l = B(null), r = B({ zoom: 1, x: 0, y: 0 });
    let c = null;
    function d() {
      var A;
      const D = (A = l.value) == null ? void 0 : A.getBoundingClientRect();
      if (!(D != null && D.width)) return;
      const k = Math.min(D.width / a.value.width, D.height / a.value.height, 1.5);
      r.value = { zoom: k, x: (D.width - a.value.width * k) / 2, y: (D.height - a.value.height * k) / 2 };
    }
    function h(D, k, A) {
      const { zoom: E, x: V, y } = r.value, g = Math.min(o.most, Math.max(o.least, E * D));
      r.value = { zoom: g, x: k - (k - V) * g / E, y: A - (A - y) * g / E };
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
      var k, A, E;
      D.preventDefault(), (k = window.getSelection()) == null || k.removeAllRanges(), c = { x: D.clientX - r.value.x, y: D.clientY - r.value.y }, (E = (A = l.value).setPointerCapture) == null || E.call(A, D.pointerId);
    }
    function j(D) {
      c && (r.value = { ...r.value, x: D.clientX - c.x, y: D.clientY - c.y });
    }
    return Le(d), (D, k) => (i(), K(Fu, {
      title: e.title,
      large: "",
      onClose: k[4] || (k[4] = (A) => s("close"))
    }, {
      default: z(() => [
        p("div", sd, [
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
          onPointerup: k[2] || (k[2] = (A) => Bs(c) ? c.value = null : c = null),
          onPointercancel: k[3] || (k[3] = (A) => Bs(c) ? c.value = null : c = null)
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
            (i(!0), u(Y, null, ae(a.value.arrows, (A, E) => (i(), u("path", {
              key: `arrow-${E}`,
              class: "flowchart-arrow",
              d: A.path,
              "marker-end": "url(#flowchart-head)"
            }, null, 8, od))), 128)),
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
              }, null, 8, rd),
              p("text", {
                x: A.x + A.width / 2,
                y: A.y + A.padY + A.line / 2
              }, [
                (i(!0), u(Y, null, ae(A.lines, (E, V) => (i(), u("tspan", {
                  key: V,
                  x: A.x + A.width / 2,
                  dy: V ? A.line : 0
                }, v(E), 9, id))), 128))
              ], 8, ld)
            ]))), 128)),
            (i(!0), u(Y, null, ae(a.value.arrows, (A, E) => (i(), u(Y, {
              key: `label-${E}`
            }, [
              A.label ? (i(), u("g", cd, [
                p("rect", {
                  x: A.label.x,
                  y: A.label.y,
                  width: A.label.width,
                  height: A.label.height,
                  rx: "4"
                }, null, 8, ud),
                p("text", {
                  x: A.label.x + A.label.width / 2,
                  y: A.label.y + A.label.pad + A.label.line / 2
                }, [
                  (i(!0), u(Y, null, ae(A.label.lines, (V, y) => (i(), u("tspan", {
                    key: y,
                    x: A.label.x + A.label.width / 2,
                    dy: y ? A.label.line : 0
                  }, v(V), 9, hd))), 128))
                ], 8, dd)
              ])) : $("", !0)
            ], 64))), 128))
          ], 12, ad))
        ], 544)
      ]),
      _: 1
    }, 8, ["title"]));
  }
}, pd = /* @__PURE__ */ G(fd, [["__scopeId", "data-v-51d24cfe"]]), Js = {
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
}, md = ["innerHTML"], gd = {
  __name: "MarkIcon",
  props: { name: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = T(() => Js[t.name] || Js.dot);
    return (s, a) => (i(), u("svg", {
      class: "mark-icon",
      viewBox: "0 0 16 16",
      "aria-hidden": "true",
      innerHTML: n.value
    }, null, 8, md));
  }
}, ze = /* @__PURE__ */ G(gd, [["__scopeId", "data-v-beb5935c"]]), vd = {
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
}, Lt = /* @__PURE__ */ G(vd, [["__scopeId", "data-v-d03899bb"]]), yd = ["data-tip", "aria-label"], wd = {
  key: 0,
  class: "mact-word"
}, kd = {
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
      e.open ? (i(), u("span", wd, v(e.label), 1)) : $("", !0),
      n[0] || (n[0] = p("span", { class: "hit" }, null, -1))
    ], 10, yd));
  }
}, co = /* @__PURE__ */ G(kd, [["__scopeId", "data-v-3b292e09"]]), bd = 120, Cn = 280, $d = 160, xd = () => {
  var e;
  return (e = window.matchMedia) == null ? void 0 : e.call(window, "(prefers-reduced-motion: reduce)").matches;
}, Md = ["leaving", "resizing", "entering"];
function _d(e) {
  const t = Md.filter((s) => e.classList.contains(s));
  e.classList.remove(...t);
  const n = { width: e.offsetWidth, height: e.offsetHeight };
  return e.classList.add(...t), n;
}
function uo(e, t, n = (s) => new Promise((a) => setTimeout(a, s))) {
  const s = B(t()), a = B("");
  let o = 0;
  const l = (d, h) => Object.assign(d.style, { width: `${h.width}px`, height: `${h.height}px` }), r = (d) => Object.assign(d.style, { width: "", height: "", transition: "" });
  async function c(d) {
    const h = e.value, m = ++o;
    if (!h || !h.offsetWidth || xd()) {
      s.value = d;
      return;
    }
    const b = { width: h.offsetWidth, height: h.offsetHeight };
    if (l(h, b), a.value = "leaving", await n(bd), m !== o) return;
    s.value = d, a.value = "resizing", await Nt(), r(h);
    const _ = _d(h);
    l(h, b), h.offsetWidth, h.style.transition = `width ${Cn}ms cubic-bezier(0.2, 0.9, 0.25, 1), height ${Cn}ms cubic-bezier(0.2, 0.9, 0.25, 1)`, l(h, _), await n(Cn), m === o && (r(h), a.value = "entering", await n($d), m === o && (a.value = ""));
  }
  return ke(t, (d) => c(d)), wt(() => {
    o += 1;
  }), { folded: s, phase: a };
}
const Sd = { class: "growing-card-top" }, Ed = ["aria-expanded"], Cd = { class: "growing-card-avatar" }, Ad = { class: "growing-card-title" }, Od = { class: "growing-card-more" }, Td = { class: "growing-card-body" }, Rd = {
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
    const n = e, s = t, a = B(!1), o = B(null), { folded: l, phase: r } = uo(o, () => !a.value), c = T(() => (n.person.trim().split(/\s+/).pop() || "").charAt(0).toUpperCase()), d = T(() => n.text.split(/\n\s*\n/).filter((h) => h.trim()));
    return (h, m) => (i(), u("div", {
      ref_key: "wrap",
      ref: o,
      class: J(["growing-card-wrap", U(r), { open: !U(l), bad: e.bad, incoming: e.incoming }])
    }, [
      p("div", Sd, [
        p("button", {
          type: "button",
          class: "growing-card",
          "aria-expanded": a.value,
          onClick: m[0] || (m[0] = (b) => a.value = !a.value)
        }, [
          p("span", Cd, [
            e.bad ? (i(), K(ze, {
              key: 0,
              name: "cross"
            })) : c.value ? (i(), u(Y, { key: 1 }, [
              ce(v(c.value), 1)
            ], 64)) : (i(), K(ve, {
              key: 2,
              name: e.icon,
              size: 12
            }, null, 8, ["name"]))
          ]),
          p("span", Ad, v(e.title), 1),
          F(Lt, { open: a.value }, null, 8, ["open"])
        ], 8, Ed),
        e.action ? (i(), K(co, {
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
      p("div", Od, [
        p("div", Td, [
          (i(!0), u(Y, null, ae(d.value, (b, _) => (i(), u("p", {
            key: _,
            class: "growing-card-text"
          }, v(b), 1))), 128))
        ])
      ])
    ], 2));
  }
}, Id = /* @__PURE__ */ G(Rd, [["__scopeId", "data-v-e31436cb"]]), Bd = ["title", "aria-label"], Ld = {
  viewBox: "0 0 19 12",
  fill: "none",
  stroke: "currentColor",
  "stroke-width": "1.6",
  "stroke-linecap": "round",
  "stroke-linejoin": "round"
}, Dd = {
  key: 0,
  d: "M8 6.6 10.9 9.5 16.5 2.8"
}, Nd = {
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
      (i(), u("svg", Ld, [
        o[0] || (o[0] = p("path", { d: "M1.5 6.6 4.4 9.5 10 2.8" }, null, -1)),
        s.value !== "sent" ? (i(), u("path", Dd)) : $("", !0)
      ]))
    ], 10, Bd));
  }
}, jd = /* @__PURE__ */ G(Nd, [["__scopeId", "data-v-6dc92808"]]);
function Pd(e, t = Date.now()) {
  if (!e) return "";
  const n = typeof e == "string" ? Date.parse(e) / 1e3 : e, s = Math.max(0, t / 1e3 - n);
  return s < 60 ? "now" : s < 3600 ? `${Math.floor(s / 60)}m` : s < 86400 ? `${Math.floor(s / 3600)}h` : `${Math.floor(s / 86400)}d`;
}
function as(e) {
  const t = Pd(e);
  return t === "now" ? "just now" : t && `${t} ago`;
}
function ho(e) {
  if (!e) return "";
  const t = new Date(e * 1e3), n = (/* @__PURE__ */ new Date()).toDateString() === t.toDateString(), s = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: !1 });
  return n ? s : `${t.toLocaleDateString([], { day: "numeric", month: "short" })} ${s}`;
}
function Zs(e, t = !1) {
  const n = Math.max(0, Math.floor(e || 0));
  if (n < 60) return `${n}s`;
  if (n < 3600) return t ? `${Math.floor(n / 60)}m ${n % 60}s` : `${Math.floor(n / 60)}m`;
  const s = Math.floor(n / 3600), a = Math.floor(n % 3600 / 60);
  return s < 24 ? `${s}h ${a}m` : `${Math.floor(s / 24)}d ${s % 24}h`;
}
const An = (e) => String(e).padStart(2, "0");
function qd(e) {
  const t = Math.max(0, Math.floor(e || 0));
  return t < 60 ? `${t}s` : t < 3600 ? `${Math.floor(t / 60)}m ${An(t % 60)}s` : `${Math.floor(t / 3600)}h ${An(Math.floor(t % 3600 / 60))}m ${An(t % 60)}s`;
}
const Wd = "img,pre,table";
function Fd(e, t) {
  return e.length ? Math.ceil(Math.max(...e.map((n) => n.right)) - Math.min(...e.map((n) => n.left)) + t) : 0;
}
function Hd(e) {
  const t = [], n = document.createTreeWalker(e, NodeFilter.SHOW_TEXT), s = document.createRange();
  for (; n.nextNode(); )
    n.currentNode.parentElement.closest(".message-quote") || (s.selectNodeContents(n.currentNode), t.push(...s.getClientRects()));
  return t;
}
function Ud(e) {
  if (e.style.width = "", !e.offsetWidth || e.querySelector(Wd)) return;
  const t = getComputedStyle(e), n = parseFloat(t.paddingLeft) + parseFloat(t.paddingRight) + parseFloat(t.borderLeftWidth) + parseFloat(t.borderRightWidth), s = Fd(Hd(e), n || 0);
  s && s < e.offsetWidth && (e.style.width = `${s}px`);
}
function zd(e, t) {
  let n = null;
  const s = () => e.value && Ud(e.value);
  Le(() => {
    var o;
    if (s(), typeof ResizeObserver > "u" || !((o = e.value) != null && o.parentElement)) return;
    let a = 0;
    n = new ResizeObserver(([l]) => {
      l.contentRect.width !== a && (a = l.contentRect.width, s());
    }), n.observe(e.value.parentElement);
  }), Ee(() => n == null ? void 0 : n.disconnect()), ke(t, s, { flush: "post" });
}
const Vd = ["👍", "❤️", "🎉", "😄", "👀", "🙏", "👎", "💔", "😠", "🎩", "🧐", "🥂", "🤙", "😎", "🔥", "💪", "🏆", "⚔️", "🛡️", "🏰"];
function Kd(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of JSON.parse(e || "[]")) {
    const s = t.get(n.emoji) || { emoji: n.emoji, count: 0, mine: !1, names: /* @__PURE__ */ new Set() };
    s.count += 1, s.mine || (s.mine = n.actor_type === "user"), s.names.add(n.actor_type === "user" ? "You" : "The agent"), t.set(n.emoji, s);
  }
  return [...t.values()].map(({ names: n, ...s }) => ({ ...s, title: [...n].join(" and ") }));
}
const Gd = ["data-ref"], Yd = ["data-from", "data-ref"], Jd = { class: "message-body" }, Zd = ["title"], Xd = ["innerHTML"], Qd = ["title"], eh = ["innerHTML"], th = {
  class: "message-faces",
  "data-message-faces": ""
}, nh = ["title", "data-face", "onClick"], sh = {
  key: 0,
  class: "message-reactions",
  "data-message-reactions": ""
}, ah = ["title", "data-reaction", "onClick"], oh = {
  key: 0,
  class: "message-reaction-count"
}, rh = {
  key: 1,
  class: "message-files",
  "data-message-files": ""
}, lh = ["href", "title"], ih = ["src", "alt"], ch = ["href"], uh = {
  key: 2,
  class: "message-links",
  "data-message-links": ""
}, dh = {
  key: 1,
  "data-message-links-rows": ""
}, hh = {
  key: 3,
  class: "message-sent-to",
  "data-message-sent-to": ""
}, fh = ["data-sent-worker", "title", "onClick"], ph = { class: "message-foot" }, mh = { class: "message-time" }, gh = {
  key: 0,
  class: "message-id",
  "data-message-id": ""
}, vh = 140, yh = 2, wh = 1500, kh = "An earlier message", bh = "about", $h = "sent_to", xh = 3, Mh = {
  __name: "MessageCard",
  props: { message: { type: Object, required: !0 }, quote: { type: String, default: "" } },
  emits: ["reply", "comment", "delete", "react"],
  setup(e, { emit: t }) {
    var he;
    const n = e, s = t, a = B(!1), o = B(null), l = T(() => ["user", "comment"].includes(n.message.type)), r = T(() => {
      const [Q, ee] = (n.message.commented_row || ":").split(":"), Z = lt(Q);
      return Z ? { ref: `${Z}:${ee}`, label: `${Pt(Z).title.toLowerCase()} ${ee}` } : null;
    }), c = T(() => n.message.worker_id ?? null), d = B(!1), h = T(() => c.value !== null && ((n.message.text ?? "").length > vh || (n.message.text ?? "").split(`
`).filter((Q) => Q.trim()).length > yh)), m = T(() => l.value && !n.message.read_at && !n.message.local);
    async function b() {
      var Q;
      await ((Q = navigator.clipboard) == null ? void 0 : Q.writeText(n.message.text ?? "")), a.value = !0, setTimeout(() => a.value = !1, wh);
    }
    const _ = T(() => es(n.message.text ?? "", { env: "" })), j = T(() => JSON.parse(n.message.flowchart_edges || "[]")), D = B(!1), k = T(() => es(n.quote || kh, { env: "" }));
    function A() {
      const Q = document.querySelector(`[data-ref="message:${n.message.parent_id}"]`);
      Q ? Q.scrollIntoView({ block: "center", behavior: "smooth" }) : He(`messages:${n.message.parent_id}`);
    }
    zd(o, () => `${n.message.text} ${n.quote}`);
    const E = /\.(png|jpe?g|gif|webp|svg|bmp)$/i, V = (Q) => `/api/files/message/${n.message.id}/${encodeURIComponent(Q)}`, y = T(() => JSON.parse(n.message.captions || "{}")), g = T(() => (n.message.files ?? []).map((Q) => ({ name: Q, address: V(Q), isImage: E.test(Q), title: y.value[Q] || Q }))), R = T(() => ho(new Date(n.message.created_at).getTime() / 1e3 || n.message.created_at)), S = _e(Ce, null), P = B([]), x = B([]), C = B(!1), w = T(() => `Linked: ${P.value.join(", ")}`), f = T(() => P.value.length >= xh), O = T(() => `${P.value.length} linked ${P.value.every((Q) => Q.startsWith("task ")) ? "tasks" : "rows"}`);
    async function I() {
      if (!l.value || !(S != null && S.read) || n.message.local) return;
      const Q = await S.read(`link list --source message:${n.message.id}`);
      if (!Q.ok) return;
      const ee = Q.value.rows ?? Q.value ?? [];
      P.value = ee.filter((Z) => Z.link_type === bh).map((Z) => `${Z.target_model} ${Z.target_id}`), x.value = ee.filter((Z) => Z.link_type === $h).map((Z) => Z.target_id);
    }
    I(), (he = S == null ? void 0 : S.follow) == null || he.call(S, ["link.*"], I);
    const q = B(!1), re = T(() => Kd(n.message.reactions));
    function ie(Q) {
      q.value = !1, s("react", n.message, Q);
    }
    return (Q, ee) => e.message.peer || e.message.recipient ? (i(), u("div", {
      key: 0,
      class: "message",
      "data-message-between-agents": "",
      "data-ref": `message:${e.message.id}`
    }, [
      F(Id, {
        title: e.message.recipient ? `Message sent to ${e.message.recipient}` : `Message from ${e.message.peer}`,
        text: e.message.text,
        icon: e.message.recipient ? "send" : "reply",
        person: e.message.recipient || e.message.peer,
        incoming: !e.message.recipient,
        commentable: "",
        onComment: ee[0] || (ee[0] = (Z) => s("comment", e.message))
      }, null, 8, ["title", "text", "icon", "person", "incoming"])
    ], 8, Gd)) : (i(), u("article", {
      key: 1,
      class: "message",
      "data-message": "",
      "data-figure-bubble": "",
      "data-from": l.value ? "user" : e.message.type,
      "data-ref": `message:${e.message.id}`
    }, [
      p("div", Jd, [
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
          ], 8, Zd)) : $("", !0),
          e.message.parent_id ? (i(), u("div", {
            key: 1,
            class: "message-quote",
            "data-message-reply": "",
            title: "Go to what this answers",
            onClick: be(A, ["stop"]),
            innerHTML: k.value
          }, null, 8, Xd)) : $("", !0),
          c.value !== null ? (i(), u("button", {
            key: 2,
            type: "button",
            class: "message-worker",
            "data-message-worker": "",
            title: `Open worker ${c.value}`,
            onClick: ee[2] || (ee[2] = be((Z) => U(He)(`agents:${c.value}`), ["stop"]))
          }, "Worker " + v(c.value), 9, Qd)) : $("", !0),
          p("div", {
            class: J({ "message-folded": h.value && !d.value }),
            "data-message-text": "",
            innerHTML: _.value
          }, null, 10, eh),
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
            D.value ? (i(), K(pd, {
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
            p("div", th, [
              (i(!0), u(Y, null, ae(U(Vd), (Z) => (i(), u("button", {
                key: Z,
                type: "button",
                class: "message-face",
                title: `React ${Z}`,
                "data-face": Z,
                onClick: (Ae) => ie(Z)
              }, v(Z), 9, nh))), 128))
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
      re.value.length ? (i(), u("div", sh, [
        (i(!0), u(Y, null, ae(re.value, (Z) => (i(), u("button", {
          key: Z.emoji,
          type: "button",
          class: J(["message-reaction", { mine: Z.mine }]),
          title: Z.title,
          "data-reaction": Z.emoji,
          onClick: (Ae) => s("react", e.message, Z.emoji)
        }, [
          ce(v(Z.emoji) + " ", 1),
          Z.count > 1 ? (i(), u("span", oh, v(Z.count), 1)) : $("", !0)
        ], 10, ah))), 128))
      ])) : $("", !0),
      g.value.length ? (i(), u("div", rh, [
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
            }, null, 8, ih)
          ], 8, lh)) : (i(), u("a", {
            key: 1,
            href: Z.address,
            target: "_blank",
            class: "message-file"
          }, v(Z.name), 9, ch))
        ], 64))), 128))
      ])) : $("", !0),
      P.value.length ? (i(), u("div", uh, [
        F(ze, {
          class: "message-links-icon",
          name: "linked"
        }),
        f.value && !C.value ? (i(), u("button", {
          key: 0,
          type: "button",
          class: "message-links-count",
          "data-message-links-count": "",
          onClick: ee[11] || (ee[11] = (Z) => C.value = !0)
        }, v(O.value), 1)) : (i(), u("span", dh, [
          F(Ye, {
            text: w.value,
            inline: ""
          }, null, 8, ["text"])
        ]))
      ])) : $("", !0),
      x.value.length ? (i(), u("div", hh, [
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
        }, "Also sent to worker " + v(Z), 9, fh))), 128))
      ])) : $("", !0),
      p("div", ph, [
        p("time", mh, v(R.value), 1),
        Number.isInteger(e.message.id) ? (i(), u("span", gh, "message " + v(e.message.id), 1)) : $("", !0),
        l.value ? (i(), K(jd, {
          key: 1,
          message: e.message
        }, null, 8, ["message"])) : $("", !0)
      ])
    ], 8, Yd));
  }
}, Ly = /* @__PURE__ */ G(Mh, [["__scopeId", "data-v-895cf9ce"]]), on = [
  { key: 100, label: "Low" },
  { key: 200, label: "Normal" },
  { key: 300, label: "High" },
  { key: 400, label: "Critical" }
], On = 200, fo = (e) => {
  var t;
  return ((t = on.findLast((n) => n.key <= e)) == null ? void 0 : t.key) ?? on[0].key;
}, Dy = (e) => {
  var t;
  return ((t = on.find((n) => n.key === e)) == null ? void 0 : t.label) || String(e);
}, _h = ["aria-label"], Sh = 300, Xs = 400, Eh = {
  __name: "PriorityIcon",
  props: { value: { type: Number, default: On } },
  setup(e) {
    const t = e, n = T(() => fo(t.value)), s = T(() => n.value < On ? [1, 0.25, 0.25] : n.value === On ? [1, 1, 0.25] : [1, 1, 1]);
    return (a, o) => (i(), u("svg", {
      class: J(["ico", "prio", { hot: n.value >= Xs, high: n.value >= Sh && n.value < Xs }]),
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
    ], 10, _h));
  }
}, Ny = /* @__PURE__ */ G(Eh, [["__scopeId", "data-v-b10e610f"]]), Ch = {
  working: { word: "Working", dot: "running" },
  waiting: { word: "Waiting", dot: "you" },
  stuck: { word: "Stuck", dot: "failed" },
  stopped: { word: "Stopped", dot: "" },
  idle: { word: "Idle", dot: "queued" }
}, Ah = { working: "working", busy: "working", compacting: "working", waiting: "waiting", you: "waiting", stuck: "stuck", silent: "stuck", stopped: "stopped" }, Oh = (e) => {
  const t = Ah[e.state] || "idle";
  return { key: t, ...Ch[t] };
}, Th = [
  { key: "working", label: "Working", icon: "agents", hidden: (e) => `${e} working` },
  { key: "waiting", label: "Blocked", icon: "warn", hidden: (e) => `${e} blocked` },
  { key: "idle", label: "Idle", icon: "pause", hidden: (e) => `${e} idle` },
  { key: "stopped", label: "Not running", icon: "x", hidden: (e) => `${e} not running` }
], Rh = [
  { key: "environment", label: "Environment agents", icon: "branch", hidden: (e) => `${e} ${e === 1 ? "environment agent" : "environment agents"}` },
  { key: "worker", label: "Workers", icon: "agents", hidden: (e) => `${e} ${e === 1 ? "worker" : "workers"}` },
  { key: "subagent", label: "Subagents", icon: "agents", hidden: (e) => `${e} ${e === 1 ? "helper" : "helpers"}` }
], Ih = { working: "working", waiting: "waiting", stuck: "waiting", idle: "idle", stopped: "stopped" }, rn = (e) => Ih[Oh(e.card).key] || "idle";
function Bh(e, t) {
  return t.states[rn(e)] === !1 ? rn(e) : t.kinds[e.kind] === !1 ? e.kind : "";
}
const Lh = (e, t) => e.n - t.n || e.kind.localeCompare(t.kind) || e.key.localeCompare(t.key), Qs = { working: 0, waiting: 1, idle: 2, stopped: 3 }, ea = (e, t) => Qs[rn(e)] - Qs[rn(t)], ta = {
  state: (e, t) => t.time - e.time,
  active: (e, t) => t.time - e.time
}, jy = (e, t, n = []) => t === "number" ? [...e].sort((s, a) => ea(s, a) || n.indexOf(s.key) - n.indexOf(a.key) || Lh(s, a)) : [...e].sort((s, a) => ea(s, a) || (ta[t] || ta.state)(s, a)), Dh = Object.fromEntries([...Th, ...Rh].map((e) => [e.key, e.hidden]));
function Py(e, t) {
  const n = {};
  return e.forEach((s) => {
    const a = Bh(s, t);
    a && (n[a] = (n[a] || 0) + 1);
  }), Object.entries(n).map(([s, a]) => Dh[s](a));
}
const Nh = ["aria-checked", "aria-haspopup", "onClick"], jh = {
  key: 0,
  class: "segmented-dot"
}, Ph = {
  key: 1,
  class: "segmented-count"
}, qh = {
  __name: "Segmented",
  props: { options: { type: Array, required: !0 }, value: { type: String, default: "" }, fill: Boolean, wrap: Boolean },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = t, s = wa();
    return (a, o) => {
      const l = tr("tip");
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
          r.dot ? (i(), u("span", jh)) : $("", !0),
          ce(" " + v(r.label) + " ", 1),
          r.count !== void 0 ? (i(), u("em", Ph, v(r.count), 1)) : $("", !0)
        ], 10, Nh)), [
          [l, r.tip || r.title, `${U(s)}-${r.key}`]
        ])), 128))
      ], 2);
    };
  }
}, Wh = /* @__PURE__ */ G(qh, [["__scopeId", "data-v-ca953072"]]), Fh = { class: "form-field" }, Hh = { class: "form-field-head" }, Uh = ["for"], zh = {
  key: 0,
  class: "form-field-aside"
}, Vh = {
  key: 0,
  class: "form-field-help"
}, Kh = {
  __name: "FormField",
  props: {
    label: { type: String, required: !0 },
    for: { type: String, default: "" },
    help: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (i(), u("div", Fh, [
      p("div", Hh, [
        p("label", {
          class: "form-field-label",
          for: t.$props.for
        }, v(e.label), 9, Uh),
        t.$slots.aside ? (i(), u("span", zh, [
          pe(t.$slots, "aside", {}, void 0, !0)
        ])) : $("", !0)
      ]),
      pe(t.$slots, "default", {}, void 0, !0),
      e.help ? (i(), u("p", Vh, v(e.help), 1)) : $("", !0)
    ]));
  }
}, qy = /* @__PURE__ */ G(Kh, [["__scopeId", "data-v-dd7cdcff"]]), Gh = { class: "list-row" }, Yh = {
  key: 0,
  class: "list-row-kind"
}, Jh = { class: "list-row-main" }, Zh = {
  key: 0,
  class: "list-row-title"
}, Xh = { class: "list-row-body" }, Qh = {
  key: 1,
  class: "list-row-end"
}, ef = {
  key: 1,
  class: "list-row-text"
}, tf = {
  __name: "ListRow",
  props: {
    kind: { type: String, default: "" },
    title: { type: String, default: "" },
    text: { type: String, default: "" }
  },
  setup(e) {
    return (t, n) => (i(), u("div", Gh, [
      e.kind ? (i(), u("span", Yh, v(e.kind), 1)) : $("", !0),
      p("div", Jh, [
        e.title ? (i(), u("span", Zh, v(e.title), 1)) : $("", !0),
        p("div", Xh, [
          pe(t.$slots, "default", {}, void 0, !0)
        ]),
        t.$slots.end ? (i(), u("div", Qh, [
          pe(t.$slots, "end", {}, void 0, !0)
        ])) : $("", !0)
      ]),
      e.text ? (i(), u("span", ef, v(e.text), 1)) : $("", !0)
    ]));
  }
}, Wy = /* @__PURE__ */ G(tf, [["__scopeId", "data-v-63155fba"]]), nf = {
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
}, sf = { claude: "Claude Code", codex: "Codex" }, af = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, of = {
  key: 1,
  class: "menu-item-text"
}, rf = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (t, n) => (i(), u("button", {
      type: "button",
      class: J(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (i(), u("span", af, v(e.checked ? "✓" : ""), 1)) : $("", !0),
      e.description ? (i(), u("span", of, [
        p("span", null, [
          pe(t.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, v(e.description), 1)
      ])) : pe(t.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, vt = /* @__PURE__ */ G(rf, [["__scopeId", "data-v-fec99974"]]), lf = (e, t, n) => Math.max(t, Math.min(n, e)), cf = (e, t, n = `${t}s`) => `${e} ${e === 1 ? t : n}`, po = /* @__PURE__ */ new WeakMap(), uf = (e, t) => po.set(e, t);
function df(e, t) {
  for (let n = t; n; n = po.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function hf(e, t) {
  const n = (s) => {
    var o, l;
    const a = ((o = e.value) == null ? void 0 : o.element) || ((l = e.value) == null ? void 0 : l.$el) || e.value;
    a && !df(a, s.target) && t(s);
  };
  window.addEventListener("click", n), Ee(() => window.removeEventListener("click", n));
}
const ft = 8, ff = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, a = B(null), o = (f) => f ? `${f}px` : void 0, l = T(() => ({
      minWidth: o(s.minWidth),
      maxWidth: o(s.maxWidth),
      maxHeight: o(s.maxHeight),
      height: o(s.height)
    })), r = B({ w: 0, h: 0 }), c = B(s.anchor ? s.anchor.getBoundingClientRect() : null), d = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), h = (f) => ({
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
      const O = m(s.anchor), I = _(O, f);
      return r.value.w <= I.across && r.value.h <= Math.max(I.below, I.above) ? O : d();
    }
    const D = T(() => {
      if (!c.value) return l.value;
      const f = c.value, O = j(f), I = _(O, f), { w: q, h: re } = r.value, ie = s.align === "auto" ? f.left + f.right > O.left + O.right : s.align === "right", he = lf(ie ? f.right - q : f.left, O.left + ft, Math.max(O.left + ft, O.right - q - ft)), ee = re > I.below && I.above > I.below ? { bottom: `${window.innerHeight - f.top + s.gap}px`, maxHeight: b(s.maxHeight, I.above) } : { top: `${f.bottom + s.gap}px`, maxHeight: b(s.maxHeight, I.below) };
      return { ...l.value, ...ee, left: `${he}px`, maxWidth: b(s.maxWidth, I.across) };
    }), k = n, A = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function E(f) {
      const O = A(), I = O.indexOf(document.activeElement);
      O[(I + f + O.length) % O.length].focus();
    }
    const V = { ArrowDown: () => E(1), ArrowUp: () => E(-1), Escape: () => k("close") }, y = (f) => V[f.key] && (f.preventDefault(), V[f.key]()), g = () => a.value && (r.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let R = 0;
    const S = new ResizeObserver(() => {
      cancelAnimationFrame(R), R = requestAnimationFrame(g);
    });
    hf(a, (f) => s.anchor && !s.anchor.contains(f.target) && k("close"));
    const P = (f, O) => ["top", "left", "right", "bottom"].some((I) => Math.abs(f[I] - O[I]) > 1), x = (f) => f.bottom < 0 || f.top > window.innerHeight;
    let C = 0;
    function w() {
      if (s.anchor) {
        const f = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || x(f)) return k("close");
        P(f, c.value) && (c.value = f);
      }
      C = requestAnimationFrame(w);
    }
    return Le(() => {
      s.anchor && a.value && uf(a.value, s.anchor), g(), a.value && S.observe(a.value), !s.plain && A()[0] && A()[0].focus(), w();
    }), Ee(() => {
      S.disconnect(), cancelAnimationFrame(C), cancelAnimationFrame(R);
    }), t({ element: a }), (f, O) => (i(), K(gs, {
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
}), Es = /* @__PURE__ */ G(ff, [["__scopeId", "data-v-3d203970"]]), pf = ["aria-expanded"], mf = { class: "drop-label" }, gf = ["value"], vf = {
  key: 1,
  class: "drop-lead"
}, yf = { class: "drop-item-text" }, wf = {
  key: 2,
  class: "drop-note"
}, kf = {
  key: 1,
  class: "drop-none"
}, bf = {
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
    const n = e, s = t, a = B(!1), o = B(null), l = B(""), r = T(() => {
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
        e.icon ? (i(), K(ve, {
          key: 0,
          name: e.icon,
          size: 12
        }, null, 8, ["name"])) : $("", !0),
        p("span", mf, v(e.label), 1),
        F(ve, {
          name: "down",
          size: 11
        })
      ], 10, pf),
      a.value ? (i(), K(Es, {
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
          }, null, 40, gf)) : $("", !0),
          (i(!0), u(Y, null, ae(r.value, (m) => (i(), K(vt, {
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
              m.lead ? (i(), u("span", vf, v(m.lead), 1)) : $("", !0),
              p("span", yf, v(m.label), 1),
              m.note ? (i(), u("span", wf, v(m.note), 1)) : $("", !0)
            ]),
            _: 2
          }, 1032, ["on", "data-drop-item", "onClick"]))), 128)),
          r.value.length ? $("", !0) : (i(), u("p", kf, v(e.empty), 1))
        ]),
        _: 1
      }, 8, ["anchor", "min-width"])) : $("", !0)
    ], 2));
  }
}, $f = /* @__PURE__ */ G(bf, [["__scopeId", "data-v-29dfcce5"]]), Fy = {
  __name: "ModelPicker",
  props: {
    provider: { type: String, default: "claude" },
    value: { type: String, default: "" },
    inherits: Boolean
  },
  emits: ["pick"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = T(() => [
      ...nf[n.provider],
      ...n.inherits ? [{ key: "", label: "the agent's model", note: "the model of the agent that starts it" }] : []
    ]), o = T(() => (a.value.find((l) => l.key === n.value) || { label: n.value || "the agent's model" }).label);
    return (l, r) => (i(), K($f, {
      label: o.value,
      icon: "model",
      items: a.value,
      picked: e.value,
      "menu-width": 280,
      "aria-label": `${U(sf)[e.provider]} model`,
      onPick: r[0] || (r[0] = (c) => s("pick", c.key))
    }, null, 8, ["label", "items", "picked", "aria-label"]));
  }
}, xf = ["aria-label"], Mf = { class: "head" }, _f = { class: "names" }, Sf = { class: "body" }, Ef = {
  key: 0,
  class: "foot"
}, Cf = {
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
    const n = e, s = t, { visible: a, close: o, closed: l } = ro(s, n), r = lo(a);
    return (c, d) => (i(), K(gs, { to: "body" }, [
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
                p("header", Mf, [
                  p("div", _f, [
                    p("h2", null, v(e.title), 1),
                    e.abstract ? (i(), K(Ye, {
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
                p("div", Sf, [
                  pe(c.$slots, "default", {}, void 0, !0)
                ]),
                c.$slots.foot ? (i(), u("footer", Ef, [
                  pe(c.$slots, "foot", {}, void 0, !0)
                ])) : $("", !0)
              ], 64)) : pe(c.$slots, "default", {}, void 0, !0, 1)
            ], 10, xf)
          ], 6)) : $("", !0)
        ]),
        _: 3
      }, 8, ["onAfterLeave"])
    ]));
  }
}, Hy = /* @__PURE__ */ G(Cf, [["__scopeId", "data-v-c9a3f43a"]]), os = {
  mounted(e, { value: t }) {
    e.value = t ?? "";
  },
  beforeUpdate(e, { value: t, oldValue: n }) {
    t === n || document.activeElement === e || (e.value = t ?? "");
  }
}, Af = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextArea",
  setup(e) {
    const t = vs(), n = T(() => Object.fromEntries(Object.entries(t).filter(([s]) => s !== "value")));
    return (s, a) => et((i(), u("textarea", Qe({
      class: "text-area",
      spellcheck: "false"
    }, n.value), null, 16)), [
      [U(os), U(t).value]
    ]);
  }
}), Uy = /* @__PURE__ */ G(Af, [["__scopeId", "data-v-e130a5b9"]]), Of = {
  key: 1,
  class: "text-field-label"
}, Tf = {
  key: 2,
  class: "text-field-end"
}, Rf = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "TextInput",
  props: /* @__PURE__ */ Kn({ label: { type: String, default: "" }, icon: { type: String, default: "" }, large: Boolean }, {
    modelValue: { type: String, default: null },
    modelModifiers: {}
  }),
  emits: ["update:modelValue"],
  setup(e, { expose: t }) {
    var h;
    const n = Vn(e, "modelValue"), s = vs(), a = "onUpdate:modelValue" in (((h = nr()) == null ? void 0 : h.vnode.props) || {}), o = T(() => a ? n.value : s.value), l = (m) => a && (n.value = m.target.value), r = T(
      () => Object.fromEntries(Object.entries(s).filter(([m]) => m !== "class" && m !== "style" && m !== "value"))
    ), c = T(() => Object.fromEntries(Object.entries(s).filter(([m]) => m !== "value"))), d = B(null);
    return t({ focus: () => d.value && d.value.focus() }), (m, b) => e.label || e.icon || m.$slots.end ? (i(), u("label", {
      key: 0,
      class: J(["text-field", { large: e.large, ended: m.$slots.end }, U(s).class]),
      style: $e(U(s).style)
    }, [
      e.icon ? (i(), K(ve, {
        key: 0,
        name: e.icon,
        size: 13,
        class: "text-field-icon"
      }, null, 8, ["name"])) : $("", !0),
      e.label ? (i(), u("span", Of, v(e.label), 1)) : $("", !0),
      et(p("input", Qe({
        ref_key: "input",
        ref: d,
        class: "text-field-input",
        spellcheck: "false"
      }, r.value, { onInput: l }), null, 16), [
        [U(os), o.value]
      ]),
      m.$slots.end ? (i(), u("span", Tf, [
        pe(m.$slots, "end", {}, void 0, !0)
      ])) : $("", !0)
    ], 6)) : et((i(), u("input", Qe({
      key: 1,
      ref_key: "input",
      ref: d,
      class: "text-input",
      spellcheck: "false"
    }, c.value, { onInput: l }), null, 16)), [
      [U(os), o.value]
    ]);
  }
}), zy = /* @__PURE__ */ G(Rf, [["__scopeId", "data-v-d9c38ca8"]]), na = (e) => e.page * e.size < e.total;
function If(e, t, { incremental: n = !1 } = {}) {
  const s = pn(), a = B([]), o = B(""), l = B(!1), r = B(!1), c = B(""), d = B(null);
  async function h(k) {
    const A = await s.read(`${e} --before-id ${k + 1} --limit 1`);
    if (!A.ok) return j();
    const E = A.value.rows.find((V) => V.id === k);
    a.value = E ? a.value.map((V) => V.id === k ? E : V) : a.value.filter((V) => V.id !== k);
  }
  async function m(k) {
    if (n && String((k == null ? void 0 : k.event) ?? "").endsWith(".delete")) return void (a.value = a.value.filter((g) => g.id !== k.row_id));
    if (n && (k != null && k.row_id) && !String(k.event ?? "").endsWith(".create") && a.value.some((g) => g.id === k.row_id)) return h(k.row_id);
    if (!(n && a.value.length && String((k == null ? void 0 : k.event) ?? "").endsWith(".create"))) return j();
    const E = Math.max(...a.value.map((g) => g.id)), V = await s.read(`${e} --after-id ${E}`);
    if (!V.ok) return j();
    const y = new Set(a.value.map((g) => g.id));
    a.value = [...V.value.rows.filter((g) => !y.has(g.id)), ...a.value];
  }
  async function b() {
    if (!a.value.length) return !1;
    const k = Math.min(...a.value.map((V) => V.id)), A = await s.read(`${e} --before-id ${k}`);
    if (!A.ok || !A.value.rows.length) return r.value = !1;
    r.value = na(A.value);
    const E = new Set(a.value.map((V) => V.id));
    return a.value = [...a.value, ...A.value.rows.filter((V) => !E.has(V.id))], !0;
  }
  let _ = 0;
  async function j() {
    const k = ++_, A = await s.read(s.shared ? `${s.shared.model} show ${s.shared.id}` : e);
    if (k !== _) return;
    const E = A.ok ? s.shared ? [A.value] : A.value.rows : [], V = E.length ? Math.min(...E.map((y) => y.id)) : 0;
    a.value = n && A.ok && V ? [...a.value.filter((y) => y.id > Math.max(...E.map((g) => g.id))), ...E, ...a.value.filter((y) => y.id < V)] : E, A.ok && !a.value.some((y) => y.id < V) && (r.value = !s.shared && na(A.value)), o.value = A.ok ? "" : A.error, l.value = !0;
  }
  async function D(k, A = null) {
    const E = a.value;
    A && (a.value = A(E));
    const V = await s.run(k);
    return A && !V.ok && (a.value = E), c.value = V.ok ? "" : V.error, d.value = V.ok ? V.value : null, await j(), V;
  }
  return s.follow(t, m), j(), { rows: a, failure: o, loaded: l, more: r, load: j, older: b, act: D, actionFailure: c, answer: d, context: s };
}
const Bf = { class: "title" }, Lf = { class: "state" }, Df = {
  __name: "StateRows",
  props: {
    line: { type: String, required: !0 },
    events: { type: Array, required: !0 },
    empty: { type: String, required: !0 }
  },
  setup(e) {
    const t = e, { rows: n, failure: s, loaded: a } = If(t.line, t.events);
    return (o, l) => (i(), K(nl, {
      rows: U(n),
      failure: U(s),
      loaded: U(a),
      empty: e.empty
    }, {
      default: z(({ row: r }) => [
        p("span", Bf, v(r.title), 1),
        p("span", Lf, v(r.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, Vy = /* @__PURE__ */ G(Df, [["__scopeId", "data-v-a69084cd"]]);
function Nf(e = 1e3, t = null) {
  const n = B(Date.now() / 1e3);
  let s = 0;
  const a = (o) => {
    clearInterval(s), s = o ? setInterval(() => n.value = Date.now() / 1e3, e) : 0;
  };
  return t ? ke(t, a, { immediate: !0 }) : a(!0), Ee(() => clearInterval(s)), n;
}
const Tn = B(Date.now() / 1e3);
let sa = 0, Gt = 0;
function jf() {
  return Gt || (Tn.value = Date.now() / 1e3, sa = setInterval(() => Tn.value = Date.now() / 1e3, 1e3)), Gt += 1, ka() && ba(() => {
    Gt -= 1, Gt || clearInterval(sa);
  }), Tn;
}
const Pf = ["title", "data-figure-mark", "data-folded", "data-open"], qf = {
  key: 2,
  class: "worker"
}, Wf = { class: "head" }, Ff = { key: 0 }, Hf = {
  key: 3,
  class: "status"
}, Uf = {
  key: 0,
  class: "figure"
}, zf = {
  key: 1,
  class: "ran-for"
}, Vf = { key: 2 }, Kf = {
  key: 3,
  class: "news"
}, Gf = {
  key: 4,
  class: "spin",
  "aria-label": "Still running"
}, Yf = {
  key: 6,
  class: "settled"
}, Jf = {
  key: 1,
  class: "bar"
}, Zf = {
  key: 3,
  class: "detail body"
}, Xf = {
  key: 0,
  class: "body-label"
}, Qf = ["title"], e1 = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "ChatMark",
  props: { mark: { type: Object, required: !0 }, open: { type: Boolean, default: void 0 } },
  setup(e) {
    const t = e, n = vs(), s = ["onClick", "onAct"], a = T(() => Object.fromEntries(Object.entries(n).filter(([Q]) => !s.includes(Q)))), o = B(!1), l = T(() => !!(t.mark.detail || t.mark.command || t.mark.body)), r = T(() => t.open !== void 0), c = T(() => r.value || l.value), d = T(() => r.value ? t.open : o.value), h = T(() => r.value ? !t.open : l.value && !o.value), m = T(() => !!(t.mark.action && n.onAct)), b = T(() => c.value || m.value || !!n.onClick), _ = B(null), j = B(null), { folded: D, phase: k } = uo(_, () => h.value);
    function A(Q) {
      var ee, Z;
      if (!(Q.target !== _.value && !j.value.contains(Q.target))) {
        if (r.value) return (ee = n.onClick) == null ? void 0 : ee.call(n, Q);
        if (l.value) return void (o.value = !o.value);
        (Z = n.onAct || n.onClick) == null || Z(Q);
      }
    }
    const E = (Q) => n.onAct(Q), V = ["failed", "unfinished"], y = T(() => t.mark.stopped || t.mark.state === "stopped" ? "stopped" : t.mark.tone ? t.mark.tone : t.mark.ended ? V.includes(t.mark.state) ? "danger" : "good" : ""), g = T(() => t.mark.color ? t.mark.color : y.value === "stopped" ? "var(--text-3)" : t.mark.asks ? "var(--asks)" : y.value ? `var(--tone-${y.value})` : t.mark.group ? `var(--group-${t.mark.group})` : ""), R = T(() => g.value || "var(--tone-work)"), S = T(() => !t.mark.ending && !t.mark.ended && y.value !== "stopped"), P = jf(), x = T(
      () => t.mark.began_at && S.value && !t.mark.figure && !t.mark.counting ? qd(P.value - t.mark.began_at) : ""
    ), C = T(() => {
      const { started: Q, ended: ee } = t.mark;
      return Q ? ee ? `ran ${Zs(ee - Q, !0)}` : Zs(P.value - Q, !0) : x.value;
    }), w = ["bad", "danger", "warn"], f = T(() => w.includes(y.value) || t.mark.asks ? "attention" : S.value && (t.mark.active || t.mark.figure || t.mark.counting || t.mark.began_at || t.mark.started && !t.mark.ended) ? "process" : "event"), O = ["bad", "danger"], I = T(() => O.includes(y.value)), q = T(() => f.value === "process" ? "running" : I.value ? "cross" : y.value === "stopped" ? "stopped" : y.value === "good" ? "tick" : ""), re = T(
      () => !!(t.mark.figure || C.value || t.mark.docked || t.mark.stopping || q.value || t.mark.settled || t.mark.news)
    ), ie = T(() => [t.mark.title, t.mark.time ? ho(t.mark.time) : ""].filter(Boolean).join(" · ")), he = T(() => ({
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
          failed: I.value,
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
      (i(), K(it(b.value ? "button" : "span"), {
        ref_key: "top",
        ref: j,
        class: "top",
        type: b.value ? "button" : void 0,
        "aria-expanded": c.value ? String(!!d.value) : void 0
      }, {
        default: z(() => [
          e.mark.markIcon ? (i(), K(ze, {
            key: 0,
            class: "ico",
            name: e.mark.markIcon
          }, null, 8, ["name"])) : (i(), K(ve, {
            key: 1,
            name: e.mark.icon || "dot"
          }, null, 8, ["name"])),
          e.mark.worker ? (i(), u("span", qf, v(e.mark.worker), 1)) : $("", !0),
          p("span", Wf, [
            F(Ye, {
              class: "title",
              text: e.mark.label,
              inline: ""
            }, null, 8, ["text"]),
            e.mark.name ? (i(), u("strong", Ff, v(e.mark.name), 1)) : $("", !0),
            c.value ? (i(), K(Lt, {
              key: 1,
              open: !!d.value
            }, null, 8, ["open"])) : $("", !0)
          ]),
          re.value ? (i(), u("span", Hf, [
            e.mark.figure ? (i(), u("span", Uf, v(e.mark.figure), 1)) : $("", !0),
            C.value ? (i(), u("span", zf, v(C.value), 1)) : $("", !0),
            e.mark.stopping ? (i(), u("span", Vf, "Stopping")) : $("", !0),
            e.mark.news ? (i(), u("span", Kf, v(e.mark.news), 1)) : $("", !0),
            q.value === "running" ? (i(), u("span", Gf)) : q.value ? (i(), K(ze, {
              key: 5,
              class: J(["sign", q.value]),
              name: q.value
            }, null, 8, ["class", "name"])) : $("", !0),
            e.mark.settled ? (i(), u("span", Yf, v(e.mark.settled), 1)) : $("", !0)
          ])) : $("", !0)
        ]),
        _: 1
      }, 8, ["type", "aria-expanded"])),
      m.value ? (i(), K(co, {
        key: 0,
        label: e.mark.action,
        open: !!d.value,
        onClick: be(E, ["stop"])
      }, null, 8, ["label", "open"])) : $("", !0),
      (e.mark.figure || e.mark.counting) && S.value ? (i(), u("span", Jf, [
        p("span", {
          class: "progress",
          style: $e({ width: `${Math.round((e.mark.fraction || 0) * 100)}%`, background: R.value })
        }, null, 4)
      ])) : $("", !0),
      e.mark.detail && !U(D) ? (i(), K(Ye, {
        key: 2,
        class: "detail",
        text: e.mark.detail,
        inline: "",
        "row-names": !1
      }, null, 8, ["text"])) : $("", !0),
      e.mark.body && !U(D) ? (i(), u("div", Zf, [
        e.mark.bodyLabel ? (i(), u("p", Xf, v(e.mark.bodyLabel), 1)) : $("", !0),
        F(Ye, {
          text: e.mark.body,
          "row-names": !1
        }, null, 8, ["text"])
      ])) : $("", !0),
      e.mark.command && !U(D) ? (i(), u("code", {
        key: 4,
        class: "detail command",
        title: e.mark.command
      }, v(e.mark.command), 9, Qf)) : $("", !0),
      e.mark.card ? (i(), K(Ye, {
        key: 5,
        class: "card",
        text: e.mark.card,
        "row-names": !1
      }, null, 8, ["text"])) : $("", !0),
      pe(Q.$slots, "default", {
        shown: !U(D)
      }, void 0, !0)
    ], 16, Pf));
  }
}), mo = /* @__PURE__ */ G(e1, [["__scopeId", "data-v-74d78abb"]]), t1 = { outputs: "output", skills: "skill", agents: "agent", subagents: "agent", pages: "page" };
function go(e) {
  var n;
  const t = t1[e] || ((n = Pt(e)) == null ? void 0 : n.title.toLowerCase());
  return t ? `Open the ${t}` : "Open it";
}
const n1 = (e) => go(String(e).split(":")[0]), vo = /* @__PURE__ */ new Set(["failed", "stopped", "lost", "blocked", "cancelled", "orphaned"]), s1 = { passed: "good", failed: "danger", warned: "warn", running: "" }, a1 = { good: "good", warn: "warn", danger: "danger" }, aa = {
  "open row": (e) => He(`${e.target_model}:${e.target_id}`),
  "open page": (e) => Vr(e.target_model, e.target_id || 0)
}, o1 = { "open row": (e) => n1(e.target_model), "open page": () => go("pages") };
function r1(e, t) {
  const n = t || {}, s = aa[n.click] && e.target_model ? n.click : "";
  return {
    key: `chat_mark:${e.id}`,
    icon: n.family_icon || (t ? "" : "dot"),
    markIcon: n.mark_icon || "",
    group: n.group || "",
    tone: n.colouring === "outcome" ? s1[e.outcome] || "" : a1[e.variant] || "",
    label: e.text,
    // an opened mark shows its whole lines in its body, so their cut-off first part is not a second line
    detail: n.body_url || e.lines ? "" : e.detail || "",
    figure: e.figure || "",
    fraction: e.fraction || 0,
    // only a mark that follows a process ends with a verdict; an event the journal records is a quiet line with no tick
    ended: !!n.process && e.state === "ended",
    active: !!n.process && e.state === "shown",
    time: Date.parse(e.created_at) / 1e3,
    action: s ? o1[s](e) : "",
    handlers: s ? { onAct: () => aa[s](e) } : {}
  };
}
const l1 = 24, i1 = 1e3, oa = 2e3, c1 = 0.25, u1 = 5e3;
function d1(e, t = l1, n = () => !0) {
  const s = B(!1), a = B(0), o = B(!1);
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
    const g = Date.now() - c < oa ? oa : i1;
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
  const k = () => !!d() && h() <= d().clientHeight * c1;
  function A() {
    clearTimeout(r), k() && (r = setTimeout(() => s.value && k() && n() && j(!0), u1));
  }
  function E() {
    m() ? _() : D();
  }
  function V(y = 1, g = !1) {
    s.value ? a.value += Math.max(0, y) : j(g);
  }
  return ka() && ba(() => [l, r].forEach(clearTimeout)), { away: s, missed: a, showNewest: o, gap: h, atBottom: m, follow: _, toBottom: j, left: D, scrolled: E, arrived: V };
}
const h1 = /\x1b\[[0-?]*[ -/]*[@-~]|\x1b\][^\x07\x1b]*(?:\x07|\x1b\\)|\x1b[@-Z\\-_]|\x1b/g, f1 = (e) => String(e ?? "").replace(h1, ""), p1 = {
  __name: "OutputLines",
  props: { lines: { type: Array, required: !0 }, empty: { type: String, default: "It printed nothing yet." } },
  emits: ["older"],
  setup(e, { emit: t }) {
    const n = e, s = t, a = B(null), { away: o, scrolled: l, arrived: r, toBottom: c } = d1(a);
    ke(
      () => n.lines.length,
      () => Nt(() => r()),
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
      ce(v(U(f1)(e.lines.join(`
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
}, m1 = /* @__PURE__ */ G(p1, [["__scopeId", "data-v-d9fa8127"]]), g1 = 1e4;
class v1 {
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
    return this.heardAt !== null && t - this.heardAt > g1;
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
const y1 = {
  key: 0,
  class: "frame-note"
}, w1 = {
  key: 0,
  class: "frame-note"
}, k1 = ["src", "title"], b1 = 1e3, $1 = {
  __name: "FrameContent",
  props: { src: { type: String, required: !0 } },
  setup(e) {
    const t = e, n = pn(), s = B(null), a = B(!1), o = B(!1);
    let l = null, r = 0;
    return Le(() => {
      l = new v1(s.value, n), l.start(), r = setInterval(() => {
        a.value = l.silent();
      }, b1);
    }), Ee(() => {
      l == null || l.stop(), clearInterval(r);
    }), (c, d) => o.value ? (i(), u("p", y1, "This window was closed because it stopped answering.")) : (i(), u(Y, { key: 1 }, [
      a.value ? (i(), u("div", w1, [
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
      }, null, 8, k1)
    ], 64));
  }
}, x1 = /* @__PURE__ */ G($1, [["__scopeId", "data-v-32a49046"]]), M1 = 0, _1 = "/api/lines", S1 = "/api/line";
class E1 {
  constructor() {
    this.waiting = [], this.timer = null;
  }
  add(t, n) {
    return new Promise((s, a) => {
      this.waiting.push({ body: t, signal: n, resolve: s, reject: a }), this.timer ?? (this.timer = setTimeout(() => this.send(), M1));
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
        const n = await De.raw(_1, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ lines: t.map((a) => a.body) }) }), { answers: s } = await n.json();
        t.forEach((a, o) => a.resolve(s[o]));
      } catch (n) {
        t.forEach((s) => s.reject(n));
      }
  }
  async alone(t) {
    try {
      const n = await De.raw(S1, { signal: t.signal, method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(t.body) });
      t.resolve(await n.json());
    } catch (n) {
      t.reject(n);
    }
  }
}
const C1 = new E1();
class A1 {
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
      n.patterns.some((s) => yo(s, t.event)) && (n.visible() ? n.heard(t) : this.held.add(n));
  }
  shown(t) {
    for (const n of [...this.held].filter((s) => s.window === t))
      this.held.delete(n), n.heard({ event: "refresh" });
  }
}
function yo(e, t) {
  const [n, s] = e.split("."), [a, o] = t.split(".");
  return (n === "*" || n === a) && (s === "*" || s === o);
}
const O1 = Symbol("pane-page"), T1 = { 1: "refused", 2: "usage", 3: "fault" }, R1 = 100, I1 = /"([^"]*)"|'([^']*)'|(\S+)/g;
function B1({ window: e, environment: t, agent: n, visible: s, permissions: a, events: o = [], subscriptions: l, open: r, options: c = B({}), declared: d = [], page: h = null, setOption: m = () => {
}, autoScroll: b = "", tabs: _ = [], search: j = {}, readOnly: D = !1, shared: k = null }) {
  const A = /* @__PURE__ */ new Map(), E = new AbortController(), V = (y) => {
    const g = A.get(y);
    if (g && performance.now() - g.at < R1) return g.answer;
    const R = At(e, y, t, E.signal);
    return A.set(y, { answer: R, at: performance.now() }), R;
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
    read: V,
    run: (y) => At(e, y, t, E.signal),
    upload: (y) => D1(y, E.signal),
    cancel: () => E.abort(),
    follow: (y, g) => l.follow(e, y.filter((R) => o.some((S) => yo(S, R))), g, s),
    open: r,
    face: document.documentElement.classList.contains("phone") ? "phone" : "person",
    option: (y) => T(() => {
      var g;
      return c.value[y] ?? ((g = d.find((R) => R.key === y)) == null ? void 0 : g.default);
    }),
    setting: async (y, g) => {
      const R = await V(`window setting ${e} ${y}`);
      return R.ok ? R.value.value : g;
    },
    setOption: m,
    keep: (y, g) => At(e, ["window", "save-setting", e, y, JSON.stringify(g)], t, E.signal)
  };
}
function L1(e) {
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
    const a = await C1.add({ window: e, line: Array.isArray(t) ? t : N1(t), environment: n }, s);
    return s != null && s.aborted ? ln : a.code === 0 ? { ok: !0, value: a.value } : { ok: !1, failure: T1[a.code] || "fault", error: L1(a.error) };
  } catch (a) {
    return s != null && s.aborted ? ln : { ok: !1, failure: "unreachable", error: String(a) };
  }
}
async function D1(e, t = void 0) {
  try {
    const n = await De.raw(`/api/files?name=${encodeURIComponent(e.name)}`, { signal: t, method: "POST", headers: { "Content-Type": "application/octet-stream" }, body: e }), s = await n.json();
    return t != null && t.aborted ? ln : n.ok ? { ok: !0, value: s.file } : { ok: !1, failure: "refused", error: s.error ?? "the file was not taken" };
  } catch (n) {
    return t != null && t.aborted ? ln : { ok: !1, failure: "unreachable", error: String(n) };
  }
}
function N1(e) {
  return [...e.matchAll(I1)].map((t) => t[1] ?? t[2] ?? t[3]);
}
function j1({ title: e, type: t, lines: n }) {
  return `${e} wants to ${t === "reads" ? "read" : "run"}: ${n.join(", ")}. Allow?`;
}
const P1 = {
  class: "allowance-prompt",
  role: "dialog"
}, q1 = { class: "allowance-prompt-text" }, W1 = { class: "allowance-prompt-buttons" }, F1 = {
  __name: "AllowancePrompt",
  props: { request: { type: Object, required: !0 } },
  emits: ["answer"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (i(), u("div", P1, [
      p("p", q1, v(U(j1)(e.request)), 1),
      p("div", W1, [
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
}, H1 = /* @__PURE__ */ G(F1, [["__scopeId", "data-v-102dc765"]]), Rn = {
  __name: "WindowPlaceholder",
  props: { name: { type: String, required: !0 }, reason: { type: String, required: !0 }, retry: Boolean, removable: Boolean },
  emits: ["retry", "remove"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (i(), K(nn, {
      class: "window-placeholder",
      title: e.name
    }, {
      default: z(() => [
        ce(v(e.reason) + " ", 1),
        e.retry ? (i(), K(we, {
          key: 0,
          onClick: a[0] || (a[0] = (o) => n("retry"))
        }, {
          default: z(() => [...a[2] || (a[2] = [
            ce("Retry", -1)
          ])]),
          _: 1
        })) : $("", !0),
        e.removable ? (i(), K(we, {
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
}, U1 = ["data-window", "data-agent"], z1 = {
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
    const n = e, s = t, a = B(""), o = B(0);
    function l() {
      a.value = "", o.value++;
    }
    const r = _e(Or, null), c = B1({
      window: n.name,
      environment: n.environment,
      agent: n.agent,
      visible: () => n.visible,
      permissions: n.permissions,
      events: n.events,
      subscriptions: n.subscriptions,
      options: T(() => n.options),
      declared: n.declared,
      page: _e(O1, null),
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
    sr(Ce, c), ke(() => n.visible, (m) => m && n.subscriptions.shown(n.name)), Ee(() => {
      c.cancel(), n.subscriptions.stopAll(n.name);
    }), ar((m) => (a.value = m instanceof Error ? m.message : String(m), n.subscriptions.stopAll(n.name), !1));
    const d = () => ps(n.component), h = () => {
      var m, b;
      return ((b = (m = n.prompts) == null ? void 0 : m.current.value) == null ? void 0 : b.window) === n.name ? n.prompts.current.value : null;
    };
    return (m, b) => (i(), u("section", {
      class: "window",
      "data-window": e.name,
      "data-agent": e.agent ?? void 0
    }, [
      h() ? (i(), K(H1, {
        key: 0,
        request: h(),
        onAnswer: b[0] || (b[0] = (_) => e.prompts.answer(_))
      }, null, 8, ["request"])) : $("", !0),
      e.unavailableReason ? (i(), K(Rn, {
        key: 1,
        name: e.name,
        reason: e.unavailableReason
      }, null, 8, ["name", "reason"])) : a.value ? (i(), K(Rn, {
        key: 2,
        name: e.name,
        reason: `This window failed: ${a.value}`,
        retry: "",
        onRetry: l
      }, null, 8, ["name", "reason"])) : e.component ? (i(), K(d, { key: o.value })) : (i(), K(Rn, {
        key: 3,
        name: e.name,
        reason: "No installed module has this window.",
        removable: "",
        onRemove: b[1] || (b[1] = (_) => s("remove"))
      }, null, 8, ["name"]))
    ], 8, U1));
  }
}, wo = /* @__PURE__ */ G(z1, [["__scopeId", "data-v-32203cbc"]]), V1 = {
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
    const n = e, s = t, a = { render: () => ps(x1, { src: n.entry.entry_url }) };
    return (o, l) => (i(), K(wo, {
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
}, rs = "journal.stale-build-reload", K1 = (e) => /does not provide an export/.test(String((e == null ? void 0 : e.message) ?? ""));
function G1(e, t = window.sessionStorage, n = () => window.location.reload()) {
  try {
    if (t.getItem(rs) === e.message) return !1;
    t.setItem(rs, e.message);
  } catch {
    return !1;
  }
  return n(), !0;
}
function Y1(e = window.sessionStorage) {
  try {
    e.removeItem(rs);
  } catch {
    return;
  }
}
const J1 = ["data-window"], Z1 = {
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
    const n = e, s = t, a = fn(null), o = B("");
    return ke(
      () => n.entry.entry_url,
      async (l) => {
        if (a.value = null, o.value = "", !n.entry.unavailable_reason)
          try {
            a.value = (await import(
              /* @vite-ignore */
              l
            )).default, Y1();
          } catch (r) {
            if (K1(r) && G1(r)) return;
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
    ], 8, J1)) : (i(), K(wo, {
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
}, X1 = {
  __name: "ModuleBody",
  props: { declaration: { type: Object, required: !0 }, row: { type: Object, default: null }, head: { type: Object, default: null } },
  setup(e) {
    var r;
    const t = e, n = new A1(), s = ((r = _e(Ce, null)) == null ? void 0 : r.environment) ?? "", a = { reads: [], runs: [], missing: [], ask: async () => !0 }, o = T(() => ({
      // a body reads as the window its type names, which the module declares with the reads the body needs
      name: t.declaration.type,
      entry_url: t.declaration.body_url,
      events: t.declaration.events ?? [],
      options: []
    })), l = T(() => !!(t.declaration.shipped || t.declaration.trusted));
    return (c, d) => l.value ? (i(), K(Z1, {
      key: 0,
      entry: o.value,
      subscriptions: U(n),
      environment: U(s),
      permissions: a,
      options: { row: e.row, head: e.head }
    }, null, 8, ["entry", "subscriptions", "environment", "options"])) : (i(), K(V1, {
      key: 1,
      entry: o.value,
      subscriptions: U(n),
      environment: U(s),
      permissions: a,
      options: { row: e.row }
    }, null, 8, ["entry", "subscriptions", "environment", "options"]));
  }
}, Q1 = { class: "mark-more-inner" }, ep = {
  class: "mark-lines",
  "data-mark-reason": ""
}, tp = {
  key: 1,
  class: "mark-lines",
  role: "alert"
}, np = {
  key: 3,
  class: "mark-lines"
}, sp = "process", ra = "task", ap = 2e3, op = {
  __name: "MarkBody",
  props: { declaration: { type: Object, required: !0 }, mark: { type: Object, required: !0 }, shown: Boolean, head: { type: Object, default: null } },
  setup(e) {
    const t = e, n = _e(Ce), s = T(() => String(t.mark.lines || "").split(`
`).filter(Boolean)), a = T(() => vo.has(t.mark.variant) && t.mark.detail || ""), o = T(() => t.mark.target_model === ra ? t.mark.target_id : 0), l = B([]), r = B(!1), c = B(""), d = T(() => t.mark.target_model === sp && !!t.mark.target_id);
    async function h() {
      const _ = await n.run(["output", "peek", String(t.mark.target_id), "--all"]);
      r.value = !0, c.value = _.ok ? "" : _.error, _.ok && (l.value = _.value.lines);
    }
    let m = null;
    const b = () => clearInterval(m);
    return ke(() => t.shown && d.value, (_) => {
      b(), _ && (h(), t.mark.ended_at || (m = setInterval(h, ap)));
    }, { immediate: !0 }), ke(() => t.mark.ended_at, (_) => _ && t.shown && d.value && (b(), h())), Ee(b), (_, j) => (i(), u("div", {
      class: J(["mark-more", { open: e.shown }]),
      onClick: j[1] || (j[1] = be(() => {
      }, ["stop"]))
    }, [
      p("div", Q1, [
        e.declaration.body_url ? (i(), K(X1, {
          key: 0,
          declaration: e.declaration,
          row: e.mark,
          head: e.head
        }, null, 8, ["declaration", "row", "head"])) : (i(), u(Y, { key: 1 }, [
          a.value ? (i(), u(Y, { key: 0 }, [
            j[2] || (j[2] = p("p", { class: "mark-label" }, "Why it stopped", -1)),
            p("p", ep, v(a.value), 1)
          ], 64)) : $("", !0),
          d.value && c.value ? (i(), u("p", tp, v(c.value), 1)) : d.value && r.value ? (i(), u(Y, { key: 2 }, [
            j[3] || (j[3] = p("p", { class: "mark-label" }, "Output", -1)),
            F(m1, {
              class: "mark-terminal",
              lines: l.value
            }, null, 8, ["lines"])
          ], 64)) : s.value.length ? (i(), u("p", np, v(s.value.join(`
`)), 1)) : $("", !0),
          o.value ? (i(), u("button", {
            key: 4,
            type: "button",
            class: "mark-proofs",
            "data-mark-task": "",
            onClick: j[0] || (j[0] = be((D) => U(He)(`${ra}:${o.value}`), ["stop"]))
          }, "Open task " + v(o.value) + " and its proofs", 1)) : $("", !0)
        ], 64))
      ])
    ], 2));
  }
}, ls = /* @__PURE__ */ G(op, [["__scopeId", "data-v-51f69bf1"]]), rp = (e) => `show-${e}`, Ky = (e, t, n) => e.filter((s) => {
  var a;
  return n(rp((a = t(s.type)) == null ? void 0 : a.family)) !== !1;
}), lp = "messages.chat", ip = (e, t) => e.runs.replaceAll("{row_id}", String(t.target_id ?? "")), ko = (e, t, n) => At(lp, ip(e, t), n), cp = (e, t) => t ? e.filter((n) => t.includes(n.runs.split(" ").slice(0, 2).join(" "))) : e, up = ["title", "aria-label", "onClick"], dp = {
  key: 0,
  class: "mark-refusal",
  role: "alert"
}, hp = {
  __name: "MarkButtons",
  props: { buttons: { type: Array, default: () => [] }, mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null } },
  setup(e) {
    const t = e, n = T(() => cp(t.buttons, t.allowedRuns).filter((l) => {
      var r;
      return !((r = l.variants) != null && r.length) || l.variants.includes(t.mark.variant);
    })), s = B(""), a = _e(Ce);
    async function o(l) {
      const r = await ko(l, t.mark, a.environment);
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
      ], 8, up))), 128)),
      s.value ? (i(), u("span", dp, v(s.value), 1)) : $("", !0)
    ], 64));
  }
}, fp = /* @__PURE__ */ G(hp, [["__scopeId", "data-v-0dfda102"]]);
function bo(e, t) {
  const n = fn(/* @__PURE__ */ new Map()), s = (o) => n.value = new Map(o.map((l) => [l.type, l])), a = async () => {
    try {
      return (await (await De.raw(e)).json())[t] || [];
    } catch {
      return [];
    }
  };
  return { load: s, read: a, fetchAll: async () => s(await a()), find: (o) => n.value.get(o) || null };
}
const $o = bo("/api/marks", "marks"), Gy = $o.fetchAll, pp = $o.find, mp = 2e3;
function xo(e, t, n = mp) {
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
const gp = ["data-ref"], vp = ["data-ref"], yp = { class: "mark-row" }, wp = "dock add", kp = {
  __name: "MarkHost",
  props: { mark: { type: Object, required: !0 }, allowedRuns: { type: Array, default: null }, docked: Boolean },
  setup(e) {
    const t = /* @__PURE__ */ new Set(["output", "process"]), n = /* @__PURE__ */ new Set(["user"]), s = e, a = T(() => pp(s.mark.type)), o = _e(Ce, null), l = T(() => !!(o && s.mark.target_model === "process" && s.mark.target_id && !s.mark.ended_at)), r = B(null);
    xo(async () => {
      if (!l.value) return;
      const b = await o.read(["output", "list", "--process", String(s.mark.target_id)]);
      b.ok && b.value.rows.length && (r.value = b.value.rows[0].progress);
    }, () => l.value);
    const c = T(() => {
      const b = r1(s.mark, a.value), _ = !b.figure || b.figure.endsWith("%");
      return r.value && l.value && _ ? { ...b, figure: `${r.value}%`, fraction: r.value / 100 } : b;
    }), d = T(() => {
      var b;
      return !!(s.mark.lines || s.mark.detail && vo.has(s.mark.variant) || t.has(s.mark.target_model) || (b = a.value) != null && b.body_url);
    }), h = B(!1), m = T(() => {
      var b, _, j;
      return s.docked ? (_ = (b = a.value) == null ? void 0 : b.buttons) == null ? void 0 : _.filter((D) => {
        var k;
        return !((k = D.runs) != null && k.startsWith(wp));
      }) : (j = a.value) == null ? void 0 : j.buttons;
    });
    return (b, _) => {
      var j, D;
      return (j = a.value) != null && j.card ? (i(), u("div", {
        key: 0,
        class: J(["thread-turn", "card", "whole-card", { "user-side": U(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        F(ls, {
          declaration: a.value,
          mark: e.mark,
          shown: ""
        }, null, 8, ["declaration", "mark"])
      ], 10, gp)) : (i(), u("div", {
        key: 1,
        class: J(["thread-turn", "card", { "full-width": (D = a.value) == null ? void 0 : D.full_width, docked: e.docked, "user-side": U(n).has(e.mark.variant) }]),
        "data-ref": `chat_mark:${e.mark.id}`
      }, [
        p("span", yp, [
          F(mo, Qe({
            mark: c.value,
            open: d.value ? h.value : void 0
          }, or(c.value.handlers), {
            onClick: _[0] || (_[0] = (k) => h.value = !h.value)
          }), rr({ _: 2 }, [
            d.value ? {
              name: "default",
              fn: z(({ shown: k }) => [
                F(ls, {
                  declaration: a.value || {},
                  mark: e.mark,
                  shown: k
                }, null, 8, ["declaration", "mark", "shown"])
              ]),
              key: "0"
            } : void 0
          ]), 1040, ["mark", "open"]),
          F(fp, {
            buttons: m.value,
            mark: e.mark,
            "allowed-runs": e.allowedRuns
          }, null, 8, ["buttons", "mark", "allowed-runs"])
        ])
      ], 10, vp));
    };
  }
}, bp = /* @__PURE__ */ G(kp, [["__scopeId", "data-v-b3334caa"]]), $p = ["data-ref"], xp = ["inert"], Mp = { class: "thread-group" }, _p = {
  __name: "MarkGroup",
  props: { group: { type: Object, required: !0 } },
  setup(e) {
    const t = e, n = B(!1), s = B(!1);
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
      F(mo, {
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
        p("div", Mp, [
          (i(!0), u(Y, null, ae(e.group.marks, (r) => (i(), K(bp, {
            key: r.id,
            mark: r
          }, null, 8, ["mark"]))), 128))
        ])
      ], 10, xp)) : $("", !0)
    ], 8, $p));
  }
}, Yy = /* @__PURE__ */ G(_p, [["__scopeId", "data-v-8a285510"]]);
function Sp(e) {
  const t = B(null), n = new ResizeObserver(() => t.value = e.value.offsetHeight);
  return Le(() => n.observe(e.value)), wt(() => n.disconnect()), t;
}
const Ep = { class: "chat-dock-fold" }, Cp = ["aria-label"], Ap = { class: "chat-dock-head" }, Op = { class: "chat-dock-inner" }, Mo = 700, Tp = {
  __name: "ChatDock",
  props: { label: { type: String, default: "" }, folded: Boolean, lifted: Boolean, kind: { type: String, default: "" } },
  setup(e, { expose: t }) {
    const n = B(null), s = B(null), a = Sp(s), o = B(!1);
    let l = 0;
    return Le(() => l = setTimeout(() => o.value = !0, Mo)), wt(() => clearTimeout(l)), t({ card: n }), (r, c) => (i(), u("div", {
      class: J(["chat-dock", { lifted: e.lifted }])
    }, [
      p("div", Ep, [
        p("section", {
          ref_key: "card",
          ref: n,
          class: J(["chat-dock-card", e.kind]),
          "aria-label": e.label
        }, [
          pe(r.$slots, "edge"),
          p("header", Ap, [
            pe(r.$slots, "head")
          ]),
          p("div", {
            class: J(["chat-dock-body", { folded: e.folded, settled: o.value }])
          }, [
            p("div", Op, [
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
        ], 10, Cp)
      ])
    ], 2));
  }
}, _o = /* @__PURE__ */ G(Tp, [["__scopeId", "data-v-63e4dcfc"]]), Rp = {
  class: "dock-leave",
  "aria-hidden": "true"
}, In = 5, Ip = {
  __name: "DockLeave",
  props: { endsAt: { type: Number, required: !0 } },
  setup(e) {
    const n = Math.min(In, Math.max(0, e.endsAt - Date.now() / 1e3)), s = { animationDuration: `${In}s`, animationDelay: `${(n - In).toFixed(2)}s` };
    return (a, o) => (i(), u("span", Rp, [
      p("i", { style: s })
    ]));
  }
}, So = /* @__PURE__ */ G(Ip, [["__scopeId", "data-v-d0c4b012"]]), Eo = bo("/api/docks", "docks"), Jy = Eo.fetchAll, is = Eo.find, Bp = (e, t) => e.title || ((t == null ? void 0 : t.title) || "").replace("{row_id}", String(e.target_id)).replace("{row_title}", e.row_title || ""), cs = (e, t, n, s) => ({ action: e, icon: t, label: n, runs: s }), Lp = (e, t) => !!(e.leaves_at || e.kept || (t == null ? void 0 : t.leaves_after_seconds) > 0), Dp = (e) => e.kept ? cs("unkeep", "pin", "Unpin", `dock unkeep ${e.id}`) : cs("keep", "pin", "Pin", `dock keep ${e.id}`), Np = ["pin", "stop"], jp = (e) => ({ ...e, iconOnly: Np.includes(e.icon) });
function Pp(e, t) {
  var n;
  return [
    ...Lp(e, t) ? [Dp(e)] : [],
    ...((t == null ? void 0 : t.buttons) || []).map((s) => ({ ...s, action: "declared" })),
    ...!(t != null && t.draws_head) && ((n = t == null ? void 0 : t.reads) != null && n.length || Pt(e.target_model)) ? [{ action: "open", icon: "open", label: "Open", runs: "" }] : [],
    cs("undock", "close", "Undock", `dock remove ${e.id}`)
  ].map(jp);
}
const qp = (e, t) => ({
  icon: (t == null ? void 0 : t.icon) || "",
  title: Bp(e, t),
  buttons: Pp(e, t)
}), Wp = { class: "dock-title" }, Fp = ["aria-expanded", "title"], Hp = { class: "chat-dock-acts dock-acts" }, Up = {
  key: 0,
  class: "dock-text dock-failure",
  role: "alert",
  "data-dock-failure": ""
}, zp = {
  key: 1,
  class: "dock-text"
}, Vp = {
  __name: "DockWrapper",
  props: { item: { type: Object, required: !0 }, folded: Boolean, leaving: Boolean },
  emits: ["fold"],
  setup(e, { emit: t }) {
    const n = t, s = e, a = T(() => is(s.item.type)), o = B(null), l = T(() => qp(s.item, a.value)), r = _e(Ce), c = B(/* @__PURE__ */ new Set()), d = B("");
    async function h(_) {
      if (_.action === "open") return He(`${s.item.target_model}:${s.item.target_id}`);
      _.action === "declared" && (c.value = /* @__PURE__ */ new Set([...c.value, _.label])), d.value = "";
      const D = await ko(_, s.item, r.environment);
      (D == null ? void 0 : D.ok) === !1 && (c.value = new Set([...c.value].filter((k) => k !== _.label)), d.value = D.error);
    }
    const m = T(() => l.value.buttons.filter((_) => _.action !== "undock" && !c.value.has(_.label))), b = T(() => l.value.buttons.find((_) => _.action === "undock"));
    return (_, j) => (i(), K(_o, {
      label: l.value.title,
      folded: e.folded
    }, {
      edge: z(() => [
        e.leaving ? (i(), K(So, {
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
            p("span", Wp, v(l.value.title), 1)
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
            onClick: j[0] || (j[0] = (E) => n("fold"))
          }, [
            F(Lt, {
              open: !e.folded
            }, null, 8, ["open"])
          ], 8, Fp)),
          p("span", Hp, [
            (i(!0), u(Y, null, ae(m.value, (E) => (i(), u(Y, {
              key: E.action + E.runs
            }, [
              E.iconOnly ? (i(), K(we, {
                key: 0,
                kind: "icon",
                "aria-label": E.label,
                title: E.label,
                "data-dock-action": E.action,
                onClick: (V) => h(E)
              }, {
                default: z(() => [
                  F(ve, {
                    name: E.icon,
                    size: 13
                  }, null, 8, ["name"])
                ]),
                _: 2
              }, 1032, ["aria-label", "title", "data-dock-action", "onClick"])) : (i(), K(we, {
                key: 1,
                small: "",
                kind: E.primary ? "primary" : "ghost",
                bordered: !E.primary,
                "data-dock-action": E.action,
                onClick: (V) => h(E)
              }, {
                default: z(() => [
                  ce(v(E.label), 1)
                ]),
                _: 2
              }, 1032, ["kind", "bordered", "data-dock-action", "onClick"]))
            ], 64))), 128))
          ]),
          F(yn, {
            title: b.value.label,
            "data-dock-action": "undock",
            onClick: j[1] || (j[1] = (E) => h(b.value))
          }, null, 8, ["title"])
        ];
      }),
      default: z(() => {
        var D, k;
        return [
          d.value ? (i(), u("p", Up, v(d.value), 1)) : $("", !0),
          e.item.text && !((D = a.value) != null && D.body_url) ? (i(), u("p", zp, v(e.item.text), 1)) : $("", !0),
          (k = a.value) != null && k.body_url ? (i(), K(ls, {
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
}, la = /* @__PURE__ */ G(Vp, [["__scopeId", "data-v-53b368f0"]]), Kp = 6, Gp = 3, ia = (e, t) => {
  var n;
  return (((n = t(e.type)) == null ? void 0 : n.leaves_after_seconds) || 0) > 0;
}, rt = (e) => !!(e.leaves_at && !e.kept), Yp = (e, t, n = /* @__PURE__ */ new Set()) => e.state === "docked" && (!rt(e) || t < e.leaves_at || n.has(e.id)), Jp = (e, t, n = /* @__PURE__ */ new Set()) => e.filter((s) => Yp(s, t, n)).sort((s, a) => s.id - a.id);
function Zp(e, t, n = Kp) {
  const s = e.length - n;
  if (s <= 0) return e;
  const a = new Set(e.filter((o) => o.leaves_at && !o.kept && !(o.leaves_at > t)).slice(0, s).map((o) => o.id));
  return e.filter((o) => !a.has(o.id));
}
const Xp = (e, t, n = e) => n < 2 ? !1 : e >= Gp ? !0 : t, Qp = ["title", "aria-label"], em = { class: "run-chip-in" }, tm = {
  key: 0,
  class: "run-chip-ring"
}, nm = { class: "run-chip-name" }, sm = { class: "run-chip-bar" }, am = "processes.output", om = 5e3, rm = {
  __name: "RunChip",
  props: { item: { type: Object, required: !0 } },
  setup(e) {
    var h;
    const t = { running: "var(--tone-work)", finished: "var(--tone-good)", failed: "var(--tone-bad)" }, n = { finished: "tick", failed: "cross", stopped: "stop", orphaned: "stop" }, s = e, a = ((h = _e(Ce, null)) == null ? void 0 : h.environment) ?? "", o = B(null), l = T(() => !o.value || o.value.state === "running" || o.value.state === "background"), r = T(() => {
      var m, b;
      return ((m = o.value) == null ? void 0 : m.title) || ((b = o.value) == null ? void 0 : b.line) || s.item.title || `Run ${s.item.target_id}`;
    }), c = T(() => l.value ? t.running : t[o.value.state] ?? "var(--text-3)");
    async function d() {
      const m = await At(am, ["process", "card", String(s.item.target_id)], a);
      m.ok && (o.value = m.value);
    }
    return xo(d, () => l.value, om), (m, b) => {
      var _;
      return i(), u("button", {
        type: "button",
        class: "run-chip",
        "data-run-chip": "",
        title: r.value,
        "aria-label": `${r.value}; show its card`,
        style: $e({ "--tone": c.value })
      }, [
        U(rt)(e.item) ? (i(), K(So, {
          key: 0,
          "ends-at": e.item.leaves_at
        }, null, 8, ["ends-at"])) : $("", !0),
        p("span", em, [
          l.value ? (i(), u("span", tm)) : (i(), K(ze, {
            key: 1,
            name: n[o.value.state] ?? "stop"
          }, null, 8, ["name"])),
          p("span", nm, v(r.value), 1)
        ]),
        p("span", sm, [
          p("i", {
            style: $e({ width: l.value ? `${((_ = o.value) == null ? void 0 : _.progress) ?? 0}%` : "100%", background: c.value })
          }, null, 4)
        ])
      ], 12, Qp);
    };
  }
}, lm = /* @__PURE__ */ G(rm, [["__scopeId", "data-v-597b05d2"]]), im = 24, cm = 8, Zy = 420;
function Xy({ top: e, before: t, height: n, shown: s }) {
  const a = n - e - s;
  return a <= im && e > t ? !0 : e < t && a > cm ? !1 : null;
}
const um = (e, t) => e === void 0 ? t : e, dm = {
  key: "runs-head",
  class: "dock-runs-head"
}, hm = { class: "dock-runs-chips" }, fm = {
  __name: "DockStack",
  props: { items: { type: Array, required: !0 }, folded: Boolean },
  setup(e) {
    const t = e, n = Nf(500), s = B(/* @__PURE__ */ new Set()), a = B(!1), o = B(!1), l = T(() => Jp(t.items, n.value, s.value)), r = T(() => Zp(l.value.filter((E) => ia(E, is)), n.value)), c = T(() => l.value.filter((E) => !r.value.includes(E) && !ia(E, is))), d = T(() => r.value.filter((E) => !rt(E))), h = T(() => (a.value = Xp(r.value.length, a.value, d.value.length)) && !o.value), m = B({}), b = (E) => um(m.value[E.id], t.folded);
    function _(E) {
      m.value = { ...m.value, [E.id]: !b(E) };
    }
    function j(E) {
      m.value = { ...m.value, ...Object.fromEntries(r.value.map((V) => [V.id, V.id !== E.id])) }, o.value = !0;
    }
    function D() {
      m.value = Object.fromEntries(Object.entries(m.value).filter(([E]) => !r.value.some((V) => String(V.id) === E))), o.value = !1;
    }
    function k(E) {
      s.value = /* @__PURE__ */ new Set([...s.value, E.id]);
    }
    function A(E) {
      s.value = new Set([...s.value].filter((V) => V !== E.id));
    }
    return (E, V) => (i(), K(ya, {
      tag: "div",
      name: "dock",
      duration: U(Mo),
      class: "dock-stack"
    }, {
      default: z(() => [
        (i(!0), u(Y, null, ae(c.value, (y) => (i(), K(la, {
          key: y.id,
          item: y,
          class: J({ timed: U(rt)(y) }),
          leaving: U(rt)(y) && !s.value.has(y.id),
          folded: b(y),
          onFold: (g) => _(y),
          onMouseenter: (g) => k(y),
          onMouseleave: (g) => A(y)
        }, null, 8, ["item", "class", "leaving", "folded", "onFold", "onMouseenter", "onMouseleave"]))), 128)),
        a.value && o.value ? (i(), u("div", dm, [
          p("button", {
            type: "button",
            class: "dock-runs-toggle",
            "aria-expanded": "true",
            title: "Fold the runs into one line",
            "data-dock-runs-fold": "",
            onClick: D
          }, [
            ce(v(r.value.length) + " runs ", 1),
            F(Lt, { open: "" })
          ])
        ])) : $("", !0),
        (i(!0), u(Y, null, ae(h.value ? [] : r.value, (y) => (i(), K(la, {
          key: y.id,
          item: y,
          class: J({ timed: U(rt)(y) }),
          leaving: U(rt)(y) && !s.value.has(y.id),
          folded: b(y),
          onFold: (g) => _(y),
          onMouseenter: (g) => k(y),
          onMouseleave: (g) => A(y)
        }, null, 8, ["item", "class", "leaving", "folded", "onFold", "onMouseenter", "onMouseleave"]))), 128)),
        h.value ? (i(), K(_o, {
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
              onClick: V[0] || (V[0] = (y) => o.value = !0)
            }, [
              F(ze, { name: "runs" }),
              ce(" " + v(r.value.length) + " runs ", 1),
              F(Lt)
            ]),
            p("span", hm, [
              (i(!0), u(Y, null, ae(r.value, (y) => (i(), K(lm, {
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
}, Qy = /* @__PURE__ */ G(fm, [["__scopeId", "data-v-7081ac82"]]), Ct = { gap: 8, shuffles: 3, frames: 48, fps: 20, lift: 0.12 }, en = (e) => Math.min(Math.max(e, 0), 1), pm = (e) => {
  const t = en(e);
  return t * t * (3 - 2 * t);
}, st = (e, t, n) => pm((e - t) / (n - t));
function ew(e) {
  const t = en(e), n = en((t - 0.12) / 0.76) * Ct.shuffles, s = Math.min(Math.floor(n), Ct.shuffles - 1), a = n - s, o = st(a, 0.26, 0.38) * (1 - st(a, 0.76, 0.96)), l = st(a, 0.38, 0.76), r = st(t, 0, 0.12) * (1 - st(t, 0.88, 1)), c = st(a, 0.2, 0.34) * (1 - st(a, 0.84, 1)), d = Math.sin(Math.PI * en((a - 0.45) / 0.55)) ** 2;
  return { moved: l, across: (s + l) / Ct.shuffles, lift: Ct.lift * o, ready: r, weight: c, follow: d, shuffle: s, phase: a };
}
const Co = 2400, mm = 0.05;
function tw({ y: e, speed: t }, n, s, a = 1 / 0) {
  const o = Math.min(s, mm), l = Math.min(t + Co * o, a), r = e + l * o;
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
}, us = (e, t, n) => Math.min(Math.max((e - t) / (n - t), 0), 1), gm = (e) => e * e * (3 - 2 * e), cn = (e, [t, n]) => gm(us(e, t, n)), vm = ["rummage_papers", "rummage_boot", "rummage_bone", "rummage_book"], Je = { speed: [8, 10], angle: [66, 80], spread: [-0.8, 0.8], spin: [400, 900], gravity: 14, floor: 0.2 }, Yt = ([e, t], n) => e + n() * (t - e);
function ym(e) {
  return vm.map(() => {
    const t = Yt(Je.speed, e), n = Yt(Je.angle, e) * Math.PI / 180, s = Yt(Je.spin, e) * (e() < 0.5 ? -1 : 1);
    return { velocity: [Yt(Je.spread, e), t * Math.cos(n), t * Math.sin(n)], spin: s };
  });
}
const wm = ym(() => 0.5).map((e, t) => ({ ...e, spin: Math.abs(e.spin) * (t % 2 ? -1 : 1) }));
function km(e, t) {
  const n = e.velocity[2];
  return (n + Math.sqrt(n * n + 2 * Je.gravity * (t[2] - Je.floor))) / Je.gravity;
}
function nw(e, t, n = wm) {
  const s = Xe.rummage, a = (t - s.throws[e]) * s.frames / s.fps, o = n[e], l = km(o, s.from), r = s.shrinks * s.frames / s.fps;
  if (a < 0 || a >= l + r) return null;
  const c = Math.min(a, l), d = s.from.map((h, m) => h + o.velocity[m] * c);
  return d[2] -= Je.gravity * c * c / 2, { at: d, turn: o.spin * c, landed: Math.max(0, a - l) / r };
}
function sw(e, t) {
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
const aw = () => Array.from({ length: Xe.pogo.count }, (e, t) => Xe.pogo.bounce * (t + 1) / Xe.pogo.count), ow = { stride: 0.5 };
function Ao(e, t) {
  const n = t * (e.intro + e.hold + e.outro), s = n >= e.intro && n < e.intro + e.hold;
  return { into: us(n, 0, e.intro), held: s ? (n - e.intro) / e.hold : null, out: us(n, e.intro + e.hold, e.intro + e.hold + e.outro) };
}
function rw(e) {
  const { into: t, out: n } = Ao(Xe.rope_swing, e);
  return 1 - cn(t, [0, 1]) * (1 - cn(n, [0, 1]));
}
function lw(e) {
  const t = Xe.rope_swing, { into: n, out: s } = Ao(t, e), a = (e * (t.intro + t.hold + t.outro) - t.intro) / t.hold;
  return cn(n, [0, 1]) * (1 - cn(s, [0, 1])) * Math.sin(2 * Math.PI * t.swings * a);
}
const bm = { after: 3 }, $m = 10, xm = { hop_up: 1200, disco: 7200, rope_swing: 900, backflip: 360, bug_shot: 1800, bug_smash: 1800, tickle_swat: 0 }, Mm = { hop_up: 20, disco: 12, rope_swing: 60, backflip: 3, bubble: 90 }, _m = { weight: 19 }, Sm = {
  build: { cooldown: 180 }
}, Em = { every: 120 }, Oo = {
  butler: { "🎩": "hat_tip", "🧐": "monocle", "🥂": "toast" },
  homie: { "🤙": "shaka", "😎": "shades", "🔥": "fire" },
  colleague: { "👍": "thumbs_up", "👀": "peer" },
  coach: { "🎉": "party_popper", "💪": "flex", "🏆": "trophy" },
  squire: { "⚔️": "sword", "🛡️": "shield_up", "🏰": "castle" }
}, To = { "🙏": "thanks", "😠": "tantrum", "😡": "tantrum" }, Cm = {
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
}, Ft = (e, t, n, s) => ({ name: e, kind: t, weight: n, when: s, lifetime: $m }), te = (e, t, n = {}) => Ft(e, "clip", t, n), Bn = (e, t, n = {}) => Ft(e, "look", t, n), ca = (e, t, n = {}) => Ft(e, "gaze", t, n), de = (e, t, n = {}, s = {}) => ({ ...Ft(e, "pick", t, n), ...s }), ge = (e) => Ft("nothing", "nothing", e, {}), Am = 120, Om = 300, Ln = (e, t) => ({ ...te(e, t), cooldown: Om }), Tm = 120, ne = (e, { cooldown: t = 0, ...n }, s) => s.map((a) => ({ ...n, ...a, when: { moment: e, ...a.when }, group: { name: e, cooldown: t } })), Rm = () => [te("joy", 2)], at = (e, t, n, s, a = {}) => ({ ...te(e, t, { free: !0, lasted: n, ...a.when }), cooldown: s }), ot = (e) => ({ ...e, cooldown: xm[e.name] }), Et = (e) => ({ ...e, shenanigan: !0, lasts: Mm[e.name] }), Cs = [
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
  ...ne("messaged", { cooldown: Tm }, [te("phone_call", 1)]),
  ...ne("task_finished", { cooldown: 90, toward: "card", onto: !0 }, [te("nod", 4), te("hand_rub", 4), ge(7)]),
  ...ne("question_asked", { cooldown: 60 }, [te("ask_sign", 9), te("look_up", 3), ge(8)]),
  // a report: the figure looks up at its bubble and reads along it, never the report scroll
  ...ne("reported", { cooldown: 90 }, [ca("read", 3), te("nod", 1), ge(4)]),
  // a message of the user's the agent has read: now and then, at most once in half a minute, the figure reads along its bubble too
  ...ne("read_message", { cooldown: 30 }, [ca("read", 3), ge(1)]),
  ...ne("fact_filed", { cooldown: 120 }, [te("file_card", 3), te("nod", 1), ge(6)]),
  ...ne("check_passed", { cooldown: 120, toward: "card", onto: !0 }, [te("nod", 2), ge(9)]),
  // a bar the figure was eager for has ended, as its card says: it celebrates, fumes, or loses its temper in its own voice's tantrum;
  // either holds, playing to its end whatever comes, as the eagerness before it does (figure.js eager)
  ...ne("bar_done", { holds: !0 }, Rm()),
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
  ...Object.entries(Cm).flatMap(([e, t]) => ne(`reacted:${e}`, {}, [Bn(t, 1)])),
  ...Object.entries(Oo).flatMap(([e, t]) => Object.entries(t).map(([n, s]) => ne(`agent_reacted:${n}`, {}, [te(s, 1, { voices: [e] })])[0])),
  ...Object.entries(To).flatMap(([e, t]) => ne(`agent_reacted:${e}`, {}, [te(t, 1)])),
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
  ...ne("held:search", { cooldown: Am }, [Ln("search", 3), { ...Ln("binoculars", 2), when: { home: !0 } }, { ...Ln("glass_bubble", 2), when: { bubble: !0 } }]),
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
  ...ne("unit", { cooldown: Sm.build.cooldown }, [de("unit", _m.weight), ge(1)]),
  // the bar of a run the figure waits on seated jumping ahead or passing its near end (runWait.js): it looks up at it
  ...ne("progress_jump", { cooldown: 6 }, [te("look_up", 1)]),
  // what takes the work away once it is committed, the UFO or the crane, one of them every time with no cooldown, and the side the crane
  // rolls in from
  ...ne("carrier", {}, [de("ufo", 3), de("crane", 1)]),
  ...ne("crane_from", {}, [de("left", 1), de("right", 1)]),
  // a perch on a bubble: a hang from its corner by a free hand while it has nothing to do, at most once every HANG.every, or a stand on
  // its corner
  ...ne("perch", {}, [{ ...de("hang", 1, { hands: !0, free: !0 }), cooldown: Em.every }, de("stand", 5)]),
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
], Im = (e, t) => Object.entries(e).every(([n, s]) => n === "voices" ? s.includes(t.voice) : n === "lasted" ? t.lasted >= s : t[n] === s), Ro = (e) => [[e.group.name, e.group.cooldown], [`${e.group.name}/${e.name}`, e.cooldown]].filter(([, t]) => t), Bm = (e) => Array.isArray(e) ? e[0] : e, Lm = (e, t) => Array.isArray(e) ? t() * (e[1] - e[0]) : 0;
function Dm(e) {
  var d;
  const t = e.has ?? (() => !0), n = (h) => e.now - (e.memory.get(h) ?? -1 / 0), s = (h) => !e.memory || Ro(h).every(([m, b]) => n(m) >= Bm(b)), a = (h) => !h.shenanigan || h.lasts <= (e.room ?? 0), o = Cs.filter((h) => Im(h.when, e) && (h.kind !== "clip" || t(h.name)) && s(h) && a(h)), r = (((d = e.tally) == null ? void 0 : d.plain) ?? 0) >= bm.after && o.some((h) => h.shenanigan) ? o.filter((h) => h.shenanigan) : o, c = r.filter((h) => {
    var m;
    return h.kind === "nothing" || h.name !== ((m = e.tally) == null ? void 0 : m.last);
  });
  return c.some((h) => h.kind !== "nothing") ? c : r;
}
function Nm(e, t) {
  const n = Dm(e);
  let s = t() * n.reduce((o, l) => o + l.weight, 0);
  const a = n.find((o) => (s -= o.weight) < 0) ?? n.at(-1) ?? null;
  return !a || a.kind === "nothing" ? null : (Io(e, a, t), e.tally && Object.assign(e.tally, { plain: a.shenanigan ? 0 : e.tally.plain + 1, last: a.name }), a);
}
function Io(e, t, n) {
  var s;
  for (const [a, o] of Ro(t)) (s = e.memory) == null || s.set(a, e.now + Lm(o, n));
}
function iw(e, t, n) {
  Io(e, Cs.find((s) => s.when.moment === e.moment && s.name === t), n);
}
const ua = {
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
}, cw = {
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
}, uw = 120, dw = (e) => ua[e] || ua.idle;
[.../* @__PURE__ */ new Set([...Object.values(Oo).flatMap((e) => Object.keys(e)), ...Object.keys(To)])];
const Re = { seconds: 5, lines: 3, line: 18, sweep: 2.8, returnSeconds: 1.2, inset: 14, turn: 135, ahead: 0.25 };
function hw(e, t, n) {
  const s = (e.left + e.right) / 2 - t;
  return Math.abs(s) < Re.ahead * n ? 180 : Math.sign(s) * Re.turn;
}
const da = (e) => {
  const t = Math.min(Math.max(e, 0), 1);
  return t * t * t * (10 + t * (-15 + 6 * t));
};
function fw(e, t) {
  const n = Math.min(Re.inset, Math.max(e.right - e.left, 0) / 2), s = Math.min(Re.inset, Math.max(e.bottom - e.top, 0) / 2), a = Math.max(1, Math.min(Re.lines, Math.floor((e.bottom - e.top - 2 * s) / Re.line) + 1)), o = Math.max(t, 0), l = Math.floor(o / Re.sweep) % a, r = o % Re.sweep, c = Re.sweep - Re.returnSeconds, d = da((r - c) / Re.returnSeconds), h = r <= c ? da(r / c) : 1 - d, m = l + ((l + 1) % a - l) * d;
  return { x: e.left + n + Math.max(e.right - e.left - 2 * n, 0) * h, y: e.top + s + m * Re.line, readingCenter: (e.left + e.right) / 2, mood: "reading", behind: !0 };
}
const jm = 1, Pm = (e, t, n, s, a, o = 0) => Nm({ moment: "jump", high: e > jm * t, memory: s, now: a, room: o }, n).name === "backflip", ha = { colours: { bad: [1, 0.06, 0.1], good: [0.08, 1, 0.32] }, core: 0.45 }, pw = (e) => {
  var t;
  return Math.max(e.glow, 1 - e.eyes, ((t = e.sign) == null ? void 0 : t.strength) ?? 0);
}, mw = { width: 24, height: 27, top: 3, units: 2 }, qm = "[data-figure-pile]", gw = { amber: [1, 0.69, 0.125], good: ha.colours.good, bad: ha.colours.bad }, Dn = { phases: 4, dim: 0.25 }, vw = (e, t, n) => e !== "amber" || (t + n) % Dn.phases < Dn.phases / 2 ? 1 : Dn.dim, Wm = /* @__PURE__ */ new Set(["standing", "building", "typing", "work_done"]);
new Set(Cs.filter((e) => Wm.has(e.when.moment) && e.kind === "clip").map((e) => e.name));
const yw = {
  width: 84,
  belly: 13,
  blink: 4
}, fa = "[data-figure-home]", Ht = () => {
  var t;
  const e = document.querySelector(fa);
  return !e || ((t = e.checkVisibility) == null ? void 0 : t.call(e)) !== !1 ? e : [...document.querySelectorAll(fa)].find((n) => {
    var s;
    return (s = n.checkVisibility) == null ? void 0 : s.call(n);
  }) ?? e;
}, Fm = "[data-figure-docked-bars]", Hm = "[data-figure-chat-foot]", Um = "button, a[href], input, select, textarea, [role=tab], [role=button], [tabindex]:not([tabindex='-1'])", zm = "[data-figure-newest]";
function Vm() {
  var s, a;
  const e = (s = Ht()) == null ? void 0 : s.closest("[data-figure-world]");
  if (!e) return null;
  const t = e.querySelector(zm), n = t ? [t] : [...((a = e.querySelectorAll) == null ? void 0 : a.call(e, "button, [role=button]")) ?? []].filter(
    (o) => {
      var l, r;
      return !((l = o.closest) != null && l.call(o, "[data-figure-bubble]")) && /\bnewest\b/i.test(((r = o.getAttribute) == null ? void 0 : r.call(o, "aria-label")) || o.textContent || "");
    }
  );
  for (const o of n) {
    if (o.hidden || !As(o)) continue;
    const l = o.getBoundingClientRect();
    if (l.right > l.left && l.bottom > l.top) return l;
  }
  return null;
}
function Bo(e, t, n = Vm()) {
  if (!e || !n) return !0;
  const s = bt(e, t), a = Os(e), o = { left: s.left + Math.min(a.left, 0.27) * t.size, right: s.left + Math.max(a.right, 0.73) * t.size, top: s.top + Ze.top * t.size, bottom: s.top + Ze.bottom * t.size }, l = Ct.gap;
  return !No(o, { left: n.left - l, right: n.right + l, top: n.top - l, bottom: n.bottom + l });
}
const Nn = 0.26, Km = 0.54, bn = {
  stand: { drop: 0, travels: "stand" },
  sit: { drop: Nn, travels: "stand" },
  lounge: { drop: Nn, travels: "stand" },
  composed: { drop: Nn, travels: "stand" },
  hang: { drop: Km, travels: "hang" },
  walk: { drop: 0, travels: "stand" }
}, Lo = /* @__PURE__ */ new Set(["sit", "lounge", "composed"]), Gm = /* @__PURE__ */ new Set(["bubble", "dock", "compose"]), ww = (e, t) => (e === "sit" ? Gm.has(t) : Lo.has(e)) ? e : "stand", kw = 0.25, bw = (e, t) => Lo.has(e) && bn[t].drop === 0, Do = 2, Ym = 90, Jm = 180, Zm = 140, Xm = 280, Qm = 420, eg = 0.25, tg = 290, ng = 600, sg = "cubic-bezier(0.2, 0.7, 0.4, 1)", ag = "cubic-bezier(0.55, 0, 0.9, 0.6)", jn = 5;
function un(e, t, n, { straight: s = !1, hangs: a = !1, pace: o = 1, pressing: l = !1, sprinting: r = !1, random: c = Math.random, memory: d = null, now: h = 0, room: m = 0, pogo: b = !1 } = {}) {
  if (Math.hypot(t.x - e.x, t.y - e.y) < jn) return null;
  (l || r) && (o = Math.max(o, Do));
  const _ = o > 1, j = Math.abs(t.x - e.x), D = j < jn ? 0 : j / (Ym * o) * 1e3, k = Math.min(D, _ ? Zm : Jm), A = Math.abs(t.y - e.y), E = t.y < e.y, V = E && !b && Pm(A, n, c, d, h, m), y = E ? Qm + Math.min(A, 400) * eg : Math.sqrt(2 * A / Co) * 1e3, g = {
    x: t.x,
    y: t.y,
    ms: A > jn ? V ? ng : y : 0,
    lead: V ? tg : E ? Xm : 0,
    easing: E ? sg : ag,
    hopping: !0,
    clip: V ? "backflip" : E ? "jump" : "fall"
  }, R = { x: t.x, y: t.y, ms: D + k, lead: 0, easing: "linear", ramp: k, ..._ ? { clip: "run" } : {} }, S = b ? og(t, n) : g, P = E && !s ? [{ ...R, y: e.y }, S] : [{ ...g, x: e.x }, R];
  return { way: Math.sign(t.x - e.x) || 1, legs: P, lands: !a, pace: o, running: _ };
}
const og = (e, t) => ({ x: e.x, y: e.y, ms: Xe.pogo.frames / Xe.pogo.fps * 1e3, lead: 0, easing: "linear", hopping: !0, pogo: !0, size: t, clip: "pogo" }), bt = (e, { size: t, below: n }, s = e.posture) => {
  const a = e.y - (1 - n - bn[s].drop) * t;
  return { left: e.x - t / 2, right: e.x + t / 2, top: a, bottom: a + t };
}, No = (e, t) => e.left < t.right && t.left < e.right && e.top < t.bottom && t.top < e.bottom, As = (e) => {
  var t;
  return ((t = e.checkVisibility) == null ? void 0 : t.call(e, { opacityProperty: !0, visibilityProperty: !0 })) ?? !0;
};
function $t() {
  var t;
  const e = (t = Ht()) == null ? void 0 : t.closest("[data-figure-world]");
  return e ? e.getBoundingClientRect() : { left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight };
}
const Jt = 0.5, pa = 20;
function $w(e, t, n = $t()) {
  const s = bt(e, t);
  return s.left >= n.left + pa && s.right <= n.right - pa;
}
function jo(e, t, n = $t()) {
  const s = bt(e, t), a = s.right - s.left, o = Os(e), [l, r] = [s.left + o.left * a, s.left + o.right * a], c = e.posture === "hang" ? s.bottom : e.y;
  return l >= n.left - Jt && r <= n.right + Jt && s.top >= n.top - Jt && c <= n.bottom + Jt;
}
const dn = [0.35, 0.5, 0.65], hn = [0.15, 0.3, 0.45, 0.6, 0.75, 0.9], Ze = { left: dn[0], right: dn.at(-1), top: hn[0], bottom: hn.at(-1) }, rg = 0.24;
function Os(e) {
  if (e.posture === "stand") return { left: Ze.left, right: Ze.right };
  if (e.posture !== "sit") return { left: 0, right: 1 };
  const t = 0.5 + rg * Math.sin((e.face ?? 0) * Math.PI / 180);
  return { left: Math.min(Ze.left, t), right: Math.max(Ze.right, t) };
}
function lg(e, { size: t }, n = $t()) {
  const s = Os(e);
  return { ...e, x: Math.min(Math.max(e.x, n.left + (0.5 - s.left) * t), n.right - (s.right - 0.5) * t) };
}
const ig = (Ze.right - Ze.left) / 2 + 0.08;
function cg(e, t, n = "", s = "") {
  var r;
  const a = (r = document.caretRangeFromPoint) == null ? void 0 : r.call(document, e, t);
  if (!a || a.startContainer.nodeType !== Node.TEXT_NODE || !As(a.startContainer.parentElement) || n && a.startContainer.parentElement.closest(n) || s && !a.startContainer.parentElement.closest(s)) return !1;
  const o = a.startContainer, l = Math.min(a.startOffset, o.length - 1);
  for (const c of [l - 1, l].filter((d) => d >= 0)) {
    if (!o.data[c].trim()) continue;
    const d = document.createRange();
    if (d.setStart(o, c), d.setEnd(o, c + 1), [...d.getClientRects()].some((h) => e >= h.left && e <= h.right && t >= h.top && t <= h.bottom)) return !0;
  }
  return !1;
}
const ug = (e) => hn.flatMap(
  (t) => dn.map((n) => [e.left + n * (e.right - e.left), e.top + t * (e.bottom - e.top)])
);
function dg(e, t, n = "") {
  if (!Bo(e, t)) return dn.length * hn.length;
  const s = bt(e, t), a = e.posture === "hang" ? s : { ...s, bottom: Math.min(s.bottom, e.y) }, o = [...document.querySelectorAll(Um)].map((r) => ({ control: r, rect: r.getBoundingClientRect() })).filter(({ control: r, rect: c }) => c.width && c.height && No(a, c) && As(r)).map(({ rect: r }) => r), l = (r, c) => o.some((d) => r >= d.left && r <= d.right && c >= d.top && c <= d.bottom);
  return ug(a).filter(([r, c]) => l(r, c) || cg(r, c, n)).length;
}
function hg(e, t, n) {
  const s = $t(), a = (l) => n ? Math.hypot(l.x - n.x, l.y - n.y) : 0, o = e.filter((l) => jo(l, t, s) && Bo(l, t)).map((l) => ({ spot: l, covered: dg(l, t), away: a(l) }));
  return o.length ? o.reduce(
    (l, r) => r.covered < l.covered || r.covered === l.covered && r.away < l.away ? r : l
  ).spot : null;
}
const Po = {
  right: { along: 1, inboard: -1, face: 60 },
  left: { along: 0, inboard: 1, face: 300 }
}, fg = ig, pg = (e, t, { size: n }, s = fg) => mg(e, Po[t], s * n, "stand");
function mg(e, { along: t, inboard: n, face: s }, a, o) {
  return { x: e.left + e.width * t + n * a, y: e.top, face: s, posture: o };
}
const xw = (e) => ((e + 180) % 360 + 360) % 360 - 180, Mw = { turns: [-20, -10, 0, 10, 20] }, gg = 7;
function vg() {
  const e = [...document.querySelectorAll(qm)].map((t) => t.getBoundingClientRect()).filter((t) => t.width && t.height);
  return e.length ? { left: Math.min(...e.map((t) => t.left)), right: Math.max(...e.map((t) => t.right)), top: Math.min(...e.map((t) => t.top)), bottom: Math.max(...e.map((t) => t.bottom)) } : null;
}
const yg = 4;
function wg() {
  const e = qo(), t = vg(), { left: n, width: s, top: a } = e.edge;
  return !t || Math.abs(t.bottom - a) > yg || t.left > n + s || t.right < n ? e : { ...e, edge: { ...e.edge, width: Math.max(t.left - gg - n, 0) } };
}
const _w = ({ size: e, below: t }) => (1 - t) * e;
function kg(e, t) {
  const n = $t(), { size: s, below: a } = t, o = bn[e.posture].drop * s;
  return { ...lg(e, t, n), y: Math.min(Math.max(e.y, n.top + (1 - a) * s - o), n.bottom) };
}
const bg = (e, t) => Object.keys(Po).map((n) => kg(pg(e, n, t), t)), $g = (e, t, n) => hg(e, t, n) ?? e[0];
function Sw(e, t) {
  const { element: n, edge: s } = wg();
  return { ...$g(bg(s, e), e, t), view: null, on: n };
}
function qo() {
  var s;
  const e = Ht(), t = (s = e == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : s.querySelector(Fm);
  if (!t) return { ...Wo(), docked: !1 };
  const n = t.getBoundingClientRect();
  return { element: t, docked: !0, edge: { left: n.left, width: n.width, top: n.top } };
}
function Wo() {
  const e = Ht();
  if (!e) return { element: null, edge: { left: 0, width: window.innerWidth, top: window.innerHeight } };
  const t = e.getBoundingClientRect();
  return { element: e, edge: { left: t.left, width: t.width, top: t.top } };
}
const xg = { climb: 90 };
function Ew(e, t, n, { straight: s = !1, pace: a = 1, pressing: o = !1, sprinting: l = !1, random: r = Math.random, via: c = [], memory: d = null, now: h = 0, room: m = 0, pogo: b = !1 } = {}) {
  (o || l) && (a = Math.max(a, Do));
  const _ = (V) => {
    const y = bt(V, n, bn[V.posture].travels);
    return { x: y.left, y: y.top };
  }, j = t.ladder ?? e.ladder;
  if (j && !(t.ladder && e.ladder)) return Mg(_(e), _(t), _({ ...j.foot, posture: "stand" }), j.way, !!t.ladder, n, a);
  const [D, ...k] = [e, ...c, t].map(_), A = un(D, k[0], n.size, { straight: s, hangs: t.posture === "hang" || !!t.swings, pace: a, pressing: o, sprinting: l, random: r, memory: d, now: h, room: m, pogo: b }), E = k.slice(1).map((V, y) => {
    var g;
    return (g = un(k[y], V, n.size, { random: r, memory: d, now: h, room: m })) == null ? void 0 : g.legs.find((R) => R.hopping);
  });
  return A && { ...A, legs: [...A.legs, ...E.filter(Boolean)] };
}
function Mg(e, t, n, s, a, o, l) {
  const r = (h, m) => ({ x: m.x, y: m.y, ms: Math.hypot(m.x - h.x, m.y - h.y) / xg.climb * 1e3, lead: 0, easing: "linear", hopping: !0, clip: "ladder_climb", facing: s > 0 ? 90 : 270 }), c = a ? un(e, n, o.size, { pace: l }) : un(n, t, o.size, { pace: l }), d = a ? [...(c == null ? void 0 : c.legs) ?? [], r(n, t)] : [r(e, n), ...(c == null ? void 0 : c.legs) ?? []];
  return { way: Math.sign(t.x - e.x) || 1, legs: d, lands: !1, pace: l, running: l > 1 };
}
const _g = "[data-figure-bubble]", Sg = 250;
let Ot = Object.freeze({ at: 0, world: null, view: null, floors: Object.freeze([]) }), Fo = 0;
const Ho = () => Ot, Pn = /* @__PURE__ */ new WeakMap();
let Eg = 0;
function Uo(e) {
  return Pn.has(e) || Pn.set(e, `floor-${++Eg}`), Pn.get(e);
}
const Cg = (e, t) => e.top >= t.top && e.top <= t.bottom && e.right > t.left && e.left < t.right, Ag = () => {
  var e, t;
  return ((t = (e = Ht()) == null ? void 0 : e.closest("[data-figure-world]")) == null ? void 0 : t.querySelector("[data-figure-scroll]")) ?? null;
};
function Og(e, t) {
  var s;
  const n = (s = e.querySelector(Hm)) == null ? void 0 : s.getBoundingClientRect();
  return { left: t.left, right: t.right, top: t.top, bottom: n ? Math.min(t.bottom, n.top) : t.bottom };
}
function Tg(e, t) {
  const n = e && Og(e, t), s = e ? [...e.querySelectorAll(_g)].map((o) => ({ element: o, kind: "bubble" })) : [], a = [...document.querySelectorAll("[data-tab]")].map((o) => ({ element: o, kind: "tab" }));
  return [...s, ...a].map(({ element: o, kind: l }) => ({ element: o, kind: l, box: o.getBoundingClientRect() })).filter(({ kind: o, box: l }) => l.width > 0 && l.height > 0 && (o !== "bubble" || Cg(l, n))).map(({ element: o, kind: l, box: r }) => ({ id: Uo(o), kind: l, element: o, left: r.left, right: r.right, top: r.top, bottom: r.bottom }));
}
const Rg = (e, t, n) => {
  const s = e.floors.find((o) => o.id === t.id), a = n - e.at;
  return s && a > 0 && a <= Sg ? (t.top - s.top) / a * 1e3 : 0;
};
function Ig(e = Ot, t = performance.now()) {
  const n = $t(), s = Ag(), a = (s == null ? void 0 : s.getBoundingClientRect()) ?? null, { element: o, docked: l, edge: r } = qo(), c = [];
  o && c.push({ id: "home", kind: l ? "dock" : "compose", element: o, left: r.left, right: r.left + r.width, top: r.top });
  const d = Wo();
  return d.element && c.push({ id: Uo(d.element), kind: "build", element: d.element, left: d.edge.left, right: d.edge.left + d.edge.width, top: d.edge.top }), c.push(...Tg(s, a)), c.push({ id: "foot", kind: "foot", left: n.left, right: n.right, top: n.bottom }), Object.freeze({ at: t, world: n, view: a, floors: Object.freeze(c.map((h) => Object.freeze({ ...h, vy: Rg(e, h, t) }))) });
}
const ds = /* @__PURE__ */ new Set();
function Bg(e) {
  return ds.add(e), () => ds.delete(e);
}
function Lg() {
  zo();
  const e = () => {
    Fo = requestAnimationFrame(e), !document.hidden && (Ot = Ig(Ot), ds.forEach((t) => t(Ot)));
  };
  e();
}
function zo() {
  cancelAnimationFrame(Fo);
}
const Dg = (e, t) => e.find((n) => n.id === t) ?? null;
function Cw(e, t, n = Ho().floors) {
  const s = Dg(n, "home");
  return e.posture === "hang" && s && bt(e, t).bottom >= s.top ? !1 : jo(e, t);
}
const Ng = ["data-kind"], jg = { class: "figure-floor-name" }, Pg = {
  __name: "FigureFloorLine",
  props: { floor: { type: Object, required: !0 } },
  setup(e) {
    return (t, n) => (i(), u("div", {
      class: "figure-floor-line",
      "data-kind": e.floor.kind,
      style: $e({ left: `${e.floor.left}px`, top: `${e.floor.top}px`, width: `${e.floor.right - e.floor.left}px` })
    }, [
      p("span", jg, v(e.floor.kind), 1)
    ], 12, Ng));
  }
}, qg = /* @__PURE__ */ G(Pg, [["__scopeId", "data-v-8f6132da"]]), Wg = {
  class: "figure-floors",
  "aria-hidden": "true"
}, Fg = {
  __name: "FigureFloors",
  setup(e) {
    const t = fn(Ho().floors);
    let n = () => {
    };
    return Le(() => {
      n = Bg((s) => t.value = s.floors), Lg();
    }), Ee(() => {
      n(), zo();
    }), (s, a) => (i(), u("div", Wg, [
      (i(!0), u(Y, null, ae(t.value, (o) => (i(), K(qg, {
        key: o.id,
        floor: o
      }, null, 8, ["floor"]))), 128))
    ]));
  }
}, Aw = /* @__PURE__ */ G(Fg, [["__scopeId", "data-v-e519168b"]]), qn = (e) => typeof e == "number" ? e : Date.parse(e);
function Ow(e, t) {
  const n = (a, o) => ({ kind: a, id: `${a}:${o.id}`, row: o, time: qn(o.created_at) / 1e3 });
  return [...e.map((a) => n("message", a)), ...t.map((a) => n("mark", a))].sort((a, o) => qn(a.row.created_at) - qn(o.row.created_at) || (a.kind === o.kind ? a.row.id - o.row.id : a.kind === "message" ? -1 : 1));
}
const Hg = 3, Wn = {
  family: (e, t) => `family:${t.family}`,
  type: (e) => `type:${e.type}`,
  row: (e) => e.target_model ? `row:${e.target_model}:${e.target_id}` : ""
};
function Ug(e, t) {
  var s;
  if (e.kind !== "mark") return "";
  const n = t(e.row.type);
  return !n || n.process || n.card ? "" : ((s = Wn[n.grouping]) == null ? void 0 : s.call(Wn, e.row, n)) || "";
}
function zg(e, t) {
  const n = t(e[0].row.type), s = n.group_label.replace("{count}", e.length).replace("{family}", n.family_title);
  return { kind: "mark-group", id: `mark-group:${e[0].row.id}`, time: e[0].time, marks: e.map((a) => a.row), declaration: n, label: s };
}
function Tw(e, t) {
  const n = [];
  let s = [], a = "";
  const o = () => {
    n.push(...s.length >= Hg ? [zg(s, t)] : s), s = [];
  };
  for (const l of e) {
    const r = Ug(l, t);
    r !== a && o(), a = r, r ? s.push(l) : n.push(l);
  }
  return o(), n;
}
const Vg = 1e3;
function Rw() {
  const e = B(Date.now()), t = setInterval(() => e.value = Date.now(), Vg);
  return wt(() => clearInterval(t)), e;
}
const Iw = (e) => (t) => t.filter((n) => n.id !== e), Bw = (e, t) => (n) => n.map((s) => s.id === e ? { ...s, ...t } : s), Lw = (e) => (t) => [...t, e], Dw = (e, t) => (n) => n.map((s) => e(s) ? { ...s, ...t } : s);
function Nw(e) {
  const t = pn(), n = B(null), s = B("");
  async function a(...o) {
    const l = await t.read(e(...o));
    s.value = l.ok ? "" : l.error, l.ok && (n.value = l.value);
  }
  return { value: n, failure: s, load: a };
}
const Zt = /* @__PURE__ */ new Map();
function Kg(e, t) {
  if (Zt.has(e)) return Zt.get(e);
  const n = t().finally(() => Zt.delete(e));
  return Zt.set(e, n), n;
}
function jw() {
  const e = pn(), t = B(null), n = B("");
  async function s() {
    const a = await Kg(e.environment, () => e.read("usage show"));
    n.value = a.ok ? "" : a.error, a.ok && (t.value = a.value);
  }
  return { value: t, failure: n, load: s };
}
const Gg = {
  class: "cards-page",
  "data-window-flush": ""
}, Yg = { class: "cards-bar" }, Jg = { class: "cards-count" }, Zg = { class: "cards" }, Xg = {
  key: 1,
  class: "cards-note"
}, Qg = {
  key: 2,
  class: "cards-note"
}, e0 = ["data-row", "onClick"], t0 = { class: "card-head" }, n0 = { class: "card-age" }, s0 = { class: "card-title" }, a0 = { class: "card-foot" }, o0 = {
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
    return (s, a) => (i(), u("div", Gg, [
      p("div", Yg, [
        p("span", Jg, v(e.rows.length) + " " + v(e.rows.length === 1 ? e.noun : `${e.noun}s`), 1),
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
      p("div", Zg, [
        e.loaded ? e.failure ? (i(), u("p", Xg, v(e.failure), 1)) : e.rows.length ? $("", !0) : (i(), u("p", Qg, "No " + v(e.noun) + "s yet", 1)) : (i(), K(kt, {
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
          p("span", t0, [
            F(ve, {
              name: e.icon,
              class: "card-icon"
            }, null, 8, ["name"]),
            ce(" " + v(e.head(o)), 1),
            p("span", n0, v(U(as)(o.created_at)), 1)
          ]),
          p("span", s0, v(e.title(o)), 1),
          p("span", a0, v(e.foot(o)), 1)
        ], 8, e0))), 128))
      ]),
      pe(s.$slots, "default", {}, void 0, !0)
    ]));
  }
}, Pw = /* @__PURE__ */ G(o0, [["__scopeId", "data-v-d72d528d"]]), ma = "newest";
function qw(e, { title: t, isOpen: n = null }) {
  const s = B(""), a = B(ma), o = B("all"), l = T(() => {
    const c = s.value.trim().toLowerCase(), d = e.value.filter((h) => (!c || JSON.stringify(h).toLowerCase().includes(c)) && (o.value === "all" || !n || n(h) === (o.value === "open")));
    return a.value === ma ? d : [...d].sort((h, m) => t(h).localeCompare(t(m)));
  }), r = T(() => !!s.value.trim() || !!n && o.value !== "all");
  return { words: s, order: a, state: o, shown: l, filtering: r, hasStates: !!n };
}
const r0 = {
  class: "auto-scroll",
  "data-auto-scroll": ""
}, l0 = 40, i0 = "top", c0 = {
  __name: "AutoScrollPane",
  props: { rowCount: { type: Number, default: 0 }, paneClass: { type: String, default: "" } },
  setup(e, { expose: t }) {
    var m;
    const n = e, s = (m = _e(Ce, null)) == null ? void 0 : m.autoScroll, a = T(() => s === i0), o = B(null), l = B(!1), r = (b) => a.value ? b.scrollTop : b.scrollHeight - b.scrollTop - b.clientHeight, c = () => a.value ? 0 : o.value.scrollHeight, d = () => o.value.scrollTo({ top: c(), behavior: "smooth" });
    function h() {
      l.value = r(o.value) >= l0;
    }
    return ke(() => n.rowCount, async () => {
      await Nt(), !l.value && o.value && (o.value.scrollTop = c());
    }, { immediate: !0, flush: "post" }), t({ pane: o }), (b, _) => (i(), u("div", r0, [
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
            [lr, l.value]
          ])
        ]),
        _: 1
      })
    ]));
  }
}, Ww = /* @__PURE__ */ G(c0, [["__scopeId", "data-v-3accb764"]]), u0 = {
  class: "inner-tabs",
  "data-inner-tabs": ""
}, d0 = {
  __name: "InnerTabs",
  props: { active: { type: Object, default: null }, answer: { type: Object, default: () => ({}) } },
  emits: ["choose"],
  setup(e, { emit: t }) {
    var a;
    const n = t, s = ((a = _e(Ce, null)) == null ? void 0 : a.tabs) ?? [];
    return (o, l) => (i(), u("div", u0, [
      (i(!0), u(Y, null, ae(U(s), (r) => {
        var c;
        return i(), K(we, {
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
}, Fw = /* @__PURE__ */ G(d0, [["__scopeId", "data-v-cf3bb39f"]]), h0 = {}, f0 = { class: "menu-label" };
function p0(e, t) {
  return i(), u("span", f0, [
    pe(e.$slots, "default", {}, void 0, !0)
  ]);
}
const hs = /* @__PURE__ */ G(h0, [["render", p0], ["__scopeId", "data-v-aa955b3e"]]), m0 = {
  class: "search-bar",
  "data-search-bar": ""
}, g0 = { class: "search-bar-control" }, v0 = ["value", "placeholder", "aria-label"], y0 = ["aria-expanded"], w0 = {
  __name: "SearchBar",
  props: { modelValue: { type: String, default: "" }, placeholder: { type: String, default: "Search" } },
  emits: ["update:modelValue", "pick"],
  setup(e, { expose: t, emit: n }) {
    var A;
    const s = e, a = n, o = ir(), l = ((A = _e(Ce, null)) == null ? void 0 : A.search) ?? {}, r = T(() => l.placeholder || s.placeholder), c = l.context ?? [], d = B(null), h = B(null), m = B([]), b = T(() => m.value.length ? m.value[m.value.length - 1].next : c), _ = T(() => !!o.menu || c.length > 0), j = (E) => {
      m.value = [], h.value = h.value ? null : E.currentTarget;
    };
    function D(E) {
      if (E.next.length) {
        m.value = [...m.value, E];
        return;
      }
      h.value = null, a("pick", E.click);
    }
    function k() {
      var E;
      a("update:modelValue", ""), (E = d.value) == null || E.focus();
    }
    return t({ focus: () => {
      var E;
      return (E = d.value) == null ? void 0 : E.focus();
    } }), (E, V) => (i(), u("div", m0, [
      p("div", g0, [
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
          onInput: V[0] || (V[0] = (y) => a("update:modelValue", y.target.value)),
          onKeydown: Tt(k, ["esc"])
        }, null, 40, v0),
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
        ], 8, y0)) : $("", !0)
      ]),
      U(l).button ? (i(), u("button", {
        key: 0,
        type: "button",
        class: "search-bar-button",
        "data-search-button": "",
        onClick: V[1] || (V[1] = (y) => a("pick", U(l).button.click))
      }, v(U(l).button.title), 1)) : $("", !0),
      pe(E.$slots, "default", {}, void 0, !0),
      h.value ? (i(), K(Es, {
        key: 1,
        anchor: h.value,
        align: "end",
        "min-width": 220,
        "max-width": 320,
        onClick: V[3] || (V[3] = be(() => {
        }, ["stop"])),
        onClose: V[4] || (V[4] = (y) => h.value = null)
      }, {
        default: z(() => [
          m.value.length ? (i(), K(vt, {
            key: 0,
            "data-search-back": "",
            onClick: V[2] || (V[2] = (y) => m.value = m.value.slice(0, -1))
          }, {
            default: z(() => [
              ce("‹ " + v(m.value[m.value.length - 1].title), 1)
            ]),
            _: 1
          })) : $("", !0),
          (i(!0), u(Y, null, ae(b.value, (y) => (i(), K(vt, {
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
          m.value.length ? $("", !0) : pe(E.$slots, "menu", {}, void 0, !0, 1)
        ]),
        _: 3
      }, 8, ["anchor"])) : $("", !0)
    ]));
  }
}, k0 = /* @__PURE__ */ G(w0, [["__scopeId", "data-v-4c3315ae"]]), b0 = {
  class: "list-tools",
  "data-list-tools": ""
}, $0 = {
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
    return (o, l) => (i(), u("div", b0, [
      F(k0, {
        modelValue: e.tools.words.value,
        "onUpdate:modelValue": l[0] || (l[0] = (r) => e.tools.words.value = r),
        class: "list-tools-search",
        placeholder: e.placeholder,
        "data-list-search": "",
        onPick: l[1] || (l[1] = (r) => n("pick", r))
      }, {
        menu: z(() => [
          F(hs, null, {
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
            F(hs, null, {
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
}, Hw = /* @__PURE__ */ G($0, [["__scopeId", "data-v-24c1740c"]]);
function Uw() {
  const e = B(null);
  return { opened: e, toggle: (n) => {
    e.value = e.value === n.id ? null : n.id;
  } };
}
const x0 = 86400, fs = (e) => new Date(new Date(e * 1e3).toDateString()).getTime() / 1e3;
function M0(e, t) {
  const n = new Date(e * 1e3), s = n.getFullYear() === new Date(t * 1e3).getFullYear(), a = n.toLocaleDateString("en-GB", { day: "numeric", month: "long", ...s ? {} : { year: "numeric" } }), o = Math.round((fs(t) - fs(e)) / x0);
  return o === 0 ? `Today, ${a}` : o === 1 ? `Yesterday, ${a}` : `${n.toLocaleDateString("en-GB", { weekday: "long" })}, ${a}`;
}
function zw(e, t = Date.now() / 1e3) {
  const n = [];
  let s = 0;
  for (const a of e) {
    const o = fs(a.time);
    o !== s && (s = o, n.push({ id: `day:${o}`, key: `day:${o}`, kind: "day", who: "", time: a.time, title: M0(a.time, t), text: "", data: {} })), n.push(a);
  }
  return n;
}
const Fn = 280, Hn = 240, Un = 120, _0 = 6, S0 = 14, Dt = "cubic-bezier(0.2, 0.8, 0.2, 1)";
function E0(e) {
  var s;
  const t = getComputedStyle(e).transform, n = /matrix\(([^)]+)\)/.exec(t);
  return n ? Number(n[1].split(",")[5]) || 0 : Number((s = /translateY\((-?[\d.]+)px\)/.exec(t)) == null ? void 0 : s[1]) || 0;
}
function Vo(e, t) {
  const n = Math.max(0, E0(t)), s = e.scrollHeight;
  if (!n) return s - e.clientHeight;
  const a = t.getBoundingClientRect().bottom - e.getBoundingClientRect().top - e.clientTop + e.scrollTop, o = Number.parseFloat(getComputedStyle(e).paddingBottom) || 0;
  return (a >= s - 1 ? Math.min(s, a - n + o) : s) - e.clientHeight;
}
function C0(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  const l = e.offsetHeight;
  Object.assign(e.style, { boxSizing: "border-box", height: "0px", overflow: "hidden", opacity: "0", transform: `translateY(${S0}px)` }), e.offsetHeight, e.style.transition = `height ${Fn}ms ${Dt}`, e.style.height = `${l}px`;
  const r = a();
  let c = !1;
  const d = () => {
    n() && (t.scrollTop = Vo(t, e));
    const h = a() - r;
    if (!c && h >= Fn && (c = !0, e.style.transition = `opacity ${Hn}ms ease-out, transform ${Hn}ms ${Dt}`, e.style.opacity = "1", e.style.transform = "translateY(0)"), h < Fn + Hn) return s(d);
    Object.assign(e.style, { boxSizing: "", height: "", overflow: "", opacity: "", transform: "", transition: "" }), o();
  };
  s(d);
}
function Vw(e, { pane: t, follows: n, frame: s = requestAnimationFrame, clock: a = () => performance.now() }, o) {
  if (!t || !n()) return o();
  Object.assign(e.style, { opacity: "0", transform: `translateY(${_0}px)` }), e.offsetHeight, e.style.transition = `opacity ${Un}ms ease-out, transform ${Un}ms ${Dt}`, Object.assign(e.style, { opacity: "1", transform: "translateY(0)" });
  const l = a(), r = () => {
    if (n() && (t.scrollTop = Vo(t, e)), a() - l < Un) return s(r);
    Object.assign(e.style, { opacity: "", transform: "", transition: "" }), o();
  };
  s(r);
}
const A0 = 140, Xt = 220, O0 = 5;
function Kw({ gap: e = A0, later: t = setTimeout } = {}) {
  const n = [];
  let s = !1;
  const a = (r) => {
    r.done(), t(o, e);
  };
  function o() {
    const r = n.splice(0, O0);
    if (s = r.length > 0, !s) return;
    let c = r.length;
    for (const d of r)
      d.el.style.display = d.display, d.arrival(d.el, d.options, () => {
        d.done(), c -= 1, c || t(o, e);
      });
  }
  const l = (r, c, d, h = C0) => {
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
function Gw(e, t, n = setTimeout) {
  Object.assign(e.style, { boxSizing: "border-box", height: `${e.offsetHeight}px`, overflow: "hidden" }), e.offsetHeight, e.style.transition = `height ${Xt}ms ${Dt}, opacity ${Xt}ms ease-in, margin ${Xt}ms ${Dt}`, Object.assign(e.style, { height: "0px", opacity: "0", marginTop: "0px", marginBottom: "0px" }), n(t, Xt);
}
const Ko = "chat.pins.minimised", tn = B(Rt(Ko, !1));
function ga(e) {
  tn.value = e, mn(Ko, e);
}
function T0(e) {
  const t = T(() => e()), n = T(() => tn.value ? [] : e()), s = () => ga(!tn.value), a = Date.now() / 1e3;
  return ke(
    () => t.value.filter((o) => Pa(o) > a).length,
    (o, l) => o > l && ga(!1)
  ), { pins: t, visible: n, minimised: tn, toggle: s };
}
const R0 = ["title"], I0 = {
  key: 0,
  class: "pins-count"
}, B0 = {
  __name: "PinsToggle",
  props: { pinRows: { type: Array, required: !0 }, inline: Boolean },
  setup(e) {
    const t = e, { pins: n, minimised: s, toggle: a } = T0(() => t.pinRows);
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
      U(s) ? (i(), u("span", I0, v(U(n).length), 1)) : $("", !0)
    ], 10, R0)) : $("", !0);
  }
}, Yw = /* @__PURE__ */ G(B0, [["__scopeId", "data-v-d073c504"]]), L0 = ["title"], D0 = ["title"], N0 = { class: "diff-card-dir" }, j0 = { class: "diff-card-name" }, P0 = { class: "diff-card-ago" }, q0 = ["title"], W0 = ["title"], F0 = {
  key: 0,
  class: "diff-card-note"
}, H0 = ["href"], U0 = ["src", "alt"], z0 = { class: "diff-card-rows" }, V0 = { class: "diff-row-num" }, K0 = { class: "diff-row-sign" }, G0 = { class: "diff-row-code" }, Y0 = {
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
    const l = { new: "created", deleted: "deleted" }, r = { add: "+", del: "−" }, c = T(() => n.path.lastIndexOf("/") + 1), d = T(() => n.path.slice(0, c.value)), h = T(() => n.path.slice(c.value)), m = T(() => n.kind === "deleted"), b = T(() => l[n.kind]), _ = T(() => new Set(n.rows.filter((C) => C.line_type === "add").map((C) => C.line))), j = B("after"), D = T(() => j.value === "before" ? n.whole.old : n.whole.text), k = T(() => n.whole && n.whole.text !== void 0 ? D.value.split(`
`).map((C, w) => ({ line_type: j.value === "after" && _.value.has(w + 1) ? "add" : "ctx", line: w + 1, text: C })) : n.rows.filter(
      (C) => !(n.editsOnly && ["ctx", "fold"].includes(C.line_type)) && !(n.hideRemovals && C.line_type === "del")
    )), A = B(!1), E = T(() => n.lines && !A.value && !n.whole), V = T(() => E.value ? k.value.slice(0, n.lines) : k.value), y = T(() => k.value.length - V.value.length), g = (C) => C.line === null || C.line_type === "del" ? "" : C.line, R = (C) => C.line_type === "fold" ? C.hidden ? `⋯ ${C.hidden} lines` : "⋯" : C.text, S = B(null), P = B(null);
    let x = null;
    return Le(() => {
      if (!P.value) return;
      let C = !0;
      x = new ResizeObserver(() => {
        !S.value || !P.value || (S.value.style.transition = C ? "none" : "", S.value.style.height = `${P.value.offsetHeight}px`, C = !1);
      }), x.observe(P.value);
    }), Ee(() => x && x.disconnect()), (C, w) => (i(), u("section", {
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
          p("span", N0, v(d.value), 1),
          p("span", j0, v(h.value), 1),
          b.value ? (i(), u("span", {
            key: 0,
            class: J(["diff-card-badge", e.kind])
          }, v(b.value), 3)) : $("", !0)
        ], 8, D0),
        p("span", {
          class: J(["diff-card-count", "add", { zero: !e.added }])
        }, "+" + v(e.added), 3),
        p("span", {
          class: J(["diff-card-count", "del", { zero: !e.removed }])
        }, "−" + v(e.removed), 3),
        p("span", P0, v(e.ago), 1),
        e.whole && e.whole.old !== void 0 ? (i(), u("button", {
          key: 0,
          type: "button",
          class: "diff-card-side",
          title: j.value === "after" ? "Show the file before" : "Show the file after",
          onClick: w[0] || (w[0] = be((f) => j.value = j.value === "after" ? "before" : "after", ["stop"]))
        }, v(j.value === "after" ? "After" : "Before"), 9, q0)) : $("", !0),
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
        ], 10, W0))
      ], 8, L0),
      e.whole && e.whole.error ? (i(), u("p", F0, v(e.whole.error), 1)) : $("", !0),
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
          }, null, 8, U0)
        ], 8, H0)) : (i(), u("div", {
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
            p("div", z0, [
              (i(!0), u(Y, null, ae(V.value, (f, O) => (i(), u("div", {
                key: O,
                class: J(["diff-row", f.line_type, { fresh: e.fresh && f.edit === e.fresh }])
              }, [
                p("span", V0, v(g(f)), 1),
                p("span", K0, v(r[f.line_type]), 1),
                p("span", G0, v(R(f)), 1)
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
}, Jw = /* @__PURE__ */ G(Y0, [["__scopeId", "data-v-b6424f6e"]]), J0 = {
  __name: "BackButton",
  emits: ["back"],
  setup(e, { emit: t }) {
    const n = t;
    return (s, a) => (i(), K(we, {
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
}, We = { word: "cancel", label: "Cancel", flag: "--reason", ask: "Why is it cancelled?" }, Z0 = {
  draft: [{ word: "ready", label: "Mark ready" }, We],
  ready: [{ word: "approve", label: "Approve", main: !0 }, We],
  approved: [{ word: "start", label: "Start", main: !0 }, We],
  started: [{ word: "block", label: "Pause", flag: "--reason", ask: "Why does it wait?" }, { word: "close", label: "Close" }, We],
  blocked: [{ word: "unblock", label: "Resume", main: !0 }, We],
  completed: [],
  cancelled: []
}, X0 = {
  open: [{ word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, We],
  started: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "block", label: "Block", flag: "--reason", ask: "What does it wait on?", opener: "What opens it: task:12, question:4 or plan:3 (optional)" }, We],
  testing: [{ word: "close", label: "Complete", flag: "--outcome", ask: "What came of it?", main: !0 }, { word: "retest", label: "Back to work" }, We],
  blocked: [{ word: "unblock", label: "Unblock", main: !0 }, We],
  completed: [{ word: "reopen", label: "Reopen" }],
  cancelled: [{ word: "reopen", label: "Reopen" }]
}, Q0 = (e) => (e == null ? void 0 : e.state) !== "open" ? [] : [
  ...(e.options ?? []).map((t) => ({ word: "answer", label: t === e.recommended ? `${t} (recommended)` : t, flag: "--answer", said: t, main: t === e.recommended })),
  { word: "answer", label: "Write an answer", flag: "--answer", ask: "Your answer" },
  { word: "close", label: "Close" }
], ev = (e) => !e || e.ended_at ? [] : [
  e.paused_at ? { word: "resume", label: "Resume", main: !0 } : { word: "pause", label: "Pause" },
  { word: "stop", label: "Stop", confirm: "Stop the agent? It stops what it is doing." }
], tv = (e) => (e == null ? void 0 : e.role) !== "worker" || e.ended_at ? [] : [
  { noun: "worker", word: "send", label: "Send a job", ask: "What should it do?", positional: !0 },
  { noun: "worker", word: "merge", label: "Merge", confirm: "Merge its work? Each point needs a checked proof." },
  { noun: "worker", word: "release", label: "Release", ask: "Why is it taken off its task?", positional: !0 }
], nv = (e) => !e || e.removed_at ? [] : [e.stopped ? { word: "run", label: "Start again", main: !0 } : { word: "run", label: "Run now", main: !0 }, ...e.stopped ? [] : [{ word: "stop", label: "Stop" }]], sv = (e) => !e || e.close_reason ? [] : [{ word: "close", label: "Close", flag: "--why", ask: "Why does it need no action?" }], av = (e, t) => {
  var n;
  return e === "doc" || e === "report" ? sv(t) : e === "agent" ? [...tv(t), ...ev(t)] : e === "check" ? nv(t) : e === "question" ? Q0(t) : ((n = { plan: Z0, task: X0 }[e]) == null ? void 0 : n[t == null ? void 0 : t.state]) ?? [];
}, ov = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-resource-refusal": ""
}, rv = {
  key: 1,
  class: "ask",
  "data-resource-confirm": ""
}, lv = { class: "ask-text" }, iv = ["placeholder", "aria-label"], cv = ["placeholder", "aria-label"], uv = {
  key: 3,
  class: "moves"
}, dv = {
  __name: "RowMoves",
  props: { kind: { type: String, required: !0 }, id: { type: Number, required: !0 }, row: { type: Object, default: null }, read: { type: Function, required: !0 }, inline: Boolean },
  emits: ["done"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = T(() => av(s.kind, s.row)), l = B(""), r = B(null), c = B(""), d = B("");
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
        l.value ? (i(), u("p", ov, v(l.value), 1)) : $("", !0),
        (D = r.value) != null && D.confirm ? (i(), u("div", rv, [
          p("span", lv, v(r.value.confirm), 1),
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
          }, null, 40, iv), [
            [Gn, c.value]
          ]),
          r.value.opener ? et((i(), u("input", {
            key: 0,
            "onUpdate:modelValue": j[4] || (j[4] = (k) => d.value = k),
            class: "ask-input",
            "data-resource-opener": "",
            placeholder: r.value.opener,
            "aria-label": r.value.opener,
            onKeydown: j[5] || (j[5] = Tt(be((k) => r.value = null, ["stop"]), ["esc"]))
          }, null, 40, cv)), [
            [Gn, d.value]
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
        ], 32)) : (i(), u("div", uv, [
          (i(!0), u(Y, null, ae(o.value, (k) => (i(), K(we, {
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
}, hv = /* @__PURE__ */ G(dv, [["__scopeId", "data-v-fffa0bf6"]]), fv = {
  started: "In progress",
  testing: "Testing",
  paused: "Paused",
  blocked: "Blocked",
  planned: "Planned",
  asked: "Needs you",
  open: "Open"
}, pv = { ...fv, done: "Completed" }, mv = { class: "task-status-icon" }, gv = ["width", "height", "aria-label"], vv = {
  __name: "TaskStatusIcon",
  props: { status: { type: String, required: !0 }, size: { type: Number, default: 14 } },
  setup(e) {
    return (t, n) => (i(), u("span", mv, [
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
            "aria-label": U(pv)[e.status]
          }, [
            F(ys, { value: e.status }, {
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
          ], 10, gv))
        ]),
        _: 1
      })
    ]));
  }
}, Go = /* @__PURE__ */ G(vv, [["__scopeId", "data-v-2ab7e404"]]), yv = /* @__PURE__ */ new Set(["completed", "cancelled"]), wv = (e) => yv.has(e), Yo = (e) => wv(e) ? "done" : e, kv = { class: "facts" }, bv = { class: "fact wide" }, $v = { class: "fact-value" }, xv = {
  key: 0,
  class: "fact"
}, Mv = { class: "fact-value" }, _v = {
  key: 1,
  class: "fact"
}, Sv = { class: "fact-value" }, Ev = { class: "fact wide" }, Cv = {
  key: 0,
  class: "refusal",
  role: "alert",
  "data-task-refusal": ""
}, Av = {
  __name: "TaskFacts",
  props: { task: { type: Object, required: !0 }, place: { type: Object, default: null }, refusal: { type: String, default: "" } },
  emits: ["priority"],
  setup(e, { emit: t }) {
    const n = on.map(({ key: a, label: o }) => ({ key: String(a), label: o })), s = t;
    return (a, o) => {
      var l, r;
      return i(), u("div", kv, [
        p("div", bv, [
          o[1] || (o[1] = p("span", { class: "fact-label" }, "Plan", -1)),
          p("span", $v, v((l = e.place) != null && l.plan_id ? `Plan ${e.place.plan_id}: ${e.place.plan_title}` : "Not in a plan"), 1)
        ]),
        ((r = e.place) == null ? void 0 : r.phase_total) > 1 ? (i(), u("div", xv, [
          o[2] || (o[2] = p("span", { class: "fact-label" }, "Phase", -1)),
          p("span", Mv, v(e.place.phase_number) + " of " + v(e.place.phase_total) + ": " + v(e.place.phase_title), 1)
        ])) : $("", !0),
        e.task.state === "started" && e.task.holder_id ? (i(), u("div", _v, [
          o[3] || (o[3] = p("span", { class: "fact-label" }, "Holder", -1)),
          p("span", Sv, "Agent " + v(e.task.holder_id), 1)
        ])) : $("", !0),
        p("div", Ev, [
          o[4] || (o[4] = p("span", { class: "fact-label" }, "Priority", -1)),
          F(Wh, {
            options: U(n),
            value: String(U(fo)(e.task.priority)),
            "data-task-priority": "",
            onPick: o[0] || (o[0] = (c) => s("priority", c))
          }, null, 8, ["options", "value"]),
          e.refusal ? (i(), u("p", Cv, v(e.refusal), 1)) : $("", !0)
        ])
      ]);
    };
  }
}, Ov = /* @__PURE__ */ G(Av, [["__scopeId", "data-v-2018762d"]]), Tv = {
  key: 0,
  class: "part",
  "data-resource-waits": ""
}, Rv = ["onClick"], Iv = { class: "wait-id" }, Bv = { class: "wait-title" }, Lv = {
  key: 1,
  class: "part",
  "data-task-outcome": ""
}, Dv = { class: "text" }, Nv = {
  key: 2,
  class: "part",
  "data-task-brief": ""
}, jv = {
  key: 3,
  class: "part",
  "data-resource-logs": ""
}, Pv = 180, qv = {
  __name: "TaskSections",
  props: { task: { type: Object, required: !0 } },
  emits: ["select"],
  setup(e, { emit: t }) {
    const n = t, s = B(!1);
    return (a, o) => (i(), u(Y, null, [
      e.task.waits.length ? (i(), u("section", Tv, [
        o[1] || (o[1] = p("h4", null, "Waits on", -1)),
        (i(!0), u(Y, null, ae(e.task.waits, (l) => (i(), u("button", {
          key: l.id,
          type: "button",
          class: "wait",
          onClick: (r) => n("select", l.id)
        }, [
          F(Go, {
            status: U(Yo)(l.state),
            size: 12
          }, null, 8, ["status"]),
          p("span", Iv, v(l.id), 1),
          p("span", Bv, v(l.title), 1)
        ], 8, Rv))), 128))
      ])) : $("", !0),
      e.task.state === "completed" && e.task.outcome ? (i(), u("section", Lv, [
        o[2] || (o[2] = p("h4", null, "How it was done", -1)),
        p("p", Dv, v(e.task.outcome), 1)
      ])) : $("", !0),
      e.task.brief ? (i(), u("section", Nv, [
        o[3] || (o[3] = p("h4", null, "The brief", -1)),
        p("p", {
          class: J(["text", { clamped: !s.value }])
        }, v(e.task.brief), 3),
        e.task.brief.length > Pv && !s.value ? (i(), u("button", {
          key: 0,
          type: "button",
          class: "more",
          onClick: o[0] || (o[0] = (l) => s.value = !0)
        }, "Show the whole brief")) : $("", !0)
      ])) : $("", !0),
      e.task.logs.length ? (i(), u("section", jv, [
        o[4] || (o[4] = p("h4", null, "Log", -1)),
        (i(!0), u(Y, null, ae(e.task.logs, (l) => (i(), u("p", {
          key: l.id,
          class: "log"
        }, v(l.line), 1))), 128))
      ])) : $("", !0)
    ], 64));
  }
}, Wv = /* @__PURE__ */ G(qv, [["__scopeId", "data-v-f411ce35"]]), Fv = { class: "comment-side-head" }, Hv = {
  key: 0,
  class: "comment-none"
}, Uv = {
  __name: "CommentSide",
  props: { comments: { type: Array, required: !0 }, words: { type: Function, required: !0 }, below: Boolean },
  emits: ["close"],
  setup(e) {
    return (t, n) => (i(), u("aside", {
      class: J(["comment-side", { below: e.below }]),
      "data-comment-side": "",
      "aria-label": "Comments"
    }, [
      p("header", Fv, [
        n[1] || (n[1] = p("h3", null, "Comments", -1)),
        F(yn, {
          title: "Close the comments",
          onClick: n[0] || (n[0] = (s) => t.$emit("close"))
        })
      ]),
      e.comments.length ? $("", !0) : (i(), u("p", Hv, "No comments yet")),
      (i(!0), u(Y, null, ae(e.comments, (s) => (i(), u("p", {
        key: s.id,
        class: "comment",
        "data-comment": ""
      }, v(e.words(s)), 1))), 128))
    ], 2));
  }
}, zv = /* @__PURE__ */ G(Uv, [["__scopeId", "data-v-19fdbdd4"]]), Vv = ["data-comments-below"], Kv = 600, Gv = {
  __name: "CommentedRow",
  props: { open: Boolean, comments: { type: Array, required: !0 }, words: { type: Function, required: !0 } },
  emits: ["close"],
  setup(e) {
    const t = B(null), n = B(!1), s = new ResizeObserver(([a]) => n.value = a.contentRect.width < Kv);
    return Le(() => s.observe(t.value)), wt(() => s.disconnect()), (a, o) => (i(), u("div", {
      ref_key: "root",
      ref: t,
      class: J(["commented-row", { below: n.value }]),
      "data-comments-below": n.value || null
    }, [
      pe(a.$slots, "default"),
      e.open ? (i(), K(zv, {
        key: 0,
        comments: e.comments,
        words: e.words,
        below: n.value,
        onClose: o[0] || (o[0] = (l) => a.$emit("close"))
      }, null, 8, ["comments", "words", "below"])) : $("", !0)
    ], 10, Vv));
  }
}, Yv = /* @__PURE__ */ G(Gv, [["__scopeId", "data-v-6c850df0"]]), Jv = ["placeholder"], Zv = { class: "actions" }, Xv = { class: "error" }, Qv = {
  key: 1,
  class: "card closed"
}, ey = { class: "mark" }, ty = { class: "prompt" }, ny = {
  key: 0,
  class: "draft"
}, sy = {
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
    const s = e, a = n, o = Vn(e, "draft"), l = Vn(e, "error"), r = B(!!l.value), c = B(!1), d = B(!1), h = B(null);
    async function m() {
      var D, k;
      r.value = !0, c.value = !1, await Nt(), (k = ((D = h.value) == null ? void 0 : D.querySelector("input")) || h.value) == null || k.focus();
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
        }, null, 40, Jv), [
          [Gn, o.value]
        ]),
        p("div", Zv, [
          p("span", Xv, v(l.value), 1),
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
      ], 32)) : (i(), u("div", Qv, [
        p("button", {
          type: "button",
          class: "comment-bar-open",
          onClick: m
        }, [
          p("span", ey, [
            F(ve, {
              name: c.value ? "check" : "chat",
              size: 14
            }, null, 8, ["name"])
          ]),
          p("span", ty, v(c.value ? "Sent. Leave another" : "Leave a comment"), 1),
          o.value.trim() ? (i(), u("span", ny, "Draft kept")) : $("", !0)
        ]),
        e.count ? (i(), u("button", {
          key: 0,
          type: "button",
          class: "count",
          onClick: k[1] || (k[1] = (A) => a("show"))
        }, [
          p("span", null, v(U(cf)(e.count, "comment")), 1),
          F(ve, {
            name: "down",
            size: 12
          })
        ])) : $("", !0)
      ]))
    ], 2));
  }
}, ay = /* @__PURE__ */ G(sy, [["__scopeId", "data-v-79db0c2d"]]);
function oy(e, t) {
  const n = B([]), s = B(!1);
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
const ry = { class: "top" }, ly = {
  class: "crumb",
  "data-task-crumb": ""
}, iy = {
  key: 0,
  class: "failure",
  role: "alert",
  "data-resource-failure": ""
}, cy = {
  key: 1,
  class: "body"
}, uy = { class: "stamp" }, dy = {
  class: "title",
  "data-resource-title": ""
}, hy = { class: "since" }, fy = {
  key: 0,
  class: "reason",
  "data-task-reason": ""
}, py = { class: "text" }, my = {
  key: 0,
  class: "note",
  "data-task-openers": ""
}, gy = {
  key: 1,
  class: "note"
}, vy = {
  key: 1,
  class: "reason",
  "data-task-reason": ""
}, yy = { class: "text" }, wy = {
  __name: "TaskInspector",
  props: { id: { type: Number, required: !0 }, read: { type: Function, required: !0 }, lone: Boolean, stepped: Boolean, backed: Boolean, changes: { type: Number, default: 0 } },
  emits: ["close", "step", "select", "back", "comments"],
  setup(e, { expose: t, emit: n }) {
    const s = e, a = n, o = B(null), l = B(null), r = B(""), c = B(""), d = B(null), h = B(null), m = oy(() => o.value ? { kind: "task", id: s.id, title: o.value.title } : {}, (y) => s.read(y));
    ke(m.open, (y) => a("comments", y));
    let b = 0;
    const _ = Yo, j = (y) => y.slice(0, 1).toUpperCase() + y.slice(1), D = T(() => {
      var y;
      return (y = l.value) != null && y.plan_id ? l.value.phase_total > 1 ? `Plan ${l.value.plan_id} › Phase ${l.value.phase_number}: ${l.value.phase_title}` : `Plan ${l.value.plan_id}: ${l.value.plan_title}` : "Not in a plan";
    });
    async function k() {
      const y = ++b, [g, R] = await Promise.all([s.read(["task", "inspect", String(s.id)]), s.read(["plan", "place", String(s.id)])]);
      y === b && (r.value = g.ok ? "" : g.error, o.value = g.ok ? g.value : null, l.value = R.ok ? R.value : null);
    }
    ke(() => s.id, () => {
      o.value = null, l.value = null, d.value = null, k();
    }, { immediate: !0 }), ke(() => s.changes, k);
    async function A(y) {
      const g = o.value.priority;
      o.value.priority = Number(y);
      const R = await s.read(["task", "edit", String(s.id), "--priority", y]);
      if (c.value = R.ok ? "" : R.error, R.ok) return k();
      o.value.priority = g;
    }
    function E(y) {
      d.value = null, h.value.press(y);
    }
    const V = (y) => {
      var g;
      return ((g = h.value) == null ? void 0 : g.moves.length) && (d.value = y);
    };
    return t({ openStatus: V }), (y, g) => (i(), u("aside", {
      class: J(["task-inspector", { lone: e.lone }]),
      "data-task-inspector": ""
    }, [
      p("div", ry, [
        e.backed ? (i(), K(J0, {
          key: 0,
          onBack: g[0] || (g[0] = (R) => a("back"))
        })) : $("", !0),
        p("span", ly, v(D.value), 1),
        g[9] || (g[9] = p("span", { class: "grow" }, null, -1)),
        e.stepped ? (i(), u(Y, { key: 1 }, [
          F(we, {
            small: "",
            title: "Previous task (K)",
            "aria-label": "Previous task",
            onClick: g[1] || (g[1] = (R) => a("step", -1))
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
            onClick: g[2] || (g[2] = (R) => a("step", 1))
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
          onClick: g[3] || (g[3] = (R) => a("close"))
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
      r.value ? (i(), u("p", iy, v(r.value), 1)) : o.value ? (i(), u(Y, { key: 2 }, [
        F(Yv, {
          open: U(m).open.value,
          comments: U(m).comments.value,
          words: U(m).words,
          onClose: g[6] || (g[6] = (R) => U(m).open.value = !1)
        }, {
          default: z(() => {
            var R;
            return [
              (i(), u("div", {
                key: o.value.id,
                class: "body"
              }, [
                p("div", uy, "Task " + v(o.value.id) + " · updated " + v(U(as)(U(Jn)(o.value)) || "just now"), 1),
                p("h3", dy, v(o.value.title), 1),
                p("div", {
                  class: J(["state-line", U(_)(o.value.state)])
                }, [
                  p("button", {
                    type: "button",
                    class: "state",
                    "data-task-state": "",
                    title: "Change the status (S)",
                    onClick: g[4] || (g[4] = (S) => V(S.currentTarget))
                  }, [
                    F(Go, {
                      status: U(_)(o.value.state)
                    }, null, 8, ["status"]),
                    ce(" " + v(j(o.value.state)), 1)
                  ]),
                  p("span", hy, "since " + v(U(as)(U(Jn)(o.value)) || "just now"), 1)
                ], 2),
                o.value.state === "blocked" ? (i(), u("section", fy, [
                  g[10] || (g[10] = p("span", { class: "label" }, "Blocked, waiting on", -1)),
                  p("p", py, v(o.value.reason || "Other tasks"), 1),
                  (R = o.value.openers) != null && R.length ? (i(), u("p", my, "Opens by itself when " + v(o.value.openers.join(" or ")) + ".", 1)) : (i(), u("p", gy, "Nothing opens it by itself. Unblock it when that is done."))
                ])) : o.value.state === "cancelled" && o.value.reason ? (i(), u("section", vy, [
                  g[11] || (g[11] = p("span", { class: "label" }, "Why it was cancelled", -1)),
                  p("p", yy, v(o.value.reason), 1)
                ])) : $("", !0),
                F(Ov, {
                  task: o.value,
                  place: l.value,
                  refusal: c.value,
                  onPriority: A
                }, null, 8, ["task", "place", "refusal"]),
                F(Wv, {
                  task: o.value,
                  onSelect: g[5] || (g[5] = (S) => a("select", S))
                }, null, 8, ["task"])
              ]))
            ];
          }),
          _: 1
        }, 8, ["open", "comments", "words"]),
        F(ay, {
          send: U(m).send,
          count: U(m).comments.value.length,
          onShow: g[7] || (g[7] = (R) => U(m).open.value = !U(m).open.value)
        }, null, 8, ["send", "count"])
      ], 64)) : (i(), u("div", cy, [
        F(kt)
      ])),
      F(hv, {
        ref_key: "footer",
        ref: h,
        kind: "task",
        id: e.id,
        row: o.value,
        read: e.read,
        onDone: k
      }, null, 8, ["id", "row", "read"]),
      d.value ? (i(), K(Es, {
        key: 3,
        anchor: d.value,
        "min-width": 220,
        "max-width": 300,
        onClose: g[8] || (g[8] = (R) => d.value = null)
      }, {
        default: z(() => [
          F(hs, null, {
            default: z(() => [
              ce("Change the status of task " + v(e.id), 1)
            ]),
            _: 1
          }),
          (i(!0), u(Y, null, ae(h.value.moves, (R) => (i(), K(vt, {
            key: R.word,
            onClick: (S) => E(R)
          }, {
            default: z(() => [
              ce(v(R.label), 1)
            ]),
            _: 2
          }, 1032, ["onClick"]))), 128))
        ]),
        _: 1
      }, 8, ["anchor"])) : $("", !0)
    ], 2));
  }
}, Zw = /* @__PURE__ */ G(wy, [["__scopeId", "data-v-c76befc4"]]);
function ky(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var zn = { exports: {} }, va;
function by() {
  return va || (va = 1, (function(e, t) {
    var n = (function() {
      var s = function(g, R) {
        var S = 236, P = 17, x = g, C = o[R], w = null, f = 0, O = null, I = [], q = {}, re = function(L, N) {
          f = x * 4 + 17, w = (function(M) {
            for (var W = new Array(M), H = 0; H < M; H += 1) {
              W[H] = new Array(M);
              for (var X = 0; X < M; X += 1)
                W[H][X] = null;
            }
            return W;
          })(f), ie(0, 0), ie(f - 7, 0), ie(0, f - 7), ee(), Q(), Ae(L, N), x >= 7 && Z(L), O == null && (O = Jo(x, C, I)), Pe(O, N);
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
          for (var M = C << 3 | N, W = r.getBCHTypeInfo(M), H = 0; H < 15; H += 1) {
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
            var Oe = r.getErrorCorrectPolynomial(xe), Te = d(X[se], Oe.getLength() - 1), Ts = Te.mod(Oe);
            oe[se] = new Array(Oe.getLength() - 1);
            for (var le = 0; le < oe[se].length; le += 1) {
              var Rs = le + Ts.getLength() - oe[se].length;
              oe[se][le] = Rs >= 0 ? Ts.getAt(Rs) : 0;
            }
          }
          for (var Is = 0, le = 0; le < N.length; le += 1)
            Is += N[le].totalCount;
          for (var $n = new Array(Is), Ut = 0, le = 0; le < W; le += 1)
            for (var se = 0; se < N.length; se += 1)
              le < X[se].length && ($n[Ut] = X[se][le], Ut += 1);
          for (var le = 0; le < H; le += 1)
            for (var se = 0; se < N.length; se += 1)
              le < oe[se].length && ($n[Ut] = oe[se][le], Ut += 1);
          return $n;
        }, Jo = function(L, N, M) {
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
          I.push(M), O = null;
        }, q.isDark = function(L, N) {
          if (L < 0 || f <= L || N < 0 || f <= N)
            throw L + "," + N;
          return w[L][N];
        }, q.getModuleCount = function() {
          return f;
        }, q.make = function() {
          if (x < 1) {
            for (var L = 1; L < 40; L++) {
              for (var N = h.getRSBlocks(L, C), M = m(), W = 0; W < I.length; W++) {
                var H = I[W];
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
        }, Zo = function(L) {
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
            return Zo(N);
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
          for (var R = [], S = 0; S < g.length; S += 1) {
            var P = g.charCodeAt(S);
            R.push(P & 255);
          }
          return R;
        }
      }, s.stringToBytes = s.stringToBytesFuncs.default, s.createStringToBytes = function(g, R) {
        var S = (function() {
          for (var x = E(g), C = function() {
            var Q = x.read();
            if (Q == -1) throw "eof";
            return Q;
          }, w = 0, f = {}; ; ) {
            var O = x.read();
            if (O == -1) break;
            var I = C(), q = C(), re = C(), ie = String.fromCharCode(O << 8 | I), he = q << 8 | re;
            f[ie] = he, w += 1;
          }
          if (w != R)
            throw w + " != " + R;
          return f;
        })(), P = 63;
        return function(x) {
          for (var C = [], w = 0; w < x.length; w += 1) {
            var f = x.charCodeAt(w);
            if (f < 128)
              C.push(f);
            else {
              var O = S[x.charAt(w)];
              typeof O == "number" ? (O & 255) == O ? C.push(O) : (C.push(O >>> 8), C.push(O & 255)) : C.push(P);
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
        ], R = 1335, S = 7973, P = 21522, x = {}, C = function(w) {
          for (var f = 0; w != 0; )
            f += 1, w >>>= 1;
          return f;
        };
        return x.getBCHTypeInfo = function(w) {
          for (var f = w << 10; C(f) - C(R) >= 0; )
            f ^= R << C(f) - C(R);
          return (w << 10 | f) ^ P;
        }, x.getBCHTypeNumber = function(w) {
          for (var f = w << 12; C(f) - C(S) >= 0; )
            f ^= S << C(f) - C(S);
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
          for (var f = w.getModuleCount(), O = 0, I = 0; I < f; I += 1)
            for (var q = 0; q < f; q += 1) {
              for (var re = 0, ie = w.isDark(I, q), he = -1; he <= 1; he += 1)
                if (!(I + he < 0 || f <= I + he))
                  for (var Q = -1; Q <= 1; Q += 1)
                    q + Q < 0 || f <= q + Q || he == 0 && Q == 0 || ie == w.isDark(I + he, q + Q) && (re += 1);
              re > 5 && (O += 3 + re - 5);
            }
          for (var I = 0; I < f - 1; I += 1)
            for (var q = 0; q < f - 1; q += 1) {
              var ee = 0;
              w.isDark(I, q) && (ee += 1), w.isDark(I + 1, q) && (ee += 1), w.isDark(I, q + 1) && (ee += 1), w.isDark(I + 1, q + 1) && (ee += 1), (ee == 0 || ee == 4) && (O += 3);
            }
          for (var I = 0; I < f; I += 1)
            for (var q = 0; q < f - 6; q += 1)
              w.isDark(I, q) && !w.isDark(I, q + 1) && w.isDark(I, q + 2) && w.isDark(I, q + 3) && w.isDark(I, q + 4) && !w.isDark(I, q + 5) && w.isDark(I, q + 6) && (O += 40);
          for (var q = 0; q < f; q += 1)
            for (var I = 0; I < f - 6; I += 1)
              w.isDark(I, q) && !w.isDark(I + 1, q) && w.isDark(I + 2, q) && w.isDark(I + 3, q) && w.isDark(I + 4, q) && !w.isDark(I + 5, q) && w.isDark(I + 6, q) && (O += 40);
          for (var Z = 0, q = 0; q < f; q += 1)
            for (var I = 0; I < f; I += 1)
              w.isDark(I, q) && (Z += 1);
          var Ae = Math.abs(100 * Z / f / f - 50) / 5;
          return O += Ae * 10, O;
        }, x;
      })(), c = (function() {
        for (var g = new Array(256), R = new Array(256), S = 0; S < 8; S += 1)
          g[S] = 1 << S;
        for (var S = 8; S < 256; S += 1)
          g[S] = g[S - 4] ^ g[S - 5] ^ g[S - 6] ^ g[S - 8];
        for (var S = 0; S < 255; S += 1)
          R[g[S]] = S;
        var P = {};
        return P.glog = function(x) {
          if (x < 1)
            throw "glog(" + x + ")";
          return R[x];
        }, P.gexp = function(x) {
          for (; x < 0; )
            x += 255;
          for (; x >= 256; )
            x -= 255;
          return g[x];
        }, P;
      })();
      function d(g, R) {
        if (typeof g.length > "u")
          throw g.length + "/" + R;
        var S = (function() {
          for (var x = 0; x < g.length && g[x] == 0; )
            x += 1;
          for (var C = new Array(g.length - x + R), w = 0; w < g.length - x; w += 1)
            C[w] = g[w + x];
          return C;
        })(), P = {};
        return P.getAt = function(x) {
          return S[x];
        }, P.getLength = function() {
          return S.length;
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
        ], R = function(x, C) {
          var w = {};
          return w.totalCount = x, w.dataCount = C, w;
        }, S = {}, P = function(x, C) {
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
        return S.getRSBlocks = function(x, C) {
          var w = P(x, C);
          if (typeof w > "u")
            throw "bad rs block @ typeNumber:" + x + "/errorCorrectionLevel:" + C;
          for (var f = w.length / 3, O = [], I = 0; I < f; I += 1)
            for (var q = w[I * 3 + 0], re = w[I * 3 + 1], ie = w[I * 3 + 2], he = 0; he < q; he += 1)
              O.push(R(re, ie));
          return O;
        }, S;
      })(), m = function() {
        var g = [], R = 0, S = {};
        return S.getBuffer = function() {
          return g;
        }, S.getAt = function(P) {
          var x = Math.floor(P / 8);
          return (g[x] >>> 7 - P % 8 & 1) == 1;
        }, S.put = function(P, x) {
          for (var C = 0; C < x; C += 1)
            S.putBit((P >>> x - C - 1 & 1) == 1);
        }, S.getLengthInBits = function() {
          return R;
        }, S.putBit = function(P) {
          var x = Math.floor(R / 8);
          g.length <= x && g.push(0), P && (g[x] |= 128 >>> R % 8), R += 1;
        }, S;
      }, b = function(g) {
        var R = a.MODE_NUMBER, S = g, P = {};
        P.getMode = function() {
          return R;
        }, P.getLength = function(w) {
          return S.length;
        }, P.write = function(w) {
          for (var f = S, O = 0; O + 2 < f.length; )
            w.put(x(f.substring(O, O + 3)), 10), O += 3;
          O < f.length && (f.length - O == 1 ? w.put(x(f.substring(O, O + 1)), 4) : f.length - O == 2 && w.put(x(f.substring(O, O + 2)), 7));
        };
        var x = function(w) {
          for (var f = 0, O = 0; O < w.length; O += 1)
            f = f * 10 + C(w.charAt(O));
          return f;
        }, C = function(w) {
          if ("0" <= w && w <= "9")
            return w.charCodeAt(0) - 48;
          throw "illegal char :" + w;
        };
        return P;
      }, _ = function(g) {
        var R = a.MODE_ALPHA_NUM, S = g, P = {};
        P.getMode = function() {
          return R;
        }, P.getLength = function(C) {
          return S.length;
        }, P.write = function(C) {
          for (var w = S, f = 0; f + 1 < w.length; )
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
        var R = a.MODE_8BIT_BYTE, S = s.stringToBytes(g), P = {};
        return P.getMode = function() {
          return R;
        }, P.getLength = function(x) {
          return S.length;
        }, P.write = function(x) {
          for (var C = 0; C < S.length; C += 1)
            x.put(S[C], 8);
        }, P;
      }, D = function(g) {
        var R = a.MODE_KANJI, S = s.stringToBytesFuncs.SJIS;
        if (!S)
          throw "sjis not supported.";
        (function(C, w) {
          var f = S(C);
          if (f.length != 2 || (f[0] << 8 | f[1]) != w)
            throw "sjis not supported.";
        })("友", 38726);
        var P = S(g), x = {};
        return x.getMode = function() {
          return R;
        }, x.getLength = function(C) {
          return ~~(P.length / 2);
        }, x.write = function(C) {
          for (var w = P, f = 0; f + 1 < w.length; ) {
            var O = (255 & w[f]) << 8 | 255 & w[f + 1];
            if (33088 <= O && O <= 40956)
              O -= 33088;
            else if (57408 <= O && O <= 60351)
              O -= 49472;
            else
              throw "illegal char at " + (f + 1) + "/" + O;
            O = (O >>> 8 & 255) * 192 + (O & 255), C.put(O, 13), f += 2;
          }
          if (f < w.length)
            throw "illegal char at " + (f + 1);
        }, x;
      }, k = function() {
        var g = [], R = {};
        return R.writeByte = function(S) {
          g.push(S & 255);
        }, R.writeShort = function(S) {
          R.writeByte(S), R.writeByte(S >>> 8);
        }, R.writeBytes = function(S, P, x) {
          P = P || 0, x = x || S.length;
          for (var C = 0; C < x; C += 1)
            R.writeByte(S[C + P]);
        }, R.writeString = function(S) {
          for (var P = 0; P < S.length; P += 1)
            R.writeByte(S.charCodeAt(P));
        }, R.toByteArray = function() {
          return g;
        }, R.toString = function() {
          var S = "";
          S += "[";
          for (var P = 0; P < g.length; P += 1)
            P > 0 && (S += ","), S += g[P];
          return S += "]", S;
        }, R;
      }, A = function() {
        var g = 0, R = 0, S = 0, P = "", x = {}, C = function(f) {
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
          for (g = g << 8 | f & 255, R += 8, S += 1; R >= 6; )
            C(g >>> R - 6), R -= 6;
        }, x.flush = function() {
          if (R > 0 && (C(g << 6 - R), g = 0, R = 0), S % 3 != 0)
            for (var f = 3 - S % 3, O = 0; O < f; O += 1)
              P += "=";
        }, x.toString = function() {
          return P;
        }, x;
      }, E = function(g) {
        var R = g, S = 0, P = 0, x = 0, C = {};
        C.read = function() {
          for (; x < 8; ) {
            if (S >= R.length) {
              if (x == 0)
                return -1;
              throw "unexpected end of file./" + x;
            }
            var f = R.charAt(S);
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
        return C;
      }, V = function(g, R) {
        var S = g, P = R, x = new Array(g * R), C = {};
        C.setPixel = function(I, q, re) {
          x[q * S + I] = re;
        }, C.write = function(I) {
          I.writeString("GIF87a"), I.writeShort(S), I.writeShort(P), I.writeByte(128), I.writeByte(0), I.writeByte(0), I.writeByte(0), I.writeByte(0), I.writeByte(0), I.writeByte(255), I.writeByte(255), I.writeByte(255), I.writeString(","), I.writeShort(0), I.writeShort(0), I.writeShort(S), I.writeShort(P), I.writeByte(0);
          var q = 2, re = f(q);
          I.writeByte(q);
          for (var ie = 0; re.length - ie > 255; )
            I.writeByte(255), I.writeBytes(re, ie, 255), ie += 255;
          I.writeByte(re.length - ie), I.writeBytes(re, ie, re.length - ie), I.writeByte(0), I.writeString(";");
        };
        var w = function(I) {
          var q = I, re = 0, ie = 0, he = {};
          return he.write = function(Q, ee) {
            if (Q >>> ee)
              throw "length over";
            for (; re + ee >= 8; )
              q.writeByte(255 & (Q << re | ie)), ee -= 8 - re, Q >>>= 8 - re, ie = 0, re = 0;
            ie = Q << re | ie, re = re + ee;
          }, he.flush = function() {
            re > 0 && q.writeByte(ie);
          }, he;
        }, f = function(I) {
          for (var q = 1 << I, re = (1 << I) + 1, ie = I + 1, he = O(), Q = 0; Q < q; Q += 1)
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
          var I = {}, q = 0, re = {};
          return re.add = function(ie) {
            if (re.contains(ie))
              throw "dup key:" + ie;
            I[ie] = q, q += 1;
          }, re.size = function() {
            return q;
          }, re.indexOf = function(ie) {
            return I[ie];
          }, re.contains = function(ie) {
            return typeof I[ie] < "u";
          }, re;
        };
        return C;
      }, y = function(g, R, S) {
        for (var P = V(g, R), x = 0; x < R; x += 1)
          for (var C = 0; C < g; C += 1)
            P.setPixel(C, x, S(C, x));
        var w = k();
        P.write(w);
        for (var f = A(), O = w.toByteArray(), I = 0; I < O.length; I += 1)
          f.writeByte(O[I]);
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
  })(zn)), zn.exports;
}
var $y = by();
const xy = /* @__PURE__ */ ky($y), My = ["width", "height", "viewBox"], _y = ["width", "height"], Sy = ["d"], Ey = {
  __name: "QrCode",
  props: { text: { type: String, required: !0 }, size: { type: Number, default: 200 } },
  setup(e) {
    const t = e, n = T(() => {
      const s = xy(0, "M");
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
      }, null, 8, _y),
      p("path", {
        d: n.value.path,
        fill: "#000"
      }, null, 8, Sy)
    ], 8, My));
  }
}, Xw = /* @__PURE__ */ G(Ey, [["__scopeId", "data-v-489f0852"]]), Qw = cr(() => import("./VoiceFigure-DEd4JJrd.js").then((e) => e.V)), e2 = "1.0.0", t2 = "3.5";
export {
  Iy as $,
  uw as A,
  Ze as B,
  kw as C,
  iw as D,
  ww as E,
  tw as F,
  zo as G,
  Lg as H,
  Ig as I,
  Sw as J,
  bt as K,
  gw as L,
  Re as M,
  Ct as N,
  hw as O,
  bn as P,
  fw as Q,
  vm as R,
  Lo as S,
  cw as T,
  yw as U,
  ha as V,
  wg as W,
  hg as X,
  Ew as Y,
  bw as Z,
  G as _,
  je as a,
  jy as a$,
  Ww as a0,
  we as a1,
  yn as a2,
  By as a3,
  Fu as a4,
  Jw as a5,
  Qy as a6,
  nn as a7,
  Aw as a8,
  Ay as a9,
  Hy as aA,
  kt as aB,
  Vy as aC,
  Ty as aD,
  ys as aE,
  Zw as aF,
  Go as aG,
  Uy as aH,
  Ye as aI,
  zy as aJ,
  Qw as aK,
  Ce as aL,
  Lw as aM,
  Pd as aN,
  as as aO,
  Kw as aP,
  Vw as aQ,
  Gw as aR,
  Xy as aS,
  Jy as aT,
  Gy as aU,
  Tw as aV,
  Bh as aW,
  Py as aX,
  Ow as aY,
  pp as aZ,
  Ry as a_,
  Lt as aa,
  qy as ab,
  ve as ac,
  Fw as ad,
  e2 as ae,
  t2 as af,
  Wy as ag,
  Hw as ah,
  ls as ai,
  Yy as aj,
  bp as ak,
  vt as al,
  hs as am,
  Es as an,
  Ly as ao,
  Fy as ap,
  Or as aq,
  Yw as ar,
  Ny as as,
  Xw as at,
  Pw as au,
  nl as av,
  Oy as aw,
  Zy as ax,
  k0 as ay,
  Wh as az,
  Xe as b,
  Bw as b0,
  Dw as b1,
  He as b2,
  Dy as b3,
  Iw as b4,
  Ky as b5,
  lt as b6,
  Kg as b7,
  qw as b8,
  Rw as b9,
  Uw as ba,
  hf as bb,
  T0 as bc,
  xo as bd,
  Nw as be,
  If as bf,
  jw as bg,
  pn as bh,
  zw as bi,
  dw as c,
  sw as d,
  aw as e,
  nw as f,
  xw as g,
  Ao as h,
  pw as i,
  mw as j,
  vw as k,
  Mw as l,
  ow as m,
  ew as n,
  rw as o,
  cn as p,
  Cw as q,
  $w as r,
  lw as s,
  De as t,
  dg as u,
  _w as v,
  pg as w,
  Cs as x,
  Dm as y,
  Nm as z
};
