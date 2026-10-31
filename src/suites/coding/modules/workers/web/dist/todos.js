/* @code-commandments-generated */
if (!document.getElementById("window-styles-6277b4c92604")) { const style = document.createElement("style"); style.id = "window-styles-6277b4c92604"; style.textContent = ".number[data-v-de42c19d]{color:var(--text-3);font-size:12px}.main[data-v-de42c19d]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-de42c19d]{color:var(--text-3);font-size:12px}.main[data-v-41c93352]{flex:1}.note[data-v-41c93352]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as r, createBlock as _, unref as t, withCtx as c, createElementVNode as e, toDisplayString as s } from "vue";
import { useRows as l, useWindow as p, RowList as m } from "@journal/window-kit";
import { _ as f } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const u = { class: "main" }, g = { class: "note" }, T = {
  __name: "Todos",
  setup(h) {
    const a = { pending: "to do", in_progress: "doing", completed: "done" }, { rows: n, failure: d, loaded: i } = l(`todo-item list --agent ${p().agent} --oldest`, ["todo_item.*"]);
    return (w, x) => (r(), _(t(m), {
      rows: t(n),
      failure: t(d),
      loaded: t(i),
      empty: "This agent has written no to-do list yet"
    }, {
      default: c(({ row: o }) => [
        e("span", u, s(o.text), 1),
        e("span", g, s(a[o.state] || o.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, B = /* @__PURE__ */ f(T, [["__scopeId", "data-v-41c93352"]]);
export {
  B as default
};
