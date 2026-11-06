/* @code-commandments-generated */
if (!document.getElementById("window-styles-78e8a5b5cc84")) { const style = document.createElement("style"); style.id = "window-styles-78e8a5b5cc84"; style.textContent = ".rounds[data-v-52d29ced]{display:flex;flex-direction:column;gap:6px;margin:0;padding:0;list-style:none}.round[data-v-52d29ced]{display:flex;flex-wrap:wrap;gap:4px 12px;align-items:baseline}.when[data-v-52d29ced],.reviewers[data-v-52d29ced]{color:var(--text-3);font-size:12px}.running[data-v-52d29ced]{color:var(--progress);font-size:12px}.report[data-v-52d29ced]{padding:0;border:0;background:none;color:var(--accent-text);font:inherit;cursor:pointer}.failure[data-v-52d29ced]{margin:0;color:var(--tone-warn)}\n"; document.head.appendChild(style); }
import { ref as f, computed as N, watch as B, openBlock as n, createBlock as h, unref as _, withCtx as k, createElementVNode as p, toDisplayString as u, createElementBlock as o, Fragment as g, renderList as y, createVNode as P, createCommentVNode as v } from "vue";
import { useWindow as V, InspectorPart as R, TimeAgo as E, peekRef as F } from "@journal/window-kit";
const I = (d, a) => {
  const l = d.__vccOpts || d;
  for (const [s, i] of a)
    l[s] = i;
  return l;
}, j = {
  class: "failure",
  role: "alert"
}, A = {
  class: "rounds",
  "data-plan-rounds": ""
}, D = { class: "number" }, L = {
  key: 0,
  class: "running"
}, O = ["title"], S = ["title", "onClick"], T = {
  __name: "PlanRounds",
  setup(d) {
    const a = V(), l = a.option("row"), s = f([]), i = f(""), b = N(() => [...s.value].reverse()), $ = (e) => e.reviewers.length === 1 ? "1 reviewer" : `${e.reviewers.length} reviewers`, x = (e) => e.reviewers.map((r) => r.name).join(", "), C = (e) => F(`reports:${e.id}`);
    let w = 0;
    async function m() {
      const e = ++w, r = await a.read(`plan rounds ${l.value.id}`);
      e === w && (i.value = r.ok ? "" : r.error, s.value = r.ok ? r.value.rows : []);
    }
    return a.follow(["plan.*"], m), B(() => l.value.id, m, { immediate: !0 }), (e, r) => i.value ? (n(), h(_(R), {
      key: 0,
      title: "Review rounds"
    }, {
      default: k(() => [
        p("p", j, u(i.value), 1)
      ]),
      _: 1
    })) : s.value.length ? (n(), h(_(R), {
      key: 1,
      title: `Review rounds: ${s.value.length}`
    }, {
      default: k(() => [
        p("ol", A, [
          (n(!0), o(g, null, y(b.value, (t) => (n(), o("li", {
            key: t.number,
            class: "round",
            "data-plan-round": ""
          }, [
            p("span", D, "Round " + u(t.number), 1),
            P(_(E), {
              class: "when",
              at: t.started_at
            }, null, 8, ["at"]),
            t.ended_at ? v("", !0) : (n(), o("span", L, "Running")),
            t.reviewers.length ? (n(), o("span", {
              key: 1,
              class: "reviewers",
              title: x(t),
              "data-plan-round-reviewers": ""
            }, u($(t)), 9, O)) : v("", !0),
            (n(!0), o(g, null, y(t.reports, (c) => (n(), o("button", {
              key: c.id,
              type: "button",
              class: "report",
              title: `Filed by ${c.filed_by}`,
              onClick: (W) => C(c)
            }, "Report " + u(c.id), 9, S))), 128))
          ]))), 128))
        ])
      ]),
      _: 1
    }, 8, ["title"])) : v("", !0);
  }
}, G = /* @__PURE__ */ I(T, [["__scopeId", "data-v-52d29ced"]]);
export {
  G as default
};
