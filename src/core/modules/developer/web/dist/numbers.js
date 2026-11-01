/* @code-commandments-generated */
if (!document.getElementById("window-styles-d8d51fcde1fa")) { const style = document.createElement("style"); style.id = "window-styles-d8d51fcde1fa"; style.textContent = ".numbers-tools[data-v-eddf43e8]{display:flex;gap:8px;margin-bottom:10px}.numbers-note[data-v-eddf43e8]{margin:0;color:var(--text-3);font-size:12.5px}.numbers-table[data-v-eddf43e8]{width:100%;border-collapse:collapse;font-size:12.5px}.numbers-table th[data-v-eddf43e8],.numbers-table td[data-v-eddf43e8]{padding:4px 8px;border-bottom:1px solid var(--border);text-align:left}.numbers-table th[data-v-eddf43e8]{color:var(--text-3);font-weight:500}\n"; document.head.appendChild(style); }
import { ref as _, openBlock as u, createElementBlock as a, createElementVNode as e, createVNode as v, unref as b, withCtx as f, createTextVNode as k, toDisplayString as s, Fragment as w, renderList as g } from "vue";
import { useWindow as x, usePoll as N, Btn as p } from "@journal/window-kit";
const B = (i, d) => {
  const o = i.__vccOpts || i;
  for (const [n, l] of d)
    o[n] = l;
  return o;
}, C = {
  class: "numbers",
  "data-hook-numbers": ""
}, H = { class: "numbers-tools" }, S = {
  key: 0,
  class: "numbers-note",
  role: "alert"
}, V = {
  key: 1,
  class: "numbers-note"
}, E = {
  key: 2,
  class: "numbers-table"
}, F = {
  __name: "HookNumbers",
  setup(i) {
    const d = x(), o = _([]), n = _(""), l = _(!1);
    async function m() {
      const t = await d.read(`developer numbers${l.value ? " --slowest" : ""}`);
      n.value = t.ok ? "" : t.error, t.ok && (o.value = t.value.rows);
    }
    function h() {
      l.value = !l.value, m();
    }
    async function y() {
      const t = await d.run(["developer", "reset-numbers"]);
      n.value = t.ok ? "" : t.error, m();
    }
    return N(m, () => !0), (t, c) => (u(), a("div", C, [
      e("div", H, [
        v(b(p), {
          small: "",
          bordered: "",
          "data-numbers-sort": "",
          onClick: h
        }, {
          default: f(() => [
            k(s(l.value ? "By name" : "Slowest first"), 1)
          ]),
          _: 1
        }),
        v(b(p), {
          small: "",
          bordered: "",
          "data-numbers-reset": "",
          onClick: y
        }, {
          default: f(() => [...c[0] || (c[0] = [
            k("Reset the counts", -1)
          ])]),
          _: 1
        })
      ]),
      n.value ? (u(), a("p", S, s(n.value), 1)) : o.value.length ? (u(), a("table", E, [
        c[1] || (c[1] = e("thead", null, [
          e("tr", null, [
            e("th", null, "Hook"),
            e("th", null, "Count"),
            e("th", null, "Average"),
            e("th", null, "Slowest"),
            e("th", null, "Points")
          ])
        ], -1)),
        e("tbody", null, [
          (u(!0), a(w, null, g(o.value, (r) => (u(), a("tr", {
            key: r.id,
            "data-number-row": ""
          }, [
            e("td", null, s(r.hook), 1),
            e("td", null, s(r.count), 1),
            e("td", null, s(r.average_ms) + " ms", 1),
            e("td", null, s(r.slowest_ms) + " ms", 1),
            e("td", null, s(r.average_points), 1)
          ]))), 128))
        ])
      ])) : (u(), a("p", V, "Nothing counted yet. Hook durations in the developer settings turns the counts on."))
    ]));
  }
}, D = /* @__PURE__ */ B(F, [["__scopeId", "data-v-eddf43e8"]]);
export {
  D as default
};
