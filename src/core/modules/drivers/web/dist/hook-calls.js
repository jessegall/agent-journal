/* @code-commandments-generated */
if (!document.getElementById("window-styles-53f26404856a")) { const style = document.createElement("style"); style.id = "window-styles-53f26404856a"; style.textContent = ".main[data-v-e88bd081]{flex:1}.note[data-v-e88bd081]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as _, createBlock as i, unref as o, withCtx as d, createElementVNode as c, toDisplayString as s } from "vue";
import { useRows as p, useWindow as u, RowList as f } from "@journal/window-kit";
const m = (a, n) => {
  const t = a.__vccOpts || a;
  for (const [r, l] of n)
    t[r] = l;
  return t;
}, h = { class: "note" }, k = { class: "main" }, g = { class: "note" }, y = {
  __name: "HookCallList",
  setup(a) {
    const { rows: n, failure: t, loaded: r } = p(`hook-call feed --agent-id ${u().agent}`, ["hook_call.create"], { incremental: !0 });
    return (l, w) => (_(), i(o(f), {
      rows: o(n),
      failure: o(t),
      loaded: o(r),
      empty: "Nothing recorded for this agent yet"
    }, {
      default: d(({ row: e }) => [
        c("span", h, s(e.hook), 1),
        c("span", k, s(e.tool) + " " + s(e.summary), 1),
        c("span", g, s(e.refusal || e.answer), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, C = /* @__PURE__ */ m(y, [["__scopeId", "data-v-e88bd081"]]);
export {
  C as default
};
