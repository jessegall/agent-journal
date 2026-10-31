/* @code-commandments-generated */
if (!document.getElementById("window-styles-d805fcf2216f")) { const style = document.createElement("style"); style.id = "window-styles-d805fcf2216f"; style.textContent = ".cards[data-v-5a10f98e]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-5a10f98e]{display:flex;flex-direction:column;gap:8px;min-height:130px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-5a10f98e]:hover,.card.open[data-v-5a10f98e]{border-color:var(--border-strong, var(--border))}.card-head[data-v-5a10f98e]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-5a10f98e]{width:14px;height:14px}.card-title[data-v-5a10f98e]{font-weight:600}.card-brief[data-v-5a10f98e]{color:var(--text-2);font-size:13px}.card-steps[data-v-5a10f98e]{margin:0;padding-left:18px;color:var(--text-2);font-size:13px;line-height:1.6}.card-foot[data-v-5a10f98e]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-5a10f98e]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as g, openBlock as t, createElementBlock as s, unref as l, toDisplayString as a, createCommentVNode as h, Fragment as _, renderList as m, normalizeClass as v, createElementVNode as r, createVNode as C, createTextVNode as k } from "vue";
import { useRows as b, Icon as N } from "@journal/window-kit";
const x = (i, d) => {
  const c = i.__vccOpts || i;
  for (const [u, n] of d)
    c[u] = n;
  return c;
}, T = { class: "cards" }, V = {
  key: 0,
  class: "cards-note"
}, B = {
  key: 1,
  class: "cards-note"
}, E = ["data-row", "onClick"], F = { class: "card-head" }, I = { class: "card-title" }, R = { class: "card-brief" }, $ = {
  key: 0,
  class: "card-steps"
}, j = { class: "card-foot" }, z = {
  __name: "TemplateCards",
  setup(i) {
    const { rows: d, failure: c, loaded: u } = b("template list", ["template.*"]), n = g(null);
    function y(p) {
      n.value = n.value === p.id ? null : p.id;
    }
    return (p, f) => (t(), s("div", T, [
      l(c) ? (t(), s("p", V, a(l(c)), 1)) : l(u) && !l(d).length ? (t(), s("p", B, "No templates yet")) : h("", !0),
      (t(!0), s(_, null, m(l(d), (e) => (t(), s("button", {
        key: e.id,
        type: "button",
        class: v(["card", { open: n.value === e.id }]),
        "data-row": e.id,
        onClick: (o) => y(e)
      }, [
        r("span", F, [
          C(l(N), {
            name: "board",
            class: "card-icon"
          }),
          k(" Template " + a(e.id), 1)
        ]),
        r("span", I, a(e.title), 1),
        r("span", R, a(e.brief), 1),
        n.value === e.id ? (t(), s("ul", $, [
          (t(!0), s(_, null, m(e.parts, (o) => (t(), s("li", { key: o }, a(o), 1))), 128)),
          (t(!0), s(_, null, m(e.commands, (o) => (t(), s("li", { key: o }, [
            f[0] || (f[0] = k("Runs at each phase end: ", -1)),
            r("code", null, a(o), 1)
          ]))), 128))
        ])) : h("", !0),
        r("span", j, "For " + a(e.targets.length ? e.targets.join(", ") : "any row") + a(e.purpose ? ` · ${e.purpose}` : ""), 1)
      ], 10, E))), 128))
    ]));
  }
}, O = /* @__PURE__ */ x(z, [["__scopeId", "data-v-5a10f98e"]]);
export {
  O as default
};
