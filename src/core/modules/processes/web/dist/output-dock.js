/* @code-commandments-generated */
if (!document.getElementById("window-styles-9aa446bf4cad")) { const style = document.createElement("style"); style.id = "window-styles-9aa446bf4cad"; style.textContent = ".output-body[data-v-8b8c8324]{display:flex;flex-direction:column;gap:4px;padding:2px 0 0 20px;font-size:12px}.progress[data-v-8b8c8324]{height:3px;border-radius:2px;background:var(--border, #ddd)}.bar[data-v-8b8c8324]{display:block;height:100%;border-radius:2px;background:var(--text-3)}.figure[data-v-8b8c8324]{color:var(--text-3)}.last-lines[data-v-8b8c8324]{margin:0;color:var(--text-2);line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock[data-v-ffbab2f9]{display:flex;gap:8px;font-size:12px;line-height:1.45}.output-dock-state[data-v-ffbab2f9]{color:var(--text-4)}.output-dock-line[data-v-ffbab2f9]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output[data-v-1f3ff26a]{display:flex;flex-direction:column;height:100%}.bar[data-v-1f3ff26a]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-1f3ff26a]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-1f3ff26a]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-1f3ff26a]{flex:1;margin:0;padding:0 12px 12px;overflow:auto;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-c6f8cc16]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-c6f8cc16]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-c6f8cc16],.state.lost[data-v-c6f8cc16]{color:var(--red, #d4574b)}.line[data-v-c6f8cc16]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-c6f8cc16]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { openBlock as e, createElementBlock as o, Fragment as a, createElementVNode as c, toDisplayString as s, createCommentVNode as n } from "vue";
import { _ as r } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const u = { class: "output-dock" }, l = { class: "output-dock-state" }, p = { class: "output-dock-line" }, d = {
  __name: "OutputDock",
  props: { row: { type: Object, default: null } },
  setup(t) {
    return (_, i) => (e(), o("div", u, [
      t.row ? (e(), o(a, { key: 0 }, [
        c("span", l, s(t.row.state), 1),
        c("span", p, s(t.row.line), 1)
      ], 64)) : n("", !0)
    ]));
  }
}, k = /* @__PURE__ */ r(d, [["__scopeId", "data-v-ffbab2f9"]]);
export {
  k as default
};
