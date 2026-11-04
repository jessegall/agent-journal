/* @code-commandments-generated */
import { computed as u, ref as v, defineAsyncComponent as de, onUnmounted as ge, openBlock as l, createElementBlock as r, normalizeClass as ae, createElementVNode as d, toDisplayString as g, createBlock as G, unref as c, createVNode as p, Fragment as U, createCommentVNode as h, withModifiers as oe, withCtx as b, createSlots as ve, renderList as ee, resolveDynamicComponent as pe, watch as le, createTextVNode as me } from "vue";
import { useNow as fe, age as we, useWindow as re, loadWindowComponent as ke, TimeAgo as ye, Icon as he, peekRef as ne, RunningCommand as be, FoldGroup as ue, InnerTabs as _e, SwitchCase as Ce, TaskStatusIcon as Se, useRows as $e, useDeclaredRows as te, SearchBar as Te, Segmented as xe, Btn as Re, RowList as Oe } from "@journal/window-kit";
import { _ as ce, T as ie } from "./TranscriptRows-DhYd90lu.js";
const Ae = ["data-agent-open", "aria-expanded", "title"], Ie = { class: "agent-head" }, qe = ["data-state"], Be = {
  class: "agent-title",
  "data-agent-title": ""
}, Ee = {
  class: "agent-name",
  "data-agent-name": ""
}, Ne = {
  key: 1,
  class: "agent-time"
}, De = { class: "agent-line" }, Le = {
  class: "agent-identity",
  "data-agent-identity": ""
}, We = {
  key: 0,
  class: "agent-tasks",
  "data-agent-pace": ""
}, je = {
  class: "agent-tasks",
  "data-agent-tasks": ""
}, Ve = {
  key: 0,
  class: "agent-command",
  "data-agent-command": ""
}, Ue = {
  key: 1,
  class: "agent-stopped",
  "data-agent-stopped": ""
}, Fe = {
  key: 0,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, Me = {
  key: 1,
  class: "agent-tab-body",
  "data-agent-tab-body": "transcript",
  "data-agent-only-transcript": ""
}, He = {
  key: 0,
  class: "agent-subagent-brief"
}, Pe = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ze = ["data-agent-tab-body"], Ge = ["data-agent-delegated", "onClick"], Ke = { class: "agent-task-number" }, Je = { class: "agent-task-title" }, Qe = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Xe = 36e5, Ye = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(s, { emit: K }) {
    const E = { main: "Main agent", subagent: "Subagent", reviewer: "Reviewer" }, J = ["started", "testing", "blocked", "open", "completed", "cancelled"], t = s, Q = K, F = fe(), X = u(() => {
      var n;
      const e = ((n = t.facts) == null ? void 0 : n.profile) || E[t.row.role] || t.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), _ = u(() => {
      var e;
      return ((e = t.facts) == null ? void 0 : e.tasks) ?? [];
    }), Y = u(() => {
      var e, n;
      return [t.row.program, (e = t.facts) == null ? void 0 : e.model, (n = t.facts) == null ? void 0 : n.effort, t.row.role === "main" ? "" : t.progress ? `${t.row.role} ${t.row.id}` : t.row.role].filter(Boolean).join(" · ");
    }), Z = u(() => we(t.row.process_started_at || t.row.created_at, F.value)), C = /* @__PURE__ */ new Set(["open", "started", "testing"]), m = u(() => !!t.row.ended_at && t.row.role !== "main" && _.value.some((e) => C.has(e.state))), N = u(() => {
      var e;
      return t.waitReason || m.value ? "waiting" : t.row.ended_at ? "closed" : ((e = t.facts) == null ? void 0 : e.state) || "running";
    }), D = u(() => {
      var n, B, y;
      const e = [];
      return ((n = t.facts) == null ? void 0 : n.context_percent) !== null && ((B = t.facts) == null ? void 0 : B.context_percent) !== void 0 && e.push(`Context ${t.facts.context_percent}%`), (y = t.facts) != null && y.cost_dollars && e.push(`$${t.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), T = u(() => {
      var e;
      return ((e = t.progress) == null ? void 0 : e.completed_count) ?? _.value.filter((n) => n.state === "completed").length;
    }), x = u(() => {
      var e;
      return ((e = t.progress) == null ? void 0 : e.task_count) ?? _.value.length;
    }), M = u(() => `${T.value} of ${x.value} ${x.value === 1 ? "task" : "tasks"}`), R = u(() => {
      var V;
      const e = Date.parse(((V = t.progress) == null ? void 0 : V.started_at) || t.row.created_at), n = t.progress ? t.progress.finished_at : t.row.ended_at, y = ((n ? Date.parse(n) : F.value) - e) / Xe;
      return t.row.role !== "main" && y > 0 && T.value ? `${Math.round(T.value / y)}/h` : "";
    }), H = u(() => J.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: _.value.filter((n) => n.state === e) })).filter((e) => e.tasks.length)), O = /* @__PURE__ */ new Set(["completed"]), L = v({}), P = (e) => !(L.value[e] ?? O.has(e)), W = (e) => L.value = { ...L.value, [e]: P(e) }, A = re(), S = v(A.tabs[0]), k = Object.fromEntries(A.tabs.filter((e) => e.component).map((e) => [e.key, de(() => ke(e.component))])), I = u(() => t.row.role === "subagent"), q = v(!1), j = v(""), z = v(""), o = u(() => t.row.role !== "main" && (!t.row.ended_at || m.value || t.waitReason));
    async function a() {
      if (!o.value) return;
      const e = await A.read(`usage tool --agent ${t.row.id}`);
      j.value = e.ok ? e.value.tool : "", z.value = e.ok ? e.value.note : "";
    }
    const i = A.follow(["hook_call.*", "process_part.*"], a);
    return ge(() => i == null ? void 0 : i()), a(), (e, n) => {
      var B, y, V, se;
      return l(), r("div", {
        class: ae(["agent-card", { open: s.open }]),
        "data-agent-open": s.row.id,
        "aria-expanded": s.open,
        title: s.row.session,
        onClick: n[4] || (n[4] = (f) => Q("toggle"))
      }, [
        d("span", Ie, [
          d("span", {
            class: "agent-dot",
            "data-state": N.value
          }, null, 8, qe),
          d("span", Be, g(X.value), 1),
          d("span", Ee, g(((B = s.facts) == null ? void 0 : B.given_name) || s.row.id), 1),
          s.row.ended_at && !m.value ? (l(), G(c(ye), {
            key: 0,
            class: "agent-time",
            at: s.row.ended_at
          }, null, 8, ["at"])) : (l(), r("span", Ne, g(Z.value), 1)),
          p(c(he), {
            class: ae(["agent-chevron", { opened: s.open }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        d("span", De, [
          d("span", Le, g(Y.value), 1),
          x.value ? (l(), r(U, { key: 0 }, [
            R.value ? (l(), r("span", We, g(R.value), 1)) : h("", !0),
            d("span", je, g(M.value), 1)
          ], 64)) : h("", !0)
        ]),
        o.value ? (l(), r("span", Ve, [
          s.waitReason ? (l(), r("button", {
            key: 0,
            type: "button",
            class: "agent-waiting",
            "data-agent-waiting": "",
            title: "Open the process queue",
            onClick: n[0] || (n[0] = oe((f) => c(ne)("test_queue:0"), ["stop"]))
          }, "Waiting: " + g(s.waitReason), 1)) : m.value ? (l(), r("span", Ue, "Waiting")) : (l(), G(c(be), {
            key: 2,
            text: j.value,
            idle: z.value || "thinking"
          }, null, 8, ["text", "idle"]))
        ])) : h("", !0),
        s.open ? (l(), r("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: n[3] || (n[3] = oe(() => {
          }, ["stop"]))
        }, [
          D.value ? (l(), r("span", Fe, g(D.value), 1)) : h("", !0),
          I.value ? (l(), r("div", Me, [
            (y = s.facts) != null && y.instruction ? (l(), r("div", He, [
              p(c(ue), {
                label: "Instruction",
                open: q.value,
                "data-agent-section": "instruction",
                onToggle: n[1] || (n[1] = (f) => q.value = !q.value)
              }, {
                default: b(() => [
                  d("div", Pe, g(s.facts.instruction), 1)
                ]),
                _: 1
              }, 8, ["open"])
            ])) : h("", !0),
            p(ie, {
              line: `agent transcript ${s.row.id}`
            }, null, 8, ["line"])
          ])) : (l(), r(U, { key: 2 }, [
            p(c(_e), {
              class: "agent-tabs",
              active: S.value,
              answer: { tasks: _.value.length },
              onChoose: n[2] || (n[2] = (f) => S.value = f)
            }, null, 8, ["active", "answer"]),
            d("div", {
              class: "agent-tab-body",
              "data-agent-tab-body": (V = S.value) == null ? void 0 : V.key
            }, [
              p(c(Ce), {
                value: (se = S.value) == null ? void 0 : se.key
              }, ve({
                tasks: b(() => {
                  var f;
                  return [
                    (l(!0), r(U, null, ee(H.value, (w) => (l(), G(c(ue), {
                      key: w.state,
                      label: w.label,
                      count: w.tasks.length,
                      open: P(w.state),
                      "data-agent-section": w.state,
                      onToggle: ($) => W(w.state)
                    }, {
                      default: b(() => [
                        (l(!0), r(U, null, ee(w.tasks, ($) => (l(), r("button", {
                          key: $.id,
                          type: "button",
                          class: "agent-task",
                          "data-agent-delegated": $.id,
                          onClick: (nt) => c(ne)(`tasks:${$.id}`)
                        }, [
                          p(c(Se), {
                            status: $.state
                          }, null, 8, ["status"]),
                          d("span", Ke, g($.id), 1),
                          d("span", Je, g($.title), 1)
                        ], 8, Ge))), 128))
                      ]),
                      _: 2
                    }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
                    (f = s.facts) != null && f.instruction ? (l(), r(U, { key: 0 }, [
                      n[5] || (n[5] = d("p", { class: "agent-label" }, "Instruction", -1)),
                      d("div", Qe, g(s.facts.instruction), 1)
                    ], 64)) : h("", !0)
                  ];
                }),
                transcript: b(() => [
                  p(ie, {
                    line: `agent transcript ${s.row.id}`
                  }, null, 8, ["line"])
                ]),
                _: 2
              }, [
                ee(c(k), (f, w) => ({
                  name: w,
                  fn: b(() => [
                    (l(), G(pe(f), {
                      agent: s.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ], 8, ze)
          ], 64))
        ])) : h("", !0)
      ], 10, Ae);
    };
  }
}, Ze = /* @__PURE__ */ ce(Ye, [["__scopeId", "data-v-7c65f199"]]), et = {
  class: "agents-queue-count",
  "data-agents-queue-count": ""
}, tt = ["data-agent-row"], at = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(s) {
    const K = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], E = s, { rows: J } = $e("usage agents --closed", ["agent.*", "task.*"]), { rows: t } = te("waits"), { rows: Q } = te("progress"), F = (o) => Q.value.find((a) => a.agent_id === o.id) ?? null, X = (o) => {
      var a;
      return ((a = t.value.find((i) => i.agent_id === o.id)) == null ? void 0 : a.reason) ?? "";
    }, { rows: _ } = te("queue"), Y = /* @__PURE__ */ new Set(["queued", "running"]), Z = u(() => _.value.filter((o) => Y.has(o.state)).length), C = v("running"), m = v(""), N = re(), D = v([]), T = v(""), x = v(!1), M = v(!1), R = v(25);
    let H = 0;
    async function O() {
      const o = ++H, a = await N.read(`${E.line} --show ${C.value} --search ${JSON.stringify(m.value)} --limit ${R.value}`);
      o === H && (D.value = a.ok ? a.value.rows : [], T.value = a.ok ? "" : a.error, M.value = a.ok && a.value.page * a.value.size < a.value.total, x.value = !0);
    }
    async function L() {
      return R.value += 25, await O(), !0;
    }
    le([C, m], () => {
      R.value = 25, O();
    }), N.follow(["agent.*", "task.*", ...N.sources.flatMap((o) => o.events)], O), O();
    const P = (o) => J.value.find((a) => a.id === o.id) ?? null, W = D, A = u(() => !!m.value.trim()), S = u(() => E.texts[C.value] ?? { title: E.empty, hint: "" }), k = v(null), I = u(() => W.value.find((o) => o.id === k.value) ?? null), q = u(() => I.value ? [I.value] : W.value), j = u(() => W.value.length - q.value.length), z = (o) => k.value = k.value === o.id ? null : o.id;
    return le(m, (o) => o.trim() && (k.value = null)), (o, a) => (l(), r("div", {
      class: ae(["agents", { focused: I.value }])
    }, [
      p(c(Te), {
        modelValue: m.value,
        "onUpdate:modelValue": a[2] || (a[2] = (i) => m.value = i),
        "data-agents-search": ""
      }, {
        default: b(() => [
          p(c(xe), {
            options: K,
            value: C.value,
            onPick: a[0] || (a[0] = (i) => C.value = i)
          }, null, 8, ["value"]),
          p(c(Re), {
            small: "",
            bordered: "",
            title: "Open the process queue",
            "data-agents-queue": "",
            onClick: a[1] || (a[1] = (i) => c(ne)("test_queue:0"))
          }, {
            default: b(() => [
              a[4] || (a[4] = me("Process queue ", -1)),
              d("span", et, g(Z.value), 1)
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue"]),
      p(c(Oe), {
        rows: q.value,
        failure: T.value,
        loaded: x.value,
        more: M.value,
        older: L,
        empty: S.value.title,
        hint: S.value.hint,
        searching: A.value
      }, {
        default: b(({ row: i }) => [
          d("div", {
            class: "agent-row",
            "data-agent-row": i.id
          }, [
            p(Ze, {
              row: i,
              facts: P(i),
              progress: F(i),
              "wait-reason": X(i),
              open: i.id === k.value,
              onToggle: (e) => z(i)
            }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
          ], 8, tt)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]),
      I.value && j.value ? (l(), r("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: a[3] || (a[3] = (i) => k.value = null)
      }, g(j.value) + " more", 1)) : h("", !0)
    ], 2));
  }
}, ut = /* @__PURE__ */ ce(at, [["__scopeId", "data-v-e7f674e2"]]);
export {
  ut as A
};
