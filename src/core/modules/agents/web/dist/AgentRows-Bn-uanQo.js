/* @code-commandments-generated */
import { openBlock as o, createElementBlock as r, withModifiers as Y, unref as u, createTextVNode as de, toDisplayString as v, createVNode as h, createBlock as C, withCtx as T, Fragment as oe, renderList as ue, createElementVNode as y, createCommentVNode as g, computed as c, ref as k, watch as se, defineAsyncComponent as $e, onUnmounted as ye, withKeys as ve, normalizeClass as le, createSlots as Se, resolveDynamicComponent as _e, nextTick as pe } from "vue";
import { peekRef as ke, Icon as ge, RunningCommand as Ce, FoldGroup as he, TaskStatusIcon as Te, useNow as Re, age as xe, perHour as Ae, useWindow as be, loadWindowComponent as Ee, TimeAgo as Oe, Btn as qe, InnerTabs as Be, TabBody as je, SwitchCase as Ie, EmptyState as Ne, useRows as We, useDeclaredRows as me, SearchBar as De, Segmented as He, RowList as Le } from "@journal/window-kit";
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
    return (D, $) => (o(), r("span", Pe, [
      n.waitReason ? (o(), r("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: $[0] || ($[0] = Y((U) => u(ke)("test_queue:0"), ["stop"]))
      }, [
        de("Waiting: " + v(n.waitReason) + " ", 1),
        h(u(ge), {
          name: "arrow",
          size: 11
        })
      ])) : n.stopped ? (o(), r("span", Ve, "Waiting")) : (o(), C(u(Ce), {
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
  setup(n, { emit: D }) {
    const $ = D;
    return (U, t) => (o(), C(u(he), {
      label: n.section.label,
      count: n.section.tasks.length,
      open: n.open,
      "data-agent-section": n.section.state,
      onToggle: t[0] || (t[0] = (d) => $("toggle"))
    }, {
      default: T(() => [
        (o(!0), r(oe, null, ue(n.section.tasks, (d) => (o(), r("button", {
          key: d.id,
          type: "button",
          class: "agent-task",
          "data-agent-delegated": d.id,
          onClick: (F) => u(ke)(`tasks:${d.id}`)
        }, [
          h(u(Te), {
            status: d.state
          }, null, 8, ["status"]),
          y("span", Fe, v(d.id), 1),
          y("span", Ke, v(d.title), 1),
          d.plan_id ? (o(), r("span", {
            key: 0,
            class: "agent-task-plan",
            "data-agent-task-plan": "",
            title: `Plan ${d.plan_id}: ${d.plan_title}`
          }, "Plan " + v(d.plan_id) + ": " + v(d.plan_title), 9, Ge)) : g("", !0)
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
}, ct = {
  key: 0,
  class: "agent-usage-band"
}, dt = {
  class: "agent-usage",
  "data-agent-card-usage": ""
}, ut = {
  key: 2,
  class: "agent-ended-reason",
  "data-agent-ended-reason": ""
}, gt = {
  key: 3,
  class: "agent-tab-body",
  "data-agent-tab-body": "transcript",
  "data-agent-only-transcript": ""
}, vt = {
  key: 0,
  class: "agent-helper-brief"
}, pt = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, mt = {
  key: 1,
  class: "agent-label",
  "data-agent-no-job": ""
}, ft = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, wt = "It ended without a report", yt = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(n, { emit: D }) {
    const $ = { helper: "Helper", reviewer: "Reviewer" }, U = ["started", "blocked", "open", "completed"], t = n, d = D, F = Re(), ie = c(() => {
      var a;
      const e = ((a = t.facts) == null ? void 0 : a.profile) || $[t.row.role] || t.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), w = c(() => {
      var e;
      return ((e = t.facts) == null ? void 0 : e.tasks) ?? [];
    }), q = c(() => w.value.filter((e) => e.state === "open")), R = c(() => {
      var e, a, p;
      return (e = t.facts) != null && e.job_enabled && (((a = t.facts) == null ? void 0 : a.task_title) || ((p = q.value[0]) == null ? void 0 : p.title)) || "";
    }), J = c(() => {
      var e, a;
      return [t.row.program, (e = t.facts) == null ? void 0 : e.model, (a = t.facts) == null ? void 0 : a.effort, t.row.role === "main" ? "" : t.progress ? `${t.row.role} ${t.row.id}` : t.row.role, t.row.access === "read-only" ? "Access: Read-only" : ""].filter(Boolean).join(" · ");
    }), K = c(() => {
      var e, a;
      return t.row.ended_at && ((a = (e = t.facts) == null ? void 0 : e.job_returned) != null && a.startsWith(wt)) ? t.facts.job_returned : "";
    }), Q = c(() => xe(t.row.process_started_at || t.row.created_at, F.value)), X = /* @__PURE__ */ new Set(["open", "started", "testing"]), x = c(() => !!t.row.ended_at && t.row.role !== "main" && w.value.some((e) => X.has(e.state))), Z = c(() => {
      var e;
      return t.waitReason || x.value ? "waiting" : t.row.state === "running" && ((e = t.facts) == null ? void 0 : e.state) || t.row.state;
    }), I = c(() => {
      var a, p, m;
      const e = [];
      return ((a = t.facts) == null ? void 0 : a.context_percent) !== null && ((p = t.facts) == null ? void 0 : p.context_percent) !== void 0 && e.push(`Context: ${t.facts.context_percent}%`), (m = t.facts) != null && m.cost_dollars && e.push(`$${t.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), ee = c(() => {
      var e;
      return ((e = t.progress) == null ? void 0 : e.completed_count) ?? w.value.filter((a) => a.state === "completed").length;
    }), B = c(() => {
      var e;
      return ((e = t.progress) == null ? void 0 : e.task_count) ?? w.value.length;
    }), H = c(() => `${ee.value} of ${B.value} ${B.value === 1 ? "task" : "tasks"}`), G = c(() => {
      var a;
      const e = Ae(ee.value, ((a = t.progress) == null ? void 0 : a.started_at) || t.row.created_at, t.progress ? t.progress.finished_at : t.row.ended_at, F.value);
      return t.row.role !== "main" && e ? `${e} per hour` : "";
    }), te = c(() => w.value.length ? U.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: w.value.filter((a) => a.state === e || e === "started" && a.state === "testing" || e === "completed" && a.state === "cancelled") })) : []), S = /* @__PURE__ */ new Set(["completed"]), b = k({}), L = (e) => !(b.value[e] ?? S.has(e)), A = (e) => b.value = { ...b.value, [e]: L(e) }, E = be(), O = k(E.tabs[0]);
    se(() => t.open, (e) => {
      e && (O.value = E.tabs[0]);
    });
    const P = Object.fromEntries(E.tabs.filter((e) => e.component).map((e) => [e.key, $e(() => Ee(e.component))])), _ = c(() => t.row.role === "helper" && !t.row.ended_at), ae = () => E.run(["helper", "stop", String(t.row.id)]), ce = c(() => t.row.access === "read-only"), N = k(!1), M = k(""), V = k(""), s = c(() => t.row.role !== "main" && (!t.row.ended_at || x.value || t.waitReason));
    async function l() {
      if (!s.value) return;
      const e = await E.read(`usage tool --agent ${t.row.id}`);
      M.value = e.ok ? e.value.tool : "", V.value = e.ok ? e.value.note : "";
    }
    const i = E.follow(["hook_call.*", "process_part.*"], l);
    return ye(() => i == null ? void 0 : i()), l(), (e, a) => {
      var p, m, W;
      return o(), r("div", {
        class: le(["agent-card", { open: n.open }]),
        "data-agent-open": n.row.id,
        "aria-expanded": n.open,
        role: n.open ? void 0 : "button",
        tabindex: n.open ? void 0 : 0,
        title: n.row.session,
        onClick: a[4] || (a[4] = (f) => !n.open && d("toggle")),
        onKeydown: [
          a[5] || (a[5] = ve(Y((f) => !n.open && d("toggle"), ["self", "prevent"]), ["enter"])),
          a[6] || (a[6] = ve(Y((f) => !n.open && d("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        y("span", Qe, [
          n.open ? (o(), r("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: a[0] || (a[0] = Y((f) => d("toggle"), ["stop"]))
          }, [
            h(u(ge), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : g("", !0),
          y("span", {
            class: "agent-dot",
            "data-state": Z.value,
            "data-agent-motion": ""
          }, null, 8, Xe),
          y("span", Ze, v(ie.value), 1),
          y("span", et, v(((p = n.facts) == null ? void 0 : p.given_name) || n.row.id), 1),
          n.open ? g("", !0) : (o(), C(u(ge), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          n.row.ended_at && !x.value ? (o(), C(u(Oe), {
            key: 2,
            class: "agent-time",
            at: n.row.ended_at,
            "data-agent-motion": ""
          }, null, 8, ["at"])) : (o(), r("span", tt, v(Q.value), 1))
        ]),
        y("span", at, [
          y("span", nt, v(J.value), 1),
          B.value && !R.value ? (o(), r("span", ot, v(H.value), 1)) : g("", !0)
        ]),
        R.value ? (o(), r("span", st, [
          y("span", {
            class: "agent-job",
            "data-agent-job": "",
            title: R.value
          }, v(R.value), 9, lt),
          B.value ? (o(), r("span", rt, v(H.value), 1)) : g("", !0)
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
          I.value ? (o(), r("div", ct, [
            y("span", dt, v(I.value), 1),
            _.value ? (o(), C(u(qe), {
              key: 0,
              variant: "ghost",
              small: "",
              "data-helper-stop": "",
              onClick: ae
            }, {
              default: T(() => [...a[7] || (a[7] = [
                de("Stop", -1)
              ])]),
              _: 1
            })) : g("", !0)
          ])) : g("", !0),
          s.value ? (o(), C(we, {
            key: 1,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: x.value,
            command: M.value,
            note: V.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : g("", !0),
          K.value ? (o(), r("p", ut, v(K.value), 1)) : g("", !0),
          ce.value ? (o(), r("div", gt, [
            (m = n.facts) != null && m.instruction ? (o(), r("div", vt, [
              h(u(he), {
                label: "Instruction",
                open: N.value,
                "data-agent-section": "instruction",
                onToggle: a[1] || (a[1] = (f) => N.value = !N.value)
              }, {
                default: T(() => [
                  y("div", pt, v(n.facts.instruction), 1)
                ]),
                _: 1
              }, 8, ["open"])
            ])) : n.facts && n.row.ended_at ? (o(), r("p", mt, "No job kept from version 4")) : g("", !0),
            h(fe, {
              line: `agent transcript ${n.row.id}`,
              agent: _.value ? n.row.id : null,
              helper: _.value,
              padding: "0"
            }, null, 8, ["line", "agent", "helper"])
          ])) : (o(), r(oe, { key: 4 }, [
            h(u(Be), {
              class: "agent-tabs",
              active: O.value,
              answer: { tasks: w.value.length },
              onChoose: a[2] || (a[2] = (f) => O.value = f)
            }, null, 8, ["active", "answer"]),
            h(u(je), {
              class: "agent-tab-body",
              tab: O.value,
              "data-agent-tab-body": (W = O.value) == null ? void 0 : W.key
            }, {
              default: T(() => {
                var f;
                return [
                  h(u(Ie), {
                    value: (f = O.value) == null ? void 0 : f.key
                  }, Se({
                    tasks: T(() => {
                      var z;
                      return [
                        w.value.length ? g("", !0) : (o(), C(u(Ne), {
                          key: 0,
                          title: "No tasks"
                        }, {
                          default: T(() => [...a[8] || (a[8] = [
                            de("No tasks have been assigned to this agent.", -1)
                          ])]),
                          _: 1
                        })),
                        (o(!0), r(oe, null, ue(te.value, (j) => (o(), C(Ye, {
                          key: j.state,
                          section: j,
                          open: L(j.state),
                          onToggle: ($t) => A(j.state)
                        }, null, 8, ["section", "open", "onToggle"]))), 128)),
                        (z = n.facts) != null && z.instruction ? (o(), r(oe, { key: 1 }, [
                          a[9] || (a[9] = y("p", { class: "agent-label" }, "Instruction", -1)),
                          y("div", ft, v(n.facts.instruction), 1)
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
                    ue(u(P), (z, j) => ({
                      name: j,
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
}, kt = /* @__PURE__ */ re(yt, [["__scopeId", "data-v-cecf88a8"]]), ht = ["data-agent-row"], ne = "cubic-bezier(0.2, 0.9, 0.25, 1)", bt = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(n) {
    const D = [
      { key: "running", label: "Running" },
      { key: "idle", label: "Idle" },
      { key: "retired", label: "Retired" },
      { key: "all", label: "All" }
    ], $ = n, { rows: U } = We("usage agents --closed", ["agent.*", "task.*"]), { rows: t } = me("waits"), { rows: d } = me("progress"), F = (s) => d.value.find((l) => l.agent_id === s.id) ?? null, ie = (s) => {
      var l;
      return ((l = t.value.find((i) => i.agent_id === s.id)) == null ? void 0 : l.reason) ?? "";
    }, w = k("running"), q = k(""), R = be(), J = k([]), K = k(""), Q = k(!1), X = k(!1), x = k(25);
    let Z = 0;
    async function I() {
      const s = ++Z, l = await R.read(`${$.line} --show ${w.value} --search ${JSON.stringify(q.value)} --limit ${x.value}`);
      s === Z && (J.value = l.ok ? l.value.rows : [], K.value = l.ok ? "" : l.error, X.value = l.ok && l.value.page * l.value.size < l.value.total, Q.value = !0);
    }
    async function ee() {
      return x.value += 25, await I(), !0;
    }
    se([w, q], () => {
      x.value = 25, I();
    }), R.follow(["agent.*", "task.*", ...R.sources.flatMap((s) => s.events)], I), I();
    const B = (s) => U.value.find((l) => l.id === s.id) ?? null, H = J, G = c(() => !!q.value.trim()), te = c(() => $.texts[w.value] ?? { title: $.empty, hint: "" }), S = k(null), b = k(null), L = k(null), A = c(() => H.value.find((s) => s.id === S.value) ?? null), E = c(() => A.value ? [A.value] : H.value), O = c(() => H.value.length - E.value.length), P = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let _ = !1, ae = 0;
    async function ce(s) {
      if (_) return;
      _ = !0, ae = L.value.scrollTop;
      const l = b.value.querySelector(`[data-agent-open="${s.id}"]`);
      if (!P()) {
        const p = [...b.value.querySelectorAll(".agent-row")].filter((m) => !m.contains(l));
        await Promise.all(p.map((m) => m.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const i = [...l.querySelectorAll(".agent-head, .agent-line")], e = [...i, ...l.querySelectorAll("[data-agent-motion]")], a = e.map((p) => p.getBoundingClientRect());
      if (S.value = s.id, await pe(), !P()) {
        const p = e.map((m) => m.getBoundingClientRect());
        e.forEach((m, W) => {
          const f = i.indexOf(m.parentElement), z = a[W].left - p[W].left - (f < 0 ? 0 : a[f].left - p[f].left), j = a[W].top - p[W].top - (f < 0 ? 0 : a[f].top - p[f].top);
          m.animate([{ transform: `translate(${z}px, ${j}px)` }, { transform: "none" }], { duration: 280, easing: ne });
        }), b.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((m) => {
          m.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: ne, fill: "backwards" });
        });
      }
      _ = !1;
    }
    async function N() {
      if (_ || !A.value) return;
      _ = !0;
      const s = b.value.querySelector(`[data-agent-open="${S.value}"]`), l = [...s.children, ...b.value.querySelectorAll(".agents-held")], i = P() ? [] : l.map((e) => e.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(i.map((e) => e.finished)), S.value = null, await pe(), L.value.scrollTop = ae, i.forEach((e) => e.cancel()), P() || (s.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: ne }), b.value.querySelectorAll(".agent-row").forEach((e) => {
        e.contains(s) || e.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: ne });
      })), _ = !1;
    }
    const M = (s) => S.value === s.id ? N() : ce(s);
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
      h(u(De), {
        modelValue: q.value,
        "onUpdate:modelValue": l[1] || (l[1] = (i) => q.value = i),
        placeholder: "Search agents",
        "data-agents-search": ""
      }, {
        default: T(() => [
          h(u(He), {
            options: D,
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
        h(u(Le), {
          rows: E.value,
          failure: K.value,
          loaded: Q.value,
          more: !A.value && X.value,
          older: ee,
          empty: te.value.title,
          hint: te.value.hint,
          searching: G.value
        }, {
          default: T(({ row: i }) => [
            y("div", {
              class: "agent-row",
              "data-agent-row": i.id
            }, [
              h(kt, {
                row: i,
                facts: B(i),
                progress: F(i),
                "wait-reason": ie(i),
                open: i.id === S.value,
                onToggle: (e) => M(i)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, ht)
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
}, Tt = /* @__PURE__ */ re(bt, [["__scopeId", "data-v-e1ce2121"]]);
export {
  Tt as A
};
