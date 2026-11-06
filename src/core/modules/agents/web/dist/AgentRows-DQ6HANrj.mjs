/* @code-commandments-generated */
import { openBlock as o, createElementBlock as r, withModifiers as Q, unref as d, createTextVNode as le, toDisplayString as p, createVNode as h, createBlock as C, withCtx as R, Fragment as re, renderList as ge, createElementVNode as f, createCommentVNode as u, computed as i, ref as y, watch as ie, defineAsyncComponent as _e, onUnmounted as ke, withKeys as pe, normalizeClass as ce, createSlots as Se, resolveDynamicComponent as Te, nextTick as me } from "vue";
import { peekRef as he, Icon as ve, RunningCommand as Ce, FoldGroup as be, TaskStatusIcon as Re, useNow as xe, age as Ae, perHour as Ee, useWindow as $e, loadWindowComponent as Oe, TimeAgo as fe, Btn as qe, InnerTabs as Be, TabBody as je, SwitchCase as Ie, EmptyState as Ne, useRows as Le, useDeclaredRows as we, SearchBar as We, Segmented as De, RowList as He } from "@journal/window-kit";
import { _ as ue, T as Pe } from "./TranscriptRows-DCpyNUhv.mjs";
const Ve = {
  class: "agent-command",
  "data-agent-command": ""
}, ze = {
  key: 1,
  "data-agent-stopped": ""
}, Ue = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(n) {
    return (H, $) => (o(), r("span", Ve, [
      n.waitReason ? (o(), r("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: $[0] || ($[0] = Q((U) => d(he)("test_queue:0"), ["stop"]))
      }, [
        le("Waiting: " + p(n.waitReason) + " ", 1),
        h(d(ve), {
          name: "arrow",
          size: 11
        })
      ])) : n.stopped ? (o(), r("span", ze, "Waiting")) : (o(), C(d(Ce), {
        key: 2,
        text: n.command,
        idle: n.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, ye = /* @__PURE__ */ ue(Ue, [["__scopeId", "data-v-bb905922"]]), Fe = ["data-agent-delegated", "onClick"], Ke = { class: "agent-task-number" }, Ge = { class: "agent-task-title" }, Me = ["title"], Ye = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(n, { emit: H }) {
    const $ = H;
    return (U, a) => (o(), C(d(be), {
      label: n.section.label,
      count: n.section.tasks.length,
      open: n.open,
      "data-agent-section": n.section.state,
      onToggle: a[0] || (a[0] = (g) => $("toggle"))
    }, {
      default: R(() => [
        (o(!0), r(re, null, ge(n.section.tasks, (g) => (o(), r("button", {
          key: g.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": g.id,
          onClick: (F) => d(he)(`tasks:${g.id}`)
        }, [
          h(d(Re), {
            status: g.state
          }, null, 8, ["status"]),
          f("span", Ke, p(g.id), 1),
          f("span", Ge, p(g.title), 1),
          g.plan_id ? (o(), r("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${g.plan_id}: ${g.plan_title}`
          }, "Plan " + p(g.plan_id) + ": " + p(g.plan_title), 9, Me)) : u("", !0)
        ], 8, Fe))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Je = /* @__PURE__ */ ue(Ye, [["__scopeId", "data-v-acc154a9"]]), Qe = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], Xe = { class: "agent-head" }, Ze = ["data-state"], et = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, tt = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, at = { class: "agent-times" }, nt = {
  key: 1,
  class: "agent-time",
  "data-agent-motion": ""
}, ot = {
  key: 2,
  class: "agent-last-heard",
  "data-agent-last-heard": ""
}, st = { class: "agent-line" }, lt = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, rt = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, it = {
  key: 0,
  class: "agent-line agent-work-start"
}, ct = ["title"], ut = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, dt = {
  key: 1,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, gt = {
  key: 0,
  class: "agent-usage-band"
}, vt = {
  class: "agent-usage",
  "data-agent-card-usage": ""
}, pt = {
  key: 2,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, mt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ft = {
  key: 0,
  class: "agent-helper-brief"
}, wt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, yt = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, kt = "It ended without a report", ht = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(n, { emit: H }) {
    const $ = { helper: "Helper", reviewer: "Reviewer" }, U = ["started", "blocked", "open", "completed"], a = n, g = H, F = xe(), de = i(() => {
      var t;
      const e = ((t = a.facts) == null ? void 0 : t.profile) || $[a.row.role] || a.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), w = i(() => {
      var e;
      return ((e = a.facts) == null ? void 0 : e.tasks) ?? [];
    }), j = i(() => w.value.filter((e) => e.state === "open")), x = i(() => {
      var e, t, v;
      return (e = a.facts) != null && e.job_enabled && (((t = a.facts) == null ? void 0 : t.task_title) || ((v = j.value[0]) == null ? void 0 : v.title)) || "";
    }), X = i(() => {
      var e, t;
      return [a.row.program, (e = a.facts) == null ? void 0 : e.model, (t = a.facts) == null ? void 0 : t.effort, a.row.role === "main" ? "" : a.progress ? `${a.row.role} ${a.row.id}` : a.row.role, a.row.access === "read-only" ? "Access: Read-only" : ""].filter(Boolean).join(" · ");
    }), K = i(() => {
      var e, t;
      return a.row.ended_at && ((t = (e = a.facts) == null ? void 0 : e.job_returned) != null && t.startsWith(kt)) ? a.facts.job_returned : "";
    }), Z = i(() => Ae(a.row.process_started_at || a.row.created_at, F.value)), ee = /* @__PURE__ */ new Set(["open", "started", "testing"]), A = i(() => !!a.row.ended_at && a.row.role !== "main" && w.value.some((e) => ee.has(e.state))), te = i(() => {
      var e;
      return a.waitReason || A.value ? "waiting" : a.row.state === "running" && ((e = a.facts) == null ? void 0 : e.state) || a.row.state;
    }), L = i(() => {
      var t, v, S;
      const e = [];
      return ((t = a.facts) == null ? void 0 : t.context_percent) !== null && ((v = a.facts) == null ? void 0 : v.context_percent) !== void 0 && e.push(`Context: ${a.facts.context_percent}%`), (S = a.facts) != null && S.cost_dollars && e.push(`$${a.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), ae = i(() => {
      var e;
      return ((e = a.progress) == null ? void 0 : e.completed_count) ?? w.value.filter((t) => t.state === "completed").length;
    }), I = i(() => {
      var e;
      return ((e = a.progress) == null ? void 0 : e.task_count) ?? w.value.length;
    }), P = i(() => `${ae.value} of ${I.value} ${I.value === 1 ? "task" : "tasks"}`), G = i(() => {
      var t;
      const e = Ee(ae.value, ((t = a.progress) == null ? void 0 : t.started_at) || a.row.created_at, a.progress ? a.progress.finished_at : a.row.ended_at, F.value);
      return a.row.role !== "main" && e ? `${e} per hour` : "";
    }), ne = i(() => w.value.length ? U.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: w.value.filter((t) => t.state === e || e === "started" && t.state === "testing" || e === "completed" && t.state === "cancelled") })) : []), _ = /* @__PURE__ */ new Set(["completed"]), b = y({}), V = (e) => !(b.value[e] ?? _.has(e)), E = (e) => b.value = { ...b.value, [e]: V(e) }, O = $e(), W = i(() => a.row.access === "read-only"), N = i(() => W.value ? O.tabs.filter((e) => ["transcript", "terminal"].includes(e.key)) : O.tabs), k = y(N.value[0]);
    ie(() => a.open, (e) => {
      e && (k.value = N.value[0]);
    });
    const oe = Object.fromEntries(O.tabs.filter((e) => e.component).map((e) => [e.key, _e(() => Oe(e.component))])), M = i(() => a.row.role === "helper" && !a.row.ended_at), Y = () => O.run(["helper", "stop", String(a.row.id)]), J = y(!1), z = y(""), l = y(""), s = i(() => a.row.role !== "main" && (!a.row.ended_at || A.value || a.waitReason));
    async function c() {
      if (!s.value) return;
      const e = await O.read(`usage tool --agent ${a.row.id}`);
      z.value = e.ok ? e.value.tool : "", l.value = e.ok ? e.value.note : "";
    }
    const m = O.follow(["hook_call.*", "process_part.*"], c);
    return ke(() => m == null ? void 0 : m()), c(), (e, t) => {
      var v, S, q;
      return o(), r("div", {
        class: ce(["agent-card", { open: n.open }]),
        "data-agent-open": n.row.id,
        "aria-expanded": n.open,
        role: n.open ? void 0 : "button",
        tabindex: n.open ? void 0 : 0,
        title: n.row.session,
        onClick: t[4] || (t[4] = (T) => !n.open && g("toggle")),
        onKeydown: [
          t[5] || (t[5] = pe(Q((T) => !n.open && g("toggle"), ["self", "prevent"]), ["enter"])),
          t[6] || (t[6] = pe(Q((T) => !n.open && g("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        f("span", Xe, [
          n.open ? (o(), r("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: t[0] || (t[0] = Q((T) => g("toggle"), ["stop"]))
          }, [
            h(d(ve), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : u("", !0),
          f("span", {
            class: "agent-dot",
            "data-state": te.value,
            "data-agent-motion": ""
          }, null, 8, Ze),
          f("span", et, p(de.value), 1),
          f("span", tt, p(((v = n.facts) == null ? void 0 : v.given_name) || n.row.id), 1),
          n.open ? u("", !0) : (o(), C(d(ve), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          f("span", at, [
            n.row.ended_at && !A.value ? (o(), C(d(fe), {
              key: 0,
              class: "agent-time",
              at: n.row.ended_at,
              "data-agent-motion": ""
            }, null, 8, ["at"])) : (o(), r("span", nt, p(Z.value), 1)),
            (S = n.facts) != null && S.last_activity ? (o(), r("span", ot, [
              t[7] || (t[7] = le("Last heard: ", -1)),
              h(d(fe), {
                at: n.facts.last_activity
              }, null, 8, ["at"])
            ])) : u("", !0)
          ])
        ]),
        f("span", st, [
          f("span", lt, p(X.value), 1),
          I.value && !x.value ? (o(), r("span", rt, p(P.value), 1)) : u("", !0)
        ]),
        x.value ? (o(), r("span", it, [
          f("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: x.value
          }, p(x.value), 9, ct),
          I.value ? (o(), r("span", ut, p(P.value), 1)) : u("", !0)
        ])) : u("", !0),
        !n.open && (s.value || I.value && G.value) ? (o(), r("span", {
          key: 1,
          class: ce(["agent-foot", { "agent-work-start": !x.value }]),
          "data-agent-foot": ""
        }, [
          s.value ? (o(), C(ye, {
            key: 0,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: A.value,
            command: z.value,
            note: l.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : u("", !0),
          I.value && G.value ? (o(), r("span", dt, p(G.value), 1)) : u("", !0)
        ], 2)) : u("", !0),
        n.open ? (o(), r("div", {
          key: 2,
          class: "agent-more",
          "data-agent-more": "",
          onClick: t[3] || (t[3] = Q(() => {
          }, ["stop"]))
        }, [
          L.value ? (o(), r("div", gt, [
            f("span", vt, p(L.value), 1),
            M.value ? (o(), C(d(qe), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: Y
            }, {
              default: R(() => [...t[8] || (t[8] = [
                le("Stop", -1)
              ])]),
              _: 1
            })) : u("", !0)
          ])) : u("", !0),
          s.value ? (o(), C(ye, {
            key: 1,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: A.value,
            command: z.value,
            note: l.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : u("", !0),
          K.value ? (o(), r("p", pt, p(K.value), 1)) : u("", !0),
          h(d(Be), {
            class: "agent-tabs",
            tabs: N.value,
            active: k.value,
            answer: { tasks: w.value.length },
            onChoose: t[1] || (t[1] = (T) => k.value = T)
          }, null, 8, ["tabs", "active", "answer"]),
          h(d(je), {
            class: "agent-tab-body",
            tab: k.value,
            "data-agent-tab-body": (q = k.value) == null ? void 0 : q.key
          }, {
            default: R(() => {
              var T;
              return [
                h(d(Ie), {
                  value: (T = k.value) == null ? void 0 : T.key
                }, Se({
                  tasks: R(() => {
                    var B;
                    return [
                      w.value.length ? u("", !0) : (o(), C(d(Ne), {
                        key: 0,
                        title: "No tasks"
                      }, {
                        default: R(() => [...t[9] || (t[9] = [
                          le("No tasks have been assigned to this agent.", -1)
                        ])]),
                        _: 1
                      })),
                      (o(!0), r(re, null, ge(ne.value, (D) => (o(), C(Je, {
                        key: D.state,
                        section: D,
                        open: V(D.state),
                        onToggle: (St) => E(D.state)
                      }, null, 8, ["section", "open", "onToggle"]))), 128)),
                      (B = n.facts) != null && B.instruction ? (o(), r(re, { key: 1 }, [
                        t[10] || (t[10] = f("p", { class: "agent-label" }, "Instruction", -1)),
                        f("div", mt, p(n.facts.instruction), 1)
                      ], 64)) : u("", !0)
                    ];
                  }),
                  transcript: R(() => {
                    var B;
                    return [
                      W.value ? (o(), r(re, { key: 0 }, [
                        (B = n.facts) != null && B.instruction ? (o(), r("div", ft, [
                          h(d(be), {
                            label: "Instruction",
                            open: J.value,
                            "data-agent-section": "instruction",
                            onToggle: t[2] || (t[2] = (D) => J.value = !J.value)
                          }, {
                            default: R(() => [
                              f("div", wt, p(n.facts.instruction), 1)
                            ]),
                            _: 1
                          }, 8, ["open"])
                        ])) : n.facts && n.row.ended_at ? (o(), r("p", yt, "No job recorded")) : u("", !0)
                      ], 64)) : u("", !0),
                      h(Pe, {
                        line: `agent transcript ${n.row.id}`,
                        agent: W.value ? M.value ? n.row.id : null : n.row.id,
                        helper: W.value && M.value,
                        padding: "0"
                      }, null, 8, ["line", "agent", "helper"])
                    ];
                  }),
                  _: 2
                }, [
                  ge(d(oe), (B, D) => ({
                    name: D,
                    fn: R(() => [
                      (o(), C(Te(B), {
                        agent: n.row.id
                      }, null, 8, ["agent"]))
                    ])
                  }))
                ]), 1032, ["value"])
              ];
            }),
            _: 1
          }, 8, ["tab", "data-agent-tab-body"])
        ])) : u("", !0)
      ], 42, Qe);
    };
  }
}, bt = /* @__PURE__ */ ue(ht, [["__scopeId", "data-v-cceddd7f"]]), $t = ["data-agent-row"], se = "cubic-bezier(0.2, 0.9, 0.25, 1)", _t = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(n) {
    const H = [
      { key: "running", label: "Running" },
      { key: "idle", label: "Idle" },
      { key: "retired", label: "Retired" },
      { key: "all", label: "All" }
    ], $ = n, { rows: U } = Le("usage agents --closed", ["agent.*", "task.*", "hook_call.*"]), { rows: a } = we("waits"), { rows: g } = we("progress"), F = (l) => g.value.find((s) => s.agent_id === l.id) ?? null, de = (l) => {
      var s;
      return ((s = a.value.find((c) => c.agent_id === l.id)) == null ? void 0 : s.reason) ?? "";
    }, w = y("running"), j = y(""), x = $e(), X = y([]), K = y(""), Z = y(!1), ee = y(!1), A = y(25);
    let te = 0;
    async function L() {
      const l = ++te, s = await x.read(`${$.line} --show ${w.value} --search ${JSON.stringify(j.value)} --limit ${A.value}`);
      l === te && (X.value = s.ok ? s.value.rows : [], K.value = s.ok ? "" : s.error, ee.value = s.ok && s.value.page * s.value.size < s.value.total, Z.value = !0);
    }
    async function ae() {
      return A.value += 25, await L(), !0;
    }
    ie([w, j], () => {
      A.value = 25, L();
    }), x.follow(["agent.*", "task.*", ...x.sources.flatMap((l) => l.events)], L), L();
    const I = (l) => U.value.find((s) => s.id === l.id) ?? null, P = X, G = i(() => !!j.value.trim()), ne = i(() => $.texts[w.value] ?? { title: $.empty, hint: "" }), _ = y(null), b = y(null), V = y(null), E = i(() => P.value.find((l) => l.id === _.value) ?? null), O = i(() => E.value ? [E.value] : P.value), W = i(() => P.value.length - O.value.length), N = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let k = !1, oe = 0;
    async function M(l) {
      if (k) return;
      k = !0, oe = V.value.scrollTop;
      const s = b.value.querySelector(`[data-agent-open="${l.id}"]`);
      if (!N()) {
        const t = [...b.value.querySelectorAll(".agent-row")].filter((v) => !v.contains(s));
        await Promise.all(t.map((v) => v.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const c = [...s.querySelectorAll(".agent-head, .agent-line")], m = [...c, ...s.querySelectorAll("[data-agent-motion]")], e = m.map((t) => t.getBoundingClientRect());
      if (_.value = l.id, await me(), !N()) {
        const t = m.map((v) => v.getBoundingClientRect());
        m.forEach((v, S) => {
          const q = c.indexOf(v.parentElement), T = e[S].left - t[S].left - (q < 0 ? 0 : e[q].left - t[q].left), B = e[S].top - t[S].top - (q < 0 ? 0 : e[q].top - t[q].top);
          v.animate([{ transform: `translate(${T}px, ${B}px)` }, { transform: "none" }], { duration: 280, easing: se });
        }), b.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((v) => {
          v.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: se, fill: "backwards" });
        });
      }
      k = !1;
    }
    async function Y() {
      if (k || !E.value) return;
      k = !0;
      const l = b.value.querySelector(`[data-agent-open="${_.value}"]`), s = [...l.children, ...b.value.querySelectorAll(".agents-held")], c = N() ? [] : s.map((m) => m.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(c.map((m) => m.finished)), _.value = null, await me(), V.value.scrollTop = oe, c.forEach((m) => m.cancel()), N() || (l.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: se }), b.value.querySelectorAll(".agent-row").forEach((m) => {
        m.contains(l) || m.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: se });
      })), k = !1;
    }
    const J = (l) => _.value === l.id ? Y() : M(l);
    ie(j, (l) => l.trim() && (_.value = null)), ie(w, () => {
      _.value = null;
    });
    const z = (l) => {
      l.key === "Escape" && Y();
    };
    return window.addEventListener("keydown", z), ke(() => window.removeEventListener("keydown", z)), (l, s) => (o(), r("div", {
      ref_key: "agents",
      ref: b,
      class: ce(["agents", { focused: E.value }])
    }, [
      h(d(We), {
        modelValue: j.value,
        "onUpdate:modelValue": s[1] || (s[1] = (c) => j.value = c),
        placeholder: "Search agents",
        "data-agents-search": ""
      }, {
        default: R(() => [
          h(d(De), {
            options: H,
            value: w.value,
            onPick: s[0] || (s[0] = (c) => w.value = c)
          }, null, 8, ["value"])
        ]),
        _: 1
      }, 8, ["modelValue"]),
      f("div", {
        ref_key: "list",
        ref: V,
        class: ce(["agents-view", { "agents-view-open": E.value }])
      }, [
        h(d(He), {
          rows: O.value,
          failure: K.value,
          loaded: Z.value,
          more: !E.value && ee.value,
          older: ae,
          empty: ne.value.title,
          hint: ne.value.hint,
          searching: G.value
        }, {
          default: R(({ row: c }) => [
            f("div", {
              class: "agent-row",
              "data-agent-row": c.id
            }, [
              h(bt, {
                row: c,
                facts: I(c),
                progress: F(c),
                "wait-reason": de(c),
                open: c.id === _.value,
                onToggle: (m) => J(c)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, $t)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"])
      ], 2),
      E.value && W.value ? (o(), r("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: Y
      }, p(W.value) + " more", 1)) : u("", !0)
    ], 2));
  }
}, xt = /* @__PURE__ */ ue(_t, [["__scopeId", "data-v-8a9667a8"]]);
export {
  xt as A
};
