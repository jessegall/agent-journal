/* @code-commandments-generated */
if (!document.getElementById("window-styles-60df3a66e3d5")) { const style = document.createElement("style"); style.id = "window-styles-60df3a66e3d5"; style.textContent = ".cards[data-v-f9b9a027]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-f9b9a027]{display:flex;flex-direction:column;gap:8px;min-height:110px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-f9b9a027]:hover,.card.open[data-v-f9b9a027]{border-color:var(--border-strong, var(--border))}.card-head[data-v-f9b9a027]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-f9b9a027]{width:14px;height:14px}.card-title[data-v-f9b9a027]{font-weight:600}.card-detail[data-v-f9b9a027]{color:var(--text-2);font-size:13px}.card-foot[data-v-f9b9a027]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-f9b9a027]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { openBlock as s, createElementBlock as a, unref as t, toDisplayString as n, createCommentVNode as l, Fragment as g, renderList as h, normalizeClass as u, createElementVNode as _, createVNode as m, createTextVNode as f } from "vue";
import { useRows as k, useOpenRow as x, Icon as y } from "@journal/window-kit";
const C = (d, c) => {
  const o = d.__vccOpts || d;
  for (const [i, r] of c)
    o[i] = r;
  return o;
}, N = { class: "cards" }, v = {
  key: 0,
  class: "cards-note"
}, b = {
  key: 1,
  class: "cards-note"
}, T = ["data-row", "onClick"], V = { class: "card-head" }, $ = { class: "card-title" }, O = {
  key: 0,
  class: "card-detail"
}, B = { class: "card-foot" }, E = {
  __name: "TriggerCards",
  setup(d) {
    const { rows: c, failure: o, loaded: i } = k("trigger list", ["trigger.*"]), { opened: r, toggle: p } = x();
    return (I, R) => (s(), a("div", N, [
      t(o) ? (s(), a("p", v, n(t(o)), 1)) : t(i) && !t(c).length ? (s(), a("p", b, "No triggers yet")) : l("", !0),
      (s(!0), a(g, null, h(t(c), (e) => (s(), a("button", {
        key: e.id,
        type: "button",
        class: u(["card", { open: t(r) === e.id }]),
        "data-row": e.id,
        onClick: (j) => t(p)(e)
      }, [
        _("span", V, [
          m(t(y), {
            name: "bolt",
            class: "card-icon"
          }),
          f(" Trigger " + n(e.id) + " · " + n(e.action), 1)
        ]),
        _("span", $, n(e.text), 1),
        t(r) === e.id ? (s(), a("span", O, n(e.next_at ? `Next at ${e.next_at}` : `When these come up: ${e.phrases.join(", ")}`), 1)) : l("", !0),
        _("span", B, n(e.next_at ? "On a schedule" : `${e.phrases.length} phrases`), 1)
      ], 10, T))), 128))
    ]));
  }
}, F = /* @__PURE__ */ C(E, [["__scopeId", "data-v-f9b9a027"]]);
export {
  F as default
};
