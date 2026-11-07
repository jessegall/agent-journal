/* @code-commandments-generated */
import { openBlock as t, createElementBlock as s, withModifiers as Q, unref as u, createTextVNode as f, toDisplayString as v, createVNode as k, createBlock as F, withCtx as S, Fragment as L, renderList as Z, createElementVNode as p, createCommentVNode as y, computed as b, ref as O, watch as le, onUnmounted as pe, defineAsyncComponent as qe, createSlots as _e, resolveDynamicComponent as Fe, normalizeStyle as se, normalizeClass as X, renderSlot as ve, onMounted as De, Teleport as Pe, mergeProps as Ue, toRef as $e, withKeys as Re, withDirectives as Ke, vShow as Je, nextTick as ze } from "vue";
import { peekRef as he, Icon as ce, RunningCommand as Ze, FoldGroup as Le, TaskStatusIcon as Ge, useWindow as me, loadWindowComponent as Ye, coalesced as Qe, READ_RATES as Xe, InnerTabs as et, TabBody as tt, SwitchCase as Be, EmptyState as Se, Btn as te, TextArea as at, TextInput as Ae, useNow as nt, age as lt, perHour as st, TimeAgo as ue, SearchBar as ot, Segmented as it, MenuLabel as Ce, MenuItem as be, RowList as rt, toggleFilter as dt } from "@journal/window-kit";
import { _ as G, T as ut } from "./TranscriptRows-BrVHU9YK.js";
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
    return (i, l) => (t(), s("span", ct, [
      e.waitReason ? (t(), s("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: l[0] || (l[0] = Q((a) => u(he)("test_queue:0"), ["stop"]))
      }, [
        f("Waiting: " + v(e.waitReason) + " ", 1),
        k(u(ce), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (t(), s("span", gt, "Waiting")) : (t(), F(u(Ze), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, vt = /* @__PURE__ */ G(pt, [["__scopeId", "data-v-1b371fb5"]]), ht = ["data-agent-delegated", "onClick"], mt = { class: "agent-task-number" }, ft = { class: "agent-task-title" }, kt = ["title"], yt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: i }) {
    const l = i;
    return (a, m) => (t(), F(u(Le), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: m[0] || (m[0] = (w) => l("toggle"))
    }, {
      default: S(() => [
        (t(!0), s(L, null, Z(e.section.tasks, (w) => (t(), s("button", {
          key: w.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": w.id,
          onClick: (C) => u(he)(`tasks:${w.id}`)
        }, [
          k(u(Ge), {
            status: w.state
          }, null, 8, ["status"]),
          p("span", mt, v(w.id), 1),
          p("span", ft, v(w.title), 1),
          w.plan_id ? (t(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${w.plan_id}: ${w.plan_title}`
          }, "Plan " + v(w.plan_id) + ": " + v(w.plan_title), 9, kt)) : y("", !0)
        ], 8, ht))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, bt = /* @__PURE__ */ G(yt, [["__scopeId", "data-v-238ff959"]]), wt = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Mt = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, xt = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, $t = ["data-peek", "onClick"], Ct = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, St = {
  key: 0,
  class: "agent-helper-brief"
}, At = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, jt = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Tt = "It ended without a report", Rt = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const i = e, l = ["started", "blocked", "open", "completed"], a = b(() => {
      var c, r;
      return i.row.ended_at && ((r = (c = i.facts) == null ? void 0 : c.job_returned) != null && r.startsWith(Tt)) ? i.facts.job_returned : "";
    }), m = b(() => i.tasks.length ? l.map((c) => ({ state: c, label: c.slice(0, 1).toUpperCase() + c.slice(1), tasks: i.tasks.filter((r) => r.state === c || c === "started" && r.state === "testing" || c === "completed" && r.state === "cancelled") })) : []), w = /* @__PURE__ */ new Set(["completed"]), C = O({}), $ = (c) => !(C.value[c] ?? w.has(c)), A = (c) => C.value = { ...C.value, [c]: $(c) }, R = me(), { rows: H } = R.props.reports;
    R.state["reports.agent"] = String(i.row.id);
    const I = b(() => i.row.access === "read-only"), z = b(() => !!i.row.retired_at || i.row.state === "retired"), _ = ["tasks", "transcript", "terminal", "file-feed", "reports"], j = b(() => (z.value ? R.tabs.filter((r) => ["reports", "transcript"].includes(r.key)) : I.value ? R.tabs.filter((r) => ["reports", "transcript", "terminal"].includes(r.key)) : [...R.tabs]).sort((r, h) => (_.indexOf(r.key) < 0 ? _.length : _.indexOf(r.key)) - (_.indexOf(h.key) < 0 ? _.length : _.indexOf(h.key)))), B = () => I.value || z.value ? j.value.find((c) => c.key === "transcript") : j.value[0], E = O(B());
    le(E, (c) => {
      R.state.tab = (c == null ? void 0 : c.key) ?? "";
    }, { immediate: !0 }), pe(() => {
      R.state.tab = "";
    }), le(j, (c) => {
      c.some((r) => {
        var h;
        return r.key === ((h = E.value) == null ? void 0 : h.key);
      }) || (E.value = c[0]);
    }), le(() => i.open, (c) => {
      c && (E.value = B());
    });
    const W = Object.fromEntries(R.tabs.filter((c) => c.component).map((c) => [c.key, qe(() => Ye(c.component))])), N = O(!1), { data: P } = R.props.tool, U = b(() => {
      var c;
      return ((c = P.value) == null ? void 0 : c.tool) ?? "";
    }), d = b(() => {
      var c;
      return ((c = P.value) == null ? void 0 : c.note) ?? "";
    }), n = b(() => i.row.role !== "main" && (!i.row.ended_at || i.stoppedWithWork || i.waitReason));
    async function o() {
      !i.open || !n.value || (R.state["tool.agent"] = String(i.row.id), await R.reload("tool"));
    }
    const x = R.follow(["hook_call.*", "process_part.*"], Qe(o, Xe.agentCommand));
    return pe(() => x == null ? void 0 : x()), le(() => i.open, (c) => {
      c && o();
    }, { immediate: !0 }), (c, r) => {
      var h;
      return t(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: r[2] || (r[2] = Q(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (t(), s("p", wt, "Retirement reason: " + v(e.row.retirement_reason), 1)) : y("", !0),
        e.row.resume_reason ? (t(), s("p", Mt, v(e.row.resume_reason), 1)) : y("", !0),
        n.value ? (t(), F(vt, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: U.value,
          note: d.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : y("", !0),
        a.value ? (t(), s("p", xt, v(a.value), 1)) : y("", !0),
        k(u(et), {
          class: "agent-tabs",
          tabs: j.value,
          active: E.value,
          answer: { tasks: e.tasks.length, reports: u(H).length },
          onChoose: r[0] || (r[0] = (g) => E.value = g)
        }, null, 8, ["tabs", "active", "answer"]),
        k(u(tt), {
          class: "agent-tab-body",
          tab: E.value,
          "data-agent-tab-body": (h = E.value) == null ? void 0 : h.key
        }, {
          default: S(() => {
            var g;
            return [
              k(u(Be), {
                value: (g = E.value) == null ? void 0 : g.key
              }, _e({
                reports: S(() => [
                  u(H).length ? y("", !0) : (t(), F(u(Se), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: S(() => [...r[3] || (r[3] = [
                      f("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (t(!0), s(L, null, Z(u(H), (M) => (t(), s("button", {
                    key: M.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${M.id}`,
                    onClick: (V) => u(he)(`messages:${M.id}`)
                  }, v(M.text), 9, $t))), 128))
                ]),
                tasks: S(() => {
                  var M;
                  return [
                    e.tasks.length ? y("", !0) : (t(), F(u(Se), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: S(() => [...r[4] || (r[4] = [
                        f("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (t(!0), s(L, null, Z(m.value, (V) => (t(), F(bt, {
                      key: V.state,
                      section: V,
                      open: $(V.state),
                      onToggle: (K) => A(V.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (M = e.facts) != null && M.instruction ? (t(), s(L, { key: 1 }, [
                      r[5] || (r[5] = p("p", { class: "agent-label" }, "Instruction", -1)),
                      p("div", Ct, v(e.facts.instruction), 1)
                    ], 64)) : y("", !0)
                  ];
                }),
                transcript: S(() => {
                  var M;
                  return [
                    I.value ? (t(), s(L, { key: 0 }, [
                      (M = e.facts) != null && M.instruction ? (t(), s("div", St, [
                        k(u(Le), {
                          label: "Instruction",
                          open: N.value,
                          "data-agent-section": "instruction",
                          onToggle: r[1] || (r[1] = (V) => N.value = !N.value)
                        }, {
                          default: S(() => [
                            p("div", At, v(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (t(), s("p", jt, "No job recorded")) : y("", !0)
                    ], 64)) : y("", !0),
                    k(ut, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                Z(u(W), (M, V) => ({
                  name: V,
                  fn: S(() => [
                    (t(), F(Fe(M), {
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
}, zt = /* @__PURE__ */ G(Rt, [["__scopeId", "data-v-71b8d2b0"]]), Vt = { class: "action-field" }, Ot = ["value", "disabled"], Lt = ["value"], Bt = { key: 1 }, Ht = {
  key: 1,
  class: "action-field"
}, It = { class: "action-buttons" }, Et = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (i, l) => (t(), s("form", {
      onSubmit: l[4] || (l[4] = Q((a) => i.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (t(), s(L, { key: 0 }, [
        p("label", Vt, [
          l[6] || (l[6] = f("Task ", -1)),
          p("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: l[0] || (l[0] = (a) => i.$emit("update:task", a.target.value))
          }, [
            l[5] || (l[5] = p("option", { value: "" }, "Choose an open task", -1)),
            (t(!0), s(L, null, Z(e.tasks, (a) => (t(), s("option", {
              key: a.id,
              value: String(a.id)
            }, v(a.id) + ": " + v(a.title), 9, Lt))), 128))
          ], 40, Ot)
        ]),
        e.moreTasks ? (t(), F(u(te), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: l[1] || (l[1] = (a) => i.$emit("more"))
        }, {
          default: S(() => [...l[7] || (l[7] = [
            f("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : y("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (t(), s("p", Bt, "No open tasks.")) : y("", !0)
      ], 64)) : (t(), s("label", Ht, [
        l[8] || (l[8] = f("Job", -1)),
        k(u(at), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: l[2] || (l[2] = (a) => i.$emit("update:text", a.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      p("div", It, [
        k(u(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: S(() => [...l[9] || (l[9] = [
            f("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        k(u(te), {
          small: "",
          disabled: e.pending,
          onClick: l[3] || (l[3] = (a) => i.$emit("cancel"))
        }, {
          default: S(() => [...l[10] || (l[10] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Nt = /* @__PURE__ */ G(Et, [["__scopeId", "data-v-adde4158"]]), Wt = { class: "action-buttons" }, qt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (i, l) => (t(), s("form", {
      "data-agent-retire-confirm": "",
      onSubmit: l[2] || (l[2] = Q((a) => i.$emit("submit"), ["prevent"]))
    }, [
      l[5] || (l[5] = p("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      k(u(Ae), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": l[0] || (l[0] = (a) => i.$emit("update:reason", a))
      }, null, 8, ["model-value", "disabled"]),
      p("div", Wt, [
        k(u(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: S(() => [...l[3] || (l[3] = [
            f("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        k(u(te), {
          small: "",
          disabled: e.pending,
          onClick: l[1] || (l[1] = (a) => i.$emit("cancel"))
        }, {
          default: S(() => [...l[4] || (l[4] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, _t = /* @__PURE__ */ G(qt, [["__scopeId", "data-v-23a905c0"]]), Ft = { class: "action-buttons" }, Dt = {
  key: 0,
  role: "alert"
}, Pt = {
  key: 1,
  role: "status"
}, Ut = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const i = e, l = me(), a = O(""), m = O(""), w = O(""), C = O(""), $ = O([]), A = O(0), R = O(!1), H = O(!1), I = O(!1), z = O(""), _ = O(""), j = b(() => !!i.row.retired_at || i.row.state === "retired"), B = b(() => !j.value && !!i.row.ended_at), E = b(() => {
      var x;
      return B.value && ((x = i.row.job_command) == null ? void 0 : x.length) && !i.row.resume_reason;
    }), W = b(() => E.value && !H.value && (i.row.job_task_flag ? $.value.some((x) => String(x.id) === C.value) : !!m.value.trim()));
    function N(x) {
      a.value = x, m.value = "", w.value = "", C.value = "", z.value = "", _.value = "";
    }
    async function P() {
      N("job"), i.row.job_task_flag && ($.value = [], A.value = 0, R.value = !1, await U());
    }
    async function U() {
      if (!H.value) {
        H.value = !0;
        try {
          l.state["jobs.page"] = String(A.value + 1), await l.reload("jobs");
          const x = l.props.jobs;
          z.value = x.failure.value, z.value || ($.value = [...$.value, ...x.rows.value], A.value = x.data.value.page, R.value = x.more.value);
        } finally {
          H.value = !1;
        }
      }
    }
    async function d(x, c) {
      if (!I.value) {
        I.value = !0, z.value = "";
        try {
          const r = await l.run(x);
          z.value = r.ok ? "" : r.error, r.ok && (N(""), _.value = c);
        } finally {
          I.value = !1;
        }
      }
    }
    async function n() {
      if (!W.value) return;
      const x = i.row.job_task_flag ? [i.row.job_task_flag, C.value] : [m.value.trim()];
      await d([...i.row.job_command, String(i.row.id), ...x], "Job sent.");
    }
    async function o() {
      !B.value || a.value !== "retire" || !w.value.trim() || await d(["agent", "retire", String(i.row.id), "--reason", w.value.trim()], "Agent retired permanently.");
    }
    return (x, c) => {
      var r;
      return j.value ? y("", !0) : (t(), s("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: c[6] || (c[6] = Q(() => {
        }, ["stop"])),
        onKeydown: c[7] || (c[7] = Q(() => {
        }, ["stop"]))
      }, [
        p("div", Ft, [
          B.value ? (t(), s(L, { key: 0 }, [
            (r = e.row.job_command) != null && r.length ? (t(), F(u(te), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: I.value || H.value || !E.value,
              onClick: P
            }, {
              default: S(() => [...c[8] || (c[8] = [
                f("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : y("", !0),
            e.row.role !== "main" ? (t(), F(u(te), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: I.value || H.value,
              onClick: c[0] || (c[0] = (h) => N("retire"))
            }, {
              default: S(() => [...c[9] || (c[9] = [
                f("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : y("", !0)
          ], 64)) : y("", !0)
        ]),
        k(u(Be), { value: a.value }, {
          job: S(() => [
            k(Nt, {
              task: C.value,
              "onUpdate:task": c[1] || (c[1] = (h) => C.value = h),
              text: m.value,
              "onUpdate:text": c[2] || (c[2] = (h) => m.value = h),
              row: e.row,
              tasks: $.value,
              pending: I.value,
              loading: H.value,
              "more-tasks": R.value,
              failure: z.value,
              "job-ready": W.value,
              onSubmit: n,
              onMore: U,
              onCancel: c[3] || (c[3] = (h) => N(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: S(() => [
            k(_t, {
              reason: w.value,
              "onUpdate:reason": c[4] || (c[4] = (h) => w.value = h),
              pending: I.value,
              onSubmit: o,
              onCancel: c[5] || (c[5] = (h) => N(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        z.value ? (t(), s("p", Dt, v(z.value), 1)) : y("", !0),
        _.value ? (t(), s("p", Pt, v(_.value), 1)) : y("", !0)
      ], 32));
    };
  }
}, Kt = /* @__PURE__ */ G(Ut, [["__scopeId", "data-v-58640530"]]), Jt = {
  class: "agent-count",
  "data-agent-motion": ""
}, Zt = {
  key: 0,
  class: "agent-pace",
  "data-agent-pace": ""
}, Gt = {
  class: "agent-tasks",
  "data-agent-tasks": ""
}, Yt = {
  __name: "AgentTaskCount",
  props: { count: { type: String, required: !0 }, rate: { type: String, required: !0 } },
  setup(e) {
    return (i, l) => (t(), s("span", Jt, [
      e.rate ? (t(), s("span", Zt, v(e.rate), 1)) : y("", !0),
      p("span", Gt, v(e.count), 1)
    ]));
  }
}, Ve = /* @__PURE__ */ G(Yt, [["__scopeId", "data-v-44694015"]]), Qt = ["data-icon", "stroke-width", "innerHTML"], Y = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const i = e, l = { right: 0, down: 90, left: 180, up: 270 }, a = {
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
    }, m = {
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
    return (w, C) => (t(), s("svg", {
      class: "ico",
      "data-icon": e.name,
      style: se({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...i.facing === "right" ? {} : { transform: `rotate(${l[i.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: m[a[e.name] || e.name] || m.dot
    }, null, 12, Qt));
  }
}, Xt = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, ea = {
  key: 1,
  class: "menu-item-text"
}, ta = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (i, l) => (t(), s("button", {
      type: "button",
      class: X(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (t(), s("span", Xt, v(e.checked ? "✓" : ""), 1)) : y("", !0),
      e.description ? (t(), s("span", ea, [
        p("span", null, [
          ve(i.$slots, "default", {}, void 0, !0)
        ]),
        p("small", null, v(e.description), 1)
      ])) : ve(i.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, de = /* @__PURE__ */ G(ta, [["__scopeId", "data-v-fec99974"]]), aa = {}, na = { class: "menu-label" };
function la(e, i) {
  return t(), s("span", na, [
    ve(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ge = /* @__PURE__ */ G(aa, [["render", la], ["__scopeId", "data-v-aa955b3e"]]), sa = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, oa = {
  key: 0,
  class: "skills-none"
}, ia = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: i }) {
    const l = e, a = i, m = b(() => l.skills.filter((C) => C.state === "loaded")), w = b(() => l.skills.filter((C) => C.state !== "loaded"));
    return (C, $) => (t(), s("div", sa, [
      k(ge, null, {
        default: S(() => [...$[1] || ($[1] = [
          f("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      m.value.length ? y("", !0) : (t(), s("p", oa, "None yet. Compacting the conversation empties this list.")),
      (t(!0), s(L, null, Z(m.value, (A) => (t(), s("p", {
        key: A.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        k(Y, {
          name: "book",
          size: 12
        }),
        f(v(A.skill), 1)
      ]))), 128)),
      w.value.length ? (t(), s(L, { key: 1 }, [
        k(ge, null, {
          default: S(() => [...$[2] || ($[2] = [
            f("Still to read", -1)
          ])]),
          _: 1
        }),
        (t(!0), s(L, null, Z(w.value, (A) => (t(), s("p", {
          key: A.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          k(Y, {
            name: "book",
            size: 12
          }),
          f(v(A.skill), 1)
        ]))), 128))
      ], 64)) : y("", !0),
      k(de, {
        "data-agent-skills-browse": "",
        onClick: $[0] || ($[0] = (A) => a("browse"))
      }, {
        default: S(() => [...$[3] || ($[3] = [
          f("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, ra = /* @__PURE__ */ G(ia, [["__scopeId", "data-v-be514d47"]]), da = (e, i, l) => Math.max(i, Math.min(l, e)), He = /* @__PURE__ */ new WeakMap(), ua = (e, i) => He.set(e, i);
function ca(e, i) {
  for (let l = i; l; l = He.get(l) ?? l.parentElement) if (l === e) return !0;
  return !1;
}
function ga(e, i) {
  const l = (a) => {
    var w, C;
    const m = ((w = e.value) == null ? void 0 : w.element) || ((C = e.value) == null ? void 0 : C.$el) || e.value;
    m && !ca(m, a.target) && i(a);
  };
  window.addEventListener("click", l), pe(() => window.removeEventListener("click", l));
}
const re = 8, pa = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: i, emit: l }) {
    const a = e, m = O(null), w = (g) => g ? `${g}px` : void 0, C = b(() => ({
      minWidth: w(a.minWidth),
      maxWidth: w(a.maxWidth),
      maxHeight: w(a.maxHeight),
      height: w(a.height)
    })), $ = O({ w: 0, h: 0 }), A = O(a.anchor ? a.anchor.getBoundingClientRect() : null), R = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), H = (g) => ({
      left: Math.max(0, g.left),
      top: Math.max(0, g.top),
      right: Math.min(window.innerWidth, g.right),
      bottom: Math.min(window.innerHeight, g.bottom)
    }), I = (g) => {
      const M = g.closest(".pane, .float-window");
      return M ? H(M.getBoundingClientRect()) : R();
    }, z = (g, M) => `${Math.max(0, g ? Math.min(g, M) : M)}px`;
    function _(g, M) {
      return {
        below: g.bottom - M.bottom - a.gap - re,
        above: M.top - g.top - a.gap - re,
        across: g.right - g.left - 2 * re
      };
    }
    function j(g) {
      const M = I(a.anchor), V = _(M, g);
      return $.value.w <= V.across && $.value.h <= Math.max(V.below, V.above) ? M : R();
    }
    const B = b(() => {
      if (!A.value) return C.value;
      const g = A.value, M = j(g), V = _(M, g), { w: K, h: fe } = $.value, oe = a.align === "auto" ? g.left + g.right > M.left + M.right : a.align === "right", ae = da(oe ? g.right - K : g.left, M.left + re, Math.max(M.left + re, M.right - K - re)), xe = fe > V.below && V.above > V.below ? { bottom: `${window.innerHeight - g.top + a.gap}px`, maxHeight: z(a.maxHeight, V.above) } : { top: `${g.bottom + a.gap}px`, maxHeight: z(a.maxHeight, V.below) };
      return { ...C.value, ...xe, left: `${ae}px`, maxWidth: z(a.maxWidth, V.across) };
    }), E = l, W = () => [...m.value.querySelectorAll("button:not(:disabled)")];
    function N(g) {
      const M = W(), V = M.indexOf(document.activeElement);
      M[(V + g + M.length) % M.length].focus();
    }
    const P = { ArrowDown: () => N(1), ArrowUp: () => N(-1), Escape: () => E("close") }, U = (g) => P[g.key] && (g.preventDefault(), P[g.key]()), d = () => m.value && ($.value = { w: m.value.offsetWidth, h: m.value.scrollHeight });
    let n = 0;
    const o = new ResizeObserver(() => {
      cancelAnimationFrame(n), n = requestAnimationFrame(d);
    });
    ga(m, (g) => a.anchor && !a.anchor.contains(g.target) && E("close"));
    const x = (g, M) => ["top", "left", "right", "bottom"].some((V) => Math.abs(g[V] - M[V]) > 1), c = (g) => g.bottom < 0 || g.top > window.innerHeight;
    let r = 0;
    function h() {
      if (a.anchor) {
        const g = a.anchor.getBoundingClientRect();
        if (!a.anchor.isConnected || c(g)) return E("close");
        x(g, A.value) && (A.value = g);
      }
      r = requestAnimationFrame(h);
    }
    return De(() => {
      a.anchor && m.value && ua(m.value, a.anchor), d(), m.value && o.observe(m.value), !a.plain && W()[0] && W()[0].focus(), h();
    }), pe(() => {
      o.disconnect(), cancelAnimationFrame(r), cancelAnimationFrame(n);
    }), i({ element: m }), (g, M) => (t(), F(Pe, {
      to: "body",
      disabled: !e.anchor
    }, [
      p("div", Ue({
        ref_key: "panel",
        ref: m
      }, g.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: B.value,
        onKeydown: U
      }), [
        ve(g.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), va = /* @__PURE__ */ G(pa, [["__scopeId", "data-v-3d203970"]]);
async function ha(e, i, l) {
  if (!e) return l(i);
  const { target: a, fields: m } = e, w = Object.fromEntries(Object.keys(m).map((A) => [A, a[A]])), C = () => Object.assign(a, w);
  Object.assign(a, m);
  let $ = !1;
  try {
    const A = await l(i);
    return $ = A.ok, A;
  } finally {
    $ || C();
  }
}
function ma(e, i, l, { groups: a, programs: m }) {
  const w = O({}), C = O(""), $ = O(!1), A = b(() => !!e.value && !e.value.ended_at), R = b(() => A.value && !!e.value.paused_at);
  async function H(j, B = null) {
    C.value = "";
    const E = await ha(B, j, i);
    return C.value = E.ok ? "" : E.error, l(), E;
  }
  return { groups: a, programs: m, chosen: w, failure: C, asking: $, running: A, paused: R, choose: (j, B) => H(["agent", "control", String(e.value.id), j, B.value], { target: w, fields: { value: { ...w.value, [j]: B.label } } }), stop: () => ($.value = !1, H(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (j) => H(["agent", "launch", j.name]) };
}
const Ie = { claude: "Claude Code", codex: "Codex" };
Object.entries(Ie).map(([e, i]) => ({ key: e, label: i }));
function fa(e, i = "agent") {
  return Ie[e] || i;
}
function ka(e) {
  if (!e) return "Not compacted yet";
  const i = new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return e.start_percent === null ? `Last compacted ${i}` : e.end_percent === null ? `Last compacted ${i}, from ${e.start_percent}%` : `Last compacted ${i}, from ${e.start_percent}% to ${e.end_percent}%, ${e.start_percent - e.end_percent}% taken off`;
}
const ya = ["disabled", "title"], ba = ["title"], wa = { class: "gauge usage" }, Ma = ["disabled", "title"], xa = { class: "gauge" }, $a = ["disabled", "title"], Ca = ["disabled"], Sa = ["disabled"], Aa = {
  key: 5,
  class: "fact",
  "data-fact": "uptime",
  title: "How long this session has run"
}, ja = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Ta = ["title"], Ra = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, za = { class: "gauge" }, Va = { class: "context-used" }, Oa = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, La = 75, Ba = {
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
  setup(e, { emit: i }) {
    const l = e, a = i, m = ma($e(l, "agent"), l.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => a("changed"), { groups: $e(l, "controlGroups"), programs: $e(l, "agentPrograms") }), w = O(null), C = O(""), $ = b(() => m.groups.value.find((d) => d.key === C.value));
    function A(d, n) {
      w.value = d.currentTarget, C.value = n;
    }
    function R() {
      w.value = null, C.value = "", m.asking.value = !1;
    }
    const H = b(() => l.skills.filter((d) => d.state === "loaded"));
    function I(d) {
      A(d, "skills"), a("skills");
    }
    const z = (d) => m.groups.value.some((n) => n.key === d), _ = b(() => {
      var d;
      return m.chosen.value.model ?? ((d = B.value) == null ? void 0 : d.model) ?? "";
    }), j = b(() => {
      var d;
      return m.chosen.value.effort ?? ((d = B.value) == null ? void 0 : d.effort) ?? "";
    });
    b(() => !!l.agent && !l.agent.ended_at);
    const B = b(() => {
      var d;
      return ((d = l.usage.agents) == null ? void 0 : d.find((n) => {
        var o;
        return n.id === ((o = l.agent) == null ? void 0 : o.id);
      })) ?? null;
    }), E = b(() => {
      var d;
      return ((d = l.usage.windows) == null ? void 0 : d[0]) ?? null;
    }), W = b(() => E.value ? Math.max(0, Math.min(100, Math.round(E.value.used_percent))) : null), N = b(() => {
      var d;
      return ((d = B.value) == null ? void 0 : d.context_percent) == null ? null : Math.round(B.value.context_percent);
    }), P = b(() => {
      var d;
      return (d = B.value) != null && d.cost_dollars ? `$${B.value.cost_dollars.toFixed(2)}` : "";
    }), U = b(() => {
      var o;
      const d = (o = l.agent) != null && o.process_started_at ? new Date(l.agent.process_started_at).getTime() : 0;
      if (!d) return "";
      const n = Math.max(0, Math.floor((l.now - d) / 6e4));
      return n >= 60 ? `${Math.floor(n / 60)}h ${n % 60}m` : `${n}m`;
    });
    return (d, n) => (t(), s("div", {
      class: X(["information", { card: e.card }]),
      "data-information-bar": ""
    }, [
      e.agent ? (t(), s(L, { key: 0 }, [
        p("button", {
          type: "button",
          class: "fact lead",
          disabled: e.card,
          "data-fact": "agent",
          title: `Session ${e.agent.session}: stop it`,
          onClick: n[0] || (n[0] = (o) => A(o, "agent"))
        }, [
          k(Y, {
            name: "agents",
            size: 12
          }),
          f(" " + v(u(fa)(e.agent.program)), 1)
        ], 8, ya),
        W.value !== null ? (t(), s("button", {
          key: 0,
          type: "button",
          class: "fact",
          "data-fact": "usage",
          title: `${W.value}% of the plan's ${E.value.title} allowance used`,
          onClick: n[1] || (n[1] = (o) => a("open", "usage", o.currentTarget))
        }, [
          k(Y, {
            name: "allowance",
            size: 12
          }),
          n[14] || (n[14] = f()),
          p("span", wa, [
            p("span", {
              style: se({ width: `${W.value}%` })
            }, null, 4)
          ]),
          f(" " + v(W.value) + "% ", 1)
        ], 8, ba)) : y("", !0),
        N.value !== null ? (t(), s("button", {
          key: 1,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "context",
          title: `Context ${N.value}% full: clear or compact it`,
          onClick: n[2] || (n[2] = (o) => z("context") ? A(o, "context") : a("open", "context", o.currentTarget))
        }, [
          k(Y, {
            name: "gauge",
            size: 12
          }),
          n[15] || (n[15] = f()),
          p("span", xa, [
            p("span", {
              style: se({ width: `${N.value}%` })
            }, null, 4)
          ]),
          f(" " + v(N.value) + "% ", 1)
        ], 8, Ma)) : y("", !0),
        _.value ? (t(), s("button", {
          key: 2,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "model",
          title: `${_.value}: change the model`,
          onClick: n[3] || (n[3] = (o) => z("model") ? A(o, "model") : null)
        }, [
          k(Y, {
            name: "model",
            size: 12
          }),
          f(" " + v(_.value), 1)
        ], 8, $a)) : y("", !0),
        z("effort") || e.card && j.value ? (t(), s("button", {
          key: 3,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "effort",
          title: "Reasoning effort: change it",
          onClick: n[4] || (n[4] = (o) => A(o, "effort"))
        }, [
          k(Y, {
            name: "bolt",
            size: 12
          }),
          f(" " + v(j.value), 1)
        ], 8, Ca)) : y("", !0),
        P.value ? (t(), s("button", {
          key: 4,
          type: "button",
          class: "fact",
          disabled: e.card,
          "data-fact": "cost",
          title: "The predicted API price of this session: open its breakdown",
          onClick: n[5] || (n[5] = (o) => a("open", "cost", o.currentTarget))
        }, v(P.value), 9, Sa)) : y("", !0),
        U.value ? (t(), s("span", Aa, [
          k(Y, {
            name: "reminders",
            size: 12
          }),
          f(" " + v(U.value), 1)
        ])) : y("", !0),
        e.branch ? (t(), s("span", ja, [
          k(Y, {
            name: "branch",
            size: 12
          }),
          f(" " + v(e.branch), 1)
        ])) : y("", !0),
        e.card ? y("", !0) : (t(), s("button", {
          key: 7,
          type: "button",
          class: X(["fact", { none: !e.jobs }]),
          "data-fact": "jobs",
          title: "Jobs the agent scheduled for itself",
          onClick: n[6] || (n[6] = (o) => a("open", "jobs", o.currentTarget))
        }, [
          k(Y, {
            name: "clock",
            size: 12
          }),
          f(" " + v(e.jobs), 1)
        ], 2)),
        e.run ? (t(), s("button", {
          key: 8,
          type: "button",
          class: "fact",
          "data-fact": "skills",
          title: "View skills read by this agent",
          onClick: I
        }, [
          k(Y, {
            name: "book",
            size: 12
          }),
          f(" " + v(H.value.length), 1)
        ])) : y("", !0),
        e.fitness ? (t(), s(L, { key: 9 }, [
          p("button", {
            type: "button",
            class: X(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < La }]),
            "data-fact": "fitness",
            title: "View the agent’s performance measures",
            onClick: n[7] || (n[7] = (o) => a("open", "fitness", o.currentTarget))
          }, [
            k(Y, {
              name: "heart",
              size: 12
            }),
            f(" " + v(e.fitness.is_measured ? e.fitness.score : "–"), 1)
          ], 2),
          p("button", {
            type: "button",
            class: X(["fact", "load-fact", e.fitness.workload_level]),
            "data-fact": "load",
            title: "Compare incoming messages with agent replies",
            onClick: n[8] || (n[8] = (o) => a("open", "load", o.currentTarget))
          }, [
            k(Y, {
              name: "weight",
              size: 12
            }),
            f(" " + v(e.fitness.workload), 1)
          ], 2)
        ], 64)) : y("", !0)
      ], 64)) : e.run && !e.loading ? (t(), s("button", {
        key: 1,
        type: "button",
        class: "fact lead",
        "data-agent-start": "",
        onClick: n[9] || (n[9] = (o) => A(o, "start"))
      }, [
        k(Y, {
          name: "agents",
          size: 12
        }),
        n[16] || (n[16] = f(" Start an agent", -1))
      ])) : y("", !0),
      n[22] || (n[22] = p("span", { class: "space" }, null, -1)),
      u(m).failure.value ? (t(), s("span", {
        key: 2,
        class: "fact failure",
        role: "alert",
        "data-agent-failure": "",
        title: u(m).failure.value
      }, v(u(m).failure.value), 9, Ta)) : y("", !0),
      ve(d.$slots, "default", {}, void 0, !0),
      w.value ? (t(), F(va, {
        key: 3,
        anchor: w.value,
        "min-width": 190,
        onClose: R
      }, {
        default: S(() => {
          var o;
          return [
            C.value === "agent" ? (t(), s(L, { key: 0 }, [
              u(m).asking.value ? (t(), s(L, { key: 0 }, [
                k(ge, { "data-agent-stop-ask": "" }, {
                  default: S(() => [...n[17] || (n[17] = [
                    f("Stop the agent? It stops what it is doing.", -1)
                  ])]),
                  _: 1
                }),
                k(de, {
                  "data-agent-stop-confirm": "",
                  onClick: n[10] || (n[10] = (x) => (R(), u(m).stop()))
                }, {
                  default: S(() => [...n[18] || (n[18] = [
                    f("Stop it", -1)
                  ])]),
                  _: 1
                }),
                k(de, {
                  onClick: n[11] || (n[11] = (x) => u(m).asking.value = !1)
                }, {
                  default: S(() => [...n[19] || (n[19] = [
                    f("Keep it running", -1)
                  ])]),
                  _: 1
                })
              ], 64)) : (t(), F(de, {
                key: 1,
                "data-agent-stop": "",
                onClick: n[12] || (n[12] = (x) => u(m).asking.value = !0)
              }, {
                default: S(() => [...n[20] || (n[20] = [
                  f("Stop", -1)
                ])]),
                _: 1
              }))
            ], 64)) : C.value === "start" ? (t(), s(L, { key: 1 }, [
              k(ge, null, {
                default: S(() => [...n[21] || (n[21] = [
                  f("Start an agent", -1)
                ])]),
                _: 1
              }),
              (t(!0), s(L, null, Z(u(m).programs.value, (x) => (t(), F(de, {
                key: x.name,
                "data-agent-program": x.name,
                onClick: (c) => (R(), u(m).start(x))
              }, {
                default: S(() => [
                  f(v(x.title), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-program", "onClick"]))), 128))
            ], 64)) : C.value === "skills" ? (t(), F(ra, {
              key: 2,
              skills: e.skills,
              onBrowse: n[13] || (n[13] = (x) => (R(), a("open", "skills", null)))
            }, null, 8, ["skills"])) : $.value ? (t(), s(L, { key: 3 }, [
              k(ge, null, {
                default: S(() => [
                  f(v($.value.label), 1)
                ]),
                _: 1
              }),
              C.value === "context" ? (t(), s(L, { key: 0 }, [
                p("div", Ra, [
                  p("span", za, [
                    p("span", {
                      style: se({ width: `${N.value}%` })
                    }, null, 4)
                  ]),
                  p("span", Va, v(N.value) + "%", 1)
                ]),
                p("p", Oa, v(u(ka)(((o = B.value) == null ? void 0 : o.last_compaction) ?? null)), 1)
              ], 64)) : y("", !0),
              (t(!0), s(L, null, Z($.value.choices, (x) => (t(), F(de, {
                key: x.value,
                "data-agent-choice": x.value,
                onClick: (c) => (u(m).choose($.value.key, x), R())
              }, {
                default: S(() => [
                  f(v(x.label), 1)
                ]),
                _: 2
              }, 1032, ["data-agent-choice", "onClick"]))), 128))
            ], 64)) : y("", !0)
          ];
        }),
        _: 1
      }, 8, ["anchor"])) : y("", !0)
    ], 2));
  }
}, Ha = /* @__PURE__ */ G(Ba, [["__scopeId", "data-v-5e1b4ab2"]]), Ia = ["data-agent-open", "aria-expanded", "role", "tabindex"], Ea = { class: "agent-head" }, Na = ["data-state"], Wa = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, qa = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, _a = { class: "agent-times" }, Fa = {
  key: 0,
  class: "agent-time",
  "data-agent-motion": ""
}, Da = {
  key: 1,
  class: "agent-time",
  "data-agent-motion": ""
}, Pa = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": ""
}, Ua = {
  key: 3,
  class: "agent-time",
  "data-agent-motion": ""
}, Ka = { class: "agent-line" }, Ja = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Za = {
  key: 0,
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, Ga = {
  key: 1,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Ya = {
  key: 1,
  class: "agent-line"
}, Qa = {
  key: 2,
  class: "agent-line agent-work-start"
}, Xa = ["data-peek"], en = ["title"], tn = ["data-peek"], an = ["data-agent-waiting", "data-agent-stopped"], nn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: i }) {
    const l = { helper: "Helper", reviewer: "Reviewer" }, a = e, m = i, w = nt(), C = b(() => {
      var h, g;
      if ((h = a.facts) != null && h.profile_title) return a.facts.profile_title;
      if ((g = a.facts) != null && g.profile) return a.facts.profile;
      const r = l[a.row.role] || a.row.role;
      return r.slice(0, 1).toUpperCase() + r.slice(1);
    }), $ = b(() => {
      var r;
      return ((r = a.facts) == null ? void 0 : r.tasks) ?? [];
    }), A = b(() => $.value.filter((r) => r.state === "open")), R = b(() => {
      const r = $.value.find((h) => {
        var g;
        return h.id === ((g = a.facts) == null ? void 0 : g.task_id);
      });
      return r != null && r.plan_id ? r : A.value.find((h) => h.plan_id);
    }), H = b(() => {
      var r, h, g, M, V;
      return a.row.role === "helper" ? ((r = a.facts) == null ? void 0 : r.helper_job) || "" : (h = a.facts) != null && h.job_enabled && (((g = a.facts) == null ? void 0 : g.task_title) || ((M = A.value[0]) == null ? void 0 : M.title) || ((V = $.value.at(-1)) == null ? void 0 : V.title)) || "";
    }), I = b(() => {
      const r = H.value.match(/\b(plan|doc)(?::|\s+)(\d+)\b/i);
      return r ? `${r[1].toLowerCase() === "plan" ? "plans" : "docs"}:${r[2]}` : "";
    }), z = b(() => {
      var r;
      return (r = a.facts) != null && r.job_enabled ? `${a.row.role} ${a.row.id}` : "";
    }), _ = b(() => {
      var r, h;
      return [a.row.program, (r = a.facts) == null ? void 0 : r.model, (h = a.facts) == null ? void 0 : h.effort, z.value].filter(Boolean).join(" · ");
    }), j = me(), B = b(() => lt(a.row.process_started_at || a.row.created_at, w.value)), E = /* @__PURE__ */ new Set(["open", "started", "testing"]), W = b(() => {
      var r;
      return (r = a.facts) == null ? void 0 : r.work_status;
    }), N = b(() => !!a.row.ended_at && a.row.role !== "main" && $.value.some((r) => E.has(r.state))), P = b(() => {
      var r;
      return a.row.retired_at || a.row.state === "retired" ? "retired" : W.value || a.waitReason || N.value ? "waiting" : a.row.state === "running" && ((r = a.facts) == null ? void 0 : r.state) || a.row.state;
    }), U = b(() => {
      var r;
      return W.value ? `Status: ${W.value}` : a.waitReason ? `Waiting: ${a.waitReason}` : P.value === "blocked" ? (r = a.facts) != null && r.blocked_reason ? `Blocked: ${a.facts.blocked_reason}` : "Blocked" : N.value ? "Stopped with work left" : "";
    }), d = b(() => {
      var r;
      return ((r = a.progress) == null ? void 0 : r.completed_count) ?? $.value.filter((h) => h.state === "completed").length;
    }), n = b(() => {
      var r;
      return ((r = a.progress) == null ? void 0 : r.task_count) ?? $.value.length;
    }), o = b(() => `${d.value} of ${n.value} ${n.value === 1 ? "task" : "tasks"}`), x = b(() => {
      var h;
      const r = st(d.value, ((h = a.progress) == null ? void 0 : h.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, w.value);
      return a.row.role !== "main" && r ? `${r} per hour` : "";
    }), c = b(() => !!a.row.retired_at || a.row.state === "retired");
    return (r, h) => {
      var g, M, V;
      return t(), s("div", {
        class: X(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: h[4] || (h[4] = (K) => !e.open && m("toggle")),
        onKeydown: [
          h[5] || (h[5] = Re(Q((K) => !e.open && m("toggle"), ["self", "prevent"]), ["enter"])),
          h[6] || (h[6] = Re(Q((K) => !e.open && m("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        p("span", Ea, [
          e.open ? (t(), s("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: h[0] || (h[0] = Q((K) => m("toggle"), ["stop"]))
          }, [
            k(u(ce), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : y("", !0),
          p("span", {
            class: "agent-dot",
            "data-state": P.value,
            "data-agent-motion": ""
          }, null, 8, Na),
          p("span", Wa, v(C.value), 1),
          p("span", qa, v(((g = e.facts) == null ? void 0 : g.given_name) || e.row.id), 1),
          e.open ? y("", !0) : (t(), F(u(ce), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          p("span", _a, [
            c.value ? (t(), s("span", Fa, [
              h[7] || (h[7] = f("Retired, ", -1)),
              k(u(ue), {
                at: e.row.retired_at
              }, null, 8, ["at"])
            ])) : e.row.ended_at && W.value ? (t(), s("span", Da, [
              h[8] || (h[8] = f("Process ended: ", -1)),
              k(u(ue), {
                at: e.row.ended_at
              }, null, 8, ["at"])
            ])) : e.row.ended_at ? (t(), s("span", Pa, [
              h[9] || (h[9] = f("Idle, ", -1)),
              k(u(ue), {
                at: e.row.ended_at
              }, null, 8, ["at"])
            ])) : (t(), s("span", Ua, v(B.value), 1))
          ])
        ]),
        p("span", Ka, [
          p("span", Ja, v(e.open ? z.value : _.value), 1),
          e.open ? (t(), s("span", Za, [
            k(u(ce), {
              name: "time",
              size: 12
            }),
            h[10] || (h[10] = f("First dispatched: ", -1)),
            k(u(ue), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : y("", !0),
          e.open && ((M = e.facts) != null && M.last_activity) ? (t(), s("span", Ga, [
            h[11] || (h[11] = f("Last heard: ", -1)),
            k(u(ue), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : y("", !0)
        ]),
        e.open ? (t(), F(Ha, {
          key: 0,
          agent: e.row,
          branch: (V = e.progress) == null ? void 0 : V.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: [] },
          card: ""
        }, {
          default: S(() => [
            k(Kt, { row: e.row }, null, 8, ["row"]),
            e.row.role === "helper" && !e.row.ended_at ? (t(), F(u(te), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: h[1] || (h[1] = Q((K) => u(j).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: S(() => [...h[12] || (h[12] = [
                f("Stop", -1)
              ])]),
              _: 1
            })) : y("", !0)
          ]),
          _: 1
        }, 8, ["agent", "branch", "usage"])) : y("", !0),
        e.open && n.value && !H.value ? (t(), s("span", Ya, [
          k(Ve, {
            count: o.value,
            rate: x.value
          }, null, 8, ["count", "rate"])
        ])) : y("", !0),
        e.open && R.value ? (t(), s("span", Qa, [
          p("button", {
            type: "button",
            class: "agent-plan",
            "data-agent-plan": "",
            "data-peek": `plans:${R.value.plan_id}`,
            onClick: h[2] || (h[2] = Q((K) => u(he)(`plans:${R.value.plan_id}`), ["stop"]))
          }, "Plan " + v(R.value.plan_id) + ": " + v(R.value.plan_title), 9, Xa)
        ])) : y("", !0),
        H.value || !e.open && U.value || W.value ? (t(), s("span", {
          key: 3,
          class: X(["agent-line", { "agent-work-start": !R.value }])
        }, [
          p("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: H.value
          }, [
            e.open && I.value ? (t(), s("button", {
              key: 0,
              type: "button",
              class: "agent-job-link",
              "data-peek": I.value,
              onClick: h[3] || (h[3] = Q((K) => u(he)(I.value), ["stop"]))
            }, v(H.value), 9, tn)) : (t(), s(L, { key: 1 }, [
              f(v(H.value), 1)
            ], 64))
          ], 8, en),
          U.value && (!e.open || W.value) ? (t(), s("span", {
            key: 0,
            class: "agent-work-status",
            "data-agent-work-status": "",
            "data-agent-waiting": e.waitReason ? "" : null,
            "data-agent-stopped": N.value && !e.waitReason && !W.value ? "" : null
          }, v(U.value), 9, an)) : y("", !0),
          e.open && n.value ? (t(), F(Ve, {
            key: 1,
            count: o.value,
            rate: x.value
          }, null, 8, ["count", "rate"])) : y("", !0)
        ], 2)) : y("", !0),
        e.open ? (t(), F(zt, {
          key: 4,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: $.value,
          "stopped-with-work": N.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : y("", !0)
      ], 42, Ia);
    };
  }
}, ln = /* @__PURE__ */ G(nn, [["__scopeId", "data-v-52f62cae"]]), sn = {
  class: "agent-limits",
  "data-agent-limits": ""
}, on = ["aria-expanded"], rn = { key: 0 }, dn = { key: 1 }, un = { class: "limits-panel" }, cn = { class: "limits-head" }, gn = ["data-agent-limit-type", "data-agent-limit-profile"], pn = { class: "count" }, vn = { class: "bar" }, hn = { class: "count" }, mn = { class: "bar" }, fn = ["data-agent-limit-type"], kn = { class: "limit-field" }, yn = { class: "limit-field" }, bn = {
  key: 1,
  role: "alert"
}, wn = {
  key: 2,
  role: "status"
}, Mn = {
  __name: "AgentLimits",
  setup(e) {
    const i = me(), { rows: l, failure: a } = i.props.limits, m = O(!1), w = O(!1), C = O(!1), $ = O(""), A = O(""), R = (d) => d === 0 ? "no limit" : String(d), H = (d, n) => n === 0 ? 0 : d > n ? 2 : d === n ? 1 : 0, I = b(() => l.value.flatMap((d) => d.per_profile && d.profiles.length ? d.profiles.map((n) => ({ ...n, label: n.title, type: d.key, key: `${d.key}:${n.profile}` })) : [d])), z = (d) => Math.max(H(d.running, d.run_limit), H(d.kept, d.kept_limit)), _ = b(() => I.value.filter((d) => z(d)).sort((d, n) => z(n) - z(d))), j = b(() => l.value.reduce((d, n) => d + n.running, 0)), B = b(() => l.value.reduce((d, n) => d + n.kept, 0)), E = (d) => {
      const n = [d.run_limit ? d.running - d.run_limit : -1, d.kept_limit ? d.kept - d.kept_limit : -1], o = Math.max(...n);
      return o > 0 ? `Over by ${o}` : o === 0 ? "At limit" : "Within limits";
    }, W = (d, n) => n ? `${Math.min(d / Math.max(d, n) * 100, 100)}%` : "0%", N = (d, n) => n && d > n ? `${(d - n) / d * 100}%` : "0%";
    function P() {
      w.value = !w.value;
    }
    async function U(d, n, o, x) {
      if (C.value || i.readOnly) return;
      const c = Number(x.target.value);
      if (!Number.isInteger(c) || c < 0 || !x.target.value.trim()) {
        $.value = "Use a whole number of 0 or more.", x.target.value = String(o);
        return;
      }
      C.value = !0, A.value = "";
      try {
        const r = await i.run(["setting", "set", n, String(c), "--environment", i.environment]);
        if ($.value = r.ok ? "" : r.error, !r.ok) {
          x.target.value = String(o);
          return;
        }
        await i.reload("limits"), A.value = `${d.label} limits saved.`;
      } finally {
        C.value = !1;
      }
    }
    return (d, n) => (t(), s("section", sn, [
      u(l).length ? (t(), s(L, { key: 0 }, [
        p("button", {
          class: "summary",
          type: "button",
          "aria-expanded": m.value,
          onClick: n[0] || (n[0] = (o) => m.value = !m.value)
        }, [
          _.value.length ? (t(), s(L, { key: 0 }, [
            (t(!0), s(L, null, Z(_.value.slice(0, 2), (o) => (t(), s("span", {
              key: o.key,
              class: "summary-item"
            }, [
              p("span", {
                class: X(["mark", { over: z(o) === 2 }])
              }, null, 2),
              f(v(o.label) + ": " + v(E(o)), 1)
            ]))), 128)),
            _.value.length > 2 ? (t(), s("span", rn, v(_.value.length - 2) + " more", 1)) : y("", !0)
          ], 64)) : (t(), s("span", dn, "All within limits, " + v(j.value) + " running, " + v(B.value) + " kept", 1)),
          k(u(ce), {
            name: "caret",
            size: 12
          })
        ], 8, on),
        Ke(p("div", un, [
          p("div", cn, [
            n[1] || (n[1] = p("strong", null, "Agent limits", -1)),
            k(u(te), {
              small: "",
              disabled: C.value || u(i).readOnly,
              "data-agent-limits-edit": "",
              onClick: P
            }, {
              default: S(() => [
                f(v(w.value ? "Done" : "Edit limits"), 1)
              ]),
              _: 1
            }, 8, ["disabled"])
          ]),
          w.value ? (t(), s(L, { key: 1 }, [
            (t(!0), s(L, null, Z(u(l), (o) => (t(), s("div", {
              key: o.key,
              class: "edit-row",
              "data-agent-limit-type": o.key
            }, [
              p("strong", null, v(o.label), 1),
              p("label", kn, [
                p("span", null, [
                  n[3] || (n[3] = f("Running", -1)),
                  o.per_profile ? (t(), s(L, { key: 0 }, [
                    f(" per profile")
                  ], 64)) : y("", !0)
                ]),
                k(u(Ae), {
                  type: "number",
                  min: "0",
                  value: String(o.run_limit),
                  disabled: C.value || u(i).readOnly,
                  "data-agent-run-limit": o.key,
                  onChange: (x) => U(o, o.run_setting, o.run_limit, x)
                }, null, 8, ["value", "disabled", "data-agent-run-limit", "onChange"]),
                p("small", null, v(o.run_source), 1)
              ]),
              p("label", yn, [
                p("span", null, [
                  n[4] || (n[4] = f("Kept", -1)),
                  o.per_profile ? (t(), s(L, { key: 0 }, [
                    f(" per profile")
                  ], 64)) : y("", !0)
                ]),
                k(u(Ae), {
                  type: "number",
                  min: "0",
                  value: String(o.kept_limit),
                  disabled: C.value || u(i).readOnly,
                  "data-agent-kept-limit": o.key,
                  onChange: (x) => U(o, o.kept_setting, o.kept_limit, x)
                }, null, 8, ["value", "disabled", "data-agent-kept-limit", "onChange"]),
                p("small", null, v(o.kept_source), 1)
              ])
            ], 8, fn))), 128)),
            p("p", null, "Running 0 starts no agents. Kept 0 means no limit. Changes apply to " + v(u(i).environment) + ".", 1)
          ], 64)) : (t(), s(L, { key: 0 }, [
            n[2] || (n[2] = p("div", { class: "table-head" }, [
              p("span", null, "Agent"),
              p("span", null, "Running"),
              p("span", null, "Kept"),
              p("span", null, "Status")
            ], -1)),
            (t(!0), s(L, null, Z(I.value, (o) => (t(), s("div", {
              key: o.key,
              class: "limit-row",
              "data-agent-limit-type": o.type || o.key,
              "data-agent-limit-profile": o.profile
            }, [
              p("strong", null, v(o.label), 1),
              p("div", pn, [
                p("span", null, v(o.run_limit ? `${o.running} of ${o.run_limit}` : `${o.running} · none may start`), 1),
                p("div", vn, [
                  p("span", {
                    style: se({ width: W(o.running, o.run_limit) })
                  }, null, 4),
                  p("i", {
                    style: se({ width: N(o.running, o.run_limit) })
                  }, null, 4)
                ])
              ]),
              p("div", hn, [
                p("span", null, v(o.kept) + " of " + v(R(o.kept_limit)), 1),
                p("div", mn, [
                  p("span", {
                    style: se({ width: W(o.kept, o.kept_limit) })
                  }, null, 4),
                  p("i", {
                    style: se({ width: N(o.kept, o.kept_limit) })
                  }, null, 4)
                ])
              ]),
              p("span", {
                class: X(["status", { warning: z(o) === 1, danger: z(o) === 2 }])
              }, v(E(o)), 3)
            ], 8, gn))), 128))
          ], 64))
        ], 512), [
          [Je, m.value]
        ])
      ], 64)) : y("", !0),
      $.value || u(a) ? (t(), s("p", bn, v($.value || u(a)), 1)) : y("", !0),
      A.value ? (t(), s("p", wn, v(A.value), 1)) : y("", !0)
    ]));
  }
}, xn = /* @__PURE__ */ G(Mn, [["__scopeId", "data-v-6f5b1989"]]), $n = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Cn = ["data-agent-row"], Oe = "journal.agents.filters", we = "cubic-bezier(0.2, 0.9, 0.25, 1)", Sn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const i = e, l = me(), { rows: a } = l.props.waits, { rows: m } = l.props.progress, { rows: w, failure: C, loaded: $, more: A } = l.props.agents, R = (q) => m.value.find((D) => D.agent_id === q.id) ?? null, H = (q) => {
      var D;
      return ((D = a.value.find((T) => T.agent_id === q.id)) == null ? void 0 : D.reason) ?? "";
    }, I = O("running"), z = O(""), _ = JSON.parse(localStorage.getItem(Oe) || '{"roles":[],"profiles":[],"programs":[]}'), j = O(_), B = b(() => l.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: E } = l.props.programs, W = b(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), N = (q, D) => {
      j.value = dt(j.value, q, D);
    }, P = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, U = (q) => q.slice(0, 1).toUpperCase() + q.slice(1);
    le(j, (q) => localStorage.setItem(Oe, JSON.stringify(q)));
    const d = O(25);
    function n() {
      Object.assign(l.state, {
        "agents.show": I.value,
        "agents.search": z.value,
        "agents.limit": String(d.value),
        "agents.roles": j.value.roles.join(","),
        "agents.profiles": j.value.profiles.join(","),
        "agents.programs": j.value.programs.join(",")
      });
    }
    async function o() {
      return d.value += 25, n(), await l.reload("agents"), !0;
    }
    le([I, z, j], () => {
      d.value = 25, n(), l.reload("agents");
    }), n();
    const x = (q) => q.facts ?? null, c = w, r = b(() => !!z.value.trim() || W.value > 0), h = b(() => i.texts[I.value] ?? { title: i.empty, hint: "" }), g = O(null), M = O(null), V = O(null), K = b(() => c.value.find((q) => q.id === g.value) ?? null), fe = b(() => K.value ? [K.value] : c.value), oe = () => globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let ae = !1, Me = 0;
    async function xe(q) {
      if (ae) return;
      ae = !0, Me = V.value.scrollTop;
      const D = M.value.querySelector(`[data-agent-open="${q.id}"]`);
      if (!oe()) {
        const ne = [...M.value.querySelectorAll(".agent-row")].filter((ee) => !ee.contains(D));
        await Promise.all(ne.map((ee) => ee.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const T = [...D.querySelectorAll(".agent-head, .agent-line")], J = [...T, ...D.querySelectorAll("[data-agent-motion]")], ke = J.map((ne) => ne.getBoundingClientRect());
      if (g.value = q.id, await ze(), !oe()) {
        const ne = J.map((ee) => ee.getBoundingClientRect());
        J.forEach((ee, ye) => {
          const ie = T.indexOf(ee.parentElement), Ne = ke[ye].left - ne[ye].left - (ie < 0 ? 0 : ke[ie].left - ne[ie].left), We = ke[ye].top - ne[ye].top - (ie < 0 ? 0 : ke[ie].top - ne[ie].top);
          ee.animate([{ transform: `translate(${Ne}px, ${We}px)` }, { transform: "none" }], { duration: 280, easing: we });
        }), M.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((ee) => {
          ee.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: we, fill: "backwards" });
        });
      }
      ae = !1;
    }
    async function je() {
      if (ae || !K.value) return;
      ae = !0;
      const q = M.value.querySelector(`[data-agent-open="${g.value}"]`), D = [...q.children], T = oe() ? [] : D.map((J) => J.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(T.map((J) => J.finished)), g.value = null, await ze(), V.value.scrollTop = Me, T.forEach((J) => J.cancel()), oe() || (q.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: we }), M.value.querySelectorAll(".agent-row").forEach((J) => {
        J.contains(q) || J.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: we });
      })), ae = !1;
    }
    const Ee = (q) => g.value === q.id ? je() : xe(q);
    le(z, (q) => q.trim() && (g.value = null)), le(I, () => {
      g.value = null;
    });
    const Te = (q) => {
      q.key === "Escape" && je();
    };
    return globalThis.addEventListener("keydown", Te), pe(() => globalThis.removeEventListener("keydown", Te)), (q, D) => (t(), s("div", {
      ref_key: "agents",
      ref: M,
      class: X(["agents", { focused: K.value }])
    }, [
      k(xn),
      k(u(ot), {
        modelValue: z.value,
        "onUpdate:modelValue": D[1] || (D[1] = (T) => z.value = T),
        placeholder: "Search agents",
        "menu-count": W.value,
        "data-agents-search": ""
      }, {
        menu: S(() => [
          k(u(Ce), null, {
            default: S(() => [...D[2] || (D[2] = [
              f("Type", -1)
            ])]),
            _: 1
          }),
          (t(!0), s(L, null, Z(B.value.roles, (T) => (t(), F(u(be), {
            key: T,
            role: "menuitemcheckbox",
            "aria-checked": j.value.roles.includes(T),
            checked: j.value.roles.includes(T),
            "data-filter-role": T,
            onClick: (J) => N("roles", T)
          }, {
            default: S(() => [
              f(v(U(T)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          B.value.profiles.length ? (t(), F(u(Ce), { key: 0 }, {
            default: S(() => [...D[3] || (D[3] = [
              f("Profile", -1)
            ])]),
            _: 1
          })) : y("", !0),
          (t(!0), s(L, null, Z(B.value.profiles, (T) => (t(), F(u(be), {
            key: T.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.profiles.includes(T.name),
            checked: j.value.profiles.includes(T.name),
            "data-filter-profile": T.name,
            onClick: (J) => N("profiles", T.name)
          }, {
            default: S(() => [
              f(v(T.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          k(u(Ce), null, {
            default: S(() => [...D[4] || (D[4] = [
              f("Program", -1)
            ])]),
            _: 1
          }),
          (t(!0), s(L, null, Z(u(E), (T) => (t(), F(u(be), {
            key: T.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.programs.includes(T.name),
            checked: j.value.programs.includes(T.name),
            "data-filter-program": T.name,
            onClick: (J) => N("programs", T.name)
          }, {
            default: S(() => [
              f(v(T.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          W.value ? (t(), F(u(be), {
            key: 1,
            "data-filter-clear": "",
            onClick: P
          }, {
            default: S(() => [...D[5] || (D[5] = [
              f("Clear filters", -1)
            ])]),
            _: 1
          })) : y("", !0)
        ]),
        default: S(() => [
          k(u(it), {
            options: B.value.states,
            value: I.value,
            onPick: D[0] || (D[0] = (T) => I.value = T)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      I.value === "retired" && B.value.upgrade_retired ? (t(), s("p", $n, "Retired during the upgrade: " + v(B.value.upgrade_retired), 1)) : y("", !0),
      p("div", {
        ref_key: "list",
        ref: V,
        class: X(["agents-view", { "agents-view-open": K.value }])
      }, [
        u($) && !u(C) && !fe.value.length && W.value ? (t(), F(u(Se), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: S(() => [
            k(u(te), {
              small: "",
              "data-empty-clear": "",
              onClick: P
            }, {
              default: S(() => [...D[6] || (D[6] = [
                f("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (t(), F(u(rt), {
          key: 1,
          rows: fe.value,
          failure: u(C),
          loaded: u($),
          more: !K.value && u(A),
          older: o,
          empty: h.value.title,
          hint: h.value.hint,
          searching: r.value
        }, {
          default: S(({ row: T }) => [
            p("div", {
              class: "agent-row",
              "data-agent-row": T.id
            }, [
              k(ln, {
                row: T,
                facts: x(T),
                progress: R(T),
                "wait-reason": H(T),
                open: T.id === g.value,
                onToggle: (J) => Ee(T)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, Cn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, Rn = /* @__PURE__ */ G(Sn, [["__scopeId", "data-v-c93c8a31"]]);
export {
  Rn as A
};
