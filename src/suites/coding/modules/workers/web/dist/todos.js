/* @code-commandments-generated */
if (!document.getElementById("window-styles-c1ef6a3e59fa")) { const style = document.createElement("style"); style.id = "window-styles-c1ef6a3e59fa"; style.textContent = ".worker-models[data-v-703d4f39]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-703d4f39]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-703d4f39]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-703d4f39]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-703d4f39]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-703d4f39]{display:flex;gap:8px;align-items:center}.number[data-v-470549ee]{color:var(--text-3);font-size:12px}.main[data-v-470549ee]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-470549ee]{color:var(--text-3);font-size:12px}.main[data-v-7b462dac]{flex:1}.note[data-v-7b462dac]{color:var(--text-3);font-size:12px}.worker-moment[data-v-b883c89e]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-b883c89e]{flex:none;color:var(--text-3);font-size:12px}.worker-tab-body[data-v-2e45450f]{padding:14px 16px}.worktree[data-v-ca173274]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-ca173274]{flex:1;min-width:0}.worktree-holder[data-v-ca173274]{font-weight:500}.worktree-folder[data-v-ca173274]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-ca173274]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { openBlock as p, createBlock as _, unref as t, withCtx as s, createVNode as l, createElementVNode as a, toDisplayString as n } from "vue";
import { useWindow as m, WindowRoom as f, RowList as u } from "@journal/window-kit";
import { _ as g } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const h = { class: "main" }, w = { class: "note" }, T = {
  __name: "Todos",
  setup(x) {
    const r = { pending: "to do", in_progress: "doing", completed: "done" }, e = m();
    e.state["todos.agent"] = String(e.agent);
    const { rows: d, failure: i, loaded: c } = e.props.todos;
    return (k, y) => (p(), _(t(f), null, {
      default: s(() => [
        l(t(u), {
          rows: t(d),
          failure: t(i),
          loaded: t(c),
          empty: "This agent has written no tasks yet",
          hint: "Tasks created by this agent appear here."
        }, {
          default: s(({ row: o }) => [
            a("span", h, n(o.text), 1),
            a("span", w, n(r[o.state] || o.state), 1)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, B = /* @__PURE__ */ g(T, [["__scopeId", "data-v-7b462dac"]]);
export {
  B as default
};
