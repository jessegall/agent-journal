/* @code-commandments-generated */
if (!document.getElementById("window-styles-e4dcc2204dbb")) { const style = document.createElement("style"); style.id = "window-styles-e4dcc2204dbb"; style.textContent = ".plan-dock-phases[data-v-4d995ae4]{margin:0;padding:0 12px 9px 16px;list-style:none}.plan-dock-phase[data-v-4d995ae4]{display:grid;grid-template-columns:18px minmax(0,1fr) auto;align-items:center;column-gap:8px;height:24px;font-size:12.5px}.plan-dock-number[data-v-4d995ae4]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-4d995ae4]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-4d995ae4]{color:var(--text-4)}.plan-dock-tasks[data-v-4d995ae4]{color:var(--text-4);font-size:11.5px}.plans[data-v-462020cb]{display:flex;flex-direction:column;gap:14px}.plans-grid[data-v-462020cb]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}.plan[data-v-462020cb]{cursor:pointer;display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plan-head[data-v-462020cb]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-462020cb]{margin-left:auto;padding:1px 7px;border:1px solid var(--border-2);border-radius:999px;color:var(--text-2);font-size:11px}.plan-state.started[data-v-462020cb],.plan-state.completed[data-v-462020cb]{border-color:var(--tone-good, var(--green));color:var(--tone-good, var(--green))}.plan-state.blocked[data-v-462020cb]{border-color:var(--tone-warn);color:var(--tone-warn)}.plan-title[data-v-462020cb]{font-weight:500}.plan-bar[data-v-462020cb]{height:4px;border-radius:2px;background:var(--raised)}.plan-bar-fill[data-v-462020cb]{display:block;height:100%;border-radius:2px;background:var(--accent)}.plan-foot[data-v-462020cb],.plans-note[data-v-462020cb]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as m, computed as k, watch as h, openBlock as o, createElementBlock as l, Fragment as f, renderList as v, createElementVNode as a, toDisplayString as n, createCommentVNode as g } from "vue";
import { useWindow as w } from "@journal/window-kit";
import { _ as x } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const E = { class: "plan-dock-phases" }, y = { class: "plan-dock-number" }, P = { class: "plan-dock-name" }, D = { class: "plan-dock-tasks" }, I = {
  key: 0,
  class: "plan-dock-phase quiet"
}, S = { class: "plan-dock-name" }, u = 5, V = {
  __name: "PlanDock",
  setup($) {
    const c = w(), p = c.option("row"), r = m([]), d = k(() => Math.max(0, r.value.length - u));
    async function i() {
      var t;
      const s = (t = p.value) == null ? void 0 : t.target_id;
      if (!s) return;
      const e = await c.read(`plan outline ${s}`);
      r.value = e.ok ? e.value.phases : [];
    }
    return c.follow(["phase.*", "phase_task.*"], i), h(() => {
      var s;
      return (s = p.value) == null ? void 0 : s.target_id;
    }, i, { immediate: !0 }), (s, e) => (o(), l("ol", E, [
      (o(!0), l(f, null, v(r.value.slice(0, u), (t, _) => (o(), l("li", {
        key: t.id,
        class: "plan-dock-phase"
      }, [
        a("span", y, n(_ + 1), 1),
        a("span", P, n(t.title), 1),
        a("span", D, n(t.tasks.length ? `${t.tasks.length} task${t.tasks.length === 1 ? "" : "s"}` : ""), 1)
      ]))), 128)),
      d.value ? (o(), l("li", I, [
        e[0] || (e[0] = a("span", null, null, -1)),
        a("span", S, "and " + n(d.value) + " more phase" + n(d.value === 1 ? "" : "s"), 1),
        e[1] || (e[1] = a("span", null, null, -1))
      ])) : g("", !0)
    ]));
  }
}, b = /* @__PURE__ */ x(V, [["__scopeId", "data-v-4d995ae4"]]);
export {
  b as default
};
