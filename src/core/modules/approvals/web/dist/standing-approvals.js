if (!document.getElementById("window-styles-04005f2825aa")) { const style = document.createElement("style"); style.id = "window-styles-04005f2825aa"; style.textContent = ".approval-question[data-v-8f8987f9]{margin:4px 14px 2px 36px;color:var(--text);font-size:13.5px;font-weight:600}.approval-description[data-v-8f8987f9]{margin:0 14px 8px 36px;color:var(--text-3);font-size:12px;font-weight:400;white-space:pre-wrap}.approval-why[data-v-8f8987f9]{margin:0 14px 8px 36px;color:var(--text-2);font-size:12.5px;font-weight:400;white-space:pre-wrap;overflow-wrap:anywhere}.approval-details[data-v-8f8987f9]{margin:4px 14px 8px 36px}.approval-details pre[data-v-8f8987f9]{margin:6px 0 0;white-space:pre-wrap;overflow-wrap:anywhere}.heading[data-v-23a7b530]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.row[data-v-23a7b530]{display:grid;grid-template-columns:1fr auto;gap:2px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.row small[data-v-23a7b530]{grid-column:1;color:var(--text-3);font-size:10.5px}.row button[data-v-23a7b530]{grid-column:2;grid-row:1 / span 2}.none[data-v-23a7b530]{margin:0;color:var(--text-3);font-size:12px}.standing-question[data-v-578b7df0]{margin:4px 14px 2px 36px;color:var(--text);font-size:13.5px;font-weight:600}.standing-reason[data-v-578b7df0]{margin:0 14px 8px 36px;color:var(--text-3);font-size:12px;font-weight:400}\n"; document.head.appendChild(style); }
import { computed as k, openBlock as e, createBlock as y, unref as t, withCtx as u, createElementVNode as l, createElementBlock as n, toDisplayString as r, createCommentVNode as m, Fragment as x, renderList as h, createVNode as C, createTextVNode as N } from "vue";
import { useWindow as S, useRunLine as w, WindowRoom as A, Btn as B } from "@journal/window-kit";
import { _ as V } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
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
    const i = S(), { rows: g, failure: d } = i.props.standing, p = k(() => g.value ?? []), { refusal: c, run: _ } = w(() => i.reload("standing")), v = (a) => _(["standing-approval", "delete", String(a.id)]), f = (a) => a.scope === "same" ? "the same request" : "any request like it";
    return (a, s) => (e(), y(t(A), { padding: "14px 16px" }, {
      default: u(() => [
        s[1] || (s[1] = l("p", { class: "heading" }, "Standing yeses", -1)),
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
            default: u(() => [...s[0] || (s[0] = [
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
}, I = /* @__PURE__ */ V(F, [["__scopeId", "data-v-23a7b530"]]);
export {
  I as default
};
