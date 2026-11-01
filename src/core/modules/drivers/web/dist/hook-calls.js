/* @code-commandments-generated */
if (!document.getElementById("window-styles-de1862e89745")) { const style = document.createElement("style"); style.id = "window-styles-de1862e89745"; style.textContent = ".main[data-v-b751fa35]{flex:1}.note[data-v-b751fa35]{color:var(--text-3);font-size:12px}.nudge[data-v-bd565d01]{min-width:0;padding:6px 0}.nudge-head[data-v-bd565d01]{display:flex;gap:10px;align-items:baseline;margin:0 0 2px;font-size:12px}.nudge-key[data-v-bd565d01]{color:var(--text);font-weight:500}.nudge-type[data-v-bd565d01],.nudge-count[data-v-bd565d01]{color:var(--text-3)}.nudge-type[data-type=refusal][data-v-bd565d01]{color:var(--tone-bad)}.nudge-type[data-type=instruction][data-v-bd565d01]{color:var(--accent-text)}.nudge-text[data-v-bd565d01]{margin:0;color:var(--text-2);font-size:12.5px;overflow-wrap:anywhere}\n"; document.head.appendChild(style); }
import { openBlock as l, createBlock as c, unref as o, withCtx as i, createElementVNode as s, toDisplayString as t } from "vue";
import { useRows as _, useWindow as d, RowList as f } from "@journal/window-kit";
import { _ as p } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const m = { class: "note" }, u = { class: "main" }, h = { class: "note" }, k = {
  __name: "HookCallList",
  setup(g) {
    const { rows: a, failure: n, loaded: r } = _(`hook-call feed --agent-id ${d().agent}`, ["hook_call.create"], { incremental: !0 });
    return (w, x) => (l(), c(o(f), {
      rows: o(a),
      failure: o(n),
      loaded: o(r),
      empty: "Nothing recorded for this agent yet"
    }, {
      default: i(({ row: e }) => [
        s("span", m, t(e.hook), 1),
        s("span", u, t(e.tool) + " " + t(e.summary), 1),
        s("span", h, t(e.refusal || e.answer), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, B = /* @__PURE__ */ p(k, [["__scopeId", "data-v-b751fa35"]]);
export {
  B as default
};
