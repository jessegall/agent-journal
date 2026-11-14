if (!document.getElementById("window-styles-42d6fdc96829")) { const style = document.createElement("style"); style.id = "window-styles-42d6fdc96829"; style.textContent = ".current[data-v-2e50afc3]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-2e50afc3]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-2e50afc3]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-2e50afc3]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-2e50afc3]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-2e50afc3]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.none[data-v-2e50afc3]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-52b7a0da]{margin:0;padding:2px 0 4px;color:var(--text);font-size:12px}.note[data-v-52b7a0da]{margin:0 0 8px;color:var(--text-3);font-size:11px;line-height:1.4}.line[data-v-52b7a0da]{display:flex;justify-content:space-between;gap:12px;padding:3px 0;color:var(--text-2);font-size:11.5px}.line strong[data-v-52b7a0da]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.total[data-v-52b7a0da]{border-bottom:1px solid var(--border);padding-bottom:6px}.group[data-v-52b7a0da]{margin:8px 0 2px;color:var(--text-3);font-size:10.5px;letter-spacing:.04em;text-transform:uppercase}.none[data-v-52b7a0da]{margin:0;color:var(--text-3);font-size:12px}.fitness[data-v-1b832570]{display:flex;flex-direction:column;gap:6px;min-width:300px}.fitness-head[data-v-1b832570]{margin:0;font-weight:600}.fitness-measure[data-v-1b832570]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.fitness-note[data-v-1b832570]{margin:0;color:var(--text-3);font-size:12px}.load[data-v-046f30aa]{display:flex;flex-direction:column;gap:6px;min-width:300px}.load-head[data-v-046f30aa]{margin:0;font-weight:600}.load-row[data-v-046f30aa]{display:flex;gap:12px;justify-content:space-between;margin:0;font-size:13px}.load-note[data-v-046f30aa]{margin:0;color:var(--text-3);font-size:12px}.current[data-v-03866611]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.meter[data-v-03866611]{display:grid;grid-template-columns:1fr auto;gap:4px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.meter strong[data-v-03866611]{color:var(--text);font-weight:600;font-variant-numeric:tabular-nums}.track[data-v-03866611]{grid-column:1 / -1;height:4px;overflow:hidden;border-radius:2px;background:var(--line)}.track>span[data-v-03866611]{display:block;height:100%;border-radius:inherit;background:var(--accent-text)}.meter small[data-v-03866611]{grid-column:1 / -1;color:var(--text-3);font-size:10.5px}.limit-form[data-v-03866611]{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr) 64px auto;gap:6px;padding:8px 0}.limit-form select[data-v-03866611],.limit-form .percent[data-v-03866611]{box-sizing:border-box;width:100%;min-width:0}.limit-form .current[data-v-03866611]{grid-column:1 / -1;padding:0}.none[data-v-03866611]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as _, openBlock as r, createBlock as I, unref as a, withCtx as A, createElementVNode as s, createElementBlock as u, toDisplayString as c, Fragment as m, createCommentVNode as b, renderList as y } from "vue";
import { useWindow as C, WindowRoom as M } from "@journal/window-kit";
import { _ as P } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const v = "main", E = "Main agent", B = { main: E, worker: "Worker", helper: "Helper" }, L = "journal-", k = (e) => e.slice(0, 1).toUpperCase() + e.slice(1), R = (e) => k(e.replace(L, "").replaceAll("-", " ")), W = (e) => `${e.role} ${e.number}`, F = (e) => e.role === v ? E : `${k(e.role)} ${e.number}`;
function O(e, o = e.facts) {
  const p = (o == null ? void 0 : o.profile) || e.profile || "", l = e.role === v || !p ? B[e.role] ?? k(e.role) : R(p), n = e.role === v ? "" : W(e), g = e.role === v ? l : p ? `${l} · ${n}` : `${l} ${e.number}`;
  return { title: l, subtext: n, text: g, name: F(e) };
}
const T = "Model not reported", f = (e) => `$${Number(e || 0).toFixed(2)}`;
function x(e, o) {
  const p = /* @__PURE__ */ new Map();
  for (const l of e.filter((n) => n.cost_dollars > 0)) p.set(o(l), (p.get(o(l)) ?? 0) + l.cost_dollars);
  return [...p].map(([l, n]) => ({ label: l, cost: n })).sort((l, n) => n.cost - l.cost);
}
const h = (e) => x(e, (o) => o.model || T), w = (e) => x(e, (o) => O(o).text), $ = (e) => x(e.filter((o) => o.profile), (o) => o.profile), D = {
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
    const o = C(), { data: p, failure: l } = o.props.usage, n = _(() => {
      var d;
      return ((d = p.value) == null ? void 0 : d.agents) ?? [];
    }), g = _(() => n.value.find((d) => d.id === o.agent) ?? null), N = _(() => n.value.reduce((d, t) => d + (t.cost_dollars || 0), 0));
    return (d, t) => (r(), I(a(M), { padding: "14px 16px" }, {
      default: A(() => [
        t[5] || (t[5] = s("p", { class: "current" }, "Predicted API price", -1)),
        t[6] || (t[6] = s("p", {
          class: "note",
          "data-cost-note": ""
        }, "What these sessions would cost when using Claude Code or Codex through an API. It is not what a plan charges.", -1)),
        a(l) ? (r(), u("p", D, c(a(l)), 1)) : a(p) ? (r(), u(m, { key: 1 }, [
          s("div", S, [
            t[0] || (t[0] = s("span", null, "All open sessions", -1)),
            s("strong", null, c(a(f)(N.value)), 1)
          ]),
          g.value ? (r(), u("div", V, [
            t[1] || (t[1] = s("span", null, "This session", -1)),
            s("strong", null, c(a(f)(g.value.cost_dollars)), 1)
          ])) : b("", !0),
          N.value > 0 ? (r(), u(m, { key: 1 }, [
            t[3] || (t[3] = s("p", { class: "group" }, "By model", -1)),
            (r(!0), u(m, null, y(a(h)(n.value), (i) => (r(), u("div", {
              key: i.label,
              class: "line",
              "data-cost-model": ""
            }, [
              s("span", null, c(i.label), 1),
              s("strong", null, c(a(f)(i.cost)), 1)
            ]))), 128)),
            t[4] || (t[4] = s("p", { class: "group" }, "By agent", -1)),
            (r(!0), u(m, null, y(a(w)(n.value), (i) => (r(), u("div", {
              key: i.label,
              class: "line",
              "data-cost-agent": ""
            }, [
              s("span", null, c(i.label), 1),
              s("strong", null, c(a(f)(i.cost)), 1)
            ]))), 128)),
            a($)(n.value).length ? (r(), u(m, { key: 0 }, [
              t[2] || (t[2] = s("p", { class: "group" }, "By profile", -1)),
              (r(!0), u(m, null, y(a($)(n.value), (i) => (r(), u("div", {
                key: i.label,
                class: "line",
                "data-cost-profile": ""
              }, [
                s("span", null, c(i.label), 1),
                s("strong", null, c(a(f)(i.cost)), 1)
              ]))), 128))
            ], 64)) : b("", !0)
          ], 64)) : (r(), u("p", j, "No session has reported a cost yet."))
        ], 64)) : b("", !0)
      ]),
      _: 1
    }));
  }
}, z = /* @__PURE__ */ P(H, [["__scopeId", "data-v-52b7a0da"]]);
export {
  z as default
};
