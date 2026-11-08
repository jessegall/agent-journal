/* @code-commandments-generated */
if (!document.getElementById("window-styles-fc33da3f0cfc")) { const style = document.createElement("style"); style.id = "window-styles-fc33da3f0cfc"; style.textContent = ".output-dock-inner[data-v-4818e320]{min-height:0;overflow:hidden}.output-dock-state[data-v-4818e320]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-4818e320]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-4818e320 .9s linear infinite}@keyframes output-spin-4818e320{to{transform:rotate(360deg)}}.output-dock-pending[data-v-4818e320]{display:inline-flex;align-items:center;flex:none;gap:3px}.output-dock-pending i[data-v-4818e320]{width:4px;height:4px;border-radius:50%;background:var(--text-3);animation:output-pending-4818e320 1.2s ease-in-out infinite}.output-dock-pending i[data-v-4818e320]:nth-child(2){animation-delay:.2s}.output-dock-pending i[data-v-4818e320]:nth-child(3){animation-delay:.4s}@keyframes output-pending-4818e320{0%,60%,to{opacity:.3}30%{opacity:1}}@media(prefers-reduced-motion:reduce){.output-dock-pending i[data-v-4818e320]{animation:none}}.output-dock-title[data-v-4818e320]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-4818e320]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-percent[data-v-4818e320]{flex:none;margin-right:6px;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-4818e320]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-4818e320]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-4818e320]{height:100%;transition:width .4s ease}.output-dock-box[data-v-4818e320]{position:relative}.output-dock-reader[data-v-4818e320]{position:absolute;top:6px;right:14px;padding:2px 8px;border:1px solid var(--border-2);border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12px;cursor:pointer}.output-dock-reader[data-v-4818e320]:hover{background:var(--hover)}.output-dock-loading[data-v-4818e320]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-4818e320]{animation:output-fade-4818e320 .22s var(--ease) .32s backwards}@keyframes output-fade-4818e320{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-4818e320]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-8c713a5e]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-8c713a5e]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-8c713a5e]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-8c713a5e]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-8c713a5e]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-393a83e0]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-393a83e0]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-393a83e0],.state.lost[data-v-393a83e0]{color:var(--red, #d4574b)}.line[data-v-393a83e0]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-393a83e0]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { openBlock as i, createBlock as r, unref as t, withCtx as l, createVNode as u, createElementVNode as a, normalizeClass as f, toDisplayString as c, createCommentVNode as g } from "vue";
import { useWindow as h, useListTools as x, WindowRoom as y, ListTools as k, RowList as v, stateLabel as w } from "@journal/window-kit";
import { _ as C } from "./RunButtons-DurAB3P9.js";
import { _ as L } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const N = { class: "run" }, b = { class: "line" }, O = {
  __name: "Outputs",
  setup(R) {
    const n = h();
    n.agent != null && (n.state["runs.session-agent-id"] = n.agent);
    const { rows: d, failure: p, loaded: _ } = n.props.runs, o = x(d, { title: (e) => e.line, isOpen: (e) => e.state === "running" }), m = (e) => e.state === "running" || e.state === "background";
    return (e, V) => (i(), r(t(y), null, {
      default: l(() => [
        u(t(k), { tools: t(o) }, null, 8, ["tools"]),
        u(t(v), {
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
              }, c(t(w)("process", s.state)), 3),
              a("span", b, c(s.line), 1),
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
}, D = /* @__PURE__ */ L(O, [["__scopeId", "data-v-393a83e0"]]);
export {
  D as default
};
