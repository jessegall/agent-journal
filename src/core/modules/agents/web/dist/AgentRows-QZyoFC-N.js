/* @code-commandments-generated */
import { openBlock as c, createBlock as l, unref as s, withCtx as p, createElementVNode as n, toDisplayString as t, normalizeClass as _ } from "vue";
import { useRows as m, RowList as u } from "@journal/window-kit";
import { _ as f } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const g = { class: "id" }, y = { class: "main" }, h = { class: "note" }, R = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 } },
  setup(o) {
    const a = o, { rows: r, failure: i, loaded: d } = m(a.line, ["agent.*"]);
    return (x, S) => (c(), l(s(u), {
      rows: s(r),
      failure: s(i),
      loaded: s(d),
      empty: o.empty
    }, {
      default: p(({ row: e }) => [
        n("span", g, "#" + t(e.id), 1),
        n("span", y, t(e.session), 1),
        n("span", h, t(e.program) + " · " + t(e.role), 1),
        n("span", {
          class: _(["state", { running: !e.ended_at }])
        }, t(e.ended_at ? `Closed ${new Date(e.ended_at).toLocaleString()}` : "Running"), 3)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "empty"]));
  }
}, k = /* @__PURE__ */ f(R, [["__scopeId", "data-v-82d859bc"]]);
export {
  k as A
};
