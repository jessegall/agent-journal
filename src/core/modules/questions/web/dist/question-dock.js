/* @code-commandments-generated */
if (!document.getElementById("window-styles-96b3ae017678")) { const style = document.createElement("style"); style.id = "window-styles-96b3ae017678"; style.textContent = ".question-dock[data-v-db3daefc]{display:flex;gap:8px;font-size:12px;line-height:1.45}.question-dock-state[data-v-db3daefc]{color:var(--text-4)}.question[data-v-0245b88d]{display:flex;flex:1;flex-direction:column;gap:6px}.question-text[data-v-0245b88d]{margin:0}.question-choices[data-v-0245b88d],.question-form[data-v-0245b88d]{display:flex;flex-wrap:wrap;gap:6px}.question-answer[data-v-0245b88d]{flex:1;min-width:120px}.question-choice.recommended[data-v-0245b88d]{font-weight:600}.question-failure[data-v-0245b88d]{margin:6px 8px 0;color:var(--text-2)}.question-closed[data-v-0245b88d]{margin:2px 0 0;color:var(--text-3);font-size:12px}.waiting-heading[data-v-58949891]{margin:0 8px 6px;font-size:12px;font-weight:600;color:var(--text-2)}.label[data-v-58949891]{flex:1}.detail[data-v-58949891]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as e, createElementBlock as o, Fragment as n, createElementVNode as s, toDisplayString as c, createCommentVNode as a } from "vue";
import { _ as r } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const d = { class: "question-dock" }, i = { class: "question-dock-state" }, _ = { class: "question-dock-text" }, l = {
  __name: "QuestionDock",
  props: { row: { type: Object, default: null } },
  setup(t) {
    return (u, m) => (e(), o("div", d, [
      t.row ? (e(), o(n, { key: 0 }, [
        s("span", i, c(t.row.state), 1),
        s("span", _, c(t.row.text), 1)
      ], 64)) : a("", !0)
    ]));
  }
}, f = /* @__PURE__ */ r(l, [["__scopeId", "data-v-db3daefc"]]);
export {
  f as default
};
