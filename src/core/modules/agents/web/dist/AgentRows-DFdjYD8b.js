import { openBlock as a, createElementBlock as s, withModifiers as ae, createElementVNode as y, createVNode as p, unref as r, withCtx as b, createTextVNode as h, Fragment as q, renderList as oe, toDisplayString as g, createBlock as D, createCommentVNode as f, ref as V, computed as u, watch as ce, onUnmounted as xe, defineAsyncComponent as Xe, createSlots as et, resolveDynamicComponent as tt, normalizeClass as de, normalizeStyle as Ie, renderSlot as Se, onMounted as at, Teleport as nt, mergeProps as ot, toRef as Ve, withKeys as qe, nextTick as Fe } from "vue";
import { TextInput as He, Btn as ne, TextArea as lt, TimeAgo as We, useWindow as Oe, SwitchCase as Je, peekRef as Ce, Icon as Ee, RunningCommand as st, FoldGroup as Ke, TaskStatusIcon as rt, loadWindowComponent as it, coalesced as dt, READ_RATES as ut, eventMayBeChildOf as ct, InnerTabs as gt, TabBody as vt, EmptyState as Ne, HoverTip as Me, TaskBar as mt, useNow as Ze, age as pt, perHour as ht, sinceWords as ft, seenWords as bt, AgentTip as kt, SearchBar as yt, Segmented as wt, MenuLabel as ze, MenuItem as Re, RowList as Mt, toggleFilter as $t } from "@journal/window-kit";
import { _ as J, T as xt } from "./TranscriptRows-Crmxs6Un.js";
const St = { class: "action-buttons" }, Ct = {
  __name: "AgentDriverForm",
  props: { program: String, model: String, pending: Boolean },
  emits: ["submit", "cancel", "update:program", "update:model"],
  setup(e) {
    return (o, t) => (a(), s("form", {
      "data-agent-driver-form": "",
      onSubmit: t[3] || (t[3] = ae((l) => o.$emit("submit"), ["prevent"]))
    }, [
      t[6] || (t[6] = y("p", null, "Starts the next session on this program; the agent keeps its number and memories.", -1)),
      p(r(He), {
        "model-value": e.program,
        label: "Program",
        disabled: e.pending,
        "data-agent-driver-program": "",
        "onUpdate:modelValue": t[0] || (t[0] = (l) => o.$emit("update:program", l))
      }, null, 8, ["model-value", "disabled"]),
      p(r(He), {
        "model-value": e.model,
        label: "Model",
        disabled: e.pending,
        "data-agent-driver-model": "",
        "onUpdate:modelValue": t[1] || (t[1] = (l) => o.$emit("update:model", l))
      }, null, 8, ["model-value", "disabled"]),
      y("div", St, [
        p(r(ne), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.program.trim() || !e.model.trim(),
          "data-agent-confirm-driver": ""
        }, {
          default: b(() => [...t[4] || (t[4] = [
            h("Change the driver", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(r(ne), {
          small: "",
          disabled: e.pending,
          onClick: t[2] || (t[2] = (l) => o.$emit("cancel"))
        }, {
          default: b(() => [...t[5] || (t[5] = [
            h("Cancel", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])
      ])
    ], 32));
  }
}, Tt = /* @__PURE__ */ J(Ct, [["__scopeId", "data-v-c138a4da"]]), At = { class: "action-field" }, jt = ["value", "disabled"], Lt = ["value"], Rt = { key: 1 }, Bt = {
  key: 1,
  class: "action-field"
}, It = { class: "action-buttons" }, Ot = {
  __name: "AgentJobForm",
  props: { row: Object, task: String, tasks: Array, text: String, pending: Boolean, loading: Boolean, moreTasks: Boolean, failure: String, jobReady: Boolean },
  emits: ["submit", "cancel", "more", "update:task", "update:text"],
  setup(e) {
    return (o, t) => (a(), s("form", {
      onSubmit: t[4] || (t[4] = ae((l) => o.$emit("submit"), ["prevent"]))
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
            (a(!0), s(q, null, oe(e.tasks, (l) => (a(), s("option", {
              key: l.id,
              value: String(l.id)
            }, g(l.id) + ": " + g(l.title), 9, Lt))), 128))
          ], 40, jt)
        ]),
        e.moreTasks ? (a(), D(r(ne), {
          key: 0,
          small: "",
          disabled: e.pending || e.loading,
          "data-agent-more-tasks": "",
          onClick: t[1] || (t[1] = (l) => o.$emit("more"))
        }, {
          default: b(() => [...t[7] || (t[7] = [
            h("More tasks", -1)
          ])]),
          _: 1
        }, 8, ["disabled"])) : f("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (a(), s("p", Rt, "No open tasks.")) : f("", !0)
      ], 64)) : (a(), s("label", Bt, [
        t[8] || (t[8] = h("Job", -1)),
        p(r(lt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (l) => o.$emit("update:text", l.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      y("div", It, [
        p(r(ne), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.jobReady,
          "data-agent-submit-job": ""
        }, {
          default: b(() => [...t[9] || (t[9] = [
            h("Send the job", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(r(ne), {
          small: "",
          disabled: e.pending,
          onClick: t[3] || (t[3] = (l) => o.$emit("cancel"))
        }, {
          default: b(() => [...t[10] || (t[10] = [
            h("Cancel", -1)
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
      onSubmit: t[2] || (t[2] = ae((l) => o.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = y("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      p(r(He), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (l) => o.$emit("update:reason", l))
      }, null, 8, ["model-value", "disabled"]),
      y("div", zt, [
        p(r(ne), {
          type: "submit",
          small: "",
          disabled: e.pending || !e.reason.trim(),
          "data-agent-confirm-retire": ""
        }, {
          default: b(() => [...t[3] || (t[3] = [
            h("Retire permanently", -1)
          ])]),
          _: 1
        }, 8, ["disabled"]),
        p(r(ne), {
          small: "",
          disabled: e.pending,
          onClick: t[1] || (t[1] = (l) => o.$emit("cancel"))
        }, {
          default: b(() => [...t[4] || (t[4] = [
            h("Cancel", -1)
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
      e.sessions.length ? f("", !0) : (a(), s("p", Wt, "This agent has no session in its history.")),
      y("ol", null, [
        (a(!0), s(q, null, oe(e.sessions, (l) => (a(), s("li", {
          key: l.session,
          "data-agent-session": ""
        }, [
          y("span", null, g([l.program, l.model].filter(Boolean).join(" ")), 1),
          l.started_at ? (a(), s("span", Dt, [
            t[1] || (t[1] = h("Started ", -1)),
            p(r(We), {
              at: l.started_at
            }, null, 8, ["at"])
          ])) : f("", !0),
          y("span", qt, g(l.end_reason ? `Ended: ${l.end_reason.replaceAll("_", " ")}` : l.started_at ? "Running" : "Not started"), 1),
          y("code", null, g(l.session), 1)
        ]))), 128))
      ]),
      y("div", Ft, [
        p(r(ne), {
          small: "",
          onClick: t[0] || (t[0] = (l) => o.$emit("close"))
        }, {
          default: b(() => [...t[2] || (t[2] = [
            h("Close", -1)
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
    const o = e, t = Oe(), l = V(""), i = V(""), v = V(""), n = V(""), S = V(""), j = V(""), B = V([]), E = V(0), z = V(!1), I = V(!1), N = V(!1), L = V(""), O = V(""), W = V([]), Z = u(() => !!o.row.retired_at || o.row.state === "retired"), P = u(() => !Z.value && !!o.row.ended_at), _ = u(() => {
      var w;
      return P.value && ((w = o.row.job_command) == null ? void 0 : w.length) && !o.row.resume_reason;
    }), le = u(() => _.value && !I.value && (o.row.job_task_flag ? B.value.some((w) => String(w.id) === j.value) : !!i.value.trim()));
    function F(w) {
      l.value = w, i.value = "", v.value = "", j.value = "", L.value = "", O.value = "";
    }
    async function Y() {
      F("job"), o.row.job_task_flag && (B.value = [], E.value = 0, z.value = !1, await C());
    }
    async function C() {
      if (!I.value) {
        I.value = !0;
        try {
          t.state["jobs.page"] = String(E.value + 1), await t.reload("jobs");
          const w = t.props.jobs;
          L.value = w.failure.value, L.value || (B.value = [...B.value, ...w.rows.value], E.value = w.data.value.page, z.value = w.more.value);
        } finally {
          I.value = !1;
        }
      }
    }
    async function c(w, $) {
      if (!N.value) {
        N.value = !0, L.value = "";
        try {
          const X = await t.run(w);
          L.value = X.ok ? "" : X.error, X.ok && (F(""), O.value = $);
        } finally {
          N.value = !1;
        }
      }
    }
    async function K() {
      if (!le.value) return;
      const w = o.row.job_task_flag ? [o.row.job_task_flag, j.value] : [i.value.trim()];
      await c([...o.row.job_command, String(o.row.number), ...w], "Job sent.");
    }
    async function k() {
      if (!N.value) {
        N.value = !0;
        try {
          const w = await t.run(["agent", "sessions", String(o.row.number)]);
          F(w.ok ? "history" : ""), L.value = w.ok ? "" : w.error, W.value = w.ok ? w.value.rows : [];
        } finally {
          N.value = !1;
        }
      }
    }
    function m() {
      F("driver"), n.value = o.row.program || "", S.value = "";
    }
    async function d() {
      !P.value || l.value !== "driver" || !n.value.trim() || !S.value.trim() || await c(["agent", "driver", String(o.row.number), "--program", n.value.trim(), "--model", S.value.trim()], "Driver changed.");
    }
    async function R() {
      !P.value || l.value !== "retire" || !v.value.trim() || await c(["agent", "retire", String(o.row.number), "--reason", v.value.trim()], "Agent retired permanently.");
    }
    return (w, $) => {
      var X;
      return a(), s("div", {
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: $[10] || ($[10] = ae(() => {
        }, ["stop"])),
        onKeydown: $[11] || ($[11] = ae(() => {
        }, ["stop"]))
      }, [
        y("div", Gt, [
          p(r(ne), {
            small: "",
            "data-agent-history": "",
            disabled: N.value || I.value,
            onClick: k
          }, {
            default: b(() => [...$[12] || ($[12] = [
              h("Session history", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          P.value ? (a(), s(q, { key: 0 }, [
            (X = e.row.job_command) != null && X.length ? (a(), D(r(ne), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: N.value || I.value || !_.value,
              onClick: Y
            }, {
              default: b(() => [...$[13] || ($[13] = [
                h("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0),
            e.row.role !== "main" ? (a(), D(r(ne), {
              key: 1,
              small: "",
              "data-agent-driver": "",
              disabled: N.value || I.value,
              onClick: m
            }, {
              default: b(() => [...$[14] || ($[14] = [
                h("Change driver", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0),
            e.row.role !== "main" ? (a(), D(r(ne), {
              key: 2,
              small: "",
              "data-agent-retire": "",
              disabled: N.value || I.value,
              onClick: $[0] || ($[0] = (G) => F("retire"))
            }, {
              default: b(() => [...$[15] || ($[15] = [
                h("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : f("", !0)
          ], 64)) : f("", !0)
        ]),
        p(r(Je), { value: l.value }, {
          job: b(() => [
            p(Vt, {
              task: j.value,
              "onUpdate:task": $[1] || ($[1] = (G) => j.value = G),
              text: i.value,
              "onUpdate:text": $[2] || ($[2] = (G) => i.value = G),
              row: e.row,
              tasks: B.value,
              pending: N.value,
              loading: I.value,
              "more-tasks": z.value,
              failure: L.value,
              "job-ready": le.value,
              onSubmit: K,
              onMore: C,
              onCancel: $[3] || ($[3] = (G) => F(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          driver: b(() => [
            p(Tt, {
              program: n.value,
              "onUpdate:program": $[4] || ($[4] = (G) => n.value = G),
              model: S.value,
              "onUpdate:model": $[5] || ($[5] = (G) => S.value = G),
              pending: N.value,
              onSubmit: d,
              onCancel: $[6] || ($[6] = (G) => F(""))
            }, null, 8, ["program", "model", "pending"])
          ]),
          history: b(() => [
            p(Pt, {
              sessions: W.value,
              onClose: $[7] || ($[7] = (G) => F(""))
            }, null, 8, ["sessions"])
          ]),
          retire: b(() => [
            p(Et, {
              reason: v.value,
              "onUpdate:reason": $[8] || ($[8] = (G) => v.value = G),
              pending: N.value,
              onSubmit: R,
              onCancel: $[9] || ($[9] = (G) => F(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        L.value ? (a(), s("p", Jt, g(L.value), 1)) : f("", !0),
        O.value ? (a(), s("p", Kt, g(O.value), 1)) : f("", !0)
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
        onClick: t[0] || (t[0] = ae((l) => r(Ce)("test_queue:0"), ["stop"]))
      }, [
        h("Waiting: " + g(e.waitReason) + " ", 1),
        p(r(Ee), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), s("span", Qt, "Waiting")) : (a(), D(r(st), {
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
      y("div", null, [
        t[0] || (t[0] = y("dt", null, "Retired", -1)),
        y("dd", aa, [
          p(r(We), {
            at: e.row.retired_at
          }, null, 8, ["at"])
        ])
      ]),
      e.row.retiring_actor_name ? (a(), s("div", na, [
        t[1] || (t[1] = y("dt", null, "Retired by", -1)),
        y("dd", oa, g(e.row.retiring_actor_name), 1)
      ])) : f("", !0)
    ])) : f("", !0);
  }
}, sa = /* @__PURE__ */ J(la, [["__scopeId", "data-v-abc8e12a"]]), ra = ["data-agent-delegated", "onClick"], ia = { class: "agent-task-number" }, da = { class: "agent-task-title" }, ua = ["title"], ca = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = o;
    return (l, i) => (a(), D(r(Ke), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: i[0] || (i[0] = (v) => t("toggle"))
    }, {
      default: b(() => [
        (a(!0), s(q, null, oe(e.section.tasks, (v) => (a(), s("button", {
          key: v.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": v.id,
          onClick: (n) => r(Ce)(`tasks:${v.id}`)
        }, [
          p(r(rt), {
            status: v.state
          }, null, 8, ["status"]),
          y("span", ia, g(v.id), 1),
          y("span", da, g(v.title), 1),
          v.plan_id ? (a(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${v.plan_id}: ${v.plan_title}`
          }, "Plan " + g(v.plan_id), 9, ua)) : f("", !0)
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
      var k, m;
      return o.row.ended_at && ((m = (k = o.facts) == null ? void 0 : k.job_returned) != null && m.startsWith(ya)) ? o.facts.job_returned : "";
    }), i = u(() => o.tasks.length ? t.map((k) => ({ state: k, label: k.slice(0, 1).toUpperCase() + k.slice(1), tasks: o.tasks.filter((m) => m.state === k || k === "started" && m.state === "testing" || k === "completed" && m.state === "cancelled") })) : []), v = /* @__PURE__ */ new Set(["completed"]), n = V({}), S = (k) => !(n.value[k] ?? v.has(k)), j = (k) => n.value = { ...n.value, [k]: S(k) }, B = Oe(), { rows: E } = B.props.reports;
    B.state["reports.agent"] = String(o.row.number);
    const z = u(() => o.row.access === "read-only"), I = ["tasks", "transcript", "terminal", "file-feed", "processes", "reports", "memories"], N = u(() => [...B.tabs].sort((k, m) => (I.indexOf(k.key) < 0 ? I.length : I.indexOf(k.key)) - (I.indexOf(m.key) < 0 ? I.length : I.indexOf(m.key)))), L = u(() => !!o.row.retired_at || o.row.state === "retired"), O = () => z.value || L.value ? N.value.find((k) => k.key === "transcript") : N.value[0], W = V(O());
    ce(W, (k) => {
      B.state.tab = (k == null ? void 0 : k.key) ?? "";
    }, { immediate: !0 }), xe(() => {
      B.state.tab = "";
    }), ce(N, (k) => {
      k.some((m) => {
        var d;
        return m.key === ((d = W.value) == null ? void 0 : d.key);
      }) || (W.value = k[0]);
    }), ce(() => o.open, (k) => {
      k && (W.value = O());
    });
    const Z = Object.fromEntries(B.tabs.filter((k) => k.component).map((k) => [k.key, Xe(() => it(k.component))])), P = V(!1), { data: _ } = B.props.tool, le = u(() => {
      var k;
      return ((k = _.value) == null ? void 0 : k.tool) ?? "";
    }), F = u(() => {
      var k;
      return ((k = _.value) == null ? void 0 : k.note) ?? "";
    }), Y = u(() => o.row.role !== "main" && (!o.row.ended_at || o.stoppedWithWork || o.waitReason));
    async function C() {
      !o.open || !Y.value || (B.state["tool.agent"] = String(o.row.number), await B.reload("tool"));
    }
    const c = dt(C, ut.agentCommand), K = B.follow(["hook_call.*", "process_part.*"], (k) => ct(k, "session_agent_id", /* @__PURE__ */ new Set([o.row.id])) && c());
    return xe(() => K == null ? void 0 : K()), ce(() => o.open, (k) => {
      k && C();
    }, { immediate: !0 }), (k, m) => {
      var d;
      return a(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: m[2] || (m[2] = ae(() => {
        }, ["stop"]))
      }, [
        p(sa, { row: e.row }, null, 8, ["row"]),
        e.row.retirement_reason ? (a(), s("p", va, "Retirement reason: " + g(e.row.retirement_reason), 1)) : f("", !0),
        l.value ? (a(), s("p", ma, g(l.value), 1)) : f("", !0),
        p(r(gt), {
          class: "agent-tabs",
          tabs: N.value,
          active: W.value,
          answer: { tasks: e.tasks.length, reports: e.row.report_count ?? r(E).length, memories: e.row.memory_count ?? 0 },
          onChoose: m[0] || (m[0] = (R) => W.value = R)
        }, null, 8, ["tabs", "active", "answer"]),
        p(r(vt), {
          class: "agent-tab-body",
          tab: W.value,
          "data-agent-tab-body": (d = W.value) == null ? void 0 : d.key
        }, {
          default: b(() => {
            var R;
            return [
              p(r(Je), {
                value: (R = W.value) == null ? void 0 : R.key
              }, et({
                reports: b(() => [
                  r(E).length ? f("", !0) : (a(), D(r(Ne), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: b(() => [...m[3] || (m[3] = [
                      h("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (a(!0), s(q, null, oe(r(E), (w) => (a(), s("button", {
                    key: w.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${w.id}`,
                    onClick: ($) => r(Ce)(`messages:${w.id}`)
                  }, g(w.text), 9, pa))), 128))
                ]),
                tasks: b(() => {
                  var w;
                  return [
                    e.tasks.length ? f("", !0) : (a(), D(r(Ne), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: b(() => [...m[4] || (m[4] = [
                        h("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (a(!0), s(q, null, oe(i.value, ($) => (a(), D(ga, {
                      key: $.state,
                      section: $,
                      open: S($.state),
                      onToggle: (X) => j($.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (w = e.facts) != null && w.instruction ? (a(), s(q, { key: 1 }, [
                      m[5] || (m[5] = y("p", { class: "agent-label" }, "Instruction", -1)),
                      y("div", ha, g(e.facts.instruction), 1)
                    ], 64)) : f("", !0)
                  ];
                }),
                transcript: b(() => {
                  var w;
                  return [
                    z.value ? (a(), s(q, { key: 0 }, [
                      (w = e.facts) != null && w.instruction ? (a(), s("div", fa, [
                        p(r(Ke), {
                          label: "Instruction",
                          open: P.value,
                          "data-agent-section": "instruction",
                          onToggle: m[1] || (m[1] = ($) => P.value = !P.value)
                        }, {
                          default: b(() => [
                            y("div", ba, g(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (a(), s("p", ka, "No job recorded")) : f("", !0)
                    ], 64)) : f("", !0),
                    p(xt, {
                      name: `transcript.${e.row.id}`,
                      padding: "0"
                    }, null, 8, ["name"])
                  ];
                }),
                _: 2
              }, [
                oe(r(Z), (w, $) => ({
                  name: $,
                  fn: b(() => [
                    (a(), D(tt(w), {
                      agent: e.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ];
          }),
          _: 1
        }, 8, ["tab", "data-agent-tab-body"]),
        Y.value ? (a(), D(ea, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: le.value,
          note: F.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : f("", !0)
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
    const o = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, l = u(() => o.has(t.state)), i = u(() => [t.doing, t.since, t.seen].filter(Boolean).join(". "));
    return (v, n) => (a(), D(r(Me), {
      as: "button",
      place: "corner",
      class: de(["agent-dot", { pulse: l.value }]),
      "data-state": e.state,
      "aria-label": i.value,
      "data-agent-status": "",
      onClick: n[0] || (n[0] = ae(() => {
      }, ["stop"]))
    }, {
      tip: b(() => [
        y("b", $a, g(e.doing), 1),
        e.since ? (a(), s("span", xa, g(e.since), 1)) : f("", !0),
        e.seen ? (a(), s("span", Sa, g(e.seen), 1)) : f("", !0)
      ]),
      default: b(() => [
        n[1] || (n[1] = y("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, Ta = /* @__PURE__ */ J(Ca, [["__scopeId", "data-v-1a0bc478"]]), Aa = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, ja = (e) => e.filter((o) => o.state !== "cancelled"), Ue = (e, o) => e.filter((t) => t.state === o).length, La = 5, Ra = (e, o) => e || o.split(/\s+/).slice(0, La).join(" ");
function Ba({ tasks: e, inHand: o, perHour: t }) {
  const l = ja(e), i = Ue(l, "completed"), v = Aa[o == null ? void 0 : o.state], n = l.filter((E) => E.state === "started").map((E) => ({ number: E.id, title: E.title })), S = Math.max(n.length, o && o.state !== "completed" ? 1 : 0), j = l.length - i - S, B = i === l.length;
  return {
    number: o.id,
    title: o.title,
    started: n,
    plan: o.plan_id ?? 0,
    count: `${i} of ${l.length}`,
    taskTip: `${i} of its ${l.length} tasks done${v ? `. This one is ${v.words}.` : "."}`,
    countTip: B ? `All ${l.length} tasks done` : `${i} done, ${S} in hand, ${j} to go`,
    paceTip: !B && t ? `About ${t} an hour.` : "",
    rate: !B && t ? `${Math.round(t)}/hour` : "",
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
    return (l, i) => e.job && !t.value ? (a(), s("span", Ia, [
      p(r(Me), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: b(() => [
          y("b", null, g(e.job), 1)
        ]),
        default: b(() => [
          h(g(r(Ra)(e.jobTitle, e.job)), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (a(), s("span", Oa, g(e.jobLaunch), 1)) : f("", !0)
    ])) : t.value ? (a(), s(q, { key: 1 }, [
      y("span", Va, [
        t.value.started.length > 1 ? (a(), s("span", za, [
          i[1] || (i[1] = h("Tasks ", -1)),
          (a(!0), s(q, null, oe(t.value.started, (v, n) => (a(), s(q, {
            key: v.number
          }, [
            n ? (a(), s(q, { key: 0 }, [
              h(", ")
            ], 64)) : f("", !0),
            p(r(Me), {
              as: "button",
              class: "task",
              "data-agent-task": "",
              "data-peek": `tasks:${v.number}`,
              "aria-label": `Task ${v.number}: ${v.title}`,
              onClick: ae((S) => r(Ce)(`tasks:${v.number}`), ["stop"])
            }, {
              tip: b(() => [
                y("b", null, g(v.title), 1)
              ]),
              default: b(() => [
                h(g(v.number), 1)
              ]),
              _: 2
            }, 1032, ["data-peek", "aria-label", "onClick"])
          ], 64))), 128))
        ])) : (a(), D(r(Me), {
          key: 1,
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${t.value.number}`,
          "aria-label": `Task ${t.value.number}: ${t.value.title}`,
          onClick: i[0] || (i[0] = ae((v) => r(Ce)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: b(() => [
            y("b", null, g(t.value.title), 1),
            y("span", null, g(t.value.taskTip), 1)
          ]),
          default: b(() => [
            h("Task " + g(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])),
        t.value.plan ? (a(), s("span", Ha, "Plan " + g(t.value.plan), 1)) : f("", !0),
        t.value.rate ? (a(), s("span", Ea, g(t.value.rate), 1)) : f("", !0),
        p(r(Me), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: b(() => [
            y("b", null, g(t.value.countTip), 1),
            t.value.paceTip ? (a(), s("span", Na, g(t.value.paceTip), 1)) : f("", !0)
          ]),
          default: b(() => [
            h(g(t.value.count), 1)
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
    ], 64)) : f("", !0);
  }
}, Da = /* @__PURE__ */ J(Wa, [["__scopeId", "data-v-e51f5781"]]), qa = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Fa = ["data-icon", "stroke-width", "innerHTML"], te = {
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
    return (v, n) => (a(), s("svg", {
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
      class: de(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), s("span", Ua, g(e.checked ? "✓" : ""), 1)) : f("", !0),
      e.description ? (a(), s("span", Pa, [
        y("span", null, [
          Se(o.$slots, "default", {}, void 0, !0)
        ]),
        y("small", null, g(e.description), 1)
      ])) : Se(o.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ke = /* @__PURE__ */ J(Ga, [["__scopeId", "data-v-fec99974"]]), Ja = {}, Ka = { class: "menu-label" };
function Za(e, o) {
  return a(), s("span", Ka, [
    Se(e.$slots, "default", {}, void 0, !0)
  ]);
}
const $e = /* @__PURE__ */ J(Ja, [["render", Za], ["__scopeId", "data-v-aa955b3e"]]), Ya = {
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
    const t = e, l = o, i = u(() => t.skills.filter((n) => n.state === "loaded")), v = u(() => t.skills.filter((n) => n.state !== "loaded"));
    return (n, S) => (a(), s("div", Ya, [
      p($e, null, {
        default: b(() => [...S[1] || (S[1] = [
          h("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      i.value.length ? f("", !0) : (a(), s("p", _a, "None yet. Compacting the conversation empties this list.")),
      (a(!0), s(q, null, oe(i.value, (j) => (a(), s("p", {
        key: j.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        p(te, {
          name: "book",
          size: 12
        }),
        h(g(j.skill), 1)
      ]))), 128)),
      v.value.length ? (a(), s(q, { key: 1 }, [
        p($e, null, {
          default: b(() => [...S[2] || (S[2] = [
            h("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), s(q, null, oe(v.value, (j) => (a(), s("p", {
          key: j.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          p(te, {
            name: "book",
            size: 12
          }),
          h(g(j.skill), 1)
        ]))), 128))
      ], 64)) : f("", !0),
      p(ke, {
        "data-agent-skills-browse": "",
        onClick: S[0] || (S[0] = (j) => l("browse"))
      }, {
        default: b(() => [...S[3] || (S[3] = [
          h("Browse every skill", -1)
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
    const t = e, l = o, i = u(() => t.windows[0] ?? null), v = u(() => i.value && Number.isFinite(i.value.used_percent) ? Math.max(0, Math.min(100, Math.round(i.value.used_percent))) : null), n = u(() => v.value !== null && v.value >= 100), S = u(() => {
      var B;
      return (B = i.value) != null && B.reset_epoch_seconds ? new Date(i.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), j = u(() => n.value ? `At usage limit: the plan's ${i.value.title} allowance is used up${S.value ? `, starts again ${S.value}` : ""}` : `${v.value}% of the plan's ${i.value.title} allowance used${S.value ? `, starts again ${S.value}` : ""}`);
    return (B, E) => v.value !== null ? (a(), s("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: j.value,
      onClick: E[0] || (E[0] = (z) => l("open", z.currentTarget))
    }, [
      p(te, {
        name: "allowance",
        size: 12
      }),
      E[1] || (E[1] = h()),
      y("span", tn, [
        y("span", {
          style: Ie({ width: `${v.value}%` })
        }, null, 4)
      ]),
      h(" " + g(n.value ? "At usage limit" : `${v.value}%`), 1)
    ], 8, en)) : f("", !0);
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
    var v, n;
    const i = ((v = e.value) == null ? void 0 : v.element) || ((n = e.value) == null ? void 0 : n.$el) || e.value;
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
    const l = e, i = V(null), v = (d) => d ? `${d}px` : void 0, n = u(() => ({
      minWidth: v(l.minWidth),
      maxWidth: v(l.maxWidth),
      maxHeight: v(l.maxHeight),
      height: v(l.height)
    })), S = V({ w: 0, h: 0 }), j = V(l.anchor ? l.anchor.getBoundingClientRect() : null), B = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), E = (d) => ({
      left: Math.max(0, d.left),
      top: Math.max(0, d.top),
      right: Math.min(window.innerWidth, d.right),
      bottom: Math.min(window.innerHeight, d.bottom)
    }), z = (d) => {
      const R = d.closest(".pane, .float-window");
      return R ? E(R.getBoundingClientRect()) : B();
    }, I = (d, R) => `${Math.max(0, d ? Math.min(d, R) : R)}px`;
    function N(d, R) {
      return {
        below: d.bottom - R.bottom - l.gap - be,
        above: R.top - d.top - l.gap - be,
        across: d.right - d.left - 2 * be
      };
    }
    function L(d) {
      const R = z(l.anchor), w = N(R, d);
      return S.value.w <= w.across && S.value.h <= Math.max(w.below, w.above) ? R : B();
    }
    const O = u(() => {
      if (!j.value) return n.value;
      const d = j.value, R = L(d), w = N(R, d), { w: $, h: X } = S.value, G = l.align === "auto" ? d.left + d.right > R.left + R.right : l.align === "right", he = sn(G ? d.right - $ : d.left, R.left + be, Math.max(R.left + be, R.right - $ - be)), Q = X > w.below && w.above > w.below ? { bottom: `${window.innerHeight - d.top + l.gap}px`, maxHeight: I(l.maxHeight, w.above) } : { top: `${d.bottom + l.gap}px`, maxHeight: I(l.maxHeight, w.below) };
      return { ...n.value, ...Q, left: `${he}px`, maxWidth: I(l.maxWidth, w.across) };
    }), W = t, Z = () => [...i.value.querySelectorAll("button:not(:disabled)")];
    function P(d) {
      const R = Z(), w = R.indexOf(document.activeElement);
      R[(w + d + R.length) % R.length].focus();
    }
    const _ = { ArrowDown: () => P(1), ArrowUp: () => P(-1), Escape: () => W("close") }, le = (d) => _[d.key] && (d.preventDefault(), _[d.key]()), F = () => i.value && (S.value = { w: i.value.offsetWidth, h: i.value.scrollHeight });
    let Y = 0;
    const C = new ResizeObserver(() => {
      cancelAnimationFrame(Y), Y = requestAnimationFrame(F);
    });
    un(i, (d) => l.anchor && !l.anchor.contains(d.target) && W("close"));
    const c = (d, R) => ["top", "left", "right", "bottom"].some((w) => Math.abs(d[w] - R[w]) > 1), K = (d) => d.bottom < 0 || d.top > window.innerHeight;
    let k = 0;
    function m() {
      if (l.anchor) {
        const d = l.anchor.getBoundingClientRect();
        if (!l.anchor.isConnected || K(d)) return W("close");
        c(d, j.value) && (j.value = d);
      }
      k = requestAnimationFrame(m);
    }
    return at(() => {
      l.anchor && i.value && rn(i.value, l.anchor), F(), i.value && C.observe(i.value), !l.plain && Z()[0] && Z()[0].focus(), m();
    }), xe(() => {
      C.disconnect(), cancelAnimationFrame(k), cancelAnimationFrame(Y);
    }), o({ element: i }), (d, R) => (a(), D(nt, {
      to: "body",
      disabled: !e.anchor
    }, [
      y("div", ot({
        ref_key: "panel",
        ref: i
      }, d.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: O.value,
        onKeydown: le
      }), [
        Se(d.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), gn = /* @__PURE__ */ J(cn, [["__scopeId", "data-v-3d203970"]]);
async function vn(e, o, t) {
  if (!e) return t(o);
  const { target: l, fields: i } = e, v = Object.fromEntries(Object.keys(i).map((j) => [j, l[j]])), n = () => Object.assign(l, v);
  Object.assign(l, i);
  let S = !1;
  try {
    const j = await t(o);
    return S = j.ok, j;
  } finally {
    S || n();
  }
}
function mn(e, o, t, { groups: l, programs: i }) {
  const v = V({}), n = V(""), S = V(!1), j = u(() => !!e.value && !e.value.ended_at), B = u(() => j.value && !!e.value.paused_at);
  async function E(L, O = null) {
    n.value = "";
    const W = await vn(O, L, o);
    return n.value = W.ok ? "" : W.error, t(), W;
  }
  return { groups: l, programs: i, chosen: v, failure: n, asking: S, running: j, paused: B, choose: (L, O) => E(["agent", "control", String(e.value.number), L, O.value], { target: v, fields: { value: { ...v.value, [L]: O.label } } }), stop: () => (S.value = !1, E(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (L) => E(["agent", "launch", L.name]) };
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
    const t = e, l = o, i = mn(Ve(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => l("changed"), { groups: Ve(t, "controlGroups"), programs: Ve(t, "agentPrograms") }), v = V(null), n = V(""), S = u(() => i.groups.value.find((C) => C.key === n.value));
    function j(C, c) {
      v.value = C.currentTarget, n.value = c;
    }
    function B() {
      v.value = null, n.value = "", i.asking.value = !1;
    }
    const E = u(() => t.skills.filter((C) => C.state === "loaded"));
    function z(C) {
      j(C, "skills"), l("skills");
    }
    const I = (C) => i.groups.value.some((c) => c.key === C), N = u(() => {
      var C;
      return i.chosen.value.model ?? ((C = O.value) == null ? void 0 : C.model) ?? "";
    }), L = u(() => {
      var C;
      return i.chosen.value.effort ?? ((C = O.value) == null ? void 0 : C.effort) ?? "";
    });
    u(() => !!t.agent && !t.agent.ended_at);
    const O = u(() => {
      var C;
      return ((C = t.usage.agents) == null ? void 0 : C.find((c) => {
        var K;
        return c.id === ((K = t.agent) == null ? void 0 : K.id);
      })) ?? null;
    }), W = u(() => {
      var C;
      return ((C = O.value) == null ? void 0 : C.context_percent) == null ? null : Math.round(O.value.context_percent);
    }), Z = u(() => {
      var C;
      return fn(((C = O.value) == null ? void 0 : C.context_change) ?? null);
    }), P = (C) => `${Math.round(C / 1e3)}k`, _ = u(() => {
      var C;
      return !!((C = O.value) != null && C.context_limit_tokens);
    }), le = u(() => {
      var C, c;
      return ((C = O.value) == null ? void 0 : C.context_limit_tokens) || ((c = O.value) == null ? void 0 : c.context_window_tokens) || 0;
    }), F = u(() => le.value ? `${P(O.value.context_tokens ?? 0)} of ${P(le.value)}` : ""), Y = u(() => {
      var C;
      return (C = O.value) != null && C.cost_dollars ? `$${O.value.cost_dollars.toFixed(2)}` : "";
    });
    return (C, c) => {
      var K, k;
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
            onClick: c[0] || (c[0] = (m) => j(m, "agent"))
          }, [
            p(te, {
              name: "agents",
              size: 12
            }),
            h(" " + g(((K = e.agentPrograms.find((m) => m.name === e.agent.program)) == null ? void 0 : K.title) || e.agent.program), 1)
          ], 8, bn),
          p(nn, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: c[1] || (c[1] = (m) => l("open", "usage", m))
          }, null, 8, ["windows", "disabled"]),
          W.value !== null ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${W.value}% full: clear or compact it`,
            onClick: c[2] || (c[2] = (m) => I("context") ? j(m, "context") : l("open", "context", m.currentTarget))
          }, [
            p(te, {
              name: "gauge",
              size: 12
            }),
            c[14] || (c[14] = h()),
            y("span", yn, [
              y("span", {
                style: Ie({ width: `${W.value}%` })
              }, null, 4)
            ]),
            h(" " + g(W.value) + "% ", 1)
          ], 8, kn)) : (k = O.value) != null && k.context_unknown ? (a(), s("span", wn, [
            p(te, {
              name: "gauge",
              size: 12
            }),
            c[15] || (c[15] = h(" Context: unknown", -1))
          ])) : f("", !0),
          N.value ? (a(), s("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${N.value}: change the model`,
            onClick: c[3] || (c[3] = (m) => I("model") ? j(m, "model") : null)
          }, [
            p(te, {
              name: "model",
              size: 12
            }),
            h(" " + g(N.value), 1)
          ], 8, Mn)) : f("", !0),
          I("effort") || e.card && L.value ? (a(), s("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: c[4] || (c[4] = (m) => j(m, "effort"))
          }, [
            p(te, {
              name: "bolt",
              size: 12
            }),
            h(" " + g(L.value), 1)
          ], 8, $n)) : f("", !0),
          Y.value ? (a(), s("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: c[5] || (c[5] = (m) => l("open", "cost", m.currentTarget))
          }, g(Y.value), 9, xn)) : f("", !0),
          e.branch ? (a(), s("span", Sn, [
            p(te, {
              name: "branch",
              size: 12
            }),
            h(" " + g(e.branch), 1)
          ])) : f("", !0),
          e.card ? f("", !0) : (a(), s("button", {
            key: 6,
            type: "button",
            class: de(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: c[6] || (c[6] = (m) => l("open", "jobs", m.currentTarget))
          }, [
            p(te, {
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
            onClick: z
          }, [
            p(te, {
              name: "book",
              size: 12
            }),
            h(" " + g(E.value.length), 1)
          ])) : f("", !0),
          e.fitness ? (a(), s(q, { key: 8 }, [
            y("button", {
              type: "button",
              class: de(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < In }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: c[7] || (c[7] = (m) => l("open", "fitness", m.currentTarget))
            }, [
              p(te, {
                name: "heart",
                size: 12
              }),
              h(" " + g(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            y("button", {
              type: "button",
              class: de(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: c[8] || (c[8] = (m) => l("open", "load", m.currentTarget))
            }, [
              p(te, {
                name: "weight",
                size: 12
              }),
              h(" " + g(e.fitness.workload), 1)
            ], 2)
          ], 64)) : f("", !0)
        ], 64)) : e.run && !e.loading ? (a(), s("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: c[9] || (c[9] = (m) => j(m, "start"))
        }, [
          p(te, {
            name: "agents",
            size: 12
          }),
          c[16] || (c[16] = h(" Start an agent", -1))
        ])) : f("", !0),
        c[22] || (c[22] = y("span", { class: "space" }, null, -1)),
        r(i).failure.value ? (a(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: r(i).failure.value
        }, g(r(i).failure.value), 9, Cn)) : f("", !0),
        Se(C.$slots, "default", {}, void 0, !0),
        v.value ? (a(), D(gn, {
          key: 3,
          anchor: v.value,
          "min-width": 190,
          onClose: B
        }, {
          default: b(() => {
            var m;
            return [
              n.value === "agent" ? (a(), s(q, { key: 0 }, [
                r(i).asking.value ? (a(), s(q, { key: 0 }, [
                  p($e, { "data-agent-stop-ask": "" }, {
                    default: b(() => [...c[17] || (c[17] = [
                      h("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  p(ke, {
                    "data-agent-stop-confirm": "",
                    onClick: c[10] || (c[10] = (d) => (B(), r(i).stop()))
                  }, {
                    default: b(() => [...c[18] || (c[18] = [
                      h("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  p(ke, {
                    onClick: c[11] || (c[11] = (d) => r(i).asking.value = !1)
                  }, {
                    default: b(() => [...c[19] || (c[19] = [
                      h("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (a(), D(ke, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: c[12] || (c[12] = (d) => r(i).asking.value = !0)
                }, {
                  default: b(() => [...c[20] || (c[20] = [
                    h("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : n.value === "start" ? (a(), s(q, { key: 1 }, [
                p($e, null, {
                  default: b(() => [...c[21] || (c[21] = [
                    h("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (a(!0), s(q, null, oe(r(i).programs.value, (d) => (a(), D(ke, {
                  key: d.name,
                  "data-agent-program": d.name,
                  onClick: (R) => (B(), r(i).start(d))
                }, {
                  default: b(() => [
                    h(g(d.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : n.value === "skills" ? (a(), D(Xa, {
                key: 2,
                skills: e.skills,
                onBrowse: c[13] || (c[13] = (d) => (B(), l("open", "skills", null)))
              }, null, 8, ["skills"])) : S.value ? (a(), s(q, { key: 3 }, [
                p($e, null, {
                  default: b(() => [
                    h(g(S.value.label), 1)
                  ]),
                  _: 1
                }),
                n.value === "context" ? (a(), s(q, { key: 0 }, [
                  y("p", Tn, g(r(pn)(((m = O.value) == null ? void 0 : m.last_compaction) ?? null)), 1),
                  y("div", An, [
                    y("span", jn, [
                      y("span", {
                        style: Ie({ width: `${W.value}%` })
                      }, null, 4)
                    ]),
                    y("span", Ln, g(W.value) + "%", 1)
                  ]),
                  F.value ? (a(), s("p", Rn, [
                    h(g(F.value) + " ", 1),
                    _.value ? (a(), D(ln, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : f("", !0)
                  ])) : f("", !0)
                ], 64)) : f("", !0),
                n.value === "context" && Z.value ? (a(), s("p", Bn, g(Z.value), 1)) : (a(!0), s(q, { key: 2 }, oe(S.value.choices, (d) => (a(), D(ke, {
                  key: d.value,
                  "data-agent-choice": d.value,
                  onClick: (R) => (r(i).choose(S.value.key, d), B())
                }, {
                  default: b(() => [
                    h(g(d.label), 1)
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
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), l = ["completed", "testing"], i = { helper: "Helper", reviewer: "Reviewer", main: "Main agent" }, v = { running: "Working", starting: "Starting", stopping: "Stopping", ended: "Idle: its process has stopped", failed: "Could not start", never_started: "Not started" }, n = e, S = o, j = Ze(), B = V(!1), E = u(() => {
      var A, re;
      if ((A = n.facts) != null && A.profile_title) return n.facts.profile_title;
      if ((re = n.facts) != null && re.profile) return n.facts.profile;
      const M = i[n.row.role] || n.row.role;
      return M.slice(0, 1).toUpperCase() + M.slice(1);
    }), z = u(() => {
      var M;
      return ((M = n.facts) == null ? void 0 : M.tasks) ?? [];
    }), I = u(() => z.value.filter((M) => M.state === "open")), N = u(() => z.value.find((M) => {
      var A;
      return M.id === ((A = n.progress) == null ? void 0 : A.task_id) && M.state === "started";
    })), L = u(() => N.value || z.value.find((M) => {
      var A;
      return M.id === ((A = n.facts) == null ? void 0 : A.task_id);
    }) || z.value.find((M) => t.has(M.state)) || I.value[0] || z.value.at(-1)), O = u(() => {
      var M, A, re, ue, ee, ve;
      return n.row.role === "helper" ? ((M = n.facts) == null ? void 0 : M.helper_job) || "" : (A = n.facts) != null && A.job_enabled && (((re = N.value) == null ? void 0 : re.title) || ((ue = n.facts) == null ? void 0 : ue.task_title) || ((ee = I.value[0]) == null ? void 0 : ee.title) || ((ve = z.value.at(-1)) == null ? void 0 : ve.title)) || "";
    }), W = u(() => `${n.row.role} ${n.row.number}`), Z = u(() => {
      var M, A;
      return [n.row.program, (M = n.facts) == null ? void 0 : M.model, (A = n.facts) == null ? void 0 : A.effort, W.value].filter(Boolean).join(" · ");
    }), P = u(() => n.row.role === "main" ? E.value : `${E.value} ${n.row.number}`), _ = Oe(), le = u(() => pt(n.row.process_started_at || n.row.created_at, j.value)), F = /* @__PURE__ */ new Set(["open", "started", "testing"]), Y = { fresh: "new conversation", resumed: "resumed" }, C = u(() => {
      var M, A;
      return [(M = n.facts) == null ? void 0 : M.helper_job_program, Y[(A = n.facts) == null ? void 0 : A.occupant_launch]].filter(Boolean).join(", ");
    }), c = u(() => {
      var M;
      return (M = n.facts) == null ? void 0 : M.work_status;
    }), K = u(() => !!n.row.ended_at && n.row.role !== "main" && z.value.some((M) => F.has(M.state))), k = u(() => {
      var M, A;
      return n.row.state === "running" && ((M = n.facts) == null ? void 0 : M.state) === "at usage limit" && !!((A = n.facts) != null && A.usage_limit_ends_at);
    }), m = (M) => new Date(M).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), d = u(() => n.row.halted_at ? `Stopped at the usage limit since ${m(n.row.halted_at)}, goes on at ${m(n.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(n.facts.usage_limit_ends_at).toLocaleString()}`), R = u(() => {
      var M;
      return n.row.retired_at || n.row.state === "retired" ? "retired" : k.value || c.value || n.waitReason || K.value ? "waiting" : n.row.state === "running" && ((M = n.facts) == null ? void 0 : M.state) || n.row.state;
    }), w = u(() => {
      var M;
      return k.value ? d.value : c.value ? `Status: ${c.value}` : n.waitReason ? `Waiting: ${n.waitReason}` : R.value === "blocked" ? (M = n.facts) != null && M.blocked_reason ? `Blocked: ${n.facts.blocked_reason}` : "Blocked" : K.value ? "Stopped with work left" : "";
    }), $ = u(() => {
      var M;
      return ((M = n.progress) == null ? void 0 : M.completed_count) ?? z.value.filter((A) => l.includes(A.state)).length;
    }), X = u(() => {
      var M;
      return ht($.value, ((M = n.progress) == null ? void 0 : M.started_at) || n.row.created_at, n.progress ? n.progress.finished_at : n.row.ended_at, j.value);
    }), G = u(() => n.row.role === "main" ? 0 : X.value), he = u(() => !!n.row.retired_at || n.row.state === "retired"), ye = u(() => he.value ? "Retired" : R.value === "blocked" || R.value === "waiting" ? w.value || (R.value === "blocked" ? "Blocked" : "Waiting") : v[n.row.standing]), Q = u(() => {
      var A;
      if (he.value) return n.row.retired_at;
      const M = R.value === "blocked" || R.value === "waiting";
      return n.row.ended_at || M && ((A = n.facts) == null ? void 0 : A.last_activity) || n.row.process_started_at || n.row.created_at;
    }), Te = u(() => ft(Q.value, j.value)), ge = u(() => {
      var M;
      return bt((M = n.facts) == null ? void 0 : M.last_activity, j.value);
    });
    return (M, A) => {
      var re, ue, ee, ve, Ae, we, je;
      return a(), s("div", {
        class: de(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: A[2] || (A[2] = (se) => !e.open && S("toggle")),
        onKeydown: [
          A[3] || (A[3] = qe(ae((se) => !e.open && S("toggle"), ["self", "prevent"]), ["enter"])),
          A[4] || (A[4] = qe(ae((se) => !e.open && S("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        y("div", Hn, [
          e.open ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back",
            "aria-label": "Back",
            onClick: A[0] || (A[0] = ae((se) => S("toggle"), ["stop"]))
          }, [
            p(r(Ee), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : f("", !0),
          e.open ? (a(), s(q, { key: 1 }, [
            y("span", En, g(P.value), 1),
            y("span", Nn, g(((re = e.facts) == null ? void 0 : re.given_name) || e.row.id), 1),
            p(r(ne), {
              variant: "ghost",
              small: "",
              class: "agent-menu-button",
              "data-agent-menu": "",
              "aria-expanded": B.value,
              onClick: A[1] || (A[1] = ae((se) => B.value = !B.value, ["stop"]))
            }, {
              default: b(() => [...A[5] || (A[5] = [
                h("Actions", -1)
              ])]),
              _: 1
            }, 8, ["aria-expanded"])
          ], 64)) : (a(), s(q, { key: 2 }, [
            p(r(kt), {
              "agent-id": e.row.id,
              label: E.value,
              class: "agent-who"
            }, {
              default: b(() => {
                var se;
                return [
                  y("span", Wn, g(E.value), 1),
                  y("span", Dn, g(((se = e.facts) == null ? void 0 : se.given_name) || e.row.id), 1)
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
        e.open && B.value ? (a(), s("div", qn, [
          p(Yt, { row: e.row }, null, 8, ["row"])
        ])) : f("", !0),
        e.open ? f("", !0) : (a(), s("span", Fn, [
          y("span", Un, g(Z.value), 1),
          (ue = e.facts) != null && ue.sandbox_off ? (a(), s("span", Pn, "sandbox off")) : f("", !0)
        ])),
        e.open && !he.value ? (a(), D(Vn, {
          key: 2,
          class: "agent-live",
          "agent-programs": r(_).props.programs.rows.value,
          agent: e.row,
          branch: (ee = e.progress) == null ? void 0 : ee.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((ve = e.facts) == null ? void 0 : ve.windows) ?? [] },
          card: ""
        }, {
          default: b(() => {
            var se, x;
            return [
              (se = e.facts) != null && se.sandbox_off ? (a(), s("span", Gn, "sandbox off")) : f("", !0),
              y("span", Jn, "Run time: " + g(le.value), 1),
              (x = e.facts) != null && x.last_activity ? (a(), s("span", Kn, [
                A[6] || (A[6] = h("Seen: ", -1)),
                p(r(We), {
                  at: e.facts.last_activity
                }, null, 8, ["at"])
              ])) : f("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : f("", !0),
        (Ae = e.facts) != null && Ae.unit_name ? (a(), s("div", Zn, "Unit: " + g(e.facts.unit_name), 1)) : f("", !0),
        e.open ? f("", !0) : (a(), D(Da, {
          key: 4,
          tasks: z.value,
          "in-hand": e.row.role !== "helper" && ((we = e.facts) != null && we.job_enabled) && L.value || null,
          job: e.row.role === "helper" ? O.value : "",
          "job-title": e.row.role === "helper" && ((je = e.facts) == null ? void 0 : je.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? C.value : "",
          "per-hour": G.value
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour"])),
        p(Ta, {
          state: R.value,
          doing: ye.value,
          since: Te.value,
          seen: ge.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (a(), D(Ma, {
          key: 5,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: z.value,
          "stopped-with-work": K.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : f("", !0)
      ], 42, zn);
    };
  }
}, _n = /* @__PURE__ */ J(Yn, [["__scopeId", "data-v-0548ec35"]]), Qn = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, Xn = ["data-agent-row", "data-agent-lingering"], Pe = "journal.agents.filters", Ge = 300 * 1e3, Be = "cubic-bezier(0.2, 0.9, 0.25, 1)", eo = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const o = e, t = Oe(), { rows: l } = t.props.waits, { rows: i } = t.props.progress, { rows: v, failure: n, loaded: S, more: j } = t.props.agents, B = (x) => i.value.find((H) => H.agent_id === x.id) ?? null, E = (x) => {
      var H;
      return ((H = l.value.find((T) => T.agent_id === x.id)) == null ? void 0 : H.reason) ?? "";
    }, z = V("running"), I = V(""), N = JSON.parse(localStorage.getItem(Pe) || '{"roles":[],"profiles":[],"programs":[]}'), L = V(N), O = u(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: W } = t.props.programs, Z = u(() => L.value.roles.length + L.value.profiles.length + L.value.programs.length), P = (x, H) => {
      L.value = $t(L.value, x, H);
    }, _ = () => {
      L.value = { roles: [], profiles: [], programs: [] };
    }, le = (x) => x.slice(0, 1).toUpperCase() + x.slice(1);
    ce(L, (x) => localStorage.setItem(Pe, JSON.stringify(x)));
    const F = V(25);
    function Y() {
      Object.assign(t.state, {
        "agents.show": z.value,
        "agents.search": I.value,
        "agents.limit": String(F.value),
        "agents.roles": L.value.roles.join(","),
        "agents.profiles": L.value.profiles.join(","),
        "agents.programs": L.value.programs.join(",")
      });
    }
    async function C() {
      return F.value += 25, Y(), await t.reload("agents"), !0;
    }
    ce([z, I, L], () => {
      F.value = 25, Y(), t.reload("agents");
    }), Y();
    const c = (x) => x.facts ?? null, K = v, k = Ze(), m = V([]), d = u(() => new Set(m.value.filter((x) => k.value - x.left < Ge).map((x) => x.row.id))), R = u(() => m.value.filter((x) => d.value.has(x.row.id)).map((x) => x.row)), w = u(() => [...K.value, ...R.value]);
    let $ = "", X = [];
    async function G(x) {
      await t.reload(`card.${x.id}`);
      const H = t.props[`card.${x.id}`].rows.value.find((T) => T.id === x.id);
      H != null && H.ended_at && !m.value.some((T) => T.row.id === x.id) && (m.value = [...m.value, { row: H, left: Date.now() }]);
    }
    ce(v, (x) => {
      const H = $ === `${z.value}|${I.value}|${JSON.stringify(L.value)}` && z.value === "running", T = H ? X.filter((U) => !x.some((me) => me.id === U.id)) : [];
      $ = `${z.value}|${I.value}|${JSON.stringify(L.value)}`, X = x, m.value = H ? m.value.filter((U) => k.value - U.left < Ge && !x.some((me) => me.id === U.row.id)) : [], T.forEach(G);
    }, { immediate: !0 });
    const he = u(() => !!I.value.trim() || Z.value > 0), ye = u(() => o.texts[z.value] ?? { title: o.empty, hint: "" }), Q = V(null), Te = V(null), ge = V(null), M = V(null), A = u(() => Q.value === null ? null : t.props[`card.${Q.value}`].rows.value.find((x) => x.id === Q.value) ?? Te.value), re = u(() => A.value ? [A.value] : w.value), ue = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, ee = V(!1);
    let ve = 0;
    async function Ae(x) {
      if (ee.value) return;
      ee.value = !0, ve = M.value.scrollTop;
      const H = ge.value.querySelector(`[data-agent-open="${x.id}"]`);
      if (!ue()) {
        const pe = [...ge.value.querySelectorAll(".agent-row")].filter((ie) => !ie.contains(H));
        await Promise.all(pe.map((ie) => ie.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const T = [...H.querySelectorAll(".agent-head, .agent-line")], U = [...T, ...H.querySelectorAll("[data-agent-motion]")], me = U.map((pe) => pe.getBoundingClientRect());
      if (Te.value = x, Q.value = x.id, t.reload(`card.${x.id}`), await Fe(), !ue()) {
        const pe = U.map((ie) => ie.getBoundingClientRect());
        U.forEach((ie, Le) => {
          const fe = T.findIndex((De) => De !== ie && De.contains(ie)), _e = me[Le].left - pe[Le].left - (fe < 0 ? 0 : me[fe].left - pe[fe].left), Qe = me[Le].top - pe[Le].top - (fe < 0 ? 0 : me[fe].top - pe[fe].top);
          ie.animate([{ transform: `translate(${_e}px, ${Qe}px)` }, { transform: "none" }], { duration: 280, easing: Be });
        }), ge.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((ie) => {
          ie.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Be, fill: "backwards" });
        });
      }
      ee.value = !1;
    }
    async function we() {
      if (ee.value || !A.value) return;
      ee.value = !0;
      const x = ge.value.querySelector(`[data-agent-open="${Q.value}"]`), H = [...x.children], T = ue() ? [] : H.map((U) => U.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(T.map((U) => U.finished)), Q.value = null, await Fe(), M.value.scrollTop = ve, T.forEach((U) => U.cancel()), ue() || (x.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Be }), ge.value.querySelectorAll(".agent-row").forEach((U) => {
        U.contains(x) || U.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Be });
      })), ee.value = !1;
    }
    const je = (x) => Q.value === x.id ? we() : Ae(x);
    ce(I, (x) => x.trim() && (Q.value = null)), ce(z, () => {
      Q.value = null;
    });
    const se = (x) => {
      x.key === "Escape" && we();
    };
    return window.addEventListener("keydown", se), xe(() => window.removeEventListener("keydown", se)), (x, H) => (a(), s("div", {
      ref_key: "agents",
      ref: ge,
      class: de(["agents", { focused: A.value, "card-changing": ee.value }])
    }, [
      A.value ? f("", !0) : (a(), D(r(yt), {
        key: 0,
        modelValue: I.value,
        "onUpdate:modelValue": H[1] || (H[1] = (T) => I.value = T),
        placeholder: "Search agents",
        "menu-count": Z.value,
        "data-agents-search": ""
      }, {
        menu: b(() => [
          p(r(ze), null, {
            default: b(() => [...H[2] || (H[2] = [
              h("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(q, null, oe(O.value.roles, (T) => (a(), D(r(Re), {
            key: T,
            role: "menuitemcheckbox",
            "aria-checked": L.value.roles.includes(T),
            checked: L.value.roles.includes(T),
            "data-filter-role": T,
            onClick: (U) => P("roles", T)
          }, {
            default: b(() => [
              h(g(le(T)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          O.value.profiles.length ? (a(), D(r(ze), { key: 0 }, {
            default: b(() => [...H[3] || (H[3] = [
              h("Profile", -1)
            ])]),
            _: 1
          })) : f("", !0),
          (a(!0), s(q, null, oe(O.value.profiles, (T) => (a(), D(r(Re), {
            key: T.name,
            role: "menuitemcheckbox",
            "aria-checked": L.value.profiles.includes(T.name),
            checked: L.value.profiles.includes(T.name),
            "data-filter-profile": T.name,
            onClick: (U) => P("profiles", T.name)
          }, {
            default: b(() => [
              h(g(T.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          p(r(ze), null, {
            default: b(() => [...H[4] || (H[4] = [
              h("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(q, null, oe(r(W), (T) => (a(), D(r(Re), {
            key: T.name,
            role: "menuitemcheckbox",
            "aria-checked": L.value.programs.includes(T.name),
            checked: L.value.programs.includes(T.name),
            "data-filter-program": T.name,
            onClick: (U) => P("programs", T.name)
          }, {
            default: b(() => [
              h(g(T.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          Z.value ? (a(), D(r(Re), {
            key: 1,
            "data-filter-clear": "",
            onClick: _
          }, {
            default: b(() => [...H[5] || (H[5] = [
              h("Clear filters", -1)
            ])]),
            _: 1
          })) : f("", !0)
        ]),
        default: b(() => [
          p(r(wt), {
            options: O.value.states,
            value: z.value,
            onPick: H[0] || (H[0] = (T) => z.value = T)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      z.value === "retired" && O.value.upgrade_retired ? (a(), s("p", Qn, "Retired during the upgrade: " + g(O.value.upgrade_retired), 1)) : f("", !0),
      y("div", {
        ref_key: "list",
        ref: M,
        class: de(["agents-view", { "agents-view-open": A.value }])
      }, [
        r(S) && !r(n) && !re.value.length && Z.value ? (a(), D(r(Ne), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: b(() => [
            p(r(ne), {
              small: "",
              "data-empty-clear": "",
              onClick: _
            }, {
              default: b(() => [...H[6] || (H[6] = [
                h("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), D(r(Mt), {
          key: 1,
          moves: "",
          "leaves-at-once": ee.value,
          rows: re.value,
          failure: r(n),
          loaded: r(S),
          more: !A.value && r(j),
          older: C,
          empty: ye.value.title,
          hint: ye.value.hint,
          searching: he.value
        }, {
          default: b(({ row: T }) => [
            y("div", {
              class: de(["agent-row", { lingering: d.value.has(T.id) && T.id !== Q.value }]),
              "data-agent-row": T.id,
              "data-agent-lingering": d.value.has(T.id) ? "" : null
            }, [
              p(_n, {
                row: T,
                facts: c(T),
                progress: B(T),
                "wait-reason": E(T),
                open: T.id === Q.value,
                onToggle: (U) => je(T)
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
