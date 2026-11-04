/* @code-commandments-generated */
import { openBlock as o, createElementBlock as u, withModifiers as H, unref as r, createTextVNode as se, toDisplayString as c, createVNode as p, createBlock as k, computed as i, ref as v, defineAsyncComponent as we, onUnmounted as ve, withKeys as ue, normalizeClass as me, createElementVNode as d, createCommentVNode as g, Fragment as M, withCtx as y, createSlots as fe, renderList as te, resolveDynamicComponent as ke, watch as re, Transition as ye } from "vue";
import { peekRef as oe, Icon as ae, RunningCommand as be, useNow as he, age as Ce, useWindow as pe, loadWindowComponent as $e, TimeAgo as Se, FoldGroup as de, InnerTabs as Re, SwitchCase as Te, EmptyState as xe, TaskStatusIcon as _e, useRows as Oe, useDeclaredRows as ne, SearchBar as qe, Segmented as Ae, Btn as Ee, RowList as Ie } from "@journal/window-kit";
import { _ as le, T as ce } from "./TranscriptRows-DhYd90lu.js";
const Be = {
  class: "agent-command",
  "data-agent-command": ""
}, Ne = {
  key: 1,
  "data-agent-stopped": ""
}, Le = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(a) {
    return (K, C) => (o(), u("span", Be, [
      a.waitReason ? (o(), u("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: C[0] || (C[0] = H((P) => r(oe)("test_queue:0"), ["stop"]))
      }, [
        se("Waiting: " + c(a.waitReason) + " ", 1),
        p(r(ae), {
          name: "arrow",
          size: 11
        })
      ])) : a.stopped ? (o(), u("span", Ne, "Waiting")) : (o(), k(r(be), {
        key: 2,
        text: a.command,
        idle: a.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, ge = /* @__PURE__ */ le(Le, [["__scopeId", "data-v-70734c30"]]), De = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], We = { class: "agent-head" }, je = ["data-state"], Ve = {
  class: "agent-title",
  "data-agent-title": ""
}, Ue = {
  class: "agent-name",
  "data-agent-name": ""
}, ze = {
  key: 3,
  class: "agent-time"
}, Fe = { class: "agent-line" }, Me = {
  class: "agent-identity",
  "data-agent-identity": ""
}, He = {
  key: 0,
  class: "agent-tasks",
  "data-agent-pace": ""
}, Ke = {
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
}, nt = 36e5, at = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(a, { emit: K }) {
    const C = { main: "Main agent", subagent: "Subagent", reviewer: "Reviewer" }, P = ["started", "blocked", "open", "completed"], t = a, _ = K, G = he(), Y = i(() => {
      var n;
      const e = ((n = t.facts) == null ? void 0 : n.profile) || C[t.row.role] || t.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), b = i(() => {
      var e;
      return ((e = t.facts) == null ? void 0 : e.tasks) ?? [];
    }), Z = i(() => {
      var e, n;
      return [t.row.program, (e = t.facts) == null ? void 0 : e.model, (n = t.facts) == null ? void 0 : n.effort, t.row.role === "main" ? "" : t.progress ? `${t.row.role} ${t.row.id}` : t.row.role].filter(Boolean).join(" · ");
    }), ee = i(() => Ce(t.row.process_started_at || t.row.created_at, G.value)), R = /* @__PURE__ */ new Set(["open", "started", "testing"]), m = i(() => !!t.row.ended_at && t.row.role !== "main" && b.value.some((e) => R.has(e.state))), W = i(() => {
      var e;
      return t.waitReason || m.value ? "waiting" : t.row.ended_at ? "closed" : ((e = t.facts) == null ? void 0 : e.state) || "running";
    }), j = i(() => {
      var n, D, S;
      const e = [];
      return ((n = t.facts) == null ? void 0 : n.context_percent) !== null && ((D = t.facts) == null ? void 0 : D.context_percent) !== void 0 && e.push(`Context ${t.facts.context_percent}%`), (S = t.facts) != null && S.cost_dollars && e.push(`$${t.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), O = i(() => {
      var e;
      return ((e = t.progress) == null ? void 0 : e.completed_count) ?? b.value.filter((n) => n.state === "completed").length;
    }), q = i(() => {
      var e;
      return ((e = t.progress) == null ? void 0 : e.task_count) ?? b.value.length;
    }), J = i(() => `${O.value} of ${q.value} ${q.value === 1 ? "task" : "tasks"}`), A = i(() => {
      var F;
      const e = Date.parse(((F = t.progress) == null ? void 0 : F.started_at) || t.row.created_at), n = t.progress ? t.progress.finished_at : t.row.ended_at, S = ((n ? Date.parse(n) : G.value) - e) / nt;
      return t.row.role !== "main" && S > 0 && O.value ? `${Math.round(O.value / S)}/h` : "";
    }), Q = i(() => b.value.length ? P.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: b.value.filter((n) => n.state === e || e === "started" && n.state === "testing" || e === "completed" && n.state === "cancelled") })) : []), E = /* @__PURE__ */ new Set(["completed"]), V = v({}), X = (e) => !(V.value[e] ?? E.has(e)), U = (e) => V.value = { ...V.value, [e]: X(e) }, I = pe(), T = v(I.tabs[0]), f = Object.fromEntries(I.tabs.filter((e) => e.component).map((e) => [e.key, we(() => $e(e.component))])), $ = i(() => t.row.role === "subagent"), B = v(!1), N = v(""), z = v(""), L = i(() => t.row.role !== "main" && (!t.row.ended_at || m.value || t.waitReason));
    async function l() {
      if (!L.value) return;
      const e = await I.read(`usage tool --agent ${t.row.id}`);
      N.value = e.ok ? e.value.tool : "", z.value = e.ok ? e.value.note : "";
    }
    const s = I.follow(["hook_call.*", "process_part.*"], l);
    return ve(() => s == null ? void 0 : s()), l(), (e, n) => {
      var D, S, F, ie;
      return o(), u("div", {
        class: me(["agent-card", { open: a.open }]),
        "data-agent-open": a.row.id,
        "aria-expanded": a.open,
        role: a.open ? void 0 : "button",
        tabindex: a.open ? void 0 : 0,
        title: a.row.session,
        onClick: n[4] || (n[4] = (w) => !a.open && _("toggle")),
        onKeydown: [
          n[5] || (n[5] = ue(H((w) => !a.open && _("toggle"), ["self", "prevent"]), ["enter"])),
          n[6] || (n[6] = ue(H((w) => !a.open && _("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        d("span", We, [
          a.open ? (o(), u("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: n[0] || (n[0] = H((w) => _("toggle"), ["stop"]))
          }, [
            p(r(ae), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : g("", !0),
          d("span", {
            class: "agent-dot",
            "data-state": W.value
          }, null, 8, je),
          d("span", Ve, c(Y.value), 1),
          d("span", Ue, c(((D = a.facts) == null ? void 0 : D.given_name) || a.row.id), 1),
          a.open ? g("", !0) : (o(), k(r(ae), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          a.row.ended_at && !m.value ? (o(), k(r(Se), {
            key: 2,
            class: "agent-time",
            at: a.row.ended_at
          }, null, 8, ["at"])) : (o(), u("span", ze, c(ee.value), 1))
        ]),
        d("span", Fe, [
          d("span", Me, c(Z.value), 1),
          q.value ? (o(), u(M, { key: 0 }, [
            A.value ? (o(), u("span", He, c(A.value), 1)) : g("", !0),
            d("span", Ke, c(J.value), 1)
          ], 64)) : g("", !0)
        ]),
        L.value && !a.open ? (o(), k(ge, {
          key: 0,
          class: "agent-command",
          "wait-reason": a.waitReason,
          stopped: m.value,
          command: N.value,
          note: z.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : g("", !0),
        a.open ? (o(), u("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: n[3] || (n[3] = H(() => {
          }, ["stop"]))
        }, [
          j.value ? (o(), u("span", Pe, c(j.value), 1)) : g("", !0),
          L.value ? (o(), k(ge, {
            key: 1,
            class: "agent-command",
            "wait-reason": a.waitReason,
            stopped: m.value,
            command: N.value,
            note: z.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : g("", !0),
          $.value ? (o(), u("div", Ge, [
            (S = a.facts) != null && S.instruction ? (o(), u("div", Je, [
              p(r(de), {
                label: "Instruction",
                open: B.value,
                "data-agent-section": "instruction",
                onToggle: n[1] || (n[1] = (w) => B.value = !B.value)
              }, {
                default: y(() => [
                  d("div", Qe, c(a.facts.instruction), 1)
                ]),
                _: 1
              }, 8, ["open"])
            ])) : g("", !0),
            p(ce, {
              line: `agent transcript ${a.row.id}`
            }, null, 8, ["line"])
          ])) : (o(), u(M, { key: 3 }, [
            p(r(Re), {
              class: "agent-tabs",
              active: T.value,
              answer: { tasks: b.value.length },
              onChoose: n[2] || (n[2] = (w) => T.value = w)
            }, null, 8, ["active", "answer"]),
            d("div", {
              class: "agent-tab-body",
              "data-agent-tab-body": (F = T.value) == null ? void 0 : F.key
            }, [
              p(r(Te), {
                value: (ie = T.value) == null ? void 0 : ie.key
              }, fe({
                tasks: y(() => {
                  var w;
                  return [
                    b.value.length ? g("", !0) : (o(), k(r(xe), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: y(() => [...n[7] || (n[7] = [
                        se("This agent was given none.", -1)
                      ])]),
                      _: 1
                    })),
                    (o(!0), u(M, null, te(Q.value, (h) => (o(), k(r(de), {
                      key: h.state,
                      label: h.label,
                      count: h.tasks.length,
                      open: X(h.state),
                      "data-agent-section": h.state,
                      onToggle: (x) => U(h.state)
                    }, {
                      default: y(() => [
                        (o(!0), u(M, null, te(h.tasks, (x) => (o(), u("button", {
                          key: x.id,
                          type: "button",
                          class: "agent-task",
                          "data-agent-delegated": x.id,
                          onClick: (ut) => r(oe)(`tasks:${x.id}`)
                        }, [
                          p(r(_e), {
                            status: x.state
                          }, null, 8, ["status"]),
                          d("span", Ze, c(x.id), 1),
                          d("span", et, c(x.title), 1)
                        ], 8, Ye))), 128))
                      ]),
                      _: 2
                    }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
                    (w = a.facts) != null && w.instruction ? (o(), u(M, { key: 1 }, [
                      n[8] || (n[8] = d("p", { class: "agent-label" }, "Instruction", -1)),
                      d("div", tt, c(a.facts.instruction), 1)
                    ], 64)) : g("", !0)
                  ];
                }),
                transcript: y(() => [
                  p(ce, {
                    line: `agent transcript ${a.row.id}`
                  }, null, 8, ["line"])
                ]),
                _: 2
              }, [
                te(r(f), (w, h) => ({
                  name: h,
                  fn: y(() => [
                    (o(), k(ke(w), {
                      agent: a.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ], 8, Xe)
          ], 64))
        ])) : g("", !0)
      ], 42, De);
    };
  }
}, st = /* @__PURE__ */ le(at, [["__scopeId", "data-v-c47bbca6"]]), ot = {
  class: "agents-queue-count",
  "data-agents-queue-count": ""
}, lt = ["data-agent-row"], it = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(a) {
    const K = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], C = a, { rows: P } = Oe("usage agents --closed", ["agent.*", "task.*"]), { rows: t } = ne("waits"), { rows: _ } = ne("progress"), G = (l) => _.value.find((s) => s.agent_id === l.id) ?? null, Y = (l) => {
      var s;
      return ((s = t.value.find((e) => e.agent_id === l.id)) == null ? void 0 : s.reason) ?? "";
    }, { rows: b } = ne("queue"), Z = /* @__PURE__ */ new Set(["queued", "running"]), ee = i(() => b.value.filter((l) => Z.has(l.state)).length), R = v("running"), m = v(""), W = pe(), j = v([]), O = v(""), q = v(!1), J = v(!1), A = v(25);
    let Q = 0;
    async function E() {
      const l = ++Q, s = await W.read(`${C.line} --show ${R.value} --search ${JSON.stringify(m.value)} --limit ${A.value}`);
      l === Q && (j.value = s.ok ? s.value.rows : [], O.value = s.ok ? "" : s.error, J.value = s.ok && s.value.page * s.value.size < s.value.total, q.value = !0);
    }
    async function V() {
      return A.value += 25, await E(), !0;
    }
    re([R, m], () => {
      A.value = 25, E();
    }), W.follow(["agent.*", "task.*", ...W.sources.flatMap((l) => l.events)], E), E();
    const X = (l) => P.value.find((s) => s.id === l.id) ?? null, U = j, I = i(() => !!m.value.trim()), T = i(() => C.texts[R.value] ?? { title: C.empty, hint: "" }), f = v(null), $ = i(() => U.value.find((l) => l.id === f.value) ?? null), B = i(() => $.value ? [$.value] : U.value), N = i(() => U.value.length - B.value.length), z = (l) => f.value = f.value === l.id ? null : l.id;
    re(m, (l) => l.trim() && (f.value = null));
    const L = (l) => {
      l.key === "Escape" && f.value && (f.value = null);
    };
    return window.addEventListener("keydown", L), ve(() => window.removeEventListener("keydown", L)), (l, s) => (o(), u("div", {
      class: me(["agents", { focused: $.value }])
    }, [
      $.value ? g("", !0) : (o(), k(r(qe), {
        key: 0,
        modelValue: m.value,
        "onUpdate:modelValue": s[2] || (s[2] = (e) => m.value = e),
        "data-agents-search": ""
      }, {
        default: y(() => [
          p(r(Ae), {
            options: K,
            value: R.value,
            onPick: s[0] || (s[0] = (e) => R.value = e)
          }, null, 8, ["value"]),
          p(r(Ee), {
            small: "",
            bordered: "",
            title: "Open the process queue",
            "data-agents-queue": "",
            onClick: s[1] || (s[1] = (e) => r(oe)("test_queue:0"))
          }, {
            default: y(() => [
              s[4] || (s[4] = se("Process queue ", -1)),
              d("span", ot, c(ee.value), 1)
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue"])),
      p(ye, {
        name: "agents-view",
        mode: "out-in"
      }, {
        default: y(() => [
          (o(), k(r(Ie), {
            key: $.value ? "open" : "list",
            rows: B.value,
            failure: O.value,
            loaded: q.value,
            more: J.value,
            older: V,
            empty: T.value.title,
            hint: T.value.hint,
            searching: I.value
          }, {
            default: y(({ row: e }) => [
              d("div", {
                class: "agent-row",
                "data-agent-row": e.id
              }, [
                p(st, {
                  row: e,
                  facts: X(e),
                  progress: G(e),
                  "wait-reason": Y(e),
                  open: e.id === f.value,
                  onToggle: (n) => z(e)
                }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
              ], 8, lt)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
        ]),
        _: 1
      }),
      $.value && N.value ? (o(), u("button", {
        key: 1,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: s[3] || (s[3] = (e) => f.value = null)
      }, c(N.value) + " more", 1)) : g("", !0)
    ], 2));
  }
}, gt = /* @__PURE__ */ le(it, [["__scopeId", "data-v-35c92e41"]]);
export {
  gt as A
};
