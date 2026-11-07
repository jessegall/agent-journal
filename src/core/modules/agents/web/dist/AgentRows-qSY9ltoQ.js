/* @code-commandments-generated */
import { openBlock as t, createElementBlock as l, withModifiers as ne, unref as r, createTextVNode as h, toDisplayString as d, createVNode as b, createBlock as D, withCtx as $, Fragment as E, renderList as Q, createElementVNode as v, createCommentVNode as g, computed as y, ref as N, watch as ie, onUnmounted as fe, defineAsyncComponent as Ue, createSlots as _e, resolveDynamicComponent as Ke, normalizeStyle as ve, normalizeClass as le, renderSlot as ke, onMounted as Je, Teleport as Ze, mergeProps as Ge, toRef as Ae, withKeys as Oe, nextTick as ze } from "vue";
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
        onClick: o[0] || (o[0] = ne((a) => r(ye)("test_queue:0"), ["stop"]))
      }, [
        h("Waiting: " + d(e.waitReason) + " ", 1),
        b(r(ge), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (t(), l("span", gt, "Waiting")) : (t(), D(r(Ye), {
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
    return (a, f) => (t(), D(r(He), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: f[0] || (f[0] = (x) => o("toggle"))
    }, {
      default: $(() => [
        (t(!0), l(E, null, Q(e.section.tasks, (x) => (t(), l("button", {
          key: x.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": x.id,
          onClick: (R) => r(ye)(`tasks:${x.id}`)
        }, [
          b(r(Qe), {
            status: x.state
          }, null, 8, ["status"]),
          v("span", kt, d(x.id), 1),
          v("span", yt, d(x.title), 1),
          x.plan_id ? (t(), l("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${x.plan_id}: ${x.plan_title}`
          }, "Plan " + d(x.plan_id) + ": " + d(x.plan_title), 9, bt)) : g("", !0)
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
    }), f = y(() => i.tasks.length ? o.map((u) => ({ state: u, label: u.slice(0, 1).toUpperCase() + u.slice(1), tasks: i.tasks.filter((j) => j.state === u || u === "started" && j.state === "testing" || u === "completed" && j.state === "cancelled") })) : []), x = /* @__PURE__ */ new Set(["completed"]), R = N({}), S = (u) => !(R.value[u] ?? x.has(u)), z = (u) => R.value = { ...R.value, [u]: S(u) }, B = be(), { rows: P } = B.props.reports;
    B.state["reports.agent"] = String(i.row.id);
    const I = y(() => i.row.access === "read-only"), V = y(() => !!i.row.retired_at || i.row.state === "retired"), U = ["tasks", "transcript", "terminal", "file-feed", "reports"], T = y(() => (V.value ? B.tabs.filter((j) => ["reports", "transcript"].includes(j.key)) : I.value ? B.tabs.filter((j) => ["reports", "transcript", "terminal"].includes(j.key)) : [...B.tabs]).sort((j, c) => (U.indexOf(j.key) < 0 ? U.length : U.indexOf(j.key)) - (U.indexOf(c.key) < 0 ? U.length : U.indexOf(c.key)))), q = () => I.value || V.value ? T.value.find((u) => u.key === "transcript") : T.value[0], F = N(q());
    ie(F, (u) => {
      B.state.tab = (u == null ? void 0 : u.key) ?? "";
    }, { immediate: !0 }), fe(() => {
      B.state.tab = "";
    }), ie(T, (u) => {
      u.some((j) => {
        var c;
        return j.key === ((c = F.value) == null ? void 0 : c.key);
      }) || (F.value = u[0]);
    }), ie(() => i.open, (u) => {
      u && (F.value = q());
    });
    const Z = Object.fromEntries(B.tabs.filter((u) => u.component).map((u) => [u.key, Ue(() => Xe(u.component))])), _ = N(!1), { data: G } = B.props.tool, K = y(() => {
      var u;
      return ((u = G.value) == null ? void 0 : u.tool) ?? "";
    }), M = y(() => {
      var u;
      return ((u = G.value) == null ? void 0 : u.note) ?? "";
    }), p = y(() => i.row.role !== "main" && (!i.row.ended_at || i.stoppedWithWork || i.waitReason));
    async function A() {
      !i.open || !p.value || (B.state["tool.agent"] = String(i.row.id), await B.reload("tool"));
    }
    const O = B.follow(["hook_call.*", "process_part.*"], et(A, tt.agentCommand));
    return fe(() => O == null ? void 0 : O()), ie(() => i.open, (u) => {
      u && A();
    }, { immediate: !0 }), (u, j) => {
      var c;
      return t(), l("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: j[2] || (j[2] = ne(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (t(), l("p", $t, "Retirement reason: " + d(e.row.retirement_reason), 1)) : g("", !0),
        e.row.resume_reason ? (t(), l("p", xt, d(e.row.resume_reason), 1)) : g("", !0),
        p.value ? (t(), D(mt, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: K.value,
          note: M.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : g("", !0),
        a.value ? (t(), l("p", Ct, d(a.value), 1)) : g("", !0),
        b(r(at), {
          class: "agent-tabs",
          tabs: T.value,
          active: F.value,
          answer: { tasks: e.tasks.length, reports: r(P).length },
          onChoose: j[0] || (j[0] = (n) => F.value = n)
        }, null, 8, ["tabs", "active", "answer"]),
        b(r(nt), {
          class: "agent-tab-body",
          tab: F.value,
          "data-agent-tab-body": (c = F.value) == null ? void 0 : c.key
        }, {
          default: $(() => {
            var n;
            return [
              b(r(Le), {
                value: (n = F.value) == null ? void 0 : n.key
              }, _e({
                reports: $(() => [
                  r(P).length ? g("", !0) : (t(), D(r(Te), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: $(() => [...j[3] || (j[3] = [
                      h("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (t(!0), l(E, null, Q(r(P), (w) => (t(), l("button", {
                    key: w.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${w.id}`,
                    onClick: (L) => r(ye)(`messages:${w.id}`)
                  }, d(w.text), 9, St))), 128))
                ]),
                tasks: $(() => {
                  var w;
                  return [
                    e.tasks.length ? g("", !0) : (t(), D(r(Te), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: $(() => [...j[4] || (j[4] = [
                        h("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (t(!0), l(E, null, Q(f.value, (L) => (t(), D(Mt, {
                      key: L.state,
                      section: L,
                      open: S(L.state),
                      onToggle: (k) => z(L.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (w = e.facts) != null && w.instruction ? (t(), l(E, { key: 1 }, [
                      j[5] || (j[5] = v("p", { class: "agent-label" }, "Instruction", -1)),
                      v("div", At, d(e.facts.instruction), 1)
                    ], 64)) : g("", !0)
                  ];
                }),
                transcript: $(() => {
                  var w;
                  return [
                    I.value ? (t(), l(E, { key: 0 }, [
                      (w = e.facts) != null && w.instruction ? (t(), l("div", jt, [
                        b(r(He), {
                          label: "Instruction",
                          open: _.value,
                          "data-agent-section": "instruction",
                          onToggle: j[1] || (j[1] = (L) => _.value = !_.value)
                        }, {
                          default: $(() => [
                            v("div", Tt, d(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (t(), l("p", Rt, "No job recorded")) : g("", !0)
                    ], 64)) : g("", !0),
                    b(pt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                Q(r(Z), (w, L) => ({
                  name: L,
                  fn: $(() => [
                    (t(), D(Ke(w), {
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
      e.row.job_task_flag ? (t(), l(E, { key: 0 }, [
        v("label", Bt, [
          o[6] || (o[6] = h("Task ", -1)),
          v("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: o[0] || (o[0] = (a) => i.$emit("update:task", a.target.value))
          }, [
            o[5] || (o[5] = v("option", { value: "" }, "Choose an open task", -1)),
            (t(!0), l(E, null, Q(e.tasks, (a) => (t(), l("option", {
              key: a.id,
              value: String(a.id)
            }, d(a.id) + ": " + d(a.title), 9, Lt))), 128))
          ], 40, Ht)
        ]),
        e.moreTasks ? (t(), D(r(ae), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: o[1] || (o[1] = (a) => i.$emit("more"))
        }, {
          default: $(() => [...o[7] || (o[7] = [
            h("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : g("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (t(), l("p", It, "No open tasks.")) : g("", !0)
      ], 64)) : (t(), l("label", Et, [
        o[8] || (o[8] = h("Job", -1)),
        b(r(lt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: o[2] || (o[2] = (a) => i.$emit("update:text", a.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      v("div", Nt, [
        b(r(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: $(() => [...o[9] || (o[9] = [
            h("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        b(r(ae), {
          small: "",
          disabled: e.pending,
          onClick: o[3] || (o[3] = (a) => i.$emit("cancel"))
        }, {
          default: $(() => [...o[10] || (o[10] = [
            h("Cancel", -1)
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
      o[5] || (o[5] = v("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      b(r(ot), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": o[0] || (o[0] = (a) => i.$emit("update:reason", a))
      }, null, 8, ["model-value", "disabled"]),
      v("div", Ft, [
        b(r(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: $(() => [...o[3] || (o[3] = [
            h("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        b(r(ae), {
          small: "",
          disabled: e.pending,
          onClick: o[1] || (o[1] = (a) => i.$emit("cancel"))
        }, {
          default: $(() => [...o[4] || (o[4] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Ne = /* @__PURE__ */ ee(Dt, [["__scopeId", "data-v-23a905c0"]]), Pt = { class: "action-buttons" }, Ut = {
  key: 0,
  role: "alert"
}, _t = {
  key: 1,
  role: "status"
}, Kt = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const i = e, o = be(), a = N(""), f = N(""), x = N(""), R = N(""), S = N([]), z = N(0), B = N(!1), P = N(!1), I = N(!1), V = N(""), U = N(""), T = y(() => !!i.row.retired_at || i.row.state === "retired"), q = y(() => !T.value && !!i.row.ended_at), F = y(() => {
      var O;
      return q.value && ((O = i.row.job_command) == null ? void 0 : O.length) && !i.row.resume_reason;
    }), Z = y(() => F.value && !P.value && (i.row.job_task_flag ? S.value.some((O) => String(O.id) === R.value) : !!f.value.trim()));
    function _(O) {
      a.value = O, f.value = "", x.value = "", R.value = "", V.value = "", U.value = "";
    }
    async function G() {
      _("job"), i.row.job_task_flag && (S.value = [], z.value = 0, B.value = !1, await K());
    }
    async function K() {
      if (!P.value) {
        P.value = !0;
        try {
          o.state["jobs.page"] = String(z.value + 1), await o.reload("jobs");
          const O = o.props.jobs;
          V.value = O.failure.value, V.value || (S.value = [...S.value, ...O.rows.value], z.value = O.data.value.page, B.value = O.more.value);
        } finally {
          P.value = !1;
        }
      }
    }
    async function M(O, u) {
      if (!I.value) {
        I.value = !0, V.value = "";
        try {
          const j = await o.run(O);
          V.value = j.ok ? "" : j.error, j.ok && (_(""), U.value = u);
        } finally {
          I.value = !1;
        }
      }
    }
    async function p() {
      if (!Z.value) return;
      const O = i.row.job_task_flag ? [i.row.job_task_flag, R.value] : [f.value.trim()];
      await M([...i.row.job_command, String(i.row.id), ...O], "Job sent.");
    }
    async function A() {
      !q.value || a.value !== "retire" || !x.value.trim() || await M(["agent", "retire", String(i.row.id), "--reason", x.value.trim()], "Agent retired permanently.");
    }
    return (O, u) => {
      var j;
      return T.value ? g("", !0) : (t(), l("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: u[6] || (u[6] = ne(() => {
        }, ["stop"])),
        onKeydown: u[7] || (u[7] = ne(() => {
        }, ["stop"]))
      }, [
        v("div", Pt, [
          q.value ? (t(), l(E, { key: 0 }, [
            (j = e.row.job_command) != null && j.length ? (t(), D(r(ae), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: I.value || P.value || !F.value,
              onClick: G
            }, {
              default: $(() => [...u[8] || (u[8] = [
                h("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : g("", !0),
            e.row.role !== "main" ? (t(), D(r(ae), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: I.value || P.value,
              onClick: u[0] || (u[0] = (c) => _("retire"))
            }, {
              default: $(() => [...u[9] || (u[9] = [
                h("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : g("", !0)
          ], 64)) : g("", !0)
        ]),
        b(r(Le), { value: a.value }, {
          job: $(() => [
            b(Wt, {
              task: R.value,
              "onUpdate:task": u[1] || (u[1] = (c) => R.value = c),
              text: f.value,
              "onUpdate:text": u[2] || (u[2] = (c) => f.value = c),
              row: e.row,
              tasks: S.value,
              pending: I.value,
              loading: P.value,
              "more-tasks": B.value,
              failure: V.value,
              "job-ready": Z.value,
              onSubmit: p,
              onMore: K,
              onCancel: u[3] || (u[3] = (c) => _(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: $(() => [
            b(Ne, {
              reason: x.value,
              "onUpdate:reason": u[4] || (u[4] = (c) => x.value = c),
              pending: I.value,
              onSubmit: A,
              onCancel: u[5] || (u[5] = (c) => _(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        V.value ? (t(), l("p", Ut, d(V.value), 1)) : g("", !0),
        U.value ? (t(), l("p", _t, d(U.value), 1)) : g("", !0)
      ], 32));
    };
  }
}, Jt = /* @__PURE__ */ ee(Kt, [["__scopeId", "data-v-4cb32275"]]), Zt = {
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
      e.rate ? (t(), l("span", Gt, d(e.rate), 1)) : g("", !0),
      v("span", Yt, d(e.count), 1)
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
      class: le(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (t(), l("span", ea, d(e.checked ? "✓" : ""), 1)) : g("", !0),
      e.description ? (t(), l("span", ta, [
        v("span", null, [
          ke(i.$slots, "default", {}, void 0, !0)
        ]),
        v("small", null, d(e.description), 1)
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
    return (R, S) => (t(), l("div", sa, [
      b(me, null, {
        default: $(() => [...S[1] || (S[1] = [
          h("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      f.value.length ? g("", !0) : (t(), l("p", ra, "None yet. Compacting the conversation empties this list.")),
      (t(!0), l(E, null, Q(f.value, (z) => (t(), l("p", {
        key: z.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        b(te, {
          name: "book",
          size: 12
        }),
        h(d(z.skill), 1)
      ]))), 128)),
      x.value.length ? (t(), l(E, { key: 1 }, [
        b(me, null, {
          default: $(() => [...S[2] || (S[2] = [
            h("Still to read", -1)
          ])]),
          _: 1
        }),
        (t(!0), l(E, null, Q(x.value, (z) => (t(), l("p", {
          key: z.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          b(te, {
            name: "book",
            size: 12
          }),
          h(d(z.skill), 1)
        ]))), 128))
      ], 64)) : g("", !0),
      b(pe, {
        "data-agent-skills-browse": "",
        onClick: S[0] || (S[0] = (z) => a("browse"))
      }, {
        default: $(() => [...S[3] || (S[3] = [
          h("Browse every skill", -1)
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
    const a = e, f = N(null), x = (n) => n ? `${n}px` : void 0, R = y(() => ({
      minWidth: x(a.minWidth),
      maxWidth: x(a.maxWidth),
      maxHeight: x(a.maxHeight),
      height: x(a.height)
    })), S = N({ w: 0, h: 0 }), z = N(a.anchor ? a.anchor.getBoundingClientRect() : null), B = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), P = (n) => ({
      left: Math.max(0, n.left),
      top: Math.max(0, n.top),
      right: Math.min(window.innerWidth, n.right),
      bottom: Math.min(window.innerHeight, n.bottom)
    }), I = (n) => {
      const w = n.closest(".pane, .float-window");
      return w ? P(w.getBoundingClientRect()) : B();
    }, V = (n, w) => `${Math.max(0, n ? Math.min(n, w) : w)}px`;
    function U(n, w) {
      return {
        below: n.bottom - w.bottom - a.gap - ce,
        above: w.top - n.top - a.gap - ce,
        across: n.right - n.left - 2 * ce
      };
    }
    function T(n) {
      const w = I(a.anchor), L = U(w, n);
      return S.value.w <= L.across && S.value.h <= Math.max(L.below, L.above) ? w : B();
    }
    const q = y(() => {
      if (!z.value) return R.value;
      const n = z.value, w = T(n), L = U(w, n), { w: k, h: s } = S.value, m = a.align === "auto" ? n.left + n.right > w.left + w.right : a.align === "right", C = da(m ? n.right - k : n.left, w.left + ce, Math.max(w.left + ce, w.right - k - ce)), oe = s > L.below && L.above > L.below ? { bottom: `${window.innerHeight - n.top + a.gap}px`, maxHeight: V(a.maxHeight, L.above) } : { top: `${n.bottom + a.gap}px`, maxHeight: V(a.maxHeight, L.below) };
      return { ...R.value, ...oe, left: `${C}px`, maxWidth: V(a.maxWidth, L.across) };
    }), F = o, Z = () => [...f.value.querySelectorAll("button:not(:disabled)")];
    function _(n) {
      const w = Z(), L = w.indexOf(document.activeElement);
      w[(L + n + w.length) % w.length].focus();
    }
    const G = { ArrowDown: () => _(1), ArrowUp: () => _(-1), Escape: () => F("close") }, K = (n) => G[n.key] && (n.preventDefault(), G[n.key]()), M = () => f.value && (S.value = { w: f.value.offsetWidth, h: f.value.scrollHeight });
    let p = 0;
    const A = new ResizeObserver(() => {
      cancelAnimationFrame(p), p = requestAnimationFrame(M);
    });
    va(f, (n) => a.anchor && !a.anchor.contains(n.target) && F("close"));
    const O = (n, w) => ["top", "left", "right", "bottom"].some((L) => Math.abs(n[L] - w[L]) > 1), u = (n) => n.bottom < 0 || n.top > window.innerHeight;
    let j = 0;
    function c() {
      if (a.anchor) {
        const n = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || u(n)) return F("close");
        O(n, z.value) && (z.value = n);
      }
      j = requestAnimationFrame(c);
    }
    return Je(() => {
      a.anchor && f.value && ca(f.value, a.anchor), M(), f.value && A.observe(f.value), !a.plain && Z()[0] && Z()[0].focus(), c();
    }), fe(() => {
      A.disconnect(), cancelAnimationFrame(j), cancelAnimationFrame(p);
    }), i({ element: f }), (n, w) => (t(), D(Ze, {
      to: "body",
      disabled: !e.anchor
    }, [
      v("div", Ge({
        ref_key: "panel",
        ref: f
      }, n.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: q.value,
        onKeydown: K
      }), [
        ke(n.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ha = /* @__PURE__ */ ee(ga, [["__scopeId", "data-v-3d203970"]]);
async function ma(e, i, o) {
  if (!e) return o(i);
  const { target: a, fields: f } = e, x = Object.fromEntries(Object.keys(f).map((z) => [z, a[z]])), R = () => Object.assign(a, x);
  Object.assign(a, f);
  let S = !1;
  try {
    const z = await o(i);
    return S = z.ok, z;
  } finally {
    S || R();
  }
}
function fa(e, i, o, { groups: a, programs: f }) {
  const x = N({}), R = N(""), S = N(!1), z = y(() => !!e.value && !e.value.ended_at), B = y(() => z.value && !!e.value.paused_at);
  async function P(T, q = null) {
    R.value = "";
    const F = await ma(q, T, i);
    return R.value = F.ok ? "" : F.error, o(), F;
  }
  return { groups: a, programs: f, chosen: x, failure: R, asking: S, running: z, paused: B, choose: (T, q) => P(["agent", "control", String(e.value.id), T, q.value], { target: x, fields: { value: { ...x.value, [T]: q.label } } }), stop: () => (S.value = !1, P(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (T) => P(["agent", "launch", T.name]) };
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
    const o = e, a = i, f = fa(Ae(o, "agent"), o.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: Ae(o, "controlGroups"), programs: Ae(o, "agentPrograms") }), x = N(null), R = N(""), S = y(() => f.groups.value.find((M) => M.key === R.value));
    function z(M, p) {
      x.value = M.currentTarget, R.value = p;
    }
    function B() {
      x.value = null, R.value = "", f.asking.value = !1;
    }
    const P = y(() => o.skills.filter((M) => M.state === "loaded"));
    function I(M) {
      z(M, "skills"), a("skills");
    }
    const V = (M) => f.groups.value.some((p) => p.key === M), U = y(() => {
      var M;
      return f.chosen.value.model ?? ((M = q.value) == null ? void 0 : M.model) ?? "";
    }), T = y(() => {
      var M;
      return f.chosen.value.effort ?? ((M = q.value) == null ? void 0 : M.effort) ?? "";
    });
    y(() => !!o.agent && !o.agent.ended_at);
    const q = y(() => {
      var M;
      return ((M = o.usage.agents) == null ? void 0 : M.find((p) => {
        var A;
        return p.id === ((A = o.agent) == null ? void 0 : A.id);
      })) ?? null;
    }), F = y(() => {
      var M;
      return ((M = o.usage.windows) == null ? void 0 : M[0]) ?? null;
    }), Z = y(() => F.value ? Math.max(0, Math.min(100, Math.round(F.value.used_percent))) : null), _ = y(() => {
      var M;
      return ((M = q.value) == null ? void 0 : M.context_percent) == null ? null : Math.round(q.value.context_percent);
    }), G = y(() => {
      var M;
      return (M = q.value) != null && M.cost_dollars ? `$${q.value.cost_dollars.toFixed(2)}` : "";
    }), K = y(() => {
      var A;
      const M = (A = o.agent) != null && A.process_started_at ? new Date(o.agent.process_started_at).getTime() : 0;
      if (!M) return "";
      const p = Math.max(0, Math.floor((o.now - M) / 6e4));
      return p >= 60 ? `${Math.floor(p / 60)}h ${p % 60}m` : `${p}m`;
    });
    return (M, p) => (t(), l("div", {
      class: le(["information", { card: e.card }]),
      "data-information-bar": ""
    }, [
      e.agent ? (t(), l(E, { key: 0 }, [
        v("button", {
          type: "button",
          class: "fact lead",
          disabled: e.card,
          "data-fact": "agent",
          title: `Session ${e.agent.session}: stop it`,
          onClick: p[0] || (p[0] = (A) => z(A, "agent"))
        }, [
          b(te, {
            name: "agents",
            size: 12
          }),
          h(" " + d(r(ka)(e.agent.program)), 1)
        ], 8, ba),
        Z.value !== null ? (t(), l("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${Z.value}% of the plan's ${F.value.title} allowance used`,
          onClick: p[1] || (p[1] = (A) => a("open", "usage", A.currentTarget))
        }, [
          b(te, {
            name: "allowance",
            size: 12
          }),
          p[14] || (p[14] = h()),
          v("span", Ma, [
            v("span", {
              style: ve({ width: `${Z.value}%` })
            }, null, 4)
          ]),
          h(" " + d(Z.value) + "% ", 1)
        ], 8, wa)) : g("", !0),
        _.value !== null ? (t(), l("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "context",
          title: `Context ${_.value}% full: clear or compact it`,
          onClick: p[2] || (p[2] = (A) => V("context") ? z(A, "context") : a("open", "context", A.currentTarget))
        }, [
          b(te, {
            name: "gauge",
            size: 12
          }),
          p[15] || (p[15] = h()),
          v("span", xa, [
            v("span", {
              style: ve({ width: `${_.value}%` })
            }, null, 4)
          ]),
          h(" " + d(_.value) + "% ", 1)
        ], 8, $a)) : g("", !0),
        U.value ? (t(), l("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "model",
          title: `${U.value}: change the model`,
          onClick: p[3] || (p[3] = (A) => V("model") ? z(A, "model") : null)
        }, [
          b(te, {
            name: "model",
            size: 12
          }),
          h(" " + d(U.value), 1)
        ], 8, Ca)) : g("", !0),
        V("effort") || e.card && T.value ? (t(), l("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: p[4] || (p[4] = (A) => z(A, "effort"))
        }, [
          b(te, {
            name: "bolt",
            size: 12
          }),
          h(" " + d(T.value), 1)
        ], 8, Sa)) : g("", !0),
        G.value ? (t(), l("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: p[5] || (p[5] = (A) => a("open", "cost", A.currentTarget))
        }, d(G.value), 9, Aa)) : g("", !0),
        K.value ? (t(), l("span", ja, [
          b(te, {
            name: "reminders",
            size: 12
          }),
          h(" " + d(K.value), 1)
        ])) : g("", !0),
        e.branch ? (t(), l("span", Ta, [
          b(te, {
            name: "branch",
            size: 12
          }),
          h(" " + d(e.branch), 1)
        ])) : g("", !0),
        e.card ? g("", !0) : (t(), l("button", {
          key: 7,
          type: "button",
          class: le(["fact", { none: !e.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: p[6] || (p[6] = (A) => a("open", "jobs", A.currentTarget))
        }, [
          b(te, {
            name: "clock",
            size: 12
          }),
          h(" " + d(e.jobs), 1)
        ], 2)),
        e.run ? (t(), l("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: I
        }, [
          b(te, {
            name: "book",
            size: 12
          }),
          h(" " + d(P.value.length), 1)
        ])) : g("", !0),
        e.fitness ? (t(), l(E, { key: 9 }, [
          v("button", {
            type: "button",
            class: le(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Ha }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: p[7] || (p[7] = (A) => a("open", "fitness", A.currentTarget))
          }, [
            b(te, {
              name: "heart",
              size: 12
            }),
            h(" " + d(e.fitness.is_measured ? e.fitness.score : "–"), 1)
          ], 2),
          v("button", {
            type: "button",
            class: le(["fact", "load-fact", e.fitness.workload_level]),
            "data-fact": "load",
            title: "Compare incoming messages with agent replies",
            onClick: p[8] || (p[8] = (A) => a("open", "load", A.currentTarget))
          }, [
            b(te, {
              name: "weight",
              size: 12
            }),
            h(" " + d(e.fitness.workload), 1)
          ], 2)
        ], 64)) : g("", !0)
      ], 64)) : e.run && !e.loading ? (t(), l("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: p[9] || (p[9] = (A) => z(A, "start"))
      }, [
        b(te, {
          name: "agents",
          size: 12
        }),
        p[16] || (p[16] = h(" Start an agent", -1))
      ])) : g("", !0),
      p[22] || (p[22] = v("span", { class: "space" }, null, -1)),
      r(f).failure.value ? (t(), l("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: r(f).failure.value
      }, d(r(f).failure.value), 9, Ra)) : g("", !0),
      ke(M.$slots, "default", {}, void 0, !0),
      x.value ? (t(), D(ha, {
        key: 3,
        anchor: x.value,
        "min-width": 190,
        onClose: B
      }, {
        default: $(() => {
          var A;
          return [
            R.value === "agent" ? (t(), l(E, { key: 0 }, [
              r(f).asking.value ? (t(), l(E, { key: 0 }, [
                b(me, { "data-agent-stop-ask": "" }, {
                  default: $(() => [...p[17] || (p[17] = [
                    h("Stop the agent? It stops what it is doing.", -1)
                  ])]),
                  _: 1
                }),
                b(pe, {
                  "data-agent-stop-confirm": "",
                  onClick: p[10] || (p[10] = (O) => (B(), r(f).stop()))
                }, {
                  default: $(() => [...p[18] || (p[18] = [
                    h("Stop it", -1)
                  ])]),
                  _: 1
                }),
                b(pe, {
                  onClick: p[11] || (p[11] = (O) => r(f).asking.value = !1)
                }, {
                  default: $(() => [...p[19] || (p[19] = [
                    h("Keep it running", -1)
                  ])]),
                  _: 1
                })
              ], 64)) : (t(), D(pe, {
                key: 1,
                "data-agent-stop": "",
                onClick: p[12] || (p[12] = (O) => r(f).asking.value = !0)
              }, {
                default: $(() => [...p[20] || (p[20] = [
                  h("Stop", -1)
                ])]),
                _: 1
              }))
            ], 64)) : R.value === "start" ? (t(), l(E, { key: 1 }, [
              b(me, null, {
                default: $(() => [...p[21] || (p[21] = [
                  h("Start an agent", -1)
                ])]),
                _: 1
              }),
              (t(!0), l(E, null, Q(r(f).programs.value, (O) => (t(), D(pe, {
                key: O.name,
                "data-agent-program": O.name,
                onClick: (u) => (B(), r(f).start(O))
              }, {
                default: $(() => [
                  h(d(O.title), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-program", "onClick"]))), 128))
            ], 64)) : R.value === "skills" ? (t(), D(ua, {
              key: 2,
              skills: e.skills,
              onBrowse: p[13] || (p[13] = (O) => (B(), a("open", "skills", null)))
            }, null, 8, ["skills"])) : S.value ? (t(), l(E, { key: 3 }, [
              b(me, null, {
                default: $(() => [
                  h(d(S.value.label), 1)
                ]),
                _: 1
              }),
              R.value === "context" ? (t(), l(E, { key: 0 }, [
                v("div", Oa, [
                  v("span", za, [
                    v("span", {
                      style: ve({ width: `${_.value}%` })
                    }, null, 4)
                  ]),
                  v("span", Va, d(_.value) + "%", 1)
                ]),
                v("p", Ba, d(r(ya)(((A = q.value) == null ? void 0 : A.last_compaction) ?? null)), 1)
              ], 64)) : g("", !0),
              (t(!0), l(E, null, Q(S.value.choices, (O) => (t(), D(pe, {
                key: O.value,
                "data-agent-choice": O.value,
                onClick: (u) => (r(f).choose(S.value.key, O), B())
              }, {
                default: $(() => [
                  h(d(O.label), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-choice", "onClick"]))), 128))
            ], 64)) : g("", !0)
          ];
        }),
        _: 1
      }, 8, ["anchor"])) : g("", !0)
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
}, _a = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": ""
}, Ka = {
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
}, en = ["data-peek"], tn = ["title"], an = ["data-peek"], nn = ["data-agent-waiting", "data-agent-stopped"], ln = {
  key: 4,
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
      const c = o[a.row.role] || a.row.role;
      return c.slice(0, 1).toUpperCase() + c.slice(1);
    }), S = y(() => {
      var c;
      return ((c = a.facts) == null ? void 0 : c.tasks) ?? [];
    }), z = y(() => S.value.filter((c) => c.state === "open")), B = y(() => {
      const c = S.value.find((n) => {
        var w;
        return n.id === ((w = a.facts) == null ? void 0 : w.task_id);
      });
      return c != null && c.plan_id ? c : z.value.find((n) => n.plan_id);
    }), P = y(() => S.value.find((c) => {
      var n;
      return c.id === ((n = a.progress) == null ? void 0 : n.task_id) && c.state === "started";
    })), I = y(() => P.value ? S.value.filter((c) => c.state === "blocked") : []), V = y(() => {
      var c, n, w, L, k, s;
      return a.row.role === "helper" ? ((c = a.facts) == null ? void 0 : c.helper_job) || "" : (n = a.facts) != null && n.job_enabled && (((w = P.value) == null ? void 0 : w.title) || ((L = a.facts) == null ? void 0 : L.task_title) || ((k = z.value[0]) == null ? void 0 : k.title) || ((s = S.value.at(-1)) == null ? void 0 : s.title)) || "";
    }), U = y(() => {
      const c = V.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return c ? `${c[1].toLowerCase() === "plan" ? "plans" : "docs"}:${c[2]}` : "";
    }), T = y(() => {
      var c;
      return (c = a.facts) != null && c.job_enabled ? `${a.row.role} ${a.row.id}` : "";
    }), q = y(() => {
      var c, n;
      return [a.row.program, (c = a.facts) == null ? void 0 : c.model, (n = a.facts) == null ? void 0 : n.effort, T.value].filter(Boolean).join(" · ");
    }), F = be(), Z = y(() => Ee(a.row.process_started_at || a.row.created_at, x.value)), _ = /* @__PURE__ */ new Set(["open", "started", "testing"]), G = y(() => !!a.row.ended_at && a.row.role !== "main" && S.value.some((c) => _.has(c.state))), K = y(() => {
      var c;
      return a.row.retired_at || a.row.state === "retired" ? "retired" : a.waitReason || G.value ? "waiting" : a.row.state === "running" && ((c = a.facts) == null ? void 0 : c.state) || a.row.state;
    }), M = y(() => {
      var c;
      return a.waitReason ? `Waiting: ${a.waitReason}` : K.value === "blocked" ? (c = a.facts) != null && c.blocked_reason ? `Blocked: ${a.facts.blocked_reason}` : "Blocked" : G.value ? "Stopped with work left" : "";
    }), p = y(() => {
      var c;
      return ((c = a.progress) == null ? void 0 : c.completed_count) ?? S.value.filter((n) => n.state === "completed").length;
    }), A = y(() => {
      var c;
      return ((c = a.progress) == null ? void 0 : c.task_count) ?? S.value.length;
    }), O = y(() => `${p.value} of ${A.value} ${A.value === 1 ? "task" : "tasks"}`), u = y(() => {
      var n;
      const c = st(p.value, ((n = a.progress) == null ? void 0 : n.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, x.value);
      return a.row.role !== "main" && c ? `${c} per hour` : "";
    }), j = y(() => !!a.row.retired_at || a.row.state === "retired");
    return (c, n) => {
      var w, L, k;
      return t(), l("div", {
        class: le(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: n[4] || (n[4] = (s) => !e.open && f("toggle")),
        onKeydown: [
          n[5] || (n[5] = Oe(ne((s) => !e.open && f("toggle"), ["self", "prevent"]), ["enter"])),
          n[6] || (n[6] = Oe(ne((s) => !e.open && f("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        v("span", Na, [
          e.open ? (t(), l("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: n[0] || (n[0] = ne((s) => f("toggle"), ["stop"]))
          }, [
            b(r(ge), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : g("", !0),
          v("span", {
            class: "agent-dot",
            "data-state": K.value,
            "data-agent-motion": ""
          }, null, 8, qa),
          v("span", Wa, d(R.value), 1),
          v("span", Fa, d(((w = e.facts) == null ? void 0 : w.given_name) || e.row.id), 1),
          e.open ? g("", !0) : (t(), D(r(ge), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          v("span", Da, [
            j.value ? (t(), l("span", Pa, [
              n[7] || (n[7] = h("Retired, ", -1)),
              b(r(xe), {
                at: e.row.retired_at
              }, null, 8, ["at"])
            ])) : e.row.ended_at ? (t(), l("span", Ua, [
              n[8] || (n[8] = h("Idle, ", -1)),
              b(r(xe), {
                at: e.row.ended_at
              }, null, 8, ["at"])
            ])) : (t(), l("span", _a, d(Z.value), 1)),
            !e.open && e.row.role === "worker" && u.value ? (t(), l("span", Ka, d(u.value), 1)) : g("", !0)
          ])
        ]),
        v("span", Ja, [
          v("span", Za, d(q.value), 1),
          e.open ? (t(), l("span", Ga, [
            b(r(ge), {
              name: "time",
              size: 12
            }),
            n[9] || (n[9] = h("First dispatched: ", -1)),
            b(r(xe), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : g("", !0),
          e.open && ((L = e.facts) != null && L.last_activity) ? (t(), l("span", Ya, [
            n[10] || (n[10] = h("Last heard: ", -1)),
            b(r(xe), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : g("", !0)
        ]),
        e.open ? (t(), D(Ia, {
          key: 0,
          agent: e.row,
          branch: (k = e.progress) == null ? void 0 : k.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: [] },
          card: ""
        }, {
          default: $(() => [
            b(Jt, { row: e.row }, null, 8, ["row"]),
            e.row.role === "helper" && !e.row.ended_at ? (t(), D(r(ae), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: n[1] || (n[1] = ne((s) => r(F).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: $(() => [...n[11] || (n[11] = [
                h("Stop", -1)
              ])]),
              _: 1
            })) : g("", !0)
          ]),
          _: 1
        }, 8, ["agent", "branch", "usage"])) : g("", !0),
        e.open && A.value && !V.value ? (t(), l("span", Qa, [
          b(Ve, {
            count: O.value,
            rate: u.value
          }, null, 8, ["count", "rate"])
        ])) : g("", !0),
        e.open && B.value ? (t(), l("span", Xa, [
          v("button", {
            type: "button",
            class: "agent-plan",
            "data-agent-plan": "",
            "data-peek": `plans:${B.value.plan_id}`,
            onClick: n[2] || (n[2] = ne((s) => r(ye)(`plans:${B.value.plan_id}`), ["stop"]))
          }, "Plan " + d(B.value.plan_id) + ": " + d(B.value.plan_title), 9, en)
        ])) : g("", !0),
        V.value || !e.open && M.value ? (t(), l("span", {
          key: 3,
          class: le(["agent-line", { "agent-work-start": !B.value }])
        }, [
          v("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: V.value
          }, [
            e.open && U.value ? (t(), l("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": U.value,
              onClick: n[3] || (n[3] = ne((s) => r(ye)(U.value), ["stop"]))
            }, d(V.value), 9, an)) : (t(), l(E, { key: 1 }, [
              h(d(V.value), 1)
            ], 64))
          ], 8, tn),
          !e.open && M.value ? (t(), l("span", {
            key: 0,
            class: "agent-work-status",
            "data-agent-waiting": e.waitReason ? "" : null,
            "data-agent-stopped": G.value && !e.waitReason ? "" : null
          }, d(M.value), 9, nn)) : g("", !0),
          e.open && A.value ? (t(), D(Ve, {
            key: 1,
            count: O.value,
            rate: u.value
          }, null, 8, ["count", "rate"])) : g("", !0)
        ], 2)) : g("", !0),
        I.value.length ? (t(), l("span", ln, "Blocked: " + d(I.value.map((s) => `task ${s.id}`).join(", ")), 1)) : g("", !0),
        e.open ? (t(), D(Vt, {
          key: 5,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: S.value,
          "stopped-with-work": G.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : g("", !0)
      ], 42, Ea);
    };
  }
}, sn = /* @__PURE__ */ ee(on, [["__scopeId", "data-v-32f4dd8f"]]), rn = {
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
    const o = i, a = be(), { rows: f, failure: x } = a.props.limits, { rows: R } = a.props["count-agents"], S = Ie(), z = N(!1), B = N(null), P = N(!1), I = N(!1), V = N(""), U = N(""), T = N(null), q = N(""), F = y(() => f.value.flatMap((k) => k.per_profile ? k.profiles.filter((s) => s.kept).map((s) => ({ ...s, label: s.title, type: k.key, key: `${k.key}:${s.profile}` })) : [{ ...k, type: k.key }])), Z = (k, s) => s > 0 && k >= s, _ = y(() => F.value.filter((k) => Z(k.running, k.run_limit) || Z(k.kept, k.kept_limit)).length), G = y(() => f.value.find((k) => k.per_profile)), K = y(() => F.value.find((k) => k.key === B.value)), M = y(() => R.value.filter((k) => {
      var s, m;
      return k.state !== "retired" && k.role === ((s = K.value) == null ? void 0 : s.type) && (!K.value.profile || (((m = k.facts) == null ? void 0 : m.profile) || k.profile) === K.value.profile);
    }).sort((k, s) => (k.state !== "running") - (s.state !== "running") || String(k.ended_at || k.created_at).localeCompare(String(s.ended_at || s.created_at)))), p = y(() => {
      var s;
      const k = /* @__PURE__ */ new Map();
      for (const m of M.value) {
        const C = ((s = m.facts) == null ? void 0 : s.model) || m.program_model;
        C && k.set(C, (k.get(C) || 0) + 1);
      }
      return [...k].map(([m, C]) => `${C} ${m}`).join(", ");
    }), A = (k, s) => s ? `${Math.min(k / Math.max(k, s) * 100, 100)}%` : "0%", O = (k, s) => s && k > s ? `${(k - s) / k * 100}%` : "0%", u = y(() => {
      var k;
      return P.value ? "Change the maximums" : ((k = K.value) == null ? void 0 : k.label) || "Agent counts";
    });
    function j() {
      P.value = !1, B.value = null, T.value = null, V.value = "";
    }
    function c() {
      z.value = !1, j();
    }
    async function n(k, s, m, C) {
      if (I.value || a.readOnly) return;
      const Y = Number(C);
      if (!String(C).trim() || !Number.isInteger(Y) || Y < 0) {
        V.value = "Use a whole number of 0 or more.";
        return;
      }
      I.value = !0, V.value = "";
      const oe = await a.run(["setting", "set", s, String(Y), "--environment", a.environment]);
      oe.ok ? (await a.reload("limits"), U.value = "Saved.") : V.value = oe.error, I.value = !1;
    }
    async function w(k) {
      if (!q.value.trim() || I.value) return;
      I.value = !0;
      const s = await a.run(["agent", "retire", String(k.id), "--reason", q.value.trim()]);
      V.value = s.ok ? "" : "The agent could not be retired. Try again.", s.ok && (T.value = null, q.value = "", U.value = "Agent retired permanently.", await Promise.all([a.reload("limits"), a.reload("count-agents")])), I.value = !1;
    }
    function L(k) {
      c(), o("open-agent", k);
    }
    return (k, s) => (t(), l(E, null, [
      v("button", {
        class: "counts-button",
        type: "button",
        title: "Agent counts",
        "aria-label": "Agent counts",
        "data-agent-counts": "",
        onClick: s[0] || (s[0] = (m) => z.value = !0)
      }, [
        b(r(ge), {
          name: "settings",
          size: 16
        }),
        _.value ? (t(), l("span", rn, d(_.value), 1)) : g("", !0)
      ]),
      z.value ? (t(), D(r(rt), {
        key: 0,
        title: u.value,
        modal: "",
        fits: "",
        onClose: c,
        onEscape: c
      }, {
        foot: $(() => [
          P.value ? (t(), l(E, { key: 0 }, [
            v("span", Cn, d(U.value || `Changes apply to ${r(a).environment}.`), 1),
            b(r(ae), { onClick: j }, {
              default: $(() => [...s[18] || (s[18] = [
                h("Done", -1)
              ])]),
              _: 1
            })
          ], 64)) : K.value ? g("", !0) : (t(), D(r(ae), {
            key: 1,
            disabled: r(a).readOnly,
            "data-agent-limits-edit": "",
            onClick: s[4] || (s[4] = (m) => P.value = !0)
          }, {
            default: $(() => [...s[19] || (s[19] = [
              h("Change the maximums", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]))
        ]),
        default: $(() => [
          v("div", un, [
            P.value || K.value ? (t(), l("button", {
              key: 0,
              class: "back",
              type: "button",
              onClick: j
            }, "‹ Back to the counts")) : g("", !0),
            r(x) ? (t(), l(E, { key: 1 }, [
              s[6] || (s[6] = v("strong", null, "The counts could not be read", -1)),
              s[7] || (s[7] = v("p", null, "The journal did not answer.", -1)),
              b(r(ae), {
                small: "",
                onClick: s[1] || (s[1] = (m) => r(a).reload("limits"))
              }, {
                default: $(() => [...s[5] || (s[5] = [
                  h("Try again", -1)
                ])]),
                _: 1
              })
            ], 64)) : P.value ? (t(), l(E, { key: 2 }, [
              s[8] || (s[8] = v("p", null, "How many agents of a type may run at once, and how many may be kept.", -1)),
              (t(!0), l(E, null, Q(r(f), (m) => (t(), l("div", {
                key: m.key,
                class: "edit-row",
                "data-edit-type": m.key
              }, [
                v("div", null, [
                  v("strong", null, d(m.per_profile ? "Each helper type" : "Workers"), 1),
                  m.per_profile ? (t(), l("small", cn, "Researcher, Planner and the others")) : g("", !0)
                ]),
                (t(!0), l(E, null, Q([{ name: "Most running", value: m.run_limit, key: m.run_setting, source: m.run_source, kind: "run" }, { name: "Most kept", value: m.kept_limit, key: m.kept_setting, source: m.kept_source, kind: "kept" }], (C) => (t(), l("label", {
                  key: C.key
                }, [
                  h(d(C.name), 1),
                  v("span", pn, [
                    v("button", {
                      type: "button",
                      disabled: I.value || r(a).readOnly || C.value === 0,
                      onClick: (Y) => n(m, C.key, C.value, C.value - 1)
                    }, "−", 8, vn),
                    v("input", {
                      type: "number",
                      min: "0",
                      value: C.value,
                      disabled: I.value || r(a).readOnly,
                      "data-agent-limit-input": C.kind,
                      onChange: (Y) => n(m, C.key, C.value, Y.target.value)
                    }, null, 40, gn),
                    v("button", {
                      type: "button",
                      disabled: I.value || r(a).readOnly,
                      onClick: (Y) => n(m, C.key, C.value, C.value + 1)
                    }, "+", 8, hn)
                  ]),
                  C.value === 0 ? (t(), l("small", mn, d(C.kind === "run" ? "None can start" : "Any number"), 1)) : C.source === `environment ${r(a).environment}` ? (t(), l("small", fn, "Changed for " + d(r(a).environment), 1)) : g("", !0)
                ]))), 128))
              ], 8, dn))), 128))
            ], 64)) : K.value ? (t(), l(E, { key: 3 }, [
              v("p", null, [
                v("strong", null, d(K.value.running) + " of " + d(K.value.run_limit), 1),
                s[9] || (s[9] = h(" running, ", -1)),
                v("strong", null, [
                  h(d(K.value.kept), 1),
                  K.value.kept_limit ? (t(), l(E, { key: 0 }, [
                    h(" of " + d(K.value.kept_limit), 1)
                  ], 64)) : g("", !0)
                ]),
                s[10] || (s[10] = h(" kept", -1))
              ]),
              v("p", null, d(p.value), 1),
              M.value.length ? g("", !0) : (t(), l(E, { key: 0 }, [
                s[11] || (s[11] = v("strong", null, "No agents here yet", -1)),
                s[12] || (s[12] = v("p", null, "An agent shows here as soon as one of this type starts.", -1))
              ], 64)),
              (t(!0), l(E, null, Q(M.value, (m) => {
                var C, Y, oe, we, he;
                return t(), l("div", {
                  key: m.id,
                  class: "person",
                  "data-count-agent": m.id
                }, [
                  v("span", {
                    class: le(["dot", { running: m.state === "running" }])
                  }, null, 2),
                  v("div", yn, [
                    v("strong", null, d(((C = m.facts) == null ? void 0 : C.given_name) || m.id), 1),
                    h(" " + d(m.state === "running" ? "Running" : "Idle") + ", " + d(r(Ee)(m.state === "running" ? m.process_started_at || m.created_at : m.ended_at, r(S))), 1),
                    v("small", null, d([m.program, (Y = m.facts) == null ? void 0 : Y.model, (oe = m.facts) == null ? void 0 : oe.effort, `${m.role} ${m.id}`].filter(Boolean).join(", ")), 1),
                    v("small", null, d(((we = m.facts) == null ? void 0 : we.task_title) || ((he = m.facts) == null ? void 0 : he.helper_job)), 1)
                  ]),
                  b(r(ae), {
                    small: "",
                    onClick: (ue) => L(m)
                  }, {
                    default: $(() => [...s[13] || (s[13] = [
                      h("Open", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"]),
                  m.state === "idle" && !r(a).readOnly ? (t(), D(r(ae), {
                    key: 0,
                    small: "",
                    onClick: (ue) => {
                      T.value = m.id, q.value = "";
                    }
                  }, {
                    default: $(() => [...s[14] || (s[14] = [
                      h("Retire", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"])) : g("", !0),
                  T.value === m.id ? (t(), D(Ne, {
                    key: 1,
                    reason: q.value,
                    "onUpdate:reason": s[2] || (s[2] = (ue) => q.value = ue),
                    pending: I.value,
                    onSubmit: (ue) => w(m),
                    onCancel: s[3] || (s[3] = (ue) => T.value = null)
                  }, null, 8, ["reason", "pending", "onSubmit"])) : g("", !0)
                ], 8, kn);
              }), 128))
            ], 64)) : (t(), l(E, { key: 4 }, [
              s[16] || (s[16] = v("p", null, "Kept agents have not been retired, so they can take another job. Open a row to see them.", -1)),
              s[17] || (s[17] = v("div", { class: "columns" }, [
                v("span", null, "Name"),
                v("span", null, "Running"),
                v("span", null, "Kept"),
                v("span")
              ], -1)),
              G.value ? (t(), l("div", bn, [
                s[15] || (s[15] = v("strong", null, "Helpers", -1)),
                v("span", null, d(G.value.running) + " running, " + d(G.value.kept) + " kept", 1)
              ])) : g("", !0),
              (t(!0), l(E, null, Q(F.value, (m) => (t(), l("button", {
                key: m.key,
                type: "button",
                class: "count-row",
                "data-agent-limit-type": m.type || m.key,
                "data-agent-limit-profile": m.profile,
                onClick: (C) => B.value = m.key
              }, [
                v("strong", null, d(m.label), 1),
                (t(!0), l(E, null, Q([{ count: m.running, limit: m.run_limit, unlimited: !1 }, { count: m.kept, limit: m.kept_limit, unlimited: !0 }], (C) => (t(), l("span", {
                  key: C.unlimited,
                  class: le({ full: Z(C.count, C.limit) })
                }, [
                  v("span", null, [
                    h(d(C.count), 1),
                    C.limit || !C.unlimited ? (t(), l(E, { key: 0 }, [
                      h(" of " + d(C.limit), 1)
                    ], 64)) : g("", !0)
                  ]),
                  C.limit ? (t(), l("span", Mn, [
                    v("span", {
                      style: ve({ width: A(C.count, C.limit) })
                    }, null, 4),
                    v("i", {
                      style: ve({ width: O(C.count, C.limit) })
                    }, null, 4)
                  ])) : g("", !0)
                ], 2))), 128)),
                b(r(ge), {
                  name: "chevronRight",
                  size: 12
                })
              ], 8, wn))), 128))
            ], 64)),
            V.value ? (t(), l("p", $n, d(V.value), 1)) : U.value ? (t(), l("p", xn, d(U.value), 1)) : g("", !0)
          ])
        ]),
        _: 1
      }, 8, ["title"])) : g("", !0)
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
    const i = e, o = be(), { rows: a } = o.props.waits, { rows: f } = o.props.progress, { rows: x, failure: R, loaded: S, more: z } = o.props.agents, B = (W) => f.value.find((J) => J.agent_id === W.id) ?? null, P = (W) => {
      var J;
      return ((J = a.value.find((H) => H.agent_id === W.id)) == null ? void 0 : J.reason) ?? "";
    }, I = N("running"), V = N(""), U = JSON.parse(localStorage.getItem(Be) || '{"roles":[],"profiles":[],"programs":[]}'), T = N(U), q = y(() => o.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: F } = o.props.programs, Z = y(() => T.value.roles.length + T.value.profiles.length + T.value.programs.length), _ = (W, J) => {
      T.value = ct(T.value, W, J);
    }, G = () => {
      T.value = { roles: [], profiles: [], programs: [] };
    }, K = (W) => W.slice(0, 1).toUpperCase() + W.slice(1);
    ie(T, (W) => localStorage.setItem(Be, JSON.stringify(W)));
    const M = N(25);
    function p() {
      Object.assign(o.state, {
        "agents.show": I.value,
        "agents.search": V.value,
        "agents.limit": String(M.value),
        "agents.roles": T.value.roles.join(","),
        "agents.profiles": T.value.profiles.join(","),
        "agents.programs": T.value.programs.join(",")
      });
    }
    async function A() {
      return M.value += 25, p(), await o.reload("agents"), !0;
    }
    ie([I, V, T], () => {
      M.value = 25, p(), o.reload("agents");
    }), p();
    const O = (W) => W.facts ?? null, u = x, j = y(() => !!V.value.trim() || Z.value > 0), c = y(() => i.texts[I.value] ?? { title: i.empty, hint: "" }), n = N(null), w = N(null), L = N(null), k = N(null), s = y(() => n.value === null ? null : o.props[`card.${n.value}`].rows.value.find((W) => W.id === n.value) ?? w.value), m = y(() => s.value ? [s.value] : u.value), C = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let Y = !1, oe = 0;
    async function we(W) {
      if (Y) return;
      Y = !0, oe = k.value.scrollTop;
      const J = L.value.querySelector(`[data-agent-open="${W.id}"]`);
      if (!C()) {
        const re = [...L.value.querySelectorAll(".agent-row")].filter((se) => !se.contains(J));
        await Promise.all(re.map((se) => se.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const H = [...J.querySelectorAll(".agent-head, .agent-line")], X = [...H, ...J.querySelectorAll("[data-agent-motion]")], Me = X.map((re) => re.getBoundingClientRect());
      if (w.value = W, n.value = W.id, o.reload(`card.${W.id}`), await ze(), !C()) {
        const re = X.map((se) => se.getBoundingClientRect());
        X.forEach((se, $e) => {
          const de = H.indexOf(se.parentElement), De = Me[$e].left - re[$e].left - (de < 0 ? 0 : Me[de].left - re[de].left), Pe = Me[$e].top - re[$e].top - (de < 0 ? 0 : Me[de].top - re[de].top);
          se.animate([{ transform: `translate(${De}px, ${Pe}px)` }, { transform: "none" }], { duration: 280, easing: Se });
        }), L.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((se) => {
          se.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Se, fill: "backwards" });
        });
      }
      Y = !1;
    }
    async function he() {
      if (Y || !s.value) return;
      Y = !0;
      const W = L.value.querySelector(`[data-agent-open="${n.value}"]`), J = [...W.children], H = C() ? [] : J.map((X) => X.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(H.map((X) => X.finished)), n.value = null, await ze(), k.value.scrollTop = oe, H.forEach((X) => X.cancel()), C() || (W.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Se }), L.value.querySelectorAll(".agent-row").forEach((X) => {
        X.contains(W) || X.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Se });
      })), Y = !1;
    }
    function ue(W) {
      w.value = W, n.value = W.id, o.reload(`card.${W.id}`);
    }
    const Fe = (W) => n.value === W.id ? he() : we(W);
    ie(V, (W) => W.trim() && (n.value = null)), ie(I, () => {
      n.value = null;
    });
    const Re = (W) => {
      W.key === "Escape" && he();
    };
    return window.addEventListener("keydown", Re), fe(() => window.removeEventListener("keydown", Re)), (W, J) => (t(), l("div", {
      ref_key: "agents",
      ref: L,
      class: le(["agents", { focused: s.value }])
    }, [
      b(r(it), {
        modelValue: V.value,
        "onUpdate:modelValue": J[1] || (J[1] = (H) => V.value = H),
        placeholder: "Search agents",
        "menu-count": Z.value,
        "data-agents-search": ""
      }, {
        menu: $(() => [
          b(r(je), null, {
            default: $(() => [...J[2] || (J[2] = [
              h("Type", -1)
            ])]),
            _: 1
          }),
          (t(!0), l(E, null, Q(q.value.roles, (H) => (t(), D(r(Ce), {
            key: H,
            role: "menuitemcheckbox",
            "aria-checked": T.value.roles.includes(H),
            checked: T.value.roles.includes(H),
            "data-filter-role": H,
            onClick: (X) => _("roles", H)
          }, {
            default: $(() => [
              h(d(K(H)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          q.value.profiles.length ? (t(), D(r(je), { key: 0 }, {
            default: $(() => [...J[3] || (J[3] = [
              h("Profile", -1)
            ])]),
            _: 1
          })) : g("", !0),
          (t(!0), l(E, null, Q(q.value.profiles, (H) => (t(), D(r(Ce), {
            key: H.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.profiles.includes(H.name),
            checked: T.value.profiles.includes(H.name),
            "data-filter-profile": H.name,
            onClick: (X) => _("profiles", H.name)
          }, {
            default: $(() => [
              h(d(H.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          b(r(je), null, {
            default: $(() => [...J[4] || (J[4] = [
              h("Program", -1)
            ])]),
            _: 1
          }),
          (t(!0), l(E, null, Q(r(F), (H) => (t(), D(r(Ce), {
            key: H.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.programs.includes(H.name),
            checked: T.value.programs.includes(H.name),
            "data-filter-program": H.name,
            onClick: (X) => _("programs", H.name)
          }, {
            default: $(() => [
              h(d(H.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          Z.value ? (t(), D(r(Ce), {
            key: 1,
            "data-filter-clear": "",
            onClick: G
          }, {
            default: $(() => [...J[5] || (J[5] = [
              h("Clear filters", -1)
            ])]),
            _: 1
          })) : g("", !0)
        ]),
        default: $(() => [
          b(r(ut), {
            options: q.value.states,
            value: I.value,
            onPick: J[0] || (J[0] = (H) => I.value = H)
          }, null, 8, ["options", "value"]),
          b(An, { onOpenAgent: ue })
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      I.value === "retired" && q.value.upgrade_retired ? (t(), l("p", jn, "Retired during the upgrade: " + d(q.value.upgrade_retired), 1)) : g("", !0),
      v("div", {
        ref_key: "list",
        ref: k,
        class: le(["agents-view", { "agents-view-open": s.value }])
      }, [
        r(S) && !r(R) && !m.value.length && Z.value ? (t(), D(r(Te), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: $(() => [
            b(r(ae), {
              small: "",
              "data-empty-clear": "",
              onClick: G
            }, {
              default: $(() => [...J[6] || (J[6] = [
                h("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (t(), D(r(dt), {
          key: 1,
          rows: m.value,
          failure: r(R),
          loaded: r(S),
          more: !s.value && r(z),
          older: A,
          empty: c.value.title,
          hint: c.value.hint,
          searching: j.value
        }, {
          default: $(({ row: H }) => [
            v("div", {
              class: "agent-row",
              "data-agent-row": H.id
            }, [
              b(sn, {
                row: H,
                facts: O(H),
                progress: B(H),
                "wait-reason": P(H),
                open: H.id === n.value,
                onToggle: (X) => Fe(H)
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
