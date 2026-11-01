/* @code-commandments-generated */
if (!document.getElementById("window-styles-2004e64fa100")) { const style = document.createElement("style"); style.id = "window-styles-2004e64fa100"; style.textContent = ".agents[data-v-8a962e6d]{display:flex;flex-direction:column;height:100%;min-height:0}.open[data-v-8a962e6d]{padding:0 6px;border:1px solid var(--border);border-radius:6px;background:transparent;color:var(--text-2);font-size:12px;cursor:pointer}.agents-bar[data-v-8a962e6d]{display:flex;gap:10px;align-items:center;padding:8px 12px;border-bottom:1px solid var(--border)}.agents-search[data-v-8a962e6d]{flex:1;min-width:0}.id[data-v-8a962e6d]{flex:none;width:44px;color:var(--text-3);font-size:12px}.state[data-v-8a962e6d]{flex:none;color:var(--text-3);font-size:12px}.state.running[data-v-8a962e6d]{color:var(--accent-text)}.main[data-v-8a962e6d]{flex:1}.note[data-v-8a962e6d]{color:var(--text-3);font-size:12px}.author[data-v-f34e0cbb]{color:var(--text-3);font-size:12px;min-width:72px}.text[data-v-f34e0cbb]{flex:1;white-space:pre-wrap}\n"; document.head.appendChild(style); }
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
