/* @code-commandments-generated */
if (!document.getElementById("window-styles-7d9e8199ad5f")) { const style = document.createElement("style"); style.id = "window-styles-7d9e8199ad5f"; style.textContent = ".open-questions-icon[data-v-bb9f2ba6]{flex:none;color:var(--text-3)}.open-questions-text[data-v-bb9f2ba6]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.open-questions-space[data-v-bb9f2ba6]{flex:1}.question[data-v-38203f52]{display:flex;flex:1;flex-direction:column;gap:8px;width:100%;max-width:640px;margin-bottom:10px;padding:14px 16px 16px;border:1px solid var(--border-2);border-radius:12px;background:var(--raised);overflow-wrap:anywhere}.question-head[data-v-38203f52]{display:flex;align-items:baseline;justify-content:space-between;gap:12px}.question-time[data-v-38203f52]{flex:none;color:var(--text-3);font-size:11.5px}.question-label[data-v-38203f52]{margin:0;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.question-open[data-v-38203f52]{padding:0;border:0;background:none;color:var(--text);font:inherit;font-size:14.5px;font-weight:600;line-height:1.4;text-align:left;cursor:pointer}.question-options[data-v-38203f52]{display:flex;flex-direction:column;gap:6px}.question-option[data-v-38203f52]{display:flex;flex-direction:column;overflow:hidden;padding:9px 12px;border:1px solid var(--border-2);border-radius:8px;background:var(--bg);color:var(--text);font:inherit;font-size:13px;text-align:left;cursor:pointer;transition:transform .12s ease,border-color .2s ease}.question-option[data-v-38203f52]:hover{border-color:var(--accent)}.question-option[data-v-38203f52]:active{transform:scale(.98)}.question-option.recommended[data-v-38203f52]{border-color:color-mix(in srgb,var(--accent) 40%,var(--border-2))}.question-tag[data-v-38203f52]{margin:-9px -12px 8px;padding:4px 12px;background:color-mix(in srgb,var(--accent) 16%,transparent);color:var(--accent-text);font-size:11px}.question-closed[data-v-38203f52]{margin:0;color:var(--text-3);font-size:12.5px}.question-failure[data-v-38203f52]{margin:0;color:var(--danger);font-size:12.5px}.question-dock[data-v-3f6f88a1]{display:flex;gap:8px;font-size:12px;line-height:1.45}.question-dock-state[data-v-3f6f88a1]{color:var(--text-4)}.waiting-heading[data-v-3304b1f9]{margin:0 8px 6px;font-size:12px;font-weight:600;color:var(--text-2)}.label[data-v-3304b1f9]{flex:1}.detail[data-v-3304b1f9]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as e, createElementBlock as o, Fragment as n, createElementVNode as s, toDisplayString as c, createCommentVNode as a } from "vue";
import { _ as r } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const i = { class: "question-dock" }, d = { class: "question-dock-state" }, _ = { class: "question-dock-text" }, l = {
  __name: "QuestionDock",
  props: { row: { type: Object, default: null } },
  setup(t) {
    return (u, m) => (e(), o("div", i, [
      t.row ? (e(), o(n, { key: 0 }, [
        s("span", d, c(t.row.state), 1),
        s("span", _, c(t.row.text), 1)
      ], 64)) : a("", !0)
    ]));
  }
}, k = /* @__PURE__ */ r(l, [["__scopeId", "data-v-3f6f88a1"]]);
export {
  k as default
};
