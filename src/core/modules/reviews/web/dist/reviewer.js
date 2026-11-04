/* @code-commandments-generated */
if (!document.getElementById("window-styles-9528e1be110c")) { const style = document.createElement("style"); style.id = "window-styles-9528e1be110c"; style.textContent = ".reviewer[data-v-74156f2e]{height:100%;overflow-y:auto}.queue[data-v-74156f2e]{margin:0;padding:8px 14px;color:var(--text-3);font-size:12px}.review[data-v-74156f2e]{padding:12px 14px}.review-title[data-v-74156f2e]{margin:0 0 8px;color:var(--text);font-size:12px;font-weight:600}.steps[data-v-74156f2e]{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}.step[data-v-74156f2e]{display:flex;align-items:baseline;gap:8px;color:var(--text-2);font-size:12px;line-height:1.5}.dot[data-v-74156f2e]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--text-3)}.dot[data-outcome=passed][data-v-74156f2e]{background:var(--green, #3aa676)}.dot[data-outcome=failed][data-v-74156f2e]{background:var(--red, #d4574b)}.text[data-v-74156f2e]{flex:1;white-space:pre-wrap}time[data-v-74156f2e]{flex:none;color:var(--text-3);font-size:11px}\n"; document.head.appendChild(style); }
import { ref as h, openBlock as t, createBlock as p, unref as r, withCtx as m, createElementVNode as a, createTextVNode as x, createCommentVNode as f, createVNode as k, createElementBlock as n, Fragment as y, renderList as g, toDisplayString as u, h as N } from "vue";
import { useWindow as T, useListTools as S, WindowRoom as V, EmptyState as q, ListTools as B, TimeAgo as E } from "@journal/window-kit";
const L = (d, l) => {
  const o = d.__vccOpts || d;
  for (const [s, i] of l)
    o[s] = i;
  return o;
}, R = { class: "reviewer" }, C = { class: "review-title" }, W = { class: "steps" }, b = ["data-outcome"], A = { class: "text" }, D = {
  key: 1,
  class: "queue"
}, F = {
  __name: "ReviewerSteps",
  setup(d) {
    const l = T(), o = h([]), s = h(0), i = S(o, { title: (e) => e.title });
    async function _() {
      const e = await l.read("review board");
      o.value = e.ok ? e.value.reviews : [], s.value = e.ok ? e.value.queued : 0;
    }
    return l.follow(["review.*", "review_step.*", "reviewer.*"], _), _(), (e, w) => (t(), p(r(V), null, {
      default: m(() => [
        a("div", R, [
          o.value.length ? f("", !0) : (t(), p(r(q), {
            key: 0,
            title: "No review yet"
          }, {
            default: m(() => [...w[0] || (w[0] = [
              x("The reviewer shows here what it does with each agent's work: the review it starts, the tests it runs, each point passed or short, and the report it hands the agent.", -1)
            ])]),
            _: 1
          })),
          k(r(B), { tools: r(i) }, null, 8, ["tools"]),
          (t(!0), n(y, null, g(r(i).shown.value, (v) => (t(), n("section", {
            key: v.id,
            class: "review"
          }, [
            a("h3", C, u(v.title), 1),
            a("ol", W, [
              (t(!0), n(y, null, g(v.steps, (c) => (t(), n("li", {
                key: c.id,
                class: "step"
              }, [
                a("span", {
                  class: "dot",
                  "data-outcome": c.outcome
                }, null, 8, b),
                a("span", A, u(c.text), 1),
                k(r(E), {
                  at: c.created_at
                }, null, 8, ["at"])
              ]))), 128))
            ])
          ]))), 128)),
          s.value ? (t(), n("p", D, u(s.value) + " " + u(s.value === 1 ? "review" : "reviews") + " waiting", 1)) : f("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, I = /* @__PURE__ */ L(F, [["__scopeId", "data-v-74156f2e"]]), z = { render: () => N(I) };
export {
  z as default
};
