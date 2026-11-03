/* @code-commandments-generated */
if (!document.getElementById("window-styles-62125f07ee4e")) { const style = document.createElement("style"); style.id = "window-styles-62125f07ee4e"; style.textContent = ".output-dock-more[data-v-605860cc]{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows var(--move),opacity var(--fade)}.output-dock-more.open[data-v-605860cc]{grid-template-rows:1fr;opacity:1}.output-dock-inner[data-v-605860cc]{min-height:0;overflow:hidden}.output-dock-state[data-v-605860cc]{display:flex;flex:none;justify-content:center;width:16px;color:var(--tone)}.output-dock-label[data-v-605860cc]{display:flex;flex:1 1 auto;align-items:center;gap:9px;min-width:0;padding:0;border:none;background:none;color:var(--text);font:inherit;font-size:12px;font-weight:500;text-align:left;cursor:pointer}.output-dock-title[data-v-605860cc]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-605860cc]{flex:none;color:var(--text-3);font-size:11px;font-variant-numeric:tabular-nums}.output-dock-terminal[data-v-605860cc]{overflow:auto;max-height:280px;margin:0 12px 10px;padding:8px 10px;border:1px solid var(--border);border-radius:6px;background:var(--bg);color:var(--text-2);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock-bar[data-v-605860cc]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-605860cc]{height:100%;transition:width .4s ease}.output[data-v-0ec79296]{display:flex;flex-direction:column;height:100%;min-height:0}.bar[data-v-0ec79296]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-0ec79296]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-0ec79296]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-0ec79296]{margin:0;padding:0 12px 12px;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-1705ad99]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-1705ad99]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-1705ad99],.state.lost[data-v-1705ad99]{color:var(--red, #d4574b)}.line[data-v-1705ad99]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-1705ad99]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as c, openBlock as i, createBlock as m, unref as n, withCtx as w, createElementBlock as _, createElementVNode as a, toDisplayString as d, Fragment as k, createCommentVNode as h, createVNode as y } from "vue";
import { useWindow as b, usePoll as x, WindowRoom as $, EmptyState as C, AutoScrollPane as W } from "@journal/window-kit";
import { _ as N } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const S = {
  key: 1,
  class: "output"
}, B = { class: "bar" }, E = { class: "line" }, R = {
  class: "text",
  "data-output-text": ""
}, V = {
  __name: "Output",
  setup(I) {
    const e = b(), t = c(0), u = c(null), p = c([]), s = c(!1), f = () => u.value !== null && (u.value.state === "running" || u.value.state === "background");
    async function v() {
      if (t.value = t.value || await e.setting("output", 0), !t.value) {
        const l = await e.read(e.agent == null ? "process feed --limit 1" : `process feed --limit 1 --agent-id ${e.agent}`);
        t.value = l.ok && l.value.rows.length ? l.value.rows[0].id : 0;
      }
      if (!t.value) return;
      const r = await e.read(`process feed --id ${t.value}`);
      u.value = r.ok && r.value.rows.length ? r.value.rows[0] : null;
      const o = await e.read(`output peek ${t.value} ${s.value ? "--all" : "--summary"}`);
      p.value = o.ok ? o.value.lines : [o.error];
    }
    async function g() {
      s.value = !s.value, await v();
    }
    return e.follow(["process.*", "output.*"], v), x(v, f), (r, o) => (i(), m(n($), null, {
      default: w(() => [
        t.value ? (i(), _("div", S, [
          a("div", B, [
            a("span", E, d(u.value ? u.value.line : ""), 1),
            a("button", {
              class: "whole",
              type: "button",
              onClick: g
            }, d(s.value ? "Reader lines" : "Whole output"), 1),
            f() ? (i(), _(k, { key: 0 }, [
              a("button", {
                class: "stop",
                type: "button",
                onClick: o[0] || (o[0] = (l) => n(e).run(`output stop ${t.value}`))
              }, "Stop"),
              a("button", {
                class: "watch",
                type: "button",
                onClick: o[1] || (o[1] = (l) => n(e).run(`output watch ${t.value}`))
              }, "Watch")
            ], 64)) : h("", !0)
          ]),
          y(n(W), {
            "row-count": p.value.length
          }, {
            default: w(() => [
              a("pre", R, d(p.value.join(`
`)), 1)
            ]),
            _: 1
          }, 8, ["row-count"])
        ])) : (i(), m(n(C), {
          key: 0,
          title: "No output yet"
        }))
      ]),
      _: 1
    }));
  }
}, A = /* @__PURE__ */ N(V, [["__scopeId", "data-v-0ec79296"]]);
export {
  A as default
};
