import { openBlock as a, createElementBlock as s, withModifiers as ee, createElementVNode as y, createVNode as g, unref as i, withCtx as v, createTextVNode as f, Fragment as W, renderList as te, toDisplayString as u, createBlock as N, createCommentVNode as k, ref as z, computed as c, watch as ge, onUnmounted as Ce, defineAsyncComponent as lt, createSlots as ot, resolveDynamicComponent as st, normalizeClass as de, normalizeStyle as Le, renderSlot as Te, onMounted as it, Teleport as rt, mergeProps as dt, toRef as Oe, withKeys as qe, nextTick as Fe } from "vue";
import { TextInput as Ee, Btn as _, TextArea as ut, TimeAgo as Je, useWindow as Re, SwitchCase as Ke, peekRef as $e, Icon as ze, RunningCommand as ct, FoldGroup as Ze, TaskStatusIcon as gt, loadWindowComponent as vt, coalesced as pt, READ_RATES as mt, eventMayBeChildOf as ht, InnerTabs as ft, TabBody as bt, EmptyState as He, HoverTip as fe, TaskBar as Pe, useNow as Ye, agentTitle as kt, agentNumber as yt, perHour as wt, sinceWords as Mt, seenWords as $t, AgentTip as xt, SearchBar as St, Segmented as Ct, MenuLabel as Ie, MenuItem as je, RowList as Tt, toggleFilter as At } from "@journal/window-kit";
import { _ as Z, T as jt } from "./TranscriptRows-Crmxs6Un.js";
const Bt = { class: "action-buttons" }, Lt = {
  __name: "AgentDriverForm",
  props: { program: String, model: String, pending: Boolean },
  emits: ["submit", "cancel", "update:program", "update:model"],
  setup(e) {
    return (l, t) => (a(), s("form", {
      "data-agent-driver-form": "",
      onSubmit: t[3] || (t[3] = ee((o) => l.$emit("submit"), ["prevent"]))
    }, [
      t[6] || (t[6] = y("p", null, "Starts the next session on this program; the agent keeps its number and memories.", -1)),
      g(i(Ee), {
        "model-value": e.program,
        label: "Program",
        disabled: e.pending,
        "data-agent-driver-program": "",
        "onUpdate:modelValue": t[0] || (t[0] = (o) => l.$emit("update:program", o))
      }, null, 8, ["model-value", "disabled"]),
      g(i(Ee), {
        "model-value": e.model,
        label: "Model",
        disabled: e.pending,
        "data-agent-driver-model": "",
        "onUpdate:modelValue": t[1] || (t[1] = (o) => l.$emit("update:model", o))
      }, null, 8, ["model-value", "disabled"]),
      y("div", Bt, [
        g(i(_), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.program.trim() || !e.model.trim(),
          "data-agent-confirm-driver": ""
        }, {
          default: v(() => [...t[4] || (t[4] = [
            f("Change the driver", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        g(i(_), {
          small: "",
          disabled: e.pending,
          onClick: t[2] || (t[2] = (o) => l.$emit("cancel"))
        }, {
          default: v(() => [...t[5] || (t[5] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Rt = /* @__PURE__ */ Z(Lt, [["__scopeId", "data-v-c138a4da"]]), Ot = { class: "action-field" }, It = ["value", "disabled"], Vt = ["value"], Et = { key: 1 }, zt = {
  key: 1,
  class: "action-field"
}, Ht = { class: "action-buttons" }, Nt = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (l, t) => (a(), s("form", {
      onSubmit: t[4] || (t[4] = ee((o) => l.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (a(), s(W, { key: 0 }, [
        y("label", Ot, [
          t[6] || (t[6] = f("Task ", -1)),
          y("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: t[0] || (t[0] = (o) => l.$emit("update:task", o.target.value))
          }, [
            t[5] || (t[5] = y("option", { value: "" }, "Choose an open task", -1)),
            (a(!0), s(W, null, te(e.tasks, (o) => (a(), s("option", {
              key: o.id,
              value: String(o.id)
            }, u(o.id) + ": " + u(o.title), 9, Vt))), 128))
          ], 40, It)
        ]),
        e.moreTasks ? (a(), N(i(_), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: t[1] || (t[1] = (o) => l.$emit("more"))
        }, {
          default: v(() => [...t[7] || (t[7] = [
            f("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : k("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (a(), s("p", Et, "No open tasks.")) : k("", !0)
      ], 64)) : (a(), s("label", zt, [
        t[8] || (t[8] = f("Job", -1)),
        g(i(ut), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (o) => l.$emit("update:text", o.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      y("div", Ht, [
        g(i(_), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: v(() => [...t[9] || (t[9] = [
            f("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        g(i(_), {
          small: "",
          disabled: e.pending,
          onClick: t[3] || (t[3] = (o) => l.$emit("cancel"))
        }, {
          default: v(() => [...t[10] || (t[10] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Wt = /* @__PURE__ */ Z(Nt, [["__scopeId", "data-v-adde4158"]]), Dt = { class: "action-buttons" }, qt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (l, t) => (a(), s("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = ee((o) => l.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = y("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      g(i(Ee), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (o) => l.$emit("update:reason", o))
      }, null, 8, ["model-value", "disabled"]),
      y("div", Dt, [
        g(i(_), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: v(() => [...t[3] || (t[3] = [
            f("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        g(i(_), {
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (o) => l.$emit("cancel"))
        }, {
          default: v(() => [...t[4] || (t[4] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Ft = /* @__PURE__ */ Z(qt, [["__scopeId", "data-v-92de7dd6"]]), Pt = {
  class: "session-history",
  "data-agent-session-history": ""
}, Ut = { key: 0 }, Gt = { key: 0 }, Jt = { "data-agent-session-state": "" }, Kt = { class: "action-buttons" }, Zt = {
  __name: "AgentSessionHistory",
  props: { sessions: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e) {
    return (l, t) => (a(), s("div", Pt, [
      e.sessions.length ? k("", !0) : (a(), s("p", Ut, "This agent has no session in its history.")),
      y("ol", null, [
        (a(!0), s(W, null, te(e.sessions, (o) => (a(), s("li", {
          key: o.session,
          "data-agent-session": ""
        }, [
          y("span", null, u([o.program, o.model].filter(Boolean).join(" ")), 1),
          o.started_at ? (a(), s("span", Gt, [
            t[1] || (t[1] = f("Started ", -1)),
            g(i(Je), {
              at: o.started_at
            }, null, 8, ["at"])
          ])) : k("", !0),
          y("span", Jt, u(o.end_reason ? `Ended: ${o.end_reason.replaceAll("_", " ")}` : o.started_at ? "Running" : "Not started"), 1),
          y("code", null, u(o.session), 1)
        ]))), 128))
      ]),
      y("div", Kt, [
        g(i(_), {
          small: "",
          onClick: t[0] || (t[0] = (o) => l.$emit("close"))
        }, {
          default: v(() => [...t[2] || (t[2] = [
            f("Close", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Yt = /* @__PURE__ */ Z(Zt, [["__scopeId", "data-v-0d688bd9"]]), Xt = { class: "action-buttons" }, Qt = {
  key: 0,
  role: "alert"
}, _t = {
  key: 1,
  role: "status"
}, ea = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 }, held: { type: Boolean, default: !1 } },
  setup(e) {
    const l = e, t = Re(), o = z(""), r = z(""), n = z(""), w = z(""), x = z(""), C = z(""), j = z([]), O = z(0), F = z(!1), V = z(!1), D = z(!1), T = z(""), E = z(""), q = z([]), X = c(() => !!l.row.retired_at || l.row.state === "retired"), G = c(() => !X.value && !!l.row.ended_at), Q = c(() => {
      var B;
      return G.value && ((B = l.row.job_command) == null ? void 0 : B.length) && !l.row.resume_reason;
    }), ne = c(() => Q.value && !V.value && (l.row.job_task_flag ? j.value.some((B) => String(B.id) === C.value) : !!r.value.trim()));
    function P(B) {
      o.value = B, r.value = "", n.value = "", C.value = "", T.value = "", E.value = "";
    }
    async function Y() {
      P("job"), l.row.job_task_flag && (j.value = [], O.value = 0, F.value = !1, await M());
    }
    async function M() {
      if (!V.value) {
        V.value = !0;
        try {
          t.state["jobs.page"] = String(O.value + 1), await t.reload("jobs");
          const B = t.props.jobs;
          T.value = B.failure.value, T.value || (j.value = [...j.value, ...B.rows.value], O.value = B.data.value.page, F.value = B.more.value);
        } finally {
          V.value = !1;
        }
      }
    }
    async function p() {
      await J(["process", "lift-hold", String(l.row.number)], "Hold lifted.");
    }
    async function J(B, A) {
      if (!D.value) {
        D.value = !0, T.value = "";
        try {
          const se = await t.run(B);
          T.value = se.ok ? "" : se.error, se.ok && (P(""), E.value = A);
        } finally {
          D.value = !1;
        }
      }
    }
    async function m() {
      if (!ne.value) return;
      const B = l.row.job_task_flag ? [l.row.job_task_flag, C.value] : [r.value.trim()];
      await J([...l.row.job_command, String(l.row.number), ...B], "Job sent.");
    }
    async function h() {
      if (!D.value) {
        D.value = !0;
        try {
          const B = await t.run(["agent", "sessions", String(l.row.number)]);
          P(B.ok ? "history" : ""), T.value = B.ok ? "" : B.error, q.value = B.ok ? B.value.rows : [];
        } finally {
          D.value = !1;
        }
      }
    }
    function d() {
      P("driver"), w.value = l.row.program || "", x.value = "";
    }
    async function R() {
      !G.value || o.value !== "driver" || !w.value.trim() || !x.value.trim() || await J(["agent", "driver", String(l.row.number), "--program", w.value.trim(), "--model", x.value.trim()], "Driver changed.");
    }
    async function H() {
      !G.value || o.value !== "retire" || !n.value.trim() || await J(["agent", "retire", String(l.row.number), "--reason", n.value.trim()], "Agent retired permanently.");
    }
    return (B, A) => {
      var se;
      return a(), s("div", {
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: A[10] || (A[10] = ee(() => {
        }, ["stop"])),
        onKeydown: A[11] || (A[11] = ee(() => {
        }, ["stop"]))
      }, [
        y("div", Xt, [
          g(i(_), {
            small: "",
            "data-agent-history": "",
            disabled: D.value || V.value,
            onClick: h
          }, {
            default: v(() => [...A[12] || (A[12] = [
              f("Session history", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          e.held ? (a(), N(i(_), {
            key: 0,
            small: "",
            "data-agent-lift-hold": "",
            disabled: D.value,
            onClick: p
          }, {
            default: v(() => [...A[13] || (A[13] = [
              f("Lift this hold", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])) : k("", !0),
          G.value ? (a(), s(W, { key: 1 }, [
            (se = e.row.job_command) != null && se.length ? (a(), N(i(_), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: D.value || V.value || !Q.value,
              onClick: Y
            }, {
              default: v(() => [...A[14] || (A[14] = [
                f("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0),
            e.row.role !== "main" ? (a(), N(i(_), {
              key: 1,
              small: "",
              "data-agent-driver": "",
              disabled: D.value || V.value,
              onClick: d
            }, {
              default: v(() => [...A[15] || (A[15] = [
                f("Change driver", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0),
            e.row.role !== "main" ? (a(), N(i(_), {
              key: 2,
              small: "",
              "data-agent-retire": "",
              disabled: D.value || V.value,
              onClick: A[0] || (A[0] = (K) => P("retire"))
            }, {
              default: v(() => [...A[16] || (A[16] = [
                f("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0)
          ], 64)) : k("", !0)
        ]),
        g(i(Ke), { value: o.value }, {
          job: v(() => [
            g(Wt, {
              task: C.value,
              "onUpdate:task": A[1] || (A[1] = (K) => C.value = K),
              text: r.value,
              "onUpdate:text": A[2] || (A[2] = (K) => r.value = K),
              row: e.row,
              tasks: j.value,
              pending: D.value,
              loading: V.value,
              "more-tasks": F.value,
              failure: T.value,
              "job-ready": ne.value,
              onSubmit: m,
              onMore: M,
              onCancel: A[3] || (A[3] = (K) => P(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          driver: v(() => [
            g(Rt, {
              program: w.value,
              "onUpdate:program": A[4] || (A[4] = (K) => w.value = K),
              model: x.value,
              "onUpdate:model": A[5] || (A[5] = (K) => x.value = K),
              pending: D.value,
              onSubmit: R,
              onCancel: A[6] || (A[6] = (K) => P(""))
            }, null, 8, ["program", "model", "pending"])
          ]),
          history: v(() => [
            g(Yt, {
              sessions: q.value,
              onClose: A[7] || (A[7] = (K) => P(""))
            }, null, 8, ["sessions"])
          ]),
          retire: v(() => [
            g(Ft, {
              reason: n.value,
              "onUpdate:reason": A[8] || (A[8] = (K) => n.value = K),
              pending: D.value,
              onSubmit: H,
              onCancel: A[9] || (A[9] = (K) => P(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        T.value ? (a(), s("p", Qt, u(T.value), 1)) : k("", !0),
        E.value ? (a(), s("p", _t, u(E.value), 1)) : k("", !0)
      ], 32);
    };
  }
}, ta = /* @__PURE__ */ Z(ea, [["__scopeId", "data-v-8712e475"]]), aa = {
  class: "agent-command",
  "data-agent-command": ""
}, na = {
  key: 1,
  "data-agent-stopped": ""
}, la = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (l, t) => (a(), s("span", aa, [
      e.waitReason ? (a(), s("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: t[0] || (t[0] = ee((o) => i($e)("test_queue:0"), ["stop"]))
      }, [
        f("Waiting: " + u(e.waitReason) + " ", 1),
        g(i(ze), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), s("span", na, "Waiting")) : (a(), N(i(ct), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, oa = /* @__PURE__ */ Z(la, [["__scopeId", "data-v-1b371fb5"]]), sa = {
  key: 0,
  class: "lasting-facts",
  "data-agent-lasting-facts": ""
}, ia = { "data-agent-retired-at": "" }, ra = { key: 0 }, da = { "data-agent-retired-by": "" }, ua = {
  __name: "AgentLastingFacts",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    return (l, t) => e.row.retired_at ? (a(), s("dl", sa, [
      y("div", null, [
        t[0] || (t[0] = y("dt", null, "Retired", -1)),
        y("dd", ia, [
          g(i(Je), {
            at: e.row.retired_at
          }, null, 8, ["at"])
        ])
      ]),
      e.row.retiring_actor_name ? (a(), s("div", ra, [
        t[1] || (t[1] = y("dt", null, "Retired by", -1)),
        y("dd", da, u(e.row.retiring_actor_name), 1)
      ])) : k("", !0)
    ])) : k("", !0);
  }
}, ca = /* @__PURE__ */ Z(ua, [["__scopeId", "data-v-c5c81429"]]), ga = ["data-agent-delegated", "onClick"], va = { class: "agent-task-number" }, pa = { class: "agent-task-title" }, ma = ["title"], ha = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const t = l;
    return (o, r) => (a(), N(i(Ze), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: r[0] || (r[0] = (n) => t("toggle"))
    }, {
      default: v(() => [
        (a(!0), s(W, null, te(e.section.tasks, (n) => (a(), s("button", {
          key: n.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": n.id,
          onClick: (w) => i($e)(`tasks:${n.id}`)
        }, [
          g(i(gt), {
            status: n.state
          }, null, 8, ["status"]),
          y("span", va, u(n.id), 1),
          y("span", pa, u(n.title), 1),
          n.plan_id ? (a(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${n.plan_id}: ${n.plan_title}`
          }, "Plan " + u(n.plan_id), 9, ma)) : k("", !0)
        ], 8, ga))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, fa = /* @__PURE__ */ Z(ha, [["__scopeId", "data-v-ea4ccd6b"]]), ba = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, ka = {
  key: 1,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, ya = ["data-peek", "onClick"], wa = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ma = {
  key: 0,
  class: "agent-helper-brief"
}, $a = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, xa = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Sa = "It ended without a report", Ca = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const l = e, t = ["started", "blocked", "open", "completed"], o = c(() => {
      var m, h;
      return l.row.ended_at && ((h = (m = l.facts) == null ? void 0 : m.job_returned) != null && h.startsWith(Sa)) ? l.facts.job_returned : "";
    }), r = c(() => l.tasks.length ? t.map((m) => ({ state: m, label: m.slice(0, 1).toUpperCase() + m.slice(1), tasks: l.tasks.filter((h) => h.state === m || m === "started" && h.state === "testing" || m === "completed" && h.state === "cancelled") })) : []), n = /* @__PURE__ */ new Set(["completed"]), w = z({}), x = (m) => !(w.value[m] ?? n.has(m)), C = (m) => w.value = { ...w.value, [m]: x(m) }, j = Re(), { rows: O } = j.props.reports;
    j.state["reports.agent"] = String(l.row.number);
    const F = c(() => l.row.access === "read-only"), V = ["tasks", "transcript", "terminal", "file-feed", "processes", "reports", "memories"], D = c(() => [...j.tabs].sort((m, h) => (V.indexOf(m.key) < 0 ? V.length : V.indexOf(m.key)) - (V.indexOf(h.key) < 0 ? V.length : V.indexOf(h.key)))), T = c(() => !!l.row.retired_at || l.row.state === "retired"), E = () => F.value || T.value ? D.value.find((m) => m.key === "transcript") : D.value[0], q = z(E());
    ge(q, (m) => {
      j.state.tab = (m == null ? void 0 : m.key) ?? "";
    }, { immediate: !0 }), Ce(() => {
      j.state.tab = "";
    }), ge(D, (m) => {
      m.some((h) => {
        var d;
        return h.key === ((d = q.value) == null ? void 0 : d.key);
      }) || (q.value = m[0]);
    }), ge(() => l.open, (m) => {
      m && (q.value = E());
    });
    const X = Object.fromEntries(j.tabs.filter((m) => m.component).map((m) => [m.key, lt(() => vt(m.component))])), G = z(!1), { data: Q } = j.props.tool, ne = c(() => {
      var m;
      return ((m = Q.value) == null ? void 0 : m.tool) ?? "";
    }), P = c(() => {
      var m;
      return ((m = Q.value) == null ? void 0 : m.note) ?? "";
    }), Y = c(() => l.row.role !== "main" && (!l.row.ended_at || l.stoppedWithWork || l.waitReason));
    async function M() {
      !l.open || !Y.value || (j.state["tool.agent"] = String(l.row.number), await j.reload("tool"));
    }
    const p = pt(M, mt.agentCommand), J = j.follow(["hook_call.*", "process_part.*"], (m) => ht(m, "session_agent_id", /* @__PURE__ */ new Set([l.row.id])) && p());
    return Ce(() => J == null ? void 0 : J()), ge(() => l.open, (m) => {
      m && M();
    }, { immediate: !0 }), (m, h) => {
      var d;
      return a(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: h[2] || (h[2] = ee(() => {
        }, ["stop"]))
      }, [
        g(ca, { row: e.row }, null, 8, ["row"]),
        e.row.retirement_reason ? (a(), s("p", ba, "Retirement reason: " + u(e.row.retirement_reason), 1)) : k("", !0),
        o.value ? (a(), s("p", ka, u(o.value), 1)) : k("", !0),
        g(i(ft), {
          class: "agent-tabs",
          tabs: D.value,
          active: q.value,
          answer: { tasks: e.tasks.length, reports: e.row.report_count ?? i(O).length, memories: e.row.memory_count ?? 0 },
          onChoose: h[0] || (h[0] = (R) => q.value = R)
        }, null, 8, ["tabs", "active", "answer"]),
        g(i(bt), {
          class: "agent-tab-body",
          tab: q.value,
          "data-agent-tab-body": (d = q.value) == null ? void 0 : d.key
        }, {
          default: v(() => {
            var R;
            return [
              g(i(Ke), {
                value: (R = q.value) == null ? void 0 : R.key
              }, ot({
                reports: v(() => [
                  i(O).length ? k("", !0) : (a(), N(i(He), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: v(() => [...h[3] || (h[3] = [
                      f("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (a(!0), s(W, null, te(i(O), (H) => (a(), s("button", {
                    key: H.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${H.id}`,
                    onClick: (B) => i($e)(`messages:${H.id}`)
                  }, u(H.text), 9, ya))), 128))
                ]),
                tasks: v(() => {
                  var H;
                  return [
                    e.tasks.length ? k("", !0) : (a(), N(i(He), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: v(() => [...h[4] || (h[4] = [
                        f("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (a(!0), s(W, null, te(r.value, (B) => (a(), N(fa, {
                      key: B.state,
                      section: B,
                      open: x(B.state),
                      onToggle: (A) => C(B.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (H = e.facts) != null && H.instruction ? (a(), s(W, { key: 1 }, [
                      h[5] || (h[5] = y("p", { class: "agent-label" }, "Instruction", -1)),
                      y("div", wa, u(e.facts.instruction), 1)
                    ], 64)) : k("", !0)
                  ];
                }),
                transcript: v(() => {
                  var H;
                  return [
                    F.value ? (a(), s(W, { key: 0 }, [
                      (H = e.facts) != null && H.instruction ? (a(), s("div", Ma, [
                        g(i(Ze), {
                          label: "Instruction",
                          open: G.value,
                          "data-agent-section": "instruction",
                          onToggle: h[1] || (h[1] = (B) => G.value = !G.value)
                        }, {
                          default: v(() => [
                            y("div", $a, u(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (a(), s("p", xa, "No job recorded")) : k("", !0)
                    ], 64)) : k("", !0),
                    g(jt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                te(i(X), (H, B) => ({
                  name: B,
                  fn: v(() => [
                    (a(), N(st(H), {
                      agent: e.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ];
          }),
          _: 1
        }, 8, ["tab", "data-agent-tab-body"]),
        Y.value ? (a(), N(oa, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: ne.value,
          note: P.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : k("", !0)
      ]);
    };
  }
}, Ta = /* @__PURE__ */ Z(Ca, [["__scopeId", "data-v-fabbecdf"]]), Aa = { class: "line" }, ja = {
  key: 0,
  class: "line",
  "data-agent-since": ""
}, Ba = {
  key: 1,
  class: "line",
  "data-agent-seen": ""
}, La = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" }, seen: { type: String, default: "" } },
  setup(e) {
    const l = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, o = c(() => l.has(t.state)), r = c(() => [t.doing, t.since, t.seen].filter(Boolean).join(". "));
    return (n, w) => (a(), N(i(fe), {
      as: "button",
      place: "corner",
      class: de(["agent-dot", { pulse: o.value }]),
      "data-state": e.state,
      "aria-label": r.value,
      "data-agent-status": "",
      onClick: w[0] || (w[0] = ee(() => {
      }, ["stop"]))
    }, {
      tip: v(() => [
        y("b", Aa, u(e.doing), 1),
        e.since ? (a(), s("span", ja, u(e.since), 1)) : k("", !0),
        e.seen ? (a(), s("span", Ba, u(e.seen), 1)) : k("", !0)
      ]),
      default: v(() => [
        w[1] || (w[1] = y("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, Ra = /* @__PURE__ */ Z(La, [["__scopeId", "data-v-1a0bc478"]]), Oa = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, Ia = (e) => e.filter((l) => l.state !== "cancelled"), Ve = (e, l) => e.filter((t) => t.state === l).length, Va = 5, Ea = (e, l) => e || l.split(/\s+/).slice(0, Va).join(" ");
function za({ tasks: e, inHand: l, perHour: t }) {
  const o = Ia(e), r = Ve(o, "completed"), n = Oa[l == null ? void 0 : l.state], w = o.filter((O) => O.state === "started").map((O) => ({ number: O.id, title: O.title })), x = Math.max(w.length, l && l.state !== "completed" ? 1 : 0), C = o.length - r - x, j = r === o.length;
  return {
    number: l.id,
    title: l.title,
    started: w,
    plan: l.plan_id ?? 0,
    planTitle: l.plan_title ?? "",
    count: `${r} of ${o.length}`,
    taskTip: `${r} of its ${o.length} tasks done${n ? `. This one is ${n.words}.` : "."}`,
    countTip: j ? `All ${o.length} tasks done` : `${r} done, ${x} in hand, ${C} to go`,
    paceTip: !j && t ? `About ${t} an hour.` : "",
    rate: !j && t ? `${Math.round(t)}/hour` : "",
    bar: { total: o.length, done: r, testing: Ve(o, "testing"), started: Ve(o, "started") }
  };
}
const Ha = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, Na = {
  key: 0,
  class: "plan",
  "data-agent-job-launch": ""
}, Wa = {
  class: "task-line",
  "data-agent-task-line": ""
}, Da = {
  key: 1,
  class: "tasks",
  "data-agent-tasks": ""
}, qa = {
  key: 2,
  class: "tasks",
  "data-agent-tasks": ""
}, Fa = {
  key: 4,
  class: "rate",
  "data-agent-rate": ""
}, Pa = { key: 0 }, Ua = 3, Ga = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, jobTitle: { type: String, default: "" }, jobLaunch: { type: String, default: "" }, perHour: { type: Number, default: 0 }, countsEmpty: { type: Boolean, default: !1 } },
  setup(e) {
    const l = e, t = c(() => l.inHand ? za({ tasks: l.tasks, inHand: l.inHand, perHour: l.perHour }) : null);
    return (o, r) => e.job && !t.value ? (a(), s("span", Ha, [
      g(i(fe), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: v(() => [
          y("b", null, u(e.job), 1)
        ]),
        default: v(() => [
          f(u(i(Ea)(e.jobTitle, e.job)), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (a(), s("span", Na, u(e.jobLaunch), 1)) : k("", !0)
    ])) : t.value ? (a(), s(W, { key: 1 }, [
      y("span", Wa, [
        t.value.plan ? (a(), N(i(fe), {
          key: 0,
          as: "button",
          class: "task",
          "data-agent-plan": "",
          "data-peek": `plans:${t.value.plan}`,
          "aria-label": `Plan ${t.value.plan}: ${t.value.planTitle}`,
          onClick: r[0] || (r[0] = ee((n) => i($e)(`plans:${t.value.plan}`), ["stop"]))
        }, {
          tip: v(() => [
            y("b", null, u(t.value.planTitle), 1),
            y("span", null, "Task " + u(t.value.number) + ": " + u(t.value.title), 1)
          ]),
          default: v(() => [
            f("Plan " + u(t.value.plan), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])) : t.value.started.length > Ua ? (a(), s("span", Da, [
          g(i(fe), {
            as: "button",
            class: "task",
            "data-agent-task-count": "",
            "aria-label": `Tasks: ${t.value.started.length}`
          }, {
            tip: v(() => [
              (a(!0), s(W, null, te(t.value.started, (n) => (a(), s("b", {
                key: n.number,
                class: "listed",
                "data-agent-task-listed": ""
              }, u(n.number) + " " + u(n.title), 1))), 128))
            ]),
            default: v(() => [
              f("Tasks: " + u(t.value.started.length), 1)
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : t.value.started.length > 1 ? (a(), s("span", qa, [
          r[2] || (r[2] = f("Tasks ", -1)),
          (a(!0), s(W, null, te(t.value.started, (n, w) => (a(), s(W, {
            key: n.number
          }, [
            w ? (a(), s(W, { key: 0 }, [
              f(", ")
            ], 64)) : k("", !0),
            g(i(fe), {
              as: "button",
              class: "task",
              "data-agent-task": "",
              "data-peek": `tasks:${n.number}`,
              "aria-label": `Task ${n.number}: ${n.title}`,
              onClick: ee((x) => i($e)(`tasks:${n.number}`), ["stop"])
            }, {
              tip: v(() => [
                y("b", null, u(n.title), 1)
              ]),
              default: v(() => [
                f(u(n.number), 1)
              ]),
              _: 2
            }, 1032, ["data-peek", "aria-label", "onClick"])
          ], 64))), 128))
        ])) : (a(), N(i(fe), {
          key: 3,
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${t.value.number}`,
          "aria-label": `Task ${t.value.number}: ${t.value.title}`,
          onClick: r[1] || (r[1] = ee((n) => i($e)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: v(() => [
            y("b", null, u(t.value.title), 1),
            y("span", null, u(t.value.taskTip), 1)
          ]),
          default: v(() => [
            f("Task " + u(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])),
        t.value.rate ? (a(), s("span", Fa, u(t.value.rate), 1)) : k("", !0),
        g(i(fe), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: v(() => [
            y("b", null, u(t.value.countTip), 1),
            t.value.paceTip ? (a(), s("span", Pa, u(t.value.paceTip), 1)) : k("", !0)
          ]),
          default: v(() => [
            f(u(t.value.count), 1)
          ]),
          _: 1
        })
      ]),
      g(i(Pe), {
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: t.value.bar.total,
        done: t.value.bar.done,
        testing: t.value.bar.testing,
        started: t.value.bar.started
      }, null, 8, ["total", "done", "testing", "started"])
    ], 64)) : e.countsEmpty ? (a(), s(W, { key: 2 }, [
      r[3] || (r[3] = y("span", {
        class: "task-line",
        "data-agent-task-line": ""
      }, [
        y("span", {
          class: "task",
          "data-agent-no-task": ""
        }, "No task"),
        y("span", {
          class: "count",
          "data-agent-count": ""
        }, "0 of 0")
      ], -1)),
      g(i(Pe), {
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: 0,
        done: 0,
        testing: 0,
        started: 0
      })
    ], 64)) : k("", !0);
  }
}, Ja = /* @__PURE__ */ Z(Ga, [["__scopeId", "data-v-c4044bd4"]]), Ka = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Za = ["data-icon", "stroke-width", "innerHTML"], ae = {
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
    }, r = {
      agent: Ka,
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
    return (n, w) => (a(), s("svg", {
      class: "ico",
      "data-icon": e.name,
      style: Le({
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
      innerHTML: r[o[e.name] || e.name] || r.dot
    }, null, 12, Za));
  }
}, Ya = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Xa = {
  key: 1,
  class: "menu-item-text"
}, Qa = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (l, t) => (a(), s("button", {
      type: "button",
      class: de(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), s("span", Ya, u(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (a(), s("span", Xa, [
        y("span", null, [
          Te(l.$slots, "default", {}, void 0, !0)
        ]),
        y("small", null, u(e.description), 1)
      ])) : Te(l.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Me = /* @__PURE__ */ Z(Qa, [["__scopeId", "data-v-fec99974"]]), _a = {}, en = { class: "menu-label" };
function tn(e, l) {
  return a(), s("span", en, [
    Te(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Se = /* @__PURE__ */ Z(_a, [["render", tn], ["__scopeId", "data-v-aa955b3e"]]), an = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, nn = {
  key: 0,
  class: "skills-none"
}, ln = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: l }) {
    const t = e, o = l, r = c(() => t.skills.filter((w) => w.state === "loaded")), n = c(() => t.skills.filter((w) => w.state !== "loaded"));
    return (w, x) => (a(), s("div", an, [
      g(Se, null, {
        default: v(() => [...x[1] || (x[1] = [
          f("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      r.value.length ? k("", !0) : (a(), s("p", nn, "None yet. Compacting the conversation empties this list.")),
      (a(!0), s(W, null, te(r.value, (C) => (a(), s("p", {
        key: C.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        g(ae, {
          name: "book",
          size: 12
        }),
        f(u(C.skill), 1)
      ]))), 128)),
      n.value.length ? (a(), s(W, { key: 1 }, [
        g(Se, null, {
          default: v(() => [...x[2] || (x[2] = [
            f("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), s(W, null, te(n.value, (C) => (a(), s("p", {
          key: C.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          g(ae, {
            name: "book",
            size: 12
          }),
          f(u(C.skill), 1)
        ]))), 128))
      ], 64)) : k("", !0),
      g(Me, {
        "data-agent-skills-browse": "",
        onClick: x[0] || (x[0] = (C) => o("browse"))
      }, {
        default: v(() => [...x[3] || (x[3] = [
          f("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, on = /* @__PURE__ */ Z(ln, [["__scopeId", "data-v-be514d47"]]), sn = ["disabled", "title"], rn = { class: "gauge usage" }, dn = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: l }) {
    const t = e, o = l, r = c(() => t.windows[0] ?? null), n = c(() => r.value && Number.isFinite(r.value.used_percent) ? Math.max(0, Math.min(100, Math.round(r.value.used_percent))) : null), w = c(() => n.value !== null && n.value >= 100), x = c(() => {
      var j;
      return (j = r.value) != null && j.reset_epoch_seconds ? new Date(r.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), C = c(() => w.value ? `At usage limit: the plan's ${r.value.title} allowance is used up${x.value ? `, starts again ${x.value}` : ""}` : `${n.value}% of the plan's ${r.value.title} allowance used${x.value ? `, starts again ${x.value}` : ""}`);
    return (j, O) => n.value !== null ? (a(), s("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: C.value,
      onClick: O[0] || (O[0] = (F) => o("open", F.currentTarget))
    }, [
      g(ae, {
        name: "allowance",
        size: 12
      }),
      O[1] || (O[1] = f()),
      y("span", rn, [
        y("span", {
          style: Le({ width: `${n.value}%` })
        }, null, 4)
      ]),
      f(" " + u(w.value ? "At usage limit" : `${n.value}%`), 1)
    ], 8, sn)) : k("", !0);
  }
}, un = /* @__PURE__ */ Z(dn, [["__scopeId", "data-v-a36f09dc"]]), cn = ["failed", "blocked", "problem", "update", "paused", "holding", "waiting", "asks"], Xe = { danger: "failed", warn: "waiting" }, gn = (e) => cn.includes(Xe[e] ?? e), vn = (e) => gn(e) ? ["badge", Xe[e] ?? e] : ["badge-quiet"], pn = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (l, t) => (a(), s("span", {
      class: de(i(vn)(e.tone))
    }, u(e.text), 3));
  }
}, mn = /* @__PURE__ */ Z(pn, [["__scopeId", "data-v-b7a33f3d"]]), hn = (e, l, t) => Math.max(l, Math.min(t, e)), Qe = /* @__PURE__ */ new WeakMap(), fn = (e, l) => Qe.set(e, l);
function bn(e, l) {
  for (let t = l; t; t = Qe.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function kn(e, l) {
  const t = (o) => {
    var n, w;
    const r = ((n = e.value) == null ? void 0 : n.element) || ((w = e.value) == null ? void 0 : w.$el) || e.value;
    r && !bn(r, o.target) && l(o);
  };
  window.addEventListener("click", t), Ce(() => window.removeEventListener("click", t));
}
const we = 8, yn = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const o = e, r = z(null), n = (d) => d ? `${d}px` : void 0, w = c(() => ({
      minWidth: n(o.minWidth),
      maxWidth: n(o.maxWidth),
      maxHeight: n(o.maxHeight),
      height: n(o.height)
    })), x = z({ w: 0, h: 0 }), C = z(o.anchor ? o.anchor.getBoundingClientRect() : null), j = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), O = (d) => ({
      left: Math.max(0, d.left),
      top: Math.max(0, d.top),
      right: Math.min(window.innerWidth, d.right),
      bottom: Math.min(window.innerHeight, d.bottom)
    }), F = (d) => {
      const R = d.closest(".pane, .float-window");
      return R ? O(R.getBoundingClientRect()) : j();
    }, V = (d, R) => `${Math.max(0, d ? Math.min(d, R) : R)}px`;
    function D(d, R) {
      return {
        below: d.bottom - R.bottom - o.gap - we,
        above: R.top - d.top - o.gap - we,
        across: d.right - d.left - 2 * we
      };
    }
    function T(d) {
      const R = F(o.anchor), H = D(R, d);
      return x.value.w <= H.across && x.value.h <= Math.max(H.below, H.above) ? R : j();
    }
    const E = c(() => {
      if (!C.value) return w.value;
      const d = C.value, R = T(d), H = D(R, d), { w: B, h: A } = x.value, se = o.align === "auto" ? d.left + d.right > R.left + R.right : o.align === "right", K = hn(se ? d.right - B : d.left, R.left + we, Math.max(R.left + we, R.right - B - we)), b = A > H.below && H.above > H.below ? { bottom: `${window.innerHeight - d.top + o.gap}px`, maxHeight: V(o.maxHeight, H.above) } : { top: `${d.bottom + o.gap}px`, maxHeight: V(o.maxHeight, H.below) };
      return { ...w.value, ...b, left: `${K}px`, maxWidth: V(o.maxWidth, H.across) };
    }), q = t, X = () => [...r.value.querySelectorAll("button:not(:disabled)")];
    function G(d) {
      const R = X(), H = R.indexOf(document.activeElement);
      R[(H + d + R.length) % R.length].focus();
    }
    const Q = { ArrowDown: () => G(1), ArrowUp: () => G(-1), Escape: () => q("close") }, ne = (d) => Q[d.key] && (d.preventDefault(), Q[d.key]()), P = () => r.value && (x.value = { w: r.value.offsetWidth, h: r.value.scrollHeight });
    let Y = 0;
    const M = new ResizeObserver(() => {
      cancelAnimationFrame(Y), Y = requestAnimationFrame(P);
    });
    kn(r, (d) => o.anchor && !o.anchor.contains(d.target) && q("close"));
    const p = (d, R) => ["top", "left", "right", "bottom"].some((H) => Math.abs(d[H] - R[H]) > 1), J = (d) => d.bottom < 0 || d.top > window.innerHeight;
    let m = 0;
    function h() {
      if (o.anchor) {
        const d = o.anchor.getBoundingClientRect();
        if (!o.anchor.isConnected || J(d)) return q("close");
        p(d, C.value) && (C.value = d);
      }
      m = requestAnimationFrame(h);
    }
    return it(() => {
      o.anchor && r.value && fn(r.value, o.anchor), P(), r.value && M.observe(r.value), !o.plain && X()[0] && X()[0].focus(), h();
    }), Ce(() => {
      M.disconnect(), cancelAnimationFrame(m), cancelAnimationFrame(Y);
    }), l({ element: r }), (d, R) => (a(), N(rt, {
      to: "body",
      disabled: !e.anchor
    }, [
      y("div", dt({
        ref_key: "panel",
        ref: r
      }, d.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: E.value,
        onKeydown: ne
      }), [
        Te(d.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), wn = /* @__PURE__ */ Z(yn, [["__scopeId", "data-v-3d203970"]]);
async function Mn(e, l, t) {
  if (!e) return t(l);
  const { target: o, fields: r } = e, n = Object.fromEntries(Object.keys(r).map((C) => [C, o[C]])), w = () => Object.assign(o, n);
  Object.assign(o, r);
  let x = !1;
  try {
    const C = await t(l);
    return x = C.ok, C;
  } finally {
    x || w();
  }
}
function $n(e, l, t, { groups: o, programs: r }) {
  const n = z({}), w = z(""), x = z(!1), C = c(() => !!e.value && !e.value.ended_at), j = c(() => C.value && !!e.value.paused_at);
  async function O(T, E = null) {
    w.value = "";
    const q = await Mn(E, T, l);
    return w.value = q.ok ? "" : q.error, t(), q;
  }
  return { groups: o, programs: r, chosen: n, failure: w, asking: x, running: C, paused: j, choose: (T, E) => O(["agent", "control", String(e.value.number), T, E.value], { target: n, fields: { value: { ...n.value, [T]: E.label } } }), stop: () => (x.value = !1, O(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (T) => O(["agent", "launch", T.name]) };
}
function xn(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const Sn = { compact: "Compaction", clear: "Clear" };
function Cn(e) {
  return e != null && e.is_open ? `${Sn[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
const Tn = ["disabled", "title"], An = ["disabled", "title"], jn = { class: "gauge" }, Bn = {
  key: 1,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
}, Ln = ["disabled", "title"], Rn = ["disabled"], On = ["disabled"], In = {
  key: 5,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Vn = ["title"], En = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, zn = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Hn = { class: "gauge" }, Nn = { class: "context-used" }, Wn = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, Dn = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, qn = 75, Fn = {
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
    const t = e, o = l, r = $n(Oe(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => o("changed"), { groups: Oe(t, "controlGroups"), programs: Oe(t, "agentPrograms") }), n = z(null), w = z(""), x = c(() => r.groups.value.find((M) => M.key === w.value));
    function C(M, p) {
      n.value = M.currentTarget, w.value = p;
    }
    function j() {
      n.value = null, w.value = "", r.asking.value = !1;
    }
    const O = c(() => t.skills.filter((M) => M.state === "loaded"));
    function F(M) {
      C(M, "skills"), o("skills");
    }
    const V = (M) => r.groups.value.some((p) => p.key === M), D = c(() => {
      var M;
      return r.chosen.value.model ?? ((M = E.value) == null ? void 0 : M.model) ?? "";
    }), T = c(() => {
      var M;
      return r.chosen.value.effort ?? ((M = E.value) == null ? void 0 : M.effort) ?? "";
    });
    c(() => !!t.agent && !t.agent.ended_at);
    const E = c(() => {
      var M;
      return ((M = t.usage.agents) == null ? void 0 : M.find((p) => {
        var J;
        return p.id === ((J = t.agent) == null ? void 0 : J.id);
      })) ?? null;
    }), q = c(() => {
      var M;
      return ((M = E.value) == null ? void 0 : M.context_percent) == null ? null : Math.round(E.value.context_percent);
    }), X = c(() => {
      var M;
      return Cn(((M = E.value) == null ? void 0 : M.context_change) ?? null);
    }), G = (M) => `${Math.round(M / 1e3)}k`, Q = c(() => {
      var M;
      return !!((M = E.value) != null && M.context_limit_tokens);
    }), ne = c(() => {
      var M, p;
      return ((M = E.value) == null ? void 0 : M.context_limit_tokens) || ((p = E.value) == null ? void 0 : p.context_window_tokens) || 0;
    }), P = c(() => ne.value ? `${G(E.value.context_tokens ?? 0)} of ${G(ne.value)}` : ""), Y = c(() => {
      var M;
      return (M = E.value) != null && M.cost_dollars ? `$${E.value.cost_dollars.toFixed(2)}` : "";
    });
    return (M, p) => {
      var J, m;
      return a(), s("div", {
        class: de(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (a(), s(W, { key: 0 }, [
          y("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: p[0] || (p[0] = (h) => C(h, "agent"))
          }, [
            g(ae, {
              name: "agents",
              size: 12
            }),
            f(" " + u(((J = e.agentPrograms.find((h) => h.name === e.agent.program)) == null ? void 0 : J.title) || e.agent.program), 1)
          ], 8, Tn),
          g(un, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: p[1] || (p[1] = (h) => o("open", "usage", h))
          }, null, 8, ["windows", "disabled"]),
          q.value !== null ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${q.value}% full: clear or compact it`,
            onClick: p[2] || (p[2] = (h) => V("context") ? C(h, "context") : o("open", "context", h.currentTarget))
          }, [
            g(ae, {
              name: "gauge",
              size: 12
            }),
            p[14] || (p[14] = f()),
            y("span", jn, [
              y("span", {
                style: Le({ width: `${q.value}%` })
              }, null, 4)
            ]),
            f(" " + u(q.value) + "% ", 1)
          ], 8, An)) : (m = E.value) != null && m.context_unknown ? (a(), s("span", Bn, [
            g(ae, {
              name: "gauge",
              size: 12
            }),
            p[15] || (p[15] = f(" Context: unknown", -1))
          ])) : k("", !0),
          D.value ? (a(), s("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${D.value}: change the model`,
            onClick: p[3] || (p[3] = (h) => V("model") ? C(h, "model") : null)
          }, [
            g(ae, {
              name: "model",
              size: 12
            }),
            f(" " + u(D.value), 1)
          ], 8, Ln)) : k("", !0),
          V("effort") || e.card && T.value ? (a(), s("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: p[4] || (p[4] = (h) => C(h, "effort"))
          }, [
            g(ae, {
              name: "bolt",
              size: 12
            }),
            f(" " + u(T.value), 1)
          ], 8, Rn)) : k("", !0),
          Y.value ? (a(), s("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: p[5] || (p[5] = (h) => o("open", "cost", h.currentTarget))
          }, u(Y.value), 9, On)) : k("", !0),
          e.branch ? (a(), s("span", In, [
            g(ae, {
              name: "branch",
              size: 12
            }),
            f(" " + u(e.branch), 1)
          ])) : k("", !0),
          e.card ? k("", !0) : (a(), s("button", {
            key: 6,
            type: "button",
            class: de(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: p[6] || (p[6] = (h) => o("open", "jobs", h.currentTarget))
          }, [
            g(ae, {
              name: "clock",
              size: 12
            }),
            f(" " + u(e.jobs), 1)
          ], 2)),
          e.run ? (a(), s("button", {
            key: 7,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: F
          }, [
            g(ae, {
              name: "book",
              size: 12
            }),
            f(" " + u(O.value.length), 1)
          ])) : k("", !0),
          e.fitness ? (a(), s(W, { key: 8 }, [
            y("button", {
              type: "button",
              class: de(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < qn }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: p[7] || (p[7] = (h) => o("open", "fitness", h.currentTarget))
            }, [
              g(ae, {
                name: "heart",
                size: 12
              }),
              f(" " + u(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            y("button", {
              type: "button",
              class: de(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: p[8] || (p[8] = (h) => o("open", "load", h.currentTarget))
            }, [
              g(ae, {
                name: "weight",
                size: 12
              }),
              f(" " + u(e.fitness.workload), 1)
            ], 2)
          ], 64)) : k("", !0)
        ], 64)) : e.run && !e.loading ? (a(), s("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: p[9] || (p[9] = (h) => C(h, "start"))
        }, [
          g(ae, {
            name: "agents",
            size: 12
          }),
          p[16] || (p[16] = f(" Start an agent", -1))
        ])) : k("", !0),
        p[22] || (p[22] = y("span", { class: "space" }, null, -1)),
        i(r).failure.value ? (a(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: i(r).failure.value
        }, u(i(r).failure.value), 9, Vn)) : k("", !0),
        Te(M.$slots, "default", {}, void 0, !0),
        n.value ? (a(), N(wn, {
          key: 3,
          anchor: n.value,
          "min-width": 190,
          onClose: j
        }, {
          default: v(() => {
            var h;
            return [
              w.value === "agent" ? (a(), s(W, { key: 0 }, [
                i(r).asking.value ? (a(), s(W, { key: 0 }, [
                  g(Se, { "data-agent-stop-ask": "" }, {
                    default: v(() => [...p[17] || (p[17] = [
                      f("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  g(Me, {
                    "data-agent-stop-confirm": "",
                    onClick: p[10] || (p[10] = (d) => (j(), i(r).stop()))
                  }, {
                    default: v(() => [...p[18] || (p[18] = [
                      f("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  g(Me, {
                    onClick: p[11] || (p[11] = (d) => i(r).asking.value = !1)
                  }, {
                    default: v(() => [...p[19] || (p[19] = [
                      f("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (a(), N(Me, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: p[12] || (p[12] = (d) => i(r).asking.value = !0)
                }, {
                  default: v(() => [...p[20] || (p[20] = [
                    f("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : w.value === "start" ? (a(), s(W, { key: 1 }, [
                g(Se, null, {
                  default: v(() => [...p[21] || (p[21] = [
                    f("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (a(!0), s(W, null, te(i(r).programs.value, (d) => (a(), N(Me, {
                  key: d.name,
                  "data-agent-program": d.name,
                  onClick: (R) => (j(), i(r).start(d))
                }, {
                  default: v(() => [
                    f(u(d.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : w.value === "skills" ? (a(), N(on, {
                key: 2,
                skills: e.skills,
                onBrowse: p[13] || (p[13] = (d) => (j(), o("open", "skills", null)))
              }, null, 8, ["skills"])) : x.value ? (a(), s(W, { key: 3 }, [
                g(Se, null, {
                  default: v(() => [
                    f(u(x.value.label), 1)
                  ]),
                  _: 1
                }),
                w.value === "context" ? (a(), s(W, { key: 0 }, [
                  y("p", En, u(i(xn)(((h = E.value) == null ? void 0 : h.last_compaction) ?? null)), 1),
                  y("div", zn, [
                    y("span", Hn, [
                      y("span", {
                        style: Le({ width: `${q.value}%` })
                      }, null, 4)
                    ]),
                    y("span", Nn, u(q.value) + "%", 1)
                  ]),
                  P.value ? (a(), s("p", Wn, [
                    f(u(P.value) + " ", 1),
                    Q.value ? (a(), N(mn, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : k("", !0)
                  ])) : k("", !0)
                ], 64)) : k("", !0),
                w.value === "context" && X.value ? (a(), s("p", Dn, u(X.value), 1)) : (a(!0), s(W, { key: 2 }, te(x.value.choices, (d) => (a(), N(Me, {
                  key: d.value,
                  "data-agent-choice": d.value,
                  onClick: (R) => (i(r).choose(x.value.key, d), j())
                }, {
                  default: v(() => [
                    f(u(d.label), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-choice", "onClick"]))), 128))
              ], 64)) : k("", !0)
            ];
          }),
          _: 1
        }, 8, ["anchor"])) : k("", !0)
      ], 2);
    };
  }
}, Pn = /* @__PURE__ */ Z(Fn, [["__scopeId", "data-v-d7113347"]]), Un = ["data-agent-open", "aria-expanded", "role", "tabindex"], Gn = {
  class: "agent-head",
  "data-agent-head": ""
}, Jn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Kn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Zn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Yn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Xn = {
  key: 0,
  class: "agent-menu",
  "data-agent-menu-panel": ""
}, Qn = {
  key: 1,
  class: "agent-line"
}, _n = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, el = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, tl = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, al = {
  key: 3,
  class: "agent-unit",
  "data-agent-unit": ""
}, nl = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), o = ["completed", "testing"], r = { running: "Working", starting: "Starting", stopping: "Stopping", ended: "Idle: its process has stopped", failed: "Could not start", never_started: "Not started" }, n = e, w = l, x = Ye(), C = z(!1), j = c(() => kt(n.row, n.facts)), O = c(() => {
      var b;
      return ((b = n.facts) == null ? void 0 : b.tasks) ?? [];
    }), F = c(() => O.value.filter((b) => b.state === "open")), V = c(() => O.value.find((b) => {
      var I;
      return b.id === ((I = n.progress) == null ? void 0 : I.task_id) && b.state === "started";
    })), D = c(() => V.value || O.value.find((b) => {
      var I;
      return b.id === ((I = n.facts) == null ? void 0 : I.task_id);
    }) || O.value.find((b) => t.has(b.state)) || F.value[0] || O.value.at(-1)), T = c(() => {
      var b, I, ie, ce, le, ve;
      return n.row.role === "helper" ? ((b = n.facts) == null ? void 0 : b.helper_job) || "" : (I = n.facts) != null && I.job_enabled && (((ie = V.value) == null ? void 0 : ie.title) || ((ce = n.facts) == null ? void 0 : ce.task_title) || ((le = F.value[0]) == null ? void 0 : le.title) || ((ve = O.value.at(-1)) == null ? void 0 : ve.title)) || "";
    }), E = c(() => yt(n.row)), q = c(() => {
      var b, I;
      return [n.row.program, (b = n.facts) == null ? void 0 : b.model, (I = n.facts) == null ? void 0 : I.effort, E.value].filter(Boolean).join(" · ");
    }), X = Re(), G = /* @__PURE__ */ new Set(["open", "started", "testing"]), Q = { fresh: "new conversation", resumed: "resumed" }, ne = c(() => {
      var b, I;
      return [(b = n.facts) == null ? void 0 : b.helper_job_program, Q[(I = n.facts) == null ? void 0 : I.occupant_launch]].filter(Boolean).join(", ");
    }), P = c(() => {
      var b;
      return (b = n.facts) == null ? void 0 : b.work_status;
    }), Y = c(() => !!n.row.ended_at && n.row.role !== "main" && O.value.some((b) => G.has(b.state))), M = c(() => {
      var b, I;
      return n.row.state === "running" && ((b = n.facts) == null ? void 0 : b.state) === "at usage limit" && !!((I = n.facts) != null && I.usage_limit_ends_at);
    }), p = (b) => new Date(b).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), J = c(() => n.row.halted_at ? `Stopped at the usage limit since ${p(n.row.halted_at)}, goes on at ${p(n.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(n.facts.usage_limit_ends_at).toLocaleString()}`), m = c(() => {
      var b;
      return n.row.retired_at || n.row.state === "retired" ? "retired" : M.value || P.value || n.waitReason || Y.value ? "waiting" : n.row.state === "running" && ((b = n.facts) == null ? void 0 : b.state) || n.row.state;
    }), h = c(() => {
      var b;
      return M.value ? J.value : P.value ? `Status: ${P.value}` : n.waitReason ? `Waiting: ${n.waitReason}` : m.value === "blocked" ? (b = n.facts) != null && b.blocked_reason ? `Blocked: ${n.facts.blocked_reason}` : "Blocked" : Y.value ? "Stopped with work left" : "";
    }), d = c(() => {
      var b;
      return ((b = n.progress) == null ? void 0 : b.completed_count) ?? O.value.filter((I) => o.includes(I.state)).length;
    }), R = c(() => {
      var b;
      return wt(d.value, ((b = n.progress) == null ? void 0 : b.started_at) || n.row.created_at, n.progress ? n.progress.finished_at : n.row.ended_at, x.value);
    }), H = c(() => n.row.role === "main" ? 0 : R.value), B = c(() => !!n.row.retired_at || n.row.state === "retired"), A = c(() => B.value ? "Retired" : m.value === "blocked" || m.value === "waiting" ? h.value || (m.value === "blocked" ? "Blocked" : "Waiting") : r[n.row.standing]), se = c(() => {
      var I;
      if (B.value) return n.row.retired_at;
      const b = m.value === "blocked" || m.value === "waiting";
      return n.row.ended_at || b && ((I = n.facts) == null ? void 0 : I.last_activity) || n.row.process_started_at || n.row.created_at;
    }), K = c(() => Mt(se.value, x.value)), xe = c(() => {
      var b;
      return $t((b = n.facts) == null ? void 0 : b.last_activity, x.value);
    });
    return (b, I) => {
      var ie, ce, le, ve, me, re;
      return a(), s("div", {
        class: de(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: I[2] || (I[2] = (ue) => !e.open && w("toggle")),
        onKeydown: [
          I[3] || (I[3] = qe(ee((ue) => !e.open && w("toggle"), ["self", "prevent"]), ["enter"])),
          I[4] || (I[4] = qe(ee((ue) => !e.open && w("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        y("div", Gn, [
          e.open ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back",
            "aria-label": "Back",
            onClick: I[0] || (I[0] = ee((ue) => w("toggle"), ["stop"]))
          }, [
            g(i(ze), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : k("", !0),
          e.open ? (a(), s(W, { key: 1 }, [
            y("span", Jn, u(j.value.title), 1),
            y("span", Kn, u(j.value.subtext), 1),
            g(i(_), {
              variant: "ghost",
              small: "",
              class: "agent-menu-button",
              "data-agent-menu": "",
              "aria-expanded": C.value,
              onClick: I[1] || (I[1] = ee((ue) => C.value = !C.value, ["stop"]))
            }, {
              default: v(() => [...I[5] || (I[5] = [
                f("Actions", -1)
              ])]),
              _: 1
            }, 8, ["aria-expanded"])
          ], 64)) : (a(), s(W, { key: 2 }, [
            g(i(xt), {
              "agent-id": e.row.id,
              label: j.value.text,
              class: "agent-who"
            }, {
              default: v(() => [
                y("span", Zn, u(j.value.title), 1),
                y("span", Yn, u(j.value.subtext), 1)
              ]),
              _: 1
            }, 8, ["agent-id", "label"]),
            g(i(ze), {
              class: "agent-chevron",
              name: "chevronRight",
              size: 12
            })
          ], 64))
        ]),
        e.open && C.value ? (a(), s("div", Xn, [
          g(ta, {
            row: e.row,
            held: m.value === "blocked"
          }, null, 8, ["row", "held"])
        ])) : k("", !0),
        e.open ? k("", !0) : (a(), s("span", Qn, [
          y("span", _n, u(q.value), 1),
          (ie = e.facts) != null && ie.sandbox_off ? (a(), s("span", el, "sandbox off")) : k("", !0)
        ])),
        e.open && !B.value ? (a(), N(Pn, {
          key: 2,
          class: "agent-live",
          "agent-programs": i(X).props.programs.rows.value,
          agent: e.row,
          branch: (ce = e.progress) == null ? void 0 : ce.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((le = e.facts) == null ? void 0 : le.windows) ?? [] },
          card: ""
        }, {
          default: v(() => {
            var ue;
            return [
              (ue = e.facts) != null && ue.sandbox_off ? (a(), s("span", tl, "sandbox off")) : k("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : k("", !0),
        !e.open && ((ve = e.facts) != null && ve.unit_name) ? (a(), s("div", al, "Unit: " + u(e.facts.unit_name), 1)) : k("", !0),
        e.open ? k("", !0) : (a(), N(Ja, {
          key: 4,
          tasks: O.value,
          "in-hand": e.row.role !== "helper" && ((me = e.facts) != null && me.job_enabled) && D.value || null,
          job: e.row.role === "helper" ? T.value : "",
          "job-title": e.row.role === "helper" && ((re = e.facts) == null ? void 0 : re.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? ne.value : "",
          "per-hour": H.value,
          "counts-empty": e.row.role === "worker"
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour", "counts-empty"])),
        g(Ra, {
          state: m.value,
          doing: A.value,
          since: K.value,
          seen: xe.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (a(), N(Ta, {
          key: 5,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: O.value,
          "stopped-with-work": Y.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : k("", !0)
      ], 42, Un);
    };
  }
}, ll = /* @__PURE__ */ Z(nl, [["__scopeId", "data-v-eff0190d"]]), ol = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, sl = ["data-agent-row", "data-agent-lingering"], Ue = "journal.agents.filters", Ge = 300 * 1e3, Be = "cubic-bezier(0.2, 0.9, 0.25, 1)", il = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const l = e, t = Re(), { rows: o } = t.props.waits, { rows: r } = t.props.progress, { rows: n, failure: w, loaded: x, more: C } = t.props.agents, j = ($) => r.value.find((L) => L.agent_id === $.id) ?? null, O = ($) => {
      var L;
      return ((L = o.value.find((S) => S.agent_id === $.id)) == null ? void 0 : L.reason) ?? "";
    }, F = z("running"), V = z(""), D = JSON.parse(localStorage.getItem(Ue) || '{"roles":[],"profiles":[],"programs":[]}'), T = z(D), E = c(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: q } = t.props.programs, X = c(() => T.value.roles.length + T.value.profiles.length + T.value.programs.length), G = ($, L) => {
      T.value = At(T.value, $, L);
    }, Q = () => {
      T.value = { roles: [], profiles: [], programs: [] };
    }, ne = ($) => $.slice(0, 1).toUpperCase() + $.slice(1);
    ge(T, ($) => localStorage.setItem(Ue, JSON.stringify($)));
    const P = z(25);
    function Y() {
      Object.assign(t.state, {
        "agents.show": F.value,
        "agents.search": V.value,
        "agents.limit": String(P.value),
        "agents.roles": T.value.roles.join(","),
        "agents.profiles": T.value.profiles.join(","),
        "agents.programs": T.value.programs.join(",")
      });
    }
    async function M() {
      return P.value += 25, Y(), await t.reload("agents"), !0;
    }
    ge([F, V, T], () => {
      P.value = 25, Y(), t.reload("agents");
    }), Y();
    const p = ($) => $.facts ?? null, J = n, m = Ye(), h = z([]), d = c(() => new Set(h.value.filter(($) => m.value - $.left < Ge).map(($) => $.row.id))), R = c(() => h.value.filter(($) => d.value.has($.row.id)).map(($) => $.row)), H = c(() => [...J.value, ...R.value]);
    let B = "", A = [];
    async function se($) {
      await t.reload(`card.${$.id}`);
      const L = t.props[`card.${$.id}`].rows.value.find((S) => S.id === $.id);
      L != null && L.ended_at && !h.value.some((S) => S.row.id === $.id) && (h.value = [...h.value, { row: L, left: Date.now() }]);
    }
    ge(n, ($) => {
      const L = B === `${F.value}|${V.value}|${JSON.stringify(T.value)}` && F.value === "running", S = L ? A.filter((U) => !$.some((be) => be.id === U.id)) : [];
      B = `${F.value}|${V.value}|${JSON.stringify(T.value)}`, A = $, h.value = L ? h.value.filter((U) => m.value - U.left < Ge && !$.some((be) => be.id === U.row.id)) : [], S.forEach(se);
    }, { immediate: !0 });
    const K = c(() => !!V.value.trim() || X.value > 0), xe = c(() => l.texts[F.value] ?? { title: l.empty, hint: "" }), b = z(null), I = z(null), ie = z(null), ce = z(null), le = c(() => b.value === null ? null : t.props[`card.${b.value}`].rows.value.find(($) => $.id === b.value) ?? I.value), ve = c(() => le.value ? [le.value] : H.value), me = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, re = z(!1);
    let ue = 0;
    const _e = ($) => [...$.attributes].map((L) => L.name).find((L) => L.startsWith("data-agent-") && L !== "data-agent-motion") ?? "";
    async function et($) {
      if (re.value) return;
      re.value = !0, ue = ce.value.scrollTop;
      const L = ie.value.querySelector(`[data-agent-open="${$.id}"]`);
      if (!me()) {
        const ke = [...ie.value.querySelectorAll(".agent-row")].filter((pe) => !pe.contains(L));
        await Promise.all(ke.map((pe) => pe.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const S = [...L.querySelectorAll(".agent-head, .agent-line")], U = [...S, ...L.querySelectorAll("[data-agent-motion]")], be = U.map(_e), Ae = U.map((ke) => ke.getBoundingClientRect());
      if (I.value = $, b.value = $.id, t.reload(`card.${$.id}`), await Fe(), !me()) {
        const ke = U.map((oe, he) => oe.isConnected ? oe : be[he] ? L.querySelector(`[${be[he]}]`) : null), pe = ke.map((oe) => oe == null ? void 0 : oe.getBoundingClientRect());
        ke.forEach((oe, he) => {
          if (!oe) return;
          const ye = S.findIndex((De) => De !== oe && De.contains(oe)), at = Ae[he].left - pe[he].left - (ye < 0 ? 0 : Ae[ye].left - pe[ye].left), nt = Ae[he].top - pe[he].top - (ye < 0 ? 0 : Ae[ye].top - pe[ye].top);
          oe.animate([{ transform: `translate(${at}px, ${nt}px)` }, { transform: "none" }], { duration: 280, easing: Be });
        }), ie.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((oe) => {
          oe.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Be, fill: "backwards" });
        });
      }
      re.value = !1;
    }
    async function Ne() {
      if (re.value || !le.value) return;
      re.value = !0;
      const $ = ie.value.querySelector(`[data-agent-open="${b.value}"]`), L = [...$.children], S = me() ? [] : L.map((U) => U.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(S.map((U) => U.finished)), b.value = null, await Fe(), ce.value.scrollTop = ue, S.forEach((U) => U.cancel()), me() || ($.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Be }), ie.value.querySelectorAll(".agent-row").forEach((U) => {
        U.contains($) || U.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Be });
      })), re.value = !1;
    }
    const tt = ($) => b.value === $.id ? Ne() : et($);
    ge(V, ($) => $.trim() && (b.value = null)), ge(F, () => {
      b.value = null;
    });
    const We = ($) => {
      $.key === "Escape" && Ne();
    };
    return window.addEventListener("keydown", We), Ce(() => window.removeEventListener("keydown", We)), ($, L) => (a(), s("div", {
      ref_key: "agents",
      ref: ie,
      class: de(["agents", { focused: le.value, "card-changing": re.value }])
    }, [
      le.value ? k("", !0) : (a(), N(i(St), {
        key: 0,
        modelValue: V.value,
        "onUpdate:modelValue": L[1] || (L[1] = (S) => V.value = S),
        placeholder: "Search agents",
        "menu-count": X.value,
        "data-agents-search": ""
      }, {
        menu: v(() => [
          g(i(Ie), null, {
            default: v(() => [...L[2] || (L[2] = [
              f("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(W, null, te(E.value.roles, (S) => (a(), N(i(je), {
            key: S,
            role: "menuitemcheckbox",
            "aria-checked": T.value.roles.includes(S),
            checked: T.value.roles.includes(S),
            "data-filter-role": S,
            onClick: (U) => G("roles", S)
          }, {
            default: v(() => [
              f(u(ne(S)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          E.value.profiles.length ? (a(), N(i(Ie), { key: 0 }, {
            default: v(() => [...L[3] || (L[3] = [
              f("Profile", -1)
            ])]),
            _: 1
          })) : k("", !0),
          (a(!0), s(W, null, te(E.value.profiles, (S) => (a(), N(i(je), {
            key: S.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.profiles.includes(S.name),
            checked: T.value.profiles.includes(S.name),
            "data-filter-profile": S.name,
            onClick: (U) => G("profiles", S.name)
          }, {
            default: v(() => [
              f(u(S.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          g(i(Ie), null, {
            default: v(() => [...L[4] || (L[4] = [
              f("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(W, null, te(i(q), (S) => (a(), N(i(je), {
            key: S.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.programs.includes(S.name),
            checked: T.value.programs.includes(S.name),
            "data-filter-program": S.name,
            onClick: (U) => G("programs", S.name)
          }, {
            default: v(() => [
              f(u(S.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          X.value ? (a(), N(i(je), {
            key: 1,
            "data-filter-clear": "",
            onClick: Q
          }, {
            default: v(() => [...L[5] || (L[5] = [
              f("Clear filters", -1)
            ])]),
            _: 1
          })) : k("", !0)
        ]),
        default: v(() => [
          g(i(Ct), {
            options: E.value.states,
            value: F.value,
            onPick: L[0] || (L[0] = (S) => F.value = S)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      F.value === "retired" && E.value.upgrade_retired ? (a(), s("p", ol, "Retired during the upgrade: " + u(E.value.upgrade_retired), 1)) : k("", !0),
      y("div", {
        ref_key: "list",
        ref: ce,
        class: de(["agents-view", { "agents-view-open": le.value }])
      }, [
        i(x) && !i(w) && !ve.value.length && X.value ? (a(), N(i(He), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: v(() => [
            g(i(_), {
              small: "",
              "data-empty-clear": "",
              onClick: Q
            }, {
              default: v(() => [...L[6] || (L[6] = [
                f("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), N(i(Tt), {
          key: 1,
          moves: "",
          "leaves-at-once": re.value,
          rows: ve.value,
          failure: i(w),
          loaded: i(x),
          more: !le.value && i(C),
          older: M,
          empty: xe.value.title,
          hint: xe.value.hint,
          searching: K.value
        }, {
          default: v(({ row: S }) => [
            y("div", {
              class: de(["agent-row", { lingering: d.value.has(S.id) && S.id !== b.value }]),
              "data-agent-row": S.id,
              "data-agent-lingering": d.value.has(S.id) ? "" : null
            }, [
              g(ll, {
                row: S,
                facts: p(S),
                progress: j(S),
                "wait-reason": O(S),
                open: S.id === b.value,
                onToggle: (U) => tt(S)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, sl)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, cl = /* @__PURE__ */ Z(il, [["__scopeId", "data-v-19199c00"]]);
export {
  cl as A
};
