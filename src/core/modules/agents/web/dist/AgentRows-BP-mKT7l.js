/* @code-commandments-generated */
import { openBlock as n, createElementBlock as o, withModifiers as re, unref as i, createTextVNode as h, toDisplayString as p, createVNode as $, createBlock as F, withCtx as x, Fragment as z, renderList as ee, createElementVNode as d, createCommentVNode as k, computed as m, ref as I, watch as ue, onUnmounted as we, defineAsyncComponent as nt, createSlots as lt, resolveDynamicComponent as ot, normalizeClass as le, normalizeStyle as pe, renderSlot as Me, onMounted as st, Teleport as rt, mergeProps as it, toRef as Re, withKeys as He, useModel as ut, mergeModels as dt, nextTick as We } from "vue";
import { peekRef as je, Icon as $e, RunningCommand as ct, FoldGroup as Pe, TaskStatusIcon as vt, useWindow as ye, loadWindowComponent as pt, coalesced as gt, READ_RATES as ft, InnerTabs as mt, TabBody as ht, SwitchCase as Ue, EmptyState as Le, Btn as ae, TextArea as kt, TextInput as yt, HoverTip as Te, useNow as Ie, age as Je, perHour as bt, ago as wt, TimeAgo as qe, Dialog as Mt, SearchBar as $t, Segmented as xt, MenuLabel as Oe, MenuItem as Se, RowList as Ct, toggleFilter as St } from "@journal/window-kit";
import { _ as X, T as At } from "./TranscriptRows-CG9aRNTl.js";
const Tt = {
  class: "agent-command",
  "data-agent-command": ""
}, jt = {
  key: 1,
  "data-agent-stopped": ""
}, Rt = {
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
        onClick: a[0] || (a[0] = re((s) => i(je)("test_queue:0"), ["stop"]))
      }, [
        h("Waiting: " + p(e.waitReason) + " ", 1),
        $(i($e), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (n(), o("span", jt, "Waiting")) : (n(), F(i(ct), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, Ot = /* @__PURE__ */ X(Rt, [["__scopeId", "data-v-1b371fb5"]]), Lt = ["data-agent-delegated", "onClick"], Bt = { class: "agent-task-number" }, It = { class: "agent-task-title" }, zt = ["title"], Vt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const a = l;
    return (s, t) => (n(), F(i(Pe), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: t[0] || (t[0] = (r) => a("toggle"))
    }, {
      default: x(() => [
        (n(!0), o(z, null, ee(e.section.tasks, (r) => (n(), o("button", {
          key: r.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": r.id,
          onClick: (c) => i(je)(`tasks:${r.id}`)
        }, [
          $(i(vt), {
            status: r.state
          }, null, 8, ["status"]),
          d("span", Bt, p(r.id), 1),
          d("span", It, p(r.title), 1),
          r.plan_id ? (n(), o("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${r.plan_id}: ${r.plan_title}`
          }, "Plan " + p(r.plan_id) + ": " + p(r.plan_title), 9, zt)) : k("", !0)
        ], 8, Lt))), 128))
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
}, qt = ["data-peek", "onClick"], Ft = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Dt = {
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
    const l = e, a = ["started", "blocked", "open", "completed"], s = m(() => {
      var g, L;
      return l.row.ended_at && ((L = (g = l.facts) == null ? void 0 : g.job_returned) != null && L.startsWith(Jt)) ? l.facts.job_returned : "";
    }), t = m(() => l.tasks.length ? a.map((g) => ({ state: g, label: g.slice(0, 1).toUpperCase() + g.slice(1), tasks: l.tasks.filter((L) => L.state === g || g === "started" && L.state === "testing" || g === "completed" && L.state === "cancelled") })) : []), r = /* @__PURE__ */ new Set(["completed"]), c = I({}), C = (g) => !(c.value[g] ?? r.has(g)), b = (g) => c.value = { ...c.value, [g]: C(g) }, O = ye(), { rows: P } = O.props.reports;
    O.state["reports.agent"] = String(l.row.id);
    const D = m(() => l.row.access === "read-only"), V = m(() => !!l.row.retired_at || l.row.state === "retired"), U = ["tasks", "transcript", "terminal", "file-feed", "reports"], j = m(() => (V.value ? O.tabs.filter((L) => ["reports", "transcript"].includes(L.key)) : D.value ? O.tabs.filter((L) => ["reports", "transcript", "terminal"].includes(L.key)) : [...O.tabs]).sort((L, W) => (U.indexOf(L.key) < 0 ? U.length : U.indexOf(L.key)) - (U.indexOf(W.key) < 0 ? U.length : U.indexOf(W.key)))), N = () => D.value || V.value ? j.value.find((g) => g.key === "transcript") : j.value[0], H = I(N());
    ue(H, (g) => {
      O.state.tab = (g == null ? void 0 : g.key) ?? "";
    }, { immediate: !0 }), we(() => {
      O.state.tab = "";
    }), ue(j, (g) => {
      g.some((L) => {
        var W;
        return L.key === ((W = H.value) == null ? void 0 : W.key);
      }) || (H.value = g[0]);
    }), ue(() => l.open, (g) => {
      g && (H.value = N());
    });
    const Z = Object.fromEntries(O.tabs.filter((g) => g.component).map((g) => [g.key, nt(() => pt(g.component))])), T = I(!1), { data: f } = O.props.tool, E = m(() => {
      var g;
      return ((g = f.value) == null ? void 0 : g.tool) ?? "";
    }), B = m(() => {
      var g;
      return ((g = f.value) == null ? void 0 : g.note) ?? "";
    }), K = m(() => l.row.role !== "main" && (!l.row.ended_at || l.stoppedWithWork || l.waitReason));
    async function te() {
      !l.open || !K.value || (O.state["tool.agent"] = String(l.row.id), await O.reload("tool"));
    }
    const G = O.follow(["hook_call.*", "process_part.*"], gt(te, ft.agentCommand));
    return we(() => G == null ? void 0 : G()), ue(() => l.open, (g) => {
      g && te();
    }, { immediate: !0 }), (g, L) => {
      var W;
      return n(), o("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: L[2] || (L[2] = re(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (n(), o("p", Nt, "Retirement reason: " + p(e.row.retirement_reason), 1)) : k("", !0),
        e.row.resume_reason ? (n(), o("p", Ht, p(e.row.resume_reason), 1)) : k("", !0),
        K.value ? (n(), F(Ot, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: E.value,
          note: B.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : k("", !0),
        s.value ? (n(), o("p", Wt, p(s.value), 1)) : k("", !0),
        $(i(mt), {
          class: "agent-tabs",
          tabs: j.value,
          active: H.value,
          answer: { tasks: e.tasks.length, reports: i(P).length },
          onChoose: L[0] || (L[0] = (w) => H.value = w)
        }, null, 8, ["tabs", "active", "answer"]),
        $(i(ht), {
          class: "agent-tab-body",
          tab: H.value,
          "data-agent-tab-body": (W = H.value) == null ? void 0 : W.key
        }, {
          default: x(() => {
            var w;
            return [
              $(i(Ue), {
                value: (w = H.value) == null ? void 0 : w.key
              }, lt({
                reports: x(() => [
                  i(P).length ? k("", !0) : (n(), F(i(Le), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: x(() => [...L[3] || (L[3] = [
                      h("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (n(!0), o(z, null, ee(i(P), (u) => (n(), o("button", {
                    key: u.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${u.id}`,
                    onClick: (y) => i(je)(`messages:${u.id}`)
                  }, p(u.text), 9, qt))), 128))
                ]),
                tasks: x(() => {
                  var u;
                  return [
                    e.tasks.length ? k("", !0) : (n(), F(i(Le), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: x(() => [...L[4] || (L[4] = [
                        h("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (n(!0), o(z, null, ee(t.value, (y) => (n(), F(Et, {
                      key: y.state,
                      section: y,
                      open: C(y.state),
                      onToggle: (_) => b(y.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (u = e.facts) != null && u.instruction ? (n(), o(z, { key: 1 }, [
                      L[5] || (L[5] = d("p", { class: "agent-label" }, "Instruction", -1)),
                      d("div", Ft, p(e.facts.instruction), 1)
                    ], 64)) : k("", !0)
                  ];
                }),
                transcript: x(() => {
                  var u;
                  return [
                    D.value ? (n(), o(z, { key: 0 }, [
                      (u = e.facts) != null && u.instruction ? (n(), o("div", Dt, [
                        $(i(Pe), {
                          label: "Instruction",
                          open: T.value,
                          "data-agent-section": "instruction",
                          onToggle: L[1] || (L[1] = (y) => T.value = !T.value)
                        }, {
                          default: x(() => [
                            d("div", Pt, p(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (n(), o("p", Ut, "No job recorded")) : k("", !0)
                    ], 64)) : k("", !0),
                    $(At, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                ee(i(Z), (u, y) => ({
                  name: y,
                  fn: x(() => [
                    (n(), F(ot(u), {
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
}, Gt = /* @__PURE__ */ X(Kt, [["__scopeId", "data-v-3f66c406"]]), Zt = { class: "action-field" }, Yt = ["value", "disabled"], Qt = ["value"], Xt = { key: 1 }, _t = {
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
        d("label", Zt, [
          a[6] || (a[6] = h("Task ", -1)),
          d("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: a[0] || (a[0] = (s) => l.$emit("update:task", s.target.value))
          }, [
            a[5] || (a[5] = d("option", { value: "" }, "Choose an open task", -1)),
            (n(!0), o(z, null, ee(e.tasks, (s) => (n(), o("option", {
              key: s.id,
              value: String(s.id)
            }, p(s.id) + ": " + p(s.title), 9, Qt))), 128))
          ], 40, Yt)
        ]),
        e.moreTasks ? (n(), F(i(ae), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: a[1] || (a[1] = (s) => l.$emit("more"))
        }, {
          default: x(() => [...a[7] || (a[7] = [
            h("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : k("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (n(), o("p", Xt, "No open tasks.")) : k("", !0)
      ], 64)) : (n(), o("label", _t, [
        a[8] || (a[8] = h("Job", -1)),
        $(i(kt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: a[2] || (a[2] = (s) => l.$emit("update:text", s.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      d("div", ea, [
        $(i(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: x(() => [...a[9] || (a[9] = [
            h("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        $(i(ae), {
          small: "",
          disabled: e.pending,
          onClick: a[3] || (a[3] = (s) => l.$emit("cancel"))
        }, {
          default: x(() => [...a[10] || (a[10] = [
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
      a[5] || (a[5] = d("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      $(i(yt), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": a[0] || (a[0] = (s) => l.$emit("update:reason", s))
      }, null, 8, ["model-value", "disabled"]),
      d("div", na, [
        $(i(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: x(() => [...a[3] || (a[3] = [
            h("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        $(i(ae), {
          small: "",
          disabled: e.pending,
          onClick: a[1] || (a[1] = (s) => l.$emit("cancel"))
        }, {
          default: x(() => [...a[4] || (a[4] = [
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
}, ra = {
  key: 1,
  role: "status"
}, ia = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const l = e, a = ye(), s = I(""), t = I(""), r = I(""), c = I(""), C = I([]), b = I(0), O = I(!1), P = I(!1), D = I(!1), V = I(""), U = I(""), j = m(() => !!l.row.retired_at || l.row.state === "retired"), N = m(() => !j.value && !!l.row.ended_at), H = m(() => {
      var G;
      return N.value && ((G = l.row.job_command) == null ? void 0 : G.length) && !l.row.resume_reason;
    }), Z = m(() => H.value && !P.value && (l.row.job_task_flag ? C.value.some((G) => String(G.id) === c.value) : !!t.value.trim()));
    function T(G) {
      s.value = G, t.value = "", r.value = "", c.value = "", V.value = "", U.value = "";
    }
    async function f() {
      T("job"), l.row.job_task_flag && (C.value = [], b.value = 0, O.value = !1, await E());
    }
    async function E() {
      if (!P.value) {
        P.value = !0;
        try {
          a.state["jobs.page"] = String(b.value + 1), await a.reload("jobs");
          const G = a.props.jobs;
          V.value = G.failure.value, V.value || (C.value = [...C.value, ...G.rows.value], b.value = G.data.value.page, O.value = G.more.value);
        } finally {
          P.value = !1;
        }
      }
    }
    async function B(G, g) {
      if (!D.value) {
        D.value = !0, V.value = "";
        try {
          const L = await a.run(G);
          V.value = L.ok ? "" : L.error, L.ok && (T(""), U.value = g);
        } finally {
          D.value = !1;
        }
      }
    }
    async function K() {
      if (!Z.value) return;
      const G = l.row.job_task_flag ? [l.row.job_task_flag, c.value] : [t.value.trim()];
      await B([...l.row.job_command, String(l.row.id), ...G], "Job sent.");
    }
    async function te() {
      !N.value || s.value !== "retire" || !r.value.trim() || await B(["agent", "retire", String(l.row.id), "--reason", r.value.trim()], "Agent retired permanently.");
    }
    return (G, g) => {
      var L;
      return j.value ? k("", !0) : (n(), o("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: g[6] || (g[6] = re(() => {
        }, ["stop"])),
        onKeydown: g[7] || (g[7] = re(() => {
        }, ["stop"]))
      }, [
        d("div", oa, [
          N.value ? (n(), o(z, { key: 0 }, [
            (L = e.row.job_command) != null && L.length ? (n(), F(i(ae), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: D.value || P.value || !H.value,
              onClick: f
            }, {
              default: x(() => [...g[8] || (g[8] = [
                h("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0),
            e.row.role !== "main" ? (n(), F(i(ae), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: D.value || P.value,
              onClick: g[0] || (g[0] = (W) => T("retire"))
            }, {
              default: x(() => [...g[9] || (g[9] = [
                h("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0)
          ], 64)) : k("", !0)
        ]),
        $(i(Ue), { value: s.value }, {
          job: x(() => [
            $(aa, {
              task: c.value,
              "onUpdate:task": g[1] || (g[1] = (W) => c.value = W),
              text: t.value,
              "onUpdate:text": g[2] || (g[2] = (W) => t.value = W),
              row: e.row,
              tasks: C.value,
              pending: D.value,
              loading: P.value,
              "more-tasks": O.value,
              failure: V.value,
              "job-ready": Z.value,
              onSubmit: K,
              onMore: E,
              onCancel: g[3] || (g[3] = (W) => T(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: x(() => [
            $(Ke, {
              reason: r.value,
              "onUpdate:reason": g[4] || (g[4] = (W) => r.value = W),
              pending: D.value,
              onSubmit: te,
              onCancel: g[5] || (g[5] = (W) => T(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        V.value ? (n(), o("p", sa, p(V.value), 1)) : k("", !0),
        U.value ? (n(), o("p", ra, p(U.value), 1)) : k("", !0)
      ], 32));
    };
  }
}, ua = /* @__PURE__ */ X(ia, [["__scopeId", "data-v-4cb32275"]]), da = { key: 0 }, ca = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" } },
  setup(e) {
    const l = /* @__PURE__ */ new Set(["running", "working", "thinking"]), a = e, s = m(() => l.has(a.state)), t = m(() => a.since ? `${a.doing}. ${a.since}` : a.doing);
    return (r, c) => (n(), F(i(Te), {
      as: "button",
      place: "corner",
      class: le(["agent-dot", { pulse: s.value }]),
      "data-state": e.state,
      "aria-label": t.value,
      "data-agent-status": "",
      onClick: c[0] || (c[0] = re(() => {
      }, ["stop"]))
    }, {
      tip: x(() => [
        d("b", null, p(e.doing), 1),
        e.since ? (n(), o("span", da, p(e.since), 1)) : k("", !0)
      ]),
      default: x(() => [
        c[1] || (c[1] = d("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, va = /* @__PURE__ */ X(ca, [["__scopeId", "data-v-8d827ded"]]), Ge = { started: { fill: 33, words: "started" }, testing: { fill: 66, words: "being tested" }, blocked: { fill: 33, words: "blocked" } }, pa = 30, Ze = (e) => e.filter((l) => l.state !== "cancelled");
function ga(e, l) {
  const a = Ze(e), s = Ge[l == null ? void 0 : l.state];
  return a.length > pa ? { continuous: !0, done: a.filter((c) => c.state === "completed").length / a.length * 100, now: s ? s.fill / 100 / a.length * 100 : 0, segments: [] } : { continuous: !1, done: 0, now: 0, segments: a.map((r) => r.state === "completed" ? { kind: "done", fill: 0 } : r.id === (l == null ? void 0 : l.id) && s ? { kind: "now", fill: s.fill } : { kind: "todo", fill: 0 }) };
}
function fa({ tasks: e, inHand: l, perHour: a }) {
  const s = Ze(e), t = s.filter((b) => b.state === "completed").length, r = Ge[l == null ? void 0 : l.state], c = s.length - t - (l && l.state !== "completed" ? 1 : 0), C = t === s.length;
  return {
    number: l.id,
    title: l.title,
    count: `${t} of ${s.length}`,
    taskTip: `${t} of its ${s.length} tasks done${r ? `. This one is ${r.words}.` : "."}`,
    countTip: C ? `All ${s.length} tasks done` : `${t} done, 1 in hand, ${c} to go`,
    paceTip: !C && a ? `About ${a} an hour.` : "",
    bar: ga(e, l)
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
    const l = e, a = m(() => l.inHand ? fa({ tasks: l.tasks, inHand: l.inHand, perHour: l.perHour }) : null);
    return (s, t) => e.job && !a.value ? (n(), o("span", ma, [
      $(i(Te), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: x(() => [
          d("b", null, p(e.job), 1)
        ]),
        default: x(() => [
          t[1] || (t[1] = h("Job", -1))
        ]),
        _: 1
      })
    ])) : a.value ? (n(), o(z, { key: 1 }, [
      d("span", ha, [
        $(i(Te), {
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${a.value.number}`,
          "aria-label": `Task ${a.value.number}: ${a.value.title}`,
          onClick: t[0] || (t[0] = re((r) => i(je)(`tasks:${a.value.number}`), ["stop"]))
        }, {
          tip: x(() => [
            d("b", null, p(a.value.title), 1),
            d("span", null, p(a.value.taskTip), 1)
          ]),
          default: x(() => [
            h("Task " + p(a.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"]),
        $(i(Te), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: x(() => [
            d("b", null, p(a.value.countTip), 1),
            a.value.paceTip ? (n(), o("span", ka, p(a.value.paceTip), 1)) : k("", !0)
          ]),
          default: x(() => [
            h(p(a.value.count), 1)
          ]),
          _: 1
        })
      ]),
      d("span", {
        class: le(["bar", { continuous: a.value.bar.continuous }]),
        "data-state": e.state,
        style: pe(a.value.bar.continuous ? { "--done": `${a.value.bar.done}%`, "--now": `${a.value.bar.now}%` } : void 0),
        "data-agent-bar": "",
        "aria-hidden": "true"
      }, [
        (n(!0), o(z, null, ee(a.value.bar.segments, (r, c) => (n(), o("i", {
          key: c,
          class: le(r.kind),
          style: pe(r.kind === "now" ? { "--fill": `${r.fill}%` } : void 0)
        }, null, 6))), 128))
      ], 14, ya)
    ], 64)) : k("", !0);
  }
}, wa = /* @__PURE__ */ X(ba, [["__scopeId", "data-v-357b6ada"]]), Ma = ["data-icon", "stroke-width", "innerHTML"], oe = {
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
      class: le(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (n(), o("span", $a, p(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (n(), o("span", xa, [
        d("span", null, [
          Me(l.$slots, "default", {}, void 0, !0)
        ]),
        d("small", null, p(e.description), 1)
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
}, Ra = {
  key: 0,
  class: "skills-none"
}, Oa = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: l }) {
    const a = e, s = l, t = m(() => a.skills.filter((c) => c.state === "loaded")), r = m(() => a.skills.filter((c) => c.state !== "loaded"));
    return (c, C) => (n(), o("div", ja, [
      $(be, null, {
        default: x(() => [...C[1] || (C[1] = [
          h("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      t.value.length ? k("", !0) : (n(), o("p", Ra, "None yet. Compacting the conversation empties this list.")),
      (n(!0), o(z, null, ee(t.value, (b) => (n(), o("p", {
        key: b.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        $(oe, {
          name: "book",
          size: 12
        }),
        h(p(b.skill), 1)
      ]))), 128)),
      r.value.length ? (n(), o(z, { key: 1 }, [
        $(be, null, {
          default: x(() => [...C[2] || (C[2] = [
            h("Still to read", -1)
          ])]),
          _: 1
        }),
        (n(!0), o(z, null, ee(r.value, (b) => (n(), o("p", {
          key: b.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          $(oe, {
            name: "book",
            size: 12
          }),
          h(p(b.skill), 1)
        ]))), 128))
      ], 64)) : k("", !0),
      $(ke, {
        "data-agent-skills-browse": "",
        onClick: C[0] || (C[0] = (b) => s("browse"))
      }, {
        default: x(() => [...C[3] || (C[3] = [
          h("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, La = /* @__PURE__ */ X(Oa, [["__scopeId", "data-v-be514d47"]]), Ba = ["disabled", "title"], Ia = { class: "gauge usage" }, za = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: l }) {
    const a = e, s = l, t = m(() => a.windows[0] ?? null), r = m(() => t.value ? Math.max(0, Math.min(100, Math.round(t.value.used_percent))) : null);
    return (c, C) => r.value !== null ? (n(), o("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: `${r.value}% of the plan's ${t.value.title} allowance used`,
      onClick: C[0] || (C[0] = (b) => s("open", b.currentTarget))
    }, [
      $(oe, {
        name: "allowance",
        size: 12
      }),
      C[1] || (C[1] = h()),
      d("span", Ia, [
        d("span", {
          style: pe({ width: `${r.value}%` })
        }, null, 4)
      ]),
      h(" " + p(r.value) + "% ", 1)
    ], 8, Ba)) : k("", !0);
  }
}, Va = /* @__PURE__ */ X(za, [["__scopeId", "data-v-02e9922e"]]), Ea = (e, l, a) => Math.max(l, Math.min(a, e)), Ye = /* @__PURE__ */ new WeakMap(), Na = (e, l) => Ye.set(e, l);
function Ha(e, l) {
  for (let a = l; a; a = Ye.get(a) ?? a.parentElement) if (a === e) return !0;
  return !1;
}
function Wa(e, l) {
  const a = (s) => {
    var r, c;
    const t = ((r = e.value) == null ? void 0 : r.element) || ((c = e.value) == null ? void 0 : c.$el) || e.value;
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
    const s = e, t = I(null), r = (w) => w ? `${w}px` : void 0, c = m(() => ({
      minWidth: r(s.minWidth),
      maxWidth: r(s.maxWidth),
      maxHeight: r(s.maxHeight),
      height: r(s.height)
    })), C = I({ w: 0, h: 0 }), b = I(s.anchor ? s.anchor.getBoundingClientRect() : null), O = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), P = (w) => ({
      left: Math.max(0, w.left),
      top: Math.max(0, w.top),
      right: Math.min(window.innerWidth, w.right),
      bottom: Math.min(window.innerHeight, w.bottom)
    }), D = (w) => {
      const u = w.closest(".pane, .float-window");
      return u ? P(u.getBoundingClientRect()) : O();
    }, V = (w, u) => `${Math.max(0, w ? Math.min(w, u) : u)}px`;
    function U(w, u) {
      return {
        below: w.bottom - u.bottom - s.gap - he,
        above: u.top - w.top - s.gap - he,
        across: w.right - w.left - 2 * he
      };
    }
    function j(w) {
      const u = D(s.anchor), y = U(u, w);
      return C.value.w <= y.across && C.value.h <= Math.max(y.below, y.above) ? u : O();
    }
    const N = m(() => {
      if (!b.value) return c.value;
      const w = b.value, u = j(w), y = U(u, w), { w: _, h: S } = C.value, v = s.align === "auto" ? w.left + w.right > u.left + u.right : s.align === "right", M = Ea(v ? w.right - _ : w.left, u.left + he, Math.max(u.left + he, u.right - _ - he)), Y = S > y.below && y.above > y.below ? { bottom: `${window.innerHeight - w.top + s.gap}px`, maxHeight: V(s.maxHeight, y.above) } : { top: `${w.bottom + s.gap}px`, maxHeight: V(s.maxHeight, y.below) };
      return { ...c.value, ...Y, left: `${M}px`, maxWidth: V(s.maxWidth, y.across) };
    }), H = a, Z = () => [...t.value.querySelectorAll("button:not(:disabled)")];
    function T(w) {
      const u = Z(), y = u.indexOf(document.activeElement);
      u[(y + w + u.length) % u.length].focus();
    }
    const f = { ArrowDown: () => T(1), ArrowUp: () => T(-1), Escape: () => H("close") }, E = (w) => f[w.key] && (w.preventDefault(), f[w.key]()), B = () => t.value && (C.value = { w: t.value.offsetWidth, h: t.value.scrollHeight });
    let K = 0;
    const te = new ResizeObserver(() => {
      cancelAnimationFrame(K), K = requestAnimationFrame(B);
    });
    Wa(t, (w) => s.anchor && !s.anchor.contains(w.target) && H("close"));
    const G = (w, u) => ["top", "left", "right", "bottom"].some((y) => Math.abs(w[y] - u[y]) > 1), g = (w) => w.bottom < 0 || w.top > window.innerHeight;
    let L = 0;
    function W() {
      if (s.anchor) {
        const w = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || g(w)) return H("close");
        G(w, b.value) && (b.value = w);
      }
      L = requestAnimationFrame(W);
    }
    return st(() => {
      s.anchor && t.value && Na(t.value, s.anchor), B(), t.value && te.observe(t.value), !s.plain && Z()[0] && Z()[0].focus(), W();
    }), we(() => {
      te.disconnect(), cancelAnimationFrame(L), cancelAnimationFrame(K);
    }), l({ element: t }), (w, u) => (n(), F(rt, {
      to: "body",
      disabled: !e.anchor
    }, [
      d("div", it({
        ref_key: "panel",
        ref: t
      }, w.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: N.value,
        onKeydown: E
      }), [
        Me(w.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Fa = /* @__PURE__ */ X(qa, [["__scopeId", "data-v-3d203970"]]);
async function Da(e, l, a) {
  if (!e) return a(l);
  const { target: s, fields: t } = e, r = Object.fromEntries(Object.keys(t).map((b) => [b, s[b]])), c = () => Object.assign(s, r);
  Object.assign(s, t);
  let C = !1;
  try {
    const b = await a(l);
    return C = b.ok, b;
  } finally {
    C || c();
  }
}
function Pa(e, l, a, { groups: s, programs: t }) {
  const r = I({}), c = I(""), C = I(!1), b = m(() => !!e.value && !e.value.ended_at), O = m(() => b.value && !!e.value.paused_at);
  async function P(j, N = null) {
    c.value = "";
    const H = await Da(N, j, l);
    return c.value = H.ok ? "" : H.error, a(), H;
  }
  return { groups: s, programs: t, chosen: r, failure: c, asking: C, running: b, paused: O, choose: (j, N) => P(["agent", "control", String(e.value.id), j, N.value], { target: r, fields: { value: { ...r.value, [j]: N.label } } }), stop: () => (C.value = !1, P(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (j) => P(["agent", "launch", j.name]) };
}
function Ua(e) {
  if (!e) return "Not compacted yet";
  const l = new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return e.start_percent === null ? `Last compacted ${l}` : e.end_percent === null ? `Last compacted ${l}, from ${e.start_percent}%` : `Last compacted ${l}, from ${e.start_percent}% to ${e.end_percent}%, ${e.start_percent - e.end_percent}% taken off`;
}
const Ja = ["disabled", "title"], Ka = ["disabled", "title"], Ga = { class: "gauge" }, Za = ["disabled", "title"], Ya = ["disabled"], Qa = ["disabled"], Xa = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, _a = ["title"], en = {
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
    const a = e, s = l, t = Pa(Re(a, "agent"), a.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => s("changed"), { groups: Re(a, "controlGroups"), programs: Re(a, "agentPrograms") }), r = I(null), c = I(""), C = m(() => t.groups.value.find((T) => T.key === c.value));
    function b(T, f) {
      r.value = T.currentTarget, c.value = f;
    }
    function O() {
      r.value = null, c.value = "", t.asking.value = !1;
    }
    const P = m(() => a.skills.filter((T) => T.state === "loaded"));
    function D(T) {
      b(T, "skills"), s("skills");
    }
    const V = (T) => t.groups.value.some((f) => f.key === T), U = m(() => {
      var T;
      return t.chosen.value.model ?? ((T = N.value) == null ? void 0 : T.model) ?? "";
    }), j = m(() => {
      var T;
      return t.chosen.value.effort ?? ((T = N.value) == null ? void 0 : T.effort) ?? "";
    });
    m(() => !!a.agent && !a.agent.ended_at);
    const N = m(() => {
      var T;
      return ((T = a.usage.agents) == null ? void 0 : T.find((f) => {
        var E;
        return f.id === ((E = a.agent) == null ? void 0 : E.id);
      })) ?? null;
    }), H = m(() => {
      var T;
      return ((T = N.value) == null ? void 0 : T.context_percent) == null ? null : Math.round(N.value.context_percent);
    }), Z = m(() => {
      var T;
      return (T = N.value) != null && T.cost_dollars ? `$${N.value.cost_dollars.toFixed(2)}` : "";
    });
    return (T, f) => {
      var E;
      return n(), o("div", {
        class: le(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (n(), o(z, { key: 0 }, [
          d("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: f[0] || (f[0] = (B) => b(B, "agent"))
          }, [
            $(oe, {
              name: "agents",
              size: 12
            }),
            h(" " + p(((E = e.agentPrograms.find((B) => B.name === e.agent.program)) == null ? void 0 : E.title) || e.agent.program), 1)
          ], 8, Ja),
          $(Va, {
            windows: e.usage.windows,
            onOpen: f[1] || (f[1] = (B) => s("open", "usage", B))
          }, null, 8, ["windows"]),
          H.value !== null ? (n(), o("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${H.value}% full: clear or compact it`,
            onClick: f[2] || (f[2] = (B) => V("context") ? b(B, "context") : s("open", "context", B.currentTarget))
          }, [
            $(oe, {
              name: "gauge",
              size: 12
            }),
            f[14] || (f[14] = h()),
            d("span", Ga, [
              d("span", {
                style: pe({ width: `${H.value}%` })
              }, null, 4)
            ]),
            h(" " + p(H.value) + "% ", 1)
          ], 8, Ka)) : k("", !0),
          U.value ? (n(), o("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${U.value}: change the model`,
            onClick: f[3] || (f[3] = (B) => V("model") ? b(B, "model") : null)
          }, [
            $(oe, {
              name: "model",
              size: 12
            }),
            h(" " + p(U.value), 1)
          ], 8, Za)) : k("", !0),
          V("effort") || e.card && j.value ? (n(), o("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: f[4] || (f[4] = (B) => b(B, "effort"))
          }, [
            $(oe, {
              name: "bolt",
              size: 12
            }),
            h(" " + p(j.value), 1)
          ], 8, Ya)) : k("", !0),
          Z.value ? (n(), o("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: f[5] || (f[5] = (B) => s("open", "cost", B.currentTarget))
          }, p(Z.value), 9, Qa)) : k("", !0),
          e.branch ? (n(), o("span", Xa, [
            $(oe, {
              name: "branch",
              size: 12
            }),
            h(" " + p(e.branch), 1)
          ])) : k("", !0),
          e.card ? k("", !0) : (n(), o("button", {
            key: 5,
            type: "button",
            class: le(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: f[6] || (f[6] = (B) => s("open", "jobs", B.currentTarget))
          }, [
            $(oe, {
              name: "clock",
              size: 12
            }),
            h(" " + p(e.jobs), 1)
          ], 2)),
          e.run ? (n(), o("button", {
            key: 6,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: D
          }, [
            $(oe, {
              name: "book",
              size: 12
            }),
            h(" " + p(P.value.length), 1)
          ])) : k("", !0),
          e.fitness ? (n(), o(z, { key: 7 }, [
            d("button", {
              type: "button",
              class: le(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < ln }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: f[7] || (f[7] = (B) => s("open", "fitness", B.currentTarget))
            }, [
              $(oe, {
                name: "heart",
                size: 12
              }),
              h(" " + p(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            d("button", {
              type: "button",
              class: le(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: f[8] || (f[8] = (B) => s("open", "load", B.currentTarget))
            }, [
              $(oe, {
                name: "weight",
                size: 12
              }),
              h(" " + p(e.fitness.workload), 1)
            ], 2)
          ], 64)) : k("", !0)
        ], 64)) : e.run && !e.loading ? (n(), o("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: f[9] || (f[9] = (B) => b(B, "start"))
        }, [
          $(oe, {
            name: "agents",
            size: 12
          }),
          f[15] || (f[15] = h(" Start an agent", -1))
        ])) : k("", !0),
        f[21] || (f[21] = d("span", { class: "space" }, null, -1)),
        i(t).failure.value ? (n(), o("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: i(t).failure.value
        }, p(i(t).failure.value), 9, _a)) : k("", !0),
        Me(T.$slots, "default", {}, void 0, !0),
        r.value ? (n(), F(Fa, {
          key: 3,
          anchor: r.value,
          "min-width": 190,
          onClose: O
        }, {
          default: x(() => {
            var B;
            return [
              c.value === "agent" ? (n(), o(z, { key: 0 }, [
                i(t).asking.value ? (n(), o(z, { key: 0 }, [
                  $(be, { "data-agent-stop-ask": "" }, {
                    default: x(() => [...f[16] || (f[16] = [
                      h("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  $(ke, {
                    "data-agent-stop-confirm": "",
                    onClick: f[10] || (f[10] = (K) => (O(), i(t).stop()))
                  }, {
                    default: x(() => [...f[17] || (f[17] = [
                      h("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  $(ke, {
                    onClick: f[11] || (f[11] = (K) => i(t).asking.value = !1)
                  }, {
                    default: x(() => [...f[18] || (f[18] = [
                      h("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (n(), F(ke, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: f[12] || (f[12] = (K) => i(t).asking.value = !0)
                }, {
                  default: x(() => [...f[19] || (f[19] = [
                    h("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : c.value === "start" ? (n(), o(z, { key: 1 }, [
                $(be, null, {
                  default: x(() => [...f[20] || (f[20] = [
                    h("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (n(!0), o(z, null, ee(i(t).programs.value, (K) => (n(), F(ke, {
                  key: K.name,
                  "data-agent-program": K.name,
                  onClick: (te) => (O(), i(t).start(K))
                }, {
                  default: x(() => [
                    h(p(K.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : c.value === "skills" ? (n(), F(La, {
                key: 2,
                skills: e.skills,
                onBrowse: f[13] || (f[13] = (K) => (O(), s("open", "skills", null)))
              }, null, 8, ["skills"])) : C.value ? (n(), o(z, { key: 3 }, [
                $(be, null, {
                  default: x(() => [
                    h(p(C.value.label), 1)
                  ]),
                  _: 1
                }),
                c.value === "context" ? (n(), o(z, { key: 0 }, [
                  d("p", en, p(i(Ua)(((B = N.value) == null ? void 0 : B.last_compaction) ?? null)), 1),
                  d("div", tn, [
                    d("span", an, [
                      d("span", {
                        style: pe({ width: `${H.value}%` })
                      }, null, 4)
                    ]),
                    d("span", nn, p(H.value) + "%", 1)
                  ])
                ], 64)) : k("", !0),
                (n(!0), o(z, null, ee(C.value.choices, (K) => (n(), F(ke, {
                  key: K.value,
                  "data-agent-choice": K.value,
                  onClick: (te) => (i(t).choose(C.value.key, K), O())
                }, {
                  default: x(() => [
                    h(p(K.label), 1)
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
}, pn = { class: "agent-line" }, gn = {
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
    const a = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), s = { helper: "Helper", reviewer: "Reviewer" }, t = e, r = l, c = Ie(), C = m(() => {
      var y, _;
      if ((y = t.facts) != null && y.profile_title) return t.facts.profile_title;
      if ((_ = t.facts) != null && _.profile) return t.facts.profile;
      const u = s[t.row.role] || t.row.role;
      return u.slice(0, 1).toUpperCase() + u.slice(1);
    }), b = m(() => {
      var u;
      return ((u = t.facts) == null ? void 0 : u.tasks) ?? [];
    }), O = m(() => b.value.filter((u) => u.state === "open")), P = m(() => b.value.find((u) => {
      var y;
      return u.id === ((y = t.progress) == null ? void 0 : y.task_id) && u.state === "started";
    })), D = m(() => P.value || b.value.find((u) => {
      var y;
      return u.id === ((y = t.facts) == null ? void 0 : y.task_id);
    }) || b.value.find((u) => a.has(u.state)) || O.value[0] || b.value.at(-1)), V = m(() => {
      var u, y, _, S, v, M;
      return t.row.role === "helper" ? ((u = t.facts) == null ? void 0 : u.helper_job) || "" : (y = t.facts) != null && y.job_enabled && (((_ = P.value) == null ? void 0 : _.title) || ((S = t.facts) == null ? void 0 : S.task_title) || ((v = O.value[0]) == null ? void 0 : v.title) || ((M = b.value.at(-1)) == null ? void 0 : M.title)) || "";
    }), U = m(() => {
      var u;
      return (u = t.facts) != null && u.job_enabled ? `${t.row.role} ${t.row.id}` : "";
    }), j = m(() => {
      var u, y;
      return [t.row.program, (u = t.facts) == null ? void 0 : u.model, (y = t.facts) == null ? void 0 : y.effort, U.value].filter(Boolean).join(" · ");
    }), N = ye(), H = m(() => Je(t.row.process_started_at || t.row.created_at, c.value)), Z = /* @__PURE__ */ new Set(["open", "started", "testing"]), T = m(() => {
      var u;
      return (u = t.facts) == null ? void 0 : u.work_status;
    }), f = m(() => !!t.row.ended_at && t.row.role !== "main" && b.value.some((u) => Z.has(u.state))), E = m(() => {
      var u;
      return t.row.retired_at || t.row.state === "retired" ? "retired" : T.value || t.waitReason || f.value ? "waiting" : t.row.state === "running" && ((u = t.facts) == null ? void 0 : u.state) || t.row.state;
    }), B = m(() => {
      var u;
      return T.value ? `Status: ${T.value}` : t.waitReason ? `Waiting: ${t.waitReason}` : E.value === "blocked" ? (u = t.facts) != null && u.blocked_reason ? `Blocked: ${t.facts.blocked_reason}` : "Blocked" : f.value ? "Stopped with work left" : "";
    }), K = m(() => {
      var u;
      return ((u = t.progress) == null ? void 0 : u.completed_count) ?? b.value.filter((y) => y.state === "completed").length;
    }), te = m(() => {
      var u;
      return bt(K.value, ((u = t.progress) == null ? void 0 : u.started_at) || t.row.created_at, t.progress ? t.progress.finished_at : t.row.ended_at, c.value);
    }), G = m(() => t.row.role === "main" ? 0 : te.value), g = m(() => !!t.row.retired_at || t.row.state === "retired"), L = m(() => g.value ? "Retired" : E.value === "blocked" || E.value === "waiting" ? B.value || (E.value === "blocked" ? "Blocked" : "Waiting") : t.row.ended_at ? "Idle: its process has stopped" : "Working"), W = m(() => {
      var y;
      if (g.value) return t.row.retired_at;
      const u = E.value === "blocked" || E.value === "waiting";
      return t.row.ended_at || u && ((y = t.facts) == null ? void 0 : y.last_activity) || t.row.process_started_at || t.row.created_at;
    }), w = m(() => W.value ? `Since ${new Date(W.value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${wt(W.value, c.value)}` : "");
    return (u, y) => {
      var _, S, v, M, J, Y;
      return n(), o("div", {
        class: le(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: y[2] || (y[2] = (ne) => !e.open && r("toggle")),
        onKeydown: [
          y[3] || (y[3] = He(re((ne) => !e.open && r("toggle"), ["self", "prevent"]), ["enter"])),
          y[4] || (y[4] = He(re((ne) => !e.open && r("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        d("span", un, [
          e.open ? (n(), o("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: y[0] || (y[0] = re((ne) => r("toggle"), ["stop"]))
          }, [
            $(i($e), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : k("", !0),
          d("span", dn, p(C.value), 1),
          d("span", cn, p(((_ = e.facts) == null ? void 0 : _.given_name) || e.row.id), 1),
          e.open ? k("", !0) : (n(), F(i($e), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          e.open ? (n(), o("span", vn, p(H.value), 1)) : k("", !0)
        ]),
        d("span", pn, [
          d("span", gn, p(j.value), 1),
          (S = e.facts) != null && S.sandbox_off ? (n(), o("span", fn, "sandbox off")) : k("", !0),
          e.open ? (n(), o("span", mn, [
            y[5] || (y[5] = h("Started ", -1)),
            $(i(qe), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : k("", !0),
          e.open && ((v = e.facts) != null && v.last_activity) ? (n(), o("span", hn, [
            y[6] || (y[6] = h("Last heard ", -1)),
            $(i(qe), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : k("", !0)
        ]),
        e.open ? (n(), F(sn, {
          key: 0,
          "agent-programs": i(N).props.programs.rows.value,
          agent: e.row,
          branch: (M = e.progress) == null ? void 0 : M.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((J = e.facts) == null ? void 0 : J.windows) ?? [] },
          card: ""
        }, {
          default: x(() => [
            $(ua, { row: e.row }, null, 8, ["row"]),
            e.row.role === "helper" && !e.row.ended_at ? (n(), F(i(ae), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: y[1] || (y[1] = re((ne) => i(N).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: x(() => [...y[7] || (y[7] = [
                h("Stop", -1)
              ])]),
              _: 1
            })) : k("", !0)
          ]),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : k("", !0),
        e.open ? k("", !0) : (n(), F(wa, {
          key: 1,
          tasks: b.value,
          "in-hand": e.row.role !== "helper" && ((Y = e.facts) != null && Y.job_enabled) && D.value || null,
          job: e.row.role === "helper" ? V.value : "",
          state: E.value,
          "per-hour": G.value
        }, null, 8, ["tasks", "in-hand", "job", "state", "per-hour"])),
        $(va, {
          state: E.value,
          doing: L.value,
          since: w.value
        }, null, 8, ["state", "doing", "since"]),
        e.open ? (n(), F(Gt, {
          key: 2,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: b.value,
          "stopped-with-work": f.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : k("", !0)
      ], 42, rn);
    };
  }
}, yn = /* @__PURE__ */ X(kn, [["__scopeId", "data-v-fd7cb111"]]), bn = ["data-edit-type"], wn = { key: 0 }, Mn = { class: "stepper" }, $n = ["disabled", "onClick"], xn = ["value", "disabled", "data-agent-limit-input", "onChange"], Cn = ["disabled", "onClick"], Sn = { key: 0 }, An = { key: 1 }, Tn = {
  __name: "AgentLimitEditor",
  props: { rows: { type: Array, required: !0 }, pending: Boolean, readOnly: Boolean, environment: { type: String, required: !0 } },
  emits: ["change"],
  setup(e, { emit: l }) {
    const a = l;
    return (s, t) => (n(), o(z, null, [
      t[0] || (t[0] = d("p", null, "How many agents of a type may run at once, and how many may be kept.", -1)),
      (n(!0), o(z, null, ee(e.rows, (r) => (n(), o("div", {
        key: r.key,
        class: "edit-row",
        "data-edit-type": r.key
      }, [
        d("div", null, [
          d("strong", null, p(r.per_profile ? "Each helper type" : "Workers"), 1),
          r.per_profile ? (n(), o("small", wn, "Researcher, Planner and the others")) : k("", !0)
        ]),
        (n(!0), o(z, null, ee([{ name: "Most running", value: r.run_limit, key: r.run_setting, source: r.run_source, kind: "run" }, { name: "Most kept", value: r.kept_limit, key: r.kept_setting, source: r.kept_source, kind: "kept" }], (c) => (n(), o("label", {
          key: c.key
        }, [
          h(p(c.name), 1),
          d("span", Mn, [
            d("button", {
              type: "button",
              disabled: e.pending || e.readOnly || c.value === 0,
              onClick: (C) => a("change", r, c.key, c.value, c.value - 1)
            }, "−", 8, $n),
            d("input", {
              type: "number",
              min: "0",
              value: c.value,
              disabled: e.pending || e.readOnly,
              "data-agent-limit-input": c.kind,
              onChange: (C) => a("change", r, c.key, c.value, C.target.value)
            }, null, 40, xn),
            d("button", {
              type: "button",
              disabled: e.pending || e.readOnly,
              onClick: (C) => a("change", r, c.key, c.value, c.value + 1)
            }, "+", 8, Cn)
          ]),
          c.value === 0 ? (n(), o("small", Sn, p(c.kind === "run" ? "None can start" : "Any number"), 1)) : c.source === `environment ${e.environment}` ? (n(), o("small", An, "Changed for " + p(e.environment), 1)) : k("", !0)
        ]))), 128))
      ], 8, bn))), 128))
    ], 64));
  }
}, jn = /* @__PURE__ */ X(Tn, [["__scopeId", "data-v-218442c9"]]), Qe = (e) => e.flatMap((l) => l.per_profile ? l.profiles.map((a) => ({ ...a, label: a.title, type: l.key, key: `${l.key}:${a.profile}` })) : [{ ...l, type: l.key }]), Be = (e, l) => l > 0 && e >= l, Rn = { class: "counts-panel" }, On = { class: "counts" }, Ln = ["data-count-agent"], Bn = { class: "person-text" }, In = {
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
    const a = l, s = ut(e, "title"), t = ye(), { rows: r, failure: c } = t.props.limits, C = I([]), b = I(0), O = I(!1), P = Ie(), D = I(null), V = I(!1), U = I(!1), j = I(""), N = I(""), H = I(null), Z = I(""), T = m(() => Qe(r.value)), f = m(() => r.value.find((S) => S.per_profile)), E = m(() => T.value.find((S) => S.key === D.value)), B = m(() => C.value.filter((S) => {
      var v, M;
      return S.state !== "retired" && S.role === ((v = E.value) == null ? void 0 : v.type) && (!E.value.profile || (((M = S.facts) == null ? void 0 : M.profile) || S.profile) === E.value.profile);
    }).sort((S, v) => (S.state !== "running") - (v.state !== "running") || String(S.ended_at || S.created_at).localeCompare(String(v.ended_at || v.created_at)))), K = m(() => {
      var v;
      const S = /* @__PURE__ */ new Map();
      for (const M of B.value) {
        const J = ((v = M.facts) == null ? void 0 : v.model) || M.program_model;
        J && S.set(J, (S.get(J) || 0) + 1);
      }
      return [...S].map(([M, J]) => `${J} ${M}`).join(", ");
    }), te = (S, v) => v ? `${Math.min(S / Math.max(S, v) * 100, 100)}%` : "0%", G = (S, v) => v && S > v ? `${(S - v) / S * 100}%` : "0%";
    ue(() => {
      var S;
      return V.value ? "Change the maximums" : ((S = E.value) == null ? void 0 : S.label) || "Agent counts";
    }, (S) => {
      s.value = S;
    }, { immediate: !0 });
    async function g(S, v = 1) {
      t.state["count-agents.role"] = S.type, S.profile ? t.state["count-agents.profile"] = S.profile : delete t.state["count-agents.profile"], t.state["count-agents.page"] = String(v), await t.reload("count-agents");
      const M = t.props["count-agents"];
      C.value = v === 1 ? [...M.rows.value] : [...C.value, ...M.rows.value], b.value = v, O.value = M.more.value;
    }
    function L(S) {
      D.value = S.key, C.value = [], g(S);
    }
    function W() {
      V.value = !1, D.value = null, H.value = null, j.value = "";
    }
    function w() {
      W(), a("close");
    }
    async function u(S, v, M, J) {
      if (U.value || t.readOnly) return;
      const Y = Number(J);
      if (!String(J).trim() || !Number.isInteger(Y) || Y < 0) {
        j.value = "Use a whole number of 0 or more.";
        return;
      }
      U.value = !0, j.value = "";
      const ne = await t.run(["setting", "set", v, String(Y), "--environment", t.environment]);
      ne.ok ? (await t.reload("limits"), N.value = "Saved.") : j.value = ne.error, U.value = !1;
    }
    async function y(S) {
      if (!Z.value.trim() || U.value) return;
      U.value = !0;
      const v = await t.run(["agent", "retire", String(S.id), "--reason", Z.value.trim()]);
      j.value = v.ok ? "" : "The agent could not be retired. Try again.", v.ok && (H.value = null, Z.value = "", N.value = "Agent retired permanently.", await t.reload("limits"), await g(E.value)), U.value = !1;
    }
    function _(S) {
      w(), a("open-agent", S);
    }
    return (S, v) => (n(), o("div", Rn, [
      d("div", On, [
        V.value || E.value ? (n(), o("button", {
          key: 0,
          class: "back",
          type: "button",
          onClick: W
        }, "‹ Back to the counts")) : k("", !0),
        i(c) ? (n(), o(z, { key: 1 }, [
          v[6] || (v[6] = d("strong", null, "The counts could not be read", -1)),
          v[7] || (v[7] = d("p", null, "The journal did not answer.", -1)),
          $(i(ae), {
            small: "",
            onClick: v[0] || (v[0] = (M) => i(t).reload("limits"))
          }, {
            default: x(() => [...v[5] || (v[5] = [
              h("Try again", -1)
            ])]),
            _: 1
          })
        ], 64)) : V.value ? (n(), F(jn, {
          key: 2,
          rows: i(r),
          pending: U.value,
          "read-only": i(t).readOnly,
          environment: i(t).environment,
          onChange: u
        }, null, 8, ["rows", "pending", "read-only", "environment"])) : E.value ? (n(), o(z, { key: 3 }, [
          d("p", null, [
            d("strong", null, p(E.value.running) + " of " + p(E.value.run_limit), 1),
            v[8] || (v[8] = h(" running, ", -1)),
            d("strong", null, [
              h(p(E.value.kept), 1),
              E.value.kept_limit ? (n(), o(z, { key: 0 }, [
                h(" of " + p(E.value.kept_limit), 1)
              ], 64)) : k("", !0)
            ]),
            v[9] || (v[9] = h(" kept", -1))
          ]),
          d("p", null, p(K.value), 1),
          B.value.length ? k("", !0) : (n(), o(z, { key: 0 }, [
            v[10] || (v[10] = d("strong", null, "No agents here yet", -1)),
            v[11] || (v[11] = d("p", null, "An agent shows here as soon as one of this type starts.", -1))
          ], 64)),
          (n(!0), o(z, null, ee(B.value, (M) => {
            var J, Y, ne, de, ge;
            return n(), o("div", {
              key: M.id,
              class: "person",
              "data-count-agent": M.id
            }, [
              d("span", {
                class: le(["dot", { running: M.state === "running" }])
              }, null, 2),
              d("div", Bn, [
                d("strong", null, p(((J = M.facts) == null ? void 0 : J.given_name) || M.id), 1),
                h(" " + p(M.state === "running" ? "Running" : "Idle") + ", " + p(i(Je)(M.state === "running" ? M.process_started_at || M.created_at : M.ended_at, i(P))), 1),
                d("small", null, p([M.program, (Y = M.facts) == null ? void 0 : Y.model, (ne = M.facts) == null ? void 0 : ne.effort, `${M.role} ${M.id}`].filter(Boolean).join(", ")), 1),
                d("small", null, p(((de = M.facts) == null ? void 0 : de.task_title) || ((ge = M.facts) == null ? void 0 : ge.helper_job)), 1)
              ]),
              $(i(ae), {
                small: "",
                onClick: (se) => _(M)
              }, {
                default: x(() => [...v[12] || (v[12] = [
                  h("Open", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              M.state === "idle" && !i(t).readOnly ? (n(), F(i(ae), {
                key: 0,
                small: "",
                onClick: (se) => {
                  H.value = M.id, Z.value = "";
                }
              }, {
                default: x(() => [...v[13] || (v[13] = [
                  h("Retire", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : k("", !0),
              H.value === M.id ? (n(), F(Ke, {
                key: 1,
                reason: Z.value,
                "onUpdate:reason": v[1] || (v[1] = (se) => Z.value = se),
                pending: U.value,
                onSubmit: (se) => y(M),
                onCancel: v[2] || (v[2] = (se) => H.value = null)
              }, null, 8, ["reason", "pending", "onSubmit"])) : k("", !0)
            ], 8, Ln);
          }), 128)),
          O.value ? (n(), F(i(ae), {
            key: 1,
            small: "",
            onClick: v[3] || (v[3] = (M) => g(E.value, b.value + 1))
          }, {
            default: x(() => [...v[14] || (v[14] = [
              h("Show more", -1)
            ])]),
            _: 1
          })) : k("", !0)
        ], 64)) : (n(), o(z, { key: 4 }, [
          v[16] || (v[16] = d("p", null, "Kept agents have not been retired, so they can take another job. Open an item to see them.", -1)),
          v[17] || (v[17] = d("div", { class: "columns" }, [
            d("span", null, "Name"),
            d("span", null, "Running"),
            d("span", null, "Kept"),
            d("span")
          ], -1)),
          f.value ? (n(), o("div", In, [
            v[15] || (v[15] = d("strong", null, "Helpers", -1)),
            d("span", null, p(f.value.running) + " running, " + p(f.value.kept) + " kept", 1)
          ])) : k("", !0),
          (n(!0), o(z, null, ee(T.value, (M) => (n(), o("button", {
            key: M.key,
            type: "button",
            class: "count-row",
            "data-agent-limit-type": M.type || M.key,
            "data-agent-limit-profile": M.profile,
            onClick: (J) => L(M)
          }, [
            d("strong", null, p(M.label), 1),
            (n(!0), o(z, null, ee([{ count: M.running, limit: M.run_limit, unlimited: !1 }, { count: M.kept, limit: M.kept_limit, unlimited: !0 }], (J) => (n(), o("span", {
              key: J.unlimited,
              class: le({ full: i(Be)(J.count, J.limit) })
            }, [
              d("span", null, [
                h(p(J.count), 1),
                J.limit || !J.unlimited ? (n(), o(z, { key: 0 }, [
                  h(" of " + p(J.limit), 1)
                ], 64)) : k("", !0)
              ]),
              J.limit ? (n(), o("span", Vn, [
                d("span", {
                  style: pe({ width: te(J.count, J.limit) })
                }, null, 4),
                d("i", {
                  style: pe({ width: G(J.count, J.limit) })
                }, null, 4)
              ])) : k("", !0)
            ], 2))), 128)),
            $(i($e), {
              name: "chevronRight",
              size: 12
            })
          ], 8, zn))), 128))
        ], 64)),
        j.value ? (n(), o("p", En, p(j.value), 1)) : N.value ? (n(), o("p", Nn, p(N.value), 1)) : k("", !0)
      ]),
      d("div", Hn, [
        V.value ? (n(), o(z, { key: 0 }, [
          d("span", Wn, p(N.value || `Changes apply to ${i(t).environment}.`), 1),
          $(i(ae), { onClick: W }, {
            default: x(() => [...v[18] || (v[18] = [
              h("Done", -1)
            ])]),
            _: 1
          })
        ], 64)) : E.value ? k("", !0) : (n(), F(i(ae), {
          key: 1,
          disabled: i(t).readOnly,
          "data-agent-limits-edit": "",
          onClick: v[4] || (v[4] = (M) => V.value = !0)
        }, {
          default: x(() => [...v[19] || (v[19] = [
            h("Change the maximums", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]))
      ])
    ]));
  }
}, Fn = /* @__PURE__ */ X(qn, [["__scopeId", "data-v-de3d902c"]]), Dn = {
  key: 0,
  class: "badge",
  "data-agent-count-badge": ""
}, Pn = {
  __name: "AgentLimits",
  emits: ["open-agent"],
  setup(e, { emit: l }) {
    const a = l, s = ye(), t = I(!1), r = I("Agent counts"), c = m(() => Qe(s.props.limits.rows.value).filter((b) => Be(b.running, b.run_limit) || Be(b.kept, b.kept_limit)).length);
    function C(b) {
      t.value = !1, a("open-agent", b);
    }
    return (b, O) => (n(), o(z, null, [
      d("button", {
        class: "counts-button",
        type: "button",
        title: "Agent counts",
        "aria-label": "Agent counts",
        "data-agent-counts": "",
        onClick: O[0] || (O[0] = (P) => t.value = !0)
      }, [
        $(i($e), {
          name: "settings",
          size: 16
        }),
        c.value ? (n(), o("span", Dn, p(c.value), 1)) : k("", !0)
      ]),
      t.value ? (n(), F(i(Mt), {
        key: 0,
        title: r.value,
        modal: "",
        fits: "",
        onClose: O[3] || (O[3] = (P) => t.value = !1),
        onEscape: O[4] || (O[4] = (P) => t.value = !1)
      }, {
        default: x(() => [
          $(Fn, {
            title: r.value,
            "onUpdate:title": O[1] || (O[1] = (P) => r.value = P),
            onOpenAgent: C,
            onClose: O[2] || (O[2] = (P) => t.value = !1)
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
}, Kn = ["data-agent-row", "data-agent-lingering"], Fe = "journal.agents.filters", De = 300 * 1e3, Ae = "cubic-bezier(0.2, 0.9, 0.25, 1)", Gn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const l = e, a = ye(), { rows: s } = a.props.waits, { rows: t } = a.props.progress, { rows: r, failure: c, loaded: C, more: b } = a.props.agents, O = (A) => t.value.find((q) => q.agent_id === A.id) ?? null, P = (A) => {
      var q;
      return ((q = s.value.find((R) => R.agent_id === A.id)) == null ? void 0 : q.reason) ?? "";
    }, D = I("running"), V = I(""), U = JSON.parse(localStorage.getItem(Fe) || '{"roles":[],"profiles":[],"programs":[]}'), j = I(U), N = m(() => a.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: H } = a.props.programs, Z = m(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), T = (A, q) => {
      j.value = St(j.value, A, q);
    }, f = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, E = (A) => A.slice(0, 1).toUpperCase() + A.slice(1);
    ue(j, (A) => localStorage.setItem(Fe, JSON.stringify(A)));
    const B = I(25);
    function K() {
      Object.assign(a.state, {
        "agents.show": D.value,
        "agents.search": V.value,
        "agents.limit": String(B.value),
        "agents.roles": j.value.roles.join(","),
        "agents.profiles": j.value.profiles.join(","),
        "agents.programs": j.value.programs.join(",")
      });
    }
    async function te() {
      return B.value += 25, K(), await a.reload("agents"), !0;
    }
    ue([D, V, j], () => {
      B.value = 25, K(), a.reload("agents");
    }), K();
    const G = (A) => A.facts ?? null, g = r, L = Ie(), W = I([]), w = m(() => new Set(W.value.filter((A) => L.value - A.left < De).map((A) => A.row.id))), u = m(() => W.value.filter((A) => w.value.has(A.row.id)).map((A) => A.row)), y = m(() => [...g.value, ...u.value]);
    let _ = "", S = [];
    async function v(A) {
      await a.reload(`card.${A.id}`);
      const q = a.props[`card.${A.id}`].rows.value.find((R) => R.id === A.id);
      q != null && q.ended_at && !W.value.some((R) => R.row.id === A.id) && (W.value = [...W.value, { row: q, left: Date.now() }]);
    }
    ue(r, (A) => {
      const q = _ === `${D.value}|${V.value}|${JSON.stringify(j.value)}` && D.value === "running", R = q ? S.filter((Q) => !A.some((ce) => ce.id === Q.id)) : [];
      _ = `${D.value}|${V.value}|${JSON.stringify(j.value)}`, S = A, W.value = q ? W.value.filter((Q) => L.value - Q.left < De && !A.some((ce) => ce.id === Q.row.id)) : [], R.forEach(v);
    }, { immediate: !0 });
    const M = m(() => !!V.value.trim() || Z.value > 0), J = m(() => l.texts[D.value] ?? { title: l.empty, hint: "" }), Y = I(null), ne = I(null), de = I(null), ge = I(null), se = m(() => Y.value === null ? null : a.props[`card.${Y.value}`].rows.value.find((A) => A.id === Y.value) ?? ne.value), ze = m(() => se.value ? [se.value] : y.value), xe = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let fe = !1, Ve = 0;
    async function Xe(A) {
      if (fe) return;
      fe = !0, Ve = ge.value.scrollTop;
      const q = de.value.querySelector(`[data-agent-open="${A.id}"]`);
      if (!xe()) {
        const ve = [...de.value.querySelectorAll(".agent-row")].filter((ie) => !ie.contains(q));
        await Promise.all(ve.map((ie) => ie.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const R = [...q.querySelectorAll(".agent-head, .agent-line")], Q = [...R, ...q.querySelectorAll("[data-agent-motion]")], ce = Q.map((ve) => ve.getBoundingClientRect());
      if (ne.value = A, Y.value = A.id, a.reload(`card.${A.id}`), await We(), !xe()) {
        const ve = Q.map((ie) => ie.getBoundingClientRect());
        Q.forEach((ie, Ce) => {
          const me = R.indexOf(ie.parentElement), tt = ce[Ce].left - ve[Ce].left - (me < 0 ? 0 : ce[me].left - ve[me].left), at = ce[Ce].top - ve[Ce].top - (me < 0 ? 0 : ce[me].top - ve[me].top);
          ie.animate([{ transform: `translate(${tt}px, ${at}px)` }, { transform: "none" }], { duration: 280, easing: Ae });
        }), de.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((ie) => {
          ie.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Ae, fill: "backwards" });
        });
      }
      fe = !1;
    }
    async function Ee() {
      if (fe || !se.value) return;
      fe = !0;
      const A = de.value.querySelector(`[data-agent-open="${Y.value}"]`), q = [...A.children], R = xe() ? [] : q.map((Q) => Q.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(R.map((Q) => Q.finished)), Y.value = null, await We(), ge.value.scrollTop = Ve, R.forEach((Q) => Q.cancel()), xe() || (A.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Ae }), de.value.querySelectorAll(".agent-row").forEach((Q) => {
        Q.contains(A) || Q.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Ae });
      })), fe = !1;
    }
    function _e(A) {
      ne.value = A, Y.value = A.id, a.reload(`card.${A.id}`);
    }
    const et = (A) => Y.value === A.id ? Ee() : Xe(A);
    ue(V, (A) => A.trim() && (Y.value = null)), ue(D, () => {
      Y.value = null;
    });
    const Ne = (A) => {
      A.key === "Escape" && Ee();
    };
    return window.addEventListener("keydown", Ne), we(() => window.removeEventListener("keydown", Ne)), (A, q) => (n(), o("div", {
      ref_key: "agents",
      ref: de,
      class: le(["agents", { focused: se.value }])
    }, [
      $(i($t), {
        modelValue: V.value,
        "onUpdate:modelValue": q[1] || (q[1] = (R) => V.value = R),
        placeholder: "Search agents",
        "menu-count": Z.value,
        "data-agents-search": ""
      }, {
        menu: x(() => [
          $(i(Oe), null, {
            default: x(() => [...q[2] || (q[2] = [
              h("Type", -1)
            ])]),
            _: 1
          }),
          (n(!0), o(z, null, ee(N.value.roles, (R) => (n(), F(i(Se), {
            key: R,
            role: "menuitemcheckbox",
            "aria-checked": j.value.roles.includes(R),
            checked: j.value.roles.includes(R),
            "data-filter-role": R,
            onClick: (Q) => T("roles", R)
          }, {
            default: x(() => [
              h(p(E(R)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          N.value.profiles.length ? (n(), F(i(Oe), { key: 0 }, {
            default: x(() => [...q[3] || (q[3] = [
              h("Profile", -1)
            ])]),
            _: 1
          })) : k("", !0),
          (n(!0), o(z, null, ee(N.value.profiles, (R) => (n(), F(i(Se), {
            key: R.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.profiles.includes(R.name),
            checked: j.value.profiles.includes(R.name),
            "data-filter-profile": R.name,
            onClick: (Q) => T("profiles", R.name)
          }, {
            default: x(() => [
              h(p(R.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          $(i(Oe), null, {
            default: x(() => [...q[4] || (q[4] = [
              h("Program", -1)
            ])]),
            _: 1
          }),
          (n(!0), o(z, null, ee(i(H), (R) => (n(), F(i(Se), {
            key: R.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.programs.includes(R.name),
            checked: j.value.programs.includes(R.name),
            "data-filter-program": R.name,
            onClick: (Q) => T("programs", R.name)
          }, {
            default: x(() => [
              h(p(R.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          Z.value ? (n(), F(i(Se), {
            key: 1,
            "data-filter-clear": "",
            onClick: f
          }, {
            default: x(() => [...q[5] || (q[5] = [
              h("Clear filters", -1)
            ])]),
            _: 1
          })) : k("", !0)
        ]),
        default: x(() => [
          $(i(xt), {
            options: N.value.states,
            value: D.value,
            onPick: q[0] || (q[0] = (R) => D.value = R)
          }, null, 8, ["options", "value"]),
          $(Un, { onOpenAgent: _e })
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      D.value === "retired" && N.value.upgrade_retired ? (n(), o("p", Jn, "Retired during the upgrade: " + p(N.value.upgrade_retired), 1)) : k("", !0),
      d("div", {
        ref_key: "list",
        ref: ge,
        class: le(["agents-view", { "agents-view-open": se.value }])
      }, [
        i(C) && !i(c) && !ze.value.length && Z.value ? (n(), F(i(Le), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: x(() => [
            $(i(ae), {
              small: "",
              "data-empty-clear": "",
              onClick: f
            }, {
              default: x(() => [...q[6] || (q[6] = [
                h("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (n(), F(i(Ct), {
          key: 1,
          rows: ze.value,
          failure: i(c),
          loaded: i(C),
          more: !se.value && i(b),
          older: te,
          empty: J.value.title,
          hint: J.value.hint,
          searching: M.value
        }, {
          default: x(({ row: R }) => [
            d("div", {
              class: le(["agent-row", { lingering: w.value.has(R.id) }]),
              "data-agent-row": R.id,
              "data-agent-lingering": w.value.has(R.id) ? "" : null
            }, [
              $(yn, {
                row: R,
                facts: G(R),
                progress: O(R),
                "wait-reason": P(R),
                open: R.id === Y.value,
                onToggle: (Q) => et(R)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, Kn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, Xn = /* @__PURE__ */ X(Gn, [["__scopeId", "data-v-c2eadee2"]]);
export {
  Xn as A
};
