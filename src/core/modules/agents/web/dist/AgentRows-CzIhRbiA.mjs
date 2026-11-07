/* @code-commandments-generated */
import { openBlock as a, createElementBlock as l, withModifiers as ne, unref as i, createTextVNode as g, toDisplayString as p, createVNode as w, createBlock as F, withCtx as S, Fragment as H, renderList as X, createElementVNode as v, createCommentVNode as h, computed as b, ref as O, watch as de, onUnmounted as we, defineAsyncComponent as Pe, createSlots as De, resolveDynamicComponent as Ue, normalizeStyle as he, normalizeClass as se, renderSlot as Me, onMounted as Ke, Teleport as Je, mergeProps as Ze, toRef as Te, withKeys as ze, nextTick as Be } from "vue";
import { peekRef as je, Icon as fe, RunningCommand as Ge, FoldGroup as Le, TaskStatusIcon as Ye, useWindow as $e, loadWindowComponent as Qe, coalesced as Xe, READ_RATES as _e, InnerTabs as et, TabBody as tt, SwitchCase as He, EmptyState as Oe, Btn as ee, TextArea as at, TextInput as nt, useNow as Ie, age as Ee, perHour as lt, TimeAgo as ye, Dialog as ot, SearchBar as st, Segmented as rt, MenuLabel as Re, MenuItem as Se, RowList as it, toggleFilter as ut } from "@journal/window-kit";
import { _ as te, T as dt } from "./TranscriptRows-CmUHa8Pu.mjs";
const ct = {
  class: "agent-command",
  "data-agent-command": ""
}, vt = {
  key: 1,
  "data-agent-stopped": ""
}, pt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (u, o) => (a(), l("span", ct, [
      e.waitReason ? (a(), l("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: o[0] || (o[0] = ne((t) => i(je)("test_queue:0"), ["stop"]))
      }, [
        g("Waiting: " + p(e.waitReason) + " ", 1),
        w(i(fe), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), l("span", vt, "Waiting")) : (a(), F(i(Ge), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, gt = /* @__PURE__ */ te(pt, [["__scopeId", "data-v-98a7a91e"]]), mt = ["data-agent-delegated", "onClick"], ht = { class: "agent-task-number" }, ft = { class: "agent-task-title" }, kt = ["title"], yt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: u }) {
    const o = u;
    return (t, m) => (a(), F(i(Le), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: m[0] || (m[0] = (f) => o("toggle"))
    }, {
      default: S(() => [
        (a(!0), l(H, null, X(e.section.tasks, (f) => (a(), l("button", {
          key: f.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": f.id,
          onClick: (k) => i(je)(`tasks:${f.id}`)
        }, [
          w(i(Ye), {
            status: f.state
          }, null, 8, ["status"]),
          v("span", ht, p(f.id), 1),
          v("span", ft, p(f.title), 1),
          f.plan_id ? (a(), l("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${f.plan_id}: ${f.plan_title}`
          }, "Plan " + p(f.plan_id) + ": " + p(f.plan_title), 9, kt)) : h("", !0)
        ], 8, mt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, bt = /* @__PURE__ */ te(yt, [["__scopeId", "data-v-8d5bf3ff"]]), wt = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Mt = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, $t = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, xt = ["data-peek", "onClick"], Ct = {
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
    const u = e, o = ["started", "blocked", "open", "completed"], t = b(() => {
      var n, s;
      return u.row.ended_at && ((s = (n = u.facts) == null ? void 0 : n.job_returned) != null && s.startsWith(Tt)) ? u.facts.job_returned : "";
    }), m = b(() => u.tasks.length ? o.map((n) => ({ state: n, label: n.slice(0, 1).toUpperCase() + n.slice(1), tasks: u.tasks.filter((s) => s.state === n || n === "started" && s.state === "testing" || n === "completed" && s.state === "cancelled") })) : []), f = /* @__PURE__ */ new Set(["completed"]), k = O({}), $ = (n) => !(k.value[n] ?? f.has(n)), T = (n) => k.value = { ...k.value, [n]: $(n) }, I = $e(), { rows: U } = I.props.reports;
    I.state["reports.agent"] = String(u.row.id);
    const D = b(() => u.row.access === "read-only"), B = b(() => !!u.row.retired_at || u.row.state === "retired"), P = ["tasks", "transcript", "terminal", "file-feed", "reports"], j = b(() => (B.value ? I.tabs.filter((s) => ["reports", "transcript"].includes(s.key)) : D.value ? I.tabs.filter((s) => ["reports", "transcript", "terminal"].includes(s.key)) : [...I.tabs]).sort((s, N) => (P.indexOf(s.key) < 0 ? P.length : P.indexOf(s.key)) - (P.indexOf(N.key) < 0 ? P.length : P.indexOf(N.key)))), L = () => D.value || B.value ? j.value.find((n) => n.key === "transcript") : j.value[0], E = O(L());
    de(E, (n) => {
      I.state.tab = (n == null ? void 0 : n.key) ?? "";
    }, { immediate: !0 }), we(() => {
      I.state.tab = "";
    }), de(j, (n) => {
      n.some((s) => {
        var N;
        return s.key === ((N = E.value) == null ? void 0 : N.key);
      }) || (E.value = n[0]);
    }), de(() => u.open, (n) => {
      n && (E.value = L());
    });
    const J = Object.fromEntries(I.tabs.filter((n) => n.component).map((n) => [n.key, Pe(() => Qe(n.component))])), q = O(!1), { data: G } = I.props.tool, Q = b(() => {
      var n;
      return ((n = G.value) == null ? void 0 : n.tool) ?? "";
    }), x = b(() => {
      var n;
      return ((n = G.value) == null ? void 0 : n.note) ?? "";
    }), r = b(() => u.row.role !== "main" && (!u.row.ended_at || u.stoppedWithWork || u.waitReason));
    async function Z() {
      !u.open || !r.value || (I.state["tool.agent"] = String(u.row.id), await I.reload("tool"));
    }
    const M = I.follow(["hook_call.*", "process_part.*"], Xe(Z, _e.agentCommand));
    return we(() => M == null ? void 0 : M()), de(() => u.open, (n) => {
      n && Z();
    }, { immediate: !0 }), (n, s) => {
      var N;
      return a(), l("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: s[2] || (s[2] = ne(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (a(), l("p", wt, "Retirement reason: " + p(e.row.retirement_reason), 1)) : h("", !0),
        e.row.resume_reason ? (a(), l("p", Mt, p(e.row.resume_reason), 1)) : h("", !0),
        r.value ? (a(), F(gt, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: Q.value,
          note: x.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : h("", !0),
        t.value ? (a(), l("p", $t, p(t.value), 1)) : h("", !0),
        w(i(et), {
          class: "agent-tabs",
          tabs: j.value,
          active: E.value,
          answer: { tasks: e.tasks.length, reports: i(U).length },
          onChoose: s[0] || (s[0] = (c) => E.value = c)
        }, null, 8, ["tabs", "active", "answer"]),
        w(i(tt), {
          class: "agent-tab-body",
          tab: E.value,
          "data-agent-tab-body": (N = E.value) == null ? void 0 : N.key
        }, {
          default: S(() => {
            var c;
            return [
              w(i(He), {
                value: (c = E.value) == null ? void 0 : c.key
              }, De({
                reports: S(() => [
                  i(U).length ? h("", !0) : (a(), F(i(Oe), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: S(() => [...s[3] || (s[3] = [
                      g("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (a(!0), l(H, null, X(i(U), (A) => (a(), l("button", {
                    key: A.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${A.id}`,
                    onClick: (R) => i(je)(`messages:${A.id}`)
                  }, p(A.text), 9, xt))), 128))
                ]),
                tasks: S(() => {
                  var A;
                  return [
                    e.tasks.length ? h("", !0) : (a(), F(i(Oe), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: S(() => [...s[4] || (s[4] = [
                        g("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (a(!0), l(H, null, X(m.value, (R) => (a(), F(bt, {
                      key: R.state,
                      section: R,
                      open: $(R.state),
                      onToggle: (Y) => T(R.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (A = e.facts) != null && A.instruction ? (a(), l(H, { key: 1 }, [
                      s[5] || (s[5] = v("p", { class: "agent-label" }, "Instruction", -1)),
                      v("div", Ct, p(e.facts.instruction), 1)
                    ], 64)) : h("", !0)
                  ];
                }),
                transcript: S(() => {
                  var A;
                  return [
                    D.value ? (a(), l(H, { key: 0 }, [
                      (A = e.facts) != null && A.instruction ? (a(), l("div", St, [
                        w(i(Le), {
                          label: "Instruction",
                          open: q.value,
                          "data-agent-section": "instruction",
                          onToggle: s[1] || (s[1] = (R) => q.value = !q.value)
                        }, {
                          default: S(() => [
                            v("div", At, p(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (a(), l("p", jt, "No job recorded")) : h("", !0)
                    ], 64)) : h("", !0),
                    w(dt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                X(i(J), (A, R) => ({
                  name: R,
                  fn: S(() => [
                    (a(), F(Ue(A), {
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
}, Ot = /* @__PURE__ */ te(Rt, [["__scopeId", "data-v-5d285bf8"]]), zt = { class: "action-field" }, Bt = ["value", "disabled"], Vt = ["value"], Lt = { key: 1 }, Ht = {
  key: 1,
  class: "action-field"
}, It = { class: "action-buttons" }, Et = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (u, o) => (a(), l("form", {
      onSubmit: o[4] || (o[4] = ne((t) => u.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (a(), l(H, { key: 0 }, [
        v("label", zt, [
          o[6] || (o[6] = g("Task ", -1)),
          v("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: o[0] || (o[0] = (t) => u.$emit("update:task", t.target.value))
          }, [
            o[5] || (o[5] = v("option", { value: "" }, "Choose an open task", -1)),
            (a(!0), l(H, null, X(e.tasks, (t) => (a(), l("option", {
              key: t.id,
              value: String(t.id)
            }, p(t.id) + ": " + p(t.title), 9, Vt))), 128))
          ], 40, Bt)
        ]),
        e.moreTasks ? (a(), F(i(ee), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: o[1] || (o[1] = (t) => u.$emit("more"))
        }, {
          default: S(() => [...o[7] || (o[7] = [
            g("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : h("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (a(), l("p", Lt, "No open tasks.")) : h("", !0)
      ], 64)) : (a(), l("label", Ht, [
        o[8] || (o[8] = g("Job", -1)),
        w(i(at), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: o[2] || (o[2] = (t) => u.$emit("update:text", t.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      v("div", It, [
        w(i(ee), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: S(() => [...o[9] || (o[9] = [
            g("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        w(i(ee), {
          small: "",
          disabled: e.pending,
          onClick: o[3] || (o[3] = (t) => u.$emit("cancel"))
        }, {
          default: S(() => [...o[10] || (o[10] = [
            g("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Nt = /* @__PURE__ */ te(Et, [["__scopeId", "data-v-b2386331"]]), qt = { class: "action-buttons" }, Wt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (u, o) => (a(), l("form", {
      "data-agent-retire-confirm": "",
      onSubmit: o[2] || (o[2] = ne((t) => u.$emit("submit"), ["prevent"]))
    }, [
      o[5] || (o[5] = v("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      w(i(nt), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": o[0] || (o[0] = (t) => u.$emit("update:reason", t))
      }, null, 8, ["model-value", "disabled"]),
      v("div", qt, [
        w(i(ee), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: S(() => [...o[3] || (o[3] = [
            g("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        w(i(ee), {
          small: "",
          disabled: e.pending,
          onClick: o[1] || (o[1] = (t) => u.$emit("cancel"))
        }, {
          default: S(() => [...o[4] || (o[4] = [
            g("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Ne = /* @__PURE__ */ te(Wt, [["__scopeId", "data-v-0b954b22"]]), Ft = { class: "action-buttons" }, Pt = {
  key: 0,
  role: "alert"
}, Dt = {
  key: 1,
  role: "status"
}, Ut = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const u = e, o = $e(), t = O(""), m = O(""), f = O(""), k = O(""), $ = O([]), T = O(0), I = O(!1), U = O(!1), D = O(!1), B = O(""), P = O(""), j = b(() => !!u.row.retired_at || u.row.state === "retired"), L = b(() => !j.value && !!u.row.ended_at), E = b(() => {
      var M;
      return L.value && ((M = u.row.job_command) == null ? void 0 : M.length) && !u.row.resume_reason;
    }), J = b(() => E.value && !U.value && (u.row.job_task_flag ? $.value.some((M) => String(M.id) === k.value) : !!m.value.trim()));
    function q(M) {
      t.value = M, m.value = "", f.value = "", k.value = "", B.value = "", P.value = "";
    }
    async function G() {
      q("job"), u.row.job_task_flag && ($.value = [], T.value = 0, I.value = !1, await Q());
    }
    async function Q() {
      if (!U.value) {
        U.value = !0;
        try {
          o.state["jobs.page"] = String(T.value + 1), await o.reload("jobs");
          const M = o.props.jobs;
          B.value = M.failure.value, B.value || ($.value = [...$.value, ...M.rows.value], T.value = M.data.value.page, I.value = M.more.value);
        } finally {
          U.value = !1;
        }
      }
    }
    async function x(M, n) {
      if (!D.value) {
        D.value = !0, B.value = "";
        try {
          const s = await o.run(M);
          B.value = s.ok ? "" : s.error, s.ok && (q(""), P.value = n);
        } finally {
          D.value = !1;
        }
      }
    }
    async function r() {
      if (!J.value) return;
      const M = u.row.job_task_flag ? [u.row.job_task_flag, k.value] : [m.value.trim()];
      await x([...u.row.job_command, String(u.row.id), ...M], "Job sent.");
    }
    async function Z() {
      !L.value || t.value !== "retire" || !f.value.trim() || await x(["agent", "retire", String(u.row.id), "--reason", f.value.trim()], "Agent retired permanently.");
    }
    return (M, n) => {
      var s;
      return j.value ? h("", !0) : (a(), l("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: n[6] || (n[6] = ne(() => {
        }, ["stop"])),
        onKeydown: n[7] || (n[7] = ne(() => {
        }, ["stop"]))
      }, [
        v("div", Ft, [
          L.value ? (a(), l(H, { key: 0 }, [
            (s = e.row.job_command) != null && s.length ? (a(), F(i(ee), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: D.value || U.value || !E.value,
              onClick: G
            }, {
              default: S(() => [...n[8] || (n[8] = [
                g("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0),
            e.row.role !== "main" ? (a(), F(i(ee), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: D.value || U.value,
              onClick: n[0] || (n[0] = (N) => q("retire"))
            }, {
              default: S(() => [...n[9] || (n[9] = [
                g("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0)
          ], 64)) : h("", !0)
        ]),
        w(i(He), { value: t.value }, {
          job: S(() => [
            w(Nt, {
              task: k.value,
              "onUpdate:task": n[1] || (n[1] = (N) => k.value = N),
              text: m.value,
              "onUpdate:text": n[2] || (n[2] = (N) => m.value = N),
              row: e.row,
              tasks: $.value,
              pending: D.value,
              loading: U.value,
              "more-tasks": I.value,
              failure: B.value,
              "job-ready": J.value,
              onSubmit: r,
              onMore: Q,
              onCancel: n[3] || (n[3] = (N) => q(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: S(() => [
            w(Ne, {
              reason: f.value,
              "onUpdate:reason": n[4] || (n[4] = (N) => f.value = N),
              pending: D.value,
              onSubmit: Z,
              onCancel: n[5] || (n[5] = (N) => q(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        B.value ? (a(), l("p", Pt, p(B.value), 1)) : h("", !0),
        P.value ? (a(), l("p", Dt, p(P.value), 1)) : h("", !0)
      ], 32));
    };
  }
}, Kt = /* @__PURE__ */ te(Ut, [["__scopeId", "data-v-b4e8d0f2"]]), Jt = ["data-icon", "stroke-width", "innerHTML"], ae = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const u = e, o = { right: 0, down: 90, left: 180, up: 270 }, t = {
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
    return (f, k) => (a(), l("svg", {
      class: "ico",
      "data-icon": e.name,
      style: he({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...u.facing === "right" ? {} : { transform: `rotate(${o[u.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: m[t[e.name] || e.name] || m.dot
    }, null, 12, Jt));
  }
}, Zt = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Gt = {
  key: 1,
  class: "menu-item-text"
}, Yt = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (u, o) => (a(), l("button", {
      type: "button",
      class: se(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), l("span", Zt, p(e.checked ? "✓" : ""), 1)) : h("", !0),
      e.description ? (a(), l("span", Gt, [
        v("span", null, [
          Me(u.$slots, "default", {}, void 0, !0)
        ]),
        v("small", null, p(e.description), 1)
      ])) : Me(u.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, me = /* @__PURE__ */ te(Yt, [["__scopeId", "data-v-4c77c076"]]), Qt = {}, Xt = { class: "menu-label" };
function _t(e, u) {
  return a(), l("span", Xt, [
    Me(e.$slots, "default", {}, void 0, !0)
  ]);
}
const be = /* @__PURE__ */ te(Qt, [["render", _t], ["__scopeId", "data-v-bea00752"]]), ea = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, ta = {
  key: 0,
  class: "skills-none"
}, aa = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: u }) {
    const o = e, t = u, m = b(() => o.skills.filter((k) => k.state === "loaded")), f = b(() => o.skills.filter((k) => k.state !== "loaded"));
    return (k, $) => (a(), l("div", ea, [
      w(be, null, {
        default: S(() => [...$[1] || ($[1] = [
          g("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      m.value.length ? h("", !0) : (a(), l("p", ta, "None yet. Compacting the conversation empties this list.")),
      (a(!0), l(H, null, X(m.value, (T) => (a(), l("p", {
        key: T.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        w(ae, {
          name: "book",
          size: 12
        }),
        g(p(T.skill), 1)
      ]))), 128)),
      f.value.length ? (a(), l(H, { key: 1 }, [
        w(be, null, {
          default: S(() => [...$[2] || ($[2] = [
            g("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), l(H, null, X(f.value, (T) => (a(), l("p", {
          key: T.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          w(ae, {
            name: "book",
            size: 12
          }),
          g(p(T.skill), 1)
        ]))), 128))
      ], 64)) : h("", !0),
      w(me, {
        "data-agent-skills-browse": "",
        onClick: $[0] || ($[0] = (T) => t("browse"))
      }, {
        default: S(() => [...$[3] || ($[3] = [
          g("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, na = /* @__PURE__ */ te(aa, [["__scopeId", "data-v-3ab4783d"]]), la = (e, u, o) => Math.max(u, Math.min(o, e)), qe = /* @__PURE__ */ new WeakMap(), oa = (e, u) => qe.set(e, u);
function sa(e, u) {
  for (let o = u; o; o = qe.get(o) ?? o.parentElement) if (o === e) return !0;
  return !1;
}
function ra(e, u) {
  const o = (t) => {
    var f, k;
    const m = ((f = e.value) == null ? void 0 : f.element) || ((k = e.value) == null ? void 0 : k.$el) || e.value;
    m && !sa(m, t.target) && u(t);
  };
  window.addEventListener("click", o), we(() => window.removeEventListener("click", o));
}
const ge = 8, ia = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: u, emit: o }) {
    const t = e, m = O(null), f = (c) => c ? `${c}px` : void 0, k = b(() => ({
      minWidth: f(t.minWidth),
      maxWidth: f(t.maxWidth),
      maxHeight: f(t.maxHeight),
      height: f(t.height)
    })), $ = O({ w: 0, h: 0 }), T = O(t.anchor ? t.anchor.getBoundingClientRect() : null), I = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), U = (c) => ({
      left: Math.max(0, c.left),
      top: Math.max(0, c.top),
      right: Math.min(window.innerWidth, c.right),
      bottom: Math.min(window.innerHeight, c.bottom)
    }), D = (c) => {
      const A = c.closest(".pane, .float-window");
      return A ? U(A.getBoundingClientRect()) : I();
    }, B = (c, A) => `${Math.max(0, c ? Math.min(c, A) : A)}px`;
    function P(c, A) {
      return {
        below: c.bottom - A.bottom - t.gap - ge,
        above: A.top - c.top - t.gap - ge,
        across: c.right - c.left - 2 * ge
      };
    }
    function j(c) {
      const A = D(t.anchor), R = P(A, c);
      return $.value.w <= R.across && $.value.h <= Math.max(R.below, R.above) ? A : I();
    }
    const L = b(() => {
      if (!T.value) return k.value;
      const c = T.value, A = j(c), R = P(A, c), { w: Y, h: le } = $.value, ve = t.align === "auto" ? c.left + c.right > A.left + A.right : t.align === "right", re = la(ve ? c.right - Y : c.left, A.left + ge, Math.max(A.left + ge, A.right - Y - ge)), d = le > R.below && R.above > R.below ? { bottom: `${window.innerHeight - c.top + t.gap}px`, maxHeight: B(t.maxHeight, R.above) } : { top: `${c.bottom + t.gap}px`, maxHeight: B(t.maxHeight, R.below) };
      return { ...k.value, ...d, left: `${re}px`, maxWidth: B(t.maxWidth, R.across) };
    }), E = o, J = () => [...m.value.querySelectorAll("button:not(:disabled)")];
    function q(c) {
      const A = J(), R = A.indexOf(document.activeElement);
      A[(R + c + A.length) % A.length].focus();
    }
    const G = { ArrowDown: () => q(1), ArrowUp: () => q(-1), Escape: () => E("close") }, Q = (c) => G[c.key] && (c.preventDefault(), G[c.key]()), x = () => m.value && ($.value = { w: m.value.offsetWidth, h: m.value.scrollHeight });
    let r = 0;
    const Z = new ResizeObserver(() => {
      cancelAnimationFrame(r), r = requestAnimationFrame(x);
    });
    ra(m, (c) => t.anchor && !t.anchor.contains(c.target) && E("close"));
    const M = (c, A) => ["top", "left", "right", "bottom"].some((R) => Math.abs(c[R] - A[R]) > 1), n = (c) => c.bottom < 0 || c.top > window.innerHeight;
    let s = 0;
    function N() {
      if (t.anchor) {
        const c = t.anchor.getBoundingClientRect();
        if (!t.anchor.isConnected || n(c)) return E("close");
        M(c, T.value) && (T.value = c);
      }
      s = requestAnimationFrame(N);
    }
    return Ke(() => {
      t.anchor && m.value && oa(m.value, t.anchor), x(), m.value && Z.observe(m.value), !t.plain && J()[0] && J()[0].focus(), N();
    }), we(() => {
      Z.disconnect(), cancelAnimationFrame(s), cancelAnimationFrame(r);
    }), u({ element: m }), (c, A) => (a(), F(Je, {
      to: "body",
      disabled: !e.anchor
    }, [
      v("div", Ze({
        ref_key: "panel",
        ref: m
      }, c.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: L.value,
        onKeydown: Q
      }), [
        Me(c.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), ua = /* @__PURE__ */ te(ia, [["__scopeId", "data-v-fcef04d0"]]);
async function da(e, u, o) {
  if (!e) return o(u);
  const { target: t, fields: m } = e, f = Object.fromEntries(Object.keys(m).map((T) => [T, t[T]])), k = () => Object.assign(t, f);
  Object.assign(t, m);
  let $ = !1;
  try {
    const T = await o(u);
    return $ = T.ok, T;
  } finally {
    $ || k();
  }
}
function ca(e, u, o, { groups: t, programs: m }) {
  const f = O({}), k = O(""), $ = O(!1), T = b(() => !!e.value && !e.value.ended_at), I = b(() => T.value && !!e.value.paused_at);
  async function U(j, L = null) {
    k.value = "";
    const E = await da(L, j, u);
    return k.value = E.ok ? "" : E.error, o(), E;
  }
  return { groups: t, programs: m, chosen: f, failure: k, asking: $, running: T, paused: I, choose: (j, L) => U(["agent", "control", String(e.value.id), j, L.value], { target: f, fields: { value: { ...f.value, [j]: L.label } } }), stop: () => ($.value = !1, U(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (j) => U(["agent", "launch", j.name]) };
}
function va(e) {
  if (!e) return "Not compacted yet";
  const u = new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" });
  return e.start_percent === null ? `Last compacted ${u}` : e.end_percent === null ? `Last compacted ${u}, from ${e.start_percent}%` : `Last compacted ${u}, from ${e.start_percent}% to ${e.end_percent}%, ${e.start_percent - e.end_percent}% taken off`;
}
const pa = ["disabled", "title"], ga = ["title"], ma = { class: "gauge usage" }, ha = ["disabled", "title"], fa = { class: "gauge" }, ka = ["disabled", "title"], ya = ["disabled"], ba = ["disabled"], wa = {
  key: 5,
  class: "fact",
  "data-fact": "uptime",
  title: "How long this session has run"
}, Ma = {
  key: 6,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, $a = ["title"], xa = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Ca = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Sa = { class: "gauge" }, Aa = { class: "context-used" }, ja = 75, Ta = {
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
  setup(e, { emit: u }) {
    const o = e, t = u, m = ca(Te(o, "agent"), o.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => t("changed"), { groups: Te(o, "controlGroups"), programs: Te(o, "agentPrograms") }), f = O(null), k = O(""), $ = b(() => m.groups.value.find((x) => x.key === k.value));
    function T(x, r) {
      f.value = x.currentTarget, k.value = r;
    }
    function I() {
      f.value = null, k.value = "", m.asking.value = !1;
    }
    const U = b(() => o.skills.filter((x) => x.state === "loaded"));
    function D(x) {
      T(x, "skills"), t("skills");
    }
    const B = (x) => m.groups.value.some((r) => r.key === x), P = b(() => {
      var x;
      return m.chosen.value.model ?? ((x = L.value) == null ? void 0 : x.model) ?? "";
    }), j = b(() => {
      var x;
      return m.chosen.value.effort ?? ((x = L.value) == null ? void 0 : x.effort) ?? "";
    });
    b(() => !!o.agent && !o.agent.ended_at);
    const L = b(() => {
      var x;
      return ((x = o.usage.agents) == null ? void 0 : x.find((r) => {
        var Z;
        return r.id === ((Z = o.agent) == null ? void 0 : Z.id);
      })) ?? null;
    }), E = b(() => {
      var x;
      return ((x = o.usage.windows) == null ? void 0 : x[0]) ?? null;
    }), J = b(() => E.value ? Math.max(0, Math.min(100, Math.round(E.value.used_percent))) : null), q = b(() => {
      var x;
      return ((x = L.value) == null ? void 0 : x.context_percent) == null ? null : Math.round(L.value.context_percent);
    }), G = b(() => {
      var x;
      return (x = L.value) != null && x.cost_dollars ? `$${L.value.cost_dollars.toFixed(2)}` : "";
    }), Q = b(() => {
      var Z;
      const x = (Z = o.agent) != null && Z.process_started_at ? new Date(o.agent.process_started_at).getTime() : 0;
      if (!x) return "";
      const r = Math.max(0, Math.floor((o.now - x) / 6e4));
      return r >= 60 ? `${Math.floor(r / 60)}h ${r % 60}m` : `${r}m`;
    });
    return (x, r) => {
      var Z;
      return a(), l("div", {
        class: se(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (a(), l(H, { key: 0 }, [
          v("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: r[0] || (r[0] = (M) => T(M, "agent"))
          }, [
            w(ae, {
              name: "agents",
              size: 12
            }),
            g(" " + p(((Z = e.agentPrograms.find((M) => M.name === e.agent.program)) == null ? void 0 : Z.title) || e.agent.program), 1)
          ], 8, pa),
          J.value !== null ? (a(), l("button", {
            key: 0,
            type: "button",
            class: "fact",
            "data-fact": "usage",
            title: `${J.value}% of the plan's ${E.value.title} allowance used`,
            onClick: r[1] || (r[1] = (M) => t("open", "usage", M.currentTarget))
          }, [
            w(ae, {
              name: "allowance",
              size: 12
            }),
            r[14] || (r[14] = g()),
            v("span", ma, [
              v("span", {
                style: he({ width: `${J.value}%` })
              }, null, 4)
            ]),
            g(" " + p(J.value) + "% ", 1)
          ], 8, ga)) : h("", !0),
          q.value !== null ? (a(), l("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${q.value}% full: clear or compact it`,
            onClick: r[2] || (r[2] = (M) => B("context") ? T(M, "context") : t("open", "context", M.currentTarget))
          }, [
            w(ae, {
              name: "gauge",
              size: 12
            }),
            r[15] || (r[15] = g()),
            v("span", fa, [
              v("span", {
                style: he({ width: `${q.value}%` })
              }, null, 4)
            ]),
            g(" " + p(q.value) + "% ", 1)
          ], 8, ha)) : h("", !0),
          P.value ? (a(), l("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${P.value}: change the model`,
            onClick: r[3] || (r[3] = (M) => B("model") ? T(M, "model") : null)
          }, [
            w(ae, {
              name: "model",
              size: 12
            }),
            g(" " + p(P.value), 1)
          ], 8, ka)) : h("", !0),
          B("effort") || e.card && j.value ? (a(), l("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: r[4] || (r[4] = (M) => T(M, "effort"))
          }, [
            w(ae, {
              name: "bolt",
              size: 12
            }),
            g(" " + p(j.value), 1)
          ], 8, ya)) : h("", !0),
          G.value ? (a(), l("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: r[5] || (r[5] = (M) => t("open", "cost", M.currentTarget))
          }, p(G.value), 9, ba)) : h("", !0),
          Q.value ? (a(), l("span", wa, [
            w(ae, {
              name: "reminders",
              size: 12
            }),
            g(" " + p(Q.value), 1)
          ])) : h("", !0),
          e.branch ? (a(), l("span", Ma, [
            w(ae, {
              name: "branch",
              size: 12
            }),
            g(" " + p(e.branch), 1)
          ])) : h("", !0),
          e.card ? h("", !0) : (a(), l("button", {
            key: 7,
            type: "button",
            class: se(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: r[6] || (r[6] = (M) => t("open", "jobs", M.currentTarget))
          }, [
            w(ae, {
              name: "clock",
              size: 12
            }),
            g(" " + p(e.jobs), 1)
          ], 2)),
          e.run ? (a(), l("button", {
            key: 8,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: D
          }, [
            w(ae, {
              name: "book",
              size: 12
            }),
            g(" " + p(U.value.length), 1)
          ])) : h("", !0),
          e.fitness ? (a(), l(H, { key: 9 }, [
            v("button", {
              type: "button",
              class: se(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < ja }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: r[7] || (r[7] = (M) => t("open", "fitness", M.currentTarget))
            }, [
              w(ae, {
                name: "heart",
                size: 12
              }),
              g(" " + p(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            v("button", {
              type: "button",
              class: se(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: r[8] || (r[8] = (M) => t("open", "load", M.currentTarget))
            }, [
              w(ae, {
                name: "weight",
                size: 12
              }),
              g(" " + p(e.fitness.workload), 1)
            ], 2)
          ], 64)) : h("", !0)
        ], 64)) : e.run && !e.loading ? (a(), l("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: r[9] || (r[9] = (M) => T(M, "start"))
        }, [
          w(ae, {
            name: "agents",
            size: 12
          }),
          r[16] || (r[16] = g(" Start an agent", -1))
        ])) : h("", !0),
        r[22] || (r[22] = v("span", { class: "space" }, null, -1)),
        i(m).failure.value ? (a(), l("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: i(m).failure.value
        }, p(i(m).failure.value), 9, $a)) : h("", !0),
        Me(x.$slots, "default", {}, void 0, !0),
        f.value ? (a(), F(ua, {
          key: 3,
          anchor: f.value,
          "min-width": 190,
          onClose: I
        }, {
          default: S(() => {
            var M;
            return [
              k.value === "agent" ? (a(), l(H, { key: 0 }, [
                i(m).asking.value ? (a(), l(H, { key: 0 }, [
                  w(be, { "data-agent-stop-ask": "" }, {
                    default: S(() => [...r[17] || (r[17] = [
                      g("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  w(me, {
                    "data-agent-stop-confirm": "",
                    onClick: r[10] || (r[10] = (n) => (I(), i(m).stop()))
                  }, {
                    default: S(() => [...r[18] || (r[18] = [
                      g("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  w(me, {
                    onClick: r[11] || (r[11] = (n) => i(m).asking.value = !1)
                  }, {
                    default: S(() => [...r[19] || (r[19] = [
                      g("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (a(), F(me, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: r[12] || (r[12] = (n) => i(m).asking.value = !0)
                }, {
                  default: S(() => [...r[20] || (r[20] = [
                    g("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : k.value === "start" ? (a(), l(H, { key: 1 }, [
                w(be, null, {
                  default: S(() => [...r[21] || (r[21] = [
                    g("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (a(!0), l(H, null, X(i(m).programs.value, (n) => (a(), F(me, {
                  key: n.name,
                  "data-agent-program": n.name,
                  onClick: (s) => (I(), i(m).start(n))
                }, {
                  default: S(() => [
                    g(p(n.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : k.value === "skills" ? (a(), F(na, {
                key: 2,
                skills: e.skills,
                onBrowse: r[13] || (r[13] = (n) => (I(), t("open", "skills", null)))
              }, null, 8, ["skills"])) : $.value ? (a(), l(H, { key: 3 }, [
                w(be, null, {
                  default: S(() => [
                    g(p($.value.label), 1)
                  ]),
                  _: 1
                }),
                k.value === "context" ? (a(), l(H, { key: 0 }, [
                  v("p", xa, p(i(va)(((M = L.value) == null ? void 0 : M.last_compaction) ?? null)), 1),
                  v("div", Ca, [
                    v("span", Sa, [
                      v("span", {
                        style: he({ width: `${q.value}%` })
                      }, null, 4)
                    ]),
                    v("span", Aa, p(q.value) + "%", 1)
                  ])
                ], 64)) : h("", !0),
                (a(!0), l(H, null, X($.value.choices, (n) => (a(), F(me, {
                  key: n.value,
                  "data-agent-choice": n.value,
                  onClick: (s) => (i(m).choose($.value.key, n), I())
                }, {
                  default: S(() => [
                    g(p(n.label), 1)
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
}, Ra = /* @__PURE__ */ te(Ta, [["__scopeId", "data-v-87c7cbf9"]]), Oa = ["data-agent-open", "aria-expanded", "role", "tabindex"], za = { class: "agent-head" }, Ba = ["data-state"], Va = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, La = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Ha = { class: "agent-times" }, Ia = {
  key: 0,
  class: "agent-time",
  "data-agent-motion": ""
}, Ea = {
  key: 1,
  class: "agent-time",
  "data-agent-motion": ""
}, Na = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": ""
}, qa = {
  key: 3,
  class: "agent-time",
  "data-agent-motion": ""
}, Wa = {
  key: 4,
  class: "agent-list-pace",
  "data-agent-list-pace": ""
}, Fa = { class: "agent-line" }, Pa = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Da = {
  key: 0,
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, Ua = {
  key: 1,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Ka = {
  key: 1,
  class: "agent-line agent-work-start"
}, Ja = ["title"], Za = { class: "agent-job-title" }, Ga = ["data-peek"], Ya = ["data-agent-waiting", "data-agent-stopped"], Qa = {
  key: 2,
  class: "agent-line agent-work-status",
  "data-agent-blocked-tasks": ""
}, Xa = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: u }) {
    const o = { helper: "Helper", reviewer: "Reviewer" }, t = e, m = u, f = Ie(), k = b(() => {
      var s, N;
      if ((s = t.facts) != null && s.profile_title) return t.facts.profile_title;
      if ((N = t.facts) != null && N.profile) return t.facts.profile;
      const n = o[t.row.role] || t.row.role;
      return n.slice(0, 1).toUpperCase() + n.slice(1);
    }), $ = b(() => {
      var n;
      return ((n = t.facts) == null ? void 0 : n.tasks) ?? [];
    }), T = b(() => $.value.filter((n) => n.state === "open")), I = b(() => $.value.find((n) => {
      var s;
      return n.id === ((s = t.progress) == null ? void 0 : s.task_id) && n.state === "started";
    })), U = b(() => I.value || $.value.find((n) => {
      var s;
      return n.id === ((s = t.facts) == null ? void 0 : s.task_id);
    }) || T.value[0] || $.value.at(-1)), D = b(() => I.value ? $.value.filter((n) => n.state === "blocked") : []), B = b(() => {
      var n, s, N, c, A, R;
      return t.row.role === "helper" ? ((n = t.facts) == null ? void 0 : n.helper_job) || "" : (s = t.facts) != null && s.job_enabled && (((N = I.value) == null ? void 0 : N.title) || ((c = t.facts) == null ? void 0 : c.task_title) || ((A = T.value[0]) == null ? void 0 : A.title) || ((R = $.value.at(-1)) == null ? void 0 : R.title)) || "";
    }), P = b(() => {
      var n;
      return (n = t.facts) != null && n.job_enabled ? `${t.row.role} ${t.row.id}` : "";
    }), j = b(() => {
      var n, s;
      return [t.row.program, (n = t.facts) == null ? void 0 : n.model, (s = t.facts) == null ? void 0 : s.effort, P.value].filter(Boolean).join(" · ");
    }), L = $e(), E = b(() => Ee(t.row.process_started_at || t.row.created_at, f.value)), J = /* @__PURE__ */ new Set(["open", "started", "testing"]), q = b(() => {
      var n;
      return (n = t.facts) == null ? void 0 : n.work_status;
    }), G = b(() => !!t.row.ended_at && t.row.role !== "main" && $.value.some((n) => J.has(n.state))), Q = b(() => {
      var n;
      return t.row.retired_at || t.row.state === "retired" ? "retired" : q.value || t.waitReason || G.value ? "waiting" : t.row.state === "running" && ((n = t.facts) == null ? void 0 : n.state) || t.row.state;
    }), x = b(() => {
      var n;
      return q.value ? `Status: ${q.value}` : t.waitReason ? `Waiting: ${t.waitReason}` : Q.value === "blocked" ? (n = t.facts) != null && n.blocked_reason ? `Blocked: ${t.facts.blocked_reason}` : "Blocked" : G.value ? "Stopped with work left" : "";
    }), r = b(() => {
      var n;
      return ((n = t.progress) == null ? void 0 : n.completed_count) ?? $.value.filter((s) => s.state === "completed").length;
    }), Z = b(() => {
      var s;
      const n = lt(r.value, ((s = t.progress) == null ? void 0 : s.started_at) || t.row.created_at, t.progress ? t.progress.finished_at : t.row.ended_at, f.value);
      return t.row.role !== "main" && n ? `${n} per hour` : "";
    }), M = b(() => !!t.row.retired_at || t.row.state === "retired");
    return (n, s) => {
      var N, c, A, R;
      return a(), l("div", {
        class: se(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: s[3] || (s[3] = (Y) => !e.open && m("toggle")),
        onKeydown: [
          s[4] || (s[4] = ze(ne((Y) => !e.open && m("toggle"), ["self", "prevent"]), ["enter"])),
          s[5] || (s[5] = ze(ne((Y) => !e.open && m("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        v("span", za, [
          e.open ? (a(), l("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: s[0] || (s[0] = ne((Y) => m("toggle"), ["stop"]))
          }, [
            w(i(fe), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : h("", !0),
          v("span", {
            class: "agent-dot",
            "data-state": Q.value,
            "data-agent-motion": ""
          }, null, 8, Ba),
          v("span", Va, p(k.value), 1),
          v("span", La, p(((N = e.facts) == null ? void 0 : N.given_name) || e.row.id), 1),
          e.open ? h("", !0) : (a(), F(i(fe), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          v("span", Ha, [
            M.value ? (a(), l("span", Ia, [
              s[6] || (s[6] = g("Retired, ", -1)),
              w(i(ye), {
                at: e.row.retired_at
              }, null, 8, ["at"])
            ])) : e.row.ended_at && q.value ? (a(), l("span", Ea, [
              s[7] || (s[7] = g("Process ended: ", -1)),
              w(i(ye), {
                at: e.row.ended_at
              }, null, 8, ["at"])
            ])) : e.row.ended_at ? (a(), l("span", Na, [
              s[8] || (s[8] = g("Idle, ", -1)),
              w(i(ye), {
                at: e.row.ended_at
              }, null, 8, ["at"])
            ])) : (a(), l("span", qa, p(E.value), 1)),
            !e.open && e.row.role === "worker" && Z.value ? (a(), l("span", Wa, p(Z.value), 1)) : h("", !0)
          ])
        ]),
        v("span", Fa, [
          v("span", Pa, p(j.value), 1),
          e.open ? (a(), l("span", Da, [
            w(i(fe), {
              name: "time",
              size: 12
            }),
            s[9] || (s[9] = g("First started: ", -1)),
            w(i(ye), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : h("", !0),
          e.open && ((c = e.facts) != null && c.last_activity) ? (a(), l("span", Ua, [
            s[10] || (s[10] = g("Last heard: ", -1)),
            w(i(ye), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : h("", !0)
        ]),
        e.open ? (a(), F(Ra, {
          key: 0,
          "agent-programs": i(L).props.programs.rows.value,
          agent: e.row,
          branch: (A = e.progress) == null ? void 0 : A.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: [] },
          card: ""
        }, {
          default: S(() => [
            w(Kt, { row: e.row }, null, 8, ["row"]),
            e.row.role === "helper" && !e.row.ended_at ? (a(), F(i(ee), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: s[1] || (s[1] = ne((Y) => i(L).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: S(() => [...s[11] || (s[11] = [
                g("Stop", -1)
              ])]),
              _: 1
            })) : h("", !0)
          ]),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : h("", !0),
        !e.open && (B.value || x.value) ? (a(), l("span", Ka, [
          v("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: B.value
          }, [
            v("span", Za, p(B.value), 1),
            B.value && e.row.role !== "helper" && ((R = U.value) != null && R.plan_id) ? (a(), l("button", {
              key: 0,
              type: "button",
              class: "agent-plan",
              "data-agent-plan": "",
              "data-peek": `plans:${U.value.plan_id}`,
              onClick: s[2] || (s[2] = ne((Y) => i(je)(`plans:${U.value.plan_id}`), ["stop"]))
            }, "plan " + p(U.value.plan_id), 9, Ga)) : h("", !0)
          ], 8, Ja),
          x.value ? (a(), l("span", {
            key: 0,
            class: "agent-work-status",
            "data-agent-work-status": "",
            "data-agent-waiting": e.waitReason ? "" : null,
            "data-agent-stopped": G.value && !e.waitReason && !q.value ? "" : null
          }, p(x.value), 9, Ya)) : h("", !0)
        ])) : h("", !0),
        !e.open && D.value.length ? (a(), l("span", Qa, "Blocked: " + p(D.value.map((Y) => `task ${Y.id}`).join(", ")), 1)) : h("", !0),
        e.open ? (a(), F(Ot, {
          key: 3,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: $.value,
          "stopped-with-work": G.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : h("", !0)
      ], 42, Oa);
    };
  }
}, _a = /* @__PURE__ */ te(Xa, [["__scopeId", "data-v-0cdd34df"]]), en = ["data-edit-type"], tn = { key: 0 }, an = { class: "stepper" }, nn = ["disabled", "onClick"], ln = ["value", "disabled", "data-agent-limit-input", "onChange"], on = ["disabled", "onClick"], sn = { key: 0 }, rn = { key: 1 }, un = {
  __name: "AgentLimitEditor",
  props: { rows: { type: Array, required: !0 }, pending: Boolean, readOnly: Boolean, environment: { type: String, required: !0 } },
  emits: ["change"],
  setup(e, { emit: u }) {
    const o = u;
    return (t, m) => (a(), l(H, null, [
      m[0] || (m[0] = v("p", null, "How many agents of a type may run at once, and how many may be kept.", -1)),
      (a(!0), l(H, null, X(e.rows, (f) => (a(), l("div", {
        key: f.key,
        class: "edit-row",
        "data-edit-type": f.key
      }, [
        v("div", null, [
          v("strong", null, p(f.per_profile ? "Each helper type" : "Workers"), 1),
          f.per_profile ? (a(), l("small", tn, "Researcher, Planner and the others")) : h("", !0)
        ]),
        (a(!0), l(H, null, X([{ name: "Most running", value: f.run_limit, key: f.run_setting, source: f.run_source, kind: "run" }, { name: "Most kept", value: f.kept_limit, key: f.kept_setting, source: f.kept_source, kind: "kept" }], (k) => (a(), l("label", {
          key: k.key
        }, [
          g(p(k.name), 1),
          v("span", an, [
            v("button", {
              type: "button",
              disabled: e.pending || e.readOnly || k.value === 0,
              onClick: ($) => o("change", f, k.key, k.value, k.value - 1)
            }, "−", 8, nn),
            v("input", {
              type: "number",
              min: "0",
              value: k.value,
              disabled: e.pending || e.readOnly,
              "data-agent-limit-input": k.kind,
              onChange: ($) => o("change", f, k.key, k.value, $.target.value)
            }, null, 40, ln),
            v("button", {
              type: "button",
              disabled: e.pending || e.readOnly,
              onClick: ($) => o("change", f, k.key, k.value, k.value + 1)
            }, "+", 8, on)
          ]),
          k.value === 0 ? (a(), l("small", sn, p(k.kind === "run" ? "None can start" : "Any number"), 1)) : k.source === `environment ${e.environment}` ? (a(), l("small", rn, "Changed for " + p(e.environment), 1)) : h("", !0)
        ]))), 128))
      ], 8, en))), 128))
    ], 64));
  }
}, dn = /* @__PURE__ */ te(un, [["__scopeId", "data-v-16579b38"]]), cn = {
  key: 0,
  class: "badge",
  "data-agent-count-badge": ""
}, vn = { class: "counts" }, pn = ["data-count-agent"], gn = { class: "person-text" }, mn = {
  key: 0,
  class: "helper-head"
}, hn = ["data-agent-limit-type", "data-agent-limit-profile", "onClick"], fn = {
  key: 0,
  class: "bar"
}, kn = {
  key: 5,
  role: "alert"
}, yn = {
  key: 6,
  role: "status"
}, bn = { class: "foot-note" }, wn = {
  __name: "AgentLimits",
  emits: ["open-agent"],
  setup(e, { emit: u }) {
    const o = u, t = $e(), { rows: m, failure: f } = t.props.limits, k = O([]), $ = O(0), T = O(!1), I = Ie(), U = O(!1), D = O(null), B = O(!1), P = O(!1), j = O(""), L = O(""), E = O(null), J = O(""), q = b(() => m.value.flatMap((y) => y.per_profile ? y.profiles.filter((d) => d.kept).map((d) => ({ ...d, label: d.title, type: y.key, key: `${y.key}:${d.profile}` })) : [{ ...y, type: y.key }])), G = (y, d) => d > 0 && y >= d, Q = b(() => q.value.filter((y) => G(y.running, y.run_limit) || G(y.kept, y.kept_limit)).length), x = b(() => m.value.find((y) => y.per_profile)), r = b(() => q.value.find((y) => y.key === D.value)), Z = b(() => k.value.filter((y) => {
      var d, C;
      return y.state !== "retired" && y.role === ((d = r.value) == null ? void 0 : d.type) && (!r.value.profile || (((C = y.facts) == null ? void 0 : C.profile) || y.profile) === r.value.profile);
    }).sort((y, d) => (y.state !== "running") - (d.state !== "running") || String(y.ended_at || y.created_at).localeCompare(String(d.ended_at || d.created_at)))), M = b(() => {
      var d;
      const y = /* @__PURE__ */ new Map();
      for (const C of Z.value) {
        const K = ((d = C.facts) == null ? void 0 : d.model) || C.program_model;
        K && y.set(K, (y.get(K) || 0) + 1);
      }
      return [...y].map(([C, K]) => `${K} ${C}`).join(", ");
    }), n = (y, d) => d ? `${Math.min(y / Math.max(y, d) * 100, 100)}%` : "0%", s = (y, d) => d && y > d ? `${(y - d) / y * 100}%` : "0%", N = b(() => {
      var y;
      return B.value ? "Change the maximums" : ((y = r.value) == null ? void 0 : y.label) || "Agent counts";
    });
    async function c(y, d = 1) {
      t.state["count-agents.role"] = y.type, y.profile ? t.state["count-agents.profile"] = y.profile : delete t.state["count-agents.profile"], t.state["count-agents.page"] = String(d), await t.reload("count-agents");
      const C = t.props["count-agents"];
      k.value = d === 1 ? [...C.rows.value] : [...k.value, ...C.rows.value], $.value = d, T.value = C.more.value;
    }
    function A(y) {
      D.value = y.key, k.value = [], c(y);
    }
    function R() {
      B.value = !1, D.value = null, E.value = null, j.value = "";
    }
    function Y() {
      U.value = !1, R();
    }
    async function le(y, d, C, K) {
      if (P.value || t.readOnly) return;
      const ie = Number(K);
      if (!String(K).trim() || !Number.isInteger(ie) || ie < 0) {
        j.value = "Use a whole number of 0 or more.";
        return;
      }
      P.value = !0, j.value = "";
      const ce = await t.run(["setting", "set", d, String(ie), "--environment", t.environment]);
      ce.ok ? (await t.reload("limits"), L.value = "Saved.") : j.value = ce.error, P.value = !1;
    }
    async function ve(y) {
      if (!J.value.trim() || P.value) return;
      P.value = !0;
      const d = await t.run(["agent", "retire", String(y.id), "--reason", J.value.trim()]);
      j.value = d.ok ? "" : "The agent could not be retired. Try again.", d.ok && (E.value = null, J.value = "", L.value = "Agent retired permanently.", await t.reload("limits"), await c(r.value)), P.value = !1;
    }
    function re(y) {
      Y(), o("open-agent", y);
    }
    return (y, d) => (a(), l(H, null, [
      v("button", {
        class: "counts-button",
        type: "button",
        title: "Agent counts",
        "aria-label": "Agent counts",
        "data-agent-counts": "",
        onClick: d[0] || (d[0] = (C) => U.value = !0)
      }, [
        w(i(fe), {
          name: "settings",
          size: 16
        }),
        Q.value ? (a(), l("span", cn, p(Q.value), 1)) : h("", !0)
      ]),
      U.value ? (a(), F(i(ot), {
        key: 0,
        title: N.value,
        modal: "",
        fits: "",
        onClose: Y,
        onEscape: Y
      }, {
        foot: S(() => [
          B.value ? (a(), l(H, { key: 0 }, [
            v("span", bn, p(L.value || `Changes apply to ${i(t).environment}.`), 1),
            w(i(ee), { onClick: R }, {
              default: S(() => [...d[19] || (d[19] = [
                g("Done", -1)
              ])]),
              _: 1
            })
          ], 64)) : r.value ? h("", !0) : (a(), F(i(ee), {
            key: 1,
            disabled: i(t).readOnly,
            "data-agent-limits-edit": "",
            onClick: d[5] || (d[5] = (C) => B.value = !0)
          }, {
            default: S(() => [...d[20] || (d[20] = [
              g("Change the maximums", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]))
        ]),
        default: S(() => [
          v("div", vn, [
            B.value || r.value ? (a(), l("button", {
              key: 0,
              class: "back",
              type: "button",
              onClick: R
            }, "‹ Back to the counts")) : h("", !0),
            i(f) ? (a(), l(H, { key: 1 }, [
              d[7] || (d[7] = v("strong", null, "The counts could not be read", -1)),
              d[8] || (d[8] = v("p", null, "The journal did not answer.", -1)),
              w(i(ee), {
                small: "",
                onClick: d[1] || (d[1] = (C) => i(t).reload("limits"))
              }, {
                default: S(() => [...d[6] || (d[6] = [
                  g("Try again", -1)
                ])]),
                _: 1
              })
            ], 64)) : B.value ? (a(), F(dn, {
              key: 2,
              rows: i(m),
              pending: P.value,
              "read-only": i(t).readOnly,
              environment: i(t).environment,
              onChange: le
            }, null, 8, ["rows", "pending", "read-only", "environment"])) : r.value ? (a(), l(H, { key: 3 }, [
              v("p", null, [
                v("strong", null, p(r.value.running) + " of " + p(r.value.run_limit), 1),
                d[9] || (d[9] = g(" running, ", -1)),
                v("strong", null, [
                  g(p(r.value.kept), 1),
                  r.value.kept_limit ? (a(), l(H, { key: 0 }, [
                    g(" of " + p(r.value.kept_limit), 1)
                  ], 64)) : h("", !0)
                ]),
                d[10] || (d[10] = g(" kept", -1))
              ]),
              v("p", null, p(M.value), 1),
              Z.value.length ? h("", !0) : (a(), l(H, { key: 0 }, [
                d[11] || (d[11] = v("strong", null, "No agents here yet", -1)),
                d[12] || (d[12] = v("p", null, "An agent shows here as soon as one of this type starts.", -1))
              ], 64)),
              (a(!0), l(H, null, X(Z.value, (C) => {
                var K, ie, ce, ke, V;
                return a(), l("div", {
                  key: C.id,
                  class: "person",
                  "data-count-agent": C.id
                }, [
                  v("span", {
                    class: se(["dot", { running: C.state === "running" }])
                  }, null, 2),
                  v("div", gn, [
                    v("strong", null, p(((K = C.facts) == null ? void 0 : K.given_name) || C.id), 1),
                    g(" " + p(C.state === "running" ? "Running" : "Idle") + ", " + p(i(Ee)(C.state === "running" ? C.process_started_at || C.created_at : C.ended_at, i(I))), 1),
                    v("small", null, p([C.program, (ie = C.facts) == null ? void 0 : ie.model, (ce = C.facts) == null ? void 0 : ce.effort, `${C.role} ${C.id}`].filter(Boolean).join(", ")), 1),
                    v("small", null, p(((ke = C.facts) == null ? void 0 : ke.task_title) || ((V = C.facts) == null ? void 0 : V.helper_job)), 1)
                  ]),
                  w(i(ee), {
                    small: "",
                    onClick: (W) => re(C)
                  }, {
                    default: S(() => [...d[13] || (d[13] = [
                      g("Open", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"]),
                  C.state === "idle" && !i(t).readOnly ? (a(), F(i(ee), {
                    key: 0,
                    small: "",
                    onClick: (W) => {
                      E.value = C.id, J.value = "";
                    }
                  }, {
                    default: S(() => [...d[14] || (d[14] = [
                      g("Retire", -1)
                    ])]),
                    _: 1
                  }, 8, ["onClick"])) : h("", !0),
                  E.value === C.id ? (a(), F(Ne, {
                    key: 1,
                    reason: J.value,
                    "onUpdate:reason": d[2] || (d[2] = (W) => J.value = W),
                    pending: P.value,
                    onSubmit: (W) => ve(C),
                    onCancel: d[3] || (d[3] = (W) => E.value = null)
                  }, null, 8, ["reason", "pending", "onSubmit"])) : h("", !0)
                ], 8, pn);
              }), 128)),
              T.value ? (a(), F(i(ee), {
                key: 1,
                small: "",
                onClick: d[4] || (d[4] = (C) => c(r.value, $.value + 1))
              }, {
                default: S(() => [...d[15] || (d[15] = [
                  g("Show more", -1)
                ])]),
                _: 1
              })) : h("", !0)
            ], 64)) : (a(), l(H, { key: 4 }, [
              d[17] || (d[17] = v("p", null, "Kept agents have not been retired, so they can take another job. Open an item to see them.", -1)),
              d[18] || (d[18] = v("div", { class: "columns" }, [
                v("span", null, "Name"),
                v("span", null, "Running"),
                v("span", null, "Kept"),
                v("span")
              ], -1)),
              x.value ? (a(), l("div", mn, [
                d[16] || (d[16] = v("strong", null, "Helpers", -1)),
                v("span", null, p(x.value.running) + " running, " + p(x.value.kept) + " kept", 1)
              ])) : h("", !0),
              (a(!0), l(H, null, X(q.value, (C) => (a(), l("button", {
                key: C.key,
                type: "button",
                class: "count-row",
                "data-agent-limit-type": C.type || C.key,
                "data-agent-limit-profile": C.profile,
                onClick: (K) => A(C)
              }, [
                v("strong", null, p(C.label), 1),
                (a(!0), l(H, null, X([{ count: C.running, limit: C.run_limit, unlimited: !1 }, { count: C.kept, limit: C.kept_limit, unlimited: !0 }], (K) => (a(), l("span", {
                  key: K.unlimited,
                  class: se({ full: G(K.count, K.limit) })
                }, [
                  v("span", null, [
                    g(p(K.count), 1),
                    K.limit || !K.unlimited ? (a(), l(H, { key: 0 }, [
                      g(" of " + p(K.limit), 1)
                    ], 64)) : h("", !0)
                  ]),
                  K.limit ? (a(), l("span", fn, [
                    v("span", {
                      style: he({ width: n(K.count, K.limit) })
                    }, null, 4),
                    v("i", {
                      style: he({ width: s(K.count, K.limit) })
                    }, null, 4)
                  ])) : h("", !0)
                ], 2))), 128)),
                w(i(fe), {
                  name: "chevronRight",
                  size: 12
                })
              ], 8, hn))), 128))
            ], 64)),
            j.value ? (a(), l("p", kn, p(j.value), 1)) : L.value ? (a(), l("p", yn, p(L.value), 1)) : h("", !0)
          ])
        ]),
        _: 1
      }, 8, ["title"])) : h("", !0)
    ], 64));
  }
}, Mn = /* @__PURE__ */ te(wn, [["__scopeId", "data-v-cfaaa340"]]), $n = {
  key: 0,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, xn = ["data-agent-row"], Ve = "journal.agents.filters", Ae = "cubic-bezier(0.2, 0.9, 0.25, 1)", Cn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const u = e, o = $e(), { rows: t } = o.props.waits, { rows: m } = o.props.progress, { rows: f, failure: k, loaded: $, more: T } = o.props.agents, I = (V) => m.value.find((W) => W.agent_id === V.id) ?? null, U = (V) => {
      var W;
      return ((W = t.value.find((z) => z.agent_id === V.id)) == null ? void 0 : W.reason) ?? "";
    }, D = O("running"), B = O(""), P = JSON.parse(localStorage.getItem(Ve) || '{"roles":[],"profiles":[],"programs":[]}'), j = O(P), L = b(() => o.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: E } = o.props.programs, J = b(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), q = (V, W) => {
      j.value = ut(j.value, V, W);
    }, G = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, Q = (V) => V.slice(0, 1).toUpperCase() + V.slice(1);
    de(j, (V) => localStorage.setItem(Ve, JSON.stringify(V)));
    const x = O(25);
    function r() {
      Object.assign(o.state, {
        "agents.show": D.value,
        "agents.search": B.value,
        "agents.limit": String(x.value),
        "agents.roles": j.value.roles.join(","),
        "agents.profiles": j.value.profiles.join(","),
        "agents.programs": j.value.programs.join(",")
      });
    }
    async function Z() {
      return x.value += 25, r(), await o.reload("agents"), !0;
    }
    de([D, B, j], () => {
      x.value = 25, r(), o.reload("agents");
    }), r();
    const M = (V) => V.facts ?? null, n = f, s = b(() => !!B.value.trim() || J.value > 0), N = b(() => u.texts[D.value] ?? { title: u.empty, hint: "" }), c = O(null), A = O(null), R = O(null), Y = O(null), le = b(() => c.value === null ? null : o.props[`card.${c.value}`].rows.value.find((V) => V.id === c.value) ?? A.value), ve = b(() => le.value ? [le.value] : n.value), re = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let y = !1, d = 0;
    async function C(V) {
      if (y) return;
      y = !0, d = Y.value.scrollTop;
      const W = R.value.querySelector(`[data-agent-open="${V.id}"]`);
      if (!re()) {
        const ue = [...R.value.querySelectorAll(".agent-row")].filter((oe) => !oe.contains(W));
        await Promise.all(ue.map((oe) => oe.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const z = [...W.querySelectorAll(".agent-head, .agent-line")], _ = [...z, ...W.querySelectorAll("[data-agent-motion]")], xe = _.map((ue) => ue.getBoundingClientRect());
      if (A.value = V, c.value = V.id, o.reload(`card.${V.id}`), await Be(), !re()) {
        const ue = _.map((oe) => oe.getBoundingClientRect());
        _.forEach((oe, Ce) => {
          const pe = z.indexOf(oe.parentElement), We = xe[Ce].left - ue[Ce].left - (pe < 0 ? 0 : xe[pe].left - ue[pe].left), Fe = xe[Ce].top - ue[Ce].top - (pe < 0 ? 0 : xe[pe].top - ue[pe].top);
          oe.animate([{ transform: `translate(${We}px, ${Fe}px)` }, { transform: "none" }], { duration: 280, easing: Ae });
        }), R.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((oe) => {
          oe.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Ae, fill: "backwards" });
        });
      }
      y = !1;
    }
    async function K() {
      if (y || !le.value) return;
      y = !0;
      const V = R.value.querySelector(`[data-agent-open="${c.value}"]`), W = [...V.children], z = re() ? [] : W.map((_) => _.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(z.map((_) => _.finished)), c.value = null, await Be(), Y.value.scrollTop = d, z.forEach((_) => _.cancel()), re() || (V.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Ae }), R.value.querySelectorAll(".agent-row").forEach((_) => {
        _.contains(V) || _.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Ae });
      })), y = !1;
    }
    function ie(V) {
      A.value = V, c.value = V.id, o.reload(`card.${V.id}`);
    }
    const ce = (V) => c.value === V.id ? K() : C(V);
    de(B, (V) => V.trim() && (c.value = null)), de(D, () => {
      c.value = null;
    });
    const ke = (V) => {
      V.key === "Escape" && K();
    };
    return window.addEventListener("keydown", ke), we(() => window.removeEventListener("keydown", ke)), (V, W) => (a(), l("div", {
      ref_key: "agents",
      ref: R,
      class: se(["agents", { focused: le.value }])
    }, [
      w(i(st), {
        modelValue: B.value,
        "onUpdate:modelValue": W[1] || (W[1] = (z) => B.value = z),
        placeholder: "Search agents",
        "menu-count": J.value,
        "data-agents-search": ""
      }, {
        menu: S(() => [
          w(i(Re), null, {
            default: S(() => [...W[2] || (W[2] = [
              g("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), l(H, null, X(L.value.roles, (z) => (a(), F(i(Se), {
            key: z,
            role: "menuitemcheckbox",
            "aria-checked": j.value.roles.includes(z),
            checked: j.value.roles.includes(z),
            "data-filter-role": z,
            onClick: (_) => q("roles", z)
          }, {
            default: S(() => [
              g(p(Q(z)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          L.value.profiles.length ? (a(), F(i(Re), { key: 0 }, {
            default: S(() => [...W[3] || (W[3] = [
              g("Profile", -1)
            ])]),
            _: 1
          })) : h("", !0),
          (a(!0), l(H, null, X(L.value.profiles, (z) => (a(), F(i(Se), {
            key: z.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.profiles.includes(z.name),
            checked: j.value.profiles.includes(z.name),
            "data-filter-profile": z.name,
            onClick: (_) => q("profiles", z.name)
          }, {
            default: S(() => [
              g(p(z.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          w(i(Re), null, {
            default: S(() => [...W[4] || (W[4] = [
              g("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), l(H, null, X(i(E), (z) => (a(), F(i(Se), {
            key: z.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.programs.includes(z.name),
            checked: j.value.programs.includes(z.name),
            "data-filter-program": z.name,
            onClick: (_) => q("programs", z.name)
          }, {
            default: S(() => [
              g(p(z.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          J.value ? (a(), F(i(Se), {
            key: 1,
            "data-filter-clear": "",
            onClick: G
          }, {
            default: S(() => [...W[5] || (W[5] = [
              g("Clear filters", -1)
            ])]),
            _: 1
          })) : h("", !0)
        ]),
        default: S(() => [
          w(i(rt), {
            options: L.value.states,
            value: D.value,
            onPick: W[0] || (W[0] = (z) => D.value = z)
          }, null, 8, ["options", "value"]),
          w(Mn, { onOpenAgent: ie })
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"]),
      D.value === "retired" && L.value.upgrade_retired ? (a(), l("p", $n, "Retired during the upgrade: " + p(L.value.upgrade_retired), 1)) : h("", !0),
      v("div", {
        ref_key: "list",
        ref: Y,
        class: se(["agents-view", { "agents-view-open": le.value }])
      }, [
        i($) && !i(k) && !ve.value.length && J.value ? (a(), F(i(Oe), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: S(() => [
            w(i(ee), {
              small: "",
              "data-empty-clear": "",
              onClick: G
            }, {
              default: S(() => [...W[6] || (W[6] = [
                g("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), F(i(it), {
          key: 1,
          rows: ve.value,
          failure: i(k),
          loaded: i($),
          more: !le.value && i(T),
          older: Z,
          empty: N.value.title,
          hint: N.value.hint,
          searching: s.value
        }, {
          default: S(({ row: z }) => [
            v("div", {
              class: "agent-row",
              "data-agent-row": z.id
            }, [
              w(_a, {
                row: z,
                facts: M(z),
                progress: I(z),
                "wait-reason": U(z),
                open: z.id === c.value,
                onToggle: (_) => ce(z)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, xn)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, Tn = /* @__PURE__ */ te(Cn, [["__scopeId", "data-v-eb1a93c3"]]);
export {
  Tn as A
};
