/* @code-commandments-generated */
if (!document.getElementById("window-styles-60c791ae0b4a")) { const style = document.createElement("style"); style.id = "window-styles-60c791ae0b4a"; style.textContent = ".output-dock-more[data-v-a1003215]{display:grid;grid-template-rows:0fr;opacity:0;transition:grid-template-rows var(--move),opacity var(--fade)}.output-dock-more.open[data-v-a1003215]{grid-template-rows:1fr;opacity:1}.output-dock-inner[data-v-a1003215]{min-height:0;overflow:hidden}.output-dock-state[data-v-a1003215]{display:flex;flex:none;justify-content:center;width:16px;color:var(--tone)}.output-dock-label[data-v-a1003215]{display:flex;flex:1 1 auto;align-items:center;gap:9px;min-width:0;padding:0;border:none;background:none;color:var(--text);font:inherit;font-size:12px;font-weight:500;text-align:left;cursor:pointer}.output-dock-title[data-v-a1003215]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-figure[data-v-a1003215]{flex:none;color:var(--text-3);font-size:11px;font-variant-numeric:tabular-nums}.output-dock-lines[data-v-a1003215]{margin:0;padding:0 12px 10px 35px;color:var(--text-3);font-family:var(--mono, monospace);font-size:11px;line-height:1.5;list-style:none;overflow-wrap:anywhere}.output-dock-bar[data-v-a1003215]{position:absolute;right:0;bottom:0;left:0;height:2px;border-radius:1px;background:var(--border);overflow:hidden}.output-dock-fill[data-v-a1003215]{height:100%;transition:width .4s ease}.output[data-v-b54b35ed]{display:flex;flex-direction:column;height:100%}.bar[data-v-b54b35ed]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-b54b35ed]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-b54b35ed]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-b54b35ed]{flex:1;margin:0;padding:0 12px 12px;overflow:auto;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-62193fb4]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-62193fb4]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-62193fb4],.state.lost[data-v-62193fb4]{color:var(--red, #d4574b)}.line[data-v-62193fb4]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-62193fb4]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as s, openBlock as i, createBlock as k, unref as p, createElementBlock as _, createElementVNode as a, toDisplayString as v, Fragment as w, createCommentVNode as y } from "vue";
import { useWindow as b, usePoll as h, EmptyState as g } from "@journal/window-kit";
import { _ as $ } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const x = {
  key: 1,
  class: "output"
}, C = { class: "bar" }, W = { class: "line" }, B = { class: "text" }, E = {
  __name: "Output",
  setup(N) {
    const o = b(), t = s(0), u = s(null), d = s([]), n = s(!1), m = () => u.value !== null && (u.value.state === "running" || u.value.state === "background");
    async function r() {
      if (t.value = t.value || await o.setting("output", 0), !t.value) {
        const l = await o.read("process list --limit 1");
        t.value = l.ok && l.value.rows.length ? l.value.rows[0].id : 0;
      }
      if (!t.value) return;
      const c = await o.read(`process show ${t.value}`);
      u.value = c.ok ? c.value : null;
      const e = await o.read(`output peek ${t.value} ${n.value ? "--all" : "--summary"}`);
      d.value = e.ok ? e.value.lines : [e.error];
    }
    async function f() {
      n.value = !n.value, await r();
    }
    return o.follow(["process.*", "output.*"], r), h(r, m), (c, e) => t.value ? (i(), _("div", x, [
      a("div", C, [
        a("span", W, v(u.value ? u.value.line : ""), 1),
        a("button", {
          class: "whole",
          type: "button",
          onClick: f
        }, v(n.value ? "Reader lines" : "Whole output"), 1),
        m() ? (i(), _(w, { key: 0 }, [
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
    ])) : (i(), k(p(g), {
      key: 0,
      title: "No output yet"
    }));
  }
}, R = /* @__PURE__ */ $(E, [["__scopeId", "data-v-b54b35ed"]]);
export {
  R as default
};
