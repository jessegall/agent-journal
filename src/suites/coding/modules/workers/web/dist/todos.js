/* @code-commandments-generated */
if (!document.getElementById("window-styles-84cb590f6ec5")) { const style = document.createElement("style"); style.id = "window-styles-84cb590f6ec5"; style.textContent = ".number[data-v-de42c19d]{color:var(--text-3);font-size:12px}.main[data-v-de42c19d]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-de42c19d]{color:var(--text-3);font-size:12px}.main[data-v-d17dfe5e]{flex:1}.note[data-v-d17dfe5e]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as i, createBlock as _, unref as t, withCtx as c, createElementVNode as o, toDisplayString as s } from "vue";
import { useRows as l, useWindow as p, RowList as m } from "@journal/window-kit";
import { _ as f } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const u = { class: "main" }, g = { class: "note" }, T = {
  __name: "Todos",
  setup(h) {
    const a = { pending: "to do", in_progress: "doing", completed: "done" }, { rows: n, failure: d, loaded: r } = l(`todo-item list --agent ${p().agent} --oldest`, ["todo_item.*"]);
    return (w, x) => (i(), _(t(m), {
      rows: t(n),
      failure: t(d),
      loaded: t(r),
      empty: "This agent has written no tasks yet"
    }, {
      default: c(({ row: e }) => [
        o("span", u, s(e.text), 1),
        o("span", g, s(a[e.state] || e.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, B = /* @__PURE__ */ f(T, [["__scopeId", "data-v-d17dfe5e"]]);
export {
  B as default
};
