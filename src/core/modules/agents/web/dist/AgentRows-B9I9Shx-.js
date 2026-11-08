/* @code-commandments-generated */
import { openBlock as n, createElementBlock as s, withModifiers as ne, unref as r, createTextVNode as f, toDisplayString as p, createVNode as m, createBlock as D, withCtx as y, Fragment as P, renderList as te, createElementVNode as A, createCommentVNode as k, computed as i, ref as E, watch as ie, onUnmounted as ye, defineAsyncComponent as et, createSlots as tt, resolveDynamicComponent as at, normalizeClass as ee, normalizeStyle as be, renderSlot as we, onMounted as nt, Teleport as ot, mergeProps as lt, toRef as je, withKeys as He, nextTick as Ne } from "vue";
import { peekRef as Ae, Icon as Re, RunningCommand as st, FoldGroup as Pe, TaskStatusIcon as rt, useWindow as Te, loadWindowComponent as it, coalesced as dt, READ_RATES as ut, eventMayBeChildOf as ct, InnerTabs as gt, TabBody as vt, SwitchCase as Ue, EmptyState as Le, Btn as de, TextArea as pt, TextInput as ht, HoverTip as Ce, useNow as Je, age as ft, perHour as mt, ago as We, TimeAgo as qe, SearchBar as kt, Segmented as yt, MenuLabel as Be, MenuItem as $e, RowList as bt, toggleFilter as wt } from "@journal/window-kit";
import { _ as X, T as Mt } from "./TranscriptRows-BL93hPr8.js";
const xt = {
  class: "agent-command",
  "data-agent-command": ""
}, $t = {
  key: 1,
  "data-agent-stopped": ""
}, St = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (o, a) => (n(), s("span", xt, [
      e.waitReason ? (n(), s("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: a[0] || (a[0] = ne((l) => r(Ae)("test_queue:0"), ["stop"]))
      }, [
        f("Waiting: " + p(e.waitReason) + " ", 1),
        m(r(Re), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (n(), s("span", $t, "Waiting")) : (n(), D(r(st), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, Ct = /* @__PURE__ */ X(St, [["__scopeId", "data-v-1b371fb5"]]), At = ["data-agent-delegated", "onClick"], Tt = { class: "agent-task-number" }, jt = { class: "agent-task-title" }, Bt = ["title"], Rt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const a = o;
    return (l, t) => (n(), D(r(Pe), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: t[0] || (t[0] = (d) => a("toggle"))
    }, {
      default: y(() => [
        (n(!0), s(P, null, te(e.section.tasks, (d) => (n(), s("button", {
          key: d.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": d.id,
          onClick: (c) => r(Ae)(`tasks:${d.id}`)
        }, [
          m(r(rt), {
            status: d.state
          }, null, 8, ["status"]),
          A("span", Tt, p(d.id), 1),
          A("span", jt, p(d.title), 1),
          d.plan_id ? (n(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${d.plan_id}: ${d.plan_title}`
          }, "Plan " + p(d.plan_id) + ": " + p(d.plan_title), 9, Bt)) : k("", !0)
        ], 8, At))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Lt = /* @__PURE__ */ X(Rt, [["__scopeId", "data-v-238ff959"]]), It = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Vt = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Ot = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, zt = ["data-peek", "onClick"], Et = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ht = {
  key: 0,
  class: "agent-helper-brief"
}, Nt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Wt = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, qt = "It ended without a report", Dt = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const o = e, a = ["started", "blocked", "open", "completed"], l = i(() => {
      var v, b;
      return o.row.ended_at && ((b = (v = o.facts) == null ? void 0 : v.job_returned) != null && b.startsWith(qt)) ? o.facts.job_returned : "";
    }), t = i(() => o.tasks.length ? a.map((v) => ({ state: v, label: v.slice(0, 1).toUpperCase() + v.slice(1), tasks: o.tasks.filter((b) => b.state === v || v === "started" && b.state === "testing" || v === "completed" && b.state === "cancelled") })) : []), d = /* @__PURE__ */ new Set(["completed"]), c = E({}), $ = (v) => !(c.value[v] ?? d.has(v)), w = (v) => c.value = { ...c.value, [v]: $(v) }, L = Te(), { rows: q } = L.props.reports;
    L.state["reports.agent"] = String(o.row.id);
    const H = i(() => o.row.access === "read-only"), N = i(() => !!o.row.retired_at || o.row.state === "retired"), U = ["tasks", "transcript", "terminal", "file-feed", "reports"], T = i(() => (N.value ? L.tabs.filter((b) => ["reports", "transcript"].includes(b.key)) : H.value ? L.tabs.filter((b) => ["reports", "transcript", "terminal"].includes(b.key)) : [...L.tabs]).sort((b, g) => (U.indexOf(b.key) < 0 ? U.length : U.indexOf(b.key)) - (U.indexOf(g.key) < 0 ? U.length : U.indexOf(g.key)))), V = () => H.value || N.value ? T.value.find((v) => v.key === "transcript") : T.value[0], W = E(V());
    ie(W, (v) => {
      L.state.tab = (v == null ? void 0 : v.key) ?? "";
    }, { immediate: !0 }), ye(() => {
      L.state.tab = "";
    }), ie(T, (v) => {
      v.some((b) => {
        var g;
        return b.key === ((g = W.value) == null ? void 0 : g.key);
      }) || (W.value = v[0]);
    }), ie(() => o.open, (v) => {
      v && (W.value = V());
    });
    const Z = Object.fromEntries(L.tabs.filter((v) => v.component).map((v) => [v.key, et(() => it(v.component))])), J = E(!1), { data: Y } = L.props.tool, S = i(() => {
      var v;
      return ((v = Y.value) == null ? void 0 : v.tool) ?? "";
    }), u = i(() => {
      var v;
      return ((v = Y.value) == null ? void 0 : v.note) ?? "";
    }), F = i(() => o.row.role !== "main" && (!o.row.ended_at || o.stoppedWithWork || o.waitReason));
    async function B() {
      !o.open || !F.value || (L.state["tool.agent"] = String(o.row.id), await L.reload("tool"));
    }
    const j = dt(B, ut.agentCommand), O = L.follow(["hook_call.*", "process_part.*"], (v) => ct(v, "session_agent_id", /* @__PURE__ */ new Set([o.row.id])) && j());
    return ye(() => O == null ? void 0 : O()), ie(() => o.open, (v) => {
      v && B();
    }, { immediate: !0 }), (v, b) => {
      var g;
      return n(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: b[2] || (b[2] = ne(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (n(), s("p", It, "Retirement reason: " + p(e.row.retirement_reason), 1)) : k("", !0),
        e.row.resume_reason ? (n(), s("p", Vt, p(e.row.resume_reason), 1)) : k("", !0),
        F.value ? (n(), D(Ct, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: S.value,
          note: u.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : k("", !0),
        l.value ? (n(), s("p", Ot, p(l.value), 1)) : k("", !0),
        m(r(gt), {
          class: "agent-tabs",
          tabs: T.value,
          active: W.value,
          answer: { tasks: e.tasks.length, reports: r(q).length },
          onChoose: b[0] || (b[0] = (R) => W.value = R)
        }, null, 8, ["tabs", "active", "answer"]),
        m(r(vt), {
          class: "agent-tab-body",
          tab: W.value,
          "data-agent-tab-body": (g = W.value) == null ? void 0 : g.key
        }, {
          default: y(() => {
            var R;
            return [
              m(r(Ue), {
                value: (R = W.value) == null ? void 0 : R.key
              }, tt({
                reports: y(() => [
                  r(q).length ? k("", !0) : (n(), D(r(Le), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: y(() => [...b[3] || (b[3] = [
                      f("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (n(!0), s(P, null, te(r(q), (z) => (n(), s("button", {
                    key: z.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${z.id}`,
                    onClick: (Q) => r(Ae)(`messages:${z.id}`)
                  }, p(z.text), 9, zt))), 128))
                ]),
                tasks: y(() => {
                  var z;
                  return [
                    e.tasks.length ? k("", !0) : (n(), D(r(Le), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: y(() => [...b[4] || (b[4] = [
                        f("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (n(!0), s(P, null, te(t.value, (Q) => (n(), D(Lt, {
                      key: Q.state,
                      section: Q,
                      open: $(Q.state),
                      onToggle: (h) => w(Q.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (z = e.facts) != null && z.instruction ? (n(), s(P, { key: 1 }, [
                      b[5] || (b[5] = A("p", { class: "agent-label" }, "Instruction", -1)),
                      A("div", Et, p(e.facts.instruction), 1)
                    ], 64)) : k("", !0)
                  ];
                }),
                transcript: y(() => {
                  var z;
                  return [
                    H.value ? (n(), s(P, { key: 0 }, [
                      (z = e.facts) != null && z.instruction ? (n(), s("div", Ht, [
                        m(r(Pe), {
                          label: "Instruction",
                          open: J.value,
                          "data-agent-section": "instruction",
                          onToggle: b[1] || (b[1] = (Q) => J.value = !J.value)
                        }, {
                          default: y(() => [
                            A("div", Nt, p(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (n(), s("p", Wt, "No job recorded")) : k("", !0)
                    ], 64)) : k("", !0),
                    m(Mt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                te(r(Z), (z, Q) => ({
                  name: Q,
                  fn: y(() => [
                    (n(), D(at(z), {
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
}, Ft = /* @__PURE__ */ X(Dt, [["__scopeId", "data-v-492142fe"]]), Pt = { class: "action-field" }, Ut = ["value", "disabled"], Jt = ["value"], Gt = { key: 1 }, Kt = {
  key: 1,
  class: "action-field"
}, Zt = { class: "action-buttons" }, Yt = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (o, a) => (n(), s("form", {
      onSubmit: a[4] || (a[4] = ne((l) => o.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (n(), s(P, { key: 0 }, [
        A("label", Pt, [
          a[6] || (a[6] = f("Task ", -1)),
          A("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: a[0] || (a[0] = (l) => o.$emit("update:task", l.target.value))
          }, [
            a[5] || (a[5] = A("option", { value: "" }, "Choose an open task", -1)),
            (n(!0), s(P, null, te(e.tasks, (l) => (n(), s("option", {
              key: l.id,
              value: String(l.id)
            }, p(l.id) + ": " + p(l.title), 9, Jt))), 128))
          ], 40, Ut)
        ]),
        e.moreTasks ? (n(), D(r(de), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: a[1] || (a[1] = (l) => o.$emit("more"))
        }, {
          default: y(() => [...a[7] || (a[7] = [
            f("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : k("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (n(), s("p", Gt, "No open tasks.")) : k("", !0)
      ], 64)) : (n(), s("label", Kt, [
        a[8] || (a[8] = f("Job", -1)),
        m(r(pt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: a[2] || (a[2] = (l) => o.$emit("update:text", l.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      A("div", Zt, [
        m(r(de), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: y(() => [...a[9] || (a[9] = [
            f("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        m(r(de), {
          small: "",
          disabled: e.pending,
          onClick: a[3] || (a[3] = (l) => o.$emit("cancel"))
        }, {
          default: y(() => [...a[10] || (a[10] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Qt = /* @__PURE__ */ X(Yt, [["__scopeId", "data-v-adde4158"]]), Xt = { class: "action-buttons" }, _t = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (o, a) => (n(), s("form", {
      "data-agent-retire-confirm": "",
      onSubmit: a[2] || (a[2] = ne((l) => o.$emit("submit"), ["prevent"]))
    }, [
      a[5] || (a[5] = A("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      m(r(ht), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": a[0] || (a[0] = (l) => o.$emit("update:reason", l))
      }, null, 8, ["model-value", "disabled"]),
      A("div", Xt, [
        m(r(de), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: y(() => [...a[3] || (a[3] = [
            f("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        m(r(de), {
          small: "",
          disabled: e.pending,
          onClick: a[1] || (a[1] = (l) => o.$emit("cancel"))
        }, {
          default: y(() => [...a[4] || (a[4] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ea = /* @__PURE__ */ X(_t, [["__scopeId", "data-v-23a905c0"]]), ta = { class: "action-buttons" }, aa = {
  key: 0,
  role: "alert"
}, na = {
  key: 1,
  role: "status"
}, oa = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const o = e, a = Te(), l = E(""), t = E(""), d = E(""), c = E(""), $ = E([]), w = E(0), L = E(!1), q = E(!1), H = E(!1), N = E(""), U = E(""), T = i(() => !!o.row.retired_at || o.row.state === "retired"), V = i(() => !T.value && !!o.row.ended_at), W = i(() => {
      var j;
      return V.value && ((j = o.row.job_command) == null ? void 0 : j.length) && !o.row.resume_reason;
    }), Z = i(() => W.value && !q.value && (o.row.job_task_flag ? $.value.some((j) => String(j.id) === c.value) : !!t.value.trim()));
    function J(j) {
      l.value = j, t.value = "", d.value = "", c.value = "", N.value = "", U.value = "";
    }
    async function Y() {
      J("job"), o.row.job_task_flag && ($.value = [], w.value = 0, L.value = !1, await S());
    }
    async function S() {
      if (!q.value) {
        q.value = !0;
        try {
          a.state["jobs.page"] = String(w.value + 1), await a.reload("jobs");
          const j = a.props.jobs;
          N.value = j.failure.value, N.value || ($.value = [...$.value, ...j.rows.value], w.value = j.data.value.page, L.value = j.more.value);
        } finally {
          q.value = !1;
        }
      }
    }
    async function u(j, O) {
      if (!H.value) {
        H.value = !0, N.value = "";
        try {
          const v = await a.run(j);
          N.value = v.ok ? "" : v.error, v.ok && (J(""), U.value = O);
        } finally {
          H.value = !1;
        }
      }
    }
    async function F() {
      if (!Z.value) return;
      const j = o.row.job_task_flag ? [o.row.job_task_flag, c.value] : [t.value.trim()];
      await u([...o.row.job_command, String(o.row.id), ...j], "Job sent.");
    }
    async function B() {
      !V.value || l.value !== "retire" || !d.value.trim() || await u(["agent", "retire", String(o.row.id), "--reason", d.value.trim()], "Agent retired permanently.");
    }
    return (j, O) => {
      var v;
      return T.value ? k("", !0) : (n(), s("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: O[6] || (O[6] = ne(() => {
        }, ["stop"])),
        onKeydown: O[7] || (O[7] = ne(() => {
        }, ["stop"]))
      }, [
        A("div", ta, [
          V.value ? (n(), s(P, { key: 0 }, [
            (v = e.row.job_command) != null && v.length ? (n(), D(r(de), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: H.value || q.value || !W.value,
              onClick: Y
            }, {
              default: y(() => [...O[8] || (O[8] = [
                f("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0),
            e.row.role !== "main" ? (n(), D(r(de), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: H.value || q.value,
              onClick: O[0] || (O[0] = (b) => J("retire"))
            }, {
              default: y(() => [...O[9] || (O[9] = [
                f("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0)
          ], 64)) : k("", !0)
        ]),
        m(r(Ue), { value: l.value }, {
          job: y(() => [
            m(Qt, {
              task: c.value,
              "onUpdate:task": O[1] || (O[1] = (b) => c.value = b),
              text: t.value,
              "onUpdate:text": O[2] || (O[2] = (b) => t.value = b),
              row: e.row,
              tasks: $.value,
              pending: H.value,
              loading: q.value,
              "more-tasks": L.value,
              failure: N.value,
              "job-ready": Z.value,
              onSubmit: F,
              onMore: S,
              onCancel: O[3] || (O[3] = (b) => J(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: y(() => [
            m(ea, {
              reason: d.value,
              "onUpdate:reason": O[4] || (O[4] = (b) => d.value = b),
              pending: H.value,
              onSubmit: B,
              onCancel: O[5] || (O[5] = (b) => J(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        N.value ? (n(), s("p", aa, p(N.value), 1)) : k("", !0),
        U.value ? (n(), s("p", na, p(U.value), 1)) : k("", !0)
      ], 32));
    };
  }
}, la = /* @__PURE__ */ X(oa, [["__scopeId", "data-v-4cb32275"]]), sa = { class: "line" }, ra = {
  key: 0,
  class: "line",
  "data-agent-since": ""
}, ia = {
  key: 1,
  class: "line",
  "data-agent-seen": ""
}, da = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" }, seen: { type: String, default: "" } },
  setup(e) {
    const o = /* @__PURE__ */ new Set(["running", "working", "thinking"]), a = e, l = i(() => o.has(a.state)), t = i(() => [a.doing, a.since, a.seen].filter(Boolean).join(". "));
    return (d, c) => (n(), D(r(Ce), {
      as: "button",
      place: "corner",
      class: ee(["agent-dot", { pulse: l.value }]),
      "data-state": e.state,
      "aria-label": t.value,
      "data-agent-status": "",
      onClick: c[0] || (c[0] = ne(() => {
      }, ["stop"]))
    }, {
      tip: y(() => [
        A("b", sa, p(e.doing), 1),
        e.since ? (n(), s("span", ra, p(e.since), 1)) : k("", !0),
        e.seen ? (n(), s("span", ia, p(e.seen), 1)) : k("", !0)
      ]),
      default: y(() => [
        c[1] || (c[1] = A("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, ua = /* @__PURE__ */ X(da, [["__scopeId", "data-v-1a0bc478"]]), Ge = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, ca = 30, Ke = (e) => e.filter((o) => o.state !== "cancelled");
function ga(e, o) {
  const a = Ke(e), l = a.filter((c) => c.state === "completed").length, t = Ge[o == null ? void 0 : o.state] && a.some((c) => c.id === o.id && c.state !== "completed") ? 1 : 0;
  return a.length > ca ? { continuous: !0, done: l / a.length * 100, now: t / a.length * 100, segments: [] } : { continuous: !1, done: 0, now: 0, segments: [...Array(l).fill("done"), ...Array(t).fill("now"), ...Array(a.length - l - t).fill("todo")].map((c) => ({ kind: c })) };
}
function va({ tasks: e, inHand: o, perHour: a }) {
  const l = Ke(e), t = l.filter((w) => w.state === "completed").length, d = Ge[o == null ? void 0 : o.state], c = l.length - t - (o && o.state !== "completed" ? 1 : 0), $ = t === l.length;
  return {
    number: o.id,
    title: o.title,
    count: `${t} of ${l.length}`,
    taskTip: `${t} of its ${l.length} tasks done${d ? `. This one is ${d.words}.` : "."}`,
    countTip: $ ? `All ${l.length} tasks done` : `${t} done, 1 in hand, ${c} to go`,
    paceTip: !$ && a ? `About ${a} an hour.` : "",
    bar: ga(e, o)
  };
}
const pa = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, ha = {
  class: "task-line",
  "data-agent-task-line": ""
}, fa = { key: 0 }, ma = ["data-state"], ka = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, state: { type: String, required: !0 }, perHour: { type: Number, default: 0 } },
  setup(e) {
    const o = e, a = i(() => o.inHand ? va({ tasks: o.tasks, inHand: o.inHand, perHour: o.perHour }) : null);
    return (l, t) => e.job && !a.value ? (n(), s("span", pa, [
      m(r(Ce), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: y(() => [
          A("b", null, p(e.job), 1)
        ]),
        default: y(() => [
          t[1] || (t[1] = f("Job", -1))
        ]),
        _: 1
      })
    ])) : a.value ? (n(), s(P, { key: 1 }, [
      A("span", ha, [
        m(r(Ce), {
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${a.value.number}`,
          "aria-label": `Task ${a.value.number}: ${a.value.title}`,
          onClick: t[0] || (t[0] = ne((d) => r(Ae)(`tasks:${a.value.number}`), ["stop"]))
        }, {
          tip: y(() => [
            A("b", null, p(a.value.title), 1),
            A("span", null, p(a.value.taskTip), 1)
          ]),
          default: y(() => [
            f("Task " + p(a.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"]),
        m(r(Ce), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: y(() => [
            A("b", null, p(a.value.countTip), 1),
            a.value.paceTip ? (n(), s("span", fa, p(a.value.paceTip), 1)) : k("", !0)
          ]),
          default: y(() => [
            f(p(a.value.count), 1)
          ]),
          _: 1
        })
      ]),
      A("span", {
        class: ee(["bar", { continuous: a.value.bar.continuous }]),
        "data-state": e.state,
        style: be(a.value.bar.continuous ? { "--done": `${a.value.bar.done}%`, "--now": `${a.value.bar.now}%` } : void 0),
        "data-agent-bar": "",
        "aria-hidden": "true"
      }, [
        (n(!0), s(P, null, te(a.value.bar.segments, (d, c) => (n(), s("i", {
          key: c,
          class: ee(d.kind)
        }, null, 2))), 128))
      ], 14, ma)
    ], 64)) : k("", !0);
  }
}, ya = /* @__PURE__ */ X(ka, [["__scopeId", "data-v-2762da36"]]), ba = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', wa = ["data-icon", "stroke-width", "innerHTML"], _ = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const o = e, a = { right: 0, down: 90, left: 180, up: 270 }, l = {
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
      agent: ba,
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
    return (d, c) => (n(), s("svg", {
      class: "ico",
      "data-icon": e.name,
      style: be({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...o.facing === "right" ? {} : { transform: `rotate(${a[o.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: t[l[e.name] || e.name] || t.dot
    }, null, 12, wa));
  }
}, Ma = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, xa = {
  key: 1,
  class: "menu-item-text"
}, $a = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (o, a) => (n(), s("button", {
      type: "button",
      class: ee(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (n(), s("span", Ma, p(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (n(), s("span", xa, [
        A("span", null, [
          we(o.$slots, "default", {}, void 0, !0)
        ]),
        A("small", null, p(e.description), 1)
      ])) : we(o.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, me = /* @__PURE__ */ X($a, [["__scopeId", "data-v-fec99974"]]), Sa = {}, Ca = { class: "menu-label" };
function Aa(e, o) {
  return n(), s("span", Ca, [
    we(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ke = /* @__PURE__ */ X(Sa, [["render", Aa], ["__scopeId", "data-v-aa955b3e"]]), Ta = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, ja = {
  key: 0,
  class: "skills-none"
}, Ba = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: o }) {
    const a = e, l = o, t = i(() => a.skills.filter((c) => c.state === "loaded")), d = i(() => a.skills.filter((c) => c.state !== "loaded"));
    return (c, $) => (n(), s("div", Ta, [
      m(ke, null, {
        default: y(() => [...$[1] || ($[1] = [
          f("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      t.value.length ? k("", !0) : (n(), s("p", ja, "None yet. Compacting the conversation empties this list.")),
      (n(!0), s(P, null, te(t.value, (w) => (n(), s("p", {
        key: w.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        m(_, {
          name: "book",
          size: 12
        }),
        f(p(w.skill), 1)
      ]))), 128)),
      d.value.length ? (n(), s(P, { key: 1 }, [
        m(ke, null, {
          default: y(() => [...$[2] || ($[2] = [
            f("Still to read", -1)
          ])]),
          _: 1
        }),
        (n(!0), s(P, null, te(d.value, (w) => (n(), s("p", {
          key: w.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          m(_, {
            name: "book",
            size: 12
          }),
          f(p(w.skill), 1)
        ]))), 128))
      ], 64)) : k("", !0),
      m(me, {
        "data-agent-skills-browse": "",
        onClick: $[0] || ($[0] = (w) => l("browse"))
      }, {
        default: y(() => [...$[3] || ($[3] = [
          f("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Ra = /* @__PURE__ */ X(Ba, [["__scopeId", "data-v-be514d47"]]), La = ["disabled", "title"], Ia = { class: "gauge usage" }, Va = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: o }) {
    const a = e, l = o, t = i(() => a.windows[0] ?? null), d = i(() => t.value && Number.isFinite(t.value.used_percent) ? Math.max(0, Math.min(100, Math.round(t.value.used_percent))) : null), c = i(() => d.value !== null && d.value >= 100), $ = i(() => {
      var L;
      return (L = t.value) != null && L.reset_epoch_seconds ? new Date(t.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), w = i(() => c.value ? `At usage limit: the plan's ${t.value.title} allowance is used up${$.value ? `, starts again ${$.value}` : ""}` : `${d.value}% of the plan's ${t.value.title} allowance used${$.value ? `, starts again ${$.value}` : ""}`);
    return (L, q) => d.value !== null ? (n(), s("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: w.value,
      onClick: q[0] || (q[0] = (H) => l("open", H.currentTarget))
    }, [
      m(_, {
        name: "allowance",
        size: 12
      }),
      q[1] || (q[1] = f()),
      A("span", Ia, [
        A("span", {
          style: be({ width: `${d.value}%` })
        }, null, 4)
      ]),
      f(" " + p(c.value ? "At usage limit" : `${d.value}%`), 1)
    ], 8, La)) : k("", !0);
  }
}, Oa = /* @__PURE__ */ X(Va, [["__scopeId", "data-v-a36f09dc"]]), za = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (o, a) => (n(), s("span", {
      class: ee(["badge", e.tone])
    }, p(e.text), 3));
  }
}, Ea = /* @__PURE__ */ X(za, [["__scopeId", "data-v-9e7e1157"]]), Ha = (e, o, a) => Math.max(o, Math.min(a, e)), Ze = /* @__PURE__ */ new WeakMap(), Na = (e, o) => Ze.set(e, o);
function Wa(e, o) {
  for (let a = o; a; a = Ze.get(a) ?? a.parentElement) if (a === e) return !0;
  return !1;
}
function qa(e, o) {
  const a = (l) => {
    var d, c;
    const t = ((d = e.value) == null ? void 0 : d.element) || ((c = e.value) == null ? void 0 : c.$el) || e.value;
    t && !Wa(t, l.target) && o(l);
  };
  window.addEventListener("click", a), ye(() => window.removeEventListener("click", a));
}
const fe = 8, Da = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: o, emit: a }) {
    const l = e, t = E(null), d = (g) => g ? `${g}px` : void 0, c = i(() => ({
      minWidth: d(l.minWidth),
      maxWidth: d(l.maxWidth),
      maxHeight: d(l.maxHeight),
      height: d(l.height)
    })), $ = E({ w: 0, h: 0 }), w = E(l.anchor ? l.anchor.getBoundingClientRect() : null), L = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), q = (g) => ({
      left: Math.max(0, g.left),
      top: Math.max(0, g.top),
      right: Math.min(window.innerWidth, g.right),
      bottom: Math.min(window.innerHeight, g.bottom)
    }), H = (g) => {
      const R = g.closest(".pane, .float-window");
      return R ? q(R.getBoundingClientRect()) : L();
    }, N = (g, R) => `${Math.max(0, g ? Math.min(g, R) : R)}px`;
    function U(g, R) {
      return {
        below: g.bottom - R.bottom - l.gap - fe,
        above: R.top - g.top - l.gap - fe,
        across: g.right - g.left - 2 * fe
      };
    }
    function T(g) {
      const R = H(l.anchor), z = U(R, g);
      return $.value.w <= z.across && $.value.h <= Math.max(z.below, z.above) ? R : L();
    }
    const V = i(() => {
      if (!w.value) return c.value;
      const g = w.value, R = T(g), z = U(R, g), { w: Q, h } = $.value, C = l.align === "auto" ? g.left + g.right > R.left + R.right : l.align === "right", ae = Ha(C ? g.right - Q : g.left, R.left + fe, Math.max(R.left + fe, R.right - Q - fe)), K = h > z.below && z.above > z.below ? { bottom: `${window.innerHeight - g.top + l.gap}px`, maxHeight: N(l.maxHeight, z.above) } : { top: `${g.bottom + l.gap}px`, maxHeight: N(l.maxHeight, z.below) };
      return { ...c.value, ...K, left: `${ae}px`, maxWidth: N(l.maxWidth, z.across) };
    }), W = a, Z = () => [...t.value.querySelectorAll("button:not(:disabled)")];
    function J(g) {
      const R = Z(), z = R.indexOf(document.activeElement);
      R[(z + g + R.length) % R.length].focus();
    }
    const Y = { ArrowDown: () => J(1), ArrowUp: () => J(-1), Escape: () => W("close") }, S = (g) => Y[g.key] && (g.preventDefault(), Y[g.key]()), u = () => t.value && ($.value = { w: t.value.offsetWidth, h: t.value.scrollHeight });
    let F = 0;
    const B = new ResizeObserver(() => {
      cancelAnimationFrame(F), F = requestAnimationFrame(u);
    });
    qa(t, (g) => l.anchor && !l.anchor.contains(g.target) && W("close"));
    const j = (g, R) => ["top", "left", "right", "bottom"].some((z) => Math.abs(g[z] - R[z]) > 1), O = (g) => g.bottom < 0 || g.top > window.innerHeight;
    let v = 0;
    function b() {
      if (l.anchor) {
        const g = l.anchor.getBoundingClientRect();
        if (!l.anchor.isConnected || O(g)) return W("close");
        j(g, w.value) && (w.value = g);
      }
      v = requestAnimationFrame(b);
    }
    return nt(() => {
      l.anchor && t.value && Na(t.value, l.anchor), u(), t.value && B.observe(t.value), !l.plain && Z()[0] && Z()[0].focus(), b();
    }), ye(() => {
      B.disconnect(), cancelAnimationFrame(v), cancelAnimationFrame(F);
    }), o({ element: t }), (g, R) => (n(), D(ot, {
      to: "body",
      disabled: !e.anchor
    }, [
      A("div", lt({
        ref_key: "panel",
        ref: t
      }, g.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: V.value,
        onKeydown: S
      }), [
        we(g.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Fa = /* @__PURE__ */ X(Da, [["__scopeId", "data-v-3d203970"]]);
async function Pa(e, o, a) {
  if (!e) return a(o);
  const { target: l, fields: t } = e, d = Object.fromEntries(Object.keys(t).map((w) => [w, l[w]])), c = () => Object.assign(l, d);
  Object.assign(l, t);
  let $ = !1;
  try {
    const w = await a(o);
    return $ = w.ok, w;
  } finally {
    $ || c();
  }
}
function Ua(e, o, a, { groups: l, programs: t }) {
  const d = E({}), c = E(""), $ = E(!1), w = i(() => !!e.value && !e.value.ended_at), L = i(() => w.value && !!e.value.paused_at);
  async function q(T, V = null) {
    c.value = "";
    const W = await Pa(V, T, o);
    return c.value = W.ok ? "" : W.error, a(), W;
  }
  return { groups: l, programs: t, chosen: d, failure: c, asking: $, running: w, paused: L, choose: (T, V) => q(["agent", "control", String(e.value.id), T, V.value], { target: d, fields: { value: { ...d.value, [T]: V.label } } }), stop: () => ($.value = !1, q(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (T) => q(["agent", "launch", T.name]) };
}
function Ja(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const Ga = ["disabled", "title"], Ka = ["disabled", "title"], Za = { class: "gauge" }, Ya = ["disabled", "title"], Qa = ["disabled"], Xa = ["disabled"], _a = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, en = ["title"], tn = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, an = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, nn = { class: "gauge" }, on = { class: "context-used" }, ln = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, sn = 75, rn = {
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
  setup(e, { emit: o }) {
    const a = e, l = o, t = Ua(je(a, "agent"), a.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => l("changed"), { groups: je(a, "controlGroups"), programs: je(a, "agentPrograms") }), d = E(null), c = E(""), $ = i(() => t.groups.value.find((S) => S.key === c.value));
    function w(S, u) {
      d.value = S.currentTarget, c.value = u;
    }
    function L() {
      d.value = null, c.value = "", t.asking.value = !1;
    }
    const q = i(() => a.skills.filter((S) => S.state === "loaded"));
    function H(S) {
      w(S, "skills"), l("skills");
    }
    const N = (S) => t.groups.value.some((u) => u.key === S), U = i(() => {
      var S;
      return t.chosen.value.model ?? ((S = V.value) == null ? void 0 : S.model) ?? "";
    }), T = i(() => {
      var S;
      return t.chosen.value.effort ?? ((S = V.value) == null ? void 0 : S.effort) ?? "";
    });
    i(() => !!a.agent && !a.agent.ended_at);
    const V = i(() => {
      var S;
      return ((S = a.usage.agents) == null ? void 0 : S.find((u) => {
        var F;
        return u.id === ((F = a.agent) == null ? void 0 : F.id);
      })) ?? null;
    }), W = i(() => {
      var S;
      return ((S = V.value) == null ? void 0 : S.context_percent) == null ? null : Math.round(V.value.context_percent);
    }), Z = (S) => `${Math.round(S / 1e3)}k`, J = i(() => {
      var S;
      return (S = V.value) != null && S.context_limit_tokens ? `${Z(V.value.context_tokens ?? 0)} of ${Z(V.value.context_limit_tokens)}` : "";
    }), Y = i(() => {
      var S;
      return (S = V.value) != null && S.cost_dollars ? `$${V.value.cost_dollars.toFixed(2)}` : "";
    });
    return (S, u) => {
      var F;
      return n(), s("div", {
        class: ee(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (n(), s(P, { key: 0 }, [
          A("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: u[0] || (u[0] = (B) => w(B, "agent"))
          }, [
            m(_, {
              name: "agents",
              size: 12
            }),
            f(" " + p(((F = e.agentPrograms.find((B) => B.name === e.agent.program)) == null ? void 0 : F.title) || e.agent.program), 1)
          ], 8, Ga),
          m(Oa, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: u[1] || (u[1] = (B) => l("open", "usage", B))
          }, null, 8, ["windows", "disabled"]),
          W.value !== null ? (n(), s("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${W.value}% full: clear or compact it`,
            onClick: u[2] || (u[2] = (B) => N("context") ? w(B, "context") : l("open", "context", B.currentTarget))
          }, [
            m(_, {
              name: "gauge",
              size: 12
            }),
            u[14] || (u[14] = f()),
            A("span", Za, [
              A("span", {
                style: be({ width: `${W.value}%` })
              }, null, 4)
            ]),
            f(" " + p(W.value) + "% ", 1)
          ], 8, Ka)) : k("", !0),
          U.value ? (n(), s("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${U.value}: change the model`,
            onClick: u[3] || (u[3] = (B) => N("model") ? w(B, "model") : null)
          }, [
            m(_, {
              name: "model",
              size: 12
            }),
            f(" " + p(U.value), 1)
          ], 8, Ya)) : k("", !0),
          N("effort") || e.card && T.value ? (n(), s("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: u[4] || (u[4] = (B) => w(B, "effort"))
          }, [
            m(_, {
              name: "bolt",
              size: 12
            }),
            f(" " + p(T.value), 1)
          ], 8, Qa)) : k("", !0),
          Y.value ? (n(), s("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: u[5] || (u[5] = (B) => l("open", "cost", B.currentTarget))
          }, p(Y.value), 9, Xa)) : k("", !0),
          e.branch ? (n(), s("span", _a, [
            m(_, {
              name: "branch",
              size: 12
            }),
            f(" " + p(e.branch), 1)
          ])) : k("", !0),
          e.card ? k("", !0) : (n(), s("button", {
            key: 5,
            type: "button",
            class: ee(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: u[6] || (u[6] = (B) => l("open", "jobs", B.currentTarget))
          }, [
            m(_, {
              name: "clock",
              size: 12
            }),
            f(" " + p(e.jobs), 1)
          ], 2)),
          e.run ? (n(), s("button", {
            key: 6,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: H
          }, [
            m(_, {
              name: "book",
              size: 12
            }),
            f(" " + p(q.value.length), 1)
          ])) : k("", !0),
          e.fitness ? (n(), s(P, { key: 7 }, [
            A("button", {
              type: "button",
              class: ee(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < sn }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: u[7] || (u[7] = (B) => l("open", "fitness", B.currentTarget))
            }, [
              m(_, {
                name: "heart",
                size: 12
              }),
              f(" " + p(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            A("button", {
              type: "button",
              class: ee(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: u[8] || (u[8] = (B) => l("open", "load", B.currentTarget))
            }, [
              m(_, {
                name: "weight",
                size: 12
              }),
              f(" " + p(e.fitness.workload), 1)
            ], 2)
          ], 64)) : k("", !0)
        ], 64)) : e.run && !e.loading ? (n(), s("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: u[9] || (u[9] = (B) => w(B, "start"))
        }, [
          m(_, {
            name: "agents",
            size: 12
          }),
          u[15] || (u[15] = f(" Start an agent", -1))
        ])) : k("", !0),
        u[21] || (u[21] = A("span", { class: "space" }, null, -1)),
        r(t).failure.value ? (n(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: r(t).failure.value
        }, p(r(t).failure.value), 9, en)) : k("", !0),
        we(S.$slots, "default", {}, void 0, !0),
        d.value ? (n(), D(Fa, {
          key: 3,
          anchor: d.value,
          "min-width": 190,
          onClose: L
        }, {
          default: y(() => {
            var B;
            return [
              c.value === "agent" ? (n(), s(P, { key: 0 }, [
                r(t).asking.value ? (n(), s(P, { key: 0 }, [
                  m(ke, { "data-agent-stop-ask": "" }, {
                    default: y(() => [...u[16] || (u[16] = [
                      f("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  m(me, {
                    "data-agent-stop-confirm": "",
                    onClick: u[10] || (u[10] = (j) => (L(), r(t).stop()))
                  }, {
                    default: y(() => [...u[17] || (u[17] = [
                      f("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  m(me, {
                    onClick: u[11] || (u[11] = (j) => r(t).asking.value = !1)
                  }, {
                    default: y(() => [...u[18] || (u[18] = [
                      f("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (n(), D(me, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: u[12] || (u[12] = (j) => r(t).asking.value = !0)
                }, {
                  default: y(() => [...u[19] || (u[19] = [
                    f("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : c.value === "start" ? (n(), s(P, { key: 1 }, [
                m(ke, null, {
                  default: y(() => [...u[20] || (u[20] = [
                    f("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (n(!0), s(P, null, te(r(t).programs.value, (j) => (n(), D(me, {
                  key: j.name,
                  "data-agent-program": j.name,
                  onClick: (O) => (L(), r(t).start(j))
                }, {
                  default: y(() => [
                    f(p(j.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : c.value === "skills" ? (n(), D(Ra, {
                key: 2,
                skills: e.skills,
                onBrowse: u[13] || (u[13] = (j) => (L(), l("open", "skills", null)))
              }, null, 8, ["skills"])) : $.value ? (n(), s(P, { key: 3 }, [
                m(ke, null, {
                  default: y(() => [
                    f(p($.value.label), 1)
                  ]),
                  _: 1
                }),
                c.value === "context" ? (n(), s(P, { key: 0 }, [
                  A("p", tn, p(r(Ja)(((B = V.value) == null ? void 0 : B.last_compaction) ?? null)), 1),
                  A("div", an, [
                    A("span", nn, [
                      A("span", {
                        style: be({ width: `${W.value}%` })
                      }, null, 4)
                    ]),
                    A("span", on, p(W.value) + "%", 1)
                  ]),
                  J.value ? (n(), s("p", ln, [
                    f(p(J.value) + " ", 1),
                    m(Ea, {
                      text: "Capped",
                      tone: "warn"
                    })
                  ])) : k("", !0)
                ], 64)) : k("", !0),
                (n(!0), s(P, null, te($.value.choices, (j) => (n(), D(me, {
                  key: j.value,
                  "data-agent-choice": j.value,
                  onClick: (O) => (r(t).choose($.value.key, j), L())
                }, {
                  default: y(() => [
                    f(p(j.label), 1)
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
}, dn = /* @__PURE__ */ X(rn, [["__scopeId", "data-v-dc15ff96"]]), un = ["data-agent-open", "aria-expanded", "role", "tabindex"], cn = { class: "agent-head" }, gn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, vn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, pn = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, hn = { class: "agent-line" }, fn = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, mn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, kn = {
  key: 1,
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, yn = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, bn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const a = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), l = { helper: "Helper", reviewer: "Reviewer" }, t = e, d = o, c = Je(), $ = i(() => {
      var C, ae;
      if ((C = t.facts) != null && C.profile_title) return t.facts.profile_title;
      if ((ae = t.facts) != null && ae.profile) return t.facts.profile;
      const h = l[t.row.role] || t.row.role;
      return h.slice(0, 1).toUpperCase() + h.slice(1);
    }), w = i(() => {
      var h;
      return ((h = t.facts) == null ? void 0 : h.tasks) ?? [];
    }), L = i(() => w.value.filter((h) => h.state === "open")), q = i(() => w.value.find((h) => {
      var C;
      return h.id === ((C = t.progress) == null ? void 0 : C.task_id) && h.state === "started";
    })), H = i(() => q.value || w.value.find((h) => {
      var C;
      return h.id === ((C = t.facts) == null ? void 0 : C.task_id);
    }) || w.value.find((h) => a.has(h.state)) || L.value[0] || w.value.at(-1)), N = i(() => {
      var h, C, ae, se, K, ue;
      return t.row.role === "helper" ? ((h = t.facts) == null ? void 0 : h.helper_job) || "" : (C = t.facts) != null && C.job_enabled && (((ae = q.value) == null ? void 0 : ae.title) || ((se = t.facts) == null ? void 0 : se.task_title) || ((K = L.value[0]) == null ? void 0 : K.title) || ((ue = w.value.at(-1)) == null ? void 0 : ue.title)) || "";
    }), U = i(() => {
      var h;
      return (h = t.facts) != null && h.job_enabled ? `${t.row.role} ${t.row.id}` : "";
    }), T = i(() => {
      var h, C;
      return [t.row.program, (h = t.facts) == null ? void 0 : h.model, (C = t.facts) == null ? void 0 : C.effort, U.value].filter(Boolean).join(" · ");
    }), V = Te(), W = i(() => ft(t.row.process_started_at || t.row.created_at, c.value)), Z = /* @__PURE__ */ new Set(["open", "started", "testing"]), J = i(() => {
      var h;
      return (h = t.facts) == null ? void 0 : h.work_status;
    }), Y = i(() => !!t.row.ended_at && t.row.role !== "main" && w.value.some((h) => Z.has(h.state))), S = i(() => {
      var h, C;
      return t.row.state === "running" && ((h = t.facts) == null ? void 0 : h.state) === "at usage limit" && !!((C = t.facts) != null && C.limited_until);
    }), u = i(() => `At usage limit: starts again ${new Date(t.facts.limited_until).toLocaleString()}`), F = i(() => {
      var h;
      return t.row.retired_at || t.row.state === "retired" ? "retired" : S.value || J.value || t.waitReason || Y.value ? "waiting" : t.row.state === "running" && ((h = t.facts) == null ? void 0 : h.state) || t.row.state;
    }), B = i(() => {
      var h;
      return S.value ? u.value : J.value ? `Status: ${J.value}` : t.waitReason ? `Waiting: ${t.waitReason}` : F.value === "blocked" ? (h = t.facts) != null && h.blocked_reason ? `Blocked: ${t.facts.blocked_reason}` : "Blocked" : Y.value ? "Stopped with work left" : "";
    }), j = i(() => {
      var h;
      return ((h = t.progress) == null ? void 0 : h.completed_count) ?? w.value.filter((C) => C.state === "completed").length;
    }), O = i(() => {
      var h;
      return mt(j.value, ((h = t.progress) == null ? void 0 : h.started_at) || t.row.created_at, t.progress ? t.progress.finished_at : t.row.ended_at, c.value);
    }), v = i(() => t.row.role === "main" ? 0 : O.value), b = i(() => !!t.row.retired_at || t.row.state === "retired"), g = i(() => b.value ? "Retired" : F.value === "blocked" || F.value === "waiting" ? B.value || (F.value === "blocked" ? "Blocked" : "Waiting") : t.row.ended_at ? "Idle: its process has stopped" : "Working"), R = i(() => {
      var C;
      if (b.value) return t.row.retired_at;
      const h = F.value === "blocked" || F.value === "waiting";
      return t.row.ended_at || h && ((C = t.facts) == null ? void 0 : C.last_activity) || t.row.process_started_at || t.row.created_at;
    }), z = i(() => R.value ? `Since: ${new Date(R.value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}, ${We(R.value, c.value)}` : ""), Q = i(() => {
      var h;
      return (h = t.facts) != null && h.last_activity ? `Seen: ${We(t.facts.last_activity, c.value)}` : "";
    });
    return (h, C) => {
      var ae, se, K, ue, re, pe;
      return n(), s("div", {
        class: ee(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: C[2] || (C[2] = (oe) => !e.open && d("toggle")),
        onKeydown: [
          C[3] || (C[3] = He(ne((oe) => !e.open && d("toggle"), ["self", "prevent"]), ["enter"])),
          C[4] || (C[4] = He(ne((oe) => !e.open && d("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        A("span", cn, [
          e.open ? (n(), s("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: C[0] || (C[0] = ne((oe) => d("toggle"), ["stop"]))
          }, [
            m(r(Re), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : k("", !0),
          A("span", gn, p($.value), 1),
          A("span", vn, p(((ae = e.facts) == null ? void 0 : ae.given_name) || e.row.id), 1),
          e.open ? k("", !0) : (n(), D(r(Re), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          e.open ? (n(), s("span", pn, p(W.value), 1)) : k("", !0)
        ]),
        A("span", hn, [
          A("span", fn, p(T.value), 1),
          (se = e.facts) != null && se.sandbox_off ? (n(), s("span", mn, "sandbox off")) : k("", !0),
          e.open ? (n(), s("span", kn, [
            C[5] || (C[5] = f("Started ", -1)),
            m(r(qe), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : k("", !0),
          e.open && ((K = e.facts) != null && K.last_activity) ? (n(), s("span", yn, [
            C[6] || (C[6] = f("Seen ", -1)),
            m(r(qe), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : k("", !0)
        ]),
        e.open ? (n(), D(dn, {
          key: 0,
          "agent-programs": r(V).props.programs.rows.value,
          agent: e.row,
          branch: (ue = e.progress) == null ? void 0 : ue.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((re = e.facts) == null ? void 0 : re.windows) ?? [] },
          card: ""
        }, {
          default: y(() => [
            m(la, { row: e.row }, null, 8, ["row"]),
            e.row.role === "helper" && !e.row.ended_at ? (n(), D(r(de), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: C[1] || (C[1] = ne((oe) => r(V).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: y(() => [...C[7] || (C[7] = [
                f("Stop", -1)
              ])]),
              _: 1
            })) : k("", !0)
          ]),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : k("", !0),
        e.open ? k("", !0) : (n(), D(ya, {
          key: 1,
          tasks: w.value,
          "in-hand": e.row.role !== "helper" && ((pe = e.facts) != null && pe.job_enabled) && H.value || null,
          job: e.row.role === "helper" ? N.value : "",
          state: F.value,
          "per-hour": v.value
        }, null, 8, ["tasks", "in-hand", "job", "state", "per-hour"])),
        m(ua, {
          state: F.value,
          doing: g.value,
          since: z.value,
          seen: Q.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (n(), D(Ft, {
          key: 2,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: w.value,
          "stopped-with-work": Y.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : k("", !0)
      ], 42, un);
    };
  }
}, wn = /* @__PURE__ */ X(bn, [["__scopeId", "data-v-6742efd8"]]), Mn = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, xn = ["data-agent-row", "data-agent-lingering"], De = "journal.agents.filters", Fe = 300 * 1e3, Se = "cubic-bezier(0.2, 0.9, 0.25, 1)", $n = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const o = e, a = Te(), { rows: l } = a.props.waits, { rows: t } = a.props.progress, { rows: d, failure: c, loaded: $, more: w } = a.props.agents, L = (x) => t.value.find((I) => I.agent_id === x.id) ?? null, q = (x) => {
      var I;
      return ((I = l.value.find((M) => M.agent_id === x.id)) == null ? void 0 : I.reason) ?? "";
    }, H = E("running"), N = E(""), U = JSON.parse(localStorage.getItem(De) || '{"roles":[],"profiles":[],"programs":[]}'), T = E(U), V = i(() => a.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: W } = a.props.programs, Z = i(() => T.value.roles.length + T.value.profiles.length + T.value.programs.length), J = (x, I) => {
      T.value = wt(T.value, x, I);
    }, Y = () => {
      T.value = { roles: [], profiles: [], programs: [] };
    }, S = (x) => x.slice(0, 1).toUpperCase() + x.slice(1);
    ie(T, (x) => localStorage.setItem(De, JSON.stringify(x)));
    const u = E(25);
    function F() {
      Object.assign(a.state, {
        "agents.show": H.value,
        "agents.search": N.value,
        "agents.limit": String(u.value),
        "agents.roles": T.value.roles.join(","),
        "agents.profiles": T.value.profiles.join(","),
        "agents.programs": T.value.programs.join(",")
      });
    }
    async function B() {
      return u.value += 25, F(), await a.reload("agents"), !0;
    }
    ie([H, N, T], () => {
      u.value = 25, F(), a.reload("agents");
    }), F();
    const j = (x) => x.facts ?? null, O = d, v = Je(), b = E([]), g = i(() => new Set(b.value.filter((x) => v.value - x.left < Fe).map((x) => x.row.id))), R = i(() => b.value.filter((x) => g.value.has(x.row.id)).map((x) => x.row)), z = i(() => [...O.value, ...R.value]);
    let Q = "", h = [];
    async function C(x) {
      await a.reload(`card.${x.id}`);
      const I = a.props[`card.${x.id}`].rows.value.find((M) => M.id === x.id);
      I != null && I.ended_at && !b.value.some((M) => M.row.id === x.id) && (b.value = [...b.value, { row: I, left: Date.now() }]);
    }
    ie(d, (x) => {
      const I = Q === `${H.value}|${N.value}|${JSON.stringify(T.value)}` && H.value === "running", M = I ? h.filter((G) => !x.some((ge) => ge.id === G.id)) : [];
      Q = `${H.value}|${N.value}|${JSON.stringify(T.value)}`, h = x, b.value = I ? b.value.filter((G) => v.value - G.left < Fe && !x.some((ge) => ge.id === G.row.id)) : [], M.forEach(C);
    }, { immediate: !0 });
    const ae = i(() => !!N.value.trim() || Z.value > 0), se = i(() => o.texts[H.value] ?? { title: o.empty, hint: "" }), K = E(null), ue = E(null), re = E(null), pe = E(null), oe = i(() => K.value === null ? null : a.props[`card.${K.value}`].rows.value.find((x) => x.id === K.value) ?? ue.value), Ie = i(() => oe.value ? [oe.value] : z.value), Me = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, ce = E(!1);
    let Ve = 0;
    async function Ye(x) {
      if (ce.value) return;
      ce.value = !0, Ve = pe.value.scrollTop;
      const I = re.value.querySelector(`[data-agent-open="${x.id}"]`);
      if (!Me()) {
        const ve = [...re.value.querySelectorAll(".agent-row")].filter((le) => !le.contains(I));
        await Promise.all(ve.map((le) => le.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const M = [...I.querySelectorAll(".agent-head, .agent-line")], G = [...M, ...I.querySelectorAll("[data-agent-motion]")], ge = G.map((ve) => ve.getBoundingClientRect());
      if (ue.value = x, K.value = x.id, a.reload(`card.${x.id}`), await Ne(), !Me()) {
        const ve = G.map((le) => le.getBoundingClientRect());
        G.forEach((le, xe) => {
          const he = M.findIndex((Ee) => Ee !== le && Ee.contains(le)), Xe = ge[xe].left - ve[xe].left - (he < 0 ? 0 : ge[he].left - ve[he].left), _e = ge[xe].top - ve[xe].top - (he < 0 ? 0 : ge[he].top - ve[he].top);
          le.animate([{ transform: `translate(${Xe}px, ${_e}px)` }, { transform: "none" }], { duration: 280, easing: Se });
        }), re.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((le) => {
          le.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Se, fill: "backwards" });
        });
      }
      ce.value = !1;
    }
    async function Oe() {
      if (ce.value || !oe.value) return;
      ce.value = !0;
      const x = re.value.querySelector(`[data-agent-open="${K.value}"]`), I = [...x.children], M = Me() ? [] : I.map((G) => G.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(M.map((G) => G.finished)), K.value = null, await Ne(), pe.value.scrollTop = Ve, M.forEach((G) => G.cancel()), Me() || (x.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Se }), re.value.querySelectorAll(".agent-row").forEach((G) => {
        G.contains(x) || G.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Se });
      })), ce.value = !1;
    }
    const Qe = (x) => K.value === x.id ? Oe() : Ye(x);
    ie(N, (x) => x.trim() && (K.value = null)), ie(H, () => {
      K.value = null;
    });
    const ze = (x) => {
      x.key === "Escape" && Oe();
    };
    return window.addEventListener("keydown", ze), ye(() => window.removeEventListener("keydown", ze)), (x, I) => (n(), s("div", {
      ref_key: "agents",
      ref: re,
      class: ee(["agents", { focused: oe.value, "card-changing": ce.value }])
    }, [
      m(r(kt), {
        modelValue: N.value,
        "onUpdate:modelValue": I[1] || (I[1] = (M) => N.value = M),
        placeholder: "Search agents",
        "menu-count": Z.value,
        "data-agents-search": ""
      }, {
        menu: y(() => [
          m(r(Be), null, {
            default: y(() => [...I[2] || (I[2] = [
              f("Type", -1)
            ])]),
            _: 1
          }),
          (n(!0), s(P, null, te(V.value.roles, (M) => (n(), D(r($e), {
            key: M,
            role: "menuitemcheckbox",
            "aria-checked": T.value.roles.includes(M),
            checked: T.value.roles.includes(M),
            "data-filter-role": M,
            onClick: (G) => J("roles", M)
          }, {
            default: y(() => [
              f(p(S(M)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          V.value.profiles.length ? (n(), D(r(Be), { key: 0 }, {
            default: y(() => [...I[3] || (I[3] = [
              f("Profile", -1)
            ])]),
            _: 1
          })) : k("", !0),
          (n(!0), s(P, null, te(V.value.profiles, (M) => (n(), D(r($e), {
            key: M.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.profiles.includes(M.name),
            checked: T.value.profiles.includes(M.name),
            "data-filter-profile": M.name,
            onClick: (G) => J("profiles", M.name)
          }, {
            default: y(() => [
              f(p(M.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          m(r(Be), null, {
            default: y(() => [...I[4] || (I[4] = [
              f("Program", -1)
            ])]),
            _: 1
          }),
          (n(!0), s(P, null, te(r(W), (M) => (n(), D(r($e), {
            key: M.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.programs.includes(M.name),
            checked: T.value.programs.includes(M.name),
            "data-filter-program": M.name,
            onClick: (G) => J("programs", M.name)
          }, {
            default: y(() => [
              f(p(M.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          Z.value ? (n(), D(r($e), {
            key: 1,
            "data-filter-clear": "",
            onClick: Y
          }, {
            default: y(() => [...I[5] || (I[5] = [
              f("Clear filters", -1)
            ])]),
            _: 1
          })) : k("", !0)
        ]),
        default: y(() => [
          m(r(yt), {
            options: V.value.states,
            value: H.value,
            onPick: I[0] || (I[0] = (M) => H.value = M)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      H.value === "retired" && V.value.upgrade_retired ? (n(), s("p", Mn, "Retired during the upgrade: " + p(V.value.upgrade_retired), 1)) : k("", !0),
      A("div", {
        ref_key: "list",
        ref: pe,
        class: ee(["agents-view", { "agents-view-open": oe.value }])
      }, [
        r($) && !r(c) && !Ie.value.length && Z.value ? (n(), D(r(Le), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: y(() => [
            m(r(de), {
              small: "",
              "data-empty-clear": "",
              onClick: Y
            }, {
              default: y(() => [...I[6] || (I[6] = [
                f("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (n(), D(r(bt), {
          key: 1,
          moves: "",
          "leaves-at-once": ce.value,
          rows: Ie.value,
          failure: r(c),
          loaded: r($),
          more: !oe.value && r(w),
          older: B,
          empty: se.value.title,
          hint: se.value.hint,
          searching: ae.value
        }, {
          default: y(({ row: M }) => [
            A("div", {
              class: ee(["agent-row", { lingering: g.value.has(M.id) && M.id !== K.value }]),
              "data-agent-row": M.id,
              "data-agent-lingering": g.value.has(M.id) ? "" : null
            }, [
              m(wn, {
                row: M,
                facts: j(M),
                progress: L(M),
                "wait-reason": q(M),
                open: M.id === K.value,
                onToggle: (G) => Qe(M)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, xn)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, Tn = /* @__PURE__ */ X($n, [["__scopeId", "data-v-2cc349bb"]]);
export {
  Tn as A
};
