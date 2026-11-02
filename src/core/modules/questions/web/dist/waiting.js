/* @code-commandments-generated */
if (!document.getElementById("window-styles-006959fe5a83")) { const style = document.createElement("style"); style.id = "window-styles-006959fe5a83"; style.textContent = ".open-questions-icon[data-v-bb9f2ba6]{flex:none;color:var(--text-3)}.open-questions-text[data-v-bb9f2ba6]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.open-questions-space[data-v-bb9f2ba6]{flex:1}.question[data-v-61f8aa45]{display:flex;flex:1;flex-direction:column;gap:8px;max-width:640px;margin-bottom:10px;padding:14px 16px 16px;border:1px solid var(--border-2);border-radius:12px;background:var(--raised);overflow-wrap:anywhere}.question-head[data-v-61f8aa45]{display:flex;align-items:baseline;justify-content:space-between;gap:12px}.question-time[data-v-61f8aa45]{flex:none;color:var(--text-3);font-size:11.5px}.question-label[data-v-61f8aa45]{margin:0;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.question-open[data-v-61f8aa45]{padding:0;border:0;background:none;color:var(--text);font:inherit;font-size:14.5px;font-weight:600;line-height:1.4;text-align:left;cursor:pointer}.question-options[data-v-61f8aa45]{display:flex;flex-direction:column;gap:6px}.question-option[data-v-61f8aa45]{display:flex;flex-direction:column;overflow:hidden;padding:9px 12px;border:1px solid var(--border-2);border-radius:8px;background:var(--bg);color:var(--text);font:inherit;font-size:13px;text-align:left;cursor:pointer;transition:transform .12s ease,border-color .2s ease}.question-option[data-v-61f8aa45]:hover{border-color:var(--accent)}.question-option[data-v-61f8aa45]:active{transform:scale(.98)}.question-option.recommended[data-v-61f8aa45]{border-color:color-mix(in srgb,var(--accent) 40%,var(--border-2))}.question-tag[data-v-61f8aa45]{margin:-9px -12px 8px;padding:4px 12px;background:color-mix(in srgb,var(--accent) 16%,transparent);color:var(--accent-text);font-size:11px}.question-closed[data-v-61f8aa45]{margin:0;color:var(--text-3);font-size:12.5px}.question-failure[data-v-61f8aa45]{margin:0;color:var(--danger);font-size:12.5px}.question-dock[data-v-3f6f88a1]{display:flex;gap:8px;font-size:12px;line-height:1.45}.question-dock-state[data-v-3f6f88a1]{color:var(--text-4)}.waiting-heading[data-v-2998b0fd]{margin:0 8px 6px;font-size:12px;font-weight:600;color:var(--text-2)}.label[data-v-2998b0fd]{flex:1}.detail[data-v-2998b0fd]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
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
