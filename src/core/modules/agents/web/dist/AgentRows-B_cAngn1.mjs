/* @code-commandments-generated */
import { openBlock as n, createElementBlock as o, withModifiers as Q, unref as v, createTextVNode as h, toDisplayString as c, createVNode as y, createBlock as W, withCtx as A, Fragment as H, renderList as K, createElementVNode as g, createCommentVNode as m, ref as C, computed as b, watch as le, defineAsyncComponent as Ke, onUnmounted as xe, createSlots as Ze, resolveDynamicComponent as Ge, normalizeStyle as oe, normalizeClass as X, renderSlot as ve, onMounted as Be, Teleport as Ye, mergeProps as Qe, toRef as Xe, withKeys as Oe, withDirectives as et, vShow as tt, nextTick as Ve } from "vue";
import { peekRef as pe, Icon as $e, RunningCommand as at, FoldGroup as Ie, TaskStatusIcon as nt, Btn as te, TextArea as lt, TextInput as je, useWindow as he, SwitchCase as Ee, useRows as Ne, loadWindowComponent as st, coalesced as We, READ_RATES as qe, InnerTabs as ot, TabBody as it, EmptyState as Re, useNow as rt, age as ut, perHour as dt, TimeAgo as Se, useDeclaredRows as He, SearchBar as ct, Segmented as gt, MenuLabel as Ae, MenuItem as we, RowList as vt, toggleFilter as pt } from "@journal/window-kit";
import { _ as G, T as ht } from "./TranscriptRows-DCpyNUhv.mjs";
const mt = {
  class: "agent-command",
  "data-agent-command": ""
}, ft = {
  key: 1,
  "data-agent-stopped": ""
}, kt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (i, r) => (n(), o("span", mt, [
      e.waitReason ? (n(), o("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: r[0] || (r[0] = Q((l) => v(pe)("test_queue:0"), ["stop"]))
      }, [
        h("Waiting: " + c(e.waitReason) + " ", 1),
        y(v($e), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (n(), o("span", ft, "Waiting")) : (n(), W(v(at), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, yt = /* @__PURE__ */ G(kt, [["__scopeId", "data-v-bb905922"]]), bt = ["data-agent-delegated", "onClick"], wt = { class: "agent-task-number" }, Mt = { class: "agent-task-title" }, $t = ["title"], xt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: i }) {
    const r = i;
    return (l, p) => (n(), W(v(Ie), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: p[0] || (p[0] = (k) => r("toggle"))
    }, {
      default: A(() => [
        (n(!0), o(H, null, K(e.section.tasks, (k) => (n(), o("button", {
          key: k.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": k.id,
          onClick: (x) => v(pe)(`tasks:${k.id}`)
        }, [
          y(v(nt), {
            status: k.state
          }, null, 8, ["status"]),
          g("span", wt, c(k.id), 1),
          g("span", Mt, c(k.title), 1),
          k.plan_id ? (n(), o("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${k.plan_id}: ${k.plan_title}`
          }, "Plan " + c(k.plan_id) + ": " + c(k.plan_title), 9, $t)) : m("", !0)
        ], 8, bt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Ct = /* @__PURE__ */ G(xt, [["__scopeId", "data-v-acc154a9"]]), St = { class: "action-field" }, At = ["value", "disabled"], jt = ["value"], Rt = { key: 1 }, Tt = {
  key: 1,
  class: "action-field"
}, zt = { class: "action-buttons" }, Ot = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (i, r) => (n(), o("form", {
      onSubmit: r[4] || (r[4] = Q((l) => i.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (n(), o(H, { key: 0 }, [
        g("label", St, [
          r[6] || (r[6] = h("Task ", -1)),
          g("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: r[0] || (r[0] = (l) => i.$emit("update:task", l.target.value))
          }, [
            r[5] || (r[5] = g("option", { value: "" }, "Choose an open task", -1)),
            (n(!0), o(H, null, K(e.tasks, (l) => (n(), o("option", {
              key: l.id,
              value: String(l.id)
            }, c(l.id) + ": " + c(l.title), 9, jt))), 128))
          ], 40, At)
        ]),
        e.moreTasks ? (n(), W(v(te), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: r[1] || (r[1] = (l) => i.$emit("more"))
        }, {
          default: A(() => [...r[7] || (r[7] = [
            h("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : m("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (n(), o("p", Rt, "No open tasks.")) : m("", !0)
      ], 64)) : (n(), o("label", Tt, [
        r[8] || (r[8] = h("Job", -1)),
        y(v(lt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: r[2] || (r[2] = (l) => i.$emit("update:text", l.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      g("div", zt, [
        y(v(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: A(() => [...r[9] || (r[9] = [
            h("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        y(v(te), {
          small: "",
          disabled: e.pending,
          onClick: r[3] || (r[3] = (l) => i.$emit("cancel"))
        }, {
          default: A(() => [...r[10] || (r[10] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Vt = /* @__PURE__ */ G(Ot, [["__scopeId", "data-v-356a2712"]]), Ht = { class: "action-buttons" }, Lt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (i, r) => (n(), o("form", {
      "data-agent-retire-confirm": "",
      onSubmit: r[2] || (r[2] = Q((l) => i.$emit("submit"), ["prevent"]))
    }, [
      r[5] || (r[5] = g("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      y(v(je), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": r[0] || (r[0] = (l) => i.$emit("update:reason", l))
      }, null, 8, ["model-value", "disabled"]),
      g("div", Ht, [
        y(v(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: A(() => [...r[3] || (r[3] = [
            h("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        y(v(te), {
          small: "",
          disabled: e.pending,
          onClick: r[1] || (r[1] = (l) => i.$emit("cancel"))
        }, {
          default: A(() => [...r[4] || (r[4] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Bt = /* @__PURE__ */ G(Lt, [["__scopeId", "data-v-bbe4e841"]]), It = { class: "action-buttons" }, Et = {
  key: 0,
  role: "alert"
}, Nt = {
  key: 1,
  role: "status"
}, Wt = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const i = e, r = he(), l = C(""), p = C(""), k = C(""), x = C(""), f = C([]), w = C(0), L = C(!1), $ = C(!1), O = C(!1), B = C(""), E = C(""), P = b(() => !!i.row.retired_at || i.row.state === "retired"), T = b(() => !P.value && !!i.row.ended_at), I = b(() => {
      var t;
      return T.value && ((t = i.row.job_command) == null ? void 0 : t.length) && !i.row.resume_reason;
    }), z = b(() => I.value && !$.value && (i.row.job_task_flag ? f.value.some((t) => String(t.id) === x.value) : !!p.value.trim()));
    function q(t) {
      l.value = t, p.value = "", k.value = "", x.value = "", B.value = "", E.value = "";
    }
    async function F() {
      q("job"), i.row.job_task_flag && (f.value = [], w.value = 0, L.value = !1, await N());
    }
    async function N() {
      if (!$.value) {
        $.value = !0;
        try {
          const t = await r.read(`task list --state open --limit 100 --page ${w.value + 1}`);
          B.value = t.ok ? "" : t.error, t.ok && (f.value = [...f.value, ...t.value.rows], w.value = t.value.page, L.value = t.value.page * t.value.size < t.value.total);
        } finally {
          $.value = !1;
        }
      }
    }
    async function _(t, a) {
      if (!O.value) {
        O.value = !0, B.value = "";
        try {
          const s = await r.run(t);
          B.value = s.ok ? "" : s.error, s.ok && (q(""), E.value = a);
        } finally {
          O.value = !1;
        }
      }
    }
    async function J() {
      if (!z.value) return;
      const t = i.row.job_task_flag ? [i.row.job_task_flag, x.value] : [p.value.trim()];
      await _([...i.row.job_command, String(i.row.id), ...t], "Job sent.");
    }
    async function u() {
      !T.value || l.value !== "retire" || !k.value.trim() || await _(["agent", "retire", String(i.row.id), "--reason", k.value.trim()], "Agent retired permanently.");
    }
    return (t, a) => {
      var s;
      return P.value ? m("", !0) : (n(), o("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: a[6] || (a[6] = Q(() => {
        }, ["stop"])),
        onKeydown: a[7] || (a[7] = Q(() => {
        }, ["stop"]))
      }, [
        g("div", It, [
          T.value ? (n(), o(H, { key: 0 }, [
            (s = e.row.job_command) != null && s.length ? (n(), W(v(te), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: O.value || $.value || !I.value,
              onClick: F
            }, {
              default: A(() => [...a[8] || (a[8] = [
                h("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0),
            e.row.role !== "main" ? (n(), W(v(te), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: O.value || $.value,
              onClick: a[0] || (a[0] = (S) => q("retire"))
            }, {
              default: A(() => [...a[9] || (a[9] = [
                h("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0)
          ], 64)) : m("", !0)
        ]),
        y(v(Ee), { value: l.value }, {
          job: A(() => [
            y(Vt, {
              task: x.value,
              "onUpdate:task": a[1] || (a[1] = (S) => x.value = S),
              text: p.value,
              "onUpdate:text": a[2] || (a[2] = (S) => p.value = S),
              row: e.row,
              tasks: f.value,
              pending: O.value,
              loading: $.value,
              "more-tasks": L.value,
              failure: B.value,
              "job-ready": z.value,
              onSubmit: J,
              onMore: N,
              onCancel: a[3] || (a[3] = (S) => q(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: A(() => [
            y(Bt, {
              reason: k.value,
              "onUpdate:reason": a[4] || (a[4] = (S) => k.value = S),
              pending: O.value,
              onSubmit: u,
              onCancel: a[5] || (a[5] = (S) => q(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        B.value ? (n(), o("p", Et, c(B.value), 1)) : m("", !0),
        E.value ? (n(), o("p", Nt, c(E.value), 1)) : m("", !0)
      ], 32));
    };
  }
}, qt = /* @__PURE__ */ G(Wt, [["__scopeId", "data-v-ca2f83db"]]), Ft = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Dt = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Pt = {
  key: 2,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, _t = {
  key: 4,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, Jt = ["data-peek", "onClick"], Ut = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Kt = {
  key: 0,
  class: "agent-helper-brief"
}, Zt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Gt = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Yt = "It ended without a report", Qt = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean, totalCount: Number, tasksPerHour: String },
  setup(e) {
    const i = e, r = ["started", "blocked", "open", "completed"], l = b(() => {
      var u, t;
      return i.row.ended_at && ((t = (u = i.facts) == null ? void 0 : u.job_returned) != null && t.startsWith(Yt)) ? i.facts.job_returned : "";
    }), p = b(() => i.tasks.length ? r.map((u) => ({ state: u, label: u.slice(0, 1).toUpperCase() + u.slice(1), tasks: i.tasks.filter((t) => t.state === u || u === "started" && t.state === "testing" || u === "completed" && t.state === "cancelled") })) : []), k = /* @__PURE__ */ new Set(["completed"]), x = C({}), f = (u) => !(x.value[u] ?? k.has(u)), w = (u) => x.value = { ...x.value, [u]: f(u) }, L = he(), { rows: $ } = Ne(`message agent-reports ${i.row.id}`, ["message.*"]), O = b(() => i.row.access === "read-only"), B = b(() => !!i.row.retired_at || i.row.state === "retired"), E = b(() => B.value ? L.tabs.filter((u) => ["reports", "transcript"].includes(u.key)) : O.value ? L.tabs.filter((u) => ["reports", "transcript", "terminal"].includes(u.key)) : L.tabs), P = () => O.value || B.value ? E.value.find((u) => u.key === "transcript") : E.value[0], T = C(P());
    le(E, (u) => {
      u.some((t) => {
        var a;
        return t.key === ((a = T.value) == null ? void 0 : a.key);
      }) || (T.value = u[0]);
    }), le(() => i.open, (u) => {
      u && (T.value = P());
    });
    const I = Object.fromEntries(L.tabs.filter((u) => u.component).map((u) => [u.key, Ke(() => st(u.component))])), z = C(!1), q = C(""), F = C(""), N = b(() => i.row.role !== "main" && (!i.row.ended_at || i.stoppedWithWork || i.waitReason));
    async function _() {
      if (!i.open || !N.value) return;
      const u = await L.read(`usage tool --agent ${i.row.id}`, { deferred: !0 });
      i.open && (q.value = u.ok ? u.value.tool : "", F.value = u.ok ? u.value.note : "");
    }
    const J = L.follow(["hook_call.*", "process_part.*"], We(_, qe.agentCommand));
    return xe(() => J == null ? void 0 : J()), le(() => i.open, (u) => {
      u && _();
    }, { immediate: !0 }), (u, t) => {
      var a;
      return n(), o("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: t[2] || (t[2] = Q(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (n(), o("p", Ft, "Retirement reason: " + c(e.row.retirement_reason), 1)) : m("", !0),
        e.row.resume_reason ? (n(), o("p", Dt, c(e.row.resume_reason), 1)) : m("", !0),
        y(qt, { row: e.row }, null, 8, ["row"]),
        e.totalCount && e.tasksPerHour ? (n(), o("span", Pt, c(e.tasksPerHour), 1)) : m("", !0),
        N.value ? (n(), W(yt, {
          key: 3,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: q.value,
          note: F.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0),
        l.value ? (n(), o("p", _t, c(l.value), 1)) : m("", !0),
        y(v(ot), {
          class: "agent-tabs",
          tabs: E.value,
          active: T.value,
          answer: { tasks: e.tasks.length, reports: v($).length },
          onChoose: t[0] || (t[0] = (s) => T.value = s)
        }, null, 8, ["tabs", "active", "answer"]),
        y(v(it), {
          class: "agent-tab-body",
          tab: T.value,
          "data-agent-tab-body": (a = T.value) == null ? void 0 : a.key
        }, {
          default: A(() => {
            var s;
            return [
              y(v(Ee), {
                value: (s = T.value) == null ? void 0 : s.key
              }, Ze({
                reports: A(() => [
                  v($).length ? m("", !0) : (n(), W(v(Re), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: A(() => [...t[3] || (t[3] = [
                      h("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (n(!0), o(H, null, K(v($), (S) => (n(), o("button", {
                    key: S.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${S.id}`,
                    onClick: (d) => v(pe)(`messages:${S.id}`)
                  }, c(S.text), 9, Jt))), 128))
                ]),
                tasks: A(() => {
                  var S;
                  return [
                    e.tasks.length ? m("", !0) : (n(), W(v(Re), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: A(() => [...t[4] || (t[4] = [
                        h("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (n(!0), o(H, null, K(p.value, (d) => (n(), W(Ct, {
                      key: d.state,
                      section: d,
                      open: f(d.state),
                      onToggle: (j) => w(d.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (S = e.facts) != null && S.instruction ? (n(), o(H, { key: 1 }, [
                      t[5] || (t[5] = g("p", { class: "agent-label" }, "Instruction", -1)),
                      g("div", Ut, c(e.facts.instruction), 1)
                    ], 64)) : m("", !0)
                  ];
                }),
                transcript: A(() => {
                  var S;
                  return [
                    O.value ? (n(), o(H, { key: 0 }, [
                      (S = e.facts) != null && S.instruction ? (n(), o("div", Kt, [
                        y(v(Ie), {
                          label: "Instruction",
                          open: z.value,
                          "data-agent-section": "instruction",
                          onToggle: t[1] || (t[1] = (d) => z.value = !z.value)
                        }, {
                          default: A(() => [
                            g("div", Zt, c(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (n(), o("p", Gt, "No job recorded")) : m("", !0)
                    ], 64)) : m("", !0),
                    y(ht, {
                      line: `agent transcript ${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["line"])
                  ];
                }),
                _: 2
              }, [
                K(v(I), (S, d) => ({
                  name: d,
                  fn: A(() => [
                    (n(), W(Ge(S), {
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
}, Xt = /* @__PURE__ */ G(Qt, [["__scopeId", "data-v-d7e386eb"]]), ea = ["stroke-width", "innerHTML"], Z = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const i = e, r = { right: 0, down: 90, left: 180, up: 270 }, l = {
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
    return (k, x) => (n(), o("svg", {
      class: "ico",
      style: oe({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...i.facing === "right" ? {} : { transform: `rotate(${r[i.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: p[l[e.name] || e.name] || p.dot
    }, null, 12, ea));
  }
}, ta = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, aa = {
  key: 1,
  class: "menu-item-text"
}, na = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (i, r) => (n(), o("button", {
      type: "button",
      class: X(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (n(), o("span", ta, c(e.checked ? "✓" : ""), 1)) : m("", !0),
      e.description ? (n(), o("span", aa, [
        g("span", null, [
          ve(i.$slots, "default", {}, void 0, !0)
        ]),
        g("small", null, c(e.description), 1)
      ])) : ve(i.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, de = /* @__PURE__ */ G(na, [["__scopeId", "data-v-9c67fe37"]]), la = {}, sa = { class: "menu-label" };
function oa(e, i) {
  return n(), o("span", sa, [
    ve(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ge = /* @__PURE__ */ G(la, [["render", oa], ["__scopeId", "data-v-71c11156"]]), ia = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, ra = {
  key: 0,
  class: "skills-none"
}, ua = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: i }) {
    const r = e, l = i, p = b(() => r.skills.filter((x) => x.state === "loaded")), k = b(() => r.skills.filter((x) => x.state !== "loaded"));
    return (x, f) => (n(), o("div", ia, [
      y(ge, null, {
        default: A(() => [...f[1] || (f[1] = [
          h("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      p.value.length ? m("", !0) : (n(), o("p", ra, "None yet. Compacting the conversation empties this list.")),
      (n(!0), o(H, null, K(p.value, (w) => (n(), o("p", {
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
      k.value.length ? (n(), o(H, { key: 1 }, [
        y(ge, null, {
          default: A(() => [...f[2] || (f[2] = [
            h("Still to read", -1)
          ])]),
          _: 1
        }),
        (n(!0), o(H, null, K(k.value, (w) => (n(), o("p", {
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
      y(de, {
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
}, da = /* @__PURE__ */ G(ua, [["__scopeId", "data-v-27140adf"]]), ca = (e, i, r) => Math.max(i, Math.min(r, e)), Fe = /* @__PURE__ */ new WeakMap(), ga = (e, i) => Fe.set(e, i);
function va(e, i) {
  for (let r = i; r; r = Fe.get(r) ?? r.parentElement) if (r === e) return !0;
  return !1;
}
function pa(e, i) {
  const r = (l) => {
    var k, x;
    const p = ((k = e.value) == null ? void 0 : k.element) || ((x = e.value) == null ? void 0 : x.$el) || e.value;
    p && !va(p, l.target) && i(l);
  };
  window.addEventListener("click", r), xe(() => window.removeEventListener("click", r));
}
const ue = 8, ha = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: i, emit: r }) {
    const l = e, p = C(null), k = (d) => d ? `${d}px` : void 0, x = b(() => ({
      minWidth: k(l.minWidth),
      maxWidth: k(l.maxWidth),
      maxHeight: k(l.maxHeight),
      height: k(l.height)
    })), f = C({ w: 0, h: 0 }), w = C(l.anchor ? l.anchor.getBoundingClientRect() : null), L = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), $ = (d) => ({
      left: Math.max(0, d.left),
      top: Math.max(0, d.top),
      right: Math.min(window.innerWidth, d.right),
      bottom: Math.min(window.innerHeight, d.bottom)
    }), O = (d) => {
      const j = d.closest(".pane, .float-window");
      return j ? $(j.getBoundingClientRect()) : L();
    }, B = (d, j) => `${Math.max(0, d ? Math.min(d, j) : j)}px`;
    function E(d, j) {
      return {
        below: d.bottom - j.bottom - l.gap - ue,
        above: j.top - d.top - l.gap - ue,
        across: d.right - d.left - 2 * ue
      };
    }
    function P(d) {
      const j = O(l.anchor), U = E(j, d);
      return f.value.w <= U.across && f.value.h <= Math.max(U.below, U.above) ? j : L();
    }
    const T = b(() => {
      if (!w.value) return x.value;
      const d = w.value, j = P(d), U = E(j, d), { w: Y, h: ae } = f.value, ce = l.align === "auto" ? d.left + d.right > j.left + j.right : l.align === "right", ne = ca(ce ? d.right - Y : d.left, j.left + ue, Math.max(j.left + ue, j.right - Y - ue)), fe = ae > U.below && U.above > U.below ? { bottom: `${window.innerHeight - d.top + l.gap}px`, maxHeight: B(l.maxHeight, U.above) } : { top: `${d.bottom + l.gap}px`, maxHeight: B(l.maxHeight, U.below) };
      return { ...x.value, ...fe, left: `${ne}px`, maxWidth: B(l.maxWidth, U.across) };
    }), I = r, z = () => [...p.value.querySelectorAll("button:not(:disabled)")];
    function q(d) {
      const j = z(), U = j.indexOf(document.activeElement);
      j[(U + d + j.length) % j.length].focus();
    }
    const F = { ArrowDown: () => q(1), ArrowUp: () => q(-1), Escape: () => I("close") }, N = (d) => F[d.key] && (d.preventDefault(), F[d.key]()), _ = () => p.value && (f.value = { w: p.value.offsetWidth, h: p.value.scrollHeight });
    let J = 0;
    const u = new ResizeObserver(() => {
      cancelAnimationFrame(J), J = requestAnimationFrame(_);
    });
    pa(p, (d) => l.anchor && !l.anchor.contains(d.target) && I("close"));
    const t = (d, j) => ["top", "left", "right", "bottom"].some((U) => Math.abs(d[U] - j[U]) > 1), a = (d) => d.bottom < 0 || d.top > window.innerHeight;
    let s = 0;
    function S() {
      if (l.anchor) {
        const d = l.anchor.getBoundingClientRect();
        if (!l.anchor.isConnected || a(d)) return I("close");
        t(d, w.value) && (w.value = d);
      }
      s = requestAnimationFrame(S);
    }
    return Be(() => {
      l.anchor && p.value && ga(p.value, l.anchor), _(), p.value && u.observe(p.value), !l.plain && z()[0] && z()[0].focus(), S();
    }), xe(() => {
      u.disconnect(), cancelAnimationFrame(s), cancelAnimationFrame(J);
    }), i({ element: p }), (d, j) => (n(), W(Ye, {
      to: "body",
      disabled: !e.anchor
    }, [
      g("div", Qe({
        ref_key: "panel",
        ref: p
      }, d.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: T.value,
        onKeydown: N
      }), [
        ve(d.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ma = /* @__PURE__ */ G(ha, [["__scopeId", "data-v-7f046e0d"]]);
async function fa(e, i, r) {
  if (!e) return r(i);
  const { target: l, fields: p } = e, k = Object.fromEntries(Object.keys(p).map((w) => [w, l[w]])), x = () => Object.assign(l, k);
  Object.assign(l, p);
  let f = !1;
  try {
    const w = await r(i);
    return f = w.ok, w;
  } finally {
    f || x();
  }
}
function ka(e, i, r) {
  const l = C([]), p = C([]), k = C({}), x = C(""), f = C(!1), w = b(() => !!e.value && !e.value.ended_at), L = b(() => w.value && !!e.value.paused_at);
  async function $() {
    if (w.value) {
      const I = await i(["agent", "controls", String(e.value.id)]);
      l.value = I.ok ? I.value.groups : [];
      return;
    }
    const T = await i(["agent", "programs"]);
    p.value = T.ok ? T.value.rows : [];
  }
  async function O(T, I = null) {
    x.value = "";
    const z = await fa(I, T, i);
    return x.value = z.ok ? "" : z.error, r(), z;
  }
  const B = (T, I) => O(["agent", "control", String(e.value.id), T, I.value], { target: k, fields: { value: { ...k.value, [T]: I.label } } }), E = () => (f.value = !1, O(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), P = (T) => O(["agent", "launch", T.name]);
  return Be($), le(w, $), { groups: l, programs: p, chosen: k, failure: x, asking: f, running: w, paused: L, choose: B, stop: E, start: P };
}
const De = { claude: "Claude Code", codex: "Codex" };
Object.entries(De).map(([e, i]) => ({ key: e, label: i }));
function ya(e, i = "agent") {
  return De[e] || i;
}
function ba(e) {
  if (!e) return "Not compacted yet";
  const i = new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return e.start_percent === null ? `Last compacted ${i}` : e.end_percent === null ? `Last compacted ${i}, from ${e.start_percent}%` : `Last compacted ${i}, from ${e.start_percent}% to ${e.end_percent}%, ${e.start_percent - e.end_percent}% taken off`;
}
const wa = ["disabled", "title"], Ma = ["title"], $a = { class: "gauge usage" }, xa = ["disabled", "title"], Ca = { class: "gauge" }, Sa = ["disabled", "title"], Aa = ["disabled"], ja = ["disabled"], Ra = {
  key: 5,
  class: "fact",
  "data-fact": "uptime",
  title: "How long this session has run"
}, Ta = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, za = ["title"], Oa = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Va = { class: "gauge" }, Ha = { class: "context-used" }, La = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Ba = 75, Ia = {
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
  setup(e, { emit: i }) {
    const r = e, l = i, p = ka(Xe(r, "agent"), r.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => l("changed")), k = C(null), x = C(""), f = b(() => p.groups.value.find((u) => u.key === x.value));
    function w(u, t) {
      k.value = u.currentTarget, x.value = t;
    }
    function L() {
      k.value = null, x.value = "", p.asking.value = !1;
    }
    const $ = C([]), O = b(() => $.value.filter((u) => u.state === "loaded"));
    async function B() {
      const u = r.agent && r.run ? await r.run(["agent-skill", "list", "--agent", String(r.agent.id)]) : null;
      $.value = u != null && u.ok ? u.value.rows ?? [] : [];
    }
    function E(u) {
      w(u, "skills"), B();
    }
    le(() => {
      var u;
      return (u = r.agent) == null ? void 0 : u.id;
    }, B, { immediate: !0 });
    const P = (u) => p.groups.value.some((t) => t.key === u), T = b(() => {
      var u;
      return p.chosen.value.model ?? ((u = z.value) == null ? void 0 : u.model) ?? "";
    }), I = b(() => {
      var u;
      return p.chosen.value.effort ?? ((u = z.value) == null ? void 0 : u.effort) ?? "";
    });
    b(() => !!r.agent && !r.agent.ended_at);
    const z = b(() => {
      var u;
      return ((u = r.usage.agents) == null ? void 0 : u.find((t) => {
        var a;
        return t.id === ((a = r.agent) == null ? void 0 : a.id);
      })) ?? null;
    }), q = b(() => {
      var u;
      return ((u = r.usage.windows) == null ? void 0 : u[0]) ?? null;
    }), F = b(() => q.value ? Math.max(0, Math.min(100, Math.round(q.value.used_percent))) : null), N = b(() => {
      var u;
      return ((u = z.value) == null ? void 0 : u.context_percent) == null ? null : Math.round(z.value.context_percent);
    }), _ = b(() => {
      var u;
      return (u = z.value) != null && u.cost_dollars ? `$${z.value.cost_dollars.toFixed(2)}` : "";
    }), J = b(() => {
      var a;
      const u = (a = r.agent) != null && a.process_started_at ? new Date(r.agent.process_started_at).getTime() : 0;
      if (!u) return "";
      const t = Math.max(0, Math.floor((r.now - u) / 6e4));
      return t >= 60 ? `${Math.floor(t / 60)}h ${t % 60}m` : `${t}m`;
    });
    return (u, t) => (n(), o("div", {
      class: X(["information", { card: e.card }]),
      "data-information-bar": ""
    }, [
      e.agent ? (n(), o(H, { key: 0 }, [
        g("button", {
          type: "button",
          class: "fact lead",
          disabled: e.card,
          "data-fact": "agent",
          title: `Session ${e.agent.session}: stop it`,
          onClick: t[0] || (t[0] = (a) => w(a, "agent"))
        }, [
          y(Z, {
            name: "agents",
            size: 12
          }),
          h(" " + c(v(ya)(e.agent.program)), 1)
        ], 8, wa),
        F.value !== null ? (n(), o("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${F.value}% of the plan's ${q.value.title} allowance used`,
          onClick: t[1] || (t[1] = (a) => l("open", "usage", a.currentTarget))
        }, [
          y(Z, {
            name: "clock",
            size: 12
          }),
          t[14] || (t[14] = h()),
          g("span", $a, [
            g("span", {
              style: oe({ width: `${F.value}%` })
            }, null, 4)
          ]),
          h(" " + c(F.value) + "% ", 1)
        ], 8, Ma)) : m("", !0),
        N.value !== null ? (n(), o("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "context",
          title: `Context ${N.value}% full: clear or compact it`,
          onClick: t[2] || (t[2] = (a) => P("context") ? w(a, "context") : l("open", "context", a.currentTarget))
        }, [
          y(Z, {
            name: "gauge",
            size: 12
          }),
          t[15] || (t[15] = h()),
          g("span", Ca, [
            g("span", {
              style: oe({ width: `${N.value}%` })
            }, null, 4)
          ]),
          h(" " + c(N.value) + "% ", 1)
        ], 8, xa)) : m("", !0),
        T.value ? (n(), o("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "model",
          title: `${T.value}: change the model`,
          onClick: t[3] || (t[3] = (a) => P("model") ? w(a, "model") : null)
        }, [
          y(Z, {
            name: "model",
            size: 12
          }),
          h(" " + c(T.value), 1)
        ], 8, Sa)) : m("", !0),
        P("effort") || e.card && I.value ? (n(), o("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: t[4] || (t[4] = (a) => w(a, "effort"))
        }, [
          y(Z, {
            name: "bolt",
            size: 12
          }),
          h(" " + c(I.value), 1)
        ], 8, Aa)) : m("", !0),
        _.value ? (n(), o("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: t[5] || (t[5] = (a) => l("open", "cost", a.currentTarget))
        }, c(_.value), 9, ja)) : m("", !0),
        J.value ? (n(), o("span", Ra, [
          y(Z, {
            name: "reminders",
            size: 12
          }),
          h(" " + c(J.value), 1)
        ])) : m("", !0),
        e.branch ? (n(), o("span", Ta, [
          y(Z, {
            name: "branch",
            size: 12
          }),
          h(" " + c(e.branch), 1)
        ])) : m("", !0),
        e.card ? m("", !0) : (n(), o("button", {
          key: 7,
          type: "button",
          class: X(["fact", { none: !e.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: t[6] || (t[6] = (a) => l("open", "jobs", a.currentTarget))
        }, [
          y(Z, {
            name: "clock",
            size: 12
          }),
          h(" " + c(e.jobs), 1)
        ], 2)),
        e.run ? (n(), o("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: E
        }, [
          y(Z, {
            name: "book",
            size: 12
          }),
          h(" " + c(O.value.length), 1)
        ])) : m("", !0),
        e.fitness ? (n(), o(H, { key: 9 }, [
          g("button", {
            type: "button",
            class: X(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Ba }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: t[7] || (t[7] = (a) => l("open", "fitness", a.currentTarget))
          }, [
            y(Z, {
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
            y(Z, {
              name: "weight",
              size: 12
            }),
            h(" " + c(e.fitness.workload), 1)
          ], 2)
        ], 64)) : m("", !0)
      ], 64)) : e.run && !e.loading ? (n(), o("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: t[9] || (t[9] = (a) => w(a, "start"))
      }, [
        y(Z, {
          name: "agents",
          size: 12
        }),
        t[16] || (t[16] = h(" Start an agent", -1))
      ])) : m("", !0),
      t[22] || (t[22] = g("span", { class: "space" }, null, -1)),
      v(p).failure.value ? (n(), o("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: v(p).failure.value
      }, c(v(p).failure.value), 9, za)) : m("", !0),
      ve(u.$slots, "default", {}, void 0, !0),
      k.value ? (n(), W(ma, {
        key: 3,
        anchor: k.value,
        "min-width": 190,
        onClose: L
      }, {
        default: A(() => {
          var a;
          return [
            x.value === "agent" ? (n(), o(H, { key: 0 }, [
              v(p).asking.value ? (n(), o(H, { key: 0 }, [
                y(ge, { "data-agent-stop-ask": "" }, {
                  default: A(() => [...t[17] || (t[17] = [
                    h("Stop the agent? It stops what it is doing.", -1)
                  ])]),
                  _: 1
                }),
                y(de, {
                  "data-agent-stop-confirm": "",
                  onClick: t[10] || (t[10] = (s) => (L(), v(p).stop()))
                }, {
                  default: A(() => [...t[18] || (t[18] = [
                    h("Stop it", -1)
                  ])]),
                  _: 1
                }),
                y(de, {
                  onClick: t[11] || (t[11] = (s) => v(p).asking.value = !1)
                }, {
                  default: A(() => [...t[19] || (t[19] = [
                    h("Keep it running", -1)
                  ])]),
                  _: 1
                })
              ], 64)) : (n(), W(de, {
                key: 1,
                "data-agent-stop": "",
                onClick: t[12] || (t[12] = (s) => v(p).asking.value = !0)
              }, {
                default: A(() => [...t[20] || (t[20] = [
                  h("Stop", -1)
                ])]),
                _: 1
              }))
            ], 64)) : x.value === "start" ? (n(), o(H, { key: 1 }, [
              y(ge, null, {
                default: A(() => [...t[21] || (t[21] = [
                  h("Start an agent", -1)
                ])]),
                _: 1
              }),
              (n(!0), o(H, null, K(v(p).programs.value, (s) => (n(), W(de, {
                key: s.name,
                "data-agent-program": s.name,
                onClick: (S) => (L(), v(p).start(s))
              }, {
                default: A(() => [
                  h(c(s.title), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-program", "onClick"]))), 128))
            ], 64)) : x.value === "skills" ? (n(), W(da, {
              key: 2,
              skills: $.value,
              onBrowse: t[13] || (t[13] = (s) => (L(), l("open", "skills", null)))
            }, null, 8, ["skills"])) : f.value ? (n(), o(H, { key: 3 }, [
              y(ge, null, {
                default: A(() => [
                  h(c(f.value.label), 1)
                ]),
                _: 1
              }),
              x.value === "context" ? (n(), o(H, { key: 0 }, [
                g("div", Oa, [
                  g("span", Va, [
                    g("span", {
                      style: oe({ width: `${N.value}%` })
                    }, null, 4)
                  ]),
                  g("span", Ha, c(N.value) + "%", 1)
                ]),
                g("p", La, c(v(ba)(((a = z.value) == null ? void 0 : a.last_compaction) ?? null)), 1)
              ], 64)) : m("", !0),
              (n(!0), o(H, null, K(f.value.choices, (s) => (n(), W(de, {
                key: s.value,
                "data-agent-choice": s.value,
                onClick: (S) => (v(p).choose(f.value.key, s), L())
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
}, Ea = /* @__PURE__ */ G(Ia, [["__scopeId", "data-v-d5933ce4"]]), Na = ["data-agent-open", "aria-expanded", "role", "tabindex"], Wa = { class: "agent-head" }, qa = ["data-state"], Fa = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Da = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Pa = { class: "agent-times" }, _a = {
  key: 0,
  class: "agent-time",
  "data-agent-motion": ""
}, Ja = {
  key: 1,
  class: "agent-time",
  "data-agent-motion": ""
}, Ua = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": ""
}, Ka = { class: "agent-line" }, Za = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Ga = {
  key: 0,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Ya = {
  key: 1,
  class: "agent-line"
}, Qa = {
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, Xa = {
  key: 2,
  class: "agent-line agent-work-start"
}, en = ["data-peek"], tn = ["title"], an = ["data-peek"], nn = ["data-agent-waiting", "data-agent-stopped"], ln = {
  key: 1,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, sn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: i }) {
    const r = { helper: "Helper", reviewer: "Reviewer" }, l = e, p = i, k = rt(), x = b(() => {
      var a, s;
      if ((a = l.facts) != null && a.profile_title) return l.facts.profile_title;
      if ((s = l.facts) != null && s.profile) return l.facts.profile;
      const t = r[l.row.role] || l.row.role;
      return t.slice(0, 1).toUpperCase() + t.slice(1);
    }), f = b(() => {
      var t;
      return ((t = l.facts) == null ? void 0 : t.tasks) ?? [];
    }), w = b(() => f.value.filter((t) => t.state === "open")), L = b(() => {
      const t = f.value.find((a) => {
        var s;
        return a.id === ((s = l.facts) == null ? void 0 : s.task_id);
      });
      return t != null && t.plan_id ? t : w.value.find((a) => a.plan_id);
    }), $ = b(() => {
      var t, a, s, S, d;
      return l.row.role === "helper" ? ((t = l.facts) == null ? void 0 : t.helper_job) || "" : (a = l.facts) != null && a.job_enabled && (((s = l.facts) == null ? void 0 : s.task_title) || ((S = w.value[0]) == null ? void 0 : S.title) || ((d = f.value.at(-1)) == null ? void 0 : d.title)) || "";
    }), O = b(() => {
      const t = $.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return t ? `${t[1].toLowerCase() === "plan" ? "plans" : "docs"}:${t[2]}` : "";
    }), B = b(() => {
      var t, a;
      return [l.row.program, (t = l.facts) == null ? void 0 : t.model, (a = l.facts) == null ? void 0 : a.effort, l.row.role === "worker" ? `worker ${l.row.id}` : ""].filter(Boolean).join(" · ");
    }), E = he(), P = b(() => ut(l.row.process_started_at || l.row.created_at, k.value)), T = /* @__PURE__ */ new Set(["open", "started", "testing"]), I = b(() => !!l.row.ended_at && l.row.role !== "main" && f.value.some((t) => T.has(t.state))), z = b(() => {
      var t;
      return l.row.retired_at || l.row.state === "retired" ? "retired" : l.waitReason || I.value ? "waiting" : l.row.state === "running" && ((t = l.facts) == null ? void 0 : t.state) || l.row.state;
    }), q = b(() => l.waitReason ? `Waiting: ${l.waitReason}` : z.value === "blocked" ? "Blocked" : I.value ? "Stopped with work left" : ""), F = b(() => {
      var t;
      return ((t = l.progress) == null ? void 0 : t.completed_count) ?? f.value.filter((a) => a.state === "completed").length;
    }), N = b(() => {
      var t;
      return ((t = l.progress) == null ? void 0 : t.task_count) ?? f.value.length;
    }), _ = b(() => `${F.value} of ${N.value} ${N.value === 1 ? "task" : "tasks"}`), J = b(() => {
      var a;
      const t = dt(F.value, ((a = l.progress) == null ? void 0 : a.started_at) || l.row.created_at, l.progress ? l.progress.finished_at : l.row.ended_at, k.value);
      return l.row.role !== "main" && t ? `${t} per hour` : "";
    }), u = b(() => !!l.row.retired_at || l.row.state === "retired");
    return (t, a) => {
      var s, S, d;
      return n(), o("div", {
        class: X(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: a[4] || (a[4] = (j) => !e.open && p("toggle")),
        onKeydown: [
          a[5] || (a[5] = Oe(Q((j) => !e.open && p("toggle"), ["self", "prevent"]), ["enter"])),
          a[6] || (a[6] = Oe(Q((j) => !e.open && p("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        g("span", Wa, [
          e.open ? (n(), o("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: a[0] || (a[0] = Q((j) => p("toggle"), ["stop"]))
          }, [
            y(v($e), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : m("", !0),
          g("span", {
            class: "agent-dot",
            "data-state": z.value,
            "data-agent-motion": ""
          }, null, 8, qa),
          g("span", Fa, c(x.value), 1),
          g("span", Da, c(((s = e.facts) == null ? void 0 : s.given_name) || e.row.id), 1),
          e.open ? m("", !0) : (n(), W(v($e), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          g("span", Pa, [
            u.value ? (n(), o("span", _a, [
              a[7] || (a[7] = h("Retired, ", -1)),
              y(v(Se), {
                at: e.row.retired_at
              }, null, 8, ["at"])
            ])) : e.row.ended_at ? (n(), o("span", Ja, [
              a[8] || (a[8] = h("Idle, ", -1)),
              y(v(Se), {
                at: e.row.ended_at
              }, null, 8, ["at"])
            ])) : (n(), o("span", Ua, c(P.value), 1))
          ])
        ]),
        g("span", Ka, [
          g("span", Za, c(e.open && e.row.role === "worker" ? `worker ${e.row.id}` : e.open ? "" : B.value), 1),
          e.open && ((S = e.facts) != null && S.last_activity) ? (n(), o("span", Ga, [
            a[9] || (a[9] = h("Last heard: ", -1)),
            y(v(Se), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : m("", !0)
        ]),
        e.open ? (n(), W(Ea, {
          key: 0,
          agent: e.row,
          branch: (d = e.progress) == null ? void 0 : d.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: [] },
          card: ""
        }, {
          default: A(() => [
            e.row.role === "helper" && !e.row.ended_at ? (n(), W(v(te), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: a[1] || (a[1] = Q((j) => v(E).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: A(() => [...a[10] || (a[10] = [
                h("Stop", -1)
              ])]),
              _: 1
            })) : m("", !0)
          ]),
          _: 1
        }, 8, ["agent", "branch", "usage"])) : m("", !0),
        e.open && N.value && !$.value ? (n(), o("span", Ya, [
          g("span", Qa, c(_.value), 1)
        ])) : m("", !0),
        e.open && L.value ? (n(), o("span", Xa, [
          g("button", {
            type: "button",
            class: "agent-plan",
            "data-agent-plan": "",
            "data-peek": `plans:${L.value.plan_id}`,
            onClick: a[2] || (a[2] = Q((j) => v(pe)(`plans:${L.value.plan_id}`), ["stop"]))
          }, "Plan " + c(L.value.plan_id) + ": " + c(L.value.plan_title), 9, en)
        ])) : m("", !0),
        $.value || !e.open && q.value ? (n(), o("span", {
          key: 3,
          class: X(["agent-line", { "agent-work-start": !L.value }])
        }, [
          g("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: $.value
          }, [
            e.open && O.value ? (n(), o("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": O.value,
              onClick: a[3] || (a[3] = Q((j) => v(pe)(O.value), ["stop"]))
            }, c($.value), 9, an)) : (n(), o(H, { key: 1 }, [
              h(c($.value), 1)
            ], 64))
          ], 8, tn),
          !e.open && q.value ? (n(), o("span", {
            key: 0,
            class: "agent-work-status",
            "data-agent-waiting": e.waitReason ? "" : null,
            "data-agent-stopped": I.value && !e.waitReason ? "" : null
          }, c(q.value), 9, nn)) : m("", !0),
          e.open && N.value ? (n(), o("span", ln, c(_.value), 1)) : m("", !0)
        ], 2)) : m("", !0),
        e.open ? (n(), W(Xt, {
          key: 4,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: f.value,
          "stopped-with-work": I.value,
          open: e.open,
          "total-count": N.value,
          "tasks-per-hour": J.value
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open", "total-count", "tasks-per-hour"])) : m("", !0)
      ], 42, Na);
    };
  }
}, on = /* @__PURE__ */ G(sn, [["__scopeId", "data-v-be747254"]]), rn = {
  class: "agent-limits",
  "data-agent-limits": ""
}, un = ["aria-expanded"], dn = { key: 0 }, cn = { key: 1 }, gn = { class: "limits-panel" }, vn = { class: "limits-head" }, pn = ["data-agent-limit-type", "data-agent-limit-profile"], hn = { class: "count" }, mn = { class: "bar" }, fn = { class: "count" }, kn = { class: "bar" }, yn = ["data-agent-limit-type"], bn = { class: "limit-field" }, wn = { class: "limit-field" }, Mn = {
  key: 1,
  role: "alert"
}, $n = {
  key: 2,
  role: "status"
}, xn = {
  __name: "AgentLimits",
  setup(e) {
    const i = he(), r = C([]), l = C({}), p = C(!1), k = C(!1), x = C(!1), f = C(""), w = C(""), L = (t) => t === 0 ? "no limit" : String(t), $ = (t, a) => a === 0 ? 0 : t > a ? 2 : t === a ? 1 : 0, O = b(() => r.value.flatMap((t) => t.per_profile && t.profiles.length ? t.profiles.map((a) => ({ ...a, label: a.title, type: t.key, key: `${t.key}:${a.profile}` })) : [t])), B = (t) => Math.max($(t.running, t.run_limit), $(t.kept, t.kept_limit)), E = b(() => O.value.filter((t) => B(t)).sort((t, a) => B(a) - B(t))), P = b(() => r.value.reduce((t, a) => t + a.running, 0)), T = b(() => r.value.reduce((t, a) => t + a.kept, 0)), I = (t) => {
      const a = [t.run_limit ? t.running - t.run_limit : -1, t.kept_limit ? t.kept - t.kept_limit : -1], s = Math.max(...a);
      return s > 0 ? `Over by ${s}` : s === 0 ? "At limit" : "Within limits";
    }, z = (t, a) => a ? `${Math.min(t / Math.max(t, a) * 100, 100)}%` : "0%", q = (t, a) => a && t > a ? `${(t - a) / t * 100}%` : "0%";
    let F = 0;
    async function N() {
      const t = ++F, a = await i.read("agent limits");
      t === F && (r.value = a.ok ? a.value.rows : [], f.value = a.ok ? "" : a.error);
    }
    async function _(t) {
      const a = await Promise.all(r.value.flatMap((s) => [s.run_setting, s.kept_setting]).map(async (s) => {
        const S = await i.read(`setting show ${s}`);
        return [s, S.ok ? S.value.source : ""];
      }));
      t === F && (l.value = Object.fromEntries(a));
    }
    async function J() {
      k.value = !k.value, k.value && await _(F);
    }
    async function u(t, a, s, S) {
      if (x.value || i.readOnly) return;
      const d = Number(S.target.value);
      if (!Number.isInteger(d) || d < 0 || !S.target.value.trim()) {
        f.value = "Use a whole number of 0 or more.", S.target.value = String(s);
        return;
      }
      x.value = !0, w.value = "";
      try {
        const j = await i.run(["setting", "set", a, String(d), "--environment", i.environment]);
        if (f.value = j.ok ? "" : j.error, !j.ok) {
          S.target.value = String(s);
          return;
        }
        await N(), w.value = `${t.label} limits saved.`;
      } finally {
        x.value = !1;
      }
    }
    return i.follow(["agent.*", "setting.*"], N), N(), (t, a) => (n(), o("section", rn, [
      r.value.length ? (n(), o(H, { key: 0 }, [
        g("button", {
          class: "summary",
          type: "button",
          "aria-expanded": p.value,
          onClick: a[0] || (a[0] = (s) => p.value = !p.value)
        }, [
          E.value.length ? (n(), o(H, { key: 0 }, [
            (n(!0), o(H, null, K(E.value.slice(0, 2), (s) => (n(), o("span", {
              key: s.key,
              class: "summary-item"
            }, [
              g("span", {
                class: X(["mark", { over: B(s) === 2 }])
              }, null, 2),
              h(c(s.label) + ": " + c(I(s)), 1)
            ]))), 128)),
            E.value.length > 2 ? (n(), o("span", dn, c(E.value.length - 2) + " more", 1)) : m("", !0)
          ], 64)) : (n(), o("span", cn, "All within limits, " + c(P.value) + " running, " + c(T.value) + " kept", 1)),
          y(v($e), {
            name: "caret",
            size: 12
          })
        ], 8, un),
        et(g("div", gn, [
          g("div", vn, [
            a[1] || (a[1] = g("strong", null, "Agent limits", -1)),
            y(v(te), {
              small: "",
              disabled: x.value || v(i).readOnly,
              "data-agent-limits-edit": "",
              onClick: J
            }, {
              default: A(() => [
                h(c(k.value ? "Done" : "Edit limits"), 1)
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          k.value ? (n(), o(H, { key: 1 }, [
            (n(!0), o(H, null, K(r.value, (s) => (n(), o("div", {
              key: s.key,
              class: "edit-row",
              "data-agent-limit-type": s.key
            }, [
              g("strong", null, c(s.label), 1),
              g("label", bn, [
                g("span", null, [
                  a[3] || (a[3] = h("Running", -1)),
                  s.per_profile ? (n(), o(H, { key: 0 }, [
                    h(" per profile")
                  ], 64)) : m("", !0)
                ]),
                y(v(je), {
                  type: "number",
                  min: "0",
                  value: String(s.run_limit),
                  disabled: x.value || v(i).readOnly,
                  "data-agent-run-limit": s.key,
                  onChange: (S) => u(s, s.run_setting, s.run_limit, S)
                }, null, 8, ["value", "disabled", "data-agent-run-limit", "onChange"]),
                g("small", null, c(l.value[s.run_setting]), 1)
              ]),
              g("label", wn, [
                g("span", null, [
                  a[4] || (a[4] = h("Kept", -1)),
                  s.per_profile ? (n(), o(H, { key: 0 }, [
                    h(" per profile")
                  ], 64)) : m("", !0)
                ]),
                y(v(je), {
                  type: "number",
                  min: "0",
                  value: String(s.kept_limit),
                  disabled: x.value || v(i).readOnly,
                  "data-agent-kept-limit": s.key,
                  onChange: (S) => u(s, s.kept_setting, s.kept_limit, S)
                }, null, 8, ["value", "disabled", "data-agent-kept-limit", "onChange"]),
                g("small", null, c(l.value[s.kept_setting]), 1)
              ])
            ], 8, yn))), 128)),
            g("p", null, "Running 0 starts no agents. Kept 0 means no limit. Changes apply to " + c(v(i).environment) + ".", 1)
          ], 64)) : (n(), o(H, { key: 0 }, [
            a[2] || (a[2] = g("div", { class: "table-head" }, [
              g("span", null, "Agent"),
              g("span", null, "Running"),
              g("span", null, "Kept"),
              g("span", null, "Status")
            ], -1)),
            (n(!0), o(H, null, K(O.value, (s) => (n(), o("div", {
              key: s.key,
              class: "limit-row",
              "data-agent-limit-type": s.type || s.key,
              "data-agent-limit-profile": s.profile
            }, [
              g("strong", null, c(s.label), 1),
              g("div", hn, [
                g("span", null, c(s.run_limit ? `${s.running} of ${s.run_limit}` : `${s.running} · none may start`), 1),
                g("div", mn, [
                  g("span", {
                    style: oe({ width: z(s.running, s.run_limit) })
                  }, null, 4),
                  g("i", {
                    style: oe({ width: q(s.running, s.run_limit) })
                  }, null, 4)
                ])
              ]),
              g("div", fn, [
                g("span", null, c(s.kept) + " of " + c(L(s.kept_limit)), 1),
                g("div", kn, [
                  g("span", {
                    style: oe({ width: z(s.kept, s.kept_limit) })
                  }, null, 4),
                  g("i", {
                    style: oe({ width: q(s.kept, s.kept_limit) })
                  }, null, 4)
                ])
              ]),
              g("span", {
                class: X(["status", { warning: B(s) === 1, danger: B(s) === 2 }])
              }, c(I(s)), 3)
            ], 8, pn))), 128))
          ], 64))
        ], 512), [
          [tt, p.value]
        ])
      ], 64)) : m("", !0),
      f.value ? (n(), o("p", Mn, c(f.value), 1)) : m("", !0),
      w.value ? (n(), o("p", $n, c(w.value), 1)) : m("", !0)
    ]));
  }
}, Cn = /* @__PURE__ */ G(xn, [["__scopeId", "data-v-d42b4bd2"]]), Sn = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, An = ["data-agent-row"], Le = "journal.agents.filters", Me = "cubic-bezier(0.2, 0.9, 0.25, 1)", jn = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const i = e, { rows: r } = Ne("usage agents --closed", ["agent.*", "task.*", "hook_call.*", "helper_job.*"]), { rows: l } = He("waits"), { rows: p } = He("progress"), k = (R) => p.value.find((V) => V.agent_id === R.id) ?? null, x = (R) => {
      var V;
      return ((V = l.value.find((M) => M.agent_id === R.id)) == null ? void 0 : V.reason) ?? "";
    }, f = C("running"), w = C(""), L = JSON.parse(localStorage.getItem(Le) || '{"roles":[],"profiles":[],"programs":[]}'), $ = C(L), O = C({ roles: [], profiles: [], states: [], upgrade_retired: 0 }), B = C([]), E = b(() => $.value.roles.length + $.value.profiles.length + $.value.programs.length), P = (R, V) => {
      $.value = pt($.value, R, V);
    }, T = () => {
      $.value = { roles: [], profiles: [], programs: [] };
    }, I = (R) => R.slice(0, 1).toUpperCase() + R.slice(1);
    le($, (R) => localStorage.setItem(Le, JSON.stringify(R)));
    const z = he();
    async function q() {
      const [R, V] = await Promise.all([z.read("agent cards --options"), z.read("agent programs")]);
      R.ok && (O.value = R.value), V.ok && (B.value = V.value.rows);
    }
    z.follow(["agent.*"], q), q();
    const F = C([]), N = C(""), _ = C(!1), J = C(!1), u = C(25);
    let t = 0;
    async function a() {
      const R = ++t, V = [
        ...$.value.roles.map((D) => `--role ${JSON.stringify(D)}`),
        ...$.value.profiles.map((D) => `--profile ${JSON.stringify(D)}`),
        ...$.value.programs.map((D) => `--program ${JSON.stringify(D)}`)
      ].join(" "), M = await z.read(`${i.line} --show ${f.value} --search ${JSON.stringify(w.value)} --limit ${u.value} ${V}`);
      R === t && (F.value = M.ok ? M.value.rows : [], N.value = M.ok ? "" : M.error, J.value = M.ok && M.value.page * M.value.size < M.value.total, _.value = !0);
    }
    async function s() {
      return u.value += 25, await a(), !0;
    }
    le([f, w, $], () => {
      u.value = 25, a();
    }), z.follow(["agent.*", "task.*", ...z.sources.flatMap((R) => R.events)], We(a, qe.pageOfAgents)), a();
    const S = (R) => r.value.find((V) => V.id === R.id) ?? R.facts ?? null, d = F, j = b(() => !!w.value.trim() || E.value > 0), U = b(() => i.texts[f.value] ?? { title: i.empty, hint: "" }), Y = C(null), ae = C(null), ce = C(null), ne = b(() => d.value.find((R) => R.id === Y.value) ?? null), me = b(() => ne.value ? [ne.value] : d.value), fe = b(() => d.value.length - me.value.length), ke = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ie = !1, Te = 0;
    async function Pe(R) {
      if (ie) return;
      ie = !0, Te = ce.value.scrollTop;
      const V = ae.value.querySelector(`[data-agent-open="${R.id}"]`);
      if (!ke()) {
        const se = [...ae.value.querySelectorAll(".agent-row")].filter((ee) => !ee.contains(V));
        await Promise.all(se.map((ee) => ee.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const M = [...V.querySelectorAll(".agent-head, .agent-line")], D = [...M, ...V.querySelectorAll("[data-agent-motion]")], ye = D.map((se) => se.getBoundingClientRect());
      if (Y.value = R.id, await Ve(), !ke()) {
        const se = D.map((ee) => ee.getBoundingClientRect());
        D.forEach((ee, be) => {
          const re = M.indexOf(ee.parentElement), Je = ye[be].left - se[be].left - (re < 0 ? 0 : ye[re].left - se[re].left), Ue = ye[be].top - se[be].top - (re < 0 ? 0 : ye[re].top - se[re].top);
          ee.animate([{ transform: `translate(${Je}px, ${Ue}px)` }, { transform: "none" }], { duration: 280, easing: Me });
        }), ae.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((ee) => {
          ee.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Me, fill: "backwards" });
        });
      }
      ie = !1;
    }
    async function Ce() {
      if (ie || !ne.value) return;
      ie = !0;
      const R = ae.value.querySelector(`[data-agent-open="${Y.value}"]`), V = [...R.children, ...ae.value.querySelectorAll(".agents-held")], M = ke() ? [] : V.map((D) => D.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(M.map((D) => D.finished)), Y.value = null, await Ve(), ce.value.scrollTop = Te, M.forEach((D) => D.cancel()), ke() || (R.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Me }), ae.value.querySelectorAll(".agent-row").forEach((D) => {
        D.contains(R) || D.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Me });
      })), ie = !1;
    }
    const _e = (R) => Y.value === R.id ? Ce() : Pe(R);
    le(w, (R) => R.trim() && (Y.value = null)), le(f, () => {
      Y.value = null;
    });
    const ze = (R) => {
      R.key === "Escape" && Ce();
    };
    return window.addEventListener("keydown", ze), xe(() => window.removeEventListener("keydown", ze)), (R, V) => (n(), o("div", {
      ref_key: "agents",
      ref: ae,
      class: X(["agents", { focused: ne.value }])
    }, [
      y(Cn),
      y(v(ct), {
        modelValue: w.value,
        "onUpdate:modelValue": V[1] || (V[1] = (M) => w.value = M),
        placeholder: "Search agents",
        "menu-count": E.value,
        "data-agents-search": ""
      }, {
        menu: A(() => [
          y(v(Ae), null, {
            default: A(() => [...V[2] || (V[2] = [
              h("Type", -1)
            ])]),
            _: 1
          }),
          (n(!0), o(H, null, K(O.value.roles, (M) => (n(), W(v(we), {
            key: M,
            role: "menuitemcheckbox",
            "aria-checked": $.value.roles.includes(M),
            checked: $.value.roles.includes(M),
            "data-filter-role": M,
            onClick: (D) => P("roles", M)
          }, {
            default: A(() => [
              h(c(I(M)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          O.value.profiles.length ? (n(), W(v(Ae), { key: 0 }, {
            default: A(() => [...V[3] || (V[3] = [
              h("Profile", -1)
            ])]),
            _: 1
          })) : m("", !0),
          (n(!0), o(H, null, K(O.value.profiles, (M) => (n(), W(v(we), {
            key: M.name,
            role: "menuitemcheckbox",
            "aria-checked": $.value.profiles.includes(M.name),
            checked: $.value.profiles.includes(M.name),
            "data-filter-profile": M.name,
            onClick: (D) => P("profiles", M.name)
          }, {
            default: A(() => [
              h(c(M.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          y(v(Ae), null, {
            default: A(() => [...V[4] || (V[4] = [
              h("Program", -1)
            ])]),
            _: 1
          }),
          (n(!0), o(H, null, K(B.value, (M) => (n(), W(v(we), {
            key: M.name,
            role: "menuitemcheckbox",
            "aria-checked": $.value.programs.includes(M.name),
            checked: $.value.programs.includes(M.name),
            "data-filter-program": M.name,
            onClick: (D) => P("programs", M.name)
          }, {
            default: A(() => [
              h(c(M.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          E.value ? (n(), W(v(we), {
            key: 1,
            "data-filter-clear": "",
            onClick: T
          }, {
            default: A(() => [...V[5] || (V[5] = [
              h("Clear filters", -1)
            ])]),
            _: 1
          })) : m("", !0)
        ]),
        default: A(() => [
          y(v(gt), {
            options: O.value.states,
            value: f.value,
            onPick: V[0] || (V[0] = (M) => f.value = M)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      f.value === "retired" && O.value.upgrade_retired ? (n(), o("p", Sn, "Retired during the upgrade: " + c(O.value.upgrade_retired), 1)) : m("", !0),
      g("div", {
        ref_key: "list",
        ref: ce,
        class: X(["agents-view", { "agents-view-open": ne.value }])
      }, [
        _.value && !N.value && !me.value.length && E.value ? (n(), W(v(Re), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: A(() => [
            y(v(te), {
              small: "",
              "data-empty-clear": "",
              onClick: T
            }, {
              default: A(() => [...V[6] || (V[6] = [
                h("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (n(), W(v(vt), {
          key: 1,
          rows: me.value,
          failure: N.value,
          loaded: _.value,
          more: !ne.value && J.value,
          older: s,
          empty: U.value.title,
          hint: U.value.hint,
          searching: j.value
        }, {
          default: A(({ row: M }) => [
            g("div", {
              class: "agent-row",
              "data-agent-row": M.id
            }, [
              y(on, {
                row: M,
                facts: S(M),
                progress: k(M),
                "wait-reason": x(M),
                open: M.id === Y.value,
                onToggle: (D) => _e(M)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, An)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2),
      ne.value && fe.value ? (n(), o("button", {
        key: 1,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: Ce
      }, c(fe.value) + " more", 1)) : m("", !0)
    ], 2));
  }
}, On = /* @__PURE__ */ G(jn, [["__scopeId", "data-v-c7305f3d"]]);
export {
  On as A
};
