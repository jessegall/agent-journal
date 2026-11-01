/* @code-commandments-generated */
if (!document.getElementById("window-styles-4cd14c48b3dd")) { const style = document.createElement("style"); style.id = "window-styles-4cd14c48b3dd"; style.textContent = ".cards[data-v-7a164afd]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-7a164afd]{display:flex;flex-direction:column;gap:8px;min-height:110px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-7a164afd]:hover,.card.open[data-v-7a164afd]{border-color:var(--border-strong, var(--border))}.card-head[data-v-7a164afd]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-7a164afd]{width:14px;height:14px}.card-title[data-v-7a164afd]{font-weight:600}.card-detail[data-v-7a164afd],.card-output[data-v-7a164afd]{margin:0;color:var(--text-2);font-size:12px;white-space:pre-wrap}.card-foot[data-v-7a164afd]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-7a164afd]{margin:0;color:var(--text-2)}.card-state[data-v-7a164afd]{margin-left:auto;color:var(--text-3)}.card-state.passing[data-v-7a164afd]{color:var(--accent-text)}.card-state.failing[data-v-7a164afd]{color:var(--danger)}\n"; document.head.appendChild(style); }
import { openBlock as s, createElementBlock as c, unref as t, createBlock as C, toDisplayString as a, createCommentVNode as _, Fragment as u, renderList as g, normalizeClass as k, createElementVNode as o, createVNode as h, createTextVNode as m, withModifiers as v, withCtx as N } from "vue";
import { useRows as x, useOpenRow as B, Skeleton as V, Icon as $, Btn as b, peekRef as E } from "@journal/window-kit";
const O = (r, d) => {
  const n = r.__vccOpts || r;
  for (const [l, i] of d)
    n[l] = i;
  return n;
}, R = { class: "cards" }, D = {
  key: 1,
  class: "cards-note"
}, F = {
  key: 2,
  class: "cards-note"
}, I = ["data-row", "onClick"], S = { class: "card-head" }, z = { class: "card-title" }, L = { class: "card-detail" }, M = {
  key: 0,
  class: "card-output"
}, P = { class: "card-foot" }, T = {
  __name: "CheckCards",
  setup(r) {
    const { rows: d, failure: n, loaded: l } = x("check list", ["check.*"]), { opened: i, toggle: f } = B();
    return (j, p) => (s(), c("div", R, [
      t(l) ? t(n) ? (s(), c("p", D, a(t(n)), 1)) : t(l) && !t(d).length ? (s(), c("p", F, "No checks yet")) : _("", !0) : (s(), C(t(V), {
        key: 0,
        shape: "cards"
      })),
      (s(!0), c(u, null, g(t(d), (e) => (s(), c("button", {
        key: e.id,
        type: "button",
        class: k(["card", { open: t(i) === e.id }]),
        "data-row": e.id,
        onClick: (y) => t(f)(e)
      }, [
        o("span", S, [
          h(t($), {
            name: "check",
            class: "card-icon"
          }),
          m(" Check " + a(e.id), 1),
          o("span", {
            class: k(["card-state", { failing: e.last_passed === !1, passing: e.last_passed === !0 }])
          }, a(e.last_passed === !0 ? "Passing" : e.last_passed === !1 ? "Failing" : "Not run"), 3)
        ]),
        o("span", z, a(e.title), 1),
        h(t(b), {
          small: "",
          "data-check-open": "",
          onClick: v((y) => t(E)(`checks:${e.id}`), ["stop"])
        }, {
          default: N(() => [...p[0] || (p[0] = [
            m("Details", -1)
          ])]),
          _: 1
        }, 8, ["onClick"]),
        o("code", L, a(e.command), 1),
        t(i) === e.id ? (s(), c(u, { key: 0 }, [
          e.last_output ? (s(), c("pre", M, a(e.last_output), 1)) : _("", !0)
        ], 64)) : _("", !0),
        o("span", P, a(e.status) + " · " + a(e.interval_minutes ? `Every ${e.interval_minutes} minutes` : "Only when run by hand"), 1)
      ], 10, I))), 128))
    ]));
  }
}, G = /* @__PURE__ */ O(T, [["__scopeId", "data-v-7a164afd"]]);
export {
  G as default
};
