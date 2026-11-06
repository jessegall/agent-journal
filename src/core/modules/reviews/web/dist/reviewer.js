/* @code-commandments-generated */
if (!document.getElementById("window-styles-aac3b0a596ec")) { const style = document.createElement("style"); style.id = "window-styles-aac3b0a596ec"; style.textContent = ".reviewer[data-v-8132956e]{height:100%;overflow-y:auto}.queue[data-v-8132956e]{margin:0;padding:8px 14px;color:var(--text-3);font-size:12px}.review[data-v-8132956e]{padding:12px 14px}.review-title[data-v-8132956e]{margin:0 0 8px;color:var(--text);font-size:12px;font-weight:600}.steps[data-v-8132956e]{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}.step[data-v-8132956e]{display:flex;align-items:baseline;gap:8px;color:var(--text-2);font-size:12px;line-height:1.5}.dot[data-v-8132956e]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--text-3)}.dot[data-outcome=passed][data-v-8132956e]{background:var(--green, #3aa676)}.dot[data-outcome=failed][data-v-8132956e]{background:var(--red, #d4574b)}.text[data-v-8132956e]{flex:1;white-space:pre-wrap}time[data-v-8132956e]{flex:none;color:var(--text-3);font-size:11px}.list[data-v-4cde3cc9]{display:flex;flex-direction:column;gap:10px;margin:0;padding:0;list-style:none}.head[data-v-4cde3cc9]{display:flex;gap:8px;align-items:baseline}.state[data-v-4cde3cc9]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as w, openBlock as t, createBlock as p, unref as o, withCtx as m, createElementVNode as s, createTextVNode as y, createCommentVNode as h, createVNode as f, createElementBlock as r, Fragment as k, renderList as x, toDisplayString as i, h as g } from "vue";
import { useWindow as N, useListTools as q, WindowRoom as R, EmptyState as S, ListTools as T, TimeAgo as V } from "@journal/window-kit";
import { _ as B } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const E = { class: "reviewer" }, L = { class: "review-title" }, C = { class: "steps" }, W = ["data-outcome"], b = { class: "text" }, A = {
  key: 1,
  class: "queue"
}, D = {
  __name: "ReviewerSteps",
  setup(I) {
    const u = N(), n = w([]), a = w(0), d = q(n, { title: (e) => e.title });
    async function _() {
      const e = await u.read("review board");
      n.value = e.ok ? e.value.reviews : [], a.value = e.ok ? e.value.queued : 0;
    }
    return u.follow(["review.*", "review_step.*", "reviewer.*"], _), _(), (e, v) => (t(), p(o(R), null, {
      default: m(() => [
        s("div", E, [
          n.value.length ? h("", !0) : (t(), p(o(S), {
            key: 0,
            title: "No review yet"
          }, {
            default: m(() => [...v[0] || (v[0] = [
              y("Reviews appear here with test results, requirement checks and the reviewer’s report.", -1)
            ])]),
            _: 1
          })),
          f(o(T), { tools: o(d) }, null, 8, ["tools"]),
          (t(!0), r(k, null, x(o(d).shown.value, (c) => (t(), r("section", {
            key: c.id,
            class: "review"
          }, [
            s("h3", L, i(c.title), 1),
            s("ol", C, [
              (t(!0), r(k, null, x(c.steps, (l) => (t(), r("li", {
                key: l.id,
                class: "step"
              }, [
                s("span", {
                  class: "dot",
                  "data-outcome": l.outcome
                }, null, 8, W),
                s("span", b, i(l.text), 1),
                f(o(V), {
                  at: l.created_at
                }, null, 8, ["at"])
              ]))), 128))
            ])
          ]))), 128)),
          a.value ? (t(), r("p", A, i(a.value) + " " + i(a.value === 1 ? "review" : "reviews") + " waiting", 1)) : h("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, F = /* @__PURE__ */ B(D, [["__scopeId", "data-v-8132956e"]]), H = { render: () => g(F) };
export {
  H as default
};
