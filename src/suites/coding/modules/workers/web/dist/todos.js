/* @code-commandments-generated */
if (!document.getElementById("window-styles-2bcde7f8aff3")) { const style = document.createElement("style"); style.id = "window-styles-2bcde7f8aff3"; style.textContent = ".worker-models[data-v-703d4f39]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-703d4f39]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-703d4f39]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-703d4f39]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-703d4f39]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-703d4f39]{display:flex;gap:8px;align-items:center}.number[data-v-470549ee]{color:var(--text-3);font-size:12px}.main[data-v-470549ee]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-470549ee]{color:var(--text-3);font-size:12px}.main[data-v-ef968966]{flex:1}.note[data-v-ef968966]{color:var(--text-3);font-size:12px}.worker-moment[data-v-4889fbf7]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-4889fbf7]{flex:none;color:var(--text-3);font-size:12px}.worker-tab-body[data-v-4596a516]{padding:14px 16px}.worktree[data-v-ca173274]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-ca173274]{flex:1;min-width:0}.worktree-holder[data-v-ca173274]{font-weight:500}.worktree-folder[data-v-ca173274]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-ca173274]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { openBlock as _, createBlock as c, unref as e, withCtx as o, createVNode as l, createElementVNode as s, toDisplayString as a } from "vue";
import { useRows as p, useWindow as m, WindowRoom as f, RowList as u } from "@journal/window-kit";
import { _ as h } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const g = { class: "main" }, T = { class: "note" }, w = {
  __name: "Todos",
  setup(x) {
    const n = { pending: "to do", in_progress: "doing", completed: "done" }, { rows: d, failure: r, loaded: i } = p(`todo-item list --agent ${m().agent} --oldest`, ["todo_item.*"]);
    return (k, y) => (_(), c(e(f), null, {
      default: o(() => [
        l(e(u), {
          rows: e(d),
          failure: e(r),
          loaded: e(i),
          empty: "This agent has written no tasks yet",
          hint: "Tasks created by this agent appear here."
        }, {
          default: o(({ row: t }) => [
            s("span", g, a(t.text), 1),
            s("span", T, a(n[t.state] || t.state), 1)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, N = /* @__PURE__ */ h(w, [["__scopeId", "data-v-ef968966"]]);
export {
  N as default
};
