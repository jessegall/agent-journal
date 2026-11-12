import { openBlock as a, createElementBlock as s, withModifiers as ie, createElementVNode as w, createVNode as p, unref as r, withCtx as b, createTextVNode as f, Fragment as q, renderList as le, toDisplayString as c, createBlock as N, createCommentVNode as h, ref as z, computed as u, watch as ge, onUnmounted as Se, defineAsyncComponent as Xe, createSlots as et, resolveDynamicComponent as tt, normalizeClass as ue, normalizeStyle as Ie, renderSlot as Ce, onMounted as at, Teleport as nt, mergeProps as ot, toRef as Ve, withKeys as qe, nextTick as Fe } from "vue";
import { TextInput as ze, Btn as oe, TextArea as lt, TimeAgo as We, useWindow as Oe, SwitchCase as Je, peekRef as Te, Icon as Ee, RunningCommand as st, FoldGroup as Ke, TaskStatusIcon as it, loadWindowComponent as rt, coalesced as dt, READ_RATES as ut, eventMayBeChildOf as ct, InnerTabs as gt, TabBody as vt, EmptyState as Ne, HoverTip as $e, TaskBar as mt, useNow as Ze, age as pt, perHour as ht, sinceWords as ft, seenWords as bt, AgentTip as kt, SearchBar as yt, Segmented as wt, MenuLabel as He, MenuItem as Re, RowList as Mt, toggleFilter as $t } from "@journal/window-kit";
import { _ as Z, T as xt } from "./TranscriptRows-Crmxs6Un.js";
const St = { class: "action-buttons" }, Ct = {
  __name: "AgentDriverForm",
  props: { program: String, model: String, pending: Boolean },
  emits: ["submit", "cancel", "update:program", "update:model"],
  setup(e) {
    return (o, t) => (a(), s("form", {
      "data-agent-driver-form": "",
      onSubmit: t[3] || (t[3] = ie((l) => o.$emit("submit"), ["prevent"]))
    }, [
      t[6] || (t[6] = w("p", null, "Starts the next session on this program; the agent keeps its number and memories.", -1)),
      p(r(ze), {
        "model-value": e.program,
        label: "Program",
        disabled: e.pending,
        "data-agent-driver-program": "",
        "onUpdate:modelValue": t[0] || (t[0] = (l) => o.$emit("update:program", l))
      }, null, 8, ["model-value", "disabled"]),
      p(r(ze), {
        "model-value": e.model,
        label: "Model",
        disabled: e.pending,
        "data-agent-driver-model": "",
        "onUpdate:modelValue": t[1] || (t[1] = (l) => o.$emit("update:model", l))
      }, null, 8, ["model-value", "disabled"]),
      w("div", St, [
        p(r(oe), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.program.trim() || !e.model.trim(),
          "data-agent-confirm-driver": ""
        }, {
          default: b(() => [...t[4] || (t[4] = [
            f("Change the driver", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(r(oe), {
          small: "",
          disabled: e.pending,
          onClick: t[2] || (t[2] = (l) => o.$emit("cancel"))
        }, {
          default: b(() => [...t[5] || (t[5] = [
            f("Cancel", -1)
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
      onSubmit: t[4] || (t[4] = ie((l) => o.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (a(), s(q, { key: 0 }, [
        w("label", At, [
          t[6] || (t[6] = f("Task ", -1)),
          w("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: t[0] || (t[0] = (l) => o.$emit("update:task", l.target.value))
          }, [
            t[5] || (t[5] = w("option", { value: "" }, "Choose an open task", -1)),
            (a(!0), s(q, null, le(e.tasks, (l) => (a(), s("option", {
              key: l.id,
              value: String(l.id)
            }, c(l.id) + ": " + c(l.title), 9, Lt))), 128))
          ], 40, jt)
        ]),
        e.moreTasks ? (a(), N(r(oe), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: t[1] || (t[1] = (l) => o.$emit("more"))
        }, {
          default: b(() => [...t[7] || (t[7] = [
            f("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : h("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (a(), s("p", Rt, "No open tasks.")) : h("", !0)
      ], 64)) : (a(), s("label", Bt, [
        t[8] || (t[8] = f("Job", -1)),
        p(r(lt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (l) => o.$emit("update:text", l.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      w("div", It, [
        p(r(oe), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: b(() => [...t[9] || (t[9] = [
            f("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(r(oe), {
          small: "",
          disabled: e.pending,
          onClick: t[3] || (t[3] = (l) => o.$emit("cancel"))
        }, {
          default: b(() => [...t[10] || (t[10] = [
            f("Cancel", -1)
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
      onSubmit: t[2] || (t[2] = ie((l) => o.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = w("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      p(r(ze), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (l) => o.$emit("update:reason", l))
      }, null, 8, ["model-value", "disabled"]),
      w("div", Ht, [
        p(r(oe), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: b(() => [...t[3] || (t[3] = [
            f("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(r(oe), {
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (l) => o.$emit("cancel"))
        }, {
          default: b(() => [...t[4] || (t[4] = [
            f("Cancel", -1)
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
      e.sessions.length ? h("", !0) : (a(), s("p", Wt, "This agent has no session in its history.")),
      w("ol", null, [
        (a(!0), s(q, null, le(e.sessions, (l) => (a(), s("li", {
          key: l.session,
          "data-agent-session": ""
        }, [
          w("span", null, c([l.program, l.model].filter(Boolean).join(" ")), 1),
          l.started_at ? (a(), s("span", Dt, [
            t[1] || (t[1] = f("Started ", -1)),
            p(r(We), {
              at: l.started_at
            }, null, 8, ["at"])
          ])) : h("", !0),
          w("span", qt, c(l.end_reason ? `Ended: ${l.end_reason.replaceAll("_", " ")}` : l.started_at ? "Running" : "Not started"), 1),
          w("code", null, c(l.session), 1)
        ]))), 128))
      ]),
      w("div", Ft, [
        p(r(oe), {
          small: "",
          onClick: t[0] || (t[0] = (l) => o.$emit("close"))
        }, {
          default: b(() => [...t[2] || (t[2] = [
            f("Close", -1)
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
    const o = e, t = Oe(), l = z(""), d = z(""), g = z(""), n = z(""), $ = z(""), C = z(""), j = z([]), I = z(0), F = z(!1), O = z(!1), W = z(!1), T = z(""), V = z(""), D = z([]), Y = u(() => !!o.row.retired_at || o.row.state === "retired"), J = u(() => !Y.value && !!o.row.ended_at), X = u(() => {
      var L;
      return J.value && ((L = o.row.job_command) == null ? void 0 : L.length) && !o.row.resume_reason;
    }), se = u(() => X.value && !O.value && (o.row.job_task_flag ? j.value.some((L) => String(L.id) === C.value) : !!d.value.trim()));
    function U(L) {
      l.value = L, d.value = "", g.value = "", C.value = "", T.value = "", V.value = "";
    }
    async function _() {
      U("job"), o.row.job_task_flag && (j.value = [], I.value = 0, F.value = !1, await M());
    }
    async function M() {
      if (!O.value) {
        O.value = !0;
        try {
          t.state["jobs.page"] = String(I.value + 1), await t.reload("jobs");
          const L = t.props.jobs;
          T.value = L.failure.value, T.value || (j.value = [...j.value, ...L.rows.value], I.value = L.data.value.page, F.value = L.more.value);
        } finally {
          O.value = !1;
        }
      }
    }
    async function v() {
      await P(["process", "lift-hold", String(o.row.number)], "Hold lifted.");
    }
    async function P(L, A) {
      if (!W.value) {
        W.value = !0, T.value = "";
        try {
          const ee = await t.run(L);
          T.value = ee.ok ? "" : ee.error, ee.ok && (U(""), V.value = A);
        } finally {
          W.value = !1;
        }
      }
    }
    async function k() {
      if (!se.value) return;
      const L = o.row.job_task_flag ? [o.row.job_task_flag, C.value] : [d.value.trim()];
      await P([...o.row.job_command, String(o.row.number), ...L], "Job sent.");
    }
    async function m() {
      if (!W.value) {
        W.value = !0;
        try {
          const L = await t.run(["agent", "sessions", String(o.row.number)]);
          U(L.ok ? "history" : ""), T.value = L.ok ? "" : L.error, D.value = L.ok ? L.value.rows : [];
        } finally {
          W.value = !1;
        }
      }
    }
    function i() {
      U("driver"), n.value = o.row.program || "", $.value = "";
    }
    async function B() {
      !J.value || l.value !== "driver" || !n.value.trim() || !$.value.trim() || await P(["agent", "driver", String(o.row.number), "--program", n.value.trim(), "--model", $.value.trim()], "Driver changed.");
    }
    async function E() {
      !J.value || l.value !== "retire" || !g.value.trim() || await P(["agent", "retire", String(o.row.number), "--reason", g.value.trim()], "Agent retired permanently.");
    }
    return (L, A) => {
      var ee;
      return a(), s("div", {
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: A[10] || (A[10] = ie(() => {
        }, ["stop"])),
        onKeydown: A[11] || (A[11] = ie(() => {
        }, ["stop"]))
      }, [
        w("div", Gt, [
          p(r(oe), {
            small: "",
            "data-agent-history": "",
            disabled: W.value || O.value,
            onClick: m
          }, {
            default: b(() => [...A[12] || (A[12] = [
              f("Session history", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          e.held ? (a(), N(r(oe), {
            key: 0,
            small: "",
            "data-agent-lift-hold": "",
            disabled: W.value,
            onClick: v
          }, {
            default: b(() => [...A[13] || (A[13] = [
              f("Lift this hold", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])) : h("", !0),
          J.value ? (a(), s(q, { key: 1 }, [
            (ee = e.row.job_command) != null && ee.length ? (a(), N(r(oe), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: W.value || O.value || !X.value,
              onClick: _
            }, {
              default: b(() => [...A[14] || (A[14] = [
                f("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0),
            e.row.role !== "main" ? (a(), N(r(oe), {
              key: 1,
              small: "",
              "data-agent-driver": "",
              disabled: W.value || O.value,
              onClick: i
            }, {
              default: b(() => [...A[15] || (A[15] = [
                f("Change driver", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0),
            e.row.role !== "main" ? (a(), N(r(oe), {
              key: 2,
              small: "",
              "data-agent-retire": "",
              disabled: W.value || O.value,
              onClick: A[0] || (A[0] = (K) => U("retire"))
            }, {
              default: b(() => [...A[16] || (A[16] = [
                f("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0)
          ], 64)) : h("", !0)
        ]),
        p(r(Je), { value: l.value }, {
          job: b(() => [
            p(Vt, {
              task: C.value,
              "onUpdate:task": A[1] || (A[1] = (K) => C.value = K),
              text: d.value,
              "onUpdate:text": A[2] || (A[2] = (K) => d.value = K),
              row: e.row,
              tasks: j.value,
              pending: W.value,
              loading: O.value,
              "more-tasks": F.value,
              failure: T.value,
              "job-ready": se.value,
              onSubmit: k,
              onMore: M,
              onCancel: A[3] || (A[3] = (K) => U(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          driver: b(() => [
            p(Tt, {
              program: n.value,
              "onUpdate:program": A[4] || (A[4] = (K) => n.value = K),
              model: $.value,
              "onUpdate:model": A[5] || (A[5] = (K) => $.value = K),
              pending: W.value,
              onSubmit: B,
              onCancel: A[6] || (A[6] = (K) => U(""))
            }, null, 8, ["program", "model", "pending"])
          ]),
          history: b(() => [
            p(Pt, {
              sessions: D.value,
              onClose: A[7] || (A[7] = (K) => U(""))
            }, null, 8, ["sessions"])
          ]),
          retire: b(() => [
            p(Et, {
              reason: g.value,
              "onUpdate:reason": A[8] || (A[8] = (K) => g.value = K),
              pending: W.value,
              onSubmit: E,
              onCancel: A[9] || (A[9] = (K) => U(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        T.value ? (a(), s("p", Jt, c(T.value), 1)) : h("", !0),
        V.value ? (a(), s("p", Kt, c(V.value), 1)) : h("", !0)
      ], 32);
    };
  }
}, Yt = /* @__PURE__ */ Z(Zt, [["__scopeId", "data-v-4e3619f8"]]), _t = {
  class: "agent-command",
  "data-agent-command": ""
}, Qt = {
  key: 1,
  "data-agent-stopped": ""
}, Xt = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(e) {
    return (o, t) => (a(), s("span", _t, [
      e.waitReason ? (a(), s("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: t[0] || (t[0] = ie((l) => r(Te)("test_queue:0"), ["stop"]))
      }, [
        f("Waiting: " + c(e.waitReason) + " ", 1),
        p(r(Ee), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), s("span", Qt, "Waiting")) : (a(), N(r(st), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, ea = /* @__PURE__ */ Z(Xt, [["__scopeId", "data-v-1b371fb5"]]), ta = {
  key: 0,
  class: "lasting-facts",
  "data-agent-lasting-facts": ""
}, aa = { "data-agent-retired-at": "" }, na = { key: 0 }, oa = { "data-agent-retired-by": "" }, la = {
  __name: "AgentLastingFacts",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    return (o, t) => e.row.retired_at ? (a(), s("dl", ta, [
      w("div", null, [
        t[0] || (t[0] = w("dt", null, "Retired", -1)),
        w("dd", aa, [
          p(r(We), {
            at: e.row.retired_at
          }, null, 8, ["at"])
        ])
      ]),
      e.row.retiring_actor_name ? (a(), s("div", na, [
        t[1] || (t[1] = w("dt", null, "Retired by", -1)),
        w("dd", oa, c(e.row.retiring_actor_name), 1)
      ])) : h("", !0)
    ])) : h("", !0);
  }
}, sa = /* @__PURE__ */ Z(la, [["__scopeId", "data-v-abc8e12a"]]), ia = ["data-agent-delegated", "onClick"], ra = { class: "agent-task-number" }, da = { class: "agent-task-title" }, ua = ["title"], ca = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = o;
    return (l, d) => (a(), N(r(Ke), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: d[0] || (d[0] = (g) => t("toggle"))
    }, {
      default: b(() => [
        (a(!0), s(q, null, le(e.section.tasks, (g) => (a(), s("button", {
          key: g.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": g.id,
          onClick: (n) => r(Te)(`tasks:${g.id}`)
        }, [
          p(r(it), {
            status: g.state
          }, null, 8, ["status"]),
          w("span", ra, c(g.id), 1),
          w("span", da, c(g.title), 1),
          g.plan_id ? (a(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${g.plan_id}: ${g.plan_title}`
          }, "Plan " + c(g.plan_id), 9, ua)) : h("", !0)
        ], 8, ia))), 128))
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
    const o = e, t = ["started", "blocked", "open", "completed"], l = u(() => {
      var k, m;
      return o.row.ended_at && ((m = (k = o.facts) == null ? void 0 : k.job_returned) != null && m.startsWith(ya)) ? o.facts.job_returned : "";
    }), d = u(() => o.tasks.length ? t.map((k) => ({ state: k, label: k.slice(0, 1).toUpperCase() + k.slice(1), tasks: o.tasks.filter((m) => m.state === k || k === "started" && m.state === "testing" || k === "completed" && m.state === "cancelled") })) : []), g = /* @__PURE__ */ new Set(["completed"]), n = z({}), $ = (k) => !(n.value[k] ?? g.has(k)), C = (k) => n.value = { ...n.value, [k]: $(k) }, j = Oe(), { rows: I } = j.props.reports;
    j.state["reports.agent"] = String(o.row.number);
    const F = u(() => o.row.access === "read-only"), O = ["tasks", "transcript", "terminal", "file-feed", "processes", "reports", "memories"], W = u(() => [...j.tabs].sort((k, m) => (O.indexOf(k.key) < 0 ? O.length : O.indexOf(k.key)) - (O.indexOf(m.key) < 0 ? O.length : O.indexOf(m.key)))), T = u(() => !!o.row.retired_at || o.row.state === "retired"), V = () => F.value || T.value ? W.value.find((k) => k.key === "transcript") : W.value[0], D = z(V());
    ge(D, (k) => {
      j.state.tab = (k == null ? void 0 : k.key) ?? "";
    }, { immediate: !0 }), Se(() => {
      j.state.tab = "";
    }), ge(W, (k) => {
      k.some((m) => {
        var i;
        return m.key === ((i = D.value) == null ? void 0 : i.key);
      }) || (D.value = k[0]);
    }), ge(() => o.open, (k) => {
      k && (D.value = V());
    });
    const Y = Object.fromEntries(j.tabs.filter((k) => k.component).map((k) => [k.key, Xe(() => rt(k.component))])), J = z(!1), { data: X } = j.props.tool, se = u(() => {
      var k;
      return ((k = X.value) == null ? void 0 : k.tool) ?? "";
    }), U = u(() => {
      var k;
      return ((k = X.value) == null ? void 0 : k.note) ?? "";
    }), _ = u(() => o.row.role !== "main" && (!o.row.ended_at || o.stoppedWithWork || o.waitReason));
    async function M() {
      !o.open || !_.value || (j.state["tool.agent"] = String(o.row.number), await j.reload("tool"));
    }
    const v = dt(M, ut.agentCommand), P = j.follow(["hook_call.*", "process_part.*"], (k) => ct(k, "session_agent_id", /* @__PURE__ */ new Set([o.row.id])) && v());
    return Se(() => P == null ? void 0 : P()), ge(() => o.open, (k) => {
      k && M();
    }, { immediate: !0 }), (k, m) => {
      var i;
      return a(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: m[2] || (m[2] = ie(() => {
        }, ["stop"]))
      }, [
        p(sa, { row: e.row }, null, 8, ["row"]),
        e.row.retirement_reason ? (a(), s("p", va, "Retirement reason: " + c(e.row.retirement_reason), 1)) : h("", !0),
        l.value ? (a(), s("p", ma, c(l.value), 1)) : h("", !0),
        p(r(gt), {
          class: "agent-tabs",
          tabs: W.value,
          active: D.value,
          answer: { tasks: e.tasks.length, reports: e.row.report_count ?? r(I).length, memories: e.row.memory_count ?? 0 },
          onChoose: m[0] || (m[0] = (B) => D.value = B)
        }, null, 8, ["tabs", "active", "answer"]),
        p(r(vt), {
          class: "agent-tab-body",
          tab: D.value,
          "data-agent-tab-body": (i = D.value) == null ? void 0 : i.key
        }, {
          default: b(() => {
            var B;
            return [
              p(r(Je), {
                value: (B = D.value) == null ? void 0 : B.key
              }, et({
                reports: b(() => [
                  r(I).length ? h("", !0) : (a(), N(r(Ne), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: b(() => [...m[3] || (m[3] = [
                      f("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (a(!0), s(q, null, le(r(I), (E) => (a(), s("button", {
                    key: E.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${E.id}`,
                    onClick: (L) => r(Te)(`messages:${E.id}`)
                  }, c(E.text), 9, pa))), 128))
                ]),
                tasks: b(() => {
                  var E;
                  return [
                    e.tasks.length ? h("", !0) : (a(), N(r(Ne), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: b(() => [...m[4] || (m[4] = [
                        f("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (a(!0), s(q, null, le(d.value, (L) => (a(), N(ga, {
                      key: L.state,
                      section: L,
                      open: $(L.state),
                      onToggle: (A) => C(L.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (E = e.facts) != null && E.instruction ? (a(), s(q, { key: 1 }, [
                      m[5] || (m[5] = w("p", { class: "agent-label" }, "Instruction", -1)),
                      w("div", ha, c(e.facts.instruction), 1)
                    ], 64)) : h("", !0)
                  ];
                }),
                transcript: b(() => {
                  var E;
                  return [
                    F.value ? (a(), s(q, { key: 0 }, [
                      (E = e.facts) != null && E.instruction ? (a(), s("div", fa, [
                        p(r(Ke), {
                          label: "Instruction",
                          open: J.value,
                          "data-agent-section": "instruction",
                          onToggle: m[1] || (m[1] = (L) => J.value = !J.value)
                        }, {
                          default: b(() => [
                            w("div", ba, c(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (a(), s("p", ka, "No job recorded")) : h("", !0)
                    ], 64)) : h("", !0),
                    p(xt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                le(r(Y), (E, L) => ({
                  name: L,
                  fn: b(() => [
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
        _.value ? (a(), N(ea, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: se.value,
          note: U.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : h("", !0)
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
    const o = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, l = u(() => o.has(t.state)), d = u(() => [t.doing, t.since, t.seen].filter(Boolean).join(". "));
    return (g, n) => (a(), N(r($e), {
      as: "button",
      place: "corner",
      class: ue(["agent-dot", { pulse: l.value }]),
      "data-state": e.state,
      "aria-label": d.value,
      "data-agent-status": "",
      onClick: n[0] || (n[0] = ie(() => {
      }, ["stop"]))
    }, {
      tip: b(() => [
        w("b", $a, c(e.doing), 1),
        e.since ? (a(), s("span", xa, c(e.since), 1)) : h("", !0),
        e.seen ? (a(), s("span", Sa, c(e.seen), 1)) : h("", !0)
      ]),
      default: b(() => [
        n[1] || (n[1] = w("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, Ta = /* @__PURE__ */ Z(Ca, [["__scopeId", "data-v-1a0bc478"]]), Aa = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, ja = (e) => e.filter((o) => o.state !== "cancelled"), Ue = (e, o) => e.filter((t) => t.state === o).length, La = 5, Ra = (e, o) => e || o.split(/\s+/).slice(0, La).join(" ");
function Ba({ tasks: e, inHand: o, perHour: t }) {
  const l = ja(e), d = Ue(l, "completed"), g = Aa[o == null ? void 0 : o.state], n = l.filter((I) => I.state === "started").map((I) => ({ number: I.id, title: I.title })), $ = Math.max(n.length, o && o.state !== "completed" ? 1 : 0), C = l.length - d - $, j = d === l.length;
  return {
    number: o.id,
    title: o.title,
    started: n,
    plan: o.plan_id ?? 0,
    count: `${d} of ${l.length}`,
    taskTip: `${d} of its ${l.length} tasks done${g ? `. This one is ${g.words}.` : "."}`,
    countTip: j ? `All ${l.length} tasks done` : `${d} done, ${$} in hand, ${C} to go`,
    paceTip: !j && t ? `About ${t} an hour.` : "",
    rate: !j && t ? `${Math.round(t)}/hour` : "",
    bar: { total: l.length, done: d, testing: Ue(l, "testing") }
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
    const o = e, t = u(() => o.inHand ? Ba({ tasks: o.tasks, inHand: o.inHand, perHour: o.perHour }) : null);
    return (l, d) => e.job && !t.value ? (a(), s("span", Ia, [
      p(r($e), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: b(() => [
          w("b", null, c(e.job), 1)
        ]),
        default: b(() => [
          f(c(r(Ra)(e.jobTitle, e.job)), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (a(), s("span", Oa, c(e.jobLaunch), 1)) : h("", !0)
    ])) : t.value ? (a(), s(q, { key: 1 }, [
      w("span", Va, [
        t.value.started.length > 1 ? (a(), s("span", Ha, [
          d[1] || (d[1] = f("Tasks ", -1)),
          (a(!0), s(q, null, le(t.value.started, (g, n) => (a(), s(q, {
            key: g.number
          }, [
            n ? (a(), s(q, { key: 0 }, [
              f(", ")
            ], 64)) : h("", !0),
            p(r($e), {
              as: "button",
              class: "task",
              "data-agent-task": "",
              "data-peek": `tasks:${g.number}`,
              "aria-label": `Task ${g.number}: ${g.title}`,
              onClick: ie(($) => r(Te)(`tasks:${g.number}`), ["stop"])
            }, {
              tip: b(() => [
                w("b", null, c(g.title), 1)
              ]),
              default: b(() => [
                f(c(g.number), 1)
              ]),
              _: 2
            }, 1032, ["data-peek", "aria-label", "onClick"])
          ], 64))), 128))
        ])) : (a(), N(r($e), {
          key: 1,
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${t.value.number}`,
          "aria-label": `Task ${t.value.number}: ${t.value.title}`,
          onClick: d[0] || (d[0] = ie((g) => r(Te)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: b(() => [
            w("b", null, c(t.value.title), 1),
            w("span", null, c(t.value.taskTip), 1)
          ]),
          default: b(() => [
            f("Task " + c(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])),
        t.value.plan ? (a(), s("span", za, "Plan " + c(t.value.plan), 1)) : h("", !0),
        t.value.rate ? (a(), s("span", Ea, c(t.value.rate), 1)) : h("", !0),
        p(r($e), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: b(() => [
            w("b", null, c(t.value.countTip), 1),
            t.value.paceTip ? (a(), s("span", Na, c(t.value.paceTip), 1)) : h("", !0)
          ]),
          default: b(() => [
            f(c(t.value.count), 1)
          ]),
          _: 1
        })
      ]),
      p(r(mt), {
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: t.value.bar.total,
        done: t.value.bar.done,
        testing: t.value.bar.testing
      }, null, 8, ["total", "done", "testing"])
    ], 64)) : h("", !0);
  }
}, Da = /* @__PURE__ */ Z(Wa, [["__scopeId", "data-v-e51f5781"]]), qa = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Fa = ["data-icon", "stroke-width", "innerHTML"], ne = {
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
    }, d = {
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
    return (g, n) => (a(), s("svg", {
      class: "ico",
      "data-icon": e.name,
      style: Ie({
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
      innerHTML: d[l[e.name] || e.name] || d.dot
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
      class: ue(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), s("span", Ua, c(e.checked ? "✓" : ""), 1)) : h("", !0),
      e.description ? (a(), s("span", Pa, [
        w("span", null, [
          Ce(o.$slots, "default", {}, void 0, !0)
        ]),
        w("small", null, c(e.description), 1)
      ])) : Ce(o.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, be = /* @__PURE__ */ Z(Ga, [["__scopeId", "data-v-fec99974"]]), Ja = {}, Ka = { class: "menu-label" };
function Za(e, o) {
  return a(), s("span", Ka, [
    Ce(e.$slots, "default", {}, void 0, !0)
  ]);
}
const xe = /* @__PURE__ */ Z(Ja, [["render", Za], ["__scopeId", "data-v-aa955b3e"]]), Ya = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, _a = {
  key: 0,
  class: "skills-none"
}, Qa = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: o }) {
    const t = e, l = o, d = u(() => t.skills.filter((n) => n.state === "loaded")), g = u(() => t.skills.filter((n) => n.state !== "loaded"));
    return (n, $) => (a(), s("div", Ya, [
      p(xe, null, {
        default: b(() => [...$[1] || ($[1] = [
          f("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      d.value.length ? h("", !0) : (a(), s("p", _a, "None yet. Compacting the conversation empties this list.")),
      (a(!0), s(q, null, le(d.value, (C) => (a(), s("p", {
        key: C.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        p(ne, {
          name: "book",
          size: 12
        }),
        f(c(C.skill), 1)
      ]))), 128)),
      g.value.length ? (a(), s(q, { key: 1 }, [
        p(xe, null, {
          default: b(() => [...$[2] || ($[2] = [
            f("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), s(q, null, le(g.value, (C) => (a(), s("p", {
          key: C.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          p(ne, {
            name: "book",
            size: 12
          }),
          f(c(C.skill), 1)
        ]))), 128))
      ], 64)) : h("", !0),
      p(be, {
        "data-agent-skills-browse": "",
        onClick: $[0] || ($[0] = (C) => l("browse"))
      }, {
        default: b(() => [...$[3] || ($[3] = [
          f("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Xa = /* @__PURE__ */ Z(Qa, [["__scopeId", "data-v-be514d47"]]), en = ["disabled", "title"], tn = { class: "gauge usage" }, an = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: o }) {
    const t = e, l = o, d = u(() => t.windows[0] ?? null), g = u(() => d.value && Number.isFinite(d.value.used_percent) ? Math.max(0, Math.min(100, Math.round(d.value.used_percent))) : null), n = u(() => g.value !== null && g.value >= 100), $ = u(() => {
      var j;
      return (j = d.value) != null && j.reset_epoch_seconds ? new Date(d.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), C = u(() => n.value ? `At usage limit: the plan's ${d.value.title} allowance is used up${$.value ? `, starts again ${$.value}` : ""}` : `${g.value}% of the plan's ${d.value.title} allowance used${$.value ? `, starts again ${$.value}` : ""}`);
    return (j, I) => g.value !== null ? (a(), s("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: C.value,
      onClick: I[0] || (I[0] = (F) => l("open", F.currentTarget))
    }, [
      p(ne, {
        name: "allowance",
        size: 12
      }),
      I[1] || (I[1] = f()),
      w("span", tn, [
        w("span", {
          style: Ie({ width: `${g.value}%` })
        }, null, 4)
      ]),
      f(" " + c(n.value ? "At usage limit" : `${g.value}%`), 1)
    ], 8, en)) : h("", !0);
  }
}, nn = /* @__PURE__ */ Z(an, [["__scopeId", "data-v-a36f09dc"]]), on = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (o, t) => (a(), s("span", {
      class: ue(["badge", e.tone])
    }, c(e.text), 3));
  }
}, ln = /* @__PURE__ */ Z(on, [["__scopeId", "data-v-9e7e1157"]]), sn = (e, o, t) => Math.max(o, Math.min(t, e)), Ye = /* @__PURE__ */ new WeakMap(), rn = (e, o) => Ye.set(e, o);
function dn(e, o) {
  for (let t = o; t; t = Ye.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function un(e, o) {
  const t = (l) => {
    var g, n;
    const d = ((g = e.value) == null ? void 0 : g.element) || ((n = e.value) == null ? void 0 : n.$el) || e.value;
    d && !dn(d, l.target) && o(l);
  };
  window.addEventListener("click", t), Se(() => window.removeEventListener("click", t));
}
const fe = 8, cn = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const l = e, d = z(null), g = (i) => i ? `${i}px` : void 0, n = u(() => ({
      minWidth: g(l.minWidth),
      maxWidth: g(l.maxWidth),
      maxHeight: g(l.maxHeight),
      height: g(l.height)
    })), $ = z({ w: 0, h: 0 }), C = z(l.anchor ? l.anchor.getBoundingClientRect() : null), j = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), I = (i) => ({
      left: Math.max(0, i.left),
      top: Math.max(0, i.top),
      right: Math.min(window.innerWidth, i.right),
      bottom: Math.min(window.innerHeight, i.bottom)
    }), F = (i) => {
      const B = i.closest(".pane, .float-window");
      return B ? I(B.getBoundingClientRect()) : j();
    }, O = (i, B) => `${Math.max(0, i ? Math.min(i, B) : B)}px`;
    function W(i, B) {
      return {
        below: i.bottom - B.bottom - l.gap - fe,
        above: B.top - i.top - l.gap - fe,
        across: i.right - i.left - 2 * fe
      };
    }
    function T(i) {
      const B = F(l.anchor), E = W(B, i);
      return $.value.w <= E.across && $.value.h <= Math.max(E.below, E.above) ? B : j();
    }
    const V = u(() => {
      if (!C.value) return n.value;
      const i = C.value, B = T(i), E = W(B, i), { w: L, h: A } = $.value, ee = l.align === "auto" ? i.left + i.right > B.left + B.right : l.align === "right", K = sn(ee ? i.right - L : i.left, B.left + fe, Math.max(B.left + fe, B.right - L - fe)), te = A > E.below && E.above > E.below ? { bottom: `${window.innerHeight - i.top + l.gap}px`, maxHeight: O(l.maxHeight, E.above) } : { top: `${i.bottom + l.gap}px`, maxHeight: O(l.maxHeight, E.below) };
      return { ...n.value, ...te, left: `${K}px`, maxWidth: O(l.maxWidth, E.across) };
    }), D = t, Y = () => [...d.value.querySelectorAll("button:not(:disabled)")];
    function J(i) {
      const B = Y(), E = B.indexOf(document.activeElement);
      B[(E + i + B.length) % B.length].focus();
    }
    const X = { ArrowDown: () => J(1), ArrowUp: () => J(-1), Escape: () => D("close") }, se = (i) => X[i.key] && (i.preventDefault(), X[i.key]()), U = () => d.value && ($.value = { w: d.value.offsetWidth, h: d.value.scrollHeight });
    let _ = 0;
    const M = new ResizeObserver(() => {
      cancelAnimationFrame(_), _ = requestAnimationFrame(U);
    });
    un(d, (i) => l.anchor && !l.anchor.contains(i.target) && D("close"));
    const v = (i, B) => ["top", "left", "right", "bottom"].some((E) => Math.abs(i[E] - B[E]) > 1), P = (i) => i.bottom < 0 || i.top > window.innerHeight;
    let k = 0;
    function m() {
      if (l.anchor) {
        const i = l.anchor.getBoundingClientRect();
        if (!l.anchor.isConnected || P(i)) return D("close");
        v(i, C.value) && (C.value = i);
      }
      k = requestAnimationFrame(m);
    }
    return at(() => {
      l.anchor && d.value && rn(d.value, l.anchor), U(), d.value && M.observe(d.value), !l.plain && Y()[0] && Y()[0].focus(), m();
    }), Se(() => {
      M.disconnect(), cancelAnimationFrame(k), cancelAnimationFrame(_);
    }), o({ element: d }), (i, B) => (a(), N(nt, {
      to: "body",
      disabled: !e.anchor
    }, [
      w("div", ot({
        ref_key: "panel",
        ref: d
      }, i.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: V.value,
        onKeydown: se
      }), [
        Ce(i.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), gn = /* @__PURE__ */ Z(cn, [["__scopeId", "data-v-3d203970"]]);
async function vn(e, o, t) {
  if (!e) return t(o);
  const { target: l, fields: d } = e, g = Object.fromEntries(Object.keys(d).map((C) => [C, l[C]])), n = () => Object.assign(l, g);
  Object.assign(l, d);
  let $ = !1;
  try {
    const C = await t(o);
    return $ = C.ok, C;
  } finally {
    $ || n();
  }
}
function mn(e, o, t, { groups: l, programs: d }) {
  const g = z({}), n = z(""), $ = z(!1), C = u(() => !!e.value && !e.value.ended_at), j = u(() => C.value && !!e.value.paused_at);
  async function I(T, V = null) {
    n.value = "";
    const D = await vn(V, T, o);
    return n.value = D.ok ? "" : D.error, t(), D;
  }
  return { groups: l, programs: d, chosen: g, failure: n, asking: $, running: C, paused: j, choose: (T, V) => I(["agent", "control", String(e.value.number), T, V.value], { target: g, fields: { value: { ...g.value, [T]: V.label } } }), stop: () => ($.value = !1, I(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (T) => I(["agent", "launch", T.name]) };
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
    const t = e, l = o, d = mn(Ve(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => l("changed"), { groups: Ve(t, "controlGroups"), programs: Ve(t, "agentPrograms") }), g = z(null), n = z(""), $ = u(() => d.groups.value.find((M) => M.key === n.value));
    function C(M, v) {
      g.value = M.currentTarget, n.value = v;
    }
    function j() {
      g.value = null, n.value = "", d.asking.value = !1;
    }
    const I = u(() => t.skills.filter((M) => M.state === "loaded"));
    function F(M) {
      C(M, "skills"), l("skills");
    }
    const O = (M) => d.groups.value.some((v) => v.key === M), W = u(() => {
      var M;
      return d.chosen.value.model ?? ((M = V.value) == null ? void 0 : M.model) ?? "";
    }), T = u(() => {
      var M;
      return d.chosen.value.effort ?? ((M = V.value) == null ? void 0 : M.effort) ?? "";
    });
    u(() => !!t.agent && !t.agent.ended_at);
    const V = u(() => {
      var M;
      return ((M = t.usage.agents) == null ? void 0 : M.find((v) => {
        var P;
        return v.id === ((P = t.agent) == null ? void 0 : P.id);
      })) ?? null;
    }), D = u(() => {
      var M;
      return ((M = V.value) == null ? void 0 : M.context_percent) == null ? null : Math.round(V.value.context_percent);
    }), Y = u(() => {
      var M;
      return fn(((M = V.value) == null ? void 0 : M.context_change) ?? null);
    }), J = (M) => `${Math.round(M / 1e3)}k`, X = u(() => {
      var M;
      return !!((M = V.value) != null && M.context_limit_tokens);
    }), se = u(() => {
      var M, v;
      return ((M = V.value) == null ? void 0 : M.context_limit_tokens) || ((v = V.value) == null ? void 0 : v.context_window_tokens) || 0;
    }), U = u(() => se.value ? `${J(V.value.context_tokens ?? 0)} of ${J(se.value)}` : ""), _ = u(() => {
      var M;
      return (M = V.value) != null && M.cost_dollars ? `$${V.value.cost_dollars.toFixed(2)}` : "";
    });
    return (M, v) => {
      var P, k;
      return a(), s("div", {
        class: ue(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (a(), s(q, { key: 0 }, [
          w("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: v[0] || (v[0] = (m) => C(m, "agent"))
          }, [
            p(ne, {
              name: "agents",
              size: 12
            }),
            f(" " + c(((P = e.agentPrograms.find((m) => m.name === e.agent.program)) == null ? void 0 : P.title) || e.agent.program), 1)
          ], 8, bn),
          p(nn, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: v[1] || (v[1] = (m) => l("open", "usage", m))
          }, null, 8, ["windows", "disabled"]),
          D.value !== null ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${D.value}% full: clear or compact it`,
            onClick: v[2] || (v[2] = (m) => O("context") ? C(m, "context") : l("open", "context", m.currentTarget))
          }, [
            p(ne, {
              name: "gauge",
              size: 12
            }),
            v[14] || (v[14] = f()),
            w("span", yn, [
              w("span", {
                style: Ie({ width: `${D.value}%` })
              }, null, 4)
            ]),
            f(" " + c(D.value) + "% ", 1)
          ], 8, kn)) : (k = V.value) != null && k.context_unknown ? (a(), s("span", wn, [
            p(ne, {
              name: "gauge",
              size: 12
            }),
            v[15] || (v[15] = f(" Context: unknown", -1))
          ])) : h("", !0),
          W.value ? (a(), s("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${W.value}: change the model`,
            onClick: v[3] || (v[3] = (m) => O("model") ? C(m, "model") : null)
          }, [
            p(ne, {
              name: "model",
              size: 12
            }),
            f(" " + c(W.value), 1)
          ], 8, Mn)) : h("", !0),
          O("effort") || e.card && T.value ? (a(), s("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: v[4] || (v[4] = (m) => C(m, "effort"))
          }, [
            p(ne, {
              name: "bolt",
              size: 12
            }),
            f(" " + c(T.value), 1)
          ], 8, $n)) : h("", !0),
          _.value ? (a(), s("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: v[5] || (v[5] = (m) => l("open", "cost", m.currentTarget))
          }, c(_.value), 9, xn)) : h("", !0),
          e.branch ? (a(), s("span", Sn, [
            p(ne, {
              name: "branch",
              size: 12
            }),
            f(" " + c(e.branch), 1)
          ])) : h("", !0),
          e.card ? h("", !0) : (a(), s("button", {
            key: 6,
            type: "button",
            class: ue(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: v[6] || (v[6] = (m) => l("open", "jobs", m.currentTarget))
          }, [
            p(ne, {
              name: "clock",
              size: 12
            }),
            f(" " + c(e.jobs), 1)
          ], 2)),
          e.run ? (a(), s("button", {
            key: 7,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: F
          }, [
            p(ne, {
              name: "book",
              size: 12
            }),
            f(" " + c(I.value.length), 1)
          ])) : h("", !0),
          e.fitness ? (a(), s(q, { key: 8 }, [
            w("button", {
              type: "button",
              class: ue(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < In }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: v[7] || (v[7] = (m) => l("open", "fitness", m.currentTarget))
            }, [
              p(ne, {
                name: "heart",
                size: 12
              }),
              f(" " + c(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            w("button", {
              type: "button",
              class: ue(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: v[8] || (v[8] = (m) => l("open", "load", m.currentTarget))
            }, [
              p(ne, {
                name: "weight",
                size: 12
              }),
              f(" " + c(e.fitness.workload), 1)
            ], 2)
          ], 64)) : h("", !0)
        ], 64)) : e.run && !e.loading ? (a(), s("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: v[9] || (v[9] = (m) => C(m, "start"))
        }, [
          p(ne, {
            name: "agents",
            size: 12
          }),
          v[16] || (v[16] = f(" Start an agent", -1))
        ])) : h("", !0),
        v[22] || (v[22] = w("span", { class: "space" }, null, -1)),
        r(d).failure.value ? (a(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: r(d).failure.value
        }, c(r(d).failure.value), 9, Cn)) : h("", !0),
        Ce(M.$slots, "default", {}, void 0, !0),
        g.value ? (a(), N(gn, {
          key: 3,
          anchor: g.value,
          "min-width": 190,
          onClose: j
        }, {
          default: b(() => {
            var m;
            return [
              n.value === "agent" ? (a(), s(q, { key: 0 }, [
                r(d).asking.value ? (a(), s(q, { key: 0 }, [
                  p(xe, { "data-agent-stop-ask": "" }, {
                    default: b(() => [...v[17] || (v[17] = [
                      f("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  p(be, {
                    "data-agent-stop-confirm": "",
                    onClick: v[10] || (v[10] = (i) => (j(), r(d).stop()))
                  }, {
                    default: b(() => [...v[18] || (v[18] = [
                      f("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  p(be, {
                    onClick: v[11] || (v[11] = (i) => r(d).asking.value = !1)
                  }, {
                    default: b(() => [...v[19] || (v[19] = [
                      f("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (a(), N(be, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: v[12] || (v[12] = (i) => r(d).asking.value = !0)
                }, {
                  default: b(() => [...v[20] || (v[20] = [
                    f("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : n.value === "start" ? (a(), s(q, { key: 1 }, [
                p(xe, null, {
                  default: b(() => [...v[21] || (v[21] = [
                    f("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (a(!0), s(q, null, le(r(d).programs.value, (i) => (a(), N(be, {
                  key: i.name,
                  "data-agent-program": i.name,
                  onClick: (B) => (j(), r(d).start(i))
                }, {
                  default: b(() => [
                    f(c(i.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : n.value === "skills" ? (a(), N(Xa, {
                key: 2,
                skills: e.skills,
                onBrowse: v[13] || (v[13] = (i) => (j(), l("open", "skills", null)))
              }, null, 8, ["skills"])) : $.value ? (a(), s(q, { key: 3 }, [
                p(xe, null, {
                  default: b(() => [
                    f(c($.value.label), 1)
                  ]),
                  _: 1
                }),
                n.value === "context" ? (a(), s(q, { key: 0 }, [
                  w("p", Tn, c(r(pn)(((m = V.value) == null ? void 0 : m.last_compaction) ?? null)), 1),
                  w("div", An, [
                    w("span", jn, [
                      w("span", {
                        style: Ie({ width: `${D.value}%` })
                      }, null, 4)
                    ]),
                    w("span", Ln, c(D.value) + "%", 1)
                  ]),
                  U.value ? (a(), s("p", Rn, [
                    f(c(U.value) + " ", 1),
                    X.value ? (a(), N(ln, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : h("", !0)
                  ])) : h("", !0)
                ], 64)) : h("", !0),
                n.value === "context" && Y.value ? (a(), s("p", Bn, c(Y.value), 1)) : (a(!0), s(q, { key: 2 }, le($.value.choices, (i) => (a(), N(be, {
                  key: i.value,
                  "data-agent-choice": i.value,
                  onClick: (B) => (r(d).choose($.value.key, i), j())
                }, {
                  default: b(() => [
                    f(c(i.label), 1)
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
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), l = ["completed", "testing"], d = { helper: "Helper", reviewer: "Reviewer", main: "Main agent" }, g = { running: "Working", starting: "Starting", stopping: "Stopping", ended: "Idle: its process has stopped", failed: "Could not start", never_started: "Not started" }, n = e, $ = o, C = Ze(), j = u(() => {
      var R, Q;
      if ((R = n.facts) != null && R.profile_title) return n.facts.profile_title;
      if ((Q = n.facts) != null && Q.profile) return n.facts.profile;
      const y = d[n.row.role] || n.row.role;
      return y.slice(0, 1).toUpperCase() + y.slice(1);
    }), I = u(() => {
      var y;
      return ((y = n.facts) == null ? void 0 : y.tasks) ?? [];
    }), F = u(() => I.value.filter((y) => y.state === "open")), O = u(() => I.value.find((y) => {
      var R;
      return y.id === ((R = n.progress) == null ? void 0 : R.task_id) && y.state === "started";
    })), W = u(() => O.value || I.value.find((y) => {
      var R;
      return y.id === ((R = n.facts) == null ? void 0 : R.task_id);
    }) || I.value.find((y) => t.has(y.state)) || F.value[0] || I.value.at(-1)), T = u(() => {
      var y, R, Q, ve, ce, ae;
      return n.row.role === "helper" ? ((y = n.facts) == null ? void 0 : y.helper_job) || "" : (R = n.facts) != null && R.job_enabled && (((Q = O.value) == null ? void 0 : Q.title) || ((ve = n.facts) == null ? void 0 : ve.task_title) || ((ce = F.value[0]) == null ? void 0 : ce.title) || ((ae = I.value.at(-1)) == null ? void 0 : ae.title)) || "";
    }), V = u(() => `${n.row.role} ${n.row.number}`), D = u(() => {
      var y, R;
      return [n.row.program, (y = n.facts) == null ? void 0 : y.model, (R = n.facts) == null ? void 0 : R.effort, V.value].filter(Boolean).join(" · ");
    }), Y = u(() => n.row.role === "main" ? j.value : `${j.value} ${n.row.number}`), J = Oe(), X = u(() => pt(n.row.process_started_at || n.row.created_at, C.value)), se = /* @__PURE__ */ new Set(["open", "started", "testing"]), U = { fresh: "new conversation", resumed: "resumed" }, _ = u(() => {
      var y, R;
      return [(y = n.facts) == null ? void 0 : y.helper_job_program, U[(R = n.facts) == null ? void 0 : R.occupant_launch]].filter(Boolean).join(", ");
    }), M = u(() => {
      var y;
      return (y = n.facts) == null ? void 0 : y.work_status;
    }), v = u(() => !!n.row.ended_at && n.row.role !== "main" && I.value.some((y) => se.has(y.state))), P = u(() => {
      var y, R;
      return n.row.state === "running" && ((y = n.facts) == null ? void 0 : y.state) === "at usage limit" && !!((R = n.facts) != null && R.usage_limit_ends_at);
    }), k = (y) => new Date(y).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), m = u(() => n.row.halted_at ? `Stopped at the usage limit since ${k(n.row.halted_at)}, goes on at ${k(n.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(n.facts.usage_limit_ends_at).toLocaleString()}`), i = u(() => {
      var y;
      return n.row.retired_at || n.row.state === "retired" ? "retired" : P.value || M.value || n.waitReason || v.value ? "waiting" : n.row.state === "running" && ((y = n.facts) == null ? void 0 : y.state) || n.row.state;
    }), B = u(() => {
      var y;
      return P.value ? m.value : M.value ? `Status: ${M.value}` : n.waitReason ? `Waiting: ${n.waitReason}` : i.value === "blocked" ? (y = n.facts) != null && y.blocked_reason ? `Blocked: ${n.facts.blocked_reason}` : "Blocked" : v.value ? "Stopped with work left" : "";
    }), E = u(() => {
      var y;
      return ((y = n.progress) == null ? void 0 : y.completed_count) ?? I.value.filter((R) => l.includes(R.state)).length;
    }), L = u(() => {
      var y;
      return ht(E.value, ((y = n.progress) == null ? void 0 : y.started_at) || n.row.created_at, n.progress ? n.progress.finished_at : n.row.ended_at, C.value);
    }), A = u(() => n.row.role === "main" ? 0 : L.value), ee = u(() => !!n.row.retired_at || n.row.state === "retired"), K = u(() => ee.value ? "Retired" : i.value === "blocked" || i.value === "waiting" ? B.value || (i.value === "blocked" ? "Blocked" : "Waiting") : g[n.row.standing]), ke = u(() => {
      var R;
      if (ee.value) return n.row.retired_at;
      const y = i.value === "blocked" || i.value === "waiting";
      return n.row.ended_at || y && ((R = n.facts) == null ? void 0 : R.last_activity) || n.row.process_started_at || n.row.created_at;
    }), te = u(() => ft(ke.value, C.value)), Ae = u(() => {
      var y;
      return bt((y = n.facts) == null ? void 0 : y.last_activity, C.value);
    });
    return (y, R) => {
      var Q, ve, ce, ae, ye, je, we;
      return a(), s("div", {
        class: ue(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: R[1] || (R[1] = (re) => !e.open && $("toggle")),
        onKeydown: [
          R[2] || (R[2] = qe(ie((re) => !e.open && $("toggle"), ["self", "prevent"]), ["enter"])),
          R[3] || (R[3] = qe(ie((re) => !e.open && $("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        w("div", zn, [
          e.open ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back",
            "aria-label": "Back",
            onClick: R[0] || (R[0] = ie((re) => $("toggle"), ["stop"]))
          }, [
            p(r(Ee), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : h("", !0),
          e.open ? (a(), s(q, { key: 1 }, [
            w("span", En, c(Y.value), 1),
            w("span", Nn, c(((Q = e.facts) == null ? void 0 : Q.given_name) || e.row.id), 1)
          ], 64)) : (a(), s(q, { key: 2 }, [
            p(r(kt), {
              "agent-id": e.row.id,
              label: j.value,
              class: "agent-who"
            }, {
              default: b(() => {
                var re;
                return [
                  w("span", Wn, c(j.value), 1),
                  w("span", Dn, c(((re = e.facts) == null ? void 0 : re.given_name) || e.row.id), 1)
                ];
              }),
              _: 1
            }, 8, ["agent-id", "label"]),
            p(r(Ee), {
              class: "agent-chevron",
              name: "chevronRight",
              size: 12
            })
          ], 64))
        ]),
        e.open ? h("", !0) : (a(), s("span", qn, [
          w("span", Fn, c(D.value), 1),
          (ve = e.facts) != null && ve.sandbox_off ? (a(), s("span", Un, "sandbox off")) : h("", !0)
        ])),
        e.open && !ee.value ? (a(), N(Vn, {
          key: 1,
          class: "agent-live",
          "agent-programs": r(J).props.programs.rows.value,
          agent: e.row,
          branch: (ce = e.progress) == null ? void 0 : ce.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((ae = e.facts) == null ? void 0 : ae.windows) ?? [] },
          card: ""
        }, {
          default: b(() => {
            var re, Me;
            return [
              (re = e.facts) != null && re.sandbox_off ? (a(), s("span", Pn, "sandbox off")) : h("", !0),
              w("span", Gn, "Run time: " + c(X.value), 1),
              (Me = e.facts) != null && Me.last_activity ? (a(), s("span", Jn, [
                R[4] || (R[4] = f("Seen: ", -1)),
                p(r(We), {
                  at: e.facts.last_activity
                }, null, 8, ["at"])
              ])) : h("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : h("", !0),
        (ye = e.facts) != null && ye.unit_name ? (a(), s("div", Kn, "Unit: " + c(e.facts.unit_name), 1)) : h("", !0),
        e.open ? h("", !0) : (a(), N(Da, {
          key: 3,
          tasks: I.value,
          "in-hand": e.row.role !== "helper" && ((je = e.facts) != null && je.job_enabled) && W.value || null,
          job: e.row.role === "helper" ? T.value : "",
          "job-title": e.row.role === "helper" && ((we = e.facts) == null ? void 0 : we.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? _.value : "",
          "per-hour": A.value
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour"])),
        p(Ta, {
          state: i.value,
          doing: K.value,
          since: te.value,
          seen: Ae.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open && !ee.value ? (a(), N(Yt, {
          key: 4,
          row: e.row,
          held: i.value === "blocked"
        }, null, 8, ["row", "held"])) : h("", !0),
        e.open ? (a(), N(Ma, {
          key: 5,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: I.value,
          "stopped-with-work": v.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : h("", !0)
      ], 42, Hn);
    };
  }
}, Yn = /* @__PURE__ */ Z(Zn, [["__scopeId", "data-v-651ea3a4"]]), _n = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Qn = ["data-agent-row", "data-agent-lingering"], Pe = "journal.agents.filters", Ge = 300 * 1e3, Be = "cubic-bezier(0.2, 0.9, 0.25, 1)", Xn = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const o = e, t = Oe(), { rows: l } = t.props.waits, { rows: d } = t.props.progress, { rows: g, failure: n, loaded: $, more: C } = t.props.agents, j = (S) => d.value.find((H) => H.agent_id === S.id) ?? null, I = (S) => {
      var H;
      return ((H = l.value.find((x) => x.agent_id === S.id)) == null ? void 0 : H.reason) ?? "";
    }, F = z("running"), O = z(""), W = JSON.parse(localStorage.getItem(Pe) || '{"roles":[],"profiles":[],"programs":[]}'), T = z(W), V = u(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: D } = t.props.programs, Y = u(() => T.value.roles.length + T.value.profiles.length + T.value.programs.length), J = (S, H) => {
      T.value = $t(T.value, S, H);
    }, X = () => {
      T.value = { roles: [], profiles: [], programs: [] };
    }, se = (S) => S.slice(0, 1).toUpperCase() + S.slice(1);
    ge(T, (S) => localStorage.setItem(Pe, JSON.stringify(S)));
    const U = z(25);
    function _() {
      Object.assign(t.state, {
        "agents.show": F.value,
        "agents.search": O.value,
        "agents.limit": String(U.value),
        "agents.roles": T.value.roles.join(","),
        "agents.profiles": T.value.profiles.join(","),
        "agents.programs": T.value.programs.join(",")
      });
    }
    async function M() {
      return U.value += 25, _(), await t.reload("agents"), !0;
    }
    ge([F, O, T], () => {
      U.value = 25, _(), t.reload("agents");
    }), _();
    const v = (S) => S.facts ?? null, P = g, k = Ze(), m = z([]), i = u(() => new Set(m.value.filter((S) => k.value - S.left < Ge).map((S) => S.row.id))), B = u(() => m.value.filter((S) => i.value.has(S.row.id)).map((S) => S.row)), E = u(() => [...P.value, ...B.value]);
    let L = "", A = [];
    async function ee(S) {
      await t.reload(`card.${S.id}`);
      const H = t.props[`card.${S.id}`].rows.value.find((x) => x.id === S.id);
      H != null && H.ended_at && !m.value.some((x) => x.row.id === S.id) && (m.value = [...m.value, { row: H, left: Date.now() }]);
    }
    ge(g, (S) => {
      const H = L === `${F.value}|${O.value}|${JSON.stringify(T.value)}` && F.value === "running", x = H ? A.filter((G) => !S.some((me) => me.id === G.id)) : [];
      L = `${F.value}|${O.value}|${JSON.stringify(T.value)}`, A = S, m.value = H ? m.value.filter((G) => k.value - G.left < Ge && !S.some((me) => me.id === G.row.id)) : [], x.forEach(ee);
    }, { immediate: !0 });
    const K = u(() => !!O.value.trim() || Y.value > 0), ke = u(() => o.texts[F.value] ?? { title: o.empty, hint: "" }), te = z(null), Ae = z(null), y = z(null), R = z(null), Q = u(() => te.value === null ? null : t.props[`card.${te.value}`].rows.value.find((S) => S.id === te.value) ?? Ae.value), ve = u(() => Q.value ? [Q.value] : E.value), ce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, ae = z(!1);
    let ye = 0;
    async function je(S) {
      if (ae.value) return;
      ae.value = !0, ye = R.value.scrollTop;
      const H = y.value.querySelector(`[data-agent-open="${S.id}"]`);
      if (!ce()) {
        const pe = [...y.value.querySelectorAll(".agent-row")].filter((de) => !de.contains(H));
        await Promise.all(pe.map((de) => de.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const x = [...H.querySelectorAll(".agent-head, .agent-line")], G = [...x, ...H.querySelectorAll("[data-agent-motion]")], me = G.map((pe) => pe.getBoundingClientRect());
      if (Ae.value = S, te.value = S.id, t.reload(`card.${S.id}`), await Fe(), !ce()) {
        const pe = G.map((de) => de.getBoundingClientRect());
        G.forEach((de, Le) => {
          const he = x.findIndex((De) => De !== de && De.contains(de)), _e = me[Le].left - pe[Le].left - (he < 0 ? 0 : me[he].left - pe[he].left), Qe = me[Le].top - pe[Le].top - (he < 0 ? 0 : me[he].top - pe[he].top);
          de.animate([{ transform: `translate(${_e}px, ${Qe}px)` }, { transform: "none" }], { duration: 280, easing: Be });
        }), y.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((de) => {
          de.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Be, fill: "backwards" });
        });
      }
      ae.value = !1;
    }
    async function we() {
      if (ae.value || !Q.value) return;
      ae.value = !0;
      const S = y.value.querySelector(`[data-agent-open="${te.value}"]`), H = [...S.children], x = ce() ? [] : H.map((G) => G.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(x.map((G) => G.finished)), te.value = null, await Fe(), R.value.scrollTop = ye, x.forEach((G) => G.cancel()), ce() || (S.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Be }), y.value.querySelectorAll(".agent-row").forEach((G) => {
        G.contains(S) || G.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Be });
      })), ae.value = !1;
    }
    const re = (S) => te.value === S.id ? we() : je(S);
    ge(O, (S) => S.trim() && (te.value = null)), ge(F, () => {
      te.value = null;
    });
    const Me = (S) => {
      S.key === "Escape" && we();
    };
    return window.addEventListener("keydown", Me), Se(() => window.removeEventListener("keydown", Me)), (S, H) => (a(), s("div", {
      ref_key: "agents",
      ref: y,
      class: ue(["agents", { focused: Q.value, "card-changing": ae.value }])
    }, [
      Q.value ? h("", !0) : (a(), N(r(yt), {
        key: 0,
        modelValue: O.value,
        "onUpdate:modelValue": H[1] || (H[1] = (x) => O.value = x),
        placeholder: "Search agents",
        "menu-count": Y.value,
        "data-agents-search": ""
      }, {
        menu: b(() => [
          p(r(He), null, {
            default: b(() => [...H[2] || (H[2] = [
              f("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(q, null, le(V.value.roles, (x) => (a(), N(r(Re), {
            key: x,
            role: "menuitemcheckbox",
            "aria-checked": T.value.roles.includes(x),
            checked: T.value.roles.includes(x),
            "data-filter-role": x,
            onClick: (G) => J("roles", x)
          }, {
            default: b(() => [
              f(c(se(x)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          V.value.profiles.length ? (a(), N(r(He), { key: 0 }, {
            default: b(() => [...H[3] || (H[3] = [
              f("Profile", -1)
            ])]),
            _: 1
          })) : h("", !0),
          (a(!0), s(q, null, le(V.value.profiles, (x) => (a(), N(r(Re), {
            key: x.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.profiles.includes(x.name),
            checked: T.value.profiles.includes(x.name),
            "data-filter-profile": x.name,
            onClick: (G) => J("profiles", x.name)
          }, {
            default: b(() => [
              f(c(x.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          p(r(He), null, {
            default: b(() => [...H[4] || (H[4] = [
              f("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(q, null, le(r(D), (x) => (a(), N(r(Re), {
            key: x.name,
            role: "menuitemcheckbox",
            "aria-checked": T.value.programs.includes(x.name),
            checked: T.value.programs.includes(x.name),
            "data-filter-program": x.name,
            onClick: (G) => J("programs", x.name)
          }, {
            default: b(() => [
              f(c(x.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          Y.value ? (a(), N(r(Re), {
            key: 1,
            "data-filter-clear": "",
            onClick: X
          }, {
            default: b(() => [...H[5] || (H[5] = [
              f("Clear filters", -1)
            ])]),
            _: 1
          })) : h("", !0)
        ]),
        default: b(() => [
          p(r(wt), {
            options: V.value.states,
            value: F.value,
            onPick: H[0] || (H[0] = (x) => F.value = x)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      F.value === "retired" && V.value.upgrade_retired ? (a(), s("p", _n, "Retired during the upgrade: " + c(V.value.upgrade_retired), 1)) : h("", !0),
      w("div", {
        ref_key: "list",
        ref: R,
        class: ue(["agents-view", { "agents-view-open": Q.value }])
      }, [
        r($) && !r(n) && !ve.value.length && Y.value ? (a(), N(r(Ne), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: b(() => [
            p(r(oe), {
              small: "",
              "data-empty-clear": "",
              onClick: X
            }, {
              default: b(() => [...H[6] || (H[6] = [
                f("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), N(r(Mt), {
          key: 1,
          moves: "",
          "leaves-at-once": ae.value,
          rows: ve.value,
          failure: r(n),
          loaded: r($),
          more: !Q.value && r(C),
          older: M,
          empty: ke.value.title,
          hint: ke.value.hint,
          searching: K.value
        }, {
          default: b(({ row: x }) => [
            w("div", {
              class: ue(["agent-row", { lingering: i.value.has(x.id) && x.id !== te.value }]),
              "data-agent-row": x.id,
              "data-agent-lingering": i.value.has(x.id) ? "" : null
            }, [
              p(Yn, {
                row: x,
                facts: v(x),
                progress: j(x),
                "wait-reason": I(x),
                open: x.id === te.value,
                onToggle: (G) => re(x)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, Qn)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, no = /* @__PURE__ */ Z(Xn, [["__scopeId", "data-v-fceb20c3"]]);
export {
  no as A
};
