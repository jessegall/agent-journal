/* @code-commandments-generated */
if (!document.getElementById("window-styles-f032f14e79ee")) { const style = document.createElement("style"); style.id = "window-styles-f032f14e79ee"; style.textContent = ".plan-dock-agents[data-v-3fdf31fc]{display:flex;flex-wrap:wrap;gap:6px;padding:7px 14px 0 36px;align-items:center;color:var(--text-3);font-size:12px}.plan-dock-agent[data-v-3fdf31fc]{padding:0 8px;height:20px;border:1px solid var(--border-2);border-radius:99px;background:none;color:var(--text-2);font:inherit;font-size:11.5px;line-height:20px;cursor:pointer}.plan-dock-phases[data-v-3fdf31fc]{margin:0;padding:4px 14px 5px;list-style:none}.plan-dock-phase[data-v-3fdf31fc]{display:grid;grid-template-columns:22px minmax(0,1fr) auto;align-items:center;height:24px;font-size:12.5px}.plan-dock-number[data-v-3fdf31fc]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-3fdf31fc]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-3fdf31fc]{color:var(--text-4)}.plan-dock-tasks[data-v-3fdf31fc]{color:var(--text-4);font-size:11.5px}.plan-dock-agent[data-v-3fdf31fc]:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.plan-dock-phase.current .plan-dock-name[data-v-3fdf31fc]{color:var(--text)}.plan-dock-phase.current .plan-dock-tasks[data-v-3fdf31fc]{color:var(--text-3)}.plan-dock-loading[data-v-3fdf31fc]{margin:8px 36px}.plan-agents[data-v-c34d84f7]{display:flex;align-items:center;min-width:0;height:34px;margin:2px -14px 0;padding:0 14px;border-top:1px solid var(--border-inner);color:var(--text-3);font-size:12px}.plan-agents-none[data-v-c34d84f7]{color:var(--text-4)}.plan-agents-button[data-v-c34d84f7]{display:inline-flex;gap:5px;align-items:center;min-width:0;margin-left:-6px;padding:3px 6px;overflow:hidden;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.plan-agents-button[data-v-c34d84f7]:hover{background:var(--hover);color:var(--text)}.plans[data-v-0ceb8dc1]{display:flex;flex-direction:column}.plans-grid[data-v-0ceb8dc1]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));margin-right:-1px}.plan[data-v-0ceb8dc1]{cursor:pointer;display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 0;border-right:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg)}.plan[data-v-0ceb8dc1]:hover{background:var(--raised)}.plan-head[data-v-0ceb8dc1]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-0ceb8dc1]{margin-left:auto;padding:1px 7px;border:1px solid var(--border-2);border-radius:999px;color:var(--text-2);font-size:11px}.plan-state.started[data-v-0ceb8dc1],.plan-state.completed[data-v-0ceb8dc1]{border-color:var(--tone-good, var(--green));color:var(--tone-good, var(--green))}.plan-state.blocked[data-v-0ceb8dc1]{border-color:var(--tone-warn);color:var(--tone-warn)}.plan-title[data-v-0ceb8dc1]{overflow:hidden;font-weight:500;text-overflow:ellipsis;white-space:nowrap}.plan-bar[data-v-0ceb8dc1]{display:flex;height:4px;overflow:hidden;border-radius:2px;background:var(--chip)}.plan-bar-fill[data-v-0ceb8dc1]{display:block;height:100%;background:var(--accent)}.plan-bar-testing[data-v-0ceb8dc1]{display:block;height:100%;background:color-mix(in srgb,var(--accent) 40%,transparent)}.plan-foot[data-v-0ceb8dc1],.plans-note[data-v-0ceb8dc1]{margin:0;color:var(--text-3);font-size:12px}.plans-note[data-v-0ceb8dc1],[data-plans-more][data-v-0ceb8dc1]{padding:8px 14px}\n"; document.head.appendChild(style); }
import { computed as p, openBlock as e, createElementBlock as l, Fragment as h, unref as t, createBlock as m, Teleport as x, createTextVNode as A, createElementVNode as n, toDisplayString as d, createCommentVNode as i, renderList as E, normalizeClass as D } from "vue";
import { useWindow as S, useDockCard as P, coalesced as R, READ_RATES as T, SkeletonLine as $, peekRef as V } from "@journal/window-kit";
import { _ as B } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const N = { key: 1 }, I = {
  key: 2,
  class: "plan-dock-agents",
  "data-plan-dock-agents": ""
}, L = ["title", "onClick"], M = { class: "plan-dock-phases" }, W = { class: "plan-dock-number" }, q = { class: "plan-dock-name" }, z = { class: "plan-dock-tasks" }, F = {
  key: 0,
  class: "plan-dock-phase quiet"
}, H = { class: "plan-dock-name" }, b = 5, O = {
  __name: "PlanDock",
  setup(j) {
    const u = S(), r = P();
    u.option("row");
    const g = u.option("foot"), c = r.data, f = p(() => !r.data.value), v = p(() => {
      var a;
      return ((a = r.data.value) == null ? void 0 : a.phases) ?? [];
    }), C = p(() => {
      var a;
      return ((a = r.data.value) == null ? void 0 : a.agents) ?? [];
    }), y = p(() => [
      ...new Map(C.value.map((a) => [a.id, a])).values()
    ]), k = p(
      () => Math.max(0, v.value.length - b)
    );
    return u.follow(["phase.*", "phase_task.*", "task.*", "agent.*"], R(r.reload, T.planCard)), (a, o) => (e(), l(h, null, [
      t(t(g)) ? (e(), m(x, {
        key: 0,
        to: t(t(g))
      }, [
        f.value ? (e(), m(t($), {
          key: 0,
          bars: [{ width: "80px", height: 10 }]
        })) : t(c) ? (e(), l("span", N, [
          o[0] || (o[0] = A("Tasks: ", -1)),
          n("b", null, d(t(c).finished ? `${t(c).finished} of ${t(c).total}` : t(c).total), 1)
        ])) : i("", !0)
      ], 8, ["to"])) : i("", !0),
      f.value ? (e(), m(t($), {
        key: 1,
        class: "plan-dock-loading",
        bars: [
          { width: "70%", height: 12 },
          { width: "45%", height: 12 }
        ]
      })) : i("", !0),
      y.value.length ? (e(), l("div", I, [
        o[1] || (o[1] = n("span", null, "Agents:", -1)),
        (e(!0), l(h, null, E(y.value, (s) => (e(), l("button", {
          key: s.id,
          type: "button",
          class: "plan-dock-agent",
          title: `Open ${s.name}`,
          "data-plan-dock-agent": "",
          onClick: (_) => t(V)(`agents:${s.id}`)
        }, d(s.name), 9, L))), 128))
      ])) : i("", !0),
      n("ol", M, [
        (e(!0), l(h, null, E(v.value.slice(0, b), (s, _) => {
          var w;
          return e(), l("li", {
            key: s.id,
            class: D([
              "plan-dock-phase",
              { current: ((w = t(c)) == null ? void 0 : w.current_phase) === _ + 1 }
            ])
          }, [
            n("span", W, d(_ + 1), 1),
            n("span", q, d(s.title), 1),
            n("span", z, d(s.tasks.length ? `${s.tasks.length} task${s.tasks.length === 1 ? "" : "s"}` : ""), 1)
          ], 2);
        }), 128)),
        k.value ? (e(), l("li", F, [
          o[2] || (o[2] = n("span", null, null, -1)),
          n("span", H, "and " + d(k.value) + " more phase" + d(k.value === 1 ? "" : "s"), 1),
          o[3] || (o[3] = n("span", null, null, -1))
        ])) : i("", !0)
      ])
    ], 64));
  }
}, Q = /* @__PURE__ */ B(O, [["__scopeId", "data-v-3fdf31fc"]]);
export {
  Q as default
};
