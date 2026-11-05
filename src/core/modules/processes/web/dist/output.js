/* @code-commandments-generated */
if (!document.getElementById("window-styles-906b7968f5ef")) { const style = document.createElement("style"); style.id = "window-styles-906b7968f5ef"; style.textContent = ".output-dock-inner[data-v-49bc5712]{min-height:0;overflow:hidden}.output-dock-state[data-v-49bc5712]{display:flex;flex:none;justify-content:center;width:14px;color:var(--tone)}.output-dock-ring[data-v-49bc5712]{width:10px;height:10px;border:1.5px solid color-mix(in srgb,var(--tone) 30%,transparent);border-top-color:var(--tone);border-radius:50%;animation:output-spin-49bc5712 .9s linear infinite}@keyframes output-spin-49bc5712{to{transform:rotate(360deg)}}.output-dock-title[data-v-49bc5712]{flex:1;font-size:13px;font-weight:500;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-49bc5712]{flex:none;color:var(--text-3);font-size:11.5px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-49bc5712]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0;padding:8px 14px 8px 36px;background:var(--term);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-49bc5712]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-49bc5712]{height:100%;transition:width .4s ease}.output-dock-loading[data-v-49bc5712]{padding:8px 14px 8px 36px;height:60px;background:var(--term)}.output-dock-terminal[data-v-49bc5712]{animation:output-fade-49bc5712 .22s var(--ease) .32s backwards}@keyframes output-fade-49bc5712{0%{opacity:0}}@media(prefers-reduced-motion:reduce){.output-dock-terminal[data-v-49bc5712]{animation-duration:.1s;animation-delay:0ms}}.output[data-v-fcf61e26]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-fcf61e26]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-fcf61e26]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-fcf61e26]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-fcf61e26]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-c1c1f2f0]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-c1c1f2f0]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-c1c1f2f0],.state.lost[data-v-c1c1f2f0]{color:var(--red, #d4574b)}.line[data-v-c1c1f2f0]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-c1c1f2f0]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as c, openBlock as n, createBlock as p, unref as u, withCtx as _, createElementBlock as g, createElementVNode as s, toDisplayString as w, Fragment as h, createCommentVNode as y } from "vue";
import { useWindow as x, useOutputPages as b, usePoll as $, WindowRoom as O, EmptyState as C, OutputLines as S, AutoScrollPane as W } from "@journal/window-kit";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const N = {
  key: 1,
  class: "output"
}, P = { class: "bar" }, R = { class: "line" }, B = {
  class: "text",
  "data-output-text": ""
}, j = {
  __name: "Output",
  setup(I) {
    const e = x(), t = c(Number(new URLSearchParams(location.search).get("output")) || 0), a = c(null), v = c([]), r = c(!1), d = b((l) => e.read(l.join(" ")), () => t.value), m = () => a.value !== null && (a.value.state === "running" || a.value.state === "background");
    async function f() {
      if (t.value = t.value || await e.setting("output", 0), !t.value) {
        const i = await e.read(e.agent == null ? "process feed --limit 1" : `process feed --limit 1 --agent-id ${e.agent}`);
        t.value = i.ok && i.value.rows.length ? i.value.rows[0].id : 0;
      }
      if (!t.value) return;
      const l = await e.read(`process feed --id ${t.value}`);
      if (a.value = l.ok && l.value.rows.length ? l.value.rows[0] : null, r.value) {
        await d.follow();
        return;
      }
      const o = await e.read(`output peek ${t.value} --summary`);
      v.value = o.ok ? o.value.lines : [o.error];
    }
    async function k() {
      r.value = !r.value, await f();
    }
    return e.follow(["process.*", "output.*"], f), $(f, m), (l, o) => (n(), p(u(O), null, {
      default: _(() => [
        t.value ? (n(), g("div", N, [
          s("div", P, [
            s("span", R, w(a.value ? a.value.line : ""), 1),
            s("button", {
              class: "whole",
              type: "button",
              onClick: k
            }, w(r.value ? "Reader lines" : "Whole output"), 1),
            m() ? (n(), g(h, { key: 0 }, [
              s("button", {
                class: "stop",
                type: "button",
                onClick: o[0] || (o[0] = (i) => u(e).run(`output stop ${t.value}`))
              }, "Stop"),
              s("button", {
                class: "watch",
                type: "button",
                onClick: o[1] || (o[1] = (i) => u(e).run(`output watch ${t.value}`))
              }, "Watch")
            ], 64)) : y("", !0)
          ]),
          r.value ? (n(), p(u(S), {
            key: 0,
            class: "text",
            "data-output-text": "",
            lines: u(d).lines.value,
            onOlder: u(d).loadEarlier
          }, null, 8, ["lines", "onOlder"])) : (n(), p(u(W), {
            key: 1,
            "row-count": v.value.length
          }, {
            default: _(() => [
              s("pre", B, w(v.value.join(`
`)), 1)
            ]),
            _: 1
          }, 8, ["row-count"]))
        ])) : (n(), p(u(C), {
          key: 0,
          title: "No output yet"
        }))
      ]),
      _: 1
    }));
  }
}, D = /* @__PURE__ */ E(j, [["__scopeId", "data-v-fcf61e26"]]);
export {
  D as default
};
