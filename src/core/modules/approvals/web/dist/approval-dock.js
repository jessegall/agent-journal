/* @code-commandments-generated */
if (!document.getElementById("window-styles-2effa0c7e648")) { const style = document.createElement("style"); style.id = "window-styles-2effa0c7e648"; style.textContent = ".approval-question[data-v-b72bd3c1]{margin:4px 14px 8px 36px;white-space:pre-wrap}.approval-details[data-v-b72bd3c1]{margin:4px 14px 8px 36px}.approval-details pre[data-v-b72bd3c1]{white-space:pre-wrap;overflow-wrap:anywhere}\n"; document.head.appendChild(style); }
import { openBlock as i, createElementBlock as m, Fragment as d, createElementVNode as n, toDisplayString as c, unref as r, createCommentVNode as v } from "vue";
import { useDockRow as f } from "@journal/window-kit";
const g = (s, t) => {
  const a = s.__vccOpts || s;
  for (const [e, o] of t)
    a[e] = o;
  return a;
}, k = {
  class: "approval-question",
  "data-approval-question": ""
}, x = { class: "approval-details" }, y = { key: 0 }, D = {
  __name: "ApprovalDock",
  setup(s) {
    const t = f("approval");
    return (a, e) => {
      var o, p, l, u, _;
      return i(), m(d, null, [
        n("p", k, c((o = r(t)) == null ? void 0 : o.text), 1),
        n("details", x, [
          e[0] || (e[0] = n("summary", null, "Action details", -1)),
          n("pre", null, c((l = (p = r(t)) == null ? void 0 : p.arguments) == null ? void 0 : l.join(" ")), 1),
          (_ = (u = r(t)) == null ? void 0 : u.continued_arguments) != null && _.length ? (i(), m("pre", y, c(r(t).continued_arguments.join(" ")), 1)) : v("", !0)
        ])
      ], 64);
    };
  }
}, A = /* @__PURE__ */ g(D, [["__scopeId", "data-v-b72bd3c1"]]);
export {
  A as default
};
