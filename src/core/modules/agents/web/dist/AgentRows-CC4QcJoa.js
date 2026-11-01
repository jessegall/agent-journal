/* @code-commandments-generated */
import { ref as u, computed as p, openBlock as S, createElementBlock as R, createElementVNode as s, createVNode as i, unref as n, withCtx as $, toDisplayString as a, normalizeClass as b } from "vue";
import { useRows as x, TextInput as V, Segmented as A, RowList as L, peekRef as N } from "@journal/window-kit";
import { _ as q } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const w = { class: "agents" }, B = { class: "agents-bar" }, D = ["data-agent-open", "onClick"], E = { class: "id" }, I = { class: "main" }, O = { class: "note" }, T = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 } },
  setup(m) {
    const g = [
      { key: "running", label: "Running" },
      { key: "closed", label: "Closed" },
      { key: "all", label: "All" }
    ], r = m, { rows: c, failure: _, loaded: v, older: h } = x(r.line, ["agent.*"], { incremental: !0 }), o = u("all"), d = u(""), f = (t) => o.value === "all" || o.value === "running" == !t.ended_at, y = (t) => `${t.id} ${t.session} ${t.program} ${t.role}`.toLowerCase().includes(d.value.trim().toLowerCase()), k = p(() => c.value.filter((t) => f(t) && y(t))), C = p(() => c.value.length ? "Nothing matches" : r.empty);
    return (t, l) => (S(), R("div", w, [
      s("div", B, [
        i(n(V), {
          modelValue: d.value,
          "onUpdate:modelValue": l[0] || (l[0] = (e) => d.value = e),
          icon: "search",
          class: "agents-search",
          placeholder: "Search the agents",
          "data-agents-search": ""
        }, null, 8, ["modelValue"]),
        i(n(A), {
          options: g,
          value: o.value,
          onPick: l[1] || (l[1] = (e) => o.value = e)
        }, null, 8, ["value"])
      ]),
      i(n(L), {
        rows: k.value,
        failure: n(_),
        loaded: n(v),
        older: n(h),
        empty: C.value
      }, {
        default: $(({ row: e }) => [
          s("button", {
            type: "button",
            class: "open",
            "data-agent-open": e.id,
            onClick: (z) => n(N)(`agents:${e.id}`)
          }, "Open", 8, D),
          s("span", E, "#" + a(e.id), 1),
          s("span", I, a(e.session), 1),
          s("span", O, a(e.program) + " · " + a(e.role), 1),
          s("span", {
            class: b(["state", { running: !e.ended_at }])
          }, a(e.ended_at ? `Closed ${new Date(e.ended_at).toLocaleString()}` : "Running"), 3)
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "older", "empty"])
    ]));
  }
}, W = /* @__PURE__ */ q(T, [["__scopeId", "data-v-8a962e6d"]]);
export {
  W as A
};
