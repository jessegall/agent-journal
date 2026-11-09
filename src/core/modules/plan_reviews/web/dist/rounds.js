/* @code-commandments-generated */
if (!document.getElementById("window-styles-54370200df1c")) { const style = document.createElement("style"); style.id = "window-styles-54370200df1c"; style.textContent = ".rounds[data-v-422d44f3]{display:flex;flex-direction:column;gap:6px;margin:0;padding:0;list-style:none}.round[data-v-422d44f3]{display:flex;flex-wrap:wrap;gap:4px 12px;align-items:baseline}.when[data-v-422d44f3],.reviewers[data-v-422d44f3]{color:var(--text-3);font-size:12px}.running[data-v-422d44f3]{color:var(--progress);font-size:12px}.report[data-v-422d44f3]{padding:0;border:0;background:none;color:var(--accent-text);font:inherit;cursor:pointer}.failure[data-v-422d44f3]{margin:0;color:var(--tone-warn)}\n"; document.head.appendChild(style); }
import { computed as u, watch as x, openBlock as s, createBlock as f, unref as p, withCtx as h, createElementVNode as v, toDisplayString as c, createElementBlock as o, Fragment as k, renderList as y, createVNode as N, createCommentVNode as _ } from "vue";
import { useWindow as B, eventAboutRows as P, InspectorPart as g, TimeAgo as V, peekRef as A } from "@journal/window-kit";
const E = (d, t) => {
  const a = d.__vccOpts || d;
  for (const [r, l] of t)
    a[r] = l;
  return a;
}, F = {
  class: "failure",
  role: "alert"
}, I = {
  class: "rounds",
  "data-plan-rounds": ""
}, S = { class: "number" }, j = {
  key: 0,
  class: "running"
}, D = ["title"], L = ["title", "onClick"], O = {
  __name: "PlanRounds",
  setup(d) {
    const t = B(), a = t.option("row"), r = u(() => `rounds.${a.value.id}`), l = u(() => t.props[r.value].rows.value), w = u(() => t.props[r.value].failure.value), R = u(() => [...l.value].reverse()), b = (e) => e.reviewers.length === 1 ? "1 reviewer" : `${e.reviewers.length} reviewers`, $ = (e) => e.reviewers.map((m) => m.name).join(", "), C = (e) => A(`reports:${e.id}`);
    return x(r, (e) => t.reload(e), { immediate: !0 }), t.follow(["plan.*"], (e) => P(e, /* @__PURE__ */ new Set([a.value.id])) && t.reload(r.value)), (e, m) => w.value ? (s(), f(p(g), {
      key: 0,
      title: "Review rounds"
    }, {
      default: h(() => [
        v("p", F, c(w.value), 1)
      ]),
      _: 1
    })) : l.value.length ? (s(), f(p(g), {
      key: 1,
      title: `Review rounds: ${l.value.length}`
    }, {
      default: h(() => [
        v("ol", I, [
          (s(!0), o(k, null, y(R.value, (n) => (s(), o("li", {
            key: n.number,
            class: "round",
            "data-plan-round": ""
          }, [
            v("span", S, "Round " + c(n.number), 1),
            N(p(V), {
              class: "when",
              at: n.started_at
            }, null, 8, ["at"]),
            n.ended_at ? _("", !0) : (s(), o("span", j, "Running")),
            n.reviewers.length ? (s(), o("span", {
              key: 1,
              class: "reviewers",
              title: $(n),
              "data-plan-round-reviewers": ""
            }, c(b(n)), 9, D)) : _("", !0),
            (s(!0), o(k, null, y(n.reports, (i) => (s(), o("button", {
              key: i.id,
              type: "button",
              class: "report",
              title: `Filed by ${i.filed_by}`,
              onClick: (T) => C(i)
            }, "Report " + c(i.id), 9, L))), 128))
          ]))), 128))
        ])
      ]),
      _: 1
    }, 8, ["title"])) : _("", !0);
  }
}, z = /* @__PURE__ */ E(O, [["__scopeId", "data-v-422d44f3"]]);
export {
  z as default
};
