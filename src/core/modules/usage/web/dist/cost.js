if (!document.getElementById("window-styles-dbebdbf82a44")) { const style = document.createElement("style"); style.id = "window-styles-dbebdbf82a44"; style.textContent = ".current[data-v-2e50afc3]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-2e50afc3]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-2e50afc3]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-2e50afc3]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-2e50afc3]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-2e50afc3]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-2e50afc3]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-52b7a0da]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-52b7a0da]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-52b7a0da]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-52b7a0da]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-52b7a0da]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-52b7a0da]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-52b7a0da]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-1cfbcbe7]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-1cfbcbe7]{margin:0;font-weight:600}.fitness-measure[data-v-1cfbcbe7]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-1cfbcbe7]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-bf25ffc4]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-bf25ffc4]{margin:0;font-weight:600}.load-row[data-v-bf25ffc4]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-bf25ffc4]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-c5713eea]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-c5713eea]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-c5713eea]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-c5713eea]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-c5713eea]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-c5713eea]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.limit-form[data-v-c5713eea]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr) 64px auto;gap:6px;padding:8px 0}.limit-form select[data-v-c5713eea],.limit-form .percent[data-v-c5713eea]{box-sizing:border-box;width:100%;min-width:0}.limit-form .current[data-v-c5713eea]{grid-column:1 / -1;padding:0}.none[data-v-c5713eea]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as _, openBlock as r, createBlock as N, unref as a, withCtx as A, createElementVNode as l, createElementBlock as i, toDisplayString as p, Fragment as m, createCommentVNode as y, renderList as b } from "vue";
import { useWindow as C, WindowRoom as M } from "@journal/window-kit";
import { _ as P } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const v = "main", I = "Main agent", L = { main: I, worker: "Worker", helper: "Helper" }, B = "journal-", k = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), R = (e) => k(e.replace(B, "").replaceAll("-", " ")), W = (e) => `${e.role} ${e.id}`, F = (e) => e.role === v ? I : `${k(e.role)} ${e.id}`;
function O(e, o = e.facts) {
  const d = (o == null ? void 0 : o.profile) || e.profile || "", s = e.role === v || !d ? L[e.role] ?? k(e.role) : R(d), n = e.role === v ? "" : W(e), g = e.role === v ? s : d ? `${s} · ${n}` : `${s} ${e.id}`;
  return { title: s, subtext: n, text: g, name: F(e) };
}
const T = "Model not reported", f = (e) => `$${Number(e || 0).toFixed(2)}`;
function x(e, o) {
  const d = /* @__PURE__ */ new Map();
  for (const s of e.filter((n) => n.cost_dollars > 0)) d.set(o(s), (d.get(o(s)) ?? 0) + s.cost_dollars);
  return [...d].map(([s, n]) => ({ label: s, cost: n })).sort((s, n) => n.cost - s.cost);
}
const h = (e) => x(e, (o) => o.model || T), w = (e) => x(e, (o) => O(o).text), E = (e) => x(e.filter((o) => o.profile), (o) => o.profile), D = {
  key: 0,
  class: "none"
}, S = {
  class: "line total",
  "data-cost-total": ""
}, V = {
  key: 0,
  class: "line",
  "data-cost-session": ""
}, j = {
  key: 2,
  class: "none"
}, H = {
  __name: "CostPanel",
  setup(e) {
    const o = C(), { data: d, failure: s } = o.props.usage, n = _(() => {
      var c;
      return ((c = d.value) == null ? void 0 : c.agents) ?? [];
    }), g = _(() => n.value.find((c) => c.id === o.agent) ?? null), $ = _(() => n.value.reduce((c, t) => c + (t.cost_dollars || 0), 0));
    return (c, t) => (r(), N(a(M), { padding: "14px 16px" }, {
      default: A(() => [
        t[5] || (t[5] = l("p", { class: "current" }, "Predicted API price", -1)),
        t[6] || (t[6] = l("p", {
          class: "note",
          "data-cost-note": ""
        }, "What these sessions would cost when using Claude Code or Codex through an API. It is not what a plan charges.", -1)),
        a(s) ? (r(), i("p", D, p(a(s)), 1)) : a(d) ? (r(), i(m, { key: 1 }, [
          l("div", S, [
            t[0] || (t[0] = l("span", null, "All open sessions", -1)),
            l("strong", null, p(a(f)($.value)), 1)
          ]),
          g.value ? (r(), i("div", V, [
            t[1] || (t[1] = l("span", null, "This session", -1)),
            l("strong", null, p(a(f)(g.value.cost_dollars)), 1)
          ])) : y("", !0),
          $.value > 0 ? (r(), i(m, { key: 1 }, [
            t[3] || (t[3] = l("p", { class: "group" }, "By model", -1)),
            (r(!0), i(m, null, b(a(h)(n.value), (u) => (r(), i("div", {
              key: u.label,
              class: "line",
              "data-cost-model": ""
            }, [
              l("span", null, p(u.label), 1),
              l("strong", null, p(a(f)(u.cost)), 1)
            ]))), 128)),
            t[4] || (t[4] = l("p", { class: "group" }, "By agent", -1)),
            (r(!0), i(m, null, b(a(w)(n.value), (u) => (r(), i("div", {
              key: u.label,
              class: "line",
              "data-cost-agent": ""
            }, [
              l("span", null, p(u.label), 1),
              l("strong", null, p(a(f)(u.cost)), 1)
            ]))), 128)),
            a(E)(n.value).length ? (r(), i(m, { key: 0 }, [
              t[2] || (t[2] = l("p", { class: "group" }, "By profile", -1)),
              (r(!0), i(m, null, b(a(E)(n.value), (u) => (r(), i("div", {
                key: u.label,
                class: "line",
                "data-cost-profile": ""
              }, [
                l("span", null, p(u.label), 1),
                l("strong", null, p(a(f)(u.cost)), 1)
              ]))), 128))
            ], 64)) : y("", !0)
          ], 64)) : (r(), i("p", j, "No session has reported a cost yet."))
        ], 64)) : y("", !0)
      ]),
      _: 1
    }));
  }
}, z = /* @__PURE__ */ P(H, [["__scopeId", "data-v-52b7a0da"]]);
export {
  z as default
};
