/* @code-commandments-generated */
if (!document.getElementById("window-styles-dc07c7617deb")) { const style = document.createElement("style"); style.id = "window-styles-dc07c7617deb"; style.textContent = ".worker-models[data-v-310982ed]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-310982ed]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-310982ed]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-310982ed]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-310982ed]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-310982ed]{display:flex;gap:8px;align-items:center}.number[data-v-d5811db8]{color:var(--text-3);font-size:12px}.main[data-v-d5811db8]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-d5811db8]{color:var(--text-3);font-size:12px}.main[data-v-35658be4]{flex:1}.note[data-v-35658be4]{color:var(--text-3);font-size:12px}.worktree[data-v-28015355]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-28015355]{flex:1;min-width:0}.worktree-holder[data-v-28015355]{font-weight:500}.worktree-folder[data-v-28015355]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-28015355]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { openBlock as d, createBlock as _, unref as t, withCtx as c, createElementVNode as o, toDisplayString as s } from "vue";
import { useRows as l, useWindow as p, RowList as m } from "@journal/window-kit";
import { _ as f } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const u = { class: "main" }, h = { class: "note" }, w = {
  __name: "Todos",
  setup(T) {
    const a = { pending: "to do", in_progress: "doing", completed: "done" }, { rows: n, failure: i, loaded: r } = l(`todo-item list --agent ${p().agent} --oldest`, ["todo_item.*"]);
    return (g, k) => (d(), _(t(m), {
      rows: t(n),
      failure: t(i),
      loaded: t(r),
      empty: "This agent has written no tasks yet",
      hint: "The tasks it files with journal task make show here."
    }, {
      default: c(({ row: e }) => [
        o("span", u, s(e.text), 1),
        o("span", h, s(a[e.state] || e.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, B = /* @__PURE__ */ f(w, [["__scopeId", "data-v-35658be4"]]);
export {
  B as default
};
