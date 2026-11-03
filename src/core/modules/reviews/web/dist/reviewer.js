/* @code-commandments-generated */
if (!document.getElementById("window-styles-9ad208c6223f")) { const style = document.createElement("style"); style.id = "window-styles-9ad208c6223f"; style.textContent = ".reviewer[data-v-193a4f94]{height:100%;overflow-y:auto}.queue[data-v-193a4f94]{margin:0;padding:8px 14px;color:var(--text-3);font-size:12px}.review[data-v-193a4f94]{padding:12px 14px}.review-title[data-v-193a4f94]{margin:0 0 8px;color:var(--text);font-size:12px;font-weight:600}.steps[data-v-193a4f94]{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}.step[data-v-193a4f94]{display:flex;align-items:baseline;gap:8px;color:var(--text-2);font-size:12px;line-height:1.5}.dot[data-v-193a4f94]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--text-3)}.dot[data-outcome=passed][data-v-193a4f94]{background:var(--green, #3aa676)}.dot[data-outcome=failed][data-v-193a4f94]{background:var(--red, #d4574b)}.text[data-v-193a4f94]{flex:1;white-space:pre-wrap}time[data-v-193a4f94]{flex:none;color:var(--text-3);font-size:11px}\n"; document.head.appendChild(style); }
import { ref as h, openBlock as t, createElementBlock as r, createBlock as k, unref as a, withCtx as y, createTextVNode as x, createCommentVNode as p, createVNode as g, Fragment as m, renderList as f, createElementVNode as n, toDisplayString as l, h as N } from "vue";
import { useWindow as S, useListTools as T, EmptyState as V, ListTools as q, ago as B } from "@journal/window-kit";
const E = (d, i) => {
  const s = d.__vccOpts || d;
  for (const [o, c] of i)
    s[o] = c;
  return s;
}, L = { class: "reviewer" }, C = { class: "review-title" }, R = { class: "steps" }, b = ["data-outcome"], D = { class: "text" }, F = {
  key: 1,
  class: "queue"
}, I = {
  __name: "ReviewerSteps",
  setup(d) {
    const i = S(), s = h([]), o = h(0), c = T(s, { title: (e) => e.title });
    async function w() {
      const e = await i.read("review board");
      s.value = e.ok ? e.value.reviews : [], o.value = e.ok ? e.value.queued : 0;
    }
    return i.follow(["review.*", "review_step.*", "reviewer.*"], w), w(), (e, _) => (t(), r("div", L, [
      s.value.length ? p("", !0) : (t(), k(a(V), {
        key: 0,
        title: "No review yet"
      }, {
        default: y(() => [..._[0] || (_[0] = [
          x("The reviewer shows here what it does with each worker's work: the review it starts, the tests it runs, each point passed or short, and the report it hands the agent.", -1)
        ])]),
        _: 1
      })),
      g(a(q), {
        tools: a(c),
        placeholder: "Search the reviews"
      }, null, 8, ["tools"]),
      (t(!0), r(m, null, f(a(c).shown.value, (v) => (t(), r("section", {
        key: v.id,
        class: "review"
      }, [
        n("h3", C, l(v.title), 1),
        n("ol", R, [
          (t(!0), r(m, null, f(v.steps, (u) => (t(), r("li", {
            key: u.id,
            class: "step"
          }, [
            n("span", {
              class: "dot",
              "data-outcome": u.outcome
            }, null, 8, b),
            n("span", D, l(u.text), 1),
            n("time", null, l(a(B)(u.created_at)), 1)
          ]))), 128))
        ])
      ]))), 128)),
      o.value ? (t(), r("p", F, l(o.value) + " " + l(o.value === 1 ? "review" : "reviews") + " waiting", 1)) : p("", !0)
    ]));
  }
}, O = /* @__PURE__ */ E(I, [["__scopeId", "data-v-193a4f94"]]), z = { render: () => N(O) };
export {
  z as default
};
