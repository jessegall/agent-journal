/* @code-commandments-generated */
if (!document.getElementById("window-styles-8a6775381693")) { const style = document.createElement("style"); style.id = "window-styles-8a6775381693"; style.textContent = ".output-dock-inner[data-v-e2f87056]{min-height:0;overflow:hidden}.output-dock-state[data-v-e2f87056]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-e2f87056]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-e2f87056 .9s linear infinite}@keyframes output-spin-e2f87056{to{transform:rotate(360deg)}}.output-dock-pending[data-v-e2f87056]{display:inline-flex;align-items:center;flex:none;gap:3px}.output-dock-pending i[data-v-e2f87056]{width:4px;height:4px;border-radius:50%;background:var(--text-3);animation:output-pending-e2f87056 1.2s ease-in-out infinite}.output-dock-pending i[data-v-e2f87056]:nth-child(2){animation-delay:.2s}.output-dock-pending i[data-v-e2f87056]:nth-child(3){animation-delay:.4s}@keyframes output-pending-e2f87056{0%,60%,to{opacity:.3}30%{opacity:1}}@media(prefers-reduced-motion:reduce){.output-dock-pending i[data-v-e2f87056]{animation:none}}.output-dock-title[data-v-e2f87056]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-e2f87056]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-percent[data-v-e2f87056]{flex:none;align-self:center;width:32px;height:4px;margin-right:6px;overflow:hidden;border-radius:2px;background:var(--hover)}.output-dock-percent i[data-v-e2f87056]{display:block;height:100%;background:var(--text-3)}.output-dock-terminal[data-v-e2f87056]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-e2f87056]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-e2f87056]{height:100%;transition:width .4s ease}.output-dock-box[data-v-e2f87056]{position:relative}.output-dock-reader[data-v-e2f87056]{position:absolute;top:6px;right:14px;padding:2px 8px;border:1px solid var(--border-2);border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12px;cursor:pointer}.output-dock-reader[data-v-e2f87056]:hover{background:var(--hover)}.output-dock-loading[data-v-e2f87056]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-e2f87056]{animation:output-fade-e2f87056 .22s var(--ease) .32s backwards}@keyframes output-fade-e2f87056{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-e2f87056]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-6f238ea7]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-6f238ea7]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-6f238ea7]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-6f238ea7]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-6f238ea7]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-cd6ac8a9]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-cd6ac8a9]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-cd6ac8a9],.state.lost[data-v-cd6ac8a9]{color:var(--red, #d4574b)}.line[data-v-cd6ac8a9]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-cd6ac8a9]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { openBlock as i, createBlock as r, unref as t, withCtx as l, createVNode as c, createElementVNode as a, normalizeClass as f, toDisplayString as u, createCommentVNode as g } from "vue";
import { useWindow as h, useListTools as x, WindowRoom as y, ListTools as k, RowList as v, stateLabel as w } from "@journal/window-kit";
import { _ as C } from "./RunButtons-DurAB3P9.mjs";
import { _ as L } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const N = { class: "run" }, b = { class: "line" }, O = {
  __name: "Outputs",
  setup(R) {
    const n = h();
    n.agent != null && (n.state["runs.session-agent-id"] = n.agent);
    const { rows: d, failure: p, loaded: _ } = n.props.runs, o = x(d, { title: (e) => e.line, isOpen: (e) => e.state === "running" }), m = (e) => e.state === "running" || e.state === "background";
    return (e, V) => (i(), r(t(y), null, {
      default: l(() => [
        c(t(k), { tools: t(o) }, null, 8, ["tools"]),
        c(t(v), {
          rows: t(o).shown.value,
          failure: t(p),
          loaded: t(_),
          empty: "No commands yet",
          hint: "Commands run by an agent appear here with their output.",
          searching: t(o).filtering.value
        }, {
          default: l(({ row: s }) => [
            a("div", N, [
              a("span", {
                class: f(["state", s.state])
              }, u(t(w)("process", s.state)), 3),
              a("span", b, u(s.line), 1),
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
}, D = /* @__PURE__ */ L(O, [["__scopeId", "data-v-cd6ac8a9"]]);
export {
  D as default
};
