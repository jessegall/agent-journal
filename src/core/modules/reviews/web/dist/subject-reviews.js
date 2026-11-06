/* @code-commandments-generated */
if (!document.getElementById("window-styles-da1f5e54c219")) { const style = document.createElement("style"); style.id = "window-styles-da1f5e54c219"; style.textContent = ".reviewer[data-v-de9b04bb]{height:100%;overflow-y:auto}.queue[data-v-de9b04bb]{margin:0;padding:8px 14px;color:var(--text-3);font-size:12px}.review[data-v-de9b04bb]{padding:12px 14px}.review-title[data-v-de9b04bb]{margin:0 0 8px;color:var(--text);font-size:12px;font-weight:600}.steps[data-v-de9b04bb]{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}.step[data-v-de9b04bb]{display:flex;align-items:baseline;gap:8px;color:var(--text-2);font-size:12px;line-height:1.5}.dot[data-v-de9b04bb]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--text-3)}.dot[data-outcome=passed][data-v-de9b04bb]{background:var(--green, #3aa676)}.dot[data-outcome=failed][data-v-de9b04bb]{background:var(--red, #d4574b)}.text[data-v-de9b04bb]{flex:1;white-space:pre-wrap}time[data-v-de9b04bb]{flex:none;color:var(--text-3);font-size:11px}.list[data-v-f189e2f0]{display:flex;flex-direction:column;gap:10px;margin:0;padding:0;list-style:none}.head[data-v-f189e2f0]{display:flex;gap:8px;align-items:baseline}.state[data-v-f189e2f0]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as a, watch as h, openBlock as o, createBlock as u, unref as d, withCtx as x, createElementVNode as s, createElementBlock as l, Fragment as _, renderList as k, createTextVNode as m, toDisplayString as n, createCommentVNode as c } from "vue";
import { useWindow as y, InspectorPart as b, TextDisplay as B } from "@journal/window-kit";
import { _ as C } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const N = { class: "list" }, R = { class: "head" }, S = { class: "state" }, g = "plan", j = {
  __name: "SubjectReviews",
  setup(E) {
    const r = y(), v = r.option("row"), i = a(() => `reviews.${v.value.id}`), w = a(() => r.props[i.value].rows.value), p = a(() => w.value.filter((e) => e.subject_model === g)), f = (e) => e.slice(0, 1).toUpperCase() + e.slice(1);
    return h(i, (e) => r.reload(e), { immediate: !0 }), (e, T) => p.value.length ? (o(), u(d(b), {
      key: 0,
      title: "Reviews",
      "data-plan-reviews": ""
    }, {
      default: x(() => [
        s("ol", N, [
          (o(!0), l(_, null, k(p.value, (t) => (o(), l("li", {
            key: t.id,
            "data-plan-review": ""
          }, [
            s("div", R, [
              s("span", null, [
                m("Review " + n(t.id), 1),
                t.reviewer_id ? (o(), l(_, { key: 0 }, [
                  m(" · reviewer " + n(t.reviewer_id), 1)
                ], 64)) : c("", !0)
              ]),
              s("span", S, n(f(t.state)), 1)
            ]),
            t.report ? (o(), u(d(B), {
              key: 0,
              text: t.report
            }, null, 8, ["text"])) : c("", !0)
          ]))), 128))
        ])
      ]),
      _: 1
    })) : c("", !0);
  }
}, L = /* @__PURE__ */ C(j, [["__scopeId", "data-v-f189e2f0"]]);
export {
  L as default
};
