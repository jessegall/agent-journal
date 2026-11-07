/* @code-commandments-generated */
import { openBlock as t, createElementBlock as l, withModifiers as ne, unref as s, createTextVNode as m, toDisplayString as d, createVNode as b, createBlock as P, withCtx as $, Fragment as I, renderList as Q, createElementVNode as p, createCommentVNode as h, computed as y, ref as E, watch as ie, onUnmounted as fe, defineAsyncComponent as Ue, createSlots as Ke, resolveDynamicComponent as _e, normalizeStyle as ve, normalizeClass as se, renderSlot as ke, onMounted as Je, Teleport as Ze, mergeProps as Ge, toRef as Ae, withKeys as Oe, nextTick as ze } from "vue";
import { peekRef as ye, Icon as ge, RunningCommand as Ye, FoldGroup as He, TaskStatusIcon as Qe, useWindow as be, loadWindowComponent as Xe, coalesced as et, READ_RATES as tt, InnerTabs as at, TabBody as nt, SwitchCase as Le, EmptyState as Te, Btn as ae, TextArea as lt, TextInput as ot, useNow as Ie, age as Ee, perHour as st, TimeAgo as xe, Dialog as rt, SearchBar as it, Segmented as ut, MenuLabel as je, MenuItem as Ce, RowList as dt, toggleFilter as ct } from "@journal/window-kit";
import { _ as ee, T as pt } from "./TranscriptRows-DfA-cZXn.js";
const vt = {
  class: "agent-command",
  "data-agent-command": ""
}, gt = {
  key: 1,
  "data-agent-stopped": ""
}, ht = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (i, o) => (t(), l("span", vt, [
      e.waitReason ? (t(), l("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: o[0] || (o[0] = ne((a) => s(ye)("test_queue:0"), ["stop"]))
      }, [
        m("Waiting: " + d(e.waitReason) + " ", 1),
        b(s(ge), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (t(), l("span", gt, "Waiting")) : (t(), P(s(Ye), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, mt = /* @__PURE__ */ ee(ht, [["__scopeId", "data-v-1b371fb5"]]), ft = ["data-agent-delegated", "onClick"], kt = { class: "agent-task-number" }, yt = { class: "agent-task-title" }, bt = ["title"], wt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: i }) {
    const o = i;
    return (a, f) => (t(), P(s(He), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: f[0] || (f[0] = (x) => o("toggle"))
    }, {
      default: $(() => [
        (t(!0), l(I, null, Q(e.section.tasks, (x) => (t(), l("button", {
          key: x.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": x.id,
          onClick: (R) => s(ye)(`tasks:${x.id}`)
        }, [
          b(s(Qe), {
            status: x.state
          }, null, 8, ["status"]),
          p("span", kt, d(x.id), 1),
          p("span", yt, d(x.title), 1),
          x.plan_id ? (t(), l("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${x.plan_id}: ${x.plan_title}`
          }, "Plan " + d(x.plan_id) + ": " + d(x.plan_title), 9, bt)) : h("", !0)
        ], 8, ft))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Mt = /* @__PURE__ */ ee(wt, [["__scopeId", "data-v-238ff959"]]), $t = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, xt = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Ct = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, St = ["data-peek", "onClick"], At = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, jt = {
  key: 0,
  class: "agent-helper-brief"
}, Tt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Rt = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Ot = "It ended without a report", zt = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const i = e, o = ["started", "blocked", "open", "completed"], a = y(() => {
      var u, j;
      return i.row.ended_at && ((j = (u = i.facts) == null ? void 0 : u.job_returned) != null && j.startsWith(Ot)) ? i.facts.job_returned : "";
    }), f = y(() => i.tasks.length ? o.map((u) => ({ state: u, label: u.slice(0, 1).toUpperCase() + u.slice(1), tasks: i.tasks.filter((j) => j.state === u || u === "started" && j.state === "testing" || u === "completed" && j.state === "cancelled") })) : []), x = /* @__PURE__ */ new Set(["completed"]), R = E({}), C = (u) => !(R.value[u] ?? x.has(u)), V = (u) => R.value = { ...R.value, [u]: C(u) }, N = be(), { rows: F } = N.props.reports;
    N.state["reports.agent"] = String(i.row.id);
    const L = y(() => i.row.access === "read-only"), O = y(() => !!i.row.retired_at || i.row.state === "retired"), U = ["tasks", "transcript", "terminal", "file-feed", "reports"], T = y(() => (O.value ? N.tabs.filter((j) => ["reports", "transcript"].includes(j.key)) : L.value ? N.tabs.filter((j) => ["reports", "transcript", "terminal"].includes(j.key)) : [...N.tabs]).sort((j, v) => (U.indexOf(j.key) < 0 ? U.length : U.indexOf(j.key)) - (U.indexOf(v.key) < 0 ? U.length : U.indexOf(v.key)))), q = () => L.value || O.value ? T.value.find((u) => u.key === "transcript") : T.value[0], D = E(q());
    ie(D, (u) => {
      N.state.tab = (u == null ? void 0 : u.key) ?? "";
    }, { immediate: !0 }), fe(() => {
      N.state.tab = "";
    }), ie(T, (u) => {
      u.some((j) => {
        var v;
        return j.key === ((v = D.value) == null ? void 0 : v.key);
      }) || (D.value = u[0]);
    }), ie(() => i.open, (u) => {
      u && (D.value = q());
    });
    const Z = Object.fromEntries(N.tabs.filter((u) => u.component).map((u) => [u.key, Ue(() => Xe(u.component))])), K = E(!1), { data: G } = N.props.tool, _ = y(() => {
      var u;
      return ((u = G.value) == null ? void 0 : u.tool) ?? "";
    }), M = y(() => {
      var u;
      return ((u = G.value) == null ? void 0 : u.note) ?? "";
    }), c = y(() => i.row.role !== "main" && (!i.row.ended_at || i.stoppedWithWork || i.waitReason));
    async function A() {
      !i.open || !c.value || (N.state["tool.agent"] = String(i.row.id), await N.reload("tool"));
    }
    const z = N.follow(["hook_call.*", "process_part.*"], et(A, tt.agentCommand));
    return fe(() => z == null ? void 0 : z()), ie(() => i.open, (u) => {
      u && A();
    }, { immediate: !0 }), (u, j) => {
      var v;
      return t(), l("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: j[2] || (j[2] = ne(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (t(), l("p", $t, "Retirement reason: " + d(e.row.retirement_reason), 1)) : h("", !0),
        e.row.resume_reason ? (t(), l("p", xt, d(e.row.resume_reason), 1)) : h("", !0),
        c.value ? (t(), P(mt, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: _.value,
          note: M.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : h("", !0),
        a.value ? (t(), l("p", Ct, d(a.value), 1)) : h("", !0),
        b(s(at), {
          class: "agent-tabs",
          tabs: T.value,
          active: D.value,
          answer: { tasks: e.tasks.length, reports: s(F).length },
          onChoose: j[0] || (j[0] = (n) => D.value = n)
        }, null, 8, ["tabs", "active", "answer"]),
        b(s(nt), {
          class: "agent-tab-body",
          tab: D.value,
          "data-agent-tab-body": (v = D.value) == null ? void 0 : v.key
        }, {
          default: $(() => {
            var n;
            return [
              b(s(Le), {
                value: (n = D.value) == null ? void 0 : n.key
              }, Ke({
                reports: $(() => [
                  s(F).length ? h("", !0) : (t(), P(s(Te), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: $(() => [...j[3] || (j[3] = [
                      m("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (t(!0), l(I, null, Q(s(F), (w) => (t(), l("button", {
                    key: w.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${w.id}`,
                    onClick: (H) => s(ye)(`messages:${w.id}`)
                  }, d(w.text), 9, St))), 128))
                ]),
                tasks: $(() => {
                  var w;
                  return [
                    e.tasks.length ? h("", !0) : (t(), P(s(Te), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: $(() => [...j[4] || (j[4] = [
                        m("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (t(!0), l(I, null, Q(f.value, (H) => (t(), P(Mt, {
                      key: H.state,
                      section: H,
                      open: C(H.state),
                      onToggle: (k) => V(H.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (w = e.facts) != null && w.instruction ? (t(), l(I, { key: 1 }, [
                      j[5] || (j[5] = p("p", { class: "agent-label" }, "Instruction", -1)),
                      p("div", At, d(e.facts.instruction), 1)
                    ], 64)) : h("", !0)
                  ];
                }),
                transcript: $(() => {
                  var w;
                  return [
                    L.value ? (t(), l(I, { key: 0 }, [
                      (w = e.facts) != null && w.instruction ? (t(), l("div", jt, [
                        b(s(He), {
                          label: "Instruction",
                          open: K.value,
                          "data-agent-section": "instruction",
                          onToggle: j[1] || (j[1] = (H) => K.value = !K.value)
                        }, {
                          default: $(() => [
                            p("div", Tt, d(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (t(), l("p", Rt, "No job recorded")) : h("", !0)
                    ], 64)) : h("", !0),
                    b(pt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                Q(s(Z), (w, H) => ({
                  name: H,
                  fn: $(() => [
                    (t(), P(_e(w), {
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
}, Vt = /* @__PURE__ */ ee(zt, [["__scopeId", "data-v-71b8d2b0"]]), Bt = { class: "action-field" }, Ht = ["value", "disabled"], Lt = ["value"], It = { key: 1 }, Et = {
  key: 1,
  class: "action-field"
}, Nt = { class: "action-buttons" }, qt = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (i, o) => (t(), l("form", {
      onSubmit: o[4] || (o[4] = ne((a) => i.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (t(), l(I, { key: 0 }, [
        p("label", Bt, [
          o[6] || (o[6] = m("Task ", -1)),
          p("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: o[0] || (o[0] = (a) => i.$emit("update:task", a.target.value))
          }, [
            o[5] || (o[5] = p("option", { value: "" }, "Choose an open task", -1)),
            (t(!0), l(I, null, Q(e.tasks, (a) => (t(), l("option", {
              key: a.id,
              value: String(a.id)
            }, d(a.id) + ": " + d(a.title), 9, Lt))), 128))
          ], 40, Ht)
        ]),
        e.moreTasks ? (t(), P(s(ae), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: o[1] || (o[1] = (a) => i.$emit("more"))
        }, {
          default: $(() => [...o[7] || (o[7] = [
            m("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : h("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (t(), l("p", It, "No open tasks.")) : h("", !0)
      ], 64)) : (t(), l("label", Et, [
        o[8] || (o[8] = m("Job", -1)),
        b(s(lt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: o[2] || (o[2] = (a) => i.$emit("update:text", a.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      p("div", Nt, [
        b(s(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: $(() => [...o[9] || (o[9] = [
            m("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        b(s(ae), {
          small: "",
          disabled: e.pending,
          onClick: o[3] || (o[3] = (a) => i.$emit("cancel"))
        }, {
          default: $(() => [...o[10] || (o[10] = [
            m("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Wt = /* @__PURE__ */ ee(qt, [["__scopeId", "data-v-adde4158"]]), Ft = { class: "action-buttons" }, Dt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (i, o) => (t(), l("form", {
      "data-agent-retire-confirm": "",
      onSubmit: o[2] || (o[2] = ne((a) => i.$emit("submit"), ["prevent"]))
    }, [
      o[5] || (o[5] = p("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      b(s(ot), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": o[0] || (o[0] = (a) => i.$emit("update:reason", a))
      }, null, 8, ["model-value", "disabled"]),
      p("div", Ft, [
        b(s(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: $(() => [...o[3] || (o[3] = [
            m("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        b(s(ae), {
          small: "",
          disabled: e.pending,
          onClick: o[1] || (o[1] = (a) => i.$emit("cancel"))
        }, {
          default: $(() => [...o[4] || (o[4] = [
            m("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Ne = /* @__PURE__ */ ee(Dt, [["__scopeId", "data-v-23a905c0"]]), Pt = { class: "action-buttons" }, Ut = {
  key: 0,
  role: "alert"
}, Kt = {
  key: 1,
  role: "status"
}, _t = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const i = e, o = be(), a = E(""), f = E(""), x = E(""), R = E(""), C = E([]), V = E(0), N = E(!1), F = E(!1), L = E(!1), O = E(""), U = E(""), T = y(() => !!i.row.retired_at || i.row.state === "retired"), q = y(() => !T.value && !!i.row.ended_at), D = y(() => {
      var z;
      return q.value && ((z = i.row.job_command) == null ? void 0 : z.length) && !i.row.resume_reason;
    }), Z = y(() => D.value && !F.value && (i.row.job_task_flag ? C.value.some((z) => String(z.id) === R.value) : !!f.value.trim()));
    function K(z) {
      a.value = z, f.value = "", x.value = "", R.value = "", O.value = "", U.value = "";
    }
    async function G() {
      K("job"), i.row.job_task_flag && (C.value = [], V.value = 0, N.value = !1, await _());
    }
    async function _() {
      if (!F.value) {
        F.value = !0;
        try {
          o.state["jobs.page"] = String(V.value + 1), await o.reload("jobs");
          const z = o.props.jobs;
          O.value = z.failure.value, O.value || (C.value = [...C.value, ...z.rows.value], V.value = z.data.value.page, N.value = z.more.value);
        } finally {
          F.value = !1;
        }
      }
    }
    async function M(z, u) {
      if (!L.value) {
        L.value = !0, O.value = "";
        try {
          const j = await o.run(z);
          O.value = j.ok ? "" : j.error, j.ok && (K(""), U.value = u);
        } finally {
          L.value = !1;
        }
      }
    }
    async function c() {
      if (!Z.value) return;
      const z = i.row.job_task_flag ? [i.row.job_task_flag, R.value] : [f.value.trim()];
      await M([...i.row.job_command, String(i.row.id), ...z], "Job sent.");
    }
    async function A() {
      !q.value || a.value !== "retire" || !x.value.trim() || await M(["agent", "retire", String(i.row.id), "--reason", x.value.trim()], "Agent retired permanently.");
    }
    return (z, u) => {
      var j;
      return T.value ? h("", !0) : (t(), l("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: u[6] || (u[6] = ne(() => {
        }, ["stop"])),
        onKeydown: u[7] || (u[7] = ne(() => {
        }, ["stop"]))
      }, [
        p("div", Pt, [
          q.value ? (t(), l(I, { key: 0 }, [
            (j = e.row.job_command) != null && j.length ? (t(), P(s(ae), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: L.value || F.value || !D.value,
              onClick: G
            }, {
              default: $(() => [...u[8] || (u[8] = [
                m("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0),
            e.row.role !== "main" ? (t(), P(s(ae), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: L.value || F.value,
              onClick: u[0] || (u[0] = (v) => K("retire"))
            }, {
              default: $(() => [...u[9] || (u[9] = [
                m("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0)
          ], 64)) : h("", !0)
        ]),
        b(s(Le), { value: a.value }, {
          job: $(() => [
            b(Wt, {
              task: R.value,
              "onUpdate:task": u[1] || (u[1] = (v) => R.value = v),
              text: f.value,
              "onUpdate:text": u[2] || (u[2] = (v) => f.value = v),
              row: e.row,
              tasks: C.value,
              pending: L.value,
              loading: F.value,
              "more-tasks": N.value,
              failure: O.value,
              "job-ready": Z.value,
              onSubmit: c,
              onMore: _,
              onCancel: u[3] || (u[3] = (v) => K(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: $(() => [
            b(Ne, {
              reason: x.value,
              "onUpdate:reason": u[4] || (u[4] = (v) => x.value = v),
              pending: L.value,
              onSubmit: A,
              onCancel: u[5] || (u[5] = (v) => K(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        O.value ? (t(), l("p", Ut, d(O.value), 1)) : h("", !0),
        U.value ? (t(), l("p", Kt, d(U.value), 1)) : h("", !0)
      ], 32));
    };
  }
}, Jt = /* @__PURE__ */ ee(_t, [["__scopeId", "data-v-4cb32275"]]), Zt = {
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
    return (i, o) => (t(), l("span", Zt, [
      e.rate ? (t(), l("span", Gt, d(e.rate), 1)) : h("", !0),
      p("span", Yt, d(e.count), 1)
    ]));
  }
}, Ve = /* @__PURE__ */ ee(Qt, [["__scopeId", "data-v-44694015"]]), Xt = ["data-icon", "stroke-width", "innerHTML"], te = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const i = e, o = { right: 0, down: 90, left: 180, up: 270 }, a = {
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
    }, f = {
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
    return (x, R) => (t(), l("svg", {
      class: "ico",
      "data-icon": e.name,
      style: ve({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...i.facing === "right" ? {} : { transform: `rotate(${o[i.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: f[a[e.name] || e.name] || f.dot
    }, null, 12, Xt));
  }
}, ea = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, ta = {
  key: 1,
  class: "menu-item-text"
}, aa = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (i, o) => (t(), l("button", {
      type: "button",
      class: se(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (t(), l("span", ea, d(e.checked ? "✓" : ""), 1)) : h("", !0),
      e.description ? (t(), l("span", ta, [
        p("span", null, [
          ke(i.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, d(e.description), 1)
      ])) : ke(i.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, pe = /* @__PURE__ */ ee(aa, [["__scopeId", "data-v-fec99974"]]), na = {}, la = { class: "menu-label" };
function oa(e, i) {
  return t(), l("span", la, [
    ke(e.$slots, "default", {}, void 0, !0)
  ]);
}
const me = /* @__PURE__ */ ee(na, [["render", oa], ["__scopeId", "data-v-aa955b3e"]]), sa = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, ra = {
  key: 0,
  class: "skills-none"
}, ia = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: i }) {
    const o = e, a = i, f = y(() => o.skills.filter((R) => R.state === "loaded")), x = y(() => o.skills.filter((R) => R.state !== "loaded"));
    return (R, C) => (t(), l("div", sa, [
      b(me, null, {
        default: $(() => [...C[1] || (C[1] = [
          m("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      f.value.length ? h("", !0) : (t(), l("p", ra, "None yet. Compacting the conversation empties this list.")),
      (t(!0), l(I, null, Q(f.value, (V) => (t(), l("p", {
        key: V.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        b(te, {
          name: "book",
          size: 12
        }),
        m(d(V.skill), 1)
      ]))), 128)),
      x.value.length ? (t(), l(I, { key: 1 }, [
        b(me, null, {
          default: $(() => [...C[2] || (C[2] = [
            m("Still to read", -1)
          ])]),
          _: 1
        }),
        (t(!0), l(I, null, Q(x.value, (V) => (t(), l("p", {
          key: V.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          b(te, {
            name: "book",
            size: 12
          }),
          m(d(V.skill), 1)
        ]))), 128))
      ], 64)) : h("", !0),
      b(pe, {
        "data-agent-skills-browse": "",
        onClick: C[0] || (C[0] = (V) => a("browse"))
      }, {
        default: $(() => [...C[3] || (C[3] = [
          m("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, ua = /* @__PURE__ */ ee(ia, [["__scopeId", "data-v-be514d47"]]), da = (e, i, o) => Math.max(i, Math.min(o, e)), qe = /* @__PURE__ */ new WeakMap(), ca = (e, i) => qe.set(e, i);
function pa(e, i) {
  for (let o = i; o; o = qe.get(o) ?? o.parentElement) if (o === e) return !0;
  return !1;
}
function va(e, i) {
  const o = (a) => {
    var x, R;
    const f = ((x = e.value) == null ? void 0 : x.element) || ((R = e.value) == null ? void 0 : R.$el) || e.value;
    f && !pa(f, a.target) && i(a);
  };
  window.addEventListener("click", o), fe(() => window.removeEventListener("click", o));
}
const ce = 8, ga = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: i, emit: o }) {
    const a = e, f = E(null), x = (n) => n ? `${n}px` : void 0, R = y(() => ({
      minWidth: x(a.minWidth),
      maxWidth: x(a.maxWidth),
      maxHeight: x(a.maxHeight),
      height: x(a.height)
    })), C = E({ w: 0, h: 0 }), V = E(a.anchor ? a.anchor.getBoundingClientRect() : null), N = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), F = (n) => ({
      left: Math.max(0, n.left),
      top: Math.max(0, n.top),
      right: Math.min(window.innerWidth, n.right),
      bottom: Math.min(window.innerHeight, n.bottom)
    }), L = (n) => {
      const w = n.closest(".pane, .float-window");
      return w ? F(w.getBoundingClientRect()) : N();
    }, O = (n, w) => `${Math.max(0, n ? Math.min(n, w) : w)}px`;
    function U(n, w) {
      return {
        below: n.bottom - w.bottom - a.gap - ce,
        above: w.top - n.top - a.gap - ce,
        across: n.right - n.left - 2 * ce
      };
    }
    function T(n) {
      const w = L(a.anchor), H = U(w, n);
      return C.value.w <= H.across && C.value.h <= Math.max(H.below, H.above) ? w : N();
    }
    const q = y(() => {
      if (!V.value) return R.value;
      const n = V.value, w = T(n), H = U(w, n), { w: k, h: r } = C.value, g = a.align === "auto" ? n.left + n.right > w.left + w.right : a.align === "right", S = da(g ? n.right - k : n.left, w.left + ce, Math.max(w.left + ce, w.right - k - ce)), le = r > H.below && H.above > H.below ? { bottom: `${window.innerHeight - n.top + a.gap}px`, maxHeight: O(a.maxHeight, H.above) } : { top: `${n.bottom + a.gap}px`, maxHeight: O(a.maxHeight, H.below) };
      return { ...R.value, ...le, left: `${S}px`, maxWidth: O(a.maxWidth, H.across) };
    }), D = o, Z = () => [...f.value.querySelectorAll("button:not(:disabled)")];
    function K(n) {
      const w = Z(), H = w.indexOf(document.activeElement);
      w[(H + n + w.length) % w.length].focus();
    }
    const G = { ArrowDown: () => K(1), ArrowUp: () => K(-1), Escape: () => D("close") }, _ = (n) => G[n.key] && (n.preventDefault(), G[n.key]()), M = () => f.value && (C.value = { w: f.value.offsetWidth, h: f.value.scrollHeight });
    let c = 0;
    const A = new ResizeObserver(() => {
      cancelAnimationFrame(c), c = requestAnimationFrame(M);
    });
    va(f, (n) => a.anchor && !a.anchor.contains(n.target) && D("close"));
    const z = (n, w) => ["top", "left", "right", "bottom"].some((H) => Math.abs(n[H] - w[H]) > 1), u = (n) => n.bottom < 0 || n.top > window.innerHeight;
    let j = 0;
    function v() {
      if (a.anchor) {
        const n = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || u(n)) return D("close");
        z(n, V.value) && (V.value = n);
      }
      j = requestAnimationFrame(v);
    }
    return Je(() => {
      a.anchor && f.value && ca(f.value, a.anchor), M(), f.value && A.observe(f.value), !a.plain && Z()[0] && Z()[0].focus(), v();
    }), fe(() => {
      A.disconnect(), cancelAnimationFrame(j), cancelAnimationFrame(c);
    }), i({ element: f }), (n, w) => (t(), P(Ze, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", Ge({
        ref_key: "panel",
        ref: f
      }, n.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: q.value,
        onKeydown: _
      }), [
        ke(n.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ha = /* @__PURE__ */ ee(ga, [["__scopeId", "data-v-3d203970"]]);
async function ma(e, i, o) {
  if (!e) return o(i);
  const { target: a, fields: f } = e, x = Object.fromEntries(Object.keys(f).map((V) => [V, a[V]])), R = () => Object.assign(a, x);
  Object.assign(a, f);
  let C = !1;
  try {
    const V = await o(i);
    return C = V.ok, V;
  } finally {
    C || R();
  }
}
function fa(e, i, o, { groups: a, programs: f }) {
  const x = E({}), R = E(""), C = E(!1), V = y(() => !!e.value && !e.value.ended_at), N = y(() => V.value && !!e.value.paused_at);
  async function F(T, q = null) {
    R.value = "";
    const D = await ma(q, T, i);
    return R.value = D.ok ? "" : D.error, o(), D;
  }
  return { groups: a, programs: f, chosen: x, failure: R, asking: C, running: V, paused: N, choose: (T, q) => F(["agent", "control", String(e.value.id), T, q.value], { target: x, fields: { value: { ...x.value, [T]: q.label } } }), stop: () => (C.value = !1, F(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (T) => F(["agent", "launch", T.name]) };
}
const We = { claude: "Claude Code", codex: "Codex" };
Object.entries(We).map(([e, i]) => ({ key: e, label: i }));
function ka(e, i = "agent") {
  return We[e] || i;
}
function ya(e) {
  if (!e) return "Not compacted yet";
  const i = new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return e.start_percent === null ? `Last compacted ${i}` : e.end_percent === null ? `Last compacted ${i}, from ${e.start_percent}%` : `Last compacted ${i}, from ${e.start_percent}% to ${e.end_percent}%, ${e.start_percent - e.end_percent}% taken off`;
}
const ba = ["disabled", "title"], wa = ["title"], Ma = { class: "gauge usage" }, $a = ["disabled", "title"], xa = { class: "gauge" }, Ca = ["disabled", "title"], Sa = ["disabled"], Aa = ["disabled"], ja = {
  key: 5,
  class: "fact",
  "data-fact": "uptime",
  title: "How long this session has run"
}, Ta = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Ra = ["title"], Oa = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, za = { class: "gauge" }, Va = { class: "context-used" }, Ba = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Ha = 75, La = {
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
  setup(e, { emit: i }) {
    const o = e, a = i, f = fa(Ae(o, "agent"), o.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: Ae(o, "controlGroups"), programs: Ae(o, "agentPrograms") }), x = E(null), R = E(""), C = y(() => f.groups.value.find((M) => M.key === R.value));
    function V(M, c) {
      x.value = M.currentTarget, R.value = c;
    }
    function N() {
      x.value = null, R.value = "", f.asking.value = !1;
    }
    const F = y(() => o.skills.filter((M) => M.state === "loaded"));
    function L(M) {
      V(M, "skills"), a("skills");
    }
    const O = (M) => f.groups.value.some((c) => c.key === M), U = y(() => {
      var M;
      return f.chosen.value.model ?? ((M = q.value) == null ? void 0 : M.model) ?? "";
    }), T = y(() => {
      var M;
      return f.chosen.value.effort ?? ((M = q.value) == null ? void 0 : M.effort) ?? "";
    });
    y(() => !!o.agent && !o.agent.ended_at);
    const q = y(() => {
      var M;
      return ((M = o.usage.agents) == null ? void 0 : M.find((c) => {
        var A;
        return c.id === ((A = o.agent) == null ? void 0 : A.id);
      })) ?? null;
    }), D = y(() => {
      var M;
      return ((M = o.usage.windows) == null ? void 0 : M[0]) ?? null;
    }), Z = y(() => D.value ? Math.max(0, Math.min(100, Math.round(D.value.used_percent))) : null), K = y(() => {
      var M;
      return ((M = q.value) == null ? void 0 : M.context_percent) == null ? null : Math.round(q.value.context_percent);
    }), G = y(() => {
      var M;
      return (M = q.value) != null && M.cost_dollars ? `$${q.value.cost_dollars.toFixed(2)}` : "";
    }), _ = y(() => {
      var A;
      const M = (A = o.agent) != null && A.process_started_at ? new Date(o.agent.process_started_at).getTime() : 0;
      if (!M) return "";
      const c = Math.max(0, Math.floor((o.now - M) / 6e4));
      return c >= 60 ? `${Math.floor(c / 60)}h ${c % 60}m` : `${c}m`;
    });
    return (M, c) => (t(), l("div", {
      class: se(["information", { card: e.card }]),
      "data-information-bar": ""
    }, [
      e.agent ? (t(), l(I, { key: 0 }, [
        p("button", {
          type: "button",
          class: "fact lead",
          disabled: e.card,
          "data-fact": "agent",
          title: `Session ${e.agent.session}: stop it`,
          onClick: c[0] || (c[0] = (A) => V(A, "agent"))
        }, [
          b(te, {
            name: "agents",
            size: 12
          }),
          m(" " + d(s(ka)(e.agent.program)), 1)
        ], 8, ba),
        Z.value !== null ? (t(), l("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${Z.value}% of the plan's ${D.value.title} allowance used`,
          onClick: c[1] || (c[1] = (A) => a("open", "usage", A.currentTarget))
        }, [
          b(te, {
            name: "allowance",
            size: 12
          }),
          c[14] || (c[14] = m()),
          p("span", Ma, [
            p("span", {
              style: ve({ width: `${Z.value}%` })
            }, null, 4)
          ]),
          m(" " + d(Z.value) + "% ", 1)
        ], 8, wa)) : h("", !0),
        K.value !== null ? (t(), l("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "context",
          title: `Context ${K.value}% full: clear or compact it`,
          onClick: c[2] || (c[2] = (A) => O("context") ? V(A, "context") : a("open", "context", A.currentTarget))
        }, [
          b(te, {
            name: "gauge",
            size: 12
          }),
          c[15] || (c[15] = m()),
          p("span", xa, [
            p("span", {
              style: ve({ width: `${K.value}%` })
            }, null, 4)
          ]),
          m(" " + d(K.value) + "% ", 1)
        ], 8, $a)) : h("", !0),
        U.value ? (t(), l("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "model",
          title: `${U.value}: change the model`,
          onClick: c[3] || (c[3] = (A) => O("model") ? V(A, "model") : null)
        }, [
          b(te, {
            name: "model",
            size: 12
          }),
          m(" " + d(U.value), 1)
        ], 8, Ca)) : h("", !0),
        O("effort") || e.card && T.value ? (t(), l("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: c[4] || (c[4] = (A) => V(A, "effort"))
        }, [
          b(te, {
            name: "bolt",
            size: 12
          }),
          m(" " + d(T.value), 1)
        ], 8, Sa)) : h("", !0),
        G.value ? (t(), l("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: c[5] || (c[5] = (A) => a("open", "cost", A.currentTarget))
        }, d(G.value), 9, Aa)) : h("", !0),
        _.value ? (t(), l("span", ja, [
          b(te, {
            name: "reminders",
            size: 12
          }),
          m(" " + d(_.value), 1)
        ])) : h("", !0),
        e.branch ? (t(), l("span", Ta, [
          b(te, {
            name: "branch",
            size: 12
          }),
          m(" " + d(e.branch), 1)
        ])) : h("", !0),
        e.card ? h("", !0) : (t(), l("button", {
          key: 7,
          type: "button",
          class: se(["fact", { none: !e.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: c[6] || (c[6] = (A) => a("open", "jobs", A.currentTarget))
        }, [
          b(te, {
            name: "clock",
            size: 12
          }),
          m(" " + d(e.jobs), 1)
        ], 2)),
        e.run ? (t(), l("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: L
        }, [
          b(te, {
            name: "book",
            size: 12
          }),
          m(" " + d(F.value.length), 1)
        ])) : h("", !0),
        e.fitness ? (t(), l(I, { key: 9 }, [
          p("button", {
            type: "button",
            class: se(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Ha }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: c[7] || (c[7] = (A) => a("open", "fitness", A.currentTarget))
          }, [
            b(te, {
              name: "heart",
              size: 12
            }),
            m(" " + d(e.fitness.is_measured ? e.fitness.score : "–"), 1)
          ], 2),
          p("button", {
            type: "button",
            class: se(["fact", "load-fact", e.fitness.workload_level]),
            "data-fact": "load",
            title: "Compare incoming messages with agent replies",
            onClick: c[8] || (c[8] = (A) => a("open", "load", A.currentTarget))
          }, [
            b(te, {
              name: "weight",
              size: 12
            }),
            m(" " + d(e.fitness.workload), 1)
          ], 2)
        ], 64)) : h("", !0)
      ], 64)) : e.run && !e.loading ? (t(), l("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: c[9] || (c[9] = (A) => V(A, "start"))
      }, [
        b(te, {
          name: "agents",
          size: 12
        }),
        c[16] || (c[16] = m(" Start an agent", -1))
      ])) : h("", !0),
      c[22] || (c[22] = p("span", { class: "space" }, null, -1)),
      s(f).failure.value ? (t(), l("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: s(f).failure.value
      }, d(s(f).failure.value), 9, Ra)) : h("", !0),
      ke(M.$slots, "default", {}, void 0, !0),
      x.value ? (t(), P(ha, {
        key: 3,
        anchor: x.value,
        "min-width": 190,
        onClose: N
      }, {
        default: $(() => {
          var A;
          return [
            R.value === "agent" ? (t(), l(I, { key: 0 }, [
              s(f).asking.value ? (t(), l(I, { key: 0 }, [
                b(me, { "data-agent-stop-ask": "" }, {
                  default: $(() => [...c[17] || (c[17] = [
                    m("Stop the agent? It stops what it is doing.", -1)
                  ])]),
                  _: 1
                }),
                b(pe, {
                  "data-agent-stop-confirm": "",
                  onClick: c[10] || (c[10] = (z) => (N(), s(f).stop()))
                }, {
                  default: $(() => [...c[18] || (c[18] = [
                    m("Stop it", -1)
                  ])]),
                  _: 1
                }),
                b(pe, {
                  onClick: c[11] || (c[11] = (z) => s(f).asking.value = !1)
                }, {
                  default: $(() => [...c[19] || (c[19] = [
                    m("Keep it running", -1)
                  ])]),
                  _: 1
                })
              ], 64)) : (t(), P(pe, {
                key: 1,
                "data-agent-stop": "",
                onClick: c[12] || (c[12] = (z) => s(f).asking.value = !0)
              }, {
                default: $(() => [...c[20] || (c[20] = [
                  m("Stop", -1)
                ])]),
                _: 1
              }))
            ], 64)) : R.value === "start" ? (t(), l(I, { key: 1 }, [
              b(me, null, {
                default: $(() => [...c[21] || (c[21] = [
                  m("Start an agent", -1)
                ])]),
                _: 1
              }),
              (t(!0), l(I, null, Q(s(f).programs.value, (z) => (t(), P(pe, {
                key: z.name,
                "data-agent-program": z.name,
                onClick: (u) => (N(), s(f).start(z))
              }, {
                default: $(() => [
                  m(d(z.title), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-program", "onClick"]))), 128))
            ], 64)) : R.value === "skills" ? (t(), P(ua, {
              key: 2,
              skills: e.skills,
              onBrowse: c[13] || (c[13] = (z) => (N(), a("open", "skills", null)))
            }, null, 8, ["skills"])) : C.value ? (t(), l(I, { key: 3 }, [
              b(me, null, {
                default: $(() => [
                  m(d(C.value.label), 1)
                ]),
                _: 1
              }),
              R.value === "context" ? (t(), l(I, { key: 0 }, [
                p("div", Oa, [
                  p("span", za, [
                    p("span", {
                      style: ve({ width: `${K.value}%` })
                    }, null, 4)
                  ]),
                  p("span", Va, d(K.value) + "%", 1)
                ]),
                p("p", Ba, d(s(ya)(((A = q.value) == null ? void 0 : A.last_compaction) ?? null)), 1)
              ], 64)) : h("", !0),
              (t(!0), l(I, null, Q(C.value.choices, (z) => (t(), P(pe, {
                key: z.value,
                "data-agent-choice": z.value,
                onClick: (u) => (s(f).choose(C.value.key, z), N())
              }, {
                default: $(() => [
                  m(d(z.label), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-choice", "onClick"]))), 128))
            ], 64)) : h("", !0)
          ];
        }),
        _: 1
      }, 8, ["anchor"])) : h("", !0)
    ], 2));
  }
}, Ia = /* @__PURE__ */ ee(La, [["__scopeId", "data-v-5e1b4ab2"]]), Ea = ["data-agent-open", "aria-expanded", "role", "tabindex"], Na = { class: "agent-head" }, qa = ["data-state"], Wa = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Fa = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Da = { class: "agent-times" }, Pa = {
  key: 0,
  class: "agent-time",
  "data-agent-motion": ""
}, Ua = {
  key: 1,
  class: "agent-time",
  "data-agent-motion": ""
}, Ka = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": ""
}, _a = {
  key: 3,
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
}, en = ["title"], tn = ["data-peek"], an = ["data-peek"], nn = ["data-agent-waiting", "data-agent-stopped"], ln = {
  key: 3,
  class: "agent-line agent-work-status",
  "data-agent-blocked-tasks": ""
}, on = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: i }) {
    const o = { helper: "Helper", reviewer: "Reviewer" }, a = e, f = i, x = Ie(), R = y(() => {
      var n, w;
      if ((n = a.facts) != null && n.profile_title) return a.facts.profile_title;
      if ((w = a.facts) != null && w.profile) return a.facts.profile;
      const v = o[a.row.role] || a.row.role;
      return v.slice(0, 1).toUpperCase() + v.slice(1);
    }), C = y(() => {
      var v;
      return ((v = a.facts) == null ? void 0 : v.tasks) ?? [];
    }), V = y(() => C.value.filter((v) => v.state === "open")), N = y(() => C.value.find((v) => {
      var n;
      return v.id === ((n = a.progress) == null ? void 0 : n.task_id) && v.state === "started";
    })), F = y(() => N.value || C.value.find((v) => {
      var n;
      return v.id === ((n = a.facts) == null ? void 0 : n.task_id);
    }) || V.value[0] || C.value.at(-1)), L = y(() => N.value ? C.value.filter((v) => v.state === "blocked") : []), O = y(() => {
      var v, n, w, H, k, r;
      return a.row.role === "helper" ? ((v = a.facts) == null ? void 0 : v.helper_job) || "" : (n = a.facts) != null && n.job_enabled && (((w = N.value) == null ? void 0 : w.title) || ((H = a.facts) == null ? void 0 : H.task_title) || ((k = V.value[0]) == null ? void 0 : k.title) || ((r = C.value.at(-1)) == null ? void 0 : r.title)) || "";
    }), U = y(() => {
      const v = O.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return v ? `${v[1].toLowerCase() === "plan" ? "plans" : "docs"}:${v[2]}` : "";
    }), T = y(() => {
      var v;
      return (v = a.facts) != null && v.job_enabled ? `${a.row.role} ${a.row.id}` : "";
    }), q = y(() => {
      var v, n;
      return [a.row.program, (v = a.facts) == null ? void 0 : v.model, (n = a.facts) == null ? void 0 : n.effort, T.value].filter(Boolean).join(" · ");
    }), D = be(), Z = y(() => Ee(a.row.process_started_at || a.row.created_at, x.value)), K = /* @__PURE__ */ new Set(["open", "started", "testing"]), G = y(() => !!a.row.ended_at && a.row.role !== "main" && C.value.some((v) => K.has(v.state))), _ = y(() => {
      var v;
      return a.row.retired_at || a.row.state === "retired" ? "retired" : a.waitReason || G.value ? "waiting" : a.row.state === "running" && ((v = a.facts) == null ? void 0 : v.state) || a.row.state;
    }), M = y(() => {
      var v;
      return a.waitReason ? `Waiting: ${a.waitReason}` : _.value === "blocked" ? (v = a.facts) != null && v.blocked_reason ? `Blocked: ${a.facts.blocked_reason}` : "Blocked" : G.value ? "Stopped with work left" : "";
    }), c = y(() => {
      var v;
      return ((v = a.progress) == null ? void 0 : v.completed_count) ?? C.value.filter((n) => n.state === "completed").length;
    }), A = y(() => {
      var v;
      return ((v = a.progress) == null ? void 0 : v.task_count) ?? C.value.length;
    }), z = y(() => `${c.value} of ${A.value} ${A.value === 1 ? "task" : "tasks"}`), u = y(() => {
      var n;
      const v = st(c.value, ((n = a.progress) == null ? void 0 : n.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, x.value);
      return a.row.role !== "main" && v ? `${v} per hour` : "";
    }), j = y(() => !!a.row.retired_at || a.row.state === "retired");
    return (v, n) => {
      var w, H, k, r;
      return t(), l("div", {
        class: se(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: n[4] || (n[4] = (g) => !e.open && f("toggle")),
        onKeydown: [
          n[5] || (n[5] = Oe(ne((g) => !e.open && f("toggle"), ["self", "prevent"]), ["enter"])),
          n[6] || (n[6] = Oe(ne((g) => !e.open && f("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        p("span", Na, [
          e.open ? (t(), l("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: n[0] || (n[0] = ne((g) => f("toggle"), ["stop"]))
          }, [
            b(s(ge), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : h("", !0),
          p("span", {
            class: "agent-dot",
            "data-state": _.value,
            "data-agent-motion": ""
          }, null, 8, qa),
          p("span", Wa, d(R.value), 1),
          p("span", Fa, d(((w = e.facts) == null ? void 0 : w.given_name) || e.row.id), 1),
          e.open ? h("", !0) : (t(), P(s(ge), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          p("span", Da, [
            j.value ? (t(), l("span", Pa, [
              n[7] || (n[7] = m("Retired, ", -1)),
              b(s(xe), {
                at: e.row.retired_at
              }, null, 8, ["at"])
            ])) : e.row.ended_at ? (t(), l("span", Ua, [
              n[8] || (n[8] = m("Idle, ", -1)),
              b(s(xe), {
                at: e.row.ended_at
              }, null, 8, ["at"])
            ])) : (t(), l("span", Ka, d(Z.value), 1)),
            !e.open && e.row.role === "worker" && u.value ? (t(), l("span", _a, d(u.value), 1)) : h("", !0)
          ])
        ]),
        p("span", Ja, [
          p("span", Za, d(q.value), 1),
          e.open ? (t(), l("span", Ga, [
            b(s(ge), {
              name: "time",
              size: 12
            }),
            n[9] || (n[9] = m("First dispatched: ", -1)),
            b(s(xe), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : h("", !0),
          e.open && ((H = e.facts) != null && H.last_activity) ? (t(), l("span", Ya, [
            n[10] || (n[10] = m("Last heard: ", -1)),
            b(s(xe), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : h("", !0)
        ]),
        e.open ? (t(), P(Ia, {
          key: 0,
          agent: e.row,
          branch: (k = e.progress) == null ? void 0 : k.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: [] },
          card: ""
        }, {
          default: $(() => [
            b(Jt, { row: e.row }, null, 8, ["row"]),
            e.row.role === "helper" && !e.row.ended_at ? (t(), P(s(ae), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: n[1] || (n[1] = ne((g) => s(D).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: $(() => [...n[11] || (n[11] = [
                m("Stop", -1)
              ])]),
              _: 1
            })) : h("", !0)
          ]),
          _: 1
        }, 8, ["agent", "branch", "usage"])) : h("", !0),
        e.open && A.value && !O.value ? (t(), l("span", Qa, [
          b(Ve, {
            count: z.value,
            rate: u.value
          }, null, 8, ["count", "rate"])
        ])) : h("", !0),
        O.value || !e.open && M.value ? (t(), l("span", Xa, [
          p("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: O.value
          }, [
            e.open && U.value ? (t(), l("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": U.value,
              onClick: n[2] || (n[2] = ne((g) => s(ye)(U.value), ["stop"]))
            }, d(O.value), 9, tn)) : (t(), l(I, { key: 1 }, [
              m(d(O.value), 1)
            ], 64)),
            O.value && e.row.role !== "helper" && ((r = F.value) != null && r.plan_id) ? (t(), l("button", {
              key: 2,
              type: "button",
              class: "agent-plan",
              "data-agent-plan": "",
              "data-peek": `plans:${F.value.plan_id}`,
              onClick: n[3] || (n[3] = ne((g) => s(ye)(`plans:${F.value.plan_id}`), ["stop"]))
            }, "plan " + d(F.value.plan_id), 9, an)) : h("", !0)
          ], 8, en),
          !e.open && M.value ? (t(), l("span", {
            key: 0,
            class: "agent-work-status",
            "data-agent-waiting": e.waitReason ? "" : null,
            "data-agent-stopped": G.value && !e.waitReason ? "" : null
          }, d(M.value), 9, nn)) : h("", !0),
          e.open && A.value ? (t(), P(Ve, {
            key: 1,
            count: z.value,
            rate: u.value
          }, null, 8, ["count", "rate"])) : h("", !0)
        ])) : h("", !0),
        L.value.length ? (t(), l("span", ln, "Blocked: " + d(L.value.map((g) => `task ${g.id}`).join(", ")), 1)) : h("", !0),
        e.open ? (t(), P(Vt, {
          key: 4,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: C.value,
          "stopped-with-work": G.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : h("", !0)
      ], 42, Ea);
    };
  }
}, sn = /* @__PURE__ */ ee(on, [["__scopeId", "data-v-1866d6b9"]]), rn = {
  key: 0,
  class: "badge",
  "data-agent-count-badge": ""
}, un = { class: "counts" }, dn = ["data-edit-type"], cn = { key: 0 }, pn = { class: "stepper" }, vn = ["disabled", "onClick"], gn = ["value", "disabled", "data-agent-limit-input", "onChange"], hn = ["disabled", "onClick"], mn = { key: 0 }, fn = { key: 1 }, kn = ["data-count-agent"], yn = { class: "person-text" }, bn = {
  key: 0,
  class: "helper-head"
}, wn = ["data-agent-limit-type", "data-agent-limit-profile", "onClick"], Mn = {
  key: 0,
  class: "bar"
}, $n = {
  key: 5,
  role: "alert"
}, xn = {
  key: 6,
  role: "status"
}, Cn = { class: "foot-note" }, Sn = {
  __name: "AgentLimits",
  emits: ["open-agent"],
  setup(e, { emit: i }) {
    const o = i, a = be(), { rows: f, failure: x } = a.props.limits, { rows: R } = a.props["count-agents"], C = Ie(), V = E(!1), N = E(null), F = E(!1), L = E(!1), O = E(""), U = E(""), T = E(null), q = E(""), D = y(() => f.value.flatMap((k) => k.per_profile ? k.profiles.filter((r) => r.kept).map((r) => ({ ...r, label: r.title, type: k.key, key: `${k.key}:${r.profile}` })) : [{ ...k, type: k.key }])), Z = (k, r) => r > 0 && k >= r, K = y(() => D.value.filter((k) => Z(k.running, k.run_limit) || Z(k.kept, k.kept_limit)).length), G = y(() => f.value.find((k) => k.per_profile)), _ = y(() => D.value.find((k) => k.key === N.value)), M = y(() => R.value.filter((k) => {
      var r, g;
      return k.state !== "retired" && k.role === ((r = _.value) == null ? void 0 : r.type) && (!_.value.profile || (((g = k.facts) == null ? void 0 : g.profile) || k.profile) === _.value.profile);
    }).sort((k, r) => (k.state !== "running") - (r.state !== "running") || String(k.ended_at || k.created_at).localeCompare(String(r.ended_at || r.created_at)))), c = y(() => {
      var r;
      const k = /* @__PURE__ */ new Map();
      for (const g of M.value) {
        const S = ((r = g.facts) == null ? void 0 : r.model) || g.program_model;
        S && k.set(S, (k.get(S) || 0) + 1);
      }
      return [...k].map(([g, S]) => `${S} ${g}`).join(", ");
    }), A = (k, r) => r ? `${Math.min(k / Math.max(k, r) * 100, 100)}%` : "0%", z = (k, r) => r && k > r ? `${(k - r) / k * 100}%` : "0%", u = y(() => {
      var k;
      return F.value ? "Change the maximums" : ((k = _.value) == null ? void 0 : k.label) || "Agent counts";
    });
    function j() {
      F.value = !1, N.value = null, T.value = null, O.value = "";
    }
    function v() {
      V.value = !1, j();
    }
    async function n(k, r, g, S) {
      if (L.value || a.readOnly) return;
      const Y = Number(S);
      if (!String(S).trim() || !Number.isInteger(Y) || Y < 0) {
        O.value = "Use a whole number of 0 or more.";
        return;
      }
      L.value = !0, O.value = "";
      const le = await a.run(["setting", "set", r, String(Y), "--environment", a.environment]);
      le.ok ? (await a.reload("limits"), U.value = "Saved.") : O.value = le.error, L.value = !1;
    }
    async function w(k) {
      if (!q.value.trim() || L.value) return;
      L.value = !0;
      const r = await a.run(["agent", "retire", String(k.id), "--reason", q.value.trim()]);
      O.value = r.ok ? "" : "The agent could not be retired. Try again.", r.ok && (T.value = null, q.value = "", U.value = "Agent retired permanently.", await Promise.all([a.reload("limits"), a.reload("count-agents")])), L.value = !1;
    }
    function H(k) {
      v(), o("open-agent", k);
    }
    return (k, r) => (t(), l(I, null, [
      p("button", {
        class: "counts-button",
        type: "button",
        title: "Agent counts",
        "aria-label": "Agent counts",
        "data-agent-counts": "",
        onClick: r[0] || (r[0] = (g) => V.value = !0)
      }, [
        b(s(ge), {
          name: "settings",
          size: 16
        }),
        K.value ? (t(), l("span", rn, d(K.value), 1)) : h("", !0)
      ]),
      V.value ? (t(), P(s(rt), {
        key: 0,
        title: u.value,
        modal: "",
        fits: "",
        onClose: v,
        onEscape: v
      }, {
        foot: $(() => [
          F.value ? (t(), l(I, { key: 0 }, [
            p("span", Cn, d(U.value || `Changes apply to ${s(a).environment}.`), 1),
            b(s(ae), { onClick: j }, {
              default: $(() => [...r[18] || (r[18] = [
                m("Done", -1)
              ])]),
              _: 1
            })
          ], 64)) : _.value ? h("", !0) : (t(), P(s(ae), {
            key: 1,
            disabled: s(a).readOnly,
            "data-agent-limits-edit": "",
            onClick: r[4] || (r[4] = (g) => F.value = !0)
          }, {
            default: $(() => [...r[19] || (r[19] = [
              m("Change the maximums", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]))
        ]),
        default: $(() => [
          p("div", un, [
            F.value || _.value ? (t(), l("button", {
              key: 0,
              class: "back",
              type: "button",
              onClick: j
            }, "‹ Back to the counts")) : h("", !0),
            s(x) ? (t(), l(I, { key: 1 }, [
              r[6] || (r[6] = p("strong", null, "The counts could not be read", -1)),
              r[7] || (r[7] = p("p", null, "The journal did not answer.", -1)),
              b(s(ae), {
                small: "",
                onClick: r[1] || (r[1] = (g) => s(a).reload("limits"))
              }, {
                default: $(() => [...r[5] || (r[5] = [
                  m("Try again", -1)
                ])]),
                _: 1
              })
            ], 64)) : F.value ? (t(), l(I, { key: 2 }, [
              r[8] || (r[8] = p("p", null, "How many agents of a type may run at once, and how many may be kept.", -1)),
              (t(!0), l(I, null, Q(s(f), (g) => (t(), l("div", {
                key: g.key,
                class: "edit-row",
                "data-edit-type": g.key
              }, [
                p("div", null, [
                  p("strong", null, d(g.per_profile ? "Each helper type" : "Workers"), 1),
                  g.per_profile ? (t(), l("small", cn, "Researcher, Planner and the others")) : h("", !0)
                ]),
                (t(!0), l(I, null, Q([{ name: "Most running", value: g.run_limit, key: g.run_setting, source: g.run_source, kind: "run" }, { name: "Most kept", value: g.kept_limit, key: g.kept_setting, source: g.kept_source, kind: "kept" }], (S) => (t(), l("label", {
                  key: S.key
                }, [
                  m(d(S.name), 1),
                  p("span", pn, [
                    p("button", {
                      type: "button",
                      disabled: L.value || s(a).readOnly || S.value === 0,
                      onClick: (Y) => n(g, S.key, S.value, S.value - 1)
                    }, "−", 8, vn),
                    p("input", {
                      type: "number",
                      min: "0",
                      value: S.value,
                      disabled: L.value || s(a).readOnly,
                      "data-agent-limit-input": S.kind,
                      onChange: (Y) => n(g, S.key, S.value, Y.target.value)
                    }, null, 40, gn),
                    p("button", {
                      type: "button",
                      disabled: L.value || s(a).readOnly,
                      onClick: (Y) => n(g, S.key, S.value, S.value + 1)
                    }, "+", 8, hn)
                  ]),
                  S.value === 0 ? (t(), l("small", mn, d(S.kind === "run" ? "None can start" : "Any number"), 1)) : S.source === `environment ${s(a).environment}` ? (t(), l("small", fn, "Changed for " + d(s(a).environment), 1)) : h("", !0)
                ]))), 128))
              ], 8, dn))), 128))
            ], 64)) : _.value ? (t(), l(I, { key: 3 }, [
              p("p", null, [
                p("strong", null, d(_.value.running) + " of " + d(_.value.run_limit), 1),
                r[9] || (r[9] = m(" running, ", -1)),
                p("strong", null, [
                  m(d(_.value.kept), 1),
                  _.value.kept_limit ? (t(), l(I, { key: 0 }, [
                    m(" of " + d(_.value.kept_limit), 1)
                  ], 64)) : h("", !0)
                ]),
                r[10] || (r[10] = m(" kept", -1))
              ]),
              p("p", null, d(c.value), 1),
              M.value.length ? h("", !0) : (t(), l(I, { key: 0 }, [
                r[11] || (r[11] = p("strong", null, "No agents here yet", -1)),
                r[12] || (r[12] = p("p", null, "An agent shows here as soon as one of this type starts.", -1))
              ], 64)),
              (t(!0), l(I, null, Q(M.value, (g) => {
                var S, Y, le, we, he;
                return t(), l("div", {
                  key: g.id,
                  class: "person",
                  "data-count-agent": g.id
                }, [
                  p("span", {
                    class: se(["dot", { running: g.state === "running" }])
                  }, null, 2),
                  p("div", yn, [
                    p("strong", null, d(((S = g.facts) == null ? void 0 : S.given_name) || g.id), 1),
                    m(" " + d(g.state === "running" ? "Running" : "Idle") + ", " + d(s(Ee)(g.state === "running" ? g.process_started_at || g.created_at : g.ended_at, s(C))), 1),
                    p("small", null, d([g.program, (Y = g.facts) == null ? void 0 : Y.model, (le = g.facts) == null ? void 0 : le.effort, `${g.role} ${g.id}`].filter(Boolean).join(", ")), 1),
                    p("small", null, d(((we = g.facts) == null ? void 0 : we.task_title) || ((he = g.facts) == null ? void 0 : he.helper_job)), 1)
                  ]),
                  b(s(ae), {
                    small: "",
                    onClick: (ue) => H(g)
                  }, {
                    default: $(() => [...r[13] || (r[13] = [
                      m("Open", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"]),
                  g.state === "idle" && !s(a).readOnly ? (t(), P(s(ae), {
                    key: 0,
                    small: "",
                    onClick: (ue) => {
                      T.value = g.id, q.value = "";
                    }
                  }, {
                    default: $(() => [...r[14] || (r[14] = [
                      m("Retire", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"])) : h("", !0),
                  T.value === g.id ? (t(), P(Ne, {
                    key: 1,
                    reason: q.value,
                    "onUpdate:reason": r[2] || (r[2] = (ue) => q.value = ue),
                    pending: L.value,
                    onSubmit: (ue) => w(g),
                    onCancel: r[3] || (r[3] = (ue) => T.value = null)
                  }, null, 8, ["reason", "pending", "onSubmit"])) : h("", !0)
                ], 8, kn);
              }), 128))
            ], 64)) : (t(), l(I, { key: 4 }, [
              r[16] || (r[16] = p("p", null, "Kept agents have not been retired, so they can take another job. Open a row to see them.", -1)),
              r[17] || (r[17] = p("div", { class: "columns" }, [
                p("span", null, "Name"),
                p("span", null, "Running"),
                p("span", null, "Kept"),
                p("span")
              ], -1)),
              G.value ? (t(), l("div", bn, [
                r[15] || (r[15] = p("strong", null, "Helpers", -1)),
                p("span", null, d(G.value.running) + " running, " + d(G.value.kept) + " kept", 1)
              ])) : h("", !0),
              (t(!0), l(I, null, Q(D.value, (g) => (t(), l("button", {
                key: g.key,
                type: "button",
                class: "count-row",
                "data-agent-limit-type": g.type || g.key,
                "data-agent-limit-profile": g.profile,
                onClick: (S) => N.value = g.key
              }, [
                p("strong", null, d(g.label), 1),
                (t(!0), l(I, null, Q([{ count: g.running, limit: g.run_limit, unlimited: !1 }, { count: g.kept, limit: g.kept_limit, unlimited: !0 }], (S) => (t(), l("span", {
                  key: S.unlimited,
                  class: se({ full: Z(S.count, S.limit) })
                }, [
                  p("span", null, [
                    m(d(S.count), 1),
                    S.limit || !S.unlimited ? (t(), l(I, { key: 0 }, [
                      m(" of " + d(S.limit), 1)
                    ], 64)) : h("", !0)
                  ]),
                  S.limit ? (t(), l("span", Mn, [
                    p("span", {
                      style: ve({ width: A(S.count, S.limit) })
                    }, null, 4),
                    p("i", {
                      style: ve({ width: z(S.count, S.limit) })
                    }, null, 4)
                  ])) : h("", !0)
                ], 2))), 128)),
                b(s(ge), {
                  name: "chevronRight",
                  size: 12
                })
              ], 8, wn))), 128))
            ], 64)),
            O.value ? (t(), l("p", $n, d(O.value), 1)) : U.value ? (t(), l("p", xn, d(U.value), 1)) : h("", !0)
          ])
        ]),
        _: 1
      }, 8, ["title"])) : h("", !0)
    ], 64));
  }
}, An = /* @__PURE__ */ ee(Sn, [["__scopeId", "data-v-5afd33ad"]]), jn = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Tn = ["data-agent-row"], Be = "journal.agents.filters", Se = "cubic-bezier(0.2, 0.9, 0.25, 1)", Rn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const i = e, o = be(), { rows: a } = o.props.waits, { rows: f } = o.props.progress, { rows: x, failure: R, loaded: C, more: V } = o.props.agents, N = (W) => f.value.find((J) => J.agent_id === W.id) ?? null, F = (W) => {
      var J;
      return ((J = a.value.find((B) => B.agent_id === W.id)) == null ? void 0 : J.reason) ?? "";
    }, L = E("running"), O = E(""), U = JSON.parse(localStorage.getItem(Be) || '{"roles":[],"profiles":[],"programs":[]}'), T = E(U), q = y(() => o.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: D } = o.props.programs, Z = y(() => T.value.roles.length + T.value.profiles.length + T.value.programs.length), K = (W, J) => {
      T.value = ct(T.value, W, J);
    }, G = () => {
      T.value = { roles: [], profiles: [], programs: [] };
    }, _ = (W) => W.slice(0, 1).toUpperCase() + W.slice(1);
    ie(T, (W) => localStorage.setItem(Be, JSON.stringify(W)));
    const M = E(25);
    function c() {
      Object.assign(o.state, {
        "agents.show": L.value,
        "agents.search": O.value,
        "agents.limit": String(M.value),
        "agents.roles": T.value.roles.join(","),
        "agents.profiles": T.value.profiles.join(","),
        "agents.programs": T.value.programs.join(",")
      });
    }
    async function A() {
      return M.value += 25, c(), await o.reload("agents"), !0;
    }
    ie([L, O, T], () => {
      M.value = 25, c(), o.reload("agents");
    }), c();
    const z = (W) => W.facts ?? null, u = x, j = y(() => !!O.value.trim() || Z.value > 0), v = y(() => i.texts[L.value] ?? { title: i.empty, hint: "" }), n = E(null), w = E(null), H = E(null), k = E(null), r = y(() => n.value === null ? null : o.props[`card.${n.value}`].rows.value.find((W) => W.id === n.value) ?? w.value), g = y(() => r.value ? [r.value] : u.value), S = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let Y = !1, le = 0;
    async function we(W) {
      if (Y) return;
      Y = !0, le = k.value.scrollTop;
      const J = H.value.querySelector(`[data-agent-open="${W.id}"]`);
      if (!S()) {
        const re = [...H.value.querySelectorAll(".agent-row")].filter((oe) => !oe.contains(J));
        await Promise.all(re.map((oe) => oe.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const B = [...J.querySelectorAll(".agent-head, .agent-line")], X = [...B, ...J.querySelectorAll("[data-agent-motion]")], Me = X.map((re) => re.getBoundingClientRect());
      if (w.value = W, n.value = W.id, o.reload(`card.${W.id}`), await ze(), !S()) {
        const re = X.map((oe) => oe.getBoundingClientRect());
        X.forEach((oe, $e) => {
          const de = B.indexOf(oe.parentElement), De = Me[$e].left - re[$e].left - (de < 0 ? 0 : Me[de].left - re[de].left), Pe = Me[$e].top - re[$e].top - (de < 0 ? 0 : Me[de].top - re[de].top);
          oe.animate([{ transform: `translate(${De}px, ${Pe}px)` }, { transform: "none" }], { duration: 280, easing: Se });
        }), H.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((oe) => {
          oe.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Se, fill: "backwards" });
        });
      }
      Y = !1;
    }
    async function he() {
      if (Y || !r.value) return;
      Y = !0;
      const W = H.value.querySelector(`[data-agent-open="${n.value}"]`), J = [...W.children], B = S() ? [] : J.map((X) => X.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(B.map((X) => X.finished)), n.value = null, await ze(), k.value.scrollTop = le, B.forEach((X) => X.cancel()), S() || (W.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Se }), H.value.querySelectorAll(".agent-row").forEach((X) => {
        X.contains(W) || X.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Se });
      })), Y = !1;
    }
    function ue(W) {
      w.value = W, n.value = W.id, o.reload(`card.${W.id}`);
    }
    const Fe = (W) => n.value === W.id ? he() : we(W);
    ie(O, (W) => W.trim() && (n.value = null)), ie(L, () => {
      n.value = null;
    });
    const Re = (W) => {
      W.key === "Escape" && he();
    };
    return window.addEventListener("keydown", Re), fe(() => window.removeEventListener("keydown", Re)), (W, J) => (t(), l("div", {
      ref_key: "agents",
      ref: H,
      class: se(["agents", { focused: r.value }])
    }, [
      b(s(it), {
        modelValue: O.value,
        "onUpdate:modelValue": J[1] || (J[1] = (B) => O.value = B),
        placeholder: "Search agents",
        "menu-count": Z.value,
        "data-agents-search": ""
      }, {
        menu: $(() => [
          b(s(je), null, {
            default: $(() => [...J[2] || (J[2] = [
              m("Type", -1)
            ])]),
            _: 1
          }),
          (t(!0), l(I, null, Q(q.value.roles, (B) => (t(), P(s(Ce), {
            key: B,
            role: "menuitemcheckbox",
            "aria-checked": T.value.roles.includes(B),
            checked: T.value.roles.includes(B),
            "data-filter-role": B,
            onClick: (X) => K("roles", B)
          }, {
            default: $(() => [
              m(d(_(B)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          q.value.profiles.length ? (t(), P(s(je), { key: 0 }, {
            default: $(() => [...J[3] || (J[3] = [
              m("Profile", -1)
            ])]),
            _: 1
          })) : h("", !0),
          (t(!0), l(I, null, Q(q.value.profiles, (B) => (t(), P(s(Ce), {
            key: B.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.profiles.includes(B.name),
            checked: T.value.profiles.includes(B.name),
            "data-filter-profile": B.name,
            onClick: (X) => K("profiles", B.name)
          }, {
            default: $(() => [
              m(d(B.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          b(s(je), null, {
            default: $(() => [...J[4] || (J[4] = [
              m("Program", -1)
            ])]),
            _: 1
          }),
          (t(!0), l(I, null, Q(s(D), (B) => (t(), P(s(Ce), {
            key: B.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.programs.includes(B.name),
            checked: T.value.programs.includes(B.name),
            "data-filter-program": B.name,
            onClick: (X) => K("programs", B.name)
          }, {
            default: $(() => [
              m(d(B.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          Z.value ? (t(), P(s(Ce), {
            key: 1,
            "data-filter-clear": "",
            onClick: G
          }, {
            default: $(() => [...J[5] || (J[5] = [
              m("Clear filters", -1)
            ])]),
            _: 1
          })) : h("", !0)
        ]),
        default: $(() => [
          b(s(ut), {
            options: q.value.states,
            value: L.value,
            onPick: J[0] || (J[0] = (B) => L.value = B)
          }, null, 8, ["options", "value"]),
          b(An, { onOpenAgent: ue })
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      L.value === "retired" && q.value.upgrade_retired ? (t(), l("p", jn, "Retired during the upgrade: " + d(q.value.upgrade_retired), 1)) : h("", !0),
      p("div", {
        ref_key: "list",
        ref: k,
        class: se(["agents-view", { "agents-view-open": r.value }])
      }, [
        s(C) && !s(R) && !g.value.length && Z.value ? (t(), P(s(Te), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: $(() => [
            b(s(ae), {
              small: "",
              "data-empty-clear": "",
              onClick: G
            }, {
              default: $(() => [...J[6] || (J[6] = [
                m("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (t(), P(s(dt), {
          key: 1,
          rows: g.value,
          failure: s(R),
          loaded: s(C),
          more: !r.value && s(V),
          older: A,
          empty: v.value.title,
          hint: v.value.hint,
          searching: j.value
        }, {
          default: $(({ row: B }) => [
            p("div", {
              class: "agent-row",
              "data-agent-row": B.id
            }, [
              b(sn, {
                row: B,
                facts: z(B),
                progress: N(B),
                "wait-reason": F(B),
                open: B.id === n.value,
                onToggle: (X) => Fe(B)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, Tn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, Bn = /* @__PURE__ */ ee(Rn, [["__scopeId", "data-v-06777d49"]]);
export {
  Bn as A
};
