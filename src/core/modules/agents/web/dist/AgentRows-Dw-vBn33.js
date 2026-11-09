import { openBlock as n, createElementBlock as s, withModifiers as ee, unref as r, createTextVNode as k, toDisplayString as v, createVNode as p, createBlock as D, withCtx as b, Fragment as P, renderList as ae, createElementVNode as T, createCommentVNode as f, computed as i, ref as H, watch as de, onUnmounted as be, defineAsyncComponent as Xe, createSlots as _e, resolveDynamicComponent as et, normalizeClass as oe, normalizeStyle as Ae, renderSlot as ye, onMounted as tt, Teleport as at, mergeProps as nt, toRef as je, withKeys as Ee, nextTick as Ne } from "vue";
import { peekRef as we, Icon as Re, RunningCommand as lt, FoldGroup as Pe, TaskStatusIcon as ot, useWindow as Te, loadWindowComponent as st, coalesced as rt, READ_RATES as it, eventMayBeChildOf as dt, InnerTabs as ut, TabBody as ct, SwitchCase as Ue, EmptyState as Le, Btn as se, TextArea as gt, TextInput as vt, HoverTip as Ce, TaskBar as pt, useNow as Je, age as ht, perHour as ft, sinceWords as mt, seenWords as kt, AgentTip as bt, TimeAgo as We, SearchBar as yt, Segmented as wt, MenuLabel as Be, MenuItem as $e, RowList as Mt, toggleFilter as xt } from "@journal/window-kit";
import { _ as X, T as $t } from "./TranscriptRows-BL93hPr8.js";
const St = {
  class: "agent-command",
  "data-agent-command": ""
}, Ct = {
  key: 1,
  "data-agent-stopped": ""
}, At = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (l, t) => (n(), s("span", St, [
      e.waitReason ? (n(), s("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: t[0] || (t[0] = ee((o) => r(we)("test_queue:0"), ["stop"]))
      }, [
        k("Waiting: " + v(e.waitReason) + " ", 1),
        p(r(Re), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (n(), s("span", Ct, "Waiting")) : (n(), D(r(lt), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, Tt = /* @__PURE__ */ X(At, [["__scopeId", "data-v-1b371fb5"]]), jt = ["data-agent-delegated", "onClick"], Bt = { class: "agent-task-number" }, Rt = { class: "agent-task-title" }, Lt = ["title"], It = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const t = l;
    return (o, a) => (n(), D(r(Pe), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: a[0] || (a[0] = (c) => t("toggle"))
    }, {
      default: b(() => [
        (n(!0), s(P, null, ae(e.section.tasks, (c) => (n(), s("button", {
          key: c.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": c.id,
          onClick: (m) => r(we)(`tasks:${c.id}`)
        }, [
          p(r(ot), {
            status: c.state
          }, null, 8, ["status"]),
          T("span", Bt, v(c.id), 1),
          T("span", Rt, v(c.title), 1),
          c.plan_id ? (n(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${c.plan_id}: ${c.plan_title}`
          }, "Plan " + v(c.plan_id), 9, Lt)) : f("", !0)
        ], 8, jt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Ot = /* @__PURE__ */ X(It, [["__scopeId", "data-v-ea4ccd6b"]]), Vt = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, zt = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Ht = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, Et = ["data-peek", "onClick"], Nt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Wt = {
  key: 0,
  class: "agent-helper-brief"
}, qt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Dt = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Ft = "It ended without a report", Pt = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const l = e, t = ["started", "blocked", "open", "completed"], o = i(() => {
      var g, y;
      return l.row.ended_at && ((y = (g = l.facts) == null ? void 0 : g.job_returned) != null && y.startsWith(Ft)) ? l.facts.job_returned : "";
    }), a = i(() => l.tasks.length ? t.map((g) => ({ state: g, label: g.slice(0, 1).toUpperCase() + g.slice(1), tasks: l.tasks.filter((y) => y.state === g || g === "started" && y.state === "testing" || g === "completed" && y.state === "cancelled") })) : []), c = /* @__PURE__ */ new Set(["completed"]), m = H({}), M = (g) => !(m.value[g] ?? c.has(g)), x = (g) => m.value = { ...m.value, [g]: M(g) }, R = Te(), { rows: q } = R.props.reports;
    R.state["reports.agent"] = String(l.row.id);
    const E = i(() => l.row.access === "read-only"), N = i(() => !!l.row.retired_at || l.row.state === "retired"), U = ["tasks", "transcript", "terminal", "file-feed", "reports"], A = i(() => (N.value ? R.tabs.filter((y) => ["reports", "transcript"].includes(y.key)) : E.value ? R.tabs.filter((y) => ["reports", "transcript", "terminal"].includes(y.key)) : [...R.tabs]).sort((y, u) => (U.indexOf(y.key) < 0 ? U.length : U.indexOf(y.key)) - (U.indexOf(u.key) < 0 ? U.length : U.indexOf(u.key)))), O = () => E.value || N.value ? A.value.find((g) => g.key === "transcript") : A.value[0], W = H(O());
    de(W, (g) => {
      R.state.tab = (g == null ? void 0 : g.key) ?? "";
    }, { immediate: !0 }), be(() => {
      R.state.tab = "";
    }), de(A, (g) => {
      g.some((y) => {
        var u;
        return y.key === ((u = W.value) == null ? void 0 : u.key);
      }) || (W.value = g[0]);
    }), de(() => l.open, (g) => {
      g && (W.value = O());
    });
    const Z = Object.fromEntries(R.tabs.filter((g) => g.component).map((g) => [g.key, Xe(() => st(g.component))])), J = H(!1), { data: Y } = R.props.tool, C = i(() => {
      var g;
      return ((g = Y.value) == null ? void 0 : g.tool) ?? "";
    }), d = i(() => {
      var g;
      return ((g = Y.value) == null ? void 0 : g.note) ?? "";
    }), F = i(() => l.row.role !== "main" && (!l.row.ended_at || l.stoppedWithWork || l.waitReason));
    async function B() {
      !l.open || !F.value || (R.state["tool.agent"] = String(l.row.id), await R.reload("tool"));
    }
    const j = rt(B, it.agentCommand), V = R.follow(["hook_call.*", "process_part.*"], (g) => dt(g, "session_agent_id", /* @__PURE__ */ new Set([l.row.id])) && j());
    return be(() => V == null ? void 0 : V()), de(() => l.open, (g) => {
      g && B();
    }, { immediate: !0 }), (g, y) => {
      var u;
      return n(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: y[2] || (y[2] = ee(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (n(), s("p", Vt, "Retirement reason: " + v(e.row.retirement_reason), 1)) : f("", !0),
        e.row.resume_reason ? (n(), s("p", zt, v(e.row.resume_reason), 1)) : f("", !0),
        F.value ? (n(), D(Tt, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: C.value,
          note: d.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : f("", !0),
        o.value ? (n(), s("p", Ht, v(o.value), 1)) : f("", !0),
        p(r(ut), {
          class: "agent-tabs",
          tabs: A.value,
          active: W.value,
          answer: { tasks: e.tasks.length, reports: r(q).length },
          onChoose: y[0] || (y[0] = (L) => W.value = L)
        }, null, 8, ["tabs", "active", "answer"]),
        p(r(ct), {
          class: "agent-tab-body",
          tab: W.value,
          "data-agent-tab-body": (u = W.value) == null ? void 0 : u.key
        }, {
          default: b(() => {
            var L;
            return [
              p(r(Ue), {
                value: (L = W.value) == null ? void 0 : L.key
              }, _e({
                reports: b(() => [
                  r(q).length ? f("", !0) : (n(), D(r(Le), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: b(() => [...y[3] || (y[3] = [
                      k("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (n(!0), s(P, null, ae(r(q), (z) => (n(), s("button", {
                    key: z.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${z.id}`,
                    onClick: (Q) => r(we)(`messages:${z.id}`)
                  }, v(z.text), 9, Et))), 128))
                ]),
                tasks: b(() => {
                  var z;
                  return [
                    e.tasks.length ? f("", !0) : (n(), D(r(Le), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: b(() => [...y[4] || (y[4] = [
                        k("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (n(!0), s(P, null, ae(a.value, (Q) => (n(), D(Ot, {
                      key: Q.state,
                      section: Q,
                      open: M(Q.state),
                      onToggle: (h) => x(Q.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (z = e.facts) != null && z.instruction ? (n(), s(P, { key: 1 }, [
                      y[5] || (y[5] = T("p", { class: "agent-label" }, "Instruction", -1)),
                      T("div", Nt, v(e.facts.instruction), 1)
                    ], 64)) : f("", !0)
                  ];
                }),
                transcript: b(() => {
                  var z;
                  return [
                    E.value ? (n(), s(P, { key: 0 }, [
                      (z = e.facts) != null && z.instruction ? (n(), s("div", Wt, [
                        p(r(Pe), {
                          label: "Instruction",
                          open: J.value,
                          "data-agent-section": "instruction",
                          onToggle: y[1] || (y[1] = (Q) => J.value = !J.value)
                        }, {
                          default: b(() => [
                            T("div", qt, v(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (n(), s("p", Dt, "No job recorded")) : f("", !0)
                    ], 64)) : f("", !0),
                    p($t, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                ae(r(Z), (z, Q) => ({
                  name: Q,
                  fn: b(() => [
                    (n(), D(et(z), {
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
}, Ut = /* @__PURE__ */ X(Pt, [["__scopeId", "data-v-492142fe"]]), Jt = { class: "action-field" }, Gt = ["value", "disabled"], Kt = ["value"], Zt = { key: 1 }, Yt = {
  key: 1,
  class: "action-field"
}, Qt = { class: "action-buttons" }, Xt = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (l, t) => (n(), s("form", {
      onSubmit: t[4] || (t[4] = ee((o) => l.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (n(), s(P, { key: 0 }, [
        T("label", Jt, [
          t[6] || (t[6] = k("Task ", -1)),
          T("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: t[0] || (t[0] = (o) => l.$emit("update:task", o.target.value))
          }, [
            t[5] || (t[5] = T("option", { value: "" }, "Choose an open task", -1)),
            (n(!0), s(P, null, ae(e.tasks, (o) => (n(), s("option", {
              key: o.id,
              value: String(o.id)
            }, v(o.id) + ": " + v(o.title), 9, Kt))), 128))
          ], 40, Gt)
        ]),
        e.moreTasks ? (n(), D(r(se), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: t[1] || (t[1] = (o) => l.$emit("more"))
        }, {
          default: b(() => [...t[7] || (t[7] = [
            k("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : f("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (n(), s("p", Zt, "No open tasks.")) : f("", !0)
      ], 64)) : (n(), s("label", Yt, [
        t[8] || (t[8] = k("Job", -1)),
        p(r(gt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (o) => l.$emit("update:text", o.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      T("div", Qt, [
        p(r(se), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: b(() => [...t[9] || (t[9] = [
            k("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(r(se), {
          small: "",
          disabled: e.pending,
          onClick: t[3] || (t[3] = (o) => l.$emit("cancel"))
        }, {
          default: b(() => [...t[10] || (t[10] = [
            k("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, _t = /* @__PURE__ */ X(Xt, [["__scopeId", "data-v-adde4158"]]), ea = { class: "action-buttons" }, ta = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (l, t) => (n(), s("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = ee((o) => l.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = T("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      p(r(vt), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (o) => l.$emit("update:reason", o))
      }, null, 8, ["model-value", "disabled"]),
      T("div", ea, [
        p(r(se), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: b(() => [...t[3] || (t[3] = [
            k("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(r(se), {
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (o) => l.$emit("cancel"))
        }, {
          default: b(() => [...t[4] || (t[4] = [
            k("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, aa = /* @__PURE__ */ X(ta, [["__scopeId", "data-v-23a905c0"]]), na = { class: "action-buttons" }, la = {
  key: 0,
  role: "alert"
}, oa = {
  key: 1,
  role: "status"
}, sa = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const l = e, t = Te(), o = H(""), a = H(""), c = H(""), m = H(""), M = H([]), x = H(0), R = H(!1), q = H(!1), E = H(!1), N = H(""), U = H(""), A = i(() => !!l.row.retired_at || l.row.state === "retired"), O = i(() => !A.value && !!l.row.ended_at), W = i(() => {
      var j;
      return O.value && ((j = l.row.job_command) == null ? void 0 : j.length) && !l.row.resume_reason;
    }), Z = i(() => W.value && !q.value && (l.row.job_task_flag ? M.value.some((j) => String(j.id) === m.value) : !!a.value.trim()));
    function J(j) {
      o.value = j, a.value = "", c.value = "", m.value = "", N.value = "", U.value = "";
    }
    async function Y() {
      J("job"), l.row.job_task_flag && (M.value = [], x.value = 0, R.value = !1, await C());
    }
    async function C() {
      if (!q.value) {
        q.value = !0;
        try {
          t.state["jobs.page"] = String(x.value + 1), await t.reload("jobs");
          const j = t.props.jobs;
          N.value = j.failure.value, N.value || (M.value = [...M.value, ...j.rows.value], x.value = j.data.value.page, R.value = j.more.value);
        } finally {
          q.value = !1;
        }
      }
    }
    async function d(j, V) {
      if (!E.value) {
        E.value = !0, N.value = "";
        try {
          const g = await t.run(j);
          N.value = g.ok ? "" : g.error, g.ok && (J(""), U.value = V);
        } finally {
          E.value = !1;
        }
      }
    }
    async function F() {
      if (!Z.value) return;
      const j = l.row.job_task_flag ? [l.row.job_task_flag, m.value] : [a.value.trim()];
      await d([...l.row.job_command, String(l.row.id), ...j], "Job sent.");
    }
    async function B() {
      !O.value || o.value !== "retire" || !c.value.trim() || await d(["agent", "retire", String(l.row.id), "--reason", c.value.trim()], "Agent retired permanently.");
    }
    return (j, V) => {
      var g;
      return A.value ? f("", !0) : (n(), s("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: V[6] || (V[6] = ee(() => {
        }, ["stop"])),
        onKeydown: V[7] || (V[7] = ee(() => {
        }, ["stop"]))
      }, [
        T("div", na, [
          O.value ? (n(), s(P, { key: 0 }, [
            (g = e.row.job_command) != null && g.length ? (n(), D(r(se), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: E.value || q.value || !W.value,
              onClick: Y
            }, {
              default: b(() => [...V[8] || (V[8] = [
                k("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0),
            e.row.role !== "main" ? (n(), D(r(se), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: E.value || q.value,
              onClick: V[0] || (V[0] = (y) => J("retire"))
            }, {
              default: b(() => [...V[9] || (V[9] = [
                k("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0)
          ], 64)) : f("", !0)
        ]),
        p(r(Ue), { value: o.value }, {
          job: b(() => [
            p(_t, {
              task: m.value,
              "onUpdate:task": V[1] || (V[1] = (y) => m.value = y),
              text: a.value,
              "onUpdate:text": V[2] || (V[2] = (y) => a.value = y),
              row: e.row,
              tasks: M.value,
              pending: E.value,
              loading: q.value,
              "more-tasks": R.value,
              failure: N.value,
              "job-ready": Z.value,
              onSubmit: F,
              onMore: C,
              onCancel: V[3] || (V[3] = (y) => J(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: b(() => [
            p(aa, {
              reason: c.value,
              "onUpdate:reason": V[4] || (V[4] = (y) => c.value = y),
              pending: E.value,
              onSubmit: B,
              onCancel: V[5] || (V[5] = (y) => J(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        N.value ? (n(), s("p", la, v(N.value), 1)) : f("", !0),
        U.value ? (n(), s("p", oa, v(U.value), 1)) : f("", !0)
      ], 32));
    };
  }
}, ra = /* @__PURE__ */ X(sa, [["__scopeId", "data-v-4cb32275"]]), ia = { class: "line" }, da = {
  key: 0,
  class: "line",
  "data-agent-since": ""
}, ua = {
  key: 1,
  class: "line",
  "data-agent-seen": ""
}, ca = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" }, seen: { type: String, default: "" } },
  setup(e) {
    const l = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, o = i(() => l.has(t.state)), a = i(() => [t.doing, t.since, t.seen].filter(Boolean).join(". "));
    return (c, m) => (n(), D(r(Ce), {
      as: "button",
      place: "corner",
      class: oe(["agent-dot", { pulse: o.value }]),
      "data-state": e.state,
      "aria-label": a.value,
      "data-agent-status": "",
      onClick: m[0] || (m[0] = ee(() => {
      }, ["stop"]))
    }, {
      tip: b(() => [
        T("b", ia, v(e.doing), 1),
        e.since ? (n(), s("span", da, v(e.since), 1)) : f("", !0),
        e.seen ? (n(), s("span", ua, v(e.seen), 1)) : f("", !0)
      ]),
      default: b(() => [
        m[1] || (m[1] = T("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, ga = /* @__PURE__ */ X(ca, [["__scopeId", "data-v-1a0bc478"]]), va = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, pa = (e) => e.filter((l) => l.state !== "cancelled"), qe = (e, l) => e.filter((t) => t.state === l).length;
function ha({ tasks: e, inHand: l, perHour: t }) {
  const o = pa(e), a = qe(o, "completed"), c = va[l == null ? void 0 : l.state], m = o.length - a - (l && l.state !== "completed" ? 1 : 0), M = a === o.length;
  return {
    number: l.id,
    title: l.title,
    plan: l.plan_id ?? 0,
    count: `${a} of ${o.length}`,
    taskTip: `${a} of its ${o.length} tasks done${c ? `. This one is ${c.words}.` : "."}`,
    countTip: M ? `All ${o.length} tasks done` : `${a} done, 1 in hand, ${m} to go`,
    paceTip: !M && t ? `About ${t} an hour.` : "",
    rate: !M && t ? `${Math.round(t)}/hour` : "",
    bar: { total: o.length, done: a, testing: qe(o, "testing") }
  };
}
const fa = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, ma = {
  class: "task-line",
  "data-agent-task-line": ""
}, ka = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, ba = {
  key: 1,
  class: "rate",
  "data-agent-rate": ""
}, ya = { key: 0 }, wa = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, perHour: { type: Number, default: 0 } },
  setup(e) {
    const l = e, t = i(() => l.inHand ? ha({ tasks: l.tasks, inHand: l.inHand, perHour: l.perHour }) : null);
    return (o, a) => e.job && !t.value ? (n(), s("span", fa, [
      p(r(Ce), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: b(() => [
          T("b", null, v(e.job), 1)
        ]),
        default: b(() => [
          a[1] || (a[1] = k("Job", -1))
        ]),
        _: 1
      })
    ])) : t.value ? (n(), s(P, { key: 1 }, [
      T("span", ma, [
        p(r(Ce), {
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${t.value.number}`,
          "aria-label": `Task ${t.value.number}: ${t.value.title}`,
          onClick: a[0] || (a[0] = ee((c) => r(we)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: b(() => [
            T("b", null, v(t.value.title), 1),
            T("span", null, v(t.value.taskTip), 1)
          ]),
          default: b(() => [
            k("Task " + v(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"]),
        t.value.plan ? (n(), s("span", ka, "Plan " + v(t.value.plan), 1)) : f("", !0),
        t.value.rate ? (n(), s("span", ba, v(t.value.rate), 1)) : f("", !0),
        p(r(Ce), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: b(() => [
            T("b", null, v(t.value.countTip), 1),
            t.value.paceTip ? (n(), s("span", ya, v(t.value.paceTip), 1)) : f("", !0)
          ]),
          default: b(() => [
            k(v(t.value.count), 1)
          ]),
          _: 1
        })
      ]),
      p(r(pt), {
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: t.value.bar.total,
        done: t.value.bar.done,
        testing: t.value.bar.testing
      }, null, 8, ["total", "done", "testing"])
    ], 64)) : f("", !0);
  }
}, Ma = /* @__PURE__ */ X(wa, [["__scopeId", "data-v-ee4957e4"]]), xa = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', $a = ["data-icon", "stroke-width", "innerHTML"], _ = {
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
      agent: xa,
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
    return (c, m) => (n(), s("svg", {
      class: "ico",
      "data-icon": e.name,
      style: Ae({
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
    }, null, 12, $a));
  }
}, Sa = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Ca = {
  key: 1,
  class: "menu-item-text"
}, Aa = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (l, t) => (n(), s("button", {
      type: "button",
      class: oe(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (n(), s("span", Sa, v(e.checked ? "✓" : ""), 1)) : f("", !0),
      e.description ? (n(), s("span", Ca, [
        T("span", null, [
          ye(l.$slots, "default", {}, void 0, !0)
        ]),
        T("small", null, v(e.description), 1)
      ])) : ye(l.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, me = /* @__PURE__ */ X(Aa, [["__scopeId", "data-v-fec99974"]]), Ta = {}, ja = { class: "menu-label" };
function Ba(e, l) {
  return n(), s("span", ja, [
    ye(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ke = /* @__PURE__ */ X(Ta, [["render", Ba], ["__scopeId", "data-v-aa955b3e"]]), Ra = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, La = {
  key: 0,
  class: "skills-none"
}, Ia = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: l }) {
    const t = e, o = l, a = i(() => t.skills.filter((m) => m.state === "loaded")), c = i(() => t.skills.filter((m) => m.state !== "loaded"));
    return (m, M) => (n(), s("div", Ra, [
      p(ke, null, {
        default: b(() => [...M[1] || (M[1] = [
          k("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      a.value.length ? f("", !0) : (n(), s("p", La, "None yet. Compacting the conversation empties this list.")),
      (n(!0), s(P, null, ae(a.value, (x) => (n(), s("p", {
        key: x.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        p(_, {
          name: "book",
          size: 12
        }),
        k(v(x.skill), 1)
      ]))), 128)),
      c.value.length ? (n(), s(P, { key: 1 }, [
        p(ke, null, {
          default: b(() => [...M[2] || (M[2] = [
            k("Still to read", -1)
          ])]),
          _: 1
        }),
        (n(!0), s(P, null, ae(c.value, (x) => (n(), s("p", {
          key: x.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          p(_, {
            name: "book",
            size: 12
          }),
          k(v(x.skill), 1)
        ]))), 128))
      ], 64)) : f("", !0),
      p(me, {
        "data-agent-skills-browse": "",
        onClick: M[0] || (M[0] = (x) => o("browse"))
      }, {
        default: b(() => [...M[3] || (M[3] = [
          k("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Oa = /* @__PURE__ */ X(Ia, [["__scopeId", "data-v-be514d47"]]), Va = ["disabled", "title"], za = { class: "gauge usage" }, Ha = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: l }) {
    const t = e, o = l, a = i(() => t.windows[0] ?? null), c = i(() => a.value && Number.isFinite(a.value.used_percent) ? Math.max(0, Math.min(100, Math.round(a.value.used_percent))) : null), m = i(() => c.value !== null && c.value >= 100), M = i(() => {
      var R;
      return (R = a.value) != null && R.reset_epoch_seconds ? new Date(a.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), x = i(() => m.value ? `At usage limit: the plan's ${a.value.title} allowance is used up${M.value ? `, starts again ${M.value}` : ""}` : `${c.value}% of the plan's ${a.value.title} allowance used${M.value ? `, starts again ${M.value}` : ""}`);
    return (R, q) => c.value !== null ? (n(), s("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: x.value,
      onClick: q[0] || (q[0] = (E) => o("open", E.currentTarget))
    }, [
      p(_, {
        name: "allowance",
        size: 12
      }),
      q[1] || (q[1] = k()),
      T("span", za, [
        T("span", {
          style: Ae({ width: `${c.value}%` })
        }, null, 4)
      ]),
      k(" " + v(m.value ? "At usage limit" : `${c.value}%`), 1)
    ], 8, Va)) : f("", !0);
  }
}, Ea = /* @__PURE__ */ X(Ha, [["__scopeId", "data-v-a36f09dc"]]), Na = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (l, t) => (n(), s("span", {
      class: oe(["badge", e.tone])
    }, v(e.text), 3));
  }
}, Wa = /* @__PURE__ */ X(Na, [["__scopeId", "data-v-9e7e1157"]]), qa = (e, l, t) => Math.max(l, Math.min(t, e)), Ge = /* @__PURE__ */ new WeakMap(), Da = (e, l) => Ge.set(e, l);
function Fa(e, l) {
  for (let t = l; t; t = Ge.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function Pa(e, l) {
  const t = (o) => {
    var c, m;
    const a = ((c = e.value) == null ? void 0 : c.element) || ((m = e.value) == null ? void 0 : m.$el) || e.value;
    a && !Fa(a, o.target) && l(o);
  };
  window.addEventListener("click", t), be(() => window.removeEventListener("click", t));
}
const fe = 8, Ua = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const o = e, a = H(null), c = (u) => u ? `${u}px` : void 0, m = i(() => ({
      minWidth: c(o.minWidth),
      maxWidth: c(o.maxWidth),
      maxHeight: c(o.maxHeight),
      height: c(o.height)
    })), M = H({ w: 0, h: 0 }), x = H(o.anchor ? o.anchor.getBoundingClientRect() : null), R = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), q = (u) => ({
      left: Math.max(0, u.left),
      top: Math.max(0, u.top),
      right: Math.min(window.innerWidth, u.right),
      bottom: Math.min(window.innerHeight, u.bottom)
    }), E = (u) => {
      const L = u.closest(".pane, .float-window");
      return L ? q(L.getBoundingClientRect()) : R();
    }, N = (u, L) => `${Math.max(0, u ? Math.min(u, L) : L)}px`;
    function U(u, L) {
      return {
        below: u.bottom - L.bottom - o.gap - fe,
        above: L.top - u.top - o.gap - fe,
        across: u.right - u.left - 2 * fe
      };
    }
    function A(u) {
      const L = E(o.anchor), z = U(L, u);
      return M.value.w <= z.across && M.value.h <= Math.max(z.below, z.above) ? L : R();
    }
    const O = i(() => {
      if (!x.value) return m.value;
      const u = x.value, L = A(u), z = U(L, u), { w: Q, h } = M.value, S = o.align === "auto" ? u.left + u.right > L.left + L.right : o.align === "right", te = qa(S ? u.right - Q : u.left, L.left + fe, Math.max(L.left + fe, L.right - Q - fe)), K = h > z.below && z.above > z.below ? { bottom: `${window.innerHeight - u.top + o.gap}px`, maxHeight: N(o.maxHeight, z.above) } : { top: `${u.bottom + o.gap}px`, maxHeight: N(o.maxHeight, z.below) };
      return { ...m.value, ...K, left: `${te}px`, maxWidth: N(o.maxWidth, z.across) };
    }), W = t, Z = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function J(u) {
      const L = Z(), z = L.indexOf(document.activeElement);
      L[(z + u + L.length) % L.length].focus();
    }
    const Y = { ArrowDown: () => J(1), ArrowUp: () => J(-1), Escape: () => W("close") }, C = (u) => Y[u.key] && (u.preventDefault(), Y[u.key]()), d = () => a.value && (M.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let F = 0;
    const B = new ResizeObserver(() => {
      cancelAnimationFrame(F), F = requestAnimationFrame(d);
    });
    Pa(a, (u) => o.anchor && !o.anchor.contains(u.target) && W("close"));
    const j = (u, L) => ["top", "left", "right", "bottom"].some((z) => Math.abs(u[z] - L[z]) > 1), V = (u) => u.bottom < 0 || u.top > window.innerHeight;
    let g = 0;
    function y() {
      if (o.anchor) {
        const u = o.anchor.getBoundingClientRect();
        if (!o.anchor.isConnected || V(u)) return W("close");
        j(u, x.value) && (x.value = u);
      }
      g = requestAnimationFrame(y);
    }
    return tt(() => {
      o.anchor && a.value && Da(a.value, o.anchor), d(), a.value && B.observe(a.value), !o.plain && Z()[0] && Z()[0].focus(), y();
    }), be(() => {
      B.disconnect(), cancelAnimationFrame(g), cancelAnimationFrame(F);
    }), l({ element: a }), (u, L) => (n(), D(at, {
      to: "body",
      disabled: !e.anchor
    }, [
      T("div", nt({
        ref_key: "panel",
        ref: a
      }, u.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: O.value,
        onKeydown: C
      }), [
        ye(u.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Ja = /* @__PURE__ */ X(Ua, [["__scopeId", "data-v-3d203970"]]);
async function Ga(e, l, t) {
  if (!e) return t(l);
  const { target: o, fields: a } = e, c = Object.fromEntries(Object.keys(a).map((x) => [x, o[x]])), m = () => Object.assign(o, c);
  Object.assign(o, a);
  let M = !1;
  try {
    const x = await t(l);
    return M = x.ok, x;
  } finally {
    M || m();
  }
}
function Ka(e, l, t, { groups: o, programs: a }) {
  const c = H({}), m = H(""), M = H(!1), x = i(() => !!e.value && !e.value.ended_at), R = i(() => x.value && !!e.value.paused_at);
  async function q(A, O = null) {
    m.value = "";
    const W = await Ga(O, A, l);
    return m.value = W.ok ? "" : W.error, t(), W;
  }
  return { groups: o, programs: a, chosen: c, failure: m, asking: M, running: x, paused: R, choose: (A, O) => q(["agent", "control", String(e.value.id), A, O.value], { target: c, fields: { value: { ...c.value, [A]: O.label } } }), stop: () => (M.value = !1, q(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (A) => q(["agent", "launch", A.name]) };
}
function Za(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const Ya = ["disabled", "title"], Qa = ["disabled", "title"], Xa = { class: "gauge" }, _a = ["disabled", "title"], en = ["disabled"], tn = ["disabled"], an = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, nn = ["title"], ln = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, on = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, sn = { class: "gauge" }, rn = { class: "context-used" }, dn = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, un = 75, cn = {
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
    const t = e, o = l, a = Ka(je(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => o("changed"), { groups: je(t, "controlGroups"), programs: je(t, "agentPrograms") }), c = H(null), m = H(""), M = i(() => a.groups.value.find((C) => C.key === m.value));
    function x(C, d) {
      c.value = C.currentTarget, m.value = d;
    }
    function R() {
      c.value = null, m.value = "", a.asking.value = !1;
    }
    const q = i(() => t.skills.filter((C) => C.state === "loaded"));
    function E(C) {
      x(C, "skills"), o("skills");
    }
    const N = (C) => a.groups.value.some((d) => d.key === C), U = i(() => {
      var C;
      return a.chosen.value.model ?? ((C = O.value) == null ? void 0 : C.model) ?? "";
    }), A = i(() => {
      var C;
      return a.chosen.value.effort ?? ((C = O.value) == null ? void 0 : C.effort) ?? "";
    });
    i(() => !!t.agent && !t.agent.ended_at);
    const O = i(() => {
      var C;
      return ((C = t.usage.agents) == null ? void 0 : C.find((d) => {
        var F;
        return d.id === ((F = t.agent) == null ? void 0 : F.id);
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
        class: oe(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (n(), s(P, { key: 0 }, [
          T("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: d[0] || (d[0] = (B) => x(B, "agent"))
          }, [
            p(_, {
              name: "agents",
              size: 12
            }),
            k(" " + v(((F = e.agentPrograms.find((B) => B.name === e.agent.program)) == null ? void 0 : F.title) || e.agent.program), 1)
          ], 8, Ya),
          p(Ea, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: d[1] || (d[1] = (B) => o("open", "usage", B))
          }, null, 8, ["windows", "disabled"]),
          W.value !== null ? (n(), s("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${W.value}% full: clear or compact it`,
            onClick: d[2] || (d[2] = (B) => N("context") ? x(B, "context") : o("open", "context", B.currentTarget))
          }, [
            p(_, {
              name: "gauge",
              size: 12
            }),
            d[14] || (d[14] = k()),
            T("span", Xa, [
              T("span", {
                style: Ae({ width: `${W.value}%` })
              }, null, 4)
            ]),
            k(" " + v(W.value) + "% ", 1)
          ], 8, Qa)) : f("", !0),
          U.value ? (n(), s("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${U.value}: change the model`,
            onClick: d[3] || (d[3] = (B) => N("model") ? x(B, "model") : null)
          }, [
            p(_, {
              name: "model",
              size: 12
            }),
            k(" " + v(U.value), 1)
          ], 8, _a)) : f("", !0),
          N("effort") || e.card && A.value ? (n(), s("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: d[4] || (d[4] = (B) => x(B, "effort"))
          }, [
            p(_, {
              name: "bolt",
              size: 12
            }),
            k(" " + v(A.value), 1)
          ], 8, en)) : f("", !0),
          Y.value ? (n(), s("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: d[5] || (d[5] = (B) => o("open", "cost", B.currentTarget))
          }, v(Y.value), 9, tn)) : f("", !0),
          e.branch ? (n(), s("span", an, [
            p(_, {
              name: "branch",
              size: 12
            }),
            k(" " + v(e.branch), 1)
          ])) : f("", !0),
          e.card ? f("", !0) : (n(), s("button", {
            key: 5,
            type: "button",
            class: oe(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: d[6] || (d[6] = (B) => o("open", "jobs", B.currentTarget))
          }, [
            p(_, {
              name: "clock",
              size: 12
            }),
            k(" " + v(e.jobs), 1)
          ], 2)),
          e.run ? (n(), s("button", {
            key: 6,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: E
          }, [
            p(_, {
              name: "book",
              size: 12
            }),
            k(" " + v(q.value.length), 1)
          ])) : f("", !0),
          e.fitness ? (n(), s(P, { key: 7 }, [
            T("button", {
              type: "button",
              class: oe(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < un }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: d[7] || (d[7] = (B) => o("open", "fitness", B.currentTarget))
            }, [
              p(_, {
                name: "heart",
                size: 12
              }),
              k(" " + v(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            T("button", {
              type: "button",
              class: oe(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: d[8] || (d[8] = (B) => o("open", "load", B.currentTarget))
            }, [
              p(_, {
                name: "weight",
                size: 12
              }),
              k(" " + v(e.fitness.workload), 1)
            ], 2)
          ], 64)) : f("", !0)
        ], 64)) : e.run && !e.loading ? (n(), s("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: d[9] || (d[9] = (B) => x(B, "start"))
        }, [
          p(_, {
            name: "agents",
            size: 12
          }),
          d[15] || (d[15] = k(" Start an agent", -1))
        ])) : f("", !0),
        d[21] || (d[21] = T("span", { class: "space" }, null, -1)),
        r(a).failure.value ? (n(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: r(a).failure.value
        }, v(r(a).failure.value), 9, nn)) : f("", !0),
        ye(C.$slots, "default", {}, void 0, !0),
        c.value ? (n(), D(Ja, {
          key: 3,
          anchor: c.value,
          "min-width": 190,
          onClose: R
        }, {
          default: b(() => {
            var B;
            return [
              m.value === "agent" ? (n(), s(P, { key: 0 }, [
                r(a).asking.value ? (n(), s(P, { key: 0 }, [
                  p(ke, { "data-agent-stop-ask": "" }, {
                    default: b(() => [...d[16] || (d[16] = [
                      k("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  p(me, {
                    "data-agent-stop-confirm": "",
                    onClick: d[10] || (d[10] = (j) => (R(), r(a).stop()))
                  }, {
                    default: b(() => [...d[17] || (d[17] = [
                      k("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  p(me, {
                    onClick: d[11] || (d[11] = (j) => r(a).asking.value = !1)
                  }, {
                    default: b(() => [...d[18] || (d[18] = [
                      k("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (n(), D(me, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: d[12] || (d[12] = (j) => r(a).asking.value = !0)
                }, {
                  default: b(() => [...d[19] || (d[19] = [
                    k("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : m.value === "start" ? (n(), s(P, { key: 1 }, [
                p(ke, null, {
                  default: b(() => [...d[20] || (d[20] = [
                    k("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (n(!0), s(P, null, ae(r(a).programs.value, (j) => (n(), D(me, {
                  key: j.name,
                  "data-agent-program": j.name,
                  onClick: (V) => (R(), r(a).start(j))
                }, {
                  default: b(() => [
                    k(v(j.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : m.value === "skills" ? (n(), D(Oa, {
                key: 2,
                skills: e.skills,
                onBrowse: d[13] || (d[13] = (j) => (R(), o("open", "skills", null)))
              }, null, 8, ["skills"])) : M.value ? (n(), s(P, { key: 3 }, [
                p(ke, null, {
                  default: b(() => [
                    k(v(M.value.label), 1)
                  ]),
                  _: 1
                }),
                m.value === "context" ? (n(), s(P, { key: 0 }, [
                  T("p", ln, v(r(Za)(((B = O.value) == null ? void 0 : B.last_compaction) ?? null)), 1),
                  T("div", on, [
                    T("span", sn, [
                      T("span", {
                        style: Ae({ width: `${W.value}%` })
                      }, null, 4)
                    ]),
                    T("span", rn, v(W.value) + "%", 1)
                  ]),
                  J.value ? (n(), s("p", dn, [
                    k(v(J.value) + " ", 1),
                    p(Wa, {
                      text: "Capped",
                      tone: "warn"
                    })
                  ])) : f("", !0)
                ], 64)) : f("", !0),
                (n(!0), s(P, null, ae(M.value.choices, (j) => (n(), D(me, {
                  key: j.value,
                  "data-agent-choice": j.value,
                  onClick: (V) => (r(a).choose(M.value.key, j), R())
                }, {
                  default: b(() => [
                    k(v(j.label), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-choice", "onClick"]))), 128))
              ], 64)) : f("", !0)
            ];
          }),
          _: 1
        }, 8, ["anchor"])) : f("", !0)
      ], 2);
    };
  }
}, gn = /* @__PURE__ */ X(cn, [["__scopeId", "data-v-dc15ff96"]]), vn = ["data-agent-open", "aria-expanded", "role", "tabindex"], pn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, hn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, fn = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, mn = { class: "agent-line" }, kn = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, bn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, yn = {
  key: 1,
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, wn = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Mn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), o = { helper: "Helper", reviewer: "Reviewer" }, a = e, c = l, m = Je(), M = i(() => {
      var S, te;
      if ((S = a.facts) != null && S.profile_title) return a.facts.profile_title;
      if ((te = a.facts) != null && te.profile) return a.facts.profile;
      const h = o[a.row.role] || a.row.role;
      return h.slice(0, 1).toUpperCase() + h.slice(1);
    }), x = i(() => {
      var h;
      return ((h = a.facts) == null ? void 0 : h.tasks) ?? [];
    }), R = i(() => x.value.filter((h) => h.state === "open")), q = i(() => x.value.find((h) => {
      var S;
      return h.id === ((S = a.progress) == null ? void 0 : S.task_id) && h.state === "started";
    })), E = i(() => q.value || x.value.find((h) => {
      var S;
      return h.id === ((S = a.facts) == null ? void 0 : S.task_id);
    }) || x.value.find((h) => t.has(h.state)) || R.value[0] || x.value.at(-1)), N = i(() => {
      var h, S, te, re, K, ue;
      return a.row.role === "helper" ? ((h = a.facts) == null ? void 0 : h.helper_job) || "" : (S = a.facts) != null && S.job_enabled && (((te = q.value) == null ? void 0 : te.title) || ((re = a.facts) == null ? void 0 : re.task_title) || ((K = R.value[0]) == null ? void 0 : K.title) || ((ue = x.value.at(-1)) == null ? void 0 : ue.title)) || "";
    }), U = i(() => {
      var h;
      return (h = a.facts) != null && h.job_enabled ? `${a.row.role} ${a.row.id}` : "";
    }), A = i(() => {
      var h, S;
      return [a.row.program, (h = a.facts) == null ? void 0 : h.model, (S = a.facts) == null ? void 0 : S.effort, U.value].filter(Boolean).join(" · ");
    }), O = Te(), W = i(() => ht(a.row.process_started_at || a.row.created_at, m.value)), Z = /* @__PURE__ */ new Set(["open", "started", "testing"]), J = i(() => {
      var h;
      return (h = a.facts) == null ? void 0 : h.work_status;
    }), Y = i(() => !!a.row.ended_at && a.row.role !== "main" && x.value.some((h) => Z.has(h.state))), C = i(() => {
      var h, S;
      return a.row.state === "running" && ((h = a.facts) == null ? void 0 : h.state) === "at usage limit" && !!((S = a.facts) != null && S.usage_limit_ends_at);
    }), d = i(() => `At usage limit: starts again ${new Date(a.facts.usage_limit_ends_at).toLocaleString()}`), F = i(() => {
      var h;
      return a.row.retired_at || a.row.state === "retired" ? "retired" : C.value || J.value || a.waitReason || Y.value ? "waiting" : a.row.state === "running" && ((h = a.facts) == null ? void 0 : h.state) || a.row.state;
    }), B = i(() => {
      var h;
      return C.value ? d.value : J.value ? `Status: ${J.value}` : a.waitReason ? `Waiting: ${a.waitReason}` : F.value === "blocked" ? (h = a.facts) != null && h.blocked_reason ? `Blocked: ${a.facts.blocked_reason}` : "Blocked" : Y.value ? "Stopped with work left" : "";
    }), j = i(() => {
      var h;
      return ((h = a.progress) == null ? void 0 : h.completed_count) ?? x.value.filter((S) => S.state === "completed").length;
    }), V = i(() => {
      var h;
      return ft(j.value, ((h = a.progress) == null ? void 0 : h.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, m.value);
    }), g = i(() => a.row.role === "main" ? 0 : V.value), y = i(() => !!a.row.retired_at || a.row.state === "retired"), u = i(() => y.value ? "Retired" : F.value === "blocked" || F.value === "waiting" ? B.value || (F.value === "blocked" ? "Blocked" : "Waiting") : a.row.ended_at ? "Idle: its process has stopped" : "Working"), L = i(() => {
      var S;
      if (y.value) return a.row.retired_at;
      const h = F.value === "blocked" || F.value === "waiting";
      return a.row.ended_at || h && ((S = a.facts) == null ? void 0 : S.last_activity) || a.row.process_started_at || a.row.created_at;
    }), z = i(() => mt(L.value, m.value)), Q = i(() => {
      var h;
      return kt((h = a.facts) == null ? void 0 : h.last_activity, m.value);
    });
    return (h, S) => {
      var te, re, K, ue, ie;
      return n(), s("div", {
        class: oe(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: S[3] || (S[3] = (ne) => !e.open && c("toggle")),
        onKeydown: [
          S[4] || (S[4] = Ee(ee((ne) => !e.open && c("toggle"), ["self", "prevent"]), ["enter"])),
          S[5] || (S[5] = Ee(ee((ne) => !e.open && c("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        p(r(bt), {
          "agent-id": e.row.id,
          label: M.value,
          class: "agent-head"
        }, {
          default: b(() => {
            var ne;
            return [
              e.open ? (n(), s("button", {
                key: 0,
                type: "button",
                class: "agent-back",
                title: "Back to the list",
                "aria-label": "Back to the list",
                onClick: S[0] || (S[0] = ee((pe) => c("toggle"), ["stop"]))
              }, [
                p(r(Re), {
                  name: "chevronRight",
                  facing: "left",
                  size: 14
                })
              ])) : f("", !0),
              T("span", pn, v(M.value), 1),
              T("span", hn, v(((ne = e.facts) == null ? void 0 : ne.given_name) || e.row.id), 1),
              e.open ? f("", !0) : (n(), D(r(Re), {
                key: 1,
                class: "agent-chevron",
                name: "chevronRight",
                size: 12
              })),
              e.open ? (n(), s("span", fn, v(W.value), 1)) : f("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-id", "label"]),
        T("span", mn, [
          T("span", kn, v(A.value), 1),
          (te = e.facts) != null && te.sandbox_off ? (n(), s("span", bn, "sandbox off")) : f("", !0),
          e.open ? (n(), s("span", yn, [
            S[6] || (S[6] = k("Started ", -1)),
            p(r(We), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : f("", !0),
          e.open && ((re = e.facts) != null && re.last_activity) ? (n(), s("span", wn, [
            S[7] || (S[7] = k("Seen ", -1)),
            p(r(We), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : f("", !0)
        ]),
        e.open ? (n(), D(gn, {
          key: 0,
          "agent-programs": r(O).props.programs.rows.value,
          agent: e.row,
          branch: (K = e.progress) == null ? void 0 : K.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((ue = e.facts) == null ? void 0 : ue.windows) ?? [] },
          card: ""
        }, {
          default: b(() => [
            p(ra, { row: e.row }, null, 8, ["row"]),
            p(r(se), {
              variant: "ghost",
              small: "",
              "data-agent-inspector": "",
              onClick: S[1] || (S[1] = ee((ne) => r(we)(`agents:${e.row.id}`), ["stop"]))
            }, {
              default: b(() => [...S[8] || (S[8] = [
                k("Open inspector", -1)
              ])]),
              _: 1
            }),
            e.row.role === "helper" && !e.row.ended_at ? (n(), D(r(se), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: S[2] || (S[2] = ee((ne) => r(O).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: b(() => [...S[9] || (S[9] = [
                k("Stop", -1)
              ])]),
              _: 1
            })) : f("", !0)
          ]),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : f("", !0),
        e.open ? f("", !0) : (n(), D(Ma, {
          key: 1,
          tasks: x.value,
          "in-hand": e.row.role !== "helper" && ((ie = e.facts) != null && ie.job_enabled) && E.value || null,
          job: e.row.role === "helper" ? N.value : "",
          "per-hour": g.value
        }, null, 8, ["tasks", "in-hand", "job", "per-hour"])),
        p(ga, {
          state: F.value,
          doing: u.value,
          since: z.value,
          seen: Q.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (n(), D(Ut, {
          key: 2,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: x.value,
          "stopped-with-work": Y.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : f("", !0)
      ], 42, vn);
    };
  }
}, xn = /* @__PURE__ */ X(Mn, [["__scopeId", "data-v-1e35ea78"]]), $n = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Sn = ["data-agent-row", "data-agent-lingering"], De = "journal.agents.filters", Fe = 300 * 1e3, Se = "cubic-bezier(0.2, 0.9, 0.25, 1)", Cn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const l = e, t = Te(), { rows: o } = t.props.waits, { rows: a } = t.props.progress, { rows: c, failure: m, loaded: M, more: x } = t.props.agents, R = ($) => a.value.find((I) => I.agent_id === $.id) ?? null, q = ($) => {
      var I;
      return ((I = o.value.find((w) => w.agent_id === $.id)) == null ? void 0 : I.reason) ?? "";
    }, E = H("running"), N = H(""), U = JSON.parse(localStorage.getItem(De) || '{"roles":[],"profiles":[],"programs":[]}'), A = H(U), O = i(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: W } = t.props.programs, Z = i(() => A.value.roles.length + A.value.profiles.length + A.value.programs.length), J = ($, I) => {
      A.value = xt(A.value, $, I);
    }, Y = () => {
      A.value = { roles: [], profiles: [], programs: [] };
    }, C = ($) => $.slice(0, 1).toUpperCase() + $.slice(1);
    de(A, ($) => localStorage.setItem(De, JSON.stringify($)));
    const d = H(25);
    function F() {
      Object.assign(t.state, {
        "agents.show": E.value,
        "agents.search": N.value,
        "agents.limit": String(d.value),
        "agents.roles": A.value.roles.join(","),
        "agents.profiles": A.value.profiles.join(","),
        "agents.programs": A.value.programs.join(",")
      });
    }
    async function B() {
      return d.value += 25, F(), await t.reload("agents"), !0;
    }
    de([E, N, A], () => {
      d.value = 25, F(), t.reload("agents");
    }), F();
    const j = ($) => $.facts ?? null, V = c, g = Je(), y = H([]), u = i(() => new Set(y.value.filter(($) => g.value - $.left < Fe).map(($) => $.row.id))), L = i(() => y.value.filter(($) => u.value.has($.row.id)).map(($) => $.row)), z = i(() => [...V.value, ...L.value]);
    let Q = "", h = [];
    async function S($) {
      await t.reload(`card.${$.id}`);
      const I = t.props[`card.${$.id}`].rows.value.find((w) => w.id === $.id);
      I != null && I.ended_at && !y.value.some((w) => w.row.id === $.id) && (y.value = [...y.value, { row: I, left: Date.now() }]);
    }
    de(c, ($) => {
      const I = Q === `${E.value}|${N.value}|${JSON.stringify(A.value)}` && E.value === "running", w = I ? h.filter((G) => !$.some((ge) => ge.id === G.id)) : [];
      Q = `${E.value}|${N.value}|${JSON.stringify(A.value)}`, h = $, y.value = I ? y.value.filter((G) => g.value - G.left < Fe && !$.some((ge) => ge.id === G.row.id)) : [], w.forEach(S);
    }, { immediate: !0 });
    const te = i(() => !!N.value.trim() || Z.value > 0), re = i(() => l.texts[E.value] ?? { title: l.empty, hint: "" }), K = H(null), ue = H(null), ie = H(null), ne = H(null), pe = i(() => K.value === null ? null : t.props[`card.${K.value}`].rows.value.find(($) => $.id === K.value) ?? ue.value), Ie = i(() => pe.value ? [pe.value] : z.value), Me = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, ce = H(!1);
    let Oe = 0;
    async function Ke($) {
      if (ce.value) return;
      ce.value = !0, Oe = ne.value.scrollTop;
      const I = ie.value.querySelector(`[data-agent-open="${$.id}"]`);
      if (!Me()) {
        const ve = [...ie.value.querySelectorAll(".agent-row")].filter((le) => !le.contains(I));
        await Promise.all(ve.map((le) => le.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const w = [...I.querySelectorAll(".agent-head, .agent-line")], G = [...w, ...I.querySelectorAll("[data-agent-motion]")], ge = G.map((ve) => ve.getBoundingClientRect());
      if (ue.value = $, K.value = $.id, t.reload(`card.${$.id}`), await Ne(), !Me()) {
        const ve = G.map((le) => le.getBoundingClientRect());
        G.forEach((le, xe) => {
          const he = w.findIndex((He) => He !== le && He.contains(le)), Ye = ge[xe].left - ve[xe].left - (he < 0 ? 0 : ge[he].left - ve[he].left), Qe = ge[xe].top - ve[xe].top - (he < 0 ? 0 : ge[he].top - ve[he].top);
          le.animate([{ transform: `translate(${Ye}px, ${Qe}px)` }, { transform: "none" }], { duration: 280, easing: Se });
        }), ie.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((le) => {
          le.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Se, fill: "backwards" });
        });
      }
      ce.value = !1;
    }
    async function Ve() {
      if (ce.value || !pe.value) return;
      ce.value = !0;
      const $ = ie.value.querySelector(`[data-agent-open="${K.value}"]`), I = [...$.children], w = Me() ? [] : I.map((G) => G.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(w.map((G) => G.finished)), K.value = null, await Ne(), ne.value.scrollTop = Oe, w.forEach((G) => G.cancel()), Me() || ($.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Se }), ie.value.querySelectorAll(".agent-row").forEach((G) => {
        G.contains($) || G.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Se });
      })), ce.value = !1;
    }
    const Ze = ($) => K.value === $.id ? Ve() : Ke($);
    de(N, ($) => $.trim() && (K.value = null)), de(E, () => {
      K.value = null;
    });
    const ze = ($) => {
      $.key === "Escape" && Ve();
    };
    return window.addEventListener("keydown", ze), be(() => window.removeEventListener("keydown", ze)), ($, I) => (n(), s("div", {
      ref_key: "agents",
      ref: ie,
      class: oe(["agents", { focused: pe.value, "card-changing": ce.value }])
    }, [
      p(r(yt), {
        modelValue: N.value,
        "onUpdate:modelValue": I[1] || (I[1] = (w) => N.value = w),
        placeholder: "Search agents",
        "menu-count": Z.value,
        "data-agents-search": ""
      }, {
        menu: b(() => [
          p(r(Be), null, {
            default: b(() => [...I[2] || (I[2] = [
              k("Type", -1)
            ])]),
            _: 1
          }),
          (n(!0), s(P, null, ae(O.value.roles, (w) => (n(), D(r($e), {
            key: w,
            role: "menuitemcheckbox",
            "aria-checked": A.value.roles.includes(w),
            checked: A.value.roles.includes(w),
            "data-filter-role": w,
            onClick: (G) => J("roles", w)
          }, {
            default: b(() => [
              k(v(C(w)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          O.value.profiles.length ? (n(), D(r(Be), { key: 0 }, {
            default: b(() => [...I[3] || (I[3] = [
              k("Profile", -1)
            ])]),
            _: 1
          })) : f("", !0),
          (n(!0), s(P, null, ae(O.value.profiles, (w) => (n(), D(r($e), {
            key: w.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.profiles.includes(w.name),
            checked: A.value.profiles.includes(w.name),
            "data-filter-profile": w.name,
            onClick: (G) => J("profiles", w.name)
          }, {
            default: b(() => [
              k(v(w.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          p(r(Be), null, {
            default: b(() => [...I[4] || (I[4] = [
              k("Program", -1)
            ])]),
            _: 1
          }),
          (n(!0), s(P, null, ae(r(W), (w) => (n(), D(r($e), {
            key: w.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.programs.includes(w.name),
            checked: A.value.programs.includes(w.name),
            "data-filter-program": w.name,
            onClick: (G) => J("programs", w.name)
          }, {
            default: b(() => [
              k(v(w.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          Z.value ? (n(), D(r($e), {
            key: 1,
            "data-filter-clear": "",
            onClick: Y
          }, {
            default: b(() => [...I[5] || (I[5] = [
              k("Clear filters", -1)
            ])]),
            _: 1
          })) : f("", !0)
        ]),
        default: b(() => [
          p(r(wt), {
            options: O.value.states,
            value: E.value,
            onPick: I[0] || (I[0] = (w) => E.value = w)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      E.value === "retired" && O.value.upgrade_retired ? (n(), s("p", $n, "Retired during the upgrade: " + v(O.value.upgrade_retired), 1)) : f("", !0),
      T("div", {
        ref_key: "list",
        ref: ne,
        class: oe(["agents-view", { "agents-view-open": pe.value }])
      }, [
        r(M) && !r(m) && !Ie.value.length && Z.value ? (n(), D(r(Le), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: b(() => [
            p(r(se), {
              small: "",
              "data-empty-clear": "",
              onClick: Y
            }, {
              default: b(() => [...I[6] || (I[6] = [
                k("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (n(), D(r(Mt), {
          key: 1,
          moves: "",
          "leaves-at-once": ce.value,
          rows: Ie.value,
          failure: r(m),
          loaded: r(M),
          more: !pe.value && r(x),
          older: B,
          empty: re.value.title,
          hint: re.value.hint,
          searching: te.value
        }, {
          default: b(({ row: w }) => [
            T("div", {
              class: oe(["agent-row", { lingering: u.value.has(w.id) && w.id !== K.value }]),
              "data-agent-row": w.id,
              "data-agent-lingering": u.value.has(w.id) ? "" : null
            }, [
              p(xn, {
                row: w,
                facts: j(w),
                progress: R(w),
                "wait-reason": q(w),
                open: w.id === K.value,
                onToggle: (G) => Ze(w)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, Sn)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, Bn = /* @__PURE__ */ X(Cn, [["__scopeId", "data-v-2cc349bb"]]);
export {
  Bn as A
};
