/* @code-commandments-generated */
import { openBlock as c, createBlock as l, unref as e, withCtx as _, createElementVNode as o, toDisplayString as s } from "vue";
import { useRows as d, RowList as m } from "@journal/window-kit";
import { _ as u } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const f = { class: "main" }, g = { class: "note" }, y = { class: "note" }, w = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 } },
  setup(r) {
    const n = r, { rows: a, failure: i, loaded: p } = d(n.line, ["agent.*"]);
    return (h, x) => (c(), l(e(m), {
      rows: e(a),
      failure: e(i),
      loaded: e(p),
      empty: r.empty
    }, {
      default: _(({ row: t }) => [
        o("span", f, s(t.role), 1),
        o("span", g, s(t.session), 1),
        o("span", y, s(t.program), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, k = /* @__PURE__ */ u(w, [["__scopeId", "data-v-3ba38727"]]);
export {
  k as A
};
