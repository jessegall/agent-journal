/* @code-commandments-generated */
import { openBlock as n, createElementBlock as o, withModifiers as re, unref as r, createTextVNode as h, toDisplayString as g, createVNode as M, createBlock as U, withCtx as $, Fragment as z, renderList as ee, createElementVNode as v, createCommentVNode as k, computed as f, ref as I, watch as ce, onUnmounted as we, defineAsyncComponent as nt, createSlots as lt, resolveDynamicComponent as ot, normalizeClass as ne, normalizeStyle as pe, renderSlot as Me, onMounted as st, Teleport as it, mergeProps as rt, toRef as Le, withKeys as He, useModel as ut, mergeModels as dt, nextTick as We } from "vue";
import { peekRef as je, Icon as $e, RunningCommand as ct, FoldGroup as Pe, TaskStatusIcon as vt, useWindow as ye, loadWindowComponent as gt, coalesced as pt, READ_RATES as ft, InnerTabs as mt, TabBody as ht, SwitchCase as Ue, EmptyState as Oe, Btn as ae, TextArea as kt, TextInput as yt, HoverTip as Te, useNow as Ie, age as Je, perHour as bt, ago as wt, TimeAgo as qe, Dialog as Mt, SearchBar as $t, Segmented as xt, MenuLabel as Re, MenuItem as Se, RowList as Ct, toggleFilter as St } from "@journal/window-kit";
import { _ as X, T as At } from "./TranscriptRows-CG9aRNTl.js";
const Tt = {
  class: "agent-command",
  "data-agent-command": ""
}, jt = {
  key: 1,
  "data-agent-stopped": ""
}, Lt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (l, a) => (n(), o("span", Tt, [
      e.waitReason ? (n(), o("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: a[0] || (a[0] = re((s) => r(je)("test_queue:0"), ["stop"]))
      }, [
        h("Waiting: " + g(e.waitReason) + " ", 1),
        M(r($e), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (n(), o("span", jt, "Waiting")) : (n(), U(r(ct), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, Rt = /* @__PURE__ */ X(Lt, [["__scopeId", "data-v-1b371fb5"]]), Ot = ["data-agent-delegated", "onClick"], Bt = { class: "agent-task-number" }, It = { class: "agent-task-title" }, zt = ["title"], Vt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const a = l;
    return (s, t) => (n(), U(r(Pe), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: t[0] || (t[0] = (i) => a("toggle"))
    }, {
      default: $(() => [
        (n(!0), o(z, null, ee(e.section.tasks, (i) => (n(), o("button", {
          key: i.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": i.id,
          onClick: (d) => r(je)(`tasks:${i.id}`)
        }, [
          M(r(vt), {
            status: i.state
          }, null, 8, ["status"]),
          v("span", Bt, g(i.id), 1),
          v("span", It, g(i.title), 1),
          i.plan_id ? (n(), o("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${i.plan_id}: ${i.plan_title}`
          }, "Plan " + g(i.plan_id) + ": " + g(i.plan_title), 9, zt)) : k("", !0)
        ], 8, Ot))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Et = /* @__PURE__ */ X(Vt, [["__scopeId", "data-v-238ff959"]]), Nt = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Ht = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Wt = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, qt = ["data-peek", "onClick"], Dt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ft = {
  key: 0,
  class: "agent-helper-brief"
}, Pt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ut = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Jt = "It ended without a report", Kt = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const l = e, a = ["started", "blocked", "open", "completed"], s = f(() => {
      var p, O;
      return l.row.ended_at && ((O = (p = l.facts) == null ? void 0 : p.job_returned) != null && O.startsWith(Jt)) ? l.facts.job_returned : "";
    }), t = f(() => l.tasks.length ? a.map((p) => ({ state: p, label: p.slice(0, 1).toUpperCase() + p.slice(1), tasks: l.tasks.filter((O) => O.state === p || p === "started" && O.state === "testing" || p === "completed" && O.state === "cancelled") })) : []), i = /* @__PURE__ */ new Set(["completed"]), d = I({}), x = (p) => !(d.value[p] ?? i.has(p)), y = (p) => d.value = { ...d.value, [p]: x(p) }, A = ye(), { rows: E } = A.props.reports;
    A.state["reports.agent"] = String(l.row.id);
    const q = f(() => l.row.access === "read-only"), V = f(() => !!l.row.retired_at || l.row.state === "retired"), J = ["tasks", "transcript", "terminal", "file-feed", "reports"], j = f(() => (V.value ? A.tabs.filter((O) => ["reports", "transcript"].includes(O.key)) : q.value ? A.tabs.filter((O) => ["reports", "transcript", "terminal"].includes(O.key)) : [...A.tabs]).sort((O, D) => (J.indexOf(O.key) < 0 ? J.length : J.indexOf(O.key)) - (J.indexOf(D.key) < 0 ? J.length : J.indexOf(D.key)))), N = () => q.value || V.value ? j.value.find((p) => p.key === "transcript") : j.value[0], H = I(N());
    ce(H, (p) => {
      A.state.tab = (p == null ? void 0 : p.key) ?? "";
    }, { immediate: !0 }), we(() => {
      A.state.tab = "";
    }), ce(j, (p) => {
      p.some((O) => {
        var D;
        return O.key === ((D = H.value) == null ? void 0 : D.key);
      }) || (H.value = p[0]);
    }), ce(() => l.open, (p) => {
      p && (H.value = N());
    });
    const Y = Object.fromEntries(A.tabs.filter((p) => p.component).map((p) => [p.key, nt(() => gt(p.component))])), T = I(!1), { data: m } = A.props.tool, K = f(() => {
      var p;
      return ((p = m.value) == null ? void 0 : p.tool) ?? "";
    }), B = f(() => {
      var p;
      return ((p = m.value) == null ? void 0 : p.note) ?? "";
    }), W = f(() => l.row.role !== "main" && (!l.row.ended_at || l.stoppedWithWork || l.waitReason));
    async function te() {
      !l.open || !W.value || (A.state["tool.agent"] = String(l.row.id), await A.reload("tool"));
    }
    const Z = A.follow(["hook_call.*", "process_part.*"], pt(te, ft.agentCommand));
    return we(() => Z == null ? void 0 : Z()), ce(() => l.open, (p) => {
      p && te();
    }, { immediate: !0 }), (p, O) => {
      var D;
      return n(), o("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: O[2] || (O[2] = re(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (n(), o("p", Nt, "Retirement reason: " + g(e.row.retirement_reason), 1)) : k("", !0),
        e.row.resume_reason ? (n(), o("p", Ht, g(e.row.resume_reason), 1)) : k("", !0),
        W.value ? (n(), U(Rt, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: K.value,
          note: B.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : k("", !0),
        s.value ? (n(), o("p", Wt, g(s.value), 1)) : k("", !0),
        M(r(mt), {
          class: "agent-tabs",
          tabs: j.value,
          active: H.value,
          answer: { tasks: e.tasks.length, reports: r(E).length },
          onChoose: O[0] || (O[0] = (b) => H.value = b)
        }, null, 8, ["tabs", "active", "answer"]),
        M(r(ht), {
          class: "agent-tab-body",
          tab: H.value,
          "data-agent-tab-body": (D = H.value) == null ? void 0 : D.key
        }, {
          default: $(() => {
            var b;
            return [
              M(r(Ue), {
                value: (b = H.value) == null ? void 0 : b.key
              }, lt({
                reports: $(() => [
                  r(E).length ? k("", !0) : (n(), U(r(Oe), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: $(() => [...O[3] || (O[3] = [
                      h("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (n(!0), o(z, null, ee(r(E), (R) => (n(), o("button", {
                    key: R.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${R.id}`,
                    onClick: (G) => r(je)(`messages:${R.id}`)
                  }, g(R.text), 9, qt))), 128))
                ]),
                tasks: $(() => {
                  var R;
                  return [
                    e.tasks.length ? k("", !0) : (n(), U(r(Oe), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: $(() => [...O[4] || (O[4] = [
                        h("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (n(!0), o(z, null, ee(t.value, (G) => (n(), U(Et, {
                      key: G.state,
                      section: G,
                      open: x(G.state),
                      onToggle: (C) => y(G.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (R = e.facts) != null && R.instruction ? (n(), o(z, { key: 1 }, [
                      O[5] || (O[5] = v("p", { class: "agent-label" }, "Instruction", -1)),
                      v("div", Dt, g(e.facts.instruction), 1)
                    ], 64)) : k("", !0)
                  ];
                }),
                transcript: $(() => {
                  var R;
                  return [
                    q.value ? (n(), o(z, { key: 0 }, [
                      (R = e.facts) != null && R.instruction ? (n(), o("div", Ft, [
                        M(r(Pe), {
                          label: "Instruction",
                          open: T.value,
                          "data-agent-section": "instruction",
                          onToggle: O[1] || (O[1] = (G) => T.value = !T.value)
                        }, {
                          default: $(() => [
                            v("div", Pt, g(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (n(), o("p", Ut, "No job recorded")) : k("", !0)
                    ], 64)) : k("", !0),
                    M(At, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                ee(r(Y), (R, G) => ({
                  name: G,
                  fn: $(() => [
                    (n(), U(ot(R), {
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
}, Gt = /* @__PURE__ */ X(Kt, [["__scopeId", "data-v-3f66c406"]]), Zt = { class: "action-field" }, _t = ["value", "disabled"], Yt = ["value"], Qt = { key: 1 }, Xt = {
  key: 1,
  class: "action-field"
}, ea = { class: "action-buttons" }, ta = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (l, a) => (n(), o("form", {
      onSubmit: a[4] || (a[4] = re((s) => l.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (n(), o(z, { key: 0 }, [
        v("label", Zt, [
          a[6] || (a[6] = h("Task ", -1)),
          v("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: a[0] || (a[0] = (s) => l.$emit("update:task", s.target.value))
          }, [
            a[5] || (a[5] = v("option", { value: "" }, "Choose an open task", -1)),
            (n(!0), o(z, null, ee(e.tasks, (s) => (n(), o("option", {
              key: s.id,
              value: String(s.id)
            }, g(s.id) + ": " + g(s.title), 9, Yt))), 128))
          ], 40, _t)
        ]),
        e.moreTasks ? (n(), U(r(ae), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: a[1] || (a[1] = (s) => l.$emit("more"))
        }, {
          default: $(() => [...a[7] || (a[7] = [
            h("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : k("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (n(), o("p", Qt, "No open tasks.")) : k("", !0)
      ], 64)) : (n(), o("label", Xt, [
        a[8] || (a[8] = h("Job", -1)),
        M(r(kt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: a[2] || (a[2] = (s) => l.$emit("update:text", s.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      v("div", ea, [
        M(r(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: $(() => [...a[9] || (a[9] = [
            h("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        M(r(ae), {
          small: "",
          disabled: e.pending,
          onClick: a[3] || (a[3] = (s) => l.$emit("cancel"))
        }, {
          default: $(() => [...a[10] || (a[10] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, aa = /* @__PURE__ */ X(ta, [["__scopeId", "data-v-adde4158"]]), na = { class: "action-buttons" }, la = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (l, a) => (n(), o("form", {
      "data-agent-retire-confirm": "",
      onSubmit: a[2] || (a[2] = re((s) => l.$emit("submit"), ["prevent"]))
    }, [
      a[5] || (a[5] = v("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      M(r(yt), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": a[0] || (a[0] = (s) => l.$emit("update:reason", s))
      }, null, 8, ["model-value", "disabled"]),
      v("div", na, [
        M(r(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: $(() => [...a[3] || (a[3] = [
            h("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        M(r(ae), {
          small: "",
          disabled: e.pending,
          onClick: a[1] || (a[1] = (s) => l.$emit("cancel"))
        }, {
          default: $(() => [...a[4] || (a[4] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Ke = /* @__PURE__ */ X(la, [["__scopeId", "data-v-23a905c0"]]), oa = { class: "action-buttons" }, sa = {
  key: 0,
  role: "alert"
}, ia = {
  key: 1,
  role: "status"
}, ra = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const l = e, a = ye(), s = I(""), t = I(""), i = I(""), d = I(""), x = I([]), y = I(0), A = I(!1), E = I(!1), q = I(!1), V = I(""), J = I(""), j = f(() => !!l.row.retired_at || l.row.state === "retired"), N = f(() => !j.value && !!l.row.ended_at), H = f(() => {
      var Z;
      return N.value && ((Z = l.row.job_command) == null ? void 0 : Z.length) && !l.row.resume_reason;
    }), Y = f(() => H.value && !E.value && (l.row.job_task_flag ? x.value.some((Z) => String(Z.id) === d.value) : !!t.value.trim()));
    function T(Z) {
      s.value = Z, t.value = "", i.value = "", d.value = "", V.value = "", J.value = "";
    }
    async function m() {
      T("job"), l.row.job_task_flag && (x.value = [], y.value = 0, A.value = !1, await K());
    }
    async function K() {
      if (!E.value) {
        E.value = !0;
        try {
          a.state["jobs.page"] = String(y.value + 1), await a.reload("jobs");
          const Z = a.props.jobs;
          V.value = Z.failure.value, V.value || (x.value = [...x.value, ...Z.rows.value], y.value = Z.data.value.page, A.value = Z.more.value);
        } finally {
          E.value = !1;
        }
      }
    }
    async function B(Z, p) {
      if (!q.value) {
        q.value = !0, V.value = "";
        try {
          const O = await a.run(Z);
          V.value = O.ok ? "" : O.error, O.ok && (T(""), J.value = p);
        } finally {
          q.value = !1;
        }
      }
    }
    async function W() {
      if (!Y.value) return;
      const Z = l.row.job_task_flag ? [l.row.job_task_flag, d.value] : [t.value.trim()];
      await B([...l.row.job_command, String(l.row.id), ...Z], "Job sent.");
    }
    async function te() {
      !N.value || s.value !== "retire" || !i.value.trim() || await B(["agent", "retire", String(l.row.id), "--reason", i.value.trim()], "Agent retired permanently.");
    }
    return (Z, p) => {
      var O;
      return j.value ? k("", !0) : (n(), o("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: p[6] || (p[6] = re(() => {
        }, ["stop"])),
        onKeydown: p[7] || (p[7] = re(() => {
        }, ["stop"]))
      }, [
        v("div", oa, [
          N.value ? (n(), o(z, { key: 0 }, [
            (O = e.row.job_command) != null && O.length ? (n(), U(r(ae), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: q.value || E.value || !H.value,
              onClick: m
            }, {
              default: $(() => [...p[8] || (p[8] = [
                h("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0),
            e.row.role !== "main" ? (n(), U(r(ae), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: q.value || E.value,
              onClick: p[0] || (p[0] = (D) => T("retire"))
            }, {
              default: $(() => [...p[9] || (p[9] = [
                h("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0)
          ], 64)) : k("", !0)
        ]),
        M(r(Ue), { value: s.value }, {
          job: $(() => [
            M(aa, {
              task: d.value,
              "onUpdate:task": p[1] || (p[1] = (D) => d.value = D),
              text: t.value,
              "onUpdate:text": p[2] || (p[2] = (D) => t.value = D),
              row: e.row,
              tasks: x.value,
              pending: q.value,
              loading: E.value,
              "more-tasks": A.value,
              failure: V.value,
              "job-ready": Y.value,
              onSubmit: W,
              onMore: K,
              onCancel: p[3] || (p[3] = (D) => T(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: $(() => [
            M(Ke, {
              reason: i.value,
              "onUpdate:reason": p[4] || (p[4] = (D) => i.value = D),
              pending: q.value,
              onSubmit: te,
              onCancel: p[5] || (p[5] = (D) => T(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        V.value ? (n(), o("p", sa, g(V.value), 1)) : k("", !0),
        J.value ? (n(), o("p", ia, g(J.value), 1)) : k("", !0)
      ], 32));
    };
  }
}, ua = /* @__PURE__ */ X(ra, [["__scopeId", "data-v-4cb32275"]]), da = { key: 0 }, ca = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" } },
  setup(e) {
    const l = /* @__PURE__ */ new Set(["running", "working", "thinking"]), a = e, s = f(() => l.has(a.state)), t = f(() => a.since ? `${a.doing}. ${a.since}` : a.doing);
    return (i, d) => (n(), U(r(Te), {
      as: "button",
      place: "corner",
      class: ne(["agent-dot", { pulse: s.value }]),
      "data-state": e.state,
      "aria-label": t.value,
      "data-agent-status": "",
      onClick: d[0] || (d[0] = re(() => {
      }, ["stop"]))
    }, {
      tip: $(() => [
        v("b", null, g(e.doing), 1),
        e.since ? (n(), o("span", da, g(e.since), 1)) : k("", !0)
      ]),
      default: $(() => [
        d[1] || (d[1] = v("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, va = /* @__PURE__ */ X(ca, [["__scopeId", "data-v-8d827ded"]]), Ge = { started: { fill: 33, words: "started" }, testing: { fill: 66, words: "being tested" }, blocked: { fill: 33, words: "blocked" } }, ga = 30, Ze = (e) => e.filter((l) => l.state !== "cancelled");
function pa(e, l) {
  const a = Ze(e), s = Ge[l == null ? void 0 : l.state];
  return a.length > ga ? { continuous: !0, done: a.filter((d) => d.state === "completed").length / a.length * 100, now: s ? s.fill / 100 / a.length * 100 : 0, segments: [] } : { continuous: !1, done: 0, now: 0, segments: a.map((i) => i.state === "completed" ? { kind: "done", fill: 0 } : i.id === (l == null ? void 0 : l.id) && s ? { kind: "now", fill: s.fill } : { kind: "todo", fill: 0 }) };
}
function fa({ tasks: e, inHand: l, perHour: a }) {
  const s = Ze(e), t = s.filter((y) => y.state === "completed").length, i = Ge[l == null ? void 0 : l.state], d = s.length - t - (l && l.state !== "completed" ? 1 : 0), x = t === s.length;
  return {
    number: l.id,
    title: l.title,
    count: `${t} of ${s.length}`,
    taskTip: `${t} of its ${s.length} tasks done${i ? `. This one is ${i.words}.` : "."}`,
    countTip: x ? `All ${s.length} tasks done` : `${t} done, 1 in hand, ${d} to go`,
    paceTip: !x && a ? `About ${a} an hour.` : "",
    bar: pa(e, l)
  };
}
const ma = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, ha = {
  class: "task-line",
  "data-agent-task-line": ""
}, ka = { key: 0 }, ya = ["data-state"], ba = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, state: { type: String, required: !0 }, perHour: { type: Number, default: 0 } },
  setup(e) {
    const l = e, a = f(() => l.inHand ? fa({ tasks: l.tasks, inHand: l.inHand, perHour: l.perHour }) : null);
    return (s, t) => e.job && !a.value ? (n(), o("span", ma, [
      M(r(Te), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: $(() => [
          v("b", null, g(e.job), 1)
        ]),
        default: $(() => [
          t[1] || (t[1] = h("Job", -1))
        ]),
        _: 1
      })
    ])) : a.value ? (n(), o(z, { key: 1 }, [
      v("span", ha, [
        M(r(Te), {
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${a.value.number}`,
          "aria-label": `Task ${a.value.number}: ${a.value.title}`,
          onClick: t[0] || (t[0] = re((i) => r(je)(`tasks:${a.value.number}`), ["stop"]))
        }, {
          tip: $(() => [
            v("b", null, g(a.value.title), 1),
            v("span", null, g(a.value.taskTip), 1)
          ]),
          default: $(() => [
            h("Task " + g(a.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"]),
        M(r(Te), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: $(() => [
            v("b", null, g(a.value.countTip), 1),
            a.value.paceTip ? (n(), o("span", ka, g(a.value.paceTip), 1)) : k("", !0)
          ]),
          default: $(() => [
            h(g(a.value.count), 1)
          ]),
          _: 1
        })
      ]),
      v("span", {
        class: ne(["bar", { continuous: a.value.bar.continuous }]),
        "data-state": e.state,
        style: pe(a.value.bar.continuous ? { "--done": `${a.value.bar.done}%`, "--now": `${a.value.bar.now}%` } : void 0),
        "data-agent-bar": "",
        "aria-hidden": "true"
      }, [
        (n(!0), o(z, null, ee(a.value.bar.segments, (i, d) => (n(), o("i", {
          key: d,
          class: ne(i.kind),
          style: pe(i.kind === "now" ? { "--fill": `${i.fill}%` } : void 0)
        }, null, 6))), 128))
      ], 14, ya)
    ], 64)) : k("", !0);
  }
}, wa = /* @__PURE__ */ X(ba, [["__scopeId", "data-v-357b6ada"]]), Ma = ["data-icon", "stroke-width", "innerHTML"], le = {
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
    return (i, d) => (n(), o("svg", {
      class: "ico",
      "data-icon": e.name,
      style: pe({
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
    }, null, 12, Ma));
  }
}, $a = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, xa = {
  key: 1,
  class: "menu-item-text"
}, Ca = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (l, a) => (n(), o("button", {
      type: "button",
      class: ne(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (n(), o("span", $a, g(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (n(), o("span", xa, [
        v("span", null, [
          Me(l.$slots, "default", {}, void 0, !0)
        ]),
        v("small", null, g(e.description), 1)
      ])) : Me(l.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ke = /* @__PURE__ */ X(Ca, [["__scopeId", "data-v-fec99974"]]), Sa = {}, Aa = { class: "menu-label" };
function Ta(e, l) {
  return n(), o("span", Aa, [
    Me(e.$slots, "default", {}, void 0, !0)
  ]);
}
const be = /* @__PURE__ */ X(Sa, [["render", Ta], ["__scopeId", "data-v-aa955b3e"]]), ja = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, La = {
  key: 0,
  class: "skills-none"
}, Ra = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: l }) {
    const a = e, s = l, t = f(() => a.skills.filter((d) => d.state === "loaded")), i = f(() => a.skills.filter((d) => d.state !== "loaded"));
    return (d, x) => (n(), o("div", ja, [
      M(be, null, {
        default: $(() => [...x[1] || (x[1] = [
          h("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      t.value.length ? k("", !0) : (n(), o("p", La, "None yet. Compacting the conversation empties this list.")),
      (n(!0), o(z, null, ee(t.value, (y) => (n(), o("p", {
        key: y.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        M(le, {
          name: "book",
          size: 12
        }),
        h(g(y.skill), 1)
      ]))), 128)),
      i.value.length ? (n(), o(z, { key: 1 }, [
        M(be, null, {
          default: $(() => [...x[2] || (x[2] = [
            h("Still to read", -1)
          ])]),
          _: 1
        }),
        (n(!0), o(z, null, ee(i.value, (y) => (n(), o("p", {
          key: y.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          M(le, {
            name: "book",
            size: 12
          }),
          h(g(y.skill), 1)
        ]))), 128))
      ], 64)) : k("", !0),
      M(ke, {
        "data-agent-skills-browse": "",
        onClick: x[0] || (x[0] = (y) => s("browse"))
      }, {
        default: $(() => [...x[3] || (x[3] = [
          h("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Oa = /* @__PURE__ */ X(Ra, [["__scopeId", "data-v-be514d47"]]), Ba = ["disabled", "title"], Ia = { class: "gauge usage" }, za = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: l }) {
    const a = e, s = l, t = f(() => a.windows[0] ?? null), i = f(() => t.value ? Math.max(0, Math.min(100, Math.round(t.value.used_percent))) : null), d = f(() => i.value !== null && i.value >= 100), x = f(() => {
      var A;
      return (A = t.value) != null && A.reset_epoch_seconds ? new Date(t.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), y = f(() => d.value ? `At usage limit: the plan's ${t.value.title} allowance is used up${x.value ? `, starts again ${x.value}` : ""}` : `${i.value}% of the plan's ${t.value.title} allowance used${x.value ? `, starts again ${x.value}` : ""}`);
    return (A, E) => i.value !== null ? (n(), o("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: y.value,
      onClick: E[0] || (E[0] = (q) => s("open", q.currentTarget))
    }, [
      M(le, {
        name: "allowance",
        size: 12
      }),
      E[1] || (E[1] = h()),
      v("span", Ia, [
        v("span", {
          style: pe({ width: `${i.value}%` })
        }, null, 4)
      ]),
      h(" " + g(d.value ? "At usage limit" : `${i.value}%`), 1)
    ], 8, Ba)) : k("", !0);
  }
}, Va = /* @__PURE__ */ X(za, [["__scopeId", "data-v-1fff5e1b"]]), Ea = (e, l, a) => Math.max(l, Math.min(a, e)), _e = /* @__PURE__ */ new WeakMap(), Na = (e, l) => _e.set(e, l);
function Ha(e, l) {
  for (let a = l; a; a = _e.get(a) ?? a.parentElement) if (a === e) return !0;
  return !1;
}
function Wa(e, l) {
  const a = (s) => {
    var i, d;
    const t = ((i = e.value) == null ? void 0 : i.element) || ((d = e.value) == null ? void 0 : d.$el) || e.value;
    t && !Ha(t, s.target) && l(s);
  };
  window.addEventListener("click", a), we(() => window.removeEventListener("click", a));
}
const he = 8, qa = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, t = I(null), i = (b) => b ? `${b}px` : void 0, d = f(() => ({
      minWidth: i(s.minWidth),
      maxWidth: i(s.maxWidth),
      maxHeight: i(s.maxHeight),
      height: i(s.height)
    })), x = I({ w: 0, h: 0 }), y = I(s.anchor ? s.anchor.getBoundingClientRect() : null), A = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), E = (b) => ({
      left: Math.max(0, b.left),
      top: Math.max(0, b.top),
      right: Math.min(window.innerWidth, b.right),
      bottom: Math.min(window.innerHeight, b.bottom)
    }), q = (b) => {
      const R = b.closest(".pane, .float-window");
      return R ? E(R.getBoundingClientRect()) : A();
    }, V = (b, R) => `${Math.max(0, b ? Math.min(b, R) : R)}px`;
    function J(b, R) {
      return {
        below: b.bottom - R.bottom - s.gap - he,
        above: R.top - b.top - s.gap - he,
        across: b.right - b.left - 2 * he
      };
    }
    function j(b) {
      const R = q(s.anchor), G = J(R, b);
      return x.value.w <= G.across && x.value.h <= Math.max(G.below, G.above) ? R : A();
    }
    const N = f(() => {
      if (!y.value) return d.value;
      const b = y.value, R = j(b), G = J(R, b), { w: C, h: u } = x.value, c = s.align === "auto" ? b.left + b.right > R.left + R.right : s.align === "right", w = Ea(c ? b.right - C : b.left, R.left + he, Math.max(R.left + he, R.right - C - he)), _ = u > G.below && G.above > G.below ? { bottom: `${window.innerHeight - b.top + s.gap}px`, maxHeight: V(s.maxHeight, G.above) } : { top: `${b.bottom + s.gap}px`, maxHeight: V(s.maxHeight, G.below) };
      return { ...d.value, ..._, left: `${w}px`, maxWidth: V(s.maxWidth, G.across) };
    }), H = a, Y = () => [...t.value.querySelectorAll("button:not(:disabled)")];
    function T(b) {
      const R = Y(), G = R.indexOf(document.activeElement);
      R[(G + b + R.length) % R.length].focus();
    }
    const m = { ArrowDown: () => T(1), ArrowUp: () => T(-1), Escape: () => H("close") }, K = (b) => m[b.key] && (b.preventDefault(), m[b.key]()), B = () => t.value && (x.value = { w: t.value.offsetWidth, h: t.value.scrollHeight });
    let W = 0;
    const te = new ResizeObserver(() => {
      cancelAnimationFrame(W), W = requestAnimationFrame(B);
    });
    Wa(t, (b) => s.anchor && !s.anchor.contains(b.target) && H("close"));
    const Z = (b, R) => ["top", "left", "right", "bottom"].some((G) => Math.abs(b[G] - R[G]) > 1), p = (b) => b.bottom < 0 || b.top > window.innerHeight;
    let O = 0;
    function D() {
      if (s.anchor) {
        const b = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || p(b)) return H("close");
        Z(b, y.value) && (y.value = b);
      }
      O = requestAnimationFrame(D);
    }
    return st(() => {
      s.anchor && t.value && Na(t.value, s.anchor), B(), t.value && te.observe(t.value), !s.plain && Y()[0] && Y()[0].focus(), D();
    }), we(() => {
      te.disconnect(), cancelAnimationFrame(O), cancelAnimationFrame(W);
    }), l({ element: t }), (b, R) => (n(), U(it, {
      to: "body",
      disabled: !e.anchor
    }, [
      v("div", rt({
        ref_key: "panel",
        ref: t
      }, b.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: N.value,
        onKeydown: K
      }), [
        Me(b.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Da = /* @__PURE__ */ X(qa, [["__scopeId", "data-v-3d203970"]]);
async function Fa(e, l, a) {
  if (!e) return a(l);
  const { target: s, fields: t } = e, i = Object.fromEntries(Object.keys(t).map((y) => [y, s[y]])), d = () => Object.assign(s, i);
  Object.assign(s, t);
  let x = !1;
  try {
    const y = await a(l);
    return x = y.ok, y;
  } finally {
    x || d();
  }
}
function Pa(e, l, a, { groups: s, programs: t }) {
  const i = I({}), d = I(""), x = I(!1), y = f(() => !!e.value && !e.value.ended_at), A = f(() => y.value && !!e.value.paused_at);
  async function E(j, N = null) {
    d.value = "";
    const H = await Fa(N, j, l);
    return d.value = H.ok ? "" : H.error, a(), H;
  }
  return { groups: s, programs: t, chosen: i, failure: d, asking: x, running: y, paused: A, choose: (j, N) => E(["agent", "control", String(e.value.id), j, N.value], { target: i, fields: { value: { ...i.value, [j]: N.label } } }), stop: () => (x.value = !1, E(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (j) => E(["agent", "launch", j.name]) };
}
function Ua(e) {
  if (!e) return "Not compacted yet";
  const l = new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return e.start_percent === null ? `Last compacted ${l}` : e.end_percent === null ? `Last compacted ${l}, from ${e.start_percent}%` : `Last compacted ${l}, from ${e.start_percent}% to ${e.end_percent}%, ${e.start_percent - e.end_percent}% taken off`;
}
const Ja = ["disabled", "title"], Ka = ["disabled", "title"], Ga = { class: "gauge" }, Za = ["disabled", "title"], _a = ["disabled"], Ya = ["disabled"], Qa = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Xa = ["title"], en = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, tn = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, an = { class: "gauge" }, nn = { class: "context-used" }, ln = 75, on = {
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
    const a = e, s = l, t = Pa(Le(a, "agent"), a.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => s("changed"), { groups: Le(a, "controlGroups"), programs: Le(a, "agentPrograms") }), i = I(null), d = I(""), x = f(() => t.groups.value.find((T) => T.key === d.value));
    function y(T, m) {
      i.value = T.currentTarget, d.value = m;
    }
    function A() {
      i.value = null, d.value = "", t.asking.value = !1;
    }
    const E = f(() => a.skills.filter((T) => T.state === "loaded"));
    function q(T) {
      y(T, "skills"), s("skills");
    }
    const V = (T) => t.groups.value.some((m) => m.key === T), J = f(() => {
      var T;
      return t.chosen.value.model ?? ((T = N.value) == null ? void 0 : T.model) ?? "";
    }), j = f(() => {
      var T;
      return t.chosen.value.effort ?? ((T = N.value) == null ? void 0 : T.effort) ?? "";
    });
    f(() => !!a.agent && !a.agent.ended_at);
    const N = f(() => {
      var T;
      return ((T = a.usage.agents) == null ? void 0 : T.find((m) => {
        var K;
        return m.id === ((K = a.agent) == null ? void 0 : K.id);
      })) ?? null;
    }), H = f(() => {
      var T;
      return ((T = N.value) == null ? void 0 : T.context_percent) == null ? null : Math.round(N.value.context_percent);
    }), Y = f(() => {
      var T;
      return (T = N.value) != null && T.cost_dollars ? `$${N.value.cost_dollars.toFixed(2)}` : "";
    });
    return (T, m) => {
      var K;
      return n(), o("div", {
        class: ne(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (n(), o(z, { key: 0 }, [
          v("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: m[0] || (m[0] = (B) => y(B, "agent"))
          }, [
            M(le, {
              name: "agents",
              size: 12
            }),
            h(" " + g(((K = e.agentPrograms.find((B) => B.name === e.agent.program)) == null ? void 0 : K.title) || e.agent.program), 1)
          ], 8, Ja),
          M(Va, {
            windows: e.usage.windows,
            onOpen: m[1] || (m[1] = (B) => s("open", "usage", B))
          }, null, 8, ["windows"]),
          H.value !== null ? (n(), o("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${H.value}% full: clear or compact it`,
            onClick: m[2] || (m[2] = (B) => V("context") ? y(B, "context") : s("open", "context", B.currentTarget))
          }, [
            M(le, {
              name: "gauge",
              size: 12
            }),
            m[14] || (m[14] = h()),
            v("span", Ga, [
              v("span", {
                style: pe({ width: `${H.value}%` })
              }, null, 4)
            ]),
            h(" " + g(H.value) + "% ", 1)
          ], 8, Ka)) : k("", !0),
          J.value ? (n(), o("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${J.value}: change the model`,
            onClick: m[3] || (m[3] = (B) => V("model") ? y(B, "model") : null)
          }, [
            M(le, {
              name: "model",
              size: 12
            }),
            h(" " + g(J.value), 1)
          ], 8, Za)) : k("", !0),
          V("effort") || e.card && j.value ? (n(), o("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: m[4] || (m[4] = (B) => y(B, "effort"))
          }, [
            M(le, {
              name: "bolt",
              size: 12
            }),
            h(" " + g(j.value), 1)
          ], 8, _a)) : k("", !0),
          Y.value ? (n(), o("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: m[5] || (m[5] = (B) => s("open", "cost", B.currentTarget))
          }, g(Y.value), 9, Ya)) : k("", !0),
          e.branch ? (n(), o("span", Qa, [
            M(le, {
              name: "branch",
              size: 12
            }),
            h(" " + g(e.branch), 1)
          ])) : k("", !0),
          e.card ? k("", !0) : (n(), o("button", {
            key: 5,
            type: "button",
            class: ne(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: m[6] || (m[6] = (B) => s("open", "jobs", B.currentTarget))
          }, [
            M(le, {
              name: "clock",
              size: 12
            }),
            h(" " + g(e.jobs), 1)
          ], 2)),
          e.run ? (n(), o("button", {
            key: 6,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: q
          }, [
            M(le, {
              name: "book",
              size: 12
            }),
            h(" " + g(E.value.length), 1)
          ])) : k("", !0),
          e.fitness ? (n(), o(z, { key: 7 }, [
            v("button", {
              type: "button",
              class: ne(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < ln }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: m[7] || (m[7] = (B) => s("open", "fitness", B.currentTarget))
            }, [
              M(le, {
                name: "heart",
                size: 12
              }),
              h(" " + g(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            v("button", {
              type: "button",
              class: ne(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: m[8] || (m[8] = (B) => s("open", "load", B.currentTarget))
            }, [
              M(le, {
                name: "weight",
                size: 12
              }),
              h(" " + g(e.fitness.workload), 1)
            ], 2)
          ], 64)) : k("", !0)
        ], 64)) : e.run && !e.loading ? (n(), o("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: m[9] || (m[9] = (B) => y(B, "start"))
        }, [
          M(le, {
            name: "agents",
            size: 12
          }),
          m[15] || (m[15] = h(" Start an agent", -1))
        ])) : k("", !0),
        m[21] || (m[21] = v("span", { class: "space" }, null, -1)),
        r(t).failure.value ? (n(), o("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: r(t).failure.value
        }, g(r(t).failure.value), 9, Xa)) : k("", !0),
        Me(T.$slots, "default", {}, void 0, !0),
        i.value ? (n(), U(Da, {
          key: 3,
          anchor: i.value,
          "min-width": 190,
          onClose: A
        }, {
          default: $(() => {
            var B;
            return [
              d.value === "agent" ? (n(), o(z, { key: 0 }, [
                r(t).asking.value ? (n(), o(z, { key: 0 }, [
                  M(be, { "data-agent-stop-ask": "" }, {
                    default: $(() => [...m[16] || (m[16] = [
                      h("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  M(ke, {
                    "data-agent-stop-confirm": "",
                    onClick: m[10] || (m[10] = (W) => (A(), r(t).stop()))
                  }, {
                    default: $(() => [...m[17] || (m[17] = [
                      h("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  M(ke, {
                    onClick: m[11] || (m[11] = (W) => r(t).asking.value = !1)
                  }, {
                    default: $(() => [...m[18] || (m[18] = [
                      h("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (n(), U(ke, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: m[12] || (m[12] = (W) => r(t).asking.value = !0)
                }, {
                  default: $(() => [...m[19] || (m[19] = [
                    h("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : d.value === "start" ? (n(), o(z, { key: 1 }, [
                M(be, null, {
                  default: $(() => [...m[20] || (m[20] = [
                    h("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (n(!0), o(z, null, ee(r(t).programs.value, (W) => (n(), U(ke, {
                  key: W.name,
                  "data-agent-program": W.name,
                  onClick: (te) => (A(), r(t).start(W))
                }, {
                  default: $(() => [
                    h(g(W.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : d.value === "skills" ? (n(), U(Oa, {
                key: 2,
                skills: e.skills,
                onBrowse: m[13] || (m[13] = (W) => (A(), s("open", "skills", null)))
              }, null, 8, ["skills"])) : x.value ? (n(), o(z, { key: 3 }, [
                M(be, null, {
                  default: $(() => [
                    h(g(x.value.label), 1)
                  ]),
                  _: 1
                }),
                d.value === "context" ? (n(), o(z, { key: 0 }, [
                  v("p", en, g(r(Ua)(((B = N.value) == null ? void 0 : B.last_compaction) ?? null)), 1),
                  v("div", tn, [
                    v("span", an, [
                      v("span", {
                        style: pe({ width: `${H.value}%` })
                      }, null, 4)
                    ]),
                    v("span", nn, g(H.value) + "%", 1)
                  ])
                ], 64)) : k("", !0),
                (n(!0), o(z, null, ee(x.value.choices, (W) => (n(), U(ke, {
                  key: W.value,
                  "data-agent-choice": W.value,
                  onClick: (te) => (r(t).choose(x.value.key, W), A())
                }, {
                  default: $(() => [
                    h(g(W.label), 1)
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
}, sn = /* @__PURE__ */ X(on, [["__scopeId", "data-v-12618cc1"]]), rn = ["data-agent-open", "aria-expanded", "role", "tabindex"], un = { class: "agent-head" }, dn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, cn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, vn = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, gn = { class: "agent-line" }, pn = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, fn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, mn = {
  key: 1,
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, hn = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, kn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const a = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), s = { helper: "Helper", reviewer: "Reviewer" }, t = e, i = l, d = Ie(), x = f(() => {
      var u, c;
      if ((u = t.facts) != null && u.profile_title) return t.facts.profile_title;
      if ((c = t.facts) != null && c.profile) return t.facts.profile;
      const C = s[t.row.role] || t.row.role;
      return C.slice(0, 1).toUpperCase() + C.slice(1);
    }), y = f(() => {
      var C;
      return ((C = t.facts) == null ? void 0 : C.tasks) ?? [];
    }), A = f(() => y.value.filter((C) => C.state === "open")), E = f(() => y.value.find((C) => {
      var u;
      return C.id === ((u = t.progress) == null ? void 0 : u.task_id) && C.state === "started";
    })), q = f(() => E.value || y.value.find((C) => {
      var u;
      return C.id === ((u = t.facts) == null ? void 0 : u.task_id);
    }) || y.value.find((C) => a.has(C.state)) || A.value[0] || y.value.at(-1)), V = f(() => {
      var C, u, c, w, F, _;
      return t.row.role === "helper" ? ((C = t.facts) == null ? void 0 : C.helper_job) || "" : (u = t.facts) != null && u.job_enabled && (((c = E.value) == null ? void 0 : c.title) || ((w = t.facts) == null ? void 0 : w.task_title) || ((F = A.value[0]) == null ? void 0 : F.title) || ((_ = y.value.at(-1)) == null ? void 0 : _.title)) || "";
    }), J = f(() => {
      var C;
      return (C = t.facts) != null && C.job_enabled ? `${t.row.role} ${t.row.id}` : "";
    }), j = f(() => {
      var C, u;
      return [t.row.program, (C = t.facts) == null ? void 0 : C.model, (u = t.facts) == null ? void 0 : u.effort, J.value].filter(Boolean).join(" · ");
    }), N = ye(), H = f(() => Je(t.row.process_started_at || t.row.created_at, d.value)), Y = /* @__PURE__ */ new Set(["open", "started", "testing"]), T = f(() => {
      var C;
      return (C = t.facts) == null ? void 0 : C.work_status;
    }), m = f(() => !!t.row.ended_at && t.row.role !== "main" && y.value.some((C) => Y.has(C.state))), K = f(() => {
      var C, u;
      return t.row.state === "running" && ((C = t.facts) == null ? void 0 : C.state) === "at usage limit" && !!((u = t.facts) != null && u.limited_until);
    }), B = f(() => `At usage limit: starts again ${new Date(t.facts.limited_until).toLocaleString()}`), W = f(() => {
      var C;
      return t.row.retired_at || t.row.state === "retired" ? "retired" : K.value || T.value || t.waitReason || m.value ? "waiting" : t.row.state === "running" && ((C = t.facts) == null ? void 0 : C.state) || t.row.state;
    }), te = f(() => {
      var C;
      return K.value ? B.value : T.value ? `Status: ${T.value}` : t.waitReason ? `Waiting: ${t.waitReason}` : W.value === "blocked" ? (C = t.facts) != null && C.blocked_reason ? `Blocked: ${t.facts.blocked_reason}` : "Blocked" : m.value ? "Stopped with work left" : "";
    }), Z = f(() => {
      var C;
      return ((C = t.progress) == null ? void 0 : C.completed_count) ?? y.value.filter((u) => u.state === "completed").length;
    }), p = f(() => {
      var C;
      return bt(Z.value, ((C = t.progress) == null ? void 0 : C.started_at) || t.row.created_at, t.progress ? t.progress.finished_at : t.row.ended_at, d.value);
    }), O = f(() => t.row.role === "main" ? 0 : p.value), D = f(() => !!t.row.retired_at || t.row.state === "retired"), b = f(() => D.value ? "Retired" : W.value === "blocked" || W.value === "waiting" ? te.value || (W.value === "blocked" ? "Blocked" : "Waiting") : t.row.ended_at ? "Idle: its process has stopped" : "Working"), R = f(() => {
      var u;
      if (D.value) return t.row.retired_at;
      const C = W.value === "blocked" || W.value === "waiting";
      return t.row.ended_at || C && ((u = t.facts) == null ? void 0 : u.last_activity) || t.row.process_started_at || t.row.created_at;
    }), G = f(() => R.value ? `Since ${new Date(R.value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${wt(R.value, d.value)}` : "");
    return (C, u) => {
      var c, w, F, _, oe, se;
      return n(), o("div", {
        class: ne(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: u[2] || (u[2] = (ue) => !e.open && i("toggle")),
        onKeydown: [
          u[3] || (u[3] = He(re((ue) => !e.open && i("toggle"), ["self", "prevent"]), ["enter"])),
          u[4] || (u[4] = He(re((ue) => !e.open && i("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        v("span", un, [
          e.open ? (n(), o("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: u[0] || (u[0] = re((ue) => i("toggle"), ["stop"]))
          }, [
            M(r($e), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : k("", !0),
          v("span", dn, g(x.value), 1),
          v("span", cn, g(((c = e.facts) == null ? void 0 : c.given_name) || e.row.id), 1),
          e.open ? k("", !0) : (n(), U(r($e), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          e.open ? (n(), o("span", vn, g(H.value), 1)) : k("", !0)
        ]),
        v("span", gn, [
          v("span", pn, g(j.value), 1),
          (w = e.facts) != null && w.sandbox_off ? (n(), o("span", fn, "sandbox off")) : k("", !0),
          e.open ? (n(), o("span", mn, [
            u[5] || (u[5] = h("Started ", -1)),
            M(r(qe), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : k("", !0),
          e.open && ((F = e.facts) != null && F.last_activity) ? (n(), o("span", hn, [
            u[6] || (u[6] = h("Last heard ", -1)),
            M(r(qe), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : k("", !0)
        ]),
        e.open ? (n(), U(sn, {
          key: 0,
          "agent-programs": r(N).props.programs.rows.value,
          agent: e.row,
          branch: (_ = e.progress) == null ? void 0 : _.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((oe = e.facts) == null ? void 0 : oe.windows) ?? [] },
          card: ""
        }, {
          default: $(() => [
            M(ua, { row: e.row }, null, 8, ["row"]),
            e.row.role === "helper" && !e.row.ended_at ? (n(), U(r(ae), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: u[1] || (u[1] = re((ue) => r(N).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: $(() => [...u[7] || (u[7] = [
                h("Stop", -1)
              ])]),
              _: 1
            })) : k("", !0)
          ]),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : k("", !0),
        e.open ? k("", !0) : (n(), U(wa, {
          key: 1,
          tasks: y.value,
          "in-hand": e.row.role !== "helper" && ((se = e.facts) != null && se.job_enabled) && q.value || null,
          job: e.row.role === "helper" ? V.value : "",
          state: W.value,
          "per-hour": O.value
        }, null, 8, ["tasks", "in-hand", "job", "state", "per-hour"])),
        M(va, {
          state: W.value,
          doing: b.value,
          since: G.value
        }, null, 8, ["state", "doing", "since"]),
        e.open ? (n(), U(Gt, {
          key: 2,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: y.value,
          "stopped-with-work": m.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : k("", !0)
      ], 42, rn);
    };
  }
}, yn = /* @__PURE__ */ X(kn, [["__scopeId", "data-v-27c8ab85"]]), bn = ["data-edit-type"], wn = { key: 0 }, Mn = { class: "stepper" }, $n = ["disabled", "onClick"], xn = ["value", "disabled", "data-agent-limit-input", "onChange"], Cn = ["disabled", "onClick"], Sn = { key: 0 }, An = { key: 1 }, Tn = {
  __name: "AgentLimitEditor",
  props: { rows: { type: Array, required: !0 }, pending: Boolean, readOnly: Boolean, environment: { type: String, required: !0 } },
  emits: ["change"],
  setup(e, { emit: l }) {
    const a = l;
    return (s, t) => (n(), o(z, null, [
      t[0] || (t[0] = v("p", null, "How many agents of a type may run at once, and how many may be kept.", -1)),
      (n(!0), o(z, null, ee(e.rows, (i) => (n(), o("div", {
        key: i.key,
        class: "edit-row",
        "data-edit-type": i.key
      }, [
        v("div", null, [
          v("strong", null, g(i.per_profile ? "Each helper type" : "Workers"), 1),
          i.per_profile ? (n(), o("small", wn, "Researcher, Planner and the others")) : k("", !0)
        ]),
        (n(!0), o(z, null, ee([{ name: "Most running", value: i.run_limit, key: i.run_setting, source: i.run_source, kind: "run" }, { name: "Most kept", value: i.kept_limit, key: i.kept_setting, source: i.kept_source, kind: "kept" }], (d) => (n(), o("label", {
          key: d.key
        }, [
          h(g(d.name), 1),
          v("span", Mn, [
            v("button", {
              type: "button",
              disabled: e.pending || e.readOnly || d.value === 0,
              onClick: (x) => a("change", i, d.key, d.value, d.value - 1)
            }, "−", 8, $n),
            v("input", {
              type: "number",
              min: "0",
              value: d.value,
              disabled: e.pending || e.readOnly,
              "data-agent-limit-input": d.kind,
              onChange: (x) => a("change", i, d.key, d.value, x.target.value)
            }, null, 40, xn),
            v("button", {
              type: "button",
              disabled: e.pending || e.readOnly,
              onClick: (x) => a("change", i, d.key, d.value, d.value + 1)
            }, "+", 8, Cn)
          ]),
          d.value === 0 ? (n(), o("small", Sn, g(d.kind === "run" ? "None can start" : "Any number"), 1)) : d.source === `environment ${e.environment}` ? (n(), o("small", An, "Changed for " + g(e.environment), 1)) : k("", !0)
        ]))), 128))
      ], 8, bn))), 128))
    ], 64));
  }
}, jn = /* @__PURE__ */ X(Tn, [["__scopeId", "data-v-218442c9"]]), Ye = (e) => e.flatMap((l) => l.per_profile ? l.profiles.map((a) => ({ ...a, label: a.title, type: l.key, key: `${l.key}:${a.profile}` })) : [{ ...l, type: l.key }]), Be = (e, l) => l > 0 && e >= l, Ln = { class: "counts-panel" }, Rn = { class: "counts" }, On = ["data-count-agent"], Bn = { class: "person-text" }, In = {
  key: 0,
  class: "helper-head"
}, zn = ["data-agent-limit-type", "data-agent-limit-profile", "onClick"], Vn = {
  key: 0,
  class: "bar"
}, En = {
  key: 5,
  role: "alert"
}, Nn = {
  key: 6,
  role: "status"
}, Hn = { class: "foot" }, Wn = { class: "foot-note" }, qn = {
  __name: "AgentCountsPanel",
  props: {
    title: { default: "Agent counts" },
    titleModifiers: {}
  },
  emits: /* @__PURE__ */ dt(["open-agent", "close"], ["update:title"]),
  setup(e, { emit: l }) {
    const a = l, s = ut(e, "title"), t = ye(), { rows: i, failure: d } = t.props.limits, x = I([]), y = I(0), A = I(!1), E = Ie(), q = I(null), V = I(!1), J = I(!1), j = I(""), N = I(""), H = I(null), Y = I(""), T = f(() => Ye(i.value)), m = f(() => i.value.find((u) => u.per_profile)), K = f(() => T.value.find((u) => u.key === q.value)), B = f(() => x.value.filter((u) => {
      var c, w;
      return u.state !== "retired" && u.role === ((c = K.value) == null ? void 0 : c.type) && (!K.value.profile || (((w = u.facts) == null ? void 0 : w.profile) || u.profile) === K.value.profile);
    }).sort((u, c) => (u.state !== "running") - (c.state !== "running") || String(u.ended_at || u.created_at).localeCompare(String(c.ended_at || c.created_at)))), W = f(() => {
      var c;
      const u = /* @__PURE__ */ new Map();
      for (const w of B.value) {
        const F = ((c = w.facts) == null ? void 0 : c.model) || w.program_model;
        F && u.set(F, (u.get(F) || 0) + 1);
      }
      return [...u].map(([w, F]) => `${F} ${w}`).join(", ");
    }), te = (u, c) => c ? `${Math.min(u / Math.max(u, c) * 100, 100)}%` : "0%", Z = (u, c) => c && u > c ? `${(u - c) / u * 100}%` : "0%";
    ce(() => {
      var u;
      return V.value ? "Change the maximums" : ((u = K.value) == null ? void 0 : u.label) || "Agent counts";
    }, (u) => {
      s.value = u;
    }, { immediate: !0 });
    async function p(u, c = 1) {
      t.state["count-agents.role"] = u.type, u.profile ? t.state["count-agents.profile"] = u.profile : delete t.state["count-agents.profile"], t.state["count-agents.page"] = String(c), await t.reload("count-agents");
      const w = t.props["count-agents"];
      x.value = c === 1 ? [...w.rows.value] : [...x.value, ...w.rows.value], y.value = c, A.value = w.more.value;
    }
    function O(u) {
      q.value = u.key, x.value = [], p(u);
    }
    function D() {
      V.value = !1, q.value = null, H.value = null, j.value = "";
    }
    function b() {
      D(), a("close");
    }
    async function R(u, c, w, F) {
      if (J.value || t.readOnly) return;
      const _ = Number(F);
      if (!String(F).trim() || !Number.isInteger(_) || _ < 0) {
        j.value = "Use a whole number of 0 or more.";
        return;
      }
      J.value = !0, j.value = "";
      const oe = await t.run(["setting", "set", c, String(_), "--environment", t.environment]);
      oe.ok ? (await t.reload("limits"), N.value = "Saved.") : j.value = oe.error, J.value = !1;
    }
    async function G(u) {
      if (!Y.value.trim() || J.value) return;
      J.value = !0;
      const c = await t.run(["agent", "retire", String(u.id), "--reason", Y.value.trim()]);
      j.value = c.ok ? "" : "The agent could not be retired. Try again.", c.ok && (H.value = null, Y.value = "", N.value = "Agent retired permanently.", await t.reload("limits"), await p(K.value)), J.value = !1;
    }
    function C(u) {
      b(), a("open-agent", u);
    }
    return (u, c) => (n(), o("div", Ln, [
      v("div", Rn, [
        V.value || K.value ? (n(), o("button", {
          key: 0,
          class: "back",
          type: "button",
          onClick: D
        }, "‹ Back to the counts")) : k("", !0),
        r(d) ? (n(), o(z, { key: 1 }, [
          c[6] || (c[6] = v("strong", null, "The counts could not be read", -1)),
          c[7] || (c[7] = v("p", null, "The journal did not answer.", -1)),
          M(r(ae), {
            small: "",
            onClick: c[0] || (c[0] = (w) => r(t).reload("limits"))
          }, {
            default: $(() => [...c[5] || (c[5] = [
              h("Try again", -1)
            ])]),
            _: 1
          })
        ], 64)) : V.value ? (n(), U(jn, {
          key: 2,
          rows: r(i),
          pending: J.value,
          "read-only": r(t).readOnly,
          environment: r(t).environment,
          onChange: R
        }, null, 8, ["rows", "pending", "read-only", "environment"])) : K.value ? (n(), o(z, { key: 3 }, [
          v("p", null, [
            v("strong", null, g(K.value.running) + " of " + g(K.value.run_limit), 1),
            c[8] || (c[8] = h(" running, ", -1)),
            v("strong", null, [
              h(g(K.value.kept), 1),
              K.value.kept_limit ? (n(), o(z, { key: 0 }, [
                h(" of " + g(K.value.kept_limit), 1)
              ], 64)) : k("", !0)
            ]),
            c[9] || (c[9] = h(" kept", -1))
          ]),
          v("p", null, g(W.value), 1),
          B.value.length ? k("", !0) : (n(), o(z, { key: 0 }, [
            c[10] || (c[10] = v("strong", null, "No agents here yet", -1)),
            c[11] || (c[11] = v("p", null, "An agent shows here as soon as one of this type starts.", -1))
          ], 64)),
          (n(!0), o(z, null, ee(B.value, (w) => {
            var F, _, oe, se, ue;
            return n(), o("div", {
              key: w.id,
              class: "person",
              "data-count-agent": w.id
            }, [
              v("span", {
                class: ne(["dot", { running: w.state === "running" }])
              }, null, 2),
              v("div", Bn, [
                v("strong", null, g(((F = w.facts) == null ? void 0 : F.given_name) || w.id), 1),
                h(" " + g(w.state === "running" ? "Running" : "Idle") + ", " + g(r(Je)(w.state === "running" ? w.process_started_at || w.created_at : w.ended_at, r(E))), 1),
                v("small", null, g([w.program, (_ = w.facts) == null ? void 0 : _.model, (oe = w.facts) == null ? void 0 : oe.effort, `${w.role} ${w.id}`].filter(Boolean).join(", ")), 1),
                v("small", null, g(((se = w.facts) == null ? void 0 : se.task_title) || ((ue = w.facts) == null ? void 0 : ue.helper_job)), 1)
              ]),
              M(r(ae), {
                small: "",
                onClick: (ie) => C(w)
              }, {
                default: $(() => [...c[12] || (c[12] = [
                  h("Open", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              w.state === "idle" && !r(t).readOnly ? (n(), U(r(ae), {
                key: 0,
                small: "",
                onClick: (ie) => {
                  H.value = w.id, Y.value = "";
                }
              }, {
                default: $(() => [...c[13] || (c[13] = [
                  h("Retire", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : k("", !0),
              H.value === w.id ? (n(), U(Ke, {
                key: 1,
                reason: Y.value,
                "onUpdate:reason": c[1] || (c[1] = (ie) => Y.value = ie),
                pending: J.value,
                onSubmit: (ie) => G(w),
                onCancel: c[2] || (c[2] = (ie) => H.value = null)
              }, null, 8, ["reason", "pending", "onSubmit"])) : k("", !0)
            ], 8, On);
          }), 128)),
          A.value ? (n(), U(r(ae), {
            key: 1,
            small: "",
            onClick: c[3] || (c[3] = (w) => p(K.value, y.value + 1))
          }, {
            default: $(() => [...c[14] || (c[14] = [
              h("Show more", -1)
            ])]),
            _: 1
          })) : k("", !0)
        ], 64)) : (n(), o(z, { key: 4 }, [
          c[16] || (c[16] = v("p", null, "Kept agents have not been retired, so they can take another job. Open an item to see them.", -1)),
          c[17] || (c[17] = v("div", { class: "columns" }, [
            v("span", null, "Name"),
            v("span", null, "Running"),
            v("span", null, "Kept"),
            v("span")
          ], -1)),
          m.value ? (n(), o("div", In, [
            c[15] || (c[15] = v("strong", null, "Helpers", -1)),
            v("span", null, g(m.value.running) + " running, " + g(m.value.kept) + " kept", 1)
          ])) : k("", !0),
          (n(!0), o(z, null, ee(T.value, (w) => (n(), o("button", {
            key: w.key,
            type: "button",
            class: "count-row",
            "data-agent-limit-type": w.type || w.key,
            "data-agent-limit-profile": w.profile,
            onClick: (F) => O(w)
          }, [
            v("strong", null, g(w.label), 1),
            (n(!0), o(z, null, ee([{ count: w.running, limit: w.run_limit, unlimited: !1 }, { count: w.kept, limit: w.kept_limit, unlimited: !0 }], (F) => (n(), o("span", {
              key: F.unlimited,
              class: ne({ full: r(Be)(F.count, F.limit) })
            }, [
              v("span", null, [
                h(g(F.count), 1),
                F.limit || !F.unlimited ? (n(), o(z, { key: 0 }, [
                  h(" of " + g(F.limit), 1)
                ], 64)) : k("", !0)
              ]),
              F.limit ? (n(), o("span", Vn, [
                v("span", {
                  style: pe({ width: te(F.count, F.limit) })
                }, null, 4),
                v("i", {
                  style: pe({ width: Z(F.count, F.limit) })
                }, null, 4)
              ])) : k("", !0)
            ], 2))), 128)),
            M(r($e), {
              name: "chevronRight",
              size: 12
            })
          ], 8, zn))), 128))
        ], 64)),
        j.value ? (n(), o("p", En, g(j.value), 1)) : N.value ? (n(), o("p", Nn, g(N.value), 1)) : k("", !0)
      ]),
      v("div", Hn, [
        V.value ? (n(), o(z, { key: 0 }, [
          v("span", Wn, g(N.value || `Changes apply to ${r(t).environment}.`), 1),
          M(r(ae), { onClick: D }, {
            default: $(() => [...c[18] || (c[18] = [
              h("Done", -1)
            ])]),
            _: 1
          })
        ], 64)) : K.value ? k("", !0) : (n(), U(r(ae), {
          key: 1,
          disabled: r(t).readOnly,
          "data-agent-limits-edit": "",
          onClick: c[4] || (c[4] = (w) => V.value = !0)
        }, {
          default: $(() => [...c[19] || (c[19] = [
            h("Change the maximums", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]))
      ])
    ]));
  }
}, Dn = /* @__PURE__ */ X(qn, [["__scopeId", "data-v-de3d902c"]]), Fn = {
  key: 0,
  class: "badge",
  "data-agent-count-badge": ""
}, Pn = {
  __name: "AgentLimits",
  emits: ["open-agent"],
  setup(e, { emit: l }) {
    const a = l, s = ye(), t = I(!1), i = I("Agent counts"), d = f(() => Ye(s.props.limits.rows.value).filter((y) => Be(y.running, y.run_limit) || Be(y.kept, y.kept_limit)).length);
    function x(y) {
      t.value = !1, a("open-agent", y);
    }
    return (y, A) => (n(), o(z, null, [
      v("button", {
        class: "counts-button",
        type: "button",
        title: "Agent counts",
        "aria-label": "Agent counts",
        "data-agent-counts": "",
        onClick: A[0] || (A[0] = (E) => t.value = !0)
      }, [
        M(r($e), {
          name: "settings",
          size: 16
        }),
        d.value ? (n(), o("span", Fn, g(d.value), 1)) : k("", !0)
      ]),
      t.value ? (n(), U(r(Mt), {
        key: 0,
        title: i.value,
        modal: "",
        fits: "",
        onClose: A[3] || (A[3] = (E) => t.value = !1),
        onEscape: A[4] || (A[4] = (E) => t.value = !1)
      }, {
        default: $(() => [
          M(Dn, {
            title: i.value,
            "onUpdate:title": A[1] || (A[1] = (E) => i.value = E),
            onOpenAgent: x,
            onClose: A[2] || (A[2] = (E) => t.value = !1)
          }, null, 8, ["title"])
        ]),
        _: 1
      }, 8, ["title"])) : k("", !0)
    ], 64));
  }
}, Un = /* @__PURE__ */ X(Pn, [["__scopeId", "data-v-4094dc8b"]]), Jn = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Kn = ["data-agent-row", "data-agent-lingering"], De = "journal.agents.filters", Fe = 300 * 1e3, Ae = "cubic-bezier(0.2, 0.9, 0.25, 1)", Gn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const l = e, a = ye(), { rows: s } = a.props.waits, { rows: t } = a.props.progress, { rows: i, failure: d, loaded: x, more: y } = a.props.agents, A = (S) => t.value.find((P) => P.agent_id === S.id) ?? null, E = (S) => {
      var P;
      return ((P = s.value.find((L) => L.agent_id === S.id)) == null ? void 0 : P.reason) ?? "";
    }, q = I("running"), V = I(""), J = JSON.parse(localStorage.getItem(De) || '{"roles":[],"profiles":[],"programs":[]}'), j = I(J), N = f(() => a.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: H } = a.props.programs, Y = f(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), T = (S, P) => {
      j.value = St(j.value, S, P);
    }, m = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, K = (S) => S.slice(0, 1).toUpperCase() + S.slice(1);
    ce(j, (S) => localStorage.setItem(De, JSON.stringify(S)));
    const B = I(25);
    function W() {
      Object.assign(a.state, {
        "agents.show": q.value,
        "agents.search": V.value,
        "agents.limit": String(B.value),
        "agents.roles": j.value.roles.join(","),
        "agents.profiles": j.value.profiles.join(","),
        "agents.programs": j.value.programs.join(",")
      });
    }
    async function te() {
      return B.value += 25, W(), await a.reload("agents"), !0;
    }
    ce([q, V, j], () => {
      B.value = 25, W(), a.reload("agents");
    }), W();
    const Z = (S) => S.facts ?? null, p = i, O = Ie(), D = I([]), b = f(() => new Set(D.value.filter((S) => O.value - S.left < Fe).map((S) => S.row.id))), R = f(() => D.value.filter((S) => b.value.has(S.row.id)).map((S) => S.row)), G = f(() => [...p.value, ...R.value]);
    let C = "", u = [];
    async function c(S) {
      await a.reload(`card.${S.id}`);
      const P = a.props[`card.${S.id}`].rows.value.find((L) => L.id === S.id);
      P != null && P.ended_at && !D.value.some((L) => L.row.id === S.id) && (D.value = [...D.value, { row: P, left: Date.now() }]);
    }
    ce(i, (S) => {
      const P = C === `${q.value}|${V.value}|${JSON.stringify(j.value)}` && q.value === "running", L = P ? u.filter((Q) => !S.some((ve) => ve.id === Q.id)) : [];
      C = `${q.value}|${V.value}|${JSON.stringify(j.value)}`, u = S, D.value = P ? D.value.filter((Q) => O.value - Q.left < Fe && !S.some((ve) => ve.id === Q.row.id)) : [], L.forEach(c);
    }, { immediate: !0 });
    const w = f(() => !!V.value.trim() || Y.value > 0), F = f(() => l.texts[q.value] ?? { title: l.empty, hint: "" }), _ = I(null), oe = I(null), se = I(null), ue = I(null), ie = f(() => _.value === null ? null : a.props[`card.${_.value}`].rows.value.find((S) => S.id === _.value) ?? oe.value), ze = f(() => ie.value ? [ie.value] : G.value), xe = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let fe = !1, Ve = 0;
    async function Qe(S) {
      if (fe) return;
      fe = !0, Ve = ue.value.scrollTop;
      const P = se.value.querySelector(`[data-agent-open="${S.id}"]`);
      if (!xe()) {
        const ge = [...se.value.querySelectorAll(".agent-row")].filter((de) => !de.contains(P));
        await Promise.all(ge.map((de) => de.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const L = [...P.querySelectorAll(".agent-head, .agent-line")], Q = [...L, ...P.querySelectorAll("[data-agent-motion]")], ve = Q.map((ge) => ge.getBoundingClientRect());
      if (oe.value = S, _.value = S.id, a.reload(`card.${S.id}`), await We(), !xe()) {
        const ge = Q.map((de) => de.getBoundingClientRect());
        Q.forEach((de, Ce) => {
          const me = L.indexOf(de.parentElement), tt = ve[Ce].left - ge[Ce].left - (me < 0 ? 0 : ve[me].left - ge[me].left), at = ve[Ce].top - ge[Ce].top - (me < 0 ? 0 : ve[me].top - ge[me].top);
          de.animate([{ transform: `translate(${tt}px, ${at}px)` }, { transform: "none" }], { duration: 280, easing: Ae });
        }), se.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((de) => {
          de.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Ae, fill: "backwards" });
        });
      }
      fe = !1;
    }
    async function Ee() {
      if (fe || !ie.value) return;
      fe = !0;
      const S = se.value.querySelector(`[data-agent-open="${_.value}"]`), P = [...S.children], L = xe() ? [] : P.map((Q) => Q.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(L.map((Q) => Q.finished)), _.value = null, await We(), ue.value.scrollTop = Ve, L.forEach((Q) => Q.cancel()), xe() || (S.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Ae }), se.value.querySelectorAll(".agent-row").forEach((Q) => {
        Q.contains(S) || Q.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Ae });
      })), fe = !1;
    }
    function Xe(S) {
      oe.value = S, _.value = S.id, a.reload(`card.${S.id}`);
    }
    const et = (S) => _.value === S.id ? Ee() : Qe(S);
    ce(V, (S) => S.trim() && (_.value = null)), ce(q, () => {
      _.value = null;
    });
    const Ne = (S) => {
      S.key === "Escape" && Ee();
    };
    return window.addEventListener("keydown", Ne), we(() => window.removeEventListener("keydown", Ne)), (S, P) => (n(), o("div", {
      ref_key: "agents",
      ref: se,
      class: ne(["agents", { focused: ie.value }])
    }, [
      M(r($t), {
        modelValue: V.value,
        "onUpdate:modelValue": P[1] || (P[1] = (L) => V.value = L),
        placeholder: "Search agents",
        "menu-count": Y.value,
        "data-agents-search": ""
      }, {
        menu: $(() => [
          M(r(Re), null, {
            default: $(() => [...P[2] || (P[2] = [
              h("Type", -1)
            ])]),
            _: 1
          }),
          (n(!0), o(z, null, ee(N.value.roles, (L) => (n(), U(r(Se), {
            key: L,
            role: "menuitemcheckbox",
            "aria-checked": j.value.roles.includes(L),
            checked: j.value.roles.includes(L),
            "data-filter-role": L,
            onClick: (Q) => T("roles", L)
          }, {
            default: $(() => [
              h(g(K(L)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          N.value.profiles.length ? (n(), U(r(Re), { key: 0 }, {
            default: $(() => [...P[3] || (P[3] = [
              h("Profile", -1)
            ])]),
            _: 1
          })) : k("", !0),
          (n(!0), o(z, null, ee(N.value.profiles, (L) => (n(), U(r(Se), {
            key: L.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.profiles.includes(L.name),
            checked: j.value.profiles.includes(L.name),
            "data-filter-profile": L.name,
            onClick: (Q) => T("profiles", L.name)
          }, {
            default: $(() => [
              h(g(L.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          M(r(Re), null, {
            default: $(() => [...P[4] || (P[4] = [
              h("Program", -1)
            ])]),
            _: 1
          }),
          (n(!0), o(z, null, ee(r(H), (L) => (n(), U(r(Se), {
            key: L.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.programs.includes(L.name),
            checked: j.value.programs.includes(L.name),
            "data-filter-program": L.name,
            onClick: (Q) => T("programs", L.name)
          }, {
            default: $(() => [
              h(g(L.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          Y.value ? (n(), U(r(Se), {
            key: 1,
            "data-filter-clear": "",
            onClick: m
          }, {
            default: $(() => [...P[5] || (P[5] = [
              h("Clear filters", -1)
            ])]),
            _: 1
          })) : k("", !0)
        ]),
        default: $(() => [
          M(r(xt), {
            options: N.value.states,
            value: q.value,
            onPick: P[0] || (P[0] = (L) => q.value = L)
          }, null, 8, ["options", "value"]),
          M(Un, { onOpenAgent: Xe })
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      q.value === "retired" && N.value.upgrade_retired ? (n(), o("p", Jn, "Retired during the upgrade: " + g(N.value.upgrade_retired), 1)) : k("", !0),
      v("div", {
        ref_key: "list",
        ref: ue,
        class: ne(["agents-view", { "agents-view-open": ie.value }])
      }, [
        r(x) && !r(d) && !ze.value.length && Y.value ? (n(), U(r(Oe), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: $(() => [
            M(r(ae), {
              small: "",
              "data-empty-clear": "",
              onClick: m
            }, {
              default: $(() => [...P[6] || (P[6] = [
                h("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (n(), U(r(Ct), {
          key: 1,
          rows: ze.value,
          failure: r(d),
          loaded: r(x),
          more: !ie.value && r(y),
          older: te,
          empty: F.value.title,
          hint: F.value.hint,
          searching: w.value
        }, {
          default: $(({ row: L }) => [
            v("div", {
              class: ne(["agent-row", { lingering: b.value.has(L.id) && L.id !== _.value }]),
              "data-agent-row": L.id,
              "data-agent-lingering": b.value.has(L.id) ? "" : null
            }, [
              M(yn, {
                row: L,
                facts: Z(L),
                progress: A(L),
                "wait-reason": E(L),
                open: L.id === _.value,
                onToggle: (Q) => et(L)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, Kn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, Qn = /* @__PURE__ */ X(Gn, [["__scopeId", "data-v-d12f84f5"]]);
export {
  Qn as A
};
