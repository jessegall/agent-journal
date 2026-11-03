/* @code-commandments-generated */
if (!document.getElementById("window-styles-c78085c80af5")) { const style = document.createElement("style"); style.id = "window-styles-c78085c80af5"; style.textContent = ".cards[data-v-ae4bdb7f]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-ae4bdb7f]{display:flex;flex-direction:column;gap:8px;min-height:130px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-ae4bdb7f]:hover,.card.open[data-v-ae4bdb7f]{border-color:var(--border-strong, var(--border))}.card-head[data-v-ae4bdb7f]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-ae4bdb7f]{width:14px;height:14px}.card-title[data-v-ae4bdb7f]{font-weight:600}.card-brief[data-v-ae4bdb7f]{color:var(--text-2);font-size:13px}.card-steps[data-v-ae4bdb7f]{margin:0;padding-left:18px;color:var(--text-2);font-size:13px;line-height:1.6}.card-foot[data-v-ae4bdb7f]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-ae4bdb7f]{margin:0;color:var(--text-2)}.card-age[data-v-ae4bdb7f]{margin-left:auto}\n"; document.head.appendChild(style); }
import { openBlock as s, createElementBlock as a, unref as t, createBlock as v, toDisplayString as o, createCommentVNode as f, createVNode as y, Fragment as _, renderList as u, normalizeClass as C, createElementVNode as c, createTextVNode as g } from "vue";
import { useRows as T, useListTools as N, useOpenRow as x, Skeleton as V, ListTools as B, Icon as L, ago as R } from "@journal/window-kit";
const E = (p, r) => {
  const l = p.__vccOpts || p;
  for (const [d, i] of r)
    l[d] = i;
  return l;
}, F = { class: "cards" }, I = {
  key: 1,
  class: "cards-note"
}, O = {
  key: 2,
  class: "cards-note"
}, S = ["data-row", "onClick"], $ = { class: "card-head" }, j = { class: "card-age" }, z = { class: "card-title" }, D = { class: "card-brief" }, q = {
  key: 0,
  class: "card-steps"
}, A = { class: "card-foot" }, G = {
  __name: "TemplateCards",
  setup(p) {
    const { rows: r, failure: l, loaded: d } = T("template list", ["template.*"]), i = N(r, { title: (h) => h.title }), { opened: m, toggle: b } = x();
    return (h, k) => (s(), a("div", F, [
      t(d) ? t(l) ? (s(), a("p", I, o(t(l)), 1)) : t(d) && !t(r).length ? (s(), a("p", O, "No templates yet")) : f("", !0) : (s(), v(t(V), {
        key: 0,
        shape: "cards"
      })),
      y(t(B), { tools: t(i) }, null, 8, ["tools"]),
      (s(!0), a(_, null, u(t(i).shown.value, (e) => (s(), a("button", {
        key: e.id,
        type: "button",
        class: C(["card", { open: t(m) === e.id }]),
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
        t(m) === e.id ? (s(), a("ul", q, [
          (s(!0), a(_, null, u(e.parts, (n) => (s(), a("li", { key: n }, o(n), 1))), 128)),
          (s(!0), a(_, null, u(e.commands, (n) => (s(), a("li", { key: n }, [
            k[0] || (k[0] = g("Runs at each phase end: ", -1)),
            c("code", null, o(n), 1)
          ]))), 128))
        ])) : f("", !0),
        c("span", A, "For " + o(e.targets.length ? e.targets.join(", ") : "any row") + o(e.purpose ? ` · ${e.purpose}` : ""), 1)
      ], 10, S))), 128))
    ]));
  }
}, K = /* @__PURE__ */ E(G, [["__scopeId", "data-v-ae4bdb7f"]]);
export {
  K as default
};
