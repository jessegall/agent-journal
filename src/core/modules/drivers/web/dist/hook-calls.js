/* @code-commandments-generated */
if (!document.getElementById("window-styles-d6960b39ee6e")) { const style = document.createElement("style"); style.id = "window-styles-d6960b39ee6e"; style.textContent = ".main[data-v-6c268e36]{flex:1}.note[data-v-6c268e36]{color:var(--text-3);font-size:12px}.nudge[data-v-695c4b5c]{min-width:0;padding:6px 0}.nudge-head[data-v-695c4b5c]{display:flex;gap:10px;align-items:baseline;margin:0 0 2px;font-size:12px}.nudge-key[data-v-695c4b5c]{color:var(--text);font-weight:500}.nudge-type[data-v-695c4b5c],.nudge-count[data-v-695c4b5c]{color:var(--text-3)}.nudge-type[data-type=refusal][data-v-695c4b5c]{color:var(--tone-bad)}.nudge-type[data-type=steering][data-v-695c4b5c]{color:var(--accent-text)}.nudge-text[data-v-695c4b5c]{margin:0;color:var(--text-2);font-size:12.5px;overflow-wrap:anywhere}\n"; document.head.appendChild(style); }
import { openBlock as c, createBlock as i, unref as e, withCtx as s, createVNode as d, createElementVNode as a, toDisplayString as t } from "vue";
import { useRows as _, useWindow as h, WindowRoom as m, RowList as u } from "@journal/window-kit";
import { _ as p, h as f } from "./_plugin-vue_export-helper-BEOZ8alP.js";
const k = { class: "note" }, g = { class: "main" }, w = { class: "note" }, x = {
  __name: "HookCallList",
  setup(y) {
    const { rows: l, failure: n, loaded: r } = _(`hook-call feed --agent-id ${h().agent}`, ["hook_call.create"], { incremental: !0 });
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
            a("span", k, t(e(f)(o.hook)), 1),
            a("span", g, t(o.tool) + " " + t(o.summary), 1),
            a("span", w, t(o.refusal || o.answer), 1)
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, v = /* @__PURE__ */ p(x, [["__scopeId", "data-v-6c268e36"]]);
export {
  v as default
};
