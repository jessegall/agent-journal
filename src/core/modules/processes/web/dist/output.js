/* @code-commandments-generated */
if (!document.getElementById("window-styles-63ed02075b57")) { const style = document.createElement("style"); style.id = "window-styles-63ed02075b57"; style.textContent = ".output-dock-more[data-v-5c485026]{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows var(--move),opacity var(--fade)}.output-dock-more.open[data-v-5c485026]{grid-template-rows:1fr;opacity:1}.output-dock-inner[data-v-5c485026]{min-height:0;overflow:hidden}.output-dock-state[data-v-5c485026]{display:flex;flex:none;justify-content:center;width:16px;color:var(--tone)}.output-dock-label[data-v-5c485026]{display:flex;flex:1 1 auto;align-items:center;gap:9px;min-width:0;padding:0;border:none;background:none;color:var(--text);font:inherit;font-size:12px;font-weight:500;text-align:left;cursor:pointer}.output-dock-title[data-v-5c485026]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-5c485026]{flex:none;color:var(--text-3);font-size:11px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-5c485026]{overflow:auto;max-height:280px;margin:0 12px 10px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-5c485026]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-5c485026]{height:100%;transition:width .4s ease}.output[data-v-57fae755]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-57fae755]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-57fae755]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-57fae755]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-57fae755]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-94f15063]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-94f15063]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-94f15063],.state.lost[data-v-94f15063]{color:var(--red, #d4574b)}.line[data-v-94f15063]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-94f15063]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as r, openBlock as v, createBlock as m, unref as c, createElementBlock as w, createElementVNode as a, toDisplayString as d, Fragment as k, createCommentVNode as h, createVNode as y, withCtx as g } from "vue";
import { useWindow as b, usePoll as x, EmptyState as $, AutoScrollPane as C } from "@journal/window-kit";
import { _ as N } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const S = {
  key: 1,
  class: "output"
}, W = { class: "bar" }, B = { class: "line" }, E = {
  class: "text",
  "data-output-text": ""
}, V = {
  __name: "Output",
  setup(I) {
    const o = b(), t = r(0), u = r(null), i = r([]), n = r(!1), f = () => u.value !== null && (u.value.state === "running" || u.value.state === "background");
    async function p() {
      if (t.value = t.value || await o.setting("output", 0), !t.value) {
        const l = await o.read("process feed --limit 1");
        t.value = l.ok && l.value.rows.length ? l.value.rows[0].id : 0;
      }
      if (!t.value) return;
      const s = await o.read(`process feed --id ${t.value}`);
      u.value = s.ok && s.value.rows.length ? s.value.rows[0] : null;
      const e = await o.read(`output peek ${t.value} ${n.value ? "--all" : "--summary"}`);
      i.value = e.ok ? e.value.lines : [e.error];
    }
    async function _() {
      n.value = !n.value, await p();
    }
    return o.follow(["process.*", "output.*"], p), x(p, f), (s, e) => t.value ? (v(), w("div", S, [
      a("div", W, [
        a("span", B, d(u.value ? u.value.line : ""), 1),
        a("button", {
          class: "whole",
          type: "button",
          onClick: _
        }, d(n.value ? "Reader lines" : "Whole output"), 1),
        f() ? (v(), w(k, { key: 0 }, [
          a("button", {
            class: "stop",
            type: "button",
            onClick: e[0] || (e[0] = (l) => c(o).run(`output stop ${t.value}`))
          }, "Stop"),
          a("button", {
            class: "watch",
            type: "button",
            onClick: e[1] || (e[1] = (l) => c(o).run(`output watch ${t.value}`))
          }, "Watch")
        ], 64)) : h("", !0)
      ]),
      y(c(C), {
        "row-count": i.value.length
      }, {
        default: g(() => [
          a("pre", E, d(i.value.join(`
`)), 1)
        ]),
        _: 1
      }, 8, ["row-count"])
    ])) : (v(), m(c($), {
      key: 0,
      title: "No output yet"
    }));
  }
}, j = /* @__PURE__ */ N(V, [["__scopeId", "data-v-57fae755"]]);
export {
  j as default
};
