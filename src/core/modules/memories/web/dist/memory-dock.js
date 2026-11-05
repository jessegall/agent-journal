/* @code-commandments-generated */
if (!document.getElementById("window-styles-29dbd7e7f1ff")) { const style = document.createElement("style"); style.id = "window-styles-29dbd7e7f1ff"; style.textContent = ".memories[data-v-47bce12f],.memories-form[data-v-47bce12f]{display:flex;flex-direction:column;gap:8px}.memories-form[data-v-47bce12f]{align-items:flex-start}.memories-form textarea[data-v-47bce12f]{width:100%}.memories-refusal[data-v-47bce12f]{margin:0;color:var(--danger);font-size:12.5px}.memory[data-v-47bce12f]{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0;padding:4px 0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.memory-kind[data-v-47bce12f]{color:var(--text-3);font-size:12px}.memories-page[data-v-3ebd406a]{display:flex;flex-direction:column;gap:8px;align-items:flex-start}.memories-page[data-v-3ebd406a]>.memories{align-self:stretch}.memory-dock[data-v-efaf5416]{display:flex;gap:8px;font-size:12px;line-height:1.45}.memory-dock-weight[data-v-efaf5416]{color:var(--text-4)}.memory-round[data-v-03fe1c3a]{margin:0 0 0 20px}.memory-round-rows[data-v-03fe1c3a]{margin:0;padding:0;list-style:none}.memory-round-row[data-v-03fe1c3a]{display:flex;flex-wrap:wrap;gap:2px 8px;padding:2px 0;color:var(--text-2);font-size:12px;line-height:1.45;overflow-wrap:anywhere}.memory-round-ref[data-v-03fe1c3a]{padding:0;border:0;background:none;color:var(--accent-text);font:inherit;cursor:pointer}.memory-round-weight[data-v-03fe1c3a]{color:var(--text-4)}\n"; document.head.appendChild(style); }
import { openBlock as t, createElementBlock as r, unref as o, Fragment as m, createElementVNode as c, toDisplayString as s, createCommentVNode as a } from "vue";
import { useDockRow as n } from "@journal/window-kit";
import { _ } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const i = { class: "memory-dock" }, p = { class: "memory-dock-weight" }, d = { class: "memory-dock-text" }, f = {
  __name: "MemoryDock",
  setup(k) {
    const e = n("memory");
    return (l, y) => (t(), r("div", i, [
      o(e) ? (t(), r(m, { key: 0 }, [
        c("span", p, "weight " + s(o(e).weight), 1),
        c("span", d, s(o(e).text), 1)
      ], 64)) : a("", !0)
    ]));
  }
}, w = /* @__PURE__ */ _(f, [["__scopeId", "data-v-efaf5416"]]);
export {
  w as default
};
