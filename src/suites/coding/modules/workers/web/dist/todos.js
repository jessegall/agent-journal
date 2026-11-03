/* @code-commandments-generated */
if (!document.getElementById("window-styles-61d024f416fa")) { const style = document.createElement("style"); style.id = "window-styles-61d024f416fa"; style.textContent = ".worker-models[data-v-39e23a54]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-39e23a54]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-39e23a54]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-39e23a54]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-39e23a54]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-39e23a54]{display:flex;gap:8px;align-items:center}.number[data-v-878fda70]{color:var(--text-3);font-size:12px}.main[data-v-878fda70]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-878fda70]{color:var(--text-3);font-size:12px}.main[data-v-176788f1]{flex:1}.note[data-v-176788f1]{color:var(--text-3);font-size:12px}.worktree[data-v-a608a096]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-a608a096]{flex:1;min-width:0}.worktree-holder[data-v-a608a096]{font-weight:500}.worktree-folder[data-v-a608a096]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-a608a096]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { openBlock as l, createBlock as _, unref as t, withCtx as o, createVNode as c, createElementVNode as s, toDisplayString as a } from "vue";
import { useRows as p, useWindow as m, WindowRoom as f, RowList as u } from "@journal/window-kit";
import { _ as h } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const w = { class: "main" }, T = { class: "note" }, g = {
  __name: "Todos",
  setup(k) {
    const n = { pending: "to do", in_progress: "doing", completed: "done" }, { rows: i, failure: d, loaded: r } = p(`todo-item list --agent ${m().agent} --oldest`, ["todo_item.*"]);
    return (x, y) => (l(), _(t(f), null, {
      default: o(() => [
        c(t(u), {
          rows: t(i),
          failure: t(d),
          loaded: t(r),
          empty: "This agent has written no tasks yet",
          hint: "The tasks it files with journal task make show here."
        }, {
          default: o(({ row: e }) => [
            s("span", w, a(e.text), 1),
            s("span", T, a(n[e.state] || e.state), 1)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, N = /* @__PURE__ */ h(g, [["__scopeId", "data-v-176788f1"]]);
export {
  N as default
};
