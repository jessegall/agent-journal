/* @code-commandments-generated */
if (!document.getElementById("window-styles-5bf4e31fb708")) { const style = document.createElement("style"); style.id = "window-styles-5bf4e31fb708"; style.textContent = ".plan-dock[data-v-28bdeeb8]{display:flex;gap:8px;font-size:12px;line-height:1.45}.plan-dock-state[data-v-28bdeeb8]{color:var(--text-4)}.plans[data-v-ac50e683]{display:flex;flex-direction:column;gap:14px}.plans-tabs[data-v-ac50e683]{display:flex;gap:14px}.plans-tab[data-v-ac50e683]{padding:0 0 4px;border:0;border-bottom:1px solid transparent;background:none;color:var(--text-3);font:inherit;font-size:11px;letter-spacing:.04em;text-transform:uppercase;cursor:pointer}.plans-tab.on[data-v-ac50e683]{border-bottom-color:var(--accent);color:var(--text)}.plans-grid[data-v-ac50e683]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}.plan[data-v-ac50e683]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plan-head[data-v-ac50e683]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-ac50e683]{margin-left:auto}.plan-title[data-v-ac50e683]{font-weight:500}.plan-bar[data-v-ac50e683]{height:4px;border-radius:2px;background:var(--raised)}.plan-bar-fill[data-v-ac50e683]{display:block;height:100%;border-radius:2px;background:var(--accent)}.plan-foot[data-v-ac50e683],.plans-note[data-v-ac50e683]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as e, createElementBlock as o, Fragment as s, createElementVNode as a, toDisplayString as c, createCommentVNode as n } from "vue";
import { _ as l } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const r = { class: "plan-dock" }, d = { class: "plan-dock-state" }, _ = { class: "plan-dock-title" }, p = {
  __name: "PlanDock",
  props: { row: { type: Object, default: null } },
  setup(t) {
    return (i, m) => (e(), o("div", r, [
      t.row ? (e(), o(s, { key: 0 }, [
        a("span", d, c(t.row.state), 1),
        a("span", _, c(t.row.title), 1)
      ], 64)) : n("", !0)
    ]));
  }
}, f = /* @__PURE__ */ l(p, [["__scopeId", "data-v-28bdeeb8"]]);
export {
  f as default
};
