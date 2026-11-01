/* @code-commandments-generated */
if (!document.getElementById("window-styles-4744398a2fa7")) { const style = document.createElement("style"); style.id = "window-styles-4744398a2fa7"; style.textContent = ".worker-models[data-v-0f463709]{display:flex;flex-direction:column;gap:8px}.worker-models-note[data-v-0f463709]{margin:0;color:var(--text-3);font-size:12px}.worker-models-refusal[data-v-0f463709]{margin:0;color:var(--danger);font-size:12.5px}.worker-model[data-v-0f463709]{display:flex;flex:1;gap:14px;align-items:center;padding:4px 0}.worker-model-program[data-v-0f463709]{flex:0 0 120px;color:var(--text-2);font-size:12px;font-weight:600}.worker-model-name[data-v-0f463709]{display:flex;gap:8px;align-items:center}.number[data-v-003ae4c2]{color:var(--text-3);font-size:12px}.main[data-v-003ae4c2]{display:flex;flex:1;flex-direction:column;gap:2px}.note[data-v-003ae4c2]{color:var(--text-3);font-size:12px}.main[data-v-d17dfe5e]{flex:1}.note[data-v-d17dfe5e]{color:var(--text-3);font-size:12px}.worktree[data-v-ae7a1c5d]{display:flex;flex:1;gap:8px;align-items:center;min-width:0;padding:8px 0}.worktree-names[data-v-ae7a1c5d]{flex:1;min-width:0}.worktree-holder[data-v-ae7a1c5d]{font-weight:500}.worktree-folder[data-v-ae7a1c5d]{margin:2px 0 0;color:var(--text-3);font-size:12px;overflow-wrap:anywhere}.worktree-refusal[data-v-ae7a1c5d]{margin:2px 0 0;color:var(--danger);font-size:12.5px}\n"; document.head.appendChild(style); }
import { ref as n, openBlock as p, createBlock as f, unref as _, withCtx as u, createElementVNode as t, toDisplayString as s, createElementBlock as d, createCommentVNode as m } from "vue";
import { useWindow as k, RowList as h } from "@journal/window-kit";
import { _ as v } from "./_plugin-vue_export-helper-CHgC5LLL.js";
const x = { class: "number" }, g = { class: "main" }, w = { class: "note" }, y = {
  key: 0,
  class: "note"
}, B = {
  __name: "Points",
  setup($) {
    const a = k(), r = n([]), l = n(""), c = n(!1);
    async function i() {
      const o = await a.read(`worker-worktree points --agent ${a.agent}`);
      l.value = o.ok ? "" : o.error, r.value = o.ok ? o.value.points : [], c.value = !0;
    }
    return a.follow(["proof.*", "worker_worktree.*"], i), i(), (o, b) => (p(), f(_(h), {
      rows: r.value,
      failure: l.value,
      loaded: c.value,
      empty: "This agent has no task brief to prove"
    }, {
      default: u(({ row: e }) => [
        t("span", x, s(e.id), 1),
        t("span", g, [
          t("span", null, s(e.text), 1),
          t("span", w, s(e.proof ? `${e.proof.state}: ${e.proof.text}` : "no proof yet"), 1),
          e.proof && e.proof.shortfall ? (p(), d("span", y, "missing: " + s(e.proof.shortfall), 1)) : m("", !0)
        ])
      ]),
      _: 1
    }, 8, ["rows", "failure", "loaded"]));
  }
}, P = /* @__PURE__ */ v(B, [["__scopeId", "data-v-003ae4c2"]]);
export {
  P as default
};
