/* @code-commandments-generated */
if (!document.getElementById("window-styles-d3af9bd66e75")) { const style = document.createElement("style"); style.id = "window-styles-d3af9bd66e75"; style.textContent = ".agent-card[data-v-315604f0]{position:relative;display:flex;flex:1;flex-direction:column;gap:3px;min-width:0;padding:9px 12px;border-bottom:1px solid var(--border)}.agent-card[data-v-315604f0]:hover{background:var(--hover)}.agent-open[data-v-315604f0]{position:absolute;top:0;right:0;bottom:0;left:0;padding:0;border:0;background:transparent;cursor:pointer}.agent-head[data-v-315604f0],.agent-line[data-v-315604f0],.agent-usage[data-v-315604f0]{position:relative;pointer-events:none}.agent-head[data-v-315604f0]{display:flex;gap:8px;align-items:center;min-width:0}.agent-dot[data-v-315604f0]{flex:none;width:7px;height:7px;border-radius:50%;background:var(--text-3)}.agent-dot.running[data-v-315604f0]{background:var(--accent)}.agent-name[data-v-315604f0]{flex:none;font-weight:500}.agent-program[data-v-315604f0],.agent-time[data-v-315604f0],.agent-usage[data-v-315604f0]{color:var(--text-3);font-size:12px}.agent-program[data-v-315604f0]{flex:1;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.agent-time[data-v-315604f0]{flex:none}.agent-time.running[data-v-315604f0]{color:var(--accent-text)}.agent-line[data-v-315604f0]{display:flex;gap:8px;align-items:center;min-width:0}.agent-tasks[data-v-315604f0]{display:inline-flex;flex:none;gap:4px;align-items:center;margin-left:auto;padding:1px 8px;border:1px solid var(--border);border-radius:6px;background:var(--surface);color:var(--text-2);font:inherit;font-size:12px;cursor:pointer;pointer-events:auto}.agent-tasks[data-v-315604f0]:hover{background:var(--hover);color:var(--text)}.agent-task[data-v-315604f0]{flex:1;min-width:0;overflow:hidden;color:var(--text-2);font-size:12.5px;white-space:nowrap;text-overflow:ellipsis}.agents[data-v-020b08ce]{display:flex;flex-direction:column;height:100%;min-width:400px;min-height:0}.agents[data-v-020b08ce] .row-list{gap:0}.agents[data-v-020b08ce] .row-list-row{padding:0}.agents-bar[data-v-020b08ce]{display:flex;gap:10px;align-items:center;padding:8px 12px;border-bottom:1px solid var(--border)}.agents-search[data-v-020b08ce]{flex:1;min-width:0}.author[data-v-7c990a80]{color:var(--text-3);font-size:12px;min-width:72px}.text[data-v-7c990a80]{flex:1;white-space:pre-wrap}\n"; document.head.appendChild(style); }
import { openBlock as p, createBlock as l, unref as t, withCtx as u, createElementVNode as o, toDisplayString as r, h as _ } from "vue";
import { useRows as d, RowList as f, useWindow as m } from "@journal/window-kit";
import { _ as h } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
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
}, y = /* @__PURE__ */ h(g, [["__scopeId", "data-v-7c990a80"]]), S = {
  setup() {
    return () => _(y, { line: `agent transcript ${m().agent}` });
  }
};
export {
  S as default
};
