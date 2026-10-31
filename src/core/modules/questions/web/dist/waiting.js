/* @code-commandments-generated */
if (!document.getElementById("window-styles-e896026f7242")) { const style = document.createElement("style"); style.id = "window-styles-e896026f7242"; style.textContent = ".question-dock[data-v-3f6f88a1]{display:flex;gap:8px;font-size:12px;line-height:1.45}.question-dock-state[data-v-3f6f88a1]{color:var(--text-4)}.question[data-v-15a029b2]{display:flex;flex:1;flex-direction:column;gap:6px}.question-text[data-v-15a029b2]{margin:0}.question-choices[data-v-15a029b2],.question-form[data-v-15a029b2]{display:flex;flex-wrap:wrap;gap:6px}.question-answer[data-v-15a029b2]{flex:1;min-width:120px}.question-choice.recommended[data-v-15a029b2]{font-weight:600}.question-failure[data-v-15a029b2]{margin:6px 8px 0;color:var(--text-2)}.waiting-heading[data-v-64e19510]{margin:0 8px 6px;font-size:12px;font-weight:600;color:var(--text-2)}.label[data-v-64e19510]{flex:1}.detail[data-v-64e19510]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as h, openBlock as a, createElementBlock as i, createElementVNode as n, createVNode as g, unref as r, withCtx as v, toDisplayString as l, Fragment as b, renderList as x } from "vue";
import { useRows as u, RowList as $ } from "@journal/window-kit";
import { _ as y } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const R = { class: "waiting" }, k = { class: "label" }, q = {
  __name: "WaitingRows",
  setup(D) {
    const { rows: d, failure: _ } = u("wait list", ["wait.*", "question.*"]), { rows: o } = u("wait-target list", ["wait_target.*"]);
    function c(e) {
      const t = Math.max(0, Math.round((Date.now() - Date.parse(e)) / 6e4));
      return t < 60 ? `${t} min` : `${Math.floor(t / 60)} h ${t % 60} min`;
    }
    function p(e) {
      return e.type === "help_request" || o.value.some((t) => t.wait_id === e.id && t.row_table === "questions");
    }
    const w = h(() => d.value.filter((e) => e.state === "open" && p(e)).map((e) => ({
      id: e.id,
      label: e.focus,
      status: e.state,
      where: o.value.filter((t) => t.wait_id === e.id).map((t) => `${t.row_table}:${t.row_id}`).join(", "),
      waited: c(e.opened_at)
    })));
    return (e, t) => (a(), i("div", R, [
      t[0] || (t[0] = n("h3", { class: "waiting-heading" }, "What the agent is waiting on", -1)),
      g(r($), {
        rows: w.value,
        failure: r(_),
        empty: "Nothing is waiting"
      }, {
        default: v(({ row: s }) => [
          n("span", k, l(s.label), 1),
          (a(!0), i(b, null, x([s.status, s.where, s.waited], (m, f) => (a(), i("span", {
            key: f,
            class: "detail"
          }, l(m), 1))), 128))
        ]),
        _: 1
      }, 8, ["rows", "failure"])
    ]));
  }
}, B = /* @__PURE__ */ y(q, [["__scopeId", "data-v-64e19510"]]);
export {
  B as default
};
