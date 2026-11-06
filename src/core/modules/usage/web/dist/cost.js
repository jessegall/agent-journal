/* @code-commandments-generated */
if (!document.getElementById("window-styles-04a13e104bec")) { const style = document.createElement("style"); style.id = "window-styles-04a13e104bec"; style.textContent = ".current[data-v-845f2d56]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-845f2d56]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-845f2d56]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-845f2d56]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-845f2d56]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-845f2d56]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-845f2d56]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-ef30dc1b]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-ef30dc1b]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-ef30dc1b]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-ef30dc1b]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-ef30dc1b]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-ef30dc1b]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-ef30dc1b]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-b55877dd]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-b55877dd]{margin:0;font-weight:600}.fitness-measure[data-v-b55877dd]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-b55877dd]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-fd584773]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-fd584773]{margin:0;font-weight:600}.load-row[data-v-fd584773]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-fd584773]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-bf472fbc]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-bf472fbc]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-bf472fbc]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-bf472fbc]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-bf472fbc]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-bf472fbc]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-bf472fbc]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as v, openBlock as o, createBlock as P, unref as l, withCtx as B, createElementVNode as t, createElementBlock as n, toDisplayString as d, Fragment as m, createCommentVNode as y, renderList as _ } from "vue";
import { useWindow as E, useUsage as I, usePoll as N, WindowRoom as M } from "@journal/window-kit";
import { _ as A } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const L = "Model not reported", f = (r) => `$${Number(r || 0).toFixed(2)}`;
function b(r, s) {
  const p = /* @__PURE__ */ new Map();
  for (const u of r.filter((i) => i.cost_dollars > 0)) p.set(s(u), (p.get(s(u)) ?? 0) + u.cost_dollars);
  return [...p].map(([u, i]) => ({ label: u, cost: i })).sort((u, i) => i.cost - u.cost);
}
const S = (r) => b(r, (s) => s.model || L), $ = (r) => b(r, (s) => `${s.role} ${s.id}`), C = (r) => b(r.filter((s) => s.profile), (s) => s.profile), D = {
  key: 0,
  class: "none"
}, F = {
  class: "line total",
  "data-cost-total": ""
}, R = {
  key: 0,
  class: "line",
  "data-cost-session": ""
}, W = {
  key: 2,
  class: "none"
}, h = 3e4, w = {
  __name: "CostPanel",
  setup(r) {
    const s = E(), { value: p, failure: u, load: i } = I(), g = v(() => {
      var c;
      return ((c = p.value) == null ? void 0 : c.agents) ?? [];
    }), k = v(() => g.value.find((c) => c.id === s.agent) ?? null), x = v(() => g.value.reduce((c, e) => c + (e.cost_dollars || 0), 0));
    return N(i, () => !0, h), (c, e) => (o(), P(l(M), { padding: "14px 16px" }, {
      default: B(() => [
        e[5] || (e[5] = t("p", { class: "current" }, "Predicted API price", -1)),
        e[6] || (e[6] = t("p", {
          class: "note",
          "data-cost-note": ""
        }, "What these sessions would cost when using Claude Code or Codex through an API. It is not what a plan charges.", -1)),
        l(u) ? (o(), n("p", D, d(l(u)), 1)) : l(p) ? (o(), n(m, { key: 1 }, [
          t("div", F, [
            e[0] || (e[0] = t("span", null, "All open sessions", -1)),
            t("strong", null, d(l(f)(x.value)), 1)
          ]),
          k.value ? (o(), n("div", R, [
            e[1] || (e[1] = t("span", null, "This session", -1)),
            t("strong", null, d(l(f)(k.value.cost_dollars)), 1)
          ])) : y("", !0),
          x.value > 0 ? (o(), n(m, { key: 1 }, [
            e[3] || (e[3] = t("p", { class: "group" }, "By model", -1)),
            (o(!0), n(m, null, _(l(S)(g.value), (a) => (o(), n("div", {
              key: a.label,
              class: "line",
              "data-cost-model": ""
            }, [
              t("span", null, d(a.label), 1),
              t("strong", null, d(l(f)(a.cost)), 1)
            ]))), 128)),
            e[4] || (e[4] = t("p", { class: "group" }, "By agent", -1)),
            (o(!0), n(m, null, _(l($)(g.value), (a) => (o(), n("div", {
              key: a.label,
              class: "line",
              "data-cost-agent": ""
            }, [
              t("span", null, d(a.label), 1),
              t("strong", null, d(l(f)(a.cost)), 1)
            ]))), 128)),
            l(C)(g.value).length ? (o(), n(m, { key: 0 }, [
              e[2] || (e[2] = t("p", { class: "group" }, "By profile", -1)),
              (o(!0), n(m, null, _(l(C)(g.value), (a) => (o(), n("div", {
                key: a.label,
                class: "line",
                "data-cost-profile": ""
              }, [
                t("span", null, d(a.label), 1),
                t("strong", null, d(l(f)(a.cost)), 1)
              ]))), 128))
            ], 64)) : y("", !0)
          ], 64)) : (o(), n("p", W, "No session has reported a cost yet."))
        ], 64)) : y("", !0)
      ]),
      _: 1
    }));
  }
}, T = /* @__PURE__ */ A(w, [["__scopeId", "data-v-ef30dc1b"]]);
export {
  T as default
};
