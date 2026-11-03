/* @code-commandments-generated */
if (!document.getElementById("window-styles-6590cf667b96")) { const style = document.createElement("style"); style.id = "window-styles-6590cf667b96"; style.textContent = ".agent-card[data-v-a04d392c]{position:relative;display:flex;flex:1;flex-direction:column;gap:3px;min-width:0;padding:9px 22px 9px 12px;border-bottom:1px solid var(--border);cursor:pointer}.agent-card[aria-expanded=false][data-v-a04d392c]:hover{background:var(--hover)}.agent-head[data-v-a04d392c],.agent-line[data-v-a04d392c]{display:flex;gap:8px;align-items:center;min-width:0}.agent-dot[data-v-a04d392c]{flex:none;width:7px;height:7px;border-radius:50%;background:var(--accent)}.agent-dot[data-state=closed][data-v-a04d392c]{background:var(--text-3)}.agent-dot[data-state=waiting][data-v-a04d392c]{background:var(--paused)}.agent-dot[data-state=blocked][data-v-a04d392c]{background:var(--blocking)}.agent-title[data-v-a04d392c]{flex:none;max-width:60%;overflow:hidden;font-size:13px;font-weight:500;white-space:nowrap;text-overflow:ellipsis}.agent-name[data-v-a04d392c]{flex:1;min-width:0;overflow:hidden;color:var(--text-3);font-size:12px;white-space:nowrap;text-overflow:ellipsis}.agent-time[data-v-a04d392c],.agent-identity[data-v-a04d392c],.agent-usage[data-v-a04d392c],.agent-label[data-v-a04d392c]{color:var(--text-3);font-size:12px}.agent-time[data-v-a04d392c]{flex:none;margin-left:auto;font-variant-numeric:tabular-nums}.agent-chevron[data-v-a04d392c]{position:absolute;top:11px;right:6px;color:var(--text-3);opacity:0}.agent-card:hover .agent-chevron[data-v-a04d392c]{opacity:1}.agent-chevron.opened[data-v-a04d392c]{transform:rotate(180deg)}.agent-line[data-v-a04d392c]{padding-left:15px}.agent-command[data-v-a04d392c]{display:flex;min-width:0;padding-left:15px}.agent-identity[data-v-a04d392c]{flex:1;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.agent-tasks[data-v-a04d392c]{flex:none;color:var(--text-2);font-size:12px}.agent-section-count[data-v-a04d392c]{margin-left:2px}.agent-task[data-v-a04d392c]{display:flex;gap:8px;align-items:center;min-width:0;padding:3px 4px;border:0;border-radius:4px;background:none;color:var(--text-2);font:inherit;font-size:12.5px;text-align:left;cursor:pointer}.agent-task[data-v-a04d392c]:hover{background:var(--hover);color:var(--text)}.agent-task-number[data-v-a04d392c]{flex:none;color:var(--text-3);font-variant-numeric:tabular-nums}.agent-task-title[data-v-a04d392c]{flex:1;min-width:0;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.agent-more[data-v-a04d392c]{display:flex;flex-direction:column;gap:6px;padding:6px 0 2px 15px;cursor:default}.agent-usage-line[data-v-a04d392c]{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between}.agent-label[data-v-a04d392c]{margin:0}.agent-instruction[data-v-a04d392c]{max-height:240px;padding:0 0 20px 10px;overflow-y:auto;border-left:2px solid var(--border-2);color:var(--text-2);font-size:12.5px;line-height:1.5;white-space:pre-wrap;-webkit-mask-image:linear-gradient(to bottom,#000 calc(100% - 16px),transparent);mask-image:linear-gradient(to bottom,#000 calc(100% - 16px),transparent)}.agents[data-v-14c6d427]{display:flex;flex-direction:column;height:100%;min-width:400px;min-height:0}.agents[data-v-14c6d427] .row-list{gap:0}.agents[data-v-14c6d427] .row-list-row{padding:0}.agents-bar[data-v-14c6d427]{display:flex;gap:10px;align-items:center;padding:8px 12px;border-bottom:1px solid var(--border)}.agents-search[data-v-14c6d427]{flex:1;min-width:0}.author[data-v-f34e0cbb]{color:var(--text-3);font-size:12px;min-width:72px}.text[data-v-f34e0cbb]{flex:1;white-space:pre-wrap}\n"; document.head.appendChild(style); }
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
