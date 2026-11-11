import { openBlock as a, createElementBlock as l, withModifiers as ae, unref as r, createTextVNode as w, toDisplayString as g, createVNode as p, createBlock as N, computed as u, createElementVNode as k, createCommentVNode as h, withCtx as y, Fragment as F, renderList as se, ref as V, watch as ce, onUnmounted as Me, defineAsyncComponent as Xe, createSlots as et, resolveDynamicComponent as tt, normalizeClass as de, normalizeStyle as Le, renderSlot as $e, onMounted as at, Teleport as nt, mergeProps as ot, toRef as Ie, withKeys as De, nextTick as qe } from "vue";
import { peekRef as xe, Icon as Ve, RunningCommand as st, TimeAgo as Be, FoldGroup as Ge, TaskStatusIcon as lt, useWindow as Re, loadWindowComponent as rt, coalesced as it, READ_RATES as dt, eventMayBeChildOf as ut, InnerTabs as ct, TabBody as gt, SwitchCase as Je, EmptyState as ze, TextInput as He, Btn as X, TextArea as vt, HoverTip as Te, TaskBar as pt, useNow as Ke, age as mt, perHour as ht, sinceWords as ft, seenWords as bt, AgentTip as kt, SearchBar as wt, Segmented as yt, MenuLabel as Oe, MenuItem as Ae, RowList as Mt, toggleFilter as $t } from "@journal/window-kit";
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
        onClick: t[0] || (t[0] = ae((s) => r(xe)("test_queue:0"), ["stop"]))
      }, [
        w("Waiting: " + g(e.waitReason) + " ", 1),
        p(r(Ve), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), l("span", Ct, "Waiting")) : (a(), N(r(st), {
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
    return (M, f) => (a(), l("dl", Tt, [
      i.value ? (a(), l("div", Lt, [
        f[0] || (f[0] = k("dt", null, "Driver", -1)),
        k("dd", Bt, g(i.value), 1)
      ])) : h("", !0),
      k("div", null, [
        f[1] || (f[1] = k("dt", null, "Sessions", -1)),
        k("dd", Rt, g(e.row.session_count ?? 0), 1)
      ]),
      k("div", null, [
        f[2] || (f[2] = k("dt", null, "Memories", -1)),
        k("dd", It, g(e.row.memory_count ?? 0), 1)
      ]),
      n.value ? (a(), l("div", Ot, [
        f[3] || (f[3] = k("dt", null, "Last session ended", -1)),
        k("dd", Vt, g(n.value), 1)
      ])) : h("", !0),
      e.row.retired_at ? (a(), l("div", zt, [
        f[4] || (f[4] = k("dt", null, "Retired", -1)),
        k("dd", Ht, [
          p(r(Be), {
            at: e.row.retired_at
          }, null, 8, ["at"])
        ])
      ])) : h("", !0),
      e.row.retiring_actor_name ? (a(), l("div", Et, [
        f[5] || (f[5] = k("dt", null, "Retired by", -1)),
        k("dd", Nt, g(e.row.retiring_actor_name), 1)
      ])) : h("", !0)
    ]));
  }
}, Dt = /* @__PURE__ */ J(Wt, [["__scopeId", "data-v-774269a7"]]), qt = ["data-agent-delegated", "onClick"], Ft = { class: "agent-task-number" }, Ut = { class: "agent-task-title" }, Pt = ["title"], Gt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = o;
    return (s, i) => (a(), N(r(Ge), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: i[0] || (i[0] = (n) => t("toggle"))
    }, {
      default: y(() => [
        (a(!0), l(F, null, se(e.section.tasks, (n) => (a(), l("button", {
          key: n.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": n.id,
          onClick: (M) => r(xe)(`tasks:${n.id}`)
        }, [
          p(r(lt), {
            status: n.state
          }, null, 8, ["status"]),
          k("span", Ft, g(n.id), 1),
          k("span", Ut, g(n.title), 1),
          n.plan_id ? (a(), l("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${n.plan_id}: ${n.plan_title}`
          }, "Plan " + g(n.plan_id), 9, Pt)) : h("", !0)
        ], 8, qt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Jt = /* @__PURE__ */ J(Gt, [["__scopeId", "data-v-ea4ccd6b"]]), Kt = {
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
    const o = e, t = ["started", "blocked", "open", "completed"], s = u(() => {
      var b, c;
      return o.row.ended_at && ((c = (b = o.facts) == null ? void 0 : b.job_returned) != null && c.startsWith(aa)) ? o.facts.job_returned : "";
    }), i = u(() => o.tasks.length ? t.map((b) => ({ state: b, label: b.slice(0, 1).toUpperCase() + b.slice(1), tasks: o.tasks.filter((c) => c.state === b || b === "started" && c.state === "testing" || b === "completed" && c.state === "cancelled") })) : []), n = /* @__PURE__ */ new Set(["completed"]), M = V({}), f = (b) => !(M.value[b] ?? n.has(b)), B = (b) => M.value = { ...M.value, [b]: f(b) }, L = Re(), { rows: D } = L.props.reports;
    L.state["reports.agent"] = String(o.row.number);
    const W = u(() => o.row.access === "read-only"), z = u(() => !!o.row.retired_at || o.row.state === "retired"), H = ["tasks", "transcript", "terminal", "file-feed", "reports"], A = u(() => (z.value ? L.tabs.filter((c) => ["reports", "transcript"].includes(c.key)) : W.value ? L.tabs.filter((c) => ["reports", "transcript", "terminal"].includes(c.key)) : [...L.tabs]).sort((c, d) => (H.indexOf(c.key) < 0 ? H.length : H.indexOf(c.key)) - (H.indexOf(d.key) < 0 ? H.length : H.indexOf(d.key)))), I = () => W.value || z.value ? A.value.find((b) => b.key === "transcript") : A.value[0], E = V(I());
    ce(E, (b) => {
      L.state.tab = (b == null ? void 0 : b.key) ?? "";
    }, { immediate: !0 }), Me(() => {
      L.state.tab = "";
    }), ce(A, (b) => {
      b.some((c) => {
        var d;
        return c.key === ((d = E.value) == null ? void 0 : d.key);
      }) || (E.value = b[0]);
    }), ce(() => o.open, (b) => {
      b && (E.value = I());
    });
    const Z = Object.fromEntries(L.tabs.filter((b) => b.component).map((b) => [b.key, Xe(() => rt(b.component))])), P = V(!1), { data: Y } = L.props.tool, ne = u(() => {
      var b;
      return ((b = Y.value) == null ? void 0 : b.tool) ?? "";
    }), q = u(() => {
      var b;
      return ((b = Y.value) == null ? void 0 : b.note) ?? "";
    }), K = u(() => o.row.role !== "main" && (!o.row.ended_at || o.stoppedWithWork || o.waitReason));
    async function S() {
      !o.open || !K.value || (L.state["tool.agent"] = String(o.row.number), await L.reload("tool"));
    }
    const v = it(S, dt.agentCommand), _ = L.follow(["hook_call.*", "process_part.*"], (b) => ut(b, "session_agent_id", /* @__PURE__ */ new Set([o.row.id])) && v());
    return Me(() => _ == null ? void 0 : _()), ce(() => o.open, (b) => {
      b && S();
    }, { immediate: !0 }), (b, c) => {
      var d;
      return a(), l("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: c[2] || (c[2] = ae(() => {
        }, ["stop"]))
      }, [
        p(Dt, { row: e.row }, null, 8, ["row"]),
        e.row.retirement_reason ? (a(), l("p", Kt, "Retirement reason: " + g(e.row.retirement_reason), 1)) : h("", !0),
        e.row.resume_reason ? (a(), l("p", Zt, g(e.row.resume_reason), 1)) : h("", !0),
        K.value ? (a(), N(jt, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: ne.value,
          note: q.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : h("", !0),
        s.value ? (a(), l("p", _t, g(s.value), 1)) : h("", !0),
        p(r(ct), {
          class: "agent-tabs",
          tabs: A.value,
          active: E.value,
          answer: { tasks: e.tasks.length, reports: r(D).length },
          onChoose: c[0] || (c[0] = (R) => E.value = R)
        }, null, 8, ["tabs", "active", "answer"]),
        p(r(gt), {
          class: "agent-tab-body",
          tab: E.value,
          "data-agent-tab-body": (d = E.value) == null ? void 0 : d.key
        }, {
          default: y(() => {
            var R;
            return [
              p(r(Je), {
                value: (R = E.value) == null ? void 0 : R.key
              }, et({
                reports: y(() => [
                  r(D).length ? h("", !0) : (a(), N(r(ze), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: y(() => [...c[3] || (c[3] = [
                      w("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (a(!0), l(F, null, se(r(D), ($) => (a(), l("button", {
                    key: $.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${$.id}`,
                    onClick: (x) => r(xe)(`messages:${$.id}`)
                  }, g($.text), 9, Yt))), 128))
                ]),
                tasks: y(() => {
                  var $;
                  return [
                    e.tasks.length ? h("", !0) : (a(), N(r(ze), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: y(() => [...c[4] || (c[4] = [
                        w("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (a(!0), l(F, null, se(i.value, (x) => (a(), N(Jt, {
                      key: x.state,
                      section: x,
                      open: f(x.state),
                      onToggle: (ee) => B(x.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    ($ = e.facts) != null && $.instruction ? (a(), l(F, { key: 1 }, [
                      c[5] || (c[5] = k("p", { class: "agent-label" }, "Instruction", -1)),
                      k("div", Qt, g(e.facts.instruction), 1)
                    ], 64)) : h("", !0)
                  ];
                }),
                transcript: y(() => {
                  var $;
                  return [
                    W.value ? (a(), l(F, { key: 0 }, [
                      ($ = e.facts) != null && $.instruction ? (a(), l("div", Xt, [
                        p(r(Ge), {
                          label: "Instruction",
                          open: P.value,
                          "data-agent-section": "instruction",
                          onToggle: c[1] || (c[1] = (x) => P.value = !P.value)
                        }, {
                          default: y(() => [
                            k("div", ea, g(e.facts.instruction), 1)
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
                se(r(Z), ($, x) => ({
                  name: x,
                  fn: y(() => [
                    (a(), N(tt($), {
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
      onSubmit: t[3] || (t[3] = ae((s) => o.$emit("submit"), ["prevent"]))
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
        p(r(X), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.program.trim() || !e.model.trim(),
          "data-agent-confirm-driver": ""
        }, {
          default: y(() => [...t[4] || (t[4] = [
            w("Change the driver", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(r(X), {
          small: "",
          disabled: e.pending,
          onClick: t[2] || (t[2] = (s) => o.$emit("cancel"))
        }, {
          default: y(() => [...t[5] || (t[5] = [
            w("Cancel", -1)
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
      onSubmit: t[4] || (t[4] = ae((s) => o.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (a(), l(F, { key: 0 }, [
        k("label", ia, [
          t[6] || (t[6] = w("Task ", -1)),
          k("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: t[0] || (t[0] = (s) => o.$emit("update:task", s.target.value))
          }, [
            t[5] || (t[5] = k("option", { value: "" }, "Choose an open task", -1)),
            (a(!0), l(F, null, se(e.tasks, (s) => (a(), l("option", {
              key: s.id,
              value: String(s.id)
            }, g(s.id) + ": " + g(s.title), 9, ua))), 128))
          ], 40, da)
        ]),
        e.moreTasks ? (a(), N(r(X), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: t[1] || (t[1] = (s) => o.$emit("more"))
        }, {
          default: y(() => [...t[7] || (t[7] = [
            w("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : h("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (a(), l("p", ca, "No open tasks.")) : h("", !0)
      ], 64)) : (a(), l("label", ga, [
        t[8] || (t[8] = w("Job", -1)),
        p(r(vt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (s) => o.$emit("update:text", s.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      k("div", va, [
        p(r(X), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: y(() => [...t[9] || (t[9] = [
            w("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(r(X), {
          small: "",
          disabled: e.pending,
          onClick: t[3] || (t[3] = (s) => o.$emit("cancel"))
        }, {
          default: y(() => [...t[10] || (t[10] = [
            w("Cancel", -1)
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
      onSubmit: t[2] || (t[2] = ae((s) => o.$emit("submit"), ["prevent"]))
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
        p(r(X), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: y(() => [...t[3] || (t[3] = [
            w("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(r(X), {
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (s) => o.$emit("cancel"))
        }, {
          default: y(() => [...t[4] || (t[4] = [
            w("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ba = /* @__PURE__ */ J(fa, [["__scopeId", "data-v-92de7dd6"]]), ka = {
  class: "session-history",
  "data-agent-session-history": ""
}, wa = { key: 0 }, ya = { key: 0 }, Ma = { "data-agent-session-state": "" }, $a = { class: "action-buttons" }, xa = {
  __name: "AgentSessionHistory",
  props: { sessions: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e) {
    return (o, t) => (a(), l("div", ka, [
      e.sessions.length ? h("", !0) : (a(), l("p", wa, "This agent has no session in its history.")),
      k("ol", null, [
        (a(!0), l(F, null, se(e.sessions, (s) => (a(), l("li", {
          key: s.session,
          "data-agent-session": ""
        }, [
          k("span", null, g([s.program, s.model].filter(Boolean).join(" ")), 1),
          s.started_at ? (a(), l("span", ya, [
            t[1] || (t[1] = w("Started ", -1)),
            p(r(Be), {
              at: s.started_at
            }, null, 8, ["at"])
          ])) : h("", !0),
          k("span", Ma, g(s.end_reason ? `Ended: ${s.end_reason.replaceAll("_", " ")}` : s.started_at ? "Running" : "Not started"), 1),
          k("code", null, g(s.session), 1)
        ]))), 128))
      ]),
      k("div", $a, [
        p(r(X), {
          small: "",
          onClick: t[0] || (t[0] = (s) => o.$emit("close"))
        }, {
          default: y(() => [...t[2] || (t[2] = [
            w("Close", -1)
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
    const o = e, t = Re(), s = V(""), i = V(""), n = V(""), M = V(""), f = V(""), B = V(""), L = V([]), D = V(0), W = V(!1), z = V(!1), H = V(!1), A = V(""), I = V(""), E = V([]), Z = u(() => !!o.row.retired_at || o.row.state === "retired"), P = u(() => !Z.value && !!o.row.ended_at), Y = u(() => {
      var $;
      return P.value && (($ = o.row.job_command) == null ? void 0 : $.length) && !o.row.resume_reason;
    }), ne = u(() => Y.value && !z.value && (o.row.job_task_flag ? L.value.some(($) => String($.id) === B.value) : !!i.value.trim()));
    function q($) {
      s.value = $, i.value = "", n.value = "", B.value = "", A.value = "", I.value = "";
    }
    async function K() {
      q("job"), o.row.job_task_flag && (L.value = [], D.value = 0, W.value = !1, await S());
    }
    async function S() {
      if (!z.value) {
        z.value = !0;
        try {
          t.state["jobs.page"] = String(D.value + 1), await t.reload("jobs");
          const $ = t.props.jobs;
          A.value = $.failure.value, A.value || (L.value = [...L.value, ...$.rows.value], D.value = $.data.value.page, W.value = $.more.value);
        } finally {
          z.value = !1;
        }
      }
    }
    async function v($, x) {
      if (!H.value) {
        H.value = !0, A.value = "";
        try {
          const ee = await t.run($);
          A.value = ee.ok ? "" : ee.error, ee.ok && (q(""), I.value = x);
        } finally {
          H.value = !1;
        }
      }
    }
    async function _() {
      if (!ne.value) return;
      const $ = o.row.job_task_flag ? [o.row.job_task_flag, B.value] : [i.value.trim()];
      await v([...o.row.job_command, String(o.row.number), ...$], "Job sent.");
    }
    async function b() {
      if (!H.value) {
        H.value = !0;
        try {
          const $ = await t.run(["agent", "sessions", String(o.row.number)]);
          q($.ok ? "history" : ""), A.value = $.ok ? "" : $.error, E.value = $.ok ? $.value.rows : [];
        } finally {
          H.value = !1;
        }
      }
    }
    function c() {
      q("driver"), M.value = o.row.program || "", f.value = "";
    }
    async function d() {
      !P.value || s.value !== "driver" || !M.value.trim() || !f.value.trim() || await v(["agent", "driver", String(o.row.number), "--program", M.value.trim(), "--model", f.value.trim()], "Driver changed.");
    }
    async function R() {
      !P.value || s.value !== "retire" || !n.value.trim() || await v(["agent", "retire", String(o.row.number), "--reason", n.value.trim()], "Agent retired permanently.");
    }
    return ($, x) => {
      var ee;
      return a(), l("div", {
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: x[10] || (x[10] = ae(() => {
        }, ["stop"])),
        onKeydown: x[11] || (x[11] = ae(() => {
        }, ["stop"]))
      }, [
        k("div", Ca, [
          p(r(X), {
            small: "",
            "data-agent-history": "",
            disabled: H.value || z.value,
            onClick: b
          }, {
            default: y(() => [...x[12] || (x[12] = [
              w("Session history", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          P.value ? (a(), l(F, { key: 0 }, [
            (ee = e.row.job_command) != null && ee.length ? (a(), N(r(X), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: H.value || z.value || !Y.value,
              onClick: K
            }, {
              default: y(() => [...x[13] || (x[13] = [
                w("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0),
            e.row.role !== "main" ? (a(), N(r(X), {
              key: 1,
              small: "",
              "data-agent-driver": "",
              disabled: H.value || z.value,
              onClick: c
            }, {
              default: y(() => [...x[14] || (x[14] = [
                w("Change driver", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0),
            e.row.role !== "main" ? (a(), N(r(X), {
              key: 2,
              small: "",
              "data-agent-retire": "",
              disabled: H.value || z.value,
              onClick: x[0] || (x[0] = (G) => q("retire"))
            }, {
              default: y(() => [...x[15] || (x[15] = [
                w("Retire", -1)
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
              tasks: L.value,
              pending: H.value,
              loading: z.value,
              "more-tasks": W.value,
              failure: A.value,
              "job-ready": ne.value,
              onSubmit: _,
              onMore: S,
              onCancel: x[3] || (x[3] = (G) => q(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          driver: y(() => [
            p(ra, {
              program: M.value,
              "onUpdate:program": x[4] || (x[4] = (G) => M.value = G),
              model: f.value,
              "onUpdate:model": x[5] || (x[5] = (G) => f.value = G),
              pending: H.value,
              onSubmit: d,
              onCancel: x[6] || (x[6] = (G) => q(""))
            }, null, 8, ["program", "model", "pending"])
          ]),
          history: y(() => [
            p(Sa, {
              sessions: E.value,
              onClose: x[7] || (x[7] = (G) => q(""))
            }, null, 8, ["sessions"])
          ]),
          retire: y(() => [
            p(ba, {
              reason: n.value,
              "onUpdate:reason": x[8] || (x[8] = (G) => n.value = G),
              pending: H.value,
              onSubmit: R,
              onCancel: x[9] || (x[9] = (G) => q(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        A.value ? (a(), l("p", Aa, g(A.value), 1)) : h("", !0),
        I.value ? (a(), l("p", ja, g(I.value), 1)) : h("", !0)
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
    return (n, M) => (a(), N(r(Te), {
      as: "button",
      place: "corner",
      class: de(["agent-dot", { pulse: s.value }]),
      "data-state": e.state,
      "aria-label": i.value,
      "data-agent-status": "",
      onClick: M[0] || (M[0] = ae(() => {
      }, ["stop"]))
    }, {
      tip: y(() => [
        k("b", Ba, g(e.doing), 1),
        e.since ? (a(), l("span", Ra, g(e.since), 1)) : h("", !0),
        e.seen ? (a(), l("span", Ia, g(e.seen), 1)) : h("", !0)
      ]),
      default: y(() => [
        M[1] || (M[1] = k("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, Va = /* @__PURE__ */ J(Oa, [["__scopeId", "data-v-1a0bc478"]]), za = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, Ha = (e) => e.filter((o) => o.state !== "cancelled"), Fe = (e, o) => e.filter((t) => t.state === o).length;
function Ea({ tasks: e, inHand: o, perHour: t }) {
  const s = Ha(e), i = Fe(s, "completed"), n = za[o == null ? void 0 : o.state], M = s.length - i - (o && o.state !== "completed" ? 1 : 0), f = i === s.length;
  return {
    number: o.id,
    title: o.title,
    plan: o.plan_id ?? 0,
    count: `${i} of ${s.length}`,
    taskTip: `${i} of its ${s.length} tasks done${n ? `. This one is ${n.words}.` : "."}`,
    countTip: f ? `All ${s.length} tasks done` : `${i} done, 1 in hand, ${M} to go`,
    paceTip: !f && t ? `About ${t} an hour.` : "",
    rate: !f && t ? `${Math.round(t)}/hour` : "",
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
    const o = e, t = u(() => o.inHand ? Ea({ tasks: o.tasks, inHand: o.inHand, perHour: o.perHour }) : null);
    return (s, i) => e.job && !t.value ? (a(), l("span", Na, [
      p(r(Te), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: y(() => [
          k("b", null, g(e.job), 1)
        ]),
        default: y(() => [
          w(g(e.jobTitle || "Job"), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (a(), l("span", Wa, g(e.jobLaunch), 1)) : h("", !0)
    ])) : t.value ? (a(), l(F, { key: 1 }, [
      k("span", Da, [
        p(r(Te), {
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${t.value.number}`,
          "aria-label": `Task ${t.value.number}: ${t.value.title}`,
          onClick: i[0] || (i[0] = ae((n) => r(xe)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: y(() => [
            k("b", null, g(t.value.title), 1),
            k("span", null, g(t.value.taskTip), 1)
          ]),
          default: y(() => [
            w("Task " + g(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"]),
        t.value.plan ? (a(), l("span", qa, "Plan " + g(t.value.plan), 1)) : h("", !0),
        t.value.rate ? (a(), l("span", Fa, g(t.value.rate), 1)) : h("", !0),
        p(r(Te), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: y(() => [
            k("b", null, g(t.value.countTip), 1),
            t.value.paceTip ? (a(), l("span", Ua, g(t.value.paceTip), 1)) : h("", !0)
          ]),
          default: y(() => [
            w(g(t.value.count), 1)
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
}, Ga = /* @__PURE__ */ J(Pa, [["__scopeId", "data-v-d39df179"]]), Ja = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Ka = ["data-icon", "stroke-width", "innerHTML"], te = {
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
    return (o, t) => (a(), l("button", {
      type: "button",
      class: de(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), l("span", Za, g(e.checked ? "✓" : ""), 1)) : h("", !0),
      e.description ? (a(), l("span", _a, [
        k("span", null, [
          $e(o.$slots, "default", {}, void 0, !0)
        ]),
        k("small", null, g(e.description), 1)
      ])) : $e(o.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, be = /* @__PURE__ */ J(Ya, [["__scopeId", "data-v-fec99974"]]), Qa = {}, Xa = { class: "menu-label" };
function en(e, o) {
  return a(), l("span", Xa, [
    $e(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ye = /* @__PURE__ */ J(Qa, [["render", en], ["__scopeId", "data-v-aa955b3e"]]), tn = {
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
    const t = e, s = o, i = u(() => t.skills.filter((M) => M.state === "loaded")), n = u(() => t.skills.filter((M) => M.state !== "loaded"));
    return (M, f) => (a(), l("div", tn, [
      p(ye, null, {
        default: y(() => [...f[1] || (f[1] = [
          w("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      i.value.length ? h("", !0) : (a(), l("p", an, "None yet. Compacting the conversation empties this list.")),
      (a(!0), l(F, null, se(i.value, (B) => (a(), l("p", {
        key: B.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        p(te, {
          name: "book",
          size: 12
        }),
        w(g(B.skill), 1)
      ]))), 128)),
      n.value.length ? (a(), l(F, { key: 1 }, [
        p(ye, null, {
          default: y(() => [...f[2] || (f[2] = [
            w("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), l(F, null, se(n.value, (B) => (a(), l("p", {
          key: B.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          p(te, {
            name: "book",
            size: 12
          }),
          w(g(B.skill), 1)
        ]))), 128))
      ], 64)) : h("", !0),
      p(be, {
        "data-agent-skills-browse": "",
        onClick: f[0] || (f[0] = (B) => s("browse"))
      }, {
        default: y(() => [...f[3] || (f[3] = [
          w("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, on = /* @__PURE__ */ J(nn, [["__scopeId", "data-v-be514d47"]]), sn = ["disabled", "title"], ln = { class: "gauge usage" }, rn = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: o }) {
    const t = e, s = o, i = u(() => t.windows[0] ?? null), n = u(() => i.value && Number.isFinite(i.value.used_percent) ? Math.max(0, Math.min(100, Math.round(i.value.used_percent))) : null), M = u(() => n.value !== null && n.value >= 100), f = u(() => {
      var L;
      return (L = i.value) != null && L.reset_epoch_seconds ? new Date(i.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), B = u(() => M.value ? `At usage limit: the plan's ${i.value.title} allowance is used up${f.value ? `, starts again ${f.value}` : ""}` : `${n.value}% of the plan's ${i.value.title} allowance used${f.value ? `, starts again ${f.value}` : ""}`);
    return (L, D) => n.value !== null ? (a(), l("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: B.value,
      onClick: D[0] || (D[0] = (W) => s("open", W.currentTarget))
    }, [
      p(te, {
        name: "allowance",
        size: 12
      }),
      D[1] || (D[1] = w()),
      k("span", ln, [
        k("span", {
          style: Le({ width: `${n.value}%` })
        }, null, 4)
      ]),
      w(" " + g(M.value ? "At usage limit" : `${n.value}%`), 1)
    ], 8, sn)) : h("", !0);
  }
}, dn = /* @__PURE__ */ J(rn, [["__scopeId", "data-v-a36f09dc"]]), un = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (o, t) => (a(), l("span", {
      class: de(["badge", e.tone])
    }, g(e.text), 3));
  }
}, cn = /* @__PURE__ */ J(un, [["__scopeId", "data-v-9e7e1157"]]), gn = (e, o, t) => Math.max(o, Math.min(t, e)), Ze = /* @__PURE__ */ new WeakMap(), vn = (e, o) => Ze.set(e, o);
function pn(e, o) {
  for (let t = o; t; t = Ze.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function mn(e, o) {
  const t = (s) => {
    var n, M;
    const i = ((n = e.value) == null ? void 0 : n.element) || ((M = e.value) == null ? void 0 : M.$el) || e.value;
    i && !pn(i, s.target) && o(s);
  };
  window.addEventListener("click", t), Me(() => window.removeEventListener("click", t));
}
const fe = 8, hn = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    })), f = V({ w: 0, h: 0 }), B = V(s.anchor ? s.anchor.getBoundingClientRect() : null), L = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), D = (d) => ({
      left: Math.max(0, d.left),
      top: Math.max(0, d.top),
      right: Math.min(window.innerWidth, d.right),
      bottom: Math.min(window.innerHeight, d.bottom)
    }), W = (d) => {
      const R = d.closest(".pane, .float-window");
      return R ? D(R.getBoundingClientRect()) : L();
    }, z = (d, R) => `${Math.max(0, d ? Math.min(d, R) : R)}px`;
    function H(d, R) {
      return {
        below: d.bottom - R.bottom - s.gap - fe,
        above: R.top - d.top - s.gap - fe,
        across: d.right - d.left - 2 * fe
      };
    }
    function A(d) {
      const R = W(s.anchor), $ = H(R, d);
      return f.value.w <= $.across && f.value.h <= Math.max($.below, $.above) ? R : L();
    }
    const I = u(() => {
      if (!B.value) return M.value;
      const d = B.value, R = A(d), $ = H(R, d), { w: x, h: ee } = f.value, G = s.align === "auto" ? d.left + d.right > R.left + R.right : s.align === "right", ke = gn(G ? d.right - x : d.left, R.left + fe, Math.max(R.left + fe, R.right - x - fe)), m = ee > $.below && $.above > $.below ? { bottom: `${window.innerHeight - d.top + s.gap}px`, maxHeight: z(s.maxHeight, $.above) } : { top: `${d.bottom + s.gap}px`, maxHeight: z(s.maxHeight, $.below) };
      return { ...M.value, ...m, left: `${ke}px`, maxWidth: z(s.maxWidth, $.across) };
    }), E = t, Z = () => [...i.value.querySelectorAll("button:not(:disabled)")];
    function P(d) {
      const R = Z(), $ = R.indexOf(document.activeElement);
      R[($ + d + R.length) % R.length].focus();
    }
    const Y = { ArrowDown: () => P(1), ArrowUp: () => P(-1), Escape: () => E("close") }, ne = (d) => Y[d.key] && (d.preventDefault(), Y[d.key]()), q = () => i.value && (f.value = { w: i.value.offsetWidth, h: i.value.scrollHeight });
    let K = 0;
    const S = new ResizeObserver(() => {
      cancelAnimationFrame(K), K = requestAnimationFrame(q);
    });
    mn(i, (d) => s.anchor && !s.anchor.contains(d.target) && E("close"));
    const v = (d, R) => ["top", "left", "right", "bottom"].some(($) => Math.abs(d[$] - R[$]) > 1), _ = (d) => d.bottom < 0 || d.top > window.innerHeight;
    let b = 0;
    function c() {
      if (s.anchor) {
        const d = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || _(d)) return E("close");
        v(d, B.value) && (B.value = d);
      }
      b = requestAnimationFrame(c);
    }
    return at(() => {
      s.anchor && i.value && vn(i.value, s.anchor), q(), i.value && S.observe(i.value), !s.plain && Z()[0] && Z()[0].focus(), c();
    }), Me(() => {
      S.disconnect(), cancelAnimationFrame(b), cancelAnimationFrame(K);
    }), o({ element: i }), (d, R) => (a(), N(nt, {
      to: "body",
      disabled: !e.anchor
    }, [
      k("div", ot({
        ref_key: "panel",
        ref: i
      }, d.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: I.value,
        onKeydown: ne
      }), [
        $e(d.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), fn = /* @__PURE__ */ J(hn, [["__scopeId", "data-v-3d203970"]]);
async function bn(e, o, t) {
  if (!e) return t(o);
  const { target: s, fields: i } = e, n = Object.fromEntries(Object.keys(i).map((B) => [B, s[B]])), M = () => Object.assign(s, n);
  Object.assign(s, i);
  let f = !1;
  try {
    const B = await t(o);
    return f = B.ok, B;
  } finally {
    f || M();
  }
}
function kn(e, o, t, { groups: s, programs: i }) {
  const n = V({}), M = V(""), f = V(!1), B = u(() => !!e.value && !e.value.ended_at), L = u(() => B.value && !!e.value.paused_at);
  async function D(A, I = null) {
    M.value = "";
    const E = await bn(I, A, o);
    return M.value = E.ok ? "" : E.error, t(), E;
  }
  return { groups: s, programs: i, chosen: n, failure: M, asking: f, running: B, paused: L, choose: (A, I) => D(["agent", "control", String(e.value.number), A, I.value], { target: n, fields: { value: { ...n.value, [A]: I.label } } }), stop: () => (f.value = !1, D(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (A) => D(["agent", "launch", A.name]) };
}
function wn(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const yn = { compact: "Compaction", clear: "Clear" };
function Mn(e) {
  return e != null && e.is_open ? `${yn[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
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
}, Bn = ["title"], Rn = {
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
  setup(e, { emit: o }) {
    const t = e, s = o, i = kn(Ie(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => s("changed"), { groups: Ie(t, "controlGroups"), programs: Ie(t, "agentPrograms") }), n = V(null), M = V(""), f = u(() => i.groups.value.find((S) => S.key === M.value));
    function B(S, v) {
      n.value = S.currentTarget, M.value = v;
    }
    function L() {
      n.value = null, M.value = "", i.asking.value = !1;
    }
    const D = u(() => t.skills.filter((S) => S.state === "loaded"));
    function W(S) {
      B(S, "skills"), s("skills");
    }
    const z = (S) => i.groups.value.some((v) => v.key === S), H = u(() => {
      var S;
      return i.chosen.value.model ?? ((S = I.value) == null ? void 0 : S.model) ?? "";
    }), A = u(() => {
      var S;
      return i.chosen.value.effort ?? ((S = I.value) == null ? void 0 : S.effort) ?? "";
    });
    u(() => !!t.agent && !t.agent.ended_at);
    const I = u(() => {
      var S;
      return ((S = t.usage.agents) == null ? void 0 : S.find((v) => {
        var _;
        return v.id === ((_ = t.agent) == null ? void 0 : _.id);
      })) ?? null;
    }), E = u(() => {
      var S;
      return ((S = I.value) == null ? void 0 : S.context_percent) == null ? null : Math.round(I.value.context_percent);
    }), Z = u(() => {
      var S;
      return Mn(((S = I.value) == null ? void 0 : S.context_change) ?? null);
    }), P = (S) => `${Math.round(S / 1e3)}k`, Y = u(() => {
      var S;
      return !!((S = I.value) != null && S.context_limit_tokens);
    }), ne = u(() => {
      var S, v;
      return ((S = I.value) == null ? void 0 : S.context_limit_tokens) || ((v = I.value) == null ? void 0 : v.context_window_tokens) || 0;
    }), q = u(() => ne.value ? `${P(I.value.context_tokens ?? 0)} of ${P(ne.value)}` : ""), K = u(() => {
      var S;
      return (S = I.value) != null && S.cost_dollars ? `$${I.value.cost_dollars.toFixed(2)}` : "";
    });
    return (S, v) => {
      var _, b;
      return a(), l("div", {
        class: de(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (a(), l(F, { key: 0 }, [
          k("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: v[0] || (v[0] = (c) => B(c, "agent"))
          }, [
            p(te, {
              name: "agents",
              size: 12
            }),
            w(" " + g(((_ = e.agentPrograms.find((c) => c.name === e.agent.program)) == null ? void 0 : _.title) || e.agent.program), 1)
          ], 8, $n),
          p(dn, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: v[1] || (v[1] = (c) => s("open", "usage", c))
          }, null, 8, ["windows", "disabled"]),
          E.value !== null ? (a(), l("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${E.value}% full: clear or compact it`,
            onClick: v[2] || (v[2] = (c) => z("context") ? B(c, "context") : s("open", "context", c.currentTarget))
          }, [
            p(te, {
              name: "gauge",
              size: 12
            }),
            v[14] || (v[14] = w()),
            k("span", Sn, [
              k("span", {
                style: Le({ width: `${E.value}%` })
              }, null, 4)
            ]),
            w(" " + g(E.value) + "% ", 1)
          ], 8, xn)) : (b = I.value) != null && b.context_unknown ? (a(), l("span", Cn, [
            p(te, {
              name: "gauge",
              size: 12
            }),
            v[15] || (v[15] = w(" Context: unknown", -1))
          ])) : h("", !0),
          H.value ? (a(), l("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${H.value}: change the model`,
            onClick: v[3] || (v[3] = (c) => z("model") ? B(c, "model") : null)
          }, [
            p(te, {
              name: "model",
              size: 12
            }),
            w(" " + g(H.value), 1)
          ], 8, An)) : h("", !0),
          z("effort") || e.card && A.value ? (a(), l("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: v[4] || (v[4] = (c) => B(c, "effort"))
          }, [
            p(te, {
              name: "bolt",
              size: 12
            }),
            w(" " + g(A.value), 1)
          ], 8, jn)) : h("", !0),
          K.value ? (a(), l("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: v[5] || (v[5] = (c) => s("open", "cost", c.currentTarget))
          }, g(K.value), 9, Tn)) : h("", !0),
          e.branch ? (a(), l("span", Ln, [
            p(te, {
              name: "branch",
              size: 12
            }),
            w(" " + g(e.branch), 1)
          ])) : h("", !0),
          e.card ? h("", !0) : (a(), l("button", {
            key: 6,
            type: "button",
            class: de(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: v[6] || (v[6] = (c) => s("open", "jobs", c.currentTarget))
          }, [
            p(te, {
              name: "clock",
              size: 12
            }),
            w(" " + g(e.jobs), 1)
          ], 2)),
          e.run ? (a(), l("button", {
            key: 7,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: W
          }, [
            p(te, {
              name: "book",
              size: 12
            }),
            w(" " + g(D.value.length), 1)
          ])) : h("", !0),
          e.fitness ? (a(), l(F, { key: 8 }, [
            k("button", {
              type: "button",
              class: de(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < En }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: v[7] || (v[7] = (c) => s("open", "fitness", c.currentTarget))
            }, [
              p(te, {
                name: "heart",
                size: 12
              }),
              w(" " + g(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            k("button", {
              type: "button",
              class: de(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: v[8] || (v[8] = (c) => s("open", "load", c.currentTarget))
            }, [
              p(te, {
                name: "weight",
                size: 12
              }),
              w(" " + g(e.fitness.workload), 1)
            ], 2)
          ], 64)) : h("", !0)
        ], 64)) : e.run && !e.loading ? (a(), l("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: v[9] || (v[9] = (c) => B(c, "start"))
        }, [
          p(te, {
            name: "agents",
            size: 12
          }),
          v[16] || (v[16] = w(" Start an agent", -1))
        ])) : h("", !0),
        v[22] || (v[22] = k("span", { class: "space" }, null, -1)),
        r(i).failure.value ? (a(), l("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: r(i).failure.value
        }, g(r(i).failure.value), 9, Bn)) : h("", !0),
        $e(S.$slots, "default", {}, void 0, !0),
        n.value ? (a(), N(fn, {
          key: 3,
          anchor: n.value,
          "min-width": 190,
          onClose: L
        }, {
          default: y(() => {
            var c;
            return [
              M.value === "agent" ? (a(), l(F, { key: 0 }, [
                r(i).asking.value ? (a(), l(F, { key: 0 }, [
                  p(ye, { "data-agent-stop-ask": "" }, {
                    default: y(() => [...v[17] || (v[17] = [
                      w("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  p(be, {
                    "data-agent-stop-confirm": "",
                    onClick: v[10] || (v[10] = (d) => (L(), r(i).stop()))
                  }, {
                    default: y(() => [...v[18] || (v[18] = [
                      w("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  p(be, {
                    onClick: v[11] || (v[11] = (d) => r(i).asking.value = !1)
                  }, {
                    default: y(() => [...v[19] || (v[19] = [
                      w("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (a(), N(be, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: v[12] || (v[12] = (d) => r(i).asking.value = !0)
                }, {
                  default: y(() => [...v[20] || (v[20] = [
                    w("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : M.value === "start" ? (a(), l(F, { key: 1 }, [
                p(ye, null, {
                  default: y(() => [...v[21] || (v[21] = [
                    w("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (a(!0), l(F, null, se(r(i).programs.value, (d) => (a(), N(be, {
                  key: d.name,
                  "data-agent-program": d.name,
                  onClick: (R) => (L(), r(i).start(d))
                }, {
                  default: y(() => [
                    w(g(d.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : M.value === "skills" ? (a(), N(on, {
                key: 2,
                skills: e.skills,
                onBrowse: v[13] || (v[13] = (d) => (L(), s("open", "skills", null)))
              }, null, 8, ["skills"])) : f.value ? (a(), l(F, { key: 3 }, [
                p(ye, null, {
                  default: y(() => [
                    w(g(f.value.label), 1)
                  ]),
                  _: 1
                }),
                M.value === "context" ? (a(), l(F, { key: 0 }, [
                  k("p", Rn, g(r(wn)(((c = I.value) == null ? void 0 : c.last_compaction) ?? null)), 1),
                  k("div", In, [
                    k("span", On, [
                      k("span", {
                        style: Le({ width: `${E.value}%` })
                      }, null, 4)
                    ]),
                    k("span", Vn, g(E.value) + "%", 1)
                  ]),
                  q.value ? (a(), l("p", zn, [
                    w(g(q.value) + " ", 1),
                    Y.value ? (a(), N(cn, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : h("", !0)
                  ])) : h("", !0)
                ], 64)) : h("", !0),
                M.value === "context" && Z.value ? (a(), l("p", Hn, g(Z.value), 1)) : (a(!0), l(F, { key: 2 }, se(f.value.choices, (d) => (a(), N(be, {
                  key: d.value,
                  "data-agent-choice": d.value,
                  onClick: (R) => (r(i).choose(f.value.key, d), L())
                }, {
                  default: y(() => [
                    w(g(d.label), 1)
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
}, Wn = /* @__PURE__ */ J(Nn, [["__scopeId", "data-v-39d8d09e"]]), Dn = ["data-agent-open", "aria-expanded", "role", "tabindex"], qn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Fn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Un = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, Pn = { class: "agent-line" }, Gn = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Jn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, Kn = {
  key: 1,
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, Zn = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, _n = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), s = { helper: "Helper", reviewer: "Reviewer", main: "Main agent" }, i = { running: "Working", starting: "Starting", stopping: "Stopping", ended: "Idle: its process has stopped", failed: "Could not start", never_started: "Not started" }, n = e, M = o, f = Ke(), B = u(() => {
      var T, Q;
      if ((T = n.facts) != null && T.profile_title) return n.facts.profile_title;
      if ((Q = n.facts) != null && Q.profile) return n.facts.profile;
      const m = s[n.row.role] || n.row.role;
      return m.slice(0, 1).toUpperCase() + m.slice(1);
    }), L = u(() => {
      var m;
      return ((m = n.facts) == null ? void 0 : m.tasks) ?? [];
    }), D = u(() => L.value.filter((m) => m.state === "open")), W = u(() => L.value.find((m) => {
      var T;
      return m.id === ((T = n.progress) == null ? void 0 : T.task_id) && m.state === "started";
    })), z = u(() => W.value || L.value.find((m) => {
      var T;
      return m.id === ((T = n.facts) == null ? void 0 : T.task_id);
    }) || L.value.find((m) => t.has(m.state)) || D.value[0] || L.value.at(-1)), H = u(() => {
      var m, T, Q, ue, oe, ge;
      return n.row.role === "helper" ? ((m = n.facts) == null ? void 0 : m.helper_job) || "" : (T = n.facts) != null && T.job_enabled && (((Q = W.value) == null ? void 0 : Q.title) || ((ue = n.facts) == null ? void 0 : ue.task_title) || ((oe = D.value[0]) == null ? void 0 : oe.title) || ((ge = L.value.at(-1)) == null ? void 0 : ge.title)) || "";
    }), A = u(() => `${n.row.role} ${n.row.number}`), I = u(() => {
      var m, T;
      return [n.row.program, (m = n.facts) == null ? void 0 : m.model, (T = n.facts) == null ? void 0 : T.effort, A.value].filter(Boolean).join(" · ");
    }), E = Re(), Z = u(() => mt(n.row.process_started_at || n.row.created_at, f.value)), P = /* @__PURE__ */ new Set(["open", "started", "testing"]), Y = { fresh: "new conversation", resumed: "resumed" }, ne = u(() => {
      var m, T;
      return [(m = n.facts) == null ? void 0 : m.helper_job_program, Y[(T = n.facts) == null ? void 0 : T.occupant_launch]].filter(Boolean).join(", ");
    }), q = u(() => {
      var m;
      return (m = n.facts) == null ? void 0 : m.work_status;
    }), K = u(() => !!n.row.ended_at && n.row.role !== "main" && L.value.some((m) => P.has(m.state))), S = u(() => {
      var m, T;
      return n.row.state === "running" && ((m = n.facts) == null ? void 0 : m.state) === "at usage limit" && !!((T = n.facts) != null && T.usage_limit_ends_at);
    }), v = (m) => new Date(m).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), _ = u(() => n.row.halted_at ? `Stopped at the usage limit since ${v(n.row.halted_at)}, goes on at ${v(n.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(n.facts.usage_limit_ends_at).toLocaleString()}`), b = u(() => {
      var m;
      return n.row.retired_at || n.row.state === "retired" ? "retired" : S.value || q.value || n.waitReason || K.value ? "waiting" : n.row.state === "running" && ((m = n.facts) == null ? void 0 : m.state) || n.row.state;
    }), c = u(() => {
      var m;
      return S.value ? _.value : q.value ? `Status: ${q.value}` : n.waitReason ? `Waiting: ${n.waitReason}` : b.value === "blocked" ? (m = n.facts) != null && m.blocked_reason ? `Blocked: ${n.facts.blocked_reason}` : "Blocked" : K.value ? "Stopped with work left" : "";
    }), d = u(() => {
      var m;
      return ((m = n.progress) == null ? void 0 : m.completed_count) ?? L.value.filter((T) => T.state === "completed").length;
    }), R = u(() => {
      var m;
      return ht(d.value, ((m = n.progress) == null ? void 0 : m.started_at) || n.row.created_at, n.progress ? n.progress.finished_at : n.row.ended_at, f.value);
    }), $ = u(() => n.row.role === "main" ? 0 : R.value), x = u(() => !!n.row.retired_at || n.row.state === "retired"), ee = u(() => x.value ? "Retired" : b.value === "blocked" || b.value === "waiting" ? c.value || (b.value === "blocked" ? "Blocked" : "Waiting") : i[n.row.standing]), G = u(() => {
      var T;
      if (x.value) return n.row.retired_at;
      const m = b.value === "blocked" || b.value === "waiting";
      return n.row.ended_at || m && ((T = n.facts) == null ? void 0 : T.last_activity) || n.row.process_started_at || n.row.created_at;
    }), ke = u(() => ft(G.value, f.value)), we = u(() => {
      var m;
      return bt((m = n.facts) == null ? void 0 : m.last_activity, f.value);
    });
    return (m, T) => {
      var Q, ue, oe, ge, me, le;
      return a(), l("div", {
        class: de(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: T[3] || (T[3] = (re) => !e.open && M("toggle")),
        onKeydown: [
          T[4] || (T[4] = De(ae((re) => !e.open && M("toggle"), ["self", "prevent"]), ["enter"])),
          T[5] || (T[5] = De(ae((re) => !e.open && M("toggle"), ["self", "prevent"]), ["space"]))
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
                onClick: T[0] || (T[0] = ae((Se) => M("toggle"), ["stop"]))
              }, [
                p(r(Ve), {
                  name: "chevronRight",
                  facing: "left",
                  size: 14
                })
              ])) : h("", !0),
              k("span", qn, g(B.value), 1),
              k("span", Fn, g(((re = e.facts) == null ? void 0 : re.given_name) || e.row.id), 1),
              e.open ? h("", !0) : (a(), N(r(Ve), {
                key: 1,
                class: "agent-chevron",
                name: "chevronRight",
                size: 12
              })),
              e.open ? (a(), l("span", Un, g(Z.value), 1)) : h("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-id", "label"]),
        k("span", Pn, [
          k("span", Gn, g(I.value), 1),
          (Q = e.facts) != null && Q.sandbox_off ? (a(), l("span", Jn, "sandbox off")) : h("", !0),
          e.open ? (a(), l("span", Kn, [
            T[6] || (T[6] = w("Started ", -1)),
            p(r(Be), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : h("", !0),
          e.open && ((ue = e.facts) != null && ue.last_activity) ? (a(), l("span", Zn, [
            T[7] || (T[7] = w("Seen ", -1)),
            p(r(Be), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : h("", !0)
        ]),
        e.open ? (a(), N(Wn, {
          key: 0,
          "agent-programs": r(E).props.programs.rows.value,
          agent: e.row,
          branch: (oe = e.progress) == null ? void 0 : oe.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((ge = e.facts) == null ? void 0 : ge.windows) ?? [] },
          card: ""
        }, {
          default: y(() => {
            var re;
            return [
              p(La, { row: e.row }, null, 8, ["row"]),
              p(r(X), {
                variant: "ghost",
                small: "",
                "data-agent-inspector": "",
                onClick: T[1] || (T[1] = ae((Se) => r(xe)(`agents:${e.row.id}`), ["stop"]))
              }, {
                default: y(() => [...T[8] || (T[8] = [
                  w("Open inspector", -1)
                ])]),
                _: 1
              }),
              e.row.role === "helper" && (!e.row.ended_at || (re = e.facts) != null && re.helper_job_open) ? (a(), N(r(X), {
                key: 0,
                variant: "ghost",
                small: "",
                "data-helper-stop": "",
                onClick: T[2] || (T[2] = ae((Se) => r(E).run(["helper", "stop", String(e.row.number)]), ["stop"]))
              }, {
                default: y(() => [
                  w(g(e.row.ended_at ? "End job" : "Stop"), 1)
                ]),
                _: 1
              })) : h("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : h("", !0),
        e.open ? h("", !0) : (a(), N(Ga, {
          key: 1,
          tasks: L.value,
          "in-hand": e.row.role !== "helper" && ((me = e.facts) != null && me.job_enabled) && z.value || null,
          job: e.row.role === "helper" ? H.value : "",
          "job-title": e.row.role === "helper" && ((le = e.facts) == null ? void 0 : le.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? ne.value : "",
          "per-hour": $.value
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour"])),
        p(Va, {
          state: b.value,
          doing: ee.value,
          since: ke.value,
          seen: we.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (a(), N(oa, {
          key: 2,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: L.value,
          "stopped-with-work": K.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : h("", !0)
      ], 42, Dn);
    };
  }
}, Yn = /* @__PURE__ */ J(_n, [["__scopeId", "data-v-c505edef"]]), Qn = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Xn = ["data-agent-row", "data-agent-lingering"], Ue = "journal.agents.filters", Pe = 300 * 1e3, je = "cubic-bezier(0.2, 0.9, 0.25, 1)", eo = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const o = e, t = Re(), { rows: s } = t.props.waits, { rows: i } = t.props.progress, { rows: n, failure: M, loaded: f, more: B } = t.props.agents, L = (j) => i.value.find((O) => O.agent_id === j.id) ?? null, D = (j) => {
      var O;
      return ((O = s.value.find((C) => C.agent_id === j.id)) == null ? void 0 : O.reason) ?? "";
    }, W = V("running"), z = V(""), H = JSON.parse(localStorage.getItem(Ue) || '{"roles":[],"profiles":[],"programs":[]}'), A = V(H), I = u(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: E } = t.props.programs, Z = u(() => A.value.roles.length + A.value.profiles.length + A.value.programs.length), P = (j, O) => {
      A.value = $t(A.value, j, O);
    }, Y = () => {
      A.value = { roles: [], profiles: [], programs: [] };
    }, ne = (j) => j.slice(0, 1).toUpperCase() + j.slice(1);
    ce(A, (j) => localStorage.setItem(Ue, JSON.stringify(j)));
    const q = V(25);
    function K() {
      Object.assign(t.state, {
        "agents.show": W.value,
        "agents.search": z.value,
        "agents.limit": String(q.value),
        "agents.roles": A.value.roles.join(","),
        "agents.profiles": A.value.profiles.join(","),
        "agents.programs": A.value.programs.join(",")
      });
    }
    async function S() {
      return q.value += 25, K(), await t.reload("agents"), !0;
    }
    ce([W, z, A], () => {
      q.value = 25, K(), t.reload("agents");
    }), K();
    const v = (j) => j.facts ?? null, _ = n, b = Ke(), c = V([]), d = u(() => new Set(c.value.filter((j) => b.value - j.left < Pe).map((j) => j.row.id))), R = u(() => c.value.filter((j) => d.value.has(j.row.id)).map((j) => j.row)), $ = u(() => [..._.value, ...R.value]);
    let x = "", ee = [];
    async function G(j) {
      await t.reload(`card.${j.id}`);
      const O = t.props[`card.${j.id}`].rows.value.find((C) => C.id === j.id);
      O != null && O.ended_at && !c.value.some((C) => C.row.id === j.id) && (c.value = [...c.value, { row: O, left: Date.now() }]);
    }
    ce(n, (j) => {
      const O = x === `${W.value}|${z.value}|${JSON.stringify(A.value)}` && W.value === "running", C = O ? ee.filter((U) => !j.some((ve) => ve.id === U.id)) : [];
      x = `${W.value}|${z.value}|${JSON.stringify(A.value)}`, ee = j, c.value = O ? c.value.filter((U) => b.value - U.left < Pe && !j.some((ve) => ve.id === U.row.id)) : [], C.forEach(G);
    }, { immediate: !0 });
    const ke = u(() => !!z.value.trim() || Z.value > 0), we = u(() => o.texts[W.value] ?? { title: o.empty, hint: "" }), m = V(null), T = V(null), Q = V(null), ue = V(null), oe = u(() => m.value === null ? null : t.props[`card.${m.value}`].rows.value.find((j) => j.id === m.value) ?? T.value), ge = u(() => oe.value ? [oe.value] : $.value), me = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, le = V(!1);
    let re = 0;
    async function Se(j) {
      if (le.value) return;
      le.value = !0, re = ue.value.scrollTop;
      const O = Q.value.querySelector(`[data-agent-open="${j.id}"]`);
      if (!me()) {
        const pe = [...Q.value.querySelectorAll(".agent-row")].filter((ie) => !ie.contains(O));
        await Promise.all(pe.map((ie) => ie.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const C = [...O.querySelectorAll(".agent-head, .agent-line")], U = [...C, ...O.querySelectorAll("[data-agent-motion]")], ve = U.map((pe) => pe.getBoundingClientRect());
      if (T.value = j, m.value = j.id, t.reload(`card.${j.id}`), await qe(), !me()) {
        const pe = U.map((ie) => ie.getBoundingClientRect());
        U.forEach((ie, Ce) => {
          const he = C.findIndex((We) => We !== ie && We.contains(ie)), Ye = ve[Ce].left - pe[Ce].left - (he < 0 ? 0 : ve[he].left - pe[he].left), Qe = ve[Ce].top - pe[Ce].top - (he < 0 ? 0 : ve[he].top - pe[he].top);
          ie.animate([{ transform: `translate(${Ye}px, ${Qe}px)` }, { transform: "none" }], { duration: 280, easing: je });
        }), Q.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((ie) => {
          ie.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: je, fill: "backwards" });
        });
      }
      le.value = !1;
    }
    async function Ee() {
      if (le.value || !oe.value) return;
      le.value = !0;
      const j = Q.value.querySelector(`[data-agent-open="${m.value}"]`), O = [...j.children], C = me() ? [] : O.map((U) => U.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(C.map((U) => U.finished)), m.value = null, await qe(), ue.value.scrollTop = re, C.forEach((U) => U.cancel()), me() || (j.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: je }), Q.value.querySelectorAll(".agent-row").forEach((U) => {
        U.contains(j) || U.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: je });
      })), le.value = !1;
    }
    const _e = (j) => m.value === j.id ? Ee() : Se(j);
    ce(z, (j) => j.trim() && (m.value = null)), ce(W, () => {
      m.value = null;
    });
    const Ne = (j) => {
      j.key === "Escape" && Ee();
    };
    return window.addEventListener("keydown", Ne), Me(() => window.removeEventListener("keydown", Ne)), (j, O) => (a(), l("div", {
      ref_key: "agents",
      ref: Q,
      class: de(["agents", { focused: oe.value, "card-changing": le.value }])
    }, [
      oe.value ? h("", !0) : (a(), N(r(wt), {
        key: 0,
        modelValue: z.value,
        "onUpdate:modelValue": O[1] || (O[1] = (C) => z.value = C),
        placeholder: "Search agents",
        "menu-count": Z.value,
        "data-agents-search": ""
      }, {
        menu: y(() => [
          p(r(Oe), null, {
            default: y(() => [...O[2] || (O[2] = [
              w("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), l(F, null, se(I.value.roles, (C) => (a(), N(r(Ae), {
            key: C,
            role: "menuitemcheckbox",
            "aria-checked": A.value.roles.includes(C),
            checked: A.value.roles.includes(C),
            "data-filter-role": C,
            onClick: (U) => P("roles", C)
          }, {
            default: y(() => [
              w(g(ne(C)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          I.value.profiles.length ? (a(), N(r(Oe), { key: 0 }, {
            default: y(() => [...O[3] || (O[3] = [
              w("Profile", -1)
            ])]),
            _: 1
          })) : h("", !0),
          (a(!0), l(F, null, se(I.value.profiles, (C) => (a(), N(r(Ae), {
            key: C.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.profiles.includes(C.name),
            checked: A.value.profiles.includes(C.name),
            "data-filter-profile": C.name,
            onClick: (U) => P("profiles", C.name)
          }, {
            default: y(() => [
              w(g(C.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          p(r(Oe), null, {
            default: y(() => [...O[4] || (O[4] = [
              w("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), l(F, null, se(r(E), (C) => (a(), N(r(Ae), {
            key: C.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.programs.includes(C.name),
            checked: A.value.programs.includes(C.name),
            "data-filter-program": C.name,
            onClick: (U) => P("programs", C.name)
          }, {
            default: y(() => [
              w(g(C.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          Z.value ? (a(), N(r(Ae), {
            key: 1,
            "data-filter-clear": "",
            onClick: Y
          }, {
            default: y(() => [...O[5] || (O[5] = [
              w("Clear filters", -1)
            ])]),
            _: 1
          })) : h("", !0)
        ]),
        default: y(() => [
          p(r(yt), {
            options: I.value.states,
            value: W.value,
            onPick: O[0] || (O[0] = (C) => W.value = C)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      W.value === "retired" && I.value.upgrade_retired ? (a(), l("p", Qn, "Retired during the upgrade: " + g(I.value.upgrade_retired), 1)) : h("", !0),
      k("div", {
        ref_key: "list",
        ref: ue,
        class: de(["agents-view", { "agents-view-open": oe.value }])
      }, [
        r(f) && !r(M) && !ge.value.length && Z.value ? (a(), N(r(ze), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: y(() => [
            p(r(X), {
              small: "",
              "data-empty-clear": "",
              onClick: Y
            }, {
              default: y(() => [...O[6] || (O[6] = [
                w("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), N(r(Mt), {
          key: 1,
          moves: "",
          "leaves-at-once": le.value,
          rows: ge.value,
          failure: r(M),
          loaded: r(f),
          more: !oe.value && r(B),
          older: S,
          empty: we.value.title,
          hint: we.value.hint,
          searching: ke.value
        }, {
          default: y(({ row: C }) => [
            k("div", {
              class: de(["agent-row", { lingering: d.value.has(C.id) && C.id !== m.value }]),
              "data-agent-row": C.id,
              "data-agent-lingering": d.value.has(C.id) ? "" : null
            }, [
              p(Yn, {
                row: C,
                facts: v(C),
                progress: L(C),
                "wait-reason": D(C),
                open: C.id === m.value,
                onToggle: (U) => _e(C)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, Xn)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, oo = /* @__PURE__ */ J(eo, [["__scopeId", "data-v-fceb20c3"]]);
export {
  oo as A
};
