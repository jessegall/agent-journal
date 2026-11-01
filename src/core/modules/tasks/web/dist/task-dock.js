/* @code-commandments-generated */
if (!document.getElementById("window-styles-ae56af14fa38")) { const style = document.createElement("style"); style.id = "window-styles-ae56af14fa38"; style.textContent = ".task-dock[data-v-3ff12b87]{display:flex;gap:8px;font-size:12px;line-height:1.45}.task-dock-state[data-v-3ff12b87]{color:var(--text-4)}.tasks[data-v-fc66d718]{display:flex;flex-direction:column;gap:14px}.tasks-search[data-v-fc66d718]{max-width:320px;padding:6px 12px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text)}.tasks-group-head[data-v-fc66d718]{margin:0 0 4px;color:var(--text-3);font-size:11px;font-weight:500;letter-spacing:.04em;text-transform:uppercase}.tasks-count[data-v-fc66d718]{margin-left:4px}.task[data-v-fc66d718]{cursor:pointer;display:flex;gap:10px;align-items:center;padding:6px 8px;border-radius:6px}.task[data-v-fc66d718]:hover{background:var(--hover)}.task-mark[data-v-fc66d718]{flex:none;width:12px;height:12px;border:1.5px solid var(--text-4);border-radius:50%}.task-mark.started[data-v-fc66d718],.task-mark.testing[data-v-fc66d718]{border-color:var(--accent);background:linear-gradient(90deg,var(--accent) 50%,transparent 50%)}.task-mark.blocked[data-v-fc66d718]{border-color:var(--danger)}.task-mark.completed[data-v-fc66d718]{border-color:var(--accent);background:var(--accent)}.task-mark.cancelled[data-v-fc66d718]{opacity:.4}.task-id[data-v-fc66d718]{flex:none;width:40px;color:var(--text-3);font-size:12px}.task-title[data-v-fc66d718]{flex:1;min-width:0}.task-priority[data-v-fc66d718],.tasks-note[data-v-fc66d718]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
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
