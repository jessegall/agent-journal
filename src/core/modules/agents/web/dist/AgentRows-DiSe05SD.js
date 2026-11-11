import { openBlock as n, createElementBlock as l, withModifiers as ee, unref as r, createTextVNode as h, toDisplayString as g, createVNode as p, createBlock as z, computed as c, createElementVNode as b, createCommentVNode as m, withCtx as f, Fragment as q, renderList as ne, ref as V, watch as ge, onUnmounted as Ce, defineAsyncComponent as Xe, createSlots as et, resolveDynamicComponent as tt, normalizeClass as de, normalizeStyle as Be, renderSlot as Ae, onMounted as at, Teleport as nt, mergeProps as ot, toRef as Ve, withKeys as qe, nextTick as Fe } from "vue";
import { peekRef as ye, Icon as He, RunningCommand as st, TimeAgo as Ie, FoldGroup as Je, TaskStatusIcon as lt, useWindow as Oe, loadWindowComponent as rt, coalesced as it, READ_RATES as dt, eventMayBeChildOf as ut, InnerTabs as ct, TabBody as gt, SwitchCase as Ke, EmptyState as Ee, TextInput as Ne, Btn as te, TextArea as vt, HoverTip as xe, TaskBar as mt, useNow as _e, age as pt, perHour as ht, sinceWords as ft, seenWords as bt, AgentTip as kt, SearchBar as yt, Segmented as wt, MenuLabel as ze, MenuItem as Le, RowList as Mt, toggleFilter as $t } from "@journal/window-kit";
import { _ as J, T as xt } from "./TranscriptRows-Crmxs6Un.js";
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
    return (s, t) => (n(), l("span", St, [
      e.waitReason ? (n(), l("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: t[0] || (t[0] = ee((o) => r(ye)("test_queue:0"), ["stop"]))
      }, [
        h("Waiting: " + g(e.waitReason) + " ", 1),
        p(r(He), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (n(), l("span", Ct, "Waiting")) : (n(), z(r(st), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, jt = /* @__PURE__ */ J(At, [["__scopeId", "data-v-1b371fb5"]]), Tt = {
  class: "lasting-facts",
  "data-agent-lasting-facts": ""
}, Lt = { key: 0 }, Rt = { "data-agent-first-dispatched": "" }, Bt = { "data-agent-session-count": "" }, It = { key: 1 }, Ot = { "data-agent-session-end-reason": "" }, Vt = { key: 2 }, zt = { "data-agent-retired-at": "" }, Ht = { key: 3 }, Et = { "data-agent-retired-by": "" }, Nt = {
  __name: "AgentLastingFacts",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const s = {
      finished: "its work was finished",
      cache_passed: "its cache had passed",
      context_limit: "its context was full",
      replaced_by_person: "a person replaced it",
      driver_changed: "its driver was changed",
      each_launch: "each job starts a new one",
      launch_rotation: "its program was changed for the job",
      conversation_missing: "its conversation was gone",
      never_started: "it never started",
      unknown: "the reason is not known"
    }, t = e, o = c(() => t.row.replaced_session_end_reason ? s[t.row.replaced_session_end_reason] || t.row.replaced_session_end_reason.replaceAll("_", " ") : "");
    return (i, a) => (n(), l("dl", Tt, [
      e.row.created_at ? (n(), l("div", Lt, [
        a[0] || (a[0] = b("dt", null, "Started", -1)),
        b("dd", Rt, [
          p(r(Ie), {
            at: e.row.created_at
          }, null, 8, ["at"])
        ])
      ])) : m("", !0),
      b("div", null, [
        a[1] || (a[1] = b("dt", null, "Sessions", -1)),
        b("dd", Bt, g(e.row.session_count ?? 0), 1)
      ]),
      o.value ? (n(), l("div", It, [
        a[2] || (a[2] = b("dt", null, "Last session ended", -1)),
        b("dd", Ot, g(o.value), 1)
      ])) : m("", !0),
      e.row.retired_at ? (n(), l("div", Vt, [
        a[3] || (a[3] = b("dt", null, "Retired", -1)),
        b("dd", zt, [
          p(r(Ie), {
            at: e.row.retired_at
          }, null, 8, ["at"])
        ])
      ])) : m("", !0),
      e.row.retiring_actor_name ? (n(), l("div", Ht, [
        a[4] || (a[4] = b("dt", null, "Retired by", -1)),
        b("dd", Et, g(e.row.retiring_actor_name), 1)
      ])) : m("", !0)
    ]));
  }
}, Wt = /* @__PURE__ */ J(Nt, [["__scopeId", "data-v-3d75bc39"]]), Dt = ["data-agent-delegated", "onClick"], qt = { class: "agent-task-number" }, Ft = { class: "agent-task-title" }, Ut = ["title"], Pt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: s }) {
    const t = s;
    return (o, i) => (n(), z(r(Je), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: i[0] || (i[0] = (a) => t("toggle"))
    }, {
      default: f(() => [
        (n(!0), l(q, null, ne(e.section.tasks, (a) => (n(), l("button", {
          key: a.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": a.id,
          onClick: (k) => r(ye)(`tasks:${a.id}`)
        }, [
          p(r(lt), {
            status: a.state
          }, null, 8, ["status"]),
          b("span", qt, g(a.id), 1),
          b("span", Ft, g(a.title), 1),
          a.plan_id ? (n(), l("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${a.plan_id}: ${a.plan_title}`
          }, "Plan " + g(a.plan_id), 9, Ut)) : m("", !0)
        ], 8, Dt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Gt = /* @__PURE__ */ J(Pt, [["__scopeId", "data-v-ea4ccd6b"]]), Jt = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Kt = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, _t = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, Zt = ["data-peek", "onClick"], Yt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Qt = {
  key: 0,
  class: "agent-helper-brief"
}, Xt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ea = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, ta = "It ended without a report", aa = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const s = e, t = ["started", "blocked", "open", "completed"], o = c(() => {
      var y, u;
      return s.row.ended_at && ((u = (y = s.facts) == null ? void 0 : y.job_returned) != null && u.startsWith(ta)) ? s.facts.job_returned : "";
    }), i = c(() => s.tasks.length ? t.map((y) => ({ state: y, label: y.slice(0, 1).toUpperCase() + y.slice(1), tasks: s.tasks.filter((u) => u.state === y || y === "started" && u.state === "testing" || y === "completed" && u.state === "cancelled") })) : []), a = /* @__PURE__ */ new Set(["completed"]), k = V({}), S = (y) => !(k.value[y] ?? a.has(y)), R = (y) => k.value = { ...k.value, [y]: S(y) }, C = Oe(), { rows: W } = C.props.reports;
    C.state["reports.agent"] = String(s.row.number);
    const D = c(() => s.row.access === "read-only"), H = c(() => !!s.row.retired_at || s.row.state === "retired"), E = ["tasks", "transcript", "terminal", "file-feed", "reports", "memories"], T = c(() => (H.value ? C.tabs.filter((u) => ["reports", "transcript", "memories"].includes(u.key)) : D.value ? C.tabs.filter((u) => ["reports", "transcript", "terminal", "memories"].includes(u.key)) : [...C.tabs]).sort((u, d) => (E.indexOf(u.key) < 0 ? E.length : E.indexOf(u.key)) - (E.indexOf(d.key) < 0 ? E.length : E.indexOf(d.key)))), I = () => D.value || H.value ? T.value.find((y) => y.key === "transcript") : T.value[0], N = V(I());
    ge(N, (y) => {
      C.state.tab = (y == null ? void 0 : y.key) ?? "";
    }, { immediate: !0 }), Ce(() => {
      C.state.tab = "";
    }), ge(T, (y) => {
      y.some((u) => {
        var d;
        return u.key === ((d = N.value) == null ? void 0 : d.key);
      }) || (N.value = y[0]);
    }), ge(() => s.open, (y) => {
      y && (N.value = I());
    });
    const _ = Object.fromEntries(C.tabs.filter((y) => y.component).map((y) => [y.key, Xe(() => rt(y.component))])), P = V(!1), { data: Q } = C.props.tool, oe = c(() => {
      var y;
      return ((y = Q.value) == null ? void 0 : y.tool) ?? "";
    }), F = c(() => {
      var y;
      return ((y = Q.value) == null ? void 0 : y.note) ?? "";
    }), K = c(() => s.row.role !== "main" && (!s.row.ended_at || s.stoppedWithWork || s.waitReason));
    async function $() {
      !s.open || !K.value || (C.state["tool.agent"] = String(s.row.number), await C.reload("tool"));
    }
    const v = it($, dt.agentCommand), Z = C.follow(["hook_call.*", "process_part.*"], (y) => ut(y, "session_agent_id", /* @__PURE__ */ new Set([s.row.id])) && v());
    return Ce(() => Z == null ? void 0 : Z()), ge(() => s.open, (y) => {
      y && $();
    }, { immediate: !0 }), (y, u) => {
      var d;
      return n(), l("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: u[2] || (u[2] = ee(() => {
        }, ["stop"]))
      }, [
        p(Wt, { row: e.row }, null, 8, ["row"]),
        e.row.retirement_reason ? (n(), l("p", Jt, "Retirement reason: " + g(e.row.retirement_reason), 1)) : m("", !0),
        e.row.resume_reason ? (n(), l("p", Kt, g(e.row.resume_reason), 1)) : m("", !0),
        K.value ? (n(), z(jt, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: oe.value,
          note: F.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0),
        o.value ? (n(), l("p", _t, g(o.value), 1)) : m("", !0),
        p(r(ct), {
          class: "agent-tabs",
          tabs: T.value,
          active: N.value,
          answer: { tasks: e.tasks.length, reports: e.row.report_count ?? r(W).length, memories: e.row.memory_count ?? 0 },
          onChoose: u[0] || (u[0] = (B) => N.value = B)
        }, null, 8, ["tabs", "active", "answer"]),
        p(r(gt), {
          class: "agent-tab-body",
          tab: N.value,
          "data-agent-tab-body": (d = N.value) == null ? void 0 : d.key
        }, {
          default: f(() => {
            var B;
            return [
              p(r(Ke), {
                value: (B = N.value) == null ? void 0 : B.key
              }, et({
                reports: f(() => [
                  r(W).length ? m("", !0) : (n(), z(r(Ee), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: f(() => [...u[3] || (u[3] = [
                      h("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (n(!0), l(q, null, ne(r(W), (w) => (n(), l("button", {
                    key: w.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${w.id}`,
                    onClick: (x) => r(ye)(`messages:${w.id}`)
                  }, g(w.text), 9, Zt))), 128))
                ]),
                tasks: f(() => {
                  var w;
                  return [
                    e.tasks.length ? m("", !0) : (n(), z(r(Ee), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: f(() => [...u[4] || (u[4] = [
                        h("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (n(!0), l(q, null, ne(i.value, (x) => (n(), z(Gt, {
                      key: x.state,
                      section: x,
                      open: S(x.state),
                      onToggle: (Y) => R(x.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (w = e.facts) != null && w.instruction ? (n(), l(q, { key: 1 }, [
                      u[5] || (u[5] = b("p", { class: "agent-label" }, "Instruction", -1)),
                      b("div", Yt, g(e.facts.instruction), 1)
                    ], 64)) : m("", !0)
                  ];
                }),
                transcript: f(() => {
                  var w;
                  return [
                    D.value ? (n(), l(q, { key: 0 }, [
                      (w = e.facts) != null && w.instruction ? (n(), l("div", Qt, [
                        p(r(Je), {
                          label: "Instruction",
                          open: P.value,
                          "data-agent-section": "instruction",
                          onToggle: u[1] || (u[1] = (x) => P.value = !P.value)
                        }, {
                          default: f(() => [
                            b("div", Xt, g(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (n(), l("p", ea, "No job recorded")) : m("", !0)
                    ], 64)) : m("", !0),
                    p(xt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                ne(r(_), (w, x) => ({
                  name: x,
                  fn: f(() => [
                    (n(), z(tt(w), {
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
}, na = /* @__PURE__ */ J(aa, [["__scopeId", "data-v-f4f52ea5"]]), oa = { class: "action-buttons" }, sa = {
  __name: "AgentDriverForm",
  props: { program: String, model: String, pending: Boolean },
  emits: ["submit", "cancel", "update:program", "update:model"],
  setup(e) {
    return (s, t) => (n(), l("form", {
      "data-agent-driver-form": "",
      onSubmit: t[3] || (t[3] = ee((o) => s.$emit("submit"), ["prevent"]))
    }, [
      t[6] || (t[6] = b("p", null, "Starts the next session on this program; the agent keeps its number and memories.", -1)),
      p(r(Ne), {
        "model-value": e.program,
        label: "Program",
        disabled: e.pending,
        "data-agent-driver-program": "",
        "onUpdate:modelValue": t[0] || (t[0] = (o) => s.$emit("update:program", o))
      }, null, 8, ["model-value", "disabled"]),
      p(r(Ne), {
        "model-value": e.model,
        label: "Model",
        disabled: e.pending,
        "data-agent-driver-model": "",
        "onUpdate:modelValue": t[1] || (t[1] = (o) => s.$emit("update:model", o))
      }, null, 8, ["model-value", "disabled"]),
      b("div", oa, [
        p(r(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.program.trim() || !e.model.trim(),
          "data-agent-confirm-driver": ""
        }, {
          default: f(() => [...t[4] || (t[4] = [
            h("Change the driver", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(r(te), {
          small: "",
          disabled: e.pending,
          onClick: t[2] || (t[2] = (o) => s.$emit("cancel"))
        }, {
          default: f(() => [...t[5] || (t[5] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, la = /* @__PURE__ */ J(sa, [["__scopeId", "data-v-c138a4da"]]), ra = { class: "action-field" }, ia = ["value", "disabled"], da = ["value"], ua = { key: 1 }, ca = {
  key: 1,
  class: "action-field"
}, ga = { class: "action-buttons" }, va = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (s, t) => (n(), l("form", {
      onSubmit: t[4] || (t[4] = ee((o) => s.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (n(), l(q, { key: 0 }, [
        b("label", ra, [
          t[6] || (t[6] = h("Task ", -1)),
          b("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: t[0] || (t[0] = (o) => s.$emit("update:task", o.target.value))
          }, [
            t[5] || (t[5] = b("option", { value: "" }, "Choose an open task", -1)),
            (n(!0), l(q, null, ne(e.tasks, (o) => (n(), l("option", {
              key: o.id,
              value: String(o.id)
            }, g(o.id) + ": " + g(o.title), 9, da))), 128))
          ], 40, ia)
        ]),
        e.moreTasks ? (n(), z(r(te), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: t[1] || (t[1] = (o) => s.$emit("more"))
        }, {
          default: f(() => [...t[7] || (t[7] = [
            h("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : m("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (n(), l("p", ua, "No open tasks.")) : m("", !0)
      ], 64)) : (n(), l("label", ca, [
        t[8] || (t[8] = h("Job", -1)),
        p(r(vt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (o) => s.$emit("update:text", o.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      b("div", ga, [
        p(r(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: f(() => [...t[9] || (t[9] = [
            h("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(r(te), {
          small: "",
          disabled: e.pending,
          onClick: t[3] || (t[3] = (o) => s.$emit("cancel"))
        }, {
          default: f(() => [...t[10] || (t[10] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ma = /* @__PURE__ */ J(va, [["__scopeId", "data-v-adde4158"]]), pa = { class: "action-buttons" }, ha = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (s, t) => (n(), l("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = ee((o) => s.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = b("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      p(r(Ne), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (o) => s.$emit("update:reason", o))
      }, null, 8, ["model-value", "disabled"]),
      b("div", pa, [
        p(r(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: f(() => [...t[3] || (t[3] = [
            h("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(r(te), {
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (o) => s.$emit("cancel"))
        }, {
          default: f(() => [...t[4] || (t[4] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, fa = /* @__PURE__ */ J(ha, [["__scopeId", "data-v-92de7dd6"]]), ba = {
  class: "session-history",
  "data-agent-session-history": ""
}, ka = { key: 0 }, ya = { key: 0 }, wa = { "data-agent-session-state": "" }, Ma = { class: "action-buttons" }, $a = {
  __name: "AgentSessionHistory",
  props: { sessions: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e) {
    return (s, t) => (n(), l("div", ba, [
      e.sessions.length ? m("", !0) : (n(), l("p", ka, "This agent has no session in its history.")),
      b("ol", null, [
        (n(!0), l(q, null, ne(e.sessions, (o) => (n(), l("li", {
          key: o.session,
          "data-agent-session": ""
        }, [
          b("span", null, g([o.program, o.model].filter(Boolean).join(" ")), 1),
          o.started_at ? (n(), l("span", ya, [
            t[1] || (t[1] = h("Started ", -1)),
            p(r(Ie), {
              at: o.started_at
            }, null, 8, ["at"])
          ])) : m("", !0),
          b("span", wa, g(o.end_reason ? `Ended: ${o.end_reason.replaceAll("_", " ")}` : o.started_at ? "Running" : "Not started"), 1),
          b("code", null, g(o.session), 1)
        ]))), 128))
      ]),
      b("div", Ma, [
        p(r(te), {
          small: "",
          onClick: t[0] || (t[0] = (o) => s.$emit("close"))
        }, {
          default: f(() => [...t[2] || (t[2] = [
            h("Close", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, xa = /* @__PURE__ */ J($a, [["__scopeId", "data-v-0d688bd9"]]), Sa = { class: "action-buttons" }, Ca = {
  key: 0,
  role: "alert"
}, Aa = {
  key: 1,
  role: "status"
}, ja = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const s = e, t = Oe(), o = V(""), i = V(""), a = V(""), k = V(""), S = V(""), R = V(""), C = V([]), W = V(0), D = V(!1), H = V(!1), E = V(!1), T = V(""), I = V(""), N = V([]), _ = c(() => !!s.row.retired_at || s.row.state === "retired"), P = c(() => !_.value && !!s.row.ended_at), Q = c(() => {
      var w;
      return P.value && ((w = s.row.job_command) == null ? void 0 : w.length) && !s.row.resume_reason;
    }), oe = c(() => Q.value && !H.value && (s.row.job_task_flag ? C.value.some((w) => String(w.id) === R.value) : !!i.value.trim()));
    function F(w) {
      o.value = w, i.value = "", a.value = "", R.value = "", T.value = "", I.value = "";
    }
    async function K() {
      F("job"), s.row.job_task_flag && (C.value = [], W.value = 0, D.value = !1, await $());
    }
    async function $() {
      if (!H.value) {
        H.value = !0;
        try {
          t.state["jobs.page"] = String(W.value + 1), await t.reload("jobs");
          const w = t.props.jobs;
          T.value = w.failure.value, T.value || (C.value = [...C.value, ...w.rows.value], W.value = w.data.value.page, D.value = w.more.value);
        } finally {
          H.value = !1;
        }
      }
    }
    async function v(w, x) {
      if (!E.value) {
        E.value = !0, T.value = "";
        try {
          const Y = await t.run(w);
          T.value = Y.ok ? "" : Y.error, Y.ok && (F(""), I.value = x);
        } finally {
          E.value = !1;
        }
      }
    }
    async function Z() {
      if (!oe.value) return;
      const w = s.row.job_task_flag ? [s.row.job_task_flag, R.value] : [i.value.trim()];
      await v([...s.row.job_command, String(s.row.number), ...w], "Job sent.");
    }
    async function y() {
      if (!E.value) {
        E.value = !0;
        try {
          const w = await t.run(["agent", "sessions", String(s.row.number)]);
          F(w.ok ? "history" : ""), T.value = w.ok ? "" : w.error, N.value = w.ok ? w.value.rows : [];
        } finally {
          E.value = !1;
        }
      }
    }
    function u() {
      F("driver"), k.value = s.row.program || "", S.value = "";
    }
    async function d() {
      !P.value || o.value !== "driver" || !k.value.trim() || !S.value.trim() || await v(["agent", "driver", String(s.row.number), "--program", k.value.trim(), "--model", S.value.trim()], "Driver changed.");
    }
    async function B() {
      !P.value || o.value !== "retire" || !a.value.trim() || await v(["agent", "retire", String(s.row.number), "--reason", a.value.trim()], "Agent retired permanently.");
    }
    return (w, x) => {
      var Y;
      return n(), l("div", {
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: x[10] || (x[10] = ee(() => {
        }, ["stop"])),
        onKeydown: x[11] || (x[11] = ee(() => {
        }, ["stop"]))
      }, [
        b("div", Sa, [
          p(r(te), {
            small: "",
            "data-agent-history": "",
            disabled: E.value || H.value,
            onClick: y
          }, {
            default: f(() => [...x[12] || (x[12] = [
              h("Session history", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          P.value ? (n(), l(q, { key: 0 }, [
            (Y = e.row.job_command) != null && Y.length ? (n(), z(r(te), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: E.value || H.value || !Q.value,
              onClick: K
            }, {
              default: f(() => [...x[13] || (x[13] = [
                h("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0),
            e.row.role !== "main" ? (n(), z(r(te), {
              key: 1,
              small: "",
              "data-agent-driver": "",
              disabled: E.value || H.value,
              onClick: u
            }, {
              default: f(() => [...x[14] || (x[14] = [
                h("Change driver", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0),
            e.row.role !== "main" ? (n(), z(r(te), {
              key: 2,
              small: "",
              "data-agent-retire": "",
              disabled: E.value || H.value,
              onClick: x[0] || (x[0] = (G) => F("retire"))
            }, {
              default: f(() => [...x[15] || (x[15] = [
                h("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0)
          ], 64)) : m("", !0)
        ]),
        p(r(Ke), { value: o.value }, {
          job: f(() => [
            p(ma, {
              task: R.value,
              "onUpdate:task": x[1] || (x[1] = (G) => R.value = G),
              text: i.value,
              "onUpdate:text": x[2] || (x[2] = (G) => i.value = G),
              row: e.row,
              tasks: C.value,
              pending: E.value,
              loading: H.value,
              "more-tasks": D.value,
              failure: T.value,
              "job-ready": oe.value,
              onSubmit: Z,
              onMore: $,
              onCancel: x[3] || (x[3] = (G) => F(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          driver: f(() => [
            p(la, {
              program: k.value,
              "onUpdate:program": x[4] || (x[4] = (G) => k.value = G),
              model: S.value,
              "onUpdate:model": x[5] || (x[5] = (G) => S.value = G),
              pending: E.value,
              onSubmit: d,
              onCancel: x[6] || (x[6] = (G) => F(""))
            }, null, 8, ["program", "model", "pending"])
          ]),
          history: f(() => [
            p(xa, {
              sessions: N.value,
              onClose: x[7] || (x[7] = (G) => F(""))
            }, null, 8, ["sessions"])
          ]),
          retire: f(() => [
            p(fa, {
              reason: a.value,
              "onUpdate:reason": x[8] || (x[8] = (G) => a.value = G),
              pending: E.value,
              onSubmit: B,
              onCancel: x[9] || (x[9] = (G) => F(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        T.value ? (n(), l("p", Ca, g(T.value), 1)) : m("", !0),
        I.value ? (n(), l("p", Aa, g(I.value), 1)) : m("", !0)
      ], 32);
    };
  }
}, Ta = /* @__PURE__ */ J(ja, [["__scopeId", "data-v-03a4a81a"]]), La = { class: "line" }, Ra = {
  key: 0,
  class: "line",
  "data-agent-since": ""
}, Ba = {
  key: 1,
  class: "line",
  "data-agent-seen": ""
}, Ia = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" }, seen: { type: String, default: "" } },
  setup(e) {
    const s = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, o = c(() => s.has(t.state)), i = c(() => [t.doing, t.since, t.seen].filter(Boolean).join(". "));
    return (a, k) => (n(), z(r(xe), {
      as: "button",
      place: "corner",
      class: de(["agent-dot", { pulse: o.value }]),
      "data-state": e.state,
      "aria-label": i.value,
      "data-agent-status": "",
      onClick: k[0] || (k[0] = ee(() => {
      }, ["stop"]))
    }, {
      tip: f(() => [
        b("b", La, g(e.doing), 1),
        e.since ? (n(), l("span", Ra, g(e.since), 1)) : m("", !0),
        e.seen ? (n(), l("span", Ba, g(e.seen), 1)) : m("", !0)
      ]),
      default: f(() => [
        k[1] || (k[1] = b("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, Oa = /* @__PURE__ */ J(Ia, [["__scopeId", "data-v-1a0bc478"]]), Va = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, za = (e) => e.filter((s) => s.state !== "cancelled"), Ue = (e, s) => e.filter((t) => t.state === s).length;
function Ha({ tasks: e, inHand: s, perHour: t }) {
  const o = za(e), i = Ue(o, "completed"), a = Va[s == null ? void 0 : s.state], k = o.filter((W) => W.state === "started").map((W) => ({ number: W.id, title: W.title })), S = Math.max(k.length, s && s.state !== "completed" ? 1 : 0), R = o.length - i - S, C = i === o.length;
  return {
    number: s.id,
    title: s.title,
    started: k,
    plan: s.plan_id ?? 0,
    count: `${i} of ${o.length}`,
    taskTip: `${i} of its ${o.length} tasks done${a ? `. This one is ${a.words}.` : "."}`,
    countTip: C ? `All ${o.length} tasks done` : `${i} done, ${S} in hand, ${R} to go`,
    paceTip: !C && t ? `About ${t} an hour.` : "",
    rate: !C && t ? `${Math.round(t)}/hour` : "",
    bar: { total: o.length, done: i, testing: Ue(o, "testing") }
  };
}
const Ea = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, Na = {
  key: 0,
  class: "plan",
  "data-agent-job-launch": ""
}, Wa = {
  class: "task-line",
  "data-agent-task-line": ""
}, Da = {
  key: 0,
  class: "tasks",
  "data-agent-tasks": ""
}, qa = {
  key: 2,
  class: "plan",
  "data-agent-plan": ""
}, Fa = {
  key: 3,
  class: "rate",
  "data-agent-rate": ""
}, Ua = { key: 0 }, Pa = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, jobTitle: { type: String, default: "" }, jobLaunch: { type: String, default: "" }, perHour: { type: Number, default: 0 } },
  setup(e) {
    const s = e, t = c(() => s.inHand ? Ha({ tasks: s.tasks, inHand: s.inHand, perHour: s.perHour }) : null);
    return (o, i) => e.job && !t.value ? (n(), l("span", Ea, [
      p(r(xe), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: f(() => [
          b("b", null, g(e.job), 1)
        ]),
        default: f(() => [
          h(g(e.jobTitle || "Job"), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (n(), l("span", Na, g(e.jobLaunch), 1)) : m("", !0)
    ])) : t.value ? (n(), l(q, { key: 1 }, [
      b("span", Wa, [
        t.value.started.length > 1 ? (n(), l("span", Da, [
          i[1] || (i[1] = h("Tasks ", -1)),
          (n(!0), l(q, null, ne(t.value.started, (a, k) => (n(), l(q, {
            key: a.number
          }, [
            k ? (n(), l(q, { key: 0 }, [
              h(", ")
            ], 64)) : m("", !0),
            p(r(xe), {
              as: "button",
              class: "task",
              "data-agent-task": "",
              "data-peek": `tasks:${a.number}`,
              "aria-label": `Task ${a.number}: ${a.title}`,
              onClick: ee((S) => r(ye)(`tasks:${a.number}`), ["stop"])
            }, {
              tip: f(() => [
                b("b", null, g(a.title), 1)
              ]),
              default: f(() => [
                h(g(a.number), 1)
              ]),
              _: 2
            }, 1032, ["data-peek", "aria-label", "onClick"])
          ], 64))), 128))
        ])) : (n(), z(r(xe), {
          key: 1,
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${t.value.number}`,
          "aria-label": `Task ${t.value.number}: ${t.value.title}`,
          onClick: i[0] || (i[0] = ee((a) => r(ye)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: f(() => [
            b("b", null, g(t.value.title), 1),
            b("span", null, g(t.value.taskTip), 1)
          ]),
          default: f(() => [
            h("Task " + g(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])),
        t.value.plan ? (n(), l("span", qa, "Plan " + g(t.value.plan), 1)) : m("", !0),
        t.value.rate ? (n(), l("span", Fa, g(t.value.rate), 1)) : m("", !0),
        p(r(xe), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: f(() => [
            b("b", null, g(t.value.countTip), 1),
            t.value.paceTip ? (n(), l("span", Ua, g(t.value.paceTip), 1)) : m("", !0)
          ]),
          default: f(() => [
            h(g(t.value.count), 1)
          ]),
          _: 1
        })
      ]),
      p(r(mt), {
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: t.value.bar.total,
        done: t.value.bar.done,
        testing: t.value.bar.testing
      }, null, 8, ["total", "done", "testing"])
    ], 64)) : m("", !0);
  }
}, Ga = /* @__PURE__ */ J(Pa, [["__scopeId", "data-v-e59affa8"]]), Ja = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Ka = ["data-icon", "stroke-width", "innerHTML"], ae = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const s = e, t = { right: 0, down: 90, left: 180, up: 270 }, o = {
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
    }, i = {
      agent: Ja,
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
    return (a, k) => (n(), l("svg", {
      class: "ico",
      "data-icon": e.name,
      style: Be({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...s.facing === "right" ? {} : { transform: `rotate(${t[s.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: i[o[e.name] || e.name] || i.dot
    }, null, 12, Ka));
  }
}, _a = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Za = {
  key: 1,
  class: "menu-item-text"
}, Ya = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (s, t) => (n(), l("button", {
      type: "button",
      class: de(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (n(), l("span", _a, g(e.checked ? "✓" : ""), 1)) : m("", !0),
      e.description ? (n(), l("span", Za, [
        b("span", null, [
          Ae(s.$slots, "default", {}, void 0, !0)
        ]),
        b("small", null, g(e.description), 1)
      ])) : Ae(s.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ke = /* @__PURE__ */ J(Ya, [["__scopeId", "data-v-fec99974"]]), Qa = {}, Xa = { class: "menu-label" };
function en(e, s) {
  return n(), l("span", Xa, [
    Ae(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Se = /* @__PURE__ */ J(Qa, [["render", en], ["__scopeId", "data-v-aa955b3e"]]), tn = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, an = {
  key: 0,
  class: "skills-none"
}, nn = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: s }) {
    const t = e, o = s, i = c(() => t.skills.filter((k) => k.state === "loaded")), a = c(() => t.skills.filter((k) => k.state !== "loaded"));
    return (k, S) => (n(), l("div", tn, [
      p(Se, null, {
        default: f(() => [...S[1] || (S[1] = [
          h("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      i.value.length ? m("", !0) : (n(), l("p", an, "None yet. Compacting the conversation empties this list.")),
      (n(!0), l(q, null, ne(i.value, (R) => (n(), l("p", {
        key: R.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        p(ae, {
          name: "book",
          size: 12
        }),
        h(g(R.skill), 1)
      ]))), 128)),
      a.value.length ? (n(), l(q, { key: 1 }, [
        p(Se, null, {
          default: f(() => [...S[2] || (S[2] = [
            h("Still to read", -1)
          ])]),
          _: 1
        }),
        (n(!0), l(q, null, ne(a.value, (R) => (n(), l("p", {
          key: R.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          p(ae, {
            name: "book",
            size: 12
          }),
          h(g(R.skill), 1)
        ]))), 128))
      ], 64)) : m("", !0),
      p(ke, {
        "data-agent-skills-browse": "",
        onClick: S[0] || (S[0] = (R) => o("browse"))
      }, {
        default: f(() => [...S[3] || (S[3] = [
          h("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, on = /* @__PURE__ */ J(nn, [["__scopeId", "data-v-be514d47"]]), sn = ["disabled", "title"], ln = { class: "gauge usage" }, rn = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: s }) {
    const t = e, o = s, i = c(() => t.windows[0] ?? null), a = c(() => i.value && Number.isFinite(i.value.used_percent) ? Math.max(0, Math.min(100, Math.round(i.value.used_percent))) : null), k = c(() => a.value !== null && a.value >= 100), S = c(() => {
      var C;
      return (C = i.value) != null && C.reset_epoch_seconds ? new Date(i.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), R = c(() => k.value ? `At usage limit: the plan's ${i.value.title} allowance is used up${S.value ? `, starts again ${S.value}` : ""}` : `${a.value}% of the plan's ${i.value.title} allowance used${S.value ? `, starts again ${S.value}` : ""}`);
    return (C, W) => a.value !== null ? (n(), l("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: R.value,
      onClick: W[0] || (W[0] = (D) => o("open", D.currentTarget))
    }, [
      p(ae, {
        name: "allowance",
        size: 12
      }),
      W[1] || (W[1] = h()),
      b("span", ln, [
        b("span", {
          style: Be({ width: `${a.value}%` })
        }, null, 4)
      ]),
      h(" " + g(k.value ? "At usage limit" : `${a.value}%`), 1)
    ], 8, sn)) : m("", !0);
  }
}, dn = /* @__PURE__ */ J(rn, [["__scopeId", "data-v-a36f09dc"]]), un = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (s, t) => (n(), l("span", {
      class: de(["badge", e.tone])
    }, g(e.text), 3));
  }
}, cn = /* @__PURE__ */ J(un, [["__scopeId", "data-v-9e7e1157"]]), gn = (e, s, t) => Math.max(s, Math.min(t, e)), Ze = /* @__PURE__ */ new WeakMap(), vn = (e, s) => Ze.set(e, s);
function mn(e, s) {
  for (let t = s; t; t = Ze.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function pn(e, s) {
  const t = (o) => {
    var a, k;
    const i = ((a = e.value) == null ? void 0 : a.element) || ((k = e.value) == null ? void 0 : k.$el) || e.value;
    i && !mn(i, o.target) && s(o);
  };
  window.addEventListener("click", t), Ce(() => window.removeEventListener("click", t));
}
const be = 8, hn = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: s, emit: t }) {
    const o = e, i = V(null), a = (d) => d ? `${d}px` : void 0, k = c(() => ({
      minWidth: a(o.minWidth),
      maxWidth: a(o.maxWidth),
      maxHeight: a(o.maxHeight),
      height: a(o.height)
    })), S = V({ w: 0, h: 0 }), R = V(o.anchor ? o.anchor.getBoundingClientRect() : null), C = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), W = (d) => ({
      left: Math.max(0, d.left),
      top: Math.max(0, d.top),
      right: Math.min(window.innerWidth, d.right),
      bottom: Math.min(window.innerHeight, d.bottom)
    }), D = (d) => {
      const B = d.closest(".pane, .float-window");
      return B ? W(B.getBoundingClientRect()) : C();
    }, H = (d, B) => `${Math.max(0, d ? Math.min(d, B) : B)}px`;
    function E(d, B) {
      return {
        below: d.bottom - B.bottom - o.gap - be,
        above: B.top - d.top - o.gap - be,
        across: d.right - d.left - 2 * be
      };
    }
    function T(d) {
      const B = D(o.anchor), w = E(B, d);
      return S.value.w <= w.across && S.value.h <= Math.max(w.below, w.above) ? B : C();
    }
    const I = c(() => {
      if (!R.value) return k.value;
      const d = R.value, B = T(d), w = E(B, d), { w: x, h: Y } = S.value, G = o.align === "auto" ? d.left + d.right > B.left + B.right : o.align === "right", we = gn(G ? d.right - x : d.left, B.left + be, Math.max(B.left + be, B.right - x - be)), X = Y > w.below && w.above > w.below ? { bottom: `${window.innerHeight - d.top + o.gap}px`, maxHeight: H(o.maxHeight, w.above) } : { top: `${d.bottom + o.gap}px`, maxHeight: H(o.maxHeight, w.below) };
      return { ...k.value, ...X, left: `${we}px`, maxWidth: H(o.maxWidth, w.across) };
    }), N = t, _ = () => [...i.value.querySelectorAll("button:not(:disabled)")];
    function P(d) {
      const B = _(), w = B.indexOf(document.activeElement);
      B[(w + d + B.length) % B.length].focus();
    }
    const Q = { ArrowDown: () => P(1), ArrowUp: () => P(-1), Escape: () => N("close") }, oe = (d) => Q[d.key] && (d.preventDefault(), Q[d.key]()), F = () => i.value && (S.value = { w: i.value.offsetWidth, h: i.value.scrollHeight });
    let K = 0;
    const $ = new ResizeObserver(() => {
      cancelAnimationFrame(K), K = requestAnimationFrame(F);
    });
    pn(i, (d) => o.anchor && !o.anchor.contains(d.target) && N("close"));
    const v = (d, B) => ["top", "left", "right", "bottom"].some((w) => Math.abs(d[w] - B[w]) > 1), Z = (d) => d.bottom < 0 || d.top > window.innerHeight;
    let y = 0;
    function u() {
      if (o.anchor) {
        const d = o.anchor.getBoundingClientRect();
        if (!o.anchor.isConnected || Z(d)) return N("close");
        v(d, R.value) && (R.value = d);
      }
      y = requestAnimationFrame(u);
    }
    return at(() => {
      o.anchor && i.value && vn(i.value, o.anchor), F(), i.value && $.observe(i.value), !o.plain && _()[0] && _()[0].focus(), u();
    }), Ce(() => {
      $.disconnect(), cancelAnimationFrame(y), cancelAnimationFrame(K);
    }), s({ element: i }), (d, B) => (n(), z(nt, {
      to: "body",
      disabled: !e.anchor
    }, [
      b("div", ot({
        ref_key: "panel",
        ref: i
      }, d.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: I.value,
        onKeydown: oe
      }), [
        Ae(d.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), fn = /* @__PURE__ */ J(hn, [["__scopeId", "data-v-3d203970"]]);
async function bn(e, s, t) {
  if (!e) return t(s);
  const { target: o, fields: i } = e, a = Object.fromEntries(Object.keys(i).map((R) => [R, o[R]])), k = () => Object.assign(o, a);
  Object.assign(o, i);
  let S = !1;
  try {
    const R = await t(s);
    return S = R.ok, R;
  } finally {
    S || k();
  }
}
function kn(e, s, t, { groups: o, programs: i }) {
  const a = V({}), k = V(""), S = V(!1), R = c(() => !!e.value && !e.value.ended_at), C = c(() => R.value && !!e.value.paused_at);
  async function W(T, I = null) {
    k.value = "";
    const N = await bn(I, T, s);
    return k.value = N.ok ? "" : N.error, t(), N;
  }
  return { groups: o, programs: i, chosen: a, failure: k, asking: S, running: R, paused: C, choose: (T, I) => W(["agent", "control", String(e.value.number), T, I.value], { target: a, fields: { value: { ...a.value, [T]: I.label } } }), stop: () => (S.value = !1, W(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (T) => W(["agent", "launch", T.name]) };
}
function yn(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const wn = { compact: "Compaction", clear: "Clear" };
function Mn(e) {
  return e != null && e.is_open ? `${wn[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
const $n = ["disabled", "title"], xn = ["disabled", "title"], Sn = { class: "gauge" }, Cn = {
  key: 1,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
}, An = ["disabled", "title"], jn = ["disabled"], Tn = ["disabled"], Ln = {
  key: 5,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Rn = ["title"], Bn = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, In = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, On = { class: "gauge" }, Vn = { class: "context-used" }, zn = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, Hn = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, En = 75, Nn = {
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
  setup(e, { emit: s }) {
    const t = e, o = s, i = kn(Ve(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => o("changed"), { groups: Ve(t, "controlGroups"), programs: Ve(t, "agentPrograms") }), a = V(null), k = V(""), S = c(() => i.groups.value.find(($) => $.key === k.value));
    function R($, v) {
      a.value = $.currentTarget, k.value = v;
    }
    function C() {
      a.value = null, k.value = "", i.asking.value = !1;
    }
    const W = c(() => t.skills.filter(($) => $.state === "loaded"));
    function D($) {
      R($, "skills"), o("skills");
    }
    const H = ($) => i.groups.value.some((v) => v.key === $), E = c(() => {
      var $;
      return i.chosen.value.model ?? (($ = I.value) == null ? void 0 : $.model) ?? "";
    }), T = c(() => {
      var $;
      return i.chosen.value.effort ?? (($ = I.value) == null ? void 0 : $.effort) ?? "";
    });
    c(() => !!t.agent && !t.agent.ended_at);
    const I = c(() => {
      var $;
      return (($ = t.usage.agents) == null ? void 0 : $.find((v) => {
        var Z;
        return v.id === ((Z = t.agent) == null ? void 0 : Z.id);
      })) ?? null;
    }), N = c(() => {
      var $;
      return (($ = I.value) == null ? void 0 : $.context_percent) == null ? null : Math.round(I.value.context_percent);
    }), _ = c(() => {
      var $;
      return Mn((($ = I.value) == null ? void 0 : $.context_change) ?? null);
    }), P = ($) => `${Math.round($ / 1e3)}k`, Q = c(() => {
      var $;
      return !!(($ = I.value) != null && $.context_limit_tokens);
    }), oe = c(() => {
      var $, v;
      return (($ = I.value) == null ? void 0 : $.context_limit_tokens) || ((v = I.value) == null ? void 0 : v.context_window_tokens) || 0;
    }), F = c(() => oe.value ? `${P(I.value.context_tokens ?? 0)} of ${P(oe.value)}` : ""), K = c(() => {
      var $;
      return ($ = I.value) != null && $.cost_dollars ? `$${I.value.cost_dollars.toFixed(2)}` : "";
    });
    return ($, v) => {
      var Z, y;
      return n(), l("div", {
        class: de(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (n(), l(q, { key: 0 }, [
          b("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: v[0] || (v[0] = (u) => R(u, "agent"))
          }, [
            p(ae, {
              name: "agents",
              size: 12
            }),
            h(" " + g(((Z = e.agentPrograms.find((u) => u.name === e.agent.program)) == null ? void 0 : Z.title) || e.agent.program), 1)
          ], 8, $n),
          p(dn, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: v[1] || (v[1] = (u) => o("open", "usage", u))
          }, null, 8, ["windows", "disabled"]),
          N.value !== null ? (n(), l("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${N.value}% full: clear or compact it`,
            onClick: v[2] || (v[2] = (u) => H("context") ? R(u, "context") : o("open", "context", u.currentTarget))
          }, [
            p(ae, {
              name: "gauge",
              size: 12
            }),
            v[14] || (v[14] = h()),
            b("span", Sn, [
              b("span", {
                style: Be({ width: `${N.value}%` })
              }, null, 4)
            ]),
            h(" " + g(N.value) + "% ", 1)
          ], 8, xn)) : (y = I.value) != null && y.context_unknown ? (n(), l("span", Cn, [
            p(ae, {
              name: "gauge",
              size: 12
            }),
            v[15] || (v[15] = h(" Context: unknown", -1))
          ])) : m("", !0),
          E.value ? (n(), l("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${E.value}: change the model`,
            onClick: v[3] || (v[3] = (u) => H("model") ? R(u, "model") : null)
          }, [
            p(ae, {
              name: "model",
              size: 12
            }),
            h(" " + g(E.value), 1)
          ], 8, An)) : m("", !0),
          H("effort") || e.card && T.value ? (n(), l("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: v[4] || (v[4] = (u) => R(u, "effort"))
          }, [
            p(ae, {
              name: "bolt",
              size: 12
            }),
            h(" " + g(T.value), 1)
          ], 8, jn)) : m("", !0),
          K.value ? (n(), l("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: v[5] || (v[5] = (u) => o("open", "cost", u.currentTarget))
          }, g(K.value), 9, Tn)) : m("", !0),
          e.branch ? (n(), l("span", Ln, [
            p(ae, {
              name: "branch",
              size: 12
            }),
            h(" " + g(e.branch), 1)
          ])) : m("", !0),
          e.card ? m("", !0) : (n(), l("button", {
            key: 6,
            type: "button",
            class: de(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: v[6] || (v[6] = (u) => o("open", "jobs", u.currentTarget))
          }, [
            p(ae, {
              name: "clock",
              size: 12
            }),
            h(" " + g(e.jobs), 1)
          ], 2)),
          e.run ? (n(), l("button", {
            key: 7,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: D
          }, [
            p(ae, {
              name: "book",
              size: 12
            }),
            h(" " + g(W.value.length), 1)
          ])) : m("", !0),
          e.fitness ? (n(), l(q, { key: 8 }, [
            b("button", {
              type: "button",
              class: de(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < En }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: v[7] || (v[7] = (u) => o("open", "fitness", u.currentTarget))
            }, [
              p(ae, {
                name: "heart",
                size: 12
              }),
              h(" " + g(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            b("button", {
              type: "button",
              class: de(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: v[8] || (v[8] = (u) => o("open", "load", u.currentTarget))
            }, [
              p(ae, {
                name: "weight",
                size: 12
              }),
              h(" " + g(e.fitness.workload), 1)
            ], 2)
          ], 64)) : m("", !0)
        ], 64)) : e.run && !e.loading ? (n(), l("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: v[9] || (v[9] = (u) => R(u, "start"))
        }, [
          p(ae, {
            name: "agents",
            size: 12
          }),
          v[16] || (v[16] = h(" Start an agent", -1))
        ])) : m("", !0),
        v[22] || (v[22] = b("span", { class: "space" }, null, -1)),
        r(i).failure.value ? (n(), l("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: r(i).failure.value
        }, g(r(i).failure.value), 9, Rn)) : m("", !0),
        Ae($.$slots, "default", {}, void 0, !0),
        a.value ? (n(), z(fn, {
          key: 3,
          anchor: a.value,
          "min-width": 190,
          onClose: C
        }, {
          default: f(() => {
            var u;
            return [
              k.value === "agent" ? (n(), l(q, { key: 0 }, [
                r(i).asking.value ? (n(), l(q, { key: 0 }, [
                  p(Se, { "data-agent-stop-ask": "" }, {
                    default: f(() => [...v[17] || (v[17] = [
                      h("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  p(ke, {
                    "data-agent-stop-confirm": "",
                    onClick: v[10] || (v[10] = (d) => (C(), r(i).stop()))
                  }, {
                    default: f(() => [...v[18] || (v[18] = [
                      h("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  p(ke, {
                    onClick: v[11] || (v[11] = (d) => r(i).asking.value = !1)
                  }, {
                    default: f(() => [...v[19] || (v[19] = [
                      h("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (n(), z(ke, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: v[12] || (v[12] = (d) => r(i).asking.value = !0)
                }, {
                  default: f(() => [...v[20] || (v[20] = [
                    h("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : k.value === "start" ? (n(), l(q, { key: 1 }, [
                p(Se, null, {
                  default: f(() => [...v[21] || (v[21] = [
                    h("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (n(!0), l(q, null, ne(r(i).programs.value, (d) => (n(), z(ke, {
                  key: d.name,
                  "data-agent-program": d.name,
                  onClick: (B) => (C(), r(i).start(d))
                }, {
                  default: f(() => [
                    h(g(d.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : k.value === "skills" ? (n(), z(on, {
                key: 2,
                skills: e.skills,
                onBrowse: v[13] || (v[13] = (d) => (C(), o("open", "skills", null)))
              }, null, 8, ["skills"])) : S.value ? (n(), l(q, { key: 3 }, [
                p(Se, null, {
                  default: f(() => [
                    h(g(S.value.label), 1)
                  ]),
                  _: 1
                }),
                k.value === "context" ? (n(), l(q, { key: 0 }, [
                  b("p", Bn, g(r(yn)(((u = I.value) == null ? void 0 : u.last_compaction) ?? null)), 1),
                  b("div", In, [
                    b("span", On, [
                      b("span", {
                        style: Be({ width: `${N.value}%` })
                      }, null, 4)
                    ]),
                    b("span", Vn, g(N.value) + "%", 1)
                  ]),
                  F.value ? (n(), l("p", zn, [
                    h(g(F.value) + " ", 1),
                    Q.value ? (n(), z(cn, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : m("", !0)
                  ])) : m("", !0)
                ], 64)) : m("", !0),
                k.value === "context" && _.value ? (n(), l("p", Hn, g(_.value), 1)) : (n(!0), l(q, { key: 2 }, ne(S.value.choices, (d) => (n(), z(ke, {
                  key: d.value,
                  "data-agent-choice": d.value,
                  onClick: (B) => (r(i).choose(S.value.key, d), C())
                }, {
                  default: f(() => [
                    h(g(d.label), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-choice", "onClick"]))), 128))
              ], 64)) : m("", !0)
            ];
          }),
          _: 1
        }, 8, ["anchor"])) : m("", !0)
      ], 2);
    };
  }
}, Wn = /* @__PURE__ */ J(Nn, [["__scopeId", "data-v-d7113347"]]), Dn = ["data-agent-open", "aria-expanded", "role", "tabindex"], qn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Fn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Un = {
  key: 2,
  class: "agent-head-actions",
  "data-agent-head-actions": ""
}, Pn = {
  key: 0,
  class: "agent-line"
}, Gn = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Jn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, Kn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, _n = {
  class: "agent-live-fact",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, Zn = {
  key: 1,
  class: "agent-live-fact",
  "data-agent-last-heard": ""
}, Yn = {
  key: 2,
  class: "agent-unit",
  "data-agent-unit": ""
}, Qn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: s }) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), o = { helper: "Helper", reviewer: "Reviewer", main: "Main agent" }, i = { running: "Working", starting: "Starting", stopping: "Stopping", ended: "Idle: its process has stopped", failed: "Could not start", never_started: "Not started" }, a = e, k = s, S = _e(), R = c(() => {
      var A, le;
      if ((A = a.facts) != null && A.profile_title) return a.facts.profile_title;
      if ((le = a.facts) != null && le.profile) return a.facts.profile;
      const M = o[a.row.role] || a.row.role;
      return M.slice(0, 1).toUpperCase() + M.slice(1);
    }), C = c(() => {
      var M;
      return ((M = a.facts) == null ? void 0 : M.tasks) ?? [];
    }), W = c(() => C.value.filter((M) => M.state === "open")), D = c(() => C.value.find((M) => {
      var A;
      return M.id === ((A = a.progress) == null ? void 0 : A.task_id) && M.state === "started";
    })), H = c(() => D.value || C.value.find((M) => {
      var A;
      return M.id === ((A = a.facts) == null ? void 0 : A.task_id);
    }) || C.value.find((M) => t.has(M.state)) || W.value[0] || C.value.at(-1)), E = c(() => {
      var M, A, le, se, ve, ue;
      return a.row.role === "helper" ? ((M = a.facts) == null ? void 0 : M.helper_job) || "" : (A = a.facts) != null && A.job_enabled && (((le = D.value) == null ? void 0 : le.title) || ((se = a.facts) == null ? void 0 : se.task_title) || ((ve = W.value[0]) == null ? void 0 : ve.title) || ((ue = C.value.at(-1)) == null ? void 0 : ue.title)) || "";
    }), T = c(() => `${a.row.role} ${a.row.number}`), I = c(() => {
      var M, A;
      return [a.row.program, (M = a.facts) == null ? void 0 : M.model, (A = a.facts) == null ? void 0 : A.effort, T.value].filter(Boolean).join(" · ");
    }), N = c(() => a.row.role === "main" ? R.value : `${R.value} ${a.row.number}`), _ = Oe(), P = c(() => pt(a.row.process_started_at || a.row.created_at, S.value)), Q = /* @__PURE__ */ new Set(["open", "started", "testing"]), oe = { fresh: "new conversation", resumed: "resumed" }, F = c(() => {
      var M, A;
      return [(M = a.facts) == null ? void 0 : M.helper_job_program, oe[(A = a.facts) == null ? void 0 : A.occupant_launch]].filter(Boolean).join(", ");
    }), K = c(() => {
      var M;
      return (M = a.facts) == null ? void 0 : M.work_status;
    }), $ = c(() => !!a.row.ended_at && a.row.role !== "main" && C.value.some((M) => Q.has(M.state))), v = c(() => {
      var M, A;
      return a.row.state === "running" && ((M = a.facts) == null ? void 0 : M.state) === "at usage limit" && !!((A = a.facts) != null && A.usage_limit_ends_at);
    }), Z = (M) => new Date(M).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), y = c(() => a.row.halted_at ? `Stopped at the usage limit since ${Z(a.row.halted_at)}, goes on at ${Z(a.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(a.facts.usage_limit_ends_at).toLocaleString()}`), u = c(() => {
      var M;
      return a.row.retired_at || a.row.state === "retired" ? "retired" : v.value || K.value || a.waitReason || $.value ? "waiting" : a.row.state === "running" && ((M = a.facts) == null ? void 0 : M.state) || a.row.state;
    }), d = c(() => {
      var M;
      return v.value ? y.value : K.value ? `Status: ${K.value}` : a.waitReason ? `Waiting: ${a.waitReason}` : u.value === "blocked" ? (M = a.facts) != null && M.blocked_reason ? `Blocked: ${a.facts.blocked_reason}` : "Blocked" : $.value ? "Stopped with work left" : "";
    }), B = c(() => {
      var M;
      return ((M = a.progress) == null ? void 0 : M.completed_count) ?? C.value.filter((A) => A.state === "completed").length;
    }), w = c(() => {
      var M;
      return ht(B.value, ((M = a.progress) == null ? void 0 : M.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, S.value);
    }), x = c(() => a.row.role === "main" ? 0 : w.value), Y = c(() => !!a.row.retired_at || a.row.state === "retired"), G = c(() => Y.value ? "Retired" : u.value === "blocked" || u.value === "waiting" ? d.value || (u.value === "blocked" ? "Blocked" : "Waiting") : i[a.row.standing]), we = c(() => {
      var A;
      if (Y.value) return a.row.retired_at;
      const M = u.value === "blocked" || u.value === "waiting";
      return a.row.ended_at || M && ((A = a.facts) == null ? void 0 : A.last_activity) || a.row.process_started_at || a.row.created_at;
    }), Me = c(() => ft(we.value, S.value)), X = c(() => {
      var M;
      return bt((M = a.facts) == null ? void 0 : M.last_activity, S.value);
    });
    return (M, A) => {
      var le, se, ve, ue, re, $e;
      return n(), l("div", {
        class: de(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: A[3] || (A[3] = (ce) => !e.open && k("toggle")),
        onKeydown: [
          A[4] || (A[4] = qe(ee((ce) => !e.open && k("toggle"), ["self", "prevent"]), ["enter"])),
          A[5] || (A[5] = qe(ee((ce) => !e.open && k("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        p(r(kt), {
          "agent-id": e.row.id,
          label: R.value,
          class: "agent-head"
        }, {
          default: f(() => {
            var ce, me;
            return [
              e.open ? (n(), l("button", {
                key: 0,
                type: "button",
                class: "agent-back",
                title: "Back",
                "aria-label": "Back",
                onClick: A[0] || (A[0] = ee((je) => k("toggle"), ["stop"]))
              }, [
                p(r(He), {
                  name: "chevronRight",
                  facing: "left",
                  size: 14
                })
              ])) : m("", !0),
              b("span", qn, g(e.open ? N.value : R.value), 1),
              b("span", Fn, g(((ce = e.facts) == null ? void 0 : ce.given_name) || e.row.id), 1),
              e.open ? m("", !0) : (n(), z(r(He), {
                key: 1,
                class: "agent-chevron",
                name: "chevronRight",
                size: 12
              })),
              e.open ? (n(), l("span", Un, [
                p(Ta, { row: e.row }, null, 8, ["row"]),
                p(r(te), {
                  variant: "ghost",
                  small: "",
                  "data-agent-inspector": "",
                  onClick: A[1] || (A[1] = ee((je) => r(ye)(`agents:${e.row.id}`), ["stop"]))
                }, {
                  default: f(() => [...A[6] || (A[6] = [
                    h("Open inspector", -1)
                  ])]),
                  _: 1
                }),
                e.row.role === "helper" && (!e.row.ended_at || (me = e.facts) != null && me.helper_job_open) ? (n(), z(r(te), {
                  key: 0,
                  variant: "ghost",
                  small: "",
                  "data-helper-stop": "",
                  onClick: A[2] || (A[2] = ee((je) => r(_).run(["helper", "stop", String(e.row.number)]), ["stop"]))
                }, {
                  default: f(() => [
                    h(g(e.row.ended_at ? "End job" : "Stop"), 1)
                  ]),
                  _: 1
                })) : m("", !0)
              ])) : m("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-id", "label"]),
        e.open ? m("", !0) : (n(), l("span", Pn, [
          b("span", Gn, g(I.value), 1),
          (le = e.facts) != null && le.sandbox_off ? (n(), l("span", Jn, "sandbox off")) : m("", !0)
        ])),
        e.open && !Y.value ? (n(), z(Wn, {
          key: 1,
          class: "agent-live",
          "agent-programs": r(_).props.programs.rows.value,
          agent: e.row,
          branch: (se = e.progress) == null ? void 0 : se.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((ve = e.facts) == null ? void 0 : ve.windows) ?? [] },
          card: ""
        }, {
          default: f(() => {
            var ce, me;
            return [
              (ce = e.facts) != null && ce.sandbox_off ? (n(), l("span", Kn, "sandbox off")) : m("", !0),
              b("span", _n, "Run time: " + g(P.value), 1),
              (me = e.facts) != null && me.last_activity ? (n(), l("span", Zn, [
                A[7] || (A[7] = h("Seen: ", -1)),
                p(r(Ie), {
                  at: e.facts.last_activity
                }, null, 8, ["at"])
              ])) : m("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : m("", !0),
        (ue = e.facts) != null && ue.unit_name ? (n(), l("div", Yn, "Unit: " + g(e.facts.unit_name), 1)) : m("", !0),
        e.open ? m("", !0) : (n(), z(Ga, {
          key: 3,
          tasks: C.value,
          "in-hand": e.row.role !== "helper" && ((re = e.facts) != null && re.job_enabled) && H.value || null,
          job: e.row.role === "helper" ? E.value : "",
          "job-title": e.row.role === "helper" && (($e = e.facts) == null ? void 0 : $e.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? F.value : "",
          "per-hour": x.value
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour"])),
        p(Oa, {
          state: u.value,
          doing: G.value,
          since: Me.value,
          seen: X.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (n(), z(na, {
          key: 4,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: C.value,
          "stopped-with-work": $.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : m("", !0)
      ], 42, Dn);
    };
  }
}, Xn = /* @__PURE__ */ J(Qn, [["__scopeId", "data-v-a635d82b"]]), eo = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, to = ["data-agent-row", "data-agent-lingering"], Pe = "journal.agents.filters", Ge = 300 * 1e3, Re = "cubic-bezier(0.2, 0.9, 0.25, 1)", ao = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const s = e, t = Oe(), { rows: o } = t.props.waits, { rows: i } = t.props.progress, { rows: a, failure: k, loaded: S, more: R } = t.props.agents, C = (L) => i.value.find((O) => O.agent_id === L.id) ?? null, W = (L) => {
      var O;
      return ((O = o.value.find((j) => j.agent_id === L.id)) == null ? void 0 : O.reason) ?? "";
    }, D = V("running"), H = V(""), E = JSON.parse(localStorage.getItem(Pe) || '{"roles":[],"profiles":[],"programs":[]}'), T = V(E), I = c(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: N } = t.props.programs, _ = c(() => T.value.roles.length + T.value.profiles.length + T.value.programs.length), P = (L, O) => {
      T.value = $t(T.value, L, O);
    }, Q = () => {
      T.value = { roles: [], profiles: [], programs: [] };
    }, oe = (L) => L.slice(0, 1).toUpperCase() + L.slice(1);
    ge(T, (L) => localStorage.setItem(Pe, JSON.stringify(L)));
    const F = V(25);
    function K() {
      Object.assign(t.state, {
        "agents.show": D.value,
        "agents.search": H.value,
        "agents.limit": String(F.value),
        "agents.roles": T.value.roles.join(","),
        "agents.profiles": T.value.profiles.join(","),
        "agents.programs": T.value.programs.join(",")
      });
    }
    async function $() {
      return F.value += 25, K(), await t.reload("agents"), !0;
    }
    ge([D, H, T], () => {
      F.value = 25, K(), t.reload("agents");
    }), K();
    const v = (L) => L.facts ?? null, Z = a, y = _e(), u = V([]), d = c(() => new Set(u.value.filter((L) => y.value - L.left < Ge).map((L) => L.row.id))), B = c(() => u.value.filter((L) => d.value.has(L.row.id)).map((L) => L.row)), w = c(() => [...Z.value, ...B.value]);
    let x = "", Y = [];
    async function G(L) {
      await t.reload(`card.${L.id}`);
      const O = t.props[`card.${L.id}`].rows.value.find((j) => j.id === L.id);
      O != null && O.ended_at && !u.value.some((j) => j.row.id === L.id) && (u.value = [...u.value, { row: O, left: Date.now() }]);
    }
    ge(a, (L) => {
      const O = x === `${D.value}|${H.value}|${JSON.stringify(T.value)}` && D.value === "running", j = O ? Y.filter((U) => !L.some((pe) => pe.id === U.id)) : [];
      x = `${D.value}|${H.value}|${JSON.stringify(T.value)}`, Y = L, u.value = O ? u.value.filter((U) => y.value - U.left < Ge && !L.some((pe) => pe.id === U.row.id)) : [], j.forEach(G);
    }, { immediate: !0 });
    const we = c(() => !!H.value.trim() || _.value > 0), Me = c(() => s.texts[D.value] ?? { title: s.empty, hint: "" }), X = V(null), M = V(null), A = V(null), le = V(null), se = c(() => X.value === null ? null : t.props[`card.${X.value}`].rows.value.find((L) => L.id === X.value) ?? M.value), ve = c(() => se.value ? [se.value] : w.value), ue = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, re = V(!1);
    let $e = 0;
    async function ce(L) {
      if (re.value) return;
      re.value = !0, $e = le.value.scrollTop;
      const O = A.value.querySelector(`[data-agent-open="${L.id}"]`);
      if (!ue()) {
        const he = [...A.value.querySelectorAll(".agent-row")].filter((ie) => !ie.contains(O));
        await Promise.all(he.map((ie) => ie.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const j = [...O.querySelectorAll(".agent-head, .agent-line")], U = [...j, ...O.querySelectorAll("[data-agent-motion]")], pe = U.map((he) => he.getBoundingClientRect());
      if (M.value = L, X.value = L.id, t.reload(`card.${L.id}`), await Fe(), !ue()) {
        const he = U.map((ie) => ie.getBoundingClientRect());
        U.forEach((ie, Te) => {
          const fe = j.findIndex((De) => De !== ie && De.contains(ie)), Ye = pe[Te].left - he[Te].left - (fe < 0 ? 0 : pe[fe].left - he[fe].left), Qe = pe[Te].top - he[Te].top - (fe < 0 ? 0 : pe[fe].top - he[fe].top);
          ie.animate([{ transform: `translate(${Ye}px, ${Qe}px)` }, { transform: "none" }], { duration: 280, easing: Re });
        }), A.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((ie) => {
          ie.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Re, fill: "backwards" });
        });
      }
      re.value = !1;
    }
    async function me() {
      if (re.value || !se.value) return;
      re.value = !0;
      const L = A.value.querySelector(`[data-agent-open="${X.value}"]`), O = [...L.children], j = ue() ? [] : O.map((U) => U.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(j.map((U) => U.finished)), X.value = null, await Fe(), le.value.scrollTop = $e, j.forEach((U) => U.cancel()), ue() || (L.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Re }), A.value.querySelectorAll(".agent-row").forEach((U) => {
        U.contains(L) || U.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Re });
      })), re.value = !1;
    }
    const je = (L) => X.value === L.id ? me() : ce(L);
    ge(H, (L) => L.trim() && (X.value = null)), ge(D, () => {
      X.value = null;
    });
    const We = (L) => {
      L.key === "Escape" && me();
    };
    return window.addEventListener("keydown", We), Ce(() => window.removeEventListener("keydown", We)), (L, O) => (n(), l("div", {
      ref_key: "agents",
      ref: A,
      class: de(["agents", { focused: se.value, "card-changing": re.value }])
    }, [
      se.value ? m("", !0) : (n(), z(r(yt), {
        key: 0,
        modelValue: H.value,
        "onUpdate:modelValue": O[1] || (O[1] = (j) => H.value = j),
        placeholder: "Search agents",
        "menu-count": _.value,
        "data-agents-search": ""
      }, {
        menu: f(() => [
          p(r(ze), null, {
            default: f(() => [...O[2] || (O[2] = [
              h("Type", -1)
            ])]),
            _: 1
          }),
          (n(!0), l(q, null, ne(I.value.roles, (j) => (n(), z(r(Le), {
            key: j,
            role: "menuitemcheckbox",
            "aria-checked": T.value.roles.includes(j),
            checked: T.value.roles.includes(j),
            "data-filter-role": j,
            onClick: (U) => P("roles", j)
          }, {
            default: f(() => [
              h(g(oe(j)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          I.value.profiles.length ? (n(), z(r(ze), { key: 0 }, {
            default: f(() => [...O[3] || (O[3] = [
              h("Profile", -1)
            ])]),
            _: 1
          })) : m("", !0),
          (n(!0), l(q, null, ne(I.value.profiles, (j) => (n(), z(r(Le), {
            key: j.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.profiles.includes(j.name),
            checked: T.value.profiles.includes(j.name),
            "data-filter-profile": j.name,
            onClick: (U) => P("profiles", j.name)
          }, {
            default: f(() => [
              h(g(j.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          p(r(ze), null, {
            default: f(() => [...O[4] || (O[4] = [
              h("Program", -1)
            ])]),
            _: 1
          }),
          (n(!0), l(q, null, ne(r(N), (j) => (n(), z(r(Le), {
            key: j.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.programs.includes(j.name),
            checked: T.value.programs.includes(j.name),
            "data-filter-program": j.name,
            onClick: (U) => P("programs", j.name)
          }, {
            default: f(() => [
              h(g(j.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          _.value ? (n(), z(r(Le), {
            key: 1,
            "data-filter-clear": "",
            onClick: Q
          }, {
            default: f(() => [...O[5] || (O[5] = [
              h("Clear filters", -1)
            ])]),
            _: 1
          })) : m("", !0)
        ]),
        default: f(() => [
          p(r(wt), {
            options: I.value.states,
            value: D.value,
            onPick: O[0] || (O[0] = (j) => D.value = j)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      D.value === "retired" && I.value.upgrade_retired ? (n(), l("p", eo, "Retired during the upgrade: " + g(I.value.upgrade_retired), 1)) : m("", !0),
      b("div", {
        ref_key: "list",
        ref: le,
        class: de(["agents-view", { "agents-view-open": se.value }])
      }, [
        r(S) && !r(k) && !ve.value.length && _.value ? (n(), z(r(Ee), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: f(() => [
            p(r(te), {
              small: "",
              "data-empty-clear": "",
              onClick: Q
            }, {
              default: f(() => [...O[6] || (O[6] = [
                h("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (n(), z(r(Mt), {
          key: 1,
          moves: "",
          "leaves-at-once": re.value,
          rows: ve.value,
          failure: r(k),
          loaded: r(S),
          more: !se.value && r(R),
          older: $,
          empty: Me.value.title,
          hint: Me.value.hint,
          searching: we.value
        }, {
          default: f(({ row: j }) => [
            b("div", {
              class: de(["agent-row", { lingering: d.value.has(j.id) && j.id !== X.value }]),
              "data-agent-row": j.id,
              "data-agent-lingering": d.value.has(j.id) ? "" : null
            }, [
              p(Xn, {
                row: j,
                facts: v(j),
                progress: C(j),
                "wait-reason": W(j),
                open: j.id === X.value,
                onToggle: (U) => je(j)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, to)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, lo = /* @__PURE__ */ J(ao, [["__scopeId", "data-v-fceb20c3"]]);
export {
  lo as A
};
