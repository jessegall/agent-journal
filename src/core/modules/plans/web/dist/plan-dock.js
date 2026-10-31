/* @code-commandments-generated */
if (!document.getElementById("window-styles-fc2765cf31dc")) { const style = document.createElement("style"); style.id = "window-styles-fc2765cf31dc"; style.textContent = ".plan-dock[data-v-28bdeeb8]{display:flex;gap:8px;font-size:12px;line-height:1.45}.plan-dock-state[data-v-28bdeeb8]{color:var(--text-4)}\n"; document.head.appendChild(style); }
import { openBlock as c, createElementBlock as a, Fragment as d, createElementVNode as n, toDisplayString as s, createCommentVNode as _ } from "vue";
const p = (t, o) => {
  const e = t.__vccOpts || t;
  for (const [r, l] of o)
    e[r] = l;
  return e;
}, i = { class: "plan-dock" }, k = { class: "plan-dock-state" }, m = { class: "plan-dock-title" }, u = {
  __name: "PlanDock",
  props: { row: { type: Object, default: null } },
  setup(t) {
    return (o, e) => (c(), a("div", i, [
      t.row ? (c(), a(d, { key: 0 }, [
        n("span", k, s(t.row.state), 1),
        n("span", m, s(t.row.title), 1)
      ], 64)) : _("", !0)
    ]));
  }
}, h = /* @__PURE__ */ p(u, [["__scopeId", "data-v-28bdeeb8"]]);
export {
  h as default
};
