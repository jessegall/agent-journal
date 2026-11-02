/* @code-commandments-generated */
import { computed as w, openBlock as d, createElementBlock as c, unref as u, createElementVNode as f, normalizeClass as b, toDisplayString as n, createTextVNode as R, Fragment as C, createCommentVNode as _, renderList as O, ref as S, createVNode as k, withCtx as E } from "vue";
import { useNow as j, age as q, peekRef as F, useRows as N, TextInput as I, Segmented as B, RowList as D } from "@journal/window-kit";
import { _ as A } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const H = ["data-agent-open", "title"], M = { class: "agent-head" }, W = { class: "agent-name" }, z = { class: "agent-program" }, P = {
  key: 0,
  class: "agent-task",
  "data-agent-card-task": ""
}, U = ["data-agent-delegated"], G = {
  key: 1,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, J = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null } },
  setup(e) {
    const h = { main: "Main agent", subagent: "Helper", worker: "Worker", reviewer: "Reviewer" }, t = e, p = w(() => h[t.row.role] ?? t.row.role), $ = j(), x = w(() => t.row.ended_at ? `Closed ${new Date(t.row.ended_at).toLocaleString()}` : `Running ${q(t.row.process_started_at || t.row.created_at, $.value)}`), v = w(() => {
      var i, s, l;
      const g = [];
      return ((i = t.facts) == null ? void 0 : i.context_percent) !== null && ((s = t.facts) == null ? void 0 : s.context_percent) !== void 0 && g.push(`Context ${t.facts.context_percent}%`), (l = t.facts) != null && l.cost_dollars && g.push(`$${t.facts.cost_dollars.toFixed(2)}`), g.join(" · ");
    });
    return (g, i) => {
      var s, l, y;
      return d(), c("button", {
        type: "button",
        class: "agent-card",
        "data-agent-open": e.row.id,
        title: e.row.session,
        onClick: i[0] || (i[0] = (o) => u(F)(`agents:${e.row.id}`))
      }, [
        f("span", M, [
          f("span", {
            class: b(["agent-dot", { running: !e.row.ended_at }])
          }, null, 2),
          f("span", W, n(p.value) + " " + n(e.row.id), 1),
          f("span", z, [
            R(n(e.row.program), 1),
            (s = e.facts) != null && s.model ? (d(), c(C, { key: 0 }, [
              R(" · " + n(e.facts.model), 1)
            ], 64)) : _("", !0)
          ]),
          f("span", {
            class: b(["agent-time", { running: !e.row.ended_at }])
          }, n(x.value), 3)
        ]),
        (l = e.facts) != null && l.task_id ? (d(), c("span", P, "Task " + n(e.facts.task_id) + ": " + n(e.facts.task_title), 1)) : _("", !0),
        (d(!0), c(C, null, O(((y = e.facts) == null ? void 0 : y.delegated) ?? [], (o) => (d(), c(C, {
          key: o.id
        }, [
          o.id !== e.facts.task_id ? (d(), c("span", {
            key: 0,
            class: "agent-task",
            "data-agent-delegated": o.id
          }, "Task " + n(o.id) + ": " + n(o.title) + " · " + n(o.state), 9, U)) : _("", !0)
        ], 64))), 128)),
        v.value ? (d(), c("span", G, n(v.value), 1)) : _("", !0)
      ], 8, H);
    };
  }
}, K = /* @__PURE__ */ A(J, [["__scopeId", "data-v-3617ecd1"]]), Q = {
  class: "agents",
  "data-window-flush": ""
}, X = { class: "agents-bar" }, Y = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, only: { type: Function, default: () => !0 } },
  setup(e) {
    const h = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], t = e, { rows: p, failure: $, loaded: x, more: v, older: g } = N(t.line, ["agent.*"], { incremental: !0 }), { rows: i } = N("usage agents", ["agent.*", "task.*"]), s = S("running"), l = S(""), y = (a) => s.value === "all" || s.value === "running" == !a.ended_at, o = (a) => i.value.find((r) => r.id === a.id) ?? null, V = (a) => {
      var r;
      return `${a.id} ${a.session} ${a.program} ${a.role} ${((r = o(a)) == null ? void 0 : r.task_title) ?? ""}`.toLowerCase().includes(l.value.trim().toLowerCase());
    }, L = w(() => p.value.filter((a) => t.only(a) && y(a) && V(a))), T = w(() => p.value.some(t.only) ? "Nothing matches" : t.empty);
    return (a, r) => (d(), c("div", Q, [
      f("div", X, [
        k(u(I), {
          modelValue: l.value,
          "onUpdate:modelValue": r[0] || (r[0] = (m) => l.value = m),
          icon: "search",
          class: "agents-search",
          placeholder: "Search the agents",
          "data-agents-search": ""
        }, null, 8, ["modelValue"]),
        k(u(B), {
          options: h,
          value: s.value,
          onPick: r[1] || (r[1] = (m) => s.value = m)
        }, null, 8, ["value"])
      ]),
      k(u(D), {
        rows: L.value,
        failure: u($),
        loaded: u(x),
        more: u(v),
        older: u(g),
        empty: T.value
      }, {
        default: E(({ row: m }) => [
          k(K, {
            row: m,
            facts: o(m)
          }, null, 8, ["row", "facts"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "more", "older", "empty"])
    ]));
  }
}, ae = /* @__PURE__ */ A(Y, [["__scopeId", "data-v-657044e9"]]);
export {
  ae as A
};
