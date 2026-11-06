/* @code-commandments-generated */
if (!document.getElementById("window-styles-135d0eb77179")) { const style = document.createElement("style"); style.id = "window-styles-135d0eb77179"; style.textContent = ".worker-models[data-v-703d4f39]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-703d4f39]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-703d4f39]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-703d4f39]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-703d4f39]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-703d4f39]{display:flex;gap:8px;align-items:center}.number[data-v-ad3f073f]{color:var(--text-3);font-size:12px}.main[data-v-ad3f073f]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-ad3f073f]{color:var(--text-3);font-size:12px}.main[data-v-ef968966]{flex:1}.note[data-v-ef968966]{color:var(--text-3);font-size:12px}.worker-moment[data-v-4889fbf7]{display:flex;gap:10px;justify-content:space-between;width:100%;padding:6px 0;border:0;background:none;color:var(--text-2);font:inherit;font-size:13px;text-align:left;cursor:pointer}.worker-moment time[data-v-4889fbf7]{flex:none;color:var(--text-3);font-size:12px}.worker-tab-body[data-v-4596a516]{padding:14px 16px}.worktree[data-v-ca173274]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-ca173274]{flex:1;min-width:0}.worktree-holder[data-v-ca173274]{font-weight:500}.worktree-folder[data-v-ca173274]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-ca173274]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as n, openBlock as p, createBlock as u, unref as f, withCtx as d, createVNode as _, createElementVNode as t, toDisplayString as a, createElementBlock as m, createCommentVNode as h } from "vue";
import { useWindow as k, WindowRoom as v, RowList as x } from "@journal/window-kit";
import { _ as w } from "./_plugin-vue_export-helper-CHgC5LLL.js";
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
}, R = /* @__PURE__ */ w(V, [["__scopeId", "data-v-ad3f073f"]]);
export {
  R as default
};
