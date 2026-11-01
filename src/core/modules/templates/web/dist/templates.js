/* @code-commandments-generated */
if (!document.getElementById("window-styles-3ea4a9c07127")) { const style = document.createElement("style"); style.id = "window-styles-3ea4a9c07127"; style.textContent = ".cards[data-v-6702a51e]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-6702a51e]{display:flex;flex-direction:column;gap:8px;min-height:130px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-6702a51e]:hover,.card.open[data-v-6702a51e]{border-color:var(--border-strong, var(--border))}.card-head[data-v-6702a51e]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-6702a51e]{width:14px;height:14px}.card-title[data-v-6702a51e]{font-weight:600}.card-brief[data-v-6702a51e]{color:var(--text-2);font-size:13px}.card-steps[data-v-6702a51e]{margin:0;padding-left:18px;color:var(--text-2);font-size:13px;line-height:1.6}.card-foot[data-v-6702a51e]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-6702a51e]{margin:0;color:var(--text-2)}.card-age[data-v-6702a51e]{margin-left:auto}\n"; document.head.appendChild(style); }
import { openBlock as s, createElementBlock as a, unref as t, createBlock as f, toDisplayString as n, createCommentVNode as h, Fragment as _, renderList as u, normalizeClass as g, createElementVNode as c, createVNode as C, createTextVNode as k } from "vue";
import { useRows as b, useOpenRow as v, Skeleton as N, Icon as x, ago as T } from "@journal/window-kit";
const V = (p, l) => {
  const r = p.__vccOpts || p;
  for (const [d, i] of l)
    r[d] = i;
  return r;
}, B = { class: "cards" }, R = {
  key: 1,
  class: "cards-note"
}, E = {
  key: 2,
  class: "cards-note"
}, F = ["data-row", "onClick"], I = { class: "card-head" }, O = { class: "card-age" }, S = { class: "card-title" }, $ = { class: "card-brief" }, j = {
  key: 0,
  class: "card-steps"
}, z = { class: "card-foot" }, D = {
  __name: "TemplateCards",
  setup(p) {
    const { rows: l, failure: r, loaded: d } = b("template list", ["template.*"]), { opened: i, toggle: y } = v();
    return (L, m) => (s(), a("div", B, [
      t(d) ? t(r) ? (s(), a("p", R, n(t(r)), 1)) : t(d) && !t(l).length ? (s(), a("p", E, "No templates yet")) : h("", !0) : (s(), f(t(N), {
        key: 0,
        shape: "cards"
      })),
      (s(!0), a(_, null, u(t(l), (e) => (s(), a("button", {
        key: e.id,
        type: "button",
        class: g(["card", { open: t(i) === e.id }]),
        "data-row": e.id,
        onClick: (o) => t(y)(e)
      }, [
        c("span", I, [
          C(t(x), {
            name: "board",
            class: "card-icon"
          }),
          k(" Template " + n(e.id), 1),
          c("span", O, n(t(T)(e.created_at)), 1)
        ]),
        c("span", S, n(e.title), 1),
        c("span", $, n(e.brief), 1),
        t(i) === e.id ? (s(), a("ul", j, [
          (s(!0), a(_, null, u(e.parts, (o) => (s(), a("li", { key: o }, n(o), 1))), 128)),
          (s(!0), a(_, null, u(e.commands, (o) => (s(), a("li", { key: o }, [
            m[0] || (m[0] = k("Runs at each phase end: ", -1)),
            c("code", null, n(o), 1)
          ]))), 128))
        ])) : h("", !0),
        c("span", z, "For " + n(e.targets.length ? e.targets.join(", ") : "any row") + n(e.purpose ? ` · ${e.purpose}` : ""), 1)
      ], 10, F))), 128))
    ]));
  }
}, G = /* @__PURE__ */ V(D, [["__scopeId", "data-v-6702a51e"]]);
export {
  G as default
};
