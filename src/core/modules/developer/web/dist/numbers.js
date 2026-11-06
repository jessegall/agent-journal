/* @code-commandments-generated */
if (!document.getElementById("window-styles-1fac19b65a4a")) { const style = document.createElement("style"); style.id = "window-styles-1fac19b65a4a"; style.textContent = ".requests[data-v-3eaf29a6]{display:grid;grid-template-columns:minmax(360px,46%) 1px minmax(0,1fr);height:100%;min-height:0;overflow:hidden}.list[data-v-3eaf29a6]{display:flex;flex-direction:column;min-height:0;min-width:0}.list-scroll[data-v-3eaf29a6]{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain}.columns[data-v-3eaf29a6],.row[data-v-3eaf29a6]{display:grid;grid-template-columns:minmax(80px,1.4fr) minmax(40px,.7fr) 32px 88px minmax(72px,1fr) 55px 60px;align-items:center;gap:5px;padding:10px;font-size:12px}.columns[data-v-3eaf29a6]{flex:none;border-bottom:1px solid var(--border);color:var(--text-3)}.columns[data-v-3eaf29a6]>:last-child,.duration[data-v-3eaf29a6],.queued[data-v-3eaf29a6],.parts[data-v-3eaf29a6]{text-align:right}.parts[data-v-3eaf29a6]{padding-right:4px;color:var(--text-3);font-variant-numeric:tabular-nums}.day[data-v-3eaf29a6]{display:flex;justify-content:space-between;padding:9px 16px;border-bottom:1px solid var(--border);background:var(--side);color:var(--text-3);font-size:11px}.row[data-v-3eaf29a6]{width:100%;border:0;border-bottom:1px solid var(--border);background:none;color:inherit;font-family:inherit;text-align:left;cursor:pointer}.row[data-v-3eaf29a6]:hover,.row.open[data-v-3eaf29a6]{background:var(--surface-2, var(--border))}.event[data-v-3eaf29a6]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500}.tool[data-v-3eaf29a6]{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:var(--text-3)}time[data-v-3eaf29a6],.duration[data-v-3eaf29a6],.queued[data-v-3eaf29a6]{font-variant-numeric:tabular-nums;white-space:nowrap}.slow .duration[data-v-3eaf29a6],.detail-head .slow[data-v-3eaf29a6]{color:#c58b35}.refused .event[data-v-3eaf29a6],.refused .duration[data-v-3eaf29a6],.detail-head .refused[data-v-3eaf29a6]{color:#d76b6b}.note[data-v-3eaf29a6]{margin:0;color:var(--text-3);font-size:12px}.detail[data-v-3eaf29a6]{padding:20px;min-width:0;min-height:0;overflow:auto;overscroll-behavior:contain}.divider[data-v-3eaf29a6]{background:var(--border)}.message[data-v-3eaf29a6]{padding:16px;line-height:1.6}.detail-head[data-v-3eaf29a6]{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:24px;font-size:12px;color:var(--text-3)}.detail-head h2[data-v-3eaf29a6]{margin:0;color:var(--text);font-size:14px}.heading[data-v-3eaf29a6]{margin:0 0 8px;font-size:12px}pre[data-v-3eaf29a6]{margin:0 0 24px;padding:12px;overflow:auto;border:1px solid var(--border);border-radius:6px;font-size:12px;line-height:1.6}@media(max-width:760px){.requests[data-v-3eaf29a6]{grid-template-columns:minmax(0,1fr);grid-template-rows:minmax(140px,45%) 1px minmax(0,1fr)}}.numbers-tools[data-v-a530fc48]{display:flex;gap:8px;margin-bottom:10px}.numbers-note[data-v-a530fc48]{margin:0;color:var(--text-3);font-size:12.5px}.numbers-table[data-v-a530fc48]{width:100%;border-collapse:collapse;font-size:12.5px}.numbers-table th[data-v-a530fc48],.numbers-table td[data-v-a530fc48]{padding:4px 8px;border-bottom:1px solid var(--border);text-align:left}.numbers-table th[data-v-a530fc48]{color:var(--text-3);font-weight:500}\n"; document.head.appendChild(style); }
import { ref as y, computed as g, openBlock as o, createBlock as C, unref as l, withCtx as i, createElementVNode as e, createVNode as _, createTextVNode as p, toDisplayString as s, createElementBlock as r, Fragment as x, renderList as B } from "vue";
import { useWindow as N, useReadLine as w, usePoll as H, WindowRoom as R, Btn as b } from "@journal/window-kit";
import { _ as V } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
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
    const f = N(), u = y(!1), { value: v, failure: d, load: c } = w(() => `developer numbers${u.value ? " --costliest" : ""}`), m = g(() => {
      var t;
      return ((t = v.value) == null ? void 0 : t.rows) ?? [];
    });
    function h() {
      u.value = !u.value, c();
    }
    async function k() {
      const t = await f.run(["developer", "reset-numbers"]);
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
}, T = /* @__PURE__ */ V(D, [["__scopeId", "data-v-a530fc48"]]);
export {
  T as default
};
