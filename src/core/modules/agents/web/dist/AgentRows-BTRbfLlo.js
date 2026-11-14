import { openBlock as a, createElementBlock as s, withModifiers as ee, createElementVNode as k, createVNode as v, unref as r, withCtx as p, createTextVNode as f, Fragment as D, renderList as te, toDisplayString as d, createBlock as N, createCommentVNode as b, ref as E, computed as u, watch as ge, onUnmounted as Te, defineAsyncComponent as lt, createSlots as ot, resolveDynamicComponent as st, normalizeClass as de, normalizeStyle as Ie, renderSlot as Ae, onMounted as rt, Teleport as it, mergeProps as dt, toRef as Ee, withDirectives as ut, withKeys as Pe, nextTick as Ue } from "vue";
import { TextInput as Ne, Btn as _, TextArea as ct, TimeAgo as Ze, useWindow as Ve, SwitchCase as Ye, peekRef as ye, Icon as De, RunningCommand as gt, FoldGroup as Xe, TaskStatusIcon as vt, loadWindowComponent as pt, coalesced as mt, READ_RATES as ht, eventMayBeChildOf as ft, InnerTabs as bt, TabBody as kt, EmptyState as We, HoverTip as ke, TaskBar as Ge, useNow as Qe, agentTitle as yt, agentNumber as wt, perHour as Mt, sinceWords as $t, seenWords as xt, AgentTip as St, vContext as Ct, copying as Tt, SearchBar as At, Segmented as jt, MenuLabel as ze, MenuItem as Re, RowList as Bt, toggleFilter as Lt } from "@journal/window-kit";
import { _ as Z, T as Rt } from "./TranscriptRows-Crmxs6Un.js";
const Ot = { class: "action-buttons" }, It = {
  __name: "AgentDriverForm",
  props: { program: String, model: String, pending: Boolean },
  emits: ["submit", "cancel", "update:program", "update:model"],
  setup(e) {
    return (l, t) => (a(), s("form", {
      "data-agent-driver-form": "",
      onSubmit: t[3] || (t[3] = ee((o) => l.$emit("submit"), ["prevent"]))
    }, [
      t[6] || (t[6] = k("p", null, "Starts the next session on this program; the agent keeps its number and memories.", -1)),
      v(r(Ne), {
        "model-value": e.program,
        label: "Program",
        disabled: e.pending,
        "data-agent-driver-program": "",
        "onUpdate:modelValue": t[0] || (t[0] = (o) => l.$emit("update:program", o))
      }, null, 8, ["model-value", "disabled"]),
      v(r(Ne), {
        "model-value": e.model,
        label: "Model",
        disabled: e.pending,
        "data-agent-driver-model": "",
        "onUpdate:modelValue": t[1] || (t[1] = (o) => l.$emit("update:model", o))
      }, null, 8, ["model-value", "disabled"]),
      k("div", Ot, [
        v(r(_), {
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
        v(r(_), {
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
}, Vt = /* @__PURE__ */ Z(It, [["__scopeId", "data-v-c138a4da"]]), Et = { class: "action-field" }, zt = ["value", "disabled"], Ht = ["value"], Nt = { key: 1 }, Dt = {
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
        k("label", Et, [
          t[6] || (t[6] = f("Task ", -1)),
          k("select", {
            value: e.task,
            disabled: e.pending || e.loading,
            "data-agent-job-task": "",
            onChange: t[0] || (t[0] = (o) => l.$emit("update:task", o.target.value))
          }, [
            t[5] || (t[5] = k("option", { value: "" }, "Choose an open task", -1)),
            (a(!0), s(D, null, te(e.tasks, (o) => (a(), s("option", {
              key: o.id,
              value: String(o.id)
            }, d(o.id) + ": " + d(o.title), 9, Ht))), 128))
          ], 40, zt)
        ]),
        e.moreTasks ? (a(), N(r(_), {
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
        }, 8, ["disabled"])) : b("", !0),
        !e.loading && !e.tasks.length && !e.failure ? (a(), s("p", Nt, "No open tasks.")) : b("", !0)
      ], 64)) : (a(), s("label", Dt, [
        t[8] || (t[8] = f("Job", -1)),
        v(r(ct), {
          value: e.text,
          disabled: e.pending,
          "data-agent-job-text": "",
          onInput: t[2] || (t[2] = (o) => l.$emit("update:text", o.target.value))
        }, null, 8, ["value", "disabled"])
      ])),
      k("div", Wt, [
        v(r(_), {
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
        v(r(_), {
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
}, Ft = /* @__PURE__ */ Z(qt, [["__scopeId", "data-v-adde4158"]]), Pt = { class: "action-buttons" }, Ut = {
  __name: "AgentRetireForm",
  props: { reason: String, pending: Boolean },
  emits: ["submit", "cancel", "update:reason"],
  setup(e) {
    return (l, t) => (a(), s("form", {
      "data-agent-retire-confirm": "",
      onSubmit: t[2] || (t[2] = ee((o) => l.$emit("submit"), ["prevent"]))
    }, [
      t[5] || (t[5] = k("p", null, "Retirement is permanent. This agent cannot be resumed. Its record, its memories and its number stay.", -1)),
      v(r(Ne), {
        "model-value": e.reason,
        label: "Reason",
        disabled: e.pending,
        "data-agent-retire-reason": "",
        "onUpdate:modelValue": t[0] || (t[0] = (o) => l.$emit("update:reason", o))
      }, null, 8, ["model-value", "disabled"]),
      k("div", Pt, [
        v(r(_), {
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
        v(r(_), {
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
}, Gt = /* @__PURE__ */ Z(Ut, [["__scopeId", "data-v-92de7dd6"]]), Jt = {
  class: "session-history",
  "data-agent-session-history": ""
}, Kt = { key: 0 }, Zt = { key: 0 }, Yt = { "data-agent-session-state": "" }, Xt = { class: "action-buttons" }, Qt = {
  __name: "AgentSessionHistory",
  props: { sessions: { type: Array, required: !0 } },
  emits: ["close"],
  setup(e) {
    return (l, t) => (a(), s("div", Jt, [
      e.sessions.length ? b("", !0) : (a(), s("p", Kt, "This agent has no session in its history.")),
      k("ol", null, [
        (a(!0), s(D, null, te(e.sessions, (o) => (a(), s("li", {
          key: o.session,
          "data-agent-session": ""
        }, [
          k("span", null, d([o.program, o.model].filter(Boolean).join(" ")), 1),
          o.started_at ? (a(), s("span", Zt, [
            t[1] || (t[1] = f("Started ", -1)),
            v(r(Ze), {
              at: o.started_at
            }, null, 8, ["at"])
          ])) : b("", !0),
          k("span", Yt, d(o.end_reason ? `Ended: ${o.end_reason.replaceAll("_", " ")}` : o.started_at ? "Running" : "Not started"), 1),
          k("code", null, d(o.session), 1)
        ]))), 128))
      ]),
      k("div", Xt, [
        v(r(_), {
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
}, _t = /* @__PURE__ */ Z(Qt, [["__scopeId", "data-v-0d688bd9"]]), ea = { class: "action-buttons" }, ta = {
  key: 0,
  role: "alert"
}, aa = {
  key: 1,
  role: "status"
}, na = {
  __name: "AgentActions",
  props: { row: { type: Object, required: !0 }, held: { type: Boolean, default: !1 } },
  setup(e) {
    const l = e, t = Ve(), o = E(""), i = E(""), n = E(""), y = E(""), S = E(""), R = E(""), T = E([]), I = E(0), F = E(!1), z = E(!1), H = E(!1), j = E(""), V = E(""), q = E([]), Y = u(() => !!l.row.retired_at || l.row.state === "retired"), G = u(() => !Y.value && !!l.row.ended_at), Q = u(() => {
      var M;
      return G.value && ((M = l.row.job_command) == null ? void 0 : M.length) && !l.row.resume_reason;
    }), ae = u(() => Q.value && !z.value && (l.row.job_task_flag ? T.value.some((M) => String(M.id) === R.value) : !!i.value.trim()));
    function P(M) {
      o.value = M, i.value = "", n.value = "", R.value = "", j.value = "", V.value = "";
    }
    async function X() {
      P("job"), l.row.job_task_flag && (T.value = [], I.value = 0, F.value = !1, await $());
    }
    async function $() {
      if (!z.value) {
        z.value = !0;
        try {
          t.state["jobs.page"] = String(I.value + 1), await t.reload("jobs");
          const M = t.props.jobs;
          j.value = M.failure.value, j.value || (T.value = [...T.value, ...M.rows.value], I.value = M.data.value.page, F.value = M.more.value);
        } finally {
          z.value = !1;
        }
      }
    }
    async function g() {
      await K(["process", "lift-hold", String(l.row.number)], "Hold lifted.");
    }
    async function K(M, A) {
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
    async function h() {
      if (!ae.value) return;
      const M = l.row.job_task_flag ? [l.row.job_task_flag, R.value] : [i.value.trim()];
      await K([...l.row.job_command, String(l.row.number), ...M], "Job sent.");
    }
    async function m() {
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
      P("driver"), y.value = l.row.program || "", S.value = "";
    }
    async function c() {
      !G.value || o.value !== "driver" || !y.value.trim() || !S.value.trim() || await K(["agent", "driver", String(l.row.number), "--program", y.value.trim(), "--model", S.value.trim()], "Driver changed.");
    }
    async function B() {
      !G.value || o.value !== "retire" || !n.value.trim() || await K(["agent", "retire", String(l.row.number), "--reason", n.value.trim()], "Agent retired permanently.");
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
        k("div", ea, [
          v(r(_), {
            small: "",
            "data-agent-history": "",
            disabled: H.value || z.value,
            onClick: m
          }, {
            default: p(() => [...A[12] || (A[12] = [
              f("Session history", -1)
            ])]),
            _: 1
          }, 8, ["disabled"]),
          e.held ? (a(), N(r(_), {
            key: 0,
            small: "",
            "data-agent-lift-hold": "",
            disabled: H.value,
            onClick: g
          }, {
            default: p(() => [...A[13] || (A[13] = [
              f("Lift this hold", -1)
            ])]),
            _: 1
          }, 8, ["disabled"])) : b("", !0),
          G.value ? (a(), s(D, { key: 1 }, [
            (ie = e.row.job_command) != null && ie.length ? (a(), N(r(_), {
              key: 0,
              small: "",
              "data-agent-send-job": "",
              disabled: H.value || z.value || !Q.value,
              onClick: X
            }, {
              default: p(() => [...A[14] || (A[14] = [
                f("Send a job", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : b("", !0),
            e.row.role !== "main" ? (a(), N(r(_), {
              key: 1,
              small: "",
              "data-agent-driver": "",
              disabled: H.value || z.value,
              onClick: W
            }, {
              default: p(() => [...A[15] || (A[15] = [
                f("Change driver", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : b("", !0),
            e.row.role !== "main" ? (a(), N(r(_), {
              key: 2,
              small: "",
              "data-agent-retire": "",
              disabled: H.value || z.value,
              onClick: A[0] || (A[0] = (U) => P("retire"))
            }, {
              default: p(() => [...A[16] || (A[16] = [
                f("Retire", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])) : b("", !0)
          ], 64)) : b("", !0)
        ]),
        v(r(Ye), { value: o.value }, {
          job: p(() => [
            v(Ft, {
              task: R.value,
              "onUpdate:task": A[1] || (A[1] = (U) => R.value = U),
              text: i.value,
              "onUpdate:text": A[2] || (A[2] = (U) => i.value = U),
              row: e.row,
              tasks: T.value,
              pending: H.value,
              loading: z.value,
              "more-tasks": F.value,
              failure: j.value,
              "job-ready": ae.value,
              onSubmit: h,
              onMore: $,
              onCancel: A[3] || (A[3] = (U) => P(""))
            }, null, 8, ["task", "text", "row", "tasks", "pending", "loading", "more-tasks", "failure", "job-ready"])
          ]),
          driver: p(() => [
            v(Vt, {
              program: y.value,
              "onUpdate:program": A[4] || (A[4] = (U) => y.value = U),
              model: S.value,
              "onUpdate:model": A[5] || (A[5] = (U) => S.value = U),
              pending: H.value,
              onSubmit: c,
              onCancel: A[6] || (A[6] = (U) => P(""))
            }, null, 8, ["program", "model", "pending"])
          ]),
          history: p(() => [
            v(_t, {
              sessions: q.value,
              onClose: A[7] || (A[7] = (U) => P(""))
            }, null, 8, ["sessions"])
          ]),
          retire: p(() => [
            v(Gt, {
              reason: n.value,
              "onUpdate:reason": A[8] || (A[8] = (U) => n.value = U),
              pending: H.value,
              onSubmit: B,
              onCancel: A[9] || (A[9] = (U) => P(""))
            }, null, 8, ["reason", "pending"])
          ]),
          _: 1
        }, 8, ["value"]),
        j.value ? (a(), s("p", ta, d(j.value), 1)) : b("", !0),
        V.value ? (a(), s("p", aa, d(V.value), 1)) : b("", !0)
      ], 32);
    };
  }
}, la = /* @__PURE__ */ Z(na, [["__scopeId", "data-v-8712e475"]]), oa = {
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
        onClick: t[0] || (t[0] = ee((o) => r(ye)("test_queue:0"), ["stop"]))
      }, [
        f("Waiting: " + d(e.waitReason) + " ", 1),
        v(r(De), {
          name: "arrow",
          size: 11
        })
      ])) : e.stopped ? (a(), s("span", sa, "Waiting")) : (a(), N(r(gt), {
        key: 2,
        text: e.command,
        idle: e.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, ia = /* @__PURE__ */ Z(ra, [["__scopeId", "data-v-1b371fb5"]]), da = {
  key: 0,
  class: "lasting-facts",
  "data-agent-lasting-facts": ""
}, ua = { "data-agent-retired-at": "" }, ca = { key: 0 }, ga = { "data-agent-retired-by": "" }, va = {
  __name: "AgentLastingFacts",
  props: { row: { type: Object, required: !0 } },
  setup(e) {
    return (l, t) => e.row.retired_at ? (a(), s("dl", da, [
      k("div", null, [
        t[0] || (t[0] = k("dt", null, "Retired", -1)),
        k("dd", ua, [
          v(r(Ze), {
            at: e.row.retired_at
          }, null, 8, ["at"])
        ])
      ]),
      e.row.retiring_actor_name ? (a(), s("div", ca, [
        t[1] || (t[1] = k("dt", null, "Retired by", -1)),
        k("dd", ga, d(e.row.retiring_actor_name), 1)
      ])) : b("", !0)
    ])) : b("", !0);
  }
}, pa = /* @__PURE__ */ Z(va, [["__scopeId", "data-v-c5c81429"]]), ma = ["data-agent-delegated", "onClick"], ha = { class: "agent-task-number" }, fa = { class: "agent-task-title" }, ba = ["title"], ka = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const t = l;
    return (o, i) => (a(), N(r(Xe), {
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
          onClick: (y) => r(ye)(`tasks:${n.id}`)
        }, [
          v(r(vt), {
            status: n.state
          }, null, 8, ["status"]),
          k("span", ha, d(n.id), 1),
          k("span", fa, d(n.title), 1),
          n.plan_id ? (a(), s("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${n.plan_id}: ${n.plan_title}`
          }, "Plan " + d(n.plan_id), 9, ba)) : b("", !0)
        ], 8, ma))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, ya = /* @__PURE__ */ Z(ka, [["__scopeId", "data-v-ea4ccd6b"]]), wa = {
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
    const l = e, t = ["started", "blocked", "open", "completed"], o = u(() => {
      var h, m;
      return l.row.ended_at && ((m = (h = l.facts) == null ? void 0 : h.job_returned) != null && m.startsWith(Aa)) ? l.facts.job_returned : "";
    }), i = u(() => l.tasks.length ? t.map((h) => ({ state: h, label: h.slice(0, 1).toUpperCase() + h.slice(1), tasks: l.tasks.filter((m) => m.state === h || h === "started" && m.state === "testing" || h === "completed" && m.state === "cancelled") })) : []), n = /* @__PURE__ */ new Set(["completed"]), y = E({}), S = (h) => !(y.value[h] ?? n.has(h)), R = (h) => y.value = { ...y.value, [h]: S(h) }, T = Ve(), { rows: I } = T.props.reports;
    T.state["reports.agent"] = String(l.row.number);
    const F = u(() => l.row.access === "read-only"), z = ["tasks", "transcript", "terminal", "file-feed", "processes", "reports", "memories"], H = u(() => [...T.tabs].sort((h, m) => (z.indexOf(h.key) < 0 ? z.length : z.indexOf(h.key)) - (z.indexOf(m.key) < 0 ? z.length : z.indexOf(m.key)))), j = u(() => !!l.row.retired_at || l.row.state === "retired"), V = () => F.value || j.value ? H.value.find((h) => h.key === "transcript") : H.value[0], q = E(V());
    ge(q, (h) => {
      T.state.tab = (h == null ? void 0 : h.key) ?? "";
    }, { immediate: !0 }), Te(() => {
      T.state.tab = "";
    }), ge(H, (h) => {
      h.some((m) => {
        var W;
        return m.key === ((W = q.value) == null ? void 0 : W.key);
      }) || (q.value = h[0]);
    }), ge(() => l.open, (h) => {
      h && (q.value = V());
    });
    const Y = Object.fromEntries(T.tabs.filter((h) => h.component).map((h) => [h.key, lt(() => pt(h.component))])), G = E(!1), { data: Q } = T.props.tool, ae = u(() => {
      var h;
      return ((h = Q.value) == null ? void 0 : h.tool) ?? "";
    }), P = u(() => {
      var h;
      return ((h = Q.value) == null ? void 0 : h.note) ?? "";
    }), X = u(() => l.row.role !== "main" && (!l.row.ended_at || l.stoppedWithWork || l.waitReason));
    async function $() {
      !l.open || !X.value || (T.state["tool.agent"] = String(l.row.number), await T.reload("tool"));
    }
    const g = mt($, ht.agentCommand), K = T.follow(["hook_call.*", "process_part.*"], (h) => ft(h, "session_agent_id", /* @__PURE__ */ new Set([l.row.id])) && g());
    return Te(() => K == null ? void 0 : K()), ge(() => l.open, (h) => {
      h && $();
    }, { immediate: !0 }), (h, m) => {
      var W;
      return a(), s("div", {
        class: "agent-more",
        "data-agent-more": "",
        onClick: m[2] || (m[2] = ee(() => {
        }, ["stop"]))
      }, [
        v(pa, { row: e.row }, null, 8, ["row"]),
        e.row.retirement_reason ? (a(), s("p", wa, "Retirement reason: " + d(e.row.retirement_reason), 1)) : b("", !0),
        o.value ? (a(), s("p", Ma, d(o.value), 1)) : b("", !0),
        v(r(bt), {
          class: "agent-tabs",
          tabs: H.value,
          active: q.value,
          answer: { tasks: e.tasks.length, reports: e.row.report_count ?? r(I).length, memories: e.row.memory_count ?? 0 },
          onChoose: m[0] || (m[0] = (c) => q.value = c)
        }, null, 8, ["tabs", "active", "answer"]),
        v(r(kt), {
          class: "agent-tab-body",
          tab: q.value,
          "data-agent-tab-body": (W = q.value) == null ? void 0 : W.key
        }, {
          default: p(() => {
            var c;
            return [
              v(r(Ye), {
                value: (c = q.value) == null ? void 0 : c.key
              }, ot({
                reports: p(() => [
                  r(I).length ? b("", !0) : (a(), N(r(We), {
                    key: 0,
                    title: "No reports"
                  }, {
                    default: p(() => [...m[3] || (m[3] = [
                      f("This agent has not sent any reports.", -1)
                    ])]),
                    _: 1
                  })),
                  (a(!0), s(D, null, te(r(I), (B) => (a(), s("button", {
                    key: B.id,
                    type: "button",
                    class: "agent-report",
                    "data-peek": `messages:${B.id}`,
                    onClick: (M) => r(ye)(`messages:${B.id}`)
                  }, d(B.text), 9, $a))), 128))
                ]),
                tasks: p(() => {
                  var B;
                  return [
                    e.tasks.length ? b("", !0) : (a(), N(r(We), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: p(() => [...m[4] || (m[4] = [
                        f("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (a(!0), s(D, null, te(i.value, (M) => (a(), N(ya, {
                      key: M.state,
                      section: M,
                      open: S(M.state),
                      onToggle: (A) => R(M.state)
                    }, null, 8, ["section", "open", "onToggle"]))), 128)),
                    (B = e.facts) != null && B.instruction ? (a(), s(D, { key: 1 }, [
                      m[5] || (m[5] = k("p", { class: "agent-label" }, "Instruction", -1)),
                      k("div", xa, d(e.facts.instruction), 1)
                    ], 64)) : b("", !0)
                  ];
                }),
                transcript: p(() => {
                  var B;
                  return [
                    F.value ? (a(), s(D, { key: 0 }, [
                      (B = e.facts) != null && B.instruction ? (a(), s("div", Sa, [
                        v(r(Xe), {
                          label: "Instruction",
                          open: G.value,
                          "data-agent-section": "instruction",
                          onToggle: m[1] || (m[1] = (M) => G.value = !G.value)
                        }, {
                          default: p(() => [
                            k("div", Ca, d(e.facts.instruction), 1)
                          ]),
                          _: 1
                        }, 8, ["open"])
                      ])) : e.facts && e.row.ended_at ? (a(), s("p", Ta, "No job recorded")) : b("", !0)
                    ], 64)) : b("", !0),
                    v(Rt, {
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
                    (a(), N(st(B), {
                      agent: e.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ];
          }),
          _: 1
        }, 8, ["tab", "data-agent-tab-body"]),
        X.value ? (a(), N(ia, {
          key: 2,
          class: "agent-command",
          "wait-reason": e.waitReason,
          stopped: e.stoppedWithWork,
          command: ae.value,
          note: P.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : b("", !0)
      ]);
    };
  }
}, Ba = /* @__PURE__ */ Z(ja, [["__scopeId", "data-v-fabbecdf"]]), La = { class: "line" }, Ra = {
  key: 0,
  class: "line",
  "data-agent-since": ""
}, Oa = {
  key: 1,
  class: "line",
  "data-agent-seen": ""
}, Ia = {
  __name: "AgentStatusDot",
  props: { state: { type: String, default: "" }, doing: { type: String, required: !0 }, since: { type: String, default: "" }, seen: { type: String, default: "" } },
  setup(e) {
    const l = /* @__PURE__ */ new Set(["running", "working", "thinking"]), t = e, o = u(() => l.has(t.state)), i = u(() => [t.doing, t.since, t.seen].filter(Boolean).join(". "));
    return (n, y) => (a(), N(r(ke), {
      as: "button",
      place: "corner",
      class: de(["agent-dot", { pulse: o.value }]),
      "data-state": e.state,
      "aria-label": i.value,
      "data-agent-status": "",
      onClick: y[0] || (y[0] = ee(() => {
      }, ["stop"]))
    }, {
      tip: p(() => [
        k("b", La, d(e.doing), 1),
        e.since ? (a(), s("span", Ra, d(e.since), 1)) : b("", !0),
        e.seen ? (a(), s("span", Oa, d(e.seen), 1)) : b("", !0)
      ]),
      default: p(() => [
        y[1] || (y[1] = k("i", null, null, -1))
      ]),
      _: 1
    }, 8, ["class", "data-state", "aria-label"]));
  }
}, Va = /* @__PURE__ */ Z(Ia, [["__scopeId", "data-v-1a0bc478"]]), Ea = { started: { words: "started" }, testing: { words: "being tested" }, blocked: { words: "blocked" } }, za = (e) => e.filter((l) => l.state !== "cancelled"), He = (e, l) => e.filter((t) => t.state === l).length, Ha = 5, Na = (e, l) => e || l.split(/\s+/).slice(0, Ha).join(" ");
function Da({ tasks: e, inHand: l, perHour: t }) {
  const o = za(e), i = He(o, "completed"), n = Ea[l == null ? void 0 : l.state], y = o.filter((I) => I.state === "started").map((I) => ({ number: I.id, title: I.title })), S = Math.max(y.length, l && l.state !== "completed" ? 1 : 0), R = o.length - i - S, T = i === o.length;
  return {
    number: l.id,
    title: l.title,
    started: y,
    plan: l.plan_id ?? 0,
    planTitle: l.plan_title ?? "",
    count: `${i} of ${o.length}`,
    taskTip: `${i} of its ${o.length} tasks done${n ? `. This one is ${n.words}.` : "."}`,
    countTip: T ? `All ${o.length} tasks done` : `${i} done, ${S} in hand, ${R} to go`,
    paceTip: !T && t ? `About ${t} an hour.` : "",
    rate: !T && t ? `${Math.round(t)}/hour` : "",
    bar: { total: o.length, done: i, testing: He(o, "testing"), started: He(o, "started") }
  };
}
const Wa = {
  key: 0,
  class: "task-line",
  "data-agent-task-line": ""
}, qa = {
  key: 0,
  class: "plan",
  "data-agent-job-launch": ""
}, Fa = {
  class: "task-line",
  "data-agent-task-line": ""
}, Pa = {
  key: 1,
  class: "tasks",
  "data-agent-tasks": ""
}, Ua = {
  key: 2,
  class: "tasks",
  "data-agent-tasks": ""
}, Ga = {
  key: 4,
  class: "rate",
  "data-agent-rate": ""
}, Ja = { key: 0 }, Ka = 3, Za = {
  __name: "AgentTaskLine",
  props: { tasks: { type: Array, default: () => [] }, inHand: { type: Object, default: null }, job: { type: String, default: "" }, jobTitle: { type: String, default: "" }, jobLaunch: { type: String, default: "" }, perHour: { type: Number, default: 0 }, countsEmpty: { type: Boolean, default: !1 } },
  setup(e) {
    const l = e, t = u(() => l.inHand ? Da({ tasks: l.tasks, inHand: l.inHand, perHour: l.perHour }) : null);
    return (o, i) => e.job && !t.value ? (a(), s("span", Wa, [
      v(r(ke), {
        as: "button",
        class: "task",
        "data-agent-job": ""
      }, {
        tip: p(() => [
          k("b", null, d(e.job), 1)
        ]),
        default: p(() => [
          f(d(r(Na)(e.jobTitle, e.job)), 1)
        ]),
        _: 1
      }),
      e.jobLaunch ? (a(), s("span", qa, d(e.jobLaunch), 1)) : b("", !0)
    ])) : t.value ? (a(), s(D, { key: 1 }, [
      k("span", Fa, [
        t.value.plan ? (a(), N(r(ke), {
          key: 0,
          as: "button",
          class: "task",
          "data-agent-plan": "",
          "data-peek": `plans:${t.value.plan}`,
          "aria-label": `Plan ${t.value.plan}: ${t.value.planTitle}`,
          onClick: i[0] || (i[0] = ee((n) => r(ye)(`plans:${t.value.plan}`), ["stop"]))
        }, {
          tip: p(() => [
            k("b", null, d(t.value.planTitle), 1),
            k("span", null, "Task " + d(t.value.number) + ": " + d(t.value.title), 1)
          ]),
          default: p(() => [
            f("Plan " + d(t.value.plan), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])) : t.value.started.length > Ka ? (a(), s("span", Pa, [
          v(r(ke), {
            as: "button",
            class: "task",
            "data-agent-task-count": "",
            "aria-label": `Tasks: ${t.value.started.length}`
          }, {
            tip: p(() => [
              (a(!0), s(D, null, te(t.value.started, (n) => (a(), s("b", {
                key: n.number,
                class: "listed",
                "data-agent-task-listed": ""
              }, d(n.number) + " " + d(n.title), 1))), 128))
            ]),
            default: p(() => [
              f("Tasks: " + d(t.value.started.length), 1)
            ]),
            _: 1
          }, 8, ["aria-label"])
        ])) : t.value.started.length > 1 ? (a(), s("span", Ua, [
          i[2] || (i[2] = f("Tasks ", -1)),
          (a(!0), s(D, null, te(t.value.started, (n, y) => (a(), s(D, {
            key: n.number
          }, [
            y ? (a(), s(D, { key: 0 }, [
              f(", ")
            ], 64)) : b("", !0),
            v(r(ke), {
              as: "button",
              class: "task",
              "data-agent-task": "",
              "data-peek": `tasks:${n.number}`,
              "aria-label": `Task ${n.number}: ${n.title}`,
              onClick: ee((S) => r(ye)(`tasks:${n.number}`), ["stop"])
            }, {
              tip: p(() => [
                k("b", null, d(n.title), 1)
              ]),
              default: p(() => [
                f(d(n.number), 1)
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
          onClick: i[1] || (i[1] = ee((n) => r(ye)(`tasks:${t.value.number}`), ["stop"]))
        }, {
          tip: p(() => [
            k("b", null, d(t.value.title), 1),
            k("span", null, d(t.value.taskTip), 1)
          ]),
          default: p(() => [
            f("Task " + d(t.value.number), 1)
          ]),
          _: 1
        }, 8, ["data-peek", "aria-label"])),
        t.value.rate ? (a(), s("span", Ga, d(t.value.rate), 1)) : b("", !0),
        v(r(ke), {
          class: "count",
          tabindex: "0",
          place: "right",
          "data-agent-count": ""
        }, {
          tip: p(() => [
            k("b", null, d(t.value.countTip), 1),
            t.value.paceTip ? (a(), s("span", Ja, d(t.value.paceTip), 1)) : b("", !0)
          ]),
          default: p(() => [
            f(d(t.value.count), 1)
          ]),
          _: 1
        })
      ]),
      v(r(Ge), {
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: t.value.bar.total,
        done: t.value.bar.done,
        testing: t.value.bar.testing,
        started: t.value.bar.started
      }, null, 8, ["total", "done", "testing", "started"])
    ], 64)) : e.countsEmpty ? (a(), s(D, { key: 2 }, [
      i[3] || (i[3] = k("span", {
        class: "task-line",
        "data-agent-task-line": ""
      }, [
        k("span", {
          class: "task",
          "data-agent-no-task": ""
        }, "No task"),
        k("span", {
          class: "count",
          "data-agent-count": ""
        }, "0 of 0")
      ], -1)),
      v(r(Ge), {
        class: "bar",
        "data-agent-bar": "",
        "aria-hidden": "true",
        total: 0,
        done: 0,
        testing: 0,
        started: 0
      })
    ], 64)) : b("", !0);
  }
}, Ya = /* @__PURE__ */ Z(Za, [["__scopeId", "data-v-5fa60f08"]]), Xa = '<circle cx="8" cy="5.3" r="2.5"/><path d="M3 13.5c0-2.8 2.2-4.6 5-4.6s5 1.8 5 4.6"/>', Qa = ["data-icon", "stroke-width", "innerHTML"], oe = {
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
      agent: Xa,
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
    return (n, y) => (a(), s("svg", {
      class: "ico",
      "data-icon": e.name,
      style: Ie({
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
    }, null, 12, Qa));
  }
}, _a = {
  key: 0,
  class: "menu-item-check",
  "aria-hidden": "true"
}, en = {
  key: 1,
  class: "menu-item-text"
}, tn = {
  __name: "MenuItem",
  props: { on: Boolean, danger: Boolean, checked: { type: Boolean, default: null }, description: { type: String, default: "" } },
  setup(e) {
    return (l, t) => (a(), s("button", {
      type: "button",
      class: de(["menu-item", { on: e.on, danger: e.danger, described: e.description }])
    }, [
      e.checked !== null ? (a(), s("span", _a, d(e.checked ? "✓" : ""), 1)) : b("", !0),
      e.description ? (a(), s("span", en, [
        k("span", null, [
          Ae(l.$slots, "default", {}, void 0, !0)
        ]),
        k("small", null, d(e.description), 1)
      ])) : Ae(l.$slots, "default", {}, void 0, !0, 2)
    ], 2));
  }
}, Se = /* @__PURE__ */ Z(tn, [["__scopeId", "data-v-fec99974"]]), an = {}, nn = { class: "menu-label" };
function ln(e, l) {
  return a(), s("span", nn, [
    Ae(e.$slots, "default", {}, void 0, !0)
  ]);
}
const Ce = /* @__PURE__ */ Z(an, [["render", ln], ["__scopeId", "data-v-aa955b3e"]]), on = {
  class: "skills-menu",
  "data-agent-skills-menu": ""
}, sn = {
  key: 0,
  class: "skills-none"
}, rn = {
  __name: "AgentSkillsMenu",
  props: { skills: { type: Array, required: !0 } },
  emits: ["browse"],
  setup(e, { emit: l }) {
    const t = e, o = l, i = u(() => t.skills.filter((y) => y.state === "loaded")), n = u(() => t.skills.filter((y) => y.state !== "loaded"));
    return (y, S) => (a(), s("div", on, [
      v(Ce, null, {
        default: p(() => [...S[1] || (S[1] = [
          f("Read in this conversation", -1)
        ])]),
        _: 1
      }),
      i.value.length ? b("", !0) : (a(), s("p", sn, "None yet. Compacting the conversation empties this list.")),
      (a(!0), s(D, null, te(i.value, (R) => (a(), s("p", {
        key: R.id,
        class: "skill-line",
        "data-agent-skill-read": ""
      }, [
        v(oe, {
          name: "book",
          size: 12
        }),
        f(d(R.skill), 1)
      ]))), 128)),
      n.value.length ? (a(), s(D, { key: 1 }, [
        v(Ce, null, {
          default: p(() => [...S[2] || (S[2] = [
            f("Still to read", -1)
          ])]),
          _: 1
        }),
        (a(!0), s(D, null, te(n.value, (R) => (a(), s("p", {
          key: R.id,
          class: "skill-line waiting",
          "data-agent-skill-waiting": ""
        }, [
          v(oe, {
            name: "book",
            size: 12
          }),
          f(d(R.skill), 1)
        ]))), 128))
      ], 64)) : b("", !0),
      v(Se, {
        "data-agent-skills-browse": "",
        onClick: S[0] || (S[0] = (R) => o("browse"))
      }, {
        default: p(() => [...S[3] || (S[3] = [
          f("Browse every skill", -1)
        ])]),
        _: 1
      })
    ]));
  }
}, dn = /* @__PURE__ */ Z(rn, [["__scopeId", "data-v-be514d47"]]), un = ["disabled", "title"], cn = { class: "gauge usage" }, gn = {
  __name: "AllowanceBar",
  props: { windows: { type: Array, default: () => [] }, disabled: Boolean },
  emits: ["open"],
  setup(e, { emit: l }) {
    const t = e, o = l, i = u(() => t.windows[0] ?? null), n = u(() => i.value && Number.isFinite(i.value.used_percent) ? Math.max(0, Math.min(100, Math.round(i.value.used_percent))) : null), y = u(() => n.value !== null && n.value >= 100), S = u(() => {
      var T;
      return (T = i.value) != null && T.reset_epoch_seconds ? new Date(i.value.reset_epoch_seconds * 1e3).toLocaleString() : "";
    }), R = u(() => y.value ? `At usage limit: the plan's ${i.value.title} allowance is used up${S.value ? `, starts again ${S.value}` : ""}` : `${n.value}% of the plan's ${i.value.title} allowance used${S.value ? `, starts again ${S.value}` : ""}`);
    return (T, I) => n.value !== null ? (a(), s("button", {
      key: 0,
      type: "button",
      class: "fact",
      disabled: e.disabled,
      "data-fact": "usage",
      title: R.value,
      onClick: I[0] || (I[0] = (F) => o("open", F.currentTarget))
    }, [
      v(oe, {
        name: "allowance",
        size: 12
      }),
      I[1] || (I[1] = f()),
      k("span", cn, [
        k("span", {
          style: Ie({ width: `${n.value}%` })
        }, null, 4)
      ]),
      f(" " + d(y.value ? "At usage limit" : `${n.value}%`), 1)
    ], 8, un)) : b("", !0);
  }
}, vn = /* @__PURE__ */ Z(gn, [["__scopeId", "data-v-a36f09dc"]]), pn = ["failed", "blocked", "problem", "update", "paused", "holding", "waiting", "asks"], _e = { danger: "failed", warn: "waiting" }, mn = (e) => pn.includes(_e[e] ?? e), hn = (e) => mn(e) ? ["badge", _e[e] ?? e] : ["badge-quiet"], fn = {
  __name: "DashboardBadge",
  props: { text: { type: String, required: !0 }, tone: { type: String, default: "" } },
  setup(e) {
    return (l, t) => (a(), s("span", {
      class: de(r(hn)(e.tone))
    }, d(e.text), 3));
  }
}, bn = /* @__PURE__ */ Z(fn, [["__scopeId", "data-v-b7a33f3d"]]), kn = (e, l, t) => Math.max(l, Math.min(t, e)), et = /* @__PURE__ */ new WeakMap(), yn = (e, l) => et.set(e, l);
function wn(e, l) {
  for (let t = l; t; t = et.get(t) ?? t.parentElement) if (t === e) return !0;
  return !1;
}
function Mn(e, l) {
  const t = (o) => {
    var n, y;
    const i = ((n = e.value) == null ? void 0 : n.element) || ((y = e.value) == null ? void 0 : y.$el) || e.value;
    i && !wn(i, o.target) && l(o);
  };
  window.addEventListener("click", t), Te(() => window.removeEventListener("click", t));
}
const be = 8, $n = /* @__PURE__ */ Object.assign({ inheritAttrs: !1 }, {
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
    const o = e, i = E(null), n = (c) => c ? `${c}px` : void 0, y = u(() => ({
      minWidth: n(o.minWidth),
      maxWidth: n(o.maxWidth),
      maxHeight: n(o.maxHeight),
      height: n(o.height)
    })), S = E({ w: 0, h: 0 }), R = (c) => ({ left: c.x, right: c.flipX ?? c.x, top: c.y, bottom: c.y }), T = E(o.anchor ? o.anchor.getBoundingClientRect() : o.point ? R(o.point) : null), I = () => ({ left: 0, top: 0, right: window.innerWidth, bottom: window.innerHeight }), F = (c) => ({
      left: Math.max(0, c.left),
      top: Math.max(0, c.top),
      right: Math.min(window.innerWidth, c.right),
      bottom: Math.min(window.innerHeight, c.bottom)
    }), z = (c) => {
      const B = c.closest(".pane, .float-window");
      return B ? F(B.getBoundingClientRect()) : I();
    }, H = (c, B) => `${Math.max(0, c ? Math.min(c, B) : B)}px`;
    function j(c, B) {
      return {
        below: c.bottom - B.bottom - o.gap - be,
        above: B.top - c.top - o.gap - be,
        across: c.right - c.left - 2 * be
      };
    }
    function V(c) {
      if (!o.anchor) return I();
      const B = z(o.anchor), M = j(B, c);
      return S.value.w <= M.across && S.value.h <= Math.max(M.below, M.above) ? B : I();
    }
    const q = u(() => {
      if (!T.value) return y.value;
      const c = T.value, B = V(c), M = j(B, c), { w: A, h: ie } = S.value, U = o.point ? c.left + A > B.right - be : o.align === "auto" ? c.left + c.right > B.left + B.right : o.align === "right", he = kn(U ? c.right - A : c.left, B.left + be, Math.max(B.left + be, B.right - A - be)), we = ie > M.below && M.above > M.below ? { bottom: `${window.innerHeight - c.top + o.gap}px`, maxHeight: H(o.maxHeight, M.above) } : { top: `${c.bottom + o.gap}px`, maxHeight: H(o.maxHeight, M.below) };
      return { ...y.value, ...we, left: `${he}px`, maxWidth: H(o.maxWidth, M.across) };
    }), Y = t, G = () => [...i.value.querySelectorAll("button:not(:disabled)")];
    function Q(c) {
      const B = G(), M = B.indexOf(document.activeElement);
      B[(M + c + B.length) % B.length].focus();
    }
    const ae = { ArrowDown: () => Q(1), ArrowUp: () => Q(-1), Escape: () => Y("close") }, P = (c) => ae[c.key] && (c.preventDefault(), ae[c.key]()), X = () => i.value && (S.value = { w: i.value.offsetWidth, h: i.value.scrollHeight });
    let $ = 0;
    const g = new ResizeObserver(() => {
      cancelAnimationFrame($), $ = requestAnimationFrame(X);
    });
    Mn(i, (c) => o.anchor && !o.anchor.contains(c.target) && Y("close"));
    const K = (c, B) => ["top", "left", "right", "bottom"].some((M) => Math.abs(c[M] - B[M]) > 1), h = (c) => c.bottom < 0 || c.top > window.innerHeight;
    let m = 0;
    function W() {
      if (o.anchor) {
        const c = o.anchor.getBoundingClientRect();
        if (!o.anchor.isConnected || h(c)) return Y("close");
        K(c, T.value) && (T.value = c);
      }
      m = requestAnimationFrame(W);
    }
    return rt(() => {
      o.anchor && i.value && yn(i.value, o.anchor), X(), i.value && g.observe(i.value), !o.plain && G()[0] && G()[0].focus(), W();
    }), Te(() => {
      g.disconnect(), cancelAnimationFrame(m), cancelAnimationFrame($);
    }), l({ element: i }), (c, B) => (a(), N(it, {
      to: "body",
      disabled: !e.anchor && !e.point
    }, [
      k("div", dt({
        ref_key: "panel",
        ref: i
      }, c.$attrs, {
        class: ["menu-panel", { anchored: e.anchor || e.point }],
        style: q.value,
        onKeydown: P
      }), [
        Ae(c.$slots, "default", {}, void 0, !0)
      ], 16)
    ], 8, ["disabled"]));
  }
}), xn = /* @__PURE__ */ Z($n, [["__scopeId", "data-v-8094ec27"]]);
async function Sn(e, l, t) {
  if (!e) return t(l);
  const { target: o, fields: i } = e, n = Object.fromEntries(Object.keys(i).map((R) => [R, o[R]])), y = () => Object.assign(o, n);
  Object.assign(o, i);
  let S = !1;
  try {
    const R = await t(l);
    return S = R.ok, R;
  } finally {
    S || y();
  }
}
function Cn(e, l, t, { groups: o, programs: i }) {
  const n = E({}), y = E(""), S = E(!1), R = u(() => !!e.value && !e.value.ended_at), T = u(() => R.value && !!e.value.paused_at);
  async function I(j, V = null) {
    y.value = "";
    const q = await Sn(V, j, l);
    return y.value = q.ok ? "" : q.error, t(), q;
  }
  return { groups: o, programs: i, chosen: n, failure: y, asking: S, running: R, paused: T, choose: (j, V) => I(["agent", "control", String(e.value.number), j, V.value], { target: n, fields: { value: { ...n.value, [j]: V.label } } }), stop: () => (S.value = !1, I(["agent", "stop", String(e.value.number)], { target: e.value, fields: { ended_at: (/* @__PURE__ */ new Date()).toISOString() } })), start: (j) => I(["agent", "launch", j.name]) };
}
function Tn(e) {
  return e ? `Last compacted ${new Date(e.started_at).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "medium" })}` : "Not compacted yet";
}
const An = { compact: "Compaction", clear: "Clear" };
function jn(e) {
  return e != null && e.is_open ? `${An[e.change]} asked at ${new Date(e.requested_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "";
}
const Bn = ["disabled", "title"], Ln = ["disabled", "title"], Rn = { class: "gauge" }, On = {
  key: 1,
  class: "fact",
  "data-fact": "context-unknown",
  title: "The context was compacted or cleared and its new size is not reported yet"
}, In = ["disabled", "title"], Vn = ["disabled"], En = ["disabled"], zn = {
  key: 5,
  class: "fact",
  "data-fact": "branch",
  title: "Current branch"
}, Hn = ["title"], Nn = {
  class: "context-compaction",
  "data-context-menu-compaction": ""
}, Dn = {
  class: "context-meter",
  "data-context-menu-meter": ""
}, Wn = { class: "gauge" }, qn = { class: "context-used" }, Fn = {
  key: 0,
  class: "context-cap",
  "data-context-menu-cap": ""
}, Pn = {
  key: 1,
  class: "context-compaction",
  "data-context-menu-open-change": ""
}, Un = 75, Gn = {
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
    const t = e, o = l, i = Cn(Ee(t, "agent"), t.run ?? (async () => ({ ok: !1, error: "nothing to ask" })), () => o("changed"), { groups: Ee(t, "controlGroups"), programs: Ee(t, "agentPrograms") }), n = E(null), y = E(""), S = u(() => i.groups.value.find(($) => $.key === y.value));
    function R($, g) {
      n.value = $.currentTarget, y.value = g;
    }
    function T() {
      n.value = null, y.value = "", i.asking.value = !1;
    }
    const I = u(() => t.skills.filter(($) => $.state === "loaded"));
    function F($) {
      R($, "skills"), o("skills");
    }
    const z = ($) => i.groups.value.some((g) => g.key === $), H = u(() => {
      var $;
      return i.chosen.value.model ?? (($ = V.value) == null ? void 0 : $.model) ?? "";
    }), j = u(() => {
      var $;
      return i.chosen.value.effort ?? (($ = V.value) == null ? void 0 : $.effort) ?? "";
    });
    u(() => !!t.agent && !t.agent.ended_at);
    const V = u(() => {
      var $;
      return (($ = t.usage.agents) == null ? void 0 : $.find((g) => {
        var K;
        return g.id === ((K = t.agent) == null ? void 0 : K.id);
      })) ?? null;
    }), q = u(() => {
      var $;
      return (($ = V.value) == null ? void 0 : $.context_percent) == null ? null : Math.round(V.value.context_percent);
    }), Y = u(() => {
      var $;
      return jn((($ = V.value) == null ? void 0 : $.context_change) ?? null);
    }), G = ($) => `${Math.round($ / 1e3)}k`, Q = u(() => {
      var $;
      return !!(($ = V.value) != null && $.context_limit_tokens);
    }), ae = u(() => {
      var $, g;
      return (($ = V.value) == null ? void 0 : $.context_limit_tokens) || ((g = V.value) == null ? void 0 : g.context_window_tokens) || 0;
    }), P = u(() => ae.value ? `${G(V.value.context_tokens ?? 0)} of ${G(ae.value)}` : ""), X = u(() => {
      var $;
      return ($ = V.value) != null && $.cost_dollars ? `$${V.value.cost_dollars.toFixed(2)}` : "";
    });
    return ($, g) => {
      var K, h;
      return a(), s("div", {
        class: de(["information", { card: e.card }]),
        "data-information-bar": ""
      }, [
        e.agent ? (a(), s(D, { key: 0 }, [
          k("button", {
            type: "button",
            class: "fact lead",
            disabled: e.card,
            "data-fact": "agent",
            title: `Session ${e.agent.session}: stop it`,
            onClick: g[0] || (g[0] = (m) => R(m, "agent"))
          }, [
            v(oe, {
              name: "agents",
              size: 12
            }),
            f(" " + d(((K = e.agentPrograms.find((m) => m.name === e.agent.program)) == null ? void 0 : K.title) || e.agent.program), 1)
          ], 8, Bn),
          v(vn, {
            windows: e.usage.windows,
            disabled: e.card,
            onOpen: g[1] || (g[1] = (m) => o("open", "usage", m))
          }, null, 8, ["windows", "disabled"]),
          q.value !== null ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "context",
            title: `Context ${q.value}% full: clear or compact it`,
            onClick: g[2] || (g[2] = (m) => z("context") ? R(m, "context") : o("open", "context", m.currentTarget))
          }, [
            v(oe, {
              name: "gauge",
              size: 12
            }),
            g[14] || (g[14] = f()),
            k("span", Rn, [
              k("span", {
                style: Ie({ width: `${q.value}%` })
              }, null, 4)
            ]),
            f(" " + d(q.value) + "% ", 1)
          ], 8, Ln)) : (h = V.value) != null && h.context_unknown ? (a(), s("span", On, [
            v(oe, {
              name: "gauge",
              size: 12
            }),
            g[15] || (g[15] = f(" Context: unknown", -1))
          ])) : b("", !0),
          H.value ? (a(), s("button", {
            key: 2,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "model",
            title: `${H.value}: change the model`,
            onClick: g[3] || (g[3] = (m) => z("model") ? R(m, "model") : null)
          }, [
            v(oe, {
              name: "model",
              size: 12
            }),
            f(" " + d(H.value), 1)
          ], 8, In)) : b("", !0),
          z("effort") || e.card && j.value ? (a(), s("button", {
            key: 3,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "effort",
            title: "Reasoning effort: change it",
            onClick: g[4] || (g[4] = (m) => R(m, "effort"))
          }, [
            v(oe, {
              name: "bolt",
              size: 12
            }),
            f(" " + d(j.value), 1)
          ], 8, Vn)) : b("", !0),
          X.value ? (a(), s("button", {
            key: 4,
            type: "button",
            class: "fact",
            disabled: e.card,
            "data-fact": "cost",
            title: "The predicted API price of this session: open its breakdown",
            onClick: g[5] || (g[5] = (m) => o("open", "cost", m.currentTarget))
          }, d(X.value), 9, En)) : b("", !0),
          e.branch ? (a(), s("span", zn, [
            v(oe, {
              name: "branch",
              size: 12
            }),
            f(" " + d(e.branch), 1)
          ])) : b("", !0),
          e.card ? b("", !0) : (a(), s("button", {
            key: 6,
            type: "button",
            class: de(["fact", { none: !e.jobs }]),
            "data-fact": "jobs",
            title: "Jobs the agent scheduled for itself",
            onClick: g[6] || (g[6] = (m) => o("open", "jobs", m.currentTarget))
          }, [
            v(oe, {
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
            v(oe, {
              name: "book",
              size: 12
            }),
            f(" " + d(I.value.length), 1)
          ])) : b("", !0),
          e.fitness ? (a(), s(D, { key: 8 }, [
            k("button", {
              type: "button",
              class: de(["fact", "fitness-fact", { low: e.fitness.is_measured && e.fitness.score < Un }]),
              "data-fact": "fitness",
              title: "View the agent’s performance measures",
              onClick: g[7] || (g[7] = (m) => o("open", "fitness", m.currentTarget))
            }, [
              v(oe, {
                name: "heart",
                size: 12
              }),
              f(" " + d(e.fitness.is_measured ? e.fitness.score : "–"), 1)
            ], 2),
            k("button", {
              type: "button",
              class: de(["fact", "load-fact", e.fitness.workload_level]),
              "data-fact": "load",
              title: "Compare incoming messages with agent replies",
              onClick: g[8] || (g[8] = (m) => o("open", "load", m.currentTarget))
            }, [
              v(oe, {
                name: "weight",
                size: 12
              }),
              f(" " + d(e.fitness.workload), 1)
            ], 2)
          ], 64)) : b("", !0)
        ], 64)) : e.run && !e.loading ? (a(), s("button", {
          key: 1,
          type: "button",
          class: "fact lead",
          "data-agent-start": "",
          onClick: g[9] || (g[9] = (m) => R(m, "start"))
        }, [
          v(oe, {
            name: "agents",
            size: 12
          }),
          g[16] || (g[16] = f(" Start an agent", -1))
        ])) : b("", !0),
        g[22] || (g[22] = k("span", { class: "space" }, null, -1)),
        r(i).failure.value ? (a(), s("span", {
          key: 2,
          class: "fact failure",
          role: "alert",
          "data-agent-failure": "",
          title: r(i).failure.value
        }, d(r(i).failure.value), 9, Hn)) : b("", !0),
        Ae($.$slots, "default", {}, void 0, !0),
        n.value ? (a(), N(xn, {
          key: 3,
          anchor: n.value,
          "min-width": 190,
          onClose: T
        }, {
          default: p(() => {
            var m;
            return [
              y.value === "agent" ? (a(), s(D, { key: 0 }, [
                r(i).asking.value ? (a(), s(D, { key: 0 }, [
                  v(Ce, { "data-agent-stop-ask": "" }, {
                    default: p(() => [...g[17] || (g[17] = [
                      f("Stop the agent? It stops what it is doing.", -1)
                    ])]),
                    _: 1
                  }),
                  v(Se, {
                    "data-agent-stop-confirm": "",
                    onClick: g[10] || (g[10] = (W) => (T(), r(i).stop()))
                  }, {
                    default: p(() => [...g[18] || (g[18] = [
                      f("Stop it", -1)
                    ])]),
                    _: 1
                  }),
                  v(Se, {
                    onClick: g[11] || (g[11] = (W) => r(i).asking.value = !1)
                  }, {
                    default: p(() => [...g[19] || (g[19] = [
                      f("Keep it running", -1)
                    ])]),
                    _: 1
                  })
                ], 64)) : (a(), N(Se, {
                  key: 1,
                  "data-agent-stop": "",
                  onClick: g[12] || (g[12] = (W) => r(i).asking.value = !0)
                }, {
                  default: p(() => [...g[20] || (g[20] = [
                    f("Stop", -1)
                  ])]),
                  _: 1
                }))
              ], 64)) : y.value === "start" ? (a(), s(D, { key: 1 }, [
                v(Ce, null, {
                  default: p(() => [...g[21] || (g[21] = [
                    f("Start an agent", -1)
                  ])]),
                  _: 1
                }),
                (a(!0), s(D, null, te(r(i).programs.value, (W) => (a(), N(Se, {
                  key: W.name,
                  "data-agent-program": W.name,
                  onClick: (c) => (T(), r(i).start(W))
                }, {
                  default: p(() => [
                    f(d(W.title), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-program", "onClick"]))), 128))
              ], 64)) : y.value === "skills" ? (a(), N(dn, {
                key: 2,
                skills: e.skills,
                onBrowse: g[13] || (g[13] = (W) => (T(), o("open", "skills", null)))
              }, null, 8, ["skills"])) : S.value ? (a(), s(D, { key: 3 }, [
                v(Ce, null, {
                  default: p(() => [
                    f(d(S.value.label), 1)
                  ]),
                  _: 1
                }),
                y.value === "context" ? (a(), s(D, { key: 0 }, [
                  k("p", Nn, d(r(Tn)(((m = V.value) == null ? void 0 : m.last_compaction) ?? null)), 1),
                  k("div", Dn, [
                    k("span", Wn, [
                      k("span", {
                        style: Ie({ width: `${q.value}%` })
                      }, null, 4)
                    ]),
                    k("span", qn, d(q.value) + "%", 1)
                  ]),
                  P.value ? (a(), s("p", Fn, [
                    f(d(P.value) + " ", 1),
                    Q.value ? (a(), N(bn, {
                      key: 0,
                      text: "Capped",
                      tone: "warn"
                    })) : b("", !0)
                  ])) : b("", !0)
                ], 64)) : b("", !0),
                y.value === "context" && Y.value ? (a(), s("p", Pn, d(Y.value), 1)) : (a(!0), s(D, { key: 2 }, te(S.value.choices, (W) => (a(), N(Se, {
                  key: W.value,
                  "data-agent-choice": W.value,
                  onClick: (c) => (r(i).choose(S.value.key, W), T())
                }, {
                  default: p(() => [
                    f(d(W.label), 1)
                  ]),
                  _: 2
                }, 1032, ["data-agent-choice", "onClick"]))), 128))
              ], 64)) : b("", !0)
            ];
          }),
          _: 1
        }, 8, ["anchor"])) : b("", !0)
      ], 2);
    };
  }
}, Jn = /* @__PURE__ */ Z(Gn, [["__scopeId", "data-v-d7113347"]]), Kn = ["data-agent-open", "aria-expanded", "role", "tabindex"], Zn = {
  class: "agent-head",
  "data-agent-head": ""
}, Yn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Xn = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Qn = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, _n = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, el = {
  key: 0,
  class: "agent-menu",
  "data-agent-menu-panel": ""
}, tl = {
  key: 1,
  class: "agent-line"
}, al = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, nl = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, ll = {
  key: 0,
  class: "agent-sandbox-off",
  "data-agent-sandbox-off": ""
}, ol = {
  key: 3,
  class: "agent-unit",
  "data-agent-unit": ""
}, sl = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(e, { emit: l }) {
    const t = /* @__PURE__ */ new Set(["started", "testing", "blocked"]), o = ["completed", "testing"], i = { running: "Working", starting: "Starting", stopping: "Stopping", ended: "Idle: its process has stopped", failed: "Could not start", never_started: "Not started" }, n = e, y = l, S = Qe(), R = E(!1), T = u(() => yt(n.row, n.facts)), I = u(() => {
      var w;
      return ((w = n.facts) == null ? void 0 : w.tasks) ?? [];
    }), F = u(() => I.value.filter((w) => w.state === "open")), z = u(() => I.value.find((w) => {
      var L;
      return w.id === ((L = n.progress) == null ? void 0 : L.task_id) && w.state === "started";
    })), H = u(() => z.value || I.value.find((w) => {
      var L;
      return w.id === ((L = n.facts) == null ? void 0 : L.task_id);
    }) || I.value.find((w) => t.has(w.state)) || F.value[0] || I.value.at(-1)), j = u(() => {
      var w, L, ue, se, le, pe;
      return n.row.role === "helper" ? ((w = n.facts) == null ? void 0 : w.helper_job) || "" : (L = n.facts) != null && L.job_enabled && (((ue = z.value) == null ? void 0 : ue.title) || ((se = n.facts) == null ? void 0 : se.task_title) || ((le = F.value[0]) == null ? void 0 : le.title) || ((pe = I.value.at(-1)) == null ? void 0 : pe.title)) || "";
    }), V = u(() => wt(n.row)), q = u(() => {
      var w, L;
      return [n.row.program, (w = n.facts) == null ? void 0 : w.model, (L = n.facts) == null ? void 0 : L.effort, V.value].filter(Boolean).join(" · ");
    }), Y = Ve(), G = /* @__PURE__ */ new Set(["open", "started", "testing"]), Q = { fresh: "new conversation", resumed: "resumed" }, ae = u(() => {
      var w, L;
      return [(w = n.facts) == null ? void 0 : w.helper_job_program, Q[(L = n.facts) == null ? void 0 : L.occupant_launch]].filter(Boolean).join(", ");
    }), P = u(() => {
      var w;
      return (w = n.facts) == null ? void 0 : w.work_status;
    }), X = u(() => !!n.row.ended_at && n.row.role !== "main" && I.value.some((w) => G.has(w.state))), $ = u(() => {
      var w, L;
      return n.row.state === "running" && ((w = n.facts) == null ? void 0 : w.state) === "at usage limit" && !!((L = n.facts) != null && L.usage_limit_ends_at);
    }), g = (w) => new Date(w).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }), K = u(() => n.row.halted_at ? `Stopped at the usage limit since ${g(n.row.halted_at)}, goes on at ${g(n.facts.usage_limit_ends_at)}` : `At usage limit: starts again ${new Date(n.facts.usage_limit_ends_at).toLocaleString()}`), h = u(() => {
      var w;
      return n.row.retired_at || n.row.state === "retired" ? "retired" : $.value || P.value || n.waitReason || X.value ? "waiting" : n.row.state === "running" && ((w = n.facts) == null ? void 0 : w.state) || n.row.state;
    }), m = u(() => {
      var w;
      return $.value ? K.value : P.value ? `Status: ${P.value}` : n.waitReason ? `Waiting: ${n.waitReason}` : h.value === "blocked" ? (w = n.facts) != null && w.blocked_reason ? `Blocked: ${n.facts.blocked_reason}` : "Blocked" : X.value ? "Stopped with work left" : "";
    }), W = u(() => {
      var w;
      return ((w = n.progress) == null ? void 0 : w.completed_count) ?? I.value.filter((L) => o.includes(L.state)).length;
    }), c = u(() => {
      var w;
      return Mt(W.value, ((w = n.progress) == null ? void 0 : w.started_at) || n.row.created_at, n.progress ? n.progress.finished_at : n.row.ended_at, S.value);
    }), B = u(() => n.row.role === "main" ? 0 : c.value), M = u(() => !!n.row.retired_at || n.row.state === "retired"), A = u(() => M.value ? "Retired" : h.value === "blocked" || h.value === "waiting" ? m.value || (h.value === "blocked" ? "Blocked" : "Waiting") : i[n.row.standing]), ie = u(() => {
      var L;
      if (M.value) return n.row.retired_at;
      const w = h.value === "blocked" || h.value === "waiting";
      return n.row.ended_at || w && ((L = n.facts) == null ? void 0 : L.last_activity) || n.row.process_started_at || n.row.created_at;
    }), U = u(() => !!n.row.ended_at || M.value), he = (w, L) => async ({ say: ue }) => {
      const se = await Y.run(["agent", ...w, String(n.row.number)]);
      ue(se.ok ? `${T.value} ${L}` : se.error);
    }, ne = () => ({
      head: T.value,
      items: [
        { label: "Open", group: "open", disabled: n.open, reason: "Already open", run: () => y("toggle") },
        { label: n.row.paused_at ? "Resume" : "Pause", group: "open", disabled: U.value, reason: "Process stopped", run: he([n.row.paused_at ? "resume" : "pause"], n.row.paused_at ? "resumed" : "paused") },
        { label: "Copy name", group: "copy", run: ({ say: w }) => Tt(T.value, "the name", w) },
        { label: "Open its task", group: "copy", disabled: !H.value, reason: "No task", run: () => ye(`tasks:${H.value.id}`) },
        { label: "Stop", danger: !0, disabled: U.value || n.row.role === "main", reason: U.value ? "Process stopped" : "The main agent", run: he(["stop"], "stopped") }
      ]
    }), we = u(() => $t(ie.value, S.value)), ve = u(() => {
      var w;
      return xt((w = n.facts) == null ? void 0 : w.last_activity, S.value);
    });
    return (w, L) => {
      var ue, se, le, pe, je, Be;
      return ut((a(), s("div", {
        class: de(["agent-card", { open: e.open }]),
        "data-agent-open": e.row.id,
        "aria-expanded": e.open,
        role: e.open ? void 0 : "button",
        tabindex: e.open ? void 0 : 0,
        onClick: L[2] || (L[2] = (ce) => !e.open && y("toggle")),
        onKeydown: [
          L[3] || (L[3] = Pe(ee((ce) => !e.open && y("toggle"), ["self", "prevent"]), ["enter"])),
          L[4] || (L[4] = Pe(ee((ce) => !e.open && y("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        k("div", Zn, [
          e.open ? (a(), s("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back",
            "aria-label": "Back",
            onClick: L[0] || (L[0] = ee((ce) => y("toggle"), ["stop"]))
          }, [
            v(r(De), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : b("", !0),
          e.open ? (a(), s(D, { key: 1 }, [
            k("span", Yn, d(T.value.title), 1),
            k("span", Xn, d(T.value.subtext), 1),
            v(r(_), {
              variant: "ghost",
              small: "",
              class: "agent-menu-button",
              "data-agent-menu": "",
              "aria-expanded": R.value,
              onClick: L[1] || (L[1] = ee((ce) => R.value = !R.value, ["stop"]))
            }, {
              default: p(() => [...L[5] || (L[5] = [
                f("Actions", -1)
              ])]),
              _: 1
            }, 8, ["aria-expanded"])
          ], 64)) : (a(), s(D, { key: 2 }, [
            v(r(St), {
              "agent-id": e.row.id,
              label: T.value.text,
              class: "agent-who"
            }, {
              default: p(() => [
                k("span", Qn, d(T.value.title), 1),
                k("span", _n, d(T.value.subtext), 1)
              ]),
              _: 1
            }, 8, ["agent-id", "label"]),
            v(r(De), {
              class: "agent-chevron",
              name: "chevronRight",
              size: 12
            })
          ], 64))
        ]),
        e.open && R.value ? (a(), s("div", el, [
          v(la, {
            row: e.row,
            held: h.value === "blocked"
          }, null, 8, ["row", "held"])
        ])) : b("", !0),
        e.open ? b("", !0) : (a(), s("span", tl, [
          k("span", al, d(q.value), 1),
          (ue = e.facts) != null && ue.sandbox_off ? (a(), s("span", nl, "sandbox off")) : b("", !0)
        ])),
        e.open && !M.value ? (a(), N(Jn, {
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
              (ce = e.facts) != null && ce.sandbox_off ? (a(), s("span", ll, "sandbox off")) : b("", !0)
            ];
          }),
          _: 1
        }, 8, ["agent-programs", "agent", "branch", "usage"])) : b("", !0),
        !e.open && ((pe = e.facts) != null && pe.unit_name) ? (a(), s("div", ol, "Unit: " + d(e.facts.unit_name), 1)) : b("", !0),
        e.open ? b("", !0) : (a(), N(Ya, {
          key: 4,
          tasks: I.value,
          "in-hand": e.row.role !== "helper" && ((je = e.facts) != null && je.job_enabled) && H.value || null,
          job: e.row.role === "helper" ? j.value : "",
          "job-title": e.row.role === "helper" && ((Be = e.facts) == null ? void 0 : Be.helper_job_title) || "",
          "job-launch": e.row.role === "helper" ? ae.value : "",
          "per-hour": B.value,
          "counts-empty": e.row.role === "worker"
        }, null, 8, ["tasks", "in-hand", "job", "job-title", "job-launch", "per-hour", "counts-empty"])),
        v(Va, {
          state: h.value,
          doing: A.value,
          since: we.value,
          seen: ve.value
        }, null, 8, ["state", "doing", "since", "seen"]),
        e.open ? (a(), N(Ba, {
          key: 5,
          row: e.row,
          facts: e.facts,
          progress: e.progress,
          "wait-reason": e.waitReason,
          tasks: I.value,
          "stopped-with-work": X.value,
          open: e.open
        }, null, 8, ["row", "facts", "progress", "wait-reason", "tasks", "stopped-with-work", "open"])) : b("", !0)
      ], 42, Kn)), [
        [r(Ct), ne]
      ]);
    };
  }
}, rl = /* @__PURE__ */ Z(sl, [["__scopeId", "data-v-9856b1d2"]]), il = {
  key: 1,
  class: "agents-upgrade",
  "data-agents-upgrade": ""
}, dl = ["data-agent-row", "data-agent-lingering"], Je = "journal.agents.filters", Ke = 300 * 1e3, Oe = "cubic-bezier(0.2, 0.9, 0.25, 1)", ul = {
  __name: "AgentRows",
  props: { empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(e) {
    const l = e, t = Ve(), { rows: o } = t.props.waits, { rows: i } = t.props.progress, { rows: n, failure: y, loaded: S, more: R } = t.props.agents, T = (x) => i.value.find((O) => O.agent_id === x.id) ?? null, I = (x) => {
      var O;
      return ((O = o.value.find((C) => C.agent_id === x.id)) == null ? void 0 : O.reason) ?? "";
    }, F = E("running"), z = E(""), H = JSON.parse(localStorage.getItem(Je) || '{"roles":[],"profiles":[],"programs":[]}'), j = E(H), V = u(() => t.props.filters.data.value ?? { roles: [], profiles: [], states: [], upgrade_retired: 0 }), { rows: q } = t.props.programs, Y = u(() => j.value.roles.length + j.value.profiles.length + j.value.programs.length), G = (x, O) => {
      j.value = Lt(j.value, x, O);
    }, Q = () => {
      j.value = { roles: [], profiles: [], programs: [] };
    }, ae = (x) => x.slice(0, 1).toUpperCase() + x.slice(1);
    ge(j, (x) => localStorage.setItem(Je, JSON.stringify(x)));
    const P = E(25);
    function X() {
      Object.assign(t.state, {
        "agents.show": F.value,
        "agents.search": z.value,
        "agents.limit": String(P.value),
        "agents.roles": j.value.roles.join(","),
        "agents.profiles": j.value.profiles.join(","),
        "agents.programs": j.value.programs.join(",")
      });
    }
    async function $() {
      return P.value += 25, X(), await t.reload("agents"), !0;
    }
    ge([F, z, j], () => {
      P.value = 25, X(), t.reload("agents");
    }), X();
    const g = (x) => x.facts ?? null, K = n, h = Qe(), m = E([]), W = u(() => new Set(m.value.filter((x) => h.value - x.left < Ke).map((x) => x.row.id))), c = u(() => m.value.filter((x) => W.value.has(x.row.id)).map((x) => x.row)), B = u(() => [...K.value, ...c.value]);
    let M = "", A = [];
    async function ie(x) {
      await t.reload(`card.${x.id}`);
      const O = t.props[`card.${x.id}`].rows.value.find((C) => C.id === x.id);
      O != null && O.ended_at && !m.value.some((C) => C.row.id === x.id) && (m.value = [...m.value, { row: O, left: Date.now() }]);
    }
    ge(n, (x) => {
      const O = M === `${F.value}|${z.value}|${JSON.stringify(j.value)}` && F.value === "running", C = O ? A.filter((J) => !x.some((Me) => Me.id === J.id)) : [];
      M = `${F.value}|${z.value}|${JSON.stringify(j.value)}`, A = x, m.value = O ? m.value.filter((J) => h.value - J.left < Ke && !x.some((Me) => Me.id === J.row.id)) : [], C.forEach(ie);
    }, { immediate: !0 });
    const U = u(() => !!z.value.trim() || Y.value > 0), he = u(() => l.texts[F.value] ?? { title: l.empty, hint: "" }), ne = E(null), we = E(null), ve = E(null), w = E(null), L = u(() => ne.value === null ? null : t.props[`card.${ne.value}`].rows.value.find((x) => x.id === ne.value) ?? we.value), ue = u(() => L.value ? [L.value] : B.value), se = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches, le = E(!1);
    let pe = 0;
    const je = (x) => [...x.attributes].map((O) => O.name).find((O) => O.startsWith("data-agent-") && O !== "data-agent-motion") ?? "";
    async function Be(x) {
      if (le.value) return;
      le.value = !0, pe = w.value.scrollTop;
      const O = ve.value.querySelector(`[data-agent-open="${x.id}"]`);
      if (!se()) {
        const $e = [...ve.value.querySelectorAll(".agent-row")].filter((me) => !me.contains(O));
        await Promise.all($e.map((me) => me.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const C = [...O.querySelectorAll(".agent-head, .agent-line")], J = [...C, ...O.querySelectorAll("[data-agent-motion]")], Me = J.map(je), Le = J.map(($e) => $e.getBoundingClientRect());
      if (we.value = x, ne.value = x.id, t.reload(`card.${x.id}`), await Ue(), !se()) {
        const $e = J.map((re, fe) => re.isConnected ? re : Me[fe] ? O.querySelector(`[${Me[fe]}]`) : null), me = $e.map((re) => re == null ? void 0 : re.getBoundingClientRect());
        $e.forEach((re, fe) => {
          if (!re) return;
          const xe = C.findIndex((Fe) => Fe !== re && Fe.contains(re)), at = Le[fe].left - me[fe].left - (xe < 0 ? 0 : Le[xe].left - me[xe].left), nt = Le[fe].top - me[fe].top - (xe < 0 ? 0 : Le[xe].top - me[xe].top);
          re.animate([{ transform: `translate(${at}px, ${nt}px)` }, { transform: "none" }], { duration: 280, easing: Oe });
        }), ve.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body").forEach((re) => {
          re.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: Oe, fill: "backwards" });
        });
      }
      le.value = !1;
    }
    async function ce() {
      if (le.value || !L.value) return;
      le.value = !0;
      const x = ve.value.querySelector(`[data-agent-open="${ne.value}"]`), O = [...x.children], C = se() ? [] : O.map((J) => J.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(C.map((J) => J.finished)), ne.value = null, await Ue(), w.value.scrollTop = pe, C.forEach((J) => J.cancel()), se() || (x.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: Oe }), ve.value.querySelectorAll(".agent-row").forEach((J) => {
        J.contains(x) || J.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: Oe });
      })), le.value = !1;
    }
    const tt = (x) => ne.value === x.id ? ce() : Be(x);
    ge(z, (x) => x.trim() && (ne.value = null)), ge(F, () => {
      ne.value = null;
    });
    const qe = (x) => {
      x.key === "Escape" && ce();
    };
    return window.addEventListener("keydown", qe), Te(() => window.removeEventListener("keydown", qe)), (x, O) => (a(), s("div", {
      ref_key: "agents",
      ref: ve,
      class: de(["agents", { focused: L.value, "card-changing": le.value }])
    }, [
      L.value ? b("", !0) : (a(), N(r(At), {
        key: 0,
        modelValue: z.value,
        "onUpdate:modelValue": O[1] || (O[1] = (C) => z.value = C),
        placeholder: "Search agents",
        "menu-count": Y.value,
        "data-agents-search": ""
      }, {
        menu: p(() => [
          v(r(ze), null, {
            default: p(() => [...O[2] || (O[2] = [
              f("Type", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(D, null, te(V.value.roles, (C) => (a(), N(r(Re), {
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
          V.value.profiles.length ? (a(), N(r(ze), { key: 0 }, {
            default: p(() => [...O[3] || (O[3] = [
              f("Profile", -1)
            ])]),
            _: 1
          })) : b("", !0),
          (a(!0), s(D, null, te(V.value.profiles, (C) => (a(), N(r(Re), {
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
          v(r(ze), null, {
            default: p(() => [...O[4] || (O[4] = [
              f("Program", -1)
            ])]),
            _: 1
          }),
          (a(!0), s(D, null, te(r(q), (C) => (a(), N(r(Re), {
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
          Y.value ? (a(), N(r(Re), {
            key: 1,
            "data-filter-clear": "",
            onClick: Q
          }, {
            default: p(() => [...O[5] || (O[5] = [
              f("Clear filters", -1)
            ])]),
            _: 1
          })) : b("", !0)
        ]),
        default: p(() => [
          v(r(jt), {
            options: V.value.states,
            value: F.value,
            onPick: O[0] || (O[0] = (C) => F.value = C)
          }, null, 8, ["options", "value"])
        ]),
        _: 1
      }, 8, ["modelValue", "menu-count"])),
      F.value === "retired" && V.value.upgrade_retired ? (a(), s("p", il, "Retired during the upgrade: " + d(V.value.upgrade_retired), 1)) : b("", !0),
      k("div", {
        ref_key: "list",
        ref: w,
        class: de(["agents-view", { "agents-view-open": L.value }])
      }, [
        r(S) && !r(y) && !ue.value.length && Y.value ? (a(), N(r(We), {
          key: 0,
          title: "No agents match the filters",
          "data-filter-empty": ""
        }, {
          default: p(() => [
            v(r(_), {
              small: "",
              "data-empty-clear": "",
              onClick: Q
            }, {
              default: p(() => [...O[6] || (O[6] = [
                f("Clear filters", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })) : (a(), N(r(Bt), {
          key: 1,
          moves: "",
          "leaves-at-once": le.value,
          rows: ue.value,
          failure: r(y),
          loaded: r(S),
          more: !L.value && r(R),
          older: $,
          empty: he.value.title,
          hint: he.value.hint,
          searching: U.value
        }, {
          default: p(({ row: C }) => [
            k("div", {
              class: de(["agent-row", { lingering: W.value.has(C.id) && C.id !== ne.value }]),
              "data-agent-row": C.id,
              "data-agent-lingering": W.value.has(C.id) ? "" : null
            }, [
              v(rl, {
                row: C,
                facts: g(C),
                progress: T(C),
                "wait-reason": I(C),
                open: C.id === ne.value,
                onToggle: (J) => tt(C)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 10, dl)
          ]),
          _: 1
        }, 8, ["leaves-at-once", "rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
      ], 2)
    ], 2));
  }
}, pl = /* @__PURE__ */ Z(ul, [["__scopeId", "data-v-19199c00"]]);
export {
  pl as A
};
