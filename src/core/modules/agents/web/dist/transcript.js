/* @code-commandments-generated */
if (!document.getElementById("window-styles-c01ae8337e0c")) { const style = document.createElement("style"); style.id = "window-styles-c01ae8337e0c"; style.textContent = ".main[data-v-88fb5cd3]{flex:1}.note[data-v-88fb5cd3]{color:var(--text-3);font-size:12px}.author[data-v-e23d94c7]{color:var(--text-3);font-size:12px;min-width:72px}.text[data-v-e23d94c7]{flex:1;white-space:pre-wrap}\n"; document.head.appendChild(style); }
import { openBlock as i, createBlock as p, unref as t, withCtx as u, createElementVNode as r, toDisplayString as o, h as _ } from "vue";
import { useRows as l, RowList as f, useWindow as d } from "@journal/window-kit";
import { _ as m } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const h = { class: "author" }, w = { class: "text" }, x = {
  __name: "TranscriptRows",
  props: { line: { type: String, required: !0 } },
  setup(s) {
    const n = s, { rows: a, failure: c } = l(n.line, ["hook_call.create"]);
    return (y, R) => (i(), p(t(f), {
      rows: t(a),
      failure: t(c),
      empty: "No conversation yet"
    }, {
      default: u(({ row: e }) => [
        r("span", h, o(e.author), 1),
        r("span", w, o(e.text), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure"]));
  }
}, g = /* @__PURE__ */ m(x, [["__scopeId", "data-v-e23d94c7"]]), N = {
  setup() {
    return () => _(g, { line: `agent transcript ${d().agent}` });
  }
};
export {
  N as default
};
