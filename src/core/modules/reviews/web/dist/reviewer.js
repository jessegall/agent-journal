/* @code-commandments-generated */
if (!document.getElementById("window-styles-ef45d3a48179")) { const style = document.createElement("style"); style.id = "window-styles-ef45d3a48179"; style.textContent = ".reviewer[data-v-9fd0dcbb]{height:100%;overflow-y:auto}.queue[data-v-9fd0dcbb]{margin:0;padding:8px 14px;color:var(--text-3);font-size:12px}.review[data-v-9fd0dcbb]{padding:12px 14px}.review-title[data-v-9fd0dcbb]{margin:0 0 8px;color:var(--text);font-size:12px;font-weight:600}.steps[data-v-9fd0dcbb]{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}.step[data-v-9fd0dcbb]{display:flex;align-items:baseline;gap:8px;color:var(--text-2);font-size:12px;line-height:1.5}.dot[data-v-9fd0dcbb]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--text-3)}.dot[data-outcome=passed][data-v-9fd0dcbb]{background:var(--green, #3aa676)}.dot[data-outcome=failed][data-v-9fd0dcbb]{background:var(--red, #d4574b)}.text[data-v-9fd0dcbb]{flex:1;white-space:pre-wrap}time[data-v-9fd0dcbb]{flex:none;color:var(--text-3);font-size:11px}\n"; document.head.appendChild(style); }
import { ref as h, openBlock as t, createBlock as p, unref as r, withCtx as m, createElementVNode as a, createTextVNode as x, createCommentVNode as f, createVNode as g, createElementBlock as n, Fragment as k, renderList as y, toDisplayString as l, h as N } from "vue";
import { useWindow as S, useListTools as T, WindowRoom as V, EmptyState as b, ListTools as q, ago as B } from "@journal/window-kit";
const E = (d, i) => {
  const o = d.__vccOpts || d;
  for (const [s, c] of i)
    o[s] = c;
  return o;
}, L = { class: "reviewer" }, R = { class: "review-title" }, C = { class: "steps" }, W = ["data-outcome"], D = { class: "text" }, F = {
  key: 1,
  class: "queue"
}, I = {
  __name: "ReviewerSteps",
  setup(d) {
    const i = S(), o = h([]), s = h(0), c = T(o, { title: (e) => e.title });
    async function w() {
      const e = await i.read("review board");
      o.value = e.ok ? e.value.reviews : [], s.value = e.ok ? e.value.queued : 0;
    }
    return i.follow(["review.*", "review_step.*", "reviewer.*"], w), w(), (e, _) => (t(), p(r(V), null, {
      default: m(() => [
        a("div", L, [
          o.value.length ? f("", !0) : (t(), p(r(b), {
            key: 0,
            title: "No review yet"
          }, {
            default: m(() => [..._[0] || (_[0] = [
              x("The reviewer shows here what it does with each worker's work: the review it starts, the tests it runs, each point passed or short, and the report it hands the agent.", -1)
            ])]),
            _: 1
          })),
          g(r(q), { tools: r(c) }, null, 8, ["tools"]),
          (t(!0), n(k, null, y(r(c).shown.value, (v) => (t(), n("section", {
            key: v.id,
            class: "review"
          }, [
            a("h3", R, l(v.title), 1),
            a("ol", C, [
              (t(!0), n(k, null, y(v.steps, (u) => (t(), n("li", {
                key: u.id,
                class: "step"
              }, [
                a("span", {
                  class: "dot",
                  "data-outcome": u.outcome
                }, null, 8, W),
                a("span", D, l(u.text), 1),
                a("time", null, l(r(B)(u.created_at)), 1)
              ]))), 128))
            ])
          ]))), 128)),
          s.value ? (t(), n("p", F, l(s.value) + " " + l(s.value === 1 ? "review" : "reviews") + " waiting", 1)) : f("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, O = /* @__PURE__ */ E(I, [["__scopeId", "data-v-9fd0dcbb"]]), A = { render: () => N(O) };
export {
  A as default
};
