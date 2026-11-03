/* @code-commandments-generated */
import { openBlock as l, createBlock as p, unref as e, withCtx as _, createElementVNode as c, toDisplayString as i } from "vue";
import { useRows as d, RowList as u } from "@journal/window-kit";
const h = (t, s) => {
  const o = t.__vccOpts || t;
  for (const [r, a] of s)
    o[r] = a;
  return o;
}, f = { class: "author" }, w = { class: "text" }, m = {
  __name: "TranscriptRows",
  props: { line: { type: String, required: !0 } },
  setup(t) {
    const s = t, { rows: o, failure: r, loaded: a } = d(s.line, ["hook_call.create"]);
    return (x, k) => (l(), p(e(u), {
      rows: e(o),
      failure: e(r),
      loaded: e(a),
      empty: "No conversation yet",
      hint: "The agent's words and its tool calls show here as it works."
    }, {
      default: _(({ row: n }) => [
        c("span", f, i(n.author), 1),
        c("span", w, i(n.text), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, v = /* @__PURE__ */ h(m, [["__scopeId", "data-v-122832ab"]]);
export {
  v as T,
  h as _
};
