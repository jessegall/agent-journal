/* @code-commandments-generated */
if (!document.getElementById("window-styles-e55a7643fbc0")) { const style = document.createElement("style"); style.id = "window-styles-e55a7643fbc0"; style.textContent = ".output-body[data-v-8b8c8324]{display:flex;flex-direction:column;gap:4px;padding:2px 0 0 20px;font-size:12px}.progress[data-v-8b8c8324]{height:3px;border-radius:2px;background:var(--border, #ddd)}.bar[data-v-8b8c8324]{display:block;height:100%;border-radius:2px;background:var(--text-3)}.figure[data-v-8b8c8324]{color:var(--text-3)}.last-lines[data-v-8b8c8324]{margin:0;color:var(--text-2);line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock[data-v-270da32c]{display:flex;margin:0 14px 10px 36px;flex-wrap:wrap;gap:4px 8px;font-size:12px;line-height:1.45}.output-dock-state[data-v-270da32c]{color:var(--text-3)}.output-dock-state.running[data-v-270da32c],.output-dock-state.background[data-v-270da32c]{color:var(--accent-text)}.output-dock-line[data-v-270da32c]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-lines[data-v-270da32c]{flex-basis:100%;margin:0;color:var(--text-2);font-size:11.5px;white-space:pre-wrap}.output[data-v-b54b35ed]{display:flex;flex-direction:column;height:100%}.bar[data-v-b54b35ed]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-b54b35ed]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-b54b35ed]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-b54b35ed]{flex:1;margin:0;padding:0 12px 12px;overflow:auto;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-62193fb4]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-62193fb4]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-62193fb4],.state.lost[data-v-62193fb4]{color:var(--red, #d4574b)}.line[data-v-62193fb4]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-62193fb4]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
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
