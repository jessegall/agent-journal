/* @code-commandments-generated */
if (!document.getElementById("window-styles-a944429124c9")) { const style = document.createElement("style"); style.id = "window-styles-a944429124c9"; style.textContent = ".task-dock[data-v-3ff12b87]{display:flex;gap:8px;font-size:12px;line-height:1.45}.task-dock-state[data-v-3ff12b87]{color:var(--text-4)}\n"; document.head.appendChild(style); }
import { openBlock as s, createElementBlock as c, Fragment as k, createElementVNode as a, toDisplayString as n, createCommentVNode as _ } from "vue";
const d = (t, o) => {
  const e = t.__vccOpts || t;
  for (const [r, l] of o)
    e[r] = l;
  return e;
}, i = { class: "task-dock" }, m = { class: "task-dock-state" }, p = { class: "task-dock-title" }, f = {
  __name: "TaskDock",
  props: { row: { type: Object, default: null } },
  setup(t) {
    return (o, e) => (s(), c("div", i, [
      t.row ? (s(), c(k, { key: 0 }, [
        a("span", m, n(t.row.state), 1),
        a("span", p, n(t.row.title), 1)
      ], 64)) : _("", !0)
    ]));
  }
}, h = /* @__PURE__ */ d(f, [["__scopeId", "data-v-3ff12b87"]]);
export {
  h as default
};
