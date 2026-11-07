/* @code-commandments-generated */
import { openBlock as a, createElementBlock as i, withModifiers as Y, unref as u, createTextVNode as m, toDisplayString as g, createVNode as y, createBlock as W, withCtx as S, Fragment as E, renderList as J, createElementVNode as c, createCommentVNode as f, ref as V, computed as k, watch as te, onUnmounted as ce, defineAsyncComponent as We, createSlots as qe, resolveDynamicComponent as Fe, normalizeStyle as se, normalizeClass as X, renderSlot as ge, onMounted as ze, Teleport as De, mergeProps as Pe, toRef as Ue, withKeys as Te, withDirectives as Ke, vShow as Je, nextTick as Re } from "vue";
import { peekRef as pe, Icon as be, RunningCommand as Ze, FoldGroup as Le, TaskStatusIcon as Ge, Btn as ae, TextArea as Ye, TextInput as Ce, useWindow as ve, SwitchCase as Be, loadWindowComponent as Qe, coalesced as Xe, READ_RATES as et, InnerTabs as tt, TabBody as at, EmptyState as Se, useNow as nt, age as lt, perHour as st, TimeAgo as xe, SearchBar as ot, Segmented as it, MenuLabel as $e, MenuItem as ke, RowList as rt, toggleFilter as dt } from "@journal/window-kit";
import { _ as Z, T as ut } from "./TranscriptRows-B2AEawo4.js";
const ct = {
  class: "agent-command",
  "data-agent-command": ""
}, gt = {
  key: 1,
  "data-agent-stopped": ""
}, pt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (r, s) => (a(), i("span", ct, [
      e.waitReason ? (a(), i("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: s[0] || (s[0] = Y((n) => u(pe)("test_queue:0"), ["stop"]))
      }, [
        m("Waiting: " + g(e.waitReason) + " ", 1),
        y(u(be), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), i("span", gt, "Waiting")) : (a(), W(u(Ze), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, vt = /* @__PURE__ */ Z(pt, [["__scopeId", "data-v-1b371fb5"]]), ht = ["data-agent-delegated", "onClick"], mt = { class: "agent-task-number" }, ft = { class: "agent-task-title" }, kt = ["title"], yt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: r }) {
    const s = r;
    return (n, v) => (a(), W(u(Le), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: v[0] || (v[0] = (w) => s("toggle"))
    }, {
      default: S(() => [
        (a(!0), i(E, null, J(e.section.tasks, (w) => (a(), i("button", {
          key: w.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": w.id,
          onClick: ($) => u(pe)(`tasks:${w.id}`)
        }, [
          y(u(Ge), {
            status: w.state
          }, null, 8, ["status"]),
          c("span", mt, g(w.id), 1),
          c("span", ft, g(w.title), 1),
          w.plan_id ? (a(), i("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${w.plan_id}: ${w.plan_title}`
          }, "Plan " + g(w.plan_id) + ": " + g(w.plan_title), 9, kt)) : f("", !0)
        ], 8, ht))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, bt = /* @__PURE__ */ Z(yt, [["__scopeId", "data-v-238ff959"]]), wt = { class: "action-field" }, Mt = ["value", "disabled"], xt = ["value"], $t = { key: 1 }, Ct = {
  key: 1,
  class: "action-field"
}, St = { class: "action-buttons" }, jt = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (r, s) => (a(), i("form", {
      onSubmit: s[4] || (s[4] = Y((n) => r.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (a(), i(E, { key: 0 }, [
        c("label", wt, [
          s[6] || (s[6] = m("Task ", -1)),
          c("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: s[0] || (s[0] = (n) => r.$emit("update:task", n.target.value))
          }, [
            s[5] || (s[5] = c("option", { value: "" }, "Choose an open task", -1)),
            (a(!0), i(E, null, J(e.tasks, (n) => (a(), i("option", {
              key: n.id,
              value: String(n.id)
            }, g(n.id) + ": " + g(n.title), 9, xt))), 128))
          ], 40, Mt)
        ]),
        e.moreTasks ? (a(), W(u(ae), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: s[1] || (s[1] = (n) => r.$emit("more"))
        }, {
          default: S(() => [...s[7] || (s[7] = [
            m("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : f("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (a(), i("p", $t, "No open tasks.")) : f("", !0)
      ], 64)) : (a(), i("label", Ct, [
        s[8] || (s[8] = m("Job", -1)),
        y(u(Ye), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: s[2] || (s[2] = (n) => r.$emit("update:text", n.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      c("div", St, [
        y(u(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: S(() => [...s[9] || (s[9] = [
            m("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        y(u(ae), {
          small: "",
          disabled: e.pending,
          onClick: s[3] || (s[3] = (n) => r.$emit("cancel"))
        }, {
          default: S(() => [...s[10] || (s[10] = [
            m("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, At = /* @__PURE__ */ Z(jt, [["__scopeId", "data-v-adde4158"]]), Tt = { class: "action-buttons" }, Rt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (r, s) => (a(), i("form", {
      "data-agent-retire-confirm": "",
      onSubmit: s[2] || (s[2] = Y((n) => r.$emit("submit"), ["prevent"]))
    }, [
      s[5] || (s[5] = c("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      y(u(Ce), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": s[0] || (s[0] = (n) => r.$emit("update:reason", n))
      }, null, 8, ["model-value", "disabled"]),
      c("div", Tt, [
        y(u(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: S(() => [...s[3] || (s[3] = [
            m("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        y(u(ae), {
          small: "",
          disabled: e.pending,
          onClick: s[1] || (s[1] = (n) => r.$emit("cancel"))
        }, {
          default: S(() => [...s[4] || (s[4] = [
            m("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Ot = /* @__PURE__ */ Z(Rt, [["__scopeId", "data-v-23a905c0"]]), Vt = { class: "action-buttons" }, zt = {
  key: 0,
  role: "alert"
}, Lt = {
  key: 1,
  role: "status"
}, Bt = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const r = e, s = ve(), n = V(""), v = V(""), w = V(""), $ = V(""), x = V([]), C = V(0), A = V(!1), _ = V(!1), L = V(!1), T = V(""), q = V(""), R = k(() => !!r.row.retired_at || r.row.state === "retired"), H = k(() => !R.value && !!r.row.ended_at), B = k(() => {
      var d;
      return H.value && ((d = r.row.job_command) == null ? void 0 : d.length) && !r.row.resume_reason;
    }), I = k(() => B.value && !_.value && (r.row.job_task_flag ? x.value.some((d) => String(d.id) === $.value) : !!v.value.trim()));
    function D(d) {
      n.value = d, v.value = "", w.value = "", $.value = "", T.value = "", q.value = "";
    }
    async function P() {
      D("job"), r.row.job_task_flag && (x.value = [], C.value = 0, A.value = !1, await U());
    }
    async function U() {
      if (!_.value) {
        _.value = !0;
        try {
          s.state["jobs.page"] = String(C.value + 1), await s.reload("jobs");
          const d = s.props.jobs;
          T.value = d.failure.value, T.value || (x.value = [...x.value, ...d.rows.value], C.value = d.data.value.page, A.value = d.more.value);
        } finally {
          _.value = !1;
        }
      }
    }
    async function h(d, t) {
      if (!L.value) {
        L.value = !0, T.value = "";
        try {
          const o = await s.run(d);
          T.value = o.ok ? "" : o.error, o.ok && (D(""), q.value = t);
        } finally {
          L.value = !1;
        }
      }
    }
    async function b() {
      if (!I.value) return;
      const d = r.row.job_task_flag ? [r.row.job_task_flag, $.value] : [v.value.trim()];
      await h([...r.row.job_command, String(r.row.id), ...d], "Job sent.");
    }
    async function l() {
      !H.value || n.value !== "retire" || !w.value.trim() || await h(["agent", "retire", String(r.row.id), "--reason", w.value.trim()], "Agent retired permanently.");
    }
    return (d, t) => {
      var o;
      return R.value ? f("", !0) : (a(), i("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: t[6] || (t[6] = Y(() => {
        }, ["stop"])),
        onKeydown: t[7] || (t[7] = Y(() => {
        }, ["stop"]))
      }, [
        c("div", Vt, [
          H.value ? (a(), i(E, { key: 0 }, [
            (o = e.row.job_command) != null && o.length ? (a(), W(u(ae), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: L.value || _.value || !B.value,
              onClick: P
            }, {
              default: S(() => [...t[8] || (t[8] = [
                m("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0),
            e.row.role !== "main" ? (a(), W(u(ae), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: L.value || _.value,
              onClick: t[0] || (t[0] = (O) => D("retire"))
            }, {
              default: S(() => [...t[9] || (t[9] = [
                m("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0)
          ], 64)) : f("", !0)
        ]),
        y(u(Be), { value: n.value }, {
          job: S(() => [
            y(At, {
              task: $.value,
              "onUpdate:task": t[1] || (t[1] = (O) => $.value = O),
              text: v.value,
              "onUpdate:text": t[2] || (t[2] = (O) => v.value = O),
              row: e.row,
              tasks: x.value,
              pending: L.value,
              loading: _.value,
              "more-tasks": A.value,
              failure: T.value,
              "job-ready": I.value,
              onSubmit: b,
              onMore: U,
              onCancel: t[3] || (t[3] = (O) => D(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: S(() => [
            y(Ot, {
              reason: w.value,
              "onUpdate:reason": t[4] || (t[4] = (O) => w.value = O),
              pending: L.value,
              onSubmit: l,
              onCancel: t[5] || (t[5] = (O) => D(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        T.value ? (a(), i("p", zt, g(T.value), 1)) : f("", !0),
        q.value ? (a(), i("p", Lt, g(q.value), 1)) : f("", !0)
      ], 32));
    };
  }
}, Ht = /* @__PURE__ */ Z(Bt, [["__scopeId", "data-v-b901f1a1"]]), It = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Et = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, _t = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, Nt = ["data-peek", "onClick"], Wt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, qt = {
  key: 0,
  class: "agent-helper-brief"
}, Ft = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Dt = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Pt = "It ended without a report", Ut = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const r = e, s = ["started", "blocked", "open", "completed"], n = k(() => {
      var t, o;
      return r.row.ended_at && ((o = (t = r.facts) == null ? void 0 : t.job_returned) != null && o.startsWith(Pt)) ? r.facts.job_returned : "";
    }), v = k(() => r.tasks.length ? s.map((t) => ({ state: t, label: t.slice(0, 1).toUpperCase() + t.slice(1), tasks: r.tasks.filter((o) => o.state === t || t === "started" && o.state === "testing" || t === "completed" && o.state === "cancelled") })) : []), w = /* @__PURE__ */ new Set(["completed"]), $ = V({}), x = (t) => !($.value[t] ?? w.has(t)), C = (t) => $.value = { ...$.value, [t]: x(t) }, A = ve(), { rows: _ } = A.props.reports;
    A.state["reports.agent"] = String(r.row.id);
    const L = k(() => r.row.access === "read-only"), T = k(() => !!r.row.retired_at || r.row.state === "retired"), q = ["tasks", "transcript", "terminal", "file-feed", "reports"], R = k(() => (T.value ? A.tabs.filter((o) => ["reports", "transcript"].includes(o.key)) : L.value ? A.tabs.filter((o) => ["reports", "transcript", "terminal"].includes(o.key)) : [...A.tabs]).sort((o, O) => (q.indexOf(o.key) < 0 ? q.length : q.indexOf(o.key)) - (q.indexOf(O.key) < 0 ? q.length : q.indexOf(O.key)))), H = () => L.value || T.value ? R.value.find((t) => t.key === "transcript") : R.value[0], B = V(H());
    te(B, (t) => {
      A.state.tab = (t == null ? void 0 : t.key) ?? "";
    }, { immediate: !0 }), ce(() => {
      A.state.tab = "";
    }), te(R, (t) => {
      t.some((o) => {
        var O;
        return o.key === ((O = B.value) == null ? void 0 : O.key);
      }) || (B.value = t[0]);
    }), te(() => r.open, (t) => {
      t && (B.value = H());
    });
    const I = Object.fromEntries(A.tabs.filter((t) => t.component).map((t) => [t.key, We(() => Qe(t.component))])), D = V(!1), { data: P } = A.props.tool, U = k(() => {
      var t;
      return ((t = P.value) == null ? void 0 : t.tool) ?? "";
    }), h = k(() => {
      var t;
      return ((t = P.value) == null ? void 0 : t.note) ?? "";
    }), b = k(() => r.row.role !== "main" && (!r.row.ended_at || r.stoppedWithWork || r.waitReason));
    async function l() {
      !r.open || !b.value || (A.state["tool.agent"] = String(r.row.id), await A.reload("tool"));
    }
    const d = A.follow(["hook_call.*", "process_part.*"], Xe(l, et.agentCommand));
    return ce(() => d == null ? void 0 : d()), te(() => r.open, (t) => {
      t && l();
    }, { immediate: !0 }), (t, o) => {
      var O;
      return a(), i("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: o[2] || (o[2] = Y(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (a(), i("p", It, "Retirement reason: " + g(e.row.retirement_reason), 1)) : f("", !0),
        e.row.resume_reason ? (a(), i("p", Et, g(e.row.resume_reason), 1)) : f("", !0),
        y(Ht, { row: e.row }, null, 8, ["row"]),
        b.value ? (a(), W(vt, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: U.value,
          note: h.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : f("", !0),
        n.value ? (a(), i("p", _t, g(n.value), 1)) : f("", !0),
        y(u(tt), {
          class: "agent-tabs",
          tabs: R.value,
          active: B.value,
          answer: { tasks: e.tasks.length, reports: u(_).length },
          onChoose: o[0] || (o[0] = (p) => B.value = p)
        }, null, 8, ["tabs", "active", "answer"]),
        y(u(at), {
          class: "agent-tab-body",
          tab: B.value,
          "data-agent-tab-body": (O = B.value) == null ? void 0 : O.key
        }, {
          default: S(() => {
            var p;
            return [
              y(u(Be), {
                value: (p = B.value) == null ? void 0 : p.key
              }, qe({
                reports: S(() => [
                  u(_).length ? f("", !0) : (a(), W(u(Se), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: S(() => [...o[3] || (o[3] = [
                      m("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (a(!0), i(E, null, J(u(_), (M) => (a(), i("button", {
                    key: M.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${M.id}`,
                    onClick: (z) => u(pe)(`messages:${M.id}`)
                  }, g(M.text), 9, Nt))), 128))
                ]),
                tasks: S(() => {
                  var M;
                  return [
                    e.tasks.length ? f("", !0) : (a(), W(u(Se), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: S(() => [...o[4] || (o[4] = [
                        m("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (a(!0), i(E, null, J(v.value, (z) => (a(), W(bt, {
                      key: z.state,
                      section: z,
                      open: x(z.state),
                      onToggle: (Q) => C(z.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (M = e.facts) != null && M.instruction ? (a(), i(E, { key: 1 }, [
                      o[5] || (o[5] = c("p", { class: "agent-label" }, "Instruction", -1)),
                      c("div", Wt, g(e.facts.instruction), 1)
                    ], 64)) : f("", !0)
                  ];
                }),
                transcript: S(() => {
                  var M;
                  return [
                    L.value ? (a(), i(E, { key: 0 }, [
                      (M = e.facts) != null && M.instruction ? (a(), i("div", qt, [
                        y(u(Le), {
                          label: "Instruction",
                          open: D.value,
                          "data-agent-section": "instruction",
                          onToggle: o[1] || (o[1] = (z) => D.value = !D.value)
                        }, {
                          default: S(() => [
                            c("div", Ft, g(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (a(), i("p", Dt, "No job recorded")) : f("", !0)
                    ], 64)) : f("", !0),
                    y(ut, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                J(u(I), (M, z) => ({
                  name: z,
                  fn: S(() => [
                    (a(), W(Fe(M), {
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
}, Kt = /* @__PURE__ */ Z(Ut, [["__scopeId", "data-v-64e34ca6"]]), Jt = {
  class: "agent-count",
  "data-agent-motion": ""
}, Zt = {
  key: 0,
  class: "agent-pace",
  "data-agent-pace": ""
}, Gt = {
  class: "agent-tasks",
  "data-agent-tasks": ""
}, Yt = {
  __name: "AgentTaskCount",
  props: { count: { type: String, required: !0 }, rate: { type: String, required: !0 } },
  setup(e) {
    return (r, s) => (a(), i("span", Jt, [
      e.rate ? (a(), i("span", Zt, g(e.rate), 1)) : f("", !0),
      c("span", Gt, g(e.count), 1)
    ]));
  }
}, Oe = /* @__PURE__ */ Z(Yt, [["__scopeId", "data-v-44694015"]]), Qt = ["stroke-width", "innerHTML"], G = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const r = e, s = { right: 0, down: 90, left: 180, up: 270 }, n = {
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
    }, v = {
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
    return (w, $) => (a(), i("svg", {
      class: "ico",
      style: se({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...r.facing === "right" ? {} : { transform: `rotate(${s[r.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: v[n[e.name] || e.name] || v.dot
    }, null, 12, Qt));
  }
}, Xt = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, ea = {
  key: 1,
  class: "menu-item-text"
}, ta = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (r, s) => (a(), i("button", {
      type: "button",
      class: X(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), i("span", Xt, g(e.checked ? "✓" : ""), 1)) : f("", !0),
      e.description ? (a(), i("span", ea, [
        c("span", null, [
          ge(r.$slots, "default", {}, void 0, !0)
        ]),
        c("small", null, g(e.description), 1)
      ])) : ge(r.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, de = /* @__PURE__ */ Z(ta, [["__scopeId", "data-v-fec99974"]]), aa = {}, na = { class: "menu-label" };
function la(e, r) {
  return a(), i("span", na, [
    ge(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ue = /* @__PURE__ */ Z(aa, [["render", la], ["__scopeId", "data-v-aa955b3e"]]), sa = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, oa = {
  key: 0,
  class: "skills-none"
}, ia = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: r }) {
    const s = e, n = r, v = k(() => s.skills.filter(($) => $.state === "loaded")), w = k(() => s.skills.filter(($) => $.state !== "loaded"));
    return ($, x) => (a(), i("div", sa, [
      y(ue, null, {
        default: S(() => [...x[1] || (x[1] = [
          m("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      v.value.length ? f("", !0) : (a(), i("p", oa, "None yet. Compacting the conversation empties this list.")),
      (a(!0), i(E, null, J(v.value, (C) => (a(), i("p", {
        key: C.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        y(G, {
          name: "book",
          size: 12
        }),
        m(g(C.skill), 1)
      ]))), 128)),
      w.value.length ? (a(), i(E, { key: 1 }, [
        y(ue, null, {
          default: S(() => [...x[2] || (x[2] = [
            m("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), i(E, null, J(w.value, (C) => (a(), i("p", {
          key: C.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          y(G, {
            name: "book",
            size: 12
          }),
          m(g(C.skill), 1)
        ]))), 128))
      ], 64)) : f("", !0),
      y(de, {
        "data-agent-skills-browse": "",
        onClick: x[0] || (x[0] = (C) => n("browse"))
      }, {
        default: S(() => [...x[3] || (x[3] = [
          m("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, ra = /* @__PURE__ */ Z(ia, [["__scopeId", "data-v-be514d47"]]), da = (e, r, s) => Math.max(r, Math.min(s, e)), He = /* @__PURE__ */ new WeakMap(), ua = (e, r) => He.set(e, r);
function ca(e, r) {
  for (let s = r; s; s = He.get(s) ?? s.parentElement) if (s === e) return !0;
  return !1;
}
function ga(e, r) {
  const s = (n) => {
    var w, $;
    const v = ((w = e.value) == null ? void 0 : w.element) || (($ = e.value) == null ? void 0 : $.$el) || e.value;
    v && !ca(v, n.target) && r(n);
  };
  window.addEventListener("click", s), ce(() => window.removeEventListener("click", s));
}
const re = 8, pa = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: r, emit: s }) {
    const n = e, v = V(null), w = (p) => p ? `${p}px` : void 0, $ = k(() => ({
      minWidth: w(n.minWidth),
      maxWidth: w(n.maxWidth),
      maxHeight: w(n.maxHeight),
      height: w(n.height)
    })), x = V({ w: 0, h: 0 }), C = V(n.anchor ? n.anchor.getBoundingClientRect() : null), A = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), _ = (p) => ({
      left: Math.max(0, p.left),
      top: Math.max(0, p.top),
      right: Math.min(window.innerWidth, p.right),
      bottom: Math.min(window.innerHeight, p.bottom)
    }), L = (p) => {
      const M = p.closest(".pane, .float-window");
      return M ? _(M.getBoundingClientRect()) : A();
    }, T = (p, M) => `${Math.max(0, p ? Math.min(p, M) : M)}px`;
    function q(p, M) {
      return {
        below: p.bottom - M.bottom - n.gap - re,
        above: M.top - p.top - n.gap - re,
        across: p.right - p.left - 2 * re
      };
    }
    function R(p) {
      const M = L(n.anchor), z = q(M, p);
      return x.value.w <= z.across && x.value.h <= Math.max(z.below, z.above) ? M : A();
    }
    const H = k(() => {
      if (!C.value) return $.value;
      const p = C.value, M = R(p), z = q(M, p), { w: Q, h: he } = x.value, oe = n.align === "auto" ? p.left + p.right > M.left + M.right : n.align === "right", ne = da(oe ? p.right - Q : p.left, M.left + re, Math.max(M.left + re, M.right - Q - re)), Me = he > z.below && z.above > z.below ? { bottom: `${window.innerHeight - p.top + n.gap}px`, maxHeight: T(n.maxHeight, z.above) } : { top: `${p.bottom + n.gap}px`, maxHeight: T(n.maxHeight, z.below) };
      return { ...$.value, ...Me, left: `${ne}px`, maxWidth: T(n.maxWidth, z.across) };
    }), B = s, I = () => [...v.value.querySelectorAll("button:not(:disabled)")];
    function D(p) {
      const M = I(), z = M.indexOf(document.activeElement);
      M[(z + p + M.length) % M.length].focus();
    }
    const P = { ArrowDown: () => D(1), ArrowUp: () => D(-1), Escape: () => B("close") }, U = (p) => P[p.key] && (p.preventDefault(), P[p.key]()), h = () => v.value && (x.value = { w: v.value.offsetWidth, h: v.value.scrollHeight });
    let b = 0;
    const l = new ResizeObserver(() => {
      cancelAnimationFrame(b), b = requestAnimationFrame(h);
    });
    ga(v, (p) => n.anchor && !n.anchor.contains(p.target) && B("close"));
    const d = (p, M) => ["top", "left", "right", "bottom"].some((z) => Math.abs(p[z] - M[z]) > 1), t = (p) => p.bottom < 0 || p.top > window.innerHeight;
    let o = 0;
    function O() {
      if (n.anchor) {
        const p = n.anchor.getBoundingClientRect();
        if (!n.anchor.isConnected || t(p)) return B("close");
        d(p, C.value) && (C.value = p);
      }
      o = requestAnimationFrame(O);
    }
    return ze(() => {
      n.anchor && v.value && ua(v.value, n.anchor), h(), v.value && l.observe(v.value), !n.plain && I()[0] && I()[0].focus(), O();
    }), ce(() => {
      l.disconnect(), cancelAnimationFrame(o), cancelAnimationFrame(b);
    }), r({ element: v }), (p, M) => (a(), W(De, {
      to: "body",
      disabled: !e.anchor
    }, [
      c("div", Pe({
        ref_key: "panel",
        ref: v
      }, p.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: H.value,
        onKeydown: U
      }), [
        ge(p.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), va = /* @__PURE__ */ Z(pa, [["__scopeId", "data-v-3d203970"]]);
async function ha(e, r, s) {
  if (!e) return s(r);
  const { target: n, fields: v } = e, w = Object.fromEntries(Object.keys(v).map((C) => [C, n[C]])), $ = () => Object.assign(n, w);
  Object.assign(n, v);
  let x = !1;
  try {
    const C = await s(r);
    return x = C.ok, C;
  } finally {
    x || $();
  }
}
function ma(e, r, s) {
  const n = V([]), v = V([]), w = V({}), $ = V(""), x = V(!1), C = k(() => !!e.value && !e.value.ended_at), A = k(() => C.value && !!e.value.paused_at);
  async function _() {
    if (C.value) {
      const B = await r(["agent", "controls", String(e.value.id)]);
      n.value = B.ok ? B.value.groups : [];
      return;
    }
    const H = await r(["agent", "programs"]);
    v.value = H.ok ? H.value.rows : [];
  }
  async function L(H, B = null) {
    $.value = "";
    const I = await ha(B, H, r);
    return $.value = I.ok ? "" : I.error, s(), I;
  }
  const T = (H, B) => L(["agent", "control", String(e.value.id), H, B.value], { target: w, fields: { value: { ...w.value, [H]: B.label } } }), q = () => (x.value = !1, L(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), R = (H) => L(["agent", "launch", H.name]);
  return ze(_), te(C, _), { groups: n, programs: v, chosen: w, failure: $, asking: x, running: C, paused: A, choose: T, stop: q, start: R };
}
const Ie = { claude: "Claude Code", codex: "Codex" };
Object.entries(Ie).map(([e, r]) => ({ key: e, label: r }));
function fa(e, r = "agent") {
  return Ie[e] || r;
}
function ka(e) {
  if (!e) return "Not compacted yet";
  const r = new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return e.start_percent === null ? `Last compacted ${r}` : e.end_percent === null ? `Last compacted ${r}, from ${e.start_percent}%` : `Last compacted ${r}, from ${e.start_percent}% to ${e.end_percent}%, ${e.start_percent - e.end_percent}% taken off`;
}
const ya = ["disabled", "title"], ba = ["title"], wa = { class: "gauge usage" }, Ma = ["disabled", "title"], xa = { class: "gauge" }, $a = ["disabled", "title"], Ca = ["disabled"], Sa = ["disabled"], ja = {
  key: 5,
  class: "fact",
  "data-fact": "uptime",
  title: "How long this session has run"
}, Aa = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Ta = ["title"], Ra = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Oa = { class: "gauge" }, Va = { class: "context-used" }, za = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, La = 75, Ba = {
  __name: "InformationBar",
  props: {
    agent: { type: Object, default: null },
    card: Boolean,
    loading: Boolean,
    jobs: { type: Number, default: 0 },
    usage: { type: Object, default: () => ({ agents: [], windows: [] }) },
    branch: { type: String, default: "" },
    now: { type: Number, default: () => Date.now() },
    fitness: { type: Object, default: null },
    run: { type: Function, default: null }
  },
  emits: ["open", "changed"],
  setup(e, { emit: r }) {
    const s = e, n = r, v = ma(Ue(s, "agent"), s.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => n("changed")), w = V(null), $ = V(""), x = k(() => v.groups.value.find((l) => l.key === $.value));
    function C(l, d) {
      w.value = l.currentTarget, $.value = d;
    }
    function A() {
      w.value = null, $.value = "", v.asking.value = !1;
    }
    const _ = V([]), L = k(() => _.value.filter((l) => l.state === "loaded"));
    async function T() {
      const l = s.agent && s.run ? await s.run(["agent-skill", "list", "--agent", String(s.agent.id)]) : null;
      _.value = l != null && l.ok ? l.value.rows ?? [] : [];
    }
    function q(l) {
      C(l, "skills"), T();
    }
    te(() => {
      var l;
      return (l = s.agent) == null ? void 0 : l.id;
    }, T, { immediate: !0 });
    const R = (l) => v.groups.value.some((d) => d.key === l), H = k(() => {
      var l;
      return v.chosen.value.model ?? ((l = I.value) == null ? void 0 : l.model) ?? "";
    }), B = k(() => {
      var l;
      return v.chosen.value.effort ?? ((l = I.value) == null ? void 0 : l.effort) ?? "";
    });
    k(() => !!s.agent && !s.agent.ended_at);
    const I = k(() => {
      var l;
      return ((l = s.usage.agents) == null ? void 0 : l.find((d) => {
        var t;
        return d.id === ((t = s.agent) == null ? void 0 : t.id);
      })) ?? null;
    }), D = k(() => {
      var l;
      return ((l = s.usage.windows) == null ? void 0 : l[0]) ?? null;
    }), P = k(() => D.value ? Math.max(0, Math.min(100, Math.round(D.value.used_percent))) : null), U = k(() => {
      var l;
      return ((l = I.value) == null ? void 0 : l.context_percent) == null ? null : Math.round(I.value.context_percent);
    }), h = k(() => {
      var l;
      return (l = I.value) != null && l.cost_dollars ? `$${I.value.cost_dollars.toFixed(2)}` : "";
    }), b = k(() => {
      var t;
      const l = (t = s.agent) != null && t.process_started_at ? new Date(s.agent.process_started_at).getTime() : 0;
      if (!l) return "";
      const d = Math.max(0, Math.floor((s.now - l) / 6e4));
      return d >= 60 ? `${Math.floor(d / 60)}h ${d % 60}m` : `${d}m`;
    });
    return (l, d) => (a(), i("div", {
      class: X(["information", { card: e.card }]),
      "data-information-bar": ""
    }, [
      e.agent ? (a(), i(E, { key: 0 }, [
        c("button", {
          type: "button",
          class: "fact lead",
          disabled: e.card,
          "data-fact": "agent",
          title: `Session ${e.agent.session}: stop it`,
          onClick: d[0] || (d[0] = (t) => C(t, "agent"))
        }, [
          y(G, {
            name: "agents",
            size: 12
          }),
          m(" " + g(u(fa)(e.agent.program)), 1)
        ], 8, ya),
        P.value !== null ? (a(), i("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${P.value}% of the plan's ${D.value.title} allowance used`,
          onClick: d[1] || (d[1] = (t) => n("open", "usage", t.currentTarget))
        }, [
          y(G, {
            name: "clock",
            size: 12
          }),
          d[14] || (d[14] = m()),
          c("span", wa, [
            c("span", {
              style: se({ width: `${P.value}%` })
            }, null, 4)
          ]),
          m(" " + g(P.value) + "% ", 1)
        ], 8, ba)) : f("", !0),
        U.value !== null ? (a(), i("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "context",
          title: `Context ${U.value}% full: clear or compact it`,
          onClick: d[2] || (d[2] = (t) => R("context") ? C(t, "context") : n("open", "context", t.currentTarget))
        }, [
          y(G, {
            name: "gauge",
            size: 12
          }),
          d[15] || (d[15] = m()),
          c("span", xa, [
            c("span", {
              style: se({ width: `${U.value}%` })
            }, null, 4)
          ]),
          m(" " + g(U.value) + "% ", 1)
        ], 8, Ma)) : f("", !0),
        H.value ? (a(), i("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "model",
          title: `${H.value}: change the model`,
          onClick: d[3] || (d[3] = (t) => R("model") ? C(t, "model") : null)
        }, [
          y(G, {
            name: "model",
            size: 12
          }),
          m(" " + g(H.value), 1)
        ], 8, $a)) : f("", !0),
        R("effort") || e.card && B.value ? (a(), i("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: d[4] || (d[4] = (t) => C(t, "effort"))
        }, [
          y(G, {
            name: "bolt",
            size: 12
          }),
          m(" " + g(B.value), 1)
        ], 8, Ca)) : f("", !0),
        h.value ? (a(), i("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: d[5] || (d[5] = (t) => n("open", "cost", t.currentTarget))
        }, g(h.value), 9, Sa)) : f("", !0),
        b.value ? (a(), i("span", ja, [
          y(G, {
            name: "reminders",
            size: 12
          }),
          m(" " + g(b.value), 1)
        ])) : f("", !0),
        e.branch ? (a(), i("span", Aa, [
          y(G, {
            name: "branch",
            size: 12
          }),
          m(" " + g(e.branch), 1)
        ])) : f("", !0),
        e.card ? f("", !0) : (a(), i("button", {
          key: 7,
          type: "button",
          class: X(["fact", { none: !e.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: d[6] || (d[6] = (t) => n("open", "jobs", t.currentTarget))
        }, [
          y(G, {
            name: "clock",
            size: 12
          }),
          m(" " + g(e.jobs), 1)
        ], 2)),
        e.run ? (a(), i("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: q
        }, [
          y(G, {
            name: "book",
            size: 12
          }),
          m(" " + g(L.value.length), 1)
        ])) : f("", !0),
        e.fitness ? (a(), i(E, { key: 9 }, [
          c("button", {
            type: "button",
            class: X(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < La }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: d[7] || (d[7] = (t) => n("open", "fitness", t.currentTarget))
          }, [
            y(G, {
              name: "heart",
              size: 12
            }),
            m(" " + g(e.fitness.is_measured ? e.fitness.score : "–"), 1)
          ], 2),
          c("button", {
            type: "button",
            class: X(["fact", "load-fact", e.fitness.workload_level]),
            "data-fact": "load",
            title: "Compare incoming messages with agent replies",
            onClick: d[8] || (d[8] = (t) => n("open", "load", t.currentTarget))
          }, [
            y(G, {
              name: "weight",
              size: 12
            }),
            m(" " + g(e.fitness.workload), 1)
          ], 2)
        ], 64)) : f("", !0)
      ], 64)) : e.run && !e.loading ? (a(), i("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: d[9] || (d[9] = (t) => C(t, "start"))
      }, [
        y(G, {
          name: "agents",
          size: 12
        }),
        d[16] || (d[16] = m(" Start an agent", -1))
      ])) : f("", !0),
      d[22] || (d[22] = c("span", { class: "space" }, null, -1)),
      u(v).failure.value ? (a(), i("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: u(v).failure.value
      }, g(u(v).failure.value), 9, Ta)) : f("", !0),
      ge(l.$slots, "default", {}, void 0, !0),
      w.value ? (a(), W(va, {
        key: 3,
        anchor: w.value,
        "min-width": 190,
        onClose: A
      }, {
        default: S(() => {
          var t;
          return [
            $.value === "agent" ? (a(), i(E, { key: 0 }, [
              u(v).asking.value ? (a(), i(E, { key: 0 }, [
                y(ue, { "data-agent-stop-ask": "" }, {
                  default: S(() => [...d[17] || (d[17] = [
                    m("Stop the agent? It stops what it is doing.", -1)
                  ])]),
                  _: 1
                }),
                y(de, {
                  "data-agent-stop-confirm": "",
                  onClick: d[10] || (d[10] = (o) => (A(), u(v).stop()))
                }, {
                  default: S(() => [...d[18] || (d[18] = [
                    m("Stop it", -1)
                  ])]),
                  _: 1
                }),
                y(de, {
                  onClick: d[11] || (d[11] = (o) => u(v).asking.value = !1)
                }, {
                  default: S(() => [...d[19] || (d[19] = [
                    m("Keep it running", -1)
                  ])]),
                  _: 1
                })
              ], 64)) : (a(), W(de, {
                key: 1,
                "data-agent-stop": "",
                onClick: d[12] || (d[12] = (o) => u(v).asking.value = !0)
              }, {
                default: S(() => [...d[20] || (d[20] = [
                  m("Stop", -1)
                ])]),
                _: 1
              }))
            ], 64)) : $.value === "start" ? (a(), i(E, { key: 1 }, [
              y(ue, null, {
                default: S(() => [...d[21] || (d[21] = [
                  m("Start an agent", -1)
                ])]),
                _: 1
              }),
              (a(!0), i(E, null, J(u(v).programs.value, (o) => (a(), W(de, {
                key: o.name,
                "data-agent-program": o.name,
                onClick: (O) => (A(), u(v).start(o))
              }, {
                default: S(() => [
                  m(g(o.title), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-program", "onClick"]))), 128))
            ], 64)) : $.value === "skills" ? (a(), W(ra, {
              key: 2,
              skills: _.value,
              onBrowse: d[13] || (d[13] = (o) => (A(), n("open", "skills", null)))
            }, null, 8, ["skills"])) : x.value ? (a(), i(E, { key: 3 }, [
              y(ue, null, {
                default: S(() => [
                  m(g(x.value.label), 1)
                ]),
                _: 1
              }),
              $.value === "context" ? (a(), i(E, { key: 0 }, [
                c("div", Ra, [
                  c("span", Oa, [
                    c("span", {
                      style: se({ width: `${U.value}%` })
                    }, null, 4)
                  ]),
                  c("span", Va, g(U.value) + "%", 1)
                ]),
                c("p", za, g(u(ka)(((t = I.value) == null ? void 0 : t.last_compaction) ?? null)), 1)
              ], 64)) : f("", !0),
              (a(!0), i(E, null, J(x.value.choices, (o) => (a(), W(de, {
                key: o.value,
                "data-agent-choice": o.value,
                onClick: (O) => (u(v).choose(x.value.key, o), A())
              }, {
                default: S(() => [
                  m(g(o.label), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-choice", "onClick"]))), 128))
            ], 64)) : f("", !0)
          ];
        }),
        _: 1
      }, 8, ["anchor"])) : f("", !0)
    ], 2));
  }
}, Ha = /* @__PURE__ */ Z(Ba, [["__scopeId", "data-v-58c7f8ed"]]), Ia = ["data-agent-open", "aria-expanded", "role", "tabindex"], Ea = { class: "agent-head" }, _a = ["data-state"], Na = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Wa = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, qa = { class: "agent-times" }, Fa = {
  key: 0,
  class: "agent-time",
  "data-agent-motion": ""
}, Da = {
  key: 1,
  class: "agent-time",
  "data-agent-motion": ""
}, Pa = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": ""
}, Ua = { class: "agent-line" }, Ka = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Ja = {
  key: 0,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Za = {
  key: 1,
  class: "agent-line"
}, Ga = {
  key: 2,
  class: "agent-line agent-work-start"
}, Ya = ["data-peek"], Qa = ["title"], Xa = ["data-peek"], en = ["data-agent-waiting", "data-agent-stopped"], tn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: r }) {
    const s = { helper: "Helper", reviewer: "Reviewer" }, n = e, v = r, w = nt(), $ = k(() => {
      var o, O;
      if ((o = n.facts) != null && o.profile_title) return n.facts.profile_title;
      if ((O = n.facts) != null && O.profile) return n.facts.profile;
      const t = s[n.row.role] || n.row.role;
      return t.slice(0, 1).toUpperCase() + t.slice(1);
    }), x = k(() => {
      var t;
      return ((t = n.facts) == null ? void 0 : t.tasks) ?? [];
    }), C = k(() => x.value.filter((t) => t.state === "open")), A = k(() => {
      const t = x.value.find((o) => {
        var O;
        return o.id === ((O = n.facts) == null ? void 0 : O.task_id);
      });
      return t != null && t.plan_id ? t : C.value.find((o) => o.plan_id);
    }), _ = k(() => {
      var t, o, O, p, M;
      return n.row.role === "helper" ? ((t = n.facts) == null ? void 0 : t.helper_job) || "" : (o = n.facts) != null && o.job_enabled && (((O = n.facts) == null ? void 0 : O.task_title) || ((p = C.value[0]) == null ? void 0 : p.title) || ((M = x.value.at(-1)) == null ? void 0 : M.title)) || "";
    }), L = k(() => {
      const t = _.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return t ? `${t[1].toLowerCase() === "plan" ? "plans" : "docs"}:${t[2]}` : "";
    }), T = k(() => {
      var t;
      return (t = n.facts) != null && t.job_enabled ? `${n.row.role} ${n.row.id}` : "";
    }), q = k(() => {
      var t, o;
      return [n.row.program, (t = n.facts) == null ? void 0 : t.model, (o = n.facts) == null ? void 0 : o.effort, T.value].filter(Boolean).join(" · ");
    }), R = ve(), H = k(() => lt(n.row.process_started_at || n.row.created_at, w.value)), B = /* @__PURE__ */ new Set(["open", "started", "testing"]), I = k(() => !!n.row.ended_at && n.row.role !== "main" && x.value.some((t) => B.has(t.state))), D = k(() => {
      var t;
      return n.row.retired_at || n.row.state === "retired" ? "retired" : n.waitReason || I.value ? "waiting" : n.row.state === "running" && ((t = n.facts) == null ? void 0 : t.state) || n.row.state;
    }), P = k(() => {
      var t;
      return n.waitReason ? `Waiting: ${n.waitReason}` : D.value === "blocked" ? (t = n.facts) != null && t.blocked_reason ? `Blocked: ${n.facts.blocked_reason}` : "Blocked" : I.value ? "Stopped with work left" : "";
    }), U = k(() => {
      var t;
      return ((t = n.progress) == null ? void 0 : t.completed_count) ?? x.value.filter((o) => o.state === "completed").length;
    }), h = k(() => {
      var t;
      return ((t = n.progress) == null ? void 0 : t.task_count) ?? x.value.length;
    }), b = k(() => `${U.value} of ${h.value} ${h.value === 1 ? "task" : "tasks"}`), l = k(() => {
      var o;
      const t = st(U.value, ((o = n.progress) == null ? void 0 : o.started_at) || n.row.created_at, n.progress ? n.progress.finished_at : n.row.ended_at, w.value);
      return n.row.role !== "main" && t ? `${t} per hour` : "";
    }), d = k(() => !!n.row.retired_at || n.row.state === "retired");
    return (t, o) => {
      var O, p, M;
      return a(), i("div", {
        class: X(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: o[4] || (o[4] = (z) => !e.open && v("toggle")),
        onKeydown: [
          o[5] || (o[5] = Te(Y((z) => !e.open && v("toggle"), ["self", "prevent"]), ["enter"])),
          o[6] || (o[6] = Te(Y((z) => !e.open && v("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        c("span", Ea, [
          e.open ? (a(), i("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: o[0] || (o[0] = Y((z) => v("toggle"), ["stop"]))
          }, [
            y(u(be), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : f("", !0),
          c("span", {
            class: "agent-dot",
            "data-state": D.value,
            "data-agent-motion": ""
          }, null, 8, _a),
          c("span", Na, g($.value), 1),
          c("span", Wa, g(((O = e.facts) == null ? void 0 : O.given_name) || e.row.id), 1),
          e.open ? f("", !0) : (a(), W(u(be), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          c("span", qa, [
            d.value ? (a(), i("span", Fa, [
              o[7] || (o[7] = m("Retired, ", -1)),
              y(u(xe), {
                at: e.row.retired_at
              }, null, 8, ["at"])
            ])) : e.row.ended_at ? (a(), i("span", Da, [
              o[8] || (o[8] = m("Idle, ", -1)),
              y(u(xe), {
                at: e.row.ended_at
              }, null, 8, ["at"])
            ])) : (a(), i("span", Pa, g(H.value), 1))
          ])
        ]),
        c("span", Ua, [
          c("span", Ka, g(e.open ? T.value : q.value), 1),
          e.open && ((p = e.facts) != null && p.last_activity) ? (a(), i("span", Ja, [
            o[9] || (o[9] = m("Last heard: ", -1)),
            y(u(xe), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : f("", !0)
        ]),
        e.open ? (a(), W(Ha, {
          key: 0,
          agent: e.row,
          branch: (M = e.progress) == null ? void 0 : M.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: [] },
          card: ""
        }, {
          default: S(() => [
            e.row.role === "helper" && !e.row.ended_at ? (a(), W(u(ae), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: o[1] || (o[1] = Y((z) => u(R).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: S(() => [...o[10] || (o[10] = [
                m("Stop", -1)
              ])]),
              _: 1
            })) : f("", !0)
          ]),
          _: 1
        }, 8, ["agent", "branch", "usage"])) : f("", !0),
        e.open && h.value && !_.value ? (a(), i("span", Za, [
          y(Oe, {
            count: b.value,
            rate: l.value
          }, null, 8, ["count", "rate"])
        ])) : f("", !0),
        e.open && A.value ? (a(), i("span", Ga, [
          c("button", {
            type: "button",
            class: "agent-plan",
            "data-agent-plan": "",
            "data-peek": `plans:${A.value.plan_id}`,
            onClick: o[2] || (o[2] = Y((z) => u(pe)(`plans:${A.value.plan_id}`), ["stop"]))
          }, "Plan " + g(A.value.plan_id) + ": " + g(A.value.plan_title), 9, Ya)
        ])) : f("", !0),
        _.value || !e.open && P.value ? (a(), i("span", {
          key: 3,
          class: X(["agent-line", { "agent-work-start": !A.value }])
        }, [
          c("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: _.value
          }, [
            e.open && L.value ? (a(), i("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": L.value,
              onClick: o[3] || (o[3] = Y((z) => u(pe)(L.value), ["stop"]))
            }, g(_.value), 9, Xa)) : (a(), i(E, { key: 1 }, [
              m(g(_.value), 1)
            ], 64))
          ], 8, Qa),
          !e.open && P.value ? (a(), i("span", {
            key: 0,
            class: "agent-work-status",
            "data-agent-waiting": e.waitReason ? "" : null,
            "data-agent-stopped": I.value && !e.waitReason ? "" : null
          }, g(P.value), 9, en)) : f("", !0),
          e.open && h.value ? (a(), W(Oe, {
            key: 1,
            count: b.value,
            rate: l.value
          }, null, 8, ["count", "rate"])) : f("", !0)
        ], 2)) : f("", !0),
        e.open ? (a(), W(Kt, {
          key: 4,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: x.value,
          "stopped-with-work": I.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : f("", !0)
      ], 42, Ia);
    };
  }
}, an = /* @__PURE__ */ Z(tn, [["__scopeId", "data-v-b112cec8"]]), nn = {
  class: "agent-limits",
  "data-agent-limits": ""
}, ln = ["aria-expanded"], sn = { key: 0 }, on = { key: 1 }, rn = { class: "limits-panel" }, dn = { class: "limits-head" }, un = ["data-agent-limit-type", "data-agent-limit-profile"], cn = { class: "count" }, gn = { class: "bar" }, pn = { class: "count" }, vn = { class: "bar" }, hn = ["data-agent-limit-type"], mn = { class: "limit-field" }, fn = { class: "limit-field" }, kn = {
  key: 1,
  role: "alert"
}, yn = {
  key: 2,
  role: "status"
}, bn = {
  __name: "AgentLimits",
  setup(e) {
    const r = ve(), { rows: s, failure: n } = r.props.limits, v = V(!1), w = V(!1), $ = V(!1), x = V(""), C = V(""), A = (h) => h === 0 ? "no limit" : String(h), _ = (h, b) => b === 0 ? 0 : h > b ? 2 : h === b ? 1 : 0, L = k(() => s.value.flatMap((h) => h.per_profile && h.profiles.length ? h.profiles.map((b) => ({ ...b, label: b.title, type: h.key, key: `${h.key}:${b.profile}` })) : [h])), T = (h) => Math.max(_(h.running, h.run_limit), _(h.kept, h.kept_limit)), q = k(() => L.value.filter((h) => T(h)).sort((h, b) => T(b) - T(h))), R = k(() => s.value.reduce((h, b) => h + b.running, 0)), H = k(() => s.value.reduce((h, b) => h + b.kept, 0)), B = (h) => {
      const b = [h.run_limit ? h.running - h.run_limit : -1, h.kept_limit ? h.kept - h.kept_limit : -1], l = Math.max(...b);
      return l > 0 ? `Over by ${l}` : l === 0 ? "At limit" : "Within limits";
    }, I = (h, b) => b ? `${Math.min(h / Math.max(h, b) * 100, 100)}%` : "0%", D = (h, b) => b && h > b ? `${(h - b) / h * 100}%` : "0%";
    function P() {
      w.value = !w.value;
    }
    async function U(h, b, l, d) {
      if ($.value || r.readOnly) return;
      const t = Number(d.target.value);
      if (!Number.isInteger(t) || t < 0 || !d.target.value.trim()) {
        x.value = "Use a whole number of 0 or more.", d.target.value = String(l);
        return;
      }
      $.value = !0, C.value = "";
      try {
        const o = await r.run(["setting", "set", b, String(t), "--environment", r.environment]);
        if (x.value = o.ok ? "" : o.error, !o.ok) {
          d.target.value = String(l);
          return;
        }
        await r.reload("limits"), C.value = `${h.label} limits saved.`;
      } finally {
        $.value = !1;
      }
    }
    return (h, b) => (a(), i("section", nn, [
      u(s).length ? (a(), i(E, { key: 0 }, [
        c("button", {
          class: "summary",
          type: "button",
          "aria-expanded": v.value,
          onClick: b[0] || (b[0] = (l) => v.value = !v.value)
        }, [
          q.value.length ? (a(), i(E, { key: 0 }, [
            (a(!0), i(E, null, J(q.value.slice(0, 2), (l) => (a(), i("span", {
              key: l.key,
              class: "summary-item"
            }, [
              c("span", {
                class: X(["mark", { over: T(l) === 2 }])
              }, null, 2),
              m(g(l.label) + ": " + g(B(l)), 1)
            ]))), 128)),
            q.value.length > 2 ? (a(), i("span", sn, g(q.value.length - 2) + " more", 1)) : f("", !0)
          ], 64)) : (a(), i("span", on, "All within limits, " + g(R.value) + " running, " + g(H.value) + " kept", 1)),
          y(u(be), {
            name: "caret",
            size: 12
          })
        ], 8, ln),
        Ke(c("div", rn, [
          c("div", dn, [
            b[1] || (b[1] = c("strong", null, "Agent limits", -1)),
            y(u(ae), {
              small: "",
              disabled: $.value || u(r).readOnly,
              "data-agent-limits-edit": "",
              onClick: P
            }, {
              default: S(() => [
                m(g(w.value ? "Done" : "Edit limits"), 1)
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          w.value ? (a(), i(E, { key: 1 }, [
            (a(!0), i(E, null, J(u(s), (l) => (a(), i("div", {
              key: l.key,
              class: "edit-row",
              "data-agent-limit-type": l.key
            }, [
              c("strong", null, g(l.label), 1),
              c("label", mn, [
                c("span", null, [
                  b[3] || (b[3] = m("Running", -1)),
                  l.per_profile ? (a(), i(E, { key: 0 }, [
                    m(" per profile")
                  ], 64)) : f("", !0)
                ]),
                y(u(Ce), {
                  type: "number",
                  min: "0",
                  value: String(l.run_limit),
                  disabled: $.value || u(r).readOnly,
                  "data-agent-run-limit": l.key,
                  onChange: (d) => U(l, l.run_setting, l.run_limit, d)
                }, null, 8, ["value", "disabled", "data-agent-run-limit", "onChange"]),
                c("small", null, g(l.run_source), 1)
              ]),
              c("label", fn, [
                c("span", null, [
                  b[4] || (b[4] = m("Kept", -1)),
                  l.per_profile ? (a(), i(E, { key: 0 }, [
                    m(" per profile")
                  ], 64)) : f("", !0)
                ]),
                y(u(Ce), {
                  type: "number",
                  min: "0",
                  value: String(l.kept_limit),
                  disabled: $.value || u(r).readOnly,
                  "data-agent-kept-limit": l.key,
                  onChange: (d) => U(l, l.kept_setting, l.kept_limit, d)
                }, null, 8, ["value", "disabled", "data-agent-kept-limit", "onChange"]),
                c("small", null, g(l.kept_source), 1)
              ])
            ], 8, hn))), 128)),
            c("p", null, "Running 0 starts no agents. Kept 0 means no limit. Changes apply to " + g(u(r).environment) + ".", 1)
          ], 64)) : (a(), i(E, { key: 0 }, [
            b[2] || (b[2] = c("div", { class: "table-head" }, [
              c("span", null, "Agent"),
              c("span", null, "Running"),
              c("span", null, "Kept"),
              c("span", null, "Status")
            ], -1)),
            (a(!0), i(E, null, J(L.value, (l) => (a(), i("div", {
              key: l.key,
              class: "limit-row",
              "data-agent-limit-type": l.type || l.key,
              "data-agent-limit-profile": l.profile
            }, [
              c("strong", null, g(l.label), 1),
              c("div", cn, [
                c("span", null, g(l.run_limit ? `${l.running} of ${l.run_limit}` : `${l.running} · none may start`), 1),
                c("div", gn, [
                  c("span", {
                    style: se({ width: I(l.running, l.run_limit) })
                  }, null, 4),
                  c("i", {
                    style: se({ width: D(l.running, l.run_limit) })
                  }, null, 4)
                ])
              ]),
              c("div", pn, [
                c("span", null, g(l.kept) + " of " + g(A(l.kept_limit)), 1),
                c("div", vn, [
                  c("span", {
                    style: se({ width: I(l.kept, l.kept_limit) })
                  }, null, 4),
                  c("i", {
                    style: se({ width: D(l.kept, l.kept_limit) })
                  }, null, 4)
                ])
              ]),
              c("span", {
                class: X(["status", { warning: T(l) === 1, danger: T(l) === 2 }])
              }, g(B(l)), 3)
            ], 8, un))), 128))
          ], 64))
        ], 512), [
          [Je, v.value]
        ])
      ], 64)) : f("", !0),
      x.value || u(n) ? (a(), i("p", kn, g(x.value || u(n)), 1)) : f("", !0),
      C.value ? (a(), i("p", yn, g(C.value), 1)) : f("", !0)
    ]));
  }
}, wn = /* @__PURE__ */ Z(bn, [["__scopeId", "data-v-6f5b1989"]]), Mn = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, xn = ["data-agent-row"], Ve = "journal.agents.filters", ye = "cubic-bezier(0.2, 0.9, 0.25, 1)", $n = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const r = e, s = ve(), { rows: n } = s.props.waits, { rows: v } = s.props.progress, { rows: w, failure: $, loaded: x, more: C } = s.props.agents, A = (N) => v.value.find((F) => F.agent_id === N.id) ?? null, _ = (N) => {
      var F;
      return ((F = n.value.find((j) => j.agent_id === N.id)) == null ? void 0 : F.reason) ?? "";
    }, L = V("running"), T = V(""), q = JSON.parse(localStorage.getItem(Ve) || '{"roles":[],"profiles":[],"programs":[]}'), R = V(q), H = k(() => s.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: B } = s.props.programs, I = k(() => R.value.roles.length + R.value.profiles.length + R.value.programs.length), D = (N, F) => {
      R.value = dt(R.value, N, F);
    }, P = () => {
      R.value = { roles: [], profiles: [], programs: [] };
    }, U = (N) => N.slice(0, 1).toUpperCase() + N.slice(1);
    te(R, (N) => localStorage.setItem(Ve, JSON.stringify(N)));
    const h = V(25);
    function b() {
      Object.assign(s.state, {
        "agents.show": L.value,
        "agents.search": T.value,
        "agents.limit": String(h.value),
        "agents.roles": R.value.roles.join(","),
        "agents.profiles": R.value.profiles.join(","),
        "agents.programs": R.value.programs.join(",")
      });
    }
    async function l() {
      return h.value += 25, b(), await s.reload("agents"), !0;
    }
    te([L, T, R], () => {
      h.value = 25, b(), s.reload("agents");
    }), b();
    const d = (N) => N.facts ?? null, t = w, o = k(() => !!T.value.trim() || I.value > 0), O = k(() => r.texts[L.value] ?? { title: r.empty, hint: "" }), p = V(null), M = V(null), z = V(null), Q = k(() => t.value.find((N) => N.id === p.value) ?? null), he = k(() => Q.value ? [Q.value] : t.value), oe = () => globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ne = !1, we = 0;
    async function Me(N) {
      if (ne) return;
      ne = !0, we = z.value.scrollTop;
      const F = M.value.querySelector(`[data-agent-open="${N.id}"]`);
      if (!oe()) {
        const le = [...M.value.querySelectorAll(".agent-row")].filter((ee) => !ee.contains(F));
        await Promise.all(le.map((ee) => ee.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const j = [...F.querySelectorAll(".agent-head, .agent-line")], K = [...j, ...F.querySelectorAll("[data-agent-motion]")], me = K.map((le) => le.getBoundingClientRect());
      if (p.value = N.id, await Re(), !oe()) {
        const le = K.map((ee) => ee.getBoundingClientRect());
        K.forEach((ee, fe) => {
          const ie = j.indexOf(ee.parentElement), _e = me[fe].left - le[fe].left - (ie < 0 ? 0 : me[ie].left - le[ie].left), Ne = me[fe].top - le[fe].top - (ie < 0 ? 0 : me[ie].top - le[ie].top);
          ee.animate([{ transform: `translate(${_e}px, ${Ne}px)` }, { transform: "none" }], { duration: 280, easing: ye });
        }), M.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((ee) => {
          ee.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: ye, fill: "backwards" });
        });
      }
      ne = !1;
    }
    async function je() {
      if (ne || !Q.value) return;
      ne = !0;
      const N = M.value.querySelector(`[data-agent-open="${p.value}"]`), F = [...N.children], j = oe() ? [] : F.map((K) => K.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(j.map((K) => K.finished)), p.value = null, await Re(), z.value.scrollTop = we, j.forEach((K) => K.cancel()), oe() || (N.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: ye }), M.value.querySelectorAll(".agent-row").forEach((K) => {
        K.contains(N) || K.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: ye });
      })), ne = !1;
    }
    const Ee = (N) => p.value === N.id ? je() : Me(N);
    te(T, (N) => N.trim() && (p.value = null)), te(L, () => {
      p.value = null;
    });
    const Ae = (N) => {
      N.key === "Escape" && je();
    };
    return globalThis.addEventListener("keydown", Ae), ce(() => globalThis.removeEventListener("keydown", Ae)), (N, F) => (a(), i("div", {
      ref_key: "agents",
      ref: M,
      class: X(["agents", { focused: Q.value }])
    }, [
      y(wn),
      y(u(ot), {
        modelValue: T.value,
        "onUpdate:modelValue": F[1] || (F[1] = (j) => T.value = j),
        placeholder: "Search agents",
        "menu-count": I.value,
        "data-agents-search": ""
      }, {
        menu: S(() => [
          y(u($e), null, {
            default: S(() => [...F[2] || (F[2] = [
              m("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), i(E, null, J(H.value.roles, (j) => (a(), W(u(ke), {
            key: j,
            role: "menuitemcheckbox",
            "aria-checked": R.value.roles.includes(j),
            checked: R.value.roles.includes(j),
            "data-filter-role": j,
            onClick: (K) => D("roles", j)
          }, {
            default: S(() => [
              m(g(U(j)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          H.value.profiles.length ? (a(), W(u($e), { key: 0 }, {
            default: S(() => [...F[3] || (F[3] = [
              m("Profile", -1)
            ])]),
            _: 1
          })) : f("", !0),
          (a(!0), i(E, null, J(H.value.profiles, (j) => (a(), W(u(ke), {
            key: j.name,
            role: "menuitemcheckbox",
            "aria-checked": R.value.profiles.includes(j.name),
            checked: R.value.profiles.includes(j.name),
            "data-filter-profile": j.name,
            onClick: (K) => D("profiles", j.name)
          }, {
            default: S(() => [
              m(g(j.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          y(u($e), null, {
            default: S(() => [...F[4] || (F[4] = [
              m("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), i(E, null, J(u(B), (j) => (a(), W(u(ke), {
            key: j.name,
            role: "menuitemcheckbox",
            "aria-checked": R.value.programs.includes(j.name),
            checked: R.value.programs.includes(j.name),
            "data-filter-program": j.name,
            onClick: (K) => D("programs", j.name)
          }, {
            default: S(() => [
              m(g(j.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          I.value ? (a(), W(u(ke), {
            key: 1,
            "data-filter-clear": "",
            onClick: P
          }, {
            default: S(() => [...F[5] || (F[5] = [
              m("Clear filters", -1)
            ])]),
            _: 1
          })) : f("", !0)
        ]),
        default: S(() => [
          y(u(it), {
            options: H.value.states,
            value: L.value,
            onPick: F[0] || (F[0] = (j) => L.value = j)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      L.value === "retired" && H.value.upgrade_retired ? (a(), i("p", Mn, "Retired during the upgrade: " + g(H.value.upgrade_retired), 1)) : f("", !0),
      c("div", {
        ref_key: "list",
        ref: z,
        class: X(["agents-view", { "agents-view-open": Q.value }])
      }, [
        u(x) && !u($) && !he.value.length && I.value ? (a(), W(u(Se), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: S(() => [
            y(u(ae), {
              small: "",
              "data-empty-clear": "",
              onClick: P
            }, {
              default: S(() => [...F[6] || (F[6] = [
                m("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), W(u(rt), {
          key: 1,
          rows: he.value,
          failure: u($),
          loaded: u(x),
          more: !Q.value && u(C),
          older: l,
          empty: O.value.title,
          hint: O.value.hint,
          searching: o.value
        }, {
          default: S(({ row: j }) => [
            c("div", {
              class: "agent-row",
              "data-agent-row": j.id
            }, [
              y(an, {
                row: j,
                facts: d(j),
                progress: A(j),
                "wait-reason": _(j),
                open: j.id === p.value,
                onToggle: (K) => Ee(j)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, xn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, An = /* @__PURE__ */ Z($n, [["__scopeId", "data-v-c93c8a31"]]);
export {
  An as A
};
