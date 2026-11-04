/* @code-commandments-generated */
if (!document.getElementById("window-styles-63bdc3ad283a")) { const style = document.createElement("style"); style.id = "window-styles-63bdc3ad283a"; style.textContent = ".worker-models[data-v-e982edb4]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-e982edb4]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-e982edb4]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-e982edb4]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-e982edb4]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-e982edb4]{display:flex;gap:8px;align-items:center}.number[data-v-ad3f073f]{color:var(--text-3);font-size:12px}.main[data-v-ad3f073f]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-ad3f073f]{color:var(--text-3);font-size:12px}.main[data-v-ef968966]{flex:1}.note[data-v-ef968966]{color:var(--text-3);font-size:12px}.worktree[data-v-fe754622]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-fe754622]{flex:1;min-width:0}.worktree-holder[data-v-fe754622]{font-weight:500}.worktree-folder[data-v-fe754622]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-fe754622]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { openBlock as n, createBlock as a, unref as e, withCtx as s, createVNode as l } from "vue";
import { useRows as d, WindowRoom as i, AgentRowList as p } from "@journal/window-kit";
const m = {
  __name: "WorkerDropdown",
  setup(u) {
    const { rows: o, failure: r, loaded: t } = d("agent list --role worker", ["agent.*"]);
    return (c, f) => (n(), a(e(i), { padding: "14px 16px" }, {
      default: s(() => [
        l(e(p), {
          rows: e(o),
          failure: e(r),
          loaded: e(t),
          none: "No workers have been sent from here"
        }, null, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
};
export {
  m as default
};
