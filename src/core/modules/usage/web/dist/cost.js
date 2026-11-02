/* @code-commandments-generated */
if (!document.getElementById("window-styles-d0e219c05149")) { const style = document.createElement("style"); style.id = "window-styles-d0e219c05149"; style.textContent = ".current[data-v-78349099]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-78349099]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-78349099]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-78349099]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-78349099]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-78349099]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-78349099]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-88e82b42]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-88e82b42]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-88e82b42]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-88e82b42]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-88e82b42]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-88e82b42]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-88e82b42]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-7beafc0d]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-7beafc0d]{margin:0;font-weight:600}.fitness-measure[data-v-7beafc0d]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-7beafc0d]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-27cf7d88]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-27cf7d88]{margin:0;font-weight:600}.load-row[data-v-27cf7d88]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-27cf7d88]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-de71da80]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-de71da80]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-de71da80]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-de71da80]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-de71da80]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-de71da80]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-de71da80]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as k, computed as g, onUnmounted as E, openBlock as a, createElementBlock as r, Fragment as m, createElementVNode as e, toDisplayString as i, unref as p, createCommentVNode as b, renderList as I } from "vue";
import { useWindow as N } from "@journal/window-kit";
import { _ as M } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const P = "Model not reported", v = (u) => `$${Number(u || 0).toFixed(2)}`;
function C(u, l) {
  const d = /* @__PURE__ */ new Map();
  for (const o of u.filter((n) => n.cost_dollars > 0)) d.set(l(o), (d.get(l(o)) ?? 0) + o.cost_dollars);
  return [...d].map(([o, n]) => ({ label: o, cost: n })).sort((o, n) => n.cost - o.cost);
}
const w = (u) => C(u, (l) => l.model || P), A = (u) => C(u, (l) => `${l.role} ${l.id}`), B = {
  key: 0,
  class: "none"
}, L = {
  class: "line total",
  "data-cost-total": ""
}, S = {
  key: 0,
  class: "line",
  "data-cost-session": ""
}, $ = {
  key: 2,
  class: "none"
}, h = 3e4, D = {
  __name: "CostPanel",
  setup(u) {
    const l = N(), d = k(null), o = k(""), n = g(() => {
      var s;
      return ((s = d.value) == null ? void 0 : s.agents) ?? [];
    }), _ = g(() => n.value.find((s) => s.id === l.agent) ?? null), f = g(() => n.value.reduce((s, t) => s + (t.cost_dollars || 0), 0));
    async function y() {
      const s = await l.read("usage show");
      d.value = s.ok ? s.value : null, o.value = s.ok ? "" : s.error;
    }
    const x = setInterval(y, h);
    return E(() => clearInterval(x)), y(), (s, t) => (a(), r(m, null, [
      t[4] || (t[4] = e("p", { class: "current" }, "Predicted API price", -1)),
      t[5] || (t[5] = e("p", {
        class: "note",
        "data-cost-note": ""
      }, "What these sessions would cost when using Claude Code or Codex through an API. It is not what a plan charges.", -1)),
      o.value ? (a(), r("p", B, i(o.value), 1)) : d.value ? (a(), r(m, { key: 1 }, [
        e("div", L, [
          t[0] || (t[0] = e("span", null, "All open sessions", -1)),
          e("strong", null, i(p(v)(f.value)), 1)
        ]),
        _.value ? (a(), r("div", S, [
          t[1] || (t[1] = e("span", null, "This session", -1)),
          e("strong", null, i(p(v)(_.value.cost_dollars)), 1)
        ])) : b("", !0),
        f.value > 0 ? (a(), r(m, { key: 1 }, [
          t[2] || (t[2] = e("p", { class: "group" }, "By model", -1)),
          (a(!0), r(m, null, I(p(w)(n.value), (c) => (a(), r("div", {
            key: c.label,
            class: "line",
            "data-cost-model": ""
          }, [
            e("span", null, i(c.label), 1),
            e("strong", null, i(p(v)(c.cost)), 1)
          ]))), 128)),
          t[3] || (t[3] = e("p", { class: "group" }, "By agent", -1)),
          (a(!0), r(m, null, I(p(A)(n.value), (c) => (a(), r("div", {
            key: c.label,
            class: "line",
            "data-cost-agent": ""
          }, [
            e("span", null, i(c.label), 1),
            e("strong", null, i(p(v)(c.cost)), 1)
          ]))), 128))
        ], 64)) : (a(), r("p", $, "No session has reported a cost yet."))
      ], 64)) : b("", !0)
    ], 64));
  }
}, V = /* @__PURE__ */ M(D, [["__scopeId", "data-v-88e82b42"]]);
export {
  V as default
};
