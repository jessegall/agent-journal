/* @code-commandments-generated */
if (!document.getElementById("window-styles-9350f31ae916")) { const style = document.createElement("style"); style.id = "window-styles-9350f31ae916"; style.textContent = ".worker-models[data-v-8506c219]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-8506c219]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-8506c219]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-8506c219]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-8506c219]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-8506c219]{display:flex;gap:8px;align-items:center}.number[data-v-6eb6af04]{color:var(--text-3);font-size:12px}.main[data-v-6eb6af04]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-6eb6af04]{color:var(--text-3);font-size:12px}.main[data-v-a11fd403]{flex:1}.note[data-v-a11fd403]{color:var(--text-3);font-size:12px}.worker-moment[data-v-826dfb51]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-826dfb51]{flex:none;color:var(--text-3);font-size:12px}.program[data-v-fbd94d47]{display:flex;flex-direction:column;gap:6px;padding:10px 0;border-bottom:1px solid var(--border)}.share[data-v-fbd94d47]{display:flex;align-items:center;gap:8px}input[data-v-fbd94d47]{min-width:0;flex:1}output[data-v-fbd94d47]{min-width:36px;text-align:right}small[data-v-fbd94d47]{color:var(--text-3)}p[data-v-fbd94d47]{margin:0}.actions[data-v-fbd94d47]{display:flex;gap:6px}.route[data-v-928533ab]{display:flex;flex-direction:column;gap:6px;padding:10px 0;border-bottom:1px solid var(--border)}p[data-v-928533ab]{margin:0}small[data-v-928533ab]{color:var(--text-3)}.actions[data-v-928533ab]{display:flex;flex-wrap:wrap;gap:6px}.route-form[data-v-1c28c310]{display:flex;flex-direction:column;gap:8px;margin-top:12px}h4[data-v-1c28c310]{margin:0}label[data-v-1c28c310]{display:flex;align-items:center;gap:8px}select[data-v-1c28c310],input[type=number][data-v-1c28c310]{min-width:0;flex:1;background:var(--bg);color:var(--text);border:1px solid var(--border);padding:4px}.outage[data-v-079b94a1]{display:flex;flex-direction:column;gap:8px;padding:10px 0}label[data-v-079b94a1]{display:flex;gap:8px}input[data-v-079b94a1]{min-width:0;flex:1}.split[data-v-29716346]{display:flex;flex-direction:column;gap:8px}p[data-v-29716346],h3[data-v-29716346]{margin:0}p[data-v-29716346]{color:var(--text-3);font-size:12px}h3[data-v-29716346]{margin-top:12px;font-size:13px}label[data-v-29716346]{display:flex;align-items:center;gap:8px}input[data-v-29716346]{width:54px}[role=alert][data-v-29716346]{color:var(--danger)}.worker-tab-body[data-v-f8b83cb6]{padding:14px 16px}.worktree[data-v-158c53fa]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-158c53fa]{flex:1;min-width:0}.worktree-holder[data-v-158c53fa]{font-weight:500}.worktree-folder[data-v-158c53fa]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-158c53fa]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { openBlock as p, createBlock as _, unref as t, withCtx as s, createVNode as l, createElementVNode as a, toDisplayString as n } from "vue";
import { useWindow as f, WindowRoom as m, RowList as u } from "@journal/window-kit";
import { _ as g } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const h = { class: "main" }, T = { class: "note" }, w = {
  __name: "Todos",
  setup(x) {
    const r = { pending: "to do", in_progress: "doing", completed: "done" }, e = f();
    e.state["todos.agent"] = String(e.agent);
    const { rows: d, failure: i, loaded: c } = e.props.todos;
    return (k, y) => (p(), _(t(m), null, {
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
            a("span", T, n(r[o.state] || o.state), 1)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, B = /* @__PURE__ */ g(w, [["__scopeId", "data-v-a11fd403"]]);
export {
  B as default
};
