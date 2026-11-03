/* @code-commandments-generated */
import { computed as o, openBlock as d, createBlock as U, unref as l, withCtx as G, createVNode as S, ref as b, onUnmounted as we, createElementBlock as g, normalizeClass as ie, createElementVNode as c, toDisplayString as p, Fragment as H, createCommentVNode as y, withModifiers as ve, renderList as pe, watch as me, createTextVNode as Se, normalizeStyle as $e } from "vue";
import { useRows as W, RowList as ke, DiffCard as Ce, ago as Te, useNow as xe, age as fe, useWindow as he, Icon as Ie, peekRef as de, RunningCommand as Ae, InnerTabs as De, FoldGroup as Oe, TaskStatusIcon as Ne, ordered as Me, hiddenBy as Re, hiddenSummary as Ee, SearchBar as qe, Segmented as Be, Btn as Le } from "@journal/window-kit";
import { _ as _e, T as je } from "./TranscriptRows-BFAiJvDF.js";
const Fe = 5, Ve = {
  __name: "AgentFileEdits",
  props: { agent: { type: Number, required: !0 } },
  setup(u) {
    const R = u, { rows: $, failure: E, loaded: q, more: a, older: B } = W(`file-edit list --agent ${R.agent}`, ["file_edit.create"], { incremental: !0 }), O = o(() => $.value.map((C) => ({ ...C, lines: JSON.parse(C.rows || "[]") })));
    return (C, m) => (d(), U(l(ke), {
      rows: O.value,
      failure: l(E),
      loaded: l(q),
      more: l(a),
      older: l(B),
      empty: "No edits by this agent yet",
      hint: "The files it changes show here as it works."
    }, {
      default: G(({ row: f }) => [
        S(l(Ce), {
          flush: "",
          lines: Fe,
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
}, Ke = ["data-agent-open", "aria-expanded", "title"], ze = { class: "agent-head" }, He = ["data-state"], Ue = {
  class: "agent-title",
  "data-agent-title": ""
}, We = {
  class: "agent-name",
  "data-agent-name": ""
}, Ge = { class: "agent-time" }, Pe = { class: "agent-line" }, Je = {
  class: "agent-identity",
  "data-agent-identity": ""
}, Qe = {
  key: 0,
  class: "agent-tasks",
  "data-agent-pace": ""
}, Xe = {
  class: "agent-tasks",
  "data-agent-tasks": ""
}, Ye = {
  key: 0,
  class: "agent-command",
  "data-agent-command": ""
}, Ze = {
  key: 0,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, et = ["data-agent-tab-body"], tt = ["data-agent-delegated", "onClick"], at = { class: "agent-task-number" }, nt = { class: "agent-task-title" }, st = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, ot = 36e5, lt = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null }, open: Boolean },
  emits: ["toggle"],
  setup(u, { emit: R }) {
    const $ = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, E = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), q = ["started", "testing", "blocked", "open", "completed", "cancelled"], a = u, B = R, O = xe(), C = o(() => {
      var i;
      const t = ((i = a.facts) == null ? void 0 : i.profile) || $[a.row.role] || a.row.role;
      return t.slice(0, 1).toUpperCase() + t.slice(1);
    }), m = o(() => {
      var t;
      return ((t = a.facts) == null ? void 0 : t.tasks) ?? [];
    }), f = o(() => !a.row.ended_at && m.value.some((t) => t.state === "testing") && !m.value.some((t) => t.state === "started")), ne = o(() => {
      var t;
      return [a.row.program, (t = a.facts) == null ? void 0 : t.model, a.row.role === "worker" ? `worker ${a.row.id}` : E.has(a.row.role) ? a.row.role : ""].filter(Boolean).join(" · ");
    }), se = o(() => a.row.ended_at ? `${fe(a.row.ended_at, O.value)} ago` : fe(a.row.process_started_at || a.row.created_at, O.value)), _ = o(() => {
      var t;
      return a.row.ended_at ? "closed" : f.value ? "waiting" : ((t = a.facts) == null ? void 0 : t.state) || "running";
    }), T = o(() => {
      var i, k, N;
      const t = [];
      return ((i = a.facts) == null ? void 0 : i.context_percent) !== null && ((k = a.facts) == null ? void 0 : k.context_percent) !== void 0 && t.push(`Context ${a.facts.context_percent}%`), (N = a.facts) != null && N.cost_dollars && t.push(`$${a.facts.cost_dollars.toFixed(2)}`), t.join(" · ");
    }), L = o(() => m.value.filter((t) => t.state === "completed").length), w = o(() => `${L.value} of ${m.value.length} ${m.value.length === 1 ? "task" : "tasks"}`), x = o(() => {
      const t = Date.parse(a.row.process_started_at || a.row.created_at), k = ((a.row.ended_at ? Date.parse(a.row.ended_at) : O.value) - t) / ot;
      return a.row.role === "worker" && k > 0 && L.value ? `${Math.round(L.value / k)}/h` : "";
    }), P = o(() => q.map((t) => ({ state: t, label: t.slice(0, 1).toUpperCase() + t.slice(1), tasks: m.value.filter((i) => i.state === t) })).filter((t) => t.tasks.length)), J = /* @__PURE__ */ new Set(["completed"]), j = b({}), F = (t) => !(j.value[t] ?? J.has(t)), oe = (t) => j.value = { ...j.value, [t]: F(t) }, V = he(), I = b(V.tabs[0]), Q = b(""), A = b(""), X = o(() => a.row.role !== "main" && !a.row.ended_at);
    async function Y() {
      if (!X.value) return;
      const t = await V.read(`usage tool --agent ${a.row.id}`);
      Q.value = t.ok ? t.value.tool : "", A.value = t.ok ? t.value.note : "";
    }
    const K = V.follow(["hook_call.*", "process_part.*"], Y);
    return we(() => K == null ? void 0 : K()), Y(), (t, i) => {
      var k, N, D, z, Z, ee;
      return d(), g("div", {
        class: ie(["agent-card", { open: u.open }]),
        "data-agent-open": u.row.id,
        "aria-expanded": u.open,
        title: u.row.session,
        onClick: i[3] || (i[3] = (v) => B("toggle"))
      }, [
        c("span", ze, [
          c("span", {
            class: "agent-dot",
            "data-state": _.value
          }, null, 8, He),
          c("span", Ue, p(C.value), 1),
          c("span", We, p(((k = u.facts) == null ? void 0 : k.given_name) || u.row.id), 1),
          c("span", Ge, p(se.value), 1),
          S(l(Ie), {
            class: ie(["agent-chevron", { opened: u.open }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        c("span", Pe, [
          c("span", Je, p(ne.value), 1),
          m.value.length ? (d(), g(H, { key: 0 }, [
            x.value ? (d(), g("span", Qe, p(x.value), 1)) : y("", !0),
            c("span", Xe, p(w.value), 1)
          ], 64)) : y("", !0)
        ]),
        X.value ? (d(), g("span", Ye, [
          f.value ? (d(), g("button", {
            key: 0,
            type: "button",
            class: "agent-waiting",
            "data-agent-waiting": "",
            title: "Open the test queue",
            onClick: i[0] || (i[0] = ve((v) => l(de)("test_queue:0"), ["stop"]))
          }, "waiting for its tests")) : (d(), U(l(Ae), {
            key: 1,
            text: Q.value,
            idle: A.value || "thinking"
          }, null, 8, ["text", "idle"]))
        ])) : y("", !0),
        u.open ? (d(), g("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: i[2] || (i[2] = ve(() => {
          }, ["stop"]))
        }, [
          T.value ? (d(), g("span", Ze, p(T.value), 1)) : y("", !0),
          S(l(De), {
            class: "agent-tabs",
            active: I.value,
            answer: { tasks: m.value.length },
            onChoose: i[1] || (i[1] = (v) => I.value = v)
          }, null, 8, ["active", "answer"]),
          c("div", {
            class: "agent-tab-body",
            "data-agent-tab-body": (N = I.value) == null ? void 0 : N.key
          }, [
            ((D = I.value) == null ? void 0 : D.key) === "tasks" ? (d(), g(H, { key: 0 }, [
              (d(!0), g(H, null, pe(P.value, (v) => (d(), U(l(Oe), {
                key: v.state,
                label: v.label,
                count: v.tasks.length,
                open: F(v.state),
                "data-agent-section": v.state,
                onToggle: (h) => oe(v.state)
              }, {
                default: G(() => [
                  (d(!0), g(H, null, pe(v.tasks, (h) => (d(), g("button", {
                    key: h.id,
                    type: "button",
                    class: "agent-task",
                    "data-agent-delegated": h.id,
                    onClick: (te) => l(de)(`tasks:${h.id}`)
                  }, [
                    S(l(Ne), {
                      status: h.state
                    }, null, 8, ["status"]),
                    c("span", at, p(h.id), 1),
                    c("span", nt, p(h.title), 1)
                  ], 8, tt))), 128))
                ]),
                _: 2
              }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
              (z = u.facts) != null && z.instruction ? (d(), g(H, { key: 0 }, [
                i[4] || (i[4] = c("p", { class: "agent-label" }, "Instruction", -1)),
                c("div", st, p(u.facts.instruction), 1)
              ], 64)) : y("", !0)
            ], 64)) : ((Z = I.value) == null ? void 0 : Z.key) === "transcript" ? (d(), U(je, {
              key: 1,
              line: `agent transcript ${u.row.id}`
            }, null, 8, ["line"])) : ((ee = I.value) == null ? void 0 : ee.key) === "file-feed" ? (d(), U(Ve, {
              key: 2,
              agent: u.row.id
            }, null, 8, ["agent"])) : y("", !0)
          ], 8, et)
        ])) : y("", !0)
      ], 10, Ke);
    };
  }
}, it = /* @__PURE__ */ _e(lt, [["__scopeId", "data-v-500347e0"]]), dt = { class: "agents-bar" }, rt = {
  class: "agents-queue-count",
  "data-agents-queue-count": ""
}, ut = {
  key: 0,
  class: "agents-hidden",
  "data-agents-hidden": ""
}, ct = ["data-agent-row", "onMouseenter", "onMouseleave"], gt = {
  key: 0,
  class: "agent-leave",
  "data-agent-leave": "",
  "aria-hidden": "true"
}, le = 1e4, vt = 250, pt = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, texts: { type: Object, default: () => ({}) }, only: { type: Function, default: () => !0 } },
  setup(u) {
    const R = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], $ = u, { rows: E, failure: q, loaded: a, more: B, older: O } = W($.line, ["agent.*"], { incremental: !0 }), { rows: C } = W("agent running", ["agent.*"]), { rows: m } = W("usage agents --closed", ["agent.*", "task.*"]), { rows: f } = W("proof list --limit 50", ["proof.*"]), ne = /* @__PURE__ */ new Set(["queued", "running"]), se = o(() => f.value.filter((e) => ne.has(e.state)).length), _ = b("running"), T = b(""), L = b(Date.now()), w = b(/* @__PURE__ */ new Map()), x = b(/* @__PURE__ */ new Set());
    let P = Date.now(), J = /* @__PURE__ */ new Map();
    const j = setInterval(() => {
      const e = Date.now(), s = new Map(w.value);
      for (const [n, r] of s)
        x.value.has(n) ? s.set(n, { ...r, leavesAt: r.leavesAt + (e - P) }) : e >= r.leavesAt && s.delete(n);
      P = e, L.value = e, (s.size !== w.value.size || [...s].some(([n, r]) => r !== w.value.get(n))) && (w.value = s);
    }, vt);
    we(() => clearInterval(j)), me(C, (e) => {
      const s = new Set(e.map((r) => r.id)), n = new Map(w.value);
      for (const [r, ge] of J)
        !s.has(r) && !n.has(r) && n.set(r, { row: { ...ge, ended_at: ge.ended_at ?? (/* @__PURE__ */ new Date()).toISOString() }, leavesAt: Date.now() + le });
      for (const r of s) n.delete(r);
      J = new Map(e.map((r) => [r.id, r])), w.value = n;
    });
    const F = (e) => w.value.get(e.id) ?? null, oe = (e) => x.value = /* @__PURE__ */ new Set([...x.value, e.id]), V = (e) => x.value = new Set([...x.value].filter((s) => s !== e.id)), I = (e) => ({ animationDuration: `${le}ms`, animationDelay: `${Math.min(0, F(e).leavesAt - le - Date.now())}ms` }), Q = (e) => _.value === "all" || _.value === "running" == !e.ended_at || _.value === "running" && w.value.has(e.id), A = (e) => m.value.find((s) => s.id === e.id) ?? null, X = (e) => {
      var s, n;
      return `${e.id} ${e.session} ${e.program} ${e.role} ${((s = A(e)) == null ? void 0 : s.profile) ?? ""} ${((n = A(e)) == null ? void 0 : n.given_name) ?? ""}`.toLowerCase().includes(T.value.trim().toLowerCase());
    }, Y = o(() => _.value === "running" ? [...C.value, ...[...w.value.values()].map((e) => e.row)] : E.value), K = o(() => Y.value.filter((e) => $.only(e) && Q(e) && X(e))), t = he(), i = ["working", "waiting", "idle", "stopped"], k = ["environment", "worker", "subagent"], N = { main: "environment", worker: "worker", subagent: "subagent" }, D = Object.fromEntries([...i, ...k, "order", "every"].map((e) => [e, t.option(e)])), z = o(() => ({
      states: Object.fromEntries(i.map((e) => [e, D.every.value || D[e].value !== !1])),
      kinds: Object.fromEntries(k.map((e) => [e, D.every.value || D[e].value !== !1]))
    })), Z = (e) => {
      var s, n;
      return e.ended_at ? "stopped" : ((s = A(e)) == null ? void 0 : s.state) === "blocked" ? "waiting" : ((n = A(e)) == null ? void 0 : n.state) === "waiting" || e.paused_at ? "idle" : "working";
    }, ee = (e) => ({ key: String(e.id), kind: N[e.role] ?? e.role, n: e.id, time: Date.parse(e.updated_at ?? e.created_at ?? 0) / 1e3 || 0, card: { state: Z(e) }, row: e }), v = o(() => K.value.map(ee)), h = o(() => Me(v.value.filter((e) => !Re(e, z.value)), D.order.value ?? "number").map((e) => e.row)), te = o(() => Ee(v.value, z.value).join(", ")), ye = o(() => !!T.value.trim() || !!te.value), re = o(() => $.texts[_.value] ?? { title: $.empty, hint: "" }), M = b(null), ae = o(() => h.value.find((e) => e.id === M.value) ?? null), ue = o(() => ae.value ? [ae.value] : h.value), ce = o(() => h.value.length - ue.value.length), be = (e) => M.value = M.value === e.id ? null : e.id;
    return me(T, (e) => e.trim() && (M.value = null)), (e, s) => (d(), g("div", {
      class: ie(["agents", { focused: ae.value }]),
      "data-window-flush": ""
    }, [
      c("div", dt, [
        S(l(qe), {
          modelValue: T.value,
          "onUpdate:modelValue": s[2] || (s[2] = (n) => T.value = n),
          class: "agents-search",
          "data-agents-search": ""
        }, {
          default: G(() => [
            S(l(Be), {
              options: R,
              value: _.value,
              onPick: s[0] || (s[0] = (n) => _.value = n)
            }, null, 8, ["value"]),
            S(l(Le), {
              small: "",
              bordered: "",
              title: "Open the test queue",
              "data-agents-queue": "",
              onClick: s[1] || (s[1] = (n) => l(de)("test_queue:0"))
            }, {
              default: G(() => [
                s[4] || (s[4] = Se("Test queue ", -1)),
                c("span", rt, p(se.value), 1)
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      te.value ? (d(), g("p", ut, "Hidden: " + p(te.value), 1)) : y("", !0),
      S(l(ke), {
        rows: ue.value,
        failure: l(q),
        loaded: l(a),
        more: l(B) && _.value !== "running",
        older: l(O),
        empty: re.value.title,
        hint: re.value.hint,
        searching: ye.value
      }, {
        default: G(({ row: n }) => [
          c("div", {
            class: "agent-row",
            "data-agent-row": n.id,
            onMouseenter: (r) => oe(n),
            onMouseleave: (r) => V(n)
          }, [
            S(it, {
              row: n,
              facts: A(n),
              open: n.id === M.value,
              onToggle: (r) => be(n)
            }, null, 8, ["row", "facts", "open", "onToggle"]),
            F(n) ? (d(), g("span", gt, [
              c("i", {
                style: $e(I(n))
              }, null, 4)
            ])) : y("", !0)
          ], 40, ct)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty", "hint", "searching"]),
      ae.value && ce.value ? (d(), g("button", {
        key: 1,
        type: "button",
        class: "agents-held",
        "data-agents-held": "",
        onClick: s[3] || (s[3] = (n) => M.value = null)
      }, p(ce.value) + " more", 1)) : y("", !0)
    ], 2));
  }
}, kt = /* @__PURE__ */ _e(pt, [["__scopeId", "data-v-ba7b296d"]]);
export {
  kt as A
};
