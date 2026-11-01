/* @code-commandments-generated */
if (!document.getElementById("window-styles-64eeebd38735")) { const style = document.createElement("style"); style.id = "window-styles-64eeebd38735"; style.textContent = ".output-body[data-v-8b8c8324]{display:flex;flex-direction:column;gap:4px;padding:2px 0 0 20px;font-size:12px}.progress[data-v-8b8c8324]{height:3px;border-radius:2px;background:var(--border, #ddd)}.bar[data-v-8b8c8324]{display:block;height:100%;border-radius:2px;background:var(--text-3)}.figure[data-v-8b8c8324]{color:var(--text-3)}.last-lines[data-v-8b8c8324]{margin:0;color:var(--text-2);line-height:1.45;white-space:pre-wrap;overflow-wrap:anywhere}.output-dock[data-v-021f18e4]{display:flex;margin:0 14px 10px 36px;flex-wrap:wrap;gap:4px 8px;font-size:12px;line-height:1.45}.output-dock-state[data-v-021f18e4]{color:var(--text-3)}.output-dock-state.running[data-v-021f18e4],.output-dock-state.background[data-v-021f18e4]{color:var(--accent-text)}.output-dock-line[data-v-021f18e4]{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.output-dock-lines[data-v-021f18e4]{flex-basis:100%;margin:0;color:var(--text-2);font-size:11.5px;white-space:pre-wrap}.output[data-v-1f3ff26a]{display:flex;flex-direction:column;height:100%}.bar[data-v-1f3ff26a]{display:flex;align-items:baseline;gap:8px;padding:8px 12px;font-size:12px}.line[data-v-1f3ff26a]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-1f3ff26a]{border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}.text[data-v-1f3ff26a]{flex:1;margin:0;padding:0 12px 12px;overflow:auto;font-size:12px;line-height:1.5;white-space:pre-wrap}.run[data-v-62193fb4]{display:flex;flex:1;align-items:baseline;gap:8px;font-size:12px}.state[data-v-62193fb4]{flex:none;min-width:64px;color:var(--text-3)}.state.failed[data-v-62193fb4],.state.lost[data-v-62193fb4]{color:var(--red, #d4574b)}.line[data-v-62193fb4]{flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}button[data-v-62193fb4]{flex:none;border:0;background:none;color:var(--text-3);font-size:12px;cursor:pointer}\n"; document.head.appendChild(style); }
import { ref as m, onMounted as g, onBeforeUnmount as h, openBlock as s, createElementBlock as u, Fragment as w, createElementVNode as _, normalizeClass as y, toDisplayString as l, createCommentVNode as v } from "vue";
import { useWindow as x } from "@journal/window-kit";
import { _ as D } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const L = {
  class: "output-dock",
  "data-output-dock": ""
}, O = { class: "output-dock-line" }, B = {
  key: 1,
  class: "output-dock-lines"
}, C = 2e3, E = {
  __name: "OutputDock",
  setup(I) {
    const o = x(), k = o.option("row"), t = m(null), n = m([]);
    let c = null;
    const f = () => t.value === null || t.value.state === "running" || t.value.state === "background";
    async function r() {
      var d;
      const e = (d = k.value) == null ? void 0 : d.target_id;
      if (!e) return;
      const a = await o.read(`process show ${e}`);
      t.value = a.ok ? a.value : null;
      const p = await o.read(`output peek ${e} --summary`);
      n.value = p.ok ? p.value.lines : [];
    }
    function i() {
      c = setTimeout(async () => {
        f() && await r(), i();
      }, C);
    }
    return g(() => {
      r(), i();
    }), h(() => clearTimeout(c)), (e, a) => (s(), u("div", L, [
      t.value ? (s(), u(w, { key: 0 }, [
        _("span", {
          class: y(["output-dock-state", t.value.state])
        }, l(t.value.state), 3),
        _("span", O, l(t.value.line), 1)
      ], 64)) : v("", !0),
      n.value.length ? (s(), u("pre", B, l(n.value.join(`
`)), 1)) : v("", !0)
    ]));
  }
}, T = /* @__PURE__ */ D(E, [["__scopeId", "data-v-021f18e4"]]);
export {
  T as default
};
