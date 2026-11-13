<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
import { openBlock as a, createElementBlock as s, withModifiers as te, createElementVNode as b, createVNode as v, unref as i, withCtx as p, createTextVNode as h, Fragment as q, renderList as ae, toDisplayString as u, createBlock as N, createCommentVNode as f, ref as z, computed as g, watch as ve, onUnmounted as Ce, defineAsyncComponent as Xe, createSlots as et, resolveDynamicComponent as tt, normalizeClass as de, normalizeStyle as Re, renderSlot as Te, onMounted as at, Teleport as nt, mergeProps as lt, toRef as Ie, withKeys as De, nextTick as qe } from "vue";
import { TextInput as Ve, Btn as ee, TextArea as ot, TimeAgo as Ee, useWindow as Be, SwitchCase as Ge, peekRef as we, Icon as ze, RunningCommand as st, FoldGroup as Je, TaskStatusIcon as it, loadWindowComponent as rt, coalesced as dt, READ_RATES as ut, eventMayBeChildOf as ct, InnerTabs as gt, TabBody as vt, EmptyState as He, HoverTip as fe, TaskBar as pt, useNow as Ke, agentTitle as mt, agentNumber as ht, age as ft, perHour as bt, sinceWords as kt, seenWords as yt, AgentTip as wt, SearchBar as Mt, Segmented as $t, MenuLabel as Oe, MenuItem as je, RowList as xt, toggleFilter as St } from "@journal/window-kit";
import { _ as Z, T as Ct } from "./TranscriptRows-Crmxs6Un.js";
const Tt = { class: "action-buttons" }, At = {
========
import { openBlock as a, createElementBlock as s, withModifiers as te, createElementVNode as w, createVNode as m, unref as i, withCtx as h, createTextVNode as b, Fragment as q, renderList as ae, toDisplayString as c, createBlock as N, createCommentVNode as k, ref as z, computed as u, watch as ge, onUnmounted as xe, defineAsyncComponent as _e, createSlots as et, resolveDynamicComponent as tt, normalizeClass as de, normalizeStyle as je, renderSlot as $e, onMounted as at, Teleport as nt, mergeProps as ot, toRef as Be, withKeys as Ne, nextTick as We } from "vue";
import { TextInput as Ie, Btn as _, TextArea as lt, TimeAgo as Pe, useWindow as Le, SwitchCase as Ue, peekRef as Se, Icon as Oe, RunningCommand as st, FoldGroup as Ge, TaskStatusIcon as it, loadWindowComponent as rt, coalesced as dt, READ_RATES as ut, eventMayBeChildOf as ct, InnerTabs as gt, TabBody as vt, EmptyState as Ve, HoverTip as we, TaskBar as pt, useNow as Je, agentTitle as mt, agentNumber as ht, perHour as ft, sinceWords as bt, seenWords as kt, AgentTip as yt, SearchBar as wt, Segmented as Mt, MenuLabel as Re, MenuItem as Ae, RowList as xt, toggleFilter as $t } from "@journal/window-kit";
import { _ as Z, T as St } from "./TranscriptRows-Crmxs6Un.js";
const Ct = { class: "action-buttons" }, At = {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
  __name: "AgentDriverForm",
  props: { program: String, model: String, pending: Boolean },
  emits: ["submit", "cancel", "update:program", "update:model"],
  setup(e) {
    return (l, t) => (a(), s("form", {
      "data-agent-driver-form": "",
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
      onSubmit: t[3] || (t[3] = te((o) => l.$emit("submit"), ["prevent"]))
    }, [
      t[6] || (t[6] = b("p", null, "Starts the next session on this program; the agent keeps its number and memories.", -1)),
      v(i(Ve), {
========
      onSubmit: t[3] || (t[3] = te((l) => o.$emit("submit"), ["prevent"]))
    }, [
      t[6] || (t[6] = w("p", null, "Starts the next session on this program; the agent keeps its number and memories.", -1)),
      m(i(Ie), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
        "model-value": e.program,
        label: "Program",
        disabled: e.pending,
        "data-agent-driver-program": "",
        "onUpdate:modelValue": t[0] || (t[0] = (o) => l.$emit("update:program", o))
      }, null, 8, ["model-value", "disabled"]),
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
      v(i(Ve), {
========
      m(i(Ie), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
        "model-value": e.model,
        label: "Model",
        disabled: e.pending,
        "data-agent-driver-model": "",
        "onUpdate:modelValue": t[1] || (t[1] = (o) => l.$emit("update:model", o))
      }, null, 8, ["model-value", "disabled"]),
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
      b("div", Tt, [
        v(i(ee), {
========
      w("div", Ct, [
        m(i(_), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          type: "submit",
          small: "",
          disabled: e.pending || !e.program.trim() || !e.model.trim(),
          "data-agent-confirm-driver": ""
        }, {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          default: p(() => [...t[4] || (t[4] = [
            h("Change the driver", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        v(i(ee), {
========
          default: h(() => [...t[4] || (t[4] = [
            b("Change the driver", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        m(i(_), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          small: "",
          disabled: e.pending,
          onClick: t[2] || (t[2] = (o) => l.$emit("cancel"))
        }, {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          default: p(() => [...t[5] || (t[5] = [
            h("Cancel", -1)
========
          default: h(() => [...t[5] || (t[5] = [
            b("Cancel", -1)
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Tt = /* @__PURE__ */ Z(At, [["__scopeId", "data-v-c138a4da"]]), jt = { class: "action-field" }, Lt = ["value", "disabled"], Bt = ["value"], Rt = { key: 1 }, It = {
  key: 1,
  class: "action-field"
}, Ot = { class: "action-buttons" }, Vt = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
    return (l, t) => (a(), s("form", {
      onSubmit: t[4] || (t[4] = te((o) => l.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (a(), s(q, { key: 0 }, [
        b("label", Lt, [
          t[6] || (t[6] = h("Task ", -1)),
          b("select", {
========
    return (o, t) => (a(), s("form", {
      onSubmit: t[4] || (t[4] = te((l) => o.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (a(), s(q, { key: 0 }, [
        w("label", jt, [
          t[6] || (t[6] = b("Task ", -1)),
          w("select", {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: t[0] || (t[0] = (o) => l.$emit("update:task", o.target.value))
          }, [
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
            t[5] || (t[5] = b("option", { value: "" }, "Choose an open task", -1)),
            (a(!0), s(q, null, ae(e.tasks, (o) => (a(), s("option", {
              key: o.id,
              value: String(o.id)
            }, u(o.id) + ": " + u(o.title), 9, Bt))), 128))
          ], 40, Rt)
========
            t[5] || (t[5] = w("option", { value: "" }, "Choose an open task", -1)),
            (a(!0), s(q, null, ae(e.tasks, (l) => (a(), s("option", {
              key: l.id,
              value: String(l.id)
            }, c(l.id) + ": " + c(l.title), 9, Bt))), 128))
          ], 40, Lt)
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
        ]),
        e.moreTasks ? (a(), N(i(_), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: t[1] || (t[1] = (o) => l.$emit("more"))
        }, {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          default: p(() => [...t[7] || (t[7] = [
            h("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : f("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (a(), s("p", It, "No open tasks.")) : f("", !0)
      ], 64)) : (a(), s("label", Ot, [
        t[8] || (t[8] = h("Job", -1)),
        v(i(ot), {
========
          default: h(() => [...t[7] || (t[7] = [
            b("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : k("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (a(), s("p", Rt, "No open tasks.")) : k("", !0)
      ], 64)) : (a(), s("label", It, [
        t[8] || (t[8] = b("Job", -1)),
        m(i(lt), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (o) => l.$emit("update:text", o.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
      b("div", Vt, [
        v(i(ee), {
========
      w("div", Ot, [
        m(i(_), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          default: p(() => [...t[9] || (t[9] = [
            h("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        v(i(ee), {
========
          default: h(() => [...t[9] || (t[9] = [
            b("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        m(i(_), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          small: "",
          disabled: e.pending,
          onClick: t[3] || (t[3] = (o) => l.$emit("cancel"))
        }, {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          default: p(() => [...t[10] || (t[10] = [
            h("Cancel", -1)
========
          default: h(() => [...t[10] || (t[10] = [
            b("Cancel", -1)
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
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
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
      onSubmit: t[2] || (t[2] = te((o) => l.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = b("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      v(i(Ve), {
========
      onSubmit: t[2] || (t[2] = te((l) => o.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = w("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      m(i(Ie), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (o) => l.$emit("update:reason", o))
      }, null, 8, ["model-value", "disabled"]),
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
      b("div", Et, [
        v(i(ee), {
========
      w("div", Ht, [
        m(i(_), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          default: p(() => [...t[3] || (t[3] = [
            h("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        v(i(ee), {
========
          default: h(() => [...t[3] || (t[3] = [
            b("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        m(i(_), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (o) => l.$emit("cancel"))
        }, {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          default: p(() => [...t[4] || (t[4] = [
            h("Cancel", -1)
========
          default: h(() => [...t[4] || (t[4] = [
            b("Cancel", -1)
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
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
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
    return (l, t) => (a(), s("div", Dt, [
      e.sessions.length ? f("", !0) : (a(), s("p", qt, "This agent has no session in its history.")),
      b("ol", null, [
        (a(!0), s(q, null, ae(e.sessions, (o) => (a(), s("li", {
          key: o.session,
          "data-agent-session": ""
        }, [
          b("span", null, u([o.program, o.model].filter(Boolean).join(" ")), 1),
          o.started_at ? (a(), s("span", Ft, [
            t[1] || (t[1] = h("Started ", -1)),
            v(i(Ee), {
              at: o.started_at
            }, null, 8, ["at"])
          ])) : f("", !0),
          b("span", Pt, u(o.end_reason ? `Ended: ${o.end_reason.replaceAll("_", " ")}` : o.started_at ? "Running" : "Not started"), 1),
          b("code", null, u(o.session), 1)
        ]))), 128))
      ]),
      b("div", Ut, [
        v(i(ee), {
========
    return (o, t) => (a(), s("div", Wt, [
      e.sessions.length ? k("", !0) : (a(), s("p", Dt, "This agent has no session in its history.")),
      w("ol", null, [
        (a(!0), s(q, null, ae(e.sessions, (l) => (a(), s("li", {
          key: l.session,
          "data-agent-session": ""
        }, [
          w("span", null, c([l.program, l.model].filter(Boolean).join(" ")), 1),
          l.started_at ? (a(), s("span", qt, [
            t[1] || (t[1] = b("Started ", -1)),
            m(i(Pe), {
              at: l.started_at
            }, null, 8, ["at"])
          ])) : k("", !0),
          w("span", Ft, c(l.end_reason ? `Ended: ${l.end_reason.replaceAll("_", " ")}` : l.started_at ? "Running" : "Not started"), 1),
          w("code", null, c(l.session), 1)
        ]))), 128))
      ]),
      w("div", Pt, [
        m(i(_), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          small: "",
          onClick: t[0] || (t[0] = (o) => l.$emit("close"))
        }, {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          default: p(() => [...t[2] || (t[2] = [
            h("Close", -1)
========
          default: h(() => [...t[2] || (t[2] = [
            b("Close", -1)
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Gt = /* @__PURE__ */ Z(Ut, [["__scopeId", "data-v-0d688bd9"]]), Jt = { class: "action-buttons" }, Kt = {
  key: 0,
  role: "alert"
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
}, _t = {
========
}, Zt = {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
  key: 1,
  role: "status"
}, Yt = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 }, held: { type: Boolean, default: !1 } },
  setup(e) {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
    const l = e, t = Be(), o = z(""), r = z(""), n = z(""), k = z(""), $ = z(""), C = z(""), L = z([]), I = z(0), F = z(!1), O = z(!1), W = z(!1), A = z(""), V = z(""), D = z([]), Y = g(() => !!l.row.retired_at || l.row.state === "retired"), J = g(() => !Y.value && !!l.row.ended_at), Q = g(() => {
      var R;
      return J.value && ((R = l.row.job_command) == null ? void 0 : R.length) && !l.row.resume_reason;
    }), le = g(() => Q.value && !O.value && (l.row.job_task_flag ? L.value.some((R) => String(R.id) === C.value) : !!r.value.trim()));
    function P(R) {
      o.value = R, r.value = "", n.value = "", C.value = "", A.value = "", V.value = "";
    }
    async function _() {
      P("job"), l.row.job_task_flag && (L.value = [], I.value = 0, F.value = !1, await w());
========
    const o = e, t = Le(), l = z(""), r = z(""), n = z(""), y = z(""), x = z(""), C = z(""), j = z([]), R = z(0), F = z(!1), O = z(!1), W = z(!1), A = z(""), V = z(""), D = z([]), Q = u(() => !!o.row.retired_at || o.row.state === "retired"), G = u(() => !Q.value && !!o.row.ended_at), X = u(() => {
      var L;
      return G.value && ((L = o.row.job_command) == null ? void 0 : L.length) && !o.row.resume_reason;
    }), ne = u(() => X.value && !O.value && (o.row.job_task_flag ? j.value.some((L) => String(L.id) === C.value) : !!r.value.trim()));
    function P(L) {
      l.value = L, r.value = "", n.value = "", C.value = "", A.value = "", V.value = "";
    }
    async function Y() {
      P("job"), o.row.job_task_flag && (j.value = [], R.value = 0, F.value = !1, await M());
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
    }
    async function M() {
      if (!O.value) {
        O.value = !0;
        try {
          t.state["jobs.page"] = String(R.value + 1), await t.reload("jobs");
          const L = t.props.jobs;
          A.value = L.failure.value, A.value || (j.value = [...j.value, ...L.rows.value], R.value = L.data.value.page, F.value = L.more.value);
        } finally {
          O.value = !1;
        }
      }
    }
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
    async function m() {
      await U(["process", "lift-hold", String(l.row.number)], "Hold lifted.");
========
    async function g() {
      await J(["process", "lift-hold", String(o.row.number)], "Hold lifted.");
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
    }
    async function J(L, T) {
      if (!W.value) {
        W.value = !0, A.value = "";
        try {
          const le = await t.run(L);
          A.value = le.ok ? "" : le.error, le.ok && (P(""), V.value = T);
        } finally {
          W.value = !1;
        }
      }
    }
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
    async function y() {
      if (!le.value) return;
      const R = l.row.job_task_flag ? [l.row.job_task_flag, C.value] : [r.value.trim()];
      await U([...l.row.job_command, String(l.row.number), ...R], "Job sent.");
    }
    async function c() {
      if (!W.value) {
        W.value = !0;
        try {
          const R = await t.run(["agent", "sessions", String(l.row.number)]);
          P(R.ok ? "history" : ""), A.value = R.ok ? "" : R.error, D.value = R.ok ? R.value.rows : [];
========
    async function v() {
      if (!ne.value) return;
      const L = o.row.job_task_flag ? [o.row.job_task_flag, C.value] : [r.value.trim()];
      await J([...o.row.job_command, String(o.row.number), ...L], "Job sent.");
    }
    async function p() {
      if (!W.value) {
        W.value = !0;
        try {
          const L = await t.run(["agent", "sessions", String(o.row.number)]);
          P(L.ok ? "history" : ""), A.value = L.ok ? "" : L.error, D.value = L.ok ? L.value.rows : [];
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
        } finally {
          W.value = !1;
        }
      }
    }
    function d() {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
      P("driver"), k.value = l.row.program || "", $.value = "";
    }
    async function B() {
      !J.value || o.value !== "driver" || !k.value.trim() || !$.value.trim() || await U(["agent", "driver", String(l.row.number), "--program", k.value.trim(), "--model", $.value.trim()], "Driver changed.");
    }
    async function E() {
      !J.value || o.value !== "retire" || !n.value.trim() || await U(["agent", "retire", String(l.row.number), "--reason", n.value.trim()], "Agent retired permanently.");
========
      P("driver"), y.value = o.row.program || "", x.value = "";
    }
    async function B() {
      !G.value || l.value !== "driver" || !y.value.trim() || !x.value.trim() || await J(["agent", "driver", String(o.row.number), "--program", y.value.trim(), "--model", x.value.trim()], "Driver changed.");
    }
    async function E() {
      !G.value || l.value !== "retire" || !n.value.trim() || await J(["agent", "retire", String(o.row.number), "--reason", n.value.trim()], "Agent retired permanently.");
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
    }
    return (L, T) => {
      var le;
      return a(), s("div", {
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: T[10] || (T[10] = te(() => {
        }, ["stop"])),
        onKeydown: T[11] || (T[11] = te(() => {
        }, ["stop"]))
      }, [
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
        b("div", Kt, [
          v(i(ee), {
            small: "",
            "data-agent-history": "",
            disabled: W.value || O.value,
            onClick: c
          }, {
            default: p(() => [...T[12] || (T[12] = [
              h("Session history", -1)
========
        w("div", Jt, [
          m(i(_), {
            small: "",
            "data-agent-history": "",
            disabled: W.value || O.value,
            onClick: p
          }, {
            default: h(() => [...T[12] || (T[12] = [
              b("Session history", -1)
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
            ])]),
            _: 1
          }, 8, ["disabled"]),
          e.held ? (a(), N(i(_), {
            key: 0,
            small: "",
            "data-agent-lift-hold": "",
            disabled: W.value,
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
            onClick: m
          }, {
            default: p(() => [...T[13] || (T[13] = [
              h("Lift this hold", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])) : f("", !0),
          J.value ? (a(), s(q, { key: 1 }, [
            (se = e.row.job_command) != null && se.length ? (a(), N(i(ee), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: W.value || O.value || !Q.value,
              onClick: _
            }, {
              default: p(() => [...T[14] || (T[14] = [
                h("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0),
            e.row.role !== "main" ? (a(), N(i(ee), {
========
            onClick: g
          }, {
            default: h(() => [...T[13] || (T[13] = [
              b("Lift this hold", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])) : k("", !0),
          G.value ? (a(), s(q, { key: 1 }, [
            (le = e.row.job_command) != null && le.length ? (a(), N(i(_), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: W.value || O.value || !X.value,
              onClick: Y
            }, {
              default: h(() => [...T[14] || (T[14] = [
                b("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0),
            e.row.role !== "main" ? (a(), N(i(_), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
              key: 1,
              small: "",
              "data-agent-driver": "",
              disabled: W.value || O.value,
              onClick: d
            }, {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
              default: p(() => [...T[15] || (T[15] = [
                h("Change driver", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0),
            e.row.role !== "main" ? (a(), N(i(ee), {
========
              default: h(() => [...T[15] || (T[15] = [
                b("Change driver", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0),
            e.row.role !== "main" ? (a(), N(i(_), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
              key: 2,
              small: "",
              "data-agent-retire": "",
              disabled: W.value || O.value,
              onClick: T[0] || (T[0] = (K) => P("retire"))
            }, {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
              default: p(() => [...T[16] || (T[16] = [
                h("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0)
          ], 64)) : f("", !0)
        ]),
        v(i(Ge), { value: o.value }, {
          job: p(() => [
            v(Ht, {
========
              default: h(() => [...T[16] || (T[16] = [
                b("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0)
          ], 64)) : k("", !0)
        ]),
        m(i(Ue), { value: l.value }, {
          job: h(() => [
            m(zt, {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
              task: C.value,
              "onUpdate:task": T[1] || (T[1] = (K) => C.value = K),
              text: r.value,
              "onUpdate:text": T[2] || (T[2] = (K) => r.value = K),
              row: e.row,
              tasks: j.value,
              pending: W.value,
              loading: O.value,
              "more-tasks": F.value,
              failure: A.value,
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
              "job-ready": le.value,
              onSubmit: y,
              onMore: w,
              onCancel: T[3] || (T[3] = (K) => P(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          driver: p(() => [
            v(jt, {
              program: k.value,
              "onUpdate:program": T[4] || (T[4] = (K) => k.value = K),
              model: $.value,
              "onUpdate:model": T[5] || (T[5] = (K) => $.value = K),
========
              "job-ready": ne.value,
              onSubmit: v,
              onMore: M,
              onCancel: T[3] || (T[3] = (K) => P(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          driver: h(() => [
            m(Tt, {
              program: y.value,
              "onUpdate:program": T[4] || (T[4] = (K) => y.value = K),
              model: x.value,
              "onUpdate:model": T[5] || (T[5] = (K) => x.value = K),
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
              pending: W.value,
              onSubmit: B,
              onCancel: T[6] || (T[6] = (K) => P(""))
            }, null, 8, ["program", "model", "pending"])
          ]),
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          history: p(() => [
            v(Jt, {
========
          history: h(() => [
            m(Gt, {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
              sessions: D.value,
              onClose: T[7] || (T[7] = (K) => P(""))
            }, null, 8, ["sessions"])
          ]),
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          retire: p(() => [
            v(Wt, {
========
          retire: h(() => [
            m(Nt, {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
              reason: n.value,
              "onUpdate:reason": T[8] || (T[8] = (K) => n.value = K),
              pending: W.value,
              onSubmit: E,
              onCancel: T[9] || (T[9] = (K) => P(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
        A.value ? (a(), s("p", Zt, u(A.value), 1)) : f("", !0),
        V.value ? (a(), s("p", _t, u(V.value), 1)) : f("", !0)
      ], 32);
    };
  }
}, Qt = /* @__PURE__ */ Z(Yt, [["__scopeId", "data-v-8712e475"]]), Xt = {
========
        A.value ? (a(), s("p", Kt, c(A.value), 1)) : k("", !0),
        V.value ? (a(), s("p", Zt, c(V.value), 1)) : k("", !0)
      ], 32);
    };
  }
}, Qt = /* @__PURE__ */ Z(Yt, [["__scopeId", "data-v-4e3619f8"]]), Xt = {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
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
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
        onClick: t[0] || (t[0] = te((o) => i(we)("test_queue:0"), ["stop"]))
      }, [
        h("Waiting: " + u(e.waitReason) + " ", 1),
        v(i(ze), {
========
        onClick: t[0] || (t[0] = te((l) => i(Se)("test_queue:0"), ["stop"]))
      }, [
        b("Waiting: " + c(e.waitReason) + " ", 1),
        m(i(Oe), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), s("span", _t, "Waiting")) : (a(), N(i(st), {
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
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
}, la = { "data-agent-retired-at": "" }, oa = { key: 0 }, sa = { "data-agent-retired-by": "" }, ia = {
  __name: "AgentLastingFacts",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    return (l, t) => e.row.retired_at ? (a(), s("dl", na, [
      b("div", null, [
        t[0] || (t[0] = b("dt", null, "Retired", -1)),
        b("dd", la, [
          v(i(Ee), {
========
}, na = { "data-agent-retired-at": "" }, oa = { key: 0 }, la = { "data-agent-retired-by": "" }, sa = {
  __name: "AgentLastingFacts",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    return (o, t) => e.row.retired_at ? (a(), s("dl", aa, [
      w("div", null, [
        t[0] || (t[0] = w("dt", null, "Retired", -1)),
        w("dd", na, [
          m(i(Pe), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
            at: e.row.retired_at
          }, null, 8, ["at"])
        ])
      ]),
      e.row.retiring_actor_name ? (a(), s("div", oa, [
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
        t[1] || (t[1] = b("dt", null, "Retired by", -1)),
        b("dd", sa, u(e.row.retiring_actor_name), 1)
      ])) : f("", !0)
    ])) : f("", !0);
========
        t[1] || (t[1] = w("dt", null, "Retired by", -1)),
        w("dd", la, c(e.row.retiring_actor_name), 1)
      ])) : k("", !0)
    ])) : k("", !0);
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
  }
}, ia = /* @__PURE__ */ Z(sa, [["__scopeId", "data-v-c5c81429"]]), ra = ["data-agent-delegated", "onClick"], da = { class: "agent-task-number" }, ua = { class: "agent-task-title" }, ca = ["title"], ga = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
  setup(e, { emit: l }) {
    const t = l;
    return (o, r) => (a(), N(i(Je), {
========
  setup(e, { emit: o }) {
    const t = o;
    return (l, r) => (a(), N(i(Ge), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: r[0] || (r[0] = (n) => t("toggle"))
    }, {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
      default: p(() => [
========
      default: h(() => [
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
        (a(!0), s(q, null, ae(e.section.tasks, (n) => (a(), s("button", {
          key: n.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": n.id,
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          onClick: (k) => i(we)(`tasks:${n.id}`)
        }, [
          v(i(it), {
            status: n.state
          }, null, 8, ["status"]),
          b("span", ua, u(n.id), 1),
          b("span", ca, u(n.title), 1),
========
          onClick: (y) => i(Se)(`tasks:${n.id}`)
        }, [
          m(i(it), {
            status: n.state
          }, null, 8, ["status"]),
          w("span", da, c(n.id), 1),
          w("span", ua, c(n.title), 1),
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          n.plan_id ? (a(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${n.plan_id}: ${n.plan_title}`
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          }, "Plan " + u(n.plan_id), 9, ga)) : f("", !0)
        ], 8, da))), 128))
========
          }, "Plan " + c(n.plan_id), 9, ca)) : k("", !0)
        ], 8, ra))), 128))
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
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
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
}, Ma = "It ended without a report", $a = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const l = e, t = ["started", "blocked", "open", "completed"], o = g(() => {
      var y, c;
      return l.row.ended_at && ((c = (y = l.facts) == null ? void 0 : y.job_returned) != null && c.startsWith(Ma)) ? l.facts.job_returned : "";
    }), r = g(() => l.tasks.length ? t.map((y) => ({ state: y, label: y.slice(0, 1).toUpperCase() + y.slice(1), tasks: l.tasks.filter((c) => c.state === y || y === "started" && c.state === "testing" || y === "completed" && c.state === "cancelled") })) : []), n = /* @__PURE__ */ new Set(["completed"]), k = z({}), $ = (y) => !(k.value[y] ?? n.has(y)), C = (y) => k.value = { ...k.value, [y]: $(y) }, L = Be(), { rows: I } = L.props.reports;
    L.state["reports.agent"] = String(l.row.number);
    const F = g(() => l.row.access === "read-only"), O = ["tasks", "transcript", "terminal", "file-feed", "processes", "reports", "memories"], W = g(() => [...L.tabs].sort((y, c) => (O.indexOf(y.key) < 0 ? O.length : O.indexOf(y.key)) - (O.indexOf(c.key) < 0 ? O.length : O.indexOf(c.key)))), A = g(() => !!l.row.retired_at || l.row.state === "retired"), V = () => F.value || A.value ? W.value.find((y) => y.key === "transcript") : W.value[0], D = z(V());
    ve(D, (y) => {
      L.state.tab = (y == null ? void 0 : y.key) ?? "";
    }, { immediate: !0 }), Ce(() => {
      L.state.tab = "";
    }), ve(W, (y) => {
      y.some((c) => {
        var d;
        return c.key === ((d = D.value) == null ? void 0 : d.key);
      }) || (D.value = y[0]);
    }), ve(() => l.open, (y) => {
      y && (D.value = V());
    });
    const Y = Object.fromEntries(L.tabs.filter((y) => y.component).map((y) => [y.key, Xe(() => rt(y.component))])), J = z(!1), { data: Q } = L.props.tool, le = g(() => {
      var y;
      return ((y = Q.value) == null ? void 0 : y.tool) ?? "";
    }), P = g(() => {
      var y;
      return ((y = Q.value) == null ? void 0 : y.note) ?? "";
    }), _ = g(() => l.row.role !== "main" && (!l.row.ended_at || l.stoppedWithWork || l.waitReason));
    async function w() {
      !l.open || !_.value || (L.state["tool.agent"] = String(l.row.number), await L.reload("tool"));
    }
    const m = dt(w, ut.agentCommand), U = L.follow(["hook_call.*", "process_part.*"], (y) => ct(y, "session_agent_id", /* @__PURE__ */ new Set([l.row.id])) && m());
    return Ce(() => U == null ? void 0 : U()), ve(() => l.open, (y) => {
      y && w();
    }, { immediate: !0 }), (y, c) => {
========
}, wa = "It ended without a report", Ma = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const o = e, t = ["started", "blocked", "open", "completed"], l = u(() => {
      var v, p;
      return o.row.ended_at && ((p = (v = o.facts) == null ? void 0 : v.job_returned) != null && p.startsWith(wa)) ? o.facts.job_returned : "";
    }), r = u(() => o.tasks.length ? t.map((v) => ({ state: v, label: v.slice(0, 1).toUpperCase() + v.slice(1), tasks: o.tasks.filter((p) => p.state === v || v === "started" && p.state === "testing" || v === "completed" && p.state === "cancelled") })) : []), n = /* @__PURE__ */ new Set(["completed"]), y = z({}), x = (v) => !(y.value[v] ?? n.has(v)), C = (v) => y.value = { ...y.value, [v]: x(v) }, j = Le(), { rows: R } = j.props.reports;
    j.state["reports.agent"] = String(o.row.number);
    const F = u(() => o.row.access === "read-only"), O = ["tasks", "transcript", "terminal", "file-feed", "processes", "reports", "memories"], W = u(() => [...j.tabs].sort((v, p) => (O.indexOf(v.key) < 0 ? O.length : O.indexOf(v.key)) - (O.indexOf(p.key) < 0 ? O.length : O.indexOf(p.key)))), A = u(() => !!o.row.retired_at || o.row.state === "retired"), V = () => F.value || A.value ? W.value.find((v) => v.key === "transcript") : W.value[0], D = z(V());
    ge(D, (v) => {
      j.state.tab = (v == null ? void 0 : v.key) ?? "";
    }, { immediate: !0 }), xe(() => {
      j.state.tab = "";
    }), ge(W, (v) => {
      v.some((p) => {
        var d;
        return p.key === ((d = D.value) == null ? void 0 : d.key);
      }) || (D.value = v[0]);
    }), ge(() => o.open, (v) => {
      v && (D.value = V());
    });
    const Q = Object.fromEntries(j.tabs.filter((v) => v.component).map((v) => [v.key, _e(() => rt(v.component))])), G = z(!1), { data: X } = j.props.tool, ne = u(() => {
      var v;
      return ((v = X.value) == null ? void 0 : v.tool) ?? "";
    }), P = u(() => {
      var v;
      return ((v = X.value) == null ? void 0 : v.note) ?? "";
    }), Y = u(() => o.row.role !== "main" && (!o.row.ended_at || o.stoppedWithWork || o.waitReason));
    async function M() {
      !o.open || !Y.value || (j.state["tool.agent"] = String(o.row.number), await j.reload("tool"));
    }
    const g = dt(M, ut.agentCommand), J = j.follow(["hook_call.*", "process_part.*"], (v) => ct(v, "session_agent_id", /* @__PURE__ */ new Set([o.row.id])) && g());
    return xe(() => J == null ? void 0 : J()), ge(() => o.open, (v) => {
      v && M();
    }, { immediate: !0 }), (v, p) => {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
      var d;
      return a(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
        onClick: c[2] || (c[2] = te(() => {
        }, ["stop"]))
      }, [
        v(ra, { row: e.row }, null, 8, ["row"]),
        e.row.retirement_reason ? (a(), s("p", ma, "Retirement reason: " + u(e.row.retirement_reason), 1)) : f("", !0),
        o.value ? (a(), s("p", ha, u(o.value), 1)) : f("", !0),
        v(i(gt), {
          class: "agent-tabs",
          tabs: W.value,
          active: D.value,
          answer: { tasks: e.tasks.length, reports: e.row.report_count ?? i(I).length, memories: e.row.memory_count ?? 0 },
          onChoose: c[0] || (c[0] = (B) => D.value = B)
        }, null, 8, ["tabs", "active", "answer"]),
        v(i(vt), {
========
        onClick: p[2] || (p[2] = te(() => {
        }, ["stop"]))
      }, [
        m(ia, { row: e.row }, null, 8, ["row"]),
        e.row.retirement_reason ? (a(), s("p", pa, "Retirement reason: " + c(e.row.retirement_reason), 1)) : k("", !0),
        l.value ? (a(), s("p", ma, c(l.value), 1)) : k("", !0),
        m(i(gt), {
          class: "agent-tabs",
          tabs: W.value,
          active: D.value,
          answer: { tasks: e.tasks.length, reports: e.row.report_count ?? i(R).length, memories: e.row.memory_count ?? 0 },
          onChoose: p[0] || (p[0] = (B) => D.value = B)
        }, null, 8, ["tabs", "active", "answer"]),
        m(i(vt), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          class: "agent-tab-body",
          tab: D.value,
          "data-agent-tab-body": (d = D.value) == null ? void 0 : d.key
        }, {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          default: p(() => {
            var B;
            return [
              v(i(Ge), {
                value: (B = D.value) == null ? void 0 : B.key
              }, et({
                reports: p(() => [
                  i(I).length ? f("", !0) : (a(), N(i(He), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: p(() => [...c[3] || (c[3] = [
                      h("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (a(!0), s(q, null, ae(i(I), (E) => (a(), s("button", {
========
          default: h(() => {
            var B;
            return [
              m(i(Ue), {
                value: (B = D.value) == null ? void 0 : B.key
              }, et({
                reports: h(() => [
                  i(R).length ? k("", !0) : (a(), N(i(Ve), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: h(() => [...p[3] || (p[3] = [
                      b("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (a(!0), s(q, null, ae(i(R), (E) => (a(), s("button", {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
                    key: E.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${E.id}`,
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
                    onClick: (R) => i(we)(`messages:${E.id}`)
                  }, u(E.text), 9, fa))), 128))
                ]),
                tasks: p(() => {
                  var E;
                  return [
                    e.tasks.length ? f("", !0) : (a(), N(i(He), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: p(() => [...c[4] || (c[4] = [
                        h("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (a(!0), s(q, null, ae(r.value, (R) => (a(), N(pa, {
                      key: R.state,
                      section: R,
                      open: $(R.state),
                      onToggle: (T) => C(R.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (E = e.facts) != null && E.instruction ? (a(), s(q, { key: 1 }, [
                      c[5] || (c[5] = b("p", { class: "agent-label" }, "Instruction", -1)),
                      b("div", ba, u(e.facts.instruction), 1)
                    ], 64)) : f("", !0)
                  ];
                }),
                transcript: p(() => {
                  var E;
                  return [
                    F.value ? (a(), s(q, { key: 0 }, [
                      (E = e.facts) != null && E.instruction ? (a(), s("div", ka, [
                        v(i(Je), {
========
                    onClick: (L) => i(Se)(`messages:${E.id}`)
                  }, c(E.text), 9, ha))), 128))
                ]),
                tasks: h(() => {
                  var E;
                  return [
                    e.tasks.length ? k("", !0) : (a(), N(i(Ve), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: h(() => [...p[4] || (p[4] = [
                        b("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (a(!0), s(q, null, ae(r.value, (L) => (a(), N(va, {
                      key: L.state,
                      section: L,
                      open: x(L.state),
                      onToggle: (T) => C(L.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (E = e.facts) != null && E.instruction ? (a(), s(q, { key: 1 }, [
                      p[5] || (p[5] = w("p", { class: "agent-label" }, "Instruction", -1)),
                      w("div", fa, c(e.facts.instruction), 1)
                    ], 64)) : k("", !0)
                  ];
                }),
                transcript: h(() => {
                  var E;
                  return [
                    F.value ? (a(), s(q, { key: 0 }, [
                      (E = e.facts) != null && E.instruction ? (a(), s("div", ba, [
                        m(i(Ge), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
                          label: "Instruction",
                          open: G.value,
                          "data-agent-section": "instruction",
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
                          onToggle: c[1] || (c[1] = (R) => J.value = !J.value)
                        }, {
                          default: p(() => [
                            b("div", ya, u(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (a(), s("p", wa, "No job recorded")) : f("", !0)
                    ], 64)) : f("", !0),
                    v(Ct, {
========
                          onToggle: p[1] || (p[1] = (L) => G.value = !G.value)
                        }, {
                          default: h(() => [
                            w("div", ka, c(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (a(), s("p", ya, "No job recorded")) : k("", !0)
                    ], 64)) : k("", !0),
                    m(St, {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
                ae(i(Y), (E, R) => ({
                  name: R,
                  fn: p(() => [
========
                ae(i(Q), (E, L) => ({
                  name: L,
                  fn: h(() => [
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
                    (a(), N(tt(E), {
                      agent: e.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ];
          }),
          _: 1
        }, 8, ["tab", "data-agent-tab-body"]),
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
        _.value ? (a(), N(aa, {
========
        Y.value ? (a(), N(ta, {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          command: le.value,
          note: P.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : f("", !0)
      ]);
    };
  }
}, xa = /* @__PURE__ */ Z($a, [["__scopeId", "data-v-fabbecdf"]]), Sa = { class: "line" }, Ca = {
========
          command: ne.value,
          note: P.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : k("", !0)
      ]);
    };
  }
}, xa = /* @__PURE__ */ Z(Ma, [["__scopeId", "data-v-fabbecdf"]]), $a = { class: "line" }, Sa = {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
  key: 0,
  class: "line",
  "data-agent-since": ""
}, Ca = {
  key: 1,
  class: "line",
  "data-agent-seen": ""
}, Aa = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" }, seen: { type: String, default: "" } },
  setup(e) {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
    const l = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, o = g(() => l.has(t.state)), r = g(() => [t.doing, t.since, t.seen].filter(Boolean).join(". "));
    return (n, k) => (a(), N(i(fe), {
========
    const o = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, l = u(() => o.has(t.state)), r = u(() => [t.doing, t.since, t.seen].filter(Boolean).join(". "));
    return (n, y) => (a(), N(i(we), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
      as: "button",
      place: "corner",
      class: de(["agent-dot", { pulse: o.value }]),
      "data-state": e.state,
      "aria-label": r.value,
      "data-agent-status": "",
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
      onClick: k[0] || (k[0] = te(() => {
      }, ["stop"]))
    }, {
      tip: p(() => [
        b("b", Sa, u(e.doing), 1),
        e.since ? (a(), s("span", Ca, u(e.since), 1)) : f("", !0),
        e.seen ? (a(), s("span", Ta, u(e.seen), 1)) : f("", !0)
      ]),
      default: p(() => [
        k[1] || (k[1] = b("i", null, null, -1))
========
      onClick: y[0] || (y[0] = te(() => {
      }, ["stop"]))
    }, {
      tip: h(() => [
        w("b", $a, c(e.doing), 1),
        e.since ? (a(), s("span", Sa, c(e.since), 1)) : k("", !0),
        e.seen ? (a(), s("span", Ca, c(e.seen), 1)) : k("", !0)
      ]),
      default: h(() => [
        y[1] || (y[1] = w("i", null, null, -1))
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
}, ja = /* @__PURE__ */ Z(Aa, [["__scopeId", "data-v-1a0bc478"]]), La = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, Ra = (e) => e.filter((l) => l.state !== "cancelled"), Fe = (e, l) => e.filter((t) => t.state === l).length, Ba = 5, Ia = (e, l) => e || l.split(/\s+/).slice(0, Ba).join(" ");
function Oa({ tasks: e, inHand: l, perHour: t }) {
  const o = Ra(e), r = Fe(o, "completed"), n = La[l == null ? void 0 : l.state], k = o.filter((I) => I.state === "started").map((I) => ({ number: I.id, title: I.title })), $ = Math.max(k.length, l && l.state !== "completed" ? 1 : 0), C = o.length - r - $, L = r === o.length;
  return {
    number: l.id,
    title: l.title,
    started: k,
    plan: l.plan_id ?? 0,
    planTitle: l.plan_title ?? "",
    count: `${r} of ${o.length}`,
    taskTip: `${r} of its ${o.length} tasks done${n ? `. This one is ${n.words}.` : "."}`,
    countTip: L ? `All ${o.length} tasks done` : `${r} done, ${$} in hand, ${C} to go`,
    paceTip: !L && t ? `About ${t} an hour.` : "",
    rate: !L && t ? `${Math.round(t)}/hour` : "",
    bar: { total: o.length, done: r, testing: Fe(o, "testing") }
========
}, Ta = /* @__PURE__ */ Z(Aa, [["__scopeId", "data-v-1a0bc478"]]), ja = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, La = (e) => e.filter((o) => o.state !== "cancelled"), De = (e, o) => e.filter((t) => t.state === o).length, Ba = 5, Ra = (e, o) => e || o.split(/\s+/).slice(0, Ba).join(" ");
function Ia({ tasks: e, inHand: o, perHour: t }) {
  const l = La(e), r = De(l, "completed"), n = ja[o == null ? void 0 : o.state], y = l.filter((R) => R.state === "started").map((R) => ({ number: R.id, title: R.title })), x = Math.max(y.length, o && o.state !== "completed" ? 1 : 0), C = l.length - r - x, j = r === l.length;
  return {
    number: o.id,
    title: o.title,
    started: y,
    plan: o.plan_id ?? 0,
    count: `${r} of ${l.length}`,
    taskTip: `${r} of its ${l.length} tasks done${n ? `. This one is ${n.words}.` : "."}`,
    countTip: j ? `All ${l.length} tasks done` : `${r} done, ${x} in hand, ${C} to go`,
    paceTip: !j && t ? `About ${t} an hour.` : "",
    rate: !j && t ? `${Math.round(t)}/hour` : "",
    bar: { total: l.length, done: r, testing: De(l, "testing") }
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
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
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
}, Ea = {
  key: 1,
========
}, Ha = {
  key: 0,
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
  class: "tasks",
  "data-agent-tasks": ""
}, Ea = {
  key: 2,
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
  class: "tasks",
  "data-agent-tasks": ""
}, Wa = {
  key: 4,
  class: "rate",
  "data-agent-rate": ""
}, Da = { key: 0 }, qa = 3, Fa = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, jobTitle: { type: String, default: "" }, jobLaunch: { type: String, default: "" }, perHour: { type: Number, default: 0 } },
  setup(e) {
    const l = e, t = g(() => l.inHand ? Oa({ tasks: l.tasks, inHand: l.inHand, perHour: l.perHour }) : null);
    return (o, r) => e.job && !t.value ? (a(), s("span", Va, [
      v(i(fe), {
========
  class: "plan",
  "data-agent-plan": ""
}, Na = {
  key: 3,
  class: "rate",
  "data-agent-rate": ""
}, Wa = { key: 0 }, Da = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, jobTitle: { type: String, default: "" }, jobLaunch: { type: String, default: "" }, perHour: { type: Number, default: 0 } },
  setup(e) {
    const o = e, t = u(() => o.inHand ? Ia({ tasks: o.tasks, inHand: o.inHand, perHour: o.perHour }) : null);
    return (l, r) => e.job && !t.value ? (a(), s("span", Oa, [
      m(i(we), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
        tip: p(() => [
          b("b", null, u(e.job), 1)
        ]),
        default: p(() => [
          h(u(i(Ia)(e.jobTitle, e.job)), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (a(), s("span", za, u(e.jobLaunch), 1)) : f("", !0)
    ])) : t.value ? (a(), s(q, { key: 1 }, [
      b("span", Ha, [
        t.value.plan ? (a(), N(i(fe), {
          key: 0,
          as: "button",
          class: "task",
          "data-agent-plan": "",
          "data-peek": `plans:${t.value.plan}`,
          "aria-label": `Plan ${t.value.plan}: ${t.value.planTitle}`,
          onClick: r[0] || (r[0] = te((n) => i(we)(`plans:${t.value.plan}`), ["stop"]))
        }, {
          tip: p(() => [
            b("b", null, u(t.value.planTitle), 1),
            b("span", null, "Task " + u(t.value.number) + ": " + u(t.value.title), 1)
          ]),
          default: p(() => [
            h("Plan " + u(t.value.plan), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])) : t.value.started.length > qa ? (a(), s("span", Ea, [
          v(i(fe), {
            as: "button",
            class: "task",
            "data-agent-task-count": "",
            "aria-label": `Tasks: ${t.value.started.length}`
          }, {
            tip: p(() => [
              (a(!0), s(q, null, ae(t.value.started, (n) => (a(), s("b", {
                key: n.number,
                class: "listed",
                "data-agent-task-listed": ""
              }, u(n.number) + " " + u(n.title), 1))), 128))
            ]),
            default: p(() => [
              h("Tasks: " + u(t.value.started.length), 1)
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : t.value.started.length > 1 ? (a(), s("span", Na, [
          r[2] || (r[2] = h("Tasks ", -1)),
          (a(!0), s(q, null, ae(t.value.started, (n, k) => (a(), s(q, {
            key: n.number
          }, [
            k ? (a(), s(q, { key: 0 }, [
              h(", ")
            ], 64)) : f("", !0),
            v(i(fe), {
========
        tip: h(() => [
          w("b", null, c(e.job), 1)
        ]),
        default: h(() => [
          b(c(i(Ra)(e.jobTitle, e.job)), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (a(), s("span", Va, c(e.jobLaunch), 1)) : k("", !0)
    ])) : t.value ? (a(), s(q, { key: 1 }, [
      w("span", za, [
        t.value.started.length > 1 ? (a(), s("span", Ha, [
          r[1] || (r[1] = b("Tasks ", -1)),
          (a(!0), s(q, null, ae(t.value.started, (n, y) => (a(), s(q, {
            key: n.number
          }, [
            y ? (a(), s(q, { key: 0 }, [
              b(", ")
            ], 64)) : k("", !0),
            m(i(we), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
              as: "button",
              class: "task",
              "data-agent-task": "",
              "data-peek": `tasks:${n.number}`,
              "aria-label": `Task ${n.number}: ${n.title}`,
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
              onClick: te(($) => i(we)(`tasks:${n.number}`), ["stop"])
            }, {
              tip: p(() => [
                b("b", null, u(n.title), 1)
              ]),
              default: p(() => [
                h(u(n.number), 1)
========
              onClick: te((x) => i(Se)(`tasks:${n.number}`), ["stop"])
            }, {
              tip: h(() => [
                w("b", null, c(n.title), 1)
              ]),
              default: h(() => [
                b(c(n.number), 1)
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
              ]),
              _: 2
            }, 1032, ["data-peek", "aria-label", "onClick"])
          ], 64))), 128))
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
        ])) : (a(), N(i(fe), {
          key: 3,
========
        ])) : (a(), N(i(we), {
          key: 1,
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${t.value.number}`,
          "aria-label": `Task ${t.value.number}: ${t.value.title}`,
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          onClick: r[1] || (r[1] = te((n) => i(we)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: p(() => [
            b("b", null, u(t.value.title), 1),
            b("span", null, u(t.value.taskTip), 1)
          ]),
          default: p(() => [
            h("Task " + u(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])),
        t.value.rate ? (a(), s("span", Wa, u(t.value.rate), 1)) : f("", !0),
        v(i(fe), {
========
          onClick: r[0] || (r[0] = te((n) => i(Se)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: h(() => [
            w("b", null, c(t.value.title), 1),
            w("span", null, c(t.value.taskTip), 1)
          ]),
          default: h(() => [
            b("Task " + c(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])),
        t.value.plan ? (a(), s("span", Ea, "Plan " + c(t.value.plan), 1)) : k("", !0),
        t.value.rate ? (a(), s("span", Na, c(t.value.rate), 1)) : k("", !0),
        m(i(we), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          tip: p(() => [
            b("b", null, u(t.value.countTip), 1),
            t.value.paceTip ? (a(), s("span", Da, u(t.value.paceTip), 1)) : f("", !0)
          ]),
          default: p(() => [
            h(u(t.value.count), 1)
========
          tip: h(() => [
            w("b", null, c(t.value.countTip), 1),
            t.value.paceTip ? (a(), s("span", Wa, c(t.value.paceTip), 1)) : k("", !0)
          ]),
          default: h(() => [
            b(c(t.value.count), 1)
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          ]),
          _: 1
        })
      ]),
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
      v(i(pt), {
========
      m(i(pt), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: t.value.bar.total,
        done: t.value.bar.done,
        testing: t.value.bar.testing
      }, null, 8, ["total", "done", "testing"])
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
    ], 64)) : f("", !0);
  }
}, Pa = /* @__PURE__ */ Z(Fa, [["__scopeId", "data-v-8cd05494"]]), Ua = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Ga = ["data-icon", "stroke-width", "innerHTML"], ne = {
========
    ], 64)) : k("", !0);
  }
}, qa = /* @__PURE__ */ Z(Da, [["__scopeId", "data-v-e51f5781"]]), Fa = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Pa = ["data-icon", "stroke-width", "innerHTML"], ee = {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
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
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
      agent: Ua,
========
      agent: Fa,
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
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
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
    return (n, k) => (a(), s("svg", {
========
    return (n, y) => (a(), s("svg", {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
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
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
      innerHTML: r[o[e.name] || e.name] || r.dot
    }, null, 12, Ga));
  }
}, Ja = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Ka = {
  key: 1,
  class: "menu-item-text"
}, Za = {
========
      innerHTML: r[l[e.name] || e.name] || r.dot
    }, null, 12, Pa));
  }
}, Ua = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Ga = {
  key: 1,
  class: "menu-item-text"
}, Ja = {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (l, t) => (a(), s("button", {
      type: "button",
      class: de(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
      e.checked !== null ? (a(), s("span", Ja, u(e.checked ? "✓" : ""), 1)) : f("", !0),
      e.description ? (a(), s("span", Ka, [
        b("span", null, [
          Te(l.$slots, "default", {}, void 0, !0)
        ]),
        b("small", null, u(e.description), 1)
      ])) : Te(l.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ye = /* @__PURE__ */ Z(Za, [["__scopeId", "data-v-fec99974"]]), _a = {}, Ya = { class: "menu-label" };
function Qa(e, l) {
  return a(), s("span", Ya, [
    Te(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Se = /* @__PURE__ */ Z(_a, [["render", Qa], ["__scopeId", "data-v-aa955b3e"]]), Xa = {
========
      e.checked !== null ? (a(), s("span", Ua, c(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (a(), s("span", Ga, [
        w("span", null, [
          $e(o.$slots, "default", {}, void 0, !0)
        ]),
        w("small", null, c(e.description), 1)
      ])) : $e(o.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ke = /* @__PURE__ */ Z(Ja, [["__scopeId", "data-v-fec99974"]]), Ka = {}, Za = { class: "menu-label" };
function Ya(e, o) {
  return a(), s("span", Za, [
    $e(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Me = /* @__PURE__ */ Z(Ka, [["render", Ya], ["__scopeId", "data-v-aa955b3e"]]), Qa = {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, en = {
  key: 0,
  class: "skills-none"
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
}, tn = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: l }) {
    const t = e, o = l, r = g(() => t.skills.filter((k) => k.state === "loaded")), n = g(() => t.skills.filter((k) => k.state !== "loaded"));
    return (k, $) => (a(), s("div", Xa, [
      v(Se, null, {
        default: p(() => [...$[1] || ($[1] = [
          h("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      r.value.length ? f("", !0) : (a(), s("p", en, "None yet. Compacting the conversation empties this list.")),
========
}, _a = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: o }) {
    const t = e, l = o, r = u(() => t.skills.filter((y) => y.state === "loaded")), n = u(() => t.skills.filter((y) => y.state !== "loaded"));
    return (y, x) => (a(), s("div", Qa, [
      m(Me, null, {
        default: h(() => [...x[1] || (x[1] = [
          b("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      r.value.length ? k("", !0) : (a(), s("p", Xa, "None yet. Compacting the conversation empties this list.")),
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
      (a(!0), s(q, null, ae(r.value, (C) => (a(), s("p", {
        key: C.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
        v(ne, {
          name: "book",
          size: 12
        }),
        h(u(C.skill), 1)
      ]))), 128)),
      n.value.length ? (a(), s(q, { key: 1 }, [
        v(Se, null, {
          default: p(() => [...$[2] || ($[2] = [
            h("Still to read", -1)
========
        m(ee, {
          name: "book",
          size: 12
        }),
        b(c(C.skill), 1)
      ]))), 128)),
      n.value.length ? (a(), s(q, { key: 1 }, [
        m(Me, null, {
          default: h(() => [...x[2] || (x[2] = [
            b("Still to read", -1)
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          ])]),
          _: 1
        }),
        (a(!0), s(q, null, ae(n.value, (C) => (a(), s("p", {
          key: C.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          v(ne, {
            name: "book",
            size: 12
          }),
          h(u(C.skill), 1)
        ]))), 128))
      ], 64)) : f("", !0),
      v(ye, {
========
          m(ee, {
            name: "book",
            size: 12
          }),
          b(c(C.skill), 1)
        ]))), 128))
      ], 64)) : k("", !0),
      m(ke, {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
        "data-agent-skills-browse": "",
        onClick: $[0] || ($[0] = (C) => o("browse"))
      }, {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
        default: p(() => [...$[3] || ($[3] = [
          h("Browse every skill", -1)
========
        default: h(() => [...x[3] || (x[3] = [
          b("Browse every skill", -1)
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
        ])]),
        _: 1
      })
    ]));
  }
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
}, an = /* @__PURE__ */ Z(tn, [["__scopeId", "data-v-be514d47"]]), nn = ["disabled", "title"], ln = { class: "gauge usage" }, on = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: l }) {
    const t = e, o = l, r = g(() => t.windows[0] ?? null), n = g(() => r.value && Number.isFinite(r.value.used_percent) ? Math.max(0, Math.min(100, Math.round(r.value.used_percent))) : null), k = g(() => n.value !== null && n.value >= 100), $ = g(() => {
      var L;
      return (L = r.value) != null && L.reset_epoch_seconds ? new Date(r.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), C = g(() => k.value ? `At usage limit: the plan's ${r.value.title} allowance is used up${$.value ? `, starts again ${$.value}` : ""}` : `${n.value}% of the plan's ${r.value.title} allowance used${$.value ? `, starts again ${$.value}` : ""}`);
    return (L, I) => n.value !== null ? (a(), s("button", {
========
}, en = /* @__PURE__ */ Z(_a, [["__scopeId", "data-v-be514d47"]]), tn = ["disabled", "title"], an = { class: "gauge usage" }, nn = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: o }) {
    const t = e, l = o, r = u(() => t.windows[0] ?? null), n = u(() => r.value && Number.isFinite(r.value.used_percent) ? Math.max(0, Math.min(100, Math.round(r.value.used_percent))) : null), y = u(() => n.value !== null && n.value >= 100), x = u(() => {
      var j;
      return (j = r.value) != null && j.reset_epoch_seconds ? new Date(r.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), C = u(() => y.value ? `At usage limit: the plan's ${r.value.title} allowance is used up${x.value ? `, starts again ${x.value}` : ""}` : `${n.value}% of the plan's ${r.value.title} allowance used${x.value ? `, starts again ${x.value}` : ""}`);
    return (j, R) => n.value !== null ? (a(), s("button", {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: C.value,
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
      onClick: I[0] || (I[0] = (F) => o("open", F.currentTarget))
    }, [
      v(ne, {
        name: "allowance",
        size: 12
      }),
      I[1] || (I[1] = h()),
      b("span", ln, [
        b("span", {
          style: Re({ width: `${n.value}%` })
        }, null, 4)
      ]),
      h(" " + u(k.value ? "At usage limit" : `${n.value}%`), 1)
    ], 8, nn)) : f("", !0);
  }
}, sn = /* @__PURE__ */ Z(on, [["__scopeId", "data-v-a36f09dc"]]), rn = {
========
      onClick: R[0] || (R[0] = (F) => l("open", F.currentTarget))
    }, [
      m(ee, {
        name: "allowance",
        size: 12
      }),
      R[1] || (R[1] = b()),
      w("span", an, [
        w("span", {
          style: je({ width: `${n.value}%` })
        }, null, 4)
      ]),
      b(" " + c(y.value ? "At usage limit" : `${n.value}%`), 1)
    ], 8, tn)) : k("", !0);
  }
}, on = /* @__PURE__ */ Z(nn, [["__scopeId", "data-v-a36f09dc"]]), ln = {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (l, t) => (a(), s("span", {
      class: de(["badge", e.tone])
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
    }, u(e.text), 3));
  }
}, dn = /* @__PURE__ */ Z(rn, [["__scopeId", "data-v-9e7e1157"]]), un = (e, l, t) => Math.max(l, Math.min(t, e)), Ze = /* @__PURE__ */ new WeakMap(), cn = (e, l) => Ze.set(e, l);
function gn(e, l) {
  for (let t = l; t; t = Ze.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function vn(e, l) {
  const t = (o) => {
    var n, k;
    const r = ((n = e.value) == null ? void 0 : n.element) || ((k = e.value) == null ? void 0 : k.$el) || e.value;
    r && !gn(r, o.target) && l(o);
  };
  window.addEventListener("click", t), Ce(() => window.removeEventListener("click", t));
}
const ke = 8, pn = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
========
    }, c(e.text), 3));
  }
}, sn = /* @__PURE__ */ Z(ln, [["__scopeId", "data-v-9e7e1157"]]), rn = (e, o, t) => Math.max(o, Math.min(t, e)), Ke = /* @__PURE__ */ new WeakMap(), dn = (e, o) => Ke.set(e, o);
function un(e, o) {
  for (let t = o; t; t = Ke.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function cn(e, o) {
  const t = (l) => {
    var n, y;
    const r = ((n = e.value) == null ? void 0 : n.element) || ((y = e.value) == null ? void 0 : y.$el) || e.value;
    r && !un(r, l.target) && o(l);
  };
  window.addEventListener("click", t), xe(() => window.removeEventListener("click", t));
}
const be = 8, gn = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
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
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
  setup(e, { expose: l, emit: t }) {
    const o = e, r = z(null), n = (d) => d ? `${d}px` : void 0, k = g(() => ({
      minWidth: n(o.minWidth),
      maxWidth: n(o.maxWidth),
      maxHeight: n(o.maxHeight),
      height: n(o.height)
    })), $ = z({ w: 0, h: 0 }), C = z(o.anchor ? o.anchor.getBoundingClientRect() : null), L = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), I = (d) => ({
========
  setup(e, { expose: o, emit: t }) {
    const l = e, r = z(null), n = (d) => d ? `${d}px` : void 0, y = u(() => ({
      minWidth: n(l.minWidth),
      maxWidth: n(l.maxWidth),
      maxHeight: n(l.maxHeight),
      height: n(l.height)
    })), x = z({ w: 0, h: 0 }), C = z(l.anchor ? l.anchor.getBoundingClientRect() : null), j = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), R = (d) => ({
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
      left: Math.max(0, d.left),
      top: Math.max(0, d.top),
      right: Math.min(window.innerWidth, d.right),
      bottom: Math.min(window.innerHeight, d.bottom)
    }), F = (d) => {
      const B = d.closest(".pane, .float-window");
      return B ? R(B.getBoundingClientRect()) : j();
    }, O = (d, B) => `${Math.max(0, d ? Math.min(d, B) : B)}px`;
    function W(d, B) {
      return {
        below: d.bottom - B.bottom - o.gap - ke,
        above: B.top - d.top - o.gap - ke,
        across: d.right - d.left - 2 * ke
      };
    }
    function A(d) {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
      const B = F(o.anchor), E = W(B, d);
      return $.value.w <= E.across && $.value.h <= Math.max(E.below, E.above) ? B : L();
    }
    const V = g(() => {
      if (!C.value) return k.value;
      const d = C.value, B = A(d), E = W(B, d), { w: R, h: T } = $.value, se = o.align === "auto" ? d.left + d.right > B.left + B.right : o.align === "right", K = un(se ? d.right - R : d.left, B.left + ke, Math.max(B.left + ke, B.right - R - ke)), X = T > E.below && E.above > E.below ? { bottom: `${window.innerHeight - d.top + o.gap}px`, maxHeight: O(o.maxHeight, E.above) } : { top: `${d.bottom + o.gap}px`, maxHeight: O(o.maxHeight, E.below) };
      return { ...k.value, ...X, left: `${K}px`, maxWidth: O(o.maxWidth, E.across) };
    }), D = t, Y = () => [...r.value.querySelectorAll("button:not(:disabled)")];
    function J(d) {
      const B = Y(), E = B.indexOf(document.activeElement);
      B[(E + d + B.length) % B.length].focus();
    }
    const Q = { ArrowDown: () => J(1), ArrowUp: () => J(-1), Escape: () => D("close") }, le = (d) => Q[d.key] && (d.preventDefault(), Q[d.key]()), P = () => r.value && ($.value = { w: r.value.offsetWidth, h: r.value.scrollHeight });
    let _ = 0;
    const w = new ResizeObserver(() => {
      cancelAnimationFrame(_), _ = requestAnimationFrame(P);
    });
    vn(r, (d) => o.anchor && !o.anchor.contains(d.target) && D("close"));
    const m = (d, B) => ["top", "left", "right", "bottom"].some((E) => Math.abs(d[E] - B[E]) > 1), U = (d) => d.bottom < 0 || d.top > window.innerHeight;
    let y = 0;
    function c() {
      if (o.anchor) {
        const d = o.anchor.getBoundingClientRect();
        if (!o.anchor.isConnected || U(d)) return D("close");
        m(d, C.value) && (C.value = d);
      }
      y = requestAnimationFrame(c);
    }
    return at(() => {
      o.anchor && r.value && cn(r.value, o.anchor), P(), r.value && w.observe(r.value), !o.plain && Y()[0] && Y()[0].focus(), c();
    }), Ce(() => {
      w.disconnect(), cancelAnimationFrame(y), cancelAnimationFrame(_);
    }), l({ element: r }), (d, B) => (a(), N(nt, {
      to: "body",
      disabled: !e.anchor
    }, [
      b("div", lt({
========
      const B = F(l.anchor), E = W(B, d);
      return x.value.w <= E.across && x.value.h <= Math.max(E.below, E.above) ? B : j();
    }
    const V = u(() => {
      if (!C.value) return y.value;
      const d = C.value, B = A(d), E = W(B, d), { w: L, h: T } = x.value, le = l.align === "auto" ? d.left + d.right > B.left + B.right : l.align === "right", K = rn(le ? d.right - L : d.left, B.left + be, Math.max(B.left + be, B.right - L - be)), f = T > E.below && E.above > E.below ? { bottom: `${window.innerHeight - d.top + l.gap}px`, maxHeight: O(l.maxHeight, E.above) } : { top: `${d.bottom + l.gap}px`, maxHeight: O(l.maxHeight, E.below) };
      return { ...y.value, ...f, left: `${K}px`, maxWidth: O(l.maxWidth, E.across) };
    }), D = t, Q = () => [...r.value.querySelectorAll("button:not(:disabled)")];
    function G(d) {
      const B = Q(), E = B.indexOf(document.activeElement);
      B[(E + d + B.length) % B.length].focus();
    }
    const X = { ArrowDown: () => G(1), ArrowUp: () => G(-1), Escape: () => D("close") }, ne = (d) => X[d.key] && (d.preventDefault(), X[d.key]()), P = () => r.value && (x.value = { w: r.value.offsetWidth, h: r.value.scrollHeight });
    let Y = 0;
    const M = new ResizeObserver(() => {
      cancelAnimationFrame(Y), Y = requestAnimationFrame(P);
    });
    cn(r, (d) => l.anchor && !l.anchor.contains(d.target) && D("close"));
    const g = (d, B) => ["top", "left", "right", "bottom"].some((E) => Math.abs(d[E] - B[E]) > 1), J = (d) => d.bottom < 0 || d.top > window.innerHeight;
    let v = 0;
    function p() {
      if (l.anchor) {
        const d = l.anchor.getBoundingClientRect();
        if (!l.anchor.isConnected || J(d)) return D("close");
        g(d, C.value) && (C.value = d);
      }
      v = requestAnimationFrame(p);
    }
    return at(() => {
      l.anchor && r.value && dn(r.value, l.anchor), P(), r.value && M.observe(r.value), !l.plain && Q()[0] && Q()[0].focus(), p();
    }), xe(() => {
      M.disconnect(), cancelAnimationFrame(v), cancelAnimationFrame(Y);
    }), o({ element: r }), (d, B) => (a(), N(nt, {
      to: "body",
      disabled: !e.anchor
    }, [
      w("div", ot({
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
        ref_key: "panel",
        ref: r
      }, d.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: V.value,
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
        onKeydown: le
      }), [
        Te(d.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), mn = /* @__PURE__ */ Z(pn, [["__scopeId", "data-v-3d203970"]]);
async function hn(e, l, t) {
  if (!e) return t(l);
  const { target: o, fields: r } = e, n = Object.fromEntries(Object.keys(r).map((C) => [C, o[C]])), k = () => Object.assign(o, n);
  Object.assign(o, r);
  let $ = !1;
========
        onKeydown: ne
      }), [
        $e(d.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), vn = /* @__PURE__ */ Z(gn, [["__scopeId", "data-v-3d203970"]]);
async function pn(e, o, t) {
  if (!e) return t(o);
  const { target: l, fields: r } = e, n = Object.fromEntries(Object.keys(r).map((C) => [C, l[C]])), y = () => Object.assign(l, n);
  Object.assign(l, r);
  let x = !1;
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
  try {
    const C = await t(l);
    return $ = C.ok, C;
  } finally {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
    $ || k();
  }
}
function fn(e, l, t, { groups: o, programs: r }) {
  const n = z({}), k = z(""), $ = z(!1), C = g(() => !!e.value && !e.value.ended_at), L = g(() => C.value && !!e.value.paused_at);
  async function I(A, V = null) {
    k.value = "";
    const D = await hn(V, A, l);
    return k.value = D.ok ? "" : D.error, t(), D;
  }
  return { groups: o, programs: r, chosen: n, failure: k, asking: $, running: C, paused: L, choose: (A, V) => I(["agent", "control", String(e.value.number), A, V.value], { target: n, fields: { value: { ...n.value, [A]: V.label } } }), stop: () => ($.value = !1, I(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (A) => I(["agent", "launch", A.name]) };
}
function bn(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const kn = { compact: "Compaction", clear: "Clear" };
function yn(e) {
  return e != null && e.is_open ? `${kn[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
const wn = ["disabled", "title"], Mn = ["disabled", "title"], $n = { class: "gauge" }, xn = {
========
    x || y();
  }
}
function mn(e, o, t, { groups: l, programs: r }) {
  const n = z({}), y = z(""), x = z(!1), C = u(() => !!e.value && !e.value.ended_at), j = u(() => C.value && !!e.value.paused_at);
  async function R(A, V = null) {
    y.value = "";
    const D = await pn(V, A, o);
    return y.value = D.ok ? "" : D.error, t(), D;
  }
  return { groups: l, programs: r, chosen: n, failure: y, asking: x, running: C, paused: j, choose: (A, V) => R(["agent", "control", String(e.value.number), A, V.value], { target: n, fields: { value: { ...n.value, [A]: V.label } } }), stop: () => (x.value = !1, R(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (A) => R(["agent", "launch", A.name]) };
}
function hn(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const fn = { compact: "Compaction", clear: "Clear" };
function bn(e) {
  return e != null && e.is_open ? `${fn[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
const kn = ["disabled", "title"], yn = ["disabled", "title"], wn = { class: "gauge" }, Mn = {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
  key: 1,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
}, Sn = ["disabled", "title"], Cn = ["disabled"], Tn = ["disabled"], An = {
========
}, xn = ["disabled", "title"], $n = ["disabled"], Sn = ["disabled"], Cn = {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
  key: 5,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
}, jn = ["title"], Ln = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Rn = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Bn = { class: "gauge" }, In = { class: "context-used" }, On = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, Vn = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, zn = 75, Hn = {
========
}, An = ["title"], Tn = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, jn = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Ln = { class: "gauge" }, Bn = { class: "context-used" }, Rn = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, In = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, On = 75, Vn = {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
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
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
  setup(e, { emit: l }) {
    const t = e, o = l, r = fn(Ie(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => o("changed"), { groups: Ie(t, "controlGroups"), programs: Ie(t, "agentPrograms") }), n = z(null), k = z(""), $ = g(() => r.groups.value.find((w) => w.key === k.value));
    function C(w, m) {
      n.value = w.currentTarget, k.value = m;
    }
    function L() {
      n.value = null, k.value = "", r.asking.value = !1;
    }
    const I = g(() => t.skills.filter((w) => w.state === "loaded"));
    function F(w) {
      C(w, "skills"), o("skills");
    }
    const O = (w) => r.groups.value.some((m) => m.key === w), W = g(() => {
      var w;
      return r.chosen.value.model ?? ((w = V.value) == null ? void 0 : w.model) ?? "";
    }), A = g(() => {
      var w;
      return r.chosen.value.effort ?? ((w = V.value) == null ? void 0 : w.effort) ?? "";
    });
    g(() => !!t.agent && !t.agent.ended_at);
    const V = g(() => {
      var w;
      return ((w = t.usage.agents) == null ? void 0 : w.find((m) => {
        var U;
        return m.id === ((U = t.agent) == null ? void 0 : U.id);
      })) ?? null;
    }), D = g(() => {
      var w;
      return ((w = V.value) == null ? void 0 : w.context_percent) == null ? null : Math.round(V.value.context_percent);
    }), Y = g(() => {
      var w;
      return yn(((w = V.value) == null ? void 0 : w.context_change) ?? null);
    }), J = (w) => `${Math.round(w / 1e3)}k`, Q = g(() => {
      var w;
      return !!((w = V.value) != null && w.context_limit_tokens);
    }), le = g(() => {
      var w, m;
      return ((w = V.value) == null ? void 0 : w.context_limit_tokens) || ((m = V.value) == null ? void 0 : m.context_window_tokens) || 0;
    }), P = g(() => le.value ? `${J(V.value.context_tokens ?? 0)} of ${J(le.value)}` : ""), _ = g(() => {
      var w;
      return (w = V.value) != null && w.cost_dollars ? `$${V.value.cost_dollars.toFixed(2)}` : "";
    });
    return (w, m) => {
      var U, y;
========
  setup(e, { emit: o }) {
    const t = e, l = o, r = mn(Be(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => l("changed"), { groups: Be(t, "controlGroups"), programs: Be(t, "agentPrograms") }), n = z(null), y = z(""), x = u(() => r.groups.value.find((M) => M.key === y.value));
    function C(M, g) {
      n.value = M.currentTarget, y.value = g;
    }
    function j() {
      n.value = null, y.value = "", r.asking.value = !1;
    }
    const R = u(() => t.skills.filter((M) => M.state === "loaded"));
    function F(M) {
      C(M, "skills"), l("skills");
    }
    const O = (M) => r.groups.value.some((g) => g.key === M), W = u(() => {
      var M;
      return r.chosen.value.model ?? ((M = V.value) == null ? void 0 : M.model) ?? "";
    }), A = u(() => {
      var M;
      return r.chosen.value.effort ?? ((M = V.value) == null ? void 0 : M.effort) ?? "";
    });
    u(() => !!t.agent && !t.agent.ended_at);
    const V = u(() => {
      var M;
      return ((M = t.usage.agents) == null ? void 0 : M.find((g) => {
        var J;
        return g.id === ((J = t.agent) == null ? void 0 : J.id);
      })) ?? null;
    }), D = u(() => {
      var M;
      return ((M = V.value) == null ? void 0 : M.context_percent) == null ? null : Math.round(V.value.context_percent);
    }), Q = u(() => {
      var M;
      return bn(((M = V.value) == null ? void 0 : M.context_change) ?? null);
    }), G = (M) => `${Math.round(M / 1e3)}k`, X = u(() => {
      var M;
      return !!((M = V.value) != null && M.context_limit_tokens);
    }), ne = u(() => {
      var M, g;
      return ((M = V.value) == null ? void 0 : M.context_limit_tokens) || ((g = V.value) == null ? void 0 : g.context_window_tokens) || 0;
    }), P = u(() => ne.value ? `${G(V.value.context_tokens ?? 0)} of ${G(ne.value)}` : ""), Y = u(() => {
      var M;
      return (M = V.value) != null && M.cost_dollars ? `$${V.value.cost_dollars.toFixed(2)}` : "";
    });
    return (M, g) => {
      var J, v;
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
      return a(), s("div", {
        class: de(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (a(), s(q, { key: 0 }, [
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          b("button", {
========
          w("button", {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
            onClick: m[0] || (m[0] = (c) => C(c, "agent"))
          }, [
            v(ne, {
              name: "agents",
              size: 12
            }),
            h(" " + u(((U = e.agentPrograms.find((c) => c.name === e.agent.program)) == null ? void 0 : U.title) || e.agent.program), 1)
          ], 8, wn),
          v(sn, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: m[1] || (m[1] = (c) => o("open", "usage", c))
========
            onClick: g[0] || (g[0] = (p) => C(p, "agent"))
          }, [
            m(ee, {
              name: "agents",
              size: 12
            }),
            b(" " + c(((J = e.agentPrograms.find((p) => p.name === e.agent.program)) == null ? void 0 : J.title) || e.agent.program), 1)
          ], 8, kn),
          m(on, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: g[1] || (g[1] = (p) => l("open", "usage", p))
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          }, null, 8, ["windows", "disabled"]),
          D.value !== null ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${D.value}% full: clear or compact it`,
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
            onClick: m[2] || (m[2] = (c) => O("context") ? C(c, "context") : o("open", "context", c.currentTarget))
          }, [
            v(ne, {
              name: "gauge",
              size: 12
            }),
            m[14] || (m[14] = h()),
            b("span", $n, [
              b("span", {
                style: Re({ width: `${D.value}%` })
              }, null, 4)
            ]),
            h(" " + u(D.value) + "% ", 1)
          ], 8, Mn)) : (y = V.value) != null && y.context_unknown ? (a(), s("span", xn, [
            v(ne, {
              name: "gauge",
              size: 12
            }),
            m[15] || (m[15] = h(" Context: unknown", -1))
          ])) : f("", !0),
========
            onClick: g[2] || (g[2] = (p) => O("context") ? C(p, "context") : l("open", "context", p.currentTarget))
          }, [
            m(ee, {
              name: "gauge",
              size: 12
            }),
            g[14] || (g[14] = b()),
            w("span", wn, [
              w("span", {
                style: je({ width: `${D.value}%` })
              }, null, 4)
            ]),
            b(" " + c(D.value) + "% ", 1)
          ], 8, yn)) : (v = V.value) != null && v.context_unknown ? (a(), s("span", Mn, [
            m(ee, {
              name: "gauge",
              size: 12
            }),
            g[15] || (g[15] = b(" Context: unknown", -1))
          ])) : k("", !0),
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          W.value ? (a(), s("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${W.value}: change the model`,
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
            onClick: m[3] || (m[3] = (c) => O("model") ? C(c, "model") : null)
          }, [
            v(ne, {
              name: "model",
              size: 12
            }),
            h(" " + u(W.value), 1)
          ], 8, Sn)) : f("", !0),
========
            onClick: g[3] || (g[3] = (p) => O("model") ? C(p, "model") : null)
          }, [
            m(ee, {
              name: "model",
              size: 12
            }),
            b(" " + c(W.value), 1)
          ], 8, xn)) : k("", !0),
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          O("effort") || e.card && A.value ? (a(), s("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
            onClick: m[4] || (m[4] = (c) => C(c, "effort"))
          }, [
            v(ne, {
              name: "bolt",
              size: 12
            }),
            h(" " + u(A.value), 1)
          ], 8, Cn)) : f("", !0),
          _.value ? (a(), s("button", {
========
            onClick: g[4] || (g[4] = (p) => C(p, "effort"))
          }, [
            m(ee, {
              name: "bolt",
              size: 12
            }),
            b(" " + c(A.value), 1)
          ], 8, $n)) : k("", !0),
          Y.value ? (a(), s("button", {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
            onClick: m[5] || (m[5] = (c) => o("open", "cost", c.currentTarget))
          }, u(_.value), 9, Tn)) : f("", !0),
          e.branch ? (a(), s("span", An, [
            v(ne, {
              name: "branch",
              size: 12
            }),
            h(" " + u(e.branch), 1)
          ])) : f("", !0),
          e.card ? f("", !0) : (a(), s("button", {
========
            onClick: g[5] || (g[5] = (p) => l("open", "cost", p.currentTarget))
          }, c(Y.value), 9, Sn)) : k("", !0),
          e.branch ? (a(), s("span", Cn, [
            m(ee, {
              name: "branch",
              size: 12
            }),
            b(" " + c(e.branch), 1)
          ])) : k("", !0),
          e.card ? k("", !0) : (a(), s("button", {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
            key: 6,
            type: "button",
            class: de(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
            onClick: m[6] || (m[6] = (c) => o("open", "jobs", c.currentTarget))
          }, [
            v(ne, {
              name: "clock",
              size: 12
            }),
            h(" " + u(e.jobs), 1)
========
            onClick: g[6] || (g[6] = (p) => l("open", "jobs", p.currentTarget))
          }, [
            m(ee, {
              name: "clock",
              size: 12
            }),
            b(" " + c(e.jobs), 1)
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          ], 2)),
          e.run ? (a(), s("button", {
            key: 7,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: F
          }, [
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
            v(ne, {
              name: "book",
              size: 12
            }),
            h(" " + u(I.value.length), 1)
          ])) : f("", !0),
          e.fitness ? (a(), s(q, { key: 8 }, [
            b("button", {
              type: "button",
              class: de(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < zn }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: m[7] || (m[7] = (c) => o("open", "fitness", c.currentTarget))
            }, [
              v(ne, {
                name: "heart",
                size: 12
              }),
              h(" " + u(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            b("button", {
========
            m(ee, {
              name: "book",
              size: 12
            }),
            b(" " + c(R.value.length), 1)
          ])) : k("", !0),
          e.fitness ? (a(), s(q, { key: 8 }, [
            w("button", {
              type: "button",
              class: de(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < On }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: g[7] || (g[7] = (p) => l("open", "fitness", p.currentTarget))
            }, [
              m(ee, {
                name: "heart",
                size: 12
              }),
              b(" " + c(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            w("button", {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
              type: "button",
              class: de(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
              onClick: m[8] || (m[8] = (c) => o("open", "load", c.currentTarget))
            }, [
              v(ne, {
                name: "weight",
                size: 12
              }),
              h(" " + u(e.fitness.workload), 1)
            ], 2)
          ], 64)) : f("", !0)
========
              onClick: g[8] || (g[8] = (p) => l("open", "load", p.currentTarget))
            }, [
              m(ee, {
                name: "weight",
                size: 12
              }),
              b(" " + c(e.fitness.workload), 1)
            ], 2)
          ], 64)) : k("", !0)
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
        ], 64)) : e.run && !e.loading ? (a(), s("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          onClick: m[9] || (m[9] = (c) => C(c, "start"))
        }, [
          v(ne, {
            name: "agents",
            size: 12
          }),
          m[16] || (m[16] = h(" Start an agent", -1))
        ])) : f("", !0),
        m[22] || (m[22] = b("span", { class: "space" }, null, -1)),
========
          onClick: g[9] || (g[9] = (p) => C(p, "start"))
        }, [
          m(ee, {
            name: "agents",
            size: 12
          }),
          g[16] || (g[16] = b(" Start an agent", -1))
        ])) : k("", !0),
        g[22] || (g[22] = w("span", { class: "space" }, null, -1)),
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
        i(r).failure.value ? (a(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: i(r).failure.value
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
        }, u(i(r).failure.value), 9, jn)) : f("", !0),
        Te(w.$slots, "default", {}, void 0, !0),
        n.value ? (a(), N(mn, {
========
        }, c(i(r).failure.value), 9, An)) : k("", !0),
        $e(M.$slots, "default", {}, void 0, !0),
        n.value ? (a(), N(vn, {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          key: 3,
          anchor: n.value,
          "min-width": 190,
          onClose: j
        }, {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          default: p(() => {
            var c;
            return [
              k.value === "agent" ? (a(), s(q, { key: 0 }, [
                i(r).asking.value ? (a(), s(q, { key: 0 }, [
                  v(Se, { "data-agent-stop-ask": "" }, {
                    default: p(() => [...m[17] || (m[17] = [
                      h("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  v(ye, {
                    "data-agent-stop-confirm": "",
                    onClick: m[10] || (m[10] = (d) => (L(), i(r).stop()))
                  }, {
                    default: p(() => [...m[18] || (m[18] = [
                      h("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  v(ye, {
                    onClick: m[11] || (m[11] = (d) => i(r).asking.value = !1)
                  }, {
                    default: p(() => [...m[19] || (m[19] = [
                      h("Keep it running", -1)
========
          default: h(() => {
            var p;
            return [
              y.value === "agent" ? (a(), s(q, { key: 0 }, [
                i(r).asking.value ? (a(), s(q, { key: 0 }, [
                  m(Me, { "data-agent-stop-ask": "" }, {
                    default: h(() => [...g[17] || (g[17] = [
                      b("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  m(ke, {
                    "data-agent-stop-confirm": "",
                    onClick: g[10] || (g[10] = (d) => (j(), i(r).stop()))
                  }, {
                    default: h(() => [...g[18] || (g[18] = [
                      b("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  m(ke, {
                    onClick: g[11] || (g[11] = (d) => i(r).asking.value = !1)
                  }, {
                    default: h(() => [...g[19] || (g[19] = [
                      b("Keep it running", -1)
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
                    ])]),
                    _: 1
                  })
                ], 64)) : (a(), N(ye, {
                  key: 1,
                  "data-agent-stop": "",
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
                  onClick: m[12] || (m[12] = (d) => i(r).asking.value = !0)
                }, {
                  default: p(() => [...m[20] || (m[20] = [
                    h("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : k.value === "start" ? (a(), s(q, { key: 1 }, [
                v(Se, null, {
                  default: p(() => [...m[21] || (m[21] = [
                    h("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (a(!0), s(q, null, ae(i(r).programs.value, (d) => (a(), N(ye, {
========
                  onClick: g[12] || (g[12] = (d) => i(r).asking.value = !0)
                }, {
                  default: h(() => [...g[20] || (g[20] = [
                    b("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : y.value === "start" ? (a(), s(q, { key: 1 }, [
                m(Me, null, {
                  default: h(() => [...g[21] || (g[21] = [
                    b("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (a(!0), s(q, null, ae(i(r).programs.value, (d) => (a(), N(ke, {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
                  key: d.name,
                  "data-agent-program": d.name,
                  onClick: (B) => (j(), i(r).start(d))
                }, {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
                  default: p(() => [
                    h(u(d.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : k.value === "skills" ? (a(), N(an, {
                key: 2,
                skills: e.skills,
                onBrowse: m[13] || (m[13] = (d) => (L(), o("open", "skills", null)))
              }, null, 8, ["skills"])) : $.value ? (a(), s(q, { key: 3 }, [
                v(Se, null, {
                  default: p(() => [
                    h(u($.value.label), 1)
                  ]),
                  _: 1
                }),
                k.value === "context" ? (a(), s(q, { key: 0 }, [
                  b("p", Ln, u(i(bn)(((c = V.value) == null ? void 0 : c.last_compaction) ?? null)), 1),
                  b("div", Rn, [
                    b("span", Bn, [
                      b("span", {
                        style: Re({ width: `${D.value}%` })
                      }, null, 4)
                    ]),
                    b("span", In, u(D.value) + "%", 1)
                  ]),
                  P.value ? (a(), s("p", On, [
                    h(u(P.value) + " ", 1),
                    Q.value ? (a(), N(dn, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : f("", !0)
                  ])) : f("", !0)
                ], 64)) : f("", !0),
                k.value === "context" && Y.value ? (a(), s("p", Vn, u(Y.value), 1)) : (a(!0), s(q, { key: 2 }, ae($.value.choices, (d) => (a(), N(ye, {
                  key: d.value,
                  "data-agent-choice": d.value,
                  onClick: (B) => (i(r).choose($.value.key, d), L())
                }, {
                  default: p(() => [
                    h(u(d.label), 1)
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
}, En = /* @__PURE__ */ Z(Hn, [["__scopeId", "data-v-d7113347"]]), Nn = ["data-agent-open", "aria-expanded", "role", "tabindex"], Wn = {
  class: "agent-head",
  "data-agent-head": ""
}, Dn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
========
                  default: h(() => [
                    b(c(d.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : y.value === "skills" ? (a(), N(en, {
                key: 2,
                skills: e.skills,
                onBrowse: g[13] || (g[13] = (d) => (j(), l("open", "skills", null)))
              }, null, 8, ["skills"])) : x.value ? (a(), s(q, { key: 3 }, [
                m(Me, null, {
                  default: h(() => [
                    b(c(x.value.label), 1)
                  ]),
                  _: 1
                }),
                y.value === "context" ? (a(), s(q, { key: 0 }, [
                  w("p", Tn, c(i(hn)(((p = V.value) == null ? void 0 : p.last_compaction) ?? null)), 1),
                  w("div", jn, [
                    w("span", Ln, [
                      w("span", {
                        style: je({ width: `${D.value}%` })
                      }, null, 4)
                    ]),
                    w("span", Bn, c(D.value) + "%", 1)
                  ]),
                  P.value ? (a(), s("p", Rn, [
                    b(c(P.value) + " ", 1),
                    X.value ? (a(), N(sn, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : k("", !0)
                  ])) : k("", !0)
                ], 64)) : k("", !0),
                y.value === "context" && Q.value ? (a(), s("p", In, c(Q.value), 1)) : (a(!0), s(q, { key: 2 }, ae(x.value.choices, (d) => (a(), N(ke, {
                  key: d.value,
                  "data-agent-choice": d.value,
                  onClick: (B) => (i(r).choose(x.value.key, d), j())
                }, {
                  default: h(() => [
                    b(c(d.label), 1)
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
}, zn = /* @__PURE__ */ Z(Vn, [["__scopeId", "data-v-d7113347"]]), Hn = ["data-agent-open", "aria-expanded", "role", "tabindex"], En = {
  class: "agent-head",
  "data-agent-head": ""
}, Nn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Wn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Dn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
}, qn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Fn = {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Pn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Un = {
  key: 0,
  class: "agent-menu",
  "data-agent-menu-panel": ""
}, Gn = {
  key: 1,
  class: "agent-line"
}, Jn = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Kn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, Zn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, _n = {
  class: "agent-live-fact",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, Yn = {
  key: 1,
  class: "agent-live-fact",
  "data-agent-last-heard": ""
}, Qn = {
  key: 3,
  class: "agent-unit",
  "data-agent-unit": ""
}, Xn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), o = ["completed", "testing"], r = { running: "Working", starting: "Starting", stopping: "Stopping", ended: "Idle: its process has stopped", failed: "Could not start", never_started: "Not started" }, n = e, k = l, $ = Ke(), C = z(!1), L = g(() => mt(n.row, n.facts)), I = g(() => {
      var M;
      return ((M = n.facts) == null ? void 0 : M.tasks) ?? [];
    }), F = g(() => I.value.filter((M) => M.state === "open")), O = g(() => I.value.find((M) => {
      var j;
      return M.id === ((j = n.progress) == null ? void 0 : j.task_id) && M.state === "started";
    })), W = g(() => O.value || I.value.find((M) => {
      var j;
      return M.id === ((j = n.facts) == null ? void 0 : j.task_id);
    }) || I.value.find((M) => t.has(M.state)) || F.value[0] || I.value.at(-1)), A = g(() => {
      var M, j, ce, oe, pe, ue;
      return n.row.role === "helper" ? ((M = n.facts) == null ? void 0 : M.helper_job) || "" : (j = n.facts) != null && j.job_enabled && (((ce = O.value) == null ? void 0 : ce.title) || ((oe = n.facts) == null ? void 0 : oe.task_title) || ((pe = F.value[0]) == null ? void 0 : pe.title) || ((ue = I.value.at(-1)) == null ? void 0 : ue.title)) || "";
    }), V = g(() => ht(n.row)), D = g(() => {
      var M, j;
      return [n.row.program, (M = n.facts) == null ? void 0 : M.model, (j = n.facts) == null ? void 0 : j.effort, V.value].filter(Boolean).join(" · ");
    }), Y = Be(), J = g(() => ft(n.row.process_started_at || n.row.created_at, $.value)), Q = /* @__PURE__ */ new Set(["open", "started", "testing"]), le = { fresh: "new conversation", resumed: "resumed" }, P = g(() => {
      var M, j;
      return [(M = n.facts) == null ? void 0 : M.helper_job_program, le[(j = n.facts) == null ? void 0 : j.occupant_launch]].filter(Boolean).join(", ");
    }), _ = g(() => {
      var M;
      return (M = n.facts) == null ? void 0 : M.work_status;
    }), w = g(() => !!n.row.ended_at && n.row.role !== "main" && I.value.some((M) => Q.has(M.state))), m = g(() => {
      var M, j;
      return n.row.state === "running" && ((M = n.facts) == null ? void 0 : M.state) === "at usage limit" && !!((j = n.facts) != null && j.usage_limit_ends_at);
    }), U = (M) => new Date(M).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), y = g(() => n.row.halted_at ? `Stopped at the usage limit since ${U(n.row.halted_at)}, goes on at ${U(n.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(n.facts.usage_limit_ends_at).toLocaleString()}`), c = g(() => {
      var M;
      return n.row.retired_at || n.row.state === "retired" ? "retired" : m.value || _.value || n.waitReason || w.value ? "waiting" : n.row.state === "running" && ((M = n.facts) == null ? void 0 : M.state) || n.row.state;
    }), d = g(() => {
      var M;
      return m.value ? y.value : _.value ? `Status: ${_.value}` : n.waitReason ? `Waiting: ${n.waitReason}` : c.value === "blocked" ? (M = n.facts) != null && M.blocked_reason ? `Blocked: ${n.facts.blocked_reason}` : "Blocked" : w.value ? "Stopped with work left" : "";
    }), B = g(() => {
      var M;
      return ((M = n.progress) == null ? void 0 : M.completed_count) ?? I.value.filter((j) => o.includes(j.state)).length;
    }), E = g(() => {
      var M;
      return bt(B.value, ((M = n.progress) == null ? void 0 : M.started_at) || n.row.created_at, n.progress ? n.progress.finished_at : n.row.ended_at, $.value);
    }), R = g(() => n.row.role === "main" ? 0 : E.value), T = g(() => !!n.row.retired_at || n.row.state === "retired"), se = g(() => T.value ? "Retired" : c.value === "blocked" || c.value === "waiting" ? d.value || (c.value === "blocked" ? "Blocked" : "Waiting") : r[n.row.standing]), K = g(() => {
      var j;
      if (T.value) return n.row.retired_at;
      const M = c.value === "blocked" || c.value === "waiting";
      return n.row.ended_at || M && ((j = n.facts) == null ? void 0 : j.last_activity) || n.row.process_started_at || n.row.created_at;
    }), Me = g(() => kt(K.value, $.value)), X = g(() => {
      var M;
      return yt((M = n.facts) == null ? void 0 : M.last_activity, $.value);
    });
    return (M, j) => {
      var ce, oe, pe, ue, ie, $e;
========
  key: 0,
  class: "agent-menu",
  "data-agent-menu-panel": ""
}, Pn = {
  key: 1,
  class: "agent-line"
}, Un = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Gn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, Jn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, Kn = {
  key: 3,
  class: "agent-unit",
  "data-agent-unit": ""
}, Zn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), l = ["completed", "testing"], r = { running: "Working", starting: "Starting", stopping: "Stopping", ended: "Idle: its process has stopped", failed: "Could not start", never_started: "Not started" }, n = e, y = o, x = Je(), C = z(!1), j = u(() => mt(n.row, n.facts)), R = u(() => {
      var f;
      return ((f = n.facts) == null ? void 0 : f.tasks) ?? [];
    }), F = u(() => R.value.filter((f) => f.state === "open")), O = u(() => R.value.find((f) => {
      var I;
      return f.id === ((I = n.progress) == null ? void 0 : I.task_id) && f.state === "started";
    })), W = u(() => O.value || R.value.find((f) => {
      var I;
      return f.id === ((I = n.facts) == null ? void 0 : I.task_id);
    }) || R.value.find((f) => t.has(f.state)) || F.value[0] || R.value.at(-1)), A = u(() => {
      var f, I, se, ce, oe, ve;
      return n.row.role === "helper" ? ((f = n.facts) == null ? void 0 : f.helper_job) || "" : (I = n.facts) != null && I.job_enabled && (((se = O.value) == null ? void 0 : se.title) || ((ce = n.facts) == null ? void 0 : ce.task_title) || ((oe = F.value[0]) == null ? void 0 : oe.title) || ((ve = R.value.at(-1)) == null ? void 0 : ve.title)) || "";
    }), V = u(() => ht(n.row)), D = u(() => {
      var f, I;
      return [n.row.program, (f = n.facts) == null ? void 0 : f.model, (I = n.facts) == null ? void 0 : I.effort, V.value].filter(Boolean).join(" · ");
    }), Q = Le(), G = /* @__PURE__ */ new Set(["open", "started", "testing"]), X = { fresh: "new conversation", resumed: "resumed" }, ne = u(() => {
      var f, I;
      return [(f = n.facts) == null ? void 0 : f.helper_job_program, X[(I = n.facts) == null ? void 0 : I.occupant_launch]].filter(Boolean).join(", ");
    }), P = u(() => {
      var f;
      return (f = n.facts) == null ? void 0 : f.work_status;
    }), Y = u(() => !!n.row.ended_at && n.row.role !== "main" && R.value.some((f) => G.has(f.state))), M = u(() => {
      var f, I;
      return n.row.state === "running" && ((f = n.facts) == null ? void 0 : f.state) === "at usage limit" && !!((I = n.facts) != null && I.usage_limit_ends_at);
    }), g = (f) => new Date(f).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), J = u(() => n.row.halted_at ? `Stopped at the usage limit since ${g(n.row.halted_at)}, goes on at ${g(n.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(n.facts.usage_limit_ends_at).toLocaleString()}`), v = u(() => {
      var f;
      return n.row.retired_at || n.row.state === "retired" ? "retired" : M.value || P.value || n.waitReason || Y.value ? "waiting" : n.row.state === "running" && ((f = n.facts) == null ? void 0 : f.state) || n.row.state;
    }), p = u(() => {
      var f;
      return M.value ? J.value : P.value ? `Status: ${P.value}` : n.waitReason ? `Waiting: ${n.waitReason}` : v.value === "blocked" ? (f = n.facts) != null && f.blocked_reason ? `Blocked: ${n.facts.blocked_reason}` : "Blocked" : Y.value ? "Stopped with work left" : "";
    }), d = u(() => {
      var f;
      return ((f = n.progress) == null ? void 0 : f.completed_count) ?? R.value.filter((I) => l.includes(I.state)).length;
    }), B = u(() => {
      var f;
      return ft(d.value, ((f = n.progress) == null ? void 0 : f.started_at) || n.row.created_at, n.progress ? n.progress.finished_at : n.row.ended_at, x.value);
    }), E = u(() => n.row.role === "main" ? 0 : B.value), L = u(() => !!n.row.retired_at || n.row.state === "retired"), T = u(() => L.value ? "Retired" : v.value === "blocked" || v.value === "waiting" ? p.value || (v.value === "blocked" ? "Blocked" : "Waiting") : r[n.row.standing]), le = u(() => {
      var I;
      if (L.value) return n.row.retired_at;
      const f = v.value === "blocked" || v.value === "waiting";
      return n.row.ended_at || f && ((I = n.facts) == null ? void 0 : I.last_activity) || n.row.process_started_at || n.row.created_at;
    }), K = u(() => bt(le.value, x.value)), ye = u(() => {
      var f;
      return kt((f = n.facts) == null ? void 0 : f.last_activity, x.value);
    });
    return (f, I) => {
      var se, ce, oe, ve, he, ie;
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
      return a(), s("div", {
        class: de(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
        onClick: j[2] || (j[2] = (ge) => !e.open && k("toggle")),
        onKeydown: [
          j[3] || (j[3] = De(te((ge) => !e.open && k("toggle"), ["self", "prevent"]), ["enter"])),
          j[4] || (j[4] = De(te((ge) => !e.open && k("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        b("div", Wn, [
========
        onClick: I[2] || (I[2] = (ue) => !e.open && y("toggle")),
        onKeydown: [
          I[3] || (I[3] = Ne(te((ue) => !e.open && y("toggle"), ["self", "prevent"]), ["enter"])),
          I[4] || (I[4] = Ne(te((ue) => !e.open && y("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        w("div", En, [
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          e.open ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back",
            "aria-label": "Back",
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
            onClick: j[0] || (j[0] = te((ge) => k("toggle"), ["stop"]))
          }, [
            v(i(ze), {
========
            onClick: I[0] || (I[0] = te((ue) => y("toggle"), ["stop"]))
          }, [
            m(i(Oe), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
              name: "chevronRight",
              facing: "left",
              size: 14
            })
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          ])) : f("", !0),
          e.open ? (a(), s(q, { key: 1 }, [
            b("span", Dn, u(L.value.title), 1),
            b("span", qn, u(L.value.subtext), 1),
            v(i(ee), {
========
          ])) : k("", !0),
          e.open ? (a(), s(q, { key: 1 }, [
            w("span", Nn, c(j.value.title), 1),
            w("span", Wn, c(j.value.subtext), 1),
            m(i(_), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
              variant: "ghost",
              small: "",
              class: "agent-menu-button",
              "data-agent-menu": "",
              "aria-expanded": C.value,
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
              onClick: j[1] || (j[1] = te((ge) => C.value = !C.value, ["stop"]))
            }, {
              default: p(() => [...j[5] || (j[5] = [
                h("Actions", -1)
========
              onClick: I[1] || (I[1] = te((ue) => C.value = !C.value, ["stop"]))
            }, {
              default: h(() => [...I[5] || (I[5] = [
                b("Actions", -1)
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
              ])]),
              _: 1
            }, 8, ["aria-expanded"])
          ], 64)) : (a(), s(q, { key: 2 }, [
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
            v(i(wt), {
========
            m(i(yt), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
              "agent-id": e.row.id,
              label: j.value.text,
              class: "agent-who"
            }, {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
              default: p(() => [
                b("span", Fn, u(L.value.title), 1),
                b("span", Pn, u(L.value.subtext), 1)
              ]),
              _: 1
            }, 8, ["agent-id", "label"]),
            v(i(ze), {
========
              default: h(() => [
                w("span", Dn, c(j.value.title), 1),
                w("span", qn, c(j.value.subtext), 1)
              ]),
              _: 1
            }, 8, ["agent-id", "label"]),
            m(i(Oe), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
              class: "agent-chevron",
              name: "chevronRight",
              size: 12
            })
          ], 64))
        ]),
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
        e.open && C.value ? (a(), s("div", Un, [
          v(Qt, {
            row: e.row,
            held: c.value === "blocked"
          }, null, 8, ["row", "held"])
        ])) : f("", !0),
        e.open ? f("", !0) : (a(), s("span", Gn, [
          b("span", Jn, u(D.value), 1),
          (ce = e.facts) != null && ce.sandbox_off ? (a(), s("span", Kn, "sandbox off")) : f("", !0)
        ])),
        e.open && !T.value ? (a(), N(En, {
          key: 2,
          class: "agent-live",
          "agent-programs": i(Y).props.programs.rows.value,
          agent: e.row,
          branch: (oe = e.progress) == null ? void 0 : oe.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((pe = e.facts) == null ? void 0 : pe.windows) ?? [] },
          card: ""
        }, {
          default: p(() => {
            var ge, xe;
            return [
              (ge = e.facts) != null && ge.sandbox_off ? (a(), s("span", Zn, "sandbox off")) : f("", !0),
              b("span", _n, "Run time: " + u(J.value), 1),
              (xe = e.facts) != null && xe.last_activity ? (a(), s("span", Yn, [
                j[6] || (j[6] = h("Seen: ", -1)),
                v(i(Ee), {
                  at: e.facts.last_activity
                }, null, 8, ["at"])
              ])) : f("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : f("", !0),
        (ue = e.facts) != null && ue.unit_name ? (a(), s("div", Qn, "Unit: " + u(e.facts.unit_name), 1)) : f("", !0),
        e.open ? f("", !0) : (a(), N(Pa, {
========
        e.open && C.value ? (a(), s("div", Fn, [
          m(Qt, {
            row: e.row,
            held: v.value === "blocked"
          }, null, 8, ["row", "held"])
        ])) : k("", !0),
        e.open ? k("", !0) : (a(), s("span", Pn, [
          w("span", Un, c(D.value), 1),
          (se = e.facts) != null && se.sandbox_off ? (a(), s("span", Gn, "sandbox off")) : k("", !0)
        ])),
        e.open && !L.value ? (a(), N(zn, {
          key: 2,
          class: "agent-live",
          "agent-programs": i(Q).props.programs.rows.value,
          agent: e.row,
          branch: (ce = e.progress) == null ? void 0 : ce.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((oe = e.facts) == null ? void 0 : oe.windows) ?? [] },
          card: ""
        }, {
          default: h(() => {
            var ue;
            return [
              (ue = e.facts) != null && ue.sandbox_off ? (a(), s("span", Jn, "sandbox off")) : k("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : k("", !0),
        !e.open && ((ve = e.facts) != null && ve.unit_name) ? (a(), s("div", Kn, "Unit: " + c(e.facts.unit_name), 1)) : k("", !0),
        e.open ? k("", !0) : (a(), N(qa, {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          key: 4,
          tasks: R.value,
          "in-hand": e.row.role !== "helper" && ((he = e.facts) != null && he.job_enabled) && W.value || null,
          job: e.row.role === "helper" ? A.value : "",
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          "job-title": e.row.role === "helper" && (($e = e.facts) == null ? void 0 : $e.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? P.value : "",
          "per-hour": R.value
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour"])),
        v(ja, {
          state: c.value,
          doing: se.value,
          since: Me.value,
          seen: X.value
========
          "job-title": e.row.role === "helper" && ((ie = e.facts) == null ? void 0 : ie.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? ne.value : "",
          "per-hour": E.value
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour"])),
        m(Ta, {
          state: v.value,
          doing: T.value,
          since: K.value,
          seen: ye.value
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (a(), N(xa, {
          key: 5,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: R.value,
          "stopped-with-work": Y.value,
          open: e.open
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : f("", !0)
      ], 42, Nn);
    };
  }
}, el = /* @__PURE__ */ Z(Xn, [["__scopeId", "data-v-9d316c36"]]), tl = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, al = ["data-agent-row", "data-agent-lingering"], Pe = "journal.agents.filters", Ue = 300 * 1e3, Le = "cubic-bezier(0.2, 0.9, 0.25, 1)", nl = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const l = e, t = Be(), { rows: o } = t.props.waits, { rows: r } = t.props.progress, { rows: n, failure: k, loaded: $, more: C } = t.props.agents, L = (S) => r.value.find((H) => H.agent_id === S.id) ?? null, I = (S) => {
      var H;
      return ((H = o.value.find((x) => x.agent_id === S.id)) == null ? void 0 : H.reason) ?? "";
    }, F = z("running"), O = z(""), W = JSON.parse(localStorage.getItem(Pe) || '{"roles":[],"profiles":[],"programs":[]}'), A = z(W), V = g(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: D } = t.props.programs, Y = g(() => A.value.roles.length + A.value.profiles.length + A.value.programs.length), J = (S, H) => {
      A.value = St(A.value, S, H);
    }, Q = () => {
      A.value = { roles: [], profiles: [], programs: [] };
    }, le = (S) => S.slice(0, 1).toUpperCase() + S.slice(1);
    ve(A, (S) => localStorage.setItem(Pe, JSON.stringify(S)));
========
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : k("", !0)
      ], 42, Hn);
    };
  }
}, Yn = /* @__PURE__ */ Z(Zn, [["__scopeId", "data-v-f8b7238a"]]), Qn = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Xn = ["data-agent-row", "data-agent-lingering"], qe = "journal.agents.filters", Fe = 300 * 1e3, Te = "cubic-bezier(0.2, 0.9, 0.25, 1)", _n = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const o = e, t = Le(), { rows: l } = t.props.waits, { rows: r } = t.props.progress, { rows: n, failure: y, loaded: x, more: C } = t.props.agents, j = (S) => r.value.find((H) => H.agent_id === S.id) ?? null, R = (S) => {
      var H;
      return ((H = l.value.find(($) => $.agent_id === S.id)) == null ? void 0 : H.reason) ?? "";
    }, F = z("running"), O = z(""), W = JSON.parse(localStorage.getItem(qe) || '{"roles":[],"profiles":[],"programs":[]}'), A = z(W), V = u(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: D } = t.props.programs, Q = u(() => A.value.roles.length + A.value.profiles.length + A.value.programs.length), G = (S, H) => {
      A.value = $t(A.value, S, H);
    }, X = () => {
      A.value = { roles: [], profiles: [], programs: [] };
    }, ne = (S) => S.slice(0, 1).toUpperCase() + S.slice(1);
    ge(A, (S) => localStorage.setItem(qe, JSON.stringify(S)));
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
    const P = z(25);
    function _() {
      Object.assign(t.state, {
        "agents.show": F.value,
        "agents.search": O.value,
        "agents.limit": String(P.value),
        "agents.roles": A.value.roles.join(","),
        "agents.profiles": A.value.profiles.join(","),
        "agents.programs": A.value.programs.join(",")
      });
    }
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
    async function w() {
      return P.value += 25, _(), await t.reload("agents"), !0;
    }
    ve([F, O, A], () => {
      P.value = 25, _(), t.reload("agents");
    }), _();
    const m = (S) => S.facts ?? null, U = n, y = Ke(), c = z([]), d = g(() => new Set(c.value.filter((S) => y.value - S.left < Ue).map((S) => S.row.id))), B = g(() => c.value.filter((S) => d.value.has(S.row.id)).map((S) => S.row)), E = g(() => [...U.value, ...B.value]);
    let R = "", T = [];
    async function se(S) {
      await t.reload(`card.${S.id}`);
      const H = t.props[`card.${S.id}`].rows.value.find((x) => x.id === S.id);
      H != null && H.ended_at && !c.value.some((x) => x.row.id === S.id) && (c.value = [...c.value, { row: H, left: Date.now() }]);
    }
    ve(n, (S) => {
      const H = R === `${F.value}|${O.value}|${JSON.stringify(A.value)}` && F.value === "running", x = H ? T.filter((G) => !S.some((me) => me.id === G.id)) : [];
      R = `${F.value}|${O.value}|${JSON.stringify(A.value)}`, T = S, c.value = H ? c.value.filter((G) => y.value - G.left < Ue && !S.some((me) => me.id === G.row.id)) : [], x.forEach(se);
    }, { immediate: !0 });
    const K = g(() => !!O.value.trim() || Y.value > 0), Me = g(() => l.texts[F.value] ?? { title: l.empty, hint: "" }), X = z(null), M = z(null), j = z(null), ce = z(null), oe = g(() => X.value === null ? null : t.props[`card.${X.value}`].rows.value.find((S) => S.id === X.value) ?? M.value), pe = g(() => oe.value ? [oe.value] : E.value), ue = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, ie = z(!1);
    let $e = 0;
    async function ge(S) {
      if (ie.value) return;
      ie.value = !0, $e = ce.value.scrollTop;
      const H = j.value.querySelector(`[data-agent-open="${S.id}"]`);
      if (!ue()) {
        const he = [...j.value.querySelectorAll(".agent-row")].filter((re) => !re.contains(H));
        await Promise.all(he.map((re) => re.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const x = [...H.querySelectorAll(".agent-head, .agent-line")], G = [...x, ...H.querySelectorAll("[data-agent-motion]")], me = G.map((he) => he.getBoundingClientRect());
      if (M.value = S, X.value = S.id, t.reload(`card.${S.id}`), await qe(), !ue()) {
        const he = G.map((re) => re.getBoundingClientRect());
        G.forEach((re, Ae) => {
          const be = x.findIndex((We) => We !== re && We.contains(re)), Ye = me[Ae].left - he[Ae].left - (be < 0 ? 0 : me[be].left - he[be].left), Qe = me[Ae].top - he[Ae].top - (be < 0 ? 0 : me[be].top - he[be].top);
          re.animate([{ transform: `translate(${Ye}px, ${Qe}px)` }, { transform: "none" }], { duration: 280, easing: Le });
        }), j.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((re) => {
          re.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Le, fill: "backwards" });
========
    async function M() {
      return P.value += 25, Y(), await t.reload("agents"), !0;
    }
    ge([F, O, A], () => {
      P.value = 25, Y(), t.reload("agents");
    }), Y();
    const g = (S) => S.facts ?? null, J = n, v = Je(), p = z([]), d = u(() => new Set(p.value.filter((S) => v.value - S.left < Fe).map((S) => S.row.id))), B = u(() => p.value.filter((S) => d.value.has(S.row.id)).map((S) => S.row)), E = u(() => [...J.value, ...B.value]);
    let L = "", T = [];
    async function le(S) {
      await t.reload(`card.${S.id}`);
      const H = t.props[`card.${S.id}`].rows.value.find(($) => $.id === S.id);
      H != null && H.ended_at && !p.value.some(($) => $.row.id === S.id) && (p.value = [...p.value, { row: H, left: Date.now() }]);
    }
    ge(n, (S) => {
      const H = L === `${F.value}|${O.value}|${JSON.stringify(A.value)}` && F.value === "running", $ = H ? T.filter((U) => !S.some((pe) => pe.id === U.id)) : [];
      L = `${F.value}|${O.value}|${JSON.stringify(A.value)}`, T = S, p.value = H ? p.value.filter((U) => v.value - U.left < Fe && !S.some((pe) => pe.id === U.row.id)) : [], $.forEach(le);
    }, { immediate: !0 });
    const K = u(() => !!O.value.trim() || Q.value > 0), ye = u(() => o.texts[F.value] ?? { title: o.empty, hint: "" }), f = z(null), I = z(null), se = z(null), ce = z(null), oe = u(() => f.value === null ? null : t.props[`card.${f.value}`].rows.value.find((S) => S.id === f.value) ?? I.value), ve = u(() => oe.value ? [oe.value] : E.value), he = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, ie = z(!1);
    let ue = 0;
    async function Ze(S) {
      if (ie.value) return;
      ie.value = !0, ue = ce.value.scrollTop;
      const H = se.value.querySelector(`[data-agent-open="${S.id}"]`);
      if (!he()) {
        const me = [...se.value.querySelectorAll(".agent-row")].filter((re) => !re.contains(H));
        await Promise.all(me.map((re) => re.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const $ = [...H.querySelectorAll(".agent-head, .agent-line")], U = [...$, ...H.querySelectorAll("[data-agent-motion]")], pe = U.map((me) => me.getBoundingClientRect());
      if (I.value = S, f.value = S.id, t.reload(`card.${S.id}`), await We(), !he()) {
        const me = U.map((re) => re.getBoundingClientRect());
        U.forEach((re, Ce) => {
          const fe = $.findIndex((Ee) => Ee !== re && Ee.contains(re)), Qe = pe[Ce].left - me[Ce].left - (fe < 0 ? 0 : pe[fe].left - me[fe].left), Xe = pe[Ce].top - me[Ce].top - (fe < 0 ? 0 : pe[fe].top - me[fe].top);
          re.animate([{ transform: `translate(${Qe}px, ${Xe}px)` }, { transform: "none" }], { duration: 280, easing: Te });
        }), se.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((re) => {
          re.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Te, fill: "backwards" });
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
        });
      }
      ie.value = !1;
    }
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
    async function xe() {
      if (ie.value || !oe.value) return;
      ie.value = !0;
      const S = j.value.querySelector(`[data-agent-open="${X.value}"]`), H = [...S.children], x = ue() ? [] : H.map((G) => G.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(x.map((G) => G.finished)), X.value = null, await qe(), ce.value.scrollTop = $e, x.forEach((G) => G.cancel()), ue() || (S.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Le }), j.value.querySelectorAll(".agent-row").forEach((G) => {
        G.contains(S) || G.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Le });
      })), ie.value = !1;
    }
    const _e = (S) => X.value === S.id ? xe() : ge(S);
    ve(O, (S) => S.trim() && (X.value = null)), ve(F, () => {
      X.value = null;
    });
    const Ne = (S) => {
      S.key === "Escape" && xe();
    };
    return window.addEventListener("keydown", Ne), Ce(() => window.removeEventListener("keydown", Ne)), (S, H) => (a(), s("div", {
      ref_key: "agents",
      ref: j,
      class: de(["agents", { focused: oe.value, "card-changing": ie.value }])
    }, [
      oe.value ? f("", !0) : (a(), N(i(Mt), {
========
    async function ze() {
      if (ie.value || !oe.value) return;
      ie.value = !0;
      const S = se.value.querySelector(`[data-agent-open="${f.value}"]`), H = [...S.children], $ = he() ? [] : H.map((U) => U.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all($.map((U) => U.finished)), f.value = null, await We(), ce.value.scrollTop = ue, $.forEach((U) => U.cancel()), he() || (S.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Te }), se.value.querySelectorAll(".agent-row").forEach((U) => {
        U.contains(S) || U.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Te });
      })), ie.value = !1;
    }
    const Ye = (S) => f.value === S.id ? ze() : Ze(S);
    ge(O, (S) => S.trim() && (f.value = null)), ge(F, () => {
      f.value = null;
    });
    const He = (S) => {
      S.key === "Escape" && ze();
    };
    return window.addEventListener("keydown", He), xe(() => window.removeEventListener("keydown", He)), (S, H) => (a(), s("div", {
      ref_key: "agents",
      ref: se,
      class: de(["agents", { focused: oe.value, "card-changing": ie.value }])
    }, [
      oe.value ? k("", !0) : (a(), N(i(wt), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
        key: 0,
        modelValue: O.value,
        "onUpdate:modelValue": H[1] || (H[1] = (x) => O.value = x),
        placeholder: "Search agents",
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
        "menu-count": Y.value,
        "data-agents-search": ""
      }, {
        menu: p(() => [
          v(i(Oe), null, {
            default: p(() => [...H[2] || (H[2] = [
              h("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(q, null, ae(V.value.roles, (x) => (a(), N(i(je), {
            key: x,
            role: "menuitemcheckbox",
            "aria-checked": A.value.roles.includes(x),
            checked: A.value.roles.includes(x),
            "data-filter-role": x,
            onClick: (G) => J("roles", x)
          }, {
            default: p(() => [
              h(u(le(x)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          V.value.profiles.length ? (a(), N(i(Oe), { key: 0 }, {
            default: p(() => [...H[3] || (H[3] = [
              h("Profile", -1)
            ])]),
            _: 1
          })) : f("", !0),
          (a(!0), s(q, null, ae(V.value.profiles, (x) => (a(), N(i(je), {
            key: x.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.profiles.includes(x.name),
            checked: A.value.profiles.includes(x.name),
            "data-filter-profile": x.name,
            onClick: (G) => J("profiles", x.name)
          }, {
            default: p(() => [
              h(u(x.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          v(i(Oe), null, {
            default: p(() => [...H[4] || (H[4] = [
              h("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(q, null, ae(i(D), (x) => (a(), N(i(je), {
            key: x.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.programs.includes(x.name),
            checked: A.value.programs.includes(x.name),
            "data-filter-program": x.name,
            onClick: (G) => J("programs", x.name)
          }, {
            default: p(() => [
              h(u(x.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          Y.value ? (a(), N(i(je), {
========
        "menu-count": Q.value,
        "data-agents-search": ""
      }, {
        menu: h(() => [
          m(i(Re), null, {
            default: h(() => [...H[2] || (H[2] = [
              b("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(q, null, ae(V.value.roles, ($) => (a(), N(i(Ae), {
            key: $,
            role: "menuitemcheckbox",
            "aria-checked": A.value.roles.includes($),
            checked: A.value.roles.includes($),
            "data-filter-role": $,
            onClick: (U) => G("roles", $)
          }, {
            default: h(() => [
              b(c(ne($)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          V.value.profiles.length ? (a(), N(i(Re), { key: 0 }, {
            default: h(() => [...H[3] || (H[3] = [
              b("Profile", -1)
            ])]),
            _: 1
          })) : k("", !0),
          (a(!0), s(q, null, ae(V.value.profiles, ($) => (a(), N(i(Ae), {
            key: $.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.profiles.includes($.name),
            checked: A.value.profiles.includes($.name),
            "data-filter-profile": $.name,
            onClick: (U) => G("profiles", $.name)
          }, {
            default: h(() => [
              b(c($.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          m(i(Re), null, {
            default: h(() => [...H[4] || (H[4] = [
              b("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(q, null, ae(i(D), ($) => (a(), N(i(Ae), {
            key: $.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.programs.includes($.name),
            checked: A.value.programs.includes($.name),
            "data-filter-program": $.name,
            onClick: (U) => G("programs", $.name)
          }, {
            default: h(() => [
              b(c($.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          Q.value ? (a(), N(i(Ae), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
            key: 1,
            "data-filter-clear": "",
            onClick: X
          }, {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
            default: p(() => [...H[5] || (H[5] = [
              h("Clear filters", -1)
            ])]),
            _: 1
          })) : f("", !0)
        ]),
        default: p(() => [
          v(i($t), {
========
            default: h(() => [...H[5] || (H[5] = [
              b("Clear filters", -1)
            ])]),
            _: 1
          })) : k("", !0)
        ]),
        default: h(() => [
          m(i(Mt), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
            options: V.value.states,
            value: F.value,
            onPick: H[0] || (H[0] = (x) => F.value = x)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
      F.value === "retired" && V.value.upgrade_retired ? (a(), s("p", tl, "Retired during the upgrade: " + u(V.value.upgrade_retired), 1)) : f("", !0),
      b("div", {
========
      F.value === "retired" && V.value.upgrade_retired ? (a(), s("p", Qn, "Retired during the upgrade: " + c(V.value.upgrade_retired), 1)) : k("", !0),
      w("div", {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
        ref_key: "list",
        ref: ce,
        class: de(["agents-view", { "agents-view-open": oe.value }])
      }, [
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
        i($) && !i(k) && !pe.value.length && Y.value ? (a(), N(i(He), {
========
        i(x) && !i(y) && !ve.value.length && Q.value ? (a(), N(i(Ve), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          default: p(() => [
            v(i(ee), {
========
          default: h(() => [
            m(i(_), {
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
              small: "",
              "data-empty-clear": "",
              onClick: X
            }, {
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
              default: p(() => [...H[6] || (H[6] = [
                h("Clear filters", -1)
========
              default: h(() => [...H[6] || (H[6] = [
                b("Clear filters", -1)
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), N(i(xt), {
          key: 1,
          moves: "",
          "leaves-at-once": ie.value,
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
          rows: pe.value,
          failure: i(k),
          loaded: i($),
          more: !oe.value && i(C),
          older: w,
          empty: Me.value.title,
          hint: Me.value.hint,
          searching: K.value
        }, {
          default: p(({ row: x }) => [
            b("div", {
              class: de(["agent-row", { lingering: d.value.has(x.id) && x.id !== X.value }]),
              "data-agent-row": x.id,
              "data-agent-lingering": d.value.has(x.id) ? "" : null
            }, [
              v(el, {
                row: x,
                facts: m(x),
                progress: L(x),
                "wait-reason": I(x),
                open: x.id === X.value,
                onToggle: (G) => _e(x)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, al)
========
          rows: ve.value,
          failure: i(y),
          loaded: i(x),
          more: !oe.value && i(C),
          older: M,
          empty: ye.value.title,
          hint: ye.value.hint,
          searching: K.value
        }, {
          default: h(({ row: $ }) => [
            w("div", {
              class: de(["agent-row", { lingering: d.value.has($.id) && $.id !== f.value }]),
              "data-agent-row": $.id,
              "data-agent-lingering": d.value.has($.id) ? "" : null
            }, [
              m(Yn, {
                row: $,
                facts: g($),
                progress: j($),
                "wait-reason": R($),
                open: $.id === f.value,
                onToggle: (U) => Ye($)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, Xn)
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
<<<<<<<< HEAD:src/core/modules/agents/web/dist/AgentRows-wr50Tf3O.js
}, il = /* @__PURE__ */ Z(nl, [["__scopeId", "data-v-6542daf5"]]);
export {
  il as A
========
}, no = /* @__PURE__ */ Z(_n, [["__scopeId", "data-v-6542daf5"]]);
export {
  no as A
>>>>>>>> task 9601: Remove the Seen line between the agent badges and the tabs:src/core/modules/agents/web/dist/AgentRows-B5w4zNzf.js
};
