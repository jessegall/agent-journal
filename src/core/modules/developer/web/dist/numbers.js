/* @code-commandments-generated */
if (!document.getElementById("window-styles-146142452b8c")) { const style = document.createElement("style"); style.id = "window-styles-146142452b8c"; style.textContent = ".requests[data-v-e05d2e6b]{display:flex;flex-wrap:wrap;gap:16px}.list[data-v-e05d2e6b]{display:flex;flex:1 1 280px;flex-direction:column;gap:2px}.row[data-v-e05d2e6b]{display:flex;flex-wrap:wrap;gap:8px;padding:6px 8px;border:0;border-radius:6px;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}.row.open[data-v-e05d2e6b]{background:var(--surface-2, var(--border))}.event[data-v-e05d2e6b]{font-weight:600}.note[data-v-e05d2e6b]{margin:0;color:var(--text-3);font-size:12px}.detail[data-v-e05d2e6b]{flex:2 1 420px;min-width:0}.heading[data-v-e05d2e6b]{margin:0 0 4px;font-size:12px}pre[data-v-e05d2e6b]{margin:0 0 12px;padding:8px;overflow:auto;border:1px solid var(--border);border-radius:6px;font-size:12px}.numbers-tools[data-v-7fdb59d8]{display:flex;gap:8px;margin-bottom:10px}.numbers-note[data-v-7fdb59d8]{margin:0;color:var(--text-3);font-size:12.5px}.numbers-table[data-v-7fdb59d8]{width:100%;border-collapse:collapse;font-size:12.5px}.numbers-table th[data-v-7fdb59d8],.numbers-table td[data-v-7fdb59d8]{padding:4px 8px;border-bottom:1px solid var(--border);text-align:left}.numbers-table th[data-v-7fdb59d8]{color:var(--text-3);font-weight:500}\n"; document.head.appendChild(style); }
import { ref as y, computed as g, openBlock as n, createElementBlock as l, createElementVNode as e, createVNode as i, unref as a, withCtx as _, createTextVNode as b, toDisplayString as t, Fragment as w, renderList as x } from "vue";
import { useWindow as N, useReadLine as B, usePoll as C, Btn as p } from "@journal/window-kit";
import { _ as H } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const S = {
  class: "numbers",
  "data-hook-numbers": ""
}, V = { class: "numbers-tools" }, E = {
  key: 0,
  class: "numbers-note",
  role: "alert"
}, F = {
  key: 1,
  class: "numbers-note"
}, L = {
  key: 2,
  class: "numbers-table"
}, P = {
  __name: "HookNumbers",
  setup(R) {
    const v = N(), r = y(!1), { value: f, failure: d, load: m } = B(() => `developer numbers${r.value ? " --slowest" : ""}`), c = g(() => {
      var s;
      return ((s = f.value) == null ? void 0 : s.rows) ?? [];
    });
    function h() {
      r.value = !r.value, m();
    }
    async function k() {
      const s = await v.run(["developer", "reset-numbers"]);
      d.value = s.ok ? "" : s.error, m();
    }
    return C(m, () => !0), (s, u) => (n(), l("div", S, [
      e("div", V, [
        i(a(p), {
          small: "",
          bordered: "",
          "data-numbers-sort": "",
          onClick: h
        }, {
          default: _(() => [
            b(t(r.value ? "By name" : "Slowest first"), 1)
          ]),
          _: 1
        }),
        i(a(p), {
          small: "",
          bordered: "",
          "data-numbers-reset": "",
          onClick: k
        }, {
          default: _(() => [...u[0] || (u[0] = [
            b("Reset the counts", -1)
          ])]),
          _: 1
        })
      ]),
      a(d) ? (n(), l("p", E, t(a(d)), 1)) : c.value.length ? (n(), l("table", L, [
        u[1] || (u[1] = e("thead", null, [
          e("tr", null, [
            e("th", null, "Hook, reader or route"),
            e("th", null, "Count"),
            e("th", null, "Average"),
            e("th", null, "Slowest"),
            e("th", null, "Points")
          ])
        ], -1)),
        e("tbody", null, [
          (n(!0), l(w, null, x(c.value, (o) => (n(), l("tr", {
            key: o.id,
            "data-number-row": ""
          }, [
            e("td", null, t(o.hook), 1),
            e("td", null, t(o.count), 1),
            e("td", null, t(o.average_ms) + " ms", 1),
            e("td", null, t(o.slowest_ms) + " ms", 1),
            e("td", null, t(o.average_points), 1)
          ]))), 128))
        ])
      ])) : (n(), l("p", F, "Nothing counted yet. Hook durations in the developer settings turns the counts on."))
    ]));
  }
}, T = /* @__PURE__ */ H(P, [["__scopeId", "data-v-7fdb59d8"]]);
export {
  T as default
};
