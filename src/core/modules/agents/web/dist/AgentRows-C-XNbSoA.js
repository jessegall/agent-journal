/* @code-commandments-generated */
import { openBlock as p, createBlock as _, unref as n, withCtx as l, createElementVNode as c, toDisplayString as a } from "vue";
import { useRows as u, RowList as m } from "@journal/window-kit";
const f = (t, s) => {
  const e = t.__vccOpts || t;
  for (const [o, i] of s)
    e[o] = i;
  return e;
}, d = { class: "main" }, g = { class: "note" }, y = { class: "note" }, w = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 } },
  setup(t) {
    const s = t, { rows: e, failure: o } = u(s.line, ["agent.*"]);
    return (i, h) => (p(), _(n(m), {
      rows: n(e),
      failure: n(o),
      empty: t.empty
    }, {
      default: l(({ row: r }) => [
        c("span", d, a(r.role), 1),
        c("span", g, a(r.session), 1),
        c("span", y, a(r.program), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "empty"]));
  }
}, k = /* @__PURE__ */ f(w, [["__scopeId", "data-v-88fb5cd3"]]);
export {
  k as A
};
