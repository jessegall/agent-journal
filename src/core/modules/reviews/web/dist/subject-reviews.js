if (!document.getElementById("window-styles-be9efbc3016a")) { const style = document.createElement("style"); style.id = "window-styles-be9efbc3016a"; style.textContent = ".reviewer[data-v-de9b04bb]{height:100%;overflow-y:auto}.queue[data-v-de9b04bb]{margin:0;padding:8px 14px;color:var(--text-3);font-size:12px}.review[data-v-de9b04bb]{padding:12px 14px}.review-title[data-v-de9b04bb]{margin:0 0 8px;color:var(--text);font-size:12px;font-weight:600}.steps[data-v-de9b04bb]{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}.step[data-v-de9b04bb]{display:flex;align-items:baseline;gap:8px;color:var(--text-2);font-size:12px;line-height:1.5}.dot[data-v-de9b04bb]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--text-3)}.dot[data-outcome=passed][data-v-de9b04bb]{background:var(--green, #3aa676)}.dot[data-outcome=failed][data-v-de9b04bb]{background:var(--red, #d4574b)}.text[data-v-de9b04bb]{flex:1;white-space:pre-wrap}time[data-v-de9b04bb]{flex:none;color:var(--text-3);font-size:11px}.list[data-v-9e759df0]{display:flex;flex-direction:column;gap:10px;margin:0;padding:0;list-style:none}.head[data-v-9e759df0]{display:flex;gap:8px;align-items:baseline}.state[data-v-9e759df0]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as r, watch as x, openBlock as o, createBlock as d, unref as _, withCtx as k, createElementVNode as a, createElementBlock as l, Fragment as m, renderList as y, createTextVNode as v, toDisplayString as c, createCommentVNode as n } from "vue";
import { useWindow as b, InspectorPart as j, TextDisplay as B } from "@journal/window-kit";
import { _ as C } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const N = { class: "list" }, R = { class: "head" }, S = { class: "state" }, g = "plan", E = {
  __name: "SubjectReviews",
  setup(T) {
    const s = b(), w = s.option("row"), i = r(() => `reviews.${w.value.id}`), f = r(() => s.props[i.value].rows.value), p = r(() => f.value.filter((e) => e.subject_model === g)), u = r(() => new Map(s.props.reviewers.rows.value.map((e) => [e.subject_id, e.actor_id]))), h = (e) => e.slice(0, 1).toUpperCase() + e.slice(1);
    return x(i, (e) => s.reload(e), { immediate: !0 }), (e, V) => p.value.length ? (o(), d(_(j), {
      key: 0,
      title: "Reviews",
      "data-plan-reviews": ""
    }, {
      default: k(() => [
        a("ol", N, [
          (o(!0), l(m, null, y(p.value, (t) => (o(), l("li", {
            key: t.id,
            "data-plan-review": ""
          }, [
            a("div", R, [
              a("span", null, [
                v("Review " + c(t.id), 1),
                u.value.has(t.id) ? (o(), l(m, { key: 0 }, [
                  v(" · reviewer " + c(u.value.get(t.id)), 1)
                ], 64)) : n("", !0)
              ]),
              a("span", S, c(h(t.state)), 1)
            ]),
            t.report ? (o(), d(_(B), {
              key: 0,
              text: t.report
            }, null, 8, ["text"])) : n("", !0)
          ]))), 128))
        ])
      ]),
      _: 1
    })) : n("", !0);
  }
}, P = /* @__PURE__ */ C(E, [["__scopeId", "data-v-9e759df0"]]);
export {
  P as default
};
