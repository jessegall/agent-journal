if (!document.getElementById("window-styles-2e9f12c62e69")) { const style = document.createElement("style"); style.id = "window-styles-2e9f12c62e69"; style.textContent = ".title[data-v-85658e62]{flex:1}.state[data-v-85658e62]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as i, createBlock as l, unref as o, withCtx as p, createElementVNode as n, toDisplayString as _ } from "vue";
import { useRows as f, RowList as u } from "@journal/window-kit";
const k = (s, e) => {
  const t = s.__vccOpts || s;
  for (const [a, r] of e)
    t[a] = r;
  return t;
}, m = { class: "title" }, d = { class: "state" }, w = {
  __name: "TaskList",
  setup(s) {
    const { rows: e, failure: t } = f("task list", ["task.*"]);
    return (a, r) => (i(), l(o(u), {
      rows: o(e),
      failure: o(t),
      empty: "No tasks yet"
    }, {
      default: p(({ row: c }) => [
        n("span", m, _(c.title), 1),
        n("span", d, _(c.state), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure"]));
  }
}, y = /* @__PURE__ */ k(w, [["__scopeId", "data-v-85658e62"]]);
export {
  y as default
};
