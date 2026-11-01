/* @code-commandments-generated */
if (!document.getElementById("window-styles-a18b00034dc5")) { const style = document.createElement("style"); style.id = "window-styles-a18b00034dc5"; style.textContent = ".task-dock[data-v-3ff12b87]{display:flex;gap:8px;font-size:12px;line-height:1.45}.task-dock-state[data-v-3ff12b87]{color:var(--text-4)}.tasks-more[data-v-bd2ce6f9]{margin:4px 0 0 8px;padding:2px 8px;border:0;border-radius:5px;background:none;color:var(--text-3);font:inherit;font-size:12px;cursor:pointer}.tasks-more[data-v-bd2ce6f9]:hover{background:var(--hover);color:var(--text)}.tasks[data-v-bd2ce6f9]{display:flex;flex-direction:column;gap:14px}.tasks-search[data-v-bd2ce6f9]{max-width:320px;padding:6px 12px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text)}.tasks-group-head[data-v-bd2ce6f9]{margin:0 0 4px;color:var(--text-3);font-size:11px;font-weight:500;letter-spacing:.04em;text-transform:uppercase}.tasks-count[data-v-bd2ce6f9]{margin-left:4px}.task[data-v-bd2ce6f9]{cursor:pointer;display:flex;gap:10px;align-items:center;padding:6px 8px;border-radius:6px}.task[data-v-bd2ce6f9]:hover{background:var(--hover)}.task-mark[data-v-bd2ce6f9]{flex:none;width:12px;height:12px;border:1.5px solid var(--text-4);border-radius:50%}.task-mark.started[data-v-bd2ce6f9],.task-mark.testing[data-v-bd2ce6f9]{border-color:var(--accent);background:linear-gradient(90deg,var(--accent) 50%,transparent 50%)}.task-mark.blocked[data-v-bd2ce6f9]{border-color:var(--tone-warn)}.task-mark.completed[data-v-bd2ce6f9]{border-color:var(--accent);background:var(--accent)}.task-mark.cancelled[data-v-bd2ce6f9]{opacity:.4}.task-id[data-v-bd2ce6f9]{flex:none;width:40px;color:var(--text-3);font-size:12px}.task-title[data-v-bd2ce6f9]{flex:1;min-width:0}.task-priority[data-v-bd2ce6f9],.tasks-note[data-v-bd2ce6f9]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as e, createElementBlock as o, Fragment as c, createElementVNode as s, toDisplayString as a, createCommentVNode as r } from "vue";
import { _ as n } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const l = { class: "task-dock" }, d = { class: "task-dock-state" }, k = { class: "task-dock-title" }, _ = {
  __name: "TaskDock",
  props: { row: { type: Object, default: null } },
  setup(t) {
    return (i, m) => (e(), o("div", l, [
      t.row ? (e(), o(c, { key: 0 }, [
        s("span", d, a(t.row.state), 1),
        s("span", k, a(t.row.title), 1)
      ], 64)) : r("", !0)
    ]));
  }
}, u = /* @__PURE__ */ n(_, [["__scopeId", "data-v-3ff12b87"]]);
export {
  u as default
};
