/* @code-commandments-generated */
if (!document.getElementById("window-styles-61d024f416fa")) { const style = document.createElement("style"); style.id = "window-styles-61d024f416fa"; style.textContent = ".worker-models[data-v-39e23a54]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-39e23a54]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-39e23a54]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-39e23a54]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-39e23a54]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-39e23a54]{display:flex;gap:8px;align-items:center}.number[data-v-878fda70]{color:var(--text-3);font-size:12px}.main[data-v-878fda70]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-878fda70]{color:var(--text-3);font-size:12px}.main[data-v-176788f1]{flex:1}.note[data-v-176788f1]{color:var(--text-3);font-size:12px}.worktree[data-v-a608a096]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-a608a096]{flex:1;min-width:0}.worktree-holder[data-v-a608a096]{font-weight:500}.worktree-folder[data-v-a608a096]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-a608a096]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as n, openBlock as f, createBlock as u, unref as p, withCtx as d, createVNode as _, createElementVNode as t, toDisplayString as s, createElementBlock as h, createCommentVNode as m } from "vue";
import { useWindow as k, WindowRoom as v, RowList as w } from "@journal/window-kit";
import { _ as x } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const g = { class: "number" }, y = { class: "main" }, b = { class: "note" }, B = {
  key: 0,
  class: "note"
}, N = {
  __name: "Points",
  setup(V) {
    const a = k(), r = n([]), l = n(""), i = n(!1);
    async function c() {
      const o = await a.read(`worker-worktree points --agent ${a.agent}`);
      l.value = o.ok ? "" : o.error, r.value = o.ok ? o.value.points : [], i.value = !0;
    }
    return a.follow(["proof.*", "worker_worktree.*"], c), c(), (o, $) => (f(), u(p(v), null, {
      default: d(() => [
        _(p(w), {
          rows: r.value,
          failure: l.value,
          loaded: i.value,
          empty: "This agent has no task brief to prove",
          hint: "The points of the brief of the task it was given show here, each with its proof."
        }, {
          default: d(({ row: e }) => [
            t("span", g, s(e.id), 1),
            t("span", y, [
              t("span", null, s(e.text), 1),
              t("span", b, s(e.proof ? `${e.proof.state}: ${e.proof.text}` : "no proof yet"), 1),
              e.proof && e.proof.shortfall ? (f(), h("span", B, "missing: " + s(e.proof.shortfall), 1)) : m("", !0)
            ])
          ]),
          _: 1
        }, 8, ["rows", "failure", "loaded"])
      ]),
      _: 1
    }));
  }
}, R = /* @__PURE__ */ x(N, [["__scopeId", "data-v-878fda70"]]);
export {
  R as default
};
