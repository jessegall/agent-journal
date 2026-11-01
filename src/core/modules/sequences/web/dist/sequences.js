/* @code-commandments-generated */
if (!document.getElementById("window-styles-eeeae886862b")) { const style = document.createElement("style"); style.id = "window-styles-eeeae886862b"; style.textContent = ".cards[data-v-08a83032]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-08a83032]{display:flex;flex-direction:column;gap:8px;min-height:130px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-08a83032]:hover,.card.open[data-v-08a83032]{border-color:var(--border-strong, var(--border))}.card-head[data-v-08a83032]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-08a83032]{width:14px;height:14px}.card-title[data-v-08a83032]{font-weight:600}.card-steps[data-v-08a83032]{margin:0;padding-left:18px;color:var(--text-2);font-size:13px;line-height:1.6}.card-foot[data-v-08a83032]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-08a83032]{margin:0;color:var(--text-2)}.card-age[data-v-08a83032]{margin-left:auto}\n"; document.head.appendChild(style); }
import { openBlock as s, createElementBlock as c, unref as e, createBlock as m, toDisplayString as n, createCommentVNode as u, Fragment as p, renderList as h, normalizeClass as y, createElementVNode as l, createVNode as g, createTextVNode as f } from "vue";
import { useRows as q, useOpenRow as C, Skeleton as v, Icon as N, ago as S } from "@journal/window-kit";
const x = (_, o) => {
  const a = _.__vccOpts || _;
  for (const [r, d] of o)
    a[r] = d;
  return a;
}, V = { class: "cards" }, B = {
  key: 1,
  class: "cards-note"
}, O = {
  key: 2,
  class: "cards-note"
}, b = ["data-row", "onClick"], E = { class: "card-head" }, I = { class: "card-age" }, R = { class: "card-title" }, z = {
  key: 0,
  class: "card-steps"
}, D = { class: "card-foot" }, F = {
  __name: "SequenceCards",
  setup(_) {
    const { rows: o, failure: a, loaded: r } = q("sequence list", ["sequence.*"]), { opened: d, toggle: k } = C();
    return (L, T) => (s(), c("div", V, [
      e(r) ? e(a) ? (s(), c("p", B, n(e(a)), 1)) : e(r) && !e(o).length ? (s(), c("p", O, "No sequences yet")) : u("", !0) : (s(), m(e(v), {
        key: 0,
        shape: "cards"
      })),
      (s(!0), c(p, null, h(e(o), (t) => (s(), c("button", {
        key: t.id,
        type: "button",
        class: y(["card", { open: e(d) === t.id }]),
        "data-row": t.id,
        onClick: (i) => e(k)(t)
      }, [
        l("span", E, [
          g(e(N), {
            name: "list",
            class: "card-icon"
          }),
          f(" Sequence " + n(t.id), 1),
          l("span", I, n(e(S)(t.created_at)), 1)
        ]),
        l("span", R, n(t.title), 1),
        e(d) === t.id ? (s(), c("ol", z, [
          (s(!0), c(p, null, h(t.steps, (i) => (s(), c("li", { key: i }, n(i), 1))), 128))
        ])) : u("", !0),
        l("span", D, n(t.steps.length) + " steps · Only when you or the agent start it", 1)
      ], 10, b))), 128))
    ]));
  }
}, A = /* @__PURE__ */ x(F, [["__scopeId", "data-v-08a83032"]]);
export {
  A as default
};
