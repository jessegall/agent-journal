/* @code-commandments-generated */
if (!document.getElementById("window-styles-33df0b12fa2a")) { const style = document.createElement("style"); style.id = "window-styles-33df0b12fa2a"; style.textContent = ".output-dock-more[data-v-8ed4ef84]{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows var(--move),opacity var(--fade)}.output-dock-more.open[data-v-8ed4ef84]{grid-template-rows:1fr;opacity:1}.output-dock-inner[data-v-8ed4ef84]{min-height:0;overflow:hidden}.output-dock-state[data-v-8ed4ef84]{display:flex;flex:none;justify-content:center;width:16px;color:var(--tone)}.output-dock-label[data-v-8ed4ef84]{display:flex;flex:1 1 auto;align-items:center;gap:9px;min-width:0;padding:0;border:none;background:none;color:var(--text);font:inherit;font-size:12px;font-weight:500;text-align:left;cursor:pointer}.output-dock-title[data-v-8ed4ef84]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-8ed4ef84]{flex:none;color:var(--text-3);font-size:11px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-8ed4ef84]{overflow:auto;max-height:280px;margin:0 12px 10px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-8ed4ef84]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-8ed4ef84]{height:100%;transition:width .4s ease}.output[data-v-7e24d4df]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-7e24d4df]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-7e24d4df]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-7e24d4df]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-7e24d4df]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-f3235ed9]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-f3235ed9]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-f3235ed9],.state.lost[data-v-f3235ed9]{color:var(--red, #d4574b)}.line[data-v-f3235ed9]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-f3235ed9]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { openBlock as c, createBlock as g, unref as e, withCtx as i, createVNode as l, createElementVNode as o, normalizeClass as k, toDisplayString as u, createElementBlock as w, Fragment as C, createCommentVNode as v } from "vue";
import { useWindow as y, useRows as b, useListTools as x, WindowRoom as $, ListTools as N, RowList as R } from "@journal/window-kit";
import { _ as B } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const L = { class: "run" }, O = { class: "line" }, T = ["onClick"], V = ["onClick"], W = {
  __name: "Outputs",
  setup(E) {
    const n = y(), { rows: r, failure: d, loaded: p } = b(n.agent == null ? "process feed" : `process feed --agent-id ${n.agent}`, ["process.*", "output.*"]), a = x(r, { title: (t) => t.line, isOpen: (t) => t.state === "running" }), _ = (t) => t.state === "running" || t.state === "background", m = (t) => n.run(`output stop ${t.id}`), h = (t) => n.run(`output watch ${t.id}`);
    return (t, S) => (c(), g(e($), null, {
      default: i(() => [
        l(e(N), { tools: e(a) }, null, 8, ["tools"]),
        l(e(R), {
          rows: e(a).shown.value,
          failure: e(d),
          loaded: e(p),
          empty: "No commands yet",
          hint: "The commands an agent runs show here, each with its output.",
          searching: e(a).filtering.value
        }, {
          default: i(({ row: s }) => [
            o("div", L, [
              o("span", {
                class: k(["state", s.state])
              }, u(s.state), 3),
              o("span", O, u(s.line), 1),
              _(s) ? (c(), w(C, { key: 0 }, [
                o("button", {
                  class: "stop",
                  type: "button",
                  onClick: (f) => m(s)
                }, "Stop", 8, T),
                o("button", {
                  class: "watch",
                  type: "button",
                  onClick: (f) => h(s)
                }, "Watch", 8, V)
              ], 64)) : v("", !0)
            ])
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "searching"])
      ]),
      _: 1
    }));
  }
}, I = /* @__PURE__ */ B(W, [["__scopeId", "data-v-f3235ed9"]]);
export {
  I as default
};
