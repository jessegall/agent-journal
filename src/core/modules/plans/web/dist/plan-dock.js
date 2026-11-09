/* @code-commandments-generated */
if (!document.getElementById("window-styles-dc39ea190216")) { const style = document.createElement("style"); style.id = "window-styles-dc39ea190216"; style.textContent = ".plan-dock-agents[data-v-d7528f1b]{display:flex;flex-wrap:wrap;gap:6px;padding:7px 14px 0 36px;align-items:center;color:var(--text-3);font-size:12px}.plan-dock-agent[data-v-d7528f1b]{padding:0 8px;height:20px;border:1px solid var(--border-2);border-radius:99px;background:none;color:var(--text-2);font:inherit;font-size:11.5px;line-height:20px;cursor:pointer}.plan-dock-phases[data-v-d7528f1b]{margin:0;padding:4px 14px 5px;list-style:none}.plan-dock-phase[data-v-d7528f1b]{display:grid;grid-template-columns:22px minmax(0,1fr) auto;align-items:center;height:24px;font-size:12.5px}.plan-dock-number[data-v-d7528f1b]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-d7528f1b]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-d7528f1b]{color:var(--text-4)}.plan-dock-tasks[data-v-d7528f1b]{color:var(--text-4);font-size:11.5px}.plan-dock-agent[data-v-d7528f1b]:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.plan-dock-phase.current .plan-dock-name[data-v-d7528f1b]{color:var(--text)}.plan-dock-phase.current .plan-dock-tasks[data-v-d7528f1b]{color:var(--text-3)}.plan-dock-loading[data-v-d7528f1b]{margin:8px 36px}.plan-agents[data-v-c34d84f7]{display:flex;align-items:center;min-width:0;height:34px;margin:2px -14px 0;padding:0 14px;border-top:1px solid var(--border-inner);color:var(--text-3);font-size:12px}.plan-agents-none[data-v-c34d84f7]{color:var(--text-4)}.plan-agents-button[data-v-c34d84f7]{display:inline-flex;gap:5px;align-items:center;min-width:0;margin-left:-6px;padding:3px 6px;overflow:hidden;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.plan-agents-button[data-v-c34d84f7]:hover{background:var(--hover);color:var(--text)}.plans[data-v-d27de355]{display:flex;flex-direction:column}.plans-grid[data-v-d27de355]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));margin-right:-1px}.plan[data-v-d27de355]{cursor:pointer;display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 0;border-right:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg)}.plan[data-v-d27de355]:hover{background:var(--raised)}.plan-head[data-v-d27de355]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-d27de355]{margin-left:auto;padding:1px 7px;border:1px solid var(--border-2);border-radius:999px;color:var(--text-2);font-size:11px}.plan-state.started[data-v-d27de355],.plan-state.completed[data-v-d27de355]{border-color:var(--tone-good, var(--green));color:var(--tone-good, var(--green))}.plan-state.blocked[data-v-d27de355]{border-color:var(--tone-warn);color:var(--tone-warn)}.plan-title[data-v-d27de355]{overflow:hidden;font-weight:500;text-overflow:ellipsis;white-space:nowrap}.plan-foot[data-v-d27de355],.plans-note[data-v-d27de355]{margin:0;color:var(--text-3);font-size:12px}.plans-note[data-v-d27de355],[data-plans-more][data-v-d27de355]{padding:8px 14px}\n"; document.head.appendChild(style); }
import { computed as r, openBlock as a, createElementBlock as l, Fragment as g, unref as s, createBlock as f, Teleport as T, createTextVNode as V, createElementVNode as o, toDisplayString as d, createCommentVNode as u, renderList as E, normalizeClass as B } from "vue";
import { useWindow as M, useDockCard as N, coalesced as O, READ_RATES as I, SkeletonLine as S, peekRef as L, eventAboutRows as w, eventChildOf as $ } from "@journal/window-kit";
import { _ as W } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const q = { key: 1 }, z = {
  key: 2,
  class: "plan-dock-agents",
  "data-plan-dock-agents": ""
}, F = ["title", "onClick"], H = { class: "plan-dock-phases" }, j = { class: "plan-dock-number" }, G = { class: "plan-dock-name" }, J = { class: "plan-dock-tasks" }, K = {
  key: 0,
  class: "plan-dock-phase quiet"
}, Q = { class: "plan-dock-name" }, A = 5, U = {
  __name: "PlanDock",
  setup(X) {
    const _ = M(), i = N(), x = _.option("row"), y = _.option("foot"), c = i.data, b = r(() => !i.data.value), p = r(() => {
      var e;
      return ((e = i.data.value) == null ? void 0 : e.phases) ?? [];
    }), D = r(() => {
      var e;
      return ((e = i.data.value) == null ? void 0 : e.agents) ?? [];
    }), h = r(() => [
      ...new Map(D.value.map((e) => [e.id, e])).values()
    ]), m = r(
      () => Math.max(0, p.value.length - A)
    ), k = (e) => new Set(e.map((t) => t.id)), P = {
      phase: (e) => w(e, k(p.value)) || $(e, "plan_id", /* @__PURE__ */ new Set([s(x).target_id])),
      phase_task: (e) => $(e, "phase_id", k(p.value)),
      task: (e) => w(e, k(p.value.flatMap((t) => t.tasks))),
      agent: (e) => w(e, k(h.value))
    }, R = O(i.reload, I.planCard);
    return _.follow(["phase.*", "phase_task.*", "task.*", "agent.*"], (e) => {
      const t = P[e.event.split(".")[0]];
      (!t || t(e)) && R();
    }), (e, t) => (a(), l(g, null, [
      s(s(y)) ? (a(), f(T, {
        key: 0,
        to: s(s(y))
      }, [
        b.value ? (a(), f(s(S), {
          key: 0,
          bars: [{ width: "80px", height: 10 }]
        })) : s(c) ? (a(), l("span", q, [
          t[0] || (t[0] = V("Tasks: ", -1)),
          o("b", null, d(s(c).finished ? `${s(c).finished} of ${s(c).total}` : s(c).total), 1)
        ])) : u("", !0)
      ], 8, ["to"])) : u("", !0),
      b.value ? (a(), f(s(S), {
        key: 1,
        class: "plan-dock-loading",
        bars: [
          { width: "70%", height: 12 },
          { width: "45%", height: 12 }
        ]
      })) : u("", !0),
      h.value.length ? (a(), l("div", z, [
        t[1] || (t[1] = o("span", null, "Agents:", -1)),
        (a(!0), l(g, null, E(h.value, (n) => (a(), l("button", {
          key: n.id,
          type: "button",
          class: "plan-dock-agent",
          title: `Open ${n.name}`,
          "data-plan-dock-agent": "",
          onClick: (v) => s(L)(`agents:${n.id}`)
        }, d(n.name), 9, F))), 128))
      ])) : u("", !0),
      o("ol", H, [
        (a(!0), l(g, null, E(p.value.slice(0, A), (n, v) => {
          var C;
          return a(), l("li", {
            key: n.id,
            class: B([
              "plan-dock-phase",
              { current: ((C = s(c)) == null ? void 0 : C.current_phase) === v + 1 }
            ])
          }, [
            o("span", j, d(v + 1), 1),
            o("span", G, d(n.title), 1),
            o("span", J, d(n.tasks.length ? `${n.tasks.length} task${n.tasks.length === 1 ? "" : "s"}` : ""), 1)
          ], 2);
        }), 128)),
        m.value ? (a(), l("li", K, [
          t[2] || (t[2] = o("span", null, null, -1)),
          o("span", Q, "and " + d(m.value) + " more phase" + d(m.value === 1 ? "" : "s"), 1),
          t[3] || (t[3] = o("span", null, null, -1))
        ])) : u("", !0)
      ])
    ], 64));
  }
}, te = /* @__PURE__ */ W(U, [["__scopeId", "data-v-d7528f1b"]]);
export {
  te as default
};
