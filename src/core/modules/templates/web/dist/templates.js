/* @code-commandments-generated */
if (!document.getElementById("window-styles-b39b929cd89d")) { const style = document.createElement("style"); style.id = "window-styles-b39b929cd89d"; style.textContent = ".cards[data-v-7fd030a7]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-7fd030a7]{display:flex;flex-direction:column;gap:8px;min-height:130px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-7fd030a7]:hover,.card.open[data-v-7fd030a7]{border-color:var(--border-strong, var(--border))}.card-head[data-v-7fd030a7]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-7fd030a7]{width:14px;height:14px}.card-title[data-v-7fd030a7]{font-weight:600}.card-brief[data-v-7fd030a7]{color:var(--text-2);font-size:13px}.card-steps[data-v-7fd030a7]{margin:0;padding-left:18px;color:var(--text-2);font-size:13px;line-height:1.6}.card-foot[data-v-7fd030a7]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-7fd030a7]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { openBlock as t, createElementBlock as s, unref as a, toDisplayString as n, createCommentVNode as h, Fragment as _, renderList as u, normalizeClass as y, createElementVNode as r, createVNode as g, createTextVNode as f } from "vue";
import { useRows as C, useOpenRow as b, Icon as v } from "@journal/window-kit";
const N = (i, l) => {
  const c = i.__vccOpts || i;
  for (const [p, d] of l)
    c[p] = d;
  return c;
}, x = { class: "cards" }, T = {
  key: 0,
  class: "cards-note"
}, V = {
  key: 1,
  class: "cards-note"
}, R = ["data-row", "onClick"], B = { class: "card-head" }, E = { class: "card-title" }, F = { class: "card-brief" }, I = {
  key: 0,
  class: "card-steps"
}, O = { class: "card-foot" }, $ = {
  __name: "TemplateCards",
  setup(i) {
    const { rows: l, failure: c, loaded: p } = C("template list", ["template.*"]), { opened: d, toggle: k } = b();
    return (j, m) => (t(), s("div", x, [
      a(c) ? (t(), s("p", T, n(a(c)), 1)) : a(p) && !a(l).length ? (t(), s("p", V, "No templates yet")) : h("", !0),
      (t(!0), s(_, null, u(a(l), (e) => (t(), s("button", {
        key: e.id,
        type: "button",
        class: y(["card", { open: a(d) === e.id }]),
        "data-row": e.id,
        onClick: (o) => a(k)(e)
      }, [
        r("span", B, [
          g(a(v), {
            name: "board",
            class: "card-icon"
          }),
          f(" Template " + n(e.id), 1)
        ]),
        r("span", E, n(e.title), 1),
        r("span", F, n(e.brief), 1),
        a(d) === e.id ? (t(), s("ul", I, [
          (t(!0), s(_, null, u(e.parts, (o) => (t(), s("li", { key: o }, n(o), 1))), 128)),
          (t(!0), s(_, null, u(e.commands, (o) => (t(), s("li", { key: o }, [
            m[0] || (m[0] = f("Runs at each phase end: ", -1)),
            r("code", null, n(o), 1)
          ]))), 128))
        ])) : h("", !0),
        r("span", O, "For " + n(e.targets.length ? e.targets.join(", ") : "any row") + n(e.purpose ? ` · ${e.purpose}` : ""), 1)
      ], 10, R))), 128))
    ]));
  }
}, L = /* @__PURE__ */ N($, [["__scopeId", "data-v-7fd030a7"]]);
export {
  L as default
};
