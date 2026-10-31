/* @code-commandments-generated */
if (!document.getElementById("window-styles-5d5ca77f50c4")) { const style = document.createElement("style"); style.id = "window-styles-5d5ca77f50c4"; style.textContent = ".question-dock[data-v-3f6f88a1]{display:flex;gap:8px;font-size:12px;line-height:1.45}.question-dock-state[data-v-3f6f88a1]{color:var(--text-4)}.question[data-v-ef7ac5e5]{display:flex;flex:1;flex-direction:column;gap:6px}.question-text[data-v-ef7ac5e5]{margin:0}.question-choices[data-v-ef7ac5e5],.question-form[data-v-ef7ac5e5]{display:flex;flex-wrap:wrap;gap:6px}.question-answer[data-v-ef7ac5e5]{flex:1;min-width:120px}.question-choice.recommended[data-v-ef7ac5e5]{font-weight:600}.question-failure[data-v-ef7ac5e5]{margin:6px 8px 0;color:var(--text-2)}.waiting-heading[data-v-51430256]{margin:0 8px 6px;font-size:12px;font-weight:600;color:var(--text-2)}.label[data-v-51430256]{flex:1}.detail[data-v-51430256]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
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
