/* @code-commandments-generated */
if (!document.getElementById("window-styles-8d7722addb02")) { const style = document.createElement("style"); style.id = "window-styles-8d7722addb02"; style.textContent = ".question-dock[data-v-3f6f88a1]{display:flex;gap:8px;font-size:12px;line-height:1.45}.question-dock-state[data-v-3f6f88a1]{color:var(--text-4)}.question[data-v-15a029b2]{display:flex;flex:1;flex-direction:column;gap:6px}.question-text[data-v-15a029b2]{margin:0}.question-choices[data-v-15a029b2],.question-form[data-v-15a029b2]{display:flex;flex-wrap:wrap;gap:6px}.question-answer[data-v-15a029b2]{flex:1;min-width:120px}.question-choice.recommended[data-v-15a029b2]{font-weight:600}.question-failure[data-v-15a029b2]{margin:6px 8px 0;color:var(--text-2)}.waiting-heading[data-v-9c299e5f]{margin:0 8px 6px;font-size:12px;font-weight:600;color:var(--text-2)}.label[data-v-9c299e5f]{flex:1}.detail[data-v-9c299e5f]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as g, openBlock as s, createElementBlock as i, createElementVNode as n, createVNode as h, unref as r, withCtx as v, toDisplayString as l, Fragment as b, renderList as x } from "vue";
import { useRows as u, RowList as y } from "@journal/window-kit";
import { _ as R } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const k = { class: "waiting" }, q = { class: "label" }, D = {
  __name: "WaitingRows",
  setup(N) {
    const { rows: d, failure: _ } = u("wait list", ["wait.*", "question.*"]), { rows: o } = u("wait-target list", ["wait_target.*"]);
    function c(t) {
      return `${Math.max(0, Math.round((Date.now() - Date.parse(t)) / 6e4))} min`;
    }
    function p(t) {
      return t.type === "help_request" || o.value.some((e) => e.wait_id === t.id && e.row_table === "questions");
    }
    const w = g(() => d.value.filter((t) => t.state === "open" && p(t)).map((t) => ({
      id: t.id,
      label: t.focus,
      status: t.state,
      where: o.value.filter((e) => e.wait_id === t.id).map((e) => `${e.row_table}:${e.row_id}`).join(", "),
      waited: c(t.opened_at)
    })));
    return (t, e) => (s(), i("div", k, [
      e[0] || (e[0] = n("h3", { class: "waiting-heading" }, "What the agent is waiting on", -1)),
      h(r(y), {
        rows: w.value,
        failure: r(_),
        empty: "Nothing is waiting"
      }, {
        default: v(({ row: a }) => [
          n("span", q, l(a.label), 1),
          (s(!0), i(b, null, x([a.status, a.where, a.waited], (m, f) => (s(), i("span", {
            key: f,
            class: "detail"
          }, l(m), 1))), 128))
        ]),
        _: 1
      }, 8, ["rows", "failure"])
    ]));
  }
}, E = /* @__PURE__ */ R(D, [["__scopeId", "data-v-9c299e5f"]]);
export {
  E as default
};
