/* @code-commandments-generated */
if (!document.getElementById("window-styles-489a7ff88e8e")) { const style = document.createElement("style"); style.id = "window-styles-489a7ff88e8e"; style.textContent = ".rule-dock[data-v-5c184a03]{margin:3px 0 6px;border-block:1px solid var(--border-inner);padding:7px 14px 8px 36px;color:var(--text);font-size:13px;line-height:1.5}.rules-page[data-v-b0c15947]{display:flex;flex-direction:column;gap:8px}.rules-refusal[data-v-b0c15947]{margin:0;color:var(--danger);font-size:12.5px}.rule[data-v-b0c15947]{display:flex;flex:1;flex-wrap:wrap;gap:8px;align-items:center;min-width:0;padding:4px 0}.rule-text[data-v-b0c15947]{flex:1 1 240px;min-width:0}.rule-state[data-v-b0c15947]{color:var(--warn);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as t, createElementBlock as c, toDisplayString as r, unref as s } from "vue";
import { useDockRow as _ } from "@journal/window-kit";
import { _ as a } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const l = {
  class: "rule-dock",
  "data-rule-dock": ""
}, n = {
  __name: "RuleDock",
  setup(p) {
    const e = _("rule");
    return (u, m) => {
      var o;
      return t(), c("p", l, r((o = s(e)) == null ? void 0 : o.text), 1);
    };
  }
}, k = /* @__PURE__ */ a(n, [["__scopeId", "data-v-5c184a03"]]);
export {
  k as default
};
