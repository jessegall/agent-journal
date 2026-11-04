/* @code-commandments-generated */
if (!document.getElementById("window-styles-6012a70fa090")) { const style = document.createElement("style"); style.id = "window-styles-6012a70fa090"; style.textContent = ".worker-models[data-v-e982edb4]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-e982edb4]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-e982edb4]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-e982edb4]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-e982edb4]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-e982edb4]{display:flex;gap:8px;align-items:center}.plan-bar[data-v-0af889c7]{position:relative;display:inline-flex;gap:8px;align-items:center;font-size:12.5px}.plan-bar-badge[data-v-0af889c7]{padding:0 7px;border:1px solid var(--border-2);border-radius:99px;color:var(--progress);font-size:11px;line-height:18px}.plan-bar-title[data-v-0af889c7],.plan-bar-delegation[data-v-0af889c7],.plan-bar-agent[data-v-0af889c7]{border:0;background:none;color:var(--text-2);font:inherit;cursor:pointer}.plan-bar-title[data-v-0af889c7]{max-width:260px;padding:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.plan-bar-delegation[data-v-0af889c7]{padding:0 8px;border:1px solid var(--border-2);border-radius:99px;line-height:20px}.plan-bar-popover[data-v-0af889c7]{position:absolute;top:calc(100% + 6px);right:0;z-index:5;display:flex;flex-direction:column;gap:4px;min-width:260px;padding:10px 12px;border:1px solid var(--border);border-radius:10px;background:var(--raised);box-shadow:0 8px 24px #00000040}.plan-bar-head[data-v-0af889c7]{margin:0 0 4px;color:var(--text-3);font-size:11.5px}.plan-bar-agent[data-v-0af889c7]{display:flex;flex-direction:column;align-items:flex-start;padding:2px 0;text-align:left}.plan-bar-agent span[data-v-0af889c7],.number[data-v-ad3f073f]{color:var(--text-3);font-size:12px}.main[data-v-ad3f073f]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-ad3f073f]{color:var(--text-3);font-size:12px}.main[data-v-ef968966]{flex:1}.note[data-v-ef968966]{color:var(--text-3);font-size:12px}.workers-count[data-v-10ae2edc]{display:inline-flex;gap:5px;align-items:center;padding:2px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12.5px;font-variant-numeric:tabular-nums;cursor:pointer}.workers-count[data-v-10ae2edc]:hover{background:var(--hover);color:var(--text)}.worktree[data-v-fe754622]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-fe754622]{flex:1;min-width:0}.worktree-holder[data-v-fe754622]{font-weight:500}.worktree-folder[data-v-fe754622]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-fe754622]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as c, computed as u, openBlock as l, createBlock as i, unref as n, withCtx as w, createElementVNode as d, createVNode as p, createTextVNode as k, toDisplayString as _ } from "vue";
import { useWindow as m, WindowRoom as v, Icon as f } from "@journal/window-kit";
import { _ as h } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const x = ["title"], g = {
  __name: "WorkersCount",
  setup(C) {
    const t = m(), e = c(0), a = u(() => e.value ? `${e.value} ${e.value === 1 ? "worker" : "workers"} out` : "Workers");
    async function r() {
      const o = await t.read(`worker waits --environment ${t.environment}`);
      e.value = o.ok ? o.value.rows.length : 0;
    }
    const s = (o) => window.dispatchEvent(new CustomEvent("journal:open-dropdown", { detail: { name: "workers.workers", anchor: o.currentTarget } }));
    return t.follow(["agent.*", "task.*", "worker_worktree.*"], r), r(), (o, W) => (l(), i(n(v), null, {
      default: w(() => [
        d("button", {
          type: "button",
          class: "workers-count",
          "data-workers-count": "",
          title: a.value,
          onClick: s
        }, [
          p(n(f), {
            name: "agents",
            size: 12
          }),
          k(" " + _(e.value), 1)
        ], 8, x)
      ]),
      _: 1
    }));
  }
}, V = /* @__PURE__ */ h(g, [["__scopeId", "data-v-10ae2edc"]]);
export {
  V as default
};
