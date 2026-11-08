/* @code-commandments-generated */
import { openBlock as n, createElementBlock as s, withModifiers as te, unref as d, createTextVNode as f, toDisplayString as h, createVNode as m, createBlock as q, withCtx as b, Fragment as P, renderList as _, createElementVNode as T, createCommentVNode as k, computed as u, ref as H, watch as ie, onUnmounted as ye, defineAsyncComponent as _e, createSlots as et, resolveDynamicComponent as tt, normalizeClass as ae, normalizeStyle as ke, renderSlot as we, onMounted as at, Teleport as nt, mergeProps as lt, toRef as je, withKeys as Ee, nextTick as Ne } from "vue";
import { peekRef as Ae, Icon as Re, RunningCommand as ot, FoldGroup as Fe, TaskStatusIcon as st, useWindow as Te, loadWindowComponent as rt, coalesced as it, READ_RATES as dt, InnerTabs as ut, TabBody as ct, SwitchCase as Pe, EmptyState as Be, Btn as de, TextArea as gt, TextInput as vt, HoverTip as Ce, useNow as Ue, age as pt, perHour as ht, ago as He, TimeAgo as We, SearchBar as ft, Segmented as mt, MenuLabel as Le, MenuItem as $e, RowList as kt, toggleFilter as bt } from "@journal/window-kit";
import { _ as Y, T as yt } from "./TranscriptRows-CG9aRNTl.js";
const wt = {
  class: "agent-command",
  "data-agent-command": ""
}, Mt = {
  key: 1,
  "data-agent-stopped": ""
}, xt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (l, a) => (n(), s("span", wt, [
      e.waitReason ? (n(), s("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: a[0] || (a[0] = te((o) => d(Ae)("test_queue:0"), ["stop"]))
      }, [
        f("Waiting: " + h(e.waitReason) + " ", 1),
        m(d(Re), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (n(), s("span", Mt, "Waiting")) : (n(), q(d(ot), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, $t = /* @__PURE__ */ Y(xt, [["__scopeId", "data-v-1b371fb5"]]), St = ["data-agent-delegated", "onClick"], Ct = { class: "agent-task-number" }, At = { class: "agent-task-title" }, Tt = ["title"], jt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const a = l;
    return (o, t) => (n(), q(d(Fe), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: t[0] || (t[0] = (r) => a("toggle"))
    }, {
      default: b(() => [
        (n(!0), s(P, null, _(e.section.tasks, (r) => (n(), s("button", {
          key: r.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": r.id,
          onClick: (v) => d(Ae)(`tasks:${r.id}`)
        }, [
          m(d(st), {
            status: r.state
          }, null, 8, ["status"]),
          T("span", Ct, h(r.id), 1),
          T("span", At, h(r.title), 1),
          r.plan_id ? (n(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${r.plan_id}: ${r.plan_title}`
          }, "Plan " + h(r.plan_id) + ": " + h(r.plan_title), 9, Tt)) : k("", !0)
        ], 8, St))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Lt = /* @__PURE__ */ Y(jt, [["__scopeId", "data-v-238ff959"]]), Rt = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Bt = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, It = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, Vt = ["data-peek", "onClick"], Ot = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, zt = {
  key: 0,
  class: "agent-helper-brief"
}, Et = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Nt = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Ht = "It ended without a report", Wt = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const l = e, a = ["started", "blocked", "open", "completed"], o = u(() => {
      var i, C;
      return l.row.ended_at && ((C = (i = l.facts) == null ? void 0 : i.job_returned) != null && C.startsWith(Ht)) ? l.facts.job_returned : "";
    }), t = u(() => l.tasks.length ? a.map((i) => ({ state: i, label: i.slice(0, 1).toUpperCase() + i.slice(1), tasks: l.tasks.filter((C) => C.state === i || i === "started" && C.state === "testing" || i === "completed" && C.state === "cancelled") })) : []), r = /* @__PURE__ */ new Set(["completed"]), v = H({}), $ = (i) => !(v.value[i] ?? r.has(i)), y = (i) => v.value = { ...v.value, [i]: $(i) }, R = Te(), { rows: W } = R.props.reports;
    R.state["reports.agent"] = String(l.row.id);
    const V = u(() => l.row.access === "read-only"), O = u(() => !!l.row.retired_at || l.row.state === "retired"), U = ["tasks", "transcript", "terminal", "file-feed", "reports"], j = u(() => (O.value ? R.tabs.filter((C) => ["reports", "transcript"].includes(C.key)) : V.value ? R.tabs.filter((C) => ["reports", "transcript", "terminal"].includes(C.key)) : [...R.tabs]).sort((C, N) => (U.indexOf(C.key) < 0 ? U.length : U.indexOf(C.key)) - (U.indexOf(N.key) < 0 ? U.length : U.indexOf(N.key)))), z = () => V.value || O.value ? j.value.find((i) => i.key === "transcript") : j.value[0], E = H(z());
    ie(E, (i) => {
      R.state.tab = (i == null ? void 0 : i.key) ?? "";
    }, { immediate: !0 }), ye(() => {
      R.state.tab = "";
    }), ie(j, (i) => {
      i.some((C) => {
        var N;
        return C.key === ((N = E.value) == null ? void 0 : N.key);
      }) || (E.value = i[0]);
    }), ie(() => l.open, (i) => {
      i && (E.value = z());
    });
    const K = Object.fromEntries(R.tabs.filter((i) => i.component).map((i) => [i.key, _e(() => rt(i.component))])), x = H(!1), { data: c } = R.props.tool, Z = u(() => {
      var i;
      return ((i = c.value) == null ? void 0 : i.tool) ?? "";
    }), L = u(() => {
      var i;
      return ((i = c.value) == null ? void 0 : i.note) ?? "";
    }), B = u(() => l.row.role !== "main" && (!l.row.ended_at || l.stoppedWithWork || l.waitReason));
    async function Q() {
      !l.open || !B.value || (R.state["tool.agent"] = String(l.row.id), await R.reload("tool"));
    }
    const F = R.follow(["hook_call.*", "process_part.*"], it(Q, dt.agentCommand));
    return ye(() => F == null ? void 0 : F()), ie(() => l.open, (i) => {
      i && Q();
    }, { immediate: !0 }), (i, C) => {
      var N;
      return n(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: C[2] || (C[2] = te(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (n(), s("p", Rt, "Retirement reason: " + h(e.row.retirement_reason), 1)) : k("", !0),
        e.row.resume_reason ? (n(), s("p", Bt, h(e.row.resume_reason), 1)) : k("", !0),
        B.value ? (n(), q($t, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: Z.value,
          note: L.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : k("", !0),
        o.value ? (n(), s("p", It, h(o.value), 1)) : k("", !0),
        m(d(ut), {
          class: "agent-tabs",
          tabs: j.value,
          active: E.value,
          answer: { tasks: e.tasks.length, reports: d(W).length },
          onChoose: C[0] || (C[0] = (g) => E.value = g)
        }, null, 8, ["tabs", "active", "answer"]),
        m(d(ct), {
          class: "agent-tab-body",
          tab: E.value,
          "data-agent-tab-body": (N = E.value) == null ? void 0 : N.key
        }, {
          default: b(() => {
            var g;
            return [
              m(d(Pe), {
                value: (g = E.value) == null ? void 0 : g.key
              }, et({
                reports: b(() => [
                  d(W).length ? k("", !0) : (n(), q(d(Be), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: b(() => [...C[3] || (C[3] = [
                      f("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (n(!0), s(P, null, _(d(W), (S) => (n(), s("button", {
                    key: S.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${S.id}`,
                    onClick: (D) => d(Ae)(`messages:${S.id}`)
                  }, h(S.text), 9, Vt))), 128))
                ]),
                tasks: b(() => {
                  var S;
                  return [
                    e.tasks.length ? k("", !0) : (n(), q(d(Be), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: b(() => [...C[4] || (C[4] = [
                        f("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (n(!0), s(P, null, _(t.value, (D) => (n(), q(Lt, {
                      key: D.state,
                      section: D,
                      open: $(D.state),
                      onToggle: (oe) => y(D.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (S = e.facts) != null && S.instruction ? (n(), s(P, { key: 1 }, [
                      C[5] || (C[5] = T("p", { class: "agent-label" }, "Instruction", -1)),
                      T("div", Ot, h(e.facts.instruction), 1)
                    ], 64)) : k("", !0)
                  ];
                }),
                transcript: b(() => {
                  var S;
                  return [
                    V.value ? (n(), s(P, { key: 0 }, [
                      (S = e.facts) != null && S.instruction ? (n(), s("div", zt, [
                        m(d(Fe), {
                          label: "Instruction",
                          open: x.value,
                          "data-agent-section": "instruction",
                          onToggle: C[1] || (C[1] = (D) => x.value = !x.value)
                        }, {
                          default: b(() => [
                            T("div", Et, h(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (n(), s("p", Nt, "No job recorded")) : k("", !0)
                    ], 64)) : k("", !0),
                    m(yt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                _(d(K), (S, D) => ({
                  name: D,
                  fn: b(() => [
                    (n(), q(tt(S), {
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
}, qt = /* @__PURE__ */ Y(Wt, [["__scopeId", "data-v-3f66c406"]]), Dt = { class: "action-field" }, Ft = ["value", "disabled"], Pt = ["value"], Ut = { key: 1 }, Jt = {
  key: 1,
  class: "action-field"
}, Gt = { class: "action-buttons" }, Kt = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (l, a) => (n(), s("form", {
      onSubmit: a[4] || (a[4] = te((o) => l.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (n(), s(P, { key: 0 }, [
        T("label", Dt, [
          a[6] || (a[6] = f("Task ", -1)),
          T("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: a[0] || (a[0] = (o) => l.$emit("update:task", o.target.value))
          }, [
            a[5] || (a[5] = T("option", { value: "" }, "Choose an open task", -1)),
            (n(!0), s(P, null, _(e.tasks, (o) => (n(), s("option", {
              key: o.id,
              value: String(o.id)
            }, h(o.id) + ": " + h(o.title), 9, Pt))), 128))
          ], 40, Ft)
        ]),
        e.moreTasks ? (n(), q(d(de), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: a[1] || (a[1] = (o) => l.$emit("more"))
        }, {
          default: b(() => [...a[7] || (a[7] = [
            f("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : k("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (n(), s("p", Ut, "No open tasks.")) : k("", !0)
      ], 64)) : (n(), s("label", Jt, [
        a[8] || (a[8] = f("Job", -1)),
        m(d(gt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: a[2] || (a[2] = (o) => l.$emit("update:text", o.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      T("div", Gt, [
        m(d(de), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: b(() => [...a[9] || (a[9] = [
            f("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        m(d(de), {
          small: "",
          disabled: e.pending,
          onClick: a[3] || (a[3] = (o) => l.$emit("cancel"))
        }, {
          default: b(() => [...a[10] || (a[10] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Zt = /* @__PURE__ */ Y(Kt, [["__scopeId", "data-v-adde4158"]]), Yt = { class: "action-buttons" }, Qt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (l, a) => (n(), s("form", {
      "data-agent-retire-confirm": "",
      onSubmit: a[2] || (a[2] = te((o) => l.$emit("submit"), ["prevent"]))
    }, [
      a[5] || (a[5] = T("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      m(d(vt), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": a[0] || (a[0] = (o) => l.$emit("update:reason", o))
      }, null, 8, ["model-value", "disabled"]),
      T("div", Yt, [
        m(d(de), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: b(() => [...a[3] || (a[3] = [
            f("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        m(d(de), {
          small: "",
          disabled: e.pending,
          onClick: a[1] || (a[1] = (o) => l.$emit("cancel"))
        }, {
          default: b(() => [...a[4] || (a[4] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Xt = /* @__PURE__ */ Y(Qt, [["__scopeId", "data-v-23a905c0"]]), _t = { class: "action-buttons" }, ea = {
  key: 0,
  role: "alert"
}, ta = {
  key: 1,
  role: "status"
}, aa = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const l = e, a = Te(), o = H(""), t = H(""), r = H(""), v = H(""), $ = H([]), y = H(0), R = H(!1), W = H(!1), V = H(!1), O = H(""), U = H(""), j = u(() => !!l.row.retired_at || l.row.state === "retired"), z = u(() => !j.value && !!l.row.ended_at), E = u(() => {
      var F;
      return z.value && ((F = l.row.job_command) == null ? void 0 : F.length) && !l.row.resume_reason;
    }), K = u(() => E.value && !W.value && (l.row.job_task_flag ? $.value.some((F) => String(F.id) === v.value) : !!t.value.trim()));
    function x(F) {
      o.value = F, t.value = "", r.value = "", v.value = "", O.value = "", U.value = "";
    }
    async function c() {
      x("job"), l.row.job_task_flag && ($.value = [], y.value = 0, R.value = !1, await Z());
    }
    async function Z() {
      if (!W.value) {
        W.value = !0;
        try {
          a.state["jobs.page"] = String(y.value + 1), await a.reload("jobs");
          const F = a.props.jobs;
          O.value = F.failure.value, O.value || ($.value = [...$.value, ...F.rows.value], y.value = F.data.value.page, R.value = F.more.value);
        } finally {
          W.value = !1;
        }
      }
    }
    async function L(F, i) {
      if (!V.value) {
        V.value = !0, O.value = "";
        try {
          const C = await a.run(F);
          O.value = C.ok ? "" : C.error, C.ok && (x(""), U.value = i);
        } finally {
          V.value = !1;
        }
      }
    }
    async function B() {
      if (!K.value) return;
      const F = l.row.job_task_flag ? [l.row.job_task_flag, v.value] : [t.value.trim()];
      await L([...l.row.job_command, String(l.row.id), ...F], "Job sent.");
    }
    async function Q() {
      !z.value || o.value !== "retire" || !r.value.trim() || await L(["agent", "retire", String(l.row.id), "--reason", r.value.trim()], "Agent retired permanently.");
    }
    return (F, i) => {
      var C;
      return j.value ? k("", !0) : (n(), s("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: i[6] || (i[6] = te(() => {
        }, ["stop"])),
        onKeydown: i[7] || (i[7] = te(() => {
        }, ["stop"]))
      }, [
        T("div", _t, [
          z.value ? (n(), s(P, { key: 0 }, [
            (C = e.row.job_command) != null && C.length ? (n(), q(d(de), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: V.value || W.value || !E.value,
              onClick: c
            }, {
              default: b(() => [...i[8] || (i[8] = [
                f("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0),
            e.row.role !== "main" ? (n(), q(d(de), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: V.value || W.value,
              onClick: i[0] || (i[0] = (N) => x("retire"))
            }, {
              default: b(() => [...i[9] || (i[9] = [
                f("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0)
          ], 64)) : k("", !0)
        ]),
        m(d(Pe), { value: o.value }, {
          job: b(() => [
            m(Zt, {
              task: v.value,
              "onUpdate:task": i[1] || (i[1] = (N) => v.value = N),
              text: t.value,
              "onUpdate:text": i[2] || (i[2] = (N) => t.value = N),
              row: e.row,
              tasks: $.value,
              pending: V.value,
              loading: W.value,
              "more-tasks": R.value,
              failure: O.value,
              "job-ready": K.value,
              onSubmit: B,
              onMore: Z,
              onCancel: i[3] || (i[3] = (N) => x(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: b(() => [
            m(Xt, {
              reason: r.value,
              "onUpdate:reason": i[4] || (i[4] = (N) => r.value = N),
              pending: V.value,
              onSubmit: Q,
              onCancel: i[5] || (i[5] = (N) => x(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        O.value ? (n(), s("p", ea, h(O.value), 1)) : k("", !0),
        U.value ? (n(), s("p", ta, h(U.value), 1)) : k("", !0)
      ], 32));
    };
  }
}, na = /* @__PURE__ */ Y(aa, [["__scopeId", "data-v-4cb32275"]]), la = { class: "line" }, oa = {
  key: 0,
  class: "line",
  "data-agent-since": ""
}, sa = {
  key: 1,
  class: "line",
  "data-agent-seen": ""
}, ra = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" }, seen: { type: String, default: "" } },
  setup(e) {
    const l = /* @__PURE__ */ new Set(["running", "working", "thinking"]), a = e, o = u(() => l.has(a.state)), t = u(() => [a.doing, a.since, a.seen].filter(Boolean).join(". "));
    return (r, v) => (n(), q(d(Ce), {
      as: "button",
      place: "corner",
      class: ae(["agent-dot", { pulse: o.value }]),
      "data-state": e.state,
      "aria-label": t.value,
      "data-agent-status": "",
      onClick: v[0] || (v[0] = te(() => {
      }, ["stop"]))
    }, {
      tip: b(() => [
        T("b", la, h(e.doing), 1),
        e.since ? (n(), s("span", oa, h(e.since), 1)) : k("", !0),
        e.seen ? (n(), s("span", sa, h(e.seen), 1)) : k("", !0)
      ]),
      default: b(() => [
        v[1] || (v[1] = T("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, ia = /* @__PURE__ */ Y(ra, [["__scopeId", "data-v-9942a9ce"]]), Je = { started: { fill: 33, words: "started" }, testing: { fill: 66, words: "being tested" }, blocked: { fill: 33, words: "blocked" } }, da = 30, Ge = (e) => e.filter((l) => l.state !== "cancelled");
function ua(e, l) {
  const a = Ge(e), o = Je[l == null ? void 0 : l.state];
  return a.length > da ? { continuous: !0, done: a.filter((v) => v.state === "completed").length / a.length * 100, now: o ? o.fill / 100 / a.length * 100 : 0, segments: [] } : { continuous: !1, done: 0, now: 0, segments: a.map((r) => r.state === "completed" ? { kind: "done", fill: 0 } : r.id === (l == null ? void 0 : l.id) && o ? { kind: "now", fill: o.fill } : { kind: "todo", fill: 0 }) };
}
function ca({ tasks: e, inHand: l, perHour: a }) {
  const o = Ge(e), t = o.filter((y) => y.state === "completed").length, r = Je[l == null ? void 0 : l.state], v = o.length - t - (l && l.state !== "completed" ? 1 : 0), $ = t === o.length;
  return {
    number: l.id,
    title: l.title,
    count: `${t} of ${o.length}`,
    taskTip: `${t} of its ${o.length} tasks done${r ? `. This one is ${r.words}.` : "."}`,
    countTip: $ ? `All ${o.length} tasks done` : `${t} done, 1 in hand, ${v} to go`,
    paceTip: !$ && a ? `About ${a} an hour.` : "",
    bar: ua(e, l)
  };
}
const ga = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, va = {
  class: "task-line",
  "data-agent-task-line": ""
}, pa = { key: 0 }, ha = ["data-state"], fa = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, state: { type: String, required: !0 }, perHour: { type: Number, default: 0 } },
  setup(e) {
    const l = e, a = u(() => l.inHand ? ca({ tasks: l.tasks, inHand: l.inHand, perHour: l.perHour }) : null);
    return (o, t) => e.job && !a.value ? (n(), s("span", ga, [
      m(d(Ce), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: b(() => [
          T("b", null, h(e.job), 1)
        ]),
        default: b(() => [
          t[1] || (t[1] = f("Job", -1))
        ]),
        _: 1
      })
    ])) : a.value ? (n(), s(P, { key: 1 }, [
      T("span", va, [
        m(d(Ce), {
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${a.value.number}`,
          "aria-label": `Task ${a.value.number}: ${a.value.title}`,
          onClick: t[0] || (t[0] = te((r) => d(Ae)(`tasks:${a.value.number}`), ["stop"]))
        }, {
          tip: b(() => [
            T("b", null, h(a.value.title), 1),
            T("span", null, h(a.value.taskTip), 1)
          ]),
          default: b(() => [
            f("Task " + h(a.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"]),
        m(d(Ce), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: b(() => [
            T("b", null, h(a.value.countTip), 1),
            a.value.paceTip ? (n(), s("span", pa, h(a.value.paceTip), 1)) : k("", !0)
          ]),
          default: b(() => [
            f(h(a.value.count), 1)
          ]),
          _: 1
        })
      ]),
      T("span", {
        class: ae(["bar", { continuous: a.value.bar.continuous }]),
        "data-state": e.state,
        style: ke(a.value.bar.continuous ? { "--done": `${a.value.bar.done}%`, "--now": `${a.value.bar.now}%` } : void 0),
        "data-agent-bar": "",
        "aria-hidden": "true"
      }, [
        (n(!0), s(P, null, _(a.value.bar.segments, (r, v) => (n(), s("i", {
          key: v,
          class: ae(r.kind),
          style: ke(r.kind === "now" ? { "--fill": `${r.fill}%` } : void 0)
        }, null, 6))), 128))
      ], 14, ha)
    ], 64)) : k("", !0);
  }
}, ma = /* @__PURE__ */ Y(fa, [["__scopeId", "data-v-357b6ada"]]), ka = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', ba = ["data-icon", "stroke-width", "innerHTML"], X = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const l = e, a = { right: 0, down: 90, left: 180, up: 270 }, o = {
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
      agent: ka,
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
    return (r, v) => (n(), s("svg", {
      class: "ico",
      "data-icon": e.name,
      style: ke({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...l.facing === "right" ? {} : { transform: `rotate(${a[l.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: t[o[e.name] || e.name] || t.dot
    }, null, 12, ba));
  }
}, ya = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, wa = {
  key: 1,
  class: "menu-item-text"
}, Ma = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (l, a) => (n(), s("button", {
      type: "button",
      class: ae(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (n(), s("span", ya, h(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (n(), s("span", wa, [
        T("span", null, [
          we(l.$slots, "default", {}, void 0, !0)
        ]),
        T("small", null, h(e.description), 1)
      ])) : we(l.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, me = /* @__PURE__ */ Y(Ma, [["__scopeId", "data-v-fec99974"]]), xa = {}, $a = { class: "menu-label" };
function Sa(e, l) {
  return n(), s("span", $a, [
    we(e.$slots, "default", {}, void 0, !0)
  ]);
}
const be = /* @__PURE__ */ Y(xa, [["render", Sa], ["__scopeId", "data-v-aa955b3e"]]), Ca = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, Aa = {
  key: 0,
  class: "skills-none"
}, Ta = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: l }) {
    const a = e, o = l, t = u(() => a.skills.filter((v) => v.state === "loaded")), r = u(() => a.skills.filter((v) => v.state !== "loaded"));
    return (v, $) => (n(), s("div", Ca, [
      m(be, null, {
        default: b(() => [...$[1] || ($[1] = [
          f("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      t.value.length ? k("", !0) : (n(), s("p", Aa, "None yet. Compacting the conversation empties this list.")),
      (n(!0), s(P, null, _(t.value, (y) => (n(), s("p", {
        key: y.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        m(X, {
          name: "book",
          size: 12
        }),
        f(h(y.skill), 1)
      ]))), 128)),
      r.value.length ? (n(), s(P, { key: 1 }, [
        m(be, null, {
          default: b(() => [...$[2] || ($[2] = [
            f("Still to read", -1)
          ])]),
          _: 1
        }),
        (n(!0), s(P, null, _(r.value, (y) => (n(), s("p", {
          key: y.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          m(X, {
            name: "book",
            size: 12
          }),
          f(h(y.skill), 1)
        ]))), 128))
      ], 64)) : k("", !0),
      m(me, {
        "data-agent-skills-browse": "",
        onClick: $[0] || ($[0] = (y) => o("browse"))
      }, {
        default: b(() => [...$[3] || ($[3] = [
          f("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, ja = /* @__PURE__ */ Y(Ta, [["__scopeId", "data-v-be514d47"]]), La = ["disabled", "title"], Ra = { class: "gauge usage" }, Ba = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: l }) {
    const a = e, o = l, t = u(() => a.windows[0] ?? null), r = u(() => t.value && Number.isFinite(t.value.used_percent) ? Math.max(0, Math.min(100, Math.round(t.value.used_percent))) : null), v = u(() => r.value !== null && r.value >= 100), $ = u(() => {
      var R;
      return (R = t.value) != null && R.reset_epoch_seconds ? new Date(t.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), y = u(() => v.value ? `At usage limit: the plan's ${t.value.title} allowance is used up${$.value ? `, starts again ${$.value}` : ""}` : `${r.value}% of the plan's ${t.value.title} allowance used${$.value ? `, starts again ${$.value}` : ""}`);
    return (R, W) => r.value !== null ? (n(), s("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: y.value,
      onClick: W[0] || (W[0] = (V) => o("open", V.currentTarget))
    }, [
      m(X, {
        name: "allowance",
        size: 12
      }),
      W[1] || (W[1] = f()),
      T("span", Ra, [
        T("span", {
          style: ke({ width: `${r.value}%` })
        }, null, 4)
      ]),
      f(" " + h(v.value ? "At usage limit" : `${r.value}%`), 1)
    ], 8, La)) : k("", !0);
  }
}, Ia = /* @__PURE__ */ Y(Ba, [["__scopeId", "data-v-048b0a74"]]), Va = (e, l, a) => Math.max(l, Math.min(a, e)), Ke = /* @__PURE__ */ new WeakMap(), Oa = (e, l) => Ke.set(e, l);
function za(e, l) {
  for (let a = l; a; a = Ke.get(a) ?? a.parentElement) if (a === e) return !0;
  return !1;
}
function Ea(e, l) {
  const a = (o) => {
    var r, v;
    const t = ((r = e.value) == null ? void 0 : r.element) || ((v = e.value) == null ? void 0 : v.$el) || e.value;
    t && !za(t, o.target) && l(o);
  };
  window.addEventListener("click", a), ye(() => window.removeEventListener("click", a));
}
const fe = 8, Na = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: l, emit: a }) {
    const o = e, t = H(null), r = (g) => g ? `${g}px` : void 0, v = u(() => ({
      minWidth: r(o.minWidth),
      maxWidth: r(o.maxWidth),
      maxHeight: r(o.maxHeight),
      height: r(o.height)
    })), $ = H({ w: 0, h: 0 }), y = H(o.anchor ? o.anchor.getBoundingClientRect() : null), R = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), W = (g) => ({
      left: Math.max(0, g.left),
      top: Math.max(0, g.top),
      right: Math.min(window.innerWidth, g.right),
      bottom: Math.min(window.innerHeight, g.bottom)
    }), V = (g) => {
      const S = g.closest(".pane, .float-window");
      return S ? W(S.getBoundingClientRect()) : R();
    }, O = (g, S) => `${Math.max(0, g ? Math.min(g, S) : S)}px`;
    function U(g, S) {
      return {
        below: g.bottom - S.bottom - o.gap - fe,
        above: S.top - g.top - o.gap - fe,
        across: g.right - g.left - 2 * fe
      };
    }
    function j(g) {
      const S = V(o.anchor), D = U(S, g);
      return $.value.w <= D.across && $.value.h <= Math.max(D.below, D.above) ? S : R();
    }
    const z = u(() => {
      if (!y.value) return v.value;
      const g = y.value, S = j(g), D = U(S, g), { w: oe, h: p } = $.value, A = o.align === "auto" ? g.left + g.right > S.left + S.right : o.align === "right", ee = Va(A ? g.right - oe : g.left, S.left + fe, Math.max(S.left + fe, S.right - oe - fe)), G = p > D.below && D.above > D.below ? { bottom: `${window.innerHeight - g.top + o.gap}px`, maxHeight: O(o.maxHeight, D.above) } : { top: `${g.bottom + o.gap}px`, maxHeight: O(o.maxHeight, D.below) };
      return { ...v.value, ...G, left: `${ee}px`, maxWidth: O(o.maxWidth, D.across) };
    }), E = a, K = () => [...t.value.querySelectorAll("button:not(:disabled)")];
    function x(g) {
      const S = K(), D = S.indexOf(document.activeElement);
      S[(D + g + S.length) % S.length].focus();
    }
    const c = { ArrowDown: () => x(1), ArrowUp: () => x(-1), Escape: () => E("close") }, Z = (g) => c[g.key] && (g.preventDefault(), c[g.key]()), L = () => t.value && ($.value = { w: t.value.offsetWidth, h: t.value.scrollHeight });
    let B = 0;
    const Q = new ResizeObserver(() => {
      cancelAnimationFrame(B), B = requestAnimationFrame(L);
    });
    Ea(t, (g) => o.anchor && !o.anchor.contains(g.target) && E("close"));
    const F = (g, S) => ["top", "left", "right", "bottom"].some((D) => Math.abs(g[D] - S[D]) > 1), i = (g) => g.bottom < 0 || g.top > window.innerHeight;
    let C = 0;
    function N() {
      if (o.anchor) {
        const g = o.anchor.getBoundingClientRect();
        if (!o.anchor.isConnected || i(g)) return E("close");
        F(g, y.value) && (y.value = g);
      }
      C = requestAnimationFrame(N);
    }
    return at(() => {
      o.anchor && t.value && Oa(t.value, o.anchor), L(), t.value && Q.observe(t.value), !o.plain && K()[0] && K()[0].focus(), N();
    }), ye(() => {
      Q.disconnect(), cancelAnimationFrame(C), cancelAnimationFrame(B);
    }), l({ element: t }), (g, S) => (n(), q(nt, {
      to: "body",
      disabled: !e.anchor
    }, [
      T("div", lt({
        ref_key: "panel",
        ref: t
      }, g.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: z.value,
        onKeydown: Z
      }), [
        we(g.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Ha = /* @__PURE__ */ Y(Na, [["__scopeId", "data-v-3d203970"]]);
async function Wa(e, l, a) {
  if (!e) return a(l);
  const { target: o, fields: t } = e, r = Object.fromEntries(Object.keys(t).map((y) => [y, o[y]])), v = () => Object.assign(o, r);
  Object.assign(o, t);
  let $ = !1;
  try {
    const y = await a(l);
    return $ = y.ok, y;
  } finally {
    $ || v();
  }
}
function qa(e, l, a, { groups: o, programs: t }) {
  const r = H({}), v = H(""), $ = H(!1), y = u(() => !!e.value && !e.value.ended_at), R = u(() => y.value && !!e.value.paused_at);
  async function W(j, z = null) {
    v.value = "";
    const E = await Wa(z, j, l);
    return v.value = E.ok ? "" : E.error, a(), E;
  }
  return { groups: o, programs: t, chosen: r, failure: v, asking: $, running: y, paused: R, choose: (j, z) => W(["agent", "control", String(e.value.id), j, z.value], { target: r, fields: { value: { ...r.value, [j]: z.label } } }), stop: () => ($.value = !1, W(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (j) => W(["agent", "launch", j.name]) };
}
function Da(e) {
  if (!e) return "Not compacted yet";
  const l = new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return e.start_percent === null ? `Last compacted ${l}` : e.end_percent === null ? `Last compacted ${l}, from ${e.start_percent}%` : `Last compacted ${l}, from ${e.start_percent}% to ${e.end_percent}%, ${e.start_percent - e.end_percent}% taken off`;
}
const Fa = ["disabled", "title"], Pa = ["disabled", "title"], Ua = { class: "gauge" }, Ja = ["disabled", "title"], Ga = ["disabled"], Ka = ["disabled"], Za = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Ya = ["title"], Qa = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Xa = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, _a = { class: "gauge" }, en = { class: "context-used" }, tn = 75, an = {
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
  setup(e, { emit: l }) {
    const a = e, o = l, t = qa(je(a, "agent"), a.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => o("changed"), { groups: je(a, "controlGroups"), programs: je(a, "agentPrograms") }), r = H(null), v = H(""), $ = u(() => t.groups.value.find((x) => x.key === v.value));
    function y(x, c) {
      r.value = x.currentTarget, v.value = c;
    }
    function R() {
      r.value = null, v.value = "", t.asking.value = !1;
    }
    const W = u(() => a.skills.filter((x) => x.state === "loaded"));
    function V(x) {
      y(x, "skills"), o("skills");
    }
    const O = (x) => t.groups.value.some((c) => c.key === x), U = u(() => {
      var x;
      return t.chosen.value.model ?? ((x = z.value) == null ? void 0 : x.model) ?? "";
    }), j = u(() => {
      var x;
      return t.chosen.value.effort ?? ((x = z.value) == null ? void 0 : x.effort) ?? "";
    });
    u(() => !!a.agent && !a.agent.ended_at);
    const z = u(() => {
      var x;
      return ((x = a.usage.agents) == null ? void 0 : x.find((c) => {
        var Z;
        return c.id === ((Z = a.agent) == null ? void 0 : Z.id);
      })) ?? null;
    }), E = u(() => {
      var x;
      return ((x = z.value) == null ? void 0 : x.context_percent) == null ? null : Math.round(z.value.context_percent);
    }), K = u(() => {
      var x;
      return (x = z.value) != null && x.cost_dollars ? `$${z.value.cost_dollars.toFixed(2)}` : "";
    });
    return (x, c) => {
      var Z;
      return n(), s("div", {
        class: ae(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (n(), s(P, { key: 0 }, [
          T("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: c[0] || (c[0] = (L) => y(L, "agent"))
          }, [
            m(X, {
              name: "agents",
              size: 12
            }),
            f(" " + h(((Z = e.agentPrograms.find((L) => L.name === e.agent.program)) == null ? void 0 : Z.title) || e.agent.program), 1)
          ], 8, Fa),
          m(Ia, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: c[1] || (c[1] = (L) => o("open", "usage", L))
          }, null, 8, ["windows", "disabled"]),
          E.value !== null ? (n(), s("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${E.value}% full: clear or compact it`,
            onClick: c[2] || (c[2] = (L) => O("context") ? y(L, "context") : o("open", "context", L.currentTarget))
          }, [
            m(X, {
              name: "gauge",
              size: 12
            }),
            c[14] || (c[14] = f()),
            T("span", Ua, [
              T("span", {
                style: ke({ width: `${E.value}%` })
              }, null, 4)
            ]),
            f(" " + h(E.value) + "% ", 1)
          ], 8, Pa)) : k("", !0),
          U.value ? (n(), s("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${U.value}: change the model`,
            onClick: c[3] || (c[3] = (L) => O("model") ? y(L, "model") : null)
          }, [
            m(X, {
              name: "model",
              size: 12
            }),
            f(" " + h(U.value), 1)
          ], 8, Ja)) : k("", !0),
          O("effort") || e.card && j.value ? (n(), s("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: c[4] || (c[4] = (L) => y(L, "effort"))
          }, [
            m(X, {
              name: "bolt",
              size: 12
            }),
            f(" " + h(j.value), 1)
          ], 8, Ga)) : k("", !0),
          K.value ? (n(), s("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: c[5] || (c[5] = (L) => o("open", "cost", L.currentTarget))
          }, h(K.value), 9, Ka)) : k("", !0),
          e.branch ? (n(), s("span", Za, [
            m(X, {
              name: "branch",
              size: 12
            }),
            f(" " + h(e.branch), 1)
          ])) : k("", !0),
          e.card ? k("", !0) : (n(), s("button", {
            key: 5,
            type: "button",
            class: ae(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: c[6] || (c[6] = (L) => o("open", "jobs", L.currentTarget))
          }, [
            m(X, {
              name: "clock",
              size: 12
            }),
            f(" " + h(e.jobs), 1)
          ], 2)),
          e.run ? (n(), s("button", {
            key: 6,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: V
          }, [
            m(X, {
              name: "book",
              size: 12
            }),
            f(" " + h(W.value.length), 1)
          ])) : k("", !0),
          e.fitness ? (n(), s(P, { key: 7 }, [
            T("button", {
              type: "button",
              class: ae(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < tn }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: c[7] || (c[7] = (L) => o("open", "fitness", L.currentTarget))
            }, [
              m(X, {
                name: "heart",
                size: 12
              }),
              f(" " + h(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            T("button", {
              type: "button",
              class: ae(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: c[8] || (c[8] = (L) => o("open", "load", L.currentTarget))
            }, [
              m(X, {
                name: "weight",
                size: 12
              }),
              f(" " + h(e.fitness.workload), 1)
            ], 2)
          ], 64)) : k("", !0)
        ], 64)) : e.run && !e.loading ? (n(), s("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: c[9] || (c[9] = (L) => y(L, "start"))
        }, [
          m(X, {
            name: "agents",
            size: 12
          }),
          c[15] || (c[15] = f(" Start an agent", -1))
        ])) : k("", !0),
        c[21] || (c[21] = T("span", { class: "space" }, null, -1)),
        d(t).failure.value ? (n(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: d(t).failure.value
        }, h(d(t).failure.value), 9, Ya)) : k("", !0),
        we(x.$slots, "default", {}, void 0, !0),
        r.value ? (n(), q(Ha, {
          key: 3,
          anchor: r.value,
          "min-width": 190,
          onClose: R
        }, {
          default: b(() => {
            var L;
            return [
              v.value === "agent" ? (n(), s(P, { key: 0 }, [
                d(t).asking.value ? (n(), s(P, { key: 0 }, [
                  m(be, { "data-agent-stop-ask": "" }, {
                    default: b(() => [...c[16] || (c[16] = [
                      f("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  m(me, {
                    "data-agent-stop-confirm": "",
                    onClick: c[10] || (c[10] = (B) => (R(), d(t).stop()))
                  }, {
                    default: b(() => [...c[17] || (c[17] = [
                      f("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  m(me, {
                    onClick: c[11] || (c[11] = (B) => d(t).asking.value = !1)
                  }, {
                    default: b(() => [...c[18] || (c[18] = [
                      f("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (n(), q(me, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: c[12] || (c[12] = (B) => d(t).asking.value = !0)
                }, {
                  default: b(() => [...c[19] || (c[19] = [
                    f("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : v.value === "start" ? (n(), s(P, { key: 1 }, [
                m(be, null, {
                  default: b(() => [...c[20] || (c[20] = [
                    f("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (n(!0), s(P, null, _(d(t).programs.value, (B) => (n(), q(me, {
                  key: B.name,
                  "data-agent-program": B.name,
                  onClick: (Q) => (R(), d(t).start(B))
                }, {
                  default: b(() => [
                    f(h(B.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : v.value === "skills" ? (n(), q(ja, {
                key: 2,
                skills: e.skills,
                onBrowse: c[13] || (c[13] = (B) => (R(), o("open", "skills", null)))
              }, null, 8, ["skills"])) : $.value ? (n(), s(P, { key: 3 }, [
                m(be, null, {
                  default: b(() => [
                    f(h($.value.label), 1)
                  ]),
                  _: 1
                }),
                v.value === "context" ? (n(), s(P, { key: 0 }, [
                  T("p", Qa, h(d(Da)(((L = z.value) == null ? void 0 : L.last_compaction) ?? null)), 1),
                  T("div", Xa, [
                    T("span", _a, [
                      T("span", {
                        style: ke({ width: `${E.value}%` })
                      }, null, 4)
                    ]),
                    T("span", en, h(E.value) + "%", 1)
                  ])
                ], 64)) : k("", !0),
                (n(!0), s(P, null, _($.value.choices, (B) => (n(), q(me, {
                  key: B.value,
                  "data-agent-choice": B.value,
                  onClick: (Q) => (d(t).choose($.value.key, B), R())
                }, {
                  default: b(() => [
                    f(h(B.label), 1)
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
}, nn = /* @__PURE__ */ Y(an, [["__scopeId", "data-v-a6fce350"]]), ln = ["data-agent-open", "aria-expanded", "role", "tabindex"], on = { class: "agent-head" }, sn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, rn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, dn = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, un = { class: "agent-line" }, cn = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, gn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, vn = {
  key: 1,
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, pn = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, hn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const a = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), o = { helper: "Helper", reviewer: "Reviewer" }, t = e, r = l, v = Ue(), $ = u(() => {
      var A, ee;
      if ((A = t.facts) != null && A.profile_title) return t.facts.profile_title;
      if ((ee = t.facts) != null && ee.profile) return t.facts.profile;
      const p = o[t.row.role] || t.row.role;
      return p.slice(0, 1).toUpperCase() + p.slice(1);
    }), y = u(() => {
      var p;
      return ((p = t.facts) == null ? void 0 : p.tasks) ?? [];
    }), R = u(() => y.value.filter((p) => p.state === "open")), W = u(() => y.value.find((p) => {
      var A;
      return p.id === ((A = t.progress) == null ? void 0 : A.task_id) && p.state === "started";
    })), V = u(() => W.value || y.value.find((p) => {
      var A;
      return p.id === ((A = t.facts) == null ? void 0 : A.task_id);
    }) || y.value.find((p) => a.has(p.state)) || R.value[0] || y.value.at(-1)), O = u(() => {
      var p, A, ee, se, G, ue;
      return t.row.role === "helper" ? ((p = t.facts) == null ? void 0 : p.helper_job) || "" : (A = t.facts) != null && A.job_enabled && (((ee = W.value) == null ? void 0 : ee.title) || ((se = t.facts) == null ? void 0 : se.task_title) || ((G = R.value[0]) == null ? void 0 : G.title) || ((ue = y.value.at(-1)) == null ? void 0 : ue.title)) || "";
    }), U = u(() => {
      var p;
      return (p = t.facts) != null && p.job_enabled ? `${t.row.role} ${t.row.id}` : "";
    }), j = u(() => {
      var p, A;
      return [t.row.program, (p = t.facts) == null ? void 0 : p.model, (A = t.facts) == null ? void 0 : A.effort, U.value].filter(Boolean).join(" · ");
    }), z = Te(), E = u(() => pt(t.row.process_started_at || t.row.created_at, v.value)), K = /* @__PURE__ */ new Set(["open", "started", "testing"]), x = u(() => {
      var p;
      return (p = t.facts) == null ? void 0 : p.work_status;
    }), c = u(() => !!t.row.ended_at && t.row.role !== "main" && y.value.some((p) => K.has(p.state))), Z = u(() => {
      var p, A;
      return t.row.state === "running" && ((p = t.facts) == null ? void 0 : p.state) === "at usage limit" && !!((A = t.facts) != null && A.limited_until);
    }), L = u(() => `At usage limit: starts again ${new Date(t.facts.limited_until).toLocaleString()}`), B = u(() => {
      var p;
      return t.row.retired_at || t.row.state === "retired" ? "retired" : Z.value || x.value || t.waitReason || c.value ? "waiting" : t.row.state === "running" && ((p = t.facts) == null ? void 0 : p.state) || t.row.state;
    }), Q = u(() => {
      var p;
      return Z.value ? L.value : x.value ? `Status: ${x.value}` : t.waitReason ? `Waiting: ${t.waitReason}` : B.value === "blocked" ? (p = t.facts) != null && p.blocked_reason ? `Blocked: ${t.facts.blocked_reason}` : "Blocked" : c.value ? "Stopped with work left" : "";
    }), F = u(() => {
      var p;
      return ((p = t.progress) == null ? void 0 : p.completed_count) ?? y.value.filter((A) => A.state === "completed").length;
    }), i = u(() => {
      var p;
      return ht(F.value, ((p = t.progress) == null ? void 0 : p.started_at) || t.row.created_at, t.progress ? t.progress.finished_at : t.row.ended_at, v.value);
    }), C = u(() => t.row.role === "main" ? 0 : i.value), N = u(() => !!t.row.retired_at || t.row.state === "retired"), g = u(() => N.value ? "Retired" : B.value === "blocked" || B.value === "waiting" ? Q.value || (B.value === "blocked" ? "Blocked" : "Waiting") : t.row.ended_at ? "Idle: its process has stopped" : "Working"), S = u(() => {
      var A;
      if (N.value) return t.row.retired_at;
      const p = B.value === "blocked" || B.value === "waiting";
      return t.row.ended_at || p && ((A = t.facts) == null ? void 0 : A.last_activity) || t.row.process_started_at || t.row.created_at;
    }), D = u(() => S.value ? `Since: ${new Date(S.value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${He(S.value, v.value)}` : ""), oe = u(() => {
      var p;
      return (p = t.facts) != null && p.last_activity ? `Seen: ${He(t.facts.last_activity, v.value)}` : "";
    });
    return (p, A) => {
      var ee, se, G, ue, re, ve;
      return n(), s("div", {
        class: ae(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: A[2] || (A[2] = (ne) => !e.open && r("toggle")),
        onKeydown: [
          A[3] || (A[3] = Ee(te((ne) => !e.open && r("toggle"), ["self", "prevent"]), ["enter"])),
          A[4] || (A[4] = Ee(te((ne) => !e.open && r("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        T("span", on, [
          e.open ? (n(), s("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: A[0] || (A[0] = te((ne) => r("toggle"), ["stop"]))
          }, [
            m(d(Re), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : k("", !0),
          T("span", sn, h($.value), 1),
          T("span", rn, h(((ee = e.facts) == null ? void 0 : ee.given_name) || e.row.id), 1),
          e.open ? k("", !0) : (n(), q(d(Re), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          e.open ? (n(), s("span", dn, h(E.value), 1)) : k("", !0)
        ]),
        T("span", un, [
          T("span", cn, h(j.value), 1),
          (se = e.facts) != null && se.sandbox_off ? (n(), s("span", gn, "sandbox off")) : k("", !0),
          e.open ? (n(), s("span", vn, [
            A[5] || (A[5] = f("Started ", -1)),
            m(d(We), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : k("", !0),
          e.open && ((G = e.facts) != null && G.last_activity) ? (n(), s("span", pn, [
            A[6] || (A[6] = f("Seen ", -1)),
            m(d(We), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : k("", !0)
        ]),
        e.open ? (n(), q(nn, {
          key: 0,
          "agent-programs": d(z).props.programs.rows.value,
          agent: e.row,
          branch: (ue = e.progress) == null ? void 0 : ue.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((re = e.facts) == null ? void 0 : re.windows) ?? [] },
          card: ""
        }, {
          default: b(() => [
            m(na, { row: e.row }, null, 8, ["row"]),
            e.row.role === "helper" && !e.row.ended_at ? (n(), q(d(de), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: A[1] || (A[1] = te((ne) => d(z).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: b(() => [...A[7] || (A[7] = [
                f("Stop", -1)
              ])]),
              _: 1
            })) : k("", !0)
          ]),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : k("", !0),
        e.open ? k("", !0) : (n(), q(ma, {
          key: 1,
          tasks: y.value,
          "in-hand": e.row.role !== "helper" && ((ve = e.facts) != null && ve.job_enabled) && V.value || null,
          job: e.row.role === "helper" ? O.value : "",
          state: B.value,
          "per-hour": C.value
        }, null, 8, ["tasks", "in-hand", "job", "state", "per-hour"])),
        m(ia, {
          state: B.value,
          doing: g.value,
          since: D.value,
          seen: oe.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (n(), q(qt, {
          key: 2,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: y.value,
          "stopped-with-work": c.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : k("", !0)
      ], 42, ln);
    };
  }
}, fn = /* @__PURE__ */ Y(hn, [["__scopeId", "data-v-6742efd8"]]), mn = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, kn = ["data-agent-row", "data-agent-lingering"], qe = "journal.agents.filters", De = 300 * 1e3, Se = "cubic-bezier(0.2, 0.9, 0.25, 1)", bn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const l = e, a = Te(), { rows: o } = a.props.waits, { rows: t } = a.props.progress, { rows: r, failure: v, loaded: $, more: y } = a.props.agents, R = (M) => t.value.find((I) => I.agent_id === M.id) ?? null, W = (M) => {
      var I;
      return ((I = o.value.find((w) => w.agent_id === M.id)) == null ? void 0 : I.reason) ?? "";
    }, V = H("running"), O = H(""), U = JSON.parse(localStorage.getItem(qe) || '{"roles":[],"profiles":[],"programs":[]}'), j = H(U), z = u(() => a.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: E } = a.props.programs, K = u(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), x = (M, I) => {
      j.value = bt(j.value, M, I);
    }, c = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, Z = (M) => M.slice(0, 1).toUpperCase() + M.slice(1);
    ie(j, (M) => localStorage.setItem(qe, JSON.stringify(M)));
    const L = H(25);
    function B() {
      Object.assign(a.state, {
        "agents.show": V.value,
        "agents.search": O.value,
        "agents.limit": String(L.value),
        "agents.roles": j.value.roles.join(","),
        "agents.profiles": j.value.profiles.join(","),
        "agents.programs": j.value.programs.join(",")
      });
    }
    async function Q() {
      return L.value += 25, B(), await a.reload("agents"), !0;
    }
    ie([V, O, j], () => {
      L.value = 25, B(), a.reload("agents");
    }), B();
    const F = (M) => M.facts ?? null, i = r, C = Ue(), N = H([]), g = u(() => new Set(N.value.filter((M) => C.value - M.left < De).map((M) => M.row.id))), S = u(() => N.value.filter((M) => g.value.has(M.row.id)).map((M) => M.row)), D = u(() => [...i.value, ...S.value]);
    let oe = "", p = [];
    async function A(M) {
      await a.reload(`card.${M.id}`);
      const I = a.props[`card.${M.id}`].rows.value.find((w) => w.id === M.id);
      I != null && I.ended_at && !N.value.some((w) => w.row.id === M.id) && (N.value = [...N.value, { row: I, left: Date.now() }]);
    }
    ie(r, (M) => {
      const I = oe === `${V.value}|${O.value}|${JSON.stringify(j.value)}` && V.value === "running", w = I ? p.filter((J) => !M.some((ce) => ce.id === J.id)) : [];
      oe = `${V.value}|${O.value}|${JSON.stringify(j.value)}`, p = M, N.value = I ? N.value.filter((J) => C.value - J.left < De && !M.some((ce) => ce.id === J.row.id)) : [], w.forEach(A);
    }, { immediate: !0 });
    const ee = u(() => !!O.value.trim() || K.value > 0), se = u(() => l.texts[V.value] ?? { title: l.empty, hint: "" }), G = H(null), ue = H(null), re = H(null), ve = H(null), ne = u(() => G.value === null ? null : a.props[`card.${G.value}`].rows.value.find((M) => M.id === G.value) ?? ue.value), Ie = u(() => ne.value ? [ne.value] : D.value), Me = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pe = !1, Ve = 0;
    async function Ze(M) {
      if (pe) return;
      pe = !0, Ve = ve.value.scrollTop;
      const I = re.value.querySelector(`[data-agent-open="${M.id}"]`);
      if (!Me()) {
        const ge = [...re.value.querySelectorAll(".agent-row")].filter((le) => !le.contains(I));
        await Promise.all(ge.map((le) => le.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const w = [...I.querySelectorAll(".agent-head, .agent-line")], J = [...w, ...I.querySelectorAll("[data-agent-motion]")], ce = J.map((ge) => ge.getBoundingClientRect());
      if (ue.value = M, G.value = M.id, a.reload(`card.${M.id}`), await Ne(), !Me()) {
        const ge = J.map((le) => le.getBoundingClientRect());
        J.forEach((le, xe) => {
          const he = w.indexOf(le.parentElement), Qe = ce[xe].left - ge[xe].left - (he < 0 ? 0 : ce[he].left - ge[he].left), Xe = ce[xe].top - ge[xe].top - (he < 0 ? 0 : ce[he].top - ge[he].top);
          le.animate([{ transform: `translate(${Qe}px, ${Xe}px)` }, { transform: "none" }], { duration: 280, easing: Se });
        }), re.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((le) => {
          le.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Se, fill: "backwards" });
        });
      }
      pe = !1;
    }
    async function Oe() {
      if (pe || !ne.value) return;
      pe = !0;
      const M = re.value.querySelector(`[data-agent-open="${G.value}"]`), I = [...M.children], w = Me() ? [] : I.map((J) => J.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(w.map((J) => J.finished)), G.value = null, await Ne(), ve.value.scrollTop = Ve, w.forEach((J) => J.cancel()), Me() || (M.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Se }), re.value.querySelectorAll(".agent-row").forEach((J) => {
        J.contains(M) || J.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Se });
      })), pe = !1;
    }
    const Ye = (M) => G.value === M.id ? Oe() : Ze(M);
    ie(O, (M) => M.trim() && (G.value = null)), ie(V, () => {
      G.value = null;
    });
    const ze = (M) => {
      M.key === "Escape" && Oe();
    };
    return window.addEventListener("keydown", ze), ye(() => window.removeEventListener("keydown", ze)), (M, I) => (n(), s("div", {
      ref_key: "agents",
      ref: re,
      class: ae(["agents", { focused: ne.value }])
    }, [
      m(d(ft), {
        modelValue: O.value,
        "onUpdate:modelValue": I[1] || (I[1] = (w) => O.value = w),
        placeholder: "Search agents",
        "menu-count": K.value,
        "data-agents-search": ""
      }, {
        menu: b(() => [
          m(d(Le), null, {
            default: b(() => [...I[2] || (I[2] = [
              f("Type", -1)
            ])]),
            _: 1
          }),
          (n(!0), s(P, null, _(z.value.roles, (w) => (n(), q(d($e), {
            key: w,
            role: "menuitemcheckbox",
            "aria-checked": j.value.roles.includes(w),
            checked: j.value.roles.includes(w),
            "data-filter-role": w,
            onClick: (J) => x("roles", w)
          }, {
            default: b(() => [
              f(h(Z(w)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          z.value.profiles.length ? (n(), q(d(Le), { key: 0 }, {
            default: b(() => [...I[3] || (I[3] = [
              f("Profile", -1)
            ])]),
            _: 1
          })) : k("", !0),
          (n(!0), s(P, null, _(z.value.profiles, (w) => (n(), q(d($e), {
            key: w.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.profiles.includes(w.name),
            checked: j.value.profiles.includes(w.name),
            "data-filter-profile": w.name,
            onClick: (J) => x("profiles", w.name)
          }, {
            default: b(() => [
              f(h(w.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          m(d(Le), null, {
            default: b(() => [...I[4] || (I[4] = [
              f("Program", -1)
            ])]),
            _: 1
          }),
          (n(!0), s(P, null, _(d(E), (w) => (n(), q(d($e), {
            key: w.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.programs.includes(w.name),
            checked: j.value.programs.includes(w.name),
            "data-filter-program": w.name,
            onClick: (J) => x("programs", w.name)
          }, {
            default: b(() => [
              f(h(w.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          K.value ? (n(), q(d($e), {
            key: 1,
            "data-filter-clear": "",
            onClick: c
          }, {
            default: b(() => [...I[5] || (I[5] = [
              f("Clear filters", -1)
            ])]),
            _: 1
          })) : k("", !0)
        ]),
        default: b(() => [
          m(d(mt), {
            options: z.value.states,
            value: V.value,
            onPick: I[0] || (I[0] = (w) => V.value = w)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      V.value === "retired" && z.value.upgrade_retired ? (n(), s("p", mn, "Retired during the upgrade: " + h(z.value.upgrade_retired), 1)) : k("", !0),
      T("div", {
        ref_key: "list",
        ref: ve,
        class: ae(["agents-view", { "agents-view-open": ne.value }])
      }, [
        d($) && !d(v) && !Ie.value.length && K.value ? (n(), q(d(Be), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: b(() => [
            m(d(de), {
              small: "",
              "data-empty-clear": "",
              onClick: c
            }, {
              default: b(() => [...I[6] || (I[6] = [
                f("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (n(), q(d(kt), {
          key: 1,
          moves: "",
          rows: Ie.value,
          failure: d(v),
          loaded: d($),
          more: !ne.value && d(y),
          older: Q,
          empty: se.value.title,
          hint: se.value.hint,
          searching: ee.value
        }, {
          default: b(({ row: w }) => [
            T("div", {
              class: ae(["agent-row", { lingering: g.value.has(w.id) && w.id !== G.value }]),
              "data-agent-row": w.id,
              "data-agent-lingering": g.value.has(w.id) ? "" : null
            }, [
              m(fn, {
                row: w,
                facts: F(w),
                progress: R(w),
                "wait-reason": W(w),
                open: w.id === G.value,
                onToggle: (J) => Ye(w)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, kn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, xn = /* @__PURE__ */ Y(bn, [["__scopeId", "data-v-a70249b7"]]);
export {
  xn as A
};
