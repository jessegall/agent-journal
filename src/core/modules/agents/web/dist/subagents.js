/* @code-commandments-generated */
if (!document.getElementById("window-styles-3e4986246ea2")) { const style = document.createElement("style"); style.id = "window-styles-3e4986246ea2"; style.textContent = ".id[data-v-91909350]{flex:none;width:44px;color:var(--text-3);font-size:12px}.state[data-v-91909350]{flex:none;color:var(--text-3);font-size:12px}.state.running[data-v-91909350]{color:var(--accent-text)}.main[data-v-91909350]{flex:1}.note[data-v-91909350]{color:var(--text-3);font-size:12px}.author[data-v-f34e0cbb]{color:var(--text-3);font-size:12px;min-width:72px}.text[data-v-f34e0cbb]{flex:1;white-space:pre-wrap}\n"; document.head.appendChild(style); }
import { h as e } from "vue";
import { useWindow as o } from "@journal/window-kit";
import { A as s } from "./AgentRows-Bp-H_7Qv.js";
const m = {
  setup() {
    const t = `agent list --parent ${o().agent}`;
    return () => e(s, { line: t, empty: "No subagents yet" });
  }
};
export {
  m as default
};
