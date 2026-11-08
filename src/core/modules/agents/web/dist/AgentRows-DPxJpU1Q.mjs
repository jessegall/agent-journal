/* @code-commandments-generated */
import { openBlock as n, createElementBlock as s, withModifiers as te, unref as d, createTextVNode as f, toDisplayString as h, createVNode as m, createBlock as q, withCtx as k, Fragment as P, renderList as _, createElementVNode as T, createCommentVNode as b, computed as c, ref as N, watch as re, onUnmounted as ye, defineAsyncComponent as Xe, createSlots as _e, resolveDynamicComponent as et, normalizeClass as ae, normalizeStyle as me, renderSlot as we, onMounted as tt, Teleport as at, mergeProps as nt, toRef as je, withKeys as Ee, nextTick as He } from "vue";
import { peekRef as Ae, Icon as Re, RunningCommand as lt, FoldGroup as De, TaskStatusIcon as ot, useWindow as Te, loadWindowComponent as st, coalesced as rt, READ_RATES as it, InnerTabs as dt, TabBody as ut, SwitchCase as Fe, EmptyState as Be, Btn as ie, TextArea as ct, TextInput as gt, HoverTip as Ce, useNow as Pe, age as vt, perHour as pt, ago as ht, TimeAgo as Ne, SearchBar as ft, Segmented as mt, MenuLabel as Le, MenuItem as $e, RowList as kt, toggleFilter as bt } from "@journal/window-kit";
import { _ as Y, T as yt } from "./TranscriptRows-BWj_mVuu.mjs";
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
    return (l, t) => (n(), s("span", wt, [
      e.waitReason ? (n(), s("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: t[0] || (t[0] = te((o) => d(Ae)("test_queue:0"), ["stop"]))
      }, [
        f("Waiting: " + h(e.waitReason) + " ", 1),
        m(d(Re), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (n(), s("span", Mt, "Waiting")) : (n(), q(d(lt), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, $t = /* @__PURE__ */ Y(xt, [["__scopeId", "data-v-bb905922"]]), St = ["data-agent-delegated", "onClick"], Ct = { class: "agent-task-number" }, At = { class: "agent-task-title" }, Tt = ["title"], jt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const t = l;
    return (o, a) => (n(), q(d(De), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: a[0] || (a[0] = (r) => t("toggle"))
    }, {
      default: k(() => [
        (n(!0), s(P, null, _(e.section.tasks, (r) => (n(), s("button", {
          key: r.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": r.id,
          onClick: (v) => d(Ae)(`tasks:${r.id}`)
        }, [
          m(d(ot), {
            status: r.state
          }, null, 8, ["status"]),
          T("span", Ct, h(r.id), 1),
          T("span", At, h(r.title), 1),
          r.plan_id ? (n(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${r.plan_id}: ${r.plan_title}`
          }, "Plan " + h(r.plan_id) + ": " + h(r.plan_title), 9, Tt)) : b("", !0)
        ], 8, St))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Lt = /* @__PURE__ */ Y(jt, [["__scopeId", "data-v-acc154a9"]]), Rt = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Bt = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Vt = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, It = ["data-peek", "onClick"], zt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ot = {
  key: 0,
  class: "agent-helper-brief"
}, Et = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ht = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Nt = "It ended without a report", Wt = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const l = e, t = ["started", "blocked", "open", "completed"], o = c(() => {
      var i, A;
      return l.row.ended_at && ((A = (i = l.facts) == null ? void 0 : i.job_returned) != null && A.startsWith(Nt)) ? l.facts.job_returned : "";
    }), a = c(() => l.tasks.length ? t.map((i) => ({ state: i, label: i.slice(0, 1).toUpperCase() + i.slice(1), tasks: l.tasks.filter((A) => A.state === i || i === "started" && A.state === "testing" || i === "completed" && A.state === "cancelled") })) : []), r = /* @__PURE__ */ new Set(["completed"]), v = N({}), $ = (i) => !(v.value[i] ?? r.has(i)), y = (i) => v.value = { ...v.value, [i]: $(i) }, R = Te(), { rows: W } = R.props.reports;
    R.state["reports.agent"] = String(l.row.id);
    const I = c(() => l.row.access === "read-only"), z = c(() => !!l.row.retired_at || l.row.state === "retired"), U = ["tasks", "transcript", "terminal", "file-feed", "reports"], j = c(() => (z.value ? R.tabs.filter((A) => ["reports", "transcript"].includes(A.key)) : I.value ? R.tabs.filter((A) => ["reports", "transcript", "terminal"].includes(A.key)) : [...R.tabs]).sort((A, H) => (U.indexOf(A.key) < 0 ? U.length : U.indexOf(A.key)) - (U.indexOf(H.key) < 0 ? U.length : U.indexOf(H.key)))), O = () => I.value || z.value ? j.value.find((i) => i.key === "transcript") : j.value[0], E = N(O());
    re(E, (i) => {
      R.state.tab = (i == null ? void 0 : i.key) ?? "";
    }, { immediate: !0 }), ye(() => {
      R.state.tab = "";
    }), re(j, (i) => {
      i.some((A) => {
        var H;
        return A.key === ((H = E.value) == null ? void 0 : H.key);
      }) || (E.value = i[0]);
    }), re(() => l.open, (i) => {
      i && (E.value = O());
    });
    const K = Object.fromEntries(R.tabs.filter((i) => i.component).map((i) => [i.key, Xe(() => st(i.component))])), x = N(!1), { data: u } = R.props.tool, Z = c(() => {
      var i;
      return ((i = u.value) == null ? void 0 : i.tool) ?? "";
    }), L = c(() => {
      var i;
      return ((i = u.value) == null ? void 0 : i.note) ?? "";
    }), B = c(() => l.row.role !== "main" && (!l.row.ended_at || l.stoppedWithWork || l.waitReason));
    async function Q() {
      !l.open || !B.value || (R.state["tool.agent"] = String(l.row.id), await R.reload("tool"));
    }
    const F = R.follow(["hook_call.*", "process_part.*"], rt(Q, it.agentCommand));
    return ye(() => F == null ? void 0 : F()), re(() => l.open, (i) => {
      i && Q();
    }, { immediate: !0 }), (i, A) => {
      var H;
      return n(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: A[2] || (A[2] = te(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (n(), s("p", Rt, "Retirement reason: " + h(e.row.retirement_reason), 1)) : b("", !0),
        e.row.resume_reason ? (n(), s("p", Bt, h(e.row.resume_reason), 1)) : b("", !0),
        B.value ? (n(), q($t, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: Z.value,
          note: L.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : b("", !0),
        o.value ? (n(), s("p", Vt, h(o.value), 1)) : b("", !0),
        m(d(dt), {
          class: "agent-tabs",
          tabs: j.value,
          active: E.value,
          answer: { tasks: e.tasks.length, reports: d(W).length },
          onChoose: A[0] || (A[0] = (g) => E.value = g)
        }, null, 8, ["tabs", "active", "answer"]),
        m(d(ut), {
          class: "agent-tab-body",
          tab: E.value,
          "data-agent-tab-body": (H = E.value) == null ? void 0 : H.key
        }, {
          default: k(() => {
            var g;
            return [
              m(d(Fe), {
                value: (g = E.value) == null ? void 0 : g.key
              }, _e({
                reports: k(() => [
                  d(W).length ? b("", !0) : (n(), q(d(Be), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: k(() => [...A[3] || (A[3] = [
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
                  }, h(S.text), 9, It))), 128))
                ]),
                tasks: k(() => {
                  var S;
                  return [
                    e.tasks.length ? b("", !0) : (n(), q(d(Be), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: k(() => [...A[4] || (A[4] = [
                        f("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (n(!0), s(P, null, _(a.value, (D) => (n(), q(Lt, {
                      key: D.state,
                      section: D,
                      open: $(D.state),
                      onToggle: (p) => y(D.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (S = e.facts) != null && S.instruction ? (n(), s(P, { key: 1 }, [
                      A[5] || (A[5] = T("p", { class: "agent-label" }, "Instruction", -1)),
                      T("div", zt, h(e.facts.instruction), 1)
                    ], 64)) : b("", !0)
                  ];
                }),
                transcript: k(() => {
                  var S;
                  return [
                    I.value ? (n(), s(P, { key: 0 }, [
                      (S = e.facts) != null && S.instruction ? (n(), s("div", Ot, [
                        m(d(De), {
                          label: "Instruction",
                          open: x.value,
                          "data-agent-section": "instruction",
                          onToggle: A[1] || (A[1] = (D) => x.value = !x.value)
                        }, {
                          default: k(() => [
                            T("div", Et, h(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (n(), s("p", Ht, "No job recorded")) : b("", !0)
                    ], 64)) : b("", !0),
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
                  fn: k(() => [
                    (n(), q(et(S), {
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
}, qt = /* @__PURE__ */ Y(Wt, [["__scopeId", "data-v-986f12ca"]]), Dt = { class: "action-field" }, Ft = ["value", "disabled"], Pt = ["value"], Ut = { key: 1 }, Jt = {
  key: 1,
  class: "action-field"
}, Gt = { class: "action-buttons" }, Kt = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (l, t) => (n(), s("form", {
      onSubmit: t[4] || (t[4] = te((o) => l.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (n(), s(P, { key: 0 }, [
        T("label", Dt, [
          t[6] || (t[6] = f("Task ", -1)),
          T("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: t[0] || (t[0] = (o) => l.$emit("update:task", o.target.value))
          }, [
            t[5] || (t[5] = T("option", { value: "" }, "Choose an open task", -1)),
            (n(!0), s(P, null, _(e.tasks, (o) => (n(), s("option", {
              key: o.id,
              value: String(o.id)
            }, h(o.id) + ": " + h(o.title), 9, Pt))), 128))
          ], 40, Ft)
        ]),
        e.moreTasks ? (n(), q(d(ie), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: t[1] || (t[1] = (o) => l.$emit("more"))
        }, {
          default: k(() => [...t[7] || (t[7] = [
            f("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : b("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (n(), s("p", Ut, "No open tasks.")) : b("", !0)
      ], 64)) : (n(), s("label", Jt, [
        t[8] || (t[8] = f("Job", -1)),
        m(d(ct), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (o) => l.$emit("update:text", o.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      T("div", Gt, [
        m(d(ie), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: k(() => [...t[9] || (t[9] = [
            f("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        m(d(ie), {
          small: "",
          disabled: e.pending,
          onClick: t[3] || (t[3] = (o) => l.$emit("cancel"))
        }, {
          default: k(() => [...t[10] || (t[10] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Zt = /* @__PURE__ */ Y(Kt, [["__scopeId", "data-v-356a2712"]]), Yt = { class: "action-buttons" }, Qt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (l, t) => (n(), s("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = te((o) => l.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = T("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      m(d(gt), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (o) => l.$emit("update:reason", o))
      }, null, 8, ["model-value", "disabled"]),
      T("div", Yt, [
        m(d(ie), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: k(() => [...t[3] || (t[3] = [
            f("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        m(d(ie), {
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (o) => l.$emit("cancel"))
        }, {
          default: k(() => [...t[4] || (t[4] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Xt = /* @__PURE__ */ Y(Qt, [["__scopeId", "data-v-bbe4e841"]]), _t = { class: "action-buttons" }, ea = {
  key: 0,
  role: "alert"
}, ta = {
  key: 1,
  role: "status"
}, aa = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const l = e, t = Te(), o = N(""), a = N(""), r = N(""), v = N(""), $ = N([]), y = N(0), R = N(!1), W = N(!1), I = N(!1), z = N(""), U = N(""), j = c(() => !!l.row.retired_at || l.row.state === "retired"), O = c(() => !j.value && !!l.row.ended_at), E = c(() => {
      var F;
      return O.value && ((F = l.row.job_command) == null ? void 0 : F.length) && !l.row.resume_reason;
    }), K = c(() => E.value && !W.value && (l.row.job_task_flag ? $.value.some((F) => String(F.id) === v.value) : !!a.value.trim()));
    function x(F) {
      o.value = F, a.value = "", r.value = "", v.value = "", z.value = "", U.value = "";
    }
    async function u() {
      x("job"), l.row.job_task_flag && ($.value = [], y.value = 0, R.value = !1, await Z());
    }
    async function Z() {
      if (!W.value) {
        W.value = !0;
        try {
          t.state["jobs.page"] = String(y.value + 1), await t.reload("jobs");
          const F = t.props.jobs;
          z.value = F.failure.value, z.value || ($.value = [...$.value, ...F.rows.value], y.value = F.data.value.page, R.value = F.more.value);
        } finally {
          W.value = !1;
        }
      }
    }
    async function L(F, i) {
      if (!I.value) {
        I.value = !0, z.value = "";
        try {
          const A = await t.run(F);
          z.value = A.ok ? "" : A.error, A.ok && (x(""), U.value = i);
        } finally {
          I.value = !1;
        }
      }
    }
    async function B() {
      if (!K.value) return;
      const F = l.row.job_task_flag ? [l.row.job_task_flag, v.value] : [a.value.trim()];
      await L([...l.row.job_command, String(l.row.id), ...F], "Job sent.");
    }
    async function Q() {
      !O.value || o.value !== "retire" || !r.value.trim() || await L(["agent", "retire", String(l.row.id), "--reason", r.value.trim()], "Agent retired permanently.");
    }
    return (F, i) => {
      var A;
      return j.value ? b("", !0) : (n(), s("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: i[6] || (i[6] = te(() => {
        }, ["stop"])),
        onKeydown: i[7] || (i[7] = te(() => {
        }, ["stop"]))
      }, [
        T("div", _t, [
          O.value ? (n(), s(P, { key: 0 }, [
            (A = e.row.job_command) != null && A.length ? (n(), q(d(ie), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: I.value || W.value || !E.value,
              onClick: u
            }, {
              default: k(() => [...i[8] || (i[8] = [
                f("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : b("", !0),
            e.row.role !== "main" ? (n(), q(d(ie), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: I.value || W.value,
              onClick: i[0] || (i[0] = (H) => x("retire"))
            }, {
              default: k(() => [...i[9] || (i[9] = [
                f("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : b("", !0)
          ], 64)) : b("", !0)
        ]),
        m(d(Fe), { value: o.value }, {
          job: k(() => [
            m(Zt, {
              task: v.value,
              "onUpdate:task": i[1] || (i[1] = (H) => v.value = H),
              text: a.value,
              "onUpdate:text": i[2] || (i[2] = (H) => a.value = H),
              row: e.row,
              tasks: $.value,
              pending: I.value,
              loading: W.value,
              "more-tasks": R.value,
              failure: z.value,
              "job-ready": K.value,
              onSubmit: B,
              onMore: Z,
              onCancel: i[3] || (i[3] = (H) => x(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: k(() => [
            m(Xt, {
              reason: r.value,
              "onUpdate:reason": i[4] || (i[4] = (H) => r.value = H),
              pending: I.value,
              onSubmit: Q,
              onCancel: i[5] || (i[5] = (H) => x(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        z.value ? (n(), s("p", ea, h(z.value), 1)) : b("", !0),
        U.value ? (n(), s("p", ta, h(U.value), 1)) : b("", !0)
      ], 32));
    };
  }
}, na = /* @__PURE__ */ Y(aa, [["__scopeId", "data-v-58e13d12"]]), la = { key: 0 }, oa = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" } },
  setup(e) {
    const l = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, o = c(() => l.has(t.state)), a = c(() => t.since ? `${t.doing}. ${t.since}` : t.doing);
    return (r, v) => (n(), q(d(Ce), {
      as: "button",
      place: "corner",
      class: ae(["agent-dot", { pulse: o.value }]),
      "data-state": e.state,
      "aria-label": a.value,
      "data-agent-status": "",
      onClick: v[0] || (v[0] = te(() => {
      }, ["stop"]))
    }, {
      tip: k(() => [
        T("b", null, h(e.doing), 1),
        e.since ? (n(), s("span", la, h(e.since), 1)) : b("", !0)
      ]),
      default: k(() => [
        v[1] || (v[1] = T("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, sa = /* @__PURE__ */ Y(oa, [["__scopeId", "data-v-00f06787"]]), Ue = { started: { fill: 33, words: "started" }, testing: { fill: 66, words: "being tested" }, blocked: { fill: 33, words: "blocked" } }, ra = 30, Je = (e) => e.filter((l) => l.state !== "cancelled");
function ia(e, l) {
  const t = Je(e), o = Ue[l == null ? void 0 : l.state];
  return t.length > ra ? { continuous: !0, done: t.filter((v) => v.state === "completed").length / t.length * 100, now: o ? o.fill / 100 / t.length * 100 : 0, segments: [] } : { continuous: !1, done: 0, now: 0, segments: t.map((r) => r.state === "completed" ? { kind: "done", fill: 0 } : r.id === (l == null ? void 0 : l.id) && o ? { kind: "now", fill: o.fill } : { kind: "todo", fill: 0 }) };
}
function da({ tasks: e, inHand: l, perHour: t }) {
  const o = Je(e), a = o.filter((y) => y.state === "completed").length, r = Ue[l == null ? void 0 : l.state], v = o.length - a - (l && l.state !== "completed" ? 1 : 0), $ = a === o.length;
  return {
    number: l.id,
    title: l.title,
    count: `${a} of ${o.length}`,
    taskTip: `${a} of its ${o.length} tasks done${r ? `. This one is ${r.words}.` : "."}`,
    countTip: $ ? `All ${o.length} tasks done` : `${a} done, 1 in hand, ${v} to go`,
    paceTip: !$ && t ? `About ${t} an hour.` : "",
    bar: ia(e, l)
  };
}
const ua = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, ca = {
  class: "task-line",
  "data-agent-task-line": ""
}, ga = { key: 0 }, va = ["data-state"], pa = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, state: { type: String, required: !0 }, perHour: { type: Number, default: 0 } },
  setup(e) {
    const l = e, t = c(() => l.inHand ? da({ tasks: l.tasks, inHand: l.inHand, perHour: l.perHour }) : null);
    return (o, a) => e.job && !t.value ? (n(), s("span", ua, [
      m(d(Ce), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: k(() => [
          T("b", null, h(e.job), 1)
        ]),
        default: k(() => [
          a[1] || (a[1] = f("Job", -1))
        ]),
        _: 1
      })
    ])) : t.value ? (n(), s(P, { key: 1 }, [
      T("span", ca, [
        m(d(Ce), {
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${t.value.number}`,
          "aria-label": `Task ${t.value.number}: ${t.value.title}`,
          onClick: a[0] || (a[0] = te((r) => d(Ae)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: k(() => [
            T("b", null, h(t.value.title), 1),
            T("span", null, h(t.value.taskTip), 1)
          ]),
          default: k(() => [
            f("Task " + h(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"]),
        m(d(Ce), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: k(() => [
            T("b", null, h(t.value.countTip), 1),
            t.value.paceTip ? (n(), s("span", ga, h(t.value.paceTip), 1)) : b("", !0)
          ]),
          default: k(() => [
            f(h(t.value.count), 1)
          ]),
          _: 1
        })
      ]),
      T("span", {
        class: ae(["bar", { continuous: t.value.bar.continuous }]),
        "data-state": e.state,
        style: me(t.value.bar.continuous ? { "--done": `${t.value.bar.done}%`, "--now": `${t.value.bar.now}%` } : void 0),
        "data-agent-bar": "",
        "aria-hidden": "true"
      }, [
        (n(!0), s(P, null, _(t.value.bar.segments, (r, v) => (n(), s("i", {
          key: v,
          class: ae(r.kind),
          style: me(r.kind === "now" ? { "--fill": `${r.fill}%` } : void 0)
        }, null, 6))), 128))
      ], 14, va)
    ], 64)) : b("", !0);
  }
}, ha = /* @__PURE__ */ Y(pa, [["__scopeId", "data-v-4ba2cd77"]]), fa = ["data-icon", "stroke-width", "innerHTML"], X = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const l = e, t = { right: 0, down: 90, left: 180, up: 270 }, o = {
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
      style: me({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...l.facing === "right" ? {} : { transform: `rotate(${t[l.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: a[o[e.name] || e.name] || a.dot
    }, null, 12, fa));
  }
}, ma = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, ka = {
  key: 1,
  class: "menu-item-text"
}, ba = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (l, t) => (n(), s("button", {
      type: "button",
      class: ae(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (n(), s("span", ma, h(e.checked ? "✓" : ""), 1)) : b("", !0),
      e.description ? (n(), s("span", ka, [
        T("span", null, [
          we(l.$slots, "default", {}, void 0, !0)
        ]),
        T("small", null, h(e.description), 1)
      ])) : we(l.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, fe = /* @__PURE__ */ Y(ba, [["__scopeId", "data-v-9c67fe37"]]), ya = {}, wa = { class: "menu-label" };
function Ma(e, l) {
  return n(), s("span", wa, [
    we(e.$slots, "default", {}, void 0, !0)
  ]);
}
const be = /* @__PURE__ */ Y(ya, [["render", Ma], ["__scopeId", "data-v-71c11156"]]), xa = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, $a = {
  key: 0,
  class: "skills-none"
}, Sa = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: l }) {
    const t = e, o = l, a = c(() => t.skills.filter((v) => v.state === "loaded")), r = c(() => t.skills.filter((v) => v.state !== "loaded"));
    return (v, $) => (n(), s("div", xa, [
      m(be, null, {
        default: k(() => [...$[1] || ($[1] = [
          f("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      a.value.length ? b("", !0) : (n(), s("p", $a, "None yet. Compacting the conversation empties this list.")),
      (n(!0), s(P, null, _(a.value, (y) => (n(), s("p", {
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
          default: k(() => [...$[2] || ($[2] = [
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
      ], 64)) : b("", !0),
      m(fe, {
        "data-agent-skills-browse": "",
        onClick: $[0] || ($[0] = (y) => o("browse"))
      }, {
        default: k(() => [...$[3] || ($[3] = [
          f("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Ca = /* @__PURE__ */ Y(Sa, [["__scopeId", "data-v-27140adf"]]), Aa = ["disabled", "title"], Ta = { class: "gauge usage" }, ja = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: l }) {
    const t = e, o = l, a = c(() => t.windows[0] ?? null), r = c(() => a.value ? Math.max(0, Math.min(100, Math.round(a.value.used_percent))) : null), v = c(() => r.value !== null && r.value >= 100), $ = c(() => {
      var R;
      return (R = a.value) != null && R.reset_epoch_seconds ? new Date(a.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), y = c(() => v.value ? `At usage limit: the plan's ${a.value.title} allowance is used up${$.value ? `, starts again ${$.value}` : ""}` : `${r.value}% of the plan's ${a.value.title} allowance used${$.value ? `, starts again ${$.value}` : ""}`);
    return (R, W) => r.value !== null ? (n(), s("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: y.value,
      onClick: W[0] || (W[0] = (I) => o("open", I.currentTarget))
    }, [
      m(X, {
        name: "allowance",
        size: 12
      }),
      W[1] || (W[1] = f()),
      T("span", Ta, [
        T("span", {
          style: me({ width: `${r.value}%` })
        }, null, 4)
      ]),
      f(" " + h(v.value ? "At usage limit" : `${r.value}%`), 1)
    ], 8, Aa)) : b("", !0);
  }
}, La = /* @__PURE__ */ Y(ja, [["__scopeId", "data-v-86c55a27"]]), Ra = (e, l, t) => Math.max(l, Math.min(t, e)), Ge = /* @__PURE__ */ new WeakMap(), Ba = (e, l) => Ge.set(e, l);
function Va(e, l) {
  for (let t = l; t; t = Ge.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function Ia(e, l) {
  const t = (o) => {
    var r, v;
    const a = ((r = e.value) == null ? void 0 : r.element) || ((v = e.value) == null ? void 0 : v.$el) || e.value;
    a && !Va(a, o.target) && l(o);
  };
  window.addEventListener("click", t), ye(() => window.removeEventListener("click", t));
}
const he = 8, za = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: l, emit: t }) {
    const o = e, a = N(null), r = (g) => g ? `${g}px` : void 0, v = c(() => ({
      minWidth: r(o.minWidth),
      maxWidth: r(o.maxWidth),
      maxHeight: r(o.maxHeight),
      height: r(o.height)
    })), $ = N({ w: 0, h: 0 }), y = N(o.anchor ? o.anchor.getBoundingClientRect() : null), R = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), W = (g) => ({
      left: Math.max(0, g.left),
      top: Math.max(0, g.top),
      right: Math.min(window.innerWidth, g.right),
      bottom: Math.min(window.innerHeight, g.bottom)
    }), I = (g) => {
      const S = g.closest(".pane, .float-window");
      return S ? W(S.getBoundingClientRect()) : R();
    }, z = (g, S) => `${Math.max(0, g ? Math.min(g, S) : S)}px`;
    function U(g, S) {
      return {
        below: g.bottom - S.bottom - o.gap - he,
        above: S.top - g.top - o.gap - he,
        across: g.right - g.left - 2 * he
      };
    }
    function j(g) {
      const S = I(o.anchor), D = U(S, g);
      return $.value.w <= D.across && $.value.h <= Math.max(D.below, D.above) ? S : R();
    }
    const O = c(() => {
      if (!y.value) return v.value;
      const g = y.value, S = j(g), D = U(S, g), { w: p, h: C } = $.value, ee = o.align === "auto" ? g.left + g.right > S.left + S.right : o.align === "right", le = Ra(ee ? g.right - p : g.left, S.left + he, Math.max(S.left + he, S.right - p - he)), G = C > D.below && D.above > D.below ? { bottom: `${window.innerHeight - g.top + o.gap}px`, maxHeight: z(o.maxHeight, D.above) } : { top: `${g.bottom + o.gap}px`, maxHeight: z(o.maxHeight, D.below) };
      return { ...v.value, ...G, left: `${le}px`, maxWidth: z(o.maxWidth, D.across) };
    }), E = t, K = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function x(g) {
      const S = K(), D = S.indexOf(document.activeElement);
      S[(D + g + S.length) % S.length].focus();
    }
    const u = { ArrowDown: () => x(1), ArrowUp: () => x(-1), Escape: () => E("close") }, Z = (g) => u[g.key] && (g.preventDefault(), u[g.key]()), L = () => a.value && ($.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let B = 0;
    const Q = new ResizeObserver(() => {
      cancelAnimationFrame(B), B = requestAnimationFrame(L);
    });
    Ia(a, (g) => o.anchor && !o.anchor.contains(g.target) && E("close"));
    const F = (g, S) => ["top", "left", "right", "bottom"].some((D) => Math.abs(g[D] - S[D]) > 1), i = (g) => g.bottom < 0 || g.top > window.innerHeight;
    let A = 0;
    function H() {
      if (o.anchor) {
        const g = o.anchor.getBoundingClientRect();
        if (!o.anchor.isConnected || i(g)) return E("close");
        F(g, y.value) && (y.value = g);
      }
      A = requestAnimationFrame(H);
    }
    return tt(() => {
      o.anchor && a.value && Ba(a.value, o.anchor), L(), a.value && Q.observe(a.value), !o.plain && K()[0] && K()[0].focus(), H();
    }), ye(() => {
      Q.disconnect(), cancelAnimationFrame(A), cancelAnimationFrame(B);
    }), l({ element: a }), (g, S) => (n(), q(at, {
      to: "body",
      disabled: !e.anchor
    }, [
      T("div", nt({
        ref_key: "panel",
        ref: a
      }, g.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: O.value,
        onKeydown: Z
      }), [
        we(g.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Oa = /* @__PURE__ */ Y(za, [["__scopeId", "data-v-7f046e0d"]]);
async function Ea(e, l, t) {
  if (!e) return t(l);
  const { target: o, fields: a } = e, r = Object.fromEntries(Object.keys(a).map((y) => [y, o[y]])), v = () => Object.assign(o, r);
  Object.assign(o, a);
  let $ = !1;
  try {
    const y = await t(l);
    return $ = y.ok, y;
  } finally {
    $ || v();
  }
}
function Ha(e, l, t, { groups: o, programs: a }) {
  const r = N({}), v = N(""), $ = N(!1), y = c(() => !!e.value && !e.value.ended_at), R = c(() => y.value && !!e.value.paused_at);
  async function W(j, O = null) {
    v.value = "";
    const E = await Ea(O, j, l);
    return v.value = E.ok ? "" : E.error, t(), E;
  }
  return { groups: o, programs: a, chosen: r, failure: v, asking: $, running: y, paused: R, choose: (j, O) => W(["agent", "control", String(e.value.id), j, O.value], { target: r, fields: { value: { ...r.value, [j]: O.label } } }), stop: () => ($.value = !1, W(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (j) => W(["agent", "launch", j.name]) };
}
function Na(e) {
  if (!e) return "Not compacted yet";
  const l = new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return e.start_percent === null ? `Last compacted ${l}` : e.end_percent === null ? `Last compacted ${l}, from ${e.start_percent}%` : `Last compacted ${l}, from ${e.start_percent}% to ${e.end_percent}%, ${e.start_percent - e.end_percent}% taken off`;
}
const Wa = ["disabled", "title"], qa = ["disabled", "title"], Da = { class: "gauge" }, Fa = ["disabled", "title"], Pa = ["disabled"], Ua = ["disabled"], Ja = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Ga = ["title"], Ka = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Za = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Ya = { class: "gauge" }, Qa = { class: "context-used" }, Xa = 75, _a = {
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
    const t = e, o = l, a = Ha(je(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => o("changed"), { groups: je(t, "controlGroups"), programs: je(t, "agentPrograms") }), r = N(null), v = N(""), $ = c(() => a.groups.value.find((x) => x.key === v.value));
    function y(x, u) {
      r.value = x.currentTarget, v.value = u;
    }
    function R() {
      r.value = null, v.value = "", a.asking.value = !1;
    }
    const W = c(() => t.skills.filter((x) => x.state === "loaded"));
    function I(x) {
      y(x, "skills"), o("skills");
    }
    const z = (x) => a.groups.value.some((u) => u.key === x), U = c(() => {
      var x;
      return a.chosen.value.model ?? ((x = O.value) == null ? void 0 : x.model) ?? "";
    }), j = c(() => {
      var x;
      return a.chosen.value.effort ?? ((x = O.value) == null ? void 0 : x.effort) ?? "";
    });
    c(() => !!t.agent && !t.agent.ended_at);
    const O = c(() => {
      var x;
      return ((x = t.usage.agents) == null ? void 0 : x.find((u) => {
        var Z;
        return u.id === ((Z = t.agent) == null ? void 0 : Z.id);
      })) ?? null;
    }), E = c(() => {
      var x;
      return ((x = O.value) == null ? void 0 : x.context_percent) == null ? null : Math.round(O.value.context_percent);
    }), K = c(() => {
      var x;
      return (x = O.value) != null && x.cost_dollars ? `$${O.value.cost_dollars.toFixed(2)}` : "";
    });
    return (x, u) => {
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
            onClick: u[0] || (u[0] = (L) => y(L, "agent"))
          }, [
            m(X, {
              name: "agents",
              size: 12
            }),
            f(" " + h(((Z = e.agentPrograms.find((L) => L.name === e.agent.program)) == null ? void 0 : Z.title) || e.agent.program), 1)
          ], 8, Wa),
          m(La, {
            windows: e.usage.windows,
            onOpen: u[1] || (u[1] = (L) => o("open", "usage", L))
          }, null, 8, ["windows"]),
          E.value !== null ? (n(), s("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${E.value}% full: clear or compact it`,
            onClick: u[2] || (u[2] = (L) => z("context") ? y(L, "context") : o("open", "context", L.currentTarget))
          }, [
            m(X, {
              name: "gauge",
              size: 12
            }),
            u[14] || (u[14] = f()),
            T("span", Da, [
              T("span", {
                style: me({ width: `${E.value}%` })
              }, null, 4)
            ]),
            f(" " + h(E.value) + "% ", 1)
          ], 8, qa)) : b("", !0),
          U.value ? (n(), s("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${U.value}: change the model`,
            onClick: u[3] || (u[3] = (L) => z("model") ? y(L, "model") : null)
          }, [
            m(X, {
              name: "model",
              size: 12
            }),
            f(" " + h(U.value), 1)
          ], 8, Fa)) : b("", !0),
          z("effort") || e.card && j.value ? (n(), s("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: u[4] || (u[4] = (L) => y(L, "effort"))
          }, [
            m(X, {
              name: "bolt",
              size: 12
            }),
            f(" " + h(j.value), 1)
          ], 8, Pa)) : b("", !0),
          K.value ? (n(), s("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: u[5] || (u[5] = (L) => o("open", "cost", L.currentTarget))
          }, h(K.value), 9, Ua)) : b("", !0),
          e.branch ? (n(), s("span", Ja, [
            m(X, {
              name: "branch",
              size: 12
            }),
            f(" " + h(e.branch), 1)
          ])) : b("", !0),
          e.card ? b("", !0) : (n(), s("button", {
            key: 5,
            type: "button",
            class: ae(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: u[6] || (u[6] = (L) => o("open", "jobs", L.currentTarget))
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
            onClick: I
          }, [
            m(X, {
              name: "book",
              size: 12
            }),
            f(" " + h(W.value.length), 1)
          ])) : b("", !0),
          e.fitness ? (n(), s(P, { key: 7 }, [
            T("button", {
              type: "button",
              class: ae(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Xa }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: u[7] || (u[7] = (L) => o("open", "fitness", L.currentTarget))
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
              onClick: u[8] || (u[8] = (L) => o("open", "load", L.currentTarget))
            }, [
              m(X, {
                name: "weight",
                size: 12
              }),
              f(" " + h(e.fitness.workload), 1)
            ], 2)
          ], 64)) : b("", !0)
        ], 64)) : e.run && !e.loading ? (n(), s("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: u[9] || (u[9] = (L) => y(L, "start"))
        }, [
          m(X, {
            name: "agents",
            size: 12
          }),
          u[15] || (u[15] = f(" Start an agent", -1))
        ])) : b("", !0),
        u[21] || (u[21] = T("span", { class: "space" }, null, -1)),
        d(a).failure.value ? (n(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: d(a).failure.value
        }, h(d(a).failure.value), 9, Ga)) : b("", !0),
        we(x.$slots, "default", {}, void 0, !0),
        r.value ? (n(), q(Oa, {
          key: 3,
          anchor: r.value,
          "min-width": 190,
          onClose: R
        }, {
          default: k(() => {
            var L;
            return [
              v.value === "agent" ? (n(), s(P, { key: 0 }, [
                d(a).asking.value ? (n(), s(P, { key: 0 }, [
                  m(be, { "data-agent-stop-ask": "" }, {
                    default: k(() => [...u[16] || (u[16] = [
                      f("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  m(fe, {
                    "data-agent-stop-confirm": "",
                    onClick: u[10] || (u[10] = (B) => (R(), d(a).stop()))
                  }, {
                    default: k(() => [...u[17] || (u[17] = [
                      f("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  m(fe, {
                    onClick: u[11] || (u[11] = (B) => d(a).asking.value = !1)
                  }, {
                    default: k(() => [...u[18] || (u[18] = [
                      f("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (n(), q(fe, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: u[12] || (u[12] = (B) => d(a).asking.value = !0)
                }, {
                  default: k(() => [...u[19] || (u[19] = [
                    f("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : v.value === "start" ? (n(), s(P, { key: 1 }, [
                m(be, null, {
                  default: k(() => [...u[20] || (u[20] = [
                    f("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (n(!0), s(P, null, _(d(a).programs.value, (B) => (n(), q(fe, {
                  key: B.name,
                  "data-agent-program": B.name,
                  onClick: (Q) => (R(), d(a).start(B))
                }, {
                  default: k(() => [
                    f(h(B.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : v.value === "skills" ? (n(), q(Ca, {
                key: 2,
                skills: e.skills,
                onBrowse: u[13] || (u[13] = (B) => (R(), o("open", "skills", null)))
              }, null, 8, ["skills"])) : $.value ? (n(), s(P, { key: 3 }, [
                m(be, null, {
                  default: k(() => [
                    f(h($.value.label), 1)
                  ]),
                  _: 1
                }),
                v.value === "context" ? (n(), s(P, { key: 0 }, [
                  T("p", Ka, h(d(Na)(((L = O.value) == null ? void 0 : L.last_compaction) ?? null)), 1),
                  T("div", Za, [
                    T("span", Ya, [
                      T("span", {
                        style: me({ width: `${E.value}%` })
                      }, null, 4)
                    ]),
                    T("span", Qa, h(E.value) + "%", 1)
                  ])
                ], 64)) : b("", !0),
                (n(!0), s(P, null, _($.value.choices, (B) => (n(), q(fe, {
                  key: B.value,
                  "data-agent-choice": B.value,
                  onClick: (Q) => (d(a).choose($.value.key, B), R())
                }, {
                  default: k(() => [
                    f(h(B.label), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-choice", "onClick"]))), 128))
              ], 64)) : b("", !0)
            ];
          }),
          _: 1
        }, 8, ["anchor"])) : b("", !0)
      ], 2);
    };
  }
}, en = /* @__PURE__ */ Y(_a, [["__scopeId", "data-v-cf9b0b9a"]]), tn = ["data-agent-open", "aria-expanded", "role", "tabindex"], an = { class: "agent-head" }, nn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, ln = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, on = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, sn = { class: "agent-line" }, rn = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, dn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, un = {
  key: 1,
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, cn = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, gn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), o = { helper: "Helper", reviewer: "Reviewer" }, a = e, r = l, v = Pe(), $ = c(() => {
      var C, ee;
      if ((C = a.facts) != null && C.profile_title) return a.facts.profile_title;
      if ((ee = a.facts) != null && ee.profile) return a.facts.profile;
      const p = o[a.row.role] || a.row.role;
      return p.slice(0, 1).toUpperCase() + p.slice(1);
    }), y = c(() => {
      var p;
      return ((p = a.facts) == null ? void 0 : p.tasks) ?? [];
    }), R = c(() => y.value.filter((p) => p.state === "open")), W = c(() => y.value.find((p) => {
      var C;
      return p.id === ((C = a.progress) == null ? void 0 : C.task_id) && p.state === "started";
    })), I = c(() => W.value || y.value.find((p) => {
      var C;
      return p.id === ((C = a.facts) == null ? void 0 : C.task_id);
    }) || y.value.find((p) => t.has(p.state)) || R.value[0] || y.value.at(-1)), z = c(() => {
      var p, C, ee, le, oe, G;
      return a.row.role === "helper" ? ((p = a.facts) == null ? void 0 : p.helper_job) || "" : (C = a.facts) != null && C.job_enabled && (((ee = W.value) == null ? void 0 : ee.title) || ((le = a.facts) == null ? void 0 : le.task_title) || ((oe = R.value[0]) == null ? void 0 : oe.title) || ((G = y.value.at(-1)) == null ? void 0 : G.title)) || "";
    }), U = c(() => {
      var p;
      return (p = a.facts) != null && p.job_enabled ? `${a.row.role} ${a.row.id}` : "";
    }), j = c(() => {
      var p, C;
      return [a.row.program, (p = a.facts) == null ? void 0 : p.model, (C = a.facts) == null ? void 0 : C.effort, U.value].filter(Boolean).join(" · ");
    }), O = Te(), E = c(() => vt(a.row.process_started_at || a.row.created_at, v.value)), K = /* @__PURE__ */ new Set(["open", "started", "testing"]), x = c(() => {
      var p;
      return (p = a.facts) == null ? void 0 : p.work_status;
    }), u = c(() => !!a.row.ended_at && a.row.role !== "main" && y.value.some((p) => K.has(p.state))), Z = c(() => {
      var p, C;
      return a.row.state === "running" && ((p = a.facts) == null ? void 0 : p.state) === "at usage limit" && !!((C = a.facts) != null && C.limited_until);
    }), L = c(() => `At usage limit: starts again ${new Date(a.facts.limited_until).toLocaleString()}`), B = c(() => {
      var p;
      return a.row.retired_at || a.row.state === "retired" ? "retired" : Z.value || x.value || a.waitReason || u.value ? "waiting" : a.row.state === "running" && ((p = a.facts) == null ? void 0 : p.state) || a.row.state;
    }), Q = c(() => {
      var p;
      return Z.value ? L.value : x.value ? `Status: ${x.value}` : a.waitReason ? `Waiting: ${a.waitReason}` : B.value === "blocked" ? (p = a.facts) != null && p.blocked_reason ? `Blocked: ${a.facts.blocked_reason}` : "Blocked" : u.value ? "Stopped with work left" : "";
    }), F = c(() => {
      var p;
      return ((p = a.progress) == null ? void 0 : p.completed_count) ?? y.value.filter((C) => C.state === "completed").length;
    }), i = c(() => {
      var p;
      return pt(F.value, ((p = a.progress) == null ? void 0 : p.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, v.value);
    }), A = c(() => a.row.role === "main" ? 0 : i.value), H = c(() => !!a.row.retired_at || a.row.state === "retired"), g = c(() => H.value ? "Retired" : B.value === "blocked" || B.value === "waiting" ? Q.value || (B.value === "blocked" ? "Blocked" : "Waiting") : a.row.ended_at ? "Idle: its process has stopped" : "Working"), S = c(() => {
      var C;
      if (H.value) return a.row.retired_at;
      const p = B.value === "blocked" || B.value === "waiting";
      return a.row.ended_at || p && ((C = a.facts) == null ? void 0 : C.last_activity) || a.row.process_started_at || a.row.created_at;
    }), D = c(() => S.value ? `Since ${new Date(S.value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${ht(S.value, v.value)}` : "");
    return (p, C) => {
      var ee, le, oe, G, ke, se;
      return n(), s("div", {
        class: ae(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: C[2] || (C[2] = (de) => !e.open && r("toggle")),
        onKeydown: [
          C[3] || (C[3] = Ee(te((de) => !e.open && r("toggle"), ["self", "prevent"]), ["enter"])),
          C[4] || (C[4] = Ee(te((de) => !e.open && r("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        T("span", an, [
          e.open ? (n(), s("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: C[0] || (C[0] = te((de) => r("toggle"), ["stop"]))
          }, [
            m(d(Re), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : b("", !0),
          T("span", nn, h($.value), 1),
          T("span", ln, h(((ee = e.facts) == null ? void 0 : ee.given_name) || e.row.id), 1),
          e.open ? b("", !0) : (n(), q(d(Re), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          e.open ? (n(), s("span", on, h(E.value), 1)) : b("", !0)
        ]),
        T("span", sn, [
          T("span", rn, h(j.value), 1),
          (le = e.facts) != null && le.sandbox_off ? (n(), s("span", dn, "sandbox off")) : b("", !0),
          e.open ? (n(), s("span", un, [
            C[5] || (C[5] = f("Started ", -1)),
            m(d(Ne), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : b("", !0),
          e.open && ((oe = e.facts) != null && oe.last_activity) ? (n(), s("span", cn, [
            C[6] || (C[6] = f("Last heard ", -1)),
            m(d(Ne), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : b("", !0)
        ]),
        e.open ? (n(), q(en, {
          key: 0,
          "agent-programs": d(O).props.programs.rows.value,
          agent: e.row,
          branch: (G = e.progress) == null ? void 0 : G.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((ke = e.facts) == null ? void 0 : ke.windows) ?? [] },
          card: ""
        }, {
          default: k(() => [
            m(na, { row: e.row }, null, 8, ["row"]),
            e.row.role === "helper" && !e.row.ended_at ? (n(), q(d(ie), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: C[1] || (C[1] = te((de) => d(O).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: k(() => [...C[7] || (C[7] = [
                f("Stop", -1)
              ])]),
              _: 1
            })) : b("", !0)
          ]),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : b("", !0),
        e.open ? b("", !0) : (n(), q(ha, {
          key: 1,
          tasks: y.value,
          "in-hand": e.row.role !== "helper" && ((se = e.facts) != null && se.job_enabled) && I.value || null,
          job: e.row.role === "helper" ? z.value : "",
          state: B.value,
          "per-hour": A.value
        }, null, 8, ["tasks", "in-hand", "job", "state", "per-hour"])),
        m(sa, {
          state: B.value,
          doing: g.value,
          since: D.value
        }, null, 8, ["state", "doing", "since"]),
        e.open ? (n(), q(qt, {
          key: 2,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: y.value,
          "stopped-with-work": u.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : b("", !0)
      ], 42, tn);
    };
  }
}, vn = /* @__PURE__ */ Y(gn, [["__scopeId", "data-v-b337f23b"]]), pn = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, hn = ["data-agent-row", "data-agent-lingering"], We = "journal.agents.filters", qe = 300 * 1e3, Se = "cubic-bezier(0.2, 0.9, 0.25, 1)", fn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const l = e, t = Te(), { rows: o } = t.props.waits, { rows: a } = t.props.progress, { rows: r, failure: v, loaded: $, more: y } = t.props.agents, R = (M) => a.value.find((V) => V.agent_id === M.id) ?? null, W = (M) => {
      var V;
      return ((V = o.value.find((w) => w.agent_id === M.id)) == null ? void 0 : V.reason) ?? "";
    }, I = N("running"), z = N(""), U = JSON.parse(localStorage.getItem(We) || '{"roles":[],"profiles":[],"programs":[]}'), j = N(U), O = c(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: E } = t.props.programs, K = c(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), x = (M, V) => {
      j.value = bt(j.value, M, V);
    }, u = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, Z = (M) => M.slice(0, 1).toUpperCase() + M.slice(1);
    re(j, (M) => localStorage.setItem(We, JSON.stringify(M)));
    const L = N(25);
    function B() {
      Object.assign(t.state, {
        "agents.show": I.value,
        "agents.search": z.value,
        "agents.limit": String(L.value),
        "agents.roles": j.value.roles.join(","),
        "agents.profiles": j.value.profiles.join(","),
        "agents.programs": j.value.programs.join(",")
      });
    }
    async function Q() {
      return L.value += 25, B(), await t.reload("agents"), !0;
    }
    re([I, z, j], () => {
      L.value = 25, B(), t.reload("agents");
    }), B();
    const F = (M) => M.facts ?? null, i = r, A = Pe(), H = N([]), g = c(() => new Set(H.value.filter((M) => A.value - M.left < qe).map((M) => M.row.id))), S = c(() => H.value.filter((M) => g.value.has(M.row.id)).map((M) => M.row)), D = c(() => [...i.value, ...S.value]);
    let p = "", C = [];
    async function ee(M) {
      await t.reload(`card.${M.id}`);
      const V = t.props[`card.${M.id}`].rows.value.find((w) => w.id === M.id);
      V != null && V.ended_at && !H.value.some((w) => w.row.id === M.id) && (H.value = [...H.value, { row: V, left: Date.now() }]);
    }
    re(r, (M) => {
      const V = p === `${I.value}|${z.value}|${JSON.stringify(j.value)}` && I.value === "running", w = V ? C.filter((J) => !M.some((ue) => ue.id === J.id)) : [];
      p = `${I.value}|${z.value}|${JSON.stringify(j.value)}`, C = M, H.value = V ? H.value.filter((J) => A.value - J.left < qe && !M.some((ue) => ue.id === J.row.id)) : [], w.forEach(ee);
    }, { immediate: !0 });
    const le = c(() => !!z.value.trim() || K.value > 0), oe = c(() => l.texts[I.value] ?? { title: l.empty, hint: "" }), G = N(null), ke = N(null), se = N(null), de = N(null), ge = c(() => G.value === null ? null : t.props[`card.${G.value}`].rows.value.find((M) => M.id === G.value) ?? ke.value), Ve = c(() => ge.value ? [ge.value] : D.value), Me = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ve = !1, Ie = 0;
    async function Ke(M) {
      if (ve) return;
      ve = !0, Ie = de.value.scrollTop;
      const V = se.value.querySelector(`[data-agent-open="${M.id}"]`);
      if (!Me()) {
        const ce = [...se.value.querySelectorAll(".agent-row")].filter((ne) => !ne.contains(V));
        await Promise.all(ce.map((ne) => ne.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const w = [...V.querySelectorAll(".agent-head, .agent-line")], J = [...w, ...V.querySelectorAll("[data-agent-motion]")], ue = J.map((ce) => ce.getBoundingClientRect());
      if (ke.value = M, G.value = M.id, t.reload(`card.${M.id}`), await He(), !Me()) {
        const ce = J.map((ne) => ne.getBoundingClientRect());
        J.forEach((ne, xe) => {
          const pe = w.indexOf(ne.parentElement), Ye = ue[xe].left - ce[xe].left - (pe < 0 ? 0 : ue[pe].left - ce[pe].left), Qe = ue[xe].top - ce[xe].top - (pe < 0 ? 0 : ue[pe].top - ce[pe].top);
          ne.animate([{ transform: `translate(${Ye}px, ${Qe}px)` }, { transform: "none" }], { duration: 280, easing: Se });
        }), se.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((ne) => {
          ne.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Se, fill: "backwards" });
        });
      }
      ve = !1;
    }
    async function ze() {
      if (ve || !ge.value) return;
      ve = !0;
      const M = se.value.querySelector(`[data-agent-open="${G.value}"]`), V = [...M.children], w = Me() ? [] : V.map((J) => J.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(w.map((J) => J.finished)), G.value = null, await He(), de.value.scrollTop = Ie, w.forEach((J) => J.cancel()), Me() || (M.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Se }), se.value.querySelectorAll(".agent-row").forEach((J) => {
        J.contains(M) || J.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Se });
      })), ve = !1;
    }
    const Ze = (M) => G.value === M.id ? ze() : Ke(M);
    re(z, (M) => M.trim() && (G.value = null)), re(I, () => {
      G.value = null;
    });
    const Oe = (M) => {
      M.key === "Escape" && ze();
    };
    return window.addEventListener("keydown", Oe), ye(() => window.removeEventListener("keydown", Oe)), (M, V) => (n(), s("div", {
      ref_key: "agents",
      ref: se,
      class: ae(["agents", { focused: ge.value }])
    }, [
      m(d(ft), {
        modelValue: z.value,
        "onUpdate:modelValue": V[1] || (V[1] = (w) => z.value = w),
        placeholder: "Search agents",
        "menu-count": K.value,
        "data-agents-search": ""
      }, {
        menu: k(() => [
          m(d(Le), null, {
            default: k(() => [...V[2] || (V[2] = [
              f("Type", -1)
            ])]),
            _: 1
          }),
          (n(!0), s(P, null, _(O.value.roles, (w) => (n(), q(d($e), {
            key: w,
            role: "menuitemcheckbox",
            "aria-checked": j.value.roles.includes(w),
            checked: j.value.roles.includes(w),
            "data-filter-role": w,
            onClick: (J) => x("roles", w)
          }, {
            default: k(() => [
              f(h(Z(w)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          O.value.profiles.length ? (n(), q(d(Le), { key: 0 }, {
            default: k(() => [...V[3] || (V[3] = [
              f("Profile", -1)
            ])]),
            _: 1
          })) : b("", !0),
          (n(!0), s(P, null, _(O.value.profiles, (w) => (n(), q(d($e), {
            key: w.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.profiles.includes(w.name),
            checked: j.value.profiles.includes(w.name),
            "data-filter-profile": w.name,
            onClick: (J) => x("profiles", w.name)
          }, {
            default: k(() => [
              f(h(w.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          m(d(Le), null, {
            default: k(() => [...V[4] || (V[4] = [
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
            default: k(() => [
              f(h(w.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          K.value ? (n(), q(d($e), {
            key: 1,
            "data-filter-clear": "",
            onClick: u
          }, {
            default: k(() => [...V[5] || (V[5] = [
              f("Clear filters", -1)
            ])]),
            _: 1
          })) : b("", !0)
        ]),
        default: k(() => [
          m(d(mt), {
            options: O.value.states,
            value: I.value,
            onPick: V[0] || (V[0] = (w) => I.value = w)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      I.value === "retired" && O.value.upgrade_retired ? (n(), s("p", pn, "Retired during the upgrade: " + h(O.value.upgrade_retired), 1)) : b("", !0),
      T("div", {
        ref_key: "list",
        ref: de,
        class: ae(["agents-view", { "agents-view-open": ge.value }])
      }, [
        d($) && !d(v) && !Ve.value.length && K.value ? (n(), q(d(Be), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: k(() => [
            m(d(ie), {
              small: "",
              "data-empty-clear": "",
              onClick: u
            }, {
              default: k(() => [...V[6] || (V[6] = [
                f("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (n(), q(d(kt), {
          key: 1,
          rows: Ve.value,
          failure: d(v),
          loaded: d($),
          more: !ge.value && d(y),
          older: Q,
          empty: oe.value.title,
          hint: oe.value.hint,
          searching: le.value
        }, {
          default: k(({ row: w }) => [
            T("div", {
              class: ae(["agent-row", { lingering: g.value.has(w.id) && w.id !== G.value }]),
              "data-agent-row": w.id,
              "data-agent-lingering": g.value.has(w.id) ? "" : null
            }, [
              m(vn, {
                row: w,
                facts: F(w),
                progress: R(w),
                "wait-reason": W(w),
                open: w.id === G.value,
                onToggle: (J) => Ze(w)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, hn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, yn = /* @__PURE__ */ Y(fn, [["__scopeId", "data-v-0478a40e"]]);
export {
  yn as A
};
