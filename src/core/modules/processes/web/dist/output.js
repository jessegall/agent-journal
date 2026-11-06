/* @code-commandments-generated */
if (!document.getElementById("window-styles-6e9cf5b5bc32")) { const style = document.createElement("style"); style.id = "window-styles-6e9cf5b5bc32"; style.textContent = ".output-dock-inner[data-v-bdda9a8e]{min-height:0;overflow:hidden}.output-dock-state[data-v-bdda9a8e]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-bdda9a8e]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-bdda9a8e .9s linear infinite}@keyframes output-spin-bdda9a8e{to{transform:rotate(360deg)}}.output-dock-pending[data-v-bdda9a8e]{display:inline-flex;align-items:center;flex:none;gap:3px}.output-dock-pending i[data-v-bdda9a8e]{width:4px;height:4px;border-radius:50%;background:var(--text-3);animation:output-pending-bdda9a8e 1.2s ease-in-out infinite}.output-dock-pending i[data-v-bdda9a8e]:nth-child(2){animation-delay:.2s}.output-dock-pending i[data-v-bdda9a8e]:nth-child(3){animation-delay:.4s}@keyframes output-pending-bdda9a8e{0%,60%,to{opacity:.3}30%{opacity:1}}@media(prefers-reduced-motion:reduce){.output-dock-pending i[data-v-bdda9a8e]{animation:none}}.output-dock-title[data-v-bdda9a8e]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-bdda9a8e]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-bdda9a8e]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-bdda9a8e]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-bdda9a8e]{height:100%;transition:width .4s ease}.output-dock-loading[data-v-bdda9a8e]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-bdda9a8e]{animation:output-fade-bdda9a8e .22s var(--ease) .32s backwards}@keyframes output-fade-bdda9a8e{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-bdda9a8e]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-b96e6f29]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-b96e6f29]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-b96e6f29]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-b96e6f29]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-b96e6f29]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-35b69091]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-35b69091]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-35b69091],.state.lost[data-v-35b69091]{color:var(--red, #d4574b)}.line[data-v-35b69091]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-35b69091]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as i, openBlock as l, createBlock as n, unref as u, withCtx as w, createElementBlock as h, createElementVNode as c, toDisplayString as f, createCommentVNode as k } from "vue";
import { useWindow as y, useOutputPages as x, usePoll as b, WindowRoom as O, EmptyState as E, OutputLines as N, AutoScrollPane as P } from "@journal/window-kit";
import { _ as R } from "./RunButtons-DurAB3P9.js";
import { _ as S } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const W = {
  key: 1,
  class: "output"
}, $ = { class: "bar" }, B = { class: "line" }, C = {
  class: "text",
  "data-output-text": ""
}, j = {
  __name: "Output",
  setup(I) {
    const t = y(), e = i(Number(new URLSearchParams(location.search).get("output")) || 0), o = i(null), p = i([]), s = i(!1), d = x((a) => t.read(a.join(" ")), () => e.value), m = () => o.value !== null && (o.value.state === "running" || o.value.state === "background");
    async function v() {
      if (e.value = e.value || await t.setting("output", 0), !e.value) {
        const _ = await t.read(t.agent == null ? "process feed --limit 1" : `process feed --limit 1 --session-agent-id ${t.agent}`);
        e.value = _.ok && _.value.rows.length ? _.value.rows[0].id : 0;
      }
      if (!e.value) return;
      const a = await t.read(`process feed --id ${e.value}`);
      if (o.value = a.ok && a.value.rows.length ? a.value.rows[0] : null, s.value) {
        await d.follow();
        return;
      }
      const r = await t.read(`output peek ${e.value} --summary`);
      p.value = r.ok ? r.value.lines : [r.error];
    }
    async function g() {
      s.value = !s.value, await v();
    }
    return t.follow(["process.*", "output.*"], v), b(v, m), (a, r) => (l(), n(u(O), null, {
      default: w(() => [
        e.value ? (l(), h("div", W, [
          c("div", $, [
            c("span", B, f(o.value ? o.value.line : ""), 1),
            c("button", {
              class: "whole",
              type: "button",
              onClick: g
            }, f(s.value ? "Reader lines" : "Whole output"), 1),
            m() ? (l(), n(R, {
              key: 0,
              "process-id": e.value
            }, null, 8, ["process-id"])) : k("", !0)
          ]),
          s.value ? (l(), n(u(N), {
            key: 0,
            class: "text",
            "data-output-text": "",
            lines: u(d).lines.value,
            onOlder: u(d).loadEarlier
          }, null, 8, ["lines", "onOlder"])) : (l(), n(u(P), {
            key: 1,
            "row-count": p.value.length
          }, {
            default: w(() => [
              c("pre", C, f(p.value.join(`
`)), 1)
            ]),
            _: 1
          }, 8, ["row-count"]))
        ])) : (l(), n(u(E), {
          key: 0,
          title: "No output yet"
        }))
      ]),
      _: 1
    }));
  }
}, U = /* @__PURE__ */ S(j, [["__scopeId", "data-v-b96e6f29"]]);
export {
  U as default
};
