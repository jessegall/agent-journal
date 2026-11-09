/* @code-commandments-generated */
if (!document.getElementById("window-styles-3777ec683a7b")) { const style = document.createElement("style"); style.id = "window-styles-3777ec683a7b"; style.textContent = ".approval-question[data-v-8f8987f9]{margin:4px 14px 2px 36px;color:var(--text);font-size:13.5px;font-weight:600}.approval-description[data-v-8f8987f9]{margin:0 14px 8px 36px;color:var(--text-3);font-size:12px;font-weight:400;white-space:pre-wrap}.approval-why[data-v-8f8987f9]{margin:0 14px 8px 36px;color:var(--text-2);font-size:12.5px;font-weight:400;white-space:pre-wrap;overflow-wrap:anywhere}.approval-details[data-v-8f8987f9]{margin:4px 14px 8px 36px}.approval-details pre[data-v-8f8987f9]{margin:6px 0 0;white-space:pre-wrap;overflow-wrap:anywhere}.heading[data-v-3381b4b3]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.row[data-v-3381b4b3]{display:grid;grid-template-columns:1fr auto;gap:2px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.row small[data-v-3381b4b3]{grid-column:1;color:var(--text-3);font-size:10.5px}.row button[data-v-3381b4b3]{grid-column:2;grid-row:1 / span 2}.none[data-v-3381b4b3]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as f, ref as k, openBlock as t, createBlock as y, unref as o, withCtx as u, createElementVNode as d, createElementBlock as n, toDisplayString as r, createCommentVNode as m, Fragment as x, renderList as w, createVNode as h, createTextVNode as C } from "vue";
import { useWindow as N, WindowRoom as S, Btn as A } from "@journal/window-kit";
import { _ as B } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const V = {
  key: 0,
  class: "none"
}, b = {
  key: 1,
  class: "none",
  "data-standing-empty": ""
}, q = {
  key: 2,
  class: "none",
  "data-standing-failure": ""
}, E = {
  __name: "StandingApprovalsPanel",
  setup(F) {
    const l = N(), { rows: v, failure: p } = l.props.standing, c = f(() => v.value ?? []), i = k("");
    async function g(a) {
      const e = await l.run(["standing-approval", "delete", String(a.id)]);
      i.value = e.ok ? "" : e.error, e.ok && await l.reload("standing");
    }
    const _ = (a) => a.scope === "same" ? "the same request" : "any request like it";
    return (a, e) => (t(), y(o(S), { padding: "14px 16px" }, {
      default: u(() => [
        e[1] || (e[1] = d("p", { class: "heading" }, "Standing yeses", -1)),
        o(p) ? (t(), n("p", V, r(o(p)), 1)) : c.value.length ? m("", !0) : (t(), n("p", b, "No standing yes is kept. Choose Accept and always on an approval to keep one.")),
        (t(!0), n(x, null, w(c.value, (s) => (t(), n("div", {
          key: s.id,
          class: "row",
          "data-standing-yes": ""
        }, [
          d("span", null, r(s.text), 1),
          d("small", null, "Accepts " + r(_(s)), 1),
          h(o(A), {
            small: "",
            onClick: (P) => g(s)
          }, {
            default: u(() => [...e[0] || (e[0] = [
              C("Remove", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ]))), 128)),
        i.value ? (t(), n("p", q, r(i.value), 1)) : m("", !0)
      ]),
      _: 1
    }));
  }
}, I = /* @__PURE__ */ B(E, [["__scopeId", "data-v-3381b4b3"]]);
export {
  I as default
};
