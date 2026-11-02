/* @code-commandments-generated */
if (!document.getElementById("window-styles-fe340de14e99")) { const style = document.createElement("style"); style.id = "window-styles-fe340de14e99"; style.textContent = ".cards[data-v-01276bc8]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-01276bc8]{display:flex;flex-direction:column;gap:8px;min-height:130px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-01276bc8]:hover,.card.open[data-v-01276bc8]{border-color:var(--border-strong, var(--border))}.card-head[data-v-01276bc8]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-01276bc8]{width:14px;height:14px}.card-title[data-v-01276bc8]{font-weight:600}.card-brief[data-v-01276bc8]{color:var(--text-2);font-size:13px}.card-steps[data-v-01276bc8]{margin:0;padding-left:18px;color:var(--text-2);font-size:13px;line-height:1.6}.card-foot[data-v-01276bc8]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-01276bc8]{margin:0;color:var(--text-2)}.card-age[data-v-01276bc8]{margin-left:auto}\n"; document.head.appendChild(style); }
import { openBlock as s, createElementBlock as a, unref as t, createBlock as v, toDisplayString as o, createCommentVNode as f, createVNode as y, Fragment as _, renderList as u, normalizeClass as C, createElementVNode as c, createTextVNode as g } from "vue";
import { useRows as T, useListTools as N, useOpenRow as x, Skeleton as V, ListTools as B, Icon as L, ago as R } from "@journal/window-kit";
const S = (p, r) => {
  const l = p.__vccOpts || p;
  for (const [d, i] of r)
    l[d] = i;
  return l;
}, E = {
  class: "cards",
  "data-window-flush": ""
}, F = {
  key: 1,
  class: "cards-note"
}, I = {
  key: 2,
  class: "cards-note"
}, O = ["data-row", "onClick"], $ = { class: "card-head" }, j = { class: "card-age" }, z = { class: "card-title" }, D = { class: "card-brief" }, q = {
  key: 0,
  class: "card-steps"
}, A = { class: "card-foot" }, G = {
  __name: "TemplateCards",
  setup(p) {
    const { rows: r, failure: l, loaded: d } = T("template list", ["template.*"]), i = N(r, { title: (m) => m.title }), { opened: h, toggle: b } = x();
    return (m, k) => (s(), a("div", E, [
      t(d) ? t(l) ? (s(), a("p", F, o(t(l)), 1)) : t(d) && !t(r).length ? (s(), a("p", I, "No templates yet")) : f("", !0) : (s(), v(t(V), {
        key: 0,
        shape: "cards"
      })),
      y(t(B), {
        tools: t(i),
        placeholder: "Search the templates"
      }, null, 8, ["tools"]),
      (s(!0), a(_, null, u(t(i).shown.value, (e) => (s(), a("button", {
        key: e.id,
        type: "button",
        class: C(["card", { open: t(h) === e.id }]),
        "data-row": e.id,
        onClick: (n) => t(b)(e)
      }, [
        c("span", $, [
          y(t(L), {
            name: "board",
            class: "card-icon"
          }),
          g(" Template " + o(e.id), 1),
          c("span", j, o(t(R)(e.created_at)), 1)
        ]),
        c("span", z, o(e.title), 1),
        c("span", D, o(e.brief), 1),
        t(h) === e.id ? (s(), a("ul", q, [
          (s(!0), a(_, null, u(e.parts, (n) => (s(), a("li", { key: n }, o(n), 1))), 128)),
          (s(!0), a(_, null, u(e.commands, (n) => (s(), a("li", { key: n }, [
            k[0] || (k[0] = g("Runs at each phase end: ", -1)),
            c("code", null, o(n), 1)
          ]))), 128))
        ])) : f("", !0),
        c("span", A, "For " + o(e.targets.length ? e.targets.join(", ") : "any row") + o(e.purpose ? ` · ${e.purpose}` : ""), 1)
      ], 10, O))), 128))
    ]));
  }
}, K = /* @__PURE__ */ S(G, [["__scopeId", "data-v-01276bc8"]]);
export {
  K as default
};
