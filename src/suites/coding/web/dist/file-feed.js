/* @code-commandments-generated */
if (!document.getElementById("window-styles-3dc8538420c2")) { const style = document.createElement("style"); style.id = "window-styles-3dc8538420c2"; style.textContent = ".main[data-v-67afafdd]{flex:1}.note[data-v-67afafdd]{color:var(--text-3);font-size:12px}.main[data-v-e7401c03]{flex:1}.note[data-v-e7401c03]{color:var(--text-3);font-size:12px}.terminal[data-v-4276f3c8]{display:flex;flex-direction:column;height:100%;min-height:0;background:var(--code-bg)}.terminal-body[data-v-4276f3c8]{flex:1;min-height:0;margin:0;padding:8px 12px;overflow:auto;color:var(--text-1);font-family:var(--font-mono, ui-monospace, monospace);font-size:12px;line-height:1.45;white-space:pre-wrap;word-break:break-word}.terminal-failure[data-v-4276f3c8]{padding:8px 12px;color:var(--text-3)}\n"; document.head.appendChild(style); }
import { openBlock as l, createBlock as r, unref as e, withCtx as c, createElementVNode as s, toDisplayString as o } from "vue";
import { useRows as _, useWindow as a, RowList as p } from "@journal/window-kit";
import { _ as f } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const m = { class: "main" }, u = { class: "note" }, h = { class: "note" }, g = {
  __name: "FileFeed",
  setup(w) {
    const { rows: i, failure: n, loaded: d } = _(a().agent == null ? "file-edit list" : `file-edit list --agent ${a().agent}`, ["file_edit.create"]);
    return (x, y) => (l(), r(e(p), {
      rows: e(i),
      failure: e(n),
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
}, B = /* @__PURE__ */ f(g, [["__scopeId", "data-v-e7401c03"]]);
export {
  B as default
};
