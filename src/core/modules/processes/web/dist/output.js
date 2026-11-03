/* @code-commandments-generated */
if (!document.getElementById("window-styles-f3a3024f3880")) { const style = document.createElement("style"); style.id = "window-styles-f3a3024f3880"; style.textContent = ".output-dock-more[data-v-735ff053]{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows var(--move),opacity var(--fade)}.output-dock-more.open[data-v-735ff053]{grid-template-rows:1fr;opacity:1}.output-dock-inner[data-v-735ff053]{min-height:0;overflow:hidden}.output-dock-state[data-v-735ff053]{display:flex;flex:none;justify-content:center;width:16px;color:var(--tone)}.output-dock-label[data-v-735ff053]{display:flex;flex:1 1 auto;align-items:center;gap:9px;min-width:0;padding:0;border:none;background:none;color:var(--text);font:inherit;font-size:12px;font-weight:500;text-align:left;cursor:pointer}.output-dock-title[data-v-735ff053]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-735ff053]{flex:none;color:var(--text-3);font-size:11px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-735ff053]{overflow:auto;max-height:280px;margin:0 12px 10px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-735ff053]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-735ff053]{height:100%;transition:width .4s ease}.output[data-v-7e18ff9e]{display:flex;flex-direction:column;height:100%}.bar[data-v-7e18ff9e]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-7e18ff9e]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-7e18ff9e]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-7e18ff9e]{flex:1;margin:0;padding:0 12px 12px;overflow:auto;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-454d324c]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-454d324c]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-454d324c],.state.lost[data-v-454d324c]{color:var(--red, #d4574b)}.line[data-v-454d324c]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-454d324c]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as r, openBlock as i, createBlock as w, unref as p, createElementBlock as m, createElementVNode as a, toDisplayString as v, Fragment as k, createCommentVNode as y } from "vue";
import { useWindow as g, usePoll as h, EmptyState as b } from "@journal/window-kit";
import { _ as $ } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const x = {
  key: 1,
  class: "output"
}, C = { class: "bar" }, W = { class: "line" }, B = { class: "text" }, E = {
  __name: "Output",
  setup(N) {
    const o = g(), t = r(0), u = r(null), d = r([]), n = r(!1), f = () => u.value !== null && (u.value.state === "running" || u.value.state === "background");
    async function c() {
      if (t.value = t.value || await o.setting("output", 0), !t.value) {
        const l = await o.read("process feed --limit 1");
        t.value = l.ok && l.value.rows.length ? l.value.rows[0].id : 0;
      }
      if (!t.value) return;
      const s = await o.read(`process feed --id ${t.value}`);
      u.value = s.ok && s.value.rows.length ? s.value.rows[0] : null;
      const e = await o.read(`output peek ${t.value} ${n.value ? "--all" : "--summary"}`);
      d.value = e.ok ? e.value.lines : [e.error];
    }
    async function _() {
      n.value = !n.value, await c();
    }
    return o.follow(["process.*", "output.*"], c), h(c, f), (s, e) => t.value ? (i(), m("div", x, [
      a("div", C, [
        a("span", W, v(u.value ? u.value.line : ""), 1),
        a("button", {
          class: "whole",
          type: "button",
          onClick: _
        }, v(n.value ? "Reader lines" : "Whole output"), 1),
        f() ? (i(), m(k, { key: 0 }, [
          a("button", {
            class: "stop",
            type: "button",
            onClick: e[0] || (e[0] = (l) => p(o).run(`output stop ${t.value}`))
          }, "Stop"),
          a("button", {
            class: "watch",
            type: "button",
            onClick: e[1] || (e[1] = (l) => p(o).run(`output watch ${t.value}`))
          }, "Watch")
        ], 64)) : y("", !0)
      ]),
      a("pre", B, v(d.value.join(`
`)), 1)
    ])) : (i(), w(p(b), {
      key: 0,
      title: "No output yet"
    }));
  }
}, R = /* @__PURE__ */ $(E, [["__scopeId", "data-v-7e18ff9e"]]);
export {
  R as default
};
