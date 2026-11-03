/* @code-commandments-generated */
if (!document.getElementById("window-styles-dc07c7617deb")) { const style = document.createElement("style"); style.id = "window-styles-dc07c7617deb"; style.textContent = ".worker-models[data-v-310982ed]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-310982ed]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-310982ed]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-310982ed]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-310982ed]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-310982ed]{display:flex;gap:8px;align-items:center}.number[data-v-d5811db8]{color:var(--text-3);font-size:12px}.main[data-v-d5811db8]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-d5811db8]{color:var(--text-3);font-size:12px}.main[data-v-35658be4]{flex:1}.note[data-v-35658be4]{color:var(--text-3);font-size:12px}.worktree[data-v-28015355]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-28015355]{flex:1;min-width:0}.worktree-holder[data-v-28015355]{font-weight:500}.worktree-folder[data-v-28015355]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-28015355]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { openBlock as t, createBlock as a, unref as e } from "vue";
import { useRows as s, AgentRowList as l } from "@journal/window-kit";
const p = {
  __name: "WorkerDropdown",
  setup(u) {
    const { rows: o, failure: r, loaded: n } = s("agent list --role worker", ["agent.*"]);
    return (c, f) => (t(), a(e(l), {
      rows: e(o),
      failure: e(r),
      loaded: e(n),
      none: "No workers have been sent from here"
    }, null, 8, ["rows", "failure", "loaded"]));
  }
};
export {
  p as default
};
