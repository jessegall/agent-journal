/* @code-commandments-generated */
if (!document.getElementById("window-styles-26ab06aeb8d4")) { const style = document.createElement("style"); style.id = "window-styles-26ab06aeb8d4"; style.textContent = ".output-dock-more[data-v-5c485026]{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows var(--move),opacity var(--fade)}.output-dock-more.open[data-v-5c485026]{grid-template-rows:1fr;opacity:1}.output-dock-inner[data-v-5c485026]{min-height:0;overflow:hidden}.output-dock-state[data-v-5c485026]{display:flex;flex:none;justify-content:center;width:16px;color:var(--tone)}.output-dock-label[data-v-5c485026]{display:flex;flex:1 1 auto;align-items:center;gap:9px;min-width:0;padding:0;border:none;background:none;color:var(--text);font:inherit;font-size:12px;font-weight:500;text-align:left;cursor:pointer}.output-dock-title[data-v-5c485026]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-5c485026]{flex:none;color:var(--text-3);font-size:11px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-5c485026]{overflow:auto;max-height:280px;margin:0 12px 10px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-5c485026]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-5c485026]{height:100%;transition:width .4s ease}.output[data-v-7e18ff9e]{display:flex;flex-direction:column;height:100%}.bar[data-v-7e18ff9e]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-7e18ff9e]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-7e18ff9e]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-7e18ff9e]{flex:1;margin:0;padding:0 12px 12px;overflow:auto;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-94f15063]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-94f15063]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-94f15063],.state.lost[data-v-94f15063]{color:var(--red, #d4574b)}.line[data-v-94f15063]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-94f15063]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { openBlock as c, createElementBlock as i, Fragment as u, createVNode as l, unref as e, withCtx as k, createElementVNode as o, normalizeClass as w, toDisplayString as r, createCommentVNode as C } from "vue";
import { useWindow as v, useRows as y, useListTools as b, ListTools as x, RowList as N } from "@journal/window-kit";
import { _ as $ } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const L = { class: "run" }, O = { class: "line" }, R = ["onClick"], T = ["onClick"], V = {
  __name: "Outputs",
  setup(B) {
    const a = v(), { rows: p, failure: d, loaded: _ } = y("process feed", ["process.*", "output.*"]), n = b(p, { title: (t) => t.line, isOpen: (t) => t.state === "running" }), h = (t) => t.state === "running" || t.state === "background", m = (t) => a.run(`output stop ${t.id}`), f = (t) => a.run(`output watch ${t.id}`);
    return (t, E) => (c(), i(u, null, [
      l(e(x), { tools: e(n) }, null, 8, ["tools"]),
      l(e(N), {
        rows: e(n).shown.value,
        failure: e(d),
        loaded: e(_),
        empty: "No commands yet",
        hint: "The commands an agent runs show here, each with its output.",
        searching: e(n).filtering.value
      }, {
        default: k(({ row: s }) => [
          o("div", L, [
            o("span", {
              class: w(["state", s.state])
            }, r(s.state), 3),
            o("span", O, r(s.line), 1),
            h(s) ? (c(), i(u, { key: 0 }, [
              o("button", {
                class: "stop",
                type: "button",
                onClick: (g) => m(s)
              }, "Stop", 8, R),
              o("button", {
                class: "watch",
                type: "button",
                onClick: (g) => f(s)
              }, "Watch", 8, T)
            ], 64)) : C("", !0)
          ])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded", "searching"])
    ], 64));
  }
}, D = /* @__PURE__ */ $(V, [["__scopeId", "data-v-94f15063"]]);
export {
  D as default
};
