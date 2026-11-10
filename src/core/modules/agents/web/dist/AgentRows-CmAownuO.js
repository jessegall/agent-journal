import { openBlock as n, createElementBlock as s, withModifiers as te, unref as i, createTextVNode as k, toDisplayString as p, createVNode as b, createBlock as N, withCtx as y, Fragment as D, renderList as ne, createElementVNode as j, createCommentVNode as h, computed as d, ref as V, watch as de, onUnmounted as be, defineAsyncComponent as Xe, createSlots as _e, resolveDynamicComponent as et, normalizeClass as oe, normalizeStyle as Te, renderSlot as ye, onMounted as tt, Teleport as at, mergeProps as nt, toRef as Be, withKeys as Ee, nextTick as Ne } from "vue";
import { peekRef as we, Icon as Le, RunningCommand as lt, FoldGroup as Pe, TaskStatusIcon as ot, useWindow as Ae, loadWindowComponent as st, coalesced as rt, READ_RATES as it, eventMayBeChildOf as dt, InnerTabs as ut, TabBody as ct, SwitchCase as Ue, EmptyState as Ie, Btn as se, TextArea as gt, TextInput as vt, HoverTip as Ce, TaskBar as pt, useNow as Je, age as ht, perHour as ft, sinceWords as mt, seenWords as kt, AgentTip as bt, TimeAgo as We, SearchBar as yt, Segmented as wt, MenuLabel as Re, MenuItem as $e, RowList as Mt, toggleFilter as xt } from "@journal/window-kit";
import { _ as Y, T as $t } from "./TranscriptRows-BL93hPr8.js";
const St = {
  class: "agent-command",
  "data-agent-command": ""
}, Ct = {
  key: 1,
  "data-agent-stopped": ""
}, Tt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (l, t) => (n(), s("span", St, [
      e.waitReason ? (n(), s("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: t[0] || (t[0] = te((o) => i(we)("test_queue:0"), ["stop"]))
      }, [
        k("Waiting: " + p(e.waitReason) + " ", 1),
        b(i(Le), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (n(), s("span", Ct, "Waiting")) : (n(), N(i(lt), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, At = /* @__PURE__ */ Y(Tt, [["__scopeId", "data-v-1b371fb5"]]), jt = ["data-agent-delegated", "onClick"], Bt = { class: "agent-task-number" }, Rt = { class: "agent-task-title" }, Lt = ["title"], It = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const t = l;
    return (o, a) => (n(), N(i(Pe), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: a[0] || (a[0] = (g) => t("toggle"))
    }, {
      default: y(() => [
        (n(!0), s(D, null, ne(e.section.tasks, (g) => (n(), s("button", {
          key: g.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": g.id,
          onClick: (m) => i(we)(`tasks:${g.id}`)
        }, [
          b(i(ot), {
            status: g.state
          }, null, 8, ["status"]),
          j("span", Bt, p(g.id), 1),
          j("span", Rt, p(g.title), 1),
          g.plan_id ? (n(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${g.plan_id}: ${g.plan_title}`
          }, "Plan " + p(g.plan_id), 9, Lt)) : h("", !0)
        ], 8, jt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Ot = /* @__PURE__ */ Y(It, [["__scopeId", "data-v-ea4ccd6b"]]), Vt = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, zt = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Ht = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, Et = ["data-peek", "onClick"], Nt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Wt = {
  key: 0,
  class: "agent-helper-brief"
}, qt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Dt = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Ft = "It ended without a report", Pt = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const l = e, t = ["started", "blocked", "open", "completed"], o = d(() => {
      var r, w;
      return l.row.ended_at && ((w = (r = l.facts) == null ? void 0 : r.job_returned) != null && w.startsWith(Ft)) ? l.facts.job_returned : "";
    }), a = d(() => l.tasks.length ? t.map((r) => ({ state: r, label: r.slice(0, 1).toUpperCase() + r.slice(1), tasks: l.tasks.filter((w) => w.state === r || r === "started" && w.state === "testing" || r === "completed" && w.state === "cancelled") })) : []), g = /* @__PURE__ */ new Set(["completed"]), m = V({}), $ = (r) => !(m.value[r] ?? g.has(r)), S = (r) => m.value = { ...m.value, [r]: $(r) }, B = Ae(), { rows: q } = B.props.reports;
    B.state["reports.agent"] = String(l.row.id);
    const z = d(() => l.row.access === "read-only"), H = d(() => !!l.row.retired_at || l.row.state === "retired"), F = ["tasks", "transcript", "terminal", "file-feed", "reports"], A = d(() => (H.value ? B.tabs.filter((w) => ["reports", "transcript"].includes(w.key)) : z.value ? B.tabs.filter((w) => ["reports", "transcript", "terminal"].includes(w.key)) : [...B.tabs]).sort((w, c) => (F.indexOf(w.key) < 0 ? F.length : F.indexOf(w.key)) - (F.indexOf(c.key) < 0 ? F.length : F.indexOf(c.key)))), R = () => z.value || H.value ? A.value.find((r) => r.key === "transcript") : A.value[0], E = V(R());
    de(E, (r) => {
      B.state.tab = (r == null ? void 0 : r.key) ?? "";
    }, { immediate: !0 }), be(() => {
      B.state.tab = "";
    }), de(A, (r) => {
      r.some((w) => {
        var c;
        return w.key === ((c = E.value) == null ? void 0 : c.key);
      }) || (E.value = r[0]);
    }), de(() => l.open, (r) => {
      r && (E.value = R());
    });
    const G = Object.fromEntries(B.tabs.filter((r) => r.component).map((r) => [r.key, Xe(() => st(r.component))])), P = V(!1), { data: K } = B.props.tool, _ = d(() => {
      var r;
      return ((r = K.value) == null ? void 0 : r.tool) ?? "";
    }), Q = d(() => {
      var r;
      return ((r = K.value) == null ? void 0 : r.note) ?? "";
    }), f = d(() => l.row.role !== "main" && (!l.row.ended_at || l.stoppedWithWork || l.waitReason));
    async function u() {
      !l.open || !f.value || (B.state["tool.agent"] = String(l.row.id), await B.reload("tool"));
    }
    const W = rt(u, it.agentCommand), v = B.follow(["hook_call.*", "process_part.*"], (r) => dt(r, "session_agent_id", /* @__PURE__ */ new Set([l.row.id])) && W());
    return be(() => v == null ? void 0 : v()), de(() => l.open, (r) => {
      r && u();
    }, { immediate: !0 }), (r, w) => {
      var c;
      return n(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: w[2] || (w[2] = te(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (n(), s("p", Vt, "Retirement reason: " + p(e.row.retirement_reason), 1)) : h("", !0),
        e.row.resume_reason ? (n(), s("p", zt, p(e.row.resume_reason), 1)) : h("", !0),
        f.value ? (n(), N(At, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: _.value,
          note: Q.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : h("", !0),
        o.value ? (n(), s("p", Ht, p(o.value), 1)) : h("", !0),
        b(i(ut), {
          class: "agent-tabs",
          tabs: A.value,
          active: E.value,
          answer: { tasks: e.tasks.length, reports: i(q).length },
          onChoose: w[0] || (w[0] = (L) => E.value = L)
        }, null, 8, ["tabs", "active", "answer"]),
        b(i(ct), {
          class: "agent-tab-body",
          tab: E.value,
          "data-agent-tab-body": (c = E.value) == null ? void 0 : c.key
        }, {
          default: y(() => {
            var L;
            return [
              b(i(Ue), {
                value: (L = E.value) == null ? void 0 : L.key
              }, _e({
                reports: y(() => [
                  i(q).length ? h("", !0) : (n(), N(i(Ie), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: y(() => [...w[3] || (w[3] = [
                      k("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (n(!0), s(D, null, ne(i(q), (O) => (n(), s("button", {
                    key: O.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${O.id}`,
                    onClick: (Z) => i(we)(`messages:${O.id}`)
                  }, p(O.text), 9, Et))), 128))
                ]),
                tasks: y(() => {
                  var O;
                  return [
                    e.tasks.length ? h("", !0) : (n(), N(i(Ie), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: y(() => [...w[4] || (w[4] = [
                        k("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (n(!0), s(D, null, ne(a.value, (Z) => (n(), N(Ot, {
                      key: Z.state,
                      section: Z,
                      open: $(Z.state),
                      onToggle: (M) => S(Z.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (O = e.facts) != null && O.instruction ? (n(), s(D, { key: 1 }, [
                      w[5] || (w[5] = j("p", { class: "agent-label" }, "Instruction", -1)),
                      j("div", Nt, p(e.facts.instruction), 1)
                    ], 64)) : h("", !0)
                  ];
                }),
                transcript: y(() => {
                  var O;
                  return [
                    z.value ? (n(), s(D, { key: 0 }, [
                      (O = e.facts) != null && O.instruction ? (n(), s("div", Wt, [
                        b(i(Pe), {
                          label: "Instruction",
                          open: P.value,
                          "data-agent-section": "instruction",
                          onToggle: w[1] || (w[1] = (Z) => P.value = !P.value)
                        }, {
                          default: y(() => [
                            j("div", qt, p(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (n(), s("p", Dt, "No job recorded")) : h("", !0)
                    ], 64)) : h("", !0),
                    b($t, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                ne(i(G), (O, Z) => ({
                  name: Z,
                  fn: y(() => [
                    (n(), N(et(O), {
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
}, Ut = /* @__PURE__ */ Y(Pt, [["__scopeId", "data-v-492142fe"]]), Jt = { class: "action-field" }, Gt = ["value", "disabled"], Kt = ["value"], Zt = { key: 1 }, Yt = {
  key: 1,
  class: "action-field"
}, Qt = { class: "action-buttons" }, Xt = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (l, t) => (n(), s("form", {
      onSubmit: t[4] || (t[4] = te((o) => l.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (n(), s(D, { key: 0 }, [
        j("label", Jt, [
          t[6] || (t[6] = k("Task ", -1)),
          j("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: t[0] || (t[0] = (o) => l.$emit("update:task", o.target.value))
          }, [
            t[5] || (t[5] = j("option", { value: "" }, "Choose an open task", -1)),
            (n(!0), s(D, null, ne(e.tasks, (o) => (n(), s("option", {
              key: o.id,
              value: String(o.id)
            }, p(o.id) + ": " + p(o.title), 9, Kt))), 128))
          ], 40, Gt)
        ]),
        e.moreTasks ? (n(), N(i(se), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: t[1] || (t[1] = (o) => l.$emit("more"))
        }, {
          default: y(() => [...t[7] || (t[7] = [
            k("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : h("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (n(), s("p", Zt, "No open tasks.")) : h("", !0)
      ], 64)) : (n(), s("label", Yt, [
        t[8] || (t[8] = k("Job", -1)),
        b(i(gt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (o) => l.$emit("update:text", o.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      j("div", Qt, [
        b(i(se), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: y(() => [...t[9] || (t[9] = [
            k("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        b(i(se), {
          small: "",
          disabled: e.pending,
          onClick: t[3] || (t[3] = (o) => l.$emit("cancel"))
        }, {
          default: y(() => [...t[10] || (t[10] = [
            k("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, _t = /* @__PURE__ */ Y(Xt, [["__scopeId", "data-v-adde4158"]]), ea = { class: "action-buttons" }, ta = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (l, t) => (n(), s("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = te((o) => l.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = j("p", null, "Retirement is permanent. This agent cannot be resumed.", -1)),
      b(i(vt), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (o) => l.$emit("update:reason", o))
      }, null, 8, ["model-value", "disabled"]),
      j("div", ea, [
        b(i(se), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: y(() => [...t[3] || (t[3] = [
            k("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        b(i(se), {
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (o) => l.$emit("cancel"))
        }, {
          default: y(() => [...t[4] || (t[4] = [
            k("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, aa = /* @__PURE__ */ Y(ta, [["__scopeId", "data-v-23a905c0"]]), na = { class: "action-buttons" }, la = {
  key: 0,
  role: "alert"
}, oa = {
  key: 1,
  role: "status"
}, sa = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const l = e, t = Ae(), o = V(""), a = V(""), g = V(""), m = V(""), $ = V([]), S = V(0), B = V(!1), q = V(!1), z = V(!1), H = V(""), F = V(""), A = d(() => !!l.row.retired_at || l.row.state === "retired"), R = d(() => !A.value && !!l.row.ended_at), E = d(() => {
      var W;
      return R.value && ((W = l.row.job_command) == null ? void 0 : W.length) && !l.row.resume_reason;
    }), G = d(() => E.value && !q.value && (l.row.job_task_flag ? $.value.some((W) => String(W.id) === m.value) : !!a.value.trim()));
    function P(W) {
      o.value = W, a.value = "", g.value = "", m.value = "", H.value = "", F.value = "";
    }
    async function K() {
      P("job"), l.row.job_task_flag && ($.value = [], S.value = 0, B.value = !1, await _());
    }
    async function _() {
      if (!q.value) {
        q.value = !0;
        try {
          t.state["jobs.page"] = String(S.value + 1), await t.reload("jobs");
          const W = t.props.jobs;
          H.value = W.failure.value, H.value || ($.value = [...$.value, ...W.rows.value], S.value = W.data.value.page, B.value = W.more.value);
        } finally {
          q.value = !1;
        }
      }
    }
    async function Q(W, v) {
      if (!z.value) {
        z.value = !0, H.value = "";
        try {
          const r = await t.run(W);
          H.value = r.ok ? "" : r.error, r.ok && (P(""), F.value = v);
        } finally {
          z.value = !1;
        }
      }
    }
    async function f() {
      if (!G.value) return;
      const W = l.row.job_task_flag ? [l.row.job_task_flag, m.value] : [a.value.trim()];
      await Q([...l.row.job_command, String(l.row.id), ...W], "Job sent.");
    }
    async function u() {
      !R.value || o.value !== "retire" || !g.value.trim() || await Q(["agent", "retire", String(l.row.id), "--reason", g.value.trim()], "Agent retired permanently.");
    }
    return (W, v) => {
      var r;
      return A.value ? h("", !0) : (n(), s("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: v[6] || (v[6] = te(() => {
        }, ["stop"])),
        onKeydown: v[7] || (v[7] = te(() => {
        }, ["stop"]))
      }, [
        j("div", na, [
          R.value ? (n(), s(D, { key: 0 }, [
            (r = e.row.job_command) != null && r.length ? (n(), N(i(se), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: z.value || q.value || !E.value,
              onClick: K
            }, {
              default: y(() => [...v[8] || (v[8] = [
                k("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0),
            e.row.role !== "main" ? (n(), N(i(se), {
              key: 1,
              small: "",
              "data-agent-retire": "",
              disabled: z.value || q.value,
              onClick: v[0] || (v[0] = (w) => P("retire"))
            }, {
              default: y(() => [...v[9] || (v[9] = [
                k("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0)
          ], 64)) : h("", !0)
        ]),
        b(i(Ue), { value: o.value }, {
          job: y(() => [
            b(_t, {
              task: m.value,
              "onUpdate:task": v[1] || (v[1] = (w) => m.value = w),
              text: a.value,
              "onUpdate:text": v[2] || (v[2] = (w) => a.value = w),
              row: e.row,
              tasks: $.value,
              pending: z.value,
              loading: q.value,
              "more-tasks": B.value,
              failure: H.value,
              "job-ready": G.value,
              onSubmit: f,
              onMore: _,
              onCancel: v[3] || (v[3] = (w) => P(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          retire: y(() => [
            b(aa, {
              reason: g.value,
              "onUpdate:reason": v[4] || (v[4] = (w) => g.value = w),
              pending: z.value,
              onSubmit: u,
              onCancel: v[5] || (v[5] = (w) => P(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        H.value ? (n(), s("p", la, p(H.value), 1)) : h("", !0),
        F.value ? (n(), s("p", oa, p(F.value), 1)) : h("", !0)
      ], 32));
    };
  }
}, ra = /* @__PURE__ */ Y(sa, [["__scopeId", "data-v-4cb32275"]]), ia = { class: "line" }, da = {
  key: 0,
  class: "line",
  "data-agent-since": ""
}, ua = {
  key: 1,
  class: "line",
  "data-agent-seen": ""
}, ca = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" }, seen: { type: String, default: "" } },
  setup(e) {
    const l = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, o = d(() => l.has(t.state)), a = d(() => [t.doing, t.since, t.seen].filter(Boolean).join(". "));
    return (g, m) => (n(), N(i(Ce), {
      as: "button",
      place: "corner",
      class: oe(["agent-dot", { pulse: o.value }]),
      "data-state": e.state,
      "aria-label": a.value,
      "data-agent-status": "",
      onClick: m[0] || (m[0] = te(() => {
      }, ["stop"]))
    }, {
      tip: y(() => [
        j("b", ia, p(e.doing), 1),
        e.since ? (n(), s("span", da, p(e.since), 1)) : h("", !0),
        e.seen ? (n(), s("span", ua, p(e.seen), 1)) : h("", !0)
      ]),
      default: y(() => [
        m[1] || (m[1] = j("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, ga = /* @__PURE__ */ Y(ca, [["__scopeId", "data-v-1a0bc478"]]), va = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, pa = (e) => e.filter((l) => l.state !== "cancelled"), qe = (e, l) => e.filter((t) => t.state === l).length;
function ha({ tasks: e, inHand: l, perHour: t }) {
  const o = pa(e), a = qe(o, "completed"), g = va[l == null ? void 0 : l.state], m = o.length - a - (l && l.state !== "completed" ? 1 : 0), $ = a === o.length;
  return {
    number: l.id,
    title: l.title,
    plan: l.plan_id ?? 0,
    count: `${a} of ${o.length}`,
    taskTip: `${a} of its ${o.length} tasks done${g ? `. This one is ${g.words}.` : "."}`,
    countTip: $ ? `All ${o.length} tasks done` : `${a} done, 1 in hand, ${m} to go`,
    paceTip: !$ && t ? `About ${t} an hour.` : "",
    rate: !$ && t ? `${Math.round(t)}/hour` : "",
    bar: { total: o.length, done: a, testing: qe(o, "testing") }
  };
}
const fa = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, ma = {
  class: "task-line",
  "data-agent-task-line": ""
}, ka = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, ba = {
  key: 1,
  class: "rate",
  "data-agent-rate": ""
}, ya = { key: 0 }, wa = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, jobTitle: { type: String, default: "" }, perHour: { type: Number, default: 0 } },
  setup(e) {
    const l = e, t = d(() => l.inHand ? ha({ tasks: l.tasks, inHand: l.inHand, perHour: l.perHour }) : null);
    return (o, a) => e.job && !t.value ? (n(), s("span", fa, [
      b(i(Ce), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: y(() => [
          j("b", null, p(e.job), 1)
        ]),
        default: y(() => [
          k(p(e.jobTitle || "Job"), 1)
        ]),
        _: 1
      })
    ])) : t.value ? (n(), s(D, { key: 1 }, [
      j("span", ma, [
        b(i(Ce), {
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${t.value.number}`,
          "aria-label": `Task ${t.value.number}: ${t.value.title}`,
          onClick: a[0] || (a[0] = te((g) => i(we)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: y(() => [
            j("b", null, p(t.value.title), 1),
            j("span", null, p(t.value.taskTip), 1)
          ]),
          default: y(() => [
            k("Task " + p(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"]),
        t.value.plan ? (n(), s("span", ka, "Plan " + p(t.value.plan), 1)) : h("", !0),
        t.value.rate ? (n(), s("span", ba, p(t.value.rate), 1)) : h("", !0),
        b(i(Ce), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: y(() => [
            j("b", null, p(t.value.countTip), 1),
            t.value.paceTip ? (n(), s("span", ya, p(t.value.paceTip), 1)) : h("", !0)
          ]),
          default: y(() => [
            k(p(t.value.count), 1)
          ]),
          _: 1
        })
      ]),
      b(i(pt), {
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: t.value.bar.total,
        done: t.value.bar.done,
        testing: t.value.bar.testing
      }, null, 8, ["total", "done", "testing"])
    ], 64)) : h("", !0);
  }
}, Ma = /* @__PURE__ */ Y(wa, [["__scopeId", "data-v-035bb012"]]), xa = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', $a = ["data-icon", "stroke-width", "innerHTML"], ee = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const l = e, t = { right: 0, down: 90, left: 180, up: 270 }, o = {
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
    }, a = {
      agent: xa,
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
    return (g, m) => (n(), s("svg", {
      class: "ico",
      "data-icon": e.name,
      style: Te({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...l.facing === "right" ? {} : { transform: `rotate(${t[l.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: a[o[e.name] || e.name] || a.dot
    }, null, 12, $a));
  }
}, Sa = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Ca = {
  key: 1,
  class: "menu-item-text"
}, Ta = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (l, t) => (n(), s("button", {
      type: "button",
      class: oe(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (n(), s("span", Sa, p(e.checked ? "✓" : ""), 1)) : h("", !0),
      e.description ? (n(), s("span", Ca, [
        j("span", null, [
          ye(l.$slots, "default", {}, void 0, !0)
        ]),
        j("small", null, p(e.description), 1)
      ])) : ye(l.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, me = /* @__PURE__ */ Y(Ta, [["__scopeId", "data-v-fec99974"]]), Aa = {}, ja = { class: "menu-label" };
function Ba(e, l) {
  return n(), s("span", ja, [
    ye(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ke = /* @__PURE__ */ Y(Aa, [["render", Ba], ["__scopeId", "data-v-aa955b3e"]]), Ra = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, La = {
  key: 0,
  class: "skills-none"
}, Ia = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: l }) {
    const t = e, o = l, a = d(() => t.skills.filter((m) => m.state === "loaded")), g = d(() => t.skills.filter((m) => m.state !== "loaded"));
    return (m, $) => (n(), s("div", Ra, [
      b(ke, null, {
        default: y(() => [...$[1] || ($[1] = [
          k("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      a.value.length ? h("", !0) : (n(), s("p", La, "None yet. Compacting the conversation empties this list.")),
      (n(!0), s(D, null, ne(a.value, (S) => (n(), s("p", {
        key: S.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        b(ee, {
          name: "book",
          size: 12
        }),
        k(p(S.skill), 1)
      ]))), 128)),
      g.value.length ? (n(), s(D, { key: 1 }, [
        b(ke, null, {
          default: y(() => [...$[2] || ($[2] = [
            k("Still to read", -1)
          ])]),
          _: 1
        }),
        (n(!0), s(D, null, ne(g.value, (S) => (n(), s("p", {
          key: S.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          b(ee, {
            name: "book",
            size: 12
          }),
          k(p(S.skill), 1)
        ]))), 128))
      ], 64)) : h("", !0),
      b(me, {
        "data-agent-skills-browse": "",
        onClick: $[0] || ($[0] = (S) => o("browse"))
      }, {
        default: y(() => [...$[3] || ($[3] = [
          k("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Oa = /* @__PURE__ */ Y(Ia, [["__scopeId", "data-v-be514d47"]]), Va = ["disabled", "title"], za = { class: "gauge usage" }, Ha = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: l }) {
    const t = e, o = l, a = d(() => t.windows[0] ?? null), g = d(() => a.value && Number.isFinite(a.value.used_percent) ? Math.max(0, Math.min(100, Math.round(a.value.used_percent))) : null), m = d(() => g.value !== null && g.value >= 100), $ = d(() => {
      var B;
      return (B = a.value) != null && B.reset_epoch_seconds ? new Date(a.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), S = d(() => m.value ? `At usage limit: the plan's ${a.value.title} allowance is used up${$.value ? `, starts again ${$.value}` : ""}` : `${g.value}% of the plan's ${a.value.title} allowance used${$.value ? `, starts again ${$.value}` : ""}`);
    return (B, q) => g.value !== null ? (n(), s("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: S.value,
      onClick: q[0] || (q[0] = (z) => o("open", z.currentTarget))
    }, [
      b(ee, {
        name: "allowance",
        size: 12
      }),
      q[1] || (q[1] = k()),
      j("span", za, [
        j("span", {
          style: Te({ width: `${g.value}%` })
        }, null, 4)
      ]),
      k(" " + p(m.value ? "At usage limit" : `${g.value}%`), 1)
    ], 8, Va)) : h("", !0);
  }
}, Ea = /* @__PURE__ */ Y(Ha, [["__scopeId", "data-v-a36f09dc"]]), Na = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (l, t) => (n(), s("span", {
      class: oe(["badge", e.tone])
    }, p(e.text), 3));
  }
}, Wa = /* @__PURE__ */ Y(Na, [["__scopeId", "data-v-9e7e1157"]]), qa = (e, l, t) => Math.max(l, Math.min(t, e)), Ge = /* @__PURE__ */ new WeakMap(), Da = (e, l) => Ge.set(e, l);
function Fa(e, l) {
  for (let t = l; t; t = Ge.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function Pa(e, l) {
  const t = (o) => {
    var g, m;
    const a = ((g = e.value) == null ? void 0 : g.element) || ((m = e.value) == null ? void 0 : m.$el) || e.value;
    a && !Fa(a, o.target) && l(o);
  };
  window.addEventListener("click", t), be(() => window.removeEventListener("click", t));
}
const fe = 8, Ua = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: l, emit: t }) {
    const o = e, a = V(null), g = (c) => c ? `${c}px` : void 0, m = d(() => ({
      minWidth: g(o.minWidth),
      maxWidth: g(o.maxWidth),
      maxHeight: g(o.maxHeight),
      height: g(o.height)
    })), $ = V({ w: 0, h: 0 }), S = V(o.anchor ? o.anchor.getBoundingClientRect() : null), B = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), q = (c) => ({
      left: Math.max(0, c.left),
      top: Math.max(0, c.top),
      right: Math.min(window.innerWidth, c.right),
      bottom: Math.min(window.innerHeight, c.bottom)
    }), z = (c) => {
      const L = c.closest(".pane, .float-window");
      return L ? q(L.getBoundingClientRect()) : B();
    }, H = (c, L) => `${Math.max(0, c ? Math.min(c, L) : L)}px`;
    function F(c, L) {
      return {
        below: c.bottom - L.bottom - o.gap - fe,
        above: L.top - c.top - o.gap - fe,
        across: c.right - c.left - 2 * fe
      };
    }
    function A(c) {
      const L = z(o.anchor), O = F(L, c);
      return $.value.w <= O.across && $.value.h <= Math.max(O.below, O.above) ? L : B();
    }
    const R = d(() => {
      if (!S.value) return m.value;
      const c = S.value, L = A(c), O = F(L, c), { w: Z, h: M } = $.value, T = o.align === "auto" ? c.left + c.right > L.left + L.right : o.align === "right", ae = qa(T ? c.right - Z : c.left, L.left + fe, Math.max(L.left + fe, L.right - Z - fe)), J = M > O.below && O.above > O.below ? { bottom: `${window.innerHeight - c.top + o.gap}px`, maxHeight: H(o.maxHeight, O.above) } : { top: `${c.bottom + o.gap}px`, maxHeight: H(o.maxHeight, O.below) };
      return { ...m.value, ...J, left: `${ae}px`, maxWidth: H(o.maxWidth, O.across) };
    }), E = t, G = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function P(c) {
      const L = G(), O = L.indexOf(document.activeElement);
      L[(O + c + L.length) % L.length].focus();
    }
    const K = { ArrowDown: () => P(1), ArrowUp: () => P(-1), Escape: () => E("close") }, _ = (c) => K[c.key] && (c.preventDefault(), K[c.key]()), Q = () => a.value && ($.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let f = 0;
    const u = new ResizeObserver(() => {
      cancelAnimationFrame(f), f = requestAnimationFrame(Q);
    });
    Pa(a, (c) => o.anchor && !o.anchor.contains(c.target) && E("close"));
    const W = (c, L) => ["top", "left", "right", "bottom"].some((O) => Math.abs(c[O] - L[O]) > 1), v = (c) => c.bottom < 0 || c.top > window.innerHeight;
    let r = 0;
    function w() {
      if (o.anchor) {
        const c = o.anchor.getBoundingClientRect();
        if (!o.anchor.isConnected || v(c)) return E("close");
        W(c, S.value) && (S.value = c);
      }
      r = requestAnimationFrame(w);
    }
    return tt(() => {
      o.anchor && a.value && Da(a.value, o.anchor), Q(), a.value && u.observe(a.value), !o.plain && G()[0] && G()[0].focus(), w();
    }), be(() => {
      u.disconnect(), cancelAnimationFrame(r), cancelAnimationFrame(f);
    }), l({ element: a }), (c, L) => (n(), N(at, {
      to: "body",
      disabled: !e.anchor
    }, [
      j("div", nt({
        ref_key: "panel",
        ref: a
      }, c.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: R.value,
        onKeydown: _
      }), [
        ye(c.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Ja = /* @__PURE__ */ Y(Ua, [["__scopeId", "data-v-3d203970"]]);
async function Ga(e, l, t) {
  if (!e) return t(l);
  const { target: o, fields: a } = e, g = Object.fromEntries(Object.keys(a).map((S) => [S, o[S]])), m = () => Object.assign(o, g);
  Object.assign(o, a);
  let $ = !1;
  try {
    const S = await t(l);
    return $ = S.ok, S;
  } finally {
    $ || m();
  }
}
function Ka(e, l, t, { groups: o, programs: a }) {
  const g = V({}), m = V(""), $ = V(!1), S = d(() => !!e.value && !e.value.ended_at), B = d(() => S.value && !!e.value.paused_at);
  async function q(A, R = null) {
    m.value = "";
    const E = await Ga(R, A, l);
    return m.value = E.ok ? "" : E.error, t(), E;
  }
  return { groups: o, programs: a, chosen: g, failure: m, asking: $, running: S, paused: B, choose: (A, R) => q(["agent", "control", String(e.value.id), A, R.value], { target: g, fields: { value: { ...g.value, [A]: R.label } } }), stop: () => ($.value = !1, q(["agent", "stop", String(e.value.id)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (A) => q(["agent", "launch", A.name]) };
}
function Za(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const Ya = ["disabled", "title"], Qa = ["disabled", "title"], Xa = { class: "gauge" }, _a = ["disabled", "title"], en = ["disabled"], tn = ["disabled"], an = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, nn = ["title"], ln = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, on = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, sn = { class: "gauge" }, rn = { class: "context-used" }, dn = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, un = 75, cn = {
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
    fitness: { type: Object, default: null },
    run: { type: Function, default: null }
  },
  emits: ["open", "changed", "skills"],
  setup(e, { emit: l }) {
    const t = e, o = l, a = Ka(Be(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => o("changed"), { groups: Be(t, "controlGroups"), programs: Be(t, "agentPrograms") }), g = V(null), m = V(""), $ = d(() => a.groups.value.find((f) => f.key === m.value));
    function S(f, u) {
      g.value = f.currentTarget, m.value = u;
    }
    function B() {
      g.value = null, m.value = "", a.asking.value = !1;
    }
    const q = d(() => t.skills.filter((f) => f.state === "loaded"));
    function z(f) {
      S(f, "skills"), o("skills");
    }
    const H = (f) => a.groups.value.some((u) => u.key === f), F = d(() => {
      var f;
      return a.chosen.value.model ?? ((f = R.value) == null ? void 0 : f.model) ?? "";
    }), A = d(() => {
      var f;
      return a.chosen.value.effort ?? ((f = R.value) == null ? void 0 : f.effort) ?? "";
    });
    d(() => !!t.agent && !t.agent.ended_at);
    const R = d(() => {
      var f;
      return ((f = t.usage.agents) == null ? void 0 : f.find((u) => {
        var W;
        return u.id === ((W = t.agent) == null ? void 0 : W.id);
      })) ?? null;
    }), E = d(() => {
      var f;
      return ((f = R.value) == null ? void 0 : f.context_percent) == null ? null : Math.round(R.value.context_percent);
    }), G = (f) => `${Math.round(f / 1e3)}k`, P = d(() => {
      var f;
      return !!((f = R.value) != null && f.context_limit_tokens);
    }), K = d(() => {
      var f, u;
      return ((f = R.value) == null ? void 0 : f.context_limit_tokens) || ((u = R.value) == null ? void 0 : u.context_window_tokens) || 0;
    }), _ = d(() => K.value ? `${G(R.value.context_tokens ?? 0)} of ${G(K.value)}` : ""), Q = d(() => {
      var f;
      return (f = R.value) != null && f.cost_dollars ? `$${R.value.cost_dollars.toFixed(2)}` : "";
    });
    return (f, u) => {
      var W;
      return n(), s("div", {
        class: oe(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (n(), s(D, { key: 0 }, [
          j("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: u[0] || (u[0] = (v) => S(v, "agent"))
          }, [
            b(ee, {
              name: "agents",
              size: 12
            }),
            k(" " + p(((W = e.agentPrograms.find((v) => v.name === e.agent.program)) == null ? void 0 : W.title) || e.agent.program), 1)
          ], 8, Ya),
          b(Ea, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: u[1] || (u[1] = (v) => o("open", "usage", v))
          }, null, 8, ["windows", "disabled"]),
          E.value !== null ? (n(), s("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${E.value}% full: clear or compact it`,
            onClick: u[2] || (u[2] = (v) => H("context") ? S(v, "context") : o("open", "context", v.currentTarget))
          }, [
            b(ee, {
              name: "gauge",
              size: 12
            }),
            u[14] || (u[14] = k()),
            j("span", Xa, [
              j("span", {
                style: Te({ width: `${E.value}%` })
              }, null, 4)
            ]),
            k(" " + p(E.value) + "% ", 1)
          ], 8, Qa)) : h("", !0),
          F.value ? (n(), s("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${F.value}: change the model`,
            onClick: u[3] || (u[3] = (v) => H("model") ? S(v, "model") : null)
          }, [
            b(ee, {
              name: "model",
              size: 12
            }),
            k(" " + p(F.value), 1)
          ], 8, _a)) : h("", !0),
          H("effort") || e.card && A.value ? (n(), s("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: u[4] || (u[4] = (v) => S(v, "effort"))
          }, [
            b(ee, {
              name: "bolt",
              size: 12
            }),
            k(" " + p(A.value), 1)
          ], 8, en)) : h("", !0),
          Q.value ? (n(), s("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: u[5] || (u[5] = (v) => o("open", "cost", v.currentTarget))
          }, p(Q.value), 9, tn)) : h("", !0),
          e.branch ? (n(), s("span", an, [
            b(ee, {
              name: "branch",
              size: 12
            }),
            k(" " + p(e.branch), 1)
          ])) : h("", !0),
          e.card ? h("", !0) : (n(), s("button", {
            key: 5,
            type: "button",
            class: oe(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: u[6] || (u[6] = (v) => o("open", "jobs", v.currentTarget))
          }, [
            b(ee, {
              name: "clock",
              size: 12
            }),
            k(" " + p(e.jobs), 1)
          ], 2)),
          e.run ? (n(), s("button", {
            key: 6,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: z
          }, [
            b(ee, {
              name: "book",
              size: 12
            }),
            k(" " + p(q.value.length), 1)
          ])) : h("", !0),
          e.fitness ? (n(), s(D, { key: 7 }, [
            j("button", {
              type: "button",
              class: oe(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < un }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: u[7] || (u[7] = (v) => o("open", "fitness", v.currentTarget))
            }, [
              b(ee, {
                name: "heart",
                size: 12
              }),
              k(" " + p(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            j("button", {
              type: "button",
              class: oe(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: u[8] || (u[8] = (v) => o("open", "load", v.currentTarget))
            }, [
              b(ee, {
                name: "weight",
                size: 12
              }),
              k(" " + p(e.fitness.workload), 1)
            ], 2)
          ], 64)) : h("", !0)
        ], 64)) : e.run && !e.loading ? (n(), s("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: u[9] || (u[9] = (v) => S(v, "start"))
        }, [
          b(ee, {
            name: "agents",
            size: 12
          }),
          u[15] || (u[15] = k(" Start an agent", -1))
        ])) : h("", !0),
        u[21] || (u[21] = j("span", { class: "space" }, null, -1)),
        i(a).failure.value ? (n(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: i(a).failure.value
        }, p(i(a).failure.value), 9, nn)) : h("", !0),
        ye(f.$slots, "default", {}, void 0, !0),
        g.value ? (n(), N(Ja, {
          key: 3,
          anchor: g.value,
          "min-width": 190,
          onClose: B
        }, {
          default: y(() => {
            var v;
            return [
              m.value === "agent" ? (n(), s(D, { key: 0 }, [
                i(a).asking.value ? (n(), s(D, { key: 0 }, [
                  b(ke, { "data-agent-stop-ask": "" }, {
                    default: y(() => [...u[16] || (u[16] = [
                      k("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  b(me, {
                    "data-agent-stop-confirm": "",
                    onClick: u[10] || (u[10] = (r) => (B(), i(a).stop()))
                  }, {
                    default: y(() => [...u[17] || (u[17] = [
                      k("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  b(me, {
                    onClick: u[11] || (u[11] = (r) => i(a).asking.value = !1)
                  }, {
                    default: y(() => [...u[18] || (u[18] = [
                      k("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (n(), N(me, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: u[12] || (u[12] = (r) => i(a).asking.value = !0)
                }, {
                  default: y(() => [...u[19] || (u[19] = [
                    k("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : m.value === "start" ? (n(), s(D, { key: 1 }, [
                b(ke, null, {
                  default: y(() => [...u[20] || (u[20] = [
                    k("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (n(!0), s(D, null, ne(i(a).programs.value, (r) => (n(), N(me, {
                  key: r.name,
                  "data-agent-program": r.name,
                  onClick: (w) => (B(), i(a).start(r))
                }, {
                  default: y(() => [
                    k(p(r.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : m.value === "skills" ? (n(), N(Oa, {
                key: 2,
                skills: e.skills,
                onBrowse: u[13] || (u[13] = (r) => (B(), o("open", "skills", null)))
              }, null, 8, ["skills"])) : $.value ? (n(), s(D, { key: 3 }, [
                b(ke, null, {
                  default: y(() => [
                    k(p($.value.label), 1)
                  ]),
                  _: 1
                }),
                m.value === "context" ? (n(), s(D, { key: 0 }, [
                  j("p", ln, p(i(Za)(((v = R.value) == null ? void 0 : v.last_compaction) ?? null)), 1),
                  j("div", on, [
                    j("span", sn, [
                      j("span", {
                        style: Te({ width: `${E.value}%` })
                      }, null, 4)
                    ]),
                    j("span", rn, p(E.value) + "%", 1)
                  ]),
                  _.value ? (n(), s("p", dn, [
                    k(p(_.value) + " ", 1),
                    P.value ? (n(), N(Wa, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : h("", !0)
                  ])) : h("", !0)
                ], 64)) : h("", !0),
                (n(!0), s(D, null, ne($.value.choices, (r) => (n(), N(me, {
                  key: r.value,
                  "data-agent-choice": r.value,
                  onClick: (w) => (i(a).choose($.value.key, r), B())
                }, {
                  default: y(() => [
                    k(p(r.label), 1)
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
}, gn = /* @__PURE__ */ Y(cn, [["__scopeId", "data-v-c1e2d220"]]), vn = ["data-agent-open", "aria-expanded", "role", "tabindex"], pn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, hn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, fn = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, mn = { class: "agent-line" }, kn = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, bn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, yn = {
  key: 1,
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, wn = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Mn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), o = { helper: "Helper", reviewer: "Reviewer" }, a = e, g = l, m = Je(), $ = d(() => {
      var T, ae;
      if ((T = a.facts) != null && T.profile_title) return a.facts.profile_title;
      if ((ae = a.facts) != null && ae.profile) return a.facts.profile;
      const M = o[a.row.role] || a.row.role;
      return M.slice(0, 1).toUpperCase() + M.slice(1);
    }), S = d(() => {
      var M;
      return ((M = a.facts) == null ? void 0 : M.tasks) ?? [];
    }), B = d(() => S.value.filter((M) => M.state === "open")), q = d(() => S.value.find((M) => {
      var T;
      return M.id === ((T = a.progress) == null ? void 0 : T.task_id) && M.state === "started";
    })), z = d(() => q.value || S.value.find((M) => {
      var T;
      return M.id === ((T = a.facts) == null ? void 0 : T.task_id);
    }) || S.value.find((M) => t.has(M.state)) || B.value[0] || S.value.at(-1)), H = d(() => {
      var M, T, ae, re, J, ue;
      return a.row.role === "helper" ? ((M = a.facts) == null ? void 0 : M.helper_job) || "" : (T = a.facts) != null && T.job_enabled && (((ae = q.value) == null ? void 0 : ae.title) || ((re = a.facts) == null ? void 0 : re.task_title) || ((J = B.value[0]) == null ? void 0 : J.title) || ((ue = S.value.at(-1)) == null ? void 0 : ue.title)) || "";
    }), F = d(() => `${a.row.role} ${a.row.id}`), A = d(() => {
      var M, T;
      return [a.row.program, (M = a.facts) == null ? void 0 : M.model, (T = a.facts) == null ? void 0 : T.effort, F.value].filter(Boolean).join(" · ");
    }), R = Ae(), E = d(() => ht(a.row.process_started_at || a.row.created_at, m.value)), G = /* @__PURE__ */ new Set(["open", "started", "testing"]), P = d(() => {
      var M;
      return (M = a.facts) == null ? void 0 : M.work_status;
    }), K = d(() => !!a.row.ended_at && a.row.role !== "main" && S.value.some((M) => G.has(M.state))), _ = d(() => {
      var M, T;
      return a.row.state === "running" && ((M = a.facts) == null ? void 0 : M.state) === "at usage limit" && !!((T = a.facts) != null && T.usage_limit_ends_at);
    }), Q = d(() => `At usage limit: starts again ${new Date(a.facts.usage_limit_ends_at).toLocaleString()}`), f = d(() => {
      var M;
      return a.row.retired_at || a.row.state === "retired" ? "retired" : _.value || P.value || a.waitReason || K.value ? "waiting" : a.row.state === "running" && ((M = a.facts) == null ? void 0 : M.state) || a.row.state;
    }), u = d(() => {
      var M;
      return _.value ? Q.value : P.value ? `Status: ${P.value}` : a.waitReason ? `Waiting: ${a.waitReason}` : f.value === "blocked" ? (M = a.facts) != null && M.blocked_reason ? `Blocked: ${a.facts.blocked_reason}` : "Blocked" : K.value ? "Stopped with work left" : "";
    }), W = d(() => {
      var M;
      return ((M = a.progress) == null ? void 0 : M.completed_count) ?? S.value.filter((T) => T.state === "completed").length;
    }), v = d(() => {
      var M;
      return ft(W.value, ((M = a.progress) == null ? void 0 : M.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, m.value);
    }), r = d(() => a.row.role === "main" ? 0 : v.value), w = d(() => !!a.row.retired_at || a.row.state === "retired"), c = d(() => w.value ? "Retired" : f.value === "blocked" || f.value === "waiting" ? u.value || (f.value === "blocked" ? "Blocked" : "Waiting") : a.row.ended_at ? "Idle: its process has stopped" : "Working"), L = d(() => {
      var T;
      if (w.value) return a.row.retired_at;
      const M = f.value === "blocked" || f.value === "waiting";
      return a.row.ended_at || M && ((T = a.facts) == null ? void 0 : T.last_activity) || a.row.process_started_at || a.row.created_at;
    }), O = d(() => mt(L.value, m.value)), Z = d(() => {
      var M;
      return kt((M = a.facts) == null ? void 0 : M.last_activity, m.value);
    });
    return (M, T) => {
      var ae, re, J, ue, ie, pe;
      return n(), s("div", {
        class: oe(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: T[3] || (T[3] = (X) => !e.open && g("toggle")),
        onKeydown: [
          T[4] || (T[4] = Ee(te((X) => !e.open && g("toggle"), ["self", "prevent"]), ["enter"])),
          T[5] || (T[5] = Ee(te((X) => !e.open && g("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        b(i(bt), {
          "agent-id": e.row.id,
          label: $.value,
          class: "agent-head"
        }, {
          default: y(() => {
            var X;
            return [
              e.open ? (n(), s("button", {
                key: 0,
                type: "button",
                class: "agent-back",
                title: "Back to the list",
                "aria-label": "Back to the list",
                onClick: T[0] || (T[0] = te((je) => g("toggle"), ["stop"]))
              }, [
                b(i(Le), {
                  name: "chevronRight",
                  facing: "left",
                  size: 14
                })
              ])) : h("", !0),
              j("span", pn, p($.value), 1),
              j("span", hn, p(((X = e.facts) == null ? void 0 : X.given_name) || e.row.id), 1),
              e.open ? h("", !0) : (n(), N(i(Le), {
                key: 1,
                class: "agent-chevron",
                name: "chevronRight",
                size: 12
              })),
              e.open ? (n(), s("span", fn, p(E.value), 1)) : h("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-id", "label"]),
        j("span", mn, [
          j("span", kn, p(A.value), 1),
          (ae = e.facts) != null && ae.sandbox_off ? (n(), s("span", bn, "sandbox off")) : h("", !0),
          e.open ? (n(), s("span", yn, [
            T[6] || (T[6] = k("Started ", -1)),
            b(i(We), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : h("", !0),
          e.open && ((re = e.facts) != null && re.last_activity) ? (n(), s("span", wn, [
            T[7] || (T[7] = k("Seen ", -1)),
            b(i(We), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : h("", !0)
        ]),
        e.open ? (n(), N(gn, {
          key: 0,
          "agent-programs": i(R).props.programs.rows.value,
          agent: e.row,
          branch: (J = e.progress) == null ? void 0 : J.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((ue = e.facts) == null ? void 0 : ue.windows) ?? [] },
          card: ""
        }, {
          default: y(() => [
            b(ra, { row: e.row }, null, 8, ["row"]),
            b(i(se), {
              variant: "ghost",
              small: "",
              "data-agent-inspector": "",
              onClick: T[1] || (T[1] = te((X) => i(we)(`agents:${e.row.id}`), ["stop"]))
            }, {
              default: y(() => [...T[8] || (T[8] = [
                k("Open inspector", -1)
              ])]),
              _: 1
            }),
            e.row.role === "helper" && !e.row.ended_at ? (n(), N(i(se), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: T[2] || (T[2] = te((X) => i(R).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: y(() => [...T[9] || (T[9] = [
                k("Stop", -1)
              ])]),
              _: 1
            })) : h("", !0)
          ]),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : h("", !0),
        e.open ? h("", !0) : (n(), N(Ma, {
          key: 1,
          tasks: S.value,
          "in-hand": e.row.role !== "helper" && ((ie = e.facts) != null && ie.job_enabled) && z.value || null,
          job: e.row.role === "helper" ? H.value : "",
          "job-title": e.row.role === "helper" && ((pe = e.facts) == null ? void 0 : pe.helper_job_title) || "",
          "per-hour": r.value
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "per-hour"])),
        b(ga, {
          state: f.value,
          doing: c.value,
          since: O.value,
          seen: Z.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (n(), N(Ut, {
          key: 2,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: S.value,
          "stopped-with-work": K.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : h("", !0)
      ], 42, vn);
    };
  }
}, xn = /* @__PURE__ */ Y(Mn, [["__scopeId", "data-v-525ff958"]]), $n = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Sn = ["data-agent-row", "data-agent-lingering"], De = "journal.agents.filters", Fe = 300 * 1e3, Se = "cubic-bezier(0.2, 0.9, 0.25, 1)", Cn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const l = e, t = Ae(), { rows: o } = t.props.waits, { rows: a } = t.props.progress, { rows: g, failure: m, loaded: $, more: S } = t.props.agents, B = (C) => a.value.find((I) => I.agent_id === C.id) ?? null, q = (C) => {
      var I;
      return ((I = o.value.find((x) => x.agent_id === C.id)) == null ? void 0 : I.reason) ?? "";
    }, z = V("running"), H = V(""), F = JSON.parse(localStorage.getItem(De) || '{"roles":[],"profiles":[],"programs":[]}'), A = V(F), R = d(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: E } = t.props.programs, G = d(() => A.value.roles.length + A.value.profiles.length + A.value.programs.length), P = (C, I) => {
      A.value = xt(A.value, C, I);
    }, K = () => {
      A.value = { roles: [], profiles: [], programs: [] };
    }, _ = (C) => C.slice(0, 1).toUpperCase() + C.slice(1);
    de(A, (C) => localStorage.setItem(De, JSON.stringify(C)));
    const Q = V(25);
    function f() {
      Object.assign(t.state, {
        "agents.show": z.value,
        "agents.search": H.value,
        "agents.limit": String(Q.value),
        "agents.roles": A.value.roles.join(","),
        "agents.profiles": A.value.profiles.join(","),
        "agents.programs": A.value.programs.join(",")
      });
    }
    async function u() {
      return Q.value += 25, f(), await t.reload("agents"), !0;
    }
    de([z, H, A], () => {
      Q.value = 25, f(), t.reload("agents");
    }), f();
    const W = (C) => C.facts ?? null, v = g, r = Je(), w = V([]), c = d(() => new Set(w.value.filter((C) => r.value - C.left < Fe).map((C) => C.row.id))), L = d(() => w.value.filter((C) => c.value.has(C.row.id)).map((C) => C.row)), O = d(() => [...v.value, ...L.value]);
    let Z = "", M = [];
    async function T(C) {
      await t.reload(`card.${C.id}`);
      const I = t.props[`card.${C.id}`].rows.value.find((x) => x.id === C.id);
      I != null && I.ended_at && !w.value.some((x) => x.row.id === C.id) && (w.value = [...w.value, { row: I, left: Date.now() }]);
    }
    de(g, (C) => {
      const I = Z === `${z.value}|${H.value}|${JSON.stringify(A.value)}` && z.value === "running", x = I ? M.filter((U) => !C.some((ge) => ge.id === U.id)) : [];
      Z = `${z.value}|${H.value}|${JSON.stringify(A.value)}`, M = C, w.value = I ? w.value.filter((U) => r.value - U.left < Fe && !C.some((ge) => ge.id === U.row.id)) : [], x.forEach(T);
    }, { immediate: !0 });
    const ae = d(() => !!H.value.trim() || G.value > 0), re = d(() => l.texts[z.value] ?? { title: l.empty, hint: "" }), J = V(null), ue = V(null), ie = V(null), pe = V(null), X = d(() => J.value === null ? null : t.props[`card.${J.value}`].rows.value.find((C) => C.id === J.value) ?? ue.value), je = d(() => X.value ? [X.value] : O.value), Me = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, ce = V(!1);
    let Oe = 0;
    async function Ke(C) {
      if (ce.value) return;
      ce.value = !0, Oe = pe.value.scrollTop;
      const I = ie.value.querySelector(`[data-agent-open="${C.id}"]`);
      if (!Me()) {
        const ve = [...ie.value.querySelectorAll(".agent-row")].filter((le) => !le.contains(I));
        await Promise.all(ve.map((le) => le.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const x = [...I.querySelectorAll(".agent-head, .agent-line")], U = [...x, ...I.querySelectorAll("[data-agent-motion]")], ge = U.map((ve) => ve.getBoundingClientRect());
      if (ue.value = C, J.value = C.id, t.reload(`card.${C.id}`), await Ne(), !Me()) {
        const ve = U.map((le) => le.getBoundingClientRect());
        U.forEach((le, xe) => {
          const he = x.findIndex((He) => He !== le && He.contains(le)), Ye = ge[xe].left - ve[xe].left - (he < 0 ? 0 : ge[he].left - ve[he].left), Qe = ge[xe].top - ve[xe].top - (he < 0 ? 0 : ge[he].top - ve[he].top);
          le.animate([{ transform: `translate(${Ye}px, ${Qe}px)` }, { transform: "none" }], { duration: 280, easing: Se });
        }), ie.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((le) => {
          le.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Se, fill: "backwards" });
        });
      }
      ce.value = !1;
    }
    async function Ve() {
      if (ce.value || !X.value) return;
      ce.value = !0;
      const C = ie.value.querySelector(`[data-agent-open="${J.value}"]`), I = [...C.children], x = Me() ? [] : I.map((U) => U.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(x.map((U) => U.finished)), J.value = null, await Ne(), pe.value.scrollTop = Oe, x.forEach((U) => U.cancel()), Me() || (C.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Se }), ie.value.querySelectorAll(".agent-row").forEach((U) => {
        U.contains(C) || U.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Se });
      })), ce.value = !1;
    }
    const Ze = (C) => J.value === C.id ? Ve() : Ke(C);
    de(H, (C) => C.trim() && (J.value = null)), de(z, () => {
      J.value = null;
    });
    const ze = (C) => {
      C.key === "Escape" && Ve();
    };
    return window.addEventListener("keydown", ze), be(() => window.removeEventListener("keydown", ze)), (C, I) => (n(), s("div", {
      ref_key: "agents",
      ref: ie,
      class: oe(["agents", { focused: X.value, "card-changing": ce.value }])
    }, [
      X.value ? h("", !0) : (n(), N(i(yt), {
        key: 0,
        modelValue: H.value,
        "onUpdate:modelValue": I[1] || (I[1] = (x) => H.value = x),
        placeholder: "Search agents",
        "menu-count": G.value,
        "data-agents-search": ""
      }, {
        menu: y(() => [
          b(i(Re), null, {
            default: y(() => [...I[2] || (I[2] = [
              k("Type", -1)
            ])]),
            _: 1
          }),
          (n(!0), s(D, null, ne(R.value.roles, (x) => (n(), N(i($e), {
            key: x,
            role: "menuitemcheckbox",
            "aria-checked": A.value.roles.includes(x),
            checked: A.value.roles.includes(x),
            "data-filter-role": x,
            onClick: (U) => P("roles", x)
          }, {
            default: y(() => [
              k(p(_(x)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          R.value.profiles.length ? (n(), N(i(Re), { key: 0 }, {
            default: y(() => [...I[3] || (I[3] = [
              k("Profile", -1)
            ])]),
            _: 1
          })) : h("", !0),
          (n(!0), s(D, null, ne(R.value.profiles, (x) => (n(), N(i($e), {
            key: x.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.profiles.includes(x.name),
            checked: A.value.profiles.includes(x.name),
            "data-filter-profile": x.name,
            onClick: (U) => P("profiles", x.name)
          }, {
            default: y(() => [
              k(p(x.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          b(i(Re), null, {
            default: y(() => [...I[4] || (I[4] = [
              k("Program", -1)
            ])]),
            _: 1
          }),
          (n(!0), s(D, null, ne(i(E), (x) => (n(), N(i($e), {
            key: x.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.programs.includes(x.name),
            checked: A.value.programs.includes(x.name),
            "data-filter-program": x.name,
            onClick: (U) => P("programs", x.name)
          }, {
            default: y(() => [
              k(p(x.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          G.value ? (n(), N(i($e), {
            key: 1,
            "data-filter-clear": "",
            onClick: K
          }, {
            default: y(() => [...I[5] || (I[5] = [
              k("Clear filters", -1)
            ])]),
            _: 1
          })) : h("", !0)
        ]),
        default: y(() => [
          b(i(wt), {
            options: R.value.states,
            value: z.value,
            onPick: I[0] || (I[0] = (x) => z.value = x)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      z.value === "retired" && R.value.upgrade_retired ? (n(), s("p", $n, "Retired during the upgrade: " + p(R.value.upgrade_retired), 1)) : h("", !0),
      j("div", {
        ref_key: "list",
        ref: pe,
        class: oe(["agents-view", { "agents-view-open": X.value }])
      }, [
        i($) && !i(m) && !je.value.length && G.value ? (n(), N(i(Ie), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: y(() => [
            b(i(se), {
              small: "",
              "data-empty-clear": "",
              onClick: K
            }, {
              default: y(() => [...I[6] || (I[6] = [
                k("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (n(), N(i(Mt), {
          key: 1,
          moves: "",
          "leaves-at-once": ce.value,
          rows: je.value,
          failure: i(m),
          loaded: i($),
          more: !X.value && i(S),
          older: u,
          empty: re.value.title,
          hint: re.value.hint,
          searching: ae.value
        }, {
          default: y(({ row: x }) => [
            j("div", {
              class: oe(["agent-row", { lingering: c.value.has(x.id) && x.id !== J.value }]),
              "data-agent-row": x.id,
              "data-agent-lingering": c.value.has(x.id) ? "" : null
            }, [
              b(xn, {
                row: x,
                facts: W(x),
                progress: B(x),
                "wait-reason": q(x),
                open: x.id === J.value,
                onToggle: (U) => Ze(x)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, Sn)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, Bn = /* @__PURE__ */ Y(Cn, [["__scopeId", "data-v-fceb20c3"]]);
export {
  Bn as A
};
