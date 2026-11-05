/* @code-commandments-generated */
import { openBlock as o, createElementBlock as l, withModifiers as G, unref as d, createTextVNode as me, toDisplayString as g, createVNode as k, createBlock as x, withCtx as R, Fragment as ae, renderList as re, createElementVNode as w, createCommentVNode as v, computed as i, ref as f, watch as ne, defineAsyncComponent as $e, onUnmounted as fe, withKeys as ce, normalizeClass as oe, createSlots as Se, resolveDynamicComponent as Ce, nextTick as de } from "vue";
import { peekRef as we, Icon as ue, RunningCommand as _e, FoldGroup as ye, TaskStatusIcon as Te, useNow as xe, age as Re, perHour as Ae, useWindow as ke, loadWindowComponent as Ee, TimeAgo as qe, InnerTabs as Be, TabBody as Oe, SwitchCase as Ie, EmptyState as je, useRows as Ne, useDeclaredRows as ge, SearchBar as Le, Segmented as Ve, RowList as We } from "@journal/window-kit";
import { _ as se, T as ve } from "./TranscriptRows-BEE3BxfY.js";
const ze = {
  class: "agent-command",
  "data-agent-command": ""
}, De = {
  key: 1,
  "data-agent-stopped": ""
}, Pe = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(n) {
    return (L, $) => (o(), l("span", ze, [
      n.waitReason ? (o(), l("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: $[0] || ($[0] = G((D) => d(we)("test_queue:0"), ["stop"]))
      }, [
        me("Waiting: " + g(n.waitReason) + " ", 1),
        k(d(ue), {
          name: "arrow",
          size: 11
        })
      ])) : n.stopped ? (o(), l("span", De, "Waiting")) : (o(), x(d(_e), {
        key: 2,
        text: n.command,
        idle: n.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, pe = /* @__PURE__ */ se(Pe, [["__scopeId", "data-v-b7a65fd5"]]), Fe = ["data-agent-delegated", "onClick"], Ue = { class: "agent-task-number" }, He = { class: "agent-task-title" }, Ke = ["title"], Ge = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(n, { emit: L }) {
    const $ = L;
    return (D, a) => (o(), x(d(ye), {
      label: n.section.label,
      count: n.section.tasks.length,
      open: n.open,
      "data-agent-section": n.section.state,
      onToggle: a[0] || (a[0] = (r) => $("toggle"))
    }, {
      default: R(() => [
        (o(!0), l(ae, null, re(n.section.tasks, (r) => (o(), l("button", {
          key: r.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": r.id,
          onClick: (P) => d(we)(`tasks:${r.id}`)
        }, [
          k(d(Te), {
            status: r.state
          }, null, 8, ["status"]),
          w("span", Ue, g(r.id), 1),
          w("span", He, g(r.title), 1),
          r.plan_id ? (o(), l("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${r.plan_id}: ${r.plan_title}`
          }, "Plan " + g(r.plan_id) + ": " + g(r.plan_title), 9, Ke)) : v("", !0)
        ], 8, Fe))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Me = /* @__PURE__ */ se(Ge, [["__scopeId", "data-v-238ff959"]]), Ye = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], Je = { class: "agent-head" }, Qe = ["data-state"], Xe = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Ze = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, et = {
  key: 3,
  class: "agent-time",
  "data-agent-motion": ""
}, tt = { class: "agent-line" }, at = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, nt = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, ot = {
  key: 0,
  class: "agent-line agent-work-start"
}, st = ["title"], lt = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, it = {
  key: 1,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, rt = {
  key: 0,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, ut = {
  key: 2,
  class: "agent-tab-body",
  "data-agent-tab-body": "transcript",
  "data-agent-only-transcript": ""
}, ct = {
  key: 0,
  class: "agent-subagent-brief"
}, dt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, gt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, vt = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(n, { emit: L }) {
    const $ = { subagent: "Subagent", reviewer: "Reviewer" }, D = ["started", "blocked", "open", "completed"], a = n, r = L, P = xe(), le = i(() => {
      var t;
      const e = ((t = a.facts) == null ? void 0 : t.profile) || $[a.row.role] || a.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), p = i(() => {
      var e;
      return ((e = a.facts) == null ? void 0 : e.tasks) ?? [];
    }), A = i(() => p.value.filter((e) => e.state === "open")), _ = i(() => {
      var e, t, s;
      return (e = a.facts) != null && e.job_enabled && (((t = a.facts) == null ? void 0 : t.task_title) || ((s = A.value[0]) == null ? void 0 : s.title)) || "";
    }), M = i(() => {
      var e, t;
      return [a.row.program, (e = a.facts) == null ? void 0 : e.model, (t = a.facts) == null ? void 0 : t.effort, a.row.role === "main" ? "" : a.progress ? `${a.row.role} ${a.row.id}` : a.row.role].filter(Boolean).join(" · ");
    }), Y = i(() => Re(a.row.process_started_at || a.row.created_at, P.value)), J = /* @__PURE__ */ new Set(["open", "started", "testing"]), E = i(() => !!a.row.ended_at && a.row.role !== "main" && p.value.some((e) => J.has(e.state))), F = i(() => {
      var e;
      return a.waitReason || E.value ? "waiting" : a.row.state === "running" && ((e = a.facts) == null ? void 0 : e.state) || a.row.state;
    }), U = i(() => {
      var t, s, u;
      const e = [];
      return ((t = a.facts) == null ? void 0 : t.context_percent) !== null && ((s = a.facts) == null ? void 0 : s.context_percent) !== void 0 && e.push(`Context: ${a.facts.context_percent}%`), (u = a.facts) != null && u.cost_dollars && e.push(`$${a.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), O = i(() => {
      var e;
      return ((e = a.progress) == null ? void 0 : e.completed_count) ?? p.value.filter((t) => t.state === "completed").length;
    }), q = i(() => {
      var e;
      return ((e = a.progress) == null ? void 0 : e.task_count) ?? p.value.length;
    }), Q = i(() => `${O.value} of ${q.value} ${q.value === 1 ? "task" : "tasks"}`), I = i(() => {
      var t;
      const e = Ae(O.value, ((t = a.progress) == null ? void 0 : t.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, P.value);
      return a.row.role !== "main" && e ? `${e} per hour` : "";
    }), ie = i(() => p.value.length ? D.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: p.value.filter((t) => t.state === e || e === "started" && t.state === "testing" || e === "completed" && t.state === "cancelled") })) : []), X = /* @__PURE__ */ new Set(["completed"]), b = f({}), S = (e) => !(b.value[e] ?? X.has(e)), H = (e) => b.value = { ...b.value, [e]: S(e) }, y = ke(), T = f(y.tabs[0]);
    ne(() => a.open, (e) => {
      e && (T.value = y.tabs[0]);
    });
    const Z = Object.fromEntries(y.tabs.filter((e) => e.component).map((e) => [e.key, $e(() => Ee(e.component))])), V = i(() => a.row.role === "subagent" || a.row.role === "reviewer"), C = f(!1), W = f(""), K = f(""), B = i(() => a.row.role !== "main" && (!a.row.ended_at || E.value || a.waitReason));
    async function ee() {
      if (!B.value) return;
      const e = await y.read(`usage tool --agent ${a.row.id}`);
      W.value = e.ok ? e.value.tool : "", K.value = e.ok ? e.value.note : "";
    }
    const z = y.follow(["hook_call.*", "process_part.*"], ee);
    return fe(() => z == null ? void 0 : z()), ee(), (e, t) => {
      var s, u, j;
      return o(), l("div", {
        class: oe(["agent-card", { open: n.open }]),
        "data-agent-open": n.row.id,
        "aria-expanded": n.open,
        role: n.open ? void 0 : "button",
        tabindex: n.open ? void 0 : 0,
        title: n.row.session,
        onClick: t[4] || (t[4] = (c) => !n.open && r("toggle")),
        onKeydown: [
          t[5] || (t[5] = ce(G((c) => !n.open && r("toggle"), ["self", "prevent"]), ["enter"])),
          t[6] || (t[6] = ce(G((c) => !n.open && r("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        w("span", Je, [
          n.open ? (o(), l("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: t[0] || (t[0] = G((c) => r("toggle"), ["stop"]))
          }, [
            k(d(ue), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : v("", !0),
          w("span", {
            class: "agent-dot",
            "data-state": F.value,
            "data-agent-motion": ""
          }, null, 8, Qe),
          w("span", Xe, g(le.value), 1),
          w("span", Ze, g(((s = n.facts) == null ? void 0 : s.given_name) || n.row.id), 1),
          n.open ? v("", !0) : (o(), x(d(ue), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          n.row.ended_at && !E.value ? (o(), x(d(qe), {
            key: 2,
            class: "agent-time",
            at: n.row.ended_at,
            "data-agent-motion": ""
          }, null, 8, ["at"])) : (o(), l("span", et, g(Y.value), 1))
        ]),
        w("span", tt, [
          w("span", at, g(M.value), 1),
          q.value && !_.value ? (o(), l("span", nt, g(Q.value), 1)) : v("", !0)
        ]),
        _.value ? (o(), l("span", ot, [
          w("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: _.value
          }, g(_.value), 9, st),
          q.value ? (o(), l("span", lt, g(Q.value), 1)) : v("", !0)
        ])) : v("", !0),
        !n.open && (B.value || q.value && I.value) ? (o(), l("span", {
          key: 1,
          class: oe(["agent-foot", { "agent-work-start": !_.value }]),
          "data-agent-foot": ""
        }, [
          B.value ? (o(), x(pe, {
            key: 0,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: E.value,
            command: W.value,
            note: K.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : v("", !0),
          q.value && I.value ? (o(), l("span", it, g(I.value), 1)) : v("", !0)
        ], 2)) : v("", !0),
        n.open ? (o(), l("div", {
          key: 2,
          class: "agent-more",
          "data-agent-more": "",
          onClick: t[3] || (t[3] = G(() => {
          }, ["stop"]))
        }, [
          U.value ? (o(), l("span", rt, g(U.value), 1)) : v("", !0),
          B.value ? (o(), x(pe, {
            key: 1,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: E.value,
            command: W.value,
            note: K.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : v("", !0),
          V.value ? (o(), l("div", ut, [
            (u = n.facts) != null && u.instruction ? (o(), l("div", ct, [
              k(d(ye), {
                label: "Instruction",
                open: C.value,
                "data-agent-section": "instruction",
                onToggle: t[1] || (t[1] = (c) => C.value = !C.value)
              }, {
                default: R(() => [
                  w("div", dt, g(n.facts.instruction), 1)
                ]),
                _: 1
              }, 8, ["open"])
            ])) : v("", !0),
            k(ve, {
              line: `agent transcript ${n.row.id}`,
              padding: "0"
            }, null, 8, ["line"])
          ])) : (o(), l(ae, { key: 3 }, [
            k(d(Be), {
              class: "agent-tabs",
              active: T.value,
              answer: { tasks: p.value.length },
              onChoose: t[2] || (t[2] = (c) => T.value = c)
            }, null, 8, ["active", "answer"]),
            k(d(Oe), {
              class: "agent-tab-body",
              tab: T.value,
              "data-agent-tab-body": (j = T.value) == null ? void 0 : j.key
            }, {
              default: R(() => {
                var c;
                return [
                  k(d(Ie), {
                    value: (c = T.value) == null ? void 0 : c.key
                  }, Se({
                    tasks: R(() => {
                      var m;
                      return [
                        p.value.length ? v("", !0) : (o(), x(d(je), {
                          key: 0,
                          title: "No tasks"
                        }, {
                          default: R(() => [...t[7] || (t[7] = [
                            me("No tasks have been assigned to this agent.", -1)
                          ])]),
                          _: 1
                        })),
                        (o(!0), l(ae, null, re(ie.value, (h) => (o(), x(Me, {
                          key: h.state,
                          section: h,
                          open: S(h.state),
                          onToggle: (N) => H(h.state)
                        }, null, 8, ["section", "open", "onToggle"]))), 128)),
                        (m = n.facts) != null && m.instruction ? (o(), l(ae, { key: 1 }, [
                          t[8] || (t[8] = w("p", { class: "agent-label" }, "Instruction", -1)),
                          w("div", gt, g(n.facts.instruction), 1)
                        ], 64)) : v("", !0)
                      ];
                    }),
                    transcript: R(() => [
                      k(ve, {
                        line: `agent transcript ${n.row.id}`,
                        agent: n.row.id,
                        padding: "0"
                      }, null, 8, ["line", "agent"])
                    ]),
                    _: 2
                  }, [
                    re(d(Z), (m, h) => ({
                      name: h,
                      fn: R(() => [
                        (o(), x(Ce(m), {
                          agent: n.row.id
                        }, null, 8, ["agent"]))
                      ])
                    }))
                  ]), 1032, ["value"])
                ];
              }),
              _: 1
            }, 8, ["tab", "data-agent-tab-body"])
          ], 64))
        ])) : v("", !0)
      ], 42, Ye);
    };
  }
}, pt = /* @__PURE__ */ se(vt, [["__scopeId", "data-v-bd9f9dfe"]]), mt = ["data-agent-row"], te = "cubic-bezier(0.2, 0.9, 0.25, 1)", ft = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(n) {
    const L = [
      { key: "running", label: "Running" },
      { key: "idle", label: "Idle" },
      { key: "retired", label: "Retired" },
      { key: "all", label: "All" }
    ], $ = n, { rows: D } = Ne("usage agents --closed", ["agent.*", "task.*"]), { rows: a } = ge("waits"), { rows: r } = ge("progress"), P = (e) => r.value.find((t) => t.agent_id === e.id) ?? null, le = (e) => {
      var t;
      return ((t = a.value.find((s) => s.agent_id === e.id)) == null ? void 0 : t.reason) ?? "";
    }, p = f("running"), A = f(""), _ = ke(), M = f([]), Y = f(""), J = f(!1), E = f(!1), F = f(25);
    let U = 0;
    async function O() {
      const e = ++U, t = await _.read(`${$.line} --show ${p.value} --search ${JSON.stringify(A.value)} --limit ${F.value}`);
      e === U && (M.value = t.ok ? t.value.rows : [], Y.value = t.ok ? "" : t.error, E.value = t.ok && t.value.page * t.value.size < t.value.total, J.value = !0);
    }
    async function q() {
      return F.value += 25, await O(), !0;
    }
    ne([p, A], () => {
      F.value = 25, O();
    }), _.follow(["agent.*", "task.*", ..._.sources.flatMap((e) => e.events)], O), O();
    const Q = (e) => D.value.find((t) => t.id === e.id) ?? null, I = M, ie = i(() => !!A.value.trim()), X = i(() => $.texts[p.value] ?? { title: $.empty, hint: "" }), b = f(null), S = f(null), H = f(null), y = i(() => I.value.find((e) => e.id === b.value) ?? null), T = i(() => y.value ? [y.value] : I.value), Z = i(() => I.value.length - T.value.length), V = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let C = !1, W = 0;
    async function K(e) {
      if (C) return;
      C = !0, W = H.value.scrollTop;
      const t = S.value.querySelector(`[data-agent-open="${e.id}"]`);
      if (!V()) {
        const c = [...S.value.querySelectorAll(".agent-row")].filter((m) => !m.contains(t));
        await Promise.all(c.map((m) => m.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const s = [...t.querySelectorAll(".agent-head, .agent-line")], u = [...s, ...t.querySelectorAll("[data-agent-motion]")], j = u.map((c) => c.getBoundingClientRect());
      if (b.value = e.id, await de(), !V()) {
        const c = u.map((m) => m.getBoundingClientRect());
        u.forEach((m, h) => {
          const N = s.indexOf(m.parentElement), be = j[h].left - c[h].left - (N < 0 ? 0 : j[N].left - c[N].left), he = j[h].top - c[h].top - (N < 0 ? 0 : j[N].top - c[N].top);
          m.animate([{ transform: `translate(${be}px, ${he}px)` }, { transform: "none" }], { duration: 280, easing: te });
        }), S.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((m) => {
          m.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: te, fill: "backwards" });
        });
      }
      C = !1;
    }
    async function B() {
      if (C || !y.value) return;
      C = !0;
      const e = S.value.querySelector(`[data-agent-open="${b.value}"]`), t = [...e.children, ...S.value.querySelectorAll(".agents-held")], s = V() ? [] : t.map((u) => u.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(s.map((u) => u.finished)), b.value = null, await de(), H.value.scrollTop = W, s.forEach((u) => u.cancel()), V() || (e.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: te }), S.value.querySelectorAll(".agent-row").forEach((u) => {
        u.contains(e) || u.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: te });
      })), C = !1;
    }
    const ee = (e) => b.value === e.id ? B() : K(e);
    ne(A, (e) => e.trim() && (b.value = null)), ne(p, () => {
      b.value = null;
    });
    const z = (e) => {
      e.key === "Escape" && B();
    };
    return window.addEventListener("keydown", z), fe(() => window.removeEventListener("keydown", z)), (e, t) => (o(), l("div", {
      ref_key: "agents",
      ref: S,
      class: oe(["agents", { focused: y.value }])
    }, [
      k(d(Le), {
        modelValue: A.value,
        "onUpdate:modelValue": t[1] || (t[1] = (s) => A.value = s),
        placeholder: "Search agents",
        "data-agents-search": ""
      }, {
        default: R(() => [
          k(d(Ve), {
            options: L,
            value: p.value,
            onPick: t[0] || (t[0] = (s) => p.value = s)
          }, null, 8, ["value"])
        ]),
        _: 1
      }, 8, ["modelValue"]),
      w("div", {
        ref_key: "list",
        ref: H,
        class: oe(["agents-view", { "agents-view-open": y.value }])
      }, [
        k(d(We), {
          rows: T.value,
          failure: Y.value,
          loaded: J.value,
          more: !y.value && E.value,
          older: q,
          empty: X.value.title,
          hint: X.value.hint,
          searching: ie.value
        }, {
          default: R(({ row: s }) => [
            w("div", {
              class: "agent-row",
              "data-agent-row": s.id
            }, [
              k(pt, {
                row: s,
                facts: Q(s),
                progress: P(s),
                "wait-reason": le(s),
                open: s.id === b.value,
                onToggle: (u) => ee(s)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, mt)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"])
      ], 2),
      y.value && Z.value ? (o(), l("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: B
      }, g(Z.value) + " more", 1)) : v("", !0)
    ], 2));
  }
}, bt = /* @__PURE__ */ se(ft, [["__scopeId", "data-v-e1ce2121"]]);
export {
  bt as A
};
