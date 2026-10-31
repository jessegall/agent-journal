/* @code-commandments-generated */
if (!document.getElementById("window-styles-15064a272f8b")) { const style = document.createElement("style"); style.id = "window-styles-15064a272f8b"; style.textContent = ".cards[data-v-93fa6d21]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-93fa6d21]{display:flex;flex-direction:column;gap:8px;min-height:130px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-93fa6d21]:hover,.card.open[data-v-93fa6d21]{border-color:var(--border-strong, var(--border))}.card-head[data-v-93fa6d21]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-93fa6d21]{width:14px;height:14px}.card-title[data-v-93fa6d21]{font-weight:600}.card-steps[data-v-93fa6d21]{margin:0;padding-left:18px;color:var(--text-2);font-size:13px;line-height:1.6}.card-foot[data-v-93fa6d21]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-93fa6d21]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { openBlock as s, createElementBlock as n, unref as t, toDisplayString as c, createCommentVNode as u, Fragment as p, renderList as h, normalizeClass as y, createElementVNode as _, createVNode as f, createTextVNode as k } from "vue";
import { useRows as g, useOpenRow as q, Icon as C } from "@journal/window-kit";
const v = (d, a) => {
  const o = d.__vccOpts || d;
  for (const [l, r] of a)
    o[l] = r;
  return o;
}, N = { class: "cards" }, x = {
  key: 0,
  class: "cards-note"
}, S = {
  key: 1,
  class: "cards-note"
}, V = ["data-row", "onClick"], O = { class: "card-head" }, b = { class: "card-title" }, B = {
  key: 0,
  class: "card-steps"
}, E = { class: "card-foot" }, I = {
  __name: "SequenceCards",
  setup(d) {
    const { rows: a, failure: o, loaded: l } = g("sequence list", ["sequence.*"]), { opened: r, toggle: m } = q();
    return (R, z) => (s(), n("div", N, [
      t(o) ? (s(), n("p", x, c(t(o)), 1)) : t(l) && !t(a).length ? (s(), n("p", S, "No sequences yet")) : u("", !0),
      (s(!0), n(p, null, h(t(a), (e) => (s(), n("button", {
        key: e.id,
        type: "button",
        class: y(["card", { open: t(r) === e.id }]),
        "data-row": e.id,
        onClick: (i) => t(m)(e)
      }, [
        _("span", O, [
          f(t(C), {
            name: "list",
            class: "card-icon"
          }),
          k(" Sequence " + c(e.id), 1)
        ]),
        _("span", b, c(e.title), 1),
        t(r) === e.id ? (s(), n("ol", B, [
          (s(!0), n(p, null, h(e.steps, (i) => (s(), n("li", { key: i }, c(i), 1))), 128))
        ])) : u("", !0),
        _("span", E, c(e.steps.length) + " steps · Only when you or the agent start it", 1)
      ], 10, V))), 128))
    ]));
  }
}, L = /* @__PURE__ */ v(I, [["__scopeId", "data-v-93fa6d21"]]);
export {
  L as default
};
