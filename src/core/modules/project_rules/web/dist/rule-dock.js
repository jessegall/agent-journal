/* @code-commandments-generated */
if (!document.getElementById("window-styles-08a81a09699c")) { const style = document.createElement("style"); style.id = "window-styles-08a81a09699c"; style.textContent = ".rule-dock[data-v-fd4407f5]{margin:0;padding:8px 10px;border:1px solid var(--warn);border-radius:8px;background:color-mix(in srgb,var(--warn) 12%,transparent);color:var(--text);font-size:13px;line-height:1.5}.rules-page[data-v-4868a35b]{display:flex;flex-direction:column;gap:8px}.rules-refusal[data-v-4868a35b]{margin:0;color:var(--danger);font-size:12.5px}.rule[data-v-4868a35b]{display:flex;flex:1;flex-wrap:wrap;gap:8px;align-items:center;min-width:0;padding:4px 0}.rule-text[data-v-4868a35b]{flex:1 1 240px;min-width:0}.rule-state[data-v-4868a35b]{color:var(--warn);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as t, createElementBlock as r, toDisplayString as c, unref as s } from "vue";
import { useDockRow as _ } from "@journal/window-kit";
import { _ as a } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const l = {
  class: "rule-dock",
  "data-rule-dock": ""
}, n = {
  __name: "RuleDock",
  setup(p) {
    const e = _("rule");
    return (u, f) => {
      var o;
      return t(), r("p", l, c((o = s(e)) == null ? void 0 : o.text), 1);
    };
  }
}, k = /* @__PURE__ */ a(n, [["__scopeId", "data-v-fd4407f5"]]);
export {
  k as default
};
