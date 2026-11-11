if (!document.getElementById("window-styles-985f8e9d4880")) { const style = document.createElement("style"); style.id = "window-styles-985f8e9d4880"; style.textContent = ".current[data-v-cc48d24a]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-cc48d24a]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-cc48d24a]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-cc48d24a]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-cc48d24a]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-cc48d24a]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-cc48d24a]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-e020b3e9]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-e020b3e9]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-e020b3e9]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-e020b3e9]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-e020b3e9]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-e020b3e9]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-e020b3e9]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-f3fd6de8]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-f3fd6de8]{margin:0;font-weight:600}.fitness-measure[data-v-f3fd6de8]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-f3fd6de8]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-9de62706]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-9de62706]{margin:0;font-weight:600}.load-row[data-v-9de62706]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-9de62706]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-5d403466]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-5d403466]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-5d403466]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-5d403466]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-5d403466]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-5d403466]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.limit-form[data-v-5d403466]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr) 64px auto;gap:6px;padding:8px 0}.limit-form select[data-v-5d403466],.limit-form .percent[data-v-5d403466]{box-sizing:border-box;width:100%;min-width:0}.limit-form .current[data-v-5d403466]{grid-column:1 / -1;padding:0}.none[data-v-5d403466]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as f, openBlock as o, createBlock as C, unref as l, withCtx as B, createElementVNode as t, createElementBlock as a, toDisplayString as i, Fragment as g, createCommentVNode as v, renderList as y } from "vue";
import { useWindow as P, WindowRoom as N } from "@journal/window-kit";
import { _ as A } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const I = "Model not reported", m = (u) => `$${Number(u || 0).toFixed(2)}`;
function _(u, s) {
  const c = /* @__PURE__ */ new Map();
  for (const d of u.filter((n) => n.cost_dollars > 0)) c.set(s(d), (c.get(s(d)) ?? 0) + d.cost_dollars);
  return [...c].map(([d, n]) => ({ label: d, cost: n })).sort((d, n) => n.cost - d.cost);
}
const M = (u) => _(u, (s) => s.model || I), $ = (u) => _(u, (s) => `${s.role} ${s.number}`), x = (u) => _(u.filter((s) => s.profile), (s) => s.profile), w = {
  key: 0,
  class: "none"
}, E = {
  class: "line total",
  "data-cost-total": ""
}, W = {
  key: 0,
  class: "line",
  "data-cost-session": ""
}, h = {
  key: 2,
  class: "none"
}, D = {
  __name: "CostPanel",
  setup(u) {
    const s = P(), { data: c, failure: d } = s.props.usage, n = f(() => {
      var p;
      return ((p = c.value) == null ? void 0 : p.agents) ?? [];
    }), b = f(() => n.value.find((p) => p.id === s.agent) ?? null), k = f(() => n.value.reduce((p, e) => p + (e.cost_dollars || 0), 0));
    return (p, e) => (o(), C(l(N), { padding: "14px 16px" }, {
      default: B(() => [
        e[5] || (e[5] = t("p", { class: "current" }, "Predicted API price", -1)),
        e[6] || (e[6] = t("p", {
          class: "note",
          "data-cost-note": ""
        }, "What these sessions would cost when using Claude Code or Codex through an API. It is not what a plan charges.", -1)),
        l(d) ? (o(), a("p", w, i(l(d)), 1)) : l(c) ? (o(), a(g, { key: 1 }, [
          t("div", E, [
            e[0] || (e[0] = t("span", null, "All open sessions", -1)),
            t("strong", null, i(l(m)(k.value)), 1)
          ]),
          b.value ? (o(), a("div", W, [
            e[1] || (e[1] = t("span", null, "This session", -1)),
            t("strong", null, i(l(m)(b.value.cost_dollars)), 1)
          ])) : v("", !0),
          k.value > 0 ? (o(), a(g, { key: 1 }, [
            e[3] || (e[3] = t("p", { class: "group" }, "By model", -1)),
            (o(!0), a(g, null, y(l(M)(n.value), (r) => (o(), a("div", {
              key: r.label,
              class: "line",
              "data-cost-model": ""
            }, [
              t("span", null, i(r.label), 1),
              t("strong", null, i(l(m)(r.cost)), 1)
            ]))), 128)),
            e[4] || (e[4] = t("p", { class: "group" }, "By agent", -1)),
            (o(!0), a(g, null, y(l($)(n.value), (r) => (o(), a("div", {
              key: r.label,
              class: "line",
              "data-cost-agent": ""
            }, [
              t("span", null, i(r.label), 1),
              t("strong", null, i(l(m)(r.cost)), 1)
            ]))), 128)),
            l(x)(n.value).length ? (o(), a(g, { key: 0 }, [
              e[2] || (e[2] = t("p", { class: "group" }, "By profile", -1)),
              (o(!0), a(g, null, y(l(x)(n.value), (r) => (o(), a("div", {
                key: r.label,
                class: "line",
                "data-cost-profile": ""
              }, [
                t("span", null, i(r.label), 1),
                t("strong", null, i(l(m)(r.cost)), 1)
              ]))), 128))
            ], 64)) : v("", !0)
          ], 64)) : (o(), a("p", h, "No session has reported a cost yet."))
        ], 64)) : v("", !0)
      ]),
      _: 1
    }));
  }
}, O = /* @__PURE__ */ A(D, [["__scopeId", "data-v-e020b3e9"]]);
export {
  O as default
};
