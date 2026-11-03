/* @code-commandments-generated */
if (!document.getElementById("window-styles-338dfe0be23e")) { const style = document.createElement("style"); style.id = "window-styles-338dfe0be23e"; style.textContent = ".dump-dock[data-v-4cfda69f]{display:flex;gap:8px;font-size:12px;line-height:1.45}.dump-dock-title[data-v-4cfda69f]{color:var(--text-4)}.dumps[data-v-405e9534]{display:flex;flex-direction:column;gap:12px}.dump[data-v-405e9534]{display:flex;flex-direction:column;gap:6px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.dump-title[data-v-405e9534]{margin:0;font-size:13px;font-weight:500}.dumps-more[data-v-405e9534]{align-self:flex-start;color:var(--text-3);background:none;border:0;cursor:pointer}.dump-brief[data-v-405e9534],.dumps-note[data-v-405e9534]{margin:0;color:var(--text-3);font-size:12px}.item[data-v-405e9534]{display:grid;grid-template-columns:64px 1fr;gap:2px 10px;padding:6px 0;border-top:1px solid var(--border)}.item-state[data-v-405e9534]{grid-row:span 3;align-self:start;color:var(--text-3);font-size:12px}.item-state.filed[data-v-405e9534]{color:var(--accent-text)}.item-state.failed[data-v-405e9534]{color:var(--danger)}.item-note[data-v-405e9534],.item-refs[data-v-405e9534]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
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
