import { openBlock as n, createElementBlock as l, withModifiers as te, unref as r, createTextVNode as h, toDisplayString as g, createVNode as p, createBlock as z, computed as c, createElementVNode as b, createCommentVNode as v, withCtx as f, Fragment as F, renderList as ne, ref as V, watch as ve, onUnmounted as Ce, defineAsyncComponent as Xe, createSlots as et, resolveDynamicComponent as tt, normalizeClass as ue, normalizeStyle as Be, renderSlot as Ae, onMounted as at, Teleport as nt, mergeProps as ot, toRef as Ve, withKeys as qe, nextTick as Fe } from "vue";
import { peekRef as we, Icon as ze, RunningCommand as st, TimeAgo as Ie, FoldGroup as Je, TaskStatusIcon as lt, useWindow as Oe, loadWindowComponent as rt, coalesced as it, READ_RATES as dt, eventMayBeChildOf as ut, InnerTabs as ct, TabBody as gt, SwitchCase as Ke, EmptyState as Ee, TextInput as Ne, Btn as Q, TextArea as vt, HoverTip as xe, TaskBar as mt, useNow as Ze, age as pt, perHour as ht, sinceWords as ft, seenWords as bt, AgentTip as kt, SearchBar as yt, Segmented as wt, MenuLabel as He, MenuItem as Le, RowList as Mt, toggleFilter as $t } from "@journal/window-kit";
import { _ as Z, T as xt } from "./TranscriptRows-Crmxs6Un.js";
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
        onClick: t[0] || (t[0] = te((s) => r(we)("test_queue:0"), ["stop"]))
      }, [
        h("Waiting: " + g(e.waitReason) + " ", 1),
        p(r(ze), {
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
}, jt = /* @__PURE__ */ Z(At, [["__scopeId", "data-v-1b371fb5"]]), Tt = {
  class: "lasting-facts",
  "data-agent-lasting-facts": ""
}, Lt = { key: 0 }, Rt = { "data-agent-first-dispatched": "" }, Bt = { "data-agent-session-count": "" }, It = { key: 1 }, Ot = { "data-agent-session-end-reason": "" }, Vt = { key: 2 }, Ht = { "data-agent-retired-at": "" }, zt = { key: 3 }, Et = { "data-agent-retired-by": "" }, Nt = {
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
    }, t = e, s = c(() => t.row.replaced_session_end_reason ? o[t.row.replaced_session_end_reason] || t.row.replaced_session_end_reason.replaceAll("_", " ") : "");
    return (i, a) => (n(), l("dl", Tt, [
      e.row.created_at ? (n(), l("div", Lt, [
        a[0] || (a[0] = b("dt", null, "Started", -1)),
        b("dd", Rt, [
          p(r(Ie), {
            at: e.row.created_at
          }, null, 8, ["at"])
        ])
      ])) : v("", !0),
      b("div", null, [
        a[1] || (a[1] = b("dt", null, "Sessions", -1)),
        b("dd", Bt, g(e.row.session_count ?? 0), 1)
      ]),
      s.value ? (n(), l("div", It, [
        a[2] || (a[2] = b("dt", null, "Last session ended", -1)),
        b("dd", Ot, g(s.value), 1)
      ])) : v("", !0),
      e.row.retired_at ? (n(), l("div", Vt, [
        a[3] || (a[3] = b("dt", null, "Retired", -1)),
        b("dd", Ht, [
          p(r(Ie), {
            at: e.row.retired_at
          }, null, 8, ["at"])
        ])
      ])) : v("", !0),
      e.row.retiring_actor_name ? (n(), l("div", zt, [
        a[4] || (a[4] = b("dt", null, "Retired by", -1)),
        b("dd", Et, g(e.row.retiring_actor_name), 1)
      ])) : v("", !0)
    ]));
  }
}, Wt = /* @__PURE__ */ Z(Nt, [["__scopeId", "data-v-3d75bc39"]]), Dt = ["data-agent-delegated", "onClick"], qt = { class: "agent-task-number" }, Ft = { class: "agent-task-title" }, Ut = ["title"], Pt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = o;
    return (s, i) => (n(), z(r(Je), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: i[0] || (i[0] = (a) => t("toggle"))
    }, {
      default: f(() => [
        (n(!0), l(F, null, ne(e.section.tasks, (a) => (n(), l("button", {
          key: a.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": a.id,
          onClick: (k) => r(we)(`tasks:${a.id}`)
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
          }, "Plan " + g(a.plan_id), 9, Ut)) : v("", !0)
        ], 8, Dt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Gt = /* @__PURE__ */ Z(Pt, [["__scopeId", "data-v-ea4ccd6b"]]), Jt = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Kt = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Zt = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, _t = ["data-peek", "onClick"], Yt = {
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
    const o = e, t = ["started", "blocked", "open", "completed"], s = c(() => {
      var y, u;
      return o.row.ended_at && ((u = (y = o.facts) == null ? void 0 : y.job_returned) != null && u.startsWith(ta)) ? o.facts.job_returned : "";
    }), i = c(() => o.tasks.length ? t.map((y) => ({ state: y, label: y.slice(0, 1).toUpperCase() + y.slice(1), tasks: o.tasks.filter((u) => u.state === y || y === "started" && u.state === "testing" || y === "completed" && u.state === "cancelled") })) : []), a = /* @__PURE__ */ new Set(["completed"]), k = V({}), $ = (y) => !(k.value[y] ?? a.has(y)), T = (y) => k.value = { ...k.value, [y]: $(y) }, x = Oe(), { rows: D } = x.props.reports;
    x.state["reports.agent"] = String(o.row.number);
    const q = c(() => o.row.access === "read-only"), N = c(() => !!o.row.retired_at || o.row.state === "retired"), E = ["tasks", "transcript", "terminal", "file-feed", "processes", "reports", "memories"], A = c(() => (N.value ? x.tabs.filter((u) => ["reports", "transcript", "memories"].includes(u.key)) : q.value ? x.tabs.filter((u) => ["reports", "transcript", "terminal", "processes", "memories"].includes(u.key)) : [...x.tabs]).sort((u, d) => (E.indexOf(u.key) < 0 ? E.length : E.indexOf(u.key)) - (E.indexOf(d.key) < 0 ? E.length : E.indexOf(d.key)))), I = () => q.value || N.value ? A.value.find((y) => y.key === "transcript") : A.value[0], W = V(I());
    ve(W, (y) => {
      x.state.tab = (y == null ? void 0 : y.key) ?? "";
    }, { immediate: !0 }), Ce(() => {
      x.state.tab = "";
    }), ve(A, (y) => {
      y.some((u) => {
        var d;
        return u.key === ((d = W.value) == null ? void 0 : d.key);
      }) || (W.value = y[0]);
    }), ve(() => o.open, (y) => {
      y && (W.value = I());
    });
    const Y = Object.fromEntries(x.tabs.filter((y) => y.component).map((y) => [y.key, Xe(() => rt(y.component))])), J = V(!1), { data: X } = x.props.tool, oe = c(() => {
      var y;
      return ((y = X.value) == null ? void 0 : y.tool) ?? "";
    }), U = c(() => {
      var y;
      return ((y = X.value) == null ? void 0 : y.note) ?? "";
    }), _ = c(() => o.row.role !== "main" && (!o.row.ended_at || o.stoppedWithWork || o.waitReason));
    async function M() {
      !o.open || !_.value || (x.state["tool.agent"] = String(o.row.number), await x.reload("tool"));
    }
    const m = it(M, dt.agentCommand), P = x.follow(["hook_call.*", "process_part.*"], (y) => ut(y, "session_agent_id", /* @__PURE__ */ new Set([o.row.id])) && m());
    return Ce(() => P == null ? void 0 : P()), ve(() => o.open, (y) => {
      y && M();
    }, { immediate: !0 }), (y, u) => {
      var d;
      return n(), l("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: u[2] || (u[2] = te(() => {
        }, ["stop"]))
      }, [
        p(Wt, { row: e.row }, null, 8, ["row"]),
        e.row.retirement_reason ? (n(), l("p", Jt, "Retirement reason: " + g(e.row.retirement_reason), 1)) : v("", !0),
        e.row.resume_reason ? (n(), l("p", Kt, g(e.row.resume_reason), 1)) : v("", !0),
        _.value ? (n(), z(jt, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: oe.value,
          note: U.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : v("", !0),
        s.value ? (n(), l("p", Zt, g(s.value), 1)) : v("", !0),
        p(r(ct), {
          class: "agent-tabs",
          tabs: A.value,
          active: W.value,
          answer: { tasks: e.tasks.length, reports: e.row.report_count ?? r(D).length, memories: e.row.memory_count ?? 0 },
          onChoose: u[0] || (u[0] = (B) => W.value = B)
        }, null, 8, ["tabs", "active", "answer"]),
        p(r(gt), {
          class: "agent-tab-body",
          tab: W.value,
          "data-agent-tab-body": (d = W.value) == null ? void 0 : d.key
        }, {
          default: f(() => {
            var B;
            return [
              p(r(Ke), {
                value: (B = W.value) == null ? void 0 : B.key
              }, et({
                reports: f(() => [
                  r(D).length ? v("", !0) : (n(), z(r(Ee), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: f(() => [...u[3] || (u[3] = [
                      h("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (n(!0), l(F, null, ne(r(D), (H) => (n(), l("button", {
                    key: H.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${H.id}`,
                    onClick: (R) => r(we)(`messages:${H.id}`)
                  }, g(H.text), 9, _t))), 128))
                ]),
                tasks: f(() => {
                  var H;
                  return [
                    e.tasks.length ? v("", !0) : (n(), z(r(Ee), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: f(() => [...u[4] || (u[4] = [
                        h("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (n(!0), l(F, null, ne(i.value, (R) => (n(), z(Gt, {
                      key: R.state,
                      section: R,
                      open: $(R.state),
                      onToggle: (L) => T(R.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (H = e.facts) != null && H.instruction ? (n(), l(F, { key: 1 }, [
                      u[5] || (u[5] = b("p", { class: "agent-label" }, "Instruction", -1)),
                      b("div", Yt, g(e.facts.instruction), 1)
                    ], 64)) : v("", !0)
                  ];
                }),
                transcript: f(() => {
                  var H;
                  return [
                    q.value ? (n(), l(F, { key: 0 }, [
                      (H = e.facts) != null && H.instruction ? (n(), l("div", Qt, [
                        p(r(Je), {
                          label: "Instruction",
                          open: J.value,
                          "data-agent-section": "instruction",
                          onToggle: u[1] || (u[1] = (R) => J.value = !J.value)
                        }, {
                          default: f(() => [
                            b("div", Xt, g(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (n(), l("p", ea, "No job recorded")) : v("", !0)
                    ], 64)) : v("", !0),
                    p(xt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                ne(r(Y), (H, R) => ({
                  name: R,
                  fn: f(() => [
                    (n(), z(tt(H), {
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
}, na = /* @__PURE__ */ Z(aa, [["__scopeId", "data-v-f4cc6490"]]), oa = { class: "action-buttons" }, sa = {
  __name: "AgentDriverForm",
  props: { program: String, model: String, pending: Boolean },
  emits: ["submit", "cancel", "update:program", "update:model"],
  setup(e) {
    return (o, t) => (n(), l("form", {
      "data-agent-driver-form": "",
      onSubmit: t[3] || (t[3] = te((s) => o.$emit("submit"), ["prevent"]))
    }, [
      t[6] || (t[6] = b("p", null, "Starts the next session on this program; the agent keeps its number and memories.", -1)),
      p(r(Ne), {
        "model-value": e.program,
        label: "Program",
        disabled: e.pending,
        "data-agent-driver-program": "",
        "onUpdate:modelValue": t[0] || (t[0] = (s) => o.$emit("update:program", s))
      }, null, 8, ["model-value", "disabled"]),
      p(r(Ne), {
        "model-value": e.model,
        label: "Model",
        disabled: e.pending,
        "data-agent-driver-model": "",
        "onUpdate:modelValue": t[1] || (t[1] = (s) => o.$emit("update:model", s))
      }, null, 8, ["model-value", "disabled"]),
      b("div", oa, [
        p(r(Q), {
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
        p(r(Q), {
          small: "",
          disabled: e.pending,
          onClick: t[2] || (t[2] = (s) => o.$emit("cancel"))
        }, {
          default: f(() => [...t[5] || (t[5] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, la = /* @__PURE__ */ Z(sa, [["__scopeId", "data-v-c138a4da"]]), ra = { class: "action-field" }, ia = ["value", "disabled"], da = ["value"], ua = { key: 1 }, ca = {
  key: 1,
  class: "action-field"
}, ga = { class: "action-buttons" }, va = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (o, t) => (n(), l("form", {
      onSubmit: t[4] || (t[4] = te((s) => o.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (n(), l(F, { key: 0 }, [
        b("label", ra, [
          t[6] || (t[6] = h("Task ", -1)),
          b("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: t[0] || (t[0] = (s) => o.$emit("update:task", s.target.value))
          }, [
            t[5] || (t[5] = b("option", { value: "" }, "Choose an open task", -1)),
            (n(!0), l(F, null, ne(e.tasks, (s) => (n(), l("option", {
              key: s.id,
              value: String(s.id)
            }, g(s.id) + ": " + g(s.title), 9, da))), 128))
          ], 40, ia)
        ]),
        e.moreTasks ? (n(), z(r(Q), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: t[1] || (t[1] = (s) => o.$emit("more"))
        }, {
          default: f(() => [...t[7] || (t[7] = [
            h("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : v("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (n(), l("p", ua, "No open tasks.")) : v("", !0)
      ], 64)) : (n(), l("label", ca, [
        t[8] || (t[8] = h("Job", -1)),
        p(r(vt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (s) => o.$emit("update:text", s.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      b("div", ga, [
        p(r(Q), {
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
        p(r(Q), {
          small: "",
          disabled: e.pending,
          onClick: t[3] || (t[3] = (s) => o.$emit("cancel"))
        }, {
          default: f(() => [...t[10] || (t[10] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ma = /* @__PURE__ */ Z(va, [["__scopeId", "data-v-adde4158"]]), pa = { class: "action-buttons" }, ha = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (o, t) => (n(), l("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = te((s) => o.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = b("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      p(r(Ne), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (s) => o.$emit("update:reason", s))
      }, null, 8, ["model-value", "disabled"]),
      b("div", pa, [
        p(r(Q), {
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
        p(r(Q), {
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (s) => o.$emit("cancel"))
        }, {
          default: f(() => [...t[4] || (t[4] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, fa = /* @__PURE__ */ Z(ha, [["__scopeId", "data-v-92de7dd6"]]), ba = {
  class: "session-history",
  "data-agent-session-history": ""
}, ka = { key: 0 }, ya = { key: 0 }, wa = { "data-agent-session-state": "" }, Ma = { class: "action-buttons" }, $a = {
  __name: "AgentSessionHistory",
  props: { sessions: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e) {
    return (o, t) => (n(), l("div", ba, [
      e.sessions.length ? v("", !0) : (n(), l("p", ka, "This agent has no session in its history.")),
      b("ol", null, [
        (n(!0), l(F, null, ne(e.sessions, (s) => (n(), l("li", {
          key: s.session,
          "data-agent-session": ""
        }, [
          b("span", null, g([s.program, s.model].filter(Boolean).join(" ")), 1),
          s.started_at ? (n(), l("span", ya, [
            t[1] || (t[1] = h("Started ", -1)),
            p(r(Ie), {
              at: s.started_at
            }, null, 8, ["at"])
          ])) : v("", !0),
          b("span", wa, g(s.end_reason ? `Ended: ${s.end_reason.replaceAll("_", " ")}` : s.started_at ? "Running" : "Not started"), 1),
          b("code", null, g(s.session), 1)
        ]))), 128))
      ]),
      b("div", Ma, [
        p(r(Q), {
          small: "",
          onClick: t[0] || (t[0] = (s) => o.$emit("close"))
        }, {
          default: f(() => [...t[2] || (t[2] = [
            h("Close", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, xa = /* @__PURE__ */ Z($a, [["__scopeId", "data-v-0d688bd9"]]), Sa = { class: "action-buttons" }, Ca = {
  key: 0,
  role: "alert"
}, Aa = {
  key: 1,
  role: "status"
}, ja = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 }, held: { type: Boolean, default: !1 } },
  setup(e) {
    const o = e, t = Oe(), s = V(""), i = V(""), a = V(""), k = V(""), $ = V(""), T = V(""), x = V([]), D = V(0), q = V(!1), N = V(!1), E = V(!1), A = V(""), I = V(""), W = V([]), Y = c(() => !!o.row.retired_at || o.row.state === "retired"), J = c(() => !Y.value && !!o.row.ended_at), X = c(() => {
      var R;
      return J.value && ((R = o.row.job_command) == null ? void 0 : R.length) && !o.row.resume_reason;
    }), oe = c(() => X.value && !N.value && (o.row.job_task_flag ? x.value.some((R) => String(R.id) === T.value) : !!i.value.trim()));
    function U(R) {
      s.value = R, i.value = "", a.value = "", T.value = "", A.value = "", I.value = "";
    }
    async function _() {
      U("job"), o.row.job_task_flag && (x.value = [], D.value = 0, q.value = !1, await M());
    }
    async function M() {
      if (!N.value) {
        N.value = !0;
        try {
          t.state["jobs.page"] = String(D.value + 1), await t.reload("jobs");
          const R = t.props.jobs;
          A.value = R.failure.value, A.value || (x.value = [...x.value, ...R.rows.value], D.value = R.data.value.page, q.value = R.more.value);
        } finally {
          N.value = !1;
        }
      }
    }
    async function m() {
      await P(["process", "lift-hold", String(o.row.number)], "Hold lifted.");
    }
    async function P(R, L) {
      if (!E.value) {
        E.value = !0, A.value = "";
        try {
          const le = await t.run(R);
          A.value = le.ok ? "" : le.error, le.ok && (U(""), I.value = L);
        } finally {
          E.value = !1;
        }
      }
    }
    async function y() {
      if (!oe.value) return;
      const R = o.row.job_task_flag ? [o.row.job_task_flag, T.value] : [i.value.trim()];
      await P([...o.row.job_command, String(o.row.number), ...R], "Job sent.");
    }
    async function u() {
      if (!E.value) {
        E.value = !0;
        try {
          const R = await t.run(["agent", "sessions", String(o.row.number)]);
          U(R.ok ? "history" : ""), A.value = R.ok ? "" : R.error, W.value = R.ok ? R.value.rows : [];
        } finally {
          E.value = !1;
        }
      }
    }
    function d() {
      U("driver"), k.value = o.row.program || "", $.value = "";
    }
    async function B() {
      !J.value || s.value !== "driver" || !k.value.trim() || !$.value.trim() || await P(["agent", "driver", String(o.row.number), "--program", k.value.trim(), "--model", $.value.trim()], "Driver changed.");
    }
    async function H() {
      !J.value || s.value !== "retire" || !a.value.trim() || await P(["agent", "retire", String(o.row.number), "--reason", a.value.trim()], "Agent retired permanently.");
    }
    return (R, L) => {
      var le;
      return n(), l("div", {
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: L[10] || (L[10] = te(() => {
        }, ["stop"])),
        onKeydown: L[11] || (L[11] = te(() => {
        }, ["stop"]))
      }, [
        b("div", Sa, [
          p(r(Q), {
            small: "",
            "data-agent-history": "",
            disabled: E.value || N.value,
            onClick: u
          }, {
            default: f(() => [...L[12] || (L[12] = [
              h("Session history", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          e.held ? (n(), z(r(Q), {
            key: 0,
            small: "",
            "data-agent-lift-hold": "",
            disabled: E.value,
            onClick: m
          }, {
            default: f(() => [...L[13] || (L[13] = [
              h("Lift this hold", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])) : v("", !0),
          J.value ? (n(), l(F, { key: 1 }, [
            (le = e.row.job_command) != null && le.length ? (n(), z(r(Q), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: E.value || N.value || !X.value,
              onClick: _
            }, {
              default: f(() => [...L[14] || (L[14] = [
                h("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : v("", !0),
            e.row.role !== "main" ? (n(), z(r(Q), {
              key: 1,
              small: "",
              "data-agent-driver": "",
              disabled: E.value || N.value,
              onClick: d
            }, {
              default: f(() => [...L[15] || (L[15] = [
                h("Change driver", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : v("", !0),
            e.row.role !== "main" ? (n(), z(r(Q), {
              key: 2,
              small: "",
              "data-agent-retire": "",
              disabled: E.value || N.value,
              onClick: L[0] || (L[0] = (K) => U("retire"))
            }, {
              default: f(() => [...L[16] || (L[16] = [
                h("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : v("", !0)
          ], 64)) : v("", !0)
        ]),
        p(r(Ke), { value: s.value }, {
          job: f(() => [
            p(ma, {
              task: T.value,
              "onUpdate:task": L[1] || (L[1] = (K) => T.value = K),
              text: i.value,
              "onUpdate:text": L[2] || (L[2] = (K) => i.value = K),
              row: e.row,
              tasks: x.value,
              pending: E.value,
              loading: N.value,
              "more-tasks": q.value,
              failure: A.value,
              "job-ready": oe.value,
              onSubmit: y,
              onMore: M,
              onCancel: L[3] || (L[3] = (K) => U(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          driver: f(() => [
            p(la, {
              program: k.value,
              "onUpdate:program": L[4] || (L[4] = (K) => k.value = K),
              model: $.value,
              "onUpdate:model": L[5] || (L[5] = (K) => $.value = K),
              pending: E.value,
              onSubmit: B,
              onCancel: L[6] || (L[6] = (K) => U(""))
            }, null, 8, ["program", "model", "pending"])
          ]),
          history: f(() => [
            p(xa, {
              sessions: W.value,
              onClose: L[7] || (L[7] = (K) => U(""))
            }, null, 8, ["sessions"])
          ]),
          retire: f(() => [
            p(fa, {
              reason: a.value,
              "onUpdate:reason": L[8] || (L[8] = (K) => a.value = K),
              pending: E.value,
              onSubmit: H,
              onCancel: L[9] || (L[9] = (K) => U(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        A.value ? (n(), l("p", Ca, g(A.value), 1)) : v("", !0),
        I.value ? (n(), l("p", Aa, g(I.value), 1)) : v("", !0)
      ], 32);
    };
  }
}, Ta = /* @__PURE__ */ Z(ja, [["__scopeId", "data-v-4e3619f8"]]), La = { class: "line" }, Ra = {
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
    const o = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, s = c(() => o.has(t.state)), i = c(() => [t.doing, t.since, t.seen].filter(Boolean).join(". "));
    return (a, k) => (n(), z(r(xe), {
      as: "button",
      place: "corner",
      class: ue(["agent-dot", { pulse: s.value }]),
      "data-state": e.state,
      "aria-label": i.value,
      "data-agent-status": "",
      onClick: k[0] || (k[0] = te(() => {
      }, ["stop"]))
    }, {
      tip: f(() => [
        b("b", La, g(e.doing), 1),
        e.since ? (n(), l("span", Ra, g(e.since), 1)) : v("", !0),
        e.seen ? (n(), l("span", Ba, g(e.seen), 1)) : v("", !0)
      ]),
      default: f(() => [
        k[1] || (k[1] = b("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, Oa = /* @__PURE__ */ Z(Ia, [["__scopeId", "data-v-1a0bc478"]]), Va = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, Ha = (e) => e.filter((o) => o.state !== "cancelled"), Ue = (e, o) => e.filter((t) => t.state === o).length;
function za({ tasks: e, inHand: o, perHour: t }) {
  const s = Ha(e), i = Ue(s, "completed"), a = Va[o == null ? void 0 : o.state], k = s.filter((D) => D.state === "started").map((D) => ({ number: D.id, title: D.title })), $ = Math.max(k.length, o && o.state !== "completed" ? 1 : 0), T = s.length - i - $, x = i === s.length;
  return {
    number: o.id,
    title: o.title,
    started: k,
    plan: o.plan_id ?? 0,
    count: `${i} of ${s.length}`,
    taskTip: `${i} of its ${s.length} tasks done${a ? `. This one is ${a.words}.` : "."}`,
    countTip: x ? `All ${s.length} tasks done` : `${i} done, ${$} in hand, ${T} to go`,
    paceTip: !x && t ? `About ${t} an hour.` : "",
    rate: !x && t ? `${Math.round(t)}/hour` : "",
    bar: { total: s.length, done: i, testing: Ue(s, "testing") }
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
    const o = e, t = c(() => o.inHand ? za({ tasks: o.tasks, inHand: o.inHand, perHour: o.perHour }) : null);
    return (s, i) => e.job && !t.value ? (n(), l("span", Ea, [
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
      e.jobLaunch ? (n(), l("span", Na, g(e.jobLaunch), 1)) : v("", !0)
    ])) : t.value ? (n(), l(F, { key: 1 }, [
      b("span", Wa, [
        t.value.started.length > 1 ? (n(), l("span", Da, [
          i[1] || (i[1] = h("Tasks ", -1)),
          (n(!0), l(F, null, ne(t.value.started, (a, k) => (n(), l(F, {
            key: a.number
          }, [
            k ? (n(), l(F, { key: 0 }, [
              h(", ")
            ], 64)) : v("", !0),
            p(r(xe), {
              as: "button",
              class: "task",
              "data-agent-task": "",
              "data-peek": `tasks:${a.number}`,
              "aria-label": `Task ${a.number}: ${a.title}`,
              onClick: te(($) => r(we)(`tasks:${a.number}`), ["stop"])
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
          onClick: i[0] || (i[0] = te((a) => r(we)(`tasks:${t.value.number}`), ["stop"]))
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
        t.value.plan ? (n(), l("span", qa, "Plan " + g(t.value.plan), 1)) : v("", !0),
        t.value.rate ? (n(), l("span", Fa, g(t.value.rate), 1)) : v("", !0),
        p(r(xe), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: f(() => [
            b("b", null, g(t.value.countTip), 1),
            t.value.paceTip ? (n(), l("span", Ua, g(t.value.paceTip), 1)) : v("", !0)
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
    ], 64)) : v("", !0);
  }
}, Ga = /* @__PURE__ */ Z(Pa, [["__scopeId", "data-v-e59affa8"]]), Ja = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Ka = ["data-icon", "stroke-width", "innerHTML"], ae = {
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
      class: ue(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (n(), l("span", Za, g(e.checked ? "✓" : ""), 1)) : v("", !0),
      e.description ? (n(), l("span", _a, [
        b("span", null, [
          Ae(o.$slots, "default", {}, void 0, !0)
        ]),
        b("small", null, g(e.description), 1)
      ])) : Ae(o.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ye = /* @__PURE__ */ Z(Ya, [["__scopeId", "data-v-fec99974"]]), Qa = {}, Xa = { class: "menu-label" };
function en(e, o) {
  return n(), l("span", Xa, [
    Ae(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Se = /* @__PURE__ */ Z(Qa, [["render", en], ["__scopeId", "data-v-aa955b3e"]]), tn = {
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
    const t = e, s = o, i = c(() => t.skills.filter((k) => k.state === "loaded")), a = c(() => t.skills.filter((k) => k.state !== "loaded"));
    return (k, $) => (n(), l("div", tn, [
      p(Se, null, {
        default: f(() => [...$[1] || ($[1] = [
          h("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      i.value.length ? v("", !0) : (n(), l("p", an, "None yet. Compacting the conversation empties this list.")),
      (n(!0), l(F, null, ne(i.value, (T) => (n(), l("p", {
        key: T.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        p(ae, {
          name: "book",
          size: 12
        }),
        h(g(T.skill), 1)
      ]))), 128)),
      a.value.length ? (n(), l(F, { key: 1 }, [
        p(Se, null, {
          default: f(() => [...$[2] || ($[2] = [
            h("Still to read", -1)
          ])]),
          _: 1
        }),
        (n(!0), l(F, null, ne(a.value, (T) => (n(), l("p", {
          key: T.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          p(ae, {
            name: "book",
            size: 12
          }),
          h(g(T.skill), 1)
        ]))), 128))
      ], 64)) : v("", !0),
      p(ye, {
        "data-agent-skills-browse": "",
        onClick: $[0] || ($[0] = (T) => s("browse"))
      }, {
        default: f(() => [...$[3] || ($[3] = [
          h("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, on = /* @__PURE__ */ Z(nn, [["__scopeId", "data-v-be514d47"]]), sn = ["disabled", "title"], ln = { class: "gauge usage" }, rn = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: o }) {
    const t = e, s = o, i = c(() => t.windows[0] ?? null), a = c(() => i.value && Number.isFinite(i.value.used_percent) ? Math.max(0, Math.min(100, Math.round(i.value.used_percent))) : null), k = c(() => a.value !== null && a.value >= 100), $ = c(() => {
      var x;
      return (x = i.value) != null && x.reset_epoch_seconds ? new Date(i.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), T = c(() => k.value ? `At usage limit: the plan's ${i.value.title} allowance is used up${$.value ? `, starts again ${$.value}` : ""}` : `${a.value}% of the plan's ${i.value.title} allowance used${$.value ? `, starts again ${$.value}` : ""}`);
    return (x, D) => a.value !== null ? (n(), l("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: T.value,
      onClick: D[0] || (D[0] = (q) => s("open", q.currentTarget))
    }, [
      p(ae, {
        name: "allowance",
        size: 12
      }),
      D[1] || (D[1] = h()),
      b("span", ln, [
        b("span", {
          style: Be({ width: `${a.value}%` })
        }, null, 4)
      ]),
      h(" " + g(k.value ? "At usage limit" : `${a.value}%`), 1)
    ], 8, sn)) : v("", !0);
  }
}, dn = /* @__PURE__ */ Z(rn, [["__scopeId", "data-v-a36f09dc"]]), un = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (o, t) => (n(), l("span", {
      class: ue(["badge", e.tone])
    }, g(e.text), 3));
  }
}, cn = /* @__PURE__ */ Z(un, [["__scopeId", "data-v-9e7e1157"]]), gn = (e, o, t) => Math.max(o, Math.min(t, e)), _e = /* @__PURE__ */ new WeakMap(), vn = (e, o) => _e.set(e, o);
function mn(e, o) {
  for (let t = o; t; t = _e.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function pn(e, o) {
  const t = (s) => {
    var a, k;
    const i = ((a = e.value) == null ? void 0 : a.element) || ((k = e.value) == null ? void 0 : k.$el) || e.value;
    i && !mn(i, s.target) && o(s);
  };
  window.addEventListener("click", t), Ce(() => window.removeEventListener("click", t));
}
const ke = 8, hn = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, i = V(null), a = (d) => d ? `${d}px` : void 0, k = c(() => ({
      minWidth: a(s.minWidth),
      maxWidth: a(s.maxWidth),
      maxHeight: a(s.maxHeight),
      height: a(s.height)
    })), $ = V({ w: 0, h: 0 }), T = V(s.anchor ? s.anchor.getBoundingClientRect() : null), x = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), D = (d) => ({
      left: Math.max(0, d.left),
      top: Math.max(0, d.top),
      right: Math.min(window.innerWidth, d.right),
      bottom: Math.min(window.innerHeight, d.bottom)
    }), q = (d) => {
      const B = d.closest(".pane, .float-window");
      return B ? D(B.getBoundingClientRect()) : x();
    }, N = (d, B) => `${Math.max(0, d ? Math.min(d, B) : B)}px`;
    function E(d, B) {
      return {
        below: d.bottom - B.bottom - s.gap - ke,
        above: B.top - d.top - s.gap - ke,
        across: d.right - d.left - 2 * ke
      };
    }
    function A(d) {
      const B = q(s.anchor), H = E(B, d);
      return $.value.w <= H.across && $.value.h <= Math.max(H.below, H.above) ? B : x();
    }
    const I = c(() => {
      if (!T.value) return k.value;
      const d = T.value, B = A(d), H = E(B, d), { w: R, h: L } = $.value, le = s.align === "auto" ? d.left + d.right > B.left + B.right : s.align === "right", K = gn(le ? d.right - R : d.left, B.left + ke, Math.max(B.left + ke, B.right - R - ke)), ee = L > H.below && H.above > H.below ? { bottom: `${window.innerHeight - d.top + s.gap}px`, maxHeight: N(s.maxHeight, H.above) } : { top: `${d.bottom + s.gap}px`, maxHeight: N(s.maxHeight, H.below) };
      return { ...k.value, ...ee, left: `${K}px`, maxWidth: N(s.maxWidth, H.across) };
    }), W = t, Y = () => [...i.value.querySelectorAll("button:not(:disabled)")];
    function J(d) {
      const B = Y(), H = B.indexOf(document.activeElement);
      B[(H + d + B.length) % B.length].focus();
    }
    const X = { ArrowDown: () => J(1), ArrowUp: () => J(-1), Escape: () => W("close") }, oe = (d) => X[d.key] && (d.preventDefault(), X[d.key]()), U = () => i.value && ($.value = { w: i.value.offsetWidth, h: i.value.scrollHeight });
    let _ = 0;
    const M = new ResizeObserver(() => {
      cancelAnimationFrame(_), _ = requestAnimationFrame(U);
    });
    pn(i, (d) => s.anchor && !s.anchor.contains(d.target) && W("close"));
    const m = (d, B) => ["top", "left", "right", "bottom"].some((H) => Math.abs(d[H] - B[H]) > 1), P = (d) => d.bottom < 0 || d.top > window.innerHeight;
    let y = 0;
    function u() {
      if (s.anchor) {
        const d = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || P(d)) return W("close");
        m(d, T.value) && (T.value = d);
      }
      y = requestAnimationFrame(u);
    }
    return at(() => {
      s.anchor && i.value && vn(i.value, s.anchor), U(), i.value && M.observe(i.value), !s.plain && Y()[0] && Y()[0].focus(), u();
    }), Ce(() => {
      M.disconnect(), cancelAnimationFrame(y), cancelAnimationFrame(_);
    }), o({ element: i }), (d, B) => (n(), z(nt, {
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
}), fn = /* @__PURE__ */ Z(hn, [["__scopeId", "data-v-3d203970"]]);
async function bn(e, o, t) {
  if (!e) return t(o);
  const { target: s, fields: i } = e, a = Object.fromEntries(Object.keys(i).map((T) => [T, s[T]])), k = () => Object.assign(s, a);
  Object.assign(s, i);
  let $ = !1;
  try {
    const T = await t(o);
    return $ = T.ok, T;
  } finally {
    $ || k();
  }
}
function kn(e, o, t, { groups: s, programs: i }) {
  const a = V({}), k = V(""), $ = V(!1), T = c(() => !!e.value && !e.value.ended_at), x = c(() => T.value && !!e.value.paused_at);
  async function D(A, I = null) {
    k.value = "";
    const W = await bn(I, A, o);
    return k.value = W.ok ? "" : W.error, t(), W;
  }
  return { groups: s, programs: i, chosen: a, failure: k, asking: $, running: T, paused: x, choose: (A, I) => D(["agent", "control", String(e.value.number), A, I.value], { target: a, fields: { value: { ...a.value, [A]: I.label } } }), stop: () => ($.value = !1, D(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (A) => D(["agent", "launch", A.name]) };
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
}, On = { class: "gauge" }, Vn = { class: "context-used" }, Hn = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, zn = {
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
  setup(e, { emit: o }) {
    const t = e, s = o, i = kn(Ve(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => s("changed"), { groups: Ve(t, "controlGroups"), programs: Ve(t, "agentPrograms") }), a = V(null), k = V(""), $ = c(() => i.groups.value.find((M) => M.key === k.value));
    function T(M, m) {
      a.value = M.currentTarget, k.value = m;
    }
    function x() {
      a.value = null, k.value = "", i.asking.value = !1;
    }
    const D = c(() => t.skills.filter((M) => M.state === "loaded"));
    function q(M) {
      T(M, "skills"), s("skills");
    }
    const N = (M) => i.groups.value.some((m) => m.key === M), E = c(() => {
      var M;
      return i.chosen.value.model ?? ((M = I.value) == null ? void 0 : M.model) ?? "";
    }), A = c(() => {
      var M;
      return i.chosen.value.effort ?? ((M = I.value) == null ? void 0 : M.effort) ?? "";
    });
    c(() => !!t.agent && !t.agent.ended_at);
    const I = c(() => {
      var M;
      return ((M = t.usage.agents) == null ? void 0 : M.find((m) => {
        var P;
        return m.id === ((P = t.agent) == null ? void 0 : P.id);
      })) ?? null;
    }), W = c(() => {
      var M;
      return ((M = I.value) == null ? void 0 : M.context_percent) == null ? null : Math.round(I.value.context_percent);
    }), Y = c(() => {
      var M;
      return Mn(((M = I.value) == null ? void 0 : M.context_change) ?? null);
    }), J = (M) => `${Math.round(M / 1e3)}k`, X = c(() => {
      var M;
      return !!((M = I.value) != null && M.context_limit_tokens);
    }), oe = c(() => {
      var M, m;
      return ((M = I.value) == null ? void 0 : M.context_limit_tokens) || ((m = I.value) == null ? void 0 : m.context_window_tokens) || 0;
    }), U = c(() => oe.value ? `${J(I.value.context_tokens ?? 0)} of ${J(oe.value)}` : ""), _ = c(() => {
      var M;
      return (M = I.value) != null && M.cost_dollars ? `$${I.value.cost_dollars.toFixed(2)}` : "";
    });
    return (M, m) => {
      var P, y;
      return n(), l("div", {
        class: ue(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (n(), l(F, { key: 0 }, [
          b("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: m[0] || (m[0] = (u) => T(u, "agent"))
          }, [
            p(ae, {
              name: "agents",
              size: 12
            }),
            h(" " + g(((P = e.agentPrograms.find((u) => u.name === e.agent.program)) == null ? void 0 : P.title) || e.agent.program), 1)
          ], 8, $n),
          p(dn, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: m[1] || (m[1] = (u) => s("open", "usage", u))
          }, null, 8, ["windows", "disabled"]),
          W.value !== null ? (n(), l("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${W.value}% full: clear or compact it`,
            onClick: m[2] || (m[2] = (u) => N("context") ? T(u, "context") : s("open", "context", u.currentTarget))
          }, [
            p(ae, {
              name: "gauge",
              size: 12
            }),
            m[14] || (m[14] = h()),
            b("span", Sn, [
              b("span", {
                style: Be({ width: `${W.value}%` })
              }, null, 4)
            ]),
            h(" " + g(W.value) + "% ", 1)
          ], 8, xn)) : (y = I.value) != null && y.context_unknown ? (n(), l("span", Cn, [
            p(ae, {
              name: "gauge",
              size: 12
            }),
            m[15] || (m[15] = h(" Context: unknown", -1))
          ])) : v("", !0),
          E.value ? (n(), l("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${E.value}: change the model`,
            onClick: m[3] || (m[3] = (u) => N("model") ? T(u, "model") : null)
          }, [
            p(ae, {
              name: "model",
              size: 12
            }),
            h(" " + g(E.value), 1)
          ], 8, An)) : v("", !0),
          N("effort") || e.card && A.value ? (n(), l("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: m[4] || (m[4] = (u) => T(u, "effort"))
          }, [
            p(ae, {
              name: "bolt",
              size: 12
            }),
            h(" " + g(A.value), 1)
          ], 8, jn)) : v("", !0),
          _.value ? (n(), l("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: m[5] || (m[5] = (u) => s("open", "cost", u.currentTarget))
          }, g(_.value), 9, Tn)) : v("", !0),
          e.branch ? (n(), l("span", Ln, [
            p(ae, {
              name: "branch",
              size: 12
            }),
            h(" " + g(e.branch), 1)
          ])) : v("", !0),
          e.card ? v("", !0) : (n(), l("button", {
            key: 6,
            type: "button",
            class: ue(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: m[6] || (m[6] = (u) => s("open", "jobs", u.currentTarget))
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
            onClick: q
          }, [
            p(ae, {
              name: "book",
              size: 12
            }),
            h(" " + g(D.value.length), 1)
          ])) : v("", !0),
          e.fitness ? (n(), l(F, { key: 8 }, [
            b("button", {
              type: "button",
              class: ue(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < En }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: m[7] || (m[7] = (u) => s("open", "fitness", u.currentTarget))
            }, [
              p(ae, {
                name: "heart",
                size: 12
              }),
              h(" " + g(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            b("button", {
              type: "button",
              class: ue(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: m[8] || (m[8] = (u) => s("open", "load", u.currentTarget))
            }, [
              p(ae, {
                name: "weight",
                size: 12
              }),
              h(" " + g(e.fitness.workload), 1)
            ], 2)
          ], 64)) : v("", !0)
        ], 64)) : e.run && !e.loading ? (n(), l("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: m[9] || (m[9] = (u) => T(u, "start"))
        }, [
          p(ae, {
            name: "agents",
            size: 12
          }),
          m[16] || (m[16] = h(" Start an agent", -1))
        ])) : v("", !0),
        m[22] || (m[22] = b("span", { class: "space" }, null, -1)),
        r(i).failure.value ? (n(), l("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: r(i).failure.value
        }, g(r(i).failure.value), 9, Rn)) : v("", !0),
        Ae(M.$slots, "default", {}, void 0, !0),
        a.value ? (n(), z(fn, {
          key: 3,
          anchor: a.value,
          "min-width": 190,
          onClose: x
        }, {
          default: f(() => {
            var u;
            return [
              k.value === "agent" ? (n(), l(F, { key: 0 }, [
                r(i).asking.value ? (n(), l(F, { key: 0 }, [
                  p(Se, { "data-agent-stop-ask": "" }, {
                    default: f(() => [...m[17] || (m[17] = [
                      h("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  p(ye, {
                    "data-agent-stop-confirm": "",
                    onClick: m[10] || (m[10] = (d) => (x(), r(i).stop()))
                  }, {
                    default: f(() => [...m[18] || (m[18] = [
                      h("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  p(ye, {
                    onClick: m[11] || (m[11] = (d) => r(i).asking.value = !1)
                  }, {
                    default: f(() => [...m[19] || (m[19] = [
                      h("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (n(), z(ye, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: m[12] || (m[12] = (d) => r(i).asking.value = !0)
                }, {
                  default: f(() => [...m[20] || (m[20] = [
                    h("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : k.value === "start" ? (n(), l(F, { key: 1 }, [
                p(Se, null, {
                  default: f(() => [...m[21] || (m[21] = [
                    h("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (n(!0), l(F, null, ne(r(i).programs.value, (d) => (n(), z(ye, {
                  key: d.name,
                  "data-agent-program": d.name,
                  onClick: (B) => (x(), r(i).start(d))
                }, {
                  default: f(() => [
                    h(g(d.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : k.value === "skills" ? (n(), z(on, {
                key: 2,
                skills: e.skills,
                onBrowse: m[13] || (m[13] = (d) => (x(), s("open", "skills", null)))
              }, null, 8, ["skills"])) : $.value ? (n(), l(F, { key: 3 }, [
                p(Se, null, {
                  default: f(() => [
                    h(g($.value.label), 1)
                  ]),
                  _: 1
                }),
                k.value === "context" ? (n(), l(F, { key: 0 }, [
                  b("p", Bn, g(r(yn)(((u = I.value) == null ? void 0 : u.last_compaction) ?? null)), 1),
                  b("div", In, [
                    b("span", On, [
                      b("span", {
                        style: Be({ width: `${W.value}%` })
                      }, null, 4)
                    ]),
                    b("span", Vn, g(W.value) + "%", 1)
                  ]),
                  U.value ? (n(), l("p", Hn, [
                    h(g(U.value) + " ", 1),
                    X.value ? (n(), z(cn, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : v("", !0)
                  ])) : v("", !0)
                ], 64)) : v("", !0),
                k.value === "context" && Y.value ? (n(), l("p", zn, g(Y.value), 1)) : (n(!0), l(F, { key: 2 }, ne($.value.choices, (d) => (n(), z(ye, {
                  key: d.value,
                  "data-agent-choice": d.value,
                  onClick: (B) => (r(i).choose($.value.key, d), x())
                }, {
                  default: f(() => [
                    h(g(d.label), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-choice", "onClick"]))), 128))
              ], 64)) : v("", !0)
            ];
          }),
          _: 1
        }, 8, ["anchor"])) : v("", !0)
      ], 2);
    };
  }
}, Wn = /* @__PURE__ */ Z(Nn, [["__scopeId", "data-v-d7113347"]]), Dn = ["data-agent-open", "aria-expanded", "role", "tabindex"], qn = {
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
}, Zn = {
  class: "agent-live-fact",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, _n = {
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
  setup(e, { emit: o }) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), s = { helper: "Helper", reviewer: "Reviewer", main: "Main agent" }, i = { running: "Working", starting: "Starting", stopping: "Stopping", ended: "Idle: its process has stopped", failed: "Could not start", never_started: "Not started" }, a = e, k = o, $ = Ze(), T = c(() => {
      var S, re;
      if ((S = a.facts) != null && S.profile_title) return a.facts.profile_title;
      if ((re = a.facts) != null && re.profile) return a.facts.profile;
      const w = s[a.row.role] || a.row.role;
      return w.slice(0, 1).toUpperCase() + w.slice(1);
    }), x = c(() => {
      var w;
      return ((w = a.facts) == null ? void 0 : w.tasks) ?? [];
    }), D = c(() => x.value.filter((w) => w.state === "open")), q = c(() => x.value.find((w) => {
      var S;
      return w.id === ((S = a.progress) == null ? void 0 : S.task_id) && w.state === "started";
    })), N = c(() => q.value || x.value.find((w) => {
      var S;
      return w.id === ((S = a.facts) == null ? void 0 : S.task_id);
    }) || x.value.find((w) => t.has(w.state)) || D.value[0] || x.value.at(-1)), E = c(() => {
      var w, S, re, se, me, ce;
      return a.row.role === "helper" ? ((w = a.facts) == null ? void 0 : w.helper_job) || "" : (S = a.facts) != null && S.job_enabled && (((re = q.value) == null ? void 0 : re.title) || ((se = a.facts) == null ? void 0 : se.task_title) || ((me = D.value[0]) == null ? void 0 : me.title) || ((ce = x.value.at(-1)) == null ? void 0 : ce.title)) || "";
    }), A = c(() => `${a.row.role} ${a.row.number}`), I = c(() => {
      var w, S;
      return [a.row.program, (w = a.facts) == null ? void 0 : w.model, (S = a.facts) == null ? void 0 : S.effort, A.value].filter(Boolean).join(" · ");
    }), W = c(() => a.row.role === "main" ? T.value : `${T.value} ${a.row.number}`), Y = Oe(), J = c(() => pt(a.row.process_started_at || a.row.created_at, $.value)), X = /* @__PURE__ */ new Set(["open", "started", "testing"]), oe = { fresh: "new conversation", resumed: "resumed" }, U = c(() => {
      var w, S;
      return [(w = a.facts) == null ? void 0 : w.helper_job_program, oe[(S = a.facts) == null ? void 0 : S.occupant_launch]].filter(Boolean).join(", ");
    }), _ = c(() => {
      var w;
      return (w = a.facts) == null ? void 0 : w.work_status;
    }), M = c(() => !!a.row.ended_at && a.row.role !== "main" && x.value.some((w) => X.has(w.state))), m = c(() => {
      var w, S;
      return a.row.state === "running" && ((w = a.facts) == null ? void 0 : w.state) === "at usage limit" && !!((S = a.facts) != null && S.usage_limit_ends_at);
    }), P = (w) => new Date(w).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), y = c(() => a.row.halted_at ? `Stopped at the usage limit since ${P(a.row.halted_at)}, goes on at ${P(a.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(a.facts.usage_limit_ends_at).toLocaleString()}`), u = c(() => {
      var w;
      return a.row.retired_at || a.row.state === "retired" ? "retired" : m.value || _.value || a.waitReason || M.value ? "waiting" : a.row.state === "running" && ((w = a.facts) == null ? void 0 : w.state) || a.row.state;
    }), d = c(() => {
      var w;
      return m.value ? y.value : _.value ? `Status: ${_.value}` : a.waitReason ? `Waiting: ${a.waitReason}` : u.value === "blocked" ? (w = a.facts) != null && w.blocked_reason ? `Blocked: ${a.facts.blocked_reason}` : "Blocked" : M.value ? "Stopped with work left" : "";
    }), B = c(() => {
      var w;
      return ((w = a.progress) == null ? void 0 : w.completed_count) ?? x.value.filter((S) => S.state === "completed").length;
    }), H = c(() => {
      var w;
      return ht(B.value, ((w = a.progress) == null ? void 0 : w.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, $.value);
    }), R = c(() => a.row.role === "main" ? 0 : H.value), L = c(() => !!a.row.retired_at || a.row.state === "retired"), le = c(() => L.value ? "Retired" : u.value === "blocked" || u.value === "waiting" ? d.value || (u.value === "blocked" ? "Blocked" : "Waiting") : i[a.row.standing]), K = c(() => {
      var S;
      if (L.value) return a.row.retired_at;
      const w = u.value === "blocked" || u.value === "waiting";
      return a.row.ended_at || w && ((S = a.facts) == null ? void 0 : S.last_activity) || a.row.process_started_at || a.row.created_at;
    }), Me = c(() => ft(K.value, $.value)), ee = c(() => {
      var w;
      return bt((w = a.facts) == null ? void 0 : w.last_activity, $.value);
    });
    return (w, S) => {
      var re, se, me, ce, ie, $e;
      return n(), l("div", {
        class: ue(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: S[3] || (S[3] = (ge) => !e.open && k("toggle")),
        onKeydown: [
          S[4] || (S[4] = qe(te((ge) => !e.open && k("toggle"), ["self", "prevent"]), ["enter"])),
          S[5] || (S[5] = qe(te((ge) => !e.open && k("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        p(r(kt), {
          "agent-id": e.row.id,
          label: T.value,
          class: "agent-head"
        }, {
          default: f(() => {
            var ge, pe;
            return [
              e.open ? (n(), l("button", {
                key: 0,
                type: "button",
                class: "agent-back",
                title: "Back",
                "aria-label": "Back",
                onClick: S[0] || (S[0] = te((je) => k("toggle"), ["stop"]))
              }, [
                p(r(ze), {
                  name: "chevronRight",
                  facing: "left",
                  size: 14
                })
              ])) : v("", !0),
              b("span", qn, g(e.open ? W.value : T.value), 1),
              b("span", Fn, g(((ge = e.facts) == null ? void 0 : ge.given_name) || e.row.id), 1),
              e.open ? v("", !0) : (n(), z(r(ze), {
                key: 1,
                class: "agent-chevron",
                name: "chevronRight",
                size: 12
              })),
              e.open ? (n(), l("span", Un, [
                p(Ta, {
                  row: e.row,
                  held: u.value === "blocked"
                }, null, 8, ["row", "held"]),
                p(r(Q), {
                  variant: "ghost",
                  small: "",
                  "data-agent-inspector": "",
                  onClick: S[1] || (S[1] = te((je) => r(we)(`agents:${e.row.id}`), ["stop"]))
                }, {
                  default: f(() => [...S[6] || (S[6] = [
                    h("Open inspector", -1)
                  ])]),
                  _: 1
                }),
                e.row.role === "helper" && (!e.row.ended_at || (pe = e.facts) != null && pe.helper_job_open) ? (n(), z(r(Q), {
                  key: 0,
                  variant: "ghost",
                  small: "",
                  "data-helper-stop": "",
                  onClick: S[2] || (S[2] = te((je) => r(Y).run(["helper", "stop", String(e.row.number)]), ["stop"]))
                }, {
                  default: f(() => [
                    h(g(e.row.ended_at ? "End job" : "Stop"), 1)
                  ]),
                  _: 1
                })) : v("", !0)
              ])) : v("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-id", "label"]),
        e.open ? v("", !0) : (n(), l("span", Pn, [
          b("span", Gn, g(I.value), 1),
          (re = e.facts) != null && re.sandbox_off ? (n(), l("span", Jn, "sandbox off")) : v("", !0)
        ])),
        e.open && !L.value ? (n(), z(Wn, {
          key: 1,
          class: "agent-live",
          "agent-programs": r(Y).props.programs.rows.value,
          agent: e.row,
          branch: (se = e.progress) == null ? void 0 : se.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((me = e.facts) == null ? void 0 : me.windows) ?? [] },
          card: ""
        }, {
          default: f(() => {
            var ge, pe;
            return [
              (ge = e.facts) != null && ge.sandbox_off ? (n(), l("span", Kn, "sandbox off")) : v("", !0),
              b("span", Zn, "Run time: " + g(J.value), 1),
              (pe = e.facts) != null && pe.last_activity ? (n(), l("span", _n, [
                S[7] || (S[7] = h("Seen: ", -1)),
                p(r(Ie), {
                  at: e.facts.last_activity
                }, null, 8, ["at"])
              ])) : v("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : v("", !0),
        (ce = e.facts) != null && ce.unit_name ? (n(), l("div", Yn, "Unit: " + g(e.facts.unit_name), 1)) : v("", !0),
        e.open ? v("", !0) : (n(), z(Ga, {
          key: 3,
          tasks: x.value,
          "in-hand": e.row.role !== "helper" && ((ie = e.facts) != null && ie.job_enabled) && N.value || null,
          job: e.row.role === "helper" ? E.value : "",
          "job-title": e.row.role === "helper" && (($e = e.facts) == null ? void 0 : $e.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? U.value : "",
          "per-hour": R.value
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour"])),
        p(Oa, {
          state: u.value,
          doing: le.value,
          since: Me.value,
          seen: ee.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (n(), z(na, {
          key: 4,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: x.value,
          "stopped-with-work": M.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : v("", !0)
      ], 42, Dn);
    };
  }
}, Xn = /* @__PURE__ */ Z(Qn, [["__scopeId", "data-v-9b3303a3"]]), eo = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, to = ["data-agent-row", "data-agent-lingering"], Pe = "journal.agents.filters", Ge = 300 * 1e3, Re = "cubic-bezier(0.2, 0.9, 0.25, 1)", ao = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const o = e, t = Oe(), { rows: s } = t.props.waits, { rows: i } = t.props.progress, { rows: a, failure: k, loaded: $, more: T } = t.props.agents, x = (j) => i.value.find((O) => O.agent_id === j.id) ?? null, D = (j) => {
      var O;
      return ((O = s.value.find((C) => C.agent_id === j.id)) == null ? void 0 : O.reason) ?? "";
    }, q = V("running"), N = V(""), E = JSON.parse(localStorage.getItem(Pe) || '{"roles":[],"profiles":[],"programs":[]}'), A = V(E), I = c(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: W } = t.props.programs, Y = c(() => A.value.roles.length + A.value.profiles.length + A.value.programs.length), J = (j, O) => {
      A.value = $t(A.value, j, O);
    }, X = () => {
      A.value = { roles: [], profiles: [], programs: [] };
    }, oe = (j) => j.slice(0, 1).toUpperCase() + j.slice(1);
    ve(A, (j) => localStorage.setItem(Pe, JSON.stringify(j)));
    const U = V(25);
    function _() {
      Object.assign(t.state, {
        "agents.show": q.value,
        "agents.search": N.value,
        "agents.limit": String(U.value),
        "agents.roles": A.value.roles.join(","),
        "agents.profiles": A.value.profiles.join(","),
        "agents.programs": A.value.programs.join(",")
      });
    }
    async function M() {
      return U.value += 25, _(), await t.reload("agents"), !0;
    }
    ve([q, N, A], () => {
      U.value = 25, _(), t.reload("agents");
    }), _();
    const m = (j) => j.facts ?? null, P = a, y = Ze(), u = V([]), d = c(() => new Set(u.value.filter((j) => y.value - j.left < Ge).map((j) => j.row.id))), B = c(() => u.value.filter((j) => d.value.has(j.row.id)).map((j) => j.row)), H = c(() => [...P.value, ...B.value]);
    let R = "", L = [];
    async function le(j) {
      await t.reload(`card.${j.id}`);
      const O = t.props[`card.${j.id}`].rows.value.find((C) => C.id === j.id);
      O != null && O.ended_at && !u.value.some((C) => C.row.id === j.id) && (u.value = [...u.value, { row: O, left: Date.now() }]);
    }
    ve(a, (j) => {
      const O = R === `${q.value}|${N.value}|${JSON.stringify(A.value)}` && q.value === "running", C = O ? L.filter((G) => !j.some((he) => he.id === G.id)) : [];
      R = `${q.value}|${N.value}|${JSON.stringify(A.value)}`, L = j, u.value = O ? u.value.filter((G) => y.value - G.left < Ge && !j.some((he) => he.id === G.row.id)) : [], C.forEach(le);
    }, { immediate: !0 });
    const K = c(() => !!N.value.trim() || Y.value > 0), Me = c(() => o.texts[q.value] ?? { title: o.empty, hint: "" }), ee = V(null), w = V(null), S = V(null), re = V(null), se = c(() => ee.value === null ? null : t.props[`card.${ee.value}`].rows.value.find((j) => j.id === ee.value) ?? w.value), me = c(() => se.value ? [se.value] : H.value), ce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, ie = V(!1);
    let $e = 0;
    async function ge(j) {
      if (ie.value) return;
      ie.value = !0, $e = re.value.scrollTop;
      const O = S.value.querySelector(`[data-agent-open="${j.id}"]`);
      if (!ce()) {
        const fe = [...S.value.querySelectorAll(".agent-row")].filter((de) => !de.contains(O));
        await Promise.all(fe.map((de) => de.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const C = [...O.querySelectorAll(".agent-head, .agent-line")], G = [...C, ...O.querySelectorAll("[data-agent-motion]")], he = G.map((fe) => fe.getBoundingClientRect());
      if (w.value = j, ee.value = j.id, t.reload(`card.${j.id}`), await Fe(), !ce()) {
        const fe = G.map((de) => de.getBoundingClientRect());
        G.forEach((de, Te) => {
          const be = C.findIndex((De) => De !== de && De.contains(de)), Ye = he[Te].left - fe[Te].left - (be < 0 ? 0 : he[be].left - fe[be].left), Qe = he[Te].top - fe[Te].top - (be < 0 ? 0 : he[be].top - fe[be].top);
          de.animate([{ transform: `translate(${Ye}px, ${Qe}px)` }, { transform: "none" }], { duration: 280, easing: Re });
        }), S.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((de) => {
          de.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Re, fill: "backwards" });
        });
      }
      ie.value = !1;
    }
    async function pe() {
      if (ie.value || !se.value) return;
      ie.value = !0;
      const j = S.value.querySelector(`[data-agent-open="${ee.value}"]`), O = [...j.children], C = ce() ? [] : O.map((G) => G.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(C.map((G) => G.finished)), ee.value = null, await Fe(), re.value.scrollTop = $e, C.forEach((G) => G.cancel()), ce() || (j.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Re }), S.value.querySelectorAll(".agent-row").forEach((G) => {
        G.contains(j) || G.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Re });
      })), ie.value = !1;
    }
    const je = (j) => ee.value === j.id ? pe() : ge(j);
    ve(N, (j) => j.trim() && (ee.value = null)), ve(q, () => {
      ee.value = null;
    });
    const We = (j) => {
      j.key === "Escape" && pe();
    };
    return window.addEventListener("keydown", We), Ce(() => window.removeEventListener("keydown", We)), (j, O) => (n(), l("div", {
      ref_key: "agents",
      ref: S,
      class: ue(["agents", { focused: se.value, "card-changing": ie.value }])
    }, [
      se.value ? v("", !0) : (n(), z(r(yt), {
        key: 0,
        modelValue: N.value,
        "onUpdate:modelValue": O[1] || (O[1] = (C) => N.value = C),
        placeholder: "Search agents",
        "menu-count": Y.value,
        "data-agents-search": ""
      }, {
        menu: f(() => [
          p(r(He), null, {
            default: f(() => [...O[2] || (O[2] = [
              h("Type", -1)
            ])]),
            _: 1
          }),
          (n(!0), l(F, null, ne(I.value.roles, (C) => (n(), z(r(Le), {
            key: C,
            role: "menuitemcheckbox",
            "aria-checked": A.value.roles.includes(C),
            checked: A.value.roles.includes(C),
            "data-filter-role": C,
            onClick: (G) => J("roles", C)
          }, {
            default: f(() => [
              h(g(oe(C)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          I.value.profiles.length ? (n(), z(r(He), { key: 0 }, {
            default: f(() => [...O[3] || (O[3] = [
              h("Profile", -1)
            ])]),
            _: 1
          })) : v("", !0),
          (n(!0), l(F, null, ne(I.value.profiles, (C) => (n(), z(r(Le), {
            key: C.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.profiles.includes(C.name),
            checked: A.value.profiles.includes(C.name),
            "data-filter-profile": C.name,
            onClick: (G) => J("profiles", C.name)
          }, {
            default: f(() => [
              h(g(C.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          p(r(He), null, {
            default: f(() => [...O[4] || (O[4] = [
              h("Program", -1)
            ])]),
            _: 1
          }),
          (n(!0), l(F, null, ne(r(W), (C) => (n(), z(r(Le), {
            key: C.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.programs.includes(C.name),
            checked: A.value.programs.includes(C.name),
            "data-filter-program": C.name,
            onClick: (G) => J("programs", C.name)
          }, {
            default: f(() => [
              h(g(C.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          Y.value ? (n(), z(r(Le), {
            key: 1,
            "data-filter-clear": "",
            onClick: X
          }, {
            default: f(() => [...O[5] || (O[5] = [
              h("Clear filters", -1)
            ])]),
            _: 1
          })) : v("", !0)
        ]),
        default: f(() => [
          p(r(wt), {
            options: I.value.states,
            value: q.value,
            onPick: O[0] || (O[0] = (C) => q.value = C)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      q.value === "retired" && I.value.upgrade_retired ? (n(), l("p", eo, "Retired during the upgrade: " + g(I.value.upgrade_retired), 1)) : v("", !0),
      b("div", {
        ref_key: "list",
        ref: re,
        class: ue(["agents-view", { "agents-view-open": se.value }])
      }, [
        r($) && !r(k) && !me.value.length && Y.value ? (n(), z(r(Ee), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: f(() => [
            p(r(Q), {
              small: "",
              "data-empty-clear": "",
              onClick: X
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
          "leaves-at-once": ie.value,
          rows: me.value,
          failure: r(k),
          loaded: r($),
          more: !se.value && r(T),
          older: M,
          empty: Me.value.title,
          hint: Me.value.hint,
          searching: K.value
        }, {
          default: f(({ row: C }) => [
            b("div", {
              class: ue(["agent-row", { lingering: d.value.has(C.id) && C.id !== ee.value }]),
              "data-agent-row": C.id,
              "data-agent-lingering": d.value.has(C.id) ? "" : null
            }, [
              p(Xn, {
                row: C,
                facts: m(C),
                progress: x(C),
                "wait-reason": D(C),
                open: C.id === ee.value,
                onToggle: (G) => je(C)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, to)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, lo = /* @__PURE__ */ Z(ao, [["__scopeId", "data-v-fceb20c3"]]);
export {
  lo as A
};
