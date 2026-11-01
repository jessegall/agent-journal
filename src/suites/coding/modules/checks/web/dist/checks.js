/* @code-commandments-generated */
if (!document.getElementById("window-styles-d010f1244104")) { const style = document.createElement("style"); style.id = "window-styles-d010f1244104"; style.textContent = ".cards[data-v-fa2584c8]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-fa2584c8]{display:flex;flex-direction:column;gap:8px;min-height:110px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-fa2584c8]:hover,.card.open[data-v-fa2584c8]{border-color:var(--border-strong, var(--border))}.card-head[data-v-fa2584c8]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-fa2584c8]{width:14px;height:14px}.card-title[data-v-fa2584c8]{font-weight:600}.card-detail[data-v-fa2584c8],.card-output[data-v-fa2584c8]{margin:0;color:var(--text-2);font-size:12px;white-space:pre-wrap}.card-foot[data-v-fa2584c8]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-fa2584c8]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { openBlock as s, createElementBlock as c, unref as t, createBlock as h, toDisplayString as a, createCommentVNode as i, Fragment as u, renderList as k, normalizeClass as m, createElementVNode as l, createVNode as y, createTextVNode as f } from "vue";
import { useRows as C, useOpenRow as v, Skeleton as g, Icon as N } from "@journal/window-kit";
const x = (_, o) => {
  const n = _.__vccOpts || _;
  for (const [d, r] of o)
    n[d] = r;
  return n;
}, V = { class: "cards" }, b = {
  key: 1,
  class: "cards-note"
}, B = {
  key: 2,
  class: "cards-note"
}, E = ["data-row", "onClick"], O = { class: "card-head" }, I = { class: "card-title" }, R = { class: "card-detail" }, S = {
  key: 0,
  class: "card-output"
}, $ = { class: "card-foot" }, z = {
  __name: "CheckCards",
  setup(_) {
    const { rows: o, failure: n, loaded: d } = C("check list", ["check.*"]), { opened: r, toggle: p } = v();
    return (D, F) => (s(), c("div", V, [
      t(d) ? t(n) ? (s(), c("p", b, a(t(n)), 1)) : t(d) && !t(o).length ? (s(), c("p", B, "No checks yet")) : i("", !0) : (s(), h(t(g), {
        key: 0,
        shape: "cards"
      })),
      (s(!0), c(u, null, k(t(o), (e) => (s(), c("button", {
        key: e.id,
        type: "button",
        class: m(["card", { open: t(r) === e.id }]),
        "data-row": e.id,
        onClick: (L) => t(p)(e)
      }, [
        l("span", O, [
          y(t(N), {
            name: "check",
            class: "card-icon"
          }),
          f(" Check " + a(e.id), 1)
        ]),
        l("span", I, a(e.title), 1),
        t(r) === e.id ? (s(), c(u, { key: 0 }, [
          l("code", R, a(e.command), 1),
          e.last_output ? (s(), c("pre", S, a(e.last_output), 1)) : i("", !0)
        ], 64)) : i("", !0),
        l("span", $, a(e.status) + " · " + a(e.interval_minutes ? `Every ${e.interval_minutes} minutes` : "Only when run by hand"), 1)
      ], 10, E))), 128))
    ]));
  }
}, q = /* @__PURE__ */ x(z, [["__scopeId", "data-v-fa2584c8"]]);
export {
  q as default
};
