/* @code-commandments-generated */
if (!document.getElementById("window-styles-735e864b0b95")) { const style = document.createElement("style"); style.id = "window-styles-735e864b0b95"; style.textContent = ".current[data-v-3111db78]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-3111db78]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-3111db78]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-3111db78]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-3111db78]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-3111db78]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-3111db78]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-6399fd38]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-6399fd38]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-6399fd38]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-6399fd38]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-6399fd38]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-6399fd38]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-6399fd38]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-a0ba159b]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-a0ba159b]{margin:0;font-weight:600}.fitness-measure[data-v-a0ba159b]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-a0ba159b]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-fd584773]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-fd584773]{margin:0;font-weight:600}.load-row[data-v-fd584773]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-fd584773]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-bf472fbc]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-bf472fbc]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-bf472fbc]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-bf472fbc]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-bf472fbc]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-bf472fbc]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-bf472fbc]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as v, openBlock as o, createBlock as b, unref as l, withCtx as E, createElementVNode as s, createElementBlock as a, toDisplayString as i, Fragment as m, createCommentVNode as k, renderList as x } from "vue";
import { useWindow as I, useUsage as N, usePoll as P, WindowRoom as B } from "@journal/window-kit";
import { _ as M } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const w = "Model not reported", _ = (r) => `$${Number(r || 0).toFixed(2)}`;
function C(r, n) {
  const p = /* @__PURE__ */ new Map();
  for (const e of r.filter((u) => u.cost_dollars > 0)) p.set(n(e), (p.get(n(e)) ?? 0) + e.cost_dollars);
  return [...p].map(([e, u]) => ({ label: e, cost: u })).sort((e, u) => u.cost - e.cost);
}
const A = (r) => C(r, (n) => n.model || w), L = (r) => C(r, (n) => `${n.role} ${n.id}`), S = {
  key: 0,
  class: "none"
}, $ = {
  class: "line total",
  "data-cost-total": ""
}, h = {
  key: 0,
  class: "line",
  "data-cost-session": ""
}, D = {
  key: 2,
  class: "none"
}, F = 3e4, R = {
  __name: "CostPanel",
  setup(r) {
    const n = I(), { value: p, failure: e, load: u } = N(), g = v(() => {
      var d;
      return ((d = p.value) == null ? void 0 : d.agents) ?? [];
    }), f = v(() => g.value.find((d) => d.id === n.agent) ?? null), y = v(() => g.value.reduce((d, t) => d + (t.cost_dollars || 0), 0));
    return P(u, () => !0, F), (d, t) => (o(), b(l(B), { padding: "14px 16px" }, {
      default: E(() => [
        t[4] || (t[4] = s("p", { class: "current" }, "Predicted API price", -1)),
        t[5] || (t[5] = s("p", {
          class: "note",
          "data-cost-note": ""
        }, "What these sessions would cost when using Claude Code or Codex through an API. It is not what a plan charges.", -1)),
        l(e) ? (o(), a("p", S, i(l(e)), 1)) : l(p) ? (o(), a(m, { key: 1 }, [
          s("div", $, [
            t[0] || (t[0] = s("span", null, "All open sessions", -1)),
            s("strong", null, i(l(_)(y.value)), 1)
          ]),
          f.value ? (o(), a("div", h, [
            t[1] || (t[1] = s("span", null, "This session", -1)),
            s("strong", null, i(l(_)(f.value.cost_dollars)), 1)
          ])) : k("", !0),
          y.value > 0 ? (o(), a(m, { key: 1 }, [
            t[2] || (t[2] = s("p", { class: "group" }, "By model", -1)),
            (o(!0), a(m, null, x(l(A)(g.value), (c) => (o(), a("div", {
              key: c.label,
              class: "line",
              "data-cost-model": ""
            }, [
              s("span", null, i(c.label), 1),
              s("strong", null, i(l(_)(c.cost)), 1)
            ]))), 128)),
            t[3] || (t[3] = s("p", { class: "group" }, "By agent", -1)),
            (o(!0), a(m, null, x(l(L)(g.value), (c) => (o(), a("div", {
              key: c.label,
              class: "line",
              "data-cost-agent": ""
            }, [
              s("span", null, i(c.label), 1),
              s("strong", null, i(l(_)(c.cost)), 1)
            ]))), 128))
          ], 64)) : (o(), a("p", D, "No session has reported a cost yet."))
        ], 64)) : k("", !0)
      ]),
      _: 1
    }));
  }
}, H = /* @__PURE__ */ M(R, [["__scopeId", "data-v-6399fd38"]]);
export {
  H as default
};
