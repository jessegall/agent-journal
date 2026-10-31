/* @code-commandments-generated */
if (!document.getElementById("window-styles-7bc782c2f816")) { const style = document.createElement("style"); style.id = "window-styles-7bc782c2f816"; style.textContent = ".main[data-v-e4262f6a]{flex:1}.note[data-v-e4262f6a]{color:var(--text-3);font-size:12px}.main[data-v-3d6ae42d]{flex:1}.note[data-v-3d6ae42d]{color:var(--text-3);font-size:12px}.terminal[data-v-4276f3c8]{display:flex;flex-direction:column;height:100%;min-height:0;background:var(--code-bg)}.terminal-body[data-v-4276f3c8]{flex:1;min-height:0;margin:0;padding:8px 12px;overflow:auto;color:var(--text-1);font-family:var(--font-mono, ui-monospace, monospace);font-size:12px;line-height:1.45;white-space:pre-wrap;word-break:break-word}.terminal-failure[data-v-4276f3c8]{padding:8px 12px;color:var(--text-3)}\n"; document.head.appendChild(style); }
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
