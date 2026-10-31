/* @code-commandments-generated */
if (!document.getElementById("window-styles-031d55fecf0f")) { const style = document.createElement("style"); style.id = "window-styles-031d55fecf0f"; style.textContent = ".cards[data-v-e1b12a2a]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-e1b12a2a]{display:flex;flex-direction:column;gap:8px;min-height:110px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-e1b12a2a]:hover,.card.open[data-v-e1b12a2a]{border-color:var(--border-strong, var(--border))}.card-head[data-v-e1b12a2a]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-e1b12a2a]{width:14px;height:14px}.card-title[data-v-e1b12a2a]{font-weight:600}.card-detail[data-v-e1b12a2a],.card-output[data-v-e1b12a2a]{margin:0;color:var(--text-2);font-size:12px;white-space:pre-wrap}.card-foot[data-v-e1b12a2a]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-e1b12a2a]{margin:0;color:var(--text-2)}\n"; document.head.appendChild(style); }
import { openBlock as s, createElementBlock as c, unref as t, toDisplayString as a, createCommentVNode as i, Fragment as u, renderList as h, normalizeClass as m, createElementVNode as r, createVNode as k, createTextVNode as y } from "vue";
import { useRows as f, useOpenRow as C, Icon as v } from "@journal/window-kit";
const g = (l, o) => {
  const n = l.__vccOpts || l;
  for (const [_, d] of o)
    n[_] = d;
  return n;
}, N = { class: "cards" }, b = {
  key: 0,
  class: "cards-note"
}, x = {
  key: 1,
  class: "cards-note"
}, V = ["data-row", "onClick"], E = { class: "card-head" }, O = { class: "card-title" }, B = { class: "card-detail" }, I = {
  key: 0,
  class: "card-output"
}, R = { class: "card-foot" }, $ = {
  __name: "CheckCards",
  setup(l) {
    const { rows: o, failure: n, loaded: _ } = f("check list", ["check.*"]), { opened: d, toggle: p } = C();
    return (z, D) => (s(), c("div", N, [
      t(n) ? (s(), c("p", b, a(t(n)), 1)) : t(_) && !t(o).length ? (s(), c("p", x, "No checks yet")) : i("", !0),
      (s(!0), c(u, null, h(t(o), (e) => (s(), c("button", {
        key: e.id,
        type: "button",
        class: m(["card", { open: t(d) === e.id }]),
        "data-row": e.id,
        onClick: (F) => t(p)(e)
      }, [
        r("span", E, [
          k(t(v), {
            name: "check",
            class: "card-icon"
          }),
          y(" Check " + a(e.id), 1)
        ]),
        r("span", O, a(e.title), 1),
        t(d) === e.id ? (s(), c(u, { key: 0 }, [
          r("code", B, a(e.command), 1),
          e.last_output ? (s(), c("pre", I, a(e.last_output), 1)) : i("", !0)
        ], 64)) : i("", !0),
        r("span", R, a(e.status) + " · " + a(e.interval_minutes ? `Every ${e.interval_minutes} minutes` : "Only when run by hand"), 1)
      ], 10, V))), 128))
    ]));
  }
}, T = /* @__PURE__ */ g($, [["__scopeId", "data-v-e1b12a2a"]]);
export {
  T as default
};
