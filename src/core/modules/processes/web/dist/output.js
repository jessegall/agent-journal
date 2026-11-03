/* @code-commandments-generated */
if (!document.getElementById("window-styles-c64ce1ad2a3b")) { const style = document.createElement("style"); style.id = "window-styles-c64ce1ad2a3b"; style.textContent = ".output-dock-more[data-v-8ed4ef84]{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows var(--move),opacity var(--fade)}.output-dock-more.open[data-v-8ed4ef84]{grid-template-rows:1fr;opacity:1}.output-dock-inner[data-v-8ed4ef84]{min-height:0;overflow:hidden}.output-dock-state[data-v-8ed4ef84]{display:flex;flex:none;justify-content:center;width:16px;color:var(--tone)}.output-dock-label[data-v-8ed4ef84]{display:flex;flex:1 1 auto;align-items:center;gap:9px;min-width:0;padding:0;border:none;background:none;color:var(--text);font:inherit;font-size:12px;font-weight:500;text-align:left;cursor:pointer}.output-dock-title[data-v-8ed4ef84]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-8ed4ef84]{flex:none;color:var(--text-3);font-size:11px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-8ed4ef84]{overflow:auto;max-height:280px;margin:0 12px 10px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-8ed4ef84]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-8ed4ef84]{height:100%;transition:width .4s ease}.output[data-v-9f0e1ab2]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-9f0e1ab2]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-9f0e1ab2]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-9f0e1ab2]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-9f0e1ab2]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-f3235ed9]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-f3235ed9]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-f3235ed9],.state.lost[data-v-f3235ed9]{color:var(--red, #d4574b)}.line[data-v-f3235ed9]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-f3235ed9]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as c, openBlock as i, createBlock as f, unref as n, withCtx as w, createElementBlock as _, createElementVNode as u, toDisplayString as d, Fragment as h, createCommentVNode as k, createVNode as y } from "vue";
import { useWindow as b, usePoll as x, WindowRoom as $, EmptyState as C, AutoScrollPane as N } from "@journal/window-kit";
import { _ as S } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const W = {
  key: 1,
  class: "output"
}, R = { class: "bar" }, B = { class: "line" }, E = {
  class: "text",
  "data-output-text": ""
}, P = {
  __name: "Output",
  setup(V) {
    const e = b(), t = c(Number(new URLSearchParams(location.search).get("output")) || 0), a = c(null), p = c([]), s = c(!1), m = () => a.value !== null && (a.value.state === "running" || a.value.state === "background");
    async function v() {
      if (t.value = t.value || await e.setting("output", 0), !t.value) {
        const l = await e.read(e.agent == null ? "process feed --limit 1" : `process feed --limit 1 --agent-id ${e.agent}`);
        t.value = l.ok && l.value.rows.length ? l.value.rows[0].id : 0;
      }
      if (!t.value) return;
      const r = await e.read(`process feed --id ${t.value}`);
      a.value = r.ok && r.value.rows.length ? r.value.rows[0] : null;
      const o = await e.read(`output peek ${t.value} ${s.value ? "--all" : "--summary"}`);
      p.value = o.ok ? o.value.lines : [o.error];
    }
    async function g() {
      s.value = !s.value, await v();
    }
    return e.follow(["process.*", "output.*"], v), x(v, m), (r, o) => (i(), f(n($), null, {
      default: w(() => [
        t.value ? (i(), _("div", W, [
          u("div", R, [
            u("span", B, d(a.value ? a.value.line : ""), 1),
            u("button", {
              class: "whole",
              type: "button",
              onClick: g
            }, d(s.value ? "Reader lines" : "Whole output"), 1),
            m() ? (i(), _(h, { key: 0 }, [
              u("button", {
                class: "stop",
                type: "button",
                onClick: o[0] || (o[0] = (l) => n(e).run(`output stop ${t.value}`))
              }, "Stop"),
              u("button", {
                class: "watch",
                type: "button",
                onClick: o[1] || (o[1] = (l) => n(e).run(`output watch ${t.value}`))
              }, "Watch")
            ], 64)) : k("", !0)
          ]),
          y(n(N), {
            "row-count": p.value.length
          }, {
            default: w(() => [
              u("pre", E, d(p.value.join(`
`)), 1)
            ]),
            _: 1
          }, 8, ["row-count"])
        ])) : (i(), f(n(C), {
          key: 0,
          title: "No output yet"
        }))
      ]),
      _: 1
    }));
  }
}, A = /* @__PURE__ */ S(P, [["__scopeId", "data-v-9f0e1ab2"]]);
export {
  A as default
};
