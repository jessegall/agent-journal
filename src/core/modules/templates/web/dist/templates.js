/* @code-commandments-generated */
if (!document.getElementById("window-styles-48a3cb77563d")) { const style = document.createElement("style"); style.id = "window-styles-48a3cb77563d"; style.textContent = ".cards[data-v-900bf729]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-900bf729]{display:flex;flex-direction:column;gap:8px;min-height:130px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-900bf729]:hover,.card.open[data-v-900bf729]{border-color:var(--border-strong, var(--border))}.card-head[data-v-900bf729]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-900bf729]{width:14px;height:14px}.card-title[data-v-900bf729]{font-weight:600}.card-brief[data-v-900bf729]{color:var(--text-2);font-size:13px}.card-steps[data-v-900bf729]{margin:0;padding-left:18px;color:var(--text-2);font-size:13px;line-height:1.6}.card-foot[data-v-900bf729]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-900bf729]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { openBlock as t, createElementBlock as a, unref as s, createBlock as y, toDisplayString as n, createCommentVNode as h, Fragment as _, renderList as u, normalizeClass as g, createElementVNode as r, createVNode as b, createTextVNode as k } from "vue";
import { useRows as C, useOpenRow as v, Skeleton as N, Icon as x } from "@journal/window-kit";
const T = (p, l) => {
  const c = p.__vccOpts || p;
  for (const [d, i] of l)
    c[d] = i;
  return c;
}, V = { class: "cards" }, B = {
  key: 1,
  class: "cards-note"
}, R = {
  key: 2,
  class: "cards-note"
}, E = ["data-row", "onClick"], F = { class: "card-head" }, I = { class: "card-title" }, O = { class: "card-brief" }, S = {
  key: 0,
  class: "card-steps"
}, $ = { class: "card-foot" }, j = {
  __name: "TemplateCards",
  setup(p) {
    const { rows: l, failure: c, loaded: d } = C("template list", ["template.*"]), { opened: i, toggle: f } = v();
    return (z, m) => (t(), a("div", V, [
      s(d) ? s(c) ? (t(), a("p", B, n(s(c)), 1)) : s(d) && !s(l).length ? (t(), a("p", R, "No templates yet")) : h("", !0) : (t(), y(s(N), {
        key: 0,
        shape: "cards"
      })),
      (t(!0), a(_, null, u(s(l), (e) => (t(), a("button", {
        key: e.id,
        type: "button",
        class: g(["card", { open: s(i) === e.id }]),
        "data-row": e.id,
        onClick: (o) => s(f)(e)
      }, [
        r("span", F, [
          b(s(x), {
            name: "board",
            class: "card-icon"
          }),
          k(" Template " + n(e.id), 1)
        ]),
        r("span", I, n(e.title), 1),
        r("span", O, n(e.brief), 1),
        s(i) === e.id ? (t(), a("ul", S, [
          (t(!0), a(_, null, u(e.parts, (o) => (t(), a("li", { key: o }, n(o), 1))), 128)),
          (t(!0), a(_, null, u(e.commands, (o) => (t(), a("li", { key: o }, [
            m[0] || (m[0] = k("Runs at each phase end: ", -1)),
            r("code", null, n(o), 1)
          ]))), 128))
        ])) : h("", !0),
        r("span", $, "For " + n(e.targets.length ? e.targets.join(", ") : "any row") + n(e.purpose ? ` · ${e.purpose}` : ""), 1)
      ], 10, E))), 128))
    ]));
  }
}, q = /* @__PURE__ */ T(j, [["__scopeId", "data-v-900bf729"]]);
export {
  q as default
};
