/* @code-commandments-generated */
if (!document.getElementById("window-styles-9fd7d4d6d91e")) { const style = document.createElement("style"); style.id = "window-styles-9fd7d4d6d91e"; style.textContent = ".plan-dock-agents[data-v-46f94483]{display:flex;flex-wrap:wrap;gap:6px;padding:7px 14px 0 36px;align-items:center;color:var(--text-3);font-size:12px}.plan-dock-agent[data-v-46f94483]{padding:0 8px;height:20px;border:1px solid var(--border-2);border-radius:99px;background:none;color:var(--text-2);font:inherit;font-size:11.5px;line-height:20px;cursor:pointer}.plan-dock-phases[data-v-46f94483]{margin:0;padding:4px 14px 5px;list-style:none}.plan-dock-phase[data-v-46f94483]{display:grid;grid-template-columns:22px minmax(0,1fr) auto;align-items:center;height:24px;font-size:12.5px}.plan-dock-number[data-v-46f94483]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-46f94483]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-46f94483]{color:var(--text-4)}.plan-dock-tasks[data-v-46f94483]{color:var(--text-4);font-size:11.5px}.plan-dock-agent[data-v-46f94483]:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.plan-dock-phase.current .plan-dock-name[data-v-46f94483]{color:var(--text)}.plan-dock-phase.current .plan-dock-tasks[data-v-46f94483]{color:var(--text-3)}.plan-dock-loading[data-v-46f94483]{margin:8px 36px}.plan-agents[data-v-c34d84f7]{display:flex;align-items:center;min-width:0;height:34px;margin:2px -14px 0;padding:0 14px;border-top:1px solid var(--border-inner);color:var(--text-3);font-size:12px}.plan-agents-none[data-v-c34d84f7]{color:var(--text-4)}.plan-agents-button[data-v-c34d84f7]{display:inline-flex;gap:5px;align-items:center;min-width:0;margin-left:-6px;padding:3px 6px;overflow:hidden;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.plan-agents-button[data-v-c34d84f7]:hover{background:var(--hover);color:var(--text)}.plans[data-v-e7a41a05]{display:flex;flex-direction:column}.plans-grid[data-v-e7a41a05]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));margin-right:-1px}.plan[data-v-e7a41a05]{cursor:pointer;display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 0;border-right:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg)}.plan[data-v-e7a41a05]:hover{background:var(--raised)}.plan-head[data-v-e7a41a05]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-e7a41a05]{margin-left:auto;padding:1px 7px;border:1px solid var(--border-2);border-radius:999px;color:var(--text-2);font-size:11px}.plan-state.started[data-v-e7a41a05],.plan-state.completed[data-v-e7a41a05]{border-color:var(--tone-good, var(--green));color:var(--tone-good, var(--green))}.plan-state.blocked[data-v-e7a41a05]{border-color:var(--tone-warn);color:var(--tone-warn)}.plan-title[data-v-e7a41a05]{overflow:hidden;font-weight:500;text-overflow:ellipsis;white-space:nowrap}.plan-bar[data-v-e7a41a05]{display:flex;height:4px;overflow:hidden;border-radius:2px;background:var(--chip)}.plan-bar-fill[data-v-e7a41a05]{display:block;height:100%;background:var(--accent)}.plan-bar-testing[data-v-e7a41a05]{display:block;height:100%;background:color-mix(in srgb,var(--accent) 40%,transparent)}.plan-foot[data-v-e7a41a05],.plans-note[data-v-e7a41a05]{margin:0;color:var(--text-3);font-size:12px}.plans-note[data-v-e7a41a05],[data-plans-more][data-v-e7a41a05]{padding:8px 14px}\n"; document.head.appendChild(style); }
import { ref as k, computed as b, watch as C, openBlock as a, createElementBlock as l, Fragment as h, unref as u, createBlock as g, Teleport as S, createTextVNode as T, createElementVNode as s, toDisplayString as c, createCommentVNode as d, renderList as x, normalizeClass as D } from "vue";
import { useWindow as R, coalesced as V, READ_RATES as B, SkeletonLine as P, peekRef as I } from "@journal/window-kit";
import { _ as N } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const L = { key: 1 }, M = {
  key: 2,
  class: "plan-dock-agents",
  "data-plan-dock-agents": ""
}, W = ["title", "onClick"], q = { class: "plan-dock-phases" }, z = { class: "plan-dock-number" }, F = { class: "plan-dock-name" }, H = { class: "plan-dock-tasks" }, O = {
  key: 0,
  class: "plan-dock-phase quiet"
}, j = { class: "plan-dock-name" }, A = 5, G = {
  __name: "PlanDock",
  setup(J) {
    const i = R(), f = i.option("row"), w = i.option("foot"), o = k(null), _ = k(!0), m = k([]), y = k([]), $ = b(() => [
      ...new Map(y.value.map((n) => [n.id, n])).values()
    ]), v = b(
      () => Math.max(0, m.value.length - A)
    );
    async function E() {
      var r;
      const n = (r = f.value) == null ? void 0 : r.target_id;
      if (!n) return;
      const [e, t] = await Promise.all([
        i.read(`plan outline ${n}`),
        i.read(`plan progress ${n}`),
        new Promise((p) => setTimeout(p, 150))
      ]);
      t.ok && (o.value = t.value), _.value = !1, m.value = e.ok ? e.value.phases : [], y.value = e.ok ? e.value.agents : [];
    }
    return i.follow(["phase.*", "phase_task.*", "task.*", "agent.*"], V(E, B.planCard)), C(() => {
      var n;
      return (n = f.value) == null ? void 0 : n.target_id;
    }, E, { immediate: !0 }), (n, e) => (a(), l(h, null, [
      u(u(w)) ? (a(), g(S, {
        key: 0,
        to: u(u(w))
      }, [
        _.value ? (a(), g(u(P), {
          key: 0,
          bars: [{ width: "80px", height: 10 }]
        })) : o.value ? (a(), l("span", L, [
          e[0] || (e[0] = T("Tasks: ", -1)),
          s("b", null, c(o.value.completed_count ? `${o.value.completed_count} of ${o.value.task_count}` : o.value.task_count), 1)
        ])) : d("", !0)
      ], 8, ["to"])) : d("", !0),
      _.value ? (a(), g(u(P), {
        key: 1,
        class: "plan-dock-loading",
        bars: [
          { width: "70%", height: 12 },
          { width: "45%", height: 12 }
        ]
      })) : d("", !0),
      $.value.length ? (a(), l("div", M, [
        e[1] || (e[1] = s("span", null, "Agents:", -1)),
        (a(!0), l(h, null, x($.value, (t) => (a(), l("button", {
          key: t.id,
          type: "button",
          class: "plan-dock-agent",
          title: `Open ${t.name}`,
          "data-plan-dock-agent": "",
          onClick: (r) => u(I)(`agents:${t.id}`)
        }, c(t.name), 9, W))), 128))
      ])) : d("", !0),
      s("ol", q, [
        (a(!0), l(h, null, x(m.value.slice(0, A), (t, r) => {
          var p;
          return a(), l("li", {
            key: t.id,
            class: D([
              "plan-dock-phase",
              { current: ((p = o.value) == null ? void 0 : p.current_phase) === r + 1 }
            ])
          }, [
            s("span", z, c(r + 1), 1),
            s("span", F, c(t.title), 1),
            s("span", H, c(t.tasks.length ? `${t.tasks.length} task${t.tasks.length === 1 ? "" : "s"}` : ""), 1)
          ], 2);
        }), 128)),
        v.value ? (a(), l("li", O, [
          e[2] || (e[2] = s("span", null, null, -1)),
          s("span", j, "and " + c(v.value) + " more phase" + c(v.value === 1 ? "" : "s"), 1),
          e[3] || (e[3] = s("span", null, null, -1))
        ])) : d("", !0)
      ])
    ], 64));
  }
}, X = /* @__PURE__ */ N(G, [["__scopeId", "data-v-46f94483"]]);
export {
  X as default
};
