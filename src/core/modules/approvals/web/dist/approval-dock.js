if (!document.getElementById("window-styles-3363a4d076d9")) { const style = document.createElement("style"); style.id = "window-styles-3363a4d076d9"; style.textContent = ".approval-question[data-v-372999c2]{margin:4px 14px 2px 36px;color:var(--text);font-size:13.5px;font-weight:600}.approval-description[data-v-372999c2]{margin:0 14px 8px 36px;color:var(--text-3);font-size:12px;font-weight:400;white-space:pre-wrap}.approval-why[data-v-372999c2]{margin:0 14px 8px 36px;color:var(--text-2);font-size:12.5px;font-weight:400;white-space:pre-wrap;overflow-wrap:anywhere}.approval-details[data-v-372999c2]{margin:4px 14px 8px 36px}.approval-details pre[data-v-372999c2]{margin:6px 0 0;white-space:pre-wrap;overflow-wrap:anywhere}.heading[data-v-30549def]{margin:0;padding:2px 0 6px;color:var(--text);font-size:12px}.row[data-v-30549def]{display:grid;grid-template-columns:1fr auto;gap:2px 8px;padding:6px 0;color:var(--text-2);font-size:11.5px}.row small[data-v-30549def]{grid-column:1;color:var(--text-3);font-size:10.5px}.row button[data-v-30549def]{grid-column:2;grid-row:1 / span 2}.none[data-v-30549def]{margin:0;color:var(--text-3);font-size:12px}.standing-question[data-v-44b76173]{margin:4px 14px 2px 36px;color:var(--text);font-size:13.5px;font-weight:600}.standing-reason[data-v-44b76173]{margin:0 14px 8px 36px;color:var(--text-3);font-size:12px;font-weight:400}\n"; document.head.appendChild(style); }
import { computed as n, openBlock as r, createElementBlock as l, Fragment as k, createElementVNode as p, toDisplayString as o, createCommentVNode as i } from "vue";
import { useDockCard as f, useWindow as w } from "@journal/window-kit";
import { _ as x } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const D = {
  class: "approval-question",
  "data-approval-question": ""
}, j = {
  key: 0,
  class: "approval-description",
  "data-approval-description": ""
}, q = {
  key: 1,
  class: "approval-why",
  "data-approval-why": ""
}, A = { class: "approval-details" }, B = { "data-approval-action": "" }, C = {
  key: 0,
  "data-approval-action": ""
}, E = {
  __name: "ApprovalDock",
  setup(N) {
    const h = f(), y = w().option("row"), t = n(() => {
      var e, a;
      return (a = (e = h.data.value) == null ? void 0 : e.rows) == null ? void 0 : a.find((s) => s.id === y.value.target_id);
    }), c = n(() => {
      var e;
      return String(((e = t.value) == null ? void 0 : e.text) ?? "").split(`
`);
    }), g = n(() => c.value[0]), u = n(() => c.value.slice(1).join(`
`).trim());
    return (e, a) => {
      var s, d, _, v, m;
      return r(), l(k, null, [
        p("p", D, o(g.value), 1),
        u.value ? (r(), l("p", j, o(u.value), 1)) : i("", !0),
        (s = t.value) != null && s.why ? (r(), l("p", q, o(t.value.why), 1)) : i("", !0),
        p("details", A, [
          a[0] || (a[0] = p("summary", null, "Action details", -1)),
          p("pre", B, o((_ = (d = t.value) == null ? void 0 : d.arguments) == null ? void 0 : _.join(" ")), 1),
          (m = (v = t.value) == null ? void 0 : v.continued_arguments) != null && m.length ? (r(), l("pre", C, o(t.value.continued_arguments.join(" ")), 1)) : i("", !0)
        ])
      ], 64);
    };
  }
}, I = /* @__PURE__ */ x(E, [["__scopeId", "data-v-372999c2"]]);
export {
  I as default
};
