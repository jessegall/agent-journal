if (!document.getElementById("window-styles-38c3c22db290")) { const style = document.createElement("style"); style.id = "window-styles-38c3c22db290"; style.textContent = ".reviewer[data-v-be2043ac]{height:100%;overflow-y:auto}.queue[data-v-be2043ac]{margin:0;padding:8px 14px;color:var(--text-3);font-size:12px}.review[data-v-be2043ac]{padding:12px 14px}.review-title[data-v-be2043ac]{margin:0 0 8px;color:var(--text);font-size:12px;font-weight:600}.steps[data-v-be2043ac]{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}.step[data-v-be2043ac]{display:flex;align-items:baseline;gap:8px;color:var(--text-2);font-size:12px;line-height:1.5}.dot[data-v-be2043ac]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--text-3)}.dot[data-outcome=passed][data-v-be2043ac]{background:var(--green, #3aa676)}.dot[data-outcome=failed][data-v-be2043ac]{background:var(--red, #d4574b)}.text[data-v-be2043ac]{flex:1;white-space:pre-wrap}time[data-v-be2043ac]{flex:none;color:var(--text-3);font-size:11px}.list[data-v-581c0682]{display:flex;flex-direction:column;gap:10px;margin:0;padding:0;list-style:none}.head[data-v-581c0682]{display:flex;gap:8px;align-items:baseline}.state[data-v-581c0682]{color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { computed as p, openBlock as t, createBlock as m, unref as o, withCtx as v, createElementVNode as s, createTextVNode as y, createCommentVNode as w, createVNode as h, createElementBlock as r, Fragment as f, renderList as k, toDisplayString as l, h as g } from "vue";
import { useWindow as N, useListTools as q, WindowRoom as R, EmptyState as S, ListTools as T, TimeAgo as V } from "@journal/window-kit";
import { _ as b } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const B = { class: "reviewer" }, E = { class: "review-title" }, L = { class: "steps" }, C = ["data-outcome"], W = { class: "text" }, A = {
  key: 1,
  class: "queue"
}, D = {
  __name: "ReviewerSteps",
  setup(I) {
    const x = N(), { data: c } = x.props.board, u = p(() => {
      var e;
      return ((e = c.value) == null ? void 0 : e.reviews) ?? [];
    }), n = p(() => {
      var e;
      return ((e = c.value) == null ? void 0 : e.queued) ?? 0;
    }), d = q(u, { title: (e) => e.title });
    return (e, _) => (t(), m(o(R), null, {
      default: v(() => [
        s("div", B, [
          u.value.length ? w("", !0) : (t(), m(o(S), {
            key: 0,
            title: "No review yet"
          }, {
            default: v(() => [..._[0] || (_[0] = [
              y("Reviews appear here with test results, requirement checks and the reviewer’s report.", -1)
            ])]),
            _: 1
          })),
          h(o(T), { tools: o(d) }, null, 8, ["tools"]),
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
                h(o(V), {
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
}, F = /* @__PURE__ */ b(D, [["__scopeId", "data-v-be2043ac"]]), H = { render: () => g(F) };
export {
  H as default
};
