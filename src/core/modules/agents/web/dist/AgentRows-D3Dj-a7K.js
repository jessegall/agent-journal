/* @code-commandments-generated */
import { openBlock as t, createElementBlock as l, withModifiers as ne, unref as r, createTextVNode as h, toDisplayString as p, createVNode as b, createBlock as F, withCtx as C, Fragment as H, renderList as Q, createElementVNode as v, createCommentVNode as m, computed as k, ref as L, watch as ie, onUnmounted as ke, defineAsyncComponent as De, createSlots as Ue, resolveDynamicComponent as Ke, normalizeStyle as ve, normalizeClass as se, renderSlot as ye, onMounted as Je, Teleport as Ze, mergeProps as Ge, toRef as Ae, withKeys as ze, nextTick as Oe } from "vue";
import { peekRef as be, Icon as ge, RunningCommand as _e, FoldGroup as He, TaskStatusIcon as Ye, useWindow as we, loadWindowComponent as Qe, coalesced as Xe, READ_RATES as et, InnerTabs as tt, TabBody as at, SwitchCase as Le, EmptyState as Te, Btn as ae, TextArea as nt, TextInput as lt, useNow as Ie, age as Ee, perHour as ot, TimeAgo as he, Dialog as st, SearchBar as rt, Segmented as it, MenuLabel as je, MenuItem as Ce, RowList as ut, toggleFilter as dt } from "@journal/window-kit";
import { _ as ee, T as ct } from "./TranscriptRows-DfA-cZXn.js";
const pt = {
  class: "agent-command",
  "data-agent-command": ""
}, vt = {
  key: 1,
  "data-agent-stopped": ""
}, gt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (d, o) => (t(), l("span", pt, [
      e.waitReason ? (t(), l("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: o[0] || (o[0] = ne((a) => r(be)("test_queue:0"), ["stop"]))
      }, [
        h("Waiting: " + p(e.waitReason) + " ", 1),
        b(r(ge), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (t(), l("span", vt, "Waiting")) : (t(), F(r(_e), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, mt = /* @__PURE__ */ ee(gt, [["__scopeId", "data-v-1b371fb5"]]), ht = ["data-agent-delegated", "onClick"], ft = { class: "agent-task-number" }, kt = { class: "agent-task-title" }, yt = ["title"], bt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: d }) {
    const o = d;
    return (a, f) => (t(), F(r(He), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: f[0] || (f[0] = (S) => o("toggle"))
    }, {
      default: C(() => [
        (t(!0), l(H, null, Q(e.section.tasks, (S) => (t(), l("button", {
          key: S.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": S.id,
          onClick: (T) => r(be)(`tasks:${S.id}`)
        }, [
          b(r(Ye), {
            status: S.state
          }, null, 8, ["status"]),
          v("span", ft, p(S.id), 1),
          v("span", kt, p(S.title), 1),
          S.plan_id ? (t(), l("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${S.plan_id}: ${S.plan_title}`
          }, "Plan " + p(S.plan_id) + ": " + p(S.plan_title), 9, yt)) : m("", !0)
        ], 8, ht))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, wt = /* @__PURE__ */ ee(bt, [["__scopeId", "data-v-238ff959"]]), Mt = {
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
    const d = e, o = ["started", "blocked", "open", "completed"], a = k(() => {
      var i, x;
      return d.row.ended_at && ((x = (i = d.facts) == null ? void 0 : i.job_returned) != null && x.startsWith(Rt)) ? d.facts.job_returned : "";
    }), f = k(() => d.tasks.length ? o.map((i) => ({ state: i, label: i.slice(0, 1).toUpperCase() + i.slice(1), tasks: d.tasks.filter((x) => x.state === i || i === "started" && x.state === "testing" || i === "completed" && x.state === "cancelled") })) : []), S = /* @__PURE__ */ new Set(["completed"]), T = L({}), A = (i) => !(T.value[i] ?? S.has(i)), z = (i) => T.value = { ...T.value, [i]: A(i) }, I = we(), { rows: q } = I.props.reports;
    I.state["reports.agent"] = String(d.row.id);
    const V = k(() => d.row.access === "read-only"), R = k(() => !!d.row.retired_at || d.row.state === "retired"), P = ["tasks", "transcript", "terminal", "file-feed", "reports"], j = k(() => (R.value ? I.tabs.filter((x) => ["reports", "transcript"].includes(x.key)) : V.value ? I.tabs.filter((x) => ["reports", "transcript", "terminal"].includes(x.key)) : [...I.tabs]).sort((x, U) => (P.indexOf(x.key) < 0 ? P.length : P.indexOf(x.key)) - (P.indexOf(U.key) < 0 ? P.length : P.indexOf(U.key)))), E = () => V.value || R.value ? j.value.find((i) => i.key === "transcript") : j.value[0], W = L(E());
    ie(W, (i) => {
      I.state.tab = (i == null ? void 0 : i.key) ?? "";
    }, { immediate: !0 }), ke(() => {
      I.state.tab = "";
    }), ie(j, (i) => {
      i.some((x) => {
        var U;
        return x.key === ((U = W.value) == null ? void 0 : U.key);
      }) || (W.value = i[0]);
    }), ie(() => d.open, (i) => {
      i && (W.value = E());
    });
    const G = Object.fromEntries(I.tabs.filter((i) => i.component).map((i) => [i.key, De(() => Qe(i.component))])), K = L(!1), { data: Z } = I.props.tool, D = k(() => {
      var i;
      return ((i = Z.value) == null ? void 0 : i.tool) ?? "";
    }), $ = k(() => {
      var i;
      return ((i = Z.value) == null ? void 0 : i.note) ?? "";
    }), c = k(() => d.row.role !== "main" && (!d.row.ended_at || d.stoppedWithWork || d.waitReason));
    async function _() {
      !d.open || !c.value || (I.state["tool.agent"] = String(d.row.id), await I.reload("tool"));
    }
    const M = I.follow(["hook_call.*", "process_part.*"], Xe(_, et.agentCommand));
    return ke(() => M == null ? void 0 : M()), ie(() => d.open, (i) => {
      i && _();
    }, { immediate: !0 }), (i, x) => {
      var U;
      return t(), l("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: x[2] || (x[2] = ne(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (t(), l("p", Mt, "Retirement reason: " + p(e.row.retirement_reason), 1)) : m("", !0),
        e.row.resume_reason ? (t(), l("p", $t, p(e.row.resume_reason), 1)) : m("", !0),
        c.value ? (t(), F(mt, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: D.value,
          note: $.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0),
        a.value ? (t(), l("p", xt, p(a.value), 1)) : m("", !0),
        b(r(tt), {
          class: "agent-tabs",
          tabs: j.value,
          active: W.value,
          answer: { tasks: e.tasks.length, reports: r(q).length },
          onChoose: x[0] || (x[0] = (n) => W.value = n)
        }, null, 8, ["tabs", "active", "answer"]),
        b(r(at), {
          class: "agent-tab-body",
          tab: W.value,
          "data-agent-tab-body": (U = W.value) == null ? void 0 : U.key
        }, {
          default: C(() => {
            var n;
            return [
              b(r(Le), {
                value: (n = W.value) == null ? void 0 : n.key
              }, Ue({
                reports: C(() => [
                  r(q).length ? m("", !0) : (t(), F(r(Te), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: C(() => [...x[3] || (x[3] = [
                      h("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (t(!0), l(H, null, Q(r(q), (s) => (t(), l("button", {
                    key: s.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${s.id}`,
                    onClick: (O) => r(be)(`messages:${s.id}`)
                  }, p(s.text), 9, Ct))), 128))
                ]),
                tasks: C(() => {
                  var s;
                  return [
                    e.tasks.length ? m("", !0) : (t(), F(r(Te), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: C(() => [...x[4] || (x[4] = [
                        h("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (t(!0), l(H, null, Q(f.value, (O) => (t(), F(wt, {
                      key: O.state,
                      section: O,
                      open: A(O.state),
                      onToggle: (y) => z(O.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (s = e.facts) != null && s.instruction ? (t(), l(H, { key: 1 }, [
                      x[5] || (x[5] = v("p", { class: "agent-label" }, "Instruction", -1)),
                      v("div", St, p(e.facts.instruction), 1)
                    ], 64)) : m("", !0)
                  ];
                }),
                transcript: C(() => {
                  var s;
                  return [
                    V.value ? (t(), l(H, { key: 0 }, [
                      (s = e.facts) != null && s.instruction ? (t(), l("div", At, [
                        b(r(He), {
                          label: "Instruction",
                          open: K.value,
                          "data-agent-section": "instruction",
                          onToggle: x[1] || (x[1] = (O) => K.value = !K.value)
                        }, {
                          default: C(() => [
                            v("div", jt, p(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (t(), l("p", Tt, "No job recorded")) : m("", !0)
                    ], 64)) : m("", !0),
                    b(ct, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                Q(r(G), (s, O) => ({
                  name: O,
                  fn: C(() => [
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
}, Ot = /* @__PURE__ */ ee(zt, [["__scopeId", "data-v-71b8d2b0"]]), Bt = { class: "action-field" }, Vt = ["value", "disabled"], Ht = ["value"], Lt = { key: 1 }, It = {
  key: 1,
  class: "action-field"
}, Et = { class: "action-buttons" }, Nt = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (d, o) => (t(), l("form", {
      onSubmit: o[4] || (o[4] = ne((a) => d.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (t(), l(H, { key: 0 }, [
        v("label", Bt, [
          o[6] || (o[6] = h("Task ", -1)),
          v("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: o[0] || (o[0] = (a) => d.$emit("update:task", a.target.value))
          }, [
            o[5] || (o[5] = v("option", { value: "" }, "Choose an open task", -1)),
            (t(!0), l(H, null, Q(e.tasks, (a) => (t(), l("option", {
              key: a.id,
              value: String(a.id)
            }, p(a.id) + ": " + p(a.title), 9, Ht))), 128))
          ], 40, Vt)
        ]),
        e.moreTasks ? (t(), F(r(ae), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: o[1] || (o[1] = (a) => d.$emit("more"))
        }, {
          default: C(() => [...o[7] || (o[7] = [
            h("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : m("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (t(), l("p", Lt, "No open tasks.")) : m("", !0)
      ], 64)) : (t(), l("label", It, [
        o[8] || (o[8] = h("Job", -1)),
        b(r(nt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: o[2] || (o[2] = (a) => d.$emit("update:text", a.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      v("div", Et, [
        b(r(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: C(() => [...o[9] || (o[9] = [
            h("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        b(r(ae), {
          small: "",
          disabled: e.pending,
          onClick: o[3] || (o[3] = (a) => d.$emit("cancel"))
        }, {
          default: C(() => [...o[10] || (o[10] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, qt = /* @__PURE__ */ ee(Nt, [["__scopeId", "data-v-adde4158"]]), Wt = { class: "action-buttons" }, Ft = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (d, o) => (t(), l("form", {
      "data-agent-retire-confirm": "",
      onSubmit: o[2] || (o[2] = ne((a) => d.$emit("submit"), ["prevent"]))
    }, [
      o[5] || (o[5] = v("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      b(r(lt), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": o[0] || (o[0] = (a) => d.$emit("update:reason", a))
      }, null, 8, ["model-value", "disabled"]),
      v("div", Wt, [
        b(r(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: C(() => [...o[3] || (o[3] = [
            h("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        b(r(ae), {
          small: "",
          disabled: e.pending,
          onClick: o[1] || (o[1] = (a) => d.$emit("cancel"))
        }, {
          default: C(() => [...o[4] || (o[4] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Ne = /* @__PURE__ */ ee(Ft, [["__scopeId", "data-v-23a905c0"]]), Pt = { class: "action-buttons" }, Dt = {
  key: 0,
  role: "alert"
}, Ut = {
  key: 1,
  role: "status"
}, Kt = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const d = e, o = we(), a = L(""), f = L(""), S = L(""), T = L(""), A = L([]), z = L(0), I = L(!1), q = L(!1), V = L(!1), R = L(""), P = L(""), j = k(() => !!d.row.retired_at || d.row.state === "retired"), E = k(() => !j.value && !!d.row.ended_at), W = k(() => {
      var M;
      return E.value && ((M = d.row.job_command) == null ? void 0 : M.length) && !d.row.resume_reason;
    }), G = k(() => W.value && !q.value && (d.row.job_task_flag ? A.value.some((M) => String(M.id) === T.value) : !!f.value.trim()));
    function K(M) {
      a.value = M, f.value = "", S.value = "", T.value = "", R.value = "", P.value = "";
    }
    async function Z() {
      K("job"), d.row.job_task_flag && (A.value = [], z.value = 0, I.value = !1, await D());
    }
    async function D() {
      if (!q.value) {
        q.value = !0;
        try {
          o.state["jobs.page"] = String(z.value + 1), await o.reload("jobs");
          const M = o.props.jobs;
          R.value = M.failure.value, R.value || (A.value = [...A.value, ...M.rows.value], z.value = M.data.value.page, I.value = M.more.value);
        } finally {
          q.value = !1;
        }
      }
    }
    async function $(M, i) {
      if (!V.value) {
        V.value = !0, R.value = "";
        try {
          const x = await o.run(M);
          R.value = x.ok ? "" : x.error, x.ok && (K(""), P.value = i);
        } finally {
          V.value = !1;
        }
      }
    }
    async function c() {
      if (!G.value) return;
      const M = d.row.job_task_flag ? [d.row.job_task_flag, T.value] : [f.value.trim()];
      await $([...d.row.job_command, String(d.row.id), ...M], "Job sent.");
    }
    async function _() {
      !E.value || a.value !== "retire" || !S.value.trim() || await $(["agent", "retire", String(d.row.id), "--reason", S.value.trim()], "Agent retired permanently.");
    }
    return (M, i) => {
      var x;
      return j.value ? m("", !0) : (t(), l("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: i[6] || (i[6] = ne(() => {
        }, ["stop"])),
        onKeydown: i[7] || (i[7] = ne(() => {
        }, ["stop"]))
      }, [
        v("div", Pt, [
          E.value ? (t(), l(H, { key: 0 }, [
            (x = e.row.job_command) != null && x.length ? (t(), F(r(ae), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: V.value || q.value || !W.value,
              onClick: Z
            }, {
              default: C(() => [...i[8] || (i[8] = [
                h("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0),
            e.row.role !== "main" ? (t(), F(r(ae), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: V.value || q.value,
              onClick: i[0] || (i[0] = (U) => K("retire"))
            }, {
              default: C(() => [...i[9] || (i[9] = [
                h("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0)
          ], 64)) : m("", !0)
        ]),
        b(r(Le), { value: a.value }, {
          job: C(() => [
            b(qt, {
              task: T.value,
              "onUpdate:task": i[1] || (i[1] = (U) => T.value = U),
              text: f.value,
              "onUpdate:text": i[2] || (i[2] = (U) => f.value = U),
              row: e.row,
              tasks: A.value,
              pending: V.value,
              loading: q.value,
              "more-tasks": I.value,
              failure: R.value,
              "job-ready": G.value,
              onSubmit: c,
              onMore: D,
              onCancel: i[3] || (i[3] = (U) => K(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: C(() => [
            b(Ne, {
              reason: S.value,
              "onUpdate:reason": i[4] || (i[4] = (U) => S.value = U),
              pending: V.value,
              onSubmit: _,
              onCancel: i[5] || (i[5] = (U) => K(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        R.value ? (t(), l("p", Dt, p(R.value), 1)) : m("", !0),
        P.value ? (t(), l("p", Ut, p(P.value), 1)) : m("", !0)
      ], 32));
    };
  }
}, Jt = /* @__PURE__ */ ee(Kt, [["__scopeId", "data-v-4cb32275"]]), Zt = {
  class: "agent-count",
  "data-agent-motion": ""
}, Gt = {
  key: 0,
  class: "agent-pace",
  "data-agent-pace": ""
}, _t = {
  class: "agent-tasks",
  "data-agent-tasks": ""
}, Yt = {
  __name: "AgentTaskCount",
  props: { count: { type: String, required: !0 }, rate: { type: String, required: !0 } },
  setup(e) {
    return (d, o) => (t(), l("span", Zt, [
      e.rate ? (t(), l("span", Gt, p(e.rate), 1)) : m("", !0),
      v("span", _t, p(e.count), 1)
    ]));
  }
}, Be = /* @__PURE__ */ ee(Yt, [["__scopeId", "data-v-44694015"]]), Qt = ["data-icon", "stroke-width", "innerHTML"], te = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const d = e, o = { right: 0, down: 90, left: 180, up: 270 }, a = {
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
    return (S, T) => (t(), l("svg", {
      class: "ico",
      "data-icon": e.name,
      style: ve({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...d.facing === "right" ? {} : { transform: `rotate(${o[d.facing]}deg)` }
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
    return (d, o) => (t(), l("button", {
      type: "button",
      class: se(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (t(), l("span", Xt, p(e.checked ? "✓" : ""), 1)) : m("", !0),
      e.description ? (t(), l("span", ea, [
        v("span", null, [
          ye(d.$slots, "default", {}, void 0, !0)
        ]),
        v("small", null, p(e.description), 1)
      ])) : ye(d.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, pe = /* @__PURE__ */ ee(ta, [["__scopeId", "data-v-fec99974"]]), aa = {}, na = { class: "menu-label" };
function la(e, d) {
  return t(), l("span", na, [
    ye(e.$slots, "default", {}, void 0, !0)
  ]);
}
const fe = /* @__PURE__ */ ee(aa, [["render", la], ["__scopeId", "data-v-aa955b3e"]]), oa = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, sa = {
  key: 0,
  class: "skills-none"
}, ra = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: d }) {
    const o = e, a = d, f = k(() => o.skills.filter((T) => T.state === "loaded")), S = k(() => o.skills.filter((T) => T.state !== "loaded"));
    return (T, A) => (t(), l("div", oa, [
      b(fe, null, {
        default: C(() => [...A[1] || (A[1] = [
          h("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      f.value.length ? m("", !0) : (t(), l("p", sa, "None yet. Compacting the conversation empties this list.")),
      (t(!0), l(H, null, Q(f.value, (z) => (t(), l("p", {
        key: z.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        b(te, {
          name: "book",
          size: 12
        }),
        h(p(z.skill), 1)
      ]))), 128)),
      S.value.length ? (t(), l(H, { key: 1 }, [
        b(fe, null, {
          default: C(() => [...A[2] || (A[2] = [
            h("Still to read", -1)
          ])]),
          _: 1
        }),
        (t(!0), l(H, null, Q(S.value, (z) => (t(), l("p", {
          key: z.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          b(te, {
            name: "book",
            size: 12
          }),
          h(p(z.skill), 1)
        ]))), 128))
      ], 64)) : m("", !0),
      b(pe, {
        "data-agent-skills-browse": "",
        onClick: A[0] || (A[0] = (z) => a("browse"))
      }, {
        default: C(() => [...A[3] || (A[3] = [
          h("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, ia = /* @__PURE__ */ ee(ra, [["__scopeId", "data-v-be514d47"]]), ua = (e, d, o) => Math.max(d, Math.min(o, e)), qe = /* @__PURE__ */ new WeakMap(), da = (e, d) => qe.set(e, d);
function ca(e, d) {
  for (let o = d; o; o = qe.get(o) ?? o.parentElement) if (o === e) return !0;
  return !1;
}
function pa(e, d) {
  const o = (a) => {
    var S, T;
    const f = ((S = e.value) == null ? void 0 : S.element) || ((T = e.value) == null ? void 0 : T.$el) || e.value;
    f && !ca(f, a.target) && d(a);
  };
  window.addEventListener("click", o), ke(() => window.removeEventListener("click", o));
}
const ce = 8, va = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: d, emit: o }) {
    const a = e, f = L(null), S = (n) => n ? `${n}px` : void 0, T = k(() => ({
      minWidth: S(a.minWidth),
      maxWidth: S(a.maxWidth),
      maxHeight: S(a.maxHeight),
      height: S(a.height)
    })), A = L({ w: 0, h: 0 }), z = L(a.anchor ? a.anchor.getBoundingClientRect() : null), I = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), q = (n) => ({
      left: Math.max(0, n.left),
      top: Math.max(0, n.top),
      right: Math.min(window.innerWidth, n.right),
      bottom: Math.min(window.innerHeight, n.bottom)
    }), V = (n) => {
      const s = n.closest(".pane, .float-window");
      return s ? q(s.getBoundingClientRect()) : I();
    }, R = (n, s) => `${Math.max(0, n ? Math.min(n, s) : s)}px`;
    function P(n, s) {
      return {
        below: n.bottom - s.bottom - a.gap - ce,
        above: s.top - n.top - a.gap - ce,
        across: n.right - n.left - 2 * ce
      };
    }
    function j(n) {
      const s = V(a.anchor), O = P(s, n);
      return A.value.w <= O.across && A.value.h <= Math.max(O.below, O.above) ? s : I();
    }
    const E = k(() => {
      if (!z.value) return T.value;
      const n = z.value, s = j(n), O = P(s, n), { w: y, h: u } = A.value, g = a.align === "auto" ? n.left + n.right > s.left + s.right : a.align === "right", w = ua(g ? n.right - y : n.left, s.left + ce, Math.max(s.left + ce, s.right - y - ce)), le = u > O.below && O.above > O.below ? { bottom: `${window.innerHeight - n.top + a.gap}px`, maxHeight: R(a.maxHeight, O.above) } : { top: `${n.bottom + a.gap}px`, maxHeight: R(a.maxHeight, O.below) };
      return { ...T.value, ...le, left: `${w}px`, maxWidth: R(a.maxWidth, O.across) };
    }), W = o, G = () => [...f.value.querySelectorAll("button:not(:disabled)")];
    function K(n) {
      const s = G(), O = s.indexOf(document.activeElement);
      s[(O + n + s.length) % s.length].focus();
    }
    const Z = { ArrowDown: () => K(1), ArrowUp: () => K(-1), Escape: () => W("close") }, D = (n) => Z[n.key] && (n.preventDefault(), Z[n.key]()), $ = () => f.value && (A.value = { w: f.value.offsetWidth, h: f.value.scrollHeight });
    let c = 0;
    const _ = new ResizeObserver(() => {
      cancelAnimationFrame(c), c = requestAnimationFrame($);
    });
    pa(f, (n) => a.anchor && !a.anchor.contains(n.target) && W("close"));
    const M = (n, s) => ["top", "left", "right", "bottom"].some((O) => Math.abs(n[O] - s[O]) > 1), i = (n) => n.bottom < 0 || n.top > window.innerHeight;
    let x = 0;
    function U() {
      if (a.anchor) {
        const n = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || i(n)) return W("close");
        M(n, z.value) && (z.value = n);
      }
      x = requestAnimationFrame(U);
    }
    return Je(() => {
      a.anchor && f.value && da(f.value, a.anchor), $(), f.value && _.observe(f.value), !a.plain && G()[0] && G()[0].focus(), U();
    }), ke(() => {
      _.disconnect(), cancelAnimationFrame(x), cancelAnimationFrame(c);
    }), d({ element: f }), (n, s) => (t(), F(Ze, {
      to: "body",
      disabled: !e.anchor
    }, [
      v("div", Ge({
        ref_key: "panel",
        ref: f
      }, n.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: E.value,
        onKeydown: D
      }), [
        ye(n.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ga = /* @__PURE__ */ ee(va, [["__scopeId", "data-v-3d203970"]]);
async function ma(e, d, o) {
  if (!e) return o(d);
  const { target: a, fields: f } = e, S = Object.fromEntries(Object.keys(f).map((z) => [z, a[z]])), T = () => Object.assign(a, S);
  Object.assign(a, f);
  let A = !1;
  try {
    const z = await o(d);
    return A = z.ok, z;
  } finally {
    A || T();
  }
}
function ha(e, d, o, { groups: a, programs: f }) {
  const S = L({}), T = L(""), A = L(!1), z = k(() => !!e.value && !e.value.ended_at), I = k(() => z.value && !!e.value.paused_at);
  async function q(j, E = null) {
    T.value = "";
    const W = await ma(E, j, d);
    return T.value = W.ok ? "" : W.error, o(), W;
  }
  return { groups: a, programs: f, chosen: S, failure: T, asking: A, running: z, paused: I, choose: (j, E) => q(["agent", "control", String(e.value.id), j, E.value], { target: S, fields: { value: { ...S.value, [j]: E.label } } }), stop: () => (A.value = !1, q(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (j) => q(["agent", "launch", j.name]) };
}
function fa(e) {
  if (!e) return "Not compacted yet";
  const d = new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return e.start_percent === null ? `Last compacted ${d}` : e.end_percent === null ? `Last compacted ${d}, from ${e.start_percent}%` : `Last compacted ${d}, from ${e.start_percent}% to ${e.end_percent}%, ${e.start_percent - e.end_percent}% taken off`;
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
  class: "context-meter",
  "data-context-menu-meter": ""
}, Ra = { class: "gauge" }, za = { class: "context-used" }, Oa = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Ba = 75, Va = {
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
  setup(e, { emit: d }) {
    const o = e, a = d, f = ha(Ae(o, "agent"), o.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: Ae(o, "controlGroups"), programs: Ae(o, "agentPrograms") }), S = L(null), T = L(""), A = k(() => f.groups.value.find(($) => $.key === T.value));
    function z($, c) {
      S.value = $.currentTarget, T.value = c;
    }
    function I() {
      S.value = null, T.value = "", f.asking.value = !1;
    }
    const q = k(() => o.skills.filter(($) => $.state === "loaded"));
    function V($) {
      z($, "skills"), a("skills");
    }
    const R = ($) => f.groups.value.some((c) => c.key === $), P = k(() => {
      var $;
      return f.chosen.value.model ?? (($ = E.value) == null ? void 0 : $.model) ?? "";
    }), j = k(() => {
      var $;
      return f.chosen.value.effort ?? (($ = E.value) == null ? void 0 : $.effort) ?? "";
    });
    k(() => !!o.agent && !o.agent.ended_at);
    const E = k(() => {
      var $;
      return (($ = o.usage.agents) == null ? void 0 : $.find((c) => {
        var _;
        return c.id === ((_ = o.agent) == null ? void 0 : _.id);
      })) ?? null;
    }), W = k(() => {
      var $;
      return (($ = o.usage.windows) == null ? void 0 : $[0]) ?? null;
    }), G = k(() => W.value ? Math.max(0, Math.min(100, Math.round(W.value.used_percent))) : null), K = k(() => {
      var $;
      return (($ = E.value) == null ? void 0 : $.context_percent) == null ? null : Math.round(E.value.context_percent);
    }), Z = k(() => {
      var $;
      return ($ = E.value) != null && $.cost_dollars ? `$${E.value.cost_dollars.toFixed(2)}` : "";
    }), D = k(() => {
      var _;
      const $ = (_ = o.agent) != null && _.process_started_at ? new Date(o.agent.process_started_at).getTime() : 0;
      if (!$) return "";
      const c = Math.max(0, Math.floor((o.now - $) / 6e4));
      return c >= 60 ? `${Math.floor(c / 60)}h ${c % 60}m` : `${c}m`;
    });
    return ($, c) => {
      var _;
      return t(), l("div", {
        class: se(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (t(), l(H, { key: 0 }, [
          v("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: c[0] || (c[0] = (M) => z(M, "agent"))
          }, [
            b(te, {
              name: "agents",
              size: 12
            }),
            h(" " + p(((_ = e.agentPrograms.find((M) => M.name === e.agent.program)) == null ? void 0 : _.title) || e.agent.program), 1)
          ], 8, ka),
          G.value !== null ? (t(), l("button", {
            key: 0,
            type: "button",
            class: "fact",
            "data-fact": "usage",
            title: `${G.value}% of the plan's ${W.value.title} allowance used`,
            onClick: c[1] || (c[1] = (M) => a("open", "usage", M.currentTarget))
          }, [
            b(te, {
              name: "allowance",
              size: 12
            }),
            c[14] || (c[14] = h()),
            v("span", ba, [
              v("span", {
                style: ve({ width: `${G.value}%` })
              }, null, 4)
            ]),
            h(" " + p(G.value) + "% ", 1)
          ], 8, ya)) : m("", !0),
          K.value !== null ? (t(), l("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${K.value}% full: clear or compact it`,
            onClick: c[2] || (c[2] = (M) => R("context") ? z(M, "context") : a("open", "context", M.currentTarget))
          }, [
            b(te, {
              name: "gauge",
              size: 12
            }),
            c[15] || (c[15] = h()),
            v("span", Ma, [
              v("span", {
                style: ve({ width: `${K.value}%` })
              }, null, 4)
            ]),
            h(" " + p(K.value) + "% ", 1)
          ], 8, wa)) : m("", !0),
          P.value ? (t(), l("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${P.value}: change the model`,
            onClick: c[3] || (c[3] = (M) => R("model") ? z(M, "model") : null)
          }, [
            b(te, {
              name: "model",
              size: 12
            }),
            h(" " + p(P.value), 1)
          ], 8, $a)) : m("", !0),
          R("effort") || e.card && j.value ? (t(), l("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: c[4] || (c[4] = (M) => z(M, "effort"))
          }, [
            b(te, {
              name: "bolt",
              size: 12
            }),
            h(" " + p(j.value), 1)
          ], 8, xa)) : m("", !0),
          Z.value ? (t(), l("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: c[5] || (c[5] = (M) => a("open", "cost", M.currentTarget))
          }, p(Z.value), 9, Ca)) : m("", !0),
          D.value ? (t(), l("span", Sa, [
            b(te, {
              name: "reminders",
              size: 12
            }),
            h(" " + p(D.value), 1)
          ])) : m("", !0),
          e.branch ? (t(), l("span", Aa, [
            b(te, {
              name: "branch",
              size: 12
            }),
            h(" " + p(e.branch), 1)
          ])) : m("", !0),
          e.card ? m("", !0) : (t(), l("button", {
            key: 7,
            type: "button",
            class: se(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: c[6] || (c[6] = (M) => a("open", "jobs", M.currentTarget))
          }, [
            b(te, {
              name: "clock",
              size: 12
            }),
            h(" " + p(e.jobs), 1)
          ], 2)),
          e.run ? (t(), l("button", {
            key: 8,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: V
          }, [
            b(te, {
              name: "book",
              size: 12
            }),
            h(" " + p(q.value.length), 1)
          ])) : m("", !0),
          e.fitness ? (t(), l(H, { key: 9 }, [
            v("button", {
              type: "button",
              class: se(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Ba }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: c[7] || (c[7] = (M) => a("open", "fitness", M.currentTarget))
            }, [
              b(te, {
                name: "heart",
                size: 12
              }),
              h(" " + p(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            v("button", {
              type: "button",
              class: se(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: c[8] || (c[8] = (M) => a("open", "load", M.currentTarget))
            }, [
              b(te, {
                name: "weight",
                size: 12
              }),
              h(" " + p(e.fitness.workload), 1)
            ], 2)
          ], 64)) : m("", !0)
        ], 64)) : e.run && !e.loading ? (t(), l("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: c[9] || (c[9] = (M) => z(M, "start"))
        }, [
          b(te, {
            name: "agents",
            size: 12
          }),
          c[16] || (c[16] = h(" Start an agent", -1))
        ])) : m("", !0),
        c[22] || (c[22] = v("span", { class: "space" }, null, -1)),
        r(f).failure.value ? (t(), l("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: r(f).failure.value
        }, p(r(f).failure.value), 9, ja)) : m("", !0),
        ye($.$slots, "default", {}, void 0, !0),
        S.value ? (t(), F(ga, {
          key: 3,
          anchor: S.value,
          "min-width": 190,
          onClose: I
        }, {
          default: C(() => {
            var M;
            return [
              T.value === "agent" ? (t(), l(H, { key: 0 }, [
                r(f).asking.value ? (t(), l(H, { key: 0 }, [
                  b(fe, { "data-agent-stop-ask": "" }, {
                    default: C(() => [...c[17] || (c[17] = [
                      h("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  b(pe, {
                    "data-agent-stop-confirm": "",
                    onClick: c[10] || (c[10] = (i) => (I(), r(f).stop()))
                  }, {
                    default: C(() => [...c[18] || (c[18] = [
                      h("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  b(pe, {
                    onClick: c[11] || (c[11] = (i) => r(f).asking.value = !1)
                  }, {
                    default: C(() => [...c[19] || (c[19] = [
                      h("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (t(), F(pe, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: c[12] || (c[12] = (i) => r(f).asking.value = !0)
                }, {
                  default: C(() => [...c[20] || (c[20] = [
                    h("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : T.value === "start" ? (t(), l(H, { key: 1 }, [
                b(fe, null, {
                  default: C(() => [...c[21] || (c[21] = [
                    h("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (t(!0), l(H, null, Q(r(f).programs.value, (i) => (t(), F(pe, {
                  key: i.name,
                  "data-agent-program": i.name,
                  onClick: (x) => (I(), r(f).start(i))
                }, {
                  default: C(() => [
                    h(p(i.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : T.value === "skills" ? (t(), F(ia, {
                key: 2,
                skills: e.skills,
                onBrowse: c[13] || (c[13] = (i) => (I(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : A.value ? (t(), l(H, { key: 3 }, [
                b(fe, null, {
                  default: C(() => [
                    h(p(A.value.label), 1)
                  ]),
                  _: 1
                }),
                T.value === "context" ? (t(), l(H, { key: 0 }, [
                  v("div", Ta, [
                    v("span", Ra, [
                      v("span", {
                        style: ve({ width: `${K.value}%` })
                      }, null, 4)
                    ]),
                    v("span", za, p(K.value) + "%", 1)
                  ]),
                  v("p", Oa, p(r(fa)(((M = E.value) == null ? void 0 : M.last_compaction) ?? null)), 1)
                ], 64)) : m("", !0),
                (t(!0), l(H, null, Q(A.value.choices, (i) => (t(), F(pe, {
                  key: i.value,
                  "data-agent-choice": i.value,
                  onClick: (x) => (r(f).choose(A.value.key, i), I())
                }, {
                  default: C(() => [
                    h(p(i.label), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-choice", "onClick"]))), 128))
              ], 64)) : m("", !0)
            ];
          }),
          _: 1
        }, 8, ["anchor"])) : m("", !0)
      ], 2);
    };
  }
}, Ha = /* @__PURE__ */ ee(Va, [["__scopeId", "data-v-c49c145a"]]), La = ["data-agent-open", "aria-expanded", "role", "tabindex"], Ia = { class: "agent-head" }, Ea = ["data-state"], Na = {
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
}, _a = {
  key: 1,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Ya = {
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
  setup(e, { emit: d }) {
    const o = { helper: "Helper", reviewer: "Reviewer" }, a = e, f = d, S = Ie(), T = k(() => {
      var s, O;
      if ((s = a.facts) != null && s.profile_title) return a.facts.profile_title;
      if ((O = a.facts) != null && O.profile) return a.facts.profile;
      const n = o[a.row.role] || a.row.role;
      return n.slice(0, 1).toUpperCase() + n.slice(1);
    }), A = k(() => {
      var n;
      return ((n = a.facts) == null ? void 0 : n.tasks) ?? [];
    }), z = k(() => A.value.filter((n) => n.state === "open")), I = k(() => A.value.find((n) => {
      var s;
      return n.id === ((s = a.progress) == null ? void 0 : s.task_id) && n.state === "started";
    })), q = k(() => I.value || A.value.find((n) => {
      var s;
      return n.id === ((s = a.facts) == null ? void 0 : s.task_id);
    }) || z.value[0] || A.value.at(-1)), V = k(() => I.value ? A.value.filter((n) => n.state === "blocked") : []), R = k(() => {
      var n, s, O, y, u, g;
      return a.row.role === "helper" ? ((n = a.facts) == null ? void 0 : n.helper_job) || "" : (s = a.facts) != null && s.job_enabled && (((O = I.value) == null ? void 0 : O.title) || ((y = a.facts) == null ? void 0 : y.task_title) || ((u = z.value[0]) == null ? void 0 : u.title) || ((g = A.value.at(-1)) == null ? void 0 : g.title)) || "";
    }), P = k(() => {
      const n = R.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return n ? `${n[1].toLowerCase() === "plan" ? "plans" : "docs"}:${n[2]}` : "";
    }), j = k(() => {
      var n;
      return (n = a.facts) != null && n.job_enabled ? `${a.row.role} ${a.row.id}` : "";
    }), E = k(() => {
      var n, s;
      return [a.row.program, (n = a.facts) == null ? void 0 : n.model, (s = a.facts) == null ? void 0 : s.effort, j.value].filter(Boolean).join(" · ");
    }), W = we(), G = k(() => Ee(a.row.process_started_at || a.row.created_at, S.value)), K = /* @__PURE__ */ new Set(["open", "started", "testing"]), Z = k(() => {
      var n;
      return (n = a.facts) == null ? void 0 : n.work_status;
    }), D = k(() => !!a.row.ended_at && a.row.role !== "main" && A.value.some((n) => K.has(n.state))), $ = k(() => {
      var n;
      return a.row.retired_at || a.row.state === "retired" ? "retired" : Z.value || a.waitReason || D.value ? "waiting" : a.row.state === "running" && ((n = a.facts) == null ? void 0 : n.state) || a.row.state;
    }), c = k(() => {
      var n;
      return Z.value ? `Status: ${Z.value}` : a.waitReason ? `Waiting: ${a.waitReason}` : $.value === "blocked" ? (n = a.facts) != null && n.blocked_reason ? `Blocked: ${a.facts.blocked_reason}` : "Blocked" : D.value ? "Stopped with work left" : "";
    }), _ = k(() => {
      var n;
      return ((n = a.progress) == null ? void 0 : n.completed_count) ?? A.value.filter((s) => s.state === "completed").length;
    }), M = k(() => {
      var n;
      return ((n = a.progress) == null ? void 0 : n.task_count) ?? A.value.length;
    }), i = k(() => `${_.value} of ${M.value} ${M.value === 1 ? "task" : "tasks"}`), x = k(() => {
      var s;
      const n = ot(_.value, ((s = a.progress) == null ? void 0 : s.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, S.value);
      return a.row.role !== "main" && n ? `${n} per hour` : "";
    }), U = k(() => !!a.row.retired_at || a.row.state === "retired");
    return (n, s) => {
      var O, y, u, g;
      return t(), l("div", {
        class: se(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: s[4] || (s[4] = (w) => !e.open && f("toggle")),
        onKeydown: [
          s[5] || (s[5] = ze(ne((w) => !e.open && f("toggle"), ["self", "prevent"]), ["enter"])),
          s[6] || (s[6] = ze(ne((w) => !e.open && f("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        v("span", Ia, [
          e.open ? (t(), l("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: s[0] || (s[0] = ne((w) => f("toggle"), ["stop"]))
          }, [
            b(r(ge), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : m("", !0),
          v("span", {
            class: "agent-dot",
            "data-state": $.value,
            "data-agent-motion": ""
          }, null, 8, Ea),
          v("span", Na, p(T.value), 1),
          v("span", qa, p(((O = e.facts) == null ? void 0 : O.given_name) || e.row.id), 1),
          e.open ? m("", !0) : (t(), F(r(ge), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          v("span", Wa, [
            U.value ? (t(), l("span", Fa, [
              s[7] || (s[7] = h("Retired, ", -1)),
              b(r(he), {
                at: e.row.retired_at
              }, null, 8, ["at"])
            ])) : e.row.ended_at && Z.value ? (t(), l("span", Pa, [
              s[8] || (s[8] = h("Process ended: ", -1)),
              b(r(he), {
                at: e.row.ended_at
              }, null, 8, ["at"])
            ])) : e.row.ended_at ? (t(), l("span", Da, [
              s[9] || (s[9] = h("Idle, ", -1)),
              b(r(he), {
                at: e.row.ended_at
              }, null, 8, ["at"])
            ])) : (t(), l("span", Ua, p(G.value), 1)),
            !e.open && e.row.role === "worker" && x.value ? (t(), l("span", Ka, p(x.value), 1)) : m("", !0)
          ])
        ]),
        v("span", Ja, [
          v("span", Za, p(E.value), 1),
          e.open ? (t(), l("span", Ga, [
            b(r(ge), {
              name: "time",
              size: 12
            }),
            s[10] || (s[10] = h("First started: ", -1)),
            b(r(he), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : m("", !0),
          e.open && ((y = e.facts) != null && y.last_activity) ? (t(), l("span", _a, [
            s[11] || (s[11] = h("Last heard: ", -1)),
            b(r(he), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : m("", !0)
        ]),
        e.open ? (t(), F(Ha, {
          key: 0,
          "agent-programs": r(W).props.programs.rows.value,
          agent: e.row,
          branch: (u = e.progress) == null ? void 0 : u.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: [] },
          card: ""
        }, {
          default: C(() => [
            b(Jt, { row: e.row }, null, 8, ["row"]),
            e.row.role === "helper" && !e.row.ended_at ? (t(), F(r(ae), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: s[1] || (s[1] = ne((w) => r(W).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: C(() => [...s[12] || (s[12] = [
                h("Stop", -1)
              ])]),
              _: 1
            })) : m("", !0)
          ]),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : m("", !0),
        e.open && M.value && !R.value ? (t(), l("span", Ya, [
          b(Be, {
            count: i.value,
            rate: x.value
          }, null, 8, ["count", "rate"])
        ])) : m("", !0),
        R.value || !e.open && c.value || Z.value ? (t(), l("span", Qa, [
          v("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: R.value
          }, [
            e.open && P.value ? (t(), l("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": P.value,
              onClick: s[2] || (s[2] = ne((w) => r(be)(P.value), ["stop"]))
            }, p(R.value), 9, en)) : (t(), l(H, { key: 1 }, [
              h(p(R.value), 1)
            ], 64)),
            R.value && e.row.role !== "helper" && ((g = q.value) != null && g.plan_id) ? (t(), l("button", {
              key: 2,
              type: "button",
              class: "agent-plan",
              "data-agent-plan": "",
              "data-peek": `plans:${q.value.plan_id}`,
              onClick: s[3] || (s[3] = ne((w) => r(be)(`plans:${q.value.plan_id}`), ["stop"]))
            }, "plan " + p(q.value.plan_id), 9, tn)) : m("", !0)
          ], 8, Xa),
          c.value && (!e.open || Z.value) ? (t(), l("span", {
            key: 0,
            class: "agent-work-status",
            "data-agent-work-status": "",
            "data-agent-waiting": e.waitReason ? "" : null,
            "data-agent-stopped": D.value && !e.waitReason && !Z.value ? "" : null
          }, p(c.value), 9, an)) : m("", !0),
          e.open && M.value ? (t(), F(Be, {
            key: 1,
            count: i.value,
            rate: x.value
          }, null, 8, ["count", "rate"])) : m("", !0)
        ])) : m("", !0),
        V.value.length ? (t(), l("span", nn, "Blocked: " + p(V.value.map((w) => `task ${w.id}`).join(", ")), 1)) : m("", !0),
        e.open ? (t(), F(Ot, {
          key: 4,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: A.value,
          "stopped-with-work": D.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : m("", !0)
      ], 42, La);
    };
  }
}, on = /* @__PURE__ */ ee(ln, [["__scopeId", "data-v-a9bf1a67"]]), sn = {
  key: 0,
  class: "badge",
  "data-agent-count-badge": ""
}, rn = { class: "counts" }, un = ["data-edit-type"], dn = { key: 0 }, cn = { class: "stepper" }, pn = ["disabled", "onClick"], vn = ["value", "disabled", "data-agent-limit-input", "onChange"], gn = ["disabled", "onClick"], mn = { key: 0 }, hn = { key: 1 }, fn = ["data-count-agent"], kn = { class: "person-text" }, yn = {
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
  setup(e, { emit: d }) {
    const o = d, a = we(), { rows: f, failure: S } = a.props.limits, { rows: T } = a.props["count-agents"], A = Ie(), z = L(!1), I = L(null), q = L(!1), V = L(!1), R = L(""), P = L(""), j = L(null), E = L(""), W = k(() => f.value.flatMap((y) => y.per_profile ? y.profiles.filter((u) => u.kept).map((u) => ({ ...u, label: u.title, type: y.key, key: `${y.key}:${u.profile}` })) : [{ ...y, type: y.key }])), G = (y, u) => u > 0 && y >= u, K = k(() => W.value.filter((y) => G(y.running, y.run_limit) || G(y.kept, y.kept_limit)).length), Z = k(() => f.value.find((y) => y.per_profile)), D = k(() => W.value.find((y) => y.key === I.value)), $ = k(() => T.value.filter((y) => {
      var u, g;
      return y.state !== "retired" && y.role === ((u = D.value) == null ? void 0 : u.type) && (!D.value.profile || (((g = y.facts) == null ? void 0 : g.profile) || y.profile) === D.value.profile);
    }).sort((y, u) => (y.state !== "running") - (u.state !== "running") || String(y.ended_at || y.created_at).localeCompare(String(u.ended_at || u.created_at)))), c = k(() => {
      var u;
      const y = /* @__PURE__ */ new Map();
      for (const g of $.value) {
        const w = ((u = g.facts) == null ? void 0 : u.model) || g.program_model;
        w && y.set(w, (y.get(w) || 0) + 1);
      }
      return [...y].map(([g, w]) => `${w} ${g}`).join(", ");
    }), _ = (y, u) => u ? `${Math.min(y / Math.max(y, u) * 100, 100)}%` : "0%", M = (y, u) => u && y > u ? `${(y - u) / y * 100}%` : "0%", i = k(() => {
      var y;
      return q.value ? "Change the maximums" : ((y = D.value) == null ? void 0 : y.label) || "Agent counts";
    });
    function x() {
      q.value = !1, I.value = null, j.value = null, R.value = "";
    }
    function U() {
      z.value = !1, x();
    }
    async function n(y, u, g, w) {
      if (V.value || a.readOnly) return;
      const Y = Number(w);
      if (!String(w).trim() || !Number.isInteger(Y) || Y < 0) {
        R.value = "Use a whole number of 0 or more.";
        return;
      }
      V.value = !0, R.value = "";
      const le = await a.run(["setting", "set", u, String(Y), "--environment", a.environment]);
      le.ok ? (await a.reload("limits"), P.value = "Saved.") : R.value = le.error, V.value = !1;
    }
    async function s(y) {
      if (!E.value.trim() || V.value) return;
      V.value = !0;
      const u = await a.run(["agent", "retire", String(y.id), "--reason", E.value.trim()]);
      R.value = u.ok ? "" : "The agent could not be retired. Try again.", u.ok && (j.value = null, E.value = "", P.value = "Agent retired permanently.", await Promise.all([a.reload("limits"), a.reload("count-agents")])), V.value = !1;
    }
    function O(y) {
      U(), o("open-agent", y);
    }
    return (y, u) => (t(), l(H, null, [
      v("button", {
        class: "counts-button",
        type: "button",
        title: "Agent counts",
        "aria-label": "Agent counts",
        "data-agent-counts": "",
        onClick: u[0] || (u[0] = (g) => z.value = !0)
      }, [
        b(r(ge), {
          name: "settings",
          size: 16
        }),
        K.value ? (t(), l("span", sn, p(K.value), 1)) : m("", !0)
      ]),
      z.value ? (t(), F(r(st), {
        key: 0,
        title: i.value,
        modal: "",
        fits: "",
        onClose: U,
        onEscape: U
      }, {
        foot: C(() => [
          q.value ? (t(), l(H, { key: 0 }, [
            v("span", xn, p(P.value || `Changes apply to ${r(a).environment}.`), 1),
            b(r(ae), { onClick: x }, {
              default: C(() => [...u[18] || (u[18] = [
                h("Done", -1)
              ])]),
              _: 1
            })
          ], 64)) : D.value ? m("", !0) : (t(), F(r(ae), {
            key: 1,
            disabled: r(a).readOnly,
            "data-agent-limits-edit": "",
            onClick: u[4] || (u[4] = (g) => q.value = !0)
          }, {
            default: C(() => [...u[19] || (u[19] = [
              h("Change the maximums", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]))
        ]),
        default: C(() => [
          v("div", rn, [
            q.value || D.value ? (t(), l("button", {
              key: 0,
              class: "back",
              type: "button",
              onClick: x
            }, "‹ Back to the counts")) : m("", !0),
            r(S) ? (t(), l(H, { key: 1 }, [
              u[6] || (u[6] = v("strong", null, "The counts could not be read", -1)),
              u[7] || (u[7] = v("p", null, "The journal did not answer.", -1)),
              b(r(ae), {
                small: "",
                onClick: u[1] || (u[1] = (g) => r(a).reload("limits"))
              }, {
                default: C(() => [...u[5] || (u[5] = [
                  h("Try again", -1)
                ])]),
                _: 1
              })
            ], 64)) : q.value ? (t(), l(H, { key: 2 }, [
              u[8] || (u[8] = v("p", null, "How many agents of a type may run at once, and how many may be kept.", -1)),
              (t(!0), l(H, null, Q(r(f), (g) => (t(), l("div", {
                key: g.key,
                class: "edit-row",
                "data-edit-type": g.key
              }, [
                v("div", null, [
                  v("strong", null, p(g.per_profile ? "Each helper type" : "Workers"), 1),
                  g.per_profile ? (t(), l("small", dn, "Researcher, Planner and the others")) : m("", !0)
                ]),
                (t(!0), l(H, null, Q([{ name: "Most running", value: g.run_limit, key: g.run_setting, source: g.run_source, kind: "run" }, { name: "Most kept", value: g.kept_limit, key: g.kept_setting, source: g.kept_source, kind: "kept" }], (w) => (t(), l("label", {
                  key: w.key
                }, [
                  h(p(w.name), 1),
                  v("span", cn, [
                    v("button", {
                      type: "button",
                      disabled: V.value || r(a).readOnly || w.value === 0,
                      onClick: (Y) => n(g, w.key, w.value, w.value - 1)
                    }, "−", 8, pn),
                    v("input", {
                      type: "number",
                      min: "0",
                      value: w.value,
                      disabled: V.value || r(a).readOnly,
                      "data-agent-limit-input": w.kind,
                      onChange: (Y) => n(g, w.key, w.value, Y.target.value)
                    }, null, 40, vn),
                    v("button", {
                      type: "button",
                      disabled: V.value || r(a).readOnly,
                      onClick: (Y) => n(g, w.key, w.value, w.value + 1)
                    }, "+", 8, gn)
                  ]),
                  w.value === 0 ? (t(), l("small", mn, p(w.kind === "run" ? "None can start" : "Any number"), 1)) : w.source === `environment ${r(a).environment}` ? (t(), l("small", hn, "Changed for " + p(r(a).environment), 1)) : m("", !0)
                ]))), 128))
              ], 8, un))), 128))
            ], 64)) : D.value ? (t(), l(H, { key: 3 }, [
              v("p", null, [
                v("strong", null, p(D.value.running) + " of " + p(D.value.run_limit), 1),
                u[9] || (u[9] = h(" running, ", -1)),
                v("strong", null, [
                  h(p(D.value.kept), 1),
                  D.value.kept_limit ? (t(), l(H, { key: 0 }, [
                    h(" of " + p(D.value.kept_limit), 1)
                  ], 64)) : m("", !0)
                ]),
                u[10] || (u[10] = h(" kept", -1))
              ]),
              v("p", null, p(c.value), 1),
              $.value.length ? m("", !0) : (t(), l(H, { key: 0 }, [
                u[11] || (u[11] = v("strong", null, "No agents here yet", -1)),
                u[12] || (u[12] = v("p", null, "An agent shows here as soon as one of this type starts.", -1))
              ], 64)),
              (t(!0), l(H, null, Q($.value, (g) => {
                var w, Y, le, Me, me;
                return t(), l("div", {
                  key: g.id,
                  class: "person",
                  "data-count-agent": g.id
                }, [
                  v("span", {
                    class: se(["dot", { running: g.state === "running" }])
                  }, null, 2),
                  v("div", kn, [
                    v("strong", null, p(((w = g.facts) == null ? void 0 : w.given_name) || g.id), 1),
                    h(" " + p(g.state === "running" ? "Running" : "Idle") + ", " + p(r(Ee)(g.state === "running" ? g.process_started_at || g.created_at : g.ended_at, r(A))), 1),
                    v("small", null, p([g.program, (Y = g.facts) == null ? void 0 : Y.model, (le = g.facts) == null ? void 0 : le.effort, `${g.role} ${g.id}`].filter(Boolean).join(", ")), 1),
                    v("small", null, p(((Me = g.facts) == null ? void 0 : Me.task_title) || ((me = g.facts) == null ? void 0 : me.helper_job)), 1)
                  ]),
                  b(r(ae), {
                    small: "",
                    onClick: (ue) => O(g)
                  }, {
                    default: C(() => [...u[13] || (u[13] = [
                      h("Open", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"]),
                  g.state === "idle" && !r(a).readOnly ? (t(), F(r(ae), {
                    key: 0,
                    small: "",
                    onClick: (ue) => {
                      j.value = g.id, E.value = "";
                    }
                  }, {
                    default: C(() => [...u[14] || (u[14] = [
                      h("Retire", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"])) : m("", !0),
                  j.value === g.id ? (t(), F(Ne, {
                    key: 1,
                    reason: E.value,
                    "onUpdate:reason": u[2] || (u[2] = (ue) => E.value = ue),
                    pending: V.value,
                    onSubmit: (ue) => s(g),
                    onCancel: u[3] || (u[3] = (ue) => j.value = null)
                  }, null, 8, ["reason", "pending", "onSubmit"])) : m("", !0)
                ], 8, fn);
              }), 128))
            ], 64)) : (t(), l(H, { key: 4 }, [
              u[16] || (u[16] = v("p", null, "Kept agents have not been retired, so they can take another job. Open a row to see them.", -1)),
              u[17] || (u[17] = v("div", { class: "columns" }, [
                v("span", null, "Name"),
                v("span", null, "Running"),
                v("span", null, "Kept"),
                v("span")
              ], -1)),
              Z.value ? (t(), l("div", yn, [
                u[15] || (u[15] = v("strong", null, "Helpers", -1)),
                v("span", null, p(Z.value.running) + " running, " + p(Z.value.kept) + " kept", 1)
              ])) : m("", !0),
              (t(!0), l(H, null, Q(W.value, (g) => (t(), l("button", {
                key: g.key,
                type: "button",
                class: "count-row",
                "data-agent-limit-type": g.type || g.key,
                "data-agent-limit-profile": g.profile,
                onClick: (w) => I.value = g.key
              }, [
                v("strong", null, p(g.label), 1),
                (t(!0), l(H, null, Q([{ count: g.running, limit: g.run_limit, unlimited: !1 }, { count: g.kept, limit: g.kept_limit, unlimited: !0 }], (w) => (t(), l("span", {
                  key: w.unlimited,
                  class: se({ full: G(w.count, w.limit) })
                }, [
                  v("span", null, [
                    h(p(w.count), 1),
                    w.limit || !w.unlimited ? (t(), l(H, { key: 0 }, [
                      h(" of " + p(w.limit), 1)
                    ], 64)) : m("", !0)
                  ]),
                  w.limit ? (t(), l("span", wn, [
                    v("span", {
                      style: ve({ width: _(w.count, w.limit) })
                    }, null, 4),
                    v("i", {
                      style: ve({ width: M(w.count, w.limit) })
                    }, null, 4)
                  ])) : m("", !0)
                ], 2))), 128)),
                b(r(ge), {
                  name: "chevronRight",
                  size: 12
                })
              ], 8, bn))), 128))
            ], 64)),
            R.value ? (t(), l("p", Mn, p(R.value), 1)) : P.value ? (t(), l("p", $n, p(P.value), 1)) : m("", !0)
          ])
        ]),
        _: 1
      }, 8, ["title"])) : m("", !0)
    ], 64));
  }
}, Sn = /* @__PURE__ */ ee(Cn, [["__scopeId", "data-v-5afd33ad"]]), An = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, jn = ["data-agent-row"], Ve = "journal.agents.filters", Se = "cubic-bezier(0.2, 0.9, 0.25, 1)", Tn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const d = e, o = we(), { rows: a } = o.props.waits, { rows: f } = o.props.progress, { rows: S, failure: T, loaded: A, more: z } = o.props.agents, I = (N) => f.value.find((J) => J.agent_id === N.id) ?? null, q = (N) => {
      var J;
      return ((J = a.value.find((B) => B.agent_id === N.id)) == null ? void 0 : J.reason) ?? "";
    }, V = L("running"), R = L(""), P = JSON.parse(localStorage.getItem(Ve) || '{"roles":[],"profiles":[],"programs":[]}'), j = L(P), E = k(() => o.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: W } = o.props.programs, G = k(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), K = (N, J) => {
      j.value = dt(j.value, N, J);
    }, Z = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, D = (N) => N.slice(0, 1).toUpperCase() + N.slice(1);
    ie(j, (N) => localStorage.setItem(Ve, JSON.stringify(N)));
    const $ = L(25);
    function c() {
      Object.assign(o.state, {
        "agents.show": V.value,
        "agents.search": R.value,
        "agents.limit": String($.value),
        "agents.roles": j.value.roles.join(","),
        "agents.profiles": j.value.profiles.join(","),
        "agents.programs": j.value.programs.join(",")
      });
    }
    async function _() {
      return $.value += 25, c(), await o.reload("agents"), !0;
    }
    ie([V, R, j], () => {
      $.value = 25, c(), o.reload("agents");
    }), c();
    const M = (N) => N.facts ?? null, i = S, x = k(() => !!R.value.trim() || G.value > 0), U = k(() => d.texts[V.value] ?? { title: d.empty, hint: "" }), n = L(null), s = L(null), O = L(null), y = L(null), u = k(() => n.value === null ? null : o.props[`card.${n.value}`].rows.value.find((N) => N.id === n.value) ?? s.value), g = k(() => u.value ? [u.value] : i.value), w = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let Y = !1, le = 0;
    async function Me(N) {
      if (Y) return;
      Y = !0, le = y.value.scrollTop;
      const J = O.value.querySelector(`[data-agent-open="${N.id}"]`);
      if (!w()) {
        const re = [...O.value.querySelectorAll(".agent-row")].filter((oe) => !oe.contains(J));
        await Promise.all(re.map((oe) => oe.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const B = [...J.querySelectorAll(".agent-head, .agent-line")], X = [...B, ...J.querySelectorAll("[data-agent-motion]")], $e = X.map((re) => re.getBoundingClientRect());
      if (s.value = N, n.value = N.id, o.reload(`card.${N.id}`), await Oe(), !w()) {
        const re = X.map((oe) => oe.getBoundingClientRect());
        X.forEach((oe, xe) => {
          const de = B.indexOf(oe.parentElement), Fe = $e[xe].left - re[xe].left - (de < 0 ? 0 : $e[de].left - re[de].left), Pe = $e[xe].top - re[xe].top - (de < 0 ? 0 : $e[de].top - re[de].top);
          oe.animate([{ transform: `translate(${Fe}px, ${Pe}px)` }, { transform: "none" }], { duration: 280, easing: Se });
        }), O.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((oe) => {
          oe.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Se, fill: "backwards" });
        });
      }
      Y = !1;
    }
    async function me() {
      if (Y || !u.value) return;
      Y = !0;
      const N = O.value.querySelector(`[data-agent-open="${n.value}"]`), J = [...N.children], B = w() ? [] : J.map((X) => X.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(B.map((X) => X.finished)), n.value = null, await Oe(), y.value.scrollTop = le, B.forEach((X) => X.cancel()), w() || (N.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Se }), O.value.querySelectorAll(".agent-row").forEach((X) => {
        X.contains(N) || X.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Se });
      })), Y = !1;
    }
    function ue(N) {
      s.value = N, n.value = N.id, o.reload(`card.${N.id}`);
    }
    const We = (N) => n.value === N.id ? me() : Me(N);
    ie(R, (N) => N.trim() && (n.value = null)), ie(V, () => {
      n.value = null;
    });
    const Re = (N) => {
      N.key === "Escape" && me();
    };
    return window.addEventListener("keydown", Re), ke(() => window.removeEventListener("keydown", Re)), (N, J) => (t(), l("div", {
      ref_key: "agents",
      ref: O,
      class: se(["agents", { focused: u.value }])
    }, [
      b(r(rt), {
        modelValue: R.value,
        "onUpdate:modelValue": J[1] || (J[1] = (B) => R.value = B),
        placeholder: "Search agents",
        "menu-count": G.value,
        "data-agents-search": ""
      }, {
        menu: C(() => [
          b(r(je), null, {
            default: C(() => [...J[2] || (J[2] = [
              h("Type", -1)
            ])]),
            _: 1
          }),
          (t(!0), l(H, null, Q(E.value.roles, (B) => (t(), F(r(Ce), {
            key: B,
            role: "menuitemcheckbox",
            "aria-checked": j.value.roles.includes(B),
            checked: j.value.roles.includes(B),
            "data-filter-role": B,
            onClick: (X) => K("roles", B)
          }, {
            default: C(() => [
              h(p(D(B)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          E.value.profiles.length ? (t(), F(r(je), { key: 0 }, {
            default: C(() => [...J[3] || (J[3] = [
              h("Profile", -1)
            ])]),
            _: 1
          })) : m("", !0),
          (t(!0), l(H, null, Q(E.value.profiles, (B) => (t(), F(r(Ce), {
            key: B.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.profiles.includes(B.name),
            checked: j.value.profiles.includes(B.name),
            "data-filter-profile": B.name,
            onClick: (X) => K("profiles", B.name)
          }, {
            default: C(() => [
              h(p(B.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          b(r(je), null, {
            default: C(() => [...J[4] || (J[4] = [
              h("Program", -1)
            ])]),
            _: 1
          }),
          (t(!0), l(H, null, Q(r(W), (B) => (t(), F(r(Ce), {
            key: B.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.programs.includes(B.name),
            checked: j.value.programs.includes(B.name),
            "data-filter-program": B.name,
            onClick: (X) => K("programs", B.name)
          }, {
            default: C(() => [
              h(p(B.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          G.value ? (t(), F(r(Ce), {
            key: 1,
            "data-filter-clear": "",
            onClick: Z
          }, {
            default: C(() => [...J[5] || (J[5] = [
              h("Clear filters", -1)
            ])]),
            _: 1
          })) : m("", !0)
        ]),
        default: C(() => [
          b(r(it), {
            options: E.value.states,
            value: V.value,
            onPick: J[0] || (J[0] = (B) => V.value = B)
          }, null, 8, ["options", "value"]),
          b(Sn, { onOpenAgent: ue })
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      V.value === "retired" && E.value.upgrade_retired ? (t(), l("p", An, "Retired during the upgrade: " + p(E.value.upgrade_retired), 1)) : m("", !0),
      v("div", {
        ref_key: "list",
        ref: y,
        class: se(["agents-view", { "agents-view-open": u.value }])
      }, [
        r(A) && !r(T) && !g.value.length && G.value ? (t(), F(r(Te), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: C(() => [
            b(r(ae), {
              small: "",
              "data-empty-clear": "",
              onClick: Z
            }, {
              default: C(() => [...J[6] || (J[6] = [
                h("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (t(), F(r(ut), {
          key: 1,
          rows: g.value,
          failure: r(T),
          loaded: r(A),
          more: !u.value && r(z),
          older: _,
          empty: U.value.title,
          hint: U.value.hint,
          searching: x.value
        }, {
          default: C(({ row: B }) => [
            v("div", {
              class: "agent-row",
              "data-agent-row": B.id
            }, [
              b(on, {
                row: B,
                facts: M(B),
                progress: I(B),
                "wait-reason": q(B),
                open: B.id === n.value,
                onToggle: (X) => We(B)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, jn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, Bn = /* @__PURE__ */ ee(Tn, [["__scopeId", "data-v-06777d49"]]);
export {
  Bn as A
};
