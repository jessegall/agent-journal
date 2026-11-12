if (!document.getElementById("window-styles-9f61b9e765f6")) { const style = document.createElement("style"); style.id = "window-styles-9f61b9e765f6"; style.textContent = ".cards[data-v-aa2d8a9b]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-aa2d8a9b]{display:flex;flex-direction:column;gap:8px;min-height:130px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-aa2d8a9b]:hover,.card.open[data-v-aa2d8a9b]{border-color:var(--border-strong, var(--border))}.card-head[data-v-aa2d8a9b]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-aa2d8a9b]{width:14px;height:14px}.card-title[data-v-aa2d8a9b]{font-weight:600}.card-origin[data-v-aa2d8a9b],.card-brief[data-v-aa2d8a9b]{color:var(--text-2);font-size:13px}.card-steps[data-v-aa2d8a9b]{margin:0;padding-left:18px;color:var(--text-2);font-size:13px;line-height:1.6}.card-foot[data-v-aa2d8a9b]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-aa2d8a9b]{margin:0;color:var(--text-2)}.card-age[data-v-aa2d8a9b]{margin-left:auto}\n"; document.head.appendChild(style); }
import { openBlock as s, createElementBlock as a, unref as t, createBlock as T, toDisplayString as o, createCommentVNode as f, createVNode as u, Fragment as _, renderList as m, normalizeClass as C, createElementVNode as c, createTextVNode as b } from "vue";
import { useWindow as N, useListTools as x, useOpenRow as V, Skeleton as B, ListTools as L, Icon as $, TimeAgo as E } from "@journal/window-kit";
const F = (i, p) => {
  const l = i.__vccOpts || i;
  for (const [d, r] of p)
    l[d] = r;
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
    const p = N(), { rows: l, failure: d, loaded: r } = p.props.templates, h = x(l, { title: (y) => y.title }), { opened: k, toggle: v } = V();
    return (y, g) => (s(), a("div", I, [
      t(r) ? t(d) ? (s(), a("p", O, o(t(d)), 1)) : t(r) && !t(l).length ? (s(), a("p", R, "No templates yet")) : f("", !0) : (s(), T(t(B), {
        key: 0,
        shape: "cards"
      })),
      u(t(L), { tools: t(h) }, null, 8, ["tools"]),
      (s(!0), a(_, null, m(t(h).shown.value, (e) => (s(), a("button", {
        key: e.id,
        type: "button",
        class: C(["card", { open: t(k) === e.id }]),
        "data-row": e.id,
        onClick: (n) => t(v)(e)
      }, [
        c("span", W, [
          u(t($), {
            name: "board",
            class: "card-icon"
          }),
          b(" Template " + o(e.id), 1),
          u(t(E), {
            class: "card-age",
            at: e.created_at
          }, null, 8, ["at"])
        ]),
        c("span", j, o(e.title), 1),
        c("span", z, o(e.module ? `Module: ${e.module}` : "Written by a user"), 1),
        c("span", A, o(e.brief), 1),
        t(k) === e.id ? (s(), a("ul", D, [
          (s(!0), a(_, null, m(e.parts, (n) => (s(), a("li", { key: n }, o(n), 1))), 128)),
          (s(!0), a(_, null, m(e.commands, (n) => (s(), a("li", { key: n }, [
            g[0] || (g[0] = b("Runs at each phase end: ", -1)),
            c("code", null, o(n), 1)
          ]))), 128))
        ])) : f("", !0),
        c("span", M, "For " + o(e.targets.length ? e.targets.join(", ") : "any item") + o(e.purpose ? ` · ${e.purpose}` : ""), 1)
      ], 10, S))), 128))
    ]));
  }
}, J = /* @__PURE__ */ F(q, [["__scopeId", "data-v-aa2d8a9b"]]);
export {
  J as default
};
