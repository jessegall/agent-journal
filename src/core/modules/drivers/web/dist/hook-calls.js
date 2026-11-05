/* @code-commandments-generated */
if (!document.getElementById("window-styles-fa289bc41fe2")) { const style = document.createElement("style"); style.id = "window-styles-fa289bc41fe2"; style.textContent = ".main[data-v-e1fb2add]{flex:1}.note[data-v-e1fb2add]{color:var(--text-3);font-size:12px}.nudge[data-v-695c4b5c]{min-width:0;padding:6px 0}.nudge-head[data-v-695c4b5c]{display:flex;gap:10px;align-items:baseline;margin:0 0 2px;font-size:12px}.nudge-key[data-v-695c4b5c]{color:var(--text);font-weight:500}.nudge-type[data-v-695c4b5c],.nudge-count[data-v-695c4b5c]{color:var(--text-3)}.nudge-type[data-type=refusal][data-v-695c4b5c]{color:var(--tone-bad)}.nudge-type[data-type=steering][data-v-695c4b5c]{color:var(--accent-text)}.nudge-text[data-v-695c4b5c]{margin:0;color:var(--text-2);font-size:12.5px;overflow-wrap:anywhere}\n"; document.head.appendChild(style); }
import { openBlock as c, createBlock as i, unref as e, withCtx as s, createVNode as d, createElementVNode as a, toDisplayString as t } from "vue";
import { useRows as _, useWindow as h, WindowRoom as m, RowList as u } from "@journal/window-kit";
import { _ as f, h as p } from "./_plugin-vue_export-helper-BEOZ8alP.js";
const k = { class: "note" }, g = { class: "main" }, w = { class: "note" }, x = {
  __name: "HookCallList",
  setup(y) {
    const { rows: l, failure: n, loaded: r } = _(`hook-call feed --session-agent-id ${h().agent}`, ["hook_call.*"], { incremental: !0 });
    return (L, C) => (c(), i(e(m), null, {
      default: s(() => [
        d(e(u), {
          rows: e(l),
          failure: e(n),
          loaded: e(r),
          empty: "Nothing recorded for this agent yet",
          hint: "Each call the agent program makes to the journal is listed here."
        }, {
          default: s(({ row: o }) => [
            a("span", k, t(e(p)(o.hook)), 1),
            a("span", g, t(o.tool) + " " + t(o.summary), 1),
            a("span", w, t(o.refusal || o.answer), 1)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, b = /* @__PURE__ */ f(x, [["__scopeId", "data-v-e1fb2add"]]);
export {
  b as default
};
