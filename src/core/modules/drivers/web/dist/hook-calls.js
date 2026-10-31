/* @code-commandments-generated */
if (!document.getElementById("window-styles-0d51f4679591")) { const style = document.createElement("style"); style.id = "window-styles-0d51f4679591"; style.textContent = ".main[data-v-f3991ac7]{flex:1}.note[data-v-f3991ac7]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as _, createBlock as i, unref as e, withCtx as d, createElementVNode as r, toDisplayString as s } from "vue";
import { useRows as p, useWindow as f, RowList as u } from "@journal/window-kit";
const m = (a, n) => {
  const t = a.__vccOpts || a;
  for (const [c, l] of n)
    t[c] = l;
  return t;
}, h = { class: "note" }, k = { class: "main" }, g = { class: "note" }, y = {
  __name: "HookCallList",
  setup(a) {
    const { rows: n, failure: t, loaded: c } = p(`hook-call list --agent ${f().agent}`, ["hook_call.create"]);
    return (l, w) => (_(), i(e(u), {
      rows: e(n),
      failure: e(t),
      loaded: e(c),
      empty: "Nothing recorded for this agent yet"
    }, {
      default: d(({ row: o }) => [
        r("span", h, s(o.hook), 1),
        r("span", k, s(o.tool) + " " + s(o.summary), 1),
        r("span", g, s(o.refusal || o.answer), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, C = /* @__PURE__ */ m(y, [["__scopeId", "data-v-f3991ac7"]]);
export {
  C as default
};
