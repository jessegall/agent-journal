/* @code-commandments-generated */
import { openBlock as t, createElementBlock as o, withModifiers as Y, unref as c, createTextVNode as m, toDisplayString as g, createVNode as k, createBlock as _, withCtx as C, Fragment as L, renderList as J, createElementVNode as p, createCommentVNode as f, computed as y, ref as O, watch as le, onUnmounted as pe, defineAsyncComponent as qe, createSlots as _e, resolveDynamicComponent as Fe, normalizeStyle as se, normalizeClass as X, renderSlot as ge, onMounted as De, Teleport as Pe, mergeProps as Ue, toRef as $e, withKeys as Re, withDirectives as Ke, vShow as Je, nextTick as ze } from "vue";
import { peekRef as ve, Icon as ue, RunningCommand as Ze, FoldGroup as Le, TaskStatusIcon as Ge, useWindow as he, loadWindowComponent as Ye, coalesced as Qe, READ_RATES as Xe, InnerTabs as et, TabBody as tt, SwitchCase as Be, EmptyState as Se, Btn as te, TextArea as at, TextInput as Ae, useNow as nt, age as lt, perHour as st, TimeAgo as ye, SearchBar as ot, Segmented as it, MenuLabel as Ce, MenuItem as be, RowList as rt, toggleFilter as dt } from "@journal/window-kit";
import { _ as Z, T as ut } from "./TranscriptRows-DfA-cZXn.js";
const ct = {
  class: "agent-command",
  "data-agent-command": ""
}, pt = {
  key: 1,
  "data-agent-stopped": ""
}, gt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (r, s) => (t(), o("span", ct, [
      e.waitReason ? (t(), o("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: s[0] || (s[0] = Y((a) => c(ve)("test_queue:0"), ["stop"]))
      }, [
        m("Waiting: " + g(e.waitReason) + " ", 1),
        k(c(ue), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (t(), o("span", pt, "Waiting")) : (t(), _(c(Ze), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, vt = /* @__PURE__ */ Z(gt, [["__scopeId", "data-v-1b371fb5"]]), ht = ["data-agent-delegated", "onClick"], mt = { class: "agent-task-number" }, ft = { class: "agent-task-title" }, kt = ["title"], yt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: r }) {
    const s = r;
    return (a, h) => (t(), _(c(Le), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: h[0] || (h[0] = (b) => s("toggle"))
    }, {
      default: C(() => [
        (t(!0), o(L, null, J(e.section.tasks, (b) => (t(), o("button", {
          key: b.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": b.id,
          onClick: ($) => c(ve)(`tasks:${b.id}`)
        }, [
          k(c(Ge), {
            status: b.state
          }, null, 8, ["status"]),
          p("span", mt, g(b.id), 1),
          p("span", ft, g(b.title), 1),
          b.plan_id ? (t(), o("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${b.plan_id}: ${b.plan_title}`
          }, "Plan " + g(b.plan_id) + ": " + g(b.plan_title), 9, kt)) : f("", !0)
        ], 8, ht))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, bt = /* @__PURE__ */ Z(yt, [["__scopeId", "data-v-238ff959"]]), wt = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Mt = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, xt = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, $t = ["data-peek", "onClick"], Ct = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, St = {
  key: 0,
  class: "agent-helper-brief"
}, At = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, jt = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Tt = "It ended without a report", Rt = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const r = e, s = ["started", "blocked", "open", "completed"], a = y(() => {
      var n, u;
      return r.row.ended_at && ((u = (n = r.facts) == null ? void 0 : n.job_returned) != null && u.startsWith(Tt)) ? r.facts.job_returned : "";
    }), h = y(() => r.tasks.length ? s.map((n) => ({ state: n, label: n.slice(0, 1).toUpperCase() + n.slice(1), tasks: r.tasks.filter((u) => u.state === n || n === "started" && u.state === "testing" || n === "completed" && u.state === "cancelled") })) : []), b = /* @__PURE__ */ new Set(["completed"]), $ = O({}), M = (n) => !($.value[n] ?? b.has(n)), S = (n) => $.value = { ...$.value, [n]: M(n) }, T = he(), { rows: H } = T.props.reports;
    T.state["reports.agent"] = String(r.row.id);
    const I = y(() => r.row.access === "read-only"), R = y(() => !!r.row.retired_at || r.row.state === "retired"), q = ["tasks", "transcript", "terminal", "file-feed", "reports"], A = y(() => (R.value ? T.tabs.filter((u) => ["reports", "transcript"].includes(u.key)) : I.value ? T.tabs.filter((u) => ["reports", "transcript", "terminal"].includes(u.key)) : [...T.tabs]).sort((u, z) => (q.indexOf(u.key) < 0 ? q.length : q.indexOf(u.key)) - (q.indexOf(z.key) < 0 ? q.length : q.indexOf(z.key)))), B = () => I.value || R.value ? A.value.find((n) => n.key === "transcript") : A.value[0], E = O(B());
    le(E, (n) => {
      T.state.tab = (n == null ? void 0 : n.key) ?? "";
    }, { immediate: !0 }), pe(() => {
      T.state.tab = "";
    }), le(A, (n) => {
      n.some((u) => {
        var z;
        return u.key === ((z = E.value) == null ? void 0 : z.key);
      }) || (E.value = n[0]);
    }), le(() => r.open, (n) => {
      n && (E.value = B());
    });
    const D = Object.fromEntries(T.tabs.filter((n) => n.component).map((n) => [n.key, qe(() => Ye(n.component))])), N = O(!1), { data: P } = T.props.tool, U = y(() => {
      var n;
      return ((n = P.value) == null ? void 0 : n.tool) ?? "";
    }), d = y(() => {
      var n;
      return ((n = P.value) == null ? void 0 : n.note) ?? "";
    }), l = y(() => r.row.role !== "main" && (!r.row.ended_at || r.stoppedWithWork || r.waitReason));
    async function i() {
      !r.open || !l.value || (T.state["tool.agent"] = String(r.row.id), await T.reload("tool"));
    }
    const x = T.follow(["hook_call.*", "process_part.*"], Qe(i, Xe.agentCommand));
    return pe(() => x == null ? void 0 : x()), le(() => r.open, (n) => {
      n && i();
    }, { immediate: !0 }), (n, u) => {
      var z;
      return t(), o("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: u[2] || (u[2] = Y(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (t(), o("p", wt, "Retirement reason: " + g(e.row.retirement_reason), 1)) : f("", !0),
        e.row.resume_reason ? (t(), o("p", Mt, g(e.row.resume_reason), 1)) : f("", !0),
        l.value ? (t(), _(vt, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: U.value,
          note: d.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : f("", !0),
        a.value ? (t(), o("p", xt, g(a.value), 1)) : f("", !0),
        k(c(et), {
          class: "agent-tabs",
          tabs: A.value,
          active: E.value,
          answer: { tasks: e.tasks.length, reports: c(H).length },
          onChoose: u[0] || (u[0] = (v) => E.value = v)
        }, null, 8, ["tabs", "active", "answer"]),
        k(c(tt), {
          class: "agent-tab-body",
          tab: E.value,
          "data-agent-tab-body": (z = E.value) == null ? void 0 : z.key
        }, {
          default: C(() => {
            var v;
            return [
              k(c(Be), {
                value: (v = E.value) == null ? void 0 : v.key
              }, _e({
                reports: C(() => [
                  c(H).length ? f("", !0) : (t(), _(c(Se), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: C(() => [...u[3] || (u[3] = [
                      m("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (t(!0), o(L, null, J(c(H), (w) => (t(), o("button", {
                    key: w.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${w.id}`,
                    onClick: (V) => c(ve)(`messages:${w.id}`)
                  }, g(w.text), 9, $t))), 128))
                ]),
                tasks: C(() => {
                  var w;
                  return [
                    e.tasks.length ? f("", !0) : (t(), _(c(Se), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: C(() => [...u[4] || (u[4] = [
                        m("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (t(!0), o(L, null, J(h.value, (V) => (t(), _(bt, {
                      key: V.state,
                      section: V,
                      open: M(V.state),
                      onToggle: (Q) => S(V.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (w = e.facts) != null && w.instruction ? (t(), o(L, { key: 1 }, [
                      u[5] || (u[5] = p("p", { class: "agent-label" }, "Instruction", -1)),
                      p("div", Ct, g(e.facts.instruction), 1)
                    ], 64)) : f("", !0)
                  ];
                }),
                transcript: C(() => {
                  var w;
                  return [
                    I.value ? (t(), o(L, { key: 0 }, [
                      (w = e.facts) != null && w.instruction ? (t(), o("div", St, [
                        k(c(Le), {
                          label: "Instruction",
                          open: N.value,
                          "data-agent-section": "instruction",
                          onToggle: u[1] || (u[1] = (V) => N.value = !N.value)
                        }, {
                          default: C(() => [
                            p("div", At, g(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (t(), o("p", jt, "No job recorded")) : f("", !0)
                    ], 64)) : f("", !0),
                    k(ut, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                J(c(D), (w, V) => ({
                  name: V,
                  fn: C(() => [
                    (t(), _(Fe(w), {
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
}, zt = /* @__PURE__ */ Z(Rt, [["__scopeId", "data-v-71b8d2b0"]]), Vt = { class: "action-field" }, Ot = ["value", "disabled"], Lt = ["value"], Bt = { key: 1 }, Ht = {
  key: 1,
  class: "action-field"
}, It = { class: "action-buttons" }, Et = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (r, s) => (t(), o("form", {
      onSubmit: s[4] || (s[4] = Y((a) => r.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (t(), o(L, { key: 0 }, [
        p("label", Vt, [
          s[6] || (s[6] = m("Task ", -1)),
          p("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: s[0] || (s[0] = (a) => r.$emit("update:task", a.target.value))
          }, [
            s[5] || (s[5] = p("option", { value: "" }, "Choose an open task", -1)),
            (t(!0), o(L, null, J(e.tasks, (a) => (t(), o("option", {
              key: a.id,
              value: String(a.id)
            }, g(a.id) + ": " + g(a.title), 9, Lt))), 128))
          ], 40, Ot)
        ]),
        e.moreTasks ? (t(), _(c(te), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: s[1] || (s[1] = (a) => r.$emit("more"))
        }, {
          default: C(() => [...s[7] || (s[7] = [
            m("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : f("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (t(), o("p", Bt, "No open tasks.")) : f("", !0)
      ], 64)) : (t(), o("label", Ht, [
        s[8] || (s[8] = m("Job", -1)),
        k(c(at), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: s[2] || (s[2] = (a) => r.$emit("update:text", a.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      p("div", It, [
        k(c(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: C(() => [...s[9] || (s[9] = [
            m("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        k(c(te), {
          small: "",
          disabled: e.pending,
          onClick: s[3] || (s[3] = (a) => r.$emit("cancel"))
        }, {
          default: C(() => [...s[10] || (s[10] = [
            m("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Nt = /* @__PURE__ */ Z(Et, [["__scopeId", "data-v-adde4158"]]), Wt = { class: "action-buttons" }, qt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (r, s) => (t(), o("form", {
      "data-agent-retire-confirm": "",
      onSubmit: s[2] || (s[2] = Y((a) => r.$emit("submit"), ["prevent"]))
    }, [
      s[5] || (s[5] = p("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      k(c(Ae), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": s[0] || (s[0] = (a) => r.$emit("update:reason", a))
      }, null, 8, ["model-value", "disabled"]),
      p("div", Wt, [
        k(c(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: C(() => [...s[3] || (s[3] = [
            m("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        k(c(te), {
          small: "",
          disabled: e.pending,
          onClick: s[1] || (s[1] = (a) => r.$emit("cancel"))
        }, {
          default: C(() => [...s[4] || (s[4] = [
            m("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, _t = /* @__PURE__ */ Z(qt, [["__scopeId", "data-v-23a905c0"]]), Ft = { class: "action-buttons" }, Dt = {
  key: 0,
  role: "alert"
}, Pt = {
  key: 1,
  role: "status"
}, Ut = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const r = e, s = he(), a = O(""), h = O(""), b = O(""), $ = O(""), M = O([]), S = O(0), T = O(!1), H = O(!1), I = O(!1), R = O(""), q = O(""), A = y(() => !!r.row.retired_at || r.row.state === "retired"), B = y(() => !A.value && !!r.row.ended_at), E = y(() => {
      var x;
      return B.value && ((x = r.row.job_command) == null ? void 0 : x.length) && !r.row.resume_reason;
    }), D = y(() => E.value && !H.value && (r.row.job_task_flag ? M.value.some((x) => String(x.id) === $.value) : !!h.value.trim()));
    function N(x) {
      a.value = x, h.value = "", b.value = "", $.value = "", R.value = "", q.value = "";
    }
    async function P() {
      N("job"), r.row.job_task_flag && (M.value = [], S.value = 0, T.value = !1, await U());
    }
    async function U() {
      if (!H.value) {
        H.value = !0;
        try {
          s.state["jobs.page"] = String(S.value + 1), await s.reload("jobs");
          const x = s.props.jobs;
          R.value = x.failure.value, R.value || (M.value = [...M.value, ...x.rows.value], S.value = x.data.value.page, T.value = x.more.value);
        } finally {
          H.value = !1;
        }
      }
    }
    async function d(x, n) {
      if (!I.value) {
        I.value = !0, R.value = "";
        try {
          const u = await s.run(x);
          R.value = u.ok ? "" : u.error, u.ok && (N(""), q.value = n);
        } finally {
          I.value = !1;
        }
      }
    }
    async function l() {
      if (!D.value) return;
      const x = r.row.job_task_flag ? [r.row.job_task_flag, $.value] : [h.value.trim()];
      await d([...r.row.job_command, String(r.row.id), ...x], "Job sent.");
    }
    async function i() {
      !B.value || a.value !== "retire" || !b.value.trim() || await d(["agent", "retire", String(r.row.id), "--reason", b.value.trim()], "Agent retired permanently.");
    }
    return (x, n) => {
      var u;
      return A.value ? f("", !0) : (t(), o("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: n[6] || (n[6] = Y(() => {
        }, ["stop"])),
        onKeydown: n[7] || (n[7] = Y(() => {
        }, ["stop"]))
      }, [
        p("div", Ft, [
          B.value ? (t(), o(L, { key: 0 }, [
            (u = e.row.job_command) != null && u.length ? (t(), _(c(te), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: I.value || H.value || !E.value,
              onClick: P
            }, {
              default: C(() => [...n[8] || (n[8] = [
                m("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0),
            e.row.role !== "main" ? (t(), _(c(te), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: I.value || H.value,
              onClick: n[0] || (n[0] = (z) => N("retire"))
            }, {
              default: C(() => [...n[9] || (n[9] = [
                m("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0)
          ], 64)) : f("", !0)
        ]),
        k(c(Be), { value: a.value }, {
          job: C(() => [
            k(Nt, {
              task: $.value,
              "onUpdate:task": n[1] || (n[1] = (z) => $.value = z),
              text: h.value,
              "onUpdate:text": n[2] || (n[2] = (z) => h.value = z),
              row: e.row,
              tasks: M.value,
              pending: I.value,
              loading: H.value,
              "more-tasks": T.value,
              failure: R.value,
              "job-ready": D.value,
              onSubmit: l,
              onMore: U,
              onCancel: n[3] || (n[3] = (z) => N(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: C(() => [
            k(_t, {
              reason: b.value,
              "onUpdate:reason": n[4] || (n[4] = (z) => b.value = z),
              pending: I.value,
              onSubmit: i,
              onCancel: n[5] || (n[5] = (z) => N(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        R.value ? (t(), o("p", Dt, g(R.value), 1)) : f("", !0),
        q.value ? (t(), o("p", Pt, g(q.value), 1)) : f("", !0)
      ], 32));
    };
  }
}, Kt = /* @__PURE__ */ Z(Ut, [["__scopeId", "data-v-4cb32275"]]), Jt = {
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
    return (r, s) => (t(), o("span", Jt, [
      e.rate ? (t(), o("span", Zt, g(e.rate), 1)) : f("", !0),
      p("span", Gt, g(e.count), 1)
    ]));
  }
}, Ve = /* @__PURE__ */ Z(Yt, [["__scopeId", "data-v-44694015"]]), Qt = ["data-icon", "stroke-width", "innerHTML"], G = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const r = e, s = { right: 0, down: 90, left: 180, up: 270 }, a = {
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
    }, h = {
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
    return (b, $) => (t(), o("svg", {
      class: "ico",
      "data-icon": e.name,
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
      innerHTML: h[a[e.name] || e.name] || h.dot
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
    return (r, s) => (t(), o("button", {
      type: "button",
      class: X(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (t(), o("span", Xt, g(e.checked ? "✓" : ""), 1)) : f("", !0),
      e.description ? (t(), o("span", ea, [
        p("span", null, [
          ge(r.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, g(e.description), 1)
      ])) : ge(r.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, de = /* @__PURE__ */ Z(ta, [["__scopeId", "data-v-fec99974"]]), aa = {}, na = { class: "menu-label" };
function la(e, r) {
  return t(), o("span", na, [
    ge(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ce = /* @__PURE__ */ Z(aa, [["render", la], ["__scopeId", "data-v-aa955b3e"]]), sa = {
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
    const s = e, a = r, h = y(() => s.skills.filter(($) => $.state === "loaded")), b = y(() => s.skills.filter(($) => $.state !== "loaded"));
    return ($, M) => (t(), o("div", sa, [
      k(ce, null, {
        default: C(() => [...M[1] || (M[1] = [
          m("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      h.value.length ? f("", !0) : (t(), o("p", oa, "None yet. Compacting the conversation empties this list.")),
      (t(!0), o(L, null, J(h.value, (S) => (t(), o("p", {
        key: S.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        k(G, {
          name: "book",
          size: 12
        }),
        m(g(S.skill), 1)
      ]))), 128)),
      b.value.length ? (t(), o(L, { key: 1 }, [
        k(ce, null, {
          default: C(() => [...M[2] || (M[2] = [
            m("Still to read", -1)
          ])]),
          _: 1
        }),
        (t(!0), o(L, null, J(b.value, (S) => (t(), o("p", {
          key: S.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          k(G, {
            name: "book",
            size: 12
          }),
          m(g(S.skill), 1)
        ]))), 128))
      ], 64)) : f("", !0),
      k(de, {
        "data-agent-skills-browse": "",
        onClick: M[0] || (M[0] = (S) => a("browse"))
      }, {
        default: C(() => [...M[3] || (M[3] = [
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
function pa(e, r) {
  const s = (a) => {
    var b, $;
    const h = ((b = e.value) == null ? void 0 : b.element) || (($ = e.value) == null ? void 0 : $.$el) || e.value;
    h && !ca(h, a.target) && r(a);
  };
  window.addEventListener("click", s), pe(() => window.removeEventListener("click", s));
}
const re = 8, ga = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, h = O(null), b = (v) => v ? `${v}px` : void 0, $ = y(() => ({
      minWidth: b(a.minWidth),
      maxWidth: b(a.maxWidth),
      maxHeight: b(a.maxHeight),
      height: b(a.height)
    })), M = O({ w: 0, h: 0 }), S = O(a.anchor ? a.anchor.getBoundingClientRect() : null), T = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), H = (v) => ({
      left: Math.max(0, v.left),
      top: Math.max(0, v.top),
      right: Math.min(window.innerWidth, v.right),
      bottom: Math.min(window.innerHeight, v.bottom)
    }), I = (v) => {
      const w = v.closest(".pane, .float-window");
      return w ? H(w.getBoundingClientRect()) : T();
    }, R = (v, w) => `${Math.max(0, v ? Math.min(v, w) : w)}px`;
    function q(v, w) {
      return {
        below: v.bottom - w.bottom - a.gap - re,
        above: w.top - v.top - a.gap - re,
        across: v.right - v.left - 2 * re
      };
    }
    function A(v) {
      const w = I(a.anchor), V = q(w, v);
      return M.value.w <= V.across && M.value.h <= Math.max(V.below, V.above) ? w : T();
    }
    const B = y(() => {
      if (!S.value) return $.value;
      const v = S.value, w = A(v), V = q(w, v), { w: Q, h: me } = M.value, oe = a.align === "auto" ? v.left + v.right > w.left + w.right : a.align === "right", ae = da(oe ? v.right - Q : v.left, w.left + re, Math.max(w.left + re, w.right - Q - re)), xe = me > V.below && V.above > V.below ? { bottom: `${window.innerHeight - v.top + a.gap}px`, maxHeight: R(a.maxHeight, V.above) } : { top: `${v.bottom + a.gap}px`, maxHeight: R(a.maxHeight, V.below) };
      return { ...$.value, ...xe, left: `${ae}px`, maxWidth: R(a.maxWidth, V.across) };
    }), E = s, D = () => [...h.value.querySelectorAll("button:not(:disabled)")];
    function N(v) {
      const w = D(), V = w.indexOf(document.activeElement);
      w[(V + v + w.length) % w.length].focus();
    }
    const P = { ArrowDown: () => N(1), ArrowUp: () => N(-1), Escape: () => E("close") }, U = (v) => P[v.key] && (v.preventDefault(), P[v.key]()), d = () => h.value && (M.value = { w: h.value.offsetWidth, h: h.value.scrollHeight });
    let l = 0;
    const i = new ResizeObserver(() => {
      cancelAnimationFrame(l), l = requestAnimationFrame(d);
    });
    pa(h, (v) => a.anchor && !a.anchor.contains(v.target) && E("close"));
    const x = (v, w) => ["top", "left", "right", "bottom"].some((V) => Math.abs(v[V] - w[V]) > 1), n = (v) => v.bottom < 0 || v.top > window.innerHeight;
    let u = 0;
    function z() {
      if (a.anchor) {
        const v = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || n(v)) return E("close");
        x(v, S.value) && (S.value = v);
      }
      u = requestAnimationFrame(z);
    }
    return De(() => {
      a.anchor && h.value && ua(h.value, a.anchor), d(), h.value && i.observe(h.value), !a.plain && D()[0] && D()[0].focus(), z();
    }), pe(() => {
      i.disconnect(), cancelAnimationFrame(u), cancelAnimationFrame(l);
    }), r({ element: h }), (v, w) => (t(), _(Pe, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", Ue({
        ref_key: "panel",
        ref: h
      }, v.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: B.value,
        onKeydown: U
      }), [
        ge(v.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), va = /* @__PURE__ */ Z(ga, [["__scopeId", "data-v-3d203970"]]);
async function ha(e, r, s) {
  if (!e) return s(r);
  const { target: a, fields: h } = e, b = Object.fromEntries(Object.keys(h).map((S) => [S, a[S]])), $ = () => Object.assign(a, b);
  Object.assign(a, h);
  let M = !1;
  try {
    const S = await s(r);
    return M = S.ok, S;
  } finally {
    M || $();
  }
}
function ma(e, r, s, { groups: a, programs: h }) {
  const b = O({}), $ = O(""), M = O(!1), S = y(() => !!e.value && !e.value.ended_at), T = y(() => S.value && !!e.value.paused_at);
  async function H(A, B = null) {
    $.value = "";
    const E = await ha(B, A, r);
    return $.value = E.ok ? "" : E.error, s(), E;
  }
  return { groups: a, programs: h, chosen: b, failure: $, asking: M, running: S, paused: T, choose: (A, B) => H(["agent", "control", String(e.value.id), A, B.value], { target: b, fields: { value: { ...b.value, [A]: B.label } } }), stop: () => (M.value = !1, H(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (A) => H(["agent", "launch", A.name]) };
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
const ya = ["disabled", "title"], ba = ["title"], wa = { class: "gauge usage" }, Ma = ["disabled", "title"], xa = { class: "gauge" }, $a = ["disabled", "title"], Ca = ["disabled"], Sa = ["disabled"], Aa = {
  key: 5,
  class: "fact",
  "data-fact": "uptime",
  title: "How long this session has run"
}, ja = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Ta = ["title"], Ra = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, za = { class: "gauge" }, Va = { class: "context-used" }, Oa = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, La = 75, Ba = {
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
  setup(e, { emit: r }) {
    const s = e, a = r, h = ma($e(s, "agent"), s.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: $e(s, "controlGroups"), programs: $e(s, "agentPrograms") }), b = O(null), $ = O(""), M = y(() => h.groups.value.find((d) => d.key === $.value));
    function S(d, l) {
      b.value = d.currentTarget, $.value = l;
    }
    function T() {
      b.value = null, $.value = "", h.asking.value = !1;
    }
    const H = y(() => s.skills.filter((d) => d.state === "loaded"));
    function I(d) {
      S(d, "skills"), a("skills");
    }
    const R = (d) => h.groups.value.some((l) => l.key === d), q = y(() => {
      var d;
      return h.chosen.value.model ?? ((d = B.value) == null ? void 0 : d.model) ?? "";
    }), A = y(() => {
      var d;
      return h.chosen.value.effort ?? ((d = B.value) == null ? void 0 : d.effort) ?? "";
    });
    y(() => !!s.agent && !s.agent.ended_at);
    const B = y(() => {
      var d;
      return ((d = s.usage.agents) == null ? void 0 : d.find((l) => {
        var i;
        return l.id === ((i = s.agent) == null ? void 0 : i.id);
      })) ?? null;
    }), E = y(() => {
      var d;
      return ((d = s.usage.windows) == null ? void 0 : d[0]) ?? null;
    }), D = y(() => E.value ? Math.max(0, Math.min(100, Math.round(E.value.used_percent))) : null), N = y(() => {
      var d;
      return ((d = B.value) == null ? void 0 : d.context_percent) == null ? null : Math.round(B.value.context_percent);
    }), P = y(() => {
      var d;
      return (d = B.value) != null && d.cost_dollars ? `$${B.value.cost_dollars.toFixed(2)}` : "";
    }), U = y(() => {
      var i;
      const d = (i = s.agent) != null && i.process_started_at ? new Date(s.agent.process_started_at).getTime() : 0;
      if (!d) return "";
      const l = Math.max(0, Math.floor((s.now - d) / 6e4));
      return l >= 60 ? `${Math.floor(l / 60)}h ${l % 60}m` : `${l}m`;
    });
    return (d, l) => (t(), o("div", {
      class: X(["information", { card: e.card }]),
      "data-information-bar": ""
    }, [
      e.agent ? (t(), o(L, { key: 0 }, [
        p("button", {
          type: "button",
          class: "fact lead",
          disabled: e.card,
          "data-fact": "agent",
          title: `Session ${e.agent.session}: stop it`,
          onClick: l[0] || (l[0] = (i) => S(i, "agent"))
        }, [
          k(G, {
            name: "agents",
            size: 12
          }),
          m(" " + g(c(fa)(e.agent.program)), 1)
        ], 8, ya),
        D.value !== null ? (t(), o("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${D.value}% of the plan's ${E.value.title} allowance used`,
          onClick: l[1] || (l[1] = (i) => a("open", "usage", i.currentTarget))
        }, [
          k(G, {
            name: "allowance",
            size: 12
          }),
          l[14] || (l[14] = m()),
          p("span", wa, [
            p("span", {
              style: se({ width: `${D.value}%` })
            }, null, 4)
          ]),
          m(" " + g(D.value) + "% ", 1)
        ], 8, ba)) : f("", !0),
        N.value !== null ? (t(), o("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "context",
          title: `Context ${N.value}% full: clear or compact it`,
          onClick: l[2] || (l[2] = (i) => R("context") ? S(i, "context") : a("open", "context", i.currentTarget))
        }, [
          k(G, {
            name: "gauge",
            size: 12
          }),
          l[15] || (l[15] = m()),
          p("span", xa, [
            p("span", {
              style: se({ width: `${N.value}%` })
            }, null, 4)
          ]),
          m(" " + g(N.value) + "% ", 1)
        ], 8, Ma)) : f("", !0),
        q.value ? (t(), o("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "model",
          title: `${q.value}: change the model`,
          onClick: l[3] || (l[3] = (i) => R("model") ? S(i, "model") : null)
        }, [
          k(G, {
            name: "model",
            size: 12
          }),
          m(" " + g(q.value), 1)
        ], 8, $a)) : f("", !0),
        R("effort") || e.card && A.value ? (t(), o("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: l[4] || (l[4] = (i) => S(i, "effort"))
        }, [
          k(G, {
            name: "bolt",
            size: 12
          }),
          m(" " + g(A.value), 1)
        ], 8, Ca)) : f("", !0),
        P.value ? (t(), o("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: l[5] || (l[5] = (i) => a("open", "cost", i.currentTarget))
        }, g(P.value), 9, Sa)) : f("", !0),
        U.value ? (t(), o("span", Aa, [
          k(G, {
            name: "reminders",
            size: 12
          }),
          m(" " + g(U.value), 1)
        ])) : f("", !0),
        e.branch ? (t(), o("span", ja, [
          k(G, {
            name: "branch",
            size: 12
          }),
          m(" " + g(e.branch), 1)
        ])) : f("", !0),
        e.card ? f("", !0) : (t(), o("button", {
          key: 7,
          type: "button",
          class: X(["fact", { none: !e.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: l[6] || (l[6] = (i) => a("open", "jobs", i.currentTarget))
        }, [
          k(G, {
            name: "clock",
            size: 12
          }),
          m(" " + g(e.jobs), 1)
        ], 2)),
        e.run ? (t(), o("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: I
        }, [
          k(G, {
            name: "book",
            size: 12
          }),
          m(" " + g(H.value.length), 1)
        ])) : f("", !0),
        e.fitness ? (t(), o(L, { key: 9 }, [
          p("button", {
            type: "button",
            class: X(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < La }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: l[7] || (l[7] = (i) => a("open", "fitness", i.currentTarget))
          }, [
            k(G, {
              name: "heart",
              size: 12
            }),
            m(" " + g(e.fitness.is_measured ? e.fitness.score : "–"), 1)
          ], 2),
          p("button", {
            type: "button",
            class: X(["fact", "load-fact", e.fitness.workload_level]),
            "data-fact": "load",
            title: "Compare incoming messages with agent replies",
            onClick: l[8] || (l[8] = (i) => a("open", "load", i.currentTarget))
          }, [
            k(G, {
              name: "weight",
              size: 12
            }),
            m(" " + g(e.fitness.workload), 1)
          ], 2)
        ], 64)) : f("", !0)
      ], 64)) : e.run && !e.loading ? (t(), o("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: l[9] || (l[9] = (i) => S(i, "start"))
      }, [
        k(G, {
          name: "agents",
          size: 12
        }),
        l[16] || (l[16] = m(" Start an agent", -1))
      ])) : f("", !0),
      l[22] || (l[22] = p("span", { class: "space" }, null, -1)),
      c(h).failure.value ? (t(), o("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: c(h).failure.value
      }, g(c(h).failure.value), 9, Ta)) : f("", !0),
      ge(d.$slots, "default", {}, void 0, !0),
      b.value ? (t(), _(va, {
        key: 3,
        anchor: b.value,
        "min-width": 190,
        onClose: T
      }, {
        default: C(() => {
          var i;
          return [
            $.value === "agent" ? (t(), o(L, { key: 0 }, [
              c(h).asking.value ? (t(), o(L, { key: 0 }, [
                k(ce, { "data-agent-stop-ask": "" }, {
                  default: C(() => [...l[17] || (l[17] = [
                    m("Stop the agent? It stops what it is doing.", -1)
                  ])]),
                  _: 1
                }),
                k(de, {
                  "data-agent-stop-confirm": "",
                  onClick: l[10] || (l[10] = (x) => (T(), c(h).stop()))
                }, {
                  default: C(() => [...l[18] || (l[18] = [
                    m("Stop it", -1)
                  ])]),
                  _: 1
                }),
                k(de, {
                  onClick: l[11] || (l[11] = (x) => c(h).asking.value = !1)
                }, {
                  default: C(() => [...l[19] || (l[19] = [
                    m("Keep it running", -1)
                  ])]),
                  _: 1
                })
              ], 64)) : (t(), _(de, {
                key: 1,
                "data-agent-stop": "",
                onClick: l[12] || (l[12] = (x) => c(h).asking.value = !0)
              }, {
                default: C(() => [...l[20] || (l[20] = [
                  m("Stop", -1)
                ])]),
                _: 1
              }))
            ], 64)) : $.value === "start" ? (t(), o(L, { key: 1 }, [
              k(ce, null, {
                default: C(() => [...l[21] || (l[21] = [
                  m("Start an agent", -1)
                ])]),
                _: 1
              }),
              (t(!0), o(L, null, J(c(h).programs.value, (x) => (t(), _(de, {
                key: x.name,
                "data-agent-program": x.name,
                onClick: (n) => (T(), c(h).start(x))
              }, {
                default: C(() => [
                  m(g(x.title), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-program", "onClick"]))), 128))
            ], 64)) : $.value === "skills" ? (t(), _(ra, {
              key: 2,
              skills: e.skills,
              onBrowse: l[13] || (l[13] = (x) => (T(), a("open", "skills", null)))
            }, null, 8, ["skills"])) : M.value ? (t(), o(L, { key: 3 }, [
              k(ce, null, {
                default: C(() => [
                  m(g(M.value.label), 1)
                ]),
                _: 1
              }),
              $.value === "context" ? (t(), o(L, { key: 0 }, [
                p("div", Ra, [
                  p("span", za, [
                    p("span", {
                      style: se({ width: `${N.value}%` })
                    }, null, 4)
                  ]),
                  p("span", Va, g(N.value) + "%", 1)
                ]),
                p("p", Oa, g(c(ka)(((i = B.value) == null ? void 0 : i.last_compaction) ?? null)), 1)
              ], 64)) : f("", !0),
              (t(!0), o(L, null, J(M.value.choices, (x) => (t(), _(de, {
                key: x.value,
                "data-agent-choice": x.value,
                onClick: (n) => (c(h).choose(M.value.key, x), T())
              }, {
                default: C(() => [
                  m(g(x.label), 1)
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
}, Ha = /* @__PURE__ */ Z(Ba, [["__scopeId", "data-v-5e1b4ab2"]]), Ia = ["data-agent-open", "aria-expanded", "role", "tabindex"], Ea = { class: "agent-head" }, Na = ["data-state"], Wa = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, qa = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, _a = { class: "agent-times" }, Fa = {
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
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, Za = {
  key: 1,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Ga = {
  key: 1,
  class: "agent-line"
}, Ya = {
  key: 2,
  class: "agent-line agent-work-start"
}, Qa = ["data-peek"], Xa = ["title"], en = ["data-peek"], tn = ["data-agent-waiting", "data-agent-stopped"], an = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: r }) {
    const s = { helper: "Helper", reviewer: "Reviewer" }, a = e, h = r, b = nt(), $ = y(() => {
      var u, z;
      if ((u = a.facts) != null && u.profile_title) return a.facts.profile_title;
      if ((z = a.facts) != null && z.profile) return a.facts.profile;
      const n = s[a.row.role] || a.row.role;
      return n.slice(0, 1).toUpperCase() + n.slice(1);
    }), M = y(() => {
      var n;
      return ((n = a.facts) == null ? void 0 : n.tasks) ?? [];
    }), S = y(() => M.value.filter((n) => n.state === "open")), T = y(() => {
      const n = M.value.find((u) => {
        var z;
        return u.id === ((z = a.facts) == null ? void 0 : z.task_id);
      });
      return n != null && n.plan_id ? n : S.value.find((u) => u.plan_id);
    }), H = y(() => {
      var n, u, z, v, w;
      return a.row.role === "helper" ? ((n = a.facts) == null ? void 0 : n.helper_job) || "" : (u = a.facts) != null && u.job_enabled && (((z = a.facts) == null ? void 0 : z.task_title) || ((v = S.value[0]) == null ? void 0 : v.title) || ((w = M.value.at(-1)) == null ? void 0 : w.title)) || "";
    }), I = y(() => {
      const n = H.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return n ? `${n[1].toLowerCase() === "plan" ? "plans" : "docs"}:${n[2]}` : "";
    }), R = y(() => {
      var n;
      return (n = a.facts) != null && n.job_enabled ? `${a.row.role} ${a.row.id}` : "";
    }), q = y(() => {
      var n, u;
      return [a.row.program, (n = a.facts) == null ? void 0 : n.model, (u = a.facts) == null ? void 0 : u.effort, R.value].filter(Boolean).join(" · ");
    }), A = he(), B = y(() => lt(a.row.process_started_at || a.row.created_at, b.value)), E = /* @__PURE__ */ new Set(["open", "started", "testing"]), D = y(() => !!a.row.ended_at && a.row.role !== "main" && M.value.some((n) => E.has(n.state))), N = y(() => {
      var n;
      return a.row.retired_at || a.row.state === "retired" ? "retired" : a.waitReason || D.value ? "waiting" : a.row.state === "running" && ((n = a.facts) == null ? void 0 : n.state) || a.row.state;
    }), P = y(() => {
      var n;
      return a.waitReason ? `Waiting: ${a.waitReason}` : N.value === "blocked" ? (n = a.facts) != null && n.blocked_reason ? `Blocked: ${a.facts.blocked_reason}` : "Blocked" : D.value ? "Stopped with work left" : "";
    }), U = y(() => {
      var n;
      return ((n = a.progress) == null ? void 0 : n.completed_count) ?? M.value.filter((u) => u.state === "completed").length;
    }), d = y(() => {
      var n;
      return ((n = a.progress) == null ? void 0 : n.task_count) ?? M.value.length;
    }), l = y(() => `${U.value} of ${d.value} ${d.value === 1 ? "task" : "tasks"}`), i = y(() => {
      var u;
      const n = st(U.value, ((u = a.progress) == null ? void 0 : u.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, b.value);
      return a.row.role !== "main" && n ? `${n} per hour` : "";
    }), x = y(() => !!a.row.retired_at || a.row.state === "retired");
    return (n, u) => {
      var z, v, w;
      return t(), o("div", {
        class: X(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: u[4] || (u[4] = (V) => !e.open && h("toggle")),
        onKeydown: [
          u[5] || (u[5] = Re(Y((V) => !e.open && h("toggle"), ["self", "prevent"]), ["enter"])),
          u[6] || (u[6] = Re(Y((V) => !e.open && h("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        p("span", Ea, [
          e.open ? (t(), o("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: u[0] || (u[0] = Y((V) => h("toggle"), ["stop"]))
          }, [
            k(c(ue), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : f("", !0),
          p("span", {
            class: "agent-dot",
            "data-state": N.value,
            "data-agent-motion": ""
          }, null, 8, Na),
          p("span", Wa, g($.value), 1),
          p("span", qa, g(((z = e.facts) == null ? void 0 : z.given_name) || e.row.id), 1),
          e.open ? f("", !0) : (t(), _(c(ue), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          p("span", _a, [
            x.value ? (t(), o("span", Fa, [
              u[7] || (u[7] = m("Retired, ", -1)),
              k(c(ye), {
                at: e.row.retired_at
              }, null, 8, ["at"])
            ])) : e.row.ended_at ? (t(), o("span", Da, [
              u[8] || (u[8] = m("Idle, ", -1)),
              k(c(ye), {
                at: e.row.ended_at
              }, null, 8, ["at"])
            ])) : (t(), o("span", Pa, g(B.value), 1))
          ])
        ]),
        p("span", Ua, [
          p("span", Ka, g(q.value), 1),
          e.open ? (t(), o("span", Ja, [
            k(c(ue), {
              name: "time",
              size: 12
            }),
            u[9] || (u[9] = m("First dispatched: ", -1)),
            k(c(ye), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : f("", !0),
          e.open && ((v = e.facts) != null && v.last_activity) ? (t(), o("span", Za, [
            u[10] || (u[10] = m("Last heard: ", -1)),
            k(c(ye), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : f("", !0)
        ]),
        e.open ? (t(), _(Ha, {
          key: 0,
          agent: e.row,
          branch: (w = e.progress) == null ? void 0 : w.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: [] },
          card: ""
        }, {
          default: C(() => [
            k(Kt, { row: e.row }, null, 8, ["row"]),
            e.row.role === "helper" && !e.row.ended_at ? (t(), _(c(te), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: u[1] || (u[1] = Y((V) => c(A).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: C(() => [...u[11] || (u[11] = [
                m("Stop", -1)
              ])]),
              _: 1
            })) : f("", !0)
          ]),
          _: 1
        }, 8, ["agent", "branch", "usage"])) : f("", !0),
        e.open && d.value && !H.value ? (t(), o("span", Ga, [
          k(Ve, {
            count: l.value,
            rate: i.value
          }, null, 8, ["count", "rate"])
        ])) : f("", !0),
        e.open && T.value ? (t(), o("span", Ya, [
          p("button", {
            type: "button",
            class: "agent-plan",
            "data-agent-plan": "",
            "data-peek": `plans:${T.value.plan_id}`,
            onClick: u[2] || (u[2] = Y((V) => c(ve)(`plans:${T.value.plan_id}`), ["stop"]))
          }, "Plan " + g(T.value.plan_id) + ": " + g(T.value.plan_title), 9, Qa)
        ])) : f("", !0),
        H.value || !e.open && P.value ? (t(), o("span", {
          key: 3,
          class: X(["agent-line", { "agent-work-start": !T.value }])
        }, [
          p("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: H.value
          }, [
            e.open && I.value ? (t(), o("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": I.value,
              onClick: u[3] || (u[3] = Y((V) => c(ve)(I.value), ["stop"]))
            }, g(H.value), 9, en)) : (t(), o(L, { key: 1 }, [
              m(g(H.value), 1)
            ], 64))
          ], 8, Xa),
          !e.open && P.value ? (t(), o("span", {
            key: 0,
            class: "agent-work-status",
            "data-agent-waiting": e.waitReason ? "" : null,
            "data-agent-stopped": D.value && !e.waitReason ? "" : null
          }, g(P.value), 9, tn)) : f("", !0),
          e.open && d.value ? (t(), _(Ve, {
            key: 1,
            count: l.value,
            rate: i.value
          }, null, 8, ["count", "rate"])) : f("", !0)
        ], 2)) : f("", !0),
        e.open ? (t(), _(zt, {
          key: 4,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: M.value,
          "stopped-with-work": D.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : f("", !0)
      ], 42, Ia);
    };
  }
}, nn = /* @__PURE__ */ Z(an, [["__scopeId", "data-v-941553bf"]]), ln = {
  class: "agent-limits",
  "data-agent-limits": ""
}, sn = ["aria-expanded"], on = { key: 0 }, rn = { key: 1 }, dn = { class: "limits-panel" }, un = { class: "limits-head" }, cn = ["data-agent-limit-type", "data-agent-limit-profile"], pn = { class: "count" }, gn = { class: "bar" }, vn = { class: "count" }, hn = { class: "bar" }, mn = ["data-agent-limit-type"], fn = { class: "limit-field" }, kn = { class: "limit-field" }, yn = {
  key: 1,
  role: "alert"
}, bn = {
  key: 2,
  role: "status"
}, wn = {
  __name: "AgentLimits",
  setup(e) {
    const r = he(), { rows: s, failure: a } = r.props.limits, h = O(!1), b = O(!1), $ = O(!1), M = O(""), S = O(""), T = (d) => d === 0 ? "no limit" : String(d), H = (d, l) => l === 0 ? 0 : d > l ? 2 : d === l ? 1 : 0, I = y(() => s.value.flatMap((d) => d.per_profile && d.profiles.length ? d.profiles.map((l) => ({ ...l, label: l.title, type: d.key, key: `${d.key}:${l.profile}` })) : [d])), R = (d) => Math.max(H(d.running, d.run_limit), H(d.kept, d.kept_limit)), q = y(() => I.value.filter((d) => R(d)).sort((d, l) => R(l) - R(d))), A = y(() => s.value.reduce((d, l) => d + l.running, 0)), B = y(() => s.value.reduce((d, l) => d + l.kept, 0)), E = (d) => {
      const l = [d.run_limit ? d.running - d.run_limit : -1, d.kept_limit ? d.kept - d.kept_limit : -1], i = Math.max(...l);
      return i > 0 ? `Over by ${i}` : i === 0 ? "At limit" : "Within limits";
    }, D = (d, l) => l ? `${Math.min(d / Math.max(d, l) * 100, 100)}%` : "0%", N = (d, l) => l && d > l ? `${(d - l) / d * 100}%` : "0%";
    function P() {
      b.value = !b.value;
    }
    async function U(d, l, i, x) {
      if ($.value || r.readOnly) return;
      const n = Number(x.target.value);
      if (!Number.isInteger(n) || n < 0 || !x.target.value.trim()) {
        M.value = "Use a whole number of 0 or more.", x.target.value = String(i);
        return;
      }
      $.value = !0, S.value = "";
      try {
        const u = await r.run(["setting", "set", l, String(n), "--environment", r.environment]);
        if (M.value = u.ok ? "" : u.error, !u.ok) {
          x.target.value = String(i);
          return;
        }
        await r.reload("limits"), S.value = `${d.label} limits saved.`;
      } finally {
        $.value = !1;
      }
    }
    return (d, l) => (t(), o("section", ln, [
      c(s).length ? (t(), o(L, { key: 0 }, [
        p("button", {
          class: "summary",
          type: "button",
          "aria-expanded": h.value,
          onClick: l[0] || (l[0] = (i) => h.value = !h.value)
        }, [
          q.value.length ? (t(), o(L, { key: 0 }, [
            (t(!0), o(L, null, J(q.value.slice(0, 2), (i) => (t(), o("span", {
              key: i.key,
              class: "summary-item"
            }, [
              p("span", {
                class: X(["mark", { over: R(i) === 2 }])
              }, null, 2),
              m(g(i.label) + ": " + g(E(i)), 1)
            ]))), 128)),
            q.value.length > 2 ? (t(), o("span", on, g(q.value.length - 2) + " more", 1)) : f("", !0)
          ], 64)) : (t(), o("span", rn, "All within limits, " + g(A.value) + " running, " + g(B.value) + " kept", 1)),
          k(c(ue), {
            name: "caret",
            size: 12
          })
        ], 8, sn),
        Ke(p("div", dn, [
          p("div", un, [
            l[1] || (l[1] = p("strong", null, "Agent limits", -1)),
            k(c(te), {
              small: "",
              disabled: $.value || c(r).readOnly,
              "data-agent-limits-edit": "",
              onClick: P
            }, {
              default: C(() => [
                m(g(b.value ? "Done" : "Edit limits"), 1)
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          b.value ? (t(), o(L, { key: 1 }, [
            (t(!0), o(L, null, J(c(s), (i) => (t(), o("div", {
              key: i.key,
              class: "edit-row",
              "data-agent-limit-type": i.key
            }, [
              p("strong", null, g(i.label), 1),
              p("label", fn, [
                p("span", null, [
                  l[3] || (l[3] = m("Running", -1)),
                  i.per_profile ? (t(), o(L, { key: 0 }, [
                    m(" per profile")
                  ], 64)) : f("", !0)
                ]),
                k(c(Ae), {
                  type: "number",
                  min: "0",
                  value: String(i.run_limit),
                  disabled: $.value || c(r).readOnly,
                  "data-agent-run-limit": i.key,
                  onChange: (x) => U(i, i.run_setting, i.run_limit, x)
                }, null, 8, ["value", "disabled", "data-agent-run-limit", "onChange"]),
                p("small", null, g(i.run_source), 1)
              ]),
              p("label", kn, [
                p("span", null, [
                  l[4] || (l[4] = m("Kept", -1)),
                  i.per_profile ? (t(), o(L, { key: 0 }, [
                    m(" per profile")
                  ], 64)) : f("", !0)
                ]),
                k(c(Ae), {
                  type: "number",
                  min: "0",
                  value: String(i.kept_limit),
                  disabled: $.value || c(r).readOnly,
                  "data-agent-kept-limit": i.key,
                  onChange: (x) => U(i, i.kept_setting, i.kept_limit, x)
                }, null, 8, ["value", "disabled", "data-agent-kept-limit", "onChange"]),
                p("small", null, g(i.kept_source), 1)
              ])
            ], 8, mn))), 128)),
            p("p", null, "Running 0 starts no agents. Kept 0 means no limit. Changes apply to " + g(c(r).environment) + ".", 1)
          ], 64)) : (t(), o(L, { key: 0 }, [
            l[2] || (l[2] = p("div", { class: "table-head" }, [
              p("span", null, "Agent"),
              p("span", null, "Running"),
              p("span", null, "Kept"),
              p("span", null, "Status")
            ], -1)),
            (t(!0), o(L, null, J(I.value, (i) => (t(), o("div", {
              key: i.key,
              class: "limit-row",
              "data-agent-limit-type": i.type || i.key,
              "data-agent-limit-profile": i.profile
            }, [
              p("strong", null, g(i.label), 1),
              p("div", pn, [
                p("span", null, g(i.run_limit ? `${i.running} of ${i.run_limit}` : `${i.running} · none may start`), 1),
                p("div", gn, [
                  p("span", {
                    style: se({ width: D(i.running, i.run_limit) })
                  }, null, 4),
                  p("i", {
                    style: se({ width: N(i.running, i.run_limit) })
                  }, null, 4)
                ])
              ]),
              p("div", vn, [
                p("span", null, g(i.kept) + " of " + g(T(i.kept_limit)), 1),
                p("div", hn, [
                  p("span", {
                    style: se({ width: D(i.kept, i.kept_limit) })
                  }, null, 4),
                  p("i", {
                    style: se({ width: N(i.kept, i.kept_limit) })
                  }, null, 4)
                ])
              ]),
              p("span", {
                class: X(["status", { warning: R(i) === 1, danger: R(i) === 2 }])
              }, g(E(i)), 3)
            ], 8, cn))), 128))
          ], 64))
        ], 512), [
          [Je, h.value]
        ])
      ], 64)) : f("", !0),
      M.value || c(a) ? (t(), o("p", yn, g(M.value || c(a)), 1)) : f("", !0),
      S.value ? (t(), o("p", bn, g(S.value), 1)) : f("", !0)
    ]));
  }
}, Mn = /* @__PURE__ */ Z(wn, [["__scopeId", "data-v-b7d06805"]]), xn = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, $n = ["data-agent-row"], Oe = "journal.agents.filters", we = "cubic-bezier(0.2, 0.9, 0.25, 1)", Cn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const r = e, s = he(), { rows: a } = s.props.waits, { rows: h } = s.props.progress, { rows: b, failure: $, loaded: M, more: S } = s.props.agents, T = (W) => h.value.find((F) => F.agent_id === W.id) ?? null, H = (W) => {
      var F;
      return ((F = a.value.find((j) => j.agent_id === W.id)) == null ? void 0 : F.reason) ?? "";
    }, I = O("running"), R = O(""), q = JSON.parse(localStorage.getItem(Oe) || '{"roles":[],"profiles":[],"programs":[]}'), A = O(q), B = y(() => s.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: E } = s.props.programs, D = y(() => A.value.roles.length + A.value.profiles.length + A.value.programs.length), N = (W, F) => {
      A.value = dt(A.value, W, F);
    }, P = () => {
      A.value = { roles: [], profiles: [], programs: [] };
    }, U = (W) => W.slice(0, 1).toUpperCase() + W.slice(1);
    le(A, (W) => localStorage.setItem(Oe, JSON.stringify(W)));
    const d = O(25);
    function l() {
      Object.assign(s.state, {
        "agents.show": I.value,
        "agents.search": R.value,
        "agents.limit": String(d.value),
        "agents.roles": A.value.roles.join(","),
        "agents.profiles": A.value.profiles.join(","),
        "agents.programs": A.value.programs.join(",")
      });
    }
    async function i() {
      return d.value += 25, l(), await s.reload("agents"), !0;
    }
    le([I, R, A], () => {
      d.value = 25, l(), s.reload("agents");
    }), l();
    const x = (W) => W.facts ?? null, n = b, u = y(() => !!R.value.trim() || D.value > 0), z = y(() => r.texts[I.value] ?? { title: r.empty, hint: "" }), v = O(null), w = O(null), V = O(null), Q = y(() => n.value.find((W) => W.id === v.value) ?? null), me = y(() => Q.value ? [Q.value] : n.value), oe = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ae = !1, Me = 0;
    async function xe(W) {
      if (ae) return;
      ae = !0, Me = V.value.scrollTop;
      const F = w.value.querySelector(`[data-agent-open="${W.id}"]`);
      if (!oe()) {
        const ne = [...w.value.querySelectorAll(".agent-row")].filter((ee) => !ee.contains(F));
        await Promise.all(ne.map((ee) => ee.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const j = [...F.querySelectorAll(".agent-head, .agent-line")], K = [...j, ...F.querySelectorAll("[data-agent-motion]")], fe = K.map((ne) => ne.getBoundingClientRect());
      if (v.value = W.id, await ze(), !oe()) {
        const ne = K.map((ee) => ee.getBoundingClientRect());
        K.forEach((ee, ke) => {
          const ie = j.indexOf(ee.parentElement), Ne = fe[ke].left - ne[ke].left - (ie < 0 ? 0 : fe[ie].left - ne[ie].left), We = fe[ke].top - ne[ke].top - (ie < 0 ? 0 : fe[ie].top - ne[ie].top);
          ee.animate([{ transform: `translate(${Ne}px, ${We}px)` }, { transform: "none" }], { duration: 280, easing: we });
        }), w.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((ee) => {
          ee.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: we, fill: "backwards" });
        });
      }
      ae = !1;
    }
    async function je() {
      if (ae || !Q.value) return;
      ae = !0;
      const W = w.value.querySelector(`[data-agent-open="${v.value}"]`), F = [...W.children], j = oe() ? [] : F.map((K) => K.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(j.map((K) => K.finished)), v.value = null, await ze(), V.value.scrollTop = Me, j.forEach((K) => K.cancel()), oe() || (W.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: we }), w.value.querySelectorAll(".agent-row").forEach((K) => {
        K.contains(W) || K.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: we });
      })), ae = !1;
    }
    const Ee = (W) => v.value === W.id ? je() : xe(W);
    le(R, (W) => W.trim() && (v.value = null)), le(I, () => {
      v.value = null;
    });
    const Te = (W) => {
      W.key === "Escape" && je();
    };
    return window.addEventListener("keydown", Te), pe(() => window.removeEventListener("keydown", Te)), (W, F) => (t(), o("div", {
      ref_key: "agents",
      ref: w,
      class: X(["agents", { focused: Q.value }])
    }, [
      k(Mn),
      k(c(ot), {
        modelValue: R.value,
        "onUpdate:modelValue": F[1] || (F[1] = (j) => R.value = j),
        placeholder: "Search agents",
        "menu-count": D.value,
        "data-agents-search": ""
      }, {
        menu: C(() => [
          k(c(Ce), null, {
            default: C(() => [...F[2] || (F[2] = [
              m("Type", -1)
            ])]),
            _: 1
          }),
          (t(!0), o(L, null, J(B.value.roles, (j) => (t(), _(c(be), {
            key: j,
            role: "menuitemcheckbox",
            "aria-checked": A.value.roles.includes(j),
            checked: A.value.roles.includes(j),
            "data-filter-role": j,
            onClick: (K) => N("roles", j)
          }, {
            default: C(() => [
              m(g(U(j)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          B.value.profiles.length ? (t(), _(c(Ce), { key: 0 }, {
            default: C(() => [...F[3] || (F[3] = [
              m("Profile", -1)
            ])]),
            _: 1
          })) : f("", !0),
          (t(!0), o(L, null, J(B.value.profiles, (j) => (t(), _(c(be), {
            key: j.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.profiles.includes(j.name),
            checked: A.value.profiles.includes(j.name),
            "data-filter-profile": j.name,
            onClick: (K) => N("profiles", j.name)
          }, {
            default: C(() => [
              m(g(j.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          k(c(Ce), null, {
            default: C(() => [...F[4] || (F[4] = [
              m("Program", -1)
            ])]),
            _: 1
          }),
          (t(!0), o(L, null, J(c(E), (j) => (t(), _(c(be), {
            key: j.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.programs.includes(j.name),
            checked: A.value.programs.includes(j.name),
            "data-filter-program": j.name,
            onClick: (K) => N("programs", j.name)
          }, {
            default: C(() => [
              m(g(j.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          D.value ? (t(), _(c(be), {
            key: 1,
            "data-filter-clear": "",
            onClick: P
          }, {
            default: C(() => [...F[5] || (F[5] = [
              m("Clear filters", -1)
            ])]),
            _: 1
          })) : f("", !0)
        ]),
        default: C(() => [
          k(c(it), {
            options: B.value.states,
            value: I.value,
            onPick: F[0] || (F[0] = (j) => I.value = j)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      I.value === "retired" && B.value.upgrade_retired ? (t(), o("p", xn, "Retired during the upgrade: " + g(B.value.upgrade_retired), 1)) : f("", !0),
      p("div", {
        ref_key: "list",
        ref: V,
        class: X(["agents-view", { "agents-view-open": Q.value }])
      }, [
        c(M) && !c($) && !me.value.length && D.value ? (t(), _(c(Se), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: C(() => [
            k(c(te), {
              small: "",
              "data-empty-clear": "",
              onClick: P
            }, {
              default: C(() => [...F[6] || (F[6] = [
                m("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (t(), _(c(rt), {
          key: 1,
          rows: me.value,
          failure: c($),
          loaded: c(M),
          more: !Q.value && c(S),
          older: i,
          empty: z.value.title,
          hint: z.value.hint,
          searching: u.value
        }, {
          default: C(({ row: j }) => [
            p("div", {
              class: "agent-row",
              "data-agent-row": j.id
            }, [
              k(nn, {
                row: j,
                facts: x(j),
                progress: T(j),
                "wait-reason": H(j),
                open: j.id === v.value,
                onToggle: (K) => Ee(j)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, $n)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, Tn = /* @__PURE__ */ Z(Cn, [["__scopeId", "data-v-5aee14da"]]);
export {
  Tn as A
};
