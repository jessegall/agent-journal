/* @code-commandments-generated */
if (!document.getElementById("window-styles-a4feb3648708")) { const style = document.createElement("style"); style.id = "window-styles-a4feb3648708"; style.textContent = ".worker-models[data-v-ea84e528]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-ea84e528]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-ea84e528]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-ea84e528]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-ea84e528]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-ea84e528]{display:flex;gap:8px;align-items:center}.plan-bar[data-v-f62e90bd]{position:relative;display:inline-flex;gap:8px;align-items:center;font-size:12.5px}.plan-bar-badge[data-v-f62e90bd]{padding:0 7px;border:1px solid var(--border-2);border-radius:99px;color:var(--progress);font-size:11px;line-height:18px}.plan-bar-title[data-v-f62e90bd],.plan-bar-delegation[data-v-f62e90bd],.plan-bar-agent[data-v-f62e90bd]{border:0;background:none;color:var(--text-2);font:inherit;cursor:pointer}.plan-bar-title[data-v-f62e90bd]{max-width:260px;padding:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.plan-bar-delegation[data-v-f62e90bd]{padding:0 8px;border:1px solid var(--border-2);border-radius:99px;line-height:20px}.plan-bar-popover[data-v-f62e90bd]{position:absolute;top:calc(100% + 6px);right:0;z-index:5;display:flex;flex-direction:column;gap:4px;min-width:260px;padding:10px 12px;border:1px solid var(--border);border-radius:10px;background:var(--raised);box-shadow:0 8px 24px #00000040}.plan-bar-head[data-v-f62e90bd]{margin:0 0 4px;color:var(--text-3);font-size:11.5px}.plan-bar-agent[data-v-f62e90bd]{display:flex;flex-direction:column;align-items:flex-start;padding:2px 0;text-align:left}.plan-bar-agent span[data-v-f62e90bd],.number[data-v-073d22f6]{color:var(--text-3);font-size:12px}.main[data-v-073d22f6]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-073d22f6]{color:var(--text-3);font-size:12px}.main[data-v-b360bbe9]{flex:1}.note[data-v-b360bbe9]{color:var(--text-3);font-size:12px}.workers-count[data-v-beb16041]{display:inline-flex;gap:5px;align-items:center;padding:2px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12.5px;font-variant-numeric:tabular-nums;cursor:pointer}.workers-count[data-v-beb16041]:hover{background:var(--hover);color:var(--text)}.worker-moment[data-v-661201ce]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-661201ce]{flex:none;color:var(--text-3);font-size:12px}.worktree[data-v-cee4d71e]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-cee4d71e]{flex:1;min-width:0}.worktree-holder[data-v-cee4d71e]{font-weight:500}.worktree-folder[data-v-cee4d71e]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-cee4d71e]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as c, computed as u, openBlock as l, createBlock as i, unref as n, withCtx as w, createElementVNode as d, createVNode as p, createTextVNode as k, toDisplayString as _ } from "vue";
import { useWindow as m, WindowRoom as v, Icon as f } from "@journal/window-kit";
import { _ as h } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
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
}, N = /* @__PURE__ */ h(g, [["__scopeId", "data-v-beb16041"]]);
export {
  N as default
};
