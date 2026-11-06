/* @code-commandments-generated */
import { openBlock as a, createElementBlock as i, withModifiers as Y, unref as d, createTextVNode as m, toDisplayString as g, createVNode as b, createBlock as q, withCtx as S, Fragment as O, renderList as J, createElementVNode as p, createCommentVNode as f, ref as V, computed as k, watch as te, onUnmounted as ge, defineAsyncComponent as qe, createSlots as Fe, resolveDynamicComponent as De, normalizeStyle as le, normalizeClass as X, renderSlot as pe, onMounted as ze, Teleport as _e, mergeProps as Pe, toRef as Ue, withKeys as Te, withDirectives as Ke, vShow as Je, nextTick as Re } from "vue";
import { peekRef as ve, Icon as Me, RunningCommand as Ze, FoldGroup as Le, TaskStatusIcon as Ge, Btn as ae, TextArea as Ye, TextInput as Se, useWindow as he, SwitchCase as He, loadWindowComponent as Qe, coalesced as Xe, READ_RATES as et, InnerTabs as tt, TabBody as at, EmptyState as je, useNow as nt, age as lt, perHour as st, TimeAgo as $e, SearchBar as ot, Segmented as it, MenuLabel as Ce, MenuItem as be, RowList as rt, toggleFilter as dt } from "@journal/window-kit";
import { _ as G, T as ut } from "./TranscriptRows-CJMSUWzM.mjs";
const ct = {
  class: "agent-command",
  "data-agent-command": ""
}, gt = {
  key: 1,
  "data-agent-stopped": ""
}, pt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (r, o) => (a(), i("span", ct, [
      e.waitReason ? (a(), i("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: o[0] || (o[0] = Y((l) => d(ve)("test_queue:0"), ["stop"]))
      }, [
        m("Waiting: " + g(e.waitReason) + " ", 1),
        b(d(Me), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), i("span", gt, "Waiting")) : (a(), q(d(Ze), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, vt = /* @__PURE__ */ G(pt, [["__scopeId", "data-v-bb905922"]]), ht = ["data-agent-delegated", "onClick"], mt = { class: "agent-task-number" }, ft = { class: "agent-task-title" }, kt = ["title"], yt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: r }) {
    const o = r;
    return (l, v) => (a(), q(d(Le), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: v[0] || (v[0] = (w) => o("toggle"))
    }, {
      default: S(() => [
        (a(!0), i(O, null, J(e.section.tasks, (w) => (a(), i("button", {
          key: w.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": w.id,
          onClick: ($) => d(ve)(`tasks:${w.id}`)
        }, [
          b(d(Ge), {
            status: w.state
          }, null, 8, ["status"]),
          p("span", mt, g(w.id), 1),
          p("span", ft, g(w.title), 1),
          w.plan_id ? (a(), i("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${w.plan_id}: ${w.plan_title}`
          }, "Plan " + g(w.plan_id) + ": " + g(w.plan_title), 9, kt)) : f("", !0)
        ], 8, ht))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, bt = /* @__PURE__ */ G(yt, [["__scopeId", "data-v-acc154a9"]]), wt = { class: "action-field" }, Mt = ["value", "disabled"], xt = ["value"], $t = { key: 1 }, Ct = {
  key: 1,
  class: "action-field"
}, St = { class: "action-buttons" }, jt = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (r, o) => (a(), i("form", {
      onSubmit: o[4] || (o[4] = Y((l) => r.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (a(), i(O, { key: 0 }, [
        p("label", wt, [
          o[6] || (o[6] = m("Task ", -1)),
          p("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: o[0] || (o[0] = (l) => r.$emit("update:task", l.target.value))
          }, [
            o[5] || (o[5] = p("option", { value: "" }, "Choose an open task", -1)),
            (a(!0), i(O, null, J(e.tasks, (l) => (a(), i("option", {
              key: l.id,
              value: String(l.id)
            }, g(l.id) + ": " + g(l.title), 9, xt))), 128))
          ], 40, Mt)
        ]),
        e.moreTasks ? (a(), q(d(ae), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: o[1] || (o[1] = (l) => r.$emit("more"))
        }, {
          default: S(() => [...o[7] || (o[7] = [
            m("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : f("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (a(), i("p", $t, "No open tasks.")) : f("", !0)
      ], 64)) : (a(), i("label", Ct, [
        o[8] || (o[8] = m("Job", -1)),
        b(d(Ye), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: o[2] || (o[2] = (l) => r.$emit("update:text", l.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      p("div", St, [
        b(d(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: S(() => [...o[9] || (o[9] = [
            m("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        b(d(ae), {
          small: "",
          disabled: e.pending,
          onClick: o[3] || (o[3] = (l) => r.$emit("cancel"))
        }, {
          default: S(() => [...o[10] || (o[10] = [
            m("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, At = /* @__PURE__ */ G(jt, [["__scopeId", "data-v-356a2712"]]), Tt = { class: "action-buttons" }, Rt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (r, o) => (a(), i("form", {
      "data-agent-retire-confirm": "",
      onSubmit: o[2] || (o[2] = Y((l) => r.$emit("submit"), ["prevent"]))
    }, [
      o[5] || (o[5] = p("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      b(d(Se), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": o[0] || (o[0] = (l) => r.$emit("update:reason", l))
      }, null, 8, ["model-value", "disabled"]),
      p("div", Tt, [
        b(d(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: S(() => [...o[3] || (o[3] = [
            m("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        b(d(ae), {
          small: "",
          disabled: e.pending,
          onClick: o[1] || (o[1] = (l) => r.$emit("cancel"))
        }, {
          default: S(() => [...o[4] || (o[4] = [
            m("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Vt = /* @__PURE__ */ G(Rt, [["__scopeId", "data-v-bbe4e841"]]), zt = { class: "action-buttons" }, Lt = {
  key: 0,
  role: "alert"
}, Ht = {
  key: 1,
  role: "status"
}, Bt = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const r = e, o = he(), l = V(""), v = V(""), w = V(""), $ = V(""), M = V([]), C = V(0), T = V(!1), I = V(!1), H = V(!1), R = V(""), D = V(""), z = k(() => !!r.row.retired_at || r.row.state === "retired"), j = k(() => !z.value && !!r.row.ended_at), F = k(() => {
      var t;
      return j.value && ((t = r.row.job_command) == null ? void 0 : t.length) && !r.row.resume_reason;
    }), L = k(() => F.value && !I.value && (r.row.job_task_flag ? M.value.some((t) => String(t.id) === $.value) : !!v.value.trim()));
    function _(t) {
      l.value = t, v.value = "", w.value = "", $.value = "", R.value = "", D.value = "";
    }
    async function U() {
      _("job"), r.row.job_task_flag && (M.value = [], C.value = 0, T.value = !1, await P());
    }
    async function P() {
      if (!I.value) {
        I.value = !0;
        try {
          o.state["jobs.page"] = String(C.value + 1), await o.reload("jobs");
          const t = o.props.jobs;
          R.value = t.failure.value, R.value || (M.value = [...M.value, ...t.rows.value], C.value = t.data.value.page, T.value = t.more.value);
        } finally {
          I.value = !1;
        }
      }
    }
    async function h(t, n) {
      if (!H.value) {
        H.value = !0, R.value = "";
        try {
          const u = await o.run(t);
          R.value = u.ok ? "" : u.error, u.ok && (_(""), D.value = n);
        } finally {
          H.value = !1;
        }
      }
    }
    async function y() {
      if (!L.value) return;
      const t = r.row.job_task_flag ? [r.row.job_task_flag, $.value] : [v.value.trim()];
      await h([...r.row.job_command, String(r.row.id), ...t], "Job sent.");
    }
    async function s() {
      !j.value || l.value !== "retire" || !w.value.trim() || await h(["agent", "retire", String(r.row.id), "--reason", w.value.trim()], "Agent retired permanently.");
    }
    return (t, n) => {
      var u;
      return z.value ? f("", !0) : (a(), i("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: n[6] || (n[6] = Y(() => {
        }, ["stop"])),
        onKeydown: n[7] || (n[7] = Y(() => {
        }, ["stop"]))
      }, [
        p("div", zt, [
          j.value ? (a(), i(O, { key: 0 }, [
            (u = e.row.job_command) != null && u.length ? (a(), q(d(ae), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: H.value || I.value || !F.value,
              onClick: U
            }, {
              default: S(() => [...n[8] || (n[8] = [
                m("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0),
            e.row.role !== "main" ? (a(), q(d(ae), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: H.value || I.value,
              onClick: n[0] || (n[0] = (B) => _("retire"))
            }, {
              default: S(() => [...n[9] || (n[9] = [
                m("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0)
          ], 64)) : f("", !0)
        ]),
        b(d(He), { value: l.value }, {
          job: S(() => [
            b(At, {
              task: $.value,
              "onUpdate:task": n[1] || (n[1] = (B) => $.value = B),
              text: v.value,
              "onUpdate:text": n[2] || (n[2] = (B) => v.value = B),
              row: e.row,
              tasks: M.value,
              pending: H.value,
              loading: I.value,
              "more-tasks": T.value,
              failure: R.value,
              "job-ready": L.value,
              onSubmit: y,
              onMore: P,
              onCancel: n[3] || (n[3] = (B) => _(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: S(() => [
            b(Vt, {
              reason: w.value,
              "onUpdate:reason": n[4] || (n[4] = (B) => w.value = B),
              pending: H.value,
              onSubmit: s,
              onCancel: n[5] || (n[5] = (B) => _(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        R.value ? (a(), i("p", Lt, g(R.value), 1)) : f("", !0),
        D.value ? (a(), i("p", Ht, g(D.value), 1)) : f("", !0)
      ], 32));
    };
  }
}, Ot = /* @__PURE__ */ G(Bt, [["__scopeId", "data-v-a17d1322"]]), It = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Et = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Nt = {
  key: 2,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, Wt = {
  key: 4,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, qt = ["data-peek", "onClick"], Ft = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Dt = {
  key: 0,
  class: "agent-helper-brief"
}, _t = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Pt = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Ut = "It ended without a report", Kt = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean, totalCount: Number, tasksPerHour: String },
  setup(e) {
    const r = e, o = ["started", "blocked", "open", "completed"], l = k(() => {
      var t, n;
      return r.row.ended_at && ((n = (t = r.facts) == null ? void 0 : t.job_returned) != null && n.startsWith(Ut)) ? r.facts.job_returned : "";
    }), v = k(() => r.tasks.length ? o.map((t) => ({ state: t, label: t.slice(0, 1).toUpperCase() + t.slice(1), tasks: r.tasks.filter((n) => n.state === t || t === "started" && n.state === "testing" || t === "completed" && n.state === "cancelled") })) : []), w = /* @__PURE__ */ new Set(["completed"]), $ = V({}), M = (t) => !($.value[t] ?? w.has(t)), C = (t) => $.value = { ...$.value, [t]: M(t) }, T = he(), { rows: I } = T.props.reports;
    T.state["reports.agent"] = String(r.row.id);
    const H = k(() => r.row.access === "read-only"), R = k(() => !!r.row.retired_at || r.row.state === "retired"), D = k(() => R.value ? T.tabs.filter((t) => ["reports", "transcript"].includes(t.key)) : H.value ? T.tabs.filter((t) => ["reports", "transcript", "terminal"].includes(t.key)) : T.tabs), z = () => H.value || R.value ? D.value.find((t) => t.key === "transcript") : D.value[0], j = V(z());
    te(j, (t) => {
      T.state.tab = (t == null ? void 0 : t.key) ?? "";
    }, { immediate: !0 }), ge(() => {
      T.state.tab = "";
    }), te(D, (t) => {
      t.some((n) => {
        var u;
        return n.key === ((u = j.value) == null ? void 0 : u.key);
      }) || (j.value = t[0]);
    }), te(() => r.open, (t) => {
      t && (j.value = z());
    });
    const F = Object.fromEntries(T.tabs.filter((t) => t.component).map((t) => [t.key, qe(() => Qe(t.component))])), L = V(!1), { data: _ } = T.props.tool, U = k(() => {
      var t;
      return ((t = _.value) == null ? void 0 : t.tool) ?? "";
    }), P = k(() => {
      var t;
      return ((t = _.value) == null ? void 0 : t.note) ?? "";
    }), h = k(() => r.row.role !== "main" && (!r.row.ended_at || r.stoppedWithWork || r.waitReason));
    async function y() {
      !r.open || !h.value || (T.state["tool.agent"] = String(r.row.id), await T.reload("tool"));
    }
    const s = T.follow(["hook_call.*", "process_part.*"], Xe(y, et.agentCommand));
    return ge(() => s == null ? void 0 : s()), te(() => r.open, (t) => {
      t && y();
    }, { immediate: !0 }), (t, n) => {
      var u;
      return a(), i("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: n[2] || (n[2] = Y(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (a(), i("p", It, "Retirement reason: " + g(e.row.retirement_reason), 1)) : f("", !0),
        e.row.resume_reason ? (a(), i("p", Et, g(e.row.resume_reason), 1)) : f("", !0),
        b(Ot, { row: e.row }, null, 8, ["row"]),
        e.totalCount && e.tasksPerHour ? (a(), i("span", Nt, g(e.tasksPerHour), 1)) : f("", !0),
        h.value ? (a(), q(vt, {
          key: 3,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: U.value,
          note: P.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : f("", !0),
        l.value ? (a(), i("p", Wt, g(l.value), 1)) : f("", !0),
        b(d(tt), {
          class: "agent-tabs",
          tabs: D.value,
          active: j.value,
          answer: { tasks: e.tasks.length, reports: d(I).length },
          onChoose: n[0] || (n[0] = (B) => j.value = B)
        }, null, 8, ["tabs", "active", "answer"]),
        b(d(at), {
          class: "agent-tab-body",
          tab: j.value,
          "data-agent-tab-body": (u = j.value) == null ? void 0 : u.key
        }, {
          default: S(() => {
            var B;
            return [
              b(d(He), {
                value: (B = j.value) == null ? void 0 : B.key
              }, Fe({
                reports: S(() => [
                  d(I).length ? f("", !0) : (a(), q(d(je), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: S(() => [...n[3] || (n[3] = [
                      m("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (a(!0), i(O, null, J(d(I), (c) => (a(), i("button", {
                    key: c.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${c.id}`,
                    onClick: (x) => d(ve)(`messages:${c.id}`)
                  }, g(c.text), 9, qt))), 128))
                ]),
                tasks: S(() => {
                  var c;
                  return [
                    e.tasks.length ? f("", !0) : (a(), q(d(je), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: S(() => [...n[4] || (n[4] = [
                        m("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (a(!0), i(O, null, J(v.value, (x) => (a(), q(bt, {
                      key: x.state,
                      section: x,
                      open: M(x.state),
                      onToggle: (N) => C(x.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (c = e.facts) != null && c.instruction ? (a(), i(O, { key: 1 }, [
                      n[5] || (n[5] = p("p", { class: "agent-label" }, "Instruction", -1)),
                      p("div", Ft, g(e.facts.instruction), 1)
                    ], 64)) : f("", !0)
                  ];
                }),
                transcript: S(() => {
                  var c;
                  return [
                    H.value ? (a(), i(O, { key: 0 }, [
                      (c = e.facts) != null && c.instruction ? (a(), i("div", Dt, [
                        b(d(Le), {
                          label: "Instruction",
                          open: L.value,
                          "data-agent-section": "instruction",
                          onToggle: n[1] || (n[1] = (x) => L.value = !L.value)
                        }, {
                          default: S(() => [
                            p("div", _t, g(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (a(), i("p", Pt, "No job recorded")) : f("", !0)
                    ], 64)) : f("", !0),
                    b(ut, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                J(d(F), (c, x) => ({
                  name: x,
                  fn: S(() => [
                    (a(), q(De(c), {
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
}, Jt = /* @__PURE__ */ G(Kt, [["__scopeId", "data-v-42318874"]]), Zt = ["stroke-width", "innerHTML"], Z = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const r = e, o = { right: 0, down: 90, left: 180, up: 270 }, l = {
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
    }, v = {
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
    return (w, $) => (a(), i("svg", {
      class: "ico",
      style: le({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...r.facing === "right" ? {} : { transform: `rotate(${o[r.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: v[l[e.name] || e.name] || v.dot
    }, null, 12, Zt));
  }
}, Gt = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Yt = {
  key: 1,
  class: "menu-item-text"
}, Qt = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (r, o) => (a(), i("button", {
      type: "button",
      class: X(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), i("span", Gt, g(e.checked ? "✓" : ""), 1)) : f("", !0),
      e.description ? (a(), i("span", Yt, [
        p("span", null, [
          pe(r.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, g(e.description), 1)
      ])) : pe(r.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, de = /* @__PURE__ */ G(Qt, [["__scopeId", "data-v-9c67fe37"]]), Xt = {}, ea = { class: "menu-label" };
function ta(e, r) {
  return a(), i("span", ea, [
    pe(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ce = /* @__PURE__ */ G(Xt, [["render", ta], ["__scopeId", "data-v-71c11156"]]), aa = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, na = {
  key: 0,
  class: "skills-none"
}, la = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: r }) {
    const o = e, l = r, v = k(() => o.skills.filter(($) => $.state === "loaded")), w = k(() => o.skills.filter(($) => $.state !== "loaded"));
    return ($, M) => (a(), i("div", aa, [
      b(ce, null, {
        default: S(() => [...M[1] || (M[1] = [
          m("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      v.value.length ? f("", !0) : (a(), i("p", na, "None yet. Compacting the conversation empties this list.")),
      (a(!0), i(O, null, J(v.value, (C) => (a(), i("p", {
        key: C.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        b(Z, {
          name: "book",
          size: 12
        }),
        m(g(C.skill), 1)
      ]))), 128)),
      w.value.length ? (a(), i(O, { key: 1 }, [
        b(ce, null, {
          default: S(() => [...M[2] || (M[2] = [
            m("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), i(O, null, J(w.value, (C) => (a(), i("p", {
          key: C.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          b(Z, {
            name: "book",
            size: 12
          }),
          m(g(C.skill), 1)
        ]))), 128))
      ], 64)) : f("", !0),
      b(de, {
        "data-agent-skills-browse": "",
        onClick: M[0] || (M[0] = (C) => l("browse"))
      }, {
        default: S(() => [...M[3] || (M[3] = [
          m("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, sa = /* @__PURE__ */ G(la, [["__scopeId", "data-v-27140adf"]]), oa = (e, r, o) => Math.max(r, Math.min(o, e)), Be = /* @__PURE__ */ new WeakMap(), ia = (e, r) => Be.set(e, r);
function ra(e, r) {
  for (let o = r; o; o = Be.get(o) ?? o.parentElement) if (o === e) return !0;
  return !1;
}
function da(e, r) {
  const o = (l) => {
    var w, $;
    const v = ((w = e.value) == null ? void 0 : w.element) || (($ = e.value) == null ? void 0 : $.$el) || e.value;
    v && !ra(v, l.target) && r(l);
  };
  window.addEventListener("click", o), ge(() => window.removeEventListener("click", o));
}
const re = 8, ua = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: r, emit: o }) {
    const l = e, v = V(null), w = (c) => c ? `${c}px` : void 0, $ = k(() => ({
      minWidth: w(l.minWidth),
      maxWidth: w(l.maxWidth),
      maxHeight: w(l.maxHeight),
      height: w(l.height)
    })), M = V({ w: 0, h: 0 }), C = V(l.anchor ? l.anchor.getBoundingClientRect() : null), T = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), I = (c) => ({
      left: Math.max(0, c.left),
      top: Math.max(0, c.top),
      right: Math.min(window.innerWidth, c.right),
      bottom: Math.min(window.innerHeight, c.bottom)
    }), H = (c) => {
      const x = c.closest(".pane, .float-window");
      return x ? I(x.getBoundingClientRect()) : T();
    }, R = (c, x) => `${Math.max(0, c ? Math.min(c, x) : x)}px`;
    function D(c, x) {
      return {
        below: c.bottom - x.bottom - l.gap - re,
        above: x.top - c.top - l.gap - re,
        across: c.right - c.left - 2 * re
      };
    }
    function z(c) {
      const x = H(l.anchor), N = D(x, c);
      return M.value.w <= N.across && M.value.h <= Math.max(N.below, N.above) ? x : T();
    }
    const j = k(() => {
      if (!C.value) return $.value;
      const c = C.value, x = z(c), N = D(x, c), { w: Q, h: ue } = M.value, me = l.align === "auto" ? c.left + c.right > x.left + x.right : l.align === "right", oe = oa(me ? c.right - Q : c.left, x.left + re, Math.max(x.left + re, x.right - Q - re)), fe = ue > N.below && N.above > N.below ? { bottom: `${window.innerHeight - c.top + l.gap}px`, maxHeight: R(l.maxHeight, N.above) } : { top: `${c.bottom + l.gap}px`, maxHeight: R(l.maxHeight, N.below) };
      return { ...$.value, ...fe, left: `${oe}px`, maxWidth: R(l.maxWidth, N.across) };
    }), F = o, L = () => [...v.value.querySelectorAll("button:not(:disabled)")];
    function _(c) {
      const x = L(), N = x.indexOf(document.activeElement);
      x[(N + c + x.length) % x.length].focus();
    }
    const U = { ArrowDown: () => _(1), ArrowUp: () => _(-1), Escape: () => F("close") }, P = (c) => U[c.key] && (c.preventDefault(), U[c.key]()), h = () => v.value && (M.value = { w: v.value.offsetWidth, h: v.value.scrollHeight });
    let y = 0;
    const s = new ResizeObserver(() => {
      cancelAnimationFrame(y), y = requestAnimationFrame(h);
    });
    da(v, (c) => l.anchor && !l.anchor.contains(c.target) && F("close"));
    const t = (c, x) => ["top", "left", "right", "bottom"].some((N) => Math.abs(c[N] - x[N]) > 1), n = (c) => c.bottom < 0 || c.top > window.innerHeight;
    let u = 0;
    function B() {
      if (l.anchor) {
        const c = l.anchor.getBoundingClientRect();
        if (!l.anchor.isConnected || n(c)) return F("close");
        t(c, C.value) && (C.value = c);
      }
      u = requestAnimationFrame(B);
    }
    return ze(() => {
      l.anchor && v.value && ia(v.value, l.anchor), h(), v.value && s.observe(v.value), !l.plain && L()[0] && L()[0].focus(), B();
    }), ge(() => {
      s.disconnect(), cancelAnimationFrame(u), cancelAnimationFrame(y);
    }), r({ element: v }), (c, x) => (a(), q(_e, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", Pe({
        ref_key: "panel",
        ref: v
      }, c.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: j.value,
        onKeydown: P
      }), [
        pe(c.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ca = /* @__PURE__ */ G(ua, [["__scopeId", "data-v-7f046e0d"]]);
async function ga(e, r, o) {
  if (!e) return o(r);
  const { target: l, fields: v } = e, w = Object.fromEntries(Object.keys(v).map((C) => [C, l[C]])), $ = () => Object.assign(l, w);
  Object.assign(l, v);
  let M = !1;
  try {
    const C = await o(r);
    return M = C.ok, C;
  } finally {
    M || $();
  }
}
function pa(e, r, o) {
  const l = V([]), v = V([]), w = V({}), $ = V(""), M = V(!1), C = k(() => !!e.value && !e.value.ended_at), T = k(() => C.value && !!e.value.paused_at);
  async function I() {
    if (C.value) {
      const F = await r(["agent", "controls", String(e.value.id)]);
      l.value = F.ok ? F.value.groups : [];
      return;
    }
    const j = await r(["agent", "programs"]);
    v.value = j.ok ? j.value.rows : [];
  }
  async function H(j, F = null) {
    $.value = "";
    const L = await ga(F, j, r);
    return $.value = L.ok ? "" : L.error, o(), L;
  }
  const R = (j, F) => H(["agent", "control", String(e.value.id), j, F.value], { target: w, fields: { value: { ...w.value, [j]: F.label } } }), D = () => (M.value = !1, H(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), z = (j) => H(["agent", "launch", j.name]);
  return ze(I), te(C, I), { groups: l, programs: v, chosen: w, failure: $, asking: M, running: C, paused: T, choose: R, stop: D, start: z };
}
const Oe = { claude: "Claude Code", codex: "Codex" };
Object.entries(Oe).map(([e, r]) => ({ key: e, label: r }));
function va(e, r = "agent") {
  return Oe[e] || r;
}
function ha(e) {
  if (!e) return "Not compacted yet";
  const r = new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return e.start_percent === null ? `Last compacted ${r}` : e.end_percent === null ? `Last compacted ${r}, from ${e.start_percent}%` : `Last compacted ${r}, from ${e.start_percent}% to ${e.end_percent}%, ${e.start_percent - e.end_percent}% taken off`;
}
const ma = ["disabled", "title"], fa = ["title"], ka = { class: "gauge usage" }, ya = ["disabled", "title"], ba = { class: "gauge" }, wa = ["disabled", "title"], Ma = ["disabled"], xa = ["disabled"], $a = {
  key: 5,
  class: "fact",
  "data-fact": "uptime",
  title: "How long this session has run"
}, Ca = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Sa = ["title"], ja = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Aa = { class: "gauge" }, Ta = { class: "context-used" }, Ra = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Va = 75, za = {
  __name: "InformationBar",
  props: {
    agent: { type: Object, default: null },
    card: Boolean,
    loading: Boolean,
    jobs: { type: Number, default: 0 },
    usage: { type: Object, default: () => ({ agents: [], windows: [] }) },
    branch: { type: String, default: "" },
    now: { type: Number, default: () => Date.now() },
    fitness: { type: Object, default: null },
    run: { type: Function, default: null }
  },
  emits: ["open", "changed"],
  setup(e, { emit: r }) {
    const o = e, l = r, v = pa(Ue(o, "agent"), o.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => l("changed")), w = V(null), $ = V(""), M = k(() => v.groups.value.find((s) => s.key === $.value));
    function C(s, t) {
      w.value = s.currentTarget, $.value = t;
    }
    function T() {
      w.value = null, $.value = "", v.asking.value = !1;
    }
    const I = V([]), H = k(() => I.value.filter((s) => s.state === "loaded"));
    async function R() {
      const s = o.agent && o.run ? await o.run(["agent-skill", "list", "--agent", String(o.agent.id)]) : null;
      I.value = s != null && s.ok ? s.value.rows ?? [] : [];
    }
    function D(s) {
      C(s, "skills"), R();
    }
    te(() => {
      var s;
      return (s = o.agent) == null ? void 0 : s.id;
    }, R, { immediate: !0 });
    const z = (s) => v.groups.value.some((t) => t.key === s), j = k(() => {
      var s;
      return v.chosen.value.model ?? ((s = L.value) == null ? void 0 : s.model) ?? "";
    }), F = k(() => {
      var s;
      return v.chosen.value.effort ?? ((s = L.value) == null ? void 0 : s.effort) ?? "";
    });
    k(() => !!o.agent && !o.agent.ended_at);
    const L = k(() => {
      var s;
      return ((s = o.usage.agents) == null ? void 0 : s.find((t) => {
        var n;
        return t.id === ((n = o.agent) == null ? void 0 : n.id);
      })) ?? null;
    }), _ = k(() => {
      var s;
      return ((s = o.usage.windows) == null ? void 0 : s[0]) ?? null;
    }), U = k(() => _.value ? Math.max(0, Math.min(100, Math.round(_.value.used_percent))) : null), P = k(() => {
      var s;
      return ((s = L.value) == null ? void 0 : s.context_percent) == null ? null : Math.round(L.value.context_percent);
    }), h = k(() => {
      var s;
      return (s = L.value) != null && s.cost_dollars ? `$${L.value.cost_dollars.toFixed(2)}` : "";
    }), y = k(() => {
      var n;
      const s = (n = o.agent) != null && n.process_started_at ? new Date(o.agent.process_started_at).getTime() : 0;
      if (!s) return "";
      const t = Math.max(0, Math.floor((o.now - s) / 6e4));
      return t >= 60 ? `${Math.floor(t / 60)}h ${t % 60}m` : `${t}m`;
    });
    return (s, t) => (a(), i("div", {
      class: X(["information", { card: e.card }]),
      "data-information-bar": ""
    }, [
      e.agent ? (a(), i(O, { key: 0 }, [
        p("button", {
          type: "button",
          class: "fact lead",
          disabled: e.card,
          "data-fact": "agent",
          title: `Session ${e.agent.session}: stop it`,
          onClick: t[0] || (t[0] = (n) => C(n, "agent"))
        }, [
          b(Z, {
            name: "agents",
            size: 12
          }),
          m(" " + g(d(va)(e.agent.program)), 1)
        ], 8, ma),
        U.value !== null ? (a(), i("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${U.value}% of the plan's ${_.value.title} allowance used`,
          onClick: t[1] || (t[1] = (n) => l("open", "usage", n.currentTarget))
        }, [
          b(Z, {
            name: "clock",
            size: 12
          }),
          t[14] || (t[14] = m()),
          p("span", ka, [
            p("span", {
              style: le({ width: `${U.value}%` })
            }, null, 4)
          ]),
          m(" " + g(U.value) + "% ", 1)
        ], 8, fa)) : f("", !0),
        P.value !== null ? (a(), i("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "context",
          title: `Context ${P.value}% full: clear or compact it`,
          onClick: t[2] || (t[2] = (n) => z("context") ? C(n, "context") : l("open", "context", n.currentTarget))
        }, [
          b(Z, {
            name: "gauge",
            size: 12
          }),
          t[15] || (t[15] = m()),
          p("span", ba, [
            p("span", {
              style: le({ width: `${P.value}%` })
            }, null, 4)
          ]),
          m(" " + g(P.value) + "% ", 1)
        ], 8, ya)) : f("", !0),
        j.value ? (a(), i("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "model",
          title: `${j.value}: change the model`,
          onClick: t[3] || (t[3] = (n) => z("model") ? C(n, "model") : null)
        }, [
          b(Z, {
            name: "model",
            size: 12
          }),
          m(" " + g(j.value), 1)
        ], 8, wa)) : f("", !0),
        z("effort") || e.card && F.value ? (a(), i("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: t[4] || (t[4] = (n) => C(n, "effort"))
        }, [
          b(Z, {
            name: "bolt",
            size: 12
          }),
          m(" " + g(F.value), 1)
        ], 8, Ma)) : f("", !0),
        h.value ? (a(), i("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: t[5] || (t[5] = (n) => l("open", "cost", n.currentTarget))
        }, g(h.value), 9, xa)) : f("", !0),
        y.value ? (a(), i("span", $a, [
          b(Z, {
            name: "reminders",
            size: 12
          }),
          m(" " + g(y.value), 1)
        ])) : f("", !0),
        e.branch ? (a(), i("span", Ca, [
          b(Z, {
            name: "branch",
            size: 12
          }),
          m(" " + g(e.branch), 1)
        ])) : f("", !0),
        e.card ? f("", !0) : (a(), i("button", {
          key: 7,
          type: "button",
          class: X(["fact", { none: !e.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: t[6] || (t[6] = (n) => l("open", "jobs", n.currentTarget))
        }, [
          b(Z, {
            name: "clock",
            size: 12
          }),
          m(" " + g(e.jobs), 1)
        ], 2)),
        e.run ? (a(), i("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: D
        }, [
          b(Z, {
            name: "book",
            size: 12
          }),
          m(" " + g(H.value.length), 1)
        ])) : f("", !0),
        e.fitness ? (a(), i(O, { key: 9 }, [
          p("button", {
            type: "button",
            class: X(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Va }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: t[7] || (t[7] = (n) => l("open", "fitness", n.currentTarget))
          }, [
            b(Z, {
              name: "heart",
              size: 12
            }),
            m(" " + g(e.fitness.is_measured ? e.fitness.score : "–"), 1)
          ], 2),
          p("button", {
            type: "button",
            class: X(["fact", "load-fact", e.fitness.workload_level]),
            "data-fact": "load",
            title: "Compare incoming messages with agent replies",
            onClick: t[8] || (t[8] = (n) => l("open", "load", n.currentTarget))
          }, [
            b(Z, {
              name: "weight",
              size: 12
            }),
            m(" " + g(e.fitness.workload), 1)
          ], 2)
        ], 64)) : f("", !0)
      ], 64)) : e.run && !e.loading ? (a(), i("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: t[9] || (t[9] = (n) => C(n, "start"))
      }, [
        b(Z, {
          name: "agents",
          size: 12
        }),
        t[16] || (t[16] = m(" Start an agent", -1))
      ])) : f("", !0),
      t[22] || (t[22] = p("span", { class: "space" }, null, -1)),
      d(v).failure.value ? (a(), i("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: d(v).failure.value
      }, g(d(v).failure.value), 9, Sa)) : f("", !0),
      pe(s.$slots, "default", {}, void 0, !0),
      w.value ? (a(), q(ca, {
        key: 3,
        anchor: w.value,
        "min-width": 190,
        onClose: T
      }, {
        default: S(() => {
          var n;
          return [
            $.value === "agent" ? (a(), i(O, { key: 0 }, [
              d(v).asking.value ? (a(), i(O, { key: 0 }, [
                b(ce, { "data-agent-stop-ask": "" }, {
                  default: S(() => [...t[17] || (t[17] = [
                    m("Stop the agent? It stops what it is doing.", -1)
                  ])]),
                  _: 1
                }),
                b(de, {
                  "data-agent-stop-confirm": "",
                  onClick: t[10] || (t[10] = (u) => (T(), d(v).stop()))
                }, {
                  default: S(() => [...t[18] || (t[18] = [
                    m("Stop it", -1)
                  ])]),
                  _: 1
                }),
                b(de, {
                  onClick: t[11] || (t[11] = (u) => d(v).asking.value = !1)
                }, {
                  default: S(() => [...t[19] || (t[19] = [
                    m("Keep it running", -1)
                  ])]),
                  _: 1
                })
              ], 64)) : (a(), q(de, {
                key: 1,
                "data-agent-stop": "",
                onClick: t[12] || (t[12] = (u) => d(v).asking.value = !0)
              }, {
                default: S(() => [...t[20] || (t[20] = [
                  m("Stop", -1)
                ])]),
                _: 1
              }))
            ], 64)) : $.value === "start" ? (a(), i(O, { key: 1 }, [
              b(ce, null, {
                default: S(() => [...t[21] || (t[21] = [
                  m("Start an agent", -1)
                ])]),
                _: 1
              }),
              (a(!0), i(O, null, J(d(v).programs.value, (u) => (a(), q(de, {
                key: u.name,
                "data-agent-program": u.name,
                onClick: (B) => (T(), d(v).start(u))
              }, {
                default: S(() => [
                  m(g(u.title), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-program", "onClick"]))), 128))
            ], 64)) : $.value === "skills" ? (a(), q(sa, {
              key: 2,
              skills: I.value,
              onBrowse: t[13] || (t[13] = (u) => (T(), l("open", "skills", null)))
            }, null, 8, ["skills"])) : M.value ? (a(), i(O, { key: 3 }, [
              b(ce, null, {
                default: S(() => [
                  m(g(M.value.label), 1)
                ]),
                _: 1
              }),
              $.value === "context" ? (a(), i(O, { key: 0 }, [
                p("div", ja, [
                  p("span", Aa, [
                    p("span", {
                      style: le({ width: `${P.value}%` })
                    }, null, 4)
                  ]),
                  p("span", Ta, g(P.value) + "%", 1)
                ]),
                p("p", Ra, g(d(ha)(((n = L.value) == null ? void 0 : n.last_compaction) ?? null)), 1)
              ], 64)) : f("", !0),
              (a(!0), i(O, null, J(M.value.choices, (u) => (a(), q(de, {
                key: u.value,
                "data-agent-choice": u.value,
                onClick: (B) => (d(v).choose(M.value.key, u), T())
              }, {
                default: S(() => [
                  m(g(u.label), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-choice", "onClick"]))), 128))
            ], 64)) : f("", !0)
          ];
        }),
        _: 1
      }, 8, ["anchor"])) : f("", !0)
    ], 2));
  }
}, La = /* @__PURE__ */ G(za, [["__scopeId", "data-v-d5933ce4"]]), Ha = ["data-agent-open", "aria-expanded", "role", "tabindex"], Ba = { class: "agent-head" }, Oa = ["data-state"], Ia = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Ea = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Na = { class: "agent-times" }, Wa = {
  key: 0,
  class: "agent-time",
  "data-agent-motion": ""
}, qa = {
  key: 1,
  class: "agent-time",
  "data-agent-motion": ""
}, Fa = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": ""
}, Da = { class: "agent-line" }, _a = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Pa = {
  key: 0,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Ua = {
  key: 1,
  class: "agent-line"
}, Ka = {
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, Ja = {
  key: 2,
  class: "agent-line agent-work-start"
}, Za = ["data-peek"], Ga = ["title"], Ya = ["data-peek"], Qa = ["data-agent-waiting", "data-agent-stopped"], Xa = {
  key: 1,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, en = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: r }) {
    const o = { helper: "Helper", reviewer: "Reviewer" }, l = e, v = r, w = nt(), $ = k(() => {
      var u, B;
      if ((u = l.facts) != null && u.profile_title) return l.facts.profile_title;
      if ((B = l.facts) != null && B.profile) return l.facts.profile;
      const n = o[l.row.role] || l.row.role;
      return n.slice(0, 1).toUpperCase() + n.slice(1);
    }), M = k(() => {
      var n;
      return ((n = l.facts) == null ? void 0 : n.tasks) ?? [];
    }), C = k(() => M.value.filter((n) => n.state === "open")), T = k(() => {
      const n = M.value.find((u) => {
        var B;
        return u.id === ((B = l.facts) == null ? void 0 : B.task_id);
      });
      return n != null && n.plan_id ? n : C.value.find((u) => u.plan_id);
    }), I = k(() => {
      var n, u, B, c, x;
      return l.row.role === "helper" ? ((n = l.facts) == null ? void 0 : n.helper_job) || "" : (u = l.facts) != null && u.job_enabled && (((B = l.facts) == null ? void 0 : B.task_title) || ((c = C.value[0]) == null ? void 0 : c.title) || ((x = M.value.at(-1)) == null ? void 0 : x.title)) || "";
    }), H = k(() => {
      const n = I.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return n ? `${n[1].toLowerCase() === "plan" ? "plans" : "docs"}:${n[2]}` : "";
    }), R = k(() => l.row.role === "main" ? "" : `${l.row.role} ${l.row.id}`), D = k(() => {
      var n, u;
      return [l.row.program, (n = l.facts) == null ? void 0 : n.model, (u = l.facts) == null ? void 0 : u.effort, R.value].filter(Boolean).join(" · ");
    }), z = he(), j = k(() => lt(l.row.process_started_at || l.row.created_at, w.value)), F = /* @__PURE__ */ new Set(["open", "started", "testing"]), L = k(() => !!l.row.ended_at && l.row.role !== "main" && M.value.some((n) => F.has(n.state))), _ = k(() => {
      var n;
      return l.row.retired_at || l.row.state === "retired" ? "retired" : l.waitReason || L.value ? "waiting" : l.row.state === "running" && ((n = l.facts) == null ? void 0 : n.state) || l.row.state;
    }), U = k(() => l.waitReason ? `Waiting: ${l.waitReason}` : _.value === "blocked" ? "Blocked" : L.value ? "Stopped with work left" : ""), P = k(() => {
      var n;
      return ((n = l.progress) == null ? void 0 : n.completed_count) ?? M.value.filter((u) => u.state === "completed").length;
    }), h = k(() => {
      var n;
      return ((n = l.progress) == null ? void 0 : n.task_count) ?? M.value.length;
    }), y = k(() => `${P.value} of ${h.value} ${h.value === 1 ? "task" : "tasks"}`), s = k(() => {
      var u;
      const n = st(P.value, ((u = l.progress) == null ? void 0 : u.started_at) || l.row.created_at, l.progress ? l.progress.finished_at : l.row.ended_at, w.value);
      return l.row.role !== "main" && n ? `${n} per hour` : "";
    }), t = k(() => !!l.row.retired_at || l.row.state === "retired");
    return (n, u) => {
      var B, c, x;
      return a(), i("div", {
        class: X(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: u[4] || (u[4] = (N) => !e.open && v("toggle")),
        onKeydown: [
          u[5] || (u[5] = Te(Y((N) => !e.open && v("toggle"), ["self", "prevent"]), ["enter"])),
          u[6] || (u[6] = Te(Y((N) => !e.open && v("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        p("span", Ba, [
          e.open ? (a(), i("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: u[0] || (u[0] = Y((N) => v("toggle"), ["stop"]))
          }, [
            b(d(Me), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : f("", !0),
          p("span", {
            class: "agent-dot",
            "data-state": _.value,
            "data-agent-motion": ""
          }, null, 8, Oa),
          p("span", Ia, g($.value), 1),
          p("span", Ea, g(((B = e.facts) == null ? void 0 : B.given_name) || e.row.id), 1),
          e.open ? f("", !0) : (a(), q(d(Me), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          p("span", Na, [
            t.value ? (a(), i("span", Wa, [
              u[7] || (u[7] = m("Retired, ", -1)),
              b(d($e), {
                at: e.row.retired_at
              }, null, 8, ["at"])
            ])) : e.row.ended_at ? (a(), i("span", qa, [
              u[8] || (u[8] = m("Idle, ", -1)),
              b(d($e), {
                at: e.row.ended_at
              }, null, 8, ["at"])
            ])) : (a(), i("span", Fa, g(j.value), 1))
          ])
        ]),
        p("span", Da, [
          p("span", _a, g(e.open ? R.value : D.value), 1),
          e.open && ((c = e.facts) != null && c.last_activity) ? (a(), i("span", Pa, [
            u[9] || (u[9] = m("Last heard: ", -1)),
            b(d($e), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : f("", !0)
        ]),
        e.open ? (a(), q(La, {
          key: 0,
          agent: e.row,
          branch: (x = e.progress) == null ? void 0 : x.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: [] },
          card: ""
        }, {
          default: S(() => [
            e.row.role === "helper" && !e.row.ended_at ? (a(), q(d(ae), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: u[1] || (u[1] = Y((N) => d(z).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: S(() => [...u[10] || (u[10] = [
                m("Stop", -1)
              ])]),
              _: 1
            })) : f("", !0)
          ]),
          _: 1
        }, 8, ["agent", "branch", "usage"])) : f("", !0),
        e.open && h.value && !I.value ? (a(), i("span", Ua, [
          p("span", Ka, g(y.value), 1)
        ])) : f("", !0),
        e.open && T.value ? (a(), i("span", Ja, [
          p("button", {
            type: "button",
            class: "agent-plan",
            "data-agent-plan": "",
            "data-peek": `plans:${T.value.plan_id}`,
            onClick: u[2] || (u[2] = Y((N) => d(ve)(`plans:${T.value.plan_id}`), ["stop"]))
          }, "Plan " + g(T.value.plan_id) + ": " + g(T.value.plan_title), 9, Za)
        ])) : f("", !0),
        I.value || !e.open && U.value ? (a(), i("span", {
          key: 3,
          class: X(["agent-line", { "agent-work-start": !T.value }])
        }, [
          p("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: I.value
          }, [
            e.open && H.value ? (a(), i("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": H.value,
              onClick: u[3] || (u[3] = Y((N) => d(ve)(H.value), ["stop"]))
            }, g(I.value), 9, Ya)) : (a(), i(O, { key: 1 }, [
              m(g(I.value), 1)
            ], 64))
          ], 8, Ga),
          !e.open && U.value ? (a(), i("span", {
            key: 0,
            class: "agent-work-status",
            "data-agent-waiting": e.waitReason ? "" : null,
            "data-agent-stopped": L.value && !e.waitReason ? "" : null
          }, g(U.value), 9, Qa)) : f("", !0),
          e.open && h.value ? (a(), i("span", Xa, g(y.value), 1)) : f("", !0)
        ], 2)) : f("", !0),
        e.open ? (a(), q(Jt, {
          key: 4,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: M.value,
          "stopped-with-work": L.value,
          open: e.open,
          "total-count": h.value,
          "tasks-per-hour": s.value
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open", "total-count", "tasks-per-hour"])) : f("", !0)
      ], 42, Ha);
    };
  }
}, tn = /* @__PURE__ */ G(en, [["__scopeId", "data-v-c80e613f"]]), an = {
  class: "agent-limits",
  "data-agent-limits": ""
}, nn = ["aria-expanded"], ln = { key: 0 }, sn = { key: 1 }, on = { class: "limits-panel" }, rn = { class: "limits-head" }, dn = ["data-agent-limit-type", "data-agent-limit-profile"], un = { class: "count" }, cn = { class: "bar" }, gn = { class: "count" }, pn = { class: "bar" }, vn = ["data-agent-limit-type"], hn = { class: "limit-field" }, mn = { class: "limit-field" }, fn = {
  key: 1,
  role: "alert"
}, kn = {
  key: 2,
  role: "status"
}, yn = {
  __name: "AgentLimits",
  setup(e) {
    const r = he(), { rows: o, failure: l } = r.props.limits, v = V(!1), w = V(!1), $ = V(!1), M = V(""), C = V(""), T = (h) => h === 0 ? "no limit" : String(h), I = (h, y) => y === 0 ? 0 : h > y ? 2 : h === y ? 1 : 0, H = k(() => o.value.flatMap((h) => h.per_profile && h.profiles.length ? h.profiles.map((y) => ({ ...y, label: y.title, type: h.key, key: `${h.key}:${y.profile}` })) : [h])), R = (h) => Math.max(I(h.running, h.run_limit), I(h.kept, h.kept_limit)), D = k(() => H.value.filter((h) => R(h)).sort((h, y) => R(y) - R(h))), z = k(() => o.value.reduce((h, y) => h + y.running, 0)), j = k(() => o.value.reduce((h, y) => h + y.kept, 0)), F = (h) => {
      const y = [h.run_limit ? h.running - h.run_limit : -1, h.kept_limit ? h.kept - h.kept_limit : -1], s = Math.max(...y);
      return s > 0 ? `Over by ${s}` : s === 0 ? "At limit" : "Within limits";
    }, L = (h, y) => y ? `${Math.min(h / Math.max(h, y) * 100, 100)}%` : "0%", _ = (h, y) => y && h > y ? `${(h - y) / h * 100}%` : "0%";
    function U() {
      w.value = !w.value;
    }
    async function P(h, y, s, t) {
      if ($.value || r.readOnly) return;
      const n = Number(t.target.value);
      if (!Number.isInteger(n) || n < 0 || !t.target.value.trim()) {
        M.value = "Use a whole number of 0 or more.", t.target.value = String(s);
        return;
      }
      $.value = !0, C.value = "";
      try {
        const u = await r.run(["setting", "set", y, String(n), "--environment", r.environment]);
        if (M.value = u.ok ? "" : u.error, !u.ok) {
          t.target.value = String(s);
          return;
        }
        await r.reload("limits"), C.value = `${h.label} limits saved.`;
      } finally {
        $.value = !1;
      }
    }
    return (h, y) => (a(), i("section", an, [
      d(o).length ? (a(), i(O, { key: 0 }, [
        p("button", {
          class: "summary",
          type: "button",
          "aria-expanded": v.value,
          onClick: y[0] || (y[0] = (s) => v.value = !v.value)
        }, [
          D.value.length ? (a(), i(O, { key: 0 }, [
            (a(!0), i(O, null, J(D.value.slice(0, 2), (s) => (a(), i("span", {
              key: s.key,
              class: "summary-item"
            }, [
              p("span", {
                class: X(["mark", { over: R(s) === 2 }])
              }, null, 2),
              m(g(s.label) + ": " + g(F(s)), 1)
            ]))), 128)),
            D.value.length > 2 ? (a(), i("span", ln, g(D.value.length - 2) + " more", 1)) : f("", !0)
          ], 64)) : (a(), i("span", sn, "All within limits, " + g(z.value) + " running, " + g(j.value) + " kept", 1)),
          b(d(Me), {
            name: "caret",
            size: 12
          })
        ], 8, nn),
        Ke(p("div", on, [
          p("div", rn, [
            y[1] || (y[1] = p("strong", null, "Agent limits", -1)),
            b(d(ae), {
              small: "",
              disabled: $.value || d(r).readOnly,
              "data-agent-limits-edit": "",
              onClick: U
            }, {
              default: S(() => [
                m(g(w.value ? "Done" : "Edit limits"), 1)
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          w.value ? (a(), i(O, { key: 1 }, [
            (a(!0), i(O, null, J(d(o), (s) => (a(), i("div", {
              key: s.key,
              class: "edit-row",
              "data-agent-limit-type": s.key
            }, [
              p("strong", null, g(s.label), 1),
              p("label", hn, [
                p("span", null, [
                  y[3] || (y[3] = m("Running", -1)),
                  s.per_profile ? (a(), i(O, { key: 0 }, [
                    m(" per profile")
                  ], 64)) : f("", !0)
                ]),
                b(d(Se), {
                  type: "number",
                  min: "0",
                  value: String(s.run_limit),
                  disabled: $.value || d(r).readOnly,
                  "data-agent-run-limit": s.key,
                  onChange: (t) => P(s, s.run_setting, s.run_limit, t)
                }, null, 8, ["value", "disabled", "data-agent-run-limit", "onChange"]),
                p("small", null, g(s.run_source), 1)
              ]),
              p("label", mn, [
                p("span", null, [
                  y[4] || (y[4] = m("Kept", -1)),
                  s.per_profile ? (a(), i(O, { key: 0 }, [
                    m(" per profile")
                  ], 64)) : f("", !0)
                ]),
                b(d(Se), {
                  type: "number",
                  min: "0",
                  value: String(s.kept_limit),
                  disabled: $.value || d(r).readOnly,
                  "data-agent-kept-limit": s.key,
                  onChange: (t) => P(s, s.kept_setting, s.kept_limit, t)
                }, null, 8, ["value", "disabled", "data-agent-kept-limit", "onChange"]),
                p("small", null, g(s.kept_source), 1)
              ])
            ], 8, vn))), 128)),
            p("p", null, "Running 0 starts no agents. Kept 0 means no limit. Changes apply to " + g(d(r).environment) + ".", 1)
          ], 64)) : (a(), i(O, { key: 0 }, [
            y[2] || (y[2] = p("div", { class: "table-head" }, [
              p("span", null, "Agent"),
              p("span", null, "Running"),
              p("span", null, "Kept"),
              p("span", null, "Status")
            ], -1)),
            (a(!0), i(O, null, J(H.value, (s) => (a(), i("div", {
              key: s.key,
              class: "limit-row",
              "data-agent-limit-type": s.type || s.key,
              "data-agent-limit-profile": s.profile
            }, [
              p("strong", null, g(s.label), 1),
              p("div", un, [
                p("span", null, g(s.run_limit ? `${s.running} of ${s.run_limit}` : `${s.running} · none may start`), 1),
                p("div", cn, [
                  p("span", {
                    style: le({ width: L(s.running, s.run_limit) })
                  }, null, 4),
                  p("i", {
                    style: le({ width: _(s.running, s.run_limit) })
                  }, null, 4)
                ])
              ]),
              p("div", gn, [
                p("span", null, g(s.kept) + " of " + g(T(s.kept_limit)), 1),
                p("div", pn, [
                  p("span", {
                    style: le({ width: L(s.kept, s.kept_limit) })
                  }, null, 4),
                  p("i", {
                    style: le({ width: _(s.kept, s.kept_limit) })
                  }, null, 4)
                ])
              ]),
              p("span", {
                class: X(["status", { warning: R(s) === 1, danger: R(s) === 2 }])
              }, g(F(s)), 3)
            ], 8, dn))), 128))
          ], 64))
        ], 512), [
          [Je, v.value]
        ])
      ], 64)) : f("", !0),
      M.value || d(l) ? (a(), i("p", fn, g(M.value || d(l)), 1)) : f("", !0),
      C.value ? (a(), i("p", kn, g(C.value), 1)) : f("", !0)
    ]));
  }
}, bn = /* @__PURE__ */ G(yn, [["__scopeId", "data-v-7ce06af0"]]), wn = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Mn = ["data-agent-row"], Ve = "journal.agents.filters", we = "cubic-bezier(0.2, 0.9, 0.25, 1)", xn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const r = e, o = he(), { rows: l } = o.props.waits, { rows: v } = o.props.progress, { rows: w, failure: $, loaded: M, more: C } = o.props.agents, T = (E) => v.value.find((W) => W.agent_id === E.id) ?? null, I = (E) => {
      var W;
      return ((W = l.value.find((A) => A.agent_id === E.id)) == null ? void 0 : W.reason) ?? "";
    }, H = V("running"), R = V(""), D = JSON.parse(localStorage.getItem(Ve) || '{"roles":[],"profiles":[],"programs":[]}'), z = V(D), j = k(() => o.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: F } = o.props.programs, L = k(() => z.value.roles.length + z.value.profiles.length + z.value.programs.length), _ = (E, W) => {
      z.value = dt(z.value, E, W);
    }, U = () => {
      z.value = { roles: [], profiles: [], programs: [] };
    }, P = (E) => E.slice(0, 1).toUpperCase() + E.slice(1);
    te(z, (E) => localStorage.setItem(Ve, JSON.stringify(E)));
    const h = V(25);
    function y() {
      Object.assign(o.state, {
        "agents.show": H.value,
        "agents.search": R.value,
        "agents.limit": String(h.value),
        "agents.roles": z.value.roles.join(","),
        "agents.profiles": z.value.profiles.join(","),
        "agents.programs": z.value.programs.join(",")
      });
    }
    async function s() {
      return h.value += 25, y(), await o.reload("agents"), !0;
    }
    te([H, R, z], () => {
      h.value = 25, y(), o.reload("agents");
    }), y();
    const t = (E) => E.facts ?? null, n = w, u = k(() => !!R.value.trim() || L.value > 0), B = k(() => r.texts[H.value] ?? { title: r.empty, hint: "" }), c = V(null), x = V(null), N = V(null), Q = k(() => n.value.find((E) => E.id === c.value) ?? null), ue = k(() => Q.value ? [Q.value] : n.value), me = k(() => n.value.length - ue.value.length), oe = () => globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let se = !1, fe = 0;
    async function Ie(E) {
      if (se) return;
      se = !0, fe = N.value.scrollTop;
      const W = x.value.querySelector(`[data-agent-open="${E.id}"]`);
      if (!oe()) {
        const ne = [...x.value.querySelectorAll(".agent-row")].filter((ee) => !ee.contains(W));
        await Promise.all(ne.map((ee) => ee.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const A = [...W.querySelectorAll(".agent-head, .agent-line")], K = [...A, ...W.querySelectorAll("[data-agent-motion]")], ke = K.map((ne) => ne.getBoundingClientRect());
      if (c.value = E.id, await Re(), !oe()) {
        const ne = K.map((ee) => ee.getBoundingClientRect());
        K.forEach((ee, ye) => {
          const ie = A.indexOf(ee.parentElement), Ne = ke[ye].left - ne[ye].left - (ie < 0 ? 0 : ke[ie].left - ne[ie].left), We = ke[ye].top - ne[ye].top - (ie < 0 ? 0 : ke[ie].top - ne[ie].top);
          ee.animate([{ transform: `translate(${Ne}px, ${We}px)` }, { transform: "none" }], { duration: 280, easing: we });
        }), x.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((ee) => {
          ee.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: we, fill: "backwards" });
        });
      }
      se = !1;
    }
    async function xe() {
      if (se || !Q.value) return;
      se = !0;
      const E = x.value.querySelector(`[data-agent-open="${c.value}"]`), W = [...E.children, ...x.value.querySelectorAll(".agents-held")], A = oe() ? [] : W.map((K) => K.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(A.map((K) => K.finished)), c.value = null, await Re(), N.value.scrollTop = fe, A.forEach((K) => K.cancel()), oe() || (E.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: we }), x.value.querySelectorAll(".agent-row").forEach((K) => {
        K.contains(E) || K.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: we });
      })), se = !1;
    }
    const Ee = (E) => c.value === E.id ? xe() : Ie(E);
    te(R, (E) => E.trim() && (c.value = null)), te(H, () => {
      c.value = null;
    });
    const Ae = (E) => {
      E.key === "Escape" && xe();
    };
    return globalThis.addEventListener("keydown", Ae), ge(() => globalThis.removeEventListener("keydown", Ae)), (E, W) => (a(), i("div", {
      ref_key: "agents",
      ref: x,
      class: X(["agents", { focused: Q.value }])
    }, [
      b(bn),
      b(d(ot), {
        modelValue: R.value,
        "onUpdate:modelValue": W[1] || (W[1] = (A) => R.value = A),
        placeholder: "Search agents",
        "menu-count": L.value,
        "data-agents-search": ""
      }, {
        menu: S(() => [
          b(d(Ce), null, {
            default: S(() => [...W[2] || (W[2] = [
              m("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), i(O, null, J(j.value.roles, (A) => (a(), q(d(be), {
            key: A,
            role: "menuitemcheckbox",
            "aria-checked": z.value.roles.includes(A),
            checked: z.value.roles.includes(A),
            "data-filter-role": A,
            onClick: (K) => _("roles", A)
          }, {
            default: S(() => [
              m(g(P(A)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          j.value.profiles.length ? (a(), q(d(Ce), { key: 0 }, {
            default: S(() => [...W[3] || (W[3] = [
              m("Profile", -1)
            ])]),
            _: 1
          })) : f("", !0),
          (a(!0), i(O, null, J(j.value.profiles, (A) => (a(), q(d(be), {
            key: A.name,
            role: "menuitemcheckbox",
            "aria-checked": z.value.profiles.includes(A.name),
            checked: z.value.profiles.includes(A.name),
            "data-filter-profile": A.name,
            onClick: (K) => _("profiles", A.name)
          }, {
            default: S(() => [
              m(g(A.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          b(d(Ce), null, {
            default: S(() => [...W[4] || (W[4] = [
              m("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), i(O, null, J(d(F), (A) => (a(), q(d(be), {
            key: A.name,
            role: "menuitemcheckbox",
            "aria-checked": z.value.programs.includes(A.name),
            checked: z.value.programs.includes(A.name),
            "data-filter-program": A.name,
            onClick: (K) => _("programs", A.name)
          }, {
            default: S(() => [
              m(g(A.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          L.value ? (a(), q(d(be), {
            key: 1,
            "data-filter-clear": "",
            onClick: U
          }, {
            default: S(() => [...W[5] || (W[5] = [
              m("Clear filters", -1)
            ])]),
            _: 1
          })) : f("", !0)
        ]),
        default: S(() => [
          b(d(it), {
            options: j.value.states,
            value: H.value,
            onPick: W[0] || (W[0] = (A) => H.value = A)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      H.value === "retired" && j.value.upgrade_retired ? (a(), i("p", wn, "Retired during the upgrade: " + g(j.value.upgrade_retired), 1)) : f("", !0),
      p("div", {
        ref_key: "list",
        ref: N,
        class: X(["agents-view", { "agents-view-open": Q.value }])
      }, [
        d(M) && !d($) && !ue.value.length && L.value ? (a(), q(d(je), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: S(() => [
            b(d(ae), {
              small: "",
              "data-empty-clear": "",
              onClick: U
            }, {
              default: S(() => [...W[6] || (W[6] = [
                m("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), q(d(rt), {
          key: 1,
          rows: ue.value,
          failure: d($),
          loaded: d(M),
          more: !Q.value && d(C),
          older: s,
          empty: B.value.title,
          hint: B.value.hint,
          searching: u.value
        }, {
          default: S(({ row: A }) => [
            p("div", {
              class: "agent-row",
              "data-agent-row": A.id
            }, [
              b(tn, {
                row: A,
                facts: t(A),
                progress: T(A),
                "wait-reason": I(A),
                open: A.id === c.value,
                onToggle: (K) => Ee(A)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, Mn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2),
      Q.value && me.value ? (a(), i("button", {
        key: 1,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: xe
      }, g(me.value) + " more", 1)) : f("", !0)
    ], 2));
  }
}, jn = /* @__PURE__ */ G(xn, [["__scopeId", "data-v-b9a3d204"]]);
export {
  jn as A
};
