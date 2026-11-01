/* @code-commandments-generated */
if (!document.getElementById("window-styles-3480777fb483")) { const style = document.createElement("style"); style.id = "window-styles-3480777fb483"; style.textContent = ".reviewer[data-v-77abe068]{height:100%;overflow-y:auto}.queue[data-v-77abe068]{margin:0;padding:8px 14px;color:var(--text-3);font-size:12px}.review[data-v-77abe068]{padding:12px 14px}.review-title[data-v-77abe068]{margin:0 0 8px;color:var(--text);font-size:12px;font-weight:600}.steps[data-v-77abe068]{display:flex;flex-direction:column;gap:8px;margin:0;padding:0;list-style:none}.step[data-v-77abe068]{display:flex;align-items:baseline;gap:8px;color:var(--text-2);font-size:12px;line-height:1.5}.dot[data-v-77abe068]{flex:none;width:8px;height:8px;border-radius:50%;background:var(--text-3)}.dot[data-outcome=passed][data-v-77abe068]{background:var(--green, #3aa676)}.dot[data-outcome=failed][data-v-77abe068]{background:var(--red, #d4574b)}.text[data-v-77abe068]{flex:1;white-space:pre-wrap}time[data-v-77abe068]{flex:none;color:var(--text-3);font-size:11px}\n"; document.head.appendChild(style); }
import { ref as v, openBlock as o, createElementBlock as a, createBlock as x, unref as i, withCtx as y, createTextVNode as N, createCommentVNode as p, createVNode as D, Fragment as f, renderList as m, createElementVNode as l, toDisplayString as c, h as E } from "vue";
import { useWindow as M, useListTools as C, EmptyState as O, ListTools as T } from "@journal/window-kit";
const k = 60, S = 3600, g = 86400;
function V(n, s = Date.now()) {
  const e = Math.max(0, Math.floor((s - Date.parse(n)) / 1e3));
  return e < k ? "just now" : e < S ? `${Math.floor(e / k)} min ago` : e < g ? `${Math.floor(e / S)} h ago` : `${Math.floor(e / g)} d ago`;
}
const q = (n, s) => {
  const e = n.__vccOpts || n;
  for (const [r, u] of s)
    e[r] = u;
  return e;
}, B = { class: "reviewer" }, L = { class: "review-title" }, R = { class: "steps" }, $ = ["data-outcome"], b = { class: "text" }, I = {
  key: 1,
  class: "queue"
}, U = {
  __name: "ReviewerSteps",
  setup(n) {
    const s = M(), e = v([]), r = v(0), u = C(e, { title: (t) => t.title });
    async function w() {
      const t = await s.read("review board");
      e.value = t.ok ? t.value.reviews : [], r.value = t.ok ? t.value.queued : 0;
    }
    return s.follow(["review.*", "review_step.*", "reviewer.*"], w), w(), (t, _) => (o(), a("div", B, [
      e.value.length ? p("", !0) : (o(), x(i(O), {
        key: 0,
        title: "No review yet"
      }, {
        default: y(() => [..._[0] || (_[0] = [
          N("The reviewer shows here what it does with each worker's work: the review it starts, the tests it runs, each point passed or short, and the report it hands the agent.", -1)
        ])]),
        _: 1
      })),
      D(i(T), {
        tools: i(u),
        placeholder: "Search the reviews"
      }, null, 8, ["tools"]),
      (o(!0), a(f, null, m(i(u).shown.value, (h) => (o(), a("section", {
        key: h.id,
        class: "review"
      }, [
        l("h3", L, c(h.title), 1),
        l("ol", R, [
          (o(!0), a(f, null, m(h.steps, (d) => (o(), a("li", {
            key: d.id,
            class: "step"
          }, [
            l("span", {
              class: "dot",
              "data-outcome": d.outcome
            }, null, 8, $),
            l("span", b, c(d.text), 1),
            l("time", null, c(i(V)(d.created_at)), 1)
          ]))), 128))
        ])
      ]))), 128)),
      r.value ? (o(), a("p", I, c(r.value) + " " + c(r.value === 1 ? "review" : "reviews") + " waiting", 1)) : p("", !0)
    ]));
  }
}, j = /* @__PURE__ */ q(U, [["__scopeId", "data-v-77abe068"]]), H = { render: () => E(j) };
export {
  H as default
};
