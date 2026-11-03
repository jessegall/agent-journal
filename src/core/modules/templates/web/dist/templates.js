/* @code-commandments-generated */
if (!document.getElementById("window-styles-548444dd122f")) { const style = document.createElement("style"); style.id = "window-styles-548444dd122f"; style.textContent = ".cards[data-v-45d7799c]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-45d7799c]{display:flex;flex-direction:column;gap:8px;min-height:130px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-45d7799c]:hover,.card.open[data-v-45d7799c]{border-color:var(--border-strong, var(--border))}.card-head[data-v-45d7799c]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-45d7799c]{width:14px;height:14px}.card-title[data-v-45d7799c]{font-weight:600}.card-brief[data-v-45d7799c]{color:var(--text-2);font-size:13px}.card-steps[data-v-45d7799c]{margin:0;padding-left:18px;color:var(--text-2);font-size:13px;line-height:1.6}.card-foot[data-v-45d7799c]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-45d7799c]{margin:0;color:var(--text-2)}.card-age[data-v-45d7799c]{margin-left:auto}\n"; document.head.appendChild(style); }
import { openBlock as s, createElementBlock as a, unref as t, createBlock as v, toDisplayString as o, createCommentVNode as f, createVNode as u, Fragment as _, renderList as m, normalizeClass as C, createElementVNode as c, createTextVNode as g } from "vue";
import { useRows as b, useListTools as N, useOpenRow as x, Skeleton as V, ListTools as B, Icon as L, TimeAgo as R } from "@journal/window-kit";
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
}, S = ["data-row", "onClick"], $ = { class: "card-head" }, j = { class: "card-title" }, z = { class: "card-brief" }, A = {
  key: 0,
  class: "card-steps"
}, D = { class: "card-foot" }, q = {
  __name: "TemplateCards",
  setup(p) {
    const { rows: r, failure: l, loaded: d } = b("template list", ["template.*"]), i = N(r, { title: (k) => k.title }), { opened: h, toggle: T } = x();
    return (k, y) => (s(), a("div", F, [
      t(d) ? t(l) ? (s(), a("p", I, o(t(l)), 1)) : t(d) && !t(r).length ? (s(), a("p", O, "No templates yet")) : f("", !0) : (s(), v(t(V), {
        key: 0,
        shape: "cards"
      })),
      u(t(B), { tools: t(i) }, null, 8, ["tools"]),
      (s(!0), a(_, null, m(t(i).shown.value, (e) => (s(), a("button", {
        key: e.id,
        type: "button",
        class: C(["card", { open: t(h) === e.id }]),
        "data-row": e.id,
        onClick: (n) => t(T)(e)
      }, [
        c("span", $, [
          u(t(L), {
            name: "board",
            class: "card-icon"
          }),
          g(" Template " + o(e.id), 1),
          u(t(R), {
            class: "card-age",
            at: e.created_at
          }, null, 8, ["at"])
        ]),
        c("span", j, o(e.title), 1),
        c("span", z, o(e.brief), 1),
        t(h) === e.id ? (s(), a("ul", A, [
          (s(!0), a(_, null, m(e.parts, (n) => (s(), a("li", { key: n }, o(n), 1))), 128)),
          (s(!0), a(_, null, m(e.commands, (n) => (s(), a("li", { key: n }, [
            y[0] || (y[0] = g("Runs at each phase end: ", -1)),
            c("code", null, o(n), 1)
          ]))), 128))
        ])) : f("", !0),
        c("span", D, "For " + o(e.targets.length ? e.targets.join(", ") : "any row") + o(e.purpose ? ` · ${e.purpose}` : ""), 1)
      ], 10, S))), 128))
    ]));
  }
}, J = /* @__PURE__ */ E(q, [["__scopeId", "data-v-45d7799c"]]);
export {
  J as default
};
