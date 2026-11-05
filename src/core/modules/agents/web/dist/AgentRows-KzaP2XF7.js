/* @code-commandments-generated */
import { openBlock as o, createElementBlock as r, withModifiers as M, unref as c, createTextVNode as ue, toDisplayString as g, createVNode as b, createBlock as _, withCtx as R, Fragment as Y, renderList as ce, createElementVNode as p, createCommentVNode as d, computed as i, ref as m, watch as oe, defineAsyncComponent as $e, onUnmounted as ye, withKeys as ve, normalizeClass as se, createSlots as Se, resolveDynamicComponent as Ce, nextTick as pe } from "vue";
import { peekRef as ke, Icon as de, RunningCommand as Te, FoldGroup as he, TaskStatusIcon as _e, useNow as Re, age as xe, perHour as Ae, useWindow as be, loadWindowComponent as Ee, TimeAgo as qe, Btn as Be, InnerTabs as Oe, TabBody as Ie, SwitchCase as je, EmptyState as Ne, useRows as He, useDeclaredRows as me, SearchBar as Le, Segmented as Ve, RowList as We } from "@journal/window-kit";
import { _ as le, T as fe } from "./TranscriptRows-ByPSYos4.js";
const ze = {
  class: "agent-command",
  "data-agent-command": ""
}, De = {
  key: 1,
  "data-agent-stopped": ""
}, Pe = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(n) {
    return (W, C) => (o(), r("span", ze, [
      n.waitReason ? (o(), r("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: C[0] || (C[0] = M((z) => c(ke)("test_queue:0"), ["stop"]))
      }, [
        ue("Waiting: " + g(n.waitReason) + " ", 1),
        b(c(de), {
          name: "arrow",
          size: 11
        })
      ])) : n.stopped ? (o(), r("span", De, "Waiting")) : (o(), _(c(Te), {
        key: 2,
        text: n.command,
        idle: n.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, we = /* @__PURE__ */ le(Pe, [["__scopeId", "data-v-1b371fb5"]]), Fe = ["data-agent-delegated", "onClick"], Ue = { class: "agent-task-number" }, Ke = { class: "agent-task-title" }, Ge = ["title"], Me = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(n, { emit: W }) {
    const C = W;
    return (z, a) => (o(), _(c(he), {
      label: n.section.label,
      count: n.section.tasks.length,
      open: n.open,
      "data-agent-section": n.section.state,
      onToggle: a[0] || (a[0] = (u) => C("toggle"))
    }, {
      default: R(() => [
        (o(!0), r(Y, null, ce(n.section.tasks, (u) => (o(), r("button", {
          key: u.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": u.id,
          onClick: (D) => c(ke)(`tasks:${u.id}`)
        }, [
          b(c(_e), {
            status: u.state
          }, null, 8, ["status"]),
          p("span", Ue, g(u.id), 1),
          p("span", Ke, g(u.title), 1),
          u.plan_id ? (o(), r("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${u.plan_id}: ${u.plan_title}`
          }, "Plan " + g(u.plan_id) + ": " + g(u.plan_title), 9, Ge)) : d("", !0)
        ], 8, Fe))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Ye = /* @__PURE__ */ le(Me, [["__scopeId", "data-v-238ff959"]]), Je = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], Qe = { class: "agent-head" }, Xe = ["data-state"], Ze = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, et = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, tt = {
  key: 3,
  class: "agent-time",
  "data-agent-motion": ""
}, at = { class: "agent-line" }, nt = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, ot = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, st = {
  key: 0,
  class: "agent-line agent-work-start"
}, lt = ["title"], rt = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, it = {
  key: 1,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, ut = {
  class: "agent-usage",
  "data-agent-card-usage": ""
}, ct = {
  key: 2,
  class: "agent-tab-body",
  "data-agent-tab-body": "transcript",
  "data-agent-only-transcript": ""
}, dt = {
  key: 0,
  class: "agent-subagent-brief"
}, gt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, vt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, pt = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(n, { emit: W }) {
    const C = { subagent: "Helper", helper: "Helper", reviewer: "Reviewer" }, z = ["started", "blocked", "open", "completed"], a = n, u = W, D = Re(), re = i(() => {
      var t;
      const e = ((t = a.facts) == null ? void 0 : t.profile) || C[a.row.role] || a.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), v = i(() => {
      var e;
      return ((e = a.facts) == null ? void 0 : e.tasks) ?? [];
    }), E = i(() => v.value.filter((e) => e.state === "open")), x = i(() => {
      var e, t, k;
      return (e = a.facts) != null && e.job_enabled && (((t = a.facts) == null ? void 0 : t.task_title) || ((k = E.value[0]) == null ? void 0 : k.title)) || "";
    }), J = i(() => {
      var e, t;
      return [a.row.program, (e = a.facts) == null ? void 0 : e.model, (t = a.facts) == null ? void 0 : t.effort, a.row.role === "main" ? "" : a.progress ? `${a.row.role} ${a.row.id}` : a.row.role, a.row.access === "read-only" ? "Access: Read-only" : ""].filter(Boolean).join(" · ");
    }), Q = i(() => xe(a.row.process_started_at || a.row.created_at, D.value)), X = /* @__PURE__ */ new Set(["open", "started", "testing"]), q = i(() => !!a.row.ended_at && a.row.role !== "main" && v.value.some((e) => X.has(e.state))), P = i(() => {
      var e;
      return a.waitReason || q.value ? "waiting" : a.row.state === "running" && ((e = a.facts) == null ? void 0 : e.state) || a.row.state;
    }), F = i(() => {
      var t, k, w;
      const e = [];
      return ((t = a.facts) == null ? void 0 : t.context_percent) !== null && ((k = a.facts) == null ? void 0 : k.context_percent) !== void 0 && e.push(`Context: ${a.facts.context_percent}%`), (w = a.facts) != null && w.cost_dollars && e.push(`$${a.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), N = i(() => {
      var e;
      return ((e = a.progress) == null ? void 0 : e.completed_count) ?? v.value.filter((t) => t.state === "completed").length;
    }), B = i(() => {
      var e;
      return ((e = a.progress) == null ? void 0 : e.task_count) ?? v.value.length;
    }), Z = i(() => `${N.value} of ${B.value} ${B.value === 1 ? "task" : "tasks"}`), H = i(() => {
      var t;
      const e = Ae(N.value, ((t = a.progress) == null ? void 0 : t.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, D.value);
      return a.row.role !== "main" && e ? `${e} per hour` : "";
    }), ie = i(() => v.value.length ? z.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: v.value.filter((t) => t.state === e || e === "started" && t.state === "testing" || e === "completed" && t.state === "cancelled") })) : []), ee = /* @__PURE__ */ new Set(["completed"]), $ = m({}), T = (e) => !($.value[e] ?? ee.has(e)), U = (e) => $.value = { ...$.value, [e]: T(e) }, f = be(), A = m(f.tabs[0]);
    oe(() => a.open, (e) => {
      e && (A.value = f.tabs[0]);
    });
    const te = Object.fromEntries(f.tabs.filter((e) => e.component).map((e) => [e.key, $e(() => Ee(e.component))])), O = i(() => a.row.role === "helper" && !a.row.ended_at), I = () => f.run(["helper", "stop", String(a.row.id)]), ae = i(() => a.row.access === "read-only" || a.row.role === "subagent" || a.row.role === "reviewer"), K = m(!1), L = m(""), G = m(""), V = i(() => a.row.role !== "main" && (!a.row.ended_at || q.value || a.waitReason));
    async function l() {
      if (!V.value) return;
      const e = await f.read(`usage tool --agent ${a.row.id}`);
      L.value = e.ok ? e.value.tool : "", G.value = e.ok ? e.value.note : "";
    }
    const s = f.follow(["hook_call.*", "process_part.*"], l);
    return ye(() => s == null ? void 0 : s()), l(), (e, t) => {
      var k, w, h;
      return o(), r("div", {
        class: se(["agent-card", { open: n.open }]),
        "data-agent-open": n.row.id,
        "aria-expanded": n.open,
        role: n.open ? void 0 : "button",
        tabindex: n.open ? void 0 : 0,
        title: n.row.session,
        onClick: t[4] || (t[4] = (y) => !n.open && u("toggle")),
        onKeydown: [
          t[5] || (t[5] = ve(M((y) => !n.open && u("toggle"), ["self", "prevent"]), ["enter"])),
          t[6] || (t[6] = ve(M((y) => !n.open && u("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        p("span", Qe, [
          n.open ? (o(), r("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: t[0] || (t[0] = M((y) => u("toggle"), ["stop"]))
          }, [
            b(c(de), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : d("", !0),
          p("span", {
            class: "agent-dot",
            "data-state": P.value,
            "data-agent-motion": ""
          }, null, 8, Xe),
          p("span", Ze, g(re.value), 1),
          p("span", et, g(((k = n.facts) == null ? void 0 : k.given_name) || n.row.id), 1),
          n.open ? d("", !0) : (o(), _(c(de), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          n.row.ended_at && !q.value ? (o(), _(c(qe), {
            key: 2,
            class: "agent-time",
            at: n.row.ended_at,
            "data-agent-motion": ""
          }, null, 8, ["at"])) : (o(), r("span", tt, g(Q.value), 1))
        ]),
        p("span", at, [
          p("span", nt, g(J.value), 1),
          B.value && !x.value ? (o(), r("span", ot, g(Z.value), 1)) : d("", !0)
        ]),
        x.value ? (o(), r("span", st, [
          p("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: x.value
          }, g(x.value), 9, lt),
          B.value ? (o(), r("span", rt, g(Z.value), 1)) : d("", !0)
        ])) : d("", !0),
        !n.open && (V.value || B.value && H.value) ? (o(), r("span", {
          key: 1,
          class: se(["agent-foot", { "agent-work-start": !x.value }]),
          "data-agent-foot": ""
        }, [
          V.value ? (o(), _(we, {
            key: 0,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: q.value,
            command: L.value,
            note: G.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : d("", !0),
          B.value && H.value ? (o(), r("span", it, g(H.value), 1)) : d("", !0)
        ], 2)) : d("", !0),
        n.open ? (o(), r("div", {
          key: 2,
          class: "agent-more",
          "data-agent-more": "",
          onClick: t[3] || (t[3] = M(() => {
          }, ["stop"]))
        }, [
          F.value ? (o(), r(Y, { key: 0 }, [
            p("span", ut, g(F.value), 1),
            O.value ? (o(), _(c(Be), {
              key: 0,
              kind: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: I
            }, {
              default: R(() => [...t[7] || (t[7] = [
                ue("Stop", -1)
              ])]),
              _: 1
            })) : d("", !0)
          ], 64)) : d("", !0),
          V.value ? (o(), _(we, {
            key: 1,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: q.value,
            command: L.value,
            note: G.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : d("", !0),
          ae.value ? (o(), r("div", ct, [
            (w = n.facts) != null && w.instruction ? (o(), r("div", dt, [
              b(c(he), {
                label: "Instruction",
                open: K.value,
                "data-agent-section": "instruction",
                onToggle: t[1] || (t[1] = (y) => K.value = !K.value)
              }, {
                default: R(() => [
                  p("div", gt, g(n.facts.instruction), 1)
                ]),
                _: 1
              }, 8, ["open"])
            ])) : d("", !0),
            b(fe, {
              line: `agent transcript ${n.row.id}`,
              agent: O.value ? n.row.id : null,
              helper: O.value,
              padding: "0"
            }, null, 8, ["line", "agent", "helper"])
          ])) : (o(), r(Y, { key: 3 }, [
            b(c(Oe), {
              class: "agent-tabs",
              active: A.value,
              answer: { tasks: v.value.length },
              onChoose: t[2] || (t[2] = (y) => A.value = y)
            }, null, 8, ["active", "answer"]),
            b(c(Ie), {
              class: "agent-tab-body",
              tab: A.value,
              "data-agent-tab-body": (h = A.value) == null ? void 0 : h.key
            }, {
              default: R(() => {
                var y;
                return [
                  b(c(je), {
                    value: (y = A.value) == null ? void 0 : y.key
                  }, Se({
                    tasks: R(() => {
                      var S;
                      return [
                        v.value.length ? d("", !0) : (o(), _(c(Ne), {
                          key: 0,
                          title: "No tasks"
                        }, {
                          default: R(() => [...t[8] || (t[8] = [
                            ue("No tasks have been assigned to this agent.", -1)
                          ])]),
                          _: 1
                        })),
                        (o(!0), r(Y, null, ce(ie.value, (j) => (o(), _(Ye, {
                          key: j.state,
                          section: j,
                          open: T(j.state),
                          onToggle: (ge) => U(j.state)
                        }, null, 8, ["section", "open", "onToggle"]))), 128)),
                        (S = n.facts) != null && S.instruction ? (o(), r(Y, { key: 1 }, [
                          t[9] || (t[9] = p("p", { class: "agent-label" }, "Instruction", -1)),
                          p("div", vt, g(n.facts.instruction), 1)
                        ], 64)) : d("", !0)
                      ];
                    }),
                    transcript: R(() => [
                      b(fe, {
                        line: `agent transcript ${n.row.id}`,
                        agent: n.row.id,
                        padding: "0"
                      }, null, 8, ["line", "agent"])
                    ]),
                    _: 2
                  }, [
                    ce(c(te), (S, j) => ({
                      name: j,
                      fn: R(() => [
                        (o(), _(Ce(S), {
                          agent: n.row.id
                        }, null, 8, ["agent"]))
                      ])
                    }))
                  ]), 1032, ["value"])
                ];
              }),
              _: 1
            }, 8, ["tab", "data-agent-tab-body"])
          ], 64))
        ])) : d("", !0)
      ], 42, Je);
    };
  }
}, mt = /* @__PURE__ */ le(pt, [["__scopeId", "data-v-84063640"]]), ft = ["data-agent-row"], ne = "cubic-bezier(0.2, 0.9, 0.25, 1)", wt = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(n) {
    const W = [
      { key: "running", label: "Running" },
      { key: "idle", label: "Idle" },
      { key: "retired", label: "Retired" },
      { key: "all", label: "All" }
    ], C = n, { rows: z } = He("usage agents --closed", ["agent.*", "task.*"]), { rows: a } = me("waits"), { rows: u } = me("progress"), D = (l) => u.value.find((s) => s.agent_id === l.id) ?? null, re = (l) => {
      var s;
      return ((s = a.value.find((e) => e.agent_id === l.id)) == null ? void 0 : s.reason) ?? "";
    }, v = m("running"), E = m(""), x = be(), J = m([]), Q = m(""), X = m(!1), q = m(!1), P = m(25);
    let F = 0;
    async function N() {
      const l = ++F, s = await x.read(`${C.line} --show ${v.value} --search ${JSON.stringify(E.value)} --limit ${P.value}`);
      l === F && (J.value = s.ok ? s.value.rows : [], Q.value = s.ok ? "" : s.error, q.value = s.ok && s.value.page * s.value.size < s.value.total, X.value = !0);
    }
    async function B() {
      return P.value += 25, await N(), !0;
    }
    oe([v, E], () => {
      P.value = 25, N();
    }), x.follow(["agent.*", "task.*", ...x.sources.flatMap((l) => l.events)], N), N();
    const Z = (l) => z.value.find((s) => s.id === l.id) ?? null, H = J, ie = i(() => !!E.value.trim()), ee = i(() => C.texts[v.value] ?? { title: C.empty, hint: "" }), $ = m(null), T = m(null), U = m(null), f = i(() => H.value.find((l) => l.id === $.value) ?? null), A = i(() => f.value ? [f.value] : H.value), te = i(() => H.value.length - A.value.length), O = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let I = !1, ae = 0;
    async function K(l) {
      if (I) return;
      I = !0, ae = U.value.scrollTop;
      const s = T.value.querySelector(`[data-agent-open="${l.id}"]`);
      if (!O()) {
        const w = [...T.value.querySelectorAll(".agent-row")].filter((h) => !h.contains(s));
        await Promise.all(w.map((h) => h.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const e = [...s.querySelectorAll(".agent-head, .agent-line")], t = [...e, ...s.querySelectorAll("[data-agent-motion]")], k = t.map((w) => w.getBoundingClientRect());
      if ($.value = l.id, await pe(), !O()) {
        const w = t.map((h) => h.getBoundingClientRect());
        t.forEach((h, y) => {
          const S = e.indexOf(h.parentElement), j = k[y].left - w[y].left - (S < 0 ? 0 : k[S].left - w[S].left), ge = k[y].top - w[y].top - (S < 0 ? 0 : k[S].top - w[S].top);
          h.animate([{ transform: `translate(${j}px, ${ge}px)` }, { transform: "none" }], { duration: 280, easing: ne });
        }), T.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((h) => {
          h.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: ne, fill: "backwards" });
        });
      }
      I = !1;
    }
    async function L() {
      if (I || !f.value) return;
      I = !0;
      const l = T.value.querySelector(`[data-agent-open="${$.value}"]`), s = [...l.children, ...T.value.querySelectorAll(".agents-held")], e = O() ? [] : s.map((t) => t.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(e.map((t) => t.finished)), $.value = null, await pe(), U.value.scrollTop = ae, e.forEach((t) => t.cancel()), O() || (l.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: ne }), T.value.querySelectorAll(".agent-row").forEach((t) => {
        t.contains(l) || t.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: ne });
      })), I = !1;
    }
    const G = (l) => $.value === l.id ? L() : K(l);
    oe(E, (l) => l.trim() && ($.value = null)), oe(v, () => {
      $.value = null;
    });
    const V = (l) => {
      l.key === "Escape" && L();
    };
    return window.addEventListener("keydown", V), ye(() => window.removeEventListener("keydown", V)), (l, s) => (o(), r("div", {
      ref_key: "agents",
      ref: T,
      class: se(["agents", { focused: f.value }])
    }, [
      b(c(Le), {
        modelValue: E.value,
        "onUpdate:modelValue": s[1] || (s[1] = (e) => E.value = e),
        placeholder: "Search agents",
        "data-agents-search": ""
      }, {
        default: R(() => [
          b(c(Ve), {
            options: W,
            value: v.value,
            onPick: s[0] || (s[0] = (e) => v.value = e)
          }, null, 8, ["value"])
        ]),
        _: 1
      }, 8, ["modelValue"]),
      p("div", {
        ref_key: "list",
        ref: U,
        class: se(["agents-view", { "agents-view-open": f.value }])
      }, [
        b(c(We), {
          rows: A.value,
          failure: Q.value,
          loaded: X.value,
          more: !f.value && q.value,
          older: B,
          empty: ee.value.title,
          hint: ee.value.hint,
          searching: ie.value
        }, {
          default: R(({ row: e }) => [
            p("div", {
              class: "agent-row",
              "data-agent-row": e.id
            }, [
              b(mt, {
                row: e,
                facts: Z(e),
                progress: D(e),
                "wait-reason": re(e),
                open: e.id === $.value,
                onToggle: (t) => G(e)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, ft)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"])
      ], 2),
      f.value && te.value ? (o(), r("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: L
      }, g(te.value) + " more", 1)) : d("", !0)
    ], 2));
  }
}, bt = /* @__PURE__ */ le(wt, [["__scopeId", "data-v-e1ce2121"]]);
export {
  bt as A
};
