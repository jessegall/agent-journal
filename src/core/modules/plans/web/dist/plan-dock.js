/* @code-commandments-generated */
if (!document.getElementById("window-styles-8e74d5ac59e1")) { const style = document.createElement("style"); style.id = "window-styles-8e74d5ac59e1"; style.textContent = ".plan-dock-agents[data-v-aa962e00]{display:flex;flex-wrap:wrap;gap:6px;padding:0 12px 6px 16px}.plan-dock-agent[data-v-aa962e00]{padding:0 8px;border:1px solid var(--border-2);border-radius:99px;background:none;color:var(--text-2);font:inherit;font-size:11.5px;line-height:20px;cursor:pointer}.plan-dock-phases[data-v-aa962e00]{margin:0;padding:0 12px 9px 16px;list-style:none}.plan-dock-phase[data-v-aa962e00]{display:grid;grid-template-columns:18px minmax(0,1fr) auto;align-items:center;column-gap:8px;height:24px;font-size:12.5px}.plan-dock-number[data-v-aa962e00]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-aa962e00]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-aa962e00]{color:var(--text-4)}.plan-dock-tasks[data-v-aa962e00]{color:var(--text-4);font-size:11.5px}.plan-agents[data-v-3294ddc9]{display:flex;align-items:center;min-width:0;height:34px;margin:0 -16px;padding:0 10px;border-top:1px solid var(--border);color:var(--text-3);font-size:12px}.plan-agents-none[data-v-3294ddc9]{padding:0 6px}.plan-agents-button[data-v-3294ddc9]{display:inline-flex;gap:5px;align-items:center;min-width:0;padding:3px 6px;overflow:hidden;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;text-overflow:ellipsis;white-space:nowrap;cursor:pointer}.plan-agents-button[data-v-3294ddc9]:hover{background:var(--hover);color:var(--text)}.plans[data-v-a436c665]{display:flex;flex-direction:column;gap:14px}.plans-grid[data-v-a436c665]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}.plan[data-v-a436c665]{cursor:pointer;display:flex;flex-direction:column;gap:8px;min-width:0;padding:14px 16px 0;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plan-head[data-v-a436c665]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-a436c665]{margin-left:auto;padding:1px 7px;border:1px solid var(--border-2);border-radius:999px;color:var(--text-2);font-size:11px}.plan-state.started[data-v-a436c665],.plan-state.completed[data-v-a436c665]{border-color:var(--tone-good, var(--green));color:var(--tone-good, var(--green))}.plan-state.blocked[data-v-a436c665]{border-color:var(--tone-warn);color:var(--tone-warn)}.plan-title[data-v-a436c665]{overflow:hidden;font-weight:500;text-overflow:ellipsis;white-space:nowrap}.plan-bar[data-v-a436c665]{height:4px;border-radius:2px;background:var(--raised)}.plan-bar-fill[data-v-a436c665]{display:block;height:100%;border-radius:2px;background:var(--accent)}.plan-foot[data-v-a436c665],.plans-note[data-v-a436c665]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as v, computed as h, watch as y, openBlock as n, createElementBlock as s, Fragment as p, renderList as g, unref as $, toDisplayString as o, createCommentVNode as f, createElementVNode as l } from "vue";
import { useWindow as x, peekRef as E } from "@journal/window-kit";
import { _ as P } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const b = {
  key: 0,
  class: "plan-dock-agents",
  "data-plan-dock-agents": ""
}, C = ["title", "onClick"], D = { class: "plan-dock-phases" }, I = { class: "plan-dock-number" }, S = { class: "plan-dock-name" }, V = { class: "plan-dock-tasks" }, A = {
  key: 0,
  class: "plan-dock-phase quiet"
}, B = { class: "plan-dock-name" }, w = 5, M = {
  __name: "PlanDock",
  setup(N) {
    const c = x(), i = c.option("row"), d = v([]), r = v([]), k = h(() => [...new Map(r.value.map((t) => [t.id, t])).values()]), u = h(() => Math.max(0, d.value.length - w));
    async function _() {
      var e;
      const t = (e = i.value) == null ? void 0 : e.target_id;
      if (!t) return;
      const a = await c.read(`plan outline ${t}`);
      d.value = a.ok ? a.value.phases : [], r.value = a.ok ? a.value.agents : [];
    }
    return c.follow(["phase.*", "phase_task.*", "task.*", "agent.*"], _), y(() => {
      var t;
      return (t = i.value) == null ? void 0 : t.target_id;
    }, _, { immediate: !0 }), (t, a) => (n(), s(p, null, [
      k.value.length ? (n(), s("div", b, [
        (n(!0), s(p, null, g(k.value, (e) => (n(), s("button", {
          key: e.id,
          type: "button",
          class: "plan-dock-agent",
          title: `Open ${e.name}`,
          "data-plan-dock-agent": "",
          onClick: (m) => $(E)(`agents:${e.id}`)
        }, o(e.name), 9, C))), 128))
      ])) : f("", !0),
      l("ol", D, [
        (n(!0), s(p, null, g(d.value.slice(0, w), (e, m) => (n(), s("li", {
          key: e.id,
          class: "plan-dock-phase"
        }, [
          l("span", I, o(m + 1), 1),
          l("span", S, o(e.title), 1),
          l("span", V, o(e.tasks.length ? `${e.tasks.length} task${e.tasks.length === 1 ? "" : "s"}` : ""), 1)
        ]))), 128)),
        u.value ? (n(), s("li", A, [
          a[0] || (a[0] = l("span", null, null, -1)),
          l("span", B, "and " + o(u.value) + " more phase" + o(u.value === 1 ? "" : "s"), 1),
          a[1] || (a[1] = l("span", null, null, -1))
        ])) : f("", !0)
      ])
    ], 64));
  }
}, F = /* @__PURE__ */ P(M, [["__scopeId", "data-v-aa962e00"]]);
export {
  F as default
};
