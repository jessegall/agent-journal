/* @code-commandments-generated */
if (!document.getElementById("window-styles-e70a3d4e9ffa")) { const style = document.createElement("style"); style.id = "window-styles-e70a3d4e9ffa"; style.textContent = ".main[data-v-67afafdd]{flex:1}.note[data-v-67afafdd]{color:var(--text-3);font-size:12px}.main[data-v-9fff0c65]{flex:1}.note[data-v-9fff0c65]{color:var(--text-3);font-size:12px}.terminal[data-v-4276f3c8]{display:flex;flex-direction:column;height:100%;min-height:0;background:var(--code-bg)}.terminal-body[data-v-4276f3c8]{flex:1;min-height:0;margin:0;padding:8px 12px;overflow:auto;color:var(--text-1);font-family:var(--font-mono, ui-monospace, monospace);font-size:12px;line-height:1.45;white-space:pre-wrap;word-break:break-word}.terminal-failure[data-v-4276f3c8]{padding:8px 12px;color:var(--text-3)}\n"; document.head.appendChild(style); }
import { ref as u, onUnmounted as p, openBlock as l, createElementBlock as n, toDisplayString as v, createBlock as d, unref as y, Fragment as f, renderList as g, createElementVNode as k, createTextVNode as h, nextTick as b } from "vue";
import { useWindow as x, EmptyState as w } from "@journal/window-kit";
import { _ as T } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const E = { class: "terminal" }, I = {
  key: 0,
  class: "terminal-failure"
}, L = { class: "terminal-line" }, N = 1e3, S = {
  __name: "Terminal",
  setup(B) {
    const s = x(), t = u([]), r = u(""), e = u(null);
    let i = 0;
    async function c() {
      const a = await s.read(`agent terminal ${s.agent} --after ${i}`);
      if (!a.ok) {
        r.value = a.error;
        return;
      }
      if (r.value = "", !a.value.rows.length) return;
      const o = !e.value || e.value.scrollTop + e.value.clientHeight >= e.value.scrollHeight - 4;
      t.value = [...t.value, ...a.value.rows].slice(-2e3), i = t.value[t.value.length - 1].number, await b(), o && e.value && (e.value.scrollTop = e.value.scrollHeight);
    }
    const _ = setInterval(() => {
      s.visible.value && c();
    }, N);
    return p(() => clearInterval(_)), c(), (a, o) => (l(), n("section", E, [
      r.value ? (l(), n("p", I, v(r.value), 1)) : t.value.length ? (l(), n("pre", {
        key: 2,
        ref_key: "body",
        ref: e,
        class: "terminal-body"
      }, [
        (l(!0), n(f, null, g(t.value, (m) => (l(), n(f, {
          key: m.number
        }, [
          k("span", L, v(m.text), 1),
          o[0] || (o[0] = h(`
`, -1))
        ], 64))), 128))
      ], 512)) : (l(), d(y(w), {
        key: 1,
        title: "No terminal output from this agent yet"
      }))
    ]));
  }
}, F = /* @__PURE__ */ T(S, [["__scopeId", "data-v-4276f3c8"]]);
export {
  F as default
};
