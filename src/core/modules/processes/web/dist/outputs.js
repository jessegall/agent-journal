/* @code-commandments-generated */
if (!document.getElementById("window-styles-b96ce100613a")) { const style = document.createElement("style"); style.id = "window-styles-b96ce100613a"; style.textContent = ".output-dock-inner[data-v-ce35fbc4]{min-height:0;overflow:hidden}.output-dock-state[data-v-ce35fbc4]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-ce35fbc4]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-ce35fbc4 .9s linear infinite}@keyframes output-spin-ce35fbc4{to{transform:rotate(360deg)}}.output-dock-pending[data-v-ce35fbc4]{display:inline-flex;align-items:center;flex:none;gap:3px}.output-dock-pending i[data-v-ce35fbc4]{width:4px;height:4px;border-radius:50%;background:var(--text-3);animation:output-pending-ce35fbc4 1.2s ease-in-out infinite}.output-dock-pending i[data-v-ce35fbc4]:nth-child(2){animation-delay:.2s}.output-dock-pending i[data-v-ce35fbc4]:nth-child(3){animation-delay:.4s}@keyframes output-pending-ce35fbc4{0%,60%,to{opacity:.3}30%{opacity:1}}@media(prefers-reduced-motion:reduce){.output-dock-pending i[data-v-ce35fbc4]{animation:none}}.output-dock-title[data-v-ce35fbc4]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-ce35fbc4]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-ce35fbc4]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-ce35fbc4]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-ce35fbc4]{height:100%;transition:width .4s ease}.output-dock-loading[data-v-ce35fbc4]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-ce35fbc4]{animation:output-fade-ce35fbc4 .22s var(--ease) .32s backwards}@keyframes output-fade-ce35fbc4{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-ce35fbc4]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-97d5a832]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-97d5a832]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-97d5a832]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-97d5a832]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-97d5a832]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-4486ac26]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-4486ac26]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-4486ac26],.state.lost[data-v-4486ac26]{color:var(--red, #d4574b)}.line[data-v-4486ac26]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-4486ac26]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { openBlock as c, createBlock as g, unref as e, withCtx as l, createVNode as i, createElementVNode as o, normalizeClass as k, toDisplayString as u, createElementBlock as C, Fragment as b, createCommentVNode as w } from "vue";
import { useWindow as y, useRows as v, useListTools as x, WindowRoom as $, ListTools as L, RowList as N, stateLabel as R } from "@journal/window-kit";
import { _ as B } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const O = { class: "run" }, V = { class: "line" }, W = ["onClick"], E = ["onClick"], S = {
  __name: "Outputs",
  setup(T) {
    const n = y(), { rows: r, failure: p, loaded: d } = v(n.agent == null ? "process feed" : `process feed --agent-id ${n.agent}`, ["process.*", "output.*"]), a = x(r, { title: (t) => t.line, isOpen: (t) => t.state === "running" }), _ = (t) => t.state === "running" || t.state === "background", m = (t) => n.run(`output stop ${t.id}`), h = (t) => n.run(`output watch ${t.id}`);
    return (t, z) => (c(), g(e($), null, {
      default: l(() => [
        i(e(L), { tools: e(a) }, null, 8, ["tools"]),
        i(e(N), {
          rows: e(a).shown.value,
          failure: e(p),
          loaded: e(d),
          empty: "No commands yet",
          hint: "Commands run by an agent appear here with their output.",
          searching: e(a).filtering.value
        }, {
          default: l(({ row: s }) => [
            o("div", O, [
              o("span", {
                class: k(["state", s.state])
              }, u(e(R)("process", s.state)), 3),
              o("span", V, u(s.line), 1),
              _(s) ? (c(), C(b, { key: 0 }, [
                o("button", {
                  class: "stop",
                  type: "button",
                  onClick: (f) => m(s)
                }, "Stop", 8, W),
                o("button", {
                  class: "watch",
                  type: "button",
                  onClick: (f) => h(s)
                }, "Watch", 8, E)
              ], 64)) : w("", !0)
            ])
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded", "searching"])
      ]),
      _: 1
    }));
  }
}, j = /* @__PURE__ */ B(S, [["__scopeId", "data-v-4486ac26"]]);
export {
  j as default
};
