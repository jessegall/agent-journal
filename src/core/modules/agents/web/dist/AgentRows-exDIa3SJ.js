import { openBlock as n, createElementBlock as l, withModifiers as ae, unref as r, createTextVNode as k, toDisplayString as d, createVNode as p, createBlock as N, computed as i, createElementVNode as h, createCommentVNode as m, withCtx as b, Fragment as U, renderList as se, ref as z, watch as ce, onUnmounted as Me, defineAsyncComponent as Xe, createSlots as et, resolveDynamicComponent as tt, normalizeClass as de, normalizeStyle as Te, renderSlot as $e, onMounted as at, Teleport as nt, mergeProps as ot, toRef as Re, withKeys as We, nextTick as qe } from "vue";
import { peekRef as xe, Icon as Oe, RunningCommand as st, TimeAgo as Le, FoldGroup as Pe, TaskStatusIcon as lt, useWindow as Be, loadWindowComponent as rt, coalesced as it, READ_RATES as dt, eventMayBeChildOf as ut, InnerTabs as ct, TabBody as gt, SwitchCase as Je, EmptyState as Ve, TextInput as ze, Btn as ee, TextArea as vt, HoverTip as Ae, TaskBar as pt, useNow as Ge, age as mt, perHour as ht, sinceWords as ft, seenWords as bt, AgentTip as kt, SearchBar as yt, Segmented as wt, MenuLabel as Ie, MenuItem as Ce, RowList as Mt, toggleFilter as $t } from "@journal/window-kit";
import { _ as G, T as xt } from "./TranscriptRows-Crmxs6Un.js";
const St = {
  class: "agent-command",
  "data-agent-command": ""
}, Ct = {
  key: 1,
  "data-agent-stopped": ""
}, jt = {
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
        k("Waiting: " + d(e.waitReason) + " ", 1),
        p(r(Oe), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (n(), l("span", Ct, "Waiting")) : (n(), N(r(st), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, At = /* @__PURE__ */ G(jt, [["__scopeId", "data-v-1b371fb5"]]), Tt = {
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
    }, t = e, s = i(() => t.row.program ? t.row.program.slice(0, 1).toUpperCase() + t.row.program.slice(1) : ""), a = i(() => [s.value, t.row.program_model].filter(Boolean).join(" ")), g = i(() => t.row.replaced_session_end_reason ? o[t.row.replaced_session_end_reason] || t.row.replaced_session_end_reason.replaceAll("_", " ") : "");
    return (M, f) => (n(), l("dl", Tt, [
      a.value ? (n(), l("div", Lt, [
        f[0] || (f[0] = h("dt", null, "Driver", -1)),
        h("dd", Bt, d(a.value), 1)
      ])) : m("", !0),
      h("div", null, [
        f[1] || (f[1] = h("dt", null, "Sessions", -1)),
        h("dd", Rt, d(e.row.session_count ?? 0), 1)
      ]),
      h("div", null, [
        f[2] || (f[2] = h("dt", null, "Memories", -1)),
        h("dd", It, d(e.row.memory_count ?? 0), 1)
      ]),
      g.value ? (n(), l("div", Ot, [
        f[3] || (f[3] = h("dt", null, "Last session ended", -1)),
        h("dd", Vt, d(g.value), 1)
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
        h("dd", Nt, d(e.row.retiring_actor_name), 1)
      ])) : m("", !0)
    ]));
  }
}, qt = /* @__PURE__ */ G(Wt, [["__scopeId", "data-v-774269a7"]]), Dt = ["data-agent-delegated", "onClick"], Ft = { class: "agent-task-number" }, Ut = { class: "agent-task-title" }, Pt = ["title"], Jt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = o;
    return (s, a) => (n(), N(r(Pe), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: a[0] || (a[0] = (g) => t("toggle"))
    }, {
      default: b(() => [
        (n(!0), l(U, null, se(e.section.tasks, (g) => (n(), l("button", {
          key: g.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": g.id,
          onClick: (M) => r(xe)(`tasks:${g.id}`)
        }, [
          p(r(lt), {
            status: g.state
          }, null, 8, ["status"]),
          h("span", Ft, d(g.id), 1),
          h("span", Ut, d(g.title), 1),
          g.plan_id ? (n(), l("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${g.plan_id}: ${g.plan_title}`
          }, "Plan " + d(g.plan_id), 9, Pt)) : m("", !0)
        ], 8, Dt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Gt = /* @__PURE__ */ G(Jt, [["__scopeId", "data-v-ea4ccd6b"]]), Kt = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Zt = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Yt = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, _t = ["data-peek", "onClick"], Qt = {
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
    const o = e, t = ["started", "blocked", "open", "completed"], s = i(() => {
      var c, L;
      return o.row.ended_at && ((L = (c = o.facts) == null ? void 0 : c.job_returned) != null && L.startsWith(aa)) ? o.facts.job_returned : "";
    }), a = i(() => o.tasks.length ? t.map((c) => ({ state: c, label: c.slice(0, 1).toUpperCase() + c.slice(1), tasks: o.tasks.filter((L) => L.state === c || c === "started" && L.state === "testing" || c === "completed" && L.state === "cancelled") })) : []), g = /* @__PURE__ */ new Set(["completed"]), M = z({}), f = (c) => !(M.value[c] ?? g.has(c)), S = (c) => M.value = { ...M.value, [c]: f(c) }, R = Be(), { rows: D } = R.props.reports;
    R.state["reports.agent"] = String(o.row.number);
    const q = i(() => o.row.access === "read-only"), H = i(() => !!o.row.retired_at || o.row.state === "retired"), E = ["tasks", "transcript", "terminal", "file-feed", "reports"], A = i(() => (H.value ? R.tabs.filter((L) => ["reports", "transcript"].includes(L.key)) : q.value ? R.tabs.filter((L) => ["reports", "transcript", "terminal"].includes(L.key)) : [...R.tabs]).sort((L, v) => (E.indexOf(L.key) < 0 ? E.length : E.indexOf(L.key)) - (E.indexOf(v.key) < 0 ? E.length : E.indexOf(v.key)))), O = () => q.value || H.value ? A.value.find((c) => c.key === "transcript") : A.value[0], W = z(O());
    ce(W, (c) => {
      R.state.tab = (c == null ? void 0 : c.key) ?? "";
    }, { immediate: !0 }), Me(() => {
      R.state.tab = "";
    }), ce(A, (c) => {
      c.some((L) => {
        var v;
        return L.key === ((v = W.value) == null ? void 0 : v.key);
      }) || (W.value = c[0]);
    }), ce(() => o.open, (c) => {
      c && (W.value = O());
    });
    const Z = Object.fromEntries(R.tabs.filter((c) => c.component).map((c) => [c.key, Xe(() => rt(c.component))])), K = z(!1), { data: Q } = R.props.tool, X = i(() => {
      var c;
      return ((c = Q.value) == null ? void 0 : c.tool) ?? "";
    }), F = i(() => {
      var c;
      return ((c = Q.value) == null ? void 0 : c.note) ?? "";
    }), C = i(() => o.row.role !== "main" && (!o.row.ended_at || o.stoppedWithWork || o.waitReason));
    async function u() {
      !o.open || !C.value || (R.state["tool.agent"] = String(o.row.number), await R.reload("tool"));
    }
    const Y = it(u, dt.agentCommand), B = R.follow(["hook_call.*", "process_part.*"], (c) => ut(c, "session_agent_id", /* @__PURE__ */ new Set([o.row.id])) && Y());
    return Me(() => B == null ? void 0 : B()), ce(() => o.open, (c) => {
      c && u();
    }, { immediate: !0 }), (c, L) => {
      var v;
      return n(), l("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: L[2] || (L[2] = ae(() => {
        }, ["stop"]))
      }, [
        p(qt, { row: e.row }, null, 8, ["row"]),
        e.row.retirement_reason ? (n(), l("p", Kt, "Retirement reason: " + d(e.row.retirement_reason), 1)) : m("", !0),
        e.row.resume_reason ? (n(), l("p", Zt, d(e.row.resume_reason), 1)) : m("", !0),
        C.value ? (n(), N(At, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: X.value,
          note: F.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0),
        s.value ? (n(), l("p", Yt, d(s.value), 1)) : m("", !0),
        p(r(ct), {
          class: "agent-tabs",
          tabs: A.value,
          active: W.value,
          answer: { tasks: e.tasks.length, reports: r(D).length },
          onChoose: L[0] || (L[0] = (I) => W.value = I)
        }, null, 8, ["tabs", "active", "answer"]),
        p(r(gt), {
          class: "agent-tab-body",
          tab: W.value,
          "data-agent-tab-body": (v = W.value) == null ? void 0 : v.key
        }, {
          default: b(() => {
            var I;
            return [
              p(r(Je), {
                value: (I = W.value) == null ? void 0 : I.key
              }, et({
                reports: b(() => [
                  r(D).length ? m("", !0) : (n(), N(r(Ve), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: b(() => [...L[3] || (L[3] = [
                      k("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (n(!0), l(U, null, se(r(D), (w) => (n(), l("button", {
                    key: w.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${w.id}`,
                    onClick: (x) => r(xe)(`messages:${w.id}`)
                  }, d(w.text), 9, _t))), 128))
                ]),
                tasks: b(() => {
                  var w;
                  return [
                    e.tasks.length ? m("", !0) : (n(), N(r(Ve), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: b(() => [...L[4] || (L[4] = [
                        k("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (n(!0), l(U, null, se(a.value, (x) => (n(), N(Gt, {
                      key: x.state,
                      section: x,
                      open: f(x.state),
                      onToggle: (te) => S(x.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (w = e.facts) != null && w.instruction ? (n(), l(U, { key: 1 }, [
                      L[5] || (L[5] = h("p", { class: "agent-label" }, "Instruction", -1)),
                      h("div", Qt, d(e.facts.instruction), 1)
                    ], 64)) : m("", !0)
                  ];
                }),
                transcript: b(() => {
                  var w;
                  return [
                    q.value ? (n(), l(U, { key: 0 }, [
                      (w = e.facts) != null && w.instruction ? (n(), l("div", Xt, [
                        p(r(Pe), {
                          label: "Instruction",
                          open: K.value,
                          "data-agent-section": "instruction",
                          onToggle: L[1] || (L[1] = (x) => K.value = !K.value)
                        }, {
                          default: b(() => [
                            h("div", ea, d(e.facts.instruction), 1)
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
                se(r(Z), (w, x) => ({
                  name: x,
                  fn: b(() => [
                    (n(), N(tt(w), {
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
}, oa = /* @__PURE__ */ G(na, [["__scopeId", "data-v-6d8f6905"]]), sa = { class: "action-buttons" }, la = {
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
}, ra = /* @__PURE__ */ G(la, [["__scopeId", "data-v-c138a4da"]]), ia = { class: "action-field" }, da = ["value", "disabled"], ua = ["value"], ca = { key: 1 }, ga = {
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
      e.row.job_task_flag ? (n(), l(U, { key: 0 }, [
        h("label", ia, [
          t[6] || (t[6] = k("Task ", -1)),
          h("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: t[0] || (t[0] = (s) => o.$emit("update:task", s.target.value))
          }, [
            t[5] || (t[5] = h("option", { value: "" }, "Choose an open task", -1)),
            (n(!0), l(U, null, se(e.tasks, (s) => (n(), l("option", {
              key: s.id,
              value: String(s.id)
            }, d(s.id) + ": " + d(s.title), 9, ua))), 128))
          ], 40, da)
        ]),
        e.moreTasks ? (n(), N(r(ee), {
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
}, ma = /* @__PURE__ */ G(pa, [["__scopeId", "data-v-adde4158"]]), ha = { class: "action-buttons" }, fa = {
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
}, ba = /* @__PURE__ */ G(fa, [["__scopeId", "data-v-92de7dd6"]]), ka = {
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
        (n(!0), l(U, null, se(e.sessions, (s) => (n(), l("li", {
          key: s.session,
          "data-agent-session": ""
        }, [
          h("span", null, d([s.program, s.model].filter(Boolean).join(" ")), 1),
          s.started_at ? (n(), l("span", wa, [
            t[1] || (t[1] = k("Started ", -1)),
            p(r(Le), {
              at: s.started_at
            }, null, 8, ["at"])
          ])) : m("", !0),
          h("span", Ma, d(s.end_reason ? `Ended: ${s.end_reason.replaceAll("_", " ")}` : s.started_at ? "Running" : "Not started"), 1),
          h("code", null, d(s.session), 1)
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
}, Sa = /* @__PURE__ */ G(xa, [["__scopeId", "data-v-0d688bd9"]]), Ca = { class: "action-buttons" }, ja = {
  key: 0,
  role: "alert"
}, Aa = {
  key: 1,
  role: "status"
}, Ta = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const o = e, t = Be(), s = z(""), a = z(""), g = z(""), M = z(""), f = z(""), S = z(""), R = z([]), D = z(0), q = z(!1), H = z(!1), E = z(!1), A = z(""), O = z(""), W = z([]), Z = i(() => !!o.row.retired_at || o.row.state === "retired"), K = i(() => !Z.value && !!o.row.ended_at), Q = i(() => {
      var w;
      return K.value && ((w = o.row.job_command) == null ? void 0 : w.length) && !o.row.resume_reason;
    }), X = i(() => Q.value && !H.value && (o.row.job_task_flag ? R.value.some((w) => String(w.id) === S.value) : !!a.value.trim()));
    function F(w) {
      s.value = w, a.value = "", g.value = "", S.value = "", A.value = "", O.value = "";
    }
    async function C() {
      F("job"), o.row.job_task_flag && (R.value = [], D.value = 0, q.value = !1, await u());
    }
    async function u() {
      if (!H.value) {
        H.value = !0;
        try {
          t.state["jobs.page"] = String(D.value + 1), await t.reload("jobs");
          const w = t.props.jobs;
          A.value = w.failure.value, A.value || (R.value = [...R.value, ...w.rows.value], D.value = w.data.value.page, q.value = w.more.value);
        } finally {
          H.value = !1;
        }
      }
    }
    async function Y(w, x) {
      if (!E.value) {
        E.value = !0, A.value = "";
        try {
          const te = await t.run(w);
          A.value = te.ok ? "" : te.error, te.ok && (F(""), O.value = x);
        } finally {
          E.value = !1;
        }
      }
    }
    async function B() {
      if (!X.value) return;
      const w = o.row.job_task_flag ? [o.row.job_task_flag, S.value] : [a.value.trim()];
      await Y([...o.row.job_command, String(o.row.number), ...w], "Job sent.");
    }
    async function c() {
      if (!E.value) {
        E.value = !0;
        try {
          const w = await t.run(["agent", "sessions", String(o.row.number)]);
          F(w.ok ? "history" : ""), A.value = w.ok ? "" : w.error, W.value = w.ok ? w.value.rows : [];
        } finally {
          E.value = !1;
        }
      }
    }
    function L() {
      F("driver"), M.value = o.row.program || "", f.value = "";
    }
    async function v() {
      !K.value || s.value !== "driver" || !M.value.trim() || !f.value.trim() || await Y(["agent", "driver", String(o.row.number), "--program", M.value.trim(), "--model", f.value.trim()], "Driver changed.");
    }
    async function I() {
      !K.value || s.value !== "retire" || !g.value.trim() || await Y(["agent", "retire", String(o.row.number), "--reason", g.value.trim()], "Agent retired permanently.");
    }
    return (w, x) => {
      var te;
      return n(), l("div", {
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: x[10] || (x[10] = ae(() => {
        }, ["stop"])),
        onKeydown: x[11] || (x[11] = ae(() => {
        }, ["stop"]))
      }, [
        h("div", Ca, [
          p(r(ee), {
            small: "",
            "data-agent-history": "",
            disabled: E.value || H.value,
            onClick: c
          }, {
            default: b(() => [...x[12] || (x[12] = [
              k("Session history", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          K.value ? (n(), l(U, { key: 0 }, [
            (te = e.row.job_command) != null && te.length ? (n(), N(r(ee), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: E.value || H.value || !Q.value,
              onClick: C
            }, {
              default: b(() => [...x[13] || (x[13] = [
                k("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0),
            e.row.role !== "main" ? (n(), N(r(ee), {
              key: 1,
              small: "",
              "data-agent-driver": "",
              disabled: E.value || H.value,
              onClick: L
            }, {
              default: b(() => [...x[14] || (x[14] = [
                k("Change driver", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0),
            e.row.role !== "main" ? (n(), N(r(ee), {
              key: 2,
              small: "",
              "data-agent-retire": "",
              disabled: E.value || H.value,
              onClick: x[0] || (x[0] = (J) => F("retire"))
            }, {
              default: b(() => [...x[15] || (x[15] = [
                k("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0)
          ], 64)) : m("", !0)
        ]),
        p(r(Je), { value: s.value }, {
          job: b(() => [
            p(ma, {
              task: S.value,
              "onUpdate:task": x[1] || (x[1] = (J) => S.value = J),
              text: a.value,
              "onUpdate:text": x[2] || (x[2] = (J) => a.value = J),
              row: e.row,
              tasks: R.value,
              pending: E.value,
              loading: H.value,
              "more-tasks": q.value,
              failure: A.value,
              "job-ready": X.value,
              onSubmit: B,
              onMore: u,
              onCancel: x[3] || (x[3] = (J) => F(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          driver: b(() => [
            p(ra, {
              program: M.value,
              "onUpdate:program": x[4] || (x[4] = (J) => M.value = J),
              model: f.value,
              "onUpdate:model": x[5] || (x[5] = (J) => f.value = J),
              pending: E.value,
              onSubmit: v,
              onCancel: x[6] || (x[6] = (J) => F(""))
            }, null, 8, ["program", "model", "pending"])
          ]),
          history: b(() => [
            p(Sa, {
              sessions: W.value,
              onClose: x[7] || (x[7] = (J) => F(""))
            }, null, 8, ["sessions"])
          ]),
          retire: b(() => [
            p(ba, {
              reason: g.value,
              "onUpdate:reason": x[8] || (x[8] = (J) => g.value = J),
              pending: E.value,
              onSubmit: I,
              onCancel: x[9] || (x[9] = (J) => F(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        A.value ? (n(), l("p", ja, d(A.value), 1)) : m("", !0),
        O.value ? (n(), l("p", Aa, d(O.value), 1)) : m("", !0)
      ], 32);
    };
  }
}, La = /* @__PURE__ */ G(Ta, [["__scopeId", "data-v-03a4a81a"]]), Ba = { class: "line" }, Ra = {
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
    const o = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, s = i(() => o.has(t.state)), a = i(() => [t.doing, t.since, t.seen].filter(Boolean).join(". "));
    return (g, M) => (n(), N(r(Ae), {
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
        h("b", Ba, d(e.doing), 1),
        e.since ? (n(), l("span", Ra, d(e.since), 1)) : m("", !0),
        e.seen ? (n(), l("span", Ia, d(e.seen), 1)) : m("", !0)
      ]),
      default: b(() => [
        M[1] || (M[1] = h("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, Va = /* @__PURE__ */ G(Oa, [["__scopeId", "data-v-1a0bc478"]]), za = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, Ha = (e) => e.filter((o) => o.state !== "cancelled"), De = (e, o) => e.filter((t) => t.state === o).length;
function Ea({ tasks: e, inHand: o, perHour: t }) {
  const s = Ha(e), a = De(s, "completed"), g = za[o == null ? void 0 : o.state], M = s.length - a - (o && o.state !== "completed" ? 1 : 0), f = a === s.length;
  return {
    number: o.id,
    title: o.title,
    plan: o.plan_id ?? 0,
    count: `${a} of ${s.length}`,
    taskTip: `${a} of its ${s.length} tasks done${g ? `. This one is ${g.words}.` : "."}`,
    countTip: f ? `All ${s.length} tasks done` : `${a} done, 1 in hand, ${M} to go`,
    paceTip: !f && t ? `About ${t} an hour.` : "",
    rate: !f && t ? `${Math.round(t)}/hour` : "",
    bar: { total: s.length, done: a, testing: De(s, "testing") }
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
}, qa = {
  class: "task-line",
  "data-agent-task-line": ""
}, Da = {
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
    const o = e, t = i(() => o.inHand ? Ea({ tasks: o.tasks, inHand: o.inHand, perHour: o.perHour }) : null);
    return (s, a) => e.job && !t.value ? (n(), l("span", Na, [
      p(r(Ae), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: b(() => [
          h("b", null, d(e.job), 1)
        ]),
        default: b(() => [
          k(d(e.jobTitle || "Job"), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (n(), l("span", Wa, d(e.jobLaunch), 1)) : m("", !0)
    ])) : t.value ? (n(), l(U, { key: 1 }, [
      h("span", qa, [
        p(r(Ae), {
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${t.value.number}`,
          "aria-label": `Task ${t.value.number}: ${t.value.title}`,
          onClick: a[0] || (a[0] = ae((g) => r(xe)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: b(() => [
            h("b", null, d(t.value.title), 1),
            h("span", null, d(t.value.taskTip), 1)
          ]),
          default: b(() => [
            k("Task " + d(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"]),
        t.value.plan ? (n(), l("span", Da, "Plan " + d(t.value.plan), 1)) : m("", !0),
        t.value.rate ? (n(), l("span", Fa, d(t.value.rate), 1)) : m("", !0),
        p(r(Ae), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: b(() => [
            h("b", null, d(t.value.countTip), 1),
            t.value.paceTip ? (n(), l("span", Ua, d(t.value.paceTip), 1)) : m("", !0)
          ]),
          default: b(() => [
            k(d(t.value.count), 1)
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
}, Ja = /* @__PURE__ */ G(Pa, [["__scopeId", "data-v-d39df179"]]), Ga = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Ka = ["data-icon", "stroke-width", "innerHTML"], oe = {
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
}, Ya = {
  key: 1,
  class: "menu-item-text"
}, _a = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (o, t) => (n(), l("button", {
      type: "button",
      class: de(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (n(), l("span", Za, d(e.checked ? "✓" : ""), 1)) : m("", !0),
      e.description ? (n(), l("span", Ya, [
        h("span", null, [
          $e(o.$slots, "default", {}, void 0, !0)
        ]),
        h("small", null, d(e.description), 1)
      ])) : $e(o.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, fe = /* @__PURE__ */ G(_a, [["__scopeId", "data-v-fec99974"]]), Qa = {}, Xa = { class: "menu-label" };
function en(e, o) {
  return n(), l("span", Xa, [
    $e(e.$slots, "default", {}, void 0, !0)
  ]);
}
const we = /* @__PURE__ */ G(Qa, [["render", en], ["__scopeId", "data-v-aa955b3e"]]), tn = {
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
    const t = e, s = o, a = i(() => t.skills.filter((M) => M.state === "loaded")), g = i(() => t.skills.filter((M) => M.state !== "loaded"));
    return (M, f) => (n(), l("div", tn, [
      p(we, null, {
        default: b(() => [...f[1] || (f[1] = [
          k("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      a.value.length ? m("", !0) : (n(), l("p", an, "None yet. Compacting the conversation empties this list.")),
      (n(!0), l(U, null, se(a.value, (S) => (n(), l("p", {
        key: S.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        p(oe, {
          name: "book",
          size: 12
        }),
        k(d(S.skill), 1)
      ]))), 128)),
      g.value.length ? (n(), l(U, { key: 1 }, [
        p(we, null, {
          default: b(() => [...f[2] || (f[2] = [
            k("Still to read", -1)
          ])]),
          _: 1
        }),
        (n(!0), l(U, null, se(g.value, (S) => (n(), l("p", {
          key: S.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          p(oe, {
            name: "book",
            size: 12
          }),
          k(d(S.skill), 1)
        ]))), 128))
      ], 64)) : m("", !0),
      p(fe, {
        "data-agent-skills-browse": "",
        onClick: f[0] || (f[0] = (S) => s("browse"))
      }, {
        default: b(() => [...f[3] || (f[3] = [
          k("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, on = /* @__PURE__ */ G(nn, [["__scopeId", "data-v-be514d47"]]), sn = ["disabled", "title"], ln = { class: "gauge usage" }, rn = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: o }) {
    const t = e, s = o, a = i(() => t.windows[0] ?? null), g = i(() => a.value && Number.isFinite(a.value.used_percent) ? Math.max(0, Math.min(100, Math.round(a.value.used_percent))) : null), M = i(() => g.value !== null && g.value >= 100), f = i(() => {
      var R;
      return (R = a.value) != null && R.reset_epoch_seconds ? new Date(a.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), S = i(() => M.value ? `At usage limit: the plan's ${a.value.title} allowance is used up${f.value ? `, starts again ${f.value}` : ""}` : `${g.value}% of the plan's ${a.value.title} allowance used${f.value ? `, starts again ${f.value}` : ""}`);
    return (R, D) => g.value !== null ? (n(), l("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: S.value,
      onClick: D[0] || (D[0] = (q) => s("open", q.currentTarget))
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
      k(" " + d(M.value ? "At usage limit" : `${g.value}%`), 1)
    ], 8, sn)) : m("", !0);
  }
}, dn = /* @__PURE__ */ G(rn, [["__scopeId", "data-v-a36f09dc"]]), un = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (o, t) => (n(), l("span", {
      class: de(["badge", e.tone])
    }, d(e.text), 3));
  }
}, cn = /* @__PURE__ */ G(un, [["__scopeId", "data-v-9e7e1157"]]), gn = (e, o, t) => Math.max(o, Math.min(t, e)), Ke = /* @__PURE__ */ new WeakMap(), vn = (e, o) => Ke.set(e, o);
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
    const s = e, a = z(null), g = (v) => v ? `${v}px` : void 0, M = i(() => ({
      minWidth: g(s.minWidth),
      maxWidth: g(s.maxWidth),
      maxHeight: g(s.maxHeight),
      height: g(s.height)
    })), f = z({ w: 0, h: 0 }), S = z(s.anchor ? s.anchor.getBoundingClientRect() : null), R = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), D = (v) => ({
      left: Math.max(0, v.left),
      top: Math.max(0, v.top),
      right: Math.min(window.innerWidth, v.right),
      bottom: Math.min(window.innerHeight, v.bottom)
    }), q = (v) => {
      const I = v.closest(".pane, .float-window");
      return I ? D(I.getBoundingClientRect()) : R();
    }, H = (v, I) => `${Math.max(0, v ? Math.min(v, I) : I)}px`;
    function E(v, I) {
      return {
        below: v.bottom - I.bottom - s.gap - he,
        above: I.top - v.top - s.gap - he,
        across: v.right - v.left - 2 * he
      };
    }
    function A(v) {
      const I = q(s.anchor), w = E(I, v);
      return f.value.w <= w.across && f.value.h <= Math.max(w.below, w.above) ? I : R();
    }
    const O = i(() => {
      if (!S.value) return M.value;
      const v = S.value, I = A(v), w = E(I, v), { w: x, h: te } = f.value, J = s.align === "auto" ? v.left + v.right > I.left + I.right : s.align === "right", be = gn(J ? v.right - x : v.left, I.left + he, Math.max(I.left + he, I.right - x - he)), y = te > w.below && w.above > w.below ? { bottom: `${window.innerHeight - v.top + s.gap}px`, maxHeight: H(s.maxHeight, w.above) } : { top: `${v.bottom + s.gap}px`, maxHeight: H(s.maxHeight, w.below) };
      return { ...M.value, ...y, left: `${be}px`, maxWidth: H(s.maxWidth, w.across) };
    }), W = t, Z = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function K(v) {
      const I = Z(), w = I.indexOf(document.activeElement);
      I[(w + v + I.length) % I.length].focus();
    }
    const Q = { ArrowDown: () => K(1), ArrowUp: () => K(-1), Escape: () => W("close") }, X = (v) => Q[v.key] && (v.preventDefault(), Q[v.key]()), F = () => a.value && (f.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let C = 0;
    const u = new ResizeObserver(() => {
      cancelAnimationFrame(C), C = requestAnimationFrame(F);
    });
    mn(a, (v) => s.anchor && !s.anchor.contains(v.target) && W("close"));
    const Y = (v, I) => ["top", "left", "right", "bottom"].some((w) => Math.abs(v[w] - I[w]) > 1), B = (v) => v.bottom < 0 || v.top > window.innerHeight;
    let c = 0;
    function L() {
      if (s.anchor) {
        const v = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || B(v)) return W("close");
        Y(v, S.value) && (S.value = v);
      }
      c = requestAnimationFrame(L);
    }
    return at(() => {
      s.anchor && a.value && vn(a.value, s.anchor), F(), a.value && u.observe(a.value), !s.plain && Z()[0] && Z()[0].focus(), L();
    }), Me(() => {
      u.disconnect(), cancelAnimationFrame(c), cancelAnimationFrame(C);
    }), o({ element: a }), (v, I) => (n(), N(nt, {
      to: "body",
      disabled: !e.anchor
    }, [
      h("div", ot({
        ref_key: "panel",
        ref: a
      }, v.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: O.value,
        onKeydown: X
      }), [
        $e(v.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), fn = /* @__PURE__ */ G(hn, [["__scopeId", "data-v-3d203970"]]);
async function bn(e, o, t) {
  if (!e) return t(o);
  const { target: s, fields: a } = e, g = Object.fromEntries(Object.keys(a).map((S) => [S, s[S]])), M = () => Object.assign(s, g);
  Object.assign(s, a);
  let f = !1;
  try {
    const S = await t(o);
    return f = S.ok, S;
  } finally {
    f || M();
  }
}
function kn(e, o, t, { groups: s, programs: a }) {
  const g = z({}), M = z(""), f = z(!1), S = i(() => !!e.value && !e.value.ended_at), R = i(() => S.value && !!e.value.paused_at);
  async function D(A, O = null) {
    M.value = "";
    const W = await bn(O, A, o);
    return M.value = W.ok ? "" : W.error, t(), W;
  }
  return { groups: s, programs: a, chosen: g, failure: M, asking: f, running: S, paused: R, choose: (A, O) => D(["agent", "control", String(e.value.number), A, O.value], { target: g, fields: { value: { ...g.value, [A]: O.label } } }), stop: () => (f.value = !1, D(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (A) => D(["agent", "launch", A.name]) };
}
function yn(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const wn = ["disabled", "title"], Mn = ["disabled", "title"], $n = { class: "gauge" }, xn = ["disabled", "title"], Sn = ["disabled"], Cn = ["disabled"], jn = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, An = ["title"], Tn = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Ln = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Bn = { class: "gauge" }, Rn = { class: "context-used" }, In = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, On = 75, Vn = {
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
    const t = e, s = o, a = kn(Re(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => s("changed"), { groups: Re(t, "controlGroups"), programs: Re(t, "agentPrograms") }), g = z(null), M = z(""), f = i(() => a.groups.value.find((C) => C.key === M.value));
    function S(C, u) {
      g.value = C.currentTarget, M.value = u;
    }
    function R() {
      g.value = null, M.value = "", a.asking.value = !1;
    }
    const D = i(() => t.skills.filter((C) => C.state === "loaded"));
    function q(C) {
      S(C, "skills"), s("skills");
    }
    const H = (C) => a.groups.value.some((u) => u.key === C), E = i(() => {
      var C;
      return a.chosen.value.model ?? ((C = O.value) == null ? void 0 : C.model) ?? "";
    }), A = i(() => {
      var C;
      return a.chosen.value.effort ?? ((C = O.value) == null ? void 0 : C.effort) ?? "";
    });
    i(() => !!t.agent && !t.agent.ended_at);
    const O = i(() => {
      var C;
      return ((C = t.usage.agents) == null ? void 0 : C.find((u) => {
        var Y;
        return u.id === ((Y = t.agent) == null ? void 0 : Y.id);
      })) ?? null;
    }), W = i(() => {
      var C;
      return ((C = O.value) == null ? void 0 : C.context_percent) == null ? null : Math.round(O.value.context_percent);
    }), Z = (C) => `${Math.round(C / 1e3)}k`, K = i(() => {
      var C;
      return !!((C = O.value) != null && C.context_limit_tokens);
    }), Q = i(() => {
      var C, u;
      return ((C = O.value) == null ? void 0 : C.context_limit_tokens) || ((u = O.value) == null ? void 0 : u.context_window_tokens) || 0;
    }), X = i(() => Q.value ? `${Z(O.value.context_tokens ?? 0)} of ${Z(Q.value)}` : ""), F = i(() => {
      var C;
      return (C = O.value) != null && C.cost_dollars ? `$${O.value.cost_dollars.toFixed(2)}` : "";
    });
    return (C, u) => {
      var Y;
      return n(), l("div", {
        class: de(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (n(), l(U, { key: 0 }, [
          h("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: u[0] || (u[0] = (B) => S(B, "agent"))
          }, [
            p(oe, {
              name: "agents",
              size: 12
            }),
            k(" " + d(((Y = e.agentPrograms.find((B) => B.name === e.agent.program)) == null ? void 0 : Y.title) || e.agent.program), 1)
          ], 8, wn),
          p(dn, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: u[1] || (u[1] = (B) => s("open", "usage", B))
          }, null, 8, ["windows", "disabled"]),
          W.value !== null ? (n(), l("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${W.value}% full: clear or compact it`,
            onClick: u[2] || (u[2] = (B) => H("context") ? S(B, "context") : s("open", "context", B.currentTarget))
          }, [
            p(oe, {
              name: "gauge",
              size: 12
            }),
            u[14] || (u[14] = k()),
            h("span", $n, [
              h("span", {
                style: Te({ width: `${W.value}%` })
              }, null, 4)
            ]),
            k(" " + d(W.value) + "% ", 1)
          ], 8, Mn)) : m("", !0),
          E.value ? (n(), l("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${E.value}: change the model`,
            onClick: u[3] || (u[3] = (B) => H("model") ? S(B, "model") : null)
          }, [
            p(oe, {
              name: "model",
              size: 12
            }),
            k(" " + d(E.value), 1)
          ], 8, xn)) : m("", !0),
          H("effort") || e.card && A.value ? (n(), l("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: u[4] || (u[4] = (B) => S(B, "effort"))
          }, [
            p(oe, {
              name: "bolt",
              size: 12
            }),
            k(" " + d(A.value), 1)
          ], 8, Sn)) : m("", !0),
          F.value ? (n(), l("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: u[5] || (u[5] = (B) => s("open", "cost", B.currentTarget))
          }, d(F.value), 9, Cn)) : m("", !0),
          e.branch ? (n(), l("span", jn, [
            p(oe, {
              name: "branch",
              size: 12
            }),
            k(" " + d(e.branch), 1)
          ])) : m("", !0),
          e.card ? m("", !0) : (n(), l("button", {
            key: 5,
            type: "button",
            class: de(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: u[6] || (u[6] = (B) => s("open", "jobs", B.currentTarget))
          }, [
            p(oe, {
              name: "clock",
              size: 12
            }),
            k(" " + d(e.jobs), 1)
          ], 2)),
          e.run ? (n(), l("button", {
            key: 6,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: q
          }, [
            p(oe, {
              name: "book",
              size: 12
            }),
            k(" " + d(D.value.length), 1)
          ])) : m("", !0),
          e.fitness ? (n(), l(U, { key: 7 }, [
            h("button", {
              type: "button",
              class: de(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < On }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: u[7] || (u[7] = (B) => s("open", "fitness", B.currentTarget))
            }, [
              p(oe, {
                name: "heart",
                size: 12
              }),
              k(" " + d(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            h("button", {
              type: "button",
              class: de(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: u[8] || (u[8] = (B) => s("open", "load", B.currentTarget))
            }, [
              p(oe, {
                name: "weight",
                size: 12
              }),
              k(" " + d(e.fitness.workload), 1)
            ], 2)
          ], 64)) : m("", !0)
        ], 64)) : e.run && !e.loading ? (n(), l("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: u[9] || (u[9] = (B) => S(B, "start"))
        }, [
          p(oe, {
            name: "agents",
            size: 12
          }),
          u[15] || (u[15] = k(" Start an agent", -1))
        ])) : m("", !0),
        u[21] || (u[21] = h("span", { class: "space" }, null, -1)),
        r(a).failure.value ? (n(), l("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: r(a).failure.value
        }, d(r(a).failure.value), 9, An)) : m("", !0),
        $e(C.$slots, "default", {}, void 0, !0),
        g.value ? (n(), N(fn, {
          key: 3,
          anchor: g.value,
          "min-width": 190,
          onClose: R
        }, {
          default: b(() => {
            var B;
            return [
              M.value === "agent" ? (n(), l(U, { key: 0 }, [
                r(a).asking.value ? (n(), l(U, { key: 0 }, [
                  p(we, { "data-agent-stop-ask": "" }, {
                    default: b(() => [...u[16] || (u[16] = [
                      k("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  p(fe, {
                    "data-agent-stop-confirm": "",
                    onClick: u[10] || (u[10] = (c) => (R(), r(a).stop()))
                  }, {
                    default: b(() => [...u[17] || (u[17] = [
                      k("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  p(fe, {
                    onClick: u[11] || (u[11] = (c) => r(a).asking.value = !1)
                  }, {
                    default: b(() => [...u[18] || (u[18] = [
                      k("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (n(), N(fe, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: u[12] || (u[12] = (c) => r(a).asking.value = !0)
                }, {
                  default: b(() => [...u[19] || (u[19] = [
                    k("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : M.value === "start" ? (n(), l(U, { key: 1 }, [
                p(we, null, {
                  default: b(() => [...u[20] || (u[20] = [
                    k("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (n(!0), l(U, null, se(r(a).programs.value, (c) => (n(), N(fe, {
                  key: c.name,
                  "data-agent-program": c.name,
                  onClick: (L) => (R(), r(a).start(c))
                }, {
                  default: b(() => [
                    k(d(c.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : M.value === "skills" ? (n(), N(on, {
                key: 2,
                skills: e.skills,
                onBrowse: u[13] || (u[13] = (c) => (R(), s("open", "skills", null)))
              }, null, 8, ["skills"])) : f.value ? (n(), l(U, { key: 3 }, [
                p(we, null, {
                  default: b(() => [
                    k(d(f.value.label), 1)
                  ]),
                  _: 1
                }),
                M.value === "context" ? (n(), l(U, { key: 0 }, [
                  h("p", Tn, d(r(yn)(((B = O.value) == null ? void 0 : B.last_compaction) ?? null)), 1),
                  h("div", Ln, [
                    h("span", Bn, [
                      h("span", {
                        style: Te({ width: `${W.value}%` })
                      }, null, 4)
                    ]),
                    h("span", Rn, d(W.value) + "%", 1)
                  ]),
                  X.value ? (n(), l("p", In, [
                    k(d(X.value) + " ", 1),
                    K.value ? (n(), N(cn, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : m("", !0)
                  ])) : m("", !0)
                ], 64)) : m("", !0),
                (n(!0), l(U, null, se(f.value.choices, (c) => (n(), N(fe, {
                  key: c.value,
                  "data-agent-choice": c.value,
                  onClick: (L) => (r(a).choose(f.value.key, c), R())
                }, {
                  default: b(() => [
                    k(d(c.label), 1)
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
}, zn = /* @__PURE__ */ G(Vn, [["__scopeId", "data-v-c1e2d220"]]), Hn = ["data-agent-open", "aria-expanded", "role", "tabindex"], En = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Nn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Wn = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, qn = { class: "agent-line" }, Dn = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Fn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, Un = {
  key: 1,
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, Pn = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Jn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), s = { helper: "Helper", reviewer: "Reviewer", main: "Main agent" }, a = e, g = o, M = Ge(), f = i(() => {
      var y, re;
      if ((y = a.facts) != null && y.profile_title) return a.facts.profile_title;
      if ((re = a.facts) != null && re.profile) return a.facts.profile;
      const $ = s[a.row.role] || a.row.role;
      return $.slice(0, 1).toUpperCase() + $.slice(1);
    }), S = i(() => {
      var $;
      return (($ = a.facts) == null ? void 0 : $.tasks) ?? [];
    }), R = i(() => S.value.filter(($) => $.state === "open")), D = i(() => S.value.find(($) => {
      var y;
      return $.id === ((y = a.progress) == null ? void 0 : y.task_id) && $.state === "started";
    })), q = i(() => D.value || S.value.find(($) => {
      var y;
      return $.id === ((y = a.facts) == null ? void 0 : y.task_id);
    }) || S.value.find(($) => t.has($.state)) || R.value[0] || S.value.at(-1)), H = i(() => {
      var $, y, re, le, ue, ne;
      return a.row.role === "helper" ? (($ = a.facts) == null ? void 0 : $.helper_job) || "" : (y = a.facts) != null && y.job_enabled && (((re = D.value) == null ? void 0 : re.title) || ((le = a.facts) == null ? void 0 : le.task_title) || ((ue = R.value[0]) == null ? void 0 : ue.title) || ((ne = S.value.at(-1)) == null ? void 0 : ne.title)) || "";
    }), E = i(() => `${a.row.role} ${a.row.number}`), A = i(() => {
      var $, y;
      return [a.row.program, ($ = a.facts) == null ? void 0 : $.model, (y = a.facts) == null ? void 0 : y.effort, E.value].filter(Boolean).join(" · ");
    }), O = Be(), W = i(() => mt(a.row.process_started_at || a.row.created_at, M.value)), Z = /* @__PURE__ */ new Set(["open", "started", "testing"]), K = { fresh: "new conversation", resumed: "resumed" }, Q = i(() => {
      var $, y;
      return [($ = a.facts) == null ? void 0 : $.helper_job_program, K[(y = a.facts) == null ? void 0 : y.occupant_launch]].filter(Boolean).join(", ");
    }), X = i(() => {
      var $;
      return ($ = a.facts) == null ? void 0 : $.work_status;
    }), F = i(() => !!a.row.ended_at && a.row.role !== "main" && S.value.some(($) => Z.has($.state))), C = i(() => {
      var $, y;
      return a.row.state === "running" && (($ = a.facts) == null ? void 0 : $.state) === "at usage limit" && !!((y = a.facts) != null && y.usage_limit_ends_at);
    }), u = ($) => new Date($).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), Y = i(() => a.row.halted_at ? `Stopped at the usage limit since ${u(a.row.halted_at)}, goes on at ${u(a.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(a.facts.usage_limit_ends_at).toLocaleString()}`), B = i(() => {
      var $;
      return a.row.retired_at || a.row.state === "retired" ? "retired" : C.value || X.value || a.waitReason || F.value ? "waiting" : a.row.state === "running" && (($ = a.facts) == null ? void 0 : $.state) || a.row.state;
    }), c = i(() => {
      var $;
      return C.value ? Y.value : X.value ? `Status: ${X.value}` : a.waitReason ? `Waiting: ${a.waitReason}` : B.value === "blocked" ? ($ = a.facts) != null && $.blocked_reason ? `Blocked: ${a.facts.blocked_reason}` : "Blocked" : F.value ? "Stopped with work left" : "";
    }), L = i(() => {
      var $;
      return (($ = a.progress) == null ? void 0 : $.completed_count) ?? S.value.filter((y) => y.state === "completed").length;
    }), v = i(() => {
      var $;
      return ht(L.value, (($ = a.progress) == null ? void 0 : $.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, M.value);
    }), I = i(() => a.row.role === "main" ? 0 : v.value), w = i(() => !!a.row.retired_at || a.row.state === "retired"), x = i(() => w.value ? "Retired" : B.value === "blocked" || B.value === "waiting" ? c.value || (B.value === "blocked" ? "Blocked" : "Waiting") : a.row.ended_at ? "Idle: its process has stopped" : "Working"), te = i(() => {
      var y;
      if (w.value) return a.row.retired_at;
      const $ = B.value === "blocked" || B.value === "waiting";
      return a.row.ended_at || $ && ((y = a.facts) == null ? void 0 : y.last_activity) || a.row.process_started_at || a.row.created_at;
    }), J = i(() => ft(te.value, M.value)), be = i(() => {
      var $;
      return bt(($ = a.facts) == null ? void 0 : $.last_activity, M.value);
    });
    return ($, y) => {
      var re, le, ue, ne, ke, pe;
      return n(), l("div", {
        class: de(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: y[3] || (y[3] = (_) => !e.open && g("toggle")),
        onKeydown: [
          y[4] || (y[4] = We(ae((_) => !e.open && g("toggle"), ["self", "prevent"]), ["enter"])),
          y[5] || (y[5] = We(ae((_) => !e.open && g("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        p(r(kt), {
          "agent-id": e.row.id,
          label: f.value,
          class: "agent-head"
        }, {
          default: b(() => {
            var _;
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
              h("span", En, d(f.value), 1),
              h("span", Nn, d(((_ = e.facts) == null ? void 0 : _.given_name) || e.row.id), 1),
              e.open ? m("", !0) : (n(), N(r(Oe), {
                key: 1,
                class: "agent-chevron",
                name: "chevronRight",
                size: 12
              })),
              e.open ? (n(), l("span", Wn, d(W.value), 1)) : m("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-id", "label"]),
        h("span", qn, [
          h("span", Dn, d(A.value), 1),
          (re = e.facts) != null && re.sandbox_off ? (n(), l("span", Fn, "sandbox off")) : m("", !0),
          e.open ? (n(), l("span", Un, [
            y[6] || (y[6] = k("Started ", -1)),
            p(r(Le), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : m("", !0),
          e.open && ((le = e.facts) != null && le.last_activity) ? (n(), l("span", Pn, [
            y[7] || (y[7] = k("Seen ", -1)),
            p(r(Le), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : m("", !0)
        ]),
        e.open ? (n(), N(zn, {
          key: 0,
          "agent-programs": r(O).props.programs.rows.value,
          agent: e.row,
          branch: (ue = e.progress) == null ? void 0 : ue.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((ne = e.facts) == null ? void 0 : ne.windows) ?? [] },
          card: ""
        }, {
          default: b(() => {
            var _;
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
              e.row.role === "helper" && (!e.row.ended_at || (_ = e.facts) != null && _.helper_job_open) ? (n(), N(r(ee), {
                key: 0,
                variant: "ghost",
                small: "",
                "data-helper-stop": "",
                onClick: y[2] || (y[2] = ae((ye) => r(O).run(["helper", "stop", String(e.row.number)]), ["stop"]))
              }, {
                default: b(() => [
                  k(d(e.row.ended_at ? "End job" : "Stop"), 1)
                ]),
                _: 1
              })) : m("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : m("", !0),
        e.open ? m("", !0) : (n(), N(Ja, {
          key: 1,
          tasks: S.value,
          "in-hand": e.row.role !== "helper" && ((ke = e.facts) != null && ke.job_enabled) && q.value || null,
          job: e.row.role === "helper" ? H.value : "",
          "job-title": e.row.role === "helper" && ((pe = e.facts) == null ? void 0 : pe.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? Q.value : "",
          "per-hour": I.value
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour"])),
        p(Va, {
          state: B.value,
          doing: x.value,
          since: J.value,
          seen: be.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (n(), N(oa, {
          key: 2,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: S.value,
          "stopped-with-work": F.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : m("", !0)
      ], 42, Hn);
    };
  }
}, Gn = /* @__PURE__ */ G(Jn, [["__scopeId", "data-v-45e28131"]]), Kn = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Zn = ["data-agent-row", "data-agent-lingering"], Fe = "journal.agents.filters", Ue = 300 * 1e3, je = "cubic-bezier(0.2, 0.9, 0.25, 1)", Yn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const o = e, t = Be(), { rows: s } = t.props.waits, { rows: a } = t.props.progress, { rows: g, failure: M, loaded: f, more: S } = t.props.agents, R = (T) => a.value.find((V) => V.agent_id === T.id) ?? null, D = (T) => {
      var V;
      return ((V = s.value.find((j) => j.agent_id === T.id)) == null ? void 0 : V.reason) ?? "";
    }, q = z("running"), H = z(""), E = JSON.parse(localStorage.getItem(Fe) || '{"roles":[],"profiles":[],"programs":[]}'), A = z(E), O = i(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: W } = t.props.programs, Z = i(() => A.value.roles.length + A.value.profiles.length + A.value.programs.length), K = (T, V) => {
      A.value = $t(A.value, T, V);
    }, Q = () => {
      A.value = { roles: [], profiles: [], programs: [] };
    }, X = (T) => T.slice(0, 1).toUpperCase() + T.slice(1);
    ce(A, (T) => localStorage.setItem(Fe, JSON.stringify(T)));
    const F = z(25);
    function C() {
      Object.assign(t.state, {
        "agents.show": q.value,
        "agents.search": H.value,
        "agents.limit": String(F.value),
        "agents.roles": A.value.roles.join(","),
        "agents.profiles": A.value.profiles.join(","),
        "agents.programs": A.value.programs.join(",")
      });
    }
    async function u() {
      return F.value += 25, C(), await t.reload("agents"), !0;
    }
    ce([q, H, A], () => {
      F.value = 25, C(), t.reload("agents");
    }), C();
    const Y = (T) => T.facts ?? null, B = g, c = Ge(), L = z([]), v = i(() => new Set(L.value.filter((T) => c.value - T.left < Ue).map((T) => T.row.id))), I = i(() => L.value.filter((T) => v.value.has(T.row.id)).map((T) => T.row)), w = i(() => [...B.value, ...I.value]);
    let x = "", te = [];
    async function J(T) {
      await t.reload(`card.${T.id}`);
      const V = t.props[`card.${T.id}`].rows.value.find((j) => j.id === T.id);
      V != null && V.ended_at && !L.value.some((j) => j.row.id === T.id) && (L.value = [...L.value, { row: V, left: Date.now() }]);
    }
    ce(g, (T) => {
      const V = x === `${q.value}|${H.value}|${JSON.stringify(A.value)}` && q.value === "running", j = V ? te.filter((P) => !T.some((ge) => ge.id === P.id)) : [];
      x = `${q.value}|${H.value}|${JSON.stringify(A.value)}`, te = T, L.value = V ? L.value.filter((P) => c.value - P.left < Ue && !T.some((ge) => ge.id === P.row.id)) : [], j.forEach(J);
    }, { immediate: !0 });
    const be = i(() => !!H.value.trim() || Z.value > 0), $ = i(() => o.texts[q.value] ?? { title: o.empty, hint: "" }), y = z(null), re = z(null), le = z(null), ue = z(null), ne = i(() => y.value === null ? null : t.props[`card.${y.value}`].rows.value.find((T) => T.id === y.value) ?? re.value), ke = i(() => ne.value ? [ne.value] : w.value), pe = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, _ = z(!1);
    let ye = 0;
    async function Ze(T) {
      if (_.value) return;
      _.value = !0, ye = ue.value.scrollTop;
      const V = le.value.querySelector(`[data-agent-open="${T.id}"]`);
      if (!pe()) {
        const ve = [...le.value.querySelectorAll(".agent-row")].filter((ie) => !ie.contains(V));
        await Promise.all(ve.map((ie) => ie.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const j = [...V.querySelectorAll(".agent-head, .agent-line")], P = [...j, ...V.querySelectorAll("[data-agent-motion]")], ge = P.map((ve) => ve.getBoundingClientRect());
      if (re.value = T, y.value = T.id, t.reload(`card.${T.id}`), await qe(), !pe()) {
        const ve = P.map((ie) => ie.getBoundingClientRect());
        P.forEach((ie, Se) => {
          const me = j.findIndex((Ne) => Ne !== ie && Ne.contains(ie)), _e = ge[Se].left - ve[Se].left - (me < 0 ? 0 : ge[me].left - ve[me].left), Qe = ge[Se].top - ve[Se].top - (me < 0 ? 0 : ge[me].top - ve[me].top);
          ie.animate([{ transform: `translate(${_e}px, ${Qe}px)` }, { transform: "none" }], { duration: 280, easing: je });
        }), le.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((ie) => {
          ie.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: je, fill: "backwards" });
        });
      }
      _.value = !1;
    }
    async function He() {
      if (_.value || !ne.value) return;
      _.value = !0;
      const T = le.value.querySelector(`[data-agent-open="${y.value}"]`), V = [...T.children], j = pe() ? [] : V.map((P) => P.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(j.map((P) => P.finished)), y.value = null, await qe(), ue.value.scrollTop = ye, j.forEach((P) => P.cancel()), pe() || (T.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: je }), le.value.querySelectorAll(".agent-row").forEach((P) => {
        P.contains(T) || P.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: je });
      })), _.value = !1;
    }
    const Ye = (T) => y.value === T.id ? He() : Ze(T);
    ce(H, (T) => T.trim() && (y.value = null)), ce(q, () => {
      y.value = null;
    });
    const Ee = (T) => {
      T.key === "Escape" && He();
    };
    return window.addEventListener("keydown", Ee), Me(() => window.removeEventListener("keydown", Ee)), (T, V) => (n(), l("div", {
      ref_key: "agents",
      ref: le,
      class: de(["agents", { focused: ne.value, "card-changing": _.value }])
    }, [
      ne.value ? m("", !0) : (n(), N(r(yt), {
        key: 0,
        modelValue: H.value,
        "onUpdate:modelValue": V[1] || (V[1] = (j) => H.value = j),
        placeholder: "Search agents",
        "menu-count": Z.value,
        "data-agents-search": ""
      }, {
        menu: b(() => [
          p(r(Ie), null, {
            default: b(() => [...V[2] || (V[2] = [
              k("Type", -1)
            ])]),
            _: 1
          }),
          (n(!0), l(U, null, se(O.value.roles, (j) => (n(), N(r(Ce), {
            key: j,
            role: "menuitemcheckbox",
            "aria-checked": A.value.roles.includes(j),
            checked: A.value.roles.includes(j),
            "data-filter-role": j,
            onClick: (P) => K("roles", j)
          }, {
            default: b(() => [
              k(d(X(j)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          O.value.profiles.length ? (n(), N(r(Ie), { key: 0 }, {
            default: b(() => [...V[3] || (V[3] = [
              k("Profile", -1)
            ])]),
            _: 1
          })) : m("", !0),
          (n(!0), l(U, null, se(O.value.profiles, (j) => (n(), N(r(Ce), {
            key: j.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.profiles.includes(j.name),
            checked: A.value.profiles.includes(j.name),
            "data-filter-profile": j.name,
            onClick: (P) => K("profiles", j.name)
          }, {
            default: b(() => [
              k(d(j.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          p(r(Ie), null, {
            default: b(() => [...V[4] || (V[4] = [
              k("Program", -1)
            ])]),
            _: 1
          }),
          (n(!0), l(U, null, se(r(W), (j) => (n(), N(r(Ce), {
            key: j.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.programs.includes(j.name),
            checked: A.value.programs.includes(j.name),
            "data-filter-program": j.name,
            onClick: (P) => K("programs", j.name)
          }, {
            default: b(() => [
              k(d(j.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          Z.value ? (n(), N(r(Ce), {
            key: 1,
            "data-filter-clear": "",
            onClick: Q
          }, {
            default: b(() => [...V[5] || (V[5] = [
              k("Clear filters", -1)
            ])]),
            _: 1
          })) : m("", !0)
        ]),
        default: b(() => [
          p(r(wt), {
            options: O.value.states,
            value: q.value,
            onPick: V[0] || (V[0] = (j) => q.value = j)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      q.value === "retired" && O.value.upgrade_retired ? (n(), l("p", Kn, "Retired during the upgrade: " + d(O.value.upgrade_retired), 1)) : m("", !0),
      h("div", {
        ref_key: "list",
        ref: ue,
        class: de(["agents-view", { "agents-view-open": ne.value }])
      }, [
        r(f) && !r(M) && !ke.value.length && Z.value ? (n(), N(r(Ve), {
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
              default: b(() => [...V[6] || (V[6] = [
                k("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (n(), N(r(Mt), {
          key: 1,
          moves: "",
          "leaves-at-once": _.value,
          rows: ke.value,
          failure: r(M),
          loaded: r(f),
          more: !ne.value && r(S),
          older: u,
          empty: $.value.title,
          hint: $.value.hint,
          searching: be.value
        }, {
          default: b(({ row: j }) => [
            h("div", {
              class: de(["agent-row", { lingering: v.value.has(j.id) && j.id !== y.value }]),
              "data-agent-row": j.id,
              "data-agent-lingering": v.value.has(j.id) ? "" : null
            }, [
              p(Gn, {
                row: j,
                facts: Y(j),
                progress: R(j),
                "wait-reason": D(j),
                open: j.id === y.value,
                onToggle: (P) => Ye(j)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, Zn)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, eo = /* @__PURE__ */ G(Yn, [["__scopeId", "data-v-fceb20c3"]]);
export {
  eo as A
};
