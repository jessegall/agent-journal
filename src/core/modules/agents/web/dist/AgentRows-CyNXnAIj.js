/* @code-commandments-generated */
import { openBlock as s, createElementBlock as r, withModifiers as Y, unref as u, createTextVNode as ye, toDisplayString as f, createVNode as h, createBlock as O, computed as l, ref as v, watch as se, defineAsyncComponent as Se, onUnmounted as ke, withKeys as ge, normalizeClass as ie, createElementVNode as w, createCommentVNode as m, withCtx as q, Fragment as ne, createSlots as $e, renderList as re, resolveDynamicComponent as Ce, nextTick as ve } from "vue";
import { peekRef as he, Icon as ue, RunningCommand as Re, useNow as _e, age as xe, useWindow as be, loadWindowComponent as Te, TimeAgo as Ae, FoldGroup as pe, InnerTabs as Ee, SwitchCase as Oe, EmptyState as qe, TaskStatusIcon as Be, useRows as Ie, useDeclaredRows as me, SearchBar as Ne, Segmented as je, RowList as Le } from "@journal/window-kit";
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
    return (G, _) => (s(), r("span", De, [
      n.waitReason ? (s(), r("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: _[0] || (_[0] = Y((J) => u(he)("test_queue:0"), ["stop"]))
      }, [
        ye("Waiting: " + f(n.waitReason) + " ", 1),
        h(u(ue), {
          name: "arrow",
          size: 11
        })
      ])) : n.stopped ? (s(), r("span", We, "Waiting")) : (s(), O(u(Re), {
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
}, Ke = ["title"], Ye = { class: "agent-line" }, Ge = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Je = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, Qe = {
  key: 1,
  class: "agent-foot",
  "data-agent-foot": ""
}, Xe = {
  key: 1,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, Ze = {
  key: 0,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, et = {
  key: 2,
  class: "agent-tab-body",
  "data-agent-tab-body": "transcript",
  "data-agent-only-transcript": ""
}, tt = {
  key: 0,
  class: "agent-subagent-brief"
}, at = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, nt = ["data-agent-tab-body"], ot = ["data-agent-delegated", "onClick"], st = { class: "agent-task-number" }, lt = { class: "agent-task-title" }, rt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, it = 36e5, ut = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(n, { emit: G }) {
    const _ = { subagent: "Subagent", reviewer: "Reviewer" }, J = ["started", "blocked", "open", "completed"], a = n, j = G, Q = _e(), le = l(() => {
      var t;
      const e = ((t = a.facts) == null ? void 0 : t.profile) || _[a.row.role] || a.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), g = l(() => {
      var e;
      return ((e = a.facts) == null ? void 0 : e.tasks) ?? [];
    }), x = l(() => a.row.role === "worker"), U = l(() => g.value.filter((e) => e.state === "open")), L = l(() => {
      var e, t;
      return x.value && (((e = a.facts) == null ? void 0 : e.task_title) || ((t = U.value[0]) == null ? void 0 : t.title)) || "";
    }), X = l(() => {
      var e, t;
      return [a.row.program, (e = a.facts) == null ? void 0 : e.model, (t = a.facts) == null ? void 0 : t.effort, a.row.role === "main" ? "" : a.progress ? `${a.row.role} ${a.row.id}` : a.row.role].filter(Boolean).join(" · ");
    }), Z = l(() => xe(a.row.process_started_at || a.row.created_at, Q.value)), ee = /* @__PURE__ */ new Set(["open", "started", "testing"]), $ = l(() => !!a.row.ended_at && a.row.role !== "main" && g.value.some((e) => ee.has(e.state))), te = l(() => {
      var e;
      return a.waitReason || $.value ? "waiting" : a.row.state === "running" && ((e = a.facts) == null ? void 0 : e.state) || a.row.state;
    }), B = l(() => {
      var t, i, y;
      const e = [];
      return ((t = a.facts) == null ? void 0 : t.context_percent) !== null && ((i = a.facts) == null ? void 0 : i.context_percent) !== void 0 && e.push(`Context: ${a.facts.context_percent}%`), (y = a.facts) != null && y.cost_dollars && e.push(`$${a.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), F = l(() => {
      var e;
      return ((e = a.progress) == null ? void 0 : e.completed_count) ?? g.value.filter((t) => t.state === "completed").length;
    }), I = l(() => {
      var e;
      return ((e = a.progress) == null ? void 0 : e.task_count) ?? g.value.length;
    }), M = l(() => `${F.value} of ${I.value} ${I.value === 1 ? "task" : "tasks"}`), P = l(() => {
      var p;
      const e = Date.parse(((p = a.progress) == null ? void 0 : p.started_at) || a.row.created_at), t = a.progress ? a.progress.finished_at : a.row.ended_at, y = ((t ? Date.parse(t) : Q.value) - e) / it;
      return a.row.role !== "main" && y > 0 && F.value ? `${Math.round(F.value / y)} per hour` : "";
    }), ae = l(() => g.value.length ? J.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: g.value.filter((t) => t.state === e || e === "started" && t.state === "testing" || e === "completed" && t.state === "cancelled") })) : []), S = /* @__PURE__ */ new Set(["completed"]), b = v({}), D = (e) => !(b.value[e] ?? S.has(e)), C = (e) => b.value = { ...b.value, [e]: D(e) }, T = be(), A = v(T.tabs[0]);
    se(() => a.open, (e) => {
      e && (A.value = T.tabs[0]);
    });
    const W = Object.fromEntries(T.tabs.filter((e) => e.component).map((e) => [e.key, Se(() => Te(e.component))])), E = l(() => a.row.role === "subagent" || a.row.role === "reviewer"), V = v(!1), H = v(""), N = v(""), z = l(() => a.row.role !== "main" && (!a.row.ended_at || $.value || a.waitReason));
    async function K() {
      if (!z.value) return;
      const e = await T.read(`usage tool --agent ${a.row.id}`);
      H.value = e.ok ? e.value.tool : "", N.value = e.ok ? e.value.note : "";
    }
    const o = T.follow(["hook_call.*", "process_part.*"], K);
    return ke(() => o == null ? void 0 : o()), K(), (e, t) => {
      var i, y, p, k;
      return s(), r("div", {
        class: ie(["agent-card", { open: n.open }]),
        "data-agent-open": n.row.id,
        "aria-expanded": n.open,
        role: n.open ? void 0 : "button",
        tabindex: n.open ? void 0 : 0,
        title: n.row.session,
        onClick: t[4] || (t[4] = (c) => !n.open && j("toggle")),
        onKeydown: [
          t[5] || (t[5] = ge(Y((c) => !n.open && j("toggle"), ["self", "prevent"]), ["enter"])),
          t[6] || (t[6] = ge(Y((c) => !n.open && j("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        w("span", Ue, [
          n.open ? (s(), r("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: t[0] || (t[0] = Y((c) => j("toggle"), ["stop"]))
          }, [
            h(u(ue), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : m("", !0),
          w("span", {
            class: "agent-dot",
            "data-state": te.value,
            "data-agent-motion": ""
          }, null, 8, Fe),
          w("span", Me, f(le.value), 1),
          w("span", Pe, f(((i = n.facts) == null ? void 0 : i.given_name) || n.row.id), 1),
          n.open ? m("", !0) : (s(), O(u(ue), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          n.row.ended_at && !$.value ? (s(), O(u(Ae), {
            key: 2,
            class: "agent-time",
            at: n.row.ended_at,
            "data-agent-motion": ""
          }, null, 8, ["at"])) : (s(), r("span", He, f(Z.value), 1))
        ]),
        L.value ? (s(), r("span", {
          key: 0,
          class: "agent-job",
          "data-agent-job": "",
          title: L.value
        }, f(L.value), 9, Ke)) : m("", !0),
        w("span", Ye, [
          w("span", Ge, f(X.value), 1),
          I.value ? (s(), r("span", Je, f(M.value), 1)) : m("", !0)
        ]),
        z.value && !n.open || I.value && P.value ? (s(), r("span", Qe, [
          z.value && !n.open ? (s(), O(we, {
            key: 0,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: $.value,
            command: H.value,
            note: N.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0),
          I.value && P.value ? (s(), r("span", Xe, f(P.value), 1)) : m("", !0)
        ])) : m("", !0),
        n.open ? (s(), r("div", {
          key: 2,
          class: "agent-more",
          "data-agent-more": "",
          onClick: t[3] || (t[3] = Y(() => {
          }, ["stop"]))
        }, [
          B.value ? (s(), r("span", Ze, f(B.value), 1)) : m("", !0),
          z.value ? (s(), O(we, {
            key: 1,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: $.value,
            command: H.value,
            note: N.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : m("", !0),
          E.value ? (s(), r("div", et, [
            (y = n.facts) != null && y.instruction ? (s(), r("div", tt, [
              h(u(pe), {
                label: "Instruction",
                open: V.value,
                "data-agent-section": "instruction",
                onToggle: t[1] || (t[1] = (c) => V.value = !V.value)
              }, {
                default: q(() => [
                  w("div", at, f(n.facts.instruction), 1)
                ]),
                _: 1
              }, 8, ["open"])
            ])) : m("", !0),
            h(fe, {
              line: `agent transcript ${n.row.id}`,
              padding: "0"
            }, null, 8, ["line"])
          ])) : (s(), r(ne, { key: 3 }, [
            h(u(Ee), {
              class: "agent-tabs",
              active: A.value,
              answer: { tasks: g.value.length },
              onChoose: t[2] || (t[2] = (c) => A.value = c)
            }, null, 8, ["active", "answer"]),
            w("div", {
              class: "agent-tab-body",
              "data-agent-tab-body": (p = A.value) == null ? void 0 : p.key
            }, [
              h(u(Oe), {
                value: (k = A.value) == null ? void 0 : k.key
              }, $e({
                tasks: q(() => {
                  var c;
                  return [
                    g.value.length ? m("", !0) : (s(), O(u(qe), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: q(() => [...t[7] || (t[7] = [
                        ye("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (s(!0), r(ne, null, re(ae.value, (d) => (s(), O(u(pe), {
                      key: d.state,
                      label: d.label,
                      count: d.tasks.length,
                      open: D(d.state),
                      "data-agent-section": d.state,
                      onToggle: (R) => C(d.state)
                    }, {
                      default: q(() => [
                        (s(!0), r(ne, null, re(d.tasks, (R) => (s(), r("button", {
                          key: R.id,
                          type: "button",
                          class: "agent-task",
                          "data-agent-delegated": R.id,
                          onClick: (de) => u(he)(`tasks:${R.id}`)
                        }, [
                          h(u(Be), {
                            status: R.state
                          }, null, 8, ["status"]),
                          w("span", st, f(R.id), 1),
                          w("span", lt, f(R.title), 1)
                        ], 8, ot))), 128))
                      ]),
                      _: 2
                    }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
                    (c = n.facts) != null && c.instruction ? (s(), r(ne, { key: 1 }, [
                      t[8] || (t[8] = w("p", { class: "agent-label" }, "Instruction", -1)),
                      w("div", rt, f(n.facts.instruction), 1)
                    ], 64)) : m("", !0)
                  ];
                }),
                transcript: q(() => [
                  h(fe, {
                    line: `agent transcript ${n.row.id}`,
                    padding: "0"
                  }, null, 8, ["line"])
                ]),
                _: 2
              }, [
                re(u(W), (c, d) => ({
                  name: d,
                  fn: q(() => [
                    (s(), O(Ce(c), {
                      agent: n.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ], 8, nt)
          ], 64))
        ])) : m("", !0)
      ], 42, ze);
    };
  }
}, ct = /* @__PURE__ */ ce(ut, [["__scopeId", "data-v-2d464ad1"]]), dt = ["data-agent-row"], oe = "cubic-bezier(0.2, 0.9, 0.25, 1)", gt = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(n) {
    const G = [
      { key: "running", label: "Running" },
      { key: "idle", label: "Idle" },
      { key: "retired", label: "Retired" },
      { key: "all", label: "All" }
    ], _ = n, { rows: J } = Ie("usage agents --closed", ["agent.*", "task.*"]), { rows: a } = me("waits"), { rows: j } = me("progress"), Q = (o) => j.value.find((e) => e.agent_id === o.id) ?? null, le = (o) => {
      var e;
      return ((e = a.value.find((t) => t.agent_id === o.id)) == null ? void 0 : e.reason) ?? "";
    }, g = v("running"), x = v(""), U = be(), L = v([]), X = v(""), Z = v(!1), ee = v(!1), $ = v(25);
    let te = 0;
    async function B() {
      const o = ++te, e = await U.read(`${_.line} --show ${g.value} --search ${JSON.stringify(x.value)} --limit ${$.value}`);
      o === te && (L.value = e.ok ? e.value.rows : [], X.value = e.ok ? "" : e.error, ee.value = e.ok && e.value.page * e.value.size < e.value.total, Z.value = !0);
    }
    async function F() {
      return $.value += 25, await B(), !0;
    }
    se([g, x], () => {
      $.value = 25, B();
    }), U.follow(["agent.*", "task.*", ...U.sources.flatMap((o) => o.events)], B), B();
    const I = (o) => J.value.find((e) => e.id === o.id) ?? null, M = L, P = l(() => !!x.value.trim()), ae = l(() => _.texts[g.value] ?? { title: _.empty, hint: "" }), S = v(null), b = v(null), D = v(null), C = l(() => M.value.find((o) => o.id === S.value) ?? null), T = l(() => C.value ? [C.value] : M.value), A = l(() => M.value.length - T.value.length), W = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let E = !1, V = 0;
    async function H(o) {
      if (E) return;
      E = !0, V = D.value.scrollTop;
      const e = b.value.querySelector(`[data-agent-open="${o.id}"]`);
      if (!W()) {
        const p = [...b.value.querySelectorAll(".agent-row")].filter((k) => !k.contains(e));
        await Promise.all(p.map((k) => k.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const t = [...e.querySelectorAll(".agent-head, .agent-line")], i = [...t, ...e.querySelectorAll("[data-agent-motion]")], y = i.map((p) => p.getBoundingClientRect());
      if (S.value = o.id, await ve(), !W()) {
        const p = i.map((k) => k.getBoundingClientRect());
        i.forEach((k, c) => {
          const d = t.indexOf(k.parentElement), R = y[c].left - p[c].left - (d < 0 ? 0 : y[d].left - p[d].left), de = y[c].top - p[c].top - (d < 0 ? 0 : y[d].top - p[d].top);
          k.animate([{ transform: `translate(${R}px, ${de}px)` }, { transform: "none" }], { duration: 280, easing: oe });
        }), b.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((k) => {
          k.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: oe, fill: "backwards" });
        });
      }
      E = !1;
    }
    async function N() {
      if (E || !C.value) return;
      E = !0;
      const o = b.value.querySelector(`[data-agent-open="${S.value}"]`), e = [...o.children, ...b.value.querySelectorAll(".agents-held")], t = W() ? [] : e.map((i) => i.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(t.map((i) => i.finished)), S.value = null, await ve(), D.value.scrollTop = V, t.forEach((i) => i.cancel()), W() || (o.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: oe }), b.value.querySelectorAll(".agent-row").forEach((i) => {
        i.contains(o) || i.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: oe });
      })), E = !1;
    }
    const z = (o) => S.value === o.id ? N() : H(o);
    se(x, (o) => o.trim() && (S.value = null)), se(g, () => {
      S.value = null;
    });
    const K = (o) => {
      o.key === "Escape" && N();
    };
    return window.addEventListener("keydown", K), ke(() => window.removeEventListener("keydown", K)), (o, e) => (s(), r("div", {
      ref_key: "agents",
      ref: b,
      class: ie(["agents", { focused: C.value }])
    }, [
      h(u(Ne), {
        modelValue: x.value,
        "onUpdate:modelValue": e[1] || (e[1] = (t) => x.value = t),
        placeholder: "Search agents",
        "data-agents-search": ""
      }, {
        default: q(() => [
          h(u(je), {
            options: G,
            value: g.value,
            onPick: e[0] || (e[0] = (t) => g.value = t)
          }, null, 8, ["value"])
        ]),
        _: 1
      }, 8, ["modelValue"]),
      w("div", {
        ref_key: "list",
        ref: D,
        class: ie(["agents-view", { "agents-view-open": C.value }])
      }, [
        h(u(Le), {
          rows: T.value,
          failure: X.value,
          loaded: Z.value,
          more: !C.value && ee.value,
          older: F,
          empty: ae.value.title,
          hint: ae.value.hint,
          searching: P.value
        }, {
          default: q(({ row: t }) => [
            w("div", {
              class: "agent-row",
              "data-agent-row": t.id
            }, [
              h(ct, {
                row: t,
                facts: I(t),
                progress: Q(t),
                "wait-reason": le(t),
                open: t.id === S.value,
                onToggle: (i) => z(t)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, dt)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"])
      ], 2),
      C.value && A.value ? (s(), r("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: N
      }, f(A.value) + " more", 1)) : m("", !0)
    ], 2));
  }
}, ft = /* @__PURE__ */ ce(gt, [["__scopeId", "data-v-e1ce2121"]]);
export {
  ft as A
};
