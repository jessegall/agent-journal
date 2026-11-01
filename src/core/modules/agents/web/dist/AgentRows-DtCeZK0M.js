/* @code-commandments-generated */
import { ref as c, computed as p, openBlock as x, createElementBlock as C, createElementVNode as n, createVNode as d, unref as s, withCtx as R, toDisplayString as a, normalizeClass as V } from "vue";
import { useRows as $, TextInput as b, Segmented as w, RowList as A } from "@journal/window-kit";
import { _ as L } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const N = { class: "agents" }, q = { class: "agents-bar" }, B = { class: "id" }, D = { class: "main" }, E = { class: "note" }, I = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 } },
  setup(m) {
    const g = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], i = m, { rows: u, failure: _, loaded: v, older: h } = $(i.line, ["agent.*"], { incremental: !0 }), l = c("all"), r = c(""), f = (t) => l.value === "all" || l.value === "running" == !t.ended_at, y = (t) => `${t.id} ${t.session} ${t.program} ${t.role}`.toLowerCase().includes(r.value.trim().toLowerCase()), S = p(() => u.value.filter((t) => f(t) && y(t))), k = p(() => u.value.length ? "Nothing matches" : i.empty);
    return (t, o) => (x(), C("div", N, [
      n("div", q, [
        d(s(b), {
          modelValue: r.value,
          "onUpdate:modelValue": o[0] || (o[0] = (e) => r.value = e),
          icon: "search",
          class: "agents-search",
          placeholder: "Search the agents",
          "data-agents-search": ""
        }, null, 8, ["modelValue"]),
        d(s(w), {
          options: g,
          value: l.value,
          onPick: o[1] || (o[1] = (e) => l.value = e)
        }, null, 8, ["value"])
      ]),
      d(s(A), {
        rows: S.value,
        failure: s(_),
        loaded: s(v),
        older: s(h),
        empty: k.value
      }, {
        default: R(({ row: e }) => [
          n("span", B, "#" + a(e.id), 1),
          n("span", D, a(e.session), 1),
          n("span", E, a(e.program) + " · " + a(e.role), 1),
          n("span", {
            class: V(["state", { running: !e.ended_at }])
          }, a(e.ended_at ? `Closed ${new Date(e.ended_at).toLocaleString()}` : "Running"), 3)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "older", "empty"])
    ]));
  }
}, O = /* @__PURE__ */ L(I, [["__scopeId", "data-v-449e1a48"]]);
export {
  O as A
};
