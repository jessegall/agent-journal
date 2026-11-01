/* @code-commandments-generated */
if (!document.getElementById("window-styles-19e6ee65844f")) { const style = document.createElement("style"); style.id = "window-styles-19e6ee65844f"; style.textContent = ".filter[data-v-89de1475]{box-sizing:border-box;width:100%;max-width:320px;margin-bottom:8px;padding:5px 10px;border:1px solid var(--border-2);border-radius:8px;background:transparent;color:var(--text);font:inherit;font-size:12.5px}.main[data-v-89de1475]{flex:1}.note[data-v-89de1475]{color:var(--text-3);font-size:12px}.main[data-v-f4d9e119]{flex:1}.note[data-v-f4d9e119]{color:var(--text-3);font-size:12px}.terminal[data-v-4276f3c8]{display:flex;flex-direction:column;height:100%;min-height:0;background:var(--code-bg)}.terminal-body[data-v-4276f3c8]{flex:1;min-height:0;margin:0;padding:8px 12px;overflow:auto;color:var(--text-1);font-family:var(--font-mono, ui-monospace, monospace);font-size:12px;line-height:1.45;white-space:pre-wrap;word-break:break-word}.terminal-failure[data-v-4276f3c8]{padding:8px 12px;color:var(--text-3)}.agentset[data-v-6aa7e24f]{position:relative;display:flex;align-items:center;gap:10px;padding:3px 4px 3px 8px;border:1px solid var(--border-2);border-radius:8px}.agentset-settings[data-v-6aa7e24f]{display:inline-flex;align-items:center;padding:3px 5px;border:0;border-radius:5px;background:none;color:var(--text-2);cursor:pointer}.agentset-settings[data-v-6aa7e24f]:hover,.agentset-settings[aria-expanded=true][data-v-6aa7e24f]{background:var(--hover);color:var(--text)}.agentset-menu[data-v-6aa7e24f]{position:absolute;top:calc(100% + 8px);right:0;z-index:40;display:flex;flex-direction:column;gap:10px;width:260px;padding:12px;border:1px solid var(--border-2);border-radius:10px;background:var(--raised);box-shadow:0 12px 32px #00000073}.agentset-row[data-v-6aa7e24f]{display:flex;align-items:center;justify-content:space-between;gap:12px;color:var(--text-2);font-size:12.5px}.agentset-number[data-v-6aa7e24f]{width:56px;padding:3px 6px;border:1px solid var(--border-2);border-radius:5px;background:var(--bg);color:var(--text);font:inherit}.agentset-failure[data-v-6aa7e24f]{margin:0;color:var(--danger);font-size:12px}\n"; document.head.appendChild(style); }
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
