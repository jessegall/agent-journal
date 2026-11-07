/* @code-commandments-generated */
if (!document.getElementById("window-styles-a94119309606")) { const style = document.createElement("style"); style.id = "window-styles-a94119309606"; style.textContent = ".approval-question[data-v-25efc170]{margin:4px 14px 8px 36px;white-space:pre-wrap}.approval-details[data-v-25efc170]{margin:4px 14px 8px 36px}.approval-details pre[data-v-25efc170]{white-space:pre-wrap;overflow-wrap:anywhere}\n"; document.head.appendChild(style); }
import { computed as v, openBlock as _, createElementBlock as m, Fragment as f, createElementVNode as r, toDisplayString as l, createCommentVNode as g } from "vue";
import { useDockCard as k, useWindow as x } from "@journal/window-kit";
const y = (s, c) => {
  const a = s.__vccOpts || s;
  for (const [t, e] of c)
    a[t] = e;
  return a;
}, D = {
  class: "approval-question",
  "data-approval-question": ""
}, h = { class: "approval-details" }, q = { key: 0 }, w = {
  __name: "ApprovalDock",
  setup(s) {
    const c = k(), a = x().option("row"), t = v(() => {
      var e, o;
      return (o = (e = c.data.value) == null ? void 0 : e.rows) == null ? void 0 : o.find((n) => n.id === a.value.target_id);
    });
    return (e, o) => {
      var n, u, p, i, d;
      return _(), m(f, null, [
        r("p", D, l((n = t.value) == null ? void 0 : n.text), 1),
        r("details", h, [
          o[0] || (o[0] = r("summary", null, "Action details", -1)),
          r("pre", null, l((p = (u = t.value) == null ? void 0 : u.arguments) == null ? void 0 : p.join(" ")), 1),
          (d = (i = t.value) == null ? void 0 : i.continued_arguments) != null && d.length ? (_(), m("pre", q, l(t.value.continued_arguments.join(" ")), 1)) : g("", !0)
        ])
      ], 64);
    };
  }
}, B = /* @__PURE__ */ y(w, [["__scopeId", "data-v-25efc170"]]);
export {
  B as default
};
