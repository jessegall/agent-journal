/* @code-commandments-generated */
if (!document.getElementById("window-styles-dbec2ce77b20")) { const style = document.createElement("style"); style.id = "window-styles-dbec2ce77b20"; style.textContent = ".agents[data-v-449e1a48]{display:flex;flex-direction:column;height:100%;min-height:0}.agents-bar[data-v-449e1a48]{display:flex;gap:10px;align-items:center;padding:8px 12px;border-bottom:1px solid var(--border)}.agents-search[data-v-449e1a48]{flex:1;min-width:0}.id[data-v-449e1a48]{flex:none;width:44px;color:var(--text-3);font-size:12px}.state[data-v-449e1a48]{flex:none;color:var(--text-3);font-size:12px}.state.running[data-v-449e1a48]{color:var(--accent-text)}.main[data-v-449e1a48]{flex:1}.note[data-v-449e1a48]{color:var(--text-3);font-size:12px}.author[data-v-f34e0cbb]{color:var(--text-3);font-size:12px;min-width:72px}.text[data-v-f34e0cbb]{flex:1;white-space:pre-wrap}\n"; document.head.appendChild(style); }
import { openBlock as p, createBlock as l, unref as t, withCtx as u, createElementVNode as o, toDisplayString as r, h as _ } from "vue";
import { useRows as d, RowList as f, useWindow as m } from "@journal/window-kit";
import { _ as h } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const w = { class: "author" }, x = { class: "text" }, g = {
  __name: "TranscriptRows",
  props: { line: { type: String, required: !0 } },
  setup(s) {
    const a = s, { rows: n, failure: c, loaded: i } = d(a.line, ["hook_call.create"]);
    return (R, k) => (p(), l(t(f), {
      rows: t(n),
      failure: t(c),
      loaded: t(i),
      empty: "No conversation yet"
    }, {
      default: u(({ row: e }) => [
        o("span", w, r(e.author), 1),
        o("span", x, r(e.text), 1)
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, y = /* @__PURE__ */ h(g, [["__scopeId", "data-v-f34e0cbb"]]), N = {
  setup() {
    return () => _(y, { line: `agent transcript ${m().agent}` });
  }
};
export {
  N as default
};
