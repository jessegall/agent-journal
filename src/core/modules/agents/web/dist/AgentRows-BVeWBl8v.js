/* @code-commandments-generated */
import { openBlock as n, createElementBlock as r, withModifiers as Q, unref as g, createTextVNode as h, toDisplayString as c, createVNode as y, createBlock as W, withCtx as A, Fragment as L, renderList as K, createElementVNode as d, createCommentVNode as m, ref as S, computed as b, watch as ae, defineAsyncComponent as Je, onUnmounted as Me, createSlots as Ue, resolveDynamicComponent as Ke, normalizeStyle as oe, normalizeClass as X, renderSlot as pe, onMounted as Le, Teleport as Ze, mergeProps as Ge, toRef as Ye, withKeys as Oe, withDirectives as Qe, vShow as Xe, nextTick as ze } from "vue";
import { peekRef as he, Icon as we, RunningCommand as et, FoldGroup as Be, TaskStatusIcon as tt, Btn as te, TextArea as at, TextInput as Se, useWindow as me, SwitchCase as Ie, loadWindowComponent as nt, coalesced as Ee, READ_RATES as Ne, InnerTabs as lt, TabBody as st, EmptyState as Ae, useNow as ot, age as it, perHour as rt, TimeAgo as $e, useRows as ut, useDeclaredRows as Ve, SearchBar as dt, Segmented as ct, MenuLabel as Ce, MenuItem as ye, RowList as gt, toggleFilter as vt } from "@journal/window-kit";
import { _ as G, T as pt } from "./TranscriptRows-ByPSYos4.js";
const ht = {
  class: "agent-command",
  "data-agent-command": ""
}, mt = {
  key: 1,
  "data-agent-stopped": ""
}, ft = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(t) {
    return (o, i) => (n(), r("span", ht, [
      t.waitReason ? (n(), r("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: i[0] || (i[0] = Q((l) => g(he)("test_queue:0"), ["stop"]))
      }, [
        h("Waiting: " + c(t.waitReason) + " ", 1),
        y(g(we), {
          name: "arrow",
          size: 11
        })
      ])) : t.stopped ? (n(), r("span", mt, "Waiting")) : (n(), W(g(et), {
        key: 2,
        text: t.command,
        idle: t.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, kt = /* @__PURE__ */ G(ft, [["__scopeId", "data-v-1b371fb5"]]), yt = ["data-agent-delegated", "onClick"], bt = { class: "agent-task-number" }, wt = { class: "agent-task-title" }, Mt = ["title"], xt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(t, { emit: o }) {
    const i = o;
    return (l, v) => (n(), W(g(Be), {
      label: t.section.label,
      count: t.section.tasks.length,
      open: t.open,
      "data-agent-section": t.section.state,
      onToggle: v[0] || (v[0] = (k) => i("toggle"))
    }, {
      default: A(() => [
        (n(!0), r(L, null, K(t.section.tasks, (k) => (n(), r("button", {
          key: k.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": k.id,
          onClick: (C) => g(he)(`tasks:${k.id}`)
        }, [
          y(g(tt), {
            status: k.state
          }, null, 8, ["status"]),
          d("span", bt, c(k.id), 1),
          d("span", wt, c(k.title), 1),
          k.plan_id ? (n(), r("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${k.plan_id}: ${k.plan_title}`
          }, "Plan " + c(k.plan_id) + ": " + c(k.plan_title), 9, Mt)) : m("", !0)
        ], 8, yt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, $t = /* @__PURE__ */ G(xt, [["__scopeId", "data-v-238ff959"]]), Ct = { class: "action-field" }, St = ["value", "disabled"], At = ["value"], jt = { key: 1 }, Rt = {
  key: 1,
  class: "action-field"
}, Tt = { class: "action-buttons" }, Ot = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(t) {
    return (o, i) => (n(), r("form", {
      onSubmit: i[4] || (i[4] = Q((l) => o.$emit("submit"), ["prevent"]))
    }, [
      t.row.job_task_flag ? (n(), r(L, { key: 0 }, [
        d("label", Ct, [
          i[6] || (i[6] = h("Task ", -1)),
          d("select", {
            value: t.task,
            disabled: t.pending || t.loading,
            "data-agent-job-task": "",
            onChange: i[0] || (i[0] = (l) => o.$emit("update:task", l.target.value))
          }, [
            i[5] || (i[5] = d("option", { value: "" }, "Choose an open task", -1)),
            (n(!0), r(L, null, K(t.tasks, (l) => (n(), r("option", {
              key: l.id,
              value: String(l.id)
            }, c(l.id) + ": " + c(l.title), 9, At))), 128))
          ], 40, St)
        ]),
        t.moreTasks ? (n(), W(g(te), {
          key: 0,
          small: "",
          disabled: t.pending || t.loading,
          "data-agent-more-tasks": "",
          onClick: i[1] || (i[1] = (l) => o.$emit("more"))
        }, {
          default: A(() => [...i[7] || (i[7] = [
            h("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : m("", !0),
        !t.loading && !t.tasks.length && !t.failure ? (n(), r("p", jt, "No open tasks.")) : m("", !0)
      ], 64)) : (n(), r("label", Rt, [
        i[8] || (i[8] = h("Job", -1)),
        y(g(at), {
          value: t.text,
          disabled: t.pending,
          "data-agent-job-text": "",
          onInput: i[2] || (i[2] = (l) => o.$emit("update:text", l.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      d("div", Tt, [
        y(g(te), {
          type: "submit",
          small: "",
          disabled: t.pending || !t.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: A(() => [...i[9] || (i[9] = [
            h("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        y(g(te), {
          small: "",
          disabled: t.pending,
          onClick: i[3] || (i[3] = (l) => o.$emit("cancel"))
        }, {
          default: A(() => [...i[10] || (i[10] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, zt = /* @__PURE__ */ G(Ot, [["__scopeId", "data-v-adde4158"]]), Vt = { class: "action-buttons" }, Ht = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(t) {
    return (o, i) => (n(), r("form", {
      "data-agent-retire-confirm": "",
      onSubmit: i[2] || (i[2] = Q((l) => o.$emit("submit"), ["prevent"]))
    }, [
      i[5] || (i[5] = d("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      y(g(Se), {
        "model-value": t.reason,
        label: "Reason",
        disabled: t.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": i[0] || (i[0] = (l) => o.$emit("update:reason", l))
      }, null, 8, ["model-value", "disabled"]),
      d("div", Vt, [
        y(g(te), {
          type: "submit",
          small: "",
          disabled: t.pending || !t.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: A(() => [...i[3] || (i[3] = [
            h("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        y(g(te), {
          small: "",
          disabled: t.pending,
          onClick: i[1] || (i[1] = (l) => o.$emit("cancel"))
        }, {
          default: A(() => [...i[4] || (i[4] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Lt = /* @__PURE__ */ G(Ht, [["__scopeId", "data-v-23a905c0"]]), Bt = { class: "action-buttons" }, It = {
  key: 0,
  role: "alert"
}, Et = {
  key: 1,
  role: "status"
}, Nt = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(t) {
    const o = t, i = me(), l = S(""), v = S(""), k = S(""), C = S(""), f = S([]), w = S(0), O = S(!1), x = S(!1), z = S(!1), B = S(""), I = S(""), F = b(() => !!o.row.retired_at || o.row.state === "retired"), E = b(() => !F.value && !!o.row.ended_at), T = b(() => {
      var e;
      return E.value && ((e = o.row.job_command) == null ? void 0 : e.length) && !o.row.resume_reason;
    }), H = b(() => T.value && !x.value && (o.row.job_task_flag ? f.value.some((e) => String(e.id) === C.value) : !!v.value.trim()));
    function q(e) {
      l.value = e, v.value = "", k.value = "", C.value = "", B.value = "", I.value = "";
    }
    async function D() {
      q("job"), o.row.job_task_flag && (f.value = [], w.value = 0, O.value = !1, await N());
    }
    async function N() {
      if (!x.value) {
        x.value = !0;
        try {
          const e = await i.read(`task list --state open --limit 100 --page ${w.value + 1}`);
          B.value = e.ok ? "" : e.error, e.ok && (f.value = [...f.value, ...e.value.rows], w.value = e.value.page, O.value = e.value.page * e.value.size < e.value.total);
        } finally {
          x.value = !1;
        }
      }
    }
    async function _(e, a) {
      if (!z.value) {
        z.value = !0, B.value = "";
        try {
          const s = await i.run(e);
          B.value = s.ok ? "" : s.error, s.ok && (q(""), I.value = a);
        } finally {
          z.value = !1;
        }
      }
    }
    async function U() {
      if (!H.value) return;
      const e = o.row.job_task_flag ? [o.row.job_task_flag, C.value] : [v.value.trim()];
      await _([...o.row.job_command, String(o.row.id), ...e], "Job sent.");
    }
    async function p() {
      !E.value || l.value !== "retire" || !k.value.trim() || await _(["agent", "retire", String(o.row.id), "--reason", k.value.trim()], "Agent retired permanently.");
    }
    return (e, a) => {
      var s;
      return F.value ? m("", !0) : (n(), r("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: a[6] || (a[6] = Q(() => {
        }, ["stop"])),
        onKeydown: a[7] || (a[7] = Q(() => {
        }, ["stop"]))
      }, [
        d("div", Bt, [
          E.value ? (n(), r(L, { key: 0 }, [
            (s = t.row.job_command) != null && s.length ? (n(), W(g(te), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: z.value || x.value || !T.value,
              onClick: D
            }, {
              default: A(() => [...a[8] || (a[8] = [
                h("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0),
            t.row.role !== "main" ? (n(), W(g(te), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: z.value || x.value,
              onClick: a[0] || (a[0] = (j) => q("retire"))
            }, {
              default: A(() => [...a[9] || (a[9] = [
                h("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0)
          ], 64)) : m("", !0)
        ]),
        y(g(Ie), { value: l.value }, {
          job: A(() => [
            y(zt, {
              task: C.value,
              "onUpdate:task": a[1] || (a[1] = (j) => C.value = j),
              text: v.value,
              "onUpdate:text": a[2] || (a[2] = (j) => v.value = j),
              row: t.row,
              tasks: f.value,
              pending: z.value,
              loading: x.value,
              "more-tasks": O.value,
              failure: B.value,
              "job-ready": H.value,
              onSubmit: U,
              onMore: N,
              onCancel: a[3] || (a[3] = (j) => q(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: A(() => [
            y(Lt, {
              reason: k.value,
              "onUpdate:reason": a[4] || (a[4] = (j) => k.value = j),
              pending: z.value,
              onSubmit: p,
              onCancel: a[5] || (a[5] = (j) => q(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        B.value ? (n(), r("p", It, c(B.value), 1)) : m("", !0),
        I.value ? (n(), r("p", Et, c(I.value), 1)) : m("", !0)
      ], 32));
    };
  }
}, Wt = /* @__PURE__ */ G(Nt, [["__scopeId", "data-v-da5113a2"]]), qt = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Ft = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Dt = {
  key: 2,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, Pt = {
  key: 4,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, _t = ["data-peek", "onClick"], Jt = {
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
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean, totalCount: Number, tasksPerHour: String },
  setup(t) {
    const o = t, i = ["started", "blocked", "open", "completed"], l = b(() => {
      var e, a;
      return o.row.ended_at && ((a = (e = o.facts) == null ? void 0 : e.job_returned) != null && a.startsWith(Gt)) ? o.facts.job_returned : "";
    }), v = b(() => o.tasks.length ? i.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: o.tasks.filter((a) => a.state === e || e === "started" && a.state === "testing" || e === "completed" && a.state === "cancelled") })) : []), k = /* @__PURE__ */ new Set(["completed"]), C = S({}), f = (e) => !(C.value[e] ?? k.has(e)), w = (e) => C.value = { ...C.value, [e]: f(e) }, O = me(), { rows: x } = O.props.reports;
    O.state["reports.agent"] = String(o.row.id), O.reload("reports");
    const z = b(() => o.row.access === "read-only"), B = b(() => !!o.row.retired_at || o.row.state === "retired"), I = ["tasks", "transcript", "terminal", "file-feed", "reports"], F = b(() => (B.value ? O.tabs.filter((a) => ["reports", "transcript"].includes(a.key)) : z.value ? O.tabs.filter((a) => ["reports", "transcript", "terminal"].includes(a.key)) : [...O.tabs]).sort((a, s) => (I.indexOf(a.key) < 0 ? I.length : I.indexOf(a.key)) - (I.indexOf(s.key) < 0 ? I.length : I.indexOf(s.key)))), E = () => z.value || B.value ? F.value.find((e) => e.key === "transcript") : F.value[0], T = S(E());
    ae(F, (e) => {
      e.some((a) => {
        var s;
        return a.key === ((s = T.value) == null ? void 0 : s.key);
      }) || (T.value = e[0]);
    }), ae(() => o.open, (e) => {
      e && (T.value = E());
    });
    const H = Object.fromEntries(O.tabs.filter((e) => e.component).map((e) => [e.key, Je(() => nt(e.component))])), q = S(!1), D = S(""), N = S(""), _ = b(() => o.row.role !== "main" && (!o.row.ended_at || o.stoppedWithWork || o.waitReason));
    async function U() {
      if (!o.open || !_.value) return;
      const e = await O.read(`usage tool --agent ${o.row.id}`, { deferred: !0 });
      o.open && (D.value = e.ok ? e.value.tool : "", N.value = e.ok ? e.value.note : "");
    }
    const p = O.follow(["hook_call.*", "process_part.*"], Ee(U, Ne.agentCommand));
    return Me(() => p == null ? void 0 : p()), ae(() => o.open, (e) => {
      e && U();
    }, { immediate: !0 }), (e, a) => {
      var s;
      return n(), r("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: a[2] || (a[2] = Q(() => {
        }, ["stop"]))
      }, [
        t.row.retirement_reason ? (n(), r("p", qt, "Retirement reason: " + c(t.row.retirement_reason), 1)) : m("", !0),
        t.row.resume_reason ? (n(), r("p", Ft, c(t.row.resume_reason), 1)) : m("", !0),
        y(Wt, { row: t.row }, null, 8, ["row"]),
        t.totalCount && t.tasksPerHour ? (n(), r("span", Dt, c(t.tasksPerHour), 1)) : m("", !0),
        _.value ? (n(), W(kt, {
          key: 3,
          class: "agent-command",
          "wait-reason": t.waitReason,
          stopped: t.stoppedWithWork,
          command: D.value,
          note: N.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0),
        l.value ? (n(), r("p", Pt, c(l.value), 1)) : m("", !0),
        y(g(lt), {
          class: "agent-tabs",
          tabs: F.value,
          active: T.value,
          answer: { tasks: t.tasks.length, reports: g(x).length },
          onChoose: a[0] || (a[0] = (j) => T.value = j)
        }, null, 8, ["tabs", "active", "answer"]),
        y(g(st), {
          class: "agent-tab-body",
          tab: T.value,
          "data-agent-tab-body": (s = T.value) == null ? void 0 : s.key
        }, {
          default: A(() => {
            var j;
            return [
              y(g(Ie), {
                value: (j = T.value) == null ? void 0 : j.key
              }, Ue({
                reports: A(() => [
                  g(x).length ? m("", !0) : (n(), W(g(Ae), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: A(() => [...a[3] || (a[3] = [
                      h("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (n(!0), r(L, null, K(g(x), (u) => (n(), r("button", {
                    key: u.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${u.id}`,
                    onClick: ($) => g(he)(`messages:${u.id}`)
                  }, c(u.text), 9, _t))), 128))
                ]),
                tasks: A(() => {
                  var u;
                  return [
                    t.tasks.length ? m("", !0) : (n(), W(g(Ae), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: A(() => [...a[4] || (a[4] = [
                        h("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (n(!0), r(L, null, K(v.value, ($) => (n(), W($t, {
                      key: $.state,
                      section: $,
                      open: f($.state),
                      onToggle: (J) => w($.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (u = t.facts) != null && u.instruction ? (n(), r(L, { key: 1 }, [
                      a[5] || (a[5] = d("p", { class: "agent-label" }, "Instruction", -1)),
                      d("div", Jt, c(t.facts.instruction), 1)
                    ], 64)) : m("", !0)
                  ];
                }),
                transcript: A(() => {
                  var u;
                  return [
                    z.value ? (n(), r(L, { key: 0 }, [
                      (u = t.facts) != null && u.instruction ? (n(), r("div", Ut, [
                        y(g(Be), {
                          label: "Instruction",
                          open: q.value,
                          "data-agent-section": "instruction",
                          onToggle: a[1] || (a[1] = ($) => q.value = !q.value)
                        }, {
                          default: A(() => [
                            d("div", Kt, c(t.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : t.facts && t.row.ended_at ? (n(), r("p", Zt, "No job recorded")) : m("", !0)
                    ], 64)) : m("", !0),
                    y(pt, {
                      line: `agent transcript ${t.row.id}`,
                      padding: "0"
                    }, null, 8, ["line"])
                  ];
                }),
                _: 2
              }, [
                K(g(H), (u, $) => ({
                  name: $,
                  fn: A(() => [
                    (n(), W(Ke(u), {
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
}, Qt = /* @__PURE__ */ G(Yt, [["__scopeId", "data-v-03657a61"]]), Xt = ["stroke-width", "innerHTML"], Z = {
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
    return (k, C) => (n(), r("svg", {
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
      innerHTML: v[l[t.name] || t.name] || v.dot
    }, null, 12, Xt));
  }
}, ea = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, ta = {
  key: 1,
  class: "menu-item-text"
}, aa = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(t) {
    return (o, i) => (n(), r("button", {
      type: "button",
      class: X(["menu-item", { on: t.on, danger: t.danger, described: t.description }])
    }, [
      t.checked !== null ? (n(), r("span", ea, c(t.checked ? "✓" : ""), 1)) : m("", !0),
      t.description ? (n(), r("span", ta, [
        d("span", null, [
          pe(o.$slots, "default", {}, void 0, !0)
        ]),
        d("small", null, c(t.description), 1)
      ])) : pe(o.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ce = /* @__PURE__ */ G(aa, [["__scopeId", "data-v-fec99974"]]), na = {}, la = { class: "menu-label" };
function sa(t, o) {
  return n(), r("span", la, [
    pe(t.$slots, "default", {}, void 0, !0)
  ]);
}
const ve = /* @__PURE__ */ G(na, [["render", sa], ["__scopeId", "data-v-aa955b3e"]]), oa = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, ia = {
  key: 0,
  class: "skills-none"
}, ra = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(t, { emit: o }) {
    const i = t, l = o, v = b(() => i.skills.filter((C) => C.state === "loaded")), k = b(() => i.skills.filter((C) => C.state !== "loaded"));
    return (C, f) => (n(), r("div", oa, [
      y(ve, null, {
        default: A(() => [...f[1] || (f[1] = [
          h("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      v.value.length ? m("", !0) : (n(), r("p", ia, "None yet. Compacting the conversation empties this list.")),
      (n(!0), r(L, null, K(v.value, (w) => (n(), r("p", {
        key: w.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        y(Z, {
          name: "book",
          size: 12
        }),
        h(c(w.skill), 1)
      ]))), 128)),
      k.value.length ? (n(), r(L, { key: 1 }, [
        y(ve, null, {
          default: A(() => [...f[2] || (f[2] = [
            h("Still to read", -1)
          ])]),
          _: 1
        }),
        (n(!0), r(L, null, K(k.value, (w) => (n(), r("p", {
          key: w.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          y(Z, {
            name: "book",
            size: 12
          }),
          h(c(w.skill), 1)
        ]))), 128))
      ], 64)) : m("", !0),
      y(ce, {
        "data-agent-skills-browse": "",
        onClick: f[0] || (f[0] = (w) => l("browse"))
      }, {
        default: A(() => [...f[3] || (f[3] = [
          h("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, ua = /* @__PURE__ */ G(ra, [["__scopeId", "data-v-be514d47"]]), da = (t, o, i) => Math.max(o, Math.min(i, t)), We = /* @__PURE__ */ new WeakMap(), ca = (t, o) => We.set(t, o);
function ga(t, o) {
  for (let i = o; i; i = We.get(i) ?? i.parentElement) if (i === t) return !0;
  return !1;
}
function va(t, o) {
  const i = (l) => {
    var k, C;
    const v = ((k = t.value) == null ? void 0 : k.element) || ((C = t.value) == null ? void 0 : C.$el) || t.value;
    v && !ga(v, l.target) && o(l);
  };
  window.addEventListener("click", i), Me(() => window.removeEventListener("click", i));
}
const de = 8, pa = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const l = t, v = S(null), k = (u) => u ? `${u}px` : void 0, C = b(() => ({
      minWidth: k(l.minWidth),
      maxWidth: k(l.maxWidth),
      maxHeight: k(l.maxHeight),
      height: k(l.height)
    })), f = S({ w: 0, h: 0 }), w = S(l.anchor ? l.anchor.getBoundingClientRect() : null), O = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), x = (u) => ({
      left: Math.max(0, u.left),
      top: Math.max(0, u.top),
      right: Math.min(window.innerWidth, u.right),
      bottom: Math.min(window.innerHeight, u.bottom)
    }), z = (u) => {
      const $ = u.closest(".pane, .float-window");
      return $ ? x($.getBoundingClientRect()) : O();
    }, B = (u, $) => `${Math.max(0, u ? Math.min(u, $) : $)}px`;
    function I(u, $) {
      return {
        below: u.bottom - $.bottom - l.gap - de,
        above: $.top - u.top - l.gap - de,
        across: u.right - u.left - 2 * de
      };
    }
    function F(u) {
      const $ = z(l.anchor), J = I($, u);
      return f.value.w <= J.across && f.value.h <= Math.max(J.below, J.above) ? $ : O();
    }
    const E = b(() => {
      if (!w.value) return C.value;
      const u = w.value, $ = F(u), J = I($, u), { w: Y, h: ne } = f.value, ge = l.align === "auto" ? u.left + u.right > $.left + $.right : l.align === "right", le = da(ge ? u.right - Y : u.left, $.left + de, Math.max($.left + de, $.right - Y - de)), ie = ne > J.below && J.above > J.below ? { bottom: `${window.innerHeight - u.top + l.gap}px`, maxHeight: B(l.maxHeight, J.above) } : { top: `${u.bottom + l.gap}px`, maxHeight: B(l.maxHeight, J.below) };
      return { ...C.value, ...ie, left: `${le}px`, maxWidth: B(l.maxWidth, J.across) };
    }), T = i, H = () => [...v.value.querySelectorAll("button:not(:disabled)")];
    function q(u) {
      const $ = H(), J = $.indexOf(document.activeElement);
      $[(J + u + $.length) % $.length].focus();
    }
    const D = { ArrowDown: () => q(1), ArrowUp: () => q(-1), Escape: () => T("close") }, N = (u) => D[u.key] && (u.preventDefault(), D[u.key]()), _ = () => v.value && (f.value = { w: v.value.offsetWidth, h: v.value.scrollHeight });
    let U = 0;
    const p = new ResizeObserver(() => {
      cancelAnimationFrame(U), U = requestAnimationFrame(_);
    });
    va(v, (u) => l.anchor && !l.anchor.contains(u.target) && T("close"));
    const e = (u, $) => ["top", "left", "right", "bottom"].some((J) => Math.abs(u[J] - $[J]) > 1), a = (u) => u.bottom < 0 || u.top > window.innerHeight;
    let s = 0;
    function j() {
      if (l.anchor) {
        const u = l.anchor.getBoundingClientRect();
        if (!l.anchor.isConnected || a(u)) return T("close");
        e(u, w.value) && (w.value = u);
      }
      s = requestAnimationFrame(j);
    }
    return Le(() => {
      l.anchor && v.value && ca(v.value, l.anchor), _(), v.value && p.observe(v.value), !l.plain && H()[0] && H()[0].focus(), j();
    }), Me(() => {
      p.disconnect(), cancelAnimationFrame(s), cancelAnimationFrame(U);
    }), o({ element: v }), (u, $) => (n(), W(Ze, {
      to: "body",
      disabled: !t.anchor
    }, [
      d("div", Ge({
        ref_key: "panel",
        ref: v
      }, u.$attrs, {
        class: ["menu-panel", { anchored: t.anchor }],
        style: E.value,
        onKeydown: N
      }), [
        pe(u.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ha = /* @__PURE__ */ G(pa, [["__scopeId", "data-v-3d203970"]]);
async function ma(t, o, i) {
  if (!t) return i(o);
  const { target: l, fields: v } = t, k = Object.fromEntries(Object.keys(v).map((w) => [w, l[w]])), C = () => Object.assign(l, k);
  Object.assign(l, v);
  let f = !1;
  try {
    const w = await i(o);
    return f = w.ok, w;
  } finally {
    f || C();
  }
}
function fa(t, o, i) {
  const l = S([]), v = S([]), k = S({}), C = S(""), f = S(!1), w = b(() => !!t.value && !t.value.ended_at), O = b(() => w.value && !!t.value.paused_at);
  async function x() {
    if (w.value) {
      const T = await o(["agent", "controls", String(t.value.id)]);
      l.value = T.ok ? T.value.groups : [];
      return;
    }
    const E = await o(["agent", "programs"]);
    v.value = E.ok ? E.value.rows : [];
  }
  async function z(E, T = null) {
    C.value = "";
    const H = await ma(T, E, o);
    return C.value = H.ok ? "" : H.error, i(), H;
  }
  const B = (E, T) => z(["agent", "control", String(t.value.id), E, T.value], { target: k, fields: { value: { ...k.value, [E]: T.label } } }), I = () => (f.value = !1, z(["agent", "stop", String(t.value.id)], { target: t.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), F = (E) => z(["agent", "launch", E.name]);
  return Le(x), ae(w, x), { groups: l, programs: v, chosen: k, failure: C, asking: f, running: w, paused: O, choose: B, stop: I, start: F };
}
const qe = { claude: "Claude Code", codex: "Codex" };
Object.entries(qe).map(([t, o]) => ({ key: t, label: o }));
function ka(t, o = "agent") {
  return qe[t] || o;
}
function ya(t) {
  if (!t) return "Not compacted yet";
  const o = new Date(t.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return t.start_percent === null ? `Last compacted ${o}` : t.end_percent === null ? `Last compacted ${o}, from ${t.start_percent}%` : `Last compacted ${o}, from ${t.start_percent}% to ${t.end_percent}%, ${t.start_percent - t.end_percent}% taken off`;
}
const ba = ["disabled", "title"], wa = ["title"], Ma = { class: "gauge usage" }, xa = ["disabled", "title"], $a = { class: "gauge" }, Ca = ["disabled", "title"], Sa = ["disabled"], Aa = ["disabled"], ja = {
  key: 5,
  class: "fact",
  "data-fact": "uptime",
  title: "How long this session has run"
}, Ra = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Ta = ["title"], Oa = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, za = { class: "gauge" }, Va = { class: "context-used" }, Ha = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, La = 75, Ba = {
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
    const i = t, l = o, v = fa(Ye(i, "agent"), i.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => l("changed")), k = S(null), C = S(""), f = b(() => v.groups.value.find((p) => p.key === C.value));
    function w(p, e) {
      k.value = p.currentTarget, C.value = e;
    }
    function O() {
      k.value = null, C.value = "", v.asking.value = !1;
    }
    const x = S([]), z = b(() => x.value.filter((p) => p.state === "loaded"));
    async function B() {
      const p = i.agent && i.run ? await i.run(["agent-skill", "list", "--agent", String(i.agent.id)]) : null;
      x.value = p != null && p.ok ? p.value.rows ?? [] : [];
    }
    function I(p) {
      w(p, "skills"), B();
    }
    ae(() => {
      var p;
      return (p = i.agent) == null ? void 0 : p.id;
    }, B, { immediate: !0 });
    const F = (p) => v.groups.value.some((e) => e.key === p), E = b(() => {
      var p;
      return v.chosen.value.model ?? ((p = H.value) == null ? void 0 : p.model) ?? "";
    }), T = b(() => {
      var p;
      return v.chosen.value.effort ?? ((p = H.value) == null ? void 0 : p.effort) ?? "";
    });
    b(() => !!i.agent && !i.agent.ended_at);
    const H = b(() => {
      var p;
      return ((p = i.usage.agents) == null ? void 0 : p.find((e) => {
        var a;
        return e.id === ((a = i.agent) == null ? void 0 : a.id);
      })) ?? null;
    }), q = b(() => {
      var p;
      return ((p = i.usage.windows) == null ? void 0 : p[0]) ?? null;
    }), D = b(() => q.value ? Math.max(0, Math.min(100, Math.round(q.value.used_percent))) : null), N = b(() => {
      var p;
      return ((p = H.value) == null ? void 0 : p.context_percent) == null ? null : Math.round(H.value.context_percent);
    }), _ = b(() => {
      var p;
      return (p = H.value) != null && p.cost_dollars ? `$${H.value.cost_dollars.toFixed(2)}` : "";
    }), U = b(() => {
      var a;
      const p = (a = i.agent) != null && a.process_started_at ? new Date(i.agent.process_started_at).getTime() : 0;
      if (!p) return "";
      const e = Math.max(0, Math.floor((i.now - p) / 6e4));
      return e >= 60 ? `${Math.floor(e / 60)}h ${e % 60}m` : `${e}m`;
    });
    return (p, e) => (n(), r("div", {
      class: X(["information", { card: t.card }]),
      "data-information-bar": ""
    }, [
      t.agent ? (n(), r(L, { key: 0 }, [
        d("button", {
          type: "button",
          class: "fact lead",
          disabled: t.card,
          "data-fact": "agent",
          title: `Session ${t.agent.session}: stop it`,
          onClick: e[0] || (e[0] = (a) => w(a, "agent"))
        }, [
          y(Z, {
            name: "agents",
            size: 12
          }),
          h(" " + c(g(ka)(t.agent.program)), 1)
        ], 8, ba),
        D.value !== null ? (n(), r("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${D.value}% of the plan's ${q.value.title} allowance used`,
          onClick: e[1] || (e[1] = (a) => l("open", "usage", a.currentTarget))
        }, [
          y(Z, {
            name: "clock",
            size: 12
          }),
          e[14] || (e[14] = h()),
          d("span", Ma, [
            d("span", {
              style: oe({ width: `${D.value}%` })
            }, null, 4)
          ]),
          h(" " + c(D.value) + "% ", 1)
        ], 8, wa)) : m("", !0),
        N.value !== null ? (n(), r("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: t.card,
          "data-fact": "context",
          title: `Context ${N.value}% full: clear or compact it`,
          onClick: e[2] || (e[2] = (a) => F("context") ? w(a, "context") : l("open", "context", a.currentTarget))
        }, [
          y(Z, {
            name: "gauge",
            size: 12
          }),
          e[15] || (e[15] = h()),
          d("span", $a, [
            d("span", {
              style: oe({ width: `${N.value}%` })
            }, null, 4)
          ]),
          h(" " + c(N.value) + "% ", 1)
        ], 8, xa)) : m("", !0),
        E.value ? (n(), r("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: t.card,
          "data-fact": "model",
          title: `${E.value}: change the model`,
          onClick: e[3] || (e[3] = (a) => F("model") ? w(a, "model") : null)
        }, [
          y(Z, {
            name: "model",
            size: 12
          }),
          h(" " + c(E.value), 1)
        ], 8, Ca)) : m("", !0),
        F("effort") || t.card && T.value ? (n(), r("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: t.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: e[4] || (e[4] = (a) => w(a, "effort"))
        }, [
          y(Z, {
            name: "bolt",
            size: 12
          }),
          h(" " + c(T.value), 1)
        ], 8, Sa)) : m("", !0),
        _.value ? (n(), r("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: t.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: e[5] || (e[5] = (a) => l("open", "cost", a.currentTarget))
        }, c(_.value), 9, Aa)) : m("", !0),
        U.value ? (n(), r("span", ja, [
          y(Z, {
            name: "reminders",
            size: 12
          }),
          h(" " + c(U.value), 1)
        ])) : m("", !0),
        t.branch ? (n(), r("span", Ra, [
          y(Z, {
            name: "branch",
            size: 12
          }),
          h(" " + c(t.branch), 1)
        ])) : m("", !0),
        t.card ? m("", !0) : (n(), r("button", {
          key: 7,
          type: "button",
          class: X(["fact", { none: !t.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: e[6] || (e[6] = (a) => l("open", "jobs", a.currentTarget))
        }, [
          y(Z, {
            name: "clock",
            size: 12
          }),
          h(" " + c(t.jobs), 1)
        ], 2)),
        t.run ? (n(), r("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: I
        }, [
          y(Z, {
            name: "book",
            size: 12
          }),
          h(" " + c(z.value.length), 1)
        ])) : m("", !0),
        t.fitness ? (n(), r(L, { key: 9 }, [
          d("button", {
            type: "button",
            class: X(["fact", "fitness-fact", { low: t.fitness.is_measured && t.fitness.score < La }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: e[7] || (e[7] = (a) => l("open", "fitness", a.currentTarget))
          }, [
            y(Z, {
              name: "heart",
              size: 12
            }),
            h(" " + c(t.fitness.is_measured ? t.fitness.score : "–"), 1)
          ], 2),
          d("button", {
            type: "button",
            class: X(["fact", "load-fact", t.fitness.workload_level]),
            "data-fact": "load",
            title: "Compare incoming messages with agent replies",
            onClick: e[8] || (e[8] = (a) => l("open", "load", a.currentTarget))
          }, [
            y(Z, {
              name: "weight",
              size: 12
            }),
            h(" " + c(t.fitness.workload), 1)
          ], 2)
        ], 64)) : m("", !0)
      ], 64)) : t.run && !t.loading ? (n(), r("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: e[9] || (e[9] = (a) => w(a, "start"))
      }, [
        y(Z, {
          name: "agents",
          size: 12
        }),
        e[16] || (e[16] = h(" Start an agent", -1))
      ])) : m("", !0),
      e[22] || (e[22] = d("span", { class: "space" }, null, -1)),
      g(v).failure.value ? (n(), r("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: g(v).failure.value
      }, c(g(v).failure.value), 9, Ta)) : m("", !0),
      pe(p.$slots, "default", {}, void 0, !0),
      k.value ? (n(), W(ha, {
        key: 3,
        anchor: k.value,
        "min-width": 190,
        onClose: O
      }, {
        default: A(() => {
          var a;
          return [
            C.value === "agent" ? (n(), r(L, { key: 0 }, [
              g(v).asking.value ? (n(), r(L, { key: 0 }, [
                y(ve, { "data-agent-stop-ask": "" }, {
                  default: A(() => [...e[17] || (e[17] = [
                    h("Stop the agent? It stops what it is doing.", -1)
                  ])]),
                  _: 1
                }),
                y(ce, {
                  "data-agent-stop-confirm": "",
                  onClick: e[10] || (e[10] = (s) => (O(), g(v).stop()))
                }, {
                  default: A(() => [...e[18] || (e[18] = [
                    h("Stop it", -1)
                  ])]),
                  _: 1
                }),
                y(ce, {
                  onClick: e[11] || (e[11] = (s) => g(v).asking.value = !1)
                }, {
                  default: A(() => [...e[19] || (e[19] = [
                    h("Keep it running", -1)
                  ])]),
                  _: 1
                })
              ], 64)) : (n(), W(ce, {
                key: 1,
                "data-agent-stop": "",
                onClick: e[12] || (e[12] = (s) => g(v).asking.value = !0)
              }, {
                default: A(() => [...e[20] || (e[20] = [
                  h("Stop", -1)
                ])]),
                _: 1
              }))
            ], 64)) : C.value === "start" ? (n(), r(L, { key: 1 }, [
              y(ve, null, {
                default: A(() => [...e[21] || (e[21] = [
                  h("Start an agent", -1)
                ])]),
                _: 1
              }),
              (n(!0), r(L, null, K(g(v).programs.value, (s) => (n(), W(ce, {
                key: s.name,
                "data-agent-program": s.name,
                onClick: (j) => (O(), g(v).start(s))
              }, {
                default: A(() => [
                  h(c(s.title), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-program", "onClick"]))), 128))
            ], 64)) : C.value === "skills" ? (n(), W(ua, {
              key: 2,
              skills: x.value,
              onBrowse: e[13] || (e[13] = (s) => (O(), l("open", "skills", null)))
            }, null, 8, ["skills"])) : f.value ? (n(), r(L, { key: 3 }, [
              y(ve, null, {
                default: A(() => [
                  h(c(f.value.label), 1)
                ]),
                _: 1
              }),
              C.value === "context" ? (n(), r(L, { key: 0 }, [
                d("div", Oa, [
                  d("span", za, [
                    d("span", {
                      style: oe({ width: `${N.value}%` })
                    }, null, 4)
                  ]),
                  d("span", Va, c(N.value) + "%", 1)
                ]),
                d("p", Ha, c(g(ya)(((a = H.value) == null ? void 0 : a.last_compaction) ?? null)), 1)
              ], 64)) : m("", !0),
              (n(!0), r(L, null, K(f.value.choices, (s) => (n(), W(ce, {
                key: s.value,
                "data-agent-choice": s.value,
                onClick: (j) => (g(v).choose(f.value.key, s), O())
              }, {
                default: A(() => [
                  h(c(s.label), 1)
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
}, Ia = /* @__PURE__ */ G(Ba, [["__scopeId", "data-v-58c7f8ed"]]), Ea = ["data-agent-open", "aria-expanded", "role", "tabindex"], Na = { class: "agent-head" }, Wa = ["data-state"], qa = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Fa = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Da = { class: "agent-times" }, Pa = {
  key: 0,
  class: "agent-time",
  "data-agent-motion": ""
}, _a = {
  key: 1,
  class: "agent-time",
  "data-agent-motion": ""
}, Ja = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": ""
}, Ua = { class: "agent-line" }, Ka = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Za = {
  key: 0,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Ga = {
  key: 1,
  class: "agent-line"
}, Ya = {
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, Qa = {
  key: 2,
  class: "agent-line agent-work-start"
}, Xa = ["data-peek"], en = ["title"], tn = ["data-peek"], an = ["data-agent-waiting", "data-agent-stopped"], nn = {
  key: 1,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, ln = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(t, { emit: o }) {
    const i = { helper: "Helper", reviewer: "Reviewer" }, l = t, v = o, k = ot(), C = b(() => {
      var a, s;
      if ((a = l.facts) != null && a.profile_title) return l.facts.profile_title;
      if ((s = l.facts) != null && s.profile) return l.facts.profile;
      const e = i[l.row.role] || l.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), f = b(() => {
      var e;
      return ((e = l.facts) == null ? void 0 : e.tasks) ?? [];
    }), w = b(() => f.value.filter((e) => e.state === "open")), O = b(() => {
      const e = f.value.find((a) => {
        var s;
        return a.id === ((s = l.facts) == null ? void 0 : s.task_id);
      });
      return e != null && e.plan_id ? e : w.value.find((a) => a.plan_id);
    }), x = b(() => {
      var e, a, s, j, u;
      return l.row.role === "helper" ? ((e = l.facts) == null ? void 0 : e.helper_job) || "" : (a = l.facts) != null && a.job_enabled && (((s = l.facts) == null ? void 0 : s.task_title) || ((j = w.value[0]) == null ? void 0 : j.title) || ((u = f.value.at(-1)) == null ? void 0 : u.title)) || "";
    }), z = b(() => {
      const e = x.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return e ? `${e[1].toLowerCase() === "plan" ? "plans" : "docs"}:${e[2]}` : "";
    }), B = b(() => {
      var e, a;
      return [l.row.program, (e = l.facts) == null ? void 0 : e.model, (a = l.facts) == null ? void 0 : a.effort, l.row.role === "worker" ? `worker ${l.row.id}` : ""].filter(Boolean).join(" · ");
    }), I = me(), F = b(() => it(l.row.process_started_at || l.row.created_at, k.value)), E = /* @__PURE__ */ new Set(["open", "started", "testing"]), T = b(() => !!l.row.ended_at && l.row.role !== "main" && f.value.some((e) => E.has(e.state))), H = b(() => {
      var e;
      return l.row.retired_at || l.row.state === "retired" ? "retired" : l.waitReason || T.value ? "waiting" : l.row.state === "running" && ((e = l.facts) == null ? void 0 : e.state) || l.row.state;
    }), q = b(() => {
      var e;
      return l.waitReason ? `Waiting: ${l.waitReason}` : H.value === "blocked" ? (e = l.facts) != null && e.blocked_reason ? `Blocked: ${l.facts.blocked_reason}` : "Blocked" : T.value ? "Stopped with work left" : "";
    }), D = b(() => {
      var e;
      return ((e = l.progress) == null ? void 0 : e.completed_count) ?? f.value.filter((a) => a.state === "completed").length;
    }), N = b(() => {
      var e;
      return ((e = l.progress) == null ? void 0 : e.task_count) ?? f.value.length;
    }), _ = b(() => `${D.value} of ${N.value} ${N.value === 1 ? "task" : "tasks"}`), U = b(() => {
      var a;
      const e = rt(D.value, ((a = l.progress) == null ? void 0 : a.started_at) || l.row.created_at, l.progress ? l.progress.finished_at : l.row.ended_at, k.value);
      return l.row.role !== "main" && e ? `${e} per hour` : "";
    }), p = b(() => !!l.row.retired_at || l.row.state === "retired");
    return (e, a) => {
      var s, j, u;
      return n(), r("div", {
        class: X(["agent-card", { open: t.open }]),
        "data-agent-open": t.row.id,
        "aria-expanded": t.open,
        role: t.open ? void 0 : "button",
        tabindex: t.open ? void 0 : 0,
        onClick: a[4] || (a[4] = ($) => !t.open && v("toggle")),
        onKeydown: [
          a[5] || (a[5] = Oe(Q(($) => !t.open && v("toggle"), ["self", "prevent"]), ["enter"])),
          a[6] || (a[6] = Oe(Q(($) => !t.open && v("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        d("span", Na, [
          t.open ? (n(), r("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: a[0] || (a[0] = Q(($) => v("toggle"), ["stop"]))
          }, [
            y(g(we), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : m("", !0),
          d("span", {
            class: "agent-dot",
            "data-state": H.value,
            "data-agent-motion": ""
          }, null, 8, Wa),
          d("span", qa, c(C.value), 1),
          d("span", Fa, c(((s = t.facts) == null ? void 0 : s.given_name) || t.row.id), 1),
          t.open ? m("", !0) : (n(), W(g(we), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          d("span", Da, [
            p.value ? (n(), r("span", Pa, [
              a[7] || (a[7] = h("Retired, ", -1)),
              y(g($e), {
                at: t.row.retired_at
              }, null, 8, ["at"])
            ])) : t.row.ended_at ? (n(), r("span", _a, [
              a[8] || (a[8] = h("Idle, ", -1)),
              y(g($e), {
                at: t.row.ended_at
              }, null, 8, ["at"])
            ])) : (n(), r("span", Ja, c(F.value), 1))
          ])
        ]),
        d("span", Ua, [
          d("span", Ka, c(t.open && t.row.role === "worker" ? `worker ${t.row.id}` : t.open ? "" : B.value), 1),
          t.open && ((j = t.facts) != null && j.last_activity) ? (n(), r("span", Za, [
            a[9] || (a[9] = h("Last heard: ", -1)),
            y(g($e), {
              at: t.facts.last_activity
            }, null, 8, ["at"])
          ])) : m("", !0)
        ]),
        t.open ? (n(), W(Ia, {
          key: 0,
          agent: t.row,
          branch: (u = t.progress) == null ? void 0 : u.branch,
          usage: { agents: t.facts ? [t.facts] : [], windows: [] },
          card: ""
        }, {
          default: A(() => [
            t.row.role === "helper" && !t.row.ended_at ? (n(), W(g(te), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: a[1] || (a[1] = Q(($) => g(I).run(["helper", "stop", String(t.row.id)]), ["stop"]))
            }, {
              default: A(() => [...a[10] || (a[10] = [
                h("Stop", -1)
              ])]),
              _: 1
            })) : m("", !0)
          ]),
          _: 1
        }, 8, ["agent", "branch", "usage"])) : m("", !0),
        t.open && N.value && !x.value ? (n(), r("span", Ga, [
          d("span", Ya, c(_.value), 1)
        ])) : m("", !0),
        t.open && O.value ? (n(), r("span", Qa, [
          d("button", {
            type: "button",
            class: "agent-plan",
            "data-agent-plan": "",
            "data-peek": `plans:${O.value.plan_id}`,
            onClick: a[2] || (a[2] = Q(($) => g(he)(`plans:${O.value.plan_id}`), ["stop"]))
          }, "Plan " + c(O.value.plan_id) + ": " + c(O.value.plan_title), 9, Xa)
        ])) : m("", !0),
        x.value || !t.open && q.value ? (n(), r("span", {
          key: 3,
          class: X(["agent-line", { "agent-work-start": !O.value }])
        }, [
          d("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: x.value
          }, [
            t.open && z.value ? (n(), r("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": z.value,
              onClick: a[3] || (a[3] = Q(($) => g(he)(z.value), ["stop"]))
            }, c(x.value), 9, tn)) : (n(), r(L, { key: 1 }, [
              h(c(x.value), 1)
            ], 64))
          ], 8, en),
          !t.open && q.value ? (n(), r("span", {
            key: 0,
            class: "agent-work-status",
            "data-agent-waiting": t.waitReason ? "" : null,
            "data-agent-stopped": T.value && !t.waitReason ? "" : null
          }, c(q.value), 9, an)) : m("", !0),
          t.open && N.value ? (n(), r("span", nn, c(_.value), 1)) : m("", !0)
        ], 2)) : m("", !0),
        t.open ? (n(), W(Qt, {
          key: 4,
          row: t.row,
          facts: t.facts,
          progress: t.progress,
          "wait-reason": t.waitReason,
          tasks: f.value,
          "stopped-with-work": T.value,
          open: t.open,
          "total-count": N.value,
          "tasks-per-hour": U.value
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open", "total-count", "tasks-per-hour"])) : m("", !0)
      ], 42, Ea);
    };
  }
}, sn = /* @__PURE__ */ G(ln, [["__scopeId", "data-v-eb1b0927"]]), on = {
  class: "agent-limits",
  "data-agent-limits": ""
}, rn = ["aria-expanded"], un = { key: 0 }, dn = { key: 1 }, cn = { class: "limits-panel" }, gn = { class: "limits-head" }, vn = ["data-agent-limit-type", "data-agent-limit-profile"], pn = { class: "count" }, hn = { class: "bar" }, mn = { class: "count" }, fn = { class: "bar" }, kn = ["data-agent-limit-type"], yn = { class: "limit-field" }, bn = { class: "limit-field" }, wn = {
  key: 1,
  role: "alert"
}, Mn = {
  key: 2,
  role: "status"
}, xn = {
  __name: "AgentLimits",
  setup(t) {
    const o = me(), i = S([]), l = S({}), v = S(!1), k = S(!1), C = S(!1), f = S(""), w = S(""), O = (e) => e === 0 ? "no limit" : String(e), x = (e, a) => a === 0 ? 0 : e > a ? 2 : e === a ? 1 : 0, z = b(() => i.value.flatMap((e) => e.per_profile && e.profiles.length ? e.profiles.map((a) => ({ ...a, label: a.title, type: e.key, key: `${e.key}:${a.profile}` })) : [e])), B = (e) => Math.max(x(e.running, e.run_limit), x(e.kept, e.kept_limit)), I = b(() => z.value.filter((e) => B(e)).sort((e, a) => B(a) - B(e))), F = b(() => i.value.reduce((e, a) => e + a.running, 0)), E = b(() => i.value.reduce((e, a) => e + a.kept, 0)), T = (e) => {
      const a = [e.run_limit ? e.running - e.run_limit : -1, e.kept_limit ? e.kept - e.kept_limit : -1], s = Math.max(...a);
      return s > 0 ? `Over by ${s}` : s === 0 ? "At limit" : "Within limits";
    }, H = (e, a) => a ? `${Math.min(e / Math.max(e, a) * 100, 100)}%` : "0%", q = (e, a) => a && e > a ? `${(e - a) / e * 100}%` : "0%";
    let D = 0;
    async function N() {
      const e = ++D, a = await o.read("agent limits");
      e === D && (i.value = a.ok ? a.value.rows : [], f.value = a.ok ? "" : a.error);
    }
    async function _(e) {
      const a = await Promise.all(i.value.flatMap((s) => [s.run_setting, s.kept_setting]).map(async (s) => {
        const j = await o.read(`setting show ${s}`);
        return [s, j.ok ? j.value.source : ""];
      }));
      e === D && (l.value = Object.fromEntries(a));
    }
    async function U() {
      k.value = !k.value, k.value && await _(D);
    }
    async function p(e, a, s, j) {
      if (C.value || o.readOnly) return;
      const u = Number(j.target.value);
      if (!Number.isInteger(u) || u < 0 || !j.target.value.trim()) {
        f.value = "Use a whole number of 0 or more.", j.target.value = String(s);
        return;
      }
      C.value = !0, w.value = "";
      try {
        const $ = await o.run(["setting", "set", a, String(u), "--environment", o.environment]);
        if (f.value = $.ok ? "" : $.error, !$.ok) {
          j.target.value = String(s);
          return;
        }
        await N(), w.value = `${e.label} limits saved.`;
      } finally {
        C.value = !1;
      }
    }
    return o.follow(["agent.*", "setting.*"], N), N(), (e, a) => (n(), r("section", on, [
      i.value.length ? (n(), r(L, { key: 0 }, [
        d("button", {
          class: "summary",
          type: "button",
          "aria-expanded": v.value,
          onClick: a[0] || (a[0] = (s) => v.value = !v.value)
        }, [
          I.value.length ? (n(), r(L, { key: 0 }, [
            (n(!0), r(L, null, K(I.value.slice(0, 2), (s) => (n(), r("span", {
              key: s.key,
              class: "summary-item"
            }, [
              d("span", {
                class: X(["mark", { over: B(s) === 2 }])
              }, null, 2),
              h(c(s.label) + ": " + c(T(s)), 1)
            ]))), 128)),
            I.value.length > 2 ? (n(), r("span", un, c(I.value.length - 2) + " more", 1)) : m("", !0)
          ], 64)) : (n(), r("span", dn, "All within limits, " + c(F.value) + " running, " + c(E.value) + " kept", 1)),
          y(g(we), {
            name: "caret",
            size: 12
          })
        ], 8, rn),
        Qe(d("div", cn, [
          d("div", gn, [
            a[1] || (a[1] = d("strong", null, "Agent limits", -1)),
            y(g(te), {
              small: "",
              disabled: C.value || g(o).readOnly,
              "data-agent-limits-edit": "",
              onClick: U
            }, {
              default: A(() => [
                h(c(k.value ? "Done" : "Edit limits"), 1)
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          k.value ? (n(), r(L, { key: 1 }, [
            (n(!0), r(L, null, K(i.value, (s) => (n(), r("div", {
              key: s.key,
              class: "edit-row",
              "data-agent-limit-type": s.key
            }, [
              d("strong", null, c(s.label), 1),
              d("label", yn, [
                d("span", null, [
                  a[3] || (a[3] = h("Running", -1)),
                  s.per_profile ? (n(), r(L, { key: 0 }, [
                    h(" per profile")
                  ], 64)) : m("", !0)
                ]),
                y(g(Se), {
                  type: "number",
                  min: "0",
                  value: String(s.run_limit),
                  disabled: C.value || g(o).readOnly,
                  "data-agent-run-limit": s.key,
                  onChange: (j) => p(s, s.run_setting, s.run_limit, j)
                }, null, 8, ["value", "disabled", "data-agent-run-limit", "onChange"]),
                d("small", null, c(l.value[s.run_setting]), 1)
              ]),
              d("label", bn, [
                d("span", null, [
                  a[4] || (a[4] = h("Kept", -1)),
                  s.per_profile ? (n(), r(L, { key: 0 }, [
                    h(" per profile")
                  ], 64)) : m("", !0)
                ]),
                y(g(Se), {
                  type: "number",
                  min: "0",
                  value: String(s.kept_limit),
                  disabled: C.value || g(o).readOnly,
                  "data-agent-kept-limit": s.key,
                  onChange: (j) => p(s, s.kept_setting, s.kept_limit, j)
                }, null, 8, ["value", "disabled", "data-agent-kept-limit", "onChange"]),
                d("small", null, c(l.value[s.kept_setting]), 1)
              ])
            ], 8, kn))), 128)),
            d("p", null, "Running 0 starts no agents. Kept 0 means no limit. Changes apply to " + c(g(o).environment) + ".", 1)
          ], 64)) : (n(), r(L, { key: 0 }, [
            a[2] || (a[2] = d("div", { class: "table-head" }, [
              d("span", null, "Agent"),
              d("span", null, "Running"),
              d("span", null, "Kept"),
              d("span", null, "Status")
            ], -1)),
            (n(!0), r(L, null, K(z.value, (s) => (n(), r("div", {
              key: s.key,
              class: "limit-row",
              "data-agent-limit-type": s.type || s.key,
              "data-agent-limit-profile": s.profile
            }, [
              d("strong", null, c(s.label), 1),
              d("div", pn, [
                d("span", null, c(s.run_limit ? `${s.running} of ${s.run_limit}` : `${s.running} · none may start`), 1),
                d("div", hn, [
                  d("span", {
                    style: oe({ width: H(s.running, s.run_limit) })
                  }, null, 4),
                  d("i", {
                    style: oe({ width: q(s.running, s.run_limit) })
                  }, null, 4)
                ])
              ]),
              d("div", mn, [
                d("span", null, c(s.kept) + " of " + c(O(s.kept_limit)), 1),
                d("div", fn, [
                  d("span", {
                    style: oe({ width: H(s.kept, s.kept_limit) })
                  }, null, 4),
                  d("i", {
                    style: oe({ width: q(s.kept, s.kept_limit) })
                  }, null, 4)
                ])
              ]),
              d("span", {
                class: X(["status", { warning: B(s) === 1, danger: B(s) === 2 }])
              }, c(T(s)), 3)
            ], 8, vn))), 128))
          ], 64))
        ], 512), [
          [Xe, v.value]
        ])
      ], 64)) : m("", !0),
      f.value ? (n(), r("p", wn, c(f.value), 1)) : m("", !0),
      w.value ? (n(), r("p", Mn, c(w.value), 1)) : m("", !0)
    ]));
  }
}, $n = /* @__PURE__ */ G(xn, [["__scopeId", "data-v-00e6a563"]]), Cn = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Sn = ["data-agent-row"], He = "journal.agents.filters", be = "cubic-bezier(0.2, 0.9, 0.25, 1)", An = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(t) {
    const o = t, { rows: i } = ut("usage agents --closed", ["agent.*", "task.*", "hook_call.*", "helper_job.*"]), { rows: l } = Ve("waits"), { rows: v } = Ve("progress"), k = (R) => v.value.find((V) => V.agent_id === R.id) ?? null, C = (R) => {
      var V;
      return ((V = l.value.find((M) => M.agent_id === R.id)) == null ? void 0 : V.reason) ?? "";
    }, f = S("running"), w = S(""), O = JSON.parse(localStorage.getItem(He) || '{"roles":[],"profiles":[],"programs":[]}'), x = S(O), z = S({ roles: [], profiles: [], states: [], upgrade_retired: 0 }), B = S([]), I = b(() => x.value.roles.length + x.value.profiles.length + x.value.programs.length), F = (R, V) => {
      x.value = vt(x.value, R, V);
    }, E = () => {
      x.value = { roles: [], profiles: [], programs: [] };
    }, T = (R) => R.slice(0, 1).toUpperCase() + R.slice(1);
    ae(x, (R) => localStorage.setItem(He, JSON.stringify(R)));
    const H = me();
    async function q() {
      const [R, V] = await Promise.all([H.read("agent cards --options"), H.read("agent programs")]);
      R.ok && (z.value = R.value), V.ok && (B.value = V.value.rows);
    }
    H.follow(["agent.*"], q), q();
    const D = S([]), N = S(""), _ = S(!1), U = S(!1), p = S(25);
    let e = 0;
    async function a() {
      const R = ++e, V = [
        ...x.value.roles.map((P) => `--role ${JSON.stringify(P)}`),
        ...x.value.profiles.map((P) => `--profile ${JSON.stringify(P)}`),
        ...x.value.programs.map((P) => `--program ${JSON.stringify(P)}`)
      ].join(" "), M = await H.read(`${o.line} --show ${f.value} --search ${JSON.stringify(w.value)} --limit ${p.value} ${V}`);
      R === e && (D.value = M.ok ? M.value.rows : [], N.value = M.ok ? "" : M.error, U.value = M.ok && M.value.page * M.value.size < M.value.total, _.value = !0);
    }
    async function s() {
      return p.value += 25, await a(), !0;
    }
    ae([f, w, x], () => {
      p.value = 25, a();
    }), H.follow(["agent.*", "task.*", ...H.sources.flatMap((R) => R.events)], Ee(a, Ne.pageOfAgents)), a();
    const j = (R) => i.value.find((V) => V.id === R.id) ?? R.facts ?? null, u = D, $ = b(() => !!w.value.trim() || I.value > 0), J = b(() => o.texts[f.value] ?? { title: o.empty, hint: "" }), Y = S(null), ne = S(null), ge = S(null), le = b(() => u.value.find((R) => R.id === Y.value) ?? null), xe = b(() => le.value ? [le.value] : u.value), ie = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let re = !1, je = 0;
    async function Fe(R) {
      if (re) return;
      re = !0, je = ge.value.scrollTop;
      const V = ne.value.querySelector(`[data-agent-open="${R.id}"]`);
      if (!ie()) {
        const se = [...ne.value.querySelectorAll(".agent-row")].filter((ee) => !ee.contains(V));
        await Promise.all(se.map((ee) => ee.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const M = [...V.querySelectorAll(".agent-head, .agent-line")], P = [...M, ...V.querySelectorAll("[data-agent-motion]")], fe = P.map((se) => se.getBoundingClientRect());
      if (Y.value = R.id, await ze(), !ie()) {
        const se = P.map((ee) => ee.getBoundingClientRect());
        P.forEach((ee, ke) => {
          const ue = M.indexOf(ee.parentElement), Pe = fe[ke].left - se[ke].left - (ue < 0 ? 0 : fe[ue].left - se[ue].left), _e = fe[ke].top - se[ke].top - (ue < 0 ? 0 : fe[ue].top - se[ue].top);
          ee.animate([{ transform: `translate(${Pe}px, ${_e}px)` }, { transform: "none" }], { duration: 280, easing: be });
        }), ne.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((ee) => {
          ee.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: be, fill: "backwards" });
        });
      }
      re = !1;
    }
    async function Re() {
      if (re || !le.value) return;
      re = !0;
      const R = ne.value.querySelector(`[data-agent-open="${Y.value}"]`), V = [...R.children], M = ie() ? [] : V.map((P) => P.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(M.map((P) => P.finished)), Y.value = null, await ze(), ge.value.scrollTop = je, M.forEach((P) => P.cancel()), ie() || (R.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: be }), ne.value.querySelectorAll(".agent-row").forEach((P) => {
        P.contains(R) || P.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: be });
      })), re = !1;
    }
    const De = (R) => Y.value === R.id ? Re() : Fe(R);
    ae(w, (R) => R.trim() && (Y.value = null)), ae(f, () => {
      Y.value = null;
    });
    const Te = (R) => {
      R.key === "Escape" && Re();
    };
    return window.addEventListener("keydown", Te), Me(() => window.removeEventListener("keydown", Te)), (R, V) => (n(), r("div", {
      ref_key: "agents",
      ref: ne,
      class: X(["agents", { focused: le.value }])
    }, [
      y($n),
      y(g(dt), {
        modelValue: w.value,
        "onUpdate:modelValue": V[1] || (V[1] = (M) => w.value = M),
        placeholder: "Search agents",
        "menu-count": I.value,
        "data-agents-search": ""
      }, {
        menu: A(() => [
          y(g(Ce), null, {
            default: A(() => [...V[2] || (V[2] = [
              h("Type", -1)
            ])]),
            _: 1
          }),
          (n(!0), r(L, null, K(z.value.roles, (M) => (n(), W(g(ye), {
            key: M,
            role: "menuitemcheckbox",
            "aria-checked": x.value.roles.includes(M),
            checked: x.value.roles.includes(M),
            "data-filter-role": M,
            onClick: (P) => F("roles", M)
          }, {
            default: A(() => [
              h(c(T(M)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          z.value.profiles.length ? (n(), W(g(Ce), { key: 0 }, {
            default: A(() => [...V[3] || (V[3] = [
              h("Profile", -1)
            ])]),
            _: 1
          })) : m("", !0),
          (n(!0), r(L, null, K(z.value.profiles, (M) => (n(), W(g(ye), {
            key: M.name,
            role: "menuitemcheckbox",
            "aria-checked": x.value.profiles.includes(M.name),
            checked: x.value.profiles.includes(M.name),
            "data-filter-profile": M.name,
            onClick: (P) => F("profiles", M.name)
          }, {
            default: A(() => [
              h(c(M.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          y(g(Ce), null, {
            default: A(() => [...V[4] || (V[4] = [
              h("Program", -1)
            ])]),
            _: 1
          }),
          (n(!0), r(L, null, K(B.value, (M) => (n(), W(g(ye), {
            key: M.name,
            role: "menuitemcheckbox",
            "aria-checked": x.value.programs.includes(M.name),
            checked: x.value.programs.includes(M.name),
            "data-filter-program": M.name,
            onClick: (P) => F("programs", M.name)
          }, {
            default: A(() => [
              h(c(M.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          I.value ? (n(), W(g(ye), {
            key: 1,
            "data-filter-clear": "",
            onClick: E
          }, {
            default: A(() => [...V[5] || (V[5] = [
              h("Clear filters", -1)
            ])]),
            _: 1
          })) : m("", !0)
        ]),
        default: A(() => [
          y(g(ct), {
            options: z.value.states,
            value: f.value,
            onPick: V[0] || (V[0] = (M) => f.value = M)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      f.value === "retired" && z.value.upgrade_retired ? (n(), r("p", Cn, "Retired during the upgrade: " + c(z.value.upgrade_retired), 1)) : m("", !0),
      d("div", {
        ref_key: "list",
        ref: ge,
        class: X(["agents-view", { "agents-view-open": le.value }])
      }, [
        _.value && !N.value && !xe.value.length && I.value ? (n(), W(g(Ae), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: A(() => [
            y(g(te), {
              small: "",
              "data-empty-clear": "",
              onClick: E
            }, {
              default: A(() => [...V[6] || (V[6] = [
                h("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (n(), W(g(gt), {
          key: 1,
          rows: xe.value,
          failure: N.value,
          loaded: _.value,
          more: !le.value && U.value,
          older: s,
          empty: J.value.title,
          hint: J.value.hint,
          searching: $.value
        }, {
          default: A(({ row: M }) => [
            d("div", {
              class: "agent-row",
              "data-agent-row": M.id
            }, [
              y(sn, {
                row: M,
                facts: j(M),
                progress: k(M),
                "wait-reason": C(M),
                open: M.id === Y.value,
                onToggle: (P) => De(M)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, Sn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, On = /* @__PURE__ */ G(An, [["__scopeId", "data-v-9158c96c"]]);
export {
  On as A
};
