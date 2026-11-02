/* @code-commandments-generated */
if (!document.getElementById("window-styles-a6ce87ec0aba")) { const style = document.createElement("style"); style.id = "window-styles-a6ce87ec0aba"; style.textContent = ".agent-card[data-v-6a5fba39]{display:flex;flex:1;flex-direction:column;gap:3px;min-width:0;padding:9px 12px;border:0;border-bottom:1px solid var(--border);background:transparent;color:inherit;font:inherit;text-align:left;cursor:pointer}.agent-card[data-v-6a5fba39]:hover{background:var(--hover)}.agent-head[data-v-6a5fba39]{display:flex;gap:8px;align-items:center;min-width:0}.agent-dot[data-v-6a5fba39]{flex:none;width:7px;height:7px;border-radius:50%;background:var(--text-3)}.agent-dot.running[data-v-6a5fba39]{background:var(--accent)}.agent-name[data-v-6a5fba39]{flex:none;font-weight:500}.agent-program[data-v-6a5fba39],.agent-time[data-v-6a5fba39],.agent-usage[data-v-6a5fba39]{color:var(--text-3);font-size:12px}.agent-program[data-v-6a5fba39]{flex:1;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.agent-time[data-v-6a5fba39]{flex:none}.agent-time.running[data-v-6a5fba39]{color:var(--accent-text)}.agent-task[data-v-6a5fba39]{overflow:hidden;color:var(--text-2);font-size:12.5px;white-space:nowrap;text-overflow:ellipsis}.agents[data-v-a097a24c]{display:flex;flex-direction:column;height:100%;min-width:400px;min-height:0}.agents[data-v-a097a24c] .row-list{gap:0}.agents[data-v-a097a24c] .row-list-row{padding:0}.agents-bar[data-v-a097a24c]{display:flex;gap:10px;align-items:center;padding:8px 12px;border-bottom:1px solid var(--border)}.agents-search[data-v-a097a24c]{flex:1;min-width:0}.author[data-v-f34e0cbb]{color:var(--text-3);font-size:12px;min-width:72px}.text[data-v-f34e0cbb]{flex:1;white-space:pre-wrap}\n"; document.head.appendChild(style); }
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
