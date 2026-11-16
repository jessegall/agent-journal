if (!document.getElementById("window-styles-e5a92405c1c8")) { const style = document.createElement("style"); style.id = "window-styles-e5a92405c1c8"; style.textContent = ".approval-question[data-v-372999c2]{margin:4px 14px 2px 36px;color:var(--text);font-size:13.5px;font-weight:600}.approval-description[data-v-372999c2]{margin:0 14px 8px 36px;color:var(--text-3);font-size:12px;font-weight:400;white-space:pre-wrap}.approval-why[data-v-372999c2]{margin:0 14px 8px 36px;color:var(--text-2);font-size:12.5px;font-weight:400;white-space:pre-wrap;overflow-wrap:anywhere}.approval-details[data-v-372999c2]{margin:4px 14px 8px 36px}.approval-details pre[data-v-372999c2]{margin:6px 0 0;white-space:pre-wrap;overflow-wrap:anywhere}.heading[data-v-64cddd92]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.row[data-v-64cddd92]{display:grid;grid-template-columns:1fr auto;gap:2px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.row small[data-v-64cddd92]{grid-column:1;color:var(--text-3);font-size:10.5px}.row button[data-v-64cddd92]{grid-column:2;grid-row:1 / span 2}.none[data-v-64cddd92]{margin:0;color:var(--text-3);font-size:12px}.saved-question[data-v-e9bda2d0]{margin:4px 14px 2px 36px;color:var(--text);font-size:13.5px;font-weight:600}.saved-reason[data-v-e9bda2d0]{margin:0 14px 8px 36px;color:var(--text-3);font-size:12px;font-weight:400}\n"; document.head.appendChild(style); }
import { computed as y, openBlock as e, createBlock as x, unref as t, withCtx as u, createElementVNode as l, createElementBlock as s, toDisplayString as r, createCommentVNode as v, Fragment as g, renderList as h, createVNode as C, createTextVNode as N } from "vue";
import { useWindow as S, useRunLine as w, WindowRoom as A, Btn as B } from "@journal/window-kit";
import { _ as V } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const R = {
  key: 0,
  class: "none"
}, q = {
  key: 1,
  class: "none",
  "data-saved-empty": ""
}, E = {
  key: 2,
  class: "none",
  "data-saved-failure": ""
}, F = {
  __name: "SavedApprovalsPanel",
  setup(L) {
    const d = S(), { rows: m, failure: p } = d.props.saved, c = y(() => m.value ?? []), { refusal: i, run: _ } = w(() => d.reload("saved")), f = (a) => _(["saved-approval", "delete", String(a.id)]), k = (a) => a.scope === "same" ? "the same request" : "any request like it";
    return (a, o) => (e(), x(t(A), { padding: "14px 16px" }, {
      default: u(() => [
        o[1] || (o[1] = l("p", { class: "heading" }, "Saved yeses", -1)),
        t(p) ? (e(), s("p", R, r(t(p)), 1)) : c.value.length ? v("", !0) : (e(), s("p", q, "No saved yes is kept. Choose Accept and always on an approval to keep one.")),
        (e(!0), s(g, null, h(c.value, (n) => (e(), s("div", {
          key: n.id,
          class: "row",
          "data-saved-yes": ""
        }, [
          l("span", null, r(n.text), 1),
          l("small", null, "Accepts " + r(k(n)), 1),
          C(t(B), {
            small: "",
            onClick: (P) => f(n)
          }, {
            default: u(() => [...o[0] || (o[0] = [
              N("Remove", -1)
            ])]),
            _: 1
          }, 8, ["onClick"])
        ]))), 128)),
        t(i) ? (e(), s("p", E, r(t(i)), 1)) : v("", !0)
      ]),
      _: 1
    }));
  }
}, T = /* @__PURE__ */ V(F, [["__scopeId", "data-v-64cddd92"]]);
export {
  T as default
};
