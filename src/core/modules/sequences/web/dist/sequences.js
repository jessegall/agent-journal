/* @code-commandments-generated */
if (!document.getElementById("window-styles-fdbc8f0dc736")) { const style = document.createElement("style"); style.id = "window-styles-fdbc8f0dc736"; style.textContent = ".cards[data-v-7bd6d301]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-7bd6d301]{display:flex;flex-direction:column;gap:8px;min-height:130px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-7bd6d301]:hover,.card.open[data-v-7bd6d301]{border-color:var(--border-strong, var(--border))}.card-head[data-v-7bd6d301]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-7bd6d301]{width:14px;height:14px}.card-title[data-v-7bd6d301]{font-weight:600}.card-steps[data-v-7bd6d301]{margin:0;padding-left:18px;color:var(--text-2);font-size:13px;line-height:1.6}.card-foot[data-v-7bd6d301]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-7bd6d301]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { ref as y, openBlock as t, createElementBlock as s, unref as c, toDisplayString as a, createCommentVNode as p, Fragment as h, renderList as m, normalizeClass as k, createElementVNode as _, createVNode as v, createTextVNode as g } from "vue";
import { useRows as q, Icon as C } from "@journal/window-kit";
const N = (d, l) => {
  const o = d.__vccOpts || d;
  for (const [r, n] of l)
    o[r] = n;
  return o;
}, x = { class: "cards" }, S = {
  key: 0,
  class: "cards-note"
}, V = {
  key: 1,
  class: "cards-note"
}, b = ["data-row", "onClick"], B = { class: "card-head" }, E = { class: "card-title" }, I = {
  key: 0,
  class: "card-steps"
}, O = { class: "card-foot" }, z = {
  __name: "SequenceCards",
  setup(d) {
    const { rows: l, failure: o, loaded: r } = q("sequence list", ["sequence.*"]), n = y(null);
    function f(i) {
      n.value = n.value === i.id ? null : i.id;
    }
    return (i, D) => (t(), s("div", x, [
      c(o) ? (t(), s("p", S, a(c(o)), 1)) : c(r) && !c(l).length ? (t(), s("p", V, "No sequences yet")) : p("", !0),
      (t(!0), s(h, null, m(c(l), (e) => (t(), s("button", {
        key: e.id,
        type: "button",
        class: k(["card", { open: n.value === e.id }]),
        "data-row": e.id,
        onClick: (u) => f(e)
      }, [
        _("span", B, [
          v(c(C), {
            name: "list",
            class: "card-icon"
          }),
          g(" Sequence " + a(e.id), 1)
        ]),
        _("span", E, a(e.title), 1),
        n.value === e.id ? (t(), s("ol", I, [
          (t(!0), s(h, null, m(e.steps, (u) => (t(), s("li", { key: u }, a(u), 1))), 128))
        ])) : p("", !0),
        _("span", O, a(e.steps.length) + " steps · Only when you or the agent start it", 1)
      ], 10, b))), 128))
    ]));
  }
}, R = /* @__PURE__ */ N(z, [["__scopeId", "data-v-7bd6d301"]]);
export {
  R as default
};
