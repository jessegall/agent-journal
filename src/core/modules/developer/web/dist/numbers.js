/* @code-commandments-generated */
if (!document.getElementById("window-styles-c536c98f6c0a")) { const style = document.createElement("style"); style.id = "window-styles-c536c98f6c0a"; style.textContent = ".requests[data-v-0c163f7f]{display:flex;flex-wrap:wrap;gap:16px}.list[data-v-0c163f7f]{display:flex;flex:1 1 280px;flex-direction:column;gap:2px}.row[data-v-0c163f7f]{display:flex;flex-wrap:wrap;gap:8px;padding:6px 8px;border:0;border-radius:6px;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.row.open[data-v-0c163f7f]{background:var(--surface-2, var(--border))}.event[data-v-0c163f7f]{font-weight:600}.note[data-v-0c163f7f]{margin:0;color:var(--text-3);font-size:12px}.detail[data-v-0c163f7f]{flex:2 1 420px;min-width:0}.heading[data-v-0c163f7f]{margin:0 0 4px;font-size:12px}pre[data-v-0c163f7f]{margin:0 0 12px;padding:8px;overflow:auto;border:1px solid var(--border);border-radius:6px;font-size:12px}.numbers-tools[data-v-21644aad]{display:flex;gap:8px;margin-bottom:10px}.numbers-note[data-v-21644aad]{margin:0;color:var(--text-3);font-size:12.5px}.numbers-table[data-v-21644aad]{width:100%;border-collapse:collapse;font-size:12.5px}.numbers-table th[data-v-21644aad],.numbers-table td[data-v-21644aad]{padding:4px 8px;border-bottom:1px solid var(--border);text-align:left}.numbers-table th[data-v-21644aad]{color:var(--text-3);font-weight:500}\n"; document.head.appendChild(style); }
import { ref as y, computed as g, openBlock as o, createBlock as C, unref as l, withCtx as i, createElementVNode as e, createVNode as _, createTextVNode as p, toDisplayString as s, createElementBlock as r, Fragment as x, renderList as B } from "vue";
import { useWindow as N, useReadLine as w, usePoll as H, WindowRoom as R, Btn as b } from "@journal/window-kit";
import { _ as V } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const E = {
  class: "numbers",
  "data-hook-numbers": ""
}, F = { class: "numbers-tools" }, L = {
  key: 0,
  class: "numbers-note",
  role: "alert"
}, W = {
  key: 1,
  class: "numbers-note"
}, A = {
  key: 2,
  class: "numbers-table"
}, D = {
  __name: "HookNumbers",
  setup(I) {
    const v = N(), u = y(!1), { value: f, failure: d, load: c } = w(() => `developer numbers${u.value ? " --costliest" : ""}`), m = g(() => {
      var t;
      return ((t = f.value) == null ? void 0 : t.rows) ?? [];
    });
    function h() {
      u.value = !u.value, c();
    }
    async function k() {
      const t = await v.run(["developer", "reset-numbers"]);
      d.value = t.ok ? "" : t.error, c();
    }
    return H(c, () => !0), (t, a) => (o(), C(l(R), null, {
      default: i(() => [
        e("div", E, [
          e("div", F, [
            _(l(b), {
              small: "",
              bordered: "",
              "data-numbers-sort": "",
              onClick: h
            }, {
              default: i(() => [
                p(s(u.value ? "By name" : "Costliest first"), 1)
              ]),
              _: 1
            }),
            _(l(b), {
              small: "",
              bordered: "",
              "data-numbers-reset": "",
              onClick: k
            }, {
              default: i(() => [...a[0] || (a[0] = [
                p("Reset the counts", -1)
              ])]),
              _: 1
            })
          ]),
          l(d) ? (o(), r("p", L, s(l(d)), 1)) : m.value.length ? (o(), r("table", A, [
            a[1] || (a[1] = e("thead", null, [
              e("tr", null, [
                e("th", null, "Hook, reader or route"),
                e("th", null, "Count"),
                e("th", null, "Average points"),
                e("th", null, "Most points")
              ])
            ], -1)),
            e("tbody", null, [
              (o(!0), r(x, null, B(m.value, (n) => (o(), r("tr", {
                key: n.id,
                "data-number-row": ""
              }, [
                e("td", null, s(n.hook), 1),
                e("td", null, s(n.count), 1),
                e("td", null, s(n.average_points), 1),
                e("td", null, s(n.most_points), 1)
              ]))), 128))
            ])
          ])) : (o(), r("p", W, "Nothing counted yet. Call costs in the developer settings turns the counts on."))
        ])
      ]),
      _: 1
    }));
  }
}, T = /* @__PURE__ */ V(D, [["__scopeId", "data-v-21644aad"]]);
export {
  T as default
};
