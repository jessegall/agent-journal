/* @code-commandments-generated */
if (!document.getElementById("window-styles-2a541f302061")) { const style = document.createElement("style"); style.id = "window-styles-2a541f302061"; style.textContent = ".dump-dock[data-v-4cfda69f]{display:flex;gap:8px;font-size:12px;line-height:1.45}.dump-dock-title[data-v-4cfda69f]{color:var(--text-4)}.dump[data-v-74113cb7]{padding:6px 0}.dump-title[data-v-74113cb7]{margin:0;font-size:13px}.dump-brief[data-v-74113cb7]{margin:2px 0 0;font-size:12px;color:var(--text-4)}\n"; document.head.appendChild(style); }
import { openBlock as p, createElementBlock as i, createVNode as a, unref as t, withCtx as u, createElementVNode as o, toDisplayString as s } from "vue";
import { useRows as _, RowList as r } from "@journal/window-kit";
import { _ as l } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const n = { class: "dumps" }, f = { class: "dump" }, h = { class: "dump-title" }, w = { class: "dump-brief" }, x = {
  __name: "DumpRows",
  setup(D) {
    const { rows: d, failure: c, loaded: m } = _("dump list", ["dump.*", "dump_item.*"]);
    return (R, b) => (p(), i("div", n, [
      a(t(r), {
        rows: t(d),
        failure: t(c),
        loaded: t(m),
        empty: "No dumps"
      }, {
        default: u(({ row: e }) => [
          o("div", f, [
            o("p", h, s(e.title || `Dump ${e.id}`), 1),
            o("p", w, s(e.outcome ? `Closed: ${e.outcome}` : e.brief), 1)
          ])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ]));
  }
}, y = /* @__PURE__ */ l(x, [["__scopeId", "data-v-74113cb7"]]);
export {
  y as default
};
