import { openBlock as a, createElementBlock as s, withModifiers as ee, createElementVNode as y, createVNode as g, unref as r, withCtx as v, createTextVNode as f, Fragment as W, renderList as te, toDisplayString as u, createBlock as N, createCommentVNode as k, ref as z, computed as c, watch as ge, onUnmounted as xe, defineAsyncComponent as et, createSlots as tt, resolveDynamicComponent as at, normalizeClass as de, normalizeStyle as je, renderSlot as Se, onMounted as nt, Teleport as lt, mergeProps as ot, toRef as Be, withKeys as We, nextTick as De } from "vue";
import { TextInput as Oe, Btn as _, TextArea as st, TimeAgo as Ue, useWindow as Le, SwitchCase as Ge, peekRef as we, Icon as Ve, RunningCommand as rt, FoldGroup as Je, TaskStatusIcon as it, loadWindowComponent as dt, coalesced as ut, READ_RATES as ct, eventMayBeChildOf as gt, InnerTabs as vt, TabBody as pt, EmptyState as ze, HoverTip as fe, TaskBar as qe, useNow as Ke, agentTitle as mt, agentNumber as ht, perHour as ft, sinceWords as bt, seenWords as kt, AgentTip as yt, SearchBar as wt, Segmented as Mt, MenuLabel as Re, MenuItem as Te, RowList as $t, toggleFilter as xt } from "@journal/window-kit";
import { _ as Z, T as St } from "./TranscriptRows-Crmxs6Un.js";
const Ct = { class: "action-buttons" }, Tt = {
  __name: "AgentDriverForm",
  props: { program: String, model: String, pending: Boolean },
  emits: ["submit", "cancel", "update:program", "update:model"],
  setup(e) {
    return (l, t) => (a(), s("form", {
      "data-agent-driver-form": "",
      onSubmit: t[3] || (t[3] = ee((o) => l.$emit("submit"), ["prevent"]))
    }, [
      t[6] || (t[6] = y("p", null, "Starts the next session on this program; the agent keeps its number and memories.", -1)),
      g(r(Oe), {
        "model-value": e.program,
        label: "Program",
        disabled: e.pending,
        "data-agent-driver-program": "",
        "onUpdate:modelValue": t[0] || (t[0] = (o) => l.$emit("update:program", o))
      }, null, 8, ["model-value", "disabled"]),
      g(r(Oe), {
        "model-value": e.model,
        label: "Model",
        disabled: e.pending,
        "data-agent-driver-model": "",
        "onUpdate:modelValue": t[1] || (t[1] = (o) => l.$emit("update:model", o))
      }, null, 8, ["model-value", "disabled"]),
      y("div", Ct, [
        g(r(_), {
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
        g(r(_), {
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
}, At = /* @__PURE__ */ Z(Tt, [["__scopeId", "data-v-c138a4da"]]), jt = { class: "action-field" }, Lt = ["value", "disabled"], Bt = ["value"], Rt = { key: 1 }, It = {
  key: 1,
  class: "action-field"
}, Ot = { class: "action-buttons" }, Vt = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (l, t) => (a(), s("form", {
      onSubmit: t[4] || (t[4] = ee((o) => l.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (a(), s(W, { key: 0 }, [
        y("label", jt, [
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
            }, u(o.id) + ": " + u(o.title), 9, Bt))), 128))
          ], 40, Lt)
        ]),
        e.moreTasks ? (a(), N(r(_), {
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
        !e.loading && !e.tasks.length && !e.failure ? (a(), s("p", Rt, "No open tasks.")) : k("", !0)
      ], 64)) : (a(), s("label", It, [
        t[8] || (t[8] = f("Job", -1)),
        g(r(st), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (o) => l.$emit("update:text", o.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      y("div", Ot, [
        g(r(_), {
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
        g(r(_), {
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
}, zt = /* @__PURE__ */ Z(Vt, [["__scopeId", "data-v-adde4158"]]), Ht = { class: "action-buttons" }, Et = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (l, t) => (a(), s("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = ee((o) => l.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = y("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      g(r(Oe), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (o) => l.$emit("update:reason", o))
      }, null, 8, ["model-value", "disabled"]),
      y("div", Ht, [
        g(r(_), {
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
        g(r(_), {
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
}, Nt = /* @__PURE__ */ Z(Et, [["__scopeId", "data-v-92de7dd6"]]), Wt = {
  class: "session-history",
  "data-agent-session-history": ""
}, Dt = { key: 0 }, qt = { key: 0 }, Ft = { "data-agent-session-state": "" }, Pt = { class: "action-buttons" }, Ut = {
  __name: "AgentSessionHistory",
  props: { sessions: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e) {
    return (l, t) => (a(), s("div", Wt, [
      e.sessions.length ? k("", !0) : (a(), s("p", Dt, "This agent has no session in its history.")),
      y("ol", null, [
        (a(!0), s(W, null, te(e.sessions, (o) => (a(), s("li", {
          key: o.session,
          "data-agent-session": ""
        }, [
          y("span", null, u([o.program, o.model].filter(Boolean).join(" ")), 1),
          o.started_at ? (a(), s("span", qt, [
            t[1] || (t[1] = f("Started ", -1)),
            g(r(Ue), {
              at: o.started_at
            }, null, 8, ["at"])
          ])) : k("", !0),
          y("span", Ft, u(o.end_reason ? `Ended: ${o.end_reason.replaceAll("_", " ")}` : o.started_at ? "Running" : "Not started"), 1),
          y("code", null, u(o.session), 1)
        ]))), 128))
      ]),
      y("div", Pt, [
        g(r(_), {
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
}, Gt = /* @__PURE__ */ Z(Ut, [["__scopeId", "data-v-0d688bd9"]]), Jt = { class: "action-buttons" }, Kt = {
  key: 0,
  role: "alert"
}, Zt = {
  key: 1,
  role: "status"
}, Yt = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 }, held: { type: Boolean, default: !1 } },
  setup(e) {
    const l = e, t = Le(), o = z(""), i = z(""), n = z(""), w = z(""), $ = z(""), C = z(""), j = z([]), R = z(0), F = z(!1), O = z(!1), D = z(!1), T = z(""), V = z(""), q = z([]), Q = c(() => !!l.row.retired_at || l.row.state === "retired"), G = c(() => !Q.value && !!l.row.ended_at), X = c(() => {
      var L;
      return G.value && ((L = l.row.job_command) == null ? void 0 : L.length) && !l.row.resume_reason;
    }), ne = c(() => X.value && !O.value && (l.row.job_task_flag ? j.value.some((L) => String(L.id) === C.value) : !!i.value.trim()));
    function P(L) {
      o.value = L, i.value = "", n.value = "", C.value = "", T.value = "", V.value = "";
    }
    async function Y() {
      P("job"), l.row.job_task_flag && (j.value = [], R.value = 0, F.value = !1, await M());
    }
    async function M() {
      if (!O.value) {
        O.value = !0;
        try {
          t.state["jobs.page"] = String(R.value + 1), await t.reload("jobs");
          const L = t.props.jobs;
          T.value = L.failure.value, T.value || (j.value = [...j.value, ...L.rows.value], R.value = L.data.value.page, F.value = L.more.value);
        } finally {
          O.value = !1;
        }
      }
    }
    async function p() {
      await J(["process", "lift-hold", String(l.row.number)], "Hold lifted.");
    }
    async function J(L, A) {
      if (!D.value) {
        D.value = !0, T.value = "";
        try {
          const oe = await t.run(L);
          T.value = oe.ok ? "" : oe.error, oe.ok && (P(""), V.value = A);
        } finally {
          D.value = !1;
        }
      }
    }
    async function m() {
      if (!ne.value) return;
      const L = l.row.job_task_flag ? [l.row.job_task_flag, C.value] : [i.value.trim()];
      await J([...l.row.job_command, String(l.row.number), ...L], "Job sent.");
    }
    async function h() {
      if (!D.value) {
        D.value = !0;
        try {
          const L = await t.run(["agent", "sessions", String(l.row.number)]);
          P(L.ok ? "history" : ""), T.value = L.ok ? "" : L.error, q.value = L.ok ? L.value.rows : [];
        } finally {
          D.value = !1;
        }
      }
    }
    function d() {
      P("driver"), w.value = l.row.program || "", $.value = "";
    }
    async function B() {
      !G.value || o.value !== "driver" || !w.value.trim() || !$.value.trim() || await J(["agent", "driver", String(l.row.number), "--program", w.value.trim(), "--model", $.value.trim()], "Driver changed.");
    }
    async function E() {
      !G.value || o.value !== "retire" || !n.value.trim() || await J(["agent", "retire", String(l.row.number), "--reason", n.value.trim()], "Agent retired permanently.");
    }
    return (L, A) => {
      var oe;
      return a(), s("div", {
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: A[10] || (A[10] = ee(() => {
        }, ["stop"])),
        onKeydown: A[11] || (A[11] = ee(() => {
        }, ["stop"]))
      }, [
        y("div", Jt, [
          g(r(_), {
            small: "",
            "data-agent-history": "",
            disabled: D.value || O.value,
            onClick: h
          }, {
            default: v(() => [...A[12] || (A[12] = [
              f("Session history", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          e.held ? (a(), N(r(_), {
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
            (oe = e.row.job_command) != null && oe.length ? (a(), N(r(_), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: D.value || O.value || !X.value,
              onClick: Y
            }, {
              default: v(() => [...A[14] || (A[14] = [
                f("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0),
            e.row.role !== "main" ? (a(), N(r(_), {
              key: 1,
              small: "",
              "data-agent-driver": "",
              disabled: D.value || O.value,
              onClick: d
            }, {
              default: v(() => [...A[15] || (A[15] = [
                f("Change driver", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0),
            e.row.role !== "main" ? (a(), N(r(_), {
              key: 2,
              small: "",
              "data-agent-retire": "",
              disabled: D.value || O.value,
              onClick: A[0] || (A[0] = (K) => P("retire"))
            }, {
              default: v(() => [...A[16] || (A[16] = [
                f("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0)
          ], 64)) : k("", !0)
        ]),
        g(r(Ge), { value: o.value }, {
          job: v(() => [
            g(zt, {
              task: C.value,
              "onUpdate:task": A[1] || (A[1] = (K) => C.value = K),
              text: i.value,
              "onUpdate:text": A[2] || (A[2] = (K) => i.value = K),
              row: e.row,
              tasks: j.value,
              pending: D.value,
              loading: O.value,
              "more-tasks": F.value,
              failure: T.value,
              "job-ready": ne.value,
              onSubmit: m,
              onMore: M,
              onCancel: A[3] || (A[3] = (K) => P(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          driver: v(() => [
            g(At, {
              program: w.value,
              "onUpdate:program": A[4] || (A[4] = (K) => w.value = K),
              model: $.value,
              "onUpdate:model": A[5] || (A[5] = (K) => $.value = K),
              pending: D.value,
              onSubmit: B,
              onCancel: A[6] || (A[6] = (K) => P(""))
            }, null, 8, ["program", "model", "pending"])
          ]),
          history: v(() => [
            g(Gt, {
              sessions: q.value,
              onClose: A[7] || (A[7] = (K) => P(""))
            }, null, 8, ["sessions"])
          ]),
          retire: v(() => [
            g(Nt, {
              reason: n.value,
              "onUpdate:reason": A[8] || (A[8] = (K) => n.value = K),
              pending: D.value,
              onSubmit: E,
              onCancel: A[9] || (A[9] = (K) => P(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        T.value ? (a(), s("p", Kt, u(T.value), 1)) : k("", !0),
        V.value ? (a(), s("p", Zt, u(V.value), 1)) : k("", !0)
      ], 32);
    };
  }
}, Qt = /* @__PURE__ */ Z(Yt, [["__scopeId", "data-v-8712e475"]]), Xt = {
  class: "agent-command",
  "data-agent-command": ""
}, _t = {
  key: 1,
  "data-agent-stopped": ""
}, ea = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (l, t) => (a(), s("span", Xt, [
      e.waitReason ? (a(), s("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: t[0] || (t[0] = ee((o) => r(we)("test_queue:0"), ["stop"]))
      }, [
        f("Waiting: " + u(e.waitReason) + " ", 1),
        g(r(Ve), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), s("span", _t, "Waiting")) : (a(), N(r(rt), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, ta = /* @__PURE__ */ Z(ea, [["__scopeId", "data-v-1b371fb5"]]), aa = {
  key: 0,
  class: "lasting-facts",
  "data-agent-lasting-facts": ""
}, na = { "data-agent-retired-at": "" }, la = { key: 0 }, oa = { "data-agent-retired-by": "" }, sa = {
  __name: "AgentLastingFacts",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    return (l, t) => e.row.retired_at ? (a(), s("dl", aa, [
      y("div", null, [
        t[0] || (t[0] = y("dt", null, "Retired", -1)),
        y("dd", na, [
          g(r(Ue), {
            at: e.row.retired_at
          }, null, 8, ["at"])
        ])
      ]),
      e.row.retiring_actor_name ? (a(), s("div", la, [
        t[1] || (t[1] = y("dt", null, "Retired by", -1)),
        y("dd", oa, u(e.row.retiring_actor_name), 1)
      ])) : k("", !0)
    ])) : k("", !0);
  }
}, ra = /* @__PURE__ */ Z(sa, [["__scopeId", "data-v-c5c81429"]]), ia = ["data-agent-delegated", "onClick"], da = { class: "agent-task-number" }, ua = { class: "agent-task-title" }, ca = ["title"], ga = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const t = l;
    return (o, i) => (a(), N(r(Je), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: i[0] || (i[0] = (n) => t("toggle"))
    }, {
      default: v(() => [
        (a(!0), s(W, null, te(e.section.tasks, (n) => (a(), s("button", {
          key: n.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": n.id,
          onClick: (w) => r(we)(`tasks:${n.id}`)
        }, [
          g(r(it), {
            status: n.state
          }, null, 8, ["status"]),
          y("span", da, u(n.id), 1),
          y("span", ua, u(n.title), 1),
          n.plan_id ? (a(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${n.plan_id}: ${n.plan_title}`
          }, "Plan " + u(n.plan_id), 9, ca)) : k("", !0)
        ], 8, ia))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, va = /* @__PURE__ */ Z(ga, [["__scopeId", "data-v-ea4ccd6b"]]), pa = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, ma = {
  key: 1,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, ha = ["data-peek", "onClick"], fa = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ba = {
  key: 0,
  class: "agent-helper-brief"
}, ka = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ya = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, wa = "It ended without a report", Ma = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const l = e, t = ["started", "blocked", "open", "completed"], o = c(() => {
      var m, h;
      return l.row.ended_at && ((h = (m = l.facts) == null ? void 0 : m.job_returned) != null && h.startsWith(wa)) ? l.facts.job_returned : "";
    }), i = c(() => l.tasks.length ? t.map((m) => ({ state: m, label: m.slice(0, 1).toUpperCase() + m.slice(1), tasks: l.tasks.filter((h) => h.state === m || m === "started" && h.state === "testing" || m === "completed" && h.state === "cancelled") })) : []), n = /* @__PURE__ */ new Set(["completed"]), w = z({}), $ = (m) => !(w.value[m] ?? n.has(m)), C = (m) => w.value = { ...w.value, [m]: $(m) }, j = Le(), { rows: R } = j.props.reports;
    j.state["reports.agent"] = String(l.row.number);
    const F = c(() => l.row.access === "read-only"), O = ["tasks", "transcript", "terminal", "file-feed", "processes", "reports", "memories"], D = c(() => [...j.tabs].sort((m, h) => (O.indexOf(m.key) < 0 ? O.length : O.indexOf(m.key)) - (O.indexOf(h.key) < 0 ? O.length : O.indexOf(h.key)))), T = c(() => !!l.row.retired_at || l.row.state === "retired"), V = () => F.value || T.value ? D.value.find((m) => m.key === "transcript") : D.value[0], q = z(V());
    ge(q, (m) => {
      j.state.tab = (m == null ? void 0 : m.key) ?? "";
    }, { immediate: !0 }), xe(() => {
      j.state.tab = "";
    }), ge(D, (m) => {
      m.some((h) => {
        var d;
        return h.key === ((d = q.value) == null ? void 0 : d.key);
      }) || (q.value = m[0]);
    }), ge(() => l.open, (m) => {
      m && (q.value = V());
    });
    const Q = Object.fromEntries(j.tabs.filter((m) => m.component).map((m) => [m.key, et(() => dt(m.component))])), G = z(!1), { data: X } = j.props.tool, ne = c(() => {
      var m;
      return ((m = X.value) == null ? void 0 : m.tool) ?? "";
    }), P = c(() => {
      var m;
      return ((m = X.value) == null ? void 0 : m.note) ?? "";
    }), Y = c(() => l.row.role !== "main" && (!l.row.ended_at || l.stoppedWithWork || l.waitReason));
    async function M() {
      !l.open || !Y.value || (j.state["tool.agent"] = String(l.row.number), await j.reload("tool"));
    }
    const p = ut(M, ct.agentCommand), J = j.follow(["hook_call.*", "process_part.*"], (m) => gt(m, "session_agent_id", /* @__PURE__ */ new Set([l.row.id])) && p());
    return xe(() => J == null ? void 0 : J()), ge(() => l.open, (m) => {
      m && M();
    }, { immediate: !0 }), (m, h) => {
      var d;
      return a(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: h[2] || (h[2] = ee(() => {
        }, ["stop"]))
      }, [
        g(ra, { row: e.row }, null, 8, ["row"]),
        e.row.retirement_reason ? (a(), s("p", pa, "Retirement reason: " + u(e.row.retirement_reason), 1)) : k("", !0),
        o.value ? (a(), s("p", ma, u(o.value), 1)) : k("", !0),
        g(r(vt), {
          class: "agent-tabs",
          tabs: D.value,
          active: q.value,
          answer: { tasks: e.tasks.length, reports: e.row.report_count ?? r(R).length, memories: e.row.memory_count ?? 0 },
          onChoose: h[0] || (h[0] = (B) => q.value = B)
        }, null, 8, ["tabs", "active", "answer"]),
        g(r(pt), {
          class: "agent-tab-body",
          tab: q.value,
          "data-agent-tab-body": (d = q.value) == null ? void 0 : d.key
        }, {
          default: v(() => {
            var B;
            return [
              g(r(Ge), {
                value: (B = q.value) == null ? void 0 : B.key
              }, tt({
                reports: v(() => [
                  r(R).length ? k("", !0) : (a(), N(r(ze), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: v(() => [...h[3] || (h[3] = [
                      f("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (a(!0), s(W, null, te(r(R), (E) => (a(), s("button", {
                    key: E.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${E.id}`,
                    onClick: (L) => r(we)(`messages:${E.id}`)
                  }, u(E.text), 9, ha))), 128))
                ]),
                tasks: v(() => {
                  var E;
                  return [
                    e.tasks.length ? k("", !0) : (a(), N(r(ze), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: v(() => [...h[4] || (h[4] = [
                        f("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (a(!0), s(W, null, te(i.value, (L) => (a(), N(va, {
                      key: L.state,
                      section: L,
                      open: $(L.state),
                      onToggle: (A) => C(L.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (E = e.facts) != null && E.instruction ? (a(), s(W, { key: 1 }, [
                      h[5] || (h[5] = y("p", { class: "agent-label" }, "Instruction", -1)),
                      y("div", fa, u(e.facts.instruction), 1)
                    ], 64)) : k("", !0)
                  ];
                }),
                transcript: v(() => {
                  var E;
                  return [
                    F.value ? (a(), s(W, { key: 0 }, [
                      (E = e.facts) != null && E.instruction ? (a(), s("div", ba, [
                        g(r(Je), {
                          label: "Instruction",
                          open: G.value,
                          "data-agent-section": "instruction",
                          onToggle: h[1] || (h[1] = (L) => G.value = !G.value)
                        }, {
                          default: v(() => [
                            y("div", ka, u(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (a(), s("p", ya, "No job recorded")) : k("", !0)
                    ], 64)) : k("", !0),
                    g(St, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                te(r(Q), (E, L) => ({
                  name: L,
                  fn: v(() => [
                    (a(), N(at(E), {
                      agent: e.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ];
          }),
          _: 1
        }, 8, ["tab", "data-agent-tab-body"]),
        Y.value ? (a(), N(ta, {
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
}, $a = /* @__PURE__ */ Z(Ma, [["__scopeId", "data-v-fabbecdf"]]), xa = { class: "line" }, Sa = {
  key: 0,
  class: "line",
  "data-agent-since": ""
}, Ca = {
  key: 1,
  class: "line",
  "data-agent-seen": ""
}, Ta = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" }, seen: { type: String, default: "" } },
  setup(e) {
    const l = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, o = c(() => l.has(t.state)), i = c(() => [t.doing, t.since, t.seen].filter(Boolean).join(". "));
    return (n, w) => (a(), N(r(fe), {
      as: "button",
      place: "corner",
      class: de(["agent-dot", { pulse: o.value }]),
      "data-state": e.state,
      "aria-label": i.value,
      "data-agent-status": "",
      onClick: w[0] || (w[0] = ee(() => {
      }, ["stop"]))
    }, {
      tip: v(() => [
        y("b", xa, u(e.doing), 1),
        e.since ? (a(), s("span", Sa, u(e.since), 1)) : k("", !0),
        e.seen ? (a(), s("span", Ca, u(e.seen), 1)) : k("", !0)
      ]),
      default: v(() => [
        w[1] || (w[1] = y("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, Aa = /* @__PURE__ */ Z(Ta, [["__scopeId", "data-v-1a0bc478"]]), ja = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, La = (e) => e.filter((l) => l.state !== "cancelled"), Ie = (e, l) => e.filter((t) => t.state === l).length, Ba = 5, Ra = (e, l) => e || l.split(/\s+/).slice(0, Ba).join(" ");
function Ia({ tasks: e, inHand: l, perHour: t }) {
  const o = La(e), i = Ie(o, "completed"), n = ja[l == null ? void 0 : l.state], w = o.filter((R) => R.state === "started").map((R) => ({ number: R.id, title: R.title })), $ = Math.max(w.length, l && l.state !== "completed" ? 1 : 0), C = o.length - i - $, j = i === o.length;
  return {
    number: l.id,
    title: l.title,
    started: w,
    plan: l.plan_id ?? 0,
    planTitle: l.plan_title ?? "",
    count: `${i} of ${o.length}`,
    taskTip: `${i} of its ${o.length} tasks done${n ? `. This one is ${n.words}.` : "."}`,
    countTip: j ? `All ${o.length} tasks done` : `${i} done, ${$} in hand, ${C} to go`,
    paceTip: !j && t ? `About ${t} an hour.` : "",
    rate: !j && t ? `${Math.round(t)}/hour` : "",
    bar: { total: o.length, done: i, testing: Ie(o, "testing"), started: Ie(o, "started") }
  };
}
const Oa = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, Va = {
  key: 0,
  class: "plan",
  "data-agent-job-launch": ""
}, za = {
  class: "task-line",
  "data-agent-task-line": ""
}, Ha = {
  key: 1,
  class: "tasks",
  "data-agent-tasks": ""
}, Ea = {
  key: 2,
  class: "tasks",
  "data-agent-tasks": ""
}, Na = {
  key: 4,
  class: "rate",
  "data-agent-rate": ""
}, Wa = { key: 0 }, Da = 3, qa = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, jobTitle: { type: String, default: "" }, jobLaunch: { type: String, default: "" }, perHour: { type: Number, default: 0 }, countsEmpty: { type: Boolean, default: !1 } },
  setup(e) {
    const l = e, t = c(() => l.inHand ? Ia({ tasks: l.tasks, inHand: l.inHand, perHour: l.perHour }) : null);
    return (o, i) => e.job && !t.value ? (a(), s("span", Oa, [
      g(r(fe), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: v(() => [
          y("b", null, u(e.job), 1)
        ]),
        default: v(() => [
          f(u(r(Ra)(e.jobTitle, e.job)), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (a(), s("span", Va, u(e.jobLaunch), 1)) : k("", !0)
    ])) : t.value ? (a(), s(W, { key: 1 }, [
      y("span", za, [
        t.value.plan ? (a(), N(r(fe), {
          key: 0,
          as: "button",
          class: "task",
          "data-agent-plan": "",
          "data-peek": `plans:${t.value.plan}`,
          "aria-label": `Plan ${t.value.plan}: ${t.value.planTitle}`,
          onClick: i[0] || (i[0] = ee((n) => r(we)(`plans:${t.value.plan}`), ["stop"]))
        }, {
          tip: v(() => [
            y("b", null, u(t.value.planTitle), 1),
            y("span", null, "Task " + u(t.value.number) + ": " + u(t.value.title), 1)
          ]),
          default: v(() => [
            f("Plan " + u(t.value.plan), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])) : t.value.started.length > Da ? (a(), s("span", Ha, [
          g(r(fe), {
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
        ])) : t.value.started.length > 1 ? (a(), s("span", Ea, [
          i[2] || (i[2] = f("Tasks ", -1)),
          (a(!0), s(W, null, te(t.value.started, (n, w) => (a(), s(W, {
            key: n.number
          }, [
            w ? (a(), s(W, { key: 0 }, [
              f(", ")
            ], 64)) : k("", !0),
            g(r(fe), {
              as: "button",
              class: "task",
              "data-agent-task": "",
              "data-peek": `tasks:${n.number}`,
              "aria-label": `Task ${n.number}: ${n.title}`,
              onClick: ee(($) => r(we)(`tasks:${n.number}`), ["stop"])
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
        ])) : (a(), N(r(fe), {
          key: 3,
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${t.value.number}`,
          "aria-label": `Task ${t.value.number}: ${t.value.title}`,
          onClick: i[1] || (i[1] = ee((n) => r(we)(`tasks:${t.value.number}`), ["stop"]))
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
        t.value.rate ? (a(), s("span", Na, u(t.value.rate), 1)) : k("", !0),
        g(r(fe), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: v(() => [
            y("b", null, u(t.value.countTip), 1),
            t.value.paceTip ? (a(), s("span", Wa, u(t.value.paceTip), 1)) : k("", !0)
          ]),
          default: v(() => [
            f(u(t.value.count), 1)
          ]),
          _: 1
        })
      ]),
      g(r(qe), {
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: t.value.bar.total,
        done: t.value.bar.done,
        testing: t.value.bar.testing,
        started: t.value.bar.started
      }, null, 8, ["total", "done", "testing", "started"])
    ], 64)) : e.countsEmpty ? (a(), s(W, { key: 2 }, [
      i[3] || (i[3] = y("span", {
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
      g(r(qe), {
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
}, Fa = /* @__PURE__ */ Z(qa, [["__scopeId", "data-v-c4044bd4"]]), Pa = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Ua = ["data-icon", "stroke-width", "innerHTML"], ae = {
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
    }, i = {
      agent: Pa,
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
      style: je({
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
      innerHTML: i[o[e.name] || e.name] || i.dot
    }, null, 12, Ua));
  }
}, Ga = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Ja = {
  key: 1,
  class: "menu-item-text"
}, Ka = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (l, t) => (a(), s("button", {
      type: "button",
      class: de(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), s("span", Ga, u(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (a(), s("span", Ja, [
        y("span", null, [
          Se(l.$slots, "default", {}, void 0, !0)
        ]),
        y("small", null, u(e.description), 1)
      ])) : Se(l.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ye = /* @__PURE__ */ Z(Ka, [["__scopeId", "data-v-fec99974"]]), Za = {}, Ya = { class: "menu-label" };
function Qa(e, l) {
  return a(), s("span", Ya, [
    Se(e.$slots, "default", {}, void 0, !0)
  ]);
}
const $e = /* @__PURE__ */ Z(Za, [["render", Qa], ["__scopeId", "data-v-aa955b3e"]]), Xa = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, _a = {
  key: 0,
  class: "skills-none"
}, en = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: l }) {
    const t = e, o = l, i = c(() => t.skills.filter((w) => w.state === "loaded")), n = c(() => t.skills.filter((w) => w.state !== "loaded"));
    return (w, $) => (a(), s("div", Xa, [
      g($e, null, {
        default: v(() => [...$[1] || ($[1] = [
          f("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      i.value.length ? k("", !0) : (a(), s("p", _a, "None yet. Compacting the conversation empties this list.")),
      (a(!0), s(W, null, te(i.value, (C) => (a(), s("p", {
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
        g($e, null, {
          default: v(() => [...$[2] || ($[2] = [
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
      g(ye, {
        "data-agent-skills-browse": "",
        onClick: $[0] || ($[0] = (C) => o("browse"))
      }, {
        default: v(() => [...$[3] || ($[3] = [
          f("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, tn = /* @__PURE__ */ Z(en, [["__scopeId", "data-v-be514d47"]]), an = ["disabled", "title"], nn = { class: "gauge usage" }, ln = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: l }) {
    const t = e, o = l, i = c(() => t.windows[0] ?? null), n = c(() => i.value && Number.isFinite(i.value.used_percent) ? Math.max(0, Math.min(100, Math.round(i.value.used_percent))) : null), w = c(() => n.value !== null && n.value >= 100), $ = c(() => {
      var j;
      return (j = i.value) != null && j.reset_epoch_seconds ? new Date(i.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), C = c(() => w.value ? `At usage limit: the plan's ${i.value.title} allowance is used up${$.value ? `, starts again ${$.value}` : ""}` : `${n.value}% of the plan's ${i.value.title} allowance used${$.value ? `, starts again ${$.value}` : ""}`);
    return (j, R) => n.value !== null ? (a(), s("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: C.value,
      onClick: R[0] || (R[0] = (F) => o("open", F.currentTarget))
    }, [
      g(ae, {
        name: "allowance",
        size: 12
      }),
      R[1] || (R[1] = f()),
      y("span", nn, [
        y("span", {
          style: je({ width: `${n.value}%` })
        }, null, 4)
      ]),
      f(" " + u(w.value ? "At usage limit" : `${n.value}%`), 1)
    ], 8, an)) : k("", !0);
  }
}, on = /* @__PURE__ */ Z(ln, [["__scopeId", "data-v-a36f09dc"]]), sn = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (l, t) => (a(), s("span", {
      class: de(["badge", e.tone])
    }, u(e.text), 3));
  }
}, rn = /* @__PURE__ */ Z(sn, [["__scopeId", "data-v-9e7e1157"]]), dn = (e, l, t) => Math.max(l, Math.min(t, e)), Ze = /* @__PURE__ */ new WeakMap(), un = (e, l) => Ze.set(e, l);
function cn(e, l) {
  for (let t = l; t; t = Ze.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function gn(e, l) {
  const t = (o) => {
    var n, w;
    const i = ((n = e.value) == null ? void 0 : n.element) || ((w = e.value) == null ? void 0 : w.$el) || e.value;
    i && !cn(i, o.target) && l(o);
  };
  window.addEventListener("click", t), xe(() => window.removeEventListener("click", t));
}
const ke = 8, vn = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const o = e, i = z(null), n = (d) => d ? `${d}px` : void 0, w = c(() => ({
      minWidth: n(o.minWidth),
      maxWidth: n(o.maxWidth),
      maxHeight: n(o.maxHeight),
      height: n(o.height)
    })), $ = z({ w: 0, h: 0 }), C = z(o.anchor ? o.anchor.getBoundingClientRect() : null), j = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), R = (d) => ({
      left: Math.max(0, d.left),
      top: Math.max(0, d.top),
      right: Math.min(window.innerWidth, d.right),
      bottom: Math.min(window.innerHeight, d.bottom)
    }), F = (d) => {
      const B = d.closest(".pane, .float-window");
      return B ? R(B.getBoundingClientRect()) : j();
    }, O = (d, B) => `${Math.max(0, d ? Math.min(d, B) : B)}px`;
    function D(d, B) {
      return {
        below: d.bottom - B.bottom - o.gap - ke,
        above: B.top - d.top - o.gap - ke,
        across: d.right - d.left - 2 * ke
      };
    }
    function T(d) {
      const B = F(o.anchor), E = D(B, d);
      return $.value.w <= E.across && $.value.h <= Math.max(E.below, E.above) ? B : j();
    }
    const V = c(() => {
      if (!C.value) return w.value;
      const d = C.value, B = T(d), E = D(B, d), { w: L, h: A } = $.value, oe = o.align === "auto" ? d.left + d.right > B.left + B.right : o.align === "right", K = dn(oe ? d.right - L : d.left, B.left + ke, Math.max(B.left + ke, B.right - L - ke)), b = A > E.below && E.above > E.below ? { bottom: `${window.innerHeight - d.top + o.gap}px`, maxHeight: O(o.maxHeight, E.above) } : { top: `${d.bottom + o.gap}px`, maxHeight: O(o.maxHeight, E.below) };
      return { ...w.value, ...b, left: `${K}px`, maxWidth: O(o.maxWidth, E.across) };
    }), q = t, Q = () => [...i.value.querySelectorAll("button:not(:disabled)")];
    function G(d) {
      const B = Q(), E = B.indexOf(document.activeElement);
      B[(E + d + B.length) % B.length].focus();
    }
    const X = { ArrowDown: () => G(1), ArrowUp: () => G(-1), Escape: () => q("close") }, ne = (d) => X[d.key] && (d.preventDefault(), X[d.key]()), P = () => i.value && ($.value = { w: i.value.offsetWidth, h: i.value.scrollHeight });
    let Y = 0;
    const M = new ResizeObserver(() => {
      cancelAnimationFrame(Y), Y = requestAnimationFrame(P);
    });
    gn(i, (d) => o.anchor && !o.anchor.contains(d.target) && q("close"));
    const p = (d, B) => ["top", "left", "right", "bottom"].some((E) => Math.abs(d[E] - B[E]) > 1), J = (d) => d.bottom < 0 || d.top > window.innerHeight;
    let m = 0;
    function h() {
      if (o.anchor) {
        const d = o.anchor.getBoundingClientRect();
        if (!o.anchor.isConnected || J(d)) return q("close");
        p(d, C.value) && (C.value = d);
      }
      m = requestAnimationFrame(h);
    }
    return nt(() => {
      o.anchor && i.value && un(i.value, o.anchor), P(), i.value && M.observe(i.value), !o.plain && Q()[0] && Q()[0].focus(), h();
    }), xe(() => {
      M.disconnect(), cancelAnimationFrame(m), cancelAnimationFrame(Y);
    }), l({ element: i }), (d, B) => (a(), N(lt, {
      to: "body",
      disabled: !e.anchor
    }, [
      y("div", ot({
        ref_key: "panel",
        ref: i
      }, d.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: V.value,
        onKeydown: ne
      }), [
        Se(d.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), pn = /* @__PURE__ */ Z(vn, [["__scopeId", "data-v-3d203970"]]);
async function mn(e, l, t) {
  if (!e) return t(l);
  const { target: o, fields: i } = e, n = Object.fromEntries(Object.keys(i).map((C) => [C, o[C]])), w = () => Object.assign(o, n);
  Object.assign(o, i);
  let $ = !1;
  try {
    const C = await t(l);
    return $ = C.ok, C;
  } finally {
    $ || w();
  }
}
function hn(e, l, t, { groups: o, programs: i }) {
  const n = z({}), w = z(""), $ = z(!1), C = c(() => !!e.value && !e.value.ended_at), j = c(() => C.value && !!e.value.paused_at);
  async function R(T, V = null) {
    w.value = "";
    const q = await mn(V, T, l);
    return w.value = q.ok ? "" : q.error, t(), q;
  }
  return { groups: o, programs: i, chosen: n, failure: w, asking: $, running: C, paused: j, choose: (T, V) => R(["agent", "control", String(e.value.number), T, V.value], { target: n, fields: { value: { ...n.value, [T]: V.label } } }), stop: () => ($.value = !1, R(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (T) => R(["agent", "launch", T.name]) };
}
function fn(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const bn = { compact: "Compaction", clear: "Clear" };
function kn(e) {
  return e != null && e.is_open ? `${bn[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
const yn = ["disabled", "title"], wn = ["disabled", "title"], Mn = { class: "gauge" }, $n = {
  key: 1,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
}, xn = ["disabled", "title"], Sn = ["disabled"], Cn = ["disabled"], Tn = {
  key: 5,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, An = ["title"], jn = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Ln = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Bn = { class: "gauge" }, Rn = { class: "context-used" }, In = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, On = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, Vn = 75, zn = {
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
    const t = e, o = l, i = hn(Be(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => o("changed"), { groups: Be(t, "controlGroups"), programs: Be(t, "agentPrograms") }), n = z(null), w = z(""), $ = c(() => i.groups.value.find((M) => M.key === w.value));
    function C(M, p) {
      n.value = M.currentTarget, w.value = p;
    }
    function j() {
      n.value = null, w.value = "", i.asking.value = !1;
    }
    const R = c(() => t.skills.filter((M) => M.state === "loaded"));
    function F(M) {
      C(M, "skills"), o("skills");
    }
    const O = (M) => i.groups.value.some((p) => p.key === M), D = c(() => {
      var M;
      return i.chosen.value.model ?? ((M = V.value) == null ? void 0 : M.model) ?? "";
    }), T = c(() => {
      var M;
      return i.chosen.value.effort ?? ((M = V.value) == null ? void 0 : M.effort) ?? "";
    });
    c(() => !!t.agent && !t.agent.ended_at);
    const V = c(() => {
      var M;
      return ((M = t.usage.agents) == null ? void 0 : M.find((p) => {
        var J;
        return p.id === ((J = t.agent) == null ? void 0 : J.id);
      })) ?? null;
    }), q = c(() => {
      var M;
      return ((M = V.value) == null ? void 0 : M.context_percent) == null ? null : Math.round(V.value.context_percent);
    }), Q = c(() => {
      var M;
      return kn(((M = V.value) == null ? void 0 : M.context_change) ?? null);
    }), G = (M) => `${Math.round(M / 1e3)}k`, X = c(() => {
      var M;
      return !!((M = V.value) != null && M.context_limit_tokens);
    }), ne = c(() => {
      var M, p;
      return ((M = V.value) == null ? void 0 : M.context_limit_tokens) || ((p = V.value) == null ? void 0 : p.context_window_tokens) || 0;
    }), P = c(() => ne.value ? `${G(V.value.context_tokens ?? 0)} of ${G(ne.value)}` : ""), Y = c(() => {
      var M;
      return (M = V.value) != null && M.cost_dollars ? `$${V.value.cost_dollars.toFixed(2)}` : "";
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
          ], 8, yn),
          g(on, {
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
            onClick: p[2] || (p[2] = (h) => O("context") ? C(h, "context") : o("open", "context", h.currentTarget))
          }, [
            g(ae, {
              name: "gauge",
              size: 12
            }),
            p[14] || (p[14] = f()),
            y("span", Mn, [
              y("span", {
                style: je({ width: `${q.value}%` })
              }, null, 4)
            ]),
            f(" " + u(q.value) + "% ", 1)
          ], 8, wn)) : (m = V.value) != null && m.context_unknown ? (a(), s("span", $n, [
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
            onClick: p[3] || (p[3] = (h) => O("model") ? C(h, "model") : null)
          }, [
            g(ae, {
              name: "model",
              size: 12
            }),
            f(" " + u(D.value), 1)
          ], 8, xn)) : k("", !0),
          O("effort") || e.card && T.value ? (a(), s("button", {
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
          ], 8, Sn)) : k("", !0),
          Y.value ? (a(), s("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: p[5] || (p[5] = (h) => o("open", "cost", h.currentTarget))
          }, u(Y.value), 9, Cn)) : k("", !0),
          e.branch ? (a(), s("span", Tn, [
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
            f(" " + u(R.value.length), 1)
          ])) : k("", !0),
          e.fitness ? (a(), s(W, { key: 8 }, [
            y("button", {
              type: "button",
              class: de(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Vn }]),
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
        r(i).failure.value ? (a(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: r(i).failure.value
        }, u(r(i).failure.value), 9, An)) : k("", !0),
        Se(M.$slots, "default", {}, void 0, !0),
        n.value ? (a(), N(pn, {
          key: 3,
          anchor: n.value,
          "min-width": 190,
          onClose: j
        }, {
          default: v(() => {
            var h;
            return [
              w.value === "agent" ? (a(), s(W, { key: 0 }, [
                r(i).asking.value ? (a(), s(W, { key: 0 }, [
                  g($e, { "data-agent-stop-ask": "" }, {
                    default: v(() => [...p[17] || (p[17] = [
                      f("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  g(ye, {
                    "data-agent-stop-confirm": "",
                    onClick: p[10] || (p[10] = (d) => (j(), r(i).stop()))
                  }, {
                    default: v(() => [...p[18] || (p[18] = [
                      f("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  g(ye, {
                    onClick: p[11] || (p[11] = (d) => r(i).asking.value = !1)
                  }, {
                    default: v(() => [...p[19] || (p[19] = [
                      f("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (a(), N(ye, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: p[12] || (p[12] = (d) => r(i).asking.value = !0)
                }, {
                  default: v(() => [...p[20] || (p[20] = [
                    f("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : w.value === "start" ? (a(), s(W, { key: 1 }, [
                g($e, null, {
                  default: v(() => [...p[21] || (p[21] = [
                    f("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (a(!0), s(W, null, te(r(i).programs.value, (d) => (a(), N(ye, {
                  key: d.name,
                  "data-agent-program": d.name,
                  onClick: (B) => (j(), r(i).start(d))
                }, {
                  default: v(() => [
                    f(u(d.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : w.value === "skills" ? (a(), N(tn, {
                key: 2,
                skills: e.skills,
                onBrowse: p[13] || (p[13] = (d) => (j(), o("open", "skills", null)))
              }, null, 8, ["skills"])) : $.value ? (a(), s(W, { key: 3 }, [
                g($e, null, {
                  default: v(() => [
                    f(u($.value.label), 1)
                  ]),
                  _: 1
                }),
                w.value === "context" ? (a(), s(W, { key: 0 }, [
                  y("p", jn, u(r(fn)(((h = V.value) == null ? void 0 : h.last_compaction) ?? null)), 1),
                  y("div", Ln, [
                    y("span", Bn, [
                      y("span", {
                        style: je({ width: `${q.value}%` })
                      }, null, 4)
                    ]),
                    y("span", Rn, u(q.value) + "%", 1)
                  ]),
                  P.value ? (a(), s("p", In, [
                    f(u(P.value) + " ", 1),
                    X.value ? (a(), N(rn, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : k("", !0)
                  ])) : k("", !0)
                ], 64)) : k("", !0),
                w.value === "context" && Q.value ? (a(), s("p", On, u(Q.value), 1)) : (a(!0), s(W, { key: 2 }, te($.value.choices, (d) => (a(), N(ye, {
                  key: d.value,
                  "data-agent-choice": d.value,
                  onClick: (B) => (r(i).choose($.value.key, d), j())
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
}, Hn = /* @__PURE__ */ Z(zn, [["__scopeId", "data-v-d7113347"]]), En = ["data-agent-open", "aria-expanded", "role", "tabindex"], Nn = {
  class: "agent-head",
  "data-agent-head": ""
}, Wn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Dn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, qn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Fn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Pn = {
  key: 0,
  class: "agent-menu",
  "data-agent-menu-panel": ""
}, Un = {
  key: 1,
  class: "agent-line"
}, Gn = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Jn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, Kn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, Zn = {
  key: 3,
  class: "agent-unit",
  "data-agent-unit": ""
}, Yn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), o = ["completed", "testing"], i = { running: "Working", starting: "Starting", stopping: "Stopping", ended: "Idle: its process has stopped", failed: "Could not start", never_started: "Not started" }, n = e, w = l, $ = Ke(), C = z(!1), j = c(() => mt(n.row, n.facts)), R = c(() => {
      var b;
      return ((b = n.facts) == null ? void 0 : b.tasks) ?? [];
    }), F = c(() => R.value.filter((b) => b.state === "open")), O = c(() => R.value.find((b) => {
      var I;
      return b.id === ((I = n.progress) == null ? void 0 : I.task_id) && b.state === "started";
    })), D = c(() => O.value || R.value.find((b) => {
      var I;
      return b.id === ((I = n.facts) == null ? void 0 : I.task_id);
    }) || R.value.find((b) => t.has(b.state)) || F.value[0] || R.value.at(-1)), T = c(() => {
      var b, I, se, ce, le, ve;
      return n.row.role === "helper" ? ((b = n.facts) == null ? void 0 : b.helper_job) || "" : (I = n.facts) != null && I.job_enabled && (((se = O.value) == null ? void 0 : se.title) || ((ce = n.facts) == null ? void 0 : ce.task_title) || ((le = F.value[0]) == null ? void 0 : le.title) || ((ve = R.value.at(-1)) == null ? void 0 : ve.title)) || "";
    }), V = c(() => ht(n.row)), q = c(() => {
      var b, I;
      return [n.row.program, (b = n.facts) == null ? void 0 : b.model, (I = n.facts) == null ? void 0 : I.effort, V.value].filter(Boolean).join(" · ");
    }), Q = Le(), G = /* @__PURE__ */ new Set(["open", "started", "testing"]), X = { fresh: "new conversation", resumed: "resumed" }, ne = c(() => {
      var b, I;
      return [(b = n.facts) == null ? void 0 : b.helper_job_program, X[(I = n.facts) == null ? void 0 : I.occupant_launch]].filter(Boolean).join(", ");
    }), P = c(() => {
      var b;
      return (b = n.facts) == null ? void 0 : b.work_status;
    }), Y = c(() => !!n.row.ended_at && n.row.role !== "main" && R.value.some((b) => G.has(b.state))), M = c(() => {
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
      return ((b = n.progress) == null ? void 0 : b.completed_count) ?? R.value.filter((I) => o.includes(I.state)).length;
    }), B = c(() => {
      var b;
      return ft(d.value, ((b = n.progress) == null ? void 0 : b.started_at) || n.row.created_at, n.progress ? n.progress.finished_at : n.row.ended_at, $.value);
    }), E = c(() => n.row.role === "main" ? 0 : B.value), L = c(() => !!n.row.retired_at || n.row.state === "retired"), A = c(() => L.value ? "Retired" : m.value === "blocked" || m.value === "waiting" ? h.value || (m.value === "blocked" ? "Blocked" : "Waiting") : i[n.row.standing]), oe = c(() => {
      var I;
      if (L.value) return n.row.retired_at;
      const b = m.value === "blocked" || m.value === "waiting";
      return n.row.ended_at || b && ((I = n.facts) == null ? void 0 : I.last_activity) || n.row.process_started_at || n.row.created_at;
    }), K = c(() => bt(oe.value, $.value)), Me = c(() => {
      var b;
      return kt((b = n.facts) == null ? void 0 : b.last_activity, $.value);
    });
    return (b, I) => {
      var se, ce, le, ve, he, re;
      return a(), s("div", {
        class: de(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: I[2] || (I[2] = (ue) => !e.open && w("toggle")),
        onKeydown: [
          I[3] || (I[3] = We(ee((ue) => !e.open && w("toggle"), ["self", "prevent"]), ["enter"])),
          I[4] || (I[4] = We(ee((ue) => !e.open && w("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        y("div", Nn, [
          e.open ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back",
            "aria-label": "Back",
            onClick: I[0] || (I[0] = ee((ue) => w("toggle"), ["stop"]))
          }, [
            g(r(Ve), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : k("", !0),
          e.open ? (a(), s(W, { key: 1 }, [
            y("span", Wn, u(j.value.title), 1),
            y("span", Dn, u(j.value.subtext), 1),
            g(r(_), {
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
            g(r(yt), {
              "agent-id": e.row.id,
              label: j.value.text,
              class: "agent-who"
            }, {
              default: v(() => [
                y("span", qn, u(j.value.title), 1),
                y("span", Fn, u(j.value.subtext), 1)
              ]),
              _: 1
            }, 8, ["agent-id", "label"]),
            g(r(Ve), {
              class: "agent-chevron",
              name: "chevronRight",
              size: 12
            })
          ], 64))
        ]),
        e.open && C.value ? (a(), s("div", Pn, [
          g(Qt, {
            row: e.row,
            held: m.value === "blocked"
          }, null, 8, ["row", "held"])
        ])) : k("", !0),
        e.open ? k("", !0) : (a(), s("span", Un, [
          y("span", Gn, u(q.value), 1),
          (se = e.facts) != null && se.sandbox_off ? (a(), s("span", Jn, "sandbox off")) : k("", !0)
        ])),
        e.open && !L.value ? (a(), N(Hn, {
          key: 2,
          class: "agent-live",
          "agent-programs": r(Q).props.programs.rows.value,
          agent: e.row,
          branch: (ce = e.progress) == null ? void 0 : ce.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((le = e.facts) == null ? void 0 : le.windows) ?? [] },
          card: ""
        }, {
          default: v(() => {
            var ue;
            return [
              (ue = e.facts) != null && ue.sandbox_off ? (a(), s("span", Kn, "sandbox off")) : k("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : k("", !0),
        !e.open && ((ve = e.facts) != null && ve.unit_name) ? (a(), s("div", Zn, "Unit: " + u(e.facts.unit_name), 1)) : k("", !0),
        e.open ? k("", !0) : (a(), N(Fa, {
          key: 4,
          tasks: R.value,
          "in-hand": e.row.role !== "helper" && ((he = e.facts) != null && he.job_enabled) && D.value || null,
          job: e.row.role === "helper" ? T.value : "",
          "job-title": e.row.role === "helper" && ((re = e.facts) == null ? void 0 : re.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? ne.value : "",
          "per-hour": E.value,
          "counts-empty": e.row.role === "worker"
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour", "counts-empty"])),
        g(Aa, {
          state: m.value,
          doing: A.value,
          since: K.value,
          seen: Me.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (a(), N($a, {
          key: 5,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: R.value,
          "stopped-with-work": Y.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : k("", !0)
      ], 42, En);
    };
  }
}, Qn = /* @__PURE__ */ Z(Yn, [["__scopeId", "data-v-eff0190d"]]), Xn = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, _n = ["data-agent-row", "data-agent-lingering"], Fe = "journal.agents.filters", Pe = 300 * 1e3, Ae = "cubic-bezier(0.2, 0.9, 0.25, 1)", el = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const l = e, t = Le(), { rows: o } = t.props.waits, { rows: i } = t.props.progress, { rows: n, failure: w, loaded: $, more: C } = t.props.agents, j = (S) => i.value.find((H) => H.agent_id === S.id) ?? null, R = (S) => {
      var H;
      return ((H = o.value.find((x) => x.agent_id === S.id)) == null ? void 0 : H.reason) ?? "";
    }, F = z("running"), O = z(""), D = JSON.parse(localStorage.getItem(Fe) || '{"roles":[],"profiles":[],"programs":[]}'), T = z(D), V = c(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: q } = t.props.programs, Q = c(() => T.value.roles.length + T.value.profiles.length + T.value.programs.length), G = (S, H) => {
      T.value = xt(T.value, S, H);
    }, X = () => {
      T.value = { roles: [], profiles: [], programs: [] };
    }, ne = (S) => S.slice(0, 1).toUpperCase() + S.slice(1);
    ge(T, (S) => localStorage.setItem(Fe, JSON.stringify(S)));
    const P = z(25);
    function Y() {
      Object.assign(t.state, {
        "agents.show": F.value,
        "agents.search": O.value,
        "agents.limit": String(P.value),
        "agents.roles": T.value.roles.join(","),
        "agents.profiles": T.value.profiles.join(","),
        "agents.programs": T.value.programs.join(",")
      });
    }
    async function M() {
      return P.value += 25, Y(), await t.reload("agents"), !0;
    }
    ge([F, O, T], () => {
      P.value = 25, Y(), t.reload("agents");
    }), Y();
    const p = (S) => S.facts ?? null, J = n, m = Ke(), h = z([]), d = c(() => new Set(h.value.filter((S) => m.value - S.left < Pe).map((S) => S.row.id))), B = c(() => h.value.filter((S) => d.value.has(S.row.id)).map((S) => S.row)), E = c(() => [...J.value, ...B.value]);
    let L = "", A = [];
    async function oe(S) {
      await t.reload(`card.${S.id}`);
      const H = t.props[`card.${S.id}`].rows.value.find((x) => x.id === S.id);
      H != null && H.ended_at && !h.value.some((x) => x.row.id === S.id) && (h.value = [...h.value, { row: H, left: Date.now() }]);
    }
    ge(n, (S) => {
      const H = L === `${F.value}|${O.value}|${JSON.stringify(T.value)}` && F.value === "running", x = H ? A.filter((U) => !S.some((pe) => pe.id === U.id)) : [];
      L = `${F.value}|${O.value}|${JSON.stringify(T.value)}`, A = S, h.value = H ? h.value.filter((U) => m.value - U.left < Pe && !S.some((pe) => pe.id === U.row.id)) : [], x.forEach(oe);
    }, { immediate: !0 });
    const K = c(() => !!O.value.trim() || Q.value > 0), Me = c(() => l.texts[F.value] ?? { title: l.empty, hint: "" }), b = z(null), I = z(null), se = z(null), ce = z(null), le = c(() => b.value === null ? null : t.props[`card.${b.value}`].rows.value.find((S) => S.id === b.value) ?? I.value), ve = c(() => le.value ? [le.value] : E.value), he = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, re = z(!1);
    let ue = 0;
    async function Ye(S) {
      if (re.value) return;
      re.value = !0, ue = ce.value.scrollTop;
      const H = se.value.querySelector(`[data-agent-open="${S.id}"]`);
      if (!he()) {
        const me = [...se.value.querySelectorAll(".agent-row")].filter((ie) => !ie.contains(H));
        await Promise.all(me.map((ie) => ie.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const x = [...H.querySelectorAll(".agent-head, .agent-line")], U = [...x, ...H.querySelectorAll("[data-agent-motion]")], pe = U.map((me) => me.getBoundingClientRect());
      if (I.value = S, b.value = S.id, t.reload(`card.${S.id}`), await De(), !he()) {
        const me = U.map((ie) => ie.getBoundingClientRect());
        U.forEach((ie, Ce) => {
          const be = x.findIndex((Ne) => Ne !== ie && Ne.contains(ie)), Xe = pe[Ce].left - me[Ce].left - (be < 0 ? 0 : pe[be].left - me[be].left), _e = pe[Ce].top - me[Ce].top - (be < 0 ? 0 : pe[be].top - me[be].top);
          ie.animate([{ transform: `translate(${Xe}px, ${_e}px)` }, { transform: "none" }], { duration: 280, easing: Ae });
        }), se.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((ie) => {
          ie.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Ae, fill: "backwards" });
        });
      }
      re.value = !1;
    }
    async function He() {
      if (re.value || !le.value) return;
      re.value = !0;
      const S = se.value.querySelector(`[data-agent-open="${b.value}"]`), H = [...S.children], x = he() ? [] : H.map((U) => U.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(x.map((U) => U.finished)), b.value = null, await De(), ce.value.scrollTop = ue, x.forEach((U) => U.cancel()), he() || (S.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Ae }), se.value.querySelectorAll(".agent-row").forEach((U) => {
        U.contains(S) || U.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Ae });
      })), re.value = !1;
    }
    const Qe = (S) => b.value === S.id ? He() : Ye(S);
    ge(O, (S) => S.trim() && (b.value = null)), ge(F, () => {
      b.value = null;
    });
    const Ee = (S) => {
      S.key === "Escape" && He();
    };
    return window.addEventListener("keydown", Ee), xe(() => window.removeEventListener("keydown", Ee)), (S, H) => (a(), s("div", {
      ref_key: "agents",
      ref: se,
      class: de(["agents", { focused: le.value, "card-changing": re.value }])
    }, [
      le.value ? k("", !0) : (a(), N(r(wt), {
        key: 0,
        modelValue: O.value,
        "onUpdate:modelValue": H[1] || (H[1] = (x) => O.value = x),
        placeholder: "Search agents",
        "menu-count": Q.value,
        "data-agents-search": ""
      }, {
        menu: v(() => [
          g(r(Re), null, {
            default: v(() => [...H[2] || (H[2] = [
              f("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(W, null, te(V.value.roles, (x) => (a(), N(r(Te), {
            key: x,
            role: "menuitemcheckbox",
            "aria-checked": T.value.roles.includes(x),
            checked: T.value.roles.includes(x),
            "data-filter-role": x,
            onClick: (U) => G("roles", x)
          }, {
            default: v(() => [
              f(u(ne(x)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          V.value.profiles.length ? (a(), N(r(Re), { key: 0 }, {
            default: v(() => [...H[3] || (H[3] = [
              f("Profile", -1)
            ])]),
            _: 1
          })) : k("", !0),
          (a(!0), s(W, null, te(V.value.profiles, (x) => (a(), N(r(Te), {
            key: x.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.profiles.includes(x.name),
            checked: T.value.profiles.includes(x.name),
            "data-filter-profile": x.name,
            onClick: (U) => G("profiles", x.name)
          }, {
            default: v(() => [
              f(u(x.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          g(r(Re), null, {
            default: v(() => [...H[4] || (H[4] = [
              f("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(W, null, te(r(q), (x) => (a(), N(r(Te), {
            key: x.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.programs.includes(x.name),
            checked: T.value.programs.includes(x.name),
            "data-filter-program": x.name,
            onClick: (U) => G("programs", x.name)
          }, {
            default: v(() => [
              f(u(x.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          Q.value ? (a(), N(r(Te), {
            key: 1,
            "data-filter-clear": "",
            onClick: X
          }, {
            default: v(() => [...H[5] || (H[5] = [
              f("Clear filters", -1)
            ])]),
            _: 1
          })) : k("", !0)
        ]),
        default: v(() => [
          g(r(Mt), {
            options: V.value.states,
            value: F.value,
            onPick: H[0] || (H[0] = (x) => F.value = x)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      F.value === "retired" && V.value.upgrade_retired ? (a(), s("p", Xn, "Retired during the upgrade: " + u(V.value.upgrade_retired), 1)) : k("", !0),
      y("div", {
        ref_key: "list",
        ref: ce,
        class: de(["agents-view", { "agents-view-open": le.value }])
      }, [
        r($) && !r(w) && !ve.value.length && Q.value ? (a(), N(r(ze), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: v(() => [
            g(r(_), {
              small: "",
              "data-empty-clear": "",
              onClick: X
            }, {
              default: v(() => [...H[6] || (H[6] = [
                f("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), N(r($t), {
          key: 1,
          moves: "",
          "leaves-at-once": re.value,
          rows: ve.value,
          failure: r(w),
          loaded: r($),
          more: !le.value && r(C),
          older: M,
          empty: Me.value.title,
          hint: Me.value.hint,
          searching: K.value
        }, {
          default: v(({ row: x }) => [
            y("div", {
              class: de(["agent-row", { lingering: d.value.has(x.id) && x.id !== b.value }]),
              "data-agent-row": x.id,
              "data-agent-lingering": d.value.has(x.id) ? "" : null
            }, [
              g(Qn, {
                row: x,
                facts: p(x),
                progress: j(x),
                "wait-reason": R(x),
                open: x.id === b.value,
                onToggle: (U) => Qe(x)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, _n)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, ll = /* @__PURE__ */ Z(el, [["__scopeId", "data-v-6542daf5"]]);
export {
  ll as A
};
