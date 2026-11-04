/* @code-commandments-generated */
if (!document.getElementById("window-styles-352edd0b81bc")) { const style = document.createElement("style"); style.id = "window-styles-352edd0b81bc"; style.textContent = ".plan-dock-phases[data-v-85f28919]{margin:0;padding:0 12px 9px 16px;list-style:none}.plan-dock-phase[data-v-85f28919]{display:grid;grid-template-columns:18px minmax(0,1fr) auto;align-items:center;column-gap:8px;height:24px;font-size:12.5px}.plan-dock-number[data-v-85f28919]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-85f28919]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-85f28919]{color:var(--text-4)}.plan-dock-tasks[data-v-85f28919]{color:var(--text-4);font-size:11.5px}.plan-dock-task[data-v-85f28919]{padding:2px 0 2px 26px;color:var(--text-3);font-size:12px}.plans[data-v-462020cb]{display:flex;flex-direction:column;gap:14px}.plans-grid[data-v-462020cb]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}.plan[data-v-462020cb]{cursor:pointer;display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plan-head[data-v-462020cb]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-462020cb]{margin-left:auto;padding:1px 7px;border:1px solid var(--border-2);border-radius:999px;color:var(--text-2);font-size:11px}.plan-state.started[data-v-462020cb],.plan-state.completed[data-v-462020cb]{border-color:var(--tone-good, var(--green));color:var(--tone-good, var(--green))}.plan-state.blocked[data-v-462020cb]{border-color:var(--tone-warn);color:var(--tone-warn)}.plan-title[data-v-462020cb]{font-weight:500}.plan-bar[data-v-462020cb]{height:4px;border-radius:2px;background:var(--raised)}.plan-bar-fill[data-v-462020cb]{display:block;height:100%;border-radius:2px;background:var(--accent)}.plan-foot[data-v-462020cb],.plans-note[data-v-462020cb]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as f, computed as v, watch as g, openBlock as a, createElementBlock as o, Fragment as d, renderList as k, createElementVNode as e, toDisplayString as l, createCommentVNode as w } from "vue";
import { useWindow as x } from "@journal/window-kit";
import { _ as y } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const E = { class: "plan-dock-phases" }, P = { class: "plan-dock-phase" }, D = { class: "plan-dock-number" }, I = { class: "plan-dock-name" }, S = { class: "plan-dock-tasks" }, V = {
  key: 0,
  class: "plan-dock-phase quiet"
}, $ = { class: "plan-dock-name" }, m = 5, B = {
  __name: "PlanDock",
  setup(N) {
    const c = x(), p = c.option("row"), r = f([]), i = v(() => Math.max(0, r.value.length - m));
    async function u() {
      var t;
      const n = (t = p.value) == null ? void 0 : t.target_id;
      if (!n) return;
      const s = await c.read(`plan outline ${n}`);
      r.value = s.ok ? s.value.phases : [];
    }
    return c.follow(["phase.*", "phase_task.*"], u), g(() => {
      var n;
      return (n = p.value) == null ? void 0 : n.target_id;
    }, u, { immediate: !0 }), (n, s) => (a(), o("ol", E, [
      (a(!0), o(d, null, k(r.value.slice(0, m), (t, h) => (a(), o(d, {
        key: t.id
      }, [
        e("li", P, [
          e("span", D, l(h + 1), 1),
          e("span", I, l(t.title), 1),
          e("span", S, l(t.tasks.length ? `${t.tasks.length} task${t.tasks.length === 1 ? "" : "s"}` : ""), 1)
        ]),
        (a(!0), o(d, null, k(t.tasks, (_) => (a(), o("li", {
          key: _.id,
          class: "plan-dock-task"
        }, l(_.title), 1))), 128))
      ], 64))), 128)),
      i.value ? (a(), o("li", V, [
        s[0] || (s[0] = e("span", null, null, -1)),
        e("span", $, "and " + l(i.value) + " more phase" + l(i.value === 1 ? "" : "s"), 1),
        s[1] || (s[1] = e("span", null, null, -1))
      ])) : w("", !0)
    ]));
  }
}, A = /* @__PURE__ */ y(B, [["__scopeId", "data-v-85f28919"]]);
export {
  A as default
};
