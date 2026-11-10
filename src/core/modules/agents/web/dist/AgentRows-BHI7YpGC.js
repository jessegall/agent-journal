import { openBlock as n, createElementBlock as s, withModifiers as _, unref as i, createTextVNode as k, toDisplayString as m, createVNode as h, createBlock as z, withCtx as b, Fragment as F, renderList as le, createElementVNode as B, createCommentVNode as f, computed as d, ref as O, watch as de, onUnmounted as we, defineAsyncComponent as _e, createSlots as et, resolveDynamicComponent as tt, normalizeClass as re, normalizeStyle as Ae, renderSlot as Me, onMounted as at, Teleport as nt, mergeProps as lt, toRef as Le, withKeys as Ne, nextTick as We } from "vue";
import { peekRef as xe, Icon as Ie, RunningCommand as ot, FoldGroup as Ue, TaskStatusIcon as st, useWindow as Te, loadWindowComponent as rt, coalesced as it, READ_RATES as dt, eventMayBeChildOf as ut, InnerTabs as ct, TabBody as gt, SwitchCase as Je, EmptyState as Ve, TextInput as Oe, Btn as ae, TextArea as vt, HoverTip as je, TaskBar as pt, useNow as Ge, age as mt, perHour as ht, sinceWords as ft, seenWords as bt, AgentTip as kt, TimeAgo as qe, SearchBar as yt, Segmented as wt, MenuLabel as Re, MenuItem as Se, RowList as Mt, toggleFilter as xt } from "@journal/window-kit";
import { _ as G, T as $t } from "./TranscriptRows-Crmxs6Un.js";
const St = {
  class: "agent-command",
  "data-agent-command": ""
}, Ct = {
  key: 1,
  "data-agent-stopped": ""
}, jt = {
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
        onClick: t[0] || (t[0] = _((o) => i(xe)("test_queue:0"), ["stop"]))
      }, [
        k("Waiting: " + m(e.waitReason) + " ", 1),
        h(i(Ie), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (n(), s("span", Ct, "Waiting")) : (n(), z(i(ot), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, At = /* @__PURE__ */ G(jt, [["__scopeId", "data-v-1b371fb5"]]), Tt = ["data-agent-delegated", "onClick"], Bt = { class: "agent-task-number" }, Lt = { class: "agent-task-title" }, Rt = ["title"], It = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const t = l;
    return (o, a) => (n(), z(i(Ue), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: a[0] || (a[0] = (v) => t("toggle"))
    }, {
      default: b(() => [
        (n(!0), s(F, null, le(e.section.tasks, (v) => (n(), s("button", {
          key: v.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": v.id,
          onClick: (w) => i(xe)(`tasks:${v.id}`)
        }, [
          h(i(st), {
            status: v.state
          }, null, 8, ["status"]),
          B("span", Bt, m(v.id), 1),
          B("span", Lt, m(v.title), 1),
          v.plan_id ? (n(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${v.plan_id}: ${v.plan_title}`
          }, "Plan " + m(v.plan_id), 9, Rt)) : f("", !0)
        ], 8, Tt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Vt = /* @__PURE__ */ G(It, [["__scopeId", "data-v-ea4ccd6b"]]), Ot = {
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
      var c, A;
      return l.row.ended_at && ((A = (c = l.facts) == null ? void 0 : c.job_returned) != null && A.startsWith(Ft)) ? l.facts.job_returned : "";
    }), a = d(() => l.tasks.length ? t.map((c) => ({ state: c, label: c.slice(0, 1).toUpperCase() + c.slice(1), tasks: l.tasks.filter((A) => A.state === c || c === "started" && A.state === "testing" || c === "completed" && A.state === "cancelled") })) : []), v = /* @__PURE__ */ new Set(["completed"]), w = O({}), S = (c) => !(w.value[c] ?? v.has(c)), x = (c) => w.value = { ...w.value, [c]: S(c) }, R = Te(), { rows: D } = R.props.reports;
    R.state["reports.agent"] = String(l.row.number);
    const q = d(() => l.row.access === "read-only"), H = d(() => !!l.row.retired_at || l.row.state === "retired"), W = ["tasks", "transcript", "terminal", "file-feed", "reports"], j = d(() => (H.value ? R.tabs.filter((A) => ["reports", "transcript"].includes(A.key)) : q.value ? R.tabs.filter((A) => ["reports", "transcript", "terminal"].includes(A.key)) : [...R.tabs]).sort((A, r) => (W.indexOf(A.key) < 0 ? W.length : W.indexOf(A.key)) - (W.indexOf(r.key) < 0 ? W.length : W.indexOf(r.key)))), I = () => q.value || H.value ? j.value.find((c) => c.key === "transcript") : j.value[0], E = O(I());
    de(E, (c) => {
      R.state.tab = (c == null ? void 0 : c.key) ?? "";
    }, { immediate: !0 }), we(() => {
      R.state.tab = "";
    }), de(j, (c) => {
      c.some((A) => {
        var r;
        return A.key === ((r = E.value) == null ? void 0 : r.key);
      }) || (E.value = c[0]);
    }), de(() => l.open, (c) => {
      c && (E.value = I());
    });
    const U = Object.fromEntries(R.tabs.filter((c) => c.component).map((c) => [c.key, _e(() => rt(c.component))])), K = O(!1), { data: Y } = R.props.tool, J = d(() => {
      var c;
      return ((c = Y.value) == null ? void 0 : c.tool) ?? "";
    }), Z = d(() => {
      var c;
      return ((c = Y.value) == null ? void 0 : c.note) ?? "";
    }), M = d(() => l.row.role !== "main" && (!l.row.ended_at || l.stoppedWithWork || l.waitReason));
    async function u() {
      !l.open || !M.value || (R.state["tool.agent"] = String(l.row.number), await R.reload("tool"));
    }
    const X = it(u, dt.agentCommand), T = R.follow(["hook_call.*", "process_part.*"], (c) => ut(c, "session_agent_id", /* @__PURE__ */ new Set([l.row.id])) && X());
    return we(() => T == null ? void 0 : T()), de(() => l.open, (c) => {
      c && u();
    }, { immediate: !0 }), (c, A) => {
      var r;
      return n(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: A[2] || (A[2] = _(() => {
        }, ["stop"]))
      }, [
        e.row.retirement_reason ? (n(), s("p", Ot, "Retirement reason: " + m(e.row.retirement_reason), 1)) : f("", !0),
        e.row.resume_reason ? (n(), s("p", zt, m(e.row.resume_reason), 1)) : f("", !0),
        M.value ? (n(), z(At, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: J.value,
          note: Z.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : f("", !0),
        o.value ? (n(), s("p", Ht, m(o.value), 1)) : f("", !0),
        h(i(ct), {
          class: "agent-tabs",
          tabs: j.value,
          active: E.value,
          answer: { tasks: e.tasks.length, reports: i(D).length },
          onChoose: A[0] || (A[0] = (g) => E.value = g)
        }, null, 8, ["tabs", "active", "answer"]),
        h(i(gt), {
          class: "agent-tab-body",
          tab: E.value,
          "data-agent-tab-body": (r = E.value) == null ? void 0 : r.key
        }, {
          default: b(() => {
            var g;
            return [
              h(i(Je), {
                value: (g = E.value) == null ? void 0 : g.key
              }, et({
                reports: b(() => [
                  i(D).length ? f("", !0) : (n(), z(i(Ve), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: b(() => [...A[3] || (A[3] = [
                      k("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (n(!0), s(F, null, le(i(D), (L) => (n(), s("button", {
                    key: L.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${L.id}`,
                    onClick: (N) => i(xe)(`messages:${L.id}`)
                  }, m(L.text), 9, Et))), 128))
                ]),
                tasks: b(() => {
                  var L;
                  return [
                    e.tasks.length ? f("", !0) : (n(), z(i(Ve), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: b(() => [...A[4] || (A[4] = [
                        k("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (n(!0), s(F, null, le(a.value, (N) => (n(), z(Vt, {
                      key: N.state,
                      section: N,
                      open: S(N.state),
                      onToggle: (ge) => x(N.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (L = e.facts) != null && L.instruction ? (n(), s(F, { key: 1 }, [
                      A[5] || (A[5] = B("p", { class: "agent-label" }, "Instruction", -1)),
                      B("div", Nt, m(e.facts.instruction), 1)
                    ], 64)) : f("", !0)
                  ];
                }),
                transcript: b(() => {
                  var L;
                  return [
                    q.value ? (n(), s(F, { key: 0 }, [
                      (L = e.facts) != null && L.instruction ? (n(), s("div", Wt, [
                        h(i(Ue), {
                          label: "Instruction",
                          open: K.value,
                          "data-agent-section": "instruction",
                          onToggle: A[1] || (A[1] = (N) => K.value = !K.value)
                        }, {
                          default: b(() => [
                            B("div", qt, m(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (n(), s("p", Dt, "No job recorded")) : f("", !0)
                    ], 64)) : f("", !0),
                    h($t, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                le(i(U), (L, N) => ({
                  name: N,
                  fn: b(() => [
                    (n(), z(tt(L), {
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
}, Ut = /* @__PURE__ */ G(Pt, [["__scopeId", "data-v-2de10293"]]), Jt = { class: "action-buttons" }, Gt = {
  __name: "AgentDriverForm",
  props: { program: String, model: String, pending: Boolean },
  emits: ["submit", "cancel", "update:program", "update:model"],
  setup(e) {
    return (l, t) => (n(), s("form", {
      "data-agent-driver-form": "",
      onSubmit: t[3] || (t[3] = _((o) => l.$emit("submit"), ["prevent"]))
    }, [
      t[6] || (t[6] = B("p", null, "Starts the next session on this program; the agent keeps its number and memories.", -1)),
      h(i(Oe), {
        "model-value": e.program,
        label: "Program",
        disabled: e.pending,
        "data-agent-driver-program": "",
        "onUpdate:modelValue": t[0] || (t[0] = (o) => l.$emit("update:program", o))
      }, null, 8, ["model-value", "disabled"]),
      h(i(Oe), {
        "model-value": e.model,
        label: "Model",
        disabled: e.pending,
        "data-agent-driver-model": "",
        "onUpdate:modelValue": t[1] || (t[1] = (o) => l.$emit("update:model", o))
      }, null, 8, ["model-value", "disabled"]),
      B("div", Jt, [
        h(i(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.program.trim() || !e.model.trim(),
          "data-agent-confirm-driver": ""
        }, {
          default: b(() => [...t[4] || (t[4] = [
            k("Change the driver", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        h(i(ae), {
          small: "",
          disabled: e.pending,
          onClick: t[2] || (t[2] = (o) => l.$emit("cancel"))
        }, {
          default: b(() => [...t[5] || (t[5] = [
            k("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Kt = /* @__PURE__ */ G(Gt, [["__scopeId", "data-v-c138a4da"]]), Zt = { class: "action-field" }, Yt = ["value", "disabled"], Qt = ["value"], Xt = { key: 1 }, _t = {
  key: 1,
  class: "action-field"
}, ea = { class: "action-buttons" }, ta = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (l, t) => (n(), s("form", {
      onSubmit: t[4] || (t[4] = _((o) => l.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (n(), s(F, { key: 0 }, [
        B("label", Zt, [
          t[6] || (t[6] = k("Task ", -1)),
          B("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: t[0] || (t[0] = (o) => l.$emit("update:task", o.target.value))
          }, [
            t[5] || (t[5] = B("option", { value: "" }, "Choose an open task", -1)),
            (n(!0), s(F, null, le(e.tasks, (o) => (n(), s("option", {
              key: o.id,
              value: String(o.id)
            }, m(o.id) + ": " + m(o.title), 9, Qt))), 128))
          ], 40, Yt)
        ]),
        e.moreTasks ? (n(), z(i(ae), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: t[1] || (t[1] = (o) => l.$emit("more"))
        }, {
          default: b(() => [...t[7] || (t[7] = [
            k("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : f("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (n(), s("p", Xt, "No open tasks.")) : f("", !0)
      ], 64)) : (n(), s("label", _t, [
        t[8] || (t[8] = k("Job", -1)),
        h(i(vt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (o) => l.$emit("update:text", o.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      B("div", ea, [
        h(i(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: b(() => [...t[9] || (t[9] = [
            k("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        h(i(ae), {
          small: "",
          disabled: e.pending,
          onClick: t[3] || (t[3] = (o) => l.$emit("cancel"))
        }, {
          default: b(() => [...t[10] || (t[10] = [
            k("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, aa = /* @__PURE__ */ G(ta, [["__scopeId", "data-v-adde4158"]]), na = { class: "action-buttons" }, la = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (l, t) => (n(), s("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = _((o) => l.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = B("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      h(i(Oe), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (o) => l.$emit("update:reason", o))
      }, null, 8, ["model-value", "disabled"]),
      B("div", na, [
        h(i(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: b(() => [...t[3] || (t[3] = [
            k("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        h(i(ae), {
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (o) => l.$emit("cancel"))
        }, {
          default: b(() => [...t[4] || (t[4] = [
            k("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, oa = /* @__PURE__ */ G(la, [["__scopeId", "data-v-92de7dd6"]]), sa = { class: "action-buttons" }, ra = {
  key: 0,
  role: "alert"
}, ia = {
  key: 1,
  role: "status"
}, da = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const l = e, t = Te(), o = O(""), a = O(""), v = O(""), w = O(""), S = O(""), x = O(""), R = O([]), D = O(0), q = O(!1), H = O(!1), W = O(!1), j = O(""), I = O(""), E = d(() => !!l.row.retired_at || l.row.state === "retired"), U = d(() => !E.value && !!l.row.ended_at), K = d(() => {
      var r;
      return U.value && ((r = l.row.job_command) == null ? void 0 : r.length) && !l.row.resume_reason;
    }), Y = d(() => K.value && !H.value && (l.row.job_task_flag ? R.value.some((r) => String(r.id) === x.value) : !!a.value.trim()));
    function J(r) {
      o.value = r, a.value = "", v.value = "", x.value = "", j.value = "", I.value = "";
    }
    async function Z() {
      J("job"), l.row.job_task_flag && (R.value = [], D.value = 0, q.value = !1, await M());
    }
    async function M() {
      if (!H.value) {
        H.value = !0;
        try {
          t.state["jobs.page"] = String(D.value + 1), await t.reload("jobs");
          const r = t.props.jobs;
          j.value = r.failure.value, j.value || (R.value = [...R.value, ...r.rows.value], D.value = r.data.value.page, q.value = r.more.value);
        } finally {
          H.value = !1;
        }
      }
    }
    async function u(r, g) {
      if (!W.value) {
        W.value = !0, j.value = "";
        try {
          const L = await t.run(r);
          j.value = L.ok ? "" : L.error, L.ok && (J(""), I.value = g);
        } finally {
          W.value = !1;
        }
      }
    }
    async function X() {
      if (!Y.value) return;
      const r = l.row.job_task_flag ? [l.row.job_task_flag, x.value] : [a.value.trim()];
      await u([...l.row.job_command, String(l.row.number), ...r], "Job sent.");
    }
    function T() {
      J("driver"), w.value = l.row.program || "", S.value = "";
    }
    async function c() {
      !U.value || o.value !== "driver" || !w.value.trim() || !S.value.trim() || await u(["agent", "driver", String(l.row.number), "--program", w.value.trim(), "--model", S.value.trim()], "Driver changed.");
    }
    async function A() {
      !U.value || o.value !== "retire" || !v.value.trim() || await u(["agent", "retire", String(l.row.number), "--reason", v.value.trim()], "Agent retired permanently.");
    }
    return (r, g) => {
      var L;
      return E.value ? f("", !0) : (n(), s("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: g[9] || (g[9] = _(() => {
        }, ["stop"])),
        onKeydown: g[10] || (g[10] = _(() => {
        }, ["stop"]))
      }, [
        B("div", sa, [
          U.value ? (n(), s(F, { key: 0 }, [
            (L = e.row.job_command) != null && L.length ? (n(), z(i(ae), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: W.value || H.value || !K.value,
              onClick: Z
            }, {
              default: b(() => [...g[11] || (g[11] = [
                k("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0),
            e.row.role !== "main" ? (n(), z(i(ae), {
              key: 1,
              small: "",
              "data-agent-driver": "",
              disabled: W.value || H.value,
              onClick: T
            }, {
              default: b(() => [...g[12] || (g[12] = [
                k("Change driver", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0),
            e.row.role !== "main" ? (n(), z(i(ae), {
              key: 2,
              small: "",
              "data-agent-retire": "",
              disabled: W.value || H.value,
              onClick: g[0] || (g[0] = (N) => J("retire"))
            }, {
              default: b(() => [...g[13] || (g[13] = [
                k("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0)
          ], 64)) : f("", !0)
        ]),
        h(i(Je), { value: o.value }, {
          job: b(() => [
            h(aa, {
              task: x.value,
              "onUpdate:task": g[1] || (g[1] = (N) => x.value = N),
              text: a.value,
              "onUpdate:text": g[2] || (g[2] = (N) => a.value = N),
              row: e.row,
              tasks: R.value,
              pending: W.value,
              loading: H.value,
              "more-tasks": q.value,
              failure: j.value,
              "job-ready": Y.value,
              onSubmit: X,
              onMore: M,
              onCancel: g[3] || (g[3] = (N) => J(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          driver: b(() => [
            h(Kt, {
              program: w.value,
              "onUpdate:program": g[4] || (g[4] = (N) => w.value = N),
              model: S.value,
              "onUpdate:model": g[5] || (g[5] = (N) => S.value = N),
              pending: W.value,
              onSubmit: c,
              onCancel: g[6] || (g[6] = (N) => J(""))
            }, null, 8, ["program", "model", "pending"])
          ]),
          retire: b(() => [
            h(oa, {
              reason: v.value,
              "onUpdate:reason": g[7] || (g[7] = (N) => v.value = N),
              pending: W.value,
              onSubmit: A,
              onCancel: g[8] || (g[8] = (N) => J(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        j.value ? (n(), s("p", ra, m(j.value), 1)) : f("", !0),
        I.value ? (n(), s("p", ia, m(I.value), 1)) : f("", !0)
      ], 32));
    };
  }
}, ua = /* @__PURE__ */ G(da, [["__scopeId", "data-v-4ac9e99b"]]), ca = { class: "line" }, ga = {
  key: 0,
  class: "line",
  "data-agent-since": ""
}, va = {
  key: 1,
  class: "line",
  "data-agent-seen": ""
}, pa = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" }, seen: { type: String, default: "" } },
  setup(e) {
    const l = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, o = d(() => l.has(t.state)), a = d(() => [t.doing, t.since, t.seen].filter(Boolean).join(". "));
    return (v, w) => (n(), z(i(je), {
      as: "button",
      place: "corner",
      class: re(["agent-dot", { pulse: o.value }]),
      "data-state": e.state,
      "aria-label": a.value,
      "data-agent-status": "",
      onClick: w[0] || (w[0] = _(() => {
      }, ["stop"]))
    }, {
      tip: b(() => [
        B("b", ca, m(e.doing), 1),
        e.since ? (n(), s("span", ga, m(e.since), 1)) : f("", !0),
        e.seen ? (n(), s("span", va, m(e.seen), 1)) : f("", !0)
      ]),
      default: b(() => [
        w[1] || (w[1] = B("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, ma = /* @__PURE__ */ G(pa, [["__scopeId", "data-v-1a0bc478"]]), ha = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, fa = (e) => e.filter((l) => l.state !== "cancelled"), De = (e, l) => e.filter((t) => t.state === l).length;
function ba({ tasks: e, inHand: l, perHour: t }) {
  const o = fa(e), a = De(o, "completed"), v = ha[l == null ? void 0 : l.state], w = o.length - a - (l && l.state !== "completed" ? 1 : 0), S = a === o.length;
  return {
    number: l.id,
    title: l.title,
    plan: l.plan_id ?? 0,
    count: `${a} of ${o.length}`,
    taskTip: `${a} of its ${o.length} tasks done${v ? `. This one is ${v.words}.` : "."}`,
    countTip: S ? `All ${o.length} tasks done` : `${a} done, 1 in hand, ${w} to go`,
    paceTip: !S && t ? `About ${t} an hour.` : "",
    rate: !S && t ? `${Math.round(t)}/hour` : "",
    bar: { total: o.length, done: a, testing: De(o, "testing") }
  };
}
const ka = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, ya = {
  key: 0,
  class: "plan",
  "data-agent-job-launch": ""
}, wa = {
  class: "task-line",
  "data-agent-task-line": ""
}, Ma = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, xa = {
  key: 1,
  class: "rate",
  "data-agent-rate": ""
}, $a = { key: 0 }, Sa = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, jobTitle: { type: String, default: "" }, jobLaunch: { type: String, default: "" }, perHour: { type: Number, default: 0 } },
  setup(e) {
    const l = e, t = d(() => l.inHand ? ba({ tasks: l.tasks, inHand: l.inHand, perHour: l.perHour }) : null);
    return (o, a) => e.job && !t.value ? (n(), s("span", ka, [
      h(i(je), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: b(() => [
          B("b", null, m(e.job), 1)
        ]),
        default: b(() => [
          k(m(e.jobTitle || "Job"), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (n(), s("span", ya, m(e.jobLaunch), 1)) : f("", !0)
    ])) : t.value ? (n(), s(F, { key: 1 }, [
      B("span", wa, [
        h(i(je), {
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${t.value.number}`,
          "aria-label": `Task ${t.value.number}: ${t.value.title}`,
          onClick: a[0] || (a[0] = _((v) => i(xe)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: b(() => [
            B("b", null, m(t.value.title), 1),
            B("span", null, m(t.value.taskTip), 1)
          ]),
          default: b(() => [
            k("Task " + m(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"]),
        t.value.plan ? (n(), s("span", Ma, "Plan " + m(t.value.plan), 1)) : f("", !0),
        t.value.rate ? (n(), s("span", xa, m(t.value.rate), 1)) : f("", !0),
        h(i(je), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: b(() => [
            B("b", null, m(t.value.countTip), 1),
            t.value.paceTip ? (n(), s("span", $a, m(t.value.paceTip), 1)) : f("", !0)
          ]),
          default: b(() => [
            k(m(t.value.count), 1)
          ]),
          _: 1
        })
      ]),
      h(i(pt), {
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: t.value.bar.total,
        done: t.value.bar.done,
        testing: t.value.bar.testing
      }, null, 8, ["total", "done", "testing"])
    ], 64)) : f("", !0);
  }
}, Ca = /* @__PURE__ */ G(Sa, [["__scopeId", "data-v-d39df179"]]), ja = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Aa = ["data-icon", "stroke-width", "innerHTML"], te = {
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
      agent: ja,
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
    return (v, w) => (n(), s("svg", {
      class: "ico",
      "data-icon": e.name,
      style: Ae({
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
    }, null, 12, Aa));
  }
}, Ta = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Ba = {
  key: 1,
  class: "menu-item-text"
}, La = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (l, t) => (n(), s("button", {
      type: "button",
      class: re(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (n(), s("span", Ta, m(e.checked ? "✓" : ""), 1)) : f("", !0),
      e.description ? (n(), s("span", Ba, [
        B("span", null, [
          Me(l.$slots, "default", {}, void 0, !0)
        ]),
        B("small", null, m(e.description), 1)
      ])) : Me(l.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, he = /* @__PURE__ */ G(La, [["__scopeId", "data-v-fec99974"]]), Ra = {}, Ia = { class: "menu-label" };
function Va(e, l) {
  return n(), s("span", Ia, [
    Me(e.$slots, "default", {}, void 0, !0)
  ]);
}
const ye = /* @__PURE__ */ G(Ra, [["render", Va], ["__scopeId", "data-v-aa955b3e"]]), Oa = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, za = {
  key: 0,
  class: "skills-none"
}, Ha = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: l }) {
    const t = e, o = l, a = d(() => t.skills.filter((w) => w.state === "loaded")), v = d(() => t.skills.filter((w) => w.state !== "loaded"));
    return (w, S) => (n(), s("div", Oa, [
      h(ye, null, {
        default: b(() => [...S[1] || (S[1] = [
          k("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      a.value.length ? f("", !0) : (n(), s("p", za, "None yet. Compacting the conversation empties this list.")),
      (n(!0), s(F, null, le(a.value, (x) => (n(), s("p", {
        key: x.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        h(te, {
          name: "book",
          size: 12
        }),
        k(m(x.skill), 1)
      ]))), 128)),
      v.value.length ? (n(), s(F, { key: 1 }, [
        h(ye, null, {
          default: b(() => [...S[2] || (S[2] = [
            k("Still to read", -1)
          ])]),
          _: 1
        }),
        (n(!0), s(F, null, le(v.value, (x) => (n(), s("p", {
          key: x.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          h(te, {
            name: "book",
            size: 12
          }),
          k(m(x.skill), 1)
        ]))), 128))
      ], 64)) : f("", !0),
      h(he, {
        "data-agent-skills-browse": "",
        onClick: S[0] || (S[0] = (x) => o("browse"))
      }, {
        default: b(() => [...S[3] || (S[3] = [
          k("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Ea = /* @__PURE__ */ G(Ha, [["__scopeId", "data-v-be514d47"]]), Na = ["disabled", "title"], Wa = { class: "gauge usage" }, qa = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: l }) {
    const t = e, o = l, a = d(() => t.windows[0] ?? null), v = d(() => a.value && Number.isFinite(a.value.used_percent) ? Math.max(0, Math.min(100, Math.round(a.value.used_percent))) : null), w = d(() => v.value !== null && v.value >= 100), S = d(() => {
      var R;
      return (R = a.value) != null && R.reset_epoch_seconds ? new Date(a.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), x = d(() => w.value ? `At usage limit: the plan's ${a.value.title} allowance is used up${S.value ? `, starts again ${S.value}` : ""}` : `${v.value}% of the plan's ${a.value.title} allowance used${S.value ? `, starts again ${S.value}` : ""}`);
    return (R, D) => v.value !== null ? (n(), s("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: x.value,
      onClick: D[0] || (D[0] = (q) => o("open", q.currentTarget))
    }, [
      h(te, {
        name: "allowance",
        size: 12
      }),
      D[1] || (D[1] = k()),
      B("span", Wa, [
        B("span", {
          style: Ae({ width: `${v.value}%` })
        }, null, 4)
      ]),
      k(" " + m(w.value ? "At usage limit" : `${v.value}%`), 1)
    ], 8, Na)) : f("", !0);
  }
}, Da = /* @__PURE__ */ G(qa, [["__scopeId", "data-v-a36f09dc"]]), Fa = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (l, t) => (n(), s("span", {
      class: re(["badge", e.tone])
    }, m(e.text), 3));
  }
}, Pa = /* @__PURE__ */ G(Fa, [["__scopeId", "data-v-9e7e1157"]]), Ua = (e, l, t) => Math.max(l, Math.min(t, e)), Ke = /* @__PURE__ */ new WeakMap(), Ja = (e, l) => Ke.set(e, l);
function Ga(e, l) {
  for (let t = l; t; t = Ke.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function Ka(e, l) {
  const t = (o) => {
    var v, w;
    const a = ((v = e.value) == null ? void 0 : v.element) || ((w = e.value) == null ? void 0 : w.$el) || e.value;
    a && !Ga(a, o.target) && l(o);
  };
  window.addEventListener("click", t), we(() => window.removeEventListener("click", t));
}
const me = 8, Za = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const o = e, a = O(null), v = (r) => r ? `${r}px` : void 0, w = d(() => ({
      minWidth: v(o.minWidth),
      maxWidth: v(o.maxWidth),
      maxHeight: v(o.maxHeight),
      height: v(o.height)
    })), S = O({ w: 0, h: 0 }), x = O(o.anchor ? o.anchor.getBoundingClientRect() : null), R = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), D = (r) => ({
      left: Math.max(0, r.left),
      top: Math.max(0, r.top),
      right: Math.min(window.innerWidth, r.right),
      bottom: Math.min(window.innerHeight, r.bottom)
    }), q = (r) => {
      const g = r.closest(".pane, .float-window");
      return g ? D(g.getBoundingClientRect()) : R();
    }, H = (r, g) => `${Math.max(0, r ? Math.min(r, g) : g)}px`;
    function W(r, g) {
      return {
        below: r.bottom - g.bottom - o.gap - me,
        above: g.top - r.top - o.gap - me,
        across: r.right - r.left - 2 * me
      };
    }
    function j(r) {
      const g = q(o.anchor), L = W(g, r);
      return S.value.w <= L.across && S.value.h <= Math.max(L.below, L.above) ? g : R();
    }
    const I = d(() => {
      if (!x.value) return w.value;
      const r = x.value, g = j(r), L = W(g, r), { w: N, h: ge } = S.value, fe = o.align === "auto" ? r.left + r.right > g.left + g.right : o.align === "right", be = Ua(fe ? r.right - N : r.left, g.left + me, Math.max(g.left + me, g.right - N - me)), p = ge > L.below && L.above > L.below ? { bottom: `${window.innerHeight - r.top + o.gap}px`, maxHeight: H(o.maxHeight, L.above) } : { top: `${r.bottom + o.gap}px`, maxHeight: H(o.maxHeight, L.below) };
      return { ...w.value, ...p, left: `${be}px`, maxWidth: H(o.maxWidth, L.across) };
    }), E = t, U = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function K(r) {
      const g = U(), L = g.indexOf(document.activeElement);
      g[(L + r + g.length) % g.length].focus();
    }
    const Y = { ArrowDown: () => K(1), ArrowUp: () => K(-1), Escape: () => E("close") }, J = (r) => Y[r.key] && (r.preventDefault(), Y[r.key]()), Z = () => a.value && (S.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let M = 0;
    const u = new ResizeObserver(() => {
      cancelAnimationFrame(M), M = requestAnimationFrame(Z);
    });
    Ka(a, (r) => o.anchor && !o.anchor.contains(r.target) && E("close"));
    const X = (r, g) => ["top", "left", "right", "bottom"].some((L) => Math.abs(r[L] - g[L]) > 1), T = (r) => r.bottom < 0 || r.top > window.innerHeight;
    let c = 0;
    function A() {
      if (o.anchor) {
        const r = o.anchor.getBoundingClientRect();
        if (!o.anchor.isConnected || T(r)) return E("close");
        X(r, x.value) && (x.value = r);
      }
      c = requestAnimationFrame(A);
    }
    return at(() => {
      o.anchor && a.value && Ja(a.value, o.anchor), Z(), a.value && u.observe(a.value), !o.plain && U()[0] && U()[0].focus(), A();
    }), we(() => {
      u.disconnect(), cancelAnimationFrame(c), cancelAnimationFrame(M);
    }), l({ element: a }), (r, g) => (n(), z(nt, {
      to: "body",
      disabled: !e.anchor
    }, [
      B("div", lt({
        ref_key: "panel",
        ref: a
      }, r.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: I.value,
        onKeydown: J
      }), [
        Me(r.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Ya = /* @__PURE__ */ G(Za, [["__scopeId", "data-v-3d203970"]]);
async function Qa(e, l, t) {
  if (!e) return t(l);
  const { target: o, fields: a } = e, v = Object.fromEntries(Object.keys(a).map((x) => [x, o[x]])), w = () => Object.assign(o, v);
  Object.assign(o, a);
  let S = !1;
  try {
    const x = await t(l);
    return S = x.ok, x;
  } finally {
    S || w();
  }
}
function Xa(e, l, t, { groups: o, programs: a }) {
  const v = O({}), w = O(""), S = O(!1), x = d(() => !!e.value && !e.value.ended_at), R = d(() => x.value && !!e.value.paused_at);
  async function D(j, I = null) {
    w.value = "";
    const E = await Qa(I, j, l);
    return w.value = E.ok ? "" : E.error, t(), E;
  }
  return { groups: o, programs: a, chosen: v, failure: w, asking: S, running: x, paused: R, choose: (j, I) => D(["agent", "control", String(e.value.number), j, I.value], { target: v, fields: { value: { ...v.value, [j]: I.label } } }), stop: () => (S.value = !1, D(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (j) => D(["agent", "launch", j.name]) };
}
function _a(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const en = ["disabled", "title"], tn = ["disabled", "title"], an = { class: "gauge" }, nn = ["disabled", "title"], ln = ["disabled"], on = ["disabled"], sn = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, rn = ["title"], dn = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, un = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, cn = { class: "gauge" }, gn = { class: "context-used" }, vn = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, pn = 75, mn = {
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
    const t = e, o = l, a = Xa(Le(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => o("changed"), { groups: Le(t, "controlGroups"), programs: Le(t, "agentPrograms") }), v = O(null), w = O(""), S = d(() => a.groups.value.find((M) => M.key === w.value));
    function x(M, u) {
      v.value = M.currentTarget, w.value = u;
    }
    function R() {
      v.value = null, w.value = "", a.asking.value = !1;
    }
    const D = d(() => t.skills.filter((M) => M.state === "loaded"));
    function q(M) {
      x(M, "skills"), o("skills");
    }
    const H = (M) => a.groups.value.some((u) => u.key === M), W = d(() => {
      var M;
      return a.chosen.value.model ?? ((M = I.value) == null ? void 0 : M.model) ?? "";
    }), j = d(() => {
      var M;
      return a.chosen.value.effort ?? ((M = I.value) == null ? void 0 : M.effort) ?? "";
    });
    d(() => !!t.agent && !t.agent.ended_at);
    const I = d(() => {
      var M;
      return ((M = t.usage.agents) == null ? void 0 : M.find((u) => {
        var X;
        return u.id === ((X = t.agent) == null ? void 0 : X.id);
      })) ?? null;
    }), E = d(() => {
      var M;
      return ((M = I.value) == null ? void 0 : M.context_percent) == null ? null : Math.round(I.value.context_percent);
    }), U = (M) => `${Math.round(M / 1e3)}k`, K = d(() => {
      var M;
      return !!((M = I.value) != null && M.context_limit_tokens);
    }), Y = d(() => {
      var M, u;
      return ((M = I.value) == null ? void 0 : M.context_limit_tokens) || ((u = I.value) == null ? void 0 : u.context_window_tokens) || 0;
    }), J = d(() => Y.value ? `${U(I.value.context_tokens ?? 0)} of ${U(Y.value)}` : ""), Z = d(() => {
      var M;
      return (M = I.value) != null && M.cost_dollars ? `$${I.value.cost_dollars.toFixed(2)}` : "";
    });
    return (M, u) => {
      var X;
      return n(), s("div", {
        class: re(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (n(), s(F, { key: 0 }, [
          B("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: u[0] || (u[0] = (T) => x(T, "agent"))
          }, [
            h(te, {
              name: "agents",
              size: 12
            }),
            k(" " + m(((X = e.agentPrograms.find((T) => T.name === e.agent.program)) == null ? void 0 : X.title) || e.agent.program), 1)
          ], 8, en),
          h(Da, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: u[1] || (u[1] = (T) => o("open", "usage", T))
          }, null, 8, ["windows", "disabled"]),
          E.value !== null ? (n(), s("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${E.value}% full: clear or compact it`,
            onClick: u[2] || (u[2] = (T) => H("context") ? x(T, "context") : o("open", "context", T.currentTarget))
          }, [
            h(te, {
              name: "gauge",
              size: 12
            }),
            u[14] || (u[14] = k()),
            B("span", an, [
              B("span", {
                style: Ae({ width: `${E.value}%` })
              }, null, 4)
            ]),
            k(" " + m(E.value) + "% ", 1)
          ], 8, tn)) : f("", !0),
          W.value ? (n(), s("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${W.value}: change the model`,
            onClick: u[3] || (u[3] = (T) => H("model") ? x(T, "model") : null)
          }, [
            h(te, {
              name: "model",
              size: 12
            }),
            k(" " + m(W.value), 1)
          ], 8, nn)) : f("", !0),
          H("effort") || e.card && j.value ? (n(), s("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: u[4] || (u[4] = (T) => x(T, "effort"))
          }, [
            h(te, {
              name: "bolt",
              size: 12
            }),
            k(" " + m(j.value), 1)
          ], 8, ln)) : f("", !0),
          Z.value ? (n(), s("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: u[5] || (u[5] = (T) => o("open", "cost", T.currentTarget))
          }, m(Z.value), 9, on)) : f("", !0),
          e.branch ? (n(), s("span", sn, [
            h(te, {
              name: "branch",
              size: 12
            }),
            k(" " + m(e.branch), 1)
          ])) : f("", !0),
          e.card ? f("", !0) : (n(), s("button", {
            key: 5,
            type: "button",
            class: re(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: u[6] || (u[6] = (T) => o("open", "jobs", T.currentTarget))
          }, [
            h(te, {
              name: "clock",
              size: 12
            }),
            k(" " + m(e.jobs), 1)
          ], 2)),
          e.run ? (n(), s("button", {
            key: 6,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: q
          }, [
            h(te, {
              name: "book",
              size: 12
            }),
            k(" " + m(D.value.length), 1)
          ])) : f("", !0),
          e.fitness ? (n(), s(F, { key: 7 }, [
            B("button", {
              type: "button",
              class: re(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < pn }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: u[7] || (u[7] = (T) => o("open", "fitness", T.currentTarget))
            }, [
              h(te, {
                name: "heart",
                size: 12
              }),
              k(" " + m(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            B("button", {
              type: "button",
              class: re(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: u[8] || (u[8] = (T) => o("open", "load", T.currentTarget))
            }, [
              h(te, {
                name: "weight",
                size: 12
              }),
              k(" " + m(e.fitness.workload), 1)
            ], 2)
          ], 64)) : f("", !0)
        ], 64)) : e.run && !e.loading ? (n(), s("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: u[9] || (u[9] = (T) => x(T, "start"))
        }, [
          h(te, {
            name: "agents",
            size: 12
          }),
          u[15] || (u[15] = k(" Start an agent", -1))
        ])) : f("", !0),
        u[21] || (u[21] = B("span", { class: "space" }, null, -1)),
        i(a).failure.value ? (n(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: i(a).failure.value
        }, m(i(a).failure.value), 9, rn)) : f("", !0),
        Me(M.$slots, "default", {}, void 0, !0),
        v.value ? (n(), z(Ya, {
          key: 3,
          anchor: v.value,
          "min-width": 190,
          onClose: R
        }, {
          default: b(() => {
            var T;
            return [
              w.value === "agent" ? (n(), s(F, { key: 0 }, [
                i(a).asking.value ? (n(), s(F, { key: 0 }, [
                  h(ye, { "data-agent-stop-ask": "" }, {
                    default: b(() => [...u[16] || (u[16] = [
                      k("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  h(he, {
                    "data-agent-stop-confirm": "",
                    onClick: u[10] || (u[10] = (c) => (R(), i(a).stop()))
                  }, {
                    default: b(() => [...u[17] || (u[17] = [
                      k("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  h(he, {
                    onClick: u[11] || (u[11] = (c) => i(a).asking.value = !1)
                  }, {
                    default: b(() => [...u[18] || (u[18] = [
                      k("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (n(), z(he, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: u[12] || (u[12] = (c) => i(a).asking.value = !0)
                }, {
                  default: b(() => [...u[19] || (u[19] = [
                    k("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : w.value === "start" ? (n(), s(F, { key: 1 }, [
                h(ye, null, {
                  default: b(() => [...u[20] || (u[20] = [
                    k("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (n(!0), s(F, null, le(i(a).programs.value, (c) => (n(), z(he, {
                  key: c.name,
                  "data-agent-program": c.name,
                  onClick: (A) => (R(), i(a).start(c))
                }, {
                  default: b(() => [
                    k(m(c.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : w.value === "skills" ? (n(), z(Ea, {
                key: 2,
                skills: e.skills,
                onBrowse: u[13] || (u[13] = (c) => (R(), o("open", "skills", null)))
              }, null, 8, ["skills"])) : S.value ? (n(), s(F, { key: 3 }, [
                h(ye, null, {
                  default: b(() => [
                    k(m(S.value.label), 1)
                  ]),
                  _: 1
                }),
                w.value === "context" ? (n(), s(F, { key: 0 }, [
                  B("p", dn, m(i(_a)(((T = I.value) == null ? void 0 : T.last_compaction) ?? null)), 1),
                  B("div", un, [
                    B("span", cn, [
                      B("span", {
                        style: Ae({ width: `${E.value}%` })
                      }, null, 4)
                    ]),
                    B("span", gn, m(E.value) + "%", 1)
                  ]),
                  J.value ? (n(), s("p", vn, [
                    k(m(J.value) + " ", 1),
                    K.value ? (n(), z(Pa, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : f("", !0)
                  ])) : f("", !0)
                ], 64)) : f("", !0),
                (n(!0), s(F, null, le(S.value.choices, (c) => (n(), z(he, {
                  key: c.value,
                  "data-agent-choice": c.value,
                  onClick: (A) => (i(a).choose(S.value.key, c), R())
                }, {
                  default: b(() => [
                    k(m(c.label), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-choice", "onClick"]))), 128))
              ], 64)) : f("", !0)
            ];
          }),
          _: 1
        }, 8, ["anchor"])) : f("", !0)
      ], 2);
    };
  }
}, hn = /* @__PURE__ */ G(mn, [["__scopeId", "data-v-c1e2d220"]]), fn = ["data-agent-open", "aria-expanded", "role", "tabindex"], bn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, kn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, yn = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, wn = { class: "agent-line" }, Mn = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, xn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, $n = {
  key: 1,
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, Sn = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Cn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), o = { helper: "Helper", reviewer: "Reviewer" }, a = e, v = l, w = Ge(), S = d(() => {
      var p, oe;
      if ((p = a.facts) != null && p.profile_title) return a.facts.profile_title;
      if ((oe = a.facts) != null && oe.profile) return a.facts.profile;
      const y = o[a.row.role] || a.row.role;
      return y.slice(0, 1).toUpperCase() + y.slice(1);
    }), x = d(() => {
      var y;
      return ((y = a.facts) == null ? void 0 : y.tasks) ?? [];
    }), R = d(() => x.value.filter((y) => y.state === "open")), D = d(() => x.value.find((y) => {
      var p;
      return y.id === ((p = a.progress) == null ? void 0 : p.task_id) && y.state === "started";
    })), q = d(() => D.value || x.value.find((y) => {
      var p;
      return y.id === ((p = a.facts) == null ? void 0 : p.task_id);
    }) || x.value.find((y) => t.has(y.state)) || R.value[0] || x.value.at(-1)), H = d(() => {
      var y, p, oe, ne, ie, ee;
      return a.row.role === "helper" ? ((y = a.facts) == null ? void 0 : y.helper_job) || "" : (p = a.facts) != null && p.job_enabled && (((oe = D.value) == null ? void 0 : oe.title) || ((ne = a.facts) == null ? void 0 : ne.task_title) || ((ie = R.value[0]) == null ? void 0 : ie.title) || ((ee = x.value.at(-1)) == null ? void 0 : ee.title)) || "";
    }), W = d(() => `${a.row.role} ${a.row.number}`), j = d(() => {
      var y, p;
      return [a.row.program, (y = a.facts) == null ? void 0 : y.model, (p = a.facts) == null ? void 0 : p.effort, W.value].filter(Boolean).join(" · ");
    }), I = Te(), E = d(() => mt(a.row.process_started_at || a.row.created_at, w.value)), U = /* @__PURE__ */ new Set(["open", "started", "testing"]), K = { fresh: "new conversation", resumed: "resumed" }, Y = d(() => {
      var y, p;
      return [(y = a.facts) == null ? void 0 : y.helper_job_program, K[(p = a.facts) == null ? void 0 : p.occupant_launch]].filter(Boolean).join(", ");
    }), J = d(() => {
      var y;
      return (y = a.facts) == null ? void 0 : y.work_status;
    }), Z = d(() => !!a.row.ended_at && a.row.role !== "main" && x.value.some((y) => U.has(y.state))), M = d(() => {
      var y, p;
      return a.row.state === "running" && ((y = a.facts) == null ? void 0 : y.state) === "at usage limit" && !!((p = a.facts) != null && p.usage_limit_ends_at);
    }), u = (y) => new Date(y).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), X = d(() => a.row.halted_at ? `Stopped at the usage limit since ${u(a.row.halted_at)}, goes on at ${u(a.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(a.facts.usage_limit_ends_at).toLocaleString()}`), T = d(() => {
      var y;
      return a.row.retired_at || a.row.state === "retired" ? "retired" : M.value || J.value || a.waitReason || Z.value ? "waiting" : a.row.state === "running" && ((y = a.facts) == null ? void 0 : y.state) || a.row.state;
    }), c = d(() => {
      var y;
      return M.value ? X.value : J.value ? `Status: ${J.value}` : a.waitReason ? `Waiting: ${a.waitReason}` : T.value === "blocked" ? (y = a.facts) != null && y.blocked_reason ? `Blocked: ${a.facts.blocked_reason}` : "Blocked" : Z.value ? "Stopped with work left" : "";
    }), A = d(() => {
      var y;
      return ((y = a.progress) == null ? void 0 : y.completed_count) ?? x.value.filter((p) => p.state === "completed").length;
    }), r = d(() => {
      var y;
      return ht(A.value, ((y = a.progress) == null ? void 0 : y.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, w.value);
    }), g = d(() => a.row.role === "main" ? 0 : r.value), L = d(() => !!a.row.retired_at || a.row.state === "retired"), N = d(() => L.value ? "Retired" : T.value === "blocked" || T.value === "waiting" ? c.value || (T.value === "blocked" ? "Blocked" : "Waiting") : a.row.ended_at ? "Idle: its process has stopped" : "Working"), ge = d(() => {
      var p;
      if (L.value) return a.row.retired_at;
      const y = T.value === "blocked" || T.value === "waiting";
      return a.row.ended_at || y && ((p = a.facts) == null ? void 0 : p.last_activity) || a.row.process_started_at || a.row.created_at;
    }), fe = d(() => ft(ge.value, w.value)), be = d(() => {
      var y;
      return bt((y = a.facts) == null ? void 0 : y.last_activity, w.value);
    });
    return (y, p) => {
      var oe, ne, ie, ee, ke, ve;
      return n(), s("div", {
        class: re(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: p[3] || (p[3] = (Q) => !e.open && v("toggle")),
        onKeydown: [
          p[4] || (p[4] = Ne(_((Q) => !e.open && v("toggle"), ["self", "prevent"]), ["enter"])),
          p[5] || (p[5] = Ne(_((Q) => !e.open && v("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        h(i(kt), {
          "agent-id": e.row.id,
          label: S.value,
          class: "agent-head"
        }, {
          default: b(() => {
            var Q;
            return [
              e.open ? (n(), s("button", {
                key: 0,
                type: "button",
                class: "agent-back",
                title: "Back",
                "aria-label": "Back",
                onClick: p[0] || (p[0] = _((Be) => v("toggle"), ["stop"]))
              }, [
                h(i(Ie), {
                  name: "chevronRight",
                  facing: "left",
                  size: 14
                })
              ])) : f("", !0),
              B("span", bn, m(S.value), 1),
              B("span", kn, m(((Q = e.facts) == null ? void 0 : Q.given_name) || e.row.id), 1),
              e.open ? f("", !0) : (n(), z(i(Ie), {
                key: 1,
                class: "agent-chevron",
                name: "chevronRight",
                size: 12
              })),
              e.open ? (n(), s("span", yn, m(E.value), 1)) : f("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-id", "label"]),
        B("span", wn, [
          B("span", Mn, m(j.value), 1),
          (oe = e.facts) != null && oe.sandbox_off ? (n(), s("span", xn, "sandbox off")) : f("", !0),
          e.open ? (n(), s("span", $n, [
            p[6] || (p[6] = k("Started ", -1)),
            h(i(qe), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : f("", !0),
          e.open && ((ne = e.facts) != null && ne.last_activity) ? (n(), s("span", Sn, [
            p[7] || (p[7] = k("Seen ", -1)),
            h(i(qe), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : f("", !0)
        ]),
        e.open ? (n(), z(hn, {
          key: 0,
          "agent-programs": i(I).props.programs.rows.value,
          agent: e.row,
          branch: (ie = e.progress) == null ? void 0 : ie.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((ee = e.facts) == null ? void 0 : ee.windows) ?? [] },
          card: ""
        }, {
          default: b(() => [
            h(ua, { row: e.row }, null, 8, ["row"]),
            h(i(ae), {
              variant: "ghost",
              small: "",
              "data-agent-inspector": "",
              onClick: p[1] || (p[1] = _((Q) => i(xe)(`agents:${e.row.id}`), ["stop"]))
            }, {
              default: b(() => [...p[8] || (p[8] = [
                k("Open inspector", -1)
              ])]),
              _: 1
            }),
            e.row.role === "helper" && !e.row.ended_at ? (n(), z(i(ae), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: p[2] || (p[2] = _((Q) => i(I).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: b(() => [...p[9] || (p[9] = [
                k("Stop", -1)
              ])]),
              _: 1
            })) : f("", !0)
          ]),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : f("", !0),
        e.open ? f("", !0) : (n(), z(Ca, {
          key: 1,
          tasks: x.value,
          "in-hand": e.row.role !== "helper" && ((ke = e.facts) != null && ke.job_enabled) && q.value || null,
          job: e.row.role === "helper" ? H.value : "",
          "job-title": e.row.role === "helper" && ((ve = e.facts) == null ? void 0 : ve.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? Y.value : "",
          "per-hour": g.value
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour"])),
        h(ma, {
          state: T.value,
          doing: N.value,
          since: fe.value,
          seen: be.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (n(), z(Ut, {
          key: 2,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: x.value,
          "stopped-with-work": Z.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : f("", !0)
      ], 42, fn);
    };
  }
}, jn = /* @__PURE__ */ G(Cn, [["__scopeId", "data-v-c237d7ff"]]), An = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Tn = ["data-agent-row", "data-agent-lingering"], Fe = "journal.agents.filters", Pe = 300 * 1e3, Ce = "cubic-bezier(0.2, 0.9, 0.25, 1)", Bn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const l = e, t = Te(), { rows: o } = t.props.waits, { rows: a } = t.props.progress, { rows: v, failure: w, loaded: S, more: x } = t.props.agents, R = (C) => a.value.find((V) => V.agent_id === C.id) ?? null, D = (C) => {
      var V;
      return ((V = o.value.find(($) => $.agent_id === C.id)) == null ? void 0 : V.reason) ?? "";
    }, q = O("running"), H = O(""), W = JSON.parse(localStorage.getItem(Fe) || '{"roles":[],"profiles":[],"programs":[]}'), j = O(W), I = d(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: E } = t.props.programs, U = d(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), K = (C, V) => {
      j.value = xt(j.value, C, V);
    }, Y = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, J = (C) => C.slice(0, 1).toUpperCase() + C.slice(1);
    de(j, (C) => localStorage.setItem(Fe, JSON.stringify(C)));
    const Z = O(25);
    function M() {
      Object.assign(t.state, {
        "agents.show": q.value,
        "agents.search": H.value,
        "agents.limit": String(Z.value),
        "agents.roles": j.value.roles.join(","),
        "agents.profiles": j.value.profiles.join(","),
        "agents.programs": j.value.programs.join(",")
      });
    }
    async function u() {
      return Z.value += 25, M(), await t.reload("agents"), !0;
    }
    de([q, H, j], () => {
      Z.value = 25, M(), t.reload("agents");
    }), M();
    const X = (C) => C.facts ?? null, T = v, c = Ge(), A = O([]), r = d(() => new Set(A.value.filter((C) => c.value - C.left < Pe).map((C) => C.row.id))), g = d(() => A.value.filter((C) => r.value.has(C.row.id)).map((C) => C.row)), L = d(() => [...T.value, ...g.value]);
    let N = "", ge = [];
    async function fe(C) {
      await t.reload(`card.${C.id}`);
      const V = t.props[`card.${C.id}`].rows.value.find(($) => $.id === C.id);
      V != null && V.ended_at && !A.value.some(($) => $.row.id === C.id) && (A.value = [...A.value, { row: V, left: Date.now() }]);
    }
    de(v, (C) => {
      const V = N === `${q.value}|${H.value}|${JSON.stringify(j.value)}` && q.value === "running", $ = V ? ge.filter((P) => !C.some((ue) => ue.id === P.id)) : [];
      N = `${q.value}|${H.value}|${JSON.stringify(j.value)}`, ge = C, A.value = V ? A.value.filter((P) => c.value - P.left < Pe && !C.some((ue) => ue.id === P.row.id)) : [], $.forEach(fe);
    }, { immediate: !0 });
    const be = d(() => !!H.value.trim() || U.value > 0), y = d(() => l.texts[q.value] ?? { title: l.empty, hint: "" }), p = O(null), oe = O(null), ne = O(null), ie = O(null), ee = d(() => p.value === null ? null : t.props[`card.${p.value}`].rows.value.find((C) => C.id === p.value) ?? oe.value), ke = d(() => ee.value ? [ee.value] : L.value), ve = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, Q = O(!1);
    let Be = 0;
    async function Ze(C) {
      if (Q.value) return;
      Q.value = !0, Be = ie.value.scrollTop;
      const V = ne.value.querySelector(`[data-agent-open="${C.id}"]`);
      if (!ve()) {
        const ce = [...ne.value.querySelectorAll(".agent-row")].filter((se) => !se.contains(V));
        await Promise.all(ce.map((se) => se.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const $ = [...V.querySelectorAll(".agent-head, .agent-line")], P = [...$, ...V.querySelectorAll("[data-agent-motion]")], ue = P.map((ce) => ce.getBoundingClientRect());
      if (oe.value = C, p.value = C.id, t.reload(`card.${C.id}`), await We(), !ve()) {
        const ce = P.map((se) => se.getBoundingClientRect());
        P.forEach((se, $e) => {
          const pe = $.findIndex((Ee) => Ee !== se && Ee.contains(se)), Qe = ue[$e].left - ce[$e].left - (pe < 0 ? 0 : ue[pe].left - ce[pe].left), Xe = ue[$e].top - ce[$e].top - (pe < 0 ? 0 : ue[pe].top - ce[pe].top);
          se.animate([{ transform: `translate(${Qe}px, ${Xe}px)` }, { transform: "none" }], { duration: 280, easing: Ce });
        }), ne.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((se) => {
          se.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Ce, fill: "backwards" });
        });
      }
      Q.value = !1;
    }
    async function ze() {
      if (Q.value || !ee.value) return;
      Q.value = !0;
      const C = ne.value.querySelector(`[data-agent-open="${p.value}"]`), V = [...C.children], $ = ve() ? [] : V.map((P) => P.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all($.map((P) => P.finished)), p.value = null, await We(), ie.value.scrollTop = Be, $.forEach((P) => P.cancel()), ve() || (C.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Ce }), ne.value.querySelectorAll(".agent-row").forEach((P) => {
        P.contains(C) || P.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Ce });
      })), Q.value = !1;
    }
    const Ye = (C) => p.value === C.id ? ze() : Ze(C);
    de(H, (C) => C.trim() && (p.value = null)), de(q, () => {
      p.value = null;
    });
    const He = (C) => {
      C.key === "Escape" && ze();
    };
    return window.addEventListener("keydown", He), we(() => window.removeEventListener("keydown", He)), (C, V) => (n(), s("div", {
      ref_key: "agents",
      ref: ne,
      class: re(["agents", { focused: ee.value, "card-changing": Q.value }])
    }, [
      ee.value ? f("", !0) : (n(), z(i(yt), {
        key: 0,
        modelValue: H.value,
        "onUpdate:modelValue": V[1] || (V[1] = ($) => H.value = $),
        placeholder: "Search agents",
        "menu-count": U.value,
        "data-agents-search": ""
      }, {
        menu: b(() => [
          h(i(Re), null, {
            default: b(() => [...V[2] || (V[2] = [
              k("Type", -1)
            ])]),
            _: 1
          }),
          (n(!0), s(F, null, le(I.value.roles, ($) => (n(), z(i(Se), {
            key: $,
            role: "menuitemcheckbox",
            "aria-checked": j.value.roles.includes($),
            checked: j.value.roles.includes($),
            "data-filter-role": $,
            onClick: (P) => K("roles", $)
          }, {
            default: b(() => [
              k(m(J($)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          I.value.profiles.length ? (n(), z(i(Re), { key: 0 }, {
            default: b(() => [...V[3] || (V[3] = [
              k("Profile", -1)
            ])]),
            _: 1
          })) : f("", !0),
          (n(!0), s(F, null, le(I.value.profiles, ($) => (n(), z(i(Se), {
            key: $.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.profiles.includes($.name),
            checked: j.value.profiles.includes($.name),
            "data-filter-profile": $.name,
            onClick: (P) => K("profiles", $.name)
          }, {
            default: b(() => [
              k(m($.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          h(i(Re), null, {
            default: b(() => [...V[4] || (V[4] = [
              k("Program", -1)
            ])]),
            _: 1
          }),
          (n(!0), s(F, null, le(i(E), ($) => (n(), z(i(Se), {
            key: $.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.programs.includes($.name),
            checked: j.value.programs.includes($.name),
            "data-filter-program": $.name,
            onClick: (P) => K("programs", $.name)
          }, {
            default: b(() => [
              k(m($.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          U.value ? (n(), z(i(Se), {
            key: 1,
            "data-filter-clear": "",
            onClick: Y
          }, {
            default: b(() => [...V[5] || (V[5] = [
              k("Clear filters", -1)
            ])]),
            _: 1
          })) : f("", !0)
        ]),
        default: b(() => [
          h(i(wt), {
            options: I.value.states,
            value: q.value,
            onPick: V[0] || (V[0] = ($) => q.value = $)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      q.value === "retired" && I.value.upgrade_retired ? (n(), s("p", An, "Retired during the upgrade: " + m(I.value.upgrade_retired), 1)) : f("", !0),
      B("div", {
        ref_key: "list",
        ref: ie,
        class: re(["agents-view", { "agents-view-open": ee.value }])
      }, [
        i(S) && !i(w) && !ke.value.length && U.value ? (n(), z(i(Ve), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: b(() => [
            h(i(ae), {
              small: "",
              "data-empty-clear": "",
              onClick: Y
            }, {
              default: b(() => [...V[6] || (V[6] = [
                k("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (n(), z(i(Mt), {
          key: 1,
          moves: "",
          "leaves-at-once": Q.value,
          rows: ke.value,
          failure: i(w),
          loaded: i(S),
          more: !ee.value && i(x),
          older: u,
          empty: y.value.title,
          hint: y.value.hint,
          searching: be.value
        }, {
          default: b(({ row: $ }) => [
            B("div", {
              class: re(["agent-row", { lingering: r.value.has($.id) && $.id !== p.value }]),
              "data-agent-row": $.id,
              "data-agent-lingering": r.value.has($.id) ? "" : null
            }, [
              h(jn, {
                row: $,
                facts: X($),
                progress: R($),
                "wait-reason": D($),
                open: $.id === p.value,
                onToggle: (P) => Ye($)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, Tn)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, Vn = /* @__PURE__ */ G(Bn, [["__scopeId", "data-v-fceb20c3"]]);
export {
  Vn as A
};
