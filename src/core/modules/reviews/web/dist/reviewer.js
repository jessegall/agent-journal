/* @code-commandments-generated */
if (!document.getElementById("window-styles-cea777334fef")) { const style = document.createElement("style"); style.id = "window-styles-cea777334fef"; style.textContent = ".reviewer[data-v-22daf153]{height:100%;overflow-y:auto}.queue[data-v-22daf153]{margin:0;padding:8px 14px;color:var(--text-3);font-size:12px}.review[data-v-22daf153]{padding:12px 14px}.review-title[data-v-22daf153]{margin:0 0 8px;color:var(--text);font-size:12px;font-weight:600}.steps[data-v-22daf153]{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}.step[data-v-22daf153]{display:flex;align-items:baseline;gap:8px;color:var(--text-2);font-size:12px;line-height:1.5}.dot[data-v-22daf153]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--text-3)}.dot[data-outcome=passed][data-v-22daf153]{background:var(--green, #3aa676)}.dot[data-outcome=failed][data-v-22daf153]{background:var(--red, #d4574b)}.text[data-v-22daf153]{flex:1;white-space:pre-wrap}time[data-v-22daf153]{flex:none;color:var(--text-3);font-size:11px}\n"; document.head.appendChild(style); }
import { ref as h, openBlock as t, createElementBlock as s, createBlock as S, unref as v, withCtx as x, createTextVNode as y, createCommentVNode as w, Fragment as p, renderList as f, createElementVNode as i, toDisplayString as c, h as N } from "vue";
import { useWindow as D, EmptyState as E } from "@journal/window-kit";
const m = 60, k = 3600, g = 86400;
function M(a, o = Date.now()) {
  const e = Math.max(0, Math.floor((o - Date.parse(a)) / 1e3));
  return e < m ? "just now" : e < k ? `${Math.floor(e / m)} min ago` : e < g ? `${Math.floor(e / k)} h ago` : `${Math.floor(e / g)} d ago`;
}
const C = (a, o) => {
  const e = a.__vccOpts || a;
  for (const [r, l] of o)
    e[r] = l;
  return e;
}, O = { class: "reviewer" }, q = { class: "review-title" }, B = { class: "steps" }, R = ["data-outcome"], T = { class: "text" }, V = {
  key: 1,
  class: "queue"
}, $ = {
  __name: "ReviewerSteps",
  setup(a) {
    const o = D(), e = h([]), r = h(0);
    async function l() {
      const n = await o.read("review board");
      e.value = n.ok ? n.value.reviews : [], r.value = n.ok ? n.value.queued : 0;
    }
    return o.follow(["review.*", "review_step.*", "reviewer.*"], l), l(), (n, _) => (t(), s("div", O, [
      e.value.length ? w("", !0) : (t(), S(v(E), {
        key: 0,
        title: "No review yet"
      }, {
        default: x(() => [..._[0] || (_[0] = [
          y("The reviewer shows here what it does with each worker's work: the review it starts, the tests it runs, each point passed or short, and the report it hands the agent.", -1)
        ])]),
        _: 1
      })),
      (t(!0), s(p, null, f(e.value, (d) => (t(), s("section", {
        key: d.id,
        class: "review"
      }, [
        i("h3", q, c(d.title), 1),
        i("ol", B, [
          (t(!0), s(p, null, f(d.steps, (u) => (t(), s("li", {
            key: u.id,
            class: "step"
          }, [
            i("span", {
              class: "dot",
              "data-outcome": u.outcome
            }, null, 8, R),
            i("span", T, c(u.text), 1),
            i("time", null, c(v(M)(u.created_at)), 1)
          ]))), 128))
        ])
      ]))), 128)),
      r.value ? (t(), s("p", V, c(r.value) + " " + c(r.value === 1 ? "review" : "reviews") + " waiting", 1)) : w("", !0)
    ]));
  }
}, I = /* @__PURE__ */ C($, [["__scopeId", "data-v-22daf153"]]), j = { render: () => N(I) };
export {
  j as default
};
