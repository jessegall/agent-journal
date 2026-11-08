/* @code-commandments-generated */
import { openBlock as n, createElementBlock as o, withModifiers as se, unref as u, createTextVNode as k, toDisplayString as v, createVNode as x, createBlock as W, withCtx as $, Fragment as I, renderList as X, createElementVNode as d, createCommentVNode as y, computed as b, ref as B, watch as ie, onUnmounted as ye, defineAsyncComponent as Ze, createSlots as Ye, resolveDynamicComponent as Ee, renderSlot as pe, normalizeClass as ne, normalizeStyle as de, onMounted as Qe, Teleport as Xe, mergeProps as _e, toRef as Te, withKeys as Le, useModel as et, mergeModels as tt, nextTick as Ie } from "vue";
import { peekRef as Ae, Icon as be, RunningCommand as at, FoldGroup as He, TaskStatusIcon as nt, useWindow as me, loadWindowComponent as lt, coalesced as ot, READ_RATES as st, InnerTabs as rt, TabBody as it, SwitchCase as Ne, EmptyState as Oe, Btn as te, TextArea as ut, TextInput as dt, useNow as We, age as qe, perHour as ct, ago as pt, TimeAgo as ze, Dialog as vt, SearchBar as gt, Segmented as ft, MenuLabel as je, MenuItem as xe, RowList as mt, toggleFilter as ht } from "@journal/window-kit";
import { _ as Y, T as kt } from "./TranscriptRows-DfA-cZXn.js";
const yt = {
  class: "agent-command",
  "data-agent-command": ""
}, bt = {
  key: 1,
  "data-agent-stopped": ""
}, wt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (l, a) => (n(), o("span", yt, [
      e.waitReason ? (n(), o("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: a[0] || (a[0] = se((s) => u(Ae)("test_queue:0"), ["stop"]))
      }, [
        k("Waiting: " + v(e.waitReason) + " ", 1),
        x(u(be), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (n(), o("span", bt, "Waiting")) : (n(), W(u(at), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, Mt = /* @__PURE__ */ Y(wt, [["__scopeId", "data-v-1b371fb5"]]), $t = ["data-agent-delegated", "onClick"], xt = { class: "agent-task-number" }, Ct = { class: "agent-task-title" }, St = ["title"], At = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const a = l;
    return (s, t) => (n(), W(u(He), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: t[0] || (t[0] = (r) => a("toggle"))
    }, {
      default: $(() => [
        (n(!0), o(I, null, X(e.section.tasks, (r) => (n(), o("button", {
          key: r.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": r.id,
          onClick: (c) => u(Ae)(`tasks:${r.id}`)
        }, [
          x(u(nt), {
            status: r.state
          }, null, 8, ["status"]),
          d("span", xt, v(r.id), 1),
          d("span", Ct, v(r.title), 1),
          r.plan_id ? (n(), o("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${r.plan_id}: ${r.plan_title}`
          }, "Plan " + v(r.plan_id) + ": " + v(r.plan_title), 9, St)) : y("", !0)
        ], 8, $t))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Tt = /* @__PURE__ */ Y(At, [["__scopeId", "data-v-238ff959"]]), jt = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Ot = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Rt = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, Bt = ["data-peek", "onClick"], Lt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, It = {
  key: 0,
  class: "agent-helper-brief"
}, zt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Vt = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Et = "It ended without a report", Ht = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const l = e, a = ["started", "blocked", "open", "completed"], s = b(() => {
      var g, O;
      return l.row.ended_at && ((O = (g = l.facts) == null ? void 0 : g.job_returned) != null && O.startsWith(Et)) ? l.facts.job_returned : "";
    }), t = b(() => l.tasks.length ? a.map((g) => ({ state: g, label: g.slice(0, 1).toUpperCase() + g.slice(1), tasks: l.tasks.filter((O) => O.state === g || g === "started" && O.state === "testing" || g === "completed" && O.state === "cancelled") })) : []), r = /* @__PURE__ */ new Set(["completed"]), c = B({}), C = (g) => !(c.value[g] ?? r.has(g)), M = (g) => c.value = { ...c.value, [g]: C(g) }, j = me(), { rows: F } = j.props.reports;
    j.state["reports.agent"] = String(l.row.id);
    const U = b(() => l.row.access === "read-only"), H = b(() => !!l.row.retired_at || l.row.state === "retired"), D = ["tasks", "transcript", "terminal", "file-feed", "reports"], T = b(() => (H.value ? j.tabs.filter((O) => ["reports", "transcript"].includes(O.key)) : U.value ? j.tabs.filter((O) => ["reports", "transcript", "terminal"].includes(O.key)) : [...j.tabs]).sort((O, P) => (D.indexOf(O.key) < 0 ? D.length : D.indexOf(O.key)) - (D.indexOf(P.key) < 0 ? D.length : D.indexOf(P.key)))), V = () => U.value || H.value ? T.value.find((g) => g.key === "transcript") : T.value[0], E = B(V());
    ie(E, (g) => {
      j.state.tab = (g == null ? void 0 : g.key) ?? "";
    }, { immediate: !0 }), ye(() => {
      j.state.tab = "";
    }), ie(T, (g) => {
      g.some((O) => {
        var P;
        return O.key === ((P = E.value) == null ? void 0 : P.key);
      }) || (E.value = g[0]);
    }), ie(() => l.open, (g) => {
      g && (E.value = V());
    });
    const Z = Object.fromEntries(j.tabs.filter((g) => g.component).map((g) => [g.key, Ze(() => lt(g.component))])), A = B(!1), { data: m } = j.props.tool, z = b(() => {
      var g;
      return ((g = m.value) == null ? void 0 : g.tool) ?? "";
    }), R = b(() => {
      var g;
      return ((g = m.value) == null ? void 0 : g.note) ?? "";
    }), K = b(() => l.row.role !== "main" && (!l.row.ended_at || l.stoppedWithWork || l.waitReason));
    async function ee() {
      !l.open || !K.value || (j.state["tool.agent"] = String(l.row.id), await j.reload("tool"));
    }
    const J = j.follow(["hook_call.*", "process_part.*"], ot(ee, st.agentCommand));
    return ye(() => J == null ? void 0 : J()), ie(() => l.open, (g) => {
      g && ee();
    }, { immediate: !0 }), (g, O) => {
      var P;
      return n(), o("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: O[2] || (O[2] = se(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (n(), o("p", jt, "Retirement reason: " + v(e.row.retirement_reason), 1)) : y("", !0),
        e.row.resume_reason ? (n(), o("p", Ot, v(e.row.resume_reason), 1)) : y("", !0),
        K.value ? (n(), W(Mt, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: z.value,
          note: R.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : y("", !0),
        s.value ? (n(), o("p", Rt, v(s.value), 1)) : y("", !0),
        x(u(rt), {
          class: "agent-tabs",
          tabs: T.value,
          active: E.value,
          answer: { tasks: e.tasks.length, reports: u(F).length },
          onChoose: O[0] || (O[0] = (h) => E.value = h)
        }, null, 8, ["tabs", "active", "answer"]),
        x(u(it), {
          class: "agent-tab-body",
          tab: E.value,
          "data-agent-tab-body": (P = E.value) == null ? void 0 : P.key
        }, {
          default: $(() => {
            var h;
            return [
              x(u(Ne), {
                value: (h = E.value) == null ? void 0 : h.key
              }, Ye({
                reports: $(() => [
                  u(F).length ? y("", !0) : (n(), W(u(Oe), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: $(() => [...O[3] || (O[3] = [
                      k("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (n(!0), o(I, null, X(u(F), (i) => (n(), o("button", {
                    key: i.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${i.id}`,
                    onClick: (f) => u(Ae)(`messages:${i.id}`)
                  }, v(i.text), 9, Bt))), 128))
                ]),
                tasks: $(() => {
                  var i;
                  return [
                    e.tasks.length ? y("", !0) : (n(), W(u(Oe), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: $(() => [...O[4] || (O[4] = [
                        k("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (n(!0), o(I, null, X(t.value, (f) => (n(), W(Tt, {
                      key: f.state,
                      section: f,
                      open: C(f.state),
                      onToggle: (Q) => M(f.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (i = e.facts) != null && i.instruction ? (n(), o(I, { key: 1 }, [
                      O[5] || (O[5] = d("p", { class: "agent-label" }, "Instruction", -1)),
                      d("div", Lt, v(e.facts.instruction), 1)
                    ], 64)) : y("", !0)
                  ];
                }),
                transcript: $(() => {
                  var i;
                  return [
                    U.value ? (n(), o(I, { key: 0 }, [
                      (i = e.facts) != null && i.instruction ? (n(), o("div", It, [
                        x(u(He), {
                          label: "Instruction",
                          open: A.value,
                          "data-agent-section": "instruction",
                          onToggle: O[1] || (O[1] = (f) => A.value = !A.value)
                        }, {
                          default: $(() => [
                            d("div", zt, v(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (n(), o("p", Vt, "No job recorded")) : y("", !0)
                    ], 64)) : y("", !0),
                    x(kt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                X(u(Z), (i, f) => ({
                  name: f,
                  fn: $(() => [
                    (n(), W(Ee(i), {
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
}, Nt = /* @__PURE__ */ Y(Ht, [["__scopeId", "data-v-3f66c406"]]), Wt = { class: "action-field" }, qt = ["value", "disabled"], Ft = ["value"], Dt = { key: 1 }, Pt = {
  key: 1,
  class: "action-field"
}, Ut = { class: "action-buttons" }, Kt = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (l, a) => (n(), o("form", {
      onSubmit: a[4] || (a[4] = se((s) => l.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (n(), o(I, { key: 0 }, [
        d("label", Wt, [
          a[6] || (a[6] = k("Task ", -1)),
          d("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: a[0] || (a[0] = (s) => l.$emit("update:task", s.target.value))
          }, [
            a[5] || (a[5] = d("option", { value: "" }, "Choose an open task", -1)),
            (n(!0), o(I, null, X(e.tasks, (s) => (n(), o("option", {
              key: s.id,
              value: String(s.id)
            }, v(s.id) + ": " + v(s.title), 9, Ft))), 128))
          ], 40, qt)
        ]),
        e.moreTasks ? (n(), W(u(te), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: a[1] || (a[1] = (s) => l.$emit("more"))
        }, {
          default: $(() => [...a[7] || (a[7] = [
            k("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : y("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (n(), o("p", Dt, "No open tasks.")) : y("", !0)
      ], 64)) : (n(), o("label", Pt, [
        a[8] || (a[8] = k("Job", -1)),
        x(u(ut), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: a[2] || (a[2] = (s) => l.$emit("update:text", s.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      d("div", Ut, [
        x(u(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: $(() => [...a[9] || (a[9] = [
            k("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        x(u(te), {
          small: "",
          disabled: e.pending,
          onClick: a[3] || (a[3] = (s) => l.$emit("cancel"))
        }, {
          default: $(() => [...a[10] || (a[10] = [
            k("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Jt = /* @__PURE__ */ Y(Kt, [["__scopeId", "data-v-adde4158"]]), Gt = { class: "action-buttons" }, Zt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (l, a) => (n(), o("form", {
      "data-agent-retire-confirm": "",
      onSubmit: a[2] || (a[2] = se((s) => l.$emit("submit"), ["prevent"]))
    }, [
      a[5] || (a[5] = d("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      x(u(dt), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": a[0] || (a[0] = (s) => l.$emit("update:reason", s))
      }, null, 8, ["model-value", "disabled"]),
      d("div", Gt, [
        x(u(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: $(() => [...a[3] || (a[3] = [
            k("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        x(u(te), {
          small: "",
          disabled: e.pending,
          onClick: a[1] || (a[1] = (s) => l.$emit("cancel"))
        }, {
          default: $(() => [...a[4] || (a[4] = [
            k("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Fe = /* @__PURE__ */ Y(Zt, [["__scopeId", "data-v-23a905c0"]]), Yt = { class: "action-buttons" }, Qt = {
  key: 0,
  role: "alert"
}, Xt = {
  key: 1,
  role: "status"
}, _t = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const l = e, a = me(), s = B(""), t = B(""), r = B(""), c = B(""), C = B([]), M = B(0), j = B(!1), F = B(!1), U = B(!1), H = B(""), D = B(""), T = b(() => !!l.row.retired_at || l.row.state === "retired"), V = b(() => !T.value && !!l.row.ended_at), E = b(() => {
      var J;
      return V.value && ((J = l.row.job_command) == null ? void 0 : J.length) && !l.row.resume_reason;
    }), Z = b(() => E.value && !F.value && (l.row.job_task_flag ? C.value.some((J) => String(J.id) === c.value) : !!t.value.trim()));
    function A(J) {
      s.value = J, t.value = "", r.value = "", c.value = "", H.value = "", D.value = "";
    }
    async function m() {
      A("job"), l.row.job_task_flag && (C.value = [], M.value = 0, j.value = !1, await z());
    }
    async function z() {
      if (!F.value) {
        F.value = !0;
        try {
          a.state["jobs.page"] = String(M.value + 1), await a.reload("jobs");
          const J = a.props.jobs;
          H.value = J.failure.value, H.value || (C.value = [...C.value, ...J.rows.value], M.value = J.data.value.page, j.value = J.more.value);
        } finally {
          F.value = !1;
        }
      }
    }
    async function R(J, g) {
      if (!U.value) {
        U.value = !0, H.value = "";
        try {
          const O = await a.run(J);
          H.value = O.ok ? "" : O.error, O.ok && (A(""), D.value = g);
        } finally {
          U.value = !1;
        }
      }
    }
    async function K() {
      if (!Z.value) return;
      const J = l.row.job_task_flag ? [l.row.job_task_flag, c.value] : [t.value.trim()];
      await R([...l.row.job_command, String(l.row.id), ...J], "Job sent.");
    }
    async function ee() {
      !V.value || s.value !== "retire" || !r.value.trim() || await R(["agent", "retire", String(l.row.id), "--reason", r.value.trim()], "Agent retired permanently.");
    }
    return (J, g) => {
      var O;
      return T.value ? y("", !0) : (n(), o("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: g[6] || (g[6] = se(() => {
        }, ["stop"])),
        onKeydown: g[7] || (g[7] = se(() => {
        }, ["stop"]))
      }, [
        d("div", Yt, [
          V.value ? (n(), o(I, { key: 0 }, [
            (O = e.row.job_command) != null && O.length ? (n(), W(u(te), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: U.value || F.value || !E.value,
              onClick: m
            }, {
              default: $(() => [...g[8] || (g[8] = [
                k("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : y("", !0),
            e.row.role !== "main" ? (n(), W(u(te), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: U.value || F.value,
              onClick: g[0] || (g[0] = (P) => A("retire"))
            }, {
              default: $(() => [...g[9] || (g[9] = [
                k("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : y("", !0)
          ], 64)) : y("", !0)
        ]),
        x(u(Ne), { value: s.value }, {
          job: $(() => [
            x(Jt, {
              task: c.value,
              "onUpdate:task": g[1] || (g[1] = (P) => c.value = P),
              text: t.value,
              "onUpdate:text": g[2] || (g[2] = (P) => t.value = P),
              row: e.row,
              tasks: C.value,
              pending: U.value,
              loading: F.value,
              "more-tasks": j.value,
              failure: H.value,
              "job-ready": Z.value,
              onSubmit: K,
              onMore: z,
              onCancel: g[3] || (g[3] = (P) => A(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: $(() => [
            x(Fe, {
              reason: r.value,
              "onUpdate:reason": g[4] || (g[4] = (P) => r.value = P),
              pending: U.value,
              onSubmit: ee,
              onCancel: g[5] || (g[5] = (P) => A(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        H.value ? (n(), o("p", Qt, v(H.value), 1)) : y("", !0),
        D.value ? (n(), o("p", Xt, v(D.value), 1)) : y("", !0)
      ], 32));
    };
  }
}, ea = /* @__PURE__ */ Y(_t, [["__scopeId", "data-v-4cb32275"]]), ta = {
  __name: "AgentTip",
  props: { as: { type: String, default: "span" }, place: { type: String, default: "left" } },
  setup(e) {
    return (l, a) => (n(), W(Ee(e.as), {
      type: e.as === "button" ? "button" : void 0,
      class: "tipped"
    }, {
      default: $(() => [
        pe(l.$slots, "default", {}, void 0, !0),
        d("span", {
          class: ne(["tip", e.place]),
          role: "tooltip"
        }, [
          pe(l.$slots, "tip", {}, void 0, !0)
        ], 2)
      ]),
      _: 3
    }, 8, ["type"]));
  }
}, Se = /* @__PURE__ */ Y(ta, [["__scopeId", "data-v-2b33b3fe"]]), aa = { key: 0 }, na = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" } },
  setup(e) {
    const l = /* @__PURE__ */ new Set(["running", "working", "thinking"]), a = e, s = b(() => l.has(a.state)), t = b(() => a.since ? `${a.doing}. ${a.since}` : a.doing);
    return (r, c) => (n(), W(Se, {
      as: "button",
      place: "corner",
      class: ne(["agent-dot", { pulse: s.value }]),
      "data-state": e.state,
      "aria-label": t.value,
      "data-agent-status": "",
      onClick: c[0] || (c[0] = se(() => {
      }, ["stop"]))
    }, {
      tip: $(() => [
        d("b", null, v(e.doing), 1),
        e.since ? (n(), o("span", aa, v(e.since), 1)) : y("", !0)
      ]),
      default: $(() => [
        c[1] || (c[1] = d("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, la = /* @__PURE__ */ Y(na, [["__scopeId", "data-v-cf420188"]]), De = { started: { fill: 33, words: "started" }, testing: { fill: 66, words: "being tested" }, blocked: { fill: 33, words: "blocked" } }, oa = 30, Pe = (e) => e.filter((l) => l.state !== "cancelled");
function sa(e, l) {
  const a = Pe(e), s = De[l == null ? void 0 : l.state];
  return a.length > oa ? { continuous: !0, done: a.filter((c) => c.state === "completed").length / a.length * 100, now: s ? s.fill / 100 / a.length * 100 : 0, segments: [] } : { continuous: !1, done: 0, now: 0, segments: a.map((r) => r.state === "completed" ? { kind: "done", fill: 0 } : r.id === (l == null ? void 0 : l.id) && s ? { kind: "now", fill: s.fill } : { kind: "todo", fill: 0 }) };
}
function ra({ tasks: e, inHand: l, perHour: a }) {
  const s = Pe(e), t = s.filter((M) => M.state === "completed").length, r = De[l == null ? void 0 : l.state], c = s.length - t - (l && l.state !== "completed" ? 1 : 0), C = t === s.length;
  return {
    number: l.id,
    title: l.title,
    count: `${t} of ${s.length}`,
    taskTip: `${t} of its ${s.length} tasks done${r ? `. This one is ${r.words}.` : "."}`,
    countTip: C ? `All ${s.length} tasks done` : `${t} done, 1 in hand, ${c} to go`,
    paceTip: !C && a ? `About ${a} an hour.` : "",
    bar: sa(e, l)
  };
}
const ia = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, ua = {
  class: "task-line",
  "data-agent-task-line": ""
}, da = { key: 0 }, ca = ["data-state"], pa = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, state: { type: String, required: !0 }, perHour: { type: Number, default: 0 } },
  setup(e) {
    const l = e, a = b(() => l.inHand ? ra({ tasks: l.tasks, inHand: l.inHand, perHour: l.perHour }) : null);
    return (s, t) => e.job && !a.value ? (n(), o("span", ia, [
      x(Se, {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: $(() => [
          d("b", null, v(e.job), 1)
        ]),
        default: $(() => [
          t[1] || (t[1] = k("Job", -1))
        ]),
        _: 1
      })
    ])) : a.value ? (n(), o(I, { key: 1 }, [
      d("span", ua, [
        x(Se, {
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${a.value.number}`,
          "aria-label": `Task ${a.value.number}: ${a.value.title}`,
          onClick: t[0] || (t[0] = se((r) => u(Ae)(`tasks:${a.value.number}`), ["stop"]))
        }, {
          tip: $(() => [
            d("b", null, v(a.value.title), 1),
            d("span", null, v(a.value.taskTip), 1)
          ]),
          default: $(() => [
            k("Task " + v(a.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"]),
        x(Se, {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: $(() => [
            d("b", null, v(a.value.countTip), 1),
            a.value.paceTip ? (n(), o("span", da, v(a.value.paceTip), 1)) : y("", !0)
          ]),
          default: $(() => [
            k(v(a.value.count), 1)
          ]),
          _: 1
        })
      ]),
      d("span", {
        class: ne(["bar", { continuous: a.value.bar.continuous }]),
        "data-state": e.state,
        style: de(a.value.bar.continuous ? { "--done": `${a.value.bar.done}%`, "--now": `${a.value.bar.now}%` } : void 0),
        "data-agent-bar": "",
        "aria-hidden": "true"
      }, [
        (n(!0), o(I, null, X(a.value.bar.segments, (r, c) => (n(), o("i", {
          key: c,
          class: ne(r.kind),
          style: de(r.kind === "now" ? { "--fill": `${r.fill}%` } : void 0)
        }, null, 6))), 128))
      ], 14, ca)
    ], 64)) : y("", !0);
  }
}, va = /* @__PURE__ */ Y(pa, [["__scopeId", "data-v-da552fea"]]), ga = ["data-icon", "stroke-width", "innerHTML"], le = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const l = e, a = { right: 0, down: 90, left: 180, up: 270 }, s = {
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
    return (r, c) => (n(), o("svg", {
      class: "ico",
      "data-icon": e.name,
      style: de({
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
      innerHTML: t[s[e.name] || e.name] || t.dot
    }, null, 12, ga));
  }
}, fa = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, ma = {
  key: 1,
  class: "menu-item-text"
}, ha = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (l, a) => (n(), o("button", {
      type: "button",
      class: ne(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (n(), o("span", fa, v(e.checked ? "✓" : ""), 1)) : y("", !0),
      e.description ? (n(), o("span", ma, [
        d("span", null, [
          pe(l.$slots, "default", {}, void 0, !0)
        ]),
        d("small", null, v(e.description), 1)
      ])) : pe(l.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, fe = /* @__PURE__ */ Y(ha, [["__scopeId", "data-v-fec99974"]]), ka = {}, ya = { class: "menu-label" };
function ba(e, l) {
  return n(), o("span", ya, [
    pe(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ke = /* @__PURE__ */ Y(ka, [["render", ba], ["__scopeId", "data-v-aa955b3e"]]), wa = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, Ma = {
  key: 0,
  class: "skills-none"
}, $a = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: l }) {
    const a = e, s = l, t = b(() => a.skills.filter((c) => c.state === "loaded")), r = b(() => a.skills.filter((c) => c.state !== "loaded"));
    return (c, C) => (n(), o("div", wa, [
      x(ke, null, {
        default: $(() => [...C[1] || (C[1] = [
          k("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      t.value.length ? y("", !0) : (n(), o("p", Ma, "None yet. Compacting the conversation empties this list.")),
      (n(!0), o(I, null, X(t.value, (M) => (n(), o("p", {
        key: M.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        x(le, {
          name: "book",
          size: 12
        }),
        k(v(M.skill), 1)
      ]))), 128)),
      r.value.length ? (n(), o(I, { key: 1 }, [
        x(ke, null, {
          default: $(() => [...C[2] || (C[2] = [
            k("Still to read", -1)
          ])]),
          _: 1
        }),
        (n(!0), o(I, null, X(r.value, (M) => (n(), o("p", {
          key: M.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          x(le, {
            name: "book",
            size: 12
          }),
          k(v(M.skill), 1)
        ]))), 128))
      ], 64)) : y("", !0),
      x(fe, {
        "data-agent-skills-browse": "",
        onClick: C[0] || (C[0] = (M) => s("browse"))
      }, {
        default: $(() => [...C[3] || (C[3] = [
          k("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, xa = /* @__PURE__ */ Y($a, [["__scopeId", "data-v-be514d47"]]), Ca = ["disabled", "title"], Sa = { class: "gauge usage" }, Aa = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: l }) {
    const a = e, s = l, t = b(() => a.windows[0] ?? null), r = b(() => t.value ? Math.max(0, Math.min(100, Math.round(t.value.used_percent))) : null);
    return (c, C) => r.value !== null ? (n(), o("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: `${r.value}% of the plan's ${t.value.title} allowance used`,
      onClick: C[0] || (C[0] = (M) => s("open", M.currentTarget))
    }, [
      x(le, {
        name: "allowance",
        size: 12
      }),
      C[1] || (C[1] = k()),
      d("span", Sa, [
        d("span", {
          style: de({ width: `${r.value}%` })
        }, null, 4)
      ]),
      k(" " + v(r.value) + "% ", 1)
    ], 8, Ca)) : y("", !0);
  }
}, Ta = /* @__PURE__ */ Y(Aa, [["__scopeId", "data-v-02e9922e"]]), ja = (e, l, a) => Math.max(l, Math.min(a, e)), Ue = /* @__PURE__ */ new WeakMap(), Oa = (e, l) => Ue.set(e, l);
function Ra(e, l) {
  for (let a = l; a; a = Ue.get(a) ?? a.parentElement) if (a === e) return !0;
  return !1;
}
function Ba(e, l) {
  const a = (s) => {
    var r, c;
    const t = ((r = e.value) == null ? void 0 : r.element) || ((c = e.value) == null ? void 0 : c.$el) || e.value;
    t && !Ra(t, s.target) && l(s);
  };
  window.addEventListener("click", a), ye(() => window.removeEventListener("click", a));
}
const ge = 8, La = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, t = B(null), r = (h) => h ? `${h}px` : void 0, c = b(() => ({
      minWidth: r(s.minWidth),
      maxWidth: r(s.maxWidth),
      maxHeight: r(s.maxHeight),
      height: r(s.height)
    })), C = B({ w: 0, h: 0 }), M = B(s.anchor ? s.anchor.getBoundingClientRect() : null), j = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), F = (h) => ({
      left: Math.max(0, h.left),
      top: Math.max(0, h.top),
      right: Math.min(window.innerWidth, h.right),
      bottom: Math.min(window.innerHeight, h.bottom)
    }), U = (h) => {
      const i = h.closest(".pane, .float-window");
      return i ? F(i.getBoundingClientRect()) : j();
    }, H = (h, i) => `${Math.max(0, h ? Math.min(h, i) : i)}px`;
    function D(h, i) {
      return {
        below: h.bottom - i.bottom - s.gap - ge,
        above: i.top - h.top - s.gap - ge,
        across: h.right - h.left - 2 * ge
      };
    }
    function T(h) {
      const i = U(s.anchor), f = D(i, h);
      return C.value.w <= f.across && C.value.h <= Math.max(f.below, f.above) ? i : j();
    }
    const V = b(() => {
      if (!M.value) return c.value;
      const h = M.value, i = T(h), f = D(i, h), { w: Q, h: S } = C.value, p = s.align === "auto" ? h.left + h.right > i.left + i.right : s.align === "right", w = ja(p ? h.right - Q : h.left, i.left + ge, Math.max(i.left + ge, i.right - Q - ge)), ae = S > f.below && f.above > f.below ? { bottom: `${window.innerHeight - h.top + s.gap}px`, maxHeight: H(s.maxHeight, f.above) } : { top: `${h.bottom + s.gap}px`, maxHeight: H(s.maxHeight, f.below) };
      return { ...c.value, ...ae, left: `${w}px`, maxWidth: H(s.maxWidth, f.across) };
    }), E = a, Z = () => [...t.value.querySelectorAll("button:not(:disabled)")];
    function A(h) {
      const i = Z(), f = i.indexOf(document.activeElement);
      i[(f + h + i.length) % i.length].focus();
    }
    const m = { ArrowDown: () => A(1), ArrowUp: () => A(-1), Escape: () => E("close") }, z = (h) => m[h.key] && (h.preventDefault(), m[h.key]()), R = () => t.value && (C.value = { w: t.value.offsetWidth, h: t.value.scrollHeight });
    let K = 0;
    const ee = new ResizeObserver(() => {
      cancelAnimationFrame(K), K = requestAnimationFrame(R);
    });
    Ba(t, (h) => s.anchor && !s.anchor.contains(h.target) && E("close"));
    const J = (h, i) => ["top", "left", "right", "bottom"].some((f) => Math.abs(h[f] - i[f]) > 1), g = (h) => h.bottom < 0 || h.top > window.innerHeight;
    let O = 0;
    function P() {
      if (s.anchor) {
        const h = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || g(h)) return E("close");
        J(h, M.value) && (M.value = h);
      }
      O = requestAnimationFrame(P);
    }
    return Qe(() => {
      s.anchor && t.value && Oa(t.value, s.anchor), R(), t.value && ee.observe(t.value), !s.plain && Z()[0] && Z()[0].focus(), P();
    }), ye(() => {
      ee.disconnect(), cancelAnimationFrame(O), cancelAnimationFrame(K);
    }), l({ element: t }), (h, i) => (n(), W(Xe, {
      to: "body",
      disabled: !e.anchor
    }, [
      d("div", _e({
        ref_key: "panel",
        ref: t
      }, h.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: V.value,
        onKeydown: z
      }), [
        pe(h.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Ia = /* @__PURE__ */ Y(La, [["__scopeId", "data-v-3d203970"]]);
async function za(e, l, a) {
  if (!e) return a(l);
  const { target: s, fields: t } = e, r = Object.fromEntries(Object.keys(t).map((M) => [M, s[M]])), c = () => Object.assign(s, r);
  Object.assign(s, t);
  let C = !1;
  try {
    const M = await a(l);
    return C = M.ok, M;
  } finally {
    C || c();
  }
}
function Va(e, l, a, { groups: s, programs: t }) {
  const r = B({}), c = B(""), C = B(!1), M = b(() => !!e.value && !e.value.ended_at), j = b(() => M.value && !!e.value.paused_at);
  async function F(T, V = null) {
    c.value = "";
    const E = await za(V, T, l);
    return c.value = E.ok ? "" : E.error, a(), E;
  }
  return { groups: s, programs: t, chosen: r, failure: c, asking: C, running: M, paused: j, choose: (T, V) => F(["agent", "control", String(e.value.id), T, V.value], { target: r, fields: { value: { ...r.value, [T]: V.label } } }), stop: () => (C.value = !1, F(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (T) => F(["agent", "launch", T.name]) };
}
function Ea(e) {
  if (!e) return "Not compacted yet";
  const l = new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return e.start_percent === null ? `Last compacted ${l}` : e.end_percent === null ? `Last compacted ${l}, from ${e.start_percent}%` : `Last compacted ${l}, from ${e.start_percent}% to ${e.end_percent}%, ${e.start_percent - e.end_percent}% taken off`;
}
const Ha = ["disabled", "title"], Na = ["disabled", "title"], Wa = { class: "gauge" }, qa = ["disabled", "title"], Fa = ["disabled"], Da = ["disabled"], Pa = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Ua = ["title"], Ka = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Ja = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Ga = { class: "gauge" }, Za = { class: "context-used" }, Ya = 75, Qa = {
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
    const a = e, s = l, t = Va(Te(a, "agent"), a.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => s("changed"), { groups: Te(a, "controlGroups"), programs: Te(a, "agentPrograms") }), r = B(null), c = B(""), C = b(() => t.groups.value.find((A) => A.key === c.value));
    function M(A, m) {
      r.value = A.currentTarget, c.value = m;
    }
    function j() {
      r.value = null, c.value = "", t.asking.value = !1;
    }
    const F = b(() => a.skills.filter((A) => A.state === "loaded"));
    function U(A) {
      M(A, "skills"), s("skills");
    }
    const H = (A) => t.groups.value.some((m) => m.key === A), D = b(() => {
      var A;
      return t.chosen.value.model ?? ((A = V.value) == null ? void 0 : A.model) ?? "";
    }), T = b(() => {
      var A;
      return t.chosen.value.effort ?? ((A = V.value) == null ? void 0 : A.effort) ?? "";
    });
    b(() => !!a.agent && !a.agent.ended_at);
    const V = b(() => {
      var A;
      return ((A = a.usage.agents) == null ? void 0 : A.find((m) => {
        var z;
        return m.id === ((z = a.agent) == null ? void 0 : z.id);
      })) ?? null;
    }), E = b(() => {
      var A;
      return ((A = V.value) == null ? void 0 : A.context_percent) == null ? null : Math.round(V.value.context_percent);
    }), Z = b(() => {
      var A;
      return (A = V.value) != null && A.cost_dollars ? `$${V.value.cost_dollars.toFixed(2)}` : "";
    });
    return (A, m) => {
      var z;
      return n(), o("div", {
        class: ne(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (n(), o(I, { key: 0 }, [
          d("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: m[0] || (m[0] = (R) => M(R, "agent"))
          }, [
            x(le, {
              name: "agents",
              size: 12
            }),
            k(" " + v(((z = e.agentPrograms.find((R) => R.name === e.agent.program)) == null ? void 0 : z.title) || e.agent.program), 1)
          ], 8, Ha),
          x(Ta, {
            windows: e.usage.windows,
            onOpen: m[1] || (m[1] = (R) => s("open", "usage", R))
          }, null, 8, ["windows"]),
          E.value !== null ? (n(), o("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${E.value}% full: clear or compact it`,
            onClick: m[2] || (m[2] = (R) => H("context") ? M(R, "context") : s("open", "context", R.currentTarget))
          }, [
            x(le, {
              name: "gauge",
              size: 12
            }),
            m[14] || (m[14] = k()),
            d("span", Wa, [
              d("span", {
                style: de({ width: `${E.value}%` })
              }, null, 4)
            ]),
            k(" " + v(E.value) + "% ", 1)
          ], 8, Na)) : y("", !0),
          D.value ? (n(), o("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${D.value}: change the model`,
            onClick: m[3] || (m[3] = (R) => H("model") ? M(R, "model") : null)
          }, [
            x(le, {
              name: "model",
              size: 12
            }),
            k(" " + v(D.value), 1)
          ], 8, qa)) : y("", !0),
          H("effort") || e.card && T.value ? (n(), o("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: m[4] || (m[4] = (R) => M(R, "effort"))
          }, [
            x(le, {
              name: "bolt",
              size: 12
            }),
            k(" " + v(T.value), 1)
          ], 8, Fa)) : y("", !0),
          Z.value ? (n(), o("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: m[5] || (m[5] = (R) => s("open", "cost", R.currentTarget))
          }, v(Z.value), 9, Da)) : y("", !0),
          e.branch ? (n(), o("span", Pa, [
            x(le, {
              name: "branch",
              size: 12
            }),
            k(" " + v(e.branch), 1)
          ])) : y("", !0),
          e.card ? y("", !0) : (n(), o("button", {
            key: 5,
            type: "button",
            class: ne(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: m[6] || (m[6] = (R) => s("open", "jobs", R.currentTarget))
          }, [
            x(le, {
              name: "clock",
              size: 12
            }),
            k(" " + v(e.jobs), 1)
          ], 2)),
          e.run ? (n(), o("button", {
            key: 6,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: U
          }, [
            x(le, {
              name: "book",
              size: 12
            }),
            k(" " + v(F.value.length), 1)
          ])) : y("", !0),
          e.fitness ? (n(), o(I, { key: 7 }, [
            d("button", {
              type: "button",
              class: ne(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Ya }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: m[7] || (m[7] = (R) => s("open", "fitness", R.currentTarget))
            }, [
              x(le, {
                name: "heart",
                size: 12
              }),
              k(" " + v(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            d("button", {
              type: "button",
              class: ne(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: m[8] || (m[8] = (R) => s("open", "load", R.currentTarget))
            }, [
              x(le, {
                name: "weight",
                size: 12
              }),
              k(" " + v(e.fitness.workload), 1)
            ], 2)
          ], 64)) : y("", !0)
        ], 64)) : e.run && !e.loading ? (n(), o("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: m[9] || (m[9] = (R) => M(R, "start"))
        }, [
          x(le, {
            name: "agents",
            size: 12
          }),
          m[15] || (m[15] = k(" Start an agent", -1))
        ])) : y("", !0),
        m[21] || (m[21] = d("span", { class: "space" }, null, -1)),
        u(t).failure.value ? (n(), o("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: u(t).failure.value
        }, v(u(t).failure.value), 9, Ua)) : y("", !0),
        pe(A.$slots, "default", {}, void 0, !0),
        r.value ? (n(), W(Ia, {
          key: 3,
          anchor: r.value,
          "min-width": 190,
          onClose: j
        }, {
          default: $(() => {
            var R;
            return [
              c.value === "agent" ? (n(), o(I, { key: 0 }, [
                u(t).asking.value ? (n(), o(I, { key: 0 }, [
                  x(ke, { "data-agent-stop-ask": "" }, {
                    default: $(() => [...m[16] || (m[16] = [
                      k("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  x(fe, {
                    "data-agent-stop-confirm": "",
                    onClick: m[10] || (m[10] = (K) => (j(), u(t).stop()))
                  }, {
                    default: $(() => [...m[17] || (m[17] = [
                      k("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  x(fe, {
                    onClick: m[11] || (m[11] = (K) => u(t).asking.value = !1)
                  }, {
                    default: $(() => [...m[18] || (m[18] = [
                      k("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (n(), W(fe, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: m[12] || (m[12] = (K) => u(t).asking.value = !0)
                }, {
                  default: $(() => [...m[19] || (m[19] = [
                    k("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : c.value === "start" ? (n(), o(I, { key: 1 }, [
                x(ke, null, {
                  default: $(() => [...m[20] || (m[20] = [
                    k("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (n(!0), o(I, null, X(u(t).programs.value, (K) => (n(), W(fe, {
                  key: K.name,
                  "data-agent-program": K.name,
                  onClick: (ee) => (j(), u(t).start(K))
                }, {
                  default: $(() => [
                    k(v(K.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : c.value === "skills" ? (n(), W(xa, {
                key: 2,
                skills: e.skills,
                onBrowse: m[13] || (m[13] = (K) => (j(), s("open", "skills", null)))
              }, null, 8, ["skills"])) : C.value ? (n(), o(I, { key: 3 }, [
                x(ke, null, {
                  default: $(() => [
                    k(v(C.value.label), 1)
                  ]),
                  _: 1
                }),
                c.value === "context" ? (n(), o(I, { key: 0 }, [
                  d("p", Ka, v(u(Ea)(((R = V.value) == null ? void 0 : R.last_compaction) ?? null)), 1),
                  d("div", Ja, [
                    d("span", Ga, [
                      d("span", {
                        style: de({ width: `${E.value}%` })
                      }, null, 4)
                    ]),
                    d("span", Za, v(E.value) + "%", 1)
                  ])
                ], 64)) : y("", !0),
                (n(!0), o(I, null, X(C.value.choices, (K) => (n(), W(fe, {
                  key: K.value,
                  "data-agent-choice": K.value,
                  onClick: (ee) => (u(t).choose(C.value.key, K), j())
                }, {
                  default: $(() => [
                    k(v(K.label), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-choice", "onClick"]))), 128))
              ], 64)) : y("", !0)
            ];
          }),
          _: 1
        }, 8, ["anchor"])) : y("", !0)
      ], 2);
    };
  }
}, Xa = /* @__PURE__ */ Y(Qa, [["__scopeId", "data-v-12618cc1"]]), _a = ["data-agent-open", "aria-expanded", "role", "tabindex"], en = { class: "agent-head" }, tn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, an = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, nn = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, ln = { class: "agent-line" }, on = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, sn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, rn = {
  key: 1,
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, un = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, dn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const a = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), s = { helper: "Helper", reviewer: "Reviewer" }, t = e, r = l, c = We(), C = b(() => {
      var f, Q;
      if ((f = t.facts) != null && f.profile_title) return t.facts.profile_title;
      if ((Q = t.facts) != null && Q.profile) return t.facts.profile;
      const i = s[t.row.role] || t.row.role;
      return i.slice(0, 1).toUpperCase() + i.slice(1);
    }), M = b(() => {
      var i;
      return ((i = t.facts) == null ? void 0 : i.tasks) ?? [];
    }), j = b(() => M.value.filter((i) => i.state === "open")), F = b(() => M.value.find((i) => {
      var f;
      return i.id === ((f = t.progress) == null ? void 0 : f.task_id) && i.state === "started";
    })), U = b(() => F.value || M.value.find((i) => {
      var f;
      return i.id === ((f = t.facts) == null ? void 0 : f.task_id);
    }) || M.value.find((i) => a.has(i.state)) || j.value[0] || M.value.at(-1)), H = b(() => {
      var i, f, Q, S, p, w;
      return t.row.role === "helper" ? ((i = t.facts) == null ? void 0 : i.helper_job) || "" : (f = t.facts) != null && f.job_enabled && (((Q = F.value) == null ? void 0 : Q.title) || ((S = t.facts) == null ? void 0 : S.task_title) || ((p = j.value[0]) == null ? void 0 : p.title) || ((w = M.value.at(-1)) == null ? void 0 : w.title)) || "";
    }), D = b(() => {
      var i;
      return (i = t.facts) != null && i.job_enabled ? `${t.row.role} ${t.row.id}` : "";
    }), T = b(() => {
      var i, f;
      return [t.row.program, (i = t.facts) == null ? void 0 : i.model, (f = t.facts) == null ? void 0 : f.effort, D.value].filter(Boolean).join(" · ");
    }), V = me(), E = b(() => qe(t.row.process_started_at || t.row.created_at, c.value)), Z = /* @__PURE__ */ new Set(["open", "started", "testing"]), A = b(() => {
      var i;
      return (i = t.facts) == null ? void 0 : i.work_status;
    }), m = b(() => !!t.row.ended_at && t.row.role !== "main" && M.value.some((i) => Z.has(i.state))), z = b(() => {
      var i;
      return t.row.retired_at || t.row.state === "retired" ? "retired" : A.value || t.waitReason || m.value ? "waiting" : t.row.state === "running" && ((i = t.facts) == null ? void 0 : i.state) || t.row.state;
    }), R = b(() => {
      var i;
      return A.value ? `Status: ${A.value}` : t.waitReason ? `Waiting: ${t.waitReason}` : z.value === "blocked" ? (i = t.facts) != null && i.blocked_reason ? `Blocked: ${t.facts.blocked_reason}` : "Blocked" : m.value ? "Stopped with work left" : "";
    }), K = b(() => {
      var i;
      return ((i = t.progress) == null ? void 0 : i.completed_count) ?? M.value.filter((f) => f.state === "completed").length;
    }), ee = b(() => {
      var i;
      return ct(K.value, ((i = t.progress) == null ? void 0 : i.started_at) || t.row.created_at, t.progress ? t.progress.finished_at : t.row.ended_at, c.value);
    }), J = b(() => t.row.role === "main" ? 0 : ee.value), g = b(() => !!t.row.retired_at || t.row.state === "retired"), O = b(() => g.value ? "Retired" : z.value === "blocked" || z.value === "waiting" ? R.value || (z.value === "blocked" ? "Blocked" : "Waiting") : t.row.ended_at ? "Idle: its process has stopped" : "Working"), P = b(() => {
      var f;
      if (g.value) return t.row.retired_at;
      const i = z.value === "blocked" || z.value === "waiting";
      return t.row.ended_at || i && ((f = t.facts) == null ? void 0 : f.last_activity) || t.row.process_started_at || t.row.created_at;
    }), h = b(() => P.value ? `Since ${new Date(P.value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${pt(P.value, c.value)}` : "");
    return (i, f) => {
      var Q, S, p, w, N, ae;
      return n(), o("div", {
        class: ne(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: f[2] || (f[2] = (oe) => !e.open && r("toggle")),
        onKeydown: [
          f[3] || (f[3] = Le(se((oe) => !e.open && r("toggle"), ["self", "prevent"]), ["enter"])),
          f[4] || (f[4] = Le(se((oe) => !e.open && r("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        d("span", en, [
          e.open ? (n(), o("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: f[0] || (f[0] = se((oe) => r("toggle"), ["stop"]))
          }, [
            x(u(be), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : y("", !0),
          d("span", tn, v(C.value), 1),
          d("span", an, v(((Q = e.facts) == null ? void 0 : Q.given_name) || e.row.id), 1),
          e.open ? y("", !0) : (n(), W(u(be), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          e.open ? (n(), o("span", nn, v(E.value), 1)) : y("", !0)
        ]),
        d("span", ln, [
          d("span", on, v(T.value), 1),
          (S = e.facts) != null && S.sandbox_off ? (n(), o("span", sn, "sandbox off")) : y("", !0),
          e.open ? (n(), o("span", rn, [
            f[5] || (f[5] = k("Started ", -1)),
            x(u(ze), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : y("", !0),
          e.open && ((p = e.facts) != null && p.last_activity) ? (n(), o("span", un, [
            f[6] || (f[6] = k("Last heard ", -1)),
            x(u(ze), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : y("", !0)
        ]),
        e.open ? (n(), W(Xa, {
          key: 0,
          "agent-programs": u(V).props.programs.rows.value,
          agent: e.row,
          branch: (w = e.progress) == null ? void 0 : w.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((N = e.facts) == null ? void 0 : N.windows) ?? [] },
          card: ""
        }, {
          default: $(() => [
            x(ea, { row: e.row }, null, 8, ["row"]),
            e.row.role === "helper" && !e.row.ended_at ? (n(), W(u(te), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: f[1] || (f[1] = se((oe) => u(V).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: $(() => [...f[7] || (f[7] = [
                k("Stop", -1)
              ])]),
              _: 1
            })) : y("", !0)
          ]),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : y("", !0),
        e.open ? y("", !0) : (n(), W(va, {
          key: 1,
          tasks: M.value,
          "in-hand": e.row.role !== "helper" && ((ae = e.facts) != null && ae.job_enabled) && U.value || null,
          job: e.row.role === "helper" ? H.value : "",
          state: z.value,
          "per-hour": J.value
        }, null, 8, ["tasks", "in-hand", "job", "state", "per-hour"])),
        x(la, {
          state: z.value,
          doing: O.value,
          since: h.value
        }, null, 8, ["state", "doing", "since"]),
        e.open ? (n(), W(Nt, {
          key: 2,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: M.value,
          "stopped-with-work": m.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : y("", !0)
      ], 42, _a);
    };
  }
}, cn = /* @__PURE__ */ Y(dn, [["__scopeId", "data-v-fd7cb111"]]), pn = ["data-edit-type"], vn = { key: 0 }, gn = { class: "stepper" }, fn = ["disabled", "onClick"], mn = ["value", "disabled", "data-agent-limit-input", "onChange"], hn = ["disabled", "onClick"], kn = { key: 0 }, yn = { key: 1 }, bn = {
  __name: "AgentLimitEditor",
  props: { rows: { type: Array, required: !0 }, pending: Boolean, readOnly: Boolean, environment: { type: String, required: !0 } },
  emits: ["change"],
  setup(e, { emit: l }) {
    const a = l;
    return (s, t) => (n(), o(I, null, [
      t[0] || (t[0] = d("p", null, "How many agents of a type may run at once, and how many may be kept.", -1)),
      (n(!0), o(I, null, X(e.rows, (r) => (n(), o("div", {
        key: r.key,
        class: "edit-row",
        "data-edit-type": r.key
      }, [
        d("div", null, [
          d("strong", null, v(r.per_profile ? "Each helper type" : "Workers"), 1),
          r.per_profile ? (n(), o("small", vn, "Researcher, Planner and the others")) : y("", !0)
        ]),
        (n(!0), o(I, null, X([{ name: "Most running", value: r.run_limit, key: r.run_setting, source: r.run_source, kind: "run" }, { name: "Most kept", value: r.kept_limit, key: r.kept_setting, source: r.kept_source, kind: "kept" }], (c) => (n(), o("label", {
          key: c.key
        }, [
          k(v(c.name), 1),
          d("span", gn, [
            d("button", {
              type: "button",
              disabled: e.pending || e.readOnly || c.value === 0,
              onClick: (C) => a("change", r, c.key, c.value, c.value - 1)
            }, "−", 8, fn),
            d("input", {
              type: "number",
              min: "0",
              value: c.value,
              disabled: e.pending || e.readOnly,
              "data-agent-limit-input": c.kind,
              onChange: (C) => a("change", r, c.key, c.value, C.target.value)
            }, null, 40, mn),
            d("button", {
              type: "button",
              disabled: e.pending || e.readOnly,
              onClick: (C) => a("change", r, c.key, c.value, c.value + 1)
            }, "+", 8, hn)
          ]),
          c.value === 0 ? (n(), o("small", kn, v(c.kind === "run" ? "None can start" : "Any number"), 1)) : c.source === `environment ${e.environment}` ? (n(), o("small", yn, "Changed for " + v(e.environment), 1)) : y("", !0)
        ]))), 128))
      ], 8, pn))), 128))
    ], 64));
  }
}, wn = /* @__PURE__ */ Y(bn, [["__scopeId", "data-v-218442c9"]]), Ke = (e) => e.flatMap((l) => l.per_profile ? l.profiles.map((a) => ({ ...a, label: a.title, type: l.key, key: `${l.key}:${a.profile}` })) : [{ ...l, type: l.key }]), Re = (e, l) => l > 0 && e >= l, Mn = { class: "counts-panel" }, $n = { class: "counts" }, xn = ["data-count-agent"], Cn = { class: "person-text" }, Sn = {
  key: 0,
  class: "helper-head"
}, An = ["data-agent-limit-type", "data-agent-limit-profile", "onClick"], Tn = {
  key: 0,
  class: "bar"
}, jn = {
  key: 5,
  role: "alert"
}, On = {
  key: 6,
  role: "status"
}, Rn = { class: "foot" }, Bn = { class: "foot-note" }, Ln = {
  __name: "AgentCountsPanel",
  props: {
    title: { default: "Agent counts" },
    titleModifiers: {}
  },
  emits: /* @__PURE__ */ tt(["open-agent", "close"], ["update:title"]),
  setup(e, { emit: l }) {
    const a = l, s = et(e, "title"), t = me(), { rows: r, failure: c } = t.props.limits, C = B([]), M = B(0), j = B(!1), F = We(), U = B(null), H = B(!1), D = B(!1), T = B(""), V = B(""), E = B(null), Z = B(""), A = b(() => Ke(r.value)), m = b(() => r.value.find((S) => S.per_profile)), z = b(() => A.value.find((S) => S.key === U.value)), R = b(() => C.value.filter((S) => {
      var p, w;
      return S.state !== "retired" && S.role === ((p = z.value) == null ? void 0 : p.type) && (!z.value.profile || (((w = S.facts) == null ? void 0 : w.profile) || S.profile) === z.value.profile);
    }).sort((S, p) => (S.state !== "running") - (p.state !== "running") || String(S.ended_at || S.created_at).localeCompare(String(p.ended_at || p.created_at)))), K = b(() => {
      var p;
      const S = /* @__PURE__ */ new Map();
      for (const w of R.value) {
        const N = ((p = w.facts) == null ? void 0 : p.model) || w.program_model;
        N && S.set(N, (S.get(N) || 0) + 1);
      }
      return [...S].map(([w, N]) => `${N} ${w}`).join(", ");
    }), ee = (S, p) => p ? `${Math.min(S / Math.max(S, p) * 100, 100)}%` : "0%", J = (S, p) => p && S > p ? `${(S - p) / S * 100}%` : "0%";
    ie(() => {
      var S;
      return H.value ? "Change the maximums" : ((S = z.value) == null ? void 0 : S.label) || "Agent counts";
    }, (S) => {
      s.value = S;
    }, { immediate: !0 });
    async function g(S, p = 1) {
      t.state["count-agents.role"] = S.type, S.profile ? t.state["count-agents.profile"] = S.profile : delete t.state["count-agents.profile"], t.state["count-agents.page"] = String(p), await t.reload("count-agents");
      const w = t.props["count-agents"];
      C.value = p === 1 ? [...w.rows.value] : [...C.value, ...w.rows.value], M.value = p, j.value = w.more.value;
    }
    function O(S) {
      U.value = S.key, C.value = [], g(S);
    }
    function P() {
      H.value = !1, U.value = null, E.value = null, T.value = "";
    }
    function h() {
      P(), a("close");
    }
    async function i(S, p, w, N) {
      if (D.value || t.readOnly) return;
      const ae = Number(N);
      if (!String(N).trim() || !Number.isInteger(ae) || ae < 0) {
        T.value = "Use a whole number of 0 or more.";
        return;
      }
      D.value = !0, T.value = "";
      const oe = await t.run(["setting", "set", p, String(ae), "--environment", t.environment]);
      oe.ok ? (await t.reload("limits"), V.value = "Saved.") : T.value = oe.error, D.value = !1;
    }
    async function f(S) {
      if (!Z.value.trim() || D.value) return;
      D.value = !0;
      const p = await t.run(["agent", "retire", String(S.id), "--reason", Z.value.trim()]);
      T.value = p.ok ? "" : "The agent could not be retired. Try again.", p.ok && (E.value = null, Z.value = "", V.value = "Agent retired permanently.", await t.reload("limits"), await g(z.value)), D.value = !1;
    }
    function Q(S) {
      h(), a("open-agent", S);
    }
    return (S, p) => (n(), o("div", Mn, [
      d("div", $n, [
        H.value || z.value ? (n(), o("button", {
          key: 0,
          class: "back",
          type: "button",
          onClick: P
        }, "‹ Back to the counts")) : y("", !0),
        u(c) ? (n(), o(I, { key: 1 }, [
          p[6] || (p[6] = d("strong", null, "The counts could not be read", -1)),
          p[7] || (p[7] = d("p", null, "The journal did not answer.", -1)),
          x(u(te), {
            small: "",
            onClick: p[0] || (p[0] = (w) => u(t).reload("limits"))
          }, {
            default: $(() => [...p[5] || (p[5] = [
              k("Try again", -1)
            ])]),
            _: 1
          })
        ], 64)) : H.value ? (n(), W(wn, {
          key: 2,
          rows: u(r),
          pending: D.value,
          "read-only": u(t).readOnly,
          environment: u(t).environment,
          onChange: i
        }, null, 8, ["rows", "pending", "read-only", "environment"])) : z.value ? (n(), o(I, { key: 3 }, [
          d("p", null, [
            d("strong", null, v(z.value.running) + " of " + v(z.value.run_limit), 1),
            p[8] || (p[8] = k(" running, ", -1)),
            d("strong", null, [
              k(v(z.value.kept), 1),
              z.value.kept_limit ? (n(), o(I, { key: 0 }, [
                k(" of " + v(z.value.kept_limit), 1)
              ], 64)) : y("", !0)
            ]),
            p[9] || (p[9] = k(" kept", -1))
          ]),
          d("p", null, v(K.value), 1),
          R.value.length ? y("", !0) : (n(), o(I, { key: 0 }, [
            p[10] || (p[10] = d("strong", null, "No agents here yet", -1)),
            p[11] || (p[11] = d("p", null, "An agent shows here as soon as one of this type starts.", -1))
          ], 64)),
          (n(!0), o(I, null, X(R.value, (w) => {
            var N, ae, oe, he, we;
            return n(), o("div", {
              key: w.id,
              class: "person",
              "data-count-agent": w.id
            }, [
              d("span", {
                class: ne(["dot", { running: w.state === "running" }])
              }, null, 2),
              d("div", Cn, [
                d("strong", null, v(((N = w.facts) == null ? void 0 : N.given_name) || w.id), 1),
                k(" " + v(w.state === "running" ? "Running" : "Idle") + ", " + v(u(qe)(w.state === "running" ? w.process_started_at || w.created_at : w.ended_at, u(F))), 1),
                d("small", null, v([w.program, (ae = w.facts) == null ? void 0 : ae.model, (oe = w.facts) == null ? void 0 : oe.effort, `${w.role} ${w.id}`].filter(Boolean).join(", ")), 1),
                d("small", null, v(((he = w.facts) == null ? void 0 : he.task_title) || ((we = w.facts) == null ? void 0 : we.helper_job)), 1)
              ]),
              x(u(te), {
                small: "",
                onClick: (ce) => Q(w)
              }, {
                default: $(() => [...p[12] || (p[12] = [
                  k("Open", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              w.state === "idle" && !u(t).readOnly ? (n(), W(u(te), {
                key: 0,
                small: "",
                onClick: (ce) => {
                  E.value = w.id, Z.value = "";
                }
              }, {
                default: $(() => [...p[13] || (p[13] = [
                  k("Retire", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : y("", !0),
              E.value === w.id ? (n(), W(Fe, {
                key: 1,
                reason: Z.value,
                "onUpdate:reason": p[1] || (p[1] = (ce) => Z.value = ce),
                pending: D.value,
                onSubmit: (ce) => f(w),
                onCancel: p[2] || (p[2] = (ce) => E.value = null)
              }, null, 8, ["reason", "pending", "onSubmit"])) : y("", !0)
            ], 8, xn);
          }), 128)),
          j.value ? (n(), W(u(te), {
            key: 1,
            small: "",
            onClick: p[3] || (p[3] = (w) => g(z.value, M.value + 1))
          }, {
            default: $(() => [...p[14] || (p[14] = [
              k("Show more", -1)
            ])]),
            _: 1
          })) : y("", !0)
        ], 64)) : (n(), o(I, { key: 4 }, [
          p[16] || (p[16] = d("p", null, "Kept agents have not been retired, so they can take another job. Open an item to see them.", -1)),
          p[17] || (p[17] = d("div", { class: "columns" }, [
            d("span", null, "Name"),
            d("span", null, "Running"),
            d("span", null, "Kept"),
            d("span")
          ], -1)),
          m.value ? (n(), o("div", Sn, [
            p[15] || (p[15] = d("strong", null, "Helpers", -1)),
            d("span", null, v(m.value.running) + " running, " + v(m.value.kept) + " kept", 1)
          ])) : y("", !0),
          (n(!0), o(I, null, X(A.value, (w) => (n(), o("button", {
            key: w.key,
            type: "button",
            class: "count-row",
            "data-agent-limit-type": w.type || w.key,
            "data-agent-limit-profile": w.profile,
            onClick: (N) => O(w)
          }, [
            d("strong", null, v(w.label), 1),
            (n(!0), o(I, null, X([{ count: w.running, limit: w.run_limit, unlimited: !1 }, { count: w.kept, limit: w.kept_limit, unlimited: !0 }], (N) => (n(), o("span", {
              key: N.unlimited,
              class: ne({ full: u(Re)(N.count, N.limit) })
            }, [
              d("span", null, [
                k(v(N.count), 1),
                N.limit || !N.unlimited ? (n(), o(I, { key: 0 }, [
                  k(" of " + v(N.limit), 1)
                ], 64)) : y("", !0)
              ]),
              N.limit ? (n(), o("span", Tn, [
                d("span", {
                  style: de({ width: ee(N.count, N.limit) })
                }, null, 4),
                d("i", {
                  style: de({ width: J(N.count, N.limit) })
                }, null, 4)
              ])) : y("", !0)
            ], 2))), 128)),
            x(u(be), {
              name: "chevronRight",
              size: 12
            })
          ], 8, An))), 128))
        ], 64)),
        T.value ? (n(), o("p", jn, v(T.value), 1)) : V.value ? (n(), o("p", On, v(V.value), 1)) : y("", !0)
      ]),
      d("div", Rn, [
        H.value ? (n(), o(I, { key: 0 }, [
          d("span", Bn, v(V.value || `Changes apply to ${u(t).environment}.`), 1),
          x(u(te), { onClick: P }, {
            default: $(() => [...p[18] || (p[18] = [
              k("Done", -1)
            ])]),
            _: 1
          })
        ], 64)) : z.value ? y("", !0) : (n(), W(u(te), {
          key: 1,
          disabled: u(t).readOnly,
          "data-agent-limits-edit": "",
          onClick: p[4] || (p[4] = (w) => H.value = !0)
        }, {
          default: $(() => [...p[19] || (p[19] = [
            k("Change the maximums", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]))
      ])
    ]));
  }
}, In = /* @__PURE__ */ Y(Ln, [["__scopeId", "data-v-de3d902c"]]), zn = {
  key: 0,
  class: "badge",
  "data-agent-count-badge": ""
}, Vn = {
  __name: "AgentLimits",
  emits: ["open-agent"],
  setup(e, { emit: l }) {
    const a = l, s = me(), t = B(!1), r = B("Agent counts"), c = b(() => Ke(s.props.limits.rows.value).filter((M) => Re(M.running, M.run_limit) || Re(M.kept, M.kept_limit)).length);
    function C(M) {
      t.value = !1, a("open-agent", M);
    }
    return (M, j) => (n(), o(I, null, [
      d("button", {
        class: "counts-button",
        type: "button",
        title: "Agent counts",
        "aria-label": "Agent counts",
        "data-agent-counts": "",
        onClick: j[0] || (j[0] = (F) => t.value = !0)
      }, [
        x(u(be), {
          name: "settings",
          size: 16
        }),
        c.value ? (n(), o("span", zn, v(c.value), 1)) : y("", !0)
      ]),
      t.value ? (n(), W(u(vt), {
        key: 0,
        title: r.value,
        modal: "",
        fits: "",
        onClose: j[3] || (j[3] = (F) => t.value = !1),
        onEscape: j[4] || (j[4] = (F) => t.value = !1)
      }, {
        default: $(() => [
          x(In, {
            title: r.value,
            "onUpdate:title": j[1] || (j[1] = (F) => r.value = F),
            onOpenAgent: C,
            onClose: j[2] || (j[2] = (F) => t.value = !1)
          }, null, 8, ["title"])
        ]),
        _: 1
      }, 8, ["title"])) : y("", !0)
    ], 64));
  }
}, En = /* @__PURE__ */ Y(Vn, [["__scopeId", "data-v-4094dc8b"]]), Hn = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Nn = ["data-agent-row"], Ve = "journal.agents.filters", Ce = "cubic-bezier(0.2, 0.9, 0.25, 1)", Wn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const l = e, a = me(), { rows: s } = a.props.waits, { rows: t } = a.props.progress, { rows: r, failure: c, loaded: C, more: M } = a.props.agents, j = (q) => t.value.find((G) => G.agent_id === q.id) ?? null, F = (q) => {
      var G;
      return ((G = s.value.find((L) => L.agent_id === q.id)) == null ? void 0 : G.reason) ?? "";
    }, U = B("running"), H = B(""), D = JSON.parse(localStorage.getItem(Ve) || '{"roles":[],"profiles":[],"programs":[]}'), T = B(D), V = b(() => a.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: E } = a.props.programs, Z = b(() => T.value.roles.length + T.value.profiles.length + T.value.programs.length), A = (q, G) => {
      T.value = ht(T.value, q, G);
    }, m = () => {
      T.value = { roles: [], profiles: [], programs: [] };
    }, z = (q) => q.slice(0, 1).toUpperCase() + q.slice(1);
    ie(T, (q) => localStorage.setItem(Ve, JSON.stringify(q)));
    const R = B(25);
    function K() {
      Object.assign(a.state, {
        "agents.show": U.value,
        "agents.search": H.value,
        "agents.limit": String(R.value),
        "agents.roles": T.value.roles.join(","),
        "agents.profiles": T.value.profiles.join(","),
        "agents.programs": T.value.programs.join(",")
      });
    }
    async function ee() {
      return R.value += 25, K(), await a.reload("agents"), !0;
    }
    ie([U, H, T], () => {
      R.value = 25, K(), a.reload("agents");
    }), K();
    const J = (q) => q.facts ?? null, g = r, O = b(() => !!H.value.trim() || Z.value > 0), P = b(() => l.texts[U.value] ?? { title: l.empty, hint: "" }), h = B(null), i = B(null), f = B(null), Q = B(null), S = b(() => h.value === null ? null : a.props[`card.${h.value}`].rows.value.find((q) => q.id === h.value) ?? i.value), p = b(() => S.value ? [S.value] : g.value), w = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let N = !1, ae = 0;
    async function oe(q) {
      if (N) return;
      N = !0, ae = Q.value.scrollTop;
      const G = f.value.querySelector(`[data-agent-open="${q.id}"]`);
      if (!w()) {
        const ue = [...f.value.querySelectorAll(".agent-row")].filter((re) => !re.contains(G));
        await Promise.all(ue.map((re) => re.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const L = [...G.querySelectorAll(".agent-head, .agent-line")], _ = [...L, ...G.querySelectorAll("[data-agent-motion]")], Me = _.map((ue) => ue.getBoundingClientRect());
      if (i.value = q, h.value = q.id, a.reload(`card.${q.id}`), await Ie(), !w()) {
        const ue = _.map((re) => re.getBoundingClientRect());
        _.forEach((re, $e) => {
          const ve = L.indexOf(re.parentElement), Je = Me[$e].left - ue[$e].left - (ve < 0 ? 0 : Me[ve].left - ue[ve].left), Ge = Me[$e].top - ue[$e].top - (ve < 0 ? 0 : Me[ve].top - ue[ve].top);
          re.animate([{ transform: `translate(${Je}px, ${Ge}px)` }, { transform: "none" }], { duration: 280, easing: Ce });
        }), f.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((re) => {
          re.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Ce, fill: "backwards" });
        });
      }
      N = !1;
    }
    async function he() {
      if (N || !S.value) return;
      N = !0;
      const q = f.value.querySelector(`[data-agent-open="${h.value}"]`), G = [...q.children], L = w() ? [] : G.map((_) => _.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(L.map((_) => _.finished)), h.value = null, await Ie(), Q.value.scrollTop = ae, L.forEach((_) => _.cancel()), w() || (q.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Ce }), f.value.querySelectorAll(".agent-row").forEach((_) => {
        _.contains(q) || _.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Ce });
      })), N = !1;
    }
    function we(q) {
      i.value = q, h.value = q.id, a.reload(`card.${q.id}`);
    }
    const ce = (q) => h.value === q.id ? he() : oe(q);
    ie(H, (q) => q.trim() && (h.value = null)), ie(U, () => {
      h.value = null;
    });
    const Be = (q) => {
      q.key === "Escape" && he();
    };
    return window.addEventListener("keydown", Be), ye(() => window.removeEventListener("keydown", Be)), (q, G) => (n(), o("div", {
      ref_key: "agents",
      ref: f,
      class: ne(["agents", { focused: S.value }])
    }, [
      x(u(gt), {
        modelValue: H.value,
        "onUpdate:modelValue": G[1] || (G[1] = (L) => H.value = L),
        placeholder: "Search agents",
        "menu-count": Z.value,
        "data-agents-search": ""
      }, {
        menu: $(() => [
          x(u(je), null, {
            default: $(() => [...G[2] || (G[2] = [
              k("Type", -1)
            ])]),
            _: 1
          }),
          (n(!0), o(I, null, X(V.value.roles, (L) => (n(), W(u(xe), {
            key: L,
            role: "menuitemcheckbox",
            "aria-checked": T.value.roles.includes(L),
            checked: T.value.roles.includes(L),
            "data-filter-role": L,
            onClick: (_) => A("roles", L)
          }, {
            default: $(() => [
              k(v(z(L)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          V.value.profiles.length ? (n(), W(u(je), { key: 0 }, {
            default: $(() => [...G[3] || (G[3] = [
              k("Profile", -1)
            ])]),
            _: 1
          })) : y("", !0),
          (n(!0), o(I, null, X(V.value.profiles, (L) => (n(), W(u(xe), {
            key: L.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.profiles.includes(L.name),
            checked: T.value.profiles.includes(L.name),
            "data-filter-profile": L.name,
            onClick: (_) => A("profiles", L.name)
          }, {
            default: $(() => [
              k(v(L.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          x(u(je), null, {
            default: $(() => [...G[4] || (G[4] = [
              k("Program", -1)
            ])]),
            _: 1
          }),
          (n(!0), o(I, null, X(u(E), (L) => (n(), W(u(xe), {
            key: L.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.programs.includes(L.name),
            checked: T.value.programs.includes(L.name),
            "data-filter-program": L.name,
            onClick: (_) => A("programs", L.name)
          }, {
            default: $(() => [
              k(v(L.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          Z.value ? (n(), W(u(xe), {
            key: 1,
            "data-filter-clear": "",
            onClick: m
          }, {
            default: $(() => [...G[5] || (G[5] = [
              k("Clear filters", -1)
            ])]),
            _: 1
          })) : y("", !0)
        ]),
        default: $(() => [
          x(u(ft), {
            options: V.value.states,
            value: U.value,
            onPick: G[0] || (G[0] = (L) => U.value = L)
          }, null, 8, ["options", "value"]),
          x(En, { onOpenAgent: we })
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      U.value === "retired" && V.value.upgrade_retired ? (n(), o("p", Hn, "Retired during the upgrade: " + v(V.value.upgrade_retired), 1)) : y("", !0),
      d("div", {
        ref_key: "list",
        ref: Q,
        class: ne(["agents-view", { "agents-view-open": S.value }])
      }, [
        u(C) && !u(c) && !p.value.length && Z.value ? (n(), W(u(Oe), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: $(() => [
            x(u(te), {
              small: "",
              "data-empty-clear": "",
              onClick: m
            }, {
              default: $(() => [...G[6] || (G[6] = [
                k("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (n(), W(u(mt), {
          key: 1,
          rows: p.value,
          failure: u(c),
          loaded: u(C),
          more: !S.value && u(M),
          older: ee,
          empty: P.value.title,
          hint: P.value.hint,
          searching: O.value
        }, {
          default: $(({ row: L }) => [
            d("div", {
              class: "agent-row",
              "data-agent-row": L.id
            }, [
              x(cn, {
                row: L,
                facts: J(L),
                progress: j(L),
                "wait-reason": F(L),
                open: L.id === h.value,
                onToggle: (_) => ce(L)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, Nn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, Pn = /* @__PURE__ */ Y(Wn, [["__scopeId", "data-v-06777d49"]]);
export {
  Pn as A
};
