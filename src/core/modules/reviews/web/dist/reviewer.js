/* @code-commandments-generated */
if (!document.getElementById("window-styles-da1f5e54c219")) { const style = document.createElement("style"); style.id = "window-styles-da1f5e54c219"; style.textContent = ".reviewer[data-v-de9b04bb]{height:100%;overflow-y:auto}.queue[data-v-de9b04bb]{margin:0;padding:8px 14px;color:var(--text-3);font-size:12px}.review[data-v-de9b04bb]{padding:12px 14px}.review-title[data-v-de9b04bb]{margin:0 0 8px;color:var(--text);font-size:12px;font-weight:600}.steps[data-v-de9b04bb]{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}.step[data-v-de9b04bb]{display:flex;align-items:baseline;gap:8px;color:var(--text-2);font-size:12px;line-height:1.5}.dot[data-v-de9b04bb]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--text-3)}.dot[data-outcome=passed][data-v-de9b04bb]{background:var(--green, #3aa676)}.dot[data-outcome=failed][data-v-de9b04bb]{background:var(--red, #d4574b)}.text[data-v-de9b04bb]{flex:1;white-space:pre-wrap}time[data-v-de9b04bb]{flex:none;color:var(--text-3);font-size:11px}.list[data-v-f189e2f0]{display:flex;flex-direction:column;gap:10px;margin:0;padding:0;list-style:none}.head[data-v-f189e2f0]{display:flex;gap:8px;align-items:baseline}.state[data-v-f189e2f0]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as p, openBlock as t, createBlock as m, unref as o, withCtx as v, createElementVNode as s, createTextVNode as y, createCommentVNode as w, createVNode as h, createElementBlock as r, Fragment as f, renderList as k, toDisplayString as l, h as b } from "vue";
import { useWindow as g, useListTools as N, WindowRoom as q, EmptyState as R, ListTools as S, TimeAgo as T } from "@journal/window-kit";
import { _ as V } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const B = { class: "reviewer" }, E = { class: "review-title" }, L = { class: "steps" }, C = ["data-outcome"], W = { class: "text" }, A = {
  key: 1,
  class: "queue"
}, D = {
  __name: "ReviewerSteps",
  setup(I) {
    const x = g(), { data: c } = x.props.board, u = p(() => {
      var e;
      return ((e = c.value) == null ? void 0 : e.reviews) ?? [];
    }), n = p(() => {
      var e;
      return ((e = c.value) == null ? void 0 : e.queued) ?? 0;
    }), d = N(u, { title: (e) => e.title });
    return (e, _) => (t(), m(o(q), null, {
      default: v(() => [
        s("div", B, [
          u.value.length ? w("", !0) : (t(), m(o(R), {
            key: 0,
            title: "No review yet"
          }, {
            default: v(() => [..._[0] || (_[0] = [
              y("Reviews appear here with test results, requirement checks and the reviewer’s report.", -1)
            ])]),
            _: 1
          })),
          h(o(S), { tools: o(d) }, null, 8, ["tools"]),
          (t(!0), r(f, null, k(o(d).shown.value, (i) => (t(), r("section", {
            key: i.id,
            class: "review"
          }, [
            s("h3", E, l(i.title), 1),
            s("ol", L, [
              (t(!0), r(f, null, k(i.steps, (a) => (t(), r("li", {
                key: a.id,
                class: "step"
              }, [
                s("span", {
                  class: "dot",
                  "data-outcome": a.outcome
                }, null, 8, C),
                s("span", W, l(a.text), 1),
                h(o(T), {
                  at: a.created_at
                }, null, 8, ["at"])
              ]))), 128))
            ])
          ]))), 128)),
          n.value ? (t(), r("p", A, l(n.value) + " " + l(n.value === 1 ? "review" : "reviews") + " waiting", 1)) : w("", !0)
        ])
      ]),
      _: 1
    }));
  }
}, F = /* @__PURE__ */ V(D, [["__scopeId", "data-v-de9b04bb"]]), H = { render: () => b(F) };
export {
  H as default
};
