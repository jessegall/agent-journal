/* @code-commandments-generated */
import { openBlock as o, createElementBlock as l, withModifiers as M, unref as c, createTextVNode as ye, toDisplayString as d, createVNode as y, createBlock as I, computed as r, ref as m, watch as se, defineAsyncComponent as Se, onUnmounted as ke, withKeys as ge, normalizeClass as le, createElementVNode as w, createCommentVNode as v, withCtx as x, Fragment as ne, createSlots as $e, renderList as ie, resolveDynamicComponent as _e, nextTick as ve } from "vue";
import { peekRef as he, Icon as ue, RunningCommand as Ce, useNow as Te, age as xe, perHour as Re, useWindow as be, loadWindowComponent as Ae, TimeAgo as Ee, FoldGroup as pe, InnerTabs as qe, TabBody as Be, SwitchCase as Oe, EmptyState as Ie, TaskStatusIcon as Ne, useRows as je, useDeclaredRows as me, SearchBar as Le, Segmented as We, RowList as Ve } from "@journal/window-kit";
import { _ as ce, T as fe } from "./TranscriptRows-CjXeMFF-.js";
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
    return (Y, R) => (o(), l("span", ze, [
      n.waitReason ? (o(), l("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: R[0] || (R[0] = M((G) => c(he)("test_queue:0"), ["stop"]))
      }, [
        ye("Waiting: " + d(n.waitReason) + " ", 1),
        y(c(ue), {
          name: "arrow",
          size: 11
        })
      ])) : n.stopped ? (o(), l("span", De, "Waiting")) : (o(), I(c(Ce), {
        key: 2,
        text: n.command,
        idle: n.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, we = /* @__PURE__ */ ce(Pe, [["__scopeId", "data-v-70734c30"]]), Fe = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], Ue = { class: "agent-head" }, He = ["data-state"], Ke = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Me = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Ye = {
  key: 3,
  class: "agent-time",
  "data-agent-motion": ""
}, Ge = { class: "agent-line" }, Je = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Qe = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, Xe = {
  key: 0,
  class: "agent-line agent-work-start"
}, Ze = ["title"], et = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, tt = {
  key: 1,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, at = {
  key: 0,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, nt = {
  key: 2,
  class: "agent-tab-body",
  "data-agent-tab-body": "transcript",
  "data-agent-only-transcript": ""
}, ot = {
  key: 0,
  class: "agent-subagent-brief"
}, st = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, lt = ["data-agent-delegated", "onClick"], rt = { class: "agent-task-number" }, it = { class: "agent-task-title" }, ut = ["title"], ct = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, dt = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(n, { emit: Y }) {
    const R = { subagent: "Subagent", reviewer: "Reviewer" }, G = ["started", "blocked", "open", "completed"], a = n, L = Y, J = Te(), re = r(() => {
      var t;
      const e = ((t = a.facts) == null ? void 0 : t.profile) || R[a.row.role] || a.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), p = r(() => {
      var e;
      return ((e = a.facts) == null ? void 0 : e.tasks) ?? [];
    }), A = r(() => a.row.role === "worker"), F = r(() => p.value.filter((e) => e.state === "open")), E = r(() => {
      var e, t;
      return A.value && (((e = a.facts) == null ? void 0 : e.task_title) || ((t = F.value[0]) == null ? void 0 : t.title)) || "";
    }), Q = r(() => {
      var e, t;
      return [a.row.program, (e = a.facts) == null ? void 0 : e.model, (t = a.facts) == null ? void 0 : t.effort, a.row.role === "main" ? "" : a.progress ? `${a.row.role} ${a.row.id}` : a.row.role].filter(Boolean).join(" · ");
    }), X = r(() => xe(a.row.process_started_at || a.row.created_at, J.value)), Z = /* @__PURE__ */ new Set(["open", "started", "testing"]), $ = r(() => !!a.row.ended_at && a.row.role !== "main" && p.value.some((e) => Z.has(e.state))), ee = r(() => {
      var e;
      return a.waitReason || $.value ? "waiting" : a.row.state === "running" && ((e = a.facts) == null ? void 0 : e.state) || a.row.state;
    }), N = r(() => {
      var t, u, S;
      const e = [];
      return ((t = a.facts) == null ? void 0 : t.context_percent) !== null && ((u = a.facts) == null ? void 0 : u.context_percent) !== void 0 && e.push(`Context: ${a.facts.context_percent}%`), (S = a.facts) != null && S.cost_dollars && e.push(`$${a.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), te = r(() => {
      var e;
      return ((e = a.progress) == null ? void 0 : e.completed_count) ?? p.value.filter((t) => t.state === "completed").length;
    }), q = r(() => {
      var e;
      return ((e = a.progress) == null ? void 0 : e.task_count) ?? p.value.length;
    }), W = r(() => `${te.value} of ${q.value} ${q.value === 1 ? "task" : "tasks"}`), U = r(() => {
      var t;
      const e = Re(te.value, ((t = a.progress) == null ? void 0 : t.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, J.value);
      return a.row.role !== "main" && e ? `${e} per hour` : "";
    }), ae = r(() => p.value.length ? G.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: p.value.filter((t) => t.state === e || e === "started" && t.state === "testing" || e === "completed" && t.state === "cancelled") })) : []), b = /* @__PURE__ */ new Set(["completed"]), k = m({}), V = (e) => !(k.value[e] ?? b.has(e)), _ = (e) => k.value = { ...k.value, [e]: V(e) }, B = be(), C = m(B.tabs[0]);
    se(() => a.open, (e) => {
      e && (C.value = B.tabs[0]);
    });
    const z = Object.fromEntries(B.tabs.filter((e) => e.component).map((e) => [e.key, Se(() => Ae(e.component))])), O = r(() => a.row.role === "subagent" || a.row.role === "reviewer"), D = m(!1), H = m(""), j = m(""), P = r(() => a.row.role !== "main" && (!a.row.ended_at || $.value || a.waitReason));
    async function K() {
      if (!P.value) return;
      const e = await B.read(`usage tool --agent ${a.row.id}`);
      H.value = e.ok ? e.value.tool : "", j.value = e.ok ? e.value.note : "";
    }
    const s = B.follow(["hook_call.*", "process_part.*"], K);
    return ke(() => s == null ? void 0 : s()), K(), (e, t) => {
      var u, S, h;
      return o(), l("div", {
        class: le(["agent-card", { open: n.open }]),
        "data-agent-open": n.row.id,
        "aria-expanded": n.open,
        role: n.open ? void 0 : "button",
        tabindex: n.open ? void 0 : 0,
        title: n.row.session,
        onClick: t[4] || (t[4] = (i) => !n.open && L("toggle")),
        onKeydown: [
          t[5] || (t[5] = ge(M((i) => !n.open && L("toggle"), ["self", "prevent"]), ["enter"])),
          t[6] || (t[6] = ge(M((i) => !n.open && L("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        w("span", Ue, [
          n.open ? (o(), l("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: t[0] || (t[0] = M((i) => L("toggle"), ["stop"]))
          }, [
            y(c(ue), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : v("", !0),
          w("span", {
            class: "agent-dot",
            "data-state": ee.value,
            "data-agent-motion": ""
          }, null, 8, He),
          w("span", Ke, d(re.value), 1),
          w("span", Me, d(((u = n.facts) == null ? void 0 : u.given_name) || n.row.id), 1),
          n.open ? v("", !0) : (o(), I(c(ue), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          n.row.ended_at && !$.value ? (o(), I(c(Ee), {
            key: 2,
            class: "agent-time",
            at: n.row.ended_at,
            "data-agent-motion": ""
          }, null, 8, ["at"])) : (o(), l("span", Ye, d(X.value), 1))
        ]),
        w("span", Ge, [
          w("span", Je, d(Q.value), 1),
          q.value && !E.value ? (o(), l("span", Qe, d(W.value), 1)) : v("", !0)
        ]),
        E.value ? (o(), l("span", Xe, [
          w("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: E.value
          }, d(E.value), 9, Ze),
          q.value ? (o(), l("span", et, d(W.value), 1)) : v("", !0)
        ])) : v("", !0),
        !n.open && (P.value || q.value && U.value) ? (o(), l("span", {
          key: 1,
          class: le(["agent-foot", { "agent-work-start": !E.value }]),
          "data-agent-foot": ""
        }, [
          P.value ? (o(), I(we, {
            key: 0,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: $.value,
            command: H.value,
            note: j.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : v("", !0),
          q.value && U.value ? (o(), l("span", tt, d(U.value), 1)) : v("", !0)
        ], 2)) : v("", !0),
        n.open ? (o(), l("div", {
          key: 2,
          class: "agent-more",
          "data-agent-more": "",
          onClick: t[3] || (t[3] = M(() => {
          }, ["stop"]))
        }, [
          N.value ? (o(), l("span", at, d(N.value), 1)) : v("", !0),
          P.value ? (o(), I(we, {
            key: 1,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: $.value,
            command: H.value,
            note: j.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : v("", !0),
          O.value ? (o(), l("div", nt, [
            (S = n.facts) != null && S.instruction ? (o(), l("div", ot, [
              y(c(pe), {
                label: "Instruction",
                open: D.value,
                "data-agent-section": "instruction",
                onToggle: t[1] || (t[1] = (i) => D.value = !D.value)
              }, {
                default: x(() => [
                  w("div", st, d(n.facts.instruction), 1)
                ]),
                _: 1
              }, 8, ["open"])
            ])) : v("", !0),
            y(fe, {
              line: `agent transcript ${n.row.id}`,
              padding: "0"
            }, null, 8, ["line"])
          ])) : (o(), l(ne, { key: 3 }, [
            y(c(qe), {
              class: "agent-tabs",
              active: C.value,
              answer: { tasks: p.value.length },
              onChoose: t[2] || (t[2] = (i) => C.value = i)
            }, null, 8, ["active", "answer"]),
            y(c(Be), {
              class: "agent-tab-body",
              tab: C.value,
              "data-agent-tab-body": (h = C.value) == null ? void 0 : h.key
            }, {
              default: x(() => {
                var i;
                return [
                  y(c(Oe), {
                    value: (i = C.value) == null ? void 0 : i.key
                  }, $e({
                    tasks: x(() => {
                      var T;
                      return [
                        p.value.length ? v("", !0) : (o(), I(c(Ie), {
                          key: 0,
                          title: "No tasks"
                        }, {
                          default: x(() => [...t[7] || (t[7] = [
                            ye("No tasks have been assigned to this agent.", -1)
                          ])]),
                          _: 1
                        })),
                        (o(!0), l(ne, null, ie(ae.value, (g) => (o(), I(c(pe), {
                          key: g.state,
                          label: g.label,
                          count: g.tasks.length,
                          open: V(g.state),
                          "data-agent-section": g.state,
                          onToggle: (f) => _(g.state)
                        }, {
                          default: x(() => [
                            (o(!0), l(ne, null, ie(g.tasks, (f) => (o(), l("button", {
                              key: f.id,
                              type: "button",
                              class: "agent-task",
                              "data-agent-delegated": f.id,
                              onClick: (de) => c(he)(`tasks:${f.id}`)
                            }, [
                              y(c(Ne), {
                                status: f.state
                              }, null, 8, ["status"]),
                              w("span", rt, d(f.id), 1),
                              w("span", it, d(f.title), 1),
                              f.plan_id ? (o(), l("span", {
                                key: 0,
                                class: "agent-task-plan",
                                "data-agent-task-plan": "",
                                title: `Plan ${f.plan_id}: ${f.plan_title}`
                              }, "Plan " + d(f.plan_id) + ": " + d(f.plan_title), 9, ut)) : v("", !0)
                            ], 8, lt))), 128))
                          ]),
                          _: 2
                        }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
                        (T = n.facts) != null && T.instruction ? (o(), l(ne, { key: 1 }, [
                          t[8] || (t[8] = w("p", { class: "agent-label" }, "Instruction", -1)),
                          w("div", ct, d(n.facts.instruction), 1)
                        ], 64)) : v("", !0)
                      ];
                    }),
                    transcript: x(() => [
                      y(fe, {
                        line: `agent transcript ${n.row.id}`,
                        padding: "0"
                      }, null, 8, ["line"])
                    ]),
                    _: 2
                  }, [
                    ie(c(z), (T, g) => ({
                      name: g,
                      fn: x(() => [
                        (o(), I(_e(T), {
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
      ], 42, Fe);
    };
  }
}, gt = /* @__PURE__ */ ce(dt, [["__scopeId", "data-v-ac783919"]]), vt = ["data-agent-row"], oe = "cubic-bezier(0.2, 0.9, 0.25, 1)", pt = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(n) {
    const Y = [
      { key: "running", label: "Running" },
      { key: "idle", label: "Idle" },
      { key: "retired", label: "Retired" },
      { key: "all", label: "All" }
    ], R = n, { rows: G } = je("usage agents --closed", ["agent.*", "task.*"]), { rows: a } = me("waits"), { rows: L } = me("progress"), J = (s) => L.value.find((e) => e.agent_id === s.id) ?? null, re = (s) => {
      var e;
      return ((e = a.value.find((t) => t.agent_id === s.id)) == null ? void 0 : e.reason) ?? "";
    }, p = m("running"), A = m(""), F = be(), E = m([]), Q = m(""), X = m(!1), Z = m(!1), $ = m(25);
    let ee = 0;
    async function N() {
      const s = ++ee, e = await F.read(`${R.line} --show ${p.value} --search ${JSON.stringify(A.value)} --limit ${$.value}`);
      s === ee && (E.value = e.ok ? e.value.rows : [], Q.value = e.ok ? "" : e.error, Z.value = e.ok && e.value.page * e.value.size < e.value.total, X.value = !0);
    }
    async function te() {
      return $.value += 25, await N(), !0;
    }
    se([p, A], () => {
      $.value = 25, N();
    }), F.follow(["agent.*", "task.*", ...F.sources.flatMap((s) => s.events)], N), N();
    const q = (s) => G.value.find((e) => e.id === s.id) ?? null, W = E, U = r(() => !!A.value.trim()), ae = r(() => R.texts[p.value] ?? { title: R.empty, hint: "" }), b = m(null), k = m(null), V = m(null), _ = r(() => W.value.find((s) => s.id === b.value) ?? null), B = r(() => _.value ? [_.value] : W.value), C = r(() => W.value.length - B.value.length), z = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let O = !1, D = 0;
    async function H(s) {
      if (O) return;
      O = !0, D = V.value.scrollTop;
      const e = k.value.querySelector(`[data-agent-open="${s.id}"]`);
      if (!z()) {
        const h = [...k.value.querySelectorAll(".agent-row")].filter((i) => !i.contains(e));
        await Promise.all(h.map((i) => i.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const t = [...e.querySelectorAll(".agent-head, .agent-line")], u = [...t, ...e.querySelectorAll("[data-agent-motion]")], S = u.map((h) => h.getBoundingClientRect());
      if (b.value = s.id, await ve(), !z()) {
        const h = u.map((i) => i.getBoundingClientRect());
        u.forEach((i, T) => {
          const g = t.indexOf(i.parentElement), f = S[T].left - h[T].left - (g < 0 ? 0 : S[g].left - h[g].left), de = S[T].top - h[T].top - (g < 0 ? 0 : S[g].top - h[g].top);
          i.animate([{ transform: `translate(${f}px, ${de}px)` }, { transform: "none" }], { duration: 280, easing: oe });
        }), k.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((i) => {
          i.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: oe, fill: "backwards" });
        });
      }
      O = !1;
    }
    async function j() {
      if (O || !_.value) return;
      O = !0;
      const s = k.value.querySelector(`[data-agent-open="${b.value}"]`), e = [...s.children, ...k.value.querySelectorAll(".agents-held")], t = z() ? [] : e.map((u) => u.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(t.map((u) => u.finished)), b.value = null, await ve(), V.value.scrollTop = D, t.forEach((u) => u.cancel()), z() || (s.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: oe }), k.value.querySelectorAll(".agent-row").forEach((u) => {
        u.contains(s) || u.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: oe });
      })), O = !1;
    }
    const P = (s) => b.value === s.id ? j() : H(s);
    se(A, (s) => s.trim() && (b.value = null)), se(p, () => {
      b.value = null;
    });
    const K = (s) => {
      s.key === "Escape" && j();
    };
    return window.addEventListener("keydown", K), ke(() => window.removeEventListener("keydown", K)), (s, e) => (o(), l("div", {
      ref_key: "agents",
      ref: k,
      class: le(["agents", { focused: _.value }])
    }, [
      y(c(Le), {
        modelValue: A.value,
        "onUpdate:modelValue": e[1] || (e[1] = (t) => A.value = t),
        placeholder: "Search agents",
        "data-agents-search": ""
      }, {
        default: x(() => [
          y(c(We), {
            options: Y,
            value: p.value,
            onPick: e[0] || (e[0] = (t) => p.value = t)
          }, null, 8, ["value"])
        ]),
        _: 1
      }, 8, ["modelValue"]),
      w("div", {
        ref_key: "list",
        ref: V,
        class: le(["agents-view", { "agents-view-open": _.value }])
      }, [
        y(c(Ve), {
          rows: B.value,
          failure: Q.value,
          loaded: X.value,
          more: !_.value && Z.value,
          older: te,
          empty: ae.value.title,
          hint: ae.value.hint,
          searching: U.value
        }, {
          default: x(({ row: t }) => [
            w("div", {
              class: "agent-row",
              "data-agent-row": t.id
            }, [
              y(gt, {
                row: t,
                facts: q(t),
                progress: J(t),
                "wait-reason": re(t),
                open: t.id === b.value,
                onToggle: (u) => P(t)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, vt)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"])
      ], 2),
      _.value && C.value ? (o(), l("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: j
      }, d(C.value) + " more", 1)) : v("", !0)
    ], 2));
  }
}, yt = /* @__PURE__ */ ce(pt, [["__scopeId", "data-v-e1ce2121"]]);
export {
  yt as A
};
