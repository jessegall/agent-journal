/* @code-commandments-generated */
if (!document.getElementById("window-styles-00c6c34d9a42")) { const style = document.createElement("style"); style.id = "window-styles-00c6c34d9a42"; style.textContent = ".main[data-v-d1545365]{flex:1}.note[data-v-d1545365]{color:var(--text-3);font-size:12px}.nudge[data-v-ff6ed4dd]{min-width:0;padding:6px 0}.nudge-head[data-v-ff6ed4dd]{display:flex;gap:10px;align-items:baseline;margin:0 0 2px;font-size:12px}.nudge-key[data-v-ff6ed4dd]{color:var(--text);font-weight:500}.nudge-type[data-v-ff6ed4dd],.nudge-count[data-v-ff6ed4dd]{color:var(--text-3)}.nudge-type[data-type=refusal][data-v-ff6ed4dd]{color:var(--tone-bad)}.nudge-type[data-type=steering][data-v-ff6ed4dd]{color:var(--accent-text)}.nudge-text[data-v-ff6ed4dd]{margin:0;color:var(--text-2);font-size:12.5px;overflow-wrap:anywhere}\n"; document.head.appendChild(style); }
import { openBlock as c, createBlock as i, unref as o, withCtx as s, createVNode as d, createElementVNode as a, toDisplayString as t } from "vue";
import { useRows as _, useWindow as m, WindowRoom as u, RowList as p } from "@journal/window-kit";
import { _ as f } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const h = { class: "note" }, k = { class: "main" }, g = { class: "note" }, w = {
  __name: "HookCallList",
  setup(x) {
    const { rows: l, failure: n, loaded: r } = _(`hook-call feed --agent-id ${m().agent}`, ["hook_call.create"], { incremental: !0 });
    return (y, C) => (c(), i(o(u), null, {
      default: s(() => [
        d(o(p), {
          rows: o(l),
          failure: o(n),
          loaded: o(r),
          empty: "Nothing recorded for this agent yet",
          hint: "Each call the agent program makes to the journal is listed here."
        }, {
          default: s(({ row: e }) => [
            a("span", h, t(e.hook), 1),
            a("span", k, t(e.tool) + " " + t(e.summary), 1),
            a("span", g, t(e.refusal || e.answer), 1)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, B = /* @__PURE__ */ f(w, [["__scopeId", "data-v-d1545365"]]);
export {
  B as default
};
