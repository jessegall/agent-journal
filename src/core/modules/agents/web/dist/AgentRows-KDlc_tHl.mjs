/* @code-commandments-generated */
import { openBlock as s, createElementBlock as r, withModifiers as M, unref as u, createTextVNode as ge, toDisplayString as w, createVNode as b, createBlock as C, computed as d, ref as v, defineAsyncComponent as fe, onUnmounted as ve, withKeys as ie, normalizeClass as oe, createElementVNode as g, createCommentVNode as k, Fragment as F, withCtx as E, createSlots as we, renderList as ae, resolveDynamicComponent as ke, watch as ne, nextTick as ye } from "vue";
import { peekRef as me, Icon as se, RunningCommand as he, useNow as be, age as Se, useWindow as pe, loadWindowComponent as $e, TimeAgo as Ce, FoldGroup as re, InnerTabs as Re, SwitchCase as xe, EmptyState as Te, TaskStatusIcon as _e, useRows as Ee, useDeclaredRows as de, SearchBar as Ae, Segmented as Oe, RowList as Be } from "@journal/window-kit";
import { _ as le, T as ue } from "./TranscriptRows-D6C0YYQk.mjs";
const Ie = {
  class: "agent-command",
  "data-agent-command": ""
}, Ne = {
  key: 1,
  "data-agent-stopped": ""
}, qe = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(n) {
    return (H, R) => (s(), r("span", Ie, [
      n.waitReason ? (s(), r("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: R[0] || (R[0] = M((K) => u(me)("test_queue:0"), ["stop"]))
      }, [
        ge("Waiting: " + w(n.waitReason) + " ", 1),
        b(u(se), {
          name: "arrow",
          size: 11
        })
      ])) : n.stopped ? (s(), r("span", Ne, "Waiting")) : (s(), C(u(he), {
        key: 2,
        text: n.command,
        idle: n.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, ce = /* @__PURE__ */ le(qe, [["__scopeId", "data-v-85dcf19e"]]), Le = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], De = { class: "agent-head" }, je = ["data-state"], Ve = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, We = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, ze = {
  key: 3,
  class: "agent-time",
  "data-agent-motion": ""
}, Ue = { class: "agent-line" }, Fe = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Me = {
  key: 0,
  class: "agent-tasks",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, He = {
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, Ke = {
  key: 0,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, Pe = {
  key: 2,
  class: "agent-tab-body",
  "data-agent-tab-body": "transcript",
  "data-agent-only-transcript": ""
}, Ge = {
  key: 0,
  class: "agent-subagent-brief"
}, Je = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Qe = ["data-agent-tab-body"], Xe = ["data-agent-delegated", "onClick"], Ye = { class: "agent-task-number" }, Ze = { class: "agent-task-title" }, et = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, tt = 36e5, at = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(n, { emit: H }) {
    const R = { subagent: "Subagent", reviewer: "Reviewer" }, K = ["started", "blocked", "open", "completed"], t = n, I = H, P = be(), ee = d(() => {
      var a;
      const e = ((a = t.facts) == null ? void 0 : a.profile) || R[t.row.role] || t.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), m = d(() => {
      var e;
      return ((e = t.facts) == null ? void 0 : e.tasks) ?? [];
    }), x = d(() => {
      var e, a;
      return [t.row.program, (e = t.facts) == null ? void 0 : e.model, (a = t.facts) == null ? void 0 : a.effort, t.row.role === "main" ? "" : t.progress ? `${t.row.role} ${t.row.id}` : t.row.role].filter(Boolean).join(" · ");
    }), D = d(() => Se(t.row.process_started_at || t.row.created_at, P.value)), G = /* @__PURE__ */ new Set(["open", "started", "testing"]), T = d(() => !!t.row.ended_at && t.row.role !== "main" && m.value.some((e) => G.has(e.state))), J = d(() => {
      var e;
      return t.waitReason || T.value ? "waiting" : t.row.state === "running" && ((e = t.facts) == null ? void 0 : e.state) || t.row.state;
    }), j = d(() => {
      var a, _, c;
      const e = [];
      return ((a = t.facts) == null ? void 0 : a.context_percent) !== null && ((_ = t.facts) == null ? void 0 : _.context_percent) !== void 0 && e.push(`Context: ${t.facts.context_percent}%`), (c = t.facts) != null && c.cost_dollars && e.push(`$${t.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), A = d(() => {
      var e;
      return ((e = t.progress) == null ? void 0 : e.completed_count) ?? m.value.filter((a) => a.state === "completed").length;
    }), N = d(() => {
      var e;
      return ((e = t.progress) == null ? void 0 : e.task_count) ?? m.value.length;
    }), q = d(() => `${A.value} of ${N.value} ${N.value === 1 ? "task" : "tasks"}`), Q = d(() => {
      var p;
      const e = Date.parse(((p = t.progress) == null ? void 0 : p.started_at) || t.row.created_at), a = t.progress ? t.progress.finished_at : t.row.ended_at, c = ((a ? Date.parse(a) : P.value) - e) / tt;
      return t.row.role !== "main" && c > 0 && A.value ? `${Math.round(A.value / c)}/h` : "";
    }), te = d(() => m.value.length ? K.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: m.value.filter((a) => a.state === e || e === "started" && a.state === "testing" || e === "completed" && a.state === "cancelled") })) : []), V = /* @__PURE__ */ new Set(["completed"]), W = v({}), z = (e) => !(W.value[e] ?? V.has(e)), y = (e) => W.value = { ...W.value, [e]: z(e) }, O = pe(), h = v(O.tabs[0]), X = Object.fromEntries(O.tabs.filter((e) => e.component).map((e) => [e.key, fe(() => $e(e.component))])), Y = d(() => t.row.role === "subagent" || t.row.role === "reviewer"), U = v(!1), L = v(""), l = v(""), o = d(() => t.row.role !== "main" && (!t.row.ended_at || T.value || t.waitReason));
    async function i() {
      if (!o.value) return;
      const e = await O.read(`usage tool --agent ${t.row.id}`);
      L.value = e.ok ? e.value.tool : "", l.value = e.ok ? e.value.note : "";
    }
    const S = O.follow(["hook_call.*", "process_part.*"], i);
    return ve(() => S == null ? void 0 : S()), i(), (e, a) => {
      var _, c, p, Z;
      return s(), r("div", {
        class: oe(["agent-card", { open: n.open }]),
        "data-agent-open": n.row.id,
        "aria-expanded": n.open,
        role: n.open ? void 0 : "button",
        tabindex: n.open ? void 0 : 0,
        title: n.row.session,
        onClick: a[4] || (a[4] = (f) => !n.open && I("toggle")),
        onKeydown: [
          a[5] || (a[5] = ie(M((f) => !n.open && I("toggle"), ["self", "prevent"]), ["enter"])),
          a[6] || (a[6] = ie(M((f) => !n.open && I("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        g("span", De, [
          n.open ? (s(), r("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: a[0] || (a[0] = M((f) => I("toggle"), ["stop"]))
          }, [
            b(u(se), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : k("", !0),
          g("span", {
            class: "agent-dot",
            "data-state": J.value,
            "data-agent-motion": ""
          }, null, 8, je),
          g("span", Ve, w(ee.value), 1),
          g("span", We, w(((_ = n.facts) == null ? void 0 : _.given_name) || n.row.id), 1),
          n.open ? k("", !0) : (s(), C(u(se), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          n.row.ended_at && !T.value ? (s(), C(u(Ce), {
            key: 2,
            class: "agent-time",
            at: n.row.ended_at,
            "data-agent-motion": ""
          }, null, 8, ["at"])) : (s(), r("span", ze, w(D.value), 1))
        ]),
        g("span", Ue, [
          g("span", Fe, w(x.value), 1),
          N.value ? (s(), r(F, { key: 0 }, [
            Q.value ? (s(), r("span", Me, w(Q.value), 1)) : k("", !0),
            g("span", He, w(q.value), 1)
          ], 64)) : k("", !0)
        ]),
        o.value && !n.open ? (s(), C(ce, {
          key: 0,
          class: "agent-command",
          "wait-reason": n.waitReason,
          stopped: T.value,
          command: L.value,
          note: l.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : k("", !0),
        n.open ? (s(), r("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: a[3] || (a[3] = M(() => {
          }, ["stop"]))
        }, [
          j.value ? (s(), r("span", Ke, w(j.value), 1)) : k("", !0),
          o.value ? (s(), C(ce, {
            key: 1,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: T.value,
            command: L.value,
            note: l.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : k("", !0),
          Y.value ? (s(), r("div", Pe, [
            (c = n.facts) != null && c.instruction ? (s(), r("div", Ge, [
              b(u(re), {
                label: "Instruction",
                open: U.value,
                "data-agent-section": "instruction",
                onToggle: a[1] || (a[1] = (f) => U.value = !U.value)
              }, {
                default: E(() => [
                  g("div", Je, w(n.facts.instruction), 1)
                ]),
                _: 1
              }, 8, ["open"])
            ])) : k("", !0),
            b(ue, {
              line: `agent transcript ${n.row.id}`,
              padding: "0"
            }, null, 8, ["line"])
          ])) : (s(), r(F, { key: 3 }, [
            b(u(Re), {
              class: "agent-tabs",
              active: h.value,
              answer: { tasks: m.value.length },
              onChoose: a[2] || (a[2] = (f) => h.value = f)
            }, null, 8, ["active", "answer"]),
            g("div", {
              class: "agent-tab-body",
              "data-agent-tab-body": (p = h.value) == null ? void 0 : p.key
            }, [
              b(u(xe), {
                value: (Z = h.value) == null ? void 0 : Z.key
              }, we({
                tasks: E(() => {
                  var f;
                  return [
                    m.value.length ? k("", !0) : (s(), C(u(Te), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: E(() => [...a[7] || (a[7] = [
                        ge("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (s(!0), r(F, null, ae(te.value, ($) => (s(), C(u(re), {
                      key: $.state,
                      label: $.label,
                      count: $.tasks.length,
                      open: z($.state),
                      "data-agent-section": $.state,
                      onToggle: (B) => y($.state)
                    }, {
                      default: E(() => [
                        (s(!0), r(F, null, ae($.tasks, (B) => (s(), r("button", {
                          key: B.id,
                          type: "button",
                          class: "agent-task",
                          "data-agent-delegated": B.id,
                          onClick: (lt) => u(me)(`tasks:${B.id}`)
                        }, [
                          b(u(_e), {
                            status: B.state
                          }, null, 8, ["status"]),
                          g("span", Ye, w(B.id), 1),
                          g("span", Ze, w(B.title), 1)
                        ], 8, Xe))), 128))
                      ]),
                      _: 2
                    }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
                    (f = n.facts) != null && f.instruction ? (s(), r(F, { key: 1 }, [
                      a[8] || (a[8] = g("p", { class: "agent-label" }, "Instruction", -1)),
                      g("div", et, w(n.facts.instruction), 1)
                    ], 64)) : k("", !0)
                  ];
                }),
                transcript: E(() => [
                  b(ue, {
                    line: `agent transcript ${n.row.id}`,
                    padding: "0"
                  }, null, 8, ["line"])
                ]),
                _: 2
              }, [
                ae(u(X), (f, $) => ({
                  name: $,
                  fn: E(() => [
                    (s(), C(ke(f), {
                      agent: n.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ], 8, Qe)
          ], 64))
        ])) : k("", !0)
      ], 42, Le);
    };
  }
}, nt = /* @__PURE__ */ le(at, [["__scopeId", "data-v-b56f3459"]]), ot = ["data-agent-row"], st = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(n) {
    const H = [
      { key: "running", label: "Running" },
      { key: "idle", label: "Idle" },
      { key: "retired", label: "Retired" },
      { key: "all", label: "All" }
    ], R = n, { rows: K } = Ee("usage agents --closed", ["agent.*", "task.*"]), { rows: t } = de("waits"), { rows: I } = de("progress"), P = (l) => I.value.find((o) => o.agent_id === l.id) ?? null, ee = (l) => {
      var o;
      return ((o = t.value.find((i) => i.agent_id === l.id)) == null ? void 0 : o.reason) ?? "";
    }, m = v("running"), x = v(""), D = pe(), G = v([]), T = v(""), J = v(!1), j = v(!1), A = v(25);
    let N = 0;
    async function q() {
      const l = ++N, o = await D.read(`${R.line} --show ${m.value} --search ${JSON.stringify(x.value)} --limit ${A.value}`);
      l === N && (G.value = o.ok ? o.value.rows : [], T.value = o.ok ? "" : o.error, j.value = o.ok && o.value.page * o.value.size < o.value.total, J.value = !0);
    }
    async function Q() {
      return A.value += 25, await q(), !0;
    }
    ne([m, x], () => {
      A.value = 25, q();
    }), D.follow(["agent.*", "task.*", ...D.sources.flatMap((l) => l.events)], q), q();
    const te = (l) => K.value.find((o) => o.id === l.id) ?? null, V = G, W = d(() => !!x.value.trim()), z = d(() => R.texts[m.value] ?? { title: R.empty, hint: "" }), y = v(null), O = v(null), h = d(() => V.value.find((l) => l.id === y.value) ?? null), X = d(() => h.value ? [h.value] : V.value), Y = d(() => V.value.length - X.value.length), U = (l) => {
      y.value = y.value === l.id ? null : l.id;
    };
    ne(y, async (l, o) => {
      const i = O.value.querySelector(`[data-agent-open="${l ?? o}"]`), S = [i, ...i.querySelectorAll("[data-agent-motion]")], e = S.map((c) => c.getBoundingClientRect());
      if (S.forEach((c) => c.getAnimations().forEach((p) => p.cancel())), await ye(), window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const a = S.map((c) => c.getBoundingClientRect()), _ = e[0].top - a[0].top;
      S.forEach((c, p) => {
        const Z = e[p].left - a[p].left, f = e[p].top - a[p].top - (p ? _ : 0);
        c.animate([{ transform: `translate(${Z}px, ${f}px)` }, { transform: "translate(0, 0)" }], { duration: 320, easing: "cubic-bezier(0.22, 0.7, 0.3, 1)" });
      });
    }), ne(x, (l) => l.trim() && (y.value = null));
    const L = (l) => {
      l.key === "Escape" && y.value && (y.value = null);
    };
    return window.addEventListener("keydown", L), ve(() => window.removeEventListener("keydown", L)), (l, o) => (s(), r("div", {
      ref_key: "agents",
      ref: O,
      class: oe(["agents", { focused: h.value }])
    }, [
      h.value ? k("", !0) : (s(), C(u(Ae), {
        key: 0,
        modelValue: x.value,
        "onUpdate:modelValue": o[1] || (o[1] = (i) => x.value = i),
        placeholder: "Search agents",
        "data-agents-search": ""
      }, {
        default: E(() => [
          b(u(Oe), {
            options: H,
            value: m.value,
            onPick: o[0] || (o[0] = (i) => m.value = i)
          }, null, 8, ["value"])
        ]),
        _: 1
      }, 8, ["modelValue"])),
      g("div", {
        class: oe(["agents-view", { "agents-view-open": h.value }])
      }, [
        b(u(Be), {
          rows: X.value,
          failure: T.value,
          loaded: J.value,
          more: j.value,
          older: Q,
          empty: z.value.title,
          hint: z.value.hint,
          searching: W.value
        }, {
          default: E(({ row: i }) => [
            g("div", {
              class: "agent-row",
              "data-agent-row": i.id
            }, [
              b(nt, {
                row: i,
                facts: te(i),
                progress: P(i),
                "wait-reason": ee(i),
                open: i.id === y.value,
                onToggle: (S) => U(i)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, ot)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"])
      ], 2),
      h.value && Y.value ? (s(), r("button", {
        key: 1,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: o[2] || (o[2] = (i) => y.value = null)
      }, w(Y.value) + " more", 1)) : k("", !0)
    ], 2));
  }
}, ut = /* @__PURE__ */ le(st, [["__scopeId", "data-v-7c90f2c9"]]);
export {
  ut as A
};
