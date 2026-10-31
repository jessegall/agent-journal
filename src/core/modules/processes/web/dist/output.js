/* @code-commandments-generated */
if (!document.getElementById("window-styles-4de5b6cf7e55")) { const style = document.createElement("style"); style.id = "window-styles-4de5b6cf7e55"; style.textContent = ".output-body[data-v-3d1ec0ba]{display:flex;flex-direction:column;gap:4px;padding:2px 0 0 20px;font-size:12px}.progress[data-v-3d1ec0ba]{height:3px;border-radius:2px;background:var(--border, #ddd)}.bar[data-v-3d1ec0ba]{display:block;height:100%;border-radius:2px;background:var(--text-3)}.figure[data-v-3d1ec0ba]{color:var(--text-3)}.last-lines[data-v-3d1ec0ba]{margin:0;color:var(--text-2);line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock[data-v-ffbab2f9]{display:flex;gap:8px;font-size:12px;line-height:1.45}.output-dock-state[data-v-ffbab2f9]{color:var(--text-4)}.output-dock-line[data-v-ffbab2f9]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output[data-v-b4f3cf48]{display:flex;flex-direction:column;height:100%}.bar[data-v-b4f3cf48]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-b4f3cf48]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-b4f3cf48]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-b4f3cf48]{flex:1;margin:0;padding:0 12px 12px;overflow:auto;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-c6f8cc16]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-c6f8cc16]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-c6f8cc16],.state.lost[data-v-c6f8cc16]{color:var(--red, #d4574b)}.line[data-v-c6f8cc16]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-c6f8cc16]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as r, onMounted as h, onBeforeUnmount as b, openBlock as c, createBlock as g, unref as i, createElementBlock as w, createElementVNode as a, toDisplayString as p, Fragment as $, createCommentVNode as x } from "vue";
import { useWindow as C, EmptyState as S } from "@journal/window-kit";
import { _ as B } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const E = {
  key: 1,
  class: "output"
}, I = { class: "bar" }, L = { class: "line" }, N = { class: "text" }, O = 2e3, W = {
  __name: "Output",
  setup(D) {
    const o = C(), e = r(0), n = r(null), v = r([]), s = r(!1);
    let d = null;
    const f = () => n.value !== null && (n.value.state === "running" || n.value.state === "background");
    async function _() {
      if (e.value) return e.value;
      const u = await o.setting("output", 0);
      if (u) return u;
      const t = await o.read("process list --limit 1");
      return t.ok && t.value.rows.length ? t.value.rows[0].id : 0;
    }
    async function l() {
      if (e.value = await _(), !e.value) return;
      const u = await o.read(`process show ${e.value}`);
      n.value = u.ok ? u.value : null;
      const t = await o.read(`output peek ${e.value} ${s.value ? "--all" : "--summary"}`);
      v.value = t.ok ? t.value.lines : [t.error];
    }
    function m() {
      d = setTimeout(async () => {
        f() && await l(), m();
      }, O);
    }
    async function y() {
      s.value = !s.value, await l();
    }
    return o.follow(["process.*", "output.*"], l), h(async () => {
      await l(), m();
    }), b(() => clearTimeout(d)), (u, t) => e.value ? (c(), w("div", E, [
      a("div", I, [
        a("span", L, p(n.value ? n.value.line : ""), 1),
        a("button", {
          class: "whole",
          type: "button",
          onClick: y
        }, p(s.value ? "Reader lines" : "Whole output"), 1),
        f() ? (c(), w($, { key: 0 }, [
          a("button", {
            class: "stop",
            type: "button",
            onClick: t[0] || (t[0] = (k) => i(o).run(`output stop ${e.value}`))
          }, "Stop"),
          a("button", {
            class: "watch",
            type: "button",
            onClick: t[1] || (t[1] = (k) => i(o).run(`output watch ${e.value}`))
          }, "Watch")
        ], 64)) : x("", !0)
      ]),
      a("pre", N, p(v.value.join(`
`)), 1)
    ])) : (c(), g(i(S), {
      key: 0,
      title: "No output yet"
    }));
  }
}, V = /* @__PURE__ */ B(W, [["__scopeId", "data-v-b4f3cf48"]]);
export {
  V as default
};
