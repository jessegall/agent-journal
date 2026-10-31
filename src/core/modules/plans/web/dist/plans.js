if (!document.getElementById("window-styles-eb1afc03cecd")) { const style = document.createElement("style"); style.id = "window-styles-eb1afc03cecd"; style.textContent = ".title[data-v-f1e09327]{flex:1}.state[data-v-f1e09327]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as _, createBlock as p, unref as o, withCtx as i, createElementVNode as c, toDisplayString as l } from "vue";
import { useRows as f, RowList as u } from "@journal/window-kit";
const m = (e, s) => {
  const t = e.__vccOpts || e;
  for (const [a, n] of s)
    t[a] = n;
  return t;
}, d = { class: "title" }, h = { class: "state" }, w = {
  __name: "PlanList",
  setup(e) {
    const { rows: s, failure: t } = f("plan list", ["plan.*", "phase.*"]);
    return (a, n) => (_(), p(o(u), {
      rows: o(s),
      failure: o(t),
      empty: "No plans yet"
    }, {
      default: i(({ row: r }) => [
        c("span", d, l(r.title), 1),
        c("span", h, l(r.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure"]));
  }
}, k = /* @__PURE__ */ m(w, [["__scopeId", "data-v-f1e09327"]]);
export {
  k as default
};
