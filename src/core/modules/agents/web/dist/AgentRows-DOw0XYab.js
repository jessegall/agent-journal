/* @code-commandments-generated */
import { computed as p, openBlock as d, createElementBlock as c, unref as i, createElementVNode as m, normalizeClass as b, toDisplayString as n, createTextVNode as R, Fragment as C, createCommentVNode as _, renderList as T, ref as S, createVNode as k, withCtx as O } from "vue";
import { useNow as E, age as j, peekRef as q, useRows as N, TextInput as F, Segmented as I, RowList as B } from "@journal/window-kit";
import { _ as A } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const D = ["data-agent-open", "title"], H = { class: "agent-head" }, M = { class: "agent-name" }, W = { class: "agent-program" }, z = {
  key: 0,
  class: "agent-task",
  "data-agent-card-task": ""
}, P = ["data-agent-delegated"], U = {
  key: 1,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, G = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null } },
  setup(e) {
    const h = { main: "Main agent", subagent: "Helper", worker: "Worker", reviewer: "Reviewer" }, t = e, v = p(() => h[t.row.role] ?? t.row.role), $ = E(), x = p(() => t.row.ended_at ? `Closed ${new Date(t.row.ended_at).toLocaleString()}` : `Running ${j(t.row.process_started_at || t.row.created_at, $.value)}`), y = p(() => {
      var s, o, u;
      const g = [];
      return ((s = t.facts) == null ? void 0 : s.context_percent) !== null && ((o = t.facts) == null ? void 0 : o.context_percent) !== void 0 && g.push(`Context ${t.facts.context_percent}%`), (u = t.facts) != null && u.cost_dollars && g.push(`$${t.facts.cost_dollars.toFixed(2)}`), g.join(" · ");
    });
    return (g, s) => {
      var o, u, w;
      return d(), c("button", {
        type: "button",
        class: "agent-card",
        "data-agent-open": e.row.id,
        title: e.row.session,
        onClick: s[0] || (s[0] = (l) => i(q)(`agents:${e.row.id}`))
      }, [
        m("span", H, [
          m("span", {
            class: b(["agent-dot", { running: !e.row.ended_at }])
          }, null, 2),
          m("span", M, n(v.value) + " " + n(e.row.id), 1),
          m("span", W, [
            R(n(e.row.program), 1),
            (o = e.facts) != null && o.model ? (d(), c(C, { key: 0 }, [
              R(" · " + n(e.facts.model), 1)
            ], 64)) : _("", !0)
          ]),
          m("span", {
            class: b(["agent-time", { running: !e.row.ended_at }])
          }, n(x.value), 3)
        ]),
        (u = e.facts) != null && u.task_id ? (d(), c("span", z, "Task " + n(e.facts.task_id) + ": " + n(e.facts.task_title), 1)) : _("", !0),
        (d(!0), c(C, null, T(((w = e.facts) == null ? void 0 : w.delegated) ?? [], (l) => (d(), c(C, {
          key: l.id
        }, [
          l.id !== e.facts.task_id ? (d(), c("span", {
            key: 0,
            class: "agent-task",
            "data-agent-delegated": l.id
          }, "Task " + n(l.id) + ": " + n(l.title) + " · " + n(l.state), 9, P)) : _("", !0)
        ], 64))), 128)),
        y.value ? (d(), c("span", U, n(y.value), 1)) : _("", !0)
      ], 8, D);
    };
  }
}, J = /* @__PURE__ */ A(G, [["__scopeId", "data-v-3617ecd1"]]), K = {
  class: "agents",
  "data-window-flush": ""
}, Q = { class: "agents-bar" }, X = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, only: { type: Function, default: () => !0 } },
  setup(e) {
    const h = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], t = e, { rows: v, failure: $, loaded: x, older: y } = N(t.line, ["agent.*"], { incremental: !0 }), { rows: g } = N("usage agents", ["agent.*", "task.*"]), s = S("running"), o = S(""), u = (a) => s.value === "all" || s.value === "running" == !a.ended_at, w = (a) => g.value.find((r) => r.id === a.id) ?? null, l = (a) => {
      var r;
      return `${a.id} ${a.session} ${a.program} ${a.role} ${((r = w(a)) == null ? void 0 : r.task_title) ?? ""}`.toLowerCase().includes(o.value.trim().toLowerCase());
    }, V = p(() => v.value.filter((a) => t.only(a) && u(a) && l(a))), L = p(() => v.value.some(t.only) ? "Nothing matches" : t.empty);
    return (a, r) => (d(), c("div", K, [
      m("div", Q, [
        k(i(F), {
          modelValue: o.value,
          "onUpdate:modelValue": r[0] || (r[0] = (f) => o.value = f),
          icon: "search",
          class: "agents-search",
          placeholder: "Search the agents",
          "data-agents-search": ""
        }, null, 8, ["modelValue"]),
        k(i(I), {
          options: h,
          value: s.value,
          onPick: r[1] || (r[1] = (f) => s.value = f)
        }, null, 8, ["value"])
      ]),
      k(i(B), {
        rows: V.value,
        failure: i($),
        loaded: i(x),
        older: i(y),
        empty: L.value
      }, {
        default: O(({ row: f }) => [
          k(J, {
            row: f,
            facts: w(f)
          }, null, 8, ["row", "facts"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "older", "empty"])
    ]));
  }
}, te = /* @__PURE__ */ A(X, [["__scopeId", "data-v-52ada3db"]]);
export {
  te as A
};
