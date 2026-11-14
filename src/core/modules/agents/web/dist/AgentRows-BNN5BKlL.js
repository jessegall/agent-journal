import { openBlock as a, createElementBlock as s, withModifiers as ee, createElementVNode as m, createVNode as b, unref as r, withCtx as p, createTextVNode as f, Fragment as D, renderList as te, toDisplayString as d, createBlock as z, createCommentVNode as y, ref as E, computed as c, watch as ge, onUnmounted as je, defineAsyncComponent as lt, createSlots as ot, resolveDynamicComponent as st, normalizeClass as de, normalizeStyle as ye, renderSlot as Be, onMounted as rt, Teleport as it, mergeProps as dt, toRef as ze, withDirectives as ut, withKeys as Ue, nextTick as Ge } from "vue";
import { TextInput as De, Btn as _, TextArea as ct, TimeAgo as Ye, useWindow as Ee, SwitchCase as Xe, peekRef as we, Icon as We, RunningCommand as gt, FoldGroup as Qe, TaskStatusIcon as vt, loadWindowComponent as pt, coalesced as mt, READ_RATES as ht, eventMayBeChildOf as ft, InnerTabs as bt, TabBody as kt, EmptyState as qe, HoverTip as ke, TaskBar as Je, useNow as _e, agentTitle as yt, agentNumber as wt, perHour as Mt, sinceWords as $t, seenWords as xt, AgentTip as St, vContext as Ct, copying as Tt, SearchBar as At, Segmented as jt, MenuLabel as Ne, MenuItem as Ie, RowList as Bt, toggleFilter as Lt } from "@journal/window-kit";
import { _ as K, T as Ot } from "./TranscriptRows-Crmxs6Un.js";
const Rt = { class: "action-buttons" }, It = {
  __name: "AgentDriverForm",
  props: { program: String, model: String, pending: Boolean },
  emits: ["submit", "cancel", "update:program", "update:model"],
  setup(e) {
    return (l, t) => (a(), s("form", {
      "data-agent-driver-form": "",
      onSubmit: t[3] || (t[3] = ee((o) => l.$emit("submit"), ["prevent"]))
    }, [
      t[6] || (t[6] = m("p", null, "Starts the next session on this program; the agent keeps its number and memories.", -1)),
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
      m("div", Rt, [
        b(r(_), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.program.trim() || !e.model.trim(),
          "data-agent-confirm-driver": ""
        }, {
          default: p(() => [...t[4] || (t[4] = [
            f("Change the driver", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        b(r(_), {
          small: "",
          disabled: e.pending,
          onClick: t[2] || (t[2] = (o) => l.$emit("cancel"))
        }, {
          default: p(() => [...t[5] || (t[5] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Vt = /* @__PURE__ */ K(It, [["__scopeId", "data-v-c138a4da"]]), Et = { class: "action-field" }, zt = ["value", "disabled"], Nt = ["value"], Ht = { key: 1 }, Dt = {
  key: 1,
  class: "action-field"
}, Wt = { class: "action-buttons" }, qt = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (l, t) => (a(), s("form", {
      onSubmit: t[4] || (t[4] = ee((o) => l.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (a(), s(D, { key: 0 }, [
        m("label", Et, [
          t[6] || (t[6] = f("Task ", -1)),
          m("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: t[0] || (t[0] = (o) => l.$emit("update:task", o.target.value))
          }, [
            t[5] || (t[5] = m("option", { value: "" }, "Choose an open task", -1)),
            (a(!0), s(D, null, te(e.tasks, (o) => (a(), s("option", {
              key: o.id,
              value: String(o.id)
            }, d(o.id) + ": " + d(o.title), 9, Nt))), 128))
          ], 40, zt)
        ]),
        e.moreTasks ? (a(), z(r(_), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: t[1] || (t[1] = (o) => l.$emit("more"))
        }, {
          default: p(() => [...t[7] || (t[7] = [
            f("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : y("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (a(), s("p", Ht, "No open tasks.")) : y("", !0)
      ], 64)) : (a(), s("label", Dt, [
        t[8] || (t[8] = f("Job", -1)),
        b(r(ct), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (o) => l.$emit("update:text", o.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      m("div", Wt, [
        b(r(_), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: p(() => [...t[9] || (t[9] = [
            f("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        b(r(_), {
          small: "",
          disabled: e.pending,
          onClick: t[3] || (t[3] = (o) => l.$emit("cancel"))
        }, {
          default: p(() => [...t[10] || (t[10] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Ft = /* @__PURE__ */ K(qt, [["__scopeId", "data-v-adde4158"]]), Pt = { class: "action-buttons" }, Ut = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (l, t) => (a(), s("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = ee((o) => l.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = m("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      b(r(De), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (o) => l.$emit("update:reason", o))
      }, null, 8, ["model-value", "disabled"]),
      m("div", Pt, [
        b(r(_), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: p(() => [...t[3] || (t[3] = [
            f("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        b(r(_), {
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (o) => l.$emit("cancel"))
        }, {
          default: p(() => [...t[4] || (t[4] = [
            f("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Gt = /* @__PURE__ */ K(Ut, [["__scopeId", "data-v-92de7dd6"]]), Jt = {
  class: "session-history",
  "data-agent-session-history": ""
}, Kt = { key: 0 }, Zt = { key: 0 }, Yt = { "data-agent-session-state": "" }, Xt = { class: "action-buttons" }, Qt = {
  __name: "AgentSessionHistory",
  props: { sessions: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e) {
    return (l, t) => (a(), s("div", Jt, [
      e.sessions.length ? y("", !0) : (a(), s("p", Kt, "This agent has no session in its history.")),
      m("ol", null, [
        (a(!0), s(D, null, te(e.sessions, (o) => (a(), s("li", {
          key: o.session,
          "data-agent-session": ""
        }, [
          m("span", null, d([o.program, o.model].filter(Boolean).join(" ")), 1),
          o.started_at ? (a(), s("span", Zt, [
            t[1] || (t[1] = f("Started ", -1)),
            b(r(Ye), {
              at: o.started_at
            }, null, 8, ["at"])
          ])) : y("", !0),
          m("span", Yt, d(o.end_reason ? `Ended: ${o.end_reason.replaceAll("_", " ")}` : o.started_at ? "Running" : "Not started"), 1),
          m("code", null, d(o.session), 1)
        ]))), 128))
      ]),
      m("div", Xt, [
        b(r(_), {
          small: "",
          onClick: t[0] || (t[0] = (o) => l.$emit("close"))
        }, {
          default: p(() => [...t[2] || (t[2] = [
            f("Close", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, _t = /* @__PURE__ */ K(Qt, [["__scopeId", "data-v-0d688bd9"]]), ea = { class: "action-buttons" }, ta = {
  key: 0,
  role: "alert"
}, aa = {
  key: 1,
  role: "status"
}, na = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 }, held: { type: Boolean, default: !1 } },
  setup(e) {
    const l = e, t = Ee(), o = E(""), i = E(""), n = E(""), u = E(""), $ = E(""), O = E(""), T = E([]), I = E(0), F = E(!1), N = E(!1), H = E(!1), j = E(""), V = E(""), q = E([]), Y = c(() => !!l.row.retired_at || l.row.state === "retired"), G = c(() => !Y.value && !!l.row.ended_at), Q = c(() => {
      var M;
      return G.value && ((M = l.row.job_command) == null ? void 0 : M.length) && !l.row.resume_reason;
    }), ae = c(() => Q.value && !N.value && (l.row.job_task_flag ? T.value.some((M) => String(M.id) === O.value) : !!i.value.trim()));
    function P(M) {
      o.value = M, i.value = "", n.value = "", O.value = "", j.value = "", V.value = "";
    }
    async function X() {
      P("job"), l.row.job_task_flag && (T.value = [], I.value = 0, F.value = !1, await x());
    }
    async function x() {
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
      await Z(["process", "lift-hold", String(l.row.number)], "Hold lifted.");
    }
    async function Z(M, A) {
      if (!H.value) {
        H.value = !0, j.value = "";
        try {
          const ie = await t.run(M);
          j.value = ie.ok ? "" : ie.error, ie.ok && (P(""), V.value = A);
        } finally {
          H.value = !1;
        }
      }
    }
    async function k() {
      if (!ae.value) return;
      const M = l.row.job_task_flag ? [l.row.job_task_flag, O.value] : [i.value.trim()];
      await Z([...l.row.job_command, String(l.row.number), ...M], "Job sent.");
    }
    async function h() {
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
      P("driver"), u.value = l.row.program || "", $.value = "";
    }
    async function g() {
      !G.value || o.value !== "driver" || !u.value.trim() || !$.value.trim() || await Z(["agent", "driver", String(l.row.number), "--program", u.value.trim(), "--model", $.value.trim()], "Driver changed.");
    }
    async function B() {
      !G.value || o.value !== "retire" || !n.value.trim() || await Z(["agent", "retire", String(l.row.number), "--reason", n.value.trim()], "Agent retired permanently.");
    }
    return (M, A) => {
      var ie;
      return a(), s("div", {
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: A[10] || (A[10] = ee(() => {
        }, ["stop"])),
        onKeydown: A[11] || (A[11] = ee(() => {
        }, ["stop"]))
      }, [
        m("div", ea, [
          b(r(_), {
            small: "",
            "data-agent-history": "",
            disabled: H.value || N.value,
            onClick: h
          }, {
            default: p(() => [...A[12] || (A[12] = [
              f("Session history", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          e.held ? (a(), z(r(_), {
            key: 0,
            small: "",
            "data-agent-lift-hold": "",
            disabled: H.value,
            onClick: v
          }, {
            default: p(() => [...A[13] || (A[13] = [
              f("Lift this hold", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])) : y("", !0),
          G.value ? (a(), s(D, { key: 1 }, [
            (ie = e.row.job_command) != null && ie.length ? (a(), z(r(_), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: H.value || N.value || !Q.value,
              onClick: X
            }, {
              default: p(() => [...A[14] || (A[14] = [
                f("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : y("", !0),
            e.row.role !== "main" ? (a(), z(r(_), {
              key: 1,
              small: "",
              "data-agent-driver": "",
              disabled: H.value || N.value,
              onClick: W
            }, {
              default: p(() => [...A[15] || (A[15] = [
                f("Change driver", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : y("", !0),
            e.row.role !== "main" ? (a(), z(r(_), {
              key: 2,
              small: "",
              "data-agent-retire": "",
              disabled: H.value || N.value,
              onClick: A[0] || (A[0] = (U) => P("retire"))
            }, {
              default: p(() => [...A[16] || (A[16] = [
                f("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : y("", !0)
          ], 64)) : y("", !0)
        ]),
        b(r(Xe), { value: o.value }, {
          job: p(() => [
            b(Ft, {
              task: O.value,
              "onUpdate:task": A[1] || (A[1] = (U) => O.value = U),
              text: i.value,
              "onUpdate:text": A[2] || (A[2] = (U) => i.value = U),
              row: e.row,
              tasks: T.value,
              pending: H.value,
              loading: N.value,
              "more-tasks": F.value,
              failure: j.value,
              "job-ready": ae.value,
              onSubmit: k,
              onMore: x,
              onCancel: A[3] || (A[3] = (U) => P(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          driver: p(() => [
            b(Vt, {
              program: u.value,
              "onUpdate:program": A[4] || (A[4] = (U) => u.value = U),
              model: $.value,
              "onUpdate:model": A[5] || (A[5] = (U) => $.value = U),
              pending: H.value,
              onSubmit: g,
              onCancel: A[6] || (A[6] = (U) => P(""))
            }, null, 8, ["program", "model", "pending"])
          ]),
          history: p(() => [
            b(_t, {
              sessions: q.value,
              onClose: A[7] || (A[7] = (U) => P(""))
            }, null, 8, ["sessions"])
          ]),
          retire: p(() => [
            b(Gt, {
              reason: n.value,
              "onUpdate:reason": A[8] || (A[8] = (U) => n.value = U),
              pending: H.value,
              onSubmit: B,
              onCancel: A[9] || (A[9] = (U) => P(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        j.value ? (a(), s("p", ta, d(j.value), 1)) : y("", !0),
        V.value ? (a(), s("p", aa, d(V.value), 1)) : y("", !0)
      ], 32);
    };
  }
}, la = /* @__PURE__ */ K(na, [["__scopeId", "data-v-8712e475"]]), oa = {
  class: "agent-command",
  "data-agent-command": ""
}, sa = {
  key: 1,
  "data-agent-stopped": ""
}, ra = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (l, t) => (a(), s("span", oa, [
      e.waitReason ? (a(), s("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: t[0] || (t[0] = ee((o) => r(we)("test_queue:0"), ["stop"]))
      }, [
        f("Waiting: " + d(e.waitReason) + " ", 1),
        b(r(We), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), s("span", sa, "Waiting")) : (a(), z(r(gt), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, ia = /* @__PURE__ */ K(ra, [["__scopeId", "data-v-1b371fb5"]]), da = {
  key: 0,
  class: "lasting-facts",
  "data-agent-lasting-facts": ""
}, ua = { "data-agent-retired-at": "" }, ca = { key: 0 }, ga = { "data-agent-retired-by": "" }, va = {
  __name: "AgentLastingFacts",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    return (l, t) => e.row.retired_at ? (a(), s("dl", da, [
      m("div", null, [
        t[0] || (t[0] = m("dt", null, "Retired", -1)),
        m("dd", ua, [
          b(r(Ye), {
            at: e.row.retired_at
          }, null, 8, ["at"])
        ])
      ]),
      e.row.retiring_actor_name ? (a(), s("div", ca, [
        t[1] || (t[1] = m("dt", null, "Retired by", -1)),
        m("dd", ga, d(e.row.retiring_actor_name), 1)
      ])) : y("", !0)
    ])) : y("", !0);
  }
}, pa = /* @__PURE__ */ K(va, [["__scopeId", "data-v-c5c81429"]]), ma = ["data-agent-delegated", "onClick"], ha = { class: "agent-task-number" }, fa = { class: "agent-task-title" }, ba = ["title"], ka = {
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
        (a(!0), s(D, null, te(e.section.tasks, (n) => (a(), s("button", {
          key: n.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": n.id,
          onClick: (u) => r(we)(`tasks:${n.id}`)
        }, [
          b(r(vt), {
            status: n.state
          }, null, 8, ["status"]),
          m("span", ha, d(n.id), 1),
          m("span", fa, d(n.title), 1),
          n.plan_id ? (a(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${n.plan_id}: ${n.plan_title}`
          }, "Plan " + d(n.plan_id), 9, ba)) : y("", !0)
        ], 8, ma))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, ya = /* @__PURE__ */ K(ka, [["__scopeId", "data-v-ea4ccd6b"]]), wa = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, Ma = {
  key: 1,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, $a = ["data-peek", "onClick"], xa = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Sa = {
  key: 0,
  class: "agent-helper-brief"
}, Ca = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ta = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, Aa = "It ended without a report", ja = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const l = e, t = ["started", "blocked", "open", "completed"], o = c(() => {
      var k, h;
      return l.row.ended_at && ((h = (k = l.facts) == null ? void 0 : k.job_returned) != null && h.startsWith(Aa)) ? l.facts.job_returned : "";
    }), i = c(() => l.tasks.length ? t.map((k) => ({ state: k, label: k.slice(0, 1).toUpperCase() + k.slice(1), tasks: l.tasks.filter((h) => h.state === k || k === "started" && h.state === "testing" || k === "completed" && h.state === "cancelled") })) : []), n = /* @__PURE__ */ new Set(["completed"]), u = E({}), $ = (k) => !(u.value[k] ?? n.has(k)), O = (k) => u.value = { ...u.value, [k]: $(k) }, T = Ee(), { rows: I } = T.props.reports;
    T.state["reports.agent"] = String(l.row.number);
    const F = c(() => l.row.access === "read-only"), N = ["tasks", "transcript", "terminal", "file-feed", "processes", "reports", "memories"], H = c(() => [...T.tabs].sort((k, h) => (N.indexOf(k.key) < 0 ? N.length : N.indexOf(k.key)) - (N.indexOf(h.key) < 0 ? N.length : N.indexOf(h.key)))), j = c(() => !!l.row.retired_at || l.row.state === "retired"), V = () => F.value || j.value ? H.value.find((k) => k.key === "transcript") : H.value[0], q = E(V());
    ge(q, (k) => {
      T.state.tab = (k == null ? void 0 : k.key) ?? "";
    }, { immediate: !0 }), je(() => {
      T.state.tab = "";
    }), ge(H, (k) => {
      k.some((h) => {
        var W;
        return h.key === ((W = q.value) == null ? void 0 : W.key);
      }) || (q.value = k[0]);
    }), ge(() => l.open, (k) => {
      k && (q.value = V());
    });
    const Y = Object.fromEntries(T.tabs.filter((k) => k.component).map((k) => [k.key, lt(() => pt(k.component))])), G = E(!1), { data: Q } = T.props.tool, ae = c(() => {
      var k;
      return ((k = Q.value) == null ? void 0 : k.tool) ?? "";
    }), P = c(() => {
      var k;
      return ((k = Q.value) == null ? void 0 : k.note) ?? "";
    }), X = c(() => l.row.role !== "main" && (!l.row.ended_at || l.stoppedWithWork || l.waitReason));
    async function x() {
      !l.open || !X.value || (T.state["tool.agent"] = String(l.row.number), await T.reload("tool"));
    }
    const v = mt(x, ht.agentCommand), Z = T.follow(["hook_call.*", "process_part.*"], (k) => ft(k, "session_agent_id", /* @__PURE__ */ new Set([l.row.id])) && v());
    return je(() => Z == null ? void 0 : Z()), ge(() => l.open, (k) => {
      k && x();
    }, { immediate: !0 }), (k, h) => {
      var W;
      return a(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: h[2] || (h[2] = ee(() => {
        }, ["stop"]))
      }, [
        b(pa, { row: e.row }, null, 8, ["row"]),
        e.row.retirement_reason ? (a(), s("p", wa, "Retirement reason: " + d(e.row.retirement_reason), 1)) : y("", !0),
        o.value ? (a(), s("p", Ma, d(o.value), 1)) : y("", !0),
        b(r(bt), {
          class: "agent-tabs",
          tabs: H.value,
          active: q.value,
          answer: { tasks: e.tasks.length, reports: e.row.report_count ?? r(I).length, memories: e.row.memory_count ?? 0 },
          onChoose: h[0] || (h[0] = (g) => q.value = g)
        }, null, 8, ["tabs", "active", "answer"]),
        b(r(kt), {
          class: "agent-tab-body",
          tab: q.value,
          "data-agent-tab-body": (W = q.value) == null ? void 0 : W.key
        }, {
          default: p(() => {
            var g;
            return [
              b(r(Xe), {
                value: (g = q.value) == null ? void 0 : g.key
              }, ot({
                reports: p(() => [
                  r(I).length ? y("", !0) : (a(), z(r(qe), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: p(() => [...h[3] || (h[3] = [
                      f("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (a(!0), s(D, null, te(r(I), (B) => (a(), s("button", {
                    key: B.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${B.id}`,
                    onClick: (M) => r(we)(`messages:${B.id}`)
                  }, d(B.text), 9, $a))), 128))
                ]),
                tasks: p(() => {
                  var B;
                  return [
                    e.tasks.length ? y("", !0) : (a(), z(r(qe), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: p(() => [...h[4] || (h[4] = [
                        f("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (a(!0), s(D, null, te(i.value, (M) => (a(), z(ya, {
                      key: M.state,
                      section: M,
                      open: $(M.state),
                      onToggle: (A) => O(M.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (B = e.facts) != null && B.instruction ? (a(), s(D, { key: 1 }, [
                      h[5] || (h[5] = m("p", { class: "agent-label" }, "Instruction", -1)),
                      m("div", xa, d(e.facts.instruction), 1)
                    ], 64)) : y("", !0)
                  ];
                }),
                transcript: p(() => {
                  var B;
                  return [
                    F.value ? (a(), s(D, { key: 0 }, [
                      (B = e.facts) != null && B.instruction ? (a(), s("div", Sa, [
                        b(r(Qe), {
                          label: "Instruction",
                          open: G.value,
                          "data-agent-section": "instruction",
                          onToggle: h[1] || (h[1] = (M) => G.value = !G.value)
                        }, {
                          default: p(() => [
                            m("div", Ca, d(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (a(), s("p", Ta, "No job recorded")) : y("", !0)
                    ], 64)) : y("", !0),
                    b(Ot, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                te(r(Y), (B, M) => ({
                  name: M,
                  fn: p(() => [
                    (a(), z(st(B), {
                      agent: e.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ];
          }),
          _: 1
        }, 8, ["tab", "data-agent-tab-body"]),
        X.value ? (a(), z(ia, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: ae.value,
          note: P.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : y("", !0)
      ]);
    };
  }
}, Ba = /* @__PURE__ */ K(ja, [["__scopeId", "data-v-fabbecdf"]]), La = { class: "line" }, Oa = {
  key: 0,
  class: "line",
  "data-agent-since": ""
}, Ra = {
  key: 1,
  class: "line",
  "data-agent-seen": ""
}, Ia = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" }, seen: { type: String, default: "" } },
  setup(e) {
    const l = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, o = c(() => l.has(t.state)), i = c(() => [t.doing, t.since, t.seen].filter(Boolean).join(". "));
    return (n, u) => (a(), z(r(ke), {
      as: "button",
      place: "corner",
      class: de(["agent-dot", { pulse: o.value }]),
      "data-state": e.state,
      "aria-label": i.value,
      "data-agent-status": "",
      onClick: u[0] || (u[0] = ee(() => {
      }, ["stop"]))
    }, {
      tip: p(() => [
        m("b", La, d(e.doing), 1),
        e.since ? (a(), s("span", Oa, d(e.since), 1)) : y("", !0),
        e.seen ? (a(), s("span", Ra, d(e.seen), 1)) : y("", !0)
      ]),
      default: p(() => [
        u[1] || (u[1] = m("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, Va = /* @__PURE__ */ K(Ia, [["__scopeId", "data-v-1a0bc478"]]), Ea = ["title"], za = ["aria-label"], Na = {
  class: "count",
  "data-plan-count": ""
}, Ha = {
  __name: "PlanBar",
  props: { plan: { type: Number, required: !0 }, counts: { type: Object, required: !0 } },
  setup(e) {
    const l = e, t = (i) => `${l.counts.total ? i / l.counts.total * 100 : 0}%`, o = c(() => {
      const { completed: i, testing: n, started: u, total: $ } = l.counts;
      return `Plan ${l.plan}: ${i} completed, ${n} testing, ${u} started, ${$ - i - n - u} open`;
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
          style: ye({ width: t(e.counts.completed) })
        }, null, 4),
        m("span", {
          class: "part testing",
          "data-plan-testing": "",
          style: ye({ width: t(e.counts.testing) })
        }, null, 4),
        m("span", {
          class: "part started",
          "data-plan-started": "",
          style: ye({ width: t(e.counts.started) })
        }, null, 4)
      ], 8, za),
      m("span", Na, [
        m("b", null, d(e.counts.completed), 1),
        f(" of " + d(e.counts.total), 1)
      ])
    ], 8, Ea)) : y("", !0);
  }
}, Da = /* @__PURE__ */ K(Ha, [["__scopeId", "data-v-61d1569f"]]), Wa = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, qa = (e) => e.filter((l) => l.state !== "cancelled"), He = (e, l) => e.filter((t) => t.state === l).length, Fa = 5, Pa = (e, l) => e || l.split(/\s+/).slice(0, Fa).join(" ");
function Ua({ tasks: e, inHand: l, perHour: t }) {
  const o = qa(e), i = He(o, "completed"), n = Wa[l == null ? void 0 : l.state], u = o.filter((I) => I.state === "started").map((I) => ({ number: I.id, title: I.title })), $ = Math.max(u.length, l && l.state !== "completed" ? 1 : 0), O = o.length - i - $, T = i === o.length;
  return {
    number: l.id,
    title: l.title,
    started: u,
    plan: l.plan_id ?? 0,
    planTitle: l.plan_title ?? "",
    count: `${i} of ${o.length}`,
    taskTip: `${i} of its ${o.length} tasks done${n ? `. This one is ${n.words}.` : "."}`,
    countTip: T ? `All ${o.length} tasks done` : `${i} done, ${$} in hand, ${O} to go`,
    paceTip: !T && t ? `About ${t} an hour.` : "",
    rate: !T && t ? `${Math.round(t)}/hour` : "",
    bar: { total: o.length, done: i, testing: He(o, "testing"), started: He(o, "started") }
  };
}
const Ga = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, Ja = {
  key: 0,
  class: "plan",
  "data-agent-job-launch": ""
}, Ka = {
  class: "task-line",
  "data-agent-task-line": ""
}, Za = {
  key: 1,
  class: "tasks",
  "data-agent-tasks": ""
}, Ya = {
  key: 2,
  class: "tasks",
  "data-agent-tasks": ""
}, Xa = {
  key: 4,
  class: "rate",
  "data-agent-rate": ""
}, Qa = { key: 0 }, _a = 3, en = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, jobTitle: { type: String, default: "" }, jobLaunch: { type: String, default: "" }, perHour: { type: Number, default: 0 }, countsEmpty: { type: Boolean, default: !1 }, planCounts: { type: Object, default: () => ({}) } },
  setup(e) {
    const l = e, t = c(() => l.inHand ? Ua({ tasks: l.tasks, inHand: l.inHand, perHour: l.perHour }) : null), o = c(() => {
      var i;
      return (i = t.value) != null && i.plan ? l.planCounts[t.value.plan] ?? null : null;
    });
    return (i, n) => e.job && !t.value ? (a(), s("span", Ga, [
      b(r(ke), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: p(() => [
          m("b", null, d(e.job), 1)
        ]),
        default: p(() => [
          f(d(r(Pa)(e.jobTitle, e.job)), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (a(), s("span", Ja, d(e.jobLaunch), 1)) : y("", !0)
    ])) : t.value ? (a(), s(D, { key: 1 }, [
      m("span", Ka, [
        t.value.plan ? (a(), z(r(ke), {
          key: 0,
          as: "button",
          class: "task",
          "data-agent-plan": "",
          "data-peek": `plans:${t.value.plan}`,
          "aria-label": `Plan ${t.value.plan}: ${t.value.planTitle}`,
          onClick: n[0] || (n[0] = ee((u) => r(we)(`plans:${t.value.plan}`), ["stop"]))
        }, {
          tip: p(() => [
            m("b", null, d(t.value.planTitle), 1),
            m("span", null, "Task " + d(t.value.number) + ": " + d(t.value.title), 1)
          ]),
          default: p(() => [
            f("Plan " + d(t.value.plan), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])) : t.value.started.length > _a ? (a(), s("span", Za, [
          b(r(ke), {
            as: "button",
            class: "task",
            "data-agent-task-count": "",
            "aria-label": `Tasks: ${t.value.started.length}`
          }, {
            tip: p(() => [
              (a(!0), s(D, null, te(t.value.started, (u) => (a(), s("b", {
                key: u.number,
                class: "listed",
                "data-agent-task-listed": ""
              }, d(u.number) + " " + d(u.title), 1))), 128))
            ]),
            default: p(() => [
              f("Tasks: " + d(t.value.started.length), 1)
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : t.value.started.length > 1 ? (a(), s("span", Ya, [
          n[2] || (n[2] = f("Tasks ", -1)),
          (a(!0), s(D, null, te(t.value.started, (u, $) => (a(), s(D, {
            key: u.number
          }, [
            $ ? (a(), s(D, { key: 0 }, [
              f(", ")
            ], 64)) : y("", !0),
            b(r(ke), {
              as: "button",
              class: "task",
              "data-agent-task": "",
              "data-peek": `tasks:${u.number}`,
              "aria-label": `Task ${u.number}: ${u.title}`,
              onClick: ee((O) => r(we)(`tasks:${u.number}`), ["stop"])
            }, {
              tip: p(() => [
                m("b", null, d(u.title), 1)
              ]),
              default: p(() => [
                f(d(u.number), 1)
              ]),
              _: 2
            }, 1032, ["data-peek", "aria-label", "onClick"])
          ], 64))), 128))
        ])) : (a(), z(r(ke), {
          key: 3,
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${t.value.number}`,
          "aria-label": `Task ${t.value.number}: ${t.value.title}`,
          onClick: n[1] || (n[1] = ee((u) => r(we)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: p(() => [
            m("b", null, d(t.value.title), 1),
            m("span", null, d(t.value.taskTip), 1)
          ]),
          default: p(() => [
            f("Task " + d(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])),
        t.value.rate ? (a(), s("span", Xa, d(t.value.rate), 1)) : y("", !0),
        o.value ? (a(), z(Da, {
          key: 5,
          plan: t.value.plan,
          counts: o.value
        }, null, 8, ["plan", "counts"])) : (a(), z(r(ke), {
          key: 6,
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: p(() => [
            m("b", null, d(t.value.countTip), 1),
            t.value.paceTip ? (a(), s("span", Qa, d(t.value.paceTip), 1)) : y("", !0)
          ]),
          default: p(() => [
            f(d(t.value.count), 1)
          ]),
          _: 1
        }))
      ]),
      o.value ? y("", !0) : (a(), z(r(Je), {
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
      b(r(Je), {
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: 0,
        done: 0,
        testing: 0,
        started: 0
      })
    ], 64)) : y("", !0);
  }
}, tn = /* @__PURE__ */ K(en, [["__scopeId", "data-v-c1849d03"]]), an = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', nn = ["data-icon", "stroke-width", "innerHTML"], oe = {
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
      agent: an,
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
      innerHTML: i[o[e.name] || e.name] || i.dot
    }, null, 12, nn));
  }
}, ln = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, on = {
  key: 1,
  class: "menu-item-text"
}, sn = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (l, t) => (a(), s("button", {
      type: "button",
      class: de(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), s("span", ln, d(e.checked ? "✓" : ""), 1)) : y("", !0),
      e.description ? (a(), s("span", on, [
        m("span", null, [
          Be(l.$slots, "default", {}, void 0, !0)
        ]),
        m("small", null, d(e.description), 1)
      ])) : Be(l.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Ce = /* @__PURE__ */ K(sn, [["__scopeId", "data-v-fec99974"]]), rn = {}, dn = { class: "menu-label" };
function un(e, l) {
  return a(), s("span", dn, [
    Be(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Ae = /* @__PURE__ */ K(rn, [["render", un], ["__scopeId", "data-v-aa955b3e"]]), cn = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, gn = {
  key: 0,
  class: "skills-none"
}, vn = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: l }) {
    const t = e, o = l, i = c(() => t.skills.filter((u) => u.state === "loaded")), n = c(() => t.skills.filter((u) => u.state !== "loaded"));
    return (u, $) => (a(), s("div", cn, [
      b(Ae, null, {
        default: p(() => [...$[1] || ($[1] = [
          f("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      i.value.length ? y("", !0) : (a(), s("p", gn, "None yet. Compacting the conversation empties this list.")),
      (a(!0), s(D, null, te(i.value, (O) => (a(), s("p", {
        key: O.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        b(oe, {
          name: "book",
          size: 12
        }),
        f(d(O.skill), 1)
      ]))), 128)),
      n.value.length ? (a(), s(D, { key: 1 }, [
        b(Ae, null, {
          default: p(() => [...$[2] || ($[2] = [
            f("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), s(D, null, te(n.value, (O) => (a(), s("p", {
          key: O.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          b(oe, {
            name: "book",
            size: 12
          }),
          f(d(O.skill), 1)
        ]))), 128))
      ], 64)) : y("", !0),
      b(Ce, {
        "data-agent-skills-browse": "",
        onClick: $[0] || ($[0] = (O) => o("browse"))
      }, {
        default: p(() => [...$[3] || ($[3] = [
          f("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, pn = /* @__PURE__ */ K(vn, [["__scopeId", "data-v-be514d47"]]), mn = ["disabled", "title"], hn = { class: "gauge usage" }, fn = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: l }) {
    const t = e, o = l, i = c(() => t.windows[0] ?? null), n = c(() => i.value && Number.isFinite(i.value.used_percent) ? Math.max(0, Math.min(100, Math.round(i.value.used_percent))) : null), u = c(() => n.value !== null && n.value >= 100), $ = c(() => {
      var T;
      return (T = i.value) != null && T.reset_epoch_seconds ? new Date(i.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), O = c(() => u.value ? `At usage limit: the plan's ${i.value.title} allowance is used up${$.value ? `, starts again ${$.value}` : ""}` : `${n.value}% of the plan's ${i.value.title} allowance used${$.value ? `, starts again ${$.value}` : ""}`);
    return (T, I) => n.value !== null ? (a(), s("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: O.value,
      onClick: I[0] || (I[0] = (F) => o("open", F.currentTarget))
    }, [
      b(oe, {
        name: "allowance",
        size: 12
      }),
      I[1] || (I[1] = f()),
      m("span", hn, [
        m("span", {
          style: ye({ width: `${n.value}%` })
        }, null, 4)
      ]),
      f(" " + d(u.value ? "At usage limit" : `${n.value}%`), 1)
    ], 8, mn)) : y("", !0);
  }
}, bn = /* @__PURE__ */ K(fn, [["__scopeId", "data-v-a36f09dc"]]), kn = ["failed", "blocked", "problem", "update", "paused", "holding", "waiting", "asks"], et = { danger: "failed", warn: "waiting" }, yn = (e) => kn.includes(et[e] ?? e), wn = (e) => yn(e) ? ["badge", et[e] ?? e] : ["badge-quiet"], Mn = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (l, t) => (a(), s("span", {
      class: de(r(wn)(e.tone))
    }, d(e.text), 3));
  }
}, $n = /* @__PURE__ */ K(Mn, [["__scopeId", "data-v-b7a33f3d"]]), xn = (e, l, t) => Math.max(l, Math.min(t, e)), tt = /* @__PURE__ */ new WeakMap(), Sn = (e, l) => tt.set(e, l);
function Cn(e, l) {
  for (let t = l; t; t = tt.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function Tn(e, l) {
  const t = (o) => {
    var n, u;
    const i = ((n = e.value) == null ? void 0 : n.element) || ((u = e.value) == null ? void 0 : u.$el) || e.value;
    i && !Cn(i, o.target) && l(o);
  };
  window.addEventListener("click", t), je(() => window.removeEventListener("click", t));
}
const be = 8, An = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    })), $ = E({ w: 0, h: 0 }), O = (g) => ({ left: g.x, right: g.flipX ?? g.x, top: g.y, bottom: g.y }), T = E(o.anchor ? o.anchor.getBoundingClientRect() : o.point ? O(o.point) : null), I = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), F = (g) => ({
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
        below: g.bottom - B.bottom - o.gap - be,
        above: B.top - g.top - o.gap - be,
        across: g.right - g.left - 2 * be
      };
    }
    function V(g) {
      if (!o.anchor) return I();
      const B = N(o.anchor), M = j(B, g);
      return $.value.w <= M.across && $.value.h <= Math.max(M.below, M.above) ? B : I();
    }
    const q = c(() => {
      if (!T.value) return u.value;
      const g = T.value, B = V(g), M = j(B, g), { w: A, h: ie } = $.value, U = o.point ? g.left + A > B.right - be : o.align === "auto" ? g.left + g.right > B.left + B.right : o.align === "right", he = xn(U ? g.right - A : g.left, B.left + be, Math.max(B.left + be, B.right - A - be)), Me = ie > M.below && M.above > M.below ? { bottom: `${window.innerHeight - g.top + o.gap}px`, maxHeight: H(o.maxHeight, M.above) } : { top: `${g.bottom + o.gap}px`, maxHeight: H(o.maxHeight, M.below) };
      return { ...u.value, ...Me, left: `${he}px`, maxWidth: H(o.maxWidth, M.across) };
    }), Y = t, G = () => [...i.value.querySelectorAll("button:not(:disabled)")];
    function Q(g) {
      const B = G(), M = B.indexOf(document.activeElement);
      B[(M + g + B.length) % B.length].focus();
    }
    const ae = { ArrowDown: () => Q(1), ArrowUp: () => Q(-1), Escape: () => Y("close") }, P = (g) => ae[g.key] && (g.preventDefault(), ae[g.key]()), X = () => i.value && ($.value = { w: i.value.offsetWidth, h: i.value.scrollHeight });
    let x = 0;
    const v = new ResizeObserver(() => {
      cancelAnimationFrame(x), x = requestAnimationFrame(X);
    });
    Tn(i, (g) => o.anchor && !o.anchor.contains(g.target) && Y("close"));
    const Z = (g, B) => ["top", "left", "right", "bottom"].some((M) => Math.abs(g[M] - B[M]) > 1), k = (g) => g.bottom < 0 || g.top > window.innerHeight;
    let h = 0;
    function W() {
      if (o.anchor) {
        const g = o.anchor.getBoundingClientRect();
        if (!o.anchor.isConnected || k(g)) return Y("close");
        Z(g, T.value) && (T.value = g);
      }
      h = requestAnimationFrame(W);
    }
    return rt(() => {
      o.anchor && i.value && Sn(i.value, o.anchor), X(), i.value && v.observe(i.value), !o.plain && G()[0] && G()[0].focus(), W();
    }), je(() => {
      v.disconnect(), cancelAnimationFrame(h), cancelAnimationFrame(x);
    }), l({ element: i }), (g, B) => (a(), z(it, {
      to: "body",
      disabled: !e.anchor && !e.point
    }, [
      m("div", dt({
        ref_key: "panel",
        ref: i
      }, g.$attrs, {
        class: ["menu-panel", { anchored: e.anchor || e.point }],
        style: q.value,
        onKeydown: P
      }), [
        Be(g.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), jn = /* @__PURE__ */ K(An, [["__scopeId", "data-v-8094ec27"]]);
async function Bn(e, l, t) {
  if (!e) return t(l);
  const { target: o, fields: i } = e, n = Object.fromEntries(Object.keys(i).map((O) => [O, o[O]])), u = () => Object.assign(o, n);
  Object.assign(o, i);
  let $ = !1;
  try {
    const O = await t(l);
    return $ = O.ok, O;
  } finally {
    $ || u();
  }
}
function Ln(e, l, t, { groups: o, programs: i }) {
  const n = E({}), u = E(""), $ = E(!1), O = c(() => !!e.value && !e.value.ended_at), T = c(() => O.value && !!e.value.paused_at);
  async function I(j, V = null) {
    u.value = "";
    const q = await Bn(V, j, l);
    return u.value = q.ok ? "" : q.error, t(), q;
  }
  return { groups: o, programs: i, chosen: n, failure: u, asking: $, running: O, paused: T, choose: (j, V) => I(["agent", "control", String(e.value.number), j, V.value], { target: n, fields: { value: { ...n.value, [j]: V.label } } }), stop: () => ($.value = !1, I(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (j) => I(["agent", "launch", j.name]) };
}
function On(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const Rn = { compact: "Compaction", clear: "Clear" };
function In(e) {
  return e != null && e.is_open ? `${Rn[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
const Vn = ["disabled", "title"], En = ["disabled", "title"], zn = { class: "gauge" }, Nn = {
  key: 1,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
}, Hn = ["disabled", "title"], Dn = ["disabled"], Wn = ["disabled"], qn = {
  key: 5,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Fn = ["title"], Pn = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Un = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Gn = { class: "gauge" }, Jn = { class: "context-used" }, Kn = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, Zn = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, Yn = 75, Xn = {
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
    const t = e, o = l, i = Ln(ze(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => o("changed"), { groups: ze(t, "controlGroups"), programs: ze(t, "agentPrograms") }), n = E(null), u = E(""), $ = c(() => i.groups.value.find((x) => x.key === u.value));
    function O(x, v) {
      n.value = x.currentTarget, u.value = v;
    }
    function T() {
      n.value = null, u.value = "", i.asking.value = !1;
    }
    const I = c(() => t.skills.filter((x) => x.state === "loaded"));
    function F(x) {
      O(x, "skills"), o("skills");
    }
    const N = (x) => i.groups.value.some((v) => v.key === x), H = c(() => {
      var x;
      return i.chosen.value.model ?? ((x = V.value) == null ? void 0 : x.model) ?? "";
    }), j = c(() => {
      var x;
      return i.chosen.value.effort ?? ((x = V.value) == null ? void 0 : x.effort) ?? "";
    });
    c(() => !!t.agent && !t.agent.ended_at);
    const V = c(() => {
      var x;
      return ((x = t.usage.agents) == null ? void 0 : x.find((v) => {
        var Z;
        return v.id === ((Z = t.agent) == null ? void 0 : Z.id);
      })) ?? null;
    }), q = c(() => {
      var x;
      return ((x = V.value) == null ? void 0 : x.context_percent) == null ? null : Math.round(V.value.context_percent);
    }), Y = c(() => {
      var x;
      return In(((x = V.value) == null ? void 0 : x.context_change) ?? null);
    }), G = (x) => `${Math.round(x / 1e3)}k`, Q = c(() => {
      var x;
      return !!((x = V.value) != null && x.context_limit_tokens);
    }), ae = c(() => {
      var x, v;
      return ((x = V.value) == null ? void 0 : x.context_limit_tokens) || ((v = V.value) == null ? void 0 : v.context_window_tokens) || 0;
    }), P = c(() => ae.value ? `${G(V.value.context_tokens ?? 0)} of ${G(ae.value)}` : ""), X = c(() => {
      var x;
      return (x = V.value) != null && x.cost_dollars ? `$${V.value.cost_dollars.toFixed(2)}` : "";
    });
    return (x, v) => {
      var Z, k;
      return a(), s("div", {
        class: de(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (a(), s(D, { key: 0 }, [
          m("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: v[0] || (v[0] = (h) => O(h, "agent"))
          }, [
            b(oe, {
              name: "agents",
              size: 12
            }),
            f(" " + d(((Z = e.agentPrograms.find((h) => h.name === e.agent.program)) == null ? void 0 : Z.title) || e.agent.program), 1)
          ], 8, Vn),
          b(bn, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: v[1] || (v[1] = (h) => o("open", "usage", h))
          }, null, 8, ["windows", "disabled"]),
          q.value !== null ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${q.value}% full: clear or compact it`,
            onClick: v[2] || (v[2] = (h) => N("context") ? O(h, "context") : o("open", "context", h.currentTarget))
          }, [
            b(oe, {
              name: "gauge",
              size: 12
            }),
            v[14] || (v[14] = f()),
            m("span", zn, [
              m("span", {
                style: ye({ width: `${q.value}%` })
              }, null, 4)
            ]),
            f(" " + d(q.value) + "% ", 1)
          ], 8, En)) : (k = V.value) != null && k.context_unknown ? (a(), s("span", Nn, [
            b(oe, {
              name: "gauge",
              size: 12
            }),
            v[15] || (v[15] = f(" Context: unknown", -1))
          ])) : y("", !0),
          H.value ? (a(), s("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${H.value}: change the model`,
            onClick: v[3] || (v[3] = (h) => N("model") ? O(h, "model") : null)
          }, [
            b(oe, {
              name: "model",
              size: 12
            }),
            f(" " + d(H.value), 1)
          ], 8, Hn)) : y("", !0),
          N("effort") || e.card && j.value ? (a(), s("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: v[4] || (v[4] = (h) => O(h, "effort"))
          }, [
            b(oe, {
              name: "bolt",
              size: 12
            }),
            f(" " + d(j.value), 1)
          ], 8, Dn)) : y("", !0),
          X.value ? (a(), s("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: v[5] || (v[5] = (h) => o("open", "cost", h.currentTarget))
          }, d(X.value), 9, Wn)) : y("", !0),
          e.branch ? (a(), s("span", qn, [
            b(oe, {
              name: "branch",
              size: 12
            }),
            f(" " + d(e.branch), 1)
          ])) : y("", !0),
          e.card ? y("", !0) : (a(), s("button", {
            key: 6,
            type: "button",
            class: de(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: v[6] || (v[6] = (h) => o("open", "jobs", h.currentTarget))
          }, [
            b(oe, {
              name: "clock",
              size: 12
            }),
            f(" " + d(e.jobs), 1)
          ], 2)),
          e.run ? (a(), s("button", {
            key: 7,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: F
          }, [
            b(oe, {
              name: "book",
              size: 12
            }),
            f(" " + d(I.value.length), 1)
          ])) : y("", !0),
          e.fitness ? (a(), s(D, { key: 8 }, [
            m("button", {
              type: "button",
              class: de(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Yn }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: v[7] || (v[7] = (h) => o("open", "fitness", h.currentTarget))
            }, [
              b(oe, {
                name: "heart",
                size: 12
              }),
              f(" " + d(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            m("button", {
              type: "button",
              class: de(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: v[8] || (v[8] = (h) => o("open", "load", h.currentTarget))
            }, [
              b(oe, {
                name: "weight",
                size: 12
              }),
              f(" " + d(e.fitness.workload), 1)
            ], 2)
          ], 64)) : y("", !0)
        ], 64)) : e.run && !e.loading ? (a(), s("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: v[9] || (v[9] = (h) => O(h, "start"))
        }, [
          b(oe, {
            name: "agents",
            size: 12
          }),
          v[16] || (v[16] = f(" Start an agent", -1))
        ])) : y("", !0),
        v[22] || (v[22] = m("span", { class: "space" }, null, -1)),
        r(i).failure.value ? (a(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: r(i).failure.value
        }, d(r(i).failure.value), 9, Fn)) : y("", !0),
        Be(x.$slots, "default", {}, void 0, !0),
        n.value ? (a(), z(jn, {
          key: 3,
          anchor: n.value,
          "min-width": 190,
          onClose: T
        }, {
          default: p(() => {
            var h;
            return [
              u.value === "agent" ? (a(), s(D, { key: 0 }, [
                r(i).asking.value ? (a(), s(D, { key: 0 }, [
                  b(Ae, { "data-agent-stop-ask": "" }, {
                    default: p(() => [...v[17] || (v[17] = [
                      f("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  b(Ce, {
                    "data-agent-stop-confirm": "",
                    onClick: v[10] || (v[10] = (W) => (T(), r(i).stop()))
                  }, {
                    default: p(() => [...v[18] || (v[18] = [
                      f("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  b(Ce, {
                    onClick: v[11] || (v[11] = (W) => r(i).asking.value = !1)
                  }, {
                    default: p(() => [...v[19] || (v[19] = [
                      f("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (a(), z(Ce, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: v[12] || (v[12] = (W) => r(i).asking.value = !0)
                }, {
                  default: p(() => [...v[20] || (v[20] = [
                    f("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : u.value === "start" ? (a(), s(D, { key: 1 }, [
                b(Ae, null, {
                  default: p(() => [...v[21] || (v[21] = [
                    f("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (a(!0), s(D, null, te(r(i).programs.value, (W) => (a(), z(Ce, {
                  key: W.name,
                  "data-agent-program": W.name,
                  onClick: (g) => (T(), r(i).start(W))
                }, {
                  default: p(() => [
                    f(d(W.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : u.value === "skills" ? (a(), z(pn, {
                key: 2,
                skills: e.skills,
                onBrowse: v[13] || (v[13] = (W) => (T(), o("open", "skills", null)))
              }, null, 8, ["skills"])) : $.value ? (a(), s(D, { key: 3 }, [
                b(Ae, null, {
                  default: p(() => [
                    f(d($.value.label), 1)
                  ]),
                  _: 1
                }),
                u.value === "context" ? (a(), s(D, { key: 0 }, [
                  m("p", Pn, d(r(On)(((h = V.value) == null ? void 0 : h.last_compaction) ?? null)), 1),
                  m("div", Un, [
                    m("span", Gn, [
                      m("span", {
                        style: ye({ width: `${q.value}%` })
                      }, null, 4)
                    ]),
                    m("span", Jn, d(q.value) + "%", 1)
                  ]),
                  P.value ? (a(), s("p", Kn, [
                    f(d(P.value) + " ", 1),
                    Q.value ? (a(), z($n, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : y("", !0)
                  ])) : y("", !0)
                ], 64)) : y("", !0),
                u.value === "context" && Y.value ? (a(), s("p", Zn, d(Y.value), 1)) : (a(!0), s(D, { key: 2 }, te($.value.choices, (W) => (a(), z(Ce, {
                  key: W.value,
                  "data-agent-choice": W.value,
                  onClick: (g) => (r(i).choose($.value.key, W), T())
                }, {
                  default: p(() => [
                    f(d(W.label), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-choice", "onClick"]))), 128))
              ], 64)) : y("", !0)
            ];
          }),
          _: 1
        }, 8, ["anchor"])) : y("", !0)
      ], 2);
    };
  }
}, Qn = /* @__PURE__ */ K(Xn, [["__scopeId", "data-v-d7113347"]]), _n = ["data-agent-open", "aria-expanded", "role", "tabindex"], el = {
  class: "agent-head",
  "data-agent-head": ""
}, tl = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, al = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, nl = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, ll = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, ol = {
  key: 0,
  class: "agent-menu",
  "data-agent-menu-panel": ""
}, sl = {
  key: 1,
  class: "agent-line"
}, rl = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, il = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, dl = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, ul = {
  key: 3,
  class: "agent-unit",
  "data-agent-unit": ""
}, cl = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), o = ["completed", "testing"], i = { running: "Working", starting: "Starting", stopping: "Stopping", ended: "Idle: its process has stopped", failed: "Could not start", never_started: "Not started" }, n = e, u = l, $ = _e(), O = E(!1), T = c(() => yt(n.row, n.facts)), I = c(() => {
      var w;
      return ((w = n.facts) == null ? void 0 : w.tasks) ?? [];
    }), F = c(() => I.value.filter((w) => w.state === "open")), N = c(() => I.value.find((w) => {
      var L;
      return w.id === ((L = n.progress) == null ? void 0 : L.task_id) && w.state === "started";
    })), H = c(() => N.value || I.value.find((w) => {
      var L;
      return w.id === ((L = n.facts) == null ? void 0 : L.task_id);
    }) || I.value.find((w) => t.has(w.state)) || F.value[0] || I.value.at(-1)), j = c(() => {
      var w, L, ue, se, le, pe;
      return n.row.role === "helper" ? ((w = n.facts) == null ? void 0 : w.helper_job) || "" : (L = n.facts) != null && L.job_enabled && (((ue = N.value) == null ? void 0 : ue.title) || ((se = n.facts) == null ? void 0 : se.task_title) || ((le = F.value[0]) == null ? void 0 : le.title) || ((pe = I.value.at(-1)) == null ? void 0 : pe.title)) || "";
    }), V = c(() => wt(n.row)), q = c(() => {
      var w, L;
      return [n.row.program, (w = n.facts) == null ? void 0 : w.model, (L = n.facts) == null ? void 0 : L.effort, V.value].filter(Boolean).join(" · ");
    }), Y = Ee(), G = /* @__PURE__ */ new Set(["open", "started", "testing"]), Q = { fresh: "new conversation", resumed: "resumed" }, ae = c(() => {
      var w, L;
      return [(w = n.facts) == null ? void 0 : w.helper_job_program, Q[(L = n.facts) == null ? void 0 : L.occupant_launch]].filter(Boolean).join(", ");
    }), P = c(() => {
      var w;
      return (w = n.facts) == null ? void 0 : w.work_status;
    }), X = c(() => !!n.row.ended_at && n.row.role !== "main" && I.value.some((w) => G.has(w.state))), x = c(() => {
      var w, L;
      return n.row.state === "running" && ((w = n.facts) == null ? void 0 : w.state) === "at usage limit" && !!((L = n.facts) != null && L.usage_limit_ends_at);
    }), v = (w) => new Date(w).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), Z = c(() => n.row.halted_at ? `Stopped at the usage limit since ${v(n.row.halted_at)}, goes on at ${v(n.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(n.facts.usage_limit_ends_at).toLocaleString()}`), k = c(() => {
      var w;
      return n.row.retired_at || n.row.state === "retired" ? "retired" : x.value || P.value || n.waitReason || X.value ? "waiting" : n.row.state === "running" && ((w = n.facts) == null ? void 0 : w.state) || n.row.state;
    }), h = c(() => {
      var w;
      return x.value ? Z.value : P.value ? `Status: ${P.value}` : n.waitReason ? `Waiting: ${n.waitReason}` : k.value === "blocked" ? (w = n.facts) != null && w.blocked_reason ? `Blocked: ${n.facts.blocked_reason}` : "Blocked" : X.value ? "Stopped with work left" : "";
    }), W = c(() => {
      var w;
      return ((w = n.progress) == null ? void 0 : w.completed_count) ?? I.value.filter((L) => o.includes(L.state)).length;
    }), g = c(() => {
      var w;
      return Mt(W.value, ((w = n.progress) == null ? void 0 : w.started_at) || n.row.created_at, n.progress ? n.progress.finished_at : n.row.ended_at, $.value);
    }), B = c(() => n.row.role === "main" ? 0 : g.value), M = c(() => !!n.row.retired_at || n.row.state === "retired"), A = c(() => M.value ? "Retired" : k.value === "blocked" || k.value === "waiting" ? h.value || (k.value === "blocked" ? "Blocked" : "Waiting") : i[n.row.standing]), ie = c(() => {
      var L;
      if (M.value) return n.row.retired_at;
      const w = k.value === "blocked" || k.value === "waiting";
      return n.row.ended_at || w && ((L = n.facts) == null ? void 0 : L.last_activity) || n.row.process_started_at || n.row.created_at;
    }), U = c(() => !!n.row.ended_at || M.value), he = (w, L) => async ({ say: ue }) => {
      const se = await Y.run(["agent", ...w, String(n.row.number)]);
      ue(se.ok ? `${T.value} ${L}` : se.error);
    }, ne = () => ({
      head: T.value,
      items: [
        { label: "Open", group: "open", disabled: n.open, reason: "Already open", run: () => u("toggle") },
        { label: n.row.paused_at ? "Resume" : "Pause", group: "open", disabled: U.value, reason: "Process stopped", run: he([n.row.paused_at ? "resume" : "pause"], n.row.paused_at ? "resumed" : "paused") },
        { label: "Copy name", group: "copy", run: ({ say: w }) => Tt(T.value, "the name", w) },
        { label: "Open its task", group: "copy", disabled: !H.value, reason: "No task", run: () => we(`tasks:${H.value.id}`) },
        { label: "Stop", danger: !0, disabled: U.value || n.row.role === "main", reason: U.value ? "Process stopped" : "The main agent", run: he(["stop"], "stopped") }
      ]
    }), Me = c(() => $t(ie.value, $.value)), ve = c(() => {
      var w;
      return xt((w = n.facts) == null ? void 0 : w.last_activity, $.value);
    });
    return (w, L) => {
      var ue, se, le, pe, Le, Oe, Te;
      return ut((a(), s("div", {
        class: de(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: L[2] || (L[2] = (ce) => !e.open && u("toggle")),
        onKeydown: [
          L[3] || (L[3] = Ue(ee((ce) => !e.open && u("toggle"), ["self", "prevent"]), ["enter"])),
          L[4] || (L[4] = Ue(ee((ce) => !e.open && u("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        m("div", el, [
          e.open ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back",
            "aria-label": "Back",
            onClick: L[0] || (L[0] = ee((ce) => u("toggle"), ["stop"]))
          }, [
            b(r(We), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : y("", !0),
          e.open ? (a(), s(D, { key: 1 }, [
            m("span", tl, d(T.value.title), 1),
            m("span", al, d(T.value.subtext), 1),
            b(r(_), {
              variant: "ghost",
              small: "",
              class: "agent-menu-button",
              "data-agent-menu": "",
              "aria-expanded": O.value,
              onClick: L[1] || (L[1] = ee((ce) => O.value = !O.value, ["stop"]))
            }, {
              default: p(() => [...L[5] || (L[5] = [
                f("Actions", -1)
              ])]),
              _: 1
            }, 8, ["aria-expanded"])
          ], 64)) : (a(), s(D, { key: 2 }, [
            b(r(St), {
              "agent-id": e.row.id,
              label: T.value.text,
              class: "agent-who"
            }, {
              default: p(() => [
                m("span", nl, d(T.value.title), 1),
                m("span", ll, d(T.value.subtext), 1)
              ]),
              _: 1
            }, 8, ["agent-id", "label"]),
            b(r(We), {
              class: "agent-chevron",
              name: "chevronRight",
              size: 12
            })
          ], 64))
        ]),
        e.open && O.value ? (a(), s("div", ol, [
          b(la, {
            row: e.row,
            held: k.value === "blocked"
          }, null, 8, ["row", "held"])
        ])) : y("", !0),
        e.open ? y("", !0) : (a(), s("span", sl, [
          m("span", rl, d(q.value), 1),
          (ue = e.facts) != null && ue.sandbox_off ? (a(), s("span", il, "sandbox off")) : y("", !0)
        ])),
        e.open && !M.value ? (a(), z(Qn, {
          key: 2,
          class: "agent-live",
          "agent-programs": r(Y).props.programs.rows.value,
          agent: e.row,
          branch: (se = e.progress) == null ? void 0 : se.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((le = e.facts) == null ? void 0 : le.windows) ?? [] },
          card: ""
        }, {
          default: p(() => {
            var ce;
            return [
              (ce = e.facts) != null && ce.sandbox_off ? (a(), s("span", dl, "sandbox off")) : y("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : y("", !0),
        !e.open && ((pe = e.facts) != null && pe.unit_name) ? (a(), s("div", ul, "Unit: " + d(e.facts.unit_name), 1)) : y("", !0),
        e.open ? y("", !0) : (a(), z(tn, {
          key: 4,
          tasks: I.value,
          "in-hand": e.row.role !== "helper" && ((Le = e.facts) != null && Le.job_enabled) && H.value || null,
          job: e.row.role === "helper" ? j.value : "",
          "job-title": e.row.role === "helper" && ((Oe = e.facts) == null ? void 0 : Oe.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? ae.value : "",
          "per-hour": B.value,
          "counts-empty": e.row.role === "worker",
          "plan-counts": ((Te = e.facts) == null ? void 0 : Te.plan_counts) ?? {}
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour", "counts-empty", "plan-counts"])),
        b(Va, {
          state: k.value,
          doing: A.value,
          since: Me.value,
          seen: ve.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (a(), z(Ba, {
          key: 5,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: I.value,
          "stopped-with-work": X.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : y("", !0)
      ], 42, _n)), [
        [r(Ct), ne]
      ]);
    };
  }
}, gl = /* @__PURE__ */ K(cl, [["__scopeId", "data-v-bc86a7b0"]]), vl = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, pl = ["data-agent-row", "data-agent-lingering"], Ke = "journal.agents.filters", Ze = 300 * 1e3, Ve = "cubic-bezier(0.2, 0.9, 0.25, 1)", ml = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const l = e, t = Ee(), { rows: o } = t.props.waits, { rows: i } = t.props.progress, { rows: n, failure: u, loaded: $, more: O } = t.props.agents, T = (S) => i.value.find((R) => R.agent_id === S.id) ?? null, I = (S) => {
      var R;
      return ((R = o.value.find((C) => C.agent_id === S.id)) == null ? void 0 : R.reason) ?? "";
    }, F = E("running"), N = E(""), H = JSON.parse(localStorage.getItem(Ke) || '{"roles":[],"profiles":[],"programs":[]}'), j = E(H), V = c(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: q } = t.props.programs, Y = c(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), G = (S, R) => {
      j.value = Lt(j.value, S, R);
    }, Q = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, ae = (S) => S.slice(0, 1).toUpperCase() + S.slice(1);
    ge(j, (S) => localStorage.setItem(Ke, JSON.stringify(S)));
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
    async function x() {
      return P.value += 25, X(), await t.reload("agents"), !0;
    }
    ge([F, N, j], () => {
      P.value = 25, X(), t.reload("agents");
    }), X();
    const v = (S) => S.facts ?? null, Z = n, k = _e(), h = E([]), W = c(() => new Set(h.value.filter((S) => k.value - S.left < Ze).map((S) => S.row.id))), g = c(() => h.value.filter((S) => W.value.has(S.row.id)).map((S) => S.row)), B = c(() => [...Z.value, ...g.value]);
    let M = "", A = [];
    async function ie(S) {
      await t.reload(`card.${S.id}`);
      const R = t.props[`card.${S.id}`].rows.value.find((C) => C.id === S.id);
      R != null && R.ended_at && !h.value.some((C) => C.row.id === S.id) && (h.value = [...h.value, { row: R, left: Date.now() }]);
    }
    ge(n, (S) => {
      const R = M === `${F.value}|${N.value}|${JSON.stringify(j.value)}` && F.value === "running", C = R ? A.filter((J) => !S.some(($e) => $e.id === J.id)) : [];
      M = `${F.value}|${N.value}|${JSON.stringify(j.value)}`, A = S, h.value = R ? h.value.filter((J) => k.value - J.left < Ze && !S.some(($e) => $e.id === J.row.id)) : [], C.forEach(ie);
    }, { immediate: !0 });
    const U = c(() => !!N.value.trim() || Y.value > 0), he = c(() => l.texts[F.value] ?? { title: l.empty, hint: "" }), ne = E(null), Me = E(null), ve = E(null), w = E(null), L = c(() => ne.value === null ? null : t.props[`card.${ne.value}`].rows.value.find((S) => S.id === ne.value) ?? Me.value), ue = c(() => L.value ? [L.value] : B.value), se = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, le = E(!1);
    let pe = 0;
    const Le = (S) => [...S.attributes].map((R) => R.name).find((R) => R.startsWith("data-agent-") && R !== "data-agent-motion") ?? "";
    async function Oe(S) {
      if (le.value) return;
      le.value = !0, pe = w.value.scrollTop;
      const R = ve.value.querySelector(`[data-agent-open="${S.id}"]`);
      if (!se()) {
        const xe = [...ve.value.querySelectorAll(".agent-row")].filter((me) => !me.contains(R));
        await Promise.all(xe.map((me) => me.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const C = [...R.querySelectorAll(".agent-head, .agent-line")], J = [...C, ...R.querySelectorAll("[data-agent-motion]")], $e = J.map(Le), Re = J.map((xe) => xe.getBoundingClientRect());
      if (Me.value = S, ne.value = S.id, t.reload(`card.${S.id}`), await Ge(), !se()) {
        const xe = J.map((re, fe) => re.isConnected ? re : $e[fe] ? R.querySelector(`[${$e[fe]}]`) : null), me = xe.map((re) => re == null ? void 0 : re.getBoundingClientRect());
        xe.forEach((re, fe) => {
          if (!re) return;
          const Se = C.findIndex((Pe) => Pe !== re && Pe.contains(re)), at = Re[fe].left - me[fe].left - (Se < 0 ? 0 : Re[Se].left - me[Se].left), nt = Re[fe].top - me[fe].top - (Se < 0 ? 0 : Re[Se].top - me[Se].top);
          re.animate([{ transform: `translate(${at}px, ${nt}px)` }, { transform: "none" }], { duration: 280, easing: Ve });
        }), ve.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((re) => {
          re.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Ve, fill: "backwards" });
        });
      }
      le.value = !1;
    }
    async function Te() {
      if (le.value || !L.value) return;
      le.value = !0;
      const S = ve.value.querySelector(`[data-agent-open="${ne.value}"]`), R = [...S.children], C = se() ? [] : R.map((J) => J.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(C.map((J) => J.finished)), ne.value = null, await Ge(), w.value.scrollTop = pe, C.forEach((J) => J.cancel()), se() || (S.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Ve }), ve.value.querySelectorAll(".agent-row").forEach((J) => {
        J.contains(S) || J.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Ve });
      })), le.value = !1;
    }
    const ce = (S) => ne.value === S.id ? Te() : Oe(S);
    ge(N, (S) => S.trim() && (ne.value = null)), ge(F, () => {
      ne.value = null;
    });
    const Fe = (S) => {
      S.key === "Escape" && Te();
    };
    return window.addEventListener("keydown", Fe), je(() => window.removeEventListener("keydown", Fe)), (S, R) => (a(), s("div", {
      ref_key: "agents",
      ref: ve,
      class: de(["agents", { focused: L.value, "card-changing": le.value }])
    }, [
      L.value ? y("", !0) : (a(), z(r(At), {
        key: 0,
        modelValue: N.value,
        "onUpdate:modelValue": R[1] || (R[1] = (C) => N.value = C),
        placeholder: "Search agents",
        "menu-count": Y.value,
        "data-agents-search": ""
      }, {
        menu: p(() => [
          b(r(Ne), null, {
            default: p(() => [...R[2] || (R[2] = [
              f("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(D, null, te(V.value.roles, (C) => (a(), z(r(Ie), {
            key: C,
            role: "menuitemcheckbox",
            "aria-checked": j.value.roles.includes(C),
            checked: j.value.roles.includes(C),
            "data-filter-role": C,
            onClick: (J) => G("roles", C)
          }, {
            default: p(() => [
              f(d(ae(C)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          V.value.profiles.length ? (a(), z(r(Ne), { key: 0 }, {
            default: p(() => [...R[3] || (R[3] = [
              f("Profile", -1)
            ])]),
            _: 1
          })) : y("", !0),
          (a(!0), s(D, null, te(V.value.profiles, (C) => (a(), z(r(Ie), {
            key: C.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.profiles.includes(C.name),
            checked: j.value.profiles.includes(C.name),
            "data-filter-profile": C.name,
            onClick: (J) => G("profiles", C.name)
          }, {
            default: p(() => [
              f(d(C.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          b(r(Ne), null, {
            default: p(() => [...R[4] || (R[4] = [
              f("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(D, null, te(r(q), (C) => (a(), z(r(Ie), {
            key: C.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.programs.includes(C.name),
            checked: j.value.programs.includes(C.name),
            "data-filter-program": C.name,
            onClick: (J) => G("programs", C.name)
          }, {
            default: p(() => [
              f(d(C.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          Y.value ? (a(), z(r(Ie), {
            key: 1,
            "data-filter-clear": "",
            onClick: Q
          }, {
            default: p(() => [...R[5] || (R[5] = [
              f("Clear filters", -1)
            ])]),
            _: 1
          })) : y("", !0)
        ]),
        default: p(() => [
          b(r(jt), {
            options: V.value.states,
            value: F.value,
            onPick: R[0] || (R[0] = (C) => F.value = C)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      F.value === "retired" && V.value.upgrade_retired ? (a(), s("p", vl, "Retired during the upgrade: " + d(V.value.upgrade_retired), 1)) : y("", !0),
      m("div", {
        ref_key: "list",
        ref: w,
        class: de(["agents-view", { "agents-view-open": L.value }])
      }, [
        r($) && !r(u) && !ue.value.length && Y.value ? (a(), z(r(qe), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: p(() => [
            b(r(_), {
              small: "",
              "data-empty-clear": "",
              onClick: Q
            }, {
              default: p(() => [...R[6] || (R[6] = [
                f("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), z(r(Bt), {
          key: 1,
          moves: "",
          "leaves-at-once": le.value,
          rows: ue.value,
          failure: r(u),
          loaded: r($),
          more: !L.value && r(O),
          older: x,
          empty: he.value.title,
          hint: he.value.hint,
          searching: U.value
        }, {
          default: p(({ row: C }) => [
            m("div", {
              class: de(["agent-row", { lingering: W.value.has(C.id) && C.id !== ne.value }]),
              "data-agent-row": C.id,
              "data-agent-lingering": W.value.has(C.id) ? "" : null
            }, [
              b(gl, {
                row: C,
                facts: v(C),
                progress: T(C),
                "wait-reason": I(C),
                open: C.id === ne.value,
                onToggle: (J) => ce(C)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, pl)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, kl = /* @__PURE__ */ K(ml, [["__scopeId", "data-v-19199c00"]]);
export {
  kl as A
};
