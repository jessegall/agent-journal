/* @code-commandments-generated */
import { openBlock as c, createBlock as p, unref as t, withCtx as _, createElementVNode as s, toDisplayString as o } from "vue";
import { useRows as m, RowList as l } from "@journal/window-kit";
import { _ as u } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const f = { class: "main" }, d = { class: "note" }, g = { class: "note" }, y = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 } },
  setup(r) {
    const n = r, { rows: a, failure: i } = m(n.line, ["agent.*"]);
    return (w, h) => (c(), p(t(l), {
      rows: t(a),
      failure: t(i),
      empty: r.empty
    }, {
      default: _(({ row: e }) => [
        s("span", f, o(e.role), 1),
        s("span", d, o(e.session), 1),
        s("span", g, o(e.program), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "empty"]));
  }
}, S = /* @__PURE__ */ u(y, [["__scopeId", "data-v-88fb5cd3"]]);
export {
  S as A
};
