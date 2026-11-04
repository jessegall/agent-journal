/* @code-commandments-generated */
import { openBlock as s, createElementBlock as u, withModifiers as X, unref as l, createTextVNode as oe, toDisplayString as w, createVNode as g, createBlock as _, computed as i, createCommentVNode as p, withCtx as y, ref as f, onUnmounted as ve, withKeys as re, normalizeClass as we, createElementVNode as v, Fragment as Q, renderList as ie, watch as ue, Transition as fe } from "vue";
import { peekRef as se, Icon as ne, RunningCommand as ke, useRows as Y, AutoScrollPane as ye, RowList as pe, DiffCard as he, useNow as be, age as _e, useWindow as me, TimeAgo as Se, FoldGroup as de, InnerTabs as $e, SwitchCase as Ce, EmptyState as Re, TaskStatusIcon as Te, SearchBar as xe, Segmented as Ae, Btn as Ie } from "@journal/window-kit";
import { _ as ee, T as ce } from "./TranscriptRows-DhYd90lu.js";
const Oe = {
  class: "agent-command",
  "data-agent-command": ""
}, Ee = {
  key: 1,
  "data-agent-stopped": ""
}, Ne = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(a) {
    return (A, k) => (s(), u("span", Oe, [
      a.waitReason ? (s(), u("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: k[0] || (k[0] = X((I) => l(se)("test_queue:0"), ["stop"]))
      }, [
        oe("Waiting: " + w(a.waitReason) + " ", 1),
        g(l(ne), {
          name: "arrow",
          size: 11
        })
      ])) : a.stopped ? (s(), u("span", Ee, "Waiting")) : (s(), _(l(ke), {
        key: 2,
        text: a.command,
        idle: a.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, ge = /* @__PURE__ */ ee(Ne, [["__scopeId", "data-v-70734c30"]]), qe = { class: "file-feed" }, Be = 5, Le = {
  __name: "AgentFileEdits",
  props: { agent: { type: Number, required: !0 } },
  setup(a) {
    const A = a, { rows: k, failure: I, loaded: P, more: t, older: h } = Y(`file-edit list --agent ${A.agent}`, ["file_edit.create"], { incremental: !0 }), O = i(() => k.value.map((d) => ({ ...d, lines: JSON.parse(d.rows || "[]") })).reverse()), U = i(() => {
      var d;
      return ((d = k.value[0]) == null ? void 0 : d.id) ?? 0;
    });
    return (d, E) => (s(), u("div", qe, [
      l(t) && l(k).length ? (s(), u("button", {
        key: 0,
        type: "button",
        class: "file-feed-older",
        "data-file-feed-older": "",
        onClick: E[0] || (E[0] = (...c) => l(h) && l(h)(...c))
      }, "Show older edits")) : p("", !0),
      g(l(ye), { "row-count": U.value }, {
        default: y(() => [
          g(l(pe), {
            rows: O.value,
            failure: l(I),
            loaded: l(P),
            empty: "No edits by this agent yet",
            hint: "The files it changes show here as it works."
          }, {
            default: y(({ row: c }) => [
              g(l(he), {
                flush: "",
                lines: Be,
                path: c.path,
                kind: c.edit_type,
                added: c.added,
                removed: c.removed,
                at: c.created_at,
                rows: c.lines
              }, null, 8, ["path", "kind", "added", "removed", "at", "rows"])
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ]),
        _: 1
      }, 8, ["row-count"])
    ]));
  }
}, De = /* @__PURE__ */ ee(Le, [["__scopeId", "data-v-ddb88f22"]]), We = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], Fe = { class: "agent-head" }, Ve = ["data-state"], je = {
  class: "agent-title",
  "data-agent-title": ""
}, Pe = {
  class: "agent-name",
  "data-agent-name": ""
}, Ue = {
  key: 3,
  class: "agent-time"
}, ze = { class: "agent-line" }, He = {
  class: "agent-identity",
  "data-agent-identity": ""
}, Ke = {
  key: 0,
  class: "agent-tasks",
  "data-agent-pace": ""
}, Me = {
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
}, Ye = ["data-agent-tab-body"], Ze = ["data-agent-delegated", "onClick"], et = { class: "agent-task-number" }, tt = { class: "agent-task-title" }, at = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, nt = 36e5, ot = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(a, { emit: A }) {
    const k = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, I = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), P = ["started", "blocked", "open", "completed"], t = a, h = A, O = be(), U = i(() => {
      var n;
      const e = ((n = t.facts) == null ? void 0 : n.profile) || k[t.row.role] || t.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), d = i(() => {
      var e;
      return ((e = t.facts) == null ? void 0 : e.tasks) ?? [];
    }), E = i(() => {
      var e, n;
      return [t.row.program, (e = t.facts) == null ? void 0 : e.model, (n = t.facts) == null ? void 0 : n.effort, t.row.role === "worker" ? `worker ${t.row.id}` : I.has(t.row.role) ? t.row.role : ""].filter(Boolean).join(" · ");
    }), c = i(() => _e(t.row.process_started_at || t.row.created_at, O.value)), S = /* @__PURE__ */ new Set(["open", "started", "testing"]), $ = i(() => !!t.row.ended_at && t.row.role === "worker" && d.value.some((e) => S.has(e.state))), Z = i(() => {
      var e;
      return t.waitReason || $.value ? "waiting" : t.row.state === "running" && ((e = t.facts) == null ? void 0 : e.state) || t.row.state;
    }), z = i(() => {
      var n, j, R;
      const e = [];
      return ((n = t.facts) == null ? void 0 : n.context_percent) !== null && ((j = t.facts) == null ? void 0 : j.context_percent) !== void 0 && e.push(`Context ${t.facts.context_percent}%`), (R = t.facts) != null && R.cost_dollars && e.push(`$${t.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), N = i(() => {
      var e;
      return ((e = t.progress) == null ? void 0 : e.completed_count) ?? d.value.filter((n) => n.state === "completed").length;
    }), q = i(() => {
      var e;
      return ((e = t.progress) == null ? void 0 : e.task_count) ?? d.value.length;
    }), H = i(() => `${N.value} of ${q.value} ${q.value === 1 ? "task" : "tasks"}`), K = i(() => {
      var J;
      const e = Date.parse(((J = t.progress) == null ? void 0 : J.started_at) || t.row.created_at), n = t.progress ? t.progress.finished_at : t.row.ended_at, R = ((n ? Date.parse(n) : O.value) - e) / nt;
      return t.row.role === "worker" && R > 0 && N.value ? `${Math.round(N.value / R)}/h` : "";
    }), B = i(() => d.value.length ? P.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: d.value.filter((n) => n.state === e || e === "started" && n.state === "testing" || e === "completed" && n.state === "cancelled") })) : []), te = /* @__PURE__ */ new Set(["completed"]), M = f({}), L = (e) => !(M.value[e] ?? te.has(e)), ae = (e) => M.value = { ...M.value, [e]: L(e) }, D = me(), m = f(D.tabs[0]), C = i(() => t.row.role === "subagent" || t.row.role === "reviewer"), W = f(!1), F = f(""), G = f(""), V = i(() => t.row.role !== "main" && (!t.row.ended_at || $.value || t.waitReason));
    async function r() {
      if (!V.value) return;
      const e = await D.read(`usage tool --agent ${t.row.id}`);
      F.value = e.ok ? e.value.tool : "", G.value = e.ok ? e.value.note : "";
    }
    const o = D.follow(["hook_call.*", "process_part.*"], r);
    return ve(() => o == null ? void 0 : o()), r(), (e, n) => {
      var j, R, J, le;
      return s(), u("div", {
        class: we(["agent-card", { open: a.open }]),
        "data-agent-open": a.row.id,
        "aria-expanded": a.open,
        role: a.open ? void 0 : "button",
        tabindex: a.open ? void 0 : 0,
        title: a.row.session,
        onClick: n[4] || (n[4] = (b) => !a.open && h("toggle")),
        onKeydown: [
          n[5] || (n[5] = re(X((b) => !a.open && h("toggle"), ["self", "prevent"]), ["enter"])),
          n[6] || (n[6] = re(X((b) => !a.open && h("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        v("span", Fe, [
          a.open ? (s(), u("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: n[0] || (n[0] = X((b) => h("toggle"), ["stop"]))
          }, [
            g(l(ne), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : p("", !0),
          v("span", {
            class: "agent-dot",
            "data-state": Z.value
          }, null, 8, Ve),
          v("span", je, w(U.value), 1),
          v("span", Pe, w(((j = a.facts) == null ? void 0 : j.given_name) || a.row.id), 1),
          a.open ? p("", !0) : (s(), _(l(ne), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          a.row.ended_at && !$.value ? (s(), _(l(Se), {
            key: 2,
            class: "agent-time",
            at: a.row.ended_at
          }, null, 8, ["at"])) : (s(), u("span", Ue, w(c.value), 1))
        ]),
        v("span", ze, [
          v("span", He, w(E.value), 1),
          q.value ? (s(), u(Q, { key: 0 }, [
            K.value ? (s(), u("span", Ke, w(K.value), 1)) : p("", !0),
            v("span", Me, w(H.value), 1)
          ], 64)) : p("", !0)
        ]),
        V.value && !a.open ? (s(), _(ge, {
          key: 0,
          class: "agent-command",
          "wait-reason": a.waitReason,
          stopped: $.value,
          command: F.value,
          note: G.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : p("", !0),
        a.open ? (s(), u("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: n[3] || (n[3] = X(() => {
          }, ["stop"]))
        }, [
          z.value ? (s(), u("span", Ge, w(z.value), 1)) : p("", !0),
          V.value ? (s(), _(ge, {
            key: 1,
            class: "agent-command",
            "wait-reason": a.waitReason,
            stopped: $.value,
            command: F.value,
            note: G.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : p("", !0),
          C.value ? (s(), u("div", Je, [
            (R = a.facts) != null && R.instruction ? (s(), u("div", Qe, [
              g(l(de), {
                label: "Instruction",
                open: W.value,
                "data-agent-section": "instruction",
                onToggle: n[1] || (n[1] = (b) => W.value = !W.value)
              }, {
                default: y(() => [
                  v("div", Xe, w(a.facts.instruction), 1)
                ]),
                _: 1
              }, 8, ["open"])
            ])) : p("", !0),
            g(ce, {
              line: `agent transcript ${a.row.id}`
            }, null, 8, ["line"])
          ])) : (s(), u(Q, { key: 3 }, [
            g(l($e), {
              class: "agent-tabs",
              active: m.value,
              answer: { tasks: d.value.length },
              onChoose: n[2] || (n[2] = (b) => m.value = b)
            }, null, 8, ["active", "answer"]),
            v("div", {
              class: "agent-tab-body",
              "data-agent-tab-body": (J = m.value) == null ? void 0 : J.key
            }, [
              g(l(Ce), {
                value: (le = m.value) == null ? void 0 : le.key
              }, {
                tasks: y(() => {
                  var b;
                  return [
                    d.value.length ? p("", !0) : (s(), _(l(Re), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: y(() => [...n[7] || (n[7] = [
                        oe("This agent was given none.", -1)
                      ])]),
                      _: 1
                    })),
                    (s(!0), u(Q, null, ie(B.value, (T) => (s(), _(l(de), {
                      key: T.state,
                      label: T.label,
                      count: T.tasks.length,
                      open: L(T.state),
                      "data-agent-section": T.state,
                      onToggle: (x) => ae(T.state)
                    }, {
                      default: y(() => [
                        (s(!0), u(Q, null, ie(T.tasks, (x) => (s(), u("button", {
                          key: x.id,
                          type: "button",
                          class: "agent-task",
                          "data-agent-delegated": x.id,
                          onClick: (ut) => l(se)(`tasks:${x.id}`)
                        }, [
                          g(l(Te), {
                            status: x.state
                          }, null, 8, ["status"]),
                          v("span", et, w(x.id), 1),
                          v("span", tt, w(x.title), 1)
                        ], 8, Ze))), 128))
                      ]),
                      _: 2
                    }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
                    (b = a.facts) != null && b.instruction ? (s(), u(Q, { key: 1 }, [
                      n[8] || (n[8] = v("p", { class: "agent-label" }, "Instruction", -1)),
                      v("div", at, w(a.facts.instruction), 1)
                    ], 64)) : p("", !0)
                  ];
                }),
                transcript: y(() => [
                  g(ce, {
                    line: `agent transcript ${a.row.id}`
                  }, null, 8, ["line"])
                ]),
                "file-feed": y(() => [
                  g(De, {
                    agent: a.row.id
                  }, null, 8, ["agent"])
                ]),
                _: 1
              }, 8, ["value"])
            ], 8, Ye)
          ], 64))
        ])) : p("", !0)
      ], 42, We);
    };
  }
}, st = /* @__PURE__ */ ee(ot, [["__scopeId", "data-v-c2d41ec9"]]), lt = {
  class: "agents-queue-count",
  "data-agents-queue-count": ""
}, rt = ["data-agent-row"], it = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(a) {
    const A = [
      { key: "running", label: "Running" },
      { key: "idle", label: "Idle" },
      { key: "retired", label: "Retired" },
      { key: "all", label: "All" }
    ], k = a, { rows: I } = Y("usage agents --closed", ["agent.*", "task.*"]), { rows: P } = Y("worker waits", ["agent.*", "task.*", "proof.*", "worker_worktree.*"]), { rows: t } = Y("worker progress", ["task.*", "worker_worktree.*"]), h = (r) => t.value.find((o) => o.agent_id === r.id) ?? null, O = (r) => {
      var o;
      return ((o = P.value.find((e) => e.agent_id === r.id)) == null ? void 0 : o.reason) ?? "";
    }, { rows: U } = Y("proof list --limit 50", ["proof.*"]), d = /* @__PURE__ */ new Set(["queued", "running"]), E = i(() => U.value.filter((r) => d.has(r.state)).length), c = f("running"), S = f(""), $ = me(), Z = f([]), z = f(""), N = f(!1), q = f(!1), H = f(25);
    let K = 0;
    async function B() {
      const r = ++K, o = await $.read(`${k.line} --show ${c.value} --search ${JSON.stringify(S.value)} --limit ${H.value}`);
      r === K && (Z.value = o.ok ? o.value.rows : [], z.value = o.ok ? "" : o.error, q.value = o.ok && o.value.page * o.value.size < o.value.total, N.value = !0);
    }
    async function te() {
      return H.value += 25, await B(), !0;
    }
    ue([c, S], () => {
      H.value = 25, B();
    }), $.follow(["agent.*", "task.*", "worker_worktree.*"], B), B();
    const M = (r) => I.value.find((o) => o.id === r.id) ?? null, L = Z, ae = i(() => !!S.value.trim()), D = i(() => k.texts[c.value] ?? { title: k.empty, hint: "" }), m = f(null), C = i(() => L.value.find((r) => r.id === m.value) ?? null), W = i(() => C.value ? [C.value] : L.value), F = i(() => L.value.length - W.value.length), G = (r) => m.value = m.value === r.id ? null : r.id;
    ue(S, (r) => r.trim() && (m.value = null));
    const V = (r) => {
      r.key === "Escape" && m.value && (m.value = null);
    };
    return window.addEventListener("keydown", V), ve(() => window.removeEventListener("keydown", V)), (r, o) => (s(), u("div", {
      class: we(["agents", { focused: C.value }])
    }, [
      C.value ? p("", !0) : (s(), _(l(xe), {
        key: 0,
        modelValue: S.value,
        "onUpdate:modelValue": o[2] || (o[2] = (e) => S.value = e),
        "data-agents-search": ""
      }, {
        default: y(() => [
          g(l(Ae), {
            options: A,
            value: c.value,
            onPick: o[0] || (o[0] = (e) => c.value = e)
          }, null, 8, ["value"]),
          g(l(Ie), {
            small: "",
            bordered: "",
            title: "Open the process queue",
            "data-agents-queue": "",
            onClick: o[1] || (o[1] = (e) => l(se)("test_queue:0"))
          }, {
            default: y(() => [
              o[4] || (o[4] = oe("Process queue ", -1)),
              v("span", lt, w(E.value), 1)
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue"])),
      g(fe, {
        name: "agents-view",
        mode: "out-in"
      }, {
        default: y(() => [
          (s(), _(l(pe), {
            key: C.value ? "open" : "list",
            rows: W.value,
            failure: z.value,
            loaded: N.value,
            more: q.value,
            older: te,
            empty: D.value.title,
            hint: D.value.hint,
            searching: ae.value
          }, {
            default: y(({ row: e }) => [
              v("div", {
                class: "agent-row",
                "data-agent-row": e.id
              }, [
                g(st, {
                  row: e,
                  facts: M(e),
                  progress: h(e),
                  "wait-reason": O(e),
                  open: e.id === m.value,
                  onToggle: (n) => G(e)
                }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
              ], 8, rt)
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"]))
        ]),
        _: 1
      }),
      C.value && F.value ? (s(), u("button", {
        key: 1,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: o[3] || (o[3] = (e) => m.value = null)
      }, w(F.value) + " more", 1)) : p("", !0)
    ], 2));
  }
}, vt = /* @__PURE__ */ ee(it, [["__scopeId", "data-v-6f27f356"]]);
export {
  vt as A
};
