/* @code-commandments-generated */
if (!document.getElementById("window-styles-ad9ba76a65d2")) { const style = document.createElement("style"); style.id = "window-styles-ad9ba76a65d2"; style.textContent = ".requests[data-v-0c163f7f]{display:flex;flex-wrap:wrap;gap:16px}.list[data-v-0c163f7f]{display:flex;flex:1 1 280px;flex-direction:column;gap:2px}.row[data-v-0c163f7f]{display:flex;flex-wrap:wrap;gap:8px;padding:6px 8px;border:0;border-radius:6px;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.row.open[data-v-0c163f7f]{background:var(--surface-2, var(--border))}.event[data-v-0c163f7f]{font-weight:600}.note[data-v-0c163f7f]{margin:0;color:var(--text-3);font-size:12px}.detail[data-v-0c163f7f]{flex:2 1 420px;min-width:0}.heading[data-v-0c163f7f]{margin:0 0 4px;font-size:12px}pre[data-v-0c163f7f]{margin:0 0 12px;padding:8px;overflow:auto;border:1px solid var(--border);border-radius:6px;font-size:12px}.numbers-tools[data-v-74ee5428]{display:flex;gap:8px;margin-bottom:10px}.numbers-note[data-v-74ee5428]{margin:0;color:var(--text-3);font-size:12.5px}.numbers-table[data-v-74ee5428]{width:100%;border-collapse:collapse;font-size:12.5px}.numbers-table th[data-v-74ee5428],.numbers-table td[data-v-74ee5428]{padding:4px 8px;border-bottom:1px solid var(--border);text-align:left}.numbers-table th[data-v-74ee5428]{color:var(--text-3);font-weight:500}\n"; document.head.appendChild(style); }
import { ref as y, computed as w, openBlock as n, createBlock as g, unref as l, withCtx as m, createElementVNode as e, createVNode as _, createTextVNode as b, toDisplayString as t, createElementBlock as r, Fragment as x, renderList as B } from "vue";
import { useWindow as N, useReadLine as C, usePoll as H, WindowRoom as S, Btn as p } from "@journal/window-kit";
import { _ as R } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const V = {
  class: "numbers",
  "data-hook-numbers": ""
}, E = { class: "numbers-tools" }, F = {
  key: 0,
  class: "numbers-note",
  role: "alert"
}, L = {
  key: 1,
  class: "numbers-note"
}, P = {
  key: 2,
  class: "numbers-table"
}, W = {
  __name: "HookNumbers",
  setup(A) {
    const v = N(), u = y(!1), { value: f, failure: d, load: c } = C(() => `developer numbers${u.value ? " --slowest" : ""}`), i = w(() => {
      var o;
      return ((o = f.value) == null ? void 0 : o.rows) ?? [];
    });
    function h() {
      u.value = !u.value, c();
    }
    async function k() {
      const o = await v.run(["developer", "reset-numbers"]);
      d.value = o.ok ? "" : o.error, c();
    }
    return H(c, () => !0), (o, a) => (n(), g(l(S), null, {
      default: m(() => [
        e("div", V, [
          e("div", E, [
            _(l(p), {
              small: "",
              bordered: "",
              "data-numbers-sort": "",
              onClick: h
            }, {
              default: m(() => [
                b(t(u.value ? "By name" : "Slowest first"), 1)
              ]),
              _: 1
            }),
            _(l(p), {
              small: "",
              bordered: "",
              "data-numbers-reset": "",
              onClick: k
            }, {
              default: m(() => [...a[0] || (a[0] = [
                b("Reset the counts", -1)
              ])]),
              _: 1
            })
          ]),
          l(d) ? (n(), r("p", F, t(l(d)), 1)) : i.value.length ? (n(), r("table", P, [
            a[1] || (a[1] = e("thead", null, [
              e("tr", null, [
                e("th", null, "Hook, reader or route"),
                e("th", null, "Count"),
                e("th", null, "Average"),
                e("th", null, "Slowest"),
                e("th", null, "Points")
              ])
            ], -1)),
            e("tbody", null, [
              (n(!0), r(x, null, B(i.value, (s) => (n(), r("tr", {
                key: s.id,
                "data-number-row": ""
              }, [
                e("td", null, t(s.hook), 1),
                e("td", null, t(s.count), 1),
                e("td", null, t(s.average_ms) + " ms", 1),
                e("td", null, t(s.slowest_ms) + " ms", 1),
                e("td", null, t(s.average_points), 1)
              ]))), 128))
            ])
          ])) : (n(), r("p", L, "Nothing counted yet. Hook durations in the developer settings turns the counts on."))
        ])
      ]),
      _: 1
    }));
  }
}, $ = /* @__PURE__ */ R(W, [["__scopeId", "data-v-74ee5428"]]);
export {
  $ as default
};
