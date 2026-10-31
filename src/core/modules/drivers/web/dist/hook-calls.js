if (!document.getElementById("window-styles-1bdd9b77193f")) { const style = document.createElement("style"); style.id = "window-styles-1bdd9b77193f"; style.textContent = ".main[data-v-e5067287]{flex:1}.note[data-v-e5067287]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as _, createBlock as i, unref as n, withCtx as p, createElementVNode as r, toDisplayString as e } from "vue";
import { useRows as u, useWindow as f, RowList as d } from "@journal/window-kit";
const m = (s, a) => {
  const o = s.__vccOpts || s;
  for (const [c, l] of a)
    o[c] = l;
  return o;
}, h = { class: "note" }, k = { class: "main" }, g = { class: "note" }, y = {
  __name: "HookCallList",
  setup(s) {
    const { rows: a, failure: o } = u(`hook-call list --agent ${f().agent}`, ["hook_call.create"]);
    return (c, l) => (_(), i(n(d), {
      rows: n(a),
      failure: n(o),
      empty: "Nothing recorded for this agent yet"
    }, {
      default: p(({ row: t }) => [
        r("span", h, e(t.hook), 1),
        r("span", k, e(t.tool) + " " + e(t.summary), 1),
        r("span", g, e(t.refusal || t.answer), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure"]));
  }
}, v = /* @__PURE__ */ m(y, [["__scopeId", "data-v-e5067287"]]);
export {
  v as default
};
