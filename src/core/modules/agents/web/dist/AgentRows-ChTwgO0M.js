/* @code-commandments-generated */
import { openBlock as s, createElementBlock as l, withModifiers as M, unref as u, createTextVNode as ye, toDisplayString as p, createVNode as y, createBlock as B, computed as r, ref as f, watch as se, defineAsyncComponent as Se, onUnmounted as ke, withKeys as ge, normalizeClass as le, createElementVNode as m, createCommentVNode as v, withCtx as I, Fragment as ne, createSlots as $e, renderList as ie, resolveDynamicComponent as Ce, nextTick as ve } from "vue";
import { peekRef as he, Icon as ue, RunningCommand as _e, useNow as xe, age as Te, perHour as Re, useWindow as be, loadWindowComponent as Ae, TimeAgo as Ee, FoldGroup as pe, InnerTabs as qe, SwitchCase as Oe, EmptyState as Be, TaskStatusIcon as Ie, useRows as Ne, useDeclaredRows as me, SearchBar as je, Segmented as Le, RowList as We } from "@journal/window-kit";
import { _ as ce, T as fe } from "./TranscriptRows-CjXeMFF-.js";
const Ve = {
  class: "agent-command",
  "data-agent-command": ""
}, ze = {
  key: 1,
  "data-agent-stopped": ""
}, De = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(n) {
    return (Y, x) => (s(), l("span", Ve, [
      n.waitReason ? (s(), l("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: x[0] || (x[0] = M((G) => u(he)("test_queue:0"), ["stop"]))
      }, [
        ye("Waiting: " + p(n.waitReason) + " ", 1),
        y(u(ue), {
          name: "arrow",
          size: 11
        })
      ])) : n.stopped ? (s(), l("span", ze, "Waiting")) : (s(), B(u(_e), {
        key: 2,
        text: n.command,
        idle: n.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, we = /* @__PURE__ */ ce(De, [["__scopeId", "data-v-70734c30"]]), Fe = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], Ue = { class: "agent-head" }, He = ["data-state"], Ke = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, Pe = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, Me = {
  key: 3,
  class: "agent-time",
  "data-agent-motion": ""
}, Ye = { class: "agent-line" }, Ge = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, Je = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, Qe = {
  key: 0,
  class: "agent-line agent-work-start"
}, Xe = ["title"], Ze = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, et = {
  key: 1,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, tt = {
  key: 0,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, at = {
  key: 2,
  class: "agent-tab-body",
  "data-agent-tab-body": "transcript",
  "data-agent-only-transcript": ""
}, nt = {
  key: 0,
  class: "agent-subagent-brief"
}, ot = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, st = ["data-agent-tab-body"], lt = ["data-agent-delegated", "onClick"], rt = { class: "agent-task-number" }, it = { class: "agent-task-title" }, ut = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ct = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(n, { emit: Y }) {
    const x = { subagent: "Subagent", reviewer: "Reviewer" }, G = ["started", "blocked", "open", "completed"], a = n, L = Y, J = xe(), re = r(() => {
      var t;
      const e = ((t = a.facts) == null ? void 0 : t.profile) || x[a.row.role] || a.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), g = r(() => {
      var e;
      return ((e = a.facts) == null ? void 0 : e.tasks) ?? [];
    }), T = r(() => a.row.role === "worker"), U = r(() => g.value.filter((e) => e.state === "open")), R = r(() => {
      var e, t;
      return T.value && (((e = a.facts) == null ? void 0 : e.task_title) || ((t = U.value[0]) == null ? void 0 : t.title)) || "";
    }), Q = r(() => {
      var e, t;
      return [a.row.program, (e = a.facts) == null ? void 0 : e.model, (t = a.facts) == null ? void 0 : t.effort, a.row.role === "main" ? "" : a.progress ? `${a.row.role} ${a.row.id}` : a.row.role].filter(Boolean).join(" · ");
    }), X = r(() => Te(a.row.process_started_at || a.row.created_at, J.value)), Z = /* @__PURE__ */ new Set(["open", "started", "testing"]), $ = r(() => !!a.row.ended_at && a.row.role !== "main" && g.value.some((e) => Z.has(e.state))), ee = r(() => {
      var e;
      return a.waitReason || $.value ? "waiting" : a.row.state === "running" && ((e = a.facts) == null ? void 0 : e.state) || a.row.state;
    }), N = r(() => {
      var t, i, S;
      const e = [];
      return ((t = a.facts) == null ? void 0 : t.context_percent) !== null && ((i = a.facts) == null ? void 0 : i.context_percent) !== void 0 && e.push(`Context: ${a.facts.context_percent}%`), (S = a.facts) != null && S.cost_dollars && e.push(`$${a.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), te = r(() => {
      var e;
      return ((e = a.progress) == null ? void 0 : e.completed_count) ?? g.value.filter((t) => t.state === "completed").length;
    }), A = r(() => {
      var e;
      return ((e = a.progress) == null ? void 0 : e.task_count) ?? g.value.length;
    }), W = r(() => `${te.value} of ${A.value} ${A.value === 1 ? "task" : "tasks"}`), H = r(() => {
      var t;
      const e = Re(te.value, ((t = a.progress) == null ? void 0 : t.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, J.value);
      return a.row.role !== "main" && e ? `${e} per hour` : "";
    }), ae = r(() => g.value.length ? G.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: g.value.filter((t) => t.state === e || e === "started" && t.state === "testing" || e === "completed" && t.state === "cancelled") })) : []), b = /* @__PURE__ */ new Set(["completed"]), k = f({}), V = (e) => !(k.value[e] ?? b.has(e)), C = (e) => k.value = { ...k.value, [e]: V(e) }, E = be(), q = f(E.tabs[0]);
    se(() => a.open, (e) => {
      e && (q.value = E.tabs[0]);
    });
    const z = Object.fromEntries(E.tabs.filter((e) => e.component).map((e) => [e.key, Se(() => Ae(e.component))])), O = r(() => a.row.role === "subagent" || a.row.role === "reviewer"), D = f(!1), K = f(""), j = f(""), F = r(() => a.row.role !== "main" && (!a.row.ended_at || $.value || a.waitReason));
    async function P() {
      if (!F.value) return;
      const e = await E.read(`usage tool --agent ${a.row.id}`);
      K.value = e.ok ? e.value.tool : "", j.value = e.ok ? e.value.note : "";
    }
    const o = E.follow(["hook_call.*", "process_part.*"], P);
    return ke(() => o == null ? void 0 : o()), P(), (e, t) => {
      var i, S, h, w;
      return s(), l("div", {
        class: le(["agent-card", { open: n.open }]),
        "data-agent-open": n.row.id,
        "aria-expanded": n.open,
        role: n.open ? void 0 : "button",
        tabindex: n.open ? void 0 : 0,
        title: n.row.session,
        onClick: t[4] || (t[4] = (c) => !n.open && L("toggle")),
        onKeydown: [
          t[5] || (t[5] = ge(M((c) => !n.open && L("toggle"), ["self", "prevent"]), ["enter"])),
          t[6] || (t[6] = ge(M((c) => !n.open && L("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        m("span", Ue, [
          n.open ? (s(), l("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: t[0] || (t[0] = M((c) => L("toggle"), ["stop"]))
          }, [
            y(u(ue), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : v("", !0),
          m("span", {
            class: "agent-dot",
            "data-state": ee.value,
            "data-agent-motion": ""
          }, null, 8, He),
          m("span", Ke, p(re.value), 1),
          m("span", Pe, p(((i = n.facts) == null ? void 0 : i.given_name) || n.row.id), 1),
          n.open ? v("", !0) : (s(), B(u(ue), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          n.row.ended_at && !$.value ? (s(), B(u(Ee), {
            key: 2,
            class: "agent-time",
            at: n.row.ended_at,
            "data-agent-motion": ""
          }, null, 8, ["at"])) : (s(), l("span", Me, p(X.value), 1))
        ]),
        m("span", Ye, [
          m("span", Ge, p(Q.value), 1),
          A.value && !R.value ? (s(), l("span", Je, p(W.value), 1)) : v("", !0)
        ]),
        R.value ? (s(), l("span", Qe, [
          m("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: R.value
          }, p(R.value), 9, Xe),
          A.value ? (s(), l("span", Ze, p(W.value), 1)) : v("", !0)
        ])) : v("", !0),
        !n.open && (F.value || A.value && H.value) ? (s(), l("span", {
          key: 1,
          class: le(["agent-foot", { "agent-work-start": !R.value }]),
          "data-agent-foot": ""
        }, [
          F.value ? (s(), B(we, {
            key: 0,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: $.value,
            command: K.value,
            note: j.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : v("", !0),
          A.value && H.value ? (s(), l("span", et, p(H.value), 1)) : v("", !0)
        ], 2)) : v("", !0),
        n.open ? (s(), l("div", {
          key: 2,
          class: "agent-more",
          "data-agent-more": "",
          onClick: t[3] || (t[3] = M(() => {
          }, ["stop"]))
        }, [
          N.value ? (s(), l("span", tt, p(N.value), 1)) : v("", !0),
          F.value ? (s(), B(we, {
            key: 1,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: $.value,
            command: K.value,
            note: j.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : v("", !0),
          O.value ? (s(), l("div", at, [
            (S = n.facts) != null && S.instruction ? (s(), l("div", nt, [
              y(u(pe), {
                label: "Instruction",
                open: D.value,
                "data-agent-section": "instruction",
                onToggle: t[1] || (t[1] = (c) => D.value = !D.value)
              }, {
                default: I(() => [
                  m("div", ot, p(n.facts.instruction), 1)
                ]),
                _: 1
              }, 8, ["open"])
            ])) : v("", !0),
            y(fe, {
              line: `agent transcript ${n.row.id}`,
              padding: "0"
            }, null, 8, ["line"])
          ])) : (s(), l(ne, { key: 3 }, [
            y(u(qe), {
              class: "agent-tabs",
              active: q.value,
              answer: { tasks: g.value.length },
              onChoose: t[2] || (t[2] = (c) => q.value = c)
            }, null, 8, ["active", "answer"]),
            m("div", {
              class: "agent-tab-body",
              "data-agent-tab-body": (h = q.value) == null ? void 0 : h.key
            }, [
              y(u(Oe), {
                value: (w = q.value) == null ? void 0 : w.key
              }, $e({
                tasks: I(() => {
                  var c;
                  return [
                    g.value.length ? v("", !0) : (s(), B(u(Be), {
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
                      open: V(d.state),
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
                          y(u(Ie), {
                            status: _.state
                          }, null, 8, ["status"]),
                          m("span", rt, p(_.id), 1),
                          m("span", it, p(_.title), 1)
                        ], 8, lt))), 128))
                      ]),
                      _: 2
                    }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
                    (c = n.facts) != null && c.instruction ? (s(), l(ne, { key: 1 }, [
                      t[8] || (t[8] = m("p", { class: "agent-label" }, "Instruction", -1)),
                      m("div", ut, p(n.facts.instruction), 1)
                    ], 64)) : v("", !0)
                  ];
                }),
                transcript: I(() => [
                  y(fe, {
                    line: `agent transcript ${n.row.id}`,
                    padding: "0"
                  }, null, 8, ["line"])
                ]),
                _: 2
              }, [
                ie(u(z), (c, d) => ({
                  name: d,
                  fn: I(() => [
                    (s(), B(Ce(c), {
                      agent: n.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ], 8, st)
          ], 64))
        ])) : v("", !0)
      ], 42, Fe);
    };
  }
}, dt = /* @__PURE__ */ ce(ct, [["__scopeId", "data-v-94b69456"]]), gt = ["data-agent-row"], oe = "cubic-bezier(0.2, 0.9, 0.25, 1)", vt = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(n) {
    const Y = [
      { key: "running", label: "Running" },
      { key: "idle", label: "Idle" },
      { key: "retired", label: "Retired" },
      { key: "all", label: "All" }
    ], x = n, { rows: G } = Ne("usage agents --closed", ["agent.*", "task.*"]), { rows: a } = me("waits"), { rows: L } = me("progress"), J = (o) => L.value.find((e) => e.agent_id === o.id) ?? null, re = (o) => {
      var e;
      return ((e = a.value.find((t) => t.agent_id === o.id)) == null ? void 0 : e.reason) ?? "";
    }, g = f("running"), T = f(""), U = be(), R = f([]), Q = f(""), X = f(!1), Z = f(!1), $ = f(25);
    let ee = 0;
    async function N() {
      const o = ++ee, e = await U.read(`${x.line} --show ${g.value} --search ${JSON.stringify(T.value)} --limit ${$.value}`);
      o === ee && (R.value = e.ok ? e.value.rows : [], Q.value = e.ok ? "" : e.error, Z.value = e.ok && e.value.page * e.value.size < e.value.total, X.value = !0);
    }
    async function te() {
      return $.value += 25, await N(), !0;
    }
    se([g, T], () => {
      $.value = 25, N();
    }), U.follow(["agent.*", "task.*", ...U.sources.flatMap((o) => o.events)], N), N();
    const A = (o) => G.value.find((e) => e.id === o.id) ?? null, W = R, H = r(() => !!T.value.trim()), ae = r(() => x.texts[g.value] ?? { title: x.empty, hint: "" }), b = f(null), k = f(null), V = f(null), C = r(() => W.value.find((o) => o.id === b.value) ?? null), E = r(() => C.value ? [C.value] : W.value), q = r(() => W.value.length - E.value.length), z = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let O = !1, D = 0;
    async function K(o) {
      if (O) return;
      O = !0, D = V.value.scrollTop;
      const e = k.value.querySelector(`[data-agent-open="${o.id}"]`);
      if (!z()) {
        const h = [...k.value.querySelectorAll(".agent-row")].filter((w) => !w.contains(e));
        await Promise.all(h.map((w) => w.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const t = [...e.querySelectorAll(".agent-head, .agent-line")], i = [...t, ...e.querySelectorAll("[data-agent-motion]")], S = i.map((h) => h.getBoundingClientRect());
      if (b.value = o.id, await ve(), !z()) {
        const h = i.map((w) => w.getBoundingClientRect());
        i.forEach((w, c) => {
          const d = t.indexOf(w.parentElement), _ = S[c].left - h[c].left - (d < 0 ? 0 : S[d].left - h[d].left), de = S[c].top - h[c].top - (d < 0 ? 0 : S[d].top - h[d].top);
          w.animate([{ transform: `translate(${_}px, ${de}px)` }, { transform: "none" }], { duration: 280, easing: oe });
        }), k.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((w) => {
          w.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: oe, fill: "backwards" });
        });
      }
      O = !1;
    }
    async function j() {
      if (O || !C.value) return;
      O = !0;
      const o = k.value.querySelector(`[data-agent-open="${b.value}"]`), e = [...o.children, ...k.value.querySelectorAll(".agents-held")], t = z() ? [] : e.map((i) => i.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(t.map((i) => i.finished)), b.value = null, await ve(), V.value.scrollTop = D, t.forEach((i) => i.cancel()), z() || (o.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: oe }), k.value.querySelectorAll(".agent-row").forEach((i) => {
        i.contains(o) || i.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: oe });
      })), O = !1;
    }
    const F = (o) => b.value === o.id ? j() : K(o);
    se(T, (o) => o.trim() && (b.value = null)), se(g, () => {
      b.value = null;
    });
    const P = (o) => {
      o.key === "Escape" && j();
    };
    return window.addEventListener("keydown", P), ke(() => window.removeEventListener("keydown", P)), (o, e) => (s(), l("div", {
      ref_key: "agents",
      ref: k,
      class: le(["agents", { focused: C.value }])
    }, [
      y(u(je), {
        modelValue: T.value,
        "onUpdate:modelValue": e[1] || (e[1] = (t) => T.value = t),
        placeholder: "Search agents",
        "data-agents-search": ""
      }, {
        default: I(() => [
          y(u(Le), {
            options: Y,
            value: g.value,
            onPick: e[0] || (e[0] = (t) => g.value = t)
          }, null, 8, ["value"])
        ]),
        _: 1
      }, 8, ["modelValue"]),
      m("div", {
        ref_key: "list",
        ref: V,
        class: le(["agents-view", { "agents-view-open": C.value }])
      }, [
        y(u(We), {
          rows: E.value,
          failure: Q.value,
          loaded: X.value,
          more: !C.value && Z.value,
          older: te,
          empty: ae.value.title,
          hint: ae.value.hint,
          searching: H.value
        }, {
          default: I(({ row: t }) => [
            m("div", {
              class: "agent-row",
              "data-agent-row": t.id
            }, [
              y(dt, {
                row: t,
                facts: A(t),
                progress: J(t),
                "wait-reason": re(t),
                open: t.id === b.value,
                onToggle: (i) => F(t)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, gt)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"])
      ], 2),
      C.value && q.value ? (s(), l("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: j
      }, p(q.value) + " more", 1)) : v("", !0)
    ], 2));
  }
}, wt = /* @__PURE__ */ ce(vt, [["__scopeId", "data-v-e1ce2121"]]);
export {
  wt as A
};
