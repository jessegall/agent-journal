/* @code-commandments-generated */
if (!document.getElementById("window-styles-7bbc0bf8a15e")) { const style = document.createElement("style"); style.id = "window-styles-7bbc0bf8a15e"; style.textContent = ".output-dock-more[data-v-69af4745]{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows var(--move),opacity var(--fade)}.output-dock-more.open[data-v-69af4745]{grid-template-rows:1fr;opacity:1}.output-dock-inner[data-v-69af4745]{min-height:0;overflow:hidden}.output-dock-state[data-v-69af4745]{display:flex;flex:none;justify-content:center;width:16px;color:var(--tone)}.output-dock-label[data-v-69af4745]{display:flex;flex:1 1 auto;align-items:center;gap:9px;min-width:0;padding:0;border:none;background:none;color:var(--text);font:inherit;font-size:12px;font-weight:500;text-align:left;cursor:pointer}.output-dock-title[data-v-69af4745]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-69af4745]{flex:none;color:var(--text-3);font-size:11px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-69af4745]{overflow:auto;max-height:280px;margin:0 12px 10px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-69af4745]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-69af4745]{height:100%;transition:width .4s ease}.output[data-v-7e18ff9e]{display:flex;flex-direction:column;height:100%}.bar[data-v-7e18ff9e]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-7e18ff9e]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-7e18ff9e]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-7e18ff9e]{flex:1;margin:0;padding:0 12px 12px;overflow:auto;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-454d324c]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-454d324c]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-454d324c],.state.lost[data-v-454d324c]{color:var(--red, #d4574b)}.line[data-v-454d324c]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-454d324c]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { openBlock as c, createElementBlock as l, Fragment as u, createVNode as i, unref as s, withCtx as C, createElementVNode as o, normalizeClass as g, toDisplayString as r, createCommentVNode as y } from "vue";
import { useWindow as b, useRows as v, useListTools as w, ListTools as x, RowList as N } from "@journal/window-kit";
import { _ as $ } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const L = { class: "run" }, O = { class: "line" }, R = ["onClick"], S = ["onClick"], V = {
  __name: "Outputs",
  setup(B) {
    const n = b(), { rows: p, failure: d, loaded: _ } = v("process feed", ["process.*", "output.*"]), a = w(p, { title: (t) => t.line, isOpen: (t) => t.state === "running" }), m = (t) => t.state === "running" || t.state === "background", h = (t) => n.run(`output stop ${t.id}`), f = (t) => n.run(`output watch ${t.id}`);
    return (t, E) => (c(), l(u, null, [
      i(s(x), {
        tools: s(a),
        placeholder: "Search the commands"
      }, null, 8, ["tools"]),
      i(s(N), {
        rows: s(a).shown.value,
        failure: s(d),
        loaded: s(_),
        empty: "No commands yet"
      }, {
        default: C(({ row: e }) => [
          o("div", L, [
            o("span", {
              class: g(["state", e.state])
            }, r(e.state), 3),
            o("span", O, r(e.line), 1),
            m(e) ? (c(), l(u, { key: 0 }, [
              o("button", {
                class: "stop",
                type: "button",
                onClick: (k) => h(e)
              }, "Stop", 8, R),
              o("button", {
                class: "watch",
                type: "button",
                onClick: (k) => f(e)
              }, "Watch", 8, S)
            ], 64)) : y("", !0)
          ])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ], 64));
  }
}, D = /* @__PURE__ */ $(V, [["__scopeId", "data-v-454d324c"]]);
export {
  D as default
};
