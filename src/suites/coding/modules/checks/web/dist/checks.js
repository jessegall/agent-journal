/* @code-commandments-generated */
if (!document.getElementById("window-styles-6fe1fb8d5611")) { const style = document.createElement("style"); style.id = "window-styles-6fe1fb8d5611"; style.textContent = ".cards[data-v-d7570419]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px;align-content:start;padding:16px 20px}.card[data-v-d7570419]{display:flex;flex-direction:column;gap:8px;min-height:110px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface);color:inherit;text-align:left;cursor:pointer}.card[data-v-d7570419]:hover,.card.open[data-v-d7570419]{border-color:var(--border-strong, var(--border))}.card-head[data-v-d7570419]{display:flex;gap:6px;align-items:center;color:var(--text-2);font-size:13px}.card-icon[data-v-d7570419]{width:14px;height:14px}.card-title[data-v-d7570419]{font-weight:600}.card-detail[data-v-d7570419],.card-output[data-v-d7570419]{margin:0;color:var(--text-2);font-size:12px;white-space:pre-wrap}.card-foot[data-v-d7570419]{margin-top:auto;color:var(--text-3);font-size:12px}.cards-note[data-v-d7570419]{margin:0;color:var(--text-2)}.card-state[data-v-d7570419]{margin-left:auto;color:var(--text-3)}.card-state.passing[data-v-d7570419]{color:var(--accent-text)}.card-state.failing[data-v-d7570419]{color:var(--danger)}\n"; document.head.appendChild(style); }
import { openBlock as s, createElementBlock as c, unref as t, createBlock as v, toDisplayString as a, createCommentVNode as p, createVNode as u, Fragment as m, renderList as N, normalizeClass as f, createElementVNode as o, createTextVNode as y, withModifiers as x, withCtx as B } from "vue";
import { useRows as O, useOpenRow as V, useListTools as $, Skeleton as b, ListTools as E, Icon as L, Btn as R, peekRef as S } from "@journal/window-kit";
const T = (_, l) => {
  const n = _.__vccOpts || _;
  for (const [d, i] of l)
    n[d] = i;
  return n;
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
    const { rows: l, failure: n, loaded: d } = O("check list", ["check.*"]), { opened: i, toggle: C } = V(), h = $(l, { title: (r) => r.title, isOpen: (r) => !r.stopped });
    return (r, k) => (s(), c("div", D, [
      t(d) ? t(n) ? (s(), c("p", F, a(t(n)), 1)) : t(d) && !t(l).length ? (s(), c("p", I, "No checks yet")) : p("", !0) : (s(), v(t(b), {
        key: 0,
        shape: "cards"
      })),
      u(t(E), {
        tools: t(h),
        placeholder: "Search the checks"
      }, null, 8, ["tools"]),
      (s(!0), c(m, null, N(t(h).shown.value, (e) => (s(), c("button", {
        key: e.id,
        type: "button",
        class: f(["card", { open: t(i) === e.id }]),
        "data-row": e.id,
        onClick: (g) => t(C)(e)
      }, [
        o("span", M, [
          u(t(L), {
            name: "check",
            class: "card-icon"
          }),
          y(" Check " + a(e.id), 1),
          o("span", {
            class: f(["card-state", { failing: e.last_passed === !1, passing: e.last_passed === !0 }])
          }, a(e.last_passed === !0 ? "Passing" : e.last_passed === !1 ? "Failing" : "Not run"), 3)
        ]),
        o("span", P, a(e.title), 1),
        u(t(R), {
          small: "",
          "data-check-open": "",
          onClick: x((g) => t(S)(`checks:${e.id}`), ["stop"])
        }, {
          default: B(() => [...k[0] || (k[0] = [
            y("Details", -1)
          ])]),
          _: 1
        }, 8, ["onClick"]),
        o("code", j, a(e.command), 1),
        t(i) === e.id ? (s(), c(m, { key: 0 }, [
          e.last_output ? (s(), c("pre", q, a(e.last_output), 1)) : p("", !0)
        ], 64)) : p("", !0),
        o("span", A, a(e.status) + " · " + a(e.interval_minutes ? `Every ${e.interval_minutes} minutes` : "Only when run by hand"), 1)
      ], 10, z))), 128))
    ]));
  }
}, K = /* @__PURE__ */ T(G, [["__scopeId", "data-v-d7570419"]]);
export {
  K as default
};
