/* @code-commandments-generated */
import { computed as o, openBlock as r, createBlock as L, unref as n, withCtx as j, createVNode as f, ref as N, onUnmounted as se, createElementBlock as c, createElementVNode as d, toDisplayString as v, normalizeClass as oe, Fragment as D, createCommentVNode as S, withModifiers as Y, createTextVNode as le, renderList as Z } from "vue";
import { useRows as U, RowList as te, DiffCard as re, ago as de, useNow as ie, age as ee, useWindow as ae, Icon as ue, peekRef as z, RunningCommand as ce, Btn as ge, InnerTabs as pe, FoldGroup as ve, TaskStatusIcon as me, ordered as fe, hiddenBy as _e, hiddenSummary as we, SearchBar as ke, Segmented as ye } from "@journal/window-kit";
import { _ as ne, T as he } from "./TranscriptRows-Cotthc_y.js";
const be = 5, $e = {
  __name: "AgentFileEdits",
  props: { agent: { type: Number, required: !0 } },
  setup(u) {
    const A = u, { rows: _, failure: C, loaded: a, more: y, older: E } = U(`file-edit list --agent ${A.agent}`, ["file_edit.create"], { incremental: !0 }), g = o(() => _.value.map((w) => ({ ...w, lines: JSON.parse(w.rows || "[]") })));
    return (w, B) => (r(), L(n(te), {
      rows: g.value,
      failure: n(C),
      loaded: n(a),
      more: n(y),
      older: n(E),
      empty: "No edits by this agent yet"
    }, {
      default: j(({ row: i }) => [
        f(n(re), {
          flush: "",
          lines: be,
          path: i.path,
          kind: i.edit_type,
          added: i.added,
          removed: i.removed,
          ago: n(de)(i.created_at),
          rows: i.lines
        }, null, 8, ["path", "kind", "added", "removed", "ago", "rows"])
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "more", "older"]));
  }
}, Se = ["data-agent-open", "aria-expanded", "title"], Ce = { class: "agent-head" }, xe = ["data-state"], Te = {
  class: "agent-title",
  "data-agent-title": ""
}, Oe = {
  class: "agent-name",
  "data-agent-name": ""
}, Ne = { class: "agent-time" }, Ae = { class: "agent-line" }, Ee = {
  class: "agent-identity",
  "data-agent-identity": ""
}, Ie = {
  key: 0,
  class: "agent-tasks",
  "data-agent-pace": ""
}, Re = {
  class: "agent-tasks",
  "data-agent-tasks": ""
}, De = {
  key: 0,
  class: "agent-command",
  "data-agent-command": ""
}, Le = { class: "agent-usage-line" }, je = {
  class: "agent-usage",
  "data-agent-card-usage": ""
}, Be = ["data-agent-tab-body"], Fe = ["data-agent-delegated", "onClick"], Ve = { class: "agent-task-number" }, qe = { class: "agent-task-title" }, He = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, Ke = 36e5, Ue = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null } },
  setup(u) {
    const A = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, _ = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), C = ["started", "testing", "blocked", "open", "completed", "cancelled"], a = u, y = ie(), E = o(() => {
      var e;
      const t = ((e = a.facts) == null ? void 0 : e.profile) || A[a.row.role] || a.row.role;
      return t.slice(0, 1).toUpperCase() + t.slice(1);
    }), g = o(() => {
      var t;
      return ((t = a.facts) == null ? void 0 : t.tasks) ?? [];
    }), w = o(() => !a.row.ended_at && g.value.some((t) => t.state === "testing") && !g.value.some((t) => t.state === "started")), B = o(() => {
      var t;
      return [a.row.program, (t = a.facts) == null ? void 0 : t.model, a.row.role === "worker" ? `worker ${a.row.id}` : _.has(a.row.role) ? a.row.role : ""].filter(Boolean).join(" · ");
    }), i = o(() => a.row.ended_at ? `${ee(a.row.ended_at, y.value)} ago` : ee(a.row.process_started_at || a.row.created_at, y.value)), I = o(() => {
      var t;
      return a.row.ended_at ? "closed" : w.value ? "waiting" : ((t = a.facts) == null ? void 0 : t.state) || "running";
    }), M = o(() => {
      var e, s, l;
      const t = [`agent ${a.row.id}`];
      return ((e = a.facts) == null ? void 0 : e.context_percent) !== null && ((s = a.facts) == null ? void 0 : s.context_percent) !== void 0 && t.push(`Context ${a.facts.context_percent}%`), (l = a.facts) != null && l.cost_dollars && t.push(`$${a.facts.cost_dollars.toFixed(2)}`), t.join(" · ");
    }), m = o(() => g.value.filter((t) => t.state === "completed").length), W = o(() => `${m.value} of ${g.value.length} ${g.value.length === 1 ? "task" : "tasks"}`), F = o(() => {
      const t = Date.parse(a.row.process_started_at || a.row.created_at), s = ((a.row.ended_at ? Date.parse(a.row.ended_at) : y.value) - t) / Ke;
      return a.row.role === "worker" && s > 0 && m.value ? `${Math.round(m.value / s)}/h` : "";
    }), P = o(() => C.map((t) => ({ state: t, label: t.slice(0, 1).toUpperCase() + t.slice(1), tasks: g.value.filter((e) => e.state === t) })).filter((t) => t.tasks.length)), h = N(!1), V = /* @__PURE__ */ new Set(["completed"]), x = N({}), q = (t) => !(x.value[t] ?? V.has(t)), b = (t) => x.value = { ...x.value, [t]: q(t) }, T = ae(), k = N(T.tabs[0]), H = N(""), R = o(() => a.row.role === "worker" && !a.row.ended_at);
    async function K() {
      if (!R.value) return;
      const t = await T.read(`usage tool --agent ${a.row.id}`);
      H.value = t.ok ? t.value.tool : "";
    }
    const O = T.follow(["hook_call.*", "process_part.*"], K);
    return se(() => O == null ? void 0 : O()), K(), (t, e) => {
      var s, l, G, J, Q, X;
      return r(), c("div", {
        class: "agent-card",
        "data-agent-open": u.row.id,
        "aria-expanded": h.value,
        title: u.row.session,
        onClick: e[4] || (e[4] = (p) => h.value = !h.value)
      }, [
        d("span", Ce, [
          d("span", {
            class: "agent-dot",
            "data-state": I.value
          }, null, 8, xe),
          d("span", Te, v(E.value), 1),
          d("span", Oe, v(((s = u.facts) == null ? void 0 : s.given_name) || u.row.id), 1),
          d("span", Ne, v(i.value), 1),
          f(n(ue), {
            class: oe(["agent-chevron", { opened: h.value }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        d("span", Ae, [
          d("span", Ee, v(B.value), 1),
          g.value.length ? (r(), c(D, { key: 0 }, [
            F.value ? (r(), c("span", Ie, v(F.value), 1)) : S("", !0),
            d("span", Re, v(W.value), 1)
          ], 64)) : S("", !0)
        ]),
        R.value ? (r(), c("span", De, [
          w.value ? (r(), c("button", {
            key: 0,
            type: "button",
            class: "agent-waiting",
            "data-agent-waiting": "",
            title: "Open the test queue",
            onClick: e[0] || (e[0] = Y((p) => n(z)("test_queue:0"), ["stop"]))
          }, "waiting for its tests")) : (r(), L(n(ce), {
            key: 1,
            text: H.value,
            idle: "thinking"
          }, null, 8, ["text"]))
        ])) : S("", !0),
        h.value ? (r(), c("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: e[3] || (e[3] = Y(() => {
          }, ["stop"]))
        }, [
          d("span", Le, [
            d("span", je, v(M.value), 1),
            f(n(ge), {
              small: "",
              bordered: "",
              "data-agent-inspect": "",
              onClick: e[1] || (e[1] = (p) => n(z)(`agents:${u.row.id}`))
            }, {
              default: j(() => [...e[5] || (e[5] = [
                le("Inspect", -1)
              ])]),
              _: 1
            })
          ]),
          f(n(pe), {
            class: "agent-tabs",
            active: k.value,
            answer: { tasks: g.value.length },
            onChoose: e[2] || (e[2] = (p) => k.value = p)
          }, null, 8, ["active", "answer"]),
          d("div", {
            class: "agent-tab-body",
            "data-agent-tab-body": (l = k.value) == null ? void 0 : l.key
          }, [
            ((G = k.value) == null ? void 0 : G.key) === "tasks" ? (r(), c(D, { key: 0 }, [
              (r(!0), c(D, null, Z(P.value, (p) => (r(), L(n(ve), {
                key: p.state,
                label: p.label,
                count: p.tasks.length,
                open: q(p.state),
                "data-agent-section": p.state,
                onToggle: ($) => b(p.state)
              }, {
                default: j(() => [
                  (r(!0), c(D, null, Z(p.tasks, ($) => (r(), c("button", {
                    key: $.id,
                    type: "button",
                    class: "agent-task",
                    "data-agent-delegated": $.id,
                    onClick: (Je) => n(z)(`tasks:${$.id}`)
                  }, [
                    f(n(me), {
                      status: $.state
                    }, null, 8, ["status"]),
                    d("span", Ve, v($.id), 1),
                    d("span", qe, v($.title), 1)
                  ], 8, Fe))), 128))
                ]),
                _: 2
              }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
              (J = u.facts) != null && J.instruction ? (r(), c(D, { key: 0 }, [
                e[6] || (e[6] = d("p", { class: "agent-label" }, "Instruction", -1)),
                d("div", He, v(u.facts.instruction), 1)
              ], 64)) : S("", !0)
            ], 64)) : ((Q = k.value) == null ? void 0 : Q.key) === "transcript" ? (r(), L(he, {
              key: 1,
              line: `agent transcript ${u.row.id}`
            }, null, 8, ["line"])) : ((X = k.value) == null ? void 0 : X.key) === "file-feed" ? (r(), L($e, {
              key: 2,
              agent: u.row.id
            }, null, 8, ["agent"])) : S("", !0)
          ], 8, Be)
        ])) : S("", !0)
      ], 8, Se);
    };
  }
}, Me = /* @__PURE__ */ ne(Ue, [["__scopeId", "data-v-c3c8f1a6"]]), We = {
  class: "agents",
  "data-window-flush": ""
}, Pe = { class: "agents-bar" }, ze = {
  key: 0,
  class: "agents-hidden",
  "data-agents-hidden": ""
}, Ge = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, only: { type: Function, default: () => !0 } },
  setup(u) {
    const A = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], _ = u, { rows: C, failure: a, loaded: y, more: E, older: g } = U(_.line, ["agent.*"], { incremental: !0 }), { rows: w } = U("agent running", ["agent.*"]), { rows: B } = U("usage agents --closed", ["agent.*", "task.*"]), i = N("running"), I = N(""), M = (e) => i.value === "all" || i.value === "running" == !e.ended_at, m = (e) => B.value.find((s) => s.id === e.id) ?? null, W = (e) => {
      var s, l;
      return `${e.id} ${e.session} ${e.program} ${e.role} ${((s = m(e)) == null ? void 0 : s.profile) ?? ""} ${((l = m(e)) == null ? void 0 : l.given_name) ?? ""}`.toLowerCase().includes(I.value.trim().toLowerCase());
    }, F = o(() => i.value === "running" ? w.value : C.value), P = o(() => F.value.filter((e) => _.only(e) && M(e) && W(e))), h = ae(), V = ["working", "waiting", "idle", "stopped"], x = ["environment", "worker", "subagent"], q = { main: "environment", worker: "worker", subagent: "subagent" }, b = Object.fromEntries([...V, ...x, "order", "every"].map((e) => [e, h.option(e)])), T = o(() => ({
      states: Object.fromEntries(V.map((e) => [e, b.every.value || b[e].value !== !1])),
      kinds: Object.fromEntries(x.map((e) => [e, b.every.value || b[e].value !== !1]))
    })), k = (e) => {
      var s, l;
      return e.ended_at ? "stopped" : ((s = m(e)) == null ? void 0 : s.state) === "blocked" ? "waiting" : ((l = m(e)) == null ? void 0 : l.state) === "waiting" || e.paused_at ? "idle" : "working";
    }, H = (e) => ({ key: String(e.id), kind: q[e.role] ?? e.role, n: e.id, time: Date.parse(e.updated_at ?? e.created_at ?? 0) / 1e3 || 0, card: { state: k(e) }, row: e }), R = o(() => P.value.map(H)), K = o(() => fe(R.value.filter((e) => !_e(e, T.value)), b.order.value ?? "number").map((e) => e.row)), O = o(() => we(R.value, T.value).join(", ")), t = o(() => C.value.some(_.only) ? "Nothing matches" : _.empty);
    return (e, s) => (r(), c("div", We, [
      d("div", Pe, [
        f(n(ke), {
          modelValue: I.value,
          "onUpdate:modelValue": s[1] || (s[1] = (l) => I.value = l),
          class: "agents-search",
          placeholder: "Search the agents",
          "data-agents-search": ""
        }, {
          default: j(() => [
            f(n(ye), {
              options: A,
              value: i.value,
              onPick: s[0] || (s[0] = (l) => i.value = l)
            }, null, 8, ["value"])
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      O.value ? (r(), c("p", ze, "Hidden: " + v(O.value), 1)) : S("", !0),
      f(n(te), {
        rows: K.value,
        failure: n(a),
        loaded: n(y),
        more: n(E) && i.value !== "running",
        older: n(g),
        empty: t.value
      }, {
        default: j(({ row: l }) => [
          f(Me, {
            row: l,
            facts: m(l)
          }, null, 8, ["row", "facts"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty"])
    ]));
  }
}, Ze = /* @__PURE__ */ ne(Ge, [["__scopeId", "data-v-06e60e18"]]);
export {
  Ze as A
};
