/* @code-commandments-generated */
if (!document.getElementById("window-styles-bf234e43846d")) { const style = document.createElement("style"); style.id = "window-styles-bf234e43846d"; style.textContent = ".cards[data-v-5e6ca405]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-5e6ca405]{display:flex;flex-direction:column;gap:8px;min-height:130px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-5e6ca405]:hover,.card.open[data-v-5e6ca405]{border-color:var(--border-strong, var(--border))}.card-head[data-v-5e6ca405]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-5e6ca405]{width:14px;height:14px}.card-title[data-v-5e6ca405]{font-weight:600}.card-steps[data-v-5e6ca405]{margin:0;padding-left:18px;color:var(--text-2);font-size:13px;line-height:1.6}.card-foot[data-v-5e6ca405]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-5e6ca405]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { openBlock as s, createElementBlock as c, unref as e, createBlock as m, toDisplayString as o, createCommentVNode as u, Fragment as p, renderList as h, normalizeClass as y, createElementVNode as _, createVNode as f, createTextVNode as g } from "vue";
import { useRows as q, useOpenRow as C, Skeleton as v, Icon as N } from "@journal/window-kit";
const S = (l, a) => {
  const n = l.__vccOpts || l;
  for (const [r, d] of a)
    n[r] = d;
  return n;
}, x = { class: "cards" }, V = {
  key: 1,
  class: "cards-note"
}, B = {
  key: 2,
  class: "cards-note"
}, O = ["data-row", "onClick"], b = { class: "card-head" }, E = { class: "card-title" }, I = {
  key: 0,
  class: "card-steps"
}, R = { class: "card-foot" }, z = {
  __name: "SequenceCards",
  setup(l) {
    const { rows: a, failure: n, loaded: r } = q("sequence list", ["sequence.*"]), { opened: d, toggle: k } = C();
    return (D, F) => (s(), c("div", x, [
      e(r) ? e(n) ? (s(), c("p", V, o(e(n)), 1)) : e(r) && !e(a).length ? (s(), c("p", B, "No sequences yet")) : u("", !0) : (s(), m(e(v), {
        key: 0,
        shape: "cards"
      })),
      (s(!0), c(p, null, h(e(a), (t) => (s(), c("button", {
        key: t.id,
        type: "button",
        class: y(["card", { open: e(d) === t.id }]),
        "data-row": t.id,
        onClick: (i) => e(k)(t)
      }, [
        _("span", b, [
          f(e(N), {
            name: "list",
            class: "card-icon"
          }),
          g(" Sequence " + o(t.id), 1)
        ]),
        _("span", E, o(t.title), 1),
        e(d) === t.id ? (s(), c("ol", I, [
          (s(!0), c(p, null, h(t.steps, (i) => (s(), c("li", { key: i }, o(i), 1))), 128))
        ])) : u("", !0),
        _("span", R, o(t.steps.length) + " steps · Only when you or the agent start it", 1)
      ], 10, O))), 128))
    ]));
  }
}, $ = /* @__PURE__ */ S(z, [["__scopeId", "data-v-5e6ca405"]]);
export {
  $ as default
};
