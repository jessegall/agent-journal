/* @code-commandments-generated */
import { openBlock as o, createElementBlock as r, withModifiers as Y, unref as d, createTextVNode as ce, toDisplayString as v, createVNode as h, createBlock as C, withCtx as T, Fragment as J, renderList as de, createElementVNode as y, createCommentVNode as g, computed as u, ref as k, watch as se, defineAsyncComponent as $e, onUnmounted as ye, withKeys as ve, normalizeClass as le, createSlots as Se, resolveDynamicComponent as _e, nextTick as pe } from "vue";
import { peekRef as ke, Icon as ge, RunningCommand as Ce, FoldGroup as he, TaskStatusIcon as Te, useNow as Re, age as xe, perHour as Ae, useWindow as be, loadWindowComponent as Ee, TimeAgo as Oe, Btn as qe, InnerTabs as Be, TabBody as Ie, SwitchCase as je, EmptyState as Ne, useRows as He, useDeclaredRows as me, SearchBar as We, Segmented as De, RowList as Le } from "@journal/window-kit";
import { _ as re, T as fe } from "./TranscriptRows-ByPSYos4.js";
const Pe = {
  class: "agent-command",
  "data-agent-command": ""
}, Ve = {
  key: 1,
  "data-agent-stopped": ""
}, ze = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(n) {
    return (W, $) => (o(), r("span", Pe, [
      n.waitReason ? (o(), r("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: $[0] || ($[0] = Y((U) => d(ke)("test_queue:0"), ["stop"]))
      }, [
        ce("Waiting: " + v(n.waitReason) + " ", 1),
        h(d(ge), {
          name: "arrow",
          size: 11
        })
      ])) : n.stopped ? (o(), r("span", Ve, "Waiting")) : (o(), C(d(Ce), {
        key: 2,
        text: n.command,
        idle: n.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, we = /* @__PURE__ */ re(ze, [["__scopeId", "data-v-1b371fb5"]]), Ue = ["data-agent-delegated", "onClick"], Fe = { class: "agent-task-number" }, Ke = { class: "agent-task-title" }, Ge = ["title"], Me = {
  __name: "AgentTaskGroup",
  props: { section: { type: Object, required: !0 }, open: Boolean },
  emits: ["toggle"],
  setup(n, { emit: W }) {
    const $ = W;
    return (U, t) => (o(), C(d(he), {
      label: n.section.label,
      count: n.section.tasks.length,
      open: n.open,
      "data-agent-section": n.section.state,
      onToggle: t[0] || (t[0] = (c) => $("toggle"))
    }, {
      default: T(() => [
        (o(!0), r(J, null, de(n.section.tasks, (c) => (o(), r("button", {
          key: c.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": c.id,
          onClick: (F) => d(ke)(`tasks:${c.id}`)
        }, [
          h(d(Te), {
            status: c.state
          }, null, 8, ["status"]),
          y("span", Fe, v(c.id), 1),
          y("span", Ke, v(c.title), 1),
          c.plan_id ? (o(), r("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${c.plan_id}: ${c.plan_title}`
          }, "Plan " + v(c.plan_id) + ": " + v(c.plan_title), 9, Ge)) : g("", !0)
        ], 8, Ue))), 128))
      ]),
      _: 1
    }, 8, ["label", "count", "open", "data-agent-section"]));
  }
}, Ye = /* @__PURE__ */ re(Me, [["__scopeId", "data-v-238ff959"]]), Je = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], Qe = { class: "agent-head" }, Xe = ["data-state"], Ze = {
  class: "agent-title",
  "data-agent-title": "",
  "data-agent-motion": ""
}, et = {
  class: "agent-name",
  "data-agent-name": "",
  "data-agent-motion": ""
}, tt = {
  key: 3,
  class: "agent-time",
  "data-agent-motion": ""
}, at = { class: "agent-line" }, nt = {
  class: "agent-identity",
  "data-agent-identity": "",
  "data-agent-motion": ""
}, ot = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, st = {
  key: 0,
  class: "agent-line agent-work-start"
}, lt = ["title"], rt = {
  key: 0,
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, it = {
  key: 1,
  class: "agent-pace",
  "data-agent-pace": "",
  "data-agent-motion": ""
}, ut = {
  class: "agent-usage",
  "data-agent-card-usage": ""
}, ct = {
  key: 2,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, dt = {
  key: 3,
  class: "agent-tab-body",
  "data-agent-tab-body": "transcript",
  "data-agent-only-transcript": ""
}, gt = {
  key: 0,
  class: "agent-subagent-brief"
}, vt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, pt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, mt = "It ended without a report", ft = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(n, { emit: W }) {
    const $ = { subagent: "Helper", helper: "Helper", reviewer: "Reviewer" }, U = ["started", "blocked", "open", "completed"], t = n, c = W, F = Re(), ie = u(() => {
      var a;
      const e = ((a = t.facts) == null ? void 0 : a.profile) || $[t.row.role] || t.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), w = u(() => {
      var e;
      return ((e = t.facts) == null ? void 0 : e.tasks) ?? [];
    }), q = u(() => w.value.filter((e) => e.state === "open")), R = u(() => {
      var e, a, p;
      return (e = t.facts) != null && e.job_enabled && (((a = t.facts) == null ? void 0 : a.task_title) || ((p = q.value[0]) == null ? void 0 : p.title)) || "";
    }), Q = u(() => {
      var e, a;
      return [t.row.program, (e = t.facts) == null ? void 0 : e.model, (a = t.facts) == null ? void 0 : a.effort, t.row.role === "main" ? "" : t.progress ? `${t.row.role} ${t.row.id}` : t.row.role, t.row.access === "read-only" ? "Access: Read-only" : ""].filter(Boolean).join(" · ");
    }), K = u(() => {
      var e, a;
      return t.row.ended_at && ((a = (e = t.facts) == null ? void 0 : e.job_returned) != null && a.startsWith(mt)) ? t.facts.job_returned : "";
    }), X = u(() => xe(t.row.process_started_at || t.row.created_at, F.value)), Z = /* @__PURE__ */ new Set(["open", "started", "testing"]), x = u(() => !!t.row.ended_at && t.row.role !== "main" && w.value.some((e) => Z.has(e.state))), ee = u(() => {
      var e;
      return t.waitReason || x.value ? "waiting" : t.row.state === "running" && ((e = t.facts) == null ? void 0 : e.state) || t.row.state;
    }), j = u(() => {
      var a, p, m;
      const e = [];
      return ((a = t.facts) == null ? void 0 : a.context_percent) !== null && ((p = t.facts) == null ? void 0 : p.context_percent) !== void 0 && e.push(`Context: ${t.facts.context_percent}%`), (m = t.facts) != null && m.cost_dollars && e.push(`$${t.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), te = u(() => {
      var e;
      return ((e = t.progress) == null ? void 0 : e.completed_count) ?? w.value.filter((a) => a.state === "completed").length;
    }), B = u(() => {
      var e;
      return ((e = t.progress) == null ? void 0 : e.task_count) ?? w.value.length;
    }), D = u(() => `${te.value} of ${B.value} ${B.value === 1 ? "task" : "tasks"}`), G = u(() => {
      var a;
      const e = Ae(te.value, ((a = t.progress) == null ? void 0 : a.started_at) || t.row.created_at, t.progress ? t.progress.finished_at : t.row.ended_at, F.value);
      return t.row.role !== "main" && e ? `${e} per hour` : "";
    }), ae = u(() => w.value.length ? U.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: w.value.filter((a) => a.state === e || e === "started" && a.state === "testing" || e === "completed" && a.state === "cancelled") })) : []), S = /* @__PURE__ */ new Set(["completed"]), b = k({}), L = (e) => !(b.value[e] ?? S.has(e)), A = (e) => b.value = { ...b.value, [e]: L(e) }, E = be(), O = k(E.tabs[0]);
    se(() => t.open, (e) => {
      e && (O.value = E.tabs[0]);
    });
    const P = Object.fromEntries(E.tabs.filter((e) => e.component).map((e) => [e.key, $e(() => Ee(e.component))])), _ = u(() => t.row.role === "helper" && !t.row.ended_at), ne = () => E.run(["helper", "stop", String(t.row.id)]), ue = u(() => t.row.access === "read-only" || t.row.role === "subagent" || t.row.role === "reviewer"), N = k(!1), M = k(""), V = k(""), s = u(() => t.row.role !== "main" && (!t.row.ended_at || x.value || t.waitReason));
    async function l() {
      if (!s.value) return;
      const e = await E.read(`usage tool --agent ${t.row.id}`);
      M.value = e.ok ? e.value.tool : "", V.value = e.ok ? e.value.note : "";
    }
    const i = E.follow(["hook_call.*", "process_part.*"], l);
    return ye(() => i == null ? void 0 : i()), l(), (e, a) => {
      var p, m, H;
      return o(), r("div", {
        class: le(["agent-card", { open: n.open }]),
        "data-agent-open": n.row.id,
        "aria-expanded": n.open,
        role: n.open ? void 0 : "button",
        tabindex: n.open ? void 0 : 0,
        title: n.row.session,
        onClick: a[4] || (a[4] = (f) => !n.open && c("toggle")),
        onKeydown: [
          a[5] || (a[5] = ve(Y((f) => !n.open && c("toggle"), ["self", "prevent"]), ["enter"])),
          a[6] || (a[6] = ve(Y((f) => !n.open && c("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        y("span", Qe, [
          n.open ? (o(), r("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: a[0] || (a[0] = Y((f) => c("toggle"), ["stop"]))
          }, [
            h(d(ge), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : g("", !0),
          y("span", {
            class: "agent-dot",
            "data-state": ee.value,
            "data-agent-motion": ""
          }, null, 8, Xe),
          y("span", Ze, v(ie.value), 1),
          y("span", et, v(((p = n.facts) == null ? void 0 : p.given_name) || n.row.id), 1),
          n.open ? g("", !0) : (o(), C(d(ge), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          n.row.ended_at && !x.value ? (o(), C(d(Oe), {
            key: 2,
            class: "agent-time",
            at: n.row.ended_at,
            "data-agent-motion": ""
          }, null, 8, ["at"])) : (o(), r("span", tt, v(X.value), 1))
        ]),
        y("span", at, [
          y("span", nt, v(Q.value), 1),
          B.value && !R.value ? (o(), r("span", ot, v(D.value), 1)) : g("", !0)
        ]),
        R.value ? (o(), r("span", st, [
          y("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: R.value
          }, v(R.value), 9, lt),
          B.value ? (o(), r("span", rt, v(D.value), 1)) : g("", !0)
        ])) : g("", !0),
        !n.open && (s.value || B.value && G.value) ? (o(), r("span", {
          key: 1,
          class: le(["agent-foot", { "agent-work-start": !R.value }]),
          "data-agent-foot": ""
        }, [
          s.value ? (o(), C(we, {
            key: 0,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: x.value,
            command: M.value,
            note: V.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : g("", !0),
          B.value && G.value ? (o(), r("span", it, v(G.value), 1)) : g("", !0)
        ], 2)) : g("", !0),
        n.open ? (o(), r("div", {
          key: 2,
          class: "agent-more",
          "data-agent-more": "",
          onClick: a[3] || (a[3] = Y(() => {
          }, ["stop"]))
        }, [
          j.value ? (o(), r(J, { key: 0 }, [
            y("span", ut, v(j.value), 1),
            _.value ? (o(), C(d(qe), {
              key: 0,
              kind: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: ne
            }, {
              default: T(() => [...a[7] || (a[7] = [
                ce("Stop", -1)
              ])]),
              _: 1
            })) : g("", !0)
          ], 64)) : g("", !0),
          s.value ? (o(), C(we, {
            key: 1,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: x.value,
            command: M.value,
            note: V.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : g("", !0),
          K.value ? (o(), r("p", ct, v(K.value), 1)) : g("", !0),
          ue.value ? (o(), r("div", dt, [
            (m = n.facts) != null && m.instruction ? (o(), r("div", gt, [
              h(d(he), {
                label: "Instruction",
                open: N.value,
                "data-agent-section": "instruction",
                onToggle: a[1] || (a[1] = (f) => N.value = !N.value)
              }, {
                default: T(() => [
                  y("div", vt, v(n.facts.instruction), 1)
                ]),
                _: 1
              }, 8, ["open"])
            ])) : g("", !0),
            h(fe, {
              line: `agent transcript ${n.row.id}`,
              agent: _.value ? n.row.id : null,
              helper: _.value,
              padding: "0"
            }, null, 8, ["line", "agent", "helper"])
          ])) : (o(), r(J, { key: 4 }, [
            h(d(Be), {
              class: "agent-tabs",
              active: O.value,
              answer: { tasks: w.value.length },
              onChoose: a[2] || (a[2] = (f) => O.value = f)
            }, null, 8, ["active", "answer"]),
            h(d(Ie), {
              class: "agent-tab-body",
              tab: O.value,
              "data-agent-tab-body": (H = O.value) == null ? void 0 : H.key
            }, {
              default: T(() => {
                var f;
                return [
                  h(d(je), {
                    value: (f = O.value) == null ? void 0 : f.key
                  }, Se({
                    tasks: T(() => {
                      var z;
                      return [
                        w.value.length ? g("", !0) : (o(), C(d(Ne), {
                          key: 0,
                          title: "No tasks"
                        }, {
                          default: T(() => [...a[8] || (a[8] = [
                            ce("No tasks have been assigned to this agent.", -1)
                          ])]),
                          _: 1
                        })),
                        (o(!0), r(J, null, de(ae.value, (I) => (o(), C(Ye, {
                          key: I.state,
                          section: I,
                          open: L(I.state),
                          onToggle: (ht) => A(I.state)
                        }, null, 8, ["section", "open", "onToggle"]))), 128)),
                        (z = n.facts) != null && z.instruction ? (o(), r(J, { key: 1 }, [
                          a[9] || (a[9] = y("p", { class: "agent-label" }, "Instruction", -1)),
                          y("div", pt, v(n.facts.instruction), 1)
                        ], 64)) : g("", !0)
                      ];
                    }),
                    transcript: T(() => [
                      h(fe, {
                        line: `agent transcript ${n.row.id}`,
                        agent: n.row.id,
                        padding: "0"
                      }, null, 8, ["line", "agent"])
                    ]),
                    _: 2
                  }, [
                    de(d(P), (z, I) => ({
                      name: I,
                      fn: T(() => [
                        (o(), C(_e(z), {
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
        ])) : g("", !0)
      ], 42, Je);
    };
  }
}, wt = /* @__PURE__ */ re(ft, [["__scopeId", "data-v-590851f8"]]), yt = ["data-agent-row"], oe = "cubic-bezier(0.2, 0.9, 0.25, 1)", kt = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(n) {
    const W = [
      { key: "running", label: "Running" },
      { key: "idle", label: "Idle" },
      { key: "retired", label: "Retired" },
      { key: "all", label: "All" }
    ], $ = n, { rows: U } = He("usage agents --closed", ["agent.*", "task.*"]), { rows: t } = me("waits"), { rows: c } = me("progress"), F = (s) => c.value.find((l) => l.agent_id === s.id) ?? null, ie = (s) => {
      var l;
      return ((l = t.value.find((i) => i.agent_id === s.id)) == null ? void 0 : l.reason) ?? "";
    }, w = k("running"), q = k(""), R = be(), Q = k([]), K = k(""), X = k(!1), Z = k(!1), x = k(25);
    let ee = 0;
    async function j() {
      const s = ++ee, l = await R.read(`${$.line} --show ${w.value} --search ${JSON.stringify(q.value)} --limit ${x.value}`);
      s === ee && (Q.value = l.ok ? l.value.rows : [], K.value = l.ok ? "" : l.error, Z.value = l.ok && l.value.page * l.value.size < l.value.total, X.value = !0);
    }
    async function te() {
      return x.value += 25, await j(), !0;
    }
    se([w, q], () => {
      x.value = 25, j();
    }), R.follow(["agent.*", "task.*", ...R.sources.flatMap((s) => s.events)], j), j();
    const B = (s) => U.value.find((l) => l.id === s.id) ?? null, D = Q, G = u(() => !!q.value.trim()), ae = u(() => $.texts[w.value] ?? { title: $.empty, hint: "" }), S = k(null), b = k(null), L = k(null), A = u(() => D.value.find((s) => s.id === S.value) ?? null), E = u(() => A.value ? [A.value] : D.value), O = u(() => D.value.length - E.value.length), P = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let _ = !1, ne = 0;
    async function ue(s) {
      if (_) return;
      _ = !0, ne = L.value.scrollTop;
      const l = b.value.querySelector(`[data-agent-open="${s.id}"]`);
      if (!P()) {
        const p = [...b.value.querySelectorAll(".agent-row")].filter((m) => !m.contains(l));
        await Promise.all(p.map((m) => m.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const i = [...l.querySelectorAll(".agent-head, .agent-line")], e = [...i, ...l.querySelectorAll("[data-agent-motion]")], a = e.map((p) => p.getBoundingClientRect());
      if (S.value = s.id, await pe(), !P()) {
        const p = e.map((m) => m.getBoundingClientRect());
        e.forEach((m, H) => {
          const f = i.indexOf(m.parentElement), z = a[H].left - p[H].left - (f < 0 ? 0 : a[f].left - p[f].left), I = a[H].top - p[H].top - (f < 0 ? 0 : a[f].top - p[f].top);
          m.animate([{ transform: `translate(${z}px, ${I}px)` }, { transform: "none" }], { duration: 280, easing: oe });
        }), b.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((m) => {
          m.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: oe, fill: "backwards" });
        });
      }
      _ = !1;
    }
    async function N() {
      if (_ || !A.value) return;
      _ = !0;
      const s = b.value.querySelector(`[data-agent-open="${S.value}"]`), l = [...s.children, ...b.value.querySelectorAll(".agents-held")], i = P() ? [] : l.map((e) => e.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(i.map((e) => e.finished)), S.value = null, await pe(), L.value.scrollTop = ne, i.forEach((e) => e.cancel()), P() || (s.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: oe }), b.value.querySelectorAll(".agent-row").forEach((e) => {
        e.contains(s) || e.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: oe });
      })), _ = !1;
    }
    const M = (s) => S.value === s.id ? N() : ue(s);
    se(q, (s) => s.trim() && (S.value = null)), se(w, () => {
      S.value = null;
    });
    const V = (s) => {
      s.key === "Escape" && N();
    };
    return window.addEventListener("keydown", V), ye(() => window.removeEventListener("keydown", V)), (s, l) => (o(), r("div", {
      ref_key: "agents",
      ref: b,
      class: le(["agents", { focused: A.value }])
    }, [
      h(d(We), {
        modelValue: q.value,
        "onUpdate:modelValue": l[1] || (l[1] = (i) => q.value = i),
        placeholder: "Search agents",
        "data-agents-search": ""
      }, {
        default: T(() => [
          h(d(De), {
            options: W,
            value: w.value,
            onPick: l[0] || (l[0] = (i) => w.value = i)
          }, null, 8, ["value"])
        ]),
        _: 1
      }, 8, ["modelValue"]),
      y("div", {
        ref_key: "list",
        ref: L,
        class: le(["agents-view", { "agents-view-open": A.value }])
      }, [
        h(d(Le), {
          rows: E.value,
          failure: K.value,
          loaded: X.value,
          more: !A.value && Z.value,
          older: te,
          empty: ae.value.title,
          hint: ae.value.hint,
          searching: G.value
        }, {
          default: T(({ row: i }) => [
            y("div", {
              class: "agent-row",
              "data-agent-row": i.id
            }, [
              h(wt, {
                row: i,
                facts: B(i),
                progress: F(i),
                "wait-reason": ie(i),
                open: i.id === S.value,
                onToggle: (e) => M(i)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, yt)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"])
      ], 2),
      A.value && O.value ? (o(), r("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: N
      }, v(O.value) + " more", 1)) : g("", !0)
    ], 2));
  }
}, _t = /* @__PURE__ */ re(kt, [["__scopeId", "data-v-e1ce2121"]]);
export {
  _t as A
};
