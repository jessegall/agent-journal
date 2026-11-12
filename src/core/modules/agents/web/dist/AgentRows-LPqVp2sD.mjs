import { openBlock as a, createElementBlock as s, withModifiers as ne, createElementVNode as y, createVNode as p, unref as i, withCtx as b, createTextVNode as f, Fragment as F, renderList as oe, toDisplayString as c, createBlock as D, createCommentVNode as h, ref as V, computed as u, watch as ge, onUnmounted as xe, defineAsyncComponent as _e, createSlots as et, resolveDynamicComponent as tt, normalizeClass as ue, normalizeStyle as Ie, renderSlot as Se, onMounted as at, Teleport as nt, mergeProps as ot, toRef as Ve, withKeys as qe, nextTick as Fe } from "vue";
import { TextInput as ze, Btn as ee, TextArea as lt, TimeAgo as We, useWindow as Oe, SwitchCase as Je, peekRef as Ce, Icon as Ee, RunningCommand as st, FoldGroup as Ke, TaskStatusIcon as it, loadWindowComponent as rt, coalesced as dt, READ_RATES as ut, eventMayBeChildOf as ct, InnerTabs as gt, TabBody as vt, EmptyState as Ne, HoverTip as Me, TaskBar as mt, useNow as Ze, age as pt, perHour as ft, sinceWords as ht, seenWords as bt, AgentTip as kt, SearchBar as yt, Segmented as wt, MenuLabel as He, MenuItem as Re, RowList as Mt, toggleFilter as $t } from "@journal/window-kit";
import { _ as Z, T as xt } from "./TranscriptRows-h-id2yIe.mjs";
const St = { class: "action-buttons" }, Ct = {
  __name: "AgentDriverForm",
  props: { program: String, model: String, pending: Boolean },
  emits: ["submit", "cancel", "update:program", "update:model"],
  setup(e) {
    return (o, t) => (a(), s("form", {
      "data-agent-driver-form": "",
      onSubmit: t[3] || (t[3] = ne((l) => o.$emit("submit"), ["prevent"]))
    }, [
      t[6] || (t[6] = y("p", null, "Starts the next session on this program; the agent keeps its number and memories.", -1)),
      p(i(ze), {
        "model-value": e.program,
        label: "Program",
        disabled: e.pending,
        "data-agent-driver-program": "",
        "onUpdate:modelValue": t[0] || (t[0] = (l) => o.$emit("update:program", l))
      }, null, 8, ["model-value", "disabled"]),
      p(i(ze), {
        "model-value": e.model,
        label: "Model",
        disabled: e.pending,
        "data-agent-driver-model": "",
        "onUpdate:modelValue": t[1] || (t[1] = (l) => o.$emit("update:model", l))
      }, null, 8, ["model-value", "disabled"]),
      y("div", St, [
        p(i(ee), {
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
        p(i(ee), {
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
}, Tt = /* @__PURE__ */ Z(Ct, [["__scopeId", "data-v-50df3766"]]), At = { class: "action-field" }, jt = ["value", "disabled"], Lt = ["value"], Rt = { key: 1 }, Bt = {
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
      e.row.job_task_flag ? (a(), s(F, { key: 0 }, [
        y("label", At, [
          t[6] || (t[6] = f("Task ", -1)),
          y("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: t[0] || (t[0] = (l) => o.$emit("update:task", l.target.value))
          }, [
            t[5] || (t[5] = y("option", { value: "" }, "Choose an open task", -1)),
            (a(!0), s(F, null, oe(e.tasks, (l) => (a(), s("option", {
              key: l.id,
              value: String(l.id)
            }, c(l.id) + ": " + c(l.title), 9, Lt))), 128))
          ], 40, jt)
        ]),
        e.moreTasks ? (a(), D(i(ee), {
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
        p(i(lt), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (l) => o.$emit("update:text", l.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      y("div", It, [
        p(i(ee), {
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
        p(i(ee), {
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
}, Vt = /* @__PURE__ */ Z(Ot, [["__scopeId", "data-v-356a2712"]]), Ht = { class: "action-buttons" }, zt = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (o, t) => (a(), s("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = ne((l) => o.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = y("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      p(i(ze), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (l) => o.$emit("update:reason", l))
      }, null, 8, ["model-value", "disabled"]),
      y("div", Ht, [
        p(i(ee), {
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
        p(i(ee), {
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
}, Et = /* @__PURE__ */ Z(zt, [["__scopeId", "data-v-818a34c9"]]), Nt = {
  class: "session-history",
  "data-agent-session-history": ""
}, Wt = { key: 0 }, Dt = { key: 0 }, qt = { "data-agent-session-state": "" }, Ft = { class: "action-buttons" }, Ut = {
  __name: "AgentSessionHistory",
  props: { sessions: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e) {
    return (o, t) => (a(), s("div", Nt, [
      e.sessions.length ? h("", !0) : (a(), s("p", Wt, "This agent has no session in its history.")),
      y("ol", null, [
        (a(!0), s(F, null, oe(e.sessions, (l) => (a(), s("li", {
          key: l.session,
          "data-agent-session": ""
        }, [
          y("span", null, c([l.program, l.model].filter(Boolean).join(" ")), 1),
          l.started_at ? (a(), s("span", Dt, [
            t[1] || (t[1] = f("Started ", -1)),
            p(i(We), {
              at: l.started_at
            }, null, 8, ["at"])
          ])) : h("", !0),
          y("span", qt, c(l.end_reason ? `Ended: ${l.end_reason.replaceAll("_", " ")}` : l.started_at ? "Running" : "Not started"), 1),
          y("code", null, c(l.session), 1)
        ]))), 128))
      ]),
      y("div", Ft, [
        p(i(ee), {
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
}, Pt = /* @__PURE__ */ Z(Ut, [["__scopeId", "data-v-182feeca"]]), Gt = { class: "action-buttons" }, Jt = {
  key: 0,
  role: "alert"
}, Kt = {
  key: 1,
  role: "status"
}, Zt = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 }, held: { type: Boolean, default: !1 } },
  setup(e) {
    const o = e, t = Oe(), l = V(""), r = V(""), g = V(""), n = V(""), $ = V(""), T = V(""), R = V([]), N = V(0), H = V(!1), I = V(!1), W = V(!1), j = V(""), O = V(""), q = V([]), Y = u(() => !!o.row.retired_at || o.row.state === "retired"), K = u(() => !Y.value && !!o.row.ended_at), X = u(() => {
      var B;
      return K.value && ((B = o.row.job_command) == null ? void 0 : B.length) && !o.row.resume_reason;
    }), le = u(() => X.value && !I.value && (o.row.job_task_flag ? R.value.some((B) => String(B.id) === T.value) : !!r.value.trim()));
    function U(B) {
      l.value = B, r.value = "", g.value = "", T.value = "", j.value = "", O.value = "";
    }
    async function Q() {
      U("job"), o.row.job_task_flag && (R.value = [], N.value = 0, H.value = !1, await x());
    }
    async function x() {
      if (!I.value) {
        I.value = !0;
        try {
          t.state["jobs.page"] = String(N.value + 1), await t.reload("jobs");
          const B = t.props.jobs;
          j.value = B.failure.value, j.value || (R.value = [...R.value, ...B.rows.value], N.value = B.data.value.page, H.value = B.more.value);
        } finally {
          I.value = !1;
        }
      }
    }
    async function v() {
      await P(["process", "lift-hold", String(o.row.number)], "Hold lifted.");
    }
    async function P(B, L) {
      if (!W.value) {
        W.value = !0, j.value = "";
        try {
          const ie = await t.run(B);
          j.value = ie.ok ? "" : ie.error, ie.ok && (U(""), O.value = L);
        } finally {
          W.value = !1;
        }
      }
    }
    async function k() {
      if (!le.value) return;
      const B = o.row.job_task_flag ? [o.row.job_task_flag, T.value] : [r.value.trim()];
      await P([...o.row.job_command, String(o.row.number), ...B], "Job sent.");
    }
    async function m() {
      if (!W.value) {
        W.value = !0;
        try {
          const B = await t.run(["agent", "sessions", String(o.row.number)]);
          U(B.ok ? "history" : ""), j.value = B.ok ? "" : B.error, q.value = B.ok ? B.value.rows : [];
        } finally {
          W.value = !1;
        }
      }
    }
    function d() {
      U("driver"), n.value = o.row.program || "", $.value = "";
    }
    async function A() {
      !K.value || l.value !== "driver" || !n.value.trim() || !$.value.trim() || await P(["agent", "driver", String(o.row.number), "--program", n.value.trim(), "--model", $.value.trim()], "Driver changed.");
    }
    async function E() {
      !K.value || l.value !== "retire" || !g.value.trim() || await P(["agent", "retire", String(o.row.number), "--reason", g.value.trim()], "Agent retired permanently.");
    }
    return (B, L) => {
      var ie;
      return a(), s("div", {
        class: "agent-actions",
        "data-agent-actions": "",
        onClick: L[10] || (L[10] = ne(() => {
        }, ["stop"])),
        onKeydown: L[11] || (L[11] = ne(() => {
        }, ["stop"]))
      }, [
        y("div", Gt, [
          p(i(ee), {
            small: "",
            "data-agent-history": "",
            disabled: W.value || I.value,
            onClick: m
          }, {
            default: b(() => [...L[12] || (L[12] = [
              f("Session history", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          e.held ? (a(), D(i(ee), {
            key: 0,
            small: "",
            "data-agent-lift-hold": "",
            disabled: W.value,
            onClick: v
          }, {
            default: b(() => [...L[13] || (L[13] = [
              f("Lift this hold", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])) : h("", !0),
          K.value ? (a(), s(F, { key: 1 }, [
            (ie = e.row.job_command) != null && ie.length ? (a(), D(i(ee), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: W.value || I.value || !X.value,
              onClick: Q
            }, {
              default: b(() => [...L[14] || (L[14] = [
                f("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0),
            e.row.role !== "main" ? (a(), D(i(ee), {
              key: 1,
              small: "",
              "data-agent-driver": "",
              disabled: W.value || I.value,
              onClick: d
            }, {
              default: b(() => [...L[15] || (L[15] = [
                f("Change driver", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0),
            e.row.role !== "main" ? (a(), D(i(ee), {
              key: 2,
              small: "",
              "data-agent-retire": "",
              disabled: W.value || I.value,
              onClick: L[0] || (L[0] = (G) => U("retire"))
            }, {
              default: b(() => [...L[16] || (L[16] = [
                f("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : h("", !0)
          ], 64)) : h("", !0)
        ]),
        p(i(Je), { value: l.value }, {
          job: b(() => [
            p(Vt, {
              task: T.value,
              "onUpdate:task": L[1] || (L[1] = (G) => T.value = G),
              text: r.value,
              "onUpdate:text": L[2] || (L[2] = (G) => r.value = G),
              row: e.row,
              tasks: R.value,
              pending: W.value,
              loading: I.value,
              "more-tasks": H.value,
              failure: j.value,
              "job-ready": le.value,
              onSubmit: k,
              onMore: x,
              onCancel: L[3] || (L[3] = (G) => U(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          driver: b(() => [
            p(Tt, {
              program: n.value,
              "onUpdate:program": L[4] || (L[4] = (G) => n.value = G),
              model: $.value,
              "onUpdate:model": L[5] || (L[5] = (G) => $.value = G),
              pending: W.value,
              onSubmit: A,
              onCancel: L[6] || (L[6] = (G) => U(""))
            }, null, 8, ["program", "model", "pending"])
          ]),
          history: b(() => [
            p(Pt, {
              sessions: q.value,
              onClose: L[7] || (L[7] = (G) => U(""))
            }, null, 8, ["sessions"])
          ]),
          retire: b(() => [
            p(Et, {
              reason: g.value,
              "onUpdate:reason": L[8] || (L[8] = (G) => g.value = G),
              pending: W.value,
              onSubmit: E,
              onCancel: L[9] || (L[9] = (G) => U(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        j.value ? (a(), s("p", Jt, c(j.value), 1)) : h("", !0),
        O.value ? (a(), s("p", Kt, c(O.value), 1)) : h("", !0)
      ], 32);
    };
  }
}, Yt = /* @__PURE__ */ Z(Zt, [["__scopeId", "data-v-ab808fe3"]]), Qt = {
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
        onClick: t[0] || (t[0] = ne((l) => i(Ce)("test_queue:0"), ["stop"]))
      }, [
        f("Waiting: " + c(e.waitReason) + " ", 1),
        p(i(Ee), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), s("span", Xt, "Waiting")) : (a(), D(i(st), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, ea = /* @__PURE__ */ Z(_t, [["__scopeId", "data-v-bb905922"]]), ta = {
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
          p(i(We), {
            at: e.row.retired_at
          }, null, 8, ["at"])
        ])
      ]),
      e.row.retiring_actor_name ? (a(), s("div", na, [
        t[1] || (t[1] = y("dt", null, "Retired by", -1)),
        y("dd", oa, c(e.row.retiring_actor_name), 1)
      ])) : h("", !0)
    ])) : h("", !0);
  }
}, sa = /* @__PURE__ */ Z(la, [["__scopeId", "data-v-900483a5"]]), ia = ["data-agent-delegated", "onClick"], ra = { class: "agent-task-number" }, da = { class: "agent-task-title" }, ua = ["title"], ca = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: o }) {
    const t = o;
    return (l, r) => (a(), D(i(Ke), {
      label: e.section.label,
      count: e.section.tasks.length,
      open: e.open,
      "data-agent-section": e.section.state,
      onToggle: r[0] || (r[0] = (g) => t("toggle"))
    }, {
      default: b(() => [
        (a(!0), s(F, null, oe(e.section.tasks, (g) => (a(), s("button", {
          key: g.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": g.id,
          onClick: (n) => i(Ce)(`tasks:${g.id}`)
        }, [
          p(i(it), {
            status: g.state
          }, null, 8, ["status"]),
          y("span", ra, c(g.id), 1),
          y("span", da, c(g.title), 1),
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
}, ga = /* @__PURE__ */ Z(ca, [["__scopeId", "data-v-dbdcae3e"]]), va = {
  key: 0,
  class: "agent-summary",
  "data-agent-retirement-reason": ""
}, ma = {
  key: 1,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, pa = ["data-peek", "onClick"], fa = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ha = {
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
    }), r = u(() => o.tasks.length ? t.map((k) => ({ state: k, label: k.slice(0, 1).toUpperCase() + k.slice(1), tasks: o.tasks.filter((m) => m.state === k || k === "started" && m.state === "testing" || k === "completed" && m.state === "cancelled") })) : []), g = /* @__PURE__ */ new Set(["completed"]), n = V({}), $ = (k) => !(n.value[k] ?? g.has(k)), T = (k) => n.value = { ...n.value, [k]: $(k) }, R = Oe(), { rows: N } = R.props.reports;
    R.state["reports.agent"] = String(o.row.number);
    const H = u(() => o.row.access === "read-only"), I = ["tasks", "transcript", "terminal", "file-feed", "processes", "reports", "memories"], W = u(() => [...R.tabs].sort((k, m) => (I.indexOf(k.key) < 0 ? I.length : I.indexOf(k.key)) - (I.indexOf(m.key) < 0 ? I.length : I.indexOf(m.key)))), j = u(() => !!o.row.retired_at || o.row.state === "retired"), O = () => H.value || j.value ? W.value.find((k) => k.key === "transcript") : W.value[0], q = V(O());
    ge(q, (k) => {
      R.state.tab = (k == null ? void 0 : k.key) ?? "";
    }, { immediate: !0 }), xe(() => {
      R.state.tab = "";
    }), ge(W, (k) => {
      k.some((m) => {
        var d;
        return m.key === ((d = q.value) == null ? void 0 : d.key);
      }) || (q.value = k[0]);
    }), ge(() => o.open, (k) => {
      k && (q.value = O());
    });
    const Y = Object.fromEntries(R.tabs.filter((k) => k.component).map((k) => [k.key, _e(() => rt(k.component))])), K = V(!1), { data: X } = R.props.tool, le = u(() => {
      var k;
      return ((k = X.value) == null ? void 0 : k.tool) ?? "";
    }), U = u(() => {
      var k;
      return ((k = X.value) == null ? void 0 : k.note) ?? "";
    }), Q = u(() => o.row.role !== "main" && (!o.row.ended_at || o.stoppedWithWork || o.waitReason));
    async function x() {
      !o.open || !Q.value || (R.state["tool.agent"] = String(o.row.number), await R.reload("tool"));
    }
    const v = dt(x, ut.agentCommand), P = R.follow(["hook_call.*", "process_part.*"], (k) => ct(k, "session_agent_id", /* @__PURE__ */ new Set([o.row.id])) && v());
    return xe(() => P == null ? void 0 : P()), ge(() => o.open, (k) => {
      k && x();
    }, { immediate: !0 }), (k, m) => {
      var d;
      return a(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: m[2] || (m[2] = ne(() => {
        }, ["stop"]))
      }, [
        p(sa, { row: e.row }, null, 8, ["row"]),
        e.row.retirement_reason ? (a(), s("p", va, "Retirement reason: " + c(e.row.retirement_reason), 1)) : h("", !0),
        l.value ? (a(), s("p", ma, c(l.value), 1)) : h("", !0),
        p(i(gt), {
          class: "agent-tabs",
          tabs: W.value,
          active: q.value,
          answer: { tasks: e.tasks.length, reports: e.row.report_count ?? i(N).length, memories: e.row.memory_count ?? 0 },
          onChoose: m[0] || (m[0] = (A) => q.value = A)
        }, null, 8, ["tabs", "active", "answer"]),
        p(i(vt), {
          class: "agent-tab-body",
          tab: q.value,
          "data-agent-tab-body": (d = q.value) == null ? void 0 : d.key
        }, {
          default: b(() => {
            var A;
            return [
              p(i(Je), {
                value: (A = q.value) == null ? void 0 : A.key
              }, et({
                reports: b(() => [
                  i(N).length ? h("", !0) : (a(), D(i(Ne), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: b(() => [...m[3] || (m[3] = [
                      f("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (a(!0), s(F, null, oe(i(N), (E) => (a(), s("button", {
                    key: E.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${E.id}`,
                    onClick: (B) => i(Ce)(`messages:${E.id}`)
                  }, c(E.text), 9, pa))), 128))
                ]),
                tasks: b(() => {
                  var E;
                  return [
                    e.tasks.length ? h("", !0) : (a(), D(i(Ne), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: b(() => [...m[4] || (m[4] = [
                        f("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (a(!0), s(F, null, oe(r.value, (B) => (a(), D(ga, {
                      key: B.state,
                      section: B,
                      open: $(B.state),
                      onToggle: (L) => T(B.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (E = e.facts) != null && E.instruction ? (a(), s(F, { key: 1 }, [
                      m[5] || (m[5] = y("p", { class: "agent-label" }, "Instruction", -1)),
                      y("div", fa, c(e.facts.instruction), 1)
                    ], 64)) : h("", !0)
                  ];
                }),
                transcript: b(() => {
                  var E;
                  return [
                    H.value ? (a(), s(F, { key: 0 }, [
                      (E = e.facts) != null && E.instruction ? (a(), s("div", ha, [
                        p(i(Ke), {
                          label: "Instruction",
                          open: K.value,
                          "data-agent-section": "instruction",
                          onToggle: m[1] || (m[1] = (B) => K.value = !K.value)
                        }, {
                          default: b(() => [
                            y("div", ba, c(e.facts.instruction), 1)
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
                oe(i(Y), (E, B) => ({
                  name: B,
                  fn: b(() => [
                    (a(), D(tt(E), {
                      agent: e.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ];
          }),
          _: 1
        }, 8, ["tab", "data-agent-tab-body"]),
        Q.value ? (a(), D(ea, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: le.value,
          note: U.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : h("", !0)
      ]);
    };
  }
}, Ma = /* @__PURE__ */ Z(wa, [["__scopeId", "data-v-83e4209c"]]), $a = { class: "line" }, xa = {
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
    const o = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, l = u(() => o.has(t.state)), r = u(() => [t.doing, t.since, t.seen].filter(Boolean).join(". "));
    return (g, n) => (a(), D(i(Me), {
      as: "button",
      place: "corner",
      class: ue(["agent-dot", { pulse: l.value }]),
      "data-state": e.state,
      "aria-label": r.value,
      "data-agent-status": "",
      onClick: n[0] || (n[0] = ne(() => {
      }, ["stop"]))
    }, {
      tip: b(() => [
        y("b", $a, c(e.doing), 1),
        e.since ? (a(), s("span", xa, c(e.since), 1)) : h("", !0),
        e.seen ? (a(), s("span", Sa, c(e.seen), 1)) : h("", !0)
      ]),
      default: b(() => [
        n[1] || (n[1] = y("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, Ta = /* @__PURE__ */ Z(Ca, [["__scopeId", "data-v-a51f28ad"]]), Aa = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, ja = (e) => e.filter((o) => o.state !== "cancelled"), Ue = (e, o) => e.filter((t) => t.state === o).length, La = 5, Ra = (e, o) => e || o.split(/\s+/).slice(0, La).join(" ");
function Ba({ tasks: e, inHand: o, perHour: t }) {
  const l = ja(e), r = Ue(l, "completed"), g = Aa[o == null ? void 0 : o.state], n = l.filter((N) => N.state === "started").map((N) => ({ number: N.id, title: N.title })), $ = Math.max(n.length, o && o.state !== "completed" ? 1 : 0), T = l.length - r - $, R = r === l.length;
  return {
    number: o.id,
    title: o.title,
    started: n,
    plan: o.plan_id ?? 0,
    count: `${r} of ${l.length}`,
    taskTip: `${r} of its ${l.length} tasks done${g ? `. This one is ${g.words}.` : "."}`,
    countTip: R ? `All ${l.length} tasks done` : `${r} done, ${$} in hand, ${T} to go`,
    paceTip: !R && t ? `About ${t} an hour.` : "",
    rate: !R && t ? `${Math.round(t)}/hour` : "",
    bar: { total: l.length, done: r, testing: Ue(l, "testing") }
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
    return (l, r) => e.job && !t.value ? (a(), s("span", Ia, [
      p(i(Me), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: b(() => [
          y("b", null, c(e.job), 1)
        ]),
        default: b(() => [
          f(c(i(Ra)(e.jobTitle, e.job)), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (a(), s("span", Oa, c(e.jobLaunch), 1)) : h("", !0)
    ])) : t.value ? (a(), s(F, { key: 1 }, [
      y("span", Va, [
        t.value.started.length > 1 ? (a(), s("span", Ha, [
          r[1] || (r[1] = f("Tasks ", -1)),
          (a(!0), s(F, null, oe(t.value.started, (g, n) => (a(), s(F, {
            key: g.number
          }, [
            n ? (a(), s(F, { key: 0 }, [
              f(", ")
            ], 64)) : h("", !0),
            p(i(Me), {
              as: "button",
              class: "task",
              "data-agent-task": "",
              "data-peek": `tasks:${g.number}`,
              "aria-label": `Task ${g.number}: ${g.title}`,
              onClick: ne(($) => i(Ce)(`tasks:${g.number}`), ["stop"])
            }, {
              tip: b(() => [
                y("b", null, c(g.title), 1)
              ]),
              default: b(() => [
                f(c(g.number), 1)
              ]),
              _: 2
            }, 1032, ["data-peek", "aria-label", "onClick"])
          ], 64))), 128))
        ])) : (a(), D(i(Me), {
          key: 1,
          as: "button",
          class: "task",
          "data-agent-task": "",
          "data-peek": `tasks:${t.value.number}`,
          "aria-label": `Task ${t.value.number}: ${t.value.title}`,
          onClick: r[0] || (r[0] = ne((g) => i(Ce)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: b(() => [
            y("b", null, c(t.value.title), 1),
            y("span", null, c(t.value.taskTip), 1)
          ]),
          default: b(() => [
            f("Task " + c(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])),
        t.value.plan ? (a(), s("span", za, "Plan " + c(t.value.plan), 1)) : h("", !0),
        t.value.rate ? (a(), s("span", Ea, c(t.value.rate), 1)) : h("", !0),
        p(i(Me), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: b(() => [
            y("b", null, c(t.value.countTip), 1),
            t.value.paceTip ? (a(), s("span", Na, c(t.value.paceTip), 1)) : h("", !0)
          ]),
          default: b(() => [
            f(c(t.value.count), 1)
          ]),
          _: 1
        })
      ]),
      p(i(mt), {
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: t.value.bar.total,
        done: t.value.bar.done,
        testing: t.value.bar.testing
      }, null, 8, ["total", "done", "testing"])
    ], 64)) : h("", !0);
  }
}, Da = /* @__PURE__ */ Z(Wa, [["__scopeId", "data-v-4fdd9e5c"]]), qa = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Fa = ["data-icon", "stroke-width", "innerHTML"], ae = {
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
      innerHTML: r[l[e.name] || e.name] || r.dot
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
        y("span", null, [
          Se(o.$slots, "default", {}, void 0, !0)
        ]),
        y("small", null, c(e.description), 1)
      ])) : Se(o.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, ke = /* @__PURE__ */ Z(Ga, [["__scopeId", "data-v-9c67fe37"]]), Ja = {}, Ka = { class: "menu-label" };
function Za(e, o) {
  return a(), s("span", Ka, [
    Se(e.$slots, "default", {}, void 0, !0)
  ]);
}
const $e = /* @__PURE__ */ Z(Ja, [["render", Za], ["__scopeId", "data-v-71c11156"]]), Ya = {
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
    const t = e, l = o, r = u(() => t.skills.filter((n) => n.state === "loaded")), g = u(() => t.skills.filter((n) => n.state !== "loaded"));
    return (n, $) => (a(), s("div", Ya, [
      p($e, null, {
        default: b(() => [...$[1] || ($[1] = [
          f("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      r.value.length ? h("", !0) : (a(), s("p", Qa, "None yet. Compacting the conversation empties this list.")),
      (a(!0), s(F, null, oe(r.value, (T) => (a(), s("p", {
        key: T.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        p(ae, {
          name: "book",
          size: 12
        }),
        f(c(T.skill), 1)
      ]))), 128)),
      g.value.length ? (a(), s(F, { key: 1 }, [
        p($e, null, {
          default: b(() => [...$[2] || ($[2] = [
            f("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), s(F, null, oe(g.value, (T) => (a(), s("p", {
          key: T.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          p(ae, {
            name: "book",
            size: 12
          }),
          f(c(T.skill), 1)
        ]))), 128))
      ], 64)) : h("", !0),
      p(ke, {
        "data-agent-skills-browse": "",
        onClick: $[0] || ($[0] = (T) => l("browse"))
      }, {
        default: b(() => [...$[3] || ($[3] = [
          f("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, _a = /* @__PURE__ */ Z(Xa, [["__scopeId", "data-v-27140adf"]]), en = ["disabled", "title"], tn = { class: "gauge usage" }, an = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: o }) {
    const t = e, l = o, r = u(() => t.windows[0] ?? null), g = u(() => r.value && Number.isFinite(r.value.used_percent) ? Math.max(0, Math.min(100, Math.round(r.value.used_percent))) : null), n = u(() => g.value !== null && g.value >= 100), $ = u(() => {
      var R;
      return (R = r.value) != null && R.reset_epoch_seconds ? new Date(r.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), T = u(() => n.value ? `At usage limit: the plan's ${r.value.title} allowance is used up${$.value ? `, starts again ${$.value}` : ""}` : `${g.value}% of the plan's ${r.value.title} allowance used${$.value ? `, starts again ${$.value}` : ""}`);
    return (R, N) => g.value !== null ? (a(), s("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: T.value,
      onClick: N[0] || (N[0] = (H) => l("open", H.currentTarget))
    }, [
      p(ae, {
        name: "allowance",
        size: 12
      }),
      N[1] || (N[1] = f()),
      y("span", tn, [
        y("span", {
          style: Ie({ width: `${g.value}%` })
        }, null, 4)
      ]),
      f(" " + c(n.value ? "At usage limit" : `${g.value}%`), 1)
    ], 8, en)) : h("", !0);
  }
}, nn = /* @__PURE__ */ Z(an, [["__scopeId", "data-v-82d641a0"]]), on = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (o, t) => (a(), s("span", {
      class: ue(["badge", e.tone])
    }, c(e.text), 3));
  }
}, ln = /* @__PURE__ */ Z(on, [["__scopeId", "data-v-6ef74765"]]), sn = (e, o, t) => Math.max(o, Math.min(t, e)), Ye = /* @__PURE__ */ new WeakMap(), rn = (e, o) => Ye.set(e, o);
function dn(e, o) {
  for (let t = o; t; t = Ye.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function un(e, o) {
  const t = (l) => {
    var g, n;
    const r = ((g = e.value) == null ? void 0 : g.element) || ((n = e.value) == null ? void 0 : n.$el) || e.value;
    r && !dn(r, l.target) && o(l);
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
    const l = e, r = V(null), g = (d) => d ? `${d}px` : void 0, n = u(() => ({
      minWidth: g(l.minWidth),
      maxWidth: g(l.maxWidth),
      maxHeight: g(l.maxHeight),
      height: g(l.height)
    })), $ = V({ w: 0, h: 0 }), T = V(l.anchor ? l.anchor.getBoundingClientRect() : null), R = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), N = (d) => ({
      left: Math.max(0, d.left),
      top: Math.max(0, d.top),
      right: Math.min(window.innerWidth, d.right),
      bottom: Math.min(window.innerHeight, d.bottom)
    }), H = (d) => {
      const A = d.closest(".pane, .float-window");
      return A ? N(A.getBoundingClientRect()) : R();
    }, I = (d, A) => `${Math.max(0, d ? Math.min(d, A) : A)}px`;
    function W(d, A) {
      return {
        below: d.bottom - A.bottom - l.gap - be,
        above: A.top - d.top - l.gap - be,
        across: d.right - d.left - 2 * be
      };
    }
    function j(d) {
      const A = H(l.anchor), E = W(A, d);
      return $.value.w <= E.across && $.value.h <= Math.max(E.below, E.above) ? A : R();
    }
    const O = u(() => {
      if (!T.value) return n.value;
      const d = T.value, A = j(d), E = W(A, d), { w: B, h: L } = $.value, ie = l.align === "auto" ? d.left + d.right > A.left + A.right : l.align === "right", G = sn(ie ? d.right - B : d.left, A.left + be, Math.max(A.left + be, A.right - B - be)), _ = L > E.below && E.above > E.below ? { bottom: `${window.innerHeight - d.top + l.gap}px`, maxHeight: I(l.maxHeight, E.above) } : { top: `${d.bottom + l.gap}px`, maxHeight: I(l.maxHeight, E.below) };
      return { ...n.value, ..._, left: `${G}px`, maxWidth: I(l.maxWidth, E.across) };
    }), q = t, Y = () => [...r.value.querySelectorAll("button:not(:disabled)")];
    function K(d) {
      const A = Y(), E = A.indexOf(document.activeElement);
      A[(E + d + A.length) % A.length].focus();
    }
    const X = { ArrowDown: () => K(1), ArrowUp: () => K(-1), Escape: () => q("close") }, le = (d) => X[d.key] && (d.preventDefault(), X[d.key]()), U = () => r.value && ($.value = { w: r.value.offsetWidth, h: r.value.scrollHeight });
    let Q = 0;
    const x = new ResizeObserver(() => {
      cancelAnimationFrame(Q), Q = requestAnimationFrame(U);
    });
    un(r, (d) => l.anchor && !l.anchor.contains(d.target) && q("close"));
    const v = (d, A) => ["top", "left", "right", "bottom"].some((E) => Math.abs(d[E] - A[E]) > 1), P = (d) => d.bottom < 0 || d.top > window.innerHeight;
    let k = 0;
    function m() {
      if (l.anchor) {
        const d = l.anchor.getBoundingClientRect();
        if (!l.anchor.isConnected || P(d)) return q("close");
        v(d, T.value) && (T.value = d);
      }
      k = requestAnimationFrame(m);
    }
    return at(() => {
      l.anchor && r.value && rn(r.value, l.anchor), U(), r.value && x.observe(r.value), !l.plain && Y()[0] && Y()[0].focus(), m();
    }), xe(() => {
      x.disconnect(), cancelAnimationFrame(k), cancelAnimationFrame(Q);
    }), o({ element: r }), (d, A) => (a(), D(nt, {
      to: "body",
      disabled: !e.anchor
    }, [
      y("div", ot({
        ref_key: "panel",
        ref: r
      }, d.$attrs, {
        class: ["menu-panel", { anchored: e.anchor }],
        style: O.value,
        onKeydown: le
      }), [
        Se(d.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), gn = /* @__PURE__ */ Z(cn, [["__scopeId", "data-v-7f046e0d"]]);
async function vn(e, o, t) {
  if (!e) return t(o);
  const { target: l, fields: r } = e, g = Object.fromEntries(Object.keys(r).map((T) => [T, l[T]])), n = () => Object.assign(l, g);
  Object.assign(l, r);
  let $ = !1;
  try {
    const T = await t(o);
    return $ = T.ok, T;
  } finally {
    $ || n();
  }
}
function mn(e, o, t, { groups: l, programs: r }) {
  const g = V({}), n = V(""), $ = V(!1), T = u(() => !!e.value && !e.value.ended_at), R = u(() => T.value && !!e.value.paused_at);
  async function N(j, O = null) {
    n.value = "";
    const q = await vn(O, j, o);
    return n.value = q.ok ? "" : q.error, t(), q;
  }
  return { groups: l, programs: r, chosen: g, failure: n, asking: $, running: T, paused: R, choose: (j, O) => N(["agent", "control", String(e.value.number), j, O.value], { target: g, fields: { value: { ...g.value, [j]: O.label } } }), stop: () => ($.value = !1, N(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (j) => N(["agent", "launch", j.name]) };
}
function pn(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const fn = { compact: "Compaction", clear: "Clear" };
function hn(e) {
  return e != null && e.is_open ? `${fn[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
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
    const t = e, l = o, r = mn(Ve(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => l("changed"), { groups: Ve(t, "controlGroups"), programs: Ve(t, "agentPrograms") }), g = V(null), n = V(""), $ = u(() => r.groups.value.find((x) => x.key === n.value));
    function T(x, v) {
      g.value = x.currentTarget, n.value = v;
    }
    function R() {
      g.value = null, n.value = "", r.asking.value = !1;
    }
    const N = u(() => t.skills.filter((x) => x.state === "loaded"));
    function H(x) {
      T(x, "skills"), l("skills");
    }
    const I = (x) => r.groups.value.some((v) => v.key === x), W = u(() => {
      var x;
      return r.chosen.value.model ?? ((x = O.value) == null ? void 0 : x.model) ?? "";
    }), j = u(() => {
      var x;
      return r.chosen.value.effort ?? ((x = O.value) == null ? void 0 : x.effort) ?? "";
    });
    u(() => !!t.agent && !t.agent.ended_at);
    const O = u(() => {
      var x;
      return ((x = t.usage.agents) == null ? void 0 : x.find((v) => {
        var P;
        return v.id === ((P = t.agent) == null ? void 0 : P.id);
      })) ?? null;
    }), q = u(() => {
      var x;
      return ((x = O.value) == null ? void 0 : x.context_percent) == null ? null : Math.round(O.value.context_percent);
    }), Y = u(() => {
      var x;
      return hn(((x = O.value) == null ? void 0 : x.context_change) ?? null);
    }), K = (x) => `${Math.round(x / 1e3)}k`, X = u(() => {
      var x;
      return !!((x = O.value) != null && x.context_limit_tokens);
    }), le = u(() => {
      var x, v;
      return ((x = O.value) == null ? void 0 : x.context_limit_tokens) || ((v = O.value) == null ? void 0 : v.context_window_tokens) || 0;
    }), U = u(() => le.value ? `${K(O.value.context_tokens ?? 0)} of ${K(le.value)}` : ""), Q = u(() => {
      var x;
      return (x = O.value) != null && x.cost_dollars ? `$${O.value.cost_dollars.toFixed(2)}` : "";
    });
    return (x, v) => {
      var P, k;
      return a(), s("div", {
        class: ue(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (a(), s(F, { key: 0 }, [
          y("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: v[0] || (v[0] = (m) => T(m, "agent"))
          }, [
            p(ae, {
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
          q.value !== null ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${q.value}% full: clear or compact it`,
            onClick: v[2] || (v[2] = (m) => I("context") ? T(m, "context") : l("open", "context", m.currentTarget))
          }, [
            p(ae, {
              name: "gauge",
              size: 12
            }),
            v[14] || (v[14] = f()),
            y("span", yn, [
              y("span", {
                style: Ie({ width: `${q.value}%` })
              }, null, 4)
            ]),
            f(" " + c(q.value) + "% ", 1)
          ], 8, kn)) : (k = O.value) != null && k.context_unknown ? (a(), s("span", wn, [
            p(ae, {
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
            onClick: v[3] || (v[3] = (m) => I("model") ? T(m, "model") : null)
          }, [
            p(ae, {
              name: "model",
              size: 12
            }),
            f(" " + c(W.value), 1)
          ], 8, Mn)) : h("", !0),
          I("effort") || e.card && j.value ? (a(), s("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: v[4] || (v[4] = (m) => T(m, "effort"))
          }, [
            p(ae, {
              name: "bolt",
              size: 12
            }),
            f(" " + c(j.value), 1)
          ], 8, $n)) : h("", !0),
          Q.value ? (a(), s("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: v[5] || (v[5] = (m) => l("open", "cost", m.currentTarget))
          }, c(Q.value), 9, xn)) : h("", !0),
          e.branch ? (a(), s("span", Sn, [
            p(ae, {
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
            p(ae, {
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
            onClick: H
          }, [
            p(ae, {
              name: "book",
              size: 12
            }),
            f(" " + c(N.value.length), 1)
          ])) : h("", !0),
          e.fitness ? (a(), s(F, { key: 8 }, [
            y("button", {
              type: "button",
              class: ue(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < In }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: v[7] || (v[7] = (m) => l("open", "fitness", m.currentTarget))
            }, [
              p(ae, {
                name: "heart",
                size: 12
              }),
              f(" " + c(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            y("button", {
              type: "button",
              class: ue(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: v[8] || (v[8] = (m) => l("open", "load", m.currentTarget))
            }, [
              p(ae, {
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
          onClick: v[9] || (v[9] = (m) => T(m, "start"))
        }, [
          p(ae, {
            name: "agents",
            size: 12
          }),
          v[16] || (v[16] = f(" Start an agent", -1))
        ])) : h("", !0),
        v[22] || (v[22] = y("span", { class: "space" }, null, -1)),
        i(r).failure.value ? (a(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: i(r).failure.value
        }, c(i(r).failure.value), 9, Cn)) : h("", !0),
        Se(x.$slots, "default", {}, void 0, !0),
        g.value ? (a(), D(gn, {
          key: 3,
          anchor: g.value,
          "min-width": 190,
          onClose: R
        }, {
          default: b(() => {
            var m;
            return [
              n.value === "agent" ? (a(), s(F, { key: 0 }, [
                i(r).asking.value ? (a(), s(F, { key: 0 }, [
                  p($e, { "data-agent-stop-ask": "" }, {
                    default: b(() => [...v[17] || (v[17] = [
                      f("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  p(ke, {
                    "data-agent-stop-confirm": "",
                    onClick: v[10] || (v[10] = (d) => (R(), i(r).stop()))
                  }, {
                    default: b(() => [...v[18] || (v[18] = [
                      f("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  p(ke, {
                    onClick: v[11] || (v[11] = (d) => i(r).asking.value = !1)
                  }, {
                    default: b(() => [...v[19] || (v[19] = [
                      f("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (a(), D(ke, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: v[12] || (v[12] = (d) => i(r).asking.value = !0)
                }, {
                  default: b(() => [...v[20] || (v[20] = [
                    f("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : n.value === "start" ? (a(), s(F, { key: 1 }, [
                p($e, null, {
                  default: b(() => [...v[21] || (v[21] = [
                    f("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (a(!0), s(F, null, oe(i(r).programs.value, (d) => (a(), D(ke, {
                  key: d.name,
                  "data-agent-program": d.name,
                  onClick: (A) => (R(), i(r).start(d))
                }, {
                  default: b(() => [
                    f(c(d.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : n.value === "skills" ? (a(), D(_a, {
                key: 2,
                skills: e.skills,
                onBrowse: v[13] || (v[13] = (d) => (R(), l("open", "skills", null)))
              }, null, 8, ["skills"])) : $.value ? (a(), s(F, { key: 3 }, [
                p($e, null, {
                  default: b(() => [
                    f(c($.value.label), 1)
                  ]),
                  _: 1
                }),
                n.value === "context" ? (a(), s(F, { key: 0 }, [
                  y("p", Tn, c(i(pn)(((m = O.value) == null ? void 0 : m.last_compaction) ?? null)), 1),
                  y("div", An, [
                    y("span", jn, [
                      y("span", {
                        style: Ie({ width: `${q.value}%` })
                      }, null, 4)
                    ]),
                    y("span", Ln, c(q.value) + "%", 1)
                  ]),
                  U.value ? (a(), s("p", Rn, [
                    f(c(U.value) + " ", 1),
                    X.value ? (a(), D(ln, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : h("", !0)
                  ])) : h("", !0)
                ], 64)) : h("", !0),
                n.value === "context" && Y.value ? (a(), s("p", Bn, c(Y.value), 1)) : (a(!0), s(F, { key: 2 }, oe($.value.choices, (d) => (a(), D(ke, {
                  key: d.value,
                  "data-agent-choice": d.value,
                  onClick: (A) => (i(r).choose($.value.key, d), R())
                }, {
                  default: b(() => [
                    f(c(d.label), 1)
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
}, Vn = /* @__PURE__ */ Z(On, [["__scopeId", "data-v-f3afd1a9"]]), Hn = ["data-agent-open", "aria-expanded", "role", "tabindex"], zn = {
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
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), l = ["completed", "testing"], r = { helper: "Helper", reviewer: "Reviewer", main: "Main agent" }, g = { running: "Working", starting: "Starting", stopping: "Stopping", ended: "Idle: its process has stopped", failed: "Could not start", never_started: "Not started" }, n = e, $ = o, T = Ze(), R = V(!1), N = u(() => {
      var C, re;
      if ((C = n.facts) != null && C.profile_title) return n.facts.profile_title;
      if ((re = n.facts) != null && re.profile) return n.facts.profile;
      const w = r[n.row.role] || n.row.role;
      return w.slice(0, 1).toUpperCase() + w.slice(1);
    }), H = u(() => {
      var w;
      return ((w = n.facts) == null ? void 0 : w.tasks) ?? [];
    }), I = u(() => H.value.filter((w) => w.state === "open")), W = u(() => H.value.find((w) => {
      var C;
      return w.id === ((C = n.progress) == null ? void 0 : C.task_id) && w.state === "started";
    })), j = u(() => W.value || H.value.find((w) => {
      var C;
      return w.id === ((C = n.facts) == null ? void 0 : C.task_id);
    }) || H.value.find((w) => t.has(w.state)) || I.value[0] || H.value.at(-1)), O = u(() => {
      var w, C, re, ce, te, me;
      return n.row.role === "helper" ? ((w = n.facts) == null ? void 0 : w.helper_job) || "" : (C = n.facts) != null && C.job_enabled && (((re = W.value) == null ? void 0 : re.title) || ((ce = n.facts) == null ? void 0 : ce.task_title) || ((te = I.value[0]) == null ? void 0 : te.title) || ((me = H.value.at(-1)) == null ? void 0 : me.title)) || "";
    }), q = u(() => `${n.row.role} ${n.row.number}`), Y = u(() => {
      var w, C;
      return [n.row.program, (w = n.facts) == null ? void 0 : w.model, (C = n.facts) == null ? void 0 : C.effort, q.value].filter(Boolean).join(" · ");
    }), K = u(() => n.row.role === "main" ? N.value : `${N.value} ${n.row.number}`), X = Oe(), le = u(() => pt(n.row.process_started_at || n.row.created_at, T.value)), U = /* @__PURE__ */ new Set(["open", "started", "testing"]), Q = { fresh: "new conversation", resumed: "resumed" }, x = u(() => {
      var w, C;
      return [(w = n.facts) == null ? void 0 : w.helper_job_program, Q[(C = n.facts) == null ? void 0 : C.occupant_launch]].filter(Boolean).join(", ");
    }), v = u(() => {
      var w;
      return (w = n.facts) == null ? void 0 : w.work_status;
    }), P = u(() => !!n.row.ended_at && n.row.role !== "main" && H.value.some((w) => U.has(w.state))), k = u(() => {
      var w, C;
      return n.row.state === "running" && ((w = n.facts) == null ? void 0 : w.state) === "at usage limit" && !!((C = n.facts) != null && C.usage_limit_ends_at);
    }), m = (w) => new Date(w).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), d = u(() => n.row.halted_at ? `Stopped at the usage limit since ${m(n.row.halted_at)}, goes on at ${m(n.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(n.facts.usage_limit_ends_at).toLocaleString()}`), A = u(() => {
      var w;
      return n.row.retired_at || n.row.state === "retired" ? "retired" : k.value || v.value || n.waitReason || P.value ? "waiting" : n.row.state === "running" && ((w = n.facts) == null ? void 0 : w.state) || n.row.state;
    }), E = u(() => {
      var w;
      return k.value ? d.value : v.value ? `Status: ${v.value}` : n.waitReason ? `Waiting: ${n.waitReason}` : A.value === "blocked" ? (w = n.facts) != null && w.blocked_reason ? `Blocked: ${n.facts.blocked_reason}` : "Blocked" : P.value ? "Stopped with work left" : "";
    }), B = u(() => {
      var w;
      return ((w = n.progress) == null ? void 0 : w.completed_count) ?? H.value.filter((C) => l.includes(C.state)).length;
    }), L = u(() => {
      var w;
      return ft(B.value, ((w = n.progress) == null ? void 0 : w.started_at) || n.row.created_at, n.progress ? n.progress.finished_at : n.row.ended_at, T.value);
    }), ie = u(() => n.row.role === "main" ? 0 : L.value), G = u(() => !!n.row.retired_at || n.row.state === "retired"), ye = u(() => G.value ? "Retired" : A.value === "blocked" || A.value === "waiting" ? E.value || (A.value === "blocked" ? "Blocked" : "Waiting") : g[n.row.standing]), _ = u(() => {
      var C;
      if (G.value) return n.row.retired_at;
      const w = A.value === "blocked" || A.value === "waiting";
      return n.row.ended_at || w && ((C = n.facts) == null ? void 0 : C.last_activity) || n.row.process_started_at || n.row.created_at;
    }), Te = u(() => ht(_.value, T.value)), ve = u(() => {
      var w;
      return bt((w = n.facts) == null ? void 0 : w.last_activity, T.value);
    });
    return (w, C) => {
      var re, ce, te, me, Ae, we, je;
      return a(), s("div", {
        class: ue(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: C[2] || (C[2] = (se) => !e.open && $("toggle")),
        onKeydown: [
          C[3] || (C[3] = qe(ne((se) => !e.open && $("toggle"), ["self", "prevent"]), ["enter"])),
          C[4] || (C[4] = qe(ne((se) => !e.open && $("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        y("div", zn, [
          e.open ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back",
            "aria-label": "Back",
            onClick: C[0] || (C[0] = ne((se) => $("toggle"), ["stop"]))
          }, [
            p(i(Ee), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : h("", !0),
          e.open ? (a(), s(F, { key: 1 }, [
            y("span", En, c(K.value), 1),
            y("span", Nn, c(((re = e.facts) == null ? void 0 : re.given_name) || e.row.id), 1),
            p(i(ee), {
              variant: "ghost",
              small: "",
              class: "agent-menu-button",
              "data-agent-menu": "",
              "aria-expanded": R.value,
              onClick: C[1] || (C[1] = ne((se) => R.value = !R.value, ["stop"]))
            }, {
              default: b(() => [...C[5] || (C[5] = [
                f("Actions", -1)
              ])]),
              _: 1
            }, 8, ["aria-expanded"])
          ], 64)) : (a(), s(F, { key: 2 }, [
            p(i(kt), {
              "agent-id": e.row.id,
              label: N.value,
              class: "agent-who"
            }, {
              default: b(() => {
                var se;
                return [
                  y("span", Wn, c(N.value), 1),
                  y("span", Dn, c(((se = e.facts) == null ? void 0 : se.given_name) || e.row.id), 1)
                ];
              }),
              _: 1
            }, 8, ["agent-id", "label"]),
            p(i(Ee), {
              class: "agent-chevron",
              name: "chevronRight",
              size: 12
            })
          ], 64))
        ]),
        e.open && R.value ? (a(), s("div", qn, [
          p(Yt, {
            row: e.row,
            held: A.value === "blocked"
          }, null, 8, ["row", "held"])
        ])) : h("", !0),
        e.open ? h("", !0) : (a(), s("span", Fn, [
          y("span", Un, c(Y.value), 1),
          (ce = e.facts) != null && ce.sandbox_off ? (a(), s("span", Pn, "sandbox off")) : h("", !0)
        ])),
        e.open && !G.value ? (a(), D(Vn, {
          key: 2,
          class: "agent-live",
          "agent-programs": i(X).props.programs.rows.value,
          agent: e.row,
          branch: (te = e.progress) == null ? void 0 : te.branch,
          usage: { agents: e.facts ? [e.facts] : [], windows: ((me = e.facts) == null ? void 0 : me.windows) ?? [] },
          card: ""
        }, {
          default: b(() => {
            var se, M;
            return [
              (se = e.facts) != null && se.sandbox_off ? (a(), s("span", Gn, "sandbox off")) : h("", !0),
              y("span", Jn, "Run time: " + c(le.value), 1),
              (M = e.facts) != null && M.last_activity ? (a(), s("span", Kn, [
                C[6] || (C[6] = f("Seen: ", -1)),
                p(i(We), {
                  at: e.facts.last_activity
                }, null, 8, ["at"])
              ])) : h("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : h("", !0),
        (Ae = e.facts) != null && Ae.unit_name ? (a(), s("div", Zn, "Unit: " + c(e.facts.unit_name), 1)) : h("", !0),
        e.open ? h("", !0) : (a(), D(Da, {
          key: 4,
          tasks: H.value,
          "in-hand": e.row.role !== "helper" && ((we = e.facts) != null && we.job_enabled) && j.value || null,
          job: e.row.role === "helper" ? O.value : "",
          "job-title": e.row.role === "helper" && ((je = e.facts) == null ? void 0 : je.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? x.value : "",
          "per-hour": ie.value
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour"])),
        p(Ta, {
          state: A.value,
          doing: ye.value,
          since: Te.value,
          seen: ve.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (a(), D(Ma, {
          key: 5,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: H.value,
          "stopped-with-work": P.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : h("", !0)
      ], 42, Hn);
    };
  }
}, Qn = /* @__PURE__ */ Z(Yn, [["__scopeId", "data-v-5ee87cc4"]]), Xn = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, _n = ["data-agent-row", "data-agent-lingering"], Pe = "journal.agents.filters", Ge = 300 * 1e3, Be = "cubic-bezier(0.2, 0.9, 0.25, 1)", eo = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const o = e, t = Oe(), { rows: l } = t.props.waits, { rows: r } = t.props.progress, { rows: g, failure: n, loaded: $, more: T } = t.props.agents, R = (M) => r.value.find((z) => z.agent_id === M.id) ?? null, N = (M) => {
      var z;
      return ((z = l.value.find((S) => S.agent_id === M.id)) == null ? void 0 : z.reason) ?? "";
    }, H = V("running"), I = V(""), W = JSON.parse(localStorage.getItem(Pe) || '{"roles":[],"profiles":[],"programs":[]}'), j = V(W), O = u(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: q } = t.props.programs, Y = u(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), K = (M, z) => {
      j.value = $t(j.value, M, z);
    }, X = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, le = (M) => M.slice(0, 1).toUpperCase() + M.slice(1);
    ge(j, (M) => localStorage.setItem(Pe, JSON.stringify(M)));
    const U = V(25);
    function Q() {
      Object.assign(t.state, {
        "agents.show": H.value,
        "agents.search": I.value,
        "agents.limit": String(U.value),
        "agents.roles": j.value.roles.join(","),
        "agents.profiles": j.value.profiles.join(","),
        "agents.programs": j.value.programs.join(",")
      });
    }
    async function x() {
      return U.value += 25, Q(), await t.reload("agents"), !0;
    }
    ge([H, I, j], () => {
      U.value = 25, Q(), t.reload("agents");
    }), Q();
    const v = (M) => M.facts ?? null, P = g, k = Ze(), m = V([]), d = u(() => new Set(m.value.filter((M) => k.value - M.left < Ge).map((M) => M.row.id))), A = u(() => m.value.filter((M) => d.value.has(M.row.id)).map((M) => M.row)), E = u(() => [...P.value, ...A.value]);
    let B = "", L = [];
    async function ie(M) {
      await t.reload(`card.${M.id}`);
      const z = t.props[`card.${M.id}`].rows.value.find((S) => S.id === M.id);
      z != null && z.ended_at && !m.value.some((S) => S.row.id === M.id) && (m.value = [...m.value, { row: z, left: Date.now() }]);
    }
    ge(g, (M) => {
      const z = B === `${H.value}|${I.value}|${JSON.stringify(j.value)}` && H.value === "running", S = z ? L.filter((J) => !M.some((pe) => pe.id === J.id)) : [];
      B = `${H.value}|${I.value}|${JSON.stringify(j.value)}`, L = M, m.value = z ? m.value.filter((J) => k.value - J.left < Ge && !M.some((pe) => pe.id === J.row.id)) : [], S.forEach(ie);
    }, { immediate: !0 });
    const G = u(() => !!I.value.trim() || Y.value > 0), ye = u(() => o.texts[H.value] ?? { title: o.empty, hint: "" }), _ = V(null), Te = V(null), ve = V(null), w = V(null), C = u(() => _.value === null ? null : t.props[`card.${_.value}`].rows.value.find((M) => M.id === _.value) ?? Te.value), re = u(() => C.value ? [C.value] : E.value), ce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, te = V(!1);
    let me = 0;
    async function Ae(M) {
      if (te.value) return;
      te.value = !0, me = w.value.scrollTop;
      const z = ve.value.querySelector(`[data-agent-open="${M.id}"]`);
      if (!ce()) {
        const fe = [...ve.value.querySelectorAll(".agent-row")].filter((de) => !de.contains(z));
        await Promise.all(fe.map((de) => de.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const S = [...z.querySelectorAll(".agent-head, .agent-line")], J = [...S, ...z.querySelectorAll("[data-agent-motion]")], pe = J.map((fe) => fe.getBoundingClientRect());
      if (Te.value = M, _.value = M.id, t.reload(`card.${M.id}`), await Fe(), !ce()) {
        const fe = J.map((de) => de.getBoundingClientRect());
        J.forEach((de, Le) => {
          const he = S.findIndex((De) => De !== de && De.contains(de)), Qe = pe[Le].left - fe[Le].left - (he < 0 ? 0 : pe[he].left - fe[he].left), Xe = pe[Le].top - fe[Le].top - (he < 0 ? 0 : pe[he].top - fe[he].top);
          de.animate([{ transform: `translate(${Qe}px, ${Xe}px)` }, { transform: "none" }], { duration: 280, easing: Be });
        }), ve.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((de) => {
          de.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Be, fill: "backwards" });
        });
      }
      te.value = !1;
    }
    async function we() {
      if (te.value || !C.value) return;
      te.value = !0;
      const M = ve.value.querySelector(`[data-agent-open="${_.value}"]`), z = [...M.children], S = ce() ? [] : z.map((J) => J.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(S.map((J) => J.finished)), _.value = null, await Fe(), w.value.scrollTop = me, S.forEach((J) => J.cancel()), ce() || (M.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Be }), ve.value.querySelectorAll(".agent-row").forEach((J) => {
        J.contains(M) || J.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Be });
      })), te.value = !1;
    }
    const je = (M) => _.value === M.id ? we() : Ae(M);
    ge(I, (M) => M.trim() && (_.value = null)), ge(H, () => {
      _.value = null;
    });
    const se = (M) => {
      M.key === "Escape" && we();
    };
    return window.addEventListener("keydown", se), xe(() => window.removeEventListener("keydown", se)), (M, z) => (a(), s("div", {
      ref_key: "agents",
      ref: ve,
      class: ue(["agents", { focused: C.value, "card-changing": te.value }])
    }, [
      C.value ? h("", !0) : (a(), D(i(yt), {
        key: 0,
        modelValue: I.value,
        "onUpdate:modelValue": z[1] || (z[1] = (S) => I.value = S),
        placeholder: "Search agents",
        "menu-count": Y.value,
        "data-agents-search": ""
      }, {
        menu: b(() => [
          p(i(He), null, {
            default: b(() => [...z[2] || (z[2] = [
              f("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(F, null, oe(O.value.roles, (S) => (a(), D(i(Re), {
            key: S,
            role: "menuitemcheckbox",
            "aria-checked": j.value.roles.includes(S),
            checked: j.value.roles.includes(S),
            "data-filter-role": S,
            onClick: (J) => K("roles", S)
          }, {
            default: b(() => [
              f(c(le(S)), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-role", "onClick"]))), 128)),
          O.value.profiles.length ? (a(), D(i(He), { key: 0 }, {
            default: b(() => [...z[3] || (z[3] = [
              f("Profile", -1)
            ])]),
            _: 1
          })) : h("", !0),
          (a(!0), s(F, null, oe(O.value.profiles, (S) => (a(), D(i(Re), {
            key: S.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.profiles.includes(S.name),
            checked: j.value.profiles.includes(S.name),
            "data-filter-profile": S.name,
            onClick: (J) => K("profiles", S.name)
          }, {
            default: b(() => [
              f(c(S.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-profile", "onClick"]))), 128)),
          p(i(He), null, {
            default: b(() => [...z[4] || (z[4] = [
              f("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(F, null, oe(i(q), (S) => (a(), D(i(Re), {
            key: S.name,
            role: "menuitemcheckbox",
            "aria-checked": j.value.programs.includes(S.name),
            checked: j.value.programs.includes(S.name),
            "data-filter-program": S.name,
            onClick: (J) => K("programs", S.name)
          }, {
            default: b(() => [
              f(c(S.title), 1)
            ]),
            _: 2
          }, 1032, ["aria-checked", "checked", "data-filter-program", "onClick"]))), 128)),
          Y.value ? (a(), D(i(Re), {
            key: 1,
            "data-filter-clear": "",
            onClick: X
          }, {
            default: b(() => [...z[5] || (z[5] = [
              f("Clear filters", -1)
            ])]),
            _: 1
          })) : h("", !0)
        ]),
        default: b(() => [
          p(i(wt), {
            options: O.value.states,
            value: H.value,
            onPick: z[0] || (z[0] = (S) => H.value = S)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      H.value === "retired" && O.value.upgrade_retired ? (a(), s("p", Xn, "Retired during the upgrade: " + c(O.value.upgrade_retired), 1)) : h("", !0),
      y("div", {
        ref_key: "list",
        ref: w,
        class: ue(["agents-view", { "agents-view-open": C.value }])
      }, [
        i($) && !i(n) && !re.value.length && Y.value ? (a(), D(i(Ne), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: b(() => [
            p(i(ee), {
              small: "",
              "data-empty-clear": "",
              onClick: X
            }, {
              default: b(() => [...z[6] || (z[6] = [
                f("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), D(i(Mt), {
          key: 1,
          moves: "",
          "leaves-at-once": te.value,
          rows: re.value,
          failure: i(n),
          loaded: i($),
          more: !C.value && i(T),
          older: x,
          empty: ye.value.title,
          hint: ye.value.hint,
          searching: G.value
        }, {
          default: b(({ row: S }) => [
            y("div", {
              class: ue(["agent-row", { lingering: d.value.has(S.id) && S.id !== _.value }]),
              "data-agent-row": S.id,
              "data-agent-lingering": d.value.has(S.id) ? "" : null
            }, [
              p(Qn, {
                row: S,
                facts: v(S),
                progress: R(S),
                "wait-reason": N(S),
                open: S.id === _.value,
                onToggle: (J) => je(S)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, _n)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, oo = /* @__PURE__ */ Z(eo, [["__scopeId", "data-v-9815d431"]]);
export {
  oo as A
};
