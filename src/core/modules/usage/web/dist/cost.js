if (!document.getElementById("window-styles-5d8b7a1aa408")) { const style = document.createElement("style"); style.id = "window-styles-5d8b7a1aa408"; style.textContent = ".current[data-v-2e50afc3]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-2e50afc3]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-2e50afc3]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-2e50afc3]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-2e50afc3]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-2e50afc3]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-2e50afc3]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-52b7a0da]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-52b7a0da]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-52b7a0da]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-52b7a0da]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-52b7a0da]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-52b7a0da]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-52b7a0da]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-1b832570]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-1b832570]{margin:0;font-weight:600}.fitness-measure[data-v-1b832570]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-1b832570]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-046f30aa]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-046f30aa]{margin:0;font-weight:600}.load-row[data-v-046f30aa]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-046f30aa]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-0257f7eb]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-0257f7eb]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-0257f7eb]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-0257f7eb]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-0257f7eb]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-0257f7eb]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.limit-form[data-v-0257f7eb]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr) 64px auto;gap:6px;padding:8px 0}.limit-form select[data-v-0257f7eb],.limit-form .percent[data-v-0257f7eb]{box-sizing:border-box;width:100%;min-width:0}.limit-form .current[data-v-0257f7eb]{grid-column:1 / -1;padding:0}.none[data-v-0257f7eb]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as f, openBlock as r, createBlock as B, unref as a, withCtx as N, createElementVNode as s, createElementBlock as i, toDisplayString as d, Fragment as m, createCommentVNode as v, renderList as _ } from "vue";
import { useWindow as E, WindowRoom as I } from "@journal/window-kit";
import { _ as M } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const P = "main", $ = { main: "Main agent", worker: "Worker", helper: "Helper" }, x = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), A = (e) => `${e.role} ${e.number}`;
function L(e, t = e.facts) {
  const p = $[e.role] ?? x(e.role), n = (t == null ? void 0 : t.profile_title) || (t == null ? void 0 : t.profile) || e.profile_title || e.profile || "", o = e.role === P ? "" : [n ? x(n) : "", A(e)].filter(Boolean).join(" · ");
  return { title: p, subtext: o, text: o ? `${p} ${o}` : p };
}
const T = "Model not reported", g = (e) => `$${Number(e || 0).toFixed(2)}`;
function y(e, t) {
  const p = /* @__PURE__ */ new Map();
  for (const n of e.filter((o) => o.cost_dollars > 0)) p.set(t(n), (p.get(t(n)) ?? 0) + n.cost_dollars);
  return [...p].map(([n, o]) => ({ label: n, cost: o })).sort((n, o) => o.cost - n.cost);
}
const W = (e) => y(e, (t) => t.model || T), h = (e) => y(e, (t) => L(t).text), C = (e) => y(e.filter((t) => t.profile), (t) => t.profile), w = {
  key: 0,
  class: "none"
}, O = {
  class: "line total",
  "data-cost-total": ""
}, R = {
  key: 0,
  class: "line",
  "data-cost-session": ""
}, D = {
  key: 2,
  class: "none"
}, F = {
  __name: "CostPanel",
  setup(e) {
    const t = E(), { data: p, failure: n } = t.props.usage, o = f(() => {
      var c;
      return ((c = p.value) == null ? void 0 : c.agents) ?? [];
    }), b = f(() => o.value.find((c) => c.id === t.agent) ?? null), k = f(() => o.value.reduce((c, l) => c + (l.cost_dollars || 0), 0));
    return (c, l) => (r(), B(a(I), { padding: "14px 16px" }, {
      default: N(() => [
        l[5] || (l[5] = s("p", { class: "current" }, "Predicted API price", -1)),
        l[6] || (l[6] = s("p", {
          class: "note",
          "data-cost-note": ""
        }, "What these sessions would cost when using Claude Code or Codex through an API. It is not what a plan charges.", -1)),
        a(n) ? (r(), i("p", w, d(a(n)), 1)) : a(p) ? (r(), i(m, { key: 1 }, [
          s("div", O, [
            l[0] || (l[0] = s("span", null, "All open sessions", -1)),
            s("strong", null, d(a(g)(k.value)), 1)
          ]),
          b.value ? (r(), i("div", R, [
            l[1] || (l[1] = s("span", null, "This session", -1)),
            s("strong", null, d(a(g)(b.value.cost_dollars)), 1)
          ])) : v("", !0),
          k.value > 0 ? (r(), i(m, { key: 1 }, [
            l[3] || (l[3] = s("p", { class: "group" }, "By model", -1)),
            (r(!0), i(m, null, _(a(W)(o.value), (u) => (r(), i("div", {
              key: u.label,
              class: "line",
              "data-cost-model": ""
            }, [
              s("span", null, d(u.label), 1),
              s("strong", null, d(a(g)(u.cost)), 1)
            ]))), 128)),
            l[4] || (l[4] = s("p", { class: "group" }, "By agent", -1)),
            (r(!0), i(m, null, _(a(h)(o.value), (u) => (r(), i("div", {
              key: u.label,
              class: "line",
              "data-cost-agent": ""
            }, [
              s("span", null, d(u.label), 1),
              s("strong", null, d(a(g)(u.cost)), 1)
            ]))), 128)),
            a(C)(o.value).length ? (r(), i(m, { key: 0 }, [
              l[2] || (l[2] = s("p", { class: "group" }, "By profile", -1)),
              (r(!0), i(m, null, _(a(C)(o.value), (u) => (r(), i("div", {
                key: u.label,
                class: "line",
                "data-cost-profile": ""
              }, [
                s("span", null, d(u.label), 1),
                s("strong", null, d(a(g)(u.cost)), 1)
              ]))), 128))
            ], 64)) : v("", !0)
          ], 64)) : (r(), i("p", D, "No session has reported a cost yet."))
        ], 64)) : v("", !0)
      ]),
      _: 1
    }));
  }
}, H = /* @__PURE__ */ M(F, [["__scopeId", "data-v-52b7a0da"]]);
export {
  H as default
};
