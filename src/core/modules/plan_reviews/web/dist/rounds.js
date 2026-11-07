/* @code-commandments-generated */
if (!document.getElementById("window-styles-fbaf60f93c69")) { const style = document.createElement("style"); style.id = "window-styles-fbaf60f93c69"; style.textContent = ".rounds[data-v-e3f1dc65]{display:flex;flex-direction:column;gap:6px;margin:0;padding:0;list-style:none}.round[data-v-e3f1dc65]{display:flex;flex-wrap:wrap;gap:4px 12px;align-items:baseline}.when[data-v-e3f1dc65],.reviewers[data-v-e3f1dc65]{color:var(--text-3);font-size:12px}.running[data-v-e3f1dc65]{color:var(--progress);font-size:12px}.report[data-v-e3f1dc65]{padding:0;border:0;background:none;color:var(--accent-text);font:inherit;cursor:pointer}.failure[data-v-e3f1dc65]{margin:0;color:var(--tone-warn)}\n"; document.head.appendChild(style); }
import { computed as c, watch as x, openBlock as r, createBlock as f, unref as p, withCtx as h, createElementVNode as _, toDisplayString as u, createElementBlock as o, Fragment as k, renderList as y, createVNode as N, createCommentVNode as v } from "vue";
import { useWindow as B, InspectorPart as g, TimeAgo as P, peekRef as V } from "@journal/window-kit";
const E = (d, t) => {
  const l = d.__vccOpts || d;
  for (const [s, a] of t)
    l[s] = a;
  return l;
}, F = {
  class: "failure",
  role: "alert"
}, I = {
  class: "rounds",
  "data-plan-rounds": ""
}, j = { class: "number" }, A = {
  key: 0,
  class: "running"
}, D = ["title"], L = ["title", "onClick"], O = {
  __name: "PlanRounds",
  setup(d) {
    const t = B(), l = t.option("row"), s = c(() => `rounds.${l.value.id}`), a = c(() => t.props[s.value].rows.value), w = c(() => t.props[s.value].failure.value), R = c(() => [...a.value].reverse()), b = (e) => e.reviewers.length === 1 ? "1 reviewer" : `${e.reviewers.length} reviewers`, $ = (e) => e.reviewers.map((m) => m.name).join(", "), C = (e) => V(`reports:${e.id}`);
    return x(s, (e) => t.reload(e), { immediate: !0 }), t.follow(["plan.*"], () => t.reload(s.value)), (e, m) => w.value ? (r(), f(p(g), {
      key: 0,
      title: "Review rounds"
    }, {
      default: h(() => [
        _("p", F, u(w.value), 1)
      ]),
      _: 1
    })) : a.value.length ? (r(), f(p(g), {
      key: 1,
      title: `Review rounds: ${a.value.length}`
    }, {
      default: h(() => [
        _("ol", I, [
          (r(!0), o(k, null, y(R.value, (n) => (r(), o("li", {
            key: n.number,
            class: "round",
            "data-plan-round": ""
          }, [
            _("span", j, "Round " + u(n.number), 1),
            N(p(P), {
              class: "when",
              at: n.started_at
            }, null, 8, ["at"]),
            n.ended_at ? v("", !0) : (r(), o("span", A, "Running")),
            n.reviewers.length ? (r(), o("span", {
              key: 1,
              class: "reviewers",
              title: $(n),
              "data-plan-round-reviewers": ""
            }, u(b(n)), 9, D)) : v("", !0),
            (r(!0), o(k, null, y(n.reports, (i) => (r(), o("button", {
              key: i.id,
              type: "button",
              class: "report",
              title: `Filed by ${i.filed_by}`,
              onClick: (S) => C(i)
            }, "Report " + u(i.id), 9, L))), 128))
          ]))), 128))
        ])
      ]),
      _: 1
    }, 8, ["title"])) : v("", !0);
  }
}, q = /* @__PURE__ */ E(O, [["__scopeId", "data-v-e3f1dc65"]]);
export {
  q as default
};
