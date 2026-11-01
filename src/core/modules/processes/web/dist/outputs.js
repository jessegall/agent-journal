/* @code-commandments-generated */
if (!document.getElementById("window-styles-11725465b036")) { const style = document.createElement("style"); style.id = "window-styles-11725465b036"; style.textContent = ".output-dock-more[data-v-6c803a38]{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows var(--move),opacity var(--fade)}.output-dock-more.open[data-v-6c803a38]{grid-template-rows:1fr;opacity:1}.output-dock-inner[data-v-6c803a38]{min-height:0;overflow:hidden}.output-dock-state[data-v-6c803a38]{display:flex;flex:none;justify-content:center;width:16px;color:var(--tone)}.output-dock-label[data-v-6c803a38]{display:flex;flex:1 1 auto;align-items:center;gap:9px;min-width:0;padding:0;border:none;background:none;color:var(--text);font:inherit;font-size:12px;font-weight:500;text-align:left;cursor:pointer}.output-dock-title[data-v-6c803a38]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-6c803a38]{flex:none;color:var(--text-3);font-size:11px;font-variant-numeric:tabular-nums}.output-dock-lines[data-v-6c803a38]{margin:0;padding:0 12px 10px 35px;color:var(--text-3);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;list-style:none;overflow-wrap:anywhere}.output-dock-bar[data-v-6c803a38]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-6c803a38]{height:100%;transition:width .4s ease}.output[data-v-b8e327cd]{display:flex;flex-direction:column;height:100%}.bar[data-v-b8e327cd]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-b8e327cd]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-b8e327cd]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-b8e327cd]{flex:1;margin:0;padding:0 12px 12px;overflow:auto;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-4fca30a0]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-4fca30a0]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-4fca30a0],.state.lost[data-v-4fca30a0]{color:var(--red, #d4574b)}.line[data-v-4fca30a0]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-4fca30a0]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { openBlock as a, createBlock as m, unref as o, withCtx as f, createElementVNode as s, normalizeClass as h, toDisplayString as c, createElementBlock as k, Fragment as C, createCommentVNode as y } from "vue";
import { useWindow as b, useRows as g, RowList as x } from "@journal/window-kit";
import { _ as v } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const w = { class: "run" }, $ = { class: "line" }, B = ["onClick"], N = ["onClick"], R = {
  __name: "Outputs",
  setup(E) {
    const n = b(), { rows: u, failure: i, loaded: r } = g("process feed", ["process.*", "output.*"]), l = (t) => t.state === "running" || t.state === "background", p = (t) => n.run(`output stop ${t.id}`), d = (t) => n.run(`output watch ${t.id}`);
    return (t, O) => (a(), m(o(x), {
      rows: o(u),
      failure: o(i),
      loaded: o(r),
      empty: "No commands yet"
    }, {
      default: f(({ row: e }) => [
        s("div", w, [
          s("span", {
            class: h(["state", e.state])
          }, c(e.state), 3),
          s("span", $, c(e.line), 1),
          l(e) ? (a(), k(C, { key: 0 }, [
            s("button", {
              class: "stop",
              type: "button",
              onClick: (_) => p(e)
            }, "Stop", 8, B),
            s("button", {
              class: "watch",
              type: "button",
              onClick: (_) => d(e)
            }, "Watch", 8, N)
          ], 64)) : y("", !0)
        ])
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, z = /* @__PURE__ */ v(R, [["__scopeId", "data-v-4fca30a0"]]);
export {
  z as default
};
