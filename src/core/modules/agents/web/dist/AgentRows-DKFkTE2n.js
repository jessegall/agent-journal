/* @code-commandments-generated */
import { openBlock as t, createElementBlock as l, withModifiers as se, unref as i, createTextVNode as m, toDisplayString as v, createVNode as w, createBlock as q, withCtx as C, Fragment as V, renderList as _, createElementVNode as p, createCommentVNode as g, computed as y, ref as z, watch as ce, onUnmounted as we, defineAsyncComponent as De, createSlots as Ue, resolveDynamicComponent as Ke, normalizeStyle as he, normalizeClass as ie, renderSlot as Me, onMounted as Je, Teleport as Ze, mergeProps as Ge, toRef as Te, withKeys as ze, nextTick as Be } from "vue";
import { peekRef as $e, Icon as fe, RunningCommand as Ye, FoldGroup as He, TaskStatusIcon as Qe, useWindow as xe, loadWindowComponent as Xe, coalesced as _e, READ_RATES as et, InnerTabs as tt, TabBody as at, SwitchCase as Ie, EmptyState as Oe, Btn as ne, TextArea as nt, TextInput as lt, useNow as Ee, age as Ne, perHour as ot, TimeAgo as ye, Dialog as st, SearchBar as rt, Segmented as it, MenuLabel as Re, MenuItem as Ae, RowList as ut, toggleFilter as dt } from "@journal/window-kit";
import { _ as ae, T as ct } from "./TranscriptRows-DfA-cZXn.js";
const vt = {
  class: "agent-command",
  "data-agent-command": ""
}, pt = {
  key: 1,
  "data-agent-stopped": ""
}, gt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (d, o) => (t(), l("span", vt, [
      e.waitReason ? (t(), l("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: o[0] || (o[0] = se((a) => i($e)("test_queue:0"), ["stop"]))
      }, [
        m("Waiting: " + v(e.waitReason) + " ", 1),
        w(i(fe), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (t(), l("span", pt, "Waiting")) : (t(), q(i(Ye), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, mt = /* @__PURE__ */ ae(gt, [["__scopeId", "data-v-1b371fb5"]]), ht = ["data-agent-delegated", "onClick"], ft = { class: "agent-task-number" }, kt = { class: "agent-task-title" }, yt = ["title"], bt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: d }) {
    const o = d;
    return (a, h) => (t(), q(i(He), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: h[0] || (h[0] = (f) => o("toggle"))
    }, {
      default: C(() => [
        (t(!0), l(V, null, _(e.section.tasks, (f) => (t(), l("button", {
          key: f.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": f.id,
          onClick: (k) => i($e)(`tasks:${f.id}`)
        }, [
          w(i(Qe), {
            status: f.state
          }, null, 8, ["status"]),
          p("span", ft, v(f.id), 1),
          p("span", kt, v(f.title), 1),
          f.plan_id ? (t(), l("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${f.plan_id}: ${f.plan_title}`
          }, "Plan " + v(f.plan_id) + ": " + v(f.plan_title), 9, yt)) : g("", !0)
        ], 8, ht))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, wt = /* @__PURE__ */ ae(bt, [["__scopeId", "data-v-238ff959"]]), Mt = {
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
}, Rt = "It ended without a report", Ot = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const d = e, o = ["started", "blocked", "open", "completed"], a = y(() => {
      var u, A;
      return d.row.ended_at && ((A = (u = d.facts) == null ? void 0 : u.job_returned) != null && A.startsWith(Rt)) ? d.facts.job_returned : "";
    }), h = y(() => d.tasks.length ? o.map((u) => ({ state: u, label: u.slice(0, 1).toUpperCase() + u.slice(1), tasks: d.tasks.filter((A) => A.state === u || u === "started" && A.state === "testing" || u === "completed" && A.state === "cancelled") })) : []), f = /* @__PURE__ */ new Set(["completed"]), k = z({}), $ = (u) => !(k.value[u] ?? f.has(u)), O = (u) => k.value = { ...k.value, [u]: $(u) }, I = xe(), { rows: P } = I.props.reports;
    I.state["reports.agent"] = String(d.row.id);
    const F = y(() => d.row.access === "read-only"), R = y(() => !!d.row.retired_at || d.row.state === "retired"), N = ["tasks", "transcript", "terminal", "file-feed", "reports"], j = y(() => (R.value ? I.tabs.filter((A) => ["reports", "transcript"].includes(A.key)) : F.value ? I.tabs.filter((A) => ["reports", "transcript", "terminal"].includes(A.key)) : [...I.tabs]).sort((A, J) => (N.indexOf(A.key) < 0 ? N.length : N.indexOf(A.key)) - (N.indexOf(J.key) < 0 ? N.length : N.indexOf(J.key)))), H = () => F.value || R.value ? j.value.find((u) => u.key === "transcript") : j.value[0], E = z(H());
    ce(E, (u) => {
      I.state.tab = (u == null ? void 0 : u.key) ?? "";
    }, { immediate: !0 }), we(() => {
      I.state.tab = "";
    }), ce(j, (u) => {
      u.some((A) => {
        var J;
        return A.key === ((J = E.value) == null ? void 0 : J.key);
      }) || (E.value = u[0]);
    }), ce(() => d.open, (u) => {
      u && (E.value = H());
    });
    const K = Object.fromEntries(I.tabs.filter((u) => u.component).map((u) => [u.key, De(() => Xe(u.component))])), D = z(!1), { data: Z } = I.props.tool, Y = y(() => {
      var u;
      return ((u = Z.value) == null ? void 0 : u.tool) ?? "";
    }), S = y(() => {
      var u;
      return ((u = Z.value) == null ? void 0 : u.note) ?? "";
    }), r = y(() => d.row.role !== "main" && (!d.row.ended_at || d.stoppedWithWork || d.waitReason));
    async function G() {
      !d.open || !r.value || (I.state["tool.agent"] = String(d.row.id), await I.reload("tool"));
    }
    const M = I.follow(["hook_call.*", "process_part.*"], _e(G, et.agentCommand));
    return we(() => M == null ? void 0 : M()), ce(() => d.open, (u) => {
      u && G();
    }, { immediate: !0 }), (u, A) => {
      var J;
      return t(), l("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: A[2] || (A[2] = se(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (t(), l("p", Mt, "Retirement reason: " + v(e.row.retirement_reason), 1)) : g("", !0),
        e.row.resume_reason ? (t(), l("p", $t, v(e.row.resume_reason), 1)) : g("", !0),
        r.value ? (t(), q(mt, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: Y.value,
          note: S.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : g("", !0),
        a.value ? (t(), l("p", xt, v(a.value), 1)) : g("", !0),
        w(i(tt), {
          class: "agent-tabs",
          tabs: j.value,
          active: E.value,
          answer: { tasks: e.tasks.length, reports: i(P).length },
          onChoose: A[0] || (A[0] = (n) => E.value = n)
        }, null, 8, ["tabs", "active", "answer"]),
        w(i(at), {
          class: "agent-tab-body",
          tab: E.value,
          "data-agent-tab-body": (J = E.value) == null ? void 0 : J.key
        }, {
          default: C(() => {
            var n;
            return [
              w(i(Ie), {
                value: (n = E.value) == null ? void 0 : n.key
              }, Ue({
                reports: C(() => [
                  i(P).length ? g("", !0) : (t(), q(i(Oe), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: C(() => [...A[3] || (A[3] = [
                      m("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (t(!0), l(V, null, _(i(P), (s) => (t(), l("button", {
                    key: s.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${s.id}`,
                    onClick: (T) => i($e)(`messages:${s.id}`)
                  }, v(s.text), 9, Ct))), 128))
                ]),
                tasks: C(() => {
                  var s;
                  return [
                    e.tasks.length ? g("", !0) : (t(), q(i(Oe), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: C(() => [...A[4] || (A[4] = [
                        m("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (t(!0), l(V, null, _(h.value, (T) => (t(), q(wt, {
                      key: T.state,
                      section: T,
                      open: $(T.state),
                      onToggle: (Q) => O(T.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (s = e.facts) != null && s.instruction ? (t(), l(V, { key: 1 }, [
                      A[5] || (A[5] = p("p", { class: "agent-label" }, "Instruction", -1)),
                      p("div", St, v(e.facts.instruction), 1)
                    ], 64)) : g("", !0)
                  ];
                }),
                transcript: C(() => {
                  var s;
                  return [
                    F.value ? (t(), l(V, { key: 0 }, [
                      (s = e.facts) != null && s.instruction ? (t(), l("div", At, [
                        w(i(He), {
                          label: "Instruction",
                          open: D.value,
                          "data-agent-section": "instruction",
                          onToggle: A[1] || (A[1] = (T) => D.value = !D.value)
                        }, {
                          default: C(() => [
                            p("div", jt, v(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (t(), l("p", Tt, "No job recorded")) : g("", !0)
                    ], 64)) : g("", !0),
                    w(ct, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                _(i(K), (s, T) => ({
                  name: T,
                  fn: C(() => [
                    (t(), q(Ke(s), {
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
}, zt = /* @__PURE__ */ ae(Ot, [["__scopeId", "data-v-71b8d2b0"]]), Bt = { class: "action-field" }, Lt = ["value", "disabled"], Vt = ["value"], Ht = { key: 1 }, It = {
  key: 1,
  class: "action-field"
}, Et = { class: "action-buttons" }, Nt = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (d, o) => (t(), l("form", {
      onSubmit: o[4] || (o[4] = se((a) => d.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (t(), l(V, { key: 0 }, [
        p("label", Bt, [
          o[6] || (o[6] = m("Task ", -1)),
          p("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: o[0] || (o[0] = (a) => d.$emit("update:task", a.target.value))
          }, [
            o[5] || (o[5] = p("option", { value: "" }, "Choose an open task", -1)),
            (t(!0), l(V, null, _(e.tasks, (a) => (t(), l("option", {
              key: a.id,
              value: String(a.id)
            }, v(a.id) + ": " + v(a.title), 9, Vt))), 128))
          ], 40, Lt)
        ]),
        e.moreTasks ? (t(), q(i(ne), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: o[1] || (o[1] = (a) => d.$emit("more"))
        }, {
          default: C(() => [...o[7] || (o[7] = [
            m("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : g("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (t(), l("p", Ht, "No open tasks.")) : g("", !0)
      ], 64)) : (t(), l("label", It, [
        o[8] || (o[8] = m("Job", -1)),
        w(i(nt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: o[2] || (o[2] = (a) => d.$emit("update:text", a.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      p("div", Et, [
        w(i(ne), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: C(() => [...o[9] || (o[9] = [
            m("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        w(i(ne), {
          small: "",
          disabled: e.pending,
          onClick: o[3] || (o[3] = (a) => d.$emit("cancel"))
        }, {
          default: C(() => [...o[10] || (o[10] = [
            m("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, qt = /* @__PURE__ */ ae(Nt, [["__scopeId", "data-v-adde4158"]]), Wt = { class: "action-buttons" }, Ft = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (d, o) => (t(), l("form", {
      "data-agent-retire-confirm": "",
      onSubmit: o[2] || (o[2] = se((a) => d.$emit("submit"), ["prevent"]))
    }, [
      o[5] || (o[5] = p("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      w(i(lt), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": o[0] || (o[0] = (a) => d.$emit("update:reason", a))
      }, null, 8, ["model-value", "disabled"]),
      p("div", Wt, [
        w(i(ne), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: C(() => [...o[3] || (o[3] = [
            m("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        w(i(ne), {
          small: "",
          disabled: e.pending,
          onClick: o[1] || (o[1] = (a) => d.$emit("cancel"))
        }, {
          default: C(() => [...o[4] || (o[4] = [
            m("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, qe = /* @__PURE__ */ ae(Ft, [["__scopeId", "data-v-23a905c0"]]), Pt = { class: "action-buttons" }, Dt = {
  key: 0,
  role: "alert"
}, Ut = {
  key: 1,
  role: "status"
}, Kt = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const d = e, o = xe(), a = z(""), h = z(""), f = z(""), k = z(""), $ = z([]), O = z(0), I = z(!1), P = z(!1), F = z(!1), R = z(""), N = z(""), j = y(() => !!d.row.retired_at || d.row.state === "retired"), H = y(() => !j.value && !!d.row.ended_at), E = y(() => {
      var M;
      return H.value && ((M = d.row.job_command) == null ? void 0 : M.length) && !d.row.resume_reason;
    }), K = y(() => E.value && !P.value && (d.row.job_task_flag ? $.value.some((M) => String(M.id) === k.value) : !!h.value.trim()));
    function D(M) {
      a.value = M, h.value = "", f.value = "", k.value = "", R.value = "", N.value = "";
    }
    async function Z() {
      D("job"), d.row.job_task_flag && ($.value = [], O.value = 0, I.value = !1, await Y());
    }
    async function Y() {
      if (!P.value) {
        P.value = !0;
        try {
          o.state["jobs.page"] = String(O.value + 1), await o.reload("jobs");
          const M = o.props.jobs;
          R.value = M.failure.value, R.value || ($.value = [...$.value, ...M.rows.value], O.value = M.data.value.page, I.value = M.more.value);
        } finally {
          P.value = !1;
        }
      }
    }
    async function S(M, u) {
      if (!F.value) {
        F.value = !0, R.value = "";
        try {
          const A = await o.run(M);
          R.value = A.ok ? "" : A.error, A.ok && (D(""), N.value = u);
        } finally {
          F.value = !1;
        }
      }
    }
    async function r() {
      if (!K.value) return;
      const M = d.row.job_task_flag ? [d.row.job_task_flag, k.value] : [h.value.trim()];
      await S([...d.row.job_command, String(d.row.id), ...M], "Job sent.");
    }
    async function G() {
      !H.value || a.value !== "retire" || !f.value.trim() || await S(["agent", "retire", String(d.row.id), "--reason", f.value.trim()], "Agent retired permanently.");
    }
    return (M, u) => {
      var A;
      return j.value ? g("", !0) : (t(), l("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: u[6] || (u[6] = se(() => {
        }, ["stop"])),
        onKeydown: u[7] || (u[7] = se(() => {
        }, ["stop"]))
      }, [
        p("div", Pt, [
          H.value ? (t(), l(V, { key: 0 }, [
            (A = e.row.job_command) != null && A.length ? (t(), q(i(ne), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: F.value || P.value || !E.value,
              onClick: Z
            }, {
              default: C(() => [...u[8] || (u[8] = [
                m("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : g("", !0),
            e.row.role !== "main" ? (t(), q(i(ne), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: F.value || P.value,
              onClick: u[0] || (u[0] = (J) => D("retire"))
            }, {
              default: C(() => [...u[9] || (u[9] = [
                m("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : g("", !0)
          ], 64)) : g("", !0)
        ]),
        w(i(Ie), { value: a.value }, {
          job: C(() => [
            w(qt, {
              task: k.value,
              "onUpdate:task": u[1] || (u[1] = (J) => k.value = J),
              text: h.value,
              "onUpdate:text": u[2] || (u[2] = (J) => h.value = J),
              row: e.row,
              tasks: $.value,
              pending: F.value,
              loading: P.value,
              "more-tasks": I.value,
              failure: R.value,
              "job-ready": K.value,
              onSubmit: r,
              onMore: Y,
              onCancel: u[3] || (u[3] = (J) => D(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: C(() => [
            w(qe, {
              reason: f.value,
              "onUpdate:reason": u[4] || (u[4] = (J) => f.value = J),
              pending: F.value,
              onSubmit: G,
              onCancel: u[5] || (u[5] = (J) => D(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        R.value ? (t(), l("p", Dt, v(R.value), 1)) : g("", !0),
        N.value ? (t(), l("p", Ut, v(N.value), 1)) : g("", !0)
      ], 32));
    };
  }
}, Jt = /* @__PURE__ */ ae(Kt, [["__scopeId", "data-v-4cb32275"]]), Zt = {
  class: "agent-count",
  "data-agent-motion": ""
}, Gt = {
  key: 0,
  class: "agent-pace",
  "data-agent-pace": ""
}, Yt = {
  class: "agent-tasks",
  "data-agent-tasks": ""
}, Qt = {
  __name: "AgentTaskCount",
  props: { count: { type: String, required: !0 }, rate: { type: String, required: !0 } },
  setup(e) {
    return (d, o) => (t(), l("span", Zt, [
      e.rate ? (t(), l("span", Gt, v(e.rate), 1)) : g("", !0),
      p("span", Yt, v(e.count), 1)
    ]));
  }
}, Le = /* @__PURE__ */ ae(Qt, [["__scopeId", "data-v-44694015"]]), Xt = ["data-icon", "stroke-width", "innerHTML"], le = {
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
    return (f, k) => (t(), l("svg", {
      class: "ico",
      "data-icon": e.name,
      style: he({
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
      innerHTML: h[a[e.name] || e.name] || h.dot
    }, null, 12, Xt));
  }
}, _t = {
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
      class: ie(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (t(), l("span", _t, v(e.checked ? "✓" : ""), 1)) : g("", !0),
      e.description ? (t(), l("span", ea, [
        p("span", null, [
          Me(d.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, v(e.description), 1)
      ])) : Me(d.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, me = /* @__PURE__ */ ae(ta, [["__scopeId", "data-v-fec99974"]]), aa = {}, na = { class: "menu-label" };
function la(e, d) {
  return t(), l("span", na, [
    Me(e.$slots, "default", {}, void 0, !0)
  ]);
}
const be = /* @__PURE__ */ ae(aa, [["render", la], ["__scopeId", "data-v-aa955b3e"]]), oa = {
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
    const o = e, a = d, h = y(() => o.skills.filter((k) => k.state === "loaded")), f = y(() => o.skills.filter((k) => k.state !== "loaded"));
    return (k, $) => (t(), l("div", oa, [
      w(be, null, {
        default: C(() => [...$[1] || ($[1] = [
          m("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      h.value.length ? g("", !0) : (t(), l("p", sa, "None yet. Compacting the conversation empties this list.")),
      (t(!0), l(V, null, _(h.value, (O) => (t(), l("p", {
        key: O.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        w(le, {
          name: "book",
          size: 12
        }),
        m(v(O.skill), 1)
      ]))), 128)),
      f.value.length ? (t(), l(V, { key: 1 }, [
        w(be, null, {
          default: C(() => [...$[2] || ($[2] = [
            m("Still to read", -1)
          ])]),
          _: 1
        }),
        (t(!0), l(V, null, _(f.value, (O) => (t(), l("p", {
          key: O.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          w(le, {
            name: "book",
            size: 12
          }),
          m(v(O.skill), 1)
        ]))), 128))
      ], 64)) : g("", !0),
      w(me, {
        "data-agent-skills-browse": "",
        onClick: $[0] || ($[0] = (O) => a("browse"))
      }, {
        default: C(() => [...$[3] || ($[3] = [
          m("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, ia = /* @__PURE__ */ ae(ra, [["__scopeId", "data-v-be514d47"]]), ua = (e, d, o) => Math.max(d, Math.min(o, e)), We = /* @__PURE__ */ new WeakMap(), da = (e, d) => We.set(e, d);
function ca(e, d) {
  for (let o = d; o; o = We.get(o) ?? o.parentElement) if (o === e) return !0;
  return !1;
}
function va(e, d) {
  const o = (a) => {
    var f, k;
    const h = ((f = e.value) == null ? void 0 : f.element) || ((k = e.value) == null ? void 0 : k.$el) || e.value;
    h && !ca(h, a.target) && d(a);
  };
  window.addEventListener("click", o), we(() => window.removeEventListener("click", o));
}
const ge = 8, pa = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const a = e, h = z(null), f = (n) => n ? `${n}px` : void 0, k = y(() => ({
      minWidth: f(a.minWidth),
      maxWidth: f(a.maxWidth),
      maxHeight: f(a.maxHeight),
      height: f(a.height)
    })), $ = z({ w: 0, h: 0 }), O = z(a.anchor ? a.anchor.getBoundingClientRect() : null), I = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), P = (n) => ({
      left: Math.max(0, n.left),
      top: Math.max(0, n.top),
      right: Math.min(window.innerWidth, n.right),
      bottom: Math.min(window.innerHeight, n.bottom)
    }), F = (n) => {
      const s = n.closest(".pane, .float-window");
      return s ? P(s.getBoundingClientRect()) : I();
    }, R = (n, s) => `${Math.max(0, n ? Math.min(n, s) : s)}px`;
    function N(n, s) {
      return {
        below: n.bottom - s.bottom - a.gap - ge,
        above: s.top - n.top - a.gap - ge,
        across: n.right - n.left - 2 * ge
      };
    }
    function j(n) {
      const s = F(a.anchor), T = N(s, n);
      return $.value.w <= T.across && $.value.h <= Math.max(T.below, T.above) ? s : I();
    }
    const H = y(() => {
      if (!O.value) return k.value;
      const n = O.value, s = j(n), T = N(s, n), { w: Q, h: ee } = $.value, oe = a.align === "auto" ? n.left + n.right > s.left + s.right : a.align === "right", X = ua(oe ? n.right - Q : n.left, s.left + ge, Math.max(s.left + ge, s.right - Q - ge)), c = ee > T.below && T.above > T.below ? { bottom: `${window.innerHeight - n.top + a.gap}px`, maxHeight: R(a.maxHeight, T.above) } : { top: `${n.bottom + a.gap}px`, maxHeight: R(a.maxHeight, T.below) };
      return { ...k.value, ...c, left: `${X}px`, maxWidth: R(a.maxWidth, T.across) };
    }), E = o, K = () => [...h.value.querySelectorAll("button:not(:disabled)")];
    function D(n) {
      const s = K(), T = s.indexOf(document.activeElement);
      s[(T + n + s.length) % s.length].focus();
    }
    const Z = { ArrowDown: () => D(1), ArrowUp: () => D(-1), Escape: () => E("close") }, Y = (n) => Z[n.key] && (n.preventDefault(), Z[n.key]()), S = () => h.value && ($.value = { w: h.value.offsetWidth, h: h.value.scrollHeight });
    let r = 0;
    const G = new ResizeObserver(() => {
      cancelAnimationFrame(r), r = requestAnimationFrame(S);
    });
    va(h, (n) => a.anchor && !a.anchor.contains(n.target) && E("close"));
    const M = (n, s) => ["top", "left", "right", "bottom"].some((T) => Math.abs(n[T] - s[T]) > 1), u = (n) => n.bottom < 0 || n.top > window.innerHeight;
    let A = 0;
    function J() {
      if (a.anchor) {
        const n = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || u(n)) return E("close");
        M(n, O.value) && (O.value = n);
      }
      A = requestAnimationFrame(J);
    }
    return Je(() => {
      a.anchor && h.value && da(h.value, a.anchor), S(), h.value && G.observe(h.value), !a.plain && K()[0] && K()[0].focus(), J();
    }), we(() => {
      G.disconnect(), cancelAnimationFrame(A), cancelAnimationFrame(r);
    }), d({ element: h }), (n, s) => (t(), q(Ze, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", Ge({
        ref_key: "panel",
        ref: h
      }, n.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: H.value,
        onKeydown: Y
      }), [
        Me(n.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ga = /* @__PURE__ */ ae(pa, [["__scopeId", "data-v-3d203970"]]);
async function ma(e, d, o) {
  if (!e) return o(d);
  const { target: a, fields: h } = e, f = Object.fromEntries(Object.keys(h).map((O) => [O, a[O]])), k = () => Object.assign(a, f);
  Object.assign(a, h);
  let $ = !1;
  try {
    const O = await o(d);
    return $ = O.ok, O;
  } finally {
    $ || k();
  }
}
function ha(e, d, o, { groups: a, programs: h }) {
  const f = z({}), k = z(""), $ = z(!1), O = y(() => !!e.value && !e.value.ended_at), I = y(() => O.value && !!e.value.paused_at);
  async function P(j, H = null) {
    k.value = "";
    const E = await ma(H, j, d);
    return k.value = E.ok ? "" : E.error, o(), E;
  }
  return { groups: a, programs: h, chosen: f, failure: k, asking: $, running: O, paused: I, choose: (j, H) => P(["agent", "control", String(e.value.id), j, H.value], { target: f, fields: { value: { ...f.value, [j]: H.label } } }), stop: () => ($.value = !1, P(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (j) => P(["agent", "launch", j.name]) };
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
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Ra = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Oa = { class: "gauge" }, za = { class: "context-used" }, Ba = 75, La = {
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
    const o = e, a = d, h = ha(Te(o, "agent"), o.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: Te(o, "controlGroups"), programs: Te(o, "agentPrograms") }), f = z(null), k = z(""), $ = y(() => h.groups.value.find((S) => S.key === k.value));
    function O(S, r) {
      f.value = S.currentTarget, k.value = r;
    }
    function I() {
      f.value = null, k.value = "", h.asking.value = !1;
    }
    const P = y(() => o.skills.filter((S) => S.state === "loaded"));
    function F(S) {
      O(S, "skills"), a("skills");
    }
    const R = (S) => h.groups.value.some((r) => r.key === S), N = y(() => {
      var S;
      return h.chosen.value.model ?? ((S = H.value) == null ? void 0 : S.model) ?? "";
    }), j = y(() => {
      var S;
      return h.chosen.value.effort ?? ((S = H.value) == null ? void 0 : S.effort) ?? "";
    });
    y(() => !!o.agent && !o.agent.ended_at);
    const H = y(() => {
      var S;
      return ((S = o.usage.agents) == null ? void 0 : S.find((r) => {
        var G;
        return r.id === ((G = o.agent) == null ? void 0 : G.id);
      })) ?? null;
    }), E = y(() => {
      var S;
      return ((S = o.usage.windows) == null ? void 0 : S[0]) ?? null;
    }), K = y(() => E.value ? Math.max(0, Math.min(100, Math.round(E.value.used_percent))) : null), D = y(() => {
      var S;
      return ((S = H.value) == null ? void 0 : S.context_percent) == null ? null : Math.round(H.value.context_percent);
    }), Z = y(() => {
      var S;
      return (S = H.value) != null && S.cost_dollars ? `$${H.value.cost_dollars.toFixed(2)}` : "";
    }), Y = y(() => {
      var G;
      const S = (G = o.agent) != null && G.process_started_at ? new Date(o.agent.process_started_at).getTime() : 0;
      if (!S) return "";
      const r = Math.max(0, Math.floor((o.now - S) / 6e4));
      return r >= 60 ? `${Math.floor(r / 60)}h ${r % 60}m` : `${r}m`;
    });
    return (S, r) => {
      var G;
      return t(), l("div", {
        class: ie(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (t(), l(V, { key: 0 }, [
          p("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: r[0] || (r[0] = (M) => O(M, "agent"))
          }, [
            w(le, {
              name: "agents",
              size: 12
            }),
            m(" " + v(((G = e.agentPrograms.find((M) => M.name === e.agent.program)) == null ? void 0 : G.title) || e.agent.program), 1)
          ], 8, ka),
          K.value !== null ? (t(), l("button", {
            key: 0,
            type: "button",
            class: "fact",
            "data-fact": "usage",
            title: `${K.value}% of the plan's ${E.value.title} allowance used`,
            onClick: r[1] || (r[1] = (M) => a("open", "usage", M.currentTarget))
          }, [
            w(le, {
              name: "allowance",
              size: 12
            }),
            r[14] || (r[14] = m()),
            p("span", ba, [
              p("span", {
                style: he({ width: `${K.value}%` })
              }, null, 4)
            ]),
            m(" " + v(K.value) + "% ", 1)
          ], 8, ya)) : g("", !0),
          D.value !== null ? (t(), l("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${D.value}% full: clear or compact it`,
            onClick: r[2] || (r[2] = (M) => R("context") ? O(M, "context") : a("open", "context", M.currentTarget))
          }, [
            w(le, {
              name: "gauge",
              size: 12
            }),
            r[15] || (r[15] = m()),
            p("span", Ma, [
              p("span", {
                style: he({ width: `${D.value}%` })
              }, null, 4)
            ]),
            m(" " + v(D.value) + "% ", 1)
          ], 8, wa)) : g("", !0),
          N.value ? (t(), l("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${N.value}: change the model`,
            onClick: r[3] || (r[3] = (M) => R("model") ? O(M, "model") : null)
          }, [
            w(le, {
              name: "model",
              size: 12
            }),
            m(" " + v(N.value), 1)
          ], 8, $a)) : g("", !0),
          R("effort") || e.card && j.value ? (t(), l("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: r[4] || (r[4] = (M) => O(M, "effort"))
          }, [
            w(le, {
              name: "bolt",
              size: 12
            }),
            m(" " + v(j.value), 1)
          ], 8, xa)) : g("", !0),
          Z.value ? (t(), l("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: r[5] || (r[5] = (M) => a("open", "cost", M.currentTarget))
          }, v(Z.value), 9, Ca)) : g("", !0),
          Y.value ? (t(), l("span", Sa, [
            w(le, {
              name: "reminders",
              size: 12
            }),
            m(" " + v(Y.value), 1)
          ])) : g("", !0),
          e.branch ? (t(), l("span", Aa, [
            w(le, {
              name: "branch",
              size: 12
            }),
            m(" " + v(e.branch), 1)
          ])) : g("", !0),
          e.card ? g("", !0) : (t(), l("button", {
            key: 7,
            type: "button",
            class: ie(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: r[6] || (r[6] = (M) => a("open", "jobs", M.currentTarget))
          }, [
            w(le, {
              name: "clock",
              size: 12
            }),
            m(" " + v(e.jobs), 1)
          ], 2)),
          e.run ? (t(), l("button", {
            key: 8,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: F
          }, [
            w(le, {
              name: "book",
              size: 12
            }),
            m(" " + v(P.value.length), 1)
          ])) : g("", !0),
          e.fitness ? (t(), l(V, { key: 9 }, [
            p("button", {
              type: "button",
              class: ie(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Ba }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: r[7] || (r[7] = (M) => a("open", "fitness", M.currentTarget))
            }, [
              w(le, {
                name: "heart",
                size: 12
              }),
              m(" " + v(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            p("button", {
              type: "button",
              class: ie(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: r[8] || (r[8] = (M) => a("open", "load", M.currentTarget))
            }, [
              w(le, {
                name: "weight",
                size: 12
              }),
              m(" " + v(e.fitness.workload), 1)
            ], 2)
          ], 64)) : g("", !0)
        ], 64)) : e.run && !e.loading ? (t(), l("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: r[9] || (r[9] = (M) => O(M, "start"))
        }, [
          w(le, {
            name: "agents",
            size: 12
          }),
          r[16] || (r[16] = m(" Start an agent", -1))
        ])) : g("", !0),
        r[22] || (r[22] = p("span", { class: "space" }, null, -1)),
        i(h).failure.value ? (t(), l("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: i(h).failure.value
        }, v(i(h).failure.value), 9, ja)) : g("", !0),
        Me(S.$slots, "default", {}, void 0, !0),
        f.value ? (t(), q(ga, {
          key: 3,
          anchor: f.value,
          "min-width": 190,
          onClose: I
        }, {
          default: C(() => {
            var M;
            return [
              k.value === "agent" ? (t(), l(V, { key: 0 }, [
                i(h).asking.value ? (t(), l(V, { key: 0 }, [
                  w(be, { "data-agent-stop-ask": "" }, {
                    default: C(() => [...r[17] || (r[17] = [
                      m("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  w(me, {
                    "data-agent-stop-confirm": "",
                    onClick: r[10] || (r[10] = (u) => (I(), i(h).stop()))
                  }, {
                    default: C(() => [...r[18] || (r[18] = [
                      m("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  w(me, {
                    onClick: r[11] || (r[11] = (u) => i(h).asking.value = !1)
                  }, {
                    default: C(() => [...r[19] || (r[19] = [
                      m("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (t(), q(me, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: r[12] || (r[12] = (u) => i(h).asking.value = !0)
                }, {
                  default: C(() => [...r[20] || (r[20] = [
                    m("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : k.value === "start" ? (t(), l(V, { key: 1 }, [
                w(be, null, {
                  default: C(() => [...r[21] || (r[21] = [
                    m("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (t(!0), l(V, null, _(i(h).programs.value, (u) => (t(), q(me, {
                  key: u.name,
                  "data-agent-program": u.name,
                  onClick: (A) => (I(), i(h).start(u))
                }, {
                  default: C(() => [
                    m(v(u.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : k.value === "skills" ? (t(), q(ia, {
                key: 2,
                skills: e.skills,
                onBrowse: r[13] || (r[13] = (u) => (I(), a("open", "skills", null)))
              }, null, 8, ["skills"])) : $.value ? (t(), l(V, { key: 3 }, [
                w(be, null, {
                  default: C(() => [
                    m(v($.value.label), 1)
                  ]),
                  _: 1
                }),
                k.value === "context" ? (t(), l(V, { key: 0 }, [
                  p("p", Ta, v(i(fa)(((M = H.value) == null ? void 0 : M.last_compaction) ?? null)), 1),
                  p("div", Ra, [
                    p("span", Oa, [
                      p("span", {
                        style: he({ width: `${D.value}%` })
                      }, null, 4)
                    ]),
                    p("span", za, v(D.value) + "%", 1)
                  ])
                ], 64)) : g("", !0),
                (t(!0), l(V, null, _($.value.choices, (u) => (t(), q(me, {
                  key: u.value,
                  "data-agent-choice": u.value,
                  onClick: (A) => (i(h).choose($.value.key, u), I())
                }, {
                  default: C(() => [
                    m(v(u.label), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-choice", "onClick"]))), 128))
              ], 64)) : g("", !0)
            ];
          }),
          _: 1
        }, 8, ["anchor"])) : g("", !0)
      ], 2);
    };
  }
}, Va = /* @__PURE__ */ ae(La, [["__scopeId", "data-v-8331d791"]]), Ha = ["data-agent-open", "aria-expanded", "role", "tabindex"], Ia = { class: "agent-head" }, Ea = ["data-state"], Na = {
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
}, Ya = {
  key: 1,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Qa = {
  key: 1,
  class: "agent-line"
}, Xa = {
  key: 2,
  class: "agent-line agent-work-start"
}, _a = ["title"], en = { class: "agent-job-title" }, tn = ["data-peek"], an = ["data-peek"], nn = ["data-agent-waiting", "data-agent-stopped"], ln = {
  key: 3,
  class: "agent-line agent-work-status",
  "data-agent-blocked-tasks": ""
}, on = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: d }) {
    const o = { helper: "Helper", reviewer: "Reviewer" }, a = e, h = d, f = Ee(), k = y(() => {
      var s, T;
      if ((s = a.facts) != null && s.profile_title) return a.facts.profile_title;
      if ((T = a.facts) != null && T.profile) return a.facts.profile;
      const n = o[a.row.role] || a.row.role;
      return n.slice(0, 1).toUpperCase() + n.slice(1);
    }), $ = y(() => {
      var n;
      return ((n = a.facts) == null ? void 0 : n.tasks) ?? [];
    }), O = y(() => $.value.filter((n) => n.state === "open")), I = y(() => $.value.find((n) => {
      var s;
      return n.id === ((s = a.progress) == null ? void 0 : s.task_id) && n.state === "started";
    })), P = y(() => I.value || $.value.find((n) => {
      var s;
      return n.id === ((s = a.facts) == null ? void 0 : s.task_id);
    }) || O.value[0] || $.value.at(-1)), F = y(() => I.value ? $.value.filter((n) => n.state === "blocked") : []), R = y(() => {
      var n, s, T, Q, ee, oe;
      return a.row.role === "helper" ? ((n = a.facts) == null ? void 0 : n.helper_job) || "" : (s = a.facts) != null && s.job_enabled && (((T = I.value) == null ? void 0 : T.title) || ((Q = a.facts) == null ? void 0 : Q.task_title) || ((ee = O.value[0]) == null ? void 0 : ee.title) || ((oe = $.value.at(-1)) == null ? void 0 : oe.title)) || "";
    }), N = y(() => {
      const n = R.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return n ? `${n[1].toLowerCase() === "plan" ? "plans" : "docs"}:${n[2]}` : "";
    }), j = y(() => {
      var n;
      return (n = a.facts) != null && n.job_enabled ? `${a.row.role} ${a.row.id}` : "";
    }), H = y(() => {
      var n, s;
      return [a.row.program, (n = a.facts) == null ? void 0 : n.model, (s = a.facts) == null ? void 0 : s.effort, j.value].filter(Boolean).join(" · ");
    }), E = xe(), K = y(() => Ne(a.row.process_started_at || a.row.created_at, f.value)), D = /* @__PURE__ */ new Set(["open", "started", "testing"]), Z = y(() => {
      var n;
      return (n = a.facts) == null ? void 0 : n.work_status;
    }), Y = y(() => !!a.row.ended_at && a.row.role !== "main" && $.value.some((n) => D.has(n.state))), S = y(() => {
      var n;
      return a.row.retired_at || a.row.state === "retired" ? "retired" : Z.value || a.waitReason || Y.value ? "waiting" : a.row.state === "running" && ((n = a.facts) == null ? void 0 : n.state) || a.row.state;
    }), r = y(() => {
      var n;
      return Z.value ? `Status: ${Z.value}` : a.waitReason ? `Waiting: ${a.waitReason}` : S.value === "blocked" ? (n = a.facts) != null && n.blocked_reason ? `Blocked: ${a.facts.blocked_reason}` : "Blocked" : Y.value ? "Stopped with work left" : "";
    }), G = y(() => {
      var n;
      return ((n = a.progress) == null ? void 0 : n.completed_count) ?? $.value.filter((s) => s.state === "completed").length;
    }), M = y(() => {
      var n;
      return ((n = a.progress) == null ? void 0 : n.task_count) ?? $.value.length;
    }), u = y(() => `${G.value} of ${M.value} ${M.value === 1 ? "task" : "tasks"}`), A = y(() => {
      var s;
      const n = ot(G.value, ((s = a.progress) == null ? void 0 : s.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, f.value);
      return a.row.role !== "main" && n ? `${n} per hour` : "";
    }), J = y(() => !!a.row.retired_at || a.row.state === "retired");
    return (n, s) => {
      var T, Q, ee, oe;
      return t(), l("div", {
        class: ie(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: s[4] || (s[4] = (X) => !e.open && h("toggle")),
        onKeydown: [
          s[5] || (s[5] = ze(se((X) => !e.open && h("toggle"), ["self", "prevent"]), ["enter"])),
          s[6] || (s[6] = ze(se((X) => !e.open && h("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        p("span", Ia, [
          e.open ? (t(), l("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: s[0] || (s[0] = se((X) => h("toggle"), ["stop"]))
          }, [
            w(i(fe), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : g("", !0),
          p("span", {
            class: "agent-dot",
            "data-state": S.value,
            "data-agent-motion": ""
          }, null, 8, Ea),
          p("span", Na, v(k.value), 1),
          p("span", qa, v(((T = e.facts) == null ? void 0 : T.given_name) || e.row.id), 1),
          e.open ? g("", !0) : (t(), q(i(fe), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          p("span", Wa, [
            J.value ? (t(), l("span", Fa, [
              s[7] || (s[7] = m("Retired, ", -1)),
              w(i(ye), {
                at: e.row.retired_at
              }, null, 8, ["at"])
            ])) : e.row.ended_at && Z.value ? (t(), l("span", Pa, [
              s[8] || (s[8] = m("Process ended: ", -1)),
              w(i(ye), {
                at: e.row.ended_at
              }, null, 8, ["at"])
            ])) : e.row.ended_at ? (t(), l("span", Da, [
              s[9] || (s[9] = m("Idle, ", -1)),
              w(i(ye), {
                at: e.row.ended_at
              }, null, 8, ["at"])
            ])) : (t(), l("span", Ua, v(K.value), 1)),
            !e.open && e.row.role === "worker" && A.value ? (t(), l("span", Ka, v(A.value), 1)) : g("", !0)
          ])
        ]),
        p("span", Ja, [
          p("span", Za, v(H.value), 1),
          e.open ? (t(), l("span", Ga, [
            w(i(fe), {
              name: "time",
              size: 12
            }),
            s[10] || (s[10] = m("First started: ", -1)),
            w(i(ye), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : g("", !0),
          e.open && ((Q = e.facts) != null && Q.last_activity) ? (t(), l("span", Ya, [
            s[11] || (s[11] = m("Last heard: ", -1)),
            w(i(ye), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : g("", !0)
        ]),
        e.open ? (t(), q(Va, {
          key: 0,
          "agent-programs": i(E).props.programs.rows.value,
          agent: e.row,
          branch: (ee = e.progress) == null ? void 0 : ee.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: [] },
          card: ""
        }, {
          default: C(() => [
            w(Jt, { row: e.row }, null, 8, ["row"]),
            e.row.role === "helper" && !e.row.ended_at ? (t(), q(i(ne), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: s[1] || (s[1] = se((X) => i(E).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: C(() => [...s[12] || (s[12] = [
                m("Stop", -1)
              ])]),
              _: 1
            })) : g("", !0)
          ]),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : g("", !0),
        e.open && M.value && !R.value ? (t(), l("span", Qa, [
          w(Le, {
            count: u.value,
            rate: A.value
          }, null, 8, ["count", "rate"])
        ])) : g("", !0),
        R.value || !e.open && r.value || Z.value ? (t(), l("span", Xa, [
          p("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: R.value
          }, [
            p("span", en, [
              e.open && N.value ? (t(), l("button", {
                key: 0,
                type: "button",
                class: "agent-job-link",
                "data-peek": N.value,
                onClick: s[2] || (s[2] = se((X) => i($e)(N.value), ["stop"]))
              }, v(R.value), 9, tn)) : (t(), l(V, { key: 1 }, [
                m(v(R.value), 1)
              ], 64))
            ]),
            R.value && e.row.role !== "helper" && ((oe = P.value) != null && oe.plan_id) ? (t(), l("button", {
              key: 0,
              type: "button",
              class: "agent-plan",
              "data-agent-plan": "",
              "data-peek": `plans:${P.value.plan_id}`,
              onClick: s[3] || (s[3] = se((X) => i($e)(`plans:${P.value.plan_id}`), ["stop"]))
            }, "plan " + v(P.value.plan_id), 9, an)) : g("", !0)
          ], 8, _a),
          r.value && (!e.open || Z.value) ? (t(), l("span", {
            key: 0,
            class: "agent-work-status",
            "data-agent-work-status": "",
            "data-agent-waiting": e.waitReason ? "" : null,
            "data-agent-stopped": Y.value && !e.waitReason && !Z.value ? "" : null
          }, v(r.value), 9, nn)) : g("", !0),
          e.open && M.value ? (t(), q(Le, {
            key: 1,
            count: u.value,
            rate: A.value
          }, null, 8, ["count", "rate"])) : g("", !0)
        ])) : g("", !0),
        F.value.length ? (t(), l("span", ln, "Blocked: " + v(F.value.map((X) => `task ${X.id}`).join(", ")), 1)) : g("", !0),
        e.open ? (t(), q(zt, {
          key: 4,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: $.value,
          "stopped-with-work": Y.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : g("", !0)
      ], 42, Ha);
    };
  }
}, sn = /* @__PURE__ */ ae(on, [["__scopeId", "data-v-6d2f8ba8"]]), rn = ["data-edit-type"], un = { key: 0 }, dn = { class: "stepper" }, cn = ["disabled", "onClick"], vn = ["value", "disabled", "data-agent-limit-input", "onChange"], pn = ["disabled", "onClick"], gn = { key: 0 }, mn = { key: 1 }, hn = {
  __name: "AgentLimitEditor",
  props: { rows: { type: Array, required: !0 }, pending: Boolean, readOnly: Boolean, environment: { type: String, required: !0 } },
  emits: ["change"],
  setup(e, { emit: d }) {
    const o = d;
    return (a, h) => (t(), l(V, null, [
      h[0] || (h[0] = p("p", null, "How many agents of a type may run at once, and how many may be kept.", -1)),
      (t(!0), l(V, null, _(e.rows, (f) => (t(), l("div", {
        key: f.key,
        class: "edit-row",
        "data-edit-type": f.key
      }, [
        p("div", null, [
          p("strong", null, v(f.per_profile ? "Each helper type" : "Workers"), 1),
          f.per_profile ? (t(), l("small", un, "Researcher, Planner and the others")) : g("", !0)
        ]),
        (t(!0), l(V, null, _([{ name: "Most running", value: f.run_limit, key: f.run_setting, source: f.run_source, kind: "run" }, { name: "Most kept", value: f.kept_limit, key: f.kept_setting, source: f.kept_source, kind: "kept" }], (k) => (t(), l("label", {
          key: k.key
        }, [
          m(v(k.name), 1),
          p("span", dn, [
            p("button", {
              type: "button",
              disabled: e.pending || e.readOnly || k.value === 0,
              onClick: ($) => o("change", f, k.key, k.value, k.value - 1)
            }, "−", 8, cn),
            p("input", {
              type: "number",
              min: "0",
              value: k.value,
              disabled: e.pending || e.readOnly,
              "data-agent-limit-input": k.kind,
              onChange: ($) => o("change", f, k.key, k.value, $.target.value)
            }, null, 40, vn),
            p("button", {
              type: "button",
              disabled: e.pending || e.readOnly,
              onClick: ($) => o("change", f, k.key, k.value, k.value + 1)
            }, "+", 8, pn)
          ]),
          k.value === 0 ? (t(), l("small", gn, v(k.kind === "run" ? "None can start" : "Any number"), 1)) : k.source === `environment ${e.environment}` ? (t(), l("small", mn, "Changed for " + v(e.environment), 1)) : g("", !0)
        ]))), 128))
      ], 8, rn))), 128))
    ], 64));
  }
}, fn = /* @__PURE__ */ ae(hn, [["__scopeId", "data-v-218442c9"]]), kn = {
  key: 0,
  class: "badge",
  "data-agent-count-badge": ""
}, yn = { class: "counts" }, bn = ["data-count-agent"], wn = { class: "person-text" }, Mn = {
  key: 0,
  class: "helper-head"
}, $n = ["data-agent-limit-type", "data-agent-limit-profile", "onClick"], xn = {
  key: 0,
  class: "bar"
}, Cn = {
  key: 5,
  role: "alert"
}, Sn = {
  key: 6,
  role: "status"
}, An = { class: "foot-note" }, jn = {
  __name: "AgentLimits",
  emits: ["open-agent"],
  setup(e, { emit: d }) {
    const o = d, a = xe(), { rows: h, failure: f } = a.props.limits, k = z([]), $ = z(0), O = z(!1), I = Ee(), P = z(!1), F = z(null), R = z(!1), N = z(!1), j = z(""), H = z(""), E = z(null), K = z(""), D = y(() => h.value.flatMap((b) => b.per_profile ? b.profiles.filter((c) => c.kept).map((c) => ({ ...c, label: c.title, type: b.key, key: `${b.key}:${c.profile}` })) : [{ ...b, type: b.key }])), Z = (b, c) => c > 0 && b >= c, Y = y(() => D.value.filter((b) => Z(b.running, b.run_limit) || Z(b.kept, b.kept_limit)).length), S = y(() => h.value.find((b) => b.per_profile)), r = y(() => D.value.find((b) => b.key === F.value)), G = y(() => k.value.filter((b) => {
      var c, x;
      return b.state !== "retired" && b.role === ((c = r.value) == null ? void 0 : c.type) && (!r.value.profile || (((x = b.facts) == null ? void 0 : x.profile) || b.profile) === r.value.profile);
    }).sort((b, c) => (b.state !== "running") - (c.state !== "running") || String(b.ended_at || b.created_at).localeCompare(String(c.ended_at || c.created_at)))), M = y(() => {
      var c;
      const b = /* @__PURE__ */ new Map();
      for (const x of G.value) {
        const U = ((c = x.facts) == null ? void 0 : c.model) || x.program_model;
        U && b.set(U, (b.get(U) || 0) + 1);
      }
      return [...b].map(([x, U]) => `${U} ${x}`).join(", ");
    }), u = (b, c) => c ? `${Math.min(b / Math.max(b, c) * 100, 100)}%` : "0%", A = (b, c) => c && b > c ? `${(b - c) / b * 100}%` : "0%", J = y(() => {
      var b;
      return R.value ? "Change the maximums" : ((b = r.value) == null ? void 0 : b.label) || "Agent counts";
    });
    async function n(b, c = 1) {
      a.state["count-agents.role"] = b.type, b.profile ? a.state["count-agents.profile"] = b.profile : delete a.state["count-agents.profile"], a.state["count-agents.page"] = String(c), await a.reload("count-agents");
      const x = a.props["count-agents"];
      k.value = c === 1 ? [...x.rows.value] : [...k.value, ...x.rows.value], $.value = c, O.value = x.more.value;
    }
    function s(b) {
      F.value = b.key, k.value = [], n(b);
    }
    function T() {
      R.value = !1, F.value = null, E.value = null, j.value = "";
    }
    function Q() {
      P.value = !1, T();
    }
    async function ee(b, c, x, U) {
      if (N.value || a.readOnly) return;
      const ue = Number(U);
      if (!String(U).trim() || !Number.isInteger(ue) || ue < 0) {
        j.value = "Use a whole number of 0 or more.";
        return;
      }
      N.value = !0, j.value = "";
      const ve = await a.run(["setting", "set", c, String(ue), "--environment", a.environment]);
      ve.ok ? (await a.reload("limits"), H.value = "Saved.") : j.value = ve.error, N.value = !1;
    }
    async function oe(b) {
      if (!K.value.trim() || N.value) return;
      N.value = !0;
      const c = await a.run(["agent", "retire", String(b.id), "--reason", K.value.trim()]);
      j.value = c.ok ? "" : "The agent could not be retired. Try again.", c.ok && (E.value = null, K.value = "", H.value = "Agent retired permanently.", await a.reload("limits"), await n(r.value)), N.value = !1;
    }
    function X(b) {
      Q(), o("open-agent", b);
    }
    return (b, c) => (t(), l(V, null, [
      p("button", {
        class: "counts-button",
        type: "button",
        title: "Agent counts",
        "aria-label": "Agent counts",
        "data-agent-counts": "",
        onClick: c[0] || (c[0] = (x) => P.value = !0)
      }, [
        w(i(fe), {
          name: "settings",
          size: 16
        }),
        Y.value ? (t(), l("span", kn, v(Y.value), 1)) : g("", !0)
      ]),
      P.value ? (t(), q(i(st), {
        key: 0,
        title: J.value,
        modal: "",
        fits: "",
        onClose: Q,
        onEscape: Q
      }, {
        foot: C(() => [
          R.value ? (t(), l(V, { key: 0 }, [
            p("span", An, v(H.value || `Changes apply to ${i(a).environment}.`), 1),
            w(i(ne), { onClick: T }, {
              default: C(() => [...c[19] || (c[19] = [
                m("Done", -1)
              ])]),
              _: 1
            })
          ], 64)) : r.value ? g("", !0) : (t(), q(i(ne), {
            key: 1,
            disabled: i(a).readOnly,
            "data-agent-limits-edit": "",
            onClick: c[5] || (c[5] = (x) => R.value = !0)
          }, {
            default: C(() => [...c[20] || (c[20] = [
              m("Change the maximums", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]))
        ]),
        default: C(() => [
          p("div", yn, [
            R.value || r.value ? (t(), l("button", {
              key: 0,
              class: "back",
              type: "button",
              onClick: T
            }, "‹ Back to the counts")) : g("", !0),
            i(f) ? (t(), l(V, { key: 1 }, [
              c[7] || (c[7] = p("strong", null, "The counts could not be read", -1)),
              c[8] || (c[8] = p("p", null, "The journal did not answer.", -1)),
              w(i(ne), {
                small: "",
                onClick: c[1] || (c[1] = (x) => i(a).reload("limits"))
              }, {
                default: C(() => [...c[6] || (c[6] = [
                  m("Try again", -1)
                ])]),
                _: 1
              })
            ], 64)) : R.value ? (t(), q(fn, {
              key: 2,
              rows: i(h),
              pending: N.value,
              "read-only": i(a).readOnly,
              environment: i(a).environment,
              onChange: ee
            }, null, 8, ["rows", "pending", "read-only", "environment"])) : r.value ? (t(), l(V, { key: 3 }, [
              p("p", null, [
                p("strong", null, v(r.value.running) + " of " + v(r.value.run_limit), 1),
                c[9] || (c[9] = m(" running, ", -1)),
                p("strong", null, [
                  m(v(r.value.kept), 1),
                  r.value.kept_limit ? (t(), l(V, { key: 0 }, [
                    m(" of " + v(r.value.kept_limit), 1)
                  ], 64)) : g("", !0)
                ]),
                c[10] || (c[10] = m(" kept", -1))
              ]),
              p("p", null, v(M.value), 1),
              G.value.length ? g("", !0) : (t(), l(V, { key: 0 }, [
                c[11] || (c[11] = p("strong", null, "No agents here yet", -1)),
                c[12] || (c[12] = p("p", null, "An agent shows here as soon as one of this type starts.", -1))
              ], 64)),
              (t(!0), l(V, null, _(G.value, (x) => {
                var U, ue, ve, ke, L;
                return t(), l("div", {
                  key: x.id,
                  class: "person",
                  "data-count-agent": x.id
                }, [
                  p("span", {
                    class: ie(["dot", { running: x.state === "running" }])
                  }, null, 2),
                  p("div", wn, [
                    p("strong", null, v(((U = x.facts) == null ? void 0 : U.given_name) || x.id), 1),
                    m(" " + v(x.state === "running" ? "Running" : "Idle") + ", " + v(i(Ne)(x.state === "running" ? x.process_started_at || x.created_at : x.ended_at, i(I))), 1),
                    p("small", null, v([x.program, (ue = x.facts) == null ? void 0 : ue.model, (ve = x.facts) == null ? void 0 : ve.effort, `${x.role} ${x.id}`].filter(Boolean).join(", ")), 1),
                    p("small", null, v(((ke = x.facts) == null ? void 0 : ke.task_title) || ((L = x.facts) == null ? void 0 : L.helper_job)), 1)
                  ]),
                  w(i(ne), {
                    small: "",
                    onClick: (W) => X(x)
                  }, {
                    default: C(() => [...c[13] || (c[13] = [
                      m("Open", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"]),
                  x.state === "idle" && !i(a).readOnly ? (t(), q(i(ne), {
                    key: 0,
                    small: "",
                    onClick: (W) => {
                      E.value = x.id, K.value = "";
                    }
                  }, {
                    default: C(() => [...c[14] || (c[14] = [
                      m("Retire", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"])) : g("", !0),
                  E.value === x.id ? (t(), q(qe, {
                    key: 1,
                    reason: K.value,
                    "onUpdate:reason": c[2] || (c[2] = (W) => K.value = W),
                    pending: N.value,
                    onSubmit: (W) => oe(x),
                    onCancel: c[3] || (c[3] = (W) => E.value = null)
                  }, null, 8, ["reason", "pending", "onSubmit"])) : g("", !0)
                ], 8, bn);
              }), 128)),
              O.value ? (t(), q(i(ne), {
                key: 1,
                small: "",
                onClick: c[4] || (c[4] = (x) => n(r.value, $.value + 1))
              }, {
                default: C(() => [...c[15] || (c[15] = [
                  m("Show more", -1)
                ])]),
                _: 1
              })) : g("", !0)
            ], 64)) : (t(), l(V, { key: 4 }, [
              c[17] || (c[17] = p("p", null, "Kept agents have not been retired, so they can take another job. Open an item to see them.", -1)),
              c[18] || (c[18] = p("div", { class: "columns" }, [
                p("span", null, "Name"),
                p("span", null, "Running"),
                p("span", null, "Kept"),
                p("span")
              ], -1)),
              S.value ? (t(), l("div", Mn, [
                c[16] || (c[16] = p("strong", null, "Helpers", -1)),
                p("span", null, v(S.value.running) + " running, " + v(S.value.kept) + " kept", 1)
              ])) : g("", !0),
              (t(!0), l(V, null, _(D.value, (x) => (t(), l("button", {
                key: x.key,
                type: "button",
                class: "count-row",
                "data-agent-limit-type": x.type || x.key,
                "data-agent-limit-profile": x.profile,
                onClick: (U) => s(x)
              }, [
                p("strong", null, v(x.label), 1),
                (t(!0), l(V, null, _([{ count: x.running, limit: x.run_limit, unlimited: !1 }, { count: x.kept, limit: x.kept_limit, unlimited: !0 }], (U) => (t(), l("span", {
                  key: U.unlimited,
                  class: ie({ full: Z(U.count, U.limit) })
                }, [
                  p("span", null, [
                    m(v(U.count), 1),
                    U.limit || !U.unlimited ? (t(), l(V, { key: 0 }, [
                      m(" of " + v(U.limit), 1)
                    ], 64)) : g("", !0)
                  ]),
                  U.limit ? (t(), l("span", xn, [
                    p("span", {
                      style: he({ width: u(U.count, U.limit) })
                    }, null, 4),
                    p("i", {
                      style: he({ width: A(U.count, U.limit) })
                    }, null, 4)
                  ])) : g("", !0)
                ], 2))), 128)),
                w(i(fe), {
                  name: "chevronRight",
                  size: 12
                })
              ], 8, $n))), 128))
            ], 64)),
            j.value ? (t(), l("p", Cn, v(j.value), 1)) : H.value ? (t(), l("p", Sn, v(H.value), 1)) : g("", !0)
          ])
        ]),
        _: 1
      }, 8, ["title"])) : g("", !0)
    ], 64));
  }
}, Tn = /* @__PURE__ */ ae(jn, [["__scopeId", "data-v-23a6fa78"]]), Rn = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, On = ["data-agent-row"], Ve = "journal.agents.filters", je = "cubic-bezier(0.2, 0.9, 0.25, 1)", zn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const d = e, o = xe(), { rows: a } = o.props.waits, { rows: h } = o.props.progress, { rows: f, failure: k, loaded: $, more: O } = o.props.agents, I = (L) => h.value.find((W) => W.agent_id === L.id) ?? null, P = (L) => {
      var W;
      return ((W = a.value.find((B) => B.agent_id === L.id)) == null ? void 0 : W.reason) ?? "";
    }, F = z("running"), R = z(""), N = JSON.parse(localStorage.getItem(Ve) || '{"roles":[],"profiles":[],"programs":[]}'), j = z(N), H = y(() => o.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: E } = o.props.programs, K = y(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), D = (L, W) => {
      j.value = dt(j.value, L, W);
    }, Z = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, Y = (L) => L.slice(0, 1).toUpperCase() + L.slice(1);
    ce(j, (L) => localStorage.setItem(Ve, JSON.stringify(L)));
    const S = z(25);
    function r() {
      Object.assign(o.state, {
        "agents.show": F.value,
        "agents.search": R.value,
        "agents.limit": String(S.value),
        "agents.roles": j.value.roles.join(","),
        "agents.profiles": j.value.profiles.join(","),
        "agents.programs": j.value.programs.join(",")
      });
    }
    async function G() {
      return S.value += 25, r(), await o.reload("agents"), !0;
    }
    ce([F, R, j], () => {
      S.value = 25, r(), o.reload("agents");
    }), r();
    const M = (L) => L.facts ?? null, u = f, A = y(() => !!R.value.trim() || K.value > 0), J = y(() => d.texts[F.value] ?? { title: d.empty, hint: "" }), n = z(null), s = z(null), T = z(null), Q = z(null), ee = y(() => n.value === null ? null : o.props[`card.${n.value}`].rows.value.find((L) => L.id === n.value) ?? s.value), oe = y(() => ee.value ? [ee.value] : u.value), X = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let b = !1, c = 0;
    async function x(L) {
      if (b) return;
      b = !0, c = Q.value.scrollTop;
      const W = T.value.querySelector(`[data-agent-open="${L.id}"]`);
      if (!X()) {
        const de = [...T.value.querySelectorAll(".agent-row")].filter((re) => !re.contains(W));
        await Promise.all(de.map((re) => re.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const B = [...W.querySelectorAll(".agent-head, .agent-line")], te = [...B, ...W.querySelectorAll("[data-agent-motion]")], Ce = te.map((de) => de.getBoundingClientRect());
      if (s.value = L, n.value = L.id, o.reload(`card.${L.id}`), await Be(), !X()) {
        const de = te.map((re) => re.getBoundingClientRect());
        te.forEach((re, Se) => {
          const pe = B.indexOf(re.parentElement), Fe = Ce[Se].left - de[Se].left - (pe < 0 ? 0 : Ce[pe].left - de[pe].left), Pe = Ce[Se].top - de[Se].top - (pe < 0 ? 0 : Ce[pe].top - de[pe].top);
          re.animate([{ transform: `translate(${Fe}px, ${Pe}px)` }, { transform: "none" }], { duration: 280, easing: je });
        }), T.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((re) => {
          re.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: je, fill: "backwards" });
        });
      }
      b = !1;
    }
    async function U() {
      if (b || !ee.value) return;
      b = !0;
      const L = T.value.querySelector(`[data-agent-open="${n.value}"]`), W = [...L.children], B = X() ? [] : W.map((te) => te.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(B.map((te) => te.finished)), n.value = null, await Be(), Q.value.scrollTop = c, B.forEach((te) => te.cancel()), X() || (L.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: je }), T.value.querySelectorAll(".agent-row").forEach((te) => {
        te.contains(L) || te.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: je });
      })), b = !1;
    }
    function ue(L) {
      s.value = L, n.value = L.id, o.reload(`card.${L.id}`);
    }
    const ve = (L) => n.value === L.id ? U() : x(L);
    ce(R, (L) => L.trim() && (n.value = null)), ce(F, () => {
      n.value = null;
    });
    const ke = (L) => {
      L.key === "Escape" && U();
    };
    return window.addEventListener("keydown", ke), we(() => window.removeEventListener("keydown", ke)), (L, W) => (t(), l("div", {
      ref_key: "agents",
      ref: T,
      class: ie(["agents", { focused: ee.value }])
    }, [
      w(i(rt), {
        modelValue: R.value,
        "onUpdate:modelValue": W[1] || (W[1] = (B) => R.value = B),
        placeholder: "Search agents",
        "menu-count": K.value,
        "data-agents-search": ""
      }, {
        menu: C(() => [
          w(i(Re), null, {
            default: C(() => [...W[2] || (W[2] = [
              m("Type", -1)
            ])]),
            _: 1
          }),
          (t(!0), l(V, null, _(H.value.roles, (B) => (t(), q(i(Ae), {
            key: B,
            role: "menuitemcheckbox",
            "aria-checked": j.value.roles.includes(B),
            checked: j.value.roles.includes(B),
            "data-filter-role": B,
            onClick: (te) => D("roles", B)
          }, {
            default: C(() => [
              m(v(Y(B)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          H.value.profiles.length ? (t(), q(i(Re), { key: 0 }, {
            default: C(() => [...W[3] || (W[3] = [
              m("Profile", -1)
            ])]),
            _: 1
          })) : g("", !0),
          (t(!0), l(V, null, _(H.value.profiles, (B) => (t(), q(i(Ae), {
            key: B.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.profiles.includes(B.name),
            checked: j.value.profiles.includes(B.name),
            "data-filter-profile": B.name,
            onClick: (te) => D("profiles", B.name)
          }, {
            default: C(() => [
              m(v(B.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          w(i(Re), null, {
            default: C(() => [...W[4] || (W[4] = [
              m("Program", -1)
            ])]),
            _: 1
          }),
          (t(!0), l(V, null, _(i(E), (B) => (t(), q(i(Ae), {
            key: B.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.programs.includes(B.name),
            checked: j.value.programs.includes(B.name),
            "data-filter-program": B.name,
            onClick: (te) => D("programs", B.name)
          }, {
            default: C(() => [
              m(v(B.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          K.value ? (t(), q(i(Ae), {
            key: 1,
            "data-filter-clear": "",
            onClick: Z
          }, {
            default: C(() => [...W[5] || (W[5] = [
              m("Clear filters", -1)
            ])]),
            _: 1
          })) : g("", !0)
        ]),
        default: C(() => [
          w(i(it), {
            options: H.value.states,
            value: F.value,
            onPick: W[0] || (W[0] = (B) => F.value = B)
          }, null, 8, ["options", "value"]),
          w(Tn, { onOpenAgent: ue })
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      F.value === "retired" && H.value.upgrade_retired ? (t(), l("p", Rn, "Retired during the upgrade: " + v(H.value.upgrade_retired), 1)) : g("", !0),
      p("div", {
        ref_key: "list",
        ref: Q,
        class: ie(["agents-view", { "agents-view-open": ee.value }])
      }, [
        i($) && !i(k) && !oe.value.length && K.value ? (t(), q(i(Oe), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: C(() => [
            w(i(ne), {
              small: "",
              "data-empty-clear": "",
              onClick: Z
            }, {
              default: C(() => [...W[6] || (W[6] = [
                m("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (t(), q(i(ut), {
          key: 1,
          rows: oe.value,
          failure: i(k),
          loaded: i($),
          more: !ee.value && i(O),
          older: G,
          empty: J.value.title,
          hint: J.value.hint,
          searching: A.value
        }, {
          default: C(({ row: B }) => [
            p("div", {
              class: "agent-row",
              "data-agent-row": B.id
            }, [
              w(sn, {
                row: B,
                facts: M(B),
                progress: I(B),
                "wait-reason": P(B),
                open: B.id === n.value,
                onToggle: (te) => ve(B)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, On)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, Hn = /* @__PURE__ */ ae(zn, [["__scopeId", "data-v-06777d49"]]);
export {
  Hn as A
};
