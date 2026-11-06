/* @code-commandments-generated */
import { openBlock as n, createElementBlock as r, withModifiers as Q, unref as g, createTextVNode as v, toDisplayString as c, createVNode as m, createBlock as N, withCtx as A, Fragment as B, renderList as K, createElementVNode as d, createCommentVNode as f, ref as S, computed as b, watch as ae, defineAsyncComponent as Ue, onUnmounted as $e, createSlots as Ke, resolveDynamicComponent as Ze, normalizeStyle as oe, normalizeClass as X, renderSlot as ve, onMounted as He, Teleport as Ge, mergeProps as Ye, toRef as Qe, withKeys as Oe, withDirectives as Xe, vShow as et, nextTick as ze } from "vue";
import { peekRef as he, Icon as Me, RunningCommand as tt, FoldGroup as Ie, TaskStatusIcon as at, Btn as te, TextArea as nt, TextInput as Se, useWindow as fe, SwitchCase as Ee, loadWindowComponent as lt, coalesced as Ne, READ_RATES as qe, InnerTabs as st, TabBody as ot, EmptyState as Ae, useNow as it, age as rt, perHour as ut, TimeAgo as ye, useRows as dt, useDeclaredRows as Ve, SearchBar as ct, Segmented as gt, MenuLabel as Ce, MenuItem as be, RowList as pt, toggleFilter as vt } from "@journal/window-kit";
import { _ as Z, T as ht } from "./TranscriptRows-ByPSYos4.js";
const ft = {
  class: "agent-command",
  "data-agent-command": ""
}, mt = {
  key: 1,
  "data-agent-stopped": ""
}, kt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(t) {
    return (o, i) => (n(), r("span", ft, [
      t.waitReason ? (n(), r("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: i[0] || (i[0] = Q((l) => g(he)("test_queue:0"), ["stop"]))
      }, [
        v("Waiting: " + c(t.waitReason) + " ", 1),
        m(g(Me), {
          name: "arrow",
          size: 11
        })
      ])) : t.stopped ? (n(), r("span", mt, "Waiting")) : (n(), N(g(tt), {
        key: 2,
        text: t.command,
        idle: t.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, yt = /* @__PURE__ */ Z(kt, [["__scopeId", "data-v-1b371fb5"]]), bt = ["data-agent-delegated", "onClick"], wt = { class: "agent-task-number" }, Mt = { class: "agent-task-title" }, $t = ["title"], xt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(t, { emit: o }) {
    const i = o;
    return (l, p) => (n(), N(g(Ie), {
      label: t.section.label,
      count: t.section.tasks.length,
      open: t.open,
      "data-agent-section": t.section.state,
      onToggle: p[0] || (p[0] = (y) => i("toggle"))
    }, {
      default: A(() => [
        (n(!0), r(B, null, K(t.section.tasks, (y) => (n(), r("button", {
          key: y.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": y.id,
          onClick: (C) => g(he)(`tasks:${y.id}`)
        }, [
          m(g(at), {
            status: y.state
          }, null, 8, ["status"]),
          d("span", wt, c(y.id), 1),
          d("span", Mt, c(y.title), 1),
          y.plan_id ? (n(), r("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${y.plan_id}: ${y.plan_title}`
          }, "Plan " + c(y.plan_id) + ": " + c(y.plan_title), 9, $t)) : f("", !0)
        ], 8, bt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Ct = /* @__PURE__ */ Z(xt, [["__scopeId", "data-v-238ff959"]]), St = { class: "action-field" }, At = ["value", "disabled"], Tt = ["value"], jt = { key: 1 }, Rt = {
  key: 1,
  class: "action-field"
}, Ot = { class: "action-buttons" }, zt = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(t) {
    return (o, i) => (n(), r("form", {
      onSubmit: i[4] || (i[4] = Q((l) => o.$emit("submit"), ["prevent"]))
    }, [
      t.row.job_task_flag ? (n(), r(B, { key: 0 }, [
        d("label", St, [
          i[6] || (i[6] = v("Task ", -1)),
          d("select", {
            value: t.task,
            disabled: t.pending || t.loading,
            "data-agent-job-task": "",
            onChange: i[0] || (i[0] = (l) => o.$emit("update:task", l.target.value))
          }, [
            i[5] || (i[5] = d("option", { value: "" }, "Choose an open task", -1)),
            (n(!0), r(B, null, K(t.tasks, (l) => (n(), r("option", {
              key: l.id,
              value: String(l.id)
            }, c(l.id) + ": " + c(l.title), 9, Tt))), 128))
          ], 40, At)
        ]),
        t.moreTasks ? (n(), N(g(te), {
          key: 0,
          small: "",
          disabled: t.pending || t.loading,
          "data-agent-more-tasks": "",
          onClick: i[1] || (i[1] = (l) => o.$emit("more"))
        }, {
          default: A(() => [...i[7] || (i[7] = [
            v("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : f("", !0),
        !t.loading && !t.tasks.length && !t.failure ? (n(), r("p", jt, "No open tasks.")) : f("", !0)
      ], 64)) : (n(), r("label", Rt, [
        i[8] || (i[8] = v("Job", -1)),
        m(g(nt), {
          value: t.text,
          disabled: t.pending,
          "data-agent-job-text": "",
          onInput: i[2] || (i[2] = (l) => o.$emit("update:text", l.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      d("div", Ot, [
        m(g(te), {
          type: "submit",
          small: "",
          disabled: t.pending || !t.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: A(() => [...i[9] || (i[9] = [
            v("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        m(g(te), {
          small: "",
          disabled: t.pending,
          onClick: i[3] || (i[3] = (l) => o.$emit("cancel"))
        }, {
          default: A(() => [...i[10] || (i[10] = [
            v("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Vt = /* @__PURE__ */ Z(zt, [["__scopeId", "data-v-adde4158"]]), Lt = { class: "action-buttons" }, Bt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(t) {
    return (o, i) => (n(), r("form", {
      "data-agent-retire-confirm": "",
      onSubmit: i[2] || (i[2] = Q((l) => o.$emit("submit"), ["prevent"]))
    }, [
      i[5] || (i[5] = d("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      m(g(Se), {
        "model-value": t.reason,
        label: "Reason",
        disabled: t.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": i[0] || (i[0] = (l) => o.$emit("update:reason", l))
      }, null, 8, ["model-value", "disabled"]),
      d("div", Lt, [
        m(g(te), {
          type: "submit",
          small: "",
          disabled: t.pending || !t.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: A(() => [...i[3] || (i[3] = [
            v("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        m(g(te), {
          small: "",
          disabled: t.pending,
          onClick: i[1] || (i[1] = (l) => o.$emit("cancel"))
        }, {
          default: A(() => [...i[4] || (i[4] = [
            v("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Ht = /* @__PURE__ */ Z(Bt, [["__scopeId", "data-v-23a905c0"]]), It = { class: "action-buttons" }, Et = {
  key: 0,
  role: "alert"
}, Nt = {
  key: 1,
  role: "status"
}, qt = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(t) {
    const o = t, i = fe(), l = S(""), p = S(""), y = S(""), C = S(""), k = S([]), w = S(0), O = S(!1), $ = S(!1), z = S(!1), H = S(""), I = S(""), _ = b(() => !!o.row.retired_at || o.row.state === "retired"), E = b(() => !_.value && !!o.row.ended_at), R = b(() => {
      var e;
      return E.value && ((e = o.row.job_command) == null ? void 0 : e.length) && !o.row.resume_reason;
    }), L = b(() => R.value && !$.value && (o.row.job_task_flag ? k.value.some((e) => String(e.id) === C.value) : !!p.value.trim()));
    function W(e) {
      l.value = e, p.value = "", y.value = "", C.value = "", H.value = "", I.value = "";
    }
    async function F() {
      W("job"), o.row.job_task_flag && (k.value = [], w.value = 0, O.value = !1, await q());
    }
    async function q() {
      if (!$.value) {
        $.value = !0;
        try {
          const e = await i.read(`task list --state open --limit 100 --page ${w.value + 1}`);
          H.value = e.ok ? "" : e.error, e.ok && (k.value = [...k.value, ...e.value.rows], w.value = e.value.page, O.value = e.value.page * e.value.size < e.value.total);
        } finally {
          $.value = !1;
        }
      }
    }
    async function P(e, a) {
      if (!z.value) {
        z.value = !0, H.value = "";
        try {
          const s = await i.run(e);
          H.value = s.ok ? "" : s.error, s.ok && (W(""), I.value = a);
        } finally {
          z.value = !1;
        }
      }
    }
    async function J() {
      if (!L.value) return;
      const e = o.row.job_task_flag ? [o.row.job_task_flag, C.value] : [p.value.trim()];
      await P([...o.row.job_command, String(o.row.id), ...e], "Job sent.");
    }
    async function h() {
      !E.value || l.value !== "retire" || !y.value.trim() || await P(["agent", "retire", String(o.row.id), "--reason", y.value.trim()], "Agent retired permanently.");
    }
    return (e, a) => {
      var s;
      return _.value ? f("", !0) : (n(), r("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: a[6] || (a[6] = Q(() => {
        }, ["stop"])),
        onKeydown: a[7] || (a[7] = Q(() => {
        }, ["stop"]))
      }, [
        d("div", It, [
          E.value ? (n(), r(B, { key: 0 }, [
            (s = t.row.job_command) != null && s.length ? (n(), N(g(te), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: z.value || $.value || !R.value,
              onClick: F
            }, {
              default: A(() => [...a[8] || (a[8] = [
                v("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0),
            t.row.role !== "main" ? (n(), N(g(te), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: z.value || $.value,
              onClick: a[0] || (a[0] = (T) => W("retire"))
            }, {
              default: A(() => [...a[9] || (a[9] = [
                v("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0)
          ], 64)) : f("", !0)
        ]),
        m(g(Ee), { value: l.value }, {
          job: A(() => [
            m(Vt, {
              task: C.value,
              "onUpdate:task": a[1] || (a[1] = (T) => C.value = T),
              text: p.value,
              "onUpdate:text": a[2] || (a[2] = (T) => p.value = T),
              row: t.row,
              tasks: k.value,
              pending: z.value,
              loading: $.value,
              "more-tasks": O.value,
              failure: H.value,
              "job-ready": L.value,
              onSubmit: J,
              onMore: q,
              onCancel: a[3] || (a[3] = (T) => W(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: A(() => [
            m(Ht, {
              reason: y.value,
              "onUpdate:reason": a[4] || (a[4] = (T) => y.value = T),
              pending: z.value,
              onSubmit: h,
              onCancel: a[5] || (a[5] = (T) => W(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        H.value ? (n(), r("p", Et, c(H.value), 1)) : f("", !0),
        I.value ? (n(), r("p", Nt, c(I.value), 1)) : f("", !0)
      ], 32));
    };
  }
}, Wt = /* @__PURE__ */ Z(qt, [["__scopeId", "data-v-da5113a2"]]), _t = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Ft = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Dt = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, Pt = ["data-peek", "onClick"], Jt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ut = {
  key: 0,
  class: "agent-helper-brief"
}, Kt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Zt = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Gt = "It ended without a report", Yt = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(t) {
    const o = t, i = ["started", "blocked", "open", "completed"], l = b(() => {
      var e, a;
      return o.row.ended_at && ((a = (e = o.facts) == null ? void 0 : e.job_returned) != null && a.startsWith(Gt)) ? o.facts.job_returned : "";
    }), p = b(() => o.tasks.length ? i.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: o.tasks.filter((a) => a.state === e || e === "started" && a.state === "testing" || e === "completed" && a.state === "cancelled") })) : []), y = /* @__PURE__ */ new Set(["completed"]), C = S({}), k = (e) => !(C.value[e] ?? y.has(e)), w = (e) => C.value = { ...C.value, [e]: k(e) }, O = fe(), { rows: $ } = O.props.reports;
    O.state["reports.agent"] = String(o.row.id), O.reload("reports");
    const z = b(() => o.row.access === "read-only"), H = b(() => !!o.row.retired_at || o.row.state === "retired"), I = ["tasks", "transcript", "terminal", "file-feed", "reports"], _ = b(() => (H.value ? O.tabs.filter((a) => ["reports", "transcript"].includes(a.key)) : z.value ? O.tabs.filter((a) => ["reports", "transcript", "terminal"].includes(a.key)) : [...O.tabs]).sort((a, s) => (I.indexOf(a.key) < 0 ? I.length : I.indexOf(a.key)) - (I.indexOf(s.key) < 0 ? I.length : I.indexOf(s.key)))), E = () => z.value || H.value ? _.value.find((e) => e.key === "transcript") : _.value[0], R = S(E());
    ae(_, (e) => {
      e.some((a) => {
        var s;
        return a.key === ((s = R.value) == null ? void 0 : s.key);
      }) || (R.value = e[0]);
    }), ae(() => o.open, (e) => {
      e && (R.value = E());
    });
    const L = Object.fromEntries(O.tabs.filter((e) => e.component).map((e) => [e.key, Ue(() => lt(e.component))])), W = S(!1), F = S(""), q = S(""), P = b(() => o.row.role !== "main" && (!o.row.ended_at || o.stoppedWithWork || o.waitReason));
    async function J() {
      if (!o.open || !P.value) return;
      const e = await O.read(`usage tool --agent ${o.row.id}`, { deferred: !0 });
      o.open && (F.value = e.ok ? e.value.tool : "", q.value = e.ok ? e.value.note : "");
    }
    const h = O.follow(["hook_call.*", "process_part.*"], Ne(J, qe.agentCommand));
    return $e(() => h == null ? void 0 : h()), ae(() => o.open, (e) => {
      e && J();
    }, { immediate: !0 }), (e, a) => {
      var s;
      return n(), r("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: a[2] || (a[2] = Q(() => {
        }, ["stop"]))
      }, [
        t.row.retirement_reason ? (n(), r("p", _t, "Retirement reason: " + c(t.row.retirement_reason), 1)) : f("", !0),
        t.row.resume_reason ? (n(), r("p", Ft, c(t.row.resume_reason), 1)) : f("", !0),
        m(Wt, { row: t.row }, null, 8, ["row"]),
        P.value ? (n(), N(yt, {
          key: 2,
          class: "agent-command",
          "wait-reason": t.waitReason,
          stopped: t.stoppedWithWork,
          command: F.value,
          note: q.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : f("", !0),
        l.value ? (n(), r("p", Dt, c(l.value), 1)) : f("", !0),
        m(g(st), {
          class: "agent-tabs",
          tabs: _.value,
          active: R.value,
          answer: { tasks: t.tasks.length, reports: g($).length },
          onChoose: a[0] || (a[0] = (T) => R.value = T)
        }, null, 8, ["tabs", "active", "answer"]),
        m(g(ot), {
          class: "agent-tab-body",
          tab: R.value,
          "data-agent-tab-body": (s = R.value) == null ? void 0 : s.key
        }, {
          default: A(() => {
            var T;
            return [
              m(g(Ee), {
                value: (T = R.value) == null ? void 0 : T.key
              }, Ke({
                reports: A(() => [
                  g($).length ? f("", !0) : (n(), N(g(Ae), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: A(() => [...a[3] || (a[3] = [
                      v("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (n(!0), r(B, null, K(g($), (u) => (n(), r("button", {
                    key: u.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${u.id}`,
                    onClick: (x) => g(he)(`messages:${u.id}`)
                  }, c(u.text), 9, Pt))), 128))
                ]),
                tasks: A(() => {
                  var u;
                  return [
                    t.tasks.length ? f("", !0) : (n(), N(g(Ae), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: A(() => [...a[4] || (a[4] = [
                        v("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (n(!0), r(B, null, K(p.value, (x) => (n(), N(Ct, {
                      key: x.state,
                      section: x,
                      open: k(x.state),
                      onToggle: (U) => w(x.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (u = t.facts) != null && u.instruction ? (n(), r(B, { key: 1 }, [
                      a[5] || (a[5] = d("p", { class: "agent-label" }, "Instruction", -1)),
                      d("div", Jt, c(t.facts.instruction), 1)
                    ], 64)) : f("", !0)
                  ];
                }),
                transcript: A(() => {
                  var u;
                  return [
                    z.value ? (n(), r(B, { key: 0 }, [
                      (u = t.facts) != null && u.instruction ? (n(), r("div", Ut, [
                        m(g(Ie), {
                          label: "Instruction",
                          open: W.value,
                          "data-agent-section": "instruction",
                          onToggle: a[1] || (a[1] = (x) => W.value = !W.value)
                        }, {
                          default: A(() => [
                            d("div", Kt, c(t.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : t.facts && t.row.ended_at ? (n(), r("p", Zt, "No job recorded")) : f("", !0)
                    ], 64)) : f("", !0),
                    m(ht, {
                      line: `agent transcript ${t.row.id}`,
                      padding: "0"
                    }, null, 8, ["line"])
                  ];
                }),
                _: 2
              }, [
                K(g(L), (u, x) => ({
                  name: x,
                  fn: A(() => [
                    (n(), N(Ze(u), {
                      agent: t.row.id
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
}, Qt = /* @__PURE__ */ Z(Yt, [["__scopeId", "data-v-c6fa67c9"]]), Xt = {
  class: "agent-count",
  "data-agent-motion": ""
}, ea = {
  key: 0,
  class: "agent-pace",
  "data-agent-pace": ""
}, ta = {
  class: "agent-tasks",
  "data-agent-tasks": ""
}, aa = {
  __name: "AgentTaskCount",
  props: { count: { type: String, required: !0 }, rate: { type: String, required: !0 } },
  setup(t) {
    return (o, i) => (n(), r("span", Xt, [
      t.rate ? (n(), r("span", ea, c(t.rate), 1)) : f("", !0),
      d("span", ta, c(t.count), 1)
    ]));
  }
}, Le = /* @__PURE__ */ Z(aa, [["__scopeId", "data-v-44694015"]]), na = ["stroke-width", "innerHTML"], G = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(t) {
    const o = t, i = { right: 0, down: 90, left: 180, up: 270 }, l = {
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
    return (y, C) => (n(), r("svg", {
      class: "ico",
      style: oe({
        ...t.size ? { "--icon-size": `${t.size}px` } : {},
        ...o.facing === "right" ? {} : { transform: `rotate(${i[o.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": t.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: p[l[t.name] || t.name] || p.dot
    }, null, 12, na));
  }
}, la = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, sa = {
  key: 1,
  class: "menu-item-text"
}, oa = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(t) {
    return (o, i) => (n(), r("button", {
      type: "button",
      class: X(["menu-item", { on: t.on, danger: t.danger, described: t.description }])
    }, [
      t.checked !== null ? (n(), r("span", la, c(t.checked ? "✓" : ""), 1)) : f("", !0),
      t.description ? (n(), r("span", sa, [
        d("span", null, [
          ve(o.$slots, "default", {}, void 0, !0)
        ]),
        d("small", null, c(t.description), 1)
      ])) : ve(o.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ce = /* @__PURE__ */ Z(oa, [["__scopeId", "data-v-fec99974"]]), ia = {}, ra = { class: "menu-label" };
function ua(t, o) {
  return n(), r("span", ra, [
    ve(t.$slots, "default", {}, void 0, !0)
  ]);
}
const pe = /* @__PURE__ */ Z(ia, [["render", ua], ["__scopeId", "data-v-aa955b3e"]]), da = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, ca = {
  key: 0,
  class: "skills-none"
}, ga = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(t, { emit: o }) {
    const i = t, l = o, p = b(() => i.skills.filter((C) => C.state === "loaded")), y = b(() => i.skills.filter((C) => C.state !== "loaded"));
    return (C, k) => (n(), r("div", da, [
      m(pe, null, {
        default: A(() => [...k[1] || (k[1] = [
          v("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      p.value.length ? f("", !0) : (n(), r("p", ca, "None yet. Compacting the conversation empties this list.")),
      (n(!0), r(B, null, K(p.value, (w) => (n(), r("p", {
        key: w.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        m(G, {
          name: "book",
          size: 12
        }),
        v(c(w.skill), 1)
      ]))), 128)),
      y.value.length ? (n(), r(B, { key: 1 }, [
        m(pe, null, {
          default: A(() => [...k[2] || (k[2] = [
            v("Still to read", -1)
          ])]),
          _: 1
        }),
        (n(!0), r(B, null, K(y.value, (w) => (n(), r("p", {
          key: w.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          m(G, {
            name: "book",
            size: 12
          }),
          v(c(w.skill), 1)
        ]))), 128))
      ], 64)) : f("", !0),
      m(ce, {
        "data-agent-skills-browse": "",
        onClick: k[0] || (k[0] = (w) => l("browse"))
      }, {
        default: A(() => [...k[3] || (k[3] = [
          v("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, pa = /* @__PURE__ */ Z(ga, [["__scopeId", "data-v-be514d47"]]), va = (t, o, i) => Math.max(o, Math.min(i, t)), We = /* @__PURE__ */ new WeakMap(), ha = (t, o) => We.set(t, o);
function fa(t, o) {
  for (let i = o; i; i = We.get(i) ?? i.parentElement) if (i === t) return !0;
  return !1;
}
function ma(t, o) {
  const i = (l) => {
    var y, C;
    const p = ((y = t.value) == null ? void 0 : y.element) || ((C = t.value) == null ? void 0 : C.$el) || t.value;
    p && !fa(p, l.target) && o(l);
  };
  window.addEventListener("click", i), $e(() => window.removeEventListener("click", i));
}
const de = 8, ka = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(t, { expose: o, emit: i }) {
    const l = t, p = S(null), y = (u) => u ? `${u}px` : void 0, C = b(() => ({
      minWidth: y(l.minWidth),
      maxWidth: y(l.maxWidth),
      maxHeight: y(l.maxHeight),
      height: y(l.height)
    })), k = S({ w: 0, h: 0 }), w = S(l.anchor ? l.anchor.getBoundingClientRect() : null), O = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), $ = (u) => ({
      left: Math.max(0, u.left),
      top: Math.max(0, u.top),
      right: Math.min(window.innerWidth, u.right),
      bottom: Math.min(window.innerHeight, u.bottom)
    }), z = (u) => {
      const x = u.closest(".pane, .float-window");
      return x ? $(x.getBoundingClientRect()) : O();
    }, H = (u, x) => `${Math.max(0, u ? Math.min(u, x) : x)}px`;
    function I(u, x) {
      return {
        below: u.bottom - x.bottom - l.gap - de,
        above: x.top - u.top - l.gap - de,
        across: u.right - u.left - 2 * de
      };
    }
    function _(u) {
      const x = z(l.anchor), U = I(x, u);
      return k.value.w <= U.across && k.value.h <= Math.max(U.below, U.above) ? x : O();
    }
    const E = b(() => {
      if (!w.value) return C.value;
      const u = w.value, x = _(u), U = I(x, u), { w: Y, h: ne } = k.value, ge = l.align === "auto" ? u.left + u.right > x.left + x.right : l.align === "right", le = va(ge ? u.right - Y : u.left, x.left + de, Math.max(x.left + de, x.right - Y - de)), ie = ne > U.below && U.above > U.below ? { bottom: `${window.innerHeight - u.top + l.gap}px`, maxHeight: H(l.maxHeight, U.above) } : { top: `${u.bottom + l.gap}px`, maxHeight: H(l.maxHeight, U.below) };
      return { ...C.value, ...ie, left: `${le}px`, maxWidth: H(l.maxWidth, U.across) };
    }), R = i, L = () => [...p.value.querySelectorAll("button:not(:disabled)")];
    function W(u) {
      const x = L(), U = x.indexOf(document.activeElement);
      x[(U + u + x.length) % x.length].focus();
    }
    const F = { ArrowDown: () => W(1), ArrowUp: () => W(-1), Escape: () => R("close") }, q = (u) => F[u.key] && (u.preventDefault(), F[u.key]()), P = () => p.value && (k.value = { w: p.value.offsetWidth, h: p.value.scrollHeight });
    let J = 0;
    const h = new ResizeObserver(() => {
      cancelAnimationFrame(J), J = requestAnimationFrame(P);
    });
    ma(p, (u) => l.anchor && !l.anchor.contains(u.target) && R("close"));
    const e = (u, x) => ["top", "left", "right", "bottom"].some((U) => Math.abs(u[U] - x[U]) > 1), a = (u) => u.bottom < 0 || u.top > window.innerHeight;
    let s = 0;
    function T() {
      if (l.anchor) {
        const u = l.anchor.getBoundingClientRect();
        if (!l.anchor.isConnected || a(u)) return R("close");
        e(u, w.value) && (w.value = u);
      }
      s = requestAnimationFrame(T);
    }
    return He(() => {
      l.anchor && p.value && ha(p.value, l.anchor), P(), p.value && h.observe(p.value), !l.plain && L()[0] && L()[0].focus(), T();
    }), $e(() => {
      h.disconnect(), cancelAnimationFrame(s), cancelAnimationFrame(J);
    }), o({ element: p }), (u, x) => (n(), N(Ge, {
      to: "body",
      disabled: !t.anchor
    }, [
      d("div", Ye({
        ref_key: "panel",
        ref: p
      }, u.$attrs, {
        class: ["menu-panel", { anchored: t.anchor }],
        style: E.value,
        onKeydown: q
      }), [
        ve(u.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ya = /* @__PURE__ */ Z(ka, [["__scopeId", "data-v-3d203970"]]);
async function ba(t, o, i) {
  if (!t) return i(o);
  const { target: l, fields: p } = t, y = Object.fromEntries(Object.keys(p).map((w) => [w, l[w]])), C = () => Object.assign(l, y);
  Object.assign(l, p);
  let k = !1;
  try {
    const w = await i(o);
    return k = w.ok, w;
  } finally {
    k || C();
  }
}
function wa(t, o, i) {
  const l = S([]), p = S([]), y = S({}), C = S(""), k = S(!1), w = b(() => !!t.value && !t.value.ended_at), O = b(() => w.value && !!t.value.paused_at);
  async function $() {
    if (w.value) {
      const R = await o(["agent", "controls", String(t.value.id)]);
      l.value = R.ok ? R.value.groups : [];
      return;
    }
    const E = await o(["agent", "programs"]);
    p.value = E.ok ? E.value.rows : [];
  }
  async function z(E, R = null) {
    C.value = "";
    const L = await ba(R, E, o);
    return C.value = L.ok ? "" : L.error, i(), L;
  }
  const H = (E, R) => z(["agent", "control", String(t.value.id), E, R.value], { target: y, fields: { value: { ...y.value, [E]: R.label } } }), I = () => (k.value = !1, z(["agent", "stop", String(t.value.id)], { target: t.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), _ = (E) => z(["agent", "launch", E.name]);
  return He($), ae(w, $), { groups: l, programs: p, chosen: y, failure: C, asking: k, running: w, paused: O, choose: H, stop: I, start: _ };
}
const _e = { claude: "Claude Code", codex: "Codex" };
Object.entries(_e).map(([t, o]) => ({ key: t, label: o }));
function Ma(t, o = "agent") {
  return _e[t] || o;
}
function $a(t) {
  if (!t) return "Not compacted yet";
  const o = new Date(t.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return t.start_percent === null ? `Last compacted ${o}` : t.end_percent === null ? `Last compacted ${o}, from ${t.start_percent}%` : `Last compacted ${o}, from ${t.start_percent}% to ${t.end_percent}%, ${t.start_percent - t.end_percent}% taken off`;
}
const xa = ["disabled", "title"], Ca = ["title"], Sa = { class: "gauge usage" }, Aa = ["disabled", "title"], Ta = { class: "gauge" }, ja = ["disabled", "title"], Ra = ["disabled"], Oa = ["disabled"], za = {
  key: 5,
  class: "fact",
  "data-fact": "uptime",
  title: "How long this session has run"
}, Va = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, La = ["title"], Ba = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Ha = { class: "gauge" }, Ia = { class: "context-used" }, Ea = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Na = 75, qa = {
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
  setup(t, { emit: o }) {
    const i = t, l = o, p = wa(Qe(i, "agent"), i.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => l("changed")), y = S(null), C = S(""), k = b(() => p.groups.value.find((h) => h.key === C.value));
    function w(h, e) {
      y.value = h.currentTarget, C.value = e;
    }
    function O() {
      y.value = null, C.value = "", p.asking.value = !1;
    }
    const $ = S([]), z = b(() => $.value.filter((h) => h.state === "loaded"));
    async function H() {
      const h = i.agent && i.run ? await i.run(["agent-skill", "list", "--agent", String(i.agent.id)]) : null;
      $.value = h != null && h.ok ? h.value.rows ?? [] : [];
    }
    function I(h) {
      w(h, "skills"), H();
    }
    ae(() => {
      var h;
      return (h = i.agent) == null ? void 0 : h.id;
    }, H, { immediate: !0 });
    const _ = (h) => p.groups.value.some((e) => e.key === h), E = b(() => {
      var h;
      return p.chosen.value.model ?? ((h = L.value) == null ? void 0 : h.model) ?? "";
    }), R = b(() => {
      var h;
      return p.chosen.value.effort ?? ((h = L.value) == null ? void 0 : h.effort) ?? "";
    });
    b(() => !!i.agent && !i.agent.ended_at);
    const L = b(() => {
      var h;
      return ((h = i.usage.agents) == null ? void 0 : h.find((e) => {
        var a;
        return e.id === ((a = i.agent) == null ? void 0 : a.id);
      })) ?? null;
    }), W = b(() => {
      var h;
      return ((h = i.usage.windows) == null ? void 0 : h[0]) ?? null;
    }), F = b(() => W.value ? Math.max(0, Math.min(100, Math.round(W.value.used_percent))) : null), q = b(() => {
      var h;
      return ((h = L.value) == null ? void 0 : h.context_percent) == null ? null : Math.round(L.value.context_percent);
    }), P = b(() => {
      var h;
      return (h = L.value) != null && h.cost_dollars ? `$${L.value.cost_dollars.toFixed(2)}` : "";
    }), J = b(() => {
      var a;
      const h = (a = i.agent) != null && a.process_started_at ? new Date(i.agent.process_started_at).getTime() : 0;
      if (!h) return "";
      const e = Math.max(0, Math.floor((i.now - h) / 6e4));
      return e >= 60 ? `${Math.floor(e / 60)}h ${e % 60}m` : `${e}m`;
    });
    return (h, e) => (n(), r("div", {
      class: X(["information", { card: t.card }]),
      "data-information-bar": ""
    }, [
      t.agent ? (n(), r(B, { key: 0 }, [
        d("button", {
          type: "button",
          class: "fact lead",
          disabled: t.card,
          "data-fact": "agent",
          title: `Session ${t.agent.session}: stop it`,
          onClick: e[0] || (e[0] = (a) => w(a, "agent"))
        }, [
          m(G, {
            name: "agents",
            size: 12
          }),
          v(" " + c(g(Ma)(t.agent.program)), 1)
        ], 8, xa),
        F.value !== null ? (n(), r("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${F.value}% of the plan's ${W.value.title} allowance used`,
          onClick: e[1] || (e[1] = (a) => l("open", "usage", a.currentTarget))
        }, [
          m(G, {
            name: "clock",
            size: 12
          }),
          e[14] || (e[14] = v()),
          d("span", Sa, [
            d("span", {
              style: oe({ width: `${F.value}%` })
            }, null, 4)
          ]),
          v(" " + c(F.value) + "% ", 1)
        ], 8, Ca)) : f("", !0),
        q.value !== null ? (n(), r("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: t.card,
          "data-fact": "context",
          title: `Context ${q.value}% full: clear or compact it`,
          onClick: e[2] || (e[2] = (a) => _("context") ? w(a, "context") : l("open", "context", a.currentTarget))
        }, [
          m(G, {
            name: "gauge",
            size: 12
          }),
          e[15] || (e[15] = v()),
          d("span", Ta, [
            d("span", {
              style: oe({ width: `${q.value}%` })
            }, null, 4)
          ]),
          v(" " + c(q.value) + "% ", 1)
        ], 8, Aa)) : f("", !0),
        E.value ? (n(), r("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: t.card,
          "data-fact": "model",
          title: `${E.value}: change the model`,
          onClick: e[3] || (e[3] = (a) => _("model") ? w(a, "model") : null)
        }, [
          m(G, {
            name: "model",
            size: 12
          }),
          v(" " + c(E.value), 1)
        ], 8, ja)) : f("", !0),
        _("effort") || t.card && R.value ? (n(), r("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: t.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: e[4] || (e[4] = (a) => w(a, "effort"))
        }, [
          m(G, {
            name: "bolt",
            size: 12
          }),
          v(" " + c(R.value), 1)
        ], 8, Ra)) : f("", !0),
        P.value ? (n(), r("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: t.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: e[5] || (e[5] = (a) => l("open", "cost", a.currentTarget))
        }, c(P.value), 9, Oa)) : f("", !0),
        J.value ? (n(), r("span", za, [
          m(G, {
            name: "reminders",
            size: 12
          }),
          v(" " + c(J.value), 1)
        ])) : f("", !0),
        t.branch ? (n(), r("span", Va, [
          m(G, {
            name: "branch",
            size: 12
          }),
          v(" " + c(t.branch), 1)
        ])) : f("", !0),
        t.card ? f("", !0) : (n(), r("button", {
          key: 7,
          type: "button",
          class: X(["fact", { none: !t.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: e[6] || (e[6] = (a) => l("open", "jobs", a.currentTarget))
        }, [
          m(G, {
            name: "clock",
            size: 12
          }),
          v(" " + c(t.jobs), 1)
        ], 2)),
        t.run ? (n(), r("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: I
        }, [
          m(G, {
            name: "book",
            size: 12
          }),
          v(" " + c(z.value.length), 1)
        ])) : f("", !0),
        t.fitness ? (n(), r(B, { key: 9 }, [
          d("button", {
            type: "button",
            class: X(["fact", "fitness-fact", { low: t.fitness.is_measured && t.fitness.score < Na }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: e[7] || (e[7] = (a) => l("open", "fitness", a.currentTarget))
          }, [
            m(G, {
              name: "heart",
              size: 12
            }),
            v(" " + c(t.fitness.is_measured ? t.fitness.score : "–"), 1)
          ], 2),
          d("button", {
            type: "button",
            class: X(["fact", "load-fact", t.fitness.workload_level]),
            "data-fact": "load",
            title: "Compare incoming messages with agent replies",
            onClick: e[8] || (e[8] = (a) => l("open", "load", a.currentTarget))
          }, [
            m(G, {
              name: "weight",
              size: 12
            }),
            v(" " + c(t.fitness.workload), 1)
          ], 2)
        ], 64)) : f("", !0)
      ], 64)) : t.run && !t.loading ? (n(), r("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: e[9] || (e[9] = (a) => w(a, "start"))
      }, [
        m(G, {
          name: "agents",
          size: 12
        }),
        e[16] || (e[16] = v(" Start an agent", -1))
      ])) : f("", !0),
      e[22] || (e[22] = d("span", { class: "space" }, null, -1)),
      g(p).failure.value ? (n(), r("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: g(p).failure.value
      }, c(g(p).failure.value), 9, La)) : f("", !0),
      ve(h.$slots, "default", {}, void 0, !0),
      y.value ? (n(), N(ya, {
        key: 3,
        anchor: y.value,
        "min-width": 190,
        onClose: O
      }, {
        default: A(() => {
          var a;
          return [
            C.value === "agent" ? (n(), r(B, { key: 0 }, [
              g(p).asking.value ? (n(), r(B, { key: 0 }, [
                m(pe, { "data-agent-stop-ask": "" }, {
                  default: A(() => [...e[17] || (e[17] = [
                    v("Stop the agent? It stops what it is doing.", -1)
                  ])]),
                  _: 1
                }),
                m(ce, {
                  "data-agent-stop-confirm": "",
                  onClick: e[10] || (e[10] = (s) => (O(), g(p).stop()))
                }, {
                  default: A(() => [...e[18] || (e[18] = [
                    v("Stop it", -1)
                  ])]),
                  _: 1
                }),
                m(ce, {
                  onClick: e[11] || (e[11] = (s) => g(p).asking.value = !1)
                }, {
                  default: A(() => [...e[19] || (e[19] = [
                    v("Keep it running", -1)
                  ])]),
                  _: 1
                })
              ], 64)) : (n(), N(ce, {
                key: 1,
                "data-agent-stop": "",
                onClick: e[12] || (e[12] = (s) => g(p).asking.value = !0)
              }, {
                default: A(() => [...e[20] || (e[20] = [
                  v("Stop", -1)
                ])]),
                _: 1
              }))
            ], 64)) : C.value === "start" ? (n(), r(B, { key: 1 }, [
              m(pe, null, {
                default: A(() => [...e[21] || (e[21] = [
                  v("Start an agent", -1)
                ])]),
                _: 1
              }),
              (n(!0), r(B, null, K(g(p).programs.value, (s) => (n(), N(ce, {
                key: s.name,
                "data-agent-program": s.name,
                onClick: (T) => (O(), g(p).start(s))
              }, {
                default: A(() => [
                  v(c(s.title), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-program", "onClick"]))), 128))
            ], 64)) : C.value === "skills" ? (n(), N(pa, {
              key: 2,
              skills: $.value,
              onBrowse: e[13] || (e[13] = (s) => (O(), l("open", "skills", null)))
            }, null, 8, ["skills"])) : k.value ? (n(), r(B, { key: 3 }, [
              m(pe, null, {
                default: A(() => [
                  v(c(k.value.label), 1)
                ]),
                _: 1
              }),
              C.value === "context" ? (n(), r(B, { key: 0 }, [
                d("div", Ba, [
                  d("span", Ha, [
                    d("span", {
                      style: oe({ width: `${q.value}%` })
                    }, null, 4)
                  ]),
                  d("span", Ia, c(q.value) + "%", 1)
                ]),
                d("p", Ea, c(g($a)(((a = L.value) == null ? void 0 : a.last_compaction) ?? null)), 1)
              ], 64)) : f("", !0),
              (n(!0), r(B, null, K(k.value.choices, (s) => (n(), N(ce, {
                key: s.value,
                "data-agent-choice": s.value,
                onClick: (T) => (g(p).choose(k.value.key, s), O())
              }, {
                default: A(() => [
                  v(c(s.label), 1)
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
}, Wa = /* @__PURE__ */ Z(qa, [["__scopeId", "data-v-58c7f8ed"]]), _a = ["data-agent-open", "aria-expanded", "role", "tabindex"], Fa = { class: "agent-head" }, Da = ["data-state"], Pa = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Ja = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Ua = { class: "agent-times" }, Ka = {
  key: 0,
  class: "agent-time",
  "data-agent-motion": ""
}, Za = {
  key: 1,
  class: "agent-time",
  "data-agent-motion": ""
}, Ga = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": ""
}, Ya = { class: "agent-line" }, Qa = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Xa = {
  key: 0,
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, en = {
  key: 1,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, tn = {
  key: 1,
  class: "agent-line"
}, an = {
  key: 2,
  class: "agent-line agent-work-start"
}, nn = ["data-peek"], ln = ["title"], sn = ["data-peek"], on = ["data-agent-waiting", "data-agent-stopped"], rn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(t, { emit: o }) {
    const i = { helper: "Helper", reviewer: "Reviewer" }, l = t, p = o, y = it(), C = b(() => {
      var a, s;
      if ((a = l.facts) != null && a.profile_title) return l.facts.profile_title;
      if ((s = l.facts) != null && s.profile) return l.facts.profile;
      const e = i[l.row.role] || l.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), k = b(() => {
      var e;
      return ((e = l.facts) == null ? void 0 : e.tasks) ?? [];
    }), w = b(() => k.value.filter((e) => e.state === "open")), O = b(() => {
      const e = k.value.find((a) => {
        var s;
        return a.id === ((s = l.facts) == null ? void 0 : s.task_id);
      });
      return e != null && e.plan_id ? e : w.value.find((a) => a.plan_id);
    }), $ = b(() => {
      var e, a, s, T, u;
      return l.row.role === "helper" ? ((e = l.facts) == null ? void 0 : e.helper_job) || "" : (a = l.facts) != null && a.job_enabled && (((s = l.facts) == null ? void 0 : s.task_title) || ((T = w.value[0]) == null ? void 0 : T.title) || ((u = k.value.at(-1)) == null ? void 0 : u.title)) || "";
    }), z = b(() => {
      const e = $.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return e ? `${e[1].toLowerCase() === "plan" ? "plans" : "docs"}:${e[2]}` : "";
    }), H = b(() => {
      var e, a;
      return [l.row.program, (e = l.facts) == null ? void 0 : e.model, (a = l.facts) == null ? void 0 : a.effort, l.row.role === "worker" ? `worker ${l.row.id}` : ""].filter(Boolean).join(" · ");
    }), I = fe(), _ = b(() => rt(l.row.process_started_at || l.row.created_at, y.value)), E = /* @__PURE__ */ new Set(["open", "started", "testing"]), R = b(() => !!l.row.ended_at && l.row.role !== "main" && k.value.some((e) => E.has(e.state))), L = b(() => {
      var e;
      return l.row.retired_at || l.row.state === "retired" ? "retired" : l.waitReason || R.value ? "waiting" : l.row.state === "running" && ((e = l.facts) == null ? void 0 : e.state) || l.row.state;
    }), W = b(() => {
      var e;
      return l.waitReason ? `Waiting: ${l.waitReason}` : L.value === "blocked" ? (e = l.facts) != null && e.blocked_reason ? `Blocked: ${l.facts.blocked_reason}` : "Blocked" : R.value ? "Stopped with work left" : "";
    }), F = b(() => {
      var e;
      return ((e = l.progress) == null ? void 0 : e.completed_count) ?? k.value.filter((a) => a.state === "completed").length;
    }), q = b(() => {
      var e;
      return ((e = l.progress) == null ? void 0 : e.task_count) ?? k.value.length;
    }), P = b(() => `${F.value} of ${q.value} ${q.value === 1 ? "task" : "tasks"}`), J = b(() => {
      var a;
      const e = ut(F.value, ((a = l.progress) == null ? void 0 : a.started_at) || l.row.created_at, l.progress ? l.progress.finished_at : l.row.ended_at, y.value);
      return l.row.role !== "main" && e ? `${e} per hour` : "";
    }), h = b(() => !!l.row.retired_at || l.row.state === "retired");
    return (e, a) => {
      var s, T, u;
      return n(), r("div", {
        class: X(["agent-card", { open: t.open }]),
        "data-agent-open": t.row.id,
        "aria-expanded": t.open,
        role: t.open ? void 0 : "button",
        tabindex: t.open ? void 0 : 0,
        onClick: a[4] || (a[4] = (x) => !t.open && p("toggle")),
        onKeydown: [
          a[5] || (a[5] = Oe(Q((x) => !t.open && p("toggle"), ["self", "prevent"]), ["enter"])),
          a[6] || (a[6] = Oe(Q((x) => !t.open && p("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        d("span", Fa, [
          t.open ? (n(), r("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: a[0] || (a[0] = Q((x) => p("toggle"), ["stop"]))
          }, [
            m(g(Me), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : f("", !0),
          d("span", {
            class: "agent-dot",
            "data-state": L.value,
            "data-agent-motion": ""
          }, null, 8, Da),
          d("span", Pa, c(C.value), 1),
          d("span", Ja, c(((s = t.facts) == null ? void 0 : s.given_name) || t.row.id), 1),
          t.open ? f("", !0) : (n(), N(g(Me), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          d("span", Ua, [
            h.value ? (n(), r("span", Ka, [
              a[7] || (a[7] = v("Retired, ", -1)),
              m(g(ye), {
                at: t.row.retired_at
              }, null, 8, ["at"])
            ])) : t.row.ended_at ? (n(), r("span", Za, [
              a[8] || (a[8] = v("Idle, ", -1)),
              m(g(ye), {
                at: t.row.ended_at
              }, null, 8, ["at"])
            ])) : (n(), r("span", Ga, c(_.value), 1))
          ])
        ]),
        d("span", Ya, [
          d("span", Qa, c(t.open && t.row.role === "worker" ? `worker ${t.row.id}` : t.open ? "" : H.value), 1),
          t.open ? (n(), r("span", Xa, [
            a[9] || (a[9] = v("First dispatched: ", -1)),
            m(g(ye), {
              at: t.row.created_at
            }, null, 8, ["at"])
          ])) : f("", !0),
          t.open && ((T = t.facts) != null && T.last_activity) ? (n(), r("span", en, [
            a[10] || (a[10] = v("Last heard: ", -1)),
            m(g(ye), {
              at: t.facts.last_activity
            }, null, 8, ["at"])
          ])) : f("", !0)
        ]),
        t.open ? (n(), N(Wa, {
          key: 0,
          agent: t.row,
          branch: (u = t.progress) == null ? void 0 : u.branch,
          usage: { agents: t.facts ? [t.facts] : [], windows: [] },
          card: ""
        }, {
          default: A(() => [
            t.row.role === "helper" && !t.row.ended_at ? (n(), N(g(te), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: a[1] || (a[1] = Q((x) => g(I).run(["helper", "stop", String(t.row.id)]), ["stop"]))
            }, {
              default: A(() => [...a[11] || (a[11] = [
                v("Stop", -1)
              ])]),
              _: 1
            })) : f("", !0)
          ]),
          _: 1
        }, 8, ["agent", "branch", "usage"])) : f("", !0),
        t.open && q.value && !$.value ? (n(), r("span", tn, [
          m(Le, {
            count: P.value,
            rate: J.value
          }, null, 8, ["count", "rate"])
        ])) : f("", !0),
        t.open && O.value ? (n(), r("span", an, [
          d("button", {
            type: "button",
            class: "agent-plan",
            "data-agent-plan": "",
            "data-peek": `plans:${O.value.plan_id}`,
            onClick: a[2] || (a[2] = Q((x) => g(he)(`plans:${O.value.plan_id}`), ["stop"]))
          }, "Plan " + c(O.value.plan_id) + ": " + c(O.value.plan_title), 9, nn)
        ])) : f("", !0),
        $.value || !t.open && W.value ? (n(), r("span", {
          key: 3,
          class: X(["agent-line", { "agent-work-start": !O.value }])
        }, [
          d("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: $.value
          }, [
            t.open && z.value ? (n(), r("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": z.value,
              onClick: a[3] || (a[3] = Q((x) => g(he)(z.value), ["stop"]))
            }, c($.value), 9, sn)) : (n(), r(B, { key: 1 }, [
              v(c($.value), 1)
            ], 64))
          ], 8, ln),
          !t.open && W.value ? (n(), r("span", {
            key: 0,
            class: "agent-work-status",
            "data-agent-waiting": t.waitReason ? "" : null,
            "data-agent-stopped": R.value && !t.waitReason ? "" : null
          }, c(W.value), 9, on)) : f("", !0),
          t.open && q.value ? (n(), N(Le, {
            key: 1,
            count: P.value,
            rate: J.value
          }, null, 8, ["count", "rate"])) : f("", !0)
        ], 2)) : f("", !0),
        t.open ? (n(), N(Qt, {
          key: 4,
          row: t.row,
          facts: t.facts,
          progress: t.progress,
          "wait-reason": t.waitReason,
          tasks: k.value,
          "stopped-with-work": R.value,
          open: t.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : f("", !0)
      ], 42, _a);
    };
  }
}, un = /* @__PURE__ */ Z(rn, [["__scopeId", "data-v-bfef005d"]]), dn = {
  class: "agent-limits",
  "data-agent-limits": ""
}, cn = ["aria-expanded"], gn = { key: 0 }, pn = { key: 1 }, vn = { class: "limits-panel" }, hn = { class: "limits-head" }, fn = ["data-agent-limit-type", "data-agent-limit-profile"], mn = { class: "count" }, kn = { class: "bar" }, yn = { class: "count" }, bn = { class: "bar" }, wn = ["data-agent-limit-type"], Mn = { class: "limit-field" }, $n = { class: "limit-field" }, xn = {
  key: 1,
  role: "alert"
}, Cn = {
  key: 2,
  role: "status"
}, Sn = {
  __name: "AgentLimits",
  setup(t) {
    const o = fe(), i = S([]), l = S({}), p = S(!1), y = S(!1), C = S(!1), k = S(""), w = S(""), O = (e) => e === 0 ? "no limit" : String(e), $ = (e, a) => a === 0 ? 0 : e > a ? 2 : e === a ? 1 : 0, z = b(() => i.value.flatMap((e) => e.per_profile && e.profiles.length ? e.profiles.map((a) => ({ ...a, label: a.title, type: e.key, key: `${e.key}:${a.profile}` })) : [e])), H = (e) => Math.max($(e.running, e.run_limit), $(e.kept, e.kept_limit)), I = b(() => z.value.filter((e) => H(e)).sort((e, a) => H(a) - H(e))), _ = b(() => i.value.reduce((e, a) => e + a.running, 0)), E = b(() => i.value.reduce((e, a) => e + a.kept, 0)), R = (e) => {
      const a = [e.run_limit ? e.running - e.run_limit : -1, e.kept_limit ? e.kept - e.kept_limit : -1], s = Math.max(...a);
      return s > 0 ? `Over by ${s}` : s === 0 ? "At limit" : "Within limits";
    }, L = (e, a) => a ? `${Math.min(e / Math.max(e, a) * 100, 100)}%` : "0%", W = (e, a) => a && e > a ? `${(e - a) / e * 100}%` : "0%";
    let F = 0;
    async function q() {
      const e = ++F, a = await o.read("agent limits");
      e === F && (i.value = a.ok ? a.value.rows : [], k.value = a.ok ? "" : a.error);
    }
    async function P(e) {
      const a = await Promise.all(i.value.flatMap((s) => [s.run_setting, s.kept_setting]).map(async (s) => {
        const T = await o.read(`setting show ${s}`);
        return [s, T.ok ? T.value.source : ""];
      }));
      e === F && (l.value = Object.fromEntries(a));
    }
    async function J() {
      y.value = !y.value, y.value && await P(F);
    }
    async function h(e, a, s, T) {
      if (C.value || o.readOnly) return;
      const u = Number(T.target.value);
      if (!Number.isInteger(u) || u < 0 || !T.target.value.trim()) {
        k.value = "Use a whole number of 0 or more.", T.target.value = String(s);
        return;
      }
      C.value = !0, w.value = "";
      try {
        const x = await o.run(["setting", "set", a, String(u), "--environment", o.environment]);
        if (k.value = x.ok ? "" : x.error, !x.ok) {
          T.target.value = String(s);
          return;
        }
        await q(), w.value = `${e.label} limits saved.`;
      } finally {
        C.value = !1;
      }
    }
    return o.follow(["agent.*", "setting.*"], q), q(), (e, a) => (n(), r("section", dn, [
      i.value.length ? (n(), r(B, { key: 0 }, [
        d("button", {
          class: "summary",
          type: "button",
          "aria-expanded": p.value,
          onClick: a[0] || (a[0] = (s) => p.value = !p.value)
        }, [
          I.value.length ? (n(), r(B, { key: 0 }, [
            (n(!0), r(B, null, K(I.value.slice(0, 2), (s) => (n(), r("span", {
              key: s.key,
              class: "summary-item"
            }, [
              d("span", {
                class: X(["mark", { over: H(s) === 2 }])
              }, null, 2),
              v(c(s.label) + ": " + c(R(s)), 1)
            ]))), 128)),
            I.value.length > 2 ? (n(), r("span", gn, c(I.value.length - 2) + " more", 1)) : f("", !0)
          ], 64)) : (n(), r("span", pn, "All within limits, " + c(_.value) + " running, " + c(E.value) + " kept", 1)),
          m(g(Me), {
            name: "caret",
            size: 12
          })
        ], 8, cn),
        Xe(d("div", vn, [
          d("div", hn, [
            a[1] || (a[1] = d("strong", null, "Agent limits", -1)),
            m(g(te), {
              small: "",
              disabled: C.value || g(o).readOnly,
              "data-agent-limits-edit": "",
              onClick: J
            }, {
              default: A(() => [
                v(c(y.value ? "Done" : "Edit limits"), 1)
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          y.value ? (n(), r(B, { key: 1 }, [
            (n(!0), r(B, null, K(i.value, (s) => (n(), r("div", {
              key: s.key,
              class: "edit-row",
              "data-agent-limit-type": s.key
            }, [
              d("strong", null, c(s.label), 1),
              d("label", Mn, [
                d("span", null, [
                  a[3] || (a[3] = v("Running", -1)),
                  s.per_profile ? (n(), r(B, { key: 0 }, [
                    v(" per profile")
                  ], 64)) : f("", !0)
                ]),
                m(g(Se), {
                  type: "number",
                  min: "0",
                  value: String(s.run_limit),
                  disabled: C.value || g(o).readOnly,
                  "data-agent-run-limit": s.key,
                  onChange: (T) => h(s, s.run_setting, s.run_limit, T)
                }, null, 8, ["value", "disabled", "data-agent-run-limit", "onChange"]),
                d("small", null, c(l.value[s.run_setting]), 1)
              ]),
              d("label", $n, [
                d("span", null, [
                  a[4] || (a[4] = v("Kept", -1)),
                  s.per_profile ? (n(), r(B, { key: 0 }, [
                    v(" per profile")
                  ], 64)) : f("", !0)
                ]),
                m(g(Se), {
                  type: "number",
                  min: "0",
                  value: String(s.kept_limit),
                  disabled: C.value || g(o).readOnly,
                  "data-agent-kept-limit": s.key,
                  onChange: (T) => h(s, s.kept_setting, s.kept_limit, T)
                }, null, 8, ["value", "disabled", "data-agent-kept-limit", "onChange"]),
                d("small", null, c(l.value[s.kept_setting]), 1)
              ])
            ], 8, wn))), 128)),
            d("p", null, "Running 0 starts no agents. Kept 0 means no limit. Changes apply to " + c(g(o).environment) + ".", 1)
          ], 64)) : (n(), r(B, { key: 0 }, [
            a[2] || (a[2] = d("div", { class: "table-head" }, [
              d("span", null, "Agent"),
              d("span", null, "Running"),
              d("span", null, "Kept"),
              d("span", null, "Status")
            ], -1)),
            (n(!0), r(B, null, K(z.value, (s) => (n(), r("div", {
              key: s.key,
              class: "limit-row",
              "data-agent-limit-type": s.type || s.key,
              "data-agent-limit-profile": s.profile
            }, [
              d("strong", null, c(s.label), 1),
              d("div", mn, [
                d("span", null, c(s.run_limit ? `${s.running} of ${s.run_limit}` : `${s.running} · none may start`), 1),
                d("div", kn, [
                  d("span", {
                    style: oe({ width: L(s.running, s.run_limit) })
                  }, null, 4),
                  d("i", {
                    style: oe({ width: W(s.running, s.run_limit) })
                  }, null, 4)
                ])
              ]),
              d("div", yn, [
                d("span", null, c(s.kept) + " of " + c(O(s.kept_limit)), 1),
                d("div", bn, [
                  d("span", {
                    style: oe({ width: L(s.kept, s.kept_limit) })
                  }, null, 4),
                  d("i", {
                    style: oe({ width: W(s.kept, s.kept_limit) })
                  }, null, 4)
                ])
              ]),
              d("span", {
                class: X(["status", { warning: H(s) === 1, danger: H(s) === 2 }])
              }, c(R(s)), 3)
            ], 8, fn))), 128))
          ], 64))
        ], 512), [
          [et, p.value]
        ])
      ], 64)) : f("", !0),
      k.value ? (n(), r("p", xn, c(k.value), 1)) : f("", !0),
      w.value ? (n(), r("p", Cn, c(w.value), 1)) : f("", !0)
    ]));
  }
}, An = /* @__PURE__ */ Z(Sn, [["__scopeId", "data-v-00e6a563"]]), Tn = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, jn = ["data-agent-row"], Be = "journal.agents.filters", we = "cubic-bezier(0.2, 0.9, 0.25, 1)", Rn = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(t) {
    const o = t, { rows: i } = dt("usage agents --closed", ["agent.*", "task.*", "hook_call.*", "helper_job.*"]), { rows: l } = Ve("waits"), { rows: p } = Ve("progress"), y = (j) => p.value.find((V) => V.agent_id === j.id) ?? null, C = (j) => {
      var V;
      return ((V = l.value.find((M) => M.agent_id === j.id)) == null ? void 0 : V.reason) ?? "";
    }, k = S("running"), w = S(""), O = JSON.parse(localStorage.getItem(Be) || '{"roles":[],"profiles":[],"programs":[]}'), $ = S(O), z = S({ roles: [], profiles: [], states: [], upgrade_retired: 0 }), H = S([]), I = b(() => $.value.roles.length + $.value.profiles.length + $.value.programs.length), _ = (j, V) => {
      $.value = vt($.value, j, V);
    }, E = () => {
      $.value = { roles: [], profiles: [], programs: [] };
    }, R = (j) => j.slice(0, 1).toUpperCase() + j.slice(1);
    ae($, (j) => localStorage.setItem(Be, JSON.stringify(j)));
    const L = fe();
    async function W() {
      const [j, V] = await Promise.all([L.read("agent cards --options"), L.read("agent programs")]);
      j.ok && (z.value = j.value), V.ok && (H.value = V.value.rows);
    }
    L.follow(["agent.*"], W), W();
    const F = S([]), q = S(""), P = S(!1), J = S(!1), h = S(25);
    let e = 0;
    async function a() {
      const j = ++e, V = [
        ...$.value.roles.map((D) => `--role ${JSON.stringify(D)}`),
        ...$.value.profiles.map((D) => `--profile ${JSON.stringify(D)}`),
        ...$.value.programs.map((D) => `--program ${JSON.stringify(D)}`)
      ].join(" "), M = await L.read(`${o.line} --show ${k.value} --search ${JSON.stringify(w.value)} --limit ${h.value} ${V}`);
      j === e && (F.value = M.ok ? M.value.rows : [], q.value = M.ok ? "" : M.error, J.value = M.ok && M.value.page * M.value.size < M.value.total, P.value = !0);
    }
    async function s() {
      return h.value += 25, await a(), !0;
    }
    ae([k, w, $], () => {
      h.value = 25, a();
    }), L.follow(["agent.*", "task.*", ...L.sources.flatMap((j) => j.events)], Ne(a, qe.pageOfAgents)), a();
    const T = (j) => i.value.find((V) => V.id === j.id) ?? j.facts ?? null, u = F, x = b(() => !!w.value.trim() || I.value > 0), U = b(() => o.texts[k.value] ?? { title: o.empty, hint: "" }), Y = S(null), ne = S(null), ge = S(null), le = b(() => u.value.find((j) => j.id === Y.value) ?? null), xe = b(() => le.value ? [le.value] : u.value), ie = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let re = !1, Te = 0;
    async function Fe(j) {
      if (re) return;
      re = !0, Te = ge.value.scrollTop;
      const V = ne.value.querySelector(`[data-agent-open="${j.id}"]`);
      if (!ie()) {
        const se = [...ne.value.querySelectorAll(".agent-row")].filter((ee) => !ee.contains(V));
        await Promise.all(se.map((ee) => ee.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const M = [...V.querySelectorAll(".agent-head, .agent-line")], D = [...M, ...V.querySelectorAll("[data-agent-motion]")], me = D.map((se) => se.getBoundingClientRect());
      if (Y.value = j.id, await ze(), !ie()) {
        const se = D.map((ee) => ee.getBoundingClientRect());
        D.forEach((ee, ke) => {
          const ue = M.indexOf(ee.parentElement), Pe = me[ke].left - se[ke].left - (ue < 0 ? 0 : me[ue].left - se[ue].left), Je = me[ke].top - se[ke].top - (ue < 0 ? 0 : me[ue].top - se[ue].top);
          ee.animate([{ transform: `translate(${Pe}px, ${Je}px)` }, { transform: "none" }], { duration: 280, easing: we });
        }), ne.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((ee) => {
          ee.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: we, fill: "backwards" });
        });
      }
      re = !1;
    }
    async function je() {
      if (re || !le.value) return;
      re = !0;
      const j = ne.value.querySelector(`[data-agent-open="${Y.value}"]`), V = [...j.children], M = ie() ? [] : V.map((D) => D.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(M.map((D) => D.finished)), Y.value = null, await ze(), ge.value.scrollTop = Te, M.forEach((D) => D.cancel()), ie() || (j.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: we }), ne.value.querySelectorAll(".agent-row").forEach((D) => {
        D.contains(j) || D.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: we });
      })), re = !1;
    }
    const De = (j) => Y.value === j.id ? je() : Fe(j);
    ae(w, (j) => j.trim() && (Y.value = null)), ae(k, () => {
      Y.value = null;
    });
    const Re = (j) => {
      j.key === "Escape" && je();
    };
    return window.addEventListener("keydown", Re), $e(() => window.removeEventListener("keydown", Re)), (j, V) => (n(), r("div", {
      ref_key: "agents",
      ref: ne,
      class: X(["agents", { focused: le.value }])
    }, [
      m(An),
      m(g(ct), {
        modelValue: w.value,
        "onUpdate:modelValue": V[1] || (V[1] = (M) => w.value = M),
        placeholder: "Search agents",
        "menu-count": I.value,
        "data-agents-search": ""
      }, {
        menu: A(() => [
          m(g(Ce), null, {
            default: A(() => [...V[2] || (V[2] = [
              v("Type", -1)
            ])]),
            _: 1
          }),
          (n(!0), r(B, null, K(z.value.roles, (M) => (n(), N(g(be), {
            key: M,
            role: "menuitemcheckbox",
            "aria-checked": $.value.roles.includes(M),
            checked: $.value.roles.includes(M),
            "data-filter-role": M,
            onClick: (D) => _("roles", M)
          }, {
            default: A(() => [
              v(c(R(M)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          z.value.profiles.length ? (n(), N(g(Ce), { key: 0 }, {
            default: A(() => [...V[3] || (V[3] = [
              v("Profile", -1)
            ])]),
            _: 1
          })) : f("", !0),
          (n(!0), r(B, null, K(z.value.profiles, (M) => (n(), N(g(be), {
            key: M.name,
            role: "menuitemcheckbox",
            "aria-checked": $.value.profiles.includes(M.name),
            checked: $.value.profiles.includes(M.name),
            "data-filter-profile": M.name,
            onClick: (D) => _("profiles", M.name)
          }, {
            default: A(() => [
              v(c(M.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          m(g(Ce), null, {
            default: A(() => [...V[4] || (V[4] = [
              v("Program", -1)
            ])]),
            _: 1
          }),
          (n(!0), r(B, null, K(H.value, (M) => (n(), N(g(be), {
            key: M.name,
            role: "menuitemcheckbox",
            "aria-checked": $.value.programs.includes(M.name),
            checked: $.value.programs.includes(M.name),
            "data-filter-program": M.name,
            onClick: (D) => _("programs", M.name)
          }, {
            default: A(() => [
              v(c(M.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          I.value ? (n(), N(g(be), {
            key: 1,
            "data-filter-clear": "",
            onClick: E
          }, {
            default: A(() => [...V[5] || (V[5] = [
              v("Clear filters", -1)
            ])]),
            _: 1
          })) : f("", !0)
        ]),
        default: A(() => [
          m(g(gt), {
            options: z.value.states,
            value: k.value,
            onPick: V[0] || (V[0] = (M) => k.value = M)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      k.value === "retired" && z.value.upgrade_retired ? (n(), r("p", Tn, "Retired during the upgrade: " + c(z.value.upgrade_retired), 1)) : f("", !0),
      d("div", {
        ref_key: "list",
        ref: ge,
        class: X(["agents-view", { "agents-view-open": le.value }])
      }, [
        P.value && !q.value && !xe.value.length && I.value ? (n(), N(g(Ae), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: A(() => [
            m(g(te), {
              small: "",
              "data-empty-clear": "",
              onClick: E
            }, {
              default: A(() => [...V[6] || (V[6] = [
                v("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (n(), N(g(pt), {
          key: 1,
          rows: xe.value,
          failure: q.value,
          loaded: P.value,
          more: !le.value && J.value,
          older: s,
          empty: U.value.title,
          hint: U.value.hint,
          searching: x.value
        }, {
          default: A(({ row: M }) => [
            d("div", {
              class: "agent-row",
              "data-agent-row": M.id
            }, [
              m(un, {
                row: M,
                facts: T(M),
                progress: y(M),
                "wait-reason": C(M),
                open: M.id === Y.value,
                onToggle: (D) => De(M)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, jn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, Ln = /* @__PURE__ */ Z(Rn, [["__scopeId", "data-v-9158c96c"]]);
export {
  Ln as A
};
