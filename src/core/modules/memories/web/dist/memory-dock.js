/* @code-commandments-generated */
if (!document.getElementById("window-styles-f06400aac13c")) { const style = document.createElement("style"); style.id = "window-styles-f06400aac13c"; style.textContent = ".memories[data-v-17da7ba1],.memories-form[data-v-17da7ba1]{display:flex;flex-direction:column;gap:8px}.memories-form[data-v-17da7ba1]{align-items:flex-start}.memories-form textarea[data-v-17da7ba1]{width:100%}.memories-refusal[data-v-17da7ba1]{margin:0;color:var(--danger);font-size:12.5px}.memory[data-v-17da7ba1]{display:flex;flex:1;flex-direction:column;gap:2px;min-width:0;padding:4px 0;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.memory-kind[data-v-17da7ba1]{color:var(--text-3);font-size:12px}.memory-dock[data-v-19bd84d7]{display:flex;gap:8px;font-size:12px;line-height:1.45}.memory-dock-weight[data-v-19bd84d7]{color:var(--text-4)}.memory-round[data-v-0779e035]{margin:0 0 0 20px}.memory-round-rows[data-v-0779e035]{margin:0;padding:0;list-style:none}.memory-round-row[data-v-0779e035]{display:flex;flex-wrap:wrap;gap:2px 8px;padding:2px 0;color:var(--text-2);font-size:12px;line-height:1.45;overflow-wrap:anywhere}.memory-round-ref[data-v-0779e035]{padding:0;border:0;background:none;color:var(--accent-text);font:inherit;cursor:pointer}.memory-round-weight[data-v-0779e035]{color:var(--text-4)}\n"; document.head.appendChild(style); }
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
