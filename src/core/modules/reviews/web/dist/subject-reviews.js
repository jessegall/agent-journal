if (!document.getElementById("window-styles-38c3c22db290")) { const style = document.createElement("style"); style.id = "window-styles-38c3c22db290"; style.textContent = ".reviewer[data-v-be2043ac]{height:100%;overflow-y:auto}.queue[data-v-be2043ac]{margin:0;padding:8px 14px;color:var(--text-3);font-size:12px}.review[data-v-be2043ac]{padding:12px 14px}.review-title[data-v-be2043ac]{margin:0 0 8px;color:var(--text);font-size:12px;font-weight:600}.steps[data-v-be2043ac]{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}.step[data-v-be2043ac]{display:flex;align-items:baseline;gap:8px;color:var(--text-2);font-size:12px;line-height:1.5}.dot[data-v-be2043ac]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--text-3)}.dot[data-outcome=passed][data-v-be2043ac]{background:var(--green, #3aa676)}.dot[data-outcome=failed][data-v-be2043ac]{background:var(--red, #d4574b)}.text[data-v-be2043ac]{flex:1;white-space:pre-wrap}time[data-v-be2043ac]{flex:none;color:var(--text-3);font-size:11px}.list[data-v-581c0682]{display:flex;flex-direction:column;gap:10px;margin:0;padding:0;list-style:none}.head[data-v-581c0682]{display:flex;gap:8px;align-items:baseline}.state[data-v-581c0682]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as r, watch as x, openBlock as o, createBlock as d, unref as _, withCtx as k, createElementVNode as a, createElementBlock as c, Fragment as m, renderList as y, createTextVNode as v, toDisplayString as l, createCommentVNode as n } from "vue";
import { useWindow as b, InspectorPart as j, TextDisplay as B } from "@journal/window-kit";
import { _ as C } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const N = { class: "list" }, R = { class: "head" }, S = { class: "state" }, g = "plan", E = {
  __name: "SubjectReviews",
  setup(T) {
    const s = b(), w = s.option("row"), i = r(() => `reviews.${w.value.id}`), h = r(() => s.props[i.value].rows.value), p = r(() => h.value.filter((e) => e.subject_model === g)), u = r(() => new Map(s.props.reviewers.rows.value.map((e) => [e.subject_id, e.actor_id]))), f = (e) => e.slice(0, 1).toUpperCase() + e.slice(1);
    return x(i, (e) => s.reload(e), { immediate: !0 }), (e, V) => p.value.length ? (o(), d(_(j), {
      key: 0,
      title: "Reviews",
      "data-plan-reviews": ""
    }, {
      default: k(() => [
        a("ol", N, [
          (o(!0), c(m, null, y(p.value, (t) => (o(), c("li", {
            key: t.id,
            "data-plan-review": ""
          }, [
            a("div", R, [
              a("span", null, [
                v("Review " + l(t.id), 1),
                u.value.has(t.id) ? (o(), c(m, { key: 0 }, [
                  v(" · reviewer " + l(u.value.get(t.id)), 1)
                ], 64)) : n("", !0)
              ]),
              a("span", S, l(f(t.state)), 1)
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
}, P = /* @__PURE__ */ C(E, [["__scopeId", "data-v-581c0682"]]);
export {
  P as default
};
