/* @code-commandments-generated */
import { openBlock as o, createElementBlock as r, withModifiers as Q, unref as s, createTextVNode as se, toDisplayString as w, createVNode as u, createBlock as C, computed as i, createCommentVNode as f, withCtx as k, ref as v, onUnmounted as pe, withKeys as ie, normalizeClass as ne, createElementVNode as g, Fragment as J, renderList as ue, watch as de, normalizeStyle as me, Transition as ke } from "vue";
import { peekRef as le, Icon as oe, RunningCommand as ye, useRows as X, AutoScrollPane as he, RowList as we, DiffCard as be, useNow as Se, age as _e, useWindow as fe, TimeAgo as $e, FoldGroup as ce, InnerTabs as Ce, SwitchCase as Re, EmptyState as Te, TaskStatusIcon as xe, SearchBar as Ae, Segmented as Ie, Btn as Oe } from "@journal/window-kit";
import { _ as ee, T as ge } from "./TranscriptRows-ntRsOdt9.js";
const Ee = {
  class: "agent-command",
  "data-agent-command": ""
}, Ne = {
  key: 1,
  "data-agent-stopped": ""
}, qe = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(n) {
    return (x, m) => (o(), r("span", Ee, [
      n.waitReason ? (o(), r("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: m[0] || (m[0] = Q((A) => s(le)("test_queue:0"), ["stop"]))
      }, [
        se("Waiting: " + w(n.waitReason) + " ", 1),
        u(s(oe), {
          name: "arrow",
          size: 11
        })
      ])) : n.stopped ? (o(), r("span", Ne, "Waiting")) : (o(), C(s(ye), {
        key: 2,
        text: n.command,
        idle: n.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, ve = /* @__PURE__ */ ee(qe, [["__scopeId", "data-v-70734c30"]]), Be = { class: "file-feed" }, Le = 5, De = {
  __name: "AgentFileEdits",
  props: { agent: { type: Number, required: !0 } },
  setup(n) {
    const x = n, { rows: m, failure: A, loaded: j, more: a, older: h } = X(`file-edit list --agent ${x.agent}`, ["file_edit.create"], { incremental: !0 }), I = i(() => m.value.map((d) => ({ ...d, lines: JSON.parse(d.rows || "[]") })).reverse()), z = i(() => {
      var d;
      return ((d = m.value[0]) == null ? void 0 : d.id) ?? 0;
    });
    return (d, O) => (o(), r("div", Be, [
      s(a) && s(m).length ? (o(), r("button", {
        key: 0,
        type: "button",
        class: "file-feed-older",
        "data-file-feed-older": "",
        onClick: O[0] || (O[0] = (...c) => s(h) && s(h)(...c))
      }, "Show older edits")) : f("", !0),
      u(s(he), { "row-count": z.value }, {
        default: k(() => [
          u(s(we), {
            rows: I.value,
            failure: s(A),
            loaded: s(j),
            empty: "No edits by this agent yet",
            hint: "The files it changes show here as it works."
          }, {
            default: k(({ row: c }) => [
              u(s(be), {
                flush: "",
                lines: Le,
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
}, We = /* @__PURE__ */ ee(De, [["__scopeId", "data-v-ddb88f22"]]), Fe = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], Ve = { class: "agent-head" }, je = ["data-state"], ze = {
  class: "agent-title",
  "data-agent-title": ""
}, Pe = {
  class: "agent-name",
  "data-agent-name": ""
}, Ue = {
  key: 3,
  class: "agent-time"
}, He = { class: "agent-line" }, Ke = {
  class: "agent-identity",
  "data-agent-identity": ""
}, Me = {
  key: 0,
  class: "agent-tasks",
  "data-agent-pace": ""
}, Ge = {
  class: "agent-tasks",
  "data-agent-tasks": ""
}, Je = {
  key: 0,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, Qe = {
  key: 2,
  class: "agent-tab-body",
  "data-agent-tab-body": "transcript",
  "data-agent-only-transcript": ""
}, Xe = {
  key: 0,
  class: "agent-subagent-brief"
}, Ye = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ze = ["data-agent-tab-body"], et = ["data-agent-delegated", "onClick"], tt = { class: "agent-task-number" }, at = { class: "agent-task-title" }, nt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ot = 36e5, st = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(n, { emit: x }) {
    const m = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, A = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), j = ["started", "blocked", "open", "completed"], a = n, h = x, I = Se(), z = i(() => {
      var t;
      const e = ((t = a.facts) == null ? void 0 : t.profile) || m[a.row.role] || a.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), d = i(() => {
      var e;
      return ((e = a.facts) == null ? void 0 : e.tasks) ?? [];
    }), O = i(() => {
      var e, t;
      return [a.row.program, (e = a.facts) == null ? void 0 : e.model, (t = a.facts) == null ? void 0 : t.effort, a.row.role === "worker" ? `worker ${a.row.id}` : A.has(a.row.role) ? a.row.role : ""].filter(Boolean).join(" · ");
    }), c = i(() => _e(a.row.process_started_at || a.row.created_at, I.value)), _ = /* @__PURE__ */ new Set(["open", "started", "testing"]), $ = i(() => !!a.row.ended_at && a.row.role === "worker" && d.value.some((e) => _.has(e.state))), Y = i(() => {
      var e;
      return a.waitReason || $.value ? "waiting" : a.row.state === "running" && ((e = a.facts) == null ? void 0 : e.state) || a.row.state;
    }), P = i(() => {
      var t, l, b;
      const e = [];
      return ((t = a.facts) == null ? void 0 : t.context_percent) !== null && ((l = a.facts) == null ? void 0 : l.context_percent) !== void 0 && e.push(`Context ${a.facts.context_percent}%`), (b = a.facts) != null && b.cost_dollars && e.push(`$${a.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), E = i(() => {
      var e;
      return ((e = a.progress) == null ? void 0 : e.completed_count) ?? d.value.filter((t) => t.state === "completed").length;
    }), N = i(() => {
      var e;
      return ((e = a.progress) == null ? void 0 : e.task_count) ?? d.value.length;
    }), U = i(() => `${E.value} of ${N.value} ${N.value === 1 ? "task" : "tasks"}`), H = i(() => {
      var G;
      const e = Date.parse(((G = a.progress) == null ? void 0 : G.started_at) || a.row.created_at), t = a.progress ? a.progress.finished_at : a.row.ended_at, b = ((t ? Date.parse(t) : I.value) - e) / ot;
      return a.row.role === "worker" && b > 0 && E.value ? `${Math.round(E.value / b)}/h` : "";
    }), q = i(() => d.value.length ? j.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: d.value.filter((t) => t.state === e || e === "started" && t.state === "testing" || e === "completed" && t.state === "cancelled") })) : []), te = /* @__PURE__ */ new Set(["completed"]), K = v({}), B = (e) => !(K.value[e] ?? te.has(e)), ae = (e) => K.value = { ...K.value, [e]: B(e) }, L = fe(), p = v(L.tabs[0]), M = i(() => a.row.role === "subagent" || a.row.role === "reviewer"), D = v(!1), y = v(""), W = v(""), F = i(() => a.row.role !== "main" && (!a.row.ended_at || $.value || a.waitReason));
    async function Z() {
      if (!F.value) return;
      const e = await L.read(`usage tool --agent ${a.row.id}`);
      y.value = e.ok ? e.value.tool : "", W.value = e.ok ? e.value.note : "";
    }
    const V = L.follow(["hook_call.*", "process_part.*"], Z);
    return pe(() => V == null ? void 0 : V()), Z(), (e, t) => {
      var l, b, G, re;
      return o(), r("div", {
        class: ne(["agent-card", { open: n.open }]),
        "data-agent-open": n.row.id,
        "aria-expanded": n.open,
        role: n.open ? void 0 : "button",
        tabindex: n.open ? void 0 : 0,
        title: n.row.session,
        onClick: t[4] || (t[4] = (S) => !n.open && h("toggle")),
        onKeydown: [
          t[5] || (t[5] = ie(Q((S) => !n.open && h("toggle"), ["self", "prevent"]), ["enter"])),
          t[6] || (t[6] = ie(Q((S) => !n.open && h("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        g("span", Ve, [
          n.open ? (o(), r("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: t[0] || (t[0] = Q((S) => h("toggle"), ["stop"]))
          }, [
            u(s(oe), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : f("", !0),
          g("span", {
            class: "agent-dot",
            "data-state": Y.value
          }, null, 8, je),
          g("span", ze, w(z.value), 1),
          g("span", Pe, w(((l = n.facts) == null ? void 0 : l.given_name) || n.row.id), 1),
          n.open ? f("", !0) : (o(), C(s(oe), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          n.row.ended_at && !$.value ? (o(), C(s($e), {
            key: 2,
            class: "agent-time",
            at: n.row.ended_at
          }, null, 8, ["at"])) : (o(), r("span", Ue, w(c.value), 1))
        ]),
        g("span", He, [
          g("span", Ke, w(O.value), 1),
          N.value ? (o(), r(J, { key: 0 }, [
            H.value ? (o(), r("span", Me, w(H.value), 1)) : f("", !0),
            g("span", Ge, w(U.value), 1)
          ], 64)) : f("", !0)
        ]),
        F.value && !n.open ? (o(), C(ve, {
          key: 0,
          class: "agent-command",
          "wait-reason": n.waitReason,
          stopped: $.value,
          command: y.value,
          note: W.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : f("", !0),
        n.open ? (o(), r("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: t[3] || (t[3] = Q(() => {
          }, ["stop"]))
        }, [
          P.value ? (o(), r("span", Je, w(P.value), 1)) : f("", !0),
          F.value ? (o(), C(ve, {
            key: 1,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: $.value,
            command: y.value,
            note: W.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : f("", !0),
          M.value ? (o(), r("div", Qe, [
            (b = n.facts) != null && b.instruction ? (o(), r("div", Xe, [
              u(s(ce), {
                label: "Instruction",
                open: D.value,
                "data-agent-section": "instruction",
                onToggle: t[1] || (t[1] = (S) => D.value = !D.value)
              }, {
                default: k(() => [
                  g("div", Ye, w(n.facts.instruction), 1)
                ]),
                _: 1
              }, 8, ["open"])
            ])) : f("", !0),
            u(ge, {
              line: `agent transcript ${n.row.id}`,
              padding: "0"
            }, null, 8, ["line"])
          ])) : (o(), r(J, { key: 3 }, [
            u(s(Ce), {
              class: "agent-tabs",
              active: p.value,
              answer: { tasks: d.value.length },
              onChoose: t[2] || (t[2] = (S) => p.value = S)
            }, null, 8, ["active", "answer"]),
            g("div", {
              class: "agent-tab-body",
              "data-agent-tab-body": (G = p.value) == null ? void 0 : G.key
            }, [
              u(s(Re), {
                value: (re = p.value) == null ? void 0 : re.key
              }, {
                tasks: k(() => {
                  var S;
                  return [
                    d.value.length ? f("", !0) : (o(), C(s(Te), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: k(() => [...t[7] || (t[7] = [
                        se("This agent was given none.", -1)
                      ])]),
                      _: 1
                    })),
                    (o(!0), r(J, null, ue(q.value, (R) => (o(), C(s(ce), {
                      key: R.state,
                      label: R.label,
                      count: R.tasks.length,
                      open: B(R.state),
                      "data-agent-section": R.state,
                      onToggle: (T) => ae(R.state)
                    }, {
                      default: k(() => [
                        (o(!0), r(J, null, ue(R.tasks, (T) => (o(), r("button", {
                          key: T.id,
                          type: "button",
                          class: "agent-task",
                          "data-agent-delegated": T.id,
                          onClick: (dt) => s(le)(`tasks:${T.id}`)
                        }, [
                          u(s(xe), {
                            status: T.state
                          }, null, 8, ["status"]),
                          g("span", tt, w(T.id), 1),
                          g("span", at, w(T.title), 1)
                        ], 8, et))), 128))
                      ]),
                      _: 2
                    }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
                    (S = n.facts) != null && S.instruction ? (o(), r(J, { key: 1 }, [
                      t[8] || (t[8] = g("p", { class: "agent-label" }, "Instruction", -1)),
                      g("div", nt, w(n.facts.instruction), 1)
                    ], 64)) : f("", !0)
                  ];
                }),
                transcript: k(() => [
                  u(ge, {
                    line: `agent transcript ${n.row.id}`,
                    padding: "0"
                  }, null, 8, ["line"])
                ]),
                "file-feed": k(() => [
                  u(We, {
                    agent: n.row.id
                  }, null, 8, ["agent"])
                ]),
                _: 1
              }, 8, ["value"])
            ], 8, Ze)
          ], 64))
        ])) : f("", !0)
      ], 42, Fe);
    };
  }
}, lt = /* @__PURE__ */ ee(st, [["__scopeId", "data-v-8bb35679"]]), rt = {
  class: "agents-queue-count",
  "data-agents-queue-count": ""
}, it = ["data-agent-row"], ut = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(n) {
    const x = [
      { key: "running", label: "Running" },
      { key: "idle", label: "Idle" },
      { key: "retired", label: "Retired" },
      { key: "all", label: "All" }
    ], m = n, { rows: A } = X("usage agents --closed", ["agent.*", "task.*"]), { rows: j } = X("worker waits", ["agent.*", "task.*", "proof.*", "worker_worktree.*"]), { rows: a } = X("worker progress", ["task.*", "worker_worktree.*"]), h = (e) => a.value.find((t) => t.agent_id === e.id) ?? null, I = (e) => {
      var t;
      return ((t = j.value.find((l) => l.agent_id === e.id)) == null ? void 0 : t.reason) ?? "";
    }, { rows: z } = X("proof list --limit 50", ["proof.*"]), d = /* @__PURE__ */ new Set(["queued", "running"]), O = i(() => z.value.filter((e) => d.has(e.state)).length), c = v("running"), _ = v(""), $ = fe(), Y = v([]), P = v(""), E = v(!1), N = v(!1), U = v(25);
    let H = 0;
    async function q() {
      const e = ++H, t = await $.read(`${m.line} --show ${c.value} --search ${JSON.stringify(_.value)} --limit ${U.value}`);
      e === H && (Y.value = t.ok ? t.value.rows : [], P.value = t.ok ? "" : t.error, N.value = t.ok && t.value.page * t.value.size < t.value.total, E.value = !0);
    }
    async function te() {
      return U.value += 25, await q(), !0;
    }
    de([c, _], () => {
      U.value = 25, q();
    }), $.follow(["agent.*", "task.*", "worker_worktree.*"], q), q();
    const K = (e) => A.value.find((t) => t.id === e.id) ?? null, B = Y, ae = i(() => !!_.value.trim()), L = i(() => m.texts[c.value] ?? { title: m.empty, hint: "" }), p = v(null), M = v(null), D = v(0), y = i(() => B.value.find((e) => e.id === p.value) ?? null), W = i(() => y.value ? [y.value] : B.value), F = i(() => B.value.length - W.value.length), Z = (e) => {
      if (p.value !== e.id) {
        const t = M.value.querySelector(`[data-agent-open="${e.id}"]`);
        D.value = t.getBoundingClientRect().top - M.value.getBoundingClientRect().top;
      }
      p.value = p.value === e.id ? null : e.id;
    };
    de(_, (e) => e.trim() && (p.value = null));
    const V = (e) => {
      e.key === "Escape" && p.value && (p.value = null);
    };
    return window.addEventListener("keydown", V), pe(() => window.removeEventListener("keydown", V)), (e, t) => (o(), r("div", {
      ref_key: "agents",
      ref: M,
      class: ne(["agents", { focused: y.value }]),
      style: me({ "--agent-row-offset": `${D.value}px` })
    }, [
      y.value ? f("", !0) : (o(), C(s(Ae), {
        key: 0,
        modelValue: _.value,
        "onUpdate:modelValue": t[2] || (t[2] = (l) => _.value = l),
        placeholder: "Search agents",
        "data-agents-search": ""
      }, {
        default: k(() => [
          u(s(Ie), {
            options: x,
            value: c.value,
            onPick: t[0] || (t[0] = (l) => c.value = l)
          }, null, 8, ["value"]),
          u(s(Oe), {
            small: "",
            bordered: "",
            title: "Open the process queue",
            "data-agents-queue": "",
            onClick: t[1] || (t[1] = (l) => s(le)("test_queue:0"))
          }, {
            default: k(() => [
              t[4] || (t[4] = se("Process queue ", -1)),
              g("span", rt, w(O.value), 1)
            ]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["modelValue"])),
      u(ke, {
        name: "agents-view",
        mode: "out-in"
      }, {
        default: k(() => [
          (o(), r("div", {
            key: y.value ? "open" : "list",
            class: ne(["agents-view", { "agents-view-open": y.value }])
          }, [
            u(s(we), {
              rows: W.value,
              failure: P.value,
              loaded: E.value,
              more: N.value,
              older: te,
              empty: L.value.title,
              hint: L.value.hint,
              searching: ae.value
            }, {
              default: k(({ row: l }) => [
                g("div", {
                  class: "agent-row",
                  "data-agent-row": l.id
                }, [
                  u(lt, {
                    row: l,
                    facts: K(l),
                    progress: h(l),
                    "wait-reason": I(l),
                    open: l.id === p.value,
                    onToggle: (b) => Z(l)
                  }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
                ], 8, it)
              ]),
              _: 1
            }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"])
          ], 2))
        ]),
        _: 1
      }),
      y.value && F.value ? (o(), r("button", {
        key: 1,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: t[3] || (t[3] = (l) => p.value = null)
      }, w(F.value) + " more", 1)) : f("", !0)
    ], 6));
  }
}, pt = /* @__PURE__ */ ee(ut, [["__scopeId", "data-v-f3f83a49"]]);
export {
  pt as A
};
