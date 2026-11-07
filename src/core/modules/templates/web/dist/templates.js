/* @code-commandments-generated */
if (!document.getElementById("window-styles-634429ca0ca5")) { const style = document.createElement("style"); style.id = "window-styles-634429ca0ca5"; style.textContent = ".cards[data-v-f0ec99cc]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-f0ec99cc]{display:flex;flex-direction:column;gap:8px;min-height:130px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-f0ec99cc]:hover,.card.open[data-v-f0ec99cc]{border-color:var(--border-strong, var(--border))}.card-head[data-v-f0ec99cc]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-f0ec99cc]{width:14px;height:14px}.card-title[data-v-f0ec99cc]{font-weight:600}.card-origin[data-v-f0ec99cc],.card-brief[data-v-f0ec99cc]{color:var(--text-2);font-size:13px}.card-steps[data-v-f0ec99cc]{margin:0;padding-left:18px;color:var(--text-2);font-size:13px;line-height:1.6}.card-foot[data-v-f0ec99cc]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-f0ec99cc]{margin:0;color:var(--text-2)}.card-age[data-v-f0ec99cc]{margin-left:auto}\n"; document.head.appendChild(style); }
import { openBlock as s, createElementBlock as o, unref as t, createBlock as b, toDisplayString as a, createCommentVNode as g, createVNode as u, Fragment as _, renderList as m, normalizeClass as C, createElementVNode as c, createTextVNode as v } from "vue";
import { useWindow as N, useListTools as x, useOpenRow as V, Skeleton as B, ListTools as L, Icon as $, TimeAgo as E } from "@journal/window-kit";
const F = (i, p) => {
  const l = i.__vccOpts || i;
  for (const [r, d] of p)
    l[r] = d;
  return l;
}, I = { class: "cards" }, O = {
  key: 1,
  class: "cards-note"
}, R = {
  key: 2,
  class: "cards-note"
}, S = ["data-row", "onClick"], W = { class: "card-head" }, j = { class: "card-title" }, z = { class: "card-origin" }, A = { class: "card-brief" }, D = {
  key: 0,
  class: "card-steps"
}, M = { class: "card-foot" }, q = {
  __name: "TemplateCards",
  setup(i) {
    const p = N(), { rows: l, failure: r, loaded: d } = p.props.templates, h = x(l, { title: (y) => y.title }), { opened: k, toggle: T } = V();
    return (y, f) => (s(), o("div", I, [
      t(d) ? t(r) ? (s(), o("p", O, a(t(r)), 1)) : t(d) && !t(l).length ? (s(), o("p", R, "No templates yet")) : g("", !0) : (s(), b(t(B), {
        key: 0,
        shape: "cards"
      })),
      u(t(L), { tools: t(h) }, null, 8, ["tools"]),
      (s(!0), o(_, null, m(t(h).shown.value, (e) => (s(), o("button", {
        key: e.id,
        type: "button",
        class: C(["card", { open: t(k) === e.id }]),
        "data-row": e.id,
        onClick: (n) => t(T)(e)
      }, [
        c("span", W, [
          u(t($), {
            name: "board",
            class: "card-icon"
          }),
          v(" Template " + a(e.id), 1),
          u(t(E), {
            class: "card-age",
            at: e.created_at
          }, null, 8, ["at"])
        ]),
        c("span", j, a(e.title), 1),
        c("span", z, a(e.module ? `Module: ${e.module}` : "Written by a person"), 1),
        c("span", A, a(e.brief), 1),
        t(k) === e.id ? (s(), o("ul", D, [
          (s(!0), o(_, null, m(e.parts, (n) => (s(), o("li", { key: n }, a(n), 1))), 128)),
          (s(!0), o(_, null, m(e.commands, (n) => (s(), o("li", { key: n }, [
            f[0] || (f[0] = v("Runs at each phase end: ", -1)),
            c("code", null, a(n), 1)
          ]))), 128))
        ])) : g("", !0),
        c("span", M, "For " + a(e.targets.length ? e.targets.join(", ") : "any item") + a(e.purpose ? ` · ${e.purpose}` : ""), 1)
      ], 10, S))), 128))
    ]));
  }
}, J = /* @__PURE__ */ F(q, [["__scopeId", "data-v-f0ec99cc"]]);
export {
  J as default
};
