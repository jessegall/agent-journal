import { openBlock as a, createElementBlock as s, withModifiers as ae, createElementVNode as h, createVNode as b, unref as r, withCtx as m, createTextVNode as f, Fragment as H, renderList as ne, toDisplayString as u, createBlock as N, createCommentVNode as k, ref as z, computed as c, watch as ge, onUnmounted as je, defineAsyncComponent as ot, createSlots as st, resolveDynamicComponent as rt, normalizeClass as de, normalizeStyle as ye, renderSlot as Be, onMounted as it, Teleport as dt, mergeProps as ut, toRef as Ne, withDirectives as ct, withKeys as Ge, nextTick as Je } from "vue";
import { TextInput as De, Btn as te, TextArea as gt, TimeAgo as Xe, useWindow as ze, SwitchCase as _e, peekRef as we, Icon as qe, RunningCommand as vt, FoldGroup as Qe, TaskStatusIcon as pt, loadWindowComponent as mt, coalesced as ht, READ_RATES as ft, eventMayBeChildOf as bt, InnerTabs as kt, TabBody as yt, EmptyState as Fe, HoverTip as ke, TaskBar as Ke, useNow as et, agentTitle as wt, agentNumber as Mt, perHour as $t, sinceWords as xt, seenWords as St, AgentTip as Ct, vContext as Tt, copying as At, SearchBar as jt, Segmented as Bt, MenuLabel as He, MenuItem as Ie, RowList as Lt, toggleFilter as Ot } from "@journal/window-kit";
import { _ as K, T as Rt } from "./TranscriptRows-Crmxs6Un.js";
const It = { class: "action-buttons" }, Vt = {
  __name: "AgentDriverForm",
  props: { program: String, model: String, pending: Boolean },
  emits: ["submit", "cancel", "update:program", "update:model"],
  setup(e) {
    return (l, t) => (a(), s("form", {
      "data-agent-driver-form": "",
      onSubmit: t[3] || (t[3] = ae((o) => l.$emit("submit"), ["prevent"]))
    }, [
      t[6] || (t[6] = h("p", null, "Starts the next session on this program; the agent keeps its number and memories.", -1)),
      b(r(De), {
        "model-value": e.program,
        label: "Program",
        disabled: e.pending,
        "data-agent-driver-program": "",
        "onUpdate:modelValue": t[0] || (t[0] = (o) => l.$emit("update:program", o))
      }, null, 8, ["model-value", "disabled"]),
      b(r(De), {
        "model-value": e.model,
        label: "Model",
        disabled: e.pending,
        "data-agent-driver-model": "",
        "onUpdate:modelValue": t[1] || (t[1] = (o) => l.$emit("update:model", o))
      }, null, 8, ["model-value", "disabled"]),
      h("div", It, [
        b(r(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.program.trim() || !e.model.trim(),
          "data-agent-confirm-driver": ""
        }, {
          default: m(() => [...t[4] || (t[4] = [
            f("Change the driver", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        b(r(te), {
          small: "",
          disabled: e.pending,
          onClick: t[2] || (t[2] = (o) => l.$emit("cancel"))
        }, {
          default: m(() => [...t[5] || (t[5] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Et = /* @__PURE__ */ K(Vt, [["__scopeId", "data-v-c138a4da"]]), zt = { class: "action-field" }, Nt = ["value", "disabled"], Ht = ["value"], Wt = { key: 1 }, Dt = {
  key: 1,
  class: "action-field"
}, qt = { class: "action-buttons" }, Ft = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (l, t) => (a(), s("form", {
      onSubmit: t[4] || (t[4] = ae((o) => l.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (a(), s(H, { key: 0 }, [
        h("label", zt, [
          t[6] || (t[6] = f("Task ", -1)),
          h("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: t[0] || (t[0] = (o) => l.$emit("update:task", o.target.value))
          }, [
            t[5] || (t[5] = h("option", { value: "" }, "Choose an open task", -1)),
            (a(!0), s(H, null, ne(e.tasks, (o) => (a(), s("option", {
              key: o.id,
              value: String(o.id)
            }, u(o.id) + ": " + u(o.title), 9, Ht))), 128))
          ], 40, Nt)
        ]),
        e.moreTasks ? (a(), N(r(te), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: t[1] || (t[1] = (o) => l.$emit("more"))
        }, {
          default: m(() => [...t[7] || (t[7] = [
            f("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : k("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (a(), s("p", Wt, "No open tasks.")) : k("", !0)
      ], 64)) : (a(), s("label", Dt, [
        t[8] || (t[8] = f("Job", -1)),
        b(r(gt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (o) => l.$emit("update:text", o.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      h("div", qt, [
        b(r(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: m(() => [...t[9] || (t[9] = [
            f("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        b(r(te), {
          small: "",
          disabled: e.pending,
          onClick: t[3] || (t[3] = (o) => l.$emit("cancel"))
        }, {
          default: m(() => [...t[10] || (t[10] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Pt = /* @__PURE__ */ K(Ft, [["__scopeId", "data-v-adde4158"]]), Ut = { class: "action-buttons" }, Gt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (l, t) => (a(), s("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = ae((o) => l.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = h("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      b(r(De), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (o) => l.$emit("update:reason", o))
      }, null, 8, ["model-value", "disabled"]),
      h("div", Ut, [
        b(r(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: m(() => [...t[3] || (t[3] = [
            f("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        b(r(te), {
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (o) => l.$emit("cancel"))
        }, {
          default: m(() => [...t[4] || (t[4] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Jt = /* @__PURE__ */ K(Gt, [["__scopeId", "data-v-92de7dd6"]]), Kt = {
  class: "session-history",
  "data-agent-session-history": ""
}, Zt = { key: 0 }, Yt = { key: 0 }, Xt = { "data-agent-session-state": "" }, _t = { class: "action-buttons" }, Qt = {
  __name: "AgentSessionHistory",
  props: { sessions: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e) {
    return (l, t) => (a(), s("div", Kt, [
      e.sessions.length ? k("", !0) : (a(), s("p", Zt, "This agent has no session in its history.")),
      h("ol", null, [
        (a(!0), s(H, null, ne(e.sessions, (o) => (a(), s("li", {
          key: o.session,
          "data-agent-session": ""
        }, [
          h("span", null, u([o.program, o.model].filter(Boolean).join(" ")), 1),
          o.started_at ? (a(), s("span", Yt, [
            t[1] || (t[1] = f("Started ", -1)),
            b(r(Xe), {
              at: o.started_at
            }, null, 8, ["at"])
          ])) : k("", !0),
          h("span", Xt, u(o.end_reason ? `Ended: ${o.end_reason.replaceAll("_", " ")}` : o.started_at ? "Running" : "Not started"), 1),
          h("code", null, u(o.session), 1)
        ]))), 128))
      ]),
      h("div", _t, [
        b(r(te), {
          small: "",
          onClick: t[0] || (t[0] = (o) => l.$emit("close"))
        }, {
          default: m(() => [...t[2] || (t[2] = [
            f("Close", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, ea = /* @__PURE__ */ K(Qt, [["__scopeId", "data-v-0d688bd9"]]), ta = { class: "action-buttons" }, aa = {
  key: 0,
  role: "alert"
}, na = {
  key: 1,
  role: "status"
}, la = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 }, held: { type: Boolean, default: !1 } },
  setup(e) {
    const l = e, t = ze(), o = z(""), d = z(""), n = z(""), g = z(""), $ = z(""), B = z(""), R = z([]), j = z(0), D = z(!1), W = z(!1), V = z(!1), T = z(""), E = z(""), P = z([]), q = c(() => !!l.row.retired_at || l.row.state === "retired"), Z = c(() => !q.value && !!l.row.ended_at), _ = c(() => {
      var y;
      return Z.value && ((y = l.row.job_command) == null ? void 0 : y.length) && !l.row.resume_reason;
    }), Q = c(() => _.value && !W.value && (l.row.job_task_flag ? R.value.some((y) => String(y.id) === B.value) : !!d.value.trim()));
    function F(y) {
      o.value = y, d.value = "", n.value = "", B.value = "", T.value = "", E.value = "";
    }
    async function X() {
      F("job"), l.row.job_task_flag && (R.value = [], j.value = 0, D.value = !1, await x());
    }
    async function x() {
      if (!W.value) {
        W.value = !0;
        try {
          t.state["jobs.page"] = String(j.value + 1), await t.reload("jobs");
          const y = t.props.jobs;
          T.value = y.failure.value, T.value || (R.value = [...R.value, ...y.rows.value], j.value = y.data.value.page, D.value = y.more.value);
        } finally {
          W.value = !1;
        }
      }
    }
    async function p() {
      await Y(["process", "lift-hold", String(l.row.number)], "Hold lifted.");
    }
    async function Y(y, M) {
      if (!V.value) {
        V.value = !0, T.value = "";
        try {
          const se = await t.run(y);
          T.value = se.ok ? "" : se.error, se.ok && (F(""), E.value = M);
        } finally {
          V.value = !1;
        }
      }
    }
    async function U() {
      if (!Q.value) return;
      const y = l.row.job_task_flag ? [l.row.job_task_flag, B.value] : [d.value.trim()];
      await Y([...l.row.job_command, String(l.row.number), ...y], "Job sent.");
    }
    async function i() {
      if (!V.value) {
        V.value = !0;
        try {
          const y = await t.run(["agent", "sessions", String(l.row.number)]);
          F(y.ok ? "history" : ""), T.value = y.ok ? "" : y.error, P.value = y.ok ? y.value.rows : [];
        } finally {
          V.value = !1;
        }
      }
    }
    function A() {
      F("driver"), g.value = l.row.program || "", $.value = "";
    }
    async function v() {
      !Z.value || o.value !== "driver" || !g.value.trim() || !$.value.trim() || await Y(["agent", "driver", String(l.row.number), "--program", g.value.trim(), "--model", $.value.trim()], "Driver changed.");
    }
    async function I() {
      !Z.value || o.value !== "retire" || !n.value.trim() || await Y(["agent", "retire", String(l.row.number), "--reason", n.value.trim()], "Agent retired permanently.");
    }
    return (y, M) => {
      var se;
      return a(), s("div", {
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: M[10] || (M[10] = ae(() => {
        }, ["stop"])),
        onKeydown: M[11] || (M[11] = ae(() => {
        }, ["stop"]))
      }, [
        h("div", ta, [
          b(r(te), {
            small: "",
            "data-agent-history": "",
            disabled: V.value || W.value,
            onClick: i
          }, {
            default: m(() => [...M[12] || (M[12] = [
              f("Session history", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          e.held ? (a(), N(r(te), {
            key: 0,
            small: "",
            "data-agent-lift-hold": "",
            disabled: V.value,
            onClick: p
          }, {
            default: m(() => [...M[13] || (M[13] = [
              f("Lift this hold", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])) : k("", !0),
          Z.value ? (a(), s(H, { key: 1 }, [
            (se = e.row.job_command) != null && se.length ? (a(), N(r(te), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: V.value || W.value || !_.value,
              onClick: X
            }, {
              default: m(() => [...M[14] || (M[14] = [
                f("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0),
            e.row.role !== "main" ? (a(), N(r(te), {
              key: 1,
              small: "",
              "data-agent-driver": "",
              disabled: V.value || W.value,
              onClick: A
            }, {
              default: m(() => [...M[15] || (M[15] = [
                f("Change driver", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0),
            e.row.role !== "main" ? (a(), N(r(te), {
              key: 2,
              small: "",
              "data-agent-retire": "",
              disabled: V.value || W.value,
              onClick: M[0] || (M[0] = (G) => F("retire"))
            }, {
              default: m(() => [...M[16] || (M[16] = [
                f("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0)
          ], 64)) : k("", !0)
        ]),
        b(r(_e), { value: o.value }, {
          job: m(() => [
            b(Pt, {
              task: B.value,
              "onUpdate:task": M[1] || (M[1] = (G) => B.value = G),
              text: d.value,
              "onUpdate:text": M[2] || (M[2] = (G) => d.value = G),
              row: e.row,
              tasks: R.value,
              pending: V.value,
              loading: W.value,
              "more-tasks": D.value,
              failure: T.value,
              "job-ready": Q.value,
              onSubmit: U,
              onMore: x,
              onCancel: M[3] || (M[3] = (G) => F(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          driver: m(() => [
            b(Et, {
              program: g.value,
              "onUpdate:program": M[4] || (M[4] = (G) => g.value = G),
              model: $.value,
              "onUpdate:model": M[5] || (M[5] = (G) => $.value = G),
              pending: V.value,
              onSubmit: v,
              onCancel: M[6] || (M[6] = (G) => F(""))
            }, null, 8, ["program", "model", "pending"])
          ]),
          history: m(() => [
            b(ea, {
              sessions: P.value,
              onClose: M[7] || (M[7] = (G) => F(""))
            }, null, 8, ["sessions"])
          ]),
          retire: m(() => [
            b(Jt, {
              reason: n.value,
              "onUpdate:reason": M[8] || (M[8] = (G) => n.value = G),
              pending: V.value,
              onSubmit: I,
              onCancel: M[9] || (M[9] = (G) => F(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        T.value ? (a(), s("p", aa, u(T.value), 1)) : k("", !0),
        E.value ? (a(), s("p", na, u(E.value), 1)) : k("", !0)
      ], 32);
    };
  }
}, oa = /* @__PURE__ */ K(la, [["__scopeId", "data-v-8712e475"]]), sa = {
  class: "agent-command",
  "data-agent-command": ""
}, ra = {
  key: 1,
  "data-agent-stopped": ""
}, ia = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (l, t) => (a(), s("span", sa, [
      e.waitReason ? (a(), s("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: t[0] || (t[0] = ae((o) => r(we)("test_queue:0"), ["stop"]))
      }, [
        f("Waiting: " + u(e.waitReason) + " ", 1),
        b(r(qe), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), s("span", ra, "Waiting")) : (a(), N(r(vt), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, da = /* @__PURE__ */ K(ia, [["__scopeId", "data-v-1b371fb5"]]), ua = {
  key: 0,
  class: "lasting-facts",
  "data-agent-lasting-facts": ""
}, ca = { "data-agent-retired-at": "" }, ga = { key: 0 }, va = { "data-agent-retired-by": "" }, pa = {
  __name: "AgentLastingFacts",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    return (l, t) => e.row.retired_at ? (a(), s("dl", ua, [
      h("div", null, [
        t[0] || (t[0] = h("dt", null, "Retired", -1)),
        h("dd", ca, [
          b(r(Xe), {
            at: e.row.retired_at
          }, null, 8, ["at"])
        ])
      ]),
      e.row.retiring_actor_name ? (a(), s("div", ga, [
        t[1] || (t[1] = h("dt", null, "Retired by", -1)),
        h("dd", va, u(e.row.retiring_actor_name), 1)
      ])) : k("", !0)
    ])) : k("", !0);
  }
}, ma = /* @__PURE__ */ K(pa, [["__scopeId", "data-v-c5c81429"]]), ha = ["data-agent-delegated", "onClick"], fa = { class: "agent-task-number" }, ba = { class: "agent-task-title" }, ka = ["title"], ya = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const t = l;
    return (o, d) => (a(), N(r(Qe), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: d[0] || (d[0] = (n) => t("toggle"))
    }, {
      default: m(() => [
        (a(!0), s(H, null, ne(e.section.tasks, (n) => (a(), s("button", {
          key: n.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": n.id,
          onClick: (g) => r(we)(`tasks:${n.id}`)
        }, [
          b(r(pt), {
            status: n.state
          }, null, 8, ["status"]),
          h("span", fa, u(n.id), 1),
          h("span", ba, u(n.title), 1),
          n.plan_id ? (a(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${n.plan_id}: ${n.plan_title}`
          }, "Plan " + u(n.plan_id), 9, ka)) : k("", !0)
        ], 8, ha))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, wa = /* @__PURE__ */ K(ya, [["__scopeId", "data-v-ea4ccd6b"]]), Ma = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, $a = {
  key: 1,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, xa = ["data-peek", "onClick"], Sa = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ca = {
  key: 0,
  class: "agent-helper-brief"
}, Ta = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Aa = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, ja = {
  key: 2,
  class: "agent-summary"
}, Ba = "It ended without a report", La = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const l = e, t = c(() => [l.row.driver.top, `stops refused ${l.row.driver.stop_refusals}`, `tool calls refused ${l.row.driver.tool_refusals}`, ...l.row.driver.escalation_id ? [`escalation ${l.row.driver.escalation_id}`] : []].join(" · ")), o = ["started", "blocked", "open", "completed"], d = c(() => {
      var i, A;
      return l.row.ended_at && ((A = (i = l.facts) == null ? void 0 : i.job_returned) != null && A.startsWith(Ba)) ? l.facts.job_returned : "";
    }), n = c(() => l.tasks.length ? o.map((i) => ({ state: i, label: i.slice(0, 1).toUpperCase() + i.slice(1), tasks: l.tasks.filter((A) => A.state === i || i === "started" && A.state === "testing" || i === "completed" && A.state === "cancelled") })) : []), g = /* @__PURE__ */ new Set(["completed"]), $ = z({}), B = (i) => !($.value[i] ?? g.has(i)), R = (i) => $.value = { ...$.value, [i]: B(i) }, j = ze(), { rows: D } = j.props.reports;
    j.state["reports.agent"] = String(l.row.number);
    const W = c(() => l.row.access === "read-only"), V = ["tasks", "transcript", "terminal", "file-feed", "processes", "reports", "memories"], T = c(() => [...j.tabs].sort((i, A) => (V.indexOf(i.key) < 0 ? V.length : V.indexOf(i.key)) - (V.indexOf(A.key) < 0 ? V.length : V.indexOf(A.key)))), E = c(() => !!l.row.retired_at || l.row.state === "retired"), P = () => W.value || E.value ? T.value.find((i) => i.key === "transcript") : T.value[0], q = z(P());
    ge(q, (i) => {
      j.state.tab = (i == null ? void 0 : i.key) ?? "";
    }, { immediate: !0 }), je(() => {
      j.state.tab = "";
    }), ge(T, (i) => {
      i.some((A) => {
        var v;
        return A.key === ((v = q.value) == null ? void 0 : v.key);
      }) || (q.value = i[0]);
    }), ge(() => l.open, (i) => {
      i && (q.value = P());
    });
    const Z = Object.fromEntries(j.tabs.filter((i) => i.component).map((i) => [i.key, ot(() => mt(i.component))])), _ = z(!1), { data: Q } = j.props.tool, F = c(() => {
      var i;
      return ((i = Q.value) == null ? void 0 : i.tool) ?? "";
    }), X = c(() => {
      var i;
      return ((i = Q.value) == null ? void 0 : i.note) ?? "";
    }), x = c(() => l.row.role !== "main" && (!l.row.ended_at || l.stoppedWithWork || l.waitReason));
    async function p() {
      !l.open || !x.value || (j.state["tool.agent"] = String(l.row.number), await j.reload("tool"));
    }
    const Y = ht(p, ft.agentCommand), U = j.follow(["hook_call.*", "process_part.*"], (i) => bt(i, "session_agent_id", /* @__PURE__ */ new Set([l.row.id])) && Y());
    return je(() => U == null ? void 0 : U()), ge(() => l.open, (i) => {
      i && p();
    }, { immediate: !0 }), (i, A) => {
      var v;
      return a(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: A[2] || (A[2] = ae(() => {
        }, ["stop"]))
      }, [
        b(ma, { row: e.row }, null, 8, ["row"]),
        e.row.retirement_reason ? (a(), s("p", Ma, "Retirement reason: " + u(e.row.retirement_reason), 1)) : k("", !0),
        d.value ? (a(), s("p", $a, u(d.value), 1)) : k("", !0),
        b(r(kt), {
          class: "agent-tabs",
          tabs: T.value,
          active: q.value,
          answer: { tasks: e.tasks.length, reports: e.row.report_count ?? r(D).length, memories: e.row.memory_count ?? 0 },
          onChoose: A[0] || (A[0] = (I) => q.value = I)
        }, null, 8, ["tabs", "active", "answer"]),
        b(r(yt), {
          class: "agent-tab-body",
          tab: q.value,
          "data-agent-tab-body": (v = q.value) == null ? void 0 : v.key
        }, {
          default: m(() => {
            var I;
            return [
              b(r(_e), {
                value: (I = q.value) == null ? void 0 : I.key
              }, st({
                reports: m(() => [
                  r(D).length ? k("", !0) : (a(), N(r(Fe), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: m(() => [...A[3] || (A[3] = [
                      f("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (a(!0), s(H, null, ne(r(D), (y) => (a(), s("button", {
                    key: y.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${y.id}`,
                    onClick: (M) => r(we)(`messages:${y.id}`)
                  }, u(y.text), 9, xa))), 128))
                ]),
                tasks: m(() => {
                  var y;
                  return [
                    e.tasks.length ? k("", !0) : (a(), N(r(Fe), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: m(() => [...A[4] || (A[4] = [
                        f("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (a(!0), s(H, null, ne(n.value, (M) => (a(), N(wa, {
                      key: M.state,
                      section: M,
                      open: B(M.state),
                      onToggle: (se) => R(M.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (y = e.facts) != null && y.instruction ? (a(), s(H, { key: 1 }, [
                      A[5] || (A[5] = h("p", { class: "agent-label" }, "Instruction", -1)),
                      h("div", Sa, u(e.facts.instruction), 1)
                    ], 64)) : k("", !0)
                  ];
                }),
                transcript: m(() => {
                  var y;
                  return [
                    W.value ? (a(), s(H, { key: 0 }, [
                      (y = e.facts) != null && y.instruction ? (a(), s("div", Ca, [
                        b(r(Qe), {
                          label: "Instruction",
                          open: _.value,
                          "data-agent-section": "instruction",
                          onToggle: A[1] || (A[1] = (M) => _.value = !_.value)
                        }, {
                          default: m(() => [
                            h("div", Ta, u(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (a(), s("p", Aa, "No job recorded")) : k("", !0)
                    ], 64)) : k("", !0),
                    b(Rt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                ne(r(Z), (y, M) => ({
                  name: M,
                  fn: m(() => [
                    (a(), N(rt(y), {
                      agent: e.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ];
          }),
          _: 1
        }, 8, ["tab", "data-agent-tab-body"]),
        e.row.driver ? (a(), s("p", ja, u(t.value), 1)) : k("", !0),
        x.value ? (a(), N(da, {
          key: 3,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: F.value,
          note: X.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : k("", !0)
      ]);
    };
  }
}, Oa = /* @__PURE__ */ K(La, [["__scopeId", "data-v-b73b624e"]]), Ra = { class: "line" }, Ia = {
  key: 0,
  class: "line",
  "data-agent-since": ""
}, Va = {
  key: 1,
  class: "line",
  "data-agent-seen": ""
}, Ea = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" }, seen: { type: String, default: "" } },
  setup(e) {
    const l = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, o = c(() => l.has(t.state)), d = c(() => [t.doing, t.since, t.seen].filter(Boolean).join(". "));
    return (n, g) => (a(), N(r(ke), {
      as: "button",
      place: "corner",
      class: de(["agent-dot", { pulse: o.value }]),
      "data-state": e.state,
      "aria-label": d.value,
      "data-agent-status": "",
      onClick: g[0] || (g[0] = ae(() => {
      }, ["stop"]))
    }, {
      tip: m(() => [
        h("b", Ra, u(e.doing), 1),
        e.since ? (a(), s("span", Ia, u(e.since), 1)) : k("", !0),
        e.seen ? (a(), s("span", Va, u(e.seen), 1)) : k("", !0)
      ]),
      default: m(() => [
        g[1] || (g[1] = h("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, za = /* @__PURE__ */ K(Ea, [["__scopeId", "data-v-1a0bc478"]]), Na = ["title"], Ha = ["aria-label"], Wa = {
  class: "count",
  "data-plan-count": ""
}, Da = {
  __name: "PlanBar",
  props: { plan: { type: Number, required: !0 }, counts: { type: Object, required: !0 } },
  setup(e) {
    const l = e, t = (d) => `${l.counts.total ? d / l.counts.total * 100 : 0}%`, o = c(() => {
      const { completed: d, testing: n, started: g, total: $ } = l.counts;
      return `Plan ${l.plan}: ${d} completed, ${n} testing, ${g} started, ${$ - d - n - g} open`;
    });
    return (d, n) => e.counts.total ? (a(), s("span", {
      key: 0,
      class: "plan-bar",
      "data-plan-bar": "",
      title: o.value
    }, [
      h("span", {
        class: "track",
        role: "img",
        "aria-label": o.value,
        "data-plan-track": ""
      }, [
        h("span", {
          class: "part completed",
          "data-plan-completed": "",
          style: ye({ width: t(e.counts.completed) })
        }, null, 4),
        h("span", {
          class: "part testing",
          "data-plan-testing": "",
          style: ye({ width: t(e.counts.testing) })
        }, null, 4),
        h("span", {
          class: "part started",
          "data-plan-started": "",
          style: ye({ width: t(e.counts.started) })
        }, null, 4)
      ], 8, Ha),
      h("span", Wa, [
        h("b", null, u(e.counts.completed), 1),
        f(" of " + u(e.counts.total), 1)
      ])
    ], 8, Na)) : k("", !0);
  }
}, qa = /* @__PURE__ */ K(Da, [["__scopeId", "data-v-52c3b6c0"]]), Fa = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, Pa = (e) => e.filter((l) => l.state !== "cancelled"), We = (e, l) => e.filter((t) => t.state === l).length, Ua = 5, Ga = (e, l) => e || l.split(/\s+/).slice(0, Ua).join(" ");
function Ja({ tasks: e, inHand: l, perHour: t }) {
  const o = Pa(e), d = We(o, "completed"), n = Fa[l == null ? void 0 : l.state], g = o.filter((j) => j.state === "started").map((j) => ({ number: j.id, title: j.title })), $ = Math.max(g.length, l && l.state !== "completed" ? 1 : 0), B = o.length - d - $, R = d === o.length;
  return {
    number: l.id,
    title: l.title,
    started: g,
    plan: l.plan_id ?? 0,
    planTitle: l.plan_title ?? "",
    count: `${d} of ${o.length}`,
    taskTip: `${d} of its ${o.length} tasks done${n ? `. This one is ${n.words}.` : "."}`,
    countTip: R ? `All ${o.length} tasks done` : `${d} done, ${$} in hand, ${B} to go`,
    paceTip: !R && t ? `About ${t} an hour.` : "",
    rate: !R && t ? `${Math.round(t)}/hour` : "",
    bar: { total: o.length, done: d, testing: We(o, "testing"), started: We(o, "started") }
  };
}
const Ka = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, Za = {
  key: 0,
  class: "plan",
  "data-agent-job-launch": ""
}, Ya = {
  class: "task-line",
  "data-agent-task-line": ""
}, Xa = {
  key: 1,
  class: "tasks",
  "data-agent-tasks": ""
}, _a = {
  key: 2,
  class: "tasks",
  "data-agent-tasks": ""
}, Qa = {
  key: 4,
  class: "rate",
  "data-agent-rate": ""
}, en = { key: 0 }, tn = 3, an = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, jobTitle: { type: String, default: "" }, jobLaunch: { type: String, default: "" }, perHour: { type: Number, default: 0 }, countsEmpty: { type: Boolean, default: !1 }, planCounts: { type: Object, default: () => ({}) } },
  setup(e) {
    const l = e, t = c(() => l.inHand ? Ja({ tasks: l.tasks, inHand: l.inHand, perHour: l.perHour }) : null), o = c(() => {
      var d;
      return (d = t.value) != null && d.plan ? l.planCounts[t.value.plan] ?? null : null;
    });
    return (d, n) => e.job && !t.value ? (a(), s("span", Ka, [
      b(r(ke), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: m(() => [
          h("b", null, u(e.job), 1)
        ]),
        default: m(() => [
          f(u(r(Ga)(e.jobTitle, e.job)), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (a(), s("span", Za, u(e.jobLaunch), 1)) : k("", !0)
    ])) : t.value ? (a(), s(H, { key: 1 }, [
      h("span", Ya, [
        t.value.plan ? (a(), N(r(ke), {
          key: 0,
          as: "button",
          class: "task",
          "data-agent-plan": "",
          "data-peek": `plans:${t.value.plan}`,
          "aria-label": `Plan ${t.value.plan}: ${t.value.planTitle}`,
          onClick: n[0] || (n[0] = ae((g) => r(we)(`plans:${t.value.plan}`), ["stop"]))
        }, {
          tip: m(() => [
            h("b", null, u(t.value.planTitle), 1),
            h("span", null, "Task " + u(t.value.number) + ": " + u(t.value.title), 1)
          ]),
          default: m(() => [
            f("Plan " + u(t.value.plan), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])) : t.value.started.length > tn ? (a(), s("span", Xa, [
          b(r(ke), {
            as: "button",
            class: "task",
            "data-agent-task-count": "",
            "aria-label": `Tasks: ${t.value.started.length}`
          }, {
            tip: m(() => [
              (a(!0), s(H, null, ne(t.value.started, (g) => (a(), s("b", {
                key: g.number,
                class: "listed",
                "data-agent-task-listed": ""
              }, u(g.number) + " " + u(g.title), 1))), 128))
            ]),
            default: m(() => [
              f("Tasks: " + u(t.value.started.length), 1)
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : t.value.started.length > 1 ? (a(), s("span", _a, [
          n[2] || (n[2] = f("Tasks ", -1)),
          (a(!0), s(H, null, ne(t.value.started, (g, $) => (a(), s(H, {
            key: g.number
          }, [
            $ ? (a(), s(H, { key: 0 }, [
              f(", ")
            ], 64)) : k("", !0),
            b(r(ke), {
              as: "button",
              class: "task",
              "data-agent-task": "",
              "data-peek": `tasks:${g.number}`,
              "aria-label": `Task ${g.number}: ${g.title}`,
              onClick: ae((B) => r(we)(`tasks:${g.number}`), ["stop"])
            }, {
              tip: m(() => [
                h("b", null, u(g.title), 1)
              ]),
              default: m(() => [
                f(u(g.number), 1)
              ]),
              _: 2
            }, 1032, ["data-peek", "aria-label", "onClick"])
          ], 64))), 128))
        ])) : (a(), N(r(ke), {
          key: 3,
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${t.value.number}`,
          "aria-label": `Task ${t.value.number}: ${t.value.title}`,
          onClick: n[1] || (n[1] = ae((g) => r(we)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: m(() => [
            h("b", null, u(t.value.title), 1),
            h("span", null, u(t.value.taskTip), 1)
          ]),
          default: m(() => [
            f("Task " + u(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])),
        t.value.rate ? (a(), s("span", Qa, u(t.value.rate), 1)) : k("", !0),
        o.value ? (a(), N(qa, {
          key: 5,
          plan: t.value.plan,
          counts: o.value
        }, null, 8, ["plan", "counts"])) : (a(), N(r(ke), {
          key: 6,
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: m(() => [
            h("b", null, u(t.value.countTip), 1),
            t.value.paceTip ? (a(), s("span", en, u(t.value.paceTip), 1)) : k("", !0)
          ]),
          default: m(() => [
            f(u(t.value.count), 1)
          ]),
          _: 1
        }))
      ]),
      o.value ? k("", !0) : (a(), N(r(Ke), {
        key: 0,
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: t.value.bar.total,
        done: t.value.bar.done,
        testing: t.value.bar.testing,
        started: t.value.bar.started
      }, null, 8, ["total", "done", "testing", "started"]))
    ], 64)) : e.countsEmpty ? (a(), s(H, { key: 2 }, [
      n[3] || (n[3] = h("span", {
        class: "task-line",
        "data-agent-task-line": ""
      }, [
        h("span", {
          class: "task",
          "data-agent-no-task": ""
        }, "No task"),
        h("span", {
          class: "count",
          "data-agent-count": ""
        }, "0 of 0")
      ], -1)),
      b(r(Ke), {
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
}, nn = /* @__PURE__ */ K(an, [["__scopeId", "data-v-e5158129"]]), ln = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', on = ["data-icon", "stroke-width", "innerHTML"], oe = {
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
    }, d = {
      agent: ln,
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
      code: '<path d="M5.5 4.5 2 8l3.5 3.5M10.5 4.5 14 8l-3.5 3.5"/>',
      eye: '<path d="M1.9 8c1.5-2.6 3.5-3.9 6.1-3.9s4.6 1.3 6.1 3.9c-1.5 2.6-3.5 3.9-6.1 3.9S3.4 10.6 1.9 8Z"/><circle cx="8" cy="8" r="1.8"/>',
      dot: '<circle cx="8" cy="8" r="2.5"/>',
      start: '<path d="M5.5 3.8v8.4L12 8z" stroke-linejoin="round"/>',
      family: '<rect x="6" y="1.8" width="4" height="3.4" rx="1"/><rect x="1.8" y="10.8" width="4" height="3.4" rx="1"/><rect x="10.2" y="10.8" width="4" height="3.4" rx="1"/><path d="M8 5.2v2.6M3.8 10.8V9.4q0-1.6 1.6-1.6h5.2q1.6 0 1.6 1.6v1.4"/>',
      loop: '<path d="M12.6 6.2A4.9 4.9 0 0 0 3.4 6M3.4 9.8a4.9 4.9 0 0 0 9.2.2"/><path d="M12.8 3v3.3H9.5M3.2 13V9.7h3.3"/>'
    };
    return (n, g) => (a(), s("svg", {
      class: "ico",
      "data-icon": e.name,
      style: ye({
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
      innerHTML: d[o[e.name] || e.name] || d.dot
    }, null, 12, on));
  }
}, sn = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, rn = {
  key: 1,
  class: "menu-item-text"
}, dn = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (l, t) => (a(), s("button", {
      type: "button",
      class: de(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), s("span", sn, u(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (a(), s("span", rn, [
        h("span", null, [
          Be(l.$slots, "default", {}, void 0, !0)
        ]),
        h("small", null, u(e.description), 1)
      ])) : Be(l.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Ce = /* @__PURE__ */ K(dn, [["__scopeId", "data-v-fec99974"]]), un = {}, cn = { class: "menu-label" };
function gn(e, l) {
  return a(), s("span", cn, [
    Be(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Ae = /* @__PURE__ */ K(un, [["render", gn], ["__scopeId", "data-v-aa955b3e"]]), vn = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, pn = {
  key: 0,
  class: "skills-none"
}, mn = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: l }) {
    const t = e, o = l, d = c(() => t.skills.filter((g) => g.state === "loaded")), n = c(() => t.skills.filter((g) => g.state !== "loaded"));
    return (g, $) => (a(), s("div", vn, [
      b(Ae, null, {
        default: m(() => [...$[1] || ($[1] = [
          f("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      d.value.length ? k("", !0) : (a(), s("p", pn, "None yet. Compacting the conversation empties this list.")),
      (a(!0), s(H, null, ne(d.value, (B) => (a(), s("p", {
        key: B.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        b(oe, {
          name: "book",
          size: 12
        }),
        f(u(B.skill), 1)
      ]))), 128)),
      n.value.length ? (a(), s(H, { key: 1 }, [
        b(Ae, null, {
          default: m(() => [...$[2] || ($[2] = [
            f("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), s(H, null, ne(n.value, (B) => (a(), s("p", {
          key: B.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          b(oe, {
            name: "book",
            size: 12
          }),
          f(u(B.skill), 1)
        ]))), 128))
      ], 64)) : k("", !0),
      b(Ce, {
        "data-agent-skills-browse": "",
        onClick: $[0] || ($[0] = (B) => o("browse"))
      }, {
        default: m(() => [...$[3] || ($[3] = [
          f("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, hn = /* @__PURE__ */ K(mn, [["__scopeId", "data-v-be514d47"]]), fn = ["disabled", "title"], bn = { class: "gauge usage" }, kn = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: l }) {
    const t = e, o = l, d = c(() => t.windows[0] ?? null), n = c(() => d.value && Number.isFinite(d.value.used_percent) ? Math.max(0, Math.min(100, Math.round(d.value.used_percent))) : null), g = c(() => n.value !== null && n.value >= 100), $ = c(() => {
      var R;
      return (R = d.value) != null && R.reset_unix_seconds ? new Date(d.value.reset_unix_seconds * 1e3).toLocaleString() : "";
    }), B = c(() => g.value ? `At usage limit: the plan's ${d.value.title} allowance is used up${$.value ? `, starts again ${$.value}` : ""}` : `${n.value}% of the plan's ${d.value.title} allowance used${$.value ? `, starts again ${$.value}` : ""}`);
    return (R, j) => n.value !== null ? (a(), s("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: B.value,
      onClick: j[0] || (j[0] = (D) => o("open", D.currentTarget))
    }, [
      b(oe, {
        name: "allowance",
        size: 12
      }),
      j[1] || (j[1] = f()),
      h("span", bn, [
        h("span", {
          style: ye({ width: `${n.value}%` })
        }, null, 4)
      ]),
      f(" " + u(g.value ? "At usage limit" : `${n.value}%`), 1)
    ], 8, fn)) : k("", !0);
  }
}, yn = /* @__PURE__ */ K(kn, [["__scopeId", "data-v-8ee387a5"]]), wn = ["failed", "blocked", "problem", "update", "paused", "holding", "waiting", "asks"], tt = { danger: "failed", warn: "waiting" }, Mn = (e) => wn.includes(tt[e] ?? e), $n = (e) => Mn(e) ? ["badge", tt[e] ?? e] : ["badge-quiet"], xn = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (l, t) => (a(), s("span", {
      class: de(r($n)(e.tone))
    }, u(e.text), 3));
  }
}, Sn = /* @__PURE__ */ K(xn, [["__scopeId", "data-v-b7a33f3d"]]), Cn = (e, l, t) => Math.max(l, Math.min(t, e)), at = /* @__PURE__ */ new WeakMap(), Tn = (e, l) => at.set(e, l);
function An(e, l) {
  for (let t = l; t; t = at.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function jn(e, l) {
  const t = (o) => {
    var n, g;
    const d = ((n = e.value) == null ? void 0 : n.element) || ((g = e.value) == null ? void 0 : g.$el) || e.value;
    d && !An(d, o.target) && l(o);
  };
  window.addEventListener("click", t), je(() => window.removeEventListener("click", t));
}
const be = 8, Bn = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
  __name: "MenuPanel",
  props: {
    anchor: { type: Object, default: null },
    // a spot on the screen instead of an element: {x, y}, and flipX when it opens leftward from there (a submenu opens beside its item)
    point: { type: Object, default: null },
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
    const o = e, d = z(null), n = (v) => v ? `${v}px` : void 0, g = c(() => ({
      minWidth: n(o.minWidth),
      maxWidth: n(o.maxWidth),
      maxHeight: n(o.maxHeight),
      height: n(o.height)
    })), $ = z({ w: 0, h: 0 }), B = (v) => ({ left: v.x, right: v.flipX ?? v.x, top: v.y, bottom: v.y }), R = z(o.anchor ? o.anchor.getBoundingClientRect() : o.point ? B(o.point) : null), j = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), D = (v) => ({
      left: Math.max(0, v.left),
      top: Math.max(0, v.top),
      right: Math.min(window.innerWidth, v.right),
      bottom: Math.min(window.innerHeight, v.bottom)
    }), W = (v) => {
      const I = v.closest(".pane, .float-window");
      return I ? D(I.getBoundingClientRect()) : j();
    }, V = (v, I) => `${Math.max(0, v ? Math.min(v, I) : I)}px`;
    function T(v, I) {
      return {
        below: v.bottom - I.bottom - o.gap - be,
        above: I.top - v.top - o.gap - be,
        across: v.right - v.left - 2 * be
      };
    }
    function E(v) {
      if (!o.anchor) return j();
      const I = W(o.anchor), y = T(I, v);
      return $.value.w <= y.across && $.value.h <= Math.max(y.below, y.above) ? I : j();
    }
    const P = c(() => {
      if (!R.value) return g.value;
      const v = R.value, I = E(v), y = T(I, v), { w: M, h: se } = $.value, G = o.point ? v.left + M > I.right - be : o.align === "auto" ? v.left + v.right > I.left + I.right : o.align === "right", he = Cn(G ? v.right - M : v.left, I.left + be, Math.max(I.left + be, I.right - M - be)), Me = se > y.below && y.above > y.below ? { bottom: `${window.innerHeight - v.top + o.gap}px`, maxHeight: V(o.maxHeight, y.above) } : { top: `${v.bottom + o.gap}px`, maxHeight: V(o.maxHeight, y.below) };
      return { ...g.value, ...Me, left: `${he}px`, maxWidth: V(o.maxWidth, y.across) };
    }), q = t, Z = () => [...d.value.querySelectorAll("button:not(:disabled)")];
    function _(v) {
      const I = Z(), y = I.indexOf(document.activeElement);
      I[(y + v + I.length) % I.length].focus();
    }
    const Q = { ArrowDown: () => _(1), ArrowUp: () => _(-1), Escape: () => q("close") }, F = (v) => Q[v.key] && (v.preventDefault(), Q[v.key]()), X = () => d.value && ($.value = { w: d.value.offsetWidth, h: d.value.scrollHeight });
    let x = 0;
    const p = new ResizeObserver(() => {
      cancelAnimationFrame(x), x = requestAnimationFrame(X);
    });
    jn(d, (v) => o.anchor && !o.anchor.contains(v.target) && q("close"));
    const Y = (v, I) => ["top", "left", "right", "bottom"].some((y) => Math.abs(v[y] - I[y]) > 1), U = (v) => v.bottom < 0 || v.top > window.innerHeight;
    let i = 0;
    function A() {
      if (o.anchor) {
        const v = o.anchor.getBoundingClientRect();
        if (!o.anchor.isConnected || U(v)) return q("close");
        Y(v, R.value) && (R.value = v);
      }
      i = requestAnimationFrame(A);
    }
    return it(() => {
      o.anchor && d.value && Tn(d.value, o.anchor), X(), d.value && p.observe(d.value), !o.plain && Z()[0] && Z()[0].focus(), A();
    }), je(() => {
      p.disconnect(), cancelAnimationFrame(i), cancelAnimationFrame(x);
    }), l({ element: d }), (v, I) => (a(), N(dt, {
      to: "body",
      disabled: !e.anchor && !e.point
    }, [
      h("div", ut({
        ref_key: "panel",
        ref: d
      }, v.$attrs, {
        class: ["menu-panel", { anchored: e.anchor || e.point }],
        style: P.value,
        onKeydown: F
      }), [
        Be(v.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Ln = /* @__PURE__ */ K(Bn, [["__scopeId", "data-v-8094ec27"]]);
async function On(e, l, t) {
  if (!e) return t(l);
  const { target: o, fields: d } = e, n = Object.fromEntries(Object.keys(d).map((B) => [B, o[B]])), g = () => Object.assign(o, n);
  Object.assign(o, d);
  let $ = !1;
  try {
    const B = await t(l);
    return $ = B.ok, B;
  } finally {
    $ || g();
  }
}
function Rn(e, l, t, { groups: o, programs: d }) {
  const n = z({}), g = z(""), $ = z(!1), B = c(() => !!e.value && !e.value.ended_at), R = c(() => B.value && !!e.value.paused_at);
  async function j(T, E = null) {
    g.value = "";
    const P = await On(E, T, l);
    return g.value = P.ok ? "" : P.error, t(), P;
  }
  return { groups: o, programs: d, chosen: n, failure: g, asking: $, running: B, paused: R, choose: (T, E) => j(["agent", "control", String(e.value.number), T, E.value], { target: n, fields: { value: { ...n.value, [T]: E.label } } }), stop: () => ($.value = !1, j(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (T) => j(["agent", "launch", T.name]) };
}
function In(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const Vn = { compact: "Compaction", clear: "Clear" };
function En(e) {
  return e != null && e.is_open ? `${Vn[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
const zn = ["disabled", "title"], Nn = ["disabled", "title"], Hn = { class: "gauge" }, Wn = {
  key: 1,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
}, Dn = ["disabled", "title"], qn = ["disabled"], Fn = ["disabled"], Pn = {
  key: 5,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Un = ["title"], Gn = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Jn = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Kn = { class: "gauge" }, Zn = { class: "context-used" }, Yn = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, Xn = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, _n = 75, Qn = {
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
    const t = e, o = l, d = Rn(Ne(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => o("changed"), { groups: Ne(t, "controlGroups"), programs: Ne(t, "agentPrograms") }), n = z(null), g = z(""), $ = c(() => d.groups.value.find((x) => x.key === g.value));
    function B(x, p) {
      n.value = x.currentTarget, g.value = p;
    }
    function R() {
      n.value = null, g.value = "", d.asking.value = !1;
    }
    const j = c(() => t.skills.filter((x) => x.state === "loaded"));
    function D(x) {
      B(x, "skills"), o("skills");
    }
    const W = (x) => d.groups.value.some((p) => p.key === x), V = c(() => {
      var x;
      return d.chosen.value.model ?? ((x = E.value) == null ? void 0 : x.model) ?? "";
    }), T = c(() => {
      var x;
      return d.chosen.value.effort ?? ((x = E.value) == null ? void 0 : x.effort) ?? "";
    });
    c(() => !!t.agent && !t.agent.ended_at);
    const E = c(() => {
      var x;
      return ((x = t.usage.agents) == null ? void 0 : x.find((p) => {
        var Y;
        return p.id === ((Y = t.agent) == null ? void 0 : Y.id);
      })) ?? null;
    }), P = c(() => {
      var x;
      return ((x = E.value) == null ? void 0 : x.context_percent) == null ? null : Math.round(E.value.context_percent);
    }), q = c(() => {
      var x;
      return En(((x = E.value) == null ? void 0 : x.context_change) ?? null);
    }), Z = (x) => `${Math.round(x / 1e3)}k`, _ = c(() => {
      var x;
      return !!((x = E.value) != null && x.context_limit_tokens);
    }), Q = c(() => {
      var x, p;
      return ((x = E.value) == null ? void 0 : x.context_limit_tokens) || ((p = E.value) == null ? void 0 : p.context_window_tokens) || 0;
    }), F = c(() => Q.value ? `${Z(E.value.context_tokens ?? 0)} of ${Z(Q.value)}` : ""), X = c(() => {
      var x;
      return (x = E.value) != null && x.cost_dollars ? `$${E.value.cost_dollars.toFixed(2)}` : "";
    });
    return (x, p) => {
      var Y, U;
      return a(), s("div", {
        class: de(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (a(), s(H, { key: 0 }, [
          h("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: p[0] || (p[0] = (i) => B(i, "agent"))
          }, [
            b(oe, {
              name: "agents",
              size: 12
            }),
            f(" " + u(((Y = e.agentPrograms.find((i) => i.name === e.agent.program)) == null ? void 0 : Y.title) || e.agent.program), 1)
          ], 8, zn),
          b(yn, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: p[1] || (p[1] = (i) => o("open", "usage", i))
          }, null, 8, ["windows", "disabled"]),
          P.value !== null ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${P.value}% full: clear or compact it`,
            onClick: p[2] || (p[2] = (i) => W("context") ? B(i, "context") : o("open", "context", i.currentTarget))
          }, [
            b(oe, {
              name: "gauge",
              size: 12
            }),
            p[14] || (p[14] = f()),
            h("span", Hn, [
              h("span", {
                style: ye({ width: `${P.value}%` })
              }, null, 4)
            ]),
            f(" " + u(P.value) + "% ", 1)
          ], 8, Nn)) : (U = E.value) != null && U.context_unknown ? (a(), s("span", Wn, [
            b(oe, {
              name: "gauge",
              size: 12
            }),
            p[15] || (p[15] = f(" Context: unknown", -1))
          ])) : k("", !0),
          V.value ? (a(), s("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${V.value}: change the model`,
            onClick: p[3] || (p[3] = (i) => W("model") ? B(i, "model") : null)
          }, [
            b(oe, {
              name: "model",
              size: 12
            }),
            f(" " + u(V.value), 1)
          ], 8, Dn)) : k("", !0),
          W("effort") || e.card && T.value ? (a(), s("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: p[4] || (p[4] = (i) => B(i, "effort"))
          }, [
            b(oe, {
              name: "bolt",
              size: 12
            }),
            f(" " + u(T.value), 1)
          ], 8, qn)) : k("", !0),
          X.value ? (a(), s("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: p[5] || (p[5] = (i) => o("open", "cost", i.currentTarget))
          }, u(X.value), 9, Fn)) : k("", !0),
          e.branch ? (a(), s("span", Pn, [
            b(oe, {
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
            onClick: p[6] || (p[6] = (i) => o("open", "jobs", i.currentTarget))
          }, [
            b(oe, {
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
            onClick: D
          }, [
            b(oe, {
              name: "book",
              size: 12
            }),
            f(" " + u(j.value.length), 1)
          ])) : k("", !0),
          e.fitness ? (a(), s(H, { key: 8 }, [
            h("button", {
              type: "button",
              class: de(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < _n }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: p[7] || (p[7] = (i) => o("open", "fitness", i.currentTarget))
            }, [
              b(oe, {
                name: "heart",
                size: 12
              }),
              f(" " + u(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            h("button", {
              type: "button",
              class: de(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: p[8] || (p[8] = (i) => o("open", "load", i.currentTarget))
            }, [
              b(oe, {
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
          onClick: p[9] || (p[9] = (i) => B(i, "start"))
        }, [
          b(oe, {
            name: "agents",
            size: 12
          }),
          p[16] || (p[16] = f(" Start an agent", -1))
        ])) : k("", !0),
        p[22] || (p[22] = h("span", { class: "space" }, null, -1)),
        r(d).failure.value ? (a(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: r(d).failure.value
        }, u(r(d).failure.value), 9, Un)) : k("", !0),
        Be(x.$slots, "default", {}, void 0, !0),
        n.value ? (a(), N(Ln, {
          key: 3,
          anchor: n.value,
          "min-width": 190,
          onClose: R
        }, {
          default: m(() => {
            var i;
            return [
              g.value === "agent" ? (a(), s(H, { key: 0 }, [
                r(d).asking.value ? (a(), s(H, { key: 0 }, [
                  b(Ae, { "data-agent-stop-ask": "" }, {
                    default: m(() => [...p[17] || (p[17] = [
                      f("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  b(Ce, {
                    "data-agent-stop-confirm": "",
                    onClick: p[10] || (p[10] = (A) => (R(), r(d).stop()))
                  }, {
                    default: m(() => [...p[18] || (p[18] = [
                      f("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  b(Ce, {
                    onClick: p[11] || (p[11] = (A) => r(d).asking.value = !1)
                  }, {
                    default: m(() => [...p[19] || (p[19] = [
                      f("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (a(), N(Ce, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: p[12] || (p[12] = (A) => r(d).asking.value = !0)
                }, {
                  default: m(() => [...p[20] || (p[20] = [
                    f("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : g.value === "start" ? (a(), s(H, { key: 1 }, [
                b(Ae, null, {
                  default: m(() => [...p[21] || (p[21] = [
                    f("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (a(!0), s(H, null, ne(r(d).programs.value, (A) => (a(), N(Ce, {
                  key: A.name,
                  "data-agent-program": A.name,
                  onClick: (v) => (R(), r(d).start(A))
                }, {
                  default: m(() => [
                    f(u(A.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : g.value === "skills" ? (a(), N(hn, {
                key: 2,
                skills: e.skills,
                onBrowse: p[13] || (p[13] = (A) => (R(), o("open", "skills", null)))
              }, null, 8, ["skills"])) : $.value ? (a(), s(H, { key: 3 }, [
                b(Ae, null, {
                  default: m(() => [
                    f(u($.value.label), 1)
                  ]),
                  _: 1
                }),
                g.value === "context" ? (a(), s(H, { key: 0 }, [
                  h("p", Gn, u(r(In)(((i = E.value) == null ? void 0 : i.last_compaction) ?? null)), 1),
                  h("div", Jn, [
                    h("span", Kn, [
                      h("span", {
                        style: ye({ width: `${P.value}%` })
                      }, null, 4)
                    ]),
                    h("span", Zn, u(P.value) + "%", 1)
                  ]),
                  F.value ? (a(), s("p", Yn, [
                    f(u(F.value) + " ", 1),
                    _.value ? (a(), N(Sn, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : k("", !0)
                  ])) : k("", !0)
                ], 64)) : k("", !0),
                g.value === "context" && q.value ? (a(), s("p", Xn, u(q.value), 1)) : (a(!0), s(H, { key: 2 }, ne($.value.choices, (A) => (a(), N(Ce, {
                  key: A.value,
                  "data-agent-choice": A.value,
                  onClick: (v) => (r(d).choose($.value.key, A), R())
                }, {
                  default: m(() => [
                    f(u(A.label), 1)
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
}, el = /* @__PURE__ */ K(Qn, [["__scopeId", "data-v-d7113347"]]), tl = ["data-agent-open", "aria-expanded", "role", "tabindex"], al = {
  class: "agent-head",
  "data-agent-head": ""
}, nl = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, ll = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, ol = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, sl = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, rl = {
  key: 0,
  class: "agent-menu",
  "data-agent-menu-panel": ""
}, il = {
  key: 1,
  class: "agent-line"
}, dl = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, ul = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, cl = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, gl = {
  key: 3,
  class: "agent-unit",
  "data-agent-unit": ""
}, vl = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), o = ["completed", "testing"], d = { running: "Working", starting: "Starting", stopping: "Stopping", ended: "Idle: its process has stopped", failed: "Could not start", never_started: "Not started" }, n = e, g = l, $ = et(), B = z(!1), R = c(() => wt(n.row, n.facts)), j = c(() => {
      var w;
      return ((w = n.facts) == null ? void 0 : w.tasks) ?? [];
    }), D = c(() => j.value.filter((w) => w.state === "open")), W = c(() => j.value.find((w) => {
      var L;
      return w.id === ((L = n.progress) == null ? void 0 : L.task_id) && w.state === "started";
    })), V = c(() => W.value || j.value.find((w) => {
      var L;
      return w.id === ((L = n.facts) == null ? void 0 : L.task_id);
    }) || j.value.find((w) => t.has(w.state)) || D.value[0] || j.value.at(-1)), T = c(() => {
      var w, L, ue, re, le, pe;
      return n.row.role === "helper" ? ((w = n.facts) == null ? void 0 : w.helper_job) || "" : (L = n.facts) != null && L.job_enabled && (((ue = W.value) == null ? void 0 : ue.title) || ((re = n.facts) == null ? void 0 : re.task_title) || ((le = D.value[0]) == null ? void 0 : le.title) || ((pe = j.value.at(-1)) == null ? void 0 : pe.title)) || "";
    }), E = c(() => Mt(n.row)), P = c(() => {
      var w, L;
      return [n.row.program, (w = n.facts) == null ? void 0 : w.model, (L = n.facts) == null ? void 0 : L.effort, E.value].filter(Boolean).join(" · ");
    }), q = ze(), Z = /* @__PURE__ */ new Set(["open", "started", "testing"]), _ = { fresh: "new conversation", resumed: "resumed" }, Q = c(() => {
      var w, L;
      return [(w = n.facts) == null ? void 0 : w.helper_job_program, _[(L = n.facts) == null ? void 0 : L.occupant_launch]].filter(Boolean).join(", ");
    }), F = c(() => {
      var w;
      return (w = n.facts) == null ? void 0 : w.work_status;
    }), X = c(() => !!n.row.ended_at && n.row.role !== "main" && j.value.some((w) => Z.has(w.state))), x = c(() => {
      var w, L;
      return n.row.state === "running" && ((w = n.facts) == null ? void 0 : w.state) === "at usage limit" && !!((L = n.facts) != null && L.usage_limit_ends_at);
    }), p = (w) => new Date(w).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), Y = c(() => n.row.halted_at ? `Stopped at the usage limit since ${p(n.row.halted_at)}, goes on at ${p(n.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(n.facts.usage_limit_ends_at).toLocaleString()}`), U = c(() => {
      var w;
      return n.row.retired_at || n.row.state === "retired" ? "retired" : x.value || F.value || n.waitReason || X.value ? "waiting" : n.row.state === "running" && ((w = n.facts) == null ? void 0 : w.state) || n.row.state;
    }), i = c(() => {
      var w;
      return x.value ? Y.value : F.value ? `Status: ${F.value}` : n.waitReason ? `Waiting: ${n.waitReason}` : U.value === "blocked" ? (w = n.facts) != null && w.blocked_reason ? `Blocked: ${n.facts.blocked_reason}` : "Blocked" : X.value ? "Stopped with work left" : "";
    }), A = c(() => {
      var w;
      return ((w = n.progress) == null ? void 0 : w.completed_count) ?? j.value.filter((L) => o.includes(L.state)).length;
    }), v = c(() => {
      var w;
      return $t(A.value, ((w = n.progress) == null ? void 0 : w.started_at) || n.row.created_at, n.progress ? n.progress.finished_at : n.row.ended_at, $.value);
    }), I = c(() => n.row.role === "main" ? 0 : v.value), y = c(() => !!n.row.retired_at || n.row.state === "retired"), M = c(() => y.value ? "Retired" : U.value === "blocked" || U.value === "waiting" ? i.value || (U.value === "blocked" ? "Blocked" : "Waiting") : d[n.row.standing]), se = c(() => {
      var L;
      if (y.value) return n.row.retired_at;
      const w = U.value === "blocked" || U.value === "waiting";
      return n.row.ended_at || w && ((L = n.facts) == null ? void 0 : L.last_activity) || n.row.process_started_at || n.row.created_at;
    }), G = c(() => !!n.row.ended_at || y.value), he = (w, L) => async ({ say: ue }) => {
      const re = await q.run(["agent", ...w, String(n.row.number)]);
      ue(re.ok ? `${R.value} ${L}` : re.error);
    }, ee = () => ({
      head: R.value,
      items: [
        { label: "Open", group: "open", disabled: n.open, reason: "Already open", run: () => g("toggle") },
        { label: n.row.paused_at ? "Resume" : "Pause", group: "open", disabled: G.value, reason: "Process stopped", run: he([n.row.paused_at ? "resume" : "pause"], n.row.paused_at ? "resumed" : "paused") },
        { label: "Copy name", group: "copy", run: ({ say: w }) => At(R.value, "the name", w) },
        { label: "Open its task", group: "copy", disabled: !V.value, reason: "No task", run: () => we(`tasks:${V.value.id}`) },
        { label: "Stop", danger: !0, disabled: G.value || n.row.role === "main", reason: G.value ? "Process stopped" : "The main agent", run: he(["stop"], "stopped") }
      ]
    }), Me = c(() => xt(se.value, $.value)), ve = c(() => {
      var w;
      return St((w = n.facts) == null ? void 0 : w.last_activity, $.value);
    });
    return (w, L) => {
      var ue, re, le, pe, Le, Oe, Te;
      return ct((a(), s("div", {
        class: de(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: L[2] || (L[2] = (ce) => !e.open && g("toggle")),
        onKeydown: [
          L[3] || (L[3] = Ge(ae((ce) => !e.open && g("toggle"), ["self", "prevent"]), ["enter"])),
          L[4] || (L[4] = Ge(ae((ce) => !e.open && g("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        h("div", al, [
          e.open ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back",
            "aria-label": "Back",
            onClick: L[0] || (L[0] = ae((ce) => g("toggle"), ["stop"]))
          }, [
            b(r(qe), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : k("", !0),
          e.open ? (a(), s(H, { key: 1 }, [
            h("span", nl, u(R.value.title), 1),
            h("span", ll, u(R.value.subtext), 1),
            b(r(te), {
              variant: "ghost",
              small: "",
              class: "agent-menu-button",
              "data-agent-menu": "",
              "aria-expanded": B.value,
              onClick: L[1] || (L[1] = ae((ce) => B.value = !B.value, ["stop"]))
            }, {
              default: m(() => [...L[5] || (L[5] = [
                f("Actions", -1)
              ])]),
              _: 1
            }, 8, ["aria-expanded"])
          ], 64)) : (a(), s(H, { key: 2 }, [
            b(r(Ct), {
              "agent-id": e.row.id,
              label: R.value.text,
              class: "agent-who"
            }, {
              default: m(() => [
                h("span", ol, u(R.value.title), 1),
                h("span", sl, u(R.value.subtext), 1)
              ]),
              _: 1
            }, 8, ["agent-id", "label"]),
            b(r(qe), {
              class: "agent-chevron",
              name: "chevronRight",
              size: 12
            })
          ], 64))
        ]),
        e.open && B.value ? (a(), s("div", rl, [
          b(oa, {
            row: e.row,
            held: U.value === "blocked"
          }, null, 8, ["row", "held"])
        ])) : k("", !0),
        e.open ? k("", !0) : (a(), s("span", il, [
          h("span", dl, u(P.value), 1),
          (ue = e.facts) != null && ue.sandbox_off ? (a(), s("span", ul, "sandbox off")) : k("", !0)
        ])),
        e.open && !y.value ? (a(), N(el, {
          key: 2,
          class: "agent-live",
          "agent-programs": r(q).props.programs.rows.value,
          agent: e.row,
          branch: (re = e.progress) == null ? void 0 : re.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((le = e.facts) == null ? void 0 : le.windows) ?? [] },
          card: ""
        }, {
          default: m(() => {
            var ce;
            return [
              (ce = e.facts) != null && ce.sandbox_off ? (a(), s("span", cl, "sandbox off")) : k("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : k("", !0),
        !e.open && ((pe = e.facts) != null && pe.unit_name) ? (a(), s("div", gl, "Unit: " + u(e.facts.unit_name), 1)) : k("", !0),
        e.open ? k("", !0) : (a(), N(nn, {
          key: 4,
          tasks: j.value,
          "in-hand": e.row.role !== "helper" && ((Le = e.facts) != null && Le.job_enabled) && V.value || null,
          job: e.row.role === "helper" ? T.value : "",
          "job-title": e.row.role === "helper" && ((Oe = e.facts) == null ? void 0 : Oe.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? Q.value : "",
          "per-hour": I.value,
          "counts-empty": e.row.role === "worker",
          "plan-counts": ((Te = e.facts) == null ? void 0 : Te.plan_counts) ?? {}
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour", "counts-empty", "plan-counts"])),
        b(za, {
          state: U.value,
          doing: M.value,
          since: Me.value,
          seen: ve.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (a(), N(Oa, {
          key: 5,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: j.value,
          "stopped-with-work": X.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : k("", !0)
      ], 42, tl)), [
        [r(Tt), ee]
      ]);
    };
  }
}, pl = /* @__PURE__ */ K(vl, [["__scopeId", "data-v-bc86a7b0"]]), Ee = (e) => e.state === "running" && !!e.ended_at, ml = (e) => [...e.filter((l) => !Ee(l)), ...e.filter(Ee)], hl = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, fl = ["data-agent-row", "data-agent-lingering", "data-agent-waiting"], Ze = "journal.agents.filters", Ye = 300 * 1e3, Ve = "cubic-bezier(0.2, 0.9, 0.25, 1)", bl = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const l = e, t = ze(), { rows: o } = t.props.waits, { rows: d } = t.props.progress, { rows: n, failure: g, loaded: $, more: B } = t.props.agents, R = (C) => d.value.find((O) => O.agent_id === C.id) ?? null, j = (C) => {
      var O;
      return ((O = o.value.find((S) => S.agent_id === C.id)) == null ? void 0 : O.reason) ?? "";
    }, D = z("running"), W = z(""), V = JSON.parse(localStorage.getItem(Ze) || '{"roles":[],"profiles":[],"programs":[]}'), T = z(V), E = c(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: P } = t.props.programs, q = c(() => T.value.roles.length + T.value.profiles.length + T.value.programs.length), Z = (C, O) => {
      T.value = Ot(T.value, C, O);
    }, _ = () => {
      T.value = { roles: [], profiles: [], programs: [] };
    }, Q = (C) => C.slice(0, 1).toUpperCase() + C.slice(1);
    ge(T, (C) => localStorage.setItem(Ze, JSON.stringify(C)));
    const F = z(25);
    function X() {
      Object.assign(t.state, {
        "agents.show": D.value,
        "agents.search": W.value,
        "agents.limit": String(F.value),
        "agents.roles": T.value.roles.join(","),
        "agents.profiles": T.value.profiles.join(","),
        "agents.programs": T.value.programs.join(",")
      });
    }
    async function x() {
      return F.value += 25, X(), await t.reload("agents"), !0;
    }
    ge([D, W, T], () => {
      F.value = 25, X(), t.reload("agents");
    }), X();
    const p = (C) => C.facts ?? null, Y = n, U = et(), i = z([]), A = c(() => new Set(i.value.filter((C) => U.value - C.left < Ye).map((C) => C.row.id))), v = c(() => i.value.filter((C) => A.value.has(C.row.id)).map((C) => C.row)), I = c(() => [...ml(Y.value), ...v.value]);
    let y = "", M = [];
    async function se(C) {
      await t.reload(`card.${C.id}`);
      const O = t.props[`card.${C.id}`].rows.value.find((S) => S.id === C.id);
      O != null && O.ended_at && !i.value.some((S) => S.row.id === C.id) && (i.value = [...i.value, { row: O, left: Date.now() }]);
    }
    ge(n, (C) => {
      const O = y === `${D.value}|${W.value}|${JSON.stringify(T.value)}` && D.value === "running", S = O ? M.filter((J) => !C.some(($e) => $e.id === J.id)) : [];
      y = `${D.value}|${W.value}|${JSON.stringify(T.value)}`, M = C, i.value = O ? i.value.filter((J) => U.value - J.left < Ye && !C.some(($e) => $e.id === J.row.id)) : [], S.forEach(se);
    }, { immediate: !0 });
    const G = c(() => !!W.value.trim() || q.value > 0), he = c(() => l.texts[D.value] ?? { title: l.empty, hint: "" }), ee = z(null), Me = z(null), ve = z(null), w = z(null), L = c(() => ee.value === null ? null : t.props[`card.${ee.value}`].rows.value.find((C) => C.id === ee.value) ?? Me.value), ue = c(() => L.value ? [L.value] : I.value), re = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, le = z(!1);
    let pe = 0;
    const Le = (C) => [...C.attributes].map((O) => O.name).find((O) => O.startsWith("data-agent-") && O !== "data-agent-motion") ?? "";
    async function Oe(C) {
      if (le.value) return;
      le.value = !0, pe = w.value.scrollTop;
      const O = ve.value.querySelector(`[data-agent-open="${C.id}"]`);
      if (!re()) {
        const xe = [...ve.value.querySelectorAll(".agent-row")].filter((me) => !me.contains(O));
        await Promise.all(xe.map((me) => me.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const S = [...O.querySelectorAll(".agent-head, .agent-line")], J = [...S, ...O.querySelectorAll("[data-agent-motion]")], $e = J.map(Le), Re = J.map((xe) => xe.getBoundingClientRect());
      if (Me.value = C, ee.value = C.id, t.reload(`card.${C.id}`), await Je(), !re()) {
        const xe = J.map((ie, fe) => ie.isConnected ? ie : $e[fe] ? O.querySelector(`[${$e[fe]}]`) : null), me = xe.map((ie) => ie == null ? void 0 : ie.getBoundingClientRect());
        xe.forEach((ie, fe) => {
          if (!ie) return;
          const Se = S.findIndex((Ue) => Ue !== ie && Ue.contains(ie)), nt = Re[fe].left - me[fe].left - (Se < 0 ? 0 : Re[Se].left - me[Se].left), lt = Re[fe].top - me[fe].top - (Se < 0 ? 0 : Re[Se].top - me[Se].top);
          ie.animate([{ transform: `translate(${nt}px, ${lt}px)` }, { transform: "none" }], { duration: 280, easing: Ve });
        }), ve.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((ie) => {
          ie.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Ve, fill: "backwards" });
        });
      }
      le.value = !1;
    }
    async function Te() {
      if (le.value || !L.value) return;
      le.value = !0;
      const C = ve.value.querySelector(`[data-agent-open="${ee.value}"]`), O = [...C.children], S = re() ? [] : O.map((J) => J.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(S.map((J) => J.finished)), ee.value = null, await Je(), w.value.scrollTop = pe, S.forEach((J) => J.cancel()), re() || (C.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Ve }), ve.value.querySelectorAll(".agent-row").forEach((J) => {
        J.contains(C) || J.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Ve });
      })), le.value = !1;
    }
    const ce = (C) => ee.value === C.id ? Te() : Oe(C);
    ge(W, (C) => C.trim() && (ee.value = null)), ge(D, () => {
      ee.value = null;
    });
    const Pe = (C) => {
      C.key === "Escape" && Te();
    };
    return window.addEventListener("keydown", Pe), je(() => window.removeEventListener("keydown", Pe)), (C, O) => (a(), s("div", {
      ref_key: "agents",
      ref: ve,
      class: de(["agents", { focused: L.value, "card-changing": le.value }])
    }, [
      L.value ? k("", !0) : (a(), N(r(jt), {
        key: 0,
        modelValue: W.value,
        "onUpdate:modelValue": O[1] || (O[1] = (S) => W.value = S),
        placeholder: "Search agents",
        "menu-count": q.value,
        "data-agents-search": ""
      }, {
        menu: m(() => [
          b(r(He), null, {
            default: m(() => [...O[2] || (O[2] = [
              f("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(H, null, ne(E.value.roles, (S) => (a(), N(r(Ie), {
            key: S,
            role: "menuitemcheckbox",
            "aria-checked": T.value.roles.includes(S),
            checked: T.value.roles.includes(S),
            "data-filter-role": S,
            onClick: (J) => Z("roles", S)
          }, {
            default: m(() => [
              f(u(Q(S)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          E.value.profiles.length ? (a(), N(r(He), { key: 0 }, {
            default: m(() => [...O[3] || (O[3] = [
              f("Profile", -1)
            ])]),
            _: 1
          })) : k("", !0),
          (a(!0), s(H, null, ne(E.value.profiles, (S) => (a(), N(r(Ie), {
            key: S.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.profiles.includes(S.name),
            checked: T.value.profiles.includes(S.name),
            "data-filter-profile": S.name,
            onClick: (J) => Z("profiles", S.name)
          }, {
            default: m(() => [
              f(u(S.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          b(r(He), null, {
            default: m(() => [...O[4] || (O[4] = [
              f("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(H, null, ne(r(P), (S) => (a(), N(r(Ie), {
            key: S.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.programs.includes(S.name),
            checked: T.value.programs.includes(S.name),
            "data-filter-program": S.name,
            onClick: (J) => Z("programs", S.name)
          }, {
            default: m(() => [
              f(u(S.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          q.value ? (a(), N(r(Ie), {
            key: 1,
            "data-filter-clear": "",
            onClick: _
          }, {
            default: m(() => [...O[5] || (O[5] = [
              f("Clear filters", -1)
            ])]),
            _: 1
          })) : k("", !0)
        ]),
        default: m(() => [
          b(r(Bt), {
            options: E.value.states,
            value: D.value,
            onPick: O[0] || (O[0] = (S) => D.value = S)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      D.value === "retired" && E.value.upgrade_retired ? (a(), s("p", hl, "Retired during the upgrade: " + u(E.value.upgrade_retired), 1)) : k("", !0),
      h("div", {
        ref_key: "list",
        ref: w,
        class: de(["agents-view", { "agents-view-open": L.value }])
      }, [
        r($) && !r(g) && !ue.value.length && q.value ? (a(), N(r(Fe), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: m(() => [
            b(r(te), {
              small: "",
              "data-empty-clear": "",
              onClick: _
            }, {
              default: m(() => [...O[6] || (O[6] = [
                f("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), N(r(Lt), {
          key: 1,
          moves: "",
          "leaves-at-once": le.value,
          rows: ue.value,
          failure: r(g),
          loaded: r($),
          more: !L.value && r(B),
          older: x,
          empty: he.value.title,
          hint: he.value.hint,
          searching: G.value
        }, {
          default: m(({ row: S }) => [
            h("div", {
              class: de(["agent-row", { lingering: A.value.has(S.id) && S.id !== ee.value, waiting: r(Ee)(S) && S.id !== ee.value }]),
              "data-agent-row": S.id,
              "data-agent-lingering": A.value.has(S.id) ? "" : null,
              "data-agent-waiting": r(Ee)(S) ? "" : null
            }, [
              b(pl, {
                row: S,
                facts: p(S),
                progress: R(S),
                "wait-reason": j(S),
                open: S.id === ee.value,
                onToggle: (J) => ce(S)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, fl)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, Ml = /* @__PURE__ */ K(bl, [["__scopeId", "data-v-a5aec75b"]]);
export {
  Ml as A
};
