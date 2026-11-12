import { openBlock as a, createElementBlock as s, withModifiers as ne, createElementVNode as w, createVNode as v, unref as i, withCtx as f, createTextVNode as p, Fragment as D, renderList as le, toDisplayString as g, createBlock as N, createCommentVNode as h, ref as z, computed as u, watch as ce, onUnmounted as Se, defineAsyncComponent as Xe, createSlots as et, resolveDynamicComponent as tt, normalizeClass as de, normalizeStyle as Ie, renderSlot as Ce, onMounted as at, Teleport as nt, mergeProps as ot, toRef as Ve, withKeys as qe, nextTick as Fe } from "vue";
import { TextInput as He, Btn as oe, TextArea as lt, TimeAgo as We, useWindow as Oe, SwitchCase as Je, peekRef as Ae, Icon as Ee, RunningCommand as st, FoldGroup as Ke, TaskStatusIcon as rt, loadWindowComponent as it, coalesced as dt, READ_RATES as ut, eventMayBeChildOf as ct, InnerTabs as gt, TabBody as vt, EmptyState as Ne, HoverTip as $e, TaskBar as mt, useNow as Ze, age as pt, perHour as ht, sinceWords as ft, seenWords as bt, AgentTip as kt, SearchBar as yt, Segmented as wt, MenuLabel as ze, MenuItem as Re, RowList as Mt, toggleFilter as $t } from "@journal/window-kit";
import { _ as J, T as xt } from "./TranscriptRows-Crmxs6Un.js";
const St = { class: "action-buttons" }, Ct = {
  __name: "AgentDriverForm",
  props: { program: String, model: String, pending: Boolean },
  emits: ["submit", "cancel", "update:program", "update:model"],
  setup(e) {
    return (o, t) => (a(), s("form", {
      "data-agent-driver-form": "",
      onSubmit: t[3] || (t[3] = ne((l) => o.$emit("submit"), ["prevent"]))
    }, [
      t[6] || (t[6] = w("p", null, "Starts the next session on this program; the agent keeps its number and memories.", -1)),
      v(i(He), {
        "model-value": e.program,
        label: "Program",
        disabled: e.pending,
        "data-agent-driver-program": "",
        "onUpdate:modelValue": t[0] || (t[0] = (l) => o.$emit("update:program", l))
      }, null, 8, ["model-value", "disabled"]),
      v(i(He), {
        "model-value": e.model,
        label: "Model",
        disabled: e.pending,
        "data-agent-driver-model": "",
        "onUpdate:modelValue": t[1] || (t[1] = (l) => o.$emit("update:model", l))
      }, null, 8, ["model-value", "disabled"]),
      w("div", St, [
        v(i(oe), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.program.trim() || !e.model.trim(),
          "data-agent-confirm-driver": ""
        }, {
          default: f(() => [...t[4] || (t[4] = [
            p("Change the driver", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        v(i(oe), {
          small: "",
          disabled: e.pending,
          onClick: t[2] || (t[2] = (l) => o.$emit("cancel"))
        }, {
          default: f(() => [...t[5] || (t[5] = [
            p("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, At = /* @__PURE__ */ J(Ct, [["__scopeId", "data-v-c138a4da"]]), Tt = { class: "action-field" }, jt = ["value", "disabled"], Lt = ["value"], Rt = { key: 1 }, Bt = {
  key: 1,
  class: "action-field"
}, It = { class: "action-buttons" }, Ot = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (o, t) => (a(), s("form", {
      onSubmit: t[4] || (t[4] = ne((l) => o.$emit("submit"), ["prevent"]))
    }, [
      e.row.job_task_flag ? (a(), s(D, { key: 0 }, [
        w("label", Tt, [
          t[6] || (t[6] = p("Task ", -1)),
          w("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: t[0] || (t[0] = (l) => o.$emit("update:task", l.target.value))
          }, [
            t[5] || (t[5] = w("option", { value: "" }, "Choose an open task", -1)),
            (a(!0), s(D, null, le(e.tasks, (l) => (a(), s("option", {
              key: l.id,
              value: String(l.id)
            }, g(l.id) + ": " + g(l.title), 9, Lt))), 128))
          ], 40, jt)
        ]),
        e.moreTasks ? (a(), N(i(oe), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: t[1] || (t[1] = (l) => o.$emit("more"))
        }, {
          default: f(() => [...t[7] || (t[7] = [
            p("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : h("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (a(), s("p", Rt, "No open tasks.")) : h("", !0)
      ], 64)) : (a(), s("label", Bt, [
        t[8] || (t[8] = p("Job", -1)),
        v(i(lt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (l) => o.$emit("update:text", l.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      w("div", It, [
        v(i(oe), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: f(() => [...t[9] || (t[9] = [
            p("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        v(i(oe), {
          small: "",
          disabled: e.pending,
          onClick: t[3] || (t[3] = (l) => o.$emit("cancel"))
        }, {
          default: f(() => [...t[10] || (t[10] = [
            p("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Vt = /* @__PURE__ */ J(Ot, [["__scopeId", "data-v-adde4158"]]), zt = { class: "action-buttons" }, Ht = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (o, t) => (a(), s("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = ne((l) => o.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = w("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      v(i(He), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (l) => o.$emit("update:reason", l))
      }, null, 8, ["model-value", "disabled"]),
      w("div", zt, [
        v(i(oe), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: f(() => [...t[3] || (t[3] = [
            p("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        v(i(oe), {
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (l) => o.$emit("cancel"))
        }, {
          default: f(() => [...t[4] || (t[4] = [
            p("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Et = /* @__PURE__ */ J(Ht, [["__scopeId", "data-v-92de7dd6"]]), Nt = {
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
        (a(!0), s(D, null, le(e.sessions, (l) => (a(), s("li", {
          key: l.session,
          "data-agent-session": ""
        }, [
          w("span", null, g([l.program, l.model].filter(Boolean).join(" ")), 1),
          l.started_at ? (a(), s("span", Dt, [
            t[1] || (t[1] = p("Started ", -1)),
            v(i(We), {
              at: l.started_at
            }, null, 8, ["at"])
          ])) : h("", !0),
          w("span", qt, g(l.end_reason ? `Ended: ${l.end_reason.replaceAll("_", " ")}` : l.started_at ? "Running" : "Not started"), 1),
          w("code", null, g(l.session), 1)
        ]))), 128))
      ]),
      w("div", Ft, [
        v(i(oe), {
          small: "",
          onClick: t[0] || (t[0] = (l) => o.$emit("close"))
        }, {
          default: f(() => [...t[2] || (t[2] = [
            p("Close", -1)
          ])]),
          _: 1
        })
      ])
    ]));
  }
}, Pt = /* @__PURE__ */ J(Ut, [["__scopeId", "data-v-0d688bd9"]]), Gt = { class: "action-buttons" }, Jt = {
  key: 0,
  role: "alert"
}, Kt = {
  key: 1,
  role: "status"
}, Zt = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    const o = e, t = Oe(), l = z(""), d = z(""), n = z(""), k = z(""), S = z(""), T = z(""), R = z([]), I = z(0), q = z(!1), O = z(!1), W = z(!1), j = z(""), V = z(""), E = z([]), Z = u(() => !!o.row.retired_at || o.row.state === "retired"), G = u(() => !Z.value && !!o.row.ended_at), Q = u(() => {
      var M;
      return G.value && ((M = o.row.job_command) == null ? void 0 : M.length) && !o.row.resume_reason;
    }), se = u(() => Q.value && !O.value && (o.row.job_task_flag ? R.value.some((M) => String(M.id) === T.value) : !!d.value.trim()));
    function F(M) {
      l.value = M, d.value = "", n.value = "", T.value = "", j.value = "", V.value = "";
    }
    async function Y() {
      F("job"), o.row.job_task_flag && (R.value = [], I.value = 0, q.value = !1, await $());
    }
    async function $() {
      if (!O.value) {
        O.value = !0;
        try {
          t.state["jobs.page"] = String(I.value + 1), await t.reload("jobs");
          const M = t.props.jobs;
          j.value = M.failure.value, j.value || (R.value = [...R.value, ...M.rows.value], I.value = M.data.value.page, q.value = M.more.value);
        } finally {
          O.value = !1;
        }
      }
    }
    async function c(M, x) {
      if (!W.value) {
        W.value = !0, j.value = "";
        try {
          const ee = await t.run(M);
          j.value = ee.ok ? "" : ee.error, ee.ok && (F(""), V.value = x);
        } finally {
          W.value = !1;
        }
      }
    }
    async function K() {
      if (!se.value) return;
      const M = o.row.job_task_flag ? [o.row.job_task_flag, T.value] : [d.value.trim()];
      await c([...o.row.job_command, String(o.row.number), ...M], "Job sent.");
    }
    async function b() {
      if (!W.value) {
        W.value = !0;
        try {
          const M = await t.run(["agent", "sessions", String(o.row.number)]);
          F(M.ok ? "history" : ""), j.value = M.ok ? "" : M.error, E.value = M.ok ? M.value.rows : [];
        } finally {
          W.value = !1;
        }
      }
    }
    function m() {
      F("driver"), k.value = o.row.program || "", S.value = "";
    }
    async function r() {
      !G.value || l.value !== "driver" || !k.value.trim() || !S.value.trim() || await c(["agent", "driver", String(o.row.number), "--program", k.value.trim(), "--model", S.value.trim()], "Driver changed.");
    }
    async function B() {
      !G.value || l.value !== "retire" || !n.value.trim() || await c(["agent", "retire", String(o.row.number), "--reason", n.value.trim()], "Agent retired permanently.");
    }
    return (M, x) => {
      var ee;
      return a(), s("div", {
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: x[10] || (x[10] = ne(() => {
        }, ["stop"])),
        onKeydown: x[11] || (x[11] = ne(() => {
        }, ["stop"]))
      }, [
        w("div", Gt, [
          v(i(oe), {
            small: "",
            "data-agent-history": "",
            disabled: W.value || O.value,
            onClick: b
          }, {
            default: f(() => [...x[12] || (x[12] = [
              p("Session history", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          G.value ? (a(), s(D, { key: 0 }, [
            (ee = e.row.job_command) != null && ee.length ? (a(), N(i(oe), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: W.value || O.value || !Q.value,
              onClick: Y
            }, {
              default: f(() => [...x[13] || (x[13] = [
                p("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0),
            e.row.role !== "main" ? (a(), N(i(oe), {
              key: 1,
              small: "",
              "data-agent-driver": "",
              disabled: W.value || O.value,
              onClick: m
            }, {
              default: f(() => [...x[14] || (x[14] = [
                p("Change driver", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0),
            e.row.role !== "main" ? (a(), N(i(oe), {
              key: 2,
              small: "",
              "data-agent-retire": "",
              disabled: W.value || O.value,
              onClick: x[0] || (x[0] = (U) => F("retire"))
            }, {
              default: f(() => [...x[15] || (x[15] = [
                p("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0)
          ], 64)) : h("", !0)
        ]),
        v(i(Je), { value: l.value }, {
          job: f(() => [
            v(Vt, {
              task: T.value,
              "onUpdate:task": x[1] || (x[1] = (U) => T.value = U),
              text: d.value,
              "onUpdate:text": x[2] || (x[2] = (U) => d.value = U),
              row: e.row,
              tasks: R.value,
              pending: W.value,
              loading: O.value,
              "more-tasks": q.value,
              failure: j.value,
              "job-ready": se.value,
              onSubmit: K,
              onMore: $,
              onCancel: x[3] || (x[3] = (U) => F(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          driver: f(() => [
            v(At, {
              program: k.value,
              "onUpdate:program": x[4] || (x[4] = (U) => k.value = U),
              model: S.value,
              "onUpdate:model": x[5] || (x[5] = (U) => S.value = U),
              pending: W.value,
              onSubmit: r,
              onCancel: x[6] || (x[6] = (U) => F(""))
            }, null, 8, ["program", "model", "pending"])
          ]),
          history: f(() => [
            v(Pt, {
              sessions: E.value,
              onClose: x[7] || (x[7] = (U) => F(""))
            }, null, 8, ["sessions"])
          ]),
          retire: f(() => [
            v(Et, {
              reason: n.value,
              "onUpdate:reason": x[8] || (x[8] = (U) => n.value = U),
              pending: W.value,
              onSubmit: B,
              onCancel: x[9] || (x[9] = (U) => F(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        j.value ? (a(), s("p", Jt, g(j.value), 1)) : h("", !0),
        V.value ? (a(), s("p", Kt, g(V.value), 1)) : h("", !0)
      ], 32);
    };
  }
}, Yt = /* @__PURE__ */ J(Zt, [["__scopeId", "data-v-03a4a81a"]]), _t = {
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
        onClick: t[0] || (t[0] = ne((l) => i(Ae)("test_queue:0"), ["stop"]))
      }, [
        p("Waiting: " + g(e.waitReason) + " ", 1),
        v(i(Ee), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), s("span", Qt, "Waiting")) : (a(), N(i(st), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, ea = /* @__PURE__ */ J(Xt, [["__scopeId", "data-v-1b371fb5"]]), ta = {
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
          v(i(We), {
            at: e.row.retired_at
          }, null, 8, ["at"])
        ])
      ]),
      e.row.retiring_actor_name ? (a(), s("div", na, [
        t[1] || (t[1] = w("dt", null, "Retired by", -1)),
        w("dd", oa, g(e.row.retiring_actor_name), 1)
      ])) : h("", !0)
    ])) : h("", !0);
  }
}, sa = /* @__PURE__ */ J(la, [["__scopeId", "data-v-abc8e12a"]]), ra = ["data-agent-delegated", "onClick"], ia = { class: "agent-task-number" }, da = { class: "agent-task-title" }, ua = ["title"], ca = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = o;
    return (l, d) => (a(), N(i(Ke), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: d[0] || (d[0] = (n) => t("toggle"))
    }, {
      default: f(() => [
        (a(!0), s(D, null, le(e.section.tasks, (n) => (a(), s("button", {
          key: n.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": n.id,
          onClick: (k) => i(Ae)(`tasks:${n.id}`)
        }, [
          v(i(rt), {
            status: n.state
          }, null, 8, ["status"]),
          w("span", ia, g(n.id), 1),
          w("span", da, g(n.title), 1),
          n.plan_id ? (a(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${n.plan_id}: ${n.plan_title}`
          }, "Plan " + g(n.plan_id), 9, ua)) : h("", !0)
        ], 8, ra))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, ga = /* @__PURE__ */ J(ca, [["__scopeId", "data-v-ea4ccd6b"]]), va = {
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
      var b, m;
      return o.row.ended_at && ((m = (b = o.facts) == null ? void 0 : b.job_returned) != null && m.startsWith(ya)) ? o.facts.job_returned : "";
    }), d = u(() => o.tasks.length ? t.map((b) => ({ state: b, label: b.slice(0, 1).toUpperCase() + b.slice(1), tasks: o.tasks.filter((m) => m.state === b || b === "started" && m.state === "testing" || b === "completed" && m.state === "cancelled") })) : []), n = /* @__PURE__ */ new Set(["completed"]), k = z({}), S = (b) => !(k.value[b] ?? n.has(b)), T = (b) => k.value = { ...k.value, [b]: S(b) }, R = Oe(), { rows: I } = R.props.reports;
    R.state["reports.agent"] = String(o.row.number);
    const q = u(() => o.row.access === "read-only"), O = ["tasks", "transcript", "terminal", "file-feed", "processes", "reports", "memories"], W = u(() => [...R.tabs].sort((b, m) => (O.indexOf(b.key) < 0 ? O.length : O.indexOf(b.key)) - (O.indexOf(m.key) < 0 ? O.length : O.indexOf(m.key)))), j = u(() => !!o.row.retired_at || o.row.state === "retired"), V = () => q.value || j.value ? W.value.find((b) => b.key === "transcript") : W.value[0], E = z(V());
    ce(E, (b) => {
      R.state.tab = (b == null ? void 0 : b.key) ?? "";
    }, { immediate: !0 }), Se(() => {
      R.state.tab = "";
    }), ce(W, (b) => {
      b.some((m) => {
        var r;
        return m.key === ((r = E.value) == null ? void 0 : r.key);
      }) || (E.value = b[0]);
    }), ce(() => o.open, (b) => {
      b && (E.value = V());
    });
    const Z = Object.fromEntries(R.tabs.filter((b) => b.component).map((b) => [b.key, Xe(() => it(b.component))])), G = z(!1), { data: Q } = R.props.tool, se = u(() => {
      var b;
      return ((b = Q.value) == null ? void 0 : b.tool) ?? "";
    }), F = u(() => {
      var b;
      return ((b = Q.value) == null ? void 0 : b.note) ?? "";
    }), Y = u(() => o.row.role !== "main" && (!o.row.ended_at || o.stoppedWithWork || o.waitReason));
    async function $() {
      !o.open || !Y.value || (R.state["tool.agent"] = String(o.row.number), await R.reload("tool"));
    }
    const c = dt($, ut.agentCommand), K = R.follow(["hook_call.*", "process_part.*"], (b) => ct(b, "session_agent_id", /* @__PURE__ */ new Set([o.row.id])) && c());
    return Se(() => K == null ? void 0 : K()), ce(() => o.open, (b) => {
      b && $();
    }, { immediate: !0 }), (b, m) => {
      var r;
      return a(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: m[2] || (m[2] = ne(() => {
        }, ["stop"]))
      }, [
        v(sa, { row: e.row }, null, 8, ["row"]),
        e.row.retirement_reason ? (a(), s("p", va, "Retirement reason: " + g(e.row.retirement_reason), 1)) : h("", !0),
        l.value ? (a(), s("p", ma, g(l.value), 1)) : h("", !0),
        v(i(gt), {
          class: "agent-tabs",
          tabs: W.value,
          active: E.value,
          answer: { tasks: e.tasks.length, reports: e.row.report_count ?? i(I).length, memories: e.row.memory_count ?? 0 },
          onChoose: m[0] || (m[0] = (B) => E.value = B)
        }, null, 8, ["tabs", "active", "answer"]),
        v(i(vt), {
          class: "agent-tab-body",
          tab: E.value,
          "data-agent-tab-body": (r = E.value) == null ? void 0 : r.key
        }, {
          default: f(() => {
            var B;
            return [
              v(i(Je), {
                value: (B = E.value) == null ? void 0 : B.key
              }, et({
                reports: f(() => [
                  i(I).length ? h("", !0) : (a(), N(i(Ne), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: f(() => [...m[3] || (m[3] = [
                      p("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (a(!0), s(D, null, le(i(I), (M) => (a(), s("button", {
                    key: M.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${M.id}`,
                    onClick: (x) => i(Ae)(`messages:${M.id}`)
                  }, g(M.text), 9, pa))), 128))
                ]),
                tasks: f(() => {
                  var M;
                  return [
                    e.tasks.length ? h("", !0) : (a(), N(i(Ne), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: f(() => [...m[4] || (m[4] = [
                        p("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (a(!0), s(D, null, le(d.value, (x) => (a(), N(ga, {
                      key: x.state,
                      section: x,
                      open: S(x.state),
                      onToggle: (ee) => T(x.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (M = e.facts) != null && M.instruction ? (a(), s(D, { key: 1 }, [
                      m[5] || (m[5] = w("p", { class: "agent-label" }, "Instruction", -1)),
                      w("div", ha, g(e.facts.instruction), 1)
                    ], 64)) : h("", !0)
                  ];
                }),
                transcript: f(() => {
                  var M;
                  return [
                    q.value ? (a(), s(D, { key: 0 }, [
                      (M = e.facts) != null && M.instruction ? (a(), s("div", fa, [
                        v(i(Ke), {
                          label: "Instruction",
                          open: G.value,
                          "data-agent-section": "instruction",
                          onToggle: m[1] || (m[1] = (x) => G.value = !G.value)
                        }, {
                          default: f(() => [
                            w("div", ba, g(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (a(), s("p", ka, "No job recorded")) : h("", !0)
                    ], 64)) : h("", !0),
                    v(xt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                le(i(Z), (M, x) => ({
                  name: x,
                  fn: f(() => [
                    (a(), N(tt(M), {
                      agent: e.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ];
          }),
          _: 1
        }, 8, ["tab", "data-agent-tab-body"]),
        Y.value ? (a(), N(ea, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: se.value,
          note: F.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : h("", !0)
      ]);
    };
  }
}, Ma = /* @__PURE__ */ J(wa, [["__scopeId", "data-v-fabbecdf"]]), $a = { class: "line" }, xa = {
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
    return (n, k) => (a(), N(i($e), {
      as: "button",
      place: "corner",
      class: de(["agent-dot", { pulse: l.value }]),
      "data-state": e.state,
      "aria-label": d.value,
      "data-agent-status": "",
      onClick: k[0] || (k[0] = ne(() => {
      }, ["stop"]))
    }, {
      tip: f(() => [
        w("b", $a, g(e.doing), 1),
        e.since ? (a(), s("span", xa, g(e.since), 1)) : h("", !0),
        e.seen ? (a(), s("span", Sa, g(e.seen), 1)) : h("", !0)
      ]),
      default: f(() => [
        k[1] || (k[1] = w("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, Aa = /* @__PURE__ */ J(Ca, [["__scopeId", "data-v-1a0bc478"]]), Ta = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, ja = (e) => e.filter((o) => o.state !== "cancelled"), Ue = (e, o) => e.filter((t) => t.state === o).length, La = 5, Ra = (e, o) => e || o.split(/\s+/).slice(0, La).join(" ");
function Ba({ tasks: e, inHand: o, perHour: t }) {
  const l = ja(e), d = Ue(l, "completed"), n = Ta[o == null ? void 0 : o.state], k = l.filter((I) => I.state === "started").map((I) => ({ number: I.id, title: I.title })), S = Math.max(k.length, o && o.state !== "completed" ? 1 : 0), T = l.length - d - S, R = d === l.length;
  return {
    number: o.id,
    title: o.title,
    started: k,
    plan: o.plan_id ?? 0,
    count: `${d} of ${l.length}`,
    taskTip: `${d} of its ${l.length} tasks done${n ? `. This one is ${n.words}.` : "."}`,
    countTip: R ? `All ${l.length} tasks done` : `${d} done, ${S} in hand, ${T} to go`,
    paceTip: !R && t ? `About ${t} an hour.` : "",
    rate: !R && t ? `${Math.round(t)}/hour` : "",
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
}, za = {
  key: 0,
  class: "tasks",
  "data-agent-tasks": ""
}, Ha = {
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
      v(i($e), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: f(() => [
          w("b", null, g(e.job), 1)
        ]),
        default: f(() => [
          p(g(i(Ra)(e.jobTitle, e.job)), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (a(), s("span", Oa, g(e.jobLaunch), 1)) : h("", !0)
    ])) : t.value ? (a(), s(D, { key: 1 }, [
      w("span", Va, [
        t.value.started.length > 1 ? (a(), s("span", za, [
          d[1] || (d[1] = p("Tasks ", -1)),
          (a(!0), s(D, null, le(t.value.started, (n, k) => (a(), s(D, {
            key: n.number
          }, [
            k ? (a(), s(D, { key: 0 }, [
              p(", ")
            ], 64)) : h("", !0),
            v(i($e), {
              as: "button",
              class: "task",
              "data-agent-task": "",
              "data-peek": `tasks:${n.number}`,
              "aria-label": `Task ${n.number}: ${n.title}`,
              onClick: ne((S) => i(Ae)(`tasks:${n.number}`), ["stop"])
            }, {
              tip: f(() => [
                w("b", null, g(n.title), 1)
              ]),
              default: f(() => [
                p(g(n.number), 1)
              ]),
              _: 2
            }, 1032, ["data-peek", "aria-label", "onClick"])
          ], 64))), 128))
        ])) : (a(), N(i($e), {
          key: 1,
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${t.value.number}`,
          "aria-label": `Task ${t.value.number}: ${t.value.title}`,
          onClick: d[0] || (d[0] = ne((n) => i(Ae)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: f(() => [
            w("b", null, g(t.value.title), 1),
            w("span", null, g(t.value.taskTip), 1)
          ]),
          default: f(() => [
            p("Task " + g(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])),
        t.value.plan ? (a(), s("span", Ha, "Plan " + g(t.value.plan), 1)) : h("", !0),
        t.value.rate ? (a(), s("span", Ea, g(t.value.rate), 1)) : h("", !0),
        v(i($e), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: f(() => [
            w("b", null, g(t.value.countTip), 1),
            t.value.paceTip ? (a(), s("span", Na, g(t.value.paceTip), 1)) : h("", !0)
          ]),
          default: f(() => [
            p(g(t.value.count), 1)
          ]),
          _: 1
        })
      ]),
      v(i(mt), {
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: t.value.bar.total,
        done: t.value.bar.done,
        testing: t.value.bar.testing
      }, null, 8, ["total", "done", "testing"])
    ], 64)) : h("", !0);
  }
}, Da = /* @__PURE__ */ J(Wa, [["__scopeId", "data-v-e51f5781"]]), qa = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Fa = ["data-icon", "stroke-width", "innerHTML"], ae = {
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
    return (n, k) => (a(), s("svg", {
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
      class: de(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), s("span", Ua, g(e.checked ? "✓" : ""), 1)) : h("", !0),
      e.description ? (a(), s("span", Pa, [
        w("span", null, [
          Ce(o.$slots, "default", {}, void 0, !0)
        ]),
        w("small", null, g(e.description), 1)
      ])) : Ce(o.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, fe = /* @__PURE__ */ J(Ga, [["__scopeId", "data-v-fec99974"]]), Ja = {}, Ka = { class: "menu-label" };
function Za(e, o) {
  return a(), s("span", Ka, [
    Ce(e.$slots, "default", {}, void 0, !0)
  ]);
}
const xe = /* @__PURE__ */ J(Ja, [["render", Za], ["__scopeId", "data-v-aa955b3e"]]), Ya = {
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
    const t = e, l = o, d = u(() => t.skills.filter((k) => k.state === "loaded")), n = u(() => t.skills.filter((k) => k.state !== "loaded"));
    return (k, S) => (a(), s("div", Ya, [
      v(xe, null, {
        default: f(() => [...S[1] || (S[1] = [
          p("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      d.value.length ? h("", !0) : (a(), s("p", _a, "None yet. Compacting the conversation empties this list.")),
      (a(!0), s(D, null, le(d.value, (T) => (a(), s("p", {
        key: T.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        v(ae, {
          name: "book",
          size: 12
        }),
        p(g(T.skill), 1)
      ]))), 128)),
      n.value.length ? (a(), s(D, { key: 1 }, [
        v(xe, null, {
          default: f(() => [...S[2] || (S[2] = [
            p("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), s(D, null, le(n.value, (T) => (a(), s("p", {
          key: T.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          v(ae, {
            name: "book",
            size: 12
          }),
          p(g(T.skill), 1)
        ]))), 128))
      ], 64)) : h("", !0),
      v(fe, {
        "data-agent-skills-browse": "",
        onClick: S[0] || (S[0] = (T) => l("browse"))
      }, {
        default: f(() => [...S[3] || (S[3] = [
          p("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, Xa = /* @__PURE__ */ J(Qa, [["__scopeId", "data-v-be514d47"]]), en = ["disabled", "title"], tn = { class: "gauge usage" }, an = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: o }) {
    const t = e, l = o, d = u(() => t.windows[0] ?? null), n = u(() => d.value && Number.isFinite(d.value.used_percent) ? Math.max(0, Math.min(100, Math.round(d.value.used_percent))) : null), k = u(() => n.value !== null && n.value >= 100), S = u(() => {
      var R;
      return (R = d.value) != null && R.reset_epoch_seconds ? new Date(d.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), T = u(() => k.value ? `At usage limit: the plan's ${d.value.title} allowance is used up${S.value ? `, starts again ${S.value}` : ""}` : `${n.value}% of the plan's ${d.value.title} allowance used${S.value ? `, starts again ${S.value}` : ""}`);
    return (R, I) => n.value !== null ? (a(), s("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: T.value,
      onClick: I[0] || (I[0] = (q) => l("open", q.currentTarget))
    }, [
      v(ae, {
        name: "allowance",
        size: 12
      }),
      I[1] || (I[1] = p()),
      w("span", tn, [
        w("span", {
          style: Ie({ width: `${n.value}%` })
        }, null, 4)
      ]),
      p(" " + g(k.value ? "At usage limit" : `${n.value}%`), 1)
    ], 8, en)) : h("", !0);
  }
}, nn = /* @__PURE__ */ J(an, [["__scopeId", "data-v-a36f09dc"]]), on = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (o, t) => (a(), s("span", {
      class: de(["badge", e.tone])
    }, g(e.text), 3));
  }
}, ln = /* @__PURE__ */ J(on, [["__scopeId", "data-v-9e7e1157"]]), sn = (e, o, t) => Math.max(o, Math.min(t, e)), Ye = /* @__PURE__ */ new WeakMap(), rn = (e, o) => Ye.set(e, o);
function dn(e, o) {
  for (let t = o; t; t = Ye.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function un(e, o) {
  const t = (l) => {
    var n, k;
    const d = ((n = e.value) == null ? void 0 : n.element) || ((k = e.value) == null ? void 0 : k.$el) || e.value;
    d && !dn(d, l.target) && o(l);
  };
  window.addEventListener("click", t), Se(() => window.removeEventListener("click", t));
}
const he = 8, cn = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const l = e, d = z(null), n = (r) => r ? `${r}px` : void 0, k = u(() => ({
      minWidth: n(l.minWidth),
      maxWidth: n(l.maxWidth),
      maxHeight: n(l.maxHeight),
      height: n(l.height)
    })), S = z({ w: 0, h: 0 }), T = z(l.anchor ? l.anchor.getBoundingClientRect() : null), R = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), I = (r) => ({
      left: Math.max(0, r.left),
      top: Math.max(0, r.top),
      right: Math.min(window.innerWidth, r.right),
      bottom: Math.min(window.innerHeight, r.bottom)
    }), q = (r) => {
      const B = r.closest(".pane, .float-window");
      return B ? I(B.getBoundingClientRect()) : R();
    }, O = (r, B) => `${Math.max(0, r ? Math.min(r, B) : B)}px`;
    function W(r, B) {
      return {
        below: r.bottom - B.bottom - l.gap - he,
        above: B.top - r.top - l.gap - he,
        across: r.right - r.left - 2 * he
      };
    }
    function j(r) {
      const B = q(l.anchor), M = W(B, r);
      return S.value.w <= M.across && S.value.h <= Math.max(M.below, M.above) ? B : R();
    }
    const V = u(() => {
      if (!T.value) return k.value;
      const r = T.value, B = j(r), M = W(B, r), { w: x, h: ee } = S.value, U = l.align === "auto" ? r.left + r.right > B.left + B.right : l.align === "right", be = sn(U ? r.right - x : r.left, B.left + he, Math.max(B.left + he, B.right - x - he)), X = ee > M.below && M.above > M.below ? { bottom: `${window.innerHeight - r.top + l.gap}px`, maxHeight: O(l.maxHeight, M.above) } : { top: `${r.bottom + l.gap}px`, maxHeight: O(l.maxHeight, M.below) };
      return { ...k.value, ...X, left: `${be}px`, maxWidth: O(l.maxWidth, M.across) };
    }), E = t, Z = () => [...d.value.querySelectorAll("button:not(:disabled)")];
    function G(r) {
      const B = Z(), M = B.indexOf(document.activeElement);
      B[(M + r + B.length) % B.length].focus();
    }
    const Q = { ArrowDown: () => G(1), ArrowUp: () => G(-1), Escape: () => E("close") }, se = (r) => Q[r.key] && (r.preventDefault(), Q[r.key]()), F = () => d.value && (S.value = { w: d.value.offsetWidth, h: d.value.scrollHeight });
    let Y = 0;
    const $ = new ResizeObserver(() => {
      cancelAnimationFrame(Y), Y = requestAnimationFrame(F);
    });
    un(d, (r) => l.anchor && !l.anchor.contains(r.target) && E("close"));
    const c = (r, B) => ["top", "left", "right", "bottom"].some((M) => Math.abs(r[M] - B[M]) > 1), K = (r) => r.bottom < 0 || r.top > window.innerHeight;
    let b = 0;
    function m() {
      if (l.anchor) {
        const r = l.anchor.getBoundingClientRect();
        if (!l.anchor.isConnected || K(r)) return E("close");
        c(r, T.value) && (T.value = r);
      }
      b = requestAnimationFrame(m);
    }
    return at(() => {
      l.anchor && d.value && rn(d.value, l.anchor), F(), d.value && $.observe(d.value), !l.plain && Z()[0] && Z()[0].focus(), m();
    }), Se(() => {
      $.disconnect(), cancelAnimationFrame(b), cancelAnimationFrame(Y);
    }), o({ element: d }), (r, B) => (a(), N(nt, {
      to: "body",
      disabled: !e.anchor
    }, [
      w("div", ot({
        ref_key: "panel",
        ref: d
      }, r.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: V.value,
        onKeydown: se
      }), [
        Ce(r.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), gn = /* @__PURE__ */ J(cn, [["__scopeId", "data-v-3d203970"]]);
async function vn(e, o, t) {
  if (!e) return t(o);
  const { target: l, fields: d } = e, n = Object.fromEntries(Object.keys(d).map((T) => [T, l[T]])), k = () => Object.assign(l, n);
  Object.assign(l, d);
  let S = !1;
  try {
    const T = await t(o);
    return S = T.ok, T;
  } finally {
    S || k();
  }
}
function mn(e, o, t, { groups: l, programs: d }) {
  const n = z({}), k = z(""), S = z(!1), T = u(() => !!e.value && !e.value.ended_at), R = u(() => T.value && !!e.value.paused_at);
  async function I(j, V = null) {
    k.value = "";
    const E = await vn(V, j, o);
    return k.value = E.ok ? "" : E.error, t(), E;
  }
  return { groups: l, programs: d, chosen: n, failure: k, asking: S, running: T, paused: R, choose: (j, V) => I(["agent", "control", String(e.value.number), j, V.value], { target: n, fields: { value: { ...n.value, [j]: V.label } } }), stop: () => (S.value = !1, I(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (j) => I(["agent", "launch", j.name]) };
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
}, Cn = ["title"], An = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Tn = {
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
    const t = e, l = o, d = mn(Ve(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => l("changed"), { groups: Ve(t, "controlGroups"), programs: Ve(t, "agentPrograms") }), n = z(null), k = z(""), S = u(() => d.groups.value.find(($) => $.key === k.value));
    function T($, c) {
      n.value = $.currentTarget, k.value = c;
    }
    function R() {
      n.value = null, k.value = "", d.asking.value = !1;
    }
    const I = u(() => t.skills.filter(($) => $.state === "loaded"));
    function q($) {
      T($, "skills"), l("skills");
    }
    const O = ($) => d.groups.value.some((c) => c.key === $), W = u(() => {
      var $;
      return d.chosen.value.model ?? (($ = V.value) == null ? void 0 : $.model) ?? "";
    }), j = u(() => {
      var $;
      return d.chosen.value.effort ?? (($ = V.value) == null ? void 0 : $.effort) ?? "";
    });
    u(() => !!t.agent && !t.agent.ended_at);
    const V = u(() => {
      var $;
      return (($ = t.usage.agents) == null ? void 0 : $.find((c) => {
        var K;
        return c.id === ((K = t.agent) == null ? void 0 : K.id);
      })) ?? null;
    }), E = u(() => {
      var $;
      return (($ = V.value) == null ? void 0 : $.context_percent) == null ? null : Math.round(V.value.context_percent);
    }), Z = u(() => {
      var $;
      return fn((($ = V.value) == null ? void 0 : $.context_change) ?? null);
    }), G = ($) => `${Math.round($ / 1e3)}k`, Q = u(() => {
      var $;
      return !!(($ = V.value) != null && $.context_limit_tokens);
    }), se = u(() => {
      var $, c;
      return (($ = V.value) == null ? void 0 : $.context_limit_tokens) || ((c = V.value) == null ? void 0 : c.context_window_tokens) || 0;
    }), F = u(() => se.value ? `${G(V.value.context_tokens ?? 0)} of ${G(se.value)}` : ""), Y = u(() => {
      var $;
      return ($ = V.value) != null && $.cost_dollars ? `$${V.value.cost_dollars.toFixed(2)}` : "";
    });
    return ($, c) => {
      var K, b;
      return a(), s("div", {
        class: de(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (a(), s(D, { key: 0 }, [
          w("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: c[0] || (c[0] = (m) => T(m, "agent"))
          }, [
            v(ae, {
              name: "agents",
              size: 12
            }),
            p(" " + g(((K = e.agentPrograms.find((m) => m.name === e.agent.program)) == null ? void 0 : K.title) || e.agent.program), 1)
          ], 8, bn),
          v(nn, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: c[1] || (c[1] = (m) => l("open", "usage", m))
          }, null, 8, ["windows", "disabled"]),
          E.value !== null ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${E.value}% full: clear or compact it`,
            onClick: c[2] || (c[2] = (m) => O("context") ? T(m, "context") : l("open", "context", m.currentTarget))
          }, [
            v(ae, {
              name: "gauge",
              size: 12
            }),
            c[14] || (c[14] = p()),
            w("span", yn, [
              w("span", {
                style: Ie({ width: `${E.value}%` })
              }, null, 4)
            ]),
            p(" " + g(E.value) + "% ", 1)
          ], 8, kn)) : (b = V.value) != null && b.context_unknown ? (a(), s("span", wn, [
            v(ae, {
              name: "gauge",
              size: 12
            }),
            c[15] || (c[15] = p(" Context: unknown", -1))
          ])) : h("", !0),
          W.value ? (a(), s("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${W.value}: change the model`,
            onClick: c[3] || (c[3] = (m) => O("model") ? T(m, "model") : null)
          }, [
            v(ae, {
              name: "model",
              size: 12
            }),
            p(" " + g(W.value), 1)
          ], 8, Mn)) : h("", !0),
          O("effort") || e.card && j.value ? (a(), s("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: c[4] || (c[4] = (m) => T(m, "effort"))
          }, [
            v(ae, {
              name: "bolt",
              size: 12
            }),
            p(" " + g(j.value), 1)
          ], 8, $n)) : h("", !0),
          Y.value ? (a(), s("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: c[5] || (c[5] = (m) => l("open", "cost", m.currentTarget))
          }, g(Y.value), 9, xn)) : h("", !0),
          e.branch ? (a(), s("span", Sn, [
            v(ae, {
              name: "branch",
              size: 12
            }),
            p(" " + g(e.branch), 1)
          ])) : h("", !0),
          e.card ? h("", !0) : (a(), s("button", {
            key: 6,
            type: "button",
            class: de(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: c[6] || (c[6] = (m) => l("open", "jobs", m.currentTarget))
          }, [
            v(ae, {
              name: "clock",
              size: 12
            }),
            p(" " + g(e.jobs), 1)
          ], 2)),
          e.run ? (a(), s("button", {
            key: 7,
            type: "button",
            class: "fact",
            "data-fact": "skills",
            title: "View skills read by this agent",
            onClick: q
          }, [
            v(ae, {
              name: "book",
              size: 12
            }),
            p(" " + g(I.value.length), 1)
          ])) : h("", !0),
          e.fitness ? (a(), s(D, { key: 8 }, [
            w("button", {
              type: "button",
              class: de(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < In }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: c[7] || (c[7] = (m) => l("open", "fitness", m.currentTarget))
            }, [
              v(ae, {
                name: "heart",
                size: 12
              }),
              p(" " + g(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            w("button", {
              type: "button",
              class: de(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: c[8] || (c[8] = (m) => l("open", "load", m.currentTarget))
            }, [
              v(ae, {
                name: "weight",
                size: 12
              }),
              p(" " + g(e.fitness.workload), 1)
            ], 2)
          ], 64)) : h("", !0)
        ], 64)) : e.run && !e.loading ? (a(), s("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: c[9] || (c[9] = (m) => T(m, "start"))
        }, [
          v(ae, {
            name: "agents",
            size: 12
          }),
          c[16] || (c[16] = p(" Start an agent", -1))
        ])) : h("", !0),
        c[22] || (c[22] = w("span", { class: "space" }, null, -1)),
        i(d).failure.value ? (a(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: i(d).failure.value
        }, g(i(d).failure.value), 9, Cn)) : h("", !0),
        Ce($.$slots, "default", {}, void 0, !0),
        n.value ? (a(), N(gn, {
          key: 3,
          anchor: n.value,
          "min-width": 190,
          onClose: R
        }, {
          default: f(() => {
            var m;
            return [
              k.value === "agent" ? (a(), s(D, { key: 0 }, [
                i(d).asking.value ? (a(), s(D, { key: 0 }, [
                  v(xe, { "data-agent-stop-ask": "" }, {
                    default: f(() => [...c[17] || (c[17] = [
                      p("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  v(fe, {
                    "data-agent-stop-confirm": "",
                    onClick: c[10] || (c[10] = (r) => (R(), i(d).stop()))
                  }, {
                    default: f(() => [...c[18] || (c[18] = [
                      p("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  v(fe, {
                    onClick: c[11] || (c[11] = (r) => i(d).asking.value = !1)
                  }, {
                    default: f(() => [...c[19] || (c[19] = [
                      p("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (a(), N(fe, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: c[12] || (c[12] = (r) => i(d).asking.value = !0)
                }, {
                  default: f(() => [...c[20] || (c[20] = [
                    p("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : k.value === "start" ? (a(), s(D, { key: 1 }, [
                v(xe, null, {
                  default: f(() => [...c[21] || (c[21] = [
                    p("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (a(!0), s(D, null, le(i(d).programs.value, (r) => (a(), N(fe, {
                  key: r.name,
                  "data-agent-program": r.name,
                  onClick: (B) => (R(), i(d).start(r))
                }, {
                  default: f(() => [
                    p(g(r.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : k.value === "skills" ? (a(), N(Xa, {
                key: 2,
                skills: e.skills,
                onBrowse: c[13] || (c[13] = (r) => (R(), l("open", "skills", null)))
              }, null, 8, ["skills"])) : S.value ? (a(), s(D, { key: 3 }, [
                v(xe, null, {
                  default: f(() => [
                    p(g(S.value.label), 1)
                  ]),
                  _: 1
                }),
                k.value === "context" ? (a(), s(D, { key: 0 }, [
                  w("p", An, g(i(pn)(((m = V.value) == null ? void 0 : m.last_compaction) ?? null)), 1),
                  w("div", Tn, [
                    w("span", jn, [
                      w("span", {
                        style: Ie({ width: `${E.value}%` })
                      }, null, 4)
                    ]),
                    w("span", Ln, g(E.value) + "%", 1)
                  ]),
                  F.value ? (a(), s("p", Rn, [
                    p(g(F.value) + " ", 1),
                    Q.value ? (a(), N(ln, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : h("", !0)
                  ])) : h("", !0)
                ], 64)) : h("", !0),
                k.value === "context" && Z.value ? (a(), s("p", Bn, g(Z.value), 1)) : (a(!0), s(D, { key: 2 }, le(S.value.choices, (r) => (a(), N(fe, {
                  key: r.value,
                  "data-agent-choice": r.value,
                  onClick: (B) => (i(d).choose(S.value.key, r), R())
                }, {
                  default: f(() => [
                    p(g(r.label), 1)
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
}, Vn = /* @__PURE__ */ J(On, [["__scopeId", "data-v-d7113347"]]), zn = ["data-agent-open", "aria-expanded", "role", "tabindex"], Hn = {
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
  class: "agent-menu",
  "data-agent-menu-panel": ""
}, Fn = {
  key: 1,
  class: "agent-line"
}, Un = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Pn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, Gn = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, Jn = {
  class: "agent-live-fact",
  "data-agent-motion": "",
  "data-agent-run-time": "",
  title: "How long this session has run"
}, Kn = {
  key: 1,
  class: "agent-live-fact",
  "data-agent-last-heard": ""
}, Zn = {
  key: 3,
  class: "agent-unit",
  "data-agent-unit": ""
}, Yn = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), l = { helper: "Helper", reviewer: "Reviewer", main: "Main agent" }, d = { running: "Working", starting: "Starting", stopping: "Stopping", ended: "Idle: its process has stopped", failed: "Could not start", never_started: "Not started" }, n = e, k = o, S = Ze(), T = z(!1), R = u(() => {
      var L, _;
      if ((L = n.facts) != null && L.profile_title) return n.facts.profile_title;
      if ((_ = n.facts) != null && _.profile) return n.facts.profile;
      const y = l[n.row.role] || n.row.role;
      return y.slice(0, 1).toUpperCase() + y.slice(1);
    }), I = u(() => {
      var y;
      return ((y = n.facts) == null ? void 0 : y.tasks) ?? [];
    }), q = u(() => I.value.filter((y) => y.state === "open")), O = u(() => I.value.find((y) => {
      var L;
      return y.id === ((L = n.progress) == null ? void 0 : L.task_id) && y.state === "started";
    })), W = u(() => O.value || I.value.find((y) => {
      var L;
      return y.id === ((L = n.facts) == null ? void 0 : L.task_id);
    }) || I.value.find((y) => t.has(y.state)) || q.value[0] || I.value.at(-1)), j = u(() => {
      var y, L, _, ge, ue, te;
      return n.row.role === "helper" ? ((y = n.facts) == null ? void 0 : y.helper_job) || "" : (L = n.facts) != null && L.job_enabled && (((_ = O.value) == null ? void 0 : _.title) || ((ge = n.facts) == null ? void 0 : ge.task_title) || ((ue = q.value[0]) == null ? void 0 : ue.title) || ((te = I.value.at(-1)) == null ? void 0 : te.title)) || "";
    }), V = u(() => `${n.row.role} ${n.row.number}`), E = u(() => {
      var y, L;
      return [n.row.program, (y = n.facts) == null ? void 0 : y.model, (L = n.facts) == null ? void 0 : L.effort, V.value].filter(Boolean).join(" · ");
    }), Z = u(() => n.row.role === "main" ? R.value : `${R.value} ${n.row.number}`), G = Oe(), Q = u(() => pt(n.row.process_started_at || n.row.created_at, S.value)), se = /* @__PURE__ */ new Set(["open", "started", "testing"]), F = { fresh: "new conversation", resumed: "resumed" }, Y = u(() => {
      var y, L;
      return [(y = n.facts) == null ? void 0 : y.helper_job_program, F[(L = n.facts) == null ? void 0 : L.occupant_launch]].filter(Boolean).join(", ");
    }), $ = u(() => {
      var y;
      return (y = n.facts) == null ? void 0 : y.work_status;
    }), c = u(() => !!n.row.ended_at && n.row.role !== "main" && I.value.some((y) => se.has(y.state))), K = u(() => {
      var y, L;
      return n.row.state === "running" && ((y = n.facts) == null ? void 0 : y.state) === "at usage limit" && !!((L = n.facts) != null && L.usage_limit_ends_at);
    }), b = (y) => new Date(y).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), m = u(() => n.row.halted_at ? `Stopped at the usage limit since ${b(n.row.halted_at)}, goes on at ${b(n.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(n.facts.usage_limit_ends_at).toLocaleString()}`), r = u(() => {
      var y;
      return n.row.retired_at || n.row.state === "retired" ? "retired" : K.value || $.value || n.waitReason || c.value ? "waiting" : n.row.state === "running" && ((y = n.facts) == null ? void 0 : y.state) || n.row.state;
    }), B = u(() => {
      var y;
      return K.value ? m.value : $.value ? `Status: ${$.value}` : n.waitReason ? `Waiting: ${n.waitReason}` : r.value === "blocked" ? (y = n.facts) != null && y.blocked_reason ? `Blocked: ${n.facts.blocked_reason}` : "Blocked" : c.value ? "Stopped with work left" : "";
    }), M = u(() => {
      var y;
      return ((y = n.progress) == null ? void 0 : y.completed_count) ?? I.value.filter((L) => L.state === "completed").length;
    }), x = u(() => {
      var y;
      return ht(M.value, ((y = n.progress) == null ? void 0 : y.started_at) || n.row.created_at, n.progress ? n.progress.finished_at : n.row.ended_at, S.value);
    }), ee = u(() => n.row.role === "main" ? 0 : x.value), U = u(() => !!n.row.retired_at || n.row.state === "retired"), be = u(() => U.value ? "Retired" : r.value === "blocked" || r.value === "waiting" ? B.value || (r.value === "blocked" ? "Blocked" : "Waiting") : d[n.row.standing]), ke = u(() => {
      var L;
      if (U.value) return n.row.retired_at;
      const y = r.value === "blocked" || r.value === "waiting";
      return n.row.ended_at || y && ((L = n.facts) == null ? void 0 : L.last_activity) || n.row.process_started_at || n.row.created_at;
    }), X = u(() => ft(ke.value, S.value)), Te = u(() => {
      var y;
      return bt((y = n.facts) == null ? void 0 : y.last_activity, S.value);
    });
    return (y, L) => {
      var _, ge, ue, te, ye, je, we;
      return a(), s("div", {
        class: de(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: L[2] || (L[2] = (re) => !e.open && k("toggle")),
        onKeydown: [
          L[3] || (L[3] = qe(ne((re) => !e.open && k("toggle"), ["self", "prevent"]), ["enter"])),
          L[4] || (L[4] = qe(ne((re) => !e.open && k("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        w("div", Hn, [
          e.open ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back",
            "aria-label": "Back",
            onClick: L[0] || (L[0] = ne((re) => k("toggle"), ["stop"]))
          }, [
            v(i(Ee), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : h("", !0),
          e.open ? (a(), s(D, { key: 1 }, [
            w("span", En, g(Z.value), 1),
            w("span", Nn, g(((_ = e.facts) == null ? void 0 : _.given_name) || e.row.id), 1),
            v(i(oe), {
              variant: "ghost",
              small: "",
              class: "agent-menu-button",
              "data-agent-menu": "",
              "aria-expanded": T.value,
              onClick: L[1] || (L[1] = ne((re) => T.value = !T.value, ["stop"]))
            }, {
              default: f(() => [...L[5] || (L[5] = [
                p("Actions", -1)
              ])]),
              _: 1
            }, 8, ["aria-expanded"])
          ], 64)) : (a(), s(D, { key: 2 }, [
            v(i(kt), {
              "agent-id": e.row.id,
              label: R.value,
              class: "agent-who"
            }, {
              default: f(() => {
                var re;
                return [
                  w("span", Wn, g(R.value), 1),
                  w("span", Dn, g(((re = e.facts) == null ? void 0 : re.given_name) || e.row.id), 1)
                ];
              }),
              _: 1
            }, 8, ["agent-id", "label"]),
            v(i(Ee), {
              class: "agent-chevron",
              name: "chevronRight",
              size: 12
            })
          ], 64))
        ]),
        e.open && T.value ? (a(), s("div", qn, [
          v(Yt, { row: e.row }, null, 8, ["row"])
        ])) : h("", !0),
        e.open ? h("", !0) : (a(), s("span", Fn, [
          w("span", Un, g(E.value), 1),
          (ge = e.facts) != null && ge.sandbox_off ? (a(), s("span", Pn, "sandbox off")) : h("", !0)
        ])),
        e.open && !U.value ? (a(), N(Vn, {
          key: 2,
          class: "agent-live",
          "agent-programs": i(G).props.programs.rows.value,
          agent: e.row,
          branch: (ue = e.progress) == null ? void 0 : ue.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((te = e.facts) == null ? void 0 : te.windows) ?? [] },
          card: ""
        }, {
          default: f(() => {
            var re, Me;
            return [
              (re = e.facts) != null && re.sandbox_off ? (a(), s("span", Gn, "sandbox off")) : h("", !0),
              w("span", Jn, "Run time: " + g(Q.value), 1),
              (Me = e.facts) != null && Me.last_activity ? (a(), s("span", Kn, [
                L[6] || (L[6] = p("Seen: ", -1)),
                v(i(We), {
                  at: e.facts.last_activity
                }, null, 8, ["at"])
              ])) : h("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : h("", !0),
        (ye = e.facts) != null && ye.unit_name ? (a(), s("div", Zn, "Unit: " + g(e.facts.unit_name), 1)) : h("", !0),
        e.open ? h("", !0) : (a(), N(Da, {
          key: 4,
          tasks: I.value,
          "in-hand": e.row.role !== "helper" && ((je = e.facts) != null && je.job_enabled) && W.value || null,
          job: e.row.role === "helper" ? j.value : "",
          "job-title": e.row.role === "helper" && ((we = e.facts) == null ? void 0 : we.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? Y.value : "",
          "per-hour": ee.value
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour"])),
        v(Aa, {
          state: r.value,
          doing: be.value,
          since: X.value,
          seen: Te.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (a(), N(Ma, {
          key: 5,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: I.value,
          "stopped-with-work": c.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : h("", !0)
      ], 42, zn);
    };
  }
}, _n = /* @__PURE__ */ J(Yn, [["__scopeId", "data-v-cc3c2f9a"]]), Qn = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Xn = ["data-agent-row", "data-agent-lingering"], Pe = "journal.agents.filters", Ge = 300 * 1e3, Be = "cubic-bezier(0.2, 0.9, 0.25, 1)", eo = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const o = e, t = Oe(), { rows: l } = t.props.waits, { rows: d } = t.props.progress, { rows: n, failure: k, loaded: S, more: T } = t.props.agents, R = (A) => d.value.find((H) => H.agent_id === A.id) ?? null, I = (A) => {
      var H;
      return ((H = l.value.find((C) => C.agent_id === A.id)) == null ? void 0 : H.reason) ?? "";
    }, q = z("running"), O = z(""), W = JSON.parse(localStorage.getItem(Pe) || '{"roles":[],"profiles":[],"programs":[]}'), j = z(W), V = u(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: E } = t.props.programs, Z = u(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), G = (A, H) => {
      j.value = $t(j.value, A, H);
    }, Q = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, se = (A) => A.slice(0, 1).toUpperCase() + A.slice(1);
    ce(j, (A) => localStorage.setItem(Pe, JSON.stringify(A)));
    const F = z(25);
    function Y() {
      Object.assign(t.state, {
        "agents.show": q.value,
        "agents.search": O.value,
        "agents.limit": String(F.value),
        "agents.roles": j.value.roles.join(","),
        "agents.profiles": j.value.profiles.join(","),
        "agents.programs": j.value.programs.join(",")
      });
    }
    async function $() {
      return F.value += 25, Y(), await t.reload("agents"), !0;
    }
    ce([q, O, j], () => {
      F.value = 25, Y(), t.reload("agents");
    }), Y();
    const c = (A) => A.facts ?? null, K = n, b = Ze(), m = z([]), r = u(() => new Set(m.value.filter((A) => b.value - A.left < Ge).map((A) => A.row.id))), B = u(() => m.value.filter((A) => r.value.has(A.row.id)).map((A) => A.row)), M = u(() => [...K.value, ...B.value]);
    let x = "", ee = [];
    async function U(A) {
      await t.reload(`card.${A.id}`);
      const H = t.props[`card.${A.id}`].rows.value.find((C) => C.id === A.id);
      H != null && H.ended_at && !m.value.some((C) => C.row.id === A.id) && (m.value = [...m.value, { row: H, left: Date.now() }]);
    }
    ce(n, (A) => {
      const H = x === `${q.value}|${O.value}|${JSON.stringify(j.value)}` && q.value === "running", C = H ? ee.filter((P) => !A.some((ve) => ve.id === P.id)) : [];
      x = `${q.value}|${O.value}|${JSON.stringify(j.value)}`, ee = A, m.value = H ? m.value.filter((P) => b.value - P.left < Ge && !A.some((ve) => ve.id === P.row.id)) : [], C.forEach(U);
    }, { immediate: !0 });
    const be = u(() => !!O.value.trim() || Z.value > 0), ke = u(() => o.texts[q.value] ?? { title: o.empty, hint: "" }), X = z(null), Te = z(null), y = z(null), L = z(null), _ = u(() => X.value === null ? null : t.props[`card.${X.value}`].rows.value.find((A) => A.id === X.value) ?? Te.value), ge = u(() => _.value ? [_.value] : M.value), ue = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, te = z(!1);
    let ye = 0;
    async function je(A) {
      if (te.value) return;
      te.value = !0, ye = L.value.scrollTop;
      const H = y.value.querySelector(`[data-agent-open="${A.id}"]`);
      if (!ue()) {
        const me = [...y.value.querySelectorAll(".agent-row")].filter((ie) => !ie.contains(H));
        await Promise.all(me.map((ie) => ie.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const C = [...H.querySelectorAll(".agent-head, .agent-line")], P = [...C, ...H.querySelectorAll("[data-agent-motion]")], ve = P.map((me) => me.getBoundingClientRect());
      if (Te.value = A, X.value = A.id, t.reload(`card.${A.id}`), await Fe(), !ue()) {
        const me = P.map((ie) => ie.getBoundingClientRect());
        P.forEach((ie, Le) => {
          const pe = C.findIndex((De) => De !== ie && De.contains(ie)), _e = ve[Le].left - me[Le].left - (pe < 0 ? 0 : ve[pe].left - me[pe].left), Qe = ve[Le].top - me[Le].top - (pe < 0 ? 0 : ve[pe].top - me[pe].top);
          ie.animate([{ transform: `translate(${_e}px, ${Qe}px)` }, { transform: "none" }], { duration: 280, easing: Be });
        }), y.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((ie) => {
          ie.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Be, fill: "backwards" });
        });
      }
      te.value = !1;
    }
    async function we() {
      if (te.value || !_.value) return;
      te.value = !0;
      const A = y.value.querySelector(`[data-agent-open="${X.value}"]`), H = [...A.children], C = ue() ? [] : H.map((P) => P.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(C.map((P) => P.finished)), X.value = null, await Fe(), L.value.scrollTop = ye, C.forEach((P) => P.cancel()), ue() || (A.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Be }), y.value.querySelectorAll(".agent-row").forEach((P) => {
        P.contains(A) || P.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Be });
      })), te.value = !1;
    }
    const re = (A) => X.value === A.id ? we() : je(A);
    ce(O, (A) => A.trim() && (X.value = null)), ce(q, () => {
      X.value = null;
    });
    const Me = (A) => {
      A.key === "Escape" && we();
    };
    return window.addEventListener("keydown", Me), Se(() => window.removeEventListener("keydown", Me)), (A, H) => (a(), s("div", {
      ref_key: "agents",
      ref: y,
      class: de(["agents", { focused: _.value, "card-changing": te.value }])
    }, [
      _.value ? h("", !0) : (a(), N(i(yt), {
        key: 0,
        modelValue: O.value,
        "onUpdate:modelValue": H[1] || (H[1] = (C) => O.value = C),
        placeholder: "Search agents",
        "menu-count": Z.value,
        "data-agents-search": ""
      }, {
        menu: f(() => [
          v(i(ze), null, {
            default: f(() => [...H[2] || (H[2] = [
              p("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(D, null, le(V.value.roles, (C) => (a(), N(i(Re), {
            key: C,
            role: "menuitemcheckbox",
            "aria-checked": j.value.roles.includes(C),
            checked: j.value.roles.includes(C),
            "data-filter-role": C,
            onClick: (P) => G("roles", C)
          }, {
            default: f(() => [
              p(g(se(C)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          V.value.profiles.length ? (a(), N(i(ze), { key: 0 }, {
            default: f(() => [...H[3] || (H[3] = [
              p("Profile", -1)
            ])]),
            _: 1
          })) : h("", !0),
          (a(!0), s(D, null, le(V.value.profiles, (C) => (a(), N(i(Re), {
            key: C.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.profiles.includes(C.name),
            checked: j.value.profiles.includes(C.name),
            "data-filter-profile": C.name,
            onClick: (P) => G("profiles", C.name)
          }, {
            default: f(() => [
              p(g(C.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          v(i(ze), null, {
            default: f(() => [...H[4] || (H[4] = [
              p("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(D, null, le(i(E), (C) => (a(), N(i(Re), {
            key: C.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.programs.includes(C.name),
            checked: j.value.programs.includes(C.name),
            "data-filter-program": C.name,
            onClick: (P) => G("programs", C.name)
          }, {
            default: f(() => [
              p(g(C.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          Z.value ? (a(), N(i(Re), {
            key: 1,
            "data-filter-clear": "",
            onClick: Q
          }, {
            default: f(() => [...H[5] || (H[5] = [
              p("Clear filters", -1)
            ])]),
            _: 1
          })) : h("", !0)
        ]),
        default: f(() => [
          v(i(wt), {
            options: V.value.states,
            value: q.value,
            onPick: H[0] || (H[0] = (C) => q.value = C)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      q.value === "retired" && V.value.upgrade_retired ? (a(), s("p", Qn, "Retired during the upgrade: " + g(V.value.upgrade_retired), 1)) : h("", !0),
      w("div", {
        ref_key: "list",
        ref: L,
        class: de(["agents-view", { "agents-view-open": _.value }])
      }, [
        i(S) && !i(k) && !ge.value.length && Z.value ? (a(), N(i(Ne), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: f(() => [
            v(i(oe), {
              small: "",
              "data-empty-clear": "",
              onClick: Q
            }, {
              default: f(() => [...H[6] || (H[6] = [
                p("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), N(i(Mt), {
          key: 1,
          moves: "",
          "leaves-at-once": te.value,
          rows: ge.value,
          failure: i(k),
          loaded: i(S),
          more: !_.value && i(T),
          older: $,
          empty: ke.value.title,
          hint: ke.value.hint,
          searching: be.value
        }, {
          default: f(({ row: C }) => [
            w("div", {
              class: de(["agent-row", { lingering: r.value.has(C.id) && C.id !== X.value }]),
              "data-agent-row": C.id,
              "data-agent-lingering": r.value.has(C.id) ? "" : null
            }, [
              v(_n, {
                row: C,
                facts: c(C),
                progress: R(C),
                "wait-reason": I(C),
                open: C.id === X.value,
                onToggle: (P) => re(C)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, Xn)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, oo = /* @__PURE__ */ J(eo, [["__scopeId", "data-v-fceb20c3"]]);
export {
  oo as A
};
