/* @code-commandments-generated */
if (!document.getElementById("window-styles-49bdfd926ca7")) { const style = document.createElement("style"); style.id = "window-styles-49bdfd926ca7"; style.textContent = ".plan-dock-phases[data-v-4f34e7f3]{margin:0;padding:0 12px 9px 16px;list-style:none}.plan-dock-phase[data-v-4f34e7f3]{display:grid;grid-template-columns:18px minmax(0,1fr) auto;align-items:center;column-gap:8px;height:24px;font-size:12.5px}.plan-dock-number[data-v-4f34e7f3]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-4f34e7f3]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-4f34e7f3]{color:var(--text-4)}.plan-dock-tasks[data-v-4f34e7f3]{color:var(--text-4);font-size:11.5px}.plans[data-v-a6a6ace4]{display:flex;flex-direction:column;gap:14px}.plans-tabs[data-v-a6a6ace4]{display:flex;gap:14px}.plans-tab[data-v-a6a6ace4]{padding:0 0 4px;border:0;border-bottom:1px solid transparent;background:none;color:var(--text-3);font:inherit;font-size:11px;letter-spacing:.04em;text-transform:uppercase;cursor:pointer}.plans-tab.on[data-v-a6a6ace4]{border-bottom-color:var(--accent);color:var(--text)}.plans-grid[data-v-a6a6ace4]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}.plan[data-v-a6a6ace4]{cursor:pointer;display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plan-head[data-v-a6a6ace4]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-a6a6ace4]{margin-left:auto}.plan-title[data-v-a6a6ace4]{font-weight:500}.plan-bar[data-v-a6a6ace4]{height:4px;border-radius:2px;background:var(--raised)}.plan-bar-fill[data-v-a6a6ace4]{display:block;height:100%;border-radius:2px;background:var(--accent)}.plan-foot[data-v-a6a6ace4],.plans-note[data-v-a6a6ace4]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as m, computed as k, watch as f, openBlock as l, createElementBlock as c, Fragment as h, renderList as v, createElementVNode as a, toDisplayString as n, createCommentVNode as g } from "vue";
import { useWindow as w } from "@journal/window-kit";
import { _ as x } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const E = { class: "plan-dock-phases" }, y = { class: "plan-dock-number" }, P = { class: "plan-dock-name" }, D = { class: "plan-dock-tasks" }, I = {
  key: 0,
  class: "plan-dock-phase quiet"
}, S = { class: "plan-dock-name" }, _ = 5, V = {
  __name: "PlanDock",
  setup($) {
    const r = w(), i = r.option("row"), p = m([]), d = k(() => Math.max(0, p.value.length - _));
    async function u() {
      var s;
      const e = (s = i.value) == null ? void 0 : s.target_id;
      if (!e) return;
      const t = await r.read(`plan outline ${e}`);
      p.value = t.ok ? t.value.phases.map((o) => ({ ...o, tasks: o.tasks.length })) : [];
    }
    return r.follow(["phase.*", "phase_task.*"], u), f(() => {
      var e;
      return (e = i.value) == null ? void 0 : e.target_id;
    }, u, { immediate: !0 }), (e, t) => (l(), c("ol", E, [
      (l(!0), c(h, null, v(p.value.slice(0, _), (s, o) => (l(), c("li", {
        key: s.id,
        class: "plan-dock-phase"
      }, [
        a("span", y, n(o + 1), 1),
        a("span", P, n(s.title), 1),
        a("span", D, n(s.tasks ? `${s.tasks} task${s.tasks === 1 ? "" : "s"}` : ""), 1)
      ]))), 128)),
      d.value ? (l(), c("li", I, [
        t[0] || (t[0] = a("span", null, null, -1)),
        a("span", S, "and " + n(d.value) + " more phase" + n(d.value === 1 ? "" : "s"), 1),
        t[1] || (t[1] = a("span", null, null, -1))
      ])) : g("", !0)
    ]));
  }
}, b = /* @__PURE__ */ x(V, [["__scopeId", "data-v-4f34e7f3"]]);
export {
  b as default
};
