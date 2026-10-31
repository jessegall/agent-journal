/* @code-commandments-generated */
if (!document.getElementById("window-styles-e70a3d4e9ffa")) { const style = document.createElement("style"); style.id = "window-styles-e70a3d4e9ffa"; style.textContent = ".main[data-v-67afafdd]{flex:1}.note[data-v-67afafdd]{color:var(--text-3);font-size:12px}.main[data-v-9fff0c65]{flex:1}.note[data-v-9fff0c65]{color:var(--text-3);font-size:12px}.terminal[data-v-4276f3c8]{display:flex;flex-direction:column;height:100%;min-height:0;background:var(--code-bg)}.terminal-body[data-v-4276f3c8]{flex:1;min-height:0;margin:0;padding:8px 12px;overflow:auto;color:var(--text-1);font-family:var(--font-mono, ui-monospace, monospace);font-size:12px;line-height:1.45;white-space:pre-wrap;word-break:break-word}.terminal-failure[data-v-4276f3c8]{padding:8px 12px;color:var(--text-3)}\n"; document.head.appendChild(style); }
import { openBlock as n, createBlock as _, unref as t, withCtx as c, createElementVNode as s, toDisplayString as o } from "vue";
import { useRows as r, RowList as l } from "@journal/window-kit";
import { _ as p } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const f = { class: "main" }, m = { class: "note" }, u = { class: "note" }, h = { class: "note" }, x = {
  __name: "FileEdits",
  setup(g) {
    const { rows: a, failure: d, loaded: i } = r("file-edit list", ["file_edit.create"]);
    return (w, y) => (n(), _(t(l), {
      rows: t(a),
      failure: t(d),
      loaded: t(i),
      empty: "No edits yet"
    }, {
      default: c(({ row: e }) => [
        s("span", f, o(e.path), 1),
        s("span", m, "+" + o(e.added), 1),
        s("span", u, "-" + o(e.removed), 1),
        s("span", h, "agent " + o(e.agent_id), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, B = /* @__PURE__ */ p(x, [["__scopeId", "data-v-67afafdd"]]);
export {
  B as default
};
