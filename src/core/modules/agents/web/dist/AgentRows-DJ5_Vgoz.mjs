/* @code-commandments-generated */
import { openBlock as l, createElementBlock as i, withModifiers as K, unref as g, createTextVNode as fe, toDisplayString as k, createVNode as b, createBlock as E, computed as c, ref as f, watch as ne, defineAsyncComponent as Se, onUnmounted as we, withKeys as ue, normalizeClass as re, createElementVNode as p, createCommentVNode as h, Fragment as H, withCtx as O, createSlots as $e, renderList as le, resolveDynamicComponent as Ce, nextTick as de } from "vue";
import { peekRef as ye, Icon as ie, RunningCommand as Re, useNow as xe, age as Te, useWindow as ke, loadWindowComponent as _e, TimeAgo as Ae, FoldGroup as ge, InnerTabs as Ee, SwitchCase as Oe, EmptyState as qe, TaskStatusIcon as Be, useRows as Ie, useDeclaredRows as ve, SearchBar as Ne, Segmented as Le, RowList as De } from "@journal/window-kit";
import { _ as ce, T as me } from "./TranscriptRows-D6C0YYQk.mjs";
const je = {
  class: "agent-command",
  "data-agent-command": ""
}, Ve = {
  key: 1,
  "data-agent-stopped": ""
}, We = {
  __name: "AgentCommand",
  props: { waitReason: { type: String, required: !0 }, stopped: Boolean, command: { type: String, required: !0 }, note: { type: String, required: !0 } },
  setup(n) {
    return (Y, x) => (l(), i("span", je, [
      n.waitReason ? (l(), i("button", {
        key: 0,
        type: "button",
        class: "agent-waiting",
        "data-agent-waiting": "",
        title: "Open the process queue",
        onClick: x[0] || (x[0] = K((G) => g(ye)("test_queue:0"), ["stop"]))
      }, [
        fe("Waiting: " + k(n.waitReason) + " ", 1),
        b(g(ie), {
          name: "arrow",
          size: 11
        })
      ])) : n.stopped ? (l(), i("span", Ve, "Waiting")) : (l(), E(g(Re), {
        key: 2,
        text: n.command,
        idle: n.note || "thinking"
      }, null, 8, ["text", "idle"]))
    ]));
  }
}, pe = /* @__PURE__ */ ce(We, [["__scopeId", "data-v-85dcf19e"]]), ze = ["data-agent-open", "aria-expanded", "role", "tabindex", "title"], Ue = { class: "agent-head" }, Fe = ["data-state"], Me = {
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
  "data-agent-pace": "",
  "data-agent-motion": ""
}, Je = {
  class: "agent-tasks",
  "data-agent-tasks": "",
  "data-agent-motion": ""
}, Qe = {
  key: 0,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, Xe = {
  key: 2,
  class: "agent-tab-body",
  "data-agent-tab-body": "transcript",
  "data-agent-only-transcript": ""
}, Ze = {
  key: 0,
  class: "agent-subagent-brief"
}, et = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, tt = ["data-agent-tab-body"], at = ["data-agent-delegated", "onClick"], nt = { class: "agent-task-number" }, ot = { class: "agent-task-title" }, st = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, lt = 36e5, rt = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, progress: { type: Object, default: null }, waitReason: { type: String, default: "" }, open: Boolean },
  emits: ["toggle"],
  setup(n, { emit: Y }) {
    const x = { subagent: "Subagent", reviewer: "Reviewer" }, G = ["started", "blocked", "open", "completed"], t = n, I = Y, J = xe(), oe = c(() => {
      var a;
      const e = ((a = t.facts) == null ? void 0 : a.profile) || x[t.row.role] || t.row.role;
      return e.slice(0, 1).toUpperCase() + e.slice(1);
    }), w = c(() => {
      var e;
      return ((e = t.facts) == null ? void 0 : e.tasks) ?? [];
    }), T = c(() => {
      var e, a;
      return [t.row.program, (e = t.facts) == null ? void 0 : e.model, (a = t.facts) == null ? void 0 : a.effort, t.row.role === "main" ? "" : t.progress ? `${t.row.role} ${t.row.id}` : t.row.role].filter(Boolean).join(" · ");
    }), W = c(() => Te(t.row.process_started_at || t.row.created_at, J.value)), Q = /* @__PURE__ */ new Set(["open", "started", "testing"]), _ = c(() => !!t.row.ended_at && t.row.role !== "main" && w.value.some((e) => Q.has(e.state))), X = c(() => {
      var e;
      return t.waitReason || _.value ? "waiting" : t.row.state === "running" && ((e = t.facts) == null ? void 0 : e.state) || t.row.state;
    }), z = c(() => {
      var a, s, o;
      const e = [];
      return ((a = t.facts) == null ? void 0 : a.context_percent) !== null && ((s = t.facts) == null ? void 0 : s.context_percent) !== void 0 && e.push(`Context: ${t.facts.context_percent}%`), (o = t.facts) != null && o.cost_dollars && e.push(`$${t.facts.cost_dollars.toFixed(2)}`), e.join(" · ");
    }), q = c(() => {
      var e;
      return ((e = t.progress) == null ? void 0 : e.completed_count) ?? w.value.filter((a) => a.state === "completed").length;
    }), N = c(() => {
      var e;
      return ((e = t.progress) == null ? void 0 : e.task_count) ?? w.value.length;
    }), L = c(() => `${q.value} of ${N.value} ${N.value === 1 ? "task" : "tasks"}`), Z = c(() => {
      var r;
      const e = Date.parse(((r = t.progress) == null ? void 0 : r.started_at) || t.row.created_at), a = t.progress ? t.progress.finished_at : t.row.ended_at, o = ((a ? Date.parse(a) : J.value) - e) / lt;
      return t.row.role !== "main" && o > 0 && q.value ? `${Math.round(q.value / o)}/h` : "";
    }), se = c(() => w.value.length ? G.map((e) => ({ state: e, label: e.slice(0, 1).toUpperCase() + e.slice(1), tasks: w.value.filter((a) => a.state === e || e === "started" && a.state === "testing" || e === "completed" && a.state === "cancelled") })) : []), U = /* @__PURE__ */ new Set(["completed"]), F = f({}), M = (e) => !(F.value[e] ?? U.has(e)), S = (e) => F.value = { ...F.value, [e]: M(e) }, y = ke(), C = f(y.tabs[0]);
    ne(() => t.open, (e) => {
      e && (C.value = y.tabs[0]);
    });
    const R = Object.fromEntries(y.tabs.filter((e) => e.component).map((e) => [e.key, Se(() => _e(e.component))])), ee = c(() => t.row.role === "subagent" || t.row.role === "reviewer"), D = f(!1), A = f(""), $ = f(""), j = c(() => t.row.role !== "main" && (!t.row.ended_at || _.value || t.waitReason));
    async function te() {
      if (!j.value) return;
      const e = await y.read(`usage tool --agent ${t.row.id}`);
      A.value = e.ok ? e.value.tool : "", $.value = e.ok ? e.value.note : "";
    }
    const B = y.follow(["hook_call.*", "process_part.*"], te);
    return we(() => B == null ? void 0 : B()), te(), (e, a) => {
      var s, o, r, v;
      return l(), i("div", {
        class: re(["agent-card", { open: n.open }]),
        "data-agent-open": n.row.id,
        "aria-expanded": n.open,
        role: n.open ? void 0 : "button",
        tabindex: n.open ? void 0 : 0,
        title: n.row.session,
        onClick: a[4] || (a[4] = (m) => !n.open && I("toggle")),
        onKeydown: [
          a[5] || (a[5] = ue(K((m) => !n.open && I("toggle"), ["self", "prevent"]), ["enter"])),
          a[6] || (a[6] = ue(K((m) => !n.open && I("toggle"), ["self", "prevent"]), ["space"]))
        ]
      }, [
        p("span", Ue, [
          n.open ? (l(), i("button", {
            key: 0,
            type: "button",
            class: "agent-back",
            title: "Back to the list",
            "aria-label": "Back to the list",
            onClick: a[0] || (a[0] = K((m) => I("toggle"), ["stop"]))
          }, [
            b(g(ie), {
              name: "chevronRight",
              facing: "left",
              size: 14
            })
          ])) : h("", !0),
          p("span", {
            class: "agent-dot",
            "data-state": X.value,
            "data-agent-motion": ""
          }, null, 8, Fe),
          p("span", Me, k(oe.value), 1),
          p("span", Pe, k(((s = n.facts) == null ? void 0 : s.given_name) || n.row.id), 1),
          n.open ? h("", !0) : (l(), E(g(ie), {
            key: 1,
            class: "agent-chevron",
            name: "chevronRight",
            size: 12
          })),
          n.row.ended_at && !_.value ? (l(), E(g(Ae), {
            key: 2,
            class: "agent-time",
            at: n.row.ended_at,
            "data-agent-motion": ""
          }, null, 8, ["at"])) : (l(), i("span", He, k(W.value), 1))
        ]),
        p("span", Ke, [
          p("span", Ye, k(T.value), 1),
          N.value ? (l(), i(H, { key: 0 }, [
            Z.value ? (l(), i("span", Ge, k(Z.value), 1)) : h("", !0),
            p("span", Je, k(L.value), 1)
          ], 64)) : h("", !0)
        ]),
        j.value && !n.open ? (l(), E(pe, {
          key: 0,
          class: "agent-command",
          "wait-reason": n.waitReason,
          stopped: _.value,
          command: A.value,
          note: $.value
        }, null, 8, ["wait-reason", "stopped", "command", "note"])) : h("", !0),
        n.open ? (l(), i("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: a[3] || (a[3] = K(() => {
          }, ["stop"]))
        }, [
          z.value ? (l(), i("span", Qe, k(z.value), 1)) : h("", !0),
          j.value ? (l(), E(pe, {
            key: 1,
            class: "agent-command",
            "wait-reason": n.waitReason,
            stopped: _.value,
            command: A.value,
            note: $.value
          }, null, 8, ["wait-reason", "stopped", "command", "note"])) : h("", !0),
          ee.value ? (l(), i("div", Xe, [
            (o = n.facts) != null && o.instruction ? (l(), i("div", Ze, [
              b(g(ge), {
                label: "Instruction",
                open: D.value,
                "data-agent-section": "instruction",
                onToggle: a[1] || (a[1] = (m) => D.value = !D.value)
              }, {
                default: O(() => [
                  p("div", et, k(n.facts.instruction), 1)
                ]),
                _: 1
              }, 8, ["open"])
            ])) : h("", !0),
            b(me, {
              line: `agent transcript ${n.row.id}`,
              padding: "0"
            }, null, 8, ["line"])
          ])) : (l(), i(H, { key: 3 }, [
            b(g(Ee), {
              class: "agent-tabs",
              active: C.value,
              answer: { tasks: w.value.length },
              onChoose: a[2] || (a[2] = (m) => C.value = m)
            }, null, 8, ["active", "answer"]),
            p("div", {
              class: "agent-tab-body",
              "data-agent-tab-body": (r = C.value) == null ? void 0 : r.key
            }, [
              b(g(Oe), {
                value: (v = C.value) == null ? void 0 : v.key
              }, $e({
                tasks: O(() => {
                  var m;
                  return [
                    w.value.length ? h("", !0) : (l(), E(g(qe), {
                      key: 0,
                      title: "No tasks"
                    }, {
                      default: O(() => [...a[7] || (a[7] = [
                        fe("No tasks have been assigned to this agent.", -1)
                      ])]),
                      _: 1
                    })),
                    (l(!0), i(H, null, le(se.value, (u) => (l(), E(g(ge), {
                      key: u.state,
                      label: u.label,
                      count: u.tasks.length,
                      open: M(u.state),
                      "data-agent-section": u.state,
                      onToggle: (d) => S(u.state)
                    }, {
                      default: O(() => [
                        (l(!0), i(H, null, le(u.tasks, (d) => (l(), i("button", {
                          key: d.id,
                          type: "button",
                          class: "agent-task",
                          "data-agent-delegated": d.id,
                          onClick: (P) => g(ye)(`tasks:${d.id}`)
                        }, [
                          b(g(Be), {
                            status: d.state
                          }, null, 8, ["status"]),
                          p("span", nt, k(d.id), 1),
                          p("span", ot, k(d.title), 1)
                        ], 8, at))), 128))
                      ]),
                      _: 2
                    }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
                    (m = n.facts) != null && m.instruction ? (l(), i(H, { key: 1 }, [
                      a[8] || (a[8] = p("p", { class: "agent-label" }, "Instruction", -1)),
                      p("div", st, k(n.facts.instruction), 1)
                    ], 64)) : h("", !0)
                  ];
                }),
                transcript: O(() => [
                  b(me, {
                    line: `agent transcript ${n.row.id}`,
                    padding: "0"
                  }, null, 8, ["line"])
                ]),
                _: 2
              }, [
                le(g(R), (m, u) => ({
                  name: u,
                  fn: O(() => [
                    (l(), E(Ce(m), {
                      agent: n.row.id
                    }, null, 8, ["agent"]))
                  ])
                }))
              ]), 1032, ["value"])
            ], 8, tt)
          ], 64))
        ])) : h("", !0)
      ], 42, ze);
    };
  }
}, it = /* @__PURE__ */ ce(rt, [["__scopeId", "data-v-7b879b0d"]]), ct = ["data-agent-row"], ae = "cubic-bezier(0.2, 0.9, 0.25, 1)", ut = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) } },
  setup(n) {
    const Y = [
      { key: "running", label: "Running" },
      { key: "idle", label: "Idle" },
      { key: "retired", label: "Retired" },
      { key: "all", label: "All" }
    ], x = n, { rows: G } = Ie("usage agents --closed", ["agent.*", "task.*"]), { rows: t } = ve("waits"), { rows: I } = ve("progress"), J = (s) => I.value.find((o) => o.agent_id === s.id) ?? null, oe = (s) => {
      var o;
      return ((o = t.value.find((r) => r.agent_id === s.id)) == null ? void 0 : o.reason) ?? "";
    }, w = f("running"), T = f(""), W = ke(), Q = f([]), _ = f(""), X = f(!1), z = f(!1), q = f(25);
    let N = 0;
    async function L() {
      const s = ++N, o = await W.read(`${x.line} --show ${w.value} --search ${JSON.stringify(T.value)} --limit ${q.value}`);
      s === N && (Q.value = o.ok ? o.value.rows : [], _.value = o.ok ? "" : o.error, z.value = o.ok && o.value.page * o.value.size < o.value.total, X.value = !0);
    }
    async function Z() {
      return q.value += 25, await L(), !0;
    }
    ne([w, T], () => {
      q.value = 25, L();
    }), W.follow(["agent.*", "task.*", ...W.sources.flatMap((s) => s.events)], L), L();
    const se = (s) => G.value.find((o) => o.id === s.id) ?? null, U = Q, F = c(() => !!T.value.trim()), M = c(() => x.texts[w.value] ?? { title: x.empty, hint: "" }), S = f(null), y = f(null), C = f(null), R = c(() => U.value.find((s) => s.id === S.value) ?? null), ee = c(() => R.value ? [R.value] : U.value), D = c(() => U.value.length - ee.value.length), A = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let $ = !1, j = 0;
    async function te(s) {
      if ($) return;
      $ = !0, j = C.value.scrollTop;
      const o = y.value.querySelector(`[data-agent-open="${s.id}"]`);
      if (!A()) {
        const u = [...y.value.querySelectorAll(".agent-row")].filter((d) => !d.contains(o));
        await Promise.all(u.map((d) => d.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 140, fill: "forwards" }).finished));
      }
      const r = [...o.querySelectorAll(".agent-head, .agent-line")], v = [...r, ...o.querySelectorAll("[data-agent-motion]")], m = v.map((u) => u.getBoundingClientRect());
      if (S.value = s.id, await de(), !A()) {
        const u = v.map((d) => d.getBoundingClientRect());
        v.forEach((d, P) => {
          const V = r.indexOf(d.parentElement), he = m[P].left - u[P].left - (V < 0 ? 0 : m[V].left - u[V].left), be = m[P].top - u[P].top - (V < 0 ? 0 : m[V].top - u[V].top);
          d.animate([{ transform: `translate(${he}px, ${be}px)` }, { transform: "none" }], { duration: 280, easing: ae });
        }), y.value.querySelectorAll(".agent-usage, .agent-more > .agent-command, .agent-tabs, .agent-tab-body, .agents-held").forEach((d) => {
          d.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 240, delay: 60, easing: ae, fill: "backwards" });
        });
      }
      $ = !1;
    }
    async function B() {
      if ($ || !R.value) return;
      $ = !0;
      const s = y.value.querySelector(`[data-agent-open="${S.value}"]`), o = [...s.children, ...y.value.querySelectorAll(".agents-held")], r = A() ? [] : o.map((v) => v.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, fill: "forwards" }));
      await Promise.all(r.map((v) => v.finished)), S.value = null, await de(), C.value.scrollTop = j, r.forEach((v) => v.cancel()), A() || (s.animate([{ transform: "translateY(-12px)" }, { transform: "none" }], { duration: 280, easing: ae }), y.value.querySelectorAll(".agent-row").forEach((v) => {
        v.contains(s) || v.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160, easing: ae });
      })), $ = !1;
    }
    const e = (s) => S.value === s.id ? B() : te(s);
    ne(T, (s) => s.trim() && (S.value = null)), ne(w, () => {
      S.value = null;
    });
    const a = (s) => {
      s.key === "Escape" && B();
    };
    return window.addEventListener("keydown", a), we(() => window.removeEventListener("keydown", a)), (s, o) => (l(), i("div", {
      ref_key: "agents",
      ref: y,
      class: re(["agents", { focused: R.value }])
    }, [
      b(g(Ne), {
        modelValue: T.value,
        "onUpdate:modelValue": o[1] || (o[1] = (r) => T.value = r),
        placeholder: "Search agents",
        "data-agents-search": ""
      }, {
        default: O(() => [
          b(g(Le), {
            options: Y,
            value: w.value,
            onPick: o[0] || (o[0] = (r) => w.value = r)
          }, null, 8, ["value"])
        ]),
        _: 1
      }, 8, ["modelValue"]),
      p("div", {
        ref_key: "list",
        ref: C,
        class: re(["agents-view", { "agents-view-open": R.value }])
      }, [
        b(g(De), {
          rows: ee.value,
          failure: _.value,
          loaded: X.value,
          more: !R.value && z.value,
          older: Z,
          empty: M.value.title,
          hint: M.value.hint,
          searching: F.value
        }, {
          default: O(({ row: r }) => [
            p("div", {
              class: "agent-row",
              "data-agent-row": r.id
            }, [
              b(it, {
                row: r,
                facts: se(r),
                progress: J(r),
                "wait-reason": oe(r),
                open: r.id === S.value,
                onToggle: (v) => e(r)
              }, null, 8, ["row", "facts", "progress", "wait-reason", "open", "onToggle"])
            ], 8, ct)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "more", "empty", "hint", "searching"])
      ], 2),
      R.value && D.value ? (l(), i("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: B
      }, k(D.value) + " more", 1)) : h("", !0)
    ], 2));
  }
}, mt = /* @__PURE__ */ ce(ut, [["__scopeId", "data-v-aae3aacb"]]);
export {
  mt as A
};
