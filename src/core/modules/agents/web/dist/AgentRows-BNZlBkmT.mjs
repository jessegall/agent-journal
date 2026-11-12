import { openBlock as a, createElementBlock as s, withModifiers as ae, createElementVNode as y, createVNode as p, unref as i, withCtx as f, createTextVNode as m, Fragment as q, renderList as ne, toDisplayString as g, createBlock as N, createCommentVNode as h, ref as z, computed as c, watch as ve, onUnmounted as Se, defineAsyncComponent as Xe, createSlots as et, resolveDynamicComponent as tt, normalizeClass as de, normalizeStyle as Re, renderSlot as Ce, onMounted as at, Teleport as nt, mergeProps as ot, toRef as Ie, withKeys as De, nextTick as qe } from "vue";
import { TextInput as Ve, Btn as ee, TextArea as lt, TimeAgo as Ee, useWindow as Be, SwitchCase as Ge, peekRef as Te, Icon as ze, RunningCommand as st, FoldGroup as Je, TaskStatusIcon as it, loadWindowComponent as rt, coalesced as dt, READ_RATES as ut, eventMayBeChildOf as ct, InnerTabs as gt, TabBody as vt, EmptyState as He, HoverTip as xe, TaskBar as pt, useNow as Ke, agentTitle as mt, agentNumber as ht, age as ft, perHour as bt, sinceWords as kt, seenWords as yt, AgentTip as wt, SearchBar as Mt, Segmented as xt, MenuLabel as Oe, MenuItem as je, RowList as $t, toggleFilter as St } from "@journal/window-kit";
import { _ as Z, T as Ct } from "./TranscriptRows-h-id2yIe.mjs";
const Tt = { class: "action-buttons" }, At = {
  __name: "AgentDriverForm",
  props: { program: String, model: String, pending: Boolean },
  emits: ["submit", "cancel", "update:program", "update:model"],
  setup(e) {
    return (o, t) => (a(), s("form", {
      "data-agent-driver-form": "",
      onSubmit: t[3] || (t[3] = ae((l) => o.$emit("submit"), ["prevent"]))
    }, [
      t[6] || (t[6] = y("p", null, "Starts the next session on this program; the agent keeps its number and memories.", -1)),
      p(i(Ve), {
        "model-value": e.program,
        label: "Program",
        disabled: e.pending,
        "data-agent-driver-program": "",
        "onUpdate:modelValue": t[0] || (t[0] = (l) => o.$emit("update:program", l))
      }, null, 8, ["model-value", "disabled"]),
      p(i(Ve), {
        "model-value": e.model,
        label: "Model",
        disabled: e.pending,
        "data-agent-driver-model": "",
        "onUpdate:modelValue": t[1] || (t[1] = (l) => o.$emit("update:model", l))
      }, null, 8, ["model-value", "disabled"]),
      y("div", Tt, [
        p(i(ee), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.program.trim() || !e.model.trim(),
          "data-agent-confirm-driver": ""
        }, {
          default: f(() => [...t[4] || (t[4] = [
            m("Change the driver", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(i(ee), {
          small: "",
          disabled: e.pending,
          onClick: t[2] || (t[2] = (l) => o.$emit("cancel"))
        }, {
          default: f(() => [...t[5] || (t[5] = [
            m("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, jt = /* @__PURE__ */ Z(At, [["__scopeId", "data-v-50df3766"]]), Lt = { class: "action-field" }, Rt = ["value", "disabled"], Bt = ["value"], It = { key: 1 }, Ot = {
  key: 1,
  class: "action-field"
}, Vt = { class: "action-buttons" }, zt = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (o, t) => (a(), s("form", {
      onSubmit: t[4] || (t[4] = ae((l) => o.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (a(), s(q, { key: 0 }, [
        y("label", Lt, [
          t[6] || (t[6] = m("Task ", -1)),
          y("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: t[0] || (t[0] = (l) => o.$emit("update:task", l.target.value))
          }, [
            t[5] || (t[5] = y("option", { value: "" }, "Choose an open task", -1)),
            (a(!0), s(q, null, ne(e.tasks, (l) => (a(), s("option", {
              key: l.id,
              value: String(l.id)
            }, g(l.id) + ": " + g(l.title), 9, Bt))), 128))
          ], 40, Rt)
        ]),
        e.moreTasks ? (a(), N(i(ee), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: t[1] || (t[1] = (l) => o.$emit("more"))
        }, {
          default: f(() => [...t[7] || (t[7] = [
            m("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : h("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (a(), s("p", It, "No open tasks.")) : h("", !0)
      ], 64)) : (a(), s("label", Ot, [
        t[8] || (t[8] = m("Job", -1)),
        p(i(lt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (l) => o.$emit("update:text", l.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      y("div", Vt, [
        p(i(ee), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: f(() => [...t[9] || (t[9] = [
            m("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(i(ee), {
          small: "",
          disabled: e.pending,
          onClick: t[3] || (t[3] = (l) => o.$emit("cancel"))
        }, {
          default: f(() => [...t[10] || (t[10] = [
            m("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Ht = /* @__PURE__ */ Z(zt, [["__scopeId", "data-v-356a2712"]]), Et = { class: "action-buttons" }, Nt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (o, t) => (a(), s("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = ae((l) => o.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = y("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      p(i(Ve), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (l) => o.$emit("update:reason", l))
      }, null, 8, ["model-value", "disabled"]),
      y("div", Et, [
        p(i(ee), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: f(() => [...t[3] || (t[3] = [
            m("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(i(ee), {
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (l) => o.$emit("cancel"))
        }, {
          default: f(() => [...t[4] || (t[4] = [
            m("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Wt = /* @__PURE__ */ Z(Nt, [["__scopeId", "data-v-818a34c9"]]), Dt = {
  class: "session-history",
  "data-agent-session-history": ""
}, qt = { key: 0 }, Ft = { key: 0 }, Pt = { "data-agent-session-state": "" }, Ut = { class: "action-buttons" }, Gt = {
  __name: "AgentSessionHistory",
  props: { sessions: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e) {
    return (o, t) => (a(), s("div", Dt, [
      e.sessions.length ? h("", !0) : (a(), s("p", qt, "This agent has no session in its history.")),
      y("ol", null, [
        (a(!0), s(q, null, ne(e.sessions, (l) => (a(), s("li", {
          key: l.session,
          "data-agent-session": ""
        }, [
          y("span", null, g([l.program, l.model].filter(Boolean).join(" ")), 1),
          l.started_at ? (a(), s("span", Ft, [
            t[1] || (t[1] = m("Started ", -1)),
            p(i(Ee), {
              at: l.started_at
            }, null, 8, ["at"])
          ])) : h("", !0),
          y("span", Pt, g(l.end_reason ? `Ended: ${l.end_reason.replaceAll("_", " ")}` : l.started_at ? "Running" : "Not started"), 1),
          y("code", null, g(l.session), 1)
        ]))), 128))
      ]),
      y("div", Ut, [
        p(i(ee), {
          small: "",
          onClick: t[0] || (t[0] = (l) => o.$emit("close"))
        }, {
          default: f(() => [...t[2] || (t[2] = [
            m("Close", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Jt = /* @__PURE__ */ Z(Gt, [["__scopeId", "data-v-182feeca"]]), Kt = { class: "action-buttons" }, Zt = {
  key: 0,
  role: "alert"
}, Yt = {
  key: 1,
  role: "status"
}, _t = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 }, held: { type: Boolean, default: !1 } },
  setup(e) {
    const o = e, t = Be(), l = z(""), r = z(""), n = z(""), b = z(""), x = z(""), C = z(""), L = z([]), I = z(0), F = z(!1), O = z(!1), W = z(!1), A = z(""), V = z(""), D = z([]), _ = c(() => !!o.row.retired_at || o.row.state === "retired"), J = c(() => !_.value && !!o.row.ended_at), Q = c(() => {
      var R;
      return J.value && ((R = o.row.job_command) == null ? void 0 : R.length) && !o.row.resume_reason;
    }), oe = c(() => Q.value && !O.value && (o.row.job_task_flag ? L.value.some((R) => String(R.id) === C.value) : !!r.value.trim()));
    function P(R) {
      l.value = R, r.value = "", n.value = "", C.value = "", A.value = "", V.value = "";
    }
    async function Y() {
      P("job"), o.row.job_task_flag && (L.value = [], I.value = 0, F.value = !1, await w());
    }
    async function w() {
      if (!O.value) {
        O.value = !0;
        try {
          t.state["jobs.page"] = String(I.value + 1), await t.reload("jobs");
          const R = t.props.jobs;
          A.value = R.failure.value, A.value || (L.value = [...L.value, ...R.rows.value], I.value = R.data.value.page, F.value = R.more.value);
        } finally {
          O.value = !1;
        }
      }
    }
    async function v() {
      await U(["process", "lift-hold", String(o.row.number)], "Hold lifted.");
    }
    async function U(R, T) {
      if (!W.value) {
        W.value = !0, A.value = "";
        try {
          const se = await t.run(R);
          A.value = se.ok ? "" : se.error, se.ok && (P(""), V.value = T);
        } finally {
          W.value = !1;
        }
      }
    }
    async function k() {
      if (!oe.value) return;
      const R = o.row.job_task_flag ? [o.row.job_task_flag, C.value] : [r.value.trim()];
      await U([...o.row.job_command, String(o.row.number), ...R], "Job sent.");
    }
    async function u() {
      if (!W.value) {
        W.value = !0;
        try {
          const R = await t.run(["agent", "sessions", String(o.row.number)]);
          P(R.ok ? "history" : ""), A.value = R.ok ? "" : R.error, D.value = R.ok ? R.value.rows : [];
        } finally {
          W.value = !1;
        }
      }
    }
    function d() {
      P("driver"), b.value = o.row.program || "", x.value = "";
    }
    async function B() {
      !J.value || l.value !== "driver" || !b.value.trim() || !x.value.trim() || await U(["agent", "driver", String(o.row.number), "--program", b.value.trim(), "--model", x.value.trim()], "Driver changed.");
    }
    async function E() {
      !J.value || l.value !== "retire" || !n.value.trim() || await U(["agent", "retire", String(o.row.number), "--reason", n.value.trim()], "Agent retired permanently.");
    }
    return (R, T) => {
      var se;
      return a(), s("div", {
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: T[10] || (T[10] = ae(() => {
        }, ["stop"])),
        onKeydown: T[11] || (T[11] = ae(() => {
        }, ["stop"]))
      }, [
        y("div", Kt, [
          p(i(ee), {
            small: "",
            "data-agent-history": "",
            disabled: W.value || O.value,
            onClick: u
          }, {
            default: f(() => [...T[12] || (T[12] = [
              m("Session history", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          e.held ? (a(), N(i(ee), {
            key: 0,
            small: "",
            "data-agent-lift-hold": "",
            disabled: W.value,
            onClick: v
          }, {
            default: f(() => [...T[13] || (T[13] = [
              m("Lift this hold", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])) : h("", !0),
          J.value ? (a(), s(q, { key: 1 }, [
            (se = e.row.job_command) != null && se.length ? (a(), N(i(ee), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: W.value || O.value || !Q.value,
              onClick: Y
            }, {
              default: f(() => [...T[14] || (T[14] = [
                m("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0),
            e.row.role !== "main" ? (a(), N(i(ee), {
              key: 1,
              small: "",
              "data-agent-driver": "",
              disabled: W.value || O.value,
              onClick: d
            }, {
              default: f(() => [...T[15] || (T[15] = [
                m("Change driver", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0),
            e.row.role !== "main" ? (a(), N(i(ee), {
              key: 2,
              small: "",
              "data-agent-retire": "",
              disabled: W.value || O.value,
              onClick: T[0] || (T[0] = (K) => P("retire"))
            }, {
              default: f(() => [...T[16] || (T[16] = [
                m("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0)
          ], 64)) : h("", !0)
        ]),
        p(i(Ge), { value: l.value }, {
          job: f(() => [
            p(Ht, {
              task: C.value,
              "onUpdate:task": T[1] || (T[1] = (K) => C.value = K),
              text: r.value,
              "onUpdate:text": T[2] || (T[2] = (K) => r.value = K),
              row: e.row,
              tasks: L.value,
              pending: W.value,
              loading: O.value,
              "more-tasks": F.value,
              failure: A.value,
              "job-ready": oe.value,
              onSubmit: k,
              onMore: w,
              onCancel: T[3] || (T[3] = (K) => P(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          driver: f(() => [
            p(jt, {
              program: b.value,
              "onUpdate:program": T[4] || (T[4] = (K) => b.value = K),
              model: x.value,
              "onUpdate:model": T[5] || (T[5] = (K) => x.value = K),
              pending: W.value,
              onSubmit: B,
              onCancel: T[6] || (T[6] = (K) => P(""))
            }, null, 8, ["program", "model", "pending"])
          ]),
          history: f(() => [
            p(Jt, {
              sessions: D.value,
              onClose: T[7] || (T[7] = (K) => P(""))
            }, null, 8, ["sessions"])
          ]),
          retire: f(() => [
            p(Wt, {
              reason: n.value,
              "onUpdate:reason": T[8] || (T[8] = (K) => n.value = K),
              pending: W.value,
              onSubmit: E,
              onCancel: T[9] || (T[9] = (K) => P(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        A.value ? (a(), s("p", Zt, g(A.value), 1)) : h("", !0),
        V.value ? (a(), s("p", Yt, g(V.value), 1)) : h("", !0)
      ], 32);
    };
  }
}, Qt = /* @__PURE__ */ Z(_t, [["__scopeId", "data-v-19c0d208"]]), Xt = {
  class: "agent-command",
  "data-agent-command": ""
}, ea = {
  key: 1,
  "data-agent-stopped": ""
}, ta = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (o, t) => (a(), s("span", Xt, [
      e.waitReason ? (a(), s("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: t[0] || (t[0] = ae((l) => i(Te)("test_queue:0"), ["stop"]))
      }, [
        m("Waiting: " + g(e.waitReason) + " ", 1),
        p(i(ze), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), s("span", ea, "Waiting")) : (a(), N(i(st), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, aa = /* @__PURE__ */ Z(ta, [["__scopeId", "data-v-bb905922"]]), na = {
  key: 0,
  class: "lasting-facts",
  "data-agent-lasting-facts": ""
}, oa = { "data-agent-retired-at": "" }, la = { key: 0 }, sa = { "data-agent-retired-by": "" }, ia = {
  __name: "AgentLastingFacts",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    return (o, t) => e.row.retired_at ? (a(), s("dl", na, [
      y("div", null, [
        t[0] || (t[0] = y("dt", null, "Retired", -1)),
        y("dd", oa, [
          p(i(Ee), {
            at: e.row.retired_at
          }, null, 8, ["at"])
        ])
      ]),
      e.row.retiring_actor_name ? (a(), s("div", la, [
        t[1] || (t[1] = y("dt", null, "Retired by", -1)),
        y("dd", sa, g(e.row.retiring_actor_name), 1)
      ])) : h("", !0)
    ])) : h("", !0);
  }
}, ra = /* @__PURE__ */ Z(ia, [["__scopeId", "data-v-77a54780"]]), da = ["data-agent-delegated", "onClick"], ua = { class: "agent-task-number" }, ca = { class: "agent-task-title" }, ga = ["title"], va = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = o;
    return (l, r) => (a(), N(i(Je), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: r[0] || (r[0] = (n) => t("toggle"))
    }, {
      default: f(() => [
        (a(!0), s(q, null, ne(e.section.tasks, (n) => (a(), s("button", {
          key: n.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": n.id,
          onClick: (b) => i(Te)(`tasks:${n.id}`)
        }, [
          p(i(it), {
            status: n.state
          }, null, 8, ["status"]),
          y("span", ua, g(n.id), 1),
          y("span", ca, g(n.title), 1),
          n.plan_id ? (a(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${n.plan_id}: ${n.plan_title}`
          }, "Plan " + g(n.plan_id), 9, ga)) : h("", !0)
        ], 8, da))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, pa = /* @__PURE__ */ Z(va, [["__scopeId", "data-v-dbdcae3e"]]), ma = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, ha = {
  key: 1,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, fa = ["data-peek", "onClick"], ba = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ka = {
  key: 0,
  class: "agent-helper-brief"
}, ya = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, wa = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Ma = "It ended without a report", xa = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const o = e, t = ["started", "blocked", "open", "completed"], l = c(() => {
      var k, u;
      return o.row.ended_at && ((u = (k = o.facts) == null ? void 0 : k.job_returned) != null && u.startsWith(Ma)) ? o.facts.job_returned : "";
    }), r = c(() => o.tasks.length ? t.map((k) => ({ state: k, label: k.slice(0, 1).toUpperCase() + k.slice(1), tasks: o.tasks.filter((u) => u.state === k || k === "started" && u.state === "testing" || k === "completed" && u.state === "cancelled") })) : []), n = /* @__PURE__ */ new Set(["completed"]), b = z({}), x = (k) => !(b.value[k] ?? n.has(k)), C = (k) => b.value = { ...b.value, [k]: x(k) }, L = Be(), { rows: I } = L.props.reports;
    L.state["reports.agent"] = String(o.row.number);
    const F = c(() => o.row.access === "read-only"), O = ["tasks", "transcript", "terminal", "file-feed", "processes", "reports", "memories"], W = c(() => [...L.tabs].sort((k, u) => (O.indexOf(k.key) < 0 ? O.length : O.indexOf(k.key)) - (O.indexOf(u.key) < 0 ? O.length : O.indexOf(u.key)))), A = c(() => !!o.row.retired_at || o.row.state === "retired"), V = () => F.value || A.value ? W.value.find((k) => k.key === "transcript") : W.value[0], D = z(V());
    ve(D, (k) => {
      L.state.tab = (k == null ? void 0 : k.key) ?? "";
    }, { immediate: !0 }), Se(() => {
      L.state.tab = "";
    }), ve(W, (k) => {
      k.some((u) => {
        var d;
        return u.key === ((d = D.value) == null ? void 0 : d.key);
      }) || (D.value = k[0]);
    }), ve(() => o.open, (k) => {
      k && (D.value = V());
    });
    const _ = Object.fromEntries(L.tabs.filter((k) => k.component).map((k) => [k.key, Xe(() => rt(k.component))])), J = z(!1), { data: Q } = L.props.tool, oe = c(() => {
      var k;
      return ((k = Q.value) == null ? void 0 : k.tool) ?? "";
    }), P = c(() => {
      var k;
      return ((k = Q.value) == null ? void 0 : k.note) ?? "";
    }), Y = c(() => o.row.role !== "main" && (!o.row.ended_at || o.stoppedWithWork || o.waitReason));
    async function w() {
      !o.open || !Y.value || (L.state["tool.agent"] = String(o.row.number), await L.reload("tool"));
    }
    const v = dt(w, ut.agentCommand), U = L.follow(["hook_call.*", "process_part.*"], (k) => ct(k, "session_agent_id", /* @__PURE__ */ new Set([o.row.id])) && v());
    return Se(() => U == null ? void 0 : U()), ve(() => o.open, (k) => {
      k && w();
    }, { immediate: !0 }), (k, u) => {
      var d;
      return a(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: u[2] || (u[2] = ae(() => {
        }, ["stop"]))
      }, [
        p(ra, { row: e.row }, null, 8, ["row"]),
        e.row.retirement_reason ? (a(), s("p", ma, "Retirement reason: " + g(e.row.retirement_reason), 1)) : h("", !0),
        l.value ? (a(), s("p", ha, g(l.value), 1)) : h("", !0),
        p(i(gt), {
          class: "agent-tabs",
          tabs: W.value,
          active: D.value,
          answer: { tasks: e.tasks.length, reports: e.row.report_count ?? i(I).length, memories: e.row.memory_count ?? 0 },
          onChoose: u[0] || (u[0] = (B) => D.value = B)
        }, null, 8, ["tabs", "active", "answer"]),
        p(i(vt), {
          class: "agent-tab-body",
          tab: D.value,
          "data-agent-tab-body": (d = D.value) == null ? void 0 : d.key
        }, {
          default: f(() => {
            var B;
            return [
              p(i(Ge), {
                value: (B = D.value) == null ? void 0 : B.key
              }, et({
                reports: f(() => [
                  i(I).length ? h("", !0) : (a(), N(i(He), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: f(() => [...u[3] || (u[3] = [
                      m("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (a(!0), s(q, null, ne(i(I), (E) => (a(), s("button", {
                    key: E.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${E.id}`,
                    onClick: (R) => i(Te)(`messages:${E.id}`)
                  }, g(E.text), 9, fa))), 128))
                ]),
                tasks: f(() => {
                  var E;
                  return [
                    e.tasks.length ? h("", !0) : (a(), N(i(He), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: f(() => [...u[4] || (u[4] = [
                        m("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (a(!0), s(q, null, ne(r.value, (R) => (a(), N(pa, {
                      key: R.state,
                      section: R,
                      open: x(R.state),
                      onToggle: (T) => C(R.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (E = e.facts) != null && E.instruction ? (a(), s(q, { key: 1 }, [
                      u[5] || (u[5] = y("p", { class: "agent-label" }, "Instruction", -1)),
                      y("div", ba, g(e.facts.instruction), 1)
                    ], 64)) : h("", !0)
                  ];
                }),
                transcript: f(() => {
                  var E;
                  return [
                    F.value ? (a(), s(q, { key: 0 }, [
                      (E = e.facts) != null && E.instruction ? (a(), s("div", ka, [
                        p(i(Je), {
                          label: "Instruction",
                          open: J.value,
                          "data-agent-section": "instruction",
                          onToggle: u[1] || (u[1] = (R) => J.value = !J.value)
                        }, {
                          default: f(() => [
                            y("div", ya, g(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (a(), s("p", wa, "No job recorded")) : h("", !0)
                    ], 64)) : h("", !0),
                    p(Ct, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                ne(i(_), (E, R) => ({
                  name: R,
                  fn: f(() => [
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
        Y.value ? (a(), N(aa, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: oe.value,
          note: P.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : h("", !0)
      ]);
    };
  }
}, $a = /* @__PURE__ */ Z(xa, [["__scopeId", "data-v-83e4209c"]]), Sa = { class: "line" }, Ca = {
  key: 0,
  class: "line",
  "data-agent-since": ""
}, Ta = {
  key: 1,
  class: "line",
  "data-agent-seen": ""
}, Aa = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" }, seen: { type: String, default: "" } },
  setup(e) {
    const o = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, l = c(() => o.has(t.state)), r = c(() => [t.doing, t.since, t.seen].filter(Boolean).join(". "));
    return (n, b) => (a(), N(i(xe), {
      as: "button",
      place: "corner",
      class: de(["agent-dot", { pulse: l.value }]),
      "data-state": e.state,
      "aria-label": r.value,
      "data-agent-status": "",
      onClick: b[0] || (b[0] = ae(() => {
      }, ["stop"]))
    }, {
      tip: f(() => [
        y("b", Sa, g(e.doing), 1),
        e.since ? (a(), s("span", Ca, g(e.since), 1)) : h("", !0),
        e.seen ? (a(), s("span", Ta, g(e.seen), 1)) : h("", !0)
      ]),
      default: f(() => [
        b[1] || (b[1] = y("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, ja = /* @__PURE__ */ Z(Aa, [["__scopeId", "data-v-a51f28ad"]]), La = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, Ra = (e) => e.filter((o) => o.state !== "cancelled"), Fe = (e, o) => e.filter((t) => t.state === o).length, Ba = 5, Ia = (e, o) => e || o.split(/\s+/).slice(0, Ba).join(" ");
function Oa({ tasks: e, inHand: o, perHour: t }) {
  const l = Ra(e), r = Fe(l, "completed"), n = La[o == null ? void 0 : o.state], b = l.filter((I) => I.state === "started").map((I) => ({ number: I.id, title: I.title })), x = Math.max(b.length, o && o.state !== "completed" ? 1 : 0), C = l.length - r - x, L = r === l.length;
  return {
    number: o.id,
    title: o.title,
    started: b,
    plan: o.plan_id ?? 0,
    count: `${r} of ${l.length}`,
    taskTip: `${r} of its ${l.length} tasks done${n ? `. This one is ${n.words}.` : "."}`,
    countTip: L ? `All ${l.length} tasks done` : `${r} done, ${x} in hand, ${C} to go`,
    paceTip: !L && t ? `About ${t} an hour.` : "",
    rate: !L && t ? `${Math.round(t)}/hour` : "",
    bar: { total: l.length, done: r, testing: Fe(l, "testing") }
  };
}
const Va = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, za = {
  key: 0,
  class: "plan",
  "data-agent-job-launch": ""
}, Ha = {
  class: "task-line",
  "data-agent-task-line": ""
}, Ea = {
  key: 0,
  class: "tasks",
  "data-agent-tasks": ""
}, Na = {
  key: 2,
  class: "plan",
  "data-agent-plan": ""
}, Wa = {
  key: 3,
  class: "rate",
  "data-agent-rate": ""
}, Da = { key: 0 }, qa = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, jobTitle: { type: String, default: "" }, jobLaunch: { type: String, default: "" }, perHour: { type: Number, default: 0 } },
  setup(e) {
    const o = e, t = c(() => o.inHand ? Oa({ tasks: o.tasks, inHand: o.inHand, perHour: o.perHour }) : null);
    return (l, r) => e.job && !t.value ? (a(), s("span", Va, [
      p(i(xe), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: f(() => [
          y("b", null, g(e.job), 1)
        ]),
        default: f(() => [
          m(g(i(Ia)(e.jobTitle, e.job)), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (a(), s("span", za, g(e.jobLaunch), 1)) : h("", !0)
    ])) : t.value ? (a(), s(q, { key: 1 }, [
      y("span", Ha, [
        t.value.started.length > 1 ? (a(), s("span", Ea, [
          r[1] || (r[1] = m("Tasks ", -1)),
          (a(!0), s(q, null, ne(t.value.started, (n, b) => (a(), s(q, {
            key: n.number
          }, [
            b ? (a(), s(q, { key: 0 }, [
              m(", ")
            ], 64)) : h("", !0),
            p(i(xe), {
              as: "button",
              class: "task",
              "data-agent-task": "",
              "data-peek": `tasks:${n.number}`,
              "aria-label": `Task ${n.number}: ${n.title}`,
              onClick: ae((x) => i(Te)(`tasks:${n.number}`), ["stop"])
            }, {
              tip: f(() => [
                y("b", null, g(n.title), 1)
              ]),
              default: f(() => [
                m(g(n.number), 1)
              ]),
              _: 2
            }, 1032, ["data-peek", "aria-label", "onClick"])
          ], 64))), 128))
        ])) : (a(), N(i(xe), {
          key: 1,
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${t.value.number}`,
          "aria-label": `Task ${t.value.number}: ${t.value.title}`,
          onClick: r[0] || (r[0] = ae((n) => i(Te)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: f(() => [
            y("b", null, g(t.value.title), 1),
            y("span", null, g(t.value.taskTip), 1)
          ]),
          default: f(() => [
            m("Task " + g(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])),
        t.value.plan ? (a(), s("span", Na, "Plan " + g(t.value.plan), 1)) : h("", !0),
        t.value.rate ? (a(), s("span", Wa, g(t.value.rate), 1)) : h("", !0),
        p(i(xe), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: f(() => [
            y("b", null, g(t.value.countTip), 1),
            t.value.paceTip ? (a(), s("span", Da, g(t.value.paceTip), 1)) : h("", !0)
          ]),
          default: f(() => [
            m(g(t.value.count), 1)
          ]),
          _: 1
        })
      ]),
      p(i(pt), {
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: t.value.bar.total,
        done: t.value.bar.done,
        testing: t.value.bar.testing
      }, null, 8, ["total", "done", "testing"])
    ], 64)) : h("", !0);
  }
}, Fa = /* @__PURE__ */ Z(qa, [["__scopeId", "data-v-4fdd9e5c"]]), Pa = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Ua = ["data-icon", "stroke-width", "innerHTML"], te = {
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
    }, r = {
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
    return (n, b) => (a(), s("svg", {
      class: "ico",
      "data-icon": e.name,
      style: Re({
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
      innerHTML: r[l[e.name] || e.name] || r.dot
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
    return (o, t) => (a(), s("button", {
      type: "button",
      class: de(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), s("span", Ga, g(e.checked ? "✓" : ""), 1)) : h("", !0),
      e.description ? (a(), s("span", Ja, [
        y("span", null, [
          Ce(o.$slots, "default", {}, void 0, !0)
        ]),
        y("small", null, g(e.description), 1)
      ])) : Ce(o.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ke = /* @__PURE__ */ Z(Ka, [["__scopeId", "data-v-9c67fe37"]]), Za = {}, Ya = { class: "menu-label" };
function _a(e, o) {
  return a(), s("span", Ya, [
    Ce(e.$slots, "default", {}, void 0, !0)
  ]);
}
const $e = /* @__PURE__ */ Z(Za, [["render", _a], ["__scopeId", "data-v-71c11156"]]), Qa = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, Xa = {
  key: 0,
  class: "skills-none"
}, en = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: o }) {
    const t = e, l = o, r = c(() => t.skills.filter((b) => b.state === "loaded")), n = c(() => t.skills.filter((b) => b.state !== "loaded"));
    return (b, x) => (a(), s("div", Qa, [
      p($e, null, {
        default: f(() => [...x[1] || (x[1] = [
          m("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      r.value.length ? h("", !0) : (a(), s("p", Xa, "None yet. Compacting the conversation empties this list.")),
      (a(!0), s(q, null, ne(r.value, (C) => (a(), s("p", {
        key: C.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        p(te, {
          name: "book",
          size: 12
        }),
        m(g(C.skill), 1)
      ]))), 128)),
      n.value.length ? (a(), s(q, { key: 1 }, [
        p($e, null, {
          default: f(() => [...x[2] || (x[2] = [
            m("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), s(q, null, ne(n.value, (C) => (a(), s("p", {
          key: C.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          p(te, {
            name: "book",
            size: 12
          }),
          m(g(C.skill), 1)
        ]))), 128))
      ], 64)) : h("", !0),
      p(ke, {
        "data-agent-skills-browse": "",
        onClick: x[0] || (x[0] = (C) => l("browse"))
      }, {
        default: f(() => [...x[3] || (x[3] = [
          m("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, tn = /* @__PURE__ */ Z(en, [["__scopeId", "data-v-27140adf"]]), an = ["disabled", "title"], nn = { class: "gauge usage" }, on = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: o }) {
    const t = e, l = o, r = c(() => t.windows[0] ?? null), n = c(() => r.value && Number.isFinite(r.value.used_percent) ? Math.max(0, Math.min(100, Math.round(r.value.used_percent))) : null), b = c(() => n.value !== null && n.value >= 100), x = c(() => {
      var L;
      return (L = r.value) != null && L.reset_epoch_seconds ? new Date(r.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), C = c(() => b.value ? `At usage limit: the plan's ${r.value.title} allowance is used up${x.value ? `, starts again ${x.value}` : ""}` : `${n.value}% of the plan's ${r.value.title} allowance used${x.value ? `, starts again ${x.value}` : ""}`);
    return (L, I) => n.value !== null ? (a(), s("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: C.value,
      onClick: I[0] || (I[0] = (F) => l("open", F.currentTarget))
    }, [
      p(te, {
        name: "allowance",
        size: 12
      }),
      I[1] || (I[1] = m()),
      y("span", nn, [
        y("span", {
          style: Re({ width: `${n.value}%` })
        }, null, 4)
      ]),
      m(" " + g(b.value ? "At usage limit" : `${n.value}%`), 1)
    ], 8, an)) : h("", !0);
  }
}, ln = /* @__PURE__ */ Z(on, [["__scopeId", "data-v-82d641a0"]]), sn = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (o, t) => (a(), s("span", {
      class: de(["badge", e.tone])
    }, g(e.text), 3));
  }
}, rn = /* @__PURE__ */ Z(sn, [["__scopeId", "data-v-6ef74765"]]), dn = (e, o, t) => Math.max(o, Math.min(t, e)), Ze = /* @__PURE__ */ new WeakMap(), un = (e, o) => Ze.set(e, o);
function cn(e, o) {
  for (let t = o; t; t = Ze.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function gn(e, o) {
  const t = (l) => {
    var n, b;
    const r = ((n = e.value) == null ? void 0 : n.element) || ((b = e.value) == null ? void 0 : b.$el) || e.value;
    r && !cn(r, l.target) && o(l);
  };
  window.addEventListener("click", t), Se(() => window.removeEventListener("click", t));
}
const be = 8, vn = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const l = e, r = z(null), n = (d) => d ? `${d}px` : void 0, b = c(() => ({
      minWidth: n(l.minWidth),
      maxWidth: n(l.maxWidth),
      maxHeight: n(l.maxHeight),
      height: n(l.height)
    })), x = z({ w: 0, h: 0 }), C = z(l.anchor ? l.anchor.getBoundingClientRect() : null), L = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), I = (d) => ({
      left: Math.max(0, d.left),
      top: Math.max(0, d.top),
      right: Math.min(window.innerWidth, d.right),
      bottom: Math.min(window.innerHeight, d.bottom)
    }), F = (d) => {
      const B = d.closest(".pane, .float-window");
      return B ? I(B.getBoundingClientRect()) : L();
    }, O = (d, B) => `${Math.max(0, d ? Math.min(d, B) : B)}px`;
    function W(d, B) {
      return {
        below: d.bottom - B.bottom - l.gap - be,
        above: B.top - d.top - l.gap - be,
        across: d.right - d.left - 2 * be
      };
    }
    function A(d) {
      const B = F(l.anchor), E = W(B, d);
      return x.value.w <= E.across && x.value.h <= Math.max(E.below, E.above) ? B : L();
    }
    const V = c(() => {
      if (!C.value) return b.value;
      const d = C.value, B = A(d), E = W(B, d), { w: R, h: T } = x.value, se = l.align === "auto" ? d.left + d.right > B.left + B.right : l.align === "right", K = dn(se ? d.right - R : d.left, B.left + be, Math.max(B.left + be, B.right - R - be)), X = T > E.below && E.above > E.below ? { bottom: `${window.innerHeight - d.top + l.gap}px`, maxHeight: O(l.maxHeight, E.above) } : { top: `${d.bottom + l.gap}px`, maxHeight: O(l.maxHeight, E.below) };
      return { ...b.value, ...X, left: `${K}px`, maxWidth: O(l.maxWidth, E.across) };
    }), D = t, _ = () => [...r.value.querySelectorAll("button:not(:disabled)")];
    function J(d) {
      const B = _(), E = B.indexOf(document.activeElement);
      B[(E + d + B.length) % B.length].focus();
    }
    const Q = { ArrowDown: () => J(1), ArrowUp: () => J(-1), Escape: () => D("close") }, oe = (d) => Q[d.key] && (d.preventDefault(), Q[d.key]()), P = () => r.value && (x.value = { w: r.value.offsetWidth, h: r.value.scrollHeight });
    let Y = 0;
    const w = new ResizeObserver(() => {
      cancelAnimationFrame(Y), Y = requestAnimationFrame(P);
    });
    gn(r, (d) => l.anchor && !l.anchor.contains(d.target) && D("close"));
    const v = (d, B) => ["top", "left", "right", "bottom"].some((E) => Math.abs(d[E] - B[E]) > 1), U = (d) => d.bottom < 0 || d.top > window.innerHeight;
    let k = 0;
    function u() {
      if (l.anchor) {
        const d = l.anchor.getBoundingClientRect();
        if (!l.anchor.isConnected || U(d)) return D("close");
        v(d, C.value) && (C.value = d);
      }
      k = requestAnimationFrame(u);
    }
    return at(() => {
      l.anchor && r.value && un(r.value, l.anchor), P(), r.value && w.observe(r.value), !l.plain && _()[0] && _()[0].focus(), u();
    }), Se(() => {
      w.disconnect(), cancelAnimationFrame(k), cancelAnimationFrame(Y);
    }), o({ element: r }), (d, B) => (a(), N(nt, {
      to: "body",
      disabled: !e.anchor
    }, [
      y("div", ot({
        ref_key: "panel",
        ref: r
      }, d.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: V.value,
        onKeydown: oe
      }), [
        Ce(d.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), pn = /* @__PURE__ */ Z(vn, [["__scopeId", "data-v-7f046e0d"]]);
async function mn(e, o, t) {
  if (!e) return t(o);
  const { target: l, fields: r } = e, n = Object.fromEntries(Object.keys(r).map((C) => [C, l[C]])), b = () => Object.assign(l, n);
  Object.assign(l, r);
  let x = !1;
  try {
    const C = await t(o);
    return x = C.ok, C;
  } finally {
    x || b();
  }
}
function hn(e, o, t, { groups: l, programs: r }) {
  const n = z({}), b = z(""), x = z(!1), C = c(() => !!e.value && !e.value.ended_at), L = c(() => C.value && !!e.value.paused_at);
  async function I(A, V = null) {
    b.value = "";
    const D = await mn(V, A, o);
    return b.value = D.ok ? "" : D.error, t(), D;
  }
  return { groups: l, programs: r, chosen: n, failure: b, asking: x, running: C, paused: L, choose: (A, V) => I(["agent", "control", String(e.value.number), A, V.value], { target: n, fields: { value: { ...n.value, [A]: V.label } } }), stop: () => (x.value = !1, I(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (A) => I(["agent", "launch", A.name]) };
}
function fn(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const bn = { compact: "Compaction", clear: "Clear" };
function kn(e) {
  return e != null && e.is_open ? `${bn[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
const yn = ["disabled", "title"], wn = ["disabled", "title"], Mn = { class: "gauge" }, xn = {
  key: 1,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
}, $n = ["disabled", "title"], Sn = ["disabled"], Cn = ["disabled"], Tn = {
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
}, Rn = { class: "gauge" }, Bn = { class: "context-used" }, In = {
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
  setup(e, { emit: o }) {
    const t = e, l = o, r = hn(Ie(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => l("changed"), { groups: Ie(t, "controlGroups"), programs: Ie(t, "agentPrograms") }), n = z(null), b = z(""), x = c(() => r.groups.value.find((w) => w.key === b.value));
    function C(w, v) {
      n.value = w.currentTarget, b.value = v;
    }
    function L() {
      n.value = null, b.value = "", r.asking.value = !1;
    }
    const I = c(() => t.skills.filter((w) => w.state === "loaded"));
    function F(w) {
      C(w, "skills"), l("skills");
    }
    const O = (w) => r.groups.value.some((v) => v.key === w), W = c(() => {
      var w;
      return r.chosen.value.model ?? ((w = V.value) == null ? void 0 : w.model) ?? "";
    }), A = c(() => {
      var w;
      return r.chosen.value.effort ?? ((w = V.value) == null ? void 0 : w.effort) ?? "";
    });
    c(() => !!t.agent && !t.agent.ended_at);
    const V = c(() => {
      var w;
      return ((w = t.usage.agents) == null ? void 0 : w.find((v) => {
        var U;
        return v.id === ((U = t.agent) == null ? void 0 : U.id);
      })) ?? null;
    }), D = c(() => {
      var w;
      return ((w = V.value) == null ? void 0 : w.context_percent) == null ? null : Math.round(V.value.context_percent);
    }), _ = c(() => {
      var w;
      return kn(((w = V.value) == null ? void 0 : w.context_change) ?? null);
    }), J = (w) => `${Math.round(w / 1e3)}k`, Q = c(() => {
      var w;
      return !!((w = V.value) != null && w.context_limit_tokens);
    }), oe = c(() => {
      var w, v;
      return ((w = V.value) == null ? void 0 : w.context_limit_tokens) || ((v = V.value) == null ? void 0 : v.context_window_tokens) || 0;
    }), P = c(() => oe.value ? `${J(V.value.context_tokens ?? 0)} of ${J(oe.value)}` : ""), Y = c(() => {
      var w;
      return (w = V.value) != null && w.cost_dollars ? `$${V.value.cost_dollars.toFixed(2)}` : "";
    });
    return (w, v) => {
      var U, k;
      return a(), s("div", {
        class: de(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (a(), s(q, { key: 0 }, [
          y("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: v[0] || (v[0] = (u) => C(u, "agent"))
          }, [
            p(te, {
              name: "agents",
              size: 12
            }),
            m(" " + g(((U = e.agentPrograms.find((u) => u.name === e.agent.program)) == null ? void 0 : U.title) || e.agent.program), 1)
          ], 8, yn),
          p(ln, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: v[1] || (v[1] = (u) => l("open", "usage", u))
          }, null, 8, ["windows", "disabled"]),
          D.value !== null ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${D.value}% full: clear or compact it`,
            onClick: v[2] || (v[2] = (u) => O("context") ? C(u, "context") : l("open", "context", u.currentTarget))
          }, [
            p(te, {
              name: "gauge",
              size: 12
            }),
            v[14] || (v[14] = m()),
            y("span", Mn, [
              y("span", {
                style: Re({ width: `${D.value}%` })
              }, null, 4)
            ]),
            m(" " + g(D.value) + "% ", 1)
          ], 8, wn)) : (k = V.value) != null && k.context_unknown ? (a(), s("span", xn, [
            p(te, {
              name: "gauge",
              size: 12
            }),
            v[15] || (v[15] = m(" Context: unknown", -1))
          ])) : h("", !0),
          W.value ? (a(), s("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${W.value}: change the model`,
            onClick: v[3] || (v[3] = (u) => O("model") ? C(u, "model") : null)
          }, [
            p(te, {
              name: "model",
              size: 12
            }),
            m(" " + g(W.value), 1)
          ], 8, $n)) : h("", !0),
          O("effort") || e.card && A.value ? (a(), s("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: v[4] || (v[4] = (u) => C(u, "effort"))
          }, [
            p(te, {
              name: "bolt",
              size: 12
            }),
            m(" " + g(A.value), 1)
          ], 8, Sn)) : h("", !0),
          Y.value ? (a(), s("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: v[5] || (v[5] = (u) => l("open", "cost", u.currentTarget))
          }, g(Y.value), 9, Cn)) : h("", !0),
          e.branch ? (a(), s("span", Tn, [
            p(te, {
              name: "branch",
              size: 12
            }),
            m(" " + g(e.branch), 1)
          ])) : h("", !0),
          e.card ? h("", !0) : (a(), s("button", {
            key: 6,
            type: "button",
            class: de(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: v[6] || (v[6] = (u) => l("open", "jobs", u.currentTarget))
          }, [
            p(te, {
              name: "clock",
              size: 12
            }),
            m(" " + g(e.jobs), 1)
          ], 2)),
          e.run ? (a(), s("button", {
            key: 7,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: F
          }, [
            p(te, {
              name: "book",
              size: 12
            }),
            m(" " + g(I.value.length), 1)
          ])) : h("", !0),
          e.fitness ? (a(), s(q, { key: 8 }, [
            y("button", {
              type: "button",
              class: de(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Vn }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: v[7] || (v[7] = (u) => l("open", "fitness", u.currentTarget))
            }, [
              p(te, {
                name: "heart",
                size: 12
              }),
              m(" " + g(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            y("button", {
              type: "button",
              class: de(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: v[8] || (v[8] = (u) => l("open", "load", u.currentTarget))
            }, [
              p(te, {
                name: "weight",
                size: 12
              }),
              m(" " + g(e.fitness.workload), 1)
            ], 2)
          ], 64)) : h("", !0)
        ], 64)) : e.run && !e.loading ? (a(), s("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: v[9] || (v[9] = (u) => C(u, "start"))
        }, [
          p(te, {
            name: "agents",
            size: 12
          }),
          v[16] || (v[16] = m(" Start an agent", -1))
        ])) : h("", !0),
        v[22] || (v[22] = y("span", { class: "space" }, null, -1)),
        i(r).failure.value ? (a(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: i(r).failure.value
        }, g(i(r).failure.value), 9, An)) : h("", !0),
        Ce(w.$slots, "default", {}, void 0, !0),
        n.value ? (a(), N(pn, {
          key: 3,
          anchor: n.value,
          "min-width": 190,
          onClose: L
        }, {
          default: f(() => {
            var u;
            return [
              b.value === "agent" ? (a(), s(q, { key: 0 }, [
                i(r).asking.value ? (a(), s(q, { key: 0 }, [
                  p($e, { "data-agent-stop-ask": "" }, {
                    default: f(() => [...v[17] || (v[17] = [
                      m("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  p(ke, {
                    "data-agent-stop-confirm": "",
                    onClick: v[10] || (v[10] = (d) => (L(), i(r).stop()))
                  }, {
                    default: f(() => [...v[18] || (v[18] = [
                      m("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  p(ke, {
                    onClick: v[11] || (v[11] = (d) => i(r).asking.value = !1)
                  }, {
                    default: f(() => [...v[19] || (v[19] = [
                      m("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (a(), N(ke, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: v[12] || (v[12] = (d) => i(r).asking.value = !0)
                }, {
                  default: f(() => [...v[20] || (v[20] = [
                    m("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : b.value === "start" ? (a(), s(q, { key: 1 }, [
                p($e, null, {
                  default: f(() => [...v[21] || (v[21] = [
                    m("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (a(!0), s(q, null, ne(i(r).programs.value, (d) => (a(), N(ke, {
                  key: d.name,
                  "data-agent-program": d.name,
                  onClick: (B) => (L(), i(r).start(d))
                }, {
                  default: f(() => [
                    m(g(d.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : b.value === "skills" ? (a(), N(tn, {
                key: 2,
                skills: e.skills,
                onBrowse: v[13] || (v[13] = (d) => (L(), l("open", "skills", null)))
              }, null, 8, ["skills"])) : x.value ? (a(), s(q, { key: 3 }, [
                p($e, null, {
                  default: f(() => [
                    m(g(x.value.label), 1)
                  ]),
                  _: 1
                }),
                b.value === "context" ? (a(), s(q, { key: 0 }, [
                  y("p", jn, g(i(fn)(((u = V.value) == null ? void 0 : u.last_compaction) ?? null)), 1),
                  y("div", Ln, [
                    y("span", Rn, [
                      y("span", {
                        style: Re({ width: `${D.value}%` })
                      }, null, 4)
                    ]),
                    y("span", Bn, g(D.value) + "%", 1)
                  ]),
                  P.value ? (a(), s("p", In, [
                    m(g(P.value) + " ", 1),
                    Q.value ? (a(), N(rn, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : h("", !0)
                  ])) : h("", !0)
                ], 64)) : h("", !0),
                b.value === "context" && _.value ? (a(), s("p", On, g(_.value), 1)) : (a(!0), s(q, { key: 2 }, ne(x.value.choices, (d) => (a(), N(ke, {
                  key: d.value,
                  "data-agent-choice": d.value,
                  onClick: (B) => (i(r).choose(x.value.key, d), L())
                }, {
                  default: f(() => [
                    m(g(d.label), 1)
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
}, Hn = /* @__PURE__ */ Z(zn, [["__scopeId", "data-v-f3afd1a9"]]), En = ["data-agent-open", "aria-expanded", "role", "tabindex"], Nn = {
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
  class: "agent-live-fact",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, Yn = {
  key: 1,
  class: "agent-live-fact",
  "data-agent-last-heard": ""
}, _n = {
  key: 3,
  class: "agent-unit",
  "data-agent-unit": ""
}, Qn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), l = ["completed", "testing"], r = { running: "Working", starting: "Starting", stopping: "Stopping", ended: "Idle: its process has stopped", failed: "Could not start", never_started: "Not started" }, n = e, b = o, x = Ke(), C = z(!1), L = c(() => mt(n.row, n.facts)), I = c(() => {
      var M;
      return ((M = n.facts) == null ? void 0 : M.tasks) ?? [];
    }), F = c(() => I.value.filter((M) => M.state === "open")), O = c(() => I.value.find((M) => {
      var j;
      return M.id === ((j = n.progress) == null ? void 0 : j.task_id) && M.state === "started";
    })), W = c(() => O.value || I.value.find((M) => {
      var j;
      return M.id === ((j = n.facts) == null ? void 0 : j.task_id);
    }) || I.value.find((M) => t.has(M.state)) || F.value[0] || I.value.at(-1)), A = c(() => {
      var M, j, ce, le, pe, ue;
      return n.row.role === "helper" ? ((M = n.facts) == null ? void 0 : M.helper_job) || "" : (j = n.facts) != null && j.job_enabled && (((ce = O.value) == null ? void 0 : ce.title) || ((le = n.facts) == null ? void 0 : le.task_title) || ((pe = F.value[0]) == null ? void 0 : pe.title) || ((ue = I.value.at(-1)) == null ? void 0 : ue.title)) || "";
    }), V = c(() => ht(n.row)), D = c(() => {
      var M, j;
      return [n.row.program, (M = n.facts) == null ? void 0 : M.model, (j = n.facts) == null ? void 0 : j.effort, V.value].filter(Boolean).join(" · ");
    }), _ = Be(), J = c(() => ft(n.row.process_started_at || n.row.created_at, x.value)), Q = /* @__PURE__ */ new Set(["open", "started", "testing"]), oe = { fresh: "new conversation", resumed: "resumed" }, P = c(() => {
      var M, j;
      return [(M = n.facts) == null ? void 0 : M.helper_job_program, oe[(j = n.facts) == null ? void 0 : j.occupant_launch]].filter(Boolean).join(", ");
    }), Y = c(() => {
      var M;
      return (M = n.facts) == null ? void 0 : M.work_status;
    }), w = c(() => !!n.row.ended_at && n.row.role !== "main" && I.value.some((M) => Q.has(M.state))), v = c(() => {
      var M, j;
      return n.row.state === "running" && ((M = n.facts) == null ? void 0 : M.state) === "at usage limit" && !!((j = n.facts) != null && j.usage_limit_ends_at);
    }), U = (M) => new Date(M).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), k = c(() => n.row.halted_at ? `Stopped at the usage limit since ${U(n.row.halted_at)}, goes on at ${U(n.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(n.facts.usage_limit_ends_at).toLocaleString()}`), u = c(() => {
      var M;
      return n.row.retired_at || n.row.state === "retired" ? "retired" : v.value || Y.value || n.waitReason || w.value ? "waiting" : n.row.state === "running" && ((M = n.facts) == null ? void 0 : M.state) || n.row.state;
    }), d = c(() => {
      var M;
      return v.value ? k.value : Y.value ? `Status: ${Y.value}` : n.waitReason ? `Waiting: ${n.waitReason}` : u.value === "blocked" ? (M = n.facts) != null && M.blocked_reason ? `Blocked: ${n.facts.blocked_reason}` : "Blocked" : w.value ? "Stopped with work left" : "";
    }), B = c(() => {
      var M;
      return ((M = n.progress) == null ? void 0 : M.completed_count) ?? I.value.filter((j) => l.includes(j.state)).length;
    }), E = c(() => {
      var M;
      return bt(B.value, ((M = n.progress) == null ? void 0 : M.started_at) || n.row.created_at, n.progress ? n.progress.finished_at : n.row.ended_at, x.value);
    }), R = c(() => n.row.role === "main" ? 0 : E.value), T = c(() => !!n.row.retired_at || n.row.state === "retired"), se = c(() => T.value ? "Retired" : u.value === "blocked" || u.value === "waiting" ? d.value || (u.value === "blocked" ? "Blocked" : "Waiting") : r[n.row.standing]), K = c(() => {
      var j;
      if (T.value) return n.row.retired_at;
      const M = u.value === "blocked" || u.value === "waiting";
      return n.row.ended_at || M && ((j = n.facts) == null ? void 0 : j.last_activity) || n.row.process_started_at || n.row.created_at;
    }), ye = c(() => kt(K.value, x.value)), X = c(() => {
      var M;
      return yt((M = n.facts) == null ? void 0 : M.last_activity, x.value);
    });
    return (M, j) => {
      var ce, le, pe, ue, ie, we;
      return a(), s("div", {
        class: de(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: j[2] || (j[2] = (ge) => !e.open && b("toggle")),
        onKeydown: [
          j[3] || (j[3] = De(ae((ge) => !e.open && b("toggle"), ["self", "prevent"]), ["enter"])),
          j[4] || (j[4] = De(ae((ge) => !e.open && b("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        y("div", Nn, [
          e.open ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back",
            "aria-label": "Back",
            onClick: j[0] || (j[0] = ae((ge) => b("toggle"), ["stop"]))
          }, [
            p(i(ze), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : h("", !0),
          e.open ? (a(), s(q, { key: 1 }, [
            y("span", Wn, g(L.value.title), 1),
            y("span", Dn, g(L.value.subtext), 1),
            p(i(ee), {
              variant: "ghost",
              small: "",
              class: "agent-menu-button",
              "data-agent-menu": "",
              "aria-expanded": C.value,
              onClick: j[1] || (j[1] = ae((ge) => C.value = !C.value, ["stop"]))
            }, {
              default: f(() => [...j[5] || (j[5] = [
                m("Actions", -1)
              ])]),
              _: 1
            }, 8, ["aria-expanded"])
          ], 64)) : (a(), s(q, { key: 2 }, [
            p(i(wt), {
              "agent-id": e.row.id,
              label: L.value.text,
              class: "agent-who"
            }, {
              default: f(() => [
                y("span", qn, g(L.value.title), 1),
                y("span", Fn, g(L.value.subtext), 1)
              ]),
              _: 1
            }, 8, ["agent-id", "label"]),
            p(i(ze), {
              class: "agent-chevron",
              name: "chevronRight",
              size: 12
            })
          ], 64))
        ]),
        e.open && C.value ? (a(), s("div", Pn, [
          p(Qt, {
            row: e.row,
            held: u.value === "blocked"
          }, null, 8, ["row", "held"])
        ])) : h("", !0),
        e.open ? h("", !0) : (a(), s("span", Un, [
          y("span", Gn, g(D.value), 1),
          (ce = e.facts) != null && ce.sandbox_off ? (a(), s("span", Jn, "sandbox off")) : h("", !0)
        ])),
        e.open && !T.value ? (a(), N(Hn, {
          key: 2,
          class: "agent-live",
          "agent-programs": i(_).props.programs.rows.value,
          agent: e.row,
          branch: (le = e.progress) == null ? void 0 : le.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((pe = e.facts) == null ? void 0 : pe.windows) ?? [] },
          card: ""
        }, {
          default: f(() => {
            var ge, Me;
            return [
              (ge = e.facts) != null && ge.sandbox_off ? (a(), s("span", Kn, "sandbox off")) : h("", !0),
              y("span", Zn, "Run time: " + g(J.value), 1),
              (Me = e.facts) != null && Me.last_activity ? (a(), s("span", Yn, [
                j[6] || (j[6] = m("Seen: ", -1)),
                p(i(Ee), {
                  at: e.facts.last_activity
                }, null, 8, ["at"])
              ])) : h("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : h("", !0),
        (ue = e.facts) != null && ue.unit_name ? (a(), s("div", _n, "Unit: " + g(e.facts.unit_name), 1)) : h("", !0),
        e.open ? h("", !0) : (a(), N(Fa, {
          key: 4,
          tasks: I.value,
          "in-hand": e.row.role !== "helper" && ((ie = e.facts) != null && ie.job_enabled) && W.value || null,
          job: e.row.role === "helper" ? A.value : "",
          "job-title": e.row.role === "helper" && ((we = e.facts) == null ? void 0 : we.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? P.value : "",
          "per-hour": R.value
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour"])),
        p(ja, {
          state: u.value,
          doing: se.value,
          since: ye.value,
          seen: X.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (a(), N($a, {
          key: 5,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: I.value,
          "stopped-with-work": w.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : h("", !0)
      ], 42, En);
    };
  }
}, Xn = /* @__PURE__ */ Z(Qn, [["__scopeId", "data-v-26ae3e02"]]), eo = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, to = ["data-agent-row", "data-agent-lingering"], Pe = "journal.agents.filters", Ue = 300 * 1e3, Le = "cubic-bezier(0.2, 0.9, 0.25, 1)", ao = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const o = e, t = Be(), { rows: l } = t.props.waits, { rows: r } = t.props.progress, { rows: n, failure: b, loaded: x, more: C } = t.props.agents, L = (S) => r.value.find((H) => H.agent_id === S.id) ?? null, I = (S) => {
      var H;
      return ((H = l.value.find(($) => $.agent_id === S.id)) == null ? void 0 : H.reason) ?? "";
    }, F = z("running"), O = z(""), W = JSON.parse(localStorage.getItem(Pe) || '{"roles":[],"profiles":[],"programs":[]}'), A = z(W), V = c(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: D } = t.props.programs, _ = c(() => A.value.roles.length + A.value.profiles.length + A.value.programs.length), J = (S, H) => {
      A.value = St(A.value, S, H);
    }, Q = () => {
      A.value = { roles: [], profiles: [], programs: [] };
    }, oe = (S) => S.slice(0, 1).toUpperCase() + S.slice(1);
    ve(A, (S) => localStorage.setItem(Pe, JSON.stringify(S)));
    const P = z(25);
    function Y() {
      Object.assign(t.state, {
        "agents.show": F.value,
        "agents.search": O.value,
        "agents.limit": String(P.value),
        "agents.roles": A.value.roles.join(","),
        "agents.profiles": A.value.profiles.join(","),
        "agents.programs": A.value.programs.join(",")
      });
    }
    async function w() {
      return P.value += 25, Y(), await t.reload("agents"), !0;
    }
    ve([F, O, A], () => {
      P.value = 25, Y(), t.reload("agents");
    }), Y();
    const v = (S) => S.facts ?? null, U = n, k = Ke(), u = z([]), d = c(() => new Set(u.value.filter((S) => k.value - S.left < Ue).map((S) => S.row.id))), B = c(() => u.value.filter((S) => d.value.has(S.row.id)).map((S) => S.row)), E = c(() => [...U.value, ...B.value]);
    let R = "", T = [];
    async function se(S) {
      await t.reload(`card.${S.id}`);
      const H = t.props[`card.${S.id}`].rows.value.find(($) => $.id === S.id);
      H != null && H.ended_at && !u.value.some(($) => $.row.id === S.id) && (u.value = [...u.value, { row: H, left: Date.now() }]);
    }
    ve(n, (S) => {
      const H = R === `${F.value}|${O.value}|${JSON.stringify(A.value)}` && F.value === "running", $ = H ? T.filter((G) => !S.some((me) => me.id === G.id)) : [];
      R = `${F.value}|${O.value}|${JSON.stringify(A.value)}`, T = S, u.value = H ? u.value.filter((G) => k.value - G.left < Ue && !S.some((me) => me.id === G.row.id)) : [], $.forEach(se);
    }, { immediate: !0 });
    const K = c(() => !!O.value.trim() || _.value > 0), ye = c(() => o.texts[F.value] ?? { title: o.empty, hint: "" }), X = z(null), M = z(null), j = z(null), ce = z(null), le = c(() => X.value === null ? null : t.props[`card.${X.value}`].rows.value.find((S) => S.id === X.value) ?? M.value), pe = c(() => le.value ? [le.value] : E.value), ue = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, ie = z(!1);
    let we = 0;
    async function ge(S) {
      if (ie.value) return;
      ie.value = !0, we = ce.value.scrollTop;
      const H = j.value.querySelector(`[data-agent-open="${S.id}"]`);
      if (!ue()) {
        const he = [...j.value.querySelectorAll(".agent-row")].filter((re) => !re.contains(H));
        await Promise.all(he.map((re) => re.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const $ = [...H.querySelectorAll(".agent-head, .agent-line")], G = [...$, ...H.querySelectorAll("[data-agent-motion]")], me = G.map((he) => he.getBoundingClientRect());
      if (M.value = S, X.value = S.id, t.reload(`card.${S.id}`), await qe(), !ue()) {
        const he = G.map((re) => re.getBoundingClientRect());
        G.forEach((re, Ae) => {
          const fe = $.findIndex((We) => We !== re && We.contains(re)), _e = me[Ae].left - he[Ae].left - (fe < 0 ? 0 : me[fe].left - he[fe].left), Qe = me[Ae].top - he[Ae].top - (fe < 0 ? 0 : me[fe].top - he[fe].top);
          re.animate([{ transform: `translate(${_e}px, ${Qe}px)` }, { transform: "none" }], { duration: 280, easing: Le });
        }), j.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((re) => {
          re.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Le, fill: "backwards" });
        });
      }
      ie.value = !1;
    }
    async function Me() {
      if (ie.value || !le.value) return;
      ie.value = !0;
      const S = j.value.querySelector(`[data-agent-open="${X.value}"]`), H = [...S.children], $ = ue() ? [] : H.map((G) => G.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all($.map((G) => G.finished)), X.value = null, await qe(), ce.value.scrollTop = we, $.forEach((G) => G.cancel()), ue() || (S.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Le }), j.value.querySelectorAll(".agent-row").forEach((G) => {
        G.contains(S) || G.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Le });
      })), ie.value = !1;
    }
    const Ye = (S) => X.value === S.id ? Me() : ge(S);
    ve(O, (S) => S.trim() && (X.value = null)), ve(F, () => {
      X.value = null;
    });
    const Ne = (S) => {
      S.key === "Escape" && Me();
    };
    return window.addEventListener("keydown", Ne), Se(() => window.removeEventListener("keydown", Ne)), (S, H) => (a(), s("div", {
      ref_key: "agents",
      ref: j,
      class: de(["agents", { focused: le.value, "card-changing": ie.value }])
    }, [
      le.value ? h("", !0) : (a(), N(i(Mt), {
        key: 0,
        modelValue: O.value,
        "onUpdate:modelValue": H[1] || (H[1] = ($) => O.value = $),
        placeholder: "Search agents",
        "menu-count": _.value,
        "data-agents-search": ""
      }, {
        menu: f(() => [
          p(i(Oe), null, {
            default: f(() => [...H[2] || (H[2] = [
              m("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(q, null, ne(V.value.roles, ($) => (a(), N(i(je), {
            key: $,
            role: "menuitemcheckbox",
            "aria-checked": A.value.roles.includes($),
            checked: A.value.roles.includes($),
            "data-filter-role": $,
            onClick: (G) => J("roles", $)
          }, {
            default: f(() => [
              m(g(oe($)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          V.value.profiles.length ? (a(), N(i(Oe), { key: 0 }, {
            default: f(() => [...H[3] || (H[3] = [
              m("Profile", -1)
            ])]),
            _: 1
          })) : h("", !0),
          (a(!0), s(q, null, ne(V.value.profiles, ($) => (a(), N(i(je), {
            key: $.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.profiles.includes($.name),
            checked: A.value.profiles.includes($.name),
            "data-filter-profile": $.name,
            onClick: (G) => J("profiles", $.name)
          }, {
            default: f(() => [
              m(g($.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          p(i(Oe), null, {
            default: f(() => [...H[4] || (H[4] = [
              m("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(q, null, ne(i(D), ($) => (a(), N(i(je), {
            key: $.name,
            role: "menuitemcheckbox",
            "aria-checked": A.value.programs.includes($.name),
            checked: A.value.programs.includes($.name),
            "data-filter-program": $.name,
            onClick: (G) => J("programs", $.name)
          }, {
            default: f(() => [
              m(g($.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          _.value ? (a(), N(i(je), {
            key: 1,
            "data-filter-clear": "",
            onClick: Q
          }, {
            default: f(() => [...H[5] || (H[5] = [
              m("Clear filters", -1)
            ])]),
            _: 1
          })) : h("", !0)
        ]),
        default: f(() => [
          p(i(xt), {
            options: V.value.states,
            value: F.value,
            onPick: H[0] || (H[0] = ($) => F.value = $)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      F.value === "retired" && V.value.upgrade_retired ? (a(), s("p", eo, "Retired during the upgrade: " + g(V.value.upgrade_retired), 1)) : h("", !0),
      y("div", {
        ref_key: "list",
        ref: ce,
        class: de(["agents-view", { "agents-view-open": le.value }])
      }, [
        i(x) && !i(b) && !pe.value.length && _.value ? (a(), N(i(He), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: f(() => [
            p(i(ee), {
              small: "",
              "data-empty-clear": "",
              onClick: Q
            }, {
              default: f(() => [...H[6] || (H[6] = [
                m("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), N(i($t), {
          key: 1,
          moves: "",
          "leaves-at-once": ie.value,
          rows: pe.value,
          failure: i(b),
          loaded: i(x),
          more: !le.value && i(C),
          older: w,
          empty: ye.value.title,
          hint: ye.value.hint,
          searching: K.value
        }, {
          default: f(({ row: $ }) => [
            y("div", {
              class: de(["agent-row", { lingering: d.value.has($.id) && $.id !== X.value }]),
              "data-agent-row": $.id,
              "data-agent-lingering": d.value.has($.id) ? "" : null
            }, [
              p(Xn, {
                row: $,
                facts: v($),
                progress: L($),
                "wait-reason": I($),
                open: $.id === X.value,
                onToggle: (G) => Ye($)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, to)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, so = /* @__PURE__ */ Z(ao, [["__scopeId", "data-v-14a97984"]]);
export {
  so as A
};
