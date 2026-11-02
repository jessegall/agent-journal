/* @code-commandments-generated */
import { computed as f, openBlock as g, createElementBlock as m, unref as c, createElementVNode as i, normalizeClass as x, toDisplayString as l, createTextVNode as C, Fragment as L, createCommentVNode as $, ref as b, createVNode as v, withCtx as O } from "vue";
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
  setup(e) {
    const _ = { main: "Main agent", subagent: "Helper", worker: "Worker", reviewer: "Reviewer" }, t = e, p = f(() => _[t.row.role] ?? t.row.role), k = T(), h = f(() => t.row.ended_at ? `Closed ${new Date(t.row.ended_at).toLocaleString()}` : `Running ${E(t.row.process_started_at || t.row.created_at, k.value)}`), w = f(() => {
      var n, s, r;
      const d = [];
      return ((n = t.facts) == null ? void 0 : n.context_percent) !== null && ((s = t.facts) == null ? void 0 : s.context_percent) !== void 0 && d.push(`Context ${t.facts.context_percent}%`), (r = t.facts) != null && r.cost_dollars && d.push(`$${t.facts.cost_dollars.toFixed(2)}`), d.join(" · ");
    });
    return (d, n) => {
      var s, r;
      return g(), m("button", {
        type: "button",
        class: "agent-card",
        "data-agent-open": e.row.id,
        title: e.row.session,
        onClick: n[0] || (n[0] = (y) => c(j)(`agents:${e.row.id}`))
      }, [
        i("span", D, [
          i("span", {
            class: x(["agent-dot", { running: !e.row.ended_at }])
          }, null, 2),
          i("span", H, l(p.value) + " " + l(e.row.id), 1),
          i("span", M, [
            C(l(e.row.program), 1),
            (s = e.facts) != null && s.model ? (g(), m(L, { key: 0 }, [
              C(" · " + l(e.facts.model), 1)
            ], 64)) : $("", !0)
          ]),
          i("span", {
            class: x(["agent-time", { running: !e.row.ended_at }])
          }, l(h.value), 3)
        ]),
        (r = e.facts) != null && r.task_id ? (g(), m("span", W, "Task " + l(e.facts.task_id) + ": " + l(e.facts.task_title), 1)) : $("", !0),
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
  setup(e) {
    const _ = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], t = e, { rows: p, failure: k, loaded: h, older: w } = R(t.line, ["agent.*"], { incremental: !0 }), { rows: d } = R("usage agents", ["agent.*", "task.*"]), n = b("running"), s = b(""), r = (a) => n.value === "all" || n.value === "running" == !a.ended_at, y = (a) => d.value.find((o) => o.id === a.id) ?? null, N = (a) => {
      var o;
      return `${a.id} ${a.session} ${a.program} ${a.role} ${((o = y(a)) == null ? void 0 : o.task_title) ?? ""}`.toLowerCase().includes(s.value.trim().toLowerCase());
    }, A = f(() => p.value.filter((a) => t.only(a) && r(a) && N(a))), V = f(() => p.value.length ? "Nothing matches" : t.empty);
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
        loaded: c(h),
        older: c(w),
        empty: V.value
      }, {
        default: O(({ row: u }) => [
          v(U, {
            row: u,
            facts: y(u)
          }, null, 8, ["row", "facts"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "older", "empty"])
    ]));
  }
}, Z = /* @__PURE__ */ S(K, [["__scopeId", "data-v-82d48916"]]);
export {
  Z as A
};
