if (!document.getElementById("window-styles-fb2ac60734de")) { const style = document.createElement("style"); style.id = "window-styles-fb2ac60734de"; style.textContent = ".output-dock-inner[data-v-fab8ca3d]{min-height:0;overflow:hidden}.output-dock-state[data-v-fab8ca3d]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-fab8ca3d]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-fab8ca3d .9s linear infinite}@keyframes output-spin-fab8ca3d{to{transform:rotate(360deg)}}.output-dock-pending[data-v-fab8ca3d]{display:inline-flex;align-items:center;flex:none;gap:3px}.output-dock-pending i[data-v-fab8ca3d]{width:4px;height:4px;border-radius:50%;background:var(--text-3);animation:output-pending-fab8ca3d 1.2s ease-in-out infinite}.output-dock-pending i[data-v-fab8ca3d]:nth-child(2){animation-delay:.2s}.output-dock-pending i[data-v-fab8ca3d]:nth-child(3){animation-delay:.4s}@keyframes output-pending-fab8ca3d{0%,60%,to{opacity:.3}30%{opacity:1}}@media(prefers-reduced-motion:reduce){.output-dock-pending i[data-v-fab8ca3d]{animation:none}}.output-dock-title[data-v-fab8ca3d]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-fab8ca3d]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-percent[data-v-fab8ca3d]{flex:none;align-self:center;width:32px;height:4px;margin-right:6px;overflow:hidden;border-radius:2px;background:var(--hover)}.output-dock-percent i[data-v-fab8ca3d]{display:block;height:100%}.output-dock-terminal[data-v-fab8ca3d]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-fab8ca3d]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-fab8ca3d]{height:100%;transition:width .4s ease}.output-dock-box[data-v-fab8ca3d]{position:relative}.output-dock-report[data-v-fab8ca3d]{position:absolute;top:6px;right:14px;display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;padding:0;border:0;border-radius:6px;background:none;color:var(--text-3);cursor:pointer}.output-dock-report[data-v-fab8ca3d]:hover{background:var(--hover);color:var(--text)}.output-dock-loading[data-v-fab8ca3d]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-fab8ca3d]{animation:output-fade-fab8ca3d .22s var(--ease) .32s backwards}@keyframes output-fade-fab8ca3d{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-fab8ca3d]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-8c713a5e]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-8c713a5e]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-8c713a5e]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-8c713a5e]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-8c713a5e]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-6c441eae]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-6c441eae]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-6c441eae],.state.lost[data-v-6c441eae]{color:var(--red, #d4574b)}.line[data-v-6c441eae]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.marks[data-v-6c441eae]{padding:8px 12px;font-size:12px}.marks h3[data-v-6c441eae]{margin:0 0 4px;font-size:12px;color:var(--text-2)}.mark[data-v-6c441eae]{display:flex;gap:8px;margin:2px 0}.why[data-v-6c441eae],.who[data-v-6c441eae],.note[data-v-6c441eae]{flex:none;color:var(--text-3)}button[data-v-6c441eae]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
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
