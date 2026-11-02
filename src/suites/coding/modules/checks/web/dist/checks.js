/* @code-commandments-generated */
if (!document.getElementById("window-styles-9a27e445fec5")) { const style = document.createElement("style"); style.id = "window-styles-9a27e445fec5"; style.textContent = ".cards[data-v-154ec91f]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-154ec91f]{display:flex;flex-direction:column;min-width:0;gap:8px;min-height:110px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-154ec91f]:hover,.card.open[data-v-154ec91f]{border-color:var(--border-strong, var(--border))}.card-head[data-v-154ec91f]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-154ec91f]{width:14px;height:14px}.card-title[data-v-154ec91f]{font-weight:600}.card-detail[data-v-154ec91f],.card-output[data-v-154ec91f]{margin:0;overflow-wrap:anywhere;color:var(--text-2);font-size:12px;white-space:pre-wrap}.card-foot[data-v-154ec91f]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-154ec91f]{margin:0;color:var(--text-2)}.card-state[data-v-154ec91f]{margin-left:auto;color:var(--text-3)}.card-state.passing[data-v-154ec91f]{color:var(--accent-text)}.card-state.failing[data-v-154ec91f]{color:var(--danger)}\n"; document.head.appendChild(style); }
import { openBlock as s, createElementBlock as c, Fragment as p, createVNode as u, unref as t, createElementVNode as n, createBlock as v, toDisplayString as a, createCommentVNode as h, renderList as N, normalizeClass as f, createTextVNode as y, withModifiers as x, withCtx as B } from "vue";
import { useRows as O, useOpenRow as V, useListTools as $, ListTools as b, Skeleton as E, Icon as L, Btn as R, peekRef as S } from "@journal/window-kit";
const T = (_, l) => {
  const o = _.__vccOpts || _;
  for (const [d, i] of l)
    o[d] = i;
  return o;
}, D = { class: "cards" }, F = {
  key: 1,
  class: "cards-note"
}, I = {
  key: 2,
  class: "cards-note"
}, z = ["data-row", "onClick"], M = { class: "card-head" }, P = { class: "card-title" }, j = { class: "card-detail" }, q = {
  key: 0,
  class: "card-output"
}, A = { class: "card-foot" }, G = {
  __name: "CheckCards",
  setup(_) {
    const { rows: l, failure: o, loaded: d } = O("check list", ["check.*"]), { opened: i, toggle: C } = V(), k = $(l, { title: (r) => r.title, isOpen: (r) => !r.stopped });
    return (r, m) => (s(), c(p, null, [
      u(t(b), {
        tools: t(k),
        placeholder: "Search the checks"
      }, null, 8, ["tools"]),
      n("div", D, [
        t(d) ? t(o) ? (s(), c("p", F, a(t(o)), 1)) : t(d) && !t(l).length ? (s(), c("p", I, "No checks yet")) : h("", !0) : (s(), v(t(E), {
          key: 0,
          shape: "cards"
        })),
        (s(!0), c(p, null, N(t(k).shown.value, (e) => (s(), c("button", {
          key: e.id,
          type: "button",
          class: f(["card", { open: t(i) === e.id }]),
          "data-row": e.id,
          onClick: (g) => t(C)(e)
        }, [
          n("span", M, [
            u(t(L), {
              name: "check",
              class: "card-icon"
            }),
            y(" Check " + a(e.id), 1),
            n("span", {
              class: f(["card-state", { failing: e.last_passed === !1, passing: e.last_passed === !0 }])
            }, a(e.last_passed === !0 ? "Passing" : e.last_passed === !1 ? "Failing" : "Not run"), 3)
          ]),
          n("span", P, a(e.title), 1),
          u(t(R), {
            small: "",
            "data-check-open": "",
            onClick: x((g) => t(S)(`checks:${e.id}`), ["stop"])
          }, {
            default: B(() => [...m[0] || (m[0] = [
              y("Details", -1)
            ])]),
            _: 1
          }, 8, ["onClick"]),
          n("code", j, a(e.command), 1),
          t(i) === e.id ? (s(), c(p, { key: 0 }, [
            e.last_output ? (s(), c("pre", q, a(e.last_output), 1)) : h("", !0)
          ], 64)) : h("", !0),
          n("span", A, a(e.status) + " · " + a(e.interval_minutes ? `Every ${e.interval_minutes} minutes` : "Only when run by hand"), 1)
        ], 10, z))), 128))
      ])
    ], 64));
  }
}, K = /* @__PURE__ */ T(G, [["__scopeId", "data-v-154ec91f"]]);
export {
  K as default
};
