/* @code-commandments-generated */
if (!document.getElementById("window-styles-2db4b9edde2e")) { const style = document.createElement("style"); style.id = "window-styles-2db4b9edde2e"; style.textContent = ".memory-dock[data-v-19bd84d7]{display:flex;gap:8px;font-size:12px;line-height:1.45}.memory-dock-weight[data-v-19bd84d7]{color:var(--text-4)}\n"; document.head.appendChild(style); }
import { openBlock as c, createElementBlock as r, Fragment as d, createElementVNode as s, toDisplayString as n, createCommentVNode as _ } from "vue";
const l = (e, o) => {
  const t = e.__vccOpts || e;
  for (const [a, m] of o)
    t[a] = m;
  return t;
}, i = { class: "memory-dock" }, k = { class: "memory-dock-weight" }, p = { class: "memory-dock-text" }, y = {
  __name: "MemoryDock",
  props: { row: { type: Object, default: null } },
  setup(e) {
    return (o, t) => (c(), r("div", i, [
      e.row ? (c(), r(d, { key: 0 }, [
        s("span", k, "weight " + n(e.row.weight), 1),
        s("span", p, n(e.row.text), 1)
      ], 64)) : _("", !0)
    ]));
  }
}, h = /* @__PURE__ */ l(y, [["__scopeId", "data-v-19bd84d7"]]);
export {
  h as default
};
