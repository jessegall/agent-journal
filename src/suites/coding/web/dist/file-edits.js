/* @code-commandments-generated */
if (!document.getElementById("window-styles-468042f5a592")) { const style = document.createElement("style"); style.id = "window-styles-468042f5a592"; style.textContent = ".main[data-v-e4262f6a]{flex:1}.note[data-v-e4262f6a]{color:var(--text-3);font-size:12px}.main[data-v-3d6ae42d]{flex:1}.note[data-v-3d6ae42d]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as n, createBlock as _, unref as o, withCtx as c, createElementVNode as t, toDisplayString as s } from "vue";
import { useRows as r, RowList as d } from "@journal/window-kit";
import { _ as l } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const p = { class: "main" }, f = { class: "note" }, m = { class: "note" }, u = { class: "note" }, h = {
  __name: "FileEdits",
  setup(x) {
    const { rows: a, failure: i } = r("file-edit list", ["file_edit.create"]);
    return (g, w) => (n(), _(o(d), {
      rows: o(a),
      failure: o(i),
      empty: "No edits yet"
    }, {
      default: c(({ row: e }) => [
        t("span", p, s(e.path), 1),
        t("span", f, "+" + s(e.added), 1),
        t("span", m, "-" + s(e.removed), 1),
        t("span", u, "agent " + s(e.agent_id), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure"]));
  }
}, v = /* @__PURE__ */ l(h, [["__scopeId", "data-v-e4262f6a"]]);
export {
  v as default
};
