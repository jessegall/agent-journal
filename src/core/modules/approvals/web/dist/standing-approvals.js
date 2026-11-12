if (!document.getElementById("window-styles-bd6135e97c88")) { const style = document.createElement("style"); style.id = "window-styles-bd6135e97c88"; style.textContent = ".approval-question[data-v-372999c2]{margin:4px 14px 2px 36px;color:var(--text);font-size:13.5px;font-weight:600}.approval-description[data-v-372999c2]{margin:0 14px 8px 36px;color:var(--text-3);font-size:12px;font-weight:400;white-space:pre-wrap}.approval-why[data-v-372999c2]{margin:0 14px 8px 36px;color:var(--text-2);font-size:12.5px;font-weight:400;white-space:pre-wrap;overflow-wrap:anywhere}.approval-details[data-v-372999c2]{margin:4px 14px 8px 36px}.approval-details pre[data-v-372999c2]{margin:6px 0 0;white-space:pre-wrap;overflow-wrap:anywhere}.heading[data-v-48be62ee]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.row[data-v-48be62ee]{display:grid;grid-template-columns:1fr auto;gap:2px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.row small[data-v-48be62ee]{grid-column:1;color:var(--text-3);font-size:10.5px}.row button[data-v-48be62ee]{grid-column:2;grid-row:1 / span 2}.none[data-v-48be62ee]{margin:0;color:var(--text-3);font-size:12px}.standing-question[data-v-72969cec]{margin:4px 14px 2px 36px;color:var(--text);font-size:13.5px;font-weight:600}.standing-reason[data-v-72969cec]{margin:0 14px 8px 36px;color:var(--text-3);font-size:12px;font-weight:400}\n"; document.head.appendChild(style); }
import { computed as k, openBlock as e, createBlock as y, unref as t, withCtx as u, createElementVNode as l, createElementBlock as n, toDisplayString as r, createCommentVNode as m, Fragment as x, renderList as h, createVNode as C, createTextVNode as N } from "vue";
import { useWindow as S, useRunLine as w, WindowRoom as A, Btn as B } from "@journal/window-kit";
import { _ as V } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const R = {
  key: 0,
  class: "none"
}, q = {
  key: 1,
  class: "none",
  "data-standing-empty": ""
}, E = {
  key: 2,
  class: "none",
  "data-standing-failure": ""
}, F = {
  __name: "StandingApprovalsPanel",
  setup(L) {
    const i = S(), { rows: g, failure: d } = i.props.standing, p = k(() => g.value ?? []), { refusal: c, run: _ } = w(() => i.reload("standing")), v = (s) => _(["standing-approval", "delete", String(s.id)]), f = (s) => s.scope === "same" ? "the same request" : "any request like it";
    return (s, a) => (e(), y(t(A), { padding: "14px 16px" }, {
      default: u(() => [
        a[1] || (a[1] = l("p", { class: "heading" }, "Standing yeses", -1)),
        t(d) ? (e(), n("p", R, r(t(d)), 1)) : p.value.length ? m("", !0) : (e(), n("p", q, "No standing yes is kept. Choose Accept and always on an approval to keep one.")),
        (e(!0), n(x, null, h(p.value, (o) => (e(), n("div", {
          key: o.id,
          class: "row",
          "data-standing-yes": ""
        }, [
          l("span", null, r(o.text), 1),
          l("small", null, "Accepts " + r(f(o)), 1),
          C(t(B), {
            small: "",
            onClick: (P) => v(o)
          }, {
            default: u(() => [...a[0] || (a[0] = [
              N("Remove", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ]))), 128)),
        t(c) ? (e(), n("p", E, r(t(c)), 1)) : m("", !0)
      ]),
      _: 1
    }));
  }
}, I = /* @__PURE__ */ V(F, [["__scopeId", "data-v-48be62ee"]]);
export {
  I as default
};
