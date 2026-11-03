/* @code-commandments-generated */
import { openBlock as p, createBlock as _, unref as o, withCtx as l, createElementVNode as n, toDisplayString as i } from "vue";
import { useRows as u, RowList as d } from "@journal/window-kit";
const f = (t, r) => {
  const e = t.__vccOpts || t;
  for (const [s, a] of r)
    e[s] = a;
  return e;
}, m = { class: "author" }, h = { class: "text" }, w = {
  __name: "TranscriptRows",
  props: { line: { type: String, required: !0 } },
  setup(t) {
    const r = t, { rows: e, failure: s, loaded: a } = u(r.line, ["hook_call.create"]);
    return (x, y) => (p(), _(o(d), {
      rows: o(e),
      failure: o(s),
      loaded: o(a),
      empty: "No conversation yet"
    }, {
      default: l(({ row: c }) => [
        n("span", m, i(c.author), 1),
        n("span", h, i(c.text), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, R = /* @__PURE__ */ f(w, [["__scopeId", "data-v-f34e0cbb"]]);
export {
  R as T,
  f as _
};
