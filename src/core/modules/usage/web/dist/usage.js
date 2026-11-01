/* @code-commandments-generated */
if (!document.getElementById("window-styles-77325080c4ba")) { const style = document.createElement("style"); style.id = "window-styles-77325080c4ba"; style.textContent = ".failure[data-v-fea58b80]{margin:0 0 8px;color:var(--bad, var(--text-2));font-size:12px}.heading[data-v-fea58b80]{margin:12px 0 6px;color:var(--text-3);font-size:12px;font-weight:600}.line[data-v-fea58b80]{display:flex;flex:1;align-items:baseline;gap:10px;font-size:13px}.title[data-v-fea58b80]{flex:1}.detail[data-v-fea58b80],.total[data-v-fea58b80]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as y, onUnmounted as N, openBlock as d, createElementBlock as r, Fragment as k, toDisplayString as t, createCommentVNode as p, createElementVNode as e, createVNode as f, unref as l, withCtx as h } from "vue";
import { useWindow as S, useRows as C, RowList as v } from "@journal/window-kit";
const E = (u, _) => {
  const a = u.__vccOpts || u;
  for (const [i, c] of _)
    a[i] = c;
  return a;
}, I = {
  key: 0,
  class: "failure"
}, L = { class: "line" }, R = { class: "title" }, D = { class: "detail" }, F = {
  key: 0,
  class: "detail"
}, P = { class: "detail" }, U = { class: "total" }, V = { class: "line" }, b = { class: "title" }, B = { class: "detail" }, M = { class: "detail" }, O = { class: "line" }, $ = { class: "title" }, H = { class: "detail" }, W = 3e4, j = {
  __name: "UsagePanel",
  setup(u) {
    const _ = S(), a = y(null), i = y(""), c = C("statistic list", []);
    async function m() {
      const o = await _.read("usage show");
      a.value = o.ok ? o.value : null, i.value = o.ok ? "" : o.error;
    }
    const g = (o) => `$${Number(o || 0).toFixed(2)}`, w = (o) => new Date(o * 1e3).toLocaleString(), x = setInterval(m, W);
    return N(() => clearInterval(x)), m(), (o, n) => (d(), r(k, null, [
      i.value ? (d(), r("p", I, t(i.value), 1)) : p("", !0),
      a.value ? (d(), r(k, { key: 1 }, [
        n[0] || (n[0] = e("h3", { class: "heading" }, "Sessions", -1)),
        f(l(v), {
          rows: a.value.agents,
          failure: "",
          loaded: !0,
          empty: "No open sessions"
        }, {
          default: h(({ row: s }) => [
            e("div", L, [
              e("span", R, t(s.session), 1),
              e("span", D, t(s.model || "Nothing reported yet"), 1),
              s.context_percent !== null ? (d(), r("span", F, "Context " + t(s.context_percent) + "%", 1)) : p("", !0),
              e("span", P, t(g(s.cost_dollars)), 1)
            ])
          ]),
          _: 1
        }, 8, ["rows"]),
        e("p", U, "Cost of the open sessions: " + t(g(a.value.cost_dollars)), 1),
        n[1] || (n[1] = e("h3", { class: "heading" }, "Plan", -1)),
        f(l(v), {
          rows: a.value.windows,
          failure: "",
          loaded: !0,
          empty: "No limits reported yet"
        }, {
          default: h(({ row: s }) => [
            e("div", V, [
              e("span", b, t(s.title), 1),
              e("span", B, t(Math.round(s.used_percent)) + "% used", 1),
              e("span", M, "Starts again " + t(w(s.reset_epoch_seconds)), 1)
            ])
          ]),
          _: 1
        }, 8, ["rows"])
      ], 64)) : p("", !0),
      n[2] || (n[2] = e("h3", { class: "heading" }, "Counts", -1)),
      f(l(v), {
        rows: l(c).rows.value,
        failure: l(c).failure.value,
        loaded: l(c).loaded.value,
        empty: "No counts yet"
      }, {
        default: h(({ row: s }) => [
          e("div", O, [
            e("span", $, t(s.key), 1),
            e("span", H, t(s.value), 1)
          ])
        ]),
        _: 1
      }, 8, ["rows", "failure", "loaded"])
    ], 64));
  }
}, A = /* @__PURE__ */ E(j, [["__scopeId", "data-v-fea58b80"]]);
export {
  A as default
};
