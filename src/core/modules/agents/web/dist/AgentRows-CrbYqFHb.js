/* @code-commandments-generated */
import { openBlock as s, createElementBlock as l, withModifiers as M, unref as u, createTextVNode as oe, toDisplayString as c, createVNode as v, createBlock as S, computed as i, ref as d, defineAsyncComponent as we, onUnmounted as pe, withKeys as re, normalizeClass as ae, createElementVNode as r, createCommentVNode as g, Fragment as F, withCtx as k, createSlots as fe, renderList as te, resolveDynamicComponent as ke, watch as de, normalizeStyle as ye, Transition as he } from "vue";
import { peekRef as le, Icon as se, RunningCommand as be, useNow as Se, age as $e, useWindow as me, loadWindowComponent as Ce, TimeAgo as Re, FoldGroup as ce, InnerTabs as xe, SwitchCase as Te, EmptyState as _e, TaskStatusIcon as Oe, useRows as qe, useDeclaredRows as ne, SearchBar as Ae, Segmented as Ie, Btn as Be, RowList as Ee } from "@journal/window-kit";
import { _ as ie, T as ge } from "./TranscriptRows-CjXeMFF-.js";
const Ne = {
  class: "agent-command",
  "data-agent-command": ""
}, Le = {
  key: 1,
  "data-agent-stopped": ""
}, De = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(a) {
    return (H, $) => (s(), l("span", Ne, [
      a.waitReason ? (s(), l("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: $[0] || ($[0] = M((K) => u(le)("test_queue:0"), ["stop"]))
      }, [
        oe("Waiting: " + c(a.waitReason) + " ", 1),
        v(u(se), {
          name: "arrow",
          size: 11
        })
      ])) : a.stopped ? (s(), l("span", Le, "Waiting")) : (s(), S(u(be), {
        key: 2,
        text: a.command,
        idle: a.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, ve = /* @__PURE__ */ ie(De, [["__scopeId", "data-v-70734c30"]]), We = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], je = { class: "agent-head" }, Ve = ["data-state"], ze = {
  class: "agent-title",
  "data-agent-title": ""
}, Ue = {
  class: "agent-name",
  "data-agent-name": ""
}, Fe = {
  key: 3,
  class: "agent-time"
}, Me = { class: "agent-line" }, He = {
  class: "agent-identity",
  "data-agent-identity": ""
}, Ke = {
  key: 0,
  class: "agent-tasks",
  "data-agent-pace": ""
}, Pe = {
  class: "agent-tasks",
  "data-agent-tasks": ""
}, Ge = {
  key: 0,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, Je = {
  key: 2,
  class: "agent-tab-body",
  "data-agent-tab-body": "transcript",
  "data-agent-only-transcript": ""
}, Qe = {
  key: 0,
  class: "agent-subagent-brief"
}, Xe = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ye = ["data-agent-tab-body"], Ze = ["data-agent-delegated", "onClick"], et = { class: "agent-task-number" }, tt = { class: "agent-task-title" }, nt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, at = 36e5, st = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(a, { emit: H }) {
    const $ = { main: "Main agent", subagent: "Subagent", reviewer: "Reviewer" }, K = ["started", "blocked", "open", "completed"], n = a, T = H, P = Se(), Y = i(() => {
      var t;
      const e = ((t = n.facts) == null ? void 0 : t.profile) || $[n.row.role] || n.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), y = i(() => {
      var e;
      return ((e = n.facts) == null ? void 0 : e.tasks) ?? [];
    }), Z = i(() => {
      var e, t;
      return [n.row.program, (e = n.facts) == null ? void 0 : e.model, (t = n.facts) == null ? void 0 : t.effort, n.row.role === "main" ? "" : n.progress ? `${n.row.role} ${n.row.id}` : n.row.role].filter(Boolean).join(" · ");
    }), ee = i(() => $e(n.row.process_started_at || n.row.created_at, P.value)), C = /* @__PURE__ */ new Set(["open", "started", "testing"]), p = i(() => !!n.row.ended_at && n.row.role !== "main" && y.value.some((e) => C.has(e.state))), D = i(() => {
      var e;
      return n.waitReason || p.value ? "waiting" : n.row.state === "running" && ((e = n.facts) == null ? void 0 : e.state) || n.row.state;
    }), W = i(() => {
      var t, o, h;
      const e = [];
      return ((t = n.facts) == null ? void 0 : t.context_percent) !== null && ((o = n.facts) == null ? void 0 : o.context_percent) !== void 0 && e.push(`Context: ${n.facts.context_percent}%`), (h = n.facts) != null && h.cost_dollars && e.push(`$${n.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), _ = i(() => {
      var e;
      return ((e = n.progress) == null ? void 0 : e.completed_count) ?? y.value.filter((t) => t.state === "completed").length;
    }), O = i(() => {
      var e;
      return ((e = n.progress) == null ? void 0 : e.task_count) ?? y.value.length;
    }), G = i(() => `${_.value} of ${O.value} ${O.value === 1 ? "task" : "tasks"}`), q = i(() => {
      var U;
      const e = Date.parse(((U = n.progress) == null ? void 0 : U.started_at) || n.row.created_at), t = n.progress ? n.progress.finished_at : n.row.ended_at, h = ((t ? Date.parse(t) : P.value) - e) / at;
      return n.row.role !== "main" && h > 0 && _.value ? `${Math.round(_.value / h)}/h` : "";
    }), J = i(() => y.value.length ? K.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: y.value.filter((t) => t.state === e || e === "started" && t.state === "testing" || e === "completed" && t.state === "cancelled") })) : []), A = /* @__PURE__ */ new Set(["completed"]), j = d({}), Q = (e) => !(j.value[e] ?? A.has(e)), V = (e) => j.value = { ...j.value, [e]: Q(e) }, I = me(), R = d(I.tabs[0]), m = Object.fromEntries(I.tabs.filter((e) => e.component).map((e) => [e.key, we(() => Ce(e.component))])), z = i(() => n.row.role === "subagent" || n.row.role === "reviewer"), B = d(!1), w = d(""), E = d(""), N = i(() => n.row.role !== "main" && (!n.row.ended_at || p.value || n.waitReason));
    async function X() {
      if (!N.value) return;
      const e = await I.read(`usage tool --agent ${n.row.id}`);
      w.value = e.ok ? e.value.tool : "", E.value = e.ok ? e.value.note : "";
    }
    const L = I.follow(["hook_call.*", "process_part.*"], X);
    return pe(() => L == null ? void 0 : L()), X(), (e, t) => {
      var o, h, U, ue;
      return s(), l("div", {
        class: ae(["agent-card", { open: a.open }]),
        "data-agent-open": a.row.id,
        "aria-expanded": a.open,
        role: a.open ? void 0 : "button",
        tabindex: a.open ? void 0 : 0,
        title: a.row.session,
        onClick: t[4] || (t[4] = (f) => !a.open && T("toggle")),
        onKeydown: [
          t[5] || (t[5] = re(M((f) => !a.open && T("toggle"), ["self", "prevent"]), ["enter"])),
          t[6] || (t[6] = re(M((f) => !a.open && T("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        r("span", je, [
          a.open ? (s(), l("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: t[0] || (t[0] = M((f) => T("toggle"), ["stop"]))
          }, [
            v(u(se), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : g("", !0),
          r("span", {
            class: "agent-dot",
            "data-state": D.value
          }, null, 8, Ve),
          r("span", ze, c(Y.value), 1),
          r("span", Ue, c(((o = a.facts) == null ? void 0 : o.given_name) || a.row.id), 1),
          a.open ? g("", !0) : (s(), S(u(se), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          a.row.ended_at && !p.value ? (s(), S(u(Re), {
            key: 2,
            class: "agent-time",
            at: a.row.ended_at
          }, null, 8, ["at"])) : (s(), l("span", Fe, c(ee.value), 1))
        ]),
        r("span", Me, [
          r("span", He, c(Z.value), 1),
          O.value ? (s(), l(F, { key: 0 }, [
            q.value ? (s(), l("span", Ke, c(q.value), 1)) : g("", !0),
            r("span", Pe, c(G.value), 1)
          ], 64)) : g("", !0)
        ]),
        N.value && !a.open ? (s(), S(ve, {
          key: 0,
          class: "agent-command",
          "wait-reason": a.waitReason,
          stopped: p.value,
          command: w.value,
          note: E.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : g("", !0),
        a.open ? (s(), l("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: t[3] || (t[3] = M(() => {
          }, ["stop"]))
        }, [
          W.value ? (s(), l("span", Ge, c(W.value), 1)) : g("", !0),
          N.value ? (s(), S(ve, {
            key: 1,
            class: "agent-command",
            "wait-reason": a.waitReason,
            stopped: p.value,
            command: w.value,
            note: E.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : g("", !0),
          z.value ? (s(), l("div", Je, [
            (h = a.facts) != null && h.instruction ? (s(), l("div", Qe, [
              v(u(ce), {
                label: "Instruction",
                open: B.value,
                "data-agent-section": "instruction",
                onToggle: t[1] || (t[1] = (f) => B.value = !B.value)
              }, {
                default: k(() => [
                  r("div", Xe, c(a.facts.instruction), 1)
                ]),
                _: 1
              }, 8, ["open"])
            ])) : g("", !0),
            v(ge, {
              line: `agent transcript ${a.row.id}`,
              padding: "0"
            }, null, 8, ["line"])
          ])) : (s(), l(F, { key: 3 }, [
            v(u(xe), {
              class: "agent-tabs",
              active: R.value,
              answer: { tasks: y.value.length },
              onChoose: t[2] || (t[2] = (f) => R.value = f)
            }, null, 8, ["active", "answer"]),
            r("div", {
              class: "agent-tab-body",
              "data-agent-tab-body": (U = R.value) == null ? void 0 : U.key
            }, [
              v(u(Te), {
                value: (ue = R.value) == null ? void 0 : ue.key
              }, fe({
                tasks: k(() => {
                  var f;
                  return [
                    y.value.length ? g("", !0) : (s(), S(u(_e), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: k(() => [...t[7] || (t[7] = [
                        oe("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (s(!0), l(F, null, te(J.value, (b) => (s(), S(u(ce), {
                      key: b.state,
                      label: b.label,
                      count: b.tasks.length,
                      open: Q(b.state),
                      "data-agent-section": b.state,
                      onToggle: (x) => V(b.state)
                    }, {
                      default: k(() => [
                        (s(!0), l(F, null, te(b.tasks, (x) => (s(), l("button", {
                          key: x.id,
                          type: "button",
                          class: "agent-task",
                          "data-agent-delegated": x.id,
                          onClick: (rt) => u(le)(`tasks:${x.id}`)
                        }, [
                          v(u(Oe), {
                            status: x.state
                          }, null, 8, ["status"]),
                          r("span", et, c(x.id), 1),
                          r("span", tt, c(x.title), 1)
                        ], 8, Ze))), 128))
                      ]),
                      _: 2
                    }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
                    (f = a.facts) != null && f.instruction ? (s(), l(F, { key: 1 }, [
                      t[8] || (t[8] = r("p", { class: "agent-label" }, "Instruction", -1)),
                      r("div", nt, c(a.facts.instruction), 1)
                    ], 64)) : g("", !0)
                  ];
                }),
                transcript: k(() => [
                  v(ge, {
                    line: `agent transcript ${a.row.id}`,
                    padding: "0"
                  }, null, 8, ["line"])
                ]),
                _: 2
              }, [
                te(u(m), (f, b) => ({
                  name: b,
                  fn: k(() => [
                    (s(), S(ke(f), {
                      agent: a.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ], 8, Ye)
          ], 64))
        ])) : g("", !0)
      ], 42, We);
    };
  }
}, ot = /* @__PURE__ */ ie(st, [["__scopeId", "data-v-da174ca3"]]), lt = {
  class: "agents-queue-count",
  "data-agents-queue-count": ""
}, it = ["data-agent-row"], ut = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(a) {
    const H = [
      { key: "running", label: "Running" },
      { key: "idle", label: "Idle" },
      { key: "retired", label: "Retired" },
      { key: "all", label: "All" }
    ], $ = a, { rows: K } = qe("usage agents --closed", ["agent.*", "task.*"]), { rows: n } = ne("waits"), { rows: T } = ne("progress"), P = (e) => T.value.find((t) => t.agent_id === e.id) ?? null, Y = (e) => {
      var t;
      return ((t = n.value.find((o) => o.agent_id === e.id)) == null ? void 0 : t.reason) ?? "";
    }, { rows: y } = ne("queue"), Z = /* @__PURE__ */ new Set(["queued", "running"]), ee = i(() => y.value.filter((e) => Z.has(e.state)).length), C = d("running"), p = d(""), D = me(), W = d([]), _ = d(""), O = d(!1), G = d(!1), q = d(25);
    let J = 0;
    async function A() {
      const e = ++J, t = await D.read(`${$.line} --show ${C.value} --search ${JSON.stringify(p.value)} --limit ${q.value}`);
      e === J && (W.value = t.ok ? t.value.rows : [], _.value = t.ok ? "" : t.error, G.value = t.ok && t.value.page * t.value.size < t.value.total, O.value = !0);
    }
    async function j() {
      return q.value += 25, await A(), !0;
    }
    de([C, p], () => {
      q.value = 25, A();
    }), D.follow(["agent.*", "task.*", ...D.sources.flatMap((e) => e.events)], A), A();
    const Q = (e) => K.value.find((t) => t.id === e.id) ?? null, V = W, I = i(() => !!p.value.trim()), R = i(() => $.texts[C.value] ?? { title: $.empty, hint: "" }), m = d(null), z = d(null), B = d(0), w = i(() => V.value.find((e) => e.id === m.value) ?? null), E = i(() => w.value ? [w.value] : V.value), N = i(() => V.value.length - E.value.length), X = (e) => {
      if (m.value !== e.id) {
        const t = z.value.querySelector(`[data-agent-open="${e.id}"]`);
        B.value = t.getBoundingClientRect().top - z.value.getBoundingClientRect().top;
      }
      m.value = m.value === e.id ? null : e.id;
    };
    de(p, (e) => e.trim() && (m.value = null));
    const L = (e) => {
      e.key === "Escape" && m.value && (m.value = null);
    };
    return window.addEventListener("keydown", L), pe(() => window.removeEventListener("keydown", L)), (e, t) => (s(), l("div", {
      ref_key: "agents",
      ref: z,
      class: ae(["agents", { focused: w.value }]),
      style: ye({ "--agent-row-offset": `${B.value}px` })
    }, [
      w.value ? g("", !0) : (s(), S(u(Ae), {
        key: 0,
        modelValue: p.value,
        "onUpdate:modelValue": t[2] || (t[2] = (o) => p.value = o),
        placeholder: "Search agents",
        "data-agents-search": ""
      }, {
        default: k(() => [
          v(u(Ie), {
            options: H,
            value: C.value,
            onPick: t[0] || (t[0] = (o) => C.value = o)
          }, null, 8, ["value"]),
          v(u(Be), {
            small: "",
            bordered: "",
            title: "Open the process queue",
            "data-agents-queue": "",
            onClick: t[1] || (t[1] = (o) => u(le)("test_queue:0"))
          }, {
            default: k(() => [
              t[4] || (t[4] = oe("Process queue ", -1)),
              r("span", lt, c(ee.value), 1)
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue"])),
      v(he, {
        name: "agents-view",
        mode: "out-in"
      }, {
        default: k(() => [
          (s(), l("div", {
            key: w.value ? "open" : "list",
            class: ae(["agents-view", { "agents-view-open": w.value }])
          }, [
            v(u(Ee), {
              rows: E.value,
              failure: _.value,
              loaded: O.value,
              more: G.value,
              older: j,
              empty: R.value.title,
              hint: R.value.hint,
              searching: I.value
            }, {
              default: k(({ row: o }) => [
                r("div", {
                  class: "agent-row",
                  "data-agent-row": o.id
                }, [
                  v(ot, {
                    row: o,
                    facts: Q(o),
                    progress: P(o),
                    "wait-reason": Y(o),
                    open: o.id === m.value,
                    onToggle: (h) => X(o)
                  }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
                ], 8, it)
              ]),
              _: 1
            }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"])
          ], 2))
        ]),
        _: 1
      }),
      w.value && N.value ? (s(), l("button", {
        key: 1,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: t[3] || (t[3] = (o) => m.value = null)
      }, c(N.value) + " more", 1)) : g("", !0)
    ], 6));
  }
}, vt = /* @__PURE__ */ ie(ut, [["__scopeId", "data-v-147c4442"]]);
export {
  vt as A
};
