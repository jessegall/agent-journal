import { openBlock as n, createElementBlock as s, withModifiers as ee, unref as r, createTextVNode as m, toDisplayString as v, createVNode as h, createBlock as D, withCtx as b, Fragment as P, renderList as ne, createElementVNode as A, createCommentVNode as k, computed as i, ref as H, watch as de, onUnmounted as be, defineAsyncComponent as _e, createSlots as et, resolveDynamicComponent as tt, normalizeClass as le, normalizeStyle as Ae, renderSlot as ye, onMounted as at, Teleport as nt, mergeProps as ot, toRef as je, withKeys as Ee, nextTick as Ne } from "vue";
import { peekRef as we, Icon as Re, RunningCommand as lt, FoldGroup as Ue, TaskStatusIcon as st, useWindow as Te, loadWindowComponent as rt, coalesced as it, READ_RATES as dt, eventMayBeChildOf as ut, InnerTabs as ct, TabBody as gt, SwitchCase as Je, EmptyState as Le, Btn as se, TextArea as vt, TextInput as pt, HoverTip as Ce, TaskBar as ht, useNow as Ge, age as ft, perHour as mt, ago as We, TimeAgo as qe, SearchBar as kt, Segmented as bt, MenuLabel as Be, MenuItem as $e, RowList as yt, toggleFilter as wt } from "@journal/window-kit";
import { _ as X, T as Mt } from "./TranscriptRows-BL93hPr8.js";
const xt = {
  class: "agent-command",
  "data-agent-command": ""
}, $t = {
  key: 1,
  "data-agent-stopped": ""
}, St = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (o, a) => (n(), s("span", xt, [
      e.waitReason ? (n(), s("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: a[0] || (a[0] = ee((l) => r(we)("test_queue:0"), ["stop"]))
      }, [
        m("Waiting: " + v(e.waitReason) + " ", 1),
        h(r(Re), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (n(), s("span", $t, "Waiting")) : (n(), D(r(lt), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, Ct = /* @__PURE__ */ X(St, [["__scopeId", "data-v-1b371fb5"]]), At = ["data-agent-delegated", "onClick"], Tt = { class: "agent-task-number" }, jt = { class: "agent-task-title" }, Bt = ["title"], Rt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const a = o;
    return (l, t) => (n(), D(r(Ue), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: t[0] || (t[0] = (c) => a("toggle"))
    }, {
      default: b(() => [
        (n(!0), s(P, null, ne(e.section.tasks, (c) => (n(), s("button", {
          key: c.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": c.id,
          onClick: (f) => r(we)(`tasks:${c.id}`)
        }, [
          h(r(st), {
            status: c.state
          }, null, 8, ["status"]),
          A("span", Tt, v(c.id), 1),
          A("span", jt, v(c.title), 1),
          c.plan_id ? (n(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${c.plan_id}: ${c.plan_title}`
          }, "Plan " + v(c.plan_id), 9, Bt)) : k("", !0)
        ], 8, At))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Lt = /* @__PURE__ */ X(Rt, [["__scopeId", "data-v-ea4ccd6b"]]), It = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Ot = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Vt = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, zt = ["data-peek", "onClick"], Ht = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Et = {
  key: 0,
  class: "agent-helper-brief"
}, Nt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Wt = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, qt = "It ended without a report", Dt = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const o = e, a = ["started", "blocked", "open", "completed"], l = i(() => {
      var g, y;
      return o.row.ended_at && ((y = (g = o.facts) == null ? void 0 : g.job_returned) != null && y.startsWith(qt)) ? o.facts.job_returned : "";
    }), t = i(() => o.tasks.length ? a.map((g) => ({ state: g, label: g.slice(0, 1).toUpperCase() + g.slice(1), tasks: o.tasks.filter((y) => y.state === g || g === "started" && y.state === "testing" || g === "completed" && y.state === "cancelled") })) : []), c = /* @__PURE__ */ new Set(["completed"]), f = H({}), $ = (g) => !(f.value[g] ?? c.has(g)), M = (g) => f.value = { ...f.value, [g]: $(g) }, L = Te(), { rows: q } = L.props.reports;
    L.state["reports.agent"] = String(o.row.id);
    const E = i(() => o.row.access === "read-only"), N = i(() => !!o.row.retired_at || o.row.state === "retired"), U = ["tasks", "transcript", "terminal", "file-feed", "reports"], T = i(() => (N.value ? L.tabs.filter((y) => ["reports", "transcript"].includes(y.key)) : E.value ? L.tabs.filter((y) => ["reports", "transcript", "terminal"].includes(y.key)) : [...L.tabs]).sort((y, u) => (U.indexOf(y.key) < 0 ? U.length : U.indexOf(y.key)) - (U.indexOf(u.key) < 0 ? U.length : U.indexOf(u.key)))), O = () => E.value || N.value ? T.value.find((g) => g.key === "transcript") : T.value[0], W = H(O());
    de(W, (g) => {
      L.state.tab = (g == null ? void 0 : g.key) ?? "";
    }, { immediate: !0 }), be(() => {
      L.state.tab = "";
    }), de(T, (g) => {
      g.some((y) => {
        var u;
        return y.key === ((u = W.value) == null ? void 0 : u.key);
      }) || (W.value = g[0]);
    }), de(() => o.open, (g) => {
      g && (W.value = O());
    });
    const Z = Object.fromEntries(L.tabs.filter((g) => g.component).map((g) => [g.key, _e(() => rt(g.component))])), J = H(!1), { data: Y } = L.props.tool, C = i(() => {
      var g;
      return ((g = Y.value) == null ? void 0 : g.tool) ?? "";
    }), d = i(() => {
      var g;
      return ((g = Y.value) == null ? void 0 : g.note) ?? "";
    }), F = i(() => o.row.role !== "main" && (!o.row.ended_at || o.stoppedWithWork || o.waitReason));
    async function B() {
      !o.open || !F.value || (L.state["tool.agent"] = String(o.row.id), await L.reload("tool"));
    }
    const j = it(B, dt.agentCommand), V = L.follow(["hook_call.*", "process_part.*"], (g) => ut(g, "session_agent_id", /* @__PURE__ */ new Set([o.row.id])) && j());
    return be(() => V == null ? void 0 : V()), de(() => o.open, (g) => {
      g && B();
    }, { immediate: !0 }), (g, y) => {
      var u;
      return n(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: y[2] || (y[2] = ee(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (n(), s("p", It, "Retirement reason: " + v(e.row.retirement_reason), 1)) : k("", !0),
        e.row.resume_reason ? (n(), s("p", Ot, v(e.row.resume_reason), 1)) : k("", !0),
        F.value ? (n(), D(Ct, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: C.value,
          note: d.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : k("", !0),
        l.value ? (n(), s("p", Vt, v(l.value), 1)) : k("", !0),
        h(r(ct), {
          class: "agent-tabs",
          tabs: T.value,
          active: W.value,
          answer: { tasks: e.tasks.length, reports: r(q).length },
          onChoose: y[0] || (y[0] = (R) => W.value = R)
        }, null, 8, ["tabs", "active", "answer"]),
        h(r(gt), {
          class: "agent-tab-body",
          tab: W.value,
          "data-agent-tab-body": (u = W.value) == null ? void 0 : u.key
        }, {
          default: b(() => {
            var R;
            return [
              h(r(Je), {
                value: (R = W.value) == null ? void 0 : R.key
              }, et({
                reports: b(() => [
                  r(q).length ? k("", !0) : (n(), D(r(Le), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: b(() => [...y[3] || (y[3] = [
                      m("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (n(!0), s(P, null, ne(r(q), (z) => (n(), s("button", {
                    key: z.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${z.id}`,
                    onClick: (Q) => r(we)(`messages:${z.id}`)
                  }, v(z.text), 9, zt))), 128))
                ]),
                tasks: b(() => {
                  var z;
                  return [
                    e.tasks.length ? k("", !0) : (n(), D(r(Le), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: b(() => [...y[4] || (y[4] = [
                        m("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (n(!0), s(P, null, ne(t.value, (Q) => (n(), D(Lt, {
                      key: Q.state,
                      section: Q,
                      open: $(Q.state),
                      onToggle: (p) => M(Q.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (z = e.facts) != null && z.instruction ? (n(), s(P, { key: 1 }, [
                      y[5] || (y[5] = A("p", { class: "agent-label" }, "Instruction", -1)),
                      A("div", Ht, v(e.facts.instruction), 1)
                    ], 64)) : k("", !0)
                  ];
                }),
                transcript: b(() => {
                  var z;
                  return [
                    E.value ? (n(), s(P, { key: 0 }, [
                      (z = e.facts) != null && z.instruction ? (n(), s("div", Et, [
                        h(r(Ue), {
                          label: "Instruction",
                          open: J.value,
                          "data-agent-section": "instruction",
                          onToggle: y[1] || (y[1] = (Q) => J.value = !J.value)
                        }, {
                          default: b(() => [
                            A("div", Nt, v(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (n(), s("p", Wt, "No job recorded")) : k("", !0)
                    ], 64)) : k("", !0),
                    h(Mt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                ne(r(Z), (z, Q) => ({
                  name: Q,
                  fn: b(() => [
                    (n(), D(tt(z), {
                      agent: e.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ];
          }),
          _: 1
        }, 8, ["tab", "data-agent-tab-body"])
      ]);
    };
  }
}, Ft = /* @__PURE__ */ X(Dt, [["__scopeId", "data-v-492142fe"]]), Pt = { class: "action-field" }, Ut = ["value", "disabled"], Jt = ["value"], Gt = { key: 1 }, Kt = {
  key: 1,
  class: "action-field"
}, Zt = { class: "action-buttons" }, Yt = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (o, a) => (n(), s("form", {
      onSubmit: a[4] || (a[4] = ee((l) => o.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (n(), s(P, { key: 0 }, [
        A("label", Pt, [
          a[6] || (a[6] = m("Task ", -1)),
          A("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: a[0] || (a[0] = (l) => o.$emit("update:task", l.target.value))
          }, [
            a[5] || (a[5] = A("option", { value: "" }, "Choose an open task", -1)),
            (n(!0), s(P, null, ne(e.tasks, (l) => (n(), s("option", {
              key: l.id,
              value: String(l.id)
            }, v(l.id) + ": " + v(l.title), 9, Jt))), 128))
          ], 40, Ut)
        ]),
        e.moreTasks ? (n(), D(r(se), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: a[1] || (a[1] = (l) => o.$emit("more"))
        }, {
          default: b(() => [...a[7] || (a[7] = [
            m("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : k("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (n(), s("p", Gt, "No open tasks.")) : k("", !0)
      ], 64)) : (n(), s("label", Kt, [
        a[8] || (a[8] = m("Job", -1)),
        h(r(vt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: a[2] || (a[2] = (l) => o.$emit("update:text", l.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      A("div", Zt, [
        h(r(se), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: b(() => [...a[9] || (a[9] = [
            m("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        h(r(se), {
          small: "",
          disabled: e.pending,
          onClick: a[3] || (a[3] = (l) => o.$emit("cancel"))
        }, {
          default: b(() => [...a[10] || (a[10] = [
            m("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Qt = /* @__PURE__ */ X(Yt, [["__scopeId", "data-v-adde4158"]]), Xt = { class: "action-buttons" }, _t = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (o, a) => (n(), s("form", {
      "data-agent-retire-confirm": "",
      onSubmit: a[2] || (a[2] = ee((l) => o.$emit("submit"), ["prevent"]))
    }, [
      a[5] || (a[5] = A("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      h(r(pt), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": a[0] || (a[0] = (l) => o.$emit("update:reason", l))
      }, null, 8, ["model-value", "disabled"]),
      A("div", Xt, [
        h(r(se), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: b(() => [...a[3] || (a[3] = [
            m("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        h(r(se), {
          small: "",
          disabled: e.pending,
          onClick: a[1] || (a[1] = (l) => o.$emit("cancel"))
        }, {
          default: b(() => [...a[4] || (a[4] = [
            m("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ea = /* @__PURE__ */ X(_t, [["__scopeId", "data-v-23a905c0"]]), ta = { class: "action-buttons" }, aa = {
  key: 0,
  role: "alert"
}, na = {
  key: 1,
  role: "status"
}, oa = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const o = e, a = Te(), l = H(""), t = H(""), c = H(""), f = H(""), $ = H([]), M = H(0), L = H(!1), q = H(!1), E = H(!1), N = H(""), U = H(""), T = i(() => !!o.row.retired_at || o.row.state === "retired"), O = i(() => !T.value && !!o.row.ended_at), W = i(() => {
      var j;
      return O.value && ((j = o.row.job_command) == null ? void 0 : j.length) && !o.row.resume_reason;
    }), Z = i(() => W.value && !q.value && (o.row.job_task_flag ? $.value.some((j) => String(j.id) === f.value) : !!t.value.trim()));
    function J(j) {
      l.value = j, t.value = "", c.value = "", f.value = "", N.value = "", U.value = "";
    }
    async function Y() {
      J("job"), o.row.job_task_flag && ($.value = [], M.value = 0, L.value = !1, await C());
    }
    async function C() {
      if (!q.value) {
        q.value = !0;
        try {
          a.state["jobs.page"] = String(M.value + 1), await a.reload("jobs");
          const j = a.props.jobs;
          N.value = j.failure.value, N.value || ($.value = [...$.value, ...j.rows.value], M.value = j.data.value.page, L.value = j.more.value);
        } finally {
          q.value = !1;
        }
      }
    }
    async function d(j, V) {
      if (!E.value) {
        E.value = !0, N.value = "";
        try {
          const g = await a.run(j);
          N.value = g.ok ? "" : g.error, g.ok && (J(""), U.value = V);
        } finally {
          E.value = !1;
        }
      }
    }
    async function F() {
      if (!Z.value) return;
      const j = o.row.job_task_flag ? [o.row.job_task_flag, f.value] : [t.value.trim()];
      await d([...o.row.job_command, String(o.row.id), ...j], "Job sent.");
    }
    async function B() {
      !O.value || l.value !== "retire" || !c.value.trim() || await d(["agent", "retire", String(o.row.id), "--reason", c.value.trim()], "Agent retired permanently.");
    }
    return (j, V) => {
      var g;
      return T.value ? k("", !0) : (n(), s("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: V[6] || (V[6] = ee(() => {
        }, ["stop"])),
        onKeydown: V[7] || (V[7] = ee(() => {
        }, ["stop"]))
      }, [
        A("div", ta, [
          O.value ? (n(), s(P, { key: 0 }, [
            (g = e.row.job_command) != null && g.length ? (n(), D(r(se), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: E.value || q.value || !W.value,
              onClick: Y
            }, {
              default: b(() => [...V[8] || (V[8] = [
                m("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0),
            e.row.role !== "main" ? (n(), D(r(se), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: E.value || q.value,
              onClick: V[0] || (V[0] = (y) => J("retire"))
            }, {
              default: b(() => [...V[9] || (V[9] = [
                m("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0)
          ], 64)) : k("", !0)
        ]),
        h(r(Je), { value: l.value }, {
          job: b(() => [
            h(Qt, {
              task: f.value,
              "onUpdate:task": V[1] || (V[1] = (y) => f.value = y),
              text: t.value,
              "onUpdate:text": V[2] || (V[2] = (y) => t.value = y),
              row: e.row,
              tasks: $.value,
              pending: E.value,
              loading: q.value,
              "more-tasks": L.value,
              failure: N.value,
              "job-ready": Z.value,
              onSubmit: F,
              onMore: C,
              onCancel: V[3] || (V[3] = (y) => J(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: b(() => [
            h(ea, {
              reason: c.value,
              "onUpdate:reason": V[4] || (V[4] = (y) => c.value = y),
              pending: E.value,
              onSubmit: B,
              onCancel: V[5] || (V[5] = (y) => J(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        N.value ? (n(), s("p", aa, v(N.value), 1)) : k("", !0),
        U.value ? (n(), s("p", na, v(U.value), 1)) : k("", !0)
      ], 32));
    };
  }
}, la = /* @__PURE__ */ X(oa, [["__scopeId", "data-v-4cb32275"]]), sa = { class: "line" }, ra = {
  key: 0,
  class: "line",
  "data-agent-since": ""
}, ia = {
  key: 1,
  class: "line",
  "data-agent-seen": ""
}, da = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" }, seen: { type: String, default: "" } },
  setup(e) {
    const o = /* @__PURE__ */ new Set(["running", "working", "thinking"]), a = e, l = i(() => o.has(a.state)), t = i(() => [a.doing, a.since, a.seen].filter(Boolean).join(". "));
    return (c, f) => (n(), D(r(Ce), {
      as: "button",
      place: "corner",
      class: le(["agent-dot", { pulse: l.value }]),
      "data-state": e.state,
      "aria-label": t.value,
      "data-agent-status": "",
      onClick: f[0] || (f[0] = ee(() => {
      }, ["stop"]))
    }, {
      tip: b(() => [
        A("b", sa, v(e.doing), 1),
        e.since ? (n(), s("span", ra, v(e.since), 1)) : k("", !0),
        e.seen ? (n(), s("span", ia, v(e.seen), 1)) : k("", !0)
      ]),
      default: b(() => [
        f[1] || (f[1] = A("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, ua = /* @__PURE__ */ X(da, [["__scopeId", "data-v-1a0bc478"]]), ca = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, ga = (e) => e.filter((o) => o.state !== "cancelled"), De = (e, o) => e.filter((a) => a.state === o).length;
function va({ tasks: e, inHand: o, perHour: a }) {
  const l = ga(e), t = De(l, "completed"), c = ca[o == null ? void 0 : o.state], f = l.length - t - (o && o.state !== "completed" ? 1 : 0), $ = t === l.length;
  return {
    number: o.id,
    title: o.title,
    count: `${t} of ${l.length}`,
    taskTip: `${t} of its ${l.length} tasks done${c ? `. This one is ${c.words}.` : "."}`,
    countTip: $ ? `All ${l.length} tasks done` : `${t} done, 1 in hand, ${f} to go`,
    paceTip: !$ && a ? `About ${a} an hour.` : "",
    rate: !$ && a ? `${Math.round(a)}/hour` : "",
    bar: { total: l.length, done: t, testing: De(l, "testing") }
  };
}
const pa = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, ha = {
  class: "task-line",
  "data-agent-task-line": ""
}, fa = {
  key: 0,
  class: "rate",
  "data-agent-rate": ""
}, ma = { key: 0 }, ka = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, perHour: { type: Number, default: 0 } },
  setup(e) {
    const o = e, a = i(() => o.inHand ? va({ tasks: o.tasks, inHand: o.inHand, perHour: o.perHour }) : null);
    return (l, t) => e.job && !a.value ? (n(), s("span", pa, [
      h(r(Ce), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: b(() => [
          A("b", null, v(e.job), 1)
        ]),
        default: b(() => [
          t[1] || (t[1] = m("Job", -1))
        ]),
        _: 1
      })
    ])) : a.value ? (n(), s(P, { key: 1 }, [
      A("span", ha, [
        h(r(Ce), {
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${a.value.number}`,
          "aria-label": `Task ${a.value.number}: ${a.value.title}`,
          onClick: t[0] || (t[0] = ee((c) => r(we)(`tasks:${a.value.number}`), ["stop"]))
        }, {
          tip: b(() => [
            A("b", null, v(a.value.title), 1),
            A("span", null, v(a.value.taskTip), 1)
          ]),
          default: b(() => [
            m("Task " + v(a.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"]),
        a.value.rate ? (n(), s("span", fa, v(a.value.rate), 1)) : k("", !0),
        h(r(Ce), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: b(() => [
            A("b", null, v(a.value.countTip), 1),
            a.value.paceTip ? (n(), s("span", ma, v(a.value.paceTip), 1)) : k("", !0)
          ]),
          default: b(() => [
            m(v(a.value.count), 1)
          ]),
          _: 1
        })
      ]),
      h(r(ht), {
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: a.value.bar.total,
        done: a.value.bar.done,
        testing: a.value.bar.testing
      }, null, 8, ["total", "done", "testing"])
    ], 64)) : k("", !0);
  }
}, ba = /* @__PURE__ */ X(ka, [["__scopeId", "data-v-44505a93"]]), ya = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', wa = ["data-icon", "stroke-width", "innerHTML"], _ = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const o = e, a = { right: 0, down: 90, left: 180, up: 270 }, l = {
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
    }, t = {
      agent: ya,
      time: '<circle cx="8" cy="8" r="5.5"/><path d="M8 4.5V8l2.4 1.5"/>',
      allowance: '<path d="M3 4.5h10v7H3zM5 6.5h1M10 9.5h1"/><circle cx="8" cy="8" r="1.4"/>',
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
      scheme: '<circle cx="8" cy="8" r="5.75"/><path d="M8 2.25a5.75 5.75 0 0 1 0 11.5z" fill="currentColor" stroke="none"/>',
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
    return (c, f) => (n(), s("svg", {
      class: "ico",
      "data-icon": e.name,
      style: Ae({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...o.facing === "right" ? {} : { transform: `rotate(${a[o.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: t[l[e.name] || e.name] || t.dot
    }, null, 12, wa));
  }
}, Ma = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, xa = {
  key: 1,
  class: "menu-item-text"
}, $a = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (o, a) => (n(), s("button", {
      type: "button",
      class: le(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (n(), s("span", Ma, v(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (n(), s("span", xa, [
        A("span", null, [
          ye(o.$slots, "default", {}, void 0, !0)
        ]),
        A("small", null, v(e.description), 1)
      ])) : ye(o.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, me = /* @__PURE__ */ X($a, [["__scopeId", "data-v-fec99974"]]), Sa = {}, Ca = { class: "menu-label" };
function Aa(e, o) {
  return n(), s("span", Ca, [
    ye(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ke = /* @__PURE__ */ X(Sa, [["render", Aa], ["__scopeId", "data-v-aa955b3e"]]), Ta = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, ja = {
  key: 0,
  class: "skills-none"
}, Ba = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: o }) {
    const a = e, l = o, t = i(() => a.skills.filter((f) => f.state === "loaded")), c = i(() => a.skills.filter((f) => f.state !== "loaded"));
    return (f, $) => (n(), s("div", Ta, [
      h(ke, null, {
        default: b(() => [...$[1] || ($[1] = [
          m("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      t.value.length ? k("", !0) : (n(), s("p", ja, "None yet. Compacting the conversation empties this list.")),
      (n(!0), s(P, null, ne(t.value, (M) => (n(), s("p", {
        key: M.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        h(_, {
          name: "book",
          size: 12
        }),
        m(v(M.skill), 1)
      ]))), 128)),
      c.value.length ? (n(), s(P, { key: 1 }, [
        h(ke, null, {
          default: b(() => [...$[2] || ($[2] = [
            m("Still to read", -1)
          ])]),
          _: 1
        }),
        (n(!0), s(P, null, ne(c.value, (M) => (n(), s("p", {
          key: M.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          h(_, {
            name: "book",
            size: 12
          }),
          m(v(M.skill), 1)
        ]))), 128))
      ], 64)) : k("", !0),
      h(me, {
        "data-agent-skills-browse": "",
        onClick: $[0] || ($[0] = (M) => l("browse"))
      }, {
        default: b(() => [...$[3] || ($[3] = [
          m("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Ra = /* @__PURE__ */ X(Ba, [["__scopeId", "data-v-be514d47"]]), La = ["disabled", "title"], Ia = { class: "gauge usage" }, Oa = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: o }) {
    const a = e, l = o, t = i(() => a.windows[0] ?? null), c = i(() => t.value && Number.isFinite(t.value.used_percent) ? Math.max(0, Math.min(100, Math.round(t.value.used_percent))) : null), f = i(() => c.value !== null && c.value >= 100), $ = i(() => {
      var L;
      return (L = t.value) != null && L.reset_epoch_seconds ? new Date(t.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), M = i(() => f.value ? `At usage limit: the plan's ${t.value.title} allowance is used up${$.value ? `, starts again ${$.value}` : ""}` : `${c.value}% of the plan's ${t.value.title} allowance used${$.value ? `, starts again ${$.value}` : ""}`);
    return (L, q) => c.value !== null ? (n(), s("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: M.value,
      onClick: q[0] || (q[0] = (E) => l("open", E.currentTarget))
    }, [
      h(_, {
        name: "allowance",
        size: 12
      }),
      q[1] || (q[1] = m()),
      A("span", Ia, [
        A("span", {
          style: Ae({ width: `${c.value}%` })
        }, null, 4)
      ]),
      m(" " + v(f.value ? "At usage limit" : `${c.value}%`), 1)
    ], 8, La)) : k("", !0);
  }
}, Va = /* @__PURE__ */ X(Oa, [["__scopeId", "data-v-a36f09dc"]]), za = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (o, a) => (n(), s("span", {
      class: le(["badge", e.tone])
    }, v(e.text), 3));
  }
}, Ha = /* @__PURE__ */ X(za, [["__scopeId", "data-v-9e7e1157"]]), Ea = (e, o, a) => Math.max(o, Math.min(a, e)), Ke = /* @__PURE__ */ new WeakMap(), Na = (e, o) => Ke.set(e, o);
function Wa(e, o) {
  for (let a = o; a; a = Ke.get(a) ?? a.parentElement) if (a === e) return !0;
  return !1;
}
function qa(e, o) {
  const a = (l) => {
    var c, f;
    const t = ((c = e.value) == null ? void 0 : c.element) || ((f = e.value) == null ? void 0 : f.$el) || e.value;
    t && !Wa(t, l.target) && o(l);
  };
  window.addEventListener("click", a), be(() => window.removeEventListener("click", a));
}
const fe = 8, Da = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: o, emit: a }) {
    const l = e, t = H(null), c = (u) => u ? `${u}px` : void 0, f = i(() => ({
      minWidth: c(l.minWidth),
      maxWidth: c(l.maxWidth),
      maxHeight: c(l.maxHeight),
      height: c(l.height)
    })), $ = H({ w: 0, h: 0 }), M = H(l.anchor ? l.anchor.getBoundingClientRect() : null), L = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), q = (u) => ({
      left: Math.max(0, u.left),
      top: Math.max(0, u.top),
      right: Math.min(window.innerWidth, u.right),
      bottom: Math.min(window.innerHeight, u.bottom)
    }), E = (u) => {
      const R = u.closest(".pane, .float-window");
      return R ? q(R.getBoundingClientRect()) : L();
    }, N = (u, R) => `${Math.max(0, u ? Math.min(u, R) : R)}px`;
    function U(u, R) {
      return {
        below: u.bottom - R.bottom - l.gap - fe,
        above: R.top - u.top - l.gap - fe,
        across: u.right - u.left - 2 * fe
      };
    }
    function T(u) {
      const R = E(l.anchor), z = U(R, u);
      return $.value.w <= z.across && $.value.h <= Math.max(z.below, z.above) ? R : L();
    }
    const O = i(() => {
      if (!M.value) return f.value;
      const u = M.value, R = T(u), z = U(R, u), { w: Q, h: p } = $.value, S = l.align === "auto" ? u.left + u.right > R.left + R.right : l.align === "right", te = Ea(S ? u.right - Q : u.left, R.left + fe, Math.max(R.left + fe, R.right - Q - fe)), K = p > z.below && z.above > z.below ? { bottom: `${window.innerHeight - u.top + l.gap}px`, maxHeight: N(l.maxHeight, z.above) } : { top: `${u.bottom + l.gap}px`, maxHeight: N(l.maxHeight, z.below) };
      return { ...f.value, ...K, left: `${te}px`, maxWidth: N(l.maxWidth, z.across) };
    }), W = a, Z = () => [...t.value.querySelectorAll("button:not(:disabled)")];
    function J(u) {
      const R = Z(), z = R.indexOf(document.activeElement);
      R[(z + u + R.length) % R.length].focus();
    }
    const Y = { ArrowDown: () => J(1), ArrowUp: () => J(-1), Escape: () => W("close") }, C = (u) => Y[u.key] && (u.preventDefault(), Y[u.key]()), d = () => t.value && ($.value = { w: t.value.offsetWidth, h: t.value.scrollHeight });
    let F = 0;
    const B = new ResizeObserver(() => {
      cancelAnimationFrame(F), F = requestAnimationFrame(d);
    });
    qa(t, (u) => l.anchor && !l.anchor.contains(u.target) && W("close"));
    const j = (u, R) => ["top", "left", "right", "bottom"].some((z) => Math.abs(u[z] - R[z]) > 1), V = (u) => u.bottom < 0 || u.top > window.innerHeight;
    let g = 0;
    function y() {
      if (l.anchor) {
        const u = l.anchor.getBoundingClientRect();
        if (!l.anchor.isConnected || V(u)) return W("close");
        j(u, M.value) && (M.value = u);
      }
      g = requestAnimationFrame(y);
    }
    return at(() => {
      l.anchor && t.value && Na(t.value, l.anchor), d(), t.value && B.observe(t.value), !l.plain && Z()[0] && Z()[0].focus(), y();
    }), be(() => {
      B.disconnect(), cancelAnimationFrame(g), cancelAnimationFrame(F);
    }), o({ element: t }), (u, R) => (n(), D(nt, {
      to: "body",
      disabled: !e.anchor
    }, [
      A("div", ot({
        ref_key: "panel",
        ref: t
      }, u.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: O.value,
        onKeydown: C
      }), [
        ye(u.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Fa = /* @__PURE__ */ X(Da, [["__scopeId", "data-v-3d203970"]]);
async function Pa(e, o, a) {
  if (!e) return a(o);
  const { target: l, fields: t } = e, c = Object.fromEntries(Object.keys(t).map((M) => [M, l[M]])), f = () => Object.assign(l, c);
  Object.assign(l, t);
  let $ = !1;
  try {
    const M = await a(o);
    return $ = M.ok, M;
  } finally {
    $ || f();
  }
}
function Ua(e, o, a, { groups: l, programs: t }) {
  const c = H({}), f = H(""), $ = H(!1), M = i(() => !!e.value && !e.value.ended_at), L = i(() => M.value && !!e.value.paused_at);
  async function q(T, O = null) {
    f.value = "";
    const W = await Pa(O, T, o);
    return f.value = W.ok ? "" : W.error, a(), W;
  }
  return { groups: l, programs: t, chosen: c, failure: f, asking: $, running: M, paused: L, choose: (T, O) => q(["agent", "control", String(e.value.id), T, O.value], { target: c, fields: { value: { ...c.value, [T]: O.label } } }), stop: () => ($.value = !1, q(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (T) => q(["agent", "launch", T.name]) };
}
function Ja(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const Ga = ["disabled", "title"], Ka = ["disabled", "title"], Za = { class: "gauge" }, Ya = ["disabled", "title"], Qa = ["disabled"], Xa = ["disabled"], _a = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, en = ["title"], tn = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, an = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, nn = { class: "gauge" }, on = { class: "context-used" }, ln = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, sn = 75, rn = {
  __name: "InformationBar",
  props: {
    agent: { type: Object, default: null },
    card: Boolean,
    controlGroups: { type: Array, default: () => [] },
    agentPrograms: { type: Array, default: () => [] },
    skills: { type: Array, default: () => [] },
    loading: Boolean,
    jobs: { type: Number, default: 0 },
    usage: { type: Object, default: () => ({ agents: [], windows: [] }) },
    branch: { type: String, default: "" },
    fitness: { type: Object, default: null },
    run: { type: Function, default: null }
  },
  emits: ["open", "changed", "skills"],
  setup(e, { emit: o }) {
    const a = e, l = o, t = Ua(je(a, "agent"), a.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => l("changed"), { groups: je(a, "controlGroups"), programs: je(a, "agentPrograms") }), c = H(null), f = H(""), $ = i(() => t.groups.value.find((C) => C.key === f.value));
    function M(C, d) {
      c.value = C.currentTarget, f.value = d;
    }
    function L() {
      c.value = null, f.value = "", t.asking.value = !1;
    }
    const q = i(() => a.skills.filter((C) => C.state === "loaded"));
    function E(C) {
      M(C, "skills"), l("skills");
    }
    const N = (C) => t.groups.value.some((d) => d.key === C), U = i(() => {
      var C;
      return t.chosen.value.model ?? ((C = O.value) == null ? void 0 : C.model) ?? "";
    }), T = i(() => {
      var C;
      return t.chosen.value.effort ?? ((C = O.value) == null ? void 0 : C.effort) ?? "";
    });
    i(() => !!a.agent && !a.agent.ended_at);
    const O = i(() => {
      var C;
      return ((C = a.usage.agents) == null ? void 0 : C.find((d) => {
        var F;
        return d.id === ((F = a.agent) == null ? void 0 : F.id);
      })) ?? null;
    }), W = i(() => {
      var C;
      return ((C = O.value) == null ? void 0 : C.context_percent) == null ? null : Math.round(O.value.context_percent);
    }), Z = (C) => `${Math.round(C / 1e3)}k`, J = i(() => {
      var C;
      return (C = O.value) != null && C.context_limit_tokens ? `${Z(O.value.context_tokens ?? 0)} of ${Z(O.value.context_limit_tokens)}` : "";
    }), Y = i(() => {
      var C;
      return (C = O.value) != null && C.cost_dollars ? `$${O.value.cost_dollars.toFixed(2)}` : "";
    });
    return (C, d) => {
      var F;
      return n(), s("div", {
        class: le(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (n(), s(P, { key: 0 }, [
          A("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: d[0] || (d[0] = (B) => M(B, "agent"))
          }, [
            h(_, {
              name: "agents",
              size: 12
            }),
            m(" " + v(((F = e.agentPrograms.find((B) => B.name === e.agent.program)) == null ? void 0 : F.title) || e.agent.program), 1)
          ], 8, Ga),
          h(Va, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: d[1] || (d[1] = (B) => l("open", "usage", B))
          }, null, 8, ["windows", "disabled"]),
          W.value !== null ? (n(), s("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${W.value}% full: clear or compact it`,
            onClick: d[2] || (d[2] = (B) => N("context") ? M(B, "context") : l("open", "context", B.currentTarget))
          }, [
            h(_, {
              name: "gauge",
              size: 12
            }),
            d[14] || (d[14] = m()),
            A("span", Za, [
              A("span", {
                style: Ae({ width: `${W.value}%` })
              }, null, 4)
            ]),
            m(" " + v(W.value) + "% ", 1)
          ], 8, Ka)) : k("", !0),
          U.value ? (n(), s("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${U.value}: change the model`,
            onClick: d[3] || (d[3] = (B) => N("model") ? M(B, "model") : null)
          }, [
            h(_, {
              name: "model",
              size: 12
            }),
            m(" " + v(U.value), 1)
          ], 8, Ya)) : k("", !0),
          N("effort") || e.card && T.value ? (n(), s("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: d[4] || (d[4] = (B) => M(B, "effort"))
          }, [
            h(_, {
              name: "bolt",
              size: 12
            }),
            m(" " + v(T.value), 1)
          ], 8, Qa)) : k("", !0),
          Y.value ? (n(), s("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: d[5] || (d[5] = (B) => l("open", "cost", B.currentTarget))
          }, v(Y.value), 9, Xa)) : k("", !0),
          e.branch ? (n(), s("span", _a, [
            h(_, {
              name: "branch",
              size: 12
            }),
            m(" " + v(e.branch), 1)
          ])) : k("", !0),
          e.card ? k("", !0) : (n(), s("button", {
            key: 5,
            type: "button",
            class: le(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: d[6] || (d[6] = (B) => l("open", "jobs", B.currentTarget))
          }, [
            h(_, {
              name: "clock",
              size: 12
            }),
            m(" " + v(e.jobs), 1)
          ], 2)),
          e.run ? (n(), s("button", {
            key: 6,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: E
          }, [
            h(_, {
              name: "book",
              size: 12
            }),
            m(" " + v(q.value.length), 1)
          ])) : k("", !0),
          e.fitness ? (n(), s(P, { key: 7 }, [
            A("button", {
              type: "button",
              class: le(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < sn }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: d[7] || (d[7] = (B) => l("open", "fitness", B.currentTarget))
            }, [
              h(_, {
                name: "heart",
                size: 12
              }),
              m(" " + v(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            A("button", {
              type: "button",
              class: le(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: d[8] || (d[8] = (B) => l("open", "load", B.currentTarget))
            }, [
              h(_, {
                name: "weight",
                size: 12
              }),
              m(" " + v(e.fitness.workload), 1)
            ], 2)
          ], 64)) : k("", !0)
        ], 64)) : e.run && !e.loading ? (n(), s("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: d[9] || (d[9] = (B) => M(B, "start"))
        }, [
          h(_, {
            name: "agents",
            size: 12
          }),
          d[15] || (d[15] = m(" Start an agent", -1))
        ])) : k("", !0),
        d[21] || (d[21] = A("span", { class: "space" }, null, -1)),
        r(t).failure.value ? (n(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: r(t).failure.value
        }, v(r(t).failure.value), 9, en)) : k("", !0),
        ye(C.$slots, "default", {}, void 0, !0),
        c.value ? (n(), D(Fa, {
          key: 3,
          anchor: c.value,
          "min-width": 190,
          onClose: L
        }, {
          default: b(() => {
            var B;
            return [
              f.value === "agent" ? (n(), s(P, { key: 0 }, [
                r(t).asking.value ? (n(), s(P, { key: 0 }, [
                  h(ke, { "data-agent-stop-ask": "" }, {
                    default: b(() => [...d[16] || (d[16] = [
                      m("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  h(me, {
                    "data-agent-stop-confirm": "",
                    onClick: d[10] || (d[10] = (j) => (L(), r(t).stop()))
                  }, {
                    default: b(() => [...d[17] || (d[17] = [
                      m("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  h(me, {
                    onClick: d[11] || (d[11] = (j) => r(t).asking.value = !1)
                  }, {
                    default: b(() => [...d[18] || (d[18] = [
                      m("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (n(), D(me, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: d[12] || (d[12] = (j) => r(t).asking.value = !0)
                }, {
                  default: b(() => [...d[19] || (d[19] = [
                    m("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : f.value === "start" ? (n(), s(P, { key: 1 }, [
                h(ke, null, {
                  default: b(() => [...d[20] || (d[20] = [
                    m("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (n(!0), s(P, null, ne(r(t).programs.value, (j) => (n(), D(me, {
                  key: j.name,
                  "data-agent-program": j.name,
                  onClick: (V) => (L(), r(t).start(j))
                }, {
                  default: b(() => [
                    m(v(j.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : f.value === "skills" ? (n(), D(Ra, {
                key: 2,
                skills: e.skills,
                onBrowse: d[13] || (d[13] = (j) => (L(), l("open", "skills", null)))
              }, null, 8, ["skills"])) : $.value ? (n(), s(P, { key: 3 }, [
                h(ke, null, {
                  default: b(() => [
                    m(v($.value.label), 1)
                  ]),
                  _: 1
                }),
                f.value === "context" ? (n(), s(P, { key: 0 }, [
                  A("p", tn, v(r(Ja)(((B = O.value) == null ? void 0 : B.last_compaction) ?? null)), 1),
                  A("div", an, [
                    A("span", nn, [
                      A("span", {
                        style: Ae({ width: `${W.value}%` })
                      }, null, 4)
                    ]),
                    A("span", on, v(W.value) + "%", 1)
                  ]),
                  J.value ? (n(), s("p", ln, [
                    m(v(J.value) + " ", 1),
                    h(Ha, {
                      text: "Capped",
                      tone: "warn"
                    })
                  ])) : k("", !0)
                ], 64)) : k("", !0),
                (n(!0), s(P, null, ne($.value.choices, (j) => (n(), D(me, {
                  key: j.value,
                  "data-agent-choice": j.value,
                  onClick: (V) => (r(t).choose($.value.key, j), L())
                }, {
                  default: b(() => [
                    m(v(j.label), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-choice", "onClick"]))), 128))
              ], 64)) : k("", !0)
            ];
          }),
          _: 1
        }, 8, ["anchor"])) : k("", !0)
      ], 2);
    };
  }
}, dn = /* @__PURE__ */ X(rn, [["__scopeId", "data-v-dc15ff96"]]), un = ["data-agent-open", "aria-expanded", "role", "tabindex"], cn = { class: "agent-head" }, gn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, vn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, pn = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, hn = { class: "agent-line" }, fn = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, mn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, kn = {
  key: 1,
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, bn = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, yn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const a = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), l = { helper: "Helper", reviewer: "Reviewer" }, t = e, c = o, f = Ge(), $ = i(() => {
      var S, te;
      if ((S = t.facts) != null && S.profile_title) return t.facts.profile_title;
      if ((te = t.facts) != null && te.profile) return t.facts.profile;
      const p = l[t.row.role] || t.row.role;
      return p.slice(0, 1).toUpperCase() + p.slice(1);
    }), M = i(() => {
      var p;
      return ((p = t.facts) == null ? void 0 : p.tasks) ?? [];
    }), L = i(() => M.value.filter((p) => p.state === "open")), q = i(() => M.value.find((p) => {
      var S;
      return p.id === ((S = t.progress) == null ? void 0 : S.task_id) && p.state === "started";
    })), E = i(() => q.value || M.value.find((p) => {
      var S;
      return p.id === ((S = t.facts) == null ? void 0 : S.task_id);
    }) || M.value.find((p) => a.has(p.state)) || L.value[0] || M.value.at(-1)), N = i(() => {
      var p, S, te, re, K, ue;
      return t.row.role === "helper" ? ((p = t.facts) == null ? void 0 : p.helper_job) || "" : (S = t.facts) != null && S.job_enabled && (((te = q.value) == null ? void 0 : te.title) || ((re = t.facts) == null ? void 0 : re.task_title) || ((K = L.value[0]) == null ? void 0 : K.title) || ((ue = M.value.at(-1)) == null ? void 0 : ue.title)) || "";
    }), U = i(() => {
      var p;
      return (p = t.facts) != null && p.job_enabled ? `${t.row.role} ${t.row.id}` : "";
    }), T = i(() => {
      var p, S;
      return [t.row.program, (p = t.facts) == null ? void 0 : p.model, (S = t.facts) == null ? void 0 : S.effort, U.value].filter(Boolean).join(" · ");
    }), O = Te(), W = i(() => ft(t.row.process_started_at || t.row.created_at, f.value)), Z = /* @__PURE__ */ new Set(["open", "started", "testing"]), J = i(() => {
      var p;
      return (p = t.facts) == null ? void 0 : p.work_status;
    }), Y = i(() => !!t.row.ended_at && t.row.role !== "main" && M.value.some((p) => Z.has(p.state))), C = i(() => {
      var p, S;
      return t.row.state === "running" && ((p = t.facts) == null ? void 0 : p.state) === "at usage limit" && !!((S = t.facts) != null && S.usage_limit_ends_at);
    }), d = i(() => `At usage limit: starts again ${new Date(t.facts.usage_limit_ends_at).toLocaleString()}`), F = i(() => {
      var p;
      return t.row.retired_at || t.row.state === "retired" ? "retired" : C.value || J.value || t.waitReason || Y.value ? "waiting" : t.row.state === "running" && ((p = t.facts) == null ? void 0 : p.state) || t.row.state;
    }), B = i(() => {
      var p;
      return C.value ? d.value : J.value ? `Status: ${J.value}` : t.waitReason ? `Waiting: ${t.waitReason}` : F.value === "blocked" ? (p = t.facts) != null && p.blocked_reason ? `Blocked: ${t.facts.blocked_reason}` : "Blocked" : Y.value ? "Stopped with work left" : "";
    }), j = i(() => {
      var p;
      return ((p = t.progress) == null ? void 0 : p.completed_count) ?? M.value.filter((S) => S.state === "completed").length;
    }), V = i(() => {
      var p;
      return mt(j.value, ((p = t.progress) == null ? void 0 : p.started_at) || t.row.created_at, t.progress ? t.progress.finished_at : t.row.ended_at, f.value);
    }), g = i(() => t.row.role === "main" ? 0 : V.value), y = i(() => !!t.row.retired_at || t.row.state === "retired"), u = i(() => y.value ? "Retired" : F.value === "blocked" || F.value === "waiting" ? B.value || (F.value === "blocked" ? "Blocked" : "Waiting") : t.row.ended_at ? "Idle: its process has stopped" : "Working"), R = i(() => {
      var S;
      if (y.value) return t.row.retired_at;
      const p = F.value === "blocked" || F.value === "waiting";
      return t.row.ended_at || p && ((S = t.facts) == null ? void 0 : S.last_activity) || t.row.process_started_at || t.row.created_at;
    }), z = i(() => R.value ? `Since: ${new Date(R.value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${We(R.value, f.value)}` : ""), Q = i(() => {
      var p;
      return (p = t.facts) != null && p.last_activity ? `Seen: ${We(t.facts.last_activity, f.value)}` : "";
    });
    return (p, S) => {
      var te, re, K, ue, ie, pe;
      return n(), s("div", {
        class: le(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: S[3] || (S[3] = (ae) => !e.open && c("toggle")),
        onKeydown: [
          S[4] || (S[4] = Ee(ee((ae) => !e.open && c("toggle"), ["self", "prevent"]), ["enter"])),
          S[5] || (S[5] = Ee(ee((ae) => !e.open && c("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        A("span", cn, [
          e.open ? (n(), s("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: S[0] || (S[0] = ee((ae) => c("toggle"), ["stop"]))
          }, [
            h(r(Re), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : k("", !0),
          A("span", gn, v($.value), 1),
          A("span", vn, v(((te = e.facts) == null ? void 0 : te.given_name) || e.row.id), 1),
          e.open ? k("", !0) : (n(), D(r(Re), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          e.open ? (n(), s("span", pn, v(W.value), 1)) : k("", !0)
        ]),
        A("span", hn, [
          A("span", fn, v(T.value), 1),
          (re = e.facts) != null && re.sandbox_off ? (n(), s("span", mn, "sandbox off")) : k("", !0),
          e.open ? (n(), s("span", kn, [
            S[6] || (S[6] = m("Started ", -1)),
            h(r(qe), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : k("", !0),
          e.open && ((K = e.facts) != null && K.last_activity) ? (n(), s("span", bn, [
            S[7] || (S[7] = m("Seen ", -1)),
            h(r(qe), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : k("", !0)
        ]),
        e.open ? (n(), D(dn, {
          key: 0,
          "agent-programs": r(O).props.programs.rows.value,
          agent: e.row,
          branch: (ue = e.progress) == null ? void 0 : ue.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((ie = e.facts) == null ? void 0 : ie.windows) ?? [] },
          card: ""
        }, {
          default: b(() => [
            h(la, { row: e.row }, null, 8, ["row"]),
            h(r(se), {
              variant: "ghost",
              small: "",
              "data-agent-inspector": "",
              onClick: S[1] || (S[1] = ee((ae) => r(we)(`agents:${e.row.id}`), ["stop"]))
            }, {
              default: b(() => [...S[8] || (S[8] = [
                m("Open inspector", -1)
              ])]),
              _: 1
            }),
            e.row.role === "helper" && !e.row.ended_at ? (n(), D(r(se), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: S[2] || (S[2] = ee((ae) => r(O).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: b(() => [...S[9] || (S[9] = [
                m("Stop", -1)
              ])]),
              _: 1
            })) : k("", !0)
          ]),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : k("", !0),
        e.open ? k("", !0) : (n(), D(ba, {
          key: 1,
          tasks: M.value,
          "in-hand": e.row.role !== "helper" && ((pe = e.facts) != null && pe.job_enabled) && E.value || null,
          job: e.row.role === "helper" ? N.value : "",
          "per-hour": g.value
        }, null, 8, ["tasks", "in-hand", "job", "per-hour"])),
        h(ua, {
          state: F.value,
          doing: u.value,
          since: z.value,
          seen: Q.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (n(), D(Ft, {
          key: 2,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: M.value,
          "stopped-with-work": Y.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : k("", !0)
      ], 42, un);
    };
  }
}, wn = /* @__PURE__ */ X(yn, [["__scopeId", "data-v-97a9cbcc"]]), Mn = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, xn = ["data-agent-row", "data-agent-lingering"], Fe = "journal.agents.filters", Pe = 300 * 1e3, Se = "cubic-bezier(0.2, 0.9, 0.25, 1)", $n = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const o = e, a = Te(), { rows: l } = a.props.waits, { rows: t } = a.props.progress, { rows: c, failure: f, loaded: $, more: M } = a.props.agents, L = (x) => t.value.find((I) => I.agent_id === x.id) ?? null, q = (x) => {
      var I;
      return ((I = l.value.find((w) => w.agent_id === x.id)) == null ? void 0 : I.reason) ?? "";
    }, E = H("running"), N = H(""), U = JSON.parse(localStorage.getItem(Fe) || '{"roles":[],"profiles":[],"programs":[]}'), T = H(U), O = i(() => a.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: W } = a.props.programs, Z = i(() => T.value.roles.length + T.value.profiles.length + T.value.programs.length), J = (x, I) => {
      T.value = wt(T.value, x, I);
    }, Y = () => {
      T.value = { roles: [], profiles: [], programs: [] };
    }, C = (x) => x.slice(0, 1).toUpperCase() + x.slice(1);
    de(T, (x) => localStorage.setItem(Fe, JSON.stringify(x)));
    const d = H(25);
    function F() {
      Object.assign(a.state, {
        "agents.show": E.value,
        "agents.search": N.value,
        "agents.limit": String(d.value),
        "agents.roles": T.value.roles.join(","),
        "agents.profiles": T.value.profiles.join(","),
        "agents.programs": T.value.programs.join(",")
      });
    }
    async function B() {
      return d.value += 25, F(), await a.reload("agents"), !0;
    }
    de([E, N, T], () => {
      d.value = 25, F(), a.reload("agents");
    }), F();
    const j = (x) => x.facts ?? null, V = c, g = Ge(), y = H([]), u = i(() => new Set(y.value.filter((x) => g.value - x.left < Pe).map((x) => x.row.id))), R = i(() => y.value.filter((x) => u.value.has(x.row.id)).map((x) => x.row)), z = i(() => [...V.value, ...R.value]);
    let Q = "", p = [];
    async function S(x) {
      await a.reload(`card.${x.id}`);
      const I = a.props[`card.${x.id}`].rows.value.find((w) => w.id === x.id);
      I != null && I.ended_at && !y.value.some((w) => w.row.id === x.id) && (y.value = [...y.value, { row: I, left: Date.now() }]);
    }
    de(c, (x) => {
      const I = Q === `${E.value}|${N.value}|${JSON.stringify(T.value)}` && E.value === "running", w = I ? p.filter((G) => !x.some((ge) => ge.id === G.id)) : [];
      Q = `${E.value}|${N.value}|${JSON.stringify(T.value)}`, p = x, y.value = I ? y.value.filter((G) => g.value - G.left < Pe && !x.some((ge) => ge.id === G.row.id)) : [], w.forEach(S);
    }, { immediate: !0 });
    const te = i(() => !!N.value.trim() || Z.value > 0), re = i(() => o.texts[E.value] ?? { title: o.empty, hint: "" }), K = H(null), ue = H(null), ie = H(null), pe = H(null), ae = i(() => K.value === null ? null : a.props[`card.${K.value}`].rows.value.find((x) => x.id === K.value) ?? ue.value), Ie = i(() => ae.value ? [ae.value] : z.value), Me = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, ce = H(!1);
    let Oe = 0;
    async function Ze(x) {
      if (ce.value) return;
      ce.value = !0, Oe = pe.value.scrollTop;
      const I = ie.value.querySelector(`[data-agent-open="${x.id}"]`);
      if (!Me()) {
        const ve = [...ie.value.querySelectorAll(".agent-row")].filter((oe) => !oe.contains(I));
        await Promise.all(ve.map((oe) => oe.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const w = [...I.querySelectorAll(".agent-head, .agent-line")], G = [...w, ...I.querySelectorAll("[data-agent-motion]")], ge = G.map((ve) => ve.getBoundingClientRect());
      if (ue.value = x, K.value = x.id, a.reload(`card.${x.id}`), await Ne(), !Me()) {
        const ve = G.map((oe) => oe.getBoundingClientRect());
        G.forEach((oe, xe) => {
          const he = w.findIndex((He) => He !== oe && He.contains(oe)), Qe = ge[xe].left - ve[xe].left - (he < 0 ? 0 : ge[he].left - ve[he].left), Xe = ge[xe].top - ve[xe].top - (he < 0 ? 0 : ge[he].top - ve[he].top);
          oe.animate([{ transform: `translate(${Qe}px, ${Xe}px)` }, { transform: "none" }], { duration: 280, easing: Se });
        }), ie.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((oe) => {
          oe.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Se, fill: "backwards" });
        });
      }
      ce.value = !1;
    }
    async function Ve() {
      if (ce.value || !ae.value) return;
      ce.value = !0;
      const x = ie.value.querySelector(`[data-agent-open="${K.value}"]`), I = [...x.children], w = Me() ? [] : I.map((G) => G.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(w.map((G) => G.finished)), K.value = null, await Ne(), pe.value.scrollTop = Oe, w.forEach((G) => G.cancel()), Me() || (x.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Se }), ie.value.querySelectorAll(".agent-row").forEach((G) => {
        G.contains(x) || G.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Se });
      })), ce.value = !1;
    }
    const Ye = (x) => K.value === x.id ? Ve() : Ze(x);
    de(N, (x) => x.trim() && (K.value = null)), de(E, () => {
      K.value = null;
    });
    const ze = (x) => {
      x.key === "Escape" && Ve();
    };
    return window.addEventListener("keydown", ze), be(() => window.removeEventListener("keydown", ze)), (x, I) => (n(), s("div", {
      ref_key: "agents",
      ref: ie,
      class: le(["agents", { focused: ae.value, "card-changing": ce.value }])
    }, [
      h(r(kt), {
        modelValue: N.value,
        "onUpdate:modelValue": I[1] || (I[1] = (w) => N.value = w),
        placeholder: "Search agents",
        "menu-count": Z.value,
        "data-agents-search": ""
      }, {
        menu: b(() => [
          h(r(Be), null, {
            default: b(() => [...I[2] || (I[2] = [
              m("Type", -1)
            ])]),
            _: 1
          }),
          (n(!0), s(P, null, ne(O.value.roles, (w) => (n(), D(r($e), {
            key: w,
            role: "menuitemcheckbox",
            "aria-checked": T.value.roles.includes(w),
            checked: T.value.roles.includes(w),
            "data-filter-role": w,
            onClick: (G) => J("roles", w)
          }, {
            default: b(() => [
              m(v(C(w)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          O.value.profiles.length ? (n(), D(r(Be), { key: 0 }, {
            default: b(() => [...I[3] || (I[3] = [
              m("Profile", -1)
            ])]),
            _: 1
          })) : k("", !0),
          (n(!0), s(P, null, ne(O.value.profiles, (w) => (n(), D(r($e), {
            key: w.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.profiles.includes(w.name),
            checked: T.value.profiles.includes(w.name),
            "data-filter-profile": w.name,
            onClick: (G) => J("profiles", w.name)
          }, {
            default: b(() => [
              m(v(w.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          h(r(Be), null, {
            default: b(() => [...I[4] || (I[4] = [
              m("Program", -1)
            ])]),
            _: 1
          }),
          (n(!0), s(P, null, ne(r(W), (w) => (n(), D(r($e), {
            key: w.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.programs.includes(w.name),
            checked: T.value.programs.includes(w.name),
            "data-filter-program": w.name,
            onClick: (G) => J("programs", w.name)
          }, {
            default: b(() => [
              m(v(w.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          Z.value ? (n(), D(r($e), {
            key: 1,
            "data-filter-clear": "",
            onClick: Y
          }, {
            default: b(() => [...I[5] || (I[5] = [
              m("Clear filters", -1)
            ])]),
            _: 1
          })) : k("", !0)
        ]),
        default: b(() => [
          h(r(bt), {
            options: O.value.states,
            value: E.value,
            onPick: I[0] || (I[0] = (w) => E.value = w)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      E.value === "retired" && O.value.upgrade_retired ? (n(), s("p", Mn, "Retired during the upgrade: " + v(O.value.upgrade_retired), 1)) : k("", !0),
      A("div", {
        ref_key: "list",
        ref: pe,
        class: le(["agents-view", { "agents-view-open": ae.value }])
      }, [
        r($) && !r(f) && !Ie.value.length && Z.value ? (n(), D(r(Le), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: b(() => [
            h(r(se), {
              small: "",
              "data-empty-clear": "",
              onClick: Y
            }, {
              default: b(() => [...I[6] || (I[6] = [
                m("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (n(), D(r(yt), {
          key: 1,
          moves: "",
          "leaves-at-once": ce.value,
          rows: Ie.value,
          failure: r(f),
          loaded: r($),
          more: !ae.value && r(M),
          older: B,
          empty: re.value.title,
          hint: re.value.hint,
          searching: te.value
        }, {
          default: b(({ row: w }) => [
            A("div", {
              class: le(["agent-row", { lingering: u.value.has(w.id) && w.id !== K.value }]),
              "data-agent-row": w.id,
              "data-agent-lingering": u.value.has(w.id) ? "" : null
            }, [
              h(wn, {
                row: w,
                facts: j(w),
                progress: L(w),
                "wait-reason": q(w),
                open: w.id === K.value,
                onToggle: (G) => Ye(w)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, xn)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, Tn = /* @__PURE__ */ X($n, [["__scopeId", "data-v-2cc349bb"]]);
export {
  Tn as A
};
