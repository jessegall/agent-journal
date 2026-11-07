/* @code-commandments-generated */
import { openBlock as t, createElementBlock as s, withModifiers as Q, unref as u, createTextVNode as k, toDisplayString as v, createVNode as y, createBlock as _, withCtx as S, Fragment as O, renderList as Z, createElementVNode as p, createCommentVNode as b, computed as w, ref as L, watch as le, onUnmounted as pe, defineAsyncComponent as Ne, createSlots as qe, resolveDynamicComponent as Fe, normalizeStyle as se, normalizeClass as X, renderSlot as ve, onMounted as _e, Teleport as De, mergeProps as Pe, toRef as $e, withKeys as Re, withDirectives as Ue, vShow as Ke, nextTick as ze } from "vue";
import { peekRef as he, Icon as ce, RunningCommand as Je, FoldGroup as Oe, TaskStatusIcon as Ze, useWindow as me, loadWindowComponent as Ge, coalesced as Ye, READ_RATES as Qe, InnerTabs as Xe, TabBody as et, SwitchCase as Be, EmptyState as Se, Btn as te, TextArea as tt, TextInput as Ae, useNow as at, age as nt, perHour as lt, TimeAgo as ue, SearchBar as st, Segmented as ot, MenuLabel as Ce, MenuItem as be, RowList as it, toggleFilter as rt } from "@journal/window-kit";
import { _ as G, T as dt } from "./TranscriptRows-DfA-cZXn.js";
const ut = {
  class: "agent-command",
  "data-agent-command": ""
}, ct = {
  key: 1,
  "data-agent-stopped": ""
}, gt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (r, l) => (t(), s("span", ut, [
      e.waitReason ? (t(), s("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: l[0] || (l[0] = Q((a) => u(he)("test_queue:0"), ["stop"]))
      }, [
        k("Waiting: " + v(e.waitReason) + " ", 1),
        y(u(ce), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (t(), s("span", ct, "Waiting")) : (t(), _(u(Je), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, pt = /* @__PURE__ */ G(gt, [["__scopeId", "data-v-1b371fb5"]]), vt = ["data-agent-delegated", "onClick"], ht = { class: "agent-task-number" }, mt = { class: "agent-task-title" }, ft = ["title"], kt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: r }) {
    const l = r;
    return (a, m) => (t(), _(u(Oe), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: m[0] || (m[0] = (M) => l("toggle"))
    }, {
      default: S(() => [
        (t(!0), s(O, null, Z(e.section.tasks, (M) => (t(), s("button", {
          key: M.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": M.id,
          onClick: (C) => u(he)(`tasks:${M.id}`)
        }, [
          y(u(Ze), {
            status: M.state
          }, null, 8, ["status"]),
          p("span", ht, v(M.id), 1),
          p("span", mt, v(M.title), 1),
          M.plan_id ? (t(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${M.plan_id}: ${M.plan_title}`
          }, "Plan " + v(M.plan_id) + ": " + v(M.plan_title), 9, ft)) : b("", !0)
        ], 8, vt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, yt = /* @__PURE__ */ G(kt, [["__scopeId", "data-v-238ff959"]]), bt = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, wt = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Mt = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, xt = ["data-peek", "onClick"], $t = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ct = {
  key: 0,
  class: "agent-helper-brief"
}, St = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, At = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, jt = "It ended without a report", Tt = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const r = e, l = ["started", "blocked", "open", "completed"], a = w(() => {
      var d, o;
      return r.row.ended_at && ((o = (d = r.facts) == null ? void 0 : d.job_returned) != null && o.startsWith(jt)) ? r.facts.job_returned : "";
    }), m = w(() => r.tasks.length ? l.map((d) => ({ state: d, label: d.slice(0, 1).toUpperCase() + d.slice(1), tasks: r.tasks.filter((o) => o.state === d || d === "started" && o.state === "testing" || d === "completed" && o.state === "cancelled") })) : []), M = /* @__PURE__ */ new Set(["completed"]), C = L({}), $ = (d) => !(C.value[d] ?? M.has(d)), A = (d) => C.value = { ...C.value, [d]: $(d) }, R = me(), { rows: H } = R.props.reports;
    R.state["reports.agent"] = String(r.row.id);
    const I = w(() => r.row.access === "read-only"), z = w(() => !!r.row.retired_at || r.row.state === "retired"), F = ["tasks", "transcript", "terminal", "file-feed", "reports"], j = w(() => (z.value ? R.tabs.filter((o) => ["reports", "transcript"].includes(o.key)) : I.value ? R.tabs.filter((o) => ["reports", "transcript", "terminal"].includes(o.key)) : [...R.tabs]).sort((o, h) => (F.indexOf(o.key) < 0 ? F.length : F.indexOf(o.key)) - (F.indexOf(h.key) < 0 ? F.length : F.indexOf(h.key)))), B = () => I.value || z.value ? j.value.find((d) => d.key === "transcript") : j.value[0], E = L(B());
    le(E, (d) => {
      R.state.tab = (d == null ? void 0 : d.key) ?? "";
    }, { immediate: !0 }), pe(() => {
      R.state.tab = "";
    }), le(j, (d) => {
      d.some((o) => {
        var h;
        return o.key === ((h = E.value) == null ? void 0 : h.key);
      }) || (E.value = d[0]);
    }), le(() => r.open, (d) => {
      d && (E.value = B());
    });
    const N = Object.fromEntries(R.tabs.filter((d) => d.component).map((d) => [d.key, Ne(() => Ge(d.component))])), W = L(!1), { data: P } = R.props.tool, U = w(() => {
      var d;
      return ((d = P.value) == null ? void 0 : d.tool) ?? "";
    }), i = w(() => {
      var d;
      return ((d = P.value) == null ? void 0 : d.note) ?? "";
    }), n = w(() => r.row.role !== "main" && (!r.row.ended_at || r.stoppedWithWork || r.waitReason));
    async function c() {
      !r.open || !n.value || (R.state["tool.agent"] = String(r.row.id), await R.reload("tool"));
    }
    const f = R.follow(["hook_call.*", "process_part.*"], Ye(c, Qe.agentCommand));
    return pe(() => f == null ? void 0 : f()), le(() => r.open, (d) => {
      d && c();
    }, { immediate: !0 }), (d, o) => {
      var h;
      return t(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: o[2] || (o[2] = Q(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (t(), s("p", bt, "Retirement reason: " + v(e.row.retirement_reason), 1)) : b("", !0),
        e.row.resume_reason ? (t(), s("p", wt, v(e.row.resume_reason), 1)) : b("", !0),
        n.value ? (t(), _(pt, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: U.value,
          note: i.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : b("", !0),
        a.value ? (t(), s("p", Mt, v(a.value), 1)) : b("", !0),
        y(u(Xe), {
          class: "agent-tabs",
          tabs: j.value,
          active: E.value,
          answer: { tasks: e.tasks.length, reports: u(H).length },
          onChoose: o[0] || (o[0] = (g) => E.value = g)
        }, null, 8, ["tabs", "active", "answer"]),
        y(u(et), {
          class: "agent-tab-body",
          tab: E.value,
          "data-agent-tab-body": (h = E.value) == null ? void 0 : h.key
        }, {
          default: S(() => {
            var g;
            return [
              y(u(Be), {
                value: (g = E.value) == null ? void 0 : g.key
              }, qe({
                reports: S(() => [
                  u(H).length ? b("", !0) : (t(), _(u(Se), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: S(() => [...o[3] || (o[3] = [
                      k("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (t(!0), s(O, null, Z(u(H), (x) => (t(), s("button", {
                    key: x.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${x.id}`,
                    onClick: (V) => u(he)(`messages:${x.id}`)
                  }, v(x.text), 9, xt))), 128))
                ]),
                tasks: S(() => {
                  var x;
                  return [
                    e.tasks.length ? b("", !0) : (t(), _(u(Se), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: S(() => [...o[4] || (o[4] = [
                        k("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (t(!0), s(O, null, Z(m.value, (V) => (t(), _(yt, {
                      key: V.state,
                      section: V,
                      open: $(V.state),
                      onToggle: (K) => A(V.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (x = e.facts) != null && x.instruction ? (t(), s(O, { key: 1 }, [
                      o[5] || (o[5] = p("p", { class: "agent-label" }, "Instruction", -1)),
                      p("div", $t, v(e.facts.instruction), 1)
                    ], 64)) : b("", !0)
                  ];
                }),
                transcript: S(() => {
                  var x;
                  return [
                    I.value ? (t(), s(O, { key: 0 }, [
                      (x = e.facts) != null && x.instruction ? (t(), s("div", Ct, [
                        y(u(Oe), {
                          label: "Instruction",
                          open: W.value,
                          "data-agent-section": "instruction",
                          onToggle: o[1] || (o[1] = (V) => W.value = !W.value)
                        }, {
                          default: S(() => [
                            p("div", St, v(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (t(), s("p", At, "No job recorded")) : b("", !0)
                    ], 64)) : b("", !0),
                    y(dt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                Z(u(N), (x, V) => ({
                  name: V,
                  fn: S(() => [
                    (t(), _(Fe(x), {
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
}, Rt = /* @__PURE__ */ G(Tt, [["__scopeId", "data-v-71b8d2b0"]]), zt = { class: "action-field" }, Vt = ["value", "disabled"], Lt = ["value"], Ot = { key: 1 }, Bt = {
  key: 1,
  class: "action-field"
}, Ht = { class: "action-buttons" }, It = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (r, l) => (t(), s("form", {
      onSubmit: l[4] || (l[4] = Q((a) => r.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (t(), s(O, { key: 0 }, [
        p("label", zt, [
          l[6] || (l[6] = k("Task ", -1)),
          p("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: l[0] || (l[0] = (a) => r.$emit("update:task", a.target.value))
          }, [
            l[5] || (l[5] = p("option", { value: "" }, "Choose an open task", -1)),
            (t(!0), s(O, null, Z(e.tasks, (a) => (t(), s("option", {
              key: a.id,
              value: String(a.id)
            }, v(a.id) + ": " + v(a.title), 9, Lt))), 128))
          ], 40, Vt)
        ]),
        e.moreTasks ? (t(), _(u(te), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: l[1] || (l[1] = (a) => r.$emit("more"))
        }, {
          default: S(() => [...l[7] || (l[7] = [
            k("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : b("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (t(), s("p", Ot, "No open tasks.")) : b("", !0)
      ], 64)) : (t(), s("label", Bt, [
        l[8] || (l[8] = k("Job", -1)),
        y(u(tt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: l[2] || (l[2] = (a) => r.$emit("update:text", a.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      p("div", Ht, [
        y(u(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: S(() => [...l[9] || (l[9] = [
            k("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        y(u(te), {
          small: "",
          disabled: e.pending,
          onClick: l[3] || (l[3] = (a) => r.$emit("cancel"))
        }, {
          default: S(() => [...l[10] || (l[10] = [
            k("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Et = /* @__PURE__ */ G(It, [["__scopeId", "data-v-adde4158"]]), Wt = { class: "action-buttons" }, Nt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (r, l) => (t(), s("form", {
      "data-agent-retire-confirm": "",
      onSubmit: l[2] || (l[2] = Q((a) => r.$emit("submit"), ["prevent"]))
    }, [
      l[5] || (l[5] = p("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      y(u(Ae), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": l[0] || (l[0] = (a) => r.$emit("update:reason", a))
      }, null, 8, ["model-value", "disabled"]),
      p("div", Wt, [
        y(u(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: S(() => [...l[3] || (l[3] = [
            k("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        y(u(te), {
          small: "",
          disabled: e.pending,
          onClick: l[1] || (l[1] = (a) => r.$emit("cancel"))
        }, {
          default: S(() => [...l[4] || (l[4] = [
            k("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, qt = /* @__PURE__ */ G(Nt, [["__scopeId", "data-v-23a905c0"]]), Ft = { class: "action-buttons" }, _t = {
  key: 0,
  role: "alert"
}, Dt = {
  key: 1,
  role: "status"
}, Pt = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const r = e, l = me(), a = L(""), m = L(""), M = L(""), C = L(""), $ = L([]), A = L(0), R = L(!1), H = L(!1), I = L(!1), z = L(""), F = L(""), j = w(() => !!r.row.retired_at || r.row.state === "retired"), B = w(() => !j.value && !!r.row.ended_at), E = w(() => {
      var f;
      return B.value && ((f = r.row.job_command) == null ? void 0 : f.length) && !r.row.resume_reason;
    }), N = w(() => E.value && !H.value && (r.row.job_task_flag ? $.value.some((f) => String(f.id) === C.value) : !!m.value.trim()));
    function W(f) {
      a.value = f, m.value = "", M.value = "", C.value = "", z.value = "", F.value = "";
    }
    async function P() {
      W("job"), r.row.job_task_flag && ($.value = [], A.value = 0, R.value = !1, await U());
    }
    async function U() {
      if (!H.value) {
        H.value = !0;
        try {
          l.state["jobs.page"] = String(A.value + 1), await l.reload("jobs");
          const f = l.props.jobs;
          z.value = f.failure.value, z.value || ($.value = [...$.value, ...f.rows.value], A.value = f.data.value.page, R.value = f.more.value);
        } finally {
          H.value = !1;
        }
      }
    }
    async function i(f, d) {
      if (!I.value) {
        I.value = !0, z.value = "";
        try {
          const o = await l.run(f);
          z.value = o.ok ? "" : o.error, o.ok && (W(""), F.value = d);
        } finally {
          I.value = !1;
        }
      }
    }
    async function n() {
      if (!N.value) return;
      const f = r.row.job_task_flag ? [r.row.job_task_flag, C.value] : [m.value.trim()];
      await i([...r.row.job_command, String(r.row.id), ...f], "Job sent.");
    }
    async function c() {
      !B.value || a.value !== "retire" || !M.value.trim() || await i(["agent", "retire", String(r.row.id), "--reason", M.value.trim()], "Agent retired permanently.");
    }
    return (f, d) => {
      var o;
      return j.value ? b("", !0) : (t(), s("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: d[6] || (d[6] = Q(() => {
        }, ["stop"])),
        onKeydown: d[7] || (d[7] = Q(() => {
        }, ["stop"]))
      }, [
        p("div", Ft, [
          B.value ? (t(), s(O, { key: 0 }, [
            (o = e.row.job_command) != null && o.length ? (t(), _(u(te), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: I.value || H.value || !E.value,
              onClick: P
            }, {
              default: S(() => [...d[8] || (d[8] = [
                k("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : b("", !0),
            e.row.role !== "main" ? (t(), _(u(te), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: I.value || H.value,
              onClick: d[0] || (d[0] = (h) => W("retire"))
            }, {
              default: S(() => [...d[9] || (d[9] = [
                k("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : b("", !0)
          ], 64)) : b("", !0)
        ]),
        y(u(Be), { value: a.value }, {
          job: S(() => [
            y(Et, {
              task: C.value,
              "onUpdate:task": d[1] || (d[1] = (h) => C.value = h),
              text: m.value,
              "onUpdate:text": d[2] || (d[2] = (h) => m.value = h),
              row: e.row,
              tasks: $.value,
              pending: I.value,
              loading: H.value,
              "more-tasks": R.value,
              failure: z.value,
              "job-ready": N.value,
              onSubmit: n,
              onMore: U,
              onCancel: d[3] || (d[3] = (h) => W(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: S(() => [
            y(qt, {
              reason: M.value,
              "onUpdate:reason": d[4] || (d[4] = (h) => M.value = h),
              pending: I.value,
              onSubmit: c,
              onCancel: d[5] || (d[5] = (h) => W(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        z.value ? (t(), s("p", _t, v(z.value), 1)) : b("", !0),
        F.value ? (t(), s("p", Dt, v(F.value), 1)) : b("", !0)
      ], 32));
    };
  }
}, Ut = /* @__PURE__ */ G(Pt, [["__scopeId", "data-v-4cb32275"]]), Kt = {
  class: "agent-count",
  "data-agent-motion": ""
}, Jt = {
  key: 0,
  class: "agent-pace",
  "data-agent-pace": ""
}, Zt = {
  class: "agent-tasks",
  "data-agent-tasks": ""
}, Gt = {
  __name: "AgentTaskCount",
  props: { count: { type: String, required: !0 }, rate: { type: String, required: !0 } },
  setup(e) {
    return (r, l) => (t(), s("span", Kt, [
      e.rate ? (t(), s("span", Jt, v(e.rate), 1)) : b("", !0),
      p("span", Zt, v(e.count), 1)
    ]));
  }
}, Ve = /* @__PURE__ */ G(Gt, [["__scopeId", "data-v-44694015"]]), Yt = ["data-icon", "stroke-width", "innerHTML"], Y = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const r = e, l = { right: 0, down: 90, left: 180, up: 270 }, a = {
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
    }, m = {
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
    return (M, C) => (t(), s("svg", {
      class: "ico",
      "data-icon": e.name,
      style: se({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...r.facing === "right" ? {} : { transform: `rotate(${l[r.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: m[a[e.name] || e.name] || m.dot
    }, null, 12, Yt));
  }
}, Qt = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Xt = {
  key: 1,
  class: "menu-item-text"
}, ea = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (r, l) => (t(), s("button", {
      type: "button",
      class: X(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (t(), s("span", Qt, v(e.checked ? "✓" : ""), 1)) : b("", !0),
      e.description ? (t(), s("span", Xt, [
        p("span", null, [
          ve(r.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, v(e.description), 1)
      ])) : ve(r.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, de = /* @__PURE__ */ G(ea, [["__scopeId", "data-v-fec99974"]]), ta = {}, aa = { class: "menu-label" };
function na(e, r) {
  return t(), s("span", aa, [
    ve(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ge = /* @__PURE__ */ G(ta, [["render", na], ["__scopeId", "data-v-aa955b3e"]]), la = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, sa = {
  key: 0,
  class: "skills-none"
}, oa = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: r }) {
    const l = e, a = r, m = w(() => l.skills.filter((C) => C.state === "loaded")), M = w(() => l.skills.filter((C) => C.state !== "loaded"));
    return (C, $) => (t(), s("div", la, [
      y(ge, null, {
        default: S(() => [...$[1] || ($[1] = [
          k("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      m.value.length ? b("", !0) : (t(), s("p", sa, "None yet. Compacting the conversation empties this list.")),
      (t(!0), s(O, null, Z(m.value, (A) => (t(), s("p", {
        key: A.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        y(Y, {
          name: "book",
          size: 12
        }),
        k(v(A.skill), 1)
      ]))), 128)),
      M.value.length ? (t(), s(O, { key: 1 }, [
        y(ge, null, {
          default: S(() => [...$[2] || ($[2] = [
            k("Still to read", -1)
          ])]),
          _: 1
        }),
        (t(!0), s(O, null, Z(M.value, (A) => (t(), s("p", {
          key: A.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          y(Y, {
            name: "book",
            size: 12
          }),
          k(v(A.skill), 1)
        ]))), 128))
      ], 64)) : b("", !0),
      y(de, {
        "data-agent-skills-browse": "",
        onClick: $[0] || ($[0] = (A) => a("browse"))
      }, {
        default: S(() => [...$[3] || ($[3] = [
          k("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, ia = /* @__PURE__ */ G(oa, [["__scopeId", "data-v-be514d47"]]), ra = (e, r, l) => Math.max(r, Math.min(l, e)), He = /* @__PURE__ */ new WeakMap(), da = (e, r) => He.set(e, r);
function ua(e, r) {
  for (let l = r; l; l = He.get(l) ?? l.parentElement) if (l === e) return !0;
  return !1;
}
function ca(e, r) {
  const l = (a) => {
    var M, C;
    const m = ((M = e.value) == null ? void 0 : M.element) || ((C = e.value) == null ? void 0 : C.$el) || e.value;
    m && !ua(m, a.target) && r(a);
  };
  window.addEventListener("click", l), pe(() => window.removeEventListener("click", l));
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
  setup(e, { expose: r, emit: l }) {
    const a = e, m = L(null), M = (g) => g ? `${g}px` : void 0, C = w(() => ({
      minWidth: M(a.minWidth),
      maxWidth: M(a.maxWidth),
      maxHeight: M(a.maxHeight),
      height: M(a.height)
    })), $ = L({ w: 0, h: 0 }), A = L(a.anchor ? a.anchor.getBoundingClientRect() : null), R = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), H = (g) => ({
      left: Math.max(0, g.left),
      top: Math.max(0, g.top),
      right: Math.min(window.innerWidth, g.right),
      bottom: Math.min(window.innerHeight, g.bottom)
    }), I = (g) => {
      const x = g.closest(".pane, .float-window");
      return x ? H(x.getBoundingClientRect()) : R();
    }, z = (g, x) => `${Math.max(0, g ? Math.min(g, x) : x)}px`;
    function F(g, x) {
      return {
        below: g.bottom - x.bottom - a.gap - re,
        above: x.top - g.top - a.gap - re,
        across: g.right - g.left - 2 * re
      };
    }
    function j(g) {
      const x = I(a.anchor), V = F(x, g);
      return $.value.w <= V.across && $.value.h <= Math.max(V.below, V.above) ? x : R();
    }
    const B = w(() => {
      if (!A.value) return C.value;
      const g = A.value, x = j(g), V = F(x, g), { w: K, h: fe } = $.value, oe = a.align === "auto" ? g.left + g.right > x.left + x.right : a.align === "right", ae = ra(oe ? g.right - K : g.left, x.left + re, Math.max(x.left + re, x.right - K - re)), xe = fe > V.below && V.above > V.below ? { bottom: `${window.innerHeight - g.top + a.gap}px`, maxHeight: z(a.maxHeight, V.above) } : { top: `${g.bottom + a.gap}px`, maxHeight: z(a.maxHeight, V.below) };
      return { ...C.value, ...xe, left: `${ae}px`, maxWidth: z(a.maxWidth, V.across) };
    }), E = l, N = () => [...m.value.querySelectorAll("button:not(:disabled)")];
    function W(g) {
      const x = N(), V = x.indexOf(document.activeElement);
      x[(V + g + x.length) % x.length].focus();
    }
    const P = { ArrowDown: () => W(1), ArrowUp: () => W(-1), Escape: () => E("close") }, U = (g) => P[g.key] && (g.preventDefault(), P[g.key]()), i = () => m.value && ($.value = { w: m.value.offsetWidth, h: m.value.scrollHeight });
    let n = 0;
    const c = new ResizeObserver(() => {
      cancelAnimationFrame(n), n = requestAnimationFrame(i);
    });
    ca(m, (g) => a.anchor && !a.anchor.contains(g.target) && E("close"));
    const f = (g, x) => ["top", "left", "right", "bottom"].some((V) => Math.abs(g[V] - x[V]) > 1), d = (g) => g.bottom < 0 || g.top > window.innerHeight;
    let o = 0;
    function h() {
      if (a.anchor) {
        const g = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || d(g)) return E("close");
        f(g, A.value) && (A.value = g);
      }
      o = requestAnimationFrame(h);
    }
    return _e(() => {
      a.anchor && m.value && da(m.value, a.anchor), i(), m.value && c.observe(m.value), !a.plain && N()[0] && N()[0].focus(), h();
    }), pe(() => {
      c.disconnect(), cancelAnimationFrame(o), cancelAnimationFrame(n);
    }), r({ element: m }), (g, x) => (t(), _(De, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", Pe({
        ref_key: "panel",
        ref: m
      }, g.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: B.value,
        onKeydown: U
      }), [
        ve(g.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), pa = /* @__PURE__ */ G(ga, [["__scopeId", "data-v-3d203970"]]);
async function va(e, r, l) {
  if (!e) return l(r);
  const { target: a, fields: m } = e, M = Object.fromEntries(Object.keys(m).map((A) => [A, a[A]])), C = () => Object.assign(a, M);
  Object.assign(a, m);
  let $ = !1;
  try {
    const A = await l(r);
    return $ = A.ok, A;
  } finally {
    $ || C();
  }
}
function ha(e, r, l, { groups: a, programs: m }) {
  const M = L({}), C = L(""), $ = L(!1), A = w(() => !!e.value && !e.value.ended_at), R = w(() => A.value && !!e.value.paused_at);
  async function H(j, B = null) {
    C.value = "";
    const E = await va(B, j, r);
    return C.value = E.ok ? "" : E.error, l(), E;
  }
  return { groups: a, programs: m, chosen: M, failure: C, asking: $, running: A, paused: R, choose: (j, B) => H(["agent", "control", String(e.value.id), j, B.value], { target: M, fields: { value: { ...M.value, [j]: B.label } } }), stop: () => ($.value = !1, H(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (j) => H(["agent", "launch", j.name]) };
}
function ma(e) {
  if (!e) return "Not compacted yet";
  const r = new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return e.start_percent === null ? `Last compacted ${r}` : e.end_percent === null ? `Last compacted ${r}, from ${e.start_percent}%` : `Last compacted ${r}, from ${e.start_percent}% to ${e.end_percent}%, ${e.start_percent - e.end_percent}% taken off`;
}
const fa = ["disabled", "title"], ka = ["title"], ya = { class: "gauge usage" }, ba = ["disabled", "title"], wa = { class: "gauge" }, Ma = ["disabled", "title"], xa = ["disabled"], $a = ["disabled"], Ca = {
  key: 5,
  class: "fact",
  "data-fact": "uptime",
  title: "How long this session has run"
}, Sa = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Aa = ["title"], ja = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Ta = { class: "gauge" }, Ra = { class: "context-used" }, za = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Va = 75, La = {
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
    const l = e, a = r, m = ha($e(l, "agent"), l.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: $e(l, "controlGroups"), programs: $e(l, "agentPrograms") }), M = L(null), C = L(""), $ = w(() => m.groups.value.find((i) => i.key === C.value));
    function A(i, n) {
      M.value = i.currentTarget, C.value = n;
    }
    function R() {
      M.value = null, C.value = "", m.asking.value = !1;
    }
    const H = w(() => l.skills.filter((i) => i.state === "loaded"));
    function I(i) {
      A(i, "skills"), a("skills");
    }
    const z = (i) => m.groups.value.some((n) => n.key === i), F = w(() => {
      var i;
      return m.chosen.value.model ?? ((i = B.value) == null ? void 0 : i.model) ?? "";
    }), j = w(() => {
      var i;
      return m.chosen.value.effort ?? ((i = B.value) == null ? void 0 : i.effort) ?? "";
    });
    w(() => !!l.agent && !l.agent.ended_at);
    const B = w(() => {
      var i;
      return ((i = l.usage.agents) == null ? void 0 : i.find((n) => {
        var c;
        return n.id === ((c = l.agent) == null ? void 0 : c.id);
      })) ?? null;
    }), E = w(() => {
      var i;
      return ((i = l.usage.windows) == null ? void 0 : i[0]) ?? null;
    }), N = w(() => E.value ? Math.max(0, Math.min(100, Math.round(E.value.used_percent))) : null), W = w(() => {
      var i;
      return ((i = B.value) == null ? void 0 : i.context_percent) == null ? null : Math.round(B.value.context_percent);
    }), P = w(() => {
      var i;
      return (i = B.value) != null && i.cost_dollars ? `$${B.value.cost_dollars.toFixed(2)}` : "";
    }), U = w(() => {
      var c;
      const i = (c = l.agent) != null && c.process_started_at ? new Date(l.agent.process_started_at).getTime() : 0;
      if (!i) return "";
      const n = Math.max(0, Math.floor((l.now - i) / 6e4));
      return n >= 60 ? `${Math.floor(n / 60)}h ${n % 60}m` : `${n}m`;
    });
    return (i, n) => {
      var c;
      return t(), s("div", {
        class: X(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (t(), s(O, { key: 0 }, [
          p("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: n[0] || (n[0] = (f) => A(f, "agent"))
          }, [
            y(Y, {
              name: "agents",
              size: 12
            }),
            k(" " + v(((c = e.agentPrograms.find((f) => f.name === e.agent.program)) == null ? void 0 : c.title) || e.agent.program), 1)
          ], 8, fa),
          N.value !== null ? (t(), s("button", {
            key: 0,
            type: "button",
            class: "fact",
            "data-fact": "usage",
            title: `${N.value}% of the plan's ${E.value.title} allowance used`,
            onClick: n[1] || (n[1] = (f) => a("open", "usage", f.currentTarget))
          }, [
            y(Y, {
              name: "allowance",
              size: 12
            }),
            n[14] || (n[14] = k()),
            p("span", ya, [
              p("span", {
                style: se({ width: `${N.value}%` })
              }, null, 4)
            ]),
            k(" " + v(N.value) + "% ", 1)
          ], 8, ka)) : b("", !0),
          W.value !== null ? (t(), s("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${W.value}% full: clear or compact it`,
            onClick: n[2] || (n[2] = (f) => z("context") ? A(f, "context") : a("open", "context", f.currentTarget))
          }, [
            y(Y, {
              name: "gauge",
              size: 12
            }),
            n[15] || (n[15] = k()),
            p("span", wa, [
              p("span", {
                style: se({ width: `${W.value}%` })
              }, null, 4)
            ]),
            k(" " + v(W.value) + "% ", 1)
          ], 8, ba)) : b("", !0),
          F.value ? (t(), s("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${F.value}: change the model`,
            onClick: n[3] || (n[3] = (f) => z("model") ? A(f, "model") : null)
          }, [
            y(Y, {
              name: "model",
              size: 12
            }),
            k(" " + v(F.value), 1)
          ], 8, Ma)) : b("", !0),
          z("effort") || e.card && j.value ? (t(), s("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: n[4] || (n[4] = (f) => A(f, "effort"))
          }, [
            y(Y, {
              name: "bolt",
              size: 12
            }),
            k(" " + v(j.value), 1)
          ], 8, xa)) : b("", !0),
          P.value ? (t(), s("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: n[5] || (n[5] = (f) => a("open", "cost", f.currentTarget))
          }, v(P.value), 9, $a)) : b("", !0),
          U.value ? (t(), s("span", Ca, [
            y(Y, {
              name: "reminders",
              size: 12
            }),
            k(" " + v(U.value), 1)
          ])) : b("", !0),
          e.branch ? (t(), s("span", Sa, [
            y(Y, {
              name: "branch",
              size: 12
            }),
            k(" " + v(e.branch), 1)
          ])) : b("", !0),
          e.card ? b("", !0) : (t(), s("button", {
            key: 7,
            type: "button",
            class: X(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: n[6] || (n[6] = (f) => a("open", "jobs", f.currentTarget))
          }, [
            y(Y, {
              name: "clock",
              size: 12
            }),
            k(" " + v(e.jobs), 1)
          ], 2)),
          e.run ? (t(), s("button", {
            key: 8,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: I
          }, [
            y(Y, {
              name: "book",
              size: 12
            }),
            k(" " + v(H.value.length), 1)
          ])) : b("", !0),
          e.fitness ? (t(), s(O, { key: 9 }, [
            p("button", {
              type: "button",
              class: X(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Va }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: n[7] || (n[7] = (f) => a("open", "fitness", f.currentTarget))
            }, [
              y(Y, {
                name: "heart",
                size: 12
              }),
              k(" " + v(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            p("button", {
              type: "button",
              class: X(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: n[8] || (n[8] = (f) => a("open", "load", f.currentTarget))
            }, [
              y(Y, {
                name: "weight",
                size: 12
              }),
              k(" " + v(e.fitness.workload), 1)
            ], 2)
          ], 64)) : b("", !0)
        ], 64)) : e.run && !e.loading ? (t(), s("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: n[9] || (n[9] = (f) => A(f, "start"))
        }, [
          y(Y, {
            name: "agents",
            size: 12
          }),
          n[16] || (n[16] = k(" Start an agent", -1))
        ])) : b("", !0),
        n[22] || (n[22] = p("span", { class: "space" }, null, -1)),
        u(m).failure.value ? (t(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: u(m).failure.value
        }, v(u(m).failure.value), 9, Aa)) : b("", !0),
        ve(i.$slots, "default", {}, void 0, !0),
        M.value ? (t(), _(pa, {
          key: 3,
          anchor: M.value,
          "min-width": 190,
          onClose: R
        }, {
          default: S(() => {
            var f;
            return [
              C.value === "agent" ? (t(), s(O, { key: 0 }, [
                u(m).asking.value ? (t(), s(O, { key: 0 }, [
                  y(ge, { "data-agent-stop-ask": "" }, {
                    default: S(() => [...n[17] || (n[17] = [
                      k("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  y(de, {
                    "data-agent-stop-confirm": "",
                    onClick: n[10] || (n[10] = (d) => (R(), u(m).stop()))
                  }, {
                    default: S(() => [...n[18] || (n[18] = [
                      k("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  y(de, {
                    onClick: n[11] || (n[11] = (d) => u(m).asking.value = !1)
                  }, {
                    default: S(() => [...n[19] || (n[19] = [
                      k("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (t(), _(de, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: n[12] || (n[12] = (d) => u(m).asking.value = !0)
                }, {
                  default: S(() => [...n[20] || (n[20] = [
                    k("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : C.value === "start" ? (t(), s(O, { key: 1 }, [
                y(ge, null, {
                  default: S(() => [...n[21] || (n[21] = [
                    k("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (t(!0), s(O, null, Z(u(m).programs.value, (d) => (t(), _(de, {
                  key: d.name,
                  "data-agent-program": d.name,
                  onClick: (o) => (R(), u(m).start(d))
                }, {
                  default: S(() => [
                    k(v(d.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : C.value === "skills" ? (t(), _(ia, {
                key: 2,
                skills: e.skills,
                onBrowse: n[13] || (n[13] = (d) => (R(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : $.value ? (t(), s(O, { key: 3 }, [
                y(ge, null, {
                  default: S(() => [
                    k(v($.value.label), 1)
                  ]),
                  _: 1
                }),
                C.value === "context" ? (t(), s(O, { key: 0 }, [
                  p("div", ja, [
                    p("span", Ta, [
                      p("span", {
                        style: se({ width: `${W.value}%` })
                      }, null, 4)
                    ]),
                    p("span", Ra, v(W.value) + "%", 1)
                  ]),
                  p("p", za, v(u(ma)(((f = B.value) == null ? void 0 : f.last_compaction) ?? null)), 1)
                ], 64)) : b("", !0),
                (t(!0), s(O, null, Z($.value.choices, (d) => (t(), _(de, {
                  key: d.value,
                  "data-agent-choice": d.value,
                  onClick: (o) => (u(m).choose($.value.key, d), R())
                }, {
                  default: S(() => [
                    k(v(d.label), 1)
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
}, Oa = /* @__PURE__ */ G(La, [["__scopeId", "data-v-c49c145a"]]), Ba = ["data-agent-open", "aria-expanded", "role", "tabindex"], Ha = { class: "agent-head" }, Ia = ["data-state"], Ea = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Wa = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Na = { class: "agent-times" }, qa = {
  key: 0,
  class: "agent-time",
  "data-agent-motion": ""
}, Fa = {
  key: 1,
  class: "agent-time",
  "data-agent-motion": ""
}, _a = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": ""
}, Da = {
  key: 3,
  class: "agent-time",
  "data-agent-motion": ""
}, Pa = { class: "agent-line" }, Ua = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Ka = {
  key: 0,
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, Ja = {
  key: 1,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Za = {
  key: 1,
  class: "agent-line"
}, Ga = {
  key: 2,
  class: "agent-line agent-work-start"
}, Ya = ["data-peek"], Qa = ["title"], Xa = ["data-peek"], en = ["data-agent-waiting", "data-agent-stopped"], tn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: r }) {
    const l = { helper: "Helper", reviewer: "Reviewer" }, a = e, m = r, M = at(), C = w(() => {
      var h, g;
      if ((h = a.facts) != null && h.profile_title) return a.facts.profile_title;
      if ((g = a.facts) != null && g.profile) return a.facts.profile;
      const o = l[a.row.role] || a.row.role;
      return o.slice(0, 1).toUpperCase() + o.slice(1);
    }), $ = w(() => {
      var o;
      return ((o = a.facts) == null ? void 0 : o.tasks) ?? [];
    }), A = w(() => $.value.filter((o) => o.state === "open")), R = w(() => {
      const o = $.value.find((h) => {
        var g;
        return h.id === ((g = a.facts) == null ? void 0 : g.task_id);
      });
      return o != null && o.plan_id ? o : A.value.find((h) => h.plan_id);
    }), H = w(() => {
      var o, h, g, x, V;
      return a.row.role === "helper" ? ((o = a.facts) == null ? void 0 : o.helper_job) || "" : (h = a.facts) != null && h.job_enabled && (((g = a.facts) == null ? void 0 : g.task_title) || ((x = A.value[0]) == null ? void 0 : x.title) || ((V = $.value.at(-1)) == null ? void 0 : V.title)) || "";
    }), I = w(() => {
      const o = H.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return o ? `${o[1].toLowerCase() === "plan" ? "plans" : "docs"}:${o[2]}` : "";
    }), z = w(() => {
      var o;
      return (o = a.facts) != null && o.job_enabled ? `${a.row.role} ${a.row.id}` : "";
    }), F = w(() => {
      var o, h;
      return [a.row.program, (o = a.facts) == null ? void 0 : o.model, (h = a.facts) == null ? void 0 : h.effort, z.value].filter(Boolean).join(" · ");
    }), j = me(), B = w(() => nt(a.row.process_started_at || a.row.created_at, M.value)), E = /* @__PURE__ */ new Set(["open", "started", "testing"]), N = w(() => {
      var o;
      return (o = a.facts) == null ? void 0 : o.work_status;
    }), W = w(() => !!a.row.ended_at && a.row.role !== "main" && $.value.some((o) => E.has(o.state))), P = w(() => {
      var o;
      return a.row.retired_at || a.row.state === "retired" ? "retired" : N.value || a.waitReason || W.value ? "waiting" : a.row.state === "running" && ((o = a.facts) == null ? void 0 : o.state) || a.row.state;
    }), U = w(() => {
      var o;
      return N.value ? `Status: ${N.value}` : a.waitReason ? `Waiting: ${a.waitReason}` : P.value === "blocked" ? (o = a.facts) != null && o.blocked_reason ? `Blocked: ${a.facts.blocked_reason}` : "Blocked" : W.value ? "Stopped with work left" : "";
    }), i = w(() => {
      var o;
      return ((o = a.progress) == null ? void 0 : o.completed_count) ?? $.value.filter((h) => h.state === "completed").length;
    }), n = w(() => {
      var o;
      return ((o = a.progress) == null ? void 0 : o.task_count) ?? $.value.length;
    }), c = w(() => `${i.value} of ${n.value} ${n.value === 1 ? "task" : "tasks"}`), f = w(() => {
      var h;
      const o = lt(i.value, ((h = a.progress) == null ? void 0 : h.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, M.value);
      return a.row.role !== "main" && o ? `${o} per hour` : "";
    }), d = w(() => !!a.row.retired_at || a.row.state === "retired");
    return (o, h) => {
      var g, x, V;
      return t(), s("div", {
        class: X(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: h[4] || (h[4] = (K) => !e.open && m("toggle")),
        onKeydown: [
          h[5] || (h[5] = Re(Q((K) => !e.open && m("toggle"), ["self", "prevent"]), ["enter"])),
          h[6] || (h[6] = Re(Q((K) => !e.open && m("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        p("span", Ha, [
          e.open ? (t(), s("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: h[0] || (h[0] = Q((K) => m("toggle"), ["stop"]))
          }, [
            y(u(ce), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : b("", !0),
          p("span", {
            class: "agent-dot",
            "data-state": P.value,
            "data-agent-motion": ""
          }, null, 8, Ia),
          p("span", Ea, v(C.value), 1),
          p("span", Wa, v(((g = e.facts) == null ? void 0 : g.given_name) || e.row.id), 1),
          e.open ? b("", !0) : (t(), _(u(ce), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          p("span", Na, [
            d.value ? (t(), s("span", qa, [
              h[7] || (h[7] = k("Retired, ", -1)),
              y(u(ue), {
                at: e.row.retired_at
              }, null, 8, ["at"])
            ])) : e.row.ended_at && N.value ? (t(), s("span", Fa, [
              h[8] || (h[8] = k("Process ended: ", -1)),
              y(u(ue), {
                at: e.row.ended_at
              }, null, 8, ["at"])
            ])) : e.row.ended_at ? (t(), s("span", _a, [
              h[9] || (h[9] = k("Idle, ", -1)),
              y(u(ue), {
                at: e.row.ended_at
              }, null, 8, ["at"])
            ])) : (t(), s("span", Da, v(B.value), 1))
          ])
        ]),
        p("span", Pa, [
          p("span", Ua, v(F.value), 1),
          e.open ? (t(), s("span", Ka, [
            y(u(ce), {
              name: "time",
              size: 12
            }),
            h[10] || (h[10] = k("First started: ", -1)),
            y(u(ue), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : b("", !0),
          e.open && ((x = e.facts) != null && x.last_activity) ? (t(), s("span", Ja, [
            h[11] || (h[11] = k("Last heard: ", -1)),
            y(u(ue), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : b("", !0)
        ]),
        e.open ? (t(), _(Oa, {
          key: 0,
          "agent-programs": u(j).props.programs.rows.value,
          agent: e.row,
          branch: (V = e.progress) == null ? void 0 : V.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: [] },
          card: ""
        }, {
          default: S(() => [
            y(Ut, { row: e.row }, null, 8, ["row"]),
            e.row.role === "helper" && !e.row.ended_at ? (t(), _(u(te), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: h[1] || (h[1] = Q((K) => u(j).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: S(() => [...h[12] || (h[12] = [
                k("Stop", -1)
              ])]),
              _: 1
            })) : b("", !0)
          ]),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : b("", !0),
        e.open && n.value && !H.value ? (t(), s("span", Za, [
          y(Ve, {
            count: c.value,
            rate: f.value
          }, null, 8, ["count", "rate"])
        ])) : b("", !0),
        e.open && R.value ? (t(), s("span", Ga, [
          p("button", {
            type: "button",
            class: "agent-plan",
            "data-agent-plan": "",
            "data-peek": `plans:${R.value.plan_id}`,
            onClick: h[2] || (h[2] = Q((K) => u(he)(`plans:${R.value.plan_id}`), ["stop"]))
          }, "Plan " + v(R.value.plan_id) + ": " + v(R.value.plan_title), 9, Ya)
        ])) : b("", !0),
        H.value || !e.open && U.value || N.value ? (t(), s("span", {
          key: 3,
          class: X(["agent-line", { "agent-work-start": !R.value }])
        }, [
          p("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: H.value
          }, [
            e.open && I.value ? (t(), s("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": I.value,
              onClick: h[3] || (h[3] = Q((K) => u(he)(I.value), ["stop"]))
            }, v(H.value), 9, Xa)) : (t(), s(O, { key: 1 }, [
              k(v(H.value), 1)
            ], 64))
          ], 8, Qa),
          U.value && (!e.open || N.value) ? (t(), s("span", {
            key: 0,
            class: "agent-work-status",
            "data-agent-work-status": "",
            "data-agent-waiting": e.waitReason ? "" : null,
            "data-agent-stopped": W.value && !e.waitReason && !N.value ? "" : null
          }, v(U.value), 9, en)) : b("", !0),
          e.open && n.value ? (t(), _(Ve, {
            key: 1,
            count: c.value,
            rate: f.value
          }, null, 8, ["count", "rate"])) : b("", !0)
        ], 2)) : b("", !0),
        e.open ? (t(), _(Rt, {
          key: 4,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: $.value,
          "stopped-with-work": W.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : b("", !0)
      ], 42, Ba);
    };
  }
}, an = /* @__PURE__ */ G(tn, [["__scopeId", "data-v-58ef2136"]]), nn = {
  class: "agent-limits",
  "data-agent-limits": ""
}, ln = ["aria-expanded"], sn = { key: 0 }, on = { key: 1 }, rn = { class: "limits-panel" }, dn = { class: "limits-head" }, un = ["data-agent-limit-type", "data-agent-limit-profile"], cn = { class: "count" }, gn = { class: "bar" }, pn = { class: "count" }, vn = { class: "bar" }, hn = ["data-agent-limit-type"], mn = { class: "limit-field" }, fn = { class: "limit-field" }, kn = {
  key: 1,
  role: "alert"
}, yn = {
  key: 2,
  role: "status"
}, bn = {
  __name: "AgentLimits",
  setup(e) {
    const r = me(), { rows: l, failure: a } = r.props.limits, m = L(!1), M = L(!1), C = L(!1), $ = L(""), A = L(""), R = (i) => i === 0 ? "no limit" : String(i), H = (i, n) => n === 0 ? 0 : i > n ? 2 : i === n ? 1 : 0, I = w(() => l.value.flatMap((i) => i.per_profile && i.profiles.length ? i.profiles.map((n) => ({ ...n, label: n.title, type: i.key, key: `${i.key}:${n.profile}` })) : [i])), z = (i) => Math.max(H(i.running, i.run_limit), H(i.kept, i.kept_limit)), F = w(() => I.value.filter((i) => z(i)).sort((i, n) => z(n) - z(i))), j = w(() => l.value.reduce((i, n) => i + n.running, 0)), B = w(() => l.value.reduce((i, n) => i + n.kept, 0)), E = (i) => {
      const n = [i.run_limit ? i.running - i.run_limit : -1, i.kept_limit ? i.kept - i.kept_limit : -1], c = Math.max(...n);
      return c > 0 ? `Over by ${c}` : c === 0 ? "At limit" : "Within limits";
    }, N = (i, n) => n ? `${Math.min(i / Math.max(i, n) * 100, 100)}%` : "0%", W = (i, n) => n && i > n ? `${(i - n) / i * 100}%` : "0%";
    function P() {
      M.value = !M.value;
    }
    async function U(i, n, c, f) {
      if (C.value || r.readOnly) return;
      const d = Number(f.target.value);
      if (!Number.isInteger(d) || d < 0 || !f.target.value.trim()) {
        $.value = "Use a whole number of 0 or more.", f.target.value = String(c);
        return;
      }
      C.value = !0, A.value = "";
      try {
        const o = await r.run(["setting", "set", n, String(d), "--environment", r.environment]);
        if ($.value = o.ok ? "" : o.error, !o.ok) {
          f.target.value = String(c);
          return;
        }
        await r.reload("limits"), A.value = `${i.label} limits saved.`;
      } finally {
        C.value = !1;
      }
    }
    return (i, n) => (t(), s("section", nn, [
      u(l).length ? (t(), s(O, { key: 0 }, [
        p("button", {
          class: "summary",
          type: "button",
          "aria-expanded": m.value,
          onClick: n[0] || (n[0] = (c) => m.value = !m.value)
        }, [
          F.value.length ? (t(), s(O, { key: 0 }, [
            (t(!0), s(O, null, Z(F.value.slice(0, 2), (c) => (t(), s("span", {
              key: c.key,
              class: "summary-item"
            }, [
              p("span", {
                class: X(["mark", { over: z(c) === 2 }])
              }, null, 2),
              k(v(c.label) + ": " + v(E(c)), 1)
            ]))), 128)),
            F.value.length > 2 ? (t(), s("span", sn, v(F.value.length - 2) + " more", 1)) : b("", !0)
          ], 64)) : (t(), s("span", on, "All within limits, " + v(j.value) + " running, " + v(B.value) + " kept", 1)),
          y(u(ce), {
            name: "caret",
            size: 12
          })
        ], 8, ln),
        Ue(p("div", rn, [
          p("div", dn, [
            n[1] || (n[1] = p("strong", null, "Agent limits", -1)),
            y(u(te), {
              small: "",
              disabled: C.value || u(r).readOnly,
              "data-agent-limits-edit": "",
              onClick: P
            }, {
              default: S(() => [
                k(v(M.value ? "Done" : "Edit limits"), 1)
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          M.value ? (t(), s(O, { key: 1 }, [
            (t(!0), s(O, null, Z(u(l), (c) => (t(), s("div", {
              key: c.key,
              class: "edit-row",
              "data-agent-limit-type": c.key
            }, [
              p("strong", null, v(c.label), 1),
              p("label", mn, [
                p("span", null, [
                  n[3] || (n[3] = k("Running", -1)),
                  c.per_profile ? (t(), s(O, { key: 0 }, [
                    k(" per profile")
                  ], 64)) : b("", !0)
                ]),
                y(u(Ae), {
                  type: "number",
                  min: "0",
                  value: String(c.run_limit),
                  disabled: C.value || u(r).readOnly,
                  "data-agent-run-limit": c.key,
                  onChange: (f) => U(c, c.run_setting, c.run_limit, f)
                }, null, 8, ["value", "disabled", "data-agent-run-limit", "onChange"]),
                p("small", null, v(c.run_source), 1)
              ]),
              p("label", fn, [
                p("span", null, [
                  n[4] || (n[4] = k("Kept", -1)),
                  c.per_profile ? (t(), s(O, { key: 0 }, [
                    k(" per profile")
                  ], 64)) : b("", !0)
                ]),
                y(u(Ae), {
                  type: "number",
                  min: "0",
                  value: String(c.kept_limit),
                  disabled: C.value || u(r).readOnly,
                  "data-agent-kept-limit": c.key,
                  onChange: (f) => U(c, c.kept_setting, c.kept_limit, f)
                }, null, 8, ["value", "disabled", "data-agent-kept-limit", "onChange"]),
                p("small", null, v(c.kept_source), 1)
              ])
            ], 8, hn))), 128)),
            p("p", null, "Running 0 starts no agents. Kept 0 means no limit. Changes apply to " + v(u(r).environment) + ".", 1)
          ], 64)) : (t(), s(O, { key: 0 }, [
            n[2] || (n[2] = p("div", { class: "table-head" }, [
              p("span", null, "Agent"),
              p("span", null, "Running"),
              p("span", null, "Kept"),
              p("span", null, "Status")
            ], -1)),
            (t(!0), s(O, null, Z(I.value, (c) => (t(), s("div", {
              key: c.key,
              class: "limit-row",
              "data-agent-limit-type": c.type || c.key,
              "data-agent-limit-profile": c.profile
            }, [
              p("strong", null, v(c.label), 1),
              p("div", cn, [
                p("span", null, v(c.run_limit ? `${c.running} of ${c.run_limit}` : `${c.running} · none may start`), 1),
                p("div", gn, [
                  p("span", {
                    style: se({ width: N(c.running, c.run_limit) })
                  }, null, 4),
                  p("i", {
                    style: se({ width: W(c.running, c.run_limit) })
                  }, null, 4)
                ])
              ]),
              p("div", pn, [
                p("span", null, v(c.kept) + " of " + v(R(c.kept_limit)), 1),
                p("div", vn, [
                  p("span", {
                    style: se({ width: N(c.kept, c.kept_limit) })
                  }, null, 4),
                  p("i", {
                    style: se({ width: W(c.kept, c.kept_limit) })
                  }, null, 4)
                ])
              ]),
              p("span", {
                class: X(["status", { warning: z(c) === 1, danger: z(c) === 2 }])
              }, v(E(c)), 3)
            ], 8, un))), 128))
          ], 64))
        ], 512), [
          [Ke, m.value]
        ])
      ], 64)) : b("", !0),
      $.value || u(a) ? (t(), s("p", kn, v($.value || u(a)), 1)) : b("", !0),
      A.value ? (t(), s("p", yn, v(A.value), 1)) : b("", !0)
    ]));
  }
}, wn = /* @__PURE__ */ G(bn, [["__scopeId", "data-v-b7d06805"]]), Mn = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, xn = ["data-agent-row"], Le = "journal.agents.filters", we = "cubic-bezier(0.2, 0.9, 0.25, 1)", $n = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const r = e, l = me(), { rows: a } = l.props.waits, { rows: m } = l.props.progress, { rows: M, failure: C, loaded: $, more: A } = l.props.agents, R = (q) => m.value.find((D) => D.agent_id === q.id) ?? null, H = (q) => {
      var D;
      return ((D = a.value.find((T) => T.agent_id === q.id)) == null ? void 0 : D.reason) ?? "";
    }, I = L("running"), z = L(""), F = JSON.parse(localStorage.getItem(Le) || '{"roles":[],"profiles":[],"programs":[]}'), j = L(F), B = w(() => l.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: E } = l.props.programs, N = w(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), W = (q, D) => {
      j.value = rt(j.value, q, D);
    }, P = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, U = (q) => q.slice(0, 1).toUpperCase() + q.slice(1);
    le(j, (q) => localStorage.setItem(Le, JSON.stringify(q)));
    const i = L(25);
    function n() {
      Object.assign(l.state, {
        "agents.show": I.value,
        "agents.search": z.value,
        "agents.limit": String(i.value),
        "agents.roles": j.value.roles.join(","),
        "agents.profiles": j.value.profiles.join(","),
        "agents.programs": j.value.programs.join(",")
      });
    }
    async function c() {
      return i.value += 25, n(), await l.reload("agents"), !0;
    }
    le([I, z, j], () => {
      i.value = 25, n(), l.reload("agents");
    }), n();
    const f = (q) => q.facts ?? null, d = M, o = w(() => !!z.value.trim() || N.value > 0), h = w(() => r.texts[I.value] ?? { title: r.empty, hint: "" }), g = L(null), x = L(null), V = L(null), K = w(() => d.value.find((q) => q.id === g.value) ?? null), fe = w(() => K.value ? [K.value] : d.value), oe = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ae = !1, Me = 0;
    async function xe(q) {
      if (ae) return;
      ae = !0, Me = V.value.scrollTop;
      const D = x.value.querySelector(`[data-agent-open="${q.id}"]`);
      if (!oe()) {
        const ne = [...x.value.querySelectorAll(".agent-row")].filter((ee) => !ee.contains(D));
        await Promise.all(ne.map((ee) => ee.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const T = [...D.querySelectorAll(".agent-head, .agent-line")], J = [...T, ...D.querySelectorAll("[data-agent-motion]")], ke = J.map((ne) => ne.getBoundingClientRect());
      if (g.value = q.id, await ze(), !oe()) {
        const ne = J.map((ee) => ee.getBoundingClientRect());
        J.forEach((ee, ye) => {
          const ie = T.indexOf(ee.parentElement), Ee = ke[ye].left - ne[ye].left - (ie < 0 ? 0 : ke[ie].left - ne[ie].left), We = ke[ye].top - ne[ye].top - (ie < 0 ? 0 : ke[ie].top - ne[ie].top);
          ee.animate([{ transform: `translate(${Ee}px, ${We}px)` }, { transform: "none" }], { duration: 280, easing: we });
        }), x.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((ee) => {
          ee.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: we, fill: "backwards" });
        });
      }
      ae = !1;
    }
    async function je() {
      if (ae || !K.value) return;
      ae = !0;
      const q = x.value.querySelector(`[data-agent-open="${g.value}"]`), D = [...q.children], T = oe() ? [] : D.map((J) => J.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(T.map((J) => J.finished)), g.value = null, await ze(), V.value.scrollTop = Me, T.forEach((J) => J.cancel()), oe() || (q.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: we }), x.value.querySelectorAll(".agent-row").forEach((J) => {
        J.contains(q) || J.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: we });
      })), ae = !1;
    }
    const Ie = (q) => g.value === q.id ? je() : xe(q);
    le(z, (q) => q.trim() && (g.value = null)), le(I, () => {
      g.value = null;
    });
    const Te = (q) => {
      q.key === "Escape" && je();
    };
    return window.addEventListener("keydown", Te), pe(() => window.removeEventListener("keydown", Te)), (q, D) => (t(), s("div", {
      ref_key: "agents",
      ref: x,
      class: X(["agents", { focused: K.value }])
    }, [
      y(wn),
      y(u(st), {
        modelValue: z.value,
        "onUpdate:modelValue": D[1] || (D[1] = (T) => z.value = T),
        placeholder: "Search agents",
        "menu-count": N.value,
        "data-agents-search": ""
      }, {
        menu: S(() => [
          y(u(Ce), null, {
            default: S(() => [...D[2] || (D[2] = [
              k("Type", -1)
            ])]),
            _: 1
          }),
          (t(!0), s(O, null, Z(B.value.roles, (T) => (t(), _(u(be), {
            key: T,
            role: "menuitemcheckbox",
            "aria-checked": j.value.roles.includes(T),
            checked: j.value.roles.includes(T),
            "data-filter-role": T,
            onClick: (J) => W("roles", T)
          }, {
            default: S(() => [
              k(v(U(T)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          B.value.profiles.length ? (t(), _(u(Ce), { key: 0 }, {
            default: S(() => [...D[3] || (D[3] = [
              k("Profile", -1)
            ])]),
            _: 1
          })) : b("", !0),
          (t(!0), s(O, null, Z(B.value.profiles, (T) => (t(), _(u(be), {
            key: T.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.profiles.includes(T.name),
            checked: j.value.profiles.includes(T.name),
            "data-filter-profile": T.name,
            onClick: (J) => W("profiles", T.name)
          }, {
            default: S(() => [
              k(v(T.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          y(u(Ce), null, {
            default: S(() => [...D[4] || (D[4] = [
              k("Program", -1)
            ])]),
            _: 1
          }),
          (t(!0), s(O, null, Z(u(E), (T) => (t(), _(u(be), {
            key: T.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.programs.includes(T.name),
            checked: j.value.programs.includes(T.name),
            "data-filter-program": T.name,
            onClick: (J) => W("programs", T.name)
          }, {
            default: S(() => [
              k(v(T.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          N.value ? (t(), _(u(be), {
            key: 1,
            "data-filter-clear": "",
            onClick: P
          }, {
            default: S(() => [...D[5] || (D[5] = [
              k("Clear filters", -1)
            ])]),
            _: 1
          })) : b("", !0)
        ]),
        default: S(() => [
          y(u(ot), {
            options: B.value.states,
            value: I.value,
            onPick: D[0] || (D[0] = (T) => I.value = T)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      I.value === "retired" && B.value.upgrade_retired ? (t(), s("p", Mn, "Retired during the upgrade: " + v(B.value.upgrade_retired), 1)) : b("", !0),
      p("div", {
        ref_key: "list",
        ref: V,
        class: X(["agents-view", { "agents-view-open": K.value }])
      }, [
        u($) && !u(C) && !fe.value.length && N.value ? (t(), _(u(Se), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: S(() => [
            y(u(te), {
              small: "",
              "data-empty-clear": "",
              onClick: P
            }, {
              default: S(() => [...D[6] || (D[6] = [
                k("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (t(), _(u(it), {
          key: 1,
          rows: fe.value,
          failure: u(C),
          loaded: u($),
          more: !K.value && u(A),
          older: c,
          empty: h.value.title,
          hint: h.value.hint,
          searching: o.value
        }, {
          default: S(({ row: T }) => [
            p("div", {
              class: "agent-row",
              "data-agent-row": T.id
            }, [
              y(an, {
                row: T,
                facts: f(T),
                progress: R(T),
                "wait-reason": H(T),
                open: T.id === g.value,
                onToggle: (J) => Ie(T)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, xn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, jn = /* @__PURE__ */ G($n, [["__scopeId", "data-v-5aee14da"]]);
export {
  jn as A
};
