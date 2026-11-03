/* @code-commandments-generated */
import { computed as l, openBlock as i, createElementBlock as g, unref as o, createCommentVNode as T, createVNode as m, withCtx as x, ref as S, onUnmounted as ce, normalizeClass as ne, createElementVNode as v, toDisplayString as k, createBlock as te, Fragment as X, withModifiers as ie, renderList as ue, watch as re, createTextVNode as me, normalizeStyle as fe } from "vue";
import { useRows as U, AutoScrollPane as we, RowList as ge, DiffCard as ke, useNow as _e, age as he, useWindow as ve, TimeAgo as ye, Icon as be, peekRef as se, RunningCommand as Se, InnerTabs as $e, SwitchCase as Ce, FoldGroup as Te, TaskStatusIcon as xe, ordered as Ae, SearchBar as Ie, Segmented as De, Btn as Me } from "@journal/window-kit";
import { _ as oe, T as Oe } from "./TranscriptRows-DhYd90lu.js";
const Re = { class: "file-feed" }, Ne = 5, qe = {
  __name: "AgentFileEdits",
  props: { agent: { type: Number, required: !0 } },
  setup(u) {
    const E = u, { rows: h, failure: L, loaded: B, more: a, older: O } = U(`file-edit list --agent ${E.agent}`, ["file_edit.create"], { incremental: !0 }), R = l(() => h.value.map((c) => ({ ...c, lines: JSON.parse(c.rows || "[]") })).reverse()), N = l(() => {
      var c;
      return ((c = h.value[0]) == null ? void 0 : c.id) ?? 0;
    });
    return (c, M) => (i(), g("div", Re, [
      o(a) && o(h).length ? (i(), g("button", {
        key: 0,
        type: "button",
        class: "file-feed-older",
        "data-file-feed-older": "",
        onClick: M[0] || (M[0] = (...f) => o(O) && o(O)(...f))
      }, "Show older edits")) : T("", !0),
      m(o(we), { "row-count": N.value }, {
        default: x(() => [
          m(o(ge), {
            rows: R.value,
            failure: o(L),
            loaded: o(B),
            empty: "No edits by this agent yet",
            hint: "The files it changes show here as it works."
          }, {
            default: x(({ row: f }) => [
              m(o(ke), {
                flush: "",
                lines: Ne,
                path: f.path,
                kind: f.edit_type,
                added: f.added,
                removed: f.removed,
                at: f.created_at,
                rows: f.lines
              }, null, 8, ["path", "kind", "added", "removed", "at", "rows"])
            ]),
            _: 1
          }, 8, ["rows", "failure", "loaded"])
        ]),
        _: 1
      }, 8, ["row-count"])
    ]));
  }
}, Ee = /* @__PURE__ */ oe(qe, [["__scopeId", "data-v-69712d4d"]]), Le = ["data-agent-open", "aria-expanded", "title"], Be = { class: "agent-head" }, Fe = ["data-state"], Ve = {
  class: "agent-title",
  "data-agent-title": ""
}, We = {
  class: "agent-name",
  "data-agent-name": ""
}, je = {
  key: 1,
  class: "agent-time"
}, ze = { class: "agent-line" }, Ue = {
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
  setup(u, { emit: E }) {
    const h = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, L = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), B = ["started", "testing", "blocked", "open", "completed", "cancelled"], a = u, O = E, R = _e(), N = l(() => {
      var d;
      const t = ((d = a.facts) == null ? void 0 : d.profile) || h[a.row.role] || a.row.role;
      return t.slice(0, 1).toUpperCase() + t.slice(1);
    }), c = l(() => {
      var t;
      return ((t = a.facts) == null ? void 0 : t.tasks) ?? [];
    }), M = l(() => !a.row.ended_at && c.value.some((t) => t.state === "testing") && !c.value.some((t) => t.state === "started")), f = l(() => {
      var t;
      return [a.row.program, (t = a.facts) == null ? void 0 : t.model, a.row.role === "worker" ? `worker ${a.row.id}` : L.has(a.row.role) ? a.row.role : ""].filter(Boolean).join(" · ");
    }), Y = l(() => he(a.row.process_started_at || a.row.created_at, R.value)), y = l(() => {
      var t;
      return a.row.ended_at ? "closed" : M.value ? "waiting" : ((t = a.facts) == null ? void 0 : t.state) || "running";
    }), A = l(() => {
      var d, b, $;
      const t = [];
      return ((d = a.facts) == null ? void 0 : d.context_percent) !== null && ((b = a.facts) == null ? void 0 : b.context_percent) !== void 0 && t.push(`Context ${a.facts.context_percent}%`), ($ = a.facts) != null && $.cost_dollars && t.push(`$${a.facts.cost_dollars.toFixed(2)}`), t.join(" · ");
    }), F = l(() => c.value.filter((t) => t.state === "completed").length), _ = l(() => `${F.value} of ${c.value.length} ${c.value.length === 1 ? "task" : "tasks"}`), I = l(() => {
      const t = Date.parse(a.row.process_started_at || a.row.created_at), b = ((a.row.ended_at ? Date.parse(a.row.ended_at) : R.value) - t) / et;
      return a.row.role === "worker" && b > 0 && F.value ? `${Math.round(F.value / b)}/h` : "";
    }), H = l(() => B.map((t) => ({ state: t, label: t.slice(0, 1).toUpperCase() + t.slice(1), tasks: c.value.filter((d) => d.state === t) })).filter((t) => t.tasks.length)), K = /* @__PURE__ */ new Set(["completed"]), V = S({}), W = (t) => !(V.value[t] ?? K.has(t)), Z = (t) => V.value = { ...V.value, [t]: W(t) }, j = ve(), q = S(j.tabs[0]), P = S(""), D = S(""), G = l(() => a.row.role !== "main" && !a.row.ended_at);
    async function J() {
      if (!G.value) return;
      const t = await j.read(`usage tool --agent ${a.row.id}`);
      P.value = t.ok ? t.value.tool : "", D.value = t.ok ? t.value.note : "";
    }
    const z = j.follow(["hook_call.*", "process_part.*"], J);
    return ce(() => z == null ? void 0 : z()), J(), (t, d) => {
      var b, $, Q;
      return i(), g("div", {
        class: ne(["agent-card", { open: u.open }]),
        "data-agent-open": u.row.id,
        "aria-expanded": u.open,
        title: u.row.session,
        onClick: d[3] || (d[3] = (C) => O("toggle"))
      }, [
        v("span", Be, [
          v("span", {
            class: "agent-dot",
            "data-state": y.value
          }, null, 8, Fe),
          v("span", Ve, k(N.value), 1),
          v("span", We, k(((b = u.facts) == null ? void 0 : b.given_name) || u.row.id), 1),
          u.row.ended_at ? (i(), te(o(ye), {
            key: 0,
            class: "agent-time",
            at: u.row.ended_at
          }, null, 8, ["at"])) : (i(), g("span", je, k(Y.value), 1)),
          m(o(be), {
            class: ne(["agent-chevron", { opened: u.open }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        v("span", ze, [
          v("span", Ue, k(f.value), 1),
          c.value.length ? (i(), g(X, { key: 0 }, [
            I.value ? (i(), g("span", He, k(I.value), 1)) : T("", !0),
            v("span", Ke, k(_.value), 1)
          ], 64)) : T("", !0)
        ]),
        G.value ? (i(), g("span", Pe, [
          M.value ? (i(), g("button", {
            key: 0,
            type: "button",
            class: "agent-waiting",
            "data-agent-waiting": "",
            title: "Open the test queue",
            onClick: d[0] || (d[0] = ie((C) => o(se)("test_queue:0"), ["stop"]))
          }, "Waiting: tests")) : (i(), te(o(Se), {
            key: 1,
            text: P.value,
            idle: D.value || "thinking"
          }, null, 8, ["text", "idle"]))
        ])) : T("", !0),
        u.open ? (i(), g("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: d[2] || (d[2] = ie(() => {
          }, ["stop"]))
        }, [
          A.value ? (i(), g("span", Ge, k(A.value), 1)) : T("", !0),
          m(o($e), {
            class: "agent-tabs",
            active: q.value,
            answer: { tasks: c.value.length },
            onChoose: d[1] || (d[1] = (C) => q.value = C)
          }, null, 8, ["active", "answer"]),
          v("div", {
            class: "agent-tab-body",
            "data-agent-tab-body": ($ = q.value) == null ? void 0 : $.key
          }, [
            m(o(Ce), {
              value: (Q = q.value) == null ? void 0 : Q.key
            }, {
              tasks: x(() => {
                var C;
                return [
                  (i(!0), g(X, null, ue(H.value, (p) => (i(), te(o(Te), {
                    key: p.state,
                    label: p.label,
                    count: p.tasks.length,
                    open: W(p.state),
                    "data-agent-section": p.state,
                    onToggle: (w) => Z(p.state)
                  }, {
                    default: x(() => [
                      (i(!0), g(X, null, ue(p.tasks, (w) => (i(), g("button", {
                        key: w.id,
                        type: "button",
                        class: "agent-task",
                        "data-agent-delegated": w.id,
                        onClick: (ee) => o(se)(`tasks:${w.id}`)
                      }, [
                        m(o(xe), {
                          status: w.state
                        }, null, 8, ["status"]),
                        v("span", Xe, k(w.id), 1),
                        v("span", Ye, k(w.title), 1)
                      ], 8, Qe))), 128))
                    ]),
                    _: 2
                  }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
                  (C = u.facts) != null && C.instruction ? (i(), g(X, { key: 0 }, [
                    d[4] || (d[4] = v("p", { class: "agent-label" }, "Instruction", -1)),
                    v("div", Ze, k(u.facts.instruction), 1)
                  ], 64)) : T("", !0)
                ];
              }),
              transcript: x(() => [
                m(Oe, {
                  line: `agent transcript ${u.row.id}`
                }, null, 8, ["line"])
              ]),
              "file-feed": x(() => [
                m(Ee, {
                  agent: u.row.id
                }, null, 8, ["agent"])
              ]),
              _: 1
            }, 8, ["value"])
          ], 8, Je)
        ])) : T("", !0)
      ], 10, Le);
    };
  }
}, at = /* @__PURE__ */ oe(tt, [["__scopeId", "data-v-06f378a6"]]), nt = { class: "agents-bar" }, st = {
  class: "agents-queue-count",
  "data-agents-queue-count": ""
}, ot = ["data-agent-row", "onMouseenter", "onMouseleave"], lt = {
  key: 0,
  class: "agent-leave",
  "data-agent-leave": "",
  "aria-hidden": "true"
}, ae = 1e4, dt = 250, it = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) }, only: { type: Function, default: () => !0 } },
  setup(u) {
    const E = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], h = u, { rows: L, failure: B, loaded: a, more: O, older: R } = U(h.line, ["agent.*"], { incremental: !0 }), { rows: N } = U("agent running", ["agent.*"]), { rows: c } = U("usage agents --closed", ["agent.*", "task.*"]), { rows: M } = U("proof list --limit 50", ["proof.*"]), f = /* @__PURE__ */ new Set(["queued", "running"]), Y = l(() => M.value.filter((e) => f.has(e.state)).length), y = S("running"), A = S(""), F = S(Date.now()), _ = S(/* @__PURE__ */ new Map()), I = S(/* @__PURE__ */ new Set());
    let H = Date.now(), K = /* @__PURE__ */ new Map();
    const V = setInterval(() => {
      const e = Date.now(), s = new Map(_.value);
      for (const [n, r] of s)
        I.value.has(n) ? s.set(n, { ...r, leavesAt: r.leavesAt + (e - H) }) : e >= r.leavesAt && s.delete(n);
      H = e, F.value = e, (s.size !== _.value.size || [...s].some(([n, r]) => r !== _.value.get(n))) && (_.value = s);
    }, dt);
    ce(() => clearInterval(V)), re(N, (e) => {
      const s = new Set(e.map((r) => r.id)), n = new Map(_.value);
      for (const [r, de] of K)
        !s.has(r) && !n.has(r) && n.set(r, { row: { ...de, ended_at: de.ended_at ?? (/* @__PURE__ */ new Date()).toISOString() }, leavesAt: Date.now() + ae });
      for (const r of s) n.delete(r);
      K = new Map(e.map((r) => [r.id, r])), _.value = n;
    });
    const W = (e) => _.value.get(e.id) ?? null, Z = (e) => I.value = /* @__PURE__ */ new Set([...I.value, e.id]), j = (e) => I.value = new Set([...I.value].filter((s) => s !== e.id)), q = (e) => ({ animationDuration: `${ae}ms`, animationDelay: `${Math.min(0, W(e).leavesAt - ae - Date.now())}ms` }), P = (e) => y.value === "all" || y.value === "running" == !e.ended_at || y.value === "running" && _.value.has(e.id), D = (e) => c.value.find((s) => s.id === e.id) ?? null, G = (e) => {
      var s, n;
      return `${e.id} ${e.session} ${e.program} ${e.role} ${((s = D(e)) == null ? void 0 : s.profile) ?? ""} ${((n = D(e)) == null ? void 0 : n.given_name) ?? ""}`.toLowerCase().includes(A.value.trim().toLowerCase());
    }, J = l(() => y.value === "running" ? [...N.value, ...[..._.value.values()].map((e) => e.row)] : L.value), z = l(() => J.value.filter((e) => h.only(e) && P(e) && G(e))), t = ve().option("order"), d = (e) => {
      var s, n;
      return e.ended_at ? "stopped" : ((s = D(e)) == null ? void 0 : s.state) === "blocked" ? "waiting" : ((n = D(e)) == null ? void 0 : n.state) === "waiting" || e.paused_at ? "idle" : "working";
    }, b = (e) => ({ key: String(e.id), kind: e.role, n: e.id, time: Date.parse(e.updated_at ?? e.created_at ?? 0) / 1e3 || 0, card: { state: d(e) }, row: e }), $ = l(() => Ae(z.value.map(b), t.value ?? "number").map((e) => e.row)), Q = l(() => !!A.value.trim()), C = l(() => h.texts[y.value] ?? { title: h.empty, hint: "" }), p = S(null), w = l(() => $.value.find((e) => e.id === p.value) ?? null), ee = l(() => w.value ? [w.value] : $.value), le = l(() => $.value.length - ee.value.length), pe = (e) => p.value = p.value === e.id ? null : e.id;
    return re(A, (e) => e.trim() && (p.value = null)), (e, s) => (i(), g("div", {
      class: ne(["agents", { focused: w.value }])
    }, [
      v("div", nt, [
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
              onClick: s[1] || (s[1] = (n) => o(se)("test_queue:0"))
            }, {
              default: x(() => [
                s[4] || (s[4] = me("Test queue ", -1)),
                v("span", st, k(Y.value), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      m(o(ge), {
        rows: ee.value,
        failure: o(B),
        loaded: o(a),
        more: o(O) && y.value !== "running",
        older: o(R),
        empty: C.value.title,
        hint: C.value.hint,
        searching: Q.value
      }, {
        default: x(({ row: n }) => [
          v("div", {
            class: "agent-row",
            "data-agent-row": n.id,
            onMouseenter: (r) => Z(n),
            onMouseleave: (r) => j(n)
          }, [
            m(at, {
              row: n,
              facts: D(n),
              open: n.id === p.value,
              onToggle: (r) => pe(n)
            }, null, 8, ["row", "facts", "open", "onToggle"]),
            W(n) ? (i(), g("span", lt, [
              v("i", {
                style: fe(q(n))
              }, null, 4)
            ])) : T("", !0)
          ], 40, ot)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty", "hint", "searching"]),
      w.value && le.value ? (i(), g("button", {
        key: 0,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: s[3] || (s[3] = (n) => p.value = null)
      }, k(le.value) + " more", 1)) : T("", !0)
    ], 2));
  }
}, gt = /* @__PURE__ */ oe(it, [["__scopeId", "data-v-9b832cd9"]]);
export {
  gt as A
};
