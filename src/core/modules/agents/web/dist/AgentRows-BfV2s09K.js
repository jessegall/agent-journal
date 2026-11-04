/* @code-commandments-generated */
import { openBlock as s, createElementBlock as l, withModifiers as Y, unref as u, createTextVNode as ye, toDisplayString as p, createVNode as h, createBlock as B, computed as r, ref as f, watch as se, defineAsyncComponent as Se, onUnmounted as ke, withKeys as ge, normalizeClass as le, createElementVNode as m, createCommentVNode as v, withCtx as I, Fragment as ne, createSlots as $e, renderList as ie, resolveDynamicComponent as Ce, nextTick as ve } from "vue";
import { peekRef as he, Icon as ue, RunningCommand as _e, useNow as Re, age as xe, useWindow as be, loadWindowComponent as Te, TimeAgo as Ae, FoldGroup as pe, InnerTabs as Ee, SwitchCase as Oe, EmptyState as qe, TaskStatusIcon as Be, useRows as Ie, useDeclaredRows as me, SearchBar as Ne, Segmented as je, RowList as Le } from "@journal/window-kit";
import { _ as ce, T as fe } from "./TranscriptRows-CjXeMFF-.js";
const De = {
  class: "agent-command",
  "data-agent-command": ""
}, We = {
  key: 1,
  "data-agent-stopped": ""
}, Ve = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(n) {
    return (G, R) => (s(), l("span", De, [
      n.waitReason ? (s(), l("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: R[0] || (R[0] = Y((J) => u(he)("test_queue:0"), ["stop"]))
      }, [
        ye("Waiting: " + p(n.waitReason) + " ", 1),
        h(u(ue), {
          name: "arrow",
          size: 11
        })
      ])) : n.stopped ? (s(), l("span", We, "Waiting")) : (s(), B(u(_e), {
        key: 2,
        text: n.command,
        idle: n.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, we = /* @__PURE__ */ ce(Ve, [["__scopeId", "data-v-70734c30"]]), ze = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], Ue = { class: "agent-head" }, Fe = ["data-state"], Me = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Pe = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, He = {
  key: 3,
  class: "agent-time",
  "data-agent-motion": ""
}, Ke = { class: "agent-line" }, Ye = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Ge = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, Je = {
  key: 0,
  class: "agent-line agent-work-start"
}, Qe = ["title"], Xe = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, Ze = {
  key: 1,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, et = {
  key: 0,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, tt = {
  key: 2,
  class: "agent-tab-body",
  "data-agent-tab-body": "transcript",
  "data-agent-only-transcript": ""
}, at = {
  key: 0,
  class: "agent-subagent-brief"
}, nt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ot = ["data-agent-tab-body"], st = ["data-agent-delegated", "onClick"], lt = { class: "agent-task-number" }, rt = { class: "agent-task-title" }, it = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ut = 36e5, ct = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(n, { emit: G }) {
    const R = { subagent: "Subagent", reviewer: "Reviewer" }, J = ["started", "blocked", "open", "completed"], a = n, L = G, Q = Re(), re = r(() => {
      var t;
      const e = ((t = a.facts) == null ? void 0 : t.profile) || R[a.row.role] || a.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), g = r(() => {
      var e;
      return ((e = a.facts) == null ? void 0 : e.tasks) ?? [];
    }), x = r(() => a.row.role === "worker"), F = r(() => g.value.filter((e) => e.state === "open")), T = r(() => {
      var e, t;
      return x.value && (((e = a.facts) == null ? void 0 : e.task_title) || ((t = F.value[0]) == null ? void 0 : t.title)) || "";
    }), X = r(() => {
      var e, t;
      return [a.row.program, (e = a.facts) == null ? void 0 : e.model, (t = a.facts) == null ? void 0 : t.effort, a.row.role === "main" ? "" : a.progress ? `${a.row.role} ${a.row.id}` : a.row.role].filter(Boolean).join(" · ");
    }), Z = r(() => xe(a.row.process_started_at || a.row.created_at, Q.value)), ee = /* @__PURE__ */ new Set(["open", "started", "testing"]), $ = r(() => !!a.row.ended_at && a.row.role !== "main" && g.value.some((e) => ee.has(e.state))), te = r(() => {
      var e;
      return a.waitReason || $.value ? "waiting" : a.row.state === "running" && ((e = a.facts) == null ? void 0 : e.state) || a.row.state;
    }), N = r(() => {
      var t, i, y;
      const e = [];
      return ((t = a.facts) == null ? void 0 : t.context_percent) !== null && ((i = a.facts) == null ? void 0 : i.context_percent) !== void 0 && e.push(`Context: ${a.facts.context_percent}%`), (y = a.facts) != null && y.cost_dollars && e.push(`$${a.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), M = r(() => {
      var e;
      return ((e = a.progress) == null ? void 0 : e.completed_count) ?? g.value.filter((t) => t.state === "completed").length;
    }), A = r(() => {
      var e;
      return ((e = a.progress) == null ? void 0 : e.task_count) ?? g.value.length;
    }), D = r(() => `${M.value} of ${A.value} ${A.value === 1 ? "task" : "tasks"}`), P = r(() => {
      var w;
      const e = Date.parse(((w = a.progress) == null ? void 0 : w.started_at) || a.row.created_at), t = a.progress ? a.progress.finished_at : a.row.ended_at, y = ((t ? Date.parse(t) : Q.value) - e) / ut;
      return a.row.role !== "main" && y > 0 && M.value ? `${Math.round(M.value / y)} per hour` : "";
    }), ae = r(() => g.value.length ? J.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: g.value.filter((t) => t.state === e || e === "started" && t.state === "testing" || e === "completed" && t.state === "cancelled") })) : []), S = /* @__PURE__ */ new Set(["completed"]), b = f({}), W = (e) => !(b.value[e] ?? S.has(e)), C = (e) => b.value = { ...b.value, [e]: W(e) }, E = be(), O = f(E.tabs[0]);
    se(() => a.open, (e) => {
      e && (O.value = E.tabs[0]);
    });
    const V = Object.fromEntries(E.tabs.filter((e) => e.component).map((e) => [e.key, Se(() => Te(e.component))])), q = r(() => a.row.role === "subagent" || a.row.role === "reviewer"), z = f(!1), H = f(""), j = f(""), U = r(() => a.row.role !== "main" && (!a.row.ended_at || $.value || a.waitReason));
    async function K() {
      if (!U.value) return;
      const e = await E.read(`usage tool --agent ${a.row.id}`);
      H.value = e.ok ? e.value.tool : "", j.value = e.ok ? e.value.note : "";
    }
    const o = E.follow(["hook_call.*", "process_part.*"], K);
    return ke(() => o == null ? void 0 : o()), K(), (e, t) => {
      var i, y, w, k;
      return s(), l("div", {
        class: le(["agent-card", { open: n.open }]),
        "data-agent-open": n.row.id,
        "aria-expanded": n.open,
        role: n.open ? void 0 : "button",
        tabindex: n.open ? void 0 : 0,
        title: n.row.session,
        onClick: t[4] || (t[4] = (c) => !n.open && L("toggle")),
        onKeydown: [
          t[5] || (t[5] = ge(Y((c) => !n.open && L("toggle"), ["self", "prevent"]), ["enter"])),
          t[6] || (t[6] = ge(Y((c) => !n.open && L("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        m("span", Ue, [
          n.open ? (s(), l("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: t[0] || (t[0] = Y((c) => L("toggle"), ["stop"]))
          }, [
            h(u(ue), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : v("", !0),
          m("span", {
            class: "agent-dot",
            "data-state": te.value,
            "data-agent-motion": ""
          }, null, 8, Fe),
          m("span", Me, p(re.value), 1),
          m("span", Pe, p(((i = n.facts) == null ? void 0 : i.given_name) || n.row.id), 1),
          n.open ? v("", !0) : (s(), B(u(ue), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          n.row.ended_at && !$.value ? (s(), B(u(Ae), {
            key: 2,
            class: "agent-time",
            at: n.row.ended_at,
            "data-agent-motion": ""
          }, null, 8, ["at"])) : (s(), l("span", He, p(Z.value), 1))
        ]),
        m("span", Ke, [
          m("span", Ye, p(X.value), 1),
          A.value && !T.value ? (s(), l("span", Ge, p(D.value), 1)) : v("", !0)
        ]),
        T.value ? (s(), l("span", Je, [
          m("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: T.value
          }, p(T.value), 9, Qe),
          A.value ? (s(), l("span", Xe, p(D.value), 1)) : v("", !0)
        ])) : v("", !0),
        !n.open && (U.value || A.value && P.value) ? (s(), l("span", {
          key: 1,
          class: le(["agent-foot", { "agent-work-start": !T.value }]),
          "data-agent-foot": ""
        }, [
          U.value ? (s(), B(we, {
            key: 0,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: $.value,
            command: H.value,
            note: j.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : v("", !0),
          A.value && P.value ? (s(), l("span", Ze, p(P.value), 1)) : v("", !0)
        ], 2)) : v("", !0),
        n.open ? (s(), l("div", {
          key: 2,
          class: "agent-more",
          "data-agent-more": "",
          onClick: t[3] || (t[3] = Y(() => {
          }, ["stop"]))
        }, [
          N.value ? (s(), l("span", et, p(N.value), 1)) : v("", !0),
          U.value ? (s(), B(we, {
            key: 1,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: $.value,
            command: H.value,
            note: j.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : v("", !0),
          q.value ? (s(), l("div", tt, [
            (y = n.facts) != null && y.instruction ? (s(), l("div", at, [
              h(u(pe), {
                label: "Instruction",
                open: z.value,
                "data-agent-section": "instruction",
                onToggle: t[1] || (t[1] = (c) => z.value = !z.value)
              }, {
                default: I(() => [
                  m("div", nt, p(n.facts.instruction), 1)
                ]),
                _: 1
              }, 8, ["open"])
            ])) : v("", !0),
            h(fe, {
              line: `agent transcript ${n.row.id}`,
              padding: "0"
            }, null, 8, ["line"])
          ])) : (s(), l(ne, { key: 3 }, [
            h(u(Ee), {
              class: "agent-tabs",
              active: O.value,
              answer: { tasks: g.value.length },
              onChoose: t[2] || (t[2] = (c) => O.value = c)
            }, null, 8, ["active", "answer"]),
            m("div", {
              class: "agent-tab-body",
              "data-agent-tab-body": (w = O.value) == null ? void 0 : w.key
            }, [
              h(u(Oe), {
                value: (k = O.value) == null ? void 0 : k.key
              }, $e({
                tasks: I(() => {
                  var c;
                  return [
                    g.value.length ? v("", !0) : (s(), B(u(qe), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: I(() => [...t[7] || (t[7] = [
                        ye("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (s(!0), l(ne, null, ie(ae.value, (d) => (s(), B(u(pe), {
                      key: d.state,
                      label: d.label,
                      count: d.tasks.length,
                      open: W(d.state),
                      "data-agent-section": d.state,
                      onToggle: (_) => C(d.state)
                    }, {
                      default: I(() => [
                        (s(!0), l(ne, null, ie(d.tasks, (_) => (s(), l("button", {
                          key: _.id,
                          type: "button",
                          class: "agent-task",
                          "data-agent-delegated": _.id,
                          onClick: (de) => u(he)(`tasks:${_.id}`)
                        }, [
                          h(u(Be), {
                            status: _.state
                          }, null, 8, ["status"]),
                          m("span", lt, p(_.id), 1),
                          m("span", rt, p(_.title), 1)
                        ], 8, st))), 128))
                      ]),
                      _: 2
                    }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
                    (c = n.facts) != null && c.instruction ? (s(), l(ne, { key: 1 }, [
                      t[8] || (t[8] = m("p", { class: "agent-label" }, "Instruction", -1)),
                      m("div", it, p(n.facts.instruction), 1)
                    ], 64)) : v("", !0)
                  ];
                }),
                transcript: I(() => [
                  h(fe, {
                    line: `agent transcript ${n.row.id}`,
                    padding: "0"
                  }, null, 8, ["line"])
                ]),
                _: 2
              }, [
                ie(u(V), (c, d) => ({
                  name: d,
                  fn: I(() => [
                    (s(), B(Ce(c), {
                      agent: n.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ], 8, ot)
          ], 64))
        ])) : v("", !0)
      ], 42, ze);
    };
  }
}, dt = /* @__PURE__ */ ce(ct, [["__scopeId", "data-v-ae816d15"]]), gt = ["data-agent-row"], oe = "cubic-bezier(0.2, 0.9, 0.25, 1)", vt = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(n) {
    const G = [
      { key: "running", label: "Running" },
      { key: "idle", label: "Idle" },
      { key: "retired", label: "Retired" },
      { key: "all", label: "All" }
    ], R = n, { rows: J } = Ie("usage agents --closed", ["agent.*", "task.*"]), { rows: a } = me("waits"), { rows: L } = me("progress"), Q = (o) => L.value.find((e) => e.agent_id === o.id) ?? null, re = (o) => {
      var e;
      return ((e = a.value.find((t) => t.agent_id === o.id)) == null ? void 0 : e.reason) ?? "";
    }, g = f("running"), x = f(""), F = be(), T = f([]), X = f(""), Z = f(!1), ee = f(!1), $ = f(25);
    let te = 0;
    async function N() {
      const o = ++te, e = await F.read(`${R.line} --show ${g.value} --search ${JSON.stringify(x.value)} --limit ${$.value}`);
      o === te && (T.value = e.ok ? e.value.rows : [], X.value = e.ok ? "" : e.error, ee.value = e.ok && e.value.page * e.value.size < e.value.total, Z.value = !0);
    }
    async function M() {
      return $.value += 25, await N(), !0;
    }
    se([g, x], () => {
      $.value = 25, N();
    }), F.follow(["agent.*", "task.*", ...F.sources.flatMap((o) => o.events)], N), N();
    const A = (o) => J.value.find((e) => e.id === o.id) ?? null, D = T, P = r(() => !!x.value.trim()), ae = r(() => R.texts[g.value] ?? { title: R.empty, hint: "" }), S = f(null), b = f(null), W = f(null), C = r(() => D.value.find((o) => o.id === S.value) ?? null), E = r(() => C.value ? [C.value] : D.value), O = r(() => D.value.length - E.value.length), V = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let q = !1, z = 0;
    async function H(o) {
      if (q) return;
      q = !0, z = W.value.scrollTop;
      const e = b.value.querySelector(`[data-agent-open="${o.id}"]`);
      if (!V()) {
        const w = [...b.value.querySelectorAll(".agent-row")].filter((k) => !k.contains(e));
        await Promise.all(w.map((k) => k.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const t = [...e.querySelectorAll(".agent-head, .agent-line")], i = [...t, ...e.querySelectorAll("[data-agent-motion]")], y = i.map((w) => w.getBoundingClientRect());
      if (S.value = o.id, await ve(), !V()) {
        const w = i.map((k) => k.getBoundingClientRect());
        i.forEach((k, c) => {
          const d = t.indexOf(k.parentElement), _ = y[c].left - w[c].left - (d < 0 ? 0 : y[d].left - w[d].left), de = y[c].top - w[c].top - (d < 0 ? 0 : y[d].top - w[d].top);
          k.animate([{ transform: `translate(${_}px, ${de}px)` }, { transform: "none" }], { duration: 280, easing: oe });
        }), b.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((k) => {
          k.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: oe, fill: "backwards" });
        });
      }
      q = !1;
    }
    async function j() {
      if (q || !C.value) return;
      q = !0;
      const o = b.value.querySelector(`[data-agent-open="${S.value}"]`), e = [...o.children, ...b.value.querySelectorAll(".agents-held")], t = V() ? [] : e.map((i) => i.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(t.map((i) => i.finished)), S.value = null, await ve(), W.value.scrollTop = z, t.forEach((i) => i.cancel()), V() || (o.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: oe }), b.value.querySelectorAll(".agent-row").forEach((i) => {
        i.contains(o) || i.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: oe });
      })), q = !1;
    }
    const U = (o) => S.value === o.id ? j() : H(o);
    se(x, (o) => o.trim() && (S.value = null)), se(g, () => {
      S.value = null;
    });
    const K = (o) => {
      o.key === "Escape" && j();
    };
    return window.addEventListener("keydown", K), ke(() => window.removeEventListener("keydown", K)), (o, e) => (s(), l("div", {
      ref_key: "agents",
      ref: b,
      class: le(["agents", { focused: C.value }])
    }, [
      h(u(Ne), {
        modelValue: x.value,
        "onUpdate:modelValue": e[1] || (e[1] = (t) => x.value = t),
        placeholder: "Search agents",
        "data-agents-search": ""
      }, {
        default: I(() => [
          h(u(je), {
            options: G,
            value: g.value,
            onPick: e[0] || (e[0] = (t) => g.value = t)
          }, null, 8, ["value"])
        ]),
        _: 1
      }, 8, ["modelValue"]),
      m("div", {
        ref_key: "list",
        ref: W,
        class: le(["agents-view", { "agents-view-open": C.value }])
      }, [
        h(u(Le), {
          rows: E.value,
          failure: X.value,
          loaded: Z.value,
          more: !C.value && ee.value,
          older: M,
          empty: ae.value.title,
          hint: ae.value.hint,
          searching: P.value
        }, {
          default: I(({ row: t }) => [
            m("div", {
              class: "agent-row",
              "data-agent-row": t.id
            }, [
              h(dt, {
                row: t,
                facts: A(t),
                progress: Q(t),
                "wait-reason": re(t),
                open: t.id === S.value,
                onToggle: (i) => U(t)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, gt)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"])
      ], 2),
      C.value && O.value ? (s(), l("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: j
      }, p(O.value) + " more", 1)) : v("", !0)
    ], 2));
  }
}, wt = /* @__PURE__ */ ce(vt, [["__scopeId", "data-v-e1ce2121"]]);
export {
  wt as A
};
