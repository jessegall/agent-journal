/* @code-commandments-generated */
import { openBlock as t, createElementBlock as o, withModifiers as le, unref as u, createTextVNode as f, toDisplayString as p, createVNode as y, createBlock as F, withCtx as A, Fragment as H, renderList as Q, createElementVNode as d, createCommentVNode as h, computed as w, ref as O, watch as re, onUnmounted as be, defineAsyncComponent as Ue, createSlots as Ke, resolveDynamicComponent as Je, normalizeStyle as ge, normalizeClass as se, renderSlot as we, onMounted as Ze, Teleport as Ge, mergeProps as Ye, toRef as je, withKeys as Be, useModel as Qe, mergeModels as Xe, nextTick as Ve } from "vue";
import { peekRef as Ae, Icon as me, RunningCommand as _e, FoldGroup as He, TaskStatusIcon as et, useWindow as fe, loadWindowComponent as tt, coalesced as at, READ_RATES as nt, InnerTabs as lt, TabBody as ot, SwitchCase as Ie, EmptyState as Re, Btn as ee, TextArea as st, TextInput as rt, useNow as Ee, age as Ne, perHour as it, TimeAgo as ke, Dialog as ut, SearchBar as dt, Segmented as ct, MenuLabel as Te, MenuItem as Ce, RowList as vt, toggleFilter as pt } from "@journal/window-kit";
import { _, T as gt } from "./TranscriptRows-CG9aRNTl.js";
const mt = {
  class: "agent-command",
  "data-agent-command": ""
}, ft = {
  key: 1,
  "data-agent-stopped": ""
}, ht = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (s, l) => (t(), o("span", mt, [
      e.waitReason ? (t(), o("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: l[0] || (l[0] = le((n) => u(Ae)("test_queue:0"), ["stop"]))
      }, [
        f("Waiting: " + p(e.waitReason) + " ", 1),
        y(u(me), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (t(), o("span", ft, "Waiting")) : (t(), F(u(_e), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, kt = /* @__PURE__ */ _(ht, [["__scopeId", "data-v-1b371fb5"]]), yt = ["data-agent-delegated", "onClick"], bt = { class: "agent-task-number" }, wt = { class: "agent-task-title" }, Mt = ["title"], $t = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: s }) {
    const l = s;
    return (n, r) => (t(), F(u(He), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: r[0] || (r[0] = (m) => l("toggle"))
    }, {
      default: A(() => [
        (t(!0), o(H, null, Q(e.section.tasks, (m) => (t(), o("button", {
          key: m.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": m.id,
          onClick: (k) => u(Ae)(`tasks:${m.id}`)
        }, [
          y(u(et), {
            status: m.state
          }, null, 8, ["status"]),
          d("span", bt, p(m.id), 1),
          d("span", wt, p(m.title), 1),
          m.plan_id ? (t(), o("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${m.plan_id}: ${m.plan_title}`
          }, "Plan " + p(m.plan_id) + ": " + p(m.plan_title), 9, Mt)) : h("", !0)
        ], 8, yt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, xt = /* @__PURE__ */ _($t, [["__scopeId", "data-v-238ff959"]]), Ct = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, St = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, At = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, jt = ["data-peek", "onClick"], Tt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Rt = {
  key: 0,
  class: "agent-helper-brief"
}, Ot = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, zt = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Bt = "It ended without a report", Vt = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const s = e, l = ["started", "blocked", "open", "completed"], n = w(() => {
      var a, i;
      return s.row.ended_at && ((i = (a = s.facts) == null ? void 0 : a.job_returned) != null && i.startsWith(Bt)) ? s.facts.job_returned : "";
    }), r = w(() => s.tasks.length ? l.map((a) => ({ state: a, label: a.slice(0, 1).toUpperCase() + a.slice(1), tasks: s.tasks.filter((i) => i.state === a || a === "started" && i.state === "testing" || a === "completed" && i.state === "cancelled") })) : []), m = /* @__PURE__ */ new Set(["completed"]), k = O({}), M = (a) => !(k.value[a] ?? m.has(a)), j = (a) => k.value = { ...k.value, [a]: M(a) }, T = fe(), { rows: N } = T.props.reports;
    T.state["reports.agent"] = String(s.row.id);
    const U = w(() => s.row.access === "read-only"), B = w(() => !!s.row.retired_at || s.row.state === "retired"), P = ["tasks", "transcript", "terminal", "file-feed", "reports"], R = w(() => (B.value ? T.tabs.filter((i) => ["reports", "transcript"].includes(i.key)) : U.value ? T.tabs.filter((i) => ["reports", "transcript", "terminal"].includes(i.key)) : [...T.tabs]).sort((i, I) => (P.indexOf(i.key) < 0 ? P.length : P.indexOf(i.key)) - (P.indexOf(I.key) < 0 ? P.length : P.indexOf(I.key)))), L = () => U.value || B.value ? R.value.find((a) => a.key === "transcript") : R.value[0], q = O(L());
    re(q, (a) => {
      T.state.tab = (a == null ? void 0 : a.key) ?? "";
    }, { immediate: !0 }), be(() => {
      T.state.tab = "";
    }), re(R, (a) => {
      a.some((i) => {
        var I;
        return i.key === ((I = q.value) == null ? void 0 : I.key);
      }) || (q.value = a[0]);
    }), re(() => s.open, (a) => {
      a && (q.value = L());
    });
    const J = Object.fromEntries(T.tabs.filter((a) => a.component).map((a) => [a.key, Ue(() => tt(a.component))])), D = O(!1), { data: Y } = T.props.tool, K = w(() => {
      var a;
      return ((a = Y.value) == null ? void 0 : a.tool) ?? "";
    }), C = w(() => {
      var a;
      return ((a = Y.value) == null ? void 0 : a.note) ?? "";
    }), c = w(() => s.row.role !== "main" && (!s.row.ended_at || s.stoppedWithWork || s.waitReason));
    async function G() {
      !s.open || !c.value || (T.state["tool.agent"] = String(s.row.id), await T.reload("tool"));
    }
    const x = T.follow(["hook_call.*", "process_part.*"], at(G, nt.agentCommand));
    return be(() => x == null ? void 0 : x()), re(() => s.open, (a) => {
      a && G();
    }, { immediate: !0 }), (a, i) => {
      var I;
      return t(), o("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: i[2] || (i[2] = le(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (t(), o("p", Ct, "Retirement reason: " + p(e.row.retirement_reason), 1)) : h("", !0),
        e.row.resume_reason ? (t(), o("p", St, p(e.row.resume_reason), 1)) : h("", !0),
        c.value ? (t(), F(kt, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: K.value,
          note: C.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : h("", !0),
        n.value ? (t(), o("p", At, p(n.value), 1)) : h("", !0),
        y(u(lt), {
          class: "agent-tabs",
          tabs: R.value,
          active: q.value,
          answer: { tasks: e.tasks.length, reports: u(N).length },
          onChoose: i[0] || (i[0] = (v) => q.value = v)
        }, null, 8, ["tabs", "active", "answer"]),
        y(u(ot), {
          class: "agent-tab-body",
          tab: q.value,
          "data-agent-tab-body": (I = q.value) == null ? void 0 : I.key
        }, {
          default: A(() => {
            var v;
            return [
              y(u(Ie), {
                value: (v = q.value) == null ? void 0 : v.key
              }, Ke({
                reports: A(() => [
                  u(N).length ? h("", !0) : (t(), F(u(Re), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: A(() => [...i[3] || (i[3] = [
                      f("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (t(!0), o(H, null, Q(u(N), (S) => (t(), o("button", {
                    key: S.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${S.id}`,
                    onClick: (V) => u(Ae)(`messages:${S.id}`)
                  }, p(S.text), 9, jt))), 128))
                ]),
                tasks: A(() => {
                  var S;
                  return [
                    e.tasks.length ? h("", !0) : (t(), F(u(Re), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: A(() => [...i[4] || (i[4] = [
                        f("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (t(!0), o(H, null, Q(r.value, (V) => (t(), F(xt, {
                      key: V.state,
                      section: V,
                      open: M(V.state),
                      onToggle: (ae) => j(V.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (S = e.facts) != null && S.instruction ? (t(), o(H, { key: 1 }, [
                      i[5] || (i[5] = d("p", { class: "agent-label" }, "Instruction", -1)),
                      d("div", Tt, p(e.facts.instruction), 1)
                    ], 64)) : h("", !0)
                  ];
                }),
                transcript: A(() => {
                  var S;
                  return [
                    U.value ? (t(), o(H, { key: 0 }, [
                      (S = e.facts) != null && S.instruction ? (t(), o("div", Rt, [
                        y(u(He), {
                          label: "Instruction",
                          open: D.value,
                          "data-agent-section": "instruction",
                          onToggle: i[1] || (i[1] = (V) => D.value = !D.value)
                        }, {
                          default: A(() => [
                            d("div", Ot, p(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (t(), o("p", zt, "No job recorded")) : h("", !0)
                    ], 64)) : h("", !0),
                    y(gt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                Q(u(J), (S, V) => ({
                  name: V,
                  fn: A(() => [
                    (t(), F(Je(S), {
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
}, Lt = /* @__PURE__ */ _(Vt, [["__scopeId", "data-v-3f66c406"]]), Ht = { class: "action-field" }, It = ["value", "disabled"], Et = ["value"], Nt = { key: 1 }, qt = {
  key: 1,
  class: "action-field"
}, Wt = { class: "action-buttons" }, Ft = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (s, l) => (t(), o("form", {
      onSubmit: l[4] || (l[4] = le((n) => s.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (t(), o(H, { key: 0 }, [
        d("label", Ht, [
          l[6] || (l[6] = f("Task ", -1)),
          d("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: l[0] || (l[0] = (n) => s.$emit("update:task", n.target.value))
          }, [
            l[5] || (l[5] = d("option", { value: "" }, "Choose an open task", -1)),
            (t(!0), o(H, null, Q(e.tasks, (n) => (t(), o("option", {
              key: n.id,
              value: String(n.id)
            }, p(n.id) + ": " + p(n.title), 9, Et))), 128))
          ], 40, It)
        ]),
        e.moreTasks ? (t(), F(u(ee), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: l[1] || (l[1] = (n) => s.$emit("more"))
        }, {
          default: A(() => [...l[7] || (l[7] = [
            f("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : h("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (t(), o("p", Nt, "No open tasks.")) : h("", !0)
      ], 64)) : (t(), o("label", qt, [
        l[8] || (l[8] = f("Job", -1)),
        y(u(st), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: l[2] || (l[2] = (n) => s.$emit("update:text", n.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      d("div", Wt, [
        y(u(ee), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: A(() => [...l[9] || (l[9] = [
            f("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        y(u(ee), {
          small: "",
          disabled: e.pending,
          onClick: l[3] || (l[3] = (n) => s.$emit("cancel"))
        }, {
          default: A(() => [...l[10] || (l[10] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Pt = /* @__PURE__ */ _(Ft, [["__scopeId", "data-v-adde4158"]]), Dt = { class: "action-buttons" }, Ut = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (s, l) => (t(), o("form", {
      "data-agent-retire-confirm": "",
      onSubmit: l[2] || (l[2] = le((n) => s.$emit("submit"), ["prevent"]))
    }, [
      l[5] || (l[5] = d("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      y(u(rt), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": l[0] || (l[0] = (n) => s.$emit("update:reason", n))
      }, null, 8, ["model-value", "disabled"]),
      d("div", Dt, [
        y(u(ee), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: A(() => [...l[3] || (l[3] = [
            f("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        y(u(ee), {
          small: "",
          disabled: e.pending,
          onClick: l[1] || (l[1] = (n) => s.$emit("cancel"))
        }, {
          default: A(() => [...l[4] || (l[4] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, qe = /* @__PURE__ */ _(Ut, [["__scopeId", "data-v-23a905c0"]]), Kt = { class: "action-buttons" }, Jt = {
  key: 0,
  role: "alert"
}, Zt = {
  key: 1,
  role: "status"
}, Gt = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const s = e, l = fe(), n = O(""), r = O(""), m = O(""), k = O(""), M = O([]), j = O(0), T = O(!1), N = O(!1), U = O(!1), B = O(""), P = O(""), R = w(() => !!s.row.retired_at || s.row.state === "retired"), L = w(() => !R.value && !!s.row.ended_at), q = w(() => {
      var x;
      return L.value && ((x = s.row.job_command) == null ? void 0 : x.length) && !s.row.resume_reason;
    }), J = w(() => q.value && !N.value && (s.row.job_task_flag ? M.value.some((x) => String(x.id) === k.value) : !!r.value.trim()));
    function D(x) {
      n.value = x, r.value = "", m.value = "", k.value = "", B.value = "", P.value = "";
    }
    async function Y() {
      D("job"), s.row.job_task_flag && (M.value = [], j.value = 0, T.value = !1, await K());
    }
    async function K() {
      if (!N.value) {
        N.value = !0;
        try {
          l.state["jobs.page"] = String(j.value + 1), await l.reload("jobs");
          const x = l.props.jobs;
          B.value = x.failure.value, B.value || (M.value = [...M.value, ...x.rows.value], j.value = x.data.value.page, T.value = x.more.value);
        } finally {
          N.value = !1;
        }
      }
    }
    async function C(x, a) {
      if (!U.value) {
        U.value = !0, B.value = "";
        try {
          const i = await l.run(x);
          B.value = i.ok ? "" : i.error, i.ok && (D(""), P.value = a);
        } finally {
          U.value = !1;
        }
      }
    }
    async function c() {
      if (!J.value) return;
      const x = s.row.job_task_flag ? [s.row.job_task_flag, k.value] : [r.value.trim()];
      await C([...s.row.job_command, String(s.row.id), ...x], "Job sent.");
    }
    async function G() {
      !L.value || n.value !== "retire" || !m.value.trim() || await C(["agent", "retire", String(s.row.id), "--reason", m.value.trim()], "Agent retired permanently.");
    }
    return (x, a) => {
      var i;
      return R.value ? h("", !0) : (t(), o("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: a[6] || (a[6] = le(() => {
        }, ["stop"])),
        onKeydown: a[7] || (a[7] = le(() => {
        }, ["stop"]))
      }, [
        d("div", Kt, [
          L.value ? (t(), o(H, { key: 0 }, [
            (i = e.row.job_command) != null && i.length ? (t(), F(u(ee), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: U.value || N.value || !q.value,
              onClick: Y
            }, {
              default: A(() => [...a[8] || (a[8] = [
                f("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0),
            e.row.role !== "main" ? (t(), F(u(ee), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: U.value || N.value,
              onClick: a[0] || (a[0] = (I) => D("retire"))
            }, {
              default: A(() => [...a[9] || (a[9] = [
                f("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0)
          ], 64)) : h("", !0)
        ]),
        y(u(Ie), { value: n.value }, {
          job: A(() => [
            y(Pt, {
              task: k.value,
              "onUpdate:task": a[1] || (a[1] = (I) => k.value = I),
              text: r.value,
              "onUpdate:text": a[2] || (a[2] = (I) => r.value = I),
              row: e.row,
              tasks: M.value,
              pending: U.value,
              loading: N.value,
              "more-tasks": T.value,
              failure: B.value,
              "job-ready": J.value,
              onSubmit: c,
              onMore: K,
              onCancel: a[3] || (a[3] = (I) => D(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: A(() => [
            y(qe, {
              reason: m.value,
              "onUpdate:reason": a[4] || (a[4] = (I) => m.value = I),
              pending: U.value,
              onSubmit: G,
              onCancel: a[5] || (a[5] = (I) => D(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        B.value ? (t(), o("p", Jt, p(B.value), 1)) : h("", !0),
        P.value ? (t(), o("p", Zt, p(P.value), 1)) : h("", !0)
      ], 32));
    };
  }
}, Yt = /* @__PURE__ */ _(Gt, [["__scopeId", "data-v-4cb32275"]]), Qt = ["data-icon", "stroke-width", "innerHTML"], te = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const s = e, l = { right: 0, down: 90, left: 180, up: 270 }, n = {
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
    }, r = {
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
    return (m, k) => (t(), o("svg", {
      class: "ico",
      "data-icon": e.name,
      style: ge({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...s.facing === "right" ? {} : { transform: `rotate(${l[s.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: r[n[e.name] || e.name] || r.dot
    }, null, 12, Qt));
  }
}, Xt = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, _t = {
  key: 1,
  class: "menu-item-text"
}, ea = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (s, l) => (t(), o("button", {
      type: "button",
      class: se(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (t(), o("span", Xt, p(e.checked ? "✓" : ""), 1)) : h("", !0),
      e.description ? (t(), o("span", _t, [
        d("span", null, [
          we(s.$slots, "default", {}, void 0, !0)
        ]),
        d("small", null, p(e.description), 1)
      ])) : we(s.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, pe = /* @__PURE__ */ _(ea, [["__scopeId", "data-v-fec99974"]]), ta = {}, aa = { class: "menu-label" };
function na(e, s) {
  return t(), o("span", aa, [
    we(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ye = /* @__PURE__ */ _(ta, [["render", na], ["__scopeId", "data-v-aa955b3e"]]), la = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, oa = {
  key: 0,
  class: "skills-none"
}, sa = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: s }) {
    const l = e, n = s, r = w(() => l.skills.filter((k) => k.state === "loaded")), m = w(() => l.skills.filter((k) => k.state !== "loaded"));
    return (k, M) => (t(), o("div", la, [
      y(ye, null, {
        default: A(() => [...M[1] || (M[1] = [
          f("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      r.value.length ? h("", !0) : (t(), o("p", oa, "None yet. Compacting the conversation empties this list.")),
      (t(!0), o(H, null, Q(r.value, (j) => (t(), o("p", {
        key: j.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        y(te, {
          name: "book",
          size: 12
        }),
        f(p(j.skill), 1)
      ]))), 128)),
      m.value.length ? (t(), o(H, { key: 1 }, [
        y(ye, null, {
          default: A(() => [...M[2] || (M[2] = [
            f("Still to read", -1)
          ])]),
          _: 1
        }),
        (t(!0), o(H, null, Q(m.value, (j) => (t(), o("p", {
          key: j.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          y(te, {
            name: "book",
            size: 12
          }),
          f(p(j.skill), 1)
        ]))), 128))
      ], 64)) : h("", !0),
      y(pe, {
        "data-agent-skills-browse": "",
        onClick: M[0] || (M[0] = (j) => n("browse"))
      }, {
        default: A(() => [...M[3] || (M[3] = [
          f("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, ra = /* @__PURE__ */ _(sa, [["__scopeId", "data-v-be514d47"]]), ia = (e, s, l) => Math.max(s, Math.min(l, e)), We = /* @__PURE__ */ new WeakMap(), ua = (e, s) => We.set(e, s);
function da(e, s) {
  for (let l = s; l; l = We.get(l) ?? l.parentElement) if (l === e) return !0;
  return !1;
}
function ca(e, s) {
  const l = (n) => {
    var m, k;
    const r = ((m = e.value) == null ? void 0 : m.element) || ((k = e.value) == null ? void 0 : k.$el) || e.value;
    r && !da(r, n.target) && s(n);
  };
  window.addEventListener("click", l), be(() => window.removeEventListener("click", l));
}
const ve = 8, va = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: s, emit: l }) {
    const n = e, r = O(null), m = (v) => v ? `${v}px` : void 0, k = w(() => ({
      minWidth: m(n.minWidth),
      maxWidth: m(n.maxWidth),
      maxHeight: m(n.maxHeight),
      height: m(n.height)
    })), M = O({ w: 0, h: 0 }), j = O(n.anchor ? n.anchor.getBoundingClientRect() : null), T = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), N = (v) => ({
      left: Math.max(0, v.left),
      top: Math.max(0, v.top),
      right: Math.min(window.innerWidth, v.right),
      bottom: Math.min(window.innerHeight, v.bottom)
    }), U = (v) => {
      const S = v.closest(".pane, .float-window");
      return S ? N(S.getBoundingClientRect()) : T();
    }, B = (v, S) => `${Math.max(0, v ? Math.min(v, S) : S)}px`;
    function P(v, S) {
      return {
        below: v.bottom - S.bottom - n.gap - ve,
        above: S.top - v.top - n.gap - ve,
        across: v.right - v.left - 2 * ve
      };
    }
    function R(v) {
      const S = U(n.anchor), V = P(S, v);
      return M.value.w <= V.across && M.value.h <= Math.max(V.below, V.above) ? S : T();
    }
    const L = w(() => {
      if (!j.value) return k.value;
      const v = j.value, S = R(v), V = P(S, v), { w: ae, h: b } = M.value, g = n.align === "auto" ? v.left + v.right > S.left + S.right : n.align === "right", $ = ia(g ? v.right - ae : v.left, S.left + ve, Math.max(S.left + ve, S.right - ae - ve)), ne = b > V.below && V.above > V.below ? { bottom: `${window.innerHeight - v.top + n.gap}px`, maxHeight: B(n.maxHeight, V.above) } : { top: `${v.bottom + n.gap}px`, maxHeight: B(n.maxHeight, V.below) };
      return { ...k.value, ...ne, left: `${$}px`, maxWidth: B(n.maxWidth, V.across) };
    }), q = l, J = () => [...r.value.querySelectorAll("button:not(:disabled)")];
    function D(v) {
      const S = J(), V = S.indexOf(document.activeElement);
      S[(V + v + S.length) % S.length].focus();
    }
    const Y = { ArrowDown: () => D(1), ArrowUp: () => D(-1), Escape: () => q("close") }, K = (v) => Y[v.key] && (v.preventDefault(), Y[v.key]()), C = () => r.value && (M.value = { w: r.value.offsetWidth, h: r.value.scrollHeight });
    let c = 0;
    const G = new ResizeObserver(() => {
      cancelAnimationFrame(c), c = requestAnimationFrame(C);
    });
    ca(r, (v) => n.anchor && !n.anchor.contains(v.target) && q("close"));
    const x = (v, S) => ["top", "left", "right", "bottom"].some((V) => Math.abs(v[V] - S[V]) > 1), a = (v) => v.bottom < 0 || v.top > window.innerHeight;
    let i = 0;
    function I() {
      if (n.anchor) {
        const v = n.anchor.getBoundingClientRect();
        if (!n.anchor.isConnected || a(v)) return q("close");
        x(v, j.value) && (j.value = v);
      }
      i = requestAnimationFrame(I);
    }
    return Ze(() => {
      n.anchor && r.value && ua(r.value, n.anchor), C(), r.value && G.observe(r.value), !n.plain && J()[0] && J()[0].focus(), I();
    }), be(() => {
      G.disconnect(), cancelAnimationFrame(i), cancelAnimationFrame(c);
    }), s({ element: r }), (v, S) => (t(), F(Ge, {
      to: "body",
      disabled: !e.anchor
    }, [
      d("div", Ye({
        ref_key: "panel",
        ref: r
      }, v.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: L.value,
        onKeydown: K
      }), [
        we(v.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), pa = /* @__PURE__ */ _(va, [["__scopeId", "data-v-3d203970"]]);
async function ga(e, s, l) {
  if (!e) return l(s);
  const { target: n, fields: r } = e, m = Object.fromEntries(Object.keys(r).map((j) => [j, n[j]])), k = () => Object.assign(n, m);
  Object.assign(n, r);
  let M = !1;
  try {
    const j = await l(s);
    return M = j.ok, j;
  } finally {
    M || k();
  }
}
function ma(e, s, l, { groups: n, programs: r }) {
  const m = O({}), k = O(""), M = O(!1), j = w(() => !!e.value && !e.value.ended_at), T = w(() => j.value && !!e.value.paused_at);
  async function N(R, L = null) {
    k.value = "";
    const q = await ga(L, R, s);
    return k.value = q.ok ? "" : q.error, l(), q;
  }
  return { groups: n, programs: r, chosen: m, failure: k, asking: M, running: j, paused: T, choose: (R, L) => N(["agent", "control", String(e.value.id), R, L.value], { target: m, fields: { value: { ...m.value, [R]: L.label } } }), stop: () => (M.value = !1, N(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (R) => N(["agent", "launch", R.name]) };
}
function fa(e) {
  if (!e) return "Not compacted yet";
  const s = new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return e.start_percent === null ? `Last compacted ${s}` : e.end_percent === null ? `Last compacted ${s}, from ${e.start_percent}%` : `Last compacted ${s}, from ${e.start_percent}% to ${e.end_percent}%, ${e.start_percent - e.end_percent}% taken off`;
}
const ha = ["disabled", "title"], ka = ["title"], ya = { class: "gauge usage" }, ba = ["disabled", "title"], wa = { class: "gauge" }, Ma = ["disabled", "title"], $a = ["disabled"], xa = ["disabled"], Ca = {
  key: 5,
  class: "fact",
  "data-fact": "uptime",
  title: "How long this session has run"
}, Sa = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Aa = ["title"], ja = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Ta = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Ra = { class: "gauge" }, Oa = { class: "context-used" }, za = 75, Ba = {
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
    now: { type: Number, default: () => Date.now() },
    fitness: { type: Object, default: null },
    run: { type: Function, default: null }
  },
  emits: ["open", "changed", "skills"],
  setup(e, { emit: s }) {
    const l = e, n = s, r = ma(je(l, "agent"), l.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => n("changed"), { groups: je(l, "controlGroups"), programs: je(l, "agentPrograms") }), m = O(null), k = O(""), M = w(() => r.groups.value.find((C) => C.key === k.value));
    function j(C, c) {
      m.value = C.currentTarget, k.value = c;
    }
    function T() {
      m.value = null, k.value = "", r.asking.value = !1;
    }
    const N = w(() => l.skills.filter((C) => C.state === "loaded"));
    function U(C) {
      j(C, "skills"), n("skills");
    }
    const B = (C) => r.groups.value.some((c) => c.key === C), P = w(() => {
      var C;
      return r.chosen.value.model ?? ((C = L.value) == null ? void 0 : C.model) ?? "";
    }), R = w(() => {
      var C;
      return r.chosen.value.effort ?? ((C = L.value) == null ? void 0 : C.effort) ?? "";
    });
    w(() => !!l.agent && !l.agent.ended_at);
    const L = w(() => {
      var C;
      return ((C = l.usage.agents) == null ? void 0 : C.find((c) => {
        var G;
        return c.id === ((G = l.agent) == null ? void 0 : G.id);
      })) ?? null;
    }), q = w(() => {
      var C;
      return ((C = l.usage.windows) == null ? void 0 : C[0]) ?? null;
    }), J = w(() => q.value ? Math.max(0, Math.min(100, Math.round(q.value.used_percent))) : null), D = w(() => {
      var C;
      return ((C = L.value) == null ? void 0 : C.context_percent) == null ? null : Math.round(L.value.context_percent);
    }), Y = w(() => {
      var C;
      return (C = L.value) != null && C.cost_dollars ? `$${L.value.cost_dollars.toFixed(2)}` : "";
    }), K = w(() => {
      var G;
      const C = (G = l.agent) != null && G.process_started_at ? new Date(l.agent.process_started_at).getTime() : 0;
      if (!C) return "";
      const c = Math.max(0, Math.floor((l.now - C) / 6e4));
      return c >= 60 ? `${Math.floor(c / 60)}h ${c % 60}m` : `${c}m`;
    });
    return (C, c) => {
      var G;
      return t(), o("div", {
        class: se(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (t(), o(H, { key: 0 }, [
          d("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: c[0] || (c[0] = (x) => j(x, "agent"))
          }, [
            y(te, {
              name: "agents",
              size: 12
            }),
            f(" " + p(((G = e.agentPrograms.find((x) => x.name === e.agent.program)) == null ? void 0 : G.title) || e.agent.program), 1)
          ], 8, ha),
          J.value !== null ? (t(), o("button", {
            key: 0,
            type: "button",
            class: "fact",
            "data-fact": "usage",
            title: `${J.value}% of the plan's ${q.value.title} allowance used`,
            onClick: c[1] || (c[1] = (x) => n("open", "usage", x.currentTarget))
          }, [
            y(te, {
              name: "allowance",
              size: 12
            }),
            c[14] || (c[14] = f()),
            d("span", ya, [
              d("span", {
                style: ge({ width: `${J.value}%` })
              }, null, 4)
            ]),
            f(" " + p(J.value) + "% ", 1)
          ], 8, ka)) : h("", !0),
          D.value !== null ? (t(), o("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${D.value}% full: clear or compact it`,
            onClick: c[2] || (c[2] = (x) => B("context") ? j(x, "context") : n("open", "context", x.currentTarget))
          }, [
            y(te, {
              name: "gauge",
              size: 12
            }),
            c[15] || (c[15] = f()),
            d("span", wa, [
              d("span", {
                style: ge({ width: `${D.value}%` })
              }, null, 4)
            ]),
            f(" " + p(D.value) + "% ", 1)
          ], 8, ba)) : h("", !0),
          P.value ? (t(), o("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${P.value}: change the model`,
            onClick: c[3] || (c[3] = (x) => B("model") ? j(x, "model") : null)
          }, [
            y(te, {
              name: "model",
              size: 12
            }),
            f(" " + p(P.value), 1)
          ], 8, Ma)) : h("", !0),
          B("effort") || e.card && R.value ? (t(), o("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: c[4] || (c[4] = (x) => j(x, "effort"))
          }, [
            y(te, {
              name: "bolt",
              size: 12
            }),
            f(" " + p(R.value), 1)
          ], 8, $a)) : h("", !0),
          Y.value ? (t(), o("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: c[5] || (c[5] = (x) => n("open", "cost", x.currentTarget))
          }, p(Y.value), 9, xa)) : h("", !0),
          K.value ? (t(), o("span", Ca, [
            y(te, {
              name: "reminders",
              size: 12
            }),
            f(" " + p(K.value), 1)
          ])) : h("", !0),
          e.branch ? (t(), o("span", Sa, [
            y(te, {
              name: "branch",
              size: 12
            }),
            f(" " + p(e.branch), 1)
          ])) : h("", !0),
          e.card ? h("", !0) : (t(), o("button", {
            key: 7,
            type: "button",
            class: se(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: c[6] || (c[6] = (x) => n("open", "jobs", x.currentTarget))
          }, [
            y(te, {
              name: "clock",
              size: 12
            }),
            f(" " + p(e.jobs), 1)
          ], 2)),
          e.run ? (t(), o("button", {
            key: 8,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: U
          }, [
            y(te, {
              name: "book",
              size: 12
            }),
            f(" " + p(N.value.length), 1)
          ])) : h("", !0),
          e.fitness ? (t(), o(H, { key: 9 }, [
            d("button", {
              type: "button",
              class: se(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < za }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: c[7] || (c[7] = (x) => n("open", "fitness", x.currentTarget))
            }, [
              y(te, {
                name: "heart",
                size: 12
              }),
              f(" " + p(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            d("button", {
              type: "button",
              class: se(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: c[8] || (c[8] = (x) => n("open", "load", x.currentTarget))
            }, [
              y(te, {
                name: "weight",
                size: 12
              }),
              f(" " + p(e.fitness.workload), 1)
            ], 2)
          ], 64)) : h("", !0)
        ], 64)) : e.run && !e.loading ? (t(), o("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: c[9] || (c[9] = (x) => j(x, "start"))
        }, [
          y(te, {
            name: "agents",
            size: 12
          }),
          c[16] || (c[16] = f(" Start an agent", -1))
        ])) : h("", !0),
        c[22] || (c[22] = d("span", { class: "space" }, null, -1)),
        u(r).failure.value ? (t(), o("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: u(r).failure.value
        }, p(u(r).failure.value), 9, Aa)) : h("", !0),
        we(C.$slots, "default", {}, void 0, !0),
        m.value ? (t(), F(pa, {
          key: 3,
          anchor: m.value,
          "min-width": 190,
          onClose: T
        }, {
          default: A(() => {
            var x;
            return [
              k.value === "agent" ? (t(), o(H, { key: 0 }, [
                u(r).asking.value ? (t(), o(H, { key: 0 }, [
                  y(ye, { "data-agent-stop-ask": "" }, {
                    default: A(() => [...c[17] || (c[17] = [
                      f("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  y(pe, {
                    "data-agent-stop-confirm": "",
                    onClick: c[10] || (c[10] = (a) => (T(), u(r).stop()))
                  }, {
                    default: A(() => [...c[18] || (c[18] = [
                      f("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  y(pe, {
                    onClick: c[11] || (c[11] = (a) => u(r).asking.value = !1)
                  }, {
                    default: A(() => [...c[19] || (c[19] = [
                      f("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (t(), F(pe, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: c[12] || (c[12] = (a) => u(r).asking.value = !0)
                }, {
                  default: A(() => [...c[20] || (c[20] = [
                    f("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : k.value === "start" ? (t(), o(H, { key: 1 }, [
                y(ye, null, {
                  default: A(() => [...c[21] || (c[21] = [
                    f("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (t(!0), o(H, null, Q(u(r).programs.value, (a) => (t(), F(pe, {
                  key: a.name,
                  "data-agent-program": a.name,
                  onClick: (i) => (T(), u(r).start(a))
                }, {
                  default: A(() => [
                    f(p(a.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : k.value === "skills" ? (t(), F(ra, {
                key: 2,
                skills: e.skills,
                onBrowse: c[13] || (c[13] = (a) => (T(), n("open", "skills", null)))
              }, null, 8, ["skills"])) : M.value ? (t(), o(H, { key: 3 }, [
                y(ye, null, {
                  default: A(() => [
                    f(p(M.value.label), 1)
                  ]),
                  _: 1
                }),
                k.value === "context" ? (t(), o(H, { key: 0 }, [
                  d("p", ja, p(u(fa)(((x = L.value) == null ? void 0 : x.last_compaction) ?? null)), 1),
                  d("div", Ta, [
                    d("span", Ra, [
                      d("span", {
                        style: ge({ width: `${D.value}%` })
                      }, null, 4)
                    ]),
                    d("span", Oa, p(D.value) + "%", 1)
                  ])
                ], 64)) : h("", !0),
                (t(!0), o(H, null, Q(M.value.choices, (a) => (t(), F(pe, {
                  key: a.value,
                  "data-agent-choice": a.value,
                  onClick: (i) => (u(r).choose(M.value.key, a), T())
                }, {
                  default: A(() => [
                    f(p(a.label), 1)
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
}, Va = /* @__PURE__ */ _(Ba, [["__scopeId", "data-v-8331d791"]]), La = ["data-agent-open", "aria-expanded", "role", "tabindex"], Ha = { class: "agent-head" }, Ia = ["data-state"], Ea = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Na = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, qa = { class: "agent-times" }, Wa = {
  key: 0,
  class: "agent-time",
  "data-agent-motion": ""
}, Fa = {
  key: 1,
  class: "agent-time",
  "data-agent-motion": ""
}, Pa = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": ""
}, Da = {
  key: 3,
  class: "agent-time",
  "data-agent-motion": ""
}, Ua = { class: "agent-line" }, Ka = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Ja = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, Za = {
  key: 1,
  class: "agent-list-pace",
  "data-agent-list-pace": ""
}, Ga = {
  key: 2,
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, Ya = {
  key: 3,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Qa = {
  key: 1,
  class: "agent-line agent-work-start"
}, Xa = ["title"], _a = { class: "agent-job-title" }, en = ["data-peek"], tn = ["data-agent-waiting", "data-agent-stopped"], an = {
  key: 2,
  class: "agent-line agent-work-status",
  "data-agent-blocked-tasks": ""
}, nn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: s }) {
    const l = { helper: "Helper", reviewer: "Reviewer" }, n = e, r = s, m = Ee(), k = w(() => {
      var i, I;
      if ((i = n.facts) != null && i.profile_title) return n.facts.profile_title;
      if ((I = n.facts) != null && I.profile) return n.facts.profile;
      const a = l[n.row.role] || n.row.role;
      return a.slice(0, 1).toUpperCase() + a.slice(1);
    }), M = w(() => {
      var a;
      return ((a = n.facts) == null ? void 0 : a.tasks) ?? [];
    }), j = w(() => M.value.filter((a) => a.state === "open")), T = w(() => M.value.find((a) => {
      var i;
      return a.id === ((i = n.progress) == null ? void 0 : i.task_id) && a.state === "started";
    })), N = w(() => T.value || M.value.find((a) => {
      var i;
      return a.id === ((i = n.facts) == null ? void 0 : i.task_id);
    }) || j.value[0] || M.value.at(-1)), U = w(() => T.value ? M.value.filter((a) => a.state === "blocked") : []), B = w(() => {
      var a, i, I, v, S, V;
      return n.row.role === "helper" ? ((a = n.facts) == null ? void 0 : a.helper_job) || "" : (i = n.facts) != null && i.job_enabled && (((I = T.value) == null ? void 0 : I.title) || ((v = n.facts) == null ? void 0 : v.task_title) || ((S = j.value[0]) == null ? void 0 : S.title) || ((V = M.value.at(-1)) == null ? void 0 : V.title)) || "";
    }), P = w(() => {
      var a;
      return (a = n.facts) != null && a.job_enabled ? `${n.row.role} ${n.row.id}` : "";
    }), R = w(() => {
      var a, i;
      return [n.row.program, (a = n.facts) == null ? void 0 : a.model, (i = n.facts) == null ? void 0 : i.effort, P.value].filter(Boolean).join(" · ");
    }), L = fe(), q = w(() => Ne(n.row.process_started_at || n.row.created_at, m.value)), J = /* @__PURE__ */ new Set(["open", "started", "testing"]), D = w(() => {
      var a;
      return (a = n.facts) == null ? void 0 : a.work_status;
    }), Y = w(() => !!n.row.ended_at && n.row.role !== "main" && M.value.some((a) => J.has(a.state))), K = w(() => {
      var a;
      return n.row.retired_at || n.row.state === "retired" ? "retired" : D.value || n.waitReason || Y.value ? "waiting" : n.row.state === "running" && ((a = n.facts) == null ? void 0 : a.state) || n.row.state;
    }), C = w(() => {
      var a;
      return D.value ? `Status: ${D.value}` : n.waitReason ? `Waiting: ${n.waitReason}` : K.value === "blocked" ? (a = n.facts) != null && a.blocked_reason ? `Blocked: ${n.facts.blocked_reason}` : "Blocked" : Y.value ? "Stopped with work left" : "";
    }), c = w(() => {
      var a;
      return ((a = n.progress) == null ? void 0 : a.completed_count) ?? M.value.filter((i) => i.state === "completed").length;
    }), G = w(() => {
      var i;
      const a = it(c.value, ((i = n.progress) == null ? void 0 : i.started_at) || n.row.created_at, n.progress ? n.progress.finished_at : n.row.ended_at, m.value);
      return n.row.role !== "main" && a ? `${a} per hour` : "";
    }), x = w(() => !!n.row.retired_at || n.row.state === "retired");
    return (a, i) => {
      var I, v, S, V, ae;
      return t(), o("div", {
        class: se(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: i[3] || (i[3] = (b) => !e.open && r("toggle")),
        onKeydown: [
          i[4] || (i[4] = Be(le((b) => !e.open && r("toggle"), ["self", "prevent"]), ["enter"])),
          i[5] || (i[5] = Be(le((b) => !e.open && r("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        d("span", Ha, [
          e.open ? (t(), o("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: i[0] || (i[0] = le((b) => r("toggle"), ["stop"]))
          }, [
            y(u(me), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : h("", !0),
          d("span", {
            class: "agent-dot",
            "data-state": K.value,
            "data-agent-motion": ""
          }, null, 8, Ia),
          d("span", Ea, p(k.value), 1),
          d("span", Na, p(((I = e.facts) == null ? void 0 : I.given_name) || e.row.id), 1),
          e.open ? h("", !0) : (t(), F(u(me), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          d("span", qa, [
            x.value ? (t(), o("span", Wa, [
              i[6] || (i[6] = f("Retired, ", -1)),
              y(u(ke), {
                at: e.row.retired_at
              }, null, 8, ["at"])
            ])) : e.row.ended_at && D.value ? (t(), o("span", Fa, [
              i[7] || (i[7] = f("Process ended: ", -1)),
              y(u(ke), {
                at: e.row.ended_at
              }, null, 8, ["at"])
            ])) : e.row.ended_at ? (t(), o("span", Pa, [
              i[8] || (i[8] = f("Idle, ", -1)),
              y(u(ke), {
                at: e.row.ended_at
              }, null, 8, ["at"])
            ])) : (t(), o("span", Da, p(q.value), 1))
          ])
        ]),
        d("span", Ua, [
          d("span", Ka, p(R.value), 1),
          (v = e.facts) != null && v.sandbox_off ? (t(), o("span", Ja, "sandbox off")) : h("", !0),
          !e.open && e.row.role === "worker" && G.value ? (t(), o("span", Za, p(G.value), 1)) : h("", !0),
          e.open ? (t(), o("span", Ga, [
            y(u(me), {
              name: "time",
              size: 12
            }),
            i[9] || (i[9] = f("First started: ", -1)),
            y(u(ke), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : h("", !0),
          e.open && ((S = e.facts) != null && S.last_activity) ? (t(), o("span", Ya, [
            i[10] || (i[10] = f("Last heard: ", -1)),
            y(u(ke), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : h("", !0)
        ]),
        e.open ? (t(), F(Va, {
          key: 0,
          "agent-programs": u(L).props.programs.rows.value,
          agent: e.row,
          branch: (V = e.progress) == null ? void 0 : V.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: [] },
          card: ""
        }, {
          default: A(() => [
            y(Yt, { row: e.row }, null, 8, ["row"]),
            e.row.role === "helper" && !e.row.ended_at ? (t(), F(u(ee), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: i[1] || (i[1] = le((b) => u(L).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: A(() => [...i[11] || (i[11] = [
                f("Stop", -1)
              ])]),
              _: 1
            })) : h("", !0)
          ]),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : h("", !0),
        !e.open && (B.value || C.value) ? (t(), o("span", Qa, [
          d("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: B.value
          }, [
            d("span", _a, p(B.value), 1),
            B.value && e.row.role !== "helper" && ((ae = N.value) != null && ae.plan_id) ? (t(), o("button", {
              key: 0,
              type: "button",
              class: "agent-plan",
              "data-agent-plan": "",
              "data-peek": `plans:${N.value.plan_id}`,
              onClick: i[2] || (i[2] = le((b) => u(Ae)(`plans:${N.value.plan_id}`), ["stop"]))
            }, "plan " + p(N.value.plan_id), 9, en)) : h("", !0)
          ], 8, Xa),
          C.value ? (t(), o("span", {
            key: 0,
            class: "agent-work-status",
            "data-agent-work-status": "",
            "data-agent-waiting": e.waitReason ? "" : null,
            "data-agent-stopped": Y.value && !e.waitReason && !D.value ? "" : null
          }, p(C.value), 9, tn)) : h("", !0)
        ])) : h("", !0),
        !e.open && U.value.length ? (t(), o("span", an, "Blocked: " + p(U.value.map((b) => `task ${b.id}`).join(", ")), 1)) : h("", !0),
        e.open ? (t(), F(Lt, {
          key: 3,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: M.value,
          "stopped-with-work": Y.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : h("", !0)
      ], 42, La);
    };
  }
}, ln = /* @__PURE__ */ _(nn, [["__scopeId", "data-v-54506a72"]]), on = ["data-edit-type"], sn = { key: 0 }, rn = { class: "stepper" }, un = ["disabled", "onClick"], dn = ["value", "disabled", "data-agent-limit-input", "onChange"], cn = ["disabled", "onClick"], vn = { key: 0 }, pn = { key: 1 }, gn = {
  __name: "AgentLimitEditor",
  props: { rows: { type: Array, required: !0 }, pending: Boolean, readOnly: Boolean, environment: { type: String, required: !0 } },
  emits: ["change"],
  setup(e, { emit: s }) {
    const l = s;
    return (n, r) => (t(), o(H, null, [
      r[0] || (r[0] = d("p", null, "How many agents of a type may run at once, and how many may be kept.", -1)),
      (t(!0), o(H, null, Q(e.rows, (m) => (t(), o("div", {
        key: m.key,
        class: "edit-row",
        "data-edit-type": m.key
      }, [
        d("div", null, [
          d("strong", null, p(m.per_profile ? "Each helper type" : "Workers"), 1),
          m.per_profile ? (t(), o("small", sn, "Researcher, Planner and the others")) : h("", !0)
        ]),
        (t(!0), o(H, null, Q([{ name: "Most running", value: m.run_limit, key: m.run_setting, source: m.run_source, kind: "run" }, { name: "Most kept", value: m.kept_limit, key: m.kept_setting, source: m.kept_source, kind: "kept" }], (k) => (t(), o("label", {
          key: k.key
        }, [
          f(p(k.name), 1),
          d("span", rn, [
            d("button", {
              type: "button",
              disabled: e.pending || e.readOnly || k.value === 0,
              onClick: (M) => l("change", m, k.key, k.value, k.value - 1)
            }, "−", 8, un),
            d("input", {
              type: "number",
              min: "0",
              value: k.value,
              disabled: e.pending || e.readOnly,
              "data-agent-limit-input": k.kind,
              onChange: (M) => l("change", m, k.key, k.value, M.target.value)
            }, null, 40, dn),
            d("button", {
              type: "button",
              disabled: e.pending || e.readOnly,
              onClick: (M) => l("change", m, k.key, k.value, k.value + 1)
            }, "+", 8, cn)
          ]),
          k.value === 0 ? (t(), o("small", vn, p(k.kind === "run" ? "None can start" : "Any number"), 1)) : k.source === `environment ${e.environment}` ? (t(), o("small", pn, "Changed for " + p(e.environment), 1)) : h("", !0)
        ]))), 128))
      ], 8, on))), 128))
    ], 64));
  }
}, mn = /* @__PURE__ */ _(gn, [["__scopeId", "data-v-218442c9"]]), Fe = (e) => e.flatMap((s) => s.per_profile ? s.profiles.map((l) => ({ ...l, label: l.title, type: s.key, key: `${s.key}:${l.profile}` })) : [{ ...s, type: s.key }]), Oe = (e, s) => s > 0 && e >= s, fn = { class: "counts-panel" }, hn = { class: "counts" }, kn = ["data-count-agent"], yn = { class: "person-text" }, bn = {
  key: 0,
  class: "helper-head"
}, wn = ["data-agent-limit-type", "data-agent-limit-profile", "onClick"], Mn = {
  key: 0,
  class: "bar"
}, $n = {
  key: 5,
  role: "alert"
}, xn = {
  key: 6,
  role: "status"
}, Cn = { class: "foot" }, Sn = { class: "foot-note" }, An = {
  __name: "AgentCountsPanel",
  props: {
    title: { default: "Agent counts" },
    titleModifiers: {}
  },
  emits: /* @__PURE__ */ Xe(["open-agent", "close"], ["update:title"]),
  setup(e, { emit: s }) {
    const l = s, n = Qe(e, "title"), r = fe(), { rows: m, failure: k } = r.props.limits, M = O([]), j = O(0), T = O(!1), N = Ee(), U = O(null), B = O(!1), P = O(!1), R = O(""), L = O(""), q = O(null), J = O(""), D = w(() => Fe(m.value)), Y = w(() => m.value.find((b) => b.per_profile)), K = w(() => D.value.find((b) => b.key === U.value)), C = w(() => M.value.filter((b) => {
      var g, $;
      return b.state !== "retired" && b.role === ((g = K.value) == null ? void 0 : g.type) && (!K.value.profile || ((($ = b.facts) == null ? void 0 : $.profile) || b.profile) === K.value.profile);
    }).sort((b, g) => (b.state !== "running") - (g.state !== "running") || String(b.ended_at || b.created_at).localeCompare(String(g.ended_at || g.created_at)))), c = w(() => {
      var g;
      const b = /* @__PURE__ */ new Map();
      for (const $ of C.value) {
        const W = ((g = $.facts) == null ? void 0 : g.model) || $.program_model;
        W && b.set(W, (b.get(W) || 0) + 1);
      }
      return [...b].map(([$, W]) => `${W} ${$}`).join(", ");
    }), G = (b, g) => g ? `${Math.min(b / Math.max(b, g) * 100, 100)}%` : "0%", x = (b, g) => g && b > g ? `${(b - g) / b * 100}%` : "0%";
    re(() => {
      var b;
      return B.value ? "Change the maximums" : ((b = K.value) == null ? void 0 : b.label) || "Agent counts";
    }, (b) => {
      n.value = b;
    }, { immediate: !0 });
    async function a(b, g = 1) {
      r.state["count-agents.role"] = b.type, b.profile ? r.state["count-agents.profile"] = b.profile : delete r.state["count-agents.profile"], r.state["count-agents.page"] = String(g), await r.reload("count-agents");
      const $ = r.props["count-agents"];
      M.value = g === 1 ? [...$.rows.value] : [...M.value, ...$.rows.value], j.value = g, T.value = $.more.value;
    }
    function i(b) {
      U.value = b.key, M.value = [], a(b);
    }
    function I() {
      B.value = !1, U.value = null, q.value = null, R.value = "";
    }
    function v() {
      I(), l("close");
    }
    async function S(b, g, $, W) {
      if (P.value || r.readOnly) return;
      const ne = Number(W);
      if (!String(W).trim() || !Number.isInteger(ne) || ne < 0) {
        R.value = "Use a whole number of 0 or more.";
        return;
      }
      P.value = !0, R.value = "";
      const ue = await r.run(["setting", "set", g, String(ne), "--environment", r.environment]);
      ue.ok ? (await r.reload("limits"), L.value = "Saved.") : R.value = ue.error, P.value = !1;
    }
    async function V(b) {
      if (!J.value.trim() || P.value) return;
      P.value = !0;
      const g = await r.run(["agent", "retire", String(b.id), "--reason", J.value.trim()]);
      R.value = g.ok ? "" : "The agent could not be retired. Try again.", g.ok && (q.value = null, J.value = "", L.value = "Agent retired permanently.", await r.reload("limits"), await a(K.value)), P.value = !1;
    }
    function ae(b) {
      v(), l("open-agent", b);
    }
    return (b, g) => (t(), o("div", fn, [
      d("div", hn, [
        B.value || K.value ? (t(), o("button", {
          key: 0,
          class: "back",
          type: "button",
          onClick: I
        }, "‹ Back to the counts")) : h("", !0),
        u(k) ? (t(), o(H, { key: 1 }, [
          g[6] || (g[6] = d("strong", null, "The counts could not be read", -1)),
          g[7] || (g[7] = d("p", null, "The journal did not answer.", -1)),
          y(u(ee), {
            small: "",
            onClick: g[0] || (g[0] = ($) => u(r).reload("limits"))
          }, {
            default: A(() => [...g[5] || (g[5] = [
              f("Try again", -1)
            ])]),
            _: 1
          })
        ], 64)) : B.value ? (t(), F(mn, {
          key: 2,
          rows: u(m),
          pending: P.value,
          "read-only": u(r).readOnly,
          environment: u(r).environment,
          onChange: S
        }, null, 8, ["rows", "pending", "read-only", "environment"])) : K.value ? (t(), o(H, { key: 3 }, [
          d("p", null, [
            d("strong", null, p(K.value.running) + " of " + p(K.value.run_limit), 1),
            g[8] || (g[8] = f(" running, ", -1)),
            d("strong", null, [
              f(p(K.value.kept), 1),
              K.value.kept_limit ? (t(), o(H, { key: 0 }, [
                f(" of " + p(K.value.kept_limit), 1)
              ], 64)) : h("", !0)
            ]),
            g[9] || (g[9] = f(" kept", -1))
          ]),
          d("p", null, p(c.value), 1),
          C.value.length ? h("", !0) : (t(), o(H, { key: 0 }, [
            g[10] || (g[10] = d("strong", null, "No agents here yet", -1)),
            g[11] || (g[11] = d("p", null, "An agent shows here as soon as one of this type starts.", -1))
          ], 64)),
          (t(!0), o(H, null, Q(C.value, ($) => {
            var W, ne, ue, he, Me;
            return t(), o("div", {
              key: $.id,
              class: "person",
              "data-count-agent": $.id
            }, [
              d("span", {
                class: se(["dot", { running: $.state === "running" }])
              }, null, 2),
              d("div", yn, [
                d("strong", null, p(((W = $.facts) == null ? void 0 : W.given_name) || $.id), 1),
                f(" " + p($.state === "running" ? "Running" : "Idle") + ", " + p(u(Ne)($.state === "running" ? $.process_started_at || $.created_at : $.ended_at, u(N))), 1),
                d("small", null, p([$.program, (ne = $.facts) == null ? void 0 : ne.model, (ue = $.facts) == null ? void 0 : ue.effort, `${$.role} ${$.id}`].filter(Boolean).join(", ")), 1),
                d("small", null, p(((he = $.facts) == null ? void 0 : he.task_title) || ((Me = $.facts) == null ? void 0 : Me.helper_job)), 1)
              ]),
              y(u(ee), {
                small: "",
                onClick: (de) => ae($)
              }, {
                default: A(() => [...g[12] || (g[12] = [
                  f("Open", -1)
                ])]),
                _: 1
              }, 8, ["onClick"]),
              $.state === "idle" && !u(r).readOnly ? (t(), F(u(ee), {
                key: 0,
                small: "",
                onClick: (de) => {
                  q.value = $.id, J.value = "";
                }
              }, {
                default: A(() => [...g[13] || (g[13] = [
                  f("Retire", -1)
                ])]),
                _: 1
              }, 8, ["onClick"])) : h("", !0),
              q.value === $.id ? (t(), F(qe, {
                key: 1,
                reason: J.value,
                "onUpdate:reason": g[1] || (g[1] = (de) => J.value = de),
                pending: P.value,
                onSubmit: (de) => V($),
                onCancel: g[2] || (g[2] = (de) => q.value = null)
              }, null, 8, ["reason", "pending", "onSubmit"])) : h("", !0)
            ], 8, kn);
          }), 128)),
          T.value ? (t(), F(u(ee), {
            key: 1,
            small: "",
            onClick: g[3] || (g[3] = ($) => a(K.value, j.value + 1))
          }, {
            default: A(() => [...g[14] || (g[14] = [
              f("Show more", -1)
            ])]),
            _: 1
          })) : h("", !0)
        ], 64)) : (t(), o(H, { key: 4 }, [
          g[16] || (g[16] = d("p", null, "Kept agents have not been retired, so they can take another job. Open an item to see them.", -1)),
          g[17] || (g[17] = d("div", { class: "columns" }, [
            d("span", null, "Name"),
            d("span", null, "Running"),
            d("span", null, "Kept"),
            d("span")
          ], -1)),
          Y.value ? (t(), o("div", bn, [
            g[15] || (g[15] = d("strong", null, "Helpers", -1)),
            d("span", null, p(Y.value.running) + " running, " + p(Y.value.kept) + " kept", 1)
          ])) : h("", !0),
          (t(!0), o(H, null, Q(D.value, ($) => (t(), o("button", {
            key: $.key,
            type: "button",
            class: "count-row",
            "data-agent-limit-type": $.type || $.key,
            "data-agent-limit-profile": $.profile,
            onClick: (W) => i($)
          }, [
            d("strong", null, p($.label), 1),
            (t(!0), o(H, null, Q([{ count: $.running, limit: $.run_limit, unlimited: !1 }, { count: $.kept, limit: $.kept_limit, unlimited: !0 }], (W) => (t(), o("span", {
              key: W.unlimited,
              class: se({ full: u(Oe)(W.count, W.limit) })
            }, [
              d("span", null, [
                f(p(W.count), 1),
                W.limit || !W.unlimited ? (t(), o(H, { key: 0 }, [
                  f(" of " + p(W.limit), 1)
                ], 64)) : h("", !0)
              ]),
              W.limit ? (t(), o("span", Mn, [
                d("span", {
                  style: ge({ width: G(W.count, W.limit) })
                }, null, 4),
                d("i", {
                  style: ge({ width: x(W.count, W.limit) })
                }, null, 4)
              ])) : h("", !0)
            ], 2))), 128)),
            y(u(me), {
              name: "chevronRight",
              size: 12
            })
          ], 8, wn))), 128))
        ], 64)),
        R.value ? (t(), o("p", $n, p(R.value), 1)) : L.value ? (t(), o("p", xn, p(L.value), 1)) : h("", !0)
      ]),
      d("div", Cn, [
        B.value ? (t(), o(H, { key: 0 }, [
          d("span", Sn, p(L.value || `Changes apply to ${u(r).environment}.`), 1),
          y(u(ee), { onClick: I }, {
            default: A(() => [...g[18] || (g[18] = [
              f("Done", -1)
            ])]),
            _: 1
          })
        ], 64)) : K.value ? h("", !0) : (t(), F(u(ee), {
          key: 1,
          disabled: u(r).readOnly,
          "data-agent-limits-edit": "",
          onClick: g[4] || (g[4] = ($) => B.value = !0)
        }, {
          default: A(() => [...g[19] || (g[19] = [
            f("Change the maximums", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]))
      ])
    ]));
  }
}, jn = /* @__PURE__ */ _(An, [["__scopeId", "data-v-de3d902c"]]), Tn = {
  key: 0,
  class: "badge",
  "data-agent-count-badge": ""
}, Rn = {
  __name: "AgentLimits",
  emits: ["open-agent"],
  setup(e, { emit: s }) {
    const l = s, n = fe(), r = O(!1), m = O("Agent counts"), k = w(() => Fe(n.props.limits.rows.value).filter((j) => Oe(j.running, j.run_limit) || Oe(j.kept, j.kept_limit)).length);
    function M(j) {
      r.value = !1, l("open-agent", j);
    }
    return (j, T) => (t(), o(H, null, [
      d("button", {
        class: "counts-button",
        type: "button",
        title: "Agent counts",
        "aria-label": "Agent counts",
        "data-agent-counts": "",
        onClick: T[0] || (T[0] = (N) => r.value = !0)
      }, [
        y(u(me), {
          name: "settings",
          size: 16
        }),
        k.value ? (t(), o("span", Tn, p(k.value), 1)) : h("", !0)
      ]),
      r.value ? (t(), F(u(ut), {
        key: 0,
        title: m.value,
        modal: "",
        fits: "",
        onClose: T[3] || (T[3] = (N) => r.value = !1),
        onEscape: T[4] || (T[4] = (N) => r.value = !1)
      }, {
        default: A(() => [
          y(jn, {
            title: m.value,
            "onUpdate:title": T[1] || (T[1] = (N) => m.value = N),
            onOpenAgent: M,
            onClose: T[2] || (T[2] = (N) => r.value = !1)
          }, null, 8, ["title"])
        ]),
        _: 1
      }, 8, ["title"])) : h("", !0)
    ], 64));
  }
}, On = /* @__PURE__ */ _(Rn, [["__scopeId", "data-v-4094dc8b"]]), zn = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Bn = ["data-agent-row"], Le = "journal.agents.filters", Se = "cubic-bezier(0.2, 0.9, 0.25, 1)", Vn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const s = e, l = fe(), { rows: n } = l.props.waits, { rows: r } = l.props.progress, { rows: m, failure: k, loaded: M, more: j } = l.props.agents, T = (E) => r.value.find((Z) => Z.agent_id === E.id) ?? null, N = (E) => {
      var Z;
      return ((Z = n.value.find((z) => z.agent_id === E.id)) == null ? void 0 : Z.reason) ?? "";
    }, U = O("running"), B = O(""), P = JSON.parse(localStorage.getItem(Le) || '{"roles":[],"profiles":[],"programs":[]}'), R = O(P), L = w(() => l.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: q } = l.props.programs, J = w(() => R.value.roles.length + R.value.profiles.length + R.value.programs.length), D = (E, Z) => {
      R.value = pt(R.value, E, Z);
    }, Y = () => {
      R.value = { roles: [], profiles: [], programs: [] };
    }, K = (E) => E.slice(0, 1).toUpperCase() + E.slice(1);
    re(R, (E) => localStorage.setItem(Le, JSON.stringify(E)));
    const C = O(25);
    function c() {
      Object.assign(l.state, {
        "agents.show": U.value,
        "agents.search": B.value,
        "agents.limit": String(C.value),
        "agents.roles": R.value.roles.join(","),
        "agents.profiles": R.value.profiles.join(","),
        "agents.programs": R.value.programs.join(",")
      });
    }
    async function G() {
      return C.value += 25, c(), await l.reload("agents"), !0;
    }
    re([U, B, R], () => {
      C.value = 25, c(), l.reload("agents");
    }), c();
    const x = (E) => E.facts ?? null, a = m, i = w(() => !!B.value.trim() || J.value > 0), I = w(() => s.texts[U.value] ?? { title: s.empty, hint: "" }), v = O(null), S = O(null), V = O(null), ae = O(null), b = w(() => v.value === null ? null : l.props[`card.${v.value}`].rows.value.find((E) => E.id === v.value) ?? S.value), g = w(() => b.value ? [b.value] : a.value), $ = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W = !1, ne = 0;
    async function ue(E) {
      if (W) return;
      W = !0, ne = ae.value.scrollTop;
      const Z = V.value.querySelector(`[data-agent-open="${E.id}"]`);
      if (!$()) {
        const ie = [...V.value.querySelectorAll(".agent-row")].filter((oe) => !oe.contains(Z));
        await Promise.all(ie.map((oe) => oe.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const z = [...Z.querySelectorAll(".agent-head, .agent-line")], X = [...z, ...Z.querySelectorAll("[data-agent-motion]")], $e = X.map((ie) => ie.getBoundingClientRect());
      if (S.value = E, v.value = E.id, l.reload(`card.${E.id}`), await Ve(), !$()) {
        const ie = X.map((oe) => oe.getBoundingClientRect());
        X.forEach((oe, xe) => {
          const ce = z.indexOf(oe.parentElement), Pe = $e[xe].left - ie[xe].left - (ce < 0 ? 0 : $e[ce].left - ie[ce].left), De = $e[xe].top - ie[xe].top - (ce < 0 ? 0 : $e[ce].top - ie[ce].top);
          oe.animate([{ transform: `translate(${Pe}px, ${De}px)` }, { transform: "none" }], { duration: 280, easing: Se });
        }), V.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((oe) => {
          oe.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Se, fill: "backwards" });
        });
      }
      W = !1;
    }
    async function he() {
      if (W || !b.value) return;
      W = !0;
      const E = V.value.querySelector(`[data-agent-open="${v.value}"]`), Z = [...E.children], z = $() ? [] : Z.map((X) => X.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(z.map((X) => X.finished)), v.value = null, await Ve(), ae.value.scrollTop = ne, z.forEach((X) => X.cancel()), $() || (E.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Se }), V.value.querySelectorAll(".agent-row").forEach((X) => {
        X.contains(E) || X.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Se });
      })), W = !1;
    }
    function Me(E) {
      S.value = E, v.value = E.id, l.reload(`card.${E.id}`);
    }
    const de = (E) => v.value === E.id ? he() : ue(E);
    re(B, (E) => E.trim() && (v.value = null)), re(U, () => {
      v.value = null;
    });
    const ze = (E) => {
      E.key === "Escape" && he();
    };
    return window.addEventListener("keydown", ze), be(() => window.removeEventListener("keydown", ze)), (E, Z) => (t(), o("div", {
      ref_key: "agents",
      ref: V,
      class: se(["agents", { focused: b.value }])
    }, [
      y(u(dt), {
        modelValue: B.value,
        "onUpdate:modelValue": Z[1] || (Z[1] = (z) => B.value = z),
        placeholder: "Search agents",
        "menu-count": J.value,
        "data-agents-search": ""
      }, {
        menu: A(() => [
          y(u(Te), null, {
            default: A(() => [...Z[2] || (Z[2] = [
              f("Type", -1)
            ])]),
            _: 1
          }),
          (t(!0), o(H, null, Q(L.value.roles, (z) => (t(), F(u(Ce), {
            key: z,
            role: "menuitemcheckbox",
            "aria-checked": R.value.roles.includes(z),
            checked: R.value.roles.includes(z),
            "data-filter-role": z,
            onClick: (X) => D("roles", z)
          }, {
            default: A(() => [
              f(p(K(z)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          L.value.profiles.length ? (t(), F(u(Te), { key: 0 }, {
            default: A(() => [...Z[3] || (Z[3] = [
              f("Profile", -1)
            ])]),
            _: 1
          })) : h("", !0),
          (t(!0), o(H, null, Q(L.value.profiles, (z) => (t(), F(u(Ce), {
            key: z.name,
            role: "menuitemcheckbox",
            "aria-checked": R.value.profiles.includes(z.name),
            checked: R.value.profiles.includes(z.name),
            "data-filter-profile": z.name,
            onClick: (X) => D("profiles", z.name)
          }, {
            default: A(() => [
              f(p(z.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          y(u(Te), null, {
            default: A(() => [...Z[4] || (Z[4] = [
              f("Program", -1)
            ])]),
            _: 1
          }),
          (t(!0), o(H, null, Q(u(q), (z) => (t(), F(u(Ce), {
            key: z.name,
            role: "menuitemcheckbox",
            "aria-checked": R.value.programs.includes(z.name),
            checked: R.value.programs.includes(z.name),
            "data-filter-program": z.name,
            onClick: (X) => D("programs", z.name)
          }, {
            default: A(() => [
              f(p(z.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          J.value ? (t(), F(u(Ce), {
            key: 1,
            "data-filter-clear": "",
            onClick: Y
          }, {
            default: A(() => [...Z[5] || (Z[5] = [
              f("Clear filters", -1)
            ])]),
            _: 1
          })) : h("", !0)
        ]),
        default: A(() => [
          y(u(ct), {
            options: L.value.states,
            value: U.value,
            onPick: Z[0] || (Z[0] = (z) => U.value = z)
          }, null, 8, ["options", "value"]),
          y(On, { onOpenAgent: Me })
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      U.value === "retired" && L.value.upgrade_retired ? (t(), o("p", zn, "Retired during the upgrade: " + p(L.value.upgrade_retired), 1)) : h("", !0),
      d("div", {
        ref_key: "list",
        ref: ae,
        class: se(["agents-view", { "agents-view-open": b.value }])
      }, [
        u(M) && !u(k) && !g.value.length && J.value ? (t(), F(u(Re), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: A(() => [
            y(u(ee), {
              small: "",
              "data-empty-clear": "",
              onClick: Y
            }, {
              default: A(() => [...Z[6] || (Z[6] = [
                f("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (t(), F(u(vt), {
          key: 1,
          rows: g.value,
          failure: u(k),
          loaded: u(M),
          more: !b.value && u(j),
          older: G,
          empty: I.value.title,
          hint: I.value.hint,
          searching: i.value
        }, {
          default: A(({ row: z }) => [
            d("div", {
              class: "agent-row",
              "data-agent-row": z.id
            }, [
              y(ln, {
                row: z,
                facts: x(z),
                progress: T(z),
                "wait-reason": N(z),
                open: z.id === v.value,
                onToggle: (X) => de(z)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, Bn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, En = /* @__PURE__ */ _(Vn, [["__scopeId", "data-v-06777d49"]]);
export {
  En as A
};
