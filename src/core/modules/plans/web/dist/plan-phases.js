/* @code-commandments-generated */
if (!document.getElementById("window-styles-6424ed44b9c0")) { const style = document.createElement("style"); style.id = "window-styles-6424ed44b9c0"; style.textContent = ".plan-dock-agents[data-v-e1c7afc3]{display:flex;flex-wrap:wrap;gap:6px;padding:7px 14px 0 36px;align-items:center;color:var(--text-3);font-size:12px}.plan-dock-agent[data-v-e1c7afc3]{padding:0 8px;height:20px;border:1px solid var(--border-2);border-radius:99px;background:none;color:var(--text-2);font:inherit;font-size:11.5px;line-height:20px;cursor:pointer}.plan-dock-phases[data-v-e1c7afc3]{margin:0;padding:4px 14px 5px;list-style:none}.plan-dock-phase[data-v-e1c7afc3]{display:grid;grid-template-columns:22px minmax(0,1fr) auto;align-items:center;height:24px;font-size:12.5px}.plan-dock-number[data-v-e1c7afc3]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-e1c7afc3]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-e1c7afc3]{color:var(--text-4)}.plan-dock-tasks[data-v-e1c7afc3]{color:var(--text-4);font-size:11.5px}.plan-dock-agent[data-v-e1c7afc3]:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.plan-dock-phase.current .plan-dock-name[data-v-e1c7afc3]{color:var(--text)}.plan-dock-phase.current .plan-dock-tasks[data-v-e1c7afc3]{color:var(--text-3)}.plan-dock-loading[data-v-e1c7afc3]{margin:8px 36px}.plan-agents[data-v-b925bf06]{display:flex;align-items:center;min-width:0;height:34px;margin:2px -14px 0;padding:0 14px;border-top:1px solid var(--border-inner);color:var(--text-3);font-size:12px}.plan-agents-none[data-v-b925bf06]{color:var(--text-4)}.plan-agents-button[data-v-b925bf06]{display:inline-flex;gap:5px;align-items:center;min-width:0;margin-left:-6px;padding:3px 6px;overflow:hidden;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.plan-agents-button[data-v-b925bf06]:hover{background:var(--hover);color:var(--text)}.plans[data-v-2fdaa18b]{display:flex;flex-direction:column}.plans-grid[data-v-2fdaa18b]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));margin-right:-1px}.plan[data-v-2fdaa18b]{cursor:pointer;display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 14px 0;border-right:1px solid var(--border);border-bottom:1px solid var(--border);background:var(--bg)}.plan[data-v-2fdaa18b]:hover{background:var(--raised)}.plan-head[data-v-2fdaa18b]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-2fdaa18b]{margin-left:auto;padding:1px 7px;border:1px solid var(--border-2);border-radius:999px;color:var(--text-2);font-size:11px}.plan-state.started[data-v-2fdaa18b],.plan-state.completed[data-v-2fdaa18b]{border-color:var(--tone-good, var(--green));color:var(--tone-good, var(--green))}.plan-state.blocked[data-v-2fdaa18b]{border-color:var(--tone-warn);color:var(--tone-warn)}.plan-title[data-v-2fdaa18b]{overflow:hidden;font-weight:500;text-overflow:ellipsis;white-space:nowrap}.plan-bar[data-v-2fdaa18b]{display:flex;height:4px;overflow:hidden;border-radius:2px;background:var(--chip)}.plan-bar-fill[data-v-2fdaa18b]{display:block;height:100%;background:var(--accent)}.plan-bar-testing[data-v-2fdaa18b]{display:block;height:100%;background:color-mix(in srgb,var(--accent) 40%,transparent)}.plan-foot[data-v-2fdaa18b],.plans-note[data-v-2fdaa18b]{margin:0;color:var(--text-3);font-size:12px}.plans-note[data-v-2fdaa18b],[data-plans-more][data-v-2fdaa18b]{padding:8px 14px}\n"; document.head.appendChild(style); }
import { openBlock as o, createBlock as n, unref as e, withCtx as a, createVNode as p } from "vue";
import { useWindow as c, InspectorPart as u, PlanPhases as i, peekRef as l } from "@journal/window-kit";
const P = {
  __name: "PlanPhasesWindow",
  setup(h) {
    const s = c().option("row");
    return (f, t) => (o(), n(e(u), { title: "Phases" }, {
      default: a(() => [
        p(e(i), {
          phases: e(s).phases,
          "current-phase": e(s).current_phase,
          onSelect: t[0] || (t[0] = (r) => e(l)(`tasks:${r}`))
        }, null, 8, ["phases", "current-phase"])
      ]),
      _: 1
    }));
  }
};
export {
  P as default
};
