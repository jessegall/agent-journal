/* @code-commandments-generated */
if (!document.getElementById("window-styles-468042f5a592")) { const style = document.createElement("style"); style.id = "window-styles-468042f5a592"; style.textContent = ".main[data-v-e4262f6a]{flex:1}.note[data-v-e4262f6a]{color:var(--text-3);font-size:12px}.main[data-v-3d6ae42d]{flex:1}.note[data-v-3d6ae42d]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as n, createBlock as r, unref as t, withCtx as _, createElementVNode as s, toDisplayString as o } from "vue";
import { useRows as c, useWindow as d, RowList as l } from "@journal/window-kit";
import { _ as p } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const f = { class: "main" }, m = { class: "note" }, u = { class: "note" }, h = {
  __name: "FileFeed",
  setup(w) {
    const { rows: a, failure: i } = c(`file-edit list --agent ${d().agent}`, ["file_edit.create"]);
    return (g, x) => (n(), r(t(l), {
      rows: t(a),
      failure: t(i),
      empty: "No edits by this agent yet"
    }, {
      default: _(({ row: e }) => [
        s("span", f, o(e.path), 1),
        s("span", m, "+" + o(e.added), 1),
        s("span", u, "-" + o(e.removed), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure"]));
  }
}, v = /* @__PURE__ */ p(h, [["__scopeId", "data-v-3d6ae42d"]]);
export {
  v as default
};
