/* @code-commandments-generated */
if (!document.getElementById("window-styles-7b4a4f6a549e")) { const style = document.createElement("style"); style.id = "window-styles-7b4a4f6a549e"; style.textContent = ".cards[data-v-4c5c861b]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-4c5c861b]{display:flex;flex-direction:column;gap:8px;min-height:110px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-4c5c861b]:hover,.card.open[data-v-4c5c861b]{border-color:var(--border-strong, var(--border))}.card-head[data-v-4c5c861b]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-4c5c861b]{width:14px;height:14px}.card-title[data-v-4c5c861b]{font-weight:600}.card-detail[data-v-4c5c861b]{color:var(--text-2);font-size:13px}.card-foot[data-v-4c5c861b]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-4c5c861b]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { openBlock as s, createElementBlock as a, unref as t, createBlock as g, toDisplayString as c, createCommentVNode as _, Fragment as h, renderList as u, normalizeClass as m, createElementVNode as l, createVNode as k, createTextVNode as f } from "vue";
import { useRows as x, useOpenRow as y, Skeleton as C, Icon as N } from "@journal/window-kit";
const v = (i, o) => {
  const n = i.__vccOpts || i;
  for (const [r, d] of o)
    n[r] = d;
  return n;
}, b = { class: "cards" }, T = {
  key: 1,
  class: "cards-note"
}, V = {
  key: 2,
  class: "cards-note"
}, $ = ["data-row", "onClick"], B = { class: "card-head" }, O = { class: "card-title" }, E = {
  key: 0,
  class: "card-detail"
}, I = { class: "card-foot" }, R = {
  __name: "TriggerCards",
  setup(i) {
    const { rows: o, failure: n, loaded: r } = x("trigger list", ["trigger.*"]), { opened: d, toggle: p } = y();
    return (S, j) => (s(), a("div", b, [
      t(r) ? t(n) ? (s(), a("p", T, c(t(n)), 1)) : t(r) && !t(o).length ? (s(), a("p", V, "No triggers yet")) : _("", !0) : (s(), g(t(C), {
        key: 0,
        shape: "cards"
      })),
      (s(!0), a(h, null, u(t(o), (e) => (s(), a("button", {
        key: e.id,
        type: "button",
        class: m(["card", { open: t(d) === e.id }]),
        "data-row": e.id,
        onClick: (z) => t(p)(e)
      }, [
        l("span", B, [
          k(t(N), {
            name: "bolt",
            class: "card-icon"
          }),
          f(" Trigger " + c(e.id) + " · " + c(e.action), 1)
        ]),
        l("span", O, c(e.text), 1),
        t(d) === e.id ? (s(), a("span", E, c(e.next_at ? `Next at ${e.next_at}` : `When these come up: ${e.phrases.join(", ")}`), 1)) : _("", !0),
        l("span", I, c(e.next_at ? "On a schedule" : `${e.phrases.length} phrases`), 1)
      ], 10, $))), 128))
    ]));
  }
}, L = /* @__PURE__ */ v(R, [["__scopeId", "data-v-4c5c861b"]]);
export {
  L as default
};
