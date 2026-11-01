/* @code-commandments-generated */
if (!document.getElementById("window-styles-702d14678858")) { const style = document.createElement("style"); style.id = "window-styles-702d14678858"; style.textContent = ".plan-dock-phases[data-v-68bb1dac]{margin:0;padding:0 12px 9px 16px;list-style:none}.plan-dock-phase[data-v-68bb1dac]{display:grid;grid-template-columns:18px minmax(0,1fr) auto;align-items:center;column-gap:8px;height:24px;font-size:12.5px}.plan-dock-number[data-v-68bb1dac]{color:var(--text-4);font-family:var(--mono);font-size:11px}.plan-dock-name[data-v-68bb1dac]{overflow:hidden;color:var(--text-2);text-overflow:ellipsis;white-space:nowrap}.plan-dock-phase.quiet .plan-dock-name[data-v-68bb1dac]{color:var(--text-4)}.plan-dock-tasks[data-v-68bb1dac]{color:var(--text-4);font-size:11.5px}.plans[data-v-5b63e501]{display:flex;flex-direction:column;gap:14px}.plans-tabs[data-v-5b63e501]{display:flex;gap:14px}.plans-tab[data-v-5b63e501]{padding:0 0 4px;border:0;border-bottom:1px solid transparent;background:none;color:var(--text-3);font:inherit;font-size:11px;letter-spacing:.04em;text-transform:uppercase;cursor:pointer}.plans-tab.on[data-v-5b63e501]{border-bottom-color:var(--accent);color:var(--text)}.plans-grid[data-v-5b63e501]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}.plan[data-v-5b63e501]{cursor:pointer;display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plan-head[data-v-5b63e501]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-5b63e501]{margin-left:auto}.plan-title[data-v-5b63e501]{font-weight:500}.plan-bar[data-v-5b63e501]{height:4px;border-radius:2px;background:var(--raised)}.plan-bar-fill[data-v-5b63e501]{display:block;height:100%;border-radius:2px;background:var(--accent)}.plan-foot[data-v-5b63e501],.plans-note[data-v-5b63e501]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { ref as h, computed as f, watch as v, openBlock as c, createElementBlock as i, Fragment as w, renderList as g, createElementVNode as e, toDisplayString as o, createCommentVNode as x } from "vue";
import { useWindow as y } from "@journal/window-kit";
import { _ as E } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const P = { class: "plan-dock-phases" }, $ = { class: "plan-dock-number" }, b = { class: "plan-dock-name" }, D = { class: "plan-dock-tasks" }, I = {
  key: 0,
  class: "plan-dock-phase quiet"
}, S = { class: "plan-dock-name" }, r = 5, V = {
  __name: "PlanDock",
  setup(B) {
    const n = y(), u = n.option("row"), d = h([]), p = f(() => Math.max(0, d.value.length - r)), m = (s) => s.ok ? s.value.rows : [];
    async function _() {
      var l;
      const s = (l = u.value) == null ? void 0 : l.target_id;
      if (!s) return;
      const t = m(await n.read(`phase list --plan ${s} --oldest --limit 100`)), a = await Promise.all(t.slice(0, r).map(async (k) => ({
        ...k,
        tasks: m(await n.read(`phase-task list --phase ${k.id} --limit 100`)).length
      })));
      d.value = [...a, ...t.slice(r)];
    }
    return n.follow(["phase.*", "phase_task.*"], _), v(() => {
      var s;
      return (s = u.value) == null ? void 0 : s.target_id;
    }, _, { immediate: !0 }), (s, t) => (c(), i("ol", P, [
      (c(!0), i(w, null, g(d.value.slice(0, r), (a, l) => (c(), i("li", {
        key: a.id,
        class: "plan-dock-phase"
      }, [
        e("span", $, o(l + 1), 1),
        e("span", b, o(a.title), 1),
        e("span", D, o(a.tasks ? `${a.tasks} task${a.tasks === 1 ? "" : "s"}` : ""), 1)
      ]))), 128)),
      p.value ? (c(), i("li", I, [
        t[0] || (t[0] = e("span", null, null, -1)),
        e("span", S, "and " + o(p.value) + " more phase" + o(p.value === 1 ? "" : "s"), 1),
        t[1] || (t[1] = e("span", null, null, -1))
      ])) : x("", !0)
    ]));
  }
}, A = /* @__PURE__ */ E(V, [["__scopeId", "data-v-68bb1dac"]]);
export {
  A as default
};
