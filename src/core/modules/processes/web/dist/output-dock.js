/* @code-commandments-generated */
if (!document.getElementById("window-styles-e884bf100dfc")) { const style = document.createElement("style"); style.id = "window-styles-e884bf100dfc"; style.textContent = ".output-dock[data-v-ffbab2f9]{display:flex;gap:8px;font-size:12px;line-height:1.45}.output-dock-state[data-v-ffbab2f9]{color:var(--text-4)}.output-dock-line[data-v-ffbab2f9]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}\n"; document.head.appendChild(style); }
import { openBlock as c, createElementBlock as s, Fragment as l, createElementVNode as n, toDisplayString as a, createCommentVNode as p } from "vue";
const _ = (t, o) => {
  const e = t.__vccOpts || t;
  for (const [r, u] of o)
    e[r] = u;
  return e;
}, d = { class: "output-dock" }, i = { class: "output-dock-state" }, f = { class: "output-dock-line" }, k = {
  __name: "OutputDock",
  props: { row: { type: Object, default: null } },
  setup(t) {
    return (o, e) => (c(), s("div", d, [
      t.row ? (c(), s(l, { key: 0 }, [
        n("span", i, a(t.row.state), 1),
        n("span", f, a(t.row.line), 1)
      ], 64)) : p("", !0)
    ]));
  }
}, h = /* @__PURE__ */ _(k, [["__scopeId", "data-v-ffbab2f9"]]);
export {
  h as default
};
