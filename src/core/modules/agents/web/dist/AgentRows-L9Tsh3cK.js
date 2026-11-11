import { openBlock as n, createElementBlock as l, withModifiers as ae, unref as r, createTextVNode as k, toDisplayString as u, createVNode as p, createBlock as E, computed as d, createElementVNode as h, createCommentVNode as m, withCtx as b, Fragment as F, renderList as se, ref as V, watch as ce, onUnmounted as Me, defineAsyncComponent as Xe, createSlots as et, resolveDynamicComponent as tt, normalizeClass as de, normalizeStyle as Te, renderSlot as $e, onMounted as at, Teleport as nt, mergeProps as ot, toRef as Re, withKeys as We, nextTick as De } from "vue";
import { peekRef as xe, Icon as Oe, RunningCommand as st, TimeAgo as Le, FoldGroup as Pe, TaskStatusIcon as lt, useWindow as Be, loadWindowComponent as rt, coalesced as it, READ_RATES as dt, eventMayBeChildOf as ut, InnerTabs as ct, TabBody as gt, SwitchCase as Je, EmptyState as Ve, TextInput as ze, Btn as ee, TextArea as vt, HoverTip as je, TaskBar as pt, useNow as Ge, age as mt, perHour as ht, sinceWords as ft, seenWords as bt, AgentTip as kt, SearchBar as yt, Segmented as wt, MenuLabel as Ie, MenuItem as Ce, RowList as Mt, toggleFilter as $t } from "@journal/window-kit";
import { _ as K, T as xt } from "./TranscriptRows-Crmxs6Un.js";
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
    return (o, t) => (n(), l("span", St, [
      e.waitReason ? (n(), l("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: t[0] || (t[0] = ae((s) => r(xe)("test_queue:0"), ["stop"]))
      }, [
        k("Waiting: " + u(e.waitReason) + " ", 1),
        p(r(Oe), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (n(), l("span", Ct, "Waiting")) : (n(), E(r(st), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, jt = /* @__PURE__ */ K(At, [["__scopeId", "data-v-1b371fb5"]]), Tt = {
  class: "lasting-facts",
  "data-agent-lasting-facts": ""
}, Lt = { key: 0 }, Bt = { "data-agent-driver-name": "" }, Rt = { "data-agent-session-count": "" }, It = { "data-agent-memory-count": "" }, Ot = { key: 1 }, Vt = { "data-agent-session-end-reason": "" }, zt = { key: 2 }, Ht = { "data-agent-retired-at": "" }, Et = { key: 3 }, Nt = { "data-agent-retired-by": "" }, Wt = {
  __name: "AgentLastingFacts",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const o = {
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
    }, t = e, s = d(() => t.row.program ? t.row.program.slice(0, 1).toUpperCase() + t.row.program.slice(1) : ""), a = d(() => [s.value, t.row.program_model].filter(Boolean).join(" ")), g = d(() => t.row.replaced_session_end_reason ? o[t.row.replaced_session_end_reason] || t.row.replaced_session_end_reason.replaceAll("_", " ") : "");
    return (M, f) => (n(), l("dl", Tt, [
      a.value ? (n(), l("div", Lt, [
        f[0] || (f[0] = h("dt", null, "Driver", -1)),
        h("dd", Bt, u(a.value), 1)
      ])) : m("", !0),
      h("div", null, [
        f[1] || (f[1] = h("dt", null, "Sessions", -1)),
        h("dd", Rt, u(e.row.session_count ?? 0), 1)
      ]),
      h("div", null, [
        f[2] || (f[2] = h("dt", null, "Memories", -1)),
        h("dd", It, u(e.row.memory_count ?? 0), 1)
      ]),
      g.value ? (n(), l("div", Ot, [
        f[3] || (f[3] = h("dt", null, "Last session ended", -1)),
        h("dd", Vt, u(g.value), 1)
      ])) : m("", !0),
      e.row.retired_at ? (n(), l("div", zt, [
        f[4] || (f[4] = h("dt", null, "Retired", -1)),
        h("dd", Ht, [
          p(r(Le), {
            at: e.row.retired_at
          }, null, 8, ["at"])
        ])
      ])) : m("", !0),
      e.row.retiring_actor_name ? (n(), l("div", Et, [
        f[5] || (f[5] = h("dt", null, "Retired by", -1)),
        h("dd", Nt, u(e.row.retiring_actor_name), 1)
      ])) : m("", !0)
    ]));
  }
}, Dt = /* @__PURE__ */ K(Wt, [["__scopeId", "data-v-774269a7"]]), qt = ["data-agent-delegated", "onClick"], Ft = { class: "agent-task-number" }, Ut = { class: "agent-task-title" }, Pt = ["title"], Jt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = o;
    return (s, a) => (n(), E(r(Pe), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: a[0] || (a[0] = (g) => t("toggle"))
    }, {
      default: b(() => [
        (n(!0), l(F, null, se(e.section.tasks, (g) => (n(), l("button", {
          key: g.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": g.id,
          onClick: (M) => r(xe)(`tasks:${g.id}`)
        }, [
          p(r(lt), {
            status: g.state
          }, null, 8, ["status"]),
          h("span", Ft, u(g.id), 1),
          h("span", Ut, u(g.title), 1),
          g.plan_id ? (n(), l("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${g.plan_id}: ${g.plan_title}`
          }, "Plan " + u(g.plan_id), 9, Pt)) : m("", !0)
        ], 8, qt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Gt = /* @__PURE__ */ K(Jt, [["__scopeId", "data-v-ea4ccd6b"]]), Kt = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Zt = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, _t = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, Yt = ["data-peek", "onClick"], Qt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Xt = {
  key: 0,
  class: "agent-helper-brief"
}, ea = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ta = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, aa = "It ended without a report", na = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const o = e, t = ["started", "blocked", "open", "completed"], s = d(() => {
      var i, w;
      return o.row.ended_at && ((w = (i = o.facts) == null ? void 0 : i.job_returned) != null && w.startsWith(aa)) ? o.facts.job_returned : "";
    }), a = d(() => o.tasks.length ? t.map((i) => ({ state: i, label: i.slice(0, 1).toUpperCase() + i.slice(1), tasks: o.tasks.filter((w) => w.state === i || i === "started" && w.state === "testing" || i === "completed" && w.state === "cancelled") })) : []), g = /* @__PURE__ */ new Set(["completed"]), M = V({}), f = (i) => !(M.value[i] ?? g.has(i)), A = (i) => M.value = { ...M.value, [i]: f(i) }, B = Be(), { rows: D } = B.props.reports;
    B.state["reports.agent"] = String(o.row.number);
    const W = d(() => o.row.access === "read-only"), z = d(() => !!o.row.retired_at || o.row.state === "retired"), H = ["tasks", "transcript", "terminal", "file-feed", "reports"], T = d(() => (z.value ? B.tabs.filter((w) => ["reports", "transcript"].includes(w.key)) : W.value ? B.tabs.filter((w) => ["reports", "transcript", "terminal"].includes(w.key)) : [...B.tabs]).sort((w, c) => (H.indexOf(w.key) < 0 ? H.length : H.indexOf(w.key)) - (H.indexOf(c.key) < 0 ? H.length : H.indexOf(c.key)))), R = () => W.value || z.value ? T.value.find((i) => i.key === "transcript") : T.value[0], N = V(R());
    ce(N, (i) => {
      B.state.tab = (i == null ? void 0 : i.key) ?? "";
    }, { immediate: !0 }), Me(() => {
      B.state.tab = "";
    }), ce(T, (i) => {
      i.some((w) => {
        var c;
        return w.key === ((c = N.value) == null ? void 0 : c.key);
      }) || (N.value = i[0]);
    }), ce(() => o.open, (i) => {
      i && (N.value = R());
    });
    const _ = Object.fromEntries(B.tabs.filter((i) => i.component).map((i) => [i.key, Xe(() => rt(i.component))])), J = V(!1), { data: Q } = B.props.tool, X = d(() => {
      var i;
      return ((i = Q.value) == null ? void 0 : i.tool) ?? "";
    }), q = d(() => {
      var i;
      return ((i = Q.value) == null ? void 0 : i.note) ?? "";
    }), Z = d(() => o.row.role !== "main" && (!o.row.ended_at || o.stoppedWithWork || o.waitReason));
    async function C() {
      !o.open || !Z.value || (B.state["tool.agent"] = String(o.row.number), await B.reload("tool"));
    }
    const v = it(C, dt.agentCommand), U = B.follow(["hook_call.*", "process_part.*"], (i) => ut(i, "session_agent_id", /* @__PURE__ */ new Set([o.row.id])) && v());
    return Me(() => U == null ? void 0 : U()), ce(() => o.open, (i) => {
      i && C();
    }, { immediate: !0 }), (i, w) => {
      var c;
      return n(), l("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: w[2] || (w[2] = ae(() => {
        }, ["stop"]))
      }, [
        p(Dt, { row: e.row }, null, 8, ["row"]),
        e.row.retirement_reason ? (n(), l("p", Kt, "Retirement reason: " + u(e.row.retirement_reason), 1)) : m("", !0),
        e.row.resume_reason ? (n(), l("p", Zt, u(e.row.resume_reason), 1)) : m("", !0),
        Z.value ? (n(), E(jt, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: X.value,
          note: q.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0),
        s.value ? (n(), l("p", _t, u(s.value), 1)) : m("", !0),
        p(r(ct), {
          class: "agent-tabs",
          tabs: T.value,
          active: N.value,
          answer: { tasks: e.tasks.length, reports: r(D).length },
          onChoose: w[0] || (w[0] = (I) => N.value = I)
        }, null, 8, ["tabs", "active", "answer"]),
        p(r(gt), {
          class: "agent-tab-body",
          tab: N.value,
          "data-agent-tab-body": (c = N.value) == null ? void 0 : c.key
        }, {
          default: b(() => {
            var I;
            return [
              p(r(Je), {
                value: (I = N.value) == null ? void 0 : I.key
              }, et({
                reports: b(() => [
                  r(D).length ? m("", !0) : (n(), E(r(Ve), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: b(() => [...w[3] || (w[3] = [
                      k("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (n(!0), l(F, null, se(r(D), ($) => (n(), l("button", {
                    key: $.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${$.id}`,
                    onClick: (S) => r(xe)(`messages:${$.id}`)
                  }, u($.text), 9, Yt))), 128))
                ]),
                tasks: b(() => {
                  var $;
                  return [
                    e.tasks.length ? m("", !0) : (n(), E(r(Ve), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: b(() => [...w[4] || (w[4] = [
                        k("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (n(!0), l(F, null, se(a.value, (S) => (n(), E(Gt, {
                      key: S.state,
                      section: S,
                      open: f(S.state),
                      onToggle: (te) => A(S.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    ($ = e.facts) != null && $.instruction ? (n(), l(F, { key: 1 }, [
                      w[5] || (w[5] = h("p", { class: "agent-label" }, "Instruction", -1)),
                      h("div", Qt, u(e.facts.instruction), 1)
                    ], 64)) : m("", !0)
                  ];
                }),
                transcript: b(() => {
                  var $;
                  return [
                    W.value ? (n(), l(F, { key: 0 }, [
                      ($ = e.facts) != null && $.instruction ? (n(), l("div", Xt, [
                        p(r(Pe), {
                          label: "Instruction",
                          open: J.value,
                          "data-agent-section": "instruction",
                          onToggle: w[1] || (w[1] = (S) => J.value = !J.value)
                        }, {
                          default: b(() => [
                            h("div", ea, u(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (n(), l("p", ta, "No job recorded")) : m("", !0)
                    ], 64)) : m("", !0),
                    p(xt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                se(r(_), ($, S) => ({
                  name: S,
                  fn: b(() => [
                    (n(), E(tt($), {
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
}, oa = /* @__PURE__ */ K(na, [["__scopeId", "data-v-6d8f6905"]]), sa = { class: "action-buttons" }, la = {
  __name: "AgentDriverForm",
  props: { program: String, model: String, pending: Boolean },
  emits: ["submit", "cancel", "update:program", "update:model"],
  setup(e) {
    return (o, t) => (n(), l("form", {
      "data-agent-driver-form": "",
      onSubmit: t[3] || (t[3] = ae((s) => o.$emit("submit"), ["prevent"]))
    }, [
      t[6] || (t[6] = h("p", null, "Starts the next session on this program; the agent keeps its number and memories.", -1)),
      p(r(ze), {
        "model-value": e.program,
        label: "Program",
        disabled: e.pending,
        "data-agent-driver-program": "",
        "onUpdate:modelValue": t[0] || (t[0] = (s) => o.$emit("update:program", s))
      }, null, 8, ["model-value", "disabled"]),
      p(r(ze), {
        "model-value": e.model,
        label: "Model",
        disabled: e.pending,
        "data-agent-driver-model": "",
        "onUpdate:modelValue": t[1] || (t[1] = (s) => o.$emit("update:model", s))
      }, null, 8, ["model-value", "disabled"]),
      h("div", sa, [
        p(r(ee), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.program.trim() || !e.model.trim(),
          "data-agent-confirm-driver": ""
        }, {
          default: b(() => [...t[4] || (t[4] = [
            k("Change the driver", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(r(ee), {
          small: "",
          disabled: e.pending,
          onClick: t[2] || (t[2] = (s) => o.$emit("cancel"))
        }, {
          default: b(() => [...t[5] || (t[5] = [
            k("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ra = /* @__PURE__ */ K(la, [["__scopeId", "data-v-c138a4da"]]), ia = { class: "action-field" }, da = ["value", "disabled"], ua = ["value"], ca = { key: 1 }, ga = {
  key: 1,
  class: "action-field"
}, va = { class: "action-buttons" }, pa = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (o, t) => (n(), l("form", {
      onSubmit: t[4] || (t[4] = ae((s) => o.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (n(), l(F, { key: 0 }, [
        h("label", ia, [
          t[6] || (t[6] = k("Task ", -1)),
          h("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: t[0] || (t[0] = (s) => o.$emit("update:task", s.target.value))
          }, [
            t[5] || (t[5] = h("option", { value: "" }, "Choose an open task", -1)),
            (n(!0), l(F, null, se(e.tasks, (s) => (n(), l("option", {
              key: s.id,
              value: String(s.id)
            }, u(s.id) + ": " + u(s.title), 9, ua))), 128))
          ], 40, da)
        ]),
        e.moreTasks ? (n(), E(r(ee), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: t[1] || (t[1] = (s) => o.$emit("more"))
        }, {
          default: b(() => [...t[7] || (t[7] = [
            k("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : m("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (n(), l("p", ca, "No open tasks.")) : m("", !0)
      ], 64)) : (n(), l("label", ga, [
        t[8] || (t[8] = k("Job", -1)),
        p(r(vt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (s) => o.$emit("update:text", s.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      h("div", va, [
        p(r(ee), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: b(() => [...t[9] || (t[9] = [
            k("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(r(ee), {
          small: "",
          disabled: e.pending,
          onClick: t[3] || (t[3] = (s) => o.$emit("cancel"))
        }, {
          default: b(() => [...t[10] || (t[10] = [
            k("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ma = /* @__PURE__ */ K(pa, [["__scopeId", "data-v-adde4158"]]), ha = { class: "action-buttons" }, fa = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (o, t) => (n(), l("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = ae((s) => o.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = h("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      p(r(ze), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (s) => o.$emit("update:reason", s))
      }, null, 8, ["model-value", "disabled"]),
      h("div", ha, [
        p(r(ee), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: b(() => [...t[3] || (t[3] = [
            k("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(r(ee), {
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (s) => o.$emit("cancel"))
        }, {
          default: b(() => [...t[4] || (t[4] = [
            k("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ba = /* @__PURE__ */ K(fa, [["__scopeId", "data-v-92de7dd6"]]), ka = {
  class: "session-history",
  "data-agent-session-history": ""
}, ya = { key: 0 }, wa = { key: 0 }, Ma = { "data-agent-session-state": "" }, $a = { class: "action-buttons" }, xa = {
  __name: "AgentSessionHistory",
  props: { sessions: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e) {
    return (o, t) => (n(), l("div", ka, [
      e.sessions.length ? m("", !0) : (n(), l("p", ya, "This agent has no session in its history.")),
      h("ol", null, [
        (n(!0), l(F, null, se(e.sessions, (s) => (n(), l("li", {
          key: s.session,
          "data-agent-session": ""
        }, [
          h("span", null, u([s.program, s.model].filter(Boolean).join(" ")), 1),
          s.started_at ? (n(), l("span", wa, [
            t[1] || (t[1] = k("Started ", -1)),
            p(r(Le), {
              at: s.started_at
            }, null, 8, ["at"])
          ])) : m("", !0),
          h("span", Ma, u(s.end_reason ? `Ended: ${s.end_reason.replaceAll("_", " ")}` : s.started_at ? "Running" : "Not started"), 1),
          h("code", null, u(s.session), 1)
        ]))), 128))
      ]),
      h("div", $a, [
        p(r(ee), {
          small: "",
          onClick: t[0] || (t[0] = (s) => o.$emit("close"))
        }, {
          default: b(() => [...t[2] || (t[2] = [
            k("Close", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Sa = /* @__PURE__ */ K(xa, [["__scopeId", "data-v-0d688bd9"]]), Ca = { class: "action-buttons" }, Aa = {
  key: 0,
  role: "alert"
}, ja = {
  key: 1,
  role: "status"
}, Ta = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const o = e, t = Be(), s = V(""), a = V(""), g = V(""), M = V(""), f = V(""), A = V(""), B = V([]), D = V(0), W = V(!1), z = V(!1), H = V(!1), T = V(""), R = V(""), N = V([]), _ = d(() => !!o.row.retired_at || o.row.state === "retired"), J = d(() => !_.value && !!o.row.ended_at), Q = d(() => {
      var $;
      return J.value && (($ = o.row.job_command) == null ? void 0 : $.length) && !o.row.resume_reason;
    }), X = d(() => Q.value && !z.value && (o.row.job_task_flag ? B.value.some(($) => String($.id) === A.value) : !!a.value.trim()));
    function q($) {
      s.value = $, a.value = "", g.value = "", A.value = "", T.value = "", R.value = "";
    }
    async function Z() {
      q("job"), o.row.job_task_flag && (B.value = [], D.value = 0, W.value = !1, await C());
    }
    async function C() {
      if (!z.value) {
        z.value = !0;
        try {
          t.state["jobs.page"] = String(D.value + 1), await t.reload("jobs");
          const $ = t.props.jobs;
          T.value = $.failure.value, T.value || (B.value = [...B.value, ...$.rows.value], D.value = $.data.value.page, W.value = $.more.value);
        } finally {
          z.value = !1;
        }
      }
    }
    async function v($, S) {
      if (!H.value) {
        H.value = !0, T.value = "";
        try {
          const te = await t.run($);
          T.value = te.ok ? "" : te.error, te.ok && (q(""), R.value = S);
        } finally {
          H.value = !1;
        }
      }
    }
    async function U() {
      if (!X.value) return;
      const $ = o.row.job_task_flag ? [o.row.job_task_flag, A.value] : [a.value.trim()];
      await v([...o.row.job_command, String(o.row.number), ...$], "Job sent.");
    }
    async function i() {
      if (!H.value) {
        H.value = !0;
        try {
          const $ = await t.run(["agent", "sessions", String(o.row.number)]);
          q($.ok ? "history" : ""), T.value = $.ok ? "" : $.error, N.value = $.ok ? $.value.rows : [];
        } finally {
          H.value = !1;
        }
      }
    }
    function w() {
      q("driver"), M.value = o.row.program || "", f.value = "";
    }
    async function c() {
      !J.value || s.value !== "driver" || !M.value.trim() || !f.value.trim() || await v(["agent", "driver", String(o.row.number), "--program", M.value.trim(), "--model", f.value.trim()], "Driver changed.");
    }
    async function I() {
      !J.value || s.value !== "retire" || !g.value.trim() || await v(["agent", "retire", String(o.row.number), "--reason", g.value.trim()], "Agent retired permanently.");
    }
    return ($, S) => {
      var te;
      return n(), l("div", {
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: S[10] || (S[10] = ae(() => {
        }, ["stop"])),
        onKeydown: S[11] || (S[11] = ae(() => {
        }, ["stop"]))
      }, [
        h("div", Ca, [
          p(r(ee), {
            small: "",
            "data-agent-history": "",
            disabled: H.value || z.value,
            onClick: i
          }, {
            default: b(() => [...S[12] || (S[12] = [
              k("Session history", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          J.value ? (n(), l(F, { key: 0 }, [
            (te = e.row.job_command) != null && te.length ? (n(), E(r(ee), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: H.value || z.value || !Q.value,
              onClick: Z
            }, {
              default: b(() => [...S[13] || (S[13] = [
                k("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0),
            e.row.role !== "main" ? (n(), E(r(ee), {
              key: 1,
              small: "",
              "data-agent-driver": "",
              disabled: H.value || z.value,
              onClick: w
            }, {
              default: b(() => [...S[14] || (S[14] = [
                k("Change driver", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0),
            e.row.role !== "main" ? (n(), E(r(ee), {
              key: 2,
              small: "",
              "data-agent-retire": "",
              disabled: H.value || z.value,
              onClick: S[0] || (S[0] = (G) => q("retire"))
            }, {
              default: b(() => [...S[15] || (S[15] = [
                k("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0)
          ], 64)) : m("", !0)
        ]),
        p(r(Je), { value: s.value }, {
          job: b(() => [
            p(ma, {
              task: A.value,
              "onUpdate:task": S[1] || (S[1] = (G) => A.value = G),
              text: a.value,
              "onUpdate:text": S[2] || (S[2] = (G) => a.value = G),
              row: e.row,
              tasks: B.value,
              pending: H.value,
              loading: z.value,
              "more-tasks": W.value,
              failure: T.value,
              "job-ready": X.value,
              onSubmit: U,
              onMore: C,
              onCancel: S[3] || (S[3] = (G) => q(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          driver: b(() => [
            p(ra, {
              program: M.value,
              "onUpdate:program": S[4] || (S[4] = (G) => M.value = G),
              model: f.value,
              "onUpdate:model": S[5] || (S[5] = (G) => f.value = G),
              pending: H.value,
              onSubmit: c,
              onCancel: S[6] || (S[6] = (G) => q(""))
            }, null, 8, ["program", "model", "pending"])
          ]),
          history: b(() => [
            p(Sa, {
              sessions: N.value,
              onClose: S[7] || (S[7] = (G) => q(""))
            }, null, 8, ["sessions"])
          ]),
          retire: b(() => [
            p(ba, {
              reason: g.value,
              "onUpdate:reason": S[8] || (S[8] = (G) => g.value = G),
              pending: H.value,
              onSubmit: I,
              onCancel: S[9] || (S[9] = (G) => q(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        T.value ? (n(), l("p", Aa, u(T.value), 1)) : m("", !0),
        R.value ? (n(), l("p", ja, u(R.value), 1)) : m("", !0)
      ], 32);
    };
  }
}, La = /* @__PURE__ */ K(Ta, [["__scopeId", "data-v-03a4a81a"]]), Ba = { class: "line" }, Ra = {
  key: 0,
  class: "line",
  "data-agent-since": ""
}, Ia = {
  key: 1,
  class: "line",
  "data-agent-seen": ""
}, Oa = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" }, seen: { type: String, default: "" } },
  setup(e) {
    const o = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, s = d(() => o.has(t.state)), a = d(() => [t.doing, t.since, t.seen].filter(Boolean).join(". "));
    return (g, M) => (n(), E(r(je), {
      as: "button",
      place: "corner",
      class: de(["agent-dot", { pulse: s.value }]),
      "data-state": e.state,
      "aria-label": a.value,
      "data-agent-status": "",
      onClick: M[0] || (M[0] = ae(() => {
      }, ["stop"]))
    }, {
      tip: b(() => [
        h("b", Ba, u(e.doing), 1),
        e.since ? (n(), l("span", Ra, u(e.since), 1)) : m("", !0),
        e.seen ? (n(), l("span", Ia, u(e.seen), 1)) : m("", !0)
      ]),
      default: b(() => [
        M[1] || (M[1] = h("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, Va = /* @__PURE__ */ K(Oa, [["__scopeId", "data-v-1a0bc478"]]), za = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, Ha = (e) => e.filter((o) => o.state !== "cancelled"), qe = (e, o) => e.filter((t) => t.state === o).length;
function Ea({ tasks: e, inHand: o, perHour: t }) {
  const s = Ha(e), a = qe(s, "completed"), g = za[o == null ? void 0 : o.state], M = s.length - a - (o && o.state !== "completed" ? 1 : 0), f = a === s.length;
  return {
    number: o.id,
    title: o.title,
    plan: o.plan_id ?? 0,
    count: `${a} of ${s.length}`,
    taskTip: `${a} of its ${s.length} tasks done${g ? `. This one is ${g.words}.` : "."}`,
    countTip: f ? `All ${s.length} tasks done` : `${a} done, 1 in hand, ${M} to go`,
    paceTip: !f && t ? `About ${t} an hour.` : "",
    rate: !f && t ? `${Math.round(t)}/hour` : "",
    bar: { total: s.length, done: a, testing: qe(s, "testing") }
  };
}
const Na = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, Wa = {
  key: 0,
  class: "plan",
  "data-agent-job-launch": ""
}, Da = {
  class: "task-line",
  "data-agent-task-line": ""
}, qa = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, Fa = {
  key: 1,
  class: "rate",
  "data-agent-rate": ""
}, Ua = { key: 0 }, Pa = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, jobTitle: { type: String, default: "" }, jobLaunch: { type: String, default: "" }, perHour: { type: Number, default: 0 } },
  setup(e) {
    const o = e, t = d(() => o.inHand ? Ea({ tasks: o.tasks, inHand: o.inHand, perHour: o.perHour }) : null);
    return (s, a) => e.job && !t.value ? (n(), l("span", Na, [
      p(r(je), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: b(() => [
          h("b", null, u(e.job), 1)
        ]),
        default: b(() => [
          k(u(e.jobTitle || "Job"), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (n(), l("span", Wa, u(e.jobLaunch), 1)) : m("", !0)
    ])) : t.value ? (n(), l(F, { key: 1 }, [
      h("span", Da, [
        p(r(je), {
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${t.value.number}`,
          "aria-label": `Task ${t.value.number}: ${t.value.title}`,
          onClick: a[0] || (a[0] = ae((g) => r(xe)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: b(() => [
            h("b", null, u(t.value.title), 1),
            h("span", null, u(t.value.taskTip), 1)
          ]),
          default: b(() => [
            k("Task " + u(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"]),
        t.value.plan ? (n(), l("span", qa, "Plan " + u(t.value.plan), 1)) : m("", !0),
        t.value.rate ? (n(), l("span", Fa, u(t.value.rate), 1)) : m("", !0),
        p(r(je), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: b(() => [
            h("b", null, u(t.value.countTip), 1),
            t.value.paceTip ? (n(), l("span", Ua, u(t.value.paceTip), 1)) : m("", !0)
          ]),
          default: b(() => [
            k(u(t.value.count), 1)
          ]),
          _: 1
        })
      ]),
      p(r(pt), {
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: t.value.bar.total,
        done: t.value.bar.done,
        testing: t.value.bar.testing
      }, null, 8, ["total", "done", "testing"])
    ], 64)) : m("", !0);
  }
}, Ja = /* @__PURE__ */ K(Pa, [["__scopeId", "data-v-d39df179"]]), Ga = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Ka = ["data-icon", "stroke-width", "innerHTML"], oe = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const o = e, t = { right: 0, down: 90, left: 180, up: 270 }, s = {
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
    }, a = {
      agent: Ga,
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
    return (g, M) => (n(), l("svg", {
      class: "ico",
      "data-icon": e.name,
      style: Te({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...o.facing === "right" ? {} : { transform: `rotate(${t[o.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: a[s[e.name] || e.name] || a.dot
    }, null, 12, Ka));
  }
}, Za = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, _a = {
  key: 1,
  class: "menu-item-text"
}, Ya = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (o, t) => (n(), l("button", {
      type: "button",
      class: de(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (n(), l("span", Za, u(e.checked ? "✓" : ""), 1)) : m("", !0),
      e.description ? (n(), l("span", _a, [
        h("span", null, [
          $e(o.$slots, "default", {}, void 0, !0)
        ]),
        h("small", null, u(e.description), 1)
      ])) : $e(o.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, fe = /* @__PURE__ */ K(Ya, [["__scopeId", "data-v-fec99974"]]), Qa = {}, Xa = { class: "menu-label" };
function en(e, o) {
  return n(), l("span", Xa, [
    $e(e.$slots, "default", {}, void 0, !0)
  ]);
}
const we = /* @__PURE__ */ K(Qa, [["render", en], ["__scopeId", "data-v-aa955b3e"]]), tn = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, an = {
  key: 0,
  class: "skills-none"
}, nn = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: o }) {
    const t = e, s = o, a = d(() => t.skills.filter((M) => M.state === "loaded")), g = d(() => t.skills.filter((M) => M.state !== "loaded"));
    return (M, f) => (n(), l("div", tn, [
      p(we, null, {
        default: b(() => [...f[1] || (f[1] = [
          k("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      a.value.length ? m("", !0) : (n(), l("p", an, "None yet. Compacting the conversation empties this list.")),
      (n(!0), l(F, null, se(a.value, (A) => (n(), l("p", {
        key: A.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        p(oe, {
          name: "book",
          size: 12
        }),
        k(u(A.skill), 1)
      ]))), 128)),
      g.value.length ? (n(), l(F, { key: 1 }, [
        p(we, null, {
          default: b(() => [...f[2] || (f[2] = [
            k("Still to read", -1)
          ])]),
          _: 1
        }),
        (n(!0), l(F, null, se(g.value, (A) => (n(), l("p", {
          key: A.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          p(oe, {
            name: "book",
            size: 12
          }),
          k(u(A.skill), 1)
        ]))), 128))
      ], 64)) : m("", !0),
      p(fe, {
        "data-agent-skills-browse": "",
        onClick: f[0] || (f[0] = (A) => s("browse"))
      }, {
        default: b(() => [...f[3] || (f[3] = [
          k("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, on = /* @__PURE__ */ K(nn, [["__scopeId", "data-v-be514d47"]]), sn = ["disabled", "title"], ln = { class: "gauge usage" }, rn = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: o }) {
    const t = e, s = o, a = d(() => t.windows[0] ?? null), g = d(() => a.value && Number.isFinite(a.value.used_percent) ? Math.max(0, Math.min(100, Math.round(a.value.used_percent))) : null), M = d(() => g.value !== null && g.value >= 100), f = d(() => {
      var B;
      return (B = a.value) != null && B.reset_epoch_seconds ? new Date(a.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), A = d(() => M.value ? `At usage limit: the plan's ${a.value.title} allowance is used up${f.value ? `, starts again ${f.value}` : ""}` : `${g.value}% of the plan's ${a.value.title} allowance used${f.value ? `, starts again ${f.value}` : ""}`);
    return (B, D) => g.value !== null ? (n(), l("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: A.value,
      onClick: D[0] || (D[0] = (W) => s("open", W.currentTarget))
    }, [
      p(oe, {
        name: "allowance",
        size: 12
      }),
      D[1] || (D[1] = k()),
      h("span", ln, [
        h("span", {
          style: Te({ width: `${g.value}%` })
        }, null, 4)
      ]),
      k(" " + u(M.value ? "At usage limit" : `${g.value}%`), 1)
    ], 8, sn)) : m("", !0);
  }
}, dn = /* @__PURE__ */ K(rn, [["__scopeId", "data-v-a36f09dc"]]), un = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (o, t) => (n(), l("span", {
      class: de(["badge", e.tone])
    }, u(e.text), 3));
  }
}, cn = /* @__PURE__ */ K(un, [["__scopeId", "data-v-9e7e1157"]]), gn = (e, o, t) => Math.max(o, Math.min(t, e)), Ke = /* @__PURE__ */ new WeakMap(), vn = (e, o) => Ke.set(e, o);
function pn(e, o) {
  for (let t = o; t; t = Ke.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function mn(e, o) {
  const t = (s) => {
    var g, M;
    const a = ((g = e.value) == null ? void 0 : g.element) || ((M = e.value) == null ? void 0 : M.$el) || e.value;
    a && !pn(a, s.target) && o(s);
  };
  window.addEventListener("click", t), Me(() => window.removeEventListener("click", t));
}
const he = 8, hn = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: o, emit: t }) {
    const s = e, a = V(null), g = (c) => c ? `${c}px` : void 0, M = d(() => ({
      minWidth: g(s.minWidth),
      maxWidth: g(s.maxWidth),
      maxHeight: g(s.maxHeight),
      height: g(s.height)
    })), f = V({ w: 0, h: 0 }), A = V(s.anchor ? s.anchor.getBoundingClientRect() : null), B = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), D = (c) => ({
      left: Math.max(0, c.left),
      top: Math.max(0, c.top),
      right: Math.min(window.innerWidth, c.right),
      bottom: Math.min(window.innerHeight, c.bottom)
    }), W = (c) => {
      const I = c.closest(".pane, .float-window");
      return I ? D(I.getBoundingClientRect()) : B();
    }, z = (c, I) => `${Math.max(0, c ? Math.min(c, I) : I)}px`;
    function H(c, I) {
      return {
        below: c.bottom - I.bottom - s.gap - he,
        above: I.top - c.top - s.gap - he,
        across: c.right - c.left - 2 * he
      };
    }
    function T(c) {
      const I = W(s.anchor), $ = H(I, c);
      return f.value.w <= $.across && f.value.h <= Math.max($.below, $.above) ? I : B();
    }
    const R = d(() => {
      if (!A.value) return M.value;
      const c = A.value, I = T(c), $ = H(I, c), { w: S, h: te } = f.value, G = s.align === "auto" ? c.left + c.right > I.left + I.right : s.align === "right", be = gn(G ? c.right - S : c.left, I.left + he, Math.max(I.left + he, I.right - S - he)), y = te > $.below && $.above > $.below ? { bottom: `${window.innerHeight - c.top + s.gap}px`, maxHeight: z(s.maxHeight, $.above) } : { top: `${c.bottom + s.gap}px`, maxHeight: z(s.maxHeight, $.below) };
      return { ...M.value, ...y, left: `${be}px`, maxWidth: z(s.maxWidth, $.across) };
    }), N = t, _ = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function J(c) {
      const I = _(), $ = I.indexOf(document.activeElement);
      I[($ + c + I.length) % I.length].focus();
    }
    const Q = { ArrowDown: () => J(1), ArrowUp: () => J(-1), Escape: () => N("close") }, X = (c) => Q[c.key] && (c.preventDefault(), Q[c.key]()), q = () => a.value && (f.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let Z = 0;
    const C = new ResizeObserver(() => {
      cancelAnimationFrame(Z), Z = requestAnimationFrame(q);
    });
    mn(a, (c) => s.anchor && !s.anchor.contains(c.target) && N("close"));
    const v = (c, I) => ["top", "left", "right", "bottom"].some(($) => Math.abs(c[$] - I[$]) > 1), U = (c) => c.bottom < 0 || c.top > window.innerHeight;
    let i = 0;
    function w() {
      if (s.anchor) {
        const c = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || U(c)) return N("close");
        v(c, A.value) && (A.value = c);
      }
      i = requestAnimationFrame(w);
    }
    return at(() => {
      s.anchor && a.value && vn(a.value, s.anchor), q(), a.value && C.observe(a.value), !s.plain && _()[0] && _()[0].focus(), w();
    }), Me(() => {
      C.disconnect(), cancelAnimationFrame(i), cancelAnimationFrame(Z);
    }), o({ element: a }), (c, I) => (n(), E(nt, {
      to: "body",
      disabled: !e.anchor
    }, [
      h("div", ot({
        ref_key: "panel",
        ref: a
      }, c.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: R.value,
        onKeydown: X
      }), [
        $e(c.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), fn = /* @__PURE__ */ K(hn, [["__scopeId", "data-v-3d203970"]]);
async function bn(e, o, t) {
  if (!e) return t(o);
  const { target: s, fields: a } = e, g = Object.fromEntries(Object.keys(a).map((A) => [A, s[A]])), M = () => Object.assign(s, g);
  Object.assign(s, a);
  let f = !1;
  try {
    const A = await t(o);
    return f = A.ok, A;
  } finally {
    f || M();
  }
}
function kn(e, o, t, { groups: s, programs: a }) {
  const g = V({}), M = V(""), f = V(!1), A = d(() => !!e.value && !e.value.ended_at), B = d(() => A.value && !!e.value.paused_at);
  async function D(T, R = null) {
    M.value = "";
    const N = await bn(R, T, o);
    return M.value = N.ok ? "" : N.error, t(), N;
  }
  return { groups: s, programs: a, chosen: g, failure: M, asking: f, running: A, paused: B, choose: (T, R) => D(["agent", "control", String(e.value.number), T, R.value], { target: g, fields: { value: { ...g.value, [T]: R.label } } }), stop: () => (f.value = !1, D(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (T) => D(["agent", "launch", T.name]) };
}
function yn(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const wn = { compact: "Compaction", clear: "Clear" };
function Mn(e) {
  return e != null && e.is_open ? `${wn[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
const $n = ["disabled", "title"], xn = ["disabled", "title"], Sn = { class: "gauge" }, Cn = ["disabled", "title"], An = ["disabled"], jn = ["disabled"], Tn = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Ln = ["title"], Bn = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Rn = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, In = { class: "gauge" }, On = { class: "context-used" }, Vn = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, zn = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, Hn = 75, En = {
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
    const t = e, s = o, a = kn(Re(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => s("changed"), { groups: Re(t, "controlGroups"), programs: Re(t, "agentPrograms") }), g = V(null), M = V(""), f = d(() => a.groups.value.find((C) => C.key === M.value));
    function A(C, v) {
      g.value = C.currentTarget, M.value = v;
    }
    function B() {
      g.value = null, M.value = "", a.asking.value = !1;
    }
    const D = d(() => t.skills.filter((C) => C.state === "loaded"));
    function W(C) {
      A(C, "skills"), s("skills");
    }
    const z = (C) => a.groups.value.some((v) => v.key === C), H = d(() => {
      var C;
      return a.chosen.value.model ?? ((C = R.value) == null ? void 0 : C.model) ?? "";
    }), T = d(() => {
      var C;
      return a.chosen.value.effort ?? ((C = R.value) == null ? void 0 : C.effort) ?? "";
    });
    d(() => !!t.agent && !t.agent.ended_at);
    const R = d(() => {
      var C;
      return ((C = t.usage.agents) == null ? void 0 : C.find((v) => {
        var U;
        return v.id === ((U = t.agent) == null ? void 0 : U.id);
      })) ?? null;
    }), N = d(() => {
      var C;
      return ((C = R.value) == null ? void 0 : C.context_percent) == null ? null : Math.round(R.value.context_percent);
    }), _ = d(() => {
      var C;
      return Mn(((C = R.value) == null ? void 0 : C.context_change) ?? null);
    }), J = (C) => `${Math.round(C / 1e3)}k`, Q = d(() => {
      var C;
      return !!((C = R.value) != null && C.context_limit_tokens);
    }), X = d(() => {
      var C, v;
      return ((C = R.value) == null ? void 0 : C.context_limit_tokens) || ((v = R.value) == null ? void 0 : v.context_window_tokens) || 0;
    }), q = d(() => X.value ? `${J(R.value.context_tokens ?? 0)} of ${J(X.value)}` : ""), Z = d(() => {
      var C;
      return (C = R.value) != null && C.cost_dollars ? `$${R.value.cost_dollars.toFixed(2)}` : "";
    });
    return (C, v) => {
      var U;
      return n(), l("div", {
        class: de(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (n(), l(F, { key: 0 }, [
          h("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: v[0] || (v[0] = (i) => A(i, "agent"))
          }, [
            p(oe, {
              name: "agents",
              size: 12
            }),
            k(" " + u(((U = e.agentPrograms.find((i) => i.name === e.agent.program)) == null ? void 0 : U.title) || e.agent.program), 1)
          ], 8, $n),
          p(dn, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: v[1] || (v[1] = (i) => s("open", "usage", i))
          }, null, 8, ["windows", "disabled"]),
          N.value !== null ? (n(), l("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${N.value}% full: clear or compact it`,
            onClick: v[2] || (v[2] = (i) => z("context") ? A(i, "context") : s("open", "context", i.currentTarget))
          }, [
            p(oe, {
              name: "gauge",
              size: 12
            }),
            v[14] || (v[14] = k()),
            h("span", Sn, [
              h("span", {
                style: Te({ width: `${N.value}%` })
              }, null, 4)
            ]),
            k(" " + u(N.value) + "% ", 1)
          ], 8, xn)) : m("", !0),
          H.value ? (n(), l("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${H.value}: change the model`,
            onClick: v[3] || (v[3] = (i) => z("model") ? A(i, "model") : null)
          }, [
            p(oe, {
              name: "model",
              size: 12
            }),
            k(" " + u(H.value), 1)
          ], 8, Cn)) : m("", !0),
          z("effort") || e.card && T.value ? (n(), l("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: v[4] || (v[4] = (i) => A(i, "effort"))
          }, [
            p(oe, {
              name: "bolt",
              size: 12
            }),
            k(" " + u(T.value), 1)
          ], 8, An)) : m("", !0),
          Z.value ? (n(), l("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: v[5] || (v[5] = (i) => s("open", "cost", i.currentTarget))
          }, u(Z.value), 9, jn)) : m("", !0),
          e.branch ? (n(), l("span", Tn, [
            p(oe, {
              name: "branch",
              size: 12
            }),
            k(" " + u(e.branch), 1)
          ])) : m("", !0),
          e.card ? m("", !0) : (n(), l("button", {
            key: 5,
            type: "button",
            class: de(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: v[6] || (v[6] = (i) => s("open", "jobs", i.currentTarget))
          }, [
            p(oe, {
              name: "clock",
              size: 12
            }),
            k(" " + u(e.jobs), 1)
          ], 2)),
          e.run ? (n(), l("button", {
            key: 6,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: W
          }, [
            p(oe, {
              name: "book",
              size: 12
            }),
            k(" " + u(D.value.length), 1)
          ])) : m("", !0),
          e.fitness ? (n(), l(F, { key: 7 }, [
            h("button", {
              type: "button",
              class: de(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Hn }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: v[7] || (v[7] = (i) => s("open", "fitness", i.currentTarget))
            }, [
              p(oe, {
                name: "heart",
                size: 12
              }),
              k(" " + u(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            h("button", {
              type: "button",
              class: de(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: v[8] || (v[8] = (i) => s("open", "load", i.currentTarget))
            }, [
              p(oe, {
                name: "weight",
                size: 12
              }),
              k(" " + u(e.fitness.workload), 1)
            ], 2)
          ], 64)) : m("", !0)
        ], 64)) : e.run && !e.loading ? (n(), l("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: v[9] || (v[9] = (i) => A(i, "start"))
        }, [
          p(oe, {
            name: "agents",
            size: 12
          }),
          v[15] || (v[15] = k(" Start an agent", -1))
        ])) : m("", !0),
        v[21] || (v[21] = h("span", { class: "space" }, null, -1)),
        r(a).failure.value ? (n(), l("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: r(a).failure.value
        }, u(r(a).failure.value), 9, Ln)) : m("", !0),
        $e(C.$slots, "default", {}, void 0, !0),
        g.value ? (n(), E(fn, {
          key: 3,
          anchor: g.value,
          "min-width": 190,
          onClose: B
        }, {
          default: b(() => {
            var i;
            return [
              M.value === "agent" ? (n(), l(F, { key: 0 }, [
                r(a).asking.value ? (n(), l(F, { key: 0 }, [
                  p(we, { "data-agent-stop-ask": "" }, {
                    default: b(() => [...v[16] || (v[16] = [
                      k("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  p(fe, {
                    "data-agent-stop-confirm": "",
                    onClick: v[10] || (v[10] = (w) => (B(), r(a).stop()))
                  }, {
                    default: b(() => [...v[17] || (v[17] = [
                      k("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  p(fe, {
                    onClick: v[11] || (v[11] = (w) => r(a).asking.value = !1)
                  }, {
                    default: b(() => [...v[18] || (v[18] = [
                      k("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (n(), E(fe, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: v[12] || (v[12] = (w) => r(a).asking.value = !0)
                }, {
                  default: b(() => [...v[19] || (v[19] = [
                    k("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : M.value === "start" ? (n(), l(F, { key: 1 }, [
                p(we, null, {
                  default: b(() => [...v[20] || (v[20] = [
                    k("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (n(!0), l(F, null, se(r(a).programs.value, (w) => (n(), E(fe, {
                  key: w.name,
                  "data-agent-program": w.name,
                  onClick: (c) => (B(), r(a).start(w))
                }, {
                  default: b(() => [
                    k(u(w.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : M.value === "skills" ? (n(), E(on, {
                key: 2,
                skills: e.skills,
                onBrowse: v[13] || (v[13] = (w) => (B(), s("open", "skills", null)))
              }, null, 8, ["skills"])) : f.value ? (n(), l(F, { key: 3 }, [
                p(we, null, {
                  default: b(() => [
                    k(u(f.value.label), 1)
                  ]),
                  _: 1
                }),
                M.value === "context" ? (n(), l(F, { key: 0 }, [
                  h("p", Bn, u(r(yn)(((i = R.value) == null ? void 0 : i.last_compaction) ?? null)), 1),
                  h("div", Rn, [
                    h("span", In, [
                      h("span", {
                        style: Te({ width: `${N.value}%` })
                      }, null, 4)
                    ]),
                    h("span", On, u(N.value) + "%", 1)
                  ]),
                  q.value ? (n(), l("p", Vn, [
                    k(u(q.value) + " ", 1),
                    Q.value ? (n(), E(cn, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : m("", !0)
                  ])) : m("", !0)
                ], 64)) : m("", !0),
                M.value === "context" && _.value ? (n(), l("p", zn, u(_.value), 1)) : (n(!0), l(F, { key: 2 }, se(f.value.choices, (w) => (n(), E(fe, {
                  key: w.value,
                  "data-agent-choice": w.value,
                  onClick: (c) => (r(a).choose(f.value.key, w), B())
                }, {
                  default: b(() => [
                    k(u(w.label), 1)
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
}, Nn = /* @__PURE__ */ K(En, [["__scopeId", "data-v-60d4a91e"]]), Wn = ["data-agent-open", "aria-expanded", "role", "tabindex"], Dn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, qn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Fn = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, Un = { class: "agent-line" }, Pn = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Jn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, Gn = {
  key: 1,
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, Kn = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Zn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), s = { helper: "Helper", reviewer: "Reviewer", main: "Main agent" }, a = e, g = o, M = Ge(), f = d(() => {
      var y, re;
      if ((y = a.facts) != null && y.profile_title) return a.facts.profile_title;
      if ((re = a.facts) != null && re.profile) return a.facts.profile;
      const x = s[a.row.role] || a.row.role;
      return x.slice(0, 1).toUpperCase() + x.slice(1);
    }), A = d(() => {
      var x;
      return ((x = a.facts) == null ? void 0 : x.tasks) ?? [];
    }), B = d(() => A.value.filter((x) => x.state === "open")), D = d(() => A.value.find((x) => {
      var y;
      return x.id === ((y = a.progress) == null ? void 0 : y.task_id) && x.state === "started";
    })), W = d(() => D.value || A.value.find((x) => {
      var y;
      return x.id === ((y = a.facts) == null ? void 0 : y.task_id);
    }) || A.value.find((x) => t.has(x.state)) || B.value[0] || A.value.at(-1)), z = d(() => {
      var x, y, re, le, ue, ne;
      return a.row.role === "helper" ? ((x = a.facts) == null ? void 0 : x.helper_job) || "" : (y = a.facts) != null && y.job_enabled && (((re = D.value) == null ? void 0 : re.title) || ((le = a.facts) == null ? void 0 : le.task_title) || ((ue = B.value[0]) == null ? void 0 : ue.title) || ((ne = A.value.at(-1)) == null ? void 0 : ne.title)) || "";
    }), H = d(() => `${a.row.role} ${a.row.number}`), T = d(() => {
      var x, y;
      return [a.row.program, (x = a.facts) == null ? void 0 : x.model, (y = a.facts) == null ? void 0 : y.effort, H.value].filter(Boolean).join(" · ");
    }), R = Be(), N = d(() => mt(a.row.process_started_at || a.row.created_at, M.value)), _ = /* @__PURE__ */ new Set(["open", "started", "testing"]), J = { fresh: "new conversation", resumed: "resumed" }, Q = d(() => {
      var x, y;
      return [(x = a.facts) == null ? void 0 : x.helper_job_program, J[(y = a.facts) == null ? void 0 : y.occupant_launch]].filter(Boolean).join(", ");
    }), X = d(() => {
      var x;
      return (x = a.facts) == null ? void 0 : x.work_status;
    }), q = d(() => !!a.row.ended_at && a.row.role !== "main" && A.value.some((x) => _.has(x.state))), Z = d(() => {
      var x, y;
      return a.row.state === "running" && ((x = a.facts) == null ? void 0 : x.state) === "at usage limit" && !!((y = a.facts) != null && y.usage_limit_ends_at);
    }), C = (x) => new Date(x).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), v = d(() => a.row.halted_at ? `Stopped at the usage limit since ${C(a.row.halted_at)}, goes on at ${C(a.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(a.facts.usage_limit_ends_at).toLocaleString()}`), U = d(() => {
      var x;
      return a.row.retired_at || a.row.state === "retired" ? "retired" : Z.value || X.value || a.waitReason || q.value ? "waiting" : a.row.state === "running" && ((x = a.facts) == null ? void 0 : x.state) || a.row.state;
    }), i = d(() => {
      var x;
      return Z.value ? v.value : X.value ? `Status: ${X.value}` : a.waitReason ? `Waiting: ${a.waitReason}` : U.value === "blocked" ? (x = a.facts) != null && x.blocked_reason ? `Blocked: ${a.facts.blocked_reason}` : "Blocked" : q.value ? "Stopped with work left" : "";
    }), w = d(() => {
      var x;
      return ((x = a.progress) == null ? void 0 : x.completed_count) ?? A.value.filter((y) => y.state === "completed").length;
    }), c = d(() => {
      var x;
      return ht(w.value, ((x = a.progress) == null ? void 0 : x.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, M.value);
    }), I = d(() => a.row.role === "main" ? 0 : c.value), $ = d(() => !!a.row.retired_at || a.row.state === "retired"), S = d(() => $.value ? "Retired" : U.value === "blocked" || U.value === "waiting" ? i.value || (U.value === "blocked" ? "Blocked" : "Waiting") : a.row.ended_at ? "Idle: its process has stopped" : "Working"), te = d(() => {
      var y;
      if ($.value) return a.row.retired_at;
      const x = U.value === "blocked" || U.value === "waiting";
      return a.row.ended_at || x && ((y = a.facts) == null ? void 0 : y.last_activity) || a.row.process_started_at || a.row.created_at;
    }), G = d(() => ft(te.value, M.value)), be = d(() => {
      var x;
      return bt((x = a.facts) == null ? void 0 : x.last_activity, M.value);
    });
    return (x, y) => {
      var re, le, ue, ne, ke, pe;
      return n(), l("div", {
        class: de(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: y[3] || (y[3] = (Y) => !e.open && g("toggle")),
        onKeydown: [
          y[4] || (y[4] = We(ae((Y) => !e.open && g("toggle"), ["self", "prevent"]), ["enter"])),
          y[5] || (y[5] = We(ae((Y) => !e.open && g("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        p(r(kt), {
          "agent-id": e.row.id,
          label: f.value,
          class: "agent-head"
        }, {
          default: b(() => {
            var Y;
            return [
              e.open ? (n(), l("button", {
                key: 0,
                type: "button",
                class: "agent-back",
                title: "Back",
                "aria-label": "Back",
                onClick: y[0] || (y[0] = ae((ye) => g("toggle"), ["stop"]))
              }, [
                p(r(Oe), {
                  name: "chevronRight",
                  facing: "left",
                  size: 14
                })
              ])) : m("", !0),
              h("span", Dn, u(f.value), 1),
              h("span", qn, u(((Y = e.facts) == null ? void 0 : Y.given_name) || e.row.id), 1),
              e.open ? m("", !0) : (n(), E(r(Oe), {
                key: 1,
                class: "agent-chevron",
                name: "chevronRight",
                size: 12
              })),
              e.open ? (n(), l("span", Fn, u(N.value), 1)) : m("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-id", "label"]),
        h("span", Un, [
          h("span", Pn, u(T.value), 1),
          (re = e.facts) != null && re.sandbox_off ? (n(), l("span", Jn, "sandbox off")) : m("", !0),
          e.open ? (n(), l("span", Gn, [
            y[6] || (y[6] = k("Started ", -1)),
            p(r(Le), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : m("", !0),
          e.open && ((le = e.facts) != null && le.last_activity) ? (n(), l("span", Kn, [
            y[7] || (y[7] = k("Seen ", -1)),
            p(r(Le), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : m("", !0)
        ]),
        e.open ? (n(), E(Nn, {
          key: 0,
          "agent-programs": r(R).props.programs.rows.value,
          agent: e.row,
          branch: (ue = e.progress) == null ? void 0 : ue.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((ne = e.facts) == null ? void 0 : ne.windows) ?? [] },
          card: ""
        }, {
          default: b(() => {
            var Y;
            return [
              p(La, { row: e.row }, null, 8, ["row"]),
              p(r(ee), {
                variant: "ghost",
                small: "",
                "data-agent-inspector": "",
                onClick: y[1] || (y[1] = ae((ye) => r(xe)(`agents:${e.row.id}`), ["stop"]))
              }, {
                default: b(() => [...y[8] || (y[8] = [
                  k("Open inspector", -1)
                ])]),
                _: 1
              }),
              e.row.role === "helper" && (!e.row.ended_at || (Y = e.facts) != null && Y.helper_job_open) ? (n(), E(r(ee), {
                key: 0,
                variant: "ghost",
                small: "",
                "data-helper-stop": "",
                onClick: y[2] || (y[2] = ae((ye) => r(R).run(["helper", "stop", String(e.row.number)]), ["stop"]))
              }, {
                default: b(() => [
                  k(u(e.row.ended_at ? "End job" : "Stop"), 1)
                ]),
                _: 1
              })) : m("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : m("", !0),
        e.open ? m("", !0) : (n(), E(Ja, {
          key: 1,
          tasks: A.value,
          "in-hand": e.row.role !== "helper" && ((ke = e.facts) != null && ke.job_enabled) && W.value || null,
          job: e.row.role === "helper" ? z.value : "",
          "job-title": e.row.role === "helper" && ((pe = e.facts) == null ? void 0 : pe.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? Q.value : "",
          "per-hour": I.value
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour"])),
        p(Va, {
          state: U.value,
          doing: S.value,
          since: G.value,
          seen: be.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (n(), E(oa, {
          key: 2,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: A.value,
          "stopped-with-work": q.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : m("", !0)
      ], 42, Wn);
    };
  }
}, _n = /* @__PURE__ */ K(Zn, [["__scopeId", "data-v-45e28131"]]), Yn = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Qn = ["data-agent-row", "data-agent-lingering"], Fe = "journal.agents.filters", Ue = 300 * 1e3, Ae = "cubic-bezier(0.2, 0.9, 0.25, 1)", Xn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const o = e, t = Be(), { rows: s } = t.props.waits, { rows: a } = t.props.progress, { rows: g, failure: M, loaded: f, more: A } = t.props.agents, B = (L) => a.value.find((O) => O.agent_id === L.id) ?? null, D = (L) => {
      var O;
      return ((O = s.value.find((j) => j.agent_id === L.id)) == null ? void 0 : O.reason) ?? "";
    }, W = V("running"), z = V(""), H = JSON.parse(localStorage.getItem(Fe) || '{"roles":[],"profiles":[],"programs":[]}'), T = V(H), R = d(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: N } = t.props.programs, _ = d(() => T.value.roles.length + T.value.profiles.length + T.value.programs.length), J = (L, O) => {
      T.value = $t(T.value, L, O);
    }, Q = () => {
      T.value = { roles: [], profiles: [], programs: [] };
    }, X = (L) => L.slice(0, 1).toUpperCase() + L.slice(1);
    ce(T, (L) => localStorage.setItem(Fe, JSON.stringify(L)));
    const q = V(25);
    function Z() {
      Object.assign(t.state, {
        "agents.show": W.value,
        "agents.search": z.value,
        "agents.limit": String(q.value),
        "agents.roles": T.value.roles.join(","),
        "agents.profiles": T.value.profiles.join(","),
        "agents.programs": T.value.programs.join(",")
      });
    }
    async function C() {
      return q.value += 25, Z(), await t.reload("agents"), !0;
    }
    ce([W, z, T], () => {
      q.value = 25, Z(), t.reload("agents");
    }), Z();
    const v = (L) => L.facts ?? null, U = g, i = Ge(), w = V([]), c = d(() => new Set(w.value.filter((L) => i.value - L.left < Ue).map((L) => L.row.id))), I = d(() => w.value.filter((L) => c.value.has(L.row.id)).map((L) => L.row)), $ = d(() => [...U.value, ...I.value]);
    let S = "", te = [];
    async function G(L) {
      await t.reload(`card.${L.id}`);
      const O = t.props[`card.${L.id}`].rows.value.find((j) => j.id === L.id);
      O != null && O.ended_at && !w.value.some((j) => j.row.id === L.id) && (w.value = [...w.value, { row: O, left: Date.now() }]);
    }
    ce(g, (L) => {
      const O = S === `${W.value}|${z.value}|${JSON.stringify(T.value)}` && W.value === "running", j = O ? te.filter((P) => !L.some((ge) => ge.id === P.id)) : [];
      S = `${W.value}|${z.value}|${JSON.stringify(T.value)}`, te = L, w.value = O ? w.value.filter((P) => i.value - P.left < Ue && !L.some((ge) => ge.id === P.row.id)) : [], j.forEach(G);
    }, { immediate: !0 });
    const be = d(() => !!z.value.trim() || _.value > 0), x = d(() => o.texts[W.value] ?? { title: o.empty, hint: "" }), y = V(null), re = V(null), le = V(null), ue = V(null), ne = d(() => y.value === null ? null : t.props[`card.${y.value}`].rows.value.find((L) => L.id === y.value) ?? re.value), ke = d(() => ne.value ? [ne.value] : $.value), pe = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, Y = V(!1);
    let ye = 0;
    async function Ze(L) {
      if (Y.value) return;
      Y.value = !0, ye = ue.value.scrollTop;
      const O = le.value.querySelector(`[data-agent-open="${L.id}"]`);
      if (!pe()) {
        const ve = [...le.value.querySelectorAll(".agent-row")].filter((ie) => !ie.contains(O));
        await Promise.all(ve.map((ie) => ie.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const j = [...O.querySelectorAll(".agent-head, .agent-line")], P = [...j, ...O.querySelectorAll("[data-agent-motion]")], ge = P.map((ve) => ve.getBoundingClientRect());
      if (re.value = L, y.value = L.id, t.reload(`card.${L.id}`), await De(), !pe()) {
        const ve = P.map((ie) => ie.getBoundingClientRect());
        P.forEach((ie, Se) => {
          const me = j.findIndex((Ne) => Ne !== ie && Ne.contains(ie)), Ye = ge[Se].left - ve[Se].left - (me < 0 ? 0 : ge[me].left - ve[me].left), Qe = ge[Se].top - ve[Se].top - (me < 0 ? 0 : ge[me].top - ve[me].top);
          ie.animate([{ transform: `translate(${Ye}px, ${Qe}px)` }, { transform: "none" }], { duration: 280, easing: Ae });
        }), le.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((ie) => {
          ie.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Ae, fill: "backwards" });
        });
      }
      Y.value = !1;
    }
    async function He() {
      if (Y.value || !ne.value) return;
      Y.value = !0;
      const L = le.value.querySelector(`[data-agent-open="${y.value}"]`), O = [...L.children], j = pe() ? [] : O.map((P) => P.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(j.map((P) => P.finished)), y.value = null, await De(), ue.value.scrollTop = ye, j.forEach((P) => P.cancel()), pe() || (L.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Ae }), le.value.querySelectorAll(".agent-row").forEach((P) => {
        P.contains(L) || P.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Ae });
      })), Y.value = !1;
    }
    const _e = (L) => y.value === L.id ? He() : Ze(L);
    ce(z, (L) => L.trim() && (y.value = null)), ce(W, () => {
      y.value = null;
    });
    const Ee = (L) => {
      L.key === "Escape" && He();
    };
    return window.addEventListener("keydown", Ee), Me(() => window.removeEventListener("keydown", Ee)), (L, O) => (n(), l("div", {
      ref_key: "agents",
      ref: le,
      class: de(["agents", { focused: ne.value, "card-changing": Y.value }])
    }, [
      ne.value ? m("", !0) : (n(), E(r(yt), {
        key: 0,
        modelValue: z.value,
        "onUpdate:modelValue": O[1] || (O[1] = (j) => z.value = j),
        placeholder: "Search agents",
        "menu-count": _.value,
        "data-agents-search": ""
      }, {
        menu: b(() => [
          p(r(Ie), null, {
            default: b(() => [...O[2] || (O[2] = [
              k("Type", -1)
            ])]),
            _: 1
          }),
          (n(!0), l(F, null, se(R.value.roles, (j) => (n(), E(r(Ce), {
            key: j,
            role: "menuitemcheckbox",
            "aria-checked": T.value.roles.includes(j),
            checked: T.value.roles.includes(j),
            "data-filter-role": j,
            onClick: (P) => J("roles", j)
          }, {
            default: b(() => [
              k(u(X(j)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          R.value.profiles.length ? (n(), E(r(Ie), { key: 0 }, {
            default: b(() => [...O[3] || (O[3] = [
              k("Profile", -1)
            ])]),
            _: 1
          })) : m("", !0),
          (n(!0), l(F, null, se(R.value.profiles, (j) => (n(), E(r(Ce), {
            key: j.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.profiles.includes(j.name),
            checked: T.value.profiles.includes(j.name),
            "data-filter-profile": j.name,
            onClick: (P) => J("profiles", j.name)
          }, {
            default: b(() => [
              k(u(j.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          p(r(Ie), null, {
            default: b(() => [...O[4] || (O[4] = [
              k("Program", -1)
            ])]),
            _: 1
          }),
          (n(!0), l(F, null, se(r(N), (j) => (n(), E(r(Ce), {
            key: j.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.programs.includes(j.name),
            checked: T.value.programs.includes(j.name),
            "data-filter-program": j.name,
            onClick: (P) => J("programs", j.name)
          }, {
            default: b(() => [
              k(u(j.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          _.value ? (n(), E(r(Ce), {
            key: 1,
            "data-filter-clear": "",
            onClick: Q
          }, {
            default: b(() => [...O[5] || (O[5] = [
              k("Clear filters", -1)
            ])]),
            _: 1
          })) : m("", !0)
        ]),
        default: b(() => [
          p(r(wt), {
            options: R.value.states,
            value: W.value,
            onPick: O[0] || (O[0] = (j) => W.value = j)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      W.value === "retired" && R.value.upgrade_retired ? (n(), l("p", Yn, "Retired during the upgrade: " + u(R.value.upgrade_retired), 1)) : m("", !0),
      h("div", {
        ref_key: "list",
        ref: ue,
        class: de(["agents-view", { "agents-view-open": ne.value }])
      }, [
        r(f) && !r(M) && !ke.value.length && _.value ? (n(), E(r(Ve), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: b(() => [
            p(r(ee), {
              small: "",
              "data-empty-clear": "",
              onClick: Q
            }, {
              default: b(() => [...O[6] || (O[6] = [
                k("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (n(), E(r(Mt), {
          key: 1,
          moves: "",
          "leaves-at-once": Y.value,
          rows: ke.value,
          failure: r(M),
          loaded: r(f),
          more: !ne.value && r(A),
          older: C,
          empty: x.value.title,
          hint: x.value.hint,
          searching: be.value
        }, {
          default: b(({ row: j }) => [
            h("div", {
              class: de(["agent-row", { lingering: c.value.has(j.id) && j.id !== y.value }]),
              "data-agent-row": j.id,
              "data-agent-lingering": c.value.has(j.id) ? "" : null
            }, [
              p(_n, {
                row: j,
                facts: v(j),
                progress: B(j),
                "wait-reason": D(j),
                open: j.id === y.value,
                onToggle: (P) => _e(j)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, Qn)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, no = /* @__PURE__ */ K(Xn, [["__scopeId", "data-v-fceb20c3"]]);
export {
  no as A
};
