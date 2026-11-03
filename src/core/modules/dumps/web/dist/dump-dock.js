/* @code-commandments-generated */
if (!document.getElementById("window-styles-36f28f63b062")) { const style = document.createElement("style"); style.id = "window-styles-36f28f63b062"; style.textContent = ".dump-dock[data-v-4cfda69f]{display:flex;gap:8px;font-size:12px;line-height:1.45}.dump-dock-title[data-v-4cfda69f]{color:var(--text-4)}.dumps[data-v-2c10eb80]{display:flex;flex-direction:column;gap:12px}.dump[data-v-2c10eb80]{display:flex;flex-direction:column;gap:6px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.dump-earlier[data-v-2c10eb80]{flex-direction:row;align-items:center;justify-content:space-between;color:inherit;text-align:left;cursor:pointer}.dump-head[data-v-2c10eb80]{display:flex;align-items:center;gap:10px}.dump-title[data-v-2c10eb80]{margin:0;font-size:13px;font-weight:500}.dump-name[data-v-2c10eb80]{flex:1;font-size:13px}.dump-pill[data-v-2c10eb80]{padding:1px 8px;border-radius:10px;color:var(--text-3);font-size:11px;border:1px solid var(--border)}.dump-pill[data-phase=Filed][data-v-2c10eb80]{color:var(--accent-text)}.dump-rename[data-v-2c10eb80],.dumps-more[data-v-2c10eb80]{color:var(--text-3);background:none;border:0;cursor:pointer}.dump-rename[data-v-2c10eb80]{margin-left:auto;font-size:12px}.dumps-more[data-v-2c10eb80]{align-self:flex-start}.dump-brief[data-v-2c10eb80],.dumps-note[data-v-2c10eb80]{margin:0;color:var(--text-3);font-size:12px}.dump-progress[data-v-2c10eb80]{display:flex;align-items:center;gap:10px;color:var(--text-3);font-size:12px}.dump-bar[data-v-2c10eb80]{flex:1;height:4px;border-radius:2px;background:var(--border)}.dump-fill[data-v-2c10eb80]{display:block;height:100%;border-radius:2px;background:var(--accent-text)}.item[data-v-2c10eb80]{display:grid;grid-template-columns:64px 1fr;gap:2px 10px;padding:6px 0;border-top:1px solid var(--border)}.item-state[data-v-2c10eb80]{grid-row:span 3;align-self:start;color:var(--text-3);font-size:12px}.item-state.filed[data-v-2c10eb80]{color:var(--accent-text)}.item-state.failed[data-v-2c10eb80]{color:var(--danger)}.item-note[data-v-2c10eb80],.item-refs[data-v-2c10eb80]{color:var(--text-3);font-size:12px}.made-title[data-v-2c10eb80]{margin:8px 0 0;font-size:12px;font-weight:500}.made[data-v-2c10eb80]{display:flex;gap:10px;font-size:12px}.made-kind[data-v-2c10eb80]{color:var(--accent-text)}.made-from[data-v-2c10eb80]{color:var(--text-3)}\n"; document.head.appendChild(style); }
import { openBlock as t, createElementBlock as o, Fragment as a, createElementVNode as c, toDisplayString as r, createCommentVNode as s } from "vue";
import { _ as d } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const m = { class: "dump-dock" }, n = { class: "dump-dock-title" }, i = { class: "dump-dock-brief" }, l = {
  __name: "DumpDock",
  props: { row: { type: Object, default: null } },
  setup(e) {
    return (u, p) => (t(), o("div", m, [
      e.row ? (t(), o(a, { key: 0 }, [
        c("span", n, r(e.row.title || `Dump ${e.row.id}`), 1),
        c("span", i, r(e.row.outcome || e.row.brief), 1)
      ], 64)) : s("", !0)
    ]));
  }
}, k = /* @__PURE__ */ d(l, [["__scopeId", "data-v-4cfda69f"]]);
export {
  k as default
};
