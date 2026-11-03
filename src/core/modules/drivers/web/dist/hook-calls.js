/* @code-commandments-generated */
if (!document.getElementById("window-styles-507980e1a78a")) { const style = document.createElement("style"); style.id = "window-styles-507980e1a78a"; style.textContent = ".main[data-v-cc346bcc]{flex:1}.note[data-v-cc346bcc]{color:var(--text-3);font-size:12px}.nudge[data-v-f9c4d54c]{min-width:0;padding:6px 0}.nudge-head[data-v-f9c4d54c]{display:flex;gap:10px;align-items:baseline;margin:0 0 2px;font-size:12px}.nudge-key[data-v-f9c4d54c]{color:var(--text);font-weight:500}.nudge-type[data-v-f9c4d54c],.nudge-count[data-v-f9c4d54c]{color:var(--text-3)}.nudge-type[data-type=refusal][data-v-f9c4d54c]{color:var(--tone-bad)}.nudge-type[data-type=steering][data-v-f9c4d54c]{color:var(--accent-text)}.nudge-text[data-v-f9c4d54c]{margin:0;color:var(--text-2);font-size:12.5px;overflow-wrap:anywhere}\n"; document.head.appendChild(style); }
import { openBlock as c, createBlock as l, unref as t, withCtx as i, createElementVNode as a, toDisplayString as o } from "vue";
import { useRows as _, useWindow as d, RowList as m } from "@journal/window-kit";
import { _ as p } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const h = { class: "note" }, u = { class: "main" }, f = { class: "note" }, k = {
  __name: "HookCallList",
  setup(g) {
    const { rows: s, failure: r, loaded: n } = _(`hook-call feed --agent-id ${d().agent}`, ["hook_call.create"], { incremental: !0 });
    return (w, x) => (c(), l(t(m), {
      rows: t(s),
      failure: t(r),
      loaded: t(n),
      empty: "Nothing recorded for this agent yet",
      hint: "Each call the agent program makes to the journal is listed here."
    }, {
      default: i(({ row: e }) => [
        a("span", h, o(e.hook), 1),
        a("span", u, o(e.tool) + " " + o(e.summary), 1),
        a("span", f, o(e.refusal || e.answer), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, B = /* @__PURE__ */ p(k, [["__scopeId", "data-v-cc346bcc"]]);
export {
  B as default
};
