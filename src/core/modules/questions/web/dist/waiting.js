/* @code-commandments-generated */
if (!document.getElementById("window-styles-cbbb49e7b688")) { const style = document.createElement("style"); style.id = "window-styles-cbbb49e7b688"; style.textContent = ".question-dock[data-v-3f6f88a1]{display:flex;gap:8px;font-size:12px;line-height:1.45}.question-dock-state[data-v-3f6f88a1]{color:var(--text-4)}.question[data-v-9236b95c]{display:flex;flex:1;flex-direction:column;gap:6px}.question-text[data-v-9236b95c]{margin:0}.question-choices[data-v-9236b95c],.question-form[data-v-9236b95c]{display:flex;flex-wrap:wrap;gap:6px}.question-answer[data-v-9236b95c]{flex:1;min-width:120px}.question-choice.recommended[data-v-9236b95c]{font-weight:600}.question-failure[data-v-9236b95c]{margin:6px 8px 0;color:var(--text-2)}.question-closed[data-v-9236b95c]{margin:2px 0 0;color:var(--text-3);font-size:12px}.waiting-heading[data-v-2998b0fd]{margin:0 8px 6px;font-size:12px;font-weight:600;color:var(--text-2)}.label[data-v-2998b0fd]{flex:1}.detail[data-v-2998b0fd]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as w, openBlock as a, createElementBlock as s, createElementVNode as n, createVNode as f, unref as i, withCtx as g, toDisplayString as r, Fragment as h, renderList as x } from "vue";
import { useRows as b, RowList as v } from "@journal/window-kit";
import { _ as R } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const k = { class: "waiting" }, y = { class: "label" }, D = {
  __name: "WaitingRows",
  setup(N) {
    const { rows: l, failure: d, loaded: u } = b("wait waiting", ["wait.*"]);
    function c(t) {
      return `${Math.max(0, Math.round((Date.now() - Date.parse(t)) / 6e4))} min`;
    }
    const p = w(() => l.value.map((t) => ({ id: t.id, label: t.focus, status: t.state, where: t.targets, waited: c(t.opened_at) })));
    return (t, o) => (a(), s("div", k, [
      o[0] || (o[0] = n("h3", { class: "waiting-heading" }, "What the agent is waiting on", -1)),
      f(i(v), {
        rows: p.value,
        failure: i(d),
        loaded: i(u),
        empty: "Nothing is waiting"
      }, {
        default: g(({ row: e }) => [
          n("span", y, r(e.label), 1),
          (a(!0), s(h, null, x([e.status, e.where, e.waited], (_, m) => (a(), s("span", {
            key: m,
            class: "detail"
          }, r(_), 1))), 128))
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ]));
  }
}, L = /* @__PURE__ */ R(D, [["__scopeId", "data-v-2998b0fd"]]);
export {
  L as default
};
