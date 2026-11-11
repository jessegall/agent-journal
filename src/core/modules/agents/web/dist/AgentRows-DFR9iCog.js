import { openBlock as a, createElementBlock as l, withModifiers as ee, unref as d, createTextVNode as h, toDisplayString as g, createVNode as p, createBlock as V, computed as c, createElementVNode as k, createCommentVNode as m, withCtx as b, Fragment as F, renderList as ne, ref as O, watch as ge, onUnmounted as Ce, defineAsyncComponent as Xe, createSlots as et, resolveDynamicComponent as tt, normalizeClass as de, normalizeStyle as Re, renderSlot as Ae, onMounted as at, Teleport as nt, mergeProps as ot, toRef as Ve, withKeys as qe, nextTick as Fe } from "vue";
import { peekRef as we, Icon as He, RunningCommand as st, TimeAgo as Ie, FoldGroup as Je, TaskStatusIcon as lt, useWindow as Oe, loadWindowComponent as rt, coalesced as it, READ_RATES as dt, eventMayBeChildOf as ut, InnerTabs as ct, TabBody as gt, SwitchCase as Ke, EmptyState as Ee, TextInput as Ne, Btn as te, TextArea as vt, HoverTip as xe, TaskBar as mt, useNow as Ze, age as pt, perHour as ft, sinceWords as ht, seenWords as bt, AgentTip as kt, SearchBar as yt, Segmented as wt, MenuLabel as ze, MenuItem as Le, RowList as Mt, toggleFilter as $t } from "@journal/window-kit";
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
        onClick: t[0] || (t[0] = ee((s) => d(we)("test_queue:0"), ["stop"]))
      }, [
        h("Waiting: " + g(e.waitReason) + " ", 1),
        p(d(He), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), l("span", Ct, "Waiting")) : (a(), V(d(st), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, Tt = /* @__PURE__ */ J(At, [["__scopeId", "data-v-1b371fb5"]]), jt = {
  class: "lasting-facts",
  "data-agent-lasting-facts": ""
}, Lt = { key: 0 }, Bt = { "data-agent-driver-name": "" }, Rt = { key: 1 }, It = { "data-agent-first-dispatched": "" }, Ot = { "data-agent-session-count": "" }, Vt = { key: 2 }, zt = { "data-agent-session-end-reason": "" }, Ht = { key: 3 }, Et = { "data-agent-retired-at": "" }, Nt = { key: 4 }, Wt = { "data-agent-retired-by": "" }, Dt = {
  __name: "AgentLastingFacts",
  props: { row: { type: Object, required: !0 }, programTitle: { type: String, default: "" }, effort: { type: String, default: "" } },
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
    }, t = e, s = c(() => t.programTitle || (t.row.program ? t.row.program.slice(0, 1).toUpperCase() + t.row.program.slice(1) : "")), u = c(() => [s.value, t.row.program_model, t.effort].filter(Boolean).join(", ")), n = c(() => t.row.replaced_session_end_reason ? o[t.row.replaced_session_end_reason] || t.row.replaced_session_end_reason.replaceAll("_", " ") : "");
    return (y, f) => (a(), l("dl", jt, [
      u.value ? (a(), l("div", Lt, [
        f[0] || (f[0] = k("dt", null, "Driver", -1)),
        k("dd", Bt, g(u.value), 1)
      ])) : m("", !0),
      e.row.created_at ? (a(), l("div", Rt, [
        f[1] || (f[1] = k("dt", null, "Started", -1)),
        k("dd", It, [
          p(d(Ie), {
            at: e.row.created_at
          }, null, 8, ["at"])
        ])
      ])) : m("", !0),
      k("div", null, [
        f[2] || (f[2] = k("dt", null, "Sessions", -1)),
        k("dd", Ot, g(e.row.session_count ?? 0), 1)
      ]),
      n.value ? (a(), l("div", Vt, [
        f[3] || (f[3] = k("dt", null, "Last session ended", -1)),
        k("dd", zt, g(n.value), 1)
      ])) : m("", !0),
      e.row.retired_at ? (a(), l("div", Ht, [
        f[4] || (f[4] = k("dt", null, "Retired", -1)),
        k("dd", Et, [
          p(d(Ie), {
            at: e.row.retired_at
          }, null, 8, ["at"])
        ])
      ])) : m("", !0),
      e.row.retiring_actor_name ? (a(), l("div", Nt, [
        f[5] || (f[5] = k("dt", null, "Retired by", -1)),
        k("dd", Wt, g(e.row.retiring_actor_name), 1)
      ])) : m("", !0)
    ]));
  }
}, qt = /* @__PURE__ */ J(Dt, [["__scopeId", "data-v-1cdf1478"]]), Ft = ["data-agent-delegated", "onClick"], Ut = { class: "agent-task-number" }, Pt = { class: "agent-task-title" }, Gt = ["title"], Jt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = o;
    return (s, u) => (a(), V(d(Je), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: u[0] || (u[0] = (n) => t("toggle"))
    }, {
      default: b(() => [
        (a(!0), l(F, null, ne(e.section.tasks, (n) => (a(), l("button", {
          key: n.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": n.id,
          onClick: (y) => d(we)(`tasks:${n.id}`)
        }, [
          p(d(lt), {
            status: n.state
          }, null, 8, ["status"]),
          k("span", Ut, g(n.id), 1),
          k("span", Pt, g(n.title), 1),
          n.plan_id ? (a(), l("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${n.plan_id}: ${n.plan_title}`
          }, "Plan " + g(n.plan_id), 9, Gt)) : m("", !0)
        ], 8, Ft))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Kt = /* @__PURE__ */ J(Jt, [["__scopeId", "data-v-ea4ccd6b"]]), Zt = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, _t = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Yt = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, Qt = ["data-peek", "onClick"], Xt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ea = {
  key: 0,
  class: "agent-helper-brief"
}, ta = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, aa = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, na = "It ended without a report", oa = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const o = e, t = ["started", "blocked", "open", "completed"], s = c(() => {
      var i, r;
      return o.row.ended_at && ((r = (i = o.facts) == null ? void 0 : i.job_returned) != null && r.startsWith(na)) ? o.facts.job_returned : "";
    }), u = c(() => o.tasks.length ? t.map((i) => ({ state: i, label: i.slice(0, 1).toUpperCase() + i.slice(1), tasks: o.tasks.filter((r) => r.state === i || i === "started" && r.state === "testing" || i === "completed" && r.state === "cancelled") })) : []), n = /* @__PURE__ */ new Set(["completed"]), y = O({}), f = (i) => !(y.value[i] ?? n.has(i)), j = (i) => y.value = { ...y.value, [i]: f(i) }, $ = Oe(), { rows: N } = $.props.reports;
    $.state["reports.agent"] = String(o.row.number);
    const D = c(() => o.row.access === "read-only"), z = c(() => !!o.row.retired_at || o.row.state === "retired"), H = ["tasks", "transcript", "terminal", "file-feed", "reports", "memories"], C = c(() => (z.value ? $.tabs.filter((r) => ["reports", "transcript", "memories"].includes(r.key)) : D.value ? $.tabs.filter((r) => ["reports", "transcript", "terminal", "memories"].includes(r.key)) : [...$.tabs]).sort((r, B) => (H.indexOf(r.key) < 0 ? H.length : H.indexOf(r.key)) - (H.indexOf(B.key) < 0 ? H.length : H.indexOf(B.key)))), R = () => D.value || z.value ? C.value.find((i) => i.key === "transcript") : C.value[0], E = O(R());
    ge(E, (i) => {
      $.state.tab = (i == null ? void 0 : i.key) ?? "";
    }, { immediate: !0 }), Ce(() => {
      $.state.tab = "";
    }), ge(C, (i) => {
      i.some((r) => {
        var B;
        return r.key === ((B = E.value) == null ? void 0 : B.key);
      }) || (E.value = i[0]);
    }), ge(() => o.open, (i) => {
      i && (E.value = R());
    });
    const K = Object.fromEntries($.tabs.filter((i) => i.component).map((i) => [i.key, Xe(() => rt(i.component))])), G = O(!1), { data: Q } = $.props.tool, oe = c(() => {
      var i;
      return ((i = $.props.programs.rows.value.find((r) => r.name === o.row.program)) == null ? void 0 : i.title) ?? "";
    }), U = c(() => {
      var i;
      return ((i = Q.value) == null ? void 0 : i.tool) ?? "";
    }), Z = c(() => {
      var i;
      return ((i = Q.value) == null ? void 0 : i.note) ?? "";
    }), M = c(() => o.row.role !== "main" && (!o.row.ended_at || o.stoppedWithWork || o.waitReason));
    async function v() {
      !o.open || !M.value || ($.state["tool.agent"] = String(o.row.number), await $.reload("tool"));
    }
    const _ = it(v, dt.agentCommand), Y = $.follow(["hook_call.*", "process_part.*"], (i) => ut(i, "session_agent_id", /* @__PURE__ */ new Set([o.row.id])) && _());
    return Ce(() => Y == null ? void 0 : Y()), ge(() => o.open, (i) => {
      i && v();
    }, { immediate: !0 }), (i, r) => {
      var B, L;
      return a(), l("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: r[2] || (r[2] = ee(() => {
        }, ["stop"]))
      }, [
        p(qt, {
          row: e.row,
          "program-title": oe.value,
          effort: ((B = e.facts) == null ? void 0 : B.effort) || ""
        }, null, 8, ["row", "program-title", "effort"]),
        e.row.retirement_reason ? (a(), l("p", Zt, "Retirement reason: " + g(e.row.retirement_reason), 1)) : m("", !0),
        e.row.resume_reason ? (a(), l("p", _t, g(e.row.resume_reason), 1)) : m("", !0),
        M.value ? (a(), V(Tt, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: U.value,
          note: Z.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0),
        s.value ? (a(), l("p", Yt, g(s.value), 1)) : m("", !0),
        p(d(ct), {
          class: "agent-tabs",
          tabs: C.value,
          active: E.value,
          answer: { tasks: e.tasks.length, reports: d(N).length, memories: e.row.memory_count ?? 0 },
          onChoose: r[0] || (r[0] = (A) => E.value = A)
        }, null, 8, ["tabs", "active", "answer"]),
        p(d(gt), {
          class: "agent-tab-body",
          tab: E.value,
          "data-agent-tab-body": (L = E.value) == null ? void 0 : L.key
        }, {
          default: b(() => {
            var A;
            return [
              p(d(Ke), {
                value: (A = E.value) == null ? void 0 : A.key
              }, et({
                reports: b(() => [
                  d(N).length ? m("", !0) : (a(), V(d(Ee), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: b(() => [...r[3] || (r[3] = [
                      h("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (a(!0), l(F, null, ne(d(N), (q) => (a(), l("button", {
                    key: q.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${q.id}`,
                    onClick: (W) => d(we)(`messages:${q.id}`)
                  }, g(q.text), 9, Qt))), 128))
                ]),
                tasks: b(() => {
                  var q;
                  return [
                    e.tasks.length ? m("", !0) : (a(), V(d(Ee), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: b(() => [...r[4] || (r[4] = [
                        h("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (a(!0), l(F, null, ne(u.value, (W) => (a(), V(Kt, {
                      key: W.state,
                      section: W,
                      open: f(W.state),
                      onToggle: (he) => j(W.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (q = e.facts) != null && q.instruction ? (a(), l(F, { key: 1 }, [
                      r[5] || (r[5] = k("p", { class: "agent-label" }, "Instruction", -1)),
                      k("div", Xt, g(e.facts.instruction), 1)
                    ], 64)) : m("", !0)
                  ];
                }),
                transcript: b(() => {
                  var q;
                  return [
                    D.value ? (a(), l(F, { key: 0 }, [
                      (q = e.facts) != null && q.instruction ? (a(), l("div", ea, [
                        p(d(Je), {
                          label: "Instruction",
                          open: G.value,
                          "data-agent-section": "instruction",
                          onToggle: r[1] || (r[1] = (W) => G.value = !G.value)
                        }, {
                          default: b(() => [
                            k("div", ta, g(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (a(), l("p", aa, "No job recorded")) : m("", !0)
                    ], 64)) : m("", !0),
                    p(xt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                ne(d(K), (q, W) => ({
                  name: W,
                  fn: b(() => [
                    (a(), V(tt(q), {
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
}, sa = /* @__PURE__ */ J(oa, [["__scopeId", "data-v-b8d35254"]]), la = { class: "action-buttons" }, ra = {
  __name: "AgentDriverForm",
  props: { program: String, model: String, pending: Boolean },
  emits: ["submit", "cancel", "update:program", "update:model"],
  setup(e) {
    return (o, t) => (a(), l("form", {
      "data-agent-driver-form": "",
      onSubmit: t[3] || (t[3] = ee((s) => o.$emit("submit"), ["prevent"]))
    }, [
      t[6] || (t[6] = k("p", null, "Starts the next session on this program; the agent keeps its number and memories.", -1)),
      p(d(Ne), {
        "model-value": e.program,
        label: "Program",
        disabled: e.pending,
        "data-agent-driver-program": "",
        "onUpdate:modelValue": t[0] || (t[0] = (s) => o.$emit("update:program", s))
      }, null, 8, ["model-value", "disabled"]),
      p(d(Ne), {
        "model-value": e.model,
        label: "Model",
        disabled: e.pending,
        "data-agent-driver-model": "",
        "onUpdate:modelValue": t[1] || (t[1] = (s) => o.$emit("update:model", s))
      }, null, 8, ["model-value", "disabled"]),
      k("div", la, [
        p(d(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.program.trim() || !e.model.trim(),
          "data-agent-confirm-driver": ""
        }, {
          default: b(() => [...t[4] || (t[4] = [
            h("Change the driver", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(d(te), {
          small: "",
          disabled: e.pending,
          onClick: t[2] || (t[2] = (s) => o.$emit("cancel"))
        }, {
          default: b(() => [...t[5] || (t[5] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ia = /* @__PURE__ */ J(ra, [["__scopeId", "data-v-c138a4da"]]), da = { class: "action-field" }, ua = ["value", "disabled"], ca = ["value"], ga = { key: 1 }, va = {
  key: 1,
  class: "action-field"
}, ma = { class: "action-buttons" }, pa = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (o, t) => (a(), l("form", {
      onSubmit: t[4] || (t[4] = ee((s) => o.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (a(), l(F, { key: 0 }, [
        k("label", da, [
          t[6] || (t[6] = h("Task ", -1)),
          k("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: t[0] || (t[0] = (s) => o.$emit("update:task", s.target.value))
          }, [
            t[5] || (t[5] = k("option", { value: "" }, "Choose an open task", -1)),
            (a(!0), l(F, null, ne(e.tasks, (s) => (a(), l("option", {
              key: s.id,
              value: String(s.id)
            }, g(s.id) + ": " + g(s.title), 9, ca))), 128))
          ], 40, ua)
        ]),
        e.moreTasks ? (a(), V(d(te), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: t[1] || (t[1] = (s) => o.$emit("more"))
        }, {
          default: b(() => [...t[7] || (t[7] = [
            h("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : m("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (a(), l("p", ga, "No open tasks.")) : m("", !0)
      ], 64)) : (a(), l("label", va, [
        t[8] || (t[8] = h("Job", -1)),
        p(d(vt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (s) => o.$emit("update:text", s.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      k("div", ma, [
        p(d(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: b(() => [...t[9] || (t[9] = [
            h("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(d(te), {
          small: "",
          disabled: e.pending,
          onClick: t[3] || (t[3] = (s) => o.$emit("cancel"))
        }, {
          default: b(() => [...t[10] || (t[10] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, fa = /* @__PURE__ */ J(pa, [["__scopeId", "data-v-adde4158"]]), ha = { class: "action-buttons" }, ba = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (o, t) => (a(), l("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = ee((s) => o.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = k("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      p(d(Ne), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (s) => o.$emit("update:reason", s))
      }, null, 8, ["model-value", "disabled"]),
      k("div", ha, [
        p(d(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: b(() => [...t[3] || (t[3] = [
            h("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(d(te), {
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (s) => o.$emit("cancel"))
        }, {
          default: b(() => [...t[4] || (t[4] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ka = /* @__PURE__ */ J(ba, [["__scopeId", "data-v-92de7dd6"]]), ya = {
  class: "session-history",
  "data-agent-session-history": ""
}, wa = { key: 0 }, Ma = { key: 0 }, $a = { "data-agent-session-state": "" }, xa = { class: "action-buttons" }, Sa = {
  __name: "AgentSessionHistory",
  props: { sessions: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e) {
    return (o, t) => (a(), l("div", ya, [
      e.sessions.length ? m("", !0) : (a(), l("p", wa, "This agent has no session in its history.")),
      k("ol", null, [
        (a(!0), l(F, null, ne(e.sessions, (s) => (a(), l("li", {
          key: s.session,
          "data-agent-session": ""
        }, [
          k("span", null, g([s.program, s.model].filter(Boolean).join(" ")), 1),
          s.started_at ? (a(), l("span", Ma, [
            t[1] || (t[1] = h("Started ", -1)),
            p(d(Ie), {
              at: s.started_at
            }, null, 8, ["at"])
          ])) : m("", !0),
          k("span", $a, g(s.end_reason ? `Ended: ${s.end_reason.replaceAll("_", " ")}` : s.started_at ? "Running" : "Not started"), 1),
          k("code", null, g(s.session), 1)
        ]))), 128))
      ]),
      k("div", xa, [
        p(d(te), {
          small: "",
          onClick: t[0] || (t[0] = (s) => o.$emit("close"))
        }, {
          default: b(() => [...t[2] || (t[2] = [
            h("Close", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Ca = /* @__PURE__ */ J(Sa, [["__scopeId", "data-v-0d688bd9"]]), Aa = { class: "action-buttons" }, Ta = {
  key: 0,
  role: "alert"
}, ja = {
  key: 1,
  role: "status"
}, La = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const o = e, t = Oe(), s = O(""), u = O(""), n = O(""), y = O(""), f = O(""), j = O(""), $ = O([]), N = O(0), D = O(!1), z = O(!1), H = O(!1), C = O(""), R = O(""), E = O([]), K = c(() => !!o.row.retired_at || o.row.state === "retired"), G = c(() => !K.value && !!o.row.ended_at), Q = c(() => {
      var L;
      return G.value && ((L = o.row.job_command) == null ? void 0 : L.length) && !o.row.resume_reason;
    }), oe = c(() => Q.value && !z.value && (o.row.job_task_flag ? $.value.some((L) => String(L.id) === j.value) : !!u.value.trim()));
    function U(L) {
      s.value = L, u.value = "", n.value = "", j.value = "", C.value = "", R.value = "";
    }
    async function Z() {
      U("job"), o.row.job_task_flag && ($.value = [], N.value = 0, D.value = !1, await M());
    }
    async function M() {
      if (!z.value) {
        z.value = !0;
        try {
          t.state["jobs.page"] = String(N.value + 1), await t.reload("jobs");
          const L = t.props.jobs;
          C.value = L.failure.value, C.value || ($.value = [...$.value, ...L.rows.value], N.value = L.data.value.page, D.value = L.more.value);
        } finally {
          z.value = !1;
        }
      }
    }
    async function v(L, A) {
      if (!H.value) {
        H.value = !0, C.value = "";
        try {
          const q = await t.run(L);
          C.value = q.ok ? "" : q.error, q.ok && (U(""), R.value = A);
        } finally {
          H.value = !1;
        }
      }
    }
    async function _() {
      if (!oe.value) return;
      const L = o.row.job_task_flag ? [o.row.job_task_flag, j.value] : [u.value.trim()];
      await v([...o.row.job_command, String(o.row.number), ...L], "Job sent.");
    }
    async function Y() {
      if (!H.value) {
        H.value = !0;
        try {
          const L = await t.run(["agent", "sessions", String(o.row.number)]);
          U(L.ok ? "history" : ""), C.value = L.ok ? "" : L.error, E.value = L.ok ? L.value.rows : [];
        } finally {
          H.value = !1;
        }
      }
    }
    function i() {
      U("driver"), y.value = o.row.program || "", f.value = "";
    }
    async function r() {
      !G.value || s.value !== "driver" || !y.value.trim() || !f.value.trim() || await v(["agent", "driver", String(o.row.number), "--program", y.value.trim(), "--model", f.value.trim()], "Driver changed.");
    }
    async function B() {
      !G.value || s.value !== "retire" || !n.value.trim() || await v(["agent", "retire", String(o.row.number), "--reason", n.value.trim()], "Agent retired permanently.");
    }
    return (L, A) => {
      var q;
      return a(), l("div", {
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: A[10] || (A[10] = ee(() => {
        }, ["stop"])),
        onKeydown: A[11] || (A[11] = ee(() => {
        }, ["stop"]))
      }, [
        k("div", Aa, [
          p(d(te), {
            small: "",
            "data-agent-history": "",
            disabled: H.value || z.value,
            onClick: Y
          }, {
            default: b(() => [...A[12] || (A[12] = [
              h("Session history", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          G.value ? (a(), l(F, { key: 0 }, [
            (q = e.row.job_command) != null && q.length ? (a(), V(d(te), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: H.value || z.value || !Q.value,
              onClick: Z
            }, {
              default: b(() => [...A[13] || (A[13] = [
                h("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0),
            e.row.role !== "main" ? (a(), V(d(te), {
              key: 1,
              small: "",
              "data-agent-driver": "",
              disabled: H.value || z.value,
              onClick: i
            }, {
              default: b(() => [...A[14] || (A[14] = [
                h("Change driver", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0),
            e.row.role !== "main" ? (a(), V(d(te), {
              key: 2,
              small: "",
              "data-agent-retire": "",
              disabled: H.value || z.value,
              onClick: A[0] || (A[0] = (W) => U("retire"))
            }, {
              default: b(() => [...A[15] || (A[15] = [
                h("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0)
          ], 64)) : m("", !0)
        ]),
        p(d(Ke), { value: s.value }, {
          job: b(() => [
            p(fa, {
              task: j.value,
              "onUpdate:task": A[1] || (A[1] = (W) => j.value = W),
              text: u.value,
              "onUpdate:text": A[2] || (A[2] = (W) => u.value = W),
              row: e.row,
              tasks: $.value,
              pending: H.value,
              loading: z.value,
              "more-tasks": D.value,
              failure: C.value,
              "job-ready": oe.value,
              onSubmit: _,
              onMore: M,
              onCancel: A[3] || (A[3] = (W) => U(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          driver: b(() => [
            p(ia, {
              program: y.value,
              "onUpdate:program": A[4] || (A[4] = (W) => y.value = W),
              model: f.value,
              "onUpdate:model": A[5] || (A[5] = (W) => f.value = W),
              pending: H.value,
              onSubmit: r,
              onCancel: A[6] || (A[6] = (W) => U(""))
            }, null, 8, ["program", "model", "pending"])
          ]),
          history: b(() => [
            p(Ca, {
              sessions: E.value,
              onClose: A[7] || (A[7] = (W) => U(""))
            }, null, 8, ["sessions"])
          ]),
          retire: b(() => [
            p(ka, {
              reason: n.value,
              "onUpdate:reason": A[8] || (A[8] = (W) => n.value = W),
              pending: H.value,
              onSubmit: B,
              onCancel: A[9] || (A[9] = (W) => U(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        C.value ? (a(), l("p", Ta, g(C.value), 1)) : m("", !0),
        R.value ? (a(), l("p", ja, g(R.value), 1)) : m("", !0)
      ], 32);
    };
  }
}, Ba = /* @__PURE__ */ J(La, [["__scopeId", "data-v-03a4a81a"]]), Ra = { class: "line" }, Ia = {
  key: 0,
  class: "line",
  "data-agent-since": ""
}, Oa = {
  key: 1,
  class: "line",
  "data-agent-seen": ""
}, Va = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" }, seen: { type: String, default: "" } },
  setup(e) {
    const o = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, s = c(() => o.has(t.state)), u = c(() => [t.doing, t.since, t.seen].filter(Boolean).join(". "));
    return (n, y) => (a(), V(d(xe), {
      as: "button",
      place: "corner",
      class: de(["agent-dot", { pulse: s.value }]),
      "data-state": e.state,
      "aria-label": u.value,
      "data-agent-status": "",
      onClick: y[0] || (y[0] = ee(() => {
      }, ["stop"]))
    }, {
      tip: b(() => [
        k("b", Ra, g(e.doing), 1),
        e.since ? (a(), l("span", Ia, g(e.since), 1)) : m("", !0),
        e.seen ? (a(), l("span", Oa, g(e.seen), 1)) : m("", !0)
      ]),
      default: b(() => [
        y[1] || (y[1] = k("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, za = /* @__PURE__ */ J(Va, [["__scopeId", "data-v-1a0bc478"]]), Ha = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, Ea = (e) => e.filter((o) => o.state !== "cancelled"), Ue = (e, o) => e.filter((t) => t.state === o).length;
function Na({ tasks: e, inHand: o, perHour: t }) {
  const s = Ea(e), u = Ue(s, "completed"), n = Ha[o == null ? void 0 : o.state], y = s.filter((N) => N.state === "started").map((N) => ({ number: N.id, title: N.title })), f = Math.max(y.length, o && o.state !== "completed" ? 1 : 0), j = s.length - u - f, $ = u === s.length;
  return {
    number: o.id,
    title: o.title,
    started: y,
    plan: o.plan_id ?? 0,
    count: `${u} of ${s.length}`,
    taskTip: `${u} of its ${s.length} tasks done${n ? `. This one is ${n.words}.` : "."}`,
    countTip: $ ? `All ${s.length} tasks done` : `${u} done, ${f} in hand, ${j} to go`,
    paceTip: !$ && t ? `About ${t} an hour.` : "",
    rate: !$ && t ? `${Math.round(t)}/hour` : "",
    bar: { total: s.length, done: u, testing: Ue(s, "testing") }
  };
}
const Wa = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, Da = {
  key: 0,
  class: "plan",
  "data-agent-job-launch": ""
}, qa = {
  class: "task-line",
  "data-agent-task-line": ""
}, Fa = {
  key: 0,
  class: "tasks",
  "data-agent-tasks": ""
}, Ua = {
  key: 2,
  class: "plan",
  "data-agent-plan": ""
}, Pa = {
  key: 3,
  class: "rate",
  "data-agent-rate": ""
}, Ga = { key: 0 }, Ja = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, jobTitle: { type: String, default: "" }, jobLaunch: { type: String, default: "" }, perHour: { type: Number, default: 0 } },
  setup(e) {
    const o = e, t = c(() => o.inHand ? Na({ tasks: o.tasks, inHand: o.inHand, perHour: o.perHour }) : null);
    return (s, u) => e.job && !t.value ? (a(), l("span", Wa, [
      p(d(xe), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: b(() => [
          k("b", null, g(e.job), 1)
        ]),
        default: b(() => [
          h(g(e.jobTitle || "Job"), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (a(), l("span", Da, g(e.jobLaunch), 1)) : m("", !0)
    ])) : t.value ? (a(), l(F, { key: 1 }, [
      k("span", qa, [
        t.value.started.length > 1 ? (a(), l("span", Fa, [
          u[1] || (u[1] = h("Tasks ", -1)),
          (a(!0), l(F, null, ne(t.value.started, (n, y) => (a(), l(F, {
            key: n.number
          }, [
            y ? (a(), l(F, { key: 0 }, [
              h(", ")
            ], 64)) : m("", !0),
            p(d(xe), {
              as: "button",
              class: "task",
              "data-agent-task": "",
              "data-peek": `tasks:${n.number}`,
              "aria-label": `Task ${n.number}: ${n.title}`,
              onClick: ee((f) => d(we)(`tasks:${n.number}`), ["stop"])
            }, {
              tip: b(() => [
                k("b", null, g(n.title), 1)
              ]),
              default: b(() => [
                h(g(n.number), 1)
              ]),
              _: 2
            }, 1032, ["data-peek", "aria-label", "onClick"])
          ], 64))), 128))
        ])) : (a(), V(d(xe), {
          key: 1,
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${t.value.number}`,
          "aria-label": `Task ${t.value.number}: ${t.value.title}`,
          onClick: u[0] || (u[0] = ee((n) => d(we)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: b(() => [
            k("b", null, g(t.value.title), 1),
            k("span", null, g(t.value.taskTip), 1)
          ]),
          default: b(() => [
            h("Task " + g(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])),
        t.value.plan ? (a(), l("span", Ua, "Plan " + g(t.value.plan), 1)) : m("", !0),
        t.value.rate ? (a(), l("span", Pa, g(t.value.rate), 1)) : m("", !0),
        p(d(xe), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: b(() => [
            k("b", null, g(t.value.countTip), 1),
            t.value.paceTip ? (a(), l("span", Ga, g(t.value.paceTip), 1)) : m("", !0)
          ]),
          default: b(() => [
            h(g(t.value.count), 1)
          ]),
          _: 1
        })
      ]),
      p(d(mt), {
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: t.value.bar.total,
        done: t.value.bar.done,
        testing: t.value.bar.testing
      }, null, 8, ["total", "done", "testing"])
    ], 64)) : m("", !0);
  }
}, Ka = /* @__PURE__ */ J(Ja, [["__scopeId", "data-v-e59affa8"]]), Za = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', _a = ["data-icon", "stroke-width", "innerHTML"], ae = {
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
    }, u = {
      agent: Za,
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
    return (n, y) => (a(), l("svg", {
      class: "ico",
      "data-icon": e.name,
      style: Re({
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
      innerHTML: u[s[e.name] || e.name] || u.dot
    }, null, 12, _a));
  }
}, Ya = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Qa = {
  key: 1,
  class: "menu-item-text"
}, Xa = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (o, t) => (a(), l("button", {
      type: "button",
      class: de(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), l("span", Ya, g(e.checked ? "✓" : ""), 1)) : m("", !0),
      e.description ? (a(), l("span", Qa, [
        k("span", null, [
          Ae(o.$slots, "default", {}, void 0, !0)
        ]),
        k("small", null, g(e.description), 1)
      ])) : Ae(o.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ye = /* @__PURE__ */ J(Xa, [["__scopeId", "data-v-fec99974"]]), en = {}, tn = { class: "menu-label" };
function an(e, o) {
  return a(), l("span", tn, [
    Ae(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Se = /* @__PURE__ */ J(en, [["render", an], ["__scopeId", "data-v-aa955b3e"]]), nn = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, on = {
  key: 0,
  class: "skills-none"
}, sn = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: o }) {
    const t = e, s = o, u = c(() => t.skills.filter((y) => y.state === "loaded")), n = c(() => t.skills.filter((y) => y.state !== "loaded"));
    return (y, f) => (a(), l("div", nn, [
      p(Se, null, {
        default: b(() => [...f[1] || (f[1] = [
          h("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      u.value.length ? m("", !0) : (a(), l("p", on, "None yet. Compacting the conversation empties this list.")),
      (a(!0), l(F, null, ne(u.value, (j) => (a(), l("p", {
        key: j.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        p(ae, {
          name: "book",
          size: 12
        }),
        h(g(j.skill), 1)
      ]))), 128)),
      n.value.length ? (a(), l(F, { key: 1 }, [
        p(Se, null, {
          default: b(() => [...f[2] || (f[2] = [
            h("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), l(F, null, ne(n.value, (j) => (a(), l("p", {
          key: j.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          p(ae, {
            name: "book",
            size: 12
          }),
          h(g(j.skill), 1)
        ]))), 128))
      ], 64)) : m("", !0),
      p(ye, {
        "data-agent-skills-browse": "",
        onClick: f[0] || (f[0] = (j) => s("browse"))
      }, {
        default: b(() => [...f[3] || (f[3] = [
          h("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, ln = /* @__PURE__ */ J(sn, [["__scopeId", "data-v-be514d47"]]), rn = ["disabled", "title"], dn = { class: "gauge usage" }, un = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: o }) {
    const t = e, s = o, u = c(() => t.windows[0] ?? null), n = c(() => u.value && Number.isFinite(u.value.used_percent) ? Math.max(0, Math.min(100, Math.round(u.value.used_percent))) : null), y = c(() => n.value !== null && n.value >= 100), f = c(() => {
      var $;
      return ($ = u.value) != null && $.reset_epoch_seconds ? new Date(u.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), j = c(() => y.value ? `At usage limit: the plan's ${u.value.title} allowance is used up${f.value ? `, starts again ${f.value}` : ""}` : `${n.value}% of the plan's ${u.value.title} allowance used${f.value ? `, starts again ${f.value}` : ""}`);
    return ($, N) => n.value !== null ? (a(), l("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: j.value,
      onClick: N[0] || (N[0] = (D) => s("open", D.currentTarget))
    }, [
      p(ae, {
        name: "allowance",
        size: 12
      }),
      N[1] || (N[1] = h()),
      k("span", dn, [
        k("span", {
          style: Re({ width: `${n.value}%` })
        }, null, 4)
      ]),
      h(" " + g(y.value ? "At usage limit" : `${n.value}%`), 1)
    ], 8, rn)) : m("", !0);
  }
}, cn = /* @__PURE__ */ J(un, [["__scopeId", "data-v-a36f09dc"]]), gn = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (o, t) => (a(), l("span", {
      class: de(["badge", e.tone])
    }, g(e.text), 3));
  }
}, vn = /* @__PURE__ */ J(gn, [["__scopeId", "data-v-9e7e1157"]]), mn = (e, o, t) => Math.max(o, Math.min(t, e)), _e = /* @__PURE__ */ new WeakMap(), pn = (e, o) => _e.set(e, o);
function fn(e, o) {
  for (let t = o; t; t = _e.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function hn(e, o) {
  const t = (s) => {
    var n, y;
    const u = ((n = e.value) == null ? void 0 : n.element) || ((y = e.value) == null ? void 0 : y.$el) || e.value;
    u && !fn(u, s.target) && o(s);
  };
  window.addEventListener("click", t), Ce(() => window.removeEventListener("click", t));
}
const ke = 8, bn = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const s = e, u = O(null), n = (r) => r ? `${r}px` : void 0, y = c(() => ({
      minWidth: n(s.minWidth),
      maxWidth: n(s.maxWidth),
      maxHeight: n(s.maxHeight),
      height: n(s.height)
    })), f = O({ w: 0, h: 0 }), j = O(s.anchor ? s.anchor.getBoundingClientRect() : null), $ = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), N = (r) => ({
      left: Math.max(0, r.left),
      top: Math.max(0, r.top),
      right: Math.min(window.innerWidth, r.right),
      bottom: Math.min(window.innerHeight, r.bottom)
    }), D = (r) => {
      const B = r.closest(".pane, .float-window");
      return B ? N(B.getBoundingClientRect()) : $();
    }, z = (r, B) => `${Math.max(0, r ? Math.min(r, B) : B)}px`;
    function H(r, B) {
      return {
        below: r.bottom - B.bottom - s.gap - ke,
        above: B.top - r.top - s.gap - ke,
        across: r.right - r.left - 2 * ke
      };
    }
    function C(r) {
      const B = D(s.anchor), L = H(B, r);
      return f.value.w <= L.across && f.value.h <= Math.max(L.below, L.above) ? B : $();
    }
    const R = c(() => {
      if (!j.value) return y.value;
      const r = j.value, B = C(r), L = H(B, r), { w: A, h: q } = f.value, W = s.align === "auto" ? r.left + r.right > B.left + B.right : s.align === "right", he = mn(W ? r.right - A : r.left, B.left + ke, Math.max(B.left + ke, B.right - A - ke)), X = q > L.below && L.above > L.below ? { bottom: `${window.innerHeight - r.top + s.gap}px`, maxHeight: z(s.maxHeight, L.above) } : { top: `${r.bottom + s.gap}px`, maxHeight: z(s.maxHeight, L.below) };
      return { ...y.value, ...X, left: `${he}px`, maxWidth: z(s.maxWidth, L.across) };
    }), E = t, K = () => [...u.value.querySelectorAll("button:not(:disabled)")];
    function G(r) {
      const B = K(), L = B.indexOf(document.activeElement);
      B[(L + r + B.length) % B.length].focus();
    }
    const Q = { ArrowDown: () => G(1), ArrowUp: () => G(-1), Escape: () => E("close") }, oe = (r) => Q[r.key] && (r.preventDefault(), Q[r.key]()), U = () => u.value && (f.value = { w: u.value.offsetWidth, h: u.value.scrollHeight });
    let Z = 0;
    const M = new ResizeObserver(() => {
      cancelAnimationFrame(Z), Z = requestAnimationFrame(U);
    });
    hn(u, (r) => s.anchor && !s.anchor.contains(r.target) && E("close"));
    const v = (r, B) => ["top", "left", "right", "bottom"].some((L) => Math.abs(r[L] - B[L]) > 1), _ = (r) => r.bottom < 0 || r.top > window.innerHeight;
    let Y = 0;
    function i() {
      if (s.anchor) {
        const r = s.anchor.getBoundingClientRect();
        if (!s.anchor.isConnected || _(r)) return E("close");
        v(r, j.value) && (j.value = r);
      }
      Y = requestAnimationFrame(i);
    }
    return at(() => {
      s.anchor && u.value && pn(u.value, s.anchor), U(), u.value && M.observe(u.value), !s.plain && K()[0] && K()[0].focus(), i();
    }), Ce(() => {
      M.disconnect(), cancelAnimationFrame(Y), cancelAnimationFrame(Z);
    }), o({ element: u }), (r, B) => (a(), V(nt, {
      to: "body",
      disabled: !e.anchor
    }, [
      k("div", ot({
        ref_key: "panel",
        ref: u
      }, r.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: R.value,
        onKeydown: oe
      }), [
        Ae(r.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), kn = /* @__PURE__ */ J(bn, [["__scopeId", "data-v-3d203970"]]);
async function yn(e, o, t) {
  if (!e) return t(o);
  const { target: s, fields: u } = e, n = Object.fromEntries(Object.keys(u).map((j) => [j, s[j]])), y = () => Object.assign(s, n);
  Object.assign(s, u);
  let f = !1;
  try {
    const j = await t(o);
    return f = j.ok, j;
  } finally {
    f || y();
  }
}
function wn(e, o, t, { groups: s, programs: u }) {
  const n = O({}), y = O(""), f = O(!1), j = c(() => !!e.value && !e.value.ended_at), $ = c(() => j.value && !!e.value.paused_at);
  async function N(C, R = null) {
    y.value = "";
    const E = await yn(R, C, o);
    return y.value = E.ok ? "" : E.error, t(), E;
  }
  return { groups: s, programs: u, chosen: n, failure: y, asking: f, running: j, paused: $, choose: (C, R) => N(["agent", "control", String(e.value.number), C, R.value], { target: n, fields: { value: { ...n.value, [C]: R.label } } }), stop: () => (f.value = !1, N(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (C) => N(["agent", "launch", C.name]) };
}
function Mn(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const $n = { compact: "Compaction", clear: "Clear" };
function xn(e) {
  return e != null && e.is_open ? `${$n[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
const Sn = ["disabled", "title"], Cn = ["disabled", "title"], An = { class: "gauge" }, Tn = {
  key: 2,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
}, jn = ["disabled", "title"], Ln = ["disabled"], Bn = ["disabled"], Rn = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, In = ["title"], On = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Vn = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, zn = { class: "gauge" }, Hn = { class: "context-used" }, En = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, Nn = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, Wn = 75, Dn = {
  __name: "InformationBar",
  props: {
    agent: { type: Object, default: null },
    card: Boolean,
    live: Boolean,
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
    const t = e, s = o, u = wn(Ve(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => s("changed"), { groups: Ve(t, "controlGroups"), programs: Ve(t, "agentPrograms") }), n = O(null), y = O(""), f = c(() => u.groups.value.find((M) => M.key === y.value));
    function j(M, v) {
      n.value = M.currentTarget, y.value = v;
    }
    function $() {
      n.value = null, y.value = "", u.asking.value = !1;
    }
    const N = c(() => t.skills.filter((M) => M.state === "loaded"));
    function D(M) {
      j(M, "skills"), s("skills");
    }
    const z = (M) => u.groups.value.some((v) => v.key === M), H = c(() => {
      var M;
      return u.chosen.value.model ?? ((M = R.value) == null ? void 0 : M.model) ?? "";
    }), C = c(() => {
      var M;
      return u.chosen.value.effort ?? ((M = R.value) == null ? void 0 : M.effort) ?? "";
    });
    c(() => !!t.agent && !t.agent.ended_at);
    const R = c(() => {
      var M;
      return ((M = t.usage.agents) == null ? void 0 : M.find((v) => {
        var _;
        return v.id === ((_ = t.agent) == null ? void 0 : _.id);
      })) ?? null;
    }), E = c(() => {
      var M;
      return ((M = R.value) == null ? void 0 : M.context_percent) == null ? null : Math.round(R.value.context_percent);
    }), K = c(() => {
      var M;
      return xn(((M = R.value) == null ? void 0 : M.context_change) ?? null);
    }), G = (M) => `${Math.round(M / 1e3)}k`, Q = c(() => {
      var M;
      return !!((M = R.value) != null && M.context_limit_tokens);
    }), oe = c(() => {
      var M, v;
      return ((M = R.value) == null ? void 0 : M.context_limit_tokens) || ((v = R.value) == null ? void 0 : v.context_window_tokens) || 0;
    }), U = c(() => oe.value ? `${G(R.value.context_tokens ?? 0)} of ${G(oe.value)}` : ""), Z = c(() => {
      var M;
      return (M = R.value) != null && M.cost_dollars ? `$${R.value.cost_dollars.toFixed(2)}` : "";
    });
    return (M, v) => {
      var _, Y;
      return a(), l("div", {
        class: de(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (a(), l(F, { key: 0 }, [
          e.live ? m("", !0) : (a(), l("button", {
            key: 0,
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: v[0] || (v[0] = (i) => j(i, "agent"))
          }, [
            p(ae, {
              name: "agents",
              size: 12
            }),
            h(" " + g(((_ = e.agentPrograms.find((i) => i.name === e.agent.program)) == null ? void 0 : _.title) || e.agent.program), 1)
          ], 8, Sn)),
          p(cn, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: v[1] || (v[1] = (i) => s("open", "usage", i))
          }, null, 8, ["windows", "disabled"]),
          E.value !== null ? (a(), l("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${E.value}% full: clear or compact it`,
            onClick: v[2] || (v[2] = (i) => z("context") ? j(i, "context") : s("open", "context", i.currentTarget))
          }, [
            p(ae, {
              name: "gauge",
              size: 12
            }),
            v[14] || (v[14] = h()),
            k("span", An, [
              k("span", {
                style: Re({ width: `${E.value}%` })
              }, null, 4)
            ]),
            h(" " + g(E.value) + "% ", 1)
          ], 8, Cn)) : (Y = R.value) != null && Y.context_unknown ? (a(), l("span", Tn, [
            p(ae, {
              name: "gauge",
              size: 12
            }),
            v[15] || (v[15] = h(" Context: unknown", -1))
          ])) : m("", !0),
          H.value && !e.live ? (a(), l("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${H.value}: change the model`,
            onClick: v[3] || (v[3] = (i) => z("model") ? j(i, "model") : null)
          }, [
            p(ae, {
              name: "model",
              size: 12
            }),
            h(" " + g(H.value), 1)
          ], 8, jn)) : m("", !0),
          !e.live && (z("effort") || e.card && C.value) ? (a(), l("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: v[4] || (v[4] = (i) => j(i, "effort"))
          }, [
            p(ae, {
              name: "bolt",
              size: 12
            }),
            h(" " + g(C.value), 1)
          ], 8, Ln)) : m("", !0),
          Z.value ? (a(), l("button", {
            key: 5,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: v[5] || (v[5] = (i) => s("open", "cost", i.currentTarget))
          }, g(Z.value), 9, Bn)) : m("", !0),
          e.branch ? (a(), l("span", Rn, [
            p(ae, {
              name: "branch",
              size: 12
            }),
            h(" " + g(e.branch), 1)
          ])) : m("", !0),
          e.card ? m("", !0) : (a(), l("button", {
            key: 7,
            type: "button",
            class: de(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: v[6] || (v[6] = (i) => s("open", "jobs", i.currentTarget))
          }, [
            p(ae, {
              name: "clock",
              size: 12
            }),
            h(" " + g(e.jobs), 1)
          ], 2)),
          e.run ? (a(), l("button", {
            key: 8,
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
            h(" " + g(N.value.length), 1)
          ])) : m("", !0),
          e.fitness ? (a(), l(F, { key: 9 }, [
            k("button", {
              type: "button",
              class: de(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Wn }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: v[7] || (v[7] = (i) => s("open", "fitness", i.currentTarget))
            }, [
              p(ae, {
                name: "heart",
                size: 12
              }),
              h(" " + g(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            k("button", {
              type: "button",
              class: de(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: v[8] || (v[8] = (i) => s("open", "load", i.currentTarget))
            }, [
              p(ae, {
                name: "weight",
                size: 12
              }),
              h(" " + g(e.fitness.workload), 1)
            ], 2)
          ], 64)) : m("", !0)
        ], 64)) : e.run && !e.loading ? (a(), l("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: v[9] || (v[9] = (i) => j(i, "start"))
        }, [
          p(ae, {
            name: "agents",
            size: 12
          }),
          v[16] || (v[16] = h(" Start an agent", -1))
        ])) : m("", !0),
        v[22] || (v[22] = k("span", { class: "space" }, null, -1)),
        d(u).failure.value ? (a(), l("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: d(u).failure.value
        }, g(d(u).failure.value), 9, In)) : m("", !0),
        Ae(M.$slots, "default", {}, void 0, !0),
        n.value ? (a(), V(kn, {
          key: 3,
          anchor: n.value,
          "min-width": 190,
          onClose: $
        }, {
          default: b(() => {
            var i;
            return [
              y.value === "agent" ? (a(), l(F, { key: 0 }, [
                d(u).asking.value ? (a(), l(F, { key: 0 }, [
                  p(Se, { "data-agent-stop-ask": "" }, {
                    default: b(() => [...v[17] || (v[17] = [
                      h("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  p(ye, {
                    "data-agent-stop-confirm": "",
                    onClick: v[10] || (v[10] = (r) => ($(), d(u).stop()))
                  }, {
                    default: b(() => [...v[18] || (v[18] = [
                      h("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  p(ye, {
                    onClick: v[11] || (v[11] = (r) => d(u).asking.value = !1)
                  }, {
                    default: b(() => [...v[19] || (v[19] = [
                      h("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (a(), V(ye, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: v[12] || (v[12] = (r) => d(u).asking.value = !0)
                }, {
                  default: b(() => [...v[20] || (v[20] = [
                    h("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : y.value === "start" ? (a(), l(F, { key: 1 }, [
                p(Se, null, {
                  default: b(() => [...v[21] || (v[21] = [
                    h("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (a(!0), l(F, null, ne(d(u).programs.value, (r) => (a(), V(ye, {
                  key: r.name,
                  "data-agent-program": r.name,
                  onClick: (B) => ($(), d(u).start(r))
                }, {
                  default: b(() => [
                    h(g(r.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : y.value === "skills" ? (a(), V(ln, {
                key: 2,
                skills: e.skills,
                onBrowse: v[13] || (v[13] = (r) => ($(), s("open", "skills", null)))
              }, null, 8, ["skills"])) : f.value ? (a(), l(F, { key: 3 }, [
                p(Se, null, {
                  default: b(() => [
                    h(g(f.value.label), 1)
                  ]),
                  _: 1
                }),
                y.value === "context" ? (a(), l(F, { key: 0 }, [
                  k("p", On, g(d(Mn)(((i = R.value) == null ? void 0 : i.last_compaction) ?? null)), 1),
                  k("div", Vn, [
                    k("span", zn, [
                      k("span", {
                        style: Re({ width: `${E.value}%` })
                      }, null, 4)
                    ]),
                    k("span", Hn, g(E.value) + "%", 1)
                  ]),
                  U.value ? (a(), l("p", En, [
                    h(g(U.value) + " ", 1),
                    Q.value ? (a(), V(vn, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : m("", !0)
                  ])) : m("", !0)
                ], 64)) : m("", !0),
                y.value === "context" && K.value ? (a(), l("p", Nn, g(K.value), 1)) : (a(!0), l(F, { key: 2 }, ne(f.value.choices, (r) => (a(), V(ye, {
                  key: r.value,
                  "data-agent-choice": r.value,
                  onClick: (B) => (d(u).choose(f.value.key, r), $())
                }, {
                  default: b(() => [
                    h(g(r.label), 1)
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
}, qn = /* @__PURE__ */ J(Dn, [["__scopeId", "data-v-e257b192"]]), Fn = ["data-agent-open", "aria-expanded", "role", "tabindex"], Un = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Pn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Gn = {
  key: 2,
  class: "agent-head-actions",
  "data-agent-head-actions": ""
}, Jn = {
  key: 0,
  class: "agent-line"
}, Kn = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Zn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, _n = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, Yn = {
  class: "agent-live-fact",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, Qn = {
  key: 1,
  class: "agent-live-fact",
  "data-agent-last-heard": ""
}, Xn = {
  key: 2,
  class: "agent-unit",
  "data-agent-unit": ""
}, eo = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), s = { helper: "Helper", reviewer: "Reviewer", main: "Main agent" }, u = { running: "Working", starting: "Starting", stopping: "Stopping", ended: "Idle: its process has stopped", failed: "Could not start", never_started: "Not started" }, n = e, y = o, f = Ze(), j = c(() => {
      var x, le;
      if ((x = n.facts) != null && x.profile_title) return n.facts.profile_title;
      if ((le = n.facts) != null && le.profile) return n.facts.profile;
      const w = s[n.row.role] || n.row.role;
      return w.slice(0, 1).toUpperCase() + w.slice(1);
    }), $ = c(() => {
      var w;
      return ((w = n.facts) == null ? void 0 : w.tasks) ?? [];
    }), N = c(() => $.value.filter((w) => w.state === "open")), D = c(() => $.value.find((w) => {
      var x;
      return w.id === ((x = n.progress) == null ? void 0 : x.task_id) && w.state === "started";
    })), z = c(() => D.value || $.value.find((w) => {
      var x;
      return w.id === ((x = n.facts) == null ? void 0 : x.task_id);
    }) || $.value.find((w) => t.has(w.state)) || N.value[0] || $.value.at(-1)), H = c(() => {
      var w, x, le, se, ve, ue;
      return n.row.role === "helper" ? ((w = n.facts) == null ? void 0 : w.helper_job) || "" : (x = n.facts) != null && x.job_enabled && (((le = D.value) == null ? void 0 : le.title) || ((se = n.facts) == null ? void 0 : se.task_title) || ((ve = N.value[0]) == null ? void 0 : ve.title) || ((ue = $.value.at(-1)) == null ? void 0 : ue.title)) || "";
    }), C = c(() => `${n.row.role} ${n.row.number}`), R = c(() => {
      var w, x;
      return [n.row.program, (w = n.facts) == null ? void 0 : w.model, (x = n.facts) == null ? void 0 : x.effort, C.value].filter(Boolean).join(" · ");
    }), E = c(() => n.row.role === "main" ? j.value : `${j.value} ${n.row.number}`), K = Oe(), G = c(() => pt(n.row.process_started_at || n.row.created_at, f.value)), Q = /* @__PURE__ */ new Set(["open", "started", "testing"]), oe = { fresh: "new conversation", resumed: "resumed" }, U = c(() => {
      var w, x;
      return [(w = n.facts) == null ? void 0 : w.helper_job_program, oe[(x = n.facts) == null ? void 0 : x.occupant_launch]].filter(Boolean).join(", ");
    }), Z = c(() => {
      var w;
      return (w = n.facts) == null ? void 0 : w.work_status;
    }), M = c(() => !!n.row.ended_at && n.row.role !== "main" && $.value.some((w) => Q.has(w.state))), v = c(() => {
      var w, x;
      return n.row.state === "running" && ((w = n.facts) == null ? void 0 : w.state) === "at usage limit" && !!((x = n.facts) != null && x.usage_limit_ends_at);
    }), _ = (w) => new Date(w).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), Y = c(() => n.row.halted_at ? `Stopped at the usage limit since ${_(n.row.halted_at)}, goes on at ${_(n.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(n.facts.usage_limit_ends_at).toLocaleString()}`), i = c(() => {
      var w;
      return n.row.retired_at || n.row.state === "retired" ? "retired" : v.value || Z.value || n.waitReason || M.value ? "waiting" : n.row.state === "running" && ((w = n.facts) == null ? void 0 : w.state) || n.row.state;
    }), r = c(() => {
      var w;
      return v.value ? Y.value : Z.value ? `Status: ${Z.value}` : n.waitReason ? `Waiting: ${n.waitReason}` : i.value === "blocked" ? (w = n.facts) != null && w.blocked_reason ? `Blocked: ${n.facts.blocked_reason}` : "Blocked" : M.value ? "Stopped with work left" : "";
    }), B = c(() => {
      var w;
      return ((w = n.progress) == null ? void 0 : w.completed_count) ?? $.value.filter((x) => x.state === "completed").length;
    }), L = c(() => {
      var w;
      return ft(B.value, ((w = n.progress) == null ? void 0 : w.started_at) || n.row.created_at, n.progress ? n.progress.finished_at : n.row.ended_at, f.value);
    }), A = c(() => n.row.role === "main" ? 0 : L.value), q = c(() => !!n.row.retired_at || n.row.state === "retired"), W = c(() => q.value ? "Retired" : i.value === "blocked" || i.value === "waiting" ? r.value || (i.value === "blocked" ? "Blocked" : "Waiting") : u[n.row.standing]), he = c(() => {
      var x;
      if (q.value) return n.row.retired_at;
      const w = i.value === "blocked" || i.value === "waiting";
      return n.row.ended_at || w && ((x = n.facts) == null ? void 0 : x.last_activity) || n.row.process_started_at || n.row.created_at;
    }), Me = c(() => ht(he.value, f.value)), X = c(() => {
      var w;
      return bt((w = n.facts) == null ? void 0 : w.last_activity, f.value);
    });
    return (w, x) => {
      var le, se, ve, ue, re, $e;
      return a(), l("div", {
        class: de(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: x[3] || (x[3] = (ce) => !e.open && y("toggle")),
        onKeydown: [
          x[4] || (x[4] = qe(ee((ce) => !e.open && y("toggle"), ["self", "prevent"]), ["enter"])),
          x[5] || (x[5] = qe(ee((ce) => !e.open && y("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        p(d(kt), {
          "agent-id": e.row.id,
          label: j.value,
          class: "agent-head"
        }, {
          default: b(() => {
            var ce, me;
            return [
              e.open ? (a(), l("button", {
                key: 0,
                type: "button",
                class: "agent-back",
                title: "Back",
                "aria-label": "Back",
                onClick: x[0] || (x[0] = ee((Te) => y("toggle"), ["stop"]))
              }, [
                p(d(He), {
                  name: "chevronRight",
                  facing: "left",
                  size: 14
                })
              ])) : m("", !0),
              k("span", Un, g(e.open ? E.value : j.value), 1),
              k("span", Pn, g(((ce = e.facts) == null ? void 0 : ce.given_name) || e.row.id), 1),
              e.open ? m("", !0) : (a(), V(d(He), {
                key: 1,
                class: "agent-chevron",
                name: "chevronRight",
                size: 12
              })),
              e.open ? (a(), l("span", Gn, [
                p(Ba, { row: e.row }, null, 8, ["row"]),
                p(d(te), {
                  variant: "ghost",
                  small: "",
                  "data-agent-inspector": "",
                  onClick: x[1] || (x[1] = ee((Te) => d(we)(`agents:${e.row.id}`), ["stop"]))
                }, {
                  default: b(() => [...x[6] || (x[6] = [
                    h("Open inspector", -1)
                  ])]),
                  _: 1
                }),
                e.row.role === "helper" && (!e.row.ended_at || (me = e.facts) != null && me.helper_job_open) ? (a(), V(d(te), {
                  key: 0,
                  variant: "ghost",
                  small: "",
                  "data-helper-stop": "",
                  onClick: x[2] || (x[2] = ee((Te) => d(K).run(["helper", "stop", String(e.row.number)]), ["stop"]))
                }, {
                  default: b(() => [
                    h(g(e.row.ended_at ? "End job" : "Stop"), 1)
                  ]),
                  _: 1
                })) : m("", !0)
              ])) : m("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-id", "label"]),
        e.open ? m("", !0) : (a(), l("span", Jn, [
          k("span", Kn, g(R.value), 1),
          (le = e.facts) != null && le.sandbox_off ? (a(), l("span", Zn, "sandbox off")) : m("", !0)
        ])),
        e.open && !q.value ? (a(), V(qn, {
          key: 1,
          class: "agent-live",
          "agent-programs": d(K).props.programs.rows.value,
          agent: e.row,
          branch: (se = e.progress) == null ? void 0 : se.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((ve = e.facts) == null ? void 0 : ve.windows) ?? [] },
          card: "",
          live: ""
        }, {
          default: b(() => {
            var ce, me;
            return [
              (ce = e.facts) != null && ce.sandbox_off ? (a(), l("span", _n, "sandbox off")) : m("", !0),
              k("span", Yn, "Run time: " + g(G.value), 1),
              (me = e.facts) != null && me.last_activity ? (a(), l("span", Qn, [
                x[7] || (x[7] = h("Seen: ", -1)),
                p(d(Ie), {
                  at: e.facts.last_activity
                }, null, 8, ["at"])
              ])) : m("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : m("", !0),
        (ue = e.facts) != null && ue.unit_name ? (a(), l("div", Xn, "Unit: " + g(e.facts.unit_name), 1)) : m("", !0),
        e.open ? m("", !0) : (a(), V(Ka, {
          key: 3,
          tasks: $.value,
          "in-hand": e.row.role !== "helper" && ((re = e.facts) != null && re.job_enabled) && z.value || null,
          job: e.row.role === "helper" ? H.value : "",
          "job-title": e.row.role === "helper" && (($e = e.facts) == null ? void 0 : $e.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? U.value : "",
          "per-hour": A.value
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour"])),
        p(za, {
          state: i.value,
          doing: W.value,
          since: Me.value,
          seen: X.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (a(), V(sa, {
          key: 4,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: $.value,
          "stopped-with-work": M.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : m("", !0)
      ], 42, Fn);
    };
  }
}, to = /* @__PURE__ */ J(eo, [["__scopeId", "data-v-ea5fec71"]]), ao = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, no = ["data-agent-row", "data-agent-lingering"], Pe = "journal.agents.filters", Ge = 300 * 1e3, Be = "cubic-bezier(0.2, 0.9, 0.25, 1)", oo = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const o = e, t = Oe(), { rows: s } = t.props.waits, { rows: u } = t.props.progress, { rows: n, failure: y, loaded: f, more: j } = t.props.agents, $ = (T) => u.value.find((I) => I.agent_id === T.id) ?? null, N = (T) => {
      var I;
      return ((I = s.value.find((S) => S.agent_id === T.id)) == null ? void 0 : I.reason) ?? "";
    }, D = O("running"), z = O(""), H = JSON.parse(localStorage.getItem(Pe) || '{"roles":[],"profiles":[],"programs":[]}'), C = O(H), R = c(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: E } = t.props.programs, K = c(() => C.value.roles.length + C.value.profiles.length + C.value.programs.length), G = (T, I) => {
      C.value = $t(C.value, T, I);
    }, Q = () => {
      C.value = { roles: [], profiles: [], programs: [] };
    }, oe = (T) => T.slice(0, 1).toUpperCase() + T.slice(1);
    ge(C, (T) => localStorage.setItem(Pe, JSON.stringify(T)));
    const U = O(25);
    function Z() {
      Object.assign(t.state, {
        "agents.show": D.value,
        "agents.search": z.value,
        "agents.limit": String(U.value),
        "agents.roles": C.value.roles.join(","),
        "agents.profiles": C.value.profiles.join(","),
        "agents.programs": C.value.programs.join(",")
      });
    }
    async function M() {
      return U.value += 25, Z(), await t.reload("agents"), !0;
    }
    ge([D, z, C], () => {
      U.value = 25, Z(), t.reload("agents");
    }), Z();
    const v = (T) => T.facts ?? null, _ = n, Y = Ze(), i = O([]), r = c(() => new Set(i.value.filter((T) => Y.value - T.left < Ge).map((T) => T.row.id))), B = c(() => i.value.filter((T) => r.value.has(T.row.id)).map((T) => T.row)), L = c(() => [..._.value, ...B.value]);
    let A = "", q = [];
    async function W(T) {
      await t.reload(`card.${T.id}`);
      const I = t.props[`card.${T.id}`].rows.value.find((S) => S.id === T.id);
      I != null && I.ended_at && !i.value.some((S) => S.row.id === T.id) && (i.value = [...i.value, { row: I, left: Date.now() }]);
    }
    ge(n, (T) => {
      const I = A === `${D.value}|${z.value}|${JSON.stringify(C.value)}` && D.value === "running", S = I ? q.filter((P) => !T.some((pe) => pe.id === P.id)) : [];
      A = `${D.value}|${z.value}|${JSON.stringify(C.value)}`, q = T, i.value = I ? i.value.filter((P) => Y.value - P.left < Ge && !T.some((pe) => pe.id === P.row.id)) : [], S.forEach(W);
    }, { immediate: !0 });
    const he = c(() => !!z.value.trim() || K.value > 0), Me = c(() => o.texts[D.value] ?? { title: o.empty, hint: "" }), X = O(null), w = O(null), x = O(null), le = O(null), se = c(() => X.value === null ? null : t.props[`card.${X.value}`].rows.value.find((T) => T.id === X.value) ?? w.value), ve = c(() => se.value ? [se.value] : L.value), ue = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, re = O(!1);
    let $e = 0;
    async function ce(T) {
      if (re.value) return;
      re.value = !0, $e = le.value.scrollTop;
      const I = x.value.querySelector(`[data-agent-open="${T.id}"]`);
      if (!ue()) {
        const fe = [...x.value.querySelectorAll(".agent-row")].filter((ie) => !ie.contains(I));
        await Promise.all(fe.map((ie) => ie.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const S = [...I.querySelectorAll(".agent-head, .agent-line")], P = [...S, ...I.querySelectorAll("[data-agent-motion]")], pe = P.map((fe) => fe.getBoundingClientRect());
      if (w.value = T, X.value = T.id, t.reload(`card.${T.id}`), await Fe(), !ue()) {
        const fe = P.map((ie) => ie.getBoundingClientRect());
        P.forEach((ie, je) => {
          const be = S.findIndex((De) => De !== ie && De.contains(ie)), Ye = pe[je].left - fe[je].left - (be < 0 ? 0 : pe[be].left - fe[be].left), Qe = pe[je].top - fe[je].top - (be < 0 ? 0 : pe[be].top - fe[be].top);
          ie.animate([{ transform: `translate(${Ye}px, ${Qe}px)` }, { transform: "none" }], { duration: 280, easing: Be });
        }), x.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((ie) => {
          ie.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Be, fill: "backwards" });
        });
      }
      re.value = !1;
    }
    async function me() {
      if (re.value || !se.value) return;
      re.value = !0;
      const T = x.value.querySelector(`[data-agent-open="${X.value}"]`), I = [...T.children], S = ue() ? [] : I.map((P) => P.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(S.map((P) => P.finished)), X.value = null, await Fe(), le.value.scrollTop = $e, S.forEach((P) => P.cancel()), ue() || (T.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Be }), x.value.querySelectorAll(".agent-row").forEach((P) => {
        P.contains(T) || P.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Be });
      })), re.value = !1;
    }
    const Te = (T) => X.value === T.id ? me() : ce(T);
    ge(z, (T) => T.trim() && (X.value = null)), ge(D, () => {
      X.value = null;
    });
    const We = (T) => {
      T.key === "Escape" && me();
    };
    return window.addEventListener("keydown", We), Ce(() => window.removeEventListener("keydown", We)), (T, I) => (a(), l("div", {
      ref_key: "agents",
      ref: x,
      class: de(["agents", { focused: se.value, "card-changing": re.value }])
    }, [
      se.value ? m("", !0) : (a(), V(d(yt), {
        key: 0,
        modelValue: z.value,
        "onUpdate:modelValue": I[1] || (I[1] = (S) => z.value = S),
        placeholder: "Search agents",
        "menu-count": K.value,
        "data-agents-search": ""
      }, {
        menu: b(() => [
          p(d(ze), null, {
            default: b(() => [...I[2] || (I[2] = [
              h("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), l(F, null, ne(R.value.roles, (S) => (a(), V(d(Le), {
            key: S,
            role: "menuitemcheckbox",
            "aria-checked": C.value.roles.includes(S),
            checked: C.value.roles.includes(S),
            "data-filter-role": S,
            onClick: (P) => G("roles", S)
          }, {
            default: b(() => [
              h(g(oe(S)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          R.value.profiles.length ? (a(), V(d(ze), { key: 0 }, {
            default: b(() => [...I[3] || (I[3] = [
              h("Profile", -1)
            ])]),
            _: 1
          })) : m("", !0),
          (a(!0), l(F, null, ne(R.value.profiles, (S) => (a(), V(d(Le), {
            key: S.name,
            role: "menuitemcheckbox",
            "aria-checked": C.value.profiles.includes(S.name),
            checked: C.value.profiles.includes(S.name),
            "data-filter-profile": S.name,
            onClick: (P) => G("profiles", S.name)
          }, {
            default: b(() => [
              h(g(S.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          p(d(ze), null, {
            default: b(() => [...I[4] || (I[4] = [
              h("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), l(F, null, ne(d(E), (S) => (a(), V(d(Le), {
            key: S.name,
            role: "menuitemcheckbox",
            "aria-checked": C.value.programs.includes(S.name),
            checked: C.value.programs.includes(S.name),
            "data-filter-program": S.name,
            onClick: (P) => G("programs", S.name)
          }, {
            default: b(() => [
              h(g(S.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          K.value ? (a(), V(d(Le), {
            key: 1,
            "data-filter-clear": "",
            onClick: Q
          }, {
            default: b(() => [...I[5] || (I[5] = [
              h("Clear filters", -1)
            ])]),
            _: 1
          })) : m("", !0)
        ]),
        default: b(() => [
          p(d(wt), {
            options: R.value.states,
            value: D.value,
            onPick: I[0] || (I[0] = (S) => D.value = S)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      D.value === "retired" && R.value.upgrade_retired ? (a(), l("p", ao, "Retired during the upgrade: " + g(R.value.upgrade_retired), 1)) : m("", !0),
      k("div", {
        ref_key: "list",
        ref: le,
        class: de(["agents-view", { "agents-view-open": se.value }])
      }, [
        d(f) && !d(y) && !ve.value.length && K.value ? (a(), V(d(Ee), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: b(() => [
            p(d(te), {
              small: "",
              "data-empty-clear": "",
              onClick: Q
            }, {
              default: b(() => [...I[6] || (I[6] = [
                h("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), V(d(Mt), {
          key: 1,
          moves: "",
          "leaves-at-once": re.value,
          rows: ve.value,
          failure: d(y),
          loaded: d(f),
          more: !se.value && d(j),
          older: M,
          empty: Me.value.title,
          hint: Me.value.hint,
          searching: he.value
        }, {
          default: b(({ row: S }) => [
            k("div", {
              class: de(["agent-row", { lingering: r.value.has(S.id) && S.id !== X.value }]),
              "data-agent-row": S.id,
              "data-agent-lingering": r.value.has(S.id) ? "" : null
            }, [
              p(to, {
                row: S,
                facts: v(S),
                progress: $(S),
                "wait-reason": N(S),
                open: S.id === X.value,
                onToggle: (P) => Te(S)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, no)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, io = /* @__PURE__ */ J(oo, [["__scopeId", "data-v-fceb20c3"]]);
export {
  io as A
};
