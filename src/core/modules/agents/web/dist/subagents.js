if (!document.getElementById("window-styles-abbbd49a3736")) { const style = document.createElement("style"); style.id = "window-styles-abbbd49a3736"; style.textContent = ".main[data-v-e1ef6553]{flex:1}.note[data-v-e1ef6553]{color:var(--text-3);font-size:12px}.main[data-v-eded0270]{flex:1}.note[data-v-eded0270]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as r, createBlock as i, unref as e, withCtx as _, createElementVNode as s, toDisplayString as o } from "vue";
import { useRows as c, useWindow as p, RowList as l } from "@journal/window-kit";
import { _ as u } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const m = { class: "main" }, d = { class: "note" }, f = { class: "note" }, g = {
  __name: "SubagentList",
  setup(h) {
    const { rows: a, failure: n } = c(`agent list --parent ${p().agent}`, ["agent.*"]);
    return (w, x) => (r(), i(e(l), {
      rows: e(a),
      failure: e(n),
      empty: "No subagents yet"
    }, {
      default: _(({ row: t }) => [
        s("span", m, o(t.role), 1),
        s("span", d, o(t.session), 1),
        s("span", f, o(t.program), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure"]));
  }
}, S = /* @__PURE__ */ u(g, [["__scopeId", "data-v-eded0270"]]);
export {
  S as default
};
