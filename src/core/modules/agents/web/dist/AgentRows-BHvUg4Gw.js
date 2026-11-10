import { openBlock as n, createElementBlock as s, withModifiers as te, unref as i, createTextVNode as b, toDisplayString as p, createVNode as y, createBlock as N, withCtx as w, Fragment as D, renderList as ne, createElementVNode as A, createCommentVNode as f, computed as d, ref as V, watch as de, onUnmounted as we, defineAsyncComponent as Xe, createSlots as _e, resolveDynamicComponent as et, normalizeClass as se, normalizeStyle as Te, renderSlot as Me, onMounted as tt, Teleport as at, mergeProps as nt, toRef as Be, withKeys as Ee, nextTick as Ne } from "vue";
import { peekRef as xe, Icon as Ie, RunningCommand as lt, FoldGroup as Pe, TaskStatusIcon as ot, useWindow as Ae, loadWindowComponent as st, coalesced as rt, READ_RATES as it, eventMayBeChildOf as dt, InnerTabs as ut, TabBody as ct, SwitchCase as Ue, EmptyState as Oe, Btn as re, TextArea as gt, TextInput as vt, HoverTip as je, TaskBar as ht, useNow as Je, age as pt, perHour as ft, sinceWords as mt, seenWords as kt, AgentTip as bt, TimeAgo as We, SearchBar as yt, Segmented as wt, MenuLabel as Re, MenuItem as Se, RowList as Mt, toggleFilter as xt } from "@journal/window-kit";
import { _ as Z, T as $t } from "./TranscriptRows-Crmxs6Un.js";
const St = {
  class: "agent-command",
  "data-agent-command": ""
}, Ct = {
  key: 1,
  "data-agent-stopped": ""
}, jt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (l, a) => (n(), s("span", St, [
      e.waitReason ? (n(), s("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: a[0] || (a[0] = te((o) => i(xe)("test_queue:0"), ["stop"]))
      }, [
        b("Waiting: " + p(e.waitReason) + " ", 1),
        y(i(Ie), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (n(), s("span", Ct, "Waiting")) : (n(), N(i(lt), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, Tt = /* @__PURE__ */ Z(jt, [["__scopeId", "data-v-1b371fb5"]]), At = ["data-agent-delegated", "onClick"], Lt = { class: "agent-task-number" }, Bt = { class: "agent-task-title" }, Rt = ["title"], It = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const a = l;
    return (o, t) => (n(), N(i(Pe), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: t[0] || (t[0] = (v) => a("toggle"))
    }, {
      default: w(() => [
        (n(!0), s(D, null, ne(e.section.tasks, (v) => (n(), s("button", {
          key: v.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": v.id,
          onClick: (k) => i(xe)(`tasks:${v.id}`)
        }, [
          y(i(ot), {
            status: v.state
          }, null, 8, ["status"]),
          A("span", Lt, p(v.id), 1),
          A("span", Bt, p(v.title), 1),
          v.plan_id ? (n(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${v.plan_id}: ${v.plan_title}`
          }, "Plan " + p(v.plan_id), 9, Rt)) : f("", !0)
        ], 8, At))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Ot = /* @__PURE__ */ Z(It, [["__scopeId", "data-v-ea4ccd6b"]]), Vt = {
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
    const l = e, a = ["started", "blocked", "open", "completed"], o = d(() => {
      var r, M;
      return l.row.ended_at && ((M = (r = l.facts) == null ? void 0 : r.job_returned) != null && M.startsWith(Ft)) ? l.facts.job_returned : "";
    }), t = d(() => l.tasks.length ? a.map((r) => ({ state: r, label: r.slice(0, 1).toUpperCase() + r.slice(1), tasks: l.tasks.filter((M) => M.state === r || r === "started" && M.state === "testing" || r === "completed" && M.state === "cancelled") })) : []), v = /* @__PURE__ */ new Set(["completed"]), k = V({}), S = (r) => !(k.value[r] ?? v.has(r)), C = (r) => k.value = { ...k.value, [r]: S(r) }, L = Ae(), { rows: q } = L.props.reports;
    L.state["reports.agent"] = String(l.row.number);
    const z = d(() => l.row.access === "read-only"), H = d(() => !!l.row.retired_at || l.row.state === "retired"), F = ["tasks", "transcript", "terminal", "file-feed", "reports"], T = d(() => (H.value ? L.tabs.filter((M) => ["reports", "transcript"].includes(M.key)) : z.value ? L.tabs.filter((M) => ["reports", "transcript", "terminal"].includes(M.key)) : [...L.tabs]).sort((M, g) => (F.indexOf(M.key) < 0 ? F.length : F.indexOf(M.key)) - (F.indexOf(g.key) < 0 ? F.length : F.indexOf(g.key)))), B = () => z.value || H.value ? T.value.find((r) => r.key === "transcript") : T.value[0], E = V(B());
    de(E, (r) => {
      L.state.tab = (r == null ? void 0 : r.key) ?? "";
    }, { immediate: !0 }), we(() => {
      L.state.tab = "";
    }), de(T, (r) => {
      r.some((M) => {
        var g;
        return M.key === ((g = E.value) == null ? void 0 : g.key);
      }) || (E.value = r[0]);
    }), de(() => l.open, (r) => {
      r && (E.value = B());
    });
    const J = Object.fromEntries(L.tabs.filter((r) => r.component).map((r) => [r.key, Xe(() => st(r.component))])), U = V(!1), { data: Q } = L.props.tool, X = d(() => {
      var r;
      return ((r = Q.value) == null ? void 0 : r.tool) ?? "";
    }), G = d(() => {
      var r;
      return ((r = Q.value) == null ? void 0 : r.note) ?? "";
    }), x = d(() => l.row.role !== "main" && (!l.row.ended_at || l.stoppedWithWork || l.waitReason));
    async function u() {
      !l.open || !x.value || (L.state["tool.agent"] = String(l.row.number), await L.reload("tool"));
    }
    const W = rt(u, it.agentCommand), c = L.follow(["hook_call.*", "process_part.*"], (r) => dt(r, "session_agent_id", /* @__PURE__ */ new Set([l.row.id])) && W());
    return we(() => c == null ? void 0 : c()), de(() => l.open, (r) => {
      r && u();
    }, { immediate: !0 }), (r, M) => {
      var g;
      return n(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: M[2] || (M[2] = te(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (n(), s("p", Vt, "Retirement reason: " + p(e.row.retirement_reason), 1)) : f("", !0),
        e.row.resume_reason ? (n(), s("p", zt, p(e.row.resume_reason), 1)) : f("", !0),
        x.value ? (n(), N(Tt, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: X.value,
          note: G.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : f("", !0),
        o.value ? (n(), s("p", Ht, p(o.value), 1)) : f("", !0),
        y(i(ut), {
          class: "agent-tabs",
          tabs: T.value,
          active: E.value,
          answer: { tasks: e.tasks.length, reports: i(q).length },
          onChoose: M[0] || (M[0] = (R) => E.value = R)
        }, null, 8, ["tabs", "active", "answer"]),
        y(i(ct), {
          class: "agent-tab-body",
          tab: E.value,
          "data-agent-tab-body": (g = E.value) == null ? void 0 : g.key
        }, {
          default: w(() => {
            var R;
            return [
              y(i(Ue), {
                value: (R = E.value) == null ? void 0 : R.key
              }, _e({
                reports: w(() => [
                  i(q).length ? f("", !0) : (n(), N(i(Oe), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: w(() => [...M[3] || (M[3] = [
                      b("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (n(!0), s(D, null, ne(i(q), (O) => (n(), s("button", {
                    key: O.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${O.id}`,
                    onClick: (K) => i(xe)(`messages:${O.id}`)
                  }, p(O.text), 9, Et))), 128))
                ]),
                tasks: w(() => {
                  var O;
                  return [
                    e.tasks.length ? f("", !0) : (n(), N(i(Oe), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: w(() => [...M[4] || (M[4] = [
                        b("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (n(!0), s(D, null, ne(t.value, (K) => (n(), N(Ot, {
                      key: K.state,
                      section: K,
                      open: S(K.state),
                      onToggle: (ge) => C(K.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (O = e.facts) != null && O.instruction ? (n(), s(D, { key: 1 }, [
                      M[5] || (M[5] = A("p", { class: "agent-label" }, "Instruction", -1)),
                      A("div", Nt, p(e.facts.instruction), 1)
                    ], 64)) : f("", !0)
                  ];
                }),
                transcript: w(() => {
                  var O;
                  return [
                    z.value ? (n(), s(D, { key: 0 }, [
                      (O = e.facts) != null && O.instruction ? (n(), s("div", Wt, [
                        y(i(Pe), {
                          label: "Instruction",
                          open: U.value,
                          "data-agent-section": "instruction",
                          onToggle: M[1] || (M[1] = (K) => U.value = !U.value)
                        }, {
                          default: w(() => [
                            A("div", qt, p(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (n(), s("p", Dt, "No job recorded")) : f("", !0)
                    ], 64)) : f("", !0),
                    y($t, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                ne(i(J), (O, K) => ({
                  name: K,
                  fn: w(() => [
                    (n(), N(et(O), {
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
}, Ut = /* @__PURE__ */ Z(Pt, [["__scopeId", "data-v-2de10293"]]), Jt = { class: "action-field" }, Gt = ["value", "disabled"], Kt = ["value"], Zt = { key: 1 }, Yt = {
  key: 1,
  class: "action-field"
}, Qt = { class: "action-buttons" }, Xt = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (l, a) => (n(), s("form", {
      onSubmit: a[4] || (a[4] = te((o) => l.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (n(), s(D, { key: 0 }, [
        A("label", Jt, [
          a[6] || (a[6] = b("Task ", -1)),
          A("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: a[0] || (a[0] = (o) => l.$emit("update:task", o.target.value))
          }, [
            a[5] || (a[5] = A("option", { value: "" }, "Choose an open task", -1)),
            (n(!0), s(D, null, ne(e.tasks, (o) => (n(), s("option", {
              key: o.id,
              value: String(o.id)
            }, p(o.id) + ": " + p(o.title), 9, Kt))), 128))
          ], 40, Gt)
        ]),
        e.moreTasks ? (n(), N(i(re), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: a[1] || (a[1] = (o) => l.$emit("more"))
        }, {
          default: w(() => [...a[7] || (a[7] = [
            b("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : f("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (n(), s("p", Zt, "No open tasks.")) : f("", !0)
      ], 64)) : (n(), s("label", Yt, [
        a[8] || (a[8] = b("Job", -1)),
        y(i(gt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: a[2] || (a[2] = (o) => l.$emit("update:text", o.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      A("div", Qt, [
        y(i(re), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: w(() => [...a[9] || (a[9] = [
            b("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        y(i(re), {
          small: "",
          disabled: e.pending,
          onClick: a[3] || (a[3] = (o) => l.$emit("cancel"))
        }, {
          default: w(() => [...a[10] || (a[10] = [
            b("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, _t = /* @__PURE__ */ Z(Xt, [["__scopeId", "data-v-adde4158"]]), ea = { class: "action-buttons" }, ta = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (l, a) => (n(), s("form", {
      "data-agent-retire-confirm": "",
      onSubmit: a[2] || (a[2] = te((o) => l.$emit("submit"), ["prevent"]))
    }, [
      a[5] || (a[5] = A("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      y(i(vt), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": a[0] || (a[0] = (o) => l.$emit("update:reason", o))
      }, null, 8, ["model-value", "disabled"]),
      A("div", ea, [
        y(i(re), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: w(() => [...a[3] || (a[3] = [
            b("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        y(i(re), {
          small: "",
          disabled: e.pending,
          onClick: a[1] || (a[1] = (o) => l.$emit("cancel"))
        }, {
          default: w(() => [...a[4] || (a[4] = [
            b("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, aa = /* @__PURE__ */ Z(ta, [["__scopeId", "data-v-23a905c0"]]), na = { class: "action-buttons" }, la = {
  key: 0,
  role: "alert"
}, oa = {
  key: 1,
  role: "status"
}, sa = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const l = e, a = Ae(), o = V(""), t = V(""), v = V(""), k = V(""), S = V([]), C = V(0), L = V(!1), q = V(!1), z = V(!1), H = V(""), F = V(""), T = d(() => !!l.row.retired_at || l.row.state === "retired"), B = d(() => !T.value && !!l.row.ended_at), E = d(() => {
      var W;
      return B.value && ((W = l.row.job_command) == null ? void 0 : W.length) && !l.row.resume_reason;
    }), J = d(() => E.value && !q.value && (l.row.job_task_flag ? S.value.some((W) => String(W.id) === k.value) : !!t.value.trim()));
    function U(W) {
      o.value = W, t.value = "", v.value = "", k.value = "", H.value = "", F.value = "";
    }
    async function Q() {
      U("job"), l.row.job_task_flag && (S.value = [], C.value = 0, L.value = !1, await X());
    }
    async function X() {
      if (!q.value) {
        q.value = !0;
        try {
          a.state["jobs.page"] = String(C.value + 1), await a.reload("jobs");
          const W = a.props.jobs;
          H.value = W.failure.value, H.value || (S.value = [...S.value, ...W.rows.value], C.value = W.data.value.page, L.value = W.more.value);
        } finally {
          q.value = !1;
        }
      }
    }
    async function G(W, c) {
      if (!z.value) {
        z.value = !0, H.value = "";
        try {
          const r = await a.run(W);
          H.value = r.ok ? "" : r.error, r.ok && (U(""), F.value = c);
        } finally {
          z.value = !1;
        }
      }
    }
    async function x() {
      if (!J.value) return;
      const W = l.row.job_task_flag ? [l.row.job_task_flag, k.value] : [t.value.trim()];
      await G([...l.row.job_command, String(l.row.number), ...W], "Job sent.");
    }
    async function u() {
      !B.value || o.value !== "retire" || !v.value.trim() || await G(["agent", "retire", String(l.row.number), "--reason", v.value.trim()], "Agent retired permanently.");
    }
    return (W, c) => {
      var r;
      return T.value ? f("", !0) : (n(), s("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: c[6] || (c[6] = te(() => {
        }, ["stop"])),
        onKeydown: c[7] || (c[7] = te(() => {
        }, ["stop"]))
      }, [
        A("div", na, [
          B.value ? (n(), s(D, { key: 0 }, [
            (r = e.row.job_command) != null && r.length ? (n(), N(i(re), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: z.value || q.value || !E.value,
              onClick: Q
            }, {
              default: w(() => [...c[8] || (c[8] = [
                b("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0),
            e.row.role !== "main" ? (n(), N(i(re), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: z.value || q.value,
              onClick: c[0] || (c[0] = (M) => U("retire"))
            }, {
              default: w(() => [...c[9] || (c[9] = [
                b("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0)
          ], 64)) : f("", !0)
        ]),
        y(i(Ue), { value: o.value }, {
          job: w(() => [
            y(_t, {
              task: k.value,
              "onUpdate:task": c[1] || (c[1] = (M) => k.value = M),
              text: t.value,
              "onUpdate:text": c[2] || (c[2] = (M) => t.value = M),
              row: e.row,
              tasks: S.value,
              pending: z.value,
              loading: q.value,
              "more-tasks": L.value,
              failure: H.value,
              "job-ready": J.value,
              onSubmit: x,
              onMore: X,
              onCancel: c[3] || (c[3] = (M) => U(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: w(() => [
            y(aa, {
              reason: v.value,
              "onUpdate:reason": c[4] || (c[4] = (M) => v.value = M),
              pending: z.value,
              onSubmit: u,
              onCancel: c[5] || (c[5] = (M) => U(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        H.value ? (n(), s("p", la, p(H.value), 1)) : f("", !0),
        F.value ? (n(), s("p", oa, p(F.value), 1)) : f("", !0)
      ], 32));
    };
  }
}, ra = /* @__PURE__ */ Z(sa, [["__scopeId", "data-v-50edef73"]]), ia = { class: "line" }, da = {
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
    const l = /* @__PURE__ */ new Set(["running", "working", "thinking"]), a = e, o = d(() => l.has(a.state)), t = d(() => [a.doing, a.since, a.seen].filter(Boolean).join(". "));
    return (v, k) => (n(), N(i(je), {
      as: "button",
      place: "corner",
      class: se(["agent-dot", { pulse: o.value }]),
      "data-state": e.state,
      "aria-label": t.value,
      "data-agent-status": "",
      onClick: k[0] || (k[0] = te(() => {
      }, ["stop"]))
    }, {
      tip: w(() => [
        A("b", ia, p(e.doing), 1),
        e.since ? (n(), s("span", da, p(e.since), 1)) : f("", !0),
        e.seen ? (n(), s("span", ua, p(e.seen), 1)) : f("", !0)
      ]),
      default: w(() => [
        k[1] || (k[1] = A("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, ga = /* @__PURE__ */ Z(ca, [["__scopeId", "data-v-1a0bc478"]]), va = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, ha = (e) => e.filter((l) => l.state !== "cancelled"), qe = (e, l) => e.filter((a) => a.state === l).length;
function pa({ tasks: e, inHand: l, perHour: a }) {
  const o = ha(e), t = qe(o, "completed"), v = va[l == null ? void 0 : l.state], k = o.length - t - (l && l.state !== "completed" ? 1 : 0), S = t === o.length;
  return {
    number: l.id,
    title: l.title,
    plan: l.plan_id ?? 0,
    count: `${t} of ${o.length}`,
    taskTip: `${t} of its ${o.length} tasks done${v ? `. This one is ${v.words}.` : "."}`,
    countTip: S ? `All ${o.length} tasks done` : `${t} done, 1 in hand, ${k} to go`,
    paceTip: !S && a ? `About ${a} an hour.` : "",
    rate: !S && a ? `${Math.round(a)}/hour` : "",
    bar: { total: o.length, done: t, testing: qe(o, "testing") }
  };
}
const fa = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, ma = {
  key: 0,
  class: "plan",
  "data-agent-job-launch": ""
}, ka = {
  class: "task-line",
  "data-agent-task-line": ""
}, ba = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, ya = {
  key: 1,
  class: "rate",
  "data-agent-rate": ""
}, wa = { key: 0 }, Ma = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, jobTitle: { type: String, default: "" }, jobLaunch: { type: String, default: "" }, perHour: { type: Number, default: 0 } },
  setup(e) {
    const l = e, a = d(() => l.inHand ? pa({ tasks: l.tasks, inHand: l.inHand, perHour: l.perHour }) : null);
    return (o, t) => e.job && !a.value ? (n(), s("span", fa, [
      y(i(je), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: w(() => [
          A("b", null, p(e.job), 1)
        ]),
        default: w(() => [
          b(p(e.jobTitle || "Job"), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (n(), s("span", ma, p(e.jobLaunch), 1)) : f("", !0)
    ])) : a.value ? (n(), s(D, { key: 1 }, [
      A("span", ka, [
        y(i(je), {
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${a.value.number}`,
          "aria-label": `Task ${a.value.number}: ${a.value.title}`,
          onClick: t[0] || (t[0] = te((v) => i(xe)(`tasks:${a.value.number}`), ["stop"]))
        }, {
          tip: w(() => [
            A("b", null, p(a.value.title), 1),
            A("span", null, p(a.value.taskTip), 1)
          ]),
          default: w(() => [
            b("Task " + p(a.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"]),
        a.value.plan ? (n(), s("span", ba, "Plan " + p(a.value.plan), 1)) : f("", !0),
        a.value.rate ? (n(), s("span", ya, p(a.value.rate), 1)) : f("", !0),
        y(i(je), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: w(() => [
            A("b", null, p(a.value.countTip), 1),
            a.value.paceTip ? (n(), s("span", wa, p(a.value.paceTip), 1)) : f("", !0)
          ]),
          default: w(() => [
            b(p(a.value.count), 1)
          ]),
          _: 1
        })
      ]),
      y(i(ht), {
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: a.value.bar.total,
        done: a.value.bar.done,
        testing: a.value.bar.testing
      }, null, 8, ["total", "done", "testing"])
    ], 64)) : f("", !0);
  }
}, xa = /* @__PURE__ */ Z(Ma, [["__scopeId", "data-v-d39df179"]]), $a = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Sa = ["data-icon", "stroke-width", "innerHTML"], ee = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const l = e, a = { right: 0, down: 90, left: 180, up: 270 }, o = {
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
      agent: $a,
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
    return (v, k) => (n(), s("svg", {
      class: "ico",
      "data-icon": e.name,
      style: Te({
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
      innerHTML: t[o[e.name] || e.name] || t.dot
    }, null, 12, Sa));
  }
}, Ca = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, ja = {
  key: 1,
  class: "menu-item-text"
}, Ta = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (l, a) => (n(), s("button", {
      type: "button",
      class: se(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (n(), s("span", Ca, p(e.checked ? "✓" : ""), 1)) : f("", !0),
      e.description ? (n(), s("span", ja, [
        A("span", null, [
          Me(l.$slots, "default", {}, void 0, !0)
        ]),
        A("small", null, p(e.description), 1)
      ])) : Me(l.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, fe = /* @__PURE__ */ Z(Ta, [["__scopeId", "data-v-fec99974"]]), Aa = {}, La = { class: "menu-label" };
function Ba(e, l) {
  return n(), s("span", La, [
    Me(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ye = /* @__PURE__ */ Z(Aa, [["render", Ba], ["__scopeId", "data-v-aa955b3e"]]), Ra = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, Ia = {
  key: 0,
  class: "skills-none"
}, Oa = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: l }) {
    const a = e, o = l, t = d(() => a.skills.filter((k) => k.state === "loaded")), v = d(() => a.skills.filter((k) => k.state !== "loaded"));
    return (k, S) => (n(), s("div", Ra, [
      y(ye, null, {
        default: w(() => [...S[1] || (S[1] = [
          b("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      t.value.length ? f("", !0) : (n(), s("p", Ia, "None yet. Compacting the conversation empties this list.")),
      (n(!0), s(D, null, ne(t.value, (C) => (n(), s("p", {
        key: C.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        y(ee, {
          name: "book",
          size: 12
        }),
        b(p(C.skill), 1)
      ]))), 128)),
      v.value.length ? (n(), s(D, { key: 1 }, [
        y(ye, null, {
          default: w(() => [...S[2] || (S[2] = [
            b("Still to read", -1)
          ])]),
          _: 1
        }),
        (n(!0), s(D, null, ne(v.value, (C) => (n(), s("p", {
          key: C.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          y(ee, {
            name: "book",
            size: 12
          }),
          b(p(C.skill), 1)
        ]))), 128))
      ], 64)) : f("", !0),
      y(fe, {
        "data-agent-skills-browse": "",
        onClick: S[0] || (S[0] = (C) => o("browse"))
      }, {
        default: w(() => [...S[3] || (S[3] = [
          b("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Va = /* @__PURE__ */ Z(Oa, [["__scopeId", "data-v-be514d47"]]), za = ["disabled", "title"], Ha = { class: "gauge usage" }, Ea = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: l }) {
    const a = e, o = l, t = d(() => a.windows[0] ?? null), v = d(() => t.value && Number.isFinite(t.value.used_percent) ? Math.max(0, Math.min(100, Math.round(t.value.used_percent))) : null), k = d(() => v.value !== null && v.value >= 100), S = d(() => {
      var L;
      return (L = t.value) != null && L.reset_epoch_seconds ? new Date(t.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), C = d(() => k.value ? `At usage limit: the plan's ${t.value.title} allowance is used up${S.value ? `, starts again ${S.value}` : ""}` : `${v.value}% of the plan's ${t.value.title} allowance used${S.value ? `, starts again ${S.value}` : ""}`);
    return (L, q) => v.value !== null ? (n(), s("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: C.value,
      onClick: q[0] || (q[0] = (z) => o("open", z.currentTarget))
    }, [
      y(ee, {
        name: "allowance",
        size: 12
      }),
      q[1] || (q[1] = b()),
      A("span", Ha, [
        A("span", {
          style: Te({ width: `${v.value}%` })
        }, null, 4)
      ]),
      b(" " + p(k.value ? "At usage limit" : `${v.value}%`), 1)
    ], 8, za)) : f("", !0);
  }
}, Na = /* @__PURE__ */ Z(Ea, [["__scopeId", "data-v-a36f09dc"]]), Wa = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (l, a) => (n(), s("span", {
      class: se(["badge", e.tone])
    }, p(e.text), 3));
  }
}, qa = /* @__PURE__ */ Z(Wa, [["__scopeId", "data-v-9e7e1157"]]), Da = (e, l, a) => Math.max(l, Math.min(a, e)), Ge = /* @__PURE__ */ new WeakMap(), Fa = (e, l) => Ge.set(e, l);
function Pa(e, l) {
  for (let a = l; a; a = Ge.get(a) ?? a.parentElement) if (a === e) return !0;
  return !1;
}
function Ua(e, l) {
  const a = (o) => {
    var v, k;
    const t = ((v = e.value) == null ? void 0 : v.element) || ((k = e.value) == null ? void 0 : k.$el) || e.value;
    t && !Pa(t, o.target) && l(o);
  };
  window.addEventListener("click", a), we(() => window.removeEventListener("click", a));
}
const pe = 8, Ja = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const o = e, t = V(null), v = (g) => g ? `${g}px` : void 0, k = d(() => ({
      minWidth: v(o.minWidth),
      maxWidth: v(o.maxWidth),
      maxHeight: v(o.maxHeight),
      height: v(o.height)
    })), S = V({ w: 0, h: 0 }), C = V(o.anchor ? o.anchor.getBoundingClientRect() : null), L = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), q = (g) => ({
      left: Math.max(0, g.left),
      top: Math.max(0, g.top),
      right: Math.min(window.innerWidth, g.right),
      bottom: Math.min(window.innerHeight, g.bottom)
    }), z = (g) => {
      const R = g.closest(".pane, .float-window");
      return R ? q(R.getBoundingClientRect()) : L();
    }, H = (g, R) => `${Math.max(0, g ? Math.min(g, R) : R)}px`;
    function F(g, R) {
      return {
        below: g.bottom - R.bottom - o.gap - pe,
        above: R.top - g.top - o.gap - pe,
        across: g.right - g.left - 2 * pe
      };
    }
    function T(g) {
      const R = z(o.anchor), O = F(R, g);
      return S.value.w <= O.across && S.value.h <= Math.max(O.below, O.above) ? R : L();
    }
    const B = d(() => {
      if (!C.value) return k.value;
      const g = C.value, R = T(g), O = F(R, g), { w: K, h: ge } = S.value, me = o.align === "auto" ? g.left + g.right > R.left + R.right : o.align === "right", ke = Da(me ? g.right - K : g.left, R.left + pe, Math.max(R.left + pe, R.right - K - pe)), h = ge > O.below && O.above > O.below ? { bottom: `${window.innerHeight - g.top + o.gap}px`, maxHeight: H(o.maxHeight, O.above) } : { top: `${g.bottom + o.gap}px`, maxHeight: H(o.maxHeight, O.below) };
      return { ...k.value, ...h, left: `${ke}px`, maxWidth: H(o.maxWidth, O.across) };
    }), E = a, J = () => [...t.value.querySelectorAll("button:not(:disabled)")];
    function U(g) {
      const R = J(), O = R.indexOf(document.activeElement);
      R[(O + g + R.length) % R.length].focus();
    }
    const Q = { ArrowDown: () => U(1), ArrowUp: () => U(-1), Escape: () => E("close") }, X = (g) => Q[g.key] && (g.preventDefault(), Q[g.key]()), G = () => t.value && (S.value = { w: t.value.offsetWidth, h: t.value.scrollHeight });
    let x = 0;
    const u = new ResizeObserver(() => {
      cancelAnimationFrame(x), x = requestAnimationFrame(G);
    });
    Ua(t, (g) => o.anchor && !o.anchor.contains(g.target) && E("close"));
    const W = (g, R) => ["top", "left", "right", "bottom"].some((O) => Math.abs(g[O] - R[O]) > 1), c = (g) => g.bottom < 0 || g.top > window.innerHeight;
    let r = 0;
    function M() {
      if (o.anchor) {
        const g = o.anchor.getBoundingClientRect();
        if (!o.anchor.isConnected || c(g)) return E("close");
        W(g, C.value) && (C.value = g);
      }
      r = requestAnimationFrame(M);
    }
    return tt(() => {
      o.anchor && t.value && Fa(t.value, o.anchor), G(), t.value && u.observe(t.value), !o.plain && J()[0] && J()[0].focus(), M();
    }), we(() => {
      u.disconnect(), cancelAnimationFrame(r), cancelAnimationFrame(x);
    }), l({ element: t }), (g, R) => (n(), N(at, {
      to: "body",
      disabled: !e.anchor
    }, [
      A("div", nt({
        ref_key: "panel",
        ref: t
      }, g.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: B.value,
        onKeydown: X
      }), [
        Me(g.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Ga = /* @__PURE__ */ Z(Ja, [["__scopeId", "data-v-3d203970"]]);
async function Ka(e, l, a) {
  if (!e) return a(l);
  const { target: o, fields: t } = e, v = Object.fromEntries(Object.keys(t).map((C) => [C, o[C]])), k = () => Object.assign(o, v);
  Object.assign(o, t);
  let S = !1;
  try {
    const C = await a(l);
    return S = C.ok, C;
  } finally {
    S || k();
  }
}
function Za(e, l, a, { groups: o, programs: t }) {
  const v = V({}), k = V(""), S = V(!1), C = d(() => !!e.value && !e.value.ended_at), L = d(() => C.value && !!e.value.paused_at);
  async function q(T, B = null) {
    k.value = "";
    const E = await Ka(B, T, l);
    return k.value = E.ok ? "" : E.error, a(), E;
  }
  return { groups: o, programs: t, chosen: v, failure: k, asking: S, running: C, paused: L, choose: (T, B) => q(["agent", "control", String(e.value.number), T, B.value], { target: v, fields: { value: { ...v.value, [T]: B.label } } }), stop: () => (S.value = !1, q(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (T) => q(["agent", "launch", T.name]) };
}
function Ya(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const Qa = ["disabled", "title"], Xa = ["disabled", "title"], _a = { class: "gauge" }, en = ["disabled", "title"], tn = ["disabled"], an = ["disabled"], nn = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, ln = ["title"], on = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, sn = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, rn = { class: "gauge" }, dn = { class: "context-used" }, un = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, cn = 75, gn = {
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
    const a = e, o = l, t = Za(Be(a, "agent"), a.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => o("changed"), { groups: Be(a, "controlGroups"), programs: Be(a, "agentPrograms") }), v = V(null), k = V(""), S = d(() => t.groups.value.find((x) => x.key === k.value));
    function C(x, u) {
      v.value = x.currentTarget, k.value = u;
    }
    function L() {
      v.value = null, k.value = "", t.asking.value = !1;
    }
    const q = d(() => a.skills.filter((x) => x.state === "loaded"));
    function z(x) {
      C(x, "skills"), o("skills");
    }
    const H = (x) => t.groups.value.some((u) => u.key === x), F = d(() => {
      var x;
      return t.chosen.value.model ?? ((x = B.value) == null ? void 0 : x.model) ?? "";
    }), T = d(() => {
      var x;
      return t.chosen.value.effort ?? ((x = B.value) == null ? void 0 : x.effort) ?? "";
    });
    d(() => !!a.agent && !a.agent.ended_at);
    const B = d(() => {
      var x;
      return ((x = a.usage.agents) == null ? void 0 : x.find((u) => {
        var W;
        return u.id === ((W = a.agent) == null ? void 0 : W.id);
      })) ?? null;
    }), E = d(() => {
      var x;
      return ((x = B.value) == null ? void 0 : x.context_percent) == null ? null : Math.round(B.value.context_percent);
    }), J = (x) => `${Math.round(x / 1e3)}k`, U = d(() => {
      var x;
      return !!((x = B.value) != null && x.context_limit_tokens);
    }), Q = d(() => {
      var x, u;
      return ((x = B.value) == null ? void 0 : x.context_limit_tokens) || ((u = B.value) == null ? void 0 : u.context_window_tokens) || 0;
    }), X = d(() => Q.value ? `${J(B.value.context_tokens ?? 0)} of ${J(Q.value)}` : ""), G = d(() => {
      var x;
      return (x = B.value) != null && x.cost_dollars ? `$${B.value.cost_dollars.toFixed(2)}` : "";
    });
    return (x, u) => {
      var W;
      return n(), s("div", {
        class: se(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (n(), s(D, { key: 0 }, [
          A("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: u[0] || (u[0] = (c) => C(c, "agent"))
          }, [
            y(ee, {
              name: "agents",
              size: 12
            }),
            b(" " + p(((W = e.agentPrograms.find((c) => c.name === e.agent.program)) == null ? void 0 : W.title) || e.agent.program), 1)
          ], 8, Qa),
          y(Na, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: u[1] || (u[1] = (c) => o("open", "usage", c))
          }, null, 8, ["windows", "disabled"]),
          E.value !== null ? (n(), s("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${E.value}% full: clear or compact it`,
            onClick: u[2] || (u[2] = (c) => H("context") ? C(c, "context") : o("open", "context", c.currentTarget))
          }, [
            y(ee, {
              name: "gauge",
              size: 12
            }),
            u[14] || (u[14] = b()),
            A("span", _a, [
              A("span", {
                style: Te({ width: `${E.value}%` })
              }, null, 4)
            ]),
            b(" " + p(E.value) + "% ", 1)
          ], 8, Xa)) : f("", !0),
          F.value ? (n(), s("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${F.value}: change the model`,
            onClick: u[3] || (u[3] = (c) => H("model") ? C(c, "model") : null)
          }, [
            y(ee, {
              name: "model",
              size: 12
            }),
            b(" " + p(F.value), 1)
          ], 8, en)) : f("", !0),
          H("effort") || e.card && T.value ? (n(), s("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: u[4] || (u[4] = (c) => C(c, "effort"))
          }, [
            y(ee, {
              name: "bolt",
              size: 12
            }),
            b(" " + p(T.value), 1)
          ], 8, tn)) : f("", !0),
          G.value ? (n(), s("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: u[5] || (u[5] = (c) => o("open", "cost", c.currentTarget))
          }, p(G.value), 9, an)) : f("", !0),
          e.branch ? (n(), s("span", nn, [
            y(ee, {
              name: "branch",
              size: 12
            }),
            b(" " + p(e.branch), 1)
          ])) : f("", !0),
          e.card ? f("", !0) : (n(), s("button", {
            key: 5,
            type: "button",
            class: se(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: u[6] || (u[6] = (c) => o("open", "jobs", c.currentTarget))
          }, [
            y(ee, {
              name: "clock",
              size: 12
            }),
            b(" " + p(e.jobs), 1)
          ], 2)),
          e.run ? (n(), s("button", {
            key: 6,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: z
          }, [
            y(ee, {
              name: "book",
              size: 12
            }),
            b(" " + p(q.value.length), 1)
          ])) : f("", !0),
          e.fitness ? (n(), s(D, { key: 7 }, [
            A("button", {
              type: "button",
              class: se(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < cn }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: u[7] || (u[7] = (c) => o("open", "fitness", c.currentTarget))
            }, [
              y(ee, {
                name: "heart",
                size: 12
              }),
              b(" " + p(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            A("button", {
              type: "button",
              class: se(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: u[8] || (u[8] = (c) => o("open", "load", c.currentTarget))
            }, [
              y(ee, {
                name: "weight",
                size: 12
              }),
              b(" " + p(e.fitness.workload), 1)
            ], 2)
          ], 64)) : f("", !0)
        ], 64)) : e.run && !e.loading ? (n(), s("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: u[9] || (u[9] = (c) => C(c, "start"))
        }, [
          y(ee, {
            name: "agents",
            size: 12
          }),
          u[15] || (u[15] = b(" Start an agent", -1))
        ])) : f("", !0),
        u[21] || (u[21] = A("span", { class: "space" }, null, -1)),
        i(t).failure.value ? (n(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: i(t).failure.value
        }, p(i(t).failure.value), 9, ln)) : f("", !0),
        Me(x.$slots, "default", {}, void 0, !0),
        v.value ? (n(), N(Ga, {
          key: 3,
          anchor: v.value,
          "min-width": 190,
          onClose: L
        }, {
          default: w(() => {
            var c;
            return [
              k.value === "agent" ? (n(), s(D, { key: 0 }, [
                i(t).asking.value ? (n(), s(D, { key: 0 }, [
                  y(ye, { "data-agent-stop-ask": "" }, {
                    default: w(() => [...u[16] || (u[16] = [
                      b("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  y(fe, {
                    "data-agent-stop-confirm": "",
                    onClick: u[10] || (u[10] = (r) => (L(), i(t).stop()))
                  }, {
                    default: w(() => [...u[17] || (u[17] = [
                      b("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  y(fe, {
                    onClick: u[11] || (u[11] = (r) => i(t).asking.value = !1)
                  }, {
                    default: w(() => [...u[18] || (u[18] = [
                      b("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (n(), N(fe, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: u[12] || (u[12] = (r) => i(t).asking.value = !0)
                }, {
                  default: w(() => [...u[19] || (u[19] = [
                    b("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : k.value === "start" ? (n(), s(D, { key: 1 }, [
                y(ye, null, {
                  default: w(() => [...u[20] || (u[20] = [
                    b("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (n(!0), s(D, null, ne(i(t).programs.value, (r) => (n(), N(fe, {
                  key: r.name,
                  "data-agent-program": r.name,
                  onClick: (M) => (L(), i(t).start(r))
                }, {
                  default: w(() => [
                    b(p(r.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : k.value === "skills" ? (n(), N(Va, {
                key: 2,
                skills: e.skills,
                onBrowse: u[13] || (u[13] = (r) => (L(), o("open", "skills", null)))
              }, null, 8, ["skills"])) : S.value ? (n(), s(D, { key: 3 }, [
                y(ye, null, {
                  default: w(() => [
                    b(p(S.value.label), 1)
                  ]),
                  _: 1
                }),
                k.value === "context" ? (n(), s(D, { key: 0 }, [
                  A("p", on, p(i(Ya)(((c = B.value) == null ? void 0 : c.last_compaction) ?? null)), 1),
                  A("div", sn, [
                    A("span", rn, [
                      A("span", {
                        style: Te({ width: `${E.value}%` })
                      }, null, 4)
                    ]),
                    A("span", dn, p(E.value) + "%", 1)
                  ]),
                  X.value ? (n(), s("p", un, [
                    b(p(X.value) + " ", 1),
                    U.value ? (n(), N(qa, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : f("", !0)
                  ])) : f("", !0)
                ], 64)) : f("", !0),
                (n(!0), s(D, null, ne(S.value.choices, (r) => (n(), N(fe, {
                  key: r.value,
                  "data-agent-choice": r.value,
                  onClick: (M) => (i(t).choose(S.value.key, r), L())
                }, {
                  default: w(() => [
                    b(p(r.label), 1)
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
}, vn = /* @__PURE__ */ Z(gn, [["__scopeId", "data-v-c1e2d220"]]), hn = ["data-agent-open", "aria-expanded", "role", "tabindex"], pn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, fn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, mn = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, kn = { class: "agent-line" }, bn = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, yn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, wn = {
  key: 1,
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, Mn = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, xn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const a = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), o = { helper: "Helper", reviewer: "Reviewer" }, t = e, v = l, k = Je(), S = d(() => {
      var h, le;
      if ((h = t.facts) != null && h.profile_title) return t.facts.profile_title;
      if ((le = t.facts) != null && le.profile) return t.facts.profile;
      const m = o[t.row.role] || t.row.role;
      return m.slice(0, 1).toUpperCase() + m.slice(1);
    }), C = d(() => {
      var m;
      return ((m = t.facts) == null ? void 0 : m.tasks) ?? [];
    }), L = d(() => C.value.filter((m) => m.state === "open")), q = d(() => C.value.find((m) => {
      var h;
      return m.id === ((h = t.progress) == null ? void 0 : h.task_id) && m.state === "started";
    })), z = d(() => q.value || C.value.find((m) => {
      var h;
      return m.id === ((h = t.facts) == null ? void 0 : h.task_id);
    }) || C.value.find((m) => a.has(m.state)) || L.value[0] || C.value.at(-1)), H = d(() => {
      var m, h, le, ae, ie, _;
      return t.row.role === "helper" ? ((m = t.facts) == null ? void 0 : m.helper_job) || "" : (h = t.facts) != null && h.job_enabled && (((le = q.value) == null ? void 0 : le.title) || ((ae = t.facts) == null ? void 0 : ae.task_title) || ((ie = L.value[0]) == null ? void 0 : ie.title) || ((_ = C.value.at(-1)) == null ? void 0 : _.title)) || "";
    }), F = d(() => `${t.row.role} ${t.row.number}`), T = d(() => {
      var m, h;
      return [t.row.program, (m = t.facts) == null ? void 0 : m.model, (h = t.facts) == null ? void 0 : h.effort, F.value].filter(Boolean).join(" · ");
    }), B = Ae(), E = d(() => pt(t.row.process_started_at || t.row.created_at, k.value)), J = /* @__PURE__ */ new Set(["open", "started", "testing"]), U = { fresh: "new conversation", resumed: "resumed" }, Q = d(() => {
      var m, h;
      return [(m = t.facts) == null ? void 0 : m.helper_job_program, U[(h = t.facts) == null ? void 0 : h.occupant_launch]].filter(Boolean).join(", ");
    }), X = d(() => {
      var m;
      return (m = t.facts) == null ? void 0 : m.work_status;
    }), G = d(() => !!t.row.ended_at && t.row.role !== "main" && C.value.some((m) => J.has(m.state))), x = d(() => {
      var m, h;
      return t.row.state === "running" && ((m = t.facts) == null ? void 0 : m.state) === "at usage limit" && !!((h = t.facts) != null && h.usage_limit_ends_at);
    }), u = (m) => new Date(m).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), W = d(() => t.row.halted_at ? `Stopped at the usage limit since ${u(t.row.halted_at)}, goes on at ${u(t.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(t.facts.usage_limit_ends_at).toLocaleString()}`), c = d(() => {
      var m;
      return t.row.retired_at || t.row.state === "retired" ? "retired" : x.value || X.value || t.waitReason || G.value ? "waiting" : t.row.state === "running" && ((m = t.facts) == null ? void 0 : m.state) || t.row.state;
    }), r = d(() => {
      var m;
      return x.value ? W.value : X.value ? `Status: ${X.value}` : t.waitReason ? `Waiting: ${t.waitReason}` : c.value === "blocked" ? (m = t.facts) != null && m.blocked_reason ? `Blocked: ${t.facts.blocked_reason}` : "Blocked" : G.value ? "Stopped with work left" : "";
    }), M = d(() => {
      var m;
      return ((m = t.progress) == null ? void 0 : m.completed_count) ?? C.value.filter((h) => h.state === "completed").length;
    }), g = d(() => {
      var m;
      return ft(M.value, ((m = t.progress) == null ? void 0 : m.started_at) || t.row.created_at, t.progress ? t.progress.finished_at : t.row.ended_at, k.value);
    }), R = d(() => t.row.role === "main" ? 0 : g.value), O = d(() => !!t.row.retired_at || t.row.state === "retired"), K = d(() => O.value ? "Retired" : c.value === "blocked" || c.value === "waiting" ? r.value || (c.value === "blocked" ? "Blocked" : "Waiting") : t.row.ended_at ? "Idle: its process has stopped" : "Working"), ge = d(() => {
      var h;
      if (O.value) return t.row.retired_at;
      const m = c.value === "blocked" || c.value === "waiting";
      return t.row.ended_at || m && ((h = t.facts) == null ? void 0 : h.last_activity) || t.row.process_started_at || t.row.created_at;
    }), me = d(() => mt(ge.value, k.value)), ke = d(() => {
      var m;
      return kt((m = t.facts) == null ? void 0 : m.last_activity, k.value);
    });
    return (m, h) => {
      var le, ae, ie, _, be, ve;
      return n(), s("div", {
        class: se(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: h[3] || (h[3] = (Y) => !e.open && v("toggle")),
        onKeydown: [
          h[4] || (h[4] = Ee(te((Y) => !e.open && v("toggle"), ["self", "prevent"]), ["enter"])),
          h[5] || (h[5] = Ee(te((Y) => !e.open && v("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        y(i(bt), {
          "agent-id": e.row.id,
          label: S.value,
          class: "agent-head"
        }, {
          default: w(() => {
            var Y;
            return [
              e.open ? (n(), s("button", {
                key: 0,
                type: "button",
                class: "agent-back",
                title: "Back",
                "aria-label": "Back",
                onClick: h[0] || (h[0] = te((Le) => v("toggle"), ["stop"]))
              }, [
                y(i(Ie), {
                  name: "chevronRight",
                  facing: "left",
                  size: 14
                })
              ])) : f("", !0),
              A("span", pn, p(S.value), 1),
              A("span", fn, p(((Y = e.facts) == null ? void 0 : Y.given_name) || e.row.id), 1),
              e.open ? f("", !0) : (n(), N(i(Ie), {
                key: 1,
                class: "agent-chevron",
                name: "chevronRight",
                size: 12
              })),
              e.open ? (n(), s("span", mn, p(E.value), 1)) : f("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-id", "label"]),
        A("span", kn, [
          A("span", bn, p(T.value), 1),
          (le = e.facts) != null && le.sandbox_off ? (n(), s("span", yn, "sandbox off")) : f("", !0),
          e.open ? (n(), s("span", wn, [
            h[6] || (h[6] = b("Started ", -1)),
            y(i(We), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : f("", !0),
          e.open && ((ae = e.facts) != null && ae.last_activity) ? (n(), s("span", Mn, [
            h[7] || (h[7] = b("Seen ", -1)),
            y(i(We), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : f("", !0)
        ]),
        e.open ? (n(), N(vn, {
          key: 0,
          "agent-programs": i(B).props.programs.rows.value,
          agent: e.row,
          branch: (ie = e.progress) == null ? void 0 : ie.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((_ = e.facts) == null ? void 0 : _.windows) ?? [] },
          card: ""
        }, {
          default: w(() => [
            y(ra, { row: e.row }, null, 8, ["row"]),
            y(i(re), {
              variant: "ghost",
              small: "",
              "data-agent-inspector": "",
              onClick: h[1] || (h[1] = te((Y) => i(xe)(`agents:${e.row.id}`), ["stop"]))
            }, {
              default: w(() => [...h[8] || (h[8] = [
                b("Open inspector", -1)
              ])]),
              _: 1
            }),
            e.row.role === "helper" && !e.row.ended_at ? (n(), N(i(re), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: h[2] || (h[2] = te((Y) => i(B).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: w(() => [...h[9] || (h[9] = [
                b("Stop", -1)
              ])]),
              _: 1
            })) : f("", !0)
          ]),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : f("", !0),
        e.open ? f("", !0) : (n(), N(xa, {
          key: 1,
          tasks: C.value,
          "in-hand": e.row.role !== "helper" && ((be = e.facts) != null && be.job_enabled) && z.value || null,
          job: e.row.role === "helper" ? H.value : "",
          "job-title": e.row.role === "helper" && ((ve = e.facts) == null ? void 0 : ve.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? Q.value : "",
          "per-hour": R.value
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour"])),
        y(ga, {
          state: c.value,
          doing: K.value,
          since: me.value,
          seen: ke.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (n(), N(Ut, {
          key: 2,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: C.value,
          "stopped-with-work": G.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : f("", !0)
      ], 42, hn);
    };
  }
}, $n = /* @__PURE__ */ Z(xn, [["__scopeId", "data-v-c237d7ff"]]), Sn = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Cn = ["data-agent-row", "data-agent-lingering"], De = "journal.agents.filters", Fe = 300 * 1e3, Ce = "cubic-bezier(0.2, 0.9, 0.25, 1)", jn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const l = e, a = Ae(), { rows: o } = a.props.waits, { rows: t } = a.props.progress, { rows: v, failure: k, loaded: S, more: C } = a.props.agents, L = (j) => t.value.find((I) => I.agent_id === j.id) ?? null, q = (j) => {
      var I;
      return ((I = o.value.find(($) => $.agent_id === j.id)) == null ? void 0 : I.reason) ?? "";
    }, z = V("running"), H = V(""), F = JSON.parse(localStorage.getItem(De) || '{"roles":[],"profiles":[],"programs":[]}'), T = V(F), B = d(() => a.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: E } = a.props.programs, J = d(() => T.value.roles.length + T.value.profiles.length + T.value.programs.length), U = (j, I) => {
      T.value = xt(T.value, j, I);
    }, Q = () => {
      T.value = { roles: [], profiles: [], programs: [] };
    }, X = (j) => j.slice(0, 1).toUpperCase() + j.slice(1);
    de(T, (j) => localStorage.setItem(De, JSON.stringify(j)));
    const G = V(25);
    function x() {
      Object.assign(a.state, {
        "agents.show": z.value,
        "agents.search": H.value,
        "agents.limit": String(G.value),
        "agents.roles": T.value.roles.join(","),
        "agents.profiles": T.value.profiles.join(","),
        "agents.programs": T.value.programs.join(",")
      });
    }
    async function u() {
      return G.value += 25, x(), await a.reload("agents"), !0;
    }
    de([z, H, T], () => {
      G.value = 25, x(), a.reload("agents");
    }), x();
    const W = (j) => j.facts ?? null, c = v, r = Je(), M = V([]), g = d(() => new Set(M.value.filter((j) => r.value - j.left < Fe).map((j) => j.row.id))), R = d(() => M.value.filter((j) => g.value.has(j.row.id)).map((j) => j.row)), O = d(() => [...c.value, ...R.value]);
    let K = "", ge = [];
    async function me(j) {
      await a.reload(`card.${j.id}`);
      const I = a.props[`card.${j.id}`].rows.value.find(($) => $.id === j.id);
      I != null && I.ended_at && !M.value.some(($) => $.row.id === j.id) && (M.value = [...M.value, { row: I, left: Date.now() }]);
    }
    de(v, (j) => {
      const I = K === `${z.value}|${H.value}|${JSON.stringify(T.value)}` && z.value === "running", $ = I ? ge.filter((P) => !j.some((ue) => ue.id === P.id)) : [];
      K = `${z.value}|${H.value}|${JSON.stringify(T.value)}`, ge = j, M.value = I ? M.value.filter((P) => r.value - P.left < Fe && !j.some((ue) => ue.id === P.row.id)) : [], $.forEach(me);
    }, { immediate: !0 });
    const ke = d(() => !!H.value.trim() || J.value > 0), m = d(() => l.texts[z.value] ?? { title: l.empty, hint: "" }), h = V(null), le = V(null), ae = V(null), ie = V(null), _ = d(() => h.value === null ? null : a.props[`card.${h.value}`].rows.value.find((j) => j.id === h.value) ?? le.value), be = d(() => _.value ? [_.value] : O.value), ve = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, Y = V(!1);
    let Le = 0;
    async function Ke(j) {
      if (Y.value) return;
      Y.value = !0, Le = ie.value.scrollTop;
      const I = ae.value.querySelector(`[data-agent-open="${j.id}"]`);
      if (!ve()) {
        const ce = [...ae.value.querySelectorAll(".agent-row")].filter((oe) => !oe.contains(I));
        await Promise.all(ce.map((oe) => oe.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const $ = [...I.querySelectorAll(".agent-head, .agent-line")], P = [...$, ...I.querySelectorAll("[data-agent-motion]")], ue = P.map((ce) => ce.getBoundingClientRect());
      if (le.value = j, h.value = j.id, a.reload(`card.${j.id}`), await Ne(), !ve()) {
        const ce = P.map((oe) => oe.getBoundingClientRect());
        P.forEach((oe, $e) => {
          const he = $.findIndex((He) => He !== oe && He.contains(oe)), Ye = ue[$e].left - ce[$e].left - (he < 0 ? 0 : ue[he].left - ce[he].left), Qe = ue[$e].top - ce[$e].top - (he < 0 ? 0 : ue[he].top - ce[he].top);
          oe.animate([{ transform: `translate(${Ye}px, ${Qe}px)` }, { transform: "none" }], { duration: 280, easing: Ce });
        }), ae.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((oe) => {
          oe.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Ce, fill: "backwards" });
        });
      }
      Y.value = !1;
    }
    async function Ve() {
      if (Y.value || !_.value) return;
      Y.value = !0;
      const j = ae.value.querySelector(`[data-agent-open="${h.value}"]`), I = [...j.children], $ = ve() ? [] : I.map((P) => P.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all($.map((P) => P.finished)), h.value = null, await Ne(), ie.value.scrollTop = Le, $.forEach((P) => P.cancel()), ve() || (j.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Ce }), ae.value.querySelectorAll(".agent-row").forEach((P) => {
        P.contains(j) || P.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Ce });
      })), Y.value = !1;
    }
    const Ze = (j) => h.value === j.id ? Ve() : Ke(j);
    de(H, (j) => j.trim() && (h.value = null)), de(z, () => {
      h.value = null;
    });
    const ze = (j) => {
      j.key === "Escape" && Ve();
    };
    return window.addEventListener("keydown", ze), we(() => window.removeEventListener("keydown", ze)), (j, I) => (n(), s("div", {
      ref_key: "agents",
      ref: ae,
      class: se(["agents", { focused: _.value, "card-changing": Y.value }])
    }, [
      _.value ? f("", !0) : (n(), N(i(yt), {
        key: 0,
        modelValue: H.value,
        "onUpdate:modelValue": I[1] || (I[1] = ($) => H.value = $),
        placeholder: "Search agents",
        "menu-count": J.value,
        "data-agents-search": ""
      }, {
        menu: w(() => [
          y(i(Re), null, {
            default: w(() => [...I[2] || (I[2] = [
              b("Type", -1)
            ])]),
            _: 1
          }),
          (n(!0), s(D, null, ne(B.value.roles, ($) => (n(), N(i(Se), {
            key: $,
            role: "menuitemcheckbox",
            "aria-checked": T.value.roles.includes($),
            checked: T.value.roles.includes($),
            "data-filter-role": $,
            onClick: (P) => U("roles", $)
          }, {
            default: w(() => [
              b(p(X($)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          B.value.profiles.length ? (n(), N(i(Re), { key: 0 }, {
            default: w(() => [...I[3] || (I[3] = [
              b("Profile", -1)
            ])]),
            _: 1
          })) : f("", !0),
          (n(!0), s(D, null, ne(B.value.profiles, ($) => (n(), N(i(Se), {
            key: $.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.profiles.includes($.name),
            checked: T.value.profiles.includes($.name),
            "data-filter-profile": $.name,
            onClick: (P) => U("profiles", $.name)
          }, {
            default: w(() => [
              b(p($.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          y(i(Re), null, {
            default: w(() => [...I[4] || (I[4] = [
              b("Program", -1)
            ])]),
            _: 1
          }),
          (n(!0), s(D, null, ne(i(E), ($) => (n(), N(i(Se), {
            key: $.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.programs.includes($.name),
            checked: T.value.programs.includes($.name),
            "data-filter-program": $.name,
            onClick: (P) => U("programs", $.name)
          }, {
            default: w(() => [
              b(p($.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          J.value ? (n(), N(i(Se), {
            key: 1,
            "data-filter-clear": "",
            onClick: Q
          }, {
            default: w(() => [...I[5] || (I[5] = [
              b("Clear filters", -1)
            ])]),
            _: 1
          })) : f("", !0)
        ]),
        default: w(() => [
          y(i(wt), {
            options: B.value.states,
            value: z.value,
            onPick: I[0] || (I[0] = ($) => z.value = $)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      z.value === "retired" && B.value.upgrade_retired ? (n(), s("p", Sn, "Retired during the upgrade: " + p(B.value.upgrade_retired), 1)) : f("", !0),
      A("div", {
        ref_key: "list",
        ref: ie,
        class: se(["agents-view", { "agents-view-open": _.value }])
      }, [
        i(S) && !i(k) && !be.value.length && J.value ? (n(), N(i(Oe), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: w(() => [
            y(i(re), {
              small: "",
              "data-empty-clear": "",
              onClick: Q
            }, {
              default: w(() => [...I[6] || (I[6] = [
                b("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (n(), N(i(Mt), {
          key: 1,
          moves: "",
          "leaves-at-once": Y.value,
          rows: be.value,
          failure: i(k),
          loaded: i(S),
          more: !_.value && i(C),
          older: u,
          empty: m.value.title,
          hint: m.value.hint,
          searching: ke.value
        }, {
          default: w(({ row: $ }) => [
            A("div", {
              class: se(["agent-row", { lingering: g.value.has($.id) && $.id !== h.value }]),
              "data-agent-row": $.id,
              "data-agent-lingering": g.value.has($.id) ? "" : null
            }, [
              y($n, {
                row: $,
                facts: W($),
                progress: L($),
                "wait-reason": q($),
                open: $.id === h.value,
                onToggle: (P) => Ze($)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, Cn)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, Bn = /* @__PURE__ */ Z(jn, [["__scopeId", "data-v-fceb20c3"]]);
export {
  Bn as A
};
