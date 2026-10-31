/* @code-commandments-generated */
if (!document.getElementById("window-styles-0b709971b4a2")) { const style = document.createElement("style"); style.id = "window-styles-0b709971b4a2"; style.textContent = ".number[data-v-b5e3a59a]{color:var(--text-3);font-size:12px}.main[data-v-b5e3a59a]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-b5e3a59a]{color:var(--text-3);font-size:12px}.main[data-v-2041751c]{flex:1}.note[data-v-2041751c]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as r, createBlock as _, unref as o, withCtx as c, createElementVNode as e, toDisplayString as s } from "vue";
import { useRows as d, useWindow as p, RowList as l } from "@journal/window-kit";
import { _ as m } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const f = { class: "main" }, u = { class: "note" }, g = {
  __name: "Todos",
  setup(T) {
    const n = { pending: "to do", in_progress: "doing", completed: "done" }, { rows: a, failure: i } = d(`todo-item list --agent ${p().agent} --oldest`, ["todo_item.*"]);
    return (h, w) => (r(), _(o(l), {
      rows: o(a),
      failure: o(i),
      empty: "This agent has written no to-do list yet"
    }, {
      default: c(({ row: t }) => [
        e("span", f, s(t.text), 1),
        e("span", u, s(n[t.state] || t.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure"]));
  }
}, k = /* @__PURE__ */ m(g, [["__scopeId", "data-v-2041751c"]]);
export {
  k as default
};
