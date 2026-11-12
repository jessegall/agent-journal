if (!document.getElementById("window-styles-42d6fdc96829")) { const style = document.createElement("style"); style.id = "window-styles-42d6fdc96829"; style.textContent = ".current[data-v-2e50afc3]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-2e50afc3]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-2e50afc3]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-2e50afc3]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-2e50afc3]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-2e50afc3]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-2e50afc3]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-52b7a0da]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-52b7a0da]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-52b7a0da]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-52b7a0da]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-52b7a0da]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-52b7a0da]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-52b7a0da]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-1b832570]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-1b832570]{margin:0;font-weight:600}.fitness-measure[data-v-1b832570]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-1b832570]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-046f30aa]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-046f30aa]{margin:0;font-weight:600}.load-row[data-v-046f30aa]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-046f30aa]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-03866611]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-03866611]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-03866611]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-03866611]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-03866611]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-03866611]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.limit-form[data-v-03866611]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr) 64px auto;gap:6px;padding:8px 0}.limit-form select[data-v-03866611],.limit-form .percent[data-v-03866611]{box-sizing:border-box;width:100%;min-width:0}.limit-form .current[data-v-03866611]{grid-column:1 / -1;padding:0}.none[data-v-03866611]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as g, openBlock as r, createBlock as M, unref as a, withCtx as A, createElementVNode as s, createElementBlock as u, toDisplayString as d, Fragment as m, createCommentVNode as v, renderList as _ } from "vue";
import { useWindow as B, WindowRoom as E } from "@journal/window-kit";
import { _ as I } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const y = "main", C = "Main agent", P = { main: C, worker: "Worker", helper: "Helper" }, b = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), L = (e, o, i, t) => e.role === y ? o : i ? `${o} ${t}` : `${o} ${e.number}`, O = (e) => `${e.role} ${e.number}`, T = (e) => e.role === y ? C : `${b(e.role)} ${e.number}`;
function W(e, o = e.facts) {
  const i = P[e.role] ?? b(e.role), t = (o == null ? void 0 : o.profile_title) || (o == null ? void 0 : o.profile) || e.profile_title || e.profile || "", n = e.role === y ? "" : [t ? b(t) : "", O(e)].filter(Boolean).join(" · ");
  return { title: i, subtext: n, text: L(e, i, t, n), name: T(e) };
}
const h = "Model not reported", f = (e) => `$${Number(e || 0).toFixed(2)}`;
function k(e, o) {
  const i = /* @__PURE__ */ new Map();
  for (const t of e.filter((n) => n.cost_dollars > 0)) i.set(o(t), (i.get(o(t)) ?? 0) + t.cost_dollars);
  return [...i].map(([t, n]) => ({ label: t, cost: n })).sort((t, n) => n.cost - t.cost);
}
const w = (e) => k(e, (o) => o.model || h), R = (e) => k(e, (o) => W(o).text), $ = (e) => k(e.filter((o) => o.profile), (o) => o.profile), D = {
  key: 0,
  class: "none"
}, F = {
  class: "line total",
  "data-cost-total": ""
}, S = {
  key: 0,
  class: "line",
  "data-cost-session": ""
}, V = {
  key: 2,
  class: "none"
}, j = {
  __name: "CostPanel",
  setup(e) {
    const o = B(), { data: i, failure: t } = o.props.usage, n = g(() => {
      var c;
      return ((c = i.value) == null ? void 0 : c.agents) ?? [];
    }), x = g(() => n.value.find((c) => c.id === o.agent) ?? null), N = g(() => n.value.reduce((c, l) => c + (l.cost_dollars || 0), 0));
    return (c, l) => (r(), M(a(E), { padding: "14px 16px" }, {
      default: A(() => [
        l[5] || (l[5] = s("p", { class: "current" }, "Predicted API price", -1)),
        l[6] || (l[6] = s("p", {
          class: "note",
          "data-cost-note": ""
        }, "What these sessions would cost when using Claude Code or Codex through an API. It is not what a plan charges.", -1)),
        a(t) ? (r(), u("p", D, d(a(t)), 1)) : a(i) ? (r(), u(m, { key: 1 }, [
          s("div", F, [
            l[0] || (l[0] = s("span", null, "All open sessions", -1)),
            s("strong", null, d(a(f)(N.value)), 1)
          ]),
          x.value ? (r(), u("div", S, [
            l[1] || (l[1] = s("span", null, "This session", -1)),
            s("strong", null, d(a(f)(x.value.cost_dollars)), 1)
          ])) : v("", !0),
          N.value > 0 ? (r(), u(m, { key: 1 }, [
            l[3] || (l[3] = s("p", { class: "group" }, "By model", -1)),
            (r(!0), u(m, null, _(a(w)(n.value), (p) => (r(), u("div", {
              key: p.label,
              class: "line",
              "data-cost-model": ""
            }, [
              s("span", null, d(p.label), 1),
              s("strong", null, d(a(f)(p.cost)), 1)
            ]))), 128)),
            l[4] || (l[4] = s("p", { class: "group" }, "By agent", -1)),
            (r(!0), u(m, null, _(a(R)(n.value), (p) => (r(), u("div", {
              key: p.label,
              class: "line",
              "data-cost-agent": ""
            }, [
              s("span", null, d(p.label), 1),
              s("strong", null, d(a(f)(p.cost)), 1)
            ]))), 128)),
            a($)(n.value).length ? (r(), u(m, { key: 0 }, [
              l[2] || (l[2] = s("p", { class: "group" }, "By profile", -1)),
              (r(!0), u(m, null, _(a($)(n.value), (p) => (r(), u("div", {
                key: p.label,
                class: "line",
                "data-cost-profile": ""
              }, [
                s("span", null, d(p.label), 1),
                s("strong", null, d(a(f)(p.cost)), 1)
              ]))), 128))
            ], 64)) : v("", !0)
          ], 64)) : (r(), u("p", V, "No session has reported a cost yet."))
        ], 64)) : v("", !0)
      ]),
      _: 1
    }));
  }
}, z = /* @__PURE__ */ I(j, [["__scopeId", "data-v-52b7a0da"]]);
export {
  z as default
};
