/* @code-commandments-generated */
if (!document.getElementById("window-styles-4744398a2fa7")) { const style = document.createElement("style"); style.id = "window-styles-4744398a2fa7"; style.textContent = ".worker-models[data-v-0f463709]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-0f463709]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-0f463709]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-0f463709]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-0f463709]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-0f463709]{display:flex;gap:8px;align-items:center}.number[data-v-003ae4c2]{color:var(--text-3);font-size:12px}.main[data-v-003ae4c2]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-003ae4c2]{color:var(--text-3);font-size:12px}.main[data-v-d17dfe5e]{flex:1}.note[data-v-d17dfe5e]{color:var(--text-3);font-size:12px}.worktree[data-v-ae7a1c5d]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-ae7a1c5d]{flex:1;min-width:0}.worktree-holder[data-v-ae7a1c5d]{font-weight:500}.worktree-folder[data-v-ae7a1c5d]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-ae7a1c5d]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { openBlock as t, createBlock as a, unref as e } from "vue";
import { useRows as s, AgentDropdownRows as l } from "@journal/window-kit";
const w = {
  __name: "WorkerDropdown",
  setup(u) {
    const { rows: o, failure: r, loaded: n } = s("agent list --role worker", ["agent.*"]);
    return (c, d) => (t(), a(e(l), {
      rows: e(o),
      failure: e(r),
      loaded: e(n),
      none: "No workers have been sent from here"
    }, null, 8, ["rows", "failure", "loaded"]));
  }
};
export {
  w as default
};
