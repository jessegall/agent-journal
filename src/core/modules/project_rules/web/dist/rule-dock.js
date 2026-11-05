/* @code-commandments-generated */
if (!document.getElementById("window-styles-62d557693f23")) { const style = document.createElement("style"); style.id = "window-styles-62d557693f23"; style.textContent = ".rule-dock[data-v-b89aea04]{margin:0;padding:8px 10px;border:1px solid var(--warn);border-radius:8px;background:color-mix(in srgb,var(--warn) 12%,transparent);color:var(--text);font-size:13px;line-height:1.5}.rules-page[data-v-4868a35b]{display:flex;flex-direction:column;gap:8px}.rules-refusal[data-v-4868a35b]{margin:0;color:var(--danger);font-size:12.5px}.rule[data-v-4868a35b]{display:flex;flex:1;flex-wrap:wrap;gap:8px;align-items:center;min-width:0;padding:4px 0}.rule-text[data-v-4868a35b]{flex:1 1 240px;min-width:0}.rule-state[data-v-4868a35b]{color:var(--warn);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as n, watch as l, openBlock as s, createElementBlock as u, toDisplayString as _ } from "vue";
import { useWindow as i } from "@journal/window-kit";
import { _ as d } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const p = {
  class: "rule-dock",
  "data-rule-dock": ""
}, m = {
  __name: "RuleDock",
  setup(f) {
    const t = i(), o = t.option("row"), a = n(null);
    async function c() {
      const e = await t.read(`rule show ${o.value.target_id}`);
      a.value = e.ok ? e.value : null;
    }
    return l(() => {
      var e;
      return (e = o.value) == null ? void 0 : e.target_id;
    }, c, { immediate: !0 }), (e, k) => {
      var r;
      return s(), u("p", p, _((r = a.value) == null ? void 0 : r.text), 1);
    };
  }
}, h = /* @__PURE__ */ d(m, [["__scopeId", "data-v-b89aea04"]]);
export {
  h as default
};
