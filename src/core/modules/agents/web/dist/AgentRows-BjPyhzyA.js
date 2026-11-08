/* @code-commandments-generated */
import { openBlock as n, createElementBlock as o, withModifiers as oe, unref as u, createTextVNode as k, toDisplayString as p, createVNode as M, createBlock as F, withCtx as $, Fragment as I, renderList as Q, createElementVNode as v, createCommentVNode as y, computed as h, ref as R, watch as ue, onUnmounted as ye, defineAsyncComponent as Ge, createSlots as Ze, resolveDynamicComponent as Ye, normalizeClass as le, normalizeStyle as ve, renderSlot as be, onMounted as _e, Teleport as Qe, mergeProps as Xe, toRef as Te, withKeys as Be, useModel as et, mergeModels as tt, nextTick as ze } from "vue";
import { peekRef as Ae, Icon as we, RunningCommand as at, FoldGroup as Ee, TaskStatusIcon as nt, useWindow as he, loadWindowComponent as lt, coalesced as ot, READ_RATES as st, InnerTabs as rt, TabBody as it, SwitchCase as He, EmptyState as Le, Btn as ae, TextArea as ut, TextInput as dt, HoverTip as Se, useNow as Ne, age as We, perHour as ct, ago as vt, TimeAgo as Ie, Dialog as pt, SearchBar as gt, Segmented as ft, MenuLabel as je, MenuItem as xe, RowList as mt, toggleFilter as ht } from "@journal/window-kit";
import { _, T as kt } from "./TranscriptRows-CG9aRNTl.js";
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
        onClick: a[0] || (a[0] = oe((s) => u(Ae)("test_queue:0"), ["stop"]))
      }, [
        k("Waiting: " + p(e.waitReason) + " ", 1),
        M(u(we), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (n(), o("span", bt, "Waiting")) : (n(), F(u(at), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, Mt = /* @__PURE__ */ _(wt, [["__scopeId", "data-v-1b371fb5"]]), $t = ["data-agent-delegated", "onClick"], xt = { class: "agent-task-number" }, Ct = { class: "agent-task-title" }, St = ["title"], At = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const a = l;
    return (s, t) => (n(), F(u(Ee), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: t[0] || (t[0] = (r) => a("toggle"))
    }, {
      default: $(() => [
        (n(!0), o(I, null, Q(e.section.tasks, (r) => (n(), o("button", {
          key: r.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": r.id,
          onClick: (c) => u(Ae)(`tasks:${r.id}`)
        }, [
          M(u(nt), {
            status: r.state
          }, null, 8, ["status"]),
          v("span", xt, p(r.id), 1),
          v("span", Ct, p(r.title), 1),
          r.plan_id ? (n(), o("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${r.plan_id}: ${r.plan_title}`
          }, "Plan " + p(r.plan_id) + ": " + p(r.plan_title), 9, St)) : y("", !0)
        ], 8, $t))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Tt = /* @__PURE__ */ _(At, [["__scopeId", "data-v-238ff959"]]), jt = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Lt = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Ot = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, Rt = ["data-peek", "onClick"], Bt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, zt = {
  key: 0,
  class: "agent-helper-brief"
}, It = {
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
    const l = e, a = ["started", "blocked", "open", "completed"], s = h(() => {
      var g, L;
      return l.row.ended_at && ((L = (g = l.facts) == null ? void 0 : g.job_returned) != null && L.startsWith(Et)) ? l.facts.job_returned : "";
    }), t = h(() => l.tasks.length ? a.map((g) => ({ state: g, label: g.slice(0, 1).toUpperCase() + g.slice(1), tasks: l.tasks.filter((L) => L.state === g || g === "started" && L.state === "testing" || g === "completed" && L.state === "cancelled") })) : []), r = /* @__PURE__ */ new Set(["completed"]), c = R({}), x = (g) => !(c.value[g] ?? r.has(g)), w = (g) => c.value = { ...c.value, [g]: x(g) }, S = he(), { rows: V } = S.props.reports;
    S.state["reports.agent"] = String(l.row.id);
    const P = h(() => l.row.access === "read-only"), W = h(() => !!l.row.retired_at || l.row.state === "retired"), U = ["tasks", "transcript", "terminal", "file-feed", "reports"], j = h(() => (W.value ? S.tabs.filter((L) => ["reports", "transcript"].includes(L.key)) : P.value ? S.tabs.filter((L) => ["reports", "transcript", "terminal"].includes(L.key)) : [...S.tabs]).sort((L, J) => (U.indexOf(L.key) < 0 ? U.length : U.indexOf(L.key)) - (U.indexOf(J.key) < 0 ? U.length : U.indexOf(J.key)))), E = () => P.value || W.value ? j.value.find((g) => g.key === "transcript") : j.value[0], H = R(E());
    ue(H, (g) => {
      S.state.tab = (g == null ? void 0 : g.key) ?? "";
    }, { immediate: !0 }), ye(() => {
      S.state.tab = "";
    }), ue(j, (g) => {
      g.some((L) => {
        var J;
        return L.key === ((J = H.value) == null ? void 0 : J.key);
      }) || (H.value = g[0]);
    }), ue(() => l.open, (g) => {
      g && (H.value = E());
    });
    const Y = Object.fromEntries(S.tabs.filter((g) => g.component).map((g) => [g.key, Ge(() => lt(g.component))])), A = R(!1), { data: f } = S.props.tool, K = h(() => {
      var g;
      return ((g = f.value) == null ? void 0 : g.tool) ?? "";
    }), O = h(() => {
      var g;
      return ((g = f.value) == null ? void 0 : g.note) ?? "";
    }), N = h(() => l.row.role !== "main" && (!l.row.ended_at || l.stoppedWithWork || l.waitReason));
    async function te() {
      !l.open || !N.value || (S.state["tool.agent"] = String(l.row.id), await S.reload("tool"));
    }
    const G = S.follow(["hook_call.*", "process_part.*"], ot(te, st.agentCommand));
    return ye(() => G == null ? void 0 : G()), ue(() => l.open, (g) => {
      g && te();
    }, { immediate: !0 }), (g, L) => {
      var J;
      return n(), o("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: L[2] || (L[2] = oe(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (n(), o("p", jt, "Retirement reason: " + p(e.row.retirement_reason), 1)) : y("", !0),
        e.row.resume_reason ? (n(), o("p", Lt, p(e.row.resume_reason), 1)) : y("", !0),
        N.value ? (n(), F(Mt, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: K.value,
          note: O.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : y("", !0),
        s.value ? (n(), o("p", Ot, p(s.value), 1)) : y("", !0),
        M(u(rt), {
          class: "agent-tabs",
          tabs: j.value,
          active: H.value,
          answer: { tasks: e.tasks.length, reports: u(V).length },
          onChoose: L[0] || (L[0] = (m) => H.value = m)
        }, null, 8, ["tabs", "active", "answer"]),
        M(u(it), {
          class: "agent-tab-body",
          tab: H.value,
          "data-agent-tab-body": (J = H.value) == null ? void 0 : J.key
        }, {
          default: $(() => {
            var m;
            return [
              M(u(He), {
                value: (m = H.value) == null ? void 0 : m.key
              }, Ze({
                reports: $(() => [
                  u(V).length ? y("", !0) : (n(), F(u(Le), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: $(() => [...L[3] || (L[3] = [
                      k("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (n(!0), o(I, null, Q(u(V), (T) => (n(), o("button", {
                    key: T.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${T.id}`,
                    onClick: (q) => u(Ae)(`messages:${T.id}`)
                  }, p(T.text), 9, Rt))), 128))
                ]),
                tasks: $(() => {
                  var T;
                  return [
                    e.tasks.length ? y("", !0) : (n(), F(u(Le), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: $(() => [...L[4] || (L[4] = [
                        k("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (n(!0), o(I, null, Q(t.value, (q) => (n(), F(Tt, {
                      key: q.state,
                      section: q,
                      open: x(q.state),
                      onToggle: (C) => w(q.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (T = e.facts) != null && T.instruction ? (n(), o(I, { key: 1 }, [
                      L[5] || (L[5] = v("p", { class: "agent-label" }, "Instruction", -1)),
                      v("div", Bt, p(e.facts.instruction), 1)
                    ], 64)) : y("", !0)
                  ];
                }),
                transcript: $(() => {
                  var T;
                  return [
                    P.value ? (n(), o(I, { key: 0 }, [
                      (T = e.facts) != null && T.instruction ? (n(), o("div", zt, [
                        M(u(Ee), {
                          label: "Instruction",
                          open: A.value,
                          "data-agent-section": "instruction",
                          onToggle: L[1] || (L[1] = (q) => A.value = !A.value)
                        }, {
                          default: $(() => [
                            v("div", It, p(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (n(), o("p", Vt, "No job recorded")) : y("", !0)
                    ], 64)) : y("", !0),
                    M(kt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                Q(u(Y), (T, q) => ({
                  name: q,
                  fn: $(() => [
                    (n(), F(Ye(T), {
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
}, Nt = /* @__PURE__ */ _(Ht, [["__scopeId", "data-v-3f66c406"]]), Wt = { class: "action-field" }, qt = ["value", "disabled"], Dt = ["value"], Ft = { key: 1 }, Pt = {
  key: 1,
  class: "action-field"
}, Ut = { class: "action-buttons" }, Kt = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (l, a) => (n(), o("form", {
      onSubmit: a[4] || (a[4] = oe((s) => l.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (n(), o(I, { key: 0 }, [
        v("label", Wt, [
          a[6] || (a[6] = k("Task ", -1)),
          v("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: a[0] || (a[0] = (s) => l.$emit("update:task", s.target.value))
          }, [
            a[5] || (a[5] = v("option", { value: "" }, "Choose an open task", -1)),
            (n(!0), o(I, null, Q(e.tasks, (s) => (n(), o("option", {
              key: s.id,
              value: String(s.id)
            }, p(s.id) + ": " + p(s.title), 9, Dt))), 128))
          ], 40, qt)
        ]),
        e.moreTasks ? (n(), F(u(ae), {
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
        !e.loading && !e.tasks.length && !e.failure ? (n(), o("p", Ft, "No open tasks.")) : y("", !0)
      ], 64)) : (n(), o("label", Pt, [
        a[8] || (a[8] = k("Job", -1)),
        M(u(ut), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: a[2] || (a[2] = (s) => l.$emit("update:text", s.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      v("div", Ut, [
        M(u(ae), {
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
        M(u(ae), {
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
}, Jt = /* @__PURE__ */ _(Kt, [["__scopeId", "data-v-adde4158"]]), Gt = { class: "action-buttons" }, Zt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (l, a) => (n(), o("form", {
      "data-agent-retire-confirm": "",
      onSubmit: a[2] || (a[2] = oe((s) => l.$emit("submit"), ["prevent"]))
    }, [
      a[5] || (a[5] = v("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      M(u(dt), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": a[0] || (a[0] = (s) => l.$emit("update:reason", s))
      }, null, 8, ["model-value", "disabled"]),
      v("div", Gt, [
        M(u(ae), {
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
        M(u(ae), {
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
}, qe = /* @__PURE__ */ _(Zt, [["__scopeId", "data-v-23a905c0"]]), Yt = { class: "action-buttons" }, _t = {
  key: 0,
  role: "alert"
}, Qt = {
  key: 1,
  role: "status"
}, Xt = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const l = e, a = he(), s = R(""), t = R(""), r = R(""), c = R(""), x = R([]), w = R(0), S = R(!1), V = R(!1), P = R(!1), W = R(""), U = R(""), j = h(() => !!l.row.retired_at || l.row.state === "retired"), E = h(() => !j.value && !!l.row.ended_at), H = h(() => {
      var G;
      return E.value && ((G = l.row.job_command) == null ? void 0 : G.length) && !l.row.resume_reason;
    }), Y = h(() => H.value && !V.value && (l.row.job_task_flag ? x.value.some((G) => String(G.id) === c.value) : !!t.value.trim()));
    function A(G) {
      s.value = G, t.value = "", r.value = "", c.value = "", W.value = "", U.value = "";
    }
    async function f() {
      A("job"), l.row.job_task_flag && (x.value = [], w.value = 0, S.value = !1, await K());
    }
    async function K() {
      if (!V.value) {
        V.value = !0;
        try {
          a.state["jobs.page"] = String(w.value + 1), await a.reload("jobs");
          const G = a.props.jobs;
          W.value = G.failure.value, W.value || (x.value = [...x.value, ...G.rows.value], w.value = G.data.value.page, S.value = G.more.value);
        } finally {
          V.value = !1;
        }
      }
    }
    async function O(G, g) {
      if (!P.value) {
        P.value = !0, W.value = "";
        try {
          const L = await a.run(G);
          W.value = L.ok ? "" : L.error, L.ok && (A(""), U.value = g);
        } finally {
          P.value = !1;
        }
      }
    }
    async function N() {
      if (!Y.value) return;
      const G = l.row.job_task_flag ? [l.row.job_task_flag, c.value] : [t.value.trim()];
      await O([...l.row.job_command, String(l.row.id), ...G], "Job sent.");
    }
    async function te() {
      !E.value || s.value !== "retire" || !r.value.trim() || await O(["agent", "retire", String(l.row.id), "--reason", r.value.trim()], "Agent retired permanently.");
    }
    return (G, g) => {
      var L;
      return j.value ? y("", !0) : (n(), o("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: g[6] || (g[6] = oe(() => {
        }, ["stop"])),
        onKeydown: g[7] || (g[7] = oe(() => {
        }, ["stop"]))
      }, [
        v("div", Yt, [
          E.value ? (n(), o(I, { key: 0 }, [
            (L = e.row.job_command) != null && L.length ? (n(), F(u(ae), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: P.value || V.value || !H.value,
              onClick: f
            }, {
              default: $(() => [...g[8] || (g[8] = [
                k("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : y("", !0),
            e.row.role !== "main" ? (n(), F(u(ae), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: P.value || V.value,
              onClick: g[0] || (g[0] = (J) => A("retire"))
            }, {
              default: $(() => [...g[9] || (g[9] = [
                k("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : y("", !0)
          ], 64)) : y("", !0)
        ]),
        M(u(He), { value: s.value }, {
          job: $(() => [
            M(Jt, {
              task: c.value,
              "onUpdate:task": g[1] || (g[1] = (J) => c.value = J),
              text: t.value,
              "onUpdate:text": g[2] || (g[2] = (J) => t.value = J),
              row: e.row,
              tasks: x.value,
              pending: P.value,
              loading: V.value,
              "more-tasks": S.value,
              failure: W.value,
              "job-ready": Y.value,
              onSubmit: N,
              onMore: K,
              onCancel: g[3] || (g[3] = (J) => A(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: $(() => [
            M(qe, {
              reason: r.value,
              "onUpdate:reason": g[4] || (g[4] = (J) => r.value = J),
              pending: P.value,
              onSubmit: te,
              onCancel: g[5] || (g[5] = (J) => A(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        W.value ? (n(), o("p", _t, p(W.value), 1)) : y("", !0),
        U.value ? (n(), o("p", Qt, p(U.value), 1)) : y("", !0)
      ], 32));
    };
  }
}, ea = /* @__PURE__ */ _(Xt, [["__scopeId", "data-v-4cb32275"]]), ta = { key: 0 }, aa = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" } },
  setup(e) {
    const l = /* @__PURE__ */ new Set(["running", "working", "thinking"]), a = e, s = h(() => l.has(a.state)), t = h(() => a.since ? `${a.doing}. ${a.since}` : a.doing);
    return (r, c) => (n(), F(u(Se), {
      as: "button",
      place: "corner",
      class: le(["agent-dot", { pulse: s.value }]),
      "data-state": e.state,
      "aria-label": t.value,
      "data-agent-status": "",
      onClick: c[0] || (c[0] = oe(() => {
      }, ["stop"]))
    }, {
      tip: $(() => [
        v("b", null, p(e.doing), 1),
        e.since ? (n(), o("span", ta, p(e.since), 1)) : y("", !0)
      ]),
      default: $(() => [
        c[1] || (c[1] = v("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, na = /* @__PURE__ */ _(aa, [["__scopeId", "data-v-8d827ded"]]), De = { started: { fill: 33, words: "started" }, testing: { fill: 66, words: "being tested" }, blocked: { fill: 33, words: "blocked" } }, la = 30, Fe = (e) => e.filter((l) => l.state !== "cancelled");
function oa(e, l) {
  const a = Fe(e), s = De[l == null ? void 0 : l.state];
  return a.length > la ? { continuous: !0, done: a.filter((c) => c.state === "completed").length / a.length * 100, now: s ? s.fill / 100 / a.length * 100 : 0, segments: [] } : { continuous: !1, done: 0, now: 0, segments: a.map((r) => r.state === "completed" ? { kind: "done", fill: 0 } : r.id === (l == null ? void 0 : l.id) && s ? { kind: "now", fill: s.fill } : { kind: "todo", fill: 0 }) };
}
function sa({ tasks: e, inHand: l, perHour: a }) {
  const s = Fe(e), t = s.filter((w) => w.state === "completed").length, r = De[l == null ? void 0 : l.state], c = s.length - t - (l && l.state !== "completed" ? 1 : 0), x = t === s.length;
  return {
    number: l.id,
    title: l.title,
    count: `${t} of ${s.length}`,
    taskTip: `${t} of its ${s.length} tasks done${r ? `. This one is ${r.words}.` : "."}`,
    countTip: x ? `All ${s.length} tasks done` : `${t} done, 1 in hand, ${c} to go`,
    paceTip: !x && a ? `About ${a} an hour.` : "",
    bar: oa(e, l)
  };
}
const ra = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, ia = {
  class: "task-line",
  "data-agent-task-line": ""
}, ua = { key: 0 }, da = ["data-state"], ca = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, state: { type: String, required: !0 }, perHour: { type: Number, default: 0 } },
  setup(e) {
    const l = e, a = h(() => l.inHand ? sa({ tasks: l.tasks, inHand: l.inHand, perHour: l.perHour }) : null);
    return (s, t) => e.job && !a.value ? (n(), o("span", ra, [
      M(u(Se), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: $(() => [
          v("b", null, p(e.job), 1)
        ]),
        default: $(() => [
          t[1] || (t[1] = k("Job", -1))
        ]),
        _: 1
      })
    ])) : a.value ? (n(), o(I, { key: 1 }, [
      v("span", ia, [
        M(u(Se), {
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${a.value.number}`,
          "aria-label": `Task ${a.value.number}: ${a.value.title}`,
          onClick: t[0] || (t[0] = oe((r) => u(Ae)(`tasks:${a.value.number}`), ["stop"]))
        }, {
          tip: $(() => [
            v("b", null, p(a.value.title), 1),
            v("span", null, p(a.value.taskTip), 1)
          ]),
          default: $(() => [
            k("Task " + p(a.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"]),
        M(u(Se), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: $(() => [
            v("b", null, p(a.value.countTip), 1),
            a.value.paceTip ? (n(), o("span", ua, p(a.value.paceTip), 1)) : y("", !0)
          ]),
          default: $(() => [
            k(p(a.value.count), 1)
          ]),
          _: 1
        })
      ]),
      v("span", {
        class: le(["bar", { continuous: a.value.bar.continuous }]),
        "data-state": e.state,
        style: ve(a.value.bar.continuous ? { "--done": `${a.value.bar.done}%`, "--now": `${a.value.bar.now}%` } : void 0),
        "data-agent-bar": "",
        "aria-hidden": "true"
      }, [
        (n(!0), o(I, null, Q(a.value.bar.segments, (r, c) => (n(), o("i", {
          key: c,
          class: le(r.kind),
          style: ve(r.kind === "now" ? { "--fill": `${r.fill}%` } : void 0)
        }, null, 6))), 128))
      ], 14, da)
    ], 64)) : y("", !0);
  }
}, va = /* @__PURE__ */ _(ca, [["__scopeId", "data-v-357b6ada"]]), pa = ["data-icon", "stroke-width", "innerHTML"], ne = {
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
      style: ve({
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
    }, null, 12, pa));
  }
}, ga = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, fa = {
  key: 1,
  class: "menu-item-text"
}, ma = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (l, a) => (n(), o("button", {
      type: "button",
      class: le(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (n(), o("span", ga, p(e.checked ? "✓" : ""), 1)) : y("", !0),
      e.description ? (n(), o("span", fa, [
        v("span", null, [
          be(l.$slots, "default", {}, void 0, !0)
        ]),
        v("small", null, p(e.description), 1)
      ])) : be(l.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, me = /* @__PURE__ */ _(ma, [["__scopeId", "data-v-fec99974"]]), ha = {}, ka = { class: "menu-label" };
function ya(e, l) {
  return n(), o("span", ka, [
    be(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ke = /* @__PURE__ */ _(ha, [["render", ya], ["__scopeId", "data-v-aa955b3e"]]), ba = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, wa = {
  key: 0,
  class: "skills-none"
}, Ma = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: l }) {
    const a = e, s = l, t = h(() => a.skills.filter((c) => c.state === "loaded")), r = h(() => a.skills.filter((c) => c.state !== "loaded"));
    return (c, x) => (n(), o("div", ba, [
      M(ke, null, {
        default: $(() => [...x[1] || (x[1] = [
          k("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      t.value.length ? y("", !0) : (n(), o("p", wa, "None yet. Compacting the conversation empties this list.")),
      (n(!0), o(I, null, Q(t.value, (w) => (n(), o("p", {
        key: w.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        M(ne, {
          name: "book",
          size: 12
        }),
        k(p(w.skill), 1)
      ]))), 128)),
      r.value.length ? (n(), o(I, { key: 1 }, [
        M(ke, null, {
          default: $(() => [...x[2] || (x[2] = [
            k("Still to read", -1)
          ])]),
          _: 1
        }),
        (n(!0), o(I, null, Q(r.value, (w) => (n(), o("p", {
          key: w.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          M(ne, {
            name: "book",
            size: 12
          }),
          k(p(w.skill), 1)
        ]))), 128))
      ], 64)) : y("", !0),
      M(me, {
        "data-agent-skills-browse": "",
        onClick: x[0] || (x[0] = (w) => s("browse"))
      }, {
        default: $(() => [...x[3] || (x[3] = [
          k("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, $a = /* @__PURE__ */ _(Ma, [["__scopeId", "data-v-be514d47"]]), xa = ["disabled", "title"], Ca = { class: "gauge usage" }, Sa = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: l }) {
    const a = e, s = l, t = h(() => a.windows[0] ?? null), r = h(() => t.value ? Math.max(0, Math.min(100, Math.round(t.value.used_percent))) : null), c = h(() => r.value !== null && r.value >= 100), x = h(() => {
      var S;
      return (S = t.value) != null && S.reset_epoch_seconds ? new Date(t.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), w = h(() => c.value ? `At usage limit: the plan's ${t.value.title} allowance is used up${x.value ? `, starts again ${x.value}` : ""}` : `${r.value}% of the plan's ${t.value.title} allowance used${x.value ? `, starts again ${x.value}` : ""}`);
    return (S, V) => r.value !== null ? (n(), o("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: w.value,
      onClick: V[0] || (V[0] = (P) => s("open", P.currentTarget))
    }, [
      M(ne, {
        name: "allowance",
        size: 12
      }),
      V[1] || (V[1] = k()),
      v("span", Ca, [
        v("span", {
          style: ve({ width: `${r.value}%` })
        }, null, 4)
      ]),
      k(" " + p(c.value ? "At usage limit" : `${r.value}%`), 1)
    ], 8, xa)) : y("", !0);
  }
}, Aa = /* @__PURE__ */ _(Sa, [["__scopeId", "data-v-1fff5e1b"]]), Ta = (e, l, a) => Math.max(l, Math.min(a, e)), Pe = /* @__PURE__ */ new WeakMap(), ja = (e, l) => Pe.set(e, l);
function La(e, l) {
  for (let a = l; a; a = Pe.get(a) ?? a.parentElement) if (a === e) return !0;
  return !1;
}
function Oa(e, l) {
  const a = (s) => {
    var r, c;
    const t = ((r = e.value) == null ? void 0 : r.element) || ((c = e.value) == null ? void 0 : c.$el) || e.value;
    t && !La(t, s.target) && l(s);
  };
  window.addEventListener("click", a), ye(() => window.removeEventListener("click", a));
}
const fe = 8, Ra = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, t = R(null), r = (m) => m ? `${m}px` : void 0, c = h(() => ({
      minWidth: r(s.minWidth),
      maxWidth: r(s.maxWidth),
      maxHeight: r(s.maxHeight),
      height: r(s.height)
    })), x = R({ w: 0, h: 0 }), w = R(s.anchor ? s.anchor.getBoundingClientRect() : null), S = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), V = (m) => ({
      left: Math.max(0, m.left),
      top: Math.max(0, m.top),
      right: Math.min(window.innerWidth, m.right),
      bottom: Math.min(window.innerHeight, m.bottom)
    }), P = (m) => {
      const T = m.closest(".pane, .float-window");
      return T ? V(T.getBoundingClientRect()) : S();
    }, W = (m, T) => `${Math.max(0, m ? Math.min(m, T) : T)}px`;
    function U(m, T) {
      return {
        below: m.bottom - T.bottom - s.gap - fe,
        above: T.top - m.top - s.gap - fe,
        across: m.right - m.left - 2 * fe
      };
    }
    function j(m) {
      const T = P(s.anchor), q = U(T, m);
      return x.value.w <= q.across && x.value.h <= Math.max(q.below, q.above) ? T : S();
    }
    const E = h(() => {
      if (!w.value) return c.value;
      const m = w.value, T = j(m), q = U(T, m), { w: C, h: i } = x.value, d = s.align === "auto" ? m.left + m.right > T.left + T.right : s.align === "right", b = Ta(d ? m.right - C : m.left, T.left + fe, Math.max(T.left + fe, T.right - C - fe)), X = i > q.below && q.above > q.below ? { bottom: `${window.innerHeight - m.top + s.gap}px`, maxHeight: W(s.maxHeight, q.above) } : { top: `${m.bottom + s.gap}px`, maxHeight: W(s.maxHeight, q.below) };
      return { ...c.value, ...X, left: `${b}px`, maxWidth: W(s.maxWidth, q.across) };
    }), H = a, Y = () => [...t.value.querySelectorAll("button:not(:disabled)")];
    function A(m) {
      const T = Y(), q = T.indexOf(document.activeElement);
      T[(q + m + T.length) % T.length].focus();
    }
    const f = { ArrowDown: () => A(1), ArrowUp: () => A(-1), Escape: () => H("close") }, K = (m) => f[m.key] && (m.preventDefault(), f[m.key]()), O = () => t.value && (x.value = { w: t.value.offsetWidth, h: t.value.scrollHeight });
    let N = 0;
    const te = new ResizeObserver(() => {
      cancelAnimationFrame(N), N = requestAnimationFrame(O);
    });
    Oa(t, (m) => s.anchor && !s.anchor.contains(m.target) && H("close"));
    const G = (m, T) => ["top", "left", "right", "bottom"].some((q) => Math.abs(m[q] - T[q]) > 1), g = (m) => m.bottom < 0 || m.top > window.innerHeight;
    let L = 0;
    function J() {
      if (s.anchor) {
        const m = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || g(m)) return H("close");
        G(m, w.value) && (w.value = m);
      }
      L = requestAnimationFrame(J);
    }
    return _e(() => {
      s.anchor && t.value && ja(t.value, s.anchor), O(), t.value && te.observe(t.value), !s.plain && Y()[0] && Y()[0].focus(), J();
    }), ye(() => {
      te.disconnect(), cancelAnimationFrame(L), cancelAnimationFrame(N);
    }), l({ element: t }), (m, T) => (n(), F(Qe, {
      to: "body",
      disabled: !e.anchor
    }, [
      v("div", Xe({
        ref_key: "panel",
        ref: t
      }, m.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: E.value,
        onKeydown: K
      }), [
        be(m.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Ba = /* @__PURE__ */ _(Ra, [["__scopeId", "data-v-3d203970"]]);
async function za(e, l, a) {
  if (!e) return a(l);
  const { target: s, fields: t } = e, r = Object.fromEntries(Object.keys(t).map((w) => [w, s[w]])), c = () => Object.assign(s, r);
  Object.assign(s, t);
  let x = !1;
  try {
    const w = await a(l);
    return x = w.ok, w;
  } finally {
    x || c();
  }
}
function Ia(e, l, a, { groups: s, programs: t }) {
  const r = R({}), c = R(""), x = R(!1), w = h(() => !!e.value && !e.value.ended_at), S = h(() => w.value && !!e.value.paused_at);
  async function V(j, E = null) {
    c.value = "";
    const H = await za(E, j, l);
    return c.value = H.ok ? "" : H.error, a(), H;
  }
  return { groups: s, programs: t, chosen: r, failure: c, asking: x, running: w, paused: S, choose: (j, E) => V(["agent", "control", String(e.value.id), j, E.value], { target: r, fields: { value: { ...r.value, [j]: E.label } } }), stop: () => (x.value = !1, V(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (j) => V(["agent", "launch", j.name]) };
}
function Va(e) {
  if (!e) return "Not compacted yet";
  const l = new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return e.start_percent === null ? `Last compacted ${l}` : e.end_percent === null ? `Last compacted ${l}, from ${e.start_percent}%` : `Last compacted ${l}, from ${e.start_percent}% to ${e.end_percent}%, ${e.start_percent - e.end_percent}% taken off`;
}
const Ea = ["disabled", "title"], Ha = ["disabled", "title"], Na = { class: "gauge" }, Wa = ["disabled", "title"], qa = ["disabled"], Da = ["disabled"], Fa = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Pa = ["title"], Ua = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Ka = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Ja = { class: "gauge" }, Ga = { class: "context-used" }, Za = 75, Ya = {
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
    const a = e, s = l, t = Ia(Te(a, "agent"), a.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => s("changed"), { groups: Te(a, "controlGroups"), programs: Te(a, "agentPrograms") }), r = R(null), c = R(""), x = h(() => t.groups.value.find((A) => A.key === c.value));
    function w(A, f) {
      r.value = A.currentTarget, c.value = f;
    }
    function S() {
      r.value = null, c.value = "", t.asking.value = !1;
    }
    const V = h(() => a.skills.filter((A) => A.state === "loaded"));
    function P(A) {
      w(A, "skills"), s("skills");
    }
    const W = (A) => t.groups.value.some((f) => f.key === A), U = h(() => {
      var A;
      return t.chosen.value.model ?? ((A = E.value) == null ? void 0 : A.model) ?? "";
    }), j = h(() => {
      var A;
      return t.chosen.value.effort ?? ((A = E.value) == null ? void 0 : A.effort) ?? "";
    });
    h(() => !!a.agent && !a.agent.ended_at);
    const E = h(() => {
      var A;
      return ((A = a.usage.agents) == null ? void 0 : A.find((f) => {
        var K;
        return f.id === ((K = a.agent) == null ? void 0 : K.id);
      })) ?? null;
    }), H = h(() => {
      var A;
      return ((A = E.value) == null ? void 0 : A.context_percent) == null ? null : Math.round(E.value.context_percent);
    }), Y = h(() => {
      var A;
      return (A = E.value) != null && A.cost_dollars ? `$${E.value.cost_dollars.toFixed(2)}` : "";
    });
    return (A, f) => {
      var K;
      return n(), o("div", {
        class: le(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (n(), o(I, { key: 0 }, [
          v("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: f[0] || (f[0] = (O) => w(O, "agent"))
          }, [
            M(ne, {
              name: "agents",
              size: 12
            }),
            k(" " + p(((K = e.agentPrograms.find((O) => O.name === e.agent.program)) == null ? void 0 : K.title) || e.agent.program), 1)
          ], 8, Ea),
          M(Aa, {
            windows: e.usage.windows,
            onOpen: f[1] || (f[1] = (O) => s("open", "usage", O))
          }, null, 8, ["windows"]),
          H.value !== null ? (n(), o("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${H.value}% full: clear or compact it`,
            onClick: f[2] || (f[2] = (O) => W("context") ? w(O, "context") : s("open", "context", O.currentTarget))
          }, [
            M(ne, {
              name: "gauge",
              size: 12
            }),
            f[14] || (f[14] = k()),
            v("span", Na, [
              v("span", {
                style: ve({ width: `${H.value}%` })
              }, null, 4)
            ]),
            k(" " + p(H.value) + "% ", 1)
          ], 8, Ha)) : y("", !0),
          U.value ? (n(), o("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${U.value}: change the model`,
            onClick: f[3] || (f[3] = (O) => W("model") ? w(O, "model") : null)
          }, [
            M(ne, {
              name: "model",
              size: 12
            }),
            k(" " + p(U.value), 1)
          ], 8, Wa)) : y("", !0),
          W("effort") || e.card && j.value ? (n(), o("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: f[4] || (f[4] = (O) => w(O, "effort"))
          }, [
            M(ne, {
              name: "bolt",
              size: 12
            }),
            k(" " + p(j.value), 1)
          ], 8, qa)) : y("", !0),
          Y.value ? (n(), o("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: f[5] || (f[5] = (O) => s("open", "cost", O.currentTarget))
          }, p(Y.value), 9, Da)) : y("", !0),
          e.branch ? (n(), o("span", Fa, [
            M(ne, {
              name: "branch",
              size: 12
            }),
            k(" " + p(e.branch), 1)
          ])) : y("", !0),
          e.card ? y("", !0) : (n(), o("button", {
            key: 5,
            type: "button",
            class: le(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: f[6] || (f[6] = (O) => s("open", "jobs", O.currentTarget))
          }, [
            M(ne, {
              name: "clock",
              size: 12
            }),
            k(" " + p(e.jobs), 1)
          ], 2)),
          e.run ? (n(), o("button", {
            key: 6,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: P
          }, [
            M(ne, {
              name: "book",
              size: 12
            }),
            k(" " + p(V.value.length), 1)
          ])) : y("", !0),
          e.fitness ? (n(), o(I, { key: 7 }, [
            v("button", {
              type: "button",
              class: le(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Za }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: f[7] || (f[7] = (O) => s("open", "fitness", O.currentTarget))
            }, [
              M(ne, {
                name: "heart",
                size: 12
              }),
              k(" " + p(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            v("button", {
              type: "button",
              class: le(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: f[8] || (f[8] = (O) => s("open", "load", O.currentTarget))
            }, [
              M(ne, {
                name: "weight",
                size: 12
              }),
              k(" " + p(e.fitness.workload), 1)
            ], 2)
          ], 64)) : y("", !0)
        ], 64)) : e.run && !e.loading ? (n(), o("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: f[9] || (f[9] = (O) => w(O, "start"))
        }, [
          M(ne, {
            name: "agents",
            size: 12
          }),
          f[15] || (f[15] = k(" Start an agent", -1))
        ])) : y("", !0),
        f[21] || (f[21] = v("span", { class: "space" }, null, -1)),
        u(t).failure.value ? (n(), o("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: u(t).failure.value
        }, p(u(t).failure.value), 9, Pa)) : y("", !0),
        be(A.$slots, "default", {}, void 0, !0),
        r.value ? (n(), F(Ba, {
          key: 3,
          anchor: r.value,
          "min-width": 190,
          onClose: S
        }, {
          default: $(() => {
            var O;
            return [
              c.value === "agent" ? (n(), o(I, { key: 0 }, [
                u(t).asking.value ? (n(), o(I, { key: 0 }, [
                  M(ke, { "data-agent-stop-ask": "" }, {
                    default: $(() => [...f[16] || (f[16] = [
                      k("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  M(me, {
                    "data-agent-stop-confirm": "",
                    onClick: f[10] || (f[10] = (N) => (S(), u(t).stop()))
                  }, {
                    default: $(() => [...f[17] || (f[17] = [
                      k("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  M(me, {
                    onClick: f[11] || (f[11] = (N) => u(t).asking.value = !1)
                  }, {
                    default: $(() => [...f[18] || (f[18] = [
                      k("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (n(), F(me, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: f[12] || (f[12] = (N) => u(t).asking.value = !0)
                }, {
                  default: $(() => [...f[19] || (f[19] = [
                    k("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : c.value === "start" ? (n(), o(I, { key: 1 }, [
                M(ke, null, {
                  default: $(() => [...f[20] || (f[20] = [
                    k("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (n(!0), o(I, null, Q(u(t).programs.value, (N) => (n(), F(me, {
                  key: N.name,
                  "data-agent-program": N.name,
                  onClick: (te) => (S(), u(t).start(N))
                }, {
                  default: $(() => [
                    k(p(N.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : c.value === "skills" ? (n(), F($a, {
                key: 2,
                skills: e.skills,
                onBrowse: f[13] || (f[13] = (N) => (S(), s("open", "skills", null)))
              }, null, 8, ["skills"])) : x.value ? (n(), o(I, { key: 3 }, [
                M(ke, null, {
                  default: $(() => [
                    k(p(x.value.label), 1)
                  ]),
                  _: 1
                }),
                c.value === "context" ? (n(), o(I, { key: 0 }, [
                  v("p", Ua, p(u(Va)(((O = E.value) == null ? void 0 : O.last_compaction) ?? null)), 1),
                  v("div", Ka, [
                    v("span", Ja, [
                      v("span", {
                        style: ve({ width: `${H.value}%` })
                      }, null, 4)
                    ]),
                    v("span", Ga, p(H.value) + "%", 1)
                  ])
                ], 64)) : y("", !0),
                (n(!0), o(I, null, Q(x.value.choices, (N) => (n(), F(me, {
                  key: N.value,
                  "data-agent-choice": N.value,
                  onClick: (te) => (u(t).choose(x.value.key, N), S())
                }, {
                  default: $(() => [
                    k(p(N.label), 1)
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
}, _a = /* @__PURE__ */ _(Ya, [["__scopeId", "data-v-12618cc1"]]), Qa = ["data-agent-open", "aria-expanded", "role", "tabindex"], Xa = { class: "agent-head" }, en = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, tn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, an = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, nn = { class: "agent-line" }, ln = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, on = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, sn = {
  key: 1,
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, rn = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, un = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const a = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), s = { helper: "Helper", reviewer: "Reviewer" }, t = e, r = l, c = Ne(), x = h(() => {
      var i, d;
      if ((i = t.facts) != null && i.profile_title) return t.facts.profile_title;
      if ((d = t.facts) != null && d.profile) return t.facts.profile;
      const C = s[t.row.role] || t.row.role;
      return C.slice(0, 1).toUpperCase() + C.slice(1);
    }), w = h(() => {
      var C;
      return ((C = t.facts) == null ? void 0 : C.tasks) ?? [];
    }), S = h(() => w.value.filter((C) => C.state === "open")), V = h(() => w.value.find((C) => {
      var i;
      return C.id === ((i = t.progress) == null ? void 0 : i.task_id) && C.state === "started";
    })), P = h(() => V.value || w.value.find((C) => {
      var i;
      return C.id === ((i = t.facts) == null ? void 0 : i.task_id);
    }) || w.value.find((C) => a.has(C.state)) || S.value[0] || w.value.at(-1)), W = h(() => {
      var C, i, d, b, z, X;
      return t.row.role === "helper" ? ((C = t.facts) == null ? void 0 : C.helper_job) || "" : (i = t.facts) != null && i.job_enabled && (((d = V.value) == null ? void 0 : d.title) || ((b = t.facts) == null ? void 0 : b.task_title) || ((z = S.value[0]) == null ? void 0 : z.title) || ((X = w.value.at(-1)) == null ? void 0 : X.title)) || "";
    }), U = h(() => {
      var C;
      return (C = t.facts) != null && C.job_enabled ? `${t.row.role} ${t.row.id}` : "";
    }), j = h(() => {
      var C, i;
      return [t.row.program, (C = t.facts) == null ? void 0 : C.model, (i = t.facts) == null ? void 0 : i.effort, U.value].filter(Boolean).join(" · ");
    }), E = he(), H = h(() => We(t.row.process_started_at || t.row.created_at, c.value)), Y = /* @__PURE__ */ new Set(["open", "started", "testing"]), A = h(() => {
      var C;
      return (C = t.facts) == null ? void 0 : C.work_status;
    }), f = h(() => !!t.row.ended_at && t.row.role !== "main" && w.value.some((C) => Y.has(C.state))), K = h(() => {
      var C, i;
      return t.row.state === "running" && ((C = t.facts) == null ? void 0 : C.state) === "at usage limit" && !!((i = t.facts) != null && i.limited_until);
    }), O = h(() => `At usage limit: starts again ${new Date(t.facts.limited_until).toLocaleString()}`), N = h(() => {
      var C;
      return t.row.retired_at || t.row.state === "retired" ? "retired" : K.value || A.value || t.waitReason || f.value ? "waiting" : t.row.state === "running" && ((C = t.facts) == null ? void 0 : C.state) || t.row.state;
    }), te = h(() => {
      var C;
      return K.value ? O.value : A.value ? `Status: ${A.value}` : t.waitReason ? `Waiting: ${t.waitReason}` : N.value === "blocked" ? (C = t.facts) != null && C.blocked_reason ? `Blocked: ${t.facts.blocked_reason}` : "Blocked" : f.value ? "Stopped with work left" : "";
    }), G = h(() => {
      var C;
      return ((C = t.progress) == null ? void 0 : C.completed_count) ?? w.value.filter((i) => i.state === "completed").length;
    }), g = h(() => {
      var C;
      return ct(G.value, ((C = t.progress) == null ? void 0 : C.started_at) || t.row.created_at, t.progress ? t.progress.finished_at : t.row.ended_at, c.value);
    }), L = h(() => t.row.role === "main" ? 0 : g.value), J = h(() => !!t.row.retired_at || t.row.state === "retired"), m = h(() => J.value ? "Retired" : N.value === "blocked" || N.value === "waiting" ? te.value || (N.value === "blocked" ? "Blocked" : "Waiting") : t.row.ended_at ? "Idle: its process has stopped" : "Working"), T = h(() => {
      var i;
      if (J.value) return t.row.retired_at;
      const C = N.value === "blocked" || N.value === "waiting";
      return t.row.ended_at || C && ((i = t.facts) == null ? void 0 : i.last_activity) || t.row.process_started_at || t.row.created_at;
    }), q = h(() => T.value ? `Since ${new Date(T.value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${vt(T.value, c.value)}` : "");
    return (C, i) => {
      var d, b, z, X, se, de;
      return n(), o("div", {
        class: le(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: i[2] || (i[2] = (ie) => !e.open && r("toggle")),
        onKeydown: [
          i[3] || (i[3] = Be(oe((ie) => !e.open && r("toggle"), ["self", "prevent"]), ["enter"])),
          i[4] || (i[4] = Be(oe((ie) => !e.open && r("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        v("span", Xa, [
          e.open ? (n(), o("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: i[0] || (i[0] = oe((ie) => r("toggle"), ["stop"]))
          }, [
            M(u(we), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : y("", !0),
          v("span", en, p(x.value), 1),
          v("span", tn, p(((d = e.facts) == null ? void 0 : d.given_name) || e.row.id), 1),
          e.open ? y("", !0) : (n(), F(u(we), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          e.open ? (n(), o("span", an, p(H.value), 1)) : y("", !0)
        ]),
        v("span", nn, [
          v("span", ln, p(j.value), 1),
          (b = e.facts) != null && b.sandbox_off ? (n(), o("span", on, "sandbox off")) : y("", !0),
          e.open ? (n(), o("span", sn, [
            i[5] || (i[5] = k("Started ", -1)),
            M(u(Ie), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : y("", !0),
          e.open && ((z = e.facts) != null && z.last_activity) ? (n(), o("span", rn, [
            i[6] || (i[6] = k("Last heard ", -1)),
            M(u(Ie), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : y("", !0)
        ]),
        e.open ? (n(), F(_a, {
          key: 0,
          "agent-programs": u(E).props.programs.rows.value,
          agent: e.row,
          branch: (X = e.progress) == null ? void 0 : X.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((se = e.facts) == null ? void 0 : se.windows) ?? [] },
          card: ""
        }, {
          default: $(() => [
            M(ea, { row: e.row }, null, 8, ["row"]),
            e.row.role === "helper" && !e.row.ended_at ? (n(), F(u(ae), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: i[1] || (i[1] = oe((ie) => u(E).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: $(() => [...i[7] || (i[7] = [
                k("Stop", -1)
              ])]),
              _: 1
            })) : y("", !0)
          ]),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : y("", !0),
        e.open ? y("", !0) : (n(), F(va, {
          key: 1,
          tasks: w.value,
          "in-hand": e.row.role !== "helper" && ((de = e.facts) != null && de.job_enabled) && P.value || null,
          job: e.row.role === "helper" ? W.value : "",
          state: N.value,
          "per-hour": L.value
        }, null, 8, ["tasks", "in-hand", "job", "state", "per-hour"])),
        M(na, {
          state: N.value,
          doing: m.value,
          since: q.value
        }, null, 8, ["state", "doing", "since"]),
        e.open ? (n(), F(Nt, {
          key: 2,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: w.value,
          "stopped-with-work": f.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : y("", !0)
      ], 42, Qa);
    };
  }
}, dn = /* @__PURE__ */ _(un, [["__scopeId", "data-v-27c8ab85"]]), cn = ["data-edit-type"], vn = { key: 0 }, pn = { class: "stepper" }, gn = ["disabled", "onClick"], fn = ["value", "disabled", "data-agent-limit-input", "onChange"], mn = ["disabled", "onClick"], hn = { key: 0 }, kn = { key: 1 }, yn = {
  __name: "AgentLimitEditor",
  props: { rows: { type: Array, required: !0 }, pending: Boolean, readOnly: Boolean, environment: { type: String, required: !0 } },
  emits: ["change"],
  setup(e, { emit: l }) {
    const a = l;
    return (s, t) => (n(), o(I, null, [
      t[0] || (t[0] = v("p", null, "How many agents of a type may run at once, and how many may be kept.", -1)),
      (n(!0), o(I, null, Q(e.rows, (r) => (n(), o("div", {
        key: r.key,
        class: "edit-row",
        "data-edit-type": r.key
      }, [
        v("div", null, [
          v("strong", null, p(r.per_profile ? "Each helper type" : "Workers"), 1),
          r.per_profile ? (n(), o("small", vn, "Researcher, Planner and the others")) : y("", !0)
        ]),
        (n(!0), o(I, null, Q([{ name: "Most running", value: r.run_limit, key: r.run_setting, source: r.run_source, kind: "run" }, { name: "Most kept", value: r.kept_limit, key: r.kept_setting, source: r.kept_source, kind: "kept" }], (c) => (n(), o("label", {
          key: c.key
        }, [
          k(p(c.name), 1),
          v("span", pn, [
            v("button", {
              type: "button",
              disabled: e.pending || e.readOnly || c.value === 0,
              onClick: (x) => a("change", r, c.key, c.value, c.value - 1)
            }, "−", 8, gn),
            v("input", {
              type: "number",
              min: "0",
              value: c.value,
              disabled: e.pending || e.readOnly,
              "data-agent-limit-input": c.kind,
              onChange: (x) => a("change", r, c.key, c.value, x.target.value)
            }, null, 40, fn),
            v("button", {
              type: "button",
              disabled: e.pending || e.readOnly,
              onClick: (x) => a("change", r, c.key, c.value, c.value + 1)
            }, "+", 8, mn)
          ]),
          c.value === 0 ? (n(), o("small", hn, p(c.kind === "run" ? "None can start" : "Any number"), 1)) : c.source === `environment ${e.environment}` ? (n(), o("small", kn, "Changed for " + p(e.environment), 1)) : y("", !0)
        ]))), 128))
      ], 8, cn))), 128))
    ], 64));
  }
}, bn = /* @__PURE__ */ _(yn, [["__scopeId", "data-v-218442c9"]]), Ue = (e) => e.flatMap((l) => l.per_profile ? l.profiles.map((a) => ({ ...a, label: a.title, type: l.key, key: `${l.key}:${a.profile}` })) : [{ ...l, type: l.key }]), Oe = (e, l) => l > 0 && e >= l, wn = { class: "counts-panel" }, Mn = { class: "counts" }, $n = ["data-count-agent"], xn = { class: "person-text" }, Cn = {
  key: 0,
  class: "helper-head"
}, Sn = ["data-agent-limit-type", "data-agent-limit-profile", "onClick"], An = {
  key: 0,
  class: "bar"
}, Tn = {
  key: 5,
  role: "alert"
}, jn = {
  key: 6,
  role: "status"
}, Ln = { class: "foot" }, On = { class: "foot-note" }, Rn = {
  __name: "AgentCountsPanel",
  props: {
    title: { default: "Agent counts" },
    titleModifiers: {}
  },
  emits: /* @__PURE__ */ tt(["open-agent", "close"], ["update:title"]),
  setup(e, { emit: l }) {
    const a = l, s = et(e, "title"), t = he(), { rows: r, failure: c } = t.props.limits, x = R([]), w = R(0), S = R(!1), V = Ne(), P = R(null), W = R(!1), U = R(!1), j = R(""), E = R(""), H = R(null), Y = R(""), A = h(() => Ue(r.value)), f = h(() => r.value.find((i) => i.per_profile)), K = h(() => A.value.find((i) => i.key === P.value)), O = h(() => x.value.filter((i) => {
      var d, b;
      return i.state !== "retired" && i.role === ((d = K.value) == null ? void 0 : d.type) && (!K.value.profile || (((b = i.facts) == null ? void 0 : b.profile) || i.profile) === K.value.profile);
    }).sort((i, d) => (i.state !== "running") - (d.state !== "running") || String(i.ended_at || i.created_at).localeCompare(String(d.ended_at || d.created_at)))), N = h(() => {
      var d;
      const i = /* @__PURE__ */ new Map();
      for (const b of O.value) {
        const z = ((d = b.facts) == null ? void 0 : d.model) || b.program_model;
        z && i.set(z, (i.get(z) || 0) + 1);
      }
      return [...i].map(([b, z]) => `${z} ${b}`).join(", ");
    }), te = (i, d) => d ? `${Math.min(i / Math.max(i, d) * 100, 100)}%` : "0%", G = (i, d) => d && i > d ? `${(i - d) / i * 100}%` : "0%";
    ue(() => {
      var i;
      return W.value ? "Change the maximums" : ((i = K.value) == null ? void 0 : i.label) || "Agent counts";
    }, (i) => {
      s.value = i;
    }, { immediate: !0 });
    async function g(i, d = 1) {
      t.state["count-agents.role"] = i.type, i.profile ? t.state["count-agents.profile"] = i.profile : delete t.state["count-agents.profile"], t.state["count-agents.page"] = String(d), await t.reload("count-agents");
      const b = t.props["count-agents"];
      x.value = d === 1 ? [...b.rows.value] : [...x.value, ...b.rows.value], w.value = d, S.value = b.more.value;
    }
    function L(i) {
      P.value = i.key, x.value = [], g(i);
    }
    function J() {
      W.value = !1, P.value = null, H.value = null, j.value = "";
    }
    function m() {
      J(), a("close");
    }
    async function T(i, d, b, z) {
      if (U.value || t.readOnly) return;
      const X = Number(z);
      if (!String(z).trim() || !Number.isInteger(X) || X < 0) {
        j.value = "Use a whole number of 0 or more.";
        return;
      }
      U.value = !0, j.value = "";
      const se = await t.run(["setting", "set", d, String(X), "--environment", t.environment]);
      se.ok ? (await t.reload("limits"), E.value = "Saved.") : j.value = se.error, U.value = !1;
    }
    async function q(i) {
      if (!Y.value.trim() || U.value) return;
      U.value = !0;
      const d = await t.run(["agent", "retire", String(i.id), "--reason", Y.value.trim()]);
      j.value = d.ok ? "" : "The agent could not be retired. Try again.", d.ok && (H.value = null, Y.value = "", E.value = "Agent retired permanently.", await t.reload("limits"), await g(K.value)), U.value = !1;
    }
    function C(i) {
      m(), a("open-agent", i);
    }
    return (i, d) => (n(), o("div", wn, [
      v("div", Mn, [
        W.value || K.value ? (n(), o("button", {
          key: 0,
          class: "back",
          type: "button",
          onClick: J
        }, "‹ Back to the counts")) : y("", !0),
        u(c) ? (n(), o(I, { key: 1 }, [
          d[6] || (d[6] = v("strong", null, "The counts could not be read", -1)),
          d[7] || (d[7] = v("p", null, "The journal did not answer.", -1)),
          M(u(ae), {
            small: "",
            onClick: d[0] || (d[0] = (b) => u(t).reload("limits"))
          }, {
            default: $(() => [...d[5] || (d[5] = [
              k("Try again", -1)
            ])]),
            _: 1
          })
        ], 64)) : W.value ? (n(), F(bn, {
          key: 2,
          rows: u(r),
          pending: U.value,
          "read-only": u(t).readOnly,
          environment: u(t).environment,
          onChange: T
        }, null, 8, ["rows", "pending", "read-only", "environment"])) : K.value ? (n(), o(I, { key: 3 }, [
          v("p", null, [
            v("strong", null, p(K.value.running) + " of " + p(K.value.run_limit), 1),
            d[8] || (d[8] = k(" running, ", -1)),
            v("strong", null, [
              k(p(K.value.kept), 1),
              K.value.kept_limit ? (n(), o(I, { key: 0 }, [
                k(" of " + p(K.value.kept_limit), 1)
              ], 64)) : y("", !0)
            ]),
            d[9] || (d[9] = k(" kept", -1))
          ]),
          v("p", null, p(N.value), 1),
          O.value.length ? y("", !0) : (n(), o(I, { key: 0 }, [
            d[10] || (d[10] = v("strong", null, "No agents here yet", -1)),
            d[11] || (d[11] = v("p", null, "An agent shows here as soon as one of this type starts.", -1))
          ], 64)),
          (n(!0), o(I, null, Q(O.value, (b) => {
            var z, X, se, de, ie;
            return n(), o("div", {
              key: b.id,
              class: "person",
              "data-count-agent": b.id
            }, [
              v("span", {
                class: le(["dot", { running: b.state === "running" }])
              }, null, 2),
              v("div", xn, [
                v("strong", null, p(((z = b.facts) == null ? void 0 : z.given_name) || b.id), 1),
                k(" " + p(b.state === "running" ? "Running" : "Idle") + ", " + p(u(We)(b.state === "running" ? b.process_started_at || b.created_at : b.ended_at, u(V))), 1),
                v("small", null, p([b.program, (X = b.facts) == null ? void 0 : X.model, (se = b.facts) == null ? void 0 : se.effort, `${b.role} ${b.id}`].filter(Boolean).join(", ")), 1),
                v("small", null, p(((de = b.facts) == null ? void 0 : de.task_title) || ((ie = b.facts) == null ? void 0 : ie.helper_job)), 1)
              ]),
              M(u(ae), {
                small: "",
                onClick: (pe) => C(b)
              }, {
                default: $(() => [...d[12] || (d[12] = [
                  k("Open", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              b.state === "idle" && !u(t).readOnly ? (n(), F(u(ae), {
                key: 0,
                small: "",
                onClick: (pe) => {
                  H.value = b.id, Y.value = "";
                }
              }, {
                default: $(() => [...d[13] || (d[13] = [
                  k("Retire", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : y("", !0),
              H.value === b.id ? (n(), F(qe, {
                key: 1,
                reason: Y.value,
                "onUpdate:reason": d[1] || (d[1] = (pe) => Y.value = pe),
                pending: U.value,
                onSubmit: (pe) => q(b),
                onCancel: d[2] || (d[2] = (pe) => H.value = null)
              }, null, 8, ["reason", "pending", "onSubmit"])) : y("", !0)
            ], 8, $n);
          }), 128)),
          S.value ? (n(), F(u(ae), {
            key: 1,
            small: "",
            onClick: d[3] || (d[3] = (b) => g(K.value, w.value + 1))
          }, {
            default: $(() => [...d[14] || (d[14] = [
              k("Show more", -1)
            ])]),
            _: 1
          })) : y("", !0)
        ], 64)) : (n(), o(I, { key: 4 }, [
          d[16] || (d[16] = v("p", null, "Kept agents have not been retired, so they can take another job. Open an item to see them.", -1)),
          d[17] || (d[17] = v("div", { class: "columns" }, [
            v("span", null, "Name"),
            v("span", null, "Running"),
            v("span", null, "Kept"),
            v("span")
          ], -1)),
          f.value ? (n(), o("div", Cn, [
            d[15] || (d[15] = v("strong", null, "Helpers", -1)),
            v("span", null, p(f.value.running) + " running, " + p(f.value.kept) + " kept", 1)
          ])) : y("", !0),
          (n(!0), o(I, null, Q(A.value, (b) => (n(), o("button", {
            key: b.key,
            type: "button",
            class: "count-row",
            "data-agent-limit-type": b.type || b.key,
            "data-agent-limit-profile": b.profile,
            onClick: (z) => L(b)
          }, [
            v("strong", null, p(b.label), 1),
            (n(!0), o(I, null, Q([{ count: b.running, limit: b.run_limit, unlimited: !1 }, { count: b.kept, limit: b.kept_limit, unlimited: !0 }], (z) => (n(), o("span", {
              key: z.unlimited,
              class: le({ full: u(Oe)(z.count, z.limit) })
            }, [
              v("span", null, [
                k(p(z.count), 1),
                z.limit || !z.unlimited ? (n(), o(I, { key: 0 }, [
                  k(" of " + p(z.limit), 1)
                ], 64)) : y("", !0)
              ]),
              z.limit ? (n(), o("span", An, [
                v("span", {
                  style: ve({ width: te(z.count, z.limit) })
                }, null, 4),
                v("i", {
                  style: ve({ width: G(z.count, z.limit) })
                }, null, 4)
              ])) : y("", !0)
            ], 2))), 128)),
            M(u(we), {
              name: "chevronRight",
              size: 12
            })
          ], 8, Sn))), 128))
        ], 64)),
        j.value ? (n(), o("p", Tn, p(j.value), 1)) : E.value ? (n(), o("p", jn, p(E.value), 1)) : y("", !0)
      ]),
      v("div", Ln, [
        W.value ? (n(), o(I, { key: 0 }, [
          v("span", On, p(E.value || `Changes apply to ${u(t).environment}.`), 1),
          M(u(ae), { onClick: J }, {
            default: $(() => [...d[18] || (d[18] = [
              k("Done", -1)
            ])]),
            _: 1
          })
        ], 64)) : K.value ? y("", !0) : (n(), F(u(ae), {
          key: 1,
          disabled: u(t).readOnly,
          "data-agent-limits-edit": "",
          onClick: d[4] || (d[4] = (b) => W.value = !0)
        }, {
          default: $(() => [...d[19] || (d[19] = [
            k("Change the maximums", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]))
      ])
    ]));
  }
}, Bn = /* @__PURE__ */ _(Rn, [["__scopeId", "data-v-de3d902c"]]), zn = {
  key: 0,
  class: "badge",
  "data-agent-count-badge": ""
}, In = {
  __name: "AgentLimits",
  emits: ["open-agent"],
  setup(e, { emit: l }) {
    const a = l, s = he(), t = R(!1), r = R("Agent counts"), c = h(() => Ue(s.props.limits.rows.value).filter((w) => Oe(w.running, w.run_limit) || Oe(w.kept, w.kept_limit)).length);
    function x(w) {
      t.value = !1, a("open-agent", w);
    }
    return (w, S) => (n(), o(I, null, [
      v("button", {
        class: "counts-button",
        type: "button",
        title: "Agent counts",
        "aria-label": "Agent counts",
        "data-agent-counts": "",
        onClick: S[0] || (S[0] = (V) => t.value = !0)
      }, [
        M(u(we), {
          name: "settings",
          size: 16
        }),
        c.value ? (n(), o("span", zn, p(c.value), 1)) : y("", !0)
      ]),
      t.value ? (n(), F(u(pt), {
        key: 0,
        title: r.value,
        modal: "",
        fits: "",
        onClose: S[3] || (S[3] = (V) => t.value = !1),
        onEscape: S[4] || (S[4] = (V) => t.value = !1)
      }, {
        default: $(() => [
          M(Bn, {
            title: r.value,
            "onUpdate:title": S[1] || (S[1] = (V) => r.value = V),
            onOpenAgent: x,
            onClose: S[2] || (S[2] = (V) => t.value = !1)
          }, null, 8, ["title"])
        ]),
        _: 1
      }, 8, ["title"])) : y("", !0)
    ], 64));
  }
}, Vn = /* @__PURE__ */ _(In, [["__scopeId", "data-v-4094dc8b"]]), En = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Hn = ["data-agent-row"], Ve = "journal.agents.filters", Ce = "cubic-bezier(0.2, 0.9, 0.25, 1)", Nn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const l = e, a = he(), { rows: s } = a.props.waits, { rows: t } = a.props.progress, { rows: r, failure: c, loaded: x, more: w } = a.props.agents, S = (D) => t.value.find((Z) => Z.agent_id === D.id) ?? null, V = (D) => {
      var Z;
      return ((Z = s.value.find((B) => B.agent_id === D.id)) == null ? void 0 : Z.reason) ?? "";
    }, P = R("running"), W = R(""), U = JSON.parse(localStorage.getItem(Ve) || '{"roles":[],"profiles":[],"programs":[]}'), j = R(U), E = h(() => a.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: H } = a.props.programs, Y = h(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), A = (D, Z) => {
      j.value = ht(j.value, D, Z);
    }, f = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, K = (D) => D.slice(0, 1).toUpperCase() + D.slice(1);
    ue(j, (D) => localStorage.setItem(Ve, JSON.stringify(D)));
    const O = R(25);
    function N() {
      Object.assign(a.state, {
        "agents.show": P.value,
        "agents.search": W.value,
        "agents.limit": String(O.value),
        "agents.roles": j.value.roles.join(","),
        "agents.profiles": j.value.profiles.join(","),
        "agents.programs": j.value.programs.join(",")
      });
    }
    async function te() {
      return O.value += 25, N(), await a.reload("agents"), !0;
    }
    ue([P, W, j], () => {
      O.value = 25, N(), a.reload("agents");
    }), N();
    const G = (D) => D.facts ?? null, g = r, L = h(() => !!W.value.trim() || Y.value > 0), J = h(() => l.texts[P.value] ?? { title: l.empty, hint: "" }), m = R(null), T = R(null), q = R(null), C = R(null), i = h(() => m.value === null ? null : a.props[`card.${m.value}`].rows.value.find((D) => D.id === m.value) ?? T.value), d = h(() => i.value ? [i.value] : g.value), b = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let z = !1, X = 0;
    async function se(D) {
      if (z) return;
      z = !0, X = C.value.scrollTop;
      const Z = q.value.querySelector(`[data-agent-open="${D.id}"]`);
      if (!b()) {
        const ce = [...q.value.querySelectorAll(".agent-row")].filter((re) => !re.contains(Z));
        await Promise.all(ce.map((re) => re.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const B = [...Z.querySelectorAll(".agent-head, .agent-line")], ee = [...B, ...Z.querySelectorAll("[data-agent-motion]")], Me = ee.map((ce) => ce.getBoundingClientRect());
      if (T.value = D, m.value = D.id, a.reload(`card.${D.id}`), await ze(), !b()) {
        const ce = ee.map((re) => re.getBoundingClientRect());
        ee.forEach((re, $e) => {
          const ge = B.indexOf(re.parentElement), Ke = Me[$e].left - ce[$e].left - (ge < 0 ? 0 : Me[ge].left - ce[ge].left), Je = Me[$e].top - ce[$e].top - (ge < 0 ? 0 : Me[ge].top - ce[ge].top);
          re.animate([{ transform: `translate(${Ke}px, ${Je}px)` }, { transform: "none" }], { duration: 280, easing: Ce });
        }), q.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((re) => {
          re.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Ce, fill: "backwards" });
        });
      }
      z = !1;
    }
    async function de() {
      if (z || !i.value) return;
      z = !0;
      const D = q.value.querySelector(`[data-agent-open="${m.value}"]`), Z = [...D.children], B = b() ? [] : Z.map((ee) => ee.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(B.map((ee) => ee.finished)), m.value = null, await ze(), C.value.scrollTop = X, B.forEach((ee) => ee.cancel()), b() || (D.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Ce }), q.value.querySelectorAll(".agent-row").forEach((ee) => {
        ee.contains(D) || ee.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Ce });
      })), z = !1;
    }
    function ie(D) {
      T.value = D, m.value = D.id, a.reload(`card.${D.id}`);
    }
    const pe = (D) => m.value === D.id ? de() : se(D);
    ue(W, (D) => D.trim() && (m.value = null)), ue(P, () => {
      m.value = null;
    });
    const Re = (D) => {
      D.key === "Escape" && de();
    };
    return window.addEventListener("keydown", Re), ye(() => window.removeEventListener("keydown", Re)), (D, Z) => (n(), o("div", {
      ref_key: "agents",
      ref: q,
      class: le(["agents", { focused: i.value }])
    }, [
      M(u(gt), {
        modelValue: W.value,
        "onUpdate:modelValue": Z[1] || (Z[1] = (B) => W.value = B),
        placeholder: "Search agents",
        "menu-count": Y.value,
        "data-agents-search": ""
      }, {
        menu: $(() => [
          M(u(je), null, {
            default: $(() => [...Z[2] || (Z[2] = [
              k("Type", -1)
            ])]),
            _: 1
          }),
          (n(!0), o(I, null, Q(E.value.roles, (B) => (n(), F(u(xe), {
            key: B,
            role: "menuitemcheckbox",
            "aria-checked": j.value.roles.includes(B),
            checked: j.value.roles.includes(B),
            "data-filter-role": B,
            onClick: (ee) => A("roles", B)
          }, {
            default: $(() => [
              k(p(K(B)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          E.value.profiles.length ? (n(), F(u(je), { key: 0 }, {
            default: $(() => [...Z[3] || (Z[3] = [
              k("Profile", -1)
            ])]),
            _: 1
          })) : y("", !0),
          (n(!0), o(I, null, Q(E.value.profiles, (B) => (n(), F(u(xe), {
            key: B.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.profiles.includes(B.name),
            checked: j.value.profiles.includes(B.name),
            "data-filter-profile": B.name,
            onClick: (ee) => A("profiles", B.name)
          }, {
            default: $(() => [
              k(p(B.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          M(u(je), null, {
            default: $(() => [...Z[4] || (Z[4] = [
              k("Program", -1)
            ])]),
            _: 1
          }),
          (n(!0), o(I, null, Q(u(H), (B) => (n(), F(u(xe), {
            key: B.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.programs.includes(B.name),
            checked: j.value.programs.includes(B.name),
            "data-filter-program": B.name,
            onClick: (ee) => A("programs", B.name)
          }, {
            default: $(() => [
              k(p(B.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          Y.value ? (n(), F(u(xe), {
            key: 1,
            "data-filter-clear": "",
            onClick: f
          }, {
            default: $(() => [...Z[5] || (Z[5] = [
              k("Clear filters", -1)
            ])]),
            _: 1
          })) : y("", !0)
        ]),
        default: $(() => [
          M(u(ft), {
            options: E.value.states,
            value: P.value,
            onPick: Z[0] || (Z[0] = (B) => P.value = B)
          }, null, 8, ["options", "value"]),
          M(Vn, { onOpenAgent: ie })
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      P.value === "retired" && E.value.upgrade_retired ? (n(), o("p", En, "Retired during the upgrade: " + p(E.value.upgrade_retired), 1)) : y("", !0),
      v("div", {
        ref_key: "list",
        ref: C,
        class: le(["agents-view", { "agents-view-open": i.value }])
      }, [
        u(x) && !u(c) && !d.value.length && Y.value ? (n(), F(u(Le), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: $(() => [
            M(u(ae), {
              small: "",
              "data-empty-clear": "",
              onClick: f
            }, {
              default: $(() => [...Z[6] || (Z[6] = [
                k("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (n(), F(u(mt), {
          key: 1,
          rows: d.value,
          failure: u(c),
          loaded: u(x),
          more: !i.value && u(w),
          older: te,
          empty: J.value.title,
          hint: J.value.hint,
          searching: L.value
        }, {
          default: $(({ row: B }) => [
            v("div", {
              class: "agent-row",
              "data-agent-row": B.id
            }, [
              M(dn, {
                row: B,
                facts: G(B),
                progress: S(B),
                "wait-reason": V(B),
                open: B.id === m.value,
                onToggle: (ee) => pe(B)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, Hn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, Fn = /* @__PURE__ */ _(Nn, [["__scopeId", "data-v-06777d49"]]);
export {
  Fn as A
};
