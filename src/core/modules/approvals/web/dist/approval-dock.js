/* @code-commandments-generated */
if (!document.getElementById("window-styles-a7c15014d327")) { const style = document.createElement("style"); style.id = "window-styles-a7c15014d327"; style.textContent = ".approval-question[data-v-243042a1]{margin:4px 14px 2px 36px;color:var(--text);font-size:13.5px;font-weight:600}.approval-description[data-v-243042a1]{margin:0 14px 8px 36px;color:var(--text-3);font-size:12px;font-weight:400;white-space:pre-wrap}.approval-details[data-v-243042a1]{margin:4px 14px 8px 36px}.approval-details pre[data-v-243042a1]{white-space:pre-wrap;overflow-wrap:anywhere}\n"; document.head.appendChild(style); }
import { computed as r, openBlock as u, createElementBlock as d, Fragment as y, createElementVNode as l, toDisplayString as c, createCommentVNode as k } from "vue";
import { useDockCard as h, useWindow as x } from "@journal/window-kit";
const D = (i, p) => {
  const a = i.__vccOpts || i;
  for (const [t, n] of p)
    a[t] = n;
  return a;
}, j = {
  class: "approval-question",
  "data-approval-question": ""
}, q = {
  key: 0,
  class: "approval-description",
  "data-approval-description": ""
}, w = { class: "approval-details" }, A = { key: 0 }, B = {
  __name: "ApprovalDock",
  setup(i) {
    const p = h(), a = x().option("row"), t = r(() => {
      var e, o;
      return (o = (e = p.data.value) == null ? void 0 : e.rows) == null ? void 0 : o.find((s) => s.id === a.value.target_id);
    }), n = r(() => {
      var e;
      return String(((e = t.value) == null ? void 0 : e.text) ?? "").split(`
`);
    }), f = r(() => n.value[0]), _ = r(() => n.value.slice(1).join(`
`).trim());
    return (e, o) => {
      var s, v, m, g;
      return u(), d(y, null, [
        l("p", j, c(f.value), 1),
        _.value ? (u(), d("p", q, c(_.value), 1)) : k("", !0),
        l("details", w, [
          o[0] || (o[0] = l("summary", null, "Action details", -1)),
          l("pre", null, c((v = (s = t.value) == null ? void 0 : s.arguments) == null ? void 0 : v.join(" ")), 1),
          (g = (m = t.value) == null ? void 0 : m.continued_arguments) != null && g.length ? (u(), d("pre", A, c(t.value.continued_arguments.join(" ")), 1)) : k("", !0)
        ])
      ], 64);
    };
  }
}, N = /* @__PURE__ */ D(B, [["__scopeId", "data-v-243042a1"]]);
export {
  N as default
};
