/* @code-commandments-generated */
import { openBlock as t, createElementBlock as o, withModifiers as le, unref as u, createTextVNode as k, toDisplayString as g, createVNode as $, createBlock as F, withCtx as S, Fragment as E, renderList as X, createElementVNode as v, createCommentVNode as h, computed as b, ref as O, watch as re, onUnmounted as ke, defineAsyncComponent as Ue, createSlots as Ke, resolveDynamicComponent as Je, normalizeClass as oe, normalizeStyle as ge, renderSlot as ye, onMounted as Ze, Teleport as Ge, mergeProps as Ye, toRef as Ae, withKeys as Oe, useModel as Qe, mergeModels as Xe, nextTick as Le } from "vue";
import { peekRef as Se, Icon as be, RunningCommand as _e, FoldGroup as He, TaskStatusIcon as et, useWindow as me, loadWindowComponent as tt, coalesced as at, READ_RATES as nt, InnerTabs as lt, TabBody as ot, SwitchCase as Ie, EmptyState as Te, Btn as ae, TextArea as st, TextInput as rt, useNow as Ee, age as Ne, perHour as it, ago as ut, TimeAgo as ze, Dialog as dt, SearchBar as ct, Segmented as vt, MenuLabel as je, MenuItem as xe, RowList as pt, toggleFilter as gt } from "@journal/window-kit";
import { _ as Q, T as mt } from "./TranscriptRows-DfA-cZXn.js";
const ft = {
  class: "agent-command",
  "data-agent-command": ""
}, ht = {
  key: 1,
  "data-agent-stopped": ""
}, kt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (s, n) => (t(), o("span", ft, [
      e.waitReason ? (t(), o("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: n[0] || (n[0] = le((a) => u(Se)("test_queue:0"), ["stop"]))
      }, [
        k("Waiting: " + g(e.waitReason) + " ", 1),
        $(u(be), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (t(), o("span", ht, "Waiting")) : (t(), F(u(_e), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, yt = /* @__PURE__ */ Q(kt, [["__scopeId", "data-v-1b371fb5"]]), bt = ["data-agent-delegated", "onClick"], wt = { class: "agent-task-number" }, Mt = { class: "agent-task-title" }, $t = ["title"], xt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: s }) {
    const n = s;
    return (a, r) => (t(), F(u(He), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: r[0] || (r[0] = (d) => n("toggle"))
    }, {
      default: S(() => [
        (t(!0), o(E, null, X(e.section.tasks, (d) => (t(), o("button", {
          key: d.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": d.id,
          onClick: (f) => u(Se)(`tasks:${d.id}`)
        }, [
          $(u(et), {
            status: d.state
          }, null, 8, ["status"]),
          v("span", wt, g(d.id), 1),
          v("span", Mt, g(d.title), 1),
          d.plan_id ? (t(), o("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${d.plan_id}: ${d.plan_title}`
          }, "Plan " + g(d.plan_id) + ": " + g(d.plan_title), 9, $t)) : h("", !0)
        ], 8, bt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Ct = /* @__PURE__ */ Q(xt, [["__scopeId", "data-v-238ff959"]]), St = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, At = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, jt = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, Tt = ["data-peek", "onClick"], Rt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Bt = {
  key: 0,
  class: "agent-helper-brief"
}, Ot = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Lt = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, zt = "It ended without a report", Vt = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const s = e, n = ["started", "blocked", "open", "completed"], a = b(() => {
      var p, R;
      return s.row.ended_at && ((R = (p = s.facts) == null ? void 0 : p.job_returned) != null && R.startsWith(zt)) ? s.facts.job_returned : "";
    }), r = b(() => s.tasks.length ? n.map((p) => ({ state: p, label: p.slice(0, 1).toUpperCase() + p.slice(1), tasks: s.tasks.filter((R) => R.state === p || p === "started" && R.state === "testing" || p === "completed" && R.state === "cancelled") })) : []), d = /* @__PURE__ */ new Set(["completed"]), f = O({}), y = (p) => !(f.value[p] ?? d.has(p)), x = (p) => f.value = { ...f.value, [p]: y(p) }, A = me(), { rows: q } = A.props.reports;
    A.state["reports.agent"] = String(s.row.id);
    const D = b(() => s.row.access === "read-only"), z = b(() => !!s.row.retired_at || s.row.state === "retired"), P = ["tasks", "transcript", "terminal", "file-feed", "reports"], j = b(() => (z.value ? A.tabs.filter((R) => ["reports", "transcript"].includes(R.key)) : D.value ? A.tabs.filter((R) => ["reports", "transcript", "terminal"].includes(R.key)) : [...A.tabs]).sort((R, J) => (P.indexOf(R.key) < 0 ? P.length : P.indexOf(R.key)) - (P.indexOf(J.key) < 0 ? P.length : P.indexOf(J.key)))), V = () => D.value || z.value ? j.value.find((p) => p.key === "transcript") : j.value[0], H = O(V());
    re(H, (p) => {
      A.state.tab = (p == null ? void 0 : p.key) ?? "";
    }, { immediate: !0 }), ke(() => {
      A.state.tab = "";
    }), re(j, (p) => {
      p.some((R) => {
        var J;
        return R.key === ((J = H.value) == null ? void 0 : J.key);
      }) || (H.value = p[0]);
    }), re(() => s.open, (p) => {
      p && (H.value = V());
    });
    const G = Object.fromEntries(A.tabs.filter((p) => p.component).map((p) => [p.key, Ue(() => tt(p.component))])), C = O(!1), { data: m } = A.props.tool, I = b(() => {
      var p;
      return ((p = m.value) == null ? void 0 : p.tool) ?? "";
    }), T = b(() => {
      var p;
      return ((p = m.value) == null ? void 0 : p.note) ?? "";
    }), U = b(() => s.row.role !== "main" && (!s.row.ended_at || s.stoppedWithWork || s.waitReason));
    async function _() {
      !s.open || !U.value || (A.state["tool.agent"] = String(s.row.id), await A.reload("tool"));
    }
    const K = A.follow(["hook_call.*", "process_part.*"], at(_, nt.agentCommand));
    return ke(() => K == null ? void 0 : K()), re(() => s.open, (p) => {
      p && _();
    }, { immediate: !0 }), (p, R) => {
      var J;
      return t(), o("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: R[2] || (R[2] = le(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (t(), o("p", St, "Retirement reason: " + g(e.row.retirement_reason), 1)) : h("", !0),
        e.row.resume_reason ? (t(), o("p", At, g(e.row.resume_reason), 1)) : h("", !0),
        U.value ? (t(), F(yt, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: I.value,
          note: T.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : h("", !0),
        a.value ? (t(), o("p", jt, g(a.value), 1)) : h("", !0),
        $(u(lt), {
          class: "agent-tabs",
          tabs: j.value,
          active: H.value,
          answer: { tasks: e.tasks.length, reports: u(q).length },
          onChoose: R[0] || (R[0] = (l) => H.value = l)
        }, null, 8, ["tabs", "active", "answer"]),
        $(u(ot), {
          class: "agent-tab-body",
          tab: H.value,
          "data-agent-tab-body": (J = H.value) == null ? void 0 : J.key
        }, {
          default: S(() => {
            var l;
            return [
              $(u(Ie), {
                value: (l = H.value) == null ? void 0 : l.key
              }, Ke({
                reports: S(() => [
                  u(q).length ? h("", !0) : (t(), F(u(Te), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: S(() => [...R[3] || (R[3] = [
                      k("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (t(!0), o(E, null, X(u(q), (i) => (t(), o("button", {
                    key: i.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${i.id}`,
                    onClick: (B) => u(Se)(`messages:${i.id}`)
                  }, g(i.text), 9, Tt))), 128))
                ]),
                tasks: S(() => {
                  var i;
                  return [
                    e.tasks.length ? h("", !0) : (t(), F(u(Te), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: S(() => [...R[4] || (R[4] = [
                        k("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (t(!0), o(E, null, X(r.value, (B) => (t(), F(Ct, {
                      key: B.state,
                      section: B,
                      open: y(B.state),
                      onToggle: (ee) => x(B.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (i = e.facts) != null && i.instruction ? (t(), o(E, { key: 1 }, [
                      R[5] || (R[5] = v("p", { class: "agent-label" }, "Instruction", -1)),
                      v("div", Rt, g(e.facts.instruction), 1)
                    ], 64)) : h("", !0)
                  ];
                }),
                transcript: S(() => {
                  var i;
                  return [
                    D.value ? (t(), o(E, { key: 0 }, [
                      (i = e.facts) != null && i.instruction ? (t(), o("div", Bt, [
                        $(u(He), {
                          label: "Instruction",
                          open: C.value,
                          "data-agent-section": "instruction",
                          onToggle: R[1] || (R[1] = (B) => C.value = !C.value)
                        }, {
                          default: S(() => [
                            v("div", Ot, g(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (t(), o("p", Lt, "No job recorded")) : h("", !0)
                    ], 64)) : h("", !0),
                    $(mt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                X(u(G), (i, B) => ({
                  name: B,
                  fn: S(() => [
                    (t(), F(Je(i), {
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
}, Ht = /* @__PURE__ */ Q(Vt, [["__scopeId", "data-v-3f66c406"]]), It = { class: "action-field" }, Et = ["value", "disabled"], Nt = ["value"], Wt = { key: 1 }, qt = {
  key: 1,
  class: "action-field"
}, Ft = { class: "action-buttons" }, Pt = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (s, n) => (t(), o("form", {
      onSubmit: n[4] || (n[4] = le((a) => s.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (t(), o(E, { key: 0 }, [
        v("label", It, [
          n[6] || (n[6] = k("Task ", -1)),
          v("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: n[0] || (n[0] = (a) => s.$emit("update:task", a.target.value))
          }, [
            n[5] || (n[5] = v("option", { value: "" }, "Choose an open task", -1)),
            (t(!0), o(E, null, X(e.tasks, (a) => (t(), o("option", {
              key: a.id,
              value: String(a.id)
            }, g(a.id) + ": " + g(a.title), 9, Nt))), 128))
          ], 40, Et)
        ]),
        e.moreTasks ? (t(), F(u(ae), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: n[1] || (n[1] = (a) => s.$emit("more"))
        }, {
          default: S(() => [...n[7] || (n[7] = [
            k("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : h("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (t(), o("p", Wt, "No open tasks.")) : h("", !0)
      ], 64)) : (t(), o("label", qt, [
        n[8] || (n[8] = k("Job", -1)),
        $(u(st), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: n[2] || (n[2] = (a) => s.$emit("update:text", a.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      v("div", Ft, [
        $(u(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: S(() => [...n[9] || (n[9] = [
            k("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        $(u(ae), {
          small: "",
          disabled: e.pending,
          onClick: n[3] || (n[3] = (a) => s.$emit("cancel"))
        }, {
          default: S(() => [...n[10] || (n[10] = [
            k("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Dt = /* @__PURE__ */ Q(Pt, [["__scopeId", "data-v-adde4158"]]), Ut = { class: "action-buttons" }, Kt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (s, n) => (t(), o("form", {
      "data-agent-retire-confirm": "",
      onSubmit: n[2] || (n[2] = le((a) => s.$emit("submit"), ["prevent"]))
    }, [
      n[5] || (n[5] = v("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      $(u(rt), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": n[0] || (n[0] = (a) => s.$emit("update:reason", a))
      }, null, 8, ["model-value", "disabled"]),
      v("div", Ut, [
        $(u(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: S(() => [...n[3] || (n[3] = [
            k("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        $(u(ae), {
          small: "",
          disabled: e.pending,
          onClick: n[1] || (n[1] = (a) => s.$emit("cancel"))
        }, {
          default: S(() => [...n[4] || (n[4] = [
            k("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, We = /* @__PURE__ */ Q(Kt, [["__scopeId", "data-v-23a905c0"]]), Jt = { class: "action-buttons" }, Zt = {
  key: 0,
  role: "alert"
}, Gt = {
  key: 1,
  role: "status"
}, Yt = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const s = e, n = me(), a = O(""), r = O(""), d = O(""), f = O(""), y = O([]), x = O(0), A = O(!1), q = O(!1), D = O(!1), z = O(""), P = O(""), j = b(() => !!s.row.retired_at || s.row.state === "retired"), V = b(() => !j.value && !!s.row.ended_at), H = b(() => {
      var K;
      return V.value && ((K = s.row.job_command) == null ? void 0 : K.length) && !s.row.resume_reason;
    }), G = b(() => H.value && !q.value && (s.row.job_task_flag ? y.value.some((K) => String(K.id) === f.value) : !!r.value.trim()));
    function C(K) {
      a.value = K, r.value = "", d.value = "", f.value = "", z.value = "", P.value = "";
    }
    async function m() {
      C("job"), s.row.job_task_flag && (y.value = [], x.value = 0, A.value = !1, await I());
    }
    async function I() {
      if (!q.value) {
        q.value = !0;
        try {
          n.state["jobs.page"] = String(x.value + 1), await n.reload("jobs");
          const K = n.props.jobs;
          z.value = K.failure.value, z.value || (y.value = [...y.value, ...K.rows.value], x.value = K.data.value.page, A.value = K.more.value);
        } finally {
          q.value = !1;
        }
      }
    }
    async function T(K, p) {
      if (!D.value) {
        D.value = !0, z.value = "";
        try {
          const R = await n.run(K);
          z.value = R.ok ? "" : R.error, R.ok && (C(""), P.value = p);
        } finally {
          D.value = !1;
        }
      }
    }
    async function U() {
      if (!G.value) return;
      const K = s.row.job_task_flag ? [s.row.job_task_flag, f.value] : [r.value.trim()];
      await T([...s.row.job_command, String(s.row.id), ...K], "Job sent.");
    }
    async function _() {
      !V.value || a.value !== "retire" || !d.value.trim() || await T(["agent", "retire", String(s.row.id), "--reason", d.value.trim()], "Agent retired permanently.");
    }
    return (K, p) => {
      var R;
      return j.value ? h("", !0) : (t(), o("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: p[6] || (p[6] = le(() => {
        }, ["stop"])),
        onKeydown: p[7] || (p[7] = le(() => {
        }, ["stop"]))
      }, [
        v("div", Jt, [
          V.value ? (t(), o(E, { key: 0 }, [
            (R = e.row.job_command) != null && R.length ? (t(), F(u(ae), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: D.value || q.value || !H.value,
              onClick: m
            }, {
              default: S(() => [...p[8] || (p[8] = [
                k("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0),
            e.row.role !== "main" ? (t(), F(u(ae), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: D.value || q.value,
              onClick: p[0] || (p[0] = (J) => C("retire"))
            }, {
              default: S(() => [...p[9] || (p[9] = [
                k("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0)
          ], 64)) : h("", !0)
        ]),
        $(u(Ie), { value: a.value }, {
          job: S(() => [
            $(Dt, {
              task: f.value,
              "onUpdate:task": p[1] || (p[1] = (J) => f.value = J),
              text: r.value,
              "onUpdate:text": p[2] || (p[2] = (J) => r.value = J),
              row: e.row,
              tasks: y.value,
              pending: D.value,
              loading: q.value,
              "more-tasks": A.value,
              failure: z.value,
              "job-ready": G.value,
              onSubmit: U,
              onMore: I,
              onCancel: p[3] || (p[3] = (J) => C(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: S(() => [
            $(We, {
              reason: d.value,
              "onUpdate:reason": p[4] || (p[4] = (J) => d.value = J),
              pending: D.value,
              onSubmit: _,
              onCancel: p[5] || (p[5] = (J) => C(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        z.value ? (t(), o("p", Zt, g(z.value), 1)) : h("", !0),
        P.value ? (t(), o("p", Gt, g(P.value), 1)) : h("", !0)
      ], 32));
    };
  }
}, Qt = /* @__PURE__ */ Q(Yt, [["__scopeId", "data-v-4cb32275"]]), Xt = ["data-state", "aria-label"], _t = {
  class: "tip",
  role: "tooltip",
  "data-agent-status-tip": ""
}, ea = { key: 0 }, ta = {
  __name: "AgentStatusDot",
  props: { state: { type: String, required: !0 }, doing: { type: String, required: !0 }, since: { type: String, default: "" } },
  setup(e) {
    const s = /* @__PURE__ */ new Set(["running", "working", "thinking"]), n = e, a = b(() => s.has(n.state)), r = b(() => n.since ? `${n.doing}. ${n.since}` : n.doing);
    return (d, f) => (t(), o("button", {
      type: "button",
      class: oe(["agent-dot", { pulse: a.value }]),
      "data-state": e.state,
      "aria-label": r.value,
      "data-agent-status": "",
      onClick: f[0] || (f[0] = le(() => {
      }, ["stop"]))
    }, [
      f[1] || (f[1] = v("i", null, null, -1)),
      v("span", _t, [
        v("b", null, g(e.doing), 1),
        e.since ? (t(), o("span", ea, g(e.since), 1)) : h("", !0)
      ])
    ], 10, Xt));
  }
}, aa = /* @__PURE__ */ Q(ta, [["__scopeId", "data-v-c775f21d"]]), na = ["data-icon", "stroke-width", "innerHTML"], ne = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const s = e, n = { right: 0, down: 90, left: 180, up: 270 }, a = {
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
    }, r = {
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
    return (d, f) => (t(), o("svg", {
      class: "ico",
      "data-icon": e.name,
      style: ge({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...s.facing === "right" ? {} : { transform: `rotate(${n[s.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: r[a[e.name] || e.name] || r.dot
    }, null, 12, na));
  }
}, la = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, oa = {
  key: 1,
  class: "menu-item-text"
}, sa = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (s, n) => (t(), o("button", {
      type: "button",
      class: oe(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (t(), o("span", la, g(e.checked ? "✓" : ""), 1)) : h("", !0),
      e.description ? (t(), o("span", oa, [
        v("span", null, [
          ye(s.$slots, "default", {}, void 0, !0)
        ]),
        v("small", null, g(e.description), 1)
      ])) : ye(s.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, pe = /* @__PURE__ */ Q(sa, [["__scopeId", "data-v-fec99974"]]), ra = {}, ia = { class: "menu-label" };
function ua(e, s) {
  return t(), o("span", ia, [
    ye(e.$slots, "default", {}, void 0, !0)
  ]);
}
const he = /* @__PURE__ */ Q(ra, [["render", ua], ["__scopeId", "data-v-aa955b3e"]]), da = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, ca = {
  key: 0,
  class: "skills-none"
}, va = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: s }) {
    const n = e, a = s, r = b(() => n.skills.filter((f) => f.state === "loaded")), d = b(() => n.skills.filter((f) => f.state !== "loaded"));
    return (f, y) => (t(), o("div", da, [
      $(he, null, {
        default: S(() => [...y[1] || (y[1] = [
          k("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      r.value.length ? h("", !0) : (t(), o("p", ca, "None yet. Compacting the conversation empties this list.")),
      (t(!0), o(E, null, X(r.value, (x) => (t(), o("p", {
        key: x.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        $(ne, {
          name: "book",
          size: 12
        }),
        k(g(x.skill), 1)
      ]))), 128)),
      d.value.length ? (t(), o(E, { key: 1 }, [
        $(he, null, {
          default: S(() => [...y[2] || (y[2] = [
            k("Still to read", -1)
          ])]),
          _: 1
        }),
        (t(!0), o(E, null, X(d.value, (x) => (t(), o("p", {
          key: x.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          $(ne, {
            name: "book",
            size: 12
          }),
          k(g(x.skill), 1)
        ]))), 128))
      ], 64)) : h("", !0),
      $(pe, {
        "data-agent-skills-browse": "",
        onClick: y[0] || (y[0] = (x) => a("browse"))
      }, {
        default: S(() => [...y[3] || (y[3] = [
          k("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, pa = /* @__PURE__ */ Q(va, [["__scopeId", "data-v-be514d47"]]), ga = ["disabled", "title"], ma = { class: "gauge usage" }, fa = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: s }) {
    const n = e, a = s, r = b(() => n.windows[0] ?? null), d = b(() => r.value ? Math.max(0, Math.min(100, Math.round(r.value.used_percent))) : null);
    return (f, y) => d.value !== null ? (t(), o("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: `${d.value}% of the plan's ${r.value.title} allowance used`,
      onClick: y[0] || (y[0] = (x) => a("open", x.currentTarget))
    }, [
      $(ne, {
        name: "allowance",
        size: 12
      }),
      y[1] || (y[1] = k()),
      v("span", ma, [
        v("span", {
          style: ge({ width: `${d.value}%` })
        }, null, 4)
      ]),
      k(" " + g(d.value) + "% ", 1)
    ], 8, ga)) : h("", !0);
  }
}, ha = /* @__PURE__ */ Q(fa, [["__scopeId", "data-v-02e9922e"]]), ka = (e, s, n) => Math.max(s, Math.min(n, e)), qe = /* @__PURE__ */ new WeakMap(), ya = (e, s) => qe.set(e, s);
function ba(e, s) {
  for (let n = s; n; n = qe.get(n) ?? n.parentElement) if (n === e) return !0;
  return !1;
}
function wa(e, s) {
  const n = (a) => {
    var d, f;
    const r = ((d = e.value) == null ? void 0 : d.element) || ((f = e.value) == null ? void 0 : f.$el) || e.value;
    r && !ba(r, a.target) && s(a);
  };
  window.addEventListener("click", n), ke(() => window.removeEventListener("click", n));
}
const ve = 8, Ma = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: s, emit: n }) {
    const a = e, r = O(null), d = (l) => l ? `${l}px` : void 0, f = b(() => ({
      minWidth: d(a.minWidth),
      maxWidth: d(a.maxWidth),
      maxHeight: d(a.maxHeight),
      height: d(a.height)
    })), y = O({ w: 0, h: 0 }), x = O(a.anchor ? a.anchor.getBoundingClientRect() : null), A = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), q = (l) => ({
      left: Math.max(0, l.left),
      top: Math.max(0, l.top),
      right: Math.min(window.innerWidth, l.right),
      bottom: Math.min(window.innerHeight, l.bottom)
    }), D = (l) => {
      const i = l.closest(".pane, .float-window");
      return i ? q(i.getBoundingClientRect()) : A();
    }, z = (l, i) => `${Math.max(0, l ? Math.min(l, i) : i)}px`;
    function P(l, i) {
      return {
        below: l.bottom - i.bottom - a.gap - ve,
        above: i.top - l.top - a.gap - ve,
        across: l.right - l.left - 2 * ve
      };
    }
    function j(l) {
      const i = D(a.anchor), B = P(i, l);
      return y.value.w <= B.across && y.value.h <= Math.max(B.below, B.above) ? i : A();
    }
    const V = b(() => {
      if (!x.value) return f.value;
      const l = x.value, i = j(l), B = P(i, l), { w: ee, h: M } = y.value, c = a.align === "auto" ? l.left + l.right > i.left + i.right : a.align === "right", w = ka(c ? l.right - ee : l.left, i.left + ve, Math.max(i.left + ve, i.right - ee - ve)), Y = M > B.below && B.above > B.below ? { bottom: `${window.innerHeight - l.top + a.gap}px`, maxHeight: z(a.maxHeight, B.above) } : { top: `${l.bottom + a.gap}px`, maxHeight: z(a.maxHeight, B.below) };
      return { ...f.value, ...Y, left: `${w}px`, maxWidth: z(a.maxWidth, B.across) };
    }), H = n, G = () => [...r.value.querySelectorAll("button:not(:disabled)")];
    function C(l) {
      const i = G(), B = i.indexOf(document.activeElement);
      i[(B + l + i.length) % i.length].focus();
    }
    const m = { ArrowDown: () => C(1), ArrowUp: () => C(-1), Escape: () => H("close") }, I = (l) => m[l.key] && (l.preventDefault(), m[l.key]()), T = () => r.value && (y.value = { w: r.value.offsetWidth, h: r.value.scrollHeight });
    let U = 0;
    const _ = new ResizeObserver(() => {
      cancelAnimationFrame(U), U = requestAnimationFrame(T);
    });
    wa(r, (l) => a.anchor && !a.anchor.contains(l.target) && H("close"));
    const K = (l, i) => ["top", "left", "right", "bottom"].some((B) => Math.abs(l[B] - i[B]) > 1), p = (l) => l.bottom < 0 || l.top > window.innerHeight;
    let R = 0;
    function J() {
      if (a.anchor) {
        const l = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || p(l)) return H("close");
        K(l, x.value) && (x.value = l);
      }
      R = requestAnimationFrame(J);
    }
    return Ze(() => {
      a.anchor && r.value && ya(r.value, a.anchor), T(), r.value && _.observe(r.value), !a.plain && G()[0] && G()[0].focus(), J();
    }), ke(() => {
      _.disconnect(), cancelAnimationFrame(R), cancelAnimationFrame(U);
    }), s({ element: r }), (l, i) => (t(), F(Ge, {
      to: "body",
      disabled: !e.anchor
    }, [
      v("div", Ye({
        ref_key: "panel",
        ref: r
      }, l.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: V.value,
        onKeydown: I
      }), [
        ye(l.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), $a = /* @__PURE__ */ Q(Ma, [["__scopeId", "data-v-3d203970"]]);
async function xa(e, s, n) {
  if (!e) return n(s);
  const { target: a, fields: r } = e, d = Object.fromEntries(Object.keys(r).map((x) => [x, a[x]])), f = () => Object.assign(a, d);
  Object.assign(a, r);
  let y = !1;
  try {
    const x = await n(s);
    return y = x.ok, x;
  } finally {
    y || f();
  }
}
function Ca(e, s, n, { groups: a, programs: r }) {
  const d = O({}), f = O(""), y = O(!1), x = b(() => !!e.value && !e.value.ended_at), A = b(() => x.value && !!e.value.paused_at);
  async function q(j, V = null) {
    f.value = "";
    const H = await xa(V, j, s);
    return f.value = H.ok ? "" : H.error, n(), H;
  }
  return { groups: a, programs: r, chosen: d, failure: f, asking: y, running: x, paused: A, choose: (j, V) => q(["agent", "control", String(e.value.id), j, V.value], { target: d, fields: { value: { ...d.value, [j]: V.label } } }), stop: () => (y.value = !1, q(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (j) => q(["agent", "launch", j.name]) };
}
function Sa(e) {
  if (!e) return "Not compacted yet";
  const s = new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return e.start_percent === null ? `Last compacted ${s}` : e.end_percent === null ? `Last compacted ${s}, from ${e.start_percent}%` : `Last compacted ${s}, from ${e.start_percent}% to ${e.end_percent}%, ${e.start_percent - e.end_percent}% taken off`;
}
const Aa = ["disabled", "title"], ja = ["disabled", "title"], Ta = { class: "gauge" }, Ra = ["disabled", "title"], Ba = ["disabled"], Oa = ["disabled"], La = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, za = ["title"], Va = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Ha = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Ia = { class: "gauge" }, Ea = { class: "context-used" }, Na = 75, Wa = {
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
  setup(e, { emit: s }) {
    const n = e, a = s, r = Ca(Ae(n, "agent"), n.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: Ae(n, "controlGroups"), programs: Ae(n, "agentPrograms") }), d = O(null), f = O(""), y = b(() => r.groups.value.find((C) => C.key === f.value));
    function x(C, m) {
      d.value = C.currentTarget, f.value = m;
    }
    function A() {
      d.value = null, f.value = "", r.asking.value = !1;
    }
    const q = b(() => n.skills.filter((C) => C.state === "loaded"));
    function D(C) {
      x(C, "skills"), a("skills");
    }
    const z = (C) => r.groups.value.some((m) => m.key === C), P = b(() => {
      var C;
      return r.chosen.value.model ?? ((C = V.value) == null ? void 0 : C.model) ?? "";
    }), j = b(() => {
      var C;
      return r.chosen.value.effort ?? ((C = V.value) == null ? void 0 : C.effort) ?? "";
    });
    b(() => !!n.agent && !n.agent.ended_at);
    const V = b(() => {
      var C;
      return ((C = n.usage.agents) == null ? void 0 : C.find((m) => {
        var I;
        return m.id === ((I = n.agent) == null ? void 0 : I.id);
      })) ?? null;
    }), H = b(() => {
      var C;
      return ((C = V.value) == null ? void 0 : C.context_percent) == null ? null : Math.round(V.value.context_percent);
    }), G = b(() => {
      var C;
      return (C = V.value) != null && C.cost_dollars ? `$${V.value.cost_dollars.toFixed(2)}` : "";
    });
    return (C, m) => {
      var I;
      return t(), o("div", {
        class: oe(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (t(), o(E, { key: 0 }, [
          v("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: m[0] || (m[0] = (T) => x(T, "agent"))
          }, [
            $(ne, {
              name: "agents",
              size: 12
            }),
            k(" " + g(((I = e.agentPrograms.find((T) => T.name === e.agent.program)) == null ? void 0 : I.title) || e.agent.program), 1)
          ], 8, Aa),
          $(ha, {
            windows: e.usage.windows,
            onOpen: m[1] || (m[1] = (T) => a("open", "usage", T))
          }, null, 8, ["windows"]),
          H.value !== null ? (t(), o("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${H.value}% full: clear or compact it`,
            onClick: m[2] || (m[2] = (T) => z("context") ? x(T, "context") : a("open", "context", T.currentTarget))
          }, [
            $(ne, {
              name: "gauge",
              size: 12
            }),
            m[14] || (m[14] = k()),
            v("span", Ta, [
              v("span", {
                style: ge({ width: `${H.value}%` })
              }, null, 4)
            ]),
            k(" " + g(H.value) + "% ", 1)
          ], 8, ja)) : h("", !0),
          P.value ? (t(), o("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${P.value}: change the model`,
            onClick: m[3] || (m[3] = (T) => z("model") ? x(T, "model") : null)
          }, [
            $(ne, {
              name: "model",
              size: 12
            }),
            k(" " + g(P.value), 1)
          ], 8, Ra)) : h("", !0),
          z("effort") || e.card && j.value ? (t(), o("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: m[4] || (m[4] = (T) => x(T, "effort"))
          }, [
            $(ne, {
              name: "bolt",
              size: 12
            }),
            k(" " + g(j.value), 1)
          ], 8, Ba)) : h("", !0),
          G.value ? (t(), o("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: m[5] || (m[5] = (T) => a("open", "cost", T.currentTarget))
          }, g(G.value), 9, Oa)) : h("", !0),
          e.branch ? (t(), o("span", La, [
            $(ne, {
              name: "branch",
              size: 12
            }),
            k(" " + g(e.branch), 1)
          ])) : h("", !0),
          e.card ? h("", !0) : (t(), o("button", {
            key: 5,
            type: "button",
            class: oe(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: m[6] || (m[6] = (T) => a("open", "jobs", T.currentTarget))
          }, [
            $(ne, {
              name: "clock",
              size: 12
            }),
            k(" " + g(e.jobs), 1)
          ], 2)),
          e.run ? (t(), o("button", {
            key: 6,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: D
          }, [
            $(ne, {
              name: "book",
              size: 12
            }),
            k(" " + g(q.value.length), 1)
          ])) : h("", !0),
          e.fitness ? (t(), o(E, { key: 7 }, [
            v("button", {
              type: "button",
              class: oe(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Na }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: m[7] || (m[7] = (T) => a("open", "fitness", T.currentTarget))
            }, [
              $(ne, {
                name: "heart",
                size: 12
              }),
              k(" " + g(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            v("button", {
              type: "button",
              class: oe(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: m[8] || (m[8] = (T) => a("open", "load", T.currentTarget))
            }, [
              $(ne, {
                name: "weight",
                size: 12
              }),
              k(" " + g(e.fitness.workload), 1)
            ], 2)
          ], 64)) : h("", !0)
        ], 64)) : e.run && !e.loading ? (t(), o("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: m[9] || (m[9] = (T) => x(T, "start"))
        }, [
          $(ne, {
            name: "agents",
            size: 12
          }),
          m[15] || (m[15] = k(" Start an agent", -1))
        ])) : h("", !0),
        m[21] || (m[21] = v("span", { class: "space" }, null, -1)),
        u(r).failure.value ? (t(), o("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: u(r).failure.value
        }, g(u(r).failure.value), 9, za)) : h("", !0),
        ye(C.$slots, "default", {}, void 0, !0),
        d.value ? (t(), F($a, {
          key: 3,
          anchor: d.value,
          "min-width": 190,
          onClose: A
        }, {
          default: S(() => {
            var T;
            return [
              f.value === "agent" ? (t(), o(E, { key: 0 }, [
                u(r).asking.value ? (t(), o(E, { key: 0 }, [
                  $(he, { "data-agent-stop-ask": "" }, {
                    default: S(() => [...m[16] || (m[16] = [
                      k("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  $(pe, {
                    "data-agent-stop-confirm": "",
                    onClick: m[10] || (m[10] = (U) => (A(), u(r).stop()))
                  }, {
                    default: S(() => [...m[17] || (m[17] = [
                      k("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  $(pe, {
                    onClick: m[11] || (m[11] = (U) => u(r).asking.value = !1)
                  }, {
                    default: S(() => [...m[18] || (m[18] = [
                      k("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (t(), F(pe, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: m[12] || (m[12] = (U) => u(r).asking.value = !0)
                }, {
                  default: S(() => [...m[19] || (m[19] = [
                    k("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : f.value === "start" ? (t(), o(E, { key: 1 }, [
                $(he, null, {
                  default: S(() => [...m[20] || (m[20] = [
                    k("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (t(!0), o(E, null, X(u(r).programs.value, (U) => (t(), F(pe, {
                  key: U.name,
                  "data-agent-program": U.name,
                  onClick: (_) => (A(), u(r).start(U))
                }, {
                  default: S(() => [
                    k(g(U.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : f.value === "skills" ? (t(), F(pa, {
                key: 2,
                skills: e.skills,
                onBrowse: m[13] || (m[13] = (U) => (A(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : y.value ? (t(), o(E, { key: 3 }, [
                $(he, null, {
                  default: S(() => [
                    k(g(y.value.label), 1)
                  ]),
                  _: 1
                }),
                f.value === "context" ? (t(), o(E, { key: 0 }, [
                  v("p", Va, g(u(Sa)(((T = V.value) == null ? void 0 : T.last_compaction) ?? null)), 1),
                  v("div", Ha, [
                    v("span", Ia, [
                      v("span", {
                        style: ge({ width: `${H.value}%` })
                      }, null, 4)
                    ]),
                    v("span", Ea, g(H.value) + "%", 1)
                  ])
                ], 64)) : h("", !0),
                (t(!0), o(E, null, X(y.value.choices, (U) => (t(), F(pe, {
                  key: U.value,
                  "data-agent-choice": U.value,
                  onClick: (_) => (u(r).choose(y.value.key, U), A())
                }, {
                  default: S(() => [
                    k(g(U.label), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-choice", "onClick"]))), 128))
              ], 64)) : h("", !0)
            ];
          }),
          _: 1
        }, 8, ["anchor"])) : h("", !0)
      ], 2);
    };
  }
}, qa = /* @__PURE__ */ Q(Wa, [["__scopeId", "data-v-12618cc1"]]), Fa = ["data-agent-open", "aria-expanded", "role", "tabindex"], Pa = { class: "agent-head" }, Da = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Ua = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Ka = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, Ja = { class: "agent-line" }, Za = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Ga = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, Ya = {
  key: 1,
  class: "agent-list-pace",
  "data-agent-list-pace": ""
}, Qa = {
  key: 2,
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, Xa = {
  key: 3,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, _a = {
  key: 1,
  class: "agent-line agent-work-start"
}, en = ["title"], tn = { class: "agent-job-title" }, an = ["data-peek"], nn = ["data-agent-waiting", "data-agent-stopped"], ln = {
  key: 2,
  class: "agent-line agent-work-status",
  "data-agent-blocked-tasks": ""
}, on = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: s }) {
    const n = { helper: "Helper", reviewer: "Reviewer" }, a = e, r = s, d = Ee(), f = b(() => {
      var i, B;
      if ((i = a.facts) != null && i.profile_title) return a.facts.profile_title;
      if ((B = a.facts) != null && B.profile) return a.facts.profile;
      const l = n[a.row.role] || a.row.role;
      return l.slice(0, 1).toUpperCase() + l.slice(1);
    }), y = b(() => {
      var l;
      return ((l = a.facts) == null ? void 0 : l.tasks) ?? [];
    }), x = b(() => y.value.filter((l) => l.state === "open")), A = b(() => y.value.find((l) => {
      var i;
      return l.id === ((i = a.progress) == null ? void 0 : i.task_id) && l.state === "started";
    })), q = b(() => A.value || y.value.find((l) => {
      var i;
      return l.id === ((i = a.facts) == null ? void 0 : i.task_id);
    }) || x.value[0] || y.value.at(-1)), D = b(() => A.value ? y.value.filter((l) => l.state === "blocked") : []), z = b(() => {
      var l, i, B, ee, M, c;
      return a.row.role === "helper" ? ((l = a.facts) == null ? void 0 : l.helper_job) || "" : (i = a.facts) != null && i.job_enabled && (((B = A.value) == null ? void 0 : B.title) || ((ee = a.facts) == null ? void 0 : ee.task_title) || ((M = x.value[0]) == null ? void 0 : M.title) || ((c = y.value.at(-1)) == null ? void 0 : c.title)) || "";
    }), P = b(() => {
      var l;
      return (l = a.facts) != null && l.job_enabled ? `${a.row.role} ${a.row.id}` : "";
    }), j = b(() => {
      var l, i;
      return [a.row.program, (l = a.facts) == null ? void 0 : l.model, (i = a.facts) == null ? void 0 : i.effort, P.value].filter(Boolean).join(" · ");
    }), V = me(), H = b(() => Ne(a.row.process_started_at || a.row.created_at, d.value)), G = /* @__PURE__ */ new Set(["open", "started", "testing"]), C = b(() => {
      var l;
      return (l = a.facts) == null ? void 0 : l.work_status;
    }), m = b(() => !!a.row.ended_at && a.row.role !== "main" && y.value.some((l) => G.has(l.state))), I = b(() => {
      var l;
      return a.row.retired_at || a.row.state === "retired" ? "retired" : C.value || a.waitReason || m.value ? "waiting" : a.row.state === "running" && ((l = a.facts) == null ? void 0 : l.state) || a.row.state;
    }), T = b(() => {
      var l;
      return C.value ? `Status: ${C.value}` : a.waitReason ? `Waiting: ${a.waitReason}` : I.value === "blocked" ? (l = a.facts) != null && l.blocked_reason ? `Blocked: ${a.facts.blocked_reason}` : "Blocked" : m.value ? "Stopped with work left" : "";
    }), U = b(() => {
      var l;
      return ((l = a.progress) == null ? void 0 : l.completed_count) ?? y.value.filter((i) => i.state === "completed").length;
    }), _ = b(() => {
      var i;
      const l = it(U.value, ((i = a.progress) == null ? void 0 : i.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, d.value);
      return a.row.role !== "main" && l ? `${l} per hour` : "";
    }), K = b(() => !!a.row.retired_at || a.row.state === "retired"), p = b(() => K.value ? "Retired" : I.value === "blocked" || I.value === "waiting" ? T.value || (I.value === "blocked" ? "Blocked" : "Waiting") : a.row.ended_at ? "Idle: its process has stopped" : "Working"), R = b(() => {
      var i;
      if (K.value) return a.row.retired_at;
      const l = I.value === "blocked" || I.value === "waiting";
      return a.row.ended_at || l && ((i = a.facts) == null ? void 0 : i.last_activity) || a.row.process_started_at || a.row.created_at;
    }), J = b(() => R.value ? `Since ${new Date(R.value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${ut(R.value, d.value)}` : "");
    return (l, i) => {
      var B, ee, M, c, w, N;
      return t(), o("div", {
        class: oe(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: i[3] || (i[3] = (Y) => !e.open && r("toggle")),
        onKeydown: [
          i[4] || (i[4] = Oe(le((Y) => !e.open && r("toggle"), ["self", "prevent"]), ["enter"])),
          i[5] || (i[5] = Oe(le((Y) => !e.open && r("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        v("span", Pa, [
          e.open ? (t(), o("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: i[0] || (i[0] = le((Y) => r("toggle"), ["stop"]))
          }, [
            $(u(be), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : h("", !0),
          v("span", Da, g(f.value), 1),
          v("span", Ua, g(((B = e.facts) == null ? void 0 : B.given_name) || e.row.id), 1),
          e.open ? h("", !0) : (t(), F(u(be), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          e.open ? (t(), o("span", Ka, g(H.value), 1)) : h("", !0)
        ]),
        v("span", Ja, [
          v("span", Za, g(j.value), 1),
          (ee = e.facts) != null && ee.sandbox_off ? (t(), o("span", Ga, "sandbox off")) : h("", !0),
          !e.open && e.row.role === "worker" && _.value ? (t(), o("span", Ya, g(_.value), 1)) : h("", !0),
          e.open ? (t(), o("span", Qa, [
            i[6] || (i[6] = k("Started ", -1)),
            $(u(ze), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : h("", !0),
          e.open && ((M = e.facts) != null && M.last_activity) ? (t(), o("span", Xa, [
            i[7] || (i[7] = k("Last heard ", -1)),
            $(u(ze), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : h("", !0)
        ]),
        e.open ? (t(), F(qa, {
          key: 0,
          "agent-programs": u(V).props.programs.rows.value,
          agent: e.row,
          branch: (c = e.progress) == null ? void 0 : c.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((w = e.facts) == null ? void 0 : w.windows) ?? [] },
          card: ""
        }, {
          default: S(() => [
            $(Qt, { row: e.row }, null, 8, ["row"]),
            e.row.role === "helper" && !e.row.ended_at ? (t(), F(u(ae), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: i[1] || (i[1] = le((Y) => u(V).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: S(() => [...i[8] || (i[8] = [
                k("Stop", -1)
              ])]),
              _: 1
            })) : h("", !0)
          ]),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : h("", !0),
        !e.open && (z.value || T.value) ? (t(), o("span", _a, [
          v("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: z.value
          }, [
            v("span", tn, g(z.value), 1),
            z.value && e.row.role !== "helper" && ((N = q.value) != null && N.plan_id) ? (t(), o("button", {
              key: 0,
              type: "button",
              class: "agent-plan",
              "data-agent-plan": "",
              "data-peek": `plans:${q.value.plan_id}`,
              onClick: i[2] || (i[2] = le((Y) => u(Se)(`plans:${q.value.plan_id}`), ["stop"]))
            }, "plan " + g(q.value.plan_id), 9, an)) : h("", !0)
          ], 8, en),
          T.value ? (t(), o("span", {
            key: 0,
            class: "agent-work-status",
            "data-agent-work-status": "",
            "data-agent-waiting": e.waitReason ? "" : null,
            "data-agent-stopped": m.value && !e.waitReason && !C.value ? "" : null
          }, g(T.value), 9, nn)) : h("", !0)
        ])) : h("", !0),
        !e.open && D.value.length ? (t(), o("span", ln, "Blocked: " + g(D.value.map((Y) => `task ${Y.id}`).join(", ")), 1)) : h("", !0),
        $(aa, {
          state: I.value,
          doing: p.value,
          since: J.value
        }, null, 8, ["state", "doing", "since"]),
        e.open ? (t(), F(Ht, {
          key: 3,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: y.value,
          "stopped-with-work": m.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : h("", !0)
      ], 42, Fa);
    };
  }
}, sn = /* @__PURE__ */ Q(on, [["__scopeId", "data-v-5acb205e"]]), rn = ["data-edit-type"], un = { key: 0 }, dn = { class: "stepper" }, cn = ["disabled", "onClick"], vn = ["value", "disabled", "data-agent-limit-input", "onChange"], pn = ["disabled", "onClick"], gn = { key: 0 }, mn = { key: 1 }, fn = {
  __name: "AgentLimitEditor",
  props: { rows: { type: Array, required: !0 }, pending: Boolean, readOnly: Boolean, environment: { type: String, required: !0 } },
  emits: ["change"],
  setup(e, { emit: s }) {
    const n = s;
    return (a, r) => (t(), o(E, null, [
      r[0] || (r[0] = v("p", null, "How many agents of a type may run at once, and how many may be kept.", -1)),
      (t(!0), o(E, null, X(e.rows, (d) => (t(), o("div", {
        key: d.key,
        class: "edit-row",
        "data-edit-type": d.key
      }, [
        v("div", null, [
          v("strong", null, g(d.per_profile ? "Each helper type" : "Workers"), 1),
          d.per_profile ? (t(), o("small", un, "Researcher, Planner and the others")) : h("", !0)
        ]),
        (t(!0), o(E, null, X([{ name: "Most running", value: d.run_limit, key: d.run_setting, source: d.run_source, kind: "run" }, { name: "Most kept", value: d.kept_limit, key: d.kept_setting, source: d.kept_source, kind: "kept" }], (f) => (t(), o("label", {
          key: f.key
        }, [
          k(g(f.name), 1),
          v("span", dn, [
            v("button", {
              type: "button",
              disabled: e.pending || e.readOnly || f.value === 0,
              onClick: (y) => n("change", d, f.key, f.value, f.value - 1)
            }, "−", 8, cn),
            v("input", {
              type: "number",
              min: "0",
              value: f.value,
              disabled: e.pending || e.readOnly,
              "data-agent-limit-input": f.kind,
              onChange: (y) => n("change", d, f.key, f.value, y.target.value)
            }, null, 40, vn),
            v("button", {
              type: "button",
              disabled: e.pending || e.readOnly,
              onClick: (y) => n("change", d, f.key, f.value, f.value + 1)
            }, "+", 8, pn)
          ]),
          f.value === 0 ? (t(), o("small", gn, g(f.kind === "run" ? "None can start" : "Any number"), 1)) : f.source === `environment ${e.environment}` ? (t(), o("small", mn, "Changed for " + g(e.environment), 1)) : h("", !0)
        ]))), 128))
      ], 8, rn))), 128))
    ], 64));
  }
}, hn = /* @__PURE__ */ Q(fn, [["__scopeId", "data-v-218442c9"]]), Fe = (e) => e.flatMap((s) => s.per_profile ? s.profiles.map((n) => ({ ...n, label: n.title, type: s.key, key: `${s.key}:${n.profile}` })) : [{ ...s, type: s.key }]), Re = (e, s) => s > 0 && e >= s, kn = { class: "counts-panel" }, yn = { class: "counts" }, bn = ["data-count-agent"], wn = { class: "person-text" }, Mn = {
  key: 0,
  class: "helper-head"
}, $n = ["data-agent-limit-type", "data-agent-limit-profile", "onClick"], xn = {
  key: 0,
  class: "bar"
}, Cn = {
  key: 5,
  role: "alert"
}, Sn = {
  key: 6,
  role: "status"
}, An = { class: "foot" }, jn = { class: "foot-note" }, Tn = {
  __name: "AgentCountsPanel",
  props: {
    title: { default: "Agent counts" },
    titleModifiers: {}
  },
  emits: /* @__PURE__ */ Xe(["open-agent", "close"], ["update:title"]),
  setup(e, { emit: s }) {
    const n = s, a = Qe(e, "title"), r = me(), { rows: d, failure: f } = r.props.limits, y = O([]), x = O(0), A = O(!1), q = Ee(), D = O(null), z = O(!1), P = O(!1), j = O(""), V = O(""), H = O(null), G = O(""), C = b(() => Fe(d.value)), m = b(() => d.value.find((M) => M.per_profile)), I = b(() => C.value.find((M) => M.key === D.value)), T = b(() => y.value.filter((M) => {
      var c, w;
      return M.state !== "retired" && M.role === ((c = I.value) == null ? void 0 : c.type) && (!I.value.profile || (((w = M.facts) == null ? void 0 : w.profile) || M.profile) === I.value.profile);
    }).sort((M, c) => (M.state !== "running") - (c.state !== "running") || String(M.ended_at || M.created_at).localeCompare(String(c.ended_at || c.created_at)))), U = b(() => {
      var c;
      const M = /* @__PURE__ */ new Map();
      for (const w of T.value) {
        const N = ((c = w.facts) == null ? void 0 : c.model) || w.program_model;
        N && M.set(N, (M.get(N) || 0) + 1);
      }
      return [...M].map(([w, N]) => `${N} ${w}`).join(", ");
    }), _ = (M, c) => c ? `${Math.min(M / Math.max(M, c) * 100, 100)}%` : "0%", K = (M, c) => c && M > c ? `${(M - c) / M * 100}%` : "0%";
    re(() => {
      var M;
      return z.value ? "Change the maximums" : ((M = I.value) == null ? void 0 : M.label) || "Agent counts";
    }, (M) => {
      a.value = M;
    }, { immediate: !0 });
    async function p(M, c = 1) {
      r.state["count-agents.role"] = M.type, M.profile ? r.state["count-agents.profile"] = M.profile : delete r.state["count-agents.profile"], r.state["count-agents.page"] = String(c), await r.reload("count-agents");
      const w = r.props["count-agents"];
      y.value = c === 1 ? [...w.rows.value] : [...y.value, ...w.rows.value], x.value = c, A.value = w.more.value;
    }
    function R(M) {
      D.value = M.key, y.value = [], p(M);
    }
    function J() {
      z.value = !1, D.value = null, H.value = null, j.value = "";
    }
    function l() {
      J(), n("close");
    }
    async function i(M, c, w, N) {
      if (P.value || r.readOnly) return;
      const Y = Number(N);
      if (!String(N).trim() || !Number.isInteger(Y) || Y < 0) {
        j.value = "Use a whole number of 0 or more.";
        return;
      }
      P.value = !0, j.value = "";
      const ue = await r.run(["setting", "set", c, String(Y), "--environment", r.environment]);
      ue.ok ? (await r.reload("limits"), V.value = "Saved.") : j.value = ue.error, P.value = !1;
    }
    async function B(M) {
      if (!G.value.trim() || P.value) return;
      P.value = !0;
      const c = await r.run(["agent", "retire", String(M.id), "--reason", G.value.trim()]);
      j.value = c.ok ? "" : "The agent could not be retired. Try again.", c.ok && (H.value = null, G.value = "", V.value = "Agent retired permanently.", await r.reload("limits"), await p(I.value)), P.value = !1;
    }
    function ee(M) {
      l(), n("open-agent", M);
    }
    return (M, c) => (t(), o("div", kn, [
      v("div", yn, [
        z.value || I.value ? (t(), o("button", {
          key: 0,
          class: "back",
          type: "button",
          onClick: J
        }, "‹ Back to the counts")) : h("", !0),
        u(f) ? (t(), o(E, { key: 1 }, [
          c[6] || (c[6] = v("strong", null, "The counts could not be read", -1)),
          c[7] || (c[7] = v("p", null, "The journal did not answer.", -1)),
          $(u(ae), {
            small: "",
            onClick: c[0] || (c[0] = (w) => u(r).reload("limits"))
          }, {
            default: S(() => [...c[5] || (c[5] = [
              k("Try again", -1)
            ])]),
            _: 1
          })
        ], 64)) : z.value ? (t(), F(hn, {
          key: 2,
          rows: u(d),
          pending: P.value,
          "read-only": u(r).readOnly,
          environment: u(r).environment,
          onChange: i
        }, null, 8, ["rows", "pending", "read-only", "environment"])) : I.value ? (t(), o(E, { key: 3 }, [
          v("p", null, [
            v("strong", null, g(I.value.running) + " of " + g(I.value.run_limit), 1),
            c[8] || (c[8] = k(" running, ", -1)),
            v("strong", null, [
              k(g(I.value.kept), 1),
              I.value.kept_limit ? (t(), o(E, { key: 0 }, [
                k(" of " + g(I.value.kept_limit), 1)
              ], 64)) : h("", !0)
            ]),
            c[9] || (c[9] = k(" kept", -1))
          ]),
          v("p", null, g(U.value), 1),
          T.value.length ? h("", !0) : (t(), o(E, { key: 0 }, [
            c[10] || (c[10] = v("strong", null, "No agents here yet", -1)),
            c[11] || (c[11] = v("p", null, "An agent shows here as soon as one of this type starts.", -1))
          ], 64)),
          (t(!0), o(E, null, X(T.value, (w) => {
            var N, Y, ue, fe, we;
            return t(), o("div", {
              key: w.id,
              class: "person",
              "data-count-agent": w.id
            }, [
              v("span", {
                class: oe(["dot", { running: w.state === "running" }])
              }, null, 2),
              v("div", wn, [
                v("strong", null, g(((N = w.facts) == null ? void 0 : N.given_name) || w.id), 1),
                k(" " + g(w.state === "running" ? "Running" : "Idle") + ", " + g(u(Ne)(w.state === "running" ? w.process_started_at || w.created_at : w.ended_at, u(q))), 1),
                v("small", null, g([w.program, (Y = w.facts) == null ? void 0 : Y.model, (ue = w.facts) == null ? void 0 : ue.effort, `${w.role} ${w.id}`].filter(Boolean).join(", ")), 1),
                v("small", null, g(((fe = w.facts) == null ? void 0 : fe.task_title) || ((we = w.facts) == null ? void 0 : we.helper_job)), 1)
              ]),
              $(u(ae), {
                small: "",
                onClick: (de) => ee(w)
              }, {
                default: S(() => [...c[12] || (c[12] = [
                  k("Open", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              w.state === "idle" && !u(r).readOnly ? (t(), F(u(ae), {
                key: 0,
                small: "",
                onClick: (de) => {
                  H.value = w.id, G.value = "";
                }
              }, {
                default: S(() => [...c[13] || (c[13] = [
                  k("Retire", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : h("", !0),
              H.value === w.id ? (t(), F(We, {
                key: 1,
                reason: G.value,
                "onUpdate:reason": c[1] || (c[1] = (de) => G.value = de),
                pending: P.value,
                onSubmit: (de) => B(w),
                onCancel: c[2] || (c[2] = (de) => H.value = null)
              }, null, 8, ["reason", "pending", "onSubmit"])) : h("", !0)
            ], 8, bn);
          }), 128)),
          A.value ? (t(), F(u(ae), {
            key: 1,
            small: "",
            onClick: c[3] || (c[3] = (w) => p(I.value, x.value + 1))
          }, {
            default: S(() => [...c[14] || (c[14] = [
              k("Show more", -1)
            ])]),
            _: 1
          })) : h("", !0)
        ], 64)) : (t(), o(E, { key: 4 }, [
          c[16] || (c[16] = v("p", null, "Kept agents have not been retired, so they can take another job. Open an item to see them.", -1)),
          c[17] || (c[17] = v("div", { class: "columns" }, [
            v("span", null, "Name"),
            v("span", null, "Running"),
            v("span", null, "Kept"),
            v("span")
          ], -1)),
          m.value ? (t(), o("div", Mn, [
            c[15] || (c[15] = v("strong", null, "Helpers", -1)),
            v("span", null, g(m.value.running) + " running, " + g(m.value.kept) + " kept", 1)
          ])) : h("", !0),
          (t(!0), o(E, null, X(C.value, (w) => (t(), o("button", {
            key: w.key,
            type: "button",
            class: "count-row",
            "data-agent-limit-type": w.type || w.key,
            "data-agent-limit-profile": w.profile,
            onClick: (N) => R(w)
          }, [
            v("strong", null, g(w.label), 1),
            (t(!0), o(E, null, X([{ count: w.running, limit: w.run_limit, unlimited: !1 }, { count: w.kept, limit: w.kept_limit, unlimited: !0 }], (N) => (t(), o("span", {
              key: N.unlimited,
              class: oe({ full: u(Re)(N.count, N.limit) })
            }, [
              v("span", null, [
                k(g(N.count), 1),
                N.limit || !N.unlimited ? (t(), o(E, { key: 0 }, [
                  k(" of " + g(N.limit), 1)
                ], 64)) : h("", !0)
              ]),
              N.limit ? (t(), o("span", xn, [
                v("span", {
                  style: ge({ width: _(N.count, N.limit) })
                }, null, 4),
                v("i", {
                  style: ge({ width: K(N.count, N.limit) })
                }, null, 4)
              ])) : h("", !0)
            ], 2))), 128)),
            $(u(be), {
              name: "chevronRight",
              size: 12
            })
          ], 8, $n))), 128))
        ], 64)),
        j.value ? (t(), o("p", Cn, g(j.value), 1)) : V.value ? (t(), o("p", Sn, g(V.value), 1)) : h("", !0)
      ]),
      v("div", An, [
        z.value ? (t(), o(E, { key: 0 }, [
          v("span", jn, g(V.value || `Changes apply to ${u(r).environment}.`), 1),
          $(u(ae), { onClick: J }, {
            default: S(() => [...c[18] || (c[18] = [
              k("Done", -1)
            ])]),
            _: 1
          })
        ], 64)) : I.value ? h("", !0) : (t(), F(u(ae), {
          key: 1,
          disabled: u(r).readOnly,
          "data-agent-limits-edit": "",
          onClick: c[4] || (c[4] = (w) => z.value = !0)
        }, {
          default: S(() => [...c[19] || (c[19] = [
            k("Change the maximums", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]))
      ])
    ]));
  }
}, Rn = /* @__PURE__ */ Q(Tn, [["__scopeId", "data-v-de3d902c"]]), Bn = {
  key: 0,
  class: "badge",
  "data-agent-count-badge": ""
}, On = {
  __name: "AgentLimits",
  emits: ["open-agent"],
  setup(e, { emit: s }) {
    const n = s, a = me(), r = O(!1), d = O("Agent counts"), f = b(() => Fe(a.props.limits.rows.value).filter((x) => Re(x.running, x.run_limit) || Re(x.kept, x.kept_limit)).length);
    function y(x) {
      r.value = !1, n("open-agent", x);
    }
    return (x, A) => (t(), o(E, null, [
      v("button", {
        class: "counts-button",
        type: "button",
        title: "Agent counts",
        "aria-label": "Agent counts",
        "data-agent-counts": "",
        onClick: A[0] || (A[0] = (q) => r.value = !0)
      }, [
        $(u(be), {
          name: "settings",
          size: 16
        }),
        f.value ? (t(), o("span", Bn, g(f.value), 1)) : h("", !0)
      ]),
      r.value ? (t(), F(u(dt), {
        key: 0,
        title: d.value,
        modal: "",
        fits: "",
        onClose: A[3] || (A[3] = (q) => r.value = !1),
        onEscape: A[4] || (A[4] = (q) => r.value = !1)
      }, {
        default: S(() => [
          $(Rn, {
            title: d.value,
            "onUpdate:title": A[1] || (A[1] = (q) => d.value = q),
            onOpenAgent: y,
            onClose: A[2] || (A[2] = (q) => r.value = !1)
          }, null, 8, ["title"])
        ]),
        _: 1
      }, 8, ["title"])) : h("", !0)
    ], 64));
  }
}, Ln = /* @__PURE__ */ Q(On, [["__scopeId", "data-v-4094dc8b"]]), zn = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Vn = ["data-agent-row"], Ve = "journal.agents.filters", Ce = "cubic-bezier(0.2, 0.9, 0.25, 1)", Hn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const s = e, n = me(), { rows: a } = n.props.waits, { rows: r } = n.props.progress, { rows: d, failure: f, loaded: y, more: x } = n.props.agents, A = (W) => r.value.find((Z) => Z.agent_id === W.id) ?? null, q = (W) => {
      var Z;
      return ((Z = a.value.find((L) => L.agent_id === W.id)) == null ? void 0 : Z.reason) ?? "";
    }, D = O("running"), z = O(""), P = JSON.parse(localStorage.getItem(Ve) || '{"roles":[],"profiles":[],"programs":[]}'), j = O(P), V = b(() => n.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: H } = n.props.programs, G = b(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), C = (W, Z) => {
      j.value = gt(j.value, W, Z);
    }, m = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, I = (W) => W.slice(0, 1).toUpperCase() + W.slice(1);
    re(j, (W) => localStorage.setItem(Ve, JSON.stringify(W)));
    const T = O(25);
    function U() {
      Object.assign(n.state, {
        "agents.show": D.value,
        "agents.search": z.value,
        "agents.limit": String(T.value),
        "agents.roles": j.value.roles.join(","),
        "agents.profiles": j.value.profiles.join(","),
        "agents.programs": j.value.programs.join(",")
      });
    }
    async function _() {
      return T.value += 25, U(), await n.reload("agents"), !0;
    }
    re([D, z, j], () => {
      T.value = 25, U(), n.reload("agents");
    }), U();
    const K = (W) => W.facts ?? null, p = d, R = b(() => !!z.value.trim() || G.value > 0), J = b(() => s.texts[D.value] ?? { title: s.empty, hint: "" }), l = O(null), i = O(null), B = O(null), ee = O(null), M = b(() => l.value === null ? null : n.props[`card.${l.value}`].rows.value.find((W) => W.id === l.value) ?? i.value), c = b(() => M.value ? [M.value] : p.value), w = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let N = !1, Y = 0;
    async function ue(W) {
      if (N) return;
      N = !0, Y = ee.value.scrollTop;
      const Z = B.value.querySelector(`[data-agent-open="${W.id}"]`);
      if (!w()) {
        const ie = [...B.value.querySelectorAll(".agent-row")].filter((se) => !se.contains(Z));
        await Promise.all(ie.map((se) => se.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const L = [...Z.querySelectorAll(".agent-head, .agent-line")], te = [...L, ...Z.querySelectorAll("[data-agent-motion]")], Me = te.map((ie) => ie.getBoundingClientRect());
      if (i.value = W, l.value = W.id, n.reload(`card.${W.id}`), await Le(), !w()) {
        const ie = te.map((se) => se.getBoundingClientRect());
        te.forEach((se, $e) => {
          const ce = L.indexOf(se.parentElement), Pe = Me[$e].left - ie[$e].left - (ce < 0 ? 0 : Me[ce].left - ie[ce].left), De = Me[$e].top - ie[$e].top - (ce < 0 ? 0 : Me[ce].top - ie[ce].top);
          se.animate([{ transform: `translate(${Pe}px, ${De}px)` }, { transform: "none" }], { duration: 280, easing: Ce });
        }), B.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((se) => {
          se.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Ce, fill: "backwards" });
        });
      }
      N = !1;
    }
    async function fe() {
      if (N || !M.value) return;
      N = !0;
      const W = B.value.querySelector(`[data-agent-open="${l.value}"]`), Z = [...W.children], L = w() ? [] : Z.map((te) => te.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(L.map((te) => te.finished)), l.value = null, await Le(), ee.value.scrollTop = Y, L.forEach((te) => te.cancel()), w() || (W.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Ce }), B.value.querySelectorAll(".agent-row").forEach((te) => {
        te.contains(W) || te.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Ce });
      })), N = !1;
    }
    function we(W) {
      i.value = W, l.value = W.id, n.reload(`card.${W.id}`);
    }
    const de = (W) => l.value === W.id ? fe() : ue(W);
    re(z, (W) => W.trim() && (l.value = null)), re(D, () => {
      l.value = null;
    });
    const Be = (W) => {
      W.key === "Escape" && fe();
    };
    return window.addEventListener("keydown", Be), ke(() => window.removeEventListener("keydown", Be)), (W, Z) => (t(), o("div", {
      ref_key: "agents",
      ref: B,
      class: oe(["agents", { focused: M.value }])
    }, [
      $(u(ct), {
        modelValue: z.value,
        "onUpdate:modelValue": Z[1] || (Z[1] = (L) => z.value = L),
        placeholder: "Search agents",
        "menu-count": G.value,
        "data-agents-search": ""
      }, {
        menu: S(() => [
          $(u(je), null, {
            default: S(() => [...Z[2] || (Z[2] = [
              k("Type", -1)
            ])]),
            _: 1
          }),
          (t(!0), o(E, null, X(V.value.roles, (L) => (t(), F(u(xe), {
            key: L,
            role: "menuitemcheckbox",
            "aria-checked": j.value.roles.includes(L),
            checked: j.value.roles.includes(L),
            "data-filter-role": L,
            onClick: (te) => C("roles", L)
          }, {
            default: S(() => [
              k(g(I(L)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          V.value.profiles.length ? (t(), F(u(je), { key: 0 }, {
            default: S(() => [...Z[3] || (Z[3] = [
              k("Profile", -1)
            ])]),
            _: 1
          })) : h("", !0),
          (t(!0), o(E, null, X(V.value.profiles, (L) => (t(), F(u(xe), {
            key: L.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.profiles.includes(L.name),
            checked: j.value.profiles.includes(L.name),
            "data-filter-profile": L.name,
            onClick: (te) => C("profiles", L.name)
          }, {
            default: S(() => [
              k(g(L.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          $(u(je), null, {
            default: S(() => [...Z[4] || (Z[4] = [
              k("Program", -1)
            ])]),
            _: 1
          }),
          (t(!0), o(E, null, X(u(H), (L) => (t(), F(u(xe), {
            key: L.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.programs.includes(L.name),
            checked: j.value.programs.includes(L.name),
            "data-filter-program": L.name,
            onClick: (te) => C("programs", L.name)
          }, {
            default: S(() => [
              k(g(L.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          G.value ? (t(), F(u(xe), {
            key: 1,
            "data-filter-clear": "",
            onClick: m
          }, {
            default: S(() => [...Z[5] || (Z[5] = [
              k("Clear filters", -1)
            ])]),
            _: 1
          })) : h("", !0)
        ]),
        default: S(() => [
          $(u(vt), {
            options: V.value.states,
            value: D.value,
            onPick: Z[0] || (Z[0] = (L) => D.value = L)
          }, null, 8, ["options", "value"]),
          $(Ln, { onOpenAgent: we })
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      D.value === "retired" && V.value.upgrade_retired ? (t(), o("p", zn, "Retired during the upgrade: " + g(V.value.upgrade_retired), 1)) : h("", !0),
      v("div", {
        ref_key: "list",
        ref: ee,
        class: oe(["agents-view", { "agents-view-open": M.value }])
      }, [
        u(y) && !u(f) && !c.value.length && G.value ? (t(), F(u(Te), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: S(() => [
            $(u(ae), {
              small: "",
              "data-empty-clear": "",
              onClick: m
            }, {
              default: S(() => [...Z[6] || (Z[6] = [
                k("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (t(), F(u(pt), {
          key: 1,
          rows: c.value,
          failure: u(f),
          loaded: u(y),
          more: !M.value && u(x),
          older: _,
          empty: J.value.title,
          hint: J.value.hint,
          searching: R.value
        }, {
          default: S(({ row: L }) => [
            v("div", {
              class: "agent-row",
              "data-agent-row": L.id
            }, [
              $(sn, {
                row: L,
                facts: K(L),
                progress: A(L),
                "wait-reason": q(L),
                open: L.id === l.value,
                onToggle: (te) => de(L)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, Vn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, Wn = /* @__PURE__ */ Q(Hn, [["__scopeId", "data-v-06777d49"]]);
export {
  Wn as A
};
