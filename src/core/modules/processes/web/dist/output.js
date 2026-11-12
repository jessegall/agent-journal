if (!document.getElementById("window-styles-6378533cdb0c")) { const style = document.createElement("style"); style.id = "window-styles-6378533cdb0c"; style.textContent = ".output-dock-inner[data-v-af3fc177]{min-height:0;overflow:hidden}.output-dock-state[data-v-af3fc177]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-af3fc177]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-af3fc177 .9s linear infinite}@keyframes output-spin-af3fc177{to{transform:rotate(360deg)}}.output-dock-pending[data-v-af3fc177]{display:inline-flex;align-items:center;flex:none;gap:3px}.output-dock-pending i[data-v-af3fc177]{width:4px;height:4px;border-radius:50%;background:var(--text-3);animation:output-pending-af3fc177 1.2s ease-in-out infinite}.output-dock-pending i[data-v-af3fc177]:nth-child(2){animation-delay:.2s}.output-dock-pending i[data-v-af3fc177]:nth-child(3){animation-delay:.4s}@keyframes output-pending-af3fc177{0%,60%,to{opacity:.3}30%{opacity:1}}@media(prefers-reduced-motion:reduce){.output-dock-pending i[data-v-af3fc177]{animation:none}}.output-dock-title[data-v-af3fc177]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-af3fc177]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-percent[data-v-af3fc177]{flex:none;align-self:center;width:32px;height:4px;margin-right:6px;overflow:hidden;border-radius:2px;background:var(--hover)}.output-dock-percent i[data-v-af3fc177]{display:block;height:100%}.output-dock-terminal[data-v-af3fc177]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-af3fc177]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-af3fc177]{height:100%;transition:width .4s ease}.output-dock-box[data-v-af3fc177]{position:relative}.output-dock-reader[data-v-af3fc177]{position:absolute;top:6px;right:14px;padding:2px 8px;border:1px solid var(--border-2);border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12px;cursor:pointer}.output-dock-reader[data-v-af3fc177]:hover{background:var(--hover)}.output-dock-marks[data-v-af3fc177]{margin:4px 14px}.output-dock-mark[data-v-af3fc177]{padding:2px 8px;border:1px solid var(--border-2);border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12px;cursor:pointer}.output-dock-mark[data-v-af3fc177]:hover{background:var(--hover)}.output-dock-loading[data-v-af3fc177]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-af3fc177]{animation:output-fade-af3fc177 .22s var(--ease) .32s backwards}@keyframes output-fade-af3fc177{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-af3fc177]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-8c713a5e]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-8c713a5e]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-8c713a5e]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-8c713a5e]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-8c713a5e]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-03b5ad2c]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-03b5ad2c]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-03b5ad2c],.state.lost[data-v-03b5ad2c]{color:var(--red, #d4574b)}.line[data-v-03b5ad2c]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.marks[data-v-03b5ad2c]{padding:8px 12px;font-size:12px}.marks h3[data-v-03b5ad2c]{margin:0 0 4px;font-size:12px;color:var(--text-2)}.mark[data-v-03b5ad2c]{display:flex;gap:8px;margin:2px 0}.why[data-v-03b5ad2c],.who[data-v-03b5ad2c],.note[data-v-03b5ad2c]{flex:none;color:var(--text-3)}button[data-v-03b5ad2c]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as i, onMounted as k, openBlock as u, createBlock as n, unref as a, withCtx as y, createElementBlock as x, createElementVNode as c, toDisplayString as _, createCommentVNode as O } from "vue";
import { useWindow as b, useOutputPages as E, readOutputProp as N, WindowRoom as P, EmptyState as R, OutputLines as S, AutoScrollPane as W } from "@journal/window-kit";
import { _ as B } from "./RunButtons-DurAB3P9.js";
import { _ as C } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const $ = {
  key: 1,
  class: "output"
}, I = { class: "bar" }, K = { class: "line" }, L = {
  class: "text",
  "data-output-text": ""
}, V = {
  __name: "Output",
  setup(j) {
    const e = b(), t = i(Number(new URLSearchParams(location.search).get("output")) || 0), l = i(null), p = i([]), o = i(!1), s = E(N(e), () => t.value), g = () => l.value !== null && (l.value.state === "running" || l.value.state === "background");
    async function d() {
      var m, w;
      if (t.value || (await e.reload("selection"), t.value = ((m = e.props.selection.data.value) == null ? void 0 : m.value) || 0), t.value || (e.agent != null && (e.state["latest.session-agent-id"] = e.agent), await e.reload("latest"), t.value = ((w = e.props.latest.rows.value[0]) == null ? void 0 : w.id) || 0), !t.value) return;
      const r = `run.${t.value}`, v = `summary.${t.value}`;
      if (await e.reload(o.value ? r : [r, v]), l.value = e.props[r].rows.value[0] ?? null, o.value) {
        await s.follow();
        return;
      }
      const f = e.props[v];
      p.value = f.failure.value ? [f.failure.value] : f.data.value.lines;
    }
    async function h() {
      o.value = !o.value, await d();
    }
    return e.follow(["process.*", "output.*"], d), k(d), (r, v) => (u(), n(a(P), null, {
      default: y(() => [
        t.value ? (u(), x("div", $, [
          c("div", I, [
            c("span", K, _(l.value ? l.value.line : ""), 1),
            c("button", {
              class: "whole",
              type: "button",
              onClick: h
            }, _(o.value ? "Reader lines" : "Whole output"), 1),
            g() ? (u(), n(B, {
              key: 0,
              "process-id": t.value
            }, null, 8, ["process-id"])) : O("", !0)
          ]),
          o.value ? (u(), n(a(S), {
            key: 0,
            class: "text",
            "data-output-text": "",
            lines: a(s).lines.value,
            feed: a(s).feed,
            onOlder: a(s).loadEarlier
          }, null, 8, ["lines", "feed", "onOlder"])) : (u(), n(a(W), {
            key: 1,
            "row-count": p.value.length
          }, {
            default: y(() => [
              c("pre", L, _(p.value.join(`
`)), 1)
            ]),
            _: 1
          }, 8, ["row-count"]))
        ])) : (u(), n(a(R), {
          key: 0,
          title: "No output yet"
        }))
      ]),
      _: 1
    }));
  }
}, q = /* @__PURE__ */ C(V, [["__scopeId", "data-v-8c713a5e"]]);
export {
  q as default
};
