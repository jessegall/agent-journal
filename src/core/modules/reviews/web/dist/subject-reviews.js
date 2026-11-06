/* @code-commandments-generated */
if (!document.getElementById("window-styles-23c94743533d")) { const style = document.createElement("style"); style.id = "window-styles-23c94743533d"; style.textContent = ".reviewer[data-v-be2043ac]{height:100%;overflow-y:auto}.queue[data-v-be2043ac]{margin:0;padding:8px 14px;color:var(--text-3);font-size:12px}.review[data-v-be2043ac]{padding:12px 14px}.review-title[data-v-be2043ac]{margin:0 0 8px;color:var(--text);font-size:12px;font-weight:600}.steps[data-v-be2043ac]{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}.step[data-v-be2043ac]{display:flex;align-items:baseline;gap:8px;color:var(--text-2);font-size:12px;line-height:1.5}.dot[data-v-be2043ac]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--text-3)}.dot[data-outcome=passed][data-v-be2043ac]{background:var(--green, #3aa676)}.dot[data-outcome=failed][data-v-be2043ac]{background:var(--red, #d4574b)}.text[data-v-be2043ac]{flex:1;white-space:pre-wrap}time[data-v-be2043ac]{flex:none;color:var(--text-3);font-size:11px}.list[data-v-03962f28]{display:flex;flex-direction:column;gap:10px;margin:0;padding:0;list-style:none}.head[data-v-03962f28]{display:flex;gap:8px;align-items:baseline}.state[data-v-03962f28]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as f, computed as h, watch as x, openBlock as o, createBlock as p, unref as _, withCtx as k, createElementVNode as s, createElementBlock as r, Fragment as m, renderList as y, createTextVNode as w, toDisplayString as l, createCommentVNode as n } from "vue";
import { useWindow as b, InspectorPart as j, TextDisplay as B } from "@journal/window-kit";
import { _ as C } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const N = { class: "list" }, R = { class: "head" }, S = { class: "state" }, g = "plan", E = {
  __name: "SubjectReviews",
  setup(T) {
    const a = b(), c = a.option("row"), i = f([]), u = h(() => i.value.filter((e) => e.subject_model === g)), v = (e) => e.slice(0, 1).toUpperCase() + e.slice(1);
    async function d() {
      const e = await a.read(`review list --subject ${c.value.id} --oldest`);
      i.value = e.ok ? e.value.rows : [];
    }
    return a.follow(["review.*"], d), x(() => c.value.id, d, { immediate: !0 }), (e, V) => u.value.length ? (o(), p(_(j), {
      key: 0,
      title: "Reviews",
      "data-plan-reviews": ""
    }, {
      default: k(() => [
        s("ol", N, [
          (o(!0), r(m, null, y(u.value, (t) => (o(), r("li", {
            key: t.id,
            "data-plan-review": ""
          }, [
            s("div", R, [
              s("span", null, [
                w("Review " + l(t.id), 1),
                t.reviewer_id ? (o(), r(m, { key: 0 }, [
                  w(" · reviewer " + l(t.reviewer_id), 1)
                ], 64)) : n("", !0)
              ]),
              s("span", S, l(v(t.state)), 1)
            ]),
            t.report ? (o(), p(_(B), {
              key: 0,
              text: t.report
            }, null, 8, ["text"])) : n("", !0)
          ]))), 128))
        ])
      ]),
      _: 1
    })) : n("", !0);
  }
}, P = /* @__PURE__ */ C(E, [["__scopeId", "data-v-03962f28"]]);
export {
  P as default
};
