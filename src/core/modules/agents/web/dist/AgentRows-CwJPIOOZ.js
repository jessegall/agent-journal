/* @code-commandments-generated */
import { computed as l, openBlock as u, createElementBlock as v, unref as o, createCommentVNode as T, createVNode as m, withCtx as x, ref as S, onUnmounted as ge, normalizeClass as ae, createElementVNode as g, toDisplayString as _, Fragment as X, withModifiers as de, createBlock as ie, renderList as ue, watch as re, createTextVNode as fe, normalizeStyle as we } from "vue";
import { useRows as U, AutoScrollPane as _e, RowList as ve, DiffCard as he, ago as ke, useNow as ye, age as ce, useWindow as pe, Icon as be, peekRef as ne, RunningCommand as Se, InnerTabs as $e, SwitchCase as Ce, FoldGroup as Te, TaskStatusIcon as xe, ordered as Ae, SearchBar as Ie, Segmented as De, Btn as Me } from "@journal/window-kit";
import { _ as se, T as Oe } from "./TranscriptRows-DMVGl_Ye.js";
const Re = { class: "file-feed" }, Ne = 5, qe = {
  __name: "AgentFileEdits",
  props: { agent: { type: Number, required: !0 } },
  setup(r) {
    const E = r, { rows: k, failure: L, loaded: B, more: a, older: R } = U(`file-edit list --agent ${E.agent}`, ["file_edit.create"], { incremental: !0 }), M = l(() => k.value.map((c) => ({ ...c, lines: JSON.parse(c.rows || "[]") })).reverse()), N = l(() => {
      var c;
      return ((c = k.value[0]) == null ? void 0 : c.id) ?? 0;
    });
    return (c, O) => (u(), v("div", Re, [
      o(a) && o(k).length ? (u(), v("button", {
        key: 0,
        type: "button",
        class: "file-feed-older",
        "data-file-feed-older": "",
        onClick: O[0] || (O[0] = (...f) => o(R) && o(R)(...f))
      }, "Show older edits")) : T("", !0),
      m(o(_e), { "row-count": N.value }, {
        default: x(() => [
          m(o(ve), {
            rows: M.value,
            failure: o(L),
            loaded: o(B),
            empty: "No edits by this agent yet",
            hint: "The files it changes show here as it works."
          }, {
            default: x(({ row: f }) => [
              m(o(he), {
                flush: "",
                lines: Ne,
                path: f.path,
                kind: f.edit_type,
                added: f.added,
                removed: f.removed,
                ago: o(ke)(f.created_at),
                rows: f.lines
              }, null, 8, ["path", "kind", "added", "removed", "ago", "rows"])
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ]),
        _: 1
      }, 8, ["row-count"])
    ]));
  }
}, Ee = /* @__PURE__ */ se(qe, [["__scopeId", "data-v-3fd4f736"]]), Le = ["data-agent-open", "aria-expanded", "title"], Be = { class: "agent-head" }, Fe = ["data-state"], Ve = {
  class: "agent-title",
  "data-agent-title": ""
}, We = {
  class: "agent-name",
  "data-agent-name": ""
}, je = { class: "agent-time" }, ze = { class: "agent-line" }, Ue = {
  class: "agent-identity",
  "data-agent-identity": ""
}, He = {
  key: 0,
  class: "agent-tasks",
  "data-agent-pace": ""
}, Ke = {
  class: "agent-tasks",
  "data-agent-tasks": ""
}, Pe = {
  key: 0,
  class: "agent-command",
  "data-agent-command": ""
}, Ge = {
  key: 0,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, Je = ["data-agent-tab-body"], Qe = ["data-agent-delegated", "onClick"], Xe = { class: "agent-task-number" }, Ye = { class: "agent-task-title" }, Ze = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, et = 36e5, tt = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, open: Boolean },
  emits: ["toggle"],
  setup(r, { emit: E }) {
    const k = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, L = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), B = ["started", "testing", "blocked", "open", "completed", "cancelled"], a = r, R = E, M = ye(), N = l(() => {
      var d;
      const t = ((d = a.facts) == null ? void 0 : d.profile) || k[a.row.role] || a.row.role;
      return t.slice(0, 1).toUpperCase() + t.slice(1);
    }), c = l(() => {
      var t;
      return ((t = a.facts) == null ? void 0 : t.tasks) ?? [];
    }), O = l(() => !a.row.ended_at && c.value.some((t) => t.state === "testing") && !c.value.some((t) => t.state === "started")), f = l(() => {
      var t;
      return [a.row.program, (t = a.facts) == null ? void 0 : t.model, a.row.role === "worker" ? `worker ${a.row.id}` : L.has(a.row.role) ? a.row.role : ""].filter(Boolean).join(" · ");
    }), Y = l(() => a.row.ended_at ? `${ce(a.row.ended_at, M.value)} ago` : ce(a.row.process_started_at || a.row.created_at, M.value)), y = l(() => {
      var t;
      return a.row.ended_at ? "closed" : O.value ? "waiting" : ((t = a.facts) == null ? void 0 : t.state) || "running";
    }), A = l(() => {
      var d, b, $;
      const t = [];
      return ((d = a.facts) == null ? void 0 : d.context_percent) !== null && ((b = a.facts) == null ? void 0 : b.context_percent) !== void 0 && t.push(`Context ${a.facts.context_percent}%`), ($ = a.facts) != null && $.cost_dollars && t.push(`$${a.facts.cost_dollars.toFixed(2)}`), t.join(" · ");
    }), F = l(() => c.value.filter((t) => t.state === "completed").length), h = l(() => `${F.value} of ${c.value.length} ${c.value.length === 1 ? "task" : "tasks"}`), I = l(() => {
      const t = Date.parse(a.row.process_started_at || a.row.created_at), b = ((a.row.ended_at ? Date.parse(a.row.ended_at) : M.value) - t) / et;
      return a.row.role === "worker" && b > 0 && F.value ? `${Math.round(F.value / b)}/h` : "";
    }), H = l(() => B.map((t) => ({ state: t, label: t.slice(0, 1).toUpperCase() + t.slice(1), tasks: c.value.filter((d) => d.state === t) })).filter((t) => t.tasks.length)), K = /* @__PURE__ */ new Set(["completed"]), V = S({}), W = (t) => !(V.value[t] ?? K.has(t)), Z = (t) => V.value = { ...V.value, [t]: W(t) }, j = pe(), q = S(j.tabs[0]), P = S(""), D = S(""), G = l(() => a.row.role !== "main" && !a.row.ended_at);
    async function J() {
      if (!G.value) return;
      const t = await j.read(`usage tool --agent ${a.row.id}`);
      P.value = t.ok ? t.value.tool : "", D.value = t.ok ? t.value.note : "";
    }
    const z = j.follow(["hook_call.*", "process_part.*"], J);
    return ge(() => z == null ? void 0 : z()), J(), (t, d) => {
      var b, $, Q;
      return u(), v("div", {
        class: ae(["agent-card", { open: r.open }]),
        "data-agent-open": r.row.id,
        "aria-expanded": r.open,
        title: r.row.session,
        onClick: d[3] || (d[3] = (C) => R("toggle"))
      }, [
        g("span", Be, [
          g("span", {
            class: "agent-dot",
            "data-state": y.value
          }, null, 8, Fe),
          g("span", Ve, _(N.value), 1),
          g("span", We, _(((b = r.facts) == null ? void 0 : b.given_name) || r.row.id), 1),
          g("span", je, _(Y.value), 1),
          m(o(be), {
            class: ae(["agent-chevron", { opened: r.open }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        g("span", ze, [
          g("span", Ue, _(f.value), 1),
          c.value.length ? (u(), v(X, { key: 0 }, [
            I.value ? (u(), v("span", He, _(I.value), 1)) : T("", !0),
            g("span", Ke, _(h.value), 1)
          ], 64)) : T("", !0)
        ]),
        G.value ? (u(), v("span", Pe, [
          O.value ? (u(), v("button", {
            key: 0,
            type: "button",
            class: "agent-waiting",
            "data-agent-waiting": "",
            title: "Open the test queue",
            onClick: d[0] || (d[0] = de((C) => o(ne)("test_queue:0"), ["stop"]))
          }, "Waiting: tests")) : (u(), ie(o(Se), {
            key: 1,
            text: P.value,
            idle: D.value || "thinking"
          }, null, 8, ["text", "idle"]))
        ])) : T("", !0),
        r.open ? (u(), v("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: d[2] || (d[2] = de(() => {
          }, ["stop"]))
        }, [
          A.value ? (u(), v("span", Ge, _(A.value), 1)) : T("", !0),
          m(o($e), {
            class: "agent-tabs",
            active: q.value,
            answer: { tasks: c.value.length },
            onChoose: d[1] || (d[1] = (C) => q.value = C)
          }, null, 8, ["active", "answer"]),
          g("div", {
            class: "agent-tab-body",
            "data-agent-tab-body": ($ = q.value) == null ? void 0 : $.key
          }, [
            m(o(Ce), {
              value: (Q = q.value) == null ? void 0 : Q.key
            }, {
              tasks: x(() => {
                var C;
                return [
                  (u(!0), v(X, null, ue(H.value, (p) => (u(), ie(o(Te), {
                    key: p.state,
                    label: p.label,
                    count: p.tasks.length,
                    open: W(p.state),
                    "data-agent-section": p.state,
                    onToggle: (w) => Z(p.state)
                  }, {
                    default: x(() => [
                      (u(!0), v(X, null, ue(p.tasks, (w) => (u(), v("button", {
                        key: w.id,
                        type: "button",
                        class: "agent-task",
                        "data-agent-delegated": w.id,
                        onClick: (ee) => o(ne)(`tasks:${w.id}`)
                      }, [
                        m(o(xe), {
                          status: w.state
                        }, null, 8, ["status"]),
                        g("span", Xe, _(w.id), 1),
                        g("span", Ye, _(w.title), 1)
                      ], 8, Qe))), 128))
                    ]),
                    _: 2
                  }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
                  (C = r.facts) != null && C.instruction ? (u(), v(X, { key: 0 }, [
                    d[4] || (d[4] = g("p", { class: "agent-label" }, "Instruction", -1)),
                    g("div", Ze, _(r.facts.instruction), 1)
                  ], 64)) : T("", !0)
                ];
              }),
              transcript: x(() => [
                m(Oe, {
                  line: `agent transcript ${r.row.id}`
                }, null, 8, ["line"])
              ]),
              "file-feed": x(() => [
                m(Ee, {
                  agent: r.row.id
                }, null, 8, ["agent"])
              ]),
              _: 1
            }, 8, ["value"])
          ], 8, Je)
        ])) : T("", !0)
      ], 10, Le);
    };
  }
}, at = /* @__PURE__ */ se(tt, [["__scopeId", "data-v-9baa7e26"]]), nt = { class: "agents-bar" }, st = {
  class: "agents-queue-count",
  "data-agents-queue-count": ""
}, ot = ["data-agent-row", "onMouseenter", "onMouseleave"], lt = {
  key: 0,
  class: "agent-leave",
  "data-agent-leave": "",
  "aria-hidden": "true"
}, te = 1e4, dt = 250, it = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) }, only: { type: Function, default: () => !0 } },
  setup(r) {
    const E = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], k = r, { rows: L, failure: B, loaded: a, more: R, older: M } = U(k.line, ["agent.*"], { incremental: !0 }), { rows: N } = U("agent running", ["agent.*"]), { rows: c } = U("usage agents --closed", ["agent.*", "task.*"]), { rows: O } = U("proof list --limit 50", ["proof.*"]), f = /* @__PURE__ */ new Set(["queued", "running"]), Y = l(() => O.value.filter((e) => f.has(e.state)).length), y = S("running"), A = S(""), F = S(Date.now()), h = S(/* @__PURE__ */ new Map()), I = S(/* @__PURE__ */ new Set());
    let H = Date.now(), K = /* @__PURE__ */ new Map();
    const V = setInterval(() => {
      const e = Date.now(), s = new Map(h.value);
      for (const [n, i] of s)
        I.value.has(n) ? s.set(n, { ...i, leavesAt: i.leavesAt + (e - H) }) : e >= i.leavesAt && s.delete(n);
      H = e, F.value = e, (s.size !== h.value.size || [...s].some(([n, i]) => i !== h.value.get(n))) && (h.value = s);
    }, dt);
    ge(() => clearInterval(V)), re(N, (e) => {
      const s = new Set(e.map((i) => i.id)), n = new Map(h.value);
      for (const [i, le] of K)
        !s.has(i) && !n.has(i) && n.set(i, { row: { ...le, ended_at: le.ended_at ?? (/* @__PURE__ */ new Date()).toISOString() }, leavesAt: Date.now() + te });
      for (const i of s) n.delete(i);
      K = new Map(e.map((i) => [i.id, i])), h.value = n;
    });
    const W = (e) => h.value.get(e.id) ?? null, Z = (e) => I.value = /* @__PURE__ */ new Set([...I.value, e.id]), j = (e) => I.value = new Set([...I.value].filter((s) => s !== e.id)), q = (e) => ({ animationDuration: `${te}ms`, animationDelay: `${Math.min(0, W(e).leavesAt - te - Date.now())}ms` }), P = (e) => y.value === "all" || y.value === "running" == !e.ended_at || y.value === "running" && h.value.has(e.id), D = (e) => c.value.find((s) => s.id === e.id) ?? null, G = (e) => {
      var s, n;
      return `${e.id} ${e.session} ${e.program} ${e.role} ${((s = D(e)) == null ? void 0 : s.profile) ?? ""} ${((n = D(e)) == null ? void 0 : n.given_name) ?? ""}`.toLowerCase().includes(A.value.trim().toLowerCase());
    }, J = l(() => y.value === "running" ? [...N.value, ...[...h.value.values()].map((e) => e.row)] : L.value), z = l(() => J.value.filter((e) => k.only(e) && P(e) && G(e))), t = pe().option("order"), d = (e) => {
      var s, n;
      return e.ended_at ? "stopped" : ((s = D(e)) == null ? void 0 : s.state) === "blocked" ? "waiting" : ((n = D(e)) == null ? void 0 : n.state) === "waiting" || e.paused_at ? "idle" : "working";
    }, b = (e) => ({ key: String(e.id), kind: e.role, n: e.id, time: Date.parse(e.updated_at ?? e.created_at ?? 0) / 1e3 || 0, card: { state: d(e) }, row: e }), $ = l(() => Ae(z.value.map(b), t.value ?? "number").map((e) => e.row)), Q = l(() => !!A.value.trim()), C = l(() => k.texts[y.value] ?? { title: k.empty, hint: "" }), p = S(null), w = l(() => $.value.find((e) => e.id === p.value) ?? null), ee = l(() => w.value ? [w.value] : $.value), oe = l(() => $.value.length - ee.value.length), me = (e) => p.value = p.value === e.id ? null : e.id;
    return re(A, (e) => e.trim() && (p.value = null)), (e, s) => (u(), v("div", {
      class: ae(["agents", { focused: w.value }])
    }, [
      g("div", nt, [
        m(o(Ie), {
          modelValue: A.value,
          "onUpdate:modelValue": s[2] || (s[2] = (n) => A.value = n),
          class: "agents-search",
          "data-agents-search": ""
        }, {
          default: x(() => [
            m(o(De), {
              options: E,
              value: y.value,
              onPick: s[0] || (s[0] = (n) => y.value = n)
            }, null, 8, ["value"]),
            m(o(Me), {
              small: "",
              bordered: "",
              title: "Open the test queue",
              "data-agents-queue": "",
              onClick: s[1] || (s[1] = (n) => o(ne)("test_queue:0"))
            }, {
              default: x(() => [
                s[4] || (s[4] = fe("Test queue ", -1)),
                g("span", st, _(Y.value), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      m(o(ve), {
        rows: ee.value,
        failure: o(B),
        loaded: o(a),
        more: o(R) && y.value !== "running",
        older: o(M),
        empty: C.value.title,
        hint: C.value.hint,
        searching: Q.value
      }, {
        default: x(({ row: n }) => [
          g("div", {
            class: "agent-row",
            "data-agent-row": n.id,
            onMouseenter: (i) => Z(n),
            onMouseleave: (i) => j(n)
          }, [
            m(at, {
              row: n,
              facts: D(n),
              open: n.id === p.value,
              onToggle: (i) => me(n)
            }, null, 8, ["row", "facts", "open", "onToggle"]),
            W(n) ? (u(), v("span", lt, [
              g("i", {
                style: we(q(n))
              }, null, 4)
            ])) : T("", !0)
          ], 40, ot)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty", "hint", "searching"]),
      w.value && oe.value ? (u(), v("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: s[3] || (s[3] = (n) => p.value = null)
      }, _(oe.value) + " more", 1)) : T("", !0)
    ], 2));
  }
}, gt = /* @__PURE__ */ se(it, [["__scopeId", "data-v-18d26825"]]);
export {
  gt as A
};
