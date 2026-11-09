if (!document.getElementById("window-styles-9a80c2fceec5")) { const style = document.createElement("style"); style.id = "window-styles-9a80c2fceec5"; style.textContent = ".worker-models[data-v-f2e1dbd2]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-f2e1dbd2]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-f2e1dbd2]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-f2e1dbd2]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-f2e1dbd2]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-f2e1dbd2]{display:flex;gap:8px;align-items:center}.number[data-v-d52c1a26]{color:var(--text-3);font-size:12px}.main[data-v-d52c1a26]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-d52c1a26]{color:var(--text-3);font-size:12px}.main[data-v-dca1eb21]{flex:1}.note[data-v-dca1eb21]{color:var(--text-3);font-size:12px}.worker-moment[data-v-774d56be]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-774d56be]{flex:none;color:var(--text-3);font-size:12px}.program[data-v-3ab2fdf7]{display:flex;flex-direction:column;gap:6px;padding:10px 0;border-bottom:1px solid var(--border)}.share[data-v-3ab2fdf7]{display:flex;align-items:center;gap:8px}input[data-v-3ab2fdf7]{min-width:0;flex:1}output[data-v-3ab2fdf7]{min-width:36px;text-align:right}small[data-v-3ab2fdf7]{color:var(--text-3)}p[data-v-3ab2fdf7]{margin:0}.actions[data-v-3ab2fdf7]{display:flex;gap:6px}.route[data-v-de22f389]{display:flex;flex-direction:column;gap:6px;padding:10px 0;border-bottom:1px solid var(--border)}p[data-v-de22f389]{margin:0}small[data-v-de22f389]{color:var(--text-3)}.actions[data-v-de22f389]{display:flex;flex-wrap:wrap;gap:6px}.route-form[data-v-0362f63d]{display:flex;flex-direction:column;gap:8px;margin-top:12px}h4[data-v-0362f63d]{margin:0}label[data-v-0362f63d]{display:flex;align-items:center;gap:8px}select[data-v-0362f63d],input[type=number][data-v-0362f63d]{min-width:0;flex:1;background:var(--bg);color:var(--text);border:1px solid var(--border);padding:4px}.outage[data-v-7ea51616]{display:flex;flex-direction:column;gap:8px;padding:10px 0}label[data-v-7ea51616]{display:flex;gap:8px}input[data-v-7ea51616]{min-width:0;flex:1}.split[data-v-ab331a12]{display:flex;flex-direction:column;gap:8px}p[data-v-ab331a12],h3[data-v-ab331a12]{margin:0}p[data-v-ab331a12]{color:var(--text-3);font-size:12px}h3[data-v-ab331a12]{margin-top:12px;font-size:13px}label[data-v-ab331a12]{display:flex;align-items:center;gap:8px}input[data-v-ab331a12]{width:54px}[role=alert][data-v-ab331a12]{color:var(--danger)}.worker-tab-body[data-v-8fe373bc]{padding:14px 16px}.worktree[data-v-a10f9f34]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-a10f9f34]{flex:1;min-width:0}.worktree-holder[data-v-a10f9f34]{font-weight:500}.worktree-folder[data-v-a10f9f34]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-a10f9f34]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { openBlock as p, createBlock as _, unref as t, withCtx as s, createVNode as l, createElementVNode as a, toDisplayString as n } from "vue";
import { useWindow as m, WindowRoom as f, RowList as u } from "@journal/window-kit";
import { _ as g } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const h = { class: "main" }, T = { class: "note" }, w = {
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
            a("span", T, n(r[o.state] || o.state), 1)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, v = /* @__PURE__ */ g(w, [["__scopeId", "data-v-dca1eb21"]]);
export {
  v as default
};
