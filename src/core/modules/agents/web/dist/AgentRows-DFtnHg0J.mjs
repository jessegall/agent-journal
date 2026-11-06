/* @code-commandments-generated */
import { openBlock as n, createElementBlock as i, withModifiers as Y, unref as d, createTextVNode as h, toDisplayString as c, createVNode as k, createBlock as q, withCtx as S, Fragment as B, renderList as J, createElementVNode as g, createCommentVNode as m, ref as R, computed as f, watch as te, onUnmounted as ge, defineAsyncComponent as qe, createSlots as Fe, resolveDynamicComponent as De, normalizeStyle as le, normalizeClass as X, renderSlot as pe, onMounted as ze, Teleport as Pe, mergeProps as Ue, toRef as _e, withKeys as Te, withDirectives as Ke, vShow as Je, nextTick as Re } from "vue";
import { peekRef as ve, Icon as Me, RunningCommand as Ze, FoldGroup as He, TaskStatusIcon as Ge, Btn as ae, TextArea as Ye, TextInput as Se, useWindow as he, SwitchCase as Le, loadWindowComponent as Qe, coalesced as Xe, READ_RATES as et, InnerTabs as tt, TabBody as at, EmptyState as je, useNow as nt, age as lt, perHour as st, TimeAgo as $e, SearchBar as ot, Segmented as it, MenuLabel as Ce, MenuItem as be, RowList as rt, toggleFilter as dt } from "@journal/window-kit";
import { _ as G, T as ut } from "./TranscriptRows-_2Ms3bB-.mjs";
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
    return (r, o) => (n(), i("span", ct, [
      e.waitReason ? (n(), i("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: o[0] || (o[0] = Y((l) => d(ve)("test_queue:0"), ["stop"]))
      }, [
        h("Waiting: " + c(e.waitReason) + " ", 1),
        k(d(Me), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (n(), i("span", gt, "Waiting")) : (n(), q(d(Ze), {
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
    return (l, p) => (n(), q(d(He), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: p[0] || (p[0] = (y) => o("toggle"))
    }, {
      default: S(() => [
        (n(!0), i(B, null, J(e.section.tasks, (y) => (n(), i("button", {
          key: y.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": y.id,
          onClick: (x) => d(ve)(`tasks:${y.id}`)
        }, [
          k(d(Ge), {
            status: y.state
          }, null, 8, ["status"]),
          g("span", mt, c(y.id), 1),
          g("span", ft, c(y.title), 1),
          y.plan_id ? (n(), i("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${y.plan_id}: ${y.plan_title}`
          }, "Plan " + c(y.plan_id) + ": " + c(y.plan_title), 9, kt)) : m("", !0)
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
    return (r, o) => (n(), i("form", {
      onSubmit: o[4] || (o[4] = Y((l) => r.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (n(), i(B, { key: 0 }, [
        g("label", wt, [
          o[6] || (o[6] = h("Task ", -1)),
          g("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: o[0] || (o[0] = (l) => r.$emit("update:task", l.target.value))
          }, [
            o[5] || (o[5] = g("option", { value: "" }, "Choose an open task", -1)),
            (n(!0), i(B, null, J(e.tasks, (l) => (n(), i("option", {
              key: l.id,
              value: String(l.id)
            }, c(l.id) + ": " + c(l.title), 9, xt))), 128))
          ], 40, Mt)
        ]),
        e.moreTasks ? (n(), q(d(ae), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: o[1] || (o[1] = (l) => r.$emit("more"))
        }, {
          default: S(() => [...o[7] || (o[7] = [
            h("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : m("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (n(), i("p", $t, "No open tasks.")) : m("", !0)
      ], 64)) : (n(), i("label", Ct, [
        o[8] || (o[8] = h("Job", -1)),
        k(d(Ye), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: o[2] || (o[2] = (l) => r.$emit("update:text", l.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      g("div", St, [
        k(d(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: S(() => [...o[9] || (o[9] = [
            h("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        k(d(ae), {
          small: "",
          disabled: e.pending,
          onClick: o[3] || (o[3] = (l) => r.$emit("cancel"))
        }, {
          default: S(() => [...o[10] || (o[10] = [
            h("Cancel", -1)
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
    return (r, o) => (n(), i("form", {
      "data-agent-retire-confirm": "",
      onSubmit: o[2] || (o[2] = Y((l) => r.$emit("submit"), ["prevent"]))
    }, [
      o[5] || (o[5] = g("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      k(d(Se), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": o[0] || (o[0] = (l) => r.$emit("update:reason", l))
      }, null, 8, ["model-value", "disabled"]),
      g("div", Tt, [
        k(d(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: S(() => [...o[3] || (o[3] = [
            h("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        k(d(ae), {
          small: "",
          disabled: e.pending,
          onClick: o[1] || (o[1] = (l) => r.$emit("cancel"))
        }, {
          default: S(() => [...o[4] || (o[4] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Vt = /* @__PURE__ */ G(Rt, [["__scopeId", "data-v-bbe4e841"]]), zt = { class: "action-buttons" }, Ht = {
  key: 0,
  role: "alert"
}, Lt = {
  key: 1,
  role: "status"
}, Bt = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const r = e, o = he(), l = R(""), p = R(""), y = R(""), x = R(""), M = R([]), C = R(0), T = R(!1), O = R(!1), H = R(!1), V = R(""), D = R(""), z = f(() => !!r.row.retired_at || r.row.state === "retired"), j = f(() => !z.value && !!r.row.ended_at), I = f(() => {
      var t;
      return j.value && ((t = r.row.job_command) == null ? void 0 : t.length) && !r.row.resume_reason;
    }), L = f(() => I.value && !O.value && (r.row.job_task_flag ? M.value.some((t) => String(t.id) === x.value) : !!p.value.trim()));
    function F(t) {
      l.value = t, p.value = "", y.value = "", x.value = "", V.value = "", D.value = "";
    }
    async function _() {
      F("job"), r.row.job_task_flag && (M.value = [], C.value = 0, T.value = !1, await P());
    }
    async function P() {
      if (!O.value) {
        O.value = !0;
        try {
          o.state["jobs.page"] = String(C.value + 1), await o.reload("jobs");
          const t = o.props.jobs;
          V.value = t.failure.value, V.value || (M.value = [...M.value, ...t.rows.value], C.value = t.data.value.page, T.value = t.more.value);
        } finally {
          O.value = !1;
        }
      }
    }
    async function v(t, a) {
      if (!H.value) {
        H.value = !0, V.value = "";
        try {
          const $ = await o.run(t);
          V.value = $.ok ? "" : $.error, $.ok && (F(""), D.value = a);
        } finally {
          H.value = !1;
        }
      }
    }
    async function b() {
      if (!L.value) return;
      const t = r.row.job_task_flag ? [r.row.job_task_flag, x.value] : [p.value.trim()];
      await v([...r.row.job_command, String(r.row.id), ...t], "Job sent.");
    }
    async function s() {
      !j.value || l.value !== "retire" || !y.value.trim() || await v(["agent", "retire", String(r.row.id), "--reason", y.value.trim()], "Agent retired permanently.");
    }
    return (t, a) => {
      var $;
      return z.value ? m("", !0) : (n(), i("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: a[6] || (a[6] = Y(() => {
        }, ["stop"])),
        onKeydown: a[7] || (a[7] = Y(() => {
        }, ["stop"]))
      }, [
        g("div", zt, [
          j.value ? (n(), i(B, { key: 0 }, [
            ($ = e.row.job_command) != null && $.length ? (n(), q(d(ae), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: H.value || O.value || !I.value,
              onClick: _
            }, {
              default: S(() => [...a[8] || (a[8] = [
                h("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0),
            e.row.role !== "main" ? (n(), q(d(ae), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: H.value || O.value,
              onClick: a[0] || (a[0] = (N) => F("retire"))
            }, {
              default: S(() => [...a[9] || (a[9] = [
                h("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0)
          ], 64)) : m("", !0)
        ]),
        k(d(Le), { value: l.value }, {
          job: S(() => [
            k(At, {
              task: x.value,
              "onUpdate:task": a[1] || (a[1] = (N) => x.value = N),
              text: p.value,
              "onUpdate:text": a[2] || (a[2] = (N) => p.value = N),
              row: e.row,
              tasks: M.value,
              pending: H.value,
              loading: O.value,
              "more-tasks": T.value,
              failure: V.value,
              "job-ready": L.value,
              onSubmit: b,
              onMore: P,
              onCancel: a[3] || (a[3] = (N) => F(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: S(() => [
            k(Vt, {
              reason: y.value,
              "onUpdate:reason": a[4] || (a[4] = (N) => y.value = N),
              pending: H.value,
              onSubmit: s,
              onCancel: a[5] || (a[5] = (N) => F(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        V.value ? (n(), i("p", Ht, c(V.value), 1)) : m("", !0),
        D.value ? (n(), i("p", Lt, c(D.value), 1)) : m("", !0)
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
}, Pt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ut = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, _t = "It ended without a report", Kt = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean, totalCount: Number, tasksPerHour: String },
  setup(e) {
    const r = e, o = ["started", "blocked", "open", "completed"], l = f(() => {
      var t, a;
      return r.row.ended_at && ((a = (t = r.facts) == null ? void 0 : t.job_returned) != null && a.startsWith(_t)) ? r.facts.job_returned : "";
    }), p = f(() => r.tasks.length ? o.map((t) => ({ state: t, label: t.slice(0, 1).toUpperCase() + t.slice(1), tasks: r.tasks.filter((a) => a.state === t || t === "started" && a.state === "testing" || t === "completed" && a.state === "cancelled") })) : []), y = /* @__PURE__ */ new Set(["completed"]), x = R({}), M = (t) => !(x.value[t] ?? y.has(t)), C = (t) => x.value = { ...x.value, [t]: M(t) }, T = he(), { rows: O } = T.props.reports;
    T.state["reports.agent"] = String(r.row.id);
    const H = f(() => r.row.access === "read-only"), V = f(() => !!r.row.retired_at || r.row.state === "retired"), D = f(() => V.value ? T.tabs.filter((t) => ["reports", "transcript"].includes(t.key)) : H.value ? T.tabs.filter((t) => ["reports", "transcript", "terminal"].includes(t.key)) : T.tabs), z = () => H.value || V.value ? D.value.find((t) => t.key === "transcript") : D.value[0], j = R(z());
    te(j, (t) => {
      T.state.tab = (t == null ? void 0 : t.key) ?? "";
    }, { immediate: !0 }), ge(() => {
      T.state.tab = "";
    }), te(D, (t) => {
      t.some((a) => {
        var $;
        return a.key === (($ = j.value) == null ? void 0 : $.key);
      }) || (j.value = t[0]);
    }), te(() => r.open, (t) => {
      t && (j.value = z());
    });
    const I = Object.fromEntries(T.tabs.filter((t) => t.component).map((t) => [t.key, qe(() => Qe(t.component))])), L = R(!1), { data: F } = T.props.tool, _ = f(() => {
      var t;
      return ((t = F.value) == null ? void 0 : t.tool) ?? "";
    }), P = f(() => {
      var t;
      return ((t = F.value) == null ? void 0 : t.note) ?? "";
    }), v = f(() => r.row.role !== "main" && (!r.row.ended_at || r.stoppedWithWork || r.waitReason));
    async function b() {
      !r.open || !v.value || (T.state["tool.agent"] = String(r.row.id), await T.reload("tool"));
    }
    const s = T.follow(["hook_call.*", "process_part.*"], Xe(b, et.agentCommand));
    return ge(() => s == null ? void 0 : s()), te(() => r.open, (t) => {
      t && b();
    }, { immediate: !0 }), (t, a) => {
      var $;
      return n(), i("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: a[2] || (a[2] = Y(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (n(), i("p", It, "Retirement reason: " + c(e.row.retirement_reason), 1)) : m("", !0),
        e.row.resume_reason ? (n(), i("p", Et, c(e.row.resume_reason), 1)) : m("", !0),
        k(Ot, { row: e.row }, null, 8, ["row"]),
        e.totalCount && e.tasksPerHour ? (n(), i("span", Nt, c(e.tasksPerHour), 1)) : m("", !0),
        v.value ? (n(), q(vt, {
          key: 3,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: _.value,
          note: P.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0),
        l.value ? (n(), i("p", Wt, c(l.value), 1)) : m("", !0),
        k(d(tt), {
          class: "agent-tabs",
          tabs: D.value,
          active: j.value,
          answer: { tasks: e.tasks.length, reports: d(O).length },
          onChoose: a[0] || (a[0] = (N) => j.value = N)
        }, null, 8, ["tabs", "active", "answer"]),
        k(d(at), {
          class: "agent-tab-body",
          tab: j.value,
          "data-agent-tab-body": ($ = j.value) == null ? void 0 : $.key
        }, {
          default: S(() => {
            var N;
            return [
              k(d(Le), {
                value: (N = j.value) == null ? void 0 : N.key
              }, Fe({
                reports: S(() => [
                  d(O).length ? m("", !0) : (n(), q(d(je), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: S(() => [...a[3] || (a[3] = [
                      h("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (n(!0), i(B, null, J(d(O), (u) => (n(), i("button", {
                    key: u.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${u.id}`,
                    onClick: (w) => d(ve)(`messages:${u.id}`)
                  }, c(u.text), 9, qt))), 128))
                ]),
                tasks: S(() => {
                  var u;
                  return [
                    e.tasks.length ? m("", !0) : (n(), q(d(je), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: S(() => [...a[4] || (a[4] = [
                        h("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (n(!0), i(B, null, J(p.value, (w) => (n(), q(bt, {
                      key: w.state,
                      section: w,
                      open: M(w.state),
                      onToggle: (U) => C(w.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (u = e.facts) != null && u.instruction ? (n(), i(B, { key: 1 }, [
                      a[5] || (a[5] = g("p", { class: "agent-label" }, "Instruction", -1)),
                      g("div", Ft, c(e.facts.instruction), 1)
                    ], 64)) : m("", !0)
                  ];
                }),
                transcript: S(() => {
                  var u;
                  return [
                    H.value ? (n(), i(B, { key: 0 }, [
                      (u = e.facts) != null && u.instruction ? (n(), i("div", Dt, [
                        k(d(He), {
                          label: "Instruction",
                          open: L.value,
                          "data-agent-section": "instruction",
                          onToggle: a[1] || (a[1] = (w) => L.value = !L.value)
                        }, {
                          default: S(() => [
                            g("div", Pt, c(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (n(), i("p", Ut, "No job recorded")) : m("", !0)
                    ], 64)) : m("", !0),
                    k(ut, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                J(d(I), (u, w) => ({
                  name: w,
                  fn: S(() => [
                    (n(), q(De(u), {
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
}, Jt = /* @__PURE__ */ G(Kt, [["__scopeId", "data-v-98536eb7"]]), Zt = ["stroke-width", "innerHTML"], Z = {
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
    }, p = {
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
    return (y, x) => (n(), i("svg", {
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
      innerHTML: p[l[e.name] || e.name] || p.dot
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
    return (r, o) => (n(), i("button", {
      type: "button",
      class: X(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (n(), i("span", Gt, c(e.checked ? "✓" : ""), 1)) : m("", !0),
      e.description ? (n(), i("span", Yt, [
        g("span", null, [
          pe(r.$slots, "default", {}, void 0, !0)
        ]),
        g("small", null, c(e.description), 1)
      ])) : pe(r.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, de = /* @__PURE__ */ G(Qt, [["__scopeId", "data-v-9c67fe37"]]), Xt = {}, ea = { class: "menu-label" };
function ta(e, r) {
  return n(), i("span", ea, [
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
    const o = e, l = r, p = f(() => o.skills.filter((x) => x.state === "loaded")), y = f(() => o.skills.filter((x) => x.state !== "loaded"));
    return (x, M) => (n(), i("div", aa, [
      k(ce, null, {
        default: S(() => [...M[1] || (M[1] = [
          h("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      p.value.length ? m("", !0) : (n(), i("p", na, "None yet. Compacting the conversation empties this list.")),
      (n(!0), i(B, null, J(p.value, (C) => (n(), i("p", {
        key: C.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        k(Z, {
          name: "book",
          size: 12
        }),
        h(c(C.skill), 1)
      ]))), 128)),
      y.value.length ? (n(), i(B, { key: 1 }, [
        k(ce, null, {
          default: S(() => [...M[2] || (M[2] = [
            h("Still to read", -1)
          ])]),
          _: 1
        }),
        (n(!0), i(B, null, J(y.value, (C) => (n(), i("p", {
          key: C.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          k(Z, {
            name: "book",
            size: 12
          }),
          h(c(C.skill), 1)
        ]))), 128))
      ], 64)) : m("", !0),
      k(de, {
        "data-agent-skills-browse": "",
        onClick: M[0] || (M[0] = (C) => l("browse"))
      }, {
        default: S(() => [...M[3] || (M[3] = [
          h("Browse every skill", -1)
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
    var y, x;
    const p = ((y = e.value) == null ? void 0 : y.element) || ((x = e.value) == null ? void 0 : x.$el) || e.value;
    p && !ra(p, l.target) && r(l);
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
    const l = e, p = R(null), y = (u) => u ? `${u}px` : void 0, x = f(() => ({
      minWidth: y(l.minWidth),
      maxWidth: y(l.maxWidth),
      maxHeight: y(l.maxHeight),
      height: y(l.height)
    })), M = R({ w: 0, h: 0 }), C = R(l.anchor ? l.anchor.getBoundingClientRect() : null), T = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), O = (u) => ({
      left: Math.max(0, u.left),
      top: Math.max(0, u.top),
      right: Math.min(window.innerWidth, u.right),
      bottom: Math.min(window.innerHeight, u.bottom)
    }), H = (u) => {
      const w = u.closest(".pane, .float-window");
      return w ? O(w.getBoundingClientRect()) : T();
    }, V = (u, w) => `${Math.max(0, u ? Math.min(u, w) : w)}px`;
    function D(u, w) {
      return {
        below: u.bottom - w.bottom - l.gap - re,
        above: w.top - u.top - l.gap - re,
        across: u.right - u.left - 2 * re
      };
    }
    function z(u) {
      const w = H(l.anchor), U = D(w, u);
      return M.value.w <= U.across && M.value.h <= Math.max(U.below, U.above) ? w : T();
    }
    const j = f(() => {
      if (!C.value) return x.value;
      const u = C.value, w = z(u), U = D(w, u), { w: Q, h: ue } = M.value, me = l.align === "auto" ? u.left + u.right > w.left + w.right : l.align === "right", oe = oa(me ? u.right - Q : u.left, w.left + re, Math.max(w.left + re, w.right - Q - re)), fe = ue > U.below && U.above > U.below ? { bottom: `${window.innerHeight - u.top + l.gap}px`, maxHeight: V(l.maxHeight, U.above) } : { top: `${u.bottom + l.gap}px`, maxHeight: V(l.maxHeight, U.below) };
      return { ...x.value, ...fe, left: `${oe}px`, maxWidth: V(l.maxWidth, U.across) };
    }), I = o, L = () => [...p.value.querySelectorAll("button:not(:disabled)")];
    function F(u) {
      const w = L(), U = w.indexOf(document.activeElement);
      w[(U + u + w.length) % w.length].focus();
    }
    const _ = { ArrowDown: () => F(1), ArrowUp: () => F(-1), Escape: () => I("close") }, P = (u) => _[u.key] && (u.preventDefault(), _[u.key]()), v = () => p.value && (M.value = { w: p.value.offsetWidth, h: p.value.scrollHeight });
    let b = 0;
    const s = new ResizeObserver(() => {
      cancelAnimationFrame(b), b = requestAnimationFrame(v);
    });
    da(p, (u) => l.anchor && !l.anchor.contains(u.target) && I("close"));
    const t = (u, w) => ["top", "left", "right", "bottom"].some((U) => Math.abs(u[U] - w[U]) > 1), a = (u) => u.bottom < 0 || u.top > window.innerHeight;
    let $ = 0;
    function N() {
      if (l.anchor) {
        const u = l.anchor.getBoundingClientRect();
        if (!l.anchor.isConnected || a(u)) return I("close");
        t(u, C.value) && (C.value = u);
      }
      $ = requestAnimationFrame(N);
    }
    return ze(() => {
      l.anchor && p.value && ia(p.value, l.anchor), v(), p.value && s.observe(p.value), !l.plain && L()[0] && L()[0].focus(), N();
    }), ge(() => {
      s.disconnect(), cancelAnimationFrame($), cancelAnimationFrame(b);
    }), r({ element: p }), (u, w) => (n(), q(Pe, {
      to: "body",
      disabled: !e.anchor
    }, [
      g("div", Ue({
        ref_key: "panel",
        ref: p
      }, u.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: j.value,
        onKeydown: P
      }), [
        pe(u.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ca = /* @__PURE__ */ G(ua, [["__scopeId", "data-v-7f046e0d"]]);
async function ga(e, r, o) {
  if (!e) return o(r);
  const { target: l, fields: p } = e, y = Object.fromEntries(Object.keys(p).map((C) => [C, l[C]])), x = () => Object.assign(l, y);
  Object.assign(l, p);
  let M = !1;
  try {
    const C = await o(r);
    return M = C.ok, C;
  } finally {
    M || x();
  }
}
function pa(e, r, o) {
  const l = R([]), p = R([]), y = R({}), x = R(""), M = R(!1), C = f(() => !!e.value && !e.value.ended_at), T = f(() => C.value && !!e.value.paused_at);
  async function O() {
    if (C.value) {
      const I = await r(["agent", "controls", String(e.value.id)]);
      l.value = I.ok ? I.value.groups : [];
      return;
    }
    const j = await r(["agent", "programs"]);
    p.value = j.ok ? j.value.rows : [];
  }
  async function H(j, I = null) {
    x.value = "";
    const L = await ga(I, j, r);
    return x.value = L.ok ? "" : L.error, o(), L;
  }
  const V = (j, I) => H(["agent", "control", String(e.value.id), j, I.value], { target: y, fields: { value: { ...y.value, [j]: I.label } } }), D = () => (M.value = !1, H(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), z = (j) => H(["agent", "launch", j.name]);
  return ze(O), te(C, O), { groups: l, programs: p, chosen: y, failure: x, asking: M, running: C, paused: T, choose: V, stop: D, start: z };
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
    const o = e, l = r, p = pa(_e(o, "agent"), o.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => l("changed")), y = R(null), x = R(""), M = f(() => p.groups.value.find((s) => s.key === x.value));
    function C(s, t) {
      y.value = s.currentTarget, x.value = t;
    }
    function T() {
      y.value = null, x.value = "", p.asking.value = !1;
    }
    const O = R([]), H = f(() => O.value.filter((s) => s.state === "loaded"));
    async function V() {
      const s = o.agent && o.run ? await o.run(["agent-skill", "list", "--agent", String(o.agent.id)]) : null;
      O.value = s != null && s.ok ? s.value.rows ?? [] : [];
    }
    function D(s) {
      C(s, "skills"), V();
    }
    te(() => {
      var s;
      return (s = o.agent) == null ? void 0 : s.id;
    }, V, { immediate: !0 });
    const z = (s) => p.groups.value.some((t) => t.key === s), j = f(() => {
      var s;
      return p.chosen.value.model ?? ((s = L.value) == null ? void 0 : s.model) ?? "";
    }), I = f(() => {
      var s;
      return p.chosen.value.effort ?? ((s = L.value) == null ? void 0 : s.effort) ?? "";
    });
    f(() => !!o.agent && !o.agent.ended_at);
    const L = f(() => {
      var s;
      return ((s = o.usage.agents) == null ? void 0 : s.find((t) => {
        var a;
        return t.id === ((a = o.agent) == null ? void 0 : a.id);
      })) ?? null;
    }), F = f(() => {
      var s;
      return ((s = o.usage.windows) == null ? void 0 : s[0]) ?? null;
    }), _ = f(() => F.value ? Math.max(0, Math.min(100, Math.round(F.value.used_percent))) : null), P = f(() => {
      var s;
      return ((s = L.value) == null ? void 0 : s.context_percent) == null ? null : Math.round(L.value.context_percent);
    }), v = f(() => {
      var s;
      return (s = L.value) != null && s.cost_dollars ? `$${L.value.cost_dollars.toFixed(2)}` : "";
    }), b = f(() => {
      var a;
      const s = (a = o.agent) != null && a.process_started_at ? new Date(o.agent.process_started_at).getTime() : 0;
      if (!s) return "";
      const t = Math.max(0, Math.floor((o.now - s) / 6e4));
      return t >= 60 ? `${Math.floor(t / 60)}h ${t % 60}m` : `${t}m`;
    });
    return (s, t) => (n(), i("div", {
      class: X(["information", { card: e.card }]),
      "data-information-bar": ""
    }, [
      e.agent ? (n(), i(B, { key: 0 }, [
        g("button", {
          type: "button",
          class: "fact lead",
          disabled: e.card,
          "data-fact": "agent",
          title: `Session ${e.agent.session}: stop it`,
          onClick: t[0] || (t[0] = (a) => C(a, "agent"))
        }, [
          k(Z, {
            name: "agents",
            size: 12
          }),
          h(" " + c(d(va)(e.agent.program)), 1)
        ], 8, ma),
        _.value !== null ? (n(), i("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${_.value}% of the plan's ${F.value.title} allowance used`,
          onClick: t[1] || (t[1] = (a) => l("open", "usage", a.currentTarget))
        }, [
          k(Z, {
            name: "clock",
            size: 12
          }),
          t[14] || (t[14] = h()),
          g("span", ka, [
            g("span", {
              style: le({ width: `${_.value}%` })
            }, null, 4)
          ]),
          h(" " + c(_.value) + "% ", 1)
        ], 8, fa)) : m("", !0),
        P.value !== null ? (n(), i("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "context",
          title: `Context ${P.value}% full: clear or compact it`,
          onClick: t[2] || (t[2] = (a) => z("context") ? C(a, "context") : l("open", "context", a.currentTarget))
        }, [
          k(Z, {
            name: "gauge",
            size: 12
          }),
          t[15] || (t[15] = h()),
          g("span", ba, [
            g("span", {
              style: le({ width: `${P.value}%` })
            }, null, 4)
          ]),
          h(" " + c(P.value) + "% ", 1)
        ], 8, ya)) : m("", !0),
        j.value ? (n(), i("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "model",
          title: `${j.value}: change the model`,
          onClick: t[3] || (t[3] = (a) => z("model") ? C(a, "model") : null)
        }, [
          k(Z, {
            name: "model",
            size: 12
          }),
          h(" " + c(j.value), 1)
        ], 8, wa)) : m("", !0),
        z("effort") || e.card && I.value ? (n(), i("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: t[4] || (t[4] = (a) => C(a, "effort"))
        }, [
          k(Z, {
            name: "bolt",
            size: 12
          }),
          h(" " + c(I.value), 1)
        ], 8, Ma)) : m("", !0),
        v.value ? (n(), i("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: t[5] || (t[5] = (a) => l("open", "cost", a.currentTarget))
        }, c(v.value), 9, xa)) : m("", !0),
        b.value ? (n(), i("span", $a, [
          k(Z, {
            name: "reminders",
            size: 12
          }),
          h(" " + c(b.value), 1)
        ])) : m("", !0),
        e.branch ? (n(), i("span", Ca, [
          k(Z, {
            name: "branch",
            size: 12
          }),
          h(" " + c(e.branch), 1)
        ])) : m("", !0),
        e.card ? m("", !0) : (n(), i("button", {
          key: 7,
          type: "button",
          class: X(["fact", { none: !e.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: t[6] || (t[6] = (a) => l("open", "jobs", a.currentTarget))
        }, [
          k(Z, {
            name: "clock",
            size: 12
          }),
          h(" " + c(e.jobs), 1)
        ], 2)),
        e.run ? (n(), i("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: D
        }, [
          k(Z, {
            name: "book",
            size: 12
          }),
          h(" " + c(H.value.length), 1)
        ])) : m("", !0),
        e.fitness ? (n(), i(B, { key: 9 }, [
          g("button", {
            type: "button",
            class: X(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Va }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: t[7] || (t[7] = (a) => l("open", "fitness", a.currentTarget))
          }, [
            k(Z, {
              name: "heart",
              size: 12
            }),
            h(" " + c(e.fitness.is_measured ? e.fitness.score : "–"), 1)
          ], 2),
          g("button", {
            type: "button",
            class: X(["fact", "load-fact", e.fitness.workload_level]),
            "data-fact": "load",
            title: "Compare incoming messages with agent replies",
            onClick: t[8] || (t[8] = (a) => l("open", "load", a.currentTarget))
          }, [
            k(Z, {
              name: "weight",
              size: 12
            }),
            h(" " + c(e.fitness.workload), 1)
          ], 2)
        ], 64)) : m("", !0)
      ], 64)) : e.run && !e.loading ? (n(), i("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: t[9] || (t[9] = (a) => C(a, "start"))
      }, [
        k(Z, {
          name: "agents",
          size: 12
        }),
        t[16] || (t[16] = h(" Start an agent", -1))
      ])) : m("", !0),
      t[22] || (t[22] = g("span", { class: "space" }, null, -1)),
      d(p).failure.value ? (n(), i("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: d(p).failure.value
      }, c(d(p).failure.value), 9, Sa)) : m("", !0),
      pe(s.$slots, "default", {}, void 0, !0),
      y.value ? (n(), q(ca, {
        key: 3,
        anchor: y.value,
        "min-width": 190,
        onClose: T
      }, {
        default: S(() => {
          var a;
          return [
            x.value === "agent" ? (n(), i(B, { key: 0 }, [
              d(p).asking.value ? (n(), i(B, { key: 0 }, [
                k(ce, { "data-agent-stop-ask": "" }, {
                  default: S(() => [...t[17] || (t[17] = [
                    h("Stop the agent? It stops what it is doing.", -1)
                  ])]),
                  _: 1
                }),
                k(de, {
                  "data-agent-stop-confirm": "",
                  onClick: t[10] || (t[10] = ($) => (T(), d(p).stop()))
                }, {
                  default: S(() => [...t[18] || (t[18] = [
                    h("Stop it", -1)
                  ])]),
                  _: 1
                }),
                k(de, {
                  onClick: t[11] || (t[11] = ($) => d(p).asking.value = !1)
                }, {
                  default: S(() => [...t[19] || (t[19] = [
                    h("Keep it running", -1)
                  ])]),
                  _: 1
                })
              ], 64)) : (n(), q(de, {
                key: 1,
                "data-agent-stop": "",
                onClick: t[12] || (t[12] = ($) => d(p).asking.value = !0)
              }, {
                default: S(() => [...t[20] || (t[20] = [
                  h("Stop", -1)
                ])]),
                _: 1
              }))
            ], 64)) : x.value === "start" ? (n(), i(B, { key: 1 }, [
              k(ce, null, {
                default: S(() => [...t[21] || (t[21] = [
                  h("Start an agent", -1)
                ])]),
                _: 1
              }),
              (n(!0), i(B, null, J(d(p).programs.value, ($) => (n(), q(de, {
                key: $.name,
                "data-agent-program": $.name,
                onClick: (N) => (T(), d(p).start($))
              }, {
                default: S(() => [
                  h(c($.title), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-program", "onClick"]))), 128))
            ], 64)) : x.value === "skills" ? (n(), q(sa, {
              key: 2,
              skills: O.value,
              onBrowse: t[13] || (t[13] = ($) => (T(), l("open", "skills", null)))
            }, null, 8, ["skills"])) : M.value ? (n(), i(B, { key: 3 }, [
              k(ce, null, {
                default: S(() => [
                  h(c(M.value.label), 1)
                ]),
                _: 1
              }),
              x.value === "context" ? (n(), i(B, { key: 0 }, [
                g("div", ja, [
                  g("span", Aa, [
                    g("span", {
                      style: le({ width: `${P.value}%` })
                    }, null, 4)
                  ]),
                  g("span", Ta, c(P.value) + "%", 1)
                ]),
                g("p", Ra, c(d(ha)(((a = L.value) == null ? void 0 : a.last_compaction) ?? null)), 1)
              ], 64)) : m("", !0),
              (n(!0), i(B, null, J(M.value.choices, ($) => (n(), q(de, {
                key: $.value,
                "data-agent-choice": $.value,
                onClick: (N) => (d(p).choose(M.value.key, $), T())
              }, {
                default: S(() => [
                  h(c($.label), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-choice", "onClick"]))), 128))
            ], 64)) : m("", !0)
          ];
        }),
        _: 1
      }, 8, ["anchor"])) : m("", !0)
    ], 2));
  }
}, Ha = /* @__PURE__ */ G(za, [["__scopeId", "data-v-d5933ce4"]]), La = ["data-agent-open", "aria-expanded", "role", "tabindex"], Ba = { class: "agent-head" }, Oa = ["data-state"], Ia = {
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
}, Da = { class: "agent-line" }, Pa = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Ua = {
  key: 0,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, _a = {
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
    const o = { helper: "Helper", reviewer: "Reviewer" }, l = e, p = r, y = nt(), x = f(() => {
      var a, $;
      if ((a = l.facts) != null && a.profile_title) return l.facts.profile_title;
      if (($ = l.facts) != null && $.profile) return l.facts.profile;
      const t = o[l.row.role] || l.row.role;
      return t.slice(0, 1).toUpperCase() + t.slice(1);
    }), M = f(() => {
      var t;
      return ((t = l.facts) == null ? void 0 : t.tasks) ?? [];
    }), C = f(() => M.value.filter((t) => t.state === "open")), T = f(() => {
      const t = M.value.find((a) => {
        var $;
        return a.id === (($ = l.facts) == null ? void 0 : $.task_id);
      });
      return t != null && t.plan_id ? t : C.value.find((a) => a.plan_id);
    }), O = f(() => {
      var t, a, $, N, u;
      return l.row.role === "helper" ? ((t = l.facts) == null ? void 0 : t.helper_job) || "" : (a = l.facts) != null && a.job_enabled && ((($ = l.facts) == null ? void 0 : $.task_title) || ((N = C.value[0]) == null ? void 0 : N.title) || ((u = M.value.at(-1)) == null ? void 0 : u.title)) || "";
    }), H = f(() => {
      const t = O.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return t ? `${t[1].toLowerCase() === "plan" ? "plans" : "docs"}:${t[2]}` : "";
    }), V = f(() => {
      var t, a;
      return [l.row.program, (t = l.facts) == null ? void 0 : t.model, (a = l.facts) == null ? void 0 : a.effort, l.row.role === "worker" ? `worker ${l.row.id}` : ""].filter(Boolean).join(" · ");
    }), D = he(), z = f(() => lt(l.row.process_started_at || l.row.created_at, y.value)), j = /* @__PURE__ */ new Set(["open", "started", "testing"]), I = f(() => !!l.row.ended_at && l.row.role !== "main" && M.value.some((t) => j.has(t.state))), L = f(() => {
      var t;
      return l.row.retired_at || l.row.state === "retired" ? "retired" : l.waitReason || I.value ? "waiting" : l.row.state === "running" && ((t = l.facts) == null ? void 0 : t.state) || l.row.state;
    }), F = f(() => l.waitReason ? `Waiting: ${l.waitReason}` : L.value === "blocked" ? "Blocked" : I.value ? "Stopped with work left" : ""), _ = f(() => {
      var t;
      return ((t = l.progress) == null ? void 0 : t.completed_count) ?? M.value.filter((a) => a.state === "completed").length;
    }), P = f(() => {
      var t;
      return ((t = l.progress) == null ? void 0 : t.task_count) ?? M.value.length;
    }), v = f(() => `${_.value} of ${P.value} ${P.value === 1 ? "task" : "tasks"}`), b = f(() => {
      var a;
      const t = st(_.value, ((a = l.progress) == null ? void 0 : a.started_at) || l.row.created_at, l.progress ? l.progress.finished_at : l.row.ended_at, y.value);
      return l.row.role !== "main" && t ? `${t} per hour` : "";
    }), s = f(() => !!l.row.retired_at || l.row.state === "retired");
    return (t, a) => {
      var $, N, u;
      return n(), i("div", {
        class: X(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: a[4] || (a[4] = (w) => !e.open && p("toggle")),
        onKeydown: [
          a[5] || (a[5] = Te(Y((w) => !e.open && p("toggle"), ["self", "prevent"]), ["enter"])),
          a[6] || (a[6] = Te(Y((w) => !e.open && p("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        g("span", Ba, [
          e.open ? (n(), i("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: a[0] || (a[0] = Y((w) => p("toggle"), ["stop"]))
          }, [
            k(d(Me), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : m("", !0),
          g("span", {
            class: "agent-dot",
            "data-state": L.value,
            "data-agent-motion": ""
          }, null, 8, Oa),
          g("span", Ia, c(x.value), 1),
          g("span", Ea, c((($ = e.facts) == null ? void 0 : $.given_name) || e.row.id), 1),
          e.open ? m("", !0) : (n(), q(d(Me), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          g("span", Na, [
            s.value ? (n(), i("span", Wa, [
              a[7] || (a[7] = h("Retired, ", -1)),
              k(d($e), {
                at: e.row.retired_at
              }, null, 8, ["at"])
            ])) : e.row.ended_at ? (n(), i("span", qa, [
              a[8] || (a[8] = h("Idle, ", -1)),
              k(d($e), {
                at: e.row.ended_at
              }, null, 8, ["at"])
            ])) : (n(), i("span", Fa, c(z.value), 1))
          ])
        ]),
        g("span", Da, [
          g("span", Pa, c(e.open && e.row.role === "worker" ? `worker ${e.row.id}` : e.open ? "" : V.value), 1),
          e.open && ((N = e.facts) != null && N.last_activity) ? (n(), i("span", Ua, [
            a[9] || (a[9] = h("Last heard: ", -1)),
            k(d($e), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : m("", !0)
        ]),
        e.open ? (n(), q(Ha, {
          key: 0,
          agent: e.row,
          branch: (u = e.progress) == null ? void 0 : u.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: [] },
          card: ""
        }, {
          default: S(() => [
            e.row.role === "helper" && !e.row.ended_at ? (n(), q(d(ae), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: a[1] || (a[1] = Y((w) => d(D).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: S(() => [...a[10] || (a[10] = [
                h("Stop", -1)
              ])]),
              _: 1
            })) : m("", !0)
          ]),
          _: 1
        }, 8, ["agent", "branch", "usage"])) : m("", !0),
        e.open && P.value && !O.value ? (n(), i("span", _a, [
          g("span", Ka, c(v.value), 1)
        ])) : m("", !0),
        e.open && T.value ? (n(), i("span", Ja, [
          g("button", {
            type: "button",
            class: "agent-plan",
            "data-agent-plan": "",
            "data-peek": `plans:${T.value.plan_id}`,
            onClick: a[2] || (a[2] = Y((w) => d(ve)(`plans:${T.value.plan_id}`), ["stop"]))
          }, "Plan " + c(T.value.plan_id) + ": " + c(T.value.plan_title), 9, Za)
        ])) : m("", !0),
        O.value || !e.open && F.value ? (n(), i("span", {
          key: 3,
          class: X(["agent-line", { "agent-work-start": !T.value }])
        }, [
          g("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: O.value
          }, [
            e.open && H.value ? (n(), i("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": H.value,
              onClick: a[3] || (a[3] = Y((w) => d(ve)(H.value), ["stop"]))
            }, c(O.value), 9, Ya)) : (n(), i(B, { key: 1 }, [
              h(c(O.value), 1)
            ], 64))
          ], 8, Ga),
          !e.open && F.value ? (n(), i("span", {
            key: 0,
            class: "agent-work-status",
            "data-agent-waiting": e.waitReason ? "" : null,
            "data-agent-stopped": I.value && !e.waitReason ? "" : null
          }, c(F.value), 9, Qa)) : m("", !0),
          e.open && P.value ? (n(), i("span", Xa, c(v.value), 1)) : m("", !0)
        ], 2)) : m("", !0),
        e.open ? (n(), q(Jt, {
          key: 4,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: M.value,
          "stopped-with-work": I.value,
          open: e.open,
          "total-count": P.value,
          "tasks-per-hour": b.value
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open", "total-count", "tasks-per-hour"])) : m("", !0)
      ], 42, La);
    };
  }
}, tn = /* @__PURE__ */ G(en, [["__scopeId", "data-v-be747254"]]), an = {
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
    const r = he(), { rows: o, failure: l } = r.props.limits, p = R(!1), y = R(!1), x = R(!1), M = R(""), C = R(""), T = (v) => v === 0 ? "no limit" : String(v), O = (v, b) => b === 0 ? 0 : v > b ? 2 : v === b ? 1 : 0, H = f(() => o.value.flatMap((v) => v.per_profile && v.profiles.length ? v.profiles.map((b) => ({ ...b, label: b.title, type: v.key, key: `${v.key}:${b.profile}` })) : [v])), V = (v) => Math.max(O(v.running, v.run_limit), O(v.kept, v.kept_limit)), D = f(() => H.value.filter((v) => V(v)).sort((v, b) => V(b) - V(v))), z = f(() => o.value.reduce((v, b) => v + b.running, 0)), j = f(() => o.value.reduce((v, b) => v + b.kept, 0)), I = (v) => {
      const b = [v.run_limit ? v.running - v.run_limit : -1, v.kept_limit ? v.kept - v.kept_limit : -1], s = Math.max(...b);
      return s > 0 ? `Over by ${s}` : s === 0 ? "At limit" : "Within limits";
    }, L = (v, b) => b ? `${Math.min(v / Math.max(v, b) * 100, 100)}%` : "0%", F = (v, b) => b && v > b ? `${(v - b) / v * 100}%` : "0%";
    function _() {
      y.value = !y.value;
    }
    async function P(v, b, s, t) {
      if (x.value || r.readOnly) return;
      const a = Number(t.target.value);
      if (!Number.isInteger(a) || a < 0 || !t.target.value.trim()) {
        M.value = "Use a whole number of 0 or more.", t.target.value = String(s);
        return;
      }
      x.value = !0, C.value = "";
      try {
        const $ = await r.run(["setting", "set", b, String(a), "--environment", r.environment]);
        if (M.value = $.ok ? "" : $.error, !$.ok) {
          t.target.value = String(s);
          return;
        }
        await r.reload("limits"), C.value = `${v.label} limits saved.`;
      } finally {
        x.value = !1;
      }
    }
    return (v, b) => (n(), i("section", an, [
      d(o).length ? (n(), i(B, { key: 0 }, [
        g("button", {
          class: "summary",
          type: "button",
          "aria-expanded": p.value,
          onClick: b[0] || (b[0] = (s) => p.value = !p.value)
        }, [
          D.value.length ? (n(), i(B, { key: 0 }, [
            (n(!0), i(B, null, J(D.value.slice(0, 2), (s) => (n(), i("span", {
              key: s.key,
              class: "summary-item"
            }, [
              g("span", {
                class: X(["mark", { over: V(s) === 2 }])
              }, null, 2),
              h(c(s.label) + ": " + c(I(s)), 1)
            ]))), 128)),
            D.value.length > 2 ? (n(), i("span", ln, c(D.value.length - 2) + " more", 1)) : m("", !0)
          ], 64)) : (n(), i("span", sn, "All within limits, " + c(z.value) + " running, " + c(j.value) + " kept", 1)),
          k(d(Me), {
            name: "caret",
            size: 12
          })
        ], 8, nn),
        Ke(g("div", on, [
          g("div", rn, [
            b[1] || (b[1] = g("strong", null, "Agent limits", -1)),
            k(d(ae), {
              small: "",
              disabled: x.value || d(r).readOnly,
              "data-agent-limits-edit": "",
              onClick: _
            }, {
              default: S(() => [
                h(c(y.value ? "Done" : "Edit limits"), 1)
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          y.value ? (n(), i(B, { key: 1 }, [
            (n(!0), i(B, null, J(d(o), (s) => (n(), i("div", {
              key: s.key,
              class: "edit-row",
              "data-agent-limit-type": s.key
            }, [
              g("strong", null, c(s.label), 1),
              g("label", hn, [
                g("span", null, [
                  b[3] || (b[3] = h("Running", -1)),
                  s.per_profile ? (n(), i(B, { key: 0 }, [
                    h(" per profile")
                  ], 64)) : m("", !0)
                ]),
                k(d(Se), {
                  type: "number",
                  min: "0",
                  value: String(s.run_limit),
                  disabled: x.value || d(r).readOnly,
                  "data-agent-run-limit": s.key,
                  onChange: (t) => P(s, s.run_setting, s.run_limit, t)
                }, null, 8, ["value", "disabled", "data-agent-run-limit", "onChange"]),
                g("small", null, c(s.run_source), 1)
              ]),
              g("label", mn, [
                g("span", null, [
                  b[4] || (b[4] = h("Kept", -1)),
                  s.per_profile ? (n(), i(B, { key: 0 }, [
                    h(" per profile")
                  ], 64)) : m("", !0)
                ]),
                k(d(Se), {
                  type: "number",
                  min: "0",
                  value: String(s.kept_limit),
                  disabled: x.value || d(r).readOnly,
                  "data-agent-kept-limit": s.key,
                  onChange: (t) => P(s, s.kept_setting, s.kept_limit, t)
                }, null, 8, ["value", "disabled", "data-agent-kept-limit", "onChange"]),
                g("small", null, c(s.kept_source), 1)
              ])
            ], 8, vn))), 128)),
            g("p", null, "Running 0 starts no agents. Kept 0 means no limit. Changes apply to " + c(d(r).environment) + ".", 1)
          ], 64)) : (n(), i(B, { key: 0 }, [
            b[2] || (b[2] = g("div", { class: "table-head" }, [
              g("span", null, "Agent"),
              g("span", null, "Running"),
              g("span", null, "Kept"),
              g("span", null, "Status")
            ], -1)),
            (n(!0), i(B, null, J(H.value, (s) => (n(), i("div", {
              key: s.key,
              class: "limit-row",
              "data-agent-limit-type": s.type || s.key,
              "data-agent-limit-profile": s.profile
            }, [
              g("strong", null, c(s.label), 1),
              g("div", un, [
                g("span", null, c(s.run_limit ? `${s.running} of ${s.run_limit}` : `${s.running} · none may start`), 1),
                g("div", cn, [
                  g("span", {
                    style: le({ width: L(s.running, s.run_limit) })
                  }, null, 4),
                  g("i", {
                    style: le({ width: F(s.running, s.run_limit) })
                  }, null, 4)
                ])
              ]),
              g("div", gn, [
                g("span", null, c(s.kept) + " of " + c(T(s.kept_limit)), 1),
                g("div", pn, [
                  g("span", {
                    style: le({ width: L(s.kept, s.kept_limit) })
                  }, null, 4),
                  g("i", {
                    style: le({ width: F(s.kept, s.kept_limit) })
                  }, null, 4)
                ])
              ]),
              g("span", {
                class: X(["status", { warning: V(s) === 1, danger: V(s) === 2 }])
              }, c(I(s)), 3)
            ], 8, dn))), 128))
          ], 64))
        ], 512), [
          [Je, p.value]
        ])
      ], 64)) : m("", !0),
      M.value || d(l) ? (n(), i("p", fn, c(M.value || d(l)), 1)) : m("", !0),
      C.value ? (n(), i("p", kn, c(C.value), 1)) : m("", !0)
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
    const r = e, o = he(), { rows: l } = o.props.waits, { rows: p } = o.props.progress, { rows: y, failure: x, loaded: M, more: C } = o.props.agents, T = (E) => p.value.find((W) => W.agent_id === E.id) ?? null, O = (E) => {
      var W;
      return ((W = l.value.find((A) => A.agent_id === E.id)) == null ? void 0 : W.reason) ?? "";
    }, H = R("running"), V = R(""), D = JSON.parse(localStorage.getItem(Ve) || '{"roles":[],"profiles":[],"programs":[]}'), z = R(D), j = f(() => o.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: I } = o.props.programs, L = f(() => z.value.roles.length + z.value.profiles.length + z.value.programs.length), F = (E, W) => {
      z.value = dt(z.value, E, W);
    }, _ = () => {
      z.value = { roles: [], profiles: [], programs: [] };
    }, P = (E) => E.slice(0, 1).toUpperCase() + E.slice(1);
    te(z, (E) => localStorage.setItem(Ve, JSON.stringify(E)));
    const v = R(25);
    function b() {
      Object.assign(o.state, {
        "agents.show": H.value,
        "agents.search": V.value,
        "agents.limit": String(v.value),
        "agents.roles": z.value.roles.join(","),
        "agents.profiles": z.value.profiles.join(","),
        "agents.programs": z.value.programs.join(",")
      });
    }
    async function s() {
      return v.value += 25, b(), await o.reload("agents"), !0;
    }
    te([H, V, z], () => {
      v.value = 25, b(), o.reload("agents");
    }), b();
    const t = (E) => E.facts ?? null, a = y, $ = f(() => !!V.value.trim() || L.value > 0), N = f(() => r.texts[H.value] ?? { title: r.empty, hint: "" }), u = R(null), w = R(null), U = R(null), Q = f(() => a.value.find((E) => E.id === u.value) ?? null), ue = f(() => Q.value ? [Q.value] : a.value), me = f(() => a.value.length - ue.value.length), oe = () => globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let se = !1, fe = 0;
    async function Ie(E) {
      if (se) return;
      se = !0, fe = U.value.scrollTop;
      const W = w.value.querySelector(`[data-agent-open="${E.id}"]`);
      if (!oe()) {
        const ne = [...w.value.querySelectorAll(".agent-row")].filter((ee) => !ee.contains(W));
        await Promise.all(ne.map((ee) => ee.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const A = [...W.querySelectorAll(".agent-head, .agent-line")], K = [...A, ...W.querySelectorAll("[data-agent-motion]")], ke = K.map((ne) => ne.getBoundingClientRect());
      if (u.value = E.id, await Re(), !oe()) {
        const ne = K.map((ee) => ee.getBoundingClientRect());
        K.forEach((ee, ye) => {
          const ie = A.indexOf(ee.parentElement), Ne = ke[ye].left - ne[ye].left - (ie < 0 ? 0 : ke[ie].left - ne[ie].left), We = ke[ye].top - ne[ye].top - (ie < 0 ? 0 : ke[ie].top - ne[ie].top);
          ee.animate([{ transform: `translate(${Ne}px, ${We}px)` }, { transform: "none" }], { duration: 280, easing: we });
        }), w.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((ee) => {
          ee.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: we, fill: "backwards" });
        });
      }
      se = !1;
    }
    async function xe() {
      if (se || !Q.value) return;
      se = !0;
      const E = w.value.querySelector(`[data-agent-open="${u.value}"]`), W = [...E.children, ...w.value.querySelectorAll(".agents-held")], A = oe() ? [] : W.map((K) => K.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(A.map((K) => K.finished)), u.value = null, await Re(), U.value.scrollTop = fe, A.forEach((K) => K.cancel()), oe() || (E.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: we }), w.value.querySelectorAll(".agent-row").forEach((K) => {
        K.contains(E) || K.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: we });
      })), se = !1;
    }
    const Ee = (E) => u.value === E.id ? xe() : Ie(E);
    te(V, (E) => E.trim() && (u.value = null)), te(H, () => {
      u.value = null;
    });
    const Ae = (E) => {
      E.key === "Escape" && xe();
    };
    return globalThis.addEventListener("keydown", Ae), ge(() => globalThis.removeEventListener("keydown", Ae)), (E, W) => (n(), i("div", {
      ref_key: "agents",
      ref: w,
      class: X(["agents", { focused: Q.value }])
    }, [
      k(bn),
      k(d(ot), {
        modelValue: V.value,
        "onUpdate:modelValue": W[1] || (W[1] = (A) => V.value = A),
        placeholder: "Search agents",
        "menu-count": L.value,
        "data-agents-search": ""
      }, {
        menu: S(() => [
          k(d(Ce), null, {
            default: S(() => [...W[2] || (W[2] = [
              h("Type", -1)
            ])]),
            _: 1
          }),
          (n(!0), i(B, null, J(j.value.roles, (A) => (n(), q(d(be), {
            key: A,
            role: "menuitemcheckbox",
            "aria-checked": z.value.roles.includes(A),
            checked: z.value.roles.includes(A),
            "data-filter-role": A,
            onClick: (K) => F("roles", A)
          }, {
            default: S(() => [
              h(c(P(A)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          j.value.profiles.length ? (n(), q(d(Ce), { key: 0 }, {
            default: S(() => [...W[3] || (W[3] = [
              h("Profile", -1)
            ])]),
            _: 1
          })) : m("", !0),
          (n(!0), i(B, null, J(j.value.profiles, (A) => (n(), q(d(be), {
            key: A.name,
            role: "menuitemcheckbox",
            "aria-checked": z.value.profiles.includes(A.name),
            checked: z.value.profiles.includes(A.name),
            "data-filter-profile": A.name,
            onClick: (K) => F("profiles", A.name)
          }, {
            default: S(() => [
              h(c(A.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          k(d(Ce), null, {
            default: S(() => [...W[4] || (W[4] = [
              h("Program", -1)
            ])]),
            _: 1
          }),
          (n(!0), i(B, null, J(d(I), (A) => (n(), q(d(be), {
            key: A.name,
            role: "menuitemcheckbox",
            "aria-checked": z.value.programs.includes(A.name),
            checked: z.value.programs.includes(A.name),
            "data-filter-program": A.name,
            onClick: (K) => F("programs", A.name)
          }, {
            default: S(() => [
              h(c(A.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          L.value ? (n(), q(d(be), {
            key: 1,
            "data-filter-clear": "",
            onClick: _
          }, {
            default: S(() => [...W[5] || (W[5] = [
              h("Clear filters", -1)
            ])]),
            _: 1
          })) : m("", !0)
        ]),
        default: S(() => [
          k(d(it), {
            options: j.value.states,
            value: H.value,
            onPick: W[0] || (W[0] = (A) => H.value = A)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      H.value === "retired" && j.value.upgrade_retired ? (n(), i("p", wn, "Retired during the upgrade: " + c(j.value.upgrade_retired), 1)) : m("", !0),
      g("div", {
        ref_key: "list",
        ref: U,
        class: X(["agents-view", { "agents-view-open": Q.value }])
      }, [
        d(M) && !d(x) && !ue.value.length && L.value ? (n(), q(d(je), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: S(() => [
            k(d(ae), {
              small: "",
              "data-empty-clear": "",
              onClick: _
            }, {
              default: S(() => [...W[6] || (W[6] = [
                h("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (n(), q(d(rt), {
          key: 1,
          rows: ue.value,
          failure: d(x),
          loaded: d(M),
          more: !Q.value && d(C),
          older: s,
          empty: N.value.title,
          hint: N.value.hint,
          searching: $.value
        }, {
          default: S(({ row: A }) => [
            g("div", {
              class: "agent-row",
              "data-agent-row": A.id
            }, [
              k(tn, {
                row: A,
                facts: t(A),
                progress: T(A),
                "wait-reason": O(A),
                open: A.id === u.value,
                onToggle: (K) => Ee(A)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, Mn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2),
      Q.value && me.value ? (n(), i("button", {
        key: 1,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: xe
      }, c(me.value) + " more", 1)) : m("", !0)
    ], 2));
  }
}, jn = /* @__PURE__ */ G(xn, [["__scopeId", "data-v-b9a3d204"]]);
export {
  jn as A
};
