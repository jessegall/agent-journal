/* @code-commandments-generated */
if (!document.getElementById("window-styles-dd82fc8b4b1d")) { const style = document.createElement("style"); style.id = "window-styles-dd82fc8b4b1d"; style.textContent = ".plan-dock[data-v-0aad8f0e]{display:flex;margin:0 14px 10px 36px;gap:8px;align-items:baseline;font-size:12px;line-height:1.45}.plan-dock-state[data-v-0aad8f0e]{flex:none;padding:1px 8px;margin-left:-8px;border-radius:9px;background:var(--raised);color:var(--text-2)}.plan-dock-state.started[data-v-0aad8f0e]{background:var(--accent-dim);color:var(--accent-text)}.plan-dock-state.waiting[data-v-0aad8f0e]{background:color-mix(in srgb,var(--warn, #d9a441) 22%,transparent);color:var(--warn, #d9a441)}.plan-dock-state.cancelled[data-v-0aad8f0e],.plan-dock-state.paused[data-v-0aad8f0e]{color:var(--text-3)}.plan-dock-text[data-v-0aad8f0e]{min-width:0;color:var(--text-3)}.plans[data-v-ac50e683]{display:flex;flex-direction:column;gap:14px}.plans-tabs[data-v-ac50e683]{display:flex;gap:14px}.plans-tab[data-v-ac50e683]{padding:0 0 4px;border:0;border-bottom:1px solid transparent;background:none;color:var(--text-3);font:inherit;font-size:11px;letter-spacing:.04em;text-transform:uppercase;cursor:pointer}.plans-tab.on[data-v-ac50e683]{border-bottom-color:var(--accent);color:var(--text)}.plans-grid[data-v-ac50e683]{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:12px}.plan[data-v-ac50e683]{display:flex;flex-direction:column;gap:8px;padding:14px 16px;border:1px solid var(--border);border-radius:10px;background:var(--surface)}.plan-head[data-v-ac50e683]{display:flex;gap:6px;align-items:center;color:var(--text-3);font-size:12px}.plan-state[data-v-ac50e683]{margin-left:auto}.plan-title[data-v-ac50e683]{font-weight:500}.plan-bar[data-v-ac50e683]{height:4px;border-radius:2px;background:var(--raised)}.plan-bar-fill[data-v-ac50e683]{display:block;height:100%;border-radius:2px;background:var(--accent)}.plan-foot[data-v-ac50e683],.plans-note[data-v-ac50e683]{margin:0;color:var(--text-3);font-size:12px}\n"; document.head.appendChild(style); }
import { openBlock as o, createElementBlock as t, unref as a, normalizeClass as s, toDisplayString as c, createCommentVNode as p } from "vue";
import { useWindow as r } from "@journal/window-kit";
import { _ as l } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const d = { class: "plan-dock" }, i = {
  __name: "PlanDock",
  setup(_) {
    const e = r().option("row"), n = { "plans.waiting": "Waiting for you", "plans.started": "Started", "plans.paused": "Paused", "plans.done": "Done", "plans.cancelled": "Cancelled" };
    return (m, u) => (o(), t("div", d, [
      a(e) ? (o(), t("span", {
        key: 0,
        class: s(["plan-dock-state", a(e).type.split(".")[1]])
      }, c(n[a(e).type]), 3)) : p("", !0)
    ]));
  }
}, D = /* @__PURE__ */ l(i, [["__scopeId", "data-v-0aad8f0e"]]);
export {
  D as default
};
