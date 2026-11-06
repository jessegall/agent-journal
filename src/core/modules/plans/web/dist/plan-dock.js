/* @code-commandments-generated */
if (!document.getElementById("window-styles-a1a769d38784")) { const style = document.createElement("style"); style.id = "window-styles-a1a769d38784"; style.textContent = ".plan-dock-agents[data-v-8157072c]{display:flex;flex-wrap:wrap;gap:6px;padding:7px 14px 0 36px;align-items:center;color:var(--text-3);font-size:12px}.plan-dock-agent[data-v-8157072c]{padding:0 8px;height:20px;border:1px solid var(--border-2);border-radius:99px;background:none;color:var(--text-2);font:inherit;font-size:11.5px;line-height:20px;cursor:pointer}.plan-dock-phases[data-v-8157072c]{margin:0;padding:4px 14px 5px;list-style:none}.plan-dock-phase[data-v-8157072c]{display:grid;grid-template-columns:22px minmax(0,1fr) auto;align-items:center;height:24px;font-size:12.5px}.plan-dock-number[data-v-8157072c]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-8157072c]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-8157072c]{color:var(--text-4)}.plan-dock-tasks[data-v-8157072c]{color:var(--text-4);font-size:11.5px}.plan-dock-agent[data-v-8157072c]:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.plan-dock-phase.current .plan-dock-name[data-v-8157072c]{color:var(--text)}.plan-dock-phase.current .plan-dock-tasks[data-v-8157072c]{color:var(--text-3)}.plan-dock-loading[data-v-8157072c]{margin:8px 36px}.plan-agents[data-v-c34d84f7]{display:flex;align-items:center;min-width:0;height:34px;margin:2px -14px 0;padding:0 14px;border-top:1px solid var(--border-inner);color:var(--text-3);font-size:12px}.plan-agents-none[data-v-c34d84f7]{color:var(--text-4)}.plan-agents-button[data-v-c34d84f7]{display:inline-flex;gap:5px;align-items:center;min-width:0;margin-left:-6px;padding:3px 6px;overflow:hidden;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.plan-agents-button[data-v-c34d84f7]:hover{background:var(--hover);color:var(--text)}.plans[data-v-982919f7]{display:flex;flex-direction:column}.plans-grid[data-v-982919f7]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));margin-right:-1px}.plan[data-v-982919f7]{cursor:pointer;display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 0;border-right:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg)}.plan[data-v-982919f7]:hover{background:var(--raised)}.plan-head[data-v-982919f7]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-982919f7]{margin-left:auto;padding:1px 7px;border:1px solid var(--border-2);border-radius:999px;color:var(--text-2);font-size:11px}.plan-state.started[data-v-982919f7],.plan-state.completed[data-v-982919f7]{border-color:var(--tone-good, var(--green));color:var(--tone-good, var(--green))}.plan-state.blocked[data-v-982919f7]{border-color:var(--tone-warn);color:var(--tone-warn)}.plan-title[data-v-982919f7]{overflow:hidden;font-weight:500;text-overflow:ellipsis;white-space:nowrap}.plan-bar[data-v-982919f7]{display:flex;height:4px;overflow:hidden;border-radius:2px;background:var(--chip)}.plan-bar-fill[data-v-982919f7]{display:block;height:100%;background:var(--accent)}.plan-bar-testing[data-v-982919f7]{display:block;height:100%;background:color-mix(in srgb,var(--accent) 40%,transparent)}.plan-foot[data-v-982919f7],.plans-note[data-v-982919f7]{margin:0;color:var(--text-3);font-size:12px}.plans-note[data-v-982919f7],[data-plans-more][data-v-982919f7]{padding:8px 14px}\n"; document.head.appendChild(style); }
import { ref as k, computed as x, watch as S, openBlock as a, createElementBlock as o, Fragment as h, unref as u, createBlock as g, Teleport as T, createTextVNode as V, createElementVNode as s, toDisplayString as c, createCommentVNode as p, renderList as P, normalizeClass as A } from "vue";
import { useWindow as B, SkeletonLine as E, peekRef as D } from "@journal/window-kit";
import { _ as I } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const N = { key: 1 }, L = {
  key: 2,
  class: "plan-dock-agents",
  "data-plan-dock-agents": ""
}, M = ["title", "onClick"], R = { class: "plan-dock-phases" }, W = { class: "plan-dock-number" }, q = { class: "plan-dock-name" }, z = { class: "plan-dock-tasks" }, F = {
  key: 0,
  class: "plan-dock-phase quiet"
}, H = { class: "plan-dock-name" }, C = 5, O = {
  __name: "PlanDock",
  setup(j) {
    const i = B(), f = i.option("row"), w = i.option("foot"), l = k(null), _ = k(!0), m = k([]), y = k([]), $ = x(() => [
      ...new Map(y.value.map((n) => [n.id, n])).values()
    ]), v = x(
      () => Math.max(0, m.value.length - C)
    );
    async function b() {
      var r;
      const n = (r = f.value) == null ? void 0 : r.target_id;
      if (!n) return;
      const [e, t] = await Promise.all([
        i.read(`plan outline ${n}`),
        i.read(`plan progress ${n}`),
        new Promise((d) => setTimeout(d, 150))
      ]);
      t.ok && (l.value = t.value), _.value = !1, m.value = e.ok ? e.value.phases : [], y.value = e.ok ? e.value.agents : [];
    }
    return i.follow(["phase.*", "phase_task.*", "task.*", "agent.*"], b), S(() => {
      var n;
      return (n = f.value) == null ? void 0 : n.target_id;
    }, b, { immediate: !0 }), (n, e) => (a(), o(h, null, [
      u(u(w)) ? (a(), g(T, {
        key: 0,
        to: u(u(w))
      }, [
        _.value ? (a(), g(u(E), {
          key: 0,
          bars: [{ width: "80px", height: 10 }]
        })) : l.value ? (a(), o("span", N, [
          e[0] || (e[0] = V("Tasks: ", -1)),
          s("b", null, c(l.value.completed_count ? `${l.value.completed_count} of ${l.value.task_count}` : l.value.task_count), 1)
        ])) : p("", !0)
      ], 8, ["to"])) : p("", !0),
      _.value ? (a(), g(u(E), {
        key: 1,
        class: "plan-dock-loading",
        bars: [
          { width: "70%", height: 12 },
          { width: "45%", height: 12 }
        ]
      })) : p("", !0),
      $.value.length ? (a(), o("div", L, [
        e[1] || (e[1] = s("span", null, "Agents:", -1)),
        (a(!0), o(h, null, P($.value, (t) => (a(), o("button", {
          key: t.id,
          type: "button",
          class: "plan-dock-agent",
          title: `Open ${t.name}`,
          "data-plan-dock-agent": "",
          onClick: (r) => u(D)(`agents:${t.id}`)
        }, c(t.name), 9, M))), 128))
      ])) : p("", !0),
      s("ol", R, [
        (a(!0), o(h, null, P(m.value.slice(0, C), (t, r) => {
          var d;
          return a(), o("li", {
            key: t.id,
            class: A([
              "plan-dock-phase",
              { current: ((d = l.value) == null ? void 0 : d.current_phase) === r + 1 }
            ])
          }, [
            s("span", W, c(r + 1), 1),
            s("span", q, c(t.title), 1),
            s("span", z, c(t.tasks.length ? `${t.tasks.length} task${t.tasks.length === 1 ? "" : "s"}` : ""), 1)
          ], 2);
        }), 128)),
        v.value ? (a(), o("li", F, [
          e[2] || (e[2] = s("span", null, null, -1)),
          s("span", H, "and " + c(v.value) + " more phase" + c(v.value === 1 ? "" : "s"), 1),
          e[3] || (e[3] = s("span", null, null, -1))
        ])) : p("", !0)
      ])
    ], 64));
  }
}, Q = /* @__PURE__ */ I(O, [["__scopeId", "data-v-8157072c"]]);
export {
  Q as default
};
