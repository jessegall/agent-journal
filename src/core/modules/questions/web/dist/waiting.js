/* @code-commandments-generated */
if (!document.getElementById("window-styles-5d5ca77f50c4")) { const style = document.createElement("style"); style.id = "window-styles-5d5ca77f50c4"; style.textContent = ".question-dock[data-v-3f6f88a1]{display:flex;gap:8px;font-size:12px;line-height:1.45}.question-dock-state[data-v-3f6f88a1]{color:var(--text-4)}.question[data-v-ef7ac5e5]{display:flex;flex:1;flex-direction:column;gap:6px}.question-text[data-v-ef7ac5e5]{margin:0}.question-choices[data-v-ef7ac5e5],.question-form[data-v-ef7ac5e5]{display:flex;flex-wrap:wrap;gap:6px}.question-answer[data-v-ef7ac5e5]{flex:1;min-width:120px}.question-choice.recommended[data-v-ef7ac5e5]{font-weight:600}.question-failure[data-v-ef7ac5e5]{margin:6px 8px 0;color:var(--text-2)}.waiting-heading[data-v-51430256]{margin:0 8px 6px;font-size:12px;font-weight:600;color:var(--text-2)}.label[data-v-51430256]{flex:1}.detail[data-v-51430256]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as h, openBlock as s, createElementBlock as i, createElementVNode as r, createVNode as v, unref as o, withCtx as b, toDisplayString as l, Fragment as x, renderList as y } from "vue";
import { useRows as d, RowList as R } from "@journal/window-kit";
import { _ as k } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const q = { class: "waiting" }, D = { class: "label" }, N = {
  __name: "WaitingRows",
  setup(W) {
    const { rows: u, failure: _, loaded: c } = d("wait list", ["wait.*", "question.*"]), { rows: n } = d("wait-target list", ["wait_target.*"]);
    function p(t) {
      return `${Math.max(0, Math.round((Date.now() - Date.parse(t)) / 6e4))} min`;
    }
    function w(t) {
      return t.type === "help_request" || n.value.some((e) => e.wait_id === t.id && e.row_table === "questions");
    }
    const m = h(() => u.value.filter((t) => t.state === "open" && w(t)).map((t) => ({
      id: t.id,
      label: t.focus,
      status: t.state,
      where: n.value.filter((e) => e.wait_id === t.id).map((e) => `${e.row_table}:${e.row_id}`).join(", "),
      waited: p(t.opened_at)
    })));
    return (t, e) => (s(), i("div", q, [
      e[0] || (e[0] = r("h3", { class: "waiting-heading" }, "What the agent is waiting on", -1)),
      v(o(R), {
        rows: m.value,
        failure: o(_),
        loaded: o(c),
        empty: "Nothing is waiting"
      }, {
        default: b(({ row: a }) => [
          r("span", D, l(a.label), 1),
          (s(!0), i(x, null, y([a.status, a.where, a.waited], (f, g) => (s(), i("span", {
            key: g,
            class: "detail"
          }, l(f), 1))), 128))
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ]));
  }
}, L = /* @__PURE__ */ k(N, [["__scopeId", "data-v-51430256"]]);
export {
  L as default
};
