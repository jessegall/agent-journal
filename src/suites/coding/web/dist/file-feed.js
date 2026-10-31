/* @code-commandments-generated */
if (!document.getElementById("window-styles-e70a3d4e9ffa")) { const style = document.createElement("style"); style.id = "window-styles-e70a3d4e9ffa"; style.textContent = ".main[data-v-67afafdd]{flex:1}.note[data-v-67afafdd]{color:var(--text-3);font-size:12px}.main[data-v-9fff0c65]{flex:1}.note[data-v-9fff0c65]{color:var(--text-3);font-size:12px}.terminal[data-v-4276f3c8]{display:flex;flex-direction:column;height:100%;min-height:0;background:var(--code-bg)}.terminal-body[data-v-4276f3c8]{flex:1;min-height:0;margin:0;padding:8px 12px;overflow:auto;color:var(--text-1);font-family:var(--font-mono, ui-monospace, monospace);font-size:12px;line-height:1.45;white-space:pre-wrap;word-break:break-word}.terminal-failure[data-v-4276f3c8]{padding:8px 12px;color:var(--text-3)}\n"; document.head.appendChild(style); }
import { openBlock as n, createBlock as r, unref as e, withCtx as c, createElementVNode as s, toDisplayString as o } from "vue";
import { useRows as _, useWindow as l, RowList as f } from "@journal/window-kit";
import { _ as p } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const m = { class: "main" }, u = { class: "note" }, h = { class: "note" }, w = {
  __name: "FileFeed",
  setup(g) {
    const { rows: a, failure: i, loaded: d } = _(`file-edit list --agent ${l().agent}`, ["file_edit.create"]);
    return (x, y) => (n(), r(e(f), {
      rows: e(a),
      failure: e(i),
      loaded: e(d),
      empty: "No edits by this agent yet"
    }, {
      default: c(({ row: t }) => [
        s("span", m, o(t.path), 1),
        s("span", u, "+" + o(t.added), 1),
        s("span", h, "-" + o(t.removed), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, B = /* @__PURE__ */ p(w, [["__scopeId", "data-v-9fff0c65"]]);
export {
  B as default
};
