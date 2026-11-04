/* @code-commandments-generated */
import { openBlock as s, createElementBlock as l, withModifiers as M, unref as c, createTextVNode as ye, toDisplayString as p, createVNode as w, createBlock as I, computed as r, ref as m, watch as se, defineAsyncComponent as Se, onUnmounted as ke, withKeys as ge, normalizeClass as le, createElementVNode as f, createCommentVNode as v, withCtx as x, Fragment as ne, createSlots as $e, renderList as ie, resolveDynamicComponent as Ce, nextTick as ve } from "vue";
import { peekRef as he, Icon as ue, RunningCommand as _e, useNow as Te, age as xe, perHour as Re, useWindow as be, loadWindowComponent as Ae, TimeAgo as Ee, FoldGroup as pe, InnerTabs as qe, TabBody as Be, SwitchCase as Oe, EmptyState as Ie, TaskStatusIcon as Ne, useRows as je, useDeclaredRows as me, SearchBar as Le, Segmented as We, RowList as Ve } from "@journal/window-kit";
import { _ as ce, T as fe } from "./TranscriptRows-CjXeMFF-.js";
const ze = {
  class: "agent-command",
  "data-agent-command": ""
}, De = {
  key: 1,
  "data-agent-stopped": ""
}, Fe = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(n) {
    return (Y, R) => (s(), l("span", ze, [
      n.waitReason ? (s(), l("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: R[0] || (R[0] = M((G) => c(he)("test_queue:0"), ["stop"]))
      }, [
        ye("Waiting: " + p(n.waitReason) + " ", 1),
        w(c(ue), {
          name: "arrow",
          size: 11
        })
      ])) : n.stopped ? (s(), l("span", De, "Waiting")) : (s(), I(c(_e), {
        key: 2,
        text: n.command,
        idle: n.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, we = /* @__PURE__ */ ce(Fe, [["__scopeId", "data-v-70734c30"]]), Ue = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], He = { class: "agent-head" }, Ke = ["data-state"], Pe = {
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
}, lt = ["data-agent-delegated", "onClick"], rt = { class: "agent-task-number" }, it = { class: "agent-task-title" }, ut = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ct = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(n, { emit: Y }) {
    const R = { subagent: "Subagent", reviewer: "Reviewer" }, G = ["started", "blocked", "open", "completed"], a = n, L = Y, J = Te(), re = r(() => {
      var t;
      const e = ((t = a.facts) == null ? void 0 : t.profile) || R[a.row.role] || a.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), g = r(() => {
      var e;
      return ((e = a.facts) == null ? void 0 : e.tasks) ?? [];
    }), A = r(() => a.row.role === "worker"), U = r(() => g.value.filter((e) => e.state === "open")), E = r(() => {
      var e, t;
      return A.value && (((e = a.facts) == null ? void 0 : e.task_title) || ((t = U.value[0]) == null ? void 0 : t.title)) || "";
    }), Q = r(() => {
      var e, t;
      return [a.row.program, (e = a.facts) == null ? void 0 : e.model, (t = a.facts) == null ? void 0 : t.effort, a.row.role === "main" ? "" : a.progress ? `${a.row.role} ${a.row.id}` : a.row.role].filter(Boolean).join(" · ");
    }), X = r(() => xe(a.row.process_started_at || a.row.created_at, J.value)), Z = /* @__PURE__ */ new Set(["open", "started", "testing"]), S = r(() => !!a.row.ended_at && a.row.role !== "main" && g.value.some((e) => Z.has(e.state))), ee = r(() => {
      var e;
      return a.waitReason || S.value ? "waiting" : a.row.state === "running" && ((e = a.facts) == null ? void 0 : e.state) || a.row.state;
    }), N = r(() => {
      var t, u, b;
      const e = [];
      return ((t = a.facts) == null ? void 0 : t.context_percent) !== null && ((u = a.facts) == null ? void 0 : u.context_percent) !== void 0 && e.push(`Context: ${a.facts.context_percent}%`), (b = a.facts) != null && b.cost_dollars && e.push(`$${a.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), te = r(() => {
      var e;
      return ((e = a.progress) == null ? void 0 : e.completed_count) ?? g.value.filter((t) => t.state === "completed").length;
    }), q = r(() => {
      var e;
      return ((e = a.progress) == null ? void 0 : e.task_count) ?? g.value.length;
    }), W = r(() => `${te.value} of ${q.value} ${q.value === 1 ? "task" : "tasks"}`), H = r(() => {
      var t;
      const e = Re(te.value, ((t = a.progress) == null ? void 0 : t.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, J.value);
      return a.row.role !== "main" && e ? `${e} per hour` : "";
    }), ae = r(() => g.value.length ? G.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: g.value.filter((t) => t.state === e || e === "started" && t.state === "testing" || e === "completed" && t.state === "cancelled") })) : []), h = /* @__PURE__ */ new Set(["completed"]), y = m({}), V = (e) => !(y.value[e] ?? h.has(e)), $ = (e) => y.value = { ...y.value, [e]: V(e) }, B = be(), C = m(B.tabs[0]);
    se(() => a.open, (e) => {
      e && (C.value = B.tabs[0]);
    });
    const z = Object.fromEntries(B.tabs.filter((e) => e.component).map((e) => [e.key, Se(() => Ae(e.component))])), O = r(() => a.row.role === "subagent" || a.row.role === "reviewer"), D = m(!1), K = m(""), j = m(""), F = r(() => a.row.role !== "main" && (!a.row.ended_at || S.value || a.waitReason));
    async function P() {
      if (!F.value) return;
      const e = await B.read(`usage tool --agent ${a.row.id}`);
      K.value = e.ok ? e.value.tool : "", j.value = e.ok ? e.value.note : "";
    }
    const o = B.follow(["hook_call.*", "process_part.*"], P);
    return ke(() => o == null ? void 0 : o()), P(), (e, t) => {
      var u, b, k;
      return s(), l("div", {
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
        f("span", He, [
          n.open ? (s(), l("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: t[0] || (t[0] = M((i) => L("toggle"), ["stop"]))
          }, [
            w(c(ue), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : v("", !0),
          f("span", {
            class: "agent-dot",
            "data-state": ee.value,
            "data-agent-motion": ""
          }, null, 8, Ke),
          f("span", Pe, p(re.value), 1),
          f("span", Me, p(((u = n.facts) == null ? void 0 : u.given_name) || n.row.id), 1),
          n.open ? v("", !0) : (s(), I(c(ue), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          n.row.ended_at && !S.value ? (s(), I(c(Ee), {
            key: 2,
            class: "agent-time",
            at: n.row.ended_at,
            "data-agent-motion": ""
          }, null, 8, ["at"])) : (s(), l("span", Ye, p(X.value), 1))
        ]),
        f("span", Ge, [
          f("span", Je, p(Q.value), 1),
          q.value && !E.value ? (s(), l("span", Qe, p(W.value), 1)) : v("", !0)
        ]),
        E.value ? (s(), l("span", Xe, [
          f("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: E.value
          }, p(E.value), 9, Ze),
          q.value ? (s(), l("span", et, p(W.value), 1)) : v("", !0)
        ])) : v("", !0),
        !n.open && (F.value || q.value && H.value) ? (s(), l("span", {
          key: 1,
          class: le(["agent-foot", { "agent-work-start": !E.value }]),
          "data-agent-foot": ""
        }, [
          F.value ? (s(), I(we, {
            key: 0,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: S.value,
            command: K.value,
            note: j.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : v("", !0),
          q.value && H.value ? (s(), l("span", tt, p(H.value), 1)) : v("", !0)
        ], 2)) : v("", !0),
        n.open ? (s(), l("div", {
          key: 2,
          class: "agent-more",
          "data-agent-more": "",
          onClick: t[3] || (t[3] = M(() => {
          }, ["stop"]))
        }, [
          N.value ? (s(), l("span", at, p(N.value), 1)) : v("", !0),
          F.value ? (s(), I(we, {
            key: 1,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: S.value,
            command: K.value,
            note: j.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : v("", !0),
          O.value ? (s(), l("div", nt, [
            (b = n.facts) != null && b.instruction ? (s(), l("div", ot, [
              w(c(pe), {
                label: "Instruction",
                open: D.value,
                "data-agent-section": "instruction",
                onToggle: t[1] || (t[1] = (i) => D.value = !D.value)
              }, {
                default: x(() => [
                  f("div", st, p(n.facts.instruction), 1)
                ]),
                _: 1
              }, 8, ["open"])
            ])) : v("", !0),
            w(fe, {
              line: `agent transcript ${n.row.id}`,
              padding: "0"
            }, null, 8, ["line"])
          ])) : (s(), l(ne, { key: 3 }, [
            w(c(qe), {
              class: "agent-tabs",
              active: C.value,
              answer: { tasks: g.value.length },
              onChoose: t[2] || (t[2] = (i) => C.value = i)
            }, null, 8, ["active", "answer"]),
            w(c(Be), {
              class: "agent-tab-body",
              tab: C.value,
              "data-agent-tab-body": (k = C.value) == null ? void 0 : k.key
            }, {
              default: x(() => {
                var i;
                return [
                  w(c(Oe), {
                    value: (i = C.value) == null ? void 0 : i.key
                  }, $e({
                    tasks: x(() => {
                      var _;
                      return [
                        g.value.length ? v("", !0) : (s(), I(c(Ie), {
                          key: 0,
                          title: "No tasks"
                        }, {
                          default: x(() => [...t[7] || (t[7] = [
                            ye("No tasks have been assigned to this agent.", -1)
                          ])]),
                          _: 1
                        })),
                        (s(!0), l(ne, null, ie(ae.value, (d) => (s(), I(c(pe), {
                          key: d.state,
                          label: d.label,
                          count: d.tasks.length,
                          open: V(d.state),
                          "data-agent-section": d.state,
                          onToggle: (T) => $(d.state)
                        }, {
                          default: x(() => [
                            (s(!0), l(ne, null, ie(d.tasks, (T) => (s(), l("button", {
                              key: T.id,
                              type: "button",
                              class: "agent-task",
                              "data-agent-delegated": T.id,
                              onClick: (de) => c(he)(`tasks:${T.id}`)
                            }, [
                              w(c(Ne), {
                                status: T.state
                              }, null, 8, ["status"]),
                              f("span", rt, p(T.id), 1),
                              f("span", it, p(T.title), 1)
                            ], 8, lt))), 128))
                          ]),
                          _: 2
                        }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
                        (_ = n.facts) != null && _.instruction ? (s(), l(ne, { key: 1 }, [
                          t[8] || (t[8] = f("p", { class: "agent-label" }, "Instruction", -1)),
                          f("div", ut, p(n.facts.instruction), 1)
                        ], 64)) : v("", !0)
                      ];
                    }),
                    transcript: x(() => [
                      w(fe, {
                        line: `agent transcript ${n.row.id}`,
                        padding: "0"
                      }, null, 8, ["line"])
                    ]),
                    _: 2
                  }, [
                    ie(c(z), (_, d) => ({
                      name: d,
                      fn: x(() => [
                        (s(), I(Ce(_), {
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
      ], 42, Ue);
    };
  }
}, dt = /* @__PURE__ */ ce(ct, [["__scopeId", "data-v-cb2608ce"]]), gt = ["data-agent-row"], oe = "cubic-bezier(0.2, 0.9, 0.25, 1)", vt = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(n) {
    const Y = [
      { key: "running", label: "Running" },
      { key: "idle", label: "Idle" },
      { key: "retired", label: "Retired" },
      { key: "all", label: "All" }
    ], R = n, { rows: G } = je("usage agents --closed", ["agent.*", "task.*"]), { rows: a } = me("waits"), { rows: L } = me("progress"), J = (o) => L.value.find((e) => e.agent_id === o.id) ?? null, re = (o) => {
      var e;
      return ((e = a.value.find((t) => t.agent_id === o.id)) == null ? void 0 : e.reason) ?? "";
    }, g = m("running"), A = m(""), U = be(), E = m([]), Q = m(""), X = m(!1), Z = m(!1), S = m(25);
    let ee = 0;
    async function N() {
      const o = ++ee, e = await U.read(`${R.line} --show ${g.value} --search ${JSON.stringify(A.value)} --limit ${S.value}`);
      o === ee && (E.value = e.ok ? e.value.rows : [], Q.value = e.ok ? "" : e.error, Z.value = e.ok && e.value.page * e.value.size < e.value.total, X.value = !0);
    }
    async function te() {
      return S.value += 25, await N(), !0;
    }
    se([g, A], () => {
      S.value = 25, N();
    }), U.follow(["agent.*", "task.*", ...U.sources.flatMap((o) => o.events)], N), N();
    const q = (o) => G.value.find((e) => e.id === o.id) ?? null, W = E, H = r(() => !!A.value.trim()), ae = r(() => R.texts[g.value] ?? { title: R.empty, hint: "" }), h = m(null), y = m(null), V = m(null), $ = r(() => W.value.find((o) => o.id === h.value) ?? null), B = r(() => $.value ? [$.value] : W.value), C = r(() => W.value.length - B.value.length), z = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let O = !1, D = 0;
    async function K(o) {
      if (O) return;
      O = !0, D = V.value.scrollTop;
      const e = y.value.querySelector(`[data-agent-open="${o.id}"]`);
      if (!z()) {
        const k = [...y.value.querySelectorAll(".agent-row")].filter((i) => !i.contains(e));
        await Promise.all(k.map((i) => i.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const t = [...e.querySelectorAll(".agent-head, .agent-line")], u = [...t, ...e.querySelectorAll("[data-agent-motion]")], b = u.map((k) => k.getBoundingClientRect());
      if (h.value = o.id, await ve(), !z()) {
        const k = u.map((i) => i.getBoundingClientRect());
        u.forEach((i, _) => {
          const d = t.indexOf(i.parentElement), T = b[_].left - k[_].left - (d < 0 ? 0 : b[d].left - k[d].left), de = b[_].top - k[_].top - (d < 0 ? 0 : b[d].top - k[d].top);
          i.animate([{ transform: `translate(${T}px, ${de}px)` }, { transform: "none" }], { duration: 280, easing: oe });
        }), y.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((i) => {
          i.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: oe, fill: "backwards" });
        });
      }
      O = !1;
    }
    async function j() {
      if (O || !$.value) return;
      O = !0;
      const o = y.value.querySelector(`[data-agent-open="${h.value}"]`), e = [...o.children, ...y.value.querySelectorAll(".agents-held")], t = z() ? [] : e.map((u) => u.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(t.map((u) => u.finished)), h.value = null, await ve(), V.value.scrollTop = D, t.forEach((u) => u.cancel()), z() || (o.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: oe }), y.value.querySelectorAll(".agent-row").forEach((u) => {
        u.contains(o) || u.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: oe });
      })), O = !1;
    }
    const F = (o) => h.value === o.id ? j() : K(o);
    se(A, (o) => o.trim() && (h.value = null)), se(g, () => {
      h.value = null;
    });
    const P = (o) => {
      o.key === "Escape" && j();
    };
    return window.addEventListener("keydown", P), ke(() => window.removeEventListener("keydown", P)), (o, e) => (s(), l("div", {
      ref_key: "agents",
      ref: y,
      class: le(["agents", { focused: $.value }])
    }, [
      w(c(Le), {
        modelValue: A.value,
        "onUpdate:modelValue": e[1] || (e[1] = (t) => A.value = t),
        placeholder: "Search agents",
        "data-agents-search": ""
      }, {
        default: x(() => [
          w(c(We), {
            options: Y,
            value: g.value,
            onPick: e[0] || (e[0] = (t) => g.value = t)
          }, null, 8, ["value"])
        ]),
        _: 1
      }, 8, ["modelValue"]),
      f("div", {
        ref_key: "list",
        ref: V,
        class: le(["agents-view", { "agents-view-open": $.value }])
      }, [
        w(c(Ve), {
          rows: B.value,
          failure: Q.value,
          loaded: X.value,
          more: !$.value && Z.value,
          older: te,
          empty: ae.value.title,
          hint: ae.value.hint,
          searching: H.value
        }, {
          default: x(({ row: t }) => [
            f("div", {
              class: "agent-row",
              "data-agent-row": t.id
            }, [
              w(dt, {
                row: t,
                facts: q(t),
                progress: J(t),
                "wait-reason": re(t),
                open: t.id === h.value,
                onToggle: (u) => F(t)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, gt)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"])
      ], 2),
      $.value && C.value ? (s(), l("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: j
      }, p(C.value) + " more", 1)) : v("", !0)
    ], 2));
  }
}, wt = /* @__PURE__ */ ce(vt, [["__scopeId", "data-v-e1ce2121"]]);
export {
  wt as A
};
