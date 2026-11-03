/* @code-commandments-generated */
import { computed as o, openBlock as l, createBlock as L, unref as s, withCtx as M, createVNode as h, ref as A, onUnmounted as se, createElementBlock as u, createElementVNode as i, toDisplayString as p, normalizeClass as oe, Fragment as D, createCommentVNode as w, withModifiers as X, renderList as Y } from "vue";
import { useRows as U, RowList as te, DiffCard as le, ago as re, useNow as de, age as Z, useWindow as ae, Icon as ie, peekRef as ee, RunningCommand as ue, InnerTabs as ce, FoldGroup as ge, TaskStatusIcon as ve, ordered as pe, hiddenBy as me, hiddenSummary as _e, SearchBar as fe, Segmented as ke } from "@journal/window-kit";
import { _ as ne, T as we } from "./TranscriptRows-Cotthc_y.js";
const he = 5, ye = {
  __name: "AgentFileEdits",
  props: { agent: { type: Number, required: !0 } },
  setup(c) {
    const E = c, { rows: _, failure: C, loaded: a, more: y, older: N } = U(`file-edit list --agent ${E.agent}`, ["file_edit.create"], { incremental: !0 }), g = o(() => _.value.map((f) => ({ ...f, lines: JSON.parse(f.rows || "[]") })));
    return (f, j) => (l(), L(s(te), {
      rows: g.value,
      failure: s(C),
      loaded: s(a),
      more: s(y),
      older: s(N),
      empty: "No edits by this agent yet"
    }, {
      default: M(({ row: d }) => [
        h(s(le), {
          flush: "",
          lines: he,
          path: d.path,
          kind: d.edit_type,
          added: d.added,
          removed: d.removed,
          ago: s(re)(d.created_at),
          rows: d.lines
        }, null, 8, ["path", "kind", "added", "removed", "ago", "rows"])
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "more", "older"]));
  }
}, be = ["data-agent-open", "aria-expanded", "title"], Se = { class: "agent-head" }, $e = ["data-state"], Ce = {
  class: "agent-title",
  "data-agent-title": ""
}, xe = {
  class: "agent-name",
  "data-agent-name": ""
}, Te = { class: "agent-time" }, Oe = { class: "agent-line" }, Ae = {
  class: "agent-identity",
  "data-agent-identity": ""
}, Ee = {
  key: 0,
  class: "agent-tasks",
  "data-agent-pace": ""
}, Ne = {
  class: "agent-tasks",
  "data-agent-tasks": ""
}, Ie = {
  key: 0,
  class: "agent-command",
  "data-agent-command": ""
}, Re = {
  key: 0,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, De = ["data-agent-tab-body"], Le = ["data-agent-delegated", "onClick"], je = { class: "agent-task-number" }, Fe = { class: "agent-task-title" }, Be = {
  class: "agent-instruction",
  "data-agent-instruction": ""
}, qe = 36e5, Ve = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null } },
  setup(c) {
    const E = { main: "Main agent", subagent: "Subagent", worker: "Worker", reviewer: "Reviewer" }, _ = /* @__PURE__ */ new Set(["subagent", "worker", "reviewer"]), C = ["started", "testing", "blocked", "open", "completed", "cancelled"], a = c, y = de(), N = o(() => {
      var e;
      const t = ((e = a.facts) == null ? void 0 : e.profile) || E[a.row.role] || a.row.role;
      return t.slice(0, 1).toUpperCase() + t.slice(1);
    }), g = o(() => {
      var t;
      return ((t = a.facts) == null ? void 0 : t.tasks) ?? [];
    }), f = o(() => !a.row.ended_at && g.value.some((t) => t.state === "testing") && !g.value.some((t) => t.state === "started")), j = o(() => {
      var t;
      return [a.row.program, (t = a.facts) == null ? void 0 : t.model, a.row.role === "worker" ? `worker ${a.row.id}` : _.has(a.row.role) ? a.row.role : ""].filter(Boolean).join(" · ");
    }), d = o(() => a.row.ended_at ? `${Z(a.row.ended_at, y.value)} ago` : Z(a.row.process_started_at || a.row.created_at, y.value)), I = o(() => {
      var t;
      return a.row.ended_at ? "closed" : f.value ? "waiting" : ((t = a.facts) == null ? void 0 : t.state) || "running";
    }), F = o(() => {
      var e, n, r;
      const t = [];
      return ((e = a.facts) == null ? void 0 : e.context_percent) !== null && ((n = a.facts) == null ? void 0 : n.context_percent) !== void 0 && t.push(`Context ${a.facts.context_percent}%`), (r = a.facts) != null && r.cost_dollars && t.push(`$${a.facts.cost_dollars.toFixed(2)}`), t.join(" · ");
    }), m = o(() => g.value.filter((t) => t.state === "completed").length), W = o(() => `${m.value} of ${g.value.length} ${g.value.length === 1 ? "task" : "tasks"}`), B = o(() => {
      const t = Date.parse(a.row.process_started_at || a.row.created_at), n = ((a.row.ended_at ? Date.parse(a.row.ended_at) : y.value) - t) / qe;
      return a.row.role === "worker" && n > 0 && m.value ? `${Math.round(m.value / n)}/h` : "";
    }), P = o(() => C.map((t) => ({ state: t, label: t.slice(0, 1).toUpperCase() + t.slice(1), tasks: g.value.filter((e) => e.state === t) })).filter((t) => t.tasks.length)), b = A(!1), q = /* @__PURE__ */ new Set(["completed"]), x = A({}), V = (t) => !(x.value[t] ?? q.has(t)), S = (t) => x.value = { ...x.value, [t]: V(t) }, T = ae(), k = A(T.tabs[0]), H = A(""), R = o(() => a.row.role === "worker" && !a.row.ended_at);
    async function K() {
      if (!R.value) return;
      const t = await T.read(`usage tool --agent ${a.row.id}`);
      H.value = t.ok ? t.value.tool : "";
    }
    const O = T.follow(["hook_call.*", "process_part.*"], K);
    return se(() => O == null ? void 0 : O()), K(), (t, e) => {
      var n, r, z, G, J, Q;
      return l(), u("div", {
        class: "agent-card",
        "data-agent-open": c.row.id,
        "aria-expanded": b.value,
        title: c.row.session,
        onClick: e[3] || (e[3] = (v) => b.value = !b.value)
      }, [
        i("span", Se, [
          i("span", {
            class: "agent-dot",
            "data-state": I.value
          }, null, 8, $e),
          i("span", Ce, p(N.value), 1),
          i("span", xe, p(((n = c.facts) == null ? void 0 : n.given_name) || c.row.id), 1),
          i("span", Te, p(d.value), 1),
          h(s(ie), {
            class: oe(["agent-chevron", { opened: b.value }]),
            name: "caret",
            size: 12
          }, null, 8, ["class"])
        ]),
        i("span", Oe, [
          i("span", Ae, p(j.value), 1),
          g.value.length ? (l(), u(D, { key: 0 }, [
            B.value ? (l(), u("span", Ee, p(B.value), 1)) : w("", !0),
            i("span", Ne, p(W.value), 1)
          ], 64)) : w("", !0)
        ]),
        R.value ? (l(), u("span", Ie, [
          f.value ? (l(), u("button", {
            key: 0,
            type: "button",
            class: "agent-waiting",
            "data-agent-waiting": "",
            title: "Open the test queue",
            onClick: e[0] || (e[0] = X((v) => s(ee)("test_queue:0"), ["stop"]))
          }, "waiting for its tests")) : (l(), L(s(ue), {
            key: 1,
            text: H.value,
            idle: "thinking"
          }, null, 8, ["text"]))
        ])) : w("", !0),
        b.value ? (l(), u("div", {
          key: 1,
          class: "agent-more",
          "data-agent-more": "",
          onClick: e[2] || (e[2] = X(() => {
          }, ["stop"]))
        }, [
          F.value ? (l(), u("span", Re, p(F.value), 1)) : w("", !0),
          h(s(ce), {
            class: "agent-tabs",
            active: k.value,
            answer: { tasks: g.value.length },
            onChoose: e[1] || (e[1] = (v) => k.value = v)
          }, null, 8, ["active", "answer"]),
          i("div", {
            class: "agent-tab-body",
            "data-agent-tab-body": (r = k.value) == null ? void 0 : r.key
          }, [
            ((z = k.value) == null ? void 0 : z.key) === "tasks" ? (l(), u(D, { key: 0 }, [
              (l(!0), u(D, null, Y(P.value, (v) => (l(), L(s(ge), {
                key: v.state,
                label: v.label,
                count: v.tasks.length,
                open: V(v.state),
                "data-agent-section": v.state,
                onToggle: ($) => S(v.state)
              }, {
                default: M(() => [
                  (l(!0), u(D, null, Y(v.tasks, ($) => (l(), u("button", {
                    key: $.id,
                    type: "button",
                    class: "agent-task",
                    "data-agent-delegated": $.id,
                    onClick: (Pe) => s(ee)(`tasks:${$.id}`)
                  }, [
                    h(s(ve), {
                      status: $.state
                    }, null, 8, ["status"]),
                    i("span", je, p($.id), 1),
                    i("span", Fe, p($.title), 1)
                  ], 8, Le))), 128))
                ]),
                _: 2
              }, 1032, ["label", "count", "open", "data-agent-section", "onToggle"]))), 128)),
              (G = c.facts) != null && G.instruction ? (l(), u(D, { key: 0 }, [
                e[4] || (e[4] = i("p", { class: "agent-label" }, "Instruction", -1)),
                i("div", Be, p(c.facts.instruction), 1)
              ], 64)) : w("", !0)
            ], 64)) : ((J = k.value) == null ? void 0 : J.key) === "transcript" ? (l(), L(we, {
              key: 1,
              line: `agent transcript ${c.row.id}`
            }, null, 8, ["line"])) : ((Q = k.value) == null ? void 0 : Q.key) === "file-feed" ? (l(), L(ye, {
              key: 2,
              agent: c.row.id
            }, null, 8, ["agent"])) : w("", !0)
          ], 8, De)
        ])) : w("", !0)
      ], 8, be);
    };
  }
}, He = /* @__PURE__ */ ne(Ve, [["__scopeId", "data-v-a5c4adc3"]]), Ke = {
  class: "agents",
  "data-window-flush": ""
}, Ue = { class: "agents-bar" }, Me = {
  key: 0,
  class: "agents-hidden",
  "data-agents-hidden": ""
}, We = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, only: { type: Function, default: () => !0 } },
  setup(c) {
    const E = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], _ = c, { rows: C, failure: a, loaded: y, more: N, older: g } = U(_.line, ["agent.*"], { incremental: !0 }), { rows: f } = U("agent running", ["agent.*"]), { rows: j } = U("usage agents --closed", ["agent.*", "task.*"]), d = A("running"), I = A(""), F = (e) => d.value === "all" || d.value === "running" == !e.ended_at, m = (e) => j.value.find((n) => n.id === e.id) ?? null, W = (e) => {
      var n, r;
      return `${e.id} ${e.session} ${e.program} ${e.role} ${((n = m(e)) == null ? void 0 : n.profile) ?? ""} ${((r = m(e)) == null ? void 0 : r.given_name) ?? ""}`.toLowerCase().includes(I.value.trim().toLowerCase());
    }, B = o(() => d.value === "running" ? f.value : C.value), P = o(() => B.value.filter((e) => _.only(e) && F(e) && W(e))), b = ae(), q = ["working", "waiting", "idle", "stopped"], x = ["environment", "worker", "subagent"], V = { main: "environment", worker: "worker", subagent: "subagent" }, S = Object.fromEntries([...q, ...x, "order", "every"].map((e) => [e, b.option(e)])), T = o(() => ({
      states: Object.fromEntries(q.map((e) => [e, S.every.value || S[e].value !== !1])),
      kinds: Object.fromEntries(x.map((e) => [e, S.every.value || S[e].value !== !1]))
    })), k = (e) => {
      var n, r;
      return e.ended_at ? "stopped" : ((n = m(e)) == null ? void 0 : n.state) === "blocked" ? "waiting" : ((r = m(e)) == null ? void 0 : r.state) === "waiting" || e.paused_at ? "idle" : "working";
    }, H = (e) => ({ key: String(e.id), kind: V[e.role] ?? e.role, n: e.id, time: Date.parse(e.updated_at ?? e.created_at ?? 0) / 1e3 || 0, card: { state: k(e) }, row: e }), R = o(() => P.value.map(H)), K = o(() => pe(R.value.filter((e) => !me(e, T.value)), S.order.value ?? "number").map((e) => e.row)), O = o(() => _e(R.value, T.value).join(", ")), t = o(() => C.value.some(_.only) ? "Nothing matches" : _.empty);
    return (e, n) => (l(), u("div", Ke, [
      i("div", Ue, [
        h(s(fe), {
          modelValue: I.value,
          "onUpdate:modelValue": n[1] || (n[1] = (r) => I.value = r),
          class: "agents-search",
          placeholder: "Search the agents",
          "data-agents-search": ""
        }, {
          default: M(() => [
            h(s(ke), {
              options: E,
              value: d.value,
              onPick: n[0] || (n[0] = (r) => d.value = r)
            }, null, 8, ["value"])
          ]),
          _: 1
        }, 8, ["modelValue"])
      ]),
      O.value ? (l(), u("p", Me, "Hidden: " + p(O.value), 1)) : w("", !0),
      h(s(te), {
        rows: K.value,
        failure: s(a),
        loaded: s(y),
        more: s(N) && d.value !== "running",
        older: s(g),
        empty: t.value
      }, {
        default: M(({ row: r }) => [
          h(He, {
            row: r,
            facts: m(r)
          }, null, 8, ["row", "facts"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty"])
    ]));
  }
}, Qe = /* @__PURE__ */ ne(We, [["__scopeId", "data-v-06e60e18"]]);
export {
  Qe as A
};
