/* @code-commandments-generated */
if (!document.getElementById("window-styles-aac3b0a596ec")) { const style = document.createElement("style"); style.id = "window-styles-aac3b0a596ec"; style.textContent = ".reviewer[data-v-8132956e]{height:100%;overflow-y:auto}.queue[data-v-8132956e]{margin:0;padding:8px 14px;color:var(--text-3);font-size:12px}.review[data-v-8132956e]{padding:12px 14px}.review-title[data-v-8132956e]{margin:0 0 8px;color:var(--text);font-size:12px;font-weight:600}.steps[data-v-8132956e]{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}.step[data-v-8132956e]{display:flex;align-items:baseline;gap:8px;color:var(--text-2);font-size:12px;line-height:1.5}.dot[data-v-8132956e]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--text-3)}.dot[data-outcome=passed][data-v-8132956e]{background:var(--green, #3aa676)}.dot[data-outcome=failed][data-v-8132956e]{background:var(--red, #d4574b)}.text[data-v-8132956e]{flex:1;white-space:pre-wrap}time[data-v-8132956e]{flex:none;color:var(--text-3);font-size:11px}.list[data-v-4cde3cc9]{display:flex;flex-direction:column;gap:10px;margin:0;padding:0;list-style:none}.head[data-v-4cde3cc9]{display:flex;gap:8px;align-items:baseline}.state[data-v-4cde3cc9]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as f, computed as h, watch as x, openBlock as o, createBlock as p, unref as _, withCtx as k, createElementVNode as s, createElementBlock as r, Fragment as m, renderList as y, createTextVNode as w, toDisplayString as c, createCommentVNode as l } from "vue";
import { useWindow as b, InspectorPart as j, TextDisplay as B } from "@journal/window-kit";
import { _ as C } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const N = { class: "list" }, R = { class: "head" }, S = { class: "state" }, g = "plan", E = {
  __name: "SubjectReviews",
  setup(T) {
    const a = b(), n = a.option("row"), i = f([]), d = h(() => i.value.filter((e) => e.subject_model === g)), v = (e) => e.slice(0, 1).toUpperCase() + e.slice(1);
    async function u() {
      const e = await a.read(`review list --subject ${n.value.id} --oldest`);
      i.value = e.ok ? e.value.rows : [];
    }
    return a.follow(["review.*"], u), x(() => n.value.id, u, { immediate: !0 }), (e, V) => d.value.length ? (o(), p(_(j), {
      key: 0,
      title: "Reviews",
      "data-plan-reviews": ""
    }, {
      default: k(() => [
        s("ol", N, [
          (o(!0), r(m, null, y(d.value, (t) => (o(), r("li", {
            key: t.id,
            "data-plan-review": ""
          }, [
            s("div", R, [
              s("span", null, [
                w("Review " + c(t.id), 1),
                t.reviewer_id ? (o(), r(m, { key: 0 }, [
                  w(" · reviewer " + c(t.reviewer_id), 1)
                ], 64)) : l("", !0)
              ]),
              s("span", S, c(v(t.state)), 1)
            ]),
            t.report ? (o(), p(_(B), {
              key: 0,
              text: t.report
            }, null, 8, ["text"])) : l("", !0)
          ]))), 128))
        ])
      ]),
      _: 1
    })) : l("", !0);
  }
}, P = /* @__PURE__ */ C(E, [["__scopeId", "data-v-4cde3cc9"]]);
export {
  P as default
};
