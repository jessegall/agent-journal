import { openBlock as a, createElementBlock as s, withModifiers as le, createElementVNode as y, createVNode as m, unref as r, withCtx as f, createTextVNode as h, Fragment as q, renderList as ae, toDisplayString as g, createBlock as E, createCommentVNode as p, ref as H, computed as c, watch as ve, onUnmounted as xe, defineAsyncComponent as _e, createSlots as et, resolveDynamicComponent as tt, normalizeClass as ce, normalizeStyle as Be, renderSlot as Se, onMounted as at, Teleport as nt, mergeProps as ot, toRef as Oe, withKeys as qe, nextTick as Fe } from "vue";
import { TextInput as He, Btn as te, TextArea as lt, TimeAgo as Ne, useWindow as Ie, SwitchCase as Je, peekRef as Ce, Icon as ze, RunningCommand as st, FoldGroup as Ke, TaskStatusIcon as rt, loadWindowComponent as it, coalesced as dt, READ_RATES as ut, eventMayBeChildOf as ct, InnerTabs as gt, TabBody as vt, EmptyState as Ee, HoverTip as Me, TaskBar as mt, useNow as Ze, age as pt, perHour as ht, sinceWords as ft, seenWords as bt, AgentTip as kt, SearchBar as yt, Segmented as wt, MenuLabel as Ve, MenuItem as Le, RowList as Mt, toggleFilter as $t } from "@journal/window-kit";
import { _ as Z, T as xt } from "./TranscriptRows-Crmxs6Un.js";
const St = { class: "action-buttons" }, Ct = {
  __name: "AgentDriverForm",
  props: { program: String, model: String, pending: Boolean },
  emits: ["submit", "cancel", "update:program", "update:model"],
  setup(e) {
    return (o, t) => (a(), s("form", {
      "data-agent-driver-form": "",
      onSubmit: t[3] || (t[3] = le((l) => o.$emit("submit"), ["prevent"]))
    }, [
      t[6] || (t[6] = y("p", null, "Starts the next session on this program; the agent keeps its number and memories.", -1)),
      m(r(He), {
        "model-value": e.program,
        label: "Program",
        disabled: e.pending,
        "data-agent-driver-program": "",
        "onUpdate:modelValue": t[0] || (t[0] = (l) => o.$emit("update:program", l))
      }, null, 8, ["model-value", "disabled"]),
      m(r(He), {
        "model-value": e.model,
        label: "Model",
        disabled: e.pending,
        "data-agent-driver-model": "",
        "onUpdate:modelValue": t[1] || (t[1] = (l) => o.$emit("update:model", l))
      }, null, 8, ["model-value", "disabled"]),
      y("div", St, [
        m(r(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.program.trim() || !e.model.trim(),
          "data-agent-confirm-driver": ""
        }, {
          default: f(() => [...t[4] || (t[4] = [
            h("Change the driver", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        m(r(te), {
          small: "",
          disabled: e.pending,
          onClick: t[2] || (t[2] = (l) => o.$emit("cancel"))
        }, {
          default: f(() => [...t[5] || (t[5] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Tt = /* @__PURE__ */ Z(Ct, [["__scopeId", "data-v-c138a4da"]]), At = { class: "action-field" }, jt = ["value", "disabled"], Lt = ["value"], Rt = { key: 1 }, Bt = {
  key: 1,
  class: "action-field"
}, It = { class: "action-buttons" }, Ot = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (o, t) => (a(), s("form", {
      onSubmit: t[4] || (t[4] = le((l) => o.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (a(), s(q, { key: 0 }, [
        y("label", At, [
          t[6] || (t[6] = h("Task ", -1)),
          y("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: t[0] || (t[0] = (l) => o.$emit("update:task", l.target.value))
          }, [
            t[5] || (t[5] = y("option", { value: "" }, "Choose an open task", -1)),
            (a(!0), s(q, null, ae(e.tasks, (l) => (a(), s("option", {
              key: l.id,
              value: String(l.id)
            }, g(l.id) + ": " + g(l.title), 9, Lt))), 128))
          ], 40, jt)
        ]),
        e.moreTasks ? (a(), E(r(te), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: t[1] || (t[1] = (l) => o.$emit("more"))
        }, {
          default: f(() => [...t[7] || (t[7] = [
            h("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : p("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (a(), s("p", Rt, "No open tasks.")) : p("", !0)
      ], 64)) : (a(), s("label", Bt, [
        t[8] || (t[8] = h("Job", -1)),
        m(r(lt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (l) => o.$emit("update:text", l.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      y("div", It, [
        m(r(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: f(() => [...t[9] || (t[9] = [
            h("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        m(r(te), {
          small: "",
          disabled: e.pending,
          onClick: t[3] || (t[3] = (l) => o.$emit("cancel"))
        }, {
          default: f(() => [...t[10] || (t[10] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Vt = /* @__PURE__ */ Z(Ot, [["__scopeId", "data-v-adde4158"]]), Ht = { class: "action-buttons" }, zt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (o, t) => (a(), s("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = le((l) => o.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = y("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      m(r(He), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (l) => o.$emit("update:reason", l))
      }, null, 8, ["model-value", "disabled"]),
      y("div", Ht, [
        m(r(te), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: f(() => [...t[3] || (t[3] = [
            h("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        m(r(te), {
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (l) => o.$emit("cancel"))
        }, {
          default: f(() => [...t[4] || (t[4] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Et = /* @__PURE__ */ Z(zt, [["__scopeId", "data-v-92de7dd6"]]), Nt = {
  class: "session-history",
  "data-agent-session-history": ""
}, Wt = { key: 0 }, Dt = { key: 0 }, qt = { "data-agent-session-state": "" }, Ft = { class: "action-buttons" }, Ut = {
  __name: "AgentSessionHistory",
  props: { sessions: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e) {
    return (o, t) => (a(), s("div", Nt, [
      e.sessions.length ? p("", !0) : (a(), s("p", Wt, "This agent has no session in its history.")),
      y("ol", null, [
        (a(!0), s(q, null, ae(e.sessions, (l) => (a(), s("li", {
          key: l.session,
          "data-agent-session": ""
        }, [
          y("span", null, g([l.program, l.model].filter(Boolean).join(" ")), 1),
          l.started_at ? (a(), s("span", Dt, [
            t[1] || (t[1] = h("Started ", -1)),
            m(r(Ne), {
              at: l.started_at
            }, null, 8, ["at"])
          ])) : p("", !0),
          y("span", qt, g(l.end_reason ? `Ended: ${l.end_reason.replaceAll("_", " ")}` : l.started_at ? "Running" : "Not started"), 1),
          y("code", null, g(l.session), 1)
        ]))), 128))
      ]),
      y("div", Ft, [
        m(r(te), {
          small: "",
          onClick: t[0] || (t[0] = (l) => o.$emit("close"))
        }, {
          default: f(() => [...t[2] || (t[2] = [
            h("Close", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Pt = /* @__PURE__ */ Z(Ut, [["__scopeId", "data-v-0d688bd9"]]), Gt = { class: "action-buttons" }, Jt = {
  key: 0,
  role: "alert"
}, Kt = {
  key: 1,
  role: "status"
}, Zt = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 }, held: { type: Boolean, default: !1 } },
  setup(e) {
    const o = e, t = Ie(), l = H(""), i = H(""), n = H(""), b = H(""), $ = H(""), A = H(""), S = H([]), D = H(0), F = H(!1), O = H(!1), N = H(!1), j = H(""), I = H(""), W = H([]), Q = c(() => !!o.row.retired_at || o.row.state === "retired"), J = c(() => !Q.value && !!o.row.ended_at), X = c(() => {
      var R;
      return J.value && ((R = o.row.job_command) == null ? void 0 : R.length) && !o.row.resume_reason;
    }), ne = c(() => X.value && !O.value && (o.row.job_task_flag ? S.value.some((R) => String(R.id) === A.value) : !!i.value.trim()));
    function U(R) {
      l.value = R, i.value = "", n.value = "", A.value = "", j.value = "", I.value = "";
    }
    async function Y() {
      U("job"), o.row.job_task_flag && (S.value = [], D.value = 0, F.value = !1, await M());
    }
    async function M() {
      if (!O.value) {
        O.value = !0;
        try {
          t.state["jobs.page"] = String(D.value + 1), await t.reload("jobs");
          const R = t.props.jobs;
          j.value = R.failure.value, j.value || (S.value = [...S.value, ...R.rows.value], D.value = R.data.value.page, F.value = R.more.value);
        } finally {
          O.value = !1;
        }
      }
    }
    async function v() {
      await P(["process", "lift-hold", String(o.row.number)], "Hold lifted.");
    }
    async function P(R, T) {
      if (!N.value) {
        N.value = !0, j.value = "";
        try {
          const se = await t.run(R);
          j.value = se.ok ? "" : se.error, se.ok && (U(""), I.value = T);
        } finally {
          N.value = !1;
        }
      }
    }
    async function k() {
      if (!ne.value) return;
      const R = o.row.job_task_flag ? [o.row.job_task_flag, A.value] : [i.value.trim()];
      await P([...o.row.job_command, String(o.row.number), ...R], "Job sent.");
    }
    async function u() {
      if (!N.value) {
        N.value = !0;
        try {
          const R = await t.run(["agent", "sessions", String(o.row.number)]);
          U(R.ok ? "history" : ""), j.value = R.ok ? "" : R.error, W.value = R.ok ? R.value.rows : [];
        } finally {
          N.value = !1;
        }
      }
    }
    function d() {
      U("driver"), b.value = o.row.program || "", $.value = "";
    }
    async function B() {
      !J.value || l.value !== "driver" || !b.value.trim() || !$.value.trim() || await P(["agent", "driver", String(o.row.number), "--program", b.value.trim(), "--model", $.value.trim()], "Driver changed.");
    }
    async function z() {
      !J.value || l.value !== "retire" || !n.value.trim() || await P(["agent", "retire", String(o.row.number), "--reason", n.value.trim()], "Agent retired permanently.");
    }
    return (R, T) => {
      var se;
      return a(), s("div", {
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: T[10] || (T[10] = le(() => {
        }, ["stop"])),
        onKeydown: T[11] || (T[11] = le(() => {
        }, ["stop"]))
      }, [
        y("div", Gt, [
          m(r(te), {
            small: "",
            "data-agent-history": "",
            disabled: N.value || O.value,
            onClick: u
          }, {
            default: f(() => [...T[12] || (T[12] = [
              h("Session history", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          e.held ? (a(), E(r(te), {
            key: 0,
            small: "",
            "data-agent-lift-hold": "",
            disabled: N.value,
            onClick: v
          }, {
            default: f(() => [...T[13] || (T[13] = [
              h("Lift this hold", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])) : p("", !0),
          J.value ? (a(), s(q, { key: 1 }, [
            (se = e.row.job_command) != null && se.length ? (a(), E(r(te), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: N.value || O.value || !X.value,
              onClick: Y
            }, {
              default: f(() => [...T[14] || (T[14] = [
                h("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : p("", !0),
            e.row.role !== "main" ? (a(), E(r(te), {
              key: 1,
              small: "",
              "data-agent-driver": "",
              disabled: N.value || O.value,
              onClick: d
            }, {
              default: f(() => [...T[15] || (T[15] = [
                h("Change driver", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : p("", !0),
            e.row.role !== "main" ? (a(), E(r(te), {
              key: 2,
              small: "",
              "data-agent-retire": "",
              disabled: N.value || O.value,
              onClick: T[0] || (T[0] = (K) => U("retire"))
            }, {
              default: f(() => [...T[16] || (T[16] = [
                h("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : p("", !0)
          ], 64)) : p("", !0)
        ]),
        m(r(Je), { value: l.value }, {
          job: f(() => [
            m(Vt, {
              task: A.value,
              "onUpdate:task": T[1] || (T[1] = (K) => A.value = K),
              text: i.value,
              "onUpdate:text": T[2] || (T[2] = (K) => i.value = K),
              row: e.row,
              tasks: S.value,
              pending: N.value,
              loading: O.value,
              "more-tasks": F.value,
              failure: j.value,
              "job-ready": ne.value,
              onSubmit: k,
              onMore: M,
              onCancel: T[3] || (T[3] = (K) => U(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          driver: f(() => [
            m(Tt, {
              program: b.value,
              "onUpdate:program": T[4] || (T[4] = (K) => b.value = K),
              model: $.value,
              "onUpdate:model": T[5] || (T[5] = (K) => $.value = K),
              pending: N.value,
              onSubmit: B,
              onCancel: T[6] || (T[6] = (K) => U(""))
            }, null, 8, ["program", "model", "pending"])
          ]),
          history: f(() => [
            m(Pt, {
              sessions: W.value,
              onClose: T[7] || (T[7] = (K) => U(""))
            }, null, 8, ["sessions"])
          ]),
          retire: f(() => [
            m(Et, {
              reason: n.value,
              "onUpdate:reason": T[8] || (T[8] = (K) => n.value = K),
              pending: N.value,
              onSubmit: z,
              onCancel: T[9] || (T[9] = (K) => U(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        j.value ? (a(), s("p", Jt, g(j.value), 1)) : p("", !0),
        I.value ? (a(), s("p", Kt, g(I.value), 1)) : p("", !0)
      ], 32);
    };
  }
}, Yt = /* @__PURE__ */ Z(Zt, [["__scopeId", "data-v-4e3619f8"]]), Qt = {
  class: "agent-command",
  "data-agent-command": ""
}, Xt = {
  key: 1,
  "data-agent-stopped": ""
}, _t = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (o, t) => (a(), s("span", Qt, [
      e.waitReason ? (a(), s("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: t[0] || (t[0] = le((l) => r(Ce)("test_queue:0"), ["stop"]))
      }, [
        h("Waiting: " + g(e.waitReason) + " ", 1),
        m(r(ze), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), s("span", Xt, "Waiting")) : (a(), E(r(st), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, ea = /* @__PURE__ */ Z(_t, [["__scopeId", "data-v-1b371fb5"]]), ta = {
  key: 0,
  class: "lasting-facts",
  "data-agent-lasting-facts": ""
}, aa = { "data-agent-retired-at": "" }, na = { key: 0 }, oa = { "data-agent-retired-by": "" }, la = {
  __name: "AgentLastingFacts",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    return (o, t) => e.row.retired_at ? (a(), s("dl", ta, [
      y("div", null, [
        t[0] || (t[0] = y("dt", null, "Retired", -1)),
        y("dd", aa, [
          m(r(Ne), {
            at: e.row.retired_at
          }, null, 8, ["at"])
        ])
      ]),
      e.row.retiring_actor_name ? (a(), s("div", na, [
        t[1] || (t[1] = y("dt", null, "Retired by", -1)),
        y("dd", oa, g(e.row.retiring_actor_name), 1)
      ])) : p("", !0)
    ])) : p("", !0);
  }
}, sa = /* @__PURE__ */ Z(la, [["__scopeId", "data-v-abc8e12a"]]), ra = ["data-agent-delegated", "onClick"], ia = { class: "agent-task-number" }, da = { class: "agent-task-title" }, ua = ["title"], ca = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = o;
    return (l, i) => (a(), E(r(Ke), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: i[0] || (i[0] = (n) => t("toggle"))
    }, {
      default: f(() => [
        (a(!0), s(q, null, ae(e.section.tasks, (n) => (a(), s("button", {
          key: n.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": n.id,
          onClick: (b) => r(Ce)(`tasks:${n.id}`)
        }, [
          m(r(rt), {
            status: n.state
          }, null, 8, ["status"]),
          y("span", ia, g(n.id), 1),
          y("span", da, g(n.title), 1),
          n.plan_id ? (a(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${n.plan_id}: ${n.plan_title}`
          }, "Plan " + g(n.plan_id), 9, ua)) : p("", !0)
        ], 8, ra))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, ga = /* @__PURE__ */ Z(ca, [["__scopeId", "data-v-ea4ccd6b"]]), va = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, ma = {
  key: 1,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, pa = ["data-peek", "onClick"], ha = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, fa = {
  key: 0,
  class: "agent-helper-brief"
}, ba = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ka = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, ya = "It ended without a report", wa = {
  __name: "AgentCardDetails",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, tasks: { type: Array, required: !0 }, stoppedWithWork: Boolean, open: Boolean },
  setup(e) {
    const o = e, t = ["started", "blocked", "open", "completed"], l = c(() => {
      var k, u;
      return o.row.ended_at && ((u = (k = o.facts) == null ? void 0 : k.job_returned) != null && u.startsWith(ya)) ? o.facts.job_returned : "";
    }), i = c(() => o.tasks.length ? t.map((k) => ({ state: k, label: k.slice(0, 1).toUpperCase() + k.slice(1), tasks: o.tasks.filter((u) => u.state === k || k === "started" && u.state === "testing" || k === "completed" && u.state === "cancelled") })) : []), n = /* @__PURE__ */ new Set(["completed"]), b = H({}), $ = (k) => !(b.value[k] ?? n.has(k)), A = (k) => b.value = { ...b.value, [k]: $(k) }, S = Ie(), { rows: D } = S.props.reports;
    S.state["reports.agent"] = String(o.row.number);
    const F = c(() => o.row.access === "read-only"), O = ["tasks", "transcript", "terminal", "file-feed", "processes", "reports", "memories"], N = c(() => [...S.tabs].sort((k, u) => (O.indexOf(k.key) < 0 ? O.length : O.indexOf(k.key)) - (O.indexOf(u.key) < 0 ? O.length : O.indexOf(u.key)))), j = c(() => !!o.row.retired_at || o.row.state === "retired"), I = () => F.value || j.value ? N.value.find((k) => k.key === "transcript") : N.value[0], W = H(I());
    ve(W, (k) => {
      S.state.tab = (k == null ? void 0 : k.key) ?? "";
    }, { immediate: !0 }), xe(() => {
      S.state.tab = "";
    }), ve(N, (k) => {
      k.some((u) => {
        var d;
        return u.key === ((d = W.value) == null ? void 0 : d.key);
      }) || (W.value = k[0]);
    }), ve(() => o.open, (k) => {
      k && (W.value = I());
    });
    const Q = Object.fromEntries(S.tabs.filter((k) => k.component).map((k) => [k.key, _e(() => it(k.component))])), J = H(!1), { data: X } = S.props.tool, ne = c(() => {
      var k;
      return ((k = X.value) == null ? void 0 : k.tool) ?? "";
    }), U = c(() => {
      var k;
      return ((k = X.value) == null ? void 0 : k.note) ?? "";
    }), Y = c(() => o.row.role !== "main" && (!o.row.ended_at || o.stoppedWithWork || o.waitReason));
    async function M() {
      !o.open || !Y.value || (S.state["tool.agent"] = String(o.row.number), await S.reload("tool"));
    }
    const v = dt(M, ut.agentCommand), P = S.follow(["hook_call.*", "process_part.*"], (k) => ct(k, "session_agent_id", /* @__PURE__ */ new Set([o.row.id])) && v());
    return xe(() => P == null ? void 0 : P()), ve(() => o.open, (k) => {
      k && M();
    }, { immediate: !0 }), (k, u) => {
      var d;
      return a(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: u[2] || (u[2] = le(() => {
        }, ["stop"]))
      }, [
        m(sa, { row: e.row }, null, 8, ["row"]),
        e.row.retirement_reason ? (a(), s("p", va, "Retirement reason: " + g(e.row.retirement_reason), 1)) : p("", !0),
        l.value ? (a(), s("p", ma, g(l.value), 1)) : p("", !0),
        m(r(gt), {
          class: "agent-tabs",
          tabs: N.value,
          active: W.value,
          answer: { tasks: e.tasks.length, reports: e.row.report_count ?? r(D).length, memories: e.row.memory_count ?? 0 },
          onChoose: u[0] || (u[0] = (B) => W.value = B)
        }, null, 8, ["tabs", "active", "answer"]),
        m(r(vt), {
          class: "agent-tab-body",
          tab: W.value,
          "data-agent-tab-body": (d = W.value) == null ? void 0 : d.key
        }, {
          default: f(() => {
            var B;
            return [
              m(r(Je), {
                value: (B = W.value) == null ? void 0 : B.key
              }, et({
                reports: f(() => [
                  r(D).length ? p("", !0) : (a(), E(r(Ee), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: f(() => [...u[3] || (u[3] = [
                      h("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (a(!0), s(q, null, ae(r(D), (z) => (a(), s("button", {
                    key: z.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${z.id}`,
                    onClick: (R) => r(Ce)(`messages:${z.id}`)
                  }, g(z.text), 9, pa))), 128))
                ]),
                tasks: f(() => {
                  var z;
                  return [
                    e.tasks.length ? p("", !0) : (a(), E(r(Ee), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: f(() => [...u[4] || (u[4] = [
                        h("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (a(!0), s(q, null, ae(i.value, (R) => (a(), E(ga, {
                      key: R.state,
                      section: R,
                      open: $(R.state),
                      onToggle: (T) => A(R.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (z = e.facts) != null && z.instruction ? (a(), s(q, { key: 1 }, [
                      u[5] || (u[5] = y("p", { class: "agent-label" }, "Instruction", -1)),
                      y("div", ha, g(e.facts.instruction), 1)
                    ], 64)) : p("", !0)
                  ];
                }),
                transcript: f(() => {
                  var z;
                  return [
                    F.value ? (a(), s(q, { key: 0 }, [
                      (z = e.facts) != null && z.instruction ? (a(), s("div", fa, [
                        m(r(Ke), {
                          label: "Instruction",
                          open: J.value,
                          "data-agent-section": "instruction",
                          onToggle: u[1] || (u[1] = (R) => J.value = !J.value)
                        }, {
                          default: f(() => [
                            y("div", ba, g(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (a(), s("p", ka, "No job recorded")) : p("", !0)
                    ], 64)) : p("", !0),
                    m(xt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                ae(r(Q), (z, R) => ({
                  name: R,
                  fn: f(() => [
                    (a(), E(tt(z), {
                      agent: e.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ];
          }),
          _: 1
        }, 8, ["tab", "data-agent-tab-body"]),
        Y.value ? (a(), E(ea, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: ne.value,
          note: U.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : p("", !0)
      ]);
    };
  }
}, Ma = /* @__PURE__ */ Z(wa, [["__scopeId", "data-v-fabbecdf"]]), $a = { class: "line" }, xa = {
  key: 0,
  class: "line",
  "data-agent-since": ""
}, Sa = {
  key: 1,
  class: "line",
  "data-agent-seen": ""
}, Ca = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" }, seen: { type: String, default: "" } },
  setup(e) {
    const o = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, l = c(() => o.has(t.state)), i = c(() => [t.doing, t.since, t.seen].filter(Boolean).join(". "));
    return (n, b) => (a(), E(r(Me), {
      as: "button",
      place: "corner",
      class: ce(["agent-dot", { pulse: l.value }]),
      "data-state": e.state,
      "aria-label": i.value,
      "data-agent-status": "",
      onClick: b[0] || (b[0] = le(() => {
      }, ["stop"]))
    }, {
      tip: f(() => [
        y("b", $a, g(e.doing), 1),
        e.since ? (a(), s("span", xa, g(e.since), 1)) : p("", !0),
        e.seen ? (a(), s("span", Sa, g(e.seen), 1)) : p("", !0)
      ]),
      default: f(() => [
        b[1] || (b[1] = y("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, Ta = /* @__PURE__ */ Z(Ca, [["__scopeId", "data-v-1a0bc478"]]), Aa = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, ja = (e) => e.filter((o) => o.state !== "cancelled"), Ue = (e, o) => e.filter((t) => t.state === o).length, La = 5, Ra = (e, o) => e || o.split(/\s+/).slice(0, La).join(" ");
function Ba({ tasks: e, inHand: o, perHour: t }) {
  const l = ja(e), i = Ue(l, "completed"), n = Aa[o == null ? void 0 : o.state], b = l.filter((D) => D.state === "started").map((D) => ({ number: D.id, title: D.title })), $ = Math.max(b.length, o && o.state !== "completed" ? 1 : 0), A = l.length - i - $, S = i === l.length;
  return {
    number: o.id,
    title: o.title,
    started: b,
    plan: o.plan_id ?? 0,
    count: `${i} of ${l.length}`,
    taskTip: `${i} of its ${l.length} tasks done${n ? `. This one is ${n.words}.` : "."}`,
    countTip: S ? `All ${l.length} tasks done` : `${i} done, ${$} in hand, ${A} to go`,
    paceTip: !S && t ? `About ${t} an hour.` : "",
    rate: !S && t ? `${Math.round(t)}/hour` : "",
    bar: { total: l.length, done: i, testing: Ue(l, "testing") }
  };
}
const Ia = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, Oa = {
  key: 0,
  class: "plan",
  "data-agent-job-launch": ""
}, Va = {
  class: "task-line",
  "data-agent-task-line": ""
}, Ha = {
  key: 0,
  class: "tasks",
  "data-agent-tasks": ""
}, za = {
  key: 2,
  class: "plan",
  "data-agent-plan": ""
}, Ea = {
  key: 3,
  class: "rate",
  "data-agent-rate": ""
}, Na = { key: 0 }, Wa = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, jobTitle: { type: String, default: "" }, jobLaunch: { type: String, default: "" }, perHour: { type: Number, default: 0 } },
  setup(e) {
    const o = e, t = c(() => o.inHand ? Ba({ tasks: o.tasks, inHand: o.inHand, perHour: o.perHour }) : null);
    return (l, i) => e.job && !t.value ? (a(), s("span", Ia, [
      m(r(Me), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: f(() => [
          y("b", null, g(e.job), 1)
        ]),
        default: f(() => [
          h(g(r(Ra)(e.jobTitle, e.job)), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (a(), s("span", Oa, g(e.jobLaunch), 1)) : p("", !0)
    ])) : t.value ? (a(), s(q, { key: 1 }, [
      y("span", Va, [
        t.value.started.length > 1 ? (a(), s("span", Ha, [
          i[1] || (i[1] = h("Tasks ", -1)),
          (a(!0), s(q, null, ae(t.value.started, (n, b) => (a(), s(q, {
            key: n.number
          }, [
            b ? (a(), s(q, { key: 0 }, [
              h(", ")
            ], 64)) : p("", !0),
            m(r(Me), {
              as: "button",
              class: "task",
              "data-agent-task": "",
              "data-peek": `tasks:${n.number}`,
              "aria-label": `Task ${n.number}: ${n.title}`,
              onClick: le(($) => r(Ce)(`tasks:${n.number}`), ["stop"])
            }, {
              tip: f(() => [
                y("b", null, g(n.title), 1)
              ]),
              default: f(() => [
                h(g(n.number), 1)
              ]),
              _: 2
            }, 1032, ["data-peek", "aria-label", "onClick"])
          ], 64))), 128))
        ])) : (a(), E(r(Me), {
          key: 1,
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${t.value.number}`,
          "aria-label": `Task ${t.value.number}: ${t.value.title}`,
          onClick: i[0] || (i[0] = le((n) => r(Ce)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: f(() => [
            y("b", null, g(t.value.title), 1),
            y("span", null, g(t.value.taskTip), 1)
          ]),
          default: f(() => [
            h("Task " + g(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])),
        t.value.plan ? (a(), s("span", za, "Plan " + g(t.value.plan), 1)) : p("", !0),
        t.value.rate ? (a(), s("span", Ea, g(t.value.rate), 1)) : p("", !0),
        m(r(Me), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: f(() => [
            y("b", null, g(t.value.countTip), 1),
            t.value.paceTip ? (a(), s("span", Na, g(t.value.paceTip), 1)) : p("", !0)
          ]),
          default: f(() => [
            h(g(t.value.count), 1)
          ]),
          _: 1
        })
      ]),
      m(r(mt), {
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: t.value.bar.total,
        done: t.value.bar.done,
        testing: t.value.bar.testing
      }, null, 8, ["total", "done", "testing"])
    ], 64)) : p("", !0);
  }
}, Da = /* @__PURE__ */ Z(Wa, [["__scopeId", "data-v-e51f5781"]]), qa = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Fa = ["data-icon", "stroke-width", "innerHTML"], ee = {
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
    }, i = {
      agent: qa,
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
      style: Be({
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
      innerHTML: i[l[e.name] || e.name] || i.dot
    }, null, 12, Fa));
  }
}, Ua = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, Pa = {
  key: 1,
  class: "menu-item-text"
}, Ga = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (o, t) => (a(), s("button", {
      type: "button",
      class: ce(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), s("span", Ua, g(e.checked ? "✓" : ""), 1)) : p("", !0),
      e.description ? (a(), s("span", Pa, [
        y("span", null, [
          Se(o.$slots, "default", {}, void 0, !0)
        ]),
        y("small", null, g(e.description), 1)
      ])) : Se(o.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ke = /* @__PURE__ */ Z(Ga, [["__scopeId", "data-v-fec99974"]]), Ja = {}, Ka = { class: "menu-label" };
function Za(e, o) {
  return a(), s("span", Ka, [
    Se(e.$slots, "default", {}, void 0, !0)
  ]);
}
const $e = /* @__PURE__ */ Z(Ja, [["render", Za], ["__scopeId", "data-v-aa955b3e"]]), Ya = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, Qa = {
  key: 0,
  class: "skills-none"
}, Xa = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: o }) {
    const t = e, l = o, i = c(() => t.skills.filter((b) => b.state === "loaded")), n = c(() => t.skills.filter((b) => b.state !== "loaded"));
    return (b, $) => (a(), s("div", Ya, [
      m($e, null, {
        default: f(() => [...$[1] || ($[1] = [
          h("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      i.value.length ? p("", !0) : (a(), s("p", Qa, "None yet. Compacting the conversation empties this list.")),
      (a(!0), s(q, null, ae(i.value, (A) => (a(), s("p", {
        key: A.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        m(ee, {
          name: "book",
          size: 12
        }),
        h(g(A.skill), 1)
      ]))), 128)),
      n.value.length ? (a(), s(q, { key: 1 }, [
        m($e, null, {
          default: f(() => [...$[2] || ($[2] = [
            h("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), s(q, null, ae(n.value, (A) => (a(), s("p", {
          key: A.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          m(ee, {
            name: "book",
            size: 12
          }),
          h(g(A.skill), 1)
        ]))), 128))
      ], 64)) : p("", !0),
      m(ke, {
        "data-agent-skills-browse": "",
        onClick: $[0] || ($[0] = (A) => l("browse"))
      }, {
        default: f(() => [...$[3] || ($[3] = [
          h("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, _a = /* @__PURE__ */ Z(Xa, [["__scopeId", "data-v-be514d47"]]), en = ["disabled", "title"], tn = { class: "gauge usage" }, an = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: o }) {
    const t = e, l = o, i = c(() => t.windows[0] ?? null), n = c(() => i.value && Number.isFinite(i.value.used_percent) ? Math.max(0, Math.min(100, Math.round(i.value.used_percent))) : null), b = c(() => n.value !== null && n.value >= 100), $ = c(() => {
      var S;
      return (S = i.value) != null && S.reset_epoch_seconds ? new Date(i.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), A = c(() => b.value ? `At usage limit: the plan's ${i.value.title} allowance is used up${$.value ? `, starts again ${$.value}` : ""}` : `${n.value}% of the plan's ${i.value.title} allowance used${$.value ? `, starts again ${$.value}` : ""}`);
    return (S, D) => n.value !== null ? (a(), s("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: A.value,
      onClick: D[0] || (D[0] = (F) => l("open", F.currentTarget))
    }, [
      m(ee, {
        name: "allowance",
        size: 12
      }),
      D[1] || (D[1] = h()),
      y("span", tn, [
        y("span", {
          style: Be({ width: `${n.value}%` })
        }, null, 4)
      ]),
      h(" " + g(b.value ? "At usage limit" : `${n.value}%`), 1)
    ], 8, en)) : p("", !0);
  }
}, nn = /* @__PURE__ */ Z(an, [["__scopeId", "data-v-a36f09dc"]]), on = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (o, t) => (a(), s("span", {
      class: ce(["badge", e.tone])
    }, g(e.text), 3));
  }
}, ln = /* @__PURE__ */ Z(on, [["__scopeId", "data-v-9e7e1157"]]), sn = (e, o, t) => Math.max(o, Math.min(t, e)), Ye = /* @__PURE__ */ new WeakMap(), rn = (e, o) => Ye.set(e, o);
function dn(e, o) {
  for (let t = o; t; t = Ye.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function un(e, o) {
  const t = (l) => {
    var n, b;
    const i = ((n = e.value) == null ? void 0 : n.element) || ((b = e.value) == null ? void 0 : b.$el) || e.value;
    i && !dn(i, l.target) && o(l);
  };
  window.addEventListener("click", t), xe(() => window.removeEventListener("click", t));
}
const be = 8, cn = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const l = e, i = H(null), n = (d) => d ? `${d}px` : void 0, b = c(() => ({
      minWidth: n(l.minWidth),
      maxWidth: n(l.maxWidth),
      maxHeight: n(l.maxHeight),
      height: n(l.height)
    })), $ = H({ w: 0, h: 0 }), A = H(l.anchor ? l.anchor.getBoundingClientRect() : null), S = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), D = (d) => ({
      left: Math.max(0, d.left),
      top: Math.max(0, d.top),
      right: Math.min(window.innerWidth, d.right),
      bottom: Math.min(window.innerHeight, d.bottom)
    }), F = (d) => {
      const B = d.closest(".pane, .float-window");
      return B ? D(B.getBoundingClientRect()) : S();
    }, O = (d, B) => `${Math.max(0, d ? Math.min(d, B) : B)}px`;
    function N(d, B) {
      return {
        below: d.bottom - B.bottom - l.gap - be,
        above: B.top - d.top - l.gap - be,
        across: d.right - d.left - 2 * be
      };
    }
    function j(d) {
      const B = F(l.anchor), z = N(B, d);
      return $.value.w <= z.across && $.value.h <= Math.max(z.below, z.above) ? B : S();
    }
    const I = c(() => {
      if (!A.value) return b.value;
      const d = A.value, B = j(d), z = N(B, d), { w: R, h: T } = $.value, se = l.align === "auto" ? d.left + d.right > B.left + B.right : l.align === "right", K = sn(se ? d.right - R : d.left, B.left + be, Math.max(B.left + be, B.right - R - be)), _ = T > z.below && z.above > z.below ? { bottom: `${window.innerHeight - d.top + l.gap}px`, maxHeight: O(l.maxHeight, z.above) } : { top: `${d.bottom + l.gap}px`, maxHeight: O(l.maxHeight, z.below) };
      return { ...b.value, ..._, left: `${K}px`, maxWidth: O(l.maxWidth, z.across) };
    }), W = t, Q = () => [...i.value.querySelectorAll("button:not(:disabled)")];
    function J(d) {
      const B = Q(), z = B.indexOf(document.activeElement);
      B[(z + d + B.length) % B.length].focus();
    }
    const X = { ArrowDown: () => J(1), ArrowUp: () => J(-1), Escape: () => W("close") }, ne = (d) => X[d.key] && (d.preventDefault(), X[d.key]()), U = () => i.value && ($.value = { w: i.value.offsetWidth, h: i.value.scrollHeight });
    let Y = 0;
    const M = new ResizeObserver(() => {
      cancelAnimationFrame(Y), Y = requestAnimationFrame(U);
    });
    un(i, (d) => l.anchor && !l.anchor.contains(d.target) && W("close"));
    const v = (d, B) => ["top", "left", "right", "bottom"].some((z) => Math.abs(d[z] - B[z]) > 1), P = (d) => d.bottom < 0 || d.top > window.innerHeight;
    let k = 0;
    function u() {
      if (l.anchor) {
        const d = l.anchor.getBoundingClientRect();
        if (!l.anchor.isConnected || P(d)) return W("close");
        v(d, A.value) && (A.value = d);
      }
      k = requestAnimationFrame(u);
    }
    return at(() => {
      l.anchor && i.value && rn(i.value, l.anchor), U(), i.value && M.observe(i.value), !l.plain && Q()[0] && Q()[0].focus(), u();
    }), xe(() => {
      M.disconnect(), cancelAnimationFrame(k), cancelAnimationFrame(Y);
    }), o({ element: i }), (d, B) => (a(), E(nt, {
      to: "body",
      disabled: !e.anchor
    }, [
      y("div", ot({
        ref_key: "panel",
        ref: i
      }, d.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: I.value,
        onKeydown: ne
      }), [
        Se(d.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), gn = /* @__PURE__ */ Z(cn, [["__scopeId", "data-v-3d203970"]]);
async function vn(e, o, t) {
  if (!e) return t(o);
  const { target: l, fields: i } = e, n = Object.fromEntries(Object.keys(i).map((A) => [A, l[A]])), b = () => Object.assign(l, n);
  Object.assign(l, i);
  let $ = !1;
  try {
    const A = await t(o);
    return $ = A.ok, A;
  } finally {
    $ || b();
  }
}
function mn(e, o, t, { groups: l, programs: i }) {
  const n = H({}), b = H(""), $ = H(!1), A = c(() => !!e.value && !e.value.ended_at), S = c(() => A.value && !!e.value.paused_at);
  async function D(j, I = null) {
    b.value = "";
    const W = await vn(I, j, o);
    return b.value = W.ok ? "" : W.error, t(), W;
  }
  return { groups: l, programs: i, chosen: n, failure: b, asking: $, running: A, paused: S, choose: (j, I) => D(["agent", "control", String(e.value.number), j, I.value], { target: n, fields: { value: { ...n.value, [j]: I.label } } }), stop: () => ($.value = !1, D(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (j) => D(["agent", "launch", j.name]) };
}
function pn(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const hn = { compact: "Compaction", clear: "Clear" };
function fn(e) {
  return e != null && e.is_open ? `${hn[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
const bn = ["disabled", "title"], kn = ["disabled", "title"], yn = { class: "gauge" }, wn = {
  key: 1,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
}, Mn = ["disabled", "title"], $n = ["disabled"], xn = ["disabled"], Sn = {
  key: 5,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Cn = ["title"], Tn = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, An = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, jn = { class: "gauge" }, Ln = { class: "context-used" }, Rn = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, Bn = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, In = 75, On = {
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
    const t = e, l = o, i = mn(Oe(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => l("changed"), { groups: Oe(t, "controlGroups"), programs: Oe(t, "agentPrograms") }), n = H(null), b = H(""), $ = c(() => i.groups.value.find((M) => M.key === b.value));
    function A(M, v) {
      n.value = M.currentTarget, b.value = v;
    }
    function S() {
      n.value = null, b.value = "", i.asking.value = !1;
    }
    const D = c(() => t.skills.filter((M) => M.state === "loaded"));
    function F(M) {
      A(M, "skills"), l("skills");
    }
    const O = (M) => i.groups.value.some((v) => v.key === M), N = c(() => {
      var M;
      return i.chosen.value.model ?? ((M = I.value) == null ? void 0 : M.model) ?? "";
    }), j = c(() => {
      var M;
      return i.chosen.value.effort ?? ((M = I.value) == null ? void 0 : M.effort) ?? "";
    });
    c(() => !!t.agent && !t.agent.ended_at);
    const I = c(() => {
      var M;
      return ((M = t.usage.agents) == null ? void 0 : M.find((v) => {
        var P;
        return v.id === ((P = t.agent) == null ? void 0 : P.id);
      })) ?? null;
    }), W = c(() => {
      var M;
      return ((M = I.value) == null ? void 0 : M.context_percent) == null ? null : Math.round(I.value.context_percent);
    }), Q = c(() => {
      var M;
      return fn(((M = I.value) == null ? void 0 : M.context_change) ?? null);
    }), J = (M) => `${Math.round(M / 1e3)}k`, X = c(() => {
      var M;
      return !!((M = I.value) != null && M.context_limit_tokens);
    }), ne = c(() => {
      var M, v;
      return ((M = I.value) == null ? void 0 : M.context_limit_tokens) || ((v = I.value) == null ? void 0 : v.context_window_tokens) || 0;
    }), U = c(() => ne.value ? `${J(I.value.context_tokens ?? 0)} of ${J(ne.value)}` : ""), Y = c(() => {
      var M;
      return (M = I.value) != null && M.cost_dollars ? `$${I.value.cost_dollars.toFixed(2)}` : "";
    });
    return (M, v) => {
      var P, k;
      return a(), s("div", {
        class: ce(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (a(), s(q, { key: 0 }, [
          y("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: v[0] || (v[0] = (u) => A(u, "agent"))
          }, [
            m(ee, {
              name: "agents",
              size: 12
            }),
            h(" " + g(((P = e.agentPrograms.find((u) => u.name === e.agent.program)) == null ? void 0 : P.title) || e.agent.program), 1)
          ], 8, bn),
          m(nn, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: v[1] || (v[1] = (u) => l("open", "usage", u))
          }, null, 8, ["windows", "disabled"]),
          W.value !== null ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${W.value}% full: clear or compact it`,
            onClick: v[2] || (v[2] = (u) => O("context") ? A(u, "context") : l("open", "context", u.currentTarget))
          }, [
            m(ee, {
              name: "gauge",
              size: 12
            }),
            v[14] || (v[14] = h()),
            y("span", yn, [
              y("span", {
                style: Be({ width: `${W.value}%` })
              }, null, 4)
            ]),
            h(" " + g(W.value) + "% ", 1)
          ], 8, kn)) : (k = I.value) != null && k.context_unknown ? (a(), s("span", wn, [
            m(ee, {
              name: "gauge",
              size: 12
            }),
            v[15] || (v[15] = h(" Context: unknown", -1))
          ])) : p("", !0),
          N.value ? (a(), s("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${N.value}: change the model`,
            onClick: v[3] || (v[3] = (u) => O("model") ? A(u, "model") : null)
          }, [
            m(ee, {
              name: "model",
              size: 12
            }),
            h(" " + g(N.value), 1)
          ], 8, Mn)) : p("", !0),
          O("effort") || e.card && j.value ? (a(), s("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: v[4] || (v[4] = (u) => A(u, "effort"))
          }, [
            m(ee, {
              name: "bolt",
              size: 12
            }),
            h(" " + g(j.value), 1)
          ], 8, $n)) : p("", !0),
          Y.value ? (a(), s("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: v[5] || (v[5] = (u) => l("open", "cost", u.currentTarget))
          }, g(Y.value), 9, xn)) : p("", !0),
          e.branch ? (a(), s("span", Sn, [
            m(ee, {
              name: "branch",
              size: 12
            }),
            h(" " + g(e.branch), 1)
          ])) : p("", !0),
          e.card ? p("", !0) : (a(), s("button", {
            key: 6,
            type: "button",
            class: ce(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: v[6] || (v[6] = (u) => l("open", "jobs", u.currentTarget))
          }, [
            m(ee, {
              name: "clock",
              size: 12
            }),
            h(" " + g(e.jobs), 1)
          ], 2)),
          e.run ? (a(), s("button", {
            key: 7,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: F
          }, [
            m(ee, {
              name: "book",
              size: 12
            }),
            h(" " + g(D.value.length), 1)
          ])) : p("", !0),
          e.fitness ? (a(), s(q, { key: 8 }, [
            y("button", {
              type: "button",
              class: ce(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < In }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: v[7] || (v[7] = (u) => l("open", "fitness", u.currentTarget))
            }, [
              m(ee, {
                name: "heart",
                size: 12
              }),
              h(" " + g(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            y("button", {
              type: "button",
              class: ce(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: v[8] || (v[8] = (u) => l("open", "load", u.currentTarget))
            }, [
              m(ee, {
                name: "weight",
                size: 12
              }),
              h(" " + g(e.fitness.workload), 1)
            ], 2)
          ], 64)) : p("", !0)
        ], 64)) : e.run && !e.loading ? (a(), s("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: v[9] || (v[9] = (u) => A(u, "start"))
        }, [
          m(ee, {
            name: "agents",
            size: 12
          }),
          v[16] || (v[16] = h(" Start an agent", -1))
        ])) : p("", !0),
        v[22] || (v[22] = y("span", { class: "space" }, null, -1)),
        r(i).failure.value ? (a(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: r(i).failure.value
        }, g(r(i).failure.value), 9, Cn)) : p("", !0),
        Se(M.$slots, "default", {}, void 0, !0),
        n.value ? (a(), E(gn, {
          key: 3,
          anchor: n.value,
          "min-width": 190,
          onClose: S
        }, {
          default: f(() => {
            var u;
            return [
              b.value === "agent" ? (a(), s(q, { key: 0 }, [
                r(i).asking.value ? (a(), s(q, { key: 0 }, [
                  m($e, { "data-agent-stop-ask": "" }, {
                    default: f(() => [...v[17] || (v[17] = [
                      h("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  m(ke, {
                    "data-agent-stop-confirm": "",
                    onClick: v[10] || (v[10] = (d) => (S(), r(i).stop()))
                  }, {
                    default: f(() => [...v[18] || (v[18] = [
                      h("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  m(ke, {
                    onClick: v[11] || (v[11] = (d) => r(i).asking.value = !1)
                  }, {
                    default: f(() => [...v[19] || (v[19] = [
                      h("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (a(), E(ke, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: v[12] || (v[12] = (d) => r(i).asking.value = !0)
                }, {
                  default: f(() => [...v[20] || (v[20] = [
                    h("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : b.value === "start" ? (a(), s(q, { key: 1 }, [
                m($e, null, {
                  default: f(() => [...v[21] || (v[21] = [
                    h("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (a(!0), s(q, null, ae(r(i).programs.value, (d) => (a(), E(ke, {
                  key: d.name,
                  "data-agent-program": d.name,
                  onClick: (B) => (S(), r(i).start(d))
                }, {
                  default: f(() => [
                    h(g(d.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : b.value === "skills" ? (a(), E(_a, {
                key: 2,
                skills: e.skills,
                onBrowse: v[13] || (v[13] = (d) => (S(), l("open", "skills", null)))
              }, null, 8, ["skills"])) : $.value ? (a(), s(q, { key: 3 }, [
                m($e, null, {
                  default: f(() => [
                    h(g($.value.label), 1)
                  ]),
                  _: 1
                }),
                b.value === "context" ? (a(), s(q, { key: 0 }, [
                  y("p", Tn, g(r(pn)(((u = I.value) == null ? void 0 : u.last_compaction) ?? null)), 1),
                  y("div", An, [
                    y("span", jn, [
                      y("span", {
                        style: Be({ width: `${W.value}%` })
                      }, null, 4)
                    ]),
                    y("span", Ln, g(W.value) + "%", 1)
                  ]),
                  U.value ? (a(), s("p", Rn, [
                    h(g(U.value) + " ", 1),
                    X.value ? (a(), E(ln, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : p("", !0)
                  ])) : p("", !0)
                ], 64)) : p("", !0),
                b.value === "context" && Q.value ? (a(), s("p", Bn, g(Q.value), 1)) : (a(!0), s(q, { key: 2 }, ae($.value.choices, (d) => (a(), E(ke, {
                  key: d.value,
                  "data-agent-choice": d.value,
                  onClick: (B) => (r(i).choose($.value.key, d), S())
                }, {
                  default: f(() => [
                    h(g(d.label), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-choice", "onClick"]))), 128))
              ], 64)) : p("", !0)
            ];
          }),
          _: 1
        }, 8, ["anchor"])) : p("", !0)
      ], 2);
    };
  }
}, Vn = /* @__PURE__ */ Z(On, [["__scopeId", "data-v-d7113347"]]), Hn = ["data-agent-open", "aria-expanded", "role", "tabindex"], zn = {
  class: "agent-head",
  "data-agent-head": ""
}, En = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Nn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Wn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Dn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, qn = {
  key: 0,
  class: "agent-line"
}, Fn = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Un = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, Pn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, Gn = {
  class: "agent-live-fact",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, Jn = {
  key: 1,
  class: "agent-live-fact",
  "data-agent-last-heard": ""
}, Kn = {
  key: 2,
  class: "agent-unit",
  "data-agent-unit": ""
}, Zn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), l = { helper: "Helper", reviewer: "Reviewer", main: "Main agent" }, i = { running: "Working", starting: "Starting", stopping: "Stopping", ended: "Idle: its process has stopped", failed: "Could not start", never_started: "Not started" }, n = e, b = o, $ = Ze(), A = c(() => {
      var L, re;
      if ((L = n.facts) != null && L.profile_title) return n.facts.profile_title;
      if ((re = n.facts) != null && re.profile) return n.facts.profile;
      const w = l[n.row.role] || n.row.role;
      return w.slice(0, 1).toUpperCase() + w.slice(1);
    }), S = c(() => {
      var w;
      return ((w = n.facts) == null ? void 0 : w.tasks) ?? [];
    }), D = c(() => S.value.filter((w) => w.state === "open")), F = c(() => S.value.find((w) => {
      var L;
      return w.id === ((L = n.progress) == null ? void 0 : L.task_id) && w.state === "started";
    })), O = c(() => F.value || S.value.find((w) => {
      var L;
      return w.id === ((L = n.facts) == null ? void 0 : L.task_id);
    }) || S.value.find((w) => t.has(w.state)) || D.value[0] || S.value.at(-1)), N = c(() => {
      var w, L, re, oe, me, ge;
      return n.row.role === "helper" ? ((w = n.facts) == null ? void 0 : w.helper_job) || "" : (L = n.facts) != null && L.job_enabled && (((re = F.value) == null ? void 0 : re.title) || ((oe = n.facts) == null ? void 0 : oe.task_title) || ((me = D.value[0]) == null ? void 0 : me.title) || ((ge = S.value.at(-1)) == null ? void 0 : ge.title)) || "";
    }), j = c(() => `${n.row.role} ${n.row.number}`), I = c(() => {
      var w, L;
      return [n.row.program, (w = n.facts) == null ? void 0 : w.model, (L = n.facts) == null ? void 0 : L.effort, j.value].filter(Boolean).join(" · ");
    }), W = c(() => n.row.role === "main" ? A.value : `${A.value} ${n.row.number}`), Q = Ie(), J = c(() => pt(n.row.process_started_at || n.row.created_at, $.value)), X = /* @__PURE__ */ new Set(["open", "started", "testing"]), ne = { fresh: "new conversation", resumed: "resumed" }, U = c(() => {
      var w, L;
      return [(w = n.facts) == null ? void 0 : w.helper_job_program, ne[(L = n.facts) == null ? void 0 : L.occupant_launch]].filter(Boolean).join(", ");
    }), Y = c(() => {
      var w;
      return (w = n.facts) == null ? void 0 : w.work_status;
    }), M = c(() => !!n.row.ended_at && n.row.role !== "main" && S.value.some((w) => X.has(w.state))), v = c(() => {
      var w, L;
      return n.row.state === "running" && ((w = n.facts) == null ? void 0 : w.state) === "at usage limit" && !!((L = n.facts) != null && L.usage_limit_ends_at);
    }), P = (w) => new Date(w).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), k = c(() => n.row.halted_at ? `Stopped at the usage limit since ${P(n.row.halted_at)}, goes on at ${P(n.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(n.facts.usage_limit_ends_at).toLocaleString()}`), u = c(() => {
      var w;
      return n.row.retired_at || n.row.state === "retired" ? "retired" : v.value || Y.value || n.waitReason || M.value ? "waiting" : n.row.state === "running" && ((w = n.facts) == null ? void 0 : w.state) || n.row.state;
    }), d = c(() => {
      var w;
      return v.value ? k.value : Y.value ? `Status: ${Y.value}` : n.waitReason ? `Waiting: ${n.waitReason}` : u.value === "blocked" ? (w = n.facts) != null && w.blocked_reason ? `Blocked: ${n.facts.blocked_reason}` : "Blocked" : M.value ? "Stopped with work left" : "";
    }), B = c(() => {
      var w;
      return ((w = n.progress) == null ? void 0 : w.completed_count) ?? S.value.filter((L) => L.state === "completed").length;
    }), z = c(() => {
      var w;
      return ht(B.value, ((w = n.progress) == null ? void 0 : w.started_at) || n.row.created_at, n.progress ? n.progress.finished_at : n.row.ended_at, $.value);
    }), R = c(() => n.row.role === "main" ? 0 : z.value), T = c(() => !!n.row.retired_at || n.row.state === "retired"), se = c(() => T.value ? "Retired" : u.value === "blocked" || u.value === "waiting" ? d.value || (u.value === "blocked" ? "Blocked" : "Waiting") : i[n.row.standing]), K = c(() => {
      var L;
      if (T.value) return n.row.retired_at;
      const w = u.value === "blocked" || u.value === "waiting";
      return n.row.ended_at || w && ((L = n.facts) == null ? void 0 : L.last_activity) || n.row.process_started_at || n.row.created_at;
    }), ye = c(() => ft(K.value, $.value)), _ = c(() => {
      var w;
      return bt((w = n.facts) == null ? void 0 : w.last_activity, $.value);
    });
    return (w, L) => {
      var re, oe, me, ge, de, we, Te;
      return a(), s("div", {
        class: ce(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: L[1] || (L[1] = (ie) => !e.open && b("toggle")),
        onKeydown: [
          L[2] || (L[2] = qe(le((ie) => !e.open && b("toggle"), ["self", "prevent"]), ["enter"])),
          L[3] || (L[3] = qe(le((ie) => !e.open && b("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        y("div", zn, [
          e.open ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back",
            "aria-label": "Back",
            onClick: L[0] || (L[0] = le((ie) => b("toggle"), ["stop"]))
          }, [
            m(r(ze), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : p("", !0),
          e.open ? (a(), s(q, { key: 1 }, [
            y("span", En, g(W.value), 1),
            y("span", Nn, g(((re = e.facts) == null ? void 0 : re.given_name) || e.row.id), 1)
          ], 64)) : (a(), s(q, { key: 2 }, [
            m(r(kt), {
              "agent-id": e.row.id,
              label: A.value,
              class: "agent-who"
            }, {
              default: f(() => {
                var ie;
                return [
                  y("span", Wn, g(A.value), 1),
                  y("span", Dn, g(((ie = e.facts) == null ? void 0 : ie.given_name) || e.row.id), 1)
                ];
              }),
              _: 1
            }, 8, ["agent-id", "label"]),
            m(r(ze), {
              class: "agent-chevron",
              name: "chevronRight",
              size: 12
            })
          ], 64))
        ]),
        e.open ? p("", !0) : (a(), s("span", qn, [
          y("span", Fn, g(I.value), 1),
          (oe = e.facts) != null && oe.sandbox_off ? (a(), s("span", Un, "sandbox off")) : p("", !0)
        ])),
        e.open && !T.value ? (a(), E(Vn, {
          key: 1,
          class: "agent-live",
          "agent-programs": r(Q).props.programs.rows.value,
          agent: e.row,
          branch: (me = e.progress) == null ? void 0 : me.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((ge = e.facts) == null ? void 0 : ge.windows) ?? [] },
          card: ""
        }, {
          default: f(() => {
            var ie, Ae;
            return [
              (ie = e.facts) != null && ie.sandbox_off ? (a(), s("span", Pn, "sandbox off")) : p("", !0),
              y("span", Gn, "Run time: " + g(J.value), 1),
              (Ae = e.facts) != null && Ae.last_activity ? (a(), s("span", Jn, [
                L[4] || (L[4] = h("Seen: ", -1)),
                m(r(Ne), {
                  at: e.facts.last_activity
                }, null, 8, ["at"])
              ])) : p("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : p("", !0),
        (de = e.facts) != null && de.unit_name ? (a(), s("div", Kn, "Unit: " + g(e.facts.unit_name), 1)) : p("", !0),
        e.open ? p("", !0) : (a(), E(Da, {
          key: 3,
          tasks: S.value,
          "in-hand": e.row.role !== "helper" && ((we = e.facts) != null && we.job_enabled) && O.value || null,
          job: e.row.role === "helper" ? N.value : "",
          "job-title": e.row.role === "helper" && ((Te = e.facts) == null ? void 0 : Te.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? U.value : "",
          "per-hour": R.value
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour"])),
        m(Ta, {
          state: u.value,
          doing: se.value,
          since: ye.value,
          seen: _.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open && !T.value ? (a(), E(Yt, {
          key: 4,
          row: e.row,
          held: u.value === "blocked"
        }, null, 8, ["row", "held"])) : p("", !0),
        e.open ? (a(), E(Ma, {
          key: 5,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: S.value,
          "stopped-with-work": M.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : p("", !0)
      ], 42, Hn);
    };
  }
}, Yn = /* @__PURE__ */ Z(Zn, [["__scopeId", "data-v-7c1386cc"]]), Qn = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Xn = ["data-agent-row", "data-agent-lingering"], Pe = "journal.agents.filters", Ge = 300 * 1e3, Re = "cubic-bezier(0.2, 0.9, 0.25, 1)", _n = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const o = e, t = Ie(), { rows: l } = t.props.waits, { rows: i } = t.props.progress, { rows: n, failure: b, loaded: $, more: A } = t.props.agents, S = (C) => i.value.find((V) => V.agent_id === C.id) ?? null, D = (C) => {
      var V;
      return ((V = l.value.find((x) => x.agent_id === C.id)) == null ? void 0 : V.reason) ?? "";
    }, F = H("running"), O = H(""), N = JSON.parse(localStorage.getItem(Pe) || '{"roles":[],"profiles":[],"programs":[]}'), j = H(N), I = c(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: W } = t.props.programs, Q = c(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), J = (C, V) => {
      j.value = $t(j.value, C, V);
    }, X = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, ne = (C) => C.slice(0, 1).toUpperCase() + C.slice(1);
    ve(j, (C) => localStorage.setItem(Pe, JSON.stringify(C)));
    const U = H(25);
    function Y() {
      Object.assign(t.state, {
        "agents.show": F.value,
        "agents.search": O.value,
        "agents.limit": String(U.value),
        "agents.roles": j.value.roles.join(","),
        "agents.profiles": j.value.profiles.join(","),
        "agents.programs": j.value.programs.join(",")
      });
    }
    async function M() {
      return U.value += 25, Y(), await t.reload("agents"), !0;
    }
    ve([F, O, j], () => {
      U.value = 25, Y(), t.reload("agents");
    }), Y();
    const v = (C) => C.facts ?? null, P = n, k = Ze(), u = H([]), d = c(() => new Set(u.value.filter((C) => k.value - C.left < Ge).map((C) => C.row.id))), B = c(() => u.value.filter((C) => d.value.has(C.row.id)).map((C) => C.row)), z = c(() => [...P.value, ...B.value]);
    let R = "", T = [];
    async function se(C) {
      await t.reload(`card.${C.id}`);
      const V = t.props[`card.${C.id}`].rows.value.find((x) => x.id === C.id);
      V != null && V.ended_at && !u.value.some((x) => x.row.id === C.id) && (u.value = [...u.value, { row: V, left: Date.now() }]);
    }
    ve(n, (C) => {
      const V = R === `${F.value}|${O.value}|${JSON.stringify(j.value)}` && F.value === "running", x = V ? T.filter((G) => !C.some((pe) => pe.id === G.id)) : [];
      R = `${F.value}|${O.value}|${JSON.stringify(j.value)}`, T = C, u.value = V ? u.value.filter((G) => k.value - G.left < Ge && !C.some((pe) => pe.id === G.row.id)) : [], x.forEach(se);
    }, { immediate: !0 });
    const K = c(() => !!O.value.trim() || Q.value > 0), ye = c(() => o.texts[F.value] ?? { title: o.empty, hint: "" }), _ = H(null), w = H(null), L = H(null), re = H(null), oe = c(() => _.value === null ? null : t.props[`card.${_.value}`].rows.value.find((C) => C.id === _.value) ?? w.value), me = c(() => oe.value ? [oe.value] : z.value), ge = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, de = H(!1);
    let we = 0;
    async function Te(C) {
      if (de.value) return;
      de.value = !0, we = re.value.scrollTop;
      const V = L.value.querySelector(`[data-agent-open="${C.id}"]`);
      if (!ge()) {
        const he = [...L.value.querySelectorAll(".agent-row")].filter((ue) => !ue.contains(V));
        await Promise.all(he.map((ue) => ue.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const x = [...V.querySelectorAll(".agent-head, .agent-line")], G = [...x, ...V.querySelectorAll("[data-agent-motion]")], pe = G.map((he) => he.getBoundingClientRect());
      if (w.value = C, _.value = C.id, t.reload(`card.${C.id}`), await Fe(), !ge()) {
        const he = G.map((ue) => ue.getBoundingClientRect());
        G.forEach((ue, je) => {
          const fe = x.findIndex((De) => De !== ue && De.contains(ue)), Qe = pe[je].left - he[je].left - (fe < 0 ? 0 : pe[fe].left - he[fe].left), Xe = pe[je].top - he[je].top - (fe < 0 ? 0 : pe[fe].top - he[fe].top);
          ue.animate([{ transform: `translate(${Qe}px, ${Xe}px)` }, { transform: "none" }], { duration: 280, easing: Re });
        }), L.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((ue) => {
          ue.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Re, fill: "backwards" });
        });
      }
      de.value = !1;
    }
    async function ie() {
      if (de.value || !oe.value) return;
      de.value = !0;
      const C = L.value.querySelector(`[data-agent-open="${_.value}"]`), V = [...C.children], x = ge() ? [] : V.map((G) => G.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(x.map((G) => G.finished)), _.value = null, await Fe(), re.value.scrollTop = we, x.forEach((G) => G.cancel()), ge() || (C.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Re }), L.value.querySelectorAll(".agent-row").forEach((G) => {
        G.contains(C) || G.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Re });
      })), de.value = !1;
    }
    const Ae = (C) => _.value === C.id ? ie() : Te(C);
    ve(O, (C) => C.trim() && (_.value = null)), ve(F, () => {
      _.value = null;
    });
    const We = (C) => {
      C.key === "Escape" && ie();
    };
    return window.addEventListener("keydown", We), xe(() => window.removeEventListener("keydown", We)), (C, V) => (a(), s("div", {
      ref_key: "agents",
      ref: L,
      class: ce(["agents", { focused: oe.value, "card-changing": de.value }])
    }, [
      oe.value ? p("", !0) : (a(), E(r(yt), {
        key: 0,
        modelValue: O.value,
        "onUpdate:modelValue": V[1] || (V[1] = (x) => O.value = x),
        placeholder: "Search agents",
        "menu-count": Q.value,
        "data-agents-search": ""
      }, {
        menu: f(() => [
          m(r(Ve), null, {
            default: f(() => [...V[2] || (V[2] = [
              h("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(q, null, ae(I.value.roles, (x) => (a(), E(r(Le), {
            key: x,
            role: "menuitemcheckbox",
            "aria-checked": j.value.roles.includes(x),
            checked: j.value.roles.includes(x),
            "data-filter-role": x,
            onClick: (G) => J("roles", x)
          }, {
            default: f(() => [
              h(g(ne(x)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          I.value.profiles.length ? (a(), E(r(Ve), { key: 0 }, {
            default: f(() => [...V[3] || (V[3] = [
              h("Profile", -1)
            ])]),
            _: 1
          })) : p("", !0),
          (a(!0), s(q, null, ae(I.value.profiles, (x) => (a(), E(r(Le), {
            key: x.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.profiles.includes(x.name),
            checked: j.value.profiles.includes(x.name),
            "data-filter-profile": x.name,
            onClick: (G) => J("profiles", x.name)
          }, {
            default: f(() => [
              h(g(x.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          m(r(Ve), null, {
            default: f(() => [...V[4] || (V[4] = [
              h("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(q, null, ae(r(W), (x) => (a(), E(r(Le), {
            key: x.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.programs.includes(x.name),
            checked: j.value.programs.includes(x.name),
            "data-filter-program": x.name,
            onClick: (G) => J("programs", x.name)
          }, {
            default: f(() => [
              h(g(x.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          Q.value ? (a(), E(r(Le), {
            key: 1,
            "data-filter-clear": "",
            onClick: X
          }, {
            default: f(() => [...V[5] || (V[5] = [
              h("Clear filters", -1)
            ])]),
            _: 1
          })) : p("", !0)
        ]),
        default: f(() => [
          m(r(wt), {
            options: I.value.states,
            value: F.value,
            onPick: V[0] || (V[0] = (x) => F.value = x)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      F.value === "retired" && I.value.upgrade_retired ? (a(), s("p", Qn, "Retired during the upgrade: " + g(I.value.upgrade_retired), 1)) : p("", !0),
      y("div", {
        ref_key: "list",
        ref: re,
        class: ce(["agents-view", { "agents-view-open": oe.value }])
      }, [
        r($) && !r(b) && !me.value.length && Q.value ? (a(), E(r(Ee), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: f(() => [
            m(r(te), {
              small: "",
              "data-empty-clear": "",
              onClick: X
            }, {
              default: f(() => [...V[6] || (V[6] = [
                h("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), E(r(Mt), {
          key: 1,
          moves: "",
          "leaves-at-once": de.value,
          rows: me.value,
          failure: r(b),
          loaded: r($),
          more: !oe.value && r(A),
          older: M,
          empty: ye.value.title,
          hint: ye.value.hint,
          searching: K.value
        }, {
          default: f(({ row: x }) => [
            y("div", {
              class: ce(["agent-row", { lingering: d.value.has(x.id) && x.id !== _.value }]),
              "data-agent-row": x.id,
              "data-agent-lingering": d.value.has(x.id) ? "" : null
            }, [
              m(Yn, {
                row: x,
                facts: v(x),
                progress: S(x),
                "wait-reason": D(x),
                open: x.id === _.value,
                onToggle: (G) => Ae(x)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, Xn)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, no = /* @__PURE__ */ Z(_n, [["__scopeId", "data-v-fceb20c3"]]);
export {
  no as A
};
