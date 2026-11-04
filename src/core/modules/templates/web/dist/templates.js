/* @code-commandments-generated */
if (!document.getElementById("window-styles-029aa117f721")) { const style = document.createElement("style"); style.id = "window-styles-029aa117f721"; style.textContent = ".cards[data-v-ea810286]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-ea810286]{display:flex;flex-direction:column;gap:8px;min-height:130px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-ea810286]:hover,.card.open[data-v-ea810286]{border-color:var(--border-strong, var(--border))}.card-head[data-v-ea810286]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-ea810286]{width:14px;height:14px}.card-title[data-v-ea810286]{font-weight:600}.card-origin[data-v-ea810286],.card-brief[data-v-ea810286]{color:var(--text-2);font-size:13px}.card-steps[data-v-ea810286]{margin:0;padding-left:18px;color:var(--text-2);font-size:13px;line-height:1.6}.card-foot[data-v-ea810286]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-ea810286]{margin:0;color:var(--text-2)}.card-age[data-v-ea810286]{margin-left:auto}\n"; document.head.appendChild(style); }
import { openBlock as s, createElementBlock as a, unref as t, createBlock as b, toDisplayString as o, createCommentVNode as g, createVNode as u, Fragment as _, renderList as m, normalizeClass as v, createElementVNode as l, createTextVNode as f } from "vue";
import { useRows as C, useListTools as N, useOpenRow as x, Skeleton as V, ListTools as B, Icon as L, TimeAgo as R } from "@journal/window-kit";
const $ = (p, r) => {
  const c = p.__vccOpts || p;
  for (const [d, i] of r)
    c[d] = i;
  return c;
}, E = { class: "cards" }, F = {
  key: 1,
  class: "cards-note"
}, I = {
  key: 2,
  class: "cards-note"
}, O = ["data-row", "onClick"], S = { class: "card-head" }, j = { class: "card-title" }, z = { class: "card-origin" }, A = { class: "card-brief" }, D = {
  key: 0,
  class: "card-steps"
}, M = { class: "card-foot" }, W = {
  __name: "TemplateCards",
  setup(p) {
    const { rows: r, failure: c, loaded: d } = C("template list", ["template.*"]), i = N(r, { title: (k) => k.title }), { opened: h, toggle: T } = x();
    return (k, y) => (s(), a("div", E, [
      t(d) ? t(c) ? (s(), a("p", F, o(t(c)), 1)) : t(d) && !t(r).length ? (s(), a("p", I, "No templates yet")) : g("", !0) : (s(), b(t(V), {
        key: 0,
        shape: "cards"
      })),
      u(t(B), { tools: t(i) }, null, 8, ["tools"]),
      (s(!0), a(_, null, m(t(i).shown.value, (e) => (s(), a("button", {
        key: e.id,
        type: "button",
        class: v(["card", { open: t(h) === e.id }]),
        "data-row": e.id,
        onClick: (n) => t(T)(e)
      }, [
        l("span", S, [
          u(t(L), {
            name: "board",
            class: "card-icon"
          }),
          f(" Template " + o(e.id), 1),
          u(t(R), {
            class: "card-age",
            at: e.created_at
          }, null, 8, ["at"])
        ]),
        l("span", j, o(e.title), 1),
        l("span", z, o(e.module ? `Module: ${e.module}` : "Written by a person"), 1),
        l("span", A, o(e.brief), 1),
        t(h) === e.id ? (s(), a("ul", D, [
          (s(!0), a(_, null, m(e.parts, (n) => (s(), a("li", { key: n }, o(n), 1))), 128)),
          (s(!0), a(_, null, m(e.commands, (n) => (s(), a("li", { key: n }, [
            y[0] || (y[0] = f("Runs at each phase end: ", -1)),
            l("code", null, o(n), 1)
          ]))), 128))
        ])) : g("", !0),
        l("span", M, "For " + o(e.targets.length ? e.targets.join(", ") : "any item") + o(e.purpose ? ` · ${e.purpose}` : ""), 1)
      ], 10, O))), 128))
    ]));
  }
}, H = /* @__PURE__ */ $(W, [["__scopeId", "data-v-ea810286"]]);
export {
  H as default
};
