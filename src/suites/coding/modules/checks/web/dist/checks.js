/* @code-commandments-generated */
if (!document.getElementById("window-styles-824a5d2f7fde")) { const style = document.createElement("style"); style.id = "window-styles-824a5d2f7fde"; style.textContent = ".cards[data-v-13bf9a29]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-13bf9a29]{display:flex;flex-direction:column;gap:8px;min-height:110px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-13bf9a29]:hover,.card.open[data-v-13bf9a29]{border-color:var(--border-strong, var(--border))}.card-head[data-v-13bf9a29]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-13bf9a29]{width:14px;height:14px}.card-title[data-v-13bf9a29]{font-weight:600}.card-detail[data-v-13bf9a29],.card-output[data-v-13bf9a29]{margin:0;color:var(--text-2);font-size:12px;white-space:pre-wrap}.card-foot[data-v-13bf9a29]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-13bf9a29]{margin:0;color:var(--text-2)}.card-state[data-v-13bf9a29]{margin-left:auto;color:var(--text-3)}.card-state.passing[data-v-13bf9a29]{color:var(--accent-text)}.card-state.failing[data-v-13bf9a29]{color:var(--danger)}\n"; document.head.appendChild(style); }
import { openBlock as s, createElementBlock as c, unref as t, createBlock as k, toDisplayString as a, createCommentVNode as _, Fragment as p, renderList as m, normalizeClass as u, createElementVNode as o, createVNode as f, createTextVNode as y } from "vue";
import { useRows as g, useOpenRow as C, Skeleton as v, Icon as N } from "@journal/window-kit";
const b = (i, d) => {
  const n = i.__vccOpts || i;
  for (const [l, r] of d)
    n[l] = r;
  return n;
}, x = { class: "cards" }, V = {
  key: 1,
  class: "cards-note"
}, B = {
  key: 2,
  class: "cards-note"
}, E = ["data-row", "onClick"], O = { class: "card-head" }, F = { class: "card-title" }, I = { class: "card-detail" }, R = {
  key: 0,
  class: "card-output"
}, S = { class: "card-foot" }, $ = {
  __name: "CheckCards",
  setup(i) {
    const { rows: d, failure: n, loaded: l } = g("check list", ["check.*"]), { opened: r, toggle: h } = C();
    return (z, D) => (s(), c("div", x, [
      t(l) ? t(n) ? (s(), c("p", V, a(t(n)), 1)) : t(l) && !t(d).length ? (s(), c("p", B, "No checks yet")) : _("", !0) : (s(), k(t(v), {
        key: 0,
        shape: "cards"
      })),
      (s(!0), c(p, null, m(t(d), (e) => (s(), c("button", {
        key: e.id,
        type: "button",
        class: u(["card", { open: t(r) === e.id }]),
        "data-row": e.id,
        onClick: (L) => t(h)(e)
      }, [
        o("span", O, [
          f(t(N), {
            name: "check",
            class: "card-icon"
          }),
          y(" Check " + a(e.id), 1),
          o("span", {
            class: u(["card-state", { failing: e.last_passed === !1, passing: e.last_passed === !0 }])
          }, a(e.last_passed === !0 ? "Passing" : e.last_passed === !1 ? "Failing" : "Not run"), 3)
        ]),
        o("span", F, a(e.title), 1),
        o("code", I, a(e.command), 1),
        t(r) === e.id ? (s(), c(p, { key: 0 }, [
          e.last_output ? (s(), c("pre", R, a(e.last_output), 1)) : _("", !0)
        ], 64)) : _("", !0),
        o("span", S, a(e.status) + " · " + a(e.interval_minutes ? `Every ${e.interval_minutes} minutes` : "Only when run by hand"), 1)
      ], 10, E))), 128))
    ]));
  }
}, j = /* @__PURE__ */ b($, [["__scopeId", "data-v-13bf9a29"]]);
export {
  j as default
};
