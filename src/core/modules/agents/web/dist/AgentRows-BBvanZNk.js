import { openBlock as n, createElementBlock as s, withModifiers as _, unref as i, createTextVNode as w, toDisplayString as p, createVNode as f, createBlock as z, computed as d, createElementVNode as y, createCommentVNode as m, withCtx as k, Fragment as F, renderList as oe, ref as V, watch as de, onUnmounted as ye, defineAsyncComponent as _e, createSlots as et, resolveDynamicComponent as tt, normalizeClass as re, normalizeStyle as Ae, renderSlot as Me, onMounted as at, Teleport as nt, mergeProps as ot, toRef as Be, withKeys as We, nextTick as De } from "vue";
import { peekRef as $e, Icon as Ie, RunningCommand as lt, TimeAgo as Oe, FoldGroup as Pe, TaskStatusIcon as st, useWindow as Te, loadWindowComponent as rt, coalesced as it, READ_RATES as dt, eventMayBeChildOf as ut, InnerTabs as ct, TabBody as gt, SwitchCase as Je, EmptyState as Ve, TextInput as ze, Btn as ae, TextArea as vt, HoverTip as je, TaskBar as pt, useNow as Ge, age as mt, perHour as ht, sinceWords as ft, seenWords as bt, AgentTip as kt, SearchBar as wt, Segmented as yt, MenuLabel as Re, MenuItem as Se, RowList as Mt, toggleFilter as $t } from "@journal/window-kit";
import { _ as G, T as xt } from "./TranscriptRows-Crmxs6Un.js";
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
    return (o, t) => (n(), s("span", St, [
      e.waitReason ? (n(), s("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: t[0] || (t[0] = _((l) => i($e)("test_queue:0"), ["stop"]))
      }, [
        w("Waiting: " + p(e.waitReason) + " ", 1),
        f(i(Ie), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (n(), s("span", Ct, "Waiting")) : (n(), z(i(lt), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, At = /* @__PURE__ */ G(jt, [["__scopeId", "data-v-1b371fb5"]]), Tt = {
  class: "lasting-facts",
  "data-agent-lasting-facts": ""
}, Lt = { key: 0 }, Bt = { "data-agent-driver-name": "" }, Rt = { "data-agent-session-count": "" }, It = { "data-agent-memory-count": "" }, Ot = { key: 1 }, Vt = { "data-agent-session-end-reason": "" }, zt = { key: 2 }, Ht = { "data-agent-retired-at": "" }, Et = { key: 3 }, Nt = { "data-agent-retired-by": "" }, Wt = {
  __name: "AgentLastingFacts",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const o = { cache_passed: "its cache had passed", each_launch: "each job starts a new one", driver_changed: "its driver was changed", replaced_by_person: "a person replaced it", launch_rotation: "its program was changed for the job" }, t = e, l = d(() => t.row.program ? t.row.program.slice(0, 1).toUpperCase() + t.row.program.slice(1) : ""), a = d(() => [l.value, t.row.program_model].filter(Boolean).join(" ")), v = d(() => t.row.replaced_session_end_reason ? o[t.row.replaced_session_end_reason] || t.row.replaced_session_end_reason.replaceAll("_", " ") : "");
    return (M, h) => (n(), s("dl", Tt, [
      a.value ? (n(), s("div", Lt, [
        h[0] || (h[0] = y("dt", null, "Driver", -1)),
        y("dd", Bt, p(a.value), 1)
      ])) : m("", !0),
      y("div", null, [
        h[1] || (h[1] = y("dt", null, "Sessions", -1)),
        y("dd", Rt, p(e.row.session_count ?? 0), 1)
      ]),
      y("div", null, [
        h[2] || (h[2] = y("dt", null, "Memories", -1)),
        y("dd", It, p(e.row.memory_count ?? 0), 1)
      ]),
      v.value ? (n(), s("div", Ot, [
        h[3] || (h[3] = y("dt", null, "Last session ended", -1)),
        y("dd", Vt, p(v.value), 1)
      ])) : m("", !0),
      e.row.retired_at ? (n(), s("div", zt, [
        h[4] || (h[4] = y("dt", null, "Retired", -1)),
        y("dd", Ht, [
          f(i(Oe), {
            at: e.row.retired_at
          }, null, 8, ["at"])
        ])
      ])) : m("", !0),
      e.row.retiring_actor_name ? (n(), s("div", Et, [
        h[5] || (h[5] = y("dt", null, "Retired by", -1)),
        y("dd", Nt, p(e.row.retiring_actor_name), 1)
      ])) : m("", !0)
    ]));
  }
}, Dt = /* @__PURE__ */ G(Wt, [["__scopeId", "data-v-32d69973"]]), qt = ["data-agent-delegated", "onClick"], Ft = { class: "agent-task-number" }, Ut = { class: "agent-task-title" }, Pt = ["title"], Jt = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = o;
    return (l, a) => (n(), z(i(Pe), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: a[0] || (a[0] = (v) => t("toggle"))
    }, {
      default: k(() => [
        (n(!0), s(F, null, oe(e.section.tasks, (v) => (n(), s("button", {
          key: v.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": v.id,
          onClick: (M) => i($e)(`tasks:${v.id}`)
        }, [
          f(i(st), {
            status: v.state
          }, null, 8, ["status"]),
          y("span", Ft, p(v.id), 1),
          y("span", Ut, p(v.title), 1),
          v.plan_id ? (n(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${v.plan_id}: ${v.plan_title}`
          }, "Plan " + p(v.plan_id), 9, Pt)) : m("", !0)
        ], 8, qt))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Gt = /* @__PURE__ */ G(Jt, [["__scopeId", "data-v-ea4ccd6b"]]), Kt = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Zt = {
  key: 1,
  class: "agent-summary",
  "data-agent-resume-reason": ""
}, Yt = {
  key: 3,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, Qt = ["data-peek", "onClick"], Xt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, _t = {
  key: 0,
  class: "agent-helper-brief"
}, ea = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ta = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, aa = "It ended without a report", na = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const o = e, t = ["started", "blocked", "open", "completed"], l = d(() => {
      var c, T;
      return o.row.ended_at && ((T = (c = o.facts) == null ? void 0 : c.job_returned) != null && T.startsWith(aa)) ? o.facts.job_returned : "";
    }), a = d(() => o.tasks.length ? t.map((c) => ({ state: c, label: c.slice(0, 1).toUpperCase() + c.slice(1), tasks: o.tasks.filter((T) => T.state === c || c === "started" && T.state === "testing" || c === "completed" && T.state === "cancelled") })) : []), v = /* @__PURE__ */ new Set(["completed"]), M = V({}), h = (c) => !(M.value[c] ?? v.has(c)), S = (c) => M.value = { ...M.value, [c]: h(c) }, R = Te(), { rows: q } = R.props.reports;
    R.state["reports.agent"] = String(o.row.number);
    const D = d(() => o.row.access === "read-only"), H = d(() => !!o.row.retired_at || o.row.state === "retired"), W = ["tasks", "transcript", "terminal", "file-feed", "reports"], A = d(() => (H.value ? R.tabs.filter((T) => ["reports", "transcript"].includes(T.key)) : D.value ? R.tabs.filter((T) => ["reports", "transcript", "terminal"].includes(T.key)) : [...R.tabs]).sort((T, r) => (W.indexOf(T.key) < 0 ? W.length : W.indexOf(T.key)) - (W.indexOf(r.key) < 0 ? W.length : W.indexOf(r.key)))), I = () => D.value || H.value ? A.value.find((c) => c.key === "transcript") : A.value[0], E = V(I());
    de(E, (c) => {
      R.state.tab = (c == null ? void 0 : c.key) ?? "";
    }, { immediate: !0 }), ye(() => {
      R.state.tab = "";
    }), de(A, (c) => {
      c.some((T) => {
        var r;
        return T.key === ((r = E.value) == null ? void 0 : r.key);
      }) || (E.value = c[0]);
    }), de(() => o.open, (c) => {
      c && (E.value = I());
    });
    const P = Object.fromEntries(R.tabs.filter((c) => c.component).map((c) => [c.key, _e(() => rt(c.component))])), K = V(!1), { data: Y } = R.props.tool, J = d(() => {
      var c;
      return ((c = Y.value) == null ? void 0 : c.tool) ?? "";
    }), Z = d(() => {
      var c;
      return ((c = Y.value) == null ? void 0 : c.note) ?? "";
    }), x = d(() => o.row.role !== "main" && (!o.row.ended_at || o.stoppedWithWork || o.waitReason));
    async function u() {
      !o.open || !x.value || (R.state["tool.agent"] = String(o.row.number), await R.reload("tool"));
    }
    const X = it(u, dt.agentCommand), L = R.follow(["hook_call.*", "process_part.*"], (c) => ut(c, "session_agent_id", /* @__PURE__ */ new Set([o.row.id])) && X());
    return ye(() => L == null ? void 0 : L()), de(() => o.open, (c) => {
      c && u();
    }, { immediate: !0 }), (c, T) => {
      var r;
      return n(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: T[2] || (T[2] = _(() => {
        }, ["stop"]))
      }, [
        f(Dt, { row: e.row }, null, 8, ["row"]),
        e.row.retirement_reason ? (n(), s("p", Kt, "Retirement reason: " + p(e.row.retirement_reason), 1)) : m("", !0),
        e.row.resume_reason ? (n(), s("p", Zt, p(e.row.resume_reason), 1)) : m("", !0),
        x.value ? (n(), z(At, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: J.value,
          note: Z.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0),
        l.value ? (n(), s("p", Yt, p(l.value), 1)) : m("", !0),
        f(i(ct), {
          class: "agent-tabs",
          tabs: A.value,
          active: E.value,
          answer: { tasks: e.tasks.length, reports: i(q).length },
          onChoose: T[0] || (T[0] = (g) => E.value = g)
        }, null, 8, ["tabs", "active", "answer"]),
        f(i(gt), {
          class: "agent-tab-body",
          tab: E.value,
          "data-agent-tab-body": (r = E.value) == null ? void 0 : r.key
        }, {
          default: k(() => {
            var g;
            return [
              f(i(Je), {
                value: (g = E.value) == null ? void 0 : g.key
              }, et({
                reports: k(() => [
                  i(q).length ? m("", !0) : (n(), z(i(Ve), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: k(() => [...T[3] || (T[3] = [
                      w("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (n(!0), s(F, null, oe(i(q), (B) => (n(), s("button", {
                    key: B.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${B.id}`,
                    onClick: (N) => i($e)(`messages:${B.id}`)
                  }, p(B.text), 9, Qt))), 128))
                ]),
                tasks: k(() => {
                  var B;
                  return [
                    e.tasks.length ? m("", !0) : (n(), z(i(Ve), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: k(() => [...T[4] || (T[4] = [
                        w("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (n(!0), s(F, null, oe(a.value, (N) => (n(), z(Gt, {
                      key: N.state,
                      section: N,
                      open: h(N.state),
                      onToggle: (ge) => S(N.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (B = e.facts) != null && B.instruction ? (n(), s(F, { key: 1 }, [
                      T[5] || (T[5] = y("p", { class: "agent-label" }, "Instruction", -1)),
                      y("div", Xt, p(e.facts.instruction), 1)
                    ], 64)) : m("", !0)
                  ];
                }),
                transcript: k(() => {
                  var B;
                  return [
                    D.value ? (n(), s(F, { key: 0 }, [
                      (B = e.facts) != null && B.instruction ? (n(), s("div", _t, [
                        f(i(Pe), {
                          label: "Instruction",
                          open: K.value,
                          "data-agent-section": "instruction",
                          onToggle: T[1] || (T[1] = (N) => K.value = !K.value)
                        }, {
                          default: k(() => [
                            y("div", ea, p(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (n(), s("p", ta, "No job recorded")) : m("", !0)
                    ], 64)) : m("", !0),
                    f(xt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                oe(i(P), (B, N) => ({
                  name: N,
                  fn: k(() => [
                    (n(), z(tt(B), {
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
}, oa = /* @__PURE__ */ G(na, [["__scopeId", "data-v-6d8f6905"]]), la = { class: "action-buttons" }, sa = {
  __name: "AgentDriverForm",
  props: { program: String, model: String, pending: Boolean },
  emits: ["submit", "cancel", "update:program", "update:model"],
  setup(e) {
    return (o, t) => (n(), s("form", {
      "data-agent-driver-form": "",
      onSubmit: t[3] || (t[3] = _((l) => o.$emit("submit"), ["prevent"]))
    }, [
      t[6] || (t[6] = y("p", null, "Starts the next session on this program; the agent keeps its number and memories.", -1)),
      f(i(ze), {
        "model-value": e.program,
        label: "Program",
        disabled: e.pending,
        "data-agent-driver-program": "",
        "onUpdate:modelValue": t[0] || (t[0] = (l) => o.$emit("update:program", l))
      }, null, 8, ["model-value", "disabled"]),
      f(i(ze), {
        "model-value": e.model,
        label: "Model",
        disabled: e.pending,
        "data-agent-driver-model": "",
        "onUpdate:modelValue": t[1] || (t[1] = (l) => o.$emit("update:model", l))
      }, null, 8, ["model-value", "disabled"]),
      y("div", la, [
        f(i(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.program.trim() || !e.model.trim(),
          "data-agent-confirm-driver": ""
        }, {
          default: k(() => [...t[4] || (t[4] = [
            w("Change the driver", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        f(i(ae), {
          small: "",
          disabled: e.pending,
          onClick: t[2] || (t[2] = (l) => o.$emit("cancel"))
        }, {
          default: k(() => [...t[5] || (t[5] = [
            w("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ra = /* @__PURE__ */ G(sa, [["__scopeId", "data-v-c138a4da"]]), ia = { class: "action-field" }, da = ["value", "disabled"], ua = ["value"], ca = { key: 1 }, ga = {
  key: 1,
  class: "action-field"
}, va = { class: "action-buttons" }, pa = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (o, t) => (n(), s("form", {
      onSubmit: t[4] || (t[4] = _((l) => o.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (n(), s(F, { key: 0 }, [
        y("label", ia, [
          t[6] || (t[6] = w("Task ", -1)),
          y("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: t[0] || (t[0] = (l) => o.$emit("update:task", l.target.value))
          }, [
            t[5] || (t[5] = y("option", { value: "" }, "Choose an open task", -1)),
            (n(!0), s(F, null, oe(e.tasks, (l) => (n(), s("option", {
              key: l.id,
              value: String(l.id)
            }, p(l.id) + ": " + p(l.title), 9, ua))), 128))
          ], 40, da)
        ]),
        e.moreTasks ? (n(), z(i(ae), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: t[1] || (t[1] = (l) => o.$emit("more"))
        }, {
          default: k(() => [...t[7] || (t[7] = [
            w("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : m("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (n(), s("p", ca, "No open tasks.")) : m("", !0)
      ], 64)) : (n(), s("label", ga, [
        t[8] || (t[8] = w("Job", -1)),
        f(i(vt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (l) => o.$emit("update:text", l.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      y("div", va, [
        f(i(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: k(() => [...t[9] || (t[9] = [
            w("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        f(i(ae), {
          small: "",
          disabled: e.pending,
          onClick: t[3] || (t[3] = (l) => o.$emit("cancel"))
        }, {
          default: k(() => [...t[10] || (t[10] = [
            w("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ma = /* @__PURE__ */ G(pa, [["__scopeId", "data-v-adde4158"]]), ha = { class: "action-buttons" }, fa = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (o, t) => (n(), s("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = _((l) => o.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = y("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      f(i(ze), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (l) => o.$emit("update:reason", l))
      }, null, 8, ["model-value", "disabled"]),
      y("div", ha, [
        f(i(ae), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: k(() => [...t[3] || (t[3] = [
            w("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        f(i(ae), {
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (l) => o.$emit("cancel"))
        }, {
          default: k(() => [...t[4] || (t[4] = [
            w("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, ba = /* @__PURE__ */ G(fa, [["__scopeId", "data-v-92de7dd6"]]), ka = { class: "action-buttons" }, wa = {
  key: 0,
  role: "alert"
}, ya = {
  key: 1,
  role: "status"
}, Ma = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const o = e, t = Te(), l = V(""), a = V(""), v = V(""), M = V(""), h = V(""), S = V(""), R = V([]), q = V(0), D = V(!1), H = V(!1), W = V(!1), A = V(""), I = V(""), E = d(() => !!o.row.retired_at || o.row.state === "retired"), P = d(() => !E.value && !!o.row.ended_at), K = d(() => {
      var r;
      return P.value && ((r = o.row.job_command) == null ? void 0 : r.length) && !o.row.resume_reason;
    }), Y = d(() => K.value && !H.value && (o.row.job_task_flag ? R.value.some((r) => String(r.id) === S.value) : !!a.value.trim()));
    function J(r) {
      l.value = r, a.value = "", v.value = "", S.value = "", A.value = "", I.value = "";
    }
    async function Z() {
      J("job"), o.row.job_task_flag && (R.value = [], q.value = 0, D.value = !1, await x());
    }
    async function x() {
      if (!H.value) {
        H.value = !0;
        try {
          t.state["jobs.page"] = String(q.value + 1), await t.reload("jobs");
          const r = t.props.jobs;
          A.value = r.failure.value, A.value || (R.value = [...R.value, ...r.rows.value], q.value = r.data.value.page, D.value = r.more.value);
        } finally {
          H.value = !1;
        }
      }
    }
    async function u(r, g) {
      if (!W.value) {
        W.value = !0, A.value = "";
        try {
          const B = await t.run(r);
          A.value = B.ok ? "" : B.error, B.ok && (J(""), I.value = g);
        } finally {
          W.value = !1;
        }
      }
    }
    async function X() {
      if (!Y.value) return;
      const r = o.row.job_task_flag ? [o.row.job_task_flag, S.value] : [a.value.trim()];
      await u([...o.row.job_command, String(o.row.number), ...r], "Job sent.");
    }
    function L() {
      J("driver"), M.value = o.row.program || "", h.value = "";
    }
    async function c() {
      !P.value || l.value !== "driver" || !M.value.trim() || !h.value.trim() || await u(["agent", "driver", String(o.row.number), "--program", M.value.trim(), "--model", h.value.trim()], "Driver changed.");
    }
    async function T() {
      !P.value || l.value !== "retire" || !v.value.trim() || await u(["agent", "retire", String(o.row.number), "--reason", v.value.trim()], "Agent retired permanently.");
    }
    return (r, g) => {
      var B;
      return E.value ? m("", !0) : (n(), s("div", {
        key: 0,
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: g[9] || (g[9] = _(() => {
        }, ["stop"])),
        onKeydown: g[10] || (g[10] = _(() => {
        }, ["stop"]))
      }, [
        y("div", ka, [
          P.value ? (n(), s(F, { key: 0 }, [
            (B = e.row.job_command) != null && B.length ? (n(), z(i(ae), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: W.value || H.value || !K.value,
              onClick: Z
            }, {
              default: k(() => [...g[11] || (g[11] = [
                w("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0),
            e.row.role !== "main" ? (n(), z(i(ae), {
              key: 1,
              small: "",
              "data-agent-driver": "",
              disabled: W.value || H.value,
              onClick: L
            }, {
              default: k(() => [...g[12] || (g[12] = [
                w("Change driver", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0),
            e.row.role !== "main" ? (n(), z(i(ae), {
              key: 2,
              small: "",
              "data-agent-retire": "",
              disabled: W.value || H.value,
              onClick: g[0] || (g[0] = (N) => J("retire"))
            }, {
              default: k(() => [...g[13] || (g[13] = [
                w("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : m("", !0)
          ], 64)) : m("", !0)
        ]),
        f(i(Je), { value: l.value }, {
          job: k(() => [
            f(ma, {
              task: S.value,
              "onUpdate:task": g[1] || (g[1] = (N) => S.value = N),
              text: a.value,
              "onUpdate:text": g[2] || (g[2] = (N) => a.value = N),
              row: e.row,
              tasks: R.value,
              pending: W.value,
              loading: H.value,
              "more-tasks": D.value,
              failure: A.value,
              "job-ready": Y.value,
              onSubmit: X,
              onMore: x,
              onCancel: g[3] || (g[3] = (N) => J(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          driver: k(() => [
            f(ra, {
              program: M.value,
              "onUpdate:program": g[4] || (g[4] = (N) => M.value = N),
              model: h.value,
              "onUpdate:model": g[5] || (g[5] = (N) => h.value = N),
              pending: W.value,
              onSubmit: c,
              onCancel: g[6] || (g[6] = (N) => J(""))
            }, null, 8, ["program", "model", "pending"])
          ]),
          retire: k(() => [
            f(ba, {
              reason: v.value,
              "onUpdate:reason": g[7] || (g[7] = (N) => v.value = N),
              pending: W.value,
              onSubmit: T,
              onCancel: g[8] || (g[8] = (N) => J(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        A.value ? (n(), s("p", wa, p(A.value), 1)) : m("", !0),
        I.value ? (n(), s("p", ya, p(I.value), 1)) : m("", !0)
      ], 32));
    };
  }
}, $a = /* @__PURE__ */ G(Ma, [["__scopeId", "data-v-4ac9e99b"]]), xa = { class: "line" }, Sa = {
  key: 0,
  class: "line",
  "data-agent-since": ""
}, Ca = {
  key: 1,
  class: "line",
  "data-agent-seen": ""
}, ja = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" }, seen: { type: String, default: "" } },
  setup(e) {
    const o = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, l = d(() => o.has(t.state)), a = d(() => [t.doing, t.since, t.seen].filter(Boolean).join(". "));
    return (v, M) => (n(), z(i(je), {
      as: "button",
      place: "corner",
      class: re(["agent-dot", { pulse: l.value }]),
      "data-state": e.state,
      "aria-label": a.value,
      "data-agent-status": "",
      onClick: M[0] || (M[0] = _(() => {
      }, ["stop"]))
    }, {
      tip: k(() => [
        y("b", xa, p(e.doing), 1),
        e.since ? (n(), s("span", Sa, p(e.since), 1)) : m("", !0),
        e.seen ? (n(), s("span", Ca, p(e.seen), 1)) : m("", !0)
      ]),
      default: k(() => [
        M[1] || (M[1] = y("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, Aa = /* @__PURE__ */ G(ja, [["__scopeId", "data-v-1a0bc478"]]), Ta = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, La = (e) => e.filter((o) => o.state !== "cancelled"), qe = (e, o) => e.filter((t) => t.state === o).length;
function Ba({ tasks: e, inHand: o, perHour: t }) {
  const l = La(e), a = qe(l, "completed"), v = Ta[o == null ? void 0 : o.state], M = l.length - a - (o && o.state !== "completed" ? 1 : 0), h = a === l.length;
  return {
    number: o.id,
    title: o.title,
    plan: o.plan_id ?? 0,
    count: `${a} of ${l.length}`,
    taskTip: `${a} of its ${l.length} tasks done${v ? `. This one is ${v.words}.` : "."}`,
    countTip: h ? `All ${l.length} tasks done` : `${a} done, 1 in hand, ${M} to go`,
    paceTip: !h && t ? `About ${t} an hour.` : "",
    rate: !h && t ? `${Math.round(t)}/hour` : "",
    bar: { total: l.length, done: a, testing: qe(l, "testing") }
  };
}
const Ra = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, Ia = {
  key: 0,
  class: "plan",
  "data-agent-job-launch": ""
}, Oa = {
  class: "task-line",
  "data-agent-task-line": ""
}, Va = {
  key: 0,
  class: "plan",
  "data-agent-plan": ""
}, za = {
  key: 1,
  class: "rate",
  "data-agent-rate": ""
}, Ha = { key: 0 }, Ea = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, jobTitle: { type: String, default: "" }, jobLaunch: { type: String, default: "" }, perHour: { type: Number, default: 0 } },
  setup(e) {
    const o = e, t = d(() => o.inHand ? Ba({ tasks: o.tasks, inHand: o.inHand, perHour: o.perHour }) : null);
    return (l, a) => e.job && !t.value ? (n(), s("span", Ra, [
      f(i(je), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: k(() => [
          y("b", null, p(e.job), 1)
        ]),
        default: k(() => [
          w(p(e.jobTitle || "Job"), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (n(), s("span", Ia, p(e.jobLaunch), 1)) : m("", !0)
    ])) : t.value ? (n(), s(F, { key: 1 }, [
      y("span", Oa, [
        f(i(je), {
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${t.value.number}`,
          "aria-label": `Task ${t.value.number}: ${t.value.title}`,
          onClick: a[0] || (a[0] = _((v) => i($e)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: k(() => [
            y("b", null, p(t.value.title), 1),
            y("span", null, p(t.value.taskTip), 1)
          ]),
          default: k(() => [
            w("Task " + p(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"]),
        t.value.plan ? (n(), s("span", Va, "Plan " + p(t.value.plan), 1)) : m("", !0),
        t.value.rate ? (n(), s("span", za, p(t.value.rate), 1)) : m("", !0),
        f(i(je), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: k(() => [
            y("b", null, p(t.value.countTip), 1),
            t.value.paceTip ? (n(), s("span", Ha, p(t.value.paceTip), 1)) : m("", !0)
          ]),
          default: k(() => [
            w(p(t.value.count), 1)
          ]),
          _: 1
        })
      ]),
      f(i(pt), {
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: t.value.bar.total,
        done: t.value.bar.done,
        testing: t.value.bar.testing
      }, null, 8, ["total", "done", "testing"])
    ], 64)) : m("", !0);
  }
}, Na = /* @__PURE__ */ G(Ea, [["__scopeId", "data-v-d39df179"]]), Wa = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Da = ["data-icon", "stroke-width", "innerHTML"], te = {
  __name: "Icon",
  props: {
    name: { type: String, default: "dot" },
    size: { type: Number, default: 0 },
    facing: { type: String, default: "right" },
    bold: Boolean
  },
  setup(e) {
    const o = e, t = { right: 0, down: 90, left: 180, up: 270 }, l = {
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
      agent: Wa,
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
    return (v, M) => (n(), s("svg", {
      class: "ico",
      "data-icon": e.name,
      style: Ae({
        ...e.size ? { "--icon-size": `${e.size}px` } : {},
        ...o.facing === "right" ? {} : { transform: `rotate(${t[o.facing]}deg)` }
      }),
      viewBox: "0 0 16 16",
      fill: "none",
      stroke: "currentColor",
      "stroke-width": e.bold ? 2 : 1.4,
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "aria-hidden": "true",
      innerHTML: a[l[e.name] || e.name] || a.dot
    }, null, 12, Da));
  }
}, qa = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Fa = {
  key: 1,
  class: "menu-item-text"
}, Ua = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (o, t) => (n(), s("button", {
      type: "button",
      class: re(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (n(), s("span", qa, p(e.checked ? "✓" : ""), 1)) : m("", !0),
      e.description ? (n(), s("span", Fa, [
        y("span", null, [
          Me(o.$slots, "default", {}, void 0, !0)
        ]),
        y("small", null, p(e.description), 1)
      ])) : Me(o.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, he = /* @__PURE__ */ G(Ua, [["__scopeId", "data-v-fec99974"]]), Pa = {}, Ja = { class: "menu-label" };
function Ga(e, o) {
  return n(), s("span", Ja, [
    Me(e.$slots, "default", {}, void 0, !0)
  ]);
}
const we = /* @__PURE__ */ G(Pa, [["render", Ga], ["__scopeId", "data-v-aa955b3e"]]), Ka = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, Za = {
  key: 0,
  class: "skills-none"
}, Ya = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: o }) {
    const t = e, l = o, a = d(() => t.skills.filter((M) => M.state === "loaded")), v = d(() => t.skills.filter((M) => M.state !== "loaded"));
    return (M, h) => (n(), s("div", Ka, [
      f(we, null, {
        default: k(() => [...h[1] || (h[1] = [
          w("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      a.value.length ? m("", !0) : (n(), s("p", Za, "None yet. Compacting the conversation empties this list.")),
      (n(!0), s(F, null, oe(a.value, (S) => (n(), s("p", {
        key: S.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        f(te, {
          name: "book",
          size: 12
        }),
        w(p(S.skill), 1)
      ]))), 128)),
      v.value.length ? (n(), s(F, { key: 1 }, [
        f(we, null, {
          default: k(() => [...h[2] || (h[2] = [
            w("Still to read", -1)
          ])]),
          _: 1
        }),
        (n(!0), s(F, null, oe(v.value, (S) => (n(), s("p", {
          key: S.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          f(te, {
            name: "book",
            size: 12
          }),
          w(p(S.skill), 1)
        ]))), 128))
      ], 64)) : m("", !0),
      f(he, {
        "data-agent-skills-browse": "",
        onClick: h[0] || (h[0] = (S) => l("browse"))
      }, {
        default: k(() => [...h[3] || (h[3] = [
          w("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Qa = /* @__PURE__ */ G(Ya, [["__scopeId", "data-v-be514d47"]]), Xa = ["disabled", "title"], _a = { class: "gauge usage" }, en = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: o }) {
    const t = e, l = o, a = d(() => t.windows[0] ?? null), v = d(() => a.value && Number.isFinite(a.value.used_percent) ? Math.max(0, Math.min(100, Math.round(a.value.used_percent))) : null), M = d(() => v.value !== null && v.value >= 100), h = d(() => {
      var R;
      return (R = a.value) != null && R.reset_epoch_seconds ? new Date(a.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), S = d(() => M.value ? `At usage limit: the plan's ${a.value.title} allowance is used up${h.value ? `, starts again ${h.value}` : ""}` : `${v.value}% of the plan's ${a.value.title} allowance used${h.value ? `, starts again ${h.value}` : ""}`);
    return (R, q) => v.value !== null ? (n(), s("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: S.value,
      onClick: q[0] || (q[0] = (D) => l("open", D.currentTarget))
    }, [
      f(te, {
        name: "allowance",
        size: 12
      }),
      q[1] || (q[1] = w()),
      y("span", _a, [
        y("span", {
          style: Ae({ width: `${v.value}%` })
        }, null, 4)
      ]),
      w(" " + p(M.value ? "At usage limit" : `${v.value}%`), 1)
    ], 8, Xa)) : m("", !0);
  }
}, tn = /* @__PURE__ */ G(en, [["__scopeId", "data-v-a36f09dc"]]), an = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (o, t) => (n(), s("span", {
      class: re(["badge", e.tone])
    }, p(e.text), 3));
  }
}, nn = /* @__PURE__ */ G(an, [["__scopeId", "data-v-9e7e1157"]]), on = (e, o, t) => Math.max(o, Math.min(t, e)), Ke = /* @__PURE__ */ new WeakMap(), ln = (e, o) => Ke.set(e, o);
function sn(e, o) {
  for (let t = o; t; t = Ke.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function rn(e, o) {
  const t = (l) => {
    var v, M;
    const a = ((v = e.value) == null ? void 0 : v.element) || ((M = e.value) == null ? void 0 : M.$el) || e.value;
    a && !sn(a, l.target) && o(l);
  };
  window.addEventListener("click", t), ye(() => window.removeEventListener("click", t));
}
const me = 8, dn = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
  setup(e, { expose: o, emit: t }) {
    const l = e, a = V(null), v = (r) => r ? `${r}px` : void 0, M = d(() => ({
      minWidth: v(l.minWidth),
      maxWidth: v(l.maxWidth),
      maxHeight: v(l.maxHeight),
      height: v(l.height)
    })), h = V({ w: 0, h: 0 }), S = V(l.anchor ? l.anchor.getBoundingClientRect() : null), R = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), q = (r) => ({
      left: Math.max(0, r.left),
      top: Math.max(0, r.top),
      right: Math.min(window.innerWidth, r.right),
      bottom: Math.min(window.innerHeight, r.bottom)
    }), D = (r) => {
      const g = r.closest(".pane, .float-window");
      return g ? q(g.getBoundingClientRect()) : R();
    }, H = (r, g) => `${Math.max(0, r ? Math.min(r, g) : g)}px`;
    function W(r, g) {
      return {
        below: r.bottom - g.bottom - l.gap - me,
        above: g.top - r.top - l.gap - me,
        across: r.right - r.left - 2 * me
      };
    }
    function A(r) {
      const g = D(l.anchor), B = W(g, r);
      return h.value.w <= B.across && h.value.h <= Math.max(B.below, B.above) ? g : R();
    }
    const I = d(() => {
      if (!S.value) return M.value;
      const r = S.value, g = A(r), B = W(g, r), { w: N, h: ge } = h.value, fe = l.align === "auto" ? r.left + r.right > g.left + g.right : l.align === "right", be = on(fe ? r.right - N : r.left, g.left + me, Math.max(g.left + me, g.right - N - me)), b = ge > B.below && B.above > B.below ? { bottom: `${window.innerHeight - r.top + l.gap}px`, maxHeight: H(l.maxHeight, B.above) } : { top: `${r.bottom + l.gap}px`, maxHeight: H(l.maxHeight, B.below) };
      return { ...M.value, ...b, left: `${be}px`, maxWidth: H(l.maxWidth, B.across) };
    }), E = t, P = () => [...a.value.querySelectorAll("button:not(:disabled)")];
    function K(r) {
      const g = P(), B = g.indexOf(document.activeElement);
      g[(B + r + g.length) % g.length].focus();
    }
    const Y = { ArrowDown: () => K(1), ArrowUp: () => K(-1), Escape: () => E("close") }, J = (r) => Y[r.key] && (r.preventDefault(), Y[r.key]()), Z = () => a.value && (h.value = { w: a.value.offsetWidth, h: a.value.scrollHeight });
    let x = 0;
    const u = new ResizeObserver(() => {
      cancelAnimationFrame(x), x = requestAnimationFrame(Z);
    });
    rn(a, (r) => l.anchor && !l.anchor.contains(r.target) && E("close"));
    const X = (r, g) => ["top", "left", "right", "bottom"].some((B) => Math.abs(r[B] - g[B]) > 1), L = (r) => r.bottom < 0 || r.top > window.innerHeight;
    let c = 0;
    function T() {
      if (l.anchor) {
        const r = l.anchor.getBoundingClientRect();
        if (!l.anchor.isConnected || L(r)) return E("close");
        X(r, S.value) && (S.value = r);
      }
      c = requestAnimationFrame(T);
    }
    return at(() => {
      l.anchor && a.value && ln(a.value, l.anchor), Z(), a.value && u.observe(a.value), !l.plain && P()[0] && P()[0].focus(), T();
    }), ye(() => {
      u.disconnect(), cancelAnimationFrame(c), cancelAnimationFrame(x);
    }), o({ element: a }), (r, g) => (n(), z(nt, {
      to: "body",
      disabled: !e.anchor
    }, [
      y("div", ot({
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
}), un = /* @__PURE__ */ G(dn, [["__scopeId", "data-v-3d203970"]]);
async function cn(e, o, t) {
  if (!e) return t(o);
  const { target: l, fields: a } = e, v = Object.fromEntries(Object.keys(a).map((S) => [S, l[S]])), M = () => Object.assign(l, v);
  Object.assign(l, a);
  let h = !1;
  try {
    const S = await t(o);
    return h = S.ok, S;
  } finally {
    h || M();
  }
}
function gn(e, o, t, { groups: l, programs: a }) {
  const v = V({}), M = V(""), h = V(!1), S = d(() => !!e.value && !e.value.ended_at), R = d(() => S.value && !!e.value.paused_at);
  async function q(A, I = null) {
    M.value = "";
    const E = await cn(I, A, o);
    return M.value = E.ok ? "" : E.error, t(), E;
  }
  return { groups: l, programs: a, chosen: v, failure: M, asking: h, running: S, paused: R, choose: (A, I) => q(["agent", "control", String(e.value.number), A, I.value], { target: v, fields: { value: { ...v.value, [A]: I.label } } }), stop: () => (h.value = !1, q(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (A) => q(["agent", "launch", A.name]) };
}
function vn(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const pn = ["disabled", "title"], mn = ["disabled", "title"], hn = { class: "gauge" }, fn = ["disabled", "title"], bn = ["disabled"], kn = ["disabled"], wn = {
  key: 4,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, yn = ["title"], Mn = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, $n = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, xn = { class: "gauge" }, Sn = { class: "context-used" }, Cn = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, jn = 75, An = {
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
  setup(e, { emit: o }) {
    const t = e, l = o, a = gn(Be(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => l("changed"), { groups: Be(t, "controlGroups"), programs: Be(t, "agentPrograms") }), v = V(null), M = V(""), h = d(() => a.groups.value.find((x) => x.key === M.value));
    function S(x, u) {
      v.value = x.currentTarget, M.value = u;
    }
    function R() {
      v.value = null, M.value = "", a.asking.value = !1;
    }
    const q = d(() => t.skills.filter((x) => x.state === "loaded"));
    function D(x) {
      S(x, "skills"), l("skills");
    }
    const H = (x) => a.groups.value.some((u) => u.key === x), W = d(() => {
      var x;
      return a.chosen.value.model ?? ((x = I.value) == null ? void 0 : x.model) ?? "";
    }), A = d(() => {
      var x;
      return a.chosen.value.effort ?? ((x = I.value) == null ? void 0 : x.effort) ?? "";
    });
    d(() => !!t.agent && !t.agent.ended_at);
    const I = d(() => {
      var x;
      return ((x = t.usage.agents) == null ? void 0 : x.find((u) => {
        var X;
        return u.id === ((X = t.agent) == null ? void 0 : X.id);
      })) ?? null;
    }), E = d(() => {
      var x;
      return ((x = I.value) == null ? void 0 : x.context_percent) == null ? null : Math.round(I.value.context_percent);
    }), P = (x) => `${Math.round(x / 1e3)}k`, K = d(() => {
      var x;
      return !!((x = I.value) != null && x.context_limit_tokens);
    }), Y = d(() => {
      var x, u;
      return ((x = I.value) == null ? void 0 : x.context_limit_tokens) || ((u = I.value) == null ? void 0 : u.context_window_tokens) || 0;
    }), J = d(() => Y.value ? `${P(I.value.context_tokens ?? 0)} of ${P(Y.value)}` : ""), Z = d(() => {
      var x;
      return (x = I.value) != null && x.cost_dollars ? `$${I.value.cost_dollars.toFixed(2)}` : "";
    });
    return (x, u) => {
      var X;
      return n(), s("div", {
        class: re(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (n(), s(F, { key: 0 }, [
          y("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: u[0] || (u[0] = (L) => S(L, "agent"))
          }, [
            f(te, {
              name: "agents",
              size: 12
            }),
            w(" " + p(((X = e.agentPrograms.find((L) => L.name === e.agent.program)) == null ? void 0 : X.title) || e.agent.program), 1)
          ], 8, pn),
          f(tn, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: u[1] || (u[1] = (L) => l("open", "usage", L))
          }, null, 8, ["windows", "disabled"]),
          E.value !== null ? (n(), s("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${E.value}% full: clear or compact it`,
            onClick: u[2] || (u[2] = (L) => H("context") ? S(L, "context") : l("open", "context", L.currentTarget))
          }, [
            f(te, {
              name: "gauge",
              size: 12
            }),
            u[14] || (u[14] = w()),
            y("span", hn, [
              y("span", {
                style: Ae({ width: `${E.value}%` })
              }, null, 4)
            ]),
            w(" " + p(E.value) + "% ", 1)
          ], 8, mn)) : m("", !0),
          W.value ? (n(), s("button", {
            key: 1,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${W.value}: change the model`,
            onClick: u[3] || (u[3] = (L) => H("model") ? S(L, "model") : null)
          }, [
            f(te, {
              name: "model",
              size: 12
            }),
            w(" " + p(W.value), 1)
          ], 8, fn)) : m("", !0),
          H("effort") || e.card && A.value ? (n(), s("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: u[4] || (u[4] = (L) => S(L, "effort"))
          }, [
            f(te, {
              name: "bolt",
              size: 12
            }),
            w(" " + p(A.value), 1)
          ], 8, bn)) : m("", !0),
          Z.value ? (n(), s("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: u[5] || (u[5] = (L) => l("open", "cost", L.currentTarget))
          }, p(Z.value), 9, kn)) : m("", !0),
          e.branch ? (n(), s("span", wn, [
            f(te, {
              name: "branch",
              size: 12
            }),
            w(" " + p(e.branch), 1)
          ])) : m("", !0),
          e.card ? m("", !0) : (n(), s("button", {
            key: 5,
            type: "button",
            class: re(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: u[6] || (u[6] = (L) => l("open", "jobs", L.currentTarget))
          }, [
            f(te, {
              name: "clock",
              size: 12
            }),
            w(" " + p(e.jobs), 1)
          ], 2)),
          e.run ? (n(), s("button", {
            key: 6,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: D
          }, [
            f(te, {
              name: "book",
              size: 12
            }),
            w(" " + p(q.value.length), 1)
          ])) : m("", !0),
          e.fitness ? (n(), s(F, { key: 7 }, [
            y("button", {
              type: "button",
              class: re(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < jn }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: u[7] || (u[7] = (L) => l("open", "fitness", L.currentTarget))
            }, [
              f(te, {
                name: "heart",
                size: 12
              }),
              w(" " + p(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            y("button", {
              type: "button",
              class: re(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: u[8] || (u[8] = (L) => l("open", "load", L.currentTarget))
            }, [
              f(te, {
                name: "weight",
                size: 12
              }),
              w(" " + p(e.fitness.workload), 1)
            ], 2)
          ], 64)) : m("", !0)
        ], 64)) : e.run && !e.loading ? (n(), s("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: u[9] || (u[9] = (L) => S(L, "start"))
        }, [
          f(te, {
            name: "agents",
            size: 12
          }),
          u[15] || (u[15] = w(" Start an agent", -1))
        ])) : m("", !0),
        u[21] || (u[21] = y("span", { class: "space" }, null, -1)),
        i(a).failure.value ? (n(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: i(a).failure.value
        }, p(i(a).failure.value), 9, yn)) : m("", !0),
        Me(x.$slots, "default", {}, void 0, !0),
        v.value ? (n(), z(un, {
          key: 3,
          anchor: v.value,
          "min-width": 190,
          onClose: R
        }, {
          default: k(() => {
            var L;
            return [
              M.value === "agent" ? (n(), s(F, { key: 0 }, [
                i(a).asking.value ? (n(), s(F, { key: 0 }, [
                  f(we, { "data-agent-stop-ask": "" }, {
                    default: k(() => [...u[16] || (u[16] = [
                      w("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  f(he, {
                    "data-agent-stop-confirm": "",
                    onClick: u[10] || (u[10] = (c) => (R(), i(a).stop()))
                  }, {
                    default: k(() => [...u[17] || (u[17] = [
                      w("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  f(he, {
                    onClick: u[11] || (u[11] = (c) => i(a).asking.value = !1)
                  }, {
                    default: k(() => [...u[18] || (u[18] = [
                      w("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (n(), z(he, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: u[12] || (u[12] = (c) => i(a).asking.value = !0)
                }, {
                  default: k(() => [...u[19] || (u[19] = [
                    w("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : M.value === "start" ? (n(), s(F, { key: 1 }, [
                f(we, null, {
                  default: k(() => [...u[20] || (u[20] = [
                    w("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (n(!0), s(F, null, oe(i(a).programs.value, (c) => (n(), z(he, {
                  key: c.name,
                  "data-agent-program": c.name,
                  onClick: (T) => (R(), i(a).start(c))
                }, {
                  default: k(() => [
                    w(p(c.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : M.value === "skills" ? (n(), z(Qa, {
                key: 2,
                skills: e.skills,
                onBrowse: u[13] || (u[13] = (c) => (R(), l("open", "skills", null)))
              }, null, 8, ["skills"])) : h.value ? (n(), s(F, { key: 3 }, [
                f(we, null, {
                  default: k(() => [
                    w(p(h.value.label), 1)
                  ]),
                  _: 1
                }),
                M.value === "context" ? (n(), s(F, { key: 0 }, [
                  y("p", Mn, p(i(vn)(((L = I.value) == null ? void 0 : L.last_compaction) ?? null)), 1),
                  y("div", $n, [
                    y("span", xn, [
                      y("span", {
                        style: Ae({ width: `${E.value}%` })
                      }, null, 4)
                    ]),
                    y("span", Sn, p(E.value) + "%", 1)
                  ]),
                  J.value ? (n(), s("p", Cn, [
                    w(p(J.value) + " ", 1),
                    K.value ? (n(), z(nn, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : m("", !0)
                  ])) : m("", !0)
                ], 64)) : m("", !0),
                (n(!0), s(F, null, oe(h.value.choices, (c) => (n(), z(he, {
                  key: c.value,
                  "data-agent-choice": c.value,
                  onClick: (T) => (i(a).choose(h.value.key, c), R())
                }, {
                  default: k(() => [
                    w(p(c.label), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-choice", "onClick"]))), 128))
              ], 64)) : m("", !0)
            ];
          }),
          _: 1
        }, 8, ["anchor"])) : m("", !0)
      ], 2);
    };
  }
}, Tn = /* @__PURE__ */ G(An, [["__scopeId", "data-v-c1e2d220"]]), Ln = ["data-agent-open", "aria-expanded", "role", "tabindex"], Bn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Rn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, In = {
  key: 2,
  class: "agent-time",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, On = { class: "agent-line" }, Vn = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, zn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, Hn = {
  key: 1,
  class: "agent-first-dispatched",
  "data-agent-first-dispatched": ""
}, En = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, Nn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), l = { helper: "Helper", reviewer: "Reviewer", main: "Main agent" }, a = e, v = o, M = Ge(), h = d(() => {
      var b, le;
      if ((b = a.facts) != null && b.profile_title) return a.facts.profile_title;
      if ((le = a.facts) != null && le.profile) return a.facts.profile;
      const $ = l[a.row.role] || a.row.role;
      return $.slice(0, 1).toUpperCase() + $.slice(1);
    }), S = d(() => {
      var $;
      return (($ = a.facts) == null ? void 0 : $.tasks) ?? [];
    }), R = d(() => S.value.filter(($) => $.state === "open")), q = d(() => S.value.find(($) => {
      var b;
      return $.id === ((b = a.progress) == null ? void 0 : b.task_id) && $.state === "started";
    })), D = d(() => q.value || S.value.find(($) => {
      var b;
      return $.id === ((b = a.facts) == null ? void 0 : b.task_id);
    }) || S.value.find(($) => t.has($.state)) || R.value[0] || S.value.at(-1)), H = d(() => {
      var $, b, le, ne, ie, ee;
      return a.row.role === "helper" ? (($ = a.facts) == null ? void 0 : $.helper_job) || "" : (b = a.facts) != null && b.job_enabled && (((le = q.value) == null ? void 0 : le.title) || ((ne = a.facts) == null ? void 0 : ne.task_title) || ((ie = R.value[0]) == null ? void 0 : ie.title) || ((ee = S.value.at(-1)) == null ? void 0 : ee.title)) || "";
    }), W = d(() => `${a.row.role} ${a.row.number}`), A = d(() => {
      var $, b;
      return [a.row.program, ($ = a.facts) == null ? void 0 : $.model, (b = a.facts) == null ? void 0 : b.effort, W.value].filter(Boolean).join(" · ");
    }), I = Te(), E = d(() => mt(a.row.process_started_at || a.row.created_at, M.value)), P = /* @__PURE__ */ new Set(["open", "started", "testing"]), K = { fresh: "new conversation", resumed: "resumed" }, Y = d(() => {
      var $, b;
      return [($ = a.facts) == null ? void 0 : $.helper_job_program, K[(b = a.facts) == null ? void 0 : b.occupant_launch]].filter(Boolean).join(", ");
    }), J = d(() => {
      var $;
      return ($ = a.facts) == null ? void 0 : $.work_status;
    }), Z = d(() => !!a.row.ended_at && a.row.role !== "main" && S.value.some(($) => P.has($.state))), x = d(() => {
      var $, b;
      return a.row.state === "running" && (($ = a.facts) == null ? void 0 : $.state) === "at usage limit" && !!((b = a.facts) != null && b.usage_limit_ends_at);
    }), u = ($) => new Date($).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), X = d(() => a.row.halted_at ? `Stopped at the usage limit since ${u(a.row.halted_at)}, goes on at ${u(a.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(a.facts.usage_limit_ends_at).toLocaleString()}`), L = d(() => {
      var $;
      return a.row.retired_at || a.row.state === "retired" ? "retired" : x.value || J.value || a.waitReason || Z.value ? "waiting" : a.row.state === "running" && (($ = a.facts) == null ? void 0 : $.state) || a.row.state;
    }), c = d(() => {
      var $;
      return x.value ? X.value : J.value ? `Status: ${J.value}` : a.waitReason ? `Waiting: ${a.waitReason}` : L.value === "blocked" ? ($ = a.facts) != null && $.blocked_reason ? `Blocked: ${a.facts.blocked_reason}` : "Blocked" : Z.value ? "Stopped with work left" : "";
    }), T = d(() => {
      var $;
      return (($ = a.progress) == null ? void 0 : $.completed_count) ?? S.value.filter((b) => b.state === "completed").length;
    }), r = d(() => {
      var $;
      return ht(T.value, (($ = a.progress) == null ? void 0 : $.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, M.value);
    }), g = d(() => a.row.role === "main" ? 0 : r.value), B = d(() => !!a.row.retired_at || a.row.state === "retired"), N = d(() => B.value ? "Retired" : L.value === "blocked" || L.value === "waiting" ? c.value || (L.value === "blocked" ? "Blocked" : "Waiting") : a.row.ended_at ? "Idle: its process has stopped" : "Working"), ge = d(() => {
      var b;
      if (B.value) return a.row.retired_at;
      const $ = L.value === "blocked" || L.value === "waiting";
      return a.row.ended_at || $ && ((b = a.facts) == null ? void 0 : b.last_activity) || a.row.process_started_at || a.row.created_at;
    }), fe = d(() => ft(ge.value, M.value)), be = d(() => {
      var $;
      return bt(($ = a.facts) == null ? void 0 : $.last_activity, M.value);
    });
    return ($, b) => {
      var le, ne, ie, ee, ke, ve;
      return n(), s("div", {
        class: re(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: b[3] || (b[3] = (Q) => !e.open && v("toggle")),
        onKeydown: [
          b[4] || (b[4] = We(_((Q) => !e.open && v("toggle"), ["self", "prevent"]), ["enter"])),
          b[5] || (b[5] = We(_((Q) => !e.open && v("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        f(i(kt), {
          "agent-id": e.row.id,
          label: h.value,
          class: "agent-head"
        }, {
          default: k(() => {
            var Q;
            return [
              e.open ? (n(), s("button", {
                key: 0,
                type: "button",
                class: "agent-back",
                title: "Back",
                "aria-label": "Back",
                onClick: b[0] || (b[0] = _((Le) => v("toggle"), ["stop"]))
              }, [
                f(i(Ie), {
                  name: "chevronRight",
                  facing: "left",
                  size: 14
                })
              ])) : m("", !0),
              y("span", Bn, p(h.value), 1),
              y("span", Rn, p(((Q = e.facts) == null ? void 0 : Q.given_name) || e.row.id), 1),
              e.open ? m("", !0) : (n(), z(i(Ie), {
                key: 1,
                class: "agent-chevron",
                name: "chevronRight",
                size: 12
              })),
              e.open ? (n(), s("span", In, p(E.value), 1)) : m("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-id", "label"]),
        y("span", On, [
          y("span", Vn, p(A.value), 1),
          (le = e.facts) != null && le.sandbox_off ? (n(), s("span", zn, "sandbox off")) : m("", !0),
          e.open ? (n(), s("span", Hn, [
            b[6] || (b[6] = w("Started ", -1)),
            f(i(Oe), {
              at: e.row.created_at
            }, null, 8, ["at"])
          ])) : m("", !0),
          e.open && ((ne = e.facts) != null && ne.last_activity) ? (n(), s("span", En, [
            b[7] || (b[7] = w("Seen ", -1)),
            f(i(Oe), {
              at: e.facts.last_activity
            }, null, 8, ["at"])
          ])) : m("", !0)
        ]),
        e.open ? (n(), z(Tn, {
          key: 0,
          "agent-programs": i(I).props.programs.rows.value,
          agent: e.row,
          branch: (ie = e.progress) == null ? void 0 : ie.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((ee = e.facts) == null ? void 0 : ee.windows) ?? [] },
          card: ""
        }, {
          default: k(() => [
            f($a, { row: e.row }, null, 8, ["row"]),
            f(i(ae), {
              variant: "ghost",
              small: "",
              "data-agent-inspector": "",
              onClick: b[1] || (b[1] = _((Q) => i($e)(`agents:${e.row.id}`), ["stop"]))
            }, {
              default: k(() => [...b[8] || (b[8] = [
                w("Open inspector", -1)
              ])]),
              _: 1
            }),
            e.row.role === "helper" && !e.row.ended_at ? (n(), z(i(ae), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: b[2] || (b[2] = _((Q) => i(I).run(["helper", "stop", String(e.row.id)]), ["stop"]))
            }, {
              default: k(() => [...b[9] || (b[9] = [
                w("Stop", -1)
              ])]),
              _: 1
            })) : m("", !0)
          ]),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : m("", !0),
        e.open ? m("", !0) : (n(), z(Na, {
          key: 1,
          tasks: S.value,
          "in-hand": e.row.role !== "helper" && ((ke = e.facts) != null && ke.job_enabled) && D.value || null,
          job: e.row.role === "helper" ? H.value : "",
          "job-title": e.row.role === "helper" && ((ve = e.facts) == null ? void 0 : ve.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? Y.value : "",
          "per-hour": g.value
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour"])),
        f(Aa, {
          state: L.value,
          doing: N.value,
          since: fe.value,
          seen: be.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (n(), z(oa, {
          key: 2,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: S.value,
          "stopped-with-work": Z.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : m("", !0)
      ], 42, Ln);
    };
  }
}, Wn = /* @__PURE__ */ G(Nn, [["__scopeId", "data-v-ea312624"]]), Dn = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, qn = ["data-agent-row", "data-agent-lingering"], Fe = "journal.agents.filters", Ue = 300 * 1e3, Ce = "cubic-bezier(0.2, 0.9, 0.25, 1)", Fn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const o = e, t = Te(), { rows: l } = t.props.waits, { rows: a } = t.props.progress, { rows: v, failure: M, loaded: h, more: S } = t.props.agents, R = (j) => a.value.find((O) => O.agent_id === j.id) ?? null, q = (j) => {
      var O;
      return ((O = l.value.find((C) => C.agent_id === j.id)) == null ? void 0 : O.reason) ?? "";
    }, D = V("running"), H = V(""), W = JSON.parse(localStorage.getItem(Fe) || '{"roles":[],"profiles":[],"programs":[]}'), A = V(W), I = d(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: E } = t.props.programs, P = d(() => A.value.roles.length + A.value.profiles.length + A.value.programs.length), K = (j, O) => {
      A.value = $t(A.value, j, O);
    }, Y = () => {
      A.value = { roles: [], profiles: [], programs: [] };
    }, J = (j) => j.slice(0, 1).toUpperCase() + j.slice(1);
    de(A, (j) => localStorage.setItem(Fe, JSON.stringify(j)));
    const Z = V(25);
    function x() {
      Object.assign(t.state, {
        "agents.show": D.value,
        "agents.search": H.value,
        "agents.limit": String(Z.value),
        "agents.roles": A.value.roles.join(","),
        "agents.profiles": A.value.profiles.join(","),
        "agents.programs": A.value.programs.join(",")
      });
    }
    async function u() {
      return Z.value += 25, x(), await t.reload("agents"), !0;
    }
    de([D, H, A], () => {
      Z.value = 25, x(), t.reload("agents");
    }), x();
    const X = (j) => j.facts ?? null, L = v, c = Ge(), T = V([]), r = d(() => new Set(T.value.filter((j) => c.value - j.left < Ue).map((j) => j.row.id))), g = d(() => T.value.filter((j) => r.value.has(j.row.id)).map((j) => j.row)), B = d(() => [...L.value, ...g.value]);
    let N = "", ge = [];
    async function fe(j) {
      await t.reload(`card.${j.id}`);
      const O = t.props[`card.${j.id}`].rows.value.find((C) => C.id === j.id);
      O != null && O.ended_at && !T.value.some((C) => C.row.id === j.id) && (T.value = [...T.value, { row: O, left: Date.now() }]);
    }
    de(v, (j) => {
      const O = N === `${D.value}|${H.value}|${JSON.stringify(A.value)}` && D.value === "running", C = O ? ge.filter((U) => !j.some((ue) => ue.id === U.id)) : [];
      N = `${D.value}|${H.value}|${JSON.stringify(A.value)}`, ge = j, T.value = O ? T.value.filter((U) => c.value - U.left < Ue && !j.some((ue) => ue.id === U.row.id)) : [], C.forEach(fe);
    }, { immediate: !0 });
    const be = d(() => !!H.value.trim() || P.value > 0), $ = d(() => o.texts[D.value] ?? { title: o.empty, hint: "" }), b = V(null), le = V(null), ne = V(null), ie = V(null), ee = d(() => b.value === null ? null : t.props[`card.${b.value}`].rows.value.find((j) => j.id === b.value) ?? le.value), ke = d(() => ee.value ? [ee.value] : B.value), ve = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, Q = V(!1);
    let Le = 0;
    async function Ze(j) {
      if (Q.value) return;
      Q.value = !0, Le = ie.value.scrollTop;
      const O = ne.value.querySelector(`[data-agent-open="${j.id}"]`);
      if (!ve()) {
        const ce = [...ne.value.querySelectorAll(".agent-row")].filter((se) => !se.contains(O));
        await Promise.all(ce.map((se) => se.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const C = [...O.querySelectorAll(".agent-head, .agent-line")], U = [...C, ...O.querySelectorAll("[data-agent-motion]")], ue = U.map((ce) => ce.getBoundingClientRect());
      if (le.value = j, b.value = j.id, t.reload(`card.${j.id}`), await De(), !ve()) {
        const ce = U.map((se) => se.getBoundingClientRect());
        U.forEach((se, xe) => {
          const pe = C.findIndex((Ne) => Ne !== se && Ne.contains(se)), Qe = ue[xe].left - ce[xe].left - (pe < 0 ? 0 : ue[pe].left - ce[pe].left), Xe = ue[xe].top - ce[xe].top - (pe < 0 ? 0 : ue[pe].top - ce[pe].top);
          se.animate([{ transform: `translate(${Qe}px, ${Xe}px)` }, { transform: "none" }], { duration: 280, easing: Ce });
        }), ne.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((se) => {
          se.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Ce, fill: "backwards" });
        });
      }
      Q.value = !1;
    }
    async function He() {
      if (Q.value || !ee.value) return;
      Q.value = !0;
      const j = ne.value.querySelector(`[data-agent-open="${b.value}"]`), O = [...j.children], C = ve() ? [] : O.map((U) => U.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(C.map((U) => U.finished)), b.value = null, await De(), ie.value.scrollTop = Le, C.forEach((U) => U.cancel()), ve() || (j.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Ce }), ne.value.querySelectorAll(".agent-row").forEach((U) => {
        U.contains(j) || U.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Ce });
      })), Q.value = !1;
    }
    const Ye = (j) => b.value === j.id ? He() : Ze(j);
    de(H, (j) => j.trim() && (b.value = null)), de(D, () => {
      b.value = null;
    });
    const Ee = (j) => {
      j.key === "Escape" && He();
    };
    return window.addEventListener("keydown", Ee), ye(() => window.removeEventListener("keydown", Ee)), (j, O) => (n(), s("div", {
      ref_key: "agents",
      ref: ne,
      class: re(["agents", { focused: ee.value, "card-changing": Q.value }])
    }, [
      ee.value ? m("", !0) : (n(), z(i(wt), {
        key: 0,
        modelValue: H.value,
        "onUpdate:modelValue": O[1] || (O[1] = (C) => H.value = C),
        placeholder: "Search agents",
        "menu-count": P.value,
        "data-agents-search": ""
      }, {
        menu: k(() => [
          f(i(Re), null, {
            default: k(() => [...O[2] || (O[2] = [
              w("Type", -1)
            ])]),
            _: 1
          }),
          (n(!0), s(F, null, oe(I.value.roles, (C) => (n(), z(i(Se), {
            key: C,
            role: "menuitemcheckbox",
            "aria-checked": A.value.roles.includes(C),
            checked: A.value.roles.includes(C),
            "data-filter-role": C,
            onClick: (U) => K("roles", C)
          }, {
            default: k(() => [
              w(p(J(C)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          I.value.profiles.length ? (n(), z(i(Re), { key: 0 }, {
            default: k(() => [...O[3] || (O[3] = [
              w("Profile", -1)
            ])]),
            _: 1
          })) : m("", !0),
          (n(!0), s(F, null, oe(I.value.profiles, (C) => (n(), z(i(Se), {
            key: C.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.profiles.includes(C.name),
            checked: A.value.profiles.includes(C.name),
            "data-filter-profile": C.name,
            onClick: (U) => K("profiles", C.name)
          }, {
            default: k(() => [
              w(p(C.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          f(i(Re), null, {
            default: k(() => [...O[4] || (O[4] = [
              w("Program", -1)
            ])]),
            _: 1
          }),
          (n(!0), s(F, null, oe(i(E), (C) => (n(), z(i(Se), {
            key: C.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.programs.includes(C.name),
            checked: A.value.programs.includes(C.name),
            "data-filter-program": C.name,
            onClick: (U) => K("programs", C.name)
          }, {
            default: k(() => [
              w(p(C.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          P.value ? (n(), z(i(Se), {
            key: 1,
            "data-filter-clear": "",
            onClick: Y
          }, {
            default: k(() => [...O[5] || (O[5] = [
              w("Clear filters", -1)
            ])]),
            _: 1
          })) : m("", !0)
        ]),
        default: k(() => [
          f(i(yt), {
            options: I.value.states,
            value: D.value,
            onPick: O[0] || (O[0] = (C) => D.value = C)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      D.value === "retired" && I.value.upgrade_retired ? (n(), s("p", Dn, "Retired during the upgrade: " + p(I.value.upgrade_retired), 1)) : m("", !0),
      y("div", {
        ref_key: "list",
        ref: ie,
        class: re(["agents-view", { "agents-view-open": ee.value }])
      }, [
        i(h) && !i(M) && !ke.value.length && P.value ? (n(), z(i(Ve), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: k(() => [
            f(i(ae), {
              small: "",
              "data-empty-clear": "",
              onClick: Y
            }, {
              default: k(() => [...O[6] || (O[6] = [
                w("Clear filters", -1)
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
          failure: i(M),
          loaded: i(h),
          more: !ee.value && i(S),
          older: u,
          empty: $.value.title,
          hint: $.value.hint,
          searching: be.value
        }, {
          default: k(({ row: C }) => [
            y("div", {
              class: re(["agent-row", { lingering: r.value.has(C.id) && C.id !== b.value }]),
              "data-agent-row": C.id,
              "data-agent-lingering": r.value.has(C.id) ? "" : null
            }, [
              f(Wn, {
                row: C,
                facts: X(C),
                progress: R(C),
                "wait-reason": q(C),
                open: C.id === b.value,
                onToggle: (U) => Ye(C)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, qn)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, Gn = /* @__PURE__ */ G(Fn, [["__scopeId", "data-v-fceb20c3"]]);
export {
  Gn as A
};
