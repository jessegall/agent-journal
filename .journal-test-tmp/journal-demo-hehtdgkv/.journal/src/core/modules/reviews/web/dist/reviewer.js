/* @code-commandments-generated */
if (!document.getElementById("window-styles-5c2f24c3ceba")) { const style = document.createElement("style"); style.id = "window-styles-5c2f24c3ceba"; style.textContent = ".reviewer[data-v-8132956e]{height:100%;overflow-y:auto}.queue[data-v-8132956e]{margin:0;padding:8px 14px;color:var(--text-3);font-size:12px}.review[data-v-8132956e]{padding:12px 14px}.review-title[data-v-8132956e]{margin:0 0 8px;color:var(--text);font-size:12px;font-weight:600}.steps[data-v-8132956e]{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}.step[data-v-8132956e]{display:flex;align-items:baseline;gap:8px;color:var(--text-2);font-size:12px;line-height:1.5}.dot[data-v-8132956e]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--text-3)}.dot[data-outcome=passed][data-v-8132956e]{background:var(--green, #3aa676)}.dot[data-outcome=failed][data-v-8132956e]{background:var(--red, #d4574b)}.text[data-v-8132956e]{flex:1;white-space:pre-wrap}time[data-v-8132956e]{flex:none;color:var(--text-3);font-size:11px}\n"; document.head.appendChild(style); }
import { ref as p, openBlock as t, createBlock as m, unref as r, withCtx as h, createElementVNode as a, createTextVNode as g, createCommentVNode as f, createVNode as k, createElementBlock as l, Fragment as y, renderList as x, toDisplayString as u, h as N } from "vue";
import { useWindow as q, useListTools as R, WindowRoom as S, EmptyState as T, ListTools as V, TimeAgo as B } from "@journal/window-kit";
const E = (d, n) => {
  const o = d.__vccOpts || d;
  for (const [s, i] of n)
    o[s] = i;
  return o;
}, L = { class: "reviewer" }, C = { class: "review-title" }, W = { class: "steps" }, b = ["data-outcome"], A = { class: "text" }, D = {
  key: 1,
  class: "queue"
}, F = {
  __name: "ReviewerSteps",
  setup(d) {
    const n = q(), o = p([]), s = p(0), i = R(o, { title: (e) => e.title });
    async function _() {
      const e = await n.read("review board");
      o.value = e.ok ? e.value.reviews : [], s.value = e.ok ? e.value.queued : 0;
    }
    return n.follow(["review.*", "review_step.*", "reviewer.*"], _), _(), (e, w) => (t(), m(r(S), null, {
      default: h(() => [
        a("div", L, [
          o.value.length ? f("", !0) : (t(), m(r(T), {
            key: 0,
            title: "No review yet"
          }, {
            default: h(() => [...w[0] || (w[0] = [
              g("Reviews appear here with test results, requirement checks and the reviewer’s report.", -1)
            ])]),
            _: 1
          })),
          k(r(V), { tools: r(i) }, null, 8, ["tools"]),
          (t(!0), l(y, null, x(r(i).shown.value, (v) => (t(), l("section", {
            key: v.id,
            class: "review"
          }, [
            a("h3", C, u(v.title), 1),
            a("ol", W, [
              (t(!0), l(y, null, x(v.steps, (c) => (t(), l("li", {
                key: c.id,
                class: "step"
              }, [
                a("span", {
                  class: "dot",
                  "data-outcome": c.outcome
                }, null, 8, b),
                a("span", A, u(c.text), 1),
                k(r(B), {
                  at: c.created_at
                }, null, 8, ["at"])
              ]))), 128))
            ])
          ]))), 128)),
          s.value ? (t(), l("p", D, u(s.value) + " " + u(s.value === 1 ? "review" : "reviews") + " waiting", 1)) : f("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, I = /* @__PURE__ */ E(F, [["__scopeId", "data-v-8132956e"]]), z = { render: () => N(I) };
export {
  z as default
};
