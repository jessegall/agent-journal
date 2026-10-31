/* @code-commandments-generated */
if (!document.getElementById("window-styles-2a541f302061")) { const style = document.createElement("style"); style.id = "window-styles-2a541f302061"; style.textContent = ".dump-dock[data-v-4cfda69f]{display:flex;gap:8px;font-size:12px;line-height:1.45}.dump-dock-title[data-v-4cfda69f]{color:var(--text-4)}.dump[data-v-74113cb7]{padding:6px 0}.dump-title[data-v-74113cb7]{margin:0;font-size:13px}.dump-brief[data-v-74113cb7]{margin:2px 0 0;font-size:12px;color:var(--text-4)}\n"; document.head.appendChild(style); }
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
