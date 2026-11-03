/* @code-commandments-generated */
if (!document.getElementById("window-styles-3ae8c1a2eb3b")) { const style = document.createElement("style"); style.id = "window-styles-3ae8c1a2eb3b"; style.textContent = ".main[data-v-fbaf83d4]{flex:1}.note[data-v-fbaf83d4]{color:var(--text-3);font-size:12px}.nudge[data-v-c72d88cb]{min-width:0;padding:6px 0}.nudge-head[data-v-c72d88cb]{display:flex;gap:10px;align-items:baseline;margin:0 0 2px;font-size:12px}.nudge-key[data-v-c72d88cb]{color:var(--text);font-weight:500}.nudge-type[data-v-c72d88cb],.nudge-count[data-v-c72d88cb]{color:var(--text-3)}.nudge-type[data-type=refusal][data-v-c72d88cb]{color:var(--tone-bad)}.nudge-type[data-type=instruction][data-v-c72d88cb]{color:var(--accent-text)}.nudge-text[data-v-c72d88cb]{margin:0;color:var(--text-2);font-size:12.5px;overflow-wrap:anywhere}\n"; document.head.appendChild(style); }
import { openBlock as l, createBlock as c, unref as o, withCtx as i, createElementVNode as s, toDisplayString as t } from "vue";
import { useRows as d, useWindow as _, RowList as f } from "@journal/window-kit";
import { _ as p } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const h = { class: "note" }, m = { class: "main" }, u = { class: "note" }, k = {
  __name: "HookCallList",
  setup(g) {
    const { rows: a, failure: n, loaded: r } = d(`hook-call feed --agent-id ${_().agent}`, ["hook_call.create"], { incremental: !0 });
    return (w, x) => (l(), c(o(f), {
      rows: o(a),
      failure: o(n),
      loaded: o(r),
      empty: "Nothing recorded for this agent yet",
      hint: "Each hook the agent program sends is listed here."
    }, {
      default: i(({ row: e }) => [
        s("span", h, t(e.hook), 1),
        s("span", m, t(e.tool) + " " + t(e.summary), 1),
        s("span", u, t(e.refusal || e.answer), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, B = /* @__PURE__ */ p(k, [["__scopeId", "data-v-fbaf83d4"]]);
export {
  B as default
};
