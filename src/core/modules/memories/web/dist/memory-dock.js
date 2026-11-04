/* @code-commandments-generated */
if (!document.getElementById("window-styles-5568e4247e0a")) { const style = document.createElement("style"); style.id = "window-styles-5568e4247e0a"; style.textContent = ".memories[data-v-ba051f84],.memories-form[data-v-ba051f84]{display:flex;flex-direction:column;gap:8px}.memories-form[data-v-ba051f84]{align-items:flex-start}.memories-form textarea[data-v-ba051f84]{width:100%}.memories-refusal[data-v-ba051f84]{margin:0;color:var(--danger);font-size:12.5px}.memory[data-v-ba051f84]{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0;padding:4px 0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.memory-kind[data-v-ba051f84]{color:var(--text-3);font-size:12px}.memories-page[data-v-76fcf470]{display:flex;flex-direction:column;gap:8px;align-items:flex-start}.memories-page[data-v-76fcf470]>.memories{align-self:stretch}.memory-dock[data-v-19bd84d7]{display:flex;gap:8px;font-size:12px;line-height:1.45}.memory-dock-weight[data-v-19bd84d7]{color:var(--text-4)}.memory-round[data-v-03fe1c3a]{margin:0 0 0 20px}.memory-round-rows[data-v-03fe1c3a]{margin:0;padding:0;list-style:none}.memory-round-row[data-v-03fe1c3a]{display:flex;flex-wrap:wrap;gap:2px 8px;padding:2px 0;color:var(--text-2);font-size:12px;line-height:1.45;overflow-wrap:anywhere}.memory-round-ref[data-v-03fe1c3a]{padding:0;border:0;background:none;color:var(--accent-text);font:inherit;cursor:pointer}.memory-round-weight[data-v-03fe1c3a]{color:var(--text-4)}\n"; document.head.appendChild(style); }
import { openBlock as t, createElementBlock as o, Fragment as s, createElementVNode as c, toDisplayString as r, createCommentVNode as a } from "vue";
import { _ as m } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const n = { class: "memory-dock" }, d = { class: "memory-dock-weight" }, _ = { class: "memory-dock-text" }, i = {
  __name: "MemoryDock",
  props: { row: { type: Object, default: null } },
  setup(e) {
    return (l, p) => (t(), o("div", n, [
      e.row ? (t(), o(s, { key: 0 }, [
        c("span", d, "weight " + r(e.row.weight), 1),
        c("span", _, r(e.row.text), 1)
      ], 64)) : a("", !0)
    ]));
  }
}, h = /* @__PURE__ */ m(i, [["__scopeId", "data-v-19bd84d7"]]);
export {
  h as default
};
