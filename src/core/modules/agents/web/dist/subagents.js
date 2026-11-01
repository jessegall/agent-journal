/* @code-commandments-generated */
if (!document.getElementById("window-styles-776b33fc6e3c")) { const style = document.createElement("style"); style.id = "window-styles-776b33fc6e3c"; style.textContent = ".id[data-v-82d859bc]{flex:none;width:44px;color:var(--text-3);font-size:12px}.state[data-v-82d859bc]{flex:none;color:var(--text-3);font-size:12px}.state.running[data-v-82d859bc]{color:var(--accent-text)}.main[data-v-82d859bc]{flex:1}.note[data-v-82d859bc]{color:var(--text-3);font-size:12px}.author[data-v-f34e0cbb]{color:var(--text-3);font-size:12px;min-width:72px}.text[data-v-f34e0cbb]{flex:1;white-space:pre-wrap}\n"; document.head.appendChild(style); }
import { h as e } from "vue";
import { useWindow as o } from "@journal/window-kit";
import { A as s } from "./AgentRows-QZyoFC-N.js";
const m = {
  setup() {
    const t = `agent list --parent ${o().agent}`;
    return () => e(s, { line: t, empty: "No subagents yet" });
  }
};
export {
  m as default
};
