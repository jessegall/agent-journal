/* @code-commandments-generated */
if (!document.getElementById("window-styles-c95b1c7902f9")) { const style = document.createElement("style"); style.id = "window-styles-c95b1c7902f9"; style.textContent = ".cards[data-v-feba1def]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-feba1def]{display:flex;flex-direction:column;gap:8px;min-height:110px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-feba1def]:hover,.card.open[data-v-feba1def]{border-color:var(--border-strong, var(--border))}.card-head[data-v-feba1def]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-feba1def]{width:14px;height:14px}.card-title[data-v-feba1def]{font-weight:600}.card-detail[data-v-feba1def]{color:var(--text-2);font-size:13px}.card-foot[data-v-feba1def]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-feba1def]{margin:0;color:var(--text-2)}.card-age[data-v-feba1def]{margin-left:auto}\n"; document.head.appendChild(style); }
import { openBlock as s, createElementBlock as c, unref as t, createBlock as g, toDisplayString as a, createCommentVNode as l, Fragment as h, renderList as u, normalizeClass as m, createElementVNode as i, createVNode as k, createTextVNode as f } from "vue";
import { useRows as x, useOpenRow as y, Skeleton as C, Icon as N, ago as v } from "@journal/window-kit";
const b = (_, o) => {
  const n = _.__vccOpts || _;
  for (const [r, d] of o)
    n[r] = d;
  return n;
}, T = { class: "cards" }, V = {
  key: 1,
  class: "cards-note"
}, $ = {
  key: 2,
  class: "cards-note"
}, B = ["data-row", "onClick"], O = { class: "card-head" }, E = { class: "card-age" }, I = { class: "card-title" }, R = {
  key: 0,
  class: "card-detail"
}, S = { class: "card-foot" }, j = {
  __name: "TriggerCards",
  setup(_) {
    const { rows: o, failure: n, loaded: r } = x("trigger list", ["trigger.*"]), { opened: d, toggle: p } = y();
    return (z, D) => (s(), c("div", T, [
      t(r) ? t(n) ? (s(), c("p", V, a(t(n)), 1)) : t(r) && !t(o).length ? (s(), c("p", $, "No triggers yet")) : l("", !0) : (s(), g(t(C), {
        key: 0,
        shape: "cards"
      })),
      (s(!0), c(h, null, u(t(o), (e) => (s(), c("button", {
        key: e.id,
        type: "button",
        class: m(["card", { open: t(d) === e.id }]),
        "data-row": e.id,
        onClick: (F) => t(p)(e)
      }, [
        i("span", O, [
          k(t(N), {
            name: "bolt",
            class: "card-icon"
          }),
          f(" Trigger " + a(e.id) + " · " + a(e.action), 1),
          i("span", E, a(t(v)(e.created_at)), 1)
        ]),
        i("span", I, a(e.text), 1),
        t(d) === e.id ? (s(), c("span", R, a(e.next_at ? `Next at ${e.next_at}` : `When these come up: ${e.phrases.join(", ")}`), 1)) : l("", !0),
        i("span", S, a(e.next_at ? "On a schedule" : `${e.phrases.length} phrases`), 1)
      ], 10, B))), 128))
    ]));
  }
}, q = /* @__PURE__ */ b(j, [["__scopeId", "data-v-feba1def"]]);
export {
  q as default
};
