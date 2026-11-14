import { openBlock as a, createElementBlock as s, withModifiers as ae, createElementVNode as m, createVNode as f, unref as r, withCtx as p, createTextVNode as h, Fragment as D, renderList as ne, toDisplayString as d, createBlock as z, createCommentVNode as k, ref as E, computed as c, watch as ve, onUnmounted as Ae, defineAsyncComponent as ot, createSlots as st, resolveDynamicComponent as rt, normalizeClass as ue, normalizeStyle as be, renderSlot as je, onMounted as it, Teleport as dt, mergeProps as ut, toRef as ze, withDirectives as ct, withKeys as Ue, nextTick as Ge } from "vue";
import { TextInput as We, Btn as te, TextArea as gt, TimeAgo as Ye, useWindow as Ee, SwitchCase as Xe, peekRef as ke, Icon as De, RunningCommand as vt, FoldGroup as Qe, TaskStatusIcon as pt, loadWindowComponent as mt, coalesced as ht, READ_RATES as ft, eventMayBeChildOf as bt, InnerTabs as kt, TabBody as yt, EmptyState as qe, HoverTip as fe, TaskBar as Je, useNow as _e, agentTitle as wt, agentNumber as Mt, perHour as $t, sinceWords as xt, seenWords as St, AgentTip as Ct, vContext as Tt, copying as At, SearchBar as jt, Segmented as Bt, MenuLabel as Ne, MenuItem as Ie, RowList as Lt, toggleFilter as Ot } from "@journal/window-kit";
import { _ as Z, T as Rt } from "./TranscriptRows-Crmxs6Un.js";
const It = { class: "action-buttons" }, Vt = {
  __name: "AgentDriverForm",
  props: { program: String, model: String, pending: Boolean },
  emits: ["submit", "cancel", "update:program", "update:model"],
  setup(e) {
    return (l, t) => (a(), s("form", {
      "data-agent-driver-form": "",
      onSubmit: t[3] || (t[3] = ae((o) => l.$emit("submit"), ["prevent"]))
    }, [
      t[6] || (t[6] = m("p", null, "Starts the next session on this program; the agent keeps its number and memories.", -1)),
      f(r(We), {
        "model-value": e.program,
        label: "Program",
        disabled: e.pending,
        "data-agent-driver-program": "",
        "onUpdate:modelValue": t[0] || (t[0] = (o) => l.$emit("update:program", o))
      }, null, 8, ["model-value", "disabled"]),
      f(r(We), {
        "model-value": e.model,
        label: "Model",
        disabled: e.pending,
        "data-agent-driver-model": "",
        "onUpdate:modelValue": t[1] || (t[1] = (o) => l.$emit("update:model", o))
      }, null, 8, ["model-value", "disabled"]),
      m("div", It, [
        f(r(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.program.trim() || !e.model.trim(),
          "data-agent-confirm-driver": ""
        }, {
          default: p(() => [...t[4] || (t[4] = [
            h("Change the driver", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        f(r(te), {
          small: "",
          disabled: e.pending,
          onClick: t[2] || (t[2] = (o) => l.$emit("cancel"))
        }, {
          default: p(() => [...t[5] || (t[5] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Et = /* @__PURE__ */ Z(Vt, [["__scopeId", "data-v-c138a4da"]]), zt = { class: "action-field" }, Nt = ["value", "disabled"], Ht = ["value"], Wt = { key: 1 }, Dt = {
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
      e.row.job_task_flag ? (a(), s(D, { key: 0 }, [
        m("label", zt, [
          t[6] || (t[6] = h("Task ", -1)),
          m("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: t[0] || (t[0] = (o) => l.$emit("update:task", o.target.value))
          }, [
            t[5] || (t[5] = m("option", { value: "" }, "Choose an open task", -1)),
            (a(!0), s(D, null, ne(e.tasks, (o) => (a(), s("option", {
              key: o.id,
              value: String(o.id)
            }, d(o.id) + ": " + d(o.title), 9, Ht))), 128))
          ], 40, Nt)
        ]),
        e.moreTasks ? (a(), z(r(te), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: t[1] || (t[1] = (o) => l.$emit("more"))
        }, {
          default: p(() => [...t[7] || (t[7] = [
            h("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : k("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (a(), s("p", Wt, "No open tasks.")) : k("", !0)
      ], 64)) : (a(), s("label", Dt, [
        t[8] || (t[8] = h("Job", -1)),
        f(r(gt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (o) => l.$emit("update:text", o.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      m("div", qt, [
        f(r(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: p(() => [...t[9] || (t[9] = [
            h("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        f(r(te), {
          small: "",
          disabled: e.pending,
          onClick: t[3] || (t[3] = (o) => l.$emit("cancel"))
        }, {
          default: p(() => [...t[10] || (t[10] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Pt = /* @__PURE__ */ Z(Ft, [["__scopeId", "data-v-adde4158"]]), Ut = { class: "action-buttons" }, Gt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (l, t) => (a(), s("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = ae((o) => l.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = m("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      f(r(We), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (o) => l.$emit("update:reason", o))
      }, null, 8, ["model-value", "disabled"]),
      m("div", Ut, [
        f(r(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: p(() => [...t[3] || (t[3] = [
            h("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        f(r(te), {
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (o) => l.$emit("cancel"))
        }, {
          default: p(() => [...t[4] || (t[4] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Jt = /* @__PURE__ */ Z(Gt, [["__scopeId", "data-v-92de7dd6"]]), Kt = {
  class: "session-history",
  "data-agent-session-history": ""
}, Zt = { key: 0 }, Yt = { key: 0 }, Xt = { "data-agent-session-state": "" }, Qt = { class: "action-buttons" }, _t = {
  __name: "AgentSessionHistory",
  props: { sessions: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e) {
    return (l, t) => (a(), s("div", Kt, [
      e.sessions.length ? k("", !0) : (a(), s("p", Zt, "This agent has no session in its history.")),
      m("ol", null, [
        (a(!0), s(D, null, ne(e.sessions, (o) => (a(), s("li", {
          key: o.session,
          "data-agent-session": ""
        }, [
          m("span", null, d([o.program, o.model].filter(Boolean).join(" ")), 1),
          o.started_at ? (a(), s("span", Yt, [
            t[1] || (t[1] = h("Started ", -1)),
            f(r(Ye), {
              at: o.started_at
            }, null, 8, ["at"])
          ])) : k("", !0),
          m("span", Xt, d(o.end_reason ? `Ended: ${o.end_reason.replaceAll("_", " ")}` : o.started_at ? "Running" : "Not started"), 1),
          m("code", null, d(o.session), 1)
        ]))), 128))
      ]),
      m("div", Qt, [
        f(r(te), {
          small: "",
          onClick: t[0] || (t[0] = (o) => l.$emit("close"))
        }, {
          default: p(() => [...t[2] || (t[2] = [
            h("Close", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, ea = /* @__PURE__ */ Z(_t, [["__scopeId", "data-v-0d688bd9"]]), ta = { class: "action-buttons" }, aa = {
  key: 0,
  role: "alert"
}, na = {
  key: 1,
  role: "status"
}, la = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 }, held: { type: Boolean, default: !1 } },
  setup(e) {
    const l = e, t = Ee(), o = E(""), i = E(""), n = E(""), u = E(""), x = E(""), L = E(""), T = E([]), I = E(0), F = E(!1), N = E(!1), H = E(!1), j = E(""), V = E(""), q = E([]), Y = c(() => !!l.row.retired_at || l.row.state === "retired"), G = c(() => !Y.value && !!l.row.ended_at), _ = c(() => {
      var M;
      return G.value && ((M = l.row.job_command) == null ? void 0 : M.length) && !l.row.resume_reason;
    }), le = c(() => _.value && !N.value && (l.row.job_task_flag ? T.value.some((M) => String(M.id) === L.value) : !!i.value.trim()));
    function P(M) {
      o.value = M, i.value = "", n.value = "", L.value = "", j.value = "", V.value = "";
    }
    async function X() {
      P("job"), l.row.job_task_flag && (T.value = [], I.value = 0, F.value = !1, await S());
    }
    async function S() {
      if (!N.value) {
        N.value = !0;
        try {
          t.state["jobs.page"] = String(I.value + 1), await t.reload("jobs");
          const M = t.props.jobs;
          j.value = M.failure.value, j.value || (T.value = [...T.value, ...M.rows.value], I.value = M.data.value.page, F.value = M.more.value);
        } finally {
          N.value = !1;
        }
      }
    }
    async function v() {
      await J(["process", "lift-hold", String(l.row.number)], "Hold lifted.");
    }
    async function J(M, A) {
      if (!H.value) {
        H.value = !0, j.value = "";
        try {
          const re = await t.run(M);
          j.value = re.ok ? "" : re.error, re.ok && (P(""), V.value = A);
        } finally {
          H.value = !1;
        }
      }
    }
    async function b() {
      if (!le.value) return;
      const M = l.row.job_task_flag ? [l.row.job_task_flag, L.value] : [i.value.trim()];
      await J([...l.row.job_command, String(l.row.number), ...M], "Job sent.");
    }
    async function y() {
      if (!H.value) {
        H.value = !0;
        try {
          const M = await t.run(["agent", "sessions", String(l.row.number)]);
          P(M.ok ? "history" : ""), j.value = M.ok ? "" : M.error, q.value = M.ok ? M.value.rows : [];
        } finally {
          H.value = !1;
        }
      }
    }
    function W() {
      P("driver"), u.value = l.row.program || "", x.value = "";
    }
    async function g() {
      !G.value || o.value !== "driver" || !u.value.trim() || !x.value.trim() || await J(["agent", "driver", String(l.row.number), "--program", u.value.trim(), "--model", x.value.trim()], "Driver changed.");
    }
    async function B() {
      !G.value || o.value !== "retire" || !n.value.trim() || await J(["agent", "retire", String(l.row.number), "--reason", n.value.trim()], "Agent retired permanently.");
    }
    return (M, A) => {
      var re;
      return a(), s("div", {
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: A[10] || (A[10] = ae(() => {
        }, ["stop"])),
        onKeydown: A[11] || (A[11] = ae(() => {
        }, ["stop"]))
      }, [
        m("div", ta, [
          f(r(te), {
            small: "",
            "data-agent-history": "",
            disabled: H.value || N.value,
            onClick: y
          }, {
            default: p(() => [...A[12] || (A[12] = [
              h("Session history", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          e.held ? (a(), z(r(te), {
            key: 0,
            small: "",
            "data-agent-lift-hold": "",
            disabled: H.value,
            onClick: v
          }, {
            default: p(() => [...A[13] || (A[13] = [
              h("Lift this hold", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])) : k("", !0),
          G.value ? (a(), s(D, { key: 1 }, [
            (re = e.row.job_command) != null && re.length ? (a(), z(r(te), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: H.value || N.value || !_.value,
              onClick: X
            }, {
              default: p(() => [...A[14] || (A[14] = [
                h("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0),
            e.row.role !== "main" ? (a(), z(r(te), {
              key: 1,
              small: "",
              "data-agent-driver": "",
              disabled: H.value || N.value,
              onClick: W
            }, {
              default: p(() => [...A[15] || (A[15] = [
                h("Change driver", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0),
            e.row.role !== "main" ? (a(), z(r(te), {
              key: 2,
              small: "",
              "data-agent-retire": "",
              disabled: H.value || N.value,
              onClick: A[0] || (A[0] = (U) => P("retire"))
            }, {
              default: p(() => [...A[16] || (A[16] = [
                h("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : k("", !0)
          ], 64)) : k("", !0)
        ]),
        f(r(Xe), { value: o.value }, {
          job: p(() => [
            f(Pt, {
              task: L.value,
              "onUpdate:task": A[1] || (A[1] = (U) => L.value = U),
              text: i.value,
              "onUpdate:text": A[2] || (A[2] = (U) => i.value = U),
              row: e.row,
              tasks: T.value,
              pending: H.value,
              loading: N.value,
              "more-tasks": F.value,
              failure: j.value,
              "job-ready": le.value,
              onSubmit: b,
              onMore: S,
              onCancel: A[3] || (A[3] = (U) => P(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          driver: p(() => [
            f(Et, {
              program: u.value,
              "onUpdate:program": A[4] || (A[4] = (U) => u.value = U),
              model: x.value,
              "onUpdate:model": A[5] || (A[5] = (U) => x.value = U),
              pending: H.value,
              onSubmit: g,
              onCancel: A[6] || (A[6] = (U) => P(""))
            }, null, 8, ["program", "model", "pending"])
          ]),
          history: p(() => [
            f(ea, {
              sessions: q.value,
              onClose: A[7] || (A[7] = (U) => P(""))
            }, null, 8, ["sessions"])
          ]),
          retire: p(() => [
            f(Jt, {
              reason: n.value,
              "onUpdate:reason": A[8] || (A[8] = (U) => n.value = U),
              pending: H.value,
              onSubmit: B,
              onCancel: A[9] || (A[9] = (U) => P(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        j.value ? (a(), s("p", aa, d(j.value), 1)) : k("", !0),
        V.value ? (a(), s("p", na, d(V.value), 1)) : k("", !0)
      ], 32);
    };
  }
}, oa = /* @__PURE__ */ Z(la, [["__scopeId", "data-v-8712e475"]]), sa = {
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
        onClick: t[0] || (t[0] = ae((o) => r(ke)("test_queue:0"), ["stop"]))
      }, [
        h("Waiting: " + d(e.waitReason) + " ", 1),
        f(r(De), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), s("span", ra, "Waiting")) : (a(), z(r(vt), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, da = /* @__PURE__ */ Z(ia, [["__scopeId", "data-v-1b371fb5"]]), ua = {
  key: 0,
  class: "lasting-facts",
  "data-agent-lasting-facts": ""
}, ca = { "data-agent-retired-at": "" }, ga = { key: 0 }, va = { "data-agent-retired-by": "" }, pa = {
  __name: "AgentLastingFacts",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    return (l, t) => e.row.retired_at ? (a(), s("dl", ua, [
      m("div", null, [
        t[0] || (t[0] = m("dt", null, "Retired", -1)),
        m("dd", ca, [
          f(r(Ye), {
            at: e.row.retired_at
          }, null, 8, ["at"])
        ])
      ]),
      e.row.retiring_actor_name ? (a(), s("div", ga, [
        t[1] || (t[1] = m("dt", null, "Retired by", -1)),
        m("dd", va, d(e.row.retiring_actor_name), 1)
      ])) : k("", !0)
    ])) : k("", !0);
  }
}, ma = /* @__PURE__ */ Z(pa, [["__scopeId", "data-v-c5c81429"]]), ha = ["data-agent-delegated", "onClick"], fa = { class: "agent-task-number" }, ba = { class: "agent-task-title" }, ka = ["title"], ya = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const t = l;
    return (o, i) => (a(), z(r(Qe), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: i[0] || (i[0] = (n) => t("toggle"))
    }, {
      default: p(() => [
        (a(!0), s(D, null, ne(e.section.tasks, (n) => (a(), s("button", {
          key: n.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": n.id,
          onClick: (u) => r(ke)(`tasks:${n.id}`)
        }, [
          f(r(pt), {
            status: n.state
          }, null, 8, ["status"]),
          m("span", fa, d(n.id), 1),
          m("span", ba, d(n.title), 1),
          n.plan_id ? (a(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${n.plan_id}: ${n.plan_title}`
          }, "Plan " + d(n.plan_id), 9, ka)) : k("", !0)
        ], 8, ha))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, wa = /* @__PURE__ */ Z(ya, [["__scopeId", "data-v-ea4ccd6b"]]), Ma = {
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
}, ja = "It ended without a report", Ba = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const l = e, t = ["started", "blocked", "open", "completed"], o = c(() => {
      var b, y;
      return l.row.ended_at && ((y = (b = l.facts) == null ? void 0 : b.job_returned) != null && y.startsWith(ja)) ? l.facts.job_returned : "";
    }), i = c(() => l.tasks.length ? t.map((b) => ({ state: b, label: b.slice(0, 1).toUpperCase() + b.slice(1), tasks: l.tasks.filter((y) => y.state === b || b === "started" && y.state === "testing" || b === "completed" && y.state === "cancelled") })) : []), n = /* @__PURE__ */ new Set(["completed"]), u = E({}), x = (b) => !(u.value[b] ?? n.has(b)), L = (b) => u.value = { ...u.value, [b]: x(b) }, T = Ee(), { rows: I } = T.props.reports;
    T.state["reports.agent"] = String(l.row.number);
    const F = c(() => l.row.access === "read-only"), N = ["tasks", "transcript", "terminal", "file-feed", "processes", "reports", "memories"], H = c(() => [...T.tabs].sort((b, y) => (N.indexOf(b.key) < 0 ? N.length : N.indexOf(b.key)) - (N.indexOf(y.key) < 0 ? N.length : N.indexOf(y.key)))), j = c(() => !!l.row.retired_at || l.row.state === "retired"), V = () => F.value || j.value ? H.value.find((b) => b.key === "transcript") : H.value[0], q = E(V());
    ve(q, (b) => {
      T.state.tab = (b == null ? void 0 : b.key) ?? "";
    }, { immediate: !0 }), Ae(() => {
      T.state.tab = "";
    }), ve(H, (b) => {
      b.some((y) => {
        var W;
        return y.key === ((W = q.value) == null ? void 0 : W.key);
      }) || (q.value = b[0]);
    }), ve(() => l.open, (b) => {
      b && (q.value = V());
    });
    const Y = Object.fromEntries(T.tabs.filter((b) => b.component).map((b) => [b.key, ot(() => mt(b.component))])), G = E(!1), { data: _ } = T.props.tool, le = c(() => {
      var b;
      return ((b = _.value) == null ? void 0 : b.tool) ?? "";
    }), P = c(() => {
      var b;
      return ((b = _.value) == null ? void 0 : b.note) ?? "";
    }), X = c(() => l.row.role !== "main" && (!l.row.ended_at || l.stoppedWithWork || l.waitReason));
    async function S() {
      !l.open || !X.value || (T.state["tool.agent"] = String(l.row.number), await T.reload("tool"));
    }
    const v = ht(S, ft.agentCommand), J = T.follow(["hook_call.*", "process_part.*"], (b) => bt(b, "session_agent_id", /* @__PURE__ */ new Set([l.row.id])) && v());
    return Ae(() => J == null ? void 0 : J()), ve(() => l.open, (b) => {
      b && S();
    }, { immediate: !0 }), (b, y) => {
      var W;
      return a(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: y[2] || (y[2] = ae(() => {
        }, ["stop"]))
      }, [
        f(ma, { row: e.row }, null, 8, ["row"]),
        e.row.retirement_reason ? (a(), s("p", Ma, "Retirement reason: " + d(e.row.retirement_reason), 1)) : k("", !0),
        o.value ? (a(), s("p", $a, d(o.value), 1)) : k("", !0),
        f(r(kt), {
          class: "agent-tabs",
          tabs: H.value,
          active: q.value,
          answer: { tasks: e.tasks.length, reports: e.row.report_count ?? r(I).length, memories: e.row.memory_count ?? 0 },
          onChoose: y[0] || (y[0] = (g) => q.value = g)
        }, null, 8, ["tabs", "active", "answer"]),
        f(r(yt), {
          class: "agent-tab-body",
          tab: q.value,
          "data-agent-tab-body": (W = q.value) == null ? void 0 : W.key
        }, {
          default: p(() => {
            var g;
            return [
              f(r(Xe), {
                value: (g = q.value) == null ? void 0 : g.key
              }, st({
                reports: p(() => [
                  r(I).length ? k("", !0) : (a(), z(r(qe), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: p(() => [...y[3] || (y[3] = [
                      h("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (a(!0), s(D, null, ne(r(I), (B) => (a(), s("button", {
                    key: B.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${B.id}`,
                    onClick: (M) => r(ke)(`messages:${B.id}`)
                  }, d(B.text), 9, xa))), 128))
                ]),
                tasks: p(() => {
                  var B;
                  return [
                    e.tasks.length ? k("", !0) : (a(), z(r(qe), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: p(() => [...y[4] || (y[4] = [
                        h("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (a(!0), s(D, null, ne(i.value, (M) => (a(), z(wa, {
                      key: M.state,
                      section: M,
                      open: x(M.state),
                      onToggle: (A) => L(M.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (B = e.facts) != null && B.instruction ? (a(), s(D, { key: 1 }, [
                      y[5] || (y[5] = m("p", { class: "agent-label" }, "Instruction", -1)),
                      m("div", Sa, d(e.facts.instruction), 1)
                    ], 64)) : k("", !0)
                  ];
                }),
                transcript: p(() => {
                  var B;
                  return [
                    F.value ? (a(), s(D, { key: 0 }, [
                      (B = e.facts) != null && B.instruction ? (a(), s("div", Ca, [
                        f(r(Qe), {
                          label: "Instruction",
                          open: G.value,
                          "data-agent-section": "instruction",
                          onToggle: y[1] || (y[1] = (M) => G.value = !G.value)
                        }, {
                          default: p(() => [
                            m("div", Ta, d(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (a(), s("p", Aa, "No job recorded")) : k("", !0)
                    ], 64)) : k("", !0),
                    f(Rt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                ne(r(Y), (B, M) => ({
                  name: M,
                  fn: p(() => [
                    (a(), z(rt(B), {
                      agent: e.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ];
          }),
          _: 1
        }, 8, ["tab", "data-agent-tab-body"]),
        X.value ? (a(), z(da, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: le.value,
          note: P.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : k("", !0)
      ]);
    };
  }
}, La = /* @__PURE__ */ Z(Ba, [["__scopeId", "data-v-fabbecdf"]]), Oa = { class: "line" }, Ra = {
  key: 0,
  class: "line",
  "data-agent-since": ""
}, Ia = {
  key: 1,
  class: "line",
  "data-agent-seen": ""
}, Va = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" }, seen: { type: String, default: "" } },
  setup(e) {
    const l = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, o = c(() => l.has(t.state)), i = c(() => [t.doing, t.since, t.seen].filter(Boolean).join(". "));
    return (n, u) => (a(), z(r(fe), {
      as: "button",
      place: "corner",
      class: ue(["agent-dot", { pulse: o.value }]),
      "data-state": e.state,
      "aria-label": i.value,
      "data-agent-status": "",
      onClick: u[0] || (u[0] = ae(() => {
      }, ["stop"]))
    }, {
      tip: p(() => [
        m("b", Oa, d(e.doing), 1),
        e.since ? (a(), s("span", Ra, d(e.since), 1)) : k("", !0),
        e.seen ? (a(), s("span", Ia, d(e.seen), 1)) : k("", !0)
      ]),
      default: p(() => [
        u[1] || (u[1] = m("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, Ea = /* @__PURE__ */ Z(Va, [["__scopeId", "data-v-1a0bc478"]]), za = ["title"], Na = ["aria-label"], Ha = {
  class: "count",
  "data-plan-count": ""
}, Wa = {
  __name: "PlanBar",
  props: { plan: { type: Number, required: !0 }, counts: { type: Object, required: !0 } },
  setup(e) {
    const l = e, t = (i) => `${l.counts.total ? i / l.counts.total * 100 : 0}%`, o = c(() => {
      const { completed: i, testing: n, started: u, total: x } = l.counts;
      return `Plan ${l.plan}: ${i} completed, ${n} testing, ${u} started, ${x - i - n - u} open`;
    });
    return (i, n) => e.counts.total ? (a(), s("span", {
      key: 0,
      class: "plan-bar",
      "data-plan-bar": "",
      title: o.value
    }, [
      m("span", {
        class: "track",
        role: "img",
        "aria-label": o.value,
        "data-plan-track": ""
      }, [
        m("span", {
          class: "part completed",
          "data-plan-completed": "",
          style: be({ width: t(e.counts.completed) })
        }, null, 4),
        m("span", {
          class: "part testing",
          "data-plan-testing": "",
          style: be({ width: t(e.counts.testing) })
        }, null, 4),
        m("span", {
          class: "part started",
          "data-plan-started": "",
          style: be({ width: t(e.counts.started) })
        }, null, 4)
      ], 8, Na),
      m("span", Ha, [
        m("b", null, d(e.counts.completed), 1),
        h(" of " + d(e.counts.total), 1)
      ])
    ], 8, za)) : k("", !0);
  }
}, Da = /* @__PURE__ */ Z(Wa, [["__scopeId", "data-v-52c3b6c0"]]), qa = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, Fa = (e) => e.filter((l) => l.state !== "cancelled"), He = (e, l) => e.filter((t) => t.state === l).length, Pa = 5, Ua = (e, l) => e || l.split(/\s+/).slice(0, Pa).join(" ");
function Ga({ tasks: e, inHand: l, perHour: t }) {
  const o = Fa(e), i = He(o, "completed"), n = qa[l == null ? void 0 : l.state], u = o.filter((I) => I.state === "started").map((I) => ({ number: I.id, title: I.title })), x = Math.max(u.length, l && l.state !== "completed" ? 1 : 0), L = o.length - i - x, T = i === o.length;
  return {
    number: l.id,
    title: l.title,
    started: u,
    plan: l.plan_id ?? 0,
    planTitle: l.plan_title ?? "",
    count: `${i} of ${o.length}`,
    taskTip: `${i} of its ${o.length} tasks done${n ? `. This one is ${n.words}.` : "."}`,
    countTip: T ? `All ${o.length} tasks done` : `${i} done, ${x} in hand, ${L} to go`,
    paceTip: !T && t ? `About ${t} an hour.` : "",
    rate: !T && t ? `${Math.round(t)}/hour` : "",
    bar: { total: o.length, done: i, testing: He(o, "testing"), started: He(o, "started") }
  };
}
const Ja = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, Ka = {
  key: 0,
  class: "plan",
  "data-agent-job-launch": ""
}, Za = {
  class: "task-line",
  "data-agent-task-line": ""
}, Ya = {
  key: 1,
  class: "tasks",
  "data-agent-tasks": ""
}, Xa = {
  key: 2,
  class: "tasks",
  "data-agent-tasks": ""
}, Qa = {
  key: 4,
  class: "rate",
  "data-agent-rate": ""
}, _a = { key: 0 }, en = 3, tn = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, jobTitle: { type: String, default: "" }, jobLaunch: { type: String, default: "" }, perHour: { type: Number, default: 0 }, countsEmpty: { type: Boolean, default: !1 }, planCounts: { type: Object, default: () => ({}) } },
  setup(e) {
    const l = e, t = c(() => l.inHand ? Ga({ tasks: l.tasks, inHand: l.inHand, perHour: l.perHour }) : null), o = c(() => {
      var i;
      return (i = t.value) != null && i.plan ? l.planCounts[t.value.plan] ?? null : null;
    });
    return (i, n) => e.job && !t.value ? (a(), s("span", Ja, [
      f(r(fe), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: p(() => [
          m("b", null, d(e.job), 1)
        ]),
        default: p(() => [
          h(d(r(Ua)(e.jobTitle, e.job)), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (a(), s("span", Ka, d(e.jobLaunch), 1)) : k("", !0)
    ])) : t.value ? (a(), s(D, { key: 1 }, [
      m("span", Za, [
        t.value.plan ? (a(), z(r(fe), {
          key: 0,
          as: "button",
          class: "task",
          "data-agent-plan": "",
          "data-peek": `plans:${t.value.plan}`,
          "aria-label": `Plan ${t.value.plan}: ${t.value.planTitle}`,
          onClick: n[0] || (n[0] = ae((u) => r(ke)(`plans:${t.value.plan}`), ["stop"]))
        }, {
          tip: p(() => [
            m("b", null, d(t.value.planTitle), 1),
            m("span", null, "Task " + d(t.value.number) + ": " + d(t.value.title), 1)
          ]),
          default: p(() => [
            h("Plan " + d(t.value.plan), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])) : t.value.started.length > en ? (a(), s("span", Ya, [
          f(r(fe), {
            as: "button",
            class: "task",
            "data-agent-task-count": "",
            "aria-label": `Tasks: ${t.value.started.length}`
          }, {
            tip: p(() => [
              (a(!0), s(D, null, ne(t.value.started, (u) => (a(), s("b", {
                key: u.number,
                class: "listed",
                "data-agent-task-listed": ""
              }, d(u.number) + " " + d(u.title), 1))), 128))
            ]),
            default: p(() => [
              h("Tasks: " + d(t.value.started.length), 1)
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : t.value.started.length > 1 ? (a(), s("span", Xa, [
          n[2] || (n[2] = h("Tasks ", -1)),
          (a(!0), s(D, null, ne(t.value.started, (u, x) => (a(), s(D, {
            key: u.number
          }, [
            x ? (a(), s(D, { key: 0 }, [
              h(", ")
            ], 64)) : k("", !0),
            f(r(fe), {
              as: "button",
              class: "task",
              "data-agent-task": "",
              "data-peek": `tasks:${u.number}`,
              "aria-label": `Task ${u.number}: ${u.title}`,
              onClick: ae((L) => r(ke)(`tasks:${u.number}`), ["stop"])
            }, {
              tip: p(() => [
                m("b", null, d(u.title), 1)
              ]),
              default: p(() => [
                h(d(u.number), 1)
              ]),
              _: 2
            }, 1032, ["data-peek", "aria-label", "onClick"])
          ], 64))), 128))
        ])) : (a(), z(r(fe), {
          key: 3,
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${t.value.number}`,
          "aria-label": `Task ${t.value.number}: ${t.value.title}`,
          onClick: n[1] || (n[1] = ae((u) => r(ke)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: p(() => [
            m("b", null, d(t.value.title), 1),
            m("span", null, d(t.value.taskTip), 1)
          ]),
          default: p(() => [
            h("Task " + d(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])),
        t.value.rate ? (a(), s("span", Qa, d(t.value.rate), 1)) : k("", !0),
        o.value ? (a(), z(Da, {
          key: 5,
          plan: t.value.plan,
          counts: o.value
        }, null, 8, ["plan", "counts"])) : (a(), z(r(fe), {
          key: 6,
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: p(() => [
            m("b", null, d(t.value.countTip), 1),
            t.value.paceTip ? (a(), s("span", _a, d(t.value.paceTip), 1)) : k("", !0)
          ]),
          default: p(() => [
            h(d(t.value.count), 1)
          ]),
          _: 1
        }))
      ]),
      o.value ? k("", !0) : (a(), z(r(Je), {
        key: 0,
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: t.value.bar.total,
        done: t.value.bar.done,
        testing: t.value.bar.testing,
        started: t.value.bar.started
      }, null, 8, ["total", "done", "testing", "started"]))
    ], 64)) : e.countsEmpty ? (a(), s(D, { key: 2 }, [
      n[3] || (n[3] = m("span", {
        class: "task-line",
        "data-agent-task-line": ""
      }, [
        m("span", {
          class: "task",
          "data-agent-no-task": ""
        }, "No task"),
        m("span", {
          class: "count",
          "data-agent-count": ""
        }, "0 of 0")
      ], -1)),
      f(r(Je), {
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
}, an = /* @__PURE__ */ Z(tn, [["__scopeId", "data-v-e5158129"]]), nn = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', ln = ["data-icon", "stroke-width", "innerHTML"], se = {
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
      agent: nn,
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
    return (n, u) => (a(), s("svg", {
      class: "ico",
      "data-icon": e.name,
      style: be({
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
    }, null, 12, ln));
  }
}, on = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, sn = {
  key: 1,
  class: "menu-item-text"
}, rn = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (l, t) => (a(), s("button", {
      type: "button",
      class: ue(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), s("span", on, d(e.checked ? "✓" : ""), 1)) : k("", !0),
      e.description ? (a(), s("span", sn, [
        m("span", null, [
          je(l.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, d(e.description), 1)
      ])) : je(l.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, xe = /* @__PURE__ */ Z(rn, [["__scopeId", "data-v-fec99974"]]), dn = {}, un = { class: "menu-label" };
function cn(e, l) {
  return a(), s("span", un, [
    je(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Te = /* @__PURE__ */ Z(dn, [["render", cn], ["__scopeId", "data-v-aa955b3e"]]), gn = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, vn = {
  key: 0,
  class: "skills-none"
}, pn = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: l }) {
    const t = e, o = l, i = c(() => t.skills.filter((u) => u.state === "loaded")), n = c(() => t.skills.filter((u) => u.state !== "loaded"));
    return (u, x) => (a(), s("div", gn, [
      f(Te, null, {
        default: p(() => [...x[1] || (x[1] = [
          h("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      i.value.length ? k("", !0) : (a(), s("p", vn, "None yet. Compacting the conversation empties this list.")),
      (a(!0), s(D, null, ne(i.value, (L) => (a(), s("p", {
        key: L.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        f(se, {
          name: "book",
          size: 12
        }),
        h(d(L.skill), 1)
      ]))), 128)),
      n.value.length ? (a(), s(D, { key: 1 }, [
        f(Te, null, {
          default: p(() => [...x[2] || (x[2] = [
            h("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), s(D, null, ne(n.value, (L) => (a(), s("p", {
          key: L.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          f(se, {
            name: "book",
            size: 12
          }),
          h(d(L.skill), 1)
        ]))), 128))
      ], 64)) : k("", !0),
      f(xe, {
        "data-agent-skills-browse": "",
        onClick: x[0] || (x[0] = (L) => o("browse"))
      }, {
        default: p(() => [...x[3] || (x[3] = [
          h("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, mn = /* @__PURE__ */ Z(pn, [["__scopeId", "data-v-be514d47"]]), hn = ["disabled", "title"], fn = { class: "gauge usage" }, bn = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: l }) {
    const t = e, o = l, i = c(() => t.windows[0] ?? null), n = c(() => i.value && Number.isFinite(i.value.used_percent) ? Math.max(0, Math.min(100, Math.round(i.value.used_percent))) : null), u = c(() => n.value !== null && n.value >= 100), x = c(() => {
      var T;
      return (T = i.value) != null && T.reset_epoch_seconds ? new Date(i.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), L = c(() => u.value ? `At usage limit: the plan's ${i.value.title} allowance is used up${x.value ? `, starts again ${x.value}` : ""}` : `${n.value}% of the plan's ${i.value.title} allowance used${x.value ? `, starts again ${x.value}` : ""}`);
    return (T, I) => n.value !== null ? (a(), s("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: L.value,
      onClick: I[0] || (I[0] = (F) => o("open", F.currentTarget))
    }, [
      f(se, {
        name: "allowance",
        size: 12
      }),
      I[1] || (I[1] = h()),
      m("span", fn, [
        m("span", {
          style: be({ width: `${n.value}%` })
        }, null, 4)
      ]),
      h(" " + d(u.value ? "At usage limit" : `${n.value}%`), 1)
    ], 8, hn)) : k("", !0);
  }
}, kn = /* @__PURE__ */ Z(bn, [["__scopeId", "data-v-a36f09dc"]]), yn = ["failed", "blocked", "problem", "update", "paused", "holding", "waiting", "asks"], et = { danger: "failed", warn: "waiting" }, wn = (e) => yn.includes(et[e] ?? e), Mn = (e) => wn(e) ? ["badge", et[e] ?? e] : ["badge-quiet"], $n = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (l, t) => (a(), s("span", {
      class: ue(r(Mn)(e.tone))
    }, d(e.text), 3));
  }
}, xn = /* @__PURE__ */ Z($n, [["__scopeId", "data-v-b7a33f3d"]]), Sn = (e, l, t) => Math.max(l, Math.min(t, e)), tt = /* @__PURE__ */ new WeakMap(), Cn = (e, l) => tt.set(e, l);
function Tn(e, l) {
  for (let t = l; t; t = tt.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function An(e, l) {
  const t = (o) => {
    var n, u;
    const i = ((n = e.value) == null ? void 0 : n.element) || ((u = e.value) == null ? void 0 : u.$el) || e.value;
    i && !Tn(i, o.target) && l(o);
  };
  window.addEventListener("click", t), Ae(() => window.removeEventListener("click", t));
}
const he = 8, jn = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const o = e, i = E(null), n = (g) => g ? `${g}px` : void 0, u = c(() => ({
      minWidth: n(o.minWidth),
      maxWidth: n(o.maxWidth),
      maxHeight: n(o.maxHeight),
      height: n(o.height)
    })), x = E({ w: 0, h: 0 }), L = (g) => ({ left: g.x, right: g.flipX ?? g.x, top: g.y, bottom: g.y }), T = E(o.anchor ? o.anchor.getBoundingClientRect() : o.point ? L(o.point) : null), I = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), F = (g) => ({
      left: Math.max(0, g.left),
      top: Math.max(0, g.top),
      right: Math.min(window.innerWidth, g.right),
      bottom: Math.min(window.innerHeight, g.bottom)
    }), N = (g) => {
      const B = g.closest(".pane, .float-window");
      return B ? F(B.getBoundingClientRect()) : I();
    }, H = (g, B) => `${Math.max(0, g ? Math.min(g, B) : B)}px`;
    function j(g, B) {
      return {
        below: g.bottom - B.bottom - o.gap - he,
        above: B.top - g.top - o.gap - he,
        across: g.right - g.left - 2 * he
      };
    }
    function V(g) {
      if (!o.anchor) return I();
      const B = N(o.anchor), M = j(B, g);
      return x.value.w <= M.across && x.value.h <= Math.max(M.below, M.above) ? B : I();
    }
    const q = c(() => {
      if (!T.value) return u.value;
      const g = T.value, B = V(g), M = j(B, g), { w: A, h: re } = x.value, U = o.point ? g.left + A > B.right - he : o.align === "auto" ? g.left + g.right > B.left + B.right : o.align === "right", ye = Sn(U ? g.right - A : g.left, B.left + he, Math.max(B.left + he, B.right - A - he)), Q = re > M.below && M.above > M.below ? { bottom: `${window.innerHeight - g.top + o.gap}px`, maxHeight: H(o.maxHeight, M.above) } : { top: `${g.bottom + o.gap}px`, maxHeight: H(o.maxHeight, M.below) };
      return { ...u.value, ...Q, left: `${ye}px`, maxWidth: H(o.maxWidth, M.across) };
    }), Y = t, G = () => [...i.value.querySelectorAll("button:not(:disabled)")];
    function _(g) {
      const B = G(), M = B.indexOf(document.activeElement);
      B[(M + g + B.length) % B.length].focus();
    }
    const le = { ArrowDown: () => _(1), ArrowUp: () => _(-1), Escape: () => Y("close") }, P = (g) => le[g.key] && (g.preventDefault(), le[g.key]()), X = () => i.value && (x.value = { w: i.value.offsetWidth, h: i.value.scrollHeight });
    let S = 0;
    const v = new ResizeObserver(() => {
      cancelAnimationFrame(S), S = requestAnimationFrame(X);
    });
    An(i, (g) => o.anchor && !o.anchor.contains(g.target) && Y("close"));
    const J = (g, B) => ["top", "left", "right", "bottom"].some((M) => Math.abs(g[M] - B[M]) > 1), b = (g) => g.bottom < 0 || g.top > window.innerHeight;
    let y = 0;
    function W() {
      if (o.anchor) {
        const g = o.anchor.getBoundingClientRect();
        if (!o.anchor.isConnected || b(g)) return Y("close");
        J(g, T.value) && (T.value = g);
      }
      y = requestAnimationFrame(W);
    }
    return it(() => {
      o.anchor && i.value && Cn(i.value, o.anchor), X(), i.value && v.observe(i.value), !o.plain && G()[0] && G()[0].focus(), W();
    }), Ae(() => {
      v.disconnect(), cancelAnimationFrame(y), cancelAnimationFrame(S);
    }), l({ element: i }), (g, B) => (a(), z(dt, {
      to: "body",
      disabled: !e.anchor && !e.point
    }, [
      m("div", ut({
        ref_key: "panel",
        ref: i
      }, g.$attrs, {
        class: ["menu-panel", { anchored: e.anchor || e.point }],
        style: q.value,
        onKeydown: P
      }), [
        je(g.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), Bn = /* @__PURE__ */ Z(jn, [["__scopeId", "data-v-8094ec27"]]);
async function Ln(e, l, t) {
  if (!e) return t(l);
  const { target: o, fields: i } = e, n = Object.fromEntries(Object.keys(i).map((L) => [L, o[L]])), u = () => Object.assign(o, n);
  Object.assign(o, i);
  let x = !1;
  try {
    const L = await t(l);
    return x = L.ok, L;
  } finally {
    x || u();
  }
}
function On(e, l, t, { groups: o, programs: i }) {
  const n = E({}), u = E(""), x = E(!1), L = c(() => !!e.value && !e.value.ended_at), T = c(() => L.value && !!e.value.paused_at);
  async function I(j, V = null) {
    u.value = "";
    const q = await Ln(V, j, l);
    return u.value = q.ok ? "" : q.error, t(), q;
  }
  return { groups: o, programs: i, chosen: n, failure: u, asking: x, running: L, paused: T, choose: (j, V) => I(["agent", "control", String(e.value.number), j, V.value], { target: n, fields: { value: { ...n.value, [j]: V.label } } }), stop: () => (x.value = !1, I(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (j) => I(["agent", "launch", j.name]) };
}
function Rn(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const In = { compact: "Compaction", clear: "Clear" };
function Vn(e) {
  return e != null && e.is_open ? `${In[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
const En = ["disabled", "title"], zn = ["disabled", "title"], Nn = { class: "gauge" }, Hn = {
  key: 1,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
}, Wn = ["disabled", "title"], Dn = ["disabled"], qn = ["disabled"], Fn = {
  key: 5,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Pn = ["title"], Un = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Gn = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Jn = { class: "gauge" }, Kn = { class: "context-used" }, Zn = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, Yn = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, Xn = 75, Qn = {
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
    const t = e, o = l, i = On(ze(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => o("changed"), { groups: ze(t, "controlGroups"), programs: ze(t, "agentPrograms") }), n = E(null), u = E(""), x = c(() => i.groups.value.find((S) => S.key === u.value));
    function L(S, v) {
      n.value = S.currentTarget, u.value = v;
    }
    function T() {
      n.value = null, u.value = "", i.asking.value = !1;
    }
    const I = c(() => t.skills.filter((S) => S.state === "loaded"));
    function F(S) {
      L(S, "skills"), o("skills");
    }
    const N = (S) => i.groups.value.some((v) => v.key === S), H = c(() => {
      var S;
      return i.chosen.value.model ?? ((S = V.value) == null ? void 0 : S.model) ?? "";
    }), j = c(() => {
      var S;
      return i.chosen.value.effort ?? ((S = V.value) == null ? void 0 : S.effort) ?? "";
    });
    c(() => !!t.agent && !t.agent.ended_at);
    const V = c(() => {
      var S;
      return ((S = t.usage.agents) == null ? void 0 : S.find((v) => {
        var J;
        return v.id === ((J = t.agent) == null ? void 0 : J.id);
      })) ?? null;
    }), q = c(() => {
      var S;
      return ((S = V.value) == null ? void 0 : S.context_percent) == null ? null : Math.round(V.value.context_percent);
    }), Y = c(() => {
      var S;
      return Vn(((S = V.value) == null ? void 0 : S.context_change) ?? null);
    }), G = (S) => `${Math.round(S / 1e3)}k`, _ = c(() => {
      var S;
      return !!((S = V.value) != null && S.context_limit_tokens);
    }), le = c(() => {
      var S, v;
      return ((S = V.value) == null ? void 0 : S.context_limit_tokens) || ((v = V.value) == null ? void 0 : v.context_window_tokens) || 0;
    }), P = c(() => le.value ? `${G(V.value.context_tokens ?? 0)} of ${G(le.value)}` : ""), X = c(() => {
      var S;
      return (S = V.value) != null && S.cost_dollars ? `$${V.value.cost_dollars.toFixed(2)}` : "";
    });
    return (S, v) => {
      var J, b;
      return a(), s("div", {
        class: ue(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (a(), s(D, { key: 0 }, [
          m("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: v[0] || (v[0] = (y) => L(y, "agent"))
          }, [
            f(se, {
              name: "agents",
              size: 12
            }),
            h(" " + d(((J = e.agentPrograms.find((y) => y.name === e.agent.program)) == null ? void 0 : J.title) || e.agent.program), 1)
          ], 8, En),
          f(kn, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: v[1] || (v[1] = (y) => o("open", "usage", y))
          }, null, 8, ["windows", "disabled"]),
          q.value !== null ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${q.value}% full: clear or compact it`,
            onClick: v[2] || (v[2] = (y) => N("context") ? L(y, "context") : o("open", "context", y.currentTarget))
          }, [
            f(se, {
              name: "gauge",
              size: 12
            }),
            v[14] || (v[14] = h()),
            m("span", Nn, [
              m("span", {
                style: be({ width: `${q.value}%` })
              }, null, 4)
            ]),
            h(" " + d(q.value) + "% ", 1)
          ], 8, zn)) : (b = V.value) != null && b.context_unknown ? (a(), s("span", Hn, [
            f(se, {
              name: "gauge",
              size: 12
            }),
            v[15] || (v[15] = h(" Context: unknown", -1))
          ])) : k("", !0),
          H.value ? (a(), s("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${H.value}: change the model`,
            onClick: v[3] || (v[3] = (y) => N("model") ? L(y, "model") : null)
          }, [
            f(se, {
              name: "model",
              size: 12
            }),
            h(" " + d(H.value), 1)
          ], 8, Wn)) : k("", !0),
          N("effort") || e.card && j.value ? (a(), s("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: v[4] || (v[4] = (y) => L(y, "effort"))
          }, [
            f(se, {
              name: "bolt",
              size: 12
            }),
            h(" " + d(j.value), 1)
          ], 8, Dn)) : k("", !0),
          X.value ? (a(), s("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: v[5] || (v[5] = (y) => o("open", "cost", y.currentTarget))
          }, d(X.value), 9, qn)) : k("", !0),
          e.branch ? (a(), s("span", Fn, [
            f(se, {
              name: "branch",
              size: 12
            }),
            h(" " + d(e.branch), 1)
          ])) : k("", !0),
          e.card ? k("", !0) : (a(), s("button", {
            key: 6,
            type: "button",
            class: ue(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: v[6] || (v[6] = (y) => o("open", "jobs", y.currentTarget))
          }, [
            f(se, {
              name: "clock",
              size: 12
            }),
            h(" " + d(e.jobs), 1)
          ], 2)),
          e.run ? (a(), s("button", {
            key: 7,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: F
          }, [
            f(se, {
              name: "book",
              size: 12
            }),
            h(" " + d(I.value.length), 1)
          ])) : k("", !0),
          e.fitness ? (a(), s(D, { key: 8 }, [
            m("button", {
              type: "button",
              class: ue(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Xn }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: v[7] || (v[7] = (y) => o("open", "fitness", y.currentTarget))
            }, [
              f(se, {
                name: "heart",
                size: 12
              }),
              h(" " + d(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            m("button", {
              type: "button",
              class: ue(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: v[8] || (v[8] = (y) => o("open", "load", y.currentTarget))
            }, [
              f(se, {
                name: "weight",
                size: 12
              }),
              h(" " + d(e.fitness.workload), 1)
            ], 2)
          ], 64)) : k("", !0)
        ], 64)) : e.run && !e.loading ? (a(), s("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: v[9] || (v[9] = (y) => L(y, "start"))
        }, [
          f(se, {
            name: "agents",
            size: 12
          }),
          v[16] || (v[16] = h(" Start an agent", -1))
        ])) : k("", !0),
        v[22] || (v[22] = m("span", { class: "space" }, null, -1)),
        r(i).failure.value ? (a(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: r(i).failure.value
        }, d(r(i).failure.value), 9, Pn)) : k("", !0),
        je(S.$slots, "default", {}, void 0, !0),
        n.value ? (a(), z(Bn, {
          key: 3,
          anchor: n.value,
          "min-width": 190,
          onClose: T
        }, {
          default: p(() => {
            var y;
            return [
              u.value === "agent" ? (a(), s(D, { key: 0 }, [
                r(i).asking.value ? (a(), s(D, { key: 0 }, [
                  f(Te, { "data-agent-stop-ask": "" }, {
                    default: p(() => [...v[17] || (v[17] = [
                      h("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  f(xe, {
                    "data-agent-stop-confirm": "",
                    onClick: v[10] || (v[10] = (W) => (T(), r(i).stop()))
                  }, {
                    default: p(() => [...v[18] || (v[18] = [
                      h("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  f(xe, {
                    onClick: v[11] || (v[11] = (W) => r(i).asking.value = !1)
                  }, {
                    default: p(() => [...v[19] || (v[19] = [
                      h("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (a(), z(xe, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: v[12] || (v[12] = (W) => r(i).asking.value = !0)
                }, {
                  default: p(() => [...v[20] || (v[20] = [
                    h("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : u.value === "start" ? (a(), s(D, { key: 1 }, [
                f(Te, null, {
                  default: p(() => [...v[21] || (v[21] = [
                    h("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (a(!0), s(D, null, ne(r(i).programs.value, (W) => (a(), z(xe, {
                  key: W.name,
                  "data-agent-program": W.name,
                  onClick: (g) => (T(), r(i).start(W))
                }, {
                  default: p(() => [
                    h(d(W.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : u.value === "skills" ? (a(), z(mn, {
                key: 2,
                skills: e.skills,
                onBrowse: v[13] || (v[13] = (W) => (T(), o("open", "skills", null)))
              }, null, 8, ["skills"])) : x.value ? (a(), s(D, { key: 3 }, [
                f(Te, null, {
                  default: p(() => [
                    h(d(x.value.label), 1)
                  ]),
                  _: 1
                }),
                u.value === "context" ? (a(), s(D, { key: 0 }, [
                  m("p", Un, d(r(Rn)(((y = V.value) == null ? void 0 : y.last_compaction) ?? null)), 1),
                  m("div", Gn, [
                    m("span", Jn, [
                      m("span", {
                        style: be({ width: `${q.value}%` })
                      }, null, 4)
                    ]),
                    m("span", Kn, d(q.value) + "%", 1)
                  ]),
                  P.value ? (a(), s("p", Zn, [
                    h(d(P.value) + " ", 1),
                    _.value ? (a(), z(xn, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : k("", !0)
                  ])) : k("", !0)
                ], 64)) : k("", !0),
                u.value === "context" && Y.value ? (a(), s("p", Yn, d(Y.value), 1)) : (a(!0), s(D, { key: 2 }, ne(x.value.choices, (W) => (a(), z(xe, {
                  key: W.value,
                  "data-agent-choice": W.value,
                  onClick: (g) => (r(i).choose(x.value.key, W), T())
                }, {
                  default: p(() => [
                    h(d(W.label), 1)
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
}, _n = /* @__PURE__ */ Z(Qn, [["__scopeId", "data-v-d7113347"]]), el = ["data-agent-open", "aria-expanded", "role", "tabindex"], tl = {
  class: "agent-head",
  "data-agent-head": ""
}, al = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, nl = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, ll = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, ol = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, sl = {
  key: 0,
  class: "agent-menu",
  "data-agent-menu-panel": ""
}, rl = {
  key: 1,
  class: "agent-line"
}, il = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, dl = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, ul = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, cl = {
  key: 3,
  class: "agent-unit",
  "data-agent-unit": ""
}, gl = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), o = ["completed", "testing"], i = { running: "Working", starting: "Starting", stopping: "Stopping", ended: "Idle: its process has stopped", failed: "Could not start", never_started: "Not started" }, n = e, u = l, x = _e(), L = E(!1), T = c(() => wt(n.row, n.facts)), I = c(() => {
      var w;
      return ((w = n.facts) == null ? void 0 : w.tasks) ?? [];
    }), F = c(() => I.value.filter((w) => w.state === "open")), N = c(() => I.value.find((w) => {
      var O;
      return w.id === ((O = n.progress) == null ? void 0 : O.task_id) && w.state === "started";
    })), H = c(() => N.value || I.value.find((w) => {
      var O;
      return w.id === ((O = n.facts) == null ? void 0 : O.task_id);
    }) || I.value.find((w) => t.has(w.state)) || F.value[0] || I.value.at(-1)), j = c(() => {
      var w, O, ee, de, ce, oe;
      return n.row.role === "helper" ? ((w = n.facts) == null ? void 0 : w.helper_job) || "" : (O = n.facts) != null && O.job_enabled && (((ee = N.value) == null ? void 0 : ee.title) || ((de = n.facts) == null ? void 0 : de.task_title) || ((ce = F.value[0]) == null ? void 0 : ce.title) || ((oe = I.value.at(-1)) == null ? void 0 : oe.title)) || "";
    }), V = c(() => Mt(n.row)), q = c(() => {
      var w, O;
      return [n.row.program, (w = n.facts) == null ? void 0 : w.model, (O = n.facts) == null ? void 0 : O.effort, V.value].filter(Boolean).join(" · ");
    }), Y = Ee(), G = /* @__PURE__ */ new Set(["open", "started", "testing"]), _ = { fresh: "new conversation", resumed: "resumed" }, le = c(() => {
      var w, O;
      return [(w = n.facts) == null ? void 0 : w.helper_job_program, _[(O = n.facts) == null ? void 0 : O.occupant_launch]].filter(Boolean).join(", ");
    }), P = c(() => {
      var w;
      return (w = n.facts) == null ? void 0 : w.work_status;
    }), X = c(() => !!n.row.ended_at && n.row.role !== "main" && I.value.some((w) => G.has(w.state))), S = c(() => {
      var w, O;
      return n.row.state === "running" && ((w = n.facts) == null ? void 0 : w.state) === "at usage limit" && !!((O = n.facts) != null && O.usage_limit_ends_at);
    }), v = (w) => new Date(w).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), J = c(() => n.row.halted_at ? `Stopped at the usage limit since ${v(n.row.halted_at)}, goes on at ${v(n.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(n.facts.usage_limit_ends_at).toLocaleString()}`), b = c(() => {
      var w;
      return n.row.retired_at || n.row.state === "retired" ? "retired" : S.value || P.value || n.waitReason || X.value ? "waiting" : n.row.state === "running" && ((w = n.facts) == null ? void 0 : w.state) || n.row.state;
    }), y = c(() => {
      var w;
      return S.value ? J.value : P.value ? `Status: ${P.value}` : n.waitReason ? `Waiting: ${n.waitReason}` : b.value === "blocked" ? (w = n.facts) != null && w.blocked_reason ? `Blocked: ${n.facts.blocked_reason}` : "Blocked" : X.value ? "Stopped with work left" : "";
    }), W = c(() => {
      var w;
      return ((w = n.progress) == null ? void 0 : w.completed_count) ?? I.value.filter((O) => o.includes(O.state)).length;
    }), g = c(() => {
      var w;
      return $t(W.value, ((w = n.progress) == null ? void 0 : w.started_at) || n.row.created_at, n.progress ? n.progress.finished_at : n.row.ended_at, x.value);
    }), B = c(() => n.row.role === "main" ? 0 : g.value), M = c(() => !!n.row.retired_at || n.row.state === "retired"), A = c(() => M.value ? "Retired" : b.value === "blocked" || b.value === "waiting" ? y.value || (b.value === "blocked" ? "Blocked" : "Waiting") : i[n.row.standing]), re = c(() => {
      var O;
      if (M.value) return n.row.retired_at;
      const w = b.value === "blocked" || b.value === "waiting";
      return n.row.ended_at || w && ((O = n.facts) == null ? void 0 : O.last_activity) || n.row.process_started_at || n.row.created_at;
    }), U = c(() => !!n.row.ended_at || M.value), ye = (w, O) => async ({ say: ee }) => {
      const de = await Y.run(["agent", ...w, String(n.row.number)]);
      ee(de.ok ? `${T.value} ${O}` : de.error);
    }, Se = () => ({
      head: T.value,
      items: [
        { label: "Open", group: "open", disabled: n.open, reason: "Already open", run: () => u("toggle") },
        { label: n.row.paused_at ? "Resume" : "Pause", group: "open", disabled: U.value, reason: "Process stopped", run: ye([n.row.paused_at ? "resume" : "pause"], n.row.paused_at ? "resumed" : "paused") },
        { label: "Copy name", group: "copy", run: ({ say: w }) => At(T.value, "the name", w) },
        { label: "Open its task", group: "copy", disabled: !H.value, reason: "No task", run: () => ke(`tasks:${H.value.id}`) },
        { label: "Stop", danger: !0, disabled: U.value || n.row.role === "main", reason: U.value ? "Process stopped" : "The main agent", run: ye(["stop"], "stopped") }
      ]
    }), Q = c(() => xt(re.value, x.value)), Be = c(() => {
      var w;
      return St((w = n.facts) == null ? void 0 : w.last_activity, x.value);
    });
    return (w, O) => {
      var ee, de, ce, oe, Ce, Le, Oe;
      return ct((a(), s("div", {
        class: ue(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: O[2] || (O[2] = (ge) => !e.open && u("toggle")),
        onKeydown: [
          O[3] || (O[3] = Ue(ae((ge) => !e.open && u("toggle"), ["self", "prevent"]), ["enter"])),
          O[4] || (O[4] = Ue(ae((ge) => !e.open && u("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        m("div", tl, [
          e.open ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back",
            "aria-label": "Back",
            onClick: O[0] || (O[0] = ae((ge) => u("toggle"), ["stop"]))
          }, [
            f(r(De), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : k("", !0),
          e.open ? (a(), s(D, { key: 1 }, [
            m("span", al, d(T.value.title), 1),
            m("span", nl, d(T.value.subtext), 1),
            f(r(te), {
              variant: "ghost",
              small: "",
              class: "agent-menu-button",
              "data-agent-menu": "",
              "aria-expanded": L.value,
              onClick: O[1] || (O[1] = ae((ge) => L.value = !L.value, ["stop"]))
            }, {
              default: p(() => [...O[5] || (O[5] = [
                h("Actions", -1)
              ])]),
              _: 1
            }, 8, ["aria-expanded"])
          ], 64)) : (a(), s(D, { key: 2 }, [
            f(r(Ct), {
              "agent-id": e.row.id,
              label: T.value.text,
              class: "agent-who"
            }, {
              default: p(() => [
                m("span", ll, d(T.value.title), 1),
                m("span", ol, d(T.value.subtext), 1)
              ]),
              _: 1
            }, 8, ["agent-id", "label"]),
            f(r(De), {
              class: "agent-chevron",
              name: "chevronRight",
              size: 12
            })
          ], 64))
        ]),
        e.open && L.value ? (a(), s("div", sl, [
          f(oa, {
            row: e.row,
            held: b.value === "blocked"
          }, null, 8, ["row", "held"])
        ])) : k("", !0),
        e.open ? k("", !0) : (a(), s("span", rl, [
          m("span", il, d(q.value), 1),
          (ee = e.facts) != null && ee.sandbox_off ? (a(), s("span", dl, "sandbox off")) : k("", !0)
        ])),
        e.open && !M.value ? (a(), z(_n, {
          key: 2,
          class: "agent-live",
          "agent-programs": r(Y).props.programs.rows.value,
          agent: e.row,
          branch: (de = e.progress) == null ? void 0 : de.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((ce = e.facts) == null ? void 0 : ce.windows) ?? [] },
          card: ""
        }, {
          default: p(() => {
            var ge;
            return [
              (ge = e.facts) != null && ge.sandbox_off ? (a(), s("span", ul, "sandbox off")) : k("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : k("", !0),
        !e.open && ((oe = e.facts) != null && oe.unit_name) ? (a(), s("div", cl, "Unit: " + d(e.facts.unit_name), 1)) : k("", !0),
        e.open ? k("", !0) : (a(), z(an, {
          key: 4,
          tasks: I.value,
          "in-hand": e.row.role !== "helper" && ((Ce = e.facts) != null && Ce.job_enabled) && H.value || null,
          job: e.row.role === "helper" ? j.value : "",
          "job-title": e.row.role === "helper" && ((Le = e.facts) == null ? void 0 : Le.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? le.value : "",
          "per-hour": B.value,
          "counts-empty": e.row.role === "worker",
          "plan-counts": ((Oe = e.facts) == null ? void 0 : Oe.plan_counts) ?? {}
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour", "counts-empty", "plan-counts"])),
        f(Ea, {
          state: b.value,
          doing: A.value,
          since: Q.value,
          seen: Be.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (a(), z(La, {
          key: 5,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: I.value,
          "stopped-with-work": X.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : k("", !0)
      ], 42, el)), [
        [r(Tt), Se]
      ]);
    };
  }
}, vl = /* @__PURE__ */ Z(gl, [["__scopeId", "data-v-bc86a7b0"]]), pl = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, ml = ["data-agent-row", "data-agent-lingering", "data-agent-waiting"], Ke = "journal.agents.filters", Ze = 300 * 1e3, Ve = "cubic-bezier(0.2, 0.9, 0.25, 1)", hl = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const l = e, t = Ee(), { rows: o } = t.props.waits, { rows: i } = t.props.progress, { rows: n, failure: u, loaded: x, more: L } = t.props.agents, T = ($) => i.value.find((R) => R.agent_id === $.id) ?? null, I = ($) => {
      var R;
      return ((R = o.value.find((C) => C.agent_id === $.id)) == null ? void 0 : R.reason) ?? "";
    }, F = E("running"), N = E(""), H = JSON.parse(localStorage.getItem(Ke) || '{"roles":[],"profiles":[],"programs":[]}'), j = E(H), V = c(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: q } = t.props.programs, Y = c(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), G = ($, R) => {
      j.value = Ot(j.value, $, R);
    }, _ = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, le = ($) => $.slice(0, 1).toUpperCase() + $.slice(1);
    ve(j, ($) => localStorage.setItem(Ke, JSON.stringify($)));
    const P = E(25);
    function X() {
      Object.assign(t.state, {
        "agents.show": F.value,
        "agents.search": N.value,
        "agents.limit": String(P.value),
        "agents.roles": j.value.roles.join(","),
        "agents.profiles": j.value.profiles.join(","),
        "agents.programs": j.value.programs.join(",")
      });
    }
    async function S() {
      return P.value += 25, X(), await t.reload("agents"), !0;
    }
    ve([F, N, j], () => {
      P.value = 25, X(), t.reload("agents");
    }), X();
    const v = ($) => $.facts ?? null, J = ($) => $.state === "running" && !!$.ended_at, b = n, y = _e(), W = E([]), g = c(() => new Set(W.value.filter(($) => y.value - $.left < Ze).map(($) => $.row.id))), B = c(() => W.value.filter(($) => g.value.has($.row.id)).map(($) => $.row)), M = c(() => [...b.value, ...B.value]);
    let A = "", re = [];
    async function U($) {
      await t.reload(`card.${$.id}`);
      const R = t.props[`card.${$.id}`].rows.value.find((C) => C.id === $.id);
      R != null && R.ended_at && !W.value.some((C) => C.row.id === $.id) && (W.value = [...W.value, { row: R, left: Date.now() }]);
    }
    ve(n, ($) => {
      const R = A === `${F.value}|${N.value}|${JSON.stringify(j.value)}` && F.value === "running", C = R ? re.filter((K) => !$.some((we) => we.id === K.id)) : [];
      A = `${F.value}|${N.value}|${JSON.stringify(j.value)}`, re = $, W.value = R ? W.value.filter((K) => y.value - K.left < Ze && !$.some((we) => we.id === K.row.id)) : [], C.forEach(U);
    }, { immediate: !0 });
    const ye = c(() => !!N.value.trim() || Y.value > 0), Se = c(() => l.texts[F.value] ?? { title: l.empty, hint: "" }), Q = E(null), Be = E(null), w = E(null), O = E(null), ee = c(() => Q.value === null ? null : t.props[`card.${Q.value}`].rows.value.find(($) => $.id === Q.value) ?? Be.value), de = c(() => ee.value ? [ee.value] : M.value), ce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, oe = E(!1);
    let Ce = 0;
    const Le = ($) => [...$.attributes].map((R) => R.name).find((R) => R.startsWith("data-agent-") && R !== "data-agent-motion") ?? "";
    async function Oe($) {
      if (oe.value) return;
      oe.value = !0, Ce = O.value.scrollTop;
      const R = w.value.querySelector(`[data-agent-open="${$.id}"]`);
      if (!ce()) {
        const Me = [...w.value.querySelectorAll(".agent-row")].filter((pe) => !pe.contains(R));
        await Promise.all(Me.map((pe) => pe.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const C = [...R.querySelectorAll(".agent-head, .agent-line")], K = [...C, ...R.querySelectorAll("[data-agent-motion]")], we = K.map(Le), Re = K.map((Me) => Me.getBoundingClientRect());
      if (Be.value = $, Q.value = $.id, t.reload(`card.${$.id}`), await Ge(), !ce()) {
        const Me = K.map((ie, me) => ie.isConnected ? ie : we[me] ? R.querySelector(`[${we[me]}]`) : null), pe = Me.map((ie) => ie == null ? void 0 : ie.getBoundingClientRect());
        Me.forEach((ie, me) => {
          if (!ie) return;
          const $e = C.findIndex((Pe) => Pe !== ie && Pe.contains(ie)), nt = Re[me].left - pe[me].left - ($e < 0 ? 0 : Re[$e].left - pe[$e].left), lt = Re[me].top - pe[me].top - ($e < 0 ? 0 : Re[$e].top - pe[$e].top);
          ie.animate([{ transform: `translate(${nt}px, ${lt}px)` }, { transform: "none" }], { duration: 280, easing: Ve });
        }), w.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((ie) => {
          ie.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Ve, fill: "backwards" });
        });
      }
      oe.value = !1;
    }
    async function ge() {
      if (oe.value || !ee.value) return;
      oe.value = !0;
      const $ = w.value.querySelector(`[data-agent-open="${Q.value}"]`), R = [...$.children], C = ce() ? [] : R.map((K) => K.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(C.map((K) => K.finished)), Q.value = null, await Ge(), O.value.scrollTop = Ce, C.forEach((K) => K.cancel()), ce() || ($.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Ve }), w.value.querySelectorAll(".agent-row").forEach((K) => {
        K.contains($) || K.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Ve });
      })), oe.value = !1;
    }
    const at = ($) => Q.value === $.id ? ge() : Oe($);
    ve(N, ($) => $.trim() && (Q.value = null)), ve(F, () => {
      Q.value = null;
    });
    const Fe = ($) => {
      $.key === "Escape" && ge();
    };
    return window.addEventListener("keydown", Fe), Ae(() => window.removeEventListener("keydown", Fe)), ($, R) => (a(), s("div", {
      ref_key: "agents",
      ref: w,
      class: ue(["agents", { focused: ee.value, "card-changing": oe.value }])
    }, [
      ee.value ? k("", !0) : (a(), z(r(jt), {
        key: 0,
        modelValue: N.value,
        "onUpdate:modelValue": R[1] || (R[1] = (C) => N.value = C),
        placeholder: "Search agents",
        "menu-count": Y.value,
        "data-agents-search": ""
      }, {
        menu: p(() => [
          f(r(Ne), null, {
            default: p(() => [...R[2] || (R[2] = [
              h("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(D, null, ne(V.value.roles, (C) => (a(), z(r(Ie), {
            key: C,
            role: "menuitemcheckbox",
            "aria-checked": j.value.roles.includes(C),
            checked: j.value.roles.includes(C),
            "data-filter-role": C,
            onClick: (K) => G("roles", C)
          }, {
            default: p(() => [
              h(d(le(C)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          V.value.profiles.length ? (a(), z(r(Ne), { key: 0 }, {
            default: p(() => [...R[3] || (R[3] = [
              h("Profile", -1)
            ])]),
            _: 1
          })) : k("", !0),
          (a(!0), s(D, null, ne(V.value.profiles, (C) => (a(), z(r(Ie), {
            key: C.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.profiles.includes(C.name),
            checked: j.value.profiles.includes(C.name),
            "data-filter-profile": C.name,
            onClick: (K) => G("profiles", C.name)
          }, {
            default: p(() => [
              h(d(C.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          f(r(Ne), null, {
            default: p(() => [...R[4] || (R[4] = [
              h("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(D, null, ne(r(q), (C) => (a(), z(r(Ie), {
            key: C.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.programs.includes(C.name),
            checked: j.value.programs.includes(C.name),
            "data-filter-program": C.name,
            onClick: (K) => G("programs", C.name)
          }, {
            default: p(() => [
              h(d(C.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          Y.value ? (a(), z(r(Ie), {
            key: 1,
            "data-filter-clear": "",
            onClick: _
          }, {
            default: p(() => [...R[5] || (R[5] = [
              h("Clear filters", -1)
            ])]),
            _: 1
          })) : k("", !0)
        ]),
        default: p(() => [
          f(r(Bt), {
            options: V.value.states,
            value: F.value,
            onPick: R[0] || (R[0] = (C) => F.value = C)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      F.value === "retired" && V.value.upgrade_retired ? (a(), s("p", pl, "Retired during the upgrade: " + d(V.value.upgrade_retired), 1)) : k("", !0),
      m("div", {
        ref_key: "list",
        ref: O,
        class: ue(["agents-view", { "agents-view-open": ee.value }])
      }, [
        r(x) && !r(u) && !de.value.length && Y.value ? (a(), z(r(qe), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: p(() => [
            f(r(te), {
              small: "",
              "data-empty-clear": "",
              onClick: _
            }, {
              default: p(() => [...R[6] || (R[6] = [
                h("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), z(r(Lt), {
          key: 1,
          moves: "",
          "leaves-at-once": oe.value,
          rows: de.value,
          failure: r(u),
          loaded: r(x),
          more: !ee.value && r(L),
          older: S,
          empty: Se.value.title,
          hint: Se.value.hint,
          searching: ye.value
        }, {
          default: p(({ row: C }) => [
            m("div", {
              class: ue(["agent-row", { lingering: g.value.has(C.id) && C.id !== Q.value, waiting: J(C) && C.id !== Q.value }]),
              "data-agent-row": C.id,
              "data-agent-lingering": g.value.has(C.id) ? "" : null,
              "data-agent-waiting": J(C) ? "" : null
            }, [
              f(vl, {
                row: C,
                facts: v(C),
                progress: T(C),
                "wait-reason": I(C),
                open: C.id === Q.value,
                onToggle: (K) => at(C)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, ml)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, yl = /* @__PURE__ */ Z(hl, [["__scopeId", "data-v-d2c54bbd"]]);
export {
  yl as A
};
