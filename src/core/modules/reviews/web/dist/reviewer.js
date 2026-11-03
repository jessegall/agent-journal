/* @code-commandments-generated */
if (!document.getElementById("window-styles-e1e7e90705ce")) { const style = document.createElement("style"); style.id = "window-styles-e1e7e90705ce"; style.textContent = ".reviewer[data-v-83683a1d]{height:100%;overflow-y:auto}.queue[data-v-83683a1d]{margin:0;padding:8px 14px;color:var(--text-3);font-size:12px}.review[data-v-83683a1d]{padding:12px 14px}.review-title[data-v-83683a1d]{margin:0 0 8px;color:var(--text);font-size:12px;font-weight:600}.steps[data-v-83683a1d]{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}.step[data-v-83683a1d]{display:flex;align-items:baseline;gap:8px;color:var(--text-2);font-size:12px;line-height:1.5}.dot[data-v-83683a1d]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--text-3)}.dot[data-outcome=passed][data-v-83683a1d]{background:var(--green, #3aa676)}.dot[data-outcome=failed][data-v-83683a1d]{background:var(--red, #d4574b)}.text[data-v-83683a1d]{flex:1;white-space:pre-wrap}time[data-v-83683a1d]{flex:none;color:var(--text-3);font-size:11px}\n"; document.head.appendChild(style); }
import { ref as h, openBlock as t, createElementBlock as r, createBlock as f, unref as a, withCtx as y, createTextVNode as x, createCommentVNode as p, createVNode as g, Fragment as m, renderList as k, createElementVNode as n, toDisplayString as i, h as N } from "vue";
import { useWindow as S, useListTools as T, EmptyState as V, ListTools as q, ago as B } from "@journal/window-kit";
const E = (d, l) => {
  const s = d.__vccOpts || d;
  for (const [o, c] of l)
    s[o] = c;
  return s;
}, L = { class: "reviewer" }, C = { class: "review-title" }, R = { class: "steps" }, b = ["data-outcome"], D = { class: "text" }, F = {
  key: 1,
  class: "queue"
}, I = {
  __name: "ReviewerSteps",
  setup(d) {
    const l = S(), s = h([]), o = h(0), c = T(s, { title: (e) => e.title });
    async function w() {
      const e = await l.read("review board");
      s.value = e.ok ? e.value.reviews : [], o.value = e.ok ? e.value.queued : 0;
    }
    return l.follow(["review.*", "review_step.*", "reviewer.*"], w), w(), (e, _) => (t(), r("div", L, [
      s.value.length ? p("", !0) : (t(), f(a(V), {
        key: 0,
        title: "No review yet"
      }, {
        default: y(() => [..._[0] || (_[0] = [
          x("The reviewer shows here what it does with each worker's work: the review it starts, the tests it runs, each point passed or short, and the report it hands the agent.", -1)
        ])]),
        _: 1
      })),
      g(a(q), { tools: a(c) }, null, 8, ["tools"]),
      (t(!0), r(m, null, k(a(c).shown.value, (v) => (t(), r("section", {
        key: v.id,
        class: "review"
      }, [
        n("h3", C, i(v.title), 1),
        n("ol", R, [
          (t(!0), r(m, null, k(v.steps, (u) => (t(), r("li", {
            key: u.id,
            class: "step"
          }, [
            n("span", {
              class: "dot",
              "data-outcome": u.outcome
            }, null, 8, b),
            n("span", D, i(u.text), 1),
            n("time", null, i(a(B)(u.created_at)), 1)
          ]))), 128))
        ])
      ]))), 128)),
      o.value ? (t(), r("p", F, i(o.value) + " " + i(o.value === 1 ? "review" : "reviews") + " waiting", 1)) : p("", !0)
    ]));
  }
}, O = /* @__PURE__ */ E(I, [["__scopeId", "data-v-83683a1d"]]), z = { render: () => N(O) };
export {
  z as default
};
