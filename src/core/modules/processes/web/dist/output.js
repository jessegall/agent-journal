/* @code-commandments-generated */
if (!document.getElementById("window-styles-264a5ef774dc")) { const style = document.createElement("style"); style.id = "window-styles-264a5ef774dc"; style.textContent = ".output-dock-more[data-v-f69607f3]{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows var(--move),opacity var(--fade)}.output-dock-more.open[data-v-f69607f3]{grid-template-rows:1fr;opacity:1}.output-dock-inner[data-v-f69607f3]{min-height:0;overflow:hidden}.output-dock-state[data-v-f69607f3]{display:flex;flex:none;justify-content:center;width:16px;color:var(--tone)}.output-dock-label[data-v-f69607f3]{display:flex;flex:1 1 auto;align-items:center;gap:9px;min-width:0;padding:0;border:none;background:none;color:var(--text);font:inherit;font-size:12px;font-weight:500;text-align:left;cursor:pointer}.output-dock-title[data-v-f69607f3]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-f69607f3]{flex:none;color:var(--text-3);font-size:11px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-f69607f3]{overflow:auto;max-height:min(280px,calc(40cqh - 72px));margin:0 12px 10px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-f69607f3]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-f69607f3]{height:100%;transition:width .4s ease}.output[data-v-97d5a832]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-97d5a832]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-97d5a832]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-97d5a832]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-97d5a832]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-f3235ed9]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-f3235ed9]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-f3235ed9],.state.lost[data-v-f3235ed9]{color:var(--red, #d4574b)}.line[data-v-f3235ed9]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-f3235ed9]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as c, openBlock as n, createBlock as p, unref as u, withCtx as _, createElementBlock as g, createElementVNode as s, toDisplayString as f, Fragment as h, createCommentVNode as y } from "vue";
import { useWindow as x, useOutputPages as b, usePoll as $, WindowRoom as O, EmptyState as C, OutputLines as S, AutoScrollPane as W } from "@journal/window-kit";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const N = {
  key: 1,
  class: "output"
}, P = { class: "bar" }, R = { class: "line" }, B = {
  class: "text",
  "data-output-text": ""
}, j = {
  __name: "Output",
  setup(I) {
    const e = x(), t = c(Number(new URLSearchParams(location.search).get("output")) || 0), a = c(null), d = c([]), r = c(!1), v = b((l) => e.read(l.join(" ")), () => t.value), m = () => a.value !== null && (a.value.state === "running" || a.value.state === "background");
    async function w() {
      if (t.value = t.value || await e.setting("output", 0), !t.value) {
        const i = await e.read(e.agent == null ? "process feed --limit 1" : `process feed --limit 1 --agent-id ${e.agent}`);
        t.value = i.ok && i.value.rows.length ? i.value.rows[0].id : 0;
      }
      if (!t.value) return;
      const l = await e.read(`process feed --id ${t.value}`);
      if (a.value = l.ok && l.value.rows.length ? l.value.rows[0] : null, r.value) {
        await v.follow();
        return;
      }
      const o = await e.read(`output peek ${t.value} --summary`);
      d.value = o.ok ? o.value.lines : [o.error];
    }
    async function k() {
      r.value = !r.value, await w();
    }
    return e.follow(["process.*", "output.*"], w), $(w, m), (l, o) => (n(), p(u(O), null, {
      default: _(() => [
        t.value ? (n(), g("div", N, [
          s("div", P, [
            s("span", R, f(a.value ? a.value.line : ""), 1),
            s("button", {
              class: "whole",
              type: "button",
              onClick: k
            }, f(r.value ? "Reader lines" : "Whole output"), 1),
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
            lines: u(v).lines.value,
            onOlder: u(v).loadEarlier
          }, null, 8, ["lines", "onOlder"])) : (n(), p(u(W), {
            key: 1,
            "row-count": d.value.length
          }, {
            default: _(() => [
              s("pre", B, f(d.value.join(`
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
}, D = /* @__PURE__ */ E(j, [["__scopeId", "data-v-97d5a832"]]);
export {
  D as default
};
