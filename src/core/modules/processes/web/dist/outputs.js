/* @code-commandments-generated */
if (!document.getElementById("window-styles-6e9cf5b5bc32")) { const style = document.createElement("style"); style.id = "window-styles-6e9cf5b5bc32"; style.textContent = ".output-dock-inner[data-v-bdda9a8e]{min-height:0;overflow:hidden}.output-dock-state[data-v-bdda9a8e]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-bdda9a8e]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-bdda9a8e .9s linear infinite}@keyframes output-spin-bdda9a8e{to{transform:rotate(360deg)}}.output-dock-pending[data-v-bdda9a8e]{display:inline-flex;align-items:center;flex:none;gap:3px}.output-dock-pending i[data-v-bdda9a8e]{width:4px;height:4px;border-radius:50%;background:var(--text-3);animation:output-pending-bdda9a8e 1.2s ease-in-out infinite}.output-dock-pending i[data-v-bdda9a8e]:nth-child(2){animation-delay:.2s}.output-dock-pending i[data-v-bdda9a8e]:nth-child(3){animation-delay:.4s}@keyframes output-pending-bdda9a8e{0%,60%,to{opacity:.3}30%{opacity:1}}@media(prefers-reduced-motion:reduce){.output-dock-pending i[data-v-bdda9a8e]{animation:none}}.output-dock-title[data-v-bdda9a8e]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-bdda9a8e]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-bdda9a8e]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-bdda9a8e]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-bdda9a8e]{height:100%;transition:width .4s ease}.output-dock-loading[data-v-bdda9a8e]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-bdda9a8e]{animation:output-fade-bdda9a8e .22s var(--ease) .32s backwards}@keyframes output-fade-bdda9a8e{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-bdda9a8e]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-b96e6f29]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-b96e6f29]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-b96e6f29]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-b96e6f29]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-b96e6f29]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-35b69091]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-35b69091]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-35b69091],.state.lost[data-v-35b69091]{color:var(--red, #d4574b)}.line[data-v-35b69091]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-35b69091]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { openBlock as i, createBlock as r, unref as e, withCtx as l, createVNode as c, createElementVNode as n, normalizeClass as f, toDisplayString as u, createCommentVNode as g } from "vue";
import { useWindow as h, useRows as w, useListTools as x, WindowRoom as y, ListTools as b, RowList as k, stateLabel as v } from "@journal/window-kit";
import { _ as C } from "./RunButtons-DurAB3P9.js";
import { _ as L } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const N = { class: "run" }, R = { class: "line" }, O = {
  __name: "Outputs",
  setup(V) {
    const a = h(), { rows: d, failure: p, loaded: _ } = w(a.agent == null ? "process feed" : `process feed --session-agent-id ${a.agent}`, ["process.*", "output.*"]), o = x(d, { title: (t) => t.line, isOpen: (t) => t.state === "running" }), m = (t) => t.state === "running" || t.state === "background";
    return (t, B) => (i(), r(e(y), null, {
      default: l(() => [
        c(e(b), { tools: e(o) }, null, 8, ["tools"]),
        c(e(k), {
          rows: e(o).shown.value,
          failure: e(p),
          loaded: e(_),
          empty: "No commands yet",
          hint: "Commands run by an agent appear here with their output.",
          searching: e(o).filtering.value
        }, {
          default: l(({ row: s }) => [
            n("div", N, [
              n("span", {
                class: f(["state", s.state])
              }, u(e(v)("process", s.state)), 3),
              n("span", R, u(s.line), 1),
              m(s) ? (i(), r(C, {
                key: 0,
                "process-id": s.id
              }, null, 8, ["process-id"])) : g("", !0)
            ])
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "searching"])
      ]),
      _: 1
    }));
  }
}, D = /* @__PURE__ */ L(O, [["__scopeId", "data-v-35b69091"]]);
export {
  D as default
};
