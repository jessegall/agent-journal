/* @code-commandments-generated */
if (!document.getElementById("window-styles-871772224cab")) { const style = document.createElement("style"); style.id = "window-styles-871772224cab"; style.textContent = ".main[data-v-f3991ac7]{flex:1}.note[data-v-f3991ac7]{color:var(--text-3);font-size:12px}.nudge[data-v-bd565d01]{min-width:0;padding:6px 0}.nudge-head[data-v-bd565d01]{display:flex;gap:10px;align-items:baseline;margin:0 0 2px;font-size:12px}.nudge-key[data-v-bd565d01]{color:var(--text);font-weight:500}.nudge-type[data-v-bd565d01],.nudge-count[data-v-bd565d01]{color:var(--text-3)}.nudge-type[data-type=refusal][data-v-bd565d01]{color:var(--tone-bad)}.nudge-type[data-type=instruction][data-v-bd565d01]{color:var(--accent-text)}.nudge-text[data-v-bd565d01]{margin:0;color:var(--text-2);font-size:12.5px;overflow-wrap:anywhere}\n"; document.head.appendChild(style); }
import { openBlock as r, createBlock as c, unref as e, withCtx as i, createElementVNode as s, toDisplayString as t } from "vue";
import { useRows as _, useWindow as d, RowList as p } from "@journal/window-kit";
import { _ as f } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const m = { class: "note" }, u = { class: "main" }, h = { class: "note" }, k = {
  __name: "HookCallList",
  setup(g) {
    const { rows: a, failure: l, loaded: n } = _(`hook-call list --agent ${d().agent}`, ["hook_call.create"]);
    return (w, x) => (r(), c(e(p), {
      rows: e(a),
      failure: e(l),
      loaded: e(n),
      empty: "Nothing recorded for this agent yet"
    }, {
      default: i(({ row: o }) => [
        s("span", m, t(o.hook), 1),
        s("span", u, t(o.tool) + " " + t(o.summary), 1),
        s("span", h, t(o.refusal || o.answer), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, B = /* @__PURE__ */ f(k, [["__scopeId", "data-v-f3991ac7"]]);
export {
  B as default
};
