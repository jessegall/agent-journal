/* @code-commandments-generated */
import { openBlock as o, createElementBlock as i, withModifiers as K, unref as d, createTextVNode as ge, toDisplayString as p, createVNode as w, createBlock as b, computed as r, ref as c, defineAsyncComponent as we, onUnmounted as ve, withKeys as le, normalizeClass as ae, createElementVNode as g, createCommentVNode as m, Fragment as H, withCtx as S, createSlots as fe, renderList as te, resolveDynamicComponent as ke, watch as ie, normalizeStyle as ye, Transition as he } from "vue";
import { peekRef as pe, Icon as ne, RunningCommand as be, useNow as Se, age as Ce, useWindow as me, loadWindowComponent as $e, TimeAgo as Re, FoldGroup as re, InnerTabs as xe, SwitchCase as Te, EmptyState as _e, TaskStatusIcon as Oe, useRows as Ae, useDeclaredRows as ue, SearchBar as Ee, Segmented as Be, RowList as Ie } from "@journal/window-kit";
import { _ as oe, T as de } from "./TranscriptRows-CjXeMFF-.js";
const Ne = {
  class: "agent-command",
  "data-agent-command": ""
}, Le = {
  key: 1,
  "data-agent-stopped": ""
}, qe = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(n) {
    return (M, C) => (o(), i("span", Ne, [
      n.waitReason ? (o(), i("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: C[0] || (C[0] = K((P) => d(pe)("test_queue:0"), ["stop"]))
      }, [
        ge("Waiting: " + p(n.waitReason) + " ", 1),
        w(d(ne), {
          name: "arrow",
          size: 11
        })
      ])) : n.stopped ? (o(), i("span", Le, "Waiting")) : (o(), b(d(be), {
        key: 2,
        text: n.command,
        idle: n.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, ce = /* @__PURE__ */ oe(qe, [["__scopeId", "data-v-70734c30"]]), De = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], je = { class: "agent-head" }, Ve = ["data-state"], We = {
  class: "agent-title",
  "data-agent-title": ""
}, ze = {
  class: "agent-name",
  "data-agent-name": ""
}, Ue = {
  key: 3,
  class: "agent-time"
}, Fe = { class: "agent-line" }, He = {
  class: "agent-identity",
  "data-agent-identity": ""
}, Ke = {
  key: 0,
  class: "agent-tasks",
  "data-agent-pace": ""
}, Me = {
  class: "agent-tasks",
  "data-agent-tasks": ""
}, Pe = {
  key: 0,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, Ge = {
  key: 2,
  class: "agent-tab-body",
  "data-agent-tab-body": "transcript",
  "data-agent-only-transcript": ""
}, Je = {
  key: 0,
  class: "agent-subagent-brief"
}, Qe = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Xe = ["data-agent-tab-body"], Ye = ["data-agent-delegated", "onClick"], Ze = { class: "agent-task-number" }, et = { class: "agent-task-title" }, tt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, at = 36e5, nt = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(n, { emit: M }) {
    const C = { subagent: "Subagent", reviewer: "Reviewer" }, P = ["started", "blocked", "open", "completed"], t = n, E = M, G = Se(), Z = r(() => {
      var a;
      const e = ((a = t.facts) == null ? void 0 : a.profile) || C[t.row.role] || t.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), v = r(() => {
      var e;
      return ((e = t.facts) == null ? void 0 : e.tasks) ?? [];
    }), $ = r(() => {
      var e, a;
      return [t.row.program, (e = t.facts) == null ? void 0 : e.model, (a = t.facts) == null ? void 0 : a.effort, t.row.role === "main" ? "" : t.progress ? `${t.row.role} ${t.row.id}` : t.row.role].filter(Boolean).join(" · ");
    }), D = r(() => Ce(t.row.process_started_at || t.row.created_at, G.value)), J = /* @__PURE__ */ new Set(["open", "started", "testing"]), R = r(() => !!t.row.ended_at && t.row.role !== "main" && v.value.some((e) => J.has(e.state))), Q = r(() => {
      var e;
      return t.waitReason || R.value ? "waiting" : t.row.state === "running" && ((e = t.facts) == null ? void 0 : e.state) || t.row.state;
    }), j = r(() => {
      var a, q, T;
      const e = [];
      return ((a = t.facts) == null ? void 0 : a.context_percent) !== null && ((q = t.facts) == null ? void 0 : q.context_percent) !== void 0 && e.push(`Context: ${t.facts.context_percent}%`), (T = t.facts) != null && T.cost_dollars && e.push(`$${t.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), _ = r(() => {
      var e;
      return ((e = t.progress) == null ? void 0 : e.completed_count) ?? v.value.filter((a) => a.state === "completed").length;
    }), B = r(() => {
      var e;
      return ((e = t.progress) == null ? void 0 : e.task_count) ?? v.value.length;
    }), I = r(() => `${_.value} of ${B.value} ${B.value === 1 ? "task" : "tasks"}`), X = r(() => {
      var F;
      const e = Date.parse(((F = t.progress) == null ? void 0 : F.started_at) || t.row.created_at), a = t.progress ? t.progress.finished_at : t.row.ended_at, T = ((a ? Date.parse(a) : G.value) - e) / at;
      return t.row.role !== "main" && T > 0 && _.value ? `${Math.round(_.value / T)}/h` : "";
    }), ee = r(() => v.value.length ? P.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: v.value.filter((a) => a.state === e || e === "started" && a.state === "testing" || e === "completed" && a.state === "cancelled") })) : []), V = /* @__PURE__ */ new Set(["completed"]), W = c({}), z = (e) => !(W.value[e] ?? V.has(e)), f = (e) => W.value = { ...W.value, [e]: z(e) }, x = me(), O = c(x.tabs[0]), y = Object.fromEntries(x.tabs.filter((e) => e.component).map((e) => [e.key, we(() => $e(e.component))])), Y = r(() => t.row.role === "subagent" || t.row.role === "reviewer"), N = c(!1), U = c(""), L = c(""), l = r(() => t.row.role !== "main" && (!t.row.ended_at || R.value || t.waitReason));
    async function s() {
      if (!l.value) return;
      const e = await x.read(`usage tool --agent ${t.row.id}`);
      U.value = e.ok ? e.value.tool : "", L.value = e.ok ? e.value.note : "";
    }
    const u = x.follow(["hook_call.*", "process_part.*"], s);
    return ve(() => u == null ? void 0 : u()), s(), (e, a) => {
      var q, T, F, se;
      return o(), i("div", {
        class: ae(["agent-card", { open: n.open }]),
        "data-agent-open": n.row.id,
        "aria-expanded": n.open,
        role: n.open ? void 0 : "button",
        tabindex: n.open ? void 0 : 0,
        title: n.row.session,
        onClick: a[4] || (a[4] = (k) => !n.open && E("toggle")),
        onKeydown: [
          a[5] || (a[5] = le(K((k) => !n.open && E("toggle"), ["self", "prevent"]), ["enter"])),
          a[6] || (a[6] = le(K((k) => !n.open && E("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        g("span", je, [
          n.open ? (o(), i("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: a[0] || (a[0] = K((k) => E("toggle"), ["stop"]))
          }, [
            w(d(ne), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : m("", !0),
          g("span", {
            class: "agent-dot",
            "data-state": Q.value
          }, null, 8, Ve),
          g("span", We, p(Z.value), 1),
          g("span", ze, p(((q = n.facts) == null ? void 0 : q.given_name) || n.row.id), 1),
          n.open ? m("", !0) : (o(), b(d(ne), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          n.row.ended_at && !R.value ? (o(), b(d(Re), {
            key: 2,
            class: "agent-time",
            at: n.row.ended_at
          }, null, 8, ["at"])) : (o(), i("span", Ue, p(D.value), 1))
        ]),
        g("span", Fe, [
          g("span", He, p($.value), 1),
          B.value ? (o(), i(H, { key: 0 }, [
            X.value ? (o(), i("span", Ke, p(X.value), 1)) : m("", !0),
            g("span", Me, p(I.value), 1)
          ], 64)) : m("", !0)
        ]),
        l.value && !n.open ? (o(), b(ce, {
          key: 0,
          class: "agent-command",
          "wait-reason": n.waitReason,
          stopped: R.value,
          command: U.value,
          note: L.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0),
        n.open ? (o(), i("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: a[3] || (a[3] = K(() => {
          }, ["stop"]))
        }, [
          j.value ? (o(), i("span", Pe, p(j.value), 1)) : m("", !0),
          l.value ? (o(), b(ce, {
            key: 1,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: R.value,
            command: U.value,
            note: L.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0),
          Y.value ? (o(), i("div", Ge, [
            (T = n.facts) != null && T.instruction ? (o(), i("div", Je, [
              w(d(re), {
                label: "Instruction",
                open: N.value,
                "data-agent-section": "instruction",
                onToggle: a[1] || (a[1] = (k) => N.value = !N.value)
              }, {
                default: S(() => [
                  g("div", Qe, p(n.facts.instruction), 1)
                ]),
                _: 1
              }, 8, ["open"])
            ])) : m("", !0),
            w(de, {
              line: `agent transcript ${n.row.id}`,
              padding: "0"
            }, null, 8, ["line"])
          ])) : (o(), i(H, { key: 3 }, [
            w(d(xe), {
              class: "agent-tabs",
              active: O.value,
              answer: { tasks: v.value.length },
              onChoose: a[2] || (a[2] = (k) => O.value = k)
            }, null, 8, ["active", "answer"]),
            g("div", {
              class: "agent-tab-body",
              "data-agent-tab-body": (F = O.value) == null ? void 0 : F.key
            }, [
              w(d(Te), {
                value: (se = O.value) == null ? void 0 : se.key
              }, fe({
                tasks: S(() => {
                  var k;
                  return [
                    v.value.length ? m("", !0) : (o(), b(d(_e), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: S(() => [...a[7] || (a[7] = [
                        ge("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (o(!0), i(H, null, te(ee.value, (h) => (o(), b(d(re), {
                      key: h.state,
                      label: h.label,
                      count: h.tasks.length,
                      open: z(h.state),
                      "data-agent-section": h.state,
                      onToggle: (A) => f(h.state)
                    }, {
                      default: S(() => [
                        (o(!0), i(H, null, te(h.tasks, (A) => (o(), i("button", {
                          key: A.id,
                          type: "button",
                          class: "agent-task",
                          "data-agent-delegated": A.id,
                          onClick: (it) => d(pe)(`tasks:${A.id}`)
                        }, [
                          w(d(Oe), {
                            status: A.state
                          }, null, 8, ["status"]),
                          g("span", Ze, p(A.id), 1),
                          g("span", et, p(A.title), 1)
                        ], 8, Ye))), 128))
                      ]),
                      _: 2
                    }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
                    (k = n.facts) != null && k.instruction ? (o(), i(H, { key: 1 }, [
                      a[8] || (a[8] = g("p", { class: "agent-label" }, "Instruction", -1)),
                      g("div", tt, p(n.facts.instruction), 1)
                    ], 64)) : m("", !0)
                  ];
                }),
                transcript: S(() => [
                  w(de, {
                    line: `agent transcript ${n.row.id}`,
                    padding: "0"
                  }, null, 8, ["line"])
                ]),
                _: 2
              }, [
                te(d(y), (k, h) => ({
                  name: h,
                  fn: S(() => [
                    (o(), b(ke(k), {
                      agent: n.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ], 8, Xe)
          ], 64))
        ])) : m("", !0)
      ], 42, De);
    };
  }
}, ot = /* @__PURE__ */ oe(nt, [["__scopeId", "data-v-11633900"]]), st = ["data-agent-row"], lt = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(n) {
    const M = [
      { key: "running", label: "Running" },
      { key: "idle", label: "Idle" },
      { key: "retired", label: "Retired" },
      { key: "all", label: "All" }
    ], C = n, { rows: P } = Ae("usage agents --closed", ["agent.*", "task.*"]), { rows: t } = ue("waits"), { rows: E } = ue("progress"), G = (l) => E.value.find((s) => s.agent_id === l.id) ?? null, Z = (l) => {
      var s;
      return ((s = t.value.find((u) => u.agent_id === l.id)) == null ? void 0 : s.reason) ?? "";
    }, v = c("running"), $ = c(""), D = me(), J = c([]), R = c(""), Q = c(!1), j = c(!1), _ = c(25);
    let B = 0;
    async function I() {
      const l = ++B, s = await D.read(`${C.line} --show ${v.value} --search ${JSON.stringify($.value)} --limit ${_.value}`);
      l === B && (J.value = s.ok ? s.value.rows : [], R.value = s.ok ? "" : s.error, j.value = s.ok && s.value.page * s.value.size < s.value.total, Q.value = !0);
    }
    async function X() {
      return _.value += 25, await I(), !0;
    }
    ie([v, $], () => {
      _.value = 25, I();
    }), D.follow(["agent.*", "task.*", ...D.sources.flatMap((l) => l.events)], I), I();
    const ee = (l) => P.value.find((s) => s.id === l.id) ?? null, V = J, W = r(() => !!$.value.trim()), z = r(() => C.texts[v.value] ?? { title: C.empty, hint: "" }), f = c(null), x = c(null), O = c(0), y = r(() => V.value.find((l) => l.id === f.value) ?? null), Y = r(() => y.value ? [y.value] : V.value), N = r(() => V.value.length - Y.value.length), U = (l) => {
      if (f.value !== l.id) {
        const s = x.value.querySelector(`[data-agent-open="${l.id}"]`);
        O.value = s.getBoundingClientRect().top - x.value.getBoundingClientRect().top;
      }
      f.value = f.value === l.id ? null : l.id;
    };
    ie($, (l) => l.trim() && (f.value = null));
    const L = (l) => {
      l.key === "Escape" && f.value && (f.value = null);
    };
    return window.addEventListener("keydown", L), ve(() => window.removeEventListener("keydown", L)), (l, s) => (o(), i("div", {
      ref_key: "agents",
      ref: x,
      class: ae(["agents", { focused: y.value }]),
      style: ye({ "--agent-row-offset": `${O.value}px` })
    }, [
      y.value ? m("", !0) : (o(), b(d(Ee), {
        key: 0,
        modelValue: $.value,
        "onUpdate:modelValue": s[1] || (s[1] = (u) => $.value = u),
        placeholder: "Search agents",
        "data-agents-search": ""
      }, {
        default: S(() => [
          w(d(Be), {
            options: M,
            value: v.value,
            onPick: s[0] || (s[0] = (u) => v.value = u)
          }, null, 8, ["value"])
        ]),
        _: 1
      }, 8, ["modelValue"])),
      w(he, {
        name: "agents-view",
        mode: "out-in"
      }, {
        default: S(() => [
          (o(), i("div", {
            key: y.value ? "open" : "list",
            class: ae(["agents-view", { "agents-view-open": y.value }])
          }, [
            w(d(Ie), {
              rows: Y.value,
              failure: R.value,
              loaded: Q.value,
              more: j.value,
              older: X,
              empty: z.value.title,
              hint: z.value.hint,
              searching: W.value
            }, {
              default: S(({ row: u }) => [
                g("div", {
                  class: "agent-row",
                  "data-agent-row": u.id
                }, [
                  w(ot, {
                    row: u,
                    facts: ee(u),
                    progress: G(u),
                    "wait-reason": Z(u),
                    open: u.id === f.value,
                    onToggle: (e) => U(u)
                  }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
                ], 8, st)
              ]),
              _: 1
            }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"])
          ], 2))
        ]),
        _: 1
      }),
      y.value && N.value ? (o(), i("button", {
        key: 1,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: s[2] || (s[2] = (u) => f.value = null)
      }, p(N.value) + " more", 1)) : m("", !0)
    ], 6));
  }
}, ct = /* @__PURE__ */ oe(lt, [["__scopeId", "data-v-52aa9dbd"]]);
export {
  ct as A
};
