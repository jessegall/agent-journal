import { openBlock as a, createElementBlock as l, withModifiers as X, unref as r, createTextVNode as f, toDisplayString as c, createVNode as p, createBlock as z, computed as u, createElementVNode as k, createCommentVNode as h, withCtx as y, Fragment as q, renderList as ne, ref as V, watch as ce, onUnmounted as xe, defineAsyncComponent as Xe, createSlots as et, resolveDynamicComponent as tt, normalizeClass as de, normalizeStyle as Le, renderSlot as Se, onMounted as at, Teleport as nt, mergeProps as ot, toRef as Ie, withKeys as De, nextTick as qe } from "vue";
import { peekRef as ke, Icon as Ve, RunningCommand as st, TimeAgo as Be, FoldGroup as Ge, TaskStatusIcon as lt, useWindow as Re, loadWindowComponent as rt, coalesced as it, READ_RATES as dt, eventMayBeChildOf as ut, InnerTabs as ct, TabBody as gt, SwitchCase as Je, EmptyState as ze, TextInput as He, Btn as ee, TextArea as vt, HoverTip as Me, TaskBar as pt, useNow as Ke, age as mt, perHour as ht, sinceWords as ft, seenWords as bt, AgentTip as kt, SearchBar as yt, Segmented as wt, MenuLabel as Oe, MenuItem as je, RowList as Mt, toggleFilter as $t } from "@journal/window-kit";
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
    return (o, t) => (a(), l("span", St, [
      e.waitReason ? (a(), l("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: t[0] || (t[0] = X((s) => r(ke)("test_queue:0"), ["stop"]))
      }, [
        f("Waiting: " + c(e.waitReason) + " ", 1),
        p(r(Ve), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), l("span", Ct, "Waiting")) : (a(), z(r(st), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, jt = /* @__PURE__ */ J(At, [["__scopeId", "data-v-1b371fb5"]]), Tt = {
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
    }, t = e, s = u(() => t.row.program ? t.row.program.slice(0, 1).toUpperCase() + t.row.program.slice(1) : ""), i = u(() => [s.value, t.row.program_model].filter(Boolean).join(" ")), n = u(() => t.row.replaced_session_end_reason ? o[t.row.replaced_session_end_reason] || t.row.replaced_session_end_reason.replaceAll("_", " ") : "");
    return (M, b) => (a(), l("dl", Tt, [
      i.value ? (a(), l("div", Lt, [
        b[0] || (b[0] = k("dt", null, "Driver", -1)),
        k("dd", Bt, c(i.value), 1)
      ])) : h("", !0),
      k("div", null, [
        b[1] || (b[1] = k("dt", null, "Sessions", -1)),
        k("dd", Rt, c(e.row.session_count ?? 0), 1)
      ]),
      k("div", null, [
        b[2] || (b[2] = k("dt", null, "Memories", -1)),
        k("dd", It, c(e.row.memory_count ?? 0), 1)
      ]),
      n.value ? (a(), l("div", Ot, [
        b[3] || (b[3] = k("dt", null, "Last session ended", -1)),
        k("dd", Vt, c(n.value), 1)
      ])) : h("", !0),
      e.row.retired_at ? (a(), l("div", zt, [
        b[4] || (b[4] = k("dt", null, "Retired", -1)),
        k("dd", Ht, [
          p(r(Be), {
            at: e.row.retired_at
          }, null, 8, ["at"])
        ])
      ])) : h("", !0),
      e.row.retiring_actor_name ? (a(), l("div", Et, [
        b[5] || (b[5] = k("dt", null, "Retired by", -1)),
        k("dd", Nt, c(e.row.retiring_actor_name), 1)
      ])) : h("", !0)
    ]));
  }
}, Dt = /* @__PURE__ */ J(Wt, [["__scopeId", "data-v-774269a7"]]), qt = ["data-agent-delegated", "onClick"], Ft = { class: "agent-task-number" }, Ut = { class: "agent-task-title" }, Pt = ["title"], Gt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = o;
    return (s, i) => (a(), z(r(Ge), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: i[0] || (i[0] = (n) => t("toggle"))
    }, {
      default: y(() => [
        (a(!0), l(q, null, ne(e.section.tasks, (n) => (a(), l("button", {
          key: n.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": n.id,
          onClick: (M) => r(ke)(`tasks:${n.id}`)
        }, [
          p(r(lt), {
            status: n.state
          }, null, 8, ["status"]),
          k("span", Ft, c(n.id), 1),
          k("span", Ut, c(n.title), 1),
          n.plan_id ? (a(), l("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${n.plan_id}: ${n.plan_title}`
          }, "Plan " + c(n.plan_id), 9, Pt)) : h("", !0)
        ], 8, qt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Jt = /* @__PURE__ */ J(Gt, [["__scopeId", "data-v-ea4ccd6b"]]), Kt = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, _t = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Zt = {
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
    const o = e, t = ["started", "blocked", "open", "completed"], s = u(() => {
      var w, g;
      return o.row.ended_at && ((g = (w = o.facts) == null ? void 0 : w.job_returned) != null && g.startsWith(aa)) ? o.facts.job_returned : "";
    }), i = u(() => o.tasks.length ? t.map((w) => ({ state: w, label: w.slice(0, 1).toUpperCase() + w.slice(1), tasks: o.tasks.filter((g) => g.state === w || w === "started" && g.state === "testing" || w === "completed" && g.state === "cancelled") })) : []), n = /* @__PURE__ */ new Set(["completed"]), M = V({}), b = (w) => !(M.value[w] ?? n.has(w)), B = (w) => M.value = { ...M.value, [w]: b(w) }, C = Re(), { rows: W } = C.props.reports;
    C.state["reports.agent"] = String(o.row.number);
    const D = u(() => o.row.access === "read-only"), H = u(() => !!o.row.retired_at || o.row.state === "retired"), E = ["tasks", "transcript", "terminal", "file-feed", "reports"], j = u(() => (H.value ? C.tabs.filter((g) => ["reports", "transcript"].includes(g.key)) : D.value ? C.tabs.filter((g) => ["reports", "transcript", "terminal"].includes(g.key)) : [...C.tabs]).sort((g, d) => (E.indexOf(g.key) < 0 ? E.length : E.indexOf(g.key)) - (E.indexOf(d.key) < 0 ? E.length : E.indexOf(d.key)))), I = () => D.value || H.value ? j.value.find((w) => w.key === "transcript") : j.value[0], N = V(I());
    ce(N, (w) => {
      C.state.tab = (w == null ? void 0 : w.key) ?? "";
    }, { immediate: !0 }), xe(() => {
      C.state.tab = "";
    }), ce(j, (w) => {
      w.some((g) => {
        var d;
        return g.key === ((d = N.value) == null ? void 0 : d.key);
      }) || (N.value = w[0]);
    }), ce(() => o.open, (w) => {
      w && (N.value = I());
    });
    const _ = Object.fromEntries(C.tabs.filter((w) => w.component).map((w) => [w.key, Xe(() => rt(w.component))])), P = V(!1), { data: Y } = C.props.tool, oe = u(() => {
      var w;
      return ((w = Y.value) == null ? void 0 : w.tool) ?? "";
    }), F = u(() => {
      var w;
      return ((w = Y.value) == null ? void 0 : w.note) ?? "";
    }), K = u(() => o.row.role !== "main" && (!o.row.ended_at || o.stoppedWithWork || o.waitReason));
    async function S() {
      !o.open || !K.value || (C.state["tool.agent"] = String(o.row.number), await C.reload("tool"));
    }
    const v = it(S, dt.agentCommand), Z = C.follow(["hook_call.*", "process_part.*"], (w) => ut(w, "session_agent_id", /* @__PURE__ */ new Set([o.row.id])) && v());
    return xe(() => Z == null ? void 0 : Z()), ce(() => o.open, (w) => {
      w && S();
    }, { immediate: !0 }), (w, g) => {
      var d;
      return a(), l("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: g[2] || (g[2] = X(() => {
        }, ["stop"]))
      }, [
        p(Dt, { row: e.row }, null, 8, ["row"]),
        e.row.retirement_reason ? (a(), l("p", Kt, "Retirement reason: " + c(e.row.retirement_reason), 1)) : h("", !0),
        e.row.resume_reason ? (a(), l("p", _t, c(e.row.resume_reason), 1)) : h("", !0),
        K.value ? (a(), z(jt, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: oe.value,
          note: F.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : h("", !0),
        s.value ? (a(), l("p", Zt, c(s.value), 1)) : h("", !0),
        p(r(ct), {
          class: "agent-tabs",
          tabs: j.value,
          active: N.value,
          answer: { tasks: e.tasks.length, reports: r(W).length },
          onChoose: g[0] || (g[0] = (R) => N.value = R)
        }, null, 8, ["tabs", "active", "answer"]),
        p(r(gt), {
          class: "agent-tab-body",
          tab: N.value,
          "data-agent-tab-body": (d = N.value) == null ? void 0 : d.key
        }, {
          default: y(() => {
            var R;
            return [
              p(r(Je), {
                value: (R = N.value) == null ? void 0 : R.key
              }, et({
                reports: y(() => [
                  r(W).length ? h("", !0) : (a(), z(r(ze), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: y(() => [...g[3] || (g[3] = [
                      f("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (a(!0), l(q, null, ne(r(W), ($) => (a(), l("button", {
                    key: $.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${$.id}`,
                    onClick: (x) => r(ke)(`messages:${$.id}`)
                  }, c($.text), 9, Yt))), 128))
                ]),
                tasks: y(() => {
                  var $;
                  return [
                    e.tasks.length ? h("", !0) : (a(), z(r(ze), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: y(() => [...g[4] || (g[4] = [
                        f("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (a(!0), l(q, null, ne(i.value, (x) => (a(), z(Jt, {
                      key: x.state,
                      section: x,
                      open: b(x.state),
                      onToggle: (te) => B(x.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    ($ = e.facts) != null && $.instruction ? (a(), l(q, { key: 1 }, [
                      g[5] || (g[5] = k("p", { class: "agent-label" }, "Instruction", -1)),
                      k("div", Qt, c(e.facts.instruction), 1)
                    ], 64)) : h("", !0)
                  ];
                }),
                transcript: y(() => {
                  var $;
                  return [
                    D.value ? (a(), l(q, { key: 0 }, [
                      ($ = e.facts) != null && $.instruction ? (a(), l("div", Xt, [
                        p(r(Ge), {
                          label: "Instruction",
                          open: P.value,
                          "data-agent-section": "instruction",
                          onToggle: g[1] || (g[1] = (x) => P.value = !P.value)
                        }, {
                          default: y(() => [
                            k("div", ea, c(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (a(), l("p", ta, "No job recorded")) : h("", !0)
                    ], 64)) : h("", !0),
                    p(xt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                ne(r(_), ($, x) => ({
                  name: x,
                  fn: y(() => [
                    (a(), z(tt($), {
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
}, oa = /* @__PURE__ */ J(na, [["__scopeId", "data-v-6d8f6905"]]), sa = { class: "action-buttons" }, la = {
  __name: "AgentDriverForm",
  props: { program: String, model: String, pending: Boolean },
  emits: ["submit", "cancel", "update:program", "update:model"],
  setup(e) {
    return (o, t) => (a(), l("form", {
      "data-agent-driver-form": "",
      onSubmit: t[3] || (t[3] = X((s) => o.$emit("submit"), ["prevent"]))
    }, [
      t[6] || (t[6] = k("p", null, "Starts the next session on this program; the agent keeps its number and memories.", -1)),
      p(r(He), {
        "model-value": e.program,
        label: "Program",
        disabled: e.pending,
        "data-agent-driver-program": "",
        "onUpdate:modelValue": t[0] || (t[0] = (s) => o.$emit("update:program", s))
      }, null, 8, ["model-value", "disabled"]),
      p(r(He), {
        "model-value": e.model,
        label: "Model",
        disabled: e.pending,
        "data-agent-driver-model": "",
        "onUpdate:modelValue": t[1] || (t[1] = (s) => o.$emit("update:model", s))
      }, null, 8, ["model-value", "disabled"]),
      k("div", sa, [
        p(r(ee), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.program.trim() || !e.model.trim(),
          "data-agent-confirm-driver": ""
        }, {
          default: y(() => [...t[4] || (t[4] = [
            f("Change the driver", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(r(ee), {
          small: "",
          disabled: e.pending,
          onClick: t[2] || (t[2] = (s) => o.$emit("cancel"))
        }, {
          default: y(() => [...t[5] || (t[5] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ra = /* @__PURE__ */ J(la, [["__scopeId", "data-v-c138a4da"]]), ia = { class: "action-field" }, da = ["value", "disabled"], ua = ["value"], ca = { key: 1 }, ga = {
  key: 1,
  class: "action-field"
}, va = { class: "action-buttons" }, pa = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (o, t) => (a(), l("form", {
      onSubmit: t[4] || (t[4] = X((s) => o.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (a(), l(q, { key: 0 }, [
        k("label", ia, [
          t[6] || (t[6] = f("Task ", -1)),
          k("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: t[0] || (t[0] = (s) => o.$emit("update:task", s.target.value))
          }, [
            t[5] || (t[5] = k("option", { value: "" }, "Choose an open task", -1)),
            (a(!0), l(q, null, ne(e.tasks, (s) => (a(), l("option", {
              key: s.id,
              value: String(s.id)
            }, c(s.id) + ": " + c(s.title), 9, ua))), 128))
          ], 40, da)
        ]),
        e.moreTasks ? (a(), z(r(ee), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: t[1] || (t[1] = (s) => o.$emit("more"))
        }, {
          default: y(() => [...t[7] || (t[7] = [
            f("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : h("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (a(), l("p", ca, "No open tasks.")) : h("", !0)
      ], 64)) : (a(), l("label", ga, [
        t[8] || (t[8] = f("Job", -1)),
        p(r(vt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (s) => o.$emit("update:text", s.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      k("div", va, [
        p(r(ee), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: y(() => [...t[9] || (t[9] = [
            f("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(r(ee), {
          small: "",
          disabled: e.pending,
          onClick: t[3] || (t[3] = (s) => o.$emit("cancel"))
        }, {
          default: y(() => [...t[10] || (t[10] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ma = /* @__PURE__ */ J(pa, [["__scopeId", "data-v-adde4158"]]), ha = { class: "action-buttons" }, fa = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (o, t) => (a(), l("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = X((s) => o.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = k("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      p(r(He), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (s) => o.$emit("update:reason", s))
      }, null, 8, ["model-value", "disabled"]),
      k("div", ha, [
        p(r(ee), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: y(() => [...t[3] || (t[3] = [
            f("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(r(ee), {
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (s) => o.$emit("cancel"))
        }, {
          default: y(() => [...t[4] || (t[4] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ba = /* @__PURE__ */ J(fa, [["__scopeId", "data-v-92de7dd6"]]), ka = {
  class: "session-history",
  "data-agent-session-history": ""
}, ya = { key: 0 }, wa = { key: 0 }, Ma = { "data-agent-session-state": "" }, $a = { class: "action-buttons" }, xa = {
  __name: "AgentSessionHistory",
  props: { sessions: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e) {
    return (o, t) => (a(), l("div", ka, [
      e.sessions.length ? h("", !0) : (a(), l("p", ya, "This agent has no session in its history.")),
      k("ol", null, [
        (a(!0), l(q, null, ne(e.sessions, (s) => (a(), l("li", {
          key: s.session,
          "data-agent-session": ""
        }, [
          k("span", null, c([s.program, s.model].filter(Boolean).join(" ")), 1),
          s.started_at ? (a(), l("span", wa, [
            t[1] || (t[1] = f("Started ", -1)),
            p(r(Be), {
              at: s.started_at
            }, null, 8, ["at"])
          ])) : h("", !0),
          k("span", Ma, c(s.end_reason ? `Ended: ${s.end_reason.replaceAll("_", " ")}` : s.started_at ? "Running" : "Not started"), 1),
          k("code", null, c(s.session), 1)
        ]))), 128))
      ]),
      k("div", $a, [
        p(r(ee), {
          small: "",
          onClick: t[0] || (t[0] = (s) => o.$emit("close"))
        }, {
          default: y(() => [...t[2] || (t[2] = [
            f("Close", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Sa = /* @__PURE__ */ J(xa, [["__scopeId", "data-v-0d688bd9"]]), Ca = { class: "action-buttons" }, Aa = {
  key: 0,
  role: "alert"
}, ja = {
  key: 1,
  role: "status"
}, Ta = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const o = e, t = Re(), s = V(""), i = V(""), n = V(""), M = V(""), b = V(""), B = V(""), C = V([]), W = V(0), D = V(!1), H = V(!1), E = V(!1), j = V(""), I = V(""), N = V([]), _ = u(() => !!o.row.retired_at || o.row.state === "retired"), P = u(() => !_.value && !!o.row.ended_at), Y = u(() => {
      var $;
      return P.value && (($ = o.row.job_command) == null ? void 0 : $.length) && !o.row.resume_reason;
    }), oe = u(() => Y.value && !H.value && (o.row.job_task_flag ? C.value.some(($) => String($.id) === B.value) : !!i.value.trim()));
    function F($) {
      s.value = $, i.value = "", n.value = "", B.value = "", j.value = "", I.value = "";
    }
    async function K() {
      F("job"), o.row.job_task_flag && (C.value = [], W.value = 0, D.value = !1, await S());
    }
    async function S() {
      if (!H.value) {
        H.value = !0;
        try {
          t.state["jobs.page"] = String(W.value + 1), await t.reload("jobs");
          const $ = t.props.jobs;
          j.value = $.failure.value, j.value || (C.value = [...C.value, ...$.rows.value], W.value = $.data.value.page, D.value = $.more.value);
        } finally {
          H.value = !1;
        }
      }
    }
    async function v($, x) {
      if (!E.value) {
        E.value = !0, j.value = "";
        try {
          const te = await t.run($);
          j.value = te.ok ? "" : te.error, te.ok && (F(""), I.value = x);
        } finally {
          E.value = !1;
        }
      }
    }
    async function Z() {
      if (!oe.value) return;
      const $ = o.row.job_task_flag ? [o.row.job_task_flag, B.value] : [i.value.trim()];
      await v([...o.row.job_command, String(o.row.number), ...$], "Job sent.");
    }
    async function w() {
      if (!E.value) {
        E.value = !0;
        try {
          const $ = await t.run(["agent", "sessions", String(o.row.number)]);
          F($.ok ? "history" : ""), j.value = $.ok ? "" : $.error, N.value = $.ok ? $.value.rows : [];
        } finally {
          E.value = !1;
        }
      }
    }
    function g() {
      F("driver"), M.value = o.row.program || "", b.value = "";
    }
    async function d() {
      !P.value || s.value !== "driver" || !M.value.trim() || !b.value.trim() || await v(["agent", "driver", String(o.row.number), "--program", M.value.trim(), "--model", b.value.trim()], "Driver changed.");
    }
    async function R() {
      !P.value || s.value !== "retire" || !n.value.trim() || await v(["agent", "retire", String(o.row.number), "--reason", n.value.trim()], "Agent retired permanently.");
    }
    return ($, x) => {
      var te;
      return a(), l("div", {
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: x[10] || (x[10] = X(() => {
        }, ["stop"])),
        onKeydown: x[11] || (x[11] = X(() => {
        }, ["stop"]))
      }, [
        k("div", Ca, [
          p(r(ee), {
            small: "",
            "data-agent-history": "",
            disabled: E.value || H.value,
            onClick: w
          }, {
            default: y(() => [...x[12] || (x[12] = [
              f("Session history", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          P.value ? (a(), l(q, { key: 0 }, [
            (te = e.row.job_command) != null && te.length ? (a(), z(r(ee), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: E.value || H.value || !Y.value,
              onClick: K
            }, {
              default: y(() => [...x[13] || (x[13] = [
                f("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0),
            e.row.role !== "main" ? (a(), z(r(ee), {
              key: 1,
              small: "",
              "data-agent-driver": "",
              disabled: E.value || H.value,
              onClick: g
            }, {
              default: y(() => [...x[14] || (x[14] = [
                f("Change driver", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0),
            e.row.role !== "main" ? (a(), z(r(ee), {
              key: 2,
              small: "",
              "data-agent-retire": "",
              disabled: E.value || H.value,
              onClick: x[0] || (x[0] = (G) => F("retire"))
            }, {
              default: y(() => [...x[15] || (x[15] = [
                f("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0)
          ], 64)) : h("", !0)
        ]),
        p(r(Je), { value: s.value }, {
          job: y(() => [
            p(ma, {
              task: B.value,
              "onUpdate:task": x[1] || (x[1] = (G) => B.value = G),
              text: i.value,
              "onUpdate:text": x[2] || (x[2] = (G) => i.value = G),
              row: e.row,
              tasks: C.value,
              pending: E.value,
              loading: H.value,
              "more-tasks": D.value,
              failure: j.value,
              "job-ready": oe.value,
              onSubmit: Z,
              onMore: S,
              onCancel: x[3] || (x[3] = (G) => F(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          driver: y(() => [
            p(ra, {
              program: M.value,
              "onUpdate:program": x[4] || (x[4] = (G) => M.value = G),
              model: b.value,
              "onUpdate:model": x[5] || (x[5] = (G) => b.value = G),
              pending: E.value,
              onSubmit: d,
              onCancel: x[6] || (x[6] = (G) => F(""))
            }, null, 8, ["program", "model", "pending"])
          ]),
          history: y(() => [
            p(Sa, {
              sessions: N.value,
              onClose: x[7] || (x[7] = (G) => F(""))
            }, null, 8, ["sessions"])
          ]),
          retire: y(() => [
            p(ba, {
              reason: n.value,
              "onUpdate:reason": x[8] || (x[8] = (G) => n.value = G),
              pending: E.value,
              onSubmit: R,
              onCancel: x[9] || (x[9] = (G) => F(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        j.value ? (a(), l("p", Aa, c(j.value), 1)) : h("", !0),
        I.value ? (a(), l("p", ja, c(I.value), 1)) : h("", !0)
      ], 32);
    };
  }
}, La = /* @__PURE__ */ J(Ta, [["__scopeId", "data-v-03a4a81a"]]), Ba = { class: "line" }, Ra = {
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
    const o = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, s = u(() => o.has(t.state)), i = u(() => [t.doing, t.since, t.seen].filter(Boolean).join(". "));
    return (n, M) => (a(), z(r(Me), {
      as: "button",
      place: "corner",
      class: de(["agent-dot", { pulse: s.value }]),
      "data-state": e.state,
      "aria-label": i.value,
      "data-agent-status": "",
      onClick: M[0] || (M[0] = X(() => {
      }, ["stop"]))
    }, {
      tip: y(() => [
        k("b", Ba, c(e.doing), 1),
        e.since ? (a(), l("span", Ra, c(e.since), 1)) : h("", !0),
        e.seen ? (a(), l("span", Ia, c(e.seen), 1)) : h("", !0)
      ]),
      default: y(() => [
        M[1] || (M[1] = k("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, Va = /* @__PURE__ */ J(Oa, [["__scopeId", "data-v-1a0bc478"]]), za = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, Ha = (e) => e.filter((o) => o.state !== "cancelled"), Fe = (e, o) => e.filter((t) => t.state === o).length;
function Ea({ tasks: e, inHand: o, perHour: t }) {
  const s = Ha(e), i = Fe(s, "completed"), n = za[o == null ? void 0 : o.state], M = s.filter((W) => W.state === "started").map((W) => ({ number: W.id, title: W.title })), b = Math.max(M.length, o && o.state !== "completed" ? 1 : 0), B = s.length - i - b, C = i === s.length;
  return {
    number: o.id,
    title: o.title,
    started: M,
    plan: o.plan_id ?? 0,
    count: `${i} of ${s.length}`,
    taskTip: `${i} of its ${s.length} tasks done${n ? `. This one is ${n.words}.` : "."}`,
    countTip: C ? `All ${s.length} tasks done` : `${i} done, ${b} in hand, ${B} to go`,
    paceTip: !C && t ? `About ${t} an hour.` : "",
    rate: !C && t ? `${Math.round(t)}/hour` : "",
    bar: { total: s.length, done: i, testing: Fe(s, "testing") }
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
  class: "tasks",
  "data-agent-tasks": ""
}, Fa = {
  key: 2,
  class: "plan",
  "data-agent-plan": ""
}, Ua = {
  key: 3,
  class: "rate",
  "data-agent-rate": ""
}, Pa = { key: 0 }, Ga = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, jobTitle: { type: String, default: "" }, jobLaunch: { type: String, default: "" }, perHour: { type: Number, default: 0 } },
  setup(e) {
    const o = e, t = u(() => o.inHand ? Ea({ tasks: o.tasks, inHand: o.inHand, perHour: o.perHour }) : null);
    return (s, i) => e.job && !t.value ? (a(), l("span", Na, [
      p(r(Me), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: y(() => [
          k("b", null, c(e.job), 1)
        ]),
        default: y(() => [
          f(c(e.jobTitle || "Job"), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (a(), l("span", Wa, c(e.jobLaunch), 1)) : h("", !0)
    ])) : t.value ? (a(), l(q, { key: 1 }, [
      k("span", Da, [
        t.value.started.length > 1 ? (a(), l("span", qa, [
          i[1] || (i[1] = f("Tasks ", -1)),
          (a(!0), l(q, null, ne(t.value.started, (n, M) => (a(), l(q, {
            key: n.number
          }, [
            M ? (a(), l(q, { key: 0 }, [
              f(", ")
            ], 64)) : h("", !0),
            p(r(Me), {
              as: "button",
              class: "task",
              "data-agent-task": "",
              "data-peek": `tasks:${n.number}`,
              "aria-label": `Task ${n.number}: ${n.title}`,
              onClick: X((b) => r(ke)(`tasks:${n.number}`), ["stop"])
            }, {
              tip: y(() => [
                k("b", null, c(n.title), 1)
              ]),
              default: y(() => [
                f(c(n.number), 1)
              ]),
              _: 2
            }, 1032, ["data-peek", "aria-label", "onClick"])
          ], 64))), 128))
        ])) : (a(), z(r(Me), {
          key: 1,
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${t.value.number}`,
          "aria-label": `Task ${t.value.number}: ${t.value.title}`,
          onClick: i[0] || (i[0] = X((n) => r(ke)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: y(() => [
            k("b", null, c(t.value.title), 1),
            k("span", null, c(t.value.taskTip), 1)
          ]),
          default: y(() => [
            f("Task " + c(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])),
        t.value.plan ? (a(), l("span", Fa, "Plan " + c(t.value.plan), 1)) : h("", !0),
        t.value.rate ? (a(), l("span", Ua, c(t.value.rate), 1)) : h("", !0),
        p(r(Me), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: y(() => [
            k("b", null, c(t.value.countTip), 1),
            t.value.paceTip ? (a(), l("span", Pa, c(t.value.paceTip), 1)) : h("", !0)
          ]),
          default: y(() => [
            f(c(t.value.count), 1)
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
    ], 64)) : h("", !0);
  }
}, Ja = /* @__PURE__ */ J(Ga, [["__scopeId", "data-v-e59affa8"]]), Ka = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', _a = ["data-icon", "stroke-width", "innerHTML"], ae = {
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
    }, i = {
      agent: Ka,
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
    return (n, M) => (a(), l("svg", {
      class: "ico",
      "data-icon": e.name,
      style: Le({
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
      innerHTML: i[s[e.name] || e.name] || i.dot
    }, null, 12, _a));
  }
}, Za = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Ya = {
  key: 1,
  class: "menu-item-text"
}, Qa = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (o, t) => (a(), l("button", {
      type: "button",
      class: de(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), l("span", Za, c(e.checked ? "✓" : ""), 1)) : h("", !0),
      e.description ? (a(), l("span", Ya, [
        k("span", null, [
          Se(o.$slots, "default", {}, void 0, !0)
        ]),
        k("small", null, c(e.description), 1)
      ])) : Se(o.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, be = /* @__PURE__ */ J(Qa, [["__scopeId", "data-v-fec99974"]]), Xa = {}, en = { class: "menu-label" };
function tn(e, o) {
  return a(), l("span", en, [
    Se(e.$slots, "default", {}, void 0, !0)
  ]);
}
const $e = /* @__PURE__ */ J(Xa, [["render", tn], ["__scopeId", "data-v-aa955b3e"]]), an = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, nn = {
  key: 0,
  class: "skills-none"
}, on = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: o }) {
    const t = e, s = o, i = u(() => t.skills.filter((M) => M.state === "loaded")), n = u(() => t.skills.filter((M) => M.state !== "loaded"));
    return (M, b) => (a(), l("div", an, [
      p($e, null, {
        default: y(() => [...b[1] || (b[1] = [
          f("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      i.value.length ? h("", !0) : (a(), l("p", nn, "None yet. Compacting the conversation empties this list.")),
      (a(!0), l(q, null, ne(i.value, (B) => (a(), l("p", {
        key: B.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        p(ae, {
          name: "book",
          size: 12
        }),
        f(c(B.skill), 1)
      ]))), 128)),
      n.value.length ? (a(), l(q, { key: 1 }, [
        p($e, null, {
          default: y(() => [...b[2] || (b[2] = [
            f("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), l(q, null, ne(n.value, (B) => (a(), l("p", {
          key: B.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          p(ae, {
            name: "book",
            size: 12
          }),
          f(c(B.skill), 1)
        ]))), 128))
      ], 64)) : h("", !0),
      p(be, {
        "data-agent-skills-browse": "",
        onClick: b[0] || (b[0] = (B) => s("browse"))
      }, {
        default: y(() => [...b[3] || (b[3] = [
          f("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, sn = /* @__PURE__ */ J(on, [["__scopeId", "data-v-be514d47"]]), ln = ["disabled", "title"], rn = { class: "gauge usage" }, dn = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: o }) {
    const t = e, s = o, i = u(() => t.windows[0] ?? null), n = u(() => i.value && Number.isFinite(i.value.used_percent) ? Math.max(0, Math.min(100, Math.round(i.value.used_percent))) : null), M = u(() => n.value !== null && n.value >= 100), b = u(() => {
      var C;
      return (C = i.value) != null && C.reset_epoch_seconds ? new Date(i.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), B = u(() => M.value ? `At usage limit: the plan's ${i.value.title} allowance is used up${b.value ? `, starts again ${b.value}` : ""}` : `${n.value}% of the plan's ${i.value.title} allowance used${b.value ? `, starts again ${b.value}` : ""}`);
    return (C, W) => n.value !== null ? (a(), l("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: B.value,
      onClick: W[0] || (W[0] = (D) => s("open", D.currentTarget))
    }, [
      p(ae, {
        name: "allowance",
        size: 12
      }),
      W[1] || (W[1] = f()),
      k("span", rn, [
        k("span", {
          style: Le({ width: `${n.value}%` })
        }, null, 4)
      ]),
      f(" " + c(M.value ? "At usage limit" : `${n.value}%`), 1)
    ], 8, ln)) : h("", !0);
  }
}, un = /* @__PURE__ */ J(dn, [["__scopeId", "data-v-a36f09dc"]]), cn = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (o, t) => (a(), l("span", {
      class: de(["badge", e.tone])
    }, c(e.text), 3));
  }
}, gn = /* @__PURE__ */ J(cn, [["__scopeId", "data-v-9e7e1157"]]), vn = (e, o, t) => Math.max(o, Math.min(t, e)), _e = /* @__PURE__ */ new WeakMap(), pn = (e, o) => _e.set(e, o);
function mn(e, o) {
  for (let t = o; t; t = _e.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function hn(e, o) {
  const t = (s) => {
    var n, M;
    const i = ((n = e.value) == null ? void 0 : n.element) || ((M = e.value) == null ? void 0 : M.$el) || e.value;
    i && !mn(i, s.target) && o(s);
  };
  window.addEventListener("click", t), xe(() => window.removeEventListener("click", t));
}
const fe = 8, fn = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, i = V(null), n = (d) => d ? `${d}px` : void 0, M = u(() => ({
      minWidth: n(s.minWidth),
      maxWidth: n(s.maxWidth),
      maxHeight: n(s.maxHeight),
      height: n(s.height)
    })), b = V({ w: 0, h: 0 }), B = V(s.anchor ? s.anchor.getBoundingClientRect() : null), C = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), W = (d) => ({
      left: Math.max(0, d.left),
      top: Math.max(0, d.top),
      right: Math.min(window.innerWidth, d.right),
      bottom: Math.min(window.innerHeight, d.bottom)
    }), D = (d) => {
      const R = d.closest(".pane, .float-window");
      return R ? W(R.getBoundingClientRect()) : C();
    }, H = (d, R) => `${Math.max(0, d ? Math.min(d, R) : R)}px`;
    function E(d, R) {
      return {
        below: d.bottom - R.bottom - s.gap - fe,
        above: R.top - d.top - s.gap - fe,
        across: d.right - d.left - 2 * fe
      };
    }
    function j(d) {
      const R = D(s.anchor), $ = E(R, d);
      return b.value.w <= $.across && b.value.h <= Math.max($.below, $.above) ? R : C();
    }
    const I = u(() => {
      if (!B.value) return M.value;
      const d = B.value, R = j(d), $ = E(R, d), { w: x, h: te } = b.value, G = s.align === "auto" ? d.left + d.right > R.left + R.right : s.align === "right", ye = vn(G ? d.right - x : d.left, R.left + fe, Math.max(R.left + fe, R.right - x - fe)), m = te > $.below && $.above > $.below ? { bottom: `${window.innerHeight - d.top + s.gap}px`, maxHeight: H(s.maxHeight, $.above) } : { top: `${d.bottom + s.gap}px`, maxHeight: H(s.maxHeight, $.below) };
      return { ...M.value, ...m, left: `${ye}px`, maxWidth: H(s.maxWidth, $.across) };
    }), N = t, _ = () => [...i.value.querySelectorAll("button:not(:disabled)")];
    function P(d) {
      const R = _(), $ = R.indexOf(document.activeElement);
      R[($ + d + R.length) % R.length].focus();
    }
    const Y = { ArrowDown: () => P(1), ArrowUp: () => P(-1), Escape: () => N("close") }, oe = (d) => Y[d.key] && (d.preventDefault(), Y[d.key]()), F = () => i.value && (b.value = { w: i.value.offsetWidth, h: i.value.scrollHeight });
    let K = 0;
    const S = new ResizeObserver(() => {
      cancelAnimationFrame(K), K = requestAnimationFrame(F);
    });
    hn(i, (d) => s.anchor && !s.anchor.contains(d.target) && N("close"));
    const v = (d, R) => ["top", "left", "right", "bottom"].some(($) => Math.abs(d[$] - R[$]) > 1), Z = (d) => d.bottom < 0 || d.top > window.innerHeight;
    let w = 0;
    function g() {
      if (s.anchor) {
        const d = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || Z(d)) return N("close");
        v(d, B.value) && (B.value = d);
      }
      w = requestAnimationFrame(g);
    }
    return at(() => {
      s.anchor && i.value && pn(i.value, s.anchor), F(), i.value && S.observe(i.value), !s.plain && _()[0] && _()[0].focus(), g();
    }), xe(() => {
      S.disconnect(), cancelAnimationFrame(w), cancelAnimationFrame(K);
    }), o({ element: i }), (d, R) => (a(), z(nt, {
      to: "body",
      disabled: !e.anchor
    }, [
      k("div", ot({
        ref_key: "panel",
        ref: i
      }, d.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: I.value,
        onKeydown: oe
      }), [
        Se(d.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), bn = /* @__PURE__ */ J(fn, [["__scopeId", "data-v-3d203970"]]);
async function kn(e, o, t) {
  if (!e) return t(o);
  const { target: s, fields: i } = e, n = Object.fromEntries(Object.keys(i).map((B) => [B, s[B]])), M = () => Object.assign(s, n);
  Object.assign(s, i);
  let b = !1;
  try {
    const B = await t(o);
    return b = B.ok, B;
  } finally {
    b || M();
  }
}
function yn(e, o, t, { groups: s, programs: i }) {
  const n = V({}), M = V(""), b = V(!1), B = u(() => !!e.value && !e.value.ended_at), C = u(() => B.value && !!e.value.paused_at);
  async function W(j, I = null) {
    M.value = "";
    const N = await kn(I, j, o);
    return M.value = N.ok ? "" : N.error, t(), N;
  }
  return { groups: s, programs: i, chosen: n, failure: M, asking: b, running: B, paused: C, choose: (j, I) => W(["agent", "control", String(e.value.number), j, I.value], { target: n, fields: { value: { ...n.value, [j]: I.label } } }), stop: () => (b.value = !1, W(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (j) => W(["agent", "launch", j.name]) };
}
function wn(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const Mn = { compact: "Compaction", clear: "Clear" };
function $n(e) {
  return e != null && e.is_open ? `${Mn[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
const xn = ["disabled", "title"], Sn = ["disabled", "title"], Cn = { class: "gauge" }, An = {
  key: 1,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
}, jn = ["disabled", "title"], Tn = ["disabled"], Ln = ["disabled"], Bn = {
  key: 5,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Rn = ["title"], In = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, On = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Vn = { class: "gauge" }, zn = { class: "context-used" }, Hn = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, En = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, Nn = 75, Wn = {
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
    const t = e, s = o, i = yn(Ie(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => s("changed"), { groups: Ie(t, "controlGroups"), programs: Ie(t, "agentPrograms") }), n = V(null), M = V(""), b = u(() => i.groups.value.find((S) => S.key === M.value));
    function B(S, v) {
      n.value = S.currentTarget, M.value = v;
    }
    function C() {
      n.value = null, M.value = "", i.asking.value = !1;
    }
    const W = u(() => t.skills.filter((S) => S.state === "loaded"));
    function D(S) {
      B(S, "skills"), s("skills");
    }
    const H = (S) => i.groups.value.some((v) => v.key === S), E = u(() => {
      var S;
      return i.chosen.value.model ?? ((S = I.value) == null ? void 0 : S.model) ?? "";
    }), j = u(() => {
      var S;
      return i.chosen.value.effort ?? ((S = I.value) == null ? void 0 : S.effort) ?? "";
    });
    u(() => !!t.agent && !t.agent.ended_at);
    const I = u(() => {
      var S;
      return ((S = t.usage.agents) == null ? void 0 : S.find((v) => {
        var Z;
        return v.id === ((Z = t.agent) == null ? void 0 : Z.id);
      })) ?? null;
    }), N = u(() => {
      var S;
      return ((S = I.value) == null ? void 0 : S.context_percent) == null ? null : Math.round(I.value.context_percent);
    }), _ = u(() => {
      var S;
      return $n(((S = I.value) == null ? void 0 : S.context_change) ?? null);
    }), P = (S) => `${Math.round(S / 1e3)}k`, Y = u(() => {
      var S;
      return !!((S = I.value) != null && S.context_limit_tokens);
    }), oe = u(() => {
      var S, v;
      return ((S = I.value) == null ? void 0 : S.context_limit_tokens) || ((v = I.value) == null ? void 0 : v.context_window_tokens) || 0;
    }), F = u(() => oe.value ? `${P(I.value.context_tokens ?? 0)} of ${P(oe.value)}` : ""), K = u(() => {
      var S;
      return (S = I.value) != null && S.cost_dollars ? `$${I.value.cost_dollars.toFixed(2)}` : "";
    });
    return (S, v) => {
      var Z, w;
      return a(), l("div", {
        class: de(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (a(), l(q, { key: 0 }, [
          k("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: v[0] || (v[0] = (g) => B(g, "agent"))
          }, [
            p(ae, {
              name: "agents",
              size: 12
            }),
            f(" " + c(((Z = e.agentPrograms.find((g) => g.name === e.agent.program)) == null ? void 0 : Z.title) || e.agent.program), 1)
          ], 8, xn),
          p(un, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: v[1] || (v[1] = (g) => s("open", "usage", g))
          }, null, 8, ["windows", "disabled"]),
          N.value !== null ? (a(), l("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${N.value}% full: clear or compact it`,
            onClick: v[2] || (v[2] = (g) => H("context") ? B(g, "context") : s("open", "context", g.currentTarget))
          }, [
            p(ae, {
              name: "gauge",
              size: 12
            }),
            v[14] || (v[14] = f()),
            k("span", Cn, [
              k("span", {
                style: Le({ width: `${N.value}%` })
              }, null, 4)
            ]),
            f(" " + c(N.value) + "% ", 1)
          ], 8, Sn)) : (w = I.value) != null && w.context_unknown ? (a(), l("span", An, [
            p(ae, {
              name: "gauge",
              size: 12
            }),
            v[15] || (v[15] = f(" Context: unknown", -1))
          ])) : h("", !0),
          E.value ? (a(), l("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${E.value}: change the model`,
            onClick: v[3] || (v[3] = (g) => H("model") ? B(g, "model") : null)
          }, [
            p(ae, {
              name: "model",
              size: 12
            }),
            f(" " + c(E.value), 1)
          ], 8, jn)) : h("", !0),
          H("effort") || e.card && j.value ? (a(), l("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: v[4] || (v[4] = (g) => B(g, "effort"))
          }, [
            p(ae, {
              name: "bolt",
              size: 12
            }),
            f(" " + c(j.value), 1)
          ], 8, Tn)) : h("", !0),
          K.value ? (a(), l("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: v[5] || (v[5] = (g) => s("open", "cost", g.currentTarget))
          }, c(K.value), 9, Ln)) : h("", !0),
          e.branch ? (a(), l("span", Bn, [
            p(ae, {
              name: "branch",
              size: 12
            }),
            f(" " + c(e.branch), 1)
          ])) : h("", !0),
          e.card ? h("", !0) : (a(), l("button", {
            key: 6,
            type: "button",
            class: de(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: v[6] || (v[6] = (g) => s("open", "jobs", g.currentTarget))
          }, [
            p(ae, {
              name: "clock",
              size: 12
            }),
            f(" " + c(e.jobs), 1)
          ], 2)),
          e.run ? (a(), l("button", {
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
            f(" " + c(W.value.length), 1)
          ])) : h("", !0),
          e.fitness ? (a(), l(q, { key: 8 }, [
            k("button", {
              type: "button",
              class: de(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Nn }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: v[7] || (v[7] = (g) => s("open", "fitness", g.currentTarget))
            }, [
              p(ae, {
                name: "heart",
                size: 12
              }),
              f(" " + c(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            k("button", {
              type: "button",
              class: de(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: v[8] || (v[8] = (g) => s("open", "load", g.currentTarget))
            }, [
              p(ae, {
                name: "weight",
                size: 12
              }),
              f(" " + c(e.fitness.workload), 1)
            ], 2)
          ], 64)) : h("", !0)
        ], 64)) : e.run && !e.loading ? (a(), l("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: v[9] || (v[9] = (g) => B(g, "start"))
        }, [
          p(ae, {
            name: "agents",
            size: 12
          }),
          v[16] || (v[16] = f(" Start an agent", -1))
        ])) : h("", !0),
        v[22] || (v[22] = k("span", { class: "space" }, null, -1)),
        r(i).failure.value ? (a(), l("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: r(i).failure.value
        }, c(r(i).failure.value), 9, Rn)) : h("", !0),
        Se(S.$slots, "default", {}, void 0, !0),
        n.value ? (a(), z(bn, {
          key: 3,
          anchor: n.value,
          "min-width": 190,
          onClose: C
        }, {
          default: y(() => {
            var g;
            return [
              M.value === "agent" ? (a(), l(q, { key: 0 }, [
                r(i).asking.value ? (a(), l(q, { key: 0 }, [
                  p($e, { "data-agent-stop-ask": "" }, {
                    default: y(() => [...v[17] || (v[17] = [
                      f("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  p(be, {
                    "data-agent-stop-confirm": "",
                    onClick: v[10] || (v[10] = (d) => (C(), r(i).stop()))
                  }, {
                    default: y(() => [...v[18] || (v[18] = [
                      f("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  p(be, {
                    onClick: v[11] || (v[11] = (d) => r(i).asking.value = !1)
                  }, {
                    default: y(() => [...v[19] || (v[19] = [
                      f("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (a(), z(be, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: v[12] || (v[12] = (d) => r(i).asking.value = !0)
                }, {
                  default: y(() => [...v[20] || (v[20] = [
                    f("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : M.value === "start" ? (a(), l(q, { key: 1 }, [
                p($e, null, {
                  default: y(() => [...v[21] || (v[21] = [
                    f("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (a(!0), l(q, null, ne(r(i).programs.value, (d) => (a(), z(be, {
                  key: d.name,
                  "data-agent-program": d.name,
                  onClick: (R) => (C(), r(i).start(d))
                }, {
                  default: y(() => [
                    f(c(d.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : M.value === "skills" ? (a(), z(sn, {
                key: 2,
                skills: e.skills,
                onBrowse: v[13] || (v[13] = (d) => (C(), s("open", "skills", null)))
              }, null, 8, ["skills"])) : b.value ? (a(), l(q, { key: 3 }, [
                p($e, null, {
                  default: y(() => [
                    f(c(b.value.label), 1)
                  ]),
                  _: 1
                }),
                M.value === "context" ? (a(), l(q, { key: 0 }, [
                  k("p", In, c(r(wn)(((g = I.value) == null ? void 0 : g.last_compaction) ?? null)), 1),
                  k("div", On, [
                    k("span", Vn, [
                      k("span", {
                        style: Le({ width: `${N.value}%` })
                      }, null, 4)
                    ]),
                    k("span", zn, c(N.value) + "%", 1)
                  ]),
                  F.value ? (a(), l("p", Hn, [
                    f(c(F.value) + " ", 1),
                    Y.value ? (a(), z(gn, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : h("", !0)
                  ])) : h("", !0)
                ], 64)) : h("", !0),
                M.value === "context" && _.value ? (a(), l("p", En, c(_.value), 1)) : (a(!0), l(q, { key: 2 }, ne(b.value.choices, (d) => (a(), z(be, {
                  key: d.value,
                  "data-agent-choice": d.value,
                  onClick: (R) => (r(i).choose(b.value.key, d), C())
                }, {
                  default: y(() => [
                    f(c(d.label), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-choice", "onClick"]))), 128))
              ], 64)) : h("", !0)
            ];
          }),
          _: 1
        }, 8, ["anchor"])) : h("", !0)
      ], 2);
    };
  }
}, Dn = /* @__PURE__ */ J(Wn, [["__scopeId", "data-v-39d8d09e"]]), qn = ["data-agent-open", "aria-expanded", "role", "tabindex"], Fn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Un = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Pn = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, Gn = { class: "agent-line" }, Jn = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Kn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, _n = {
  key: 1,
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, Zn = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Yn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), s = { helper: "Helper", reviewer: "Reviewer", main: "Main agent" }, i = { running: "Working", starting: "Starting", stopping: "Stopping", ended: "Idle: its process has stopped", failed: "Could not start", never_started: "Not started" }, n = e, M = o, b = Ke(), B = u(() => {
      var L, Q;
      if ((L = n.facts) != null && L.profile_title) return n.facts.profile_title;
      if ((Q = n.facts) != null && Q.profile) return n.facts.profile;
      const m = s[n.row.role] || n.row.role;
      return m.slice(0, 1).toUpperCase() + m.slice(1);
    }), C = u(() => {
      var m;
      return ((m = n.facts) == null ? void 0 : m.tasks) ?? [];
    }), W = u(() => C.value.filter((m) => m.state === "open")), D = u(() => C.value.find((m) => {
      var L;
      return m.id === ((L = n.progress) == null ? void 0 : L.task_id) && m.state === "started";
    })), H = u(() => D.value || C.value.find((m) => {
      var L;
      return m.id === ((L = n.facts) == null ? void 0 : L.task_id);
    }) || C.value.find((m) => t.has(m.state)) || W.value[0] || C.value.at(-1)), E = u(() => {
      var m, L, Q, ue, se, ge;
      return n.row.role === "helper" ? ((m = n.facts) == null ? void 0 : m.helper_job) || "" : (L = n.facts) != null && L.job_enabled && (((Q = D.value) == null ? void 0 : Q.title) || ((ue = n.facts) == null ? void 0 : ue.task_title) || ((se = W.value[0]) == null ? void 0 : se.title) || ((ge = C.value.at(-1)) == null ? void 0 : ge.title)) || "";
    }), j = u(() => `${n.row.role} ${n.row.number}`), I = u(() => {
      var m, L;
      return [n.row.program, (m = n.facts) == null ? void 0 : m.model, (L = n.facts) == null ? void 0 : L.effort, j.value].filter(Boolean).join(" · ");
    }), N = Re(), _ = u(() => mt(n.row.process_started_at || n.row.created_at, b.value)), P = /* @__PURE__ */ new Set(["open", "started", "testing"]), Y = { fresh: "new conversation", resumed: "resumed" }, oe = u(() => {
      var m, L;
      return [(m = n.facts) == null ? void 0 : m.helper_job_program, Y[(L = n.facts) == null ? void 0 : L.occupant_launch]].filter(Boolean).join(", ");
    }), F = u(() => {
      var m;
      return (m = n.facts) == null ? void 0 : m.work_status;
    }), K = u(() => !!n.row.ended_at && n.row.role !== "main" && C.value.some((m) => P.has(m.state))), S = u(() => {
      var m, L;
      return n.row.state === "running" && ((m = n.facts) == null ? void 0 : m.state) === "at usage limit" && !!((L = n.facts) != null && L.usage_limit_ends_at);
    }), v = (m) => new Date(m).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), Z = u(() => n.row.halted_at ? `Stopped at the usage limit since ${v(n.row.halted_at)}, goes on at ${v(n.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(n.facts.usage_limit_ends_at).toLocaleString()}`), w = u(() => {
      var m;
      return n.row.retired_at || n.row.state === "retired" ? "retired" : S.value || F.value || n.waitReason || K.value ? "waiting" : n.row.state === "running" && ((m = n.facts) == null ? void 0 : m.state) || n.row.state;
    }), g = u(() => {
      var m;
      return S.value ? Z.value : F.value ? `Status: ${F.value}` : n.waitReason ? `Waiting: ${n.waitReason}` : w.value === "blocked" ? (m = n.facts) != null && m.blocked_reason ? `Blocked: ${n.facts.blocked_reason}` : "Blocked" : K.value ? "Stopped with work left" : "";
    }), d = u(() => {
      var m;
      return ((m = n.progress) == null ? void 0 : m.completed_count) ?? C.value.filter((L) => L.state === "completed").length;
    }), R = u(() => {
      var m;
      return ht(d.value, ((m = n.progress) == null ? void 0 : m.started_at) || n.row.created_at, n.progress ? n.progress.finished_at : n.row.ended_at, b.value);
    }), $ = u(() => n.row.role === "main" ? 0 : R.value), x = u(() => !!n.row.retired_at || n.row.state === "retired"), te = u(() => x.value ? "Retired" : w.value === "blocked" || w.value === "waiting" ? g.value || (w.value === "blocked" ? "Blocked" : "Waiting") : i[n.row.standing]), G = u(() => {
      var L;
      if (x.value) return n.row.retired_at;
      const m = w.value === "blocked" || w.value === "waiting";
      return n.row.ended_at || m && ((L = n.facts) == null ? void 0 : L.last_activity) || n.row.process_started_at || n.row.created_at;
    }), ye = u(() => ft(G.value, b.value)), we = u(() => {
      var m;
      return bt((m = n.facts) == null ? void 0 : m.last_activity, b.value);
    });
    return (m, L) => {
      var Q, ue, se, ge, me, le;
      return a(), l("div", {
        class: de(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: L[3] || (L[3] = (re) => !e.open && M("toggle")),
        onKeydown: [
          L[4] || (L[4] = De(X((re) => !e.open && M("toggle"), ["self", "prevent"]), ["enter"])),
          L[5] || (L[5] = De(X((re) => !e.open && M("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        p(r(kt), {
          "agent-id": e.row.id,
          label: B.value,
          class: "agent-head"
        }, {
          default: y(() => {
            var re;
            return [
              e.open ? (a(), l("button", {
                key: 0,
                type: "button",
                class: "agent-back",
                title: "Back",
                "aria-label": "Back",
                onClick: L[0] || (L[0] = X((Ce) => M("toggle"), ["stop"]))
              }, [
                p(r(Ve), {
                  name: "chevronRight",
                  facing: "left",
                  size: 14
                })
              ])) : h("", !0),
              k("span", Fn, c(B.value), 1),
              k("span", Un, c(((re = e.facts) == null ? void 0 : re.given_name) || e.row.id), 1),
              e.open ? h("", !0) : (a(), z(r(Ve), {
                key: 1,
                class: "agent-chevron",
                name: "chevronRight",
                size: 12
              })),
              e.open ? (a(), l("span", Pn, c(_.value), 1)) : h("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-id", "label"]),
        k("span", Gn, [
          k("span", Jn, c(I.value), 1),
          (Q = e.facts) != null && Q.sandbox_off ? (a(), l("span", Kn, "sandbox off")) : h("", !0),
          e.open ? (a(), l("span", _n, [
            L[6] || (L[6] = f("Started ", -1)),
            p(r(Be), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : h("", !0),
          e.open && ((ue = e.facts) != null && ue.last_activity) ? (a(), l("span", Zn, [
            L[7] || (L[7] = f("Seen ", -1)),
            p(r(Be), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : h("", !0)
        ]),
        e.open ? (a(), z(Dn, {
          key: 0,
          "agent-programs": r(N).props.programs.rows.value,
          agent: e.row,
          branch: (se = e.progress) == null ? void 0 : se.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((ge = e.facts) == null ? void 0 : ge.windows) ?? [] },
          card: ""
        }, {
          default: y(() => {
            var re;
            return [
              p(La, { row: e.row }, null, 8, ["row"]),
              p(r(ee), {
                variant: "ghost",
                small: "",
                "data-agent-inspector": "",
                onClick: L[1] || (L[1] = X((Ce) => r(ke)(`agents:${e.row.id}`), ["stop"]))
              }, {
                default: y(() => [...L[8] || (L[8] = [
                  f("Open inspector", -1)
                ])]),
                _: 1
              }),
              e.row.role === "helper" && (!e.row.ended_at || (re = e.facts) != null && re.helper_job_open) ? (a(), z(r(ee), {
                key: 0,
                variant: "ghost",
                small: "",
                "data-helper-stop": "",
                onClick: L[2] || (L[2] = X((Ce) => r(N).run(["helper", "stop", String(e.row.number)]), ["stop"]))
              }, {
                default: y(() => [
                  f(c(e.row.ended_at ? "End job" : "Stop"), 1)
                ]),
                _: 1
              })) : h("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : h("", !0),
        e.open ? h("", !0) : (a(), z(Ja, {
          key: 1,
          tasks: C.value,
          "in-hand": e.row.role !== "helper" && ((me = e.facts) != null && me.job_enabled) && H.value || null,
          job: e.row.role === "helper" ? E.value : "",
          "job-title": e.row.role === "helper" && ((le = e.facts) == null ? void 0 : le.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? oe.value : "",
          "per-hour": $.value
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour"])),
        p(Va, {
          state: w.value,
          doing: te.value,
          since: ye.value,
          seen: we.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (a(), z(oa, {
          key: 2,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: C.value,
          "stopped-with-work": K.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : h("", !0)
      ], 42, qn);
    };
  }
}, Qn = /* @__PURE__ */ J(Yn, [["__scopeId", "data-v-c505edef"]]), Xn = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, eo = ["data-agent-row", "data-agent-lingering"], Ue = "journal.agents.filters", Pe = 300 * 1e3, Te = "cubic-bezier(0.2, 0.9, 0.25, 1)", to = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const o = e, t = Re(), { rows: s } = t.props.waits, { rows: i } = t.props.progress, { rows: n, failure: M, loaded: b, more: B } = t.props.agents, C = (T) => i.value.find((O) => O.agent_id === T.id) ?? null, W = (T) => {
      var O;
      return ((O = s.value.find((A) => A.agent_id === T.id)) == null ? void 0 : O.reason) ?? "";
    }, D = V("running"), H = V(""), E = JSON.parse(localStorage.getItem(Ue) || '{"roles":[],"profiles":[],"programs":[]}'), j = V(E), I = u(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: N } = t.props.programs, _ = u(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), P = (T, O) => {
      j.value = $t(j.value, T, O);
    }, Y = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, oe = (T) => T.slice(0, 1).toUpperCase() + T.slice(1);
    ce(j, (T) => localStorage.setItem(Ue, JSON.stringify(T)));
    const F = V(25);
    function K() {
      Object.assign(t.state, {
        "agents.show": D.value,
        "agents.search": H.value,
        "agents.limit": String(F.value),
        "agents.roles": j.value.roles.join(","),
        "agents.profiles": j.value.profiles.join(","),
        "agents.programs": j.value.programs.join(",")
      });
    }
    async function S() {
      return F.value += 25, K(), await t.reload("agents"), !0;
    }
    ce([D, H, j], () => {
      F.value = 25, K(), t.reload("agents");
    }), K();
    const v = (T) => T.facts ?? null, Z = n, w = Ke(), g = V([]), d = u(() => new Set(g.value.filter((T) => w.value - T.left < Pe).map((T) => T.row.id))), R = u(() => g.value.filter((T) => d.value.has(T.row.id)).map((T) => T.row)), $ = u(() => [...Z.value, ...R.value]);
    let x = "", te = [];
    async function G(T) {
      await t.reload(`card.${T.id}`);
      const O = t.props[`card.${T.id}`].rows.value.find((A) => A.id === T.id);
      O != null && O.ended_at && !g.value.some((A) => A.row.id === T.id) && (g.value = [...g.value, { row: O, left: Date.now() }]);
    }
    ce(n, (T) => {
      const O = x === `${D.value}|${H.value}|${JSON.stringify(j.value)}` && D.value === "running", A = O ? te.filter((U) => !T.some((ve) => ve.id === U.id)) : [];
      x = `${D.value}|${H.value}|${JSON.stringify(j.value)}`, te = T, g.value = O ? g.value.filter((U) => w.value - U.left < Pe && !T.some((ve) => ve.id === U.row.id)) : [], A.forEach(G);
    }, { immediate: !0 });
    const ye = u(() => !!H.value.trim() || _.value > 0), we = u(() => o.texts[D.value] ?? { title: o.empty, hint: "" }), m = V(null), L = V(null), Q = V(null), ue = V(null), se = u(() => m.value === null ? null : t.props[`card.${m.value}`].rows.value.find((T) => T.id === m.value) ?? L.value), ge = u(() => se.value ? [se.value] : $.value), me = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, le = V(!1);
    let re = 0;
    async function Ce(T) {
      if (le.value) return;
      le.value = !0, re = ue.value.scrollTop;
      const O = Q.value.querySelector(`[data-agent-open="${T.id}"]`);
      if (!me()) {
        const pe = [...Q.value.querySelectorAll(".agent-row")].filter((ie) => !ie.contains(O));
        await Promise.all(pe.map((ie) => ie.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const A = [...O.querySelectorAll(".agent-head, .agent-line")], U = [...A, ...O.querySelectorAll("[data-agent-motion]")], ve = U.map((pe) => pe.getBoundingClientRect());
      if (L.value = T, m.value = T.id, t.reload(`card.${T.id}`), await qe(), !me()) {
        const pe = U.map((ie) => ie.getBoundingClientRect());
        U.forEach((ie, Ae) => {
          const he = A.findIndex((We) => We !== ie && We.contains(ie)), Ye = ve[Ae].left - pe[Ae].left - (he < 0 ? 0 : ve[he].left - pe[he].left), Qe = ve[Ae].top - pe[Ae].top - (he < 0 ? 0 : ve[he].top - pe[he].top);
          ie.animate([{ transform: `translate(${Ye}px, ${Qe}px)` }, { transform: "none" }], { duration: 280, easing: Te });
        }), Q.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((ie) => {
          ie.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Te, fill: "backwards" });
        });
      }
      le.value = !1;
    }
    async function Ee() {
      if (le.value || !se.value) return;
      le.value = !0;
      const T = Q.value.querySelector(`[data-agent-open="${m.value}"]`), O = [...T.children], A = me() ? [] : O.map((U) => U.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(A.map((U) => U.finished)), m.value = null, await qe(), ue.value.scrollTop = re, A.forEach((U) => U.cancel()), me() || (T.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Te }), Q.value.querySelectorAll(".agent-row").forEach((U) => {
        U.contains(T) || U.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Te });
      })), le.value = !1;
    }
    const Ze = (T) => m.value === T.id ? Ee() : Ce(T);
    ce(H, (T) => T.trim() && (m.value = null)), ce(D, () => {
      m.value = null;
    });
    const Ne = (T) => {
      T.key === "Escape" && Ee();
    };
    return window.addEventListener("keydown", Ne), xe(() => window.removeEventListener("keydown", Ne)), (T, O) => (a(), l("div", {
      ref_key: "agents",
      ref: Q,
      class: de(["agents", { focused: se.value, "card-changing": le.value }])
    }, [
      se.value ? h("", !0) : (a(), z(r(yt), {
        key: 0,
        modelValue: H.value,
        "onUpdate:modelValue": O[1] || (O[1] = (A) => H.value = A),
        placeholder: "Search agents",
        "menu-count": _.value,
        "data-agents-search": ""
      }, {
        menu: y(() => [
          p(r(Oe), null, {
            default: y(() => [...O[2] || (O[2] = [
              f("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), l(q, null, ne(I.value.roles, (A) => (a(), z(r(je), {
            key: A,
            role: "menuitemcheckbox",
            "aria-checked": j.value.roles.includes(A),
            checked: j.value.roles.includes(A),
            "data-filter-role": A,
            onClick: (U) => P("roles", A)
          }, {
            default: y(() => [
              f(c(oe(A)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          I.value.profiles.length ? (a(), z(r(Oe), { key: 0 }, {
            default: y(() => [...O[3] || (O[3] = [
              f("Profile", -1)
            ])]),
            _: 1
          })) : h("", !0),
          (a(!0), l(q, null, ne(I.value.profiles, (A) => (a(), z(r(je), {
            key: A.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.profiles.includes(A.name),
            checked: j.value.profiles.includes(A.name),
            "data-filter-profile": A.name,
            onClick: (U) => P("profiles", A.name)
          }, {
            default: y(() => [
              f(c(A.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          p(r(Oe), null, {
            default: y(() => [...O[4] || (O[4] = [
              f("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), l(q, null, ne(r(N), (A) => (a(), z(r(je), {
            key: A.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.programs.includes(A.name),
            checked: j.value.programs.includes(A.name),
            "data-filter-program": A.name,
            onClick: (U) => P("programs", A.name)
          }, {
            default: y(() => [
              f(c(A.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          _.value ? (a(), z(r(je), {
            key: 1,
            "data-filter-clear": "",
            onClick: Y
          }, {
            default: y(() => [...O[5] || (O[5] = [
              f("Clear filters", -1)
            ])]),
            _: 1
          })) : h("", !0)
        ]),
        default: y(() => [
          p(r(wt), {
            options: I.value.states,
            value: D.value,
            onPick: O[0] || (O[0] = (A) => D.value = A)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      D.value === "retired" && I.value.upgrade_retired ? (a(), l("p", Xn, "Retired during the upgrade: " + c(I.value.upgrade_retired), 1)) : h("", !0),
      k("div", {
        ref_key: "list",
        ref: ue,
        class: de(["agents-view", { "agents-view-open": se.value }])
      }, [
        r(b) && !r(M) && !ge.value.length && _.value ? (a(), z(r(ze), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: y(() => [
            p(r(ee), {
              small: "",
              "data-empty-clear": "",
              onClick: Y
            }, {
              default: y(() => [...O[6] || (O[6] = [
                f("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), z(r(Mt), {
          key: 1,
          moves: "",
          "leaves-at-once": le.value,
          rows: ge.value,
          failure: r(M),
          loaded: r(b),
          more: !se.value && r(B),
          older: S,
          empty: we.value.title,
          hint: we.value.hint,
          searching: ye.value
        }, {
          default: y(({ row: A }) => [
            k("div", {
              class: de(["agent-row", { lingering: d.value.has(A.id) && A.id !== m.value }]),
              "data-agent-row": A.id,
              "data-agent-lingering": d.value.has(A.id) ? "" : null
            }, [
              p(Qn, {
                row: A,
                facts: v(A),
                progress: C(A),
                "wait-reason": W(A),
                open: A.id === m.value,
                onToggle: (U) => Ze(A)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, eo)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, so = /* @__PURE__ */ J(to, [["__scopeId", "data-v-fceb20c3"]]);
export {
  so as A
};
