/* @code-commandments-generated */
import { openBlock as n, createElementBlock as r, withModifiers as Q, unref as c, createTextVNode as p, toDisplayString as g, createVNode as f, createBlock as N, withCtx as S, Fragment as B, renderList as K, createElementVNode as d, createCommentVNode as m, computed as b, ref as C, watch as ae, defineAsyncComponent as Ue, onUnmounted as $e, createSlots as Ke, resolveDynamicComponent as Ze, normalizeStyle as oe, normalizeClass as X, renderSlot as he, onMounted as He, Teleport as Ge, mergeProps as Ye, toRef as Qe, withKeys as Oe, withDirectives as Xe, vShow as et, nextTick as ze } from "vue";
import { peekRef as me, Icon as ve, RunningCommand as tt, FoldGroup as Ie, TaskStatusIcon as at, useWindow as fe, loadWindowComponent as nt, coalesced as Ee, READ_RATES as Ne, InnerTabs as lt, TabBody as st, SwitchCase as qe, EmptyState as Se, Btn as te, TextArea as ot, TextInput as Ae, useNow as it, age as rt, perHour as ut, TimeAgo as be, useRows as dt, useDeclaredRows as Ve, SearchBar as ct, Segmented as gt, MenuLabel as Ce, MenuItem as we, RowList as vt, toggleFilter as pt } from "@journal/window-kit";
import { _ as Z, T as ht } from "./TranscriptRows-DYd21kxy.js";
const mt = {
  class: "agent-command",
  "data-agent-command": ""
}, ft = {
  key: 1,
  "data-agent-stopped": ""
}, kt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(t) {
    return (o, i) => (n(), r("span", mt, [
      t.waitReason ? (n(), r("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: i[0] || (i[0] = Q((l) => c(me)("test_queue:0"), ["stop"]))
      }, [
        p("Waiting: " + g(t.waitReason) + " ", 1),
        f(c(ve), {
          name: "arrow",
          size: 11
        })
      ])) : t.stopped ? (n(), r("span", ft, "Waiting")) : (n(), N(c(tt), {
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
    return (l, v) => (n(), N(c(Ie), {
      label: t.section.label,
      count: t.section.tasks.length,
      open: t.open,
      "data-agent-section": t.section.state,
      onToggle: v[0] || (v[0] = (y) => i("toggle"))
    }, {
      default: S(() => [
        (n(!0), r(B, null, K(t.section.tasks, (y) => (n(), r("button", {
          key: y.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": y.id,
          onClick: (x) => c(me)(`tasks:${y.id}`)
        }, [
          f(c(at), {
            status: y.state
          }, null, 8, ["status"]),
          d("span", wt, g(y.id), 1),
          d("span", Mt, g(y.title), 1),
          y.plan_id ? (n(), r("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${y.plan_id}: ${y.plan_title}`
          }, "Plan " + g(y.plan_id) + ": " + g(y.plan_title), 9, $t)) : m("", !0)
        ], 8, bt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Ct = /* @__PURE__ */ Z(xt, [["__scopeId", "data-v-238ff959"]]), St = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, At = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, jt = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, Tt = ["data-peek", "onClick"], Rt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ot = {
  key: 0,
  class: "agent-helper-brief"
}, zt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Vt = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Lt = "It ended without a report", Bt = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(t) {
    const o = t, i = ["started", "blocked", "open", "completed"], l = b(() => {
      var e, a;
      return o.row.ended_at && ((a = (e = o.facts) == null ? void 0 : e.job_returned) != null && a.startsWith(Lt)) ? o.facts.job_returned : "";
    }), v = b(() => o.tasks.length ? i.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: o.tasks.filter((a) => a.state === e || e === "started" && a.state === "testing" || e === "completed" && a.state === "cancelled") })) : []), y = /* @__PURE__ */ new Set(["completed"]), x = C({}), k = (e) => !(x.value[e] ?? y.has(e)), w = (e) => x.value = { ...x.value, [e]: k(e) }, O = fe(), { rows: $ } = O.props.reports;
    O.state["reports.agent"] = String(o.row.id), O.reload("reports");
    const z = b(() => o.row.access === "read-only"), H = b(() => !!o.row.retired_at || o.row.state === "retired"), I = ["tasks", "transcript", "terminal", "file-feed", "reports"], F = b(() => (H.value ? O.tabs.filter((a) => ["reports", "transcript"].includes(a.key)) : z.value ? O.tabs.filter((a) => ["reports", "transcript", "terminal"].includes(a.key)) : [...O.tabs]).sort((a, s) => (I.indexOf(a.key) < 0 ? I.length : I.indexOf(a.key)) - (I.indexOf(s.key) < 0 ? I.length : I.indexOf(s.key)))), E = () => z.value || H.value ? F.value.find((e) => e.key === "transcript") : F.value[0], R = C(E());
    ae(F, (e) => {
      e.some((a) => {
        var s;
        return a.key === ((s = R.value) == null ? void 0 : s.key);
      }) || (R.value = e[0]);
    }), ae(() => o.open, (e) => {
      e && (R.value = E());
    });
    const L = Object.fromEntries(O.tabs.filter((e) => e.component).map((e) => [e.key, Ue(() => nt(e.component))])), W = C(!1), D = C(""), q = C(""), J = b(() => o.row.role !== "main" && (!o.row.ended_at || o.stoppedWithWork || o.waitReason));
    async function U() {
      if (!o.open || !J.value) return;
      const e = await O.read(`usage tool --agent ${o.row.id}`, { deferred: !0 });
      o.open && (D.value = e.ok ? e.value.tool : "", q.value = e.ok ? e.value.note : "");
    }
    const h = O.follow(["hook_call.*", "process_part.*"], Ee(U, Ne.agentCommand));
    return $e(() => h == null ? void 0 : h()), ae(() => o.open, (e) => {
      e && U();
    }, { immediate: !0 }), (e, a) => {
      var s;
      return n(), r("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: a[2] || (a[2] = Q(() => {
        }, ["stop"]))
      }, [
        t.row.retirement_reason ? (n(), r("p", St, "Retirement reason: " + g(t.row.retirement_reason), 1)) : m("", !0),
        t.row.resume_reason ? (n(), r("p", At, g(t.row.resume_reason), 1)) : m("", !0),
        J.value ? (n(), N(yt, {
          key: 2,
          class: "agent-command",
          "wait-reason": t.waitReason,
          stopped: t.stoppedWithWork,
          command: D.value,
          note: q.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0),
        l.value ? (n(), r("p", jt, g(l.value), 1)) : m("", !0),
        f(c(lt), {
          class: "agent-tabs",
          tabs: F.value,
          active: R.value,
          answer: { tasks: t.tasks.length, reports: c($).length },
          onChoose: a[0] || (a[0] = (j) => R.value = j)
        }, null, 8, ["tabs", "active", "answer"]),
        f(c(st), {
          class: "agent-tab-body",
          tab: R.value,
          "data-agent-tab-body": (s = R.value) == null ? void 0 : s.key
        }, {
          default: S(() => {
            var j;
            return [
              f(c(qe), {
                value: (j = R.value) == null ? void 0 : j.key
              }, Ke({
                reports: S(() => [
                  c($).length ? m("", !0) : (n(), N(c(Se), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: S(() => [...a[3] || (a[3] = [
                      p("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (n(!0), r(B, null, K(c($), (u) => (n(), r("button", {
                    key: u.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${u.id}`,
                    onClick: (A) => c(me)(`messages:${u.id}`)
                  }, g(u.text), 9, Tt))), 128))
                ]),
                tasks: S(() => {
                  var u;
                  return [
                    t.tasks.length ? m("", !0) : (n(), N(c(Se), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: S(() => [...a[4] || (a[4] = [
                        p("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (n(!0), r(B, null, K(v.value, (A) => (n(), N(Ct, {
                      key: A.state,
                      section: A,
                      open: k(A.state),
                      onToggle: (_) => w(A.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (u = t.facts) != null && u.instruction ? (n(), r(B, { key: 1 }, [
                      a[5] || (a[5] = d("p", { class: "agent-label" }, "Instruction", -1)),
                      d("div", Rt, g(t.facts.instruction), 1)
                    ], 64)) : m("", !0)
                  ];
                }),
                transcript: S(() => {
                  var u;
                  return [
                    z.value ? (n(), r(B, { key: 0 }, [
                      (u = t.facts) != null && u.instruction ? (n(), r("div", Ot, [
                        f(c(Ie), {
                          label: "Instruction",
                          open: W.value,
                          "data-agent-section": "instruction",
                          onToggle: a[1] || (a[1] = (A) => W.value = !W.value)
                        }, {
                          default: S(() => [
                            d("div", zt, g(t.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : t.facts && t.row.ended_at ? (n(), r("p", Vt, "No job recorded")) : m("", !0)
                    ], 64)) : m("", !0),
                    f(ht, {
                      line: `agent transcript ${t.row.id}`,
                      padding: "0"
                    }, null, 8, ["line"])
                  ];
                }),
                _: 2
              }, [
                K(c(L), (u, A) => ({
                  name: A,
                  fn: S(() => [
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
}, Ht = /* @__PURE__ */ Z(Bt, [["__scopeId", "data-v-77c4ea3f"]]), It = { class: "action-field" }, Et = ["value", "disabled"], Nt = ["value"], qt = { key: 1 }, Wt = {
  key: 1,
  class: "action-field"
}, _t = { class: "action-buttons" }, Ft = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(t) {
    return (o, i) => (n(), r("form", {
      onSubmit: i[4] || (i[4] = Q((l) => o.$emit("submit"), ["prevent"]))
    }, [
      t.row.job_task_flag ? (n(), r(B, { key: 0 }, [
        d("label", It, [
          i[6] || (i[6] = p("Task ", -1)),
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
            }, g(l.id) + ": " + g(l.title), 9, Nt))), 128))
          ], 40, Et)
        ]),
        t.moreTasks ? (n(), N(c(te), {
          key: 0,
          small: "",
          disabled: t.pending || t.loading,
          "data-agent-more-tasks": "",
          onClick: i[1] || (i[1] = (l) => o.$emit("more"))
        }, {
          default: S(() => [...i[7] || (i[7] = [
            p("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : m("", !0),
        !t.loading && !t.tasks.length && !t.failure ? (n(), r("p", qt, "No open tasks.")) : m("", !0)
      ], 64)) : (n(), r("label", Wt, [
        i[8] || (i[8] = p("Job", -1)),
        f(c(ot), {
          value: t.text,
          disabled: t.pending,
          "data-agent-job-text": "",
          onInput: i[2] || (i[2] = (l) => o.$emit("update:text", l.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      d("div", _t, [
        f(c(te), {
          type: "submit",
          small: "",
          disabled: t.pending || !t.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: S(() => [...i[9] || (i[9] = [
            p("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        f(c(te), {
          small: "",
          disabled: t.pending,
          onClick: i[3] || (i[3] = (l) => o.$emit("cancel"))
        }, {
          default: S(() => [...i[10] || (i[10] = [
            p("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Dt = /* @__PURE__ */ Z(Ft, [["__scopeId", "data-v-adde4158"]]), Pt = { class: "action-buttons" }, Jt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(t) {
    return (o, i) => (n(), r("form", {
      "data-agent-retire-confirm": "",
      onSubmit: i[2] || (i[2] = Q((l) => o.$emit("submit"), ["prevent"]))
    }, [
      i[5] || (i[5] = d("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      f(c(Ae), {
        "model-value": t.reason,
        label: "Reason",
        disabled: t.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": i[0] || (i[0] = (l) => o.$emit("update:reason", l))
      }, null, 8, ["model-value", "disabled"]),
      d("div", Pt, [
        f(c(te), {
          type: "submit",
          small: "",
          disabled: t.pending || !t.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: S(() => [...i[3] || (i[3] = [
            p("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        f(c(te), {
          small: "",
          disabled: t.pending,
          onClick: i[1] || (i[1] = (l) => o.$emit("cancel"))
        }, {
          default: S(() => [...i[4] || (i[4] = [
            p("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Ut = /* @__PURE__ */ Z(Jt, [["__scopeId", "data-v-23a905c0"]]), Kt = { class: "action-buttons" }, Zt = {
  key: 0,
  role: "alert"
}, Gt = {
  key: 1,
  role: "status"
}, Yt = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(t) {
    const o = t, i = fe(), l = C(""), v = C(""), y = C(""), x = C(""), k = C([]), w = C(0), O = C(!1), $ = C(!1), z = C(!1), H = C(""), I = C(""), F = b(() => !!o.row.retired_at || o.row.state === "retired"), E = b(() => !F.value && !!o.row.ended_at), R = b(() => {
      var e;
      return E.value && ((e = o.row.job_command) == null ? void 0 : e.length) && !o.row.resume_reason;
    }), L = b(() => R.value && !$.value && (o.row.job_task_flag ? k.value.some((e) => String(e.id) === x.value) : !!v.value.trim()));
    function W(e) {
      l.value = e, v.value = "", y.value = "", x.value = "", H.value = "", I.value = "";
    }
    async function D() {
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
    async function J(e, a) {
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
    async function U() {
      if (!L.value) return;
      const e = o.row.job_task_flag ? [o.row.job_task_flag, x.value] : [v.value.trim()];
      await J([...o.row.job_command, String(o.row.id), ...e], "Job sent.");
    }
    async function h() {
      !E.value || l.value !== "retire" || !y.value.trim() || await J(["agent", "retire", String(o.row.id), "--reason", y.value.trim()], "Agent retired permanently.");
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
        d("div", Kt, [
          E.value ? (n(), r(B, { key: 0 }, [
            (s = t.row.job_command) != null && s.length ? (n(), N(c(te), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: z.value || $.value || !R.value,
              onClick: D
            }, {
              default: S(() => [...a[8] || (a[8] = [
                p("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0),
            t.row.role !== "main" ? (n(), N(c(te), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: z.value || $.value,
              onClick: a[0] || (a[0] = (j) => W("retire"))
            }, {
              default: S(() => [...a[9] || (a[9] = [
                p("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0)
          ], 64)) : m("", !0)
        ]),
        f(c(qe), { value: l.value }, {
          job: S(() => [
            f(Dt, {
              task: x.value,
              "onUpdate:task": a[1] || (a[1] = (j) => x.value = j),
              text: v.value,
              "onUpdate:text": a[2] || (a[2] = (j) => v.value = j),
              row: t.row,
              tasks: k.value,
              pending: z.value,
              loading: $.value,
              "more-tasks": O.value,
              failure: H.value,
              "job-ready": L.value,
              onSubmit: U,
              onMore: q,
              onCancel: a[3] || (a[3] = (j) => W(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: S(() => [
            f(Ut, {
              reason: y.value,
              "onUpdate:reason": a[4] || (a[4] = (j) => y.value = j),
              pending: z.value,
              onSubmit: h,
              onCancel: a[5] || (a[5] = (j) => W(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        H.value ? (n(), r("p", Zt, g(H.value), 1)) : m("", !0),
        I.value ? (n(), r("p", Gt, g(I.value), 1)) : m("", !0)
      ], 32));
    };
  }
}, Qt = /* @__PURE__ */ Z(Yt, [["__scopeId", "data-v-97a6dc49"]]), Xt = {
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
      t.rate ? (n(), r("span", ea, g(t.rate), 1)) : m("", !0),
      d("span", ta, g(t.count), 1)
    ]));
  }
}, Le = /* @__PURE__ */ Z(aa, [["__scopeId", "data-v-44694015"]]), na = ["data-icon", "stroke-width", "innerHTML"], G = {
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
    return (y, x) => (n(), r("svg", {
      class: "ico",
      "data-icon": t.name,
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
      t.checked !== null ? (n(), r("span", la, g(t.checked ? "✓" : ""), 1)) : m("", !0),
      t.description ? (n(), r("span", sa, [
        d("span", null, [
          he(o.$slots, "default", {}, void 0, !0)
        ]),
        d("small", null, g(t.description), 1)
      ])) : he(o.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ce = /* @__PURE__ */ Z(oa, [["__scopeId", "data-v-fec99974"]]), ia = {}, ra = { class: "menu-label" };
function ua(t, o) {
  return n(), r("span", ra, [
    he(t.$slots, "default", {}, void 0, !0)
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
    const i = t, l = o, v = b(() => i.skills.filter((x) => x.state === "loaded")), y = b(() => i.skills.filter((x) => x.state !== "loaded"));
    return (x, k) => (n(), r("div", da, [
      f(pe, null, {
        default: S(() => [...k[1] || (k[1] = [
          p("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      v.value.length ? m("", !0) : (n(), r("p", ca, "None yet. Compacting the conversation empties this list.")),
      (n(!0), r(B, null, K(v.value, (w) => (n(), r("p", {
        key: w.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        f(G, {
          name: "book",
          size: 12
        }),
        p(g(w.skill), 1)
      ]))), 128)),
      y.value.length ? (n(), r(B, { key: 1 }, [
        f(pe, null, {
          default: S(() => [...k[2] || (k[2] = [
            p("Still to read", -1)
          ])]),
          _: 1
        }),
        (n(!0), r(B, null, K(y.value, (w) => (n(), r("p", {
          key: w.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          f(G, {
            name: "book",
            size: 12
          }),
          p(g(w.skill), 1)
        ]))), 128))
      ], 64)) : m("", !0),
      f(ce, {
        "data-agent-skills-browse": "",
        onClick: k[0] || (k[0] = (w) => l("browse"))
      }, {
        default: S(() => [...k[3] || (k[3] = [
          p("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, va = /* @__PURE__ */ Z(ga, [["__scopeId", "data-v-be514d47"]]), pa = (t, o, i) => Math.max(o, Math.min(i, t)), We = /* @__PURE__ */ new WeakMap(), ha = (t, o) => We.set(t, o);
function ma(t, o) {
  for (let i = o; i; i = We.get(i) ?? i.parentElement) if (i === t) return !0;
  return !1;
}
function fa(t, o) {
  const i = (l) => {
    var y, x;
    const v = ((y = t.value) == null ? void 0 : y.element) || ((x = t.value) == null ? void 0 : x.$el) || t.value;
    v && !ma(v, l.target) && o(l);
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
    const l = t, v = C(null), y = (u) => u ? `${u}px` : void 0, x = b(() => ({
      minWidth: y(l.minWidth),
      maxWidth: y(l.maxWidth),
      maxHeight: y(l.maxHeight),
      height: y(l.height)
    })), k = C({ w: 0, h: 0 }), w = C(l.anchor ? l.anchor.getBoundingClientRect() : null), O = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), $ = (u) => ({
      left: Math.max(0, u.left),
      top: Math.max(0, u.top),
      right: Math.min(window.innerWidth, u.right),
      bottom: Math.min(window.innerHeight, u.bottom)
    }), z = (u) => {
      const A = u.closest(".pane, .float-window");
      return A ? $(A.getBoundingClientRect()) : O();
    }, H = (u, A) => `${Math.max(0, u ? Math.min(u, A) : A)}px`;
    function I(u, A) {
      return {
        below: u.bottom - A.bottom - l.gap - de,
        above: A.top - u.top - l.gap - de,
        across: u.right - u.left - 2 * de
      };
    }
    function F(u) {
      const A = z(l.anchor), _ = I(A, u);
      return k.value.w <= _.across && k.value.h <= Math.max(_.below, _.above) ? A : O();
    }
    const E = b(() => {
      if (!w.value) return x.value;
      const u = w.value, A = F(u), _ = I(A, u), { w: Y, h: ne } = k.value, ge = l.align === "auto" ? u.left + u.right > A.left + A.right : l.align === "right", le = pa(ge ? u.right - Y : u.left, A.left + de, Math.max(A.left + de, A.right - Y - de)), ie = ne > _.below && _.above > _.below ? { bottom: `${window.innerHeight - u.top + l.gap}px`, maxHeight: H(l.maxHeight, _.above) } : { top: `${u.bottom + l.gap}px`, maxHeight: H(l.maxHeight, _.below) };
      return { ...x.value, ...ie, left: `${le}px`, maxWidth: H(l.maxWidth, _.across) };
    }), R = i, L = () => [...v.value.querySelectorAll("button:not(:disabled)")];
    function W(u) {
      const A = L(), _ = A.indexOf(document.activeElement);
      A[(_ + u + A.length) % A.length].focus();
    }
    const D = { ArrowDown: () => W(1), ArrowUp: () => W(-1), Escape: () => R("close") }, q = (u) => D[u.key] && (u.preventDefault(), D[u.key]()), J = () => v.value && (k.value = { w: v.value.offsetWidth, h: v.value.scrollHeight });
    let U = 0;
    const h = new ResizeObserver(() => {
      cancelAnimationFrame(U), U = requestAnimationFrame(J);
    });
    fa(v, (u) => l.anchor && !l.anchor.contains(u.target) && R("close"));
    const e = (u, A) => ["top", "left", "right", "bottom"].some((_) => Math.abs(u[_] - A[_]) > 1), a = (u) => u.bottom < 0 || u.top > window.innerHeight;
    let s = 0;
    function j() {
      if (l.anchor) {
        const u = l.anchor.getBoundingClientRect();
        if (!l.anchor.isConnected || a(u)) return R("close");
        e(u, w.value) && (w.value = u);
      }
      s = requestAnimationFrame(j);
    }
    return He(() => {
      l.anchor && v.value && ha(v.value, l.anchor), J(), v.value && h.observe(v.value), !l.plain && L()[0] && L()[0].focus(), j();
    }), $e(() => {
      h.disconnect(), cancelAnimationFrame(s), cancelAnimationFrame(U);
    }), o({ element: v }), (u, A) => (n(), N(Ge, {
      to: "body",
      disabled: !t.anchor
    }, [
      d("div", Ye({
        ref_key: "panel",
        ref: v
      }, u.$attrs, {
        class: ["menu-panel", { anchored: t.anchor }],
        style: E.value,
        onKeydown: q
      }), [
        he(u.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ya = /* @__PURE__ */ Z(ka, [["__scopeId", "data-v-3d203970"]]);
async function ba(t, o, i) {
  if (!t) return i(o);
  const { target: l, fields: v } = t, y = Object.fromEntries(Object.keys(v).map((w) => [w, l[w]])), x = () => Object.assign(l, y);
  Object.assign(l, v);
  let k = !1;
  try {
    const w = await i(o);
    return k = w.ok, w;
  } finally {
    k || x();
  }
}
function wa(t, o, i) {
  const l = C([]), v = C([]), y = C({}), x = C(""), k = C(!1), w = b(() => !!t.value && !t.value.ended_at), O = b(() => w.value && !!t.value.paused_at);
  async function $() {
    if (w.value) {
      const R = await o(["agent", "controls", String(t.value.id)]);
      l.value = R.ok ? R.value.groups : [];
      return;
    }
    const E = await o(["agent", "programs"]);
    v.value = E.ok ? E.value.rows : [];
  }
  async function z(E, R = null) {
    x.value = "";
    const L = await ba(R, E, o);
    return x.value = L.ok ? "" : L.error, i(), L;
  }
  const H = (E, R) => z(["agent", "control", String(t.value.id), E, R.value], { target: y, fields: { value: { ...y.value, [E]: R.label } } }), I = () => (k.value = !1, z(["agent", "stop", String(t.value.id)], { target: t.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), F = (E) => z(["agent", "launch", E.name]);
  return He($), ae(w, $), { groups: l, programs: v, chosen: y, failure: x, asking: k, running: w, paused: O, choose: H, stop: I, start: F };
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
const xa = ["disabled", "title"], Ca = ["title"], Sa = { class: "gauge usage" }, Aa = ["disabled", "title"], ja = { class: "gauge" }, Ta = ["disabled", "title"], Ra = ["disabled"], Oa = ["disabled"], za = {
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
    const i = t, l = o, v = wa(Qe(i, "agent"), i.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => l("changed")), y = C(null), x = C(""), k = b(() => v.groups.value.find((h) => h.key === x.value));
    function w(h, e) {
      y.value = h.currentTarget, x.value = e;
    }
    function O() {
      y.value = null, x.value = "", v.asking.value = !1;
    }
    const $ = C([]), z = b(() => $.value.filter((h) => h.state === "loaded"));
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
    const F = (h) => v.groups.value.some((e) => e.key === h), E = b(() => {
      var h;
      return v.chosen.value.model ?? ((h = L.value) == null ? void 0 : h.model) ?? "";
    }), R = b(() => {
      var h;
      return v.chosen.value.effort ?? ((h = L.value) == null ? void 0 : h.effort) ?? "";
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
    }), D = b(() => W.value ? Math.max(0, Math.min(100, Math.round(W.value.used_percent))) : null), q = b(() => {
      var h;
      return ((h = L.value) == null ? void 0 : h.context_percent) == null ? null : Math.round(L.value.context_percent);
    }), J = b(() => {
      var h;
      return (h = L.value) != null && h.cost_dollars ? `$${L.value.cost_dollars.toFixed(2)}` : "";
    }), U = b(() => {
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
          f(G, {
            name: "agents",
            size: 12
          }),
          p(" " + g(c(Ma)(t.agent.program)), 1)
        ], 8, xa),
        D.value !== null ? (n(), r("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${D.value}% of the plan's ${W.value.title} allowance used`,
          onClick: e[1] || (e[1] = (a) => l("open", "usage", a.currentTarget))
        }, [
          f(G, {
            name: "allowance",
            size: 12
          }),
          e[14] || (e[14] = p()),
          d("span", Sa, [
            d("span", {
              style: oe({ width: `${D.value}%` })
            }, null, 4)
          ]),
          p(" " + g(D.value) + "% ", 1)
        ], 8, Ca)) : m("", !0),
        q.value !== null ? (n(), r("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: t.card,
          "data-fact": "context",
          title: `Context ${q.value}% full: clear or compact it`,
          onClick: e[2] || (e[2] = (a) => F("context") ? w(a, "context") : l("open", "context", a.currentTarget))
        }, [
          f(G, {
            name: "gauge",
            size: 12
          }),
          e[15] || (e[15] = p()),
          d("span", ja, [
            d("span", {
              style: oe({ width: `${q.value}%` })
            }, null, 4)
          ]),
          p(" " + g(q.value) + "% ", 1)
        ], 8, Aa)) : m("", !0),
        E.value ? (n(), r("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: t.card,
          "data-fact": "model",
          title: `${E.value}: change the model`,
          onClick: e[3] || (e[3] = (a) => F("model") ? w(a, "model") : null)
        }, [
          f(G, {
            name: "model",
            size: 12
          }),
          p(" " + g(E.value), 1)
        ], 8, Ta)) : m("", !0),
        F("effort") || t.card && R.value ? (n(), r("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: t.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: e[4] || (e[4] = (a) => w(a, "effort"))
        }, [
          f(G, {
            name: "bolt",
            size: 12
          }),
          p(" " + g(R.value), 1)
        ], 8, Ra)) : m("", !0),
        J.value ? (n(), r("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: t.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: e[5] || (e[5] = (a) => l("open", "cost", a.currentTarget))
        }, g(J.value), 9, Oa)) : m("", !0),
        U.value ? (n(), r("span", za, [
          f(G, {
            name: "reminders",
            size: 12
          }),
          p(" " + g(U.value), 1)
        ])) : m("", !0),
        t.branch ? (n(), r("span", Va, [
          f(G, {
            name: "branch",
            size: 12
          }),
          p(" " + g(t.branch), 1)
        ])) : m("", !0),
        t.card ? m("", !0) : (n(), r("button", {
          key: 7,
          type: "button",
          class: X(["fact", { none: !t.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: e[6] || (e[6] = (a) => l("open", "jobs", a.currentTarget))
        }, [
          f(G, {
            name: "clock",
            size: 12
          }),
          p(" " + g(t.jobs), 1)
        ], 2)),
        t.run ? (n(), r("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: I
        }, [
          f(G, {
            name: "book",
            size: 12
          }),
          p(" " + g(z.value.length), 1)
        ])) : m("", !0),
        t.fitness ? (n(), r(B, { key: 9 }, [
          d("button", {
            type: "button",
            class: X(["fact", "fitness-fact", { low: t.fitness.is_measured && t.fitness.score < Na }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: e[7] || (e[7] = (a) => l("open", "fitness", a.currentTarget))
          }, [
            f(G, {
              name: "heart",
              size: 12
            }),
            p(" " + g(t.fitness.is_measured ? t.fitness.score : "–"), 1)
          ], 2),
          d("button", {
            type: "button",
            class: X(["fact", "load-fact", t.fitness.workload_level]),
            "data-fact": "load",
            title: "Compare incoming messages with agent replies",
            onClick: e[8] || (e[8] = (a) => l("open", "load", a.currentTarget))
          }, [
            f(G, {
              name: "weight",
              size: 12
            }),
            p(" " + g(t.fitness.workload), 1)
          ], 2)
        ], 64)) : m("", !0)
      ], 64)) : t.run && !t.loading ? (n(), r("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: e[9] || (e[9] = (a) => w(a, "start"))
      }, [
        f(G, {
          name: "agents",
          size: 12
        }),
        e[16] || (e[16] = p(" Start an agent", -1))
      ])) : m("", !0),
      e[22] || (e[22] = d("span", { class: "space" }, null, -1)),
      c(v).failure.value ? (n(), r("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: c(v).failure.value
      }, g(c(v).failure.value), 9, La)) : m("", !0),
      he(h.$slots, "default", {}, void 0, !0),
      y.value ? (n(), N(ya, {
        key: 3,
        anchor: y.value,
        "min-width": 190,
        onClose: O
      }, {
        default: S(() => {
          var a;
          return [
            x.value === "agent" ? (n(), r(B, { key: 0 }, [
              c(v).asking.value ? (n(), r(B, { key: 0 }, [
                f(pe, { "data-agent-stop-ask": "" }, {
                  default: S(() => [...e[17] || (e[17] = [
                    p("Stop the agent? It stops what it is doing.", -1)
                  ])]),
                  _: 1
                }),
                f(ce, {
                  "data-agent-stop-confirm": "",
                  onClick: e[10] || (e[10] = (s) => (O(), c(v).stop()))
                }, {
                  default: S(() => [...e[18] || (e[18] = [
                    p("Stop it", -1)
                  ])]),
                  _: 1
                }),
                f(ce, {
                  onClick: e[11] || (e[11] = (s) => c(v).asking.value = !1)
                }, {
                  default: S(() => [...e[19] || (e[19] = [
                    p("Keep it running", -1)
                  ])]),
                  _: 1
                })
              ], 64)) : (n(), N(ce, {
                key: 1,
                "data-agent-stop": "",
                onClick: e[12] || (e[12] = (s) => c(v).asking.value = !0)
              }, {
                default: S(() => [...e[20] || (e[20] = [
                  p("Stop", -1)
                ])]),
                _: 1
              }))
            ], 64)) : x.value === "start" ? (n(), r(B, { key: 1 }, [
              f(pe, null, {
                default: S(() => [...e[21] || (e[21] = [
                  p("Start an agent", -1)
                ])]),
                _: 1
              }),
              (n(!0), r(B, null, K(c(v).programs.value, (s) => (n(), N(ce, {
                key: s.name,
                "data-agent-program": s.name,
                onClick: (j) => (O(), c(v).start(s))
              }, {
                default: S(() => [
                  p(g(s.title), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-program", "onClick"]))), 128))
            ], 64)) : x.value === "skills" ? (n(), N(va, {
              key: 2,
              skills: $.value,
              onBrowse: e[13] || (e[13] = (s) => (O(), l("open", "skills", null)))
            }, null, 8, ["skills"])) : k.value ? (n(), r(B, { key: 3 }, [
              f(pe, null, {
                default: S(() => [
                  p(g(k.value.label), 1)
                ]),
                _: 1
              }),
              x.value === "context" ? (n(), r(B, { key: 0 }, [
                d("div", Ba, [
                  d("span", Ha, [
                    d("span", {
                      style: oe({ width: `${q.value}%` })
                    }, null, 4)
                  ]),
                  d("span", Ia, g(q.value) + "%", 1)
                ]),
                d("p", Ea, g(c($a)(((a = L.value) == null ? void 0 : a.last_compaction) ?? null)), 1)
              ], 64)) : m("", !0),
              (n(!0), r(B, null, K(k.value.choices, (s) => (n(), N(ce, {
                key: s.value,
                "data-agent-choice": s.value,
                onClick: (j) => (c(v).choose(k.value.key, s), O())
              }, {
                default: S(() => [
                  p(g(s.label), 1)
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
}, Wa = /* @__PURE__ */ Z(qa, [["__scopeId", "data-v-0fdbf3d0"]]), _a = ["data-agent-open", "aria-expanded", "role", "tabindex"], Fa = { class: "agent-head" }, Da = ["data-state"], Pa = {
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
    const i = { helper: "Helper", reviewer: "Reviewer" }, l = t, v = o, y = it(), x = b(() => {
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
      var e, a, s, j, u;
      return l.row.role === "helper" ? ((e = l.facts) == null ? void 0 : e.helper_job) || "" : (a = l.facts) != null && a.job_enabled && (((s = l.facts) == null ? void 0 : s.task_title) || ((j = w.value[0]) == null ? void 0 : j.title) || ((u = k.value.at(-1)) == null ? void 0 : u.title)) || "";
    }), z = b(() => {
      const e = $.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return e ? `${e[1].toLowerCase() === "plan" ? "plans" : "docs"}:${e[2]}` : "";
    }), H = b(() => {
      var e, a, s;
      return [l.row.program, (e = l.facts) == null ? void 0 : e.model, (a = l.facts) == null ? void 0 : a.effort, (s = l.facts) != null && s.job_enabled ? `${l.row.role} ${l.row.id}` : ""].filter(Boolean).join(" · ");
    }), I = fe(), F = b(() => rt(l.row.process_started_at || l.row.created_at, y.value)), E = /* @__PURE__ */ new Set(["open", "started", "testing"]), R = b(() => !!l.row.ended_at && l.row.role !== "main" && k.value.some((e) => E.has(e.state))), L = b(() => {
      var e;
      return l.row.retired_at || l.row.state === "retired" ? "retired" : l.waitReason || R.value ? "waiting" : l.row.state === "running" && ((e = l.facts) == null ? void 0 : e.state) || l.row.state;
    }), W = b(() => {
      var e;
      return l.waitReason ? `Waiting: ${l.waitReason}` : L.value === "blocked" ? (e = l.facts) != null && e.blocked_reason ? `Blocked: ${l.facts.blocked_reason}` : "Blocked" : R.value ? "Stopped with work left" : "";
    }), D = b(() => {
      var e;
      return ((e = l.progress) == null ? void 0 : e.completed_count) ?? k.value.filter((a) => a.state === "completed").length;
    }), q = b(() => {
      var e;
      return ((e = l.progress) == null ? void 0 : e.task_count) ?? k.value.length;
    }), J = b(() => `${D.value} of ${q.value} ${q.value === 1 ? "task" : "tasks"}`), U = b(() => {
      var a;
      const e = ut(D.value, ((a = l.progress) == null ? void 0 : a.started_at) || l.row.created_at, l.progress ? l.progress.finished_at : l.row.ended_at, y.value);
      return l.row.role !== "main" && e ? `${e} per hour` : "";
    }), h = b(() => !!l.row.retired_at || l.row.state === "retired");
    return (e, a) => {
      var s, j, u, A;
      return n(), r("div", {
        class: X(["agent-card", { open: t.open }]),
        "data-agent-open": t.row.id,
        "aria-expanded": t.open,
        role: t.open ? void 0 : "button",
        tabindex: t.open ? void 0 : 0,
        onClick: a[4] || (a[4] = (_) => !t.open && v("toggle")),
        onKeydown: [
          a[5] || (a[5] = Oe(Q((_) => !t.open && v("toggle"), ["self", "prevent"]), ["enter"])),
          a[6] || (a[6] = Oe(Q((_) => !t.open && v("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        d("span", Fa, [
          t.open ? (n(), r("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: a[0] || (a[0] = Q((_) => v("toggle"), ["stop"]))
          }, [
            f(c(ve), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : m("", !0),
          d("span", {
            class: "agent-dot",
            "data-state": L.value,
            "data-agent-motion": ""
          }, null, 8, Da),
          d("span", Pa, g(x.value), 1),
          d("span", Ja, g(((s = t.facts) == null ? void 0 : s.given_name) || t.row.id), 1),
          t.open ? m("", !0) : (n(), N(c(ve), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          d("span", Ua, [
            h.value ? (n(), r("span", Ka, [
              a[7] || (a[7] = p("Retired, ", -1)),
              f(c(be), {
                at: t.row.retired_at
              }, null, 8, ["at"])
            ])) : t.row.ended_at ? (n(), r("span", Za, [
              a[8] || (a[8] = p("Idle, ", -1)),
              f(c(be), {
                at: t.row.ended_at
              }, null, 8, ["at"])
            ])) : (n(), r("span", Ga, g(F.value), 1))
          ])
        ]),
        d("span", Ya, [
          d("span", Qa, g(t.open && ((j = t.facts) != null && j.job_enabled) ? `${t.row.role} ${t.row.id}` : t.open ? "" : H.value), 1),
          t.open ? (n(), r("span", Xa, [
            f(c(ve), {
              name: "time",
              size: 12
            }),
            a[9] || (a[9] = p("First dispatched: ", -1)),
            f(c(be), {
              at: t.row.created_at
            }, null, 8, ["at"])
          ])) : m("", !0),
          t.open && ((u = t.facts) != null && u.last_activity) ? (n(), r("span", en, [
            a[10] || (a[10] = p("Last heard: ", -1)),
            f(c(be), {
              at: t.facts.last_activity
            }, null, 8, ["at"])
          ])) : m("", !0)
        ]),
        t.open ? (n(), N(Wa, {
          key: 0,
          agent: t.row,
          branch: (A = t.progress) == null ? void 0 : A.branch,
          usage: { agents: t.facts ? [t.facts] : [], windows: [] },
          card: ""
        }, {
          default: S(() => [
            f(Qt, { row: t.row }, null, 8, ["row"]),
            t.row.role === "helper" && !t.row.ended_at ? (n(), N(c(te), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: a[1] || (a[1] = Q((_) => c(I).run(["helper", "stop", String(t.row.id)]), ["stop"]))
            }, {
              default: S(() => [...a[11] || (a[11] = [
                p("Stop", -1)
              ])]),
              _: 1
            })) : m("", !0)
          ]),
          _: 1
        }, 8, ["agent", "branch", "usage"])) : m("", !0),
        t.open && q.value && !$.value ? (n(), r("span", tn, [
          f(Le, {
            count: J.value,
            rate: U.value
          }, null, 8, ["count", "rate"])
        ])) : m("", !0),
        t.open && O.value ? (n(), r("span", an, [
          d("button", {
            type: "button",
            class: "agent-plan",
            "data-agent-plan": "",
            "data-peek": `plans:${O.value.plan_id}`,
            onClick: a[2] || (a[2] = Q((_) => c(me)(`plans:${O.value.plan_id}`), ["stop"]))
          }, "Plan " + g(O.value.plan_id) + ": " + g(O.value.plan_title), 9, nn)
        ])) : m("", !0),
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
              onClick: a[3] || (a[3] = Q((_) => c(me)(z.value), ["stop"]))
            }, g($.value), 9, sn)) : (n(), r(B, { key: 1 }, [
              p(g($.value), 1)
            ], 64))
          ], 8, ln),
          !t.open && W.value ? (n(), r("span", {
            key: 0,
            class: "agent-work-status",
            "data-agent-waiting": t.waitReason ? "" : null,
            "data-agent-stopped": R.value && !t.waitReason ? "" : null
          }, g(W.value), 9, on)) : m("", !0),
          t.open && q.value ? (n(), N(Le, {
            key: 1,
            count: J.value,
            rate: U.value
          }, null, 8, ["count", "rate"])) : m("", !0)
        ], 2)) : m("", !0),
        t.open ? (n(), N(Ht, {
          key: 4,
          row: t.row,
          facts: t.facts,
          progress: t.progress,
          "wait-reason": t.waitReason,
          tasks: k.value,
          "stopped-with-work": R.value,
          open: t.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : m("", !0)
      ], 42, _a);
    };
  }
}, un = /* @__PURE__ */ Z(rn, [["__scopeId", "data-v-0dbe057e"]]), dn = {
  class: "agent-limits",
  "data-agent-limits": ""
}, cn = ["aria-expanded"], gn = { key: 0 }, vn = { key: 1 }, pn = { class: "limits-panel" }, hn = { class: "limits-head" }, mn = ["data-agent-limit-type", "data-agent-limit-profile"], fn = { class: "count" }, kn = { class: "bar" }, yn = { class: "count" }, bn = { class: "bar" }, wn = ["data-agent-limit-type"], Mn = { class: "limit-field" }, $n = { class: "limit-field" }, xn = {
  key: 1,
  role: "alert"
}, Cn = {
  key: 2,
  role: "status"
}, Sn = {
  __name: "AgentLimits",
  setup(t) {
    const o = fe(), i = C([]), l = C({}), v = C(!1), y = C(!1), x = C(!1), k = C(""), w = C(""), O = (e) => e === 0 ? "no limit" : String(e), $ = (e, a) => a === 0 ? 0 : e > a ? 2 : e === a ? 1 : 0, z = b(() => i.value.flatMap((e) => e.per_profile && e.profiles.length ? e.profiles.map((a) => ({ ...a, label: a.title, type: e.key, key: `${e.key}:${a.profile}` })) : [e])), H = (e) => Math.max($(e.running, e.run_limit), $(e.kept, e.kept_limit)), I = b(() => z.value.filter((e) => H(e)).sort((e, a) => H(a) - H(e))), F = b(() => i.value.reduce((e, a) => e + a.running, 0)), E = b(() => i.value.reduce((e, a) => e + a.kept, 0)), R = (e) => {
      const a = [e.run_limit ? e.running - e.run_limit : -1, e.kept_limit ? e.kept - e.kept_limit : -1], s = Math.max(...a);
      return s > 0 ? `Over by ${s}` : s === 0 ? "At limit" : "Within limits";
    }, L = (e, a) => a ? `${Math.min(e / Math.max(e, a) * 100, 100)}%` : "0%", W = (e, a) => a && e > a ? `${(e - a) / e * 100}%` : "0%";
    let D = 0;
    async function q() {
      const e = ++D, a = await o.read("agent limits");
      e === D && (i.value = a.ok ? a.value.rows : [], k.value = a.ok ? "" : a.error);
    }
    async function J(e) {
      const a = await Promise.all(i.value.flatMap((s) => [s.run_setting, s.kept_setting]).map(async (s) => {
        const j = await o.read(`setting show ${s}`);
        return [s, j.ok ? j.value.source : ""];
      }));
      e === D && (l.value = Object.fromEntries(a));
    }
    async function U() {
      y.value = !y.value, y.value && await J(D);
    }
    async function h(e, a, s, j) {
      if (x.value || o.readOnly) return;
      const u = Number(j.target.value);
      if (!Number.isInteger(u) || u < 0 || !j.target.value.trim()) {
        k.value = "Use a whole number of 0 or more.", j.target.value = String(s);
        return;
      }
      x.value = !0, w.value = "";
      try {
        const A = await o.run(["setting", "set", a, String(u), "--environment", o.environment]);
        if (k.value = A.ok ? "" : A.error, !A.ok) {
          j.target.value = String(s);
          return;
        }
        await q(), w.value = `${e.label} limits saved.`;
      } finally {
        x.value = !1;
      }
    }
    return o.follow(["agent.*", "setting.*"], q), q(), (e, a) => (n(), r("section", dn, [
      i.value.length ? (n(), r(B, { key: 0 }, [
        d("button", {
          class: "summary",
          type: "button",
          "aria-expanded": v.value,
          onClick: a[0] || (a[0] = (s) => v.value = !v.value)
        }, [
          I.value.length ? (n(), r(B, { key: 0 }, [
            (n(!0), r(B, null, K(I.value.slice(0, 2), (s) => (n(), r("span", {
              key: s.key,
              class: "summary-item"
            }, [
              d("span", {
                class: X(["mark", { over: H(s) === 2 }])
              }, null, 2),
              p(g(s.label) + ": " + g(R(s)), 1)
            ]))), 128)),
            I.value.length > 2 ? (n(), r("span", gn, g(I.value.length - 2) + " more", 1)) : m("", !0)
          ], 64)) : (n(), r("span", vn, "All within limits, " + g(F.value) + " running, " + g(E.value) + " kept", 1)),
          f(c(ve), {
            name: "caret",
            size: 12
          })
        ], 8, cn),
        Xe(d("div", pn, [
          d("div", hn, [
            a[1] || (a[1] = d("strong", null, "Agent limits", -1)),
            f(c(te), {
              small: "",
              disabled: x.value || c(o).readOnly,
              "data-agent-limits-edit": "",
              onClick: U
            }, {
              default: S(() => [
                p(g(y.value ? "Done" : "Edit limits"), 1)
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
              d("strong", null, g(s.label), 1),
              d("label", Mn, [
                d("span", null, [
                  a[3] || (a[3] = p("Running", -1)),
                  s.per_profile ? (n(), r(B, { key: 0 }, [
                    p(" per profile")
                  ], 64)) : m("", !0)
                ]),
                f(c(Ae), {
                  type: "number",
                  min: "0",
                  value: String(s.run_limit),
                  disabled: x.value || c(o).readOnly,
                  "data-agent-run-limit": s.key,
                  onChange: (j) => h(s, s.run_setting, s.run_limit, j)
                }, null, 8, ["value", "disabled", "data-agent-run-limit", "onChange"]),
                d("small", null, g(l.value[s.run_setting]), 1)
              ]),
              d("label", $n, [
                d("span", null, [
                  a[4] || (a[4] = p("Kept", -1)),
                  s.per_profile ? (n(), r(B, { key: 0 }, [
                    p(" per profile")
                  ], 64)) : m("", !0)
                ]),
                f(c(Ae), {
                  type: "number",
                  min: "0",
                  value: String(s.kept_limit),
                  disabled: x.value || c(o).readOnly,
                  "data-agent-kept-limit": s.key,
                  onChange: (j) => h(s, s.kept_setting, s.kept_limit, j)
                }, null, 8, ["value", "disabled", "data-agent-kept-limit", "onChange"]),
                d("small", null, g(l.value[s.kept_setting]), 1)
              ])
            ], 8, wn))), 128)),
            d("p", null, "Running 0 starts no agents. Kept 0 means no limit. Changes apply to " + g(c(o).environment) + ".", 1)
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
              d("strong", null, g(s.label), 1),
              d("div", fn, [
                d("span", null, g(s.run_limit ? `${s.running} of ${s.run_limit}` : `${s.running} · none may start`), 1),
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
                d("span", null, g(s.kept) + " of " + g(O(s.kept_limit)), 1),
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
              }, g(R(s)), 3)
            ], 8, mn))), 128))
          ], 64))
        ], 512), [
          [et, v.value]
        ])
      ], 64)) : m("", !0),
      k.value ? (n(), r("p", xn, g(k.value), 1)) : m("", !0),
      w.value ? (n(), r("p", Cn, g(w.value), 1)) : m("", !0)
    ]));
  }
}, An = /* @__PURE__ */ Z(Sn, [["__scopeId", "data-v-00e6a563"]]), jn = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Tn = ["data-agent-row"], Be = "journal.agents.filters", Me = "cubic-bezier(0.2, 0.9, 0.25, 1)", Rn = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(t) {
    const o = t, { rows: i } = dt("usage agents --closed", ["agent.*", "task.*", "hook_call.*", "helper_job.*"]), { rows: l } = Ve("waits"), { rows: v } = Ve("progress"), y = (T) => v.value.find((V) => V.agent_id === T.id) ?? null, x = (T) => {
      var V;
      return ((V = l.value.find((M) => M.agent_id === T.id)) == null ? void 0 : V.reason) ?? "";
    }, k = C("running"), w = C(""), O = JSON.parse(localStorage.getItem(Be) || '{"roles":[],"profiles":[],"programs":[]}'), $ = C(O), z = C({ roles: [], profiles: [], states: [], upgrade_retired: 0 }), H = C([]), I = b(() => $.value.roles.length + $.value.profiles.length + $.value.programs.length), F = (T, V) => {
      $.value = pt($.value, T, V);
    }, E = () => {
      $.value = { roles: [], profiles: [], programs: [] };
    }, R = (T) => T.slice(0, 1).toUpperCase() + T.slice(1);
    ae($, (T) => localStorage.setItem(Be, JSON.stringify(T)));
    const L = fe();
    async function W() {
      const [T, V] = await Promise.all([L.read("agent cards --options"), L.read("agent programs")]);
      T.ok && (z.value = T.value), V.ok && (H.value = V.value.rows);
    }
    L.follow(["agent.*"], W), W();
    const D = C([]), q = C(""), J = C(!1), U = C(!1), h = C(25);
    let e = 0;
    async function a() {
      const T = ++e, V = [
        ...$.value.roles.map((P) => `--role ${JSON.stringify(P)}`),
        ...$.value.profiles.map((P) => `--profile ${JSON.stringify(P)}`),
        ...$.value.programs.map((P) => `--program ${JSON.stringify(P)}`)
      ].join(" "), M = await L.read(`${o.line} --show ${k.value} --search ${JSON.stringify(w.value)} --limit ${h.value} ${V}`);
      T === e && (D.value = M.ok ? M.value.rows : [], q.value = M.ok ? "" : M.error, U.value = M.ok && M.value.page * M.value.size < M.value.total, J.value = !0);
    }
    async function s() {
      return h.value += 25, await a(), !0;
    }
    ae([k, w, $], () => {
      h.value = 25, a();
    }), L.follow(["agent.*", "task.*", ...L.sources.flatMap((T) => T.events)], Ee(a, Ne.pageOfAgents)), a();
    const j = (T) => i.value.find((V) => V.id === T.id) ?? T.facts ?? null, u = D, A = b(() => !!w.value.trim() || I.value > 0), _ = b(() => o.texts[k.value] ?? { title: o.empty, hint: "" }), Y = C(null), ne = C(null), ge = C(null), le = b(() => u.value.find((T) => T.id === Y.value) ?? null), xe = b(() => le.value ? [le.value] : u.value), ie = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let re = !1, je = 0;
    async function Fe(T) {
      if (re) return;
      re = !0, je = ge.value.scrollTop;
      const V = ne.value.querySelector(`[data-agent-open="${T.id}"]`);
      if (!ie()) {
        const se = [...ne.value.querySelectorAll(".agent-row")].filter((ee) => !ee.contains(V));
        await Promise.all(se.map((ee) => ee.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const M = [...V.querySelectorAll(".agent-head, .agent-line")], P = [...M, ...V.querySelectorAll("[data-agent-motion]")], ke = P.map((se) => se.getBoundingClientRect());
      if (Y.value = T.id, await ze(), !ie()) {
        const se = P.map((ee) => ee.getBoundingClientRect());
        P.forEach((ee, ye) => {
          const ue = M.indexOf(ee.parentElement), Pe = ke[ye].left - se[ye].left - (ue < 0 ? 0 : ke[ue].left - se[ue].left), Je = ke[ye].top - se[ye].top - (ue < 0 ? 0 : ke[ue].top - se[ue].top);
          ee.animate([{ transform: `translate(${Pe}px, ${Je}px)` }, { transform: "none" }], { duration: 280, easing: Me });
        }), ne.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((ee) => {
          ee.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Me, fill: "backwards" });
        });
      }
      re = !1;
    }
    async function Te() {
      if (re || !le.value) return;
      re = !0;
      const T = ne.value.querySelector(`[data-agent-open="${Y.value}"]`), V = [...T.children], M = ie() ? [] : V.map((P) => P.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(M.map((P) => P.finished)), Y.value = null, await ze(), ge.value.scrollTop = je, M.forEach((P) => P.cancel()), ie() || (T.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Me }), ne.value.querySelectorAll(".agent-row").forEach((P) => {
        P.contains(T) || P.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Me });
      })), re = !1;
    }
    const De = (T) => Y.value === T.id ? Te() : Fe(T);
    ae(w, (T) => T.trim() && (Y.value = null)), ae(k, () => {
      Y.value = null;
    });
    const Re = (T) => {
      T.key === "Escape" && Te();
    };
    return window.addEventListener("keydown", Re), $e(() => window.removeEventListener("keydown", Re)), (T, V) => (n(), r("div", {
      ref_key: "agents",
      ref: ne,
      class: X(["agents", { focused: le.value }])
    }, [
      f(An),
      f(c(ct), {
        modelValue: w.value,
        "onUpdate:modelValue": V[1] || (V[1] = (M) => w.value = M),
        placeholder: "Search agents",
        "menu-count": I.value,
        "data-agents-search": ""
      }, {
        menu: S(() => [
          f(c(Ce), null, {
            default: S(() => [...V[2] || (V[2] = [
              p("Type", -1)
            ])]),
            _: 1
          }),
          (n(!0), r(B, null, K(z.value.roles, (M) => (n(), N(c(we), {
            key: M,
            role: "menuitemcheckbox",
            "aria-checked": $.value.roles.includes(M),
            checked: $.value.roles.includes(M),
            "data-filter-role": M,
            onClick: (P) => F("roles", M)
          }, {
            default: S(() => [
              p(g(R(M)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          z.value.profiles.length ? (n(), N(c(Ce), { key: 0 }, {
            default: S(() => [...V[3] || (V[3] = [
              p("Profile", -1)
            ])]),
            _: 1
          })) : m("", !0),
          (n(!0), r(B, null, K(z.value.profiles, (M) => (n(), N(c(we), {
            key: M.name,
            role: "menuitemcheckbox",
            "aria-checked": $.value.profiles.includes(M.name),
            checked: $.value.profiles.includes(M.name),
            "data-filter-profile": M.name,
            onClick: (P) => F("profiles", M.name)
          }, {
            default: S(() => [
              p(g(M.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          f(c(Ce), null, {
            default: S(() => [...V[4] || (V[4] = [
              p("Program", -1)
            ])]),
            _: 1
          }),
          (n(!0), r(B, null, K(H.value, (M) => (n(), N(c(we), {
            key: M.name,
            role: "menuitemcheckbox",
            "aria-checked": $.value.programs.includes(M.name),
            checked: $.value.programs.includes(M.name),
            "data-filter-program": M.name,
            onClick: (P) => F("programs", M.name)
          }, {
            default: S(() => [
              p(g(M.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          I.value ? (n(), N(c(we), {
            key: 1,
            "data-filter-clear": "",
            onClick: E
          }, {
            default: S(() => [...V[5] || (V[5] = [
              p("Clear filters", -1)
            ])]),
            _: 1
          })) : m("", !0)
        ]),
        default: S(() => [
          f(c(gt), {
            options: z.value.states,
            value: k.value,
            onPick: V[0] || (V[0] = (M) => k.value = M)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      k.value === "retired" && z.value.upgrade_retired ? (n(), r("p", jn, "Retired during the upgrade: " + g(z.value.upgrade_retired), 1)) : m("", !0),
      d("div", {
        ref_key: "list",
        ref: ge,
        class: X(["agents-view", { "agents-view-open": le.value }])
      }, [
        J.value && !q.value && !xe.value.length && I.value ? (n(), N(c(Se), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: S(() => [
            f(c(te), {
              small: "",
              "data-empty-clear": "",
              onClick: E
            }, {
              default: S(() => [...V[6] || (V[6] = [
                p("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (n(), N(c(vt), {
          key: 1,
          rows: xe.value,
          failure: q.value,
          loaded: J.value,
          more: !le.value && U.value,
          older: s,
          empty: _.value.title,
          hint: _.value.hint,
          searching: A.value
        }, {
          default: S(({ row: M }) => [
            d("div", {
              class: "agent-row",
              "data-agent-row": M.id
            }, [
              f(un, {
                row: M,
                facts: j(M),
                progress: y(M),
                "wait-reason": x(M),
                open: M.id === Y.value,
                onToggle: (P) => De(M)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, Tn)
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
