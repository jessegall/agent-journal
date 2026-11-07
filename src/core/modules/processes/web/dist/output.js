/* @code-commandments-generated */
if (!document.getElementById("window-styles-8b181c01f7c5")) { const style = document.createElement("style"); style.id = "window-styles-8b181c01f7c5"; style.textContent = ".output-dock-inner[data-v-0d0e1b9d]{min-height:0;overflow:hidden}.output-dock-state[data-v-0d0e1b9d]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-0d0e1b9d]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-0d0e1b9d .9s linear infinite}@keyframes output-spin-0d0e1b9d{to{transform:rotate(360deg)}}.output-dock-pending[data-v-0d0e1b9d]{display:inline-flex;align-items:center;flex:none;gap:3px}.output-dock-pending i[data-v-0d0e1b9d]{width:4px;height:4px;border-radius:50%;background:var(--text-3);animation:output-pending-0d0e1b9d 1.2s ease-in-out infinite}.output-dock-pending i[data-v-0d0e1b9d]:nth-child(2){animation-delay:.2s}.output-dock-pending i[data-v-0d0e1b9d]:nth-child(3){animation-delay:.4s}@keyframes output-pending-0d0e1b9d{0%,60%,to{opacity:.3}30%{opacity:1}}@media(prefers-reduced-motion:reduce){.output-dock-pending i[data-v-0d0e1b9d]{animation:none}}.output-dock-title[data-v-0d0e1b9d]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-0d0e1b9d]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-0d0e1b9d]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-0d0e1b9d]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-0d0e1b9d]{height:100%;transition:width .4s ease}.output-dock-loading[data-v-0d0e1b9d]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-0d0e1b9d]{animation:output-fade-0d0e1b9d .22s var(--ease) .32s backwards}@keyframes output-fade-0d0e1b9d{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-0d0e1b9d]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-842ed818]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-842ed818]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-842ed818]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-842ed818]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-842ed818]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-393a83e0]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-393a83e0]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-393a83e0],.state.lost[data-v-393a83e0]{color:var(--red, #d4574b)}.line[data-v-393a83e0]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-393a83e0]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as r, onMounted as k, openBlock as o, createBlock as n, unref as u, withCtx as y, createElementBlock as x, createElementVNode as i, toDisplayString as f, createCommentVNode as O } from "vue";
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
    const e = b(), t = r(Number(new URLSearchParams(location.search).get("output")) || 0), a = r(null), c = r([]), l = r(!1), p = E(N(e), () => t.value), g = () => a.value !== null && (a.value.state === "running" || a.value.state === "background");
    async function d() {
      var m, w;
      if (t.value || (await e.reload("selection"), t.value = ((m = e.props.selection.data.value) == null ? void 0 : m.value) || 0), t.value || (e.agent != null && (e.state["latest.session-agent-id"] = e.agent), await e.reload("latest"), t.value = ((w = e.props.latest.rows.value[0]) == null ? void 0 : w.id) || 0), !t.value) return;
      const s = `run.${t.value}`, v = `summary.${t.value}`;
      if (await e.reload(l.value ? s : [s, v]), a.value = e.props[s].rows.value[0] ?? null, l.value) {
        await p.follow();
        return;
      }
      const _ = e.props[v];
      c.value = _.failure.value ? [_.failure.value] : _.data.value.lines;
    }
    async function h() {
      l.value = !l.value, await d();
    }
    return e.follow(["process.*", "output.*"], d), k(d), (s, v) => (o(), n(u(P), null, {
      default: y(() => [
        t.value ? (o(), x("div", $, [
          i("div", I, [
            i("span", K, f(a.value ? a.value.line : ""), 1),
            i("button", {
              class: "whole",
              type: "button",
              onClick: h
            }, f(l.value ? "Reader lines" : "Whole output"), 1),
            g() ? (o(), n(B, {
              key: 0,
              "process-id": t.value
            }, null, 8, ["process-id"])) : O("", !0)
          ]),
          l.value ? (o(), n(u(S), {
            key: 0,
            class: "text",
            "data-output-text": "",
            lines: u(p).lines.value,
            onOlder: u(p).loadEarlier
          }, null, 8, ["lines", "onOlder"])) : (o(), n(u(W), {
            key: 1,
            "row-count": c.value.length
          }, {
            default: y(() => [
              i("pre", L, f(c.value.join(`
`)), 1)
            ]),
            _: 1
          }, 8, ["row-count"]))
        ])) : (o(), n(u(R), {
          key: 0,
          title: "No output yet"
        }))
      ]),
      _: 1
    }));
  }
}, q = /* @__PURE__ */ C(V, [["__scopeId", "data-v-842ed818"]]);
export {
  q as default
};
