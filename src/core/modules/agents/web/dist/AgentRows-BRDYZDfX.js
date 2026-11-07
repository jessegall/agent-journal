/* @code-commandments-generated */
import { openBlock as t, createElementBlock as l, withModifiers as re, unref as r, createTextVNode as m, toDisplayString as v, createVNode as b, createBlock as F, withCtx as M, Fragment as L, renderList as ee, createElementVNode as p, createCommentVNode as g, computed as k, ref as B, watch as ce, onUnmounted as we, defineAsyncComponent as De, createSlots as Ue, resolveDynamicComponent as Ke, normalizeStyle as he, normalizeClass as ue, renderSlot as Me, onMounted as Je, Teleport as Ze, mergeProps as Ge, toRef as Te, withKeys as Oe, nextTick as Be } from "vue";
import { peekRef as $e, Icon as fe, RunningCommand as Ye, FoldGroup as Le, TaskStatusIcon as _e, useWindow as xe, loadWindowComponent as Qe, coalesced as Xe, READ_RATES as et, InnerTabs as tt, TabBody as at, SwitchCase as Ie, EmptyState as ze, Btn as ae, TextArea as nt, TextInput as lt, useNow as Ee, age as Ne, perHour as ot, TimeAgo as ye, Dialog as st, SearchBar as rt, Segmented as it, MenuLabel as Re, MenuItem as Ae, RowList as ut, toggleFilter as dt } from "@journal/window-kit";
import { _ as ne, T as ct } from "./TranscriptRows-DfA-cZXn.js";
const vt = {
  class: "agent-command",
  "data-agent-command": ""
}, pt = {
  key: 1,
  "data-agent-stopped": ""
}, gt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (c, o) => (t(), l("span", vt, [
      e.waitReason ? (t(), l("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: o[0] || (o[0] = re((a) => r($e)("test_queue:0"), ["stop"]))
      }, [
        m("Waiting: " + v(e.waitReason) + " ", 1),
        b(r(fe), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (t(), l("span", pt, "Waiting")) : (t(), F(r(Ye), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, mt = /* @__PURE__ */ ne(gt, [["__scopeId", "data-v-1b371fb5"]]), ht = ["data-agent-delegated", "onClick"], ft = { class: "agent-task-number" }, kt = { class: "agent-task-title" }, yt = ["title"], bt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: c }) {
    const o = c;
    return (a, f) => (t(), F(r(Le), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: f[0] || (f[0] = (x) => o("toggle"))
    }, {
      default: M(() => [
        (t(!0), l(L, null, ee(e.section.tasks, (x) => (t(), l("button", {
          key: x.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": x.id,
          onClick: (j) => r($e)(`tasks:${x.id}`)
        }, [
          b(r(_e), {
            status: x.state
          }, null, 8, ["status"]),
          p("span", ft, v(x.id), 1),
          p("span", kt, v(x.title), 1),
          x.plan_id ? (t(), l("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${x.plan_id}: ${x.plan_title}`
          }, "Plan " + v(x.plan_id) + ": " + v(x.plan_title), 9, yt)) : g("", !0)
        ], 8, ht))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, wt = /* @__PURE__ */ ne(bt, [["__scopeId", "data-v-238ff959"]]), Mt = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, $t = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, xt = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, Ct = ["data-peek", "onClick"], St = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, At = {
  key: 0,
  class: "agent-helper-brief"
}, jt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Tt = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Rt = "It ended without a report", zt = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const c = e, o = ["started", "blocked", "open", "completed"], a = k(() => {
      var u, S;
      return c.row.ended_at && ((S = (u = c.facts) == null ? void 0 : u.job_returned) != null && S.startsWith(Rt)) ? c.facts.job_returned : "";
    }), f = k(() => c.tasks.length ? o.map((u) => ({ state: u, label: u.slice(0, 1).toUpperCase() + u.slice(1), tasks: c.tasks.filter((S) => S.state === u || u === "started" && S.state === "testing" || u === "completed" && S.state === "cancelled") })) : []), x = /* @__PURE__ */ new Set(["completed"]), j = B({}), C = (u) => !(j.value[u] ?? x.has(u)), O = (u) => j.value = { ...j.value, [u]: C(u) }, N = xe(), { rows: D } = N.props.reports;
    N.state["reports.agent"] = String(c.row.id);
    const P = k(() => c.row.access === "read-only"), z = k(() => !!c.row.retired_at || c.row.state === "retired"), I = ["tasks", "transcript", "terminal", "file-feed", "reports"], A = k(() => (z.value ? N.tabs.filter((S) => ["reports", "transcript"].includes(S.key)) : P.value ? N.tabs.filter((S) => ["reports", "transcript", "terminal"].includes(S.key)) : [...N.tabs]).sort((S, J) => (I.indexOf(S.key) < 0 ? I.length : I.indexOf(S.key)) - (I.indexOf(J.key) < 0 ? I.length : I.indexOf(J.key)))), E = () => P.value || z.value ? A.value.find((u) => u.key === "transcript") : A.value[0], q = B(E());
    ce(q, (u) => {
      N.state.tab = (u == null ? void 0 : u.key) ?? "";
    }, { immediate: !0 }), we(() => {
      N.state.tab = "";
    }), ce(A, (u) => {
      u.some((S) => {
        var J;
        return S.key === ((J = q.value) == null ? void 0 : J.key);
      }) || (q.value = u[0]);
    }), ce(() => c.open, (u) => {
      u && (q.value = E());
    });
    const K = Object.fromEntries(N.tabs.filter((u) => u.component).map((u) => [u.key, De(() => Qe(u.component))])), U = B(!1), { data: Z } = N.props.tool, Y = k(() => {
      var u;
      return ((u = Z.value) == null ? void 0 : u.tool) ?? "";
    }), $ = k(() => {
      var u;
      return ((u = Z.value) == null ? void 0 : u.note) ?? "";
    }), i = k(() => c.row.role !== "main" && (!c.row.ended_at || c.stoppedWithWork || c.waitReason));
    async function G() {
      !c.open || !i.value || (N.state["tool.agent"] = String(c.row.id), await N.reload("tool"));
    }
    const w = N.follow(["hook_call.*", "process_part.*"], Xe(G, et.agentCommand));
    return we(() => w == null ? void 0 : w()), ce(() => c.open, (u) => {
      u && G();
    }, { immediate: !0 }), (u, S) => {
      var J;
      return t(), l("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: S[2] || (S[2] = re(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (t(), l("p", Mt, "Retirement reason: " + v(e.row.retirement_reason), 1)) : g("", !0),
        e.row.resume_reason ? (t(), l("p", $t, v(e.row.resume_reason), 1)) : g("", !0),
        i.value ? (t(), F(mt, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: Y.value,
          note: $.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : g("", !0),
        a.value ? (t(), l("p", xt, v(a.value), 1)) : g("", !0),
        b(r(tt), {
          class: "agent-tabs",
          tabs: A.value,
          active: q.value,
          answer: { tasks: e.tasks.length, reports: r(D).length },
          onChoose: S[0] || (S[0] = (n) => q.value = n)
        }, null, 8, ["tabs", "active", "answer"]),
        b(r(at), {
          class: "agent-tab-body",
          tab: q.value,
          "data-agent-tab-body": (J = q.value) == null ? void 0 : J.key
        }, {
          default: M(() => {
            var n;
            return [
              b(r(Ie), {
                value: (n = q.value) == null ? void 0 : n.key
              }, Ue({
                reports: M(() => [
                  r(D).length ? g("", !0) : (t(), F(r(ze), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: M(() => [...S[3] || (S[3] = [
                      m("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (t(!0), l(L, null, ee(r(D), (s) => (t(), l("button", {
                    key: s.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${s.id}`,
                    onClick: (R) => r($e)(`messages:${s.id}`)
                  }, v(s.text), 9, Ct))), 128))
                ]),
                tasks: M(() => {
                  var s;
                  return [
                    e.tasks.length ? g("", !0) : (t(), F(r(ze), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: M(() => [...S[4] || (S[4] = [
                        m("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (t(!0), l(L, null, ee(f.value, (R) => (t(), F(wt, {
                      key: R.state,
                      section: R,
                      open: C(R.state),
                      onToggle: (_) => O(R.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (s = e.facts) != null && s.instruction ? (t(), l(L, { key: 1 }, [
                      S[5] || (S[5] = p("p", { class: "agent-label" }, "Instruction", -1)),
                      p("div", St, v(e.facts.instruction), 1)
                    ], 64)) : g("", !0)
                  ];
                }),
                transcript: M(() => {
                  var s;
                  return [
                    P.value ? (t(), l(L, { key: 0 }, [
                      (s = e.facts) != null && s.instruction ? (t(), l("div", At, [
                        b(r(Le), {
                          label: "Instruction",
                          open: U.value,
                          "data-agent-section": "instruction",
                          onToggle: S[1] || (S[1] = (R) => U.value = !U.value)
                        }, {
                          default: M(() => [
                            p("div", jt, v(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (t(), l("p", Tt, "No job recorded")) : g("", !0)
                    ], 64)) : g("", !0),
                    b(ct, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                ee(r(K), (s, R) => ({
                  name: R,
                  fn: M(() => [
                    (t(), F(Ke(s), {
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
}, Ot = /* @__PURE__ */ ne(zt, [["__scopeId", "data-v-71b8d2b0"]]), Bt = { class: "action-field" }, Vt = ["value", "disabled"], Ht = ["value"], Lt = { key: 1 }, It = {
  key: 1,
  class: "action-field"
}, Et = { class: "action-buttons" }, Nt = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (c, o) => (t(), l("form", {
      onSubmit: o[4] || (o[4] = re((a) => c.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (t(), l(L, { key: 0 }, [
        p("label", Bt, [
          o[6] || (o[6] = m("Task ", -1)),
          p("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: o[0] || (o[0] = (a) => c.$emit("update:task", a.target.value))
          }, [
            o[5] || (o[5] = p("option", { value: "" }, "Choose an open task", -1)),
            (t(!0), l(L, null, ee(e.tasks, (a) => (t(), l("option", {
              key: a.id,
              value: String(a.id)
            }, v(a.id) + ": " + v(a.title), 9, Ht))), 128))
          ], 40, Vt)
        ]),
        e.moreTasks ? (t(), F(r(ae), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: o[1] || (o[1] = (a) => c.$emit("more"))
        }, {
          default: M(() => [...o[7] || (o[7] = [
            m("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : g("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (t(), l("p", Lt, "No open tasks.")) : g("", !0)
      ], 64)) : (t(), l("label", It, [
        o[8] || (o[8] = m("Job", -1)),
        b(r(nt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: o[2] || (o[2] = (a) => c.$emit("update:text", a.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      p("div", Et, [
        b(r(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: M(() => [...o[9] || (o[9] = [
            m("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        b(r(ae), {
          small: "",
          disabled: e.pending,
          onClick: o[3] || (o[3] = (a) => c.$emit("cancel"))
        }, {
          default: M(() => [...o[10] || (o[10] = [
            m("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, qt = /* @__PURE__ */ ne(Nt, [["__scopeId", "data-v-adde4158"]]), Wt = { class: "action-buttons" }, Ft = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (c, o) => (t(), l("form", {
      "data-agent-retire-confirm": "",
      onSubmit: o[2] || (o[2] = re((a) => c.$emit("submit"), ["prevent"]))
    }, [
      o[5] || (o[5] = p("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      b(r(lt), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": o[0] || (o[0] = (a) => c.$emit("update:reason", a))
      }, null, 8, ["model-value", "disabled"]),
      p("div", Wt, [
        b(r(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: M(() => [...o[3] || (o[3] = [
            m("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        b(r(ae), {
          small: "",
          disabled: e.pending,
          onClick: o[1] || (o[1] = (a) => c.$emit("cancel"))
        }, {
          default: M(() => [...o[4] || (o[4] = [
            m("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, qe = /* @__PURE__ */ ne(Ft, [["__scopeId", "data-v-23a905c0"]]), Pt = { class: "action-buttons" }, Dt = {
  key: 0,
  role: "alert"
}, Ut = {
  key: 1,
  role: "status"
}, Kt = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const c = e, o = xe(), a = B(""), f = B(""), x = B(""), j = B(""), C = B([]), O = B(0), N = B(!1), D = B(!1), P = B(!1), z = B(""), I = B(""), A = k(() => !!c.row.retired_at || c.row.state === "retired"), E = k(() => !A.value && !!c.row.ended_at), q = k(() => {
      var w;
      return E.value && ((w = c.row.job_command) == null ? void 0 : w.length) && !c.row.resume_reason;
    }), K = k(() => q.value && !D.value && (c.row.job_task_flag ? C.value.some((w) => String(w.id) === j.value) : !!f.value.trim()));
    function U(w) {
      a.value = w, f.value = "", x.value = "", j.value = "", z.value = "", I.value = "";
    }
    async function Z() {
      U("job"), c.row.job_task_flag && (C.value = [], O.value = 0, N.value = !1, await Y());
    }
    async function Y() {
      if (!D.value) {
        D.value = !0;
        try {
          o.state["jobs.page"] = String(O.value + 1), await o.reload("jobs");
          const w = o.props.jobs;
          z.value = w.failure.value, z.value || (C.value = [...C.value, ...w.rows.value], O.value = w.data.value.page, N.value = w.more.value);
        } finally {
          D.value = !1;
        }
      }
    }
    async function $(w, u) {
      if (!P.value) {
        P.value = !0, z.value = "";
        try {
          const S = await o.run(w);
          z.value = S.ok ? "" : S.error, S.ok && (U(""), I.value = u);
        } finally {
          P.value = !1;
        }
      }
    }
    async function i() {
      if (!K.value) return;
      const w = c.row.job_task_flag ? [c.row.job_task_flag, j.value] : [f.value.trim()];
      await $([...c.row.job_command, String(c.row.id), ...w], "Job sent.");
    }
    async function G() {
      !E.value || a.value !== "retire" || !x.value.trim() || await $(["agent", "retire", String(c.row.id), "--reason", x.value.trim()], "Agent retired permanently.");
    }
    return (w, u) => {
      var S;
      return A.value ? g("", !0) : (t(), l("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: u[6] || (u[6] = re(() => {
        }, ["stop"])),
        onKeydown: u[7] || (u[7] = re(() => {
        }, ["stop"]))
      }, [
        p("div", Pt, [
          E.value ? (t(), l(L, { key: 0 }, [
            (S = e.row.job_command) != null && S.length ? (t(), F(r(ae), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: P.value || D.value || !q.value,
              onClick: Z
            }, {
              default: M(() => [...u[8] || (u[8] = [
                m("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : g("", !0),
            e.row.role !== "main" ? (t(), F(r(ae), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: P.value || D.value,
              onClick: u[0] || (u[0] = (J) => U("retire"))
            }, {
              default: M(() => [...u[9] || (u[9] = [
                m("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : g("", !0)
          ], 64)) : g("", !0)
        ]),
        b(r(Ie), { value: a.value }, {
          job: M(() => [
            b(qt, {
              task: j.value,
              "onUpdate:task": u[1] || (u[1] = (J) => j.value = J),
              text: f.value,
              "onUpdate:text": u[2] || (u[2] = (J) => f.value = J),
              row: e.row,
              tasks: C.value,
              pending: P.value,
              loading: D.value,
              "more-tasks": N.value,
              failure: z.value,
              "job-ready": K.value,
              onSubmit: i,
              onMore: Y,
              onCancel: u[3] || (u[3] = (J) => U(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: M(() => [
            b(qe, {
              reason: x.value,
              "onUpdate:reason": u[4] || (u[4] = (J) => x.value = J),
              pending: P.value,
              onSubmit: G,
              onCancel: u[5] || (u[5] = (J) => U(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        z.value ? (t(), l("p", Dt, v(z.value), 1)) : g("", !0),
        I.value ? (t(), l("p", Ut, v(I.value), 1)) : g("", !0)
      ], 32));
    };
  }
}, Jt = /* @__PURE__ */ ne(Kt, [["__scopeId", "data-v-4cb32275"]]), Zt = {
  class: "agent-count",
  "data-agent-motion": ""
}, Gt = {
  key: 0,
  class: "agent-pace",
  "data-agent-pace": ""
}, Yt = {
  class: "agent-tasks",
  "data-agent-tasks": ""
}, _t = {
  __name: "AgentTaskCount",
  props: { count: { type: String, required: !0 }, rate: { type: String, required: !0 } },
  setup(e) {
    return (c, o) => (t(), l("span", Zt, [
      e.rate ? (t(), l("span", Gt, v(e.rate), 1)) : g("", !0),
      p("span", Yt, v(e.count), 1)
    ]));
  }
}, Ve = /* @__PURE__ */ ne(_t, [["__scopeId", "data-v-44694015"]]), Qt = ["data-icon", "stroke-width", "innerHTML"], le = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const c = e, o = { right: 0, down: 90, left: 180, up: 270 }, a = {
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
    }, f = {
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
    return (x, j) => (t(), l("svg", {
      class: "ico",
      "data-icon": e.name,
      style: he({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...c.facing === "right" ? {} : { transform: `rotate(${o[c.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: f[a[e.name] || e.name] || f.dot
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
    return (c, o) => (t(), l("button", {
      type: "button",
      class: ue(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (t(), l("span", Xt, v(e.checked ? "✓" : ""), 1)) : g("", !0),
      e.description ? (t(), l("span", ea, [
        p("span", null, [
          Me(c.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, v(e.description), 1)
      ])) : Me(c.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, me = /* @__PURE__ */ ne(ta, [["__scopeId", "data-v-fec99974"]]), aa = {}, na = { class: "menu-label" };
function la(e, c) {
  return t(), l("span", na, [
    Me(e.$slots, "default", {}, void 0, !0)
  ]);
}
const be = /* @__PURE__ */ ne(aa, [["render", la], ["__scopeId", "data-v-aa955b3e"]]), oa = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, sa = {
  key: 0,
  class: "skills-none"
}, ra = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: c }) {
    const o = e, a = c, f = k(() => o.skills.filter((j) => j.state === "loaded")), x = k(() => o.skills.filter((j) => j.state !== "loaded"));
    return (j, C) => (t(), l("div", oa, [
      b(be, null, {
        default: M(() => [...C[1] || (C[1] = [
          m("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      f.value.length ? g("", !0) : (t(), l("p", sa, "None yet. Compacting the conversation empties this list.")),
      (t(!0), l(L, null, ee(f.value, (O) => (t(), l("p", {
        key: O.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        b(le, {
          name: "book",
          size: 12
        }),
        m(v(O.skill), 1)
      ]))), 128)),
      x.value.length ? (t(), l(L, { key: 1 }, [
        b(be, null, {
          default: M(() => [...C[2] || (C[2] = [
            m("Still to read", -1)
          ])]),
          _: 1
        }),
        (t(!0), l(L, null, ee(x.value, (O) => (t(), l("p", {
          key: O.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          b(le, {
            name: "book",
            size: 12
          }),
          m(v(O.skill), 1)
        ]))), 128))
      ], 64)) : g("", !0),
      b(me, {
        "data-agent-skills-browse": "",
        onClick: C[0] || (C[0] = (O) => a("browse"))
      }, {
        default: M(() => [...C[3] || (C[3] = [
          m("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, ia = /* @__PURE__ */ ne(ra, [["__scopeId", "data-v-be514d47"]]), ua = (e, c, o) => Math.max(c, Math.min(o, e)), We = /* @__PURE__ */ new WeakMap(), da = (e, c) => We.set(e, c);
function ca(e, c) {
  for (let o = c; o; o = We.get(o) ?? o.parentElement) if (o === e) return !0;
  return !1;
}
function va(e, c) {
  const o = (a) => {
    var x, j;
    const f = ((x = e.value) == null ? void 0 : x.element) || ((j = e.value) == null ? void 0 : j.$el) || e.value;
    f && !ca(f, a.target) && c(a);
  };
  window.addEventListener("click", o), we(() => window.removeEventListener("click", o));
}
const ge = 8, pa = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: c, emit: o }) {
    const a = e, f = B(null), x = (n) => n ? `${n}px` : void 0, j = k(() => ({
      minWidth: x(a.minWidth),
      maxWidth: x(a.maxWidth),
      maxHeight: x(a.maxHeight),
      height: x(a.height)
    })), C = B({ w: 0, h: 0 }), O = B(a.anchor ? a.anchor.getBoundingClientRect() : null), N = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), D = (n) => ({
      left: Math.max(0, n.left),
      top: Math.max(0, n.top),
      right: Math.min(window.innerWidth, n.right),
      bottom: Math.min(window.innerHeight, n.bottom)
    }), P = (n) => {
      const s = n.closest(".pane, .float-window");
      return s ? D(s.getBoundingClientRect()) : N();
    }, z = (n, s) => `${Math.max(0, n ? Math.min(n, s) : s)}px`;
    function I(n, s) {
      return {
        below: n.bottom - s.bottom - a.gap - ge,
        above: s.top - n.top - a.gap - ge,
        across: n.right - n.left - 2 * ge
      };
    }
    function A(n) {
      const s = P(a.anchor), R = I(s, n);
      return C.value.w <= R.across && C.value.h <= Math.max(R.below, R.above) ? s : N();
    }
    const E = k(() => {
      if (!O.value) return j.value;
      const n = O.value, s = A(n), R = I(s, n), { w: _, h: Q } = C.value, oe = a.align === "auto" ? n.left + n.right > s.left + s.right : a.align === "right", X = ua(oe ? n.right - _ : n.left, s.left + ge, Math.max(s.left + ge, s.right - _ - ge)), d = Q > R.below && R.above > R.below ? { bottom: `${window.innerHeight - n.top + a.gap}px`, maxHeight: z(a.maxHeight, R.above) } : { top: `${n.bottom + a.gap}px`, maxHeight: z(a.maxHeight, R.below) };
      return { ...j.value, ...d, left: `${X}px`, maxWidth: z(a.maxWidth, R.across) };
    }), q = o, K = () => [...f.value.querySelectorAll("button:not(:disabled)")];
    function U(n) {
      const s = K(), R = s.indexOf(document.activeElement);
      s[(R + n + s.length) % s.length].focus();
    }
    const Z = { ArrowDown: () => U(1), ArrowUp: () => U(-1), Escape: () => q("close") }, Y = (n) => Z[n.key] && (n.preventDefault(), Z[n.key]()), $ = () => f.value && (C.value = { w: f.value.offsetWidth, h: f.value.scrollHeight });
    let i = 0;
    const G = new ResizeObserver(() => {
      cancelAnimationFrame(i), i = requestAnimationFrame($);
    });
    va(f, (n) => a.anchor && !a.anchor.contains(n.target) && q("close"));
    const w = (n, s) => ["top", "left", "right", "bottom"].some((R) => Math.abs(n[R] - s[R]) > 1), u = (n) => n.bottom < 0 || n.top > window.innerHeight;
    let S = 0;
    function J() {
      if (a.anchor) {
        const n = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || u(n)) return q("close");
        w(n, O.value) && (O.value = n);
      }
      S = requestAnimationFrame(J);
    }
    return Je(() => {
      a.anchor && f.value && da(f.value, a.anchor), $(), f.value && G.observe(f.value), !a.plain && K()[0] && K()[0].focus(), J();
    }), we(() => {
      G.disconnect(), cancelAnimationFrame(S), cancelAnimationFrame(i);
    }), c({ element: f }), (n, s) => (t(), F(Ze, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", Ge({
        ref_key: "panel",
        ref: f
      }, n.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: E.value,
        onKeydown: Y
      }), [
        Me(n.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ga = /* @__PURE__ */ ne(pa, [["__scopeId", "data-v-3d203970"]]);
async function ma(e, c, o) {
  if (!e) return o(c);
  const { target: a, fields: f } = e, x = Object.fromEntries(Object.keys(f).map((O) => [O, a[O]])), j = () => Object.assign(a, x);
  Object.assign(a, f);
  let C = !1;
  try {
    const O = await o(c);
    return C = O.ok, O;
  } finally {
    C || j();
  }
}
function ha(e, c, o, { groups: a, programs: f }) {
  const x = B({}), j = B(""), C = B(!1), O = k(() => !!e.value && !e.value.ended_at), N = k(() => O.value && !!e.value.paused_at);
  async function D(A, E = null) {
    j.value = "";
    const q = await ma(E, A, c);
    return j.value = q.ok ? "" : q.error, o(), q;
  }
  return { groups: a, programs: f, chosen: x, failure: j, asking: C, running: O, paused: N, choose: (A, E) => D(["agent", "control", String(e.value.id), A, E.value], { target: x, fields: { value: { ...x.value, [A]: E.label } } }), stop: () => (C.value = !1, D(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (A) => D(["agent", "launch", A.name]) };
}
function fa(e) {
  if (!e) return "Not compacted yet";
  const c = new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return e.start_percent === null ? `Last compacted ${c}` : e.end_percent === null ? `Last compacted ${c}, from ${e.start_percent}%` : `Last compacted ${c}, from ${e.start_percent}% to ${e.end_percent}%, ${e.start_percent - e.end_percent}% taken off`;
}
const ka = ["disabled", "title"], ya = ["title"], ba = { class: "gauge usage" }, wa = ["disabled", "title"], Ma = { class: "gauge" }, $a = ["disabled", "title"], xa = ["disabled"], Ca = ["disabled"], Sa = {
  key: 5,
  class: "fact",
  "data-fact": "uptime",
  title: "How long this session has run"
}, Aa = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, ja = ["title"], Ta = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Ra = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, za = { class: "gauge" }, Oa = { class: "context-used" }, Ba = 75, Va = {
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
    now: { type: Number, default: () => Date.now() },
    fitness: { type: Object, default: null },
    run: { type: Function, default: null }
  },
  emits: ["open", "changed", "skills"],
  setup(e, { emit: c }) {
    const o = e, a = c, f = ha(Te(o, "agent"), o.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: Te(o, "controlGroups"), programs: Te(o, "agentPrograms") }), x = B(null), j = B(""), C = k(() => f.groups.value.find(($) => $.key === j.value));
    function O($, i) {
      x.value = $.currentTarget, j.value = i;
    }
    function N() {
      x.value = null, j.value = "", f.asking.value = !1;
    }
    const D = k(() => o.skills.filter(($) => $.state === "loaded"));
    function P($) {
      O($, "skills"), a("skills");
    }
    const z = ($) => f.groups.value.some((i) => i.key === $), I = k(() => {
      var $;
      return f.chosen.value.model ?? (($ = E.value) == null ? void 0 : $.model) ?? "";
    }), A = k(() => {
      var $;
      return f.chosen.value.effort ?? (($ = E.value) == null ? void 0 : $.effort) ?? "";
    });
    k(() => !!o.agent && !o.agent.ended_at);
    const E = k(() => {
      var $;
      return (($ = o.usage.agents) == null ? void 0 : $.find((i) => {
        var G;
        return i.id === ((G = o.agent) == null ? void 0 : G.id);
      })) ?? null;
    }), q = k(() => {
      var $;
      return (($ = o.usage.windows) == null ? void 0 : $[0]) ?? null;
    }), K = k(() => q.value ? Math.max(0, Math.min(100, Math.round(q.value.used_percent))) : null), U = k(() => {
      var $;
      return (($ = E.value) == null ? void 0 : $.context_percent) == null ? null : Math.round(E.value.context_percent);
    }), Z = k(() => {
      var $;
      return ($ = E.value) != null && $.cost_dollars ? `$${E.value.cost_dollars.toFixed(2)}` : "";
    }), Y = k(() => {
      var G;
      const $ = (G = o.agent) != null && G.process_started_at ? new Date(o.agent.process_started_at).getTime() : 0;
      if (!$) return "";
      const i = Math.max(0, Math.floor((o.now - $) / 6e4));
      return i >= 60 ? `${Math.floor(i / 60)}h ${i % 60}m` : `${i}m`;
    });
    return ($, i) => {
      var G;
      return t(), l("div", {
        class: ue(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (t(), l(L, { key: 0 }, [
          p("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: i[0] || (i[0] = (w) => O(w, "agent"))
          }, [
            b(le, {
              name: "agents",
              size: 12
            }),
            m(" " + v(((G = e.agentPrograms.find((w) => w.name === e.agent.program)) == null ? void 0 : G.title) || e.agent.program), 1)
          ], 8, ka),
          K.value !== null ? (t(), l("button", {
            key: 0,
            type: "button",
            class: "fact",
            "data-fact": "usage",
            title: `${K.value}% of the plan's ${q.value.title} allowance used`,
            onClick: i[1] || (i[1] = (w) => a("open", "usage", w.currentTarget))
          }, [
            b(le, {
              name: "allowance",
              size: 12
            }),
            i[14] || (i[14] = m()),
            p("span", ba, [
              p("span", {
                style: he({ width: `${K.value}%` })
              }, null, 4)
            ]),
            m(" " + v(K.value) + "% ", 1)
          ], 8, ya)) : g("", !0),
          U.value !== null ? (t(), l("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${U.value}% full: clear or compact it`,
            onClick: i[2] || (i[2] = (w) => z("context") ? O(w, "context") : a("open", "context", w.currentTarget))
          }, [
            b(le, {
              name: "gauge",
              size: 12
            }),
            i[15] || (i[15] = m()),
            p("span", Ma, [
              p("span", {
                style: he({ width: `${U.value}%` })
              }, null, 4)
            ]),
            m(" " + v(U.value) + "% ", 1)
          ], 8, wa)) : g("", !0),
          I.value ? (t(), l("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${I.value}: change the model`,
            onClick: i[3] || (i[3] = (w) => z("model") ? O(w, "model") : null)
          }, [
            b(le, {
              name: "model",
              size: 12
            }),
            m(" " + v(I.value), 1)
          ], 8, $a)) : g("", !0),
          z("effort") || e.card && A.value ? (t(), l("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: i[4] || (i[4] = (w) => O(w, "effort"))
          }, [
            b(le, {
              name: "bolt",
              size: 12
            }),
            m(" " + v(A.value), 1)
          ], 8, xa)) : g("", !0),
          Z.value ? (t(), l("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: i[5] || (i[5] = (w) => a("open", "cost", w.currentTarget))
          }, v(Z.value), 9, Ca)) : g("", !0),
          Y.value ? (t(), l("span", Sa, [
            b(le, {
              name: "reminders",
              size: 12
            }),
            m(" " + v(Y.value), 1)
          ])) : g("", !0),
          e.branch ? (t(), l("span", Aa, [
            b(le, {
              name: "branch",
              size: 12
            }),
            m(" " + v(e.branch), 1)
          ])) : g("", !0),
          e.card ? g("", !0) : (t(), l("button", {
            key: 7,
            type: "button",
            class: ue(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: i[6] || (i[6] = (w) => a("open", "jobs", w.currentTarget))
          }, [
            b(le, {
              name: "clock",
              size: 12
            }),
            m(" " + v(e.jobs), 1)
          ], 2)),
          e.run ? (t(), l("button", {
            key: 8,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: P
          }, [
            b(le, {
              name: "book",
              size: 12
            }),
            m(" " + v(D.value.length), 1)
          ])) : g("", !0),
          e.fitness ? (t(), l(L, { key: 9 }, [
            p("button", {
              type: "button",
              class: ue(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Ba }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: i[7] || (i[7] = (w) => a("open", "fitness", w.currentTarget))
            }, [
              b(le, {
                name: "heart",
                size: 12
              }),
              m(" " + v(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            p("button", {
              type: "button",
              class: ue(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: i[8] || (i[8] = (w) => a("open", "load", w.currentTarget))
            }, [
              b(le, {
                name: "weight",
                size: 12
              }),
              m(" " + v(e.fitness.workload), 1)
            ], 2)
          ], 64)) : g("", !0)
        ], 64)) : e.run && !e.loading ? (t(), l("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: i[9] || (i[9] = (w) => O(w, "start"))
        }, [
          b(le, {
            name: "agents",
            size: 12
          }),
          i[16] || (i[16] = m(" Start an agent", -1))
        ])) : g("", !0),
        i[22] || (i[22] = p("span", { class: "space" }, null, -1)),
        r(f).failure.value ? (t(), l("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: r(f).failure.value
        }, v(r(f).failure.value), 9, ja)) : g("", !0),
        Me($.$slots, "default", {}, void 0, !0),
        x.value ? (t(), F(ga, {
          key: 3,
          anchor: x.value,
          "min-width": 190,
          onClose: N
        }, {
          default: M(() => {
            var w;
            return [
              j.value === "agent" ? (t(), l(L, { key: 0 }, [
                r(f).asking.value ? (t(), l(L, { key: 0 }, [
                  b(be, { "data-agent-stop-ask": "" }, {
                    default: M(() => [...i[17] || (i[17] = [
                      m("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  b(me, {
                    "data-agent-stop-confirm": "",
                    onClick: i[10] || (i[10] = (u) => (N(), r(f).stop()))
                  }, {
                    default: M(() => [...i[18] || (i[18] = [
                      m("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  b(me, {
                    onClick: i[11] || (i[11] = (u) => r(f).asking.value = !1)
                  }, {
                    default: M(() => [...i[19] || (i[19] = [
                      m("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (t(), F(me, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: i[12] || (i[12] = (u) => r(f).asking.value = !0)
                }, {
                  default: M(() => [...i[20] || (i[20] = [
                    m("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : j.value === "start" ? (t(), l(L, { key: 1 }, [
                b(be, null, {
                  default: M(() => [...i[21] || (i[21] = [
                    m("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (t(!0), l(L, null, ee(r(f).programs.value, (u) => (t(), F(me, {
                  key: u.name,
                  "data-agent-program": u.name,
                  onClick: (S) => (N(), r(f).start(u))
                }, {
                  default: M(() => [
                    m(v(u.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : j.value === "skills" ? (t(), F(ia, {
                key: 2,
                skills: e.skills,
                onBrowse: i[13] || (i[13] = (u) => (N(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : C.value ? (t(), l(L, { key: 3 }, [
                b(be, null, {
                  default: M(() => [
                    m(v(C.value.label), 1)
                  ]),
                  _: 1
                }),
                j.value === "context" ? (t(), l(L, { key: 0 }, [
                  p("p", Ta, v(r(fa)(((w = E.value) == null ? void 0 : w.last_compaction) ?? null)), 1),
                  p("div", Ra, [
                    p("span", za, [
                      p("span", {
                        style: he({ width: `${U.value}%` })
                      }, null, 4)
                    ]),
                    p("span", Oa, v(U.value) + "%", 1)
                  ])
                ], 64)) : g("", !0),
                (t(!0), l(L, null, ee(C.value.choices, (u) => (t(), F(me, {
                  key: u.value,
                  "data-agent-choice": u.value,
                  onClick: (S) => (r(f).choose(C.value.key, u), N())
                }, {
                  default: M(() => [
                    m(v(u.label), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-choice", "onClick"]))), 128))
              ], 64)) : g("", !0)
            ];
          }),
          _: 1
        }, 8, ["anchor"])) : g("", !0)
      ], 2);
    };
  }
}, Ha = /* @__PURE__ */ ne(Va, [["__scopeId", "data-v-8331d791"]]), La = ["data-agent-open", "aria-expanded", "role", "tabindex"], Ia = { class: "agent-head" }, Ea = ["data-state"], Na = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, qa = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Wa = { class: "agent-times" }, Fa = {
  key: 0,
  class: "agent-time",
  "data-agent-motion": ""
}, Pa = {
  key: 1,
  class: "agent-time",
  "data-agent-motion": ""
}, Da = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": ""
}, Ua = {
  key: 3,
  class: "agent-time",
  "data-agent-motion": ""
}, Ka = {
  key: 4,
  class: "agent-list-pace",
  "data-agent-list-pace": ""
}, Ja = { class: "agent-line" }, Za = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Ga = {
  key: 0,
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, Ya = {
  key: 1,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, _a = {
  key: 1,
  class: "agent-line"
}, Qa = {
  key: 2,
  class: "agent-line agent-work-start"
}, Xa = ["title"], en = ["data-peek"], tn = ["data-peek"], an = ["data-agent-waiting", "data-agent-stopped"], nn = {
  key: 3,
  class: "agent-line agent-work-status",
  "data-agent-blocked-tasks": ""
}, ln = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: c }) {
    const o = { helper: "Helper", reviewer: "Reviewer" }, a = e, f = c, x = Ee(), j = k(() => {
      var s, R;
      if ((s = a.facts) != null && s.profile_title) return a.facts.profile_title;
      if ((R = a.facts) != null && R.profile) return a.facts.profile;
      const n = o[a.row.role] || a.row.role;
      return n.slice(0, 1).toUpperCase() + n.slice(1);
    }), C = k(() => {
      var n;
      return ((n = a.facts) == null ? void 0 : n.tasks) ?? [];
    }), O = k(() => C.value.filter((n) => n.state === "open")), N = k(() => C.value.find((n) => {
      var s;
      return n.id === ((s = a.progress) == null ? void 0 : s.task_id) && n.state === "started";
    })), D = k(() => N.value || C.value.find((n) => {
      var s;
      return n.id === ((s = a.facts) == null ? void 0 : s.task_id);
    }) || O.value[0] || C.value.at(-1)), P = k(() => N.value ? C.value.filter((n) => n.state === "blocked") : []), z = k(() => {
      var n, s, R, _, Q, oe;
      return a.row.role === "helper" ? ((n = a.facts) == null ? void 0 : n.helper_job) || "" : (s = a.facts) != null && s.job_enabled && (((R = N.value) == null ? void 0 : R.title) || ((_ = a.facts) == null ? void 0 : _.task_title) || ((Q = O.value[0]) == null ? void 0 : Q.title) || ((oe = C.value.at(-1)) == null ? void 0 : oe.title)) || "";
    }), I = k(() => {
      const n = z.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return n ? `${n[1].toLowerCase() === "plan" ? "plans" : "docs"}:${n[2]}` : "";
    }), A = k(() => {
      var n;
      return (n = a.facts) != null && n.job_enabled ? `${a.row.role} ${a.row.id}` : "";
    }), E = k(() => {
      var n, s;
      return [a.row.program, (n = a.facts) == null ? void 0 : n.model, (s = a.facts) == null ? void 0 : s.effort, A.value].filter(Boolean).join(" · ");
    }), q = xe(), K = k(() => Ne(a.row.process_started_at || a.row.created_at, x.value)), U = /* @__PURE__ */ new Set(["open", "started", "testing"]), Z = k(() => {
      var n;
      return (n = a.facts) == null ? void 0 : n.work_status;
    }), Y = k(() => !!a.row.ended_at && a.row.role !== "main" && C.value.some((n) => U.has(n.state))), $ = k(() => {
      var n;
      return a.row.retired_at || a.row.state === "retired" ? "retired" : Z.value || a.waitReason || Y.value ? "waiting" : a.row.state === "running" && ((n = a.facts) == null ? void 0 : n.state) || a.row.state;
    }), i = k(() => {
      var n;
      return Z.value ? `Status: ${Z.value}` : a.waitReason ? `Waiting: ${a.waitReason}` : $.value === "blocked" ? (n = a.facts) != null && n.blocked_reason ? `Blocked: ${a.facts.blocked_reason}` : "Blocked" : Y.value ? "Stopped with work left" : "";
    }), G = k(() => {
      var n;
      return ((n = a.progress) == null ? void 0 : n.completed_count) ?? C.value.filter((s) => s.state === "completed").length;
    }), w = k(() => {
      var n;
      return ((n = a.progress) == null ? void 0 : n.task_count) ?? C.value.length;
    }), u = k(() => `${G.value} of ${w.value} ${w.value === 1 ? "task" : "tasks"}`), S = k(() => {
      var s;
      const n = ot(G.value, ((s = a.progress) == null ? void 0 : s.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, x.value);
      return a.row.role !== "main" && n ? `${n} per hour` : "";
    }), J = k(() => !!a.row.retired_at || a.row.state === "retired");
    return (n, s) => {
      var R, _, Q, oe;
      return t(), l("div", {
        class: ue(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: s[4] || (s[4] = (X) => !e.open && f("toggle")),
        onKeydown: [
          s[5] || (s[5] = Oe(re((X) => !e.open && f("toggle"), ["self", "prevent"]), ["enter"])),
          s[6] || (s[6] = Oe(re((X) => !e.open && f("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        p("span", Ia, [
          e.open ? (t(), l("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: s[0] || (s[0] = re((X) => f("toggle"), ["stop"]))
          }, [
            b(r(fe), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : g("", !0),
          p("span", {
            class: "agent-dot",
            "data-state": $.value,
            "data-agent-motion": ""
          }, null, 8, Ea),
          p("span", Na, v(j.value), 1),
          p("span", qa, v(((R = e.facts) == null ? void 0 : R.given_name) || e.row.id), 1),
          e.open ? g("", !0) : (t(), F(r(fe), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          p("span", Wa, [
            J.value ? (t(), l("span", Fa, [
              s[7] || (s[7] = m("Retired, ", -1)),
              b(r(ye), {
                at: e.row.retired_at
              }, null, 8, ["at"])
            ])) : e.row.ended_at && Z.value ? (t(), l("span", Pa, [
              s[8] || (s[8] = m("Process ended: ", -1)),
              b(r(ye), {
                at: e.row.ended_at
              }, null, 8, ["at"])
            ])) : e.row.ended_at ? (t(), l("span", Da, [
              s[9] || (s[9] = m("Idle, ", -1)),
              b(r(ye), {
                at: e.row.ended_at
              }, null, 8, ["at"])
            ])) : (t(), l("span", Ua, v(K.value), 1)),
            !e.open && e.row.role === "worker" && S.value ? (t(), l("span", Ka, v(S.value), 1)) : g("", !0)
          ])
        ]),
        p("span", Ja, [
          p("span", Za, v(E.value), 1),
          e.open ? (t(), l("span", Ga, [
            b(r(fe), {
              name: "time",
              size: 12
            }),
            s[10] || (s[10] = m("First started: ", -1)),
            b(r(ye), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : g("", !0),
          e.open && ((_ = e.facts) != null && _.last_activity) ? (t(), l("span", Ya, [
            s[11] || (s[11] = m("Last heard: ", -1)),
            b(r(ye), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : g("", !0)
        ]),
        e.open ? (t(), F(Ha, {
          key: 0,
          "agent-programs": r(q).props.programs.rows.value,
          agent: e.row,
          branch: (Q = e.progress) == null ? void 0 : Q.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: [] },
          card: ""
        }, {
          default: M(() => [
            b(Jt, { row: e.row }, null, 8, ["row"]),
            e.row.role === "helper" && !e.row.ended_at ? (t(), F(r(ae), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: s[1] || (s[1] = re((X) => r(q).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: M(() => [...s[12] || (s[12] = [
                m("Stop", -1)
              ])]),
              _: 1
            })) : g("", !0)
          ]),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : g("", !0),
        e.open && w.value && !z.value ? (t(), l("span", _a, [
          b(Ve, {
            count: u.value,
            rate: S.value
          }, null, 8, ["count", "rate"])
        ])) : g("", !0),
        z.value || !e.open && i.value || Z.value ? (t(), l("span", Qa, [
          p("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: z.value
          }, [
            e.open && I.value ? (t(), l("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": I.value,
              onClick: s[2] || (s[2] = re((X) => r($e)(I.value), ["stop"]))
            }, v(z.value), 9, en)) : (t(), l(L, { key: 1 }, [
              m(v(z.value), 1)
            ], 64)),
            z.value && e.row.role !== "helper" && ((oe = D.value) != null && oe.plan_id) ? (t(), l("button", {
              key: 2,
              type: "button",
              class: "agent-plan",
              "data-agent-plan": "",
              "data-peek": `plans:${D.value.plan_id}`,
              onClick: s[3] || (s[3] = re((X) => r($e)(`plans:${D.value.plan_id}`), ["stop"]))
            }, "plan " + v(D.value.plan_id), 9, tn)) : g("", !0)
          ], 8, Xa),
          i.value && (!e.open || Z.value) ? (t(), l("span", {
            key: 0,
            class: "agent-work-status",
            "data-agent-work-status": "",
            "data-agent-waiting": e.waitReason ? "" : null,
            "data-agent-stopped": Y.value && !e.waitReason && !Z.value ? "" : null
          }, v(i.value), 9, an)) : g("", !0),
          e.open && w.value ? (t(), F(Ve, {
            key: 1,
            count: u.value,
            rate: S.value
          }, null, 8, ["count", "rate"])) : g("", !0)
        ])) : g("", !0),
        P.value.length ? (t(), l("span", nn, "Blocked: " + v(P.value.map((X) => `task ${X.id}`).join(", ")), 1)) : g("", !0),
        e.open ? (t(), F(Ot, {
          key: 4,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: C.value,
          "stopped-with-work": Y.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : g("", !0)
      ], 42, La);
    };
  }
}, on = /* @__PURE__ */ ne(ln, [["__scopeId", "data-v-a9bf1a67"]]), sn = {
  key: 0,
  class: "badge",
  "data-agent-count-badge": ""
}, rn = { class: "counts" }, un = ["data-edit-type"], dn = { key: 0 }, cn = { class: "stepper" }, vn = ["disabled", "onClick"], pn = ["value", "disabled", "data-agent-limit-input", "onChange"], gn = ["disabled", "onClick"], mn = { key: 0 }, hn = { key: 1 }, fn = ["data-count-agent"], kn = { class: "person-text" }, yn = {
  key: 0,
  class: "helper-head"
}, bn = ["data-agent-limit-type", "data-agent-limit-profile", "onClick"], wn = {
  key: 0,
  class: "bar"
}, Mn = {
  key: 5,
  role: "alert"
}, $n = {
  key: 6,
  role: "status"
}, xn = { class: "foot-note" }, Cn = {
  __name: "AgentLimits",
  emits: ["open-agent"],
  setup(e, { emit: c }) {
    const o = c, a = xe(), { rows: f, failure: x } = a.props.limits, j = B([]), C = B(0), O = B(!1), N = Ee(), D = B(!1), P = B(null), z = B(!1), I = B(!1), A = B(""), E = B(""), q = B(null), K = B(""), U = k(() => f.value.flatMap((y) => y.per_profile ? y.profiles.filter((d) => d.kept).map((d) => ({ ...d, label: d.title, type: y.key, key: `${y.key}:${d.profile}` })) : [{ ...y, type: y.key }])), Z = (y, d) => d > 0 && y >= d, Y = k(() => U.value.filter((y) => Z(y.running, y.run_limit) || Z(y.kept, y.kept_limit)).length), $ = k(() => f.value.find((y) => y.per_profile)), i = k(() => U.value.find((y) => y.key === P.value)), G = k(() => j.value.filter((y) => {
      var d, h;
      return y.state !== "retired" && y.role === ((d = i.value) == null ? void 0 : d.type) && (!i.value.profile || (((h = y.facts) == null ? void 0 : h.profile) || y.profile) === i.value.profile);
    }).sort((y, d) => (y.state !== "running") - (d.state !== "running") || String(y.ended_at || y.created_at).localeCompare(String(d.ended_at || d.created_at)))), w = k(() => {
      var d;
      const y = /* @__PURE__ */ new Map();
      for (const h of G.value) {
        const T = ((d = h.facts) == null ? void 0 : d.model) || h.program_model;
        T && y.set(T, (y.get(T) || 0) + 1);
      }
      return [...y].map(([h, T]) => `${T} ${h}`).join(", ");
    }), u = (y, d) => d ? `${Math.min(y / Math.max(y, d) * 100, 100)}%` : "0%", S = (y, d) => d && y > d ? `${(y - d) / y * 100}%` : "0%", J = k(() => {
      var y;
      return z.value ? "Change the maximums" : ((y = i.value) == null ? void 0 : y.label) || "Agent counts";
    });
    async function n(y, d = 1) {
      a.state["count-agents.role"] = y.type, a.state["count-agents.profile"] = y.profile || "", a.state["count-agents.page"] = String(d), await a.reload("count-agents");
      const h = a.props["count-agents"];
      j.value = d === 1 ? [...h.rows.value] : [...j.value, ...h.rows.value], C.value = d, O.value = h.more.value;
    }
    function s(y) {
      P.value = y.key, j.value = [], n(y);
    }
    function R() {
      z.value = !1, P.value = null, q.value = null, A.value = "";
    }
    function _() {
      D.value = !1, R();
    }
    async function Q(y, d, h, T) {
      if (I.value || a.readOnly) return;
      const se = Number(T);
      if (!String(T).trim() || !Number.isInteger(se) || se < 0) {
        A.value = "Use a whole number of 0 or more.";
        return;
      }
      I.value = !0, A.value = "";
      const ve = await a.run(["setting", "set", d, String(se), "--environment", a.environment]);
      ve.ok ? (await a.reload("limits"), E.value = "Saved.") : A.value = ve.error, I.value = !1;
    }
    async function oe(y) {
      if (!K.value.trim() || I.value) return;
      I.value = !0;
      const d = await a.run(["agent", "retire", String(y.id), "--reason", K.value.trim()]);
      A.value = d.ok ? "" : "The agent could not be retired. Try again.", d.ok && (q.value = null, K.value = "", E.value = "Agent retired permanently.", await a.reload("limits"), await n(i.value)), I.value = !1;
    }
    function X(y) {
      _(), o("open-agent", y);
    }
    return (y, d) => (t(), l(L, null, [
      p("button", {
        class: "counts-button",
        type: "button",
        title: "Agent counts",
        "aria-label": "Agent counts",
        "data-agent-counts": "",
        onClick: d[0] || (d[0] = (h) => D.value = !0)
      }, [
        b(r(fe), {
          name: "settings",
          size: 16
        }),
        Y.value ? (t(), l("span", sn, v(Y.value), 1)) : g("", !0)
      ]),
      D.value ? (t(), F(r(st), {
        key: 0,
        title: J.value,
        modal: "",
        fits: "",
        onClose: _,
        onEscape: _
      }, {
        foot: M(() => [
          z.value ? (t(), l(L, { key: 0 }, [
            p("span", xn, v(E.value || `Changes apply to ${r(a).environment}.`), 1),
            b(r(ae), { onClick: R }, {
              default: M(() => [...d[20] || (d[20] = [
                m("Done", -1)
              ])]),
              _: 1
            })
          ], 64)) : i.value ? g("", !0) : (t(), F(r(ae), {
            key: 1,
            disabled: r(a).readOnly,
            "data-agent-limits-edit": "",
            onClick: d[5] || (d[5] = (h) => z.value = !0)
          }, {
            default: M(() => [...d[21] || (d[21] = [
              m("Change the maximums", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]))
        ]),
        default: M(() => [
          p("div", rn, [
            z.value || i.value ? (t(), l("button", {
              key: 0,
              class: "back",
              type: "button",
              onClick: R
            }, "‹ Back to the counts")) : g("", !0),
            r(x) ? (t(), l(L, { key: 1 }, [
              d[7] || (d[7] = p("strong", null, "The counts could not be read", -1)),
              d[8] || (d[8] = p("p", null, "The journal did not answer.", -1)),
              b(r(ae), {
                small: "",
                onClick: d[1] || (d[1] = (h) => r(a).reload("limits"))
              }, {
                default: M(() => [...d[6] || (d[6] = [
                  m("Try again", -1)
                ])]),
                _: 1
              })
            ], 64)) : z.value ? (t(), l(L, { key: 2 }, [
              d[9] || (d[9] = p("p", null, "How many agents of a type may run at once, and how many may be kept.", -1)),
              (t(!0), l(L, null, ee(r(f), (h) => (t(), l("div", {
                key: h.key,
                class: "edit-row",
                "data-edit-type": h.key
              }, [
                p("div", null, [
                  p("strong", null, v(h.per_profile ? "Each helper type" : "Workers"), 1),
                  h.per_profile ? (t(), l("small", dn, "Researcher, Planner and the others")) : g("", !0)
                ]),
                (t(!0), l(L, null, ee([{ name: "Most running", value: h.run_limit, key: h.run_setting, source: h.run_source, kind: "run" }, { name: "Most kept", value: h.kept_limit, key: h.kept_setting, source: h.kept_source, kind: "kept" }], (T) => (t(), l("label", {
                  key: T.key
                }, [
                  m(v(T.name), 1),
                  p("span", cn, [
                    p("button", {
                      type: "button",
                      disabled: I.value || r(a).readOnly || T.value === 0,
                      onClick: (se) => Q(h, T.key, T.value, T.value - 1)
                    }, "−", 8, vn),
                    p("input", {
                      type: "number",
                      min: "0",
                      value: T.value,
                      disabled: I.value || r(a).readOnly,
                      "data-agent-limit-input": T.kind,
                      onChange: (se) => Q(h, T.key, T.value, se.target.value)
                    }, null, 40, pn),
                    p("button", {
                      type: "button",
                      disabled: I.value || r(a).readOnly,
                      onClick: (se) => Q(h, T.key, T.value, T.value + 1)
                    }, "+", 8, gn)
                  ]),
                  T.value === 0 ? (t(), l("small", mn, v(T.kind === "run" ? "None can start" : "Any number"), 1)) : T.source === `environment ${r(a).environment}` ? (t(), l("small", hn, "Changed for " + v(r(a).environment), 1)) : g("", !0)
                ]))), 128))
              ], 8, un))), 128))
            ], 64)) : i.value ? (t(), l(L, { key: 3 }, [
              p("p", null, [
                p("strong", null, v(i.value.running) + " of " + v(i.value.run_limit), 1),
                d[10] || (d[10] = m(" running, ", -1)),
                p("strong", null, [
                  m(v(i.value.kept), 1),
                  i.value.kept_limit ? (t(), l(L, { key: 0 }, [
                    m(" of " + v(i.value.kept_limit), 1)
                  ], 64)) : g("", !0)
                ]),
                d[11] || (d[11] = m(" kept", -1))
              ]),
              p("p", null, v(w.value), 1),
              G.value.length ? g("", !0) : (t(), l(L, { key: 0 }, [
                d[12] || (d[12] = p("strong", null, "No agents here yet", -1)),
                d[13] || (d[13] = p("p", null, "An agent shows here as soon as one of this type starts.", -1))
              ], 64)),
              (t(!0), l(L, null, ee(G.value, (h) => {
                var T, se, ve, ke, H;
                return t(), l("div", {
                  key: h.id,
                  class: "person",
                  "data-count-agent": h.id
                }, [
                  p("span", {
                    class: ue(["dot", { running: h.state === "running" }])
                  }, null, 2),
                  p("div", kn, [
                    p("strong", null, v(((T = h.facts) == null ? void 0 : T.given_name) || h.id), 1),
                    m(" " + v(h.state === "running" ? "Running" : "Idle") + ", " + v(r(Ne)(h.state === "running" ? h.process_started_at || h.created_at : h.ended_at, r(N))), 1),
                    p("small", null, v([h.program, (se = h.facts) == null ? void 0 : se.model, (ve = h.facts) == null ? void 0 : ve.effort, `${h.role} ${h.id}`].filter(Boolean).join(", ")), 1),
                    p("small", null, v(((ke = h.facts) == null ? void 0 : ke.task_title) || ((H = h.facts) == null ? void 0 : H.helper_job)), 1)
                  ]),
                  b(r(ae), {
                    small: "",
                    onClick: (W) => X(h)
                  }, {
                    default: M(() => [...d[14] || (d[14] = [
                      m("Open", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"]),
                  h.state === "idle" && !r(a).readOnly ? (t(), F(r(ae), {
                    key: 0,
                    small: "",
                    onClick: (W) => {
                      q.value = h.id, K.value = "";
                    }
                  }, {
                    default: M(() => [...d[15] || (d[15] = [
                      m("Retire", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"])) : g("", !0),
                  q.value === h.id ? (t(), F(qe, {
                    key: 1,
                    reason: K.value,
                    "onUpdate:reason": d[2] || (d[2] = (W) => K.value = W),
                    pending: I.value,
                    onSubmit: (W) => oe(h),
                    onCancel: d[3] || (d[3] = (W) => q.value = null)
                  }, null, 8, ["reason", "pending", "onSubmit"])) : g("", !0)
                ], 8, fn);
              }), 128)),
              O.value ? (t(), F(r(ae), {
                key: 1,
                small: "",
                onClick: d[4] || (d[4] = (h) => n(i.value, C.value + 1))
              }, {
                default: M(() => [...d[16] || (d[16] = [
                  m("Show more", -1)
                ])]),
                _: 1
              })) : g("", !0)
            ], 64)) : (t(), l(L, { key: 4 }, [
              d[18] || (d[18] = p("p", null, "Kept agents have not been retired, so they can take another job. Open a row to see them.", -1)),
              d[19] || (d[19] = p("div", { class: "columns" }, [
                p("span", null, "Name"),
                p("span", null, "Running"),
                p("span", null, "Kept"),
                p("span")
              ], -1)),
              $.value ? (t(), l("div", yn, [
                d[17] || (d[17] = p("strong", null, "Helpers", -1)),
                p("span", null, v($.value.running) + " running, " + v($.value.kept) + " kept", 1)
              ])) : g("", !0),
              (t(!0), l(L, null, ee(U.value, (h) => (t(), l("button", {
                key: h.key,
                type: "button",
                class: "count-row",
                "data-agent-limit-type": h.type || h.key,
                "data-agent-limit-profile": h.profile,
                onClick: (T) => s(h)
              }, [
                p("strong", null, v(h.label), 1),
                (t(!0), l(L, null, ee([{ count: h.running, limit: h.run_limit, unlimited: !1 }, { count: h.kept, limit: h.kept_limit, unlimited: !0 }], (T) => (t(), l("span", {
                  key: T.unlimited,
                  class: ue({ full: Z(T.count, T.limit) })
                }, [
                  p("span", null, [
                    m(v(T.count), 1),
                    T.limit || !T.unlimited ? (t(), l(L, { key: 0 }, [
                      m(" of " + v(T.limit), 1)
                    ], 64)) : g("", !0)
                  ]),
                  T.limit ? (t(), l("span", wn, [
                    p("span", {
                      style: he({ width: u(T.count, T.limit) })
                    }, null, 4),
                    p("i", {
                      style: he({ width: S(T.count, T.limit) })
                    }, null, 4)
                  ])) : g("", !0)
                ], 2))), 128)),
                b(r(fe), {
                  name: "chevronRight",
                  size: 12
                })
              ], 8, bn))), 128))
            ], 64)),
            A.value ? (t(), l("p", Mn, v(A.value), 1)) : E.value ? (t(), l("p", $n, v(E.value), 1)) : g("", !0)
          ])
        ]),
        _: 1
      }, 8, ["title"])) : g("", !0)
    ], 64));
  }
}, Sn = /* @__PURE__ */ ne(Cn, [["__scopeId", "data-v-7c2adb6b"]]), An = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, jn = ["data-agent-row"], He = "journal.agents.filters", je = "cubic-bezier(0.2, 0.9, 0.25, 1)", Tn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const c = e, o = xe(), { rows: a } = o.props.waits, { rows: f } = o.props.progress, { rows: x, failure: j, loaded: C, more: O } = o.props.agents, N = (H) => f.value.find((W) => W.agent_id === H.id) ?? null, D = (H) => {
      var W;
      return ((W = a.value.find((V) => V.agent_id === H.id)) == null ? void 0 : W.reason) ?? "";
    }, P = B("running"), z = B(""), I = JSON.parse(localStorage.getItem(He) || '{"roles":[],"profiles":[],"programs":[]}'), A = B(I), E = k(() => o.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: q } = o.props.programs, K = k(() => A.value.roles.length + A.value.profiles.length + A.value.programs.length), U = (H, W) => {
      A.value = dt(A.value, H, W);
    }, Z = () => {
      A.value = { roles: [], profiles: [], programs: [] };
    }, Y = (H) => H.slice(0, 1).toUpperCase() + H.slice(1);
    ce(A, (H) => localStorage.setItem(He, JSON.stringify(H)));
    const $ = B(25);
    function i() {
      Object.assign(o.state, {
        "agents.show": P.value,
        "agents.search": z.value,
        "agents.limit": String($.value),
        "agents.roles": A.value.roles.join(","),
        "agents.profiles": A.value.profiles.join(","),
        "agents.programs": A.value.programs.join(",")
      });
    }
    async function G() {
      return $.value += 25, i(), await o.reload("agents"), !0;
    }
    ce([P, z, A], () => {
      $.value = 25, i(), o.reload("agents");
    }), i();
    const w = (H) => H.facts ?? null, u = x, S = k(() => !!z.value.trim() || K.value > 0), J = k(() => c.texts[P.value] ?? { title: c.empty, hint: "" }), n = B(null), s = B(null), R = B(null), _ = B(null), Q = k(() => n.value === null ? null : o.props[`card.${n.value}`].rows.value.find((H) => H.id === n.value) ?? s.value), oe = k(() => Q.value ? [Q.value] : u.value), X = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let y = !1, d = 0;
    async function h(H) {
      if (y) return;
      y = !0, d = _.value.scrollTop;
      const W = R.value.querySelector(`[data-agent-open="${H.id}"]`);
      if (!X()) {
        const de = [...R.value.querySelectorAll(".agent-row")].filter((ie) => !ie.contains(W));
        await Promise.all(de.map((ie) => ie.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const V = [...W.querySelectorAll(".agent-head, .agent-line")], te = [...V, ...W.querySelectorAll("[data-agent-motion]")], Ce = te.map((de) => de.getBoundingClientRect());
      if (s.value = H, n.value = H.id, o.reload(`card.${H.id}`), await Be(), !X()) {
        const de = te.map((ie) => ie.getBoundingClientRect());
        te.forEach((ie, Se) => {
          const pe = V.indexOf(ie.parentElement), Fe = Ce[Se].left - de[Se].left - (pe < 0 ? 0 : Ce[pe].left - de[pe].left), Pe = Ce[Se].top - de[Se].top - (pe < 0 ? 0 : Ce[pe].top - de[pe].top);
          ie.animate([{ transform: `translate(${Fe}px, ${Pe}px)` }, { transform: "none" }], { duration: 280, easing: je });
        }), R.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((ie) => {
          ie.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: je, fill: "backwards" });
        });
      }
      y = !1;
    }
    async function T() {
      if (y || !Q.value) return;
      y = !0;
      const H = R.value.querySelector(`[data-agent-open="${n.value}"]`), W = [...H.children], V = X() ? [] : W.map((te) => te.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(V.map((te) => te.finished)), n.value = null, await Be(), _.value.scrollTop = d, V.forEach((te) => te.cancel()), X() || (H.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: je }), R.value.querySelectorAll(".agent-row").forEach((te) => {
        te.contains(H) || te.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: je });
      })), y = !1;
    }
    function se(H) {
      s.value = H, n.value = H.id, o.reload(`card.${H.id}`);
    }
    const ve = (H) => n.value === H.id ? T() : h(H);
    ce(z, (H) => H.trim() && (n.value = null)), ce(P, () => {
      n.value = null;
    });
    const ke = (H) => {
      H.key === "Escape" && T();
    };
    return window.addEventListener("keydown", ke), we(() => window.removeEventListener("keydown", ke)), (H, W) => (t(), l("div", {
      ref_key: "agents",
      ref: R,
      class: ue(["agents", { focused: Q.value }])
    }, [
      b(r(rt), {
        modelValue: z.value,
        "onUpdate:modelValue": W[1] || (W[1] = (V) => z.value = V),
        placeholder: "Search agents",
        "menu-count": K.value,
        "data-agents-search": ""
      }, {
        menu: M(() => [
          b(r(Re), null, {
            default: M(() => [...W[2] || (W[2] = [
              m("Type", -1)
            ])]),
            _: 1
          }),
          (t(!0), l(L, null, ee(E.value.roles, (V) => (t(), F(r(Ae), {
            key: V,
            role: "menuitemcheckbox",
            "aria-checked": A.value.roles.includes(V),
            checked: A.value.roles.includes(V),
            "data-filter-role": V,
            onClick: (te) => U("roles", V)
          }, {
            default: M(() => [
              m(v(Y(V)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          E.value.profiles.length ? (t(), F(r(Re), { key: 0 }, {
            default: M(() => [...W[3] || (W[3] = [
              m("Profile", -1)
            ])]),
            _: 1
          })) : g("", !0),
          (t(!0), l(L, null, ee(E.value.profiles, (V) => (t(), F(r(Ae), {
            key: V.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.profiles.includes(V.name),
            checked: A.value.profiles.includes(V.name),
            "data-filter-profile": V.name,
            onClick: (te) => U("profiles", V.name)
          }, {
            default: M(() => [
              m(v(V.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          b(r(Re), null, {
            default: M(() => [...W[4] || (W[4] = [
              m("Program", -1)
            ])]),
            _: 1
          }),
          (t(!0), l(L, null, ee(r(q), (V) => (t(), F(r(Ae), {
            key: V.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.programs.includes(V.name),
            checked: A.value.programs.includes(V.name),
            "data-filter-program": V.name,
            onClick: (te) => U("programs", V.name)
          }, {
            default: M(() => [
              m(v(V.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          K.value ? (t(), F(r(Ae), {
            key: 1,
            "data-filter-clear": "",
            onClick: Z
          }, {
            default: M(() => [...W[5] || (W[5] = [
              m("Clear filters", -1)
            ])]),
            _: 1
          })) : g("", !0)
        ]),
        default: M(() => [
          b(r(it), {
            options: E.value.states,
            value: P.value,
            onPick: W[0] || (W[0] = (V) => P.value = V)
          }, null, 8, ["options", "value"]),
          b(Sn, { onOpenAgent: se })
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      P.value === "retired" && E.value.upgrade_retired ? (t(), l("p", An, "Retired during the upgrade: " + v(E.value.upgrade_retired), 1)) : g("", !0),
      p("div", {
        ref_key: "list",
        ref: _,
        class: ue(["agents-view", { "agents-view-open": Q.value }])
      }, [
        r(C) && !r(j) && !oe.value.length && K.value ? (t(), F(r(ze), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: M(() => [
            b(r(ae), {
              small: "",
              "data-empty-clear": "",
              onClick: Z
            }, {
              default: M(() => [...W[6] || (W[6] = [
                m("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (t(), F(r(ut), {
          key: 1,
          rows: oe.value,
          failure: r(j),
          loaded: r(C),
          more: !Q.value && r(O),
          older: G,
          empty: J.value.title,
          hint: J.value.hint,
          searching: S.value
        }, {
          default: M(({ row: V }) => [
            p("div", {
              class: "agent-row",
              "data-agent-row": V.id
            }, [
              b(on, {
                row: V,
                facts: w(V),
                progress: N(V),
                "wait-reason": D(V),
                open: V.id === n.value,
                onToggle: (te) => ve(V)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, jn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, Bn = /* @__PURE__ */ ne(Tn, [["__scopeId", "data-v-06777d49"]]);
export {
  Bn as A
};
