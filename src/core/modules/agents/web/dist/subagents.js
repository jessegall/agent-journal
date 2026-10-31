/* @code-commandments-generated */
if (!document.getElementById("window-styles-adb20365fb28")) { const style = document.createElement("style"); style.id = "window-styles-adb20365fb28"; style.textContent = ".main[data-v-88fb5cd3]{flex:1}.note[data-v-88fb5cd3]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { h as e } from "vue";
import { useWindow as o } from "@journal/window-kit";
import { A as s } from "./AgentRows-C-XNbSoA.js";
const m = {
  setup() {
    const t = `agent list --parent ${o().agent}`;
    return () => e(s, { line: t, empty: "No subagents yet" });
  }
};
export {
  m as default
};
