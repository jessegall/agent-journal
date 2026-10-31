/* @code-commandments-generated */
if (!document.getElementById("window-styles-3620757952d5")) { const style = document.createElement("style"); style.id = "window-styles-3620757952d5"; style.textContent = ".review[data-v-02eb0d60]{padding:12px 14px}.review-title[data-v-02eb0d60]{margin:0 0 8px;color:var(--text);font-size:12px;font-weight:600}.steps[data-v-02eb0d60]{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}.step[data-v-02eb0d60]{display:flex;align-items:baseline;gap:8px;color:var(--text-2);font-size:12px;line-height:1.5}.dot[data-v-02eb0d60]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--text-3)}.dot[data-outcome=passed][data-v-02eb0d60]{background:var(--green, #3aa676)}.dot[data-outcome=failed][data-v-02eb0d60]{background:var(--red, #d4574b)}.text[data-v-02eb0d60]{flex:1;white-space:pre-wrap}time[data-v-02eb0d60]{flex:none;color:var(--text-3);font-size:11px}.reviewer[data-v-713b08d3]{height:100%;overflow-y:auto}.queue[data-v-713b08d3]{margin:0;padding:8px 14px;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as o, createElementBlock as a, createElementVNode as c, toDisplayString as l, Fragment as f, renderList as g, unref as r, createBlock as v, withCtx as k, createTextVNode as $, createCommentVNode as _, h as x } from "vue";
import { useRows as u, EmptyState as y } from "@journal/window-kit";
const h = 60, p = 3600, m = 86400;
function E(t, s = Date.now()) {
  const e = Math.max(0, Math.floor((s - Date.parse(t)) / 1e3));
  return e < h ? "just now" : e < p ? `${Math.floor(e / h)} min ago` : e < m ? `${Math.floor(e / p)} h ago` : `${Math.floor(e / m)} d ago`;
}
const S = (t, s) => {
  const e = t.__vccOpts || t;
  for (const [n, d] of s)
    e[n] = d;
  return e;
}, N = { class: "review" }, D = { class: "review-title" }, R = { class: "steps" }, b = ["data-outcome"], M = { class: "text" }, O = {
  __name: "ReviewSteps",
  props: { review: { type: Object, required: !0 } },
  setup(t) {
    const s = t, { rows: e } = u(`review-step list --review ${s.review.id} --oldest`, ["review_step.*"]);
    return (n, d) => (o(), a("section", N, [
      c("h3", D, l(t.review.subject_model ? `${t.review.subject_model} ${t.review.subject_id}` : `Review ${t.review.id}`), 1),
      c("ol", R, [
        (o(!0), a(f, null, g(r(e), (i) => (o(), a("li", {
          key: i.id,
          class: "step"
        }, [
          c("span", {
            class: "dot",
            "data-outcome": i.outcome
          }, null, 8, b),
          c("span", M, l(i.text), 1),
          c("time", null, l(r(E)(i.created_at)), 1)
        ]))), 128))
      ])
    ]));
  }
}, j = /* @__PURE__ */ S(O, [["__scopeId", "data-v-02eb0d60"]]), C = { class: "reviewer" }, q = {
  key: 1,
  class: "queue"
}, T = {
  __name: "ReviewerSteps",
  setup(t) {
    const s = ["review.*", "reviewer.*"], { rows: e } = u("review list --state reviewing --oldest", s), { rows: n } = u("review list --state queued --oldest", s);
    return (d, i) => (o(), a("div", C, [
      r(e).length ? _("", !0) : (o(), v(r(y), {
        key: 0,
        title: "No review yet"
      }, {
        default: k(() => [...i[0] || (i[0] = [
          $("The reviewer shows here what it does with each worker's work: the review it starts, the tests it runs, each point passed or short, and the report it hands the agent.", -1)
        ])]),
        _: 1
      })),
      (o(!0), a(f, null, g(r(e), (w) => (o(), v(j, {
        key: w.id,
        review: w
      }, null, 8, ["review"]))), 128)),
      r(n).length ? (o(), a("p", q, l(r(n).length) + " " + l(r(n).length === 1 ? "review" : "reviews") + " waiting", 1)) : _("", !0)
    ]));
  }
}, V = /* @__PURE__ */ S(T, [["__scopeId", "data-v-713b08d3"]]), U = { render: () => x(V) };
export {
  U as default
};
