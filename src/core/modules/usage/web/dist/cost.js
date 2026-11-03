/* @code-commandments-generated */
if (!document.getElementById("window-styles-4e9ee7695254")) { const style = document.createElement("style"); style.id = "window-styles-4e9ee7695254"; style.textContent = ".current[data-v-6f487acc]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-6f487acc]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-6f487acc]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-6f487acc]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-6f487acc]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-6f487acc]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-6f487acc]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-dad3ba37]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-dad3ba37]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-dad3ba37]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-dad3ba37]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-dad3ba37]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-dad3ba37]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-dad3ba37]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-7beafc0d]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-7beafc0d]{margin:0;font-weight:600}.fitness-measure[data-v-7beafc0d]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-7beafc0d]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-27cf7d88]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-27cf7d88]{margin:0;font-weight:600}.load-row[data-v-27cf7d88]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-27cf7d88]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-b7f1678d]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-b7f1678d]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-b7f1678d]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-b7f1678d]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-b7f1678d]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-b7f1678d]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-b7f1678d]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as _, openBlock as o, createElementBlock as l, Fragment as g, createElementVNode as t, unref as a, toDisplayString as i, createCommentVNode as b, renderList as k } from "vue";
import { useWindow as x, useUsage as E, usePoll as I } from "@journal/window-kit";
import { _ as N } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const P = "Model not reported", v = (r) => `$${Number(r || 0).toFixed(2)}`;
function C(r, n) {
  const p = /* @__PURE__ */ new Map();
  for (const e of r.filter((u) => u.cost_dollars > 0)) p.set(n(e), (p.get(n(e)) ?? 0) + e.cost_dollars);
  return [...p].map(([e, u]) => ({ label: e, cost: u })).sort((e, u) => u.cost - e.cost);
}
const M = (r) => C(r, (n) => n.model || P), A = (r) => C(r, (n) => `${n.role} ${n.id}`), B = {
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
}, D = 3e4, F = {
  __name: "CostPanel",
  setup(r) {
    const n = x(), { value: p, failure: e, load: u } = E(), m = _(() => {
      var d;
      return ((d = p.value) == null ? void 0 : d.agents) ?? [];
    }), f = _(() => m.value.find((d) => d.id === n.agent) ?? null), y = _(() => m.value.reduce((d, s) => d + (s.cost_dollars || 0), 0));
    return I(u, () => !0, D), (d, s) => (o(), l(g, null, [
      s[4] || (s[4] = t("p", { class: "current" }, "Predicted API price", -1)),
      s[5] || (s[5] = t("p", {
        class: "note",
        "data-cost-note": ""
      }, "What these sessions would cost when using Claude Code or Codex through an API. It is not what a plan charges.", -1)),
      a(e) ? (o(), l("p", B, i(a(e)), 1)) : a(p) ? (o(), l(g, { key: 1 }, [
        t("div", L, [
          s[0] || (s[0] = t("span", null, "All open sessions", -1)),
          t("strong", null, i(a(v)(y.value)), 1)
        ]),
        f.value ? (o(), l("div", S, [
          s[1] || (s[1] = t("span", null, "This session", -1)),
          t("strong", null, i(a(v)(f.value.cost_dollars)), 1)
        ])) : b("", !0),
        y.value > 0 ? (o(), l(g, { key: 1 }, [
          s[2] || (s[2] = t("p", { class: "group" }, "By model", -1)),
          (o(!0), l(g, null, k(a(M)(m.value), (c) => (o(), l("div", {
            key: c.label,
            class: "line",
            "data-cost-model": ""
          }, [
            t("span", null, i(c.label), 1),
            t("strong", null, i(a(v)(c.cost)), 1)
          ]))), 128)),
          s[3] || (s[3] = t("p", { class: "group" }, "By agent", -1)),
          (o(!0), l(g, null, k(a(A)(m.value), (c) => (o(), l("div", {
            key: c.label,
            class: "line",
            "data-cost-agent": ""
          }, [
            t("span", null, i(c.label), 1),
            t("strong", null, i(a(v)(c.cost)), 1)
          ]))), 128))
        ], 64)) : (o(), l("p", $, "No session has reported a cost yet."))
      ], 64)) : b("", !0)
    ], 64));
  }
}, R = /* @__PURE__ */ N(F, [["__scopeId", "data-v-dad3ba37"]]);
export {
  R as default
};
