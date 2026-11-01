/* @code-commandments-generated */
import { openBlock as c, createBlock as p, unref as t, withCtx as _, createElementVNode as n, toDisplayString as s, normalizeClass as m } from "vue";
import { useRows as u, RowList as f } from "@journal/window-kit";
import { _ as g } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const y = { class: "id" }, h = { class: "main" }, R = { class: "note" }, x = {
  __name: "AgentRows",
  props: { line: { type: String, required: !0 }, empty: { type: String, required: !0 } },
  setup(o) {
    const a = o, { rows: r, failure: i, loaded: d, older: l } = u(a.line, ["agent.*"], { incremental: !0 });
    return (S, w) => (c(), p(t(f), {
      rows: t(r),
      failure: t(i),
      loaded: t(d),
      older: t(l),
      empty: o.empty
    }, {
      default: _(({ row: e }) => [
        n("span", y, "#" + s(e.id), 1),
        n("span", h, s(e.session), 1),
        n("span", R, s(e.program) + " · " + s(e.role), 1),
        n("span", {
          class: m(["state", { running: !e.ended_at }])
        }, s(e.ended_at ? `Closed ${new Date(e.ended_at).toLocaleString()}` : "Running"), 3)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded", "older", "empty"]));
  }
}, q = /* @__PURE__ */ g(x, [["__scopeId", "data-v-91909350"]]);
export {
  q as A
};
