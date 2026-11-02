/* @code-commandments-generated */
if (!document.getElementById("window-styles-3f6a95d9a068")) { const style = document.createElement("style"); style.id = "window-styles-3f6a95d9a068"; style.textContent = ".numbers-tools[data-v-b039a2fd]{display:flex;gap:8px;margin-bottom:10px}.numbers-note[data-v-b039a2fd]{margin:0;color:var(--text-3);font-size:12.5px}.numbers-table[data-v-b039a2fd]{width:100%;border-collapse:collapse;font-size:12.5px}.numbers-table th[data-v-b039a2fd],.numbers-table td[data-v-b039a2fd]{padding:4px 8px;border-bottom:1px solid var(--border);text-align:left}.numbers-table th[data-v-b039a2fd]{color:var(--text-3);font-weight:500}\n"; document.head.appendChild(style); }
import { ref as g, computed as w, openBlock as l, createElementBlock as r, createElementVNode as e, createVNode as v, unref as d, withCtx as p, createTextVNode as f, toDisplayString as s, Fragment as x, renderList as N } from "vue";
import { useWindow as B, useReadLine as C, usePoll as H, Btn as h } from "@journal/window-kit";
const S = (c, i) => {
  const t = c.__vccOpts || c;
  for (const [m, u] of i)
    t[m] = u;
  return t;
}, V = {
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
}, R = {
  __name: "HookNumbers",
  setup(c) {
    const i = B(), t = g(!1), { value: m, failure: u, load: _ } = C(() => `developer numbers${t.value ? " --slowest" : ""}`), b = w(() => {
      var o;
      return ((o = m.value) == null ? void 0 : o.rows) ?? [];
    });
    function k() {
      t.value = !t.value, _();
    }
    async function y() {
      const o = await i.run(["developer", "reset-numbers"]);
      u.value = o.ok ? "" : o.error, _();
    }
    return H(_, () => !0), (o, a) => (l(), r("div", V, [
      e("div", E, [
        v(d(h), {
          small: "",
          bordered: "",
          "data-numbers-sort": "",
          onClick: k
        }, {
          default: p(() => [
            f(s(t.value ? "By name" : "Slowest first"), 1)
          ]),
          _: 1
        }),
        v(d(h), {
          small: "",
          bordered: "",
          "data-numbers-reset": "",
          onClick: y
        }, {
          default: p(() => [...a[0] || (a[0] = [
            f("Reset the counts", -1)
          ])]),
          _: 1
        })
      ]),
      d(u) ? (l(), r("p", F, s(d(u)), 1)) : b.value.length ? (l(), r("table", P, [
        a[1] || (a[1] = e("thead", null, [
          e("tr", null, [
            e("th", null, "Hook"),
            e("th", null, "Count"),
            e("th", null, "Average"),
            e("th", null, "Slowest"),
            e("th", null, "Points")
          ])
        ], -1)),
        e("tbody", null, [
          (l(!0), r(x, null, N(b.value, (n) => (l(), r("tr", {
            key: n.id,
            "data-number-row": ""
          }, [
            e("td", null, s(n.hook), 1),
            e("td", null, s(n.count), 1),
            e("td", null, s(n.average_ms) + " ms", 1),
            e("td", null, s(n.slowest_ms) + " ms", 1),
            e("td", null, s(n.average_points), 1)
          ]))), 128))
        ])
      ])) : (l(), r("p", L, "Nothing counted yet. Hook durations in the developer settings turns the counts on."))
    ]));
  }
}, I = /* @__PURE__ */ S(R, [["__scopeId", "data-v-b039a2fd"]]);
export {
  I as default
};
