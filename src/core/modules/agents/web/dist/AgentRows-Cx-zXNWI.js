/* @code-commandments-generated */
import { computed as f, openBlock as g, createElementBlock as m, unref as c, createElementVNode as i, normalizeClass as x, toDisplayString as l, createTextVNode as b, Fragment as L, createCommentVNode as $, ref as C, createVNode as v, withCtx as O } from "vue";
import { useNow as T, age as E, peekRef as j, useRows as R, TextInput as q, Segmented as F, RowList as I } from "@journal/window-kit";
import { _ as S } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const B = ["data-agent-open", "title"], D = { class: "agent-head" }, H = { class: "agent-name" }, M = { class: "agent-program" }, W = {
  key: 0,
  class: "agent-task",
  "data-agent-card-task": ""
}, z = {
  key: 1,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, P = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null } },
  setup(t) {
    const _ = { main: "Main agent", subagent: "Helper", worker: "Worker", reviewer: "Reviewer" }, e = t, p = f(() => _[e.row.role] ?? e.row.role), k = T(), y = f(() => e.row.ended_at ? `Closed ${new Date(e.row.ended_at).toLocaleString()}` : `Running ${E(e.row.process_started_at || e.row.created_at, k.value)}`), w = f(() => {
      var n, s, r;
      const d = [];
      return ((n = e.facts) == null ? void 0 : n.context_percent) !== null && ((s = e.facts) == null ? void 0 : s.context_percent) !== void 0 && d.push(`Context ${e.facts.context_percent}%`), (r = e.facts) != null && r.cost_dollars && d.push(`$${e.facts.cost_dollars.toFixed(2)}`), d.join(" · ");
    });
    return (d, n) => {
      var s, r;
      return g(), m("button", {
        type: "button",
        class: "agent-card",
        "data-agent-open": t.row.id,
        title: t.row.session,
        onClick: n[0] || (n[0] = (h) => c(j)(`agents:${t.row.id}`))
      }, [
        i("span", D, [
          i("span", {
            class: x(["agent-dot", { running: !t.row.ended_at }])
          }, null, 2),
          i("span", H, l(p.value) + " " + l(t.row.id), 1),
          i("span", M, [
            b(l(t.row.program), 1),
            (s = t.facts) != null && s.model ? (g(), m(L, { key: 0 }, [
              b(" · " + l(t.facts.model), 1)
            ], 64)) : $("", !0)
          ]),
          i("span", {
            class: x(["agent-time", { running: !t.row.ended_at }])
          }, l(y.value), 3)
        ]),
        (r = t.facts) != null && r.task_id ? (g(), m("span", W, "Task " + l(t.facts.task_id) + ": " + l(t.facts.task_title), 1)) : $("", !0),
        w.value ? (g(), m("span", z, l(w.value), 1)) : $("", !0)
      ], 8, B);
    };
  }
}, U = /* @__PURE__ */ S(P, [["__scopeId", "data-v-510ea2b8"]]), G = {
  class: "agents",
  "data-window-flush": ""
}, J = { class: "agents-bar" }, K = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, only: { type: Function, default: () => !0 } },
  setup(t) {
    const _ = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], e = t, { rows: p, failure: k, loaded: y, older: w } = R(e.line, ["agent.*"], { incremental: !0 }), { rows: d } = R("usage agents", ["agent.*", "task.*"]), n = C("running"), s = C(""), r = (a) => n.value === "all" || n.value === "running" == !a.ended_at, h = (a) => d.value.find((o) => o.id === a.id) ?? null, N = (a) => {
      var o;
      return `${a.id} ${a.session} ${a.program} ${a.role} ${((o = h(a)) == null ? void 0 : o.task_title) ?? ""}`.toLowerCase().includes(s.value.trim().toLowerCase());
    }, A = f(() => p.value.filter((a) => e.only(a) && r(a) && N(a))), V = f(() => p.value.some(e.only) ? "Nothing matches" : e.empty);
    return (a, o) => (g(), m("div", G, [
      i("div", J, [
        v(c(q), {
          modelValue: s.value,
          "onUpdate:modelValue": o[0] || (o[0] = (u) => s.value = u),
          icon: "search",
          class: "agents-search",
          placeholder: "Search the agents",
          "data-agents-search": ""
        }, null, 8, ["modelValue"]),
        v(c(F), {
          options: _,
          value: n.value,
          onPick: o[1] || (o[1] = (u) => n.value = u)
        }, null, 8, ["value"])
      ]),
      v(c(I), {
        rows: A.value,
        failure: c(k),
        loaded: c(y),
        older: c(w),
        empty: V.value
      }, {
        default: O(({ row: u }) => [
          v(U, {
            row: u,
            facts: h(u)
          }, null, 8, ["row", "facts"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "older", "empty"])
    ]));
  }
}, Z = /* @__PURE__ */ S(K, [["__scopeId", "data-v-52ada3db"]]);
export {
  Z as A
};
