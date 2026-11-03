/* @code-commandments-generated */
import { computed as o, openBlock as r, createBlock as le, unref as l, withCtx as O, createVNode as p, ref as k, onUnmounted as we, createElementBlock as g, normalizeClass as ie, createElementVNode as c, toDisplayString as v, Fragment as Y, createCommentVNode as $, withModifiers as ve, renderList as pe, watch as me, createTextVNode as Se, normalizeStyle as $e } from "vue";
import { useRows as H, RowList as he, DiffCard as Ce, ago as Te, useNow as xe, age as fe, useWindow as _e, Icon as Ie, peekRef as de, RunningCommand as Ae, InnerTabs as De, SwitchCase as Oe, FoldGroup as Ne, TaskStatusIcon as Me, ordered as Re, hiddenBy as Ee, hiddenSummary as qe, SearchBar as Be, Segmented as Le, Btn as je } from "@journal/window-kit";
import { _ as ke, T as Fe } from "./TranscriptRows-BFAiJvDF.js";
const Ve = 5, Ke = {
  __name: "AgentFileEdits",
  props: { agent: { type: Number, required: !0 } },
  setup(u) {
    const q = u, { rows: C, failure: B, loaded: L, more: a, older: j } = H(`file-edit list --agent ${q.agent}`, ["file_edit.create"], { incremental: !0 }), N = o(() => C.value.map((T) => ({ ...T, lines: JSON.parse(T.rows || "[]") })));
    return (T, m) => (r(), le(l(he), {
      rows: N.value,
      failure: l(B),
      loaded: l(L),
      more: l(a),
      older: l(j),
      empty: "No edits by this agent yet",
      hint: "The files it changes show here as it works."
    }, {
      default: O(({ row: f }) => [
        p(l(Ce), {
          flush: "",
          lines: Ve,
          path: f.path,
          kind: f.edit_type,
          added: f.added,
          removed: f.removed,
          ago: l(Te)(f.created_at),
          rows: f.lines
        }, null, 8, ["path", "kind", "added", "removed", "ago", "rows"])
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "more", "older"]));
  }
}, We = ["data-agent-open", "aria-expanded", "title"], ze = { class: "agent-head" }, He = ["data-state"], Ue = {
  class: "agent-title",
  "data-agent-title": ""
}, Ge = {
  class: "agent-name",
  "data-agent-name": ""
}, Pe = { class: "agent-time" }, Je = { class: "agent-line" }, Qe = {
  class: "agent-identity",
  "data-agent-identity": ""
}, Xe = {
  key: 0,
  class: "agent-tasks",
  "data-agent-pace": ""
}, Ye = {
  class: "agent-tasks",
  "data-agent-tasks": ""
}, Ze = {
  key: 0,
  class: "agent-command",
  "data-agent-command": ""
}, et = {
  key: 0,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, tt = ["data-agent-tab-body"], at = ["data-agent-delegated", "onClick"], nt = { class: "agent-task-number" }, st = { class: "agent-task-title" }, ot = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, lt = 36e5, it = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, open: Boolean },
  emits: ["toggle"],
  setup(u, { emit: q }) {
    const C = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, B = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), L = ["started", "testing", "blocked", "open", "completed", "cancelled"], a = u, j = q, N = xe(), T = o(() => {
      var i;
      const t = ((i = a.facts) == null ? void 0 : i.profile) || C[a.row.role] || a.row.role;
      return t.slice(0, 1).toUpperCase() + t.slice(1);
    }), m = o(() => {
      var t;
      return ((t = a.facts) == null ? void 0 : t.tasks) ?? [];
    }), f = o(() => !a.row.ended_at && m.value.some((t) => t.state === "testing") && !m.value.some((t) => t.state === "started")), Z = o(() => {
      var t;
      return [a.row.program, (t = a.facts) == null ? void 0 : t.model, a.row.role === "worker" ? `worker ${a.row.id}` : B.has(a.row.role) ? a.row.role : ""].filter(Boolean).join(" · ");
    }), ee = o(() => a.row.ended_at ? `${fe(a.row.ended_at, N.value)} ago` : fe(a.row.process_started_at || a.row.created_at, N.value)), _ = o(() => {
      var t;
      return a.row.ended_at ? "closed" : f.value ? "waiting" : ((t = a.facts) == null ? void 0 : t.state) || "running";
    }), x = o(() => {
      var i, h, M;
      const t = [];
      return ((i = a.facts) == null ? void 0 : i.context_percent) !== null && ((h = a.facts) == null ? void 0 : h.context_percent) !== void 0 && t.push(`Context ${a.facts.context_percent}%`), (M = a.facts) != null && M.cost_dollars && t.push(`$${a.facts.cost_dollars.toFixed(2)}`), t.join(" · ");
    }), F = o(() => m.value.filter((t) => t.state === "completed").length), w = o(() => `${F.value} of ${m.value.length} ${m.value.length === 1 ? "task" : "tasks"}`), I = o(() => {
      const t = Date.parse(a.row.process_started_at || a.row.created_at), h = ((a.row.ended_at ? Date.parse(a.row.ended_at) : N.value) - t) / lt;
      return a.row.role === "worker" && h > 0 && F.value ? `${Math.round(F.value / h)}/h` : "";
    }), U = o(() => L.map((t) => ({ state: t, label: t.slice(0, 1).toUpperCase() + t.slice(1), tasks: m.value.filter((i) => i.state === t) })).filter((t) => t.tasks.length)), G = /* @__PURE__ */ new Set(["completed"]), V = k({}), K = (t) => !(V.value[t] ?? G.has(t)), te = (t) => V.value = { ...V.value, [t]: K(t) }, W = _e(), R = k(W.tabs[0]), P = k(""), A = k(""), J = o(() => a.row.role !== "main" && !a.row.ended_at);
    async function Q() {
      if (!J.value) return;
      const t = await W.read(`usage tool --agent ${a.row.id}`);
      P.value = t.ok ? t.value.tool : "", A.value = t.ok ? t.value.note : "";
    }
    const z = W.follow(["hook_call.*", "process_part.*"], Q);
    return we(() => z == null ? void 0 : z()), Q(), (t, i) => {
      var h, M, D;
      return r(), g("div", {
        class: ie(["agent-card", { open: u.open }]),
        "data-agent-open": u.row.id,
        "aria-expanded": u.open,
        title: u.row.session,
        onClick: i[3] || (i[3] = (y) => j("toggle"))
      }, [
        c("span", ze, [
          c("span", {
            class: "agent-dot",
            "data-state": _.value
          }, null, 8, He),
          c("span", Ue, v(T.value), 1),
          c("span", Ge, v(((h = u.facts) == null ? void 0 : h.given_name) || u.row.id), 1),
          c("span", Pe, v(ee.value), 1),
          p(l(Ie), {
            class: ie(["agent-chevron", { opened: u.open }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        c("span", Je, [
          c("span", Qe, v(Z.value), 1),
          m.value.length ? (r(), g(Y, { key: 0 }, [
            I.value ? (r(), g("span", Xe, v(I.value), 1)) : $("", !0),
            c("span", Ye, v(w.value), 1)
          ], 64)) : $("", !0)
        ]),
        J.value ? (r(), g("span", Ze, [
          f.value ? (r(), g("button", {
            key: 0,
            type: "button",
            class: "agent-waiting",
            "data-agent-waiting": "",
            title: "Open the test queue",
            onClick: i[0] || (i[0] = ve((y) => l(de)("test_queue:0"), ["stop"]))
          }, "Waiting: tests")) : (r(), le(l(Ae), {
            key: 1,
            text: P.value,
            idle: A.value || "thinking"
          }, null, 8, ["text", "idle"]))
        ])) : $("", !0),
        u.open ? (r(), g("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: i[2] || (i[2] = ve(() => {
          }, ["stop"]))
        }, [
          x.value ? (r(), g("span", et, v(x.value), 1)) : $("", !0),
          p(l(De), {
            class: "agent-tabs",
            active: R.value,
            answer: { tasks: m.value.length },
            onChoose: i[1] || (i[1] = (y) => R.value = y)
          }, null, 8, ["active", "answer"]),
          c("div", {
            class: "agent-tab-body",
            "data-agent-tab-body": (M = R.value) == null ? void 0 : M.key
          }, [
            p(l(Oe), {
              value: (D = R.value) == null ? void 0 : D.key
            }, {
              tasks: O(() => {
                var y;
                return [
                  (r(!0), g(Y, null, pe(U.value, (b) => (r(), le(l(Ne), {
                    key: b.state,
                    label: b.label,
                    count: b.tasks.length,
                    open: K(b.state),
                    "data-agent-section": b.state,
                    onToggle: (S) => te(b.state)
                  }, {
                    default: O(() => [
                      (r(!0), g(Y, null, pe(b.tasks, (S) => (r(), g("button", {
                        key: S.id,
                        type: "button",
                        class: "agent-task",
                        "data-agent-delegated": S.id,
                        onClick: (ae) => l(de)(`tasks:${S.id}`)
                      }, [
                        p(l(Me), {
                          status: S.state
                        }, null, 8, ["status"]),
                        c("span", nt, v(S.id), 1),
                        c("span", st, v(S.title), 1)
                      ], 8, at))), 128))
                    ]),
                    _: 2
                  }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
                  (y = u.facts) != null && y.instruction ? (r(), g(Y, { key: 0 }, [
                    i[4] || (i[4] = c("p", { class: "agent-label" }, "Instruction", -1)),
                    c("div", ot, v(u.facts.instruction), 1)
                  ], 64)) : $("", !0)
                ];
              }),
              transcript: O(() => [
                p(Fe, {
                  line: `agent transcript ${u.row.id}`
                }, null, 8, ["line"])
              ]),
              "file-feed": O(() => [
                p(Ke, {
                  agent: u.row.id
                }, null, 8, ["agent"])
              ]),
              _: 1
            }, 8, ["value"])
          ], 8, tt)
        ])) : $("", !0)
      ], 10, We);
    };
  }
}, dt = /* @__PURE__ */ ke(it, [["__scopeId", "data-v-d1df82bf"]]), rt = { class: "agents-bar" }, ut = {
  class: "agents-queue-count",
  "data-agents-queue-count": ""
}, ct = {
  key: 0,
  class: "agents-hidden",
  "data-agents-hidden": ""
}, gt = ["data-agent-row", "onMouseenter", "onMouseleave"], vt = {
  key: 0,
  class: "agent-leave",
  "data-agent-leave": "",
  "aria-hidden": "true"
}, oe = 1e4, pt = 250, mt = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) }, only: { type: Function, default: () => !0 } },
  setup(u) {
    const q = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], C = u, { rows: B, failure: L, loaded: a, more: j, older: N } = H(C.line, ["agent.*"], { incremental: !0 }), { rows: T } = H("agent running", ["agent.*"]), { rows: m } = H("usage agents --closed", ["agent.*", "task.*"]), { rows: f } = H("proof list --limit 50", ["proof.*"]), Z = /* @__PURE__ */ new Set(["queued", "running"]), ee = o(() => f.value.filter((e) => Z.has(e.state)).length), _ = k("running"), x = k(""), F = k(Date.now()), w = k(/* @__PURE__ */ new Map()), I = k(/* @__PURE__ */ new Set());
    let U = Date.now(), G = /* @__PURE__ */ new Map();
    const V = setInterval(() => {
      const e = Date.now(), s = new Map(w.value);
      for (const [n, d] of s)
        I.value.has(n) ? s.set(n, { ...d, leavesAt: d.leavesAt + (e - U) }) : e >= d.leavesAt && s.delete(n);
      U = e, F.value = e, (s.size !== w.value.size || [...s].some(([n, d]) => d !== w.value.get(n))) && (w.value = s);
    }, pt);
    we(() => clearInterval(V)), me(T, (e) => {
      const s = new Set(e.map((d) => d.id)), n = new Map(w.value);
      for (const [d, ge] of G)
        !s.has(d) && !n.has(d) && n.set(d, { row: { ...ge, ended_at: ge.ended_at ?? (/* @__PURE__ */ new Date()).toISOString() }, leavesAt: Date.now() + oe });
      for (const d of s) n.delete(d);
      G = new Map(e.map((d) => [d.id, d])), w.value = n;
    });
    const K = (e) => w.value.get(e.id) ?? null, te = (e) => I.value = /* @__PURE__ */ new Set([...I.value, e.id]), W = (e) => I.value = new Set([...I.value].filter((s) => s !== e.id)), R = (e) => ({ animationDuration: `${oe}ms`, animationDelay: `${Math.min(0, K(e).leavesAt - oe - Date.now())}ms` }), P = (e) => _.value === "all" || _.value === "running" == !e.ended_at || _.value === "running" && w.value.has(e.id), A = (e) => m.value.find((s) => s.id === e.id) ?? null, J = (e) => {
      var s, n;
      return `${e.id} ${e.session} ${e.program} ${e.role} ${((s = A(e)) == null ? void 0 : s.profile) ?? ""} ${((n = A(e)) == null ? void 0 : n.given_name) ?? ""}`.toLowerCase().includes(x.value.trim().toLowerCase());
    }, Q = o(() => _.value === "running" ? [...T.value, ...[...w.value.values()].map((e) => e.row)] : B.value), z = o(() => Q.value.filter((e) => C.only(e) && P(e) && J(e))), t = _e(), i = ["working", "waiting", "idle", "stopped"], h = ["environment", "worker", "subagent"], M = { main: "environment", worker: "worker", subagent: "subagent" }, D = Object.fromEntries([...i, ...h, "order", "every"].map((e) => [e, t.option(e)])), y = o(() => ({
      states: Object.fromEntries(i.map((e) => [e, D.every.value || D[e].value !== !1])),
      kinds: Object.fromEntries(h.map((e) => [e, D.every.value || D[e].value !== !1]))
    })), b = (e) => {
      var s, n;
      return e.ended_at ? "stopped" : ((s = A(e)) == null ? void 0 : s.state) === "blocked" ? "waiting" : ((n = A(e)) == null ? void 0 : n.state) === "waiting" || e.paused_at ? "idle" : "working";
    }, S = (e) => ({ key: String(e.id), kind: M[e.role] ?? e.role, n: e.id, time: Date.parse(e.updated_at ?? e.created_at ?? 0) / 1e3 || 0, card: { state: b(e) }, row: e }), ae = o(() => z.value.map(S)), ne = o(() => Re(ae.value.filter((e) => !Ee(e, y.value)), D.order.value ?? "number").map((e) => e.row)), se = o(() => qe(ae.value, y.value).join(", ")), ye = o(() => !!x.value.trim() || !!se.value), re = o(() => C.texts[_.value] ?? { title: C.empty, hint: "" }), E = k(null), X = o(() => ne.value.find((e) => e.id === E.value) ?? null), ue = o(() => X.value ? [X.value] : ne.value), ce = o(() => ne.value.length - ue.value.length), be = (e) => E.value = E.value === e.id ? null : e.id;
    return me(x, (e) => e.trim() && (E.value = null)), (e, s) => (r(), g("div", {
      class: ie(["agents", { focused: X.value }]),
      "data-window-flush": ""
    }, [
      c("div", rt, [
        p(l(Be), {
          modelValue: x.value,
          "onUpdate:modelValue": s[2] || (s[2] = (n) => x.value = n),
          class: "agents-search",
          "data-agents-search": ""
        }, {
          default: O(() => [
            p(l(Le), {
              options: q,
              value: _.value,
              onPick: s[0] || (s[0] = (n) => _.value = n)
            }, null, 8, ["value"]),
            p(l(je), {
              small: "",
              bordered: "",
              title: "Open the test queue",
              "data-agents-queue": "",
              onClick: s[1] || (s[1] = (n) => l(de)("test_queue:0"))
            }, {
              default: O(() => [
                s[4] || (s[4] = Se("Test queue ", -1)),
                c("span", ut, v(ee.value), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      se.value ? (r(), g("p", ct, "Hidden: " + v(se.value), 1)) : $("", !0),
      p(l(he), {
        rows: ue.value,
        failure: l(L),
        loaded: l(a),
        more: l(j) && _.value !== "running",
        older: l(N),
        empty: re.value.title,
        hint: re.value.hint,
        searching: ye.value
      }, {
        default: O(({ row: n }) => [
          c("div", {
            class: "agent-row",
            "data-agent-row": n.id,
            onMouseenter: (d) => te(n),
            onMouseleave: (d) => W(n)
          }, [
            p(dt, {
              row: n,
              facts: A(n),
              open: n.id === E.value,
              onToggle: (d) => be(n)
            }, null, 8, ["row", "facts", "open", "onToggle"]),
            K(n) ? (r(), g("span", vt, [
              c("i", {
                style: $e(R(n))
              }, null, 4)
            ])) : $("", !0)
          ], 40, gt)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty", "hint", "searching"]),
      X.value && ce.value ? (r(), g("button", {
        key: 1,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: s[3] || (s[3] = (n) => E.value = null)
      }, v(ce.value) + " more", 1)) : $("", !0)
    ], 2));
  }
}, _t = /* @__PURE__ */ ke(mt, [["__scopeId", "data-v-ba7b296d"]]);
export {
  _t as A
};
