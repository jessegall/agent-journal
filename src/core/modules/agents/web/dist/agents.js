if (!document.getElementById("window-styles-abbbd49a3736")) { const style = document.createElement("style"); style.id = "window-styles-abbbd49a3736"; style.textContent = ".main[data-v-e1ef6553]{flex:1}.note[data-v-e1ef6553]{color:var(--text-3);font-size:12px}.main[data-v-eded0270]{flex:1}.note[data-v-eded0270]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as r, createBlock as _, unref as e, withCtx as c, createElementVNode as s, toDisplayString as o } from "vue";
import { useRows as i, RowList as p } from "@journal/window-kit";
import { _ as l } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const f = { class: "main" }, m = { class: "note" }, u = { class: "note" }, d = {
  __name: "AgentList",
  setup(g) {
    const { rows: a, failure: n } = i("agent list", ["agent.*"]);
    return (h, w) => (r(), _(e(p), {
      rows: e(a),
      failure: e(n),
      empty: "No agents yet"
    }, {
      default: c(({ row: t }) => [
        s("span", f, o(t.role), 1),
        s("span", m, o(t.session), 1),
        s("span", u, o(t.program), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure"]));
  }
}, k = /* @__PURE__ */ l(d, [["__scopeId", "data-v-e1ef6553"]]);
export {
  k as default
};
