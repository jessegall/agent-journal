if (!document.getElementById("window-styles-5d8b7a1aa408")) { const style = document.createElement("style"); style.id = "window-styles-5d8b7a1aa408"; style.textContent = ".current[data-v-2e50afc3]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-2e50afc3]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-2e50afc3]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-2e50afc3]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-2e50afc3]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-2e50afc3]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-2e50afc3]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-52b7a0da]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-52b7a0da]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-52b7a0da]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-52b7a0da]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-52b7a0da]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-52b7a0da]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-52b7a0da]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-1b832570]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-1b832570]{margin:0;font-weight:600}.fitness-measure[data-v-1b832570]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-1b832570]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-046f30aa]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-046f30aa]{margin:0;font-weight:600}.load-row[data-v-046f30aa]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-046f30aa]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-0257f7eb]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-0257f7eb]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-0257f7eb]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-0257f7eb]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-0257f7eb]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-0257f7eb]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.limit-form[data-v-0257f7eb]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr) 64px auto;gap:6px;padding:8px 0}.limit-form select[data-v-0257f7eb],.limit-form .percent[data-v-0257f7eb]{box-sizing:border-box;width:100%;min-width:0}.limit-form .current[data-v-0257f7eb]{grid-column:1 / -1;padding:0}.none[data-v-0257f7eb]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as f, openBlock as r, createBlock as B, unref as a, withCtx as N, createElementVNode as s, createElementBlock as u, toDisplayString as d, Fragment as m, createCommentVNode as v, renderList as _ } from "vue";
import { useWindow as E, WindowRoom as I } from "@journal/window-kit";
import { _ as M } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const $ = "main", P = { main: "Main agent", worker: "Worker", helper: "Helper" }, x = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), A = (e, o, i, t) => e.role === $ ? o : i ? `${o} ${t}` : `${o} ${e.number}`, L = (e) => `${e.role} ${e.number}`;
function O(e, o = e.facts) {
  const i = P[e.role] ?? x(e.role), t = (o == null ? void 0 : o.profile_title) || (o == null ? void 0 : o.profile) || e.profile_title || e.profile || "", n = e.role === $ ? "" : [t ? x(t) : "", L(e)].filter(Boolean).join(" · ");
  return { title: i, subtext: n, text: A(e, i, t, n) };
}
const T = "Model not reported", g = (e) => `$${Number(e || 0).toFixed(2)}`;
function y(e, o) {
  const i = /* @__PURE__ */ new Map();
  for (const t of e.filter((n) => n.cost_dollars > 0)) i.set(o(t), (i.get(o(t)) ?? 0) + t.cost_dollars);
  return [...i].map(([t, n]) => ({ label: t, cost: n })).sort((t, n) => n.cost - t.cost);
}
const W = (e) => y(e, (o) => o.model || T), h = (e) => y(e, (o) => O(o).text), C = (e) => y(e.filter((o) => o.profile), (o) => o.profile), w = {
  key: 0,
  class: "none"
}, R = {
  class: "line total",
  "data-cost-total": ""
}, D = {
  key: 0,
  class: "line",
  "data-cost-session": ""
}, F = {
  key: 2,
  class: "none"
}, S = {
  __name: "CostPanel",
  setup(e) {
    const o = E(), { data: i, failure: t } = o.props.usage, n = f(() => {
      var c;
      return ((c = i.value) == null ? void 0 : c.agents) ?? [];
    }), b = f(() => n.value.find((c) => c.id === o.agent) ?? null), k = f(() => n.value.reduce((c, l) => c + (l.cost_dollars || 0), 0));
    return (c, l) => (r(), B(a(I), { padding: "14px 16px" }, {
      default: N(() => [
        l[5] || (l[5] = s("p", { class: "current" }, "Predicted API price", -1)),
        l[6] || (l[6] = s("p", {
          class: "note",
          "data-cost-note": ""
        }, "What these sessions would cost when using Claude Code or Codex through an API. It is not what a plan charges.", -1)),
        a(t) ? (r(), u("p", w, d(a(t)), 1)) : a(i) ? (r(), u(m, { key: 1 }, [
          s("div", R, [
            l[0] || (l[0] = s("span", null, "All open sessions", -1)),
            s("strong", null, d(a(g)(k.value)), 1)
          ]),
          b.value ? (r(), u("div", D, [
            l[1] || (l[1] = s("span", null, "This session", -1)),
            s("strong", null, d(a(g)(b.value.cost_dollars)), 1)
          ])) : v("", !0),
          k.value > 0 ? (r(), u(m, { key: 1 }, [
            l[3] || (l[3] = s("p", { class: "group" }, "By model", -1)),
            (r(!0), u(m, null, _(a(W)(n.value), (p) => (r(), u("div", {
              key: p.label,
              class: "line",
              "data-cost-model": ""
            }, [
              s("span", null, d(p.label), 1),
              s("strong", null, d(a(g)(p.cost)), 1)
            ]))), 128)),
            l[4] || (l[4] = s("p", { class: "group" }, "By agent", -1)),
            (r(!0), u(m, null, _(a(h)(n.value), (p) => (r(), u("div", {
              key: p.label,
              class: "line",
              "data-cost-agent": ""
            }, [
              s("span", null, d(p.label), 1),
              s("strong", null, d(a(g)(p.cost)), 1)
            ]))), 128)),
            a(C)(n.value).length ? (r(), u(m, { key: 0 }, [
              l[2] || (l[2] = s("p", { class: "group" }, "By profile", -1)),
              (r(!0), u(m, null, _(a(C)(n.value), (p) => (r(), u("div", {
                key: p.label,
                class: "line",
                "data-cost-profile": ""
              }, [
                s("span", null, d(p.label), 1),
                s("strong", null, d(a(g)(p.cost)), 1)
              ]))), 128))
            ], 64)) : v("", !0)
          ], 64)) : (r(), u("p", F, "No session has reported a cost yet."))
        ], 64)) : v("", !0)
      ]),
      _: 1
    }));
  }
}, U = /* @__PURE__ */ M(S, [["__scopeId", "data-v-52b7a0da"]]);
export {
  U as default
};
