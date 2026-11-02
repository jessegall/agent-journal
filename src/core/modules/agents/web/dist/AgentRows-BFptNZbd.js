/* @code-commandments-generated */
import { computed as m, openBlock as g, createElementBlock as f, unref as c, createElementVNode as i, normalizeClass as x, toDisplayString as l, createTextVNode as C, Fragment as L, createCommentVNode as h, ref as b, createVNode as v, withCtx as O } from "vue";
import { age as T, peekRef as E, useRows as R, TextInput as j, Segmented as q, RowList as F } from "@journal/window-kit";
import { _ as S } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const I = ["data-agent-open", "title"], B = { class: "agent-head" }, D = { class: "agent-name" }, H = { class: "agent-program" }, M = {
  key: 0,
  class: "agent-task",
  "data-agent-card-task": ""
}, W = {
  key: 1,
  class: "agent-usage",
  "data-agent-card-usage": ""
}, z = {
  __name: "AgentCard",
  props: { row: { type: Object, required: !0 }, facts: { type: Object, default: null } },
  setup(e) {
    const _ = { main: "Main agent", subagent: "Helper", worker: "Worker", reviewer: "Reviewer" }, t = e, p = m(() => _[t.row.role] ?? t.row.role), k = m(() => t.row.ended_at ? `Closed ${new Date(t.row.ended_at).toLocaleString()}` : `Running ${T(t.row.process_started_at || t.row.created_at)}`), w = m(() => {
      var r, n, s;
      const d = [];
      return ((r = t.facts) == null ? void 0 : r.context_percent) !== null && ((n = t.facts) == null ? void 0 : n.context_percent) !== void 0 && d.push(`Context ${t.facts.context_percent}%`), (s = t.facts) != null && s.cost_dollars && d.push(`$${t.facts.cost_dollars.toFixed(2)}`), d.join(" · ");
    });
    return (d, r) => {
      var n, s;
      return g(), f("button", {
        type: "button",
        class: "agent-card",
        "data-agent-open": e.row.id,
        title: e.row.session,
        onClick: r[0] || (r[0] = (y) => c(E)(`agents:${e.row.id}`))
      }, [
        i("span", B, [
          i("span", {
            class: x(["agent-dot", { running: !e.row.ended_at }])
          }, null, 2),
          i("span", D, l(p.value) + " " + l(e.row.id), 1),
          i("span", H, [
            C(l(e.row.program), 1),
            (n = e.facts) != null && n.model ? (g(), f(L, { key: 0 }, [
              C(" · " + l(e.facts.model), 1)
            ], 64)) : h("", !0)
          ]),
          i("span", {
            class: x(["agent-time", { running: !e.row.ended_at }])
          }, l(k.value), 3)
        ]),
        (s = e.facts) != null && s.task_id ? (g(), f("span", M, "Task " + l(e.facts.task_id) + ": " + l(e.facts.task_title), 1)) : h("", !0),
        w.value ? (g(), f("span", W, l(w.value), 1)) : h("", !0)
      ], 8, I);
    };
  }
}, P = /* @__PURE__ */ S(z, [["__scopeId", "data-v-6a5fba39"]]), U = {
  class: "agents",
  "data-window-flush": ""
}, G = { class: "agents-bar" }, J = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 }, only: { type: Function, default: () => !0 } },
  setup(e) {
    const _ = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], t = e, { rows: p, failure: k, loaded: w, older: d } = R(t.line, ["agent.*"], { incremental: !0 }), { rows: r } = R("usage agents", ["agent.*", "task.*"]), n = b("running"), s = b(""), y = (a) => n.value === "all" || n.value === "running" == !a.ended_at, $ = (a) => r.value.find((o) => o.id === a.id) ?? null, A = (a) => {
      var o;
      return `${a.id} ${a.session} ${a.program} ${a.role} ${((o = $(a)) == null ? void 0 : o.task_title) ?? ""}`.toLowerCase().includes(s.value.trim().toLowerCase());
    }, N = m(() => p.value.filter((a) => t.only(a) && y(a) && A(a))), V = m(() => p.value.length ? "Nothing matches" : t.empty);
    return (a, o) => (g(), f("div", U, [
      i("div", G, [
        v(c(j), {
          modelValue: s.value,
          "onUpdate:modelValue": o[0] || (o[0] = (u) => s.value = u),
          icon: "search",
          class: "agents-search",
          placeholder: "Search the agents",
          "data-agents-search": ""
        }, null, 8, ["modelValue"]),
        v(c(q), {
          options: _,
          value: n.value,
          onPick: o[1] || (o[1] = (u) => n.value = u)
        }, null, 8, ["value"])
      ]),
      v(c(F), {
        rows: N.value,
        failure: c(k),
        loaded: c(w),
        older: c(d),
        empty: V.value
      }, {
        default: O(({ row: u }) => [
          v(P, {
            row: u,
            facts: $(u)
          }, null, 8, ["row", "facts"])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "older", "empty"])
    ]));
  }
}, Y = /* @__PURE__ */ S(J, [["__scopeId", "data-v-82d48916"]]);
export {
  Y as A
};
