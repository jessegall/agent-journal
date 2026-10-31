/* @code-commandments-generated */
if (!document.getElementById("window-styles-c01ae8337e0c")) { const style = document.createElement("style"); style.id = "window-styles-c01ae8337e0c"; style.textContent = ".main[data-v-88fb5cd3]{flex:1}.note[data-v-88fb5cd3]{color:var(--text-3);font-size:12px}.author[data-v-e23d94c7]{color:var(--text-3);font-size:12px;min-width:72px}.text[data-v-e23d94c7]{flex:1;white-space:pre-wrap}\n"; document.head.appendChild(style); }
import { h as e } from "vue";
import { useWindow as o } from "@journal/window-kit";
import { A as s } from "./AgentRows-C-L7c4Sa.js";
const m = {
  setup() {
    const t = `agent list --parent ${o().agent}`;
    return () => e(s, { line: t, empty: "No subagents yet" });
  }
};
export {
  m as default
};
