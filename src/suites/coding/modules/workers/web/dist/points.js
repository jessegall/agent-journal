/* @code-commandments-generated */
if (!document.getElementById("window-styles-a4feb3648708")) { const style = document.createElement("style"); style.id = "window-styles-a4feb3648708"; style.textContent = ".worker-models[data-v-ea84e528]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-ea84e528]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-ea84e528]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-ea84e528]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-ea84e528]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-ea84e528]{display:flex;gap:8px;align-items:center}.plan-bar[data-v-f62e90bd]{position:relative;display:inline-flex;gap:8px;align-items:center;font-size:12.5px}.plan-bar-badge[data-v-f62e90bd]{padding:0 7px;border:1px solid var(--border-2);border-radius:99px;color:var(--progress);font-size:11px;line-height:18px}.plan-bar-title[data-v-f62e90bd],.plan-bar-delegation[data-v-f62e90bd],.plan-bar-agent[data-v-f62e90bd]{border:0;background:none;color:var(--text-2);font:inherit;cursor:pointer}.plan-bar-title[data-v-f62e90bd]{max-width:260px;padding:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.plan-bar-delegation[data-v-f62e90bd]{padding:0 8px;border:1px solid var(--border-2);border-radius:99px;line-height:20px}.plan-bar-popover[data-v-f62e90bd]{position:absolute;top:calc(100% + 6px);right:0;z-index:5;display:flex;flex-direction:column;gap:4px;min-width:260px;padding:10px 12px;border:1px solid var(--border);border-radius:10px;background:var(--raised);box-shadow:0 8px 24px #00000040}.plan-bar-head[data-v-f62e90bd]{margin:0 0 4px;color:var(--text-3);font-size:11.5px}.plan-bar-agent[data-v-f62e90bd]{display:flex;flex-direction:column;align-items:flex-start;padding:2px 0;text-align:left}.plan-bar-agent span[data-v-f62e90bd],.number[data-v-073d22f6]{color:var(--text-3);font-size:12px}.main[data-v-073d22f6]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-073d22f6]{color:var(--text-3);font-size:12px}.main[data-v-b360bbe9]{flex:1}.note[data-v-b360bbe9]{color:var(--text-3);font-size:12px}.workers-count[data-v-beb16041]{display:inline-flex;gap:5px;align-items:center;padding:2px 8px;border:0;border-radius:6px;background:none;color:var(--text-2);font:inherit;font-size:12.5px;font-variant-numeric:tabular-nums;cursor:pointer}.workers-count[data-v-beb16041]:hover{background:var(--hover);color:var(--text)}.worker-moment[data-v-661201ce]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-661201ce]{flex:none;color:var(--text-3);font-size:12px}.worktree[data-v-cee4d71e]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-cee4d71e]{flex:1;min-width:0}.worktree-holder[data-v-cee4d71e]{font-weight:500}.worktree-folder[data-v-cee4d71e]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-cee4d71e]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as n, openBlock as p, createBlock as u, unref as f, withCtx as d, createVNode as _, createElementVNode as t, toDisplayString as a, createElementBlock as m, createCommentVNode as h } from "vue";
import { useWindow as k, WindowRoom as v, RowList as x } from "@journal/window-kit";
import { _ as w } from "./_plugin-vue_export-helper-CHgC5LLL.mjs";
const g = { class: "number" }, y = { class: "main" }, B = { class: "note" }, N = {
  key: 0,
  class: "note"
}, V = {
  __name: "Points",
  setup($) {
    const s = k(), r = n([]), l = n(""), c = n(!1);
    async function i() {
      const o = await s.read(`worker-worktree points --agent ${s.agent}`);
      l.value = o.ok ? "" : o.error, r.value = o.ok ? o.value.points : [], c.value = !0;
    }
    return s.follow(["proof.*", "worker_worktree.*"], i), i(), (o, b) => (p(), u(f(v), null, {
      default: d(() => [
        _(f(x), {
          rows: r.value,
          failure: l.value,
          loaded: c.value,
          empty: "This agent has no task brief to prove",
          hint: "Task requirements and the evidence for each appear here."
        }, {
          default: d(({ row: e }) => [
            t("span", g, a(e.id), 1),
            t("span", y, [
              t("span", null, a(e.text), 1),
              t("span", B, a(e.proof ? `${e.proof.state}: ${e.proof.text}` : "no proof yet"), 1),
              e.proof && e.proof.shortfall ? (p(), m("span", N, "missing: " + a(e.proof.shortfall), 1)) : h("", !0)
            ])
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, R = /* @__PURE__ */ w(V, [["__scopeId", "data-v-073d22f6"]]);
export {
  R as default
};
